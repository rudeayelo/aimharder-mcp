import { initializeTestRecovery } from './recovery-fixture.js';
import { spawn } from 'node:child_process';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8801';
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let worker: Miniflare;
let telemetryMode='success';
const batches:Array<{events:Array<{trace_id:string;duration_ms:number;context:Record<string,unknown>}>}>=[];
const warnings:string[]=[];
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let rejectA = false;
let interrupt:string|undefined;
let interruptSkip=0;
const unexpected: string[] = [];
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
  worker = new Miniflare(convertV4MiniflareOptions({ handleStructuredLogs:entry=>warnings.push(entry.message), modules: true, scriptPath: 'dist/booking-creation-fixture-worker.js', port: 8801,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { LOGNORTH_ENABLED:telemetryMode==='off'?'false':'true',LOGNORTH_URL:'https://telemetry.example.invalid',LOGNORTH_API_KEY:'lgn-'+ 'a'.repeat(64),LOGNORTH_ENVIRONMENT:'synthetic',LOGNORTH_RELEASE:'ticket99', RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(new URL(request.url).origin==='https://telemetry.example.invalid'){const batch=await request.json() as typeof batches[number];batches.push(batch);if(telemetryMode==='timeout')return new Promise<Response>(()=>{});return telemetryMode==='rejected'?new Response('PRIVATE ACK',{status:429}):Response.json({created:batch.events.length},{status:201});}
      if(new URL(request.url).origin==='https://synthetic-scheduler.invalid'){const matches=new URL(request.url).pathname===interrupt;const hit=matches&&interruptSkip--<=0;if(hit){interrupt=undefined;interruptSkip=0;}return new Response(null,{status:hit?503:204});}
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
async function call(cookie: string, name: string, args: Record<string, unknown> = {}) {
  const bearer = await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));

    return await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/booking-creation-fixture-worker.ts', 'dist/booking-creation-fixture-worker.js');
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
test('both roles preview the exact target and confirm once through real HTTP MCP; duplicate execution never sends twice',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 for(const cookie of [a(),b()]){
  const preparation=await call(cookie,'prepare_booking_creation',target);
  expect(preparation.isError).not.toBe(true);
  expect(preparation.structuredContent).toMatchObject({status:'ready',action:'create',target,gym:{id:'shared-gym',timeZoneStatus:'user-confirmed'}});
  const actionReference=(preparation.structuredContent as {actionReference:string}).actionReference;
  expect((await call(cookie,'execute_booking_creation',{actionReference,confirmed:false})).isError).toBe(true);
  const results=await Promise.all([call(cookie,'execute_booking_creation',{actionReference,confirmed:true}),call(cookie,'execute_booking_creation',{actionReference,confirmed:true})]);
  expect(results.filter(result=>result.structuredContent?.status==='confirmed')).toHaveLength(1);
  expect(results.filter(result=>result.isError)).toHaveLength(1);
 }
 expect(writes).toEqual(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);
});

test('account write-confirmation preference permits explicit writes without markers and preserves single use',async()=>{
 for(const cookie of [a(),b()])expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Europe/Madrid'},requireWriteConfirmation:false},cookie)).status).toBe(200);
 try {
 booked=new Set();writes=[];synthetic=bookingSource;
 for(const cookie of [a(),b()]){
  const preparation=await call(cookie,'prepare_booking_creation',target);
  expect(preparation.isError).not.toBe(true);
  expect(preparation.structuredContent).toMatchObject({status:'ready',action:'create',target,gym:{id:'shared-gym',timeZoneStatus:'user-confirmed'}});
  const actionReference=(preparation.structuredContent as {actionReference:string}).actionReference;
  expect((await call(cookie,'execute_booking_creation',{actionReference,confirmed:false})).isError).toBe(true);
  const results=await Promise.all([call(cookie,'execute_booking_creation',{actionReference}),call(cookie,'execute_booking_creation',{actionReference})]);
  expect(results.filter(result=>result.structuredContent?.status==='confirmed')).toHaveLength(1);
  expect(results.filter(result=>result.isError)).toHaveLength(1);
 }
 expect(writes).toEqual(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);
 } finally { for(const cookie of [a(),b()])expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Europe/Madrid'},requireWriteConfirmation:true},cookie)).status).toBe(200); }
});

test('enabling confirmations invalidates old preparations and omission cannot consume a new reference',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const settings={defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Europe/Madrid'}};
 expect((await post('/api/portal/aimharder/settings',{...settings,requireWriteConfirmation:false},a())).status).toBe(200);
 const old=await call(a(),'prepare_booking_creation',target);
 expect(old.structuredContent).toMatchObject({status:'ready',writeConfirmationRequired:false});
 expect((await post('/api/portal/aimharder/settings',{...settings,requireWriteConfirmation:true},a())).status).toBe(200);
 expect((await call(a(),'execute_booking_creation',{actionReference:old.structuredContent!.actionReference,confirmed:true})).isError).toBe(true);
 const fresh=await call(a(),'prepare_booking_creation',target);
 expect(fresh.structuredContent).toMatchObject({status:'ready',writeConfirmationRequired:true});
 const actionReference=fresh.structuredContent!.actionReference;
 const denied=await call(a(),'execute_booking_creation',{actionReference});
 expect(denied.isError).toBe(true);expect(JSON.stringify(denied)).toContain('WRITE_CONFIRMATION_REQUIRED');expect(writes).toHaveLength(0);
 expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 expect(writes).toHaveLength(1);
});

test('public MCP retains unused permission but releases it when ciphertext-only rewrap reconstructs the client',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const prepared=await call(a(),'prepare_booking_creation',{...target,gymId:'shared-gym'});
 expect(prepared.structuredContent).toMatchObject({status:'ready',currentState:'unbooked'});
 const reference=(prepared.structuredContent as {actionReference:string}).actionReference;
 expect(await(await worker.dispatchFetch(origin+'/__fixture/holds')).json()).toMatchObject({pending:1});
 expect((await worker.dispatchFetch(origin+'/__fixture/rewrap')).status).toBe(200);
 expect((await call(a(),'get_account_context')).isError).not.toBe(true);
 expect(await(await worker.dispatchFetch(origin+'/__fixture/holds')).json()).toMatchObject({pending:0});
 const rejected=await call(a(),'execute_booking_creation',{actionReference:reference,gymId:'shared-gym',confirmed:true});
 expect(rejected.isError).toBe(true);expect(JSON.stringify(rejected)).toContain('BOOKING_REFERENCE_INVALID');
 expect(writes).toHaveLength(0);
});

test('revoking the executing client during held preflight denies dispatch while another account remains independent',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const prepared=await call(a(),'prepare_booking_creation',target);
 const actionReference=(prepared.structuredContent as {actionReference:string}).actionReference;
 let release!:()=>void;let entered!:()=>void;
 const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/nextBookings'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return bookingSource(request)};
 const pending=call(a(),'execute_booking_creation',{actionReference,confirmed:true});
 await arrived;
 expect((await post('/api/portal/connections/fixture-client/revoke',{},a())).status).toBe(204);
 expect((await call(b(),'prepare_booking_creation',target)).structuredContent?.status).toBe('ready');
 release();
 const denied=await pending;expect(denied.isError).toBe(true);expect(writes).toHaveLength(0);
});

test('a persistent actor restart loses unused permission but reconciles a completed possibly-sent operation without another write',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const unused=(await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 const used=(await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 expect((await call(b(),'execute_booking_creation',{actionReference:used.actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();
 expect((await call(a(),'execute_booking_creation',{actionReference:unused.actionReference,confirmed:true})).isError).toBe(true);
 const recovered=await call(b(),'execute_booking_creation',{actionReference:used.actionReference,confirmed:true});
 expect(recovered.structuredContent).toMatchObject({status:'confirmed',target});
 expect(writes).toEqual(['amhrdrauth=synthetic-b']);
 expect((await call(b(),'execute_booking_creation',{actionReference:used.actionReference,confirmed:true})).isError).toBe(true);
});


test('expiry during held preflight consumes permission and prevents dispatch',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const preparation=(await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/nextBookings'){entered();await held;}return bookingSource(request)};
 const pending=call(a(),'execute_booking_creation',{actionReference:preparation.actionReference,confirmed:true});await arrived;
 await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});release();
 expect((await pending).isError).toBe(true);expect(writes).toHaveLength(0);
 expect((await call(a(),'execute_booking_creation',{actionReference:preparation.actionReference,confirmed:true})).isError).toBe(true);
});

test('foreign, wrong-gym, stale-revision and changed eligibility references cannot send a booking',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const prepare=async()=>((await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
 const foreign=await prepare();expect((await call(b(),'execute_booking_creation',{actionReference:foreign,confirmed:true})).isError).toBe(true);
 expect((await call(a(),'execute_booking_creation',{actionReference:foreign,confirmed:true})).structuredContent?.status).toBe('confirmed');
 booked.clear();writes=[];
 const wrong=await prepare();expect((await call(a(),'execute_booking_creation',{actionReference:wrong,gymId:'inaccessible-gym',confirmed:true})).isError).toBe(true);
 expect((await call(a(),'execute_booking_creation',{actionReference:wrong,confirmed:true})).isError).toBe(true);
 const stale=await prepare();expect((await post('/api/portal/aimharder/settings',{gymTimeZones:{'shared-gym':'Europe/Madrid'}},a())).status).toBe(200);
 expect((await call(a(),'execute_booking_creation',{actionReference:stale,confirmed:true})).isError).toBe(true);
 const changed=await prepare();synthetic=request=>new URL(request.url).pathname==='/api/bookings'?Response.json(daily([session({enabled:0})])):bookingSource(request);
 expect((await call(a(),'execute_booking_creation',{actionReference:changed,confirmed:true})).structuredContent?.status).toBe('stale');await expectObservation('execute_booking_creation','denied','BOOKING_STALE');expect(writes).toHaveLength(0);
});

test('interruptions before consumption, after consumption, after dispatch fence and after result never replay across persistent restart',async()=>{
 for(const [point,expectedWrites,status]of [
  ['/action/consumed/before',0,undefined],['/action/consumed/after',0,undefined],
  ['/action/possibly-sent/after',0,'uncertain'],['/action/finished/after',1,'confirmed'],
 ]as const){
  booked=new Set();writes=[];synthetic=bookingSource;
  const actionReference=((await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
  interrupt=point;
  const interrupted=await call(a(),'execute_booking_creation',{actionReference,confirmed:true});
  if(point==='/action/finished/after')expect(interrupted.structuredContent?.status).toBe('confirmed');else expect(interrupted.isError).toBe(true);expect(interrupt).toBeUndefined();
  await worker.dispose();await start();
  const recovered=await call(a(),'execute_booking_creation',{actionReference,confirmed:true});
  if(status)expect(recovered.structuredContent).toMatchObject({status,target});else expect(recovered.isError).toBe(true);
  expect(writes).toHaveLength(expectedWrites);
  expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).isError).toBe(true);
 }
});

test('transport loss, denial, waitlist and incomplete read-back preserve source uncertainty and one write',async()=>{
 for(const variant of ['lost-response','denied','waitlisted','incomplete','expired-response']as const){
  booked=new Set();writes=[];let sent=false;
  synthetic=request=>{
   const path=new URL(request.url).pathname;const cookie=request.headers.get('cookie')!;
   if(path==='/api/book'){
    writes.push(cookie);sent=true;if(variant!=='denied')booked.add(cookie);
    if(variant==='lost-response')throw new Error('Synthetic transport lost after send');
    if(variant==='expired-response')return new Response(null,{status:401});
    return Response.json(variant==='denied'?{bookState:-1}:{bookState:1});
   }
   if(sent&&variant==='incomplete')return new Response(null,{status:500});
   if(path==='/api/bookings')return Response.json(daily([session({bookState:booked.has(cookie)?variant==='waitlisted'?0:1:null})]));
   if(path==='/api/nextBookings')return Response.json({nextClasses:[],history:[]});return failOutbound();
  };
  const actionReference=((await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
  const result=await call(b(),'execute_booking_creation',{actionReference,confirmed:true});
  expect(result.structuredContent).toMatchObject({status:variant==='denied'?'rejected':variant==='waitlisted'?'waitlisted':variant==='incomplete'?'uncertain':'confirmed'});
  await expectObservation('execute_booking_creation',variant==='denied'||variant==='waitlisted'?'denied':variant==='incomplete'?'uncertain':'success',variant==='denied'?'BOOKING_REFUSED':variant==='waitlisted'?'BOOKING_WAITLISTED':variant==='incomplete'?'BOOKING_EFFECT_UNCONFIRMED':undefined);
  expect(writes).toEqual(['amhrdrauth=synthetic-b']);
  expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).isError).toBe(true);
  await worker.dispose();await start();
  expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe(variant==='denied'?'rejected':variant==='waitlisted'?'waitlisted':variant==='incomplete'?'uncertain':'confirmed');
  expect(writes).toHaveLength(1);
  if(variant==='denied'){booked.add('amhrdrauth=synthetic-b');await worker.dispose();await start();expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('uncertain');expect(writes).toHaveLength(1);}
 }
});

test('one held write does not block another account and restart recovery never reads a replacement identity',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const first=(await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 const second=(await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/book'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return bookingSource(request)};
 const pending=call(a(),'execute_booking_creation',{actionReference:first.actionReference,confirmed:true});await arrived;
 expect((await call(b(),'execute_booking_creation',{actionReference:second.actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');release();expect((await pending).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();
 profiles.get('upstream-a@example.invalid')!.id=99;
 try{
  const recovered=await call(a(),'execute_booking_creation',{actionReference:first.actionReference,confirmed:true});
  expect(recovered.structuredContent?.status).toBe('uncertain');expect(writes).toHaveLength(2);
 }finally{profiles.get('upstream-a@example.invalid')!.id=42;}
});


test('expired operation journals are purged by the trusted inventory gate without reconstructing permission',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const actionReference=((await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
 expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 const inventory=await worker.dispatchFetch(origin+'/__fixture/journal-inventory');
 expect(await inventory.json()).toMatchObject({pending:expect.any(Number),keyIds:['first']});
 await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'1201000'}});
 expect(await(await worker.dispatchFetch(origin+'/__fixture/journal-inventory')).json()).toEqual({pending:0,keyIds:[],latestExpiresAt:null});
 await worker.dispose();await start();
 expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).isError).toBe(true);expect(writes).toHaveLength(1);
});


test('trusted conditional rotation covers encrypted action facts and active-key-only restart recovers without plaintext or replay',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const actionReference=((await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
 expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 const db=await worker.getD1Database('AUTH_DB');
 const connections=(await db.prepare('SELECT userId,revision,envelope FROM portal_aimharder_connection').all()).results;
 const actions=(await db.prepare('SELECT userId,revision,referenceDigest,action,expires,facts FROM portal_action_journal').all()).results;
 const serialized=JSON.stringify({connections,actions});expect(serialized).not.toMatch(/upstream-[ab]@example|synthetic-upstream-password|Metcon|Europe\/Madrid/);
 const second=Buffer.alloc(32,29).toString('base64');
 const command=spawn(process.execPath,['scripts/prepare-vault-rotation.ts'],{cwd:process.cwd(),env:{...process.env,VAULT_KEYS:JSON.stringify({first:syntheticKey,second}),VAULT_ACTIVE_KEY_ID:'second'}});
 let output='';let errors='';command.stdout.on('data',chunk=>output+=String(chunk));command.stderr.on('data',chunk=>errors+=String(chunk));command.stdin.end(serialized);
 expect(await new Promise(resolve=>command.on('close',resolve))).toBe(0);expect(errors).toBe('');
 const prepared=JSON.parse(output) as {sql:string;actionRows:number;actionInventoryProvided:boolean};expect(prepared.actionRows).toBeGreaterThan(0);expect(prepared.actionInventoryProvided).toBe(true);
 expect(output).not.toMatch(/upstream-[ab]@example|synthetic-upstream-password|Metcon/);
 await db.exec(prepared.sql);
 expect((await db.prepare("SELECT COUNT(*) AS n FROM portal_action_journal WHERE facts IS NOT NULL AND json_extract(facts,'$.keyId')='first'").first<{n:number}>())?.n).toBe(0);
 await worker.dispose();await start({second},'second');
 expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');expect(writes).toHaveLength(1);
});

test('post-send response-fact and terminal journal failures preserve fresh read-back without replay',async()=>{
 for(const [point,skip]of [['/action/possibly-sent/before',1],['/action/finished/before',0]]as const){
  for(const outcome of ['confirmed','rejected','uncertain']as const){
   booked=new Set();writes=[];requests.length=0;let sent=false;
   synthetic=request=>{
    const path=new URL(request.url).pathname;const cookie=request.headers.get('cookie')!;
    if(path==='/api/book'){writes.push(cookie);sent=true;if(outcome!=='rejected')booked.add(cookie);return Response.json(outcome==='rejected'?{bookState:-1}:{bookState:1});}
    if(sent&&outcome==='uncertain'&&path==='/api/nextBookings')return new Response(null,{status:500});
    return bookingSource(request);
   };
   const actionReference=((await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
   interrupt=point;interruptSkip=skip;
   const result=await call(a(),'execute_booking_creation',{actionReference,confirmed:true});
   expect(interrupt).toBeUndefined();expect(result.isError,point+'/'+outcome).not.toBe(true);expect(result.structuredContent).toMatchObject({status:outcome,target});
   if(point==='/action/possibly-sent/before')expect((result.structuredContent?.notices as string[]).some(notice=>notice.includes('Recovery details could not be saved'))).toBe(true);
   const after=requests.slice(requests.findIndex(request=>request.url.pathname==='/api/book')+1).map(request=>request.url.pathname);
   expect(after).toEqual(['/api/bookings','/api/nextBookings']);expect(writes).toHaveLength(1);
   expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).isError).toBe(true);expect(writes).toHaveLength(1);
  }
 }
});

test('losing the current connection after a possible send reports uncertainty without restoring credentials or sending again',async()=>{
 booked=new Set();writes=[];synthetic=bookingSource;
 const actionReference=((await call(b(),'prepare_booking_creation',target)).structuredContent as {actionReference:string}).actionReference;
 expect((await call(b(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 const db=await worker.getD1Database('AUTH_DB');await db.prepare('DELETE FROM portal_aimharder_connection WHERE userId=?').bind('other-participant').run();
 await worker.dispose();await start({second:Buffer.alloc(32,29).toString('base64')},'second');
 const result=await call(b(),'execute_booking_creation',{actionReference,confirmed:true});
 expect(result.isError).toBe(true);expect(JSON.stringify(result)).toContain('ACTION_OUTCOME_UNCERTAIN');expect(writes).toHaveLength(1);
 expect((await call(b(),'get_account_context')).isError).toBe(true);
});


test('telemetry delivery cannot alter exact creation consent, result, consumption or original-account recovery',async()=>{
 for(const mode of ['off','success','rejected','timeout']){
  await worker.dispose();telemetryMode=mode;await start({first:syntheticKey,second:Buffer.alloc(32,29).toString('base64')});booked=new Set();writes=[];synthetic=bookingSource;
  const before=batches.length;
  const preparation=await call(a(),'prepare_booking_creation',target);
  expect(preparation.structuredContent).toMatchObject({status:'ready',target,currentState:'unbooked'});
  const {actionReference}=preparation.structuredContent as {actionReference:string};
  expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:false})).isError).toBe(true);
  const result=await call(a(),'execute_booking_creation',{actionReference,confirmed:true});
  expect(result.structuredContent).toMatchObject({status:'confirmed',target,observedState:'booked'});
  expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).isError).toBe(true);
  expect(writes).toEqual(['amhrdrauth=synthetic-a']);
  await new Promise(resolve=>setTimeout(resolve,mode==='timeout'?2100:60));
  const events=batches.slice(before).flatMap(batch=>batch.events).filter(event=>event.context.event_type==='mcp.tool.completed');
  if(mode==='off')expect(events).toEqual([]);
  else{
   expect(events.map(event=>[event.context.tool,event.context.outcome])).toEqual([
    ['prepare_booking_creation','success'],['execute_booking_creation','success'],['execute_booking_creation','denied']]);
   expect(new Set(events.map(event=>event.trace_id)).size).toBe(3);
   expect(events.every(event=>event.duration_ms>=0)).toBe(true);
   const serialized=JSON.stringify({events,warnings});
   for(const secret of [actionReference,'Metcon','shared-gym','synthetic-a','upstream-a','PRIVATE ACK'])expect(serialized).not.toContain(secret);
  }
  await worker.dispose();await start({first:syntheticKey,second:Buffer.alloc(32,29).toString('base64')});
  expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent).toMatchObject({status:'confirmed',target});
  expect(writes).toHaveLength(1);
 }
 telemetryMode='success';
});

async function expectObservation(tool:string,outcome:string,code?:string){
 await new Promise(resolve=>setTimeout(resolve,60));
 const event=batches.flatMap(batch=>batch.events).filter(event=>event.context.tool===tool).at(-1)!;
 expect(event.context).toMatchObject({outcome,...(code?{code}:{})});
 expect(event.context.error_class!==undefined).toBe(['uncertain','technical_failure','unclassified'].includes(outcome));
 return event;
}

test('every creation preview state reports success or a non-executable denial without private payloads',async()=>{
 for(const [status,rows] of [
  ['ready',[session()]],['missing',[]],['ambiguous',[session(),session({id:502})]],
  ['already-booked',[session({bookState:1})]],['waitlisted',[session({bookState:0})]],['unsupported',[session({enabled:0})]],
 ]as const){
  synthetic=request=>new URL(request.url).pathname==='/api/bookings'?Response.json(daily([...rows])):bookingSource(request);
  const result=await call(a(),'prepare_booking_creation',target);
  expect(result.structuredContent?.status).toBe(status);
  await expectObservation('prepare_booking_creation',status==='ready'?'success':'denied',status==='ready'?undefined:'BOOKING_NOT_EXECUTABLE');
 }
});
