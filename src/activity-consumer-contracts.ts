import { z } from 'zod';
import { activityCoverageSchema, activityEntrySchema } from './activity.js';
import { calendarDates, dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';

export const gymSchema = z.object({ id: gymIdSchema, name: z.string(), timeZone: z.string().nullable(), timeZoneStatus: z.enum(['assumed', 'user-confirmed']) });
export const activityResponseSchema = z.object({ gym: gymSchema, startDate: dateSchema, endDate: dateSchema, entries: z.array(activityEntrySchema), coverage: activityCoverageSchema, notices: z.array(z.string()) });

/** Reject responses that cannot establish the requested gym/date coverage. */
export function validateActivityResponse(value: unknown, gym: z.infer<typeof gymSchema>, startDate: string, endDate: string) {
  const data = activityResponseSchema.parse(value);
  const dates = [...calendarDates(startDate, endDate)];
  if (data.gym.id !== gym.id || data.gym.timeZone !== gym.timeZone || data.gym.timeZoneStatus !== gym.timeZoneStatus
    || data.startDate !== startDate || data.endDate !== endDate
    || data.entries.some(entry => !dates.includes(entry.date) || entry.timeZone !== gym.timeZone)
    || data.coverage.completedDates.some(date => !dates.includes(date))
    || new Set(data.coverage.completedDates).size !== data.coverage.completedDates.length
    || (data.coverage.status === 'complete' && data.coverage.completedDates.length !== dates.length)) throw new Error('Activity response scope or coverage could not be confirmed.');
  return data;
}
