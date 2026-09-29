import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { ActivityDeletionPreparationStore, type DeletionPreview } from '../src/activity-deletion.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
const requests: { method: string; path: string; host: string }[] = [];
const date = '2026-03-29';
const activityDetail = (extra: Record<string, unknown> = {}) => ({ userId: 42, boxId: 200,
  recordDate: '29 de Marzo de 2026', publishDate: '30 de Marzo de 2026', wodClass: 'WOD', TIPOWODs: [{ notes: 'Complete for time', deleted: false, res: 8, rx: true, rxstr: 'RX' }],
  ejerRate: [{ ejerName: 'Sample lift', tipoWOD: 0, formaReg: 3, valor1: ['8'] }],
  titles: ['Sample workout'], ...extra });
function calendar(ids: number[]) { return { workouts: { [date]: { rates: { ids }, TIPOWODs: {} } } }; }
beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  requests.length = 0;
  upstream.use(
  http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({ data: { userData: { id: 42 }, auth: { authOK: true } } },
    { headers: { 'Set-Cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/' } })),
  http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [
    { role: 'client', boid: 200, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' },
  ] }] })),
  http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(calendar([1001]))),
  http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(activityDetail())),
  );
});
upstream.events.on('request:start', ({ request }) => requests.push({ method: request.method, path: new URL(request.url).pathname, host: new URL(request.url).host }));
afterEach(async () => { for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); } upstream.resetHandlers(); vi.useRealTimers(); });
afterAll(() => upstream.close());
async function connect() {
  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password', AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}' });
  const client = new Client({ name: 'deletion-preparation-test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair(); connections.push({ client, server }); await server.connect(b); await client.connect(a); return client;
}
const prepare = (client: Client, args: Record<string, unknown> = {}) => client.callTool({ name: 'prepare_activity_deletion', arguments: { date, ...args } });
const execute = (client: Client, reference: string, extra: Record<string, unknown> = {}) => client.callTool({ name: 'execute_activity_deletion',
  arguments: { actionReference: reference, sourceActivityId: 1001, confirmed: true, ...extra } });
const deletes = () => requests.filter(r => r.method === 'DELETE');

test('prepares exact own calendar detail, shows RM and irreversible warnings, and never sends DELETE', async () => {
  const result = await prepare(await connect());
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toMatchObject({ status: 'ready', gym: { id: 'sample-gym', timeZone: 'Europe/Madrid' },
    target: { sourceActivityId: 1001, date, containsRMMarks: true, blocks: [{ result: { rx: true, rxstr: 'RX' } }] },
    coverage: { status: 'complete', completedDates: [date] }, actionReference: expect.any(String),
    notices: expect.arrayContaining([expect.stringContaining('irreversible'), expect.stringContaining('RM history'), expect.stringContaining('does not send a DELETE')]) });
  expect(JSON.stringify(result)).not.toMatch(/userId|boxId|cookie|password|synthetic-cookie/);
  expect(requests.some(r => r.method === 'DELETE')).toBe(false);
});

test('caller ID alone cannot select a target absent from the account calendar', async () => {
  upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(calendar([]))));
  const result = await prepare(await connect(), { sourceActivityId: 9999 });
  expect(result.structuredContent).toMatchObject({ status: 'missing' });
  expect(requests.some(r => r.path === '/api/activity/workout')).toBe(false);
});

test('multiple calendar candidates are ambiguous without leaking candidate details', async () => {
  upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(calendar([1001, 1002]))));
  const result = await prepare(await connect());
  expect(result.structuredContent).toMatchObject({ status: 'ambiguous', candidateCount: 2 });
  expect(result.structuredContent).not.toHaveProperty('actionReference');
});

test('incomplete calendar returns no candidate, detail read, or reference', async () => {
  upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json({ workouts: {}, nextPage: 2 })));
  const result = await prepare(await connect());
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toMatchObject({ status: 'incomplete', coverage: { status: 'incomplete', completedDates: [] } });
  expect(result.structuredContent).not.toHaveProperty('actionReference');
  expect(requests.some(r => r.path === '/api/activity/workout')).toBe(false);
});

