import { initializeTestRecovery } from './recovery-fixture.js';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { buildWorker } from '../build.mjs';
const origin = 'http://localhost:8797';
const events: {context: Record<string,unknown>; trace_id:string;duration_ms:number}[] = [];
const syntheticKey = Buffer.alloc(32, 17).toString('base64');
let telemetryEnabled='true';
let rejectTelemetry=false;
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
const portalCookies = new Map<string,string>();
function post(path: string, body: unknown, cookie = '', requestOrigin = origin) {
  return worker.dispatchFetch(origin + path, { method: 'POST', headers: { origin: requestOrigin, cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), redirect: 'manual' });
}
async function start(keys: Record<string,string> = {first:syntheticKey}, active = 'first') {
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/schedule-queries-fixture-worker.js', port: 8797,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      LOGNORTH_ENABLED:telemetryEnabled,LOGNORTH_URL:'https://telemetry.invalid',LOGNORTH_API_KEY:'lgn-'+ 'a'.repeat(64),LOGNORTH_ENVIRONMENT:'test',LOGNORTH_RELEASE:'synthetic',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(new URL(request.url).origin==='https://telemetry.invalid'){const batch=await request.json() as {events:typeof events};events.push(...batch.events);if(rejectTelemetry)return new Response('hostile-receiver-canary',{status:500});return Response.json({created:batch.events.length},{status:201});}
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
      if(request.method !== 'GET') return failOutbound();
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

    return await client.callTool({ name, arguments: args });
  } finally { await client.close(); }
}
beforeAll(async () => {
  await buildWorker('tests/schedule-queries-fixture-worker.ts', 'dist/schedule-queries-fixture-worker.js');
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
    expect((await post('/api/portal/aimharder',{username,password:'synthetic-upstream-password'},portalCookies.get(email!)!)).status).toBe(200);
  }
});
afterAll(async()=>{ await worker?.dispose(); if(directory)await rm(directory,{recursive:true,force:true}); });

const a = () => portalCookies.get('participant@example.invalid')!;
const b = () => portalCookies.get('other@example.invalid')!;
const session = (extra: Record<string,unknown> = {}) => ({id:501,time:'07:00 - 08:00',timeid:'0700_60',classId:10,className:'Metcon Ñ',ocupation:8,limit:20,limitc:20,enabled:1,bookState:null,privateCoach:'private-canary',...extra});
const daily = (rows: unknown[] = [session()]) => ({clasesDisp:'Clases disponibles',day:'Source label',bookings:rows,timetable:[{id:'0700_60',time:'07:00 - 08:00'}],seminars:[]});
afterEach(()=>expect(unexpected.splice(0)).toEqual([]));
beforeEach(()=>{requests.length=0; synthetic=()=>{return failOutbound();};});

test('HTTP MCP preserves inclusive schedules longer than 31 dates, exact filters, nullable occupancy and assumed zones',async()=>{
 synthetic=request=>{const url=new URL(request.url); expect(url.origin+url.pathname).toBe('https://shared-gym.aimharder.es/api/bookings');expect(url.searchParams.get('box')).toBe('200');return Response.json(daily([session({ocupation:undefined,limit:null}),session({id:502,ocupation:0,limit:0}),session({id:503,className:'Other'})]));};
 const result=await call(a(),'get_class_sessions',{startDate:'2026-10-01',endDate:'2026-11-01',className:'Metcon Ñ',startTime:'07:00'});
 expect(result.isError).not.toBe(true);
 expect(result.structuredContent).toMatchObject({coverage:'complete',gym:{id:'shared-gym',timeZone:'Europe/Madrid',timeZoneStatus:'assumed'},sessions:expect.arrayContaining([expect.objectContaining({date:'2026-10-25',startTime:'07:00',occupancy:null,capacity:null}),expect.objectContaining({occupancy:0,capacity:0})])});
 expect((result.structuredContent as {sessions:unknown[]}).sessions).toHaveLength(64);
 expect(requests.map(r=>r.url.searchParams.get('day'))).toEqual(expect.arrayContaining(['20261001','20261025','20261101']));
 expect(requests).toHaveLength(32);
 expect(JSON.stringify(result)).not.toMatch(/private-canary|attendanceCount|bookable|synthetic-a/);
});

