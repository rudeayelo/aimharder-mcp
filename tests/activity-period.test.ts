import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { queryActivityPeriod } from '../src/activity-period-consumer.js';
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
const detail = (id = 1, extra = {}) => ({ userId: 42, boxId: 200, recordDate: '29 de Marzo de 2026', publishDate: '30 de Marzo de 2026', TIPOWODs: [{ notes: 'Sentadilla Ñ', deleted: false }], ejerRate: [{ ejerName: 'Sentadilla Ñ', tipoWOD: 0, valor1: ['5'] }], ...extra });
function calendar(days: Record<string, number[]>) { return { workouts: Object.fromEntries(Object.entries(days).map(([date, ids]) => [date, { rates: { ids }, TIPOWODs: {} }])) }; }
function respond(days: Record<string, number[]>) {
 upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(calendar(days))), http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(detail())));
}
test.each([
 ['2026-03-15T12:00:00Z','2026-02-01','2026-02-28',28],
 ['2024-03-15T12:00:00Z','2024-02-01','2024-02-29',29],
 ['2026-05-15T12:00:00Z','2026-04-01','2026-04-30',30],
 ['2026-02-15T12:00:00Z','2026-01-01','2026-01-31',31],
 ['2026-01-15T12:00:00Z','2025-12-01','2025-12-31',31],
])('resolves the full previous calendar month from %s',async(now,startDate,endDate,count)=>{
 const result=await queryActivityPeriod(await connect(),{period:'previous-month'},new Date(now));
 expect(result).toMatchObject({startDate,endDate,coverage:'complete',counts:{activityEntries:{observed:0,exact:0},daysWithActivity:{observed:0,exact:0}},basis:'activity-entries'});
 expect(result.completedDates).toHaveLength(count);
});
test.each([
 ['Europe/Madrid','2026-02-28T23:30:00Z','2026-02-01','2026-02-28'],
 ['America/Los_Angeles','2026-03-01T00:30:00Z','2026-01-01','2026-01-31'],
])('resolves the month in %s rather than the host zone',async(zone,now,startDate,endDate)=>{
 const result=await queryActivityPeriod(await connect({AIMHARDER_GYM_TIME_ZONES:JSON.stringify({'sample-gym':zone})}),{period:'previous-month'},new Date(now));
 expect(result).toMatchObject({startDate,endDate});
});
test('counts entries and dates independently without inventing same-day session grouping',async()=>{
 respond({'2026-03-29':[1,1,2,3]});
 const result=await queryActivityPeriod(await connect(),{startDate:'2026-03-01',endDate:'2026-03-31'});
 expect(result).toMatchObject({coverage:'complete',counts:{activityEntries:{observed:3,exact:3},daysWithActivity:{observed:1,exact:1}},basis:'activity-entries'});
 expect(result).not.toHaveProperty('trainingSessions');expect(result.entries).toHaveLength(3);expect(result.entries[0]?.blocks[0]?.notes).toBe('Sentadilla Ñ');
});
test('partitions a longer range and deduplicates repeated calendar references at overlapping month reads',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',({request})=>HttpResponse.json(calendar(new URL(request.url).searchParams.get('month')==='2'?{'2026-03-29':[1,1]}:{}))),http.get('https://aimharder.es/api/activity/workout',()=>HttpResponse.json(detail())));
 const result=await queryActivityPeriod(await connect(),{startDate:'2026-03-15',endDate:'2026-05-16'});
 expect(result.windows.map(w=>[w.startDate,w.endDate])).toEqual([['2026-03-15','2026-04-14'],['2026-04-15','2026-05-15'],['2026-05-16','2026-05-16']]);
 expect(result.counts.activityEntries.exact).toBe(1);expect(result.completedDates).toHaveLength(63);
});
test('retains recovered entries and rejects exact counts after a detail failure',async()=>{
 respond({'2026-03-29':[1,2]});
 upstream.use(http.get('https://aimharder.es/api/activity/workout',({request})=>new URL(request.url).searchParams.get('SEID')==='2'?new HttpResponse(null,{status:500}):HttpResponse.json(detail())));
 const result=await queryActivityPeriod(await connect(),{startDate:'2026-03-01',endDate:'2026-04-30'});
 expect(result).toMatchObject({coverage:'incomplete',counts:{activityEntries:{observed:1,exact:null},daysWithActivity:{observed:1,exact:null}}});
 expect(result.completedDates).not.toContain('2026-03-29');expect(result.windows).toHaveLength(1);
});
test('preserves earlier complete windows when a later calendar fails',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',({request})=>new URL(request.url).searchParams.get('month')==='3'?new HttpResponse(null,{status:403}):HttpResponse.json(calendar({'2026-03-29':[1]}))),http.get('https://aimharder.es/api/activity/workout',()=>HttpResponse.json(detail())));
 const result=await queryActivityPeriod(await connect(),{startDate:'2026-03-01',endDate:'2026-04-30'});
 expect(result).toMatchObject({coverage:'incomplete',counts:{activityEntries:{observed:1,exact:null}},windows:[{status:'complete'},{status:'error'}]});
 expect(result.completedDates).toHaveLength(31);
});
test('first failure is not an exact zero',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',()=>new HttpResponse(null,{status:403})));
 expect(await queryActivityPeriod(await connect(),{period:'previous-month'},new Date('2026-04-01T12:00:00Z'))).toMatchObject({coverage:'incomplete',counts:{activityEntries:{observed:0,exact:null}},windows:[{status:'error'}]});
});
test('rejects a source identity assigned to conflicting dates across windows',async()=>{
 upstream.use(http.get('https://aimharder.es/api/activityCalendar',({request})=>HttpResponse.json(calendar(new URL(request.url).searchParams.get('month')==='2'?{'2026-03-29':[1]}:{'2026-04-01':[1]}))));
 let calls=0;upstream.use(http.get('https://aimharder.es/api/activity/workout',()=>HttpResponse.json(detail(1,{recordDate:++calls===1?'29 de Marzo de 2026':'1 de Abril de 2026'}))));
 expect(await queryActivityPeriod(await connect(),{startDate:'2026-03-01',endDate:'2026-04-30'})).toMatchObject({coverage:'incomplete',counts:{activityEntries:{observed:1,exact:null}}});
});
test.each([{startDate:'2026-03-31',endDate:'2026-03-01'},{startDate:'2026-02-30',endDate:'2026-03-01'}])('rejects invalid interval before HTTP %o',async input=>{
 await expect(queryActivityPeriod(await connect(),input)).rejects.toThrow();expect(requests).toHaveLength(0);
});

test('a configured window limit preserves lower bounds and exposes uncovered dates',async()=>{
 const result=await queryActivityPeriod(await connect(),{startDate:'2026-03-01',endDate:'2026-04-30',maxWindows:1});
 expect(result).toMatchObject({coverage:'incomplete',counts:{interpretation:'recovered-lower-bound',activityEntries:{observed:0,exact:null}}});
 expect(result.windows).toHaveLength(1);expect(result.completedDates).toHaveLength(31);
});
test.each([0,13])('rejects invalid window limit %s before HTTP',async maxWindows=>{
 await expect(queryActivityPeriod(await connect(),{period:'previous-month',maxWindows})).rejects.toThrow();expect(requests).toHaveLength(0);
});
test('requires a confirmed gym zone even for explicit periods',async()=>{
 await expect(queryActivityPeriod(await connect({AIMHARDER_GYM_TIME_ZONES:undefined}),{startDate:'2026-03-01',endDate:'2026-03-31'})).rejects.toThrow('confirmed time zone');
 expect(requests.filter(r=>r.url.pathname.includes('activity'))).toHaveLength(0);
});
