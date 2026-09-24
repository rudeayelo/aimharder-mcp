/** Consuming MCP example: activity-entry counts with separate day counts. */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';
import type { ActivityEntry } from './activity.js';
import { gymSchema, validateActivityResponse } from './activity-consumer-contracts.js';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';

const options = { gymId: gymIdSchema.optional(), maxWindows: z.number().int().min(1).max(12).default(12) };
const inputSchema = z.union([
  z.object({ period: z.literal('previous-month'), ...options }).strict(),
  z.object({ startDate: dateSchema, endDate: dateSchema, ...options }).strict()
    .refine(query => query.startDate <= query.endDate, { message: 'startDate must be on or before endDate.' }),
]);
export type ActivityPeriodQuery = z.input<typeof inputSchema>;
function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return dateSchema.parse(value.toISOString().slice(0, 10));
}

export async function queryActivityPeriod(client: Pick<Client, 'callTool'>, input: ActivityPeriodQuery, now = new Date()) {
  const query = inputSchema.parse(input);
  let gym;
  try {
    const result = await client.callTool({ name: 'get_account_context', arguments: query.gymId ? { gymId: query.gymId } : {} });
    if (result.isError) throw new Error();
    gym = z.object({ selectedGym: gymSchema }).parse(result.structuredContent).selectedGym;
    if ((query.gymId && gym.id !== query.gymId) || !gym.timeZone) throw new Error();
  } catch { throw new Error('The selected gym and its time zone could not be established.'); }
  let startDate: string;
  let endDate: string;
  if ('period' in query) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: gym.timeZone!, year: 'numeric', month: '2-digit' }).formatToParts(now);
    const year = parts.find(part => part.type === 'year')!.value.padStart(4, '0');
    const month = parts.find(part => part.type === 'month')!.value;
    endDate = shiftDate(dateSchema.parse(`${year}-${month}-01`), -1);
    startDate = `${endDate.slice(0, 7)}-01`;
  } else { startDate = query.startDate; endDate = query.endDate; }
  const entries = new Map<number, ActivityEntry>();
  const completedDates = new Set<string>();
  const windows: { startDate: string; endDate: string; status: 'complete' | 'incomplete' | 'error'; completedDates: string[]; notices: string[] }[] = [];
  let coverage: 'complete' | 'incomplete' = 'incomplete';
  let cursor = startDate;
  for (let index = 0; index < query.maxWindows; index++) {
    // Bound the addition before shifting, including at the maximum supported year.
    const remainingDays = (Date.parse(`${endDate}T12:00:00Z`) - Date.parse(`${cursor}T12:00:00Z`)) / 86_400_000;
    const windowEnd = shiftDate(cursor, Math.min(30, remainingDays));
    try {
      const result = await client.callTool({ name: 'get_personal_activity', arguments: { startDate: cursor, endDate: windowEnd, gymId: gym.id } });
      if (result.isError) throw new Error();
      const data = validateActivityResponse(result.structuredContent, gym, cursor, windowEnd);
      const recovered = new Map(entries);
      for (const entry of data.entries) {
        const prior = recovered.get(entry.sourceActivityId);
        if (prior && JSON.stringify(prior) !== JSON.stringify(entry)) throw new Error();
        recovered.set(entry.sourceActivityId, entry);
      }
      for (const [id, entry] of recovered) entries.set(id, entry);
      for (const date of data.coverage.completedDates) completedDates.add(date);
      windows.push({ startDate: cursor, endDate: windowEnd, status: data.coverage.status, completedDates: data.coverage.completedDates, notices: [...data.notices, ...(data.coverage.reason ? [data.coverage.reason] : [])] });
      if (data.coverage.status !== 'complete') break;
      if (windowEnd === endDate) { coverage = 'complete'; break; }
    } catch {
      windows.push({ startDate: cursor, endDate: windowEnd, status: 'error', completedDates: [], notices: ['Activity retrieval could not be confirmed; exact period counts are unavailable.'] });
      break;
    }
    cursor = shiftDate(windowEnd, 1);
  }
  const observedEntries = [...entries.values()].sort((a, b) => b.date.localeCompare(a.date) || a.sourceActivityId - b.sourceActivityId);
  const observedDays = new Set(observedEntries.map(entry => entry.date)).size;
  return {
    gym, startDate, endDate, coverage, completedDates: [...completedDates].sort(), windows, maxWindows: query.maxWindows,
    basis: 'activity-entries' as const,
    counts: {
      activityEntries: { observed: entries.size, exact: coverage === 'complete' ? entries.size : null },
      daysWithActivity: { observed: observedDays, exact: coverage === 'complete' ? observedDays : null },
      interpretation: coverage === 'complete' ? 'exact-for-available-calendar-records' as const : 'recovered-lower-bound' as const,
    },
    entries: observedEntries,
    notices: ['Frequency counts distinct activity entries. Days with activity are supplementary; neither measure establishes class attendance.',
      'Coverage describes available calendar records and is not an atomic snapshot or proof of attendance.',
      ...(coverage === 'incomplete' ? ['The period is incomplete because retrieval failed, returned incomplete coverage, or reached the configured window limit. Observed counts are recovered lower bounds; exact totals are unavailable.'] : [])],
  };
}
