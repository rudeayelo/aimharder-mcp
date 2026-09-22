import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
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
    http.get('https://sample-gym.aimharder.es/', () => HttpResponse.text('timeLineContent: 7, userID: 300')) ,
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail())),
    http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({
      data: { userData: { id: 42 }, auth: { authOK: true } },
    }, { headers: { 'Set-Cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/' } })),
    http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [membership()] }] })),
    http.get('https://sample-gym.aimharder.es/api/activity', ({ request }) => {
      expect(request.headers.get('cookie')).toContain('amhrdrauth=synthetic-cookie');
      expect(new URL(request.url).searchParams.get('userID')).toBe('300');
      return HttpResponse.json(feed());
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
  return client.callTool({ name: 'get_published_workouts', arguments: { date: '2026-09-23', className: 'WOD', ...args } });
}
const post = (extra = {}) => ({ id: 8001, day: '23 Sep', when: '20560923210000', wodClass: 'WOD', ejerRate: [], TIPOWODs: [{ title: 'Fuerza Ñ', notes: '3 rondas\nDescansa 60 segundos', deleted: 'false' }], ...extra });
const detail = (extra = {}) => ({ recordDate: '23 de Septiembre de 2026', publishDate: '22 de Septiembre de 2026', ejerRate: [{ ejerName: 'Sentadilla', tipoWOD: 0, valor1: ['10'], formaReg: 0 }], TIPOWODs: [{ notes: '3 rondas\nDescansa 60 segundos', deleted: false }], ...extra });
const feed = (elements = [post()]) => ({ timeLineContent: '7', timeLineFormat: '0', elements, firstLoaded: 8001, lastLoaded: 7990, curDate: '20260922' });
function respond(elements: unknown[]) { upstream.use(http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(feed(elements as ReturnType<typeof post>[])))); }
test('returns original future workout content with verified date, class and provenance, without a unique session', async () => {
 const result = await query(await connect());
 expect(result.isError).not.toBe(true);
 expect(result.structuredContent).toMatchObject({ status: 'available', ambiguous: false, workouts: [{ date: '2026-09-23', className: 'WOD', sessionId: null, titles: ['Fuerza Ñ'], blocks: [{ notes: '3 rondas\nDescansa 60 segundos' }], exercises: [{ name: 'Sentadilla', prescription: { valor1: ['10'] } }], provenance: { sourceId: 8001, dateField: 'recordDate' } }] });
});
test('announcements cannot establish applicability from future timestamps', async () => {
 respond([{ id: 1, highlight: 1, when: '20560923210000', desc: 'Announcement' }]);
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'unavailable', workouts: [], coverage: { scope: 'upstream-feed-view', status: 'incomplete' } });
});
test('distinct publications remain ambiguous even with unverified correction hints', async () => {
 respond([post(), post({ id: 8002, correctionOf: 8001 })]);
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'available', ambiguous: true, workouts: [{}, {}] });
});
test('unsupported dates do not become unavailable', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ recordDate: 'Sep 23, 2026' }))));
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'unsupported', workouts: [] });
});
test('detail failure is failed retrieval, not unpublished', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => new HttpResponse(null, { status: 500 })));
 expect((await query(await connect())).isError).toBe(true);
});
test('requires confirmed zone and rejects arbitrary publisher selection', async () => {
 expect((await query(await connect({ AIMHARDER_GYM_TIME_ZONES: undefined }))).isError).toBe(true);
 expect((await query(await connect(), { userID: 77 })).isError).toBe(true);
 expect(requests.filter(r => r.url.pathname === '/api/activity')).toHaveLength(0);
});

