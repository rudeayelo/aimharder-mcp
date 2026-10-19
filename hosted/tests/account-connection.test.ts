import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { spawn } from 'node:child_process';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8796';
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let worker: Miniflare;
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let holdIdentityA: Promise<void> | undefined;
let expireA = 0;
let rejectA = false;
const profiles = new Map([
  ['upstream-a@example.invalid', { id: 42, cookie: 'synthetic-a', gyms: [{ role: 'client', gym: 'A gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
  ['upstream-b@example.invalid', { id: 73, cookie: 'synthetic-b', gyms: [{ role: 'client', gym: 'B gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
]);
const portalCookies = new Map<string,string>();
function post(path: string, body: unknown, cookie = '', requestOrigin = origin) {
  return worker.dispatchFetch(origin + path, { method: 'POST', headers: { origin: requestOrigin, cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), redirect: 'manual' });
}
async function start(keys: Record<string,string> = {first:syntheticKey}, active = 'first') {
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/account-connection-fixture-worker.js', port: 8796,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      if (request.url === 'https://login.aimharder.es/api/login' && request.method === 'POST') {
        const body = await request.json() as { username: string; password: string };
        logins.push(body.username);
        const profile = profiles.get(body.username);
        if (!profile || body.password !== 'synthetic-upstream-password' || rejectA && profile.cookie === 'synthetic-a') return Response.json({ data: { auth: { authOK: false } } });
        return Response.json({ data: { userData: { id: profile.id }, auth: { authOK: true } } }, {
          headers: { 'set-cookie': `amhrdrauth=${profile.cookie}; Domain=.aimharder.es; Path=/; HttpOnly` },
        });
      }
      if (request.url === 'https://aimharder.es/api/whoami' && request.method === 'GET') {
        const cookie = request.headers.get('cookie')!;
        identities.push(cookie);
        const profile = [...profiles.values()].find(value => cookie === `amhrdrauth=${value.cookie}`);
        if (!profile) throw new Error('Unknown synthetic upstream cookie');
        if (profile.cookie === 'synthetic-a') {
          if (holdIdentityA) { const held = holdIdentityA; holdIdentityA = undefined; await held; }
          if (expireA > 0) { expireA--; return Response.json({data:[]}); }
        }
        return Response.json({ data: [{ id: profile.id, roles: profile.gyms }] });
      }
      throw new Error('Unexpected connection test upstream request');
    },
  }));
  await worker.ready;
}
async function token(cookie: string) {
  const verifier = 'synthetic-account-verifier-more-than-forty-three-characters';
  const challenge = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))).toString('base64url');
  const query = new URLSearchParams({ client_id: 'fixture-client', redirect_uri: 'http://127.0.0.1:9999/callback', response_type: 'code',
    code_challenge: challenge, code_challenge_method: 'S256', scope: 'openid profile offline_access mcp:access', state: 'synthetic-state', resource: origin+'/mcp', prompt: 'consent' });
  const authorize = await worker.dispatchFetch(origin + '/api/auth/oauth2/authorize?' + query, { headers: { cookie }, redirect: 'manual' });
  expect(authorize.status, await authorize.clone().text()).toBe(200);
  const url = new URL((await authorize.json() as {url: string}).url, origin);
  const consent = await post('/api/auth/oauth2/consent', { accept: true, oauth_query: url.search.slice(1) }, cookie);
  expect(consent.status).toBe(200);
  const callback = new URL((await consent.json() as {url: string}).url);
  const response = await worker.dispatchFetch(origin+'/api/auth/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', client_id: 'fixture-client', redirect_uri: 'http://127.0.0.1:9999/callback',
      code: callback.searchParams.get('code')!, code_verifier: verifier, resource: origin+'/mcp' }).toString() });
  expect(response.status).toBe(200);
  return (await response.json() as {access_token: string}).access_token;
}
async function context(cookie: string, gymId?: string) {
  const bearer = await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));
    expect((await client.listTools()).tools.map(tool=>tool.name)).toEqual(['get_account_context','get_class_sessions','get_upcoming_bookings','get_booking_history','get_published_workouts','get_exercise_rm_progression','find_exercise_1rm','get_exercise_1rm','get_personal_activity','prepare_activity_deletion','execute_activity_deletion','prepare_booking_creation','execute_booking_creation']);
    return await client.callTool({ name: 'get_account_context', arguments: gymId ? {gymId} : {} });
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/account-connection-fixture-worker.ts', 'dist/account-connection-fixture-worker.js');
  directory = await mkdtemp(join(tmpdir(),'aimharder-vault-synthetic-'));
  await start();
  const db = await worker.getD1Database('AUTH_DB');
  for (const file of (await readdir('migrations')).filter(name=>/^\d+.*\.sql$/.test(name)).sort())
    await db.exec((await readFile('migrations/'+file,'utf8')).replaceAll('\n',' '));
  expect((await worker.dispatchFetch(origin+'/__fixture')).status).toBe(200);
  for (const email of ['participant@example.invalid','other@example.invalid']) {
    const response = await post('/api/auth/sign-in/email', {email,password:'synthetic-portal-password'});
    expect(response.status).toBe(200);
    portalCookies.set(email,response.headers.getSetCookie().map(value=>value.split(';')[0]).join('; '));
  }
});
afterAll(async()=>{ await worker?.dispose(); if(directory)await rm(directory,{recursive:true,force:true}); });

