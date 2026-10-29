import { initializeTestRecovery } from './recovery-fixture.js';
import { spawn } from 'node:child_process';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8802';
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
  worker = new Miniflare(convertV4MiniflareOptions({ handleStructuredLogs:entry=>warnings.push(entry.message), modules: true, scriptPath: 'dist/booking-cancellation-fixture-worker.js', port: 8802,
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
  await buildWorker('tests/booking-cancellation-fixture-worker.ts', 'dist/booking-cancellation-fixture-worker.js');
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
 if(url.pathname==='/api/cancelBook'){writes.push(cookie);booked.delete(cookie);return Response.json({cancelState:1});}
 if(url.pathname==='/api/bookings')return Response.json(daily([session({bookState:booked.has(cookie)?1:null,idres:booked.has(cookie)?901:null})]));
 if(url.pathname==='/api/nextBookings')return Response.json({nextClasses:[],history:[]});
 return failOutbound();
}
test('both roles cancel a pre-existing own reservation once after an exact preview and explicit confirmation',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 for(const cookie of [a(),b()]){
  const prepared=await call(cookie,'prepare_booking_cancellation',target);
  expect(prepared.isError).not.toBe(true);
  expect(prepared.structuredContent).toMatchObject({status:'ready',action:'cancel',target,currentState:'booked',credit:{balance:null,entitlementPeriod:null}});
  const {actionReference}=prepared.structuredContent as {actionReference:string};
  expect((await call(cookie,'execute_booking_cancellation',{actionReference,confirmed:false})).isError).toBe(true);
  const results=await Promise.all([call(cookie,'execute_booking_cancellation',{actionReference,confirmed:true}),call(cookie,'execute_booking_cancellation',{actionReference,confirmed:true})]);
  expect(results.filter(result=>result.structuredContent?.status==='confirmed')).toHaveLength(1);
  expect(results.filter(result=>result.isError)).toHaveLength(1);
 }
 expect(writes).toEqual(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);
});

test('a late warning issues a distinct reference and requires separate credit-loss confirmation',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a']);writes=[];const bodies:string[]=[];
 synthetic=async request=>{
  if(new URL(request.url).pathname==='/api/cancelBook'){
   const body=await (request as Request).text();bodies.push(body);writes.push(request.headers.get('cookie')!);
   if(new URLSearchParams(body).get('late')==='0')return Response.json({cancelState:2,privateMessage:'private-warning-canary'});
   booked.clear();return Response.json({cancelState:1});
  }return bookingSource(request);
 };
 const standard=((await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string}).actionReference;
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:standard,confirmedCreditLoss:false})).isError).toBe(true);
 const warning=(await call(a(),'execute_booking_cancellation',{actionReference:standard,confirmed:true})).structuredContent as {actionReference:string};
 expect(warning).toMatchObject({status:'pending-credit-loss',observedState:'booked',credit:{balance:null,entitlementPeriod:null}});
 expect(warning.actionReference).toMatch(/^[a-f0-9]{64}$/);expect(warning.actionReference).not.toBe(standard);
 expect(JSON.stringify(warning)).not.toContain('private-warning-canary');
 expect((await call(a(),'execute_booking_cancellation',{actionReference:standard,confirmed:true})).isError).toBe(true);
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmed:true})).isError).toBe(true);
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:false})).isError).toBe(true);
 expect(writes).toHaveLength(1);
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).structuredContent).toMatchObject({status:'confirmed',credit:{balance:null,entitlementPeriod:null}});
 expect(bodies.map(body=>Object.fromEntries(new URLSearchParams(body)))).toEqual([{id:'901',late:'0'},{id:'901',late:'1'}]);
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).isError).toBe(true);expect(writes).toHaveLength(2);
});

