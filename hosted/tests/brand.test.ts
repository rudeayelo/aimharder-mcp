import { execFile } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { auth as authorizeSdk, Client, StreamableHTTPClientTransport, type OAuthClientProvider, type OAuthDiscoveryState, type StoredOAuthTokens } from '@modelcontextprotocol/client';
import { build, type Plugin } from 'esbuild';
import { buildWorker } from '../build.mjs';
import { brand, type Brand } from '../src/brand.js';
import { brand as fixtureBrand } from './brand-fixture.js';
import { initializeTestRecovery } from './recovery-fixture.js';

// Names and hosts that earlier iterations showed to users. None may reach a user again.
const retired = /\bAimHarder MCP\b|\bAimHarder Connect\b|AIHarder|aiharder\.link|ahmcp\.link|aimharder-mcp-hosted/i;
// Deployment identifiers, not brand text; they move with the live hosts in #142.
// Only these exact tokens are exempt; anything else on the same line is still checked.
const deploymentTokens: Record<string, string[]> = {
  'src/oauth-grants.ts': ["'https://ahmcp.link/mcp-grant'"],
  'scripts/smoke-test-environment.ts': ["'https://pilot-test.ahmcp.link'"],
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

function brandSwap(brandModule?: string): Plugin[] {
  return brandModule ? [{ name: 'brand-fixture', setup(build) {
    build.onResolve({ filter: /\/brand\.(js|ts)$/ }, args => resolve(args.resolveDir, args.path).replace(/\.js$/, '.ts') === brandSource ? { path: brandModule } : undefined);
  } }] : [];
}
const fixtureModule = fileURLToPath(new URL('./brand-fixture.ts', import.meta.url));

type Mail = { to: string; subject: string; text: string };
type Surfaces = { pages: Record<string, string>; server: unknown; resourceLabel: string | undefined; mail: Mail[] };

/** Bundles the real Worker, optionally with another brand module, and walks what a participant sees. */
async function renderSurfaces(variant: string, brandModule?: string): Promise<Surfaces> {
  const script = `dist/brand-${variant}-worker.js`;
  await buildWorker('tests/mcp-auth-fixture-worker.ts', script, { plugins: brandSwap(brandModule) });
  const mail: Mail[] = [];
  const worker: Miniflare = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: script,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB', 'RECOVERY_DB'],
    bindings: { RECOVERY_AUTHORITY_ID: 'synthetic-authority', AUTH_SECRET: 'synthetic-auth-secret-with-at-least-thirty-two-characters',
      BASE_URL: origin, MAIL_FROM: 'noreply@example.invalid', RESEND_API_KEY: 'synthetic-resend-key' },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      if (request.url === 'https://api.resend.com/emails') {
        const message = await request.json() as { to: string[]; subject: string; text: string };
        mail.push({ to: message.to[0]!, subject: message.subject, text: message.text });
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
  const post = (path: string, body: unknown, headers: Record<string, string> = {}) => fetch(origin + path, { method: 'POST',
    headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
  expect((await fetch(origin + '/__fixture')).status).toBe(200);
  const signIn = await post('/api/auth/sign-in/email', { email: 'participant@example.invalid', password: 'synthetic-portal-password' });
  expect(signIn.status).toBe(200);
  const cookie = signIn.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const pages: Record<string, string> = {};
  for (const [path, signedIn] of [['/', false], ['/sign-in', false], ['/accept-invitation?token=synthetic', false], ['/recover', false],
    ['/', true], ['/account', true], ['/aimharder', true], ['/connections', true], ['/connect-clients', true]] as const) {
    const response = await fetch(origin + path, signedIn ? { headers: { cookie } } : {});
    expect(response.status, path).toBe(200);
    pages[`${path}${signedIn ? ' (signed in)' : ''}`] = await response.text();
  }

  // OAuth consent and the MCP server description, through the SDK a client uses.
  const sdk = new ParticipantClient();
  expect(await authorizeSdk(sdk, { serverUrl: origin + '/mcp', scope: sdk.clientMetadata.scope, fetchFn: fetch })).toBe('REDIRECT');
  const authorize = await fetch(sdk.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const consentUrl = new URL((await authorize.json() as { url: string }).url, origin);
  const consentPage = await fetch(consentUrl, { headers: { cookie } });
  expect(consentPage.status).toBe(200);
  pages['/consent (signed in)'] = await consentPage.text();
  const approved = await fetch(origin + '/portal/oauth/consent', { method: 'POST', redirect: 'manual',
    headers: { origin, cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ oauth_query: consentUrl.search.slice(1), accept: 'true' }) });
  expect(approved.status).toBe(303);
  const transport = new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: sdk, fetch });
  await transport.finishAuth(new URL(approved.headers.get('location')!).searchParams);
  const client = new Client({ name: 'synthetic-brand-check', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: sdk, fetch }));
  const server = client.getServerVersion();
  await client.close();
  // The label Better Auth seeds for the MCP resource, as stored after real authorization traffic.
  const resourceLabel = (await database.prepare('SELECT name FROM oauthResource WHERE identifier=?').bind(origin + '/mcp').first<{ name: string }>())?.name;

  // Emails: an invitation from an administrator, the invitee's verification, and a password reset.
  await database.prepare("UPDATE portal_participant SET role='admin' WHERE userId='portal-fixture'").run();
  expect((await post('/api/portal/invitations', { email: 'invitee@example.invalid' }, { cookie })).status).toBe(201);
  const invitation = new URL(mail.find(message => message.to === 'invitee@example.invalid')!.text.match(/http\S+/)![0]!).searchParams.get('token')!;
  expect((await post('/api/auth/sign-up/email', { email: 'invitee@example.invalid', password: 'synthetic-invitee-password', name: 'Synthetic Invitee',
    callbackURL: origin + '/verification-result' }, { 'x-portal-invitation': invitation })).status).toBe(200);
  expect((await post('/api/auth/request-password-reset', { email: 'participant@example.invalid', redirectTo: origin + '/reset-password' })).status).toBe(200);
  expect(mail).toHaveLength(3);
  return { pages, server, resourceLabel, mail };
}

/** Runs the operator's offline client-registration script and returns the resource label its SQL would store. */
async function preparedResourceLabel(variant: string, brandModule?: string): Promise<string | undefined> {
  let entry = 'scripts/prepare-mcp-client.ts';
  if (brandModule) {
    entry = `dist/prepare-mcp-client-${variant}.mjs`;
    await build({ entryPoints: ['scripts/prepare-mcp-client.ts'], outfile: entry, bundle: true, platform: 'node', format: 'esm', packages: 'external', plugins: brandSwap(brandModule) });
  }
  const parent = await mkdtemp(join(tmpdir(), 'brand-client-'));
  try {
    await promisify(execFile)(process.execPath, [entry], { env: { PATH: process.env.PATH, MCP_CLIENT_KIND: 'hermes', BASE_URL: 'https://example.invalid',
      MCP_REDIRECT_URI: 'http://127.0.0.1:8765/callback', MCP_CLIENT_OUTPUT_DIR: join(parent, 'out') } });
    const sql = await readFile(join(parent, 'out', 'mcp-client.sql'), 'utf8');
    return /INSERT OR IGNORE INTO oauthResource \(id,identifier,name,allowedScopes\) VALUES \('[^']*','[^']*','((?:[^']|'')*)'/.exec(sql)?.[1]?.replaceAll("''", "'");
  } finally { await rm(parent, { recursive: true, force: true }); }
}