const booking = (extra: Record<string,unknown> = {}) => ({id:9001,day:'Miércoles, 23 de Septiembre de 2026',time:'07:00 - 08:00',className:'Metcon Ñ',bookState:1,coachName:'private-canary',...extra});
test('both roles retain upcoming state uncertainty and partial limited history without attendance or invented session links',async()=>{
 synthetic=request=>{expect(new URL(request.url).pathname).toBe('/api/nextBookings');return Response.json({nextClasses:[booking(),booking({id:9002,bookState:0}),booking({id:9003,bookState:99})],history:[booking({assist:1,lateCancel:1}),booking({id:9004}),booking({id:9004,time:'08:00 - 09:00'}),{id:9005}]});};
 for(const cookie of [a(),b()]) {
  const upcoming=await call(cookie,'get_upcoming_bookings');
  expect(upcoming.isError).not.toBe(true);
  expect(upcoming.structuredContent).toMatchObject({bookingStatus:'booked',coverage:{status:'complete',scope:'upstream-upcoming-view',startDate:null,endDate:null},bookings:[{sourceBookingId:9001,sessionId:null,state:'booked'},{state:'waitlisted'},{state:'unknown',sourceState:99}]});
  const history=await call(cookie,'get_booking_history');
  expect(history.isError).not.toBe(true);
  expect(history.structuredContent).toMatchObject({coverage:{status:'limited',retrieval:'partial',scope:'upstream-history-view',startDate:null,endDate:null},bookings:[{sourceBookingId:9001,state:'late-cancelled',attendance:'unverified',sourceFlags:{assist:1,lateCancel:1}}]});
  expect((history.structuredContent as {bookings:unknown[]}).bookings).toHaveLength(1);
  expect(JSON.stringify(upcoming)+JSON.stringify(history)).not.toContain('private-canary');
 }
});

const publication=(id=8001)=>({id,day:'1 Nov',when:'20991031210000',wodClass:'WOD',ejerRate:[],TIPOWODs:[{title:'Fuerza Ñ',notes:'Original',deleted:'false'}]});
const feed=(rows:unknown[]=[publication(),publication(8002)])=>({timeLineContent:'7',timeLineFormat:'0',elements:rows,firstLoaded:8001,lastLoaded:7990,curDate:'20991031'});
const percent=(id:number,value:string,extra:Record<string,unknown>={})=>({ejerId:id,ejerName:'Source lift',tipoWOD:0,formaReg:4,tipoud:4,valor2:value,...extra});
const workout=(extra:Record<string,unknown>={})=>({recordDate:'1 de Noviembre de 2099',publishDate:'31 de Octubre de 2099',ejerRate:[percent(101,'85',{scaledver:[percent(102,'60')]})],TIPOWODs:[{notes:'Original',deleted:false,scaledops:['SCALED']}],...extra});
const personalRM=(id:number,owner=42,value='100.5',unit='kg')=>({id:String(id),name:'Source lift',chartUserId:owner,chartData1RM:[{date:Date.UTC(2026,8,1),lbs:'200',idAction:899},{date:Date.UTC(2026,8,24),lbs:value,idAction:900}],chartData3RM:[],chartData5RM:[],chartData10RM:[],chartDataWOD:[],history:[{date:Date.UTC(2026,8,24),idAction:900,desc:`${value} ${unit}`}],privateProfile:'private-canary'});
function published(request:QueryRequest):Response {
 const url=new URL(request.url);
 if(url.origin!=='https://shared-gym.aimharder.es') return failOutbound();
 if(url.pathname==='/')return new Response('timeLineContent: 7, userID: 300');
 if(url.pathname==='/api/activity'){expect(url.searchParams.get('userID')).toBe('300');return Response.json(feed());}
 if(url.pathname==='/api/activity/workout'){expect(['8001','8002']).toContain(url.searchParams.get('SEID'));return Response.json(workout());}
 if(url.pathname==='/api/exercise/101/42')return Response.json(personalRM(101));
 if(url.pathname==='/api/exercise/102/42')return Response.json(personalRM(102,42,'50','lbs'));
 return failOutbound();
}
test('published alternatives and difficulty prescriptions retain provenance and precise own-account loads inside one query',async()=>{
 synthetic=published;
 const result=await call(a(),'get_published_workouts',{date:'2099-11-01',className:'WOD'});
 expect(result.isError).not.toBe(true);
 expect(result.structuredContent).toMatchObject({status:'available',ambiguous:true,coverage:{status:'incomplete',scope:'upstream-feed-view',interpretation:'verified'},enrichment:{status:'complete',eligibleExercises:4},workouts:[{exercises:[{sourceExerciseId:101,prescription:{valor2:'85',loadUnit:'%RM'},personalLoad:{alternatives:[{calculatedLoad:'85.425',unit:'kg',basis:{value:'100.5',sourceDate:'2026-09-24'}}]}}],variants:[{label:'SCALED',exercises:[{sourceExerciseId:102,personalLoad:{alternatives:[{calculatedLoad:'30',unit:'lbs'}]}}]}]},{}]});
 expect(requests.filter(r=>r.url.pathname.startsWith('/api/exercise/')).map(r=>r.url.pathname)).toEqual(['/api/exercise/101/42','/api/exercise/102/42']);
 expect(JSON.stringify(result)).not.toMatch(/private-canary|synthetic-a|upstream-a@example/);
});

