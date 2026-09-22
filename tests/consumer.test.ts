import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { queryTraining } from '../src/consumer.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
const day = '2026-09-23';
const booking = (extra = {}) => ({ id: 901, day: 'Miércoles, 23 de Septiembre de 2026', time: '07:00 - 08:00', className: 'WOD', bookState: 1, ...extra });
const post = (extra = {}) => ({ id: 801, wodClass: 'WOD', ejerRate: [], TIPOWODs: [{ title: 'Fuerza Ñ' }], ...extra });
const detail = () => ({ recordDate: '23 de Septiembre de 2026', publishDate: '22 de Septiembre de 2026', TIPOWODs: [{ notes: '3 rondas\nDescansa 60 segundos', deleted: false }], ejerRate: [{ ejerName: 'Sentadilla', tipoWOD: 0, valor1: ['10'] }] });
const feed = (elements = [post()]) => ({ timeLineContent: '7', timeLineFormat: '0', elements, curDate: '20260922' });
beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => upstream.use(
  http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({ data: { userData: { id: 42 }, auth: { authOK: true } } }, { headers: { 'Set-Cookie': 'amhrdrauth=synthetic; Domain=.aimharder.es; Path=/' } })),
  http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [{ id: 100, boid: 200, role: 'client', gym: 'Gimnasio Ñ', centre_url: 'sample-gym.aimharder.es' }] }] })),
  http.get('https://sample-gym.aimharder.es/', () => HttpResponse.text('timeLineContent: 7, userID: 300')),
  http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(feed())),
  http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail())),
  http.get('https://sample-gym.aimharder.es/api/nextBookings', () => HttpResponse.json({ nextClasses: [booking(), booking({ id: 902, time: '19:00 - 20:00' }), booking({ id: 903, className: 'Metcon' }), booking({ id: 904, day: 'Jueves, 24 de Septiembre de 2026' })], history: [] })),
  http.get('https://sample-gym.aimharder.es/api/bookings', () => HttpResponse.json({ bookings: [{ id: 501, classId: 10, className: 'WOD', time: '07:00 - 08:00' }, { id: 502, classId: 10, className: 'WOD', time: '19:00 - 20:00' }, { id: 503, classId: 11, className: 'Metcon', time: '07:00 - 08:00' }] })),
));
afterEach(async () => { for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); } upstream.resetHandlers(); });
afterAll(() => upstream.close());
async function connect(extra: Record<string, string | undefined> = {}) {
  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password', AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}', ...extra });
  const client = new Client({ name: 'training-composition-harness', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair(); connections.push({ client, server });
  await server.connect(b); await client.connect(a); return client;
}
async function query(options = {}) { return queryTraining(await connect(), { date: 'tomorrow', className: 'WOD', now: new Date('2026-09-22T12:00:00Z'), ...options }); }

test('composes original future content, every matching session and booked time without session joins', async () => {
  const result = await query();
  expect(result.date).toBe(day);
  expect(result.classes).toMatchObject({ status: 'success', data: { sessions: [{ startTime: '07:00' }, { startTime: '19:00' }] } });
  expect(result.workouts).toMatchObject({ status: 'success', data: { workouts: [{ sessionId: null, titles: ['Fuerza Ñ'], blocks: [{ notes: '3 rondas\nDescansa 60 segundos' }], exercises: [{ name: 'Sentadilla' }] }] } });
  expect(result.bookingSummary).toMatchObject({ status: 'booked', completeness: 'unconfirmed', bookings: [{ startTime: '07:00', sessionId: null }, { startTime: '19:00', sessionId: null }] });
});
test.each(['2026-03-28T23:30:00Z', '2026-10-24T22:30:00Z', '2026-12-31T23:30:00Z'])('tomorrow uses the confirmed gym calendar at %s across DST/year boundaries', async instant => {
  const expected = instant.startsWith('2026-03') ? '2026-03-30' : instant.startsWith('2026-10') ? '2026-10-26' : '2027-01-02';
  expect((await query({ now: new Date(instant) })).date).toBe(expected);
});
test('explicit dates and class types are reusable beyond tomorrow WOD', async () => {
  const result = await query({ date: day, className: 'Metcon' });
  expect(result.bookingSummary.bookings).toMatchObject([{ classType: { name: 'Metcon' } }]);
  expect(result.workouts).toMatchObject({ status: 'success', data: { status: 'unavailable' } });
});
test('keeps ambiguous publication titles/provenance separate from all bookings', async () => {
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(feed([post(), post({ id: 802, TIPOWODs: [{ title: 'Alternativa' }] })]))));
  const result = await query();
  expect(result.workouts).toMatchObject({ status: 'success', data: { ambiguous: true, workouts: [{ titles: ['Fuerza Ñ'], sessionId: null, provenance: { sourceId: 801 } }, { titles: ['Alternativa'], sessionId: null, provenance: { sourceId: 802 } }] } });
  expect(result.bookingSummary.bookings).toHaveLength(2);
});
test.each(['/api/nextBookings', '/api/activity', '/api/bookings'])('independent failure at %s preserves valid other queries', async path => {
  upstream.use(http.get(`https://sample-gym.aimharder.es${path}`, () => new HttpResponse('private-error', { status: 500 })));
  const result = await query();
  expect(result.classes.status).toBe(path === '/api/bookings' ? 'error' : 'success');
  expect(result.workouts.status).toBe(path === '/api/activity' ? 'error' : 'success');
  expect(result.bookingSummary.status).toBe(path === '/api/nextBookings' ? 'unconfirmed' : 'booked');
  expect(result.bookingSummary.bookings).toHaveLength(path === '/api/nextBookings' ? 0 : 2);
  expect(JSON.stringify(result)).not.toContain('private-error');
});
test.each([[], [booking({ bookState: 0 })], [booking({ bookState: 99 })], [booking({ className: null })]].map(rows => ({ rows })))('empty, waitlisted or unidentified view never establishes date-specific absence', async ({ rows }) => {
  upstream.use(http.get('https://sample-gym.aimharder.es/api/nextBookings', () => HttpResponse.json({ nextClasses: rows, history: [] })));
  const result = await query();
  expect(result.bookingView.status).toBe('success');
  expect(result.bookingSummary).toMatchObject({ status: 'unconfirmed', completeness: 'unconfirmed', bookings: [] });
  expect(result.bookingSummary.otherCandidates).toHaveLength(rows.length);
  expect(result.workouts.status).toBe('success');
});
test('requires a user-confirmed zone and verified gym', async () => {
  await expect(queryTraining(await connect({ AIMHARDER_GYM_TIME_ZONES: undefined }), { date: 'tomorrow', className: 'WOD' })).rejects.toThrow('confirmed');
  await expect(query({ gymId: 'inaccessible' })).rejects.toThrow('context');
});

test('an incomplete booking envelope retains workout content and confirmed absence is never claimed', async () => {
  upstream.use(http.get('https://sample-gym.aimharder.es/api/nextBookings', () => HttpResponse.json({ nextClasses: [booking()], history: [], hasMore: true })));
  const result = await query();
  expect(result.workouts).toMatchObject({ status: 'success', data: { status: 'available' } });
  expect(result.bookingSummary).toMatchObject({ status: 'unconfirmed', bookings: [] });
});
test('malformed workout responses preserve every valid reservation', async () => {
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json({ elements: [], privateField: 'private-content' })));
  const result = await query();
  expect(result.workouts.status).toBe('error');
  expect(result.bookingSummary.bookings).toHaveLength(2);
  expect(JSON.stringify(result)).not.toContain('private-content');
});
test('rejects invalid dates before authenticating', async () => {
  let loginCount = 0;
  upstream.use(http.post('https://login.aimharder.es/api/login', () => { loginCount++; return new HttpResponse(null, { status: 500 }); }));
  await expect(query({ date: '2026-02-30' })).rejects.toThrow();
  expect(loginCount).toBe(0);
});
