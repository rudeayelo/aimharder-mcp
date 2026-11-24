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
  reduced: boolean;
}

/** Eye travel kept for clip-driven gaze under reduced motion. */
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
  if (layers.follow && !clipOwnsGaze) result = addPoses(result, layers.follow);
  return result;
}
