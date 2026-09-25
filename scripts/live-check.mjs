import assert from 'node:assert/strict';
import { queryTraining } from '../dist/consumer.js';
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
  assert.deepEqual(tools.tools.map((tool) => tool.name), ['get_account_context', 'get_class_sessions', 'prepare_booking_creation', 'get_upcoming_bookings', 'get_booking_history', 'get_published_workouts', 'get_personal_activity']);
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
  const activityPeriod = process.env.AIMHARDER_LIVE_PERIOD_START || process.env.AIMHARDER_LIVE_PREVIOUS_MONTH === '1' ? await checkActivityPeriod(client, context.selectedGym) : undefined;
  const recentActivity = process.env.AIMHARDER_LIVE_RECENT_END ? await checkRecentActivity(client, context.selectedGym) : undefined;
  const activity = process.env.AIMHARDER_LIVE_ACTIVITY_START ? await checkActivity(client, context.selectedGym) : undefined;
  const history = process.env.AIMHARDER_LIVE_HISTORY === '1' ? await checkHistory(client, context.selectedGym) : undefined;
  const workouts = process.env.AIMHARDER_LIVE_WORKOUT_DATE ? await checkWorkouts(client, context.selectedGym) : undefined;
  const training = process.env.AIMHARDER_LIVE_TRAINING === '1' ? await checkTraining(client, context.selectedGym) : undefined;
  assert.equal(hasStderr, false);
  process.stdout.write(JSON.stringify({
    harness: 'MCP SDK client over stdio', authenticated: true,
    accessibleGymCount: context.gyms.length,
    explicitSelection: 'passed', inaccessibleSelection: 'rejected',
    timeZoneStatus: context.selectedGym.timeZoneStatus,
    serverStderr: 'empty', ...(activityPeriod ? { activityPeriod } : {}), ...(recentActivity ? { recentActivity } : {}), ...(activity ? { activity } : {}), ...(history ? { history } : {}), ...(classes ? { classes } : {}), ...(bookings ? { bookings } : {}), ...(workouts ? { workouts } : {}), ...(training ? { training } : {}),
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
  return { request, role, accountId: who.data[0].id };
}

function assertExercisePrescription(projected, source) {
  for (const [key, value] of Object.entries(projected)) {
    if (key !== 'loadUnit' && key !== 'valueUnit') assert.deepEqual(value, source[key]);
  }
  const loadLabels = ['kg', 'lbs', 'pood', '%BW', '%RM', 'RIR', 'RPE'];
  const distanceLabels = ['m', 'mi', 'yd', 'ft', 'steps', 'km'];
  const index = value => typeof value === 'number' && Number.isInteger(value) ? value : typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value) ? Number(value) : -1;
  const hasValue = value => value != null && value !== '';
  const form = source.formaReg;
  const hasLoad = [source.valor2, source.valor2h, source.valor2m].some(hasValue);
  const loadCode = form === 4 || form === '4' ? source.tipoud : form === 6 || form === '6' ? source.tipoud2 : undefined;
  assert.equal(projected.loadUnit, hasLoad ? loadLabels[index(loadCode)] : undefined);
  const hasPrimary = Array.isArray(source.valor1) && source.valor1.some(hasValue);
  const expectedValueUnit = !hasPrimary ? undefined
    : form === 1 || form === '1' ? 's'
    : form === 2 || form === '2' || form === 6 || form === '6' ? distanceLabels[index(source.tipoud)]
    : form === 3 || form === '3' || form === 4 || form === '4' ? 'reps'
    : form === 5 || form === '5' ? 'cal' : undefined;
  assert.equal(projected.valueUnit, expectedValueUnit);
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

async function checkWorkouts(client, gym, date = process.env.AIMHARDER_LIVE_WORKOUT_DATE, className = process.env.AIMHARDER_LIVE_WORKOUT_CLASS ?? 'WOD') {
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
  let comparedVariants = 0;
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
      assertExercisePrescription(workout.exercises[index].prescription, sourceExercises[index]);
    }
    const labels = [...new Set(detail.TIPOWODs.flatMap(block => Array.isArray(block.scaledops) ? block.scaledops : []))];
    assert.deepEqual(workout.variants.map(variant => variant.label), labels);
    for (const variant of workout.variants) {
      const selectedBlocks = detail.TIPOWODs.map(block => {
        const index = Array.isArray(block.scaledops) ? block.scaledops.indexOf(variant.label) : -1;
        return index < 0 || block.scaledver?.[index] == null ? block : block.scaledver[index];
      });
      const selectedExercises = detail.ejerRate.filter(exercise => exercise.tipoWOD != null).map(exercise => {
        const block = detail.TIPOWODs[exercise.tipoWOD];
        const index = Array.isArray(block.scaledops) ? block.scaledops.indexOf(variant.label) : -1;
        return index < 0 ? exercise : exercise.scaledver[index];
      }).filter(exercise => !selectedBlocks[exercise.tipoWOD].deleted);
      assert.deepEqual(variant.blocks.map(block => block.notes), selectedBlocks.map(block => block.deleted ? null : block.notes ?? null));
      assert.deepEqual(variant.exercises.map(exercise => exercise.name), selectedExercises.map(exercise => exercise.ejerName));
      for (let index = 0; index < variant.blocks.length; index++) {
        for (const [key, value] of Object.entries(variant.blocks[index].prescription)) assert.deepEqual(value, selectedBlocks[index][key]);
      }
      for (let index = 0; index < variant.exercises.length; index++) {
        assertExercisePrescription(variant.exercises[index].prescription, selectedExercises[index]);
      }
      comparedVariants++;
    }
    compared++;
  }
  const daily = await request(`https://${role.centre_url}/api/bookings?${new URLSearchParams({ box: String(role.boid), day: date.replaceAll('-', '') })}`);
  return { feedAndDetailComparison: compared ? 'passed' : 'no matching content available in retrieved view', status: view.status, comparedWorkoutCount: compared, comparedVariants, matchingClassSessionCount: daily.bookings.filter(row => row.className === className).length, coverage: view.coverage.scope, exhaustive: false };
}


