// The Kettle's clips. Style: strongly marked cartoon on a 12 fps exposure grid
// (on twos): hard anticipation, squash and stretch, overshoot and snappy holds,
// with the eyes carrying the emotion. Rules (#134): no echo or multiple-image
// frames; no snap into a pose right before the return to neutral, which eases
// out of the last held pose; eye shapes stay readable.
import { Timeline, type ClipDefinition, type ParamRange, type Values } from './clip.ts';

const exposures = (label: string, max = 12, min = 1): ParamRange => ({ min, max, step: 1, label });
const amount = (label: string, min: number, max: number, step = 0.01): ParamRange => ({ min, max, step, label });

export const DOUBLE_BLINK: ClipDefinition = {
  id: 'double-blink',
  name: 'Double blink',
  kind: 'emote',
  reducedMotion: 'eyes',
  ownsGaze: false,
  timing: {
    lead: exposures('Lead-in (eyes widen)', 6),
    shut: exposures('First blink shut', 4),
    gap: exposures('Open between blinks', 6),
    shut2: exposures('Second blink shut', 4),
    pop: exposures('Pop-open hold', 6),
    settle: exposures('Settle', 8),
  },
  amount: {
    pop: amount('Pop-open eye size', 0, 0.6),
    squash: amount('Body squash on each blink', 0, 0.2),
  },
  keys: (t, a) =>
    new Timeline()
      .to(t.lead!, { blink: -0.15, size: a.pop! * 0.25 }, 'out')
      .to(1, { blink: 1, stretch: -a.squash!, bulge: a.squash! * 0.7 }, 'snap')
      .hold(t.shut! - 1)
      .to(1, { blink: -0.2, size: a.pop! * 0.5, stretch: a.squash! * 0.5 }, 'snap')
      .to(t.gap!, { blink: 0, size: a.pop! * 0.2 }, 'out')
      .to(1, { blink: 1, stretch: -a.squash!, bulge: a.squash! * 0.7 }, 'snap')
      .hold(t.shut2! - 1)
      .to(1, { blink: -0.35, size: a.pop!, stretch: a.squash! }, 'snap')
      .hold(t.pop! - 1)
      .end(t.settle!, 'inOut'),
};

export const CURIOSITY: ClipDefinition = {
  id: 'curiosity',
  name: 'Curiosity',
  kind: 'emote',
  reducedMotion: 'eyes',
  ownsGaze: true,
  timing: {
    dip: exposures('Anticipation dip', 6),
    pop: exposures('Pop into the tilt', 4),
    hold: exposures('First hold', 12),
    lean: exposures('Lean in ("ooh"), eased', 8),
    hold2: exposures('Second hold', 12),
    back: exposures('Return, eased out of the lean', 8),
    settle: exposures('Settle', 8),
  },
  amount: {
    tilt: amount('Head tilt (deg)', 0, 35, 0.5),
    bend: amount('Body bend into the tilt', 0, 0.2),
    turn: amount('Turn toward the subject (deg)', 0, 30, 0.5),
    bigEye: amount('Big eye size', 0, 0.8),
    squint: amount('Squinting eye', 0, 0.9),
    leanIn: amount('Lean in toward the camera (deg)', 0, 20, 0.5),
  },
  keys: (t, a) => {
    const tilted = (k: number) => ({
      lean: a.tilt! * k, bend: a.bend! * k, turn: a.turn! * k, stretch: 0.05 * k,
      sizeL: a.bigEye! * k, squeezeL: 0.2 * k, blinkL: -0.3 * k, blinkR: a.squint! * k, slantR: 14 * k, lidR: 0.12 * k,
      gazeX: 0.35 * k, gazeY: 0.2 * k, flop: -0.03 * k,
    });
    return new Timeline()
      .to(t.dip!, { stretch: -0.08, bulge: 0.06, blink: 0.35, lean: -a.tilt! * 0.15 }, 'out')
      .to(t.pop!, { ...tilted(1.08), flop: -0.07 }, 'out')
      .to(2, tilted(1), 'inOut')
      .hold(t.hold! - 2)
      // The lean toward the camera eases out of the hold, never snaps into it.
      .to(t.lean!, { ...tilted(1.2), nod: a.leanIn!, sizeL: a.bigEye! * 1.3, blinkL: -0.4, stretch: 0.1 }, 'inOut')
      .to(Math.max(1, t.hold2!), { ...tilted(1.22), nod: a.leanIn! * 1.1, sizeL: a.bigEye! * 1.35, blinkL: -0.4, stretch: 0.1 }, 'linear')
      // The return eases out of the held lean into a small counter-lean.
      .to(t.back!, { lean: -a.tilt! * 0.3, bend: -a.bend! * 0.4, turn: -a.turn! * 0.15, blink: 0.6, flop: 0.05 }, 'inOut')
      .to(2, { lean: a.tilt! * 0.1, stretch: -0.03, blink: 0 }, 'out')
      .end(t.settle!, 'inOut');
  },
};

