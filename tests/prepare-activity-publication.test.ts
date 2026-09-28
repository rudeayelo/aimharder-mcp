import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';

const upstream = setupServer();
const connections: { client: Client; server: ReturnType<typeof createServer> }[] = [];
const requests: Array<{ method: string; path: string }> = [];
const sourceId = 8001;
const sourceBlock = { notes: 'Complete for time', deleted: false, type: 1, timecap: 600 };
const sourceExercise = { ejerId: 101, ejerName: 'Sample lift', tipoWOD: 0, formaReg: 4, tipoud: 4, valor2: '80' };
const detail = (extra: Record<string, unknown> = {}) => ({ recordDate: '28 de Septiembre de 2026',
  TIPOWODs: [sourceBlock], ejerRate: [sourceExercise], ...extra });
const feed = (elements: unknown[] = [{ id: sourceId, wodClass: 'WOD', ejerRate: [], TIPOWODs: [{ title: 'Sample WOD' }] }]) =>
  ({ timeLineContent: '7', timeLineFormat: '0', elements, curDate: '20260928' });
const copy = (extra: Record<string, unknown> = {}) => ({ box: [{ boxID: 200, userId: 300,
  date: '2026-09-28T00:00:00', rates: [sourceExercise], TIPOWODs: [sourceBlock],
  userNom: 'Publisher Private Name', userPic: 'private-image', ...extra }] });
const settings = (audience = '1', tv = '0') => `<form id="frmConfiguration">¿Quién puede ver tus publicaciones?
  <input type="radio" name="USPRIVACIDADDEF" value="2" ${audience === '2' ? 'checked' : ''}>
  <input type="radio" name="USPRIVACIDADDEF" value="1" ${audience === '1' ? 'checked' : ''}>
  <input type="radio" name="USPRIVACIDADDEF" value="4" ${audience === '4' ? 'checked' : ''}>
  <input type="radio" name="USPRIVCAST" value="0" ${tv === '0' ? 'checked' : ''}>
  <input type="radio" name="USPRIVCAST" value="1" ${tv === '1' ? 'checked' : ''}>
  </form>`;

beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-09-28T12:00:00Z'));
  requests.length = 0;
  upstream.use(
    http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({
      data: { userData: { id: 42 }, auth: { authOK: true } },
    }, { headers: { 'Set-Cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/' } })),
    http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [
      { role: 'client', boid: 200, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' },
    ] }] })),
    http.get('https://aimharder.es/settings', () => HttpResponse.text(settings())),
    http.get('https://sample-gym.aimharder.es/', () => HttpResponse.text('timeLineContent: 7, userID: 300')),
    http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(feed())),
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail())),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy())),
  );
});
upstream.events.on('request:start', ({ request }) => requests.push({ method: request.method, path: new URL(request.url).pathname }));
afterEach(async () => {
  for (const { client, server } of connections.splice(0)) { await client.close(); await server.close(); }
  upstream.resetHandlers(); vi.useRealTimers();
});
afterAll(() => upstream.close());
async function connect(extra: Record<string, string | undefined> = {}) {
  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password',
    AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}', ...extra });
  const client = new Client({ name: 'publication-test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair(); connections.push({ client, server });
  await server.connect(b); await client.connect(a); return client;
}
const prepare = (client: Client, extra: Record<string, unknown> = {}) => client.callTool({
  name: 'prepare_activity_publication', arguments: { sourceActivityId: sourceId,
    blockResults: [{ blockIndex: 0, kind: 'time-seconds', value: 275 }], ...extra },
});
const activityWrites = () => requests.filter(r => r.method === 'POST' && r.path === '/api/activity');

test('ready preview uses independent account audience, exact source and structured time without writing', async () => {
  const result = await prepare(await connect());
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toMatchObject({ status: 'ready', gym: { id: 'sample-gym', timeZoneStatus: 'user-confirmed' },
    source: { sourceActivityId: sourceId, className: 'WOD', intendedDate: '2026-09-28' },
    activityDate: '2026-09-28', audience: { publication: 'followers', wodTvResults: true },
    blockResults: [{ blockIndex: 0, kind: 'time-seconds', value: 275 }], actionReference: expect.any(String) });
  expect(JSON.stringify(result)).not.toMatch(/Publisher Private Name|private-image|userId|boxID|cookie|password/);
  expect(activityWrites()).toHaveLength(0);
});

test('missing source in bounded feed has no reference and never probes an arbitrary source ID', async () => {
  const result = await prepare(await connect(), { sourceActivityId: 9999 });
  expect(result.structuredContent).toMatchObject({ status: 'missing' });
  expect(result.structuredContent).not.toHaveProperty('actionReference');
  expect(requests.filter(r => r.path.startsWith('/api/activity/workout') || r.path.startsWith('/api/activity/samewod'))).toHaveLength(0);
  expect(activityWrites()).toHaveLength(0);
});

test('unsupported audience, source identity, date and score kind never issue a reference', async () => {
  const client = await connect();
  upstream.use(http.get('https://aimharder.es/settings', () => HttpResponse.text(settings('9'))));
  expect((await prepare(client)).isError).toBe(true);
  upstream.use(http.get('https://aimharder.es/settings', () => HttpResponse.text(settings())));
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ boxID: 201 }))));
  expect((await prepare(client)).isError).toBe(true);
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy())));
  for (const extra of [{ activityDate: '2026-09-29' }, { blockResults: [{ blockIndex: 0, kind: 'kilograms', value: 10 }] }]) {
    const result = await prepare(client, extra);
    expect(result.structuredContent).toMatchObject({ status: 'unsupported' });
    expect(result.structuredContent).not.toHaveProperty('actionReference');
  }
  expect(activityWrites()).toHaveLength(0);
});

test('rejects comment-only, arbitrary text results, a selected unverified gym and assumed zone', async () => {
  const client = await connect();
  for (const extra of [{ blockResults: [], comment: 'Only prose' },
    { blockResults: [{ blockIndex: 0, kind: 'free-text', value: 'faster' }] }, { gymId: 'other-gym' }]) {
    expect((await prepare(client, extra)).isError).toBe(true);
  }
  expect((await prepare(await connect({ AIMHARDER_GYM_TIME_ZONES: undefined }))).isError).toBe(true);
  expect(activityWrites()).toHaveLength(0);
});

test('requires one explicit level among several and verifies its Copy replacement', async () => {
  const variants = ['EASY', 'HARD'];
  const block = { ...sourceBlock, scaledops: variants, scaledver: [
    { ...sourceBlock, notes: 'Easier time target' }, { ...sourceBlock, notes: 'Harder time target' },
  ] };
  const exercise = { ...sourceExercise, scaledver: [
    { ...sourceExercise, ejerName: 'Easy lift' }, { ...sourceExercise, ejerName: 'Hard lift' },
  ] };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [block], ejerRate: [exercise] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [block], rates: [exercise] }))),
  );
  const client = await connect();
  const missing = await prepare(client);
  expect(missing.structuredContent).toMatchObject({ status: 'unsupported' });
  expect(missing.structuredContent).not.toHaveProperty('actionReference');
  const chosen = await prepare(client, { variantLabel: 'EASY' });
  expect(chosen.structuredContent).toMatchObject({ status: 'ready', variantLabel: 'EASY' });
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({
    TIPOWODs: [block], rates: [{ ...exercise, scaledver: [null, exercise.scaledver[1]] }],
  }))));
  expect((await prepare(client, { variantLabel: 'EASY' })).isError).toBe(true);
  expect(activityWrites()).toHaveLength(0);
});

