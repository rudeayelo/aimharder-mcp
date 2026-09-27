import { z } from 'zod';
import { gymIdSchema } from './config.js';
import { AimHarderError } from './errors.js';

export const exerciseIdSchema = z.number().int().positive().safe();
export const exercise1RMQuerySchema = z.object({ exerciseId: exerciseIdSchema, gymId: gymIdSchema.optional() }).strict();
export type Exercise1RMQuery = z.infer<typeof exercise1RMQuerySchema>;

const sourceDateSchema = z.number().int().safe().refine(value =>
  value >= Date.UTC(2000, 0, 1) && value < Date.UTC(2100, 0, 1) && value % 86_400_000 === 0,
);
const sourceValueSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d+)?$/).max(40).refine(value => Number.isFinite(Number(value)) && Number(value) > 0);
const pointSchema = z.object({ date: sourceDateSchema, lbs: sourceValueSchema, idAction: exerciseIdSchema });
const contextPointSchema = z.object({ date: z.number().int().safe(), idAction: exerciseIdSchema });
const historySchema = z.object({ date: z.unknown(), idAction: z.unknown(), desc: z.string().max(100_000).nullish() });
const responseSchema = z.object({
  id: z.union([exerciseIdSchema, z.string().regex(/^[1-9]\d*$/).max(16)]),
  name: z.string().trim().min(1).max(300), chartUserId: exerciseIdSchema.optional(),
  chartData1RM: z.array(pointSchema).max(1000), chartData3RM: z.array(contextPointSchema).max(1000),
  chartData5RM: z.array(contextPointSchema).max(1000), chartData10RM: z.array(contextPointSchema).max(1000),
  chartDataWOD: z.array(contextPointSchema).max(1000), history: z.array(historySchema).max(3000),
});

export const exercise1RMResultSchema = z.object({
  gym: z.object({ id: gymIdSchema, name: z.string(), timeZone: z.string().nullable(), timeZoneStatus: z.enum(['assumed', 'user-confirmed']) }),
  exercise: z.object({ sourceExerciseId: exerciseIdSchema, name: z.string() }),
  status: z.enum(['available', 'no-1rm', 'unit-unverified']),
  latest1RM: z.object({ value: sourceValueSchema, unit: z.enum(['kg', 'lbs']).nullable(), sourceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).nullable(),
  otherSeries: z.object({ '3RM': z.number().int().nonnegative(), '5RM': z.number().int().nonnegative(), '10RM': z.number().int().nonnegative(), WOD: z.number().int().nonnegative() }),
  coverage: z.object({ status: z.literal('limited'), scope: z.literal('upstream-exercise-detail-view'), history: z.literal('unverified') }),
  notices: z.array(z.string()),
});

function physicalUnit(point: z.infer<typeof pointSchema>, history: z.infer<typeof historySchema>[]) {
  const units = new Set<string>();
  for (const row of history) {
    if (row.date !== point.date || row.idAction !== point.idAction || !row.desc) continue;
    for (const match of row.desc.matchAll(/(?:^|[^0-9.,])(\d+(?:[.,]\d+)?)\s*(kg|lbs)\b/gi)) {
      if (Number(match[1]!.replace(',', '.')) === Number(point.lbs)) units.add(match[2]!.toLowerCase());
    }
  }
  return units.size === 1 ? ([...units][0] as 'kg' | 'lbs') : null;
}

export function parseExercise1RM(body: unknown, exerciseId: number, accountId: number) {
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) throw new AimHarderError('INVALID_EXERCISE_RESPONSE');
  const row = parsed.data;
  if (Number(row.id) !== exerciseId) throw new AimHarderError('INVALID_EXERCISE_RESPONSE');
  const allEmpty = [row.chartData1RM, row.chartData3RM, row.chartData5RM, row.chartData10RM, row.chartDataWOD, row.history].every(series => series.length === 0);
  if (row.chartUserId !== accountId && !(row.chartUserId === undefined && allEmpty)) throw new AimHarderError('INVALID_EXERCISE_RESPONSE');
  const otherSeries = { '3RM': row.chartData3RM.length, '5RM': row.chartData5RM.length, '10RM': row.chartData10RM.length, WOD: row.chartDataWOD.length };
  const base = {
    exercise: { sourceExerciseId: exerciseId, name: row.name }, otherSeries,
    coverage: { status: 'limited' as const, scope: 'upstream-exercise-detail-view' as const, history: 'unverified' as const },
  };
  if (!row.chartData1RM.length) return { ...base, status: 'no-1rm' as const, latest1RM: null,
    notices: ['No 1RM is present in the returned exercise-detail view. Other RM categories and WOD are separate context, not substitutes. The view is not known to cover lifetime history.'] };
  const latestDate = Math.max(...row.chartData1RM.map(point => point.date));
  const latest = row.chartData1RM.filter(point => point.date === latestDate);
  if (latest.length !== 1) throw new AimHarderError('INVALID_EXERCISE_RESPONSE');
  const point = latest[0]!;
  const unit = physicalUnit(point, row.history);
  return { ...base, status: unit ? 'available' as const : 'unit-unverified' as const,
    latest1RM: { value: point.lbs, unit, sourceDate: new Date(point.date).toISOString().slice(0, 10) },
    notices: [
      'The latest 1RM is selected by the source date, not by the highest recorded load. The numeric source date matched UTC midnight in the verified format; it is not a publication timestamp.',
      unit ? 'The physical unit is corroborated by a same-date, same-action history description containing this exact load and unit.' : 'The physical unit could not be corroborated; the chart field named lbs and the ud code alone do not establish it.',
      'History completeness and the record’s gym of origin are unverified. WOD and other RM series are separate context.',
    ],
  };
}
