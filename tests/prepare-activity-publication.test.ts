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
  for (const extra of [{ activityDate: '2026-09-29' }, { blockResults: [{ blockIndex: 0, kind: 'kilograms', value: 10 }] },
    { blockResults: [{ blockIndex: 0, kind: 'time-seconds', value: 0 }] }]) {
    const result = await prepare(client, extra);
    expect(result.structuredContent).toMatchObject({ status: 'unsupported' });
    expect(result.structuredContent).not.toHaveProperty('actionReference');
  }
  expect(activityWrites()).toHaveLength(0);
});

test('comment-only remains a read-only draft; arbitrary text, inaccessible gym and assumed zone fail', async () => {
  const client = await connect();
  const draft = await prepare(client, { blockResults: [], comment: 'Only prose' });
  expect(draft.structuredContent).toMatchObject({ status: 'draft' });
  expect(draft.structuredContent).not.toHaveProperty('actionReference');
  for (const extra of [
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

test('Copy split-load normalization keeps the exact source alternatives through preview and readback', async () => {
  const block = { ...sourceBlock, scaledops: ['SCALED', 'RX'], scaledver: [sourceBlock, sourceBlock] };
  const base = { ...sourceExercise, ejerName: 'Sample dumbbell movement', tipoud: 0, valor2: '15/10' };
  const scaled = { ...base, valor2h: '15', valor2m: '10' };
  const rx = { ...base, valor2: '22.5/15', valor2h: '22.5', valor2m: '15' };
  const source = { ...base, scaledver: [scaled, rx] };
  const copied = { ...base, valor2: '15', valor2h: '15', valor2m: '10',
    scaledver: [{ ...scaled, valor2: '15' }, { ...rx, valor2: '22.5' }] };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({
      TIPOWODs: [block], ejerRate: [source],
    }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({
      TIPOWODs: [block], rates: [copied],
    }))),
  );
  const client = await connect();
  const prepared = await prepare(client, { variantLabel: 'RX' });
  expect(prepared.structuredContent).toMatchObject({ status: 'ready', variantLabel: 'RX',
    prescription: { exercises: [{ name: 'Sample dumbbell movement', prescription: {
      valor2: '22.5/15', valor2h: '22.5', valor2m: '15', loadUnit: 'kg',
    } }] },
  });
  let form: FormData | undefined;
  acceptedReadback({ detail: { userId: 42, boxId: 200,
    ...detail({ TIPOWODs: [{ ...block, selectedscaling: 1, scaledver: [sourceBlock,
      { ...sourceBlock, time: 275 }] }], ejerRate: [copied] }),
  } });
  upstream.use(http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
    form = await request.formData();
    return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001' });
  }));
  const reference = (prepared.structuredContent as { actionReference: string }).actionReference;
  expect((await execute(client, reference)).structuredContent).toMatchObject({ status: 'confirmed', observedEntry: 'matched' });
  const sent = JSON.parse(String(form!.get('ejerRate')));
  expect(sent[0]).toMatchObject({ valor2: '15', valor2h: '15', valor2m: '10' });
  expect(sent[0].scaledver[1]).toMatchObject({ valor2: '22.5', valor2h: '22.5', valor2m: '15' });
  expect(activityWrites()).toHaveLength(1);
  upstream.use(http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({
    TIPOWODs: [block], rates: [{ ...copied, scaledver: [copied.scaledver[0],
      { ...copied.scaledver[1], valor2m: '16' }] }],
  }))));
  expect((await prepare(client, { variantLabel: 'RX' })).isError).toBe(true);
  expect(activityWrites()).toHaveLength(1);
});

