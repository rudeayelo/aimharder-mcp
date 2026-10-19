import { spawn } from 'node:child_process';
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
const mail:{to:string[];subject:string;text:string}[]=[];
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
const refreshes=new Map<string,string>();
function post(path: string, body: unknown, cookie = '', requestOrigin = origin) {
  return worker.dispatchFetch(origin + path, { method: 'POST', headers: { origin: requestOrigin, cookie, 'content-type': 'application/json' }, body: JSON.stringify(body), redirect: 'manual' });
}
async function start(keys: Record<string,string> = {first:syntheticKey}, active = 'first') {
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/account-deletion-fixture-worker.js', port: 8805,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB','RECOVERY_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { RECOVERY_AUTHORITY_ID:'synthetic-authority', BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      RESEND_API_KEY:'synthetic-resend',MAIL_FROM:'noreply@example.invalid',VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
      if(request.url==='https://api.resend.com/emails'){mail.push(await request.json() as typeof mail[number]);return Response.json({id:'synthetic-mail'});}
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
  const result=await response.json() as {access_token:string;refresh_token:string};refreshes.set(result.access_token,result.refresh_token);return result.access_token;
}
async function call(cookie: string, name: string, args: Record<string, unknown> = {}, bearer?: string) {
  bearer ??= await token(cookie);
  const client = new Client({ name: 'synthetic-account-connection', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'), { requestInit: { headers: { authorization: `Bearer ${bearer}` } } }));

    return await client.callTool({ name, arguments: args }) as {isError?:boolean;structuredContent?:Record<string,unknown>;content:unknown};
  } finally { await client.close(); }
}
beforeAll(async()=>{await buildWorker('tests/account-deletion-fixture-worker.ts', 'dist/account-deletion-fixture-worker.js');});
beforeEach(async()=>{
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
afterEach(async()=>{ await worker?.dispose(); if(directory)await rm(directory,{recursive:true,force:true}); });

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
test('deleting a linked portal identity immediately denies cached sessions and MCP while leaving another account connected',async()=>{
 await worker.dispatchFetch(origin+'/__fixture/linked-google');
 const bearer=await token(a()); const otherBearer=await token(b());
 const accountPage=await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}});
 expect(await accountPage.text()).toContain('Delete portal account');
 const deleted=await post('/api/portal/account/delete',{confirmed:true},a());
 expect(deleted.status).toBe(204);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status).toBe(401);
 expect((await post('/api/auth/sign-in/email',{email:'participant@example.invalid',password:'synthetic-portal-password'})).ok).toBe(false);
 await expect(call(a(),'get_account_context',{},bearer)).rejects.toThrow();
 expect((await call(b(),'get_account_context',{},otherBearer)).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
 expect(writes).toEqual([]);
});

test('deletion rejects missing confirmation and foreign origins without changing access',async()=>{
 expect((await post('/api/portal/account/delete',{confirmed:false},a())).status).toBe(400);
 expect((await post('/api/portal/account/delete',{confirmed:true},a(),'https://foreign.invalid')).status).toBe(403);
 expect((await call(a(),'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'A gym'}});
});

test('a closed restore gate denies cached auth and mail while an admitted original read must drain without a lease timeout',async()=>{
 synthetic=bookingSource;const bearer=await token(a());
 let release!:()=>void;let entered!:()=>void;
 const held=new Promise<void>(resolve=>release=resolve);const arrived=new Promise<void>(resolve=>entered=resolve);
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/bookings'){entered();await held;}return bookingSource(request);};
 const reading=call(a(),'get_class_sessions',{startDate:'2026-10-25',endDate:'2026-10-25'},bearer);await arrived;
 const closed=await worker.dispatchFetch(origin+'/__fixture/recovery/close');expect(closed.status).toBe(200);expect((await closed.json() as {leases:number}).leases).toBeGreaterThan(0);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status).toBe(503);
 expect((await post('/api/auth/request-password-reset',{email:'participant@example.invalid',redirectTo:origin+'/reset-password'})).status).toBe(503);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/seal')).status).toBe(409);
 release();await reading;
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/seal')).status).toBe(200);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/open')).status).toBe(409);
});

