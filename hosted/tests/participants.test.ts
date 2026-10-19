import { initializeTestRecovery } from './recovery-fixture.js';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8807';
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let worker: Miniflare;
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let rejectA = false;
let interrupt:string|undefined;
let interruptSkip=0;
const unexpected: string[] = [];
let scheduled: {path:string;entered:()=>void;release:Promise<void>}|undefined;
function failOutbound(): never { unexpected.push('Unexpected outbound request'); throw new Error('Unexpected outbound request'); }
const requests: {url: URL; cookie: string}[] = [];
type QueryRequest = { url: string; headers: { get(name: string): string | null } };
let synthetic: (request: QueryRequest) => Promise<Response> | Response = () => { return failOutbound(); };
const profiles = new Map([
  ['upstream-a@example.invalid', { id: 42, cookie: 'synthetic-a', gyms: [{ role: 'client', gym: 'A gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
  ['upstream-b@example.invalid', { id: 73, cookie: 'synthetic-b', gyms: [{ role: 'client', gym: 'B gym', centre_url: 'shared-gym.aimharder.es', boid: 200 }] }],
]);
const portalCookies = new Map<string,string>();
function post(path: string, body: unknown, cookie = '', requestOrigin = origin) {
  return worker.dispatchFetch(origin + path, { method: 'POST', headers: { origin: requestOrigin, cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), redirect: 'manual' });
}
async function start(keys: Record<string,string> = {first:syntheticKey}, active = 'first') {
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/participants-fixture-worker.js', port: 8807,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(new URL(request.url).origin==='https://synthetic-scheduler.invalid'){if(scheduled?.path===new URL(request.url).pathname){scheduled.entered();await scheduled.release;}const matches=new URL(request.url).pathname===interrupt;const hit=matches&&interruptSkip--<=0;if(hit){interrupt=undefined;interruptSkip=0;}return new Response(null,{status:hit?503:204});}
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
        return Response.json({ data: [{ id: profile.id, roles: profile.gyms }] });
      }

      requests.push({url:new URL(request.url),cookie:request.headers.get('cookie') ?? ''});
      return synthetic(request);
    },
  }));
  await worker.ready; await initializeTestRecovery(worker);
}
const verifier = 'synthetic-account-verifier-more-than-forty-three-characters';
async function code(cookie:string,clientId='fixture-client',schedule?:string) {
 const challenge=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))).toString('base64url');
 const query=new URLSearchParams({client_id:clientId,redirect_uri:'http://127.0.0.1:9999/callback',response_type:'code',code_challenge:challenge,code_challenge_method:'S256',scope:'openid profile offline_access mcp:access',state:'synthetic-state',resource:origin+'/mcp',prompt:'consent'});
 const authorize=await worker.dispatchFetch(origin+'/api/auth/oauth2/authorize?'+query,{headers:{cookie},redirect:'manual'});
 expect(authorize.status).toBe(200);
 const url=new URL((await authorize.json() as {url:string}).url,origin);
 const consent=await worker.dispatchFetch(origin+'/api/auth/oauth2/consent',{method:'POST',headers:{origin,cookie,'content-type':'application/json',...(schedule?{'x-fixture-schedule':schedule}:{})},body:JSON.stringify({accept:true,oauth_query:url.search.slice(1)})});
 expect(consent.status).toBe(200);
 return new URL((await consent.json() as {url:string}).url).searchParams.get('code')!;
}
function exchange(code:string,clientId='fixture-client') {
 return worker.dispatchFetch(origin+'/api/auth/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',client_id:clientId,redirect_uri:'http://127.0.0.1:9999/callback',code,code_verifier:verifier,resource:origin+'/mcp'}).toString()});
}
async function tokens(cookie:string){const response=await exchange(await code(cookie));expect(response.status).toBe(200);return await response.json() as {access_token:string;refresh_token:string};}
async function token(cookie:string){return(await tokens(cookie)).access_token;}
async function sessionCookie(email:string){const response=await post('/api/auth/sign-in/email',{email,password:'synthetic-portal-password'});expect(response.status).toBe(200);return response.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');}
function probe(bearer:string){return worker.dispatchFetch(origin+'/mcp',{method:'POST',headers:{authorization:`Bearer ${bearer}`,'content-type':'application/json',accept:'application/json, text/event-stream','mcp-protocol-version':'2026-07-28'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list',params:{}})});}
function refresh(value:string){return worker.dispatchFetch(origin+'/api/auth/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',client_id:'fixture-client',refresh_token:value,resource:origin+'/mcp'}).toString()});}
async function call(cookie: string, name: string, args: Record<string, unknown> = {}) {
  const bearer = await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));

    return await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/participants-fixture-worker.ts', 'dist/participants-fixture-worker.js');
  directory = await mkdtemp(join(tmpdir(),'aimharder-suspension-synthetic-'));
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


test('only the administrator can list minimal participant roles and configured connection status',async()=>{
 expect((await worker.dispatchFetch(origin+'/api/portal/participants')).status).toBe(401);
 expect((await worker.dispatchFetch(origin+'/api/portal/participants',{headers:{cookie:b()}})).status).toBe(403);
 const response=await worker.dispatchFetch(origin+'/api/portal/participants',{headers:{cookie:a()}});
 expect(response.status).toBe(200);
 expect(await response.json()).toEqual({participants:expect.arrayContaining([
  {userId:'portal-fixture',name:'Fixture Participant',email:'participant@example.invalid',role:'admin',status:'active',connectionStatus:'configured'},
  {userId:'other-participant',name:'Other Participant',email:'other@example.invalid',role:'user',status:'active',connectionStatus:'configured'},
 ])});
 const page=await worker.dispatchFetch(origin+'/admin/participants',{headers:{cookie:a()}});
 expect(page.status).toBe(200);const html=await page.text();expect(html).toContain('Suspend');expect(html).not.toContain('synthetic-upstream-password');expect(html).not.toContain('private-canary');
 expect((await worker.dispatchFetch(origin+'/admin/participants',{headers:{cookie:b()}})).status).toBe(403);
 expect(logins).toHaveLength(2);
});

test('suspension denies cached portal and MCP access across restart while reactivation retains configuration and requires fresh authorization',async()=>{
 const original=b();const old=await tokens(original);const pending=await code(original,'other-client');
 expect((await post('/api/portal/participants/portal-fixture/suspend',{},original)).status).toBe(403);
 expect((await post('/api/portal/participants/other-participant/suspend',{},a(),'https://attacker.invalid')).status).toBe(403);
 expect((await worker.dispatchFetch(origin+'/portal/participants/other-participant/suspend',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:'',redirect:'manual'})).status).toBe(303);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:original}})).status).toBe(401);
 expect(await (await worker.dispatchFetch(origin+'/api/auth/get-session',{headers:{cookie:original}})).json()).toBeNull();
 expect((await post('/api/auth/sign-in/email',{email:'other@example.invalid',password:'synthetic-portal-password'})).status).toBe(403);
 expect((await probe(old.access_token)).status).toBe(401);expect((await refresh(old.refresh_token)).status).toBe(400);
 await worker.dispose();await start();
 expect((await probe(old.access_token)).status).toBe(401);
 const suspended=await worker.dispatchFetch(origin+'/admin/participants',{headers:{cookie:a()}});expect(await suspended.text()).toContain('Reactivate');
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 expect((await probe(old.access_token)).status).toBe(401);expect((await refresh(old.refresh_token)).status).toBe(400);expect((await exchange(pending,'other-client')).status).toBe(400);
 const cookie=await sessionCookie('other@example.invalid');portalCookies.set('other@example.invalid',cookie);
 expect((await worker.dispatchFetch(origin+'/api/portal/connections',{headers:{cookie}})).status).toBe(200);
 const before=logins.length;expect((await call(cookie,'get_account_context')).structuredContent).toMatchObject({selectedGym:{id:'shared-gym'}});expect(logins.length).toBe(before+1);
 expect((await post('/api/portal/participants/portal-fixture/suspend',{},a())).status).toBe(409);
});
const target={date:'2026-10-25',className:'Metcon Ñ',startTime:'07:00',endTime:'08:00'};
let booked=new Set<string>();let writes:string[]=[];
function bookingSource(request:QueryRequest){
 const url=new URL(request.url);const cookie=request.headers.get('cookie')!;
 if(url.pathname==='/api/book'){writes.push(cookie);booked.add(cookie);return Response.json({bookState:1});}
 if(url.pathname==='/api/bookings')return Response.json(daily([session({bookState:booked.has(cookie)?1:null})]));
 if(url.pathname==='/api/nextBookings')return Response.json({nextClasses:[],history:[]});return failOutbound();
}
test('suspension commits during held preflight and invalidates every unused reference after fresh authorization',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const unused=(await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 const prepared=(await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/nextBookings'&&request.headers.get('cookie')==='amhrdrauth=synthetic-b'){entered();await held;}return bookingSource(request)};
 const pending=call(b(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true});await arrived;
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{id:'shared-gym'}});
 release();expect((await pending).isError).toBe(true);expect(writes).toHaveLength(0);
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 portalCookies.set('other@example.invalid',await sessionCookie('other@example.invalid'));synthetic=bookingSource;
 expect((await call(b(),'execute_booking_creation',{actionReference:unused.actionReference,confirmed:true})).isError).toBe(true);expect(writes).toHaveLength(0);
});

