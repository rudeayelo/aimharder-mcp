import { initializeTestRecovery } from './recovery-fixture.js';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8805';
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let worker: Miniflare;
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let rejectA = false;
const unexpected: string[] = [];
function failOutbound(): never { unexpected.push('Unexpected outbound request'); throw new Error('Unexpected outbound request'); }
const requests: {url: URL; cookie: string}[] = [];
type QueryRequest = { url: string; headers: { get(name: string): string | null } };
let synthetic: (request: QueryRequest) => Promise<Response> | Response = () => { return failOutbound(); };
const profiles = new Map([
  ['upstream-a@example.invalid', { id: 42, cookie: 'synthetic-a', gyms: [{ role: 'client', gym: 'A gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
  ['upstream-b@example.invalid', { id: 73, cookie: 'synthetic-b', gyms: [{ role: 'client', gym: 'B gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
]);
const passwords = new Map([...profiles.keys()].map(name=>[name,'synthetic-upstream-password']));
const portalCookies = new Map<string,string>();
function post(path: string, body: unknown, cookie = '', requestOrigin = origin) {
  return worker.dispatchFetch(origin + path, { method: 'POST', headers: { origin: requestOrigin, cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), redirect: 'manual' });
}
async function start(keys: Record<string,string> = {first:syntheticKey}, active = 'first') {
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/account-connection-fixture-worker.js', port: 8805,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if (new URL(request.url).origin === origin) return worker.dispatchFetch(request);
      if (request.url === 'https://login.aimharder.es/api/login' && request.method === 'POST') {
        const body = await request.json() as { username: string; password: string };
        logins.push(body.username);
        const profile = profiles.get(body.username);
        if (!profile || body.password !== passwords.get(body.username) || rejectA && profile.cookie === 'synthetic-a') return Response.json({ data: { auth: { authOK: false } } });
        return Response.json({ data: { userData: { id: profile.id }, auth: { authOK: true } } }, {
          headers: { 'set-cookie': `amhrdrauth=${profile.cookie}; Domain=.aimharder.es; Path=/; HttpOnly` },
        });
      }
      if (request.url === 'https://aimharder.es/api/whoami' && request.method === 'GET') {
        const cookie = request.headers.get('cookie')!;
        identities.push(cookie);
        const profile = [...profiles.values()].find(value => cookie === `amhrdrauth=${value.cookie}`);
        if (!profile) throw new Error('Unknown synthetic upstream cookie');
        return Response.json({ data: [{ id: profile.id, roles: profile.gyms }] });
      }

      requests.push({url:new URL(request.url),cookie:request.headers.get('cookie') ?? ''});
      return synthetic(request);
    },
  }));
  await worker.ready; await initializeTestRecovery(worker);
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
async function call(cookie: string, name: string, args: Record<string, unknown> = {}, bearer?: string) {
  bearer ??= await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));

    return await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
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
  for (const [email,username] of [['participant@example.invalid','upstream-a@example.invalid'],['other@example.invalid','upstream-b@example.invalid']]) {
    expect((await post('/api/portal/aimharder',{username,password:'synthetic-upstream-password',gymTimeZones:{'shared-gym':'Europe/Madrid'}},portalCookies.get(email!)!)).status).toBe(200);
  }
});
afterAll(async()=>{ await worker?.dispose(); if(directory)await rm(directory,{recursive:true,force:true}); });

const a = () => portalCookies.get('participant@example.invalid')!;
const b = () => portalCookies.get('other@example.invalid')!;
const session = (extra: Record<string,unknown> = {}) => ({id:501,time:'07:00 - 08:00',timeid:'0700_60',classId:10,className:'Metcon Ñ',ocupation:8,limit:20,limitc:20,enabled:1,resadmin:0,cancelledId:null,bookState:null,privateCoach:'private-canary',...extra});
const daily = (rows: unknown[] = [session()]) => ({clasesDisp:'Clases disponibles',day:'Source label',bookings:rows,timetable:[{id:'0700_60',time:'07:00 - 08:00'}],seminars:[]});
afterEach(()=>expect(unexpected.splice(0)).toEqual([]));
beforeEach(()=>{requests.length=0; synthetic=()=>{return failOutbound();};});


const target={date:'2026-10-25',className:'Metcon Ñ',startTime:'07:00',endTime:'08:00'};
let booked=new Set<string>();let writes:string[]=[];
function bookingSource(request:QueryRequest){
 const url=new URL(request.url);const cookie=request.headers.get('cookie')!;
 if(url.pathname==='/api/book'){writes.push(cookie);booked.add(cookie);return Response.json({bookState:1});}
 if(url.pathname==='/api/bookings')return Response.json(daily([session({bookState:booked.has(cookie)?1:null})]));
 if(url.pathname==='/api/nextBookings')return Response.json({nextClasses:[],history:[]});
 return failOutbound();
}
test('replacement verifies the new identity while preserving portal identity and an existing MCP authorization',async()=>{
 synthetic=bookingSource;booked=new Set();writes=[];
 const bearer=await token(a());
 const identity=await worker.dispatchFetch(origin+'/api/auth/get-session',{headers:{cookie:a()}}).then(r=>r.json());
 const rejected=await post('/api/portal/aimharder/replace',{username:'upstream-b@example.invalid',password:'invalid-synthetic-password'},a());
 expect(rejected.status).toBe(503);
 expect((await call(a(),'get_account_context',{},bearer)).structuredContent).toMatchObject({selectedGym:{name:'A gym'}});
 const page=await worker.dispatchFetch(origin+'/aimharder',{headers:{cookie:a()}}).then(r=>r.text());
 expect(page).toContain('action="/portal/aimharder/replace"');
 const replaced=await worker.dispatchFetch(origin+'/portal/aimharder/replace',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({username:'upstream-b@example.invalid',password:'synthetic-upstream-password','zone:shared-gym':'Europe/Madrid'}).toString(),redirect:'manual'});
 expect(replaced.status).toBe(303);
 expect((await call(a(),'get_account_context',{},bearer)).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
 const after=await worker.dispatchFetch(origin+'/api/auth/get-session',{headers:{cookie:a()}}).then(r=>r.json()) as {user:{id:string}};
 expect(after.user.id).toBe((identity as {user:{id:string}}).user.id);
 expect(writes).toEqual([]);
});

test('same-identity password updates retain authorization and gym settings, but reject identity drift',async()=>{
 synthetic=bookingSource;
 const bearer=await token(a());
 const credentials={username:'upstream-a@example.invalid',password:'synthetic-upstream-password',gymTimeZones:{'shared-gym':'Europe/London'}};
 expect((await post('/api/portal/aimharder/replace',credentials,a())).status).toBe(200);
 const prepared=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 passwords.set('upstream-a@example.invalid','synthetic-updated-password');
 profiles.get('upstream-a@example.invalid')!.id=99;
 const rejected=await post('/api/portal/aimharder/password',{password:'synthetic-updated-password'},a());
 expect(rejected.status).toBe(503);
 expect(await rejected.text()).toContain('IDENTITY_MISMATCH');
 profiles.get('upstream-a@example.invalid')!.id=42;
 const updated=await post('/api/portal/aimharder/password',{password:'synthetic-updated-password'},a());
 expect(updated.status).toBe(200);
 expect((await call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer)).isError).toBe(true);
 expect(writes).toEqual([]);
 expect((await call(a(),'get_account_context',{},bearer)).structuredContent).toMatchObject({selectedGym:{name:'A gym',timeZone:'Europe/London',timeZoneStatus:'user-confirmed'}});
 await worker.dispose();await start();
 expect((await call(a(),'get_account_context',{},bearer)).structuredContent).toMatchObject({selectedGym:{name:'A gym',timeZone:'Europe/London'}});
});

test('an expired upstream password still leaves repair and disconnection controls available without showing credentials',async()=>{
 await worker.dispose();await start();
 passwords.set('upstream-a@example.invalid','synthetic-later-password');
 const html=await worker.dispatchFetch(origin+'/aimharder',{headers:{cookie:a()}}).then(r=>r.text());
 expect(html).toContain('authentication-required');
 expect(html).toContain('action="/portal/aimharder/password"');
 expect(html).toContain('action="/portal/aimharder/replace"');
 expect(html).toContain('action="/portal/aimharder/disconnect"');
 for(const secret of ['upstream-a@example.invalid','synthetic-updated-password','synthetic-later-password'])expect(html).not.toContain(secret);
 expect((await post('/api/portal/aimharder/password',{password:'synthetic-later-password'},a())).status).toBe(200);
});

test('replacement queued behind held preflight finishes only on the original account and invalidates every old preparation',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const bearer=await token(a());
 const prepared=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 const unused=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;
 const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/nextBookings'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return bookingSource(request);};
 const execution=call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer);
 await arrived;
 let changed=false;
 const replacing=post('/api/portal/aimharder/replace',{username:'upstream-b@example.invalid',password:'synthetic-upstream-password',gymTimeZones:{'shared-gym':'Europe/Madrid'}},a()).then(response=>{changed=true;return response;});
 expect((await call(b(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
 expect(changed).toBe(false);
 release();
 expect((await execution).structuredContent).toMatchObject({status:'confirmed',gym:{name:'A gym'}});
 expect((await replacing).status).toBe(200);
 expect(writes).toEqual(['amhrdrauth=synthetic-a']);
 expect((await call(a(),'execute_booking_creation',{actionReference:unused.actionReference,confirmed:true},bearer)).isError).toBe(true);
 expect((await call(a(),'get_account_context',{},bearer)).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
 await worker.dispose();await start();
 requests.length=0;
 const recovered=await call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer);
 expect(recovered.structuredContent).toMatchObject({status:'uncertain',gym:{name:'A gym'}});
 expect(requests).toEqual([]);
 expect(writes).toHaveLength(1);
});

test('disconnect waits for original-account sent-write read-back, removes access across restart and never replays or restores credentials',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 expect((await post('/api/portal/aimharder/replace',{username:'upstream-a@example.invalid',password:'synthetic-later-password',gymTimeZones:{'shared-gym':'Europe/Madrid'}},a())).status).toBe(200);
 const bearer=await token(a());
 const prepared=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 const unused=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;
 const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{const response=bookingSource(request);if(new URL(request.url).pathname==='/api/book'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return response;};
 const execution=call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer);await arrived;
 let changed=false;
 const disconnecting=post('/api/portal/aimharder/disconnect',{},a()).then(response=>{changed=true;return response;});
 expect((await call(b(),'get_account_context')).isError).not.toBe(true);
 expect(changed).toBe(false);
 release();
 expect((await execution).structuredContent).toMatchObject({status:'confirmed',gym:{name:'A gym'}});
 expect(await (await disconnecting).json()).toEqual({status:'not-connected'});
 await worker.dispose();await start();
 const before=logins.length+identities.length;requests.length=0;
 expect(JSON.stringify(await call(a(),'get_account_context',{},bearer))).toContain('not-connected');
 expect(JSON.stringify(await call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer))).toContain('ACTION_OUTCOME_UNCERTAIN');
 expect(JSON.stringify(await call(a(),'execute_booking_creation',{actionReference:unused.actionReference,confirmed:true},bearer))).toContain('not-connected');
 expect(logins.length+identities.length).toBe(before);expect(requests).toEqual([]);
 expect(writes).toEqual(['amhrdrauth=synthetic-a']);
 expect((await worker.dispatchFetch(origin+'/api/portal/connections',{headers:{cookie:a()}})).status).toBe(200);
});

test('replacement with multiple memberships retains the original until the browser selects a verified new default',async()=>{
 expect((await post('/api/portal/aimharder',{username:'upstream-a@example.invalid',password:'synthetic-later-password'},a())).status).toBe(200);
 profiles.get('upstream-b@example.invalid')!.gyms.push({role:'client',gym:'Second B gym',centre_url:'second-b.aimharder.es',boid:201});
 const browser=(body:Record<string,string>)=>worker.dispatchFetch(origin+'/portal/aimharder/replace',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body).toString(),redirect:'manual'});
 const missing=await browser({username:'upstream-b@example.invalid',password:'synthetic-upstream-password'});
 expect(missing.status).toBe(422);
 const html=await missing.text();
 expect(html).toContain('action="/portal/aimharder/replace"');
 expect(html).toContain('value="second-b"');expect(html).not.toContain('synthetic-upstream-password');
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'A gym'}});
 expect((await browser({username:'upstream-b@example.invalid',password:'synthetic-upstream-password',defaultGym:'second-b','zone:second-b':'Europe/London'})).status).toBe(303);
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'Second B gym',timeZone:'Europe/London'}});
});

test('connection lifecycle routes require the current owner session, same origin and strict owner-free input',async()=>{
 for(const path of ['/replace','/password','/disconnect']){
  expect((await post('/api/portal/aimharder'+path,{})).status).toBe(401);
  expect((await post('/api/portal/aimharder'+path,{},a(),'https://foreign.invalid')).status).toBe(403);
  expect((await worker.dispatchFetch(origin+'/api/portal/aimharder'+path,{headers:{cookie:a()}})).status).toBe(405);
 }
 expect((await post('/api/portal/aimharder/disconnect',{userId:'other-participant'},a())).status).toBe(400);
 expect((await post('/api/portal/aimharder/password',{password:'synthetic-canary',username:'upstream-a@example.invalid'},a())).status).toBe(400);
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'Second B gym'}});
 const browserDisconnect=await worker.dispatchFetch(origin+'/portal/aimharder/disconnect',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:'',redirect:'manual'});
 expect(browserDisconnect.status).toBe(303);
 expect(JSON.stringify(await call(a(),'get_account_context'))).toContain('not-connected');
});
