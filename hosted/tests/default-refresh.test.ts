import { readFile, readdir } from 'node:fs/promises';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { auth as authorizeSdk, Client, StreamableHTTPClientTransport, type OAuthClientProvider, type StoredOAuthTokens, type OAuthDiscoveryState } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
import { initializeTestRecovery } from './recovery-fixture.js';

const origin = 'http://localhost:8793';
let worker: Miniflare;
let cookie = '';
beforeEach(async () => {
  await buildWorker('tests/default-refresh-fixture-worker.ts', 'dist/default-refresh-fixture-worker.js');
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true,
    scriptPath: 'dist/default-refresh-fixture-worker.js', port: 8793,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['AUTH_DB', 'RECOVERY_DB'], bindings: { RECOVERY_AUTHORITY_ID: 'synthetic-authority',
      AUTH_SECRET: 'synthetic-auth-secret-with-at-least-thirty-two-characters', BASE_URL: origin },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      throw new Error('Unexpected external request');
    },
  }));
  await worker.ready;
  await initializeTestRecovery(worker);
  const database = await worker.getD1Database('AUTH_DB');
  for (const name of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
    await database.exec((await readFile(`migrations/${name}`, 'utf8')).replaceAll('\n', ' '));
  expect((await fetch(origin + '/__fixture')).status).toBe(200);
  // Existing deployments already have the old resource policy and signed-out
  // online refresh rows. A provider upgrade must merge policy, never revive them.
  expect(await database.prepare('SELECT allowedScopes FROM oauthResource WHERE identifier=?').bind(origin + '/mcp').first('allowedScopes')).toBe('["mcp:access"]');
  await database.batch([
    database.prepare("INSERT INTO portal_mcp_grant (id,userId,clientId,revocationGeneration) VALUES ('old-online-grant','portal-fixture','fixture-client',0)"),
    database.prepare(`INSERT INTO oauthRefreshToken (id,token,clientId,userId,authorizationCodeId,expiresAt,createdAt,revoked,scopes)
      VALUES ('old-online-refresh','synthetic-old-token-digest','fixture-client','portal-fixture','old-online-grant',9999999999999,1,'2026-01-01T00:00:00.000Z','["mcp:access"]')`),
  ]);
  const response = await fetch(origin + '/api/auth/sign-in/email', { method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'participant@example.invalid', password: 'synthetic-portal-password' }) });
  expect(response.status).toBe(200);
  cookie = response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
});
afterEach(async () => { await worker?.dispose(); });

class PublicClient implements OAuthClientProvider {
  readonly redirectUrl = 'http://127.0.0.1:9999/callback';
  readonly clientMetadata = { redirect_uris: [this.redirectUrl], token_endpoint_auth_method: 'none' as const,
    grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], scope: 'openid profile offline_access mcp:access' };
  readonly expectedState = crypto.randomUUID();
  authorizationUrl?: URL;
  savedTokens?: StoredOAuthTokens;
  verifier = '';
  discovery?: OAuthDiscoveryState;
  state = () => this.expectedState;
  clientInformation = () => ({ client_id: 'fixture-client', ...this.clientMetadata });
  tokens = () => this.savedTokens;
  saveTokens = (tokens: StoredOAuthTokens) => { this.savedTokens = tokens; };
  redirectToAuthorization = (url: URL) => { this.authorizationUrl = url; };
  saveCodeVerifier = (value: string) => { this.verifier = value; };
  codeVerifier = () => this.verifier;
  discoveryState = () => this.discovery;
  saveDiscoveryState = (state: OAuthDiscoveryState) => { this.discovery = state; };
}

