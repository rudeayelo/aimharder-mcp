import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { dateSchema } from './classes.js';
import { gymIdSchema } from './config.js';
import { AimHarderError } from './errors.js';
import { calculatePersonalLoad, gymLocalToday } from './calculated-loads.js';
import type { Workout } from './calculated-loads.js';
import { validatedExerciseId } from './workouts.js';
import type { parseHistorical1RM } from './exercise-records.js';

const positiveId = z.number().int().positive().safe();
const decimalKilograms = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d+)?$/).max(40)
  .refine(value => Number.isFinite(Number(value)) && Number(value) > 0);
export const publicationQuerySchema = z.object({
  gymId: gymIdSchema.optional(), sourceActivityId: positiveId, activityDate: dateSchema.optional(),
  variantLabel: z.string().min(1).max(100).optional(),
  blockResults: z.array(z.object({ blockIndex: z.number().int().nonnegative(),
    kind: z.enum(['time-seconds', 'rounds', 'repetitions', 'kilograms', 'pounds']),
    value: z.number().finite().nonnegative(),
  }).strict()).max(30).default([]),
  actualLoads: z.array(z.object({ exerciseIndex: z.number().int().nonnegative(),
    actualKilograms: decimalKilograms, sourceAlternative: z.enum(['single', 'male', 'female']).optional(),
    confirmedActual: z.literal(true),
  }).strict()).max(50).default([]),
  comment: z.string().max(5000).optional(),
}).strict();
export type PublicationQuery = z.infer<typeof publicationQuerySchema>;
export const publicationExecutionSchema = z.object({
  gymId: gymIdSchema.optional(), actionReference: z.string().regex(/^[a-f0-9]{64}$/),
  confirmed: z.literal(true), acknowledgePossibleDuplicate: z.boolean().optional(),
}).strict();

export type PublicationAudience = { publication: 'everyone' | 'followers' | 'only-me'; wodTvResults: boolean };
function checkedRadio(form: string, name: string, values: readonly string[]): string {
  const inputs = [...form.matchAll(/<input\b[^>]*>/gi)].map(match => match[0]!).filter(input =>
    new RegExp(`\\bname=["']${name}["']`, 'i').test(input));
  if (inputs.length !== values.length) throw new AimHarderError('INVALID_ACTIVITY_PREFERENCES');
  const found = inputs.map(input => ({ value: /\bvalue=["']([^"']+)["']/i.exec(input)?.[1], checked: /\bchecked(?:\s*=|\s|>)/i.test(input) }));
  if (new Set(found.map(row => row.value)).size !== values.length || found.some(row => !row.value || !values.includes(row.value)))
    throw new AimHarderError('INVALID_ACTIVITY_PREFERENCES');
  const selected = found.filter(row => row.checked);
  if (selected.length !== 1) throw new AimHarderError('INVALID_ACTIVITY_PREFERENCES');
  return selected[0]!.value!;
}

