import { z } from 'zod';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';
import { AimHarderError } from './errors.js';

export const workoutQuerySchema = z.object({ date: dateSchema, className: z.string().trim().min(1).max(300), gymId: gymIdSchema.optional() }).strict();
export type WorkoutQuery = z.infer<typeof workoutQuerySchema>;
const text = z.string().max(100_000);
const scalar = z.union([text, z.number().finite(), z.boolean(), z.null()]);
const prescriptionSchema = z.record(z.string(), z.union([scalar, z.array(scalar)]));
// The gym renderer uses these labels for a load's tipoud (formaReg 4) or tipoud2 (formaReg 6).
const loadUnits = ['kg', 'lbs', 'pood', '%BW', '%RM', 'RIR', 'RPE'] as const;
const distanceUnits = ['m', 'mi', 'yd', 'ft', 'steps', 'km'] as const;
const blockSchema = z.object({ notes: text.nullable(), prescription: prescriptionSchema });
const exerciseSchema = z.object({ name: text, blockIndex: z.number().int().nonnegative().nullable(), prescription: prescriptionSchema.describe('Raw exercise values: valueUnit labels valor1; loadUnit labels valor2/valor2h/valor2m when verified. s means seconds and %RM is relative, not kilograms.') });
export const workoutSchema = z.object({
  date: dateSchema, className: z.string(), timeZone: z.string(), sessionId: z.null(),
  titles: z.array(text), blocks: z.array(blockSchema), exercises: z.array(exerciseSchema),
  variants: z.array(z.object({ label: text, blocks: z.array(blockSchema), exercises: z.array(exerciseSchema) })),
  provenance: z.object({ sourceId: z.number().int().positive(), url: z.string(), dateField: z.literal('recordDate'), dateLabel: text, publicationDateLabel: text.nullable(), classField: z.literal('wodClass') }),
});
const postSchema = z.object({ id: z.number().int().positive().safe(), wodClass: text.nullish(), ejerRate: z.array(z.unknown()).optional(), TIPOWODs: z.array(z.object({ title: text.nullish() })).optional() });
const feedSchema = z.object({ timeLineFormat: z.literal('0'), timeLineContent: z.literal('7'), elements: z.array(postSchema).max(100), firstLoaded: z.number().int().safe().optional(), lastLoaded: z.number().int().safe().optional(), curDate: text }).strict();
export function parseFeed(body: unknown) {
  const parsed = feedSchema.safeParse(body);
  if (!parsed.success || new Set(parsed.data.elements.map(p => p.id)).size !== parsed.data.elements.length) throw new AimHarderError('INVALID_WORKOUT_RESPONSE');
  return parsed.data.elements;
}
const blockDetailSchema = z.object({
  notes: text.nullish(), deleted: z.boolean(), type: scalar.optional(), timecap: scalar.optional(), timecaptype: scalar.optional(), time: scalar.optional(), rx: scalar.optional(), rondas: scalar.optional(), sstipo: scalar.optional(),
  scaledops: z.union([z.array(text).max(20), z.literal(-1)]).nullish(), scaledver: z.array(z.unknown()).max(20).nullish(),
});
const exerciseDetailSchema = z.object({ ejerName: text, tipoWOD: z.number().int().nonnegative().nullish(),
    valor1: z.array(scalar).nullish(), valor2: scalar.nullish(), valor2h: scalar.nullish(), valor2m: scalar.nullish(), formaReg: scalar.optional(), tipoud: scalar.optional(), tipoud2: scalar.optional(), round: scalar.optional(), roundrepeat: scalar.optional(),
    scaledver: z.array(z.unknown()).max(20).nullish(),
});
const detailSchema = z.object({
  recordDate: text, publishDate: text.nullish(),
  TIPOWODs: z.array(blockDetailSchema), ejerRate: z.array(exerciseDetailSchema),
});
function unitIndex(value: unknown) {
  return typeof value === 'number' && Number.isInteger(value) ? value
    : typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value) ? Number(value) : -1;
}
function projectBlock({ notes, deleted, scaledops: _scaledops, scaledver: _scaledver, ...prescription }: z.infer<typeof blockDetailSchema>) {
  return { notes: deleted ? null : notes ?? null, prescription: deleted ? {} : Object.fromEntries(Object.entries(prescription).filter(([, value]) => value !== undefined)) };
}
function projectExercise({ ejerName, tipoWOD, scaledver: _scaledver, ...prescription }: z.infer<typeof exerciseDetailSchema>) {
  const form = prescription.formaReg;
  const format = typeof form === 'number' && Number.isInteger(form) ? form : typeof form === 'string' && /^[1-6]$/.test(form) ? Number(form) : -1;
  const rawUnit = format === 4 ? prescription.tipoud : format === 6 ? prescription.tipoud2 : undefined;
  const hasValue = (value: unknown) => value !== undefined && value !== null && value !== '';
  const hasPrimaryValue = prescription.valor1?.some(hasValue) ?? false;
  const hasLoadValue = [prescription.valor2, prescription.valor2h, prescription.valor2m].some(hasValue);
  const loadUnit = hasLoadValue ? loadUnits[unitIndex(rawUnit)] : undefined;
  let valueUnit: string | undefined;
  if (hasPrimaryValue) {
    if (format === 1) valueUnit = 's';
    else if (format === 2 || format === 6) valueUnit = distanceUnits[unitIndex(prescription.tipoud)];
    else if (format === 3 || format === 4) valueUnit = 'reps';
    else if (format === 5) valueUnit = 'cal';
  }
  return { name: ejerName, blockIndex: tipoWOD ?? null, prescription: {
    ...Object.fromEntries(Object.entries(prescription).filter(([, value]) => value !== undefined)),
    ...(valueUnit ? { valueUnit } : {}),
    ...(loadUnit ? { loadUnit } : {}),
  } };
}
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export function parseWorkout(body: unknown, post: ReturnType<typeof parseFeed>[number], gymId: string, timeZone: string) {
  const parsed = detailSchema.safeParse(body);
  if (!parsed.success) return null;
  const row = parsed.data;
  const match = /^(\d{1,2}) de ([A-Za-z]+) de (\d{4})$/.exec(row.recordDate);
  if (!match) return null;
  const month = months.indexOf(match[2]!);
  const date = `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1]!.padStart(2, '0')}`;
  if (month < 0 || !dateSchema.safeParse(date).success || !post.wodClass) return null;
  if (row.ejerRate.some(e => e.tipoWOD != null && !row.TIPOWODs[e.tipoWOD])) return null;
  const labels: string[] = [];
  for (const block of row.TIPOWODs) {
    if (!Array.isArray(block.scaledops)) continue;
    if (new Set(block.scaledops).size !== block.scaledops.length || block.scaledops.some(label => !label.trim())) return null;
    for (const label of block.scaledops) if (!labels.includes(label)) labels.push(label);
  }
  const variants = [];
  for (const label of labels) {
    const blocks = [];
    const deletedBlocks = [];
    for (const block of row.TIPOWODs) {
      const index = Array.isArray(block.scaledops) ? block.scaledops.indexOf(label) : -1;
      const source = index < 0 || block.scaledver?.[index] == null ? block : blockDetailSchema.safeParse(block.scaledver[index]).data;
      if (!source) return null;
      blocks.push(projectBlock(source));
      deletedBlocks.push(source.deleted);
    }
    const exercises = [];
    for (const exercise of row.ejerRate) {
      if (exercise.tipoWOD == null) continue;
      const parent = row.TIPOWODs[exercise.tipoWOD]!;
      const index = Array.isArray(parent.scaledops) ? parent.scaledops.indexOf(label) : -1;
      const source = index < 0 ? exercise : exerciseDetailSchema.safeParse(exercise.scaledver?.[index]).data;
      if (!source || source.tipoWOD !== exercise.tipoWOD) return null;
      if (deletedBlocks[exercise.tipoWOD]) continue;
      exercises.push(projectExercise(source));
    }
    variants.push({ label, blocks, exercises });
  }
  return {
    date, className: post.wodClass, timeZone, sessionId: null,
    titles: (post.TIPOWODs ?? []).flatMap(block => block.title ? [block.title] : []),
    blocks: row.TIPOWODs.map(projectBlock),
    exercises: row.ejerRate.filter(e => e.tipoWOD == null || !row.TIPOWODs[e.tipoWOD]?.deleted).map(projectExercise),
    variants,
    provenance: { sourceId: post.id, url: `https://${gymId}.aimharder.es/api/activity/workout?SEID=${post.id}`, dateField: 'recordDate' as const, dateLabel: row.recordDate, publicationDateLabel: row.publishDate ?? null, classField: 'wodClass' as const },
  };
}