export const LOOK_AROUND: ClipDefinition = {
  id: 'look-around',
  name: 'Look around',
  kind: 'emote',
  reducedMotion: 'eyes',
  ownsGaze: true,
  timing: {
    lead: exposures('Anticipation', 6),
    follow: exposures('Body follows the eyes after', 6),
    hold: exposures('Hold on each look', 12),
    settle: exposures('Settle', 8),
  },
  amount: {
    gaze: amount('Eye travel', 0, 1),
    turn: amount('Head turn (deg)', 0, 45, 0.5),
    lean: amount('Lean (deg)', 0, 20, 0.5),
    stretch: amount('Up/down stretch', 0, 0.3),
    lag: amount('Handle lag', 0, 0.15),
  },
  keys: (t, a) => {
    const g = a.gaze!, turn = a.turn!, lean = a.lean!, s = a.stretch!, lag = a.lag!;
    return new Timeline()
      .to(t.lead!, { blink: 0.3, stretch: -s * 0.3, bulge: s * 0.2 }, 'out')
      // Right: the eyes dart first, the body catches up, the handle lags.
      .to(1, { gazeX: g, blink: -0.1 }, 'snap')
      .to(t.follow!, { gazeX: g, turn: turn * 0.7, lean: lean * 0.6, bend: 0.04, flop: -lag, blink: -0.1 }, 'out')
      .to(1, { gazeX: g, turn: turn * 0.75, lean: lean * 0.65, bend: 0.045, flop: lag * 0.3 }, 'snap')
      .hold(t.hold! - 1)
      // Blink through the big turn, as a head turn would.
      .to(1, { gazeX: 0, blink: 1, turn: 0, lean: 0, stretch: -s * 0.3 }, 'snap')
      .to(1, { gazeX: -g, blink: 0, turn: -turn * 0.6, lean: -lean * 0.5, sizeL: 0.12 }, 'snap')
      .to(t.follow!, { gazeX: -g, turn: -turn, lean: -lean, bend: -0.06, flop: lag, sizeL: 0.15 }, 'out')
      .to(1, { gazeX: -g, turn: -turn * 0.95, lean: -lean * 0.9, bend: -0.055, flop: -lag * 0.3, sizeL: 0.15 }, 'snap')
      .hold(t.hold! - 1)
      // Up, stretching tall; then down, squashing with a heavy lid.
      .to(1, { gazeX: -g * 0.2, gazeY: g, turn: -turn * 0.2, nod: -8, stretch: s, size: 0.15, blink: -0.2 }, 'snap')
      .to(2, { gazeX: -g * 0.2, gazeY: g, turn: -turn * 0.15, nod: -9, stretch: s * 1.05, size: 0.15, blink: -0.2 }, 'out')
      .hold(t.hold! - 2)
      .to(1, { gazeX: g * 0.2, gazeY: -g, nod: 10, stretch: -s * 0.8, bulge: s * 0.5, lid: 0.3, blink: 0.1 }, 'snap')
      .to(2, { gazeX: g * 0.2, gazeY: -g, nod: 11, stretch: -s * 0.85, bulge: s * 0.55, lid: 0.32, blink: 0.1 }, 'out')
      .hold(t.hold! - 2)
      // Back to centre: blink, pop.
      .to(1, { blink: 1, stretch: -s * 0.3 }, 'snap')
      .to(1, { blink: -0.2, size: 0.12, stretch: s * 0.3 }, 'snap')
      .end(t.settle!, 'inOut');
  },
};

