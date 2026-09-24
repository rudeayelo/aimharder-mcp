/** Example consuming-client composition. This module is not a server tool or API client. */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';
import { dateSchema, classSessionSchema } from './classes.js';
import { upcomingBookingSchema } from './bookings.js';
import { workoutSchema } from './workouts.js';
import { gymIdSchema } from './config.js';

const gymSchema = z.object({ id: gymIdSchema, name: z.string(), timeZone: z.string().nullable(), timeZoneStatus: z.enum(['assumed', 'user-confirmed']) });
const notices = z.array(z.string());
const classesSchema = z.object({ gym: gymSchema, startDate: dateSchema, endDate: dateSchema, coverage: z.literal('complete'), sessions: z.array(classSessionSchema), notices });
const workoutsSchema = z.object({ gym: gymSchema, date: dateSchema, className: z.string(), status: z.enum(['available', 'unavailable', 'unsupported']), ambiguous: z.boolean(), workouts: z.array(workoutSchema), coverage: z.object({ status: z.literal('incomplete'), scope: z.literal('upstream-feed-view'), interpretation: z.enum(['verified', 'unsupported']) }), notices });
const bookingsSchema = z.object({ gym: gymSchema, bookings: z.array(upcomingBookingSchema), bookingStatus: z.enum(['booked', 'none', 'unknown']), coverage: z.object({ status: z.literal('complete'), scope: z.literal('upstream-upcoming-view'), startDate: z.null(), endDate: z.null() }), notices });
const inputSchema = z.object({ date: z.union([dateSchema, z.literal('tomorrow')]), className: z.string().trim().min(1).max(300), gymId: gymIdSchema.optional(), now: z.date().optional() }).strict();
export type TrainingQuery = z.input<typeof inputSchema>;
type Outcome<T> = { status: 'success'; data: T } | { status: 'error'; message: string };

/** Resolve a relative date in the selected gym's reported zone, preserving its provenance. */
export async function queryTraining(client: Pick<Client, 'callTool'>, input: TrainingQuery) {
  const query = inputSchema.parse(input);
  let contextResult;
  try { contextResult = await client.callTool({ name: 'get_account_context', arguments: query.gymId ? { gymId: query.gymId } : {} }); }
  catch { throw new Error('The selected gym context could not be confirmed.'); }
  const context = z.object({ selectedGym: gymSchema }).safeParse(contextResult.structuredContent);
  if (contextResult.isError || !context.success || (query.gymId && context.data.selectedGym.id !== query.gymId)) throw new Error('The selected gym context could not be confirmed.');
  const gym = context.data.selectedGym;
  if (!gym.timeZone) throw new Error('A gym time zone is required.');
  let date = query.date;
  if (date === 'tomorrow') {
    const parts = new Intl.DateTimeFormat('en', { timeZone: gym.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(query.now ?? new Date());
    const part = (name: string) => parts.find(p => p.type === name)!.value;
    // UTC is only a calendar counter: adding 24 hours to the original instant fails near DST.
    const next = new Date(`${part('year')}-${part('month')}-${part('day')}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    date = dateSchema.parse(next.toISOString().slice(0, 10));
  }
  const sameGym = (value: z.infer<typeof gymSchema>) => value.id === gym.id && value.timeZone === gym.timeZone && value.timeZoneStatus === gym.timeZoneStatus;
  async function read<T extends { gym: z.infer<typeof gymSchema> }>(name: string, args: Record<string, unknown>, schema: z.ZodType<T>, applicable: (data: T) => boolean): Promise<Outcome<T>> {
    try {
      const response = await client.callTool({ name, arguments: { ...args, gymId: gym.id } });
      const parsed = schema.safeParse(response.structuredContent);
      if (response.isError || !parsed.success || !sameGym(parsed.data.gym) || !applicable(parsed.data)) throw new Error();
      return { status: 'success', data: parsed.data };
    } catch {
      // Do not expose raw SDK/transport errors or source responses.
      return { status: 'error', message: `${name} could not be confirmed; other query results remain independent.` };
    }
  }
  // Sequential calls keep session recovery bounded and isolated for each tool request.
  const classes = await read('get_class_sessions', { startDate: date, endDate: date, className: query.className }, classesSchema,
    data => data.startDate === date && data.endDate === date && data.sessions.every(s => s.sessionId === `${gym.id}:${date}:${s.sourceId}` && s.date === date && s.classType.name === query.className && s.timeZone === gym.timeZone));
  const workouts = await read('get_published_workouts', { date, className: query.className }, workoutsSchema,
    data => data.date === date && data.className === query.className && (data.status === 'available') === (data.workouts.length > 0) && data.ambiguous === (data.workouts.length > 1) && data.workouts.every(w => w.date === date && w.className === query.className && w.timeZone === gym.timeZone));
  const bookingView = await read('get_upcoming_bookings', {}, bookingsSchema,
    data => data.bookings.every(b => b.timeZone === gym.timeZone));
  const candidates = bookingView.status === 'success' ? bookingView.data.bookings.filter(b => b.date === date && (b.classType.name === query.className || b.classType.name === null)) : [];
  const bookings = candidates.filter(b => b.state === 'booked' && b.classType.name === query.className);
  return {
    gym, date, className: query.className, classes, workouts, bookingView,
    bookingSummary: {
      status: bookings.length ? 'booked' as const : 'unconfirmed' as const,
      completeness: 'unconfirmed' as const, bookings,
      otherCandidates: candidates.filter(b => !bookings.includes(b)),
      notices: ['The upcoming view has no verified date horizon; additional bookings or date-specific absence cannot be confirmed.', 'Booking times remain separate from workout publications; no unique session or workout association is established.'],
    },
    notices: ['Workout coverage is limited to the retrieved feed view. Distinct publications remain alternatives; publication time does not establish applicability.', 'Matching gym, date and class type identify relevant content and sessions, without asserting that every gym shares one prescription across all sessions.'],
  };
}
