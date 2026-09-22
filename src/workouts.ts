import { z } from 'zod';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';
import { AimHarderError } from './errors.js';

export const workoutQuerySchema = z.object({ date: dateSchema, className: z.string().trim().min(1).max(300), gymId: gymIdSchema.optional() }).strict();
export type WorkoutQuery = z.infer<typeof workoutQuerySchema>;
const text = z.string().max(100_000);
const scalar = z.union([text, z.number().finite(), z.boolean(), z.null()]);
const prescriptionSchema = z.record(z.string(), z.union([scalar, z.array(scalar)]));
export const workoutSchema = z.object({
  date: dateSchema, className: z.string(), timeZone: z.string(), sessionId: z.null(),
  titles: z.array(text), blocks: z.array(z.object({ notes: text.nullable(), prescription: prescriptionSchema })),
  exercises: z.array(z.object({ name: text, blockIndex: z.number().int().nonnegative().nullable(), prescription: prescriptionSchema })),
  provenance: z.object({ sourceId: z.number().int().positive(), url: z.string(), dateField: z.literal('recordDate'), dateLabel: text, publicationDateLabel: text.nullable(), classField: z.literal('wodClass') }),
});
const postSchema = z.object({ id: z.number().int().positive().safe(), wodClass: text.nullish(), ejerRate: z.array(z.unknown()).optional(), TIPOWODs: z.array(z.object({ title: text.nullish() })).optional() });
const feedSchema = z.object({ timeLineFormat: z.literal('0'), timeLineContent: z.literal('7'), elements: z.array(postSchema).max(100), firstLoaded: z.number().int().safe().optional(), lastLoaded: z.number().int().safe().optional(), curDate: text }).strict();
export function parseFeed(body: unknown) {
  const parsed = feedSchema.safeParse(body);
  if (!parsed.success || new Set(parsed.data.elements.map(p => p.id)).size !== parsed.data.elements.length) throw new AimHarderError('INVALID_WORKOUT_RESPONSE');
  return parsed.data.elements;
}
const detailSchema = z.object({
  recordDate: text, publishDate: text.nullish(),
  TIPOWODs: z.array(z.object({ notes: text.nullish(), deleted: z.boolean(), type: scalar.optional(), timecap: scalar.optional(), timecaptype: scalar.optional(), time: scalar.optional(), rx: scalar.optional(), rondas: scalar.optional(), sstipo: scalar.optional() })),
  ejerRate: z.array(z.object({ ejerName: text, tipoWOD: z.number().int().nonnegative().nullish(),
    valor1: z.array(scalar).nullish(), valor2: scalar.nullish(), formaReg: scalar.optional(), tipoud: scalar.optional(), tipoud2: scalar.optional(), round: scalar.optional(), roundrepeat: scalar.optional(),
  })),
});
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
  return {
    date, className: post.wodClass, timeZone, sessionId: null,
    titles: (post.TIPOWODs ?? []).flatMap(block => block.title ? [block.title] : []),
    blocks: row.TIPOWODs.map(({ notes, deleted, ...prescription }) => ({ notes: deleted ? null : notes ?? null, prescription: deleted ? {} : Object.fromEntries(Object.entries(prescription).filter(([, value]) => value !== undefined)) })),
    exercises: row.ejerRate.filter(e => e.tipoWOD == null || !row.TIPOWODs[e.tipoWOD]?.deleted).map(({ ejerName, tipoWOD, ...prescription }) => ({
      name: ejerName, blockIndex: tipoWOD ?? null,
      prescription: Object.fromEntries(Object.entries(prescription).filter(([, value]) => value !== undefined)),
    })),
    provenance: { sourceId: post.id, url: `https://${gymId}.aimharder.es/api/activity/workout?SEID=${post.id}`, dateField: 'recordDate' as const, dateLabel: row.recordDate, publicationDateLabel: row.publishDate ?? null, classField: 'wodClass' as const },
  };
}