export function parsePublicationAudience(body: unknown): PublicationAudience {
  if (typeof body !== 'string') throw new AimHarderError('INVALID_ACTIVITY_PREFERENCES');
  const form = /<form\b[^>]*\bid=["']frmConfiguration["'][^>]*>([\s\S]*?)<\/form>/i.exec(body)?.[1];
  if (!form || !form.includes('¿Quién puede ver tus publicaciones?')) throw new AimHarderError('INVALID_ACTIVITY_PREFERENCES');
  const publication = checkedRadio(form, 'USPRIVACIDADDEF', ['1', '2', '4']);
  const wodTv = checkedRadio(form, 'USPRIVCAST', ['0', '1']);
  return { publication: publication === '1' ? 'followers' : publication === '2' ? 'everyone' : 'only-me', wodTvResults: wodTv === '0' };
}

const copySchema = z.object({ box: z.array(z.object({
  boxID: positiveId, userId: positiveId, date: z.string().max(40),
  rates: z.array(z.object({ ejerName: z.string().max(100_000), ejerId: z.unknown().optional(), tipoWOD: z.number().int().nonnegative().nullable() }).passthrough()).max(200),
  TIPOWODs: z.array(z.object({ type: z.union([z.string(), z.number()]), deleted: z.boolean() }).passthrough()).max(50),
}).passthrough()).length(1) });
export type CopySource = z.infer<typeof copySchema>['box'][number];
function sameExercise(copyRow: unknown, projected: Workout['exercises'][number]) {
  const row = z.object({ ejerName: z.string(), ejerId: z.unknown().optional(),
    formaReg: z.unknown().optional(), tipoud: z.unknown().optional(),
    valor2: z.unknown().optional(), valor2h: z.unknown().optional(), valor2m: z.unknown().optional(),
  }).safeParse(copyRow);
  if (!row.success || row.data.ejerName !== projected.name) return false;
  const sourceId = validatedExerciseId(row.data.ejerId);
  if (sourceId !== projected.sourceExerciseId) return false;
  for (const field of ['formaReg', 'tipoud'] as const) {
    if (JSON.stringify(row.data[field] ?? null) !== JSON.stringify(projected.prescription[field] ?? null)) return false;
  }
  return sameCopyLoad(row.data, projected.prescription);
}
type SourceLoad = { valor2?: unknown; valor2h?: unknown; valor2m?: unknown };
function splitSourceLoad(source: SourceLoad) {
  if (typeof source.valor2 !== 'string') return null;
  const split = /^((?:0|[1-9]\d*)(?:\.\d+)?)\/((?:0|[1-9]\d*)(?:\.\d+)?)$/.exec(source.valor2);
  if (!split) return null;
  const [, first, second] = split;
  if ((source.valor2h ?? null) !== null || (source.valor2m ?? null) !== null) {
    if (source.valor2h !== first || source.valor2m !== second) return null;
  }
  return { first, second };
}
export function sameCopyLoadAlternatives(copy: SourceLoad, source: SourceLoad) {
  if (JSON.stringify(copy.valor2h ?? null) === JSON.stringify(source.valor2h ?? null)
    && JSON.stringify(copy.valor2m ?? null) === JSON.stringify(source.valor2m ?? null)) return true;
  const split = splitSourceLoad(source);
  return !!split && copy.valor2h === split.first && copy.valor2m === split.second;
}
export function sameCopyLoad(copy: SourceLoad, source: SourceLoad) {
  const fields = ['valor2', 'valor2h', 'valor2m'] as const;
  if (fields.every(field => JSON.stringify(copy[field] ?? null) === JSON.stringify(source[field] ?? null))) return true;
  const split = splitSourceLoad(source);
  return !!split && copy.valor2 === split.first && copy.valor2h === split.first && copy.valor2m === split.second;
}
export function sameCopyNotes(copyNotes: unknown, sourceNotes: unknown) {
  if ((copyNotes ?? null) === (sourceNotes ?? null)) return true;
  return typeof copyNotes === 'string' && typeof sourceNotes === 'string'
    && copyNotes === sourceNotes.replace(/<[^>]*>/g, '');
}
function sameBlock(copyBlock: unknown, projected: Workout['blocks'][number]) {
  const block = z.object({ deleted: z.boolean(), notes: z.unknown().optional(), type: z.unknown().optional(),
    timecap: z.unknown().optional(), timecaptype: z.unknown().optional() }).safeParse(copyBlock);
  if (!block.success) return false;
  if (block.data.deleted) return projected.notes === null && Object.keys(projected.prescription).length === 0;
  if (!sameCopyNotes(block.data.notes, projected.notes)) return false;
  return (['type', 'timecap', 'timecaptype'] as const).every(field =>
    JSON.stringify(block.data[field] ?? null) === JSON.stringify(projected.prescription[field] ?? null));
}
export function verifyCopySource(body: unknown, publisher: number, boxId: number, workout: Workout): CopySource {
  const parsed = copySchema.safeParse(body);
  if (!parsed.success) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  const copy = parsed.data.box[0]!;
  if (copy.userId !== publisher || copy.boxID !== boxId || copy.date.slice(0, 10) !== workout.date
    || copy.TIPOWODs.length !== workout.blocks.length) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  if (copy.TIPOWODs.some((block, index) => !sameBlock(block, workout.blocks[index]!))) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  // The detail and Copy views must describe the same ordered exercise rows.
  const visible = copy.rates.filter(row => row.tipoWOD === null || !copy.TIPOWODs[row.tipoWOD]?.deleted);
  if (visible.length !== workout.exercises.length || visible.some((row, index) => !sameExercise(row, workout.exercises[index]!)))
    throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  for (const variant of workout.variants) {
    const selectedRows = [];
    if (copy.TIPOWODs.some((block, blockIndex) => {
      const labels = Array.isArray(block.scaledops) ? block.scaledops : [];
      const index = labels.indexOf(variant.label);
      const selectedBlock = index < 0 || block.scaledver == null ? block :
        Array.isArray(block.scaledver) ? block.scaledver[index] : null;
      return !sameBlock(selectedBlock, variant.blocks[blockIndex]!);
    })) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    for (const row of copy.rates) {
      if (row.tipoWOD === null) continue;
      const block = copy.TIPOWODs[row.tipoWOD];
      if (!block) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
      const labels = Array.isArray(block.scaledops) ? block.scaledops : [];
      const index = labels.indexOf(variant.label);
      const selectedBlock = index < 0 || block.scaledver == null ? block :
        Array.isArray(block.scaledver) ? block.scaledver[index] : null;
      const selectedRow = index < 0 ? row : Array.isArray(row.scaledver) ? row.scaledver[index] : null;
      if (!selectedBlock || typeof selectedBlock !== 'object' || !selectedRow || typeof selectedRow !== 'object')
        throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
      if ('deleted' in selectedBlock && selectedBlock.deleted === true) continue;
      selectedRows.push(selectedRow);
    }
    if (selectedRows.length !== variant.exercises.length || selectedRows.some((row, index) =>
      !sameExercise(row, variant.exercises[index]!)))
      throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  }
  return copy;
}

export type PublicationPreview = {
  gym: { id: string; name: string; timeZone: string; timeZoneStatus: 'user-confirmed' };
  source: { sourceActivityId: number; className: string; intendedDate: string; titles: string[] };
  activityDate: string; variantLabel: string | null; audience: PublicationAudience;
  prescription: { blocks: Workout['blocks']; exercises: Workout['exercises'] };
  blockResults: PublicationQuery['blockResults']; actualLoads: Array<{ exerciseIndex: number; exerciseName: string;
    originalPrescription: Workout['exercises'][number]['prescription']; actualKilograms: string;
    sourceAlternative: 'single' | 'male' | 'female' | null; calculatedSuggestion: PublicationSuggestion }>;
  exerciseSuggestions: Array<{ exerciseIndex: number; exerciseName: string;
    originalPrescription: Workout['exercises'][number]['prescription']; alternatives: Array<{
      sourceAlternative: 'single' | 'male' | 'female'; suggestion: PublicationSuggestion }> }>;
  comment: string | null; possibleDuplicate: null; notices: string[];
};

export type PublicationSuggestion = { status: 'available' | 'unavailable'; loadKilograms: string | null;
  basis: { sourceExerciseId: number; value: string; sourceDate: string; unit: 'kg' | 'lbs' | null } | null;
  reason: string | null; coverage: 'limited-upstream-exercise-detail' };
type HistoricalRM = ReturnType<typeof parseHistorical1RM> | { status: 'unavailable'; reason: 'personal-read-failed'; basis: null };
const unavailableSuggestion = (reason: string, basis: PublicationSuggestion['basis'] = null): PublicationSuggestion => ({
  status: 'unavailable', loadKilograms: null, basis, reason, coverage: 'limited-upstream-exercise-detail',
});

export async function withHistoricalSuggestions(preview: PublicationPreview, read: (exerciseId: number) => Promise<HistoricalRM>): Promise<PublicationPreview> {
  const cache = new Map<number, HistoricalRM>();
  const exerciseSuggestions: PublicationPreview['exerciseSuggestions'] = [];
  for (const [exerciseIndex, exercise] of preview.prescription.exercises.entries()) {
    if (exercise.prescription.loadUnit !== '%RM') continue;
    const initial = calculatePersonalLoad(exercise, undefined).alternatives;
    const alternatives: PublicationPreview['exerciseSuggestions'][number]['alternatives'] = [];
    for (const item of initial) {
      let suggestion: PublicationSuggestion;
      if (item.reason !== 'personal-read-limit') suggestion = unavailableSuggestion(item.reason ?? 'unsupported-percentage');
      else {
        const id = exercise.sourceExerciseId!;
        if (!cache.has(id)) cache.set(id, cache.size >= 24
          ? { status: 'unavailable', reason: 'personal-read-limit', basis: null } : await read(id));
        const historical = cache.get(id)!;
        if (historical.status !== 'available' || !historical.basis || historical.basis.unit !== 'kg')
          suggestion = unavailableSuggestion(historical.reason ?? 'eligible-1rm-unavailable', historical.basis);
        else {
          const rm = { status: 'available' as const, latest1RM: {
            value: historical.basis.value, unit: 'kg' as const, sourceDate: historical.basis.sourceDate,
          } };
          const alternative = calculatePersonalLoad(exercise, rm as Parameters<typeof calculatePersonalLoad>[1])
            .alternatives.find(row => row.sourceLabel === item.sourceLabel);
          suggestion = alternative?.calculatedLoad
            ? { status: 'available', loadKilograms: alternative.calculatedLoad, basis: historical.basis,
              reason: null, coverage: 'limited-upstream-exercise-detail' }
            : unavailableSuggestion(alternative?.reason ?? 'unsupported-percentage', historical.basis);
        }
      }
      alternatives.push({ sourceAlternative: item.sourceLabel, suggestion });
    }
    exerciseSuggestions.push({ exerciseIndex, exerciseName: exercise.name,
      originalPrescription: exercise.prescription, alternatives });
  }
  const actualLoads = preview.actualLoads.map(load => {
    const exercise = preview.prescription.exercises[load.exerciseIndex]!;
    const split = exercise.prescription.valor2h != null || exercise.prescription.valor2m != null;
    const label = load.sourceAlternative ?? (split ? null : 'single');
    const calculatedSuggestion = exercise.prescription.loadUnit === 'kg'
      ? unavailableSuggestion('already-prescribed-in-kilograms')
      : label ? exerciseSuggestions.find(row => row.exerciseIndex === load.exerciseIndex)
      ?.alternatives.find(row => row.sourceAlternative === label)?.suggestion
      ?? unavailableSuggestion('source-alternative-unavailable') : unavailableSuggestion('source-alternative-not-selected');
    return { ...load, calculatedSuggestion };
  });
  return { ...preview, exerciseSuggestions, actualLoads, notices: exerciseSuggestions.length ? [...preview.notices,
    'Historical kilogram suggestions use only eligible own 1RM points dated on or before the activity date. Source history completeness and RM gym of origin are unverified; the actual load remains independently confirmed.']
    : preview.notices };
}

export function blockResultField(block: Workout['blocks'][number], kind: PublicationQuery['blockResults'][number]['kind']): 'time' | 'res' | 'reps' | null {
  const type = Number(block.prescription.type);
  const textResultType = Number(block.prescription.timecap);
  if (kind === 'time-seconds' && ([1, 10].includes(type) || (type === 11 && textResultType === 1))) return 'time';
  if (kind === 'rounds' && ([2, 10].includes(type) || (type === 11 && textResultType === 2))) return 'res';
  if (kind === 'repetitions' && ([2, 10].includes(type) || (type === 11 && textResultType === 2))) return 'reps';
  if (kind === 'repetitions' && (type === 1 || (type === 11 && [1, 5].includes(textResultType)))) return 'res';
  if (kind === 'kilograms' && type === 11 && textResultType === 3) return 'res';
  if (kind === 'pounds' && type === 11 && textResultType === 4) return 'res';
  return null;
}

export function publicationPreview(workout: Workout, copy: CopySource, query: PublicationQuery,
  gym: PublicationPreview['gym'], audience: PublicationAudience): PublicationPreview | null {
  const date = query.activityDate ?? workout.date;
  if (date > gymLocalToday(gym.timeZone)) return null;
  const selected = workout.variants.length
    ? workout.variants.find(variant => variant.label === query.variantLabel) : null;
  if (workout.variants.length && !selected && !(workout.variants.length === 1 && query.variantLabel === undefined)) return null;
  if (!workout.variants.length && query.variantLabel !== undefined) return null;
  const variant = selected ?? (workout.variants.length === 1 ? workout.variants[0]! : null);
  const blocks = variant?.blocks ?? workout.blocks;
  const exercises = variant?.exercises ?? workout.exercises;
  if (blocks.length !== copy.TIPOWODs.length) return null;
  if (new Set(query.actualLoads.map(load => load.exerciseIndex)).size !== query.actualLoads.length) return null;
  const fields = new Set<string>();
  for (const result of query.blockResults) {
    const block = blocks[result.blockIndex];
    const field = block && blockResultField(block, result.kind);
    if (!field || (field === 'time' && result.value === 0)
      || !Number.isSafeInteger(result.value * (['time-seconds', 'rounds', 'repetitions'].includes(result.kind) ? 1 : 1000))) return null;
    const target = `${result.blockIndex}:${field}`;
    if (fields.has(target)) return null;
    fields.add(target);
  }
  const actualLoads = [];
  for (const load of query.actualLoads) {
    const exercise = exercises[load.exerciseIndex];
    if (!exercise || !((exercise.prescription.loadUnit === '%RM' && [4, '4'].includes(exercise.prescription.tipoud as string | number))
      || (exercise.prescription.loadUnit === 'kg' && [0, '0'].includes(exercise.prescription.tipoud as string | number)))) return null;
    const split = exercise.prescription.valor2h != null || exercise.prescription.valor2m != null;
    if (load.sourceAlternative && (split ? load.sourceAlternative === 'single' : load.sourceAlternative !== 'single')) return null;
    if (load.sourceAlternative === 'male' && exercise.prescription.valor2h == null) return null;
    if (load.sourceAlternative === 'female' && exercise.prescription.valor2m == null) return null;
    actualLoads.push({ exerciseIndex: load.exerciseIndex, exerciseName: exercise.name,
      originalPrescription: exercise.prescription, actualKilograms: load.actualKilograms,
      sourceAlternative: load.sourceAlternative ?? null, calculatedSuggestion: unavailableSuggestion('not-requested') });
  }
  return {
    gym, source: { sourceActivityId: query.sourceActivityId, className: workout.className, intendedDate: workout.date, titles: workout.titles },
    activityDate: date, variantLabel: variant?.label ?? null, audience, prescription: { blocks, exercises }, blockResults: query.blockResults,
    actualLoads, exerciseSuggestions: [], comment: query.comment ?? null, possibleDuplicate: null,
    notices: ['This preview is read-only. The publication audience comes from current account preferences and will be checked again before a write.',
      'The source feed is bounded; a missing older publication cannot be treated as absent. Same-date activity alone does not establish a duplicate.'],
  };
}

type StoredPublication = { accountId: number; boxId: number; preview: PublicationPreview; query: PublicationQuery;
  formSnapshot: string; expires: number };
export class PublicationPreparationStore {
  #entries = new Map<string, StoredPublication>();
  issue(accountId: number, boxId: number, preview: PublicationPreview, query: PublicationQuery, formSnapshot: string) {
    const now = Date.now();
    for (const [reference, entry] of this.#entries) if (entry.expires <= now) this.#entries.delete(reference);
    if (this.#entries.size >= 32) this.#entries.delete(this.#entries.keys().next().value!);
    const actionReference = randomBytes(32).toString('hex');
    const expires = now + 120_000;
    this.#entries.set(actionReference, { accountId, boxId, preview: structuredClone(preview), query: structuredClone(query), formSnapshot, expires });
    return { actionReference, expiresAt: new Date(expires).toISOString() };
  }
  take(reference: string, accountId: number, gymId: string) {
    const entry = this.#entries.get(reference);
    this.#entries.delete(reference);
    return entry && entry.expires > Date.now() && entry.accountId === accountId && entry.preview.gym.id === gymId ? entry : null;
  }
}