test('foreign, expired, wrong-gym, changed revision and reservation references send nothing',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 const prepare=async()=>((await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string}).actionReference;
 const foreign=await prepare();expect((await call(b(),'execute_booking_cancellation',{actionReference:foreign,confirmed:true})).isError).toBe(true);
 const wrong=await prepare();expect((await call(a(),'execute_booking_cancellation',{actionReference:wrong,gymId:'inaccessible-gym',confirmed:true})).isError).toBe(true);
 expect((await call(a(),'execute_booking_cancellation',{actionReference:wrong,confirmed:true})).isError).toBe(true);
 const old=await prepare();expect((await post('/api/portal/aimharder/settings',{gymTimeZones:{'shared-gym':'Europe/Madrid'}},a())).status).toBe(200);
 expect((await call(a(),'execute_booking_cancellation',{actionReference:old,confirmed:true})).isError).toBe(true);
 const expired=await prepare();await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});
 expect((await call(a(),'execute_booking_cancellation',{actionReference:expired,confirmed:true})).isError).toBe(true);
 const changed=await prepare();synthetic=request=>new URL(request.url).pathname==='/api/bookings'?Response.json(daily([session({bookState:1,idres:902})])):bookingSource(request);
 expect((await call(a(),'execute_booking_cancellation',{actionReference:changed,confirmed:true})).structuredContent?.status).toBe('stale');await expectObservation('execute_booking_cancellation','denied','BOOKING_STALE');expect(writes).toHaveLength(0);
});

test('revocation and expiry during held fresh checks deny cancellation while the other account remains independent',async()=>{
 for(const cause of ['revoke','expire']){
  booked=new Set(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
  const {actionReference}=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
  let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
  synthetic=async request=>{if(new URL(request.url).pathname==='/api/bookings'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return bookingSource(request)};
  const pending=call(a(),'execute_booking_cancellation',{actionReference,confirmed:true});await arrived;
  if(cause==='revoke')expect((await post('/api/portal/connections/fixture-client/revoke',{},a())).status).toBe(204);
  else await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});
  expect((await call(b(),'prepare_booking_cancellation',target)).structuredContent?.status).toBe('ready');release();
  expect((await pending).isError).toBe(true);expect(writes).toHaveLength(0);
 }
});

test('persistent restart loses unused and late permission and only reconciles original cancellation facts',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 const unused=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 const used=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 expect((await call(b(),'execute_booking_cancellation',{actionReference:used.actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();
 expect((await call(a(),'execute_booking_cancellation',{actionReference:unused.actionReference,confirmed:true})).isError).toBe(true);
 expect((await call(b(),'execute_booking_cancellation',{actionReference:used.actionReference,confirmed:true})).structuredContent).toMatchObject({status:'confirmed',target});expect(writes).toHaveLength(1);
 booked.add('amhrdrauth=synthetic-a');synthetic=request=>{if(new URL(request.url).pathname==='/api/cancelBook'){writes.push(request.headers.get('cookie')!);return Response.json({cancelState:2});}return bookingSource(request)};
 const standard=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 const warning=(await call(a(),'execute_booking_cancellation',{actionReference:standard.actionReference,confirmed:true})).structuredContent as {actionReference:string};
 await worker.dispose();await start();
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).isError).toBe(true);
 const recovered=await call(a(),'execute_booking_cancellation',{actionReference:standard.actionReference,confirmed:true});
 expect(recovered.structuredContent).toMatchObject({status:'pending-credit-loss',observedState:'booked'});expect(recovered.structuredContent).not.toHaveProperty('actionReference');expect(writes).toHaveLength(2);
});

test('transport loss, denial, incomplete or conflicting reads never invent a credit effect or resend',async()=>{
 for(const variant of ['lost-response','denied','incomplete','conflict']as const){
  booked=new Set(['amhrdrauth=synthetic-b']);writes=[];let sent=false;
  synthetic=request=>{
   const path=new URL(request.url).pathname;const cookie=request.headers.get('cookie')!;
   if(path==='/api/cancelBook'){
    writes.push(cookie);sent=true;if(variant!=='denied')booked.delete(cookie);
    if(variant==='lost-response')throw new Error('Synthetic transport lost after send');
    return Response.json({cancelState:variant==='denied'?3:1});
   }
   if(sent&&variant==='incomplete')return new Response(null,{status:500});
   if(sent&&variant==='conflict'&&path==='/api/bookings')return Response.json(daily([session({id:502,bookState:null,idres:null})]));
   return bookingSource(request);
  };
  const {actionReference}=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
  const result=await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true});
  expect(result.structuredContent).toMatchObject({status:variant==='denied'?'rejected':'uncertain',credit:{balance:null,entitlementPeriod:null}});
  await expectObservation('execute_booking_cancellation',variant==='denied'?'denied':'uncertain',variant==='denied'?'BOOKING_REFUSED':'BOOKING_EFFECT_UNCONFIRMED');
  expect((await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true})).isError).toBe(true);
  await worker.dispose();await start();expect((await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent?.status).toBe(variant==='denied'?'rejected':'uncertain');expect(writes).toHaveLength(1);
 }
});