/** The declarations of the page's inline stylesheet, by selector and property. */
function styleRules(html: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {};
  for (const [, selectors, body] of (/<style>([^<]*)<\/style>/.exec(html)?.[1] ?? '').matchAll(/([^{}]+)\{([^}]*)\}/g))
    for (const selector of selectors!.split(',').map(item => item.trim()))
      for (const declaration of body!.split(';')) {
        const at = declaration.indexOf(':');
        if (at > 0) (rules[selector] ??= {})[declaration.slice(0, at).trim()] = declaration.slice(at + 1).trim();
      }
  return rules;
}

/** Each branded field on its own, so a single field that stops reading the module fails by name. */
function expectBranded(surfaces: Surfaces, b: Brand, other: Brand) {
  for (const [path, html] of Object.entries(surfaces.pages)) {
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
    if (path.startsWith('/ ') || path === '/') expect(title, `${path} title`).toBe(b.name);
    else expect(title, `${path} title`).toMatch(new RegExp(` · ${b.name}$`));
    expect(html, `${path} nav`).toContain(`<nav><a href="/">${b.name}</a></nav>`);
    const rules = styleRules(html);
    for (const [selector, property, value] of [['body', 'color', b.colors.ink], ['body', 'background', b.colors.surface],
      ['button', 'background', b.colors.primary], ['button', 'color', b.colors.onPrimary], ['a', 'color', b.colors.primary],
      ['.confirmation-switch input', 'background', b.colors.track], ['.confirmation-switch input', 'border', `1px solid ${b.colors.border}`],
      ['.confirmation-switch input::before', 'background', b.colors.thumb],
      ['.confirmation-switch input:checked', 'background', b.colors.primary], ['.confirmation-switch input:checked', 'border-color', b.colors.primary],
      ['.confirmation-switch input:focus-visible', 'outline', `3px solid ${b.colors.ink}`]] as const)
      expect(rules[selector]?.[property], `${path} ${selector} { ${property} }`).toBe(value);
    for (const color of Object.values(other.colors)) expect(html, `${path} colors`).not.toContain(color);
  }
  expect(surfaces.pages['/connect-clients (signed in)'], 'Hermes command').toContain(`<code>hermes mcp login ${b.slug}</code>`);
  expect(surfaces.pages['/consent (signed in)'], 'consent sentence').toContain(`requests access to your ${b.name} portal account.`);
  expect(surfaces.server, 'MCP server info').toMatchObject({ name: b.slug, title: b.name });
  expect(surfaces.resourceLabel, 'seeded OAuth resource label').toBe(b.name);
  const [invitation, verification] = surfaces.mail.filter(message => message.to === 'invitee@example.invalid');
  const recovery = surfaces.mail.find(message => message.to === 'participant@example.invalid');
  for (const [kind, message, subject] of [['invitation', invitation, `Your ${b.name} invitation`], ['verification', verification, `Verify your email for ${b.name}`],
    ['recovery', recovery, `Reset your ${b.name} password`]] as const) {
    expect(message, `${kind} email`).toBeDefined();
    expect(message!.subject, `${kind} email subject`).toBe(subject);
    expect(message!.text.trim().split('\n').at(-1), `${kind} email body sign-off`).toBe(b.name);
  }
  const everything = JSON.stringify(surfaces);
  expect(everything).not.toContain(other.name);
}