async function execute(client: Client, reference: string, extra: Record<string, unknown> = {}) {
  return client.callTool({ name: 'execute_activity_publication', arguments: {
    actionReference: reference, confirmed: true, ...extra,
  } });
}
function acceptedReadback(options: { response?: unknown; calendar?: unknown; detail?: unknown } = {}) {
  upstream.use(
    http.post('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json(options.response ?? {
      errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001',
    })),
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json(options.calendar ?? {
      workouts: { '2026-09-28': { rates: { ids: [9001] }, TIPOWODs: {} } },
    })),
    http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json(options.detail ?? {
      userId: 42, boxId: 200, ...detail({ TIPOWODs: [{ ...sourceBlock, time: 275 }] }),
    })),
  );
}

test('confirmed reference sends one allowlisted multipart request and requires own readback', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  let form: FormData | undefined;
  acceptedReadback();
  upstream.use(http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
    form = await request.formData();
    return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001' });
  }));
  const result = await execute(client, prepared.actionReference);
  expect(result.structuredContent).toMatchObject({ status: 'confirmed', responseStatus: 'accepted', acceptedResponseId: 9001, observedEntry: 'matched' });
  expect(activityWrites()).toHaveLength(1);
  expect([...form!.keys()].sort()).toEqual(['conCom', 'conComInside', 'selectedDate', 'copyId', 'imagesCargadas', 'ejerRate',
    'TIPOWODs', 'homeVideoID', 'boxLocation', 'valueWithMentions', 'mentionsCollection', 'wodSchedule'].sort());
  expect(JSON.parse(String(form!.get('ejerRate')))).toEqual([sourceExercise]);
  expect(JSON.parse(String(form!.get('TIPOWODs')))).toEqual([{ ...sourceBlock, time: '04:35' }]);
  expect(String(form!.get('copyId'))).toBe(String(sourceId));
  expect(JSON.stringify(result)).not.toMatch(/Publisher Private Name|private-image|synthetic-cookie|synthetic-password/);
  expect((await execute(client, prepared.actionReference)).isError).toBe(true);
  expect(activityWrites()).toHaveLength(1);
});

test('missing confirmation, changed preferences, expired and reused references send no write', async () => {
  const client = await connect();
  const one = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, one.actionReference, { confirmed: false })).isError).toBe(true);
  upstream.use(http.get('https://aimharder.es/settings', () => HttpResponse.text(settings('4'))));
  expect((await execute(client, one.actionReference)).structuredContent).toMatchObject({ status: 'stale' });
  expect((await execute(client, one.actionReference)).isError).toBe(true);
  upstream.use(http.get('https://aimharder.es/settings', () => HttpResponse.text(settings())));
  const two = (await prepare(client)).structuredContent as { actionReference: string };
  vi.setSystemTime(new Date('2026-09-28T12:03:00Z'));
  expect((await execute(client, two.actionReference)).isError).toBe(true);
  expect(activityWrites()).toHaveLength(0);
});

test('accepted ID alone, conflicting owner, explicit rejection and transport uncertainty stay distinct', async () => {
  const client = await connect();
  acceptedReadback({ calendar: { workouts: [] } });
  const missing = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, missing.actionReference)).structuredContent).toMatchObject({ status: 'uncertain', responseStatus: 'accepted', observedEntry: 'missing' });
  acceptedReadback({ detail: { userId: 43, boxId: 200, ...detail({ TIPOWODs: [{ ...sourceBlock, time: 275 }] }) } });
  const otherOwner = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, otherOwner.actionReference)).structuredContent).toMatchObject({ status: 'uncertain', observedEntry: 'unreadable' });
  acceptedReadback({ response: { errors: ['denied'], errorWODsID: [], errorWODsType: [], errorEjerID: [] } });
  const rejected = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, rejected.actionReference)).structuredContent).toMatchObject({ status: 'rejected', responseStatus: 'rejected' });
  upstream.use(http.post('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.error()));
  const timedOut = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, timedOut.actionReference)).structuredContent).toMatchObject({ status: 'uncertain', responseStatus: 'uncertain' });
  expect(activityWrites()).toHaveLength(4);
});

