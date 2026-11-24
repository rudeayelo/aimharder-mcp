// Clip data through the module's public API: the grid, the neutral endpoints,
// the copy-as-JSON round trip, stepped playback and the reduced-motion rules.
import { describe, expect, it } from 'vitest';
import { composePose } from '../src/compose.ts';
import { FollowLayer } from '../src/follow.ts';
import {
  BODY_CHANNELS,
  CLIP_DEFINITIONS,
  DEFAULT_TUNING,
  GAZE_FOLLOW,
  KETTLE_FPS,
  createClip,
  isNeutral,
  neutralPose,
  parseTuning,
  resolveTuning,
  serializeTuning,
  type ClipTuning,
  type ParamRange,
} from '../src/index.ts';
import { ClipPlayer } from '../src/player.ts';

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
  it('covers the seven base clips and the poke and drag-release reactions', () => {
    expect(CLIP_DEFINITIONS.map((d) => d.id)).toEqual([
      'double-blink', 'curiosity', 'look-around', 'body-flex', 'rock', 'little-hop', 'tilted-spin', 'poke', 'drag-release',
    ]);
  });

  it('play on the 12 fps grid and start and end on the neutral pose, at default and tuned values', () => {
    for (const definition of CLIP_DEFINITIONS) {
      for (const tuning of [undefined, randomTuning(definition.id, 7), randomTuning(definition.id, 99)]) {
        const clip = createClip(definition.id, tuning);
        expect(clip.fps, definition.id).toBe(KETTLE_FPS);
        expect(clip.frames.length, definition.id).toBeGreaterThan(4);
        expect(isNeutral(clip.frames[0]!), `${definition.id} first exposure`).toBe(true);
        expect(isNeutral(clip.frames.at(-1)!), `${definition.id} last exposure`).toBe(true);
        // Every clip actually moves.
        expect(clip.frames.some((frame) => !isNeutral(frame, 1e-3)), definition.id).toBe(true);
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
    for (const [index, t] of changes.entries()) expect(Math.floor((t * KETTLE_FPS) / 1000)).toBe(index + 1);
  });

  it('steps gaze following on the exposure grid and comes back exactly to rest', () => {
    const follow = new FollowLayer(resolveTuning(GAZE_FOLLOW.id));
    follow.setTarget({ x: 1, y: 0.5 });
    const moves: number[] = [];
    for (let t = 0; t < 1000; t += 1000 / 60) if (follow.update(t, 'stepped')) moves.push(Math.floor((t * KETTLE_FPS) / 1000));
    expect(new Set(moves).size).toBe(moves.length); // at most one move per exposure
    expect(follow.x).toBe(1);
    follow.setTarget(null);
    for (let t = 1000; t < 3000; t += 1000 / 60) follow.update(t, 'stepped');
    expect([follow.x, follow.y]).toEqual([0, 0]);
  });
});

describe('reduced motion', () => {
  const at = (id: string, frame: number, reduced: boolean) => {
    const clip = createClip(id);
    return composePose({ clip, clipPose: clip.frames[frame]!, clipPlaying: true, follow: null, reduced });
  };

  it('holds the still pose instead of hops, spins and large deformations', () => {
    for (const id of ['little-hop', 'tilted-spin', 'body-flex', 'rock', 'drag-release']) {
      const clip = createClip(id);
      expect(clip.reducedMotion, id).toBe('still');
      for (let frame = 0; frame < clip.frames.length; frame++) expect(isNeutral(at(id, frame, true)), `${id} #${frame}`).toBe(true);
    }
  });

  it('keeps eye-only motion and small gaze following', () => {
    const blink = createClip('double-blink');
    const reduced = blink.frames.map((_, frame) => at('double-blink', frame, true));
    expect(reduced.some((p) => p.blinkL > 0.9)).toBe(true);
    for (const p of reduced) for (const channel of BODY_CHANNELS) expect(p[channel]).toBe(0);
    const follow = new FollowLayer(resolveTuning(GAZE_FOLLOW.id));
    follow.setTarget({ x: 1, y: 1 });
    follow.update(0, 'smooth');
    for (let t = 0; t < 2000; t += 16) follow.update(t, 'smooth');
    const pose = composePose({ clip: null, clipPose: neutralPose(), clipPlaying: false, follow: follow.pose(true), reduced: true });
    expect(pose.gazeX).toBeLessThanOrEqual(0.35);
    expect(pose.turn).toBe(0);
  });
});
