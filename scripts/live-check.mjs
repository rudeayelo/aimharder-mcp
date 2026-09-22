import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { CookieJar } from 'tough-cookie';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

if (process.env.AIMHARDER_LIVE_CHECK !== '1') {
  process.stderr.write('Set AIMHARDER_LIVE_CHECK=1 to authorize live authentication and read-only verification.\n');
  process.exit(1);
}
const env = {};
for (const key of ['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES']) {
  if (process.env[key] !== undefined) env[key] = process.env[key];
}
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))],
  env,
  stderr: 'pipe',
});
const client = new Client({ name: 'aimharder-live-harness', version: '1.0.0' });
let hasStderr = false;
transport.stderr?.on('data', () => { hasStderr = true; });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), ['get_account_context', 'get_class_sessions', 'get_upcoming_bookings', 'get_published_workouts']);
  const result = await client.callTool({ name: 'get_account_context', arguments: {} });
  assert.notEqual(result.isError, true);
  const context = result.structuredContent;
  assert.equal(context.account.authenticated, true);
  assert.ok(context.gyms.length > 0);
  assert.ok(context.gyms.some((gym) => gym.id === context.selectedGym.id));
  for (const gym of context.gyms) {
    const explicit = await client.callTool({ name: 'get_account_context', arguments: { gymId: gym.id } });
    assert.notEqual(explicit.isError, true);
    assert.equal(explicit.structuredContent.selectedGym.id, gym.id);
  }
  let inaccessible = 'unverified-gym';
  while (context.gyms.some((gym) => gym.id === inaccessible)) inaccessible += '-x';
  const rejected = await client.callTool({ name: 'get_account_context', arguments: { gymId: inaccessible } });
  assert.equal(rejected.isError, true);
  assert.ok(rejected.content.some((item) => item.type === 'text' && item.text.includes('GYM_NOT_ACCESSIBLE')));
  let classes;
  if (process.env.AIMHARDER_LIVE_START_DATE || process.env.AIMHARDER_LIVE_END_DATE) {
    classes = await checkClasses(client, context.selectedGym);
  }
  const bookings = process.env.AIMHARDER_LIVE_BOOKINGS === '1' ? await checkBookings(client, context.selectedGym) : undefined;
  const workouts = process.env.AIMHARDER_LIVE_WORKOUT_DATE ? await checkWorkouts(client, context.selectedGym) : undefined;
  assert.equal(hasStderr, false);
  process.stdout.write(JSON.stringify({
    harness: 'MCP SDK client over stdio', authenticated: true,
    accessibleGymCount: context.gyms.length,
    explicitSelection: 'passed', inaccessibleSelection: 'rejected',
    timeZoneStatus: context.selectedGym.timeZoneStatus,
    serverStderr: 'empty', ...(classes ? { classes } : {}), ...(bookings ? { bookings } : {}), ...(workouts ? { workouts } : {}),
  }, null, 2) + '\n');
} catch {
  process.stderr.write('Live MCP validation failed. Check configuration, authentication, and supported account contracts. Raw errors and responses are suppressed.\n');
  process.exitCode = 1;
} finally {
  await client.close();
}

// Independent raw-response comparison: never print or persist account responses.
async function checkClasses(client, gym) {
  const startDate = process.env.AIMHARDER_LIVE_START_DATE;
  const endDate = process.env.AIMHARDER_LIVE_END_DATE;
  const { classQuerySchema, calendarDates } = await import('../dist/classes.js');
  assert.equal(classQuerySchema.safeParse({ startDate, endDate }).success, true);
  assert.equal(gym.timeZoneStatus, 'user-confirmed');
  const { request, role } = await openLiveSession(gym);
  const dates = [...calendarDates(startDate, endDate)];
  const rawDays = new Map();
  for (const date of dates) {
    const raw = await request(`https://${role.centre_url}/api/bookings?${new URLSearchParams({ box: String(role.boid), day: date.replaceAll('-', '') })}`);
    assert.ok(Array.isArray(raw.bookings));
    // Discard all fields except those necessary for the schedule comparison.
    rawDays.set(date, raw.bookings.map((row) => ({
      sourceId: row.id, date, startTime: row.time.slice(0, 5), timeLabel: row.time,
      classType: { id: row.classId, name: row.className }, occupancy: row.ocupation ?? null, capacity: row.limit ?? null,
    })));
  }
  const result = await client.callTool({ name: 'get_class_sessions', arguments: { startDate, endDate, gymId: gym.id } });
  assert.notEqual(result.isError, true);
  const schedule = result.structuredContent;
  assert.equal(schedule.coverage, 'complete');
  assert.equal(schedule.gym.timeZone, gym.timeZone);
  const project = (session) => ({
    sourceId: session.sourceId, date: session.date, startTime: session.startTime, timeLabel: session.timeLabel,
    classType: session.classType, occupancy: session.occupancy, capacity: session.capacity,
  });
  assert.deepEqual(schedule.sessions.map(project), [...rawDays.values()].flat());
  const specific = schedule.sessions.find((row) => row.classType.name === 'Metcon' && row.startTime === '07:00') ?? schedule.sessions[0];
  assert.ok(specific, 'Choose a live interval containing at least one session.');
  const selected = await client.callTool({ name: 'get_class_sessions', arguments: {
    startDate: specific.date, endDate: specific.date, gymId: gym.id,
    startTime: specific.startTime, className: specific.classType.name,
  } });
  assert.notEqual(selected.isError, true);
  assert.deepEqual(selected.structuredContent.sessions.map(project), rawDays.get(specific.date).filter((row) => row.startTime === specific.startTime && row.classType.name === specific.classType.name));
  return {
    intervalComparison: 'passed', dateCount: dates.length, sessionCount: schedule.sessions.length,
    emptyDayCount: [...rawDays.values()].filter((rows) => rows.length === 0).length,
    specificSessionComparison: 'passed', timeZoneProvenance: 'user-confirmed',
  };
}