test('available instructions survive unsupported alternatives and ordinary RM read failures, but identity mismatches remain errors',async()=>{
 synthetic=request=>{
  const url=new URL(request.url);
  if(url.pathname==='/api/activity/workout')return Response.json(url.searchParams.get('SEID')==='8002'?{}:workout());
  if(url.pathname==='/api/exercise/102/42')return new Response('private-canary',{status:500});
  return published(request);
 };
 const result=await call(a(),'get_published_workouts',{date:'2099-11-01',className:'WOD'});
 expect(result.isError).not.toBe(true);
 expect(result.structuredContent).toMatchObject({status:'available',ambiguous:false,coverage:{interpretation:'unsupported'},enrichment:{status:'incomplete'},workouts:[{sessionId:null,titles:['Fuerza Ñ'],provenance:{sourceId:8001,dateField:'recordDate',dateLabel:'1 de Noviembre de 2099',publicationDateLabel:'31 de Octubre de 2099',classField:'wodClass',url:'https://shared-gym.aimharder.es/api/activity/workout?SEID=8001'},variants:[{label:'SCALED',exercises:[{personalLoad:{alternatives:[{status:'unavailable',reason:'personal-read-failed',calculatedLoad:null}]}}]}]}]});
 expect(JSON.stringify(result)).not.toContain('private-canary');
 synthetic=request=>new URL(request.url).pathname==='/api/exercise/101/42'?Response.json(personalRM(101,99)):published(request);
 const denied=await call(a(),'get_published_workouts',{date:'2099-11-01',className:'WOD'});
 expect(denied.isError).toBe(true);
 expect(JSON.stringify(denied)).toContain('IDENTITY_MISMATCH');
 expect(denied.structuredContent).toBeUndefined();
});

test('past prescriptions avoid present RM enrichment and absent content is only unavailable in the feed view',async()=>{
 synthetic=request=>new URL(request.url).pathname==='/api/activity/workout'?Response.json(workout({recordDate:'23 de Septiembre de 2026'})):published(request);
 const past=await call(a(),'get_published_workouts',{date:'2026-09-23',className:'WOD'});
 expect(past.isError).not.toBe(true);
 expect(past.structuredContent).toMatchObject({status:'available',enrichment:{status:'not-applicable'}});
 expect(JSON.stringify(past.structuredContent)).not.toContain('personalLoad');
 expect(requests.some(r=>r.url.pathname.startsWith('/api/exercise/'))).toBe(false);
 const absent=await call(a(),'get_published_workouts',{date:'2026-09-24',className:'WOD'});
 expect(absent.isError).not.toBe(true);
 expect(absent.structuredContent).toMatchObject({status:'unavailable',workouts:[],coverage:{status:'incomplete',scope:'upstream-feed-view'}});
});

