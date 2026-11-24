// Clip data through the module's public API (the grid, the neutral endpoints,
// the copy-as-JSON round trip, the motion rules of #134), plus the two stepping
// state machines, which a browser cannot time reliably. Reduced motion is
// checked in browser.test.ts.
import { describe, expect, it } from 'vitest';
import { eyeShape, recessRings, type EyeShape } from '../src/eyes.ts';
import { FollowLayer } from '../src/follow.ts';
import {
  BODY_CHANNELS,
  CHANNELS,
  CLIP_DEFINITIONS,
  DEFAULT_TUNING,
  GAZE_FOLLOW,
  createClip,
  isNeutral,
  neutralPose,
  parseTuning,
  resolveTuning,
  serializeTuning,
  type ClipTuning,
  type ParamRange,
  type Pose,
} from '../src/index.ts';
import { ClipPlayer } from '../src/player.ts';
import { springBack } from '../src/spring.ts';

/** Deterministic pseudo-random tuned values inside each declared range. */
function randomTuning(id: string, seed: number): ClipTuning {
  let state = seed;
  const next = () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
  const definition = CLIP_DEFINITIONS.find((d) => d.id === id)!;
  const pick = (ranges: Record<string, ParamRange>) =>
    Object.fromEntries(Object.entries(ranges).map(([name, r]) => [name, Math.round((r.min + next() * (r.max - r.min)) / r.step) * r.step]));
  return { timing: pick(definition.timing), amount: pick(definition.amount) };
}

describe('clips', () => {
  it('covers the six kept emotes and the poke and drag-release reactions', () => {
    expect(CLIP_DEFINITIONS.map((d) => d.id)).toEqual([
      'double-blink', 'curiosity', 'look-around', 'rock', 'little-hop', 'tilted-spin', 'poke', 'drag-release',
    ]);
    // body-flex was removed (#134): its tuning is rejected like any unknown clip.
    expect(() => parseTuning('{"body-flex": {}}')).toThrow(/Unknown Kettle clip/);
  });

  it('play on the 12 fps grid and start and end on the neutral pose, at default and tuned values', () => {
    for (const definition of CLIP_DEFINITIONS) {
      for (const tuning of [undefined, randomTuning(definition.id, 7), randomTuning(definition.id, 99)]) {
        const clip = createClip(definition.id, tuning);
        expect(clip.fps, definition.id).toBe(12);
        expect(clip.frames.length, definition.id).toBeGreaterThan(4);
        expect(isNeutral(clip.frames[0]!), `${definition.id} first exposure`).toBe(true);
        expect(isNeutral(clip.frames.at(-1)!), `${definition.id} last exposure`).toBe(true);
        // Every clip actually moves.
        expect(clip.frames.some((frame) => !isNeutral(frame, 1e-3)), definition.id).toBe(true);
        // One body per exposure: no echo (multiple-image) channel in any pose.
        for (const frame of clip.frames) expect(Object.keys(frame), definition.id).toEqual([...CHANNELS]);
      }
    }
  });

  it('rebuild exactly from copied JSON pasted back into the module format', () => {
    for (const definition of CLIP_DEFINITIONS) {
      const tuned = resolveTuning(definition.id, randomTuning(definition.id, 42));
      const copied = serializeTuning({ [definition.id]: tuned });
      const pasted = parseTuning(copied)[definition.id];
      expect(createClip(definition.id, pasted).frames).toEqual(createClip(definition.id, tuned).frames);
    }
    // The module's own tuning.json is in that same format, unchanged by parsing.
    expect(parseTuning(JSON.parse(JSON.stringify(DEFAULT_TUNING)))).toEqual(DEFAULT_TUNING);
    expect(() => parseTuning('{"little-hops": {}}')).toThrow(/Unknown Kettle clip/);
  });
});

/** The tuned values the maintainer approved in the Decisions comment on #134, verbatim. */
const DECIDED = `{
  "double-blink": { "timing": { "lead": 1, "shut": 2, "gap": 2, "shut2": 2, "pop": 1, "settle": 1 }, "amount": { "pop": 0.1, "squash": 0.01 } },
  "rock": { "timing": { "lead": 2, "swing": 2, "back": 3, "decay": 2, "settle": 2 }, "amount": { "swing": 20, "bend": 0.07, "lag": 0.04, "decay": 0.6 } },
  "look-around": { "timing": { "lead": 2, "follow": 2, "hold": 4, "settle": 3 }, "amount": { "gaze": 0.9, "turn": 24, "lean": 8, "stretch": 0.12, "lag": 0.02 } },
  "tilted-spin": { "timing": { "windup": 3, "spin": 5, "land": 2, "proud": 3, "settle": 3 }, "amount": { "counter": 35, "tilt": 26, "height": 0.55, "twist": 35, "squash": 0.22, "overshoot": 16 } }
}`;

