import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { ActivityDeletionPreparationStore, type DeletionPreview } from '../src/activity-deletion.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
const requests: { method: string; path: string }[] = [];
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
upstream.events.on('request:start', ({ request }) => requests.push({ method: request.method, path: new URL(request.url).pathname }));
afterEach(async () => { for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); } upstream.resetHandlers(); });
afterAll(() => upstream.close());
async function connect() {
  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password', AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}' });
  const client = new Client({ name: 'deletion-preparation-test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair(); connections.push({ client, server }); await server.connect(b); await client.connect(a); return client;
}
const prepare = (client: Client, args: Record<string, unknown> = {}) => client.callTool({ name: 'prepare_activity_deletion', arguments: { date, ...args } });

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
