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

/** Search activity entries by gym-local record date; same-day ID order is presentation only. */
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
    if (entries.size >= query.count) { searchStatus = 'matched'; break; }
    if (startDate === '0001-01-01') break;
    endDate = previousDate(startDate, 1);
  }
  const ordered = [...entries.values()].sort((a, b) => b.date.localeCompare(a.date) || a.sourceActivityId - b.sourceActivityId);
  const selected = ordered.slice(0, query.count);
  const cutoffDate = selected.at(-1)?.date;
  const omittedCount = ordered.slice(query.count).filter(entry => entry.date === cutoffDate).length;
  const boundaryTie = cutoffDate && omittedCount > 0
    ? { date: cutoffDate, selectedCount: selected.filter(entry => entry.date === cutoffDate).length, omittedCount }
    : null;
  return {
    gym, endDate: query.endDate, requestedCount: query.count, basis: 'activity-entries' as const,
    searchStatus, latestEntriesVerified: searchStatus === 'matched' && boundaryTie === null, maxWindows: query.maxWindows,
    searchedStartDate: windows.at(-1)!.startDate, windows,
    entries: selected,
    ordering: { withinDate: 'unverified' as const, tieBreak: 'source-activity-id-ascending' as const, boundaryTie },
    notices: [
      'Activity entries are ordered by gym-local record date descending. ID order within a date is presentation order, not chronology.',
      ...(boundaryTie ? ['The requested count splits a date with tied entries. The selected subset on that date is deterministic, but its chronological membership cannot be verified.'] : []),
      'Latest-entry verification concerns membership by record date, not within-day order. Incomplete results are recovered entries, not a verified latest selection.',
      'Coverage is bounded by the reported windows and end date, and is not an atomic snapshot or complete lifetime history.',
    ],
  };
}
