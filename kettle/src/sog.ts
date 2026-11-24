// SOG version 2 reader: a stored (uncompressed) zip with meta.json and WebP
// attribute textures. Only spherical-harmonics degree 0 is supported: an asset
// with higher bands (`shN`) is rejected, as are truncated or mismatched files.

export interface SogMeta {
  version: number;
  count: number;
  means: { mins: number[]; maxs: number[]; files: string[] };
  scales: { codebook: number[]; files: string[] };
  quats: { files: string[] };
  sh0: { codebook: number[]; files: string[] };
}

/** RGBA8 pixels of one attribute texture. */
export interface Pixels {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray;
}

export interface SogTextures {
  means_l: Pixels;
  means_u: Pixels;
  quats: Pixels;
  scales: Pixels;
  sh0: Pixels;
}

/**
 * Splats in the asset's source coordinates (IDOL: x is front, y is down).
 * `covariances` holds the upper triangle (xx, xy, xz, yy, yz, zz) per splat.
 */
export interface SourceSplats {
  count: number;
  centers: Float32Array;
  covariances: Float32Array;
  /** sRGB colour and opacity, 0..255. */
  colors: Uint8Array;
}

const SH_C0 = 0.28209479177387814;

/** Lists the entries of a stored (method 0) zip archive. */
export function readStoredZip(bytes: Uint8Array): Map<string, Uint8Array> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const within = (start: number, length: number) => {
    if (start < 0 || length < 0 || start + length > bytes.length) throw new Error('SOG: archive is truncated');
  };
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65_557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) throw new Error('SOG: zip end record not found');
  const entries = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  within(offset, view.getUint32(end + 12, true));
  const files = new Map<string, Uint8Array>();
  const decoder = new TextDecoder();
  for (let n = 0; n < entries; n++) {
    within(offset, 46);
    if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('SOG: bad central directory');
    const method = view.getUint16(offset + 10, true);
    const size = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const local = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    if (method !== 0) throw new Error(`SOG: ${name} is compressed; only stored entries are supported`);
    within(local, 30);
    const localName = view.getUint16(local + 26, true);
    const localExtra = view.getUint16(local + 28, true);
    const start = local + 30 + localName + localExtra;
    within(start, size);
    files.set(name, bytes.subarray(start, start + size));
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

const finiteList = (value: unknown, length: number) =>
  Array.isArray(value) && value.length === length && value.every((n) => typeof n === 'number' && Number.isFinite(n));

export function parseSogMeta(json: string): SogMeta {
  const meta = JSON.parse(json) as SogMeta & { shN?: unknown };
  if (meta.version !== 2) throw new Error(`SOG: version ${String(meta.version)} is not supported`);
  if (!Number.isInteger(meta.count) || meta.count <= 0) throw new Error(`SOG: count ${String(meta.count)} is not a positive integer`);
  if (meta.shN) throw new Error('SOG: higher spherical-harmonics bands (shN) are not supported; export degree 0 only');
  if (!finiteList(meta.means?.mins, 3) || !finiteList(meta.means?.maxs, 3)) throw new Error('SOG: means mins/maxs must be three finite numbers');
  if (!finiteList(meta.scales?.codebook, 256)) throw new Error('SOG: scales codebook must hold 256 finite numbers');
  if (!finiteList(meta.sh0?.codebook, 256)) throw new Error('SOG: sh0 codebook must hold 256 finite numbers');
  if (meta.means.files?.length !== 2 || !meta.scales.files?.[0] || !meta.quats?.files?.[0] || !meta.sh0.files?.[0]) {
    throw new Error('SOG: attribute texture files missing');
  }
  return meta;
}

const logDecode = (value: number) => Math.sign(value) * (Math.exp(Math.abs(value)) - 1);

/** Decodes attribute pixels into centres, 3D covariances and colours. */
export function decodeSog(meta: SogMeta, textures: SogTextures): SourceSplats {
  const count = meta.count;
  for (const [name, texture] of Object.entries(textures)) {
    if (texture.width * texture.height < count || texture.data.length < texture.width * texture.height * 4) {
      throw new Error(`SOG: ${name} texture (${texture.width} × ${texture.height}) is too small for ${count} splats`);
    }
  }
  const centers = new Float32Array(count * 3);
  const covariances = new Float32Array(count * 6);
  const colors = new Uint8Array(count * 4);
  const { mins, maxs } = meta.means;
  const lo = textures.means_l.data, hi = textures.means_u.data;
  const q = textures.quats.data, s = textures.scales.data, c = textures.sh0.data;
  const scaleBook = meta.scales.codebook, colorBook = meta.sh0.codebook;
  const quat = [0, 0, 0, 0];
  for (let i = 0; i < count; i++) {
    const p = i * 4;
    for (let axis = 0; axis < 3; axis++) {
      const n = ((hi[p + axis]! << 8) | lo[p + axis]!) / 65535;
      centers[i * 3 + axis] = logDecode(mins[axis]! + (maxs[axis]! - mins[axis]!) * n);
    }
    // Smallest-three quaternion in (w, x, y, z) order; alpha - 252 names the
    // component that was dropped because it was the largest.
    const a = (q[p]! / 255 - 0.5) * Math.SQRT2;
    const b = (q[p + 1]! / 255 - 0.5) * Math.SQRT2;
    const d = (q[p + 2]! / 255 - 0.5) * Math.SQRT2;
    const largest = Math.sqrt(Math.max(0, 1 - a * a - b * b - d * d));
    const mode = (q[p + 3]! - 252) & 3;
    const rest = [a, b, d];
    for (let k = 0, r = 0; k < 4; k++) quat[k] = k === mode ? largest : rest[r++]!;
    const [w, x, y, z] = quat as [number, number, number, number];
    const sx = Math.exp(scaleBook[s[p]!]!), sy = Math.exp(scaleBook[s[p + 1]!]!), sz = Math.exp(scaleBook[s[p + 2]!]!);
    // Rotation matrix columns scaled by the axis lengths: M = R * S.
    const m00 = (1 - 2 * (y * y + z * z)) * sx, m01 = 2 * (x * y - w * z) * sy, m02 = 2 * (x * z + w * y) * sz;
    const m10 = 2 * (x * y + w * z) * sx, m11 = (1 - 2 * (x * x + z * z)) * sy, m12 = 2 * (y * z - w * x) * sz;
    const m20 = 2 * (x * z - w * y) * sx, m21 = 2 * (y * z + w * x) * sy, m22 = (1 - 2 * (x * x + y * y)) * sz;
    const o = i * 6;
    covariances[o] = m00 * m00 + m01 * m01 + m02 * m02;
    covariances[o + 1] = m00 * m10 + m01 * m11 + m02 * m12;
    covariances[o + 2] = m00 * m20 + m01 * m21 + m02 * m22;
    covariances[o + 3] = m10 * m10 + m11 * m11 + m12 * m12;
    covariances[o + 4] = m10 * m20 + m11 * m21 + m12 * m22;
    covariances[o + 5] = m20 * m20 + m21 * m21 + m22 * m22;
    for (let k = 0; k < 3; k++) {
      const value = 0.5 + colorBook[c[p + k]!]! * SH_C0;
      colors[p + k] = Math.max(0, Math.min(255, Math.round(value * 255)));
    }
    colors[p + 3] = c[p + 3]!;
  }
  return { count, centers, covariances, colors };
}