/** Each exposure's largest body change, as a share of that channel's travel over the whole clip. */
function bodySteps(frames: Pose[]): number[] {
  const travel = (channel: (typeof BODY_CHANNELS)[number]) =>
    Math.max(...frames.map((f) => f[channel])) - Math.min(...frames.map((f) => f[channel]));
  const moving = BODY_CHANNELS.filter((channel) => travel(channel) > 1e-9);
  return frames.map((frame, i) =>
    i === 0 ? 0 : Math.max(...moving.map((channel) => Math.abs(frame[channel] - frames[i - 1]![channel]) / travel(channel))),
  );
}

/** Twice the signed area of each triangle of an eye recess (centre fan and ring strips). */
function recessAreas(shape: EyeShape, side: -1 | 1): number[] {
  const { center, rings } = recessRings(shape, side);
  const cross = (a: [number, number], b: [number, number], c: [number, number]) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const areas: number[] = [];
  const n = rings[0]!.pts.length;
  for (let j = 0; j < n; j++) areas.push(cross(center, rings[0]!.pts[j]!, rings[0]!.pts[(j + 1) % n]!));
  for (let r = 1; r < rings.length; r++) {
    const inner = rings[r - 1]!.pts, outer = rings[r]!.pts;
    for (let j = 0; j < n; j++) {
      const k = (j + 1) % n;
      areas.push(cross(inner[j]!, outer[j]!, outer[k]!), cross(inner[j]!, outer[k]!, inner[k]!));
    }
  }
  return areas;
}

/** Triangles that are inverted, collapsed (zero area) or not a number, against the rest orientation. */
function badTriangles(shape: EyeShape, side: -1 | 1): number {
  const sign = Math.sign(recessAreas(eyeShape(neutralPose(), 0), -1)[0]!);
  // Smaller than any real triangle: the thinnest blink still makes areas above 1e-12.
  return recessAreas(shape, side).filter((area) => !(area * sign > 1e-15)).length;
}

/** Every eye of every exposure of a clip, as `[label, shape, side]`. */
function clipEyes(id: string, tuning?: Partial<ClipTuning>): Array<[string, EyeShape, -1 | 1]> {
  return createClip(id, tuning).frames.flatMap((pose, frame) =>
    ([0, 1] as const).map((eye): [string, EyeShape, -1 | 1] => [`exposure ${frame} eye ${eye}`, eyeShape(pose, eye), eye === 0 ? -1 : 1]),
  );
}

