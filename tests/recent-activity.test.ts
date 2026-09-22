import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { queryRecentActivity } from '../src/recent-activity-consumer.js';
import { createServer } from '../src/server.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
const requests: { method: string; url: URL }[] = [];
const membership = (slug = 'sample-gym', boid = 200) => ({
  id: 100, boid, role: 'client', gym: 'Gimnasio Ñ', centre_url: `${slug}.aimharder.es`,
});
beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  requests.length = 0;
  upstream.use(
    http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({
      data: { userData: { id: 42 }, auth: { authOK: true } },
    }, { headers: { 'Set-Cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/' } })),
    http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [membership()] }] })),
    http.get('https://aimharder.es/api/activityCalendar', ({ request }) => {
      expect(request.headers.get('cookie')).toContain('amhrdrauth=synthetic-cookie');
      return HttpResponse.json({ workouts: {} });
    }),
  );
});
upstream.events.on('request:start', ({ request }) => requests.push({ method: request.method, url: new URL(request.url) }));
afterEach(async () => {
  for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); }
  upstream.resetHandlers();
});
afterAll(() => upstream.close());
async function connect(extra: Record<string, string | undefined> = {}) {
  const server = createServer({
    AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password',
    AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}', ...extra,
  });
  const client = new Client({ name: 'booking-behavioral-harness', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  connections.push({ client, server });
  await server.connect(b); await client.connect(a);
  return client;
}
async function query(client: Client, args: Record<string, unknown> = {}) {
  return client.callTool({ name: 'get_personal_activity', arguments: { startDate: '2026-03-01', endDate: '2026-03-31', ...args } });
}

const detail = (id = 1, extra = {}) => ({ userId: 42, boxId: 200, recordDate: '29 de Marzo de 2026', publishDate: '30 de Marzo de 2026', TIPOWODs: [{ notes: 'Sentadilla Ñ', deleted: false }], ejerRate: [{ ejerName: 'Sentadilla Ñ', tipoWOD: 0, valor1: ['5'] }], ...extra });
function calendar(days: Record<string, number[]>) { return { workouts: Object.fromEntries(Object.entries(days).map(([date, ids]) => [date, { rates: { ids }, TIPOWODs: {} }])) }; }
function respond(days: Record<string, number[]>) {
 upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(calendar(days))), http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(detail())));
}
test('searches older explicit windows and returns whole tied days without session claims', async () => {
 upstream.use(http.get('https://aimharder.es/api/activityCalendar', ({request}) => HttpResponse.json(calendar(new URL(request.url).searchParams.get('month')==='2'?{'2026-03-29':[1,1,2]}:new URL(request.url).searchParams.get('month')==='1'?{'2026-02-01':[3]}:{}))), http.get('https://aimharder.es/api/activity/workout', ({request})=>HttpResponse.json(detail(1,{recordDate:new URL(request.url).searchParams.get('SEID')==='3'?'1 de Febrero de 2026':'29 de Marzo de 2026'}))));
 const result=await queryRecentActivity(await connect(),{endDate:'2026-03-31',count:2,maxWindows:2});
 expect(result).toMatchObject({trainingSessions:{status:'blocked',sessions:null},basis:'days-with-activity',searchStatus:'matched',latestDaysVerified:true,days:[{date:'2026-03-29',entries:[{sourceActivityId:1},{sourceActivityId:2}]},{date:'2026-02-01',entries:[{sourceActivityId:3}]}]});
 expect(result.windows.map(w=>[w.startDate,w.endDate])).toEqual([['2026-03-01','2026-03-31'],['2026-01-29','2026-02-28']]);
});
test('empty bounded search never claims an empty lifetime history',async()=>{
 const result=await queryRecentActivity(await connect(),{endDate:'2026-03-31',maxWindows:2});
 expect(result).toMatchObject({days:[],searchStatus:'limit-reached',latestDaysVerified:false});expect(result.windows).toHaveLength(2);
});
test('missing newer detail prevents latest claim and stops older retrieval',async()=>{
 respond({'2026-03-29':[1,2]});
 upstream.use(http.get('https://aimharder.es/api/activity/workout',({request})=>new URL(request.url).searchParams.get('SEID')==='2'?new HttpResponse(null,{status:500}):HttpResponse.json(detail())));
 const result=await queryRecentActivity(await connect(),{endDate:'2026-03-31'});
 expect(result).toMatchObject({searchStatus:'incomplete',latestDaysVerified:false,days:[{date:'2026-03-29',entries:[{sourceActivityId:1}]}]});expect(result.windows).toHaveLength(1);
});
test('first failure is exposed rather than an empty history claim',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',()=>new HttpResponse(null,{status:403})));
 expect(await queryRecentActivity(await connect(),{endDate:'2026-03-31'})).toMatchObject({searchStatus:'incomplete',latestDaysVerified:false,windows:[{status:'error'}]});
});
test('fewer days remain accurately labelled at retrieval limit',async()=>{
 respond({'2026-03-29':[1,2]});
 expect(await queryRecentActivity(await connect(),{endDate:'2026-03-31',maxWindows:1})).toMatchObject({searchStatus:'limit-reached',latestDaysVerified:false,days:[{date:'2026-03-29'}]});
});
test('same ID on different windows is a conflict, not two records',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',({request})=>HttpResponse.json(calendar(new URL(request.url).searchParams.get('month')==='2'?{'2026-03-29':[1]}:new URL(request.url).searchParams.get('month')==='1'?{'2026-02-01':[1]}:{}))));
 let calls=0;upstream.use(http.get('https://aimharder.es/api/activity/workout',()=>HttpResponse.json(detail(1,{recordDate:++calls===1?'29 de Marzo de 2026':'1 de Febrero de 2026'}))));
 const result=await queryRecentActivity(await connect(),{endDate:'2026-03-31'});
 expect(result).toMatchObject({searchStatus:'incomplete',latestDaysVerified:false,days:[{date:'2026-03-29',entries:[{sourceActivityId:1}]}]});
});
test('requested cutoff retains every tied entry and stops after enough days',async()=>{
 respond({'2026-03-29':[2,1]});
 const result=await queryRecentActivity(await connect(),{endDate:'2026-03-31',count:1});
 expect(result.days[0]?.entries.map(e=>e.sourceActivityId)).toEqual([1,2]);expect(result.windows).toHaveLength(1);expect(result.latestDaysVerified).toBe(true);
});
test.each([{maxWindows:0},{maxWindows:13},{count:0},{count:32}])('rejects unbounded search input %o before HTTP',async extra=>{
 await expect(queryRecentActivity(await connect(),{endDate:'2026-03-31',...extra})).rejects.toThrow();expect(requests).toHaveLength(0);
});