test('a confirmed actual kilogram load replaces only the selected fixed-kg exercise value', async () => {
  const block = { ...sourceBlock, scaledops: ['SCALED', 'RX'], scaledver: [sourceBlock, sourceBlock] };
  const base = { ...sourceExercise, ejerName: 'Sample dumbbell movement', tipoud: 0, valor2: '15/10' };
  const scaled = { ...base, valor2: '15/10', valor2h: '15', valor2m: '10' };
  const rx = { ...base, valor2: '22.5/15', valor2h: '22.5', valor2m: '15' };
  const copied = { ...base, valor2: '15', valor2h: '15', valor2m: '10', scaledver: [
    { ...scaled, valor2: '15' }, { ...rx, valor2: '22.5' },
  ] };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({
      TIPOWODs: [block], ejerRate: [{ ...base, scaledver: [scaled, rx] }],
    }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({
      TIPOWODs: [block], rates: [copied],
    }))),
  );
  const client = await connect();
  const prepared = await prepare(client, { variantLabel: 'RX', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '15', confirmedActual: true },
  ] });
  expect(prepared.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{
    originalPrescription: { valor2: '22.5/15', valor2h: '22.5', valor2m: '15', loadUnit: 'kg' },
    actualKilograms: '15', sourceAlternative: null,
    calculatedSuggestion: { status: 'unavailable', reason: 'already-prescribed-in-kilograms' },
  }] });
  let form: FormData | undefined;
  acceptedReadback({ detail: { userId: 42, boxId: 200,
    ...detail({ TIPOWODs: [{ ...block, selectedscaling: 1 }], ejerRate: [{ ...copied, scaledver: [
      copied.scaledver[0], { ...copied.scaledver[1], valor2: '15' },
    ] }] }),
  } });
  upstream.use(http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
    form = await request.formData();
    return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001' });
  }));
  const reference = (prepared.structuredContent as { actionReference: string }).actionReference;
  expect((await execute(client, reference)).structuredContent).toMatchObject({ status: 'confirmed', observedEntry: 'matched' });
  const sent = JSON.parse(String(form!.get('ejerRate')));
  expect(sent[0]).toMatchObject({ valor2: '15', valor2h: '15', valor2m: '10' });
  expect(sent[0].scaledver[0]).toMatchObject({ valor2: '15', valor2h: '15', valor2m: '10' });
  expect(sent[0].scaledver[1]).toMatchObject({ valor2: '15', valor2h: '22.5', valor2m: '15', tipoud: 0 });
  expect(activityWrites()).toHaveLength(1);
  acceptedReadback({ detail: { userId: 42, boxId: 200,
    ...detail({ TIPOWODs: [{ ...block, selectedscaling: 1 }], ejerRate: [{ ...copied, scaledver: [
      copied.scaledver[0], { ...copied.scaledver[1], valor2: '16' },
    ] }] }),
  } });
  const second = await prepare(client, { variantLabel: 'RX', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '15', confirmedActual: true },
  ] });
  expect((await execute(client, (second.structuredContent as { actionReference: string }).actionReference)).structuredContent)
    .toMatchObject({ status: 'uncertain', observedEntry: 'conflicting' });
  expect(activityWrites()).toHaveLength(2);
});

test('nested Copy variants and decimal-string exercise IDs permit a read-only preview', async () => {
  const labels = ['SCALED', 'INTERMEDIATE', 'RX'];
  const block = { ...sourceBlock, scaledops: labels, scaledver: [sourceBlock, sourceBlock,
    { ...sourceBlock, scaledver: [sourceBlock, { ...sourceBlock, scaledver: [sourceBlock] }] }] };
  const base = { ...sourceExercise, tipoud: 0, valor2: '15/10' };
  const alternatives = labels.map((_, index) => ({ ...base, ejerId: '101',
    valor2: index === 2 ? '22.5/15' : '15/10', valor2h: index === 2 ? '22.5' : '15',
    valor2m: index === 2 ? '15' : '10',
    ...(index === 2 ? { scaledver: [base, { ...base, tipoWOD: undefined, scaledver: [base] }] } : {}),
  }));
  const source = { ...base, scaledver: alternatives };
  const copied = { ...base, valor2: '15', valor2h: '15', valor2m: '10',
    scaledver: alternatives.map((row, index) => ({ ...row, valor2: index === 2 ? '22.5' : '15' })) };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [block], ejerRate: [source] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [block], rates: [copied] }))),
  );
  const result = await prepare(await connect(), { variantLabel: 'RX', blockResults: [
    { blockIndex: 0, kind: 'repetitions', value: 130 },
  ], actualLoads: [{ exerciseIndex: 0, actualKilograms: '15', confirmedActual: true }] });
  expect(result.structuredContent).toMatchObject({ status: 'ready', variantLabel: 'RX',
    prescription: { exercises: [{ sourceExerciseId: 101 }] },
    actualLoads: [{ exerciseIndex: 0, actualKilograms: '15' }], actionReference: expect.any(String) });
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