async function openLiveSession(gym) {
  const jar = new CookieJar();
  async function request(url, body) {
    const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
    const cookie = await jar.getCookieString(url);
    if (cookie) headers.Cookie = cookie;
    if (body) headers['Content-Type'] = 'application/json';
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET', headers, redirect: 'error', signal: AbortSignal.timeout(15_000),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    assert.equal(response.status, 200);
    for (const cookie of response.headers.getSetCookie()) await jar.setCookie(cookie, url);
    return url.endsWith('/') ? response.text() : response.json();
  }
  const login = await request('https://login.aimharder.es/api/login', {
    username: env.AIMHARDER_USERNAME, password: env.AIMHARDER_PASSWORD,
    iniframe: 0, fingerprint: randomBytes(25).toString('hex'),
  });
  assert.equal(login.data.auth.authOK, true);
  const who = await request('https://aimharder.es/api/whoami');
  assert.equal(who.data[0].id, login.data.userData.id);
  const role = who.data[0].roles.find((row) => row.role === 'client' && row.centre_url === `${gym.id}.aimharder.es`);
  assert.ok(role && Number.isSafeInteger(role.boid) && role.boid > 0);
  return { request, role };
}

async function checkBookings(client, gym) {
  assert.equal(gym.timeZoneStatus, 'user-confirmed');
  const { request, role } = await openLiveSession(gym);
  const raw = await request(`https://${role.centre_url}/api/nextBookings?${new URLSearchParams({ box: String(role.boid) })}`);
  assert.deepEqual(Object.keys(raw).sort(), ['history', 'nextClasses']);
  assert.ok(Array.isArray(raw.nextClasses) && raw.nextClasses.length > 0, 'Live acceptance requires an actual upcoming booking.');
  const result = await client.callTool({ name: 'get_upcoming_bookings', arguments: {} });
  assert.notEqual(result.isError, true);
  const view = result.structuredContent;
  assert.equal(view.gym.id, gym.id);
  assert.equal(view.coverage.scope, 'upstream-upcoming-view');
  assert.equal(view.coverage.startDate, null);
  assert.equal(view.coverage.endDate, null);
  assert.equal(view.bookings.length, raw.nextClasses.length);
  let matched = 0;
  for (const row of raw.nextClasses) {
    const booking = view.bookings.find((entry) => entry.sourceBookingId === row.id);
    assert.ok(booking);
    assert.equal(booking.timeLabel, row.time);
    assert.equal(booking.classType.name, row.className ?? null);
    assert.equal(booking.dateLabel, row.day);
    assert.equal(booking.sourceState, row.bookState ?? null);
    assert.equal(booking.state, row.bookState === 1 ? 'booked' : row.bookState === 0 ? 'waitlisted' : 'unknown');
    assert.equal(booking.timeZone, gym.timeZone);
    assert.equal(booking.sessionId, null);
    assert.equal(booking.classType.id, null);
    // Independently format the normalized date in the observed source locale.
    const date = new Date(`${booking.date}T12:00:00Z`);
    const expectedLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    assert.equal(expectedLabel.toLocaleLowerCase('es-ES'), row.day.toLocaleLowerCase('es-ES'));
    const daily = await request(`https://${role.centre_url}/api/bookings?${new URLSearchParams({ box: String(role.boid), day: booking.date.replaceAll('-', '') })}`);
    const candidates = daily.bookings.filter((entry) => entry.time === row.time && entry.className === row.className && entry.bookState === row.bookState);
    assert.equal(candidates.length, 1, 'Live comparison requires an unambiguous schedule match.');
    matched++;
  }
  const explicit = await client.callTool({ name: 'get_upcoming_bookings', arguments: { gymId: gym.id } });
  assert.notEqual(explicit.isError, true);
  assert.deepEqual(explicit.structuredContent.bookings, view.bookings);
  const rejected = await client.callTool({ name: 'get_upcoming_bookings', arguments: { gymId: 'unverified-live-check-gym' } });
  assert.equal(rejected.isError, true);
  return { upcomingComparison: 'passed', scheduleComparison: 'passed', bookingCount: matched, explicitSelection: 'passed', inaccessibleSelection: 'rejected', timeZoneProvenance: 'user-confirmed' };
}

