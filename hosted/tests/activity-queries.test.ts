import { initializeTestRecovery } from './recovery-fixture.js';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8798';
const events:{context:Record<string,unknown>;trace_id:string;duration_ms:number}[]=[];
let worker: Miniflare;
let directory: string;
const cookies: string[] = [];
const clients: Client[] = [];
const requests: {url:URL; owner:number}[] = [];
const unexpectedOutbound: string[] = [];
const loginAttempts: number[] = [];
const accounts = [{id:42,email:'upstream-a@example.invalid',cookie:'activity-a'}, {id:73,email:'upstream-b@example.invalid',cookie:'activity-b'}];
let calendarReply: (owner:number,url:URL)=>Response = owner=>Response.json({workouts:{'2026-03-29':{rates:{ids:[owner*10+1,owner*10+2]},TIPOWODs:{}}}});
let detailReply: (owner:number,id:number)=>Response = (owner,id)=>Response.json(activity(owner,id));
let exerciseReply: (owner:number)=>Response = owner=>Response.json(exercise(owner));
let searchReply = () => Response.json({term:'lift',result:[{id:101,name:'Barbell lift',type:0}]});
let holdA: Promise<void>|undefined;
let enteredHoldA: (()=>void)|undefined;
let failALogin=false;
let expireA=0;
const older=Date.UTC(2025,3,2), latest=Date.UTC(2026,8,24);
function exercise(owner:number) { return {id:101,name:'Barbell lift',chartUserId:owner,
 chartData1RM:[{date:older,lbs:'120',idAction:10},{date:latest,lbs:owner===42?'100.5':'77',idAction:11}],
 chartData3RM:[{date:older,lbs:'90',idAction:12}],chartData5RM:[],chartData10RM:[],chartDataWOD:[{date:latest,lbs:'4',idAction:13}],
 history:[{date:older,idAction:10,desc:'120 kg',record:1},{date:latest,idAction:11,desc:owner===42?'100.5 kg':'77 kg',record:null}], privateProfile:'private-profile-canary'}; }
function activity(owner:number,id:number) {return {userId:owner,boxId:200,recordDate:'29 de Marzo de 2026',publishDate:'30 de Marzo de 2026',
 TIPOWODs:[{id:8,notes:'Sentadilla Ñ',deleted:false,res:null,reps:0,time:1234,rondas:null,rx:false,rxstr:'SCALED'}],
 ejerRate:[{ejerName:'Sentadilla Ñ',tipoWOD:0,valor1:['5']}],chartData:{8:[{idAction:id,desc:'Own recorded score'},{idAction:99999,desc:'private-history-canary'}]}, privateProfile:'private-profile-canary'};}
