import { z } from 'zod';
import { dateSchema, timeSchema } from './classes.js';
import { AimHarderError } from './errors.js';

const sourceId = z.number().int().positive().safe();
export const upcomingBookingSchema = z.object({
  sourceBookingId: sourceId, sessionId: z.null(),
  date: dateSchema, dateLabel: z.string(), startTime: timeSchema, timeLabel: z.string(), timeZone: z.string(),
  classType: z.object({ id: z.null(), name: z.string().nullable() }),
  state: z.enum(['booked', 'waitlisted', 'unknown']), sourceState: z.number().int().safe().nullable(),
});
export type UpcomingBooking = z.infer<typeof upcomingBookingSchema>;
const responseSchema = z.object({
  nextClasses: z.array(z.object({
    id: sourceId, day: z.string(),
    time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d - (?:[01]\d|2[0-3]):[0-5]\d$/),
    className: z.string().min(1).max(300).refine((name) => name.trim().length > 0).nullish(),
    bookState: z.number().int().safe().nullish(),
  })),
  // History is returned by this operation but is not interpreted or exposed by this slice.
  history: z.array(z.unknown()),
}).strict();
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** Accept only the verified Spanish full-date format; never let Date.parse guess a locale. */
function calendarDate(label: string): string {
  const match = /^(Domingo|Lunes|Martes|Miércoles|Jueves|Viernes|Sábado), (\d{1,2}) de ([A-Za-z]+) de (\d{4})$/.exec(label);
  if (!match) throw new AimHarderError('INVALID_BOOKING_RESPONSE');
  const month = months.indexOf(match[3]!);
  const date = `${match[4]}-${String(month + 1).padStart(2, '0')}-${match[2]!.padStart(2, '0')}`;
  if (month < 0 || !dateSchema.safeParse(date).success || weekdays[new Date(`${date}T00:00:00Z`).getUTCDay()] !== match[1]) {
    throw new AimHarderError('INVALID_BOOKING_RESPONSE');
  }
  return date;
}

export function parseUpcomingBookings(body: unknown, timeZone: string): UpcomingBooking[] {
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) throw new AimHarderError('INVALID_BOOKING_RESPONSE');
  const ids = new Set<number>();
  return parsed.data.nextClasses.map((row) => {
    if (ids.has(row.id)) throw new AimHarderError('INVALID_BOOKING_RESPONSE');
    ids.add(row.id);
    return {
      sourceBookingId: row.id, sessionId: null,
      date: calendarDate(row.day), dateLabel: row.day,
      startTime: row.time.slice(0, 5), timeLabel: row.time, timeZone,
      classType: { id: null, name: row.className ?? null },
      state: row.bookState === 1 ? 'booked' : row.bookState === 0 ? 'waitlisted' : 'unknown',
      sourceState: row.bookState ?? null,
    };
  });
}