test('an admitted participant connects a different upstream email and queries only their verified account through HTTP MCP', async () => {
  const cookie = portalCookies.get('participant@example.invalid')!;
  const connect = await post('/api/portal/aimharder', {username:'upstream-a@example.invalid',password:'synthetic-upstream-password'},cookie);
  expect(connect.status).toBe(200);
  expect(await connect.json()).toMatchObject({status:'connected',gyms:[{id:'shared-gym',name:'A gym',timeZoneStatus:'assumed'}]});
  const result = await context(cookie);
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toMatchObject({account:{authenticated:true},selectedGym:{id:'shared-gym',name:'A gym',timeZoneStatus:'assumed'}});
  for(const secret of ['upstream-a@example.invalid','synthetic-upstream-password','synthetic-a',syntheticKey]) expect(JSON.stringify(result)).not.toContain(secret);
  expect(logins).toEqual(['upstream-a@example.invalid']);
});

test('multiple verified gyms require an explicit default and preserve confirmed zones without borrowing another participant session', async () => {
  const cookie = portalCookies.get('other@example.invalid')!;
  profiles.get('upstream-b@example.invalid')!.gyms.push({ role:'client', gym:'Second gym', centre_url:'second-gym.aimharder.es', boid:201 });
  const credentials = {username:'upstream-b@example.invalid', password:'synthetic-upstream-password'};
  const missing = await post('/api/portal/aimharder', credentials, cookie);
  expect(missing.status).toBe(422);
  expect(await missing.json()).toMatchObject({status:'default-gym-required',gyms:[{id:'shared-gym',name:'B gym'},{id:'second-gym',name:'Second gym'}]});
  const connect = await post('/api/portal/aimharder', {...credentials,defaultGym:'second-gym',gymTimeZones:{'shared-gym':'America/New_York','second-gym':'Europe/London'}},cookie);
  expect(connect.status).toBe(200);
  const results = await Promise.all([context(portalCookies.get('participant@example.invalid')!),context(cookie),context(cookie,'shared-gym')]);
  expect(results[0]!.structuredContent).toMatchObject({selectedGym:{id:'shared-gym',name:'A gym',timeZone:'Europe/Madrid',timeZoneStatus:'assumed'}});
  expect(results[1]!.structuredContent).toMatchObject({selectedGym:{id:'second-gym',timeZone:'Europe/London',timeZoneStatus:'user-confirmed'}});
  expect(results[2]!.structuredContent).toMatchObject({selectedGym:{id:'shared-gym',name:'B gym',timeZone:'America/New_York',timeZoneStatus:'user-confirmed'}});
  expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Europe/Madrid'}},cookie)).status).toBe(200);
  expect((await context(cookie)).structuredContent).toMatchObject({selectedGym:{id:'shared-gym',name:'B gym',timeZone:'Europe/Madrid',timeZoneStatus:'user-confirmed'}});
});

test('browser settings expose verified gym choices and reject foreign origins, invalid zones and replacement without exposing credentials', async () => {
  const cookie = portalCookies.get('participant@example.invalid')!;
  expect((await post('/api/portal/aimharder',{})).status).toBe(401);
  expect((await post('/api/portal/aimharder',{},cookie,'https://attacker.invalid')).status).toBe(403);
  const before = logins.length;
  const replacement = await post('/api/portal/aimharder',{username:'upstream-b@example.invalid',password:'private-replacement-canary'},cookie);
  expect(replacement.status).toBe(409);
  expect(await replacement.text()).not.toContain('private-replacement-canary');
  expect(logins.length).toBe(before);
  expect((await post('/api/portal/aimharder/settings',{defaultGym:'foreign-gym',gymTimeZones:{}},cookie)).status).toBe(400);
  expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Not/AZone'}},cookie)).status).toBe(400);
  const page = await worker.dispatchFetch(origin+'/aimharder',{headers:{cookie}});
  const html = await page.text();
  expect(html).toContain('A gym');
  expect(html).toContain('action="/portal/aimharder/settings"');
  expect(html).toContain('name="zone:shared-gym"');
  expect(html).not.toContain('upstream-a@example.invalid');
  expect(html).not.toContain('synthetic-upstream-password');
});