test('deletion fences held preflight immediately while original possible sends finish read-back without replay',async()=>{
 synthetic=bookingSource;booked=new Set();writes=[];const bearer=await token(a());
 const prepared=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(r=>release=r);const arrived=new Promise<void>(r=>entered=r);
 synthetic=async request=>{if(new URL(request.url).pathname==='/api/nextBookings'){entered();await held;}return bookingSource(request);};
 const executing=call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer);await arrived;
 const deleting=post('/api/portal/account/delete',{confirmed:true},a());
 // Wait for the public denial rather than observing internal rows.
 let denied=0;for(let n=0;n<30;n++){denied=(await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status;if(denied===401)break;await new Promise(r=>setTimeout(r,5));}
 expect(denied).toBe(401);release();expect((await executing).isError).toBe(true);expect((await deleting).status).toBe(204);expect(writes).toEqual([]);
});

test('a deletion cleanup interruption preserves independent denial for cached sessions, tokens and both login methods',async()=>{
 await worker.dispatchFetch(origin+'/__fixture/linked-google');const bearer=await token(a());
 // Synthetic failure in the real D1 cleanup transaction, no auth/client mock.
 const db=await worker.getD1Database('AUTH_DB');await db.exec("CREATE TRIGGER synthetic_delete_fault BEFORE DELETE ON user BEGIN SELECT RAISE(ABORT,'synthetic cleanup interruption'); END");
 const deletion=await post('/api/portal/account/delete',{confirmed:true},a());expect(deletion.status).toBe(503);
 expect((await worker.dispatchFetch(origin+'/api/auth/get-session',{headers:{cookie:a()}})).status).toBe(403);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status).toBe(401);
 await expect(call(a(),'get_account_context',{},bearer)).rejects.toThrow();
 expect((await post('/api/auth/sign-in/email',{email:'participant@example.invalid',password:'synthetic-portal-password'})).ok).toBe(false);
});