function post(path:string,body:unknown,cookie='') {return worker.dispatchFetch(origin+path,{method:'POST',headers:{origin,cookie,'content-type':'application/json'},body:JSON.stringify(body),redirect:'manual'});}
beforeAll(async()=>{
 await buildWorker('tests/activity-query-fixture-worker.ts','dist/activity-query-fixture-worker.js');
 directory=await mkdtemp(join(tmpdir(),'aimharder-activity-query-'));
 worker=new Miniflare(convertV4MiniflareOptions({modules:true,scriptPath:'dist/activity-query-fixture-worker.js',port:8798,
 compatibilityDate:'2026-10-12',compatibilityFlags:['nodejs_compat'],d1Databases:['AUTH_DB','RECOVERY_DB'],resourcePersistencePath:directory,
 durableObjects:{ACCOUNT_CONNECTIONS:{className:'AccountConnection',useSQLite:true}},
 bindings: {LOGNORTH_ENABLED:'true',LOGNORTH_URL:'https://telemetry.invalid',LOGNORTH_API_KEY:'lgn-'+'a'.repeat(64),LOGNORTH_ENVIRONMENT:'test',LOGNORTH_RELEASE:'synthetic', RECOVERY_AUTHORITY_ID:'synthetic-authority',BASE_URL:origin,AUTH_SECRET:'synthetic-activity-query-auth-secret-long-enough',VAULT_KEYS:JSON.stringify({first:Buffer.alloc(32,19).toString('base64')}),VAULT_ACTIVE_KEY_ID:'first'},
 outboundService:async request=>{
  const url=new URL(request.url);
  if(url.origin==='https://telemetry.invalid'){const batch=await request.json() as {events:typeof events};events.push(...batch.events);return Response.json({created:batch.events.length},{status:201});}
  if(url.origin===origin)return worker.dispatchFetch(request);
  if(url.href==='https://login.aimharder.es/api/login'&&request.method==='POST'){
   const body=await request.json() as {username:string;password:string}; const owner=accounts.find(a=>a.email===body.username);loginAttempts.push(owner?.id??-1);
   if(!owner||body.password!=='synthetic-upstream-password'||failALogin&&owner.id===42)return Response.json({data:{auth:{authOK:false}}});
   return Response.json({data:{userData:{id:owner.id},auth:{authOK:true}}},{headers:{'set-cookie':`amhrdrauth=${owner.cookie}; Domain=.aimharder.es; Path=/; HttpOnly`}});
  }
  const owner=accounts.find(a=>request.headers.get('cookie')===`amhrdrauth=${a.cookie}`);
  if(!owner||request.method!=='GET'){unexpectedOutbound.push('owner-or-method');throw Error('Unexpected outbound owner or method');}
  requests.push({url,owner:owner.id});
  if(url.href==='https://aimharder.es/api/whoami')return Response.json({data:[{id:owner.id,roles:[{role:'client',gym:'Shared gym',centre_url:'shared-gym.aimharder.es',boid:200},{role:'client',gym:'Other gym',centre_url:'other-gym.aimharder.es',boid:201}]}]});
  if(url.origin==='https://aimharder.es'&&url.pathname==='/api/activityCalendar')return calendarReply(owner.id,url);
  if(url.origin==='https://aimharder.es'&&url.pathname==='/api/activity/workout')return detailReply(owner.id,Number(url.searchParams.get('SEID')));
  if(url.origin==='https://shared-gym.aimharder.es'&&url.pathname===`/api/exercise/101/${owner.id}`){
   if(owner.id===42&&holdA){const held=holdA;holdA=undefined;enteredHoldA?.();await held;}
   if(owner.id===42&&expireA>0){expireA--;return new Response(null,{status:401});}
   return exerciseReply(owner.id);
  }
  if(url.origin==='https://shared-gym.aimharder.es'&&url.pathname==='/api/workoutAndEjers')return searchReply();
  unexpectedOutbound.push('route');throw Error('Unexpected activity test upstream request');
 }}));
 await worker.ready; await initializeTestRecovery(worker);
 const db=await worker.getD1Database('AUTH_DB');
 for(const file of (await readdir('migrations')).filter(n=>/^\d+.*\.sql$/.test(n)).sort())await db.exec((await readFile('migrations/'+file,'utf8')).replaceAll('\n',' '));
 expect((await worker.dispatchFetch(origin+'/__fixture')).status).toBe(200);
 for(const [i,email] of ['participant@example.invalid','other@example.invalid'].entries()){
  const login=await post('/api/auth/sign-in/email',{email,password:'synthetic-portal-password'});expect(login.status).toBe(200);
  const cookie=login.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');cookies.push(cookie);
  expect((await post('/api/portal/aimharder',{username:accounts[i]!.email,password:'synthetic-upstream-password',defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'Europe/Madrid'}},cookie)).status).toBe(200);
  const bearer=await token(cookie);const client=new Client({name:'remote-activity-harness',version:'1'},{versionNegotiation:{mode:{pin:'2026-07-28'}}});
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{requestInit:{headers:{authorization:`Bearer ${bearer}`}}}));clients.push(client);
 }
});
afterAll(async()=>{for(const client of clients)await client.close();await worker?.dispose();if(directory)await rm(directory,{recursive:true,force:true});});
beforeEach(()=>{requests.length=0;});
afterEach(()=>{expect(unexpectedOutbound).toEqual([]);});
async function call(name:string,args:Record<string,unknown>={},who=0){return clients[who]!.callTool({name,arguments:args});}
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