test('a held account operation, bounded recovery and latched authentication failure do not interrupt another account', async () => {
  const a = portalCookies.get('participant@example.invalid')!;
  const b = portalCookies.get('other@example.invalid')!;
  let release!: () => void;
  holdIdentityA = new Promise<void>(resolve => { release = resolve; });
  const held = context(a);
  const independent = await Promise.race([context(b),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('Other account blocked')),2000))]);
  expect(independent.structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
  release();
  expect((await held).structuredContent).toMatchObject({selectedGym:{name:'A gym'}});
  const before = logins.filter(name=>name==='upstream-a@example.invalid').length;
  expireA = 1;
  expect((await context(a)).isError).not.toBe(true);
  expect(logins.filter(name=>name==='upstream-a@example.invalid').length).toBe(before+1);
  expireA = 2;
  expect(JSON.stringify(await context(a))).toContain('SESSION_EXPIRED');
  expect(logins.filter(name=>name==='upstream-a@example.invalid').length).toBe(before+2);
  rejectA = true;
  expect(JSON.stringify(await context(a))).toContain('AUTHENTICATION_FAILED');
  const afterFailure = logins.length;
  expect(JSON.stringify(await context(a))).toContain('AUTHENTICATION_FAILED');
  expect((await context(b)).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
  expect(logins.length).toBe(afterFailure);
  rejectA = false;
});

test('restart restores the encrypted connection but rejects a different upstream identity, a wrong key and copied ciphertext without upstream access', async () => {
  const a = portalCookies.get('participant@example.invalid')!;
  const b = portalCookies.get('other@example.invalid')!;
  await worker.dispose();
  await start();
  expect((await context(a)).structuredContent).toMatchObject({selectedGym:{name:'A gym'}});
  expect((await context(b)).structuredContent).toMatchObject({selectedGym:{name:'B gym',timeZoneStatus:'user-confirmed'}});
  await worker.dispose();
  profiles.get('upstream-a@example.invalid')!.id = 99;
  await start();
  expect(JSON.stringify(await context(a))).toContain('IDENTITY_MISMATCH');
  expect((await context(b)).isError).not.toBe(true);
  profiles.get('upstream-a@example.invalid')!.id = 42;
  await worker.dispose();
  await start({first:Buffer.alloc(32,22).toString('base64')});
  const before = logins.length + identities.length;
  expect((await context(a)).isError).toBe(true);
  expect(logins.length + identities.length).toBe(before);
  await worker.dispose();
  await start();
  // Isolated operator corruption/security exercise, distinct from public assertions.
  const db = await worker.getD1Database('AUTH_DB');
  const source = await db.prepare('SELECT revision,envelope FROM portal_aimharder_connection WHERE userId=?').bind('portal-fixture').first<{revision:string;envelope:string}>();
  const original = await db.prepare('SELECT revision,envelope FROM portal_aimharder_connection WHERE userId=?').bind('other-participant').first<{revision:string;envelope:string}>();
  await db.prepare('UPDATE portal_aimharder_connection SET revision=?,envelope=? WHERE userId=?').bind(source!.revision,source!.envelope,'other-participant').run();
  const beforeCopy = logins.length + identities.length;
  expect((await context(b)).isError).toBe(true);
  expect(logins.length + identities.length).toBe(beforeCopy);
  await db.prepare('UPDATE portal_aimharder_connection SET revision=?,envelope=? WHERE userId=?').bind(original!.revision,original!.envelope,'other-participant').run();
  expect((await context(b)).isError).not.toBe(true);
});

