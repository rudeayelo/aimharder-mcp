import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { dateSchema, parseClassDay, timeSchema } from './classes.js';
import { gymIdSchema } from './config.js';

export const bookingCreationQuerySchema = z.object({
  gymId: gymIdSchema.optional(), date: dateSchema,
  className: z.string().min(1).max(300).refine((name) => name.trim().length > 0),
  startTime: timeSchema, endTime: timeSchema,
}).strict();
export type BookingCreationQuery = z.infer<typeof bookingCreationQuerySchema>;

const rowFields = z.object({
  enabled: z.number().int(), bookState: z.number().int().nullable(),
  cancelledId: z.number().int().nullable(), resadmin: z.number().int(),
  hidden: z.number().int(),
});

export type BookingCandidate = {
  className: string; date: string; startTime: string; endTime: string;
  currentState: 'unbooked' | 'booked' | 'waitlisted' | 'unknown';
  eligibility: 'offered' | 'unsupported';
};
export type InternalBookingCandidate = BookingCandidate & { sourceId: number };

export function bookingCandidates(body: unknown, gymId: string, date: string, timeZone: string, query: BookingCreationQuery): InternalBookingCandidate[] {
  const sessions = parseClassDay(body, gymId, date, timeZone);
  const rows = (body as { bookings: unknown[] }).bookings;
  return sessions.flatMap((session, index) => {
    const endTime = session.timeLabel.slice(-5);
    if (session.classType.name !== query.className || session.startTime !== query.startTime || endTime !== query.endTime) return [];
    const flags = rowFields.safeParse(rows[index]);
    const state = !flags.success ? 'unknown' as const : flags.data.bookState === null ? 'unbooked' as const
      : flags.data.bookState === 1 ? 'booked' as const : flags.data.bookState === 0 ? 'waitlisted' as const : 'unknown' as const;
    const offered = flags.success && flags.data.enabled === 1 && flags.data.resadmin === 0
      && flags.data.cancelledId === null && flags.data.hidden === 0 && state === 'unbooked';
    return [{ sourceId: session.sourceId, className: session.classType.name, date,
      startTime: session.startTime, endTime, currentState: state,
      eligibility: offered ? 'offered' as const : 'unsupported' as const }];
  });
}

export function nearReportedBookingCutoff(date: string, startTime: string, timeZone: string, now = new Date()): boolean {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  const currentDate = `${parts.year}-${parts.month}-${parts.day}`;
  // UTC is only a Gregorian date counter here, not an inferred class instant.
  const days = (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${currentDate}T00:00:00Z`)) / 86_400_000;
  const startMinutes = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3));
  const nowMinutes = Number(parts.hour) * 60 + Number(parts.minute);
  const wallMinutes = days * 1440 + startMinutes - nowMinutes;
  return wallMinutes >= 0 && wallMinutes <= 120;
}

export type BookingCreationPreview = {
  action: 'create'; gym: { id: string; name: string; timeZone: string; timeZoneStatus: 'user-confirmed' };
  target: Omit<BookingCandidate, 'currentState' | 'eligibility'>;
  currentState: 'unbooked';
  credit: { possibleUse: string; balance: null; entitlementPeriod: null };
  notices: string[];
};

export class BookingPreparationStore {
  #entries = new Map<string, { action: 'create'; accountId: number; boxId: number; sourceId: number; preview: BookingCreationPreview; expires: number }>();

  issue(accountId: number, boxId: number, sourceId: number, preview: BookingCreationPreview) {
    const now = Date.now();
    for (const [reference, entry] of this.#entries) if (entry.expires <= now) this.#entries.delete(reference);
    if (this.#entries.size >= 32) this.#entries.delete(this.#entries.keys().next().value!);
    const actionReference = randomBytes(32).toString('hex');
    const expires = now + 120_000;
    this.#entries.set(actionReference, { action: 'create', accountId, boxId, sourceId, preview: structuredClone(preview), expires });
    return { actionReference, expiresAt: new Date(expires).toISOString() };
  }

  take(reference: string, action: 'create' | 'cancel', accountId: number, gymId: string) {
    const entry = this.#entries.get(reference);
    this.#entries.delete(reference);
    if (!entry || entry.expires <= Date.now() || entry.action !== action || entry.accountId !== accountId || entry.preview.gym.id !== gymId) return null;
    return entry;
  }
}