test.each([{ userId: 43 }, { boxId: 201 }, { recordDate: '28 de Marzo de 2026' }])('rejects unverified owner, gym, or date %o without reference', async mutation => {
  upstream.use(http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(activityDetail(mutation))));
  const result = await prepare(await connect());
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).not.toHaveProperty('actionReference');
  expect((result.structuredContent as { status: string }).status).not.toBe('ready');
});

test('malformed detail does not disclose its content or issue a reference', async () => {
  upstream.use(http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json({ userId: 42, boxId: 200, private: 'do-not-leak' })));
  const result = await prepare(await connect());
  expect(result.structuredContent).toMatchObject({ status: 'unsupported' });
  expect(result.structuredContent).not.toHaveProperty('actionReference');
  expect(JSON.stringify(result)).not.toContain('do-not-leak');
});

test('deletion reference is bound to its account, gym, membership and entry and is single-use', () => {
  const store = new ActivityDeletionPreparationStore();
  const preview = { target: { sourceActivityId: 1001 } } as DeletionPreview;
  for (const mismatch of [
    [43, 'sample-gym', 200, 1001], [42, 'other-gym', 200, 1001],
    [42, 'sample-gym', 201, 1001], [42, 'sample-gym', 200, 1002],
  ] as const) {
    const issued = store.issue(42, 'sample-gym', 200, preview);
    expect(store.take(issued.actionReference, mismatch[0], mismatch[1], mismatch[2], mismatch[3])).toBeNull();
  }
  const second = store.issue(42, 'sample-gym', 200, preview);
  expect(store.take(second.actionReference, 42, 'sample-gym', 200, 1001)).not.toBeNull();
  expect(store.take(second.actionReference, 42, 'sample-gym', 200, 1001)).toBeNull();
});

test('confirmed exact reference sends one fixed DELETE and reports only observed absence', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  let calendarReads = 0;
  upstream.use(
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(++calendarReads === 1 ? calendar([1001]) : calendar([]))),
    http.delete('https://sample-gym.aimharder.es/api/activity/:id', ({ params }) => {
      expect(params.id).toBe('1001');
      return HttpResponse.json({ unrelatedPrivateField: 'never-return-this' });
    }),
  );
  const result = await execute(client, prepared.actionReference);
  expect(result.structuredContent).toMatchObject({ status: 'observed-absent', responseStatus: 'http-ok', observedState: 'absent',
    readbackCoverage: { status: 'complete', completedDates: [date] },
    notices: expect.arrayContaining([expect.stringContaining('does not prove permanent deletion')]) });
  expect(deletes()).toEqual([{ method: 'DELETE', path: '/api/activity/1001', host: 'sample-gym.aimharder.es' }]);
  expect(JSON.stringify(result)).not.toMatch(/unrelatedPrivateField|never-return-this|userId|boxId|synthetic-cookie|synthetic-password/);
  expect((await execute(client, prepared.actionReference)).isError).toBe(true);
  expect(deletes()).toHaveLength(1);
});

test('missing confirmation, wrong target, expired reference, and reuse send no DELETE', async () => {
  const client = await connect();
  const one = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, one.actionReference, { confirmed: false })).isError).toBe(true);
  expect((await execute(client, one.actionReference, { sourceActivityId: 1002 })).isError).toBe(true);
  expect((await execute(client, one.actionReference)).isError).toBe(true);
  const two = (await prepare(client)).structuredContent as { actionReference: string };
  vi.useFakeTimers();
  vi.setSystemTime(Date.now() + 121_000);
  expect((await execute(client, two.actionReference)).isError).toBe(true);
  expect(deletes()).toHaveLength(0);
});

