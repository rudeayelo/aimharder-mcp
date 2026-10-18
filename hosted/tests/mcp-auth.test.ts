import { createServer, type Server } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8793';
let worker: Miniflare;
let cookie = '';
let callbackServer: Server;
const pendingClients = new Map<string, ParticipantClient>();
beforeAll(async () => {
  await buildWorker('tests/mcp-auth-fixture-worker.ts', 'dist/mcp-auth-fixture-worker.js');
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/mcp-auth-fixture-worker.js',
    port: 8793, compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['AUTH_DB'], bindings: { AUTH_SECRET: 'synthetic-auth-secret-with-at-least-thirty-two-characters', BASE_URL: origin },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      throw new Error('Unexpected external request');
    },
  }));
  await worker.ready;
  callbackServer = createServer((request, response) => {
    void (async () => {
      const callback = new URL(request.url!, 'http://127.0.0.1:9999');
      const provider = pendingClients.get(callback.searchParams.get('state') ?? '');
      if (callback.pathname !== '/callback' || !provider) { response.writeHead(400).end(); return; }
      try {
        const transport = new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: provider });
        await transport.finishAuth(callback.searchParams);
        response.writeHead(200).end('Authorized');
      } catch { response.writeHead(400).end('Authorization rejected'); }
    })();
  });
  await new Promise<void>(resolve => callbackServer.listen(9999, '127.0.0.1', resolve));
  const database = await worker.getD1Database('AUTH_DB');
  for (const name of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
    await database.exec((await readFile(`migrations/${name}`, 'utf8')).replaceAll('\n', ' '));
  expect((await fetch(origin + '/__fixture')).status).toBe(200);
  const signIn = await fetch(origin + '/api/auth/sign-in/email', { method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'participant@example.invalid', password: 'synthetic-portal-password' }) });
  expect(signIn.status).toBe(200);
  cookie = signIn.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
});
afterAll(async () => { await worker?.dispose(); if (callbackServer) await new Promise<void>((resolve, reject) => callbackServer.close(error => error ? reject(error) : resolve())); });
test('a verified participant can inspect their connected clients without exposing tokens', async () => {
  const denied = await fetch(origin + '/api/portal/connections');
  expect(denied.status).toBe(401);
  const response = await fetch(origin + '/api/portal/connections', { headers: { cookie } });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ connections: [] });
});