test('empty and deleted content is unavailable in the retrieved view', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ ejerRate: [], TIPOWODs: [{ notes: 'deleted', deleted: true }] }))));
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'unavailable', workouts: [] });
});
test('a malformed workout marker is unsupported, not an announcement', async () => {
 respond([post({ ejerRate: undefined })]);
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'unsupported' });
});
test('preserves block prescriptions and excludes unrelated private details', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ userName: 'private-name', comments: ['private-comment'], TIPOWODs: [{ notes: 'Completa 5 rondas', deleted: false, timecap: 1200, rondas: 5, rx: true }] }))));
 const result = await query(await connect());
 expect(result.structuredContent).toMatchObject({ workouts: [{ blocks: [{ notes: 'Completa 5 rondas', prescription: { timecap: 1200, rondas: 5, rx: true } }] }] });
 expect(JSON.stringify(result)).not.toMatch(/private-name|private-comment/);
});
test('publication date cannot replace a different intended workout date', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ recordDate: '24 de Septiembre de 2026', publishDate: '23 de Septiembre de 2026' }))));
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'unavailable', workouts: [] });
});
test('known content survives unsupported alternatives with explicit interpretation warning', async () => {
 respond([post(), post({ id: 8002 })]);
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', ({ request }) => HttpResponse.json(new URL(request.url).searchParams.get('SEID') === '8001' ? detail() : {})));
 expect((await query(await connect())).structuredContent).toMatchObject({ status: 'available', coverage: { interpretation: 'unsupported' }, workouts: [{}] });
});
test.each([{}, { timeLineFormat: '0', timeLineContent: '7', elements: [], curDate: '', nextPage: 2 }])('invalid feed is a retrieval error', async body => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(body)));
 expect((await query(await connect())).isError).toBe(true);
});
test.each(['timeLineContent: 7, userID: 300; timeLineContent: 7, userID: 301', '<html>Login</html>'])('does not invent a publisher from unsupported homepage', async page => {
 upstream.use(http.get('https://sample-gym.aimharder.es/', () => HttpResponse.text(page)));
 expect((await query(await connect())).isError).toBe(true);
 expect(requests.filter(r => r.url.pathname === '/api/activity')).toHaveLength(0);
});
test('one expiry recovery covers feed and detail retrieval', async () => {
 let calls = 0;
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => ++calls === 1 ? new HttpResponse(null, { status: 401 }) : HttpResponse.json(detail())));
 expect((await query(await connect())).isError).not.toBe(true);
 expect(requests.filter(r => r.url.pathname === '/api/login')).toHaveLength(2);
});
test('repeated expiry stops without returning unavailable', async () => {
 upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/workout', () => new HttpResponse(null, { status: 401 })));
 expect((await query(await connect())).isError).toBe(true);
 expect(requests.filter(r => r.url.pathname === '/api/login')).toHaveLength(2);
});
test('all operations remain the selected gym read-only allowlist', async () => {
 await query(await connect());
 for (const r of requests) {
  if (r.url.pathname === '/api/login') expect(r.method).toBe('POST');
  else expect(r.method).toBe('GET');
  expect(['/api/login', '/api/whoami', '/', '/api/activity', '/api/activity/workout']).toContain(r.url.pathname);
 }
});
test('routes override only to another verified gym and preserves its configured zone', async () => {
 upstream.use(
  http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [membership(), membership('other-gym', 201)] }] })),
  http.get('https://other-gym.aimharder.es/', () => HttpResponse.text('timeLineContent: 7, userID: 301')),
  http.get('https://other-gym.aimharder.es/api/activity', ({ request }) => {
   expect(new URL(request.url).searchParams.get('userID')).toBe('301'); return HttpResponse.json(feed());
  }),
  http.get('https://other-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail())),
 );
 const client = await connect({ AIMHARDER_DEFAULT_GYM: 'sample-gym', AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid","other-gym":"Atlantic/Canary"}' });
 expect((await query(client, { gymId: 'other-gym' })).structuredContent).toMatchObject({ gym: { id: 'other-gym' }, workouts: [{ timeZone: 'Atlantic/Canary' }] });
 expect((await query(client, { gymId: 'foreign-gym' })).isError).toBe(true);
 expect(requests.filter(r => r.url.hostname === 'foreign-gym.aimharder.es')).toHaveLength(0);
});
