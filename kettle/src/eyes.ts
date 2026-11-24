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

interface EyeShape {
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
        const scale = 1 + shape.size;
        const hx = BASE.hx * scale * (1 + shape.squeeze);
        const hy = Math.max(0.0018, BASE.hy * scale * shape.open);
        const depth = Math.max(0.003, 0.027 * Math.sqrt(Math.min(1.6, shape.open * scale)));
        const bevel = Math.max(0.06, Math.min(1, shape.open));
        const tilt = shape.tilt * DEG * eye.side;
        const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
        const slope = Math.tan(shape.slant * DEG);
        // Warp a capsule point (a toward the viewer's right, b up) by the eye's shape.
        const warp = (a: number, b: number, rx: number, ry: number): [number, number] => {
          let nb = b / ry;
          const na = a / rx;
          if (nb < 0) nb += shape.smile * 1.7 * Math.max(0, 1 - na * na);
          const inward = -eye.side * na * (rx / ry);
          nb = Math.min(nb, 1 - 2 * shape.lid - slope * inward);
          nb = Math.max(nb, -1);
          const bb = nb * ry;
          return [a * cosT - bb * sinT, a * sinT + bb * cosT];
        };
        // Inner rings (floor and walls) in eye-local units.
        const rings: Array<{ pts: Array<[number, number]>; depth: number; tone: number }> = [];
        for (let ring = 0; ring < 8; ring++) {
          let rx: number, ry: number, radius: number, d: number, tone: number;
          if (ring < 4) {
            const f = (ring + 1) / 4;
            rx = hx * f; ry = hy * f; radius = 0.029 * scale * f; d = depth; tone = 2;
          } else {
            const k = ring - 4;
            const margin = [0.002, 0.004, 0.008, 0.011][k]!;
            rx = hx + margin; ry = hy + margin * bevel; radius = 0.029 * scale + margin;
            d = depth * [0.95, 0.48, 0.1, 0][k]!; tone = [0.26, 0.48, 0.78, 1][k]!;
          }
          const pts: Array<[number, number]> = [];
          for (let j = 0; j < N; j++) {
            const [a, b] = contour((2 * Math.PI * (j + 0.5)) / N, rx, ry, radius);
            pts.push(warp(a, b, rx, ry));
          }
          rings.push({ pts, depth: d, tone });
        }
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
        place(0, 0, 0, depth, 2);
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