describe('motion rules (#134)', () => {
  it('ship the tuned values the maintainer approved', () => {
    const decided = JSON.parse(DECIDED) as Record<string, ClipTuning>;
    for (const [id, values] of Object.entries(decided)) {
      expect(DEFAULT_TUNING[id], id).toEqual(values);
      // Inside the declared ranges: parsing does not clamp them.
      expect(parseTuning({ [id]: values })[id], id).toEqual(values);
    }
  });

  it('ease curiosity out of its held pose: no return step larger than its lead-in', () => {
    const frames = createClip('curiosity').frames;
    const steps = bodySteps(frames);
    const same = (a: Pose, b: Pose) => BODY_CHANNELS.every((channel) => a[channel] === b[channel]);
    // The first held pose ends the lead-in; everything after it is the return.
    const holdStart = frames.findIndex((frame, i) => i > 0 && !isNeutral(frame) && same(frame, frames[i + 1]!));
    let holdEnd = holdStart;
    while (same(frames[holdEnd]!, frames[holdEnd + 1]!)) holdEnd++;
    const leadIn = Math.max(...steps.slice(1, holdStart + 1));
    const back = Math.max(...steps.slice(holdEnd + 1));
    expect(holdStart).toBeGreaterThan(0);
    expect(back).toBeLessThan(leadIn);
  });

  it('keep every eye recess unfolded in every exposure of every clip, at default and extreme tuning', () => {
    for (const definition of CLIP_DEFINITIONS) {
      const tunings: Array<[string, Partial<ClipTuning> | undefined]> = [['default', undefined]];
      for (const [name, range] of Object.entries(definition.amount)) {
        tunings.push([`${name} = ${range.min}`, { amount: { [name]: range.min } }], [`${name} = ${range.max}`, { amount: { [name]: range.max } }]);
      }
      for (const [label, tuning] of tunings) {
        for (const [where, shape, side] of clipEyes(definition.id, tuning)) {
          expect(badTriangles(shape, side), `${definition.id} (${label}) ${where}`).toBe(0);
        }
      }
    }
  });

  it('keep every eye recess unfolded at the extremes of every eye-shape parameter', () => {
    // Each parameter at its clamp or largest reachable value, in every combination.
    const extremes = {
      open: [0.028, 1, 1.5], size: [-0.6, 0, 1.1], squeeze: [-0.6, 0, 0.6], tilt: [-30, 0, 30],
      lid: [0, 0.5, 1], slant: [-45, 0, 45], smile: [0, 0.6, 1.2],
    };
    let shapes: EyeShape[] = [{ open: 1, size: 0, squeeze: 0, tilt: 0, lid: 0, slant: 0, smile: 0, gx: 0, gy: 0 }];
    for (const [name, values] of Object.entries(extremes)) shapes = shapes.flatMap((shape) => values.map((value) => ({ ...shape, [name]: value })));
    expect(shapes).toHaveLength(3 ** 7);
    const bad = shapes.flatMap((shape) => ([-1, 1] as const).filter((side) => badTriangles(shape, side) > 0).map((side) => ({ ...shape, side })));
    expect(bad.slice(0, 3)).toEqual([]);
  });
});

describe('stepped playback', () => {
  it('changes the pose only on 12 fps exposures while the display runs at 60 Hz', () => {
    const clip = createClip('little-hop');
    const player = new ClipPlayer();
    let ended = false;
    player.play(clip, 0, {}, () => (ended = true));
    const changes: number[] = [];
    for (let t = 0; t <= 2000 && !ended; t += 1000 / 60) if (player.tick(t)) changes.push(t);
    expect(ended).toBe(true);
    expect(changes).toHaveLength(clip.frames.length - 1);
    // Exposures are 1/12 s apart: no change happens between grid points.
    for (const [index, t] of changes.entries()) expect(Math.floor((t * 12) / 1000)).toBe(index + 1);
  });

  it('shows every exposure in order when frames arrive slower than the exposure grid', () => {
    // A slow device draws every 250 ms (3 exposures); key poses such as the shut eye must still appear.
    const clip = createClip('double-blink');
    const player = new ClipPlayer();
    let ended = false;
    player.play(clip, 0, {}, () => (ended = true));
    const shown: number[] = [];
    for (let t = 0; !ended && t < 60_000; t += 250) if (player.tick(t)) shown.push(player.frame);
    expect(ended).toBe(true);
    expect(shown).toEqual(Array.from({ length: clip.frames.length - 1 }, (_, i) => i + 1));
    expect(clip.frames.some((pose, frame) => pose.blinkL > 0.9 && shown.includes(frame))).toBe(true);
  });

  it('steps gaze following on the exposure grid and comes back exactly to rest', () => {
    const follow = new FollowLayer(resolveTuning(GAZE_FOLLOW.id));
    follow.setTarget({ x: 1, y: 0.5 });
    const moves: number[] = [];
    for (let t = 0; t < 1000; t += 1000 / 60) if (follow.update(t, 'stepped')) moves.push(Math.floor((t * 12) / 1000));
    expect(new Set(moves).size).toBe(moves.length); // at most one move per exposure
    expect(follow.x).toBe(1);
    follow.setTarget(null);
    for (let t = 1000; t < 3000; t += 1000 / 60) follow.update(t, 'stepped');
    expect([follow.x, follow.y]).toEqual([0, 0]);
  });
});

describe('drag spring', () => {
  it('returns monotonically without overshoot at 0, and overshoots once with the default', () => {
    const plain = springBack(90, 10, 0);
    expect(plain.at(-1)).toBe(0);
    for (let i = 1; i < plain.length; i++) expect(plain[i]!).toBeLessThanOrEqual(plain[i - 1]!);
    expect(plain.every((turn) => turn >= 0)).toBe(true);
    const lively = springBack(90, 10, resolveTuning('drag-release').amount.springOvershoot!);
    expect(Math.min(...lively)).toBeLessThan(0);
    expect(lively.at(-1)).toBe(0);
  });
});