test('both participant roles discover the four read tools with strict inputs and unchanged result schemas',async()=>{
 for(const client of clients){
  const {tools}=await client.listTools();
  for(const name of ['get_personal_activity','get_exercise_1rm','find_exercise_1rm','get_exercise_rm_progression']){
   const tool=tools.find(tool=>tool.name===name)!;
   expect(tool).toBeDefined();expect(tool.inputSchema.additionalProperties).toBe(false);
   expect(tool.outputSchema).toMatchObject({type:'object'});
   expect(tool.annotations).toMatchObject({readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:true});
  }
 }
 expect(requests).toEqual([]);
});

test('remote participants retrieve distinct activity entries with source scores and explicit calendar coverage',async()=>{
 const result=await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'});
 expect(result.isError).not.toBe(true);
 expect(result.structuredContent).toMatchObject({gym:{id:'shared-gym',timeZone:'Europe/Madrid',timeZoneStatus:'user-confirmed'},entries:[{sourceActivityId:421,startTime:null,trainingSessionId:null,blocks:[{result:{res:null,reps:0,time:1234,rondas:null,rx:false,rxstr:'SCALED',desc:'Own recorded score'}}]},{sourceActivityId:422}],coverage:{status:'complete',scope:'account-activity-calendar',completedDates:['2026-03-29'],reason:null}});
 expect(JSON.stringify(result)).not.toMatch(/private-history-canary|private-profile-canary|activity-a|upstream-a/);
});
test('remote activity ignores opaque calendar decoration while retaining rates-derived own detail',async()=>{
 const previous=calendarReply;
 calendarReply=owner=>Response.json({workouts:{'2026-03-29':{rates:{ids:[owner*10+1]},TIPOWODs:{'anonymous-decoration':{text:'untrusted-opaque-calendar-canary'}}}}});
 try{
  const result=await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'});
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toMatchObject({entries:[{sourceActivityId:421,date:'2026-03-29'}],coverage:{status:'complete',completedDates:['2026-03-29'],reason:null}});
  expect(JSON.stringify(result)).not.toMatch(/anonymous-decoration|untrusted-opaque-calendar-canary/);
 }finally{calendarReply=previous;}
});

test('known exercise IDs return each participant latest dated own 1RM with corroborated units and limited history',async()=>{
 const [a,b]=await Promise.all([call('get_exercise_1rm',{exerciseId:101}),call('get_exercise_1rm',{exerciseId:101},1)]);
 expect(a.structuredContent).toMatchObject({status:'available',latest1RM:{value:'100.5',unit:'kg',sourceDate:'2026-09-24'},otherSeries:{'3RM':1,WOD:1},coverage:{status:'limited',history:'unverified'}});
 expect(b.structuredContent).toMatchObject({latest1RM:{value:'77',unit:'kg'}});
 expect(requests.filter(r=>r.url.pathname.startsWith('/api/exercise/')).map(r=>[r.url.pathname,r.owner]).sort()).toEqual([['/api/exercise/101/42',42],['/api/exercise/101/73',73]]);
 for(const result of [a,b])expect(JSON.stringify(result)).not.toContain('private-profile-canary');
});