export const ROCK: ClipDefinition = {
  id: 'rock',
  name: 'Rock',
  kind: 'emote',
  reducedMotion: 'still',
  ownsGaze: false,
  timing: {
    lead: exposures('Anticipation', 6),
    swing: exposures('First swing', 6),
    back: exposures('Swing back', 6),
    decay: exposures('Each smaller rock', 6),
    settle: exposures('Settle', 8),
  },
  amount: {
    swing: amount('Swing (deg)', 0, 40, 0.5),
    bend: amount('Body bend', 0, 0.2),
    lag: amount('Handle lag', 0, 0.2),
    decay: amount('Decay per rock', 0.2, 0.9),
  },
  keys: (t, a) => {
    const swing = a.swing!, lag = a.lag!, d = a.decay!;
    const rock = (deg: number, k: number) => ({
      lean: deg, bend: a.bend! * Math.sign(deg) * k, flop: -Math.sign(deg) * lag * k,
      stretch: 0.04 * k, gazeX: -0.45 * Math.sign(deg) * k,
    });
    return new Timeline()
      .to(t.lead!, { lean: -swing * 0.3, stretch: -0.07, bulge: 0.06, flop: lag * 0.4, gazeX: 0.35, blink: 0.2 }, 'out')
      .to(t.swing!, { ...rock(swing, 1), blinkL: -0.15 }, 'out')
      .to(1, { ...rock(swing * 1.06, 0.6), flop: lag * 0.2 }, 'snap')
      .to(t.back!, { ...rock(-swing * d * 1.1, 1), blinkR: -0.15 }, 'inOut')
      .to(1, { ...rock(-swing * d * 1.15, 0.5), flop: -lag * 0.2 }, 'snap')
      .to(t.decay!, rock(swing * d * d, 0.6), 'inOut')
      .to(t.decay!, { ...rock(-swing * d * d * d, 0.3), blink: 0.8 }, 'inOut')
      .end(t.settle!, 'inOut');
  },
};

export const LITTLE_HOP: ClipDefinition = {
  id: 'little-hop',
  name: 'Little hop',
  kind: 'emote',
  reducedMotion: 'still',
  ownsGaze: false,
  timing: {
    squash: exposures('Anticipation squash', 6),
    rise: exposures('Rise', 6),
    apex: exposures('Hang at the apex', 6),
    fall: exposures('Fall', 6),
    recover: exposures('Landing recovery', 6),
    settle: exposures('Settle', 8),
  },
  amount: {
    height: amount('Hop height (body heights)', 0, 0.9),
    squash: amount('Squash', 0, 0.5),
    stretch: amount('Stretch', 0, 0.5),
    bulge: amount('Belly bulge on squash', 0, 0.4),
    joy: amount('Happy eyes at the apex', 0, 1),
  },
  keys: (t, a) => {
    const h = a.height!;
    return new Timeline()
      .to(t.squash!, { stretch: -a.squash!, bulge: a.bulge!, blink: 0.9, nod: 3 }, 'in')
      // Launch: the stretch past the tuned value carries the speed (no echo images).
      .to(1, { lift: h * 0.2, stretch: a.stretch! * 1.3, bulge: -0.1, blink: -0.25, size: 0.12 }, 'snap')
      .to(t.rise!, { lift: h * 0.9, stretch: a.stretch! * 0.3, size: 0.18, blink: -0.3, lean: -4 }, 'out')
      .to(1, { lift: h, smile: a.joy!, size: 0.1, lean: 4 }, 'out')
      .hold(t.apex!)
      .to(t.fall!, { lift: h * 0.2, stretch: a.stretch! * 0.6, smile: 0, blink: -0.2, size: 0.1, lean: 2 }, 'in')
      .to(1, { stretch: -a.squash! * 1.1, bulge: a.bulge! * 1.15, blink: 0.75 }, 'snap')
      .to(1, { stretch: a.stretch! * 0.3, bulge: -0.02, blink: -0.1 }, 'snap')
      .to(t.recover!, { stretch: -0.06, bulge: 0.03 }, 'out')
      .end(t.settle!, 'inOut');
  },
};