async function checkTraining(client, gym) {
  const reference = await queryTraining(client, { date: 'tomorrow', className: 'WOD', gymId: gym.id });
  assert.equal(reference.classes.status, 'success');
  assert.equal(reference.workouts.status, 'success');
  assert.equal(reference.bookingView.status, 'success');
  const localDate = new Intl.DateTimeFormat('sv-SE', { timeZone: gym.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const expectedTomorrow = new Date(`${localDate}T12:00:00Z`);
  expectedTomorrow.setUTCDate(expectedTomorrow.getUTCDate() + 1);
  assert.equal(reference.date, expectedTomorrow.toISOString().slice(0, 10));
  const independentWorkout = await checkWorkouts(client, gym, reference.date, 'WOD');
  const todayCounter = new Date(`${reference.date}T12:00:00Z`);
  todayCounter.setUTCDate(todayCounter.getUTCDate() - 1);
  const current = await queryTraining(client, { date: todayCounter.toISOString().slice(0, 10), className: 'WOD', gymId: gym.id });
  assert.equal(current.classes.status, 'success');
  assert.equal(current.workouts.status, 'success');
  assert.equal(current.bookingView.status, 'success');
  const independentCurrentWorkout = await checkWorkouts(client, gym, current.date, 'WOD');
  assert.equal(current.workouts.data.workouts.length, independentCurrentWorkout.comparedWorkoutCount);
  const independentBookings = await checkBookings(client, gym);
  const { request, role } = await openLiveSession(gym);
  const raw = await request(`https://${role.centre_url}/api/bookings?${new URLSearchParams({ box: String(role.boid), day: reference.date.replaceAll('-', '') })}`);
  assert.deepEqual(reference.classes.data.sessions.map(s => s.startTime), raw.bookings.filter(s => s.className === 'WOD').map(s => s.time.slice(0, 5)));
  const matching = reference.bookingView.data.bookings.filter(b => b.date === reference.date && b.classType.name === 'WOD' && b.state === 'booked');
  assert.deepEqual(reference.bookingSummary.bookings, matching);
  assert.equal(reference.bookingSummary.status, matching.length ? 'booked' : 'unconfirmed');
  // Exercise a real reserved class independently when it differs from tomorrow's WOD.
  const actual = reference.bookingView.data.bookings.find(b => b.state === 'booked' && b.classType.name);
  assert.ok(actual, 'Combined live verification requires an existing confirmed reservation.');
  const reserved = await queryTraining(client, { date: actual.date, className: actual.classType.name, gymId: gym.id });
  assert.equal(reserved.classes.status, 'success');
  assert.equal(reserved.workouts.status, 'success');
  assert.equal(reserved.bookingSummary.status, 'booked');
  assert.ok(reserved.bookingSummary.bookings.some(b => b.sourceBookingId === actual.sourceBookingId && b.startTime === actual.startTime));
  return {
    consumingClient: 'queryTraining via MCP SDK over stdio', relativeDate: 'gym-local tomorrow verified',
    reference: { date: reference.date, className: 'WOD', sessionCount: reference.classes.data.sessions.length, workoutStatus: reference.workouts.data.status, workoutCount: reference.workouts.data.workouts.length, bookingStatus: reference.bookingSummary.status, bookedTimeCount: matching.length, independentWorkoutComparison: independentWorkout },
    currentDay: { sessionCount: current.classes.data.sessions.length, workoutStatus: current.workouts.data.status, workoutCount: current.workouts.data.workouts.length, independentWorkoutComparison: independentCurrentWorkout },
    actualReservation: { comparison: 'passed', workoutStatus: reserved.workouts.data.status, bookedTimeCount: reserved.bookingSummary.bookings.length, sameDateAndClassAsReference: actual.date === reference.date && actual.classType.name === 'WOD' },
    independentBookingComparison: independentBookings, bookingDateCoverage: 'unconfirmed',
    firstDeliveryFutureContent: reference.workouts.data.workouts.length ? 'observed' : 'pending: no matching future content in retrieved view',
  };
}

async function checkHistory(client, gym) {
  const { request, role } = await openLiveSession(gym);
  const raw = await request(`https://${role.centre_url}/api/nextBookings?${new URLSearchParams({ box: String(role.boid) })}`);
  const result = await client.callTool({ name: 'get_booking_history', arguments: { gymId: gym.id } });
  assert.notEqual(result.isError, true);
  const view = result.structuredContent;
  assert.equal(view.coverage.status, 'limited');
  assert.equal(view.coverage.retrieval, 'complete');
  assert.equal(view.bookings.length, raw.history.length);
  for (const row of raw.history) {
    const booking = view.bookings.find(b => b.sourceBookingId === row.id);
    assert.ok(booking);
    assert.equal(booking.dateLabel, row.day);
    assert.equal(booking.timeLabel, row.time);
    assert.equal(booking.classType.name, row.className ?? null);
    assert.equal(booking.sourceState, row.bookState ?? null);
    assert.deepEqual(booking.sourceFlags, { assist: row.assist ?? null, lateCancel: row.lateCancel ?? null });
    assert.equal(booking.attendance, 'unverified');
    assert.equal(booking.state, row.lateCancel === 1 ? 'late-cancelled' : row.lateCancel != null && row.lateCancel !== 0 ? 'unknown' : row.bookState === 1 ? 'booked' : row.bookState === 0 ? 'waitlisted' : 'unknown');
    assert.equal(booking.timeZone, gym.timeZone);
    const label = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${booking.date}T12:00:00Z`));
    assert.equal(label.toLocaleLowerCase('es-ES'), row.day.toLocaleLowerCase('es-ES'));
  }
  const timestamps = view.bookings.map(b => `${b.date} ${b.startTime}`);
  assert.deepEqual(timestamps, [...timestamps].sort().reverse());
  return { independentComparison: 'passed', recordCount: view.bookings.length, ordering: 'newest-first', coverage: 'limited upstream history view', attendance: 'unverified', simultaneousFlagsObserved: raw.history.some(r => r.assist === 1 && r.lateCancel === 1) };
}

async function checkActivity(client, gym) {
  const startDate = process.env.AIMHARDER_LIVE_ACTIVITY_START;
  const endDate = process.env.AIMHARDER_LIVE_ACTIVITY_END;
  const { activityQuerySchema } = await import('../dist/activity.js');
  const { calendarDates } = await import('../dist/classes.js');
  assert.equal(activityQuerySchema.safeParse({ startDate, endDate }).success, true);
  const { request, role, accountId } = await openLiveSession(gym);
  const dates = [...calendarDates(startDate, endDate)];
  const expected = [];
  for (const month of new Set(dates.map(date => date.slice(0, 7)))) {
    const raw = await request(`https://aimharder.es/api/activityCalendar?${new URLSearchParams({ month: String(Number(month.slice(5)) - 1), year: month.slice(0,4) })}`);
    assert.deepEqual(Object.keys(raw), ['workouts']);
    for (const [date, day] of Object.entries(raw.workouts)) {
      if (!dates.includes(date)) continue;
      for (const id of new Set(day.rates.ids)) {
        const detail = await request(`https://aimharder.es/api/activity/workout?SEID=${id}`);
        assert.equal(detail.userId, accountId);
        if (detail.boxId !== role.boid) continue;
        const label = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
        assert.equal(detail.recordDate.toLocaleLowerCase('es-ES'), label);
        expected.push({ id, date, detail });
      }
    }
  }
  const result = await client.callTool({ name: 'get_personal_activity', arguments: { startDate, endDate, gymId: gym.id } }, undefined, { timeout: 180_000 });
  assert.notEqual(result.isError, true);
  const view = result.structuredContent;
  assert.equal(view.coverage.status, 'complete');
  assert.deepEqual(view.coverage.completedDates, dates);
  assert.equal(view.entries.length, expected.length);
  for (const { id, date, detail } of expected) {
    const entry = view.entries.find(row => row.sourceActivityId === id);
    assert.ok(entry); assert.equal(entry.date, date); assert.equal(entry.timeZone, gym.timeZone);
    assert.equal(entry.startTime, null); assert.equal(entry.trainingSessionId, null);
    assert.deepEqual(entry.blocks.map(b => b.notes), detail.TIPOWODs.map(b => b.deleted ? null : b.notes ?? null));
    assert.deepEqual(entry.blocks.map(block => block.result), detail.TIPOWODs.map(block => {
      if (block.deleted) return {};
      const expectedResult = Object.fromEntries(['res', 'reps', 'time', 'rondas', 'rx', 'rxstr'].filter(key => Object.hasOwn(block, key)).map(key => [key, block[key]]));
      const descriptions = (detail.chartData?.[block.id] ?? []).filter(row => row.idAction === entry.sourceActivityId).map(row => row.desc);
      assert.ok(new Set(descriptions).size <= 1);
      if (descriptions.length && descriptions[0] !== undefined) expectedResult.desc = descriptions[0];
      return expectedResult;
    }));
    const exercises = detail.ejerRate.filter(e => e.tipoWOD == null || !detail.TIPOWODs[e.tipoWOD].deleted);
    assert.deepEqual(entry.exercises.map(e => e.name), exercises.map(e => e.ejerName));
    for (let i = 0; i < entry.exercises.length; i++) assertExercisePrescription(entry.exercises[i].prescription, exercises[i]);
  }
  return { independentCalendarAndDetailComparison: 'passed', coverage: view.coverage.status, dateCount: dates.length, availableDetailsCompared: expected.length > 0, trainingSessionGrouping: 'unverified' };
}

async function checkRecentActivity(client, gym) {
  const { queryRecentActivity } = await import('../dist/recent-activity-consumer.js');
  const result = await queryRecentActivity(client, { endDate: process.env.AIMHARDER_LIVE_RECENT_END, maxWindows: 3, gymId: gym.id });
  assert.notEqual(result.searchStatus, 'incomplete');
  assert.equal(result.basis, 'activity-entries');
  assert.equal(result.requestedCount, 5);
  assert.equal('trainingSessions' in result, false);
  const { request, role, accountId } = await openLiveSession(gym);
  const { calendarDates } = await import('../dist/classes.js');
  const expected = new Map();
  const calendars = new Map();
  for (const window of result.windows) {
    const dates = [...calendarDates(window.startDate, window.endDate)];
    assert.ok(dates.length <= 31);
    for (const month of new Set(dates.map(date => date.slice(0, 7)))) {
      if (!calendars.has(month)) calendars.set(month, await request(`https://aimharder.es/api/activityCalendar?${new URLSearchParams({ month: String(Number(month.slice(5))-1), year: month.slice(0,4) })}`));
      for (const [date, day] of Object.entries(calendars.get(month).workouts)) {
        if (!dates.includes(date)) continue;
        for (const id of new Set(day.rates.ids)) {
          const detail = await request(`https://aimharder.es/api/activity/workout?SEID=${id}`);
          assert.equal(detail.userId, accountId);
          if (detail.boxId !== role.boid) continue;
          const label = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
          assert.equal(detail.recordDate.toLocaleLowerCase('es-ES'), label);
          expected.set(id,{date,detail});
        }
      }
    }
  }
  const ordered = [...expected].sort(([a, x], [b, y]) => y.date.localeCompare(x.date) || a - b);
  const selected = ordered.slice(0, result.requestedCount);
  assert.deepEqual(result.entries.map(entry => entry.sourceActivityId), selected.map(([id]) => id));
  const cutoff = selected.at(-1)?.[1].date;
  const omittedCount = ordered.slice(result.requestedCount).filter(([, row]) => row.date === cutoff).length;
  assert.deepEqual(result.ordering, {
    withinDate: 'unverified', tieBreak: 'source-activity-id-ascending',
    boundaryTie: omittedCount ? { date: cutoff, selectedCount: selected.filter(([, row]) => row.date === cutoff).length, omittedCount } : null,
  });
  assert.equal(result.latestEntriesVerified, result.searchStatus === 'matched' && omittedCount === 0);
  for (const entry of result.entries) {
    const { date, detail: raw } = expected.get(entry.sourceActivityId);
    assert.equal(entry.date, date); assert.equal(entry.timeZone, gym.timeZone);
    assert.equal(entry.startTime, null); assert.equal(entry.trainingSessionId, null);
    assert.deepEqual(entry.blocks.map(b => b.notes), raw.TIPOWODs.map(b => b.deleted ? null : b.notes ?? null));
    const exercises = raw.ejerRate.filter(e => e.tipoWOD == null || !raw.TIPOWODs[e.tipoWOD].deleted);
    assert.deepEqual(entry.exercises.map(e => e.name), exercises.map(e => e.ejerName));
    for (let i = 0; i < entry.exercises.length; i++) assertExercisePrescription(entry.exercises[i].prescription, exercises[i]);
  }
  return { independentRecentCalendarAndDetailComparison: 'passed', basis: result.basis, searchStatus: result.searchStatus, windows: result.windows.length, requestedCount: result.requestedCount, entriesReturned: result.entries.length, latestEntriesVerified: result.latestEntriesVerified, cutoffDateTied: omittedCount > 0, withinDateOrder: result.ordering.withinDate };
}

async function checkActivityPeriod(client, gym) {
  const { queryActivityPeriod } = await import('../dist/activity-period-consumer.js');
  const query = process.env.AIMHARDER_LIVE_PREVIOUS_MONTH === '1'
    ? { period: 'previous-month', gymId: gym.id }
    : { startDate: process.env.AIMHARDER_LIVE_PERIOD_START, endDate: process.env.AIMHARDER_LIVE_PERIOD_END, gymId: gym.id };
  const result = await queryActivityPeriod(client, query);
  assert.equal(result.coverage, 'complete');
  assert.equal(result.basis, 'activity-entries');
  assert.equal('trainingSessions' in result, false);
  const { request, role, accountId } = await openLiveSession(gym);
  const { calendarDates } = await import('../dist/classes.js');
  const expected = new Map();
  const calendars = new Map();
  for (const window of result.windows) {
    const dates = [...calendarDates(window.startDate, window.endDate)];
    assert.ok(dates.length <= 31);
    for (const month of new Set(dates.map(date => date.slice(0, 7)))) {
      if (!calendars.has(month)) calendars.set(month, await request(`https://aimharder.es/api/activityCalendar?${new URLSearchParams({ month: String(Number(month.slice(5))-1), year: month.slice(0,4) })}`));
      for (const [date, day] of Object.entries(calendars.get(month).workouts)) {
        if (!dates.includes(date)) continue;
        for (const id of new Set(day.rates.ids)) {
          const detail = await request(`https://aimharder.es/api/activity/workout?SEID=${id}`);
          assert.equal(detail.userId, accountId);
          if (detail.boxId !== role.boid) continue;
          const label = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
          assert.equal(detail.recordDate.toLocaleLowerCase('es-ES'), label);
          expected.set(id,{date,detail});
        }
      }
    }
  }
  const expectedDays = new Set([...expected.values()].map(row => row.date));
  assert.equal(result.counts.activityEntries.exact, expected.size);
  assert.equal(result.counts.daysWithActivity.exact, expectedDays.size);
  assert.deepEqual(result.completedDates, [...calendarDates(result.startDate, result.endDate)]);
  assert.deepEqual(result.entries.map(entry => entry.sourceActivityId).sort((a,b)=>a-b), [...expected.keys()].sort((a,b)=>a-b));
  for (const entry of result.entries) {
    const row = expected.get(entry.sourceActivityId);
    assert.equal(entry.date, row.date);
    assert.equal(entry.timeZone, gym.timeZone);
    assert.deepEqual(entry.blocks.map(block => block.notes), row.detail.TIPOWODs.map(block => block.deleted ? null : block.notes ?? null));
  }
  return { independentPeriodCalendarAndDetailComparison: 'passed', period: query.period ?? 'explicit', coverage: result.coverage, windows: result.windows.length, dateCount: result.completedDates.length, entryCount: expected.size, daysWithActivity: expectedDays.size, basis: result.basis };
}
