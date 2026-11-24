// Eye rig rebuilt from iteration 1 (`hybrid/eye-rig.js`): each eye is one
// complete recess (orange floor, dark walls, bevel and the surrounding face)
// projected onto a quadratic fit of the face. The recess changes shape as a
// whole: size, width, lid line, happy arc, tilt and gaze move floor, walls and
// lip together while the outer seam stays fixed to the face.
import { BufferAttribute, BufferGeometry, Color, DoubleSide, DynamicDrawUsage, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { createDeformer } from './deform.ts';
import { toModel } from './model.ts';
import type { Pose } from './pose.ts';

/** Quadratic face fit in source coordinates (x front, y down), from iteration 1 `face-surface.json`. */
const SURFACE = {
  coefficients: [0.38423788014943294, 0.5170498538257163, -0.0036520446948364207, -1.0445970793462895, 0.009618536975603244, -0.7799992722103738],
  colorCoefficients: [
    [0.11755186608464822, -0.23947375275012397, -0.0031029024692677994],
    [0.18958910635768797, -0.20556295827577975, 0.0002871420605541326],
    [0.2934991904964731, -0.20585297131519326, 0.00716057612187883],
  ],
} as const;

const N = 96;
const LAYERS = 12;
const COUNT = 1 + LAYERS * N;
const EYE_Y = 0.103;
/** Source z of the viewer's left and right eye. */
const EYE_Z = [-0.108, 0.107] as const;
const SEAM = { hx: 0.078, hy: 0.142, r: 0.065 };
const BASE = { hx: 0.029, hy: 0.065 };
const GAZE = { x: 0.046, y: 0.05 };
const DEG = Math.PI / 180;

function contour(theta: number, hx: number, hy: number, radius: number): [number, number] {
  const r = Math.min(radius, hx, hy), c = Math.cos(theta), s = Math.sin(theta);
  return [(hx - r) * Math.sign(c) + r * c, (hy - r) * Math.sign(s) + r * s];
}

function facePoint(y: number, z: number, depth: number): [number, number, number] {
  const [a, b, c, d, e, f] = SURFACE.coefficients;
  const x = a + b * y + c * z + d * y * y + e * y * z + f * z * z + 0.0015;
  const nx = 1, ny = -(b + 2 * d * y + e * z), nz = -(c + e * y + 2 * f * z);
  const length = Math.hypot(nx, ny, nz);
  return [x - (depth * nx) / length, y - (depth * ny) / length, z - (depth * nz) / length];
}

function faceColor(y: number, z: number): [number, number, number] {
  return SURFACE.colorCoefficients.map(([a, b, c]) => Math.max(0.018, Math.min(0.4, a + b * y + c * z))) as [number, number, number];
}

export interface EyeShape {
  open: number;
  size: number;
  squeeze: number;
  tilt: number;
  lid: number;
  slant: number;
  smile: number;
  gx: number;
  gy: number;
}

export function eyeShape(p: Pose, eye: 0 | 1): EyeShape {
  const s = eye === 0 ? 'L' : 'R';
  const get = (name: string) => p[`${name}${s}` as keyof Pose];
  return {
    open: Math.max(0.028, 1 - get('blink')),
    size: Math.max(-0.6, get('size')),
    squeeze: Math.max(-0.6, get('squeeze')),
    tilt: get('tilt'),
    lid: Math.max(0, Math.min(1, get('lid'))),
    slant: Math.max(-45, Math.min(45, get('slant'))),
    smile: Math.max(0, Math.min(1.2, get('smile'))),
    gx: p.gazeX + get('dx'),
    gy: p.gazeY + get('dy'),
  };
}

/**
 * Happy arc: lift per unit of `smile`, its cap (in recess half-heights; below
 * 2 the lift cannot fold the recess), and how wide it falls off relative to
 * the outer wall. Chosen so the arc's inner edge stays round and the walls
 * keep their width (#134, rule 3: eye shapes stay readable).
 */
const SMILE_GAIN = 1.45;
const MAX_SMILE_PUSH = 1.25;
const SMILE_WIDTH = 1.2;
/** The arc fades out as the eye closes (open below 0.6 down to 0.2) or the lid drops (0.2 up to 0.6). */
const SMILE_ROOM = { open: [0.2, 0.6], lid: [0.2, 0.6] } as const;

function smoothstep(from: number, to: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
}
/** How far each wall ring sits outside the floor's edge. */
const WALL_MARGINS = [0.002, 0.004, 0.008, 0.011] as const;

export interface RecessRing {
  /** Points in eye-local units: a toward the viewer's right, b up, around the recess centre. */
  pts: Array<[number, number]>;
  depth: number;
  tone: number;
}

/** Distance from (cx, cy) along the unit ray `u` to where it leaves a convex outline around that point. */
function rayExit(cx: number, cy: number, u: readonly [number, number], outline: ReadonlyArray<[number, number]>): number {
  let best = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const [ax, ay] = outline[i]!, [bx, by] = outline[(i + 1) % outline.length]!;
    const ex = bx - ax, ey = by - ay, wx = ax - cx, wy = ay - cy;
    const den = u[0] * ey - u[1] * ex;
    if (Math.abs(den) < 1e-18) continue;
    const t = (wx * ey - wy * ex) / den, s = (wx * u[1] - wy * u[0]) / den;
    if (t > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.min(best, t);
  }
  return best;
}

/** Whether the strip between two rings (same point count) has every triangle turning the rest way round. */
function stripHolds(inner: ReadonlyArray<[number, number]>, outer: ReadonlyArray<[number, number]>): boolean {
  const n = inner.length;
  const cross = (a: [number, number], b: [number, number], c: [number, number]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  for (let j = 0; j < n; j++) {
    const q = (j + 1) % n;
    if (!(cross(inner[j]!, outer[j]!, outer[q]!) > MIN_AREA) || !(cross(inner[j]!, outer[q]!, inner[q]!) > MIN_AREA)) return false;
  }
  return true;
}

/** The lid never comes closer than this share of the floor's half-height to its lowest edge. */
const MIN_LID_GAP = 0.1;
/** Smallest share of a wall's margin kept above the lid line, so a lowered lid never flattens the walls. */
const MIN_WALL_LID = 0.15;
/** Twice the smallest triangle area accepted as unfolded (real triangles are far larger). */
const MIN_AREA = 1e-15;

/**
 * The recess floor (rings 0-3) and walls (rings 4-7) for one eye shape;
 * `side` is -1 for the viewer's left eye and 1 for the right.
 *
 * The geometry never folds or collapses: the lid is one straight line, kept
 * above each outline's lowest edge, so every lidded outline is convex, and the
 * inner floor rings are scaled copies of the floor around its centre. Walls
 * are sampled like the floor, each clamped by its own lid line above the
 * previous one. If a strong lid and slant would still fold a wall strip, all
 * walls are placed instead on the rays from the floor's centre through the
 * floor's points, where nesting cannot fold. The happy arc and the tilt then
 * move every point with one smooth map.
 */
export function recessRings(shape: EyeShape, side: number): { center: [number, number]; rings: RecessRing[]; depth: number } {
  const scale = 1 + shape.size;
  const hx = BASE.hx * scale * (1 + shape.squeeze);
  const hy = Math.max(0.0018, BASE.hy * scale * shape.open);
  const r0 = 0.029 * scale;
  const depth = Math.max(0.003, 0.027 * Math.sqrt(Math.min(1.6, shape.open * scale)));
  const bevel = Math.max(0.06, Math.min(1, shape.open));
  const tilt = shape.tilt * DEG * side;
  const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
  // Lid line b = lid + k·a (a toward the viewer's right, b up); slant lowers the inner side.
  const k = side * Math.tan(shape.slant * DEG);
  /** Lowest lid line (at a = 0) that stays above a capsule's lowest edge across its whole width. */
  const lidFloor = (rx: number, ry: number, radius: number) => -(ry - Math.min(radius, rx, ry)) + MIN_LID_GAP * ry + Math.abs(k) * rx;
  let lid = Math.max(hy * (1 - 2 * shape.lid), lidFloor(hx, hy, r0));
  const capsule = (rx: number, ry: number, radius: number) =>
    Array.from({ length: N }, (_, j) => contour((2 * Math.PI * (j + 0.5)) / N, rx, ry, radius));
  // A nearly shut or heavily lidded eye has no room for the arc: it fades out.
  const room = smoothstep(SMILE_ROOM.open[0], SMILE_ROOM.open[1], shape.open) * (1 - smoothstep(SMILE_ROOM.lid[0], SMILE_ROOM.lid[1], shape.lid));
  const push = Math.min(MAX_SMILE_PUSH, shape.smile * SMILE_GAIN) * room;
  const falloff = (hx + WALL_MARGINS[3]!) * SMILE_WIDTH;
  // Happy arc: lift the lower edge into an arc while the upper edge stays. The
  // lift is measured on the whole recess (out to its outer wall, not on each
  // ring) and grows steadily from the top edge down, so the rings stay nested.
  const finish = ([a, b]: [number, number]): [number, number] => {
    const across = Math.max(0, 1 - (a / falloff) ** 2);
    const bb = b + (push * across * (hy - b)) / 2;
    return [a * cosT - bb * sinT, a * sinT + bb * cosT];
  };
  const floor = capsule(hx, hy, r0).map(([a, b]): [number, number] => [a, Math.min(b, lid + k * a)]);
  const floorLid = lid;
  const cx = floor.reduce((sum, [a]) => sum + a, 0) / N;
  const cy = floor.reduce((sum, [, b]) => sum + b, 0) / N;
  // Wall outlines, each clamped by its own line, above the previous ring's and above the wall's own lowest edge.
  const walls = WALL_MARGINS.map((margin) => {
    const rx = hx + margin, ry = hy + margin * bevel, radius = r0 + margin;
    lid = Math.max(floorLid + margin * bevel * Math.max(MIN_WALL_LID, 1 - 2 * shape.lid), lid, lidFloor(rx, ry, radius));
    const line = lid;
    return capsule(rx, ry, radius).map(([a, b]): [number, number] => [a, Math.min(b, line + k * a)]);
  });
  const floorRings = [1, 2, 3, 4].map((step) => floor.map(([a, b]): [number, number] => [cx + (step / 4) * (a - cx), cy + (step / 4) * (b - cy)]));
  let wallRings = walls.map((wall) => wall.map(finish));
  const shown = [...floorRings.map((ring) => ring.map(finish)), ...wallRings];
  if (!shown.slice(3).every((ring, i) => i === 0 || stripHolds(shown[3 + i - 1]!, ring))) {
    let reach = floor.map(([a, b]) => Math.hypot(a - cx, b - cy));
    const rays = floor.map(([a, b], j) => [(a - cx) / reach[j]!, (b - cy) / reach[j]!] as const);
    wallRings = walls.map((wall) => {
      reach = rays.map((ray, j) => Math.max(rayExit(cx, cy, ray, wall), reach[j]! * (1 + 1e-6)));
      return rays.map(([ux, uy], j) => finish([cx + ux * reach[j]!, cy + uy * reach[j]!]));
    });
  }
  const rings: RecessRing[] = [
    ...shown.slice(0, 4).map((pts) => ({ pts, depth, tone: 2 })),
    ...wallRings.map((pts, w) => ({ pts, depth: depth * [0.95, 0.48, 0.1, 0][w]!, tone: [0.26, 0.48, 0.78, 1][w]! })),
  ];
  return { center: finish([cx, cy]), rings, depth };
}

export interface EyeRig {
  group: Group;
  apply(p: Pose): void;
  dispose(): void;
}

export function createEyeRig(): EyeRig {
  const indices: number[] = [];
  for (let j = 0; j < N; j++) indices.push(0, 1 + ((j + 1) % N), 1 + j);
  for (let ring = 1; ring < LAYERS; ring++) {
    for (let j = 0; j < N; j++) {
      const a = 1 + (ring - 1) * N + j, b = 1 + ring * N + j;
      const an = 1 + (ring - 1) * N + ((j + 1) % N), bn = 1 + ring * N + ((j + 1) % N);
      indices.push(a, bn, b, a, an, bn);
    }
  }
  const group = new Group();
  const material = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
  const eyes = EYE_Z.map((center, index) => {
    const geometry = new BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(COUNT * 3), 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(COUNT * 3), 3).setUsage(DynamicDrawUsage));
    const mesh = new Mesh(geometry, material);
    mesh.frustumCulled = false;
    group.add(mesh);
    return { center, side: index === 0 ? -1 : 1, geometry, tones: new Float32Array(COUNT), rgb: new Float32Array(COUNT * 3), local: new Float32Array(COUNT * 3) };
  });
  const key = new Vector3(1, 1.3, 0.7).normalize();
  const normal = new Vector3();
  const color = new Color();
  const point = [0, 0, 0];

  return {
    group,
    apply(p) {
      const deform = createDeformer(p);
      eyes.forEach((eye, index) => {
        const shape = eyeShape(p, index as 0 | 1);
        const { center, rings, depth } = recessRings(shape, eye.side);
        // Keep the moving recess inside the fixed seam.
        let gx = shape.gx * GAZE.x, gy = shape.gy * GAZE.y;
        let fit = 1;
        for (const [a, b] of rings[7]!.pts) fit = Math.max(fit, Math.abs(a + gx) / (SEAM.hx * 0.9), Math.abs(b + gy) / (SEAM.hy * 0.9));
        const shrink = 1 / fit;
        gx *= shrink; gy *= shrink;
        const cz = eye.center + gx, cy = EYE_Y - gy;
        const place = (index: number, a: number, b: number, d: number, tone: number) => {
          const y = cy - b, z = cz + a;
          const [sx, sy, sz] = facePoint(y, z, d);
          const [mx, my, mz] = toModel(sx, sy, sz);
          deform(mx, my, mz, point, 0);
          eye.geometry.attributes.position!.setXYZ(index, point[0]!, point[1]!, point[2]!);
          eye.tones[index] = tone;
          eye.rgb.set(faceColor(y, z), index * 3);
        };
        place(0, center[0] * shrink, center[1] * shrink, depth, 2);
        rings.forEach((ring, r) => ring.pts.forEach(([a, b], j) => place(1 + r * N + j, a * shrink, b * shrink, ring.depth, ring.tone)));
        for (let ring = 8; ring < LAYERS; ring++) {
          const t = (ring - 7) / 4;
          for (let j = 0; j < N; j++) {
            const [ia, ib] = rings[7]!.pts[j]!;
            const [oa, ob] = contour((2 * Math.PI * (j + 0.5)) / N, SEAM.hx, SEAM.hy, SEAM.r);
            // Blend from the moving recess to the stationary seam around the rest position.
            const a = (1 - t) * (ia * shrink) + t * (eye.center + oa - cz);
            const b = (1 - t) * (ib * shrink) + t * (ob - (EYE_Y - cy));
            place(1 + ring * N + j, a, b, 0, 1);
          }
        }
        const position = eye.geometry.attributes.position!;
        position.needsUpdate = true;
        eye.geometry.computeVertexNormals();
        const normals = eye.geometry.attributes.normal!;
        const colors = eye.geometry.attributes.color!;
        for (let j = 0; j < COUNT; j++) {
          normal.fromBufferAttribute(normals, j);
          const light = 0.65 + 0.35 * Math.max(0, normal.dot(key));
          const tone = eye.tones[j]!;
          if (tone > 1.5) color.setRGB(0.99 * light, 0.61 * light, 0.2 * light);
          else {
            const shade = tone === 1 ? 1 : tone * light;
            color.setRGB(eye.rgb[j * 3]! * shade, eye.rgb[j * 3 + 1]! * shade, eye.rgb[j * 3 + 2]! * shade);
          }
          color.convertSRGBToLinear();
          colors.setXYZ(j, color.r, color.g, color.b);
        }
        colors.needsUpdate = true;
      });
    },
    dispose() {
      for (const eye of eyes) eye.geometry.dispose();
      material.dispose();
    },
  };
}
