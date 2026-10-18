import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
let worker: Miniflare;
const upstream: string[] = [];
beforeAll(async () => {
  await buildWorker('tests/fixture-worker.ts', 'dist/fixture-worker.js');
  worker = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      scriptPath: 'dist/fixture-worker.js',
      compatibilityDate: '2026-10-12',
      compatibilityFlags: ['nodejs_compat'],
      outboundService: async (request) => {
        const url = new URL(request.url);
        if (url.origin === 'http://localhost:8787') return worker.dispatchFetch(request);
        upstream.push(`${request.method} ${request.url}`);
        if (request.url === 'https://login.aimharder.es/api/login' && request.method === 'POST') {
          const body = await request.json();
          expect(body).toMatchObject({
            username: 'upstream@example.invalid',
            password: 'synthetic-upstream-password',
          });
          return Response.json(
            { data: { userData: { id: 42 }, auth: { authOK: true } } },
            {
              headers: {
                'set-cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/; HttpOnly',
              },
            }
          );
        }
        if (request.url === 'https://aimharder.es/api/whoami' && request.method === 'GET') {
          expect(request.headers.get('cookie')).toBe('amhrdrauth=synthetic-cookie');
          return Response.json({
            data: [
              {
                id: 42,
                roles: [
                  { role: 'client', gym: 'Synthetic gym', centre_url: 'sample-gym.aimharder.es', boid: 200 },
                ],
              },
            ],
          });
        }
        throw new Error('Unexpected outbound request');
      },
      d1Databases: ['AUTH_DB'],
      bindings: {
        AUTH_SECRET: 'synthetic-local-auth-secret-at-least-32-characters',
        BASE_URL: 'http://localhost:8787',
      },
    })
  );
  await worker.ready;
  const database = await worker.getD1Database('AUTH_DB');
  for (const file of ['0001-auth.sql', '0002-invitations.sql'])
    await database.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
});
afterAll(async () => {
  await worker?.dispose();
});

test('unauthenticated MCP requests advertise maintained OAuth discovery without reaching upstream', async () => {
  const denied = await worker.dispatchFetch('http://localhost:8787/mcp', { method: 'POST' });
  expect(denied.status).toBe(401);
  expect(denied.headers.get('www-authenticate')).toContain('oauth-protected-resource');
  const metadata = await worker.dispatchFetch(
    'http://localhost:8787/.well-known/oauth-protected-resource/mcp'
  );
  expect(await metadata.json()).toMatchObject({
    resource: 'http://localhost:8787/mcp',
    authorization_servers: ['http://localhost:8787/api/auth'],
  });
});