test('malformed and failed schedules or upcoming views are safe errors while a validated empty view stays scoped',async()=>{
 synthetic=request=>{
  const url=new URL(request.url);
  if(url.pathname==='/api/bookings')return url.searchParams.get('day')==='20261025'?new Response('private-canary',{status:500}):Response.json(daily());
  if(url.pathname==='/api/nextBookings')return Response.json({nextClasses:[],history:[]});
  return failOutbound();
 };
 const broken=await call(a(),'get_class_sessions',{startDate:'2026-10-24',endDate:'2026-10-26'});
 expect(broken.isError).toBe(true);expect(broken.structuredContent).toBeUndefined();expect(JSON.stringify(broken)).not.toContain('private-canary');
 expect(requests.filter(r=>r.url.pathname==='/api/bookings')).toHaveLength(2);
 const empty=await call(a(),'get_upcoming_bookings');
 expect(empty.structuredContent).toMatchObject({bookingStatus:'none',bookings:[],coverage:{scope:'upstream-upcoming-view',startDate:null,endDate:null}});
 synthetic=request=>new URL(request.url).pathname==='/api/nextBookings'?Response.json({nextClasses:[],history:[],nextPage:2}):Response.json(daily([session(),session({id:502,className:'Other',ocupation:-1})]));
 expect((await call(a(),'get_upcoming_bookings')).isError).toBe(true);
 expect((await call(a(),'get_class_sessions',{startDate:'2026-10-25',endDate:'2026-10-25',className:'Metcon Ñ'})).isError).toBe(true);
});

test('strict remote inputs deny tenant, credential and URL selectors before upstream work',async()=>{
 const before=logins.length+identities.length;
 for(const [name,args] of [
  ['get_class_sessions',{startDate:'2026-02-29',endDate:'2026-03-01'}],
  ['get_class_sessions',{startDate:'2026-10-25',endDate:'2026-10-25',portalAccountId:'other-participant'}],
  ['get_published_workouts',{date:'2099-11-01',className:'WOD',username:'upstream-b@example.invalid'}],
  ['get_published_workouts',{date:'2099-11-01',className:'WOD',url:'https://attacker.invalid'}],
  ['get_upcoming_bookings',{familyId:73}],['get_booking_history',{gymId:'https://attacker.invalid'}],
 ] as const)expect((await call(a(),name,args)).isError).toBe(true);
 expect(logins.length+identities.length).toBe(before);expect(requests).toHaveLength(0);
 expect((await call(a(),'get_upcoming_bookings',{gymId:'inaccessible-gym'})).isError).toBe(true);
 expect(requests).toHaveLength(0);
});

test('one participant held inside workout RM enrichment does not block another or mix overlapping gym and source IDs',async()=>{
 let release!:()=>void;let entered!:()=>void;
 const held=new Promise<void>(resolve=>{release=resolve;});const arrived=new Promise<void>(resolve=>{entered=resolve;});
 synthetic=async request=>{
  const url=new URL(request.url);const cookie=request.headers.get('cookie');
  expect(['amhrdrauth=synthetic-a','amhrdrauth=synthetic-b']).toContain(cookie);
  if(url.pathname==='/api/exercise/101/42'){expect(cookie).toBe('amhrdrauth=synthetic-a');entered();await held;return Response.json(personalRM(101));}
  if(url.pathname==='/api/exercise/101/73'){expect(cookie).toBe('amhrdrauth=synthetic-b');return Response.json(personalRM(101,73,'80'));}
  if(url.pathname==='/api/exercise/102/73'){expect(cookie).toBe('amhrdrauth=synthetic-b');return Response.json(personalRM(102,73,'40','lbs'));}
  if(url.pathname==='/api/nextBookings')return Response.json({nextClasses:[booking()],history:[]});
  return published(request);
 };
 const pendingA=call(a(),'get_published_workouts',{date:'2099-11-01',className:'WOD'});
 let queued:ReturnType<typeof call>|undefined;
 try{
  await Promise.race([arrived,new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('A did not reach enrichment')),2000))]);
  queued=call(a(),'get_upcoming_bookings');
  const resultB=await Promise.race([call(b(),'get_published_workouts',{date:'2099-11-01',className:'WOD'}),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('B blocked by A')),2000))]);
  expect(resultB.structuredContent).toMatchObject({gym:{name:'B gym'},workouts:[{exercises:[{personalLoad:{alternatives:[{calculatedLoad:'68',unit:'kg'}]}}]},{}]});
  expect(requests.some(r=>r.url.pathname==='/api/nextBookings')).toBe(false);
 }finally{release();}
 expect((await pendingA).structuredContent).toMatchObject({gym:{name:'A gym'},workouts:[{exercises:[{personalLoad:{alternatives:[{calculatedLoad:'85.425',unit:'kg'}]}}]},{}]});
 expect((await queued!).isError).not.toBe(true);
});

