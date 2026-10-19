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
let directory: string;
const logins: string[] = [];
const identities: string[] = [];
let rejectA = false;
let finalGuard: (()=>Promise<void>)|undefined;
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
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/activity-publication-fixture-worker.js', port: 8801,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(new URL(request.url).origin==='https://synthetic-scheduler.invalid'){if(new URL(request.url).pathname==='/activity-guard/before')await finalGuard?.();const matches=new URL(request.url).pathname===interrupt;const hit=matches&&interruptSkip--<=0;if(hit){interrupt=undefined;interruptSkip=0;}return new Response(null,{status:hit?503:204});}
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
async function call(cookie: string, name: string, args: Record<string, unknown> = {}) {
  const bearer = await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));

    return await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/activity-publication-fixture-worker.ts', 'dist/activity-publication-fixture-worker.js');
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


test('publication availability defaults by role and only an administrator can change a role policy through the portal',async()=>{
 const admin=await worker.dispatchFetch(origin+'/admin/activity-access',{headers:{cookie:a()}});
 expect(admin.status).toBe(200);expect(await admin.text()).toContain('Activity publication');
 expect((await worker.dispatchFetch(origin+'/admin/activity-access',{headers:{cookie:b()}})).status).toBe(403);
 const form=(cookie:string,body:string)=>worker.dispatchFetch(origin+'/portal/activity-access',{method:'POST',headers:{origin,cookie,'content-type':'application/x-www-form-urlencoded'},body,redirect:'manual'});
 expect((await form(b(),'role=user&feature=publication&enabled=1')).status).toBe(403);
 expect((await form(a(),'role=user&feature=publication&enabled=1&userId=other-participant')).status).toBe(400);
 expect((await form(a(),'role=user&feature=publication&enabled=1')).status).toBe(303);
 expect((await form(a(),'role=user&feature=publication&enabled=0')).status).toBe(303);
});
const sourceId=8001;
const sourceBlock={notes:'Complete for time',deleted:false,type:1,timecap:600};
const sourceExercise={ejerId:101,ejerName:'Sample lift',tipoWOD:0,formaReg:4,tipoud:4,valor2:'80'};
const detail=(extra:Record<string,unknown>={})=>({recordDate:'28 de Septiembre de 2026',TIPOWODs:[sourceBlock],ejerRate:[sourceExercise],...extra});
const settings=(audience='1')=>`<form id="frmConfiguration">¿Quién puede ver tus publicaciones?<input name="USPRIVACIDADDEF" value="2" ${audience==='2'?'checked':''}><input name="USPRIVACIDADDEF" value="1" ${audience==='1'?'checked':''}><input name="USPRIVACIDADDEF" value="4"><input name="USPRIVCAST" value="0" checked><input name="USPRIVCAST" value="1"></form>`;
let published=false;let publicationWrites=0;let audience='1';let sourceChanged=false;
function publicationSource(request:QueryRequest){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/exercise/'))return Response.json({id:101,name:'Sample lift',chartUserId:request.headers.get('cookie')==='amhrdrauth=synthetic-a'?42:73,chartData1RM:[],chartData3RM:[],chartData5RM:[],chartData10RM:[],chartDataWOD:[],history:[]});
 if(url.pathname==='/settings')return new Response(settings(audience));
 if(url.pathname==='/')return new Response('timeLineContent: 7, userID: 300');
 if(url.pathname==='/api/activity'&&url.search)return Response.json({timeLineContent:'7',timeLineFormat:'0',elements:[{id:sourceId,wodClass:'WOD',ejerRate:[],TIPOWODs:[{title:'Sample WOD'}]}],curDate:'20260928'});
 if(url.pathname==='/api/activity/workout'&&url.host==='shared-gym.aimharder.es')return Response.json(detail(sourceChanged?{TIPOWODs:[{...sourceBlock,notes:'Changed prescription'}]}:{}));
 if(url.pathname===`/api/activity/samewod/${sourceId}`)return Response.json({box:[{boxID:200,userId:300,date:'2026-09-28T00:00:00',rates:[sourceExercise],TIPOWODs:[sourceBlock]}]});
 if(url.pathname==='/api/activity'){publicationWrites++;published=true;return Response.json({errors:[],errorWODsID:[],errorWODsType:[],errorEjerID:[],id:'9001'});}
 if(url.pathname==='/api/activityCalendar')return Response.json({workouts:published?{'2026-09-28':{rates:{ids:[9001]},TIPOWODs:{}}}:{}});
 if(url.pathname==='/api/activity/workout')return Response.json({userId:request.headers.get('cookie')==='amhrdrauth=synthetic-a'?42:73,boxId:200,...detail({TIPOWODs:[{...sourceBlock,time:275}]})});
 return failOutbound();
}
const publication={sourceActivityId:sourceId,blockResults:[{blockIndex:0,kind:'time-seconds',value:275}]};
async function setPolicy(role:string,enabled:boolean){return worker.dispatchFetch(origin+'/portal/activity-access',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({role,feature:'publication',enabled:enabled?'1':'0'}).toString(),redirect:'manual'});}
async function preparePublication(cookie=a(),extra:Record<string,unknown>={}){return call(cookie,'prepare_activity_publication',{...publication,...extra});}
async function executePublication(actionReference:string,cookie=a(),extra:Record<string,unknown>={}){return call(cookie,'execute_activity_publication',{actionReference,confirmed:true,...extra});}
function resetPublication(){published=false;publicationWrites=0;audience='1';sourceChanged=false;synthetic=publicationSource;}
test('admin publishes the exact own preview once and blocked user cannot prepare or reuse a foreign reference',async()=>{
 resetPublication();
 expect((await preparePublication(b())).isError).toBe(true);
 const prepared=await preparePublication();expect(prepared.structuredContent).toMatchObject({status:'ready',source:{sourceActivityId:sourceId},audience:{publication:'followers',wodTvResults:true}});
 const reference=prepared.structuredContent!.actionReference as string;
 expect((await executePublication(reference,b())).isError).toBe(true);
 expect((await executePublication(reference,a(),{confirmed:false})).isError).toBe(true);
 const results=await Promise.all([executePublication(reference),executePublication(reference)]);
 expect(results.filter(r=>r.structuredContent?.status==='confirmed')).toHaveLength(1);expect(results.filter(r=>r.isError)).toHaveLength(1);
 expect(publicationWrites).toBe(1);
});
test('role changes deny cached references and a setting change during held preflight prevents the POST',async()=>{
 resetPublication();
 await setPolicy('user',true);
 const userPrepared=await preparePublication(b());expect(userPrepared.structuredContent?.status).toBe('ready');
 await setPolicy('user',false);
 expect((await executePublication(userPrepared.structuredContent!.actionReference as string,b())).isError).toBe(true);
 const prepared=await preparePublication();
 let release!:()=>void,entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve}),arrived=new Promise<void>(resolve=>{entered=resolve});
 let once=true;synthetic=async request=>{if(new URL(request.url).pathname===`/api/activity/samewod/${sourceId}`&&once){once=false;entered();await held;}return publicationSource(request);};
 const pending=executePublication(prepared.structuredContent!.actionReference as string);await arrived;
 await setPolicy('admin',false);release();expect((await pending).isError).toBe(true);expect(publicationWrites).toBe(0);
 expect((await preparePublication()).isError).toBe(true);await setPolicy('admin',true);
 expect((await executePublication(prepared.structuredContent!.actionReference as string)).isError).toBe(true);
});
test('persistent restart loses unused permission but recovers a completed publication through fresh own reads without reposting',async()=>{
 resetPublication();
 const unused=await preparePublication(),used=await preparePublication();
 expect((await executePublication(used.structuredContent!.actionReference as string)).structuredContent).toMatchObject({status:'confirmed',observedEntry:'matched',sourceProvenance:{status:'verified'}});
 await worker.dispose();await start();
 expect((await executePublication(unused.structuredContent!.actionReference as string)).isError).toBe(true);
 expect((await executePublication(used.structuredContent!.actionReference as string)).structuredContent).toMatchObject({status:'confirmed',observedEntry:'matched'});
 expect(publicationWrites).toBe(1);expect((await executePublication(used.structuredContent!.actionReference as string)).isError).toBe(true);
});
test('changed source or audience consumes the reference with a stale zero-write result',async()=>{
 for(const change of ['source','audience']){resetPublication();const prepared=await preparePublication();if(change==='source')sourceChanged=true;else audience='2';
 expect((await executePublication(prepared.structuredContent!.actionReference as string)).structuredContent?.status).toBe('stale');expect(publicationWrites).toBe(0);
 expect((await executePublication(prepared.structuredContent!.actionReference as string)).isError).toBe(true);}
});

