// Model space shared by the body, the eye rig and the poses:
// y is up, the base sits at y = 0, the body is one unit tall, +x faces the
// camera and the viewer's right is -z.
import type { SourceSplats } from './sog.ts';

/** Canonical bounds of the source IDOL reconstruction (iteration 1, `asset-profiles.js`). */
export const SOURCE_BOUNDS = {
  min: [-0.4453687369823456, -0.4977874159812927, -0.4721851348876953],
  max: [0.471529483795166, 0.5043943524360657, 0.4717373847961426],
} as const;

const height = SOURCE_BOUNDS.max[1] - SOURCE_BOUNDS.min[1];
const centerX = (SOURCE_BOUNDS.min[0] + SOURCE_BOUNDS.max[0]) / 2;
const centerZ = (SOURCE_BOUNDS.min[2] + SOURCE_BOUNDS.max[2]) / 2;

/** Converts a source point (x front, y down) into model space. */
export function toModel(x: number, y: number, z: number): [number, number, number] {
  return [(x - centerX) / height, (SOURCE_BOUNDS.max[1] - y) / height, (centerZ - z) / height];
}

export interface ModelSplats {
  count: number;
  centers: Float32Array;
  covariances: Float32Array;
  colors: Uint8Array;
}

/** Flips Y and Z (a half turn around X) and scales the body to one unit tall. */
export function toModelSplats(source: SourceSplats): ModelSplats {
  const centers = new Float32Array(source.count * 3);
  const covariances = new Float32Array(source.count * 6);
  const inv2 = 1 / (height * height);
  for (let i = 0; i < source.count; i++) {
    const [x, y, z] = toModel(source.centers[i * 3]!, source.centers[i * 3 + 1]!, source.centers[i * 3 + 2]!);
    centers[i * 3] = x;
    centers[i * 3 + 1] = y;
    centers[i * 3 + 2] = z;
    const c = source.covariances, o = i * 6;
    covariances[o] = c[o]! * inv2;
    covariances[o + 1] = -c[o + 1]! * inv2;
    covariances[o + 2] = -c[o + 2]! * inv2;
    covariances[o + 3] = c[o + 3]! * inv2;
    covariances[o + 4] = c[o + 4]! * inv2;
    covariances[o + 5] = c[o + 5]! * inv2;
  }
  return { count: source.count, centers, covariances, colors: source.colors };
}