export const TILTED_SPIN: ClipDefinition = {
  id: 'tilted-spin',
  name: 'Tilted spin',
  kind: 'emote',
  reducedMotion: 'still',
  ownsGaze: false,
  timing: {
    windup: exposures('Wind-up', 6),
    spin: exposures('Spin (exposures for 360°)', 10, 3),
    land: exposures('Landing recovery', 6),
    proud: exposures('Happy hold', 12),
    settle: exposures('Settle', 8),
  },
  amount: {
    counter: amount('Counter-turn (deg)', 0, 60, 0.5),
    tilt: amount('Tilt in the air (deg)', 0, 45, 0.5),
    height: amount('Height (body heights)', 0, 0.9),
    twist: amount('Twist smear (deg)', 0, 120, 1),
    squash: amount('Squash', 0, 0.5),
    overshoot: amount('Overshoot past 360° (deg)', 0, 40, 0.5),
  },
  keys: (t, a) => {
    const tl = new Timeline()
      .to(t.windup!, { turn: -a.counter!, lean: -6, stretch: -a.squash! * 0.8, bulge: a.squash! * 0.6, blink: 0.9, slant: 10 }, 'in')
      // Launch and spin: a stronger stretch and the twist smear carry the speed (no echo images).
      .to(1, { lift: a.height! * 0.3, turn: -a.counter! * 0.3, stretch: a.squash! * 1.3, bulge: -0.08, twist: -a.twist! * 0.8, blink: -0.2 }, 'snap');
    const steps = Math.max(3, t.spin!);
    for (let i = 1; i <= steps; i++) {
      const u = i / steps;
      tl.to(1, {
        lift: a.height! * Math.sin(Math.PI * (0.3 + 0.7 * u)) + a.height! * 0.05,
        turn: 360 * u + a.overshoot! * u * u,
        lean: a.tilt! * Math.sin(Math.PI * u),
        twist: -a.twist! * (1 - u * 0.6),
        stretch: 0.2 * (1 - u),
        bulge: -0.06 * (1 - u),
        size: 0.15,
        blink: -0.2,
      }, 'linear');
    }
    return tl
      .to(1, { turn: 360 + a.overshoot! * 0.6, stretch: -a.squash!, bulge: a.squash! * 0.8, twist: a.twist! * 0.2, blink: 0.6 }, 'snap')
      .to(1, { turn: 360 - a.overshoot! * 0.4, stretch: 0.1, twist: -a.twist! * 0.08, size: 0.12, blink: -0.2 }, 'snap')
      .to(t.land!, { turn: 362, stretch: -0.03, smile: 0.85 }, 'out')
      .hold(t.proud!)
      .end(t.settle!, 'inOut', 1);
  },
};

export const POKE: ClipDefinition = {
  id: 'poke',
  name: 'Poke reaction',
  kind: 'reaction',
  reducedMotion: 'eyes',
  ownsGaze: false,
  timing: {
    hit: exposures('Hit squash', 4),
    surprise: exposures('Surprised hold', 8),
    shake: exposures('Each shake', 3),
    settle: exposures('Settle', 8),
  },
  amount: {
    squash: amount('Hit squash', 0, 0.5),
    recoil: amount('Recoil lean (deg)', 0, 35, 0.5),
    surprise: amount('Surprised eye size', 0, 0.8),
    hop: amount('Startle hop (body heights)', 0, 0.4),
  },
  keys: (t, a) =>
    new Timeline()
      // Eyes shut into > < while the body is knocked away from the poke.
      .to(1, { stretch: -a.squash!, bulge: a.squash! * 0.5, lean: -a.recoil!, slide: -0.04, blink: 1, tilt: 28, squeeze: 0.3, flop: 0.08 }, 'snap')
      .to(t.hit!, { stretch: -a.squash! * 0.7, bulge: a.squash! * 0.3, lean: -a.recoil! * 1.1, slide: -0.05, blink: 1, tilt: 28, squeeze: 0.3, flop: 0.1 }, 'linear')
      // "!" pop: stretch up, huge eyes.
      .to(1, { stretch: 0.3, bulge: -0.08, lean: a.recoil! * 0.3, lift: a.hop!, blink: -0.45, size: a.surprise!, flop: -0.08 }, 'snap')
      .to(1, { stretch: 0.22, lean: a.recoil! * 0.35, lift: a.hop! * 1.1, blink: -0.45, size: a.surprise! * 1.05 }, 'out')
      .hold(t.surprise! - 1)
      .to(t.shake!, { lean: -6, turn: -9, size: a.surprise! * 0.6, blink: -0.3, gazeX: -0.3 }, 'snap')
      .to(t.shake!, { lean: 5, turn: 8, size: a.surprise! * 0.5, gazeX: 0.3 }, 'snap')
      .to(t.shake!, { lean: -3, turn: -4, size: a.surprise! * 0.3 }, 'snap')
      .to(1, { lean: 1, turn: 2, blink: 0.85 }, 'snap')
      .end(t.settle!, 'inOut'),
};