import { auth as authorizeSdk, Client, StreamableHTTPClientTransport, type OAuthClientProvider, type StoredOAuthTokens, type OAuthDiscoveryState } from '@modelcontextprotocol/client';
class ParticipantClient implements OAuthClientProvider {
  constructor(readonly id = 'fixture-client') { pendingClients.set(this.expectedState, this); }
  readonly expectedState = crypto.randomUUID();
  readonly redirectUrl = 'http://127.0.0.1:9999/callback';
  readonly clientMetadata = { redirect_uris: [this.redirectUrl], token_endpoint_auth_method: 'none' as const,
    grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], scope: 'openid profile offline_access mcp:access' };
  authorizationUrl?: URL;
  savedTokens?: StoredOAuthTokens;
  verifier = '';
  discovery?: OAuthDiscoveryState;
  discoveryState = () => this.discovery;
  saveDiscoveryState = (state: OAuthDiscoveryState) => { this.discovery = state; };
  state = () => this.expectedState;
  clientInformation = () => ({ client_id: this.id, ...this.clientMetadata });
  tokens = () => this.savedTokens;
  saveTokens = (tokens: StoredOAuthTokens) => { this.savedTokens = tokens; };
  redirectToAuthorization = (url: URL) => { this.authorizationUrl = url; };
  saveCodeVerifier = (value: string) => { this.verifier = value; };
  codeVerifier = () => this.verifier;
}
const sdk = new ParticipantClient();
async function browserCallback(provider: ParticipantClient, accept = true) {
  const response = await fetch(provider.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  expect(response.status).toBe(200);
  const target = new URL((await response.json() as { url: string }).url, origin);
  expect(target.pathname).toBe('/consent');
  const screen = await fetch(target, { headers: { cookie } });
  expect(screen.status).toBe(200);
  const html = await screen.text();
  expect(html).toContain(provider.id === 'fixture-client' ? 'Synthetic MCP harness' : 'Other synthetic client');
  expect(html).toContain('Authorize');
  const consent = await fetch(origin + '/portal/oauth/consent', { method: 'POST', redirect: 'manual',
    headers: { origin, cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ oauth_query: target.search.slice(1), accept: String(accept) }) });
  expect(consent.status).toBe(303);
  return new URL(consent.headers.get('location')!);
}
test('SDK discovery, browser consent, PKCE callback, protected MCP and refresh work before AimHarder is connected', async () => {
  expect(await authorizeSdk(sdk, { serverUrl: origin + '/mcp', scope: sdk.clientMetadata.scope })).toBe('REDIRECT');
  expect(sdk.discovery?.resourceMetadata?.scopes_supported).toEqual(['mcp:access']);
  const callback = await browserCallback(sdk);
  expect(callback.origin).toBe('http://127.0.0.1:9999');
  expect(callback.searchParams.get('state')).toBe(sdk.state());
  expect((await fetch(callback)).status).toBe(200);
  expect(sdk.savedTokens?.access_token).toBeTruthy();
  const client = new Client({ name: 'synthetic-oauth-sdk', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: sdk }));
    expect((await client.listTools()).tools.map(tool => tool.name)).toEqual(['get_account_context']);
    const result = await client.callTool({ name: 'get_account_context', arguments: {} });
    expect(result).toMatchObject({ isError: true, content: [{ type: 'text', text: 'No AimHarder connection is configured for this portal account.' }] });
  } finally { await client.close(); }
  let requestedRefresh = false;
  expect(await authorizeSdk(sdk, { serverUrl: origin + '/mcp', fetchFn: async (input, init) => {
    if (String(input).endsWith('/oauth2/token')) requestedRefresh = String(init?.body).includes('grant_type=refresh_token');
    return fetch(input, init);
  } })).toBe('AUTHORIZED');
  expect(requestedRefresh).toBe(true);
  expect(sdk.savedTokens!.refresh_token).toBeTruthy();
});

async function grant(provider: ParticipantClient) {
  expect(await authorizeSdk(provider, { serverUrl: origin + '/mcp', scope: provider.clientMetadata.scope, forceReauthorization: true })).toBe('REDIRECT');
  provider.authorizationUrl!.searchParams.set('prompt', 'consent');
  const callback = await browserCallback(provider);
  expect(callback.searchParams.get('state')).toBe(provider.state());
  expect((await fetch(callback)).status).toBe(200);
}
function probe(token: string) {
  return fetch(origin + '/mcp', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2026-07-28' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) });
}
test('revoking one client immediately rejects its JWT and refresh while preserving the other client and portal identity', async () => {
  const other = new ParticipantClient('other-client');
  await grant(other);
  const before = await fetch(origin + '/api/portal/connections', { headers: { cookie } });
  expect(await before.json()).toEqual({ connections: expect.arrayContaining([
    { clientId: 'fixture-client', name: 'Synthetic MCP harness' }, { clientId: 'other-client', name: 'Other synthetic client' },
  ]) });
  const wrongOrigin = await fetch(origin + '/api/portal/connections/fixture-client/revoke', { method: 'POST', headers: { origin: 'https://attacker.invalid', cookie } });
  expect(wrongOrigin.status).toBe(403);
  const revoked = await fetch(origin + '/api/portal/connections/fixture-client/revoke', { method: 'POST', headers: { origin, cookie } });
  expect(revoked.status).toBe(204);
  expect((await probe(sdk.savedTokens!.access_token)).status).toBe(401);
  const refresh = await fetch(origin + '/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: sdk.id, refresh_token: sdk.savedTokens!.refresh_token!, resource: origin + '/mcp' }) });
  expect(refresh.status).toBe(400);
  const remainingClient = new Client({ name: 'remaining-client', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await remainingClient.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { requestInit: { headers: { authorization: `Bearer ${other.savedTokens!.access_token}` } } }));
    expect((await remainingClient.listTools()).tools.map(tool => tool.name)).toEqual(['get_account_context']);
  } finally { await remainingClient.close(); }
  const after = await fetch(origin + '/api/portal/connections', { headers: { cookie } });
  expect(await after.json()).toEqual({ connections: [{ clientId: 'other-client', name: 'Other synthetic client' }] });
  expect((await fetch(origin + '/', { headers: { cookie } })).status).toBe(200);
});

test('portal password login preserves the signed OAuth continuation without accepting an external return URL', async () => {
  const fresh = new ParticipantClient('other-client');
  await authorizeSdk(fresh, { serverUrl: origin + '/mcp', forceReauthorization: true });
  const authorization = await fetch(fresh.authorizationUrl!, { headers: { accept: 'application/json' }, redirect: 'manual' });
  const login = new URL((await authorization.json() as { url: string }).url, origin);
  expect(login.pathname).toBe('/sign-in');
  const screen = await fetch(login);
  expect(await screen.text()).toContain('name="oauth_query"');
  const response = await fetch(origin + '/portal/sign-in', { method: 'POST', redirect: 'manual',
    headers: { origin, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
      email: 'participant@example.invalid', password: 'synthetic-portal-password', oauth_query: login.search.slice(1), returnTo: 'https://attacker.invalid/' }) });
  expect(response.status).toBe(303);
  const next = new URL(response.headers.get('location')!, origin);
  expect(next.origin).toBe(origin);
  expect(next.pathname).toBe('/api/auth/oauth2/authorize');
  expect(next.searchParams.get('state')).toBe(fresh.state());
});

