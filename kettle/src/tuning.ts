// Tuned values in the module's own format: `{ "<clip id>": { timing, amount } }`.
// The lab copies exactly this shape, so a copied entry is pasted into
// `tuning.json` as-is.
import { buildClip, resolveValues, type Clip, type ClipTuning, type ParamRange } from './clip.ts';
import { CLIP_DEFINITIONS, GAZE_FOLLOW, definitionOf } from './library.ts';
import defaults from './tuning.json' with { type: 'json' };

export type Tuning = Record<string, ClipTuning>;

export const DEFAULT_TUNING: Readonly<Tuning> = defaults;

const rangesOf = (id: string): { timing: Record<string, ParamRange>; amount: Record<string, ParamRange> } =>
  id === GAZE_FOLLOW.id ? GAZE_FOLLOW : definitionOf(id);

/** Every tunable id: the clips, the reactions and the gaze-following layer. */
export const TUNABLE_IDS: readonly string[] = [...CLIP_DEFINITIONS.map((definition) => definition.id), GAZE_FOLLOW.id];

/** Fills and clamps one entry against its declared ranges and the defaults. */
export function resolveTuning(id: string, values: Partial<ClipTuning> = {}): ClipTuning {
  const ranges = rangesOf(id);
  const fallback = DEFAULT_TUNING[id] ?? { timing: {}, amount: {} };
  return {
    timing: resolveValues(ranges.timing, values.timing ?? {}, fallback.timing),
    amount: resolveValues(ranges.amount, values.amount ?? {}, fallback.amount),
  };
}

/** Reads pasted tuning JSON. Unknown ids are rejected so a typo is not silently ignored. */
export function parseTuning(input: string | object): Tuning {
  const data = (typeof input === 'string' ? JSON.parse(input) : input) as Record<string, Partial<ClipTuning>>;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Tuning must be a JSON object keyed by clip id');
  const out: Tuning = {};
  for (const [id, values] of Object.entries(data)) {
    if (!TUNABLE_IDS.includes(id)) throw new Error(`Unknown Kettle clip in tuning: ${id}`);
    out[id] = resolveTuning(id, values);
  }
  return out;
}

/** The JSON the lab copies for one or more entries. */
export function serializeTuning(tuning: Tuning): string {
  return JSON.stringify(tuning, null, 2);
}

/** Builds a playable clip from its id and (optionally) tuned values. */
export function createClip(id: string, values?: Partial<ClipTuning>): Clip {
  return buildClip(definitionOf(id), resolveTuning(id, values));
}
