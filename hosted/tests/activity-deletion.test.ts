import { initializeTestRecovery } from './recovery-fixture.js';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
let telemetryMode: 'off'|'success'|'reject'|'timeout' = 'success';
const telemetryEvents: Array<{trace_id:string;context:Record<string,unknown>}> = [];
const telemetryWarnings: string[] = [];
const origin = 'http://localhost:8804';
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let worker: Miniflare;
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let rejectA = false;
let interrupt:string|undefined;
let interruptSkip=0;
let holdGuard:Promise<void>|undefined;let enteredGuard:(()=>void)|undefined;
const unexpected: string[] = [];
function failOutbound(): never { unexpected.push('Unexpected outbound request'); throw new Error('Unexpected outbound request'); }
const requests: {url: URL; cookie: string}[] = [];
type QueryRequest = { url: string; method?:string; headers: { get(name: string): string | null } };
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
  worker = new Miniflare(convertV4MiniflareOptions({ handleStructuredLogs:entry=>telemetryWarnings.push(entry.message), modules: true, scriptPath: 'dist/activity-deletion-fixture-worker.js', port: 8804,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      LOGNORTH_ENABLED:telemetryMode==='off'?'false':'true', LOGNORTH_URL:'https://telemetry.synthetic.invalid', LOGNORTH_API_KEY:'lgn-'+'a'.repeat(64), LOGNORTH_ENVIRONMENT:'synthetic', LOGNORTH_RELEASE:'ticket100', VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(new URL(request.url).origin==='https://telemetry.synthetic.invalid'){const body=await request.json() as {events:typeof telemetryEvents};telemetryEvents.push(...body.events);if(telemetryMode==='timeout')return new Promise(()=>{});return Response.json({created:body.events.length},{status:telemetryMode==='reject'?503:201});}

      if(new URL(request.url).pathname==='/execution-guard'&&holdGuard){const held=holdGuard;holdGuard=undefined;enteredGuard?.();await held;return new Response(null,{status:204});}
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

    const offset=telemetryEvents.length;
    const result=await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
    if(telemetryMode!=='off' && result.structuredContent && name.includes('activity_deletion')){
      const outcomes:Record<string,string>={'ready':'success','missing':'denied','ambiguous':'denied','unsupported':'denied','foreign-owner':'technical_failure','foreign-gym':'technical_failure','stale':'denied','observed-absent':'success','still-visible':'uncertain','conflicting-identity':'uncertain','uncertain':'uncertain','incomplete':name.startsWith('prepare')?'technical_failure':'uncertain'};
      const event=await toolEvent(name,offset);expect(event.context.outcome).toBe(outcomes[String(result.structuredContent.status)]);
      expect(event.context.error_class!==undefined).toBe(['uncertain','technical_failure'].includes(String(event.context.outcome)));
    }
    const serialized=JSON.stringify(result);
    if(telemetryMode!=='off' && result.isError && name.includes('activity_') && /ACCESS_RESTRICTED|ACTIVITY_REFERENCE_INVALID|ACTION_OUTCOME_UNCERTAIN/.test(serialized)){
      const event=await toolEvent(name,offset);expect(event.context.outcome).toBe(serialized.includes('ACTION_OUTCOME_UNCERTAIN')?'uncertain':'denied');
    }
    return result;
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/activity-deletion-fixture-worker.ts', 'dist/activity-deletion-fixture-worker.js');
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
afterEach(()=>expect(unexpected.splice(0)).toEqual([]));
beforeEach(()=>{requests.length=0; synthetic=()=>{return failOutbound();};});


const target={date:'2026-03-29',sourceActivityId:501};
let removed=false;let writes:string[]=[];
function activity(owner=42){return {userId:owner,boxId:200,recordDate:'29 de Marzo de 2026',publishDate:'30 de Marzo de 2026',TIPOWODs:[{id:8,title:'Existing own entry Ñ',notes:'Existing own entry Ñ',deleted:false,res:null,reps:0,time:1234,rondas:null,rx:false,rxstr:'SCALED'}],ejerRate:[{ejerName:'Sentadilla Ñ',tipoWOD:0,valor1:['5']}],chartData:{8:[{idAction:501,desc:'Own score'}]},privateProfile:'private-canary'};}
function deletionSource(request:QueryRequest){
 const url=new URL(request.url);const cookie=request.headers.get('cookie')!;
 if(url.pathname==='/api/activity/501'){expect(request.method).toBe('DELETE');expect(url.origin).toBe('https://shared-gym.aimharder.es');writes.push(cookie);removed=true;return Response.json({});}
 if(url.pathname==='/api/activityCalendar')return Response.json({workouts:removed?[]:{'2026-03-29':{rates:{ids:[501]},TIPOWODs:{}}}});
 if(url.pathname==='/api/activity/workout')return Response.json(activity(cookie==='amhrdrauth=synthetic-a'?42:73));
 return failOutbound();
}
test('admin deletes a pre-existing own entry after separate exact confirmation, while user is disabled',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 expect((await call(b(),'prepare_activity_deletion',target)).isError).toBe(true);expect(requests).toEqual([]);
 const prepared=await call(a(),'prepare_activity_deletion',target);
 expect(prepared.isError).not.toBe(true);
 expect(prepared.structuredContent).toMatchObject({status:'ready',target:{sourceActivityId:501,date:target.date,blocks:[{notes:'Existing own entry Ñ',result:{desc:'Own score'}}]},gym:{id:'shared-gym'}});
 expect(JSON.stringify(prepared)).not.toContain('private-canary');expect(writes).toEqual([]);
 const actionReference=prepared.structuredContent!.actionReference;
 expect((await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:false})).isError).toBe(true);
 const result=await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true});
 expect(result.structuredContent).toMatchObject({status:'observed-absent',responseStatus:'http-ok',observedState:'absent',readbackCoverage:{status:'complete'}});
 expect(writes).toEqual(['amhrdrauth=synthetic-a']);
 expect((await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);
 expect(writes).toHaveLength(1);
});

