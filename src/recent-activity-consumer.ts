/** Consuming MCP client example; no additional API endpoint or server tool. */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';
import type { ActivityEntry } from './activity.js';
import { gymSchema, validateActivityResponse } from './activity-consumer-contracts.js';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';

const inputSchema = z.object({ endDate: dateSchema, count: z.number().int().min(1).max(31).default(5), maxWindows: z.number().int().min(1).max(12).default(3), gymId: gymIdSchema.optional() }).strict();
export type RecentActivityQuery = z.input<typeof inputSchema>;
function previousDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() - days);
  return dateSchema.parse(value.toISOString().slice(0, 10));
}

/** Search by gym-local dates; neither activity IDs nor equal dates establish sessions. */
export async function queryRecentActivity(client: Pick<Client, 'callTool'>, input: RecentActivityQuery) {
  const query = inputSchema.parse(input);
  let context;
  try {
    const result = await client.callTool({ name: 'get_account_context', arguments: query.gymId ? { gymId: query.gymId } : {} });
    if (result.isError) throw new Error();
    context = z.object({ selectedGym: gymSchema }).parse(result.structuredContent).selectedGym;
    if ((query.gymId && context.id !== query.gymId) || context.timeZoneStatus !== 'user-confirmed' || !context.timeZone) throw new Error();
  } catch { throw new Error('The selected gym and its confirmed time zone could not be established.'); }
  const gym = context;
  const entries = new Map<number, ActivityEntry>();
  const windows: { startDate: string; endDate: string; status: 'complete' | 'incomplete' | 'error'; completedDates: string[]; notices: string[] }[] = [];
  let searchStatus: 'matched' | 'limit-reached' | 'incomplete' = 'limit-reached';
  let endDate = query.endDate;
  for (let index = 0; index < query.maxWindows; index++) {
    // Calendar counters avoid DST and never exceed 31 inclusive dates.
    const startDate = endDate < '0001-01-31' ? '0001-01-01' : previousDate(endDate, 30);
    try {
      const result = await client.callTool({ name: 'get_personal_activity', arguments: { startDate, endDate, gymId: gym.id } });
      if (result.isError) throw new Error();
      const data = validateActivityResponse(result.structuredContent, gym, startDate, endDate);
      // Validate every repeated identity before accepting this window. A date change is not a new entry.
      const recovered = new Map(entries);
      for (const entry of data.entries) {
        const prior = recovered.get(entry.sourceActivityId);
        if (prior && JSON.stringify(prior) !== JSON.stringify(entry)) throw new Error();
        recovered.set(entry.sourceActivityId, entry);
      }
      for (const [id, entry] of recovered) entries.set(id, entry);
      windows.push({ startDate, endDate, status: data.coverage.status, completedDates: data.coverage.completedDates, notices: [...data.notices, ...(data.coverage.reason ? [data.coverage.reason] : [])] });
      if (data.coverage.status !== 'complete') { searchStatus = 'incomplete'; break; }
    } catch {
      windows.push({ startDate, endDate, status: 'error', completedDates: [], notices: ['Activity retrieval could not be confirmed; newer gaps prevent a verified latest result.'] });
      searchStatus = 'incomplete'; break;
    }
    if (new Set([...entries.values()].map(entry => entry.date)).size >= query.count) { searchStatus = 'matched'; break; }
    if (startDate === '0001-01-01') break;
    endDate = previousDate(startDate, 1);
  }
  const dates = [...new Set([...entries.values()].map(entry => entry.date))].sort().reverse().slice(0, query.count);
  return {
    gym, endDate: query.endDate, requestedDays: query.count, basis: 'days-with-activity' as const,
    trainingSessions: { status: 'blocked' as const, sessions: null, reason: 'Training-session grouping, within-day chronology and attendance are not verified.' },
    searchStatus, latestDaysVerified: searchStatus === 'matched', maxWindows: query.maxWindows,
    searchedStartDate: windows.at(-1)!.startDate, windows,
    days: dates.map(date => ({ date, entries: [...entries.values()].filter(entry => entry.date === date).sort((a, b) => a.sourceActivityId - b.sourceActivityId) })),
    notices: ['This is a days-with-activity alternative, not the requested latest training sessions.', 'All entries on each selected date are retained. ID order within a date is presentation order, not training chronology.', 'Coverage is bounded by the reported windows and end date, and is not an atomic snapshot or complete lifetime history.'],
  };
}