export const DRAG_RELEASE: ClipDefinition = {
  id: 'drag-release',
  name: 'Dizzy wobble (drag release)',
  kind: 'reaction',
  reducedMotion: 'still',
  ownsGaze: true,
  timing: {
    cycle: exposures('Exposures per wobble circle', 10, 3),
    cycles: exposures('Wobble circles', 5),
    shake: exposures('Each shake-off', 3),
    settle: exposures('Settle', 8),
    springBack: exposures('Spring back to the front', 10, 2),
  },
  amount: {
    wobble: amount('Wobble (deg)', 0, 30, 0.5),
    eyeSpin: amount('Eye spin radius', 0, 1),
    droop: amount('Droopy lids', 0, 0.6),
    minSpeed: amount('Minimum release speed (deg/s)', 0, 2000, 10),
    fullSpeed: amount('Full-dizzy release speed (deg/s)', 100, 4000, 10),
    springOvershoot: amount('Spring-back overshoot', 0, 0.6),
  },
  keys: (t, a) => {
    const tl = new Timeline();
    const steps = Math.max(3, t.cycle!) * Math.max(1, t.cycles!);
    for (let i = 1; i <= steps; i++) {
      const phase = (2 * Math.PI * i) / Math.max(3, t.cycle!);
      const k = 1 - (i - 1) / steps;
      const r = a.eyeSpin! * (0.4 + 0.6 * k);
      tl.to(1, {
        lean: a.wobble! * k * Math.cos(phase), nod: a.wobble! * 0.6 * k * Math.sin(phase),
        bend: 0.06 * k * Math.cos(phase - 0.6), flop: -0.07 * k * Math.cos(phase - 1.2),
        dxL: r * Math.cos(-phase), dyL: r * Math.sin(-phase), dxR: r * Math.cos(phase + Math.PI), dyR: r * Math.sin(phase + Math.PI),
        lid: a.droop!, slant: -14, sizeL: 0.1 * Math.sin(phase), sizeR: -0.1 * Math.sin(phase),
      }, 'linear');
    }
    return tl
      // Shake it off.
      .to(1, { turn: -14, lean: 4, blink: 1, squeeze: 0.2, tilt: 20 }, 'snap')
      .to(t.shake!, { turn: 12, lean: -4, blink: 1, squeeze: 0.2, tilt: 20 }, 'snap')
      .to(t.shake!, { turn: -8, lean: 2, blink: 1, tilt: 20 }, 'snap')
      .to(1, { turn: 0, stretch: 0.12, size: 0.15, blink: -0.25 }, 'snap')
      .end(t.settle!, 'inOut');
  },
};

/** Gaze following is a continuous layer, not a clip, but it is tuned the same way. */
export const GAZE_FOLLOW = {
  id: 'gaze-follow',
  name: 'Gaze following',
  timing: {
    catchUp: exposures('Exposures to reach the cursor', 8),
    rest: exposures('Exposures to return when the cursor leaves', 12),
  },
  amount: {
    eyes: amount('Eye travel', 0, 1),
    head: amount('Head turn (deg)', 0, 25, 0.5),
    nod: amount('Head nod (deg)', 0, 15, 0.5),
    radius: amount('Cursor distance for full gaze (px)', 100, 1200, 10),
    reduced: amount('Eye travel under reduced motion', 0, 1),
  },
} as const satisfies Pick<ClipDefinition, 'id' | 'name' | 'timing' | 'amount'>;

export const EMOTES = [DOUBLE_BLINK, CURIOSITY, LOOK_AROUND, ROCK, LITTLE_HOP, TILTED_SPIN] as const;
export const REACTIONS = [POKE, DRAG_RELEASE] as const;
export const CLIP_DEFINITIONS: readonly ClipDefinition[] = [...EMOTES, ...REACTIONS];

export function definitionOf(id: string): ClipDefinition {
  const found = CLIP_DEFINITIONS.find((definition) => definition.id === id);
  if (!found) throw new Error(`Unknown Kettle clip: ${id}`);
  return found;
}

export type { Values };
