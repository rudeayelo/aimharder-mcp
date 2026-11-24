// Per-splat body deformation. Every deformation keeps the base plane (y = 0)
// in place, so the Kettle stays planted while it squashes, bends or twists.
// Splat centres move through the deformation and each covariance is carried by
// its Jacobian (J Σ Jᵀ), so splat footprints stretch and shear with the body.
import type { ModelSplats } from './model.ts';
import type { Pose } from './pose.ts';

const DEG = Math.PI / 180;
/** Height where the handle starts to separate from the round body. */
export const HANDLE_PIVOT = 0.62;
const HANDLE_FULL = 0.76;

export type Deformer = (x: number, y: number, z: number, out: Float32Array | number[], offset: number) => void;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** True when the pose has no non-rigid deformation. */
export function isRigid(p: Pose): boolean {
  return !p.stretch && !p.bulge && !p.bend && !p.bendFront && !p.twist && !p.flop && !p.flopFront;
}

export function createDeformer(p: Pose): Deformer {
  const heightScale = Math.max(0.3, 1 + p.stretch);
  const widthScale = 1 / Math.sqrt(heightScale);
  const twist = p.twist * DEG;
  const flopZ = -p.flop / (1 - HANDLE_PIVOT);
  const flopX = p.flopFront / (1 - HANDLE_PIVOT);
  return (x, y, z, out, offset) => {
    const t = Math.max(0, Math.min(1.2, y));
    // Cartoon squash: the belly widens more than the top and the base.
    const belly = 1 + p.bulge * 4 * Math.min(t, 1) * Math.max(0, 1 - t);
    x *= belly;
    z *= belly;
    // The handle swings on its own around the top of the body.
    const lever = smoothstep(HANDLE_PIVOT, HANDLE_FULL, y) * Math.max(0, y - HANDLE_PIVOT);
    x += flopX * lever;
    z += flopZ * lever;
    const t2 = t * t;
    if (twist) {
      const angle = twist * t2, c = Math.cos(angle), s = Math.sin(angle);
      const nx = x * c + z * s;
      z = -x * s + z * c;
      x = nx;
    }
    x += p.bendFront * t2;
    z -= p.bend * t2;
    out[offset] = x * widthScale;
    out[offset + 1] = y * heightScale;
    out[offset + 2] = z * widthScale;
  };
}

/**
 * Deforms every splat of `model` into `centers` and `covariances`.
 * The Jacobian is taken by forward differences, so any deformation added to
 * `createDeformer` carries splat footprints without hand-written derivatives.
 */
export function bakeSplats(model: ModelSplats, p: Pose, centers: Float32Array, covariances: Float32Array): void {
  const deform = createDeformer(p);
  const h = 1e-3;
  const a = [0, 0, 0], b = [0, 0, 0], c = [0, 0, 0];
  const src = model.centers, cov = model.covariances;
  if (isRigid(p)) {
    centers.set(src);
    covariances.set(cov);
    return;
  }
  for (let i = 0; i < model.count; i++) {
    const x = src[i * 3]!, y = src[i * 3 + 1]!, z = src[i * 3 + 2]!;
    deform(x, y, z, centers, i * 3);
    deform(x + h, y, z, a, 0);
    deform(x, y + h, z, b, 0);
    deform(x, y, z + h, c, 0);
    const cx = centers[i * 3]!, cy = centers[i * 3 + 1]!, cz = centers[i * 3 + 2]!;
    // Jacobian columns: d/dx, d/dy, d/dz.
    const j00 = (a[0]! - cx) / h, j10 = (a[1]! - cy) / h, j20 = (a[2]! - cz) / h;
    const j01 = (b[0]! - cx) / h, j11 = (b[1]! - cy) / h, j21 = (b[2]! - cz) / h;
    const j02 = (c[0]! - cx) / h, j12 = (c[1]! - cy) / h, j22 = (c[2]! - cz) / h;
    const o = i * 6;
    const s00 = cov[o]!, s01 = cov[o + 1]!, s02 = cov[o + 2]!, s11 = cov[o + 3]!, s12 = cov[o + 4]!, s22 = cov[o + 5]!;
    // M = J Σ (rows of J times Σ), then (M Jᵀ) upper triangle.
    const m00 = j00 * s00 + j01 * s01 + j02 * s02, m01 = j00 * s01 + j01 * s11 + j02 * s12, m02 = j00 * s02 + j01 * s12 + j02 * s22;
    const m10 = j10 * s00 + j11 * s01 + j12 * s02, m11 = j10 * s01 + j11 * s11 + j12 * s12, m12 = j10 * s02 + j11 * s12 + j12 * s22;
    const m20 = j20 * s00 + j21 * s01 + j22 * s02, m21 = j20 * s01 + j21 * s11 + j22 * s12, m22 = j20 * s02 + j21 * s12 + j22 * s22;
    covariances[o] = m00 * j00 + m01 * j01 + m02 * j02;
    covariances[o + 1] = m00 * j10 + m01 * j11 + m02 * j12;
    covariances[o + 2] = m00 * j20 + m01 * j21 + m02 * j22;
    covariances[o + 3] = m10 * j10 + m11 * j11 + m12 * j12;
    covariances[o + 4] = m10 * j20 + m11 * j21 + m12 * j22;
    covariances[o + 5] = m20 * j20 + m21 * j21 + m22 * j22;
  }
}

export type Matrix3 = [number, number, number, number, number, number, number, number, number];

/** Rigid rotation of a pose (row-major), turn ∘ lean ∘ nod around the base. */
export function poseRotation(p: Pose): Matrix3 {
  const a = -p.lean * DEG, b = p.turn * DEG, c = -p.nod * DEG;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  // Ry(b) * Rx(a) * Rz(c), the same order as three.js Euler 'YXZ'.
  return [
    cb * cc + sb * sa * sc, -cb * sc + sb * sa * cc, sb * ca,
    ca * sc, ca * cc, -sa,
    -sb * cc + cb * sa * sc, sb * sc + cb * sa * cc, cb * ca,
  ];
}

/**
 * Body placement for a pose: the rigid rotation plus the translation that
 * keeps the lowest support sample on the floor (an artistic contact, not physics).
 */
export function placeBody(p: Pose, support: Float32Array): { rotation: Matrix3; position: [number, number, number] } {
  const rotation = poseRotation(p);
  const deform = createDeformer(p);
  const point = [0, 0, 0];
  let lowest = Infinity;
  for (let i = 0; i < support.length; i += 3) {
    deform(support[i]!, support[i + 1]!, support[i + 2]!, point, 0);
    const y = rotation[3] * point[0]! + rotation[4] * point[1]! + rotation[5] * point[2]!;
    if (y < lowest) lowest = y;
  }
  return { rotation, position: [0, p.lift - (Number.isFinite(lowest) ? lowest : 0), -p.slide] };
}

/** Every n-th opaque splat centre, used for floor contact. */
export function supportSamples(model: ModelSplats, target = 2048): Float32Array {
  const step = Math.max(1, Math.floor(model.count / target));
  const out: number[] = [];
  for (let i = 0; i < model.count; i += step) {
    if (model.colors[i * 4 + 3]! < 64) continue;
    out.push(model.centers[i * 3]!, model.centers[i * 3 + 1]!, model.centers[i * 3 + 2]!);
  }
  return new Float32Array(out);
}