test('the real loopback callback rejects a mismatched state and SDK rejects a mismatched issuer', async () => {
  const fresh = new ParticipantClient('other-client');
  await authorizeSdk(fresh, { serverUrl: origin + '/mcp', forceReauthorization: true });
  expect((await fetch('http://127.0.0.1:9999/callback?code=synthetic-unused-code&state=foreign-state')).status).toBe(400);
  expect((await fetch('http://127.0.0.1:9999/callback?' + new URLSearchParams({ code: 'synthetic-unused-code', state: fresh.state(), iss: 'https://attacker.invalid' }))).status).toBe(400);
  expect(fresh.savedTokens).toBeUndefined();
});

test('tampered consent state, wrong resource and an invalid PKCE verifier cannot produce usable authorization', async () => {
  const fresh = new ParticipantClient('other-client');
  await authorizeSdk(fresh, { serverUrl: origin + '/mcp', forceReauthorization: true });
  const authorization = await fetch(fresh.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const target = new URL((await authorization.json() as { url: string }).url, origin);
  // Consent already exists, so request prompt=consent to obtain a signed screen.
  if (target.pathname !== '/consent') {
    fresh.authorizationUrl!.searchParams.set('prompt', 'consent');
  }
  const prompt = await fetch(fresh.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const signed = new URL((await prompt.json() as { url: string }).url, origin);
  const altered = new URLSearchParams(signed.search);
  altered.set('state', 'attacker-state');
  const tampered = await fetch(origin + '/portal/oauth/consent', { method: 'POST', redirect: 'manual',
    headers: { origin, cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ accept: 'true', oauth_query: altered.toString() }) });
  expect(tampered.status).toBeGreaterThanOrEqual(400);
  const codeUrl = new URL((await (await fetch(origin + '/api/auth/oauth2/consent', { method: 'POST', headers: { origin, cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ accept: true, oauth_query: signed.search.slice(1) }) })).json() as { url: string }).url);
  const tokenRequest = (resource: string, verifier: string) => fetch(origin + '/api/auth/oauth2/token', { method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
      grant_type: 'authorization_code', client_id: fresh.id, code: codeUrl.searchParams.get('code')!, code_verifier: verifier, redirect_uri: fresh.redirectUrl, resource }) });
  expect((await tokenRequest('https://attacker.invalid/mcp', fresh.verifier)).status).toBe(400);
  // Invalid resource consumes the one-time code. A separate valid authorization
  // is needed to test a bad verifier without relying on code replay.
  await authorizeSdk(fresh, { serverUrl: origin + '/mcp', forceReauthorization: true });
  const issued = await fetch(fresh.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const nextTarget = new URL((await issued.json() as { url: string }).url, origin);
  let nextCode = nextTarget.searchParams.get('code');
  if (nextTarget.pathname === '/consent') {
    const consentAgain = await fetch(origin + '/api/auth/oauth2/consent', { method: 'POST', headers: { origin, cookie, 'content-type': 'application/json' }, body: JSON.stringify({ accept: true, oauth_query: nextTarget.search.slice(1) }) });
    nextCode = new URL((await consentAgain.json() as { url: string }).url).searchParams.get('code');
  }
  expect(nextCode).toBeTruthy();
  const badVerifier = await fetch(origin + '/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
    grant_type: 'authorization_code', client_id: fresh.id, code: nextCode!, code_verifier: 'incorrect-code-verifier-with-at-least-forty-three-characters', redirect_uri: fresh.redirectUrl, resource: origin + '/mcp' }) });
  expect(badVerifier.status).toBe(400);
  expect((await probe('synthetic-invalid-token')).status).toBe(401);
});

