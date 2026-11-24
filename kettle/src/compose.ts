// Combines the clip pose with the interaction layers and applies the
// reduced-motion rules: gaze following stays (small amplitude), eye-only
// clips keep only their eyes, and hops, spins and large deformations are
// replaced by the still (neutral) pose.
import type { Clip } from './clip.ts';
import { BODY_CHANNELS, addPoses, neutralPose, type Pose } from './pose.ts';

export interface Layers {
  clip: Clip | null;
  clipPose: Pose;
  /** Whether the clip is advancing (an ended clip no longer owns the gaze). */
  clipPlaying: boolean;
  follow: Pose | null;
  /** The page aims the gaze (`setGaze`); it adds to a clip's own gaze instead of pausing. */
  directed: boolean;
  reduced: boolean;
}

/** Largest eye travel under reduced motion, for clips, following and directed gaze alike. */
const REDUCED_GAZE = 0.35;

export function stripBody(source: Pose): Pose {
  const out = { ...source };
  for (const channel of BODY_CHANNELS) out[channel] = 0;
  out.gazeX = Math.max(-REDUCED_GAZE, Math.min(REDUCED_GAZE, out.gazeX));
  out.gazeY = Math.max(-REDUCED_GAZE, Math.min(REDUCED_GAZE, out.gazeY));
  return out;
}

export function composePose(layers: Layers): Pose {
  let result = neutralPose();
  if (layers.clip) {
    if (!layers.reduced) result = layers.clipPose;
    else if (layers.clip.reducedMotion === 'eyes') result = stripBody(layers.clipPose);
  }
  const clipOwnsGaze = layers.clipPlaying && layers.clip?.ownsGaze === true;
  if (layers.follow && (!clipOwnsGaze || layers.directed)) result = addPoses(result, layers.follow);
  // Under reduced motion the gaze stays small whatever the tuning or the page asks for.
  if (layers.reduced) {
    result.gazeX = Math.max(-REDUCED_GAZE, Math.min(REDUCED_GAZE, result.gazeX));
    result.gazeY = Math.max(-REDUCED_GAZE, Math.min(REDUCED_GAZE, result.gazeY));
  }
  return result;
}
