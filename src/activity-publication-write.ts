import { z } from 'zod';
import { AimHarderError } from './errors.js';
import type { ActivityEntry } from './activity.js';
import { validatedExerciseId } from './workouts.js';
import { blockResultField, sameCopyLoad, sameCopyLoadAlternatives, sameCopyNotes, type CopySource, type PublicationPreview } from './activity-publication.js';

const scalar = z.union([z.string().max(100_000), z.number().finite(), z.boolean(), z.null()]);
const sourceExercise = z.object({
  ejerId: z.union([z.number().int().positive().safe(), z.string().regex(/^[1-9]\d*$/).refine(value => Number.isSafeInteger(Number(value)))]).nullish(), ejerName: z.string().max(100_000),
  tipoWOD: z.union([z.number().int().nonnegative().safe(), z.string().regex(/^(?:0|[1-9]\d*)$/).refine(value => Number.isSafeInteger(Number(value)))]).nullish(), formaReg: scalar,
  complex: z.union([z.literal(0), z.literal('0')]).nullish(),
  tipoud: scalar.nullish(), tipoud2: scalar.nullish(),
  valor1: z.array(scalar).max(100).nullish(), valor2: scalar.nullish(), valor2h: scalar.nullish(), valor2m: scalar.nullish(),
  round: scalar.nullish(), roundrepeat: scalar.nullish(), wodId: scalar.nullish(),
  wodName: z.string().max(100_000).nullish(), wodDesc: z.string().max(100_000).nullish(), tWODid: scalar.nullish(),
  scaledver: z.array(z.unknown()).max(20).nullish(),
});
const sourceBlock = z.object({
  type: scalar, deleted: z.boolean(), notes: z.string().max(100_000).nullish(),
  timecap: scalar.nullish(), timecaptype: scalar.nullish(), time: scalar.nullish(),
  res: scalar.nullish(), reps: scalar.nullish(), rondas: scalar.nullish(), rx: scalar.nullish(),
  sstipo: scalar.nullish(), pwid: scalar.nullish(), copybox: scalar.nullish(), customize: scalar.nullish(),
  scaledops: z.array(z.string().max(100)).max(20).nullish(), scaledver: z.array(z.unknown()).max(20).nullish(),
  selectedscaling: z.number().int().nonnegative().optional(),
  link: z.array(z.unknown()).max(0).nullish(), video: z.array(z.unknown()).max(0).nullish(),
});
type ExercisePayload = Omit<z.infer<typeof sourceExercise>, 'scaledver'> & { scaledver?: Array<ExercisePayload | null> | null };
type BlockPayload = Omit<z.infer<typeof sourceBlock>, 'scaledver' | 'selectedscaling'> & { scaledver?: Array<BlockPayload | null> | null; selectedscaling?: number | undefined };

function exercisePayload(value: unknown, depth = 0): ExercisePayload {
  const parsed = sourceExercise.safeParse(value);
  if (!parsed.success || depth > 3 || (depth <= 1 && parsed.data.tipoWOD === undefined))
    throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  const { scaledver, ...fields } = parsed.data;
  return { ...fields, ...(scaledver === undefined ? {} : {
    scaledver: scaledver === null ? null : scaledver.map(row => row == null ? null : exercisePayload(row, depth + 1)),
  }) };
}
function blockPayload(value: unknown, depth = 0): BlockPayload {
  const parsed = sourceBlock.safeParse(value);
  if (!parsed.success || depth > 3) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  const { scaledver, ...fields } = parsed.data;
  return { ...fields, ...(scaledver === undefined ? {} : {
    scaledver: scaledver === null ? null : scaledver.map(row => row == null ? null : blockPayload(row, depth + 1)),
  }) };
}

function effectiveBlock(block: BlockPayload, label: string | null): BlockPayload {
  if (!label || !block.scaledops?.includes(label)) return block;
  const index = block.scaledops.indexOf(label);
  block.selectedscaling = index;
  return block.scaledver?.[index] ?? block;
}

function effectiveExerciseRows(exercises: ExercisePayload[], blocks: BlockPayload[], label: string | null): ExercisePayload[] {
  if (!label) return exercises.filter(row => row.tipoWOD == null || !blocks[Number(row.tipoWOD)]?.deleted);
  const rows: ExercisePayload[] = [];
  for (const row of exercises) {
    if (row.tipoWOD == null) continue;
    const block = blocks[Number(row.tipoWOD)];
    if (!block) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    const index = block.scaledops?.indexOf(label) ?? -1;
    if (effectiveBlock(block, label).deleted) continue;
    const target = index < 0 ? row : row.scaledver?.[index];
    if (!target || target.tipoWOD == null || Number(target.tipoWOD) !== Number(row.tipoWOD)) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    rows.push(target);
  }
  return rows;
}