test('a signed-in participant authorizes a PKCE client and queries their synthetic AimHarder account', async () => {
  const seed = await worker.dispatchFetch('http://localhost:8787/__fixture');
  expect(seed.status).toBe(200);
  const timing = (await seed.json()) as { hashMilliseconds: number };
  console.info(`Local workerd default scrypt hash: ${timing.hashMilliseconds.toFixed(1)}ms wall time`);
  const signInStart = performance.now();
  const signIn = await worker.dispatchFetch('http://localhost:8787/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:8787' },
    body: JSON.stringify({ email: 'participant@example.invalid', password: 'synthetic-portal-password' }),
  });
  expect(signIn.status).toBe(200);
  console.info(`Local workerd password sign-in: ${(performance.now() - signInStart).toFixed(1)}ms wall time`);
  const cookie = signIn.headers
    .getSetCookie()
    .map((item) => item.split(';')[0])
    .join('; ');
  const verifier = 'synthetic-code-verifier-at-least-forty-three-characters';
  const challenge = Buffer.from(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  ).toString('base64url');
  const query = new URLSearchParams({
    client_id: 'fixture-client',
    redirect_uri: 'http://127.0.0.1:9999/callback',
    response_type: 'code',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    scope: 'openid profile offline_access mcp:read',
    state: 'synthetic-state',
    resource: 'http://localhost:8787/mcp',
  });
  const authorize = await worker.dispatchFetch(`http://localhost:8787/api/auth/oauth2/authorize?${query}`, {
    headers: { cookie, accept: 'text/html' },
    redirect: 'manual',
  });
  expect(authorize.status).toBe(200);
  const consentUrl = new URL(((await authorize.json()) as { url: string }).url, 'http://localhost:8787');
  expect(consentUrl.pathname).toBe('/consent');
  const consent = await worker.dispatchFetch('http://localhost:8787/api/auth/oauth2/consent', {
    method: 'POST',
    headers: { cookie, origin: 'http://localhost:8787', 'content-type': 'application/json' },
    body: JSON.stringify({ accept: true, oauth_query: consentUrl.search.slice(1) }),
  });
  expect(consent.status).toBe(200);
  const consentResult = (await consent.json()) as { url: string };
  const callback = new URL(consentResult.url);
  expect(callback.searchParams.get('state')).toBe('synthetic-state');
  const code = callback.searchParams.get('code');
  expect(code).toBeTruthy();
  const tokenResponse = await worker.dispatchFetch('http://localhost:8787/api/auth/oauth2/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'fixture-client',
      redirect_uri: 'http://127.0.0.1:9999/callback',
      code: code!,
      code_verifier: verifier,
      resource: 'http://localhost:8787/mcp',
    }).toString(),
  });
  expect(tokenResponse.status).toBe(200);
  const tokens = (await tokenResponse.json()) as { access_token: string; refresh_token: string };
  expect(tokens.refresh_token).toBeTruthy();
  const client = new Client(
    { name: 'worker-feasibility-harness', version: '1.0.0' },
    { versionNegotiation: { mode: { pin: '2026-07-28' } } }
  );
  try {
    await client.connect(
      new StreamableHTTPClientTransport(new URL('/mcp', await worker.ready), {
        requestInit: { headers: { authorization: `Bearer ${tokens.access_token}` } },
      })
    );
    const result = await client.callTool({ name: 'get_account_context', arguments: {} });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toMatchObject({
      account: { authenticated: true },
      selectedGym: { id: 'sample-gym', name: 'Synthetic gym' },
    });
    for (const secret of ['synthetic-cookie', 'synthetic-upstream-password', 'upstream@example.invalid'])
      expect(JSON.stringify(result)).not.toContain(secret);
    expect(upstream).toEqual([
      'POST https://login.aimharder.es/api/login',
      'GET https://aimharder.es/api/whoami',
    ]);
  } finally {
    await client.close();
  }
});

test('unapproved client IDs and registration cannot fetch attacker-controlled metadata', async () => {
  const before = upstream.length;
  const discovery = await worker.dispatchFetch(
    'http://localhost:8787/.well-known/oauth-authorization-server/api/auth'
  );
  const metadata = (await discovery.json()) as Record<string, unknown>;
  expect(metadata.registration_endpoint).toBeUndefined();
  expect(metadata.client_id_metadata_document_supported).not.toBe(true);
  const registration = await worker.dispatchFetch('http://localhost:8787/api/auth/oauth2/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      redirect_uris: ['http://169.254.169.254/callback'],
      client_uri: 'http://169.254.169.254/metadata',
    }),
  });
  expect(registration.status).toBeGreaterThanOrEqual(400);
  const query = new URLSearchParams({
    client_id: 'https://attacker.invalid/client.json',
    response_type: 'code',
    redirect_uri: 'https://attacker.invalid/callback',
  });
  const authorization = await worker.dispatchFetch(
    `http://localhost:8787/api/auth/oauth2/authorize?${query}`,
    { redirect: 'manual' }
  );
  const denial = (await authorization.json()) as { url: string };
  const denialUrl = new URL(denial.url);
  expect(denialUrl.origin).toBe('http://localhost:8787');
  expect(denialUrl.searchParams.get('error')).toBe('invalid_client');
  const invalidBearer = await worker.dispatchFetch('http://localhost:8787/mcp', {
    method: 'POST',
    headers: { authorization: 'Bearer synthetic-invalid-token' },
  });
  expect(invalidBearer.status).toBe(401);
  expect(upstream).toHaveLength(before);
});