test('bounded query recovery and one account authentication latch remain isolated, and persistent restart restores both connections',async()=>{
 let expired=1;
 synthetic=request=>{const url=new URL(request.url);if(url.pathname!=='/api/bookings')return failOutbound();if(request.headers.get('cookie')==='amhrdrauth=synthetic-a'&&expired-->0)return new Response(null,{status:401});return Response.json(daily());};
 const args={startDate:'2026-10-25',endDate:'2026-10-25'};
 const before=logins.filter(name=>name==='upstream-a@example.invalid').length;
 expect((await call(a(),'get_class_sessions',args)).isError).not.toBe(true);
 expect(logins.filter(name=>name==='upstream-a@example.invalid')).toHaveLength(before+1);
 expired=2;
 const repeated=await call(a(),'get_class_sessions',args);expect(repeated.isError).toBe(true);expect(JSON.stringify(repeated)).toContain('SESSION_EXPIRED');
 expect(logins.filter(name=>name==='upstream-a@example.invalid')).toHaveLength(before+2);
 rejectA=true;expired=1;
 const failed=await call(a(),'get_class_sessions',args);expect(JSON.stringify(failed)).toContain('AUTHENTICATION_FAILED');
 const after=logins.length;
 expect(JSON.stringify(await call(a(),'get_class_sessions',args))).toContain('AUTHENTICATION_FAILED');
 expect((await call(b(),'get_class_sessions',args)).structuredContent).toMatchObject({gym:{name:'B gym'}});expect(logins).toHaveLength(after);
 rejectA=false;expired=0;
 await worker.dispose();await start();
 for(const [cookie,name] of [[a(),'A gym'],[b(),'B gym']])expect((await call(cookie!,'get_class_sessions',args)).structuredContent).toMatchObject({gym:{name}});
});

test('verified gym overrides use their own membership and confirmed zone without changing the default or the other role',async()=>{
 profiles.get('upstream-b@example.invalid')!.gyms.push({role:'client',gym:'Second gym',centre_url:'second-gym.aimharder.es',boid:201});
 expect((await post('/api/portal/aimharder/settings',{defaultGym:'shared-gym',gymTimeZones:{'shared-gym':'America/New_York','second-gym':'Europe/London'}},b())).status).toBe(200);
 synthetic=request=>{const url=new URL(request.url);expect(url.pathname).toBe('/api/bookings');expect(url.searchParams.get('box')).toBe(url.hostname==='second-gym.aimharder.es'?'201':'200');return Response.json(daily());};
 const args={startDate:'2026-10-25',endDate:'2026-10-25'};
 expect((await call(b(),'get_class_sessions',{...args,gymId:'second-gym'})).structuredContent).toMatchObject({gym:{id:'second-gym',timeZone:'Europe/London',timeZoneStatus:'user-confirmed'},sessions:[{timeZone:'Europe/London'}]});
 expect((await call(b(),'get_class_sessions',args)).structuredContent).toMatchObject({gym:{id:'shared-gym',timeZone:'America/New_York',timeZoneStatus:'user-confirmed'}});
 expect((await call(a(),'get_class_sessions',args)).structuredContent).toMatchObject({gym:{id:'shared-gym',timeZone:'Europe/Madrid',timeZoneStatus:'assumed'}});
});

