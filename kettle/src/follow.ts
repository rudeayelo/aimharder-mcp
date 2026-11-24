// Gaze following: the eyes (and a little of the head) chase a target.
// Stepped mode moves only on the 12 fps exposure grid, like the rest of the
// character; smooth mode follows at display rate for comparison.
import { KETTLE_FPS, type ClipTuning } from './clip.ts';
import { pose, type Pose } from './pose.ts';

export type Motion = 'stepped' | 'smooth';

export class FollowLayer {
  x = 0;
  y = 0;
  private targetX = 0;
  private targetY = 0;
  private resting = true;
  private lastExposure = -1;
  private lastTime = -1;

  tuning: ClipTuning;

  constructor(tuning: ClipTuning) {
    this.tuning = tuning;
  }

  /** Normalised target (-1..1, x toward the viewer's right, y up), or null to rest at the centre. */
  setTarget(target: { x: number; y: number } | null): void {
    this.resting = target === null;
    this.targetX = target ? Math.max(-1, Math.min(1, target.x)) : 0;
    this.targetY = target ? Math.max(-1, Math.min(1, target.y)) : 0;
  }

  get settled(): boolean {
    return this.x === this.targetX && this.y === this.targetY;
  }

  /** Advances toward the target. Returns true when the gaze moved. */
  update(now: number, motion: Motion): boolean {
    if (this.settled) {
      this.lastTime = now;
      this.lastExposure = Math.floor((now * KETTLE_FPS) / 1000);
      return false;
    }
    const exposures = Math.max(1, this.resting ? this.tuning.timing.rest! : this.tuning.timing.catchUp!);
    let k: number;
    if (motion === 'stepped') {
      const exposure = Math.floor((now * KETTLE_FPS) / 1000);
      if (exposure === this.lastExposure) return false;
      const steps = this.lastExposure < 0 ? 1 : Math.min(4, exposure - this.lastExposure);
      this.lastExposure = exposure;
      k = 1 - (1 - Math.min(1, 1.6 / exposures)) ** steps;
    } else {
      const dt = this.lastTime < 0 ? 1000 / 60 : Math.min(100, now - this.lastTime);
      this.lastTime = now;
      k = 1 - Math.exp(-dt / ((exposures * 1000) / KETTLE_FPS / 2));
    }
    this.x += (this.targetX - this.x) * k;
    this.y += (this.targetY - this.y) * k;
    if (Math.abs(this.targetX - this.x) < 0.004 && Math.abs(this.targetY - this.y) < 0.004) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
    return true;
  }

  /** The follow layer as a pose to add on top of the clip pose. */
  pose(reduced: boolean): Pose {
    const a = this.tuning.amount;
    if (reduced) return pose({ gazeX: this.x * a.reduced!, gazeY: this.y * a.reduced! });
    return pose({ gazeX: this.x * a.eyes!, gazeY: this.y * a.eyes!, turn: this.x * a.head!, nod: -this.y * a.nod! });
  }
}
