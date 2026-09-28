import { z } from 'zod';
import { AimHarderError } from './errors.js';
import type { ActivityEntry } from './activity.js';
import type { CopySource, PublicationPreview } from './activity-publication.js';

const scalar = z.union([z.string().max(100_000), z.number().finite(), z.boolean(), z.null()]);
const sourceExercise = z.object({
  ejerId: z.number().int().positive().safe().nullish(), ejerName: z.string().max(100_000),
  tipoWOD: z.number().int().nonnegative().nullable(), formaReg: scalar,
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
  link: z.array(z.unknown()).max(0).nullish(), video: z.array(z.unknown()).max(0).nullish(),
});
type ExercisePayload = Omit<z.infer<typeof sourceExercise>, 'scaledver'> & { scaledver?: Array<ExercisePayload | null> | null };
type BlockPayload = Omit<z.infer<typeof sourceBlock>, 'scaledver'> & { scaledver?: Array<BlockPayload | null> | null; selectedscaling?: number };

function exercisePayload(value: unknown, depth = 0): ExercisePayload {
  const parsed = sourceExercise.safeParse(value);
  if (!parsed.success || depth > 1) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
  const { scaledver, ...fields } = parsed.data;
  return { ...fields, ...(scaledver === undefined ? {} : {
    scaledver: scaledver === null ? null : scaledver.map(row => row == null ? null : exercisePayload(row, depth + 1)),
  }) };
}
function blockPayload(value: unknown, depth = 0): BlockPayload {
  const parsed = sourceBlock.safeParse(value);
  if (!parsed.success || depth > 1) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
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

export function buildActivityForm(copy: CopySource, preview: PublicationPreview): FormData {
  const blocks = copy.TIPOWODs.map(block => blockPayload(block));
  const exercises = copy.rates.map(row => exercisePayload(row));
  for (const result of preview.blockResults) {
    const base = blocks[result.blockIndex];
    if (!base) throw new AimHarderError('INVALID_ACTIVITY_SOURCE');
    const target = effectiveBlock(base, preview.variantLabel);
    if (result.kind === 'time-seconds') {
      const minutes = Math.floor(result.value / 60);
      const seconds = result.value % 60;
      target.time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else target.res = String(result.value);
  }
  // For a selected label, preserve all other scaledver branches and mark only
  // that one on blocks that offer it. Shared blocks stay at their base values.
  for (const block of blocks) effectiveBlock(block, preview.variantLabel);
  const form = new FormData();
  form.append('conCom', preview.comment ?? '');
  form.append('conComInside', '');
  form.append('selectedDate', preview.activityDate.replaceAll('-', ''));
  form.append('copyId', String(preview.source.sourceActivityId));
  form.append('imagesCargadas', '[]');
  form.append('ejerRate', JSON.stringify(exercises));
  form.append('TIPOWODs', JSON.stringify(blocks));
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
export function publicationResponse(body: unknown) {
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) return { status: 'uncertain' as const, id: null };
  const row = parsed.data;
  if ([row.errors, row.errorWODsID, row.errorWODsType, row.errorEjerID].some(errors => errors.length))
    return { status: 'rejected' as const, id: null };
  const id = Number(row.id);
  return Number.isSafeInteger(id) && id > 0 ? { status: 'accepted' as const, id }
    : { status: 'uncertain' as const, id: null };
}

export function matchesPublication(entry: ActivityEntry, preview: PublicationPreview): boolean {
  if (entry.date !== preview.activityDate || entry.blocks.length !== preview.prescription.blocks.length) return false;
  return preview.blockResults.every(result => {
    const observed = entry.blocks[result.blockIndex]?.result;
    if (!observed) return false;
    return result.kind === 'time-seconds' ? observed.time === result.value : observed.res === result.value;
  });
}