test('a response without an ID does not turn an unlinked calendar row into an absence claim', async () => {
  const client = await connect();
  acceptedReadback({ response: { errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [] } });
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  expect((await execute(client, prepared.actionReference)).structuredContent).toMatchObject({
    status: 'uncertain', responseStatus: 'uncertain', acceptedResponseId: null, observedEntry: 'unidentified',
  });
  expect(activityWrites()).toHaveLength(1);
});

test('a requested comment must match the own detail before publication is confirmed', async () => {
  const client = await connect();
  for (const [readback, expected] of [
    [{ activityDesc: 'A steady session' }, 'confirmed'],
    [{ activityDesc: 'A different session' }, 'uncertain'],
    [{}, 'uncertain'],
  ] as const) {
    acceptedReadback({ detail: { userId: 42, boxId: 200,
      ...detail({ TIPOWODs: [{ ...sourceBlock, time: 275 }], ...readback }),
    } });
    const prepared = (await prepare(client, { comment: 'A steady session' })).structuredContent as { actionReference: string };
    const result = await execute(client, prepared.actionReference);
    expect(result.structuredContent).toMatchObject({ status: expected, observedEntry: expected === 'confirmed' ? 'matched'
      : 'activityDesc' in readback ? 'conflicting' : 'unverified-comment' });
  }
  expect(activityWrites()).toHaveLength(3);
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
  const split = { ...sourceExercise, valor2h: '85', valor2m: null };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ ejerRate: [split] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ rates: [split] }))),
  );
  expect((await prepare(client, { blockResults: [], actualLoads: [{
    exerciseIndex: 0, actualKilograms: '70', sourceAlternative: 'female', confirmedActual: true,
  }] })).structuredContent).toMatchObject({ status: 'unsupported' });
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
  expect(result.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{ actualKilograms: '80', calculatedSuggestion: {
    status: 'unavailable', reason: 'source-exercise-id-unavailable', loadKilograms: null,
  } }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(0);
  expect(activityWrites()).toHaveLength(0);
});

const rmDate = (day: number) => Date.UTC(2026, 8, day);
function ownRm(extra: Record<string, unknown> = {}) {
  return { id: '101', name: 'Sample lift', chartUserId: 42,
    chartData1RM: [
      { date: rmDate(20), lbs: '120', idAction: 10 },
      { date: rmDate(24), lbs: '200', idAction: 11 },
    ], chartData3RM: [], chartData5RM: [], chartData10RM: [], chartDataWOD: [],
    history: [
      { date: rmDate(20), idAction: 10, desc: '120 kg' },
      { date: rmDate(24), idAction: 11, desc: '200 kg' },
    ], ...extra };
}
function respondRm(body: Record<string, unknown>) {
  upstream.use(http.get('https://sample-gym.aimharder.es/api/exercise/101/42', () => HttpResponse.json(body)));
}

test('historical suggestion uses the latest eligible own kilogram RM and preserves manual override', async () => {
  respondRm(ownRm());
  const result = await prepare(await connect(), { activityDate: '2026-09-22', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '70', sourceAlternative: 'single', confirmedActual: true },
  ] });
  expect(result.structuredContent).toMatchObject({ status: 'ready', activityDate: '2026-09-22', actualLoads: [{
    originalPrescription: { valor2: '80', loadUnit: '%RM' }, actualKilograms: '70',
    calculatedSuggestion: { status: 'available', loadKilograms: '96', basis: {
      sourceExerciseId: 101, value: '120', sourceDate: '2026-09-20', unit: 'kg',
    } },
  }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(1);
  expect(activityWrites()).toHaveLength(0);
});

test('same-date ambiguity, later-only record and unverified unit leave manual kilograms available', async () => {
  const client = await connect();
  const loads = [{ exerciseIndex: 0, actualKilograms: '70', confirmedActual: true }];
  respondRm(ownRm({ chartData1RM: [{ date: rmDate(24), lbs: '200', idAction: 11 }] }));
  expect((await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: loads })).structuredContent)
    .toMatchObject({ status: 'ready', actualLoads: [{ calculatedSuggestion: { status: 'unavailable', reason: 'no-1rm-on-or-before-activity-date' } }] });
  respondRm(ownRm({ chartData1RM: [
    { date: rmDate(20), lbs: '120', idAction: 10 }, { date: rmDate(20), lbs: '130', idAction: 12 },
  ] }));
  expect((await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: loads })).structuredContent)
    .toMatchObject({ status: 'ready', actualLoads: [{ calculatedSuggestion: { status: 'unavailable', reason: 'ambiguous-1rm-on-latest-eligible-date' } }] });
  respondRm(ownRm({ history: [] }));
  expect((await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: loads })).structuredContent)
    .toMatchObject({ status: 'ready', actualLoads: [{ calculatedSuggestion: { status: 'unavailable', reason: 'physical-unit-unverified' } }] });
  expect(activityWrites()).toHaveLength(0);
});