async function checkWorkouts(client, gym) {
  const date = process.env.AIMHARDER_LIVE_WORKOUT_DATE;
  const className = process.env.AIMHARDER_LIVE_WORKOUT_CLASS ?? 'WOD';
  const { request, role } = await openLiveSession(gym);
  const page = await request(`https://${role.centre_url}/`);
  const publisher = /timeLineContent:\s*7,\s*userID:\s*(\d+)/.exec(page)?.[1];
  assert.ok(publisher);
  const feed = await request(`https://${role.centre_url}/api/activity?${new URLSearchParams({ timeLineFormat: '0', timeLineContent: '7', userID: publisher })}`);
  const result = await client.callTool({ name: 'get_published_workouts', arguments: { date, className } });
  assert.notEqual(result.isError, true);
  const view = result.structuredContent;
  const [year, month, day] = date.split('-').map(Number);
  const expectedDateLabel = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
  const expectedIds = [];
  const details = new Map();
  for (const post of feed.elements.filter(row => row.wodClass === className && Array.isArray(row.ejerRate))) {
    const detail = await request(`https://${role.centre_url}/api/activity/workout?SEID=${post.id}`);
    details.set(post.id, detail);
    if (detail.recordDate.toLocaleLowerCase('es-ES') === expectedDateLabel && (detail.ejerRate.length || detail.TIPOWODs.some(b => !b.deleted && b.notes?.trim()))) expectedIds.push(post.id);
  }
  assert.deepEqual(view.workouts.map(w => w.provenance.sourceId), expectedIds);
  assert.equal(view.status, expectedIds.length ? 'available' : 'unavailable');
  let compared = 0;
  for (const workout of view.workouts) {
    const post = feed.elements.find(row => row.id === workout.provenance.sourceId);
    assert.equal(post.wodClass, className);
    const detail = details.get(post.id);
    assert.equal(workout.provenance.dateLabel, detail.recordDate);
    assert.equal(workout.provenance.publicationDateLabel, detail.publishDate);
    const [year, month, day] = date.split('-').map(Number);
    const expected = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
    assert.equal(detail.recordDate.toLocaleLowerCase('es-ES'), expected);
    assert.deepEqual(workout.blocks.map(b => b.notes), detail.TIPOWODs.map(b => b.deleted ? null : b.notes ?? null));
    assert.deepEqual(workout.exercises.map(e => e.name), detail.ejerRate.filter(e => e.tipoWOD == null || !detail.TIPOWODs[e.tipoWOD].deleted).map(e => e.ejerName));
    assert.deepEqual(workout.titles, post.TIPOWODs.flatMap(b => b.title ? [b.title] : []));
    for (let index = 0; index < workout.blocks.length; index++) {
      for (const [key, value] of Object.entries(workout.blocks[index].prescription)) assert.deepEqual(value, detail.TIPOWODs[index][key]);
    }
    const sourceExercises = detail.ejerRate.filter(e => e.tipoWOD == null || !detail.TIPOWODs[e.tipoWOD].deleted);
    for (let index = 0; index < workout.exercises.length; index++) {
      for (const [key, value] of Object.entries(workout.exercises[index].prescription)) assert.deepEqual(value, sourceExercises[index][key]);
    }
    compared++;
  }
  const daily = await request(`https://${role.centre_url}/api/bookings?${new URLSearchParams({ box: String(role.boid), day: date.replaceAll('-', '') })}`);
  return { feedAndDetailComparison: compared ? 'passed' : 'no matching content available in retrieved view', status: view.status, comparedWorkoutCount: compared, matchingClassSessionCount: daily.bookings.filter(row => row.className === className).length, coverage: view.coverage.scope, exhaustive: false };
}