test.each([false, true])('a public grant refreshes after default access expiry with portal sign-out=%s', async signOut => {
  const client = new PublicClient();
  expect(await authorizeSdk(client, { serverUrl: origin + '/mcp', scope: client.clientMetadata.scope })).toBe('REDIRECT');
  const authorization = await fetch(client.authorizationUrl!, { headers: { cookie, accept: 'application/json' }, redirect: 'manual' });
  expect(authorization.status).toBe(200);
  const consentUrl = new URL((await authorization.json() as { url: string }).url, origin);
  expect(consentUrl.pathname).toBe('/consent');
  const consent = await fetch(origin + '/portal/oauth/consent', { method: 'POST', redirect: 'manual',
    headers: { origin, cookie, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ oauth_query: consentUrl.search.slice(1), accept: 'true' }) });
  expect(consent.status).toBe(303);
  const callback = new URL(consent.headers.get('location')!);
  expect(callback.origin + callback.pathname).toBe(client.redirectUrl);
  expect(callback.searchParams.get('state')).toBe(client.expectedState);
  await new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { authProvider: client }).finishAuth(callback.searchParams);
  const originalTokens = client.savedTokens!;
  const originalRefresh = originalTokens.refresh_token;
  expect(typeof originalRefresh).toBe('string');
  const claims = JSON.parse(Buffer.from(originalTokens.access_token.split('.')[1]!, 'base64url').toString()) as { iat: number; exp: number };
  expect(claims.exp - claims.iat).toBe(3_600);
  const database = await worker.getD1Database('AUTH_DB');
  const before = await database.prepare(`SELECT id,authorizationCodeId,
    CASE WHEN revoked IS NULL THEN 'null' ELSE typeof(revoked) END AS revokedCategory,
    CASE WHEN rotatedAt IS NULL THEN 'null' ELSE typeof(rotatedAt) END AS rotatedCategory
    FROM oauthRefreshToken WHERE userId='portal-fixture' AND clientId='fixture-client' AND id<>'old-online-refresh'`)
    .all<{ id: string; authorizationCodeId: string; revokedCategory: string; rotatedCategory: string }>();
  expect(before.results).toHaveLength(1);
  expect(before.results[0]!.revokedCategory).toBe('null');
  expect(before.results[0]!.rotatedCategory).toBe('null');
  const grant = before.results[0]!.authorizationCodeId;
  expect(JSON.parse((await database.prepare('SELECT allowedScopes FROM oauthResource WHERE identifier=?').bind(origin + '/mcp').first<string>('allowedScopes'))!))
    .toEqual(['mcp:access', 'offline_access']);
  expect(JSON.parse((await database.prepare('SELECT scopes FROM oauthRefreshToken WHERE id=?').bind(before.results[0]!.id).first<string>('scopes'))!))
    .toContain('offline_access');

  if (signOut) {
    const response = await fetch(origin + '/api/auth/sign-out', { method: 'POST',
      headers: { origin, cookie, 'content-type': 'application/json' }, body: '{}' });
    expect(response.status).toBe(200);
  }
  const beforeRefresh = await database.prepare(`SELECT
    CASE WHEN revoked IS NULL THEN 'null' ELSE typeof(revoked) END AS revokedCategory,
    CASE WHEN rotatedAt IS NULL THEN 'null' ELSE typeof(rotatedAt) END AS rotatedCategory
    FROM oauthRefreshToken WHERE userId='portal-fixture' AND clientId='fixture-client' AND id<>'old-online-refresh'`)
    .all<{ revokedCategory: string; rotatedCategory: string }>();
  // Advance only the disposable Worker clock, preserving maintained default lifetimes.
  const clock = await (await fetch(origin + '/__fixture/clock')).json() as { now: number };
  expect(clock.now / 1_000).toBeGreaterThan(claims.exp);
  const expired = await fetch(origin + '/mcp', { method: 'POST', headers: {
    authorization: `Bearer ${originalTokens.access_token}`, 'content-type': 'application/json',
    accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2026-07-28' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) });
  expect(expired.status).toBe(401);
  let requestedRefresh = false;
  expect(await authorizeSdk(client, { serverUrl: origin + '/mcp', fetchFn: async (input, init) => {
    if (String(input).endsWith('/oauth2/token')) requestedRefresh = String(init?.body).includes('grant_type=refresh_token');
    const response = await fetch(input, init);
    if (String(input).endsWith('/oauth2/token')) expect(response.status).toBe(200);
    return response;
  } })).toBe('AUTHORIZED');
  expect(requestedRefresh).toBe(true);
  const after = await database.prepare(`SELECT id,authorizationCodeId,
    CASE WHEN revoked IS NULL THEN 'null' ELSE typeof(revoked) END AS revokedCategory,
    CASE WHEN rotatedAt IS NULL THEN 'null' ELSE typeof(rotatedAt) END AS rotatedCategory
    FROM oauthRefreshToken WHERE userId='portal-fixture' AND clientId='fixture-client' AND id<>'old-online-refresh'`)
    .all<{ id: string; authorizationCodeId: string; revokedCategory: string; rotatedCategory: string }>();
  const currentGrants = await database.prepare('SELECT COUNT(*) AS count FROM portal_mcp_grant WHERE id=? AND revokedAt IS NULL').bind(grant).first('count');
  expect(beforeRefresh.results).toEqual([{ revokedCategory: 'null', rotatedCategory: 'null' }]);
  expect(currentGrants).toBe(1);
  expect(after.results).toHaveLength(2);
  expect(after.results.every(row => row.authorizationCodeId === grant)).toBe(true);
  expect(after.results.find(row => row.id === before.results[0]!.id)).toMatchObject({ revokedCategory: 'text', rotatedCategory: 'text' });
  expect(after.results.find(row => row.id !== before.results[0]!.id)).toMatchObject({ revokedCategory: 'null', rotatedCategory: 'null' });
  expect(client.savedTokens!.refresh_token !== originalRefresh).toBe(true);
  expect(await database.prepare("SELECT revoked FROM oauthRefreshToken WHERE id='old-online-refresh'").first('revoked')).toBe('2026-01-01T00:00:00.000Z');
  expect(await database.prepare("SELECT revokedAt FROM portal_mcp_grant WHERE id='old-online-grant'").first('revokedAt')).toBeNull();
  const mcp = new Client({ name: 'default-refresh-fixture', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await mcp.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), {
      requestInit: { headers: { authorization: `Bearer ${client.savedTokens!.access_token}` } },
    }));
    expect((await mcp.listTools()).tools.map(tool => tool.name)).toEqual(['get_account_context']);
    expect(await mcp.callTool({ name: 'get_account_context', arguments: {} })).toMatchObject({ isError: true,
      content: [{ type: 'text', text: 'No AimHarder connection is configured for this portal account.' }] });
  } finally { await mcp.close(); }
  const replay = () => fetch(origin + '/api/auth/oauth2/token', { method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
      grant_type: 'refresh_token', client_id: 'fixture-client', refresh_token: originalRefresh!, resource: origin + '/mcp' }) });
  const overlap = await replay();
  expect(overlap.status).toBe(200);
  const replayTokens = await overlap.json() as { access_token: string; refresh_token: string };
  expect(replayTokens.access_token === client.savedTokens!.access_token).toBe(true);
  expect(replayTokens.refresh_token === client.savedTokens!.refresh_token).toBe(true);
  expect((await fetch(origin + '/__fixture/clock?after-overlap')).status).toBe(200);
  expect((await replay()).status).toBe(400);
  expect(await database.prepare("SELECT COUNT(*) AS count FROM oauthRefreshToken WHERE userId='portal-fixture' AND clientId='fixture-client'").first('count')).toBe(0);
});