test('split source alternatives require selection for a suggestion and never infer a profile', async () => {
  const row = { ...sourceExercise, valor2h: '85', valor2m: '75' };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ ejerRate: [row] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ rates: [row] }))),
  );
  respondRm(ownRm());
  const client = await connect();
  const input = { blockResults: [], actualLoads: [{ exerciseIndex: 0, actualKilograms: '70', confirmedActual: true }] };
  expect((await prepare(client, input)).structuredContent).toMatchObject({ status: 'ready', actualLoads: [{
    calculatedSuggestion: { status: 'unavailable', reason: 'source-alternative-not-selected' },
  }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(1);
  expect((await prepare(client, { ...input, actualLoads: [{ ...input.actualLoads[0], sourceAlternative: 'female' }] })).structuredContent)
    .toMatchObject({ status: 'ready', actualLoads: [{ actualKilograms: '70', calculatedSuggestion: {
      status: 'available', loadKilograms: '150', basis: { sourceDate: '2026-09-24' },
    } }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(2);
  expect(activityWrites()).toHaveLength(0);
});

test('unsupported percentage makes no personal read and leaves confirmed manual load ready', async () => {
  const row = { ...sourceExercise, valor2: '85/75' };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ ejerRate: [row] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ rates: [row] }))),
  );
  const result = await prepare(await connect(), { blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '70', confirmedActual: true },
  ] });
  expect(result.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{
    calculatedSuggestion: { status: 'unavailable', reason: 'unstructured-or-unequal-percentage' },
  }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/'))).toHaveLength(0);
  expect(activityWrites()).toHaveLength(0);
});

test('later original-source provenance appears only after a fresh gym publication read', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  acceptedReadback();
  upstream.use(http.get('https://aimharder.es/api/activity/workout', ({ request }) => HttpResponse.json(
    new URL(request.url).searchParams.get('SEID') === String(sourceId) ? detail() : {
      userId: 42, boxId: 200, ...detail({ TIPOWODs: [{ ...sourceBlock, time: 275 }] }),
    },
  )));
  expect((await execute(client, prepared.actionReference)).structuredContent).toMatchObject({ status: 'confirmed',
    sourceProvenance: { status: 'verified', originalPrescription: { exercises: [{ name: 'Sample lift' }] } },
  });
  expect(activityWrites()).toHaveLength(1);
});

test('historical suggestion reads only the chosen variant exercise ID', async () => {
  const block = { ...sourceBlock, scaledops: ['EASY', 'HARD'], scaledver: [sourceBlock, sourceBlock] };
  const exercise = { ...sourceExercise, scaledver: [
    { ...sourceExercise, ejerName: 'Easy lift', ejerId: 101 },
    { ...sourceExercise, ejerName: 'Hard lift', ejerId: 102 },
  ] };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [block], ejerRate: [exercise] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [block], rates: [exercise] }))),
  );
  respondRm(ownRm());
  const result = await prepare(await connect(), { variantLabel: 'EASY', activityDate: '2026-09-22', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '95', confirmedActual: true },
  ] });
  expect(result.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{ calculatedSuggestion: {
    status: 'available', loadKilograms: '96', basis: { sourceExerciseId: 101 },
  } }] });
  expect(requests.filter(r => r.path.startsWith('/api/exercise/')).map(r => r.path)).toEqual(['/api/exercise/101/42']);
  expect(activityWrites()).toHaveLength(0);
});