test('a role change while the final grant snapshot is waiting cannot bypass current publication permission',async()=>{
 resetPublication();const prepared=await preparePublication();
 let release!:()=>void,entered!:()=>void;const held=new Promise<void>(resolve=>{release=resolve}),arrived=new Promise<void>(resolve=>{entered=resolve});
 let count=0;finalGuard=async()=>{if(++count===2){entered();await held;}};
 const pending=executePublication(prepared.structuredContent!.actionReference as string);await arrived;
 await setPolicy('admin',false);release();
 try{expect((await pending).isError).toBe(true);expect(publicationWrites).toBe(0);}finally{finalGuard=undefined;await setPolicy('admin',true);}
});
test('lost response, rejection and conflicting own detail preserve uncertainty and never resend across restart',async()=>{
 for(const variant of ['lost-response','rejected','foreign-detail','conflicting-detail','unreadable']as const){
  resetPublication();let sent=false;
  synthetic=request=>{
   const url=new URL(request.url);
   if(url.pathname==='/api/activity'&&!url.search){publicationWrites++;sent=true;published=variant!=='rejected';if(variant==='lost-response')throw new Error('Synthetic lost response');return Response.json(variant==='rejected'?{errors:['private-canary'],errorWODsID:[],errorWODsType:[],errorEjerID:[]}:{errors:[],errorWODsID:[],errorWODsType:[],errorEjerID:[],id:'9001'});}
   if(sent&&url.host==='aimharder.es'&&url.pathname==='/api/activity/workout'){
    if(variant==='unreadable')return new Response(null,{status:500});
    return Response.json({userId:variant==='foreign-detail'?73:42,boxId:200,...detail({TIPOWODs:[{...sourceBlock,time:variant==='conflicting-detail'?100:275}]})});
   }
   return publicationSource(request);
  };
  const prepared=await preparePublication();const reference=prepared.structuredContent!.actionReference as string;
  const expected=variant==='rejected'?'rejected':'uncertain';
  const result=await executePublication(reference);expect(result.structuredContent?.status).toBe(expected);expect(JSON.stringify(result)).not.toContain('private-canary');
  await worker.dispose();await start();expect((await executePublication(reference)).structuredContent?.status).toBe(expected);expect(publicationWrites).toBe(1);
 }
});
test('post-send journal failures retain original own read-back and the durable fence without another POST',async()=>{
 for(const [point,skip]of [['/action/possibly-sent/before',1],['/action/finished/before',0]]as const){
  resetPublication();const prepared=await preparePublication();const reference=prepared.structuredContent!.actionReference as string;
  interrupt=point;interruptSkip=skip;
  const result=await executePublication(reference);expect(result.structuredContent).toMatchObject({status:'confirmed',observedEntry:'matched'});expect(interrupt).toBeUndefined();
  await worker.dispose();await start();const recovered=await executePublication(reference);
  expect(recovered.structuredContent?.status).toBe(skip===1?'uncertain':'confirmed');expect(publicationWrites).toBe(1);
 }
});
test('a dispatch fence interruption recovers read-only uncertainty while unused and expired references never publish',async()=>{
 resetPublication();const prepared=await preparePublication();const reference=prepared.structuredContent!.actionReference as string;
 interrupt='/action/possibly-sent/after';expect((await executePublication(reference)).isError).toBe(true);
 await worker.dispose();await start();expect((await executePublication(reference)).structuredContent?.status).toBe('uncertain');expect(publicationWrites).toBe(0);
 const expired=await preparePublication();await worker.dispatchFetch(origin+'/__fixture/clock',{headers:{'x-fixture-ms':'121000'}});
 expect((await executePublication(expired.structuredContent!.actionReference as string)).isError).toBe(true);expect(publicationWrites).toBe(0);
});
test('a recovered publication reference with a different supplied gym cannot read or act on the original target',async()=>{
 resetPublication();const prepared=await preparePublication();const reference=prepared.structuredContent!.actionReference as string;
 expect((await executePublication(reference)).structuredContent?.status).toBe('confirmed');await worker.dispose();await start();
 const count=requests.length;expect((await executePublication(reference,a(),{gymId:'inaccessible-gym'})).isError).toBe(true);
 expect(requests.length).toBe(count);expect(publicationWrites).toBe(1);
});
