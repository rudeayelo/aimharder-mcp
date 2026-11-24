// Steps a clip on the 12 fps exposure grid from an injected clock. Display
// refreshes between exposures never change the pose.
import { KETTLE_FPS, type Clip } from './clip.ts';
import { mirrorPose, neutralPose, scalePose, type Pose } from './pose.ts';

export interface PlayOptions {
  loop?: boolean;
  /** Playback speed multiplier for review; production plays at 1. */
  speed?: number;
  /** Mirrors the clip left to right (e.g. a poke from the other side). */
  mirror?: boolean;
  /** Scales every channel; neutral stays neutral. */
  intensity?: number;
}

export class ClipPlayer {
  clip: Clip | null = null;
  frame = 0;
  paused = false;
  private options: Required<PlayOptions> = { loop: false, speed: 1, mirror: false, intensity: 1 };
  private origin = 0;
  private onEnd: (() => void) | null = null;

  play(clip: Clip, now: number, options: PlayOptions = {}, onEnd?: () => void): void {
    this.finish(false);
    this.clip = clip;
    this.frame = 0;
    this.paused = false;
    this.options = { loop: false, speed: 1, mirror: false, intensity: 1, ...options };
    this.origin = now;
    this.onEnd = onEnd ?? null;
  }

  get speed(): number {
    return this.options.speed;
  }

  set speed(value: number) {
    this.options.speed = value;
  }

  get loop(): boolean {
    return this.options.loop;
  }

  set loop(value: boolean) {
    this.options.loop = value;
  }

  /** Freezes on the current exposure. */
  pause(): void {
    this.paused = true;
  }

  resume(now: number): void {
    if (!this.clip || !this.paused) return;
    this.paused = false;
    this.origin = now - (this.frame * 1000) / (KETTLE_FPS * this.options.speed);
  }

  /** Shows one exposure and pauses there (frame-by-frame review). */
  seek(frame: number): void {
    if (!this.clip) return;
    this.frame = Math.max(0, Math.min(this.clip.frames.length - 1, Math.round(frame)));
    this.paused = true;
  }

  stop(): void {
    this.finish(false);
  }

  /** Advances to the exposure due at `now`. Returns true when the exposure changed. */
  tick(now: number): boolean {
    const clip = this.clip;
    if (!clip || this.paused) return false;
    const due = Math.floor(((now - this.origin) * KETTLE_FPS * this.options.speed) / 1000);
    const length = clip.frames.length;
    let next = due;
    if (due >= length) {
      if (this.options.loop) next = due % length;
      else {
        this.frame = length - 1;
        this.finish(true);
        return true;
      }
    }
    if (next === this.frame) return false;
    this.frame = next;
    return true;
  }

  /** The pose at the current exposure, after mirror and intensity. */
  pose(): Pose {
    return this.poseAt(this.frame);
  }

  poseAt(frame: number): Pose {
    const clip = this.clip;
    if (!clip) return neutralPose();
    const raw = clip.frames[Math.max(0, Math.min(clip.frames.length - 1, frame))]!;
    const mirrored = this.options.mirror ? mirrorPose(raw) : raw;
    return this.options.intensity === 1 ? mirrored : scalePose(mirrored, this.options.intensity);
  }

  /** True while a clip advances (not paused, not finished). */
  get playing(): boolean {
    return this.clip !== null && !this.paused;
  }

  /** An ended clip stays loaded (for stepping) on its last, neutral exposure. */
  private finish(ended: boolean): void {
    const callback = this.onEnd;
    this.onEnd = null;
    if (ended) this.paused = true;
    else this.clip = null;
    if (callback) callback();
  }
}
