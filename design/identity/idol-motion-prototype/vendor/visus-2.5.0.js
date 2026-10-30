var Ye = Object.defineProperty;
var Ze = (a, e, t) => e in a ? Ye(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var d = (a, e, t) => Ze(a, typeof e != "symbol" ? e + "" : e, t);
import * as c from "three";
class we {
  constructor() {
    d(this, "min", new c.Vector3(1 / 0, 1 / 0, 1 / 0));
    d(this, "max", new c.Vector3(-1 / 0, -1 / 0, -1 / 0));
    d(this, "center", new c.Vector3());
    /** Half extents (size/2) */
    d(this, "halfExtents", new c.Vector3());
  }
  /**
   * Reset the bounding box to its initial state
   */
  reset() {
    this.min.set(1 / 0, 1 / 0, 1 / 0), this.max.set(-1 / 0, -1 / 0, -1 / 0), this.center.set(0, 0, 0), this.halfExtents.set(0, 0, 0);
  }
  /**
   * Expand the bounding box to include the given point
   * @param point Point to include in the bounding box
   */
  expandByPoint(e) {
    this.min.x = Math.min(this.min.x, e.x), this.min.y = Math.min(this.min.y, e.y), this.min.z = Math.min(this.min.z, e.z), this.max.x = Math.max(this.max.x, e.x), this.max.y = Math.max(this.max.y, e.y), this.max.z = Math.max(this.max.z, e.z), this.updateDerived();
  }
  /**
   * Expand this bounding box to include another bounding box
   * @param box Bounding box to include
   */
  expandByBox(e) {
    this.min.x = Math.min(this.min.x, e.min.x), this.min.y = Math.min(this.min.y, e.min.y), this.min.z = Math.min(this.min.z, e.min.z), this.max.x = Math.max(this.max.x, e.max.x), this.max.y = Math.max(this.max.y, e.max.y), this.max.z = Math.max(this.max.z, e.max.z), this.updateDerived();
  }
  /**
   * Update the center and half extents based on min/max
   */
  updateDerived() {
    this.center.addVectors(this.min, this.max).multiplyScalar(0.5), this.halfExtents.subVectors(this.max, this.min).multiplyScalar(0.5);
  }
  /**
   * Check if this box contains a point
   * @param point Point to check
   * @returns True if the point is inside the box
   */
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  /**
   * Create a Three.js Box3 from this bounding box
   * @returns THREE.Box3 representation
   */
  toBox3() {
    return new c.Box3().set(this.min, this.max);
  }
  /**
   * Create a clone of this bounding box
   * @returns New bounding box with the same values
   */
  clone() {
    const e = new we();
    return e.min.copy(this.min), e.max.copy(this.max), e.center.copy(this.center), e.halfExtents.copy(this.halfExtents), e;
  }
}
class Xe {
  constructor(e = 0) {
    d(this, "numSplats", 0);
    d(this, "positions");
    d(this, "rotations");
    d(this, "scales");
    d(this, "colors");
    d(this, "opacities");
    d(this, "boundingBox", new we());
    this.numSplats = e, this.allocateBuffers(e);
  }
  allocateBuffers(e) {
    this.positions = new Float32Array(e * 3), this.rotations = new Float32Array(e * 4), this.scales = new Float32Array(e * 3), this.colors = new Float32Array(e * 3), this.opacities = new Float32Array(e);
  }
  /**
   * Set data for a specific splat
   * @param index Splat index
   * @param position Position vector
   * @param rotation Quaternion
   * @param scale Scale vector (expects LOG SCALE)
   * @param color Color
   * @param opacity Opacity value
   */
  setSplat(e, t, s, n, r, i) {
    if (e >= this.numSplats)
      throw new Error(
        `Splat index out of bounds: ${e} >= ${this.numSplats}`
      );
    const o = e * 3, m = e * 4, y = e * 3, u = e * 3;
    this.positions[o] = t.x, this.positions[o + 1] = t.y, this.positions[o + 2] = t.z, this.rotations[m] = s.x, this.rotations[m + 1] = s.y, this.rotations[m + 2] = s.z, this.rotations[m + 3] = s.w, this.scales[y] = n.x, this.scales[y + 1] = n.y, this.scales[y + 2] = n.z, this.colors[u] = r.r, this.colors[u + 1] = r.g, this.colors[u + 2] = r.b, this.opacities[e] = i;
  }
  /**
   * Get a splat's data
   * @param index Splat index
   * @returns Object containing splat data (linear scale)
   */
  getSplat(e) {
    if (e >= this.numSplats)
      throw new Error(
        `Splat index out of bounds: ${e} >= ${this.numSplats}`
      );
    const t = e * 3, s = e * 4, n = e * 3, r = e * 3;
    return {
      position: new c.Vector3(
        this.positions[t],
        this.positions[t + 1],
        this.positions[t + 2]
      ),
      rotation: new c.Quaternion(
        this.rotations[s],
        this.rotations[s + 1],
        this.rotations[s + 2],
        this.rotations[s + 3]
      ),
      // Convert log scale back to linear scale for external use
      scale: new c.Vector3(
        Math.exp(this.scales[n]),
        Math.exp(this.scales[n + 1]),
        Math.exp(this.scales[n + 2])
      ),
      color: new c.Color(
        this.colors[r],
        this.colors[r + 1],
        this.colors[r + 2]
      ),
      opacity: this.opacities[e]
    };
  }
  /**
   * Calculate the bounding box for all splats
   * NOTE: Currently it only uses positions, not the actual splat bounds
   */
  calculateBoundingBox() {
    this.boundingBox.reset();
    const e = new c.Vector3();
    for (let t = 0; t < this.numSplats; t++) {
      const s = t * 3;
      e.set(
        this.positions[s],
        this.positions[s + 1],
        this.positions[s + 2]
      ), this.boundingBox.expandByPoint(e);
    }
    return this.boundingBox;
  }
  /**
   * Create a Three.js BufferGeometry from this splat data
   * This is for visualization/debugging purposes only, not for rendering
   */
  createDebugGeometry() {
    const e = new c.BufferGeometry();
    e.setAttribute(
      "position",
      new c.BufferAttribute(this.positions, 3)
    );
    const t = new Float32Array(this.numSplats * 3), s = new c.Quaternion(), n = new c.Euler();
    for (let r = 0; r < this.numSplats; r++) {
      const i = r * 4, o = r * 3;
      s.set(
        this.rotations[i],
        this.rotations[i + 1],
        this.rotations[i + 2],
        this.rotations[i + 3]
      ), n.setFromQuaternion(s), t[o] = n.x, t[o + 1] = n.y, t[o + 2] = n.z;
    }
    return e.setAttribute(
      "rotation",
      new c.BufferAttribute(t, 3)
    ), e.setAttribute(
      "scale",
      new c.BufferAttribute(this.scales, 3)
    ), e.setAttribute(
      "color",
      new c.BufferAttribute(this.colors, 3)
    ), e.setAttribute(
      "opacity",
      new c.BufferAttribute(this.opacities, 1)
    ), e;
  }
  dispose() {
    this.numSplats = 0, this.scales = new Float32Array(0), this.colors = new Float32Array(0), this.positions = new Float32Array(0), this.rotations = new Float32Array(0), this.opacities = new Float32Array(0);
  }
}
class Ee {
  // Upper 8 bits of 16-bit means
  constructor(e, t, s) {
    d(this, "ranges");
    d(this, "version", 1);
    d(this, "numSplats", 0);
    d(this, "boundingBox", new we());
    // Original SOGS textures
    d(this, "sh0");
    // SH DC coefficients + alpha
    d(this, "quats");
    // Quaternion components + mode
    d(this, "scales");
    // Scale values (8-bit)
    d(this, "means_l");
    // Lower 8 bits of 16-bit means
    d(this, "means_u");
    this.ranges = t, this.numSplats = e, this.sh0 = s.sh0, this.quats = s.quats, this.scales = s.scales, this.means_l = s.means_l, this.means_u = s.means_u, this.boundingBox = this.calculateBoundingBox();
  }
  calculateBoundingBox() {
    this.boundingBox.reset();
    const { mins: e, maxs: t } = this.ranges.means, s = (n) => Math.sign(n) * (Math.exp(Math.abs(n)) - 1);
    return this.boundingBox.center.set(
      (s(e[0]) + s(t[0])) * 0.5,
      (s(e[1]) + s(t[1])) * 0.5,
      (s(e[2]) + s(t[2])) * 0.5
    ), this.boundingBox.halfExtents.set(
      (s(t[0]) - s(e[0])) * 0.5,
      (s(t[1]) - s(e[1])) * 0.5,
      (s(t[2]) - s(e[2])) * 0.5
    ), this.boundingBox;
  }
  dispose() {
    this.sh0.dispose(), this.quats.dispose(), this.scales.dispose(), this.means_l.dispose(), this.means_u.dispose();
  }
}
class qe {
  // Upper 8 bits of 16-bit means
  constructor(e, t, s) {
    d(this, "ranges");
    d(this, "version", 2);
    d(this, "numSplats", 0);
    d(this, "boundingBox", new we());
    // Original SOGS textures
    d(this, "sh0");
    // SH DC coefficients + alpha
    d(this, "quats");
    // Quaternion components + mode
    d(this, "scales");
    // Scale values (8-bit)
    d(this, "means_l");
    // Lower 8 bits of 16-bit means
    d(this, "means_u");
    this.ranges = t, this.numSplats = e, this.sh0 = s.sh0, this.quats = s.quats, this.scales = s.scales, this.means_l = s.means_l, this.means_u = s.means_u, this.boundingBox = this.calculateBoundingBox();
  }
  calculateBoundingBox() {
    this.boundingBox.reset();
    const { mins: e, maxs: t } = this.ranges.means, s = (n) => Math.sign(n) * (Math.exp(Math.abs(n)) - 1);
    return this.boundingBox.center.set(
      (s(e[0]) + s(t[0])) * 0.5,
      (s(e[1]) + s(t[1])) * 0.5,
      (s(e[2]) + s(t[2])) * 0.5
    ), this.boundingBox.halfExtents.set(
      (s(t[0]) - s(e[0])) * 0.5,
      (s(t[1]) - s(e[1])) * 0.5,
      (s(t[2]) - s(e[2])) * 0.5
    ), this.boundingBox;
  }
  dispose() {
    this.sh0.dispose(), this.quats.dispose(), this.scales.dispose(), this.means_l.dispose(), this.means_u.dispose();
  }
}
class Ae {
  // RGBA32UI - (Position + Rotation + Scale)
  // RGBA32UI Texture Content:
  // .r = Means Lower (RGB)
  // .g = Means Upper (RGB)
  // .b = Rotation (RGBA)
  // .a = Scale (RGB)
  constructor(e, t, s, n, r, i, o, m) {
    // Info data - cpu
    d(this, "numSplats");
    d(this, "textureWidth");
    d(this, "textureHeight");
    d(this, "ranges");
    d(this, "centers");
    // TODO: see if necesary or can be compressed somehow
    d(this, "boundingBox");
    // GPU Textures
    d(this, "packedColor");
    // RGBA8 - (Color + Opacity)
    // RGBA8 Texture Content:
    // .rgb = Color, .a = Opacity
    d(this, "packedGeometry");
    this.numSplats = e, this.textureWidth = t, this.textureHeight = s, this.boundingBox = m, this.ranges = o, this.centers = n, this.packedColor = i, this.packedGeometry = r;
  }
  /**
   * Optional: Reconstruct a full JS object for a specific splat.
   * Useful for raycasting or debugging.
   */
  // public getSplat(index: number) {
  //     throw new Error('Not implemented yet');
  // }
  dispose() {
    this.centers = new Float32Array(0), this.packedColor = new Uint8Array(0), this.packedGeometry = new Uint32Array(0);
  }
  // public abstract deserialize(): ISplat;
  // public abstract returnPacked(): ISplat;
}
class Qe extends c.EventDispatcher {
  constructor() {
    super();
    d(this, "worker");
    d(this, "centers", null);
    d(this, "orderTexture", null);
    /** Bounding box data for optimization */
    d(this, "chunks", null);
    d(this, "lastCameraPosition", new c.Vector3());
    d(this, "lastCameraDirection", new c.Vector3());
    const t = this.createWorkerCode(), s = new Blob([t], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(s)), this.worker.onmessage = this.onWorkerMessage.bind(this);
  }
  /**
   * Handles messages received from the sorting worker.
   * @param event The message event from the worker.
   */
  onWorkerMessage(t) {
    if (!this.orderTexture || !this.orderTexture.image)
      return console.error("SplatSorter: Order texture not initialized!");
    const { order: s, count: n } = t.data, r = this.orderTexture.image.data;
    if (!(r instanceof Uint32Array))
      return console.error(
        "SplatSorter: Order texture data is not a Uint32Array!"
      );
    r.set(new Uint32Array(s)), this.orderTexture.source.data.updateRanges || (this.orderTexture.source.data.updateRanges = []), this.orderTexture.needsUpdate = !0;
    const i = r.buffer.slice(0), o = { order: i };
    this.worker.postMessage(o, [i]), this.dispatchEvent({ type: "updated", count: n });
  }
  /**
   * Initializes the sorter with necessary data and textures.
   * @param orderTexture The THREE.DataTexture (R32UI) to store the sorted splat indices.
   * @param centers A Float32Array containing the center position (x, y, z) for each splat.
   * @param chunks Optional: A Float32Array containing bounding box chunk data [minX, minY, minZ, maxX, maxY, maxZ, ...] for optimization.
   * @param transferOwnership Optional: If true, transfers ownership of centers buffer to worker (saves memory, main thread loses access). Default: false.
   */
  init(t, s, n, r = !1) {
    if (!t || !(t.image.data instanceof Uint32Array))
      throw new Error("SplatSorter: Invalid orderTexture provided. Must be DataTexture with Uint32Array data.");
    if (!s || s.length % 3 !== 0)
      throw new Error("SplatSorter: Invalid centers array provided. Length must be multiple of 3.");
    if (t.image.data.length < s.length / 3)
      throw new Error("SplatSorter: orderTexture data buffer is smaller than the number of splats.");
    if (s.buffer.byteLength === 0)
      throw new Error(
        "SplatSorter: positions buffer is detached (likely React StrictMode + cached asset). "
      );
    const i = s.length / 3;
    this.orderTexture = t, r ? this.centers = null : this.centers = s.slice();
    const o = this.orderTexture.image.data;
    for (let h = 0; h < i; h++) o[h] = h;
    this.orderTexture.source.data.updateRanges || (this.orderTexture.source.data.updateRanges = []), this.orderTexture.needsUpdate = !0;
    const m = o.buffer.slice(0), y = r ? s.buffer : s.buffer.slice(0), u = {
      order: m,
      centers: y
    }, l = [
      m,
      y
    ];
    if (n) {
      this.chunks = n.slice();
      const h = this.chunks.buffer.slice(0);
      u.chunks = h, l.push(h);
    }
    this.worker.postMessage(u, l), queueMicrotask(() => {
      this.dispatchEvent({
        type: "updated",
        count: i
      });
    });
  }
  /**
   * Applies an optional mapping to filter or reorder splats before sorting.
   * The sorter will only consider splats whose original indices are present in the mapping.
   * @param mapping A Uint32Array where each element is the *original* index of a splat to include, or null to reset mapping.
   */
  setMapping(t) {
    if (!this.centers)
      return console.warn(
        "SplatSorter: Cannot set mapping before initialization."
      );
    let s;
    const n = [];
    if (!t) {
      const m = this.centers.buffer.slice(0);
      return s = {
        centers: m,
        mapping: null
      }, n.push(m), this.worker.postMessage(s, n);
    }
    const r = new Float32Array(t.length * 3);
    for (let m = 0; m < t.length; m++) {
      const y = t[m];
      if (y * 3 + 2 >= this.centers.length) {
        console.warn(
          `SplatSorter: Mapping index ${y} out of bounds.`
        );
        continue;
      }
      const u = y * 3, l = m * 3;
      r[l + 0] = this.centers[u + 0], r[l + 1] = this.centers[u + 1], r[l + 2] = this.centers[u + 2];
    }
    const i = r.buffer.slice(0), o = t.buffer.slice(0);
    s = {
      centers: i,
      mapping: o
    }, n.push(i, o), this.worker.postMessage(s, n);
  }
  /**
   * Updates the camera parameters used for sorting.
   * @param position The camera's position in the sorter's local coordinate space.
   * @param direction The camera's forward direction in the sorter's local coordinate space.
   */
  setCamera(t, s) {
    const n = this.lastCameraPosition.distanceToSquared(t) > 1e-7, r = this.lastCameraDirection.dot(s) < 0.9999;
    if (!n && !r)
      return;
    this.lastCameraPosition.copy(t), this.lastCameraDirection.copy(s);
    const i = {
      cameraPosition: { x: t.x, y: t.y, z: t.z },
      cameraDirection: { x: s.x, y: s.y, z: s.z }
    };
    this.worker.postMessage(i);
  }
  /**
   * Terminates the Web Worker and cleans up resources.
   */
  dispose() {
    this.worker && this.worker.terminate(), this.orderTexture = null, this.centers = null, this.chunks = null;
  }
  /**
   * Creates the self-contained code for the sorting Web Worker.
   * @returns A string containing the JavaScript code for the worker.
   */
  createWorkerCode() {
    return `(${(function() {
      let s = null, n = null, r = null, i = null, o = null, m = null, y = !1;
      const u = { x: 0, y: 0, z: 0 }, l = { x: 0, y: 0, z: 0 }, h = { x: 0, y: 0, z: 0 }, f = { x: 0, y: 0, z: 0 };
      let w = null, A = null;
      const b = 32, B = new Array(b).fill(0), T = new Array(b).fill(0), E = new Array(b).fill(0), U = (C, M, k) => {
        for (; C <= M; ) {
          const S = M + C >> 1, g = k(S);
          if (g > 0) C = S + 1;
          else if (g < 0) M = S - 1;
          else return S;
        }
        return ~C;
      }, R = () => {
        if (!s || !n || !o || !m)
          return;
        if (n.length === 0) {
          const x = {
            order: s.buffer,
            count: 0
          };
          self.postMessage(x, [s.buffer]), s = null;
          return;
        }
        const C = o.x, M = o.y, k = o.z, S = m.x, g = m.y, v = m.z, O = 1e-4, V = Math.abs(C - u.x) > O || Math.abs(M - u.y) > O || Math.abs(k - u.z) > O, I = Math.abs(S - l.x) > O || Math.abs(g - l.y) > O || Math.abs(v - l.z) > O;
        if (!y && !V && !I)
          return;
        y = !1, u.x = C, u.y = M, u.z = k, l.x = S, l.y = g, l.z = v;
        let q = 1 / 0, p = -1 / 0;
        for (let x = 0; x < 8; ++x) {
          const D = x & 1 ? h.x : f.x, L = x & 2 ? h.y : f.y, P = x & 4 ? h.z : f.z, G = D * S + L * g + P * v;
          q = Math.min(q, G), p = Math.max(p, G);
        }
        const _ = n.length / 3, H = p - q, F = (1 << Math.max(
          10,
          Math.min(20, Math.ceil(Math.log2(_ / 4)))
        )) + 1;
        if ((!w || w.length !== _) && (w = new Uint32Array(_)), !A || A.length !== F ? A = new Uint32Array(F) : A.fill(0), H < 1e-7) {
          for (let x = 0; x < _; ++x) w[x] = 0;
          A[0] = _;
        } else if (r && r.length > 0) {
          const x = r.length / 6;
          B.fill(0);
          for (let P = 0; P < x; ++P) {
            const G = P * 6, X = r[G + 0], j = r[G + 1], Q = r[G + 2], $ = r[G + 3], K = X * S + j * g + Q * v - q, ee = K - $, te = K + $, ue = Math.max(
              0,
              Math.floor(ee * b / H)
            ), de = Math.min(
              b,
              Math.ceil(te * b / H)
            );
            for (let ie = ue; ie < de; ++ie)
              B[ie]++;
          }
          let D = 0;
          for (let P = 0; P < b; ++P) D += B[P];
          E[0] = 0, T[0] = 0;
          for (let P = 1; P < b; ++P)
            E[P - 1] = B[P - 1] / D * F >>> 0, T[P] = T[P - 1] + E[P - 1];
          E[b - 1] = B[b - 1] / D * F >>> 0;
          const L = H / b;
          for (let P = 0; P < _; ++P) {
            const G = P * 3, X = n[G + 0], j = n[G + 1], Q = n[G + 2], $ = X * S + j * g + Q * v, ee = (p - $) / L, te = Math.max(
              0,
              Math.min(
                b - 1,
                Math.floor(ee)
              )
            ), ue = ee - te, de = T[te] + E[te] * ue >>> 0, ie = Math.min(de, F - 1);
            w[P] = ie, A[ie]++;
          }
        } else {
          const x = (F - 1) / H;
          for (let D = 0; D < _; ++D) {
            const L = D * 3, P = n[L + 0], G = n[L + 1], X = n[L + 2], j = P * S + G * g + X * v, $ = (p - j) * x >>> 0, K = Math.min($, F - 1);
            w[D] = K, A[K]++;
          }
        }
        for (let x = 1; x < F; x++)
          A[x] += A[x - 1];
        for (let x = _ - 1; x >= 0; x--) {
          const D = w[x], L = --A[D];
          s[L] = i ? i[x] : x;
        }
        const J = C * S + M * g + k * v, Z = (x) => {
          if (!s) return -1 / 0;
          const D = s[x], L = D;
          if (!n || L * 3 + 2 >= n.length)
            return -1 / 0;
          const P = L * 3;
          return n[P] * S + n[P + 1] * g + n[P + 2] * v - J;
        };
        let Y = _;
        if (_ > 0 && Z(_ - 1) < 0) {
          const x = U(
            0,
            _ - 1,
            Z
          );
          Y = x < 0 ? ~x : x;
        }
        const z = {
          order: s.buffer,
          count: Y
        };
        self.postMessage(z, [s.buffer]), s = null;
      };
      self.onmessage = (C) => {
        const M = C.data;
        M.order && (s = new Uint32Array(M.order));
        let k = !1;
        if (M.centers && (n = new Float32Array(M.centers), k = !0, y = !0), Object.prototype.hasOwnProperty.call(M, "mapping") && (i = M.mapping ? new Uint32Array(M.mapping) : null, y = !0), M.chunks) {
          if (r = new Float32Array(M.chunks), r.length > 0 && r[3] > 0)
            for (let S = 0; S < r.length / 6; ++S) {
              const g = S * 6, v = r[g + 0], O = r[g + 1], V = r[g + 2], I = r[g + 3], q = r[g + 4], p = r[g + 5];
              r[g + 0] = (v + I) * 0.5, r[g + 1] = (O + q) * 0.5, r[g + 2] = (V + p) * 0.5, r[g + 3] = Math.sqrt(
                (I - v) ** 2 + (q - O) ** 2 + (p - V) ** 2
              ) * 0.5;
            }
          y = !0;
        }
        if (k && n && n.length > 0) {
          h.x = f.x = n[0], h.y = f.y = n[1], h.z = f.z = n[2];
          for (let S = 1; S < n.length / 3; S++) {
            const g = S * 3;
            h.x = Math.min(h.x, n[g + 0]), f.x = Math.max(f.x, n[g + 0]), h.y = Math.min(h.y, n[g + 1]), f.y = Math.max(f.y, n[g + 1]), h.z = Math.min(h.z, n[g + 2]), f.z = Math.max(f.z, n[g + 2]);
          }
        } else k && n && n.length === 0 && (h.x = f.x = h.y = f.y = h.z = f.z = 0);
        M.cameraPosition && (o = M.cameraPosition), M.cameraDirection && (m = M.cameraDirection), R();
      };
    }).toString()})();`;
  }
}
const Je = {
  type: "wave",
  defaultDuration: 3,
  shaderCode: (
    /* glsl */
    `
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {
    const float DIST_K     = 0.3;
    const float WAVE_GAIN  = 1.2;
    const float INV_WAVE_W = 20.0;
    const vec3  GLOW       = vec3(1.0, 1.0, 1.0);

    float dist = length(position - center);
    float normalizedDist = 1.0 - exp(-dist * DIST_K);
    float waveProgress = progress * WAVE_GAIN;

    float glowIntensity = clamp(1.0 - abs(normalizedDist - waveProgress) * INV_WAVE_W, 0.0, 1.0);
    color.rgb = mix(color.rgb, GLOW, glowIntensity);
}
`
  )
}, Ke = {
  type: "spread",
  defaultDuration: 3,
  shaderCode: (
    /* glsl */
    `
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {
    const float DIST_K      = 0.3;
    const float WAVE_GAIN   = 1.2;
    const float SPHERE_LOG  = -6.0;
    const float INV_WAVE_W  = 20.0;  // 1.0 / 0.05 wave width, precomputed
    const vec3 GOLD = vec3(1.0, 1.0, 1.0);   // pure white

    float dist = length(position - center);
    float normalizedDist = 1.0 - exp(-dist * DIST_K);
    float waveProgress = progress * WAVE_GAIN;

    float revealed = step(normalizedDist, waveProgress);
    scale = mix(vec3(SPHERE_LOG), scale, revealed);

    float glowIntensity = clamp(1.0 - abs(normalizedDist - waveProgress) * INV_WAVE_W, 0.0, 1.0);
    color.rgb = mix(color.rgb, GOLD, glowIntensity);
}
`
  )
}, et = {
  type: "none",
  defaultDuration: 0,
  shaderCode: (
    /* glsl */
    `
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {}
`
  )
}, Fe = {
  spread: Ke,
  wave: Je,
  none: et
}, Le = (a) => Fe[a] ?? Fe.none, Te = {
  linear: (a) => a,
  easeInQuad: (a) => a * a,
  easeOutQuad: (a) => a * (2 - a),
  easeInOutQuad: (a) => a < 0.5 ? 2 * a * a : -1 + (4 - 2 * a) * a,
  easeInCubic: (a) => a * a * a,
  easeOutCubic: (a) => 1 - Math.pow(1 - a, 3),
  easeInOutCubic: (a) => a < 0.5 ? 4 * a * a * a : 1 - Math.pow(-2 * a + 2, 3) / 2,
  easeOutExpo: (a) => a === 1 ? 1 : 1 - Math.pow(2, -10 * a)
}, tt = (a) => Te[a] ?? Te.linear;
class st {
  constructor(e) {
    d(this, "_progress", 0);
    d(this, "_isPlaying", !1);
    d(this, "_isComplete", !1);
    d(this, "_startTime", 0);
    d(this, "_duration");
    d(this, "_delay");
    d(this, "_easing");
    d(this, "_type");
    d(this, "_autoPlay");
    // Animation center (set from bounding box)
    d(this, "_center", new c.Vector3());
    const t = Le(e.type);
    this._type = e.type, this._duration = e.duration ?? t.defaultDuration, this._delay = e.delay ?? 0, this._easing = tt(e.easing ?? "easeOutCubic"), this._autoPlay = e.autoPlay ?? !0;
  }
  /** Current progress 0-1 (eased) */
  get progress() {
    return this._progress;
  }
  get isPlaying() {
    return this._isPlaying;
  }
  get isComplete() {
    return this._isComplete;
  }
  get type() {
    return this._type;
  }
  get center() {
    return this._center;
  }
  /** Set the animation center point (typically bounding box center) */
  setCenter(e) {
    this._center.copy(e);
  }
  play() {
    this._startTime = -1, this._isPlaying = !0, this._isComplete = !1, this._progress = 0;
  }
  stop() {
    this._isPlaying = !1;
  }
  reset() {
    this._progress = 0, this._isPlaying = !1, this._isComplete = !1, this._startTime = 0;
  }
  /** Skip to end state */
  complete() {
    this._progress = 1, this._isPlaying = !1, this._isComplete = !0;
  }
  /** Called from onBeforeRender - returns true if uniforms need update */
  update(e) {
    if (!this._isPlaying) return !1;
    this._startTime < 0 && (this._startTime = e + this._delay);
    const t = e - this._startTime;
    if (t < 0) return !1;
    const s = Math.min(t / this._duration, 1);
    return this._progress = this._easing(s), s >= 1 && (this._isPlaying = !1, this._isComplete = !0, this._progress = 1), !0;
  }
  /** Should auto-play be triggered on load? */
  shouldAutoPlay() {
    return this._autoPlay && !this._isComplete;
  }
}
class nt {
  constructor(e) {
    d(this, "packedGeometry");
    // RGBA32UI
    d(this, "packedColor");
    // RGBA8
    d(this, "orderTexture");
    // RB32UI
    d(this, "width");
    d(this, "height");
    this.width = e.textureWidth, this.height = e.textureHeight, this.packedColor = this.createColorTexture(e), this.packedGeometry = this.createGeometryTexture(e), this.orderTexture = this.createOrderTexture(e.numSplats);
  }
  createGeometryTexture(e) {
    const t = new c.DataTexture(
      e.packedGeometry,
      this.width,
      this.height,
      c.RGBAIntegerFormat,
      c.UnsignedIntType
    );
    return t.internalFormat = "RGBA32UI", t.minFilter = c.NearestFilter, t.magFilter = c.NearestFilter, t.needsUpdate = !0, t;
  }
  createColorTexture(e) {
    const t = new c.DataTexture(
      e.packedColor,
      this.width,
      this.height,
      c.RGBAFormat,
      c.UnsignedByteType
    );
    return t.minFilter = c.NearestFilter, t.magFilter = c.NearestFilter, t.needsUpdate = !0, t;
  }
  createOrderTexture(e) {
    const t = new Uint32Array(this.width * this.height);
    for (let n = 0; n < e; n++) t[n] = n;
    const s = new c.DataTexture(
      t,
      this.width,
      this.height,
      c.RedIntegerFormat,
      c.UnsignedIntType
    );
    return s.minFilter = c.NearestFilter, s.magFilter = c.NearestFilter, s.needsUpdate = !0, s;
  }
  dispose() {
    this.packedGeometry.dispose(), this.packedColor.dispose(), this.orderTexture.dispose();
  }
}
const Ve = (
  /* glsl */
  `
precision highp float;
precision highp int;
precision highp usampler2D;
precision highp sampler2D;

uniform int texWidth;
uniform vec2 viewport;
uniform uint numSplats;

// --- Unified Packed Textures ---
uniform usampler2D packedGeometry; // RGBA32UI: Geometry (Pos, Rot, Scale)
uniform sampler2D packedColor;    // RGBA8: Color (RGB) + Opacity (A)
uniform usampler2D splatOrder;    // R32UI: Sort Index

// --- Decompression Ranges ---
uniform vec3 meansMin;
uniform vec3 meansMax;
uniform vec3 scalesMin;
uniform vec3 scalesMax;
uniform vec3 sh0Min;
uniform vec3 sh0Max;

// --- Animation Uniforms ---
uniform float animationProgress;  // 0 = start, 1 = complete
uniform vec3 animationCenter;     // Center point for animation

/* @ANIMATION_CODE */

// --- Attributes ---
in uint splatInstanceIndex;

// --- Outputs ---
out vec4 vColor;
out vec2 vUv;

// --- Constants ---
const vec4 DISCARD_VERTEX = vec4(0.0, 0.0, 2.0, 1.0);
const float SH_C0 = 0.28209479177387814; // 1/(2*sqrt(pi))
const float QUAT_NORM = 1.41421356237; // sqrt(2)

// --- Helper Functions ---

// Extract raw bytes as integers (no /255 )
uvec4 unpackBytes(uint v) {
    return (uvec4(v) >> uvec4(24u, 16u, 8u, 0u)) & 0xffu;
}

mat3 quatToMat3(vec4 R) {
    vec4 R2 = R + R;
    float X = R2.x * R.w;
    vec4 Y = R2.y * R;
    vec4 Z = R2.z * R;
    float W = R2.w * R.w;

    return mat3(
        1.0 - Z.z - W,
              Y.z + X,
              Y.w - Z.x,
              Y.z - X,
        1.0 - Y.y - W,
              Z.w + Y.x,
              Y.w + Z.x,
              Z.w - Y.x,
        1.0 - Y.y - Z.z
    );
}

void getModelCovariance(vec3 scale, vec4 rotation, out vec3 covA, out vec3 covB) {
    mat3 rot = quatToMat3(rotation);
    mat3 M = transpose(mat3(
        scale.x * rot[0],
        scale.y * rot[1],
        scale.z * rot[2]
    ));

    covA = vec3(dot(M[0], M[0]), dot(M[0], M[1]), dot(M[0], M[2]));
    covB = vec3(dot(M[1], M[1]), dot(M[1], M[2]), dot(M[2], M[2]));
}

// --- Main ---
void main() {
    // Calculate Instance ID & Source Data UV
    uint instanceOffset = uint(position.z);
    uint orderIndex = splatInstanceIndex + instanceOffset;

    if (orderIndex >= numSplats) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    uint w = uint(texWidth);
    ivec2 orderUV = ivec2(int(orderIndex % w), int(orderIndex / w));

    // Fetch original splat ID from the order texture
    uint splatID = texelFetch(splatOrder, orderUV, 0).r;
    ivec2 dataUV = ivec2(int(splatID % w), int(splatID / w));

    // Fetch Packed Data
    // x: Means Low, y: Means High, z: Rotation, w: Scale
    uvec4 geom = texelFetch(packedGeometry, dataUV, 0); 
    vec4 colorRaw = texelFetch(packedColor, dataUV, 0);

    // Decompress Position (Means) (assume world-space)
    // Reconstruct 16-bit values from two 8-bit channels
    uvec3 lo = unpackBytes(geom.x).xyz;
    uvec3 hi = unpackBytes(geom.y).xyz;

    // (hi << 8) | lo  => 0..65535  then normalize
    vec3 meansNorm = vec3((hi << 8u) | lo) * (1.0 / 65535.0);
    vec3 modelCenter = mix(meansMin, meansMax, meansNorm);

    // Decompress Rotation (Quaternions)
    uvec4 qB = unpackBytes(geom.z);
    vec3 abc = (vec3(qB.xyz) * (1.0 / 255.0) - 0.5) * QUAT_NORM;
    float d = sqrt(max(0.0, 1.0 - dot(abc, abc)));
    uint mode = qB.w; // already 0..3


    // Reconstruct Quaternion (x, y, z, w)
    // quat in (w,x,y,z)
    vec4 quat;
    if (mode == 0u)      quat = vec4(d, abc);            // (w, x, y, z)
    else if (mode == 1u) quat = vec4(abc.x, d, abc.yz);  // stored (w,y,z)
    else if (mode == 2u) quat = vec4(abc.xy, d, abc.z);  // stored (w,x,z)
    else                 quat = vec4(abc, d);            // stored (w,x,y)

    // Decompress Scale (log-space)
    uvec3 sB = unpackBytes(geom.w).xyz;
    vec3 sNorm = vec3(sB) * (1.0 / 255.0);
    vec3 scale = mix(scalesMin, scalesMax, sNorm); // log-space scale

    // Decompress Color & Opacity
    vec4 clr;
    vec3 sh = mix(sh0Min, sh0Max, colorRaw.rgb);
    clr.rgb = vec3(0.5) + sh * SH_C0;
    clr.a = colorRaw.a; // Opacity passed directly (linear or sigmoid handled by loader)

    // --- Apply Animation (modifies position, scale, color in place) ---
    /* @ANIMATION_CALL */

    // Convert log-space scale to linear scale
    scale = exp(scale);

    // --- Standard Gaussian Splat Projection ---

    // View Space Setup
    mat4 modelView = modelViewMatrix;
    vec4 centerView = modelView * vec4(modelCenter, 1.0);

    // Cull behind camera
    if (centerView.z > -0.2) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    // Covariance in 3D
    vec3 covA, covB;
    getModelCovariance(scale, quat, covA, covB);

    // Project to 2D
    float focalX = viewport.x * projectionMatrix[0][0];
    float focalY = viewport.y * projectionMatrix[1][1];
    float J1 = focalX / centerView.z;
    vec2 J2 = -J1 / centerView.z * centerView.xy;

    mat3 J = mat3(
        J1,   0.0,  J2.x,
        0.0,  J1,   J2.y,
        0.0,  0.0,  0.0
    );

    mat3 W = transpose(mat3(modelView));
    mat3 T = W * J;
    mat3 Vrk = mat3(
        covA.x, covA.y, covA.z,
        covA.y, covB.x, covB.y,
        covA.z, covB.y, covB.z
    );
    mat3 cov = transpose(T) * Vrk * T;

    // Eigendecomposition for Quad dimensions
    float diagonal1 = cov[0][0] + 0.3;
    float offDiagonal = cov[0][1];
    float diagonal2 = cov[1][1] + 0.3;

    float mid = 0.5 * (diagonal1 + diagonal2);
    float radius = length(vec2((diagonal1 - diagonal2) * 0.5, offDiagonal));
    float lambda1 = mid + radius;
    float lambda2 = max(mid - radius, 0.1);

    // Screen space quad vectors
    float vmin = min(1024.0, min(viewport.x, viewport.y)); // Safety clamp
    float l1 = 2.0 * min(sqrt(2.0 * lambda1), vmin);
    float l2 = 2.0 * min(sqrt(2.0 * lambda2), vmin);

    // Discard tiny splats
    // TODO: this branch might create some performance issues - check
    if (animationProgress >= 1.0) {
        if (l1 < 2.0 && l2 < 2.0) {
            gl_Position = DISCARD_VERTEX;
            return;
        }
    }

    vec2 diagVec = normalize(vec2(offDiagonal, lambda1 - diagonal1));
    vec2 v1 = l1 * diagVec;
    vec2 v2 = l2 * vec2(diagVec.y, -diagVec.x);

    // Vertex Position (Quad Expansion)
    vec4 centerProj = projectionMatrix * centerView;
    vec2 c = centerProj.ww / viewport; // Correction for clip space
    
    // Frustum cull
    if (any(greaterThan(abs(centerProj.xy) - vec2(max(l1, l2)) * c, centerProj.ww))) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    // Quad offset based on 'position' attribute (-1 to 1)
    vec2 offset = (position.x * v1 + position.y * v2) * c;
    
    // Corner Clipping (for gaussian shape)
    // Assuming simple linear opacity here, otherwise inverse sigmoid logic required
    float alpha = max(clr.a, 1.0/255.0);
    float clip = min(1.0, sqrt(-log(1.0 / 255.0 / alpha)) / 2.0);
    
    offset *= clip;
    vec2 clippedUV = position.xy * clip;

    gl_Position = centerProj + vec4(offset, 0.0, 0.0);
    
    // Outputs
    vUv = clippedUV;
    vColor = vec4(max(clr.rgb, vec3(0.0)), clr.a);
}
`
), at = (
  /* glsl */
  `
precision highp float;

in vec4 vColor; // Color and opacity passed from vertex shader
in vec2 vUv;    // Quad UV coordinates (-1 to 1) passed from vertex shader

out vec4 fragColor; // Output variable

// Fast approximate e^x based on https://nic.schraudolph.org/pubs/Schraudolph99.pdf
const float EXP_A = 12102203.0;     // ≈ 2^23 / ln(2)
const int EXP_BC_RMS = 1064866808;  // (127 << 23) - 60801 * 8
float fastExp(float x) {
    int i = int(EXP_A * x) + EXP_BC_RMS;
    return intBitsToFloat(i);
}

void main(void) {

    float distSq = dot(vUv, vUv); // Calculate squared distance from center (in the quad's coordinate system)
    if (distSq > 1.0) discard; // Discard fragments outside the circle inscribed in the quad

    // Calculate Gaussian function: alpha = opacity * exp(-distSq * factor)
    // The factor 4.0 corresponds to the original implementation's scaling.
    // factor = 1 / (2 * sigma^2), where sigma controls the spread.
    // Using 4.0 implies sigma^2 = 1/8.
    float alpha = fastExp(-distSq * 4.0) * vColor.a;

    if (alpha < 1.0 / 255.0) discard; // Discard fragments with very low alpha

    // Premultiply color by alpha (required for correct blending)
    fragColor = vec4(vColor.rgb * alpha, alpha);
}
`
);
class rt extends c.ShaderMaterial {
  constructor(t = {}) {
    const s = {
      // Packed Textures
      packedGeometry: { value: null },
      // RGBA32UI: .r=MeansLow, .g=MeansHigh, .b=Quats, .a=Scales
      packedColor: { value: null },
      // RGBA8: .rgb=Color, .a=Opacity
      splatOrder: { value: null },
      // Index map
      // Decompression Ranges
      meansMin: { value: new c.Vector3() },
      meansMax: { value: new c.Vector3() },
      scalesMin: { value: new c.Vector3() },
      scalesMax: { value: new c.Vector3() },
      sh0Min: { value: new c.Vector3() },
      sh0Max: { value: new c.Vector3() },
      // Render State
      texWidth: { value: 0 },
      viewport: { value: new c.Vector2(1, 1) },
      numSplats: { value: 0 },
      // Animation State
      animationProgress: { value: 1 },
      // 1 = no animation active
      animationCenter: { value: new c.Vector3() }
    };
    super({
      uniforms: s,
      vertexShader: Ve,
      fragmentShader: at,
      transparent: !0,
      glslVersion: c.GLSL3,
      blendSrc: c.OneFactor,
      blendSrcAlpha: c.OneFactor,
      blending: c.CustomBlending,
      blendEquation: c.AddEquation,
      blendEquationAlpha: c.AddEquation,
      blendDst: c.OneMinusSrcAlphaFactor,
      blendDstAlpha: c.OneMinusSrcAlphaFactor,
      depthTest: !0,
      depthWrite: !1,
      side: c.DoubleSide,
      alphaTest: t.alphaTest ?? 0,
      toneMapped: t.toneMapped ?? !1
    });
    d(this, "_shaderTemplate");
    t.alphaHash && (this.alphaHash = !0, this.depthWrite = !0, this.blending = c.NoBlending), this._shaderTemplate = Ve;
  }
  setTexWidth(t) {
    this.uniforms.texWidth.value = t | 0;
  }
  /**
   * Update the viewport size
   * @param width Viewport width
   * @param height Viewport height
   */
  updateViewport(t, s) {
    this.uniforms.viewport.value.set(t, s);
  }
  /**
   * Set the main packed geometry texture (RGBA32UI)
   */
  setPackedGeometry(t) {
    this.uniforms.packedGeometry.value = t;
  }
  /**
   * Set the packed color texture (RGBA8)
   */
  setPackedColor(t) {
    this.uniforms.packedColor.value = t;
  }
  /**
   * Set order texture for sorting
   */
  setOrderTexture(t) {
    this.uniforms.splatOrder.value = t;
  }
  /**
   * Set the ranges needed to decompress the packed floats
   */
  setRanges(t) {
    this.uniforms.meansMin.value.copy(t.means.min), this.uniforms.meansMax.value.copy(t.means.max), this.uniforms.scalesMin.value.copy(t.scales.min), this.uniforms.scalesMax.value.copy(t.scales.max), this.uniforms.sh0Min.value.copy(t.sh0.min), this.uniforms.sh0Max.value.copy(t.sh0.max);
  }
  /**
   * Set number of splats to render
   * @param count Number of splats
   */
  setNumSplats(t) {
    this.uniforms.numSplats.value = t;
  }
  /**
   * Configure animation effect. Rebuilds shader with effect's GLSL code.
   * @param effect - Animation effect to use (null to disable)
   */
  setAnimation(t) {
    let s = this._shaderTemplate;
    t && t.type !== "none" ? (s = s.replace(
      "/* @ANIMATION_CODE */",
      t.shaderCode
    ), s = s.replace(
      "/* @ANIMATION_CALL */",
      `if (animationProgress < 1.0) {
    applyAnimation(modelCenter, scale, clr, animationProgress, animationCenter);
}`
    )) : (s = s.replace("/* @ANIMATION_CODE */", ""), s = s.replace("/* @ANIMATION_CALL */", "")), this.vertexShader = s, this.needsUpdate = !0;
  }
  /**
   * Set animation progress (0 = start, 1 = complete/no animation)
   */
  setAnimationProgress(t) {
    this.uniforms.animationProgress.value = t;
  }
  /**
   * Set animation center point
   */
  setAnimationCenter(t) {
    this.uniforms.animationCenter.value.copy(t);
  }
}
const xe = class xe extends c.Mesh {
  // Match shader constant
  /**
   * Create a new SplatMesh for rendering Gaussian splats
   * @param splatData The splat data to render
   * @param options Rendering options
   */
  constructor(t, s = {}) {
    const n = new rt(s), r = xe.createInstancedGeometry(t.numSplats, xe.INSTANCE_SIZE);
    super(r, n);
    d(this, "sorter");
    d(this, "options");
    d(this, "splatData");
    d(this, "textureManager");
    /** Animation controller (null if no animation configured) */
    d(this, "animation", null);
    d(this, "material");
    d(this, "geometry");
    d(this, "lastCameraPositionLocal", new c.Vector3());
    d(this, "lastCameraDirectionLocal", new c.Vector3());
    d(this, "invModelMatrix", new c.Matrix4());
    // Cached inverse matrix
    d(this, "_vpW", -1);
    d(this, "_vpH", -1);
    d(this, "_size", new c.Vector2());
    d(this, "_camPosW", new c.Vector3());
    d(this, "_camDirW", new c.Vector3());
    d(this, "_camPosL", new c.Vector3());
    d(this, "_camDirL", new c.Vector3());
    d(this, "onSorterUpdated", (t) => {
      const s = t.count;
      this.geometry.instanceCount = Math.ceil(s / xe.INSTANCE_SIZE), this.material.setNumSplats(s);
    });
    this.geometry = r, this.material = n, this.options = { autoSort: !0, ...s }, this.splatData = t, this.frustumCulled = !1, this.sorter = new Qe(), this.textureManager = new nt(t);
    let i = this.createChunks() || void 0;
    if (i === null && console.warn("Visus: Could not create sorter chunks, bounding box might be invalid."), i = void 0, this.sorter.addEventListener("updated", this.onSorterUpdated), this.sorter.init(this.textureManager.orderTexture, this.splatData.centers, i ?? void 0, !this.options.keepSplatData), this.material.setRanges(t.ranges), this.material.setTexWidth(t.textureWidth), this.material.setPackedColor(this.textureManager.packedColor), this.material.setOrderTexture(this.textureManager.orderTexture), this.material.setPackedGeometry(this.textureManager.packedGeometry), this.material.setNumSplats(0), s.animation && s.animation.type !== "none") {
      this.animation = new st(s.animation);
      const o = new c.Vector3();
      t.boundingBox.toBox3().getCenter(o), this.animation.setCenter(o);
      const m = Le(s.animation.type);
      this.material.setAnimation(m), this.material.setAnimationCenter(o), this.material.setAnimationProgress(0);
    }
    this.geometry.boundingBox = t.boundingBox.toBox3(), this.geometry.boundingSphere = new c.Sphere(), this.geometry.boundingBox.getBoundingSphere(this.geometry.boundingSphere), this.options.keepSplatData || (this.splatData = null);
  }
  /**
   * Creates the instanced geometry for rendering splats.
   * @param totalSplats Total number of splats in the data.
   * @param instanceSize Number of splats per instance.
   * @returns InstancedBufferGeometry
   */
  static createInstancedGeometry(t, s) {
    const n = Math.ceil(t / s), r = new c.BufferGeometry(), i = new Float32Array([
      // x, y, splat_index_in_instance
      -1,
      -1,
      0,
      1,
      -1,
      0,
      1,
      1,
      0,
      -1,
      1,
      0
    ]), o = new Uint16Array([0, 1, 2, 0, 2, 3]), m = new Float32Array(4 * 3 * s);
    for (let h = 0; h < s; h++) {
      const f = h * 4 * 3;
      for (let w = 0; w < 4; w++)
        m[f + w * 3 + 0] = i[w * 3 + 0], m[f + w * 3 + 1] = i[w * 3 + 1], m[f + w * 3 + 2] = h;
    }
    const y = new Uint32Array(6 * s);
    for (let h = 0; h < s; h++) {
      const f = h * 6, w = h * 4;
      y[f + 0] = o[0] + w, y[f + 1] = o[1] + w, y[f + 2] = o[2] + w, y[f + 3] = o[3] + w, y[f + 4] = o[4] + w, y[f + 5] = o[5] + w;
    }
    r.setAttribute("position", new c.BufferAttribute(m, 3)), r.setIndex(new c.BufferAttribute(y, 1));
    const u = new c.InstancedBufferGeometry();
    u.index = r.index, u.setAttribute("position", r.getAttribute("position"));
    const l = new Uint32Array(n);
    for (let h = 0; h < n; h++)
      l[h] = h * s;
    return u.setAttribute("splatInstanceIndex", new c.InstancedBufferAttribute(l, 1, !1)), u.instanceCount = 0, u;
  }
  /**
   * Create chunks data (bounding box min/max) for the sorter.
   * @returns Float32Array containing chunk data [minX, minY, minZ, maxX, maxY, maxZ] or null.
   */
  createChunks() {
    if (!this.splatData)
      return null;
    const t = this.splatData.boundingBox;
    return t.min.x === 1 / 0 || t.max.x === -1 / 0 ? null : new Float32Array([
      t.min.x,
      t.min.y,
      t.min.z,
      t.max.x,
      t.max.y,
      t.max.z
    ]);
  }
  /**
   * Update the viewport size
   * @param width Viewport width
   * @param height Viewport height
   */
  updateViewport(t, s) {
    t === this._vpW && s === this._vpH || (this._vpW = t, this._vpH = s, this.material.updateViewport(t, s));
  }
  /**
   * Sorts splats based on camera position and direction.
   * @param camera The camera to sort against.
   */
  sort(t) {
    t.getWorldPosition(this._camPosW), t.getWorldDirection(this._camDirW), this.invModelMatrix.copy(this.matrixWorld).invert(), this._camPosL.copy(this._camPosW).applyMatrix4(this.invModelMatrix), this._camDirL.copy(this._camDirW).transformDirection(this.invModelMatrix);
    const s = this.lastCameraPositionLocal.distanceToSquared(this._camPosL) > 1e-6, n = this.lastCameraDirectionLocal.dot(this._camDirL) < 0.999;
    this.options.autoSort && (s || n) && (this.lastCameraPositionLocal.copy(this._camPosL), this.lastCameraDirectionLocal.copy(this._camDirL), this.sorter.setCamera(this._camPosL, this._camDirL));
  }
  /**
   * THREE.js hook called before rendering the object.
   * Used here to trigger sorting and update viewport.
   * @param renderer The renderer
   * @param scene The scene
   * @param camera The camera
   */
  // prettier-ignore
  // @ts-expect-error scene is not used
  onBeforeRender(t, s, n) {
    if (this.sort(n), t.getSize(this._size), this.updateViewport(this._size.x, this._size.y), this.animation) {
      if (!this.animation.isPlaying && this.animation.shouldAutoPlay()) return this.animation.play();
      if (!this.animation.isPlaying || this.animation.isComplete) return;
      const r = performance.now() / 1e3;
      this.animation.update(r) && this.material.setAnimationProgress(this.animation.progress);
    }
  }
  /**
   * Dispose of resources
   */
  dispose() {
    this.sorter.removeEventListener("updated", this.onSorterUpdated), this.sorter.dispose(), this.geometry.dispose(), this.material.dispose(), this.textureManager.dispose();
  }
};
/** Number of splats combined into a single instanced draw call. */
d(xe, "INSTANCE_SIZE", 128);
let Re = xe;
const fe = 0.28209479177387814;
class ge {
  /**
   * Packs PLY data (Float32) into the Unified SOGS-like Format.
   */
  // prettier-ignore
  static packPly(e) {
    const t = e.numSplats, s = Math.ceil(Math.sqrt(t)), n = Math.ceil(t / s), r = s * n, { ranges: i, colorScale: o } = this.calculatePlyRanges(e), m = new Uint32Array(r * 4), y = new Uint8Array(r * 4), u = new c.Quaternion();
    for (let l = 0; l < t; l++) {
      const h = l * 4, f = l * 3, w = l * 4, A = e.positions[f + 0], b = e.positions[f + 1], B = e.positions[f + 2], T = this.clamp01(this.norm(A, i.means.min.x, i.means.max.x)), E = this.clamp01(this.norm(b, i.means.min.y, i.means.max.y)), U = this.clamp01(this.norm(B, i.means.min.z, i.means.max.z)), R = T * 65535 | 0, C = E * 65535 | 0, M = U * 65535 | 0;
      m[h + 0] = this.pack4Bytes(R & 255, C & 255, M & 255, 0), m[h + 1] = this.pack4Bytes(R >> 8, C >> 8, M >> 8, 0), u.set(e.rotations[w], e.rotations[w + 1], e.rotations[w + 2], e.rotations[w + 3]).normalize();
      let k = u.w, S = u.x, g = u.y, v = u.z;
      const O = Math.abs(k), V = Math.abs(S), I = Math.abs(g), q = Math.abs(v);
      let p = 0, _ = O;
      V > _ && (_ = V, p = 1), I > _ && (_ = I, p = 2), q > _ && (_ = q, p = 3), (p === 0 ? k : p === 1 ? S : p === 2 ? g : v) < 0 && (k = -k, S = -S, g = -g, v = -v);
      let W = 0, F = 0, J = 0;
      p === 0 && (W = S, F = g, J = v), p === 1 && (W = k, F = g, J = v), p === 2 && (W = k, F = S, J = v), p === 3 && (W = k, F = S, J = g);
      const Z = (te) => Math.min(255, Math.max(0, Math.round((0.5 + te / Math.SQRT2) * 255)));
      m[h + 2] = this.pack4Bytes(Z(W), Z(F), Z(J), p);
      const Y = this.norm(e.scales[f + 0], i.scales.min.x, i.scales.max.x), z = this.norm(e.scales[f + 1], i.scales.min.y, i.scales.max.y), x = this.norm(e.scales[f + 2], i.scales.min.z, i.scales.max.z);
      m[h + 3] = this.pack4Bytes(Math.floor(Y * 255), Math.floor(z * 255), Math.floor(x * 255), 0);
      const D = this.clamp01(e.colors[f + 0] * o), L = this.clamp01(e.colors[f + 1] * o), P = this.clamp01(e.colors[f + 2] * o), G = (D - 0.5) / fe, X = (L - 0.5) / fe, j = (P - 0.5) / fe, Q = this.clamp01(this.norm(G, i.sh0.min.x, i.sh0.max.x)), $ = this.clamp01(this.norm(X, i.sh0.min.y, i.sh0.max.y)), K = this.clamp01(this.norm(j, i.sh0.min.z, i.sh0.max.z)), ee = this.clamp01(e.opacities[l]);
      y[h + 0] = Math.round(Q * 255), y[h + 1] = Math.round($ * 255), y[h + 2] = Math.round(K * 255), y[h + 3] = Math.round(ee * 255);
    }
    return new Ae(t, s, n, e.positions, m, y, i, e.boundingBox);
  }
  /**
   * Packs SOGS data.
   * Interleaves the separate textures into the Unified RGBA32UI buffer.
   * Decodes centers for sorting.
   */
  // prettier-ignore
  static packSogs(e) {
    var g, v, O;
    const t = e.numSplats;
    let s = Math.ceil(Math.sqrt(t)), n = Math.ceil(t / s);
    const r = ((g = e.means_l) == null ? void 0 : g.image) ?? ((v = e.sh0) == null ? void 0 : v.image) ?? ((O = e.quats) == null ? void 0 : O.image);
    r && typeof r.width == "number" && typeof r.height == "number" && (s = r.width, n = r.height);
    const i = s * n;
    if (i < t) throw new Error(`SOG v1 texture too small: ${s}x${n}=${i} < count=${t}`);
    const o = this.convertSogsRanges(e.ranges), m = e.ranges.means.mins[0], y = e.ranges.means.mins[1], u = e.ranges.means.mins[2], l = e.ranges.means.maxs[0], h = e.ranges.means.maxs[1], f = e.ranges.means.maxs[2], w = (V) => Math.sign(V) * (Math.exp(Math.abs(V)) - 1), A = new c.Vector3(
      w(m),
      w(y),
      w(u)
    ), b = new c.Vector3(
      w(l),
      w(h),
      w(f)
    );
    o.means.min.copy(A), o.means.max.copy(b);
    const B = e, T = this.getPixels(B.means_l), E = this.getPixels(B.means_u), U = this.getPixels(B.quats), R = this.getPixels(B.scales), C = this.getPixels(B.sh0), M = new Uint32Array(i * 4), k = new Uint8Array(i * 4), S = new Float32Array(t * 3);
    for (let V = 0; V < t; V++) {
      const I = V * 4, q = E[I + 0], p = T[I + 0], _ = E[I + 1], H = T[I + 1], W = E[I + 2], F = T[I + 2], J = (q << 8 | p) / 65535, Z = (_ << 8 | H) / 65535, Y = (W << 8 | F) / 65535, z = this.sogsDecode(J, m, l), x = this.sogsDecode(Z, y, h), D = this.sogsDecode(Y, u, f);
      S[V * 3 + 0] = z, S[V * 3 + 1] = x, S[V * 3 + 2] = D;
      const L = this.clamp01(this.norm(z, A.x, b.x)) * 65535 | 0, P = this.clamp01(this.norm(x, A.y, b.y)) * 65535 | 0, G = this.clamp01(this.norm(D, A.z, b.z)) * 65535 | 0;
      M[I + 0] = this.pack4Bytes(L & 255, P & 255, G & 255, 0), M[I + 1] = this.pack4Bytes(L >> 8, P >> 8, G >> 8, 0), M[I + 3] = this.pack4Bytes(R[I], R[I + 1], R[I + 2], 0);
      const j = U[I + 3] - 252;
      M[I + 2] = this.pack4Bytes(U[I + 0], U[I + 1], U[I + 2], j), k[I + 0] = C[I], k[I + 1] = C[I + 1], k[I + 2] = C[I + 2];
      const Q = C[I + 3] / 255, $ = e.ranges.sh0.mins[3] + (e.ranges.sh0.maxs[3] - e.ranges.sh0.mins[3]) * Q, K = 1 / (1 + Math.exp(-$));
      k[I + 3] = Math.round(Math.max(0, Math.min(1, K)) * 255);
    }
    return new Ae(t, s, n, S, M, k, o, e.boundingBox);
  }
  /**
   * Packs SOG V2 data.
   */
  static packSog2(e) {
    var O, V, I;
    const t = e.numSplats;
    let s = Math.ceil(Math.sqrt(t)), n = Math.ceil(t / s);
    const r = ((O = e.means_l) == null ? void 0 : O.image) ?? ((V = e.sh0) == null ? void 0 : V.image) ?? ((I = e.quats) == null ? void 0 : I.image);
    r && typeof r.width == "number" && typeof r.height == "number" && (s = r.width, n = r.height);
    const i = s * n;
    if (i < t) throw new Error(`SOG v2 texture too small: ${s}x${n}=${i} < count=${t}`);
    const o = e.ranges.means.mins[0], m = e.ranges.means.mins[1], y = e.ranges.means.mins[2], u = e.ranges.means.maxs[0], l = e.ranges.means.maxs[1], h = e.ranges.means.maxs[2], f = (q) => Math.sign(q) * (Math.exp(Math.abs(q)) - 1), w = new c.Vector3(
      f(o),
      f(m),
      f(y)
    ), A = new c.Vector3(
      f(u),
      f(l),
      f(h)
    ), b = (q) => {
      let p = 1 / 0, _ = -1 / 0;
      for (const F of q)
        Number.isFinite(F) && (p = Math.min(p, F), _ = Math.max(_, F));
      (!Number.isFinite(p) || !Number.isFinite(_)) && (p = 0, _ = 1);
      const H = _ - p || 1, W = new Uint8Array(256);
      for (let F = 0; F < 256; F++) {
        const Z = ((F < q.length && Number.isFinite(q[F]) ? q[F] : p + (_ - p) * (F / 255)) - p) / H, Y = Math.max(0, Math.min(255, Math.round(Z * 255)));
        W[F] = Y;
      }
      return { cbMin: p, cbMax: _, lut: W };
    }, B = b(e.ranges.scales.codebook), T = b(e.ranges.sh0.codebook), E = {
      means: { min: w.clone(), max: A.clone() },
      scales: {
        min: new c.Vector3(
          B.cbMin,
          B.cbMin,
          B.cbMin
        ),
        max: new c.Vector3(
          B.cbMax,
          B.cbMax,
          B.cbMax
        )
      },
      sh0: {
        min: new c.Vector3(
          T.cbMin,
          T.cbMin,
          T.cbMin
        ),
        max: new c.Vector3(
          T.cbMax,
          T.cbMax,
          T.cbMax
        )
      }
    }, U = this.getPixels(e.means_l), R = this.getPixels(e.means_u), C = this.getPixels(e.quats), M = this.getPixels(e.scales), k = this.getPixels(e.sh0), S = new Uint32Array(i * 4), g = new Uint8Array(i * 4), v = new Float32Array(t * 3);
    for (let q = 0; q < t; q++) {
      const p = q * 4, _ = R[p + 0], H = U[p + 0], W = R[p + 1], F = U[p + 1], J = R[p + 2], Z = U[p + 2], Y = (_ << 8 | H) / 65535, z = (W << 8 | F) / 65535, x = (J << 8 | Z) / 65535, D = this.sogsDecode(Y, o, u), L = this.sogsDecode(z, m, l), P = this.sogsDecode(x, y, h);
      v[q * 3 + 0] = D, v[q * 3 + 1] = L, v[q * 3 + 2] = P;
      const G = this.clamp01(this.norm(D, w.x, A.x)) * 65535 | 0, X = this.clamp01(this.norm(L, w.y, A.y)) * 65535 | 0, j = this.clamp01(this.norm(P, w.z, A.z)) * 65535 | 0;
      S[p + 0] = this.pack4Bytes(G & 255, X & 255, j & 255, 0), S[p + 1] = this.pack4Bytes(G >> 8, X >> 8, j >> 8, 0);
      const $ = C[p + 3] - 252 & 3;
      S[p + 2] = this.pack4Bytes(C[p + 0], C[p + 1], C[p + 2], $);
      const K = B.lut[M[p + 0]], ee = B.lut[M[p + 1]], te = B.lut[M[p + 2]];
      S[p + 3] = this.pack4Bytes(K, ee, te, 0), g[p + 0] = T.lut[k[p + 0]], g[p + 1] = T.lut[k[p + 1]], g[p + 2] = T.lut[k[p + 2]], g[p + 3] = k[p + 3];
    }
    return new Ae(t, s, n, v, S, g, E, e.boundingBox);
  }
  // --- Helpers ---
  // prettier-ignore
  static pack4Bytes(e, t, s, n) {
    return (e & 255) << 24 | (t & 255) << 16 | (s & 255) << 8 | n & 255;
  }
  // prettier-ignore
  static getPixels(e) {
    const t = e.image, s = t.width, n = t.height;
    if (t.data && (t.data instanceof Uint8Array || t.data instanceof Uint8ClampedArray)) return new Uint8Array(t.data);
    const r = document.createElement("canvas");
    r.width = s, r.height = n;
    const i = r.getContext("2d", { willReadFrequently: !0 });
    if (!i) throw new Error("Canvas init failed");
    return i.drawImage(t, 0, 0), new Uint8Array(i.getImageData(0, 0, s, n).data);
  }
  static convertSogsRanges(e) {
    const t = (s) => new c.Vector3(s[0], s[1], s[2]);
    return {
      sh0: { min: t(e.sh0.mins), max: t(e.sh0.maxs) },
      means: { min: t(e.means.mins), max: t(e.means.maxs) },
      scales: { min: t(e.scales.mins), max: t(e.scales.maxs) }
    };
  }
  static calculatePlyRanges(e) {
    const t = new c.Vector3(1 / 0, 1 / 0, 1 / 0), s = new c.Vector3(-1 / 0, -1 / 0, -1 / 0), n = new c.Vector3(1 / 0, 1 / 0, 1 / 0), r = new c.Vector3(-1 / 0, -1 / 0, -1 / 0), i = new c.Vector3(1 / 0, 1 / 0, 1 / 0), o = new c.Vector3(-1 / 0, -1 / 0, -1 / 0);
    let m = 0;
    for (let u = 0; u < e.numSplats; u++) {
      const l = u * 3, h = e.positions[l + 0], f = e.positions[l + 1], w = e.positions[l + 2];
      t.x = Math.min(t.x, h), s.x = Math.max(s.x, h), t.y = Math.min(t.y, f), s.y = Math.max(s.y, f), t.z = Math.min(t.z, w), s.z = Math.max(s.z, w), n.x = Math.min(n.x, e.scales[l]), r.x = Math.max(r.x, e.scales[l]), n.y = Math.min(n.y, e.scales[l + 1]), r.y = Math.max(r.y, e.scales[l + 1]), n.z = Math.min(n.z, e.scales[l + 2]), r.z = Math.max(r.z, e.scales[l + 2]), m = Math.max(
        m,
        e.colors[l],
        e.colors[l + 1],
        e.colors[l + 2]
      );
    }
    const y = m > 1.5 ? 1 / 255 : 1;
    for (let u = 0; u < e.numSplats; u++) {
      const l = u * 3, h = this.clamp01(e.colors[l + 0] * y), f = this.clamp01(e.colors[l + 1] * y), w = this.clamp01(e.colors[l + 2] * y), A = (h - 0.5) / fe, b = (f - 0.5) / fe, B = (w - 0.5) / fe;
      i.x = Math.min(i.x, A), o.x = Math.max(o.x, A), i.y = Math.min(i.y, b), o.y = Math.max(o.y, b), i.z = Math.min(i.z, B), o.z = Math.max(o.z, B);
    }
    return {
      colorScale: y,
      ranges: {
        sh0: { min: i, max: o },
        means: { min: t, max: s },
        scales: { min: n, max: r }
      }
    };
  }
  static clamp01(e) {
    return Math.max(0, Math.min(1, e));
  }
  // prettier-ignore
  // private static lerp(a: number, b: number, t: number) { return a + (b - a) * t; } // prettier-ignore
  // private static invSogsMap(v: number) { return Math.sign(v) * Math.log(Math.abs(v) + 1) } // prettier-ignore
  static norm(e, t, s) {
    return (e - t) / (s - t || 1);
  }
  // prettier-ignore
  static sogsDecode(e, t, s) {
    const n = t + (s - t) * e;
    return Math.sign(n) * (Math.exp(Math.abs(n)) - 1);
  }
}
class kt extends c.Loader {
  constructor(t, s) {
    super(t);
    d(this, "requestId", 0);
    d(this, "worker");
    d(this, "pendingCallbacks", /* @__PURE__ */ new Map());
    this.withCredentials = (s == null ? void 0 : s.withCredentials) ?? !1;
    const n = this.createWorkerCode(), r = new Blob([n], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(r)), this.worker.onmessage = this.onWorkerMessage.bind(this);
  }
  /**
   * Handles messages received from the parsing worker
   * @param event The message event from the worker
   */
  onWorkerMessage(t) {
    const { requestId: s, error: n, result: r } = t.data, i = this.pendingCallbacks.get(s);
    if (!i) return console.warn(`PlyLoader: Received response for unknown request ${s}`);
    if (this.pendingCallbacks.delete(s), n) return i.reject(new Error(n));
    if (!r) return i.reject(new Error("Worker returned no result"));
    try {
      const o = new Xe(0);
      o.numSplats = r.numSplats, o.positions = new Float32Array(r.positions), o.rotations = new Float32Array(r.rotations), o.scales = new Float32Array(r.scales), o.colors = new Float32Array(r.colors), o.opacities = new Float32Array(r.opacities), o.boundingBox.min.set(
        r.boundingBox.minX,
        r.boundingBox.minY,
        r.boundingBox.minZ
      ), o.boundingBox.max.set(
        r.boundingBox.maxX,
        r.boundingBox.maxY,
        r.boundingBox.maxZ
      ), this.worker.terminate();
      const m = ge.packPly(o);
      o.dispose(), i.resolve(m);
    } catch (o) {
      i.reject(o);
    }
  }
  /**
   * Load a PLY file with Gaussian Splat data
   * @param url URL of the PLY file
   * @param onLoad Optional callback when loading is complete
   * @param onProgress Optional progress callback
   * @param onError Optional error callback
   */
  load(t, s, n, r) {
    const i = new c.FileLoader(this.manager);
    i.setResponseType("arraybuffer"), i.setRequestHeader(this.requestHeader), i.setPath(this.path), i.setWithCredentials(this.withCredentials), i.load(
      t,
      (o) => {
        this.parseAsync(o).then((m) => {
          s && s(m);
        }).catch((m) => {
          r ? r(m) : console.error(m), this.manager.itemError(t);
        });
      },
      n,
      r
    );
  }
  /**
   * Load a PLY file asynchronously and return a Promise
   * @param url URL of the PLY file
   * @param onProgress Optional progress callback
   * @returns A Promise that resolves with the parsed SplatData
   */
  loadAsync(t, s) {
    return new Promise((n, r) => {
      const i = new c.FileLoader(this.manager);
      i.setResponseType("arraybuffer"), i.setRequestHeader(this.requestHeader), i.setPath(this.path), i.setWithCredentials(this.withCredentials), i.load(
        t,
        (o) => {
          this.parseAsync(o).then(n).catch((m) => {
            r(m), this.manager.itemError(t);
          });
        },
        s,
        (o) => {
          r(o), this.manager.itemError(t);
        }
      );
    });
  }
  /**
   * Parse PLY buffer data asynchronously using Web Worker
   * @param buffer ArrayBuffer containing PLY data
   * @returns Promise that resolves with parsed SplatData
   */
  parseAsync(t) {
    return new Promise((s, n) => {
      const r = this.requestId++;
      this.pendingCallbacks.set(r, { resolve: s, reject: n });
      const i = {
        requestId: r,
        buffer: t
      };
      this.worker.postMessage(i, [t]);
    });
  }
  /**
   * Terminate the Web Worker and clean up resources
   */
  dispose() {
    this.worker && this.worker.terminate(), this.pendingCallbacks.clear();
  }
  /**
   * Creates the self-contained code for the parsing Web Worker
   * @returns A string containing the JavaScript code for the worker
   */
  createWorkerCode() {
    return `(${(function() {
      self.onmessage = (n) => {
        const { requestId: r, buffer: i } = n.data;
        try {
          const o = s(i), m = {
            requestId: r,
            result: o
          };
          self.postMessage(m, [
            o.positions,
            o.rotations,
            o.scales,
            o.colors,
            o.opacities
          ]);
        } catch (o) {
          const m = {
            requestId: r,
            error: o instanceof Error ? o.message : String(o)
          };
          self.postMessage(m);
        }
      };
      function s(n) {
        const r = new TextDecoder(), i = new Uint8Array(n), o = [112, 108, 121, 10], m = `
end_header
`;
        for (let z = 0; z < o.length; z++)
          if (i[z] !== o[z])
            throw new Error(
              "Invalid PLY file: Missing magic bytes"
            );
        let y = 0;
        for (let z = 0; z < i.length - m.length; z++) {
          let x = !0;
          for (let D = 0; D < m.length; D++)
            if (i[z + D] !== m.charCodeAt(D)) {
              x = !1;
              break;
            }
          if (x) {
            y = z + m.length;
            break;
          }
        }
        if (y === 0)
          throw new Error(
            "Invalid PLY file: Could not find end of header"
          );
        const l = r.decode(
          i.subarray(0, y)
        ).split(`
`), h = [];
        let f = null;
        for (let z = 1; z < l.length; z++) {
          const x = l[z].trim();
          if (x === "" || x === "end_header") continue;
          const D = x.split(" ");
          switch (D[0]) {
            case "format":
              f = D[1];
              break;
            case "element":
              h.push({
                name: D[1],
                count: parseInt(D[2], 10),
                properties: []
              });
              break;
            case "property":
              if (h.length === 0)
                throw new Error(
                  "Invalid PLY file: Property without element"
                );
              h[h.length - 1].properties.push({
                type: D[1],
                name: D[2]
              });
              break;
          }
        }
        if (f !== "binary_little_endian")
          throw new Error(`Unsupported PLY format: ${f}`);
        const w = h.find((z) => z.name === "vertex");
        if (!w)
          throw new Error(
            "Invalid PLY file: No vertex element found"
          );
        const A = w.count, b = new Float32Array(A * 3), B = new Float32Array(A * 4), T = new Float32Array(A * 3), E = new Float32Array(A * 3), U = new Float32Array(A), R = new DataView(n);
        let C = y;
        const M = (z) => w.properties.findIndex(
          (x) => x.name === z
        ), k = M("x"), S = M("y"), g = M("z"), v = [
          M("rot_0"),
          M("rot_1"),
          M("rot_2"),
          M("rot_3")
        ], O = [
          M("scale_0"),
          M("scale_1"),
          M("scale_2")
        ], V = [
          M("f_dc_0"),
          M("f_dc_1"),
          M("f_dc_2")
        ], I = M("opacity");
        if ([
          k,
          S,
          g,
          ...v,
          ...O,
          ...V,
          I
        ].some((z) => z === -1))
          throw new Error(
            "Invalid PLY file: Missing required properties"
          );
        const p = 0.28209479177387814, _ = (z) => {
          if (z > 0) return 1 / (1 + Math.exp(-z));
          const x = Math.exp(z);
          return x / (1 + x);
        };
        let H = 1 / 0, W = 1 / 0, F = 1 / 0, J = -1 / 0, Z = -1 / 0, Y = -1 / 0;
        for (let z = 0; z < A; z++) {
          const x = [];
          for (let Se = 0; Se < w.properties.length; Se++) {
            const Pe = w.properties[Se].type;
            let ce;
            switch (Pe) {
              case "char":
                ce = R.getInt8(C), C += 1;
                break;
              case "uchar":
                ce = R.getUint8(C), C += 1;
                break;
              case "short":
                ce = R.getInt16(C, !0), C += 2;
                break;
              case "ushort":
                ce = R.getUint16(C, !0), C += 2;
                break;
              case "int":
                ce = R.getInt32(C, !0), C += 4;
                break;
              case "uint":
                ce = R.getUint32(C, !0), C += 4;
                break;
              case "float":
                ce = R.getFloat32(C, !0), C += 4;
                break;
              case "double":
                ce = R.getFloat64(C, !0), C += 8;
                break;
              default:
                throw new Error(
                  `Unsupported property type: ${Pe}`
                );
            }
            x.push(ce);
          }
          const D = x[k], L = x[S], P = x[g], G = z * 3;
          b[G] = D, b[G + 1] = L, b[G + 2] = P, H = Math.min(H, D), W = Math.min(W, L), F = Math.min(F, P), J = Math.max(J, D), Z = Math.max(Z, L), Y = Math.max(Y, P);
          let X = x[v[1]], j = x[v[2]], Q = x[v[3]], $ = x[v[0]];
          const K = Math.sqrt(
            X * X + j * j + Q * Q + $ * $
          );
          K > 0 && (X /= K, j /= K, Q /= K, $ /= K), $ < 0 && (X = -X, j = -j, Q = -Q, $ = -$);
          const ee = z * 4;
          B[ee] = X, B[ee + 1] = j, B[ee + 2] = Q, B[ee + 3] = $;
          const te = z * 3;
          T[te] = x[O[0]], T[te + 1] = x[O[1]], T[te + 2] = x[O[2]];
          let ue = 0.5 + x[V[0]] * p, de = 0.5 + x[V[1]] * p, ie = 0.5 + x[V[2]] * p;
          ue = Math.max(0, Math.min(1, ue)), de = Math.max(0, Math.min(1, de)), ie = Math.max(0, Math.min(1, ie));
          const be = z * 3;
          E[be] = ue, E[be + 1] = de, E[be + 2] = ie, U[z] = _(x[I]);
        }
        return {
          numSplats: A,
          positions: b.buffer,
          rotations: B.buffer,
          scales: T.buffer,
          colors: E.buffer,
          opacities: U.buffer,
          boundingBox: {
            minX: H,
            minY: W,
            minZ: F,
            maxX: J,
            maxY: Z,
            maxZ: Y
          }
        };
      }
    }).toString()})();`;
  }
}
var se = Uint8Array, pe = Uint16Array, it = Int32Array, Ge = new se([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), We = new se([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), ot = new se([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Ne = function(a, e) {
  for (var t = new pe(31), s = 0; s < 31; ++s)
    t[s] = e += 1 << a[s - 1];
  for (var n = new it(t[30]), s = 1; s < 30; ++s)
    for (var r = t[s]; r < t[s + 1]; ++r)
      n[r] = r - t[s] << 5 | s;
  return { b: t, r: n };
}, $e = Ne(Ge, 2), je = $e.b, ct = $e.r;
je[28] = 258, ct[258] = 28;
var lt = Ne(We, 0), ht = lt.b, Be = new pe(32768);
for (var N = 0; N < 32768; ++N) {
  var le = (N & 43690) >> 1 | (N & 21845) << 1;
  le = (le & 52428) >> 2 | (le & 13107) << 2, le = (le & 61680) >> 4 | (le & 3855) << 4, Be[N] = ((le & 65280) >> 8 | (le & 255) << 8) >> 1;
}
var ye = function(a, e, t) {
  for (var s = a.length, n = 0, r = new pe(e); n < s; ++n)
    a[n] && ++r[a[n] - 1];
  var i = new pe(e);
  for (n = 1; n < e; ++n)
    i[n] = i[n - 1] + r[n - 1] << 1;
  var o;
  if (t) {
    o = new pe(1 << e);
    var m = 15 - e;
    for (n = 0; n < s; ++n)
      if (a[n])
        for (var y = n << 4 | a[n], u = e - a[n], l = i[a[n] - 1]++ << u, h = l | (1 << u) - 1; l <= h; ++l)
          o[Be[l] >> m] = y;
  } else
    for (o = new pe(s), n = 0; n < s; ++n)
      a[n] && (o[n] = Be[i[a[n] - 1]++] >> 15 - a[n]);
  return o;
}, ve = new se(288);
for (var N = 0; N < 144; ++N)
  ve[N] = 8;
for (var N = 144; N < 256; ++N)
  ve[N] = 9;
for (var N = 256; N < 280; ++N)
  ve[N] = 7;
for (var N = 280; N < 288; ++N)
  ve[N] = 8;
var He = new se(32);
for (var N = 0; N < 32; ++N)
  He[N] = 5;
var mt = /* @__PURE__ */ ye(ve, 9, 1), ut = /* @__PURE__ */ ye(He, 5, 1), Ce = function(a) {
  for (var e = a[0], t = 1; t < a.length; ++t)
    a[t] > e && (e = a[t]);
  return e;
}, ae = function(a, e, t) {
  var s = e / 8 | 0;
  return (a[s] | a[s + 1] << 8) >> (e & 7) & t;
}, Ie = function(a, e) {
  var t = e / 8 | 0;
  return (a[t] | a[t + 1] << 8 | a[t + 2] << 16) >> (e & 7);
}, dt = function(a) {
  return (a + 7) / 8 | 0;
}, De = function(a, e, t) {
  return (e == null || e < 0) && (e = 0), (t == null || t > a.length) && (t = a.length), new se(a.subarray(e, t));
}, ft = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], ne = function(a, e, t) {
  var s = new Error(e || ft[a]);
  if (s.code = a, Error.captureStackTrace && Error.captureStackTrace(s, ne), !t)
    throw s;
  return s;
}, pt = function(a, e, t, s) {
  var n = a.length, r = s ? s.length : 0;
  if (!n || e.f && !e.l)
    return t || new se(0);
  var i = !t, o = i || e.i != 2, m = e.i;
  i && (t = new se(n * 3));
  var y = function(j) {
    var Q = t.length;
    if (j > Q) {
      var $ = new se(Math.max(Q * 2, j));
      $.set(t), t = $;
    }
  }, u = e.f || 0, l = e.p || 0, h = e.b || 0, f = e.l, w = e.d, A = e.m, b = e.n, B = n * 8;
  do {
    if (!f) {
      u = ae(a, l, 1);
      var T = ae(a, l + 1, 3);
      if (l += 3, T)
        if (T == 1)
          f = mt, w = ut, A = 9, b = 5;
        else if (T == 2) {
          var C = ae(a, l, 31) + 257, M = ae(a, l + 10, 15) + 4, k = C + ae(a, l + 5, 31) + 1;
          l += 14;
          for (var S = new se(k), g = new se(19), v = 0; v < M; ++v)
            g[ot[v]] = ae(a, l + v * 3, 7);
          l += M * 3;
          for (var O = Ce(g), V = (1 << O) - 1, I = ye(g, O, 1), v = 0; v < k; ) {
            var q = I[ae(a, l, V)];
            l += q & 15;
            var E = q >> 4;
            if (E < 16)
              S[v++] = E;
            else {
              var p = 0, _ = 0;
              for (E == 16 ? (_ = 3 + ae(a, l, 3), l += 2, p = S[v - 1]) : E == 17 ? (_ = 3 + ae(a, l, 7), l += 3) : E == 18 && (_ = 11 + ae(a, l, 127), l += 7); _--; )
                S[v++] = p;
            }
          }
          var H = S.subarray(0, C), W = S.subarray(C);
          A = Ce(H), b = Ce(W), f = ye(H, A, 1), w = ye(W, b, 1);
        } else
          ne(1);
      else {
        var E = dt(l) + 4, U = a[E - 4] | a[E - 3] << 8, R = E + U;
        if (R > n) {
          m && ne(0);
          break;
        }
        o && y(h + U), t.set(a.subarray(E, R), h), e.b = h += U, e.p = l = R * 8, e.f = u;
        continue;
      }
      if (l > B) {
        m && ne(0);
        break;
      }
    }
    o && y(h + 131072);
    for (var F = (1 << A) - 1, J = (1 << b) - 1, Z = l; ; Z = l) {
      var p = f[Ie(a, l) & F], Y = p >> 4;
      if (l += p & 15, l > B) {
        m && ne(0);
        break;
      }
      if (p || ne(2), Y < 256)
        t[h++] = Y;
      else if (Y == 256) {
        Z = l, f = null;
        break;
      } else {
        var z = Y - 254;
        if (Y > 264) {
          var v = Y - 257, x = Ge[v];
          z = ae(a, l, (1 << x) - 1) + je[v], l += x;
        }
        var D = w[Ie(a, l) & J], L = D >> 4;
        D || ne(3), l += D & 15;
        var W = ht[L];
        if (L > 3) {
          var x = We[L];
          W += Ie(a, l) & (1 << x) - 1, l += x;
        }
        if (l > B) {
          m && ne(0);
          break;
        }
        o && y(h + 131072);
        var P = h + z;
        if (h < W) {
          var G = r - W, X = Math.min(W, P);
          for (G + h < 0 && ne(3); h < X; ++h)
            t[h] = s[G + h];
        }
        for (; h < P; ++h)
          t[h] = t[h - W];
      }
    }
    e.l = f, e.p = Z, e.b = h, e.f = u, f && (u = 1, e.m = A, e.d = w, e.n = b);
  } while (!u);
  return h != t.length && i ? De(t, 0, h) : t.subarray(0, h);
}, xt = /* @__PURE__ */ new se(0), oe = function(a, e) {
  return a[e] | a[e + 1] << 8;
}, re = function(a, e) {
  return (a[e] | a[e + 1] << 8 | a[e + 2] << 16 | a[e + 3] << 24) >>> 0;
}, _e = function(a, e) {
  return re(a, e) + re(a, e + 4) * 4294967296;
};
function gt(a, e) {
  return pt(a, { i: 2 }, e && e.out, e && e.dictionary);
}
var ze = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), yt = 0;
try {
  ze.decode(xt, { stream: !0 }), yt = 1;
} catch {
}
var wt = function(a) {
  for (var e = "", t = 0; ; ) {
    var s = a[t++], n = (s > 127) + (s > 223) + (s > 239);
    if (t + n > a.length)
      return { s: e, r: De(a, t - 1) };
    n ? n == 3 ? (s = ((s & 15) << 18 | (a[t++] & 63) << 12 | (a[t++] & 63) << 6 | a[t++] & 63) - 65536, e += String.fromCharCode(55296 | s >> 10, 56320 | s & 1023)) : n & 1 ? e += String.fromCharCode((s & 31) << 6 | a[t++] & 63) : e += String.fromCharCode((s & 15) << 12 | (a[t++] & 63) << 6 | a[t++] & 63) : e += String.fromCharCode(s);
  }
};
function vt(a, e) {
  if (e) {
    for (var t = "", s = 0; s < a.length; s += 16384)
      t += String.fromCharCode.apply(null, a.subarray(s, s + 16384));
    return t;
  } else {
    if (ze)
      return ze.decode(a);
    var n = wt(a), r = n.s, t = n.r;
    return t.length && ne(8), r;
  }
}
var Mt = function(a, e) {
  return e + 30 + oe(a, e + 26) + oe(a, e + 28);
}, bt = function(a, e, t) {
  var s = oe(a, e + 28), n = vt(a.subarray(e + 46, e + 46 + s), !(oe(a, e + 8) & 2048)), r = e + 46 + s, i = re(a, e + 20), o = t && i == 4294967295 ? St(a, r) : [i, re(a, e + 24), re(a, e + 42)], m = o[0], y = o[1], u = o[2];
  return [oe(a, e + 10), m, y, n, r + oe(a, e + 30) + oe(a, e + 32), u];
}, St = function(a, e) {
  for (; oe(a, e) != 1; e += 4 + oe(a, e + 2))
    ;
  return [_e(a, e + 12), _e(a, e + 4), _e(a, e + 20)];
};
function At(a, e) {
  for (var t = {}, s = a.length - 22; re(a, s) != 101010256; --s)
    (!s || a.length - s > 65558) && ne(13);
  var n = oe(a, s + 8);
  if (!n)
    return {};
  var r = re(a, s + 16), i = r == 4294967295 || n == 65535;
  if (i) {
    var o = re(a, s - 12);
    i = re(a, o) == 101075792, i && (n = re(a, o + 32), r = re(a, o + 48));
  }
  for (var m = 0; m < n; ++m) {
    var y = bt(a, r, i), u = y[0], l = y[1], h = y[2], f = y[3], w = y[4], A = y[5], b = Mt(a, A);
    r = w, u ? u == 8 ? t[f] = gt(a.subarray(b, b + l), { out: new se(h) }) : ne(14, "unknown compression type " + u) : t[f] = De(a, b, b + l);
  }
  return t;
}
const Me = (a) => typeof a == "number" && Number.isFinite(a), he = (a, e) => {
  const t = a[e];
  if (typeof t != "object" || t === null)
    throw new Error(`Invalid SOG metadata section: ${e}`);
  return t;
}, me = (a, e) => {
  const t = a.files;
  if (!Array.isArray(t))
    throw new Error(`${e}.files is not an array`);
  if (!t.every((s) => typeof s == "string"))
    throw new Error(`${e}.files contains non-strings`);
  return t;
}, ke = (a, e) => {
  const t = a.mins, s = a.maxs;
  if (!Array.isArray(t) || t.length !== 3)
    throw new Error(`${e}.mins must be length-3`);
  if (!Array.isArray(s) || s.length !== 3)
    throw new Error(`${e}.maxs must be length-3`);
  if (![...t, ...s].every(Me))
    throw new Error(`${e}.mins/maxs must be finite numbers`);
  return {
    mins: [t[0], t[1], t[2]],
    maxs: [s[0], s[1], s[2]]
  };
}, Ct = (a, e) => {
  const t = a.mins, s = a.maxs;
  if (!Array.isArray(t) || t.length !== 4)
    throw new Error(`${e}.mins must be length-4`);
  if (!Array.isArray(s) || s.length !== 4)
    throw new Error(`${e}.maxs must be length-4`);
  if (![...t, ...s].every(Me))
    throw new Error(`${e}.mins/maxs must be finite numbers`);
  return {
    mins: [t[0], t[1], t[2], t[3]],
    maxs: [s[0], s[1], s[2], s[3]]
  };
}, Oe = (a, e) => {
  const t = a.codebook;
  if (!Array.isArray(t))
    throw new Error(`${e}.codebook is not an array`);
  if (!t.every(Me))
    throw new Error(`${e}.codebook contains non-finite numbers`);
  return t;
}, Ue = (a) => {
  if (typeof a != "object" || a === null) throw new Error("Invalid SOG metadata: not an object");
  const e = a, t = e.version ?? 1;
  if (t !== 1 && t !== 2) throw new Error(`Unsupported SOG version: ${String(t)}`);
  if (t === 1) {
    const u = he(e, "means"), l = he(e, "sh0"), h = he(e, "quats"), f = he(e, "scales"), w = typeof e.count == "number" && Number.isFinite(e.count) ? e.count : void 0, A = Array.isArray(u.shape) ? u.shape : void 0, b = A && typeof A[0] == "number" ? A[0] : void 0;
    if (w === void 0 && b === void 0) throw new Error("Invalid SOGS metadata: unable to determine splat count");
    if (w !== void 0 && b !== void 0 && w !== b) throw new Error("Inconsistent SOGS metadata: count does not match means.shape[0]");
    return {
      version: 1,
      numSplats: (w ?? b) | 0,
      files: {
        sh0: me(l, "sh0"),
        means: me(u, "means"),
        quats: me(h, "quats"),
        scales: me(f, "scales")
      },
      ranges: {
        sh0: Ct(l, "sh0"),
        means: ke(u, "means"),
        scales: ke(f, "scales")
      }
    };
  }
  const s = e.count;
  if (!Me(s)) throw new Error('Invalid SOG v2 metadata: missing/invalid "count"');
  const n = s | 0, r = he(e, "means"), i = he(e, "sh0"), o = he(e, "quats"), m = he(e, "scales");
  return {
    version: 2,
    numSplats: n,
    files: {
      sh0: me(i, "sh0"),
      means: me(r, "means"),
      quats: me(o, "quats"),
      scales: me(m, "scales")
    },
    ranges: {
      means: ke(r, "means"),
      sh0: { codebook: Oe(i, "sh0") },
      scales: { codebook: Oe(m, "scales") }
    },
    antialias: typeof e.antialias == "boolean" ? e.antialias : void 0
    // prettier-ignore
  };
};
class Bt extends c.Loader {
  constructor(e, t) {
    super(e), this.withCredentials = (t == null ? void 0 : t.withCredentials) ?? !1;
  }
  /**
   * Detect if a buffer is a ZIP file by checking magic bytes
   * ZIP files start with signature: PK\x03\x04 (0x50 0x4B 0x03 0x04)
   */
  isZipBuffer(e) {
    if (e.byteLength < 4) return !1;
    const t = new Uint8Array(e, 0, 4);
    return t[0] === 80 && t[1] === 75 && t[2] === 3 && t[3] === 4;
  }
  /**
   * Load a SOGS file (meta.json + textures)
   * @param url URL of the meta.json file
   * @param onLoad Optional callback when loading is complete
   * @param onProgress Optional progress callback
   * @param onError Optional error callback
   */
  load(e, t, s, n) {
    const r = new c.FileLoader(this.manager);
    r.setResponseType("arraybuffer"), r.setRequestHeader(this.requestHeader), r.setPath(this.path), r.setWithCredentials(this.withCredentials), r.load(
      e,
      (i) => {
        this.parseAsync(e, i).then((o) => {
          t && t(o);
        }).catch((o) => {
          this.manager.itemError(e), n && n(o), console.error("Error loading SOGS meta:", o);
        });
      },
      s,
      n
    );
  }
  /**
   * Load a SOGS file asynchronously and return a Promise
   * @param url URL of the meta.json file
   * @param onProgress Optional progress callback
   * @returns A Promise that resolves with the parsed SplatData
   */
  loadAsync(e, t) {
    return new Promise((s, n) => {
      const r = new c.FileLoader(this.manager);
      r.setResponseType("arraybuffer"), r.setRequestHeader(this.requestHeader), r.setPath(this.path), r.setWithCredentials(this.withCredentials), r.load(
        e,
        (i) => {
          this.parseAsync(e, i).then(s).catch((o) => {
            n(o), this.manager.itemError(e);
          });
        },
        t,
        (i) => {
          n(i), this.manager.itemError(e);
        }
      );
    });
  }
  async parseAsync(e, t) {
    if (!(t instanceof ArrayBuffer)) throw new Error("SOGS loader: expected ArrayBuffer payload");
    if (this.isZipBuffer(t)) return this.parseZipAsync(t);
    const n = new TextDecoder("utf-8").decode(t), r = JSON.parse(n);
    return this.parseMetaAsync(e, r);
  }
  async parseMetaAsync(e, t) {
    const s = Ue(t), { numSplats: n, files: r, ranges: i, version: o } = s, m = new c.TextureLoader(this.manager);
    m.setPath(this.path), m.setRequestHeader(this.requestHeader), m.setWithCredentials(this.withCredentials);
    const y = (E, U) => {
      try {
        return new URL(U, E).toString();
      } catch {
        return E.substring(0, E.lastIndexOf("/") + 1) + U;
      }
    }, u = (E, U) => {
      const R = y(e, E);
      return new Promise((C, M) => {
        m.load(
          R,
          (k) => {
            k.generateMipmaps = !1, k.magFilter = c.NearestFilter, k.minFilter = c.NearestFilter, k.flipY = !1, C(k);
          },
          void 0,
          (k) => {
            const S = k instanceof Error ? k.message : String(k);
            M(
              new Error(
                `SOGS loader: failed to load ${U} (${E}): ${S}`
              )
            );
          }
        );
      });
    };
    if (!Array.isArray(r.sh0) || r.sh0.length < 1) throw new Error("SOGS loader: files.sh0 must have at least 1 entry (sh0)");
    if (!Array.isArray(r.means) || r.means.length < 2) throw new Error("SOGS loader: files.means must have at least 2 entries (means_l, means_u)");
    if (!Array.isArray(r.quats) || r.quats.length < 1) throw new Error("SOGS loader: files.quats must have at least 1 entry");
    if (!Array.isArray(r.scales) || r.scales.length < 1) throw new Error("SOGS loader: files.scales must have at least 1 entry");
    const [l, h, f, w, A] = await Promise.all([
      u(r.means[0], "means_l"),
      u(r.means[1], "means_u"),
      u(r.quats[0], "quats"),
      u(r.scales[0], "scales"),
      u(r.sh0[0], "sh0")
    ]), b = { means_l: l, means_u: h, quats: f, scales: w, sh0: A };
    if (o === 1) {
      const E = new Ee(n, i, b), U = ge.packSogs(E);
      return E.dispose(), U;
    }
    const B = new qe(n, i, b), T = ge.packSog2(B);
    return B.dispose(), T;
  }
  async parseZipAsync(e) {
    const t = At(new Uint8Array(e)), s = Object.keys(t), n = s.find((g) => g.toLowerCase().endsWith("meta.json")) ?? null;
    if (!n) throw new Error("SOGS loader: zip missing meta.json");
    const r = n.includes("/") ? n.slice(0, n.lastIndexOf("/") + 1) : "", i = new TextDecoder(), o = JSON.parse(i.decode(t[n])), m = Ue(o), { numSplats: y, files: u, ranges: l, version: h } = m, f = (g) => g.replace(/\\/g, "/").replace(/^\.?\//, ""), w = (g) => {
      const v = f(g), O = [f(r + v), v];
      for (const q of O) {
        const p = t[q];
        if (p) return p;
      }
      const V = v.split("/").pop(), I = s.find((q) => f(q).endsWith("/" + v)) ?? s.find((q) => f(q).endsWith("/" + V)) ?? s.find((q) => f(q) === V) ?? null;
      if (I) return t[I];
      throw new Error(`SOGS loader: zip missing file "${g}"`);
    }, A = (g) => {
      const v = g.toLowerCase();
      return v.endsWith(".png") ? "image/png" : v.endsWith(".jpg") || v.endsWith(".jpeg") ? "image/jpeg" : v.endsWith(".webp") ? "image/webp" : "application/octet-stream";
    }, b = new c.TextureLoader(this.manager);
    b.setRequestHeader(this.requestHeader), b.setWithCredentials(this.withCredentials);
    const B = (g, v) => {
      const O = w(g), V = new Blob([O], {
        type: A(g)
      }), I = URL.createObjectURL(V);
      return new Promise((q, p) => {
        b.load(
          I,
          (_) => {
            URL.revokeObjectURL(I), _.generateMipmaps = !1, _.magFilter = c.NearestFilter, _.minFilter = c.NearestFilter, _.flipY = !1, q(_);
          },
          void 0,
          (_) => {
            URL.revokeObjectURL(I);
            const H = _ instanceof Error ? _.message : String(_);
            p(
              new Error(
                `SOGS loader: failed to load ${v} from zip (${g}): ${H}`
              )
            );
          }
        );
      });
    };
    if (!Array.isArray(u.sh0) || u.sh0.length < 1) throw new Error("SOGS loader: files.sh0 must have at least 1 entry (sh0)");
    if (!Array.isArray(u.means) || u.means.length < 2) throw new Error("SOGS loader: files.means must have at least 2 entries (means_l, means_u)");
    if (!Array.isArray(u.quats) || u.quats.length < 1) throw new Error("SOGS loader: files.quats must have at least 1 entry");
    if (!Array.isArray(u.scales) || u.scales.length < 1) throw new Error("SOGS loader: files.scales must have at least 1 entry");
    const [T, E, U, R, C] = await Promise.all([
      B(u.means[0], "means_l"),
      B(u.means[1], "means_u"),
      B(u.quats[0], "quats"),
      B(u.scales[0], "scales"),
      B(u.sh0[0], "sh0")
    ]), M = { means_l: T, means_u: E, quats: U, scales: R, sh0: C };
    if (h === 1) {
      const g = new Ee(y, l, M), v = ge.packSogs(g);
      return g.dispose(), v;
    }
    const k = new qe(y, l, M), S = ge.packSog2(k);
    return k.dispose(), S;
  }
}
const zt = "0.3.0";
export {
  st as AnimationController,
  we as BoundingBox,
  kt as PlyLoader,
  Bt as SogsLoader,
  Ae as SplatData,
  rt as SplatMaterial,
  Re as SplatMesh,
  Qe as SplatSorter,
  nt as TextureManager,
  zt as VERSION,
  Le as getEffect
};
