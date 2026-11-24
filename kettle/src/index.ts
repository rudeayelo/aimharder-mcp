// Public API of the Kettle module. The lab and the product use only these exports.
export { createKettle, CAMERA_PRESETS, SURFACES } from './kettle.ts';
export type { CameraPreset, CameraView, Interactions, Kettle, KettleOptions, KettleState, KettleStatus, MotionTiming, Surface, SurfaceDefaults } from './kettle.ts';
export type { Motion } from './follow.ts';
export type { PlayOptions } from './player.ts';
export { KETTLE_FPS } from './clip.ts';
export type { Clip, ClipDefinition, ClipSpec, ClipTuning, Ease, Key, ParamRange } from './clip.ts';
export { CLIP_DEFINITIONS, EMOTES, REACTIONS, GAZE_FOLLOW, definitionOf } from './library.ts';
export { DEFAULT_TUNING, TUNABLE_IDS, createClip, parseTuning, resolveTuning, serializeTuning } from './tuning.ts';
export type { Tuning } from './tuning.ts';
export { CHANNELS, BODY_CHANNELS, EYE_CHANNELS, neutralPose, isNeutral } from './pose.ts';
export type { Channel, Pose } from './pose.ts';