test('an already signed token stops working when authoritative participant admission becomes inactive or unverified', async () => {
  const existing = new ParticipantClient('other-client');
  await grant(existing);
  const db = await worker.getD1Database('AUTH_DB');
  await db.prepare("UPDATE portal_participant SET status='suspended' WHERE userId='portal-fixture'").run();
  expect((await probe(existing.savedTokens!.access_token)).status).toBe(401);
  expect((await fetch(origin + '/api/portal/connections', { headers: { cookie } })).status).toBe(403);
  const refresh = await fetch(origin + '/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
    grant_type: 'refresh_token', client_id: existing.id, refresh_token: existing.savedTokens!.refresh_token!, resource: origin + '/mcp' }) });
  expect(refresh.status).toBe(400);
  await db.prepare("UPDATE portal_participant SET status='active' WHERE userId='portal-fixture'").run();
  await db.prepare("UPDATE user SET emailVerified=0 WHERE id='portal-fixture'").run();
  expect((await probe(existing.savedTokens!.access_token)).status).toBe(401);
  await db.prepare("UPDATE user SET emailVerified=1 WHERE id='portal-fixture'").run();
});

test('a concurrent refresh cannot revive a revoked client, and a fresh grant does not revive its previous JWT', async () => {
  const fresh = new ParticipantClient('fixture-client');
  await grant(fresh);
  expect((await probe(sdk.savedTokens!.access_token)).status).toBe(401);
  const oldAccess = fresh.savedTokens!.access_token;
  const [refresh, revoke] = await Promise.all([
    fetch(origin + '/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', client_id: fresh.id, refresh_token: fresh.savedTokens!.refresh_token!, resource: origin + '/mcp' }) }),
    fetch(origin + '/api/portal/connections/fixture-client/revoke', { method: 'POST', headers: { origin, cookie } }),
  ]);
  expect(revoke.status).toBe(204);
  expect((await probe(oldAccess)).status).toBe(401);
  expect([200, 400]).toContain(refresh.status);
  if (refresh.ok) {
    const tokens = await refresh.json() as { access_token: string; refresh_token: string };
    expect((await probe(tokens.access_token)).status).toBe(401);
    const retry = await fetch(origin + '/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', client_id: fresh.id, refresh_token: tokens.refresh_token, resource: origin + '/mcp' }) });
    expect(retry.status).toBe(400);
  }
});

test('client registration allows only the exact approved callback, including its loopback port', async () => {
  const fresh = new ParticipantClient('other-client');
  await authorizeSdk(fresh, { serverUrl: origin + '/mcp', forceReauthorization: true });
  fresh.authorizationUrl!.searchParams.set('redirect_uri', 'http://127.0.0.1:9988/callback');
  const response = await fetch(fresh.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  const result = await response.json() as { url?: string };
  if (result.url) {
    const target = new URL(result.url, origin);
    expect(target.searchParams.has('code')).toBe(false);
    expect(target.pathname).not.toBe('/consent');
    expect(target.searchParams.get('error')).toBeTruthy();
  } else expect(response.status).toBeGreaterThanOrEqual(400);
});