test('a possibly sent operation finishes fresh original-account read-back while suspended and only recovers without replay after restart',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const prepared=(await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/book'){entered();await held;}return bookingSource(request)};
 const pending=call(b(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true});await arrived;
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 const boundary=requests.length;release();expect((await pending).structuredContent).toMatchObject({status:'confirmed',target});
 expect(writes).toEqual(['amhrdrauth=synthetic-b']);expect(requests.slice(boundary).map(value=>({path:value.url.pathname,cookie:value.cookie}))).toEqual(expect.arrayContaining([{path:'/api/bookings',cookie:'amhrdrauth=synthetic-b'},{path:'/api/nextBookings',cookie:'amhrdrauth=synthetic-b'}]));
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{id:'shared-gym'}});
 await worker.dispose();await start();
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);portalCookies.set('other@example.invalid',await sessionCookie('other@example.invalid'));synthetic=bookingSource;
 expect((await call(b(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true})).structuredContent).toMatchObject({status:'confirmed',target});expect(writes).toEqual(['amhrdrauth=synthetic-b']);
 expect((await call(b(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true})).isError).toBe(true);
});

test('an issuer paused before storing a code cannot adopt the later reactivation generation',async()=>{
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 scheduled={path:'/code-write',entered,release:held};
 const pending=code(b(),'other-client','code-write');await arrived;
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 release();const stale=await pending;scheduled=undefined;
 expect((await exchange(stale,'other-client')).status).toBe(400);
 portalCookies.set('other@example.invalid',await sessionCookie('other@example.invalid'));
 expect((await call(b(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{id:'shared-gym'}});
});

test('authorization admission cannot combine an old portal session with a later active generation',async()=>{
 const challenge=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))).toString('base64url');
 const query=new URLSearchParams({client_id:'fixture-client',redirect_uri:'http://127.0.0.1:9999/callback',response_type:'code',code_challenge:challenge,code_challenge_method:'S256',scope:'openid profile offline_access mcp:access',state:'synthetic-state',resource:origin+'/mcp'});
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 scheduled={path:'/authorization-snapshot',entered,release:held};
 const pending=worker.dispatchFetch(origin+'/api/auth/oauth2/authorize?'+query,{headers:{cookie:b(),'x-fixture-schedule':'authorization-snapshot'},redirect:'manual'});await arrived;
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 release();expect((await pending).status).toBe(403);scheduled=undefined;
 portalCookies.set('other@example.invalid',await sessionCookie('other@example.invalid'));
 expect((await call(b(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{id:'shared-gym'}});
});
