import { z } from 'zod';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';
import { AimHarderError } from './errors.js';
import { parseWorkout, workoutSchema } from './workouts.js';

export const activityQuerySchema = z.object({ startDate: dateSchema, endDate: dateSchema, gymId: gymIdSchema.optional() }).strict()
  .refine(q => q.startDate <= q.endDate && (Date.parse(`${q.endDate}T00:00:00Z`) - Date.parse(`${q.startDate}T00:00:00Z`)) / 86_400_000 < 31,
    { message: 'Supply an inclusive interval of 1 to 31 consecutive calendar dates.' });
export type ActivityQuery = z.infer<typeof activityQuerySchema>;
export const activityEntrySchema = workoutSchema.pick({ titles: true, blocks: true, exercises: true }).extend({
  sourceActivityId: z.number().int().positive().safe(), date: dateSchema, timeZone: z.string(), startTime: z.null(), trainingSessionId: z.null(),
});
export type ActivityEntry = z.infer<typeof activityEntrySchema>;
export const activityCoverageSchema = z.object({ status: z.enum(['complete', 'incomplete']), scope: z.literal('account-activity-calendar'), completedDates: z.array(dateSchema), reason: z.string().nullable() });
const ratesSchema = z.object({ ids: z.array(z.number().int().positive().safe()).max(500), colors: z.array(z.string().nullable()).optional() })
  .catchall(z.array(z.unknown()))
  .refine(row => Object.keys(row).every(key => key === 'ids' || key === 'colors' || /^[1-9]\d*$/.test(key)));
const calendarSchema = z.object({ workouts: z.union([z.array(z.never()), z.record(dateSchema, z.object({ rates: ratesSchema, TIPOWODs: z.record(z.string().regex(/^[1-9]\d*$/), z.unknown()) }).strict())]) }).strict();
export function parseActivityCalendar(body: unknown, month: string) {
  const parsed = calendarSchema.safeParse(body);
  if (!parsed.success) throw new AimHarderError('INVALID_ACTIVITY_RESPONSE');
  const entries = new Map<string, number[]>();
  const seen = new Map<number, string>();
  for (const [date, day] of Object.entries(parsed.data.workouts)) {
    if (!date.startsWith(`${month}-`)) throw new AimHarderError('INVALID_ACTIVITY_RESPONSE');
    for (const id of day.rates.ids) {
      if (seen.has(id) && seen.get(id) !== date) throw new AimHarderError('INVALID_ACTIVITY_RESPONSE');
      seen.set(id, date);
    }
    entries.set(date, [...new Set(day.rates.ids)]);
  }
  return entries;
}
const identitySchema = z.object({ userId: z.number().int().positive().safe(), boxId: z.number().int().positive().safe() });
export function parseActivityDetail(body: unknown, sourceActivityId: number, date: string, accountId: number, boxId: number, gymId: string, timeZone: string): ActivityEntry | null {
  const identity = identitySchema.safeParse(body);
  if (!identity.success || identity.data.userId !== accountId) throw new AimHarderError('INVALID_ACTIVITY_RESPONSE');
  // The calendar is account-wide. Verify the detail's gym before projecting it.
  if (identity.data.boxId !== boxId) return null;
  const workout = parseWorkout(body, { id: sourceActivityId, wodClass: 'personal-activity' }, gymId, timeZone);
  if (!workout || workout.date !== date) throw new AimHarderError('INVALID_ACTIVITY_RESPONSE');
  return activityEntrySchema.parse({ sourceActivityId, date, timeZone, startTime: null, trainingSessionId: null, titles: workout.titles, blocks: workout.blocks, exercises: workout.exercises });
}
