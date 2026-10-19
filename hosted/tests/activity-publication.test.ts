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
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/activity-publication-fixture-worker.js', port: 8801,
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB'], resourcePersistencePath: directory,
    durableObjects: { ACCOUNT_CONNECTIONS: { className: 'AccountConnection', useSQLite: true } },
    bindings: { BASE_URL: origin, AUTH_SECRET: 'synthetic-account-connection-auth-secret-long-enough',
      VAULT_KEYS: JSON.stringify(keys), VAULT_ACTIVE_KEY_ID: active },
    outboundService: async request => {
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
