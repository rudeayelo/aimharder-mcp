import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { auth as authorizeSdk, Client, StreamableHTTPClientTransport, type OAuthClientProvider, type OAuthDiscoveryState, type StoredOAuthTokens } from '@modelcontextprotocol/client';
import type { Plugin } from 'esbuild';
import { buildWorker } from '../build.mjs';
import { brand } from '../src/brand.js';
import { brand as fixtureBrand } from './brand-fixture.js';
import { initializeTestRecovery } from './recovery-fixture.js';

// Names and hosts that earlier iterations showed to users. None may reach a user again.
const retired = /\bAimHarder MCP\b|\bAimHarder Connect\b|AIHarder|aiharder\.link|ahmcp\.link/i;
// Deployment identifiers, not brand text; they move with the live hosts in #142.
const deploymentHosts: Record<string, RegExp> = {
  'src/oauth-grants.ts': /^export const grantClaim = 'https:\/\/ahmcp\.link\/mcp-grant';$/,
  'scripts/smoke-test-environment.ts': /'https:\/\/pilot-test\.ahmcp\.link'/,
};
const origin = 'http://localhost:8787';
const brandSource = fileURLToPath(new URL('../src/brand.ts', import.meta.url));
const workers: Miniflare[] = [];
afterAll(async () => { await Promise.all(workers.map(worker => worker.dispose())); });

class ParticipantClient implements OAuthClientProvider {
  readonly redirectUrl = 'http://127.0.0.1:9999/callback';
  readonly clientMetadata = { redirect_uris: [this.redirectUrl], token_endpoint_auth_method: 'none' as const,
    grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], scope: 'openid profile offline_access mcp:access' };
  readonly expectedState = crypto.randomUUID();
  authorizationUrl?: URL; savedTokens?: StoredOAuthTokens; verifier = ''; discovery?: OAuthDiscoveryState;
  discoveryState = () => this.discovery;
  saveDiscoveryState = (state: OAuthDiscoveryState) => { this.discovery = state; };
  state = () => this.expectedState;
  clientInformation = () => ({ client_id: 'fixture-client', ...this.clientMetadata });
  tokens = () => this.savedTokens;
  saveTokens = (tokens: StoredOAuthTokens) => { this.savedTokens = tokens; };
  redirectToAuthorization = (url: URL) => { this.authorizationUrl = url; };
  saveCodeVerifier = (value: string) => { this.verifier = value; };
  codeVerifier = () => this.verifier;
}