test('the trusted rotation command rewraps encrypted rows with compare-and-swap, then the escrowed active key recovers both accounts after restart', async () => {
  const db = await worker.getD1Database('AUTH_DB');
  // Separate operator security inspection; no plaintext dump is written.
  const rows = (await db.prepare('SELECT userId,revision,envelope FROM portal_aimharder_connection').all()).results;
  for (const canary of ['upstream-a@example.invalid','upstream-b@example.invalid','synthetic-upstream-password',syntheticKey]) expect(JSON.stringify(rows)).not.toContain(canary);
  const nextKey = Buffer.alloc(32,33).toString('base64');
  const command = spawn(process.execPath,['scripts/prepare-vault-rotation.ts'],{cwd:process.cwd(),env:{...process.env,VAULT_KEYS:JSON.stringify({first:syntheticKey,second:nextKey}),VAULT_ACTIVE_KEY_ID:'second'}});
  let output = ''; let errors = '';
  command.stdout.on('data', chunk=>{output+=String(chunk)});
  command.stderr.on('data', chunk=>{errors+=String(chunk)});
  command.stdin.end(JSON.stringify(rows));
  expect(await new Promise(resolve=>command.on('exit',resolve)),errors).toBe(0);
  for (const canary of ['upstream-a@example.invalid','synthetic-upstream-password',syntheticKey,nextKey]) expect(output+errors).not.toContain(canary);
  const prepared = JSON.parse(output) as {sql:string;rows:number;activeKeyId:string};
  expect(prepared).toMatchObject({rows:2,activeKeyId:'second'});
  await db.exec(prepared.sql);
  await worker.dispose();
  await start({first:syntheticKey,second:nextKey},'second');
  const currentDb = await worker.getD1Database('AUTH_DB');
  expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'UTC'}},portalCookies.get('participant@example.invalid')!)).status).toBe(200);
  // A stale maintenance artifact cannot overwrite a later envelope/configuration.
  await currentDb.exec(prepared.sql);
  await worker.dispose();
  await start({second:nextKey},'second');
  expect((await context(portalCookies.get('participant@example.invalid')!)).structuredContent).toMatchObject({selectedGym:{name:'A gym',timeZone:'UTC',timeZoneStatus:'user-confirmed'}});
  expect((await context(portalCookies.get('other@example.invalid')!)).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
  await worker.dispose();
  await start({},'second');
  const before = logins.length + identities.length;
  expect((await context(portalCookies.get('participant@example.invalid')!)).isError).toBe(true);
  expect(logins.length + identities.length).toBe(before);
});

test('membership changes leave verified choices available so the owner can repair a lost default through the browser without replacing credentials', async () => {
  const cookie = portalCookies.get('participant@example.invalid')!;
  profiles.get('upstream-a@example.invalid')!.gyms = [
    {role:'client',gym:'New membership',centre_url:'new-gym.aimharder.es',boid:200},
    {role:'client',gym:'Third membership',centre_url:'third-gym.aimharder.es',boid:201},
  ];
  await worker.dispose();
  await start({second:Buffer.alloc(32,33).toString('base64')},'second');
  expect(JSON.stringify(await context(cookie))).toContain('GYM_NOT_ACCESSIBLE');
  const status = await worker.dispatchFetch(origin+'/api/portal/aimharder',{headers:{cookie}});
  expect(status.status).toBe(200);
  expect(await status.json()).toMatchObject({status:'selection-required',gyms:[{id:'new-gym',name:'New membership'},{id:'third-gym',name:'Third membership'}]});
  const page = await worker.dispatchFetch(origin+'/aimharder',{headers:{cookie}});
  const html = await page.text();
  expect(html).toContain('action="/portal/aimharder/settings"');
  expect(html).toContain('value="new-gym"');
  expect(html).toContain('value="third-gym"');
  expect(html).toContain('Choose a default gym');
  expect(html).not.toContain('name="password"');
  expect(html).not.toContain('name="username"');
  expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{}},cookie)).status).toBe(400);
  const missing = await worker.dispatchFetch(origin+'/portal/aimharder/settings',{method:'POST',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},body:'defaultGym=',redirect:'manual'});
  expect(missing.status).toBe(422);
  const retry = await missing.text();
  expect(retry).toContain('action="/portal/aimharder/settings"');
  expect(retry).not.toContain('name="password"');
  expect(JSON.stringify(await context(cookie))).toContain('GYM_NOT_ACCESSIBLE');
  const repair = await worker.dispatchFetch(origin+'/portal/aimharder/settings',{method:'POST',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({defaultGym:'third-gym','zone:third-gym':'Europe/London','zone:new-gym':''}).toString(),redirect:'manual'});
  expect(repair.status).toBe(303);
  expect(repair.headers.get('location')).toBe('/aimharder');
  expect((await context(cookie)).structuredContent).toMatchObject({selectedGym:{id:'third-gym',name:'Third membership',timeZone:'Europe/London',timeZoneStatus:'user-confirmed'}});
  expect((await context(portalCookies.get('other@example.invalid')!)).structuredContent).toMatchObject({selectedGym:{id:'shared-gym',name:'B gym'}});
  expect((await post('/api/portal/aimharder',{username:'upstream-b@example.invalid',password:'private-replacement-canary'},cookie)).status).toBe(409);
});