export function buildActivityForm(copy: CopySource, preview: PublicationPreview): FormData {
  const blocks = copy.TIPOWODs.map(block => blockPayload(block));
  const exercises = copy.rates.map(row => exercisePayload(row));
  const effectiveExercises = effectiveExerciseRows(exercises, blocks, preview.variantLabel);
  for (const load of preview.actualLoads) {
    const target = effectiveExercises[load.exerciseIndex];
    const prescribed = preview.prescription.exercises[load.exerciseIndex];
    if (!target || !prescribed || target.ejerName !== prescribed.name || validatedExerciseId(target.ejerId) !== prescribed.sourceExerciseId
      || ![4, '4'].includes(target.formaReg as string | number)
      || ![0, '0', 4, '4'].includes(target.tipoud as string | number))
      throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    // saveCRW uses valor2 as the personal actual-load input and tipoud=0 for kg.
    // Split source alternatives remain in the Copy payload, as in the observed editor.
    target.valor2 = load.actualKilograms;
    target.tipoud = 0;
  }
  for (const result of preview.blockResults) {
    const base = blocks[result.blockIndex];
    if (!base) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    const target = effectiveBlock(base, preview.variantLabel);
    const field = blockResultField(preview.prescription.blocks[result.blockIndex]!, result.kind);
    if (!field) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    if (field === 'time') {
      const minutes = Math.floor(result.value / 60);
      const seconds = result.value % 60;
      target.time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else target[field] = String(result.value);
  }
  // The official editor submits the selected content in the active top-level
  // fields as well as scaledver. The live backend persisted only active fields.
  for (const block of blocks) effectiveBlock(block, preview.variantLabel);
  const activeBlocks = blocks.map(block => {
    const selected = effectiveBlock(block, preview.variantLabel);
    return selected === block ? block : { ...selected, scaledops: block.scaledops,
      scaledver: block.scaledver, selectedscaling: block.selectedscaling };
  });
  const activeExercises = exercises.map(row => {
    if (!preview.variantLabel || row.tipoWOD == null) return row;
    const block = blocks[Number(row.tipoWOD)];
    if (!block) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    const index = block.scaledops?.indexOf(preview.variantLabel) ?? -1;
    if (index < 0 || effectiveBlock(block, preview.variantLabel).deleted) return row;
    const selected = row.scaledver?.[index];
    if (!selected) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    return { ...selected, scaledver: row.scaledver };
  });
  const form = new FormData();
  form.append('conCom', preview.comment ?? '');
  form.append('conComInside', '');
  form.append('selectedDate', preview.activityDate.replaceAll('-', ''));
  form.append('copyId', String(preview.source.sourceActivityId));
  form.append('imagesCargadas', '[]');
  form.append('ejerRate', JSON.stringify(activeExercises));
  form.append('TIPOWODs', JSON.stringify(activeBlocks));
  form.append('homeVideoID', '-1');
  form.append('boxLocation', String(copy.boxID));
  form.append('valueWithMentions', preview.comment ?? '');
  form.append('mentionsCollection', 'null');
  form.append('wodSchedule', '0');
  return form;
}

const responseSchema = z.object({
  errors: z.array(z.unknown()).max(100), errorWODsID: z.array(z.unknown()).max(100),
  errorWODsType: z.array(z.unknown()).max(100), errorEjerID: z.array(z.unknown()).max(100),
  id: z.union([z.string().regex(/^[1-9]\d*$/).max(16), z.number().int().positive().safe()]).optional(),
});
type RejectionDiagnostics = {
  errorCounts: { general: number; blockReferences: number; blockTypes: number; exerciseReferences: number };
  blockIndices: number[]; exerciseIndices: number[];
};
type PublicationResponse = { status: 'accepted' | 'rejected' | 'uncertain'; id: number | null;
  rejectionDiagnostics: RejectionDiagnostics | null };
function boundedErrorIndices(values: unknown[], count: number): number[] {
  const indices = values.map(value => typeof value === 'string' && /^(?:0|[1-9]\d*)$/.test(value) ? Number(value) : value)
    .filter((value): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value < count);
  return [...new Set(indices)];
}
export function publicationResponse(body: unknown, targets: { blockCount: number; exerciseCount: number }): PublicationResponse {
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) return { status: 'uncertain', id: null, rejectionDiagnostics: null };
  const row = parsed.data;
  if ([row.errors, row.errorWODsID, row.errorWODsType, row.errorEjerID].some(errors => errors.length))
    return { status: 'rejected', id: null, rejectionDiagnostics: {
      errorCounts: { general: row.errors.length, blockReferences: row.errorWODsID.length,
        blockTypes: row.errorWODsType.length, exerciseReferences: row.errorEjerID.length },
      blockIndices: boundedErrorIndices(row.errorWODsID, targets.blockCount),
      exerciseIndices: boundedErrorIndices(row.errorEjerID, targets.exerciseCount),
    } };
  const id = Number(row.id);
  return Number.isSafeInteger(id) && id > 0 ? { status: 'accepted', id, rejectionDiagnostics: null }
    : { status: 'uncertain', id: null, rejectionDiagnostics: null };
}