test('name-based discovery keeps ambiguity separate from own records and explicit selection must match the current view',async()=>{
 searchReply=()=>Response.json({term:'lift',result:[{id:101,name:'Barbell lift',type:0},{id:102,name:'Dumbbell lift',type:0}]});
 expect((await call('find_exercise_1rm',{name:'lift'})).structuredContent).toMatchObject({status:'ambiguous',selected:null,candidates:[{sourceExerciseId:101},{sourceExerciseId:102}]});
 expect(requests.some(r=>r.url.pathname.startsWith('/api/exercise/'))).toBe(false);
 expect((await call('find_exercise_1rm',{name:'lift',exerciseId:999})).structuredContent).toMatchObject({status:'selection-not-found',selected:null});
 expect((await call('find_exercise_1rm',{name:'lift',exerciseId:101})).structuredContent).toMatchObject({status:'selected',selected:{latest1RM:{value:'100.5'}}});
 searchReply=()=>Response.json({term:'unknown',result:[]});
 expect((await call('find_exercise_1rm',{name:'unknown'})).structuredContent).toMatchObject({status:'empty-view',coverage:{status:'limited',possibleTruncation:false}});
 searchReply=()=>Response.json({term:'lift',result:[{id:101,name:'Barbell lift',type:99}]});
 expect((await call('find_exercise_1rm',{name:'lift'})).structuredContent).toMatchObject({status:'unsupported-view',selected:null});
});

test('progression keeps dated RM categories and source-marked records distinct from optional WOD context',async()=>{
 const result=await call('get_exercise_rm_progression',{exerciseId:101,includeWod:true});
 expect(result.structuredContent).toMatchObject({series:{'1RM':[{value:'120',unit:'kg',sourceDate:'2025-04-02',newMark:true},{value:'100.5',unit:'kg',sourceDate:'2026-09-24',newMark:false}],'3RM':[{value:'90',unit:null,newMark:false}],'5RM':[],'10RM':[]},wodContext:[{sourceValue:'4'}],coverage:{status:'limited',history:'unverified'}});
 expect((await call('get_exercise_rm_progression',{exerciseId:101})).structuredContent).not.toHaveProperty('wodContext');
});

test('the hosted schema rejects member and URL selectors plus intervals beyond 31 inclusive dates before personal reads',async()=>{
 for(const [name,args] of [
  ['get_personal_activity',{startDate:'2026-03-01',endDate:'2026-04-01'}],
  ['get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29',userId:73}],
  ['get_exercise_1rm',{exerciseId:101,userId:73}],
  ['find_exercise_1rm',{name:'lift',url:'https://elsewhere.invalid/'}],
  ['get_exercise_rm_progression',{exerciseId:101,accountId:73}],
 ] as [string,Record<string,unknown>][]){expect((await call(name,args)).isError).toBe(true);}
 expect(requests).toEqual([]);
 expect((await call('get_exercise_1rm',{exerciseId:101,gymId:'foreign-gym'})).isError).toBe(true);
 expect(requests.some(r=>r.url.pathname.startsWith('/api/exercise/'))).toBe(false);
});

test('an accepted 31-date interval and valid empty calendar retain complete empty coverage without claiming attendance',async()=>{
 calendarReply=()=>Response.json({workouts:[]});
 const result=await call('get_personal_activity',{startDate:'2026-03-01',endDate:'2026-03-31'});
 expect(result.structuredContent).toMatchObject({entries:[],coverage:{status:'complete',scope:'account-activity-calendar',reason:null}});
 expect((result.structuredContent as {coverage:{completedDates:string[]}}).coverage.completedDates).toHaveLength(31);
 calendarReply=owner=>Response.json({workouts:{'2026-03-29':{rates:{ids:[owner*10+1,owner*10+2]},TIPOWODs:{}}}});
});