test('every user-facing field reads the brand module and shows no retired name or host', async () => {
  const surfaces = await renderSurfaces('current');
  expectBranded(surfaces, brand, fixtureBrand);
  expect(JSON.stringify(surfaces)).not.toMatch(retired);
  expect(await preparedResourceLabel('current'), 'offline script resource label').toBe(brand.name);
}, 60_000);

test('changing the brand module changes every field', async () => {
  const surfaces = await renderSurfaces('fixture', fixtureModule);
  expectBranded(surfaces, fixtureBrand, brand);
  expect(JSON.stringify(surfaces).toLowerCase()).not.toContain(brand.slug);
  expect(await preparedResourceLabel('fixture', fixtureModule), 'offline script resource label').toBe(fixtureBrand.name);
}, 60_000);

// Backstop only: the two tests above are the contract. This catches a retired name or a
// copied brand value typed whole into hosted source; it does not try to catch split strings.
test('no hosted source outside the brand module names the product, its domain, support address or colors', async () => {
  const values = [brand.name, brand.domain, brand.supportEmail, ...Object.values(brand.colors)];
  const offenders: string[] = [];
  for (const directory of ['src', 'scripts']) for (const file of await readdir(directory, { recursive: true })) {
    const path = `${directory}/${file}`;
    if (!/\.(ts|mjs|js)$/.test(path) || path === 'src/brand.ts') continue;
    (await readFile(path, 'utf8')).split('\n').forEach((line, index) => {
      const lower = line.toLowerCase();
      if (values.some(value => lower.includes(value.toLowerCase()))) offenders.push(`${path}:${index + 1} hard-codes a brand value`);
      const checked = (deploymentTokens[path] ?? []).reduce((rest, token) => rest.replaceAll(token, ''), line);
      if (retired.test(checked)) offenders.push(`${path}:${index + 1} uses a retired name or host`);
    });
  }
  expect(offenders).toEqual([]);
});