/** Bundles the real Worker, optionally with another brand module, and collects what a participant sees. */
async function renderSurfaces(variant: string, brandModule?: string): Promise<Record<string, string>> {
  const plugins: Plugin[] = brandModule ? [{ name: 'brand-fixture', setup(build) {
    build.onResolve({ filter: /\/brand\.(js|ts)$/ }, args => resolve(args.resolveDir, args.path).replace(/\.js$/, '.ts') === brandSource ? { path: brandModule } : undefined);
  } }] : [];
  const script = `dist/brand-${variant}-worker.js`;
  await buildWorker('tests/mcp-auth-fixture-worker.ts', script, { plugins });
  const mail: { subject: string; text: string }[] = [];
  const worker: Miniflare = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: script,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB', 'RECOVERY_DB'],
    bindings: { RECOVERY_AUTHORITY_ID: 'synthetic-authority', AUTH_SECRET: 'synthetic-auth-secret-with-at-least-thirty-two-characters',
      BASE_URL: origin, MAIL_FROM: 'noreply@example.invalid', RESEND_API_KEY: 'synthetic-resend-key' },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      if (request.url === 'https://api.resend.com/emails') {
        mail.push(await request.json() as { subject: string; text: string });
        return Response.json({ id: 'synthetic-message' });
      }
      throw new Error('Unexpected external request');
    } }));
  workers.push(worker);
  await worker.ready; await initializeTestRecovery(worker);
  const database = await worker.getD1Database('AUTH_DB');
  for (const name of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
    await database.exec((await readFile(`migrations/${name}`, 'utf8')).replaceAll('\n', ' '));
  const fetch = ((input: RequestInfo | URL, init?: RequestInit) => worker.dispatchFetch(input as never, init as never)) as unknown as typeof globalThis.fetch;
  expect((await fetch(origin + '/__fixture')).status).toBe(200);
  const signIn = await fetch(origin + '/api/auth/sign-in/email', { method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'participant@example.invalid', password: 'synthetic-portal-password' }) });
  expect(signIn.status).toBe(200);
  const cookie = signIn.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const surfaces: Record<string, string> = {};
  const show = async (path: string, signedIn = false) => {
    const response = await fetch(origin + path, signedIn ? { headers: { cookie } } : {});
    expect(response.status, path).toBe(200);
    surfaces[`page ${path}${signedIn ? ' (signed in)' : ''}`] = await response.text();
  };
  for (const path of ['/', '/sign-in', '/accept-invitation?token=synthetic', '/recover']) await show(path);
  for (const path of ['/', '/account', '/aimharder', '/connections', '/connect-clients']) await show(path, true);

  // OAuth consent and the MCP server description, through the SDK a client uses.
  const sdk = new ParticipantClient();
  expect(await authorizeSdk(sdk, { serverUrl: origin + '/mcp', scope: sdk.clientMetadata.scope, fetchFn: fetch })).toBe('REDIRECT');
  const authorize = await fetch(sdk.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const consentUrl = new URL((await authorize.json() as { url: string }).url, origin);
  const consent = await fetch(consentUrl, { headers: { cookie } });
  expect(consent.status).toBe(200);
  surfaces['OAuth consent'] = await consent.text();
  const approved = await fetch(origin + '/portal/oauth/consent', { method: 'POST', redirect: 'manual',
    headers: { origin, cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ oauth_query: consentUrl.search.slice(1), accept: 'true' }) });
  expect(approved.status).toBe(303);
  const transport = new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: sdk, fetch });
  await transport.finishAuth(new URL(approved.headers.get('location')!).searchParams);
  const client = new Client({ name: 'synthetic-brand-check', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: sdk, fetch }));
  surfaces['MCP server info'] = JSON.stringify({ server: client.getServerVersion(), instructions: client.getInstructions(), tools: (await client.listTools()).tools });
  await client.close();

  // Emails: a password reset for the participant and an invitation sent by an administrator.
  expect((await fetch(origin + '/api/auth/request-password-reset', { method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'participant@example.invalid', redirectTo: origin + '/reset-password' }) })).status).toBe(200);
  await database.prepare("UPDATE portal_participant SET role='admin' WHERE userId='portal-fixture'").run();
  expect((await fetch(origin + '/api/portal/invitations', { method: 'POST', headers: { origin, cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'invitee@example.invalid' }) })).status).toBe(201);
  expect(mail).toHaveLength(2);
  for (const message of mail) surfaces[`email "${message.subject}"`] = `${message.subject}\n${message.text}`;
  return surfaces;
}

test('every user-facing surface shows the brand module and no retired name or host', async () => {
  const surfaces = await renderSurfaces('current');
  for (const [surface, text] of Object.entries(surfaces)) {
    expect(text, surface).toContain(brand.name);
    expect(text, surface).not.toMatch(retired);
  }
  expect(surfaces['page /']).toContain(brand.colors.primary);
}, 60_000);

test('changing the brand module changes every surface', async () => {
  const surfaces = await renderSurfaces('fixture', fileURLToPath(new URL('./brand-fixture.ts', import.meta.url)));
  for (const [surface, text] of Object.entries(surfaces)) {
    expect(text, surface).toContain(fixtureBrand.name);
    expect(text, surface).not.toContain(brand.name);
    expect(text.toLowerCase(), surface).not.toContain(brand.slug);
  }
  for (const color of Object.values(fixtureBrand.colors)) expect(surfaces['page /']).toContain(color);
  for (const color of Object.values(brand.colors)) expect(surfaces['page /']).not.toContain(color);
  expect(JSON.parse(surfaces['MCP server info']!).server).toMatchObject({ name: fixtureBrand.slug, title: fixtureBrand.name });
}, 60_000);

test('no hosted source outside the brand module names the product, its domain, support address or colors', async () => {
  const values = [brand.name, brand.domain, brand.supportEmail, ...Object.values(brand.colors)];
  const offenders: string[] = [];
  for (const directory of ['src', 'scripts']) for (const file of await readdir(directory, { recursive: true })) {
    const path = `${directory}/${file}`;
    if (!/\.(ts|mjs|js)$/.test(path) || path === 'src/brand.ts') continue;
    (await readFile(path, 'utf8')).split('\n').forEach((line, index) => {
      const lower = line.toLowerCase();
      if (values.some(value => lower.includes(value.toLowerCase()))) offenders.push(`${path}:${index + 1} hard-codes a brand value`);
      if (retired.test(line) && !deploymentHosts[path]?.test(line.trim())) offenders.push(`${path}:${index + 1} uses a retired name or host`);
    });
  }
  expect(offenders).toEqual([]);
});