async function backupFixture(){
 const db=await worker.getD1Database('AUTH_DB');
 const tables=(await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%'").all<{name:string}>()).results;
 return Promise.all(tables.map(async row=>({name:row.name,rows:(await db.prepare(`SELECT * FROM "${row.name}"`).all<Record<string,unknown>>()).results})));
}
async function restoreFixture(snapshot:Awaited<ReturnType<typeof backupFixture>>){
 const db=await worker.getD1Database('AUTH_DB');
 const statements=[db.prepare('PRAGMA defer_foreign_keys=ON'),...snapshot.map(table=>db.prepare(`DELETE FROM "${table.name}"`))];
 for(const table of snapshot)for(const row of table.rows){const keys=Object.keys(row);statements.push(db.prepare(`INSERT INTO "${table.name}" (${keys.map(k=>`"${k}"`).join(',')}) VALUES (${keys.map(()=>'?').join(',')})`).bind(...keys.map(key=>row[key])));}
 await db.batch(statements);
}
async function freshB(email='other@example.invalid'){
 const reset=await post('/api/auth/request-password-reset',{email,redirectTo:origin+'/reset-password'});expect(reset.status).toBe(200);
 const recovery=new URL(mail.findLast(m=>m.to[0]===email)!.text.match(/http[^\s]+/)![0]!);
 // Maintained mail links route to the form with the token in its redirect.
 const redirect=await worker.dispatchFetch(recovery.href,{redirect:'manual'});const location=new URL(redirect.headers.get('location')!,origin);
 expect((await post('/api/auth/reset-password',{token:location.searchParams.get('token'),newPassword:'synthetic-new-portal-password'})).status).toBe(200);
 const signed=await post('/api/auth/sign-in/email',{email,password:'synthetic-new-portal-password'});expect(signed.status).toBe(200);
 return signed.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
}
async function applyNativeRecoveryPlan(){
 const recovery=await worker.getD1Database('RECOVERY_DB');const db=await worker.getD1Database('AUTH_DB');
 const head=(await recovery.prepare('SELECT authorityId,checkpoint,epoch,closedAt,gate FROM recovery_head').first())!;
 const snapshot=JSON.parse((await recovery.prepare('SELECT value FROM recovery_snapshot WHERE checkpoint=?').bind(head.checkpoint).first<{value:string}>())!.value);
 const restore=(await recovery.prepare('SELECT bookmark,targetAt,authorizedAt FROM recovery_restore WHERE checkpoint=?').bind(head.checkpoint).first())!;
 const intervals=(await recovery.prepare('SELECT closedAt,openedAt FROM recovery_interval').all()).results;
 const deletedUsers=(await recovery.prepare('SELECT userId FROM recovery_deleted').all<{userId:string}>()).results.map(row=>row.userId);
 const deletedInvitations=(await recovery.prepare('SELECT id FROM recovery_invitation').all<{id:string}>()).results.map(row=>row.id);
 const command=spawn(process.execPath,['scripts/prepare-recovery.ts'],{cwd:process.cwd(),env:process.env});let output='',errors='';
 command.stdout.on('data',chunk=>output+=String(chunk));command.stderr.on('data',chunk=>errors+=String(chunk));
 command.stdin.end(JSON.stringify({applicationDatabaseId:'00000000-0000-4000-8000-000000000001',recoveryDatabaseId:'00000000-0000-4000-8000-000000000002',...head,leases:0,snapshot,restore,intervals,deletedUsers,deletedInvitations,backendRecoverableDays:7,copiedDeletedPayloads:false}));
 expect(await new Promise(resolve=>command.on('close',resolve))).toBe(0);expect(errors).toBe('');
 const plan=JSON.parse(output) as {authDatabaseStatements:{sql:string;params:unknown[]}[]};
 // Same shape the native REST query API accepts. No cross-request transaction is assumed.
 for(const [n,statement] of plan.authDatabaseStatements.entries()){
   await db.prepare(statement.sql).bind(...statement.params).run();
   if(n===3){expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:b()}})).status).toBe(503);expect((await worker.dispatchFetch(origin+'/__fixture/recovery/open')).status).toBe(409);}
 }
}
test('controlled rollback cannot revive deleted identities or old grants and retains only the latest permitted unaffected connection',async()=>{
 synthetic=bookingSource;booked=new Set();writes=[];
 const oldA=await token(a()),oldB=await token(b());
 const prepared=(await call(b(),'prepare_booking_creation',target,oldB)).structuredContent as {actionReference:string};
 const snapshot=await backupFixture();
 expect((await post('/api/portal/account/delete',{confirmed:true},a())).status).toBe(204);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/close')).status).toBe(200);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/seal')).status).toBe(200);
 expect((await post('/__fixture/recovery/authorize',{bookmark:'synthetic-pre-deletion',targetAt:Date.now()-60000})).status).toBe(200);
 await restoreFixture(snapshot);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status).toBe(503);
 await applyNativeRecoveryPlan();
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/open')).status).toBe(200);
 expect((await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status).toBe(401);
 await expect(call(a(),'get_account_context',{},oldA)).rejects.toThrow();await expect(call(b(),'get_account_context',{},oldB)).rejects.toThrow();
 expect((await post('/api/auth/sign-in/email',{email:'other@example.invalid',password:'synthetic-portal-password'})).ok).toBe(false);
 const refresh=await worker.dispatchFetch(origin+'/api/auth/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',client_id:'fixture-client',refresh_token:refreshes.get(oldB)!,resource:origin+'/mcp'}).toString()});expect(refresh.status).toBe(400);
 const fresh=await freshB();expect((await call(fresh,'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true})).isError).toBe(true);expect((await call(fresh,'get_account_context')).structuredContent).toMatchObject({selectedGym:{name:'B gym'}});
 expect(writes).toEqual([]);
});

test('restore authorization rejects dirty quarantine points and points beyond the selected seven-day backend horizon',async()=>{
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/close')).status).toBe(200);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/seal')).status).toBe(200);
 const dirty=await post('/__fixture/recovery/authorize',{bookmark:'synthetic-dirty',targetAt:Date.now()});expect(dirty.status).toBe(409);
 const old=await post('/__fixture/recovery/authorize',{bookmark:'synthetic-old',targetAt:Date.now()-8*86400000});expect(old.status).toBe(409);
 const clean=await post('/__fixture/recovery/authorize',{bookmark:'synthetic-clean',targetAt:Date.now()-60000});expect(clean.status).toBe(200);
});

