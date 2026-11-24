// A pose is a flat record of channels. Every channel is 0 at the neutral pose,
// so scaling a pose (intensity) or mirroring it never moves the neutral pose.

/** Body channels: whole-body placement, rigid rotation and deformation. */
export const BODY_CHANNELS = [
  'lift', // body heights up
  'slide', // body heights toward the viewer's right
  'lean', // degrees; the top tilts toward the viewer's right
  'nod', // degrees; the top tilts toward the camera
  'turn', // degrees; the face turns toward the viewer's right (wrapped to ±180 on output)
  'stretch', // height factor - 1; width compensates to keep volume
  'bulge', // extra width at mid height (cartoon squash belly)
  'bend', // top displacement toward the viewer's right, quadratic in height
  'bendFront', // top displacement toward the camera, quadratic in height
  'twist', // degrees of extra turn at the top, quadratic in height (spin smear)
  'flop', // handle displacement toward the viewer's right (handle only)
  'flopFront', // handle displacement toward the camera (handle only)
  'echo', // number of trailing images (multiple-image smear), 0..2
] as const;

/** Eye channels. `L` and `R` are the viewer's left and right eye. */
export const EYE_CHANNELS = [
  'gazeX', // -1..1 toward the viewer's right
  'gazeY', // -1..1 up
  'blinkL', 'blinkR', // 0 open, 1 shut, negative opens wider
  'sizeL', 'sizeR', // uniform scale - 1
  'squeezeL', 'squeezeR', // width scale - 1
  'tiltL', 'tiltR', // degrees; the top of the eye turns toward the face centre
  'lidL', 'lidR', // 0..1 upper lid lowered
  'slantL', 'slantR', // degrees; positive lowers the inner side of the lid (angry), negative raises it (worried)
  'smileL', 'smileR', // 0..1 lower edge pushed up into a happy arc
  'dxL', 'dxR', // per-eye gaze offset toward the viewer's right
  'dyL', 'dyR', // per-eye gaze offset up
] as const;

export const CHANNELS = [...BODY_CHANNELS, ...EYE_CHANNELS] as const;
export type BodyChannel = (typeof BODY_CHANNELS)[number];
export type EyeChannel = (typeof EYE_CHANNELS)[number];
export type Channel = (typeof CHANNELS)[number];
export type Pose = Record<Channel, number>;
export type PartialPose = Partial<Pose>;

export function neutralPose(): Pose {
  return Object.fromEntries(CHANNELS.map((channel) => [channel, 0])) as Pose;
}

export function pose(values: PartialPose = {}): Pose {
  return { ...neutralPose(), ...values };
}

/** Channels whose sign flips when a pose is mirrored left to right. */
const MIRROR_NEGATE: readonly Channel[] = ['slide', 'lean', 'turn', 'bend', 'twist', 'flop', 'gazeX', 'dxL', 'dxR'];

export function mirrorPose(source: Pose): Pose {
  const out = { ...source };
  for (const channel of MIRROR_NEGATE) out[channel] = -source[channel];
  for (const channel of EYE_CHANNELS) {
    if (!channel.endsWith('L')) continue;
    const base = channel.slice(0, -1);
    const left = `${base}L` as Channel, right = `${base}R` as Channel;
    const sign = base === 'dx' ? -1 : 1;
    out[left] = sign * source[right];
    out[right] = sign * source[left];
  }
  return out;
}

export function scalePose(source: Pose, factor: number): Pose {
  const out = { ...source };
  for (const channel of CHANNELS) out[channel] = source[channel] * factor;
  out.echo = Math.round(out.echo);
  return out;
}

export function addPoses(a: Pose, b: Pose): Pose {
  const out = { ...a };
  for (const channel of CHANNELS) out[channel] = a[channel] + b[channel];
  return out;
}

/** Blends two poses; turn takes the short way round. */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a };
  for (const channel of CHANNELS) out[channel] = a[channel] + (b[channel] - a[channel]) * t;
  out.turn = a.turn + wrapDegrees(b.turn - a.turn) * t;
  out.echo = 0;
  return out;
}

export function isNeutral(value: Pose, epsilon = 1e-9): boolean {
  return CHANNELS.every((channel) => Math.abs(value[channel]) <= epsilon);
}

/** Largest absolute body value, used to tell still poses from moving ones. */
export function bodyMagnitude(value: Pose): number {
  return Math.max(...BODY_CHANNELS.map((channel) => Math.abs(value[channel])));
}

export function wrapDegrees(value: number): number {
  const wrapped = ((((value + 180) % 360) + 360) % 360) - 180;
  return Object.is(wrapped, -0) ? 0 : wrapped;
}