test('a changed eligible RM basis invalidates the prepared action before any POST', async () => {
  respondRm(ownRm());
  const client = await connect();
  const prepared = (await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '70', confirmedActual: true },
  ] })).structuredContent as { actionReference: string };
  respondRm(ownRm({ chartData1RM: [
    { date: rmDate(20), lbs: '125', idAction: 10 }, { date: rmDate(24), lbs: '200', idAction: 11 },
  ], history: [{ date: rmDate(20), idAction: 10, desc: '125 kg' }] }));
  expect((await execute(client, prepared.actionReference)).structuredContent).toMatchObject({ status: 'stale' });
  expect(activityWrites()).toHaveLength(0);
});

test('a read-only draft offers the historical suggestion before choosing an actual load', async () => {
  respondRm(ownRm());
  const client = await connect();
  const draft = await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: [] });
  expect(draft.structuredContent).toMatchObject({ status: 'draft', exerciseSuggestions: [{ exerciseIndex: 0,
    alternatives: [{ sourceAlternative: 'single', suggestion: { status: 'available', loadKilograms: '96',
      basis: { sourceDate: '2026-09-20', unit: 'kg' } } }],
  }] });
  expect(draft.structuredContent).not.toHaveProperty('actionReference');
  const ready = await prepare(client, { activityDate: '2026-09-22', blockResults: [], actualLoads: [
    { exerciseIndex: 0, actualKilograms: '95', confirmedActual: true },
  ] });
  expect(ready.structuredContent).toMatchObject({ status: 'ready', actualLoads: [{ actualKilograms: '95',
    calculatedSuggestion: { loadKilograms: '96' },
  }] });
  expect(activityWrites()).toHaveLength(0);
});

test('rounds and leftover repetitions use distinct structured fields in one block', async () => {
  const block = { ...sourceBlock, type: 11, timecap: 2 };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [block] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [block] }))),
  );
  const client = await connect();
  const prepared = await prepare(client, { blockResults: [
    { blockIndex: 0, kind: 'rounds', value: 5 }, { blockIndex: 0, kind: 'repetitions', value: 3 },
  ] });
  expect(prepared.structuredContent).toMatchObject({ status: 'ready' });
  let sent: FormData | undefined;
  upstream.use(
    http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
      sent = await request.formData();
      return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: '9001' });
    }),
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json({ workouts: {
      '2026-09-28': { rates: { ids: [9001] }, TIPOWODs: {} },
    } })),
    http.get('https://aimharder.es/api/activity/workout', () => HttpResponse.json({ userId: 42, boxId: 200,
      ...detail({ TIPOWODs: [{ ...block, res: 5, reps: 3 }] }),
    })),
  );
  const result = await execute(client, String((prepared.structuredContent as { actionReference: string }).actionReference));
  expect(result.structuredContent).toMatchObject({ status: 'confirmed' });
  expect(JSON.parse(String(sent!.get('TIPOWODs')))[0]).toMatchObject({ res: '5', reps: '3' });
  expect(activityWrites()).toHaveLength(1);
});

test('same score with a different exercise cannot confirm the intended copied content', async () => {
  const client = await connect();
  const prepared = (await prepare(client)).structuredContent as { actionReference: string };
  acceptedReadback({ detail: { userId: 42, boxId: 200, ...detail({
    TIPOWODs: [{ ...sourceBlock, time: 275 }], ejerRate: [{ ...sourceExercise, ejerName: 'Different lift' }],
  }) } });
  expect((await execute(client, prepared.actionReference)).structuredContent).toMatchObject({
    status: 'uncertain', observedEntry: 'conflicting',
  });
  expect(activityWrites()).toHaveLength(1);
});

test('Copy editor plain notes match source notes with only HTML tags removed', async () => {
  const published = { ...sourceBlock, notes: '<p>Complete for time</p>' };
  upstream.use(
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(detail({ TIPOWODs: [published] }))),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', () => HttpResponse.json(copy({ TIPOWODs: [sourceBlock] }))),
  );
  const client = await connect();
  const prepared = await prepare(client);
  expect(prepared.structuredContent).toMatchObject({ status: 'ready' });
  acceptedReadback();
  expect((await execute(client, String((prepared.structuredContent as { actionReference: string }).actionReference))).structuredContent)
    .toMatchObject({ status: 'confirmed' });
  expect(activityWrites()).toHaveLength(1);
});