export function matchesPublication(entry: ActivityEntry, preview: PublicationPreview, body: unknown): 'matched' | 'conflicting' | 'unverified-comment' {
  if (preview.comment !== null) {
    const comment = z.object({ activityDesc: z.string() }).safeParse(body);
    if (!comment.success) return 'unverified-comment';
    if (comment.data.activityDesc !== preview.comment) return 'conflicting';
  }
  return matchesStructuredPublication(entry, preview, body) ? 'matched' : 'conflicting';
}

function matchesStructuredPublication(entry: ActivityEntry, preview: PublicationPreview, body: unknown): boolean {
  if (entry.date !== preview.activityDate || entry.blocks.length !== preview.prescription.blocks.length) return false;
  const raw = z.object({ TIPOWODs: z.array(z.unknown()), ejerRate: z.array(z.unknown()) }).safeParse(body);
  if (!raw.success) return false;
  let blocks: BlockPayload[];
  let exercises: ExercisePayload[];
  try {
    blocks = raw.data.TIPOWODs.map(block => blockPayload(block));
    exercises = effectiveExerciseRows(raw.data.ejerRate.map(row => exercisePayload(row)), blocks, preview.variantLabel);
  } catch { return false; }
  if (blocks.length !== preview.prescription.blocks.length || exercises.length !== preview.prescription.exercises.length) return false;
  if (preview.variantLabel && blocks.some(block => block.scaledops?.includes(preview.variantLabel!)
    && block.selectedscaling !== block.scaledops.indexOf(preview.variantLabel!))) return false;
  const rawField = (row: ExercisePayload, field: string) => row[field as keyof ExercisePayload] ?? null;
  if (exercises.some((observed, index) => {
    const expected = preview.prescription.exercises[index]!;
    if (observed.ejerName !== expected.name || validatedExerciseId(observed.ejerId) !== expected.sourceExerciseId
      || (observed.tipoWOD == null ? null : Number(observed.tipoWOD)) !== expected.blockIndex) return true;
    const changedLoad = preview.actualLoads.some(load => load.exerciseIndex === index);
    return ['formaReg', 'tipoud', 'tipoud2', 'valor1', 'round', 'roundrepeat']
      .filter(field => !changedLoad || field !== 'tipoud')
      .some(field => JSON.stringify(rawField(observed, field)) !== JSON.stringify(expected.prescription[field] ?? null))
      || (changedLoad ? !sameCopyLoadAlternatives(observed, expected.prescription)
        : !sameCopyLoad(observed, expected.prescription));
  })) return false;
  if (blocks.some((base, index) => {
    const observed = effectiveBlock(base, preview.variantLabel);
    const expected = preview.prescription.blocks[index]!;
    return !sameCopyNotes(observed.notes, expected.notes) || ['type', 'timecap', 'timecaptype'].some(field =>
      JSON.stringify(observed[field as keyof BlockPayload] ?? null) !== JSON.stringify(expected.prescription[field] ?? null));
  })) return false;
  return preview.blockResults.every(result => {
    const base = blocks[result.blockIndex];
    const observed = base && effectiveBlock(base, preview.variantLabel);
    if (!observed) return false;
    const field = blockResultField(preview.prescription.blocks[result.blockIndex]!, result.kind);
    if (!field) return false;
    const value = observed[field];
    return value !== null && value !== undefined && value !== '' && Number(value) === result.value;
  }) && preview.actualLoads.every(load => {
    const observed = exercises[load.exerciseIndex];
    return observed?.ejerName === load.exerciseName && Number(observed.tipoud) === 0
      && Number(observed.valor2) === Number(load.actualKilograms);
  });
}
