import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';

const upstream = setupServer();
const sourceId = 8001;
const ownId = 9001;
const date = '2026-09-28';
const block = { notes: 'Complete for time', deleted: false, type: 1, timecap: 600 };
const exercise = { ejerName: 'Sample lift', tipoWOD: 0, formaReg: 4, tipoud: 4, valor2: '80' };
const sourceDetail = { recordDate: '28 de Septiembre de 2026', TIPOWODs: [block], ejerRate: [exercise] };
const requests: Array<{ method: string; host: string; path: string }> = [];

beforeAll(() => upstream.listen({ onUnhandledRequest: 'error' }));
afterEach(() => { upstream.resetHandlers(); vi.useRealTimers(); requests.length = 0; });
afterAll(() => upstream.close());
upstream.events.on('request:start', ({ request }) => {
  const url = new URL(request.url);
  requests.push({ method: request.method, host: url.host, path: url.pathname });
});

test('one MCP client previews, publishes, reads back, previews deletion, and observes absence', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-29T12:00:00Z'));
  let published = false;
  let deleted = false;
  upstream.use(
    http.post('https://login.aimharder.es/api/login', () => HttpResponse.json({
      data: { userData: { id: 42 }, auth: { authOK: true } },
    }, { headers: { 'Set-Cookie': 'amhrdrauth=synthetic-cookie; Domain=.aimharder.es; Path=/' } })),
    http.get('https://aimharder.es/api/whoami', () => HttpResponse.json({ data: [{ id: 42, roles: [
      { role: 'client', boid: 200, gym: 'Sample Gym', centre_url: 'sample-gym.aimharder.es' },
    ] }] })),
    http.get('https://aimharder.es/settings', () => HttpResponse.text(`<form id="frmConfiguration">¿Quién puede ver tus publicaciones?
      <input type="radio" name="USPRIVACIDADDEF" value="2">
      <input type="radio" name="USPRIVACIDADDEF" value="1" checked>
      <input type="radio" name="USPRIVACIDADDEF" value="4">
      <input type="radio" name="USPRIVCAST" value="0" checked>
      <input type="radio" name="USPRIVCAST" value="1">
    </form>`)),
    http.get('https://sample-gym.aimharder.es/', () => HttpResponse.text('timeLineContent: 7, userID: 300')),
    http.get('https://sample-gym.aimharder.es/api/activity', () => HttpResponse.json({
      timeLineContent: '7', timeLineFormat: '0', curDate: '20260928',
      elements: [{ id: sourceId, wodClass: 'WOD', ejerRate: [], TIPOWODs: [{ title: 'Sample WOD' }] }],
    })),
    http.get('https://sample-gym.aimharder.es/api/activity/workout', () => HttpResponse.json(sourceDetail)),
    http.get('https://sample-gym.aimharder.es/api/activity/samewod/:id', ({ params }) => {
      expect(params.id).toBe(String(sourceId));
      return HttpResponse.json({ box: [{ boxID: 200, userId: 300, date: '2026-09-28T00:00:00',
        rates: [exercise], TIPOWODs: [block], userNom: 'Private Publisher' }] });
    }),
    http.get('https://aimharder.es/api/activityCalendar', () => HttpResponse.json({
      workouts: published && !deleted ? { [date]: { rates: { ids: [ownId] }, TIPOWODs: {} } } : {},
    })),
    http.get('https://aimharder.es/api/activity/workout', ({ request }) => {
      expect(new URL(request.url).searchParams.get('SEID')).toBe(String(ownId));
      return HttpResponse.json({ userId: 42, boxId: 200, ...sourceDetail,
        TIPOWODs: [{ ...block, time: 275 }] });
    }),
    http.post('https://sample-gym.aimharder.es/api/activity', async ({ request }) => {
      expect(published).toBe(false);
      const form = await request.formData();
      expect(String(form.get('copyId'))).toBe(String(sourceId));
      expect(JSON.parse(String(form.get('TIPOWODs')))).toEqual([{ ...block, time: '04:35' }]);
      expect(JSON.parse(String(form.get('ejerRate')))).toEqual([exercise]);
      published = true;
      return HttpResponse.json({ errors: [], errorWODsID: [], errorWODsType: [], errorEjerID: [], id: String(ownId) });
    }),
    http.delete('https://sample-gym.aimharder.es/api/activity/:id', ({ params }) => {
      expect(params.id).toBe(String(ownId));
      expect(published).toBe(true);
      deleted = true;
      return HttpResponse.json({});
    }),
  );

  const server = createServer({ AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password',
    AIMHARDER_GYM_TIME_ZONES: '{"sample-gym":"Europe/Madrid"}' });
  const client = new Client({ name: 'activity-journey-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const names = (await client.listTools()).tools.map(tool => tool.name);
    expect(names).toEqual(expect.arrayContaining(['get_published_workouts', 'prepare_activity_publication',
      'execute_activity_publication', 'get_personal_activity', 'prepare_activity_deletion', 'execute_activity_deletion']));

    const sourceView = await client.callTool({ name: 'get_published_workouts', arguments: { date, className: 'WOD' } });
    expect(sourceView.structuredContent).toMatchObject({ status: 'available',
      workouts: [{ provenance: { sourceId } }] });

    const publication = await client.callTool({ name: 'prepare_activity_publication', arguments: {
      sourceActivityId: sourceId, blockResults: [{ blockIndex: 0, kind: 'time-seconds', value: 275 }],
    } });
    expect(publication.isError, JSON.stringify(publication)).not.toBe(true);
    expect(publication.structuredContent).toMatchObject({ status: 'ready',
      source: { sourceActivityId: sourceId, intendedDate: date }, activityDate: date,
      audience: { publication: 'followers', wodTvResults: true },
      blockResults: [{ blockIndex: 0, kind: 'time-seconds', value: 275 }],
      actionReference: expect.any(String) });
    expect(requests.filter(request => request.method === 'POST' && request.path === '/api/activity')).toHaveLength(0);
    const publicationReference = (publication.structuredContent as { actionReference: string }).actionReference;
    const publishedResult = await client.callTool({ name: 'execute_activity_publication', arguments: {
      actionReference: publicationReference, confirmed: true,
    } });
    expect(publishedResult.structuredContent).toMatchObject({ status: 'confirmed', responseStatus: 'accepted',
      acceptedResponseId: ownId, observedEntry: 'matched' });
    expect(requests.filter(request => request.method === 'POST' && request.path === '/api/activity'))
      .toEqual([{ method: 'POST', host: 'sample-gym.aimharder.es', path: '/api/activity' }]);

    const ownView = await client.callTool({ name: 'get_personal_activity', arguments: {
      startDate: date, endDate: date,
    } });
    expect(ownView.structuredContent).toMatchObject({ coverage: { status: 'complete' },
      entries: [{ sourceActivityId: ownId, date }] });

    const deletion = await client.callTool({ name: 'prepare_activity_deletion', arguments: { date, sourceActivityId: ownId } });
    expect(deletion.structuredContent).toMatchObject({ status: 'ready', target: { sourceActivityId: ownId, date },
      actionReference: expect.any(String) });
    expect(requests.filter(request => request.method === 'DELETE')).toHaveLength(0);
    const deletionReference = (deletion.structuredContent as { actionReference: string }).actionReference;
    const deletedResult = await client.callTool({ name: 'execute_activity_deletion', arguments: {
      actionReference: deletionReference, sourceActivityId: ownId, confirmed: true,
    } });
    expect(deletedResult.structuredContent).toMatchObject({ status: 'observed-absent',
      responseStatus: 'http-ok', observedState: 'absent',
      readbackCoverage: { status: 'complete', completedDates: [date] } });
    expect(requests.filter(request => request.method === 'DELETE'))
      .toEqual([{ method: 'DELETE', host: 'sample-gym.aimharder.es', path: `/api/activity/${ownId}` }]);
    const publicOutput = JSON.stringify([sourceView, publication, publishedResult, ownView, deletion, deletedResult]);
    expect(publicOutput).not.toMatch(/Private Publisher|synthetic-cookie|synthetic-password/);
    expect(JSON.stringify([sourceView, publication, publishedResult, ownView, deletion, deletedResult]
      .map(result => result.structuredContent))).not.toMatch(/"(?:userId|boxId)":/);
  } finally {
    await client.close();
    await server.close();
  }
});
