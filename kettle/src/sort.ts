// Back-to-front order for alpha blending: a 16-bit counting sort of splat
// depth along the camera's forward direction. At 32k splats it runs on the
// main thread in well under a millisecond, so no worker or WASM is needed.

export class DepthSorter {
  private readonly depths: Float32Array;
  private readonly keys: Uint32Array;
  private readonly counts = new Uint32Array(65536);

  readonly count: number;

  constructor(count: number) {
    this.count = count;
    this.depths = new Float32Array(count);
    this.keys = new Uint32Array(count);
  }

  /** Fills `order` with splat indices, farthest from the camera first. */
  sort(centers: Float32Array, forward: readonly [number, number, number], order: Float32Array | Uint32Array): void {
    const [fx, fy, fz] = forward;
    const { depths, keys, counts, count } = this;
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < count; i++) {
      const d = centers[i * 3]! * fx + centers[i * 3 + 1]! * fy + centers[i * 3 + 2]! * fz;
      depths[i] = d;
      if (d < min) min = d;
      if (d > max) max = d;
    }
    const scale = max > min ? 65535 / (max - min) : 0;
    counts.fill(0);
    for (let i = 0; i < count; i++) {
      // Larger depth (farther along the view direction) gets the smaller key.
      const key = 65535 - (((depths[i]! - min) * scale) | 0);
      keys[i] = key;
      counts[key]!++;
    }
    for (let i = 1; i < 65536; i++) counts[i]! += counts[i - 1]!;
    for (let i = count - 1; i >= 0; i--) order[--counts[keys[i]!]!] = i;
  }
}