test('durable consumption and dispatch interruptions cannot replay after restart',async()=>{
 for(const [point,expectedWrites,status]of [
  ['/action/consumed/before',0,undefined],['/action/consumed/after',0,undefined],
  ['/action/possibly-sent/after',0,'uncertain'],['/action/finished/after',1,'confirmed'],
 ]as const){
  booked=new Set(['amhrdrauth=synthetic-a']);writes=[];synthetic=bookingSource;
  const {actionReference}=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};interrupt=point;
  const result=await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true});
  if(point==='/action/finished/after')expect(result.structuredContent?.status).toBe('confirmed');else expect(result.isError).toBe(true);expect(interrupt).toBeUndefined();
  await worker.dispose();await start();const recovered=await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true});
  if(status)expect(recovered.structuredContent?.status).toBe(status);else expect(recovered.isError).toBe(true);expect(writes).toHaveLength(expectedWrites);
 }
});

test('post-send journal failures retain fresh reconciliation and a durable no-replay fence',async()=>{
 for(const point of ['/action/possibly-sent/before','/action/finished/before']){
  booked=new Set(['amhrdrauth=synthetic-a']);writes=[];synthetic=bookingSource;
  const {actionReference}=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};interrupt=point;interruptSkip=point.includes('possibly-sent')?1:0;
  const result=await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true});expect(result.structuredContent?.status).toBe('confirmed');expect(writes).toHaveLength(1);
  await worker.dispose();await start();const recovered=await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true});
  expect(recovered.structuredContent?.status).toBe(point.includes('possibly-sent')?'uncertain':'confirmed');expect(writes).toHaveLength(1);
 }
});

