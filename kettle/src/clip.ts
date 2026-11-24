// Clips are data: keyed poses on a 12 fps exposure grid. A clip definition
// turns tunable timing (in exposures) and amounts into keys; the tuned values
// live in `tuning.json`, in exactly the format the lab copies.
import { CHANNELS, neutralPose, pose, wrapDegrees, type PartialPose, type Pose } from './pose.ts';

/** Character motion is stop-motion at 12 exposures per second (on twos). */
export const KETTLE_FPS = 12;

export type Ease = 'linear' | 'in' | 'out' | 'inOut' | 'snap' | 'hold';

export interface Key {
  /** Exposure index on the 12 fps grid. */
  at: number;
  pose: PartialPose;
  /** How the motion arrives at this key from the previous one. */
  ease?: Ease;
}

export interface ParamRange {
  min: number;
  max: number;
  step: number;
  label: string;
}

export type Values = Record<string, number>;

/** The tunable values of one clip: what the lab copies and `tuning.json` stores. */
export interface ClipTuning {
  timing: Values;
  amount: Values;
}

export interface ClipSpec extends ClipTuning {
  id: string;
}

export interface ClipDefinition {
  id: string;
  name: string;
  kind: 'emote' | 'reaction';
  /** Under reduced motion: play only the eye channels, or hold the still pose. */
  reducedMotion: 'eyes' | 'still';
  /** The clip drives the gaze itself, so cursor following pauses while it plays. */
  ownsGaze: boolean;
  timing: Record<string, ParamRange>;
  amount: Record<string, ParamRange>;
  keys(timing: Values, amount: Values): Key[];
}

export interface Clip {
  id: string;
  name: string;
  fps: number;
  reducedMotion: ClipDefinition['reducedMotion'];
  ownsGaze: boolean;
  /** One pose per exposure; the first and last are the neutral pose. */
  frames: Pose[];
}

const EYE_BASES = new Set(['blink', 'size', 'squeeze', 'tilt', 'lid', 'slant', 'smile', 'dx', 'dy']);

/** Expands shared eye values (`blink: 1`) into both eyes (`blinkL`, `blinkR`). */
export function expand(values: Record<string, number | undefined>): PartialPose {
  const out: Record<string, number> = {};
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined) continue;
    // Explicit per-eye values (`blinkL`) win over shared ones in any order.
    if (EYE_BASES.has(name)) {
      out[`${name}L`] ??= value;
      out[`${name}R`] ??= value;
    } else out[name] = value;
  }
  return out as PartialPose;
}

/** Builds keys one beat at a time; `end` returns to the neutral pose. */
export class Timeline {
  private cursor = 0;
  private readonly list: Key[] = [{ at: 0, pose: {} }];

  /** Moves `exposures` ahead and keys `values`. */
  to(exposures: number, values: Record<string, number | undefined>, ease: Ease = 'inOut'): this {
    this.cursor += Math.max(1, Math.round(exposures));
    this.list.push({ at: this.cursor, pose: expand(values), ease });
    return this;
  }

  /** Keeps the previous pose for `exposures` (a snappy hold). */
  hold(exposures: number): this {
    if (exposures < 1) return this;
    const last = this.list[this.list.length - 1]!;
    this.cursor += Math.round(exposures);
    this.list.push({ at: this.cursor, pose: last.pose, ease: 'hold' });
    return this;
  }

  /** Returns to neutral over `exposures`, then holds it for `tail` exposures. `turns` keeps whole spins. */
  end(exposures: number, ease: Ease = 'inOut', turns = 0, tail = 1): Key[] {
    const rest = turns ? { turn: 360 * turns } : {};
    this.to(exposures, rest, ease);
    this.cursor += tail;
    this.list.push({ at: this.cursor, pose: rest, ease: 'hold' });
    return this.list;
  }
}

function eased(ease: Ease, u: number): number {
  switch (ease) {
    case 'linear': return u;
    case 'in': return u * u * u;
    case 'out': return 1 - (1 - u) ** 3;
    case 'snap': return u > 0 ? 1 : 0;
    case 'hold': return u >= 1 ? 1 : 0;
    default: return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
  }
}

/** The pose of keys at an exposure; channels absent from a key are neutral. */
export function sampleKeys(keys: readonly Key[], frame: number): Pose {
  const last = keys[keys.length - 1]!;
  const at = Math.max(0, Math.min(last.at, frame));
  let next = keys.findIndex((key) => key.at >= at);
  if (next <= 0) return finish(pose(keys[0]!.pose));
  const a = keys[next - 1]!, b = keys[next]!;
  const u = eased(b.ease ?? 'inOut', (at - a.at) / (b.at - a.at));
  const out = neutralPose();
  for (const channel of CHANNELS) {
    const from = a.pose[channel] ?? 0, to = b.pose[channel] ?? 0;
    out[channel] = from + (to - from) * u;
  }
  return finish(out);
}

function finish(value: Pose): Pose {
  value.turn = wrapDegrees(value.turn);
  return value;
}

/** Clamps tuned values into their ranges and fills missing ones with `fallback`. */
export function resolveValues(ranges: Record<string, ParamRange>, values: Values, fallback: Values): Values {
  const out: Values = {};
  for (const [name, range] of Object.entries(ranges)) {
    const value = Number.isFinite(values[name]) ? values[name]! : fallback[name] ?? range.min;
    out[name] = Math.max(range.min, Math.min(range.max, value));
  }
  return out;
}

export function buildClip(definition: ClipDefinition, tuning: ClipTuning): Clip {
  const keys = definition.keys(tuning.timing, tuning.amount);
  const length = keys[keys.length - 1]!.at + 1;
  return {
    id: definition.id,
    name: definition.name,
    fps: KETTLE_FPS,
    reducedMotion: definition.reducedMotion,
    ownsGaze: definition.ownsGaze,
    frames: Array.from({ length }, (_, frame) => sampleKeys(keys, frame)),
  };
}