test.each([
  ['account', { id: 43, roles: [{ role: 'client', boid: 200, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' }] }],
  ['gym', { id: 42, roles: [{ role: 'client', boid: 200, gym: 'Other Gym', centre_url: 'other-gym.aimharder.es' }] }],
  ['membership', { id: 42, roles: [{ role: 'client', boid: 201, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' }] }],
] as const)('changed %s account context sends no DELETE', async (_name, identity) => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  upstream.use(http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [identity] })));
  const result = await execute(client, prepared.actionReference);
  expect(result.isError === true || (result.structuredContent as { status: string }).status === 'stale').toBe(true);
  expect(deletes()).toHaveLength(0);
});

test.each([
  ['calendar changed', { calendar: calendar([]) }],
  ['calendar incomplete', { calendar: { workouts: {}, nextPage: 2 } }],
  ['foreign owner', { detail: activityDetail({ userId: 43 }) }],
  ['foreign gym', { detail: activityDetail({ boxId: 201 }) }],
  ['changed date', { detail: activityDetail({ recordDate: '28 de Marzo de 2026' }) }],
  ['changed content', { detail: activityDetail({ TIPOWODs: [{ notes: 'Changed', deleted: false }] }) }],
  ['malformed detail', { detail: { userId: 42, boxId: 200, private: 'never-return-this' } }],
] as const)('%s target is stale before any write', async (_name, change) => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  if ('calendar' in change) upstream.use(http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(change.calendar)));
  if ('detail' in change) upstream.use(http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(change.detail)));
  const result = await execute(client, prepared.actionReference);
  expect(result.structuredContent).toMatchObject({ status: 'stale', responseStatus: 'not-sent' });
  expect(JSON.stringify(result)).not.toContain('never-return-this');
  expect(deletes()).toHaveLength(0);
});

test.each([
  ['still visible', HttpResponse.json({}), calendar([1001]), activityDetail(), 'still-visible', 'still-visible'],
  ['incomplete calendar', HttpResponse.json({}), { workouts: {}, nextPage: 2 }, activityDetail(), 'incomplete', 'incomplete'],
  ['conflicting owner', HttpResponse.json({}), calendar([1001]), activityDetail({ userId: 43 }), 'conflicting-identity', 'conflicting-identity'],
  ['conflicting detail date', HttpResponse.json({}), calendar([1001]), activityDetail({ recordDate: '28 de Marzo de 2026' }), 'conflicting-identity', 'conflicting-identity'],
  ['conflicting calendar date', HttpResponse.json({}), { workouts: { '2026-03-28': { rates: { ids: [1001] }, TIPOWODs: {} } } }, activityDetail(), 'conflicting-identity', 'conflicting-identity'],
  ['malformed detail', HttpResponse.json({}), calendar([1001]), { userId: 42, boxId: 200, private: 'hidden' }, 'incomplete', 'incomplete'],
  ['malformed response', HttpResponse.text('not-json'), calendar([]), activityDetail(), 'uncertain', 'absent'],
  ['expired write session', new HttpResponse(null, { status: 401 }), calendar([]), activityDetail(), 'uncertain', 'absent'],
  ['server error', HttpResponse.json({ private: 'hidden' }, { status: 500 }), calendar([]), activityDetail(), 'uncertain', 'absent'],
] as const)('%s after one DELETE is reconciled conservatively', async (_name, deletionResponse, afterCalendar, afterDetail, status, observedState) => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  let calendarReads = 0;
  let detailReads = 0;
  upstream.use(
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(++calendarReads === 1 ? calendar([1001]) : afterCalendar)),
    http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(++detailReads === 1 ? activityDetail() : afterDetail)),
    http.delete('https://sample-gym.aimharder.es/api/activity/:id', () => deletionResponse),
  );
  const result = await execute(client, prepared.actionReference);
  expect(result.structuredContent).toMatchObject({ status, observedState,
    readbackCoverage: { status: observedState === 'absent' || observedState === 'still-visible' ? 'complete' : 'incomplete' } });
  expect(deletes()).toHaveLength(1);
  expect(JSON.stringify(result)).not.toContain('hidden');
  expect((await execute(client, prepared.actionReference)).isError).toBe(true);
  expect(deletes()).toHaveLength(1);
});

test('network uncertainty never retries DELETE and a later absent calendar remains uncertain', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  let calendarReads = 0;
  upstream.use(
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(++calendarReads === 1 ? calendar([1001]) : calendar([]))),
    http.delete('https://sample-gym.aimharder.es/api/activity/:id', () => HttpResponse.error()),
  );
  const result = await execute(client, prepared.actionReference);
  expect(result.structuredContent).toMatchObject({ status: 'uncertain', responseStatus: 'uncertain', observedState: 'absent' });
  expect(deletes()).toHaveLength(1);
});