test('held cancellation does not block another account and recovery never follows a replacement identity',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 const first=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 const second=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/cancelBook'&&request.headers.get('cookie')==='amhrdrauth=synthetic-a'){entered();await held;}return bookingSource(request)};
 const pending=call(a(),'execute_booking_cancellation',{actionReference:first.actionReference,confirmed:true});await arrived;
 expect((await call(b(),'execute_booking_cancellation',{actionReference:second.actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');release();expect((await pending).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();profiles.get('upstream-a@example.invalid')!.id=99;
 try{expect((await call(a(),'execute_booking_cancellation',{actionReference:first.actionReference,confirmed:true})).structuredContent).toMatchObject({status:'uncertain',observedState:'unknown',target});expect(writes).toHaveLength(2);}
 finally{profiles.get('upstream-a@example.invalid')!.id=42;}
 await worker.dispose();await start();
});

test('late execution rechecks the exact reservation and a recovered warning requires a new preparation',async()=>{
 booked=new Set(['amhrdrauth=synthetic-b']);writes=[];
 synthetic=request=>{if(new URL(request.url).pathname==='/api/cancelBook'){writes.push(request.headers.get('cookie')!);return Response.json({cancelState:2});}return bookingSource(request)};
 const {actionReference}=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 const warning=(await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent as {actionReference:string};
 expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).isError).toBe(true);
 synthetic=request=>new URL(request.url).pathname==='/api/bookings'?Response.json(daily([session({bookState:1,idres:902})])):bookingSource(request);
 expect((await call(b(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).structuredContent?.status).toBe('stale');expect(writes).toHaveLength(1);
});


test('recovery bookkeeping failure cannot hide fresh original-account cancellation read-back',async()=>{
 booked=new Set(['amhrdrauth=synthetic-a']);writes=[];synthetic=bookingSource;
 const {actionReference}=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 expect((await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();interrupt='/action/recovery/before';
 expect((await call(a(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent).toMatchObject({status:'confirmed',target});expect(interrupt).toBeUndefined();expect(writes).toHaveLength(1);
});

test('restart recovery rejects an explicit wrong gym before reading or disclosing the protected cancellation target',async()=>{
 booked=new Set(['amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 const {actionReference}=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 expect((await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();requests.length=0;
 const wrong=await call(b(),'execute_booking_cancellation',{actionReference,gymId:'inaccessible-gym',confirmed:true});
 expect(wrong.isError).toBe(true);expect(wrong.structuredContent).toBeUndefined();expect(requests).toHaveLength(0);expect(writes).toHaveLength(1);
});

test('creation restart recovery also rejects a changed explicit gym without protected target disclosure',async()=>{
 booked=new Set();writes=[];synthetic=request=>{if(new URL(request.url).pathname==='/api/book'){writes.push(request.headers.get('cookie')!);booked.add(request.headers.get('cookie')!);return Response.json({bookState:1});}return bookingSource(request)};
 const {actionReference}=(await call(a(),'prepare_booking_creation',target)).structuredContent as {actionReference:string};
 expect((await call(a(),'execute_booking_creation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 await worker.dispose();await start();requests.length=0;
 const wrong=await call(a(),'execute_booking_creation',{actionReference,gymId:'inaccessible-gym',confirmed:true});
 expect(wrong.isError).toBe(true);expect(wrong.structuredContent).toBeUndefined();expect(requests).toHaveLength(0);expect(writes).toHaveLength(1);
});

test('a missing original connection after possible cancellation cannot resurrect credentials or authorize replay',async()=>{
 booked=new Set(['amhrdrauth=synthetic-b']);writes=[];synthetic=bookingSource;
 const {actionReference}=(await call(b(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
 expect((await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true})).structuredContent?.status).toBe('confirmed');
 const db=await worker.getD1Database('AUTH_DB');await db.prepare('DELETE FROM portal_aimharder_connection WHERE userId=?').bind('other-participant').run();
 await worker.dispose();await start();requests.length=0;
 const recovered=await call(b(),'execute_booking_cancellation',{actionReference,confirmed:true});expect(recovered.isError).toBe(true);expect(JSON.stringify(recovered)).toContain('ACTION_OUTCOME_UNCERTAIN');expect(requests).toHaveLength(0);expect(writes).toHaveLength(1);
});


test('telemetry preserves separate late-credit-loss confirmation and one dispatch per reference in every delivery mode',async()=>{
 for(const mode of ['off','success','rejected','timeout']){
  await worker.dispose();telemetryMode=mode;await start();booked=new Set(['amhrdrauth=synthetic-a']);writes=[];
  synthetic=async request=>{
   if(new URL(request.url).pathname==='/api/cancelBook'){
    writes.push(request.headers.get('cookie')!);
    const late=new URLSearchParams(await (request as Request).text()).get('late');
    if(late==='0')return Response.json({cancelState:2});
    booked.clear();return Response.json({cancelState:1});
   }return bookingSource(request);
  };
  const before=batches.length;
  const prepared=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
  expect(prepared).toMatchObject({status:'ready',target,currentState:'booked'});
  const warning=(await call(a(),'execute_booking_cancellation',{actionReference:prepared.actionReference,confirmed:true})).structuredContent as {actionReference:string};
  expect(warning).toMatchObject({status:'pending-credit-loss',target,observedState:'booked'});
  expect(warning.actionReference).not.toBe(prepared.actionReference);
  expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:false})).isError).toBe(true);
  expect(writes).toHaveLength(1);
  expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).structuredContent).toMatchObject({status:'confirmed',target,observedState:'unbooked'});
  expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).isError).toBe(true);
  expect(writes).toHaveLength(2);
  await new Promise(resolve=>setTimeout(resolve,mode==='timeout'?2100:60));
  const events=batches.slice(before).flatMap(batch=>batch.events).filter(event=>event.context.event_type==='mcp.tool.completed');
  if(mode==='off')expect(events).toEqual([]);
  else{
   expect(events.map(event=>[event.context.tool,event.context.outcome])).toEqual([
    ['prepare_booking_cancellation','success'],['execute_booking_cancellation','denied'],['execute_late_booking_cancellation','success'],['execute_late_booking_cancellation','denied']]);
   expect(events[1]!.context.code).toBe('BOOKING_CREDIT_CONFIRMATION_REQUIRED');
   expect(events[1]!.context.error_class).toBeUndefined();
   expect(new Set(events.map(event=>event.trace_id)).size).toBe(4);
   const serialized=JSON.stringify({events,warnings});
   for(const secret of [prepared.actionReference,warning.actionReference,'Metcon','shared-gym','synthetic-a','PRIVATE ACK'])expect(serialized).not.toContain(secret);
  }
  await worker.dispose();await start();
  expect((await call(a(),'execute_booking_cancellation',{actionReference:prepared.actionReference,confirmed:true})).structuredContent?.status).toBe('uncertain');
  expect(writes).toHaveLength(2);
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

test('every cancellation preview state reports an explicit non-executable denial without claiming a technical failure',async()=>{
 for(const [status,rows] of [
  ['ready',[session({bookState:1,idres:901})]],['missing',[]],['ambiguous',[session({bookState:1,idres:901}),session({id:502,bookState:1,idres:902})]],
  ['already-cancelled',[session({cancelledId:901,idres:901})]],['unsupported',[session({bookState:0,idres:901})]],['unsupported',[session({enabled:0,idres:901})]],
 ]as const){
  synthetic=request=>new URL(request.url).pathname==='/api/bookings'?Response.json(daily([...rows])):bookingSource(request);
  const result=await call(a(),'prepare_booking_cancellation',target);
  expect(result.structuredContent?.status).toBe(status);
  await expectObservation('prepare_booking_cancellation',status==='ready'?'success':'denied',status==='ready'?undefined:'BOOKING_NOT_EXECUTABLE');
 }
});

test('late execution distinguishes refused, uncertain and stale effects without another cancellation dispatch',async()=>{
 for(const variant of ['rejected','uncertain','stale'] as const){
  booked=new Set(['amhrdrauth=synthetic-a']);writes=[];let late=false;
  synthetic=async request=>{
   const path=new URL(request.url).pathname;
   if(path==='/api/cancelBook'){
    writes.push(request.headers.get('cookie')!);
    late=new URLSearchParams(await (request as Request).text()).get('late')==='1';
    return Response.json({cancelState:late?3:2});
   }
   if(late&&variant==='uncertain')return new Response(null,{status:500});
   return bookingSource(request);
  };
  const standard=(await call(a(),'prepare_booking_cancellation',target)).structuredContent as {actionReference:string};
  const warning=(await call(a(),'execute_booking_cancellation',{actionReference:standard.actionReference,confirmed:true})).structuredContent as {actionReference:string};
  if(variant==='stale')booked.clear();
  const result=await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true});
  expect(result.structuredContent?.status).toBe(variant);
  await expectObservation('execute_late_booking_cancellation',variant==='uncertain'?'uncertain':'denied',variant==='uncertain'?'BOOKING_EFFECT_UNCONFIRMED':variant==='stale'?'BOOKING_STALE':'BOOKING_REFUSED');
  expect(writes).toHaveLength(variant==='stale'?1:2);
  expect((await call(a(),'execute_late_booking_cancellation',{actionReference:warning.actionReference,confirmedCreditLoss:true})).isError).toBe(true);
  expect(writes).toHaveLength(variant==='stale'?1:2);
 }
});
