import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
let reservationId: number | null;
let bookState: number | null;
let cancelledId: number | null;
let duplicate = false;
let upcomingState: number | null;
let writes: string[];
let response: () => Response;
let scheduleReads: number;

const row = (id = 501, idres = reservationId) => ({ id, idres, classId: 10, className: 'Open Box', time: '10:00 - 11:00',
  ocupation: 8, limit: 20, enabled: 1, bookState, cancelledId, resadmin: 0, hidden: 0 });
const day = () => ({ clasesDisp: 'Classes', day: 'Source label', bookings: duplicate ? [row(), row(502, 901)] : [row()], timetable: [], seminars: [] });
const upcoming = () => ({ nextClasses: upcomingState === null ? [] : [{ id: 777, day: 'Sábado, 26 de Septiembre de 2026',
  time: '10:00 - 11:00', className: 'Open Box', bookState: upcomingState }], history: [] });

beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  reservationId = 900; bookState = 1; cancelledId = null; duplicate = false; upcomingState = 1; writes = []; scheduleReads = 0;
  response = () => { bookState = null; cancelledId = 900; upcomingState = null; return HttpResponse.json({ cancelState: 1 }); };
  upstream.use(
    http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({ data: { userData: { id: 42 }, auth: { authOK: true } } },
      { headers: { 'Set-Cookie': 'amhrdrauth=synthetic; Domain=.aimharder.es; Path=/' } })),
    http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [
      { role: 'client', boid: 200, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' },
    ] }] })),
    http.get('https://sample-gym.aimharder.es/api/bookings', () => { scheduleReads++; return HttpResponse.json(day()); }),
    http.get('https://sample-gym.aimharder.es/api/nextBookings', () => HttpResponse.json(upcoming())),
    http.post('https://sample-gym.aimharder.es/api/cancelBook', async ({ request }) => {
      writes.push(await request.text()); return response();
    }),
  );
});
afterEach(async () => {
  for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); }
  upstream.resetHandlers(); vi.useRealTimers();
});
afterAll(() => upstream.close());

async function connect() {
  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic',
    AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}' });
  const client = new Client({ name: 'cancellation-execution-test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  connections.push({ client, server });
  await server.connect(b); await client.connect(a);
  return client;
}
async function prepare(client: Client) {
  const result = await client.callTool({ name: 'prepare_booking_cancellation', arguments: {
    date: '2026-09-26', className: 'Open Box', startTime: '10:00', endTime: '11:00',
  } });
  return (result.structuredContent as { actionReference: string }).actionReference;
}
async function execute(client: Client, actionReference: string, extra: Record<string, unknown> = {}) {
  return client.callTool({ name: 'execute_booking_cancellation', arguments: { actionReference, confirmed: true, ...extra } });
}

test('one confirmed cancellation uses the schedule reservation and fresh reads', async () => {
  const client = await connect();
  const reference = await prepare(client);
  const result = await execute(client, reference);
  expect(result.structuredContent).toMatchObject({ status: 'confirmed', observedState: 'cancelled', target: { className: 'Open Box' },
    credit: { balance: null, entitlementPeriod: null } });
  expect(writes).toHaveLength(1);
  expect(new URLSearchParams(writes[0])).toEqual(new URLSearchParams({ id: '900', late: '0' }));
  expect(scheduleReads).toBe(3);
  expect(JSON.stringify(result)).not.toMatch(/idres|reservationId|sourceId|familyId|accountId|boxId|refunded/i);
  expect((await execute(client, reference)).isError).toBe(true);
  expect(writes).toHaveLength(1);
});

test('confirmation, selectors, expiry, changed reservation and ambiguity block writes', async () => {
  const client = await connect();
  let reference = await prepare(client);
  expect((await execute(client, reference, { confirmed: false })).isError).toBe(true);
  expect((await execute(client, reference, { familyId: 42 })).isError).toBe(true);
  expect((await execute(client, reference, { gymId: 'other-gym' })).isError).toBe(true);
  reservationId = 901;
  expect((await execute(client, reference)).structuredContent).toMatchObject({ status: 'stale' });
  reservationId = 900;
  reference = await prepare(client);
  duplicate = true;
  expect((await execute(client, reference)).structuredContent).toMatchObject({ status: 'stale' });
  duplicate = false;
  reference = await prepare(client);
  cancelledId = 900;
  expect((await execute(client, reference)).structuredContent).toMatchObject({ status: 'stale' });
  cancelledId = null;
  reference = await prepare(client);
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(Date.now() + 120_001);
  expect((await execute(client, reference)).isError).toBe(true);
  expect(writes).toHaveLength(0);
});

test('late credit warning remains pending with one standard write', async () => {
  response = () => HttpResponse.json({ cancelState: 2, errorMssg: 'private warning' });
  const client = await connect();
  const result = await execute(client, await prepare(client));
  expect(result.structuredContent).toMatchObject({ status: 'pending-credit-loss', observedState: 'booked' });
  expect(JSON.stringify(result)).not.toContain('private warning');
  expect(writes).toHaveLength(1);
  expect(new URLSearchParams(writes[0]).get('late')).toBe('0');
});

test('denial with unchanged reservation is rejected; conflicting views remain uncertain', async () => {
  response = () => HttpResponse.json({ cancelState: 3, errorMssg: 'private denial' });
  const client = await connect();
  expect((await execute(client, await prepare(client))).structuredContent).toMatchObject({ status: 'rejected', observedState: 'booked' });
  response = () => { bookState = null; cancelledId = 900; return HttpResponse.json({ cancelState: 1 }); };
  expect((await execute(client, await prepare(client))).structuredContent).toMatchObject({ status: 'uncertain' });
  expect(writes).toHaveLength(2);
});

test.each(['unsupported', 'transport', 'authentication'] as const)('%s write outcome is uncertain with no replay', async (mode) => {
  response = () => mode === 'unsupported' ? HttpResponse.json({ other: 'private value' })
    : mode === 'authentication' ? new HttpResponse(null, { status: 401 }) : HttpResponse.error();
  const client = await connect();
  const result = await execute(client, await prepare(client));
  expect(result.structuredContent).toMatchObject({ status: 'uncertain' });
  expect(JSON.stringify(result)).not.toContain('private value');
  expect(writes).toHaveLength(1);
});