async function policy(role:'admin'|'user',enabled:boolean){
 const response=await worker.dispatchFetch(origin+'/portal/activity-access',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({role,feature:'deletion',enabled:enabled?'1':'0'}).toString(),redirect:'manual'});
 expect(response.status).toBe(303);
}
test('deletion has an independent administrator control and enabling user permits its own pre-existing entry',async()=>{
 const page=await worker.dispatchFetch(origin+'/admin/activity-access',{headers:{cookie:a()}});expect(page.status).toBe(200);
 const html=await page.text();expect(html.match(/Activity deletion/g)).toHaveLength(2);expect(html.match(/Activity publication/g)).toHaveLength(2);
 removed=false;writes=[];synthetic=deletionSource;
 await policy('admin',false);expect((await call(a(),'prepare_activity_deletion',target)).isError).toBe(true);
 await policy('user',true);
 const prepared=await call(b(),'prepare_activity_deletion',target);expect(prepared.structuredContent?.status).toBe('ready');
 expect((await call(b(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('observed-absent');
 expect(writes).toEqual(['amhrdrauth=synthetic-b']);
 await policy('admin',true);await policy('user',false);
});
test('permission changes after preparation and during held preflight prevent DELETE with cached tools',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const first=await call(a(),'prepare_activity_deletion',target);
 await policy('admin',false);
 expect((await call(a(),'execute_activity_deletion',{actionReference:first.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);expect(writes).toEqual([]);
 await policy('admin',true);
 const prepared=await call(a(),'prepare_activity_deletion',target);
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/activity/workout'){entered();await held;}return deletionSource(request);};
 const pending=call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});await arrived;
 await policy('admin',false);release();expect((await pending).isError).toBe(true);expect(writes).toEqual([]);
 await policy('admin',true);expect((await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);
});
test('persistent restart loses unused preparation and only reads back used deletion references without a second DELETE',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const unused=await call(a(),'prepare_activity_deletion',target);const used=await call(a(),'prepare_activity_deletion',target);
 expect((await call(a(),'execute_activity_deletion',{actionReference:used.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('observed-absent');
 await worker.dispose();await start();
 expect((await call(a(),'execute_activity_deletion',{actionReference:unused.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);
 const result=await call(a(),'execute_activity_deletion',{actionReference:used.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
 expect(result.structuredContent).toMatchObject({status:'observed-absent',preview:{target:{sourceActivityId:501,date:target.date}},responseStatus:'http-ok',observedState:'absent'});
 expect(result.structuredContent!.preview).not.toHaveProperty('target.blocks');expect(writes).toHaveLength(1);
 expect((await call(a(),'execute_activity_deletion',{actionReference:used.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);
});
test('recovery rejects a mismatched gym selector without exposing the old target or sending again',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const prepared=await call(a(),'prepare_activity_deletion',target);const actionReference=prepared.structuredContent!.actionReference;
 await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true});await worker.dispose();await start();
 expect((await call(a(),'execute_activity_deletion',{actionReference,gymId:'foreign-gym',sourceActivityId:501,confirmed:true})).isError).toBe(true);
 expect(writes).toHaveLength(1);
});
test('foreign owners, gyms, changed exact content and mismatched targets never authorize a DELETE',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 for(const [detail,status] of [[{...activity(),userId:999},'foreign-owner'],[{...activity(),boxId:201},'foreign-gym']]as const){
  synthetic=request=>new URL(request.url).pathname==='/api/activity/workout'?Response.json(detail):deletionSource(request);
  const result=await call(a(),'prepare_activity_deletion',target);expect(result.structuredContent?.status).toBe(status);expect(result.structuredContent).not.toHaveProperty('actionReference');
 }
 synthetic=deletionSource;const first=await call(a(),'prepare_activity_deletion',target);
 await policy('user',true);expect((await call(b(),'execute_activity_deletion',{actionReference:first.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);await policy('user',false);
 expect((await call(a(),'execute_activity_deletion',{actionReference:first.structuredContent!.actionReference,sourceActivityId:502,confirmed:true})).isError).toBe(true);
 const next=await call(a(),'prepare_activity_deletion',target);
 synthetic=request=>new URL(request.url).pathname==='/api/activity/workout'?Response.json({...activity(),TIPOWODs:[{...activity().TIPOWODs[0],notes:'Changed own content'}]}):deletionSource(request);
 expect((await call(a(),'execute_activity_deletion',{actionReference:next.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('stale');
 expect(writes).toEqual([]);
});
test('overlapping executions dispatch one DELETE, and an expired preparation cannot dispatch',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const prepared=await call(a(),'prepare_activity_deletion',target);const input={actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true};
 const results=await Promise.all([call(a(),'execute_activity_deletion',input),call(a(),'execute_activity_deletion',input)]);
 expect(results.filter(r=>r.structuredContent?.status==='observed-absent')).toHaveLength(1);expect(results.filter(r=>r.isError)).toHaveLength(1);expect(writes).toHaveLength(1);
 removed=false;const expiring=await call(a(),'prepare_activity_deletion',target);
 await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});
 expect((await call(a(),'execute_activity_deletion',{actionReference:expiring.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);expect(writes).toHaveLength(1);
});
test('response uncertainty, still-visible entries, incomplete coverage and identity conflicts remain distinct with one DELETE',async()=>{
 for(const variant of ['lost-response','still-visible','incomplete','conflict']as const){
  removed=false;writes=[];let sent=false;
  synthetic=request=>{
   const path=new URL(request.url).pathname;
   if(path==='/api/activity/501'){writes.push(request.headers.get('cookie')!);sent=true;removed=variant==='lost-response';if(variant==='lost-response')throw Error('Synthetic response loss');return Response.json({});}
   if(sent&&variant==='incomplete')return new Response(null,{status:500});
   if(sent&&variant==='conflict'&&path==='/api/activity/workout')return Response.json({...activity(),userId:999});
   return deletionSource(request);
  };
  const prepared=await call(a(),'prepare_activity_deletion',target);
  const result=await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
  expect(result.structuredContent).toMatchObject({status:variant==='lost-response'?'uncertain':variant==='conflict'?'conflicting-identity':variant,responseStatus:variant==='lost-response'?'uncertain':'http-ok',observedState:variant==='lost-response'?'absent':variant==='conflict'?'conflicting-identity':variant});
  expect(writes).toHaveLength(1);
  await worker.dispose();await start();
  const recovered=await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
  expect(recovered.structuredContent?.status).toBe(result.structuredContent!.status);expect(writes).toHaveLength(1);
 }
});
test('the final dispatch authorization observes deletion policy changed while the grant query is held',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const prepared=await call(a(),'prepare_activity_deletion',target);
 let release!:()=>void;holdGuard=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{enteredGuard=resolve});
 const pending=call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});await arrived;
 await policy('admin',false);release();expect((await pending).isError).toBe(true);expect(writes).toEqual([]);await policy('admin',true);
});
test('expiry during held fresh target verification prevents DELETE and consumes the reference',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const prepared=await call(a(),'prepare_activity_deletion',target);
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/activity/workout'){entered();await held;}return deletionSource(request)};
 const pending=call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});await arrived;
 await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});release();expect((await pending).isError).toBe(true);expect(writes).toEqual([]);
 expect((await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);
});
test('post-send journal faults preserve fresh deletion read-back and a durable no-replay fence',async()=>{
 for(const [point,skip]of [['/action/possibly-sent/before',1],['/action/finished/before',0]]as const){
  removed=false;writes=[];synthetic=deletionSource;
  const prepared=await call(a(),'prepare_activity_deletion',target);interrupt=point;interruptSkip=skip;
  const result=await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
  expect(result.structuredContent).toMatchObject({status:'observed-absent',observedState:'absent',responseStatus:'http-ok'});expect(writes).toHaveLength(1);expect(interrupt).toBeUndefined();
  await worker.dispose();await start();
  const recovered=await call(a(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
  expect(recovered.structuredContent).toMatchObject({observedState:'absent',status:point.includes('possibly')?'uncertain':'observed-absent'});expect(writes).toHaveLength(1);
 }
});
test('a held possibly sent deletion reconciles the original account despite a policy change without blocking another participant',async()=>{
 removed=false;writes=[];await policy('user',true);synthetic=deletionSource;
 const first=await call(a(),'prepare_activity_deletion',target);const second=await call(b(),'prepare_activity_deletion',target);
 const removedOwners=new Set<string>();let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{
  const url=new URL(request.url);const cookie=request.headers.get('cookie')!;
  if(url.pathname==='/api/activity/501'){writes.push(cookie);removedOwners.add(cookie);if(cookie==='amhrdrauth=synthetic-a'){entered();await held;}return Response.json({});}
  if(url.pathname==='/api/activityCalendar')return Response.json({workouts:removedOwners.has(cookie)?[]:{'2026-03-29':{rates:{ids:[501]},TIPOWODs:{}}}});
  return deletionSource(request);
 };
 const pending=call(a(),'execute_activity_deletion',{actionReference:first.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});await arrived;
 await policy('admin',false);
 expect((await call(b(),'execute_activity_deletion',{actionReference:second.structuredContent!.actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('observed-absent');
 release();expect((await pending).structuredContent?.status).toBe('observed-absent');expect(writes.sort()).toEqual(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']);await policy('admin',true);await policy('user',false);
});
test('a changed connection revision cannot redirect read-only recovery to new connection state',async()=>{
 removed=false;writes=[];synthetic=deletionSource;
 const prepared=await call(a(),'prepare_activity_deletion',target);const actionReference=prepared.structuredContent!.actionReference;
 expect((await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('observed-absent');
 expect((await post('/api/portal/aimharder/settings',{gymTimeZones:{'shared-gym':'Europe/Madrid'}},a())).status).toBe(200);
 await worker.dispose();await start();requests.length=0;
 const result=await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true});
 expect(result.structuredContent).toMatchObject({status:'uncertain',preview:{target:{sourceActivityId:501,date:target.date}},observedState:'incomplete'});
 expect(requests).toEqual([]);expect(writes).toHaveLength(1);
});
test('a policy disabled while preparation reads are held prevents returning a ready reference',async()=>{
 removed=false;writes=[];
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/activity/workout'){entered();await held;}return deletionSource(request)};
 const pending=call(a(),'prepare_activity_deletion',target);await arrived;await policy('admin',false);release();
 expect((await pending).isError).toBe(true);expect(writes).toEqual([]);await policy('admin',true);
});
test('large pre-existing entry contents stay out of compact recovery facts and remain recoverable after restart',async()=>{
 removed=false;writes=[];const notes='Large own entry '.repeat(6000);
 synthetic=request=>new URL(request.url).pathname==='/api/activity/workout'?Response.json({...activity(),TIPOWODs:[{...activity().TIPOWODs[0],notes}]}):deletionSource(request);
 const prepared=await call(a(),'prepare_activity_deletion',target);expect(prepared.structuredContent).toMatchObject({status:'ready',target:{blocks:[{notes}]}});
 const actionReference=prepared.structuredContent!.actionReference;
 expect((await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true})).structuredContent?.status).toBe('observed-absent');
 await worker.dispose();await start();
 const result=await call(a(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true});
 expect(result.structuredContent).toMatchObject({status:'observed-absent',preview:{target:{sourceActivityId:501,date:target.date}}});expect(JSON.stringify(result)).not.toContain('Large own entry');expect(writes).toHaveLength(1);
});

test('fresh authorization after reactivation cannot reuse a warm deletion preparation',async()=>{
 removed=false;writes=[];synthetic=deletionSource;await policy('user',true);
 const prepared=await call(b(),'prepare_activity_deletion',target);expect(prepared.structuredContent?.status).toBe('ready');
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 const signIn=await post('/api/auth/sign-in/email',{email:'other@example.invalid',password:'synthetic-portal-password'});expect(signIn.status).toBe(200);
 portalCookies.set('other@example.invalid',signIn.headers.getSetCookie().map(value=>value.split(';')[0]).join('; '));
 const result=await call(b(),'execute_activity_deletion',{actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true});
 expect(result.isError).toBe(true);expect(JSON.stringify(result)).toContain('ACTIVITY_REFERENCE_INVALID');expect(writes).toHaveLength(0);
 await policy('user',false);
});

test('suspension during a possibly sent deletion preserves original read-back and restart recovery cannot repeat DELETE',async()=>{
 removed=false;writes=[];synthetic=deletionSource;await policy('user',true);
 const prepared=await call(b(),'prepare_activity_deletion',target);const actionReference=prepared.structuredContent!.actionReference;
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve});const arrived=new Promise<void>(resolve=>{entered=resolve});
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/activity/501'){entered();await held;}return deletionSource(request);};
 const pending=call(b(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true});await arrived;
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 const boundary=requests.length;release();expect((await pending).structuredContent).toMatchObject({status:'observed-absent',observedState:'absent'});
 const readBack=requests.slice(boundary).filter(value=>value.url.host==='aimharder.es');expect(readBack.map(value=>value.url.pathname)).toContain('/api/activityCalendar');expect(readBack.every(value=>value.cookie==='amhrdrauth=synthetic-b')).toBe(true);expect(writes).toEqual(['amhrdrauth=synthetic-b']);
 await worker.dispose();await start();expect((await post('/api/portal/participants/other-participant/reactivate',{},a())).status).toBe(204);
 const signIn=await post('/api/auth/sign-in/email',{email:'other@example.invalid',password:'synthetic-portal-password'});expect(signIn.status).toBe(200);portalCookies.set('other@example.invalid',signIn.headers.getSetCookie().map(value=>value.split(';')[0]).join('; '));
 synthetic=deletionSource;requests.length=0;
 expect((await call(b(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true})).structuredContent).toMatchObject({status:'observed-absent',observedState:'absent'});
 const recovered=requests.filter(value=>value.url.host==='aimharder.es');expect(recovered.map(value=>value.url.pathname)).toContain('/api/activityCalendar');expect(recovered.every(value=>value.cookie==='amhrdrauth=synthetic-b')).toBe(true);expect(writes).toEqual(['amhrdrauth=synthetic-b']);
 expect((await call(b(),'execute_activity_deletion',{actionReference,sourceActivityId:501,confirmed:true})).isError).toBe(true);expect(writes).toHaveLength(1);await policy('user',false);
});

async function toolEvent(name:string,offset=0){
 for(let i=0;i<100;i++){const event=telemetryEvents.slice(offset).findLast(e=>e.context.tool===name);if(event)return event;await new Promise(resolve=>setTimeout(resolve,10));}
 throw new Error('Missing synthetic telemetry tool event');
}
test('deletion completion distinguishes observed absence and execution uncertainty without private fields',async()=>{
 removed=false;writes=[];synthetic=deletionSource;telemetryEvents.length=0;
 const prepared=await call(a(),'prepare_activity_deletion',target);
 expect((await toolEvent('prepare_activity_deletion')).context).toMatchObject({outcome:'success'});
 const preparationTrace=(await toolEvent('prepare_activity_deletion')).trace_id;
 const reference=prepared.structuredContent!.actionReference;
 const result=await call(a(),'execute_activity_deletion',{actionReference:reference,sourceActivityId:501,confirmed:true});
 expect(result.structuredContent?.status).toBe('observed-absent');
 const event=await toolEvent('execute_activity_deletion');expect(event.context).toMatchObject({outcome:'success',code:'observed_absent'});expect(event.trace_id).not.toBe(preparationTrace);
 expect(JSON.stringify(telemetryEvents)).not.toContain(String(reference));
 for(const marker of ['Existing own entry','Sentadilla','private-canary','sourceActivityId','shared-gym','synthetic-a','Own score'])expect(JSON.stringify(telemetryEvents)).not.toContain(marker);
});

test('exporter modes preserve exact deletion confirmation, consumed references and one DELETE',async()=>{
 let expectedPreparation:unknown;let expectedExecution:unknown;
 for(const mode of ['off','success','reject','timeout'] as const){
  await worker.dispose();telemetryMode=mode;await start();telemetryEvents.length=0;removed=false;writes=[];synthetic=deletionSource;
  expect((await call(b(),'prepare_activity_deletion',target)).isError).toBe(true);expect(writes).toEqual([]);
  const prepared=await call(a(),'prepare_activity_deletion',target);expect(prepared.structuredContent?.status).toBe('ready');
  const {actionReference:opaqueReference,expiresAt:expiration,...publicPreparation}=prepared.structuredContent!;
  if(mode==='off')expectedPreparation=publicPreparation;else expect(publicPreparation).toEqual(expectedPreparation);
  const input={actionReference:prepared.structuredContent!.actionReference,sourceActivityId:501,confirmed:true};
  expect((await call(a(),'execute_activity_deletion',{...input,confirmed:false})).isError).toBe(true);expect(writes).toEqual([]);
  const result=await call(a(),'execute_activity_deletion',input);expect(result.structuredContent).toMatchObject({status:'observed-absent',responseStatus:'http-ok',observedState:'absent',readbackCoverage:{status:'complete'}});
  if(mode==='off')expectedExecution=result.structuredContent;else expect(result.structuredContent).toEqual(expectedExecution);
  expect((await call(a(),'execute_activity_deletion',input)).isError).toBe(true);expect(writes).toHaveLength(1);
  if(mode==='off')expect(telemetryEvents).toEqual([]);
  if(mode==='timeout')await new Promise(resolve=>setTimeout(resolve,2100));
 }
 telemetryMode='success';
 for(const marker of ['Existing own entry','Sentadilla','private-canary','shared-gym','synthetic-a','Own score'])expect(JSON.stringify(telemetryWarnings)).not.toContain(marker);
});

test('missing, ambiguous, unreadable-calendar and unsupported deletion previews never become write uncertainty',async()=>{
 await worker.dispose();telemetryMode='success';await start();removed=false;writes=[];
 for(const variant of ['missing','ambiguous','incomplete','unsupported'] as const){
  synthetic=request=>{const path=new URL(request.url).pathname;
   if(path==='/api/activityCalendar'){if(variant==='incomplete')return new Response(null,{status:500});return Response.json({workouts:variant==='missing'?{}:{'2026-03-29':{rates:{ids:variant==='ambiguous'?[501,502]:[501]},TIPOWODs:{}}}});}
   if(path==='/api/activity/workout')return Response.json({malformed:'HOSTILE_PRIVATE_DETAIL'});
   return failOutbound();
  };
  const result=await call(a(),'prepare_activity_deletion',{date:target.date});expect(result.structuredContent?.status).toBe(variant);expect(result.structuredContent).not.toHaveProperty('actionReference');
 }
 expect(writes).toEqual([]);expect(JSON.stringify(telemetryEvents)).not.toContain('HOSTILE_PRIVATE_DETAIL');
});