test('later detail and calendar failures preserve recovered entries and incomplete-day coverage while first-partition failure is an error',async()=>{
 detailReply=(owner,id)=>id===owner*10+2?new Response(null,{status:500}):Response.json(activity(owner,id));
 const partial=await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-30'});
 expect(partial.isError).not.toBe(true);
 expect(partial.structuredContent).toMatchObject({entries:[{sourceActivityId:421}],coverage:{status:'incomplete',completedDates:[]}});
 detailReply=(owner,id)=>Response.json(activity(owner,id));
 calendarReply=(owner,url)=>url.searchParams.get('month')==='3'?new Response(null,{status:500}):Response.json({workouts:{'2026-03-29':{rates:{ids:[owner*10+1]},TIPOWODs:{}}}});
 expect((await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-04-01'})).structuredContent).toMatchObject({entries:[{sourceActivityId:421}],coverage:{status:'incomplete',completedDates:['2026-03-29','2026-03-30','2026-03-31']}});
 calendarReply=()=>new Response(null,{status:500});
 expect((await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'})).isError).toBe(true);
 calendarReply=owner=>Response.json({workouts:{'2026-03-29':{rates:{ids:[owner*10+1,owner*10+2]},TIPOWODs:{}}}});
});

test('activity excludes another verified gym and rejects another owner without exposing its data',async()=>{
 detailReply=(owner,id)=>Response.json({...activity(owner,id),boxId:201});
 expect((await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'})).structuredContent).toMatchObject({entries:[],coverage:{status:'complete'}});
 detailReply=(owner,id)=>Response.json({...activity(owner,id),userId:999,TIPOWODs:[{notes:'foreign-owner-canary'}]});
 const result=await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'});
 expect(result.structuredContent).toMatchObject({entries:[],coverage:{status:'incomplete',completedDates:[]}});expect(JSON.stringify(result)).not.toContain('foreign-owner-canary');
 detailReply=(owner,id)=>Response.json(activity(owner,id));
});

test('unknown units, empty own views and mismatched exercise owners preserve the existing safe result distinctions',async()=>{
 exerciseReply=owner=>Response.json({...exercise(owner),history:[]});
 expect((await call('get_exercise_1rm',{exerciseId:101})).structuredContent).toMatchObject({status:'unit-unverified',latest1RM:{value:'100.5',unit:null}});
 exerciseReply=owner=>{const {chartUserId:_owner,...empty}=exercise(owner);return Response.json({...empty,chartData1RM:[],chartData3RM:[],chartDataWOD:[],history:[]});};
 expect((await call('get_exercise_1rm',{exerciseId:101})).structuredContent).toMatchObject({status:'no-1rm',latest1RM:null});
 exerciseReply=owner=>Response.json({...exercise(owner),chartUserId:999});
 const rejected=await call('get_exercise_1rm',{exerciseId:101});expect(rejected.isError).toBe(true);expect(JSON.stringify(rejected)).toContain('IDENTITY_MISMATCH');
 exerciseReply=owner=>Response.json(exercise(owner));
});

async function observed(name:string,args:Record<string,unknown>,outcome:string,code?:string) {
 const before=events.length;const result=await call(name,args);
 for(let i=0;i<100&&!events.slice(before).some(e=>e.context.tool===name);i++)await new Promise(r=>setTimeout(r,10));
 const tools=events.slice(before).filter(e=>e.context.tool===name);expect(tools).toHaveLength(1);
 expect(tools[0]!.context).toMatchObject({outcome,...(code?{code}:{})});
 expect(events.slice(before).filter(e=>e.trace_id===tools[0]!.trace_id&&e.context.event_type==='http.completed')).toEqual([expect.objectContaining({context:expect.objectContaining({outcome:'success',http_status:200})})]);
 expect(JSON.stringify(events.slice(before))).not.toMatch(/private-profile|private-history|Own recorded score|upstream-a|activity-a|shared-gym|100.5|sourceActivityId/);
 return result;
}
test('native read telemetry observes supported RM and search variants, progression, partial activity and identity errors without sporting payloads',async()=>{
 await observed('get_exercise_1rm',{exerciseId:101},'success');
 await observed('get_exercise_rm_progression',{exerciseId:101,includeWod:true},'success');
 exerciseReply=owner=>Response.json({...exercise(owner),history:[]});
 await observed('get_exercise_1rm',{exerciseId:101},'success');
 exerciseReply=owner=>Response.json({...exercise(owner),chartData1RM:[]});
 await observed('get_exercise_1rm',{exerciseId:101},'success');
 exerciseReply=owner=>Response.json(exercise(owner));
 for(const [status,rows] of [['selected',[{id:101,name:'Barbell lift',type:0}]],['ambiguous',[{id:101,name:'Barbell lift',type:0},{id:102,name:'Dumbbell lift',type:0}]],['empty-view',[]],['unsupported-view',[{id:101,name:'Barbell lift',type:99}]]] as const){
  searchReply=()=>Response.json({term:'lift',result:rows});
  const result=await observed('find_exercise_1rm',{name:'lift'},status==='unsupported-view'?'technical_failure':'success');
  expect(result.structuredContent).toMatchObject({status});
 }
 searchReply=()=>Response.json({term:'lift',result:[{id:101,name:'Barbell lift',type:0}]});
 await observed('find_exercise_1rm',{name:'lift',exerciseId:999},'success');
 await observed('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'},'success');
 detailReply=(owner,id)=>id===owner*10+2?new Response(null,{status:500}):Response.json(activity(owner,id));
 await observed('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'},'partial','PERSONAL_ACTIVITY_INCOMPLETE');
 detailReply=(owner,id)=>Response.json(activity(owner,id));
 exerciseReply=owner=>Response.json({...exercise(owner),chartUserId:999});
 await observed('get_exercise_1rm',{exerciseId:101},'technical_failure','IDENTITY_MISMATCH');
 exerciseReply=owner=>Response.json(exercise(owner));
});

test('overlapping participant reads progress independently and one account bounded recovery and failure latch never affect the other',async()=>{
 let release!:()=>void;holdA=new Promise<void>(resolve=>{release=resolve;});
 const entered=new Promise<void>(resolve=>{enteredHoldA=resolve;});
 const held=call('get_exercise_1rm',{exerciseId:101});
 await entered;
 try {
  const independent=await Promise.race([call('get_exercise_1rm',{exerciseId:101},1),new Promise<never>((_,reject)=>setTimeout(()=>reject(Error('Independent participant blocked')),2000))]);
  expect(independent.structuredContent).toMatchObject({latest1RM:{value:'77'}});
 } finally {release();}
 expect((await held).structuredContent).toMatchObject({latest1RM:{value:'100.5'}});
 const initialLogins=loginAttempts.filter(id=>id===42).length;
 expireA=1;
 expect((await call('get_exercise_1rm',{exerciseId:101})).structuredContent).toMatchObject({latest1RM:{value:'100.5'}});
 expect(loginAttempts.filter(id=>id===42)).toHaveLength(initialLogins+1);
 expireA=2;
 const repeated=await call('get_exercise_1rm',{exerciseId:101});expect(repeated.isError).toBe(true);expect(JSON.stringify(repeated)).toContain('SESSION_EXPIRED');
 expect(loginAttempts.filter(id=>id===42)).toHaveLength(initialLogins+2);
 failALogin=true;
 const failed=await call('get_exercise_1rm',{exerciseId:101});expect(failed.isError).toBe(true);expect(JSON.stringify(failed)).toContain('AUTHENTICATION_FAILED');
 const before=requests.length+loginAttempts.length;
 expect((await call('get_exercise_1rm',{exerciseId:101})).isError).toBe(true);
 expect(requests.length+loginAttempts.length).toBe(before);
 expect((await call('get_personal_activity',{startDate:'2026-03-29',endDate:'2026-03-29'},1)).structuredContent).toMatchObject({entries:[{sourceActivityId:731},{sourceActivityId:732}],coverage:{status:'complete'}});
 expect((await call('get_exercise_1rm',{exerciseId:101},1)).structuredContent).toMatchObject({latest1RM:{value:'77'}});
});