test('a possibly sent write reconciles on its original account during deletion and cannot recreate deleted persisted credentials',async()=>{
 synthetic=bookingSource;booked=new Set();writes=[];const bearer=await token(a());
 const prepared=(await call(a(),'prepare_booking_creation',target,bearer)).structuredContent as {actionReference:string};
 let release!:()=>void;let entered!:()=>void;const held=new Promise<void>(r=>release=r);const arrived=new Promise<void>(r=>entered=r);
 synthetic=async request=>{const url=new URL(request.url);if(url.pathname==='/api/book'){const result=bookingSource(request);entered();await held;return result;}return bookingSource(request);};
 const execution=call(a(),'execute_booking_creation',{actionReference:prepared.actionReference,confirmed:true},bearer);await arrived;
 const deleting=post('/api/portal/account/delete',{confirmed:true},a());let denied=0;
 for(let n=0;n<30;n++){denied=(await worker.dispatchFetch(origin+'/account',{headers:{cookie:a()}})).status;if(denied===401)break;await new Promise(r=>setTimeout(r,5));}
 expect(denied).toBe(401);release();expect((await execution).structuredContent).toMatchObject({status:'confirmed',gym:{name:'A gym'}});
 expect((await deleting).status).toBe(204);expect(writes).toEqual(['amhrdrauth=synthetic-a']);
 await worker.dispose();await start();await expect(call(a(),'get_account_context',{},bearer)).rejects.toThrow();expect(writes).toHaveLength(1);
});

test('restore preserves later suspension and role policy while discarding a disconnected connection',async()=>{
 const db=await worker.getD1Database('AUTH_DB');await db.exec("UPDATE portal_participant SET role='admin' WHERE userId='portal-fixture'; UPDATE portal_activity_policy SET publication=1 WHERE role='user'");
 const snapshot=await backupFixture();
 expect((await post('/api/portal/aimharder/disconnect',{},b())).status).toBe(200);
 expect((await post('/api/portal/participants/other-participant/suspend',{},a())).status).toBe(204);
 const policy=await worker.dispatchFetch(origin+'/portal/activity-access',{method:'POST',headers:{origin,cookie:a(),'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({role:'user',feature:'publication',enabled:'0'}).toString(),redirect:'manual'});expect(policy.status).toBe(303);
 expect((await worker.dispatchFetch(origin+'/__fixture/recovery/close')).status).toBe(200);expect((await worker.dispatchFetch(origin+'/__fixture/recovery/seal')).status).toBe(200);
 expect((await post('/__fixture/recovery/authorize',{bookmark:'synthetic-prior-access',targetAt:Date.now()-60000})).status).toBe(200);
 await restoreFixture(snapshot);expect((await worker.dispatchFetch(origin+'/__fixture/recovery/reconcile')).status).toBe(200);expect((await worker.dispatchFetch(origin+'/__fixture/recovery/open')).status).toBe(200);
 expect((await post('/api/auth/sign-in/email',{email:'other@example.invalid',password:'synthetic-portal-password'})).ok).toBe(false);
 // Trusted initial recovery proof uses the maintained reset flow; suspended identity receives no mail.
 const count=mail.length;expect((await post('/api/auth/request-password-reset',{email:'other@example.invalid',redirectTo:origin+'/reset-password'})).status).toBe(200);expect(mail.length).toBe(count);
 const admin=await freshB('participant@example.invalid');
 const participants=await worker.dispatchFetch(origin+'/api/portal/participants',{headers:{cookie:admin}});expect(await participants.json()).toMatchObject({participants:expect.arrayContaining([expect.objectContaining({userId:'other-participant',status:'suspended',connectionStatus:'not-connected'})])});
 const policyHtml=await worker.dispatchFetch(origin+'/admin/activity-access',{headers:{cookie:admin}}).then(r=>r.text());expect(policyHtml).toMatch(/user: Activity publication<select name="enabled"><option value="1">Enabled<\/option><option value="0" selected>/);
 expect((await post('/api/portal/participants/other-participant/reactivate',{},admin)).status).toBe(204);
 const fresh=await freshB();expect(JSON.stringify(await call(fresh,'get_account_context'))).toContain('not-connected');
});