test('unsupported Copy transport fields stop before the write', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({
    TIPOWODs: [{ ...sourceBlock, link: ['https://example.invalid/unsupported'] }],
  }))));
  expect((await execute(client, prepared.actionReference)).structuredContent).toMatchObject({ status: 'stale' });
  expect(activityWrites()).toHaveLength(0);
});

test('selected variant records actual kilograms in its effective row and preserves unselected prescriptions', async () => {
  const block = { ...sourceBlock, scaledops: ['EASY', 'HARD'], scaledver: [
    { ...sourceBlock, notes: 'Easy' }, { ...sourceBlock, notes: 'Hard' },
  ] };
  const easy = { ...sourceExercise, ejerName: 'Easy lift', valor2: '85', valor2h: '85', valor2m: '75' };
  const hard = { ...sourceExercise, ejerName: 'Hard lift', valor2: '90' };
  const exercise = { ...sourceExercise, scaledver: [easy, hard] };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [block], ejerRate: [exercise] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [block], rates: [exercise] }))),
  );
  const client = await connect();
  const prepared = await prepare(client, { variantLabel: 'EASY', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '72.5', sourceAlternative: 'female', confirmedActual: true },
  ] });
  expect(prepared.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{
    originalPrescription: { valor2h: '85', valor2m: '75', loadUnit: '%RM' },
    actualKilograms: '72.5', sourceAlternative: 'female',
  }] });
  let sent: FormData | undefined;
  const submitted = { ...exercise, scaledver: [{ ...easy, valor2: '72.5', tipoud: 0 }, hard] };
  upstream.use(
    http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
      sent = await request.formData();
      return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001' });
    }),
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json({ workouts: {
      '2026-09-28': { rates: { ids: [9001] }, TIPOWODs: {} },
    } })),
    http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json({ userId: 42, boxId: 200,
      ...detail({ TIPOWODs: [{ ...block, selectedscaling: 0 }], ejerRate: [submitted] }),
    })),
  );
  const result = await execute(client, String((prepared.structuredContent as { actionReference: string }).actionReference));
  expect(result.structuredContent).toMatchObject({ status: 'confirmed', observedEntry: 'matched' });
  const sentRows = JSON.parse(String(sent!.get('ejerRate')));
  expect(sentRows[0].valor2).toBe('80');
  expect(sentRows[0].tipoud).toBe(4);
  expect(sentRows[0].scaledver[0]).toMatchObject({ valor2: '72.5', tipoud: 0, valor2h: '85', valor2m: '75' });
  expect(sentRows[0].scaledver[1]).toMatchObject({ valor2: '90', tipoud: 4 });
  expect(JSON.parse(String(sent!.get('TIPOWODs')))[0].selectedscaling).toBe(0);
  expect(activityWrites()).toHaveLength(1);
});

test('manual kilograms need an explicit actual confirmation and supported split selection', async () => {
  const client = await connect();
  for (const actualLoads of [
    [{ exerciseIndex: 0, actualKilograms: '80' }],
    [{ exerciseIndex: 0, actualKilograms: '80', sourceAlternative: 'male', confirmedActual: true }],
  ]) {
    const result = await prepare(client, { blockResults: [], actualLoads });
    expect(result.isError || (result.structuredContent as { status?: string })?.status === 'unsupported').toBe(true);
  }
  expect(activityWrites()).toHaveLength(0);
});

test('manual kilograms prepare without a source exercise ID or personal RM read', async () => {
  const row = { ...sourceExercise, ejerId: undefined };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ ejerRate: [row] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ rates: [row] }))),
  );
  const result = await prepare(await connect(), { blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '80', confirmedActual: true },
  ] });
  expect(result.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{ actualKilograms: '80', calculatedSuggestion: null }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(0);
  expect(activityWrites()).toHaveLength(0);
});