async function observed(name:string,args:Record<string,unknown>,outcome:string,code?:string) {
 const before=events.length;const result=await call(a(),name,args);
 for(let i=0;i<100&&!events.slice(before).some(e=>e.context.tool===name);i++)await new Promise(r=>setTimeout(r,10));
 const tools=events.slice(before).filter(e=>e.context.tool===name);
 expect(tools).toHaveLength(1);expect(tools[0]!.context).toMatchObject({event_type:'mcp.tool.completed',outcome,...(code?{code}:{})});
 expect(events.slice(before).filter(e=>e.trace_id===tools[0]!.trace_id&&e.context.event_type==='http.completed')).toEqual([expect.objectContaining({context:expect.objectContaining({http_status:200,outcome:'success'})})]);
 expect(tools[0]!.duration_ms).toBeGreaterThanOrEqual(0);
 expect(JSON.stringify(events.slice(before))).not.toMatch(/private-canary|upstream-a|synthetic-a|shared-gym|sourceBookingId/);
 return result;
}
test('native MCP completion telemetry distinguishes valid bounded views, recovered partial history, and HTTP 200 tool failures',async()=>{
 synthetic=()=>Response.json({nextClasses:[],history:[]});
 await observed('get_upcoming_bookings',{},'success');
 await observed('get_booking_history',{},'success');
 synthetic=()=>Response.json({nextClasses:[],history:[booking(),{id:9005}]});
 await observed('get_booking_history',{},'partial','BOOKING_HISTORY_PARTIAL');
 synthetic=()=>new Response('private-canary',{status:500});
 await observed('get_upcoming_bookings',{},'technical_failure','REQUEST_FAILED');
});

test('native context, empty schedules and workout feed/enrichment distinctions have explicit completion outcomes',async()=>{
 await observed('get_account_context',{},'success');
 await observed('get_account_context',{gymId:'inaccessible-gym'},'denied','GYM_NOT_ACCESSIBLE');
 synthetic=()=>Response.json(daily([]));
 await observed('get_class_sessions',{startDate:'2026-10-25',endDate:'2026-10-25'},'success');
 synthetic=published;
 await observed('get_published_workouts',{date:'2099-11-01',className:'WOD'},'success');
 await observed('get_published_workouts',{date:'2026-09-24',className:'WOD'},'success');
 synthetic=request=>new URL(request.url).pathname==='/api/exercise/102/42'?new Response(null,{status:500}):published(request);
 await observed('get_published_workouts',{date:'2099-11-01',className:'WOD'},'partial','RM_ENRICHMENT_INCOMPLETE');
 synthetic=request=>new URL(request.url).pathname==='/api/activity/workout'?Response.json({}):published(request);
 await observed('get_published_workouts',{date:'2099-11-01',className:'WOD'},'technical_failure','INVALID_WORKOUT_RESPONSE');
});

test('disabled, enabled and rejected export preserve native read output and exact upstream requests',async()=>{
 const results:unknown[]=[];const observedRequests:string[][]=[];
 for(const mode of ['disabled','enabled','rejected']){
  await worker.dispose();telemetryEnabled=mode==='disabled'?'false':'true';rejectTelemetry=mode==='rejected';await start();
  synthetic=()=>Response.json({nextClasses:[booking()],history:[]});requests.length=0;
  const before=events.length;results.push(await call(a(),'get_upcoming_bookings'));observedRequests.push(requests.map(r=>r.url.href));
  if(mode==='disabled')expect(events.length).toBe(before);
 }
 expect(results[1]).toEqual(results[0]);expect(results[2]).toEqual(results[0]);expect(observedRequests[1]).toEqual(observedRequests[0]);expect(observedRequests[2]).toEqual(observedRequests[0]);
 rejectTelemetry=false;
});
