// Gaussian splat drawing with three.js: one instanced quad per splat, data in
// float textures, projection of the 3D covariance in the vertex shader.
// Covariances arrive already deformed (see deform.ts), so the shader only
// projects them; the mesh's own world matrix must stay rigid (rotation,
// translation, uniform scale) for the depth sort to stay exact.
import {
  BufferAttribute,
  CustomBlending,
  DataTexture,
  DoubleSide,
  FloatType,
  GLSL3,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Matrix4,
  Mesh,
  NearestFilter,
  OneFactor,
  OneMinusSrcAlphaFactor,
  RGBAFormat,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  Vector3,
  type Camera,
} from 'three';
import { DepthSorter } from './sort.ts';

const WIDTH = 256;

const vertexShader = /* glsl */ `
precision highp float;
precision highp int;
precision highp sampler2D;
in float splatIndex;
uniform sampler2D centers;
uniform sampler2D covA;
uniform sampler2D covB;
uniform sampler2D colors;
uniform vec2 viewport;
uniform float opacity;
out vec4 vColor;
out vec2 vPosition;

void main() {
  int i = int(splatIndex + 0.5);
  ivec2 uv = ivec2(i % ${WIDTH}, i / ${WIDTH});
  vec3 center = texelFetch(centers, uv, 0).xyz;
  vec4 a = texelFetch(covA, uv, 0);
  vec2 b = texelFetch(covB, uv, 0).xy;
  vec4 color = texelFetch(colors, uv, 0);
  vec4 view = modelViewMatrix * vec4(center, 1.0);
  if (view.z > -0.01 || color.a < 0.004) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
  mat3 sigma = mat3(a.x, a.y, a.z, a.y, a.w, b.x, a.z, b.x, b.y);
  float fx = 0.5 * viewport.x * projectionMatrix[0][0];
  float fy = 0.5 * viewport.y * projectionMatrix[1][1];
  float iz = 1.0 / view.z;
  mat3 J = mat3(fx * iz, 0.0, -fx * view.x * iz * iz,
                0.0, fy * iz, -fy * view.y * iz * iz,
                0.0, 0.0, 0.0);
  mat3 T = transpose(mat3(modelViewMatrix)) * J;
  mat3 cov = transpose(T) * sigma * T;
  float d1 = cov[0][0] + 0.3;
  float d2 = cov[1][1] + 0.3;
  float off = cov[0][1];
  float mid = 0.5 * (d1 + d2);
  float radius = length(vec2(0.5 * (d1 - d2), off));
  float l1 = mid + radius;
  float l2 = max(mid - radius, 0.1);
  vec2 axis = normalize(vec2(off, l1 - d1) + vec2(1e-9, 0.0));
  vec2 major = min(sqrt(2.0 * l1), 1024.0) * axis;
  vec2 minor = min(sqrt(2.0 * l2), 1024.0) * vec2(axis.y, -axis.x);
  vec4 clip = projectionMatrix * view;
  vec2 pixels = position.x * major + position.y * minor;
  gl_Position = clip + vec4(pixels * 2.0 / viewport * clip.w, 0.0, 0.0);
  vPosition = position.xy;
  vColor = vec4(color.rgb, color.a * opacity);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
in vec4 vColor;
in vec2 vPosition;
layout(location = 0) out highp vec4 fragColor;

void main() {
  float power = -dot(vPosition, vPosition);
  if (power < -4.0) discard;
  float alpha = min(0.995, exp(power) * vColor.a);
  if (alpha < 1.0 / 255.0) discard;
  fragColor = vec4(vColor.rgb * alpha, alpha);
}
`;

function floatTexture(height: number): DataTexture {
  const texture = new DataTexture(new Float32Array(WIDTH * height * 4), WIDTH, height, RGBAFormat, FloatType);
  texture.minFilter = texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function colorTexture(colors: Uint8Array, count: number): DataTexture {
  const height = Math.ceil(count / WIDTH);
  const data = new Uint8Array(WIDTH * height * 4);
  data.set(colors.subarray(0, count * 4));
  const texture = new DataTexture(data, WIDTH, height, RGBAFormat, UnsignedByteType);
  texture.minFilter = texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/** One drawable copy of the body: the body itself, or a trailing echo image. */
export class SplatLayer {
  readonly mesh: Mesh<InstancedBufferGeometry, ShaderMaterial>;
  readonly centers: Float32Array;
  private readonly centerTex: DataTexture;
  private readonly covATex: DataTexture;
  private readonly covBTex: DataTexture;
  private readonly order: InstancedBufferAttribute;
  private readonly sorter: DepthSorter;
  private readonly inverse = new Matrix4();
  private readonly lastMatrix = new Matrix4();
  private readonly lastForward = new Vector3();
  private readonly a = new Vector3();
  private readonly b = new Vector3();
  private dirty = true;
  /** Number of sorts run; exposed for profiling. */
  sorts = 0;

  readonly count: number;

  constructor(count: number, colors: DataTexture, opacity = 1) {
    this.count = count;
    const height = Math.ceil(count / WIDTH);
    this.centers = new Float32Array(count * 3);
    this.centerTex = floatTexture(height);
    this.covATex = floatTexture(height);
    this.covBTex = floatTexture(height);
    this.sorter = new DepthSorter(count);
    const geometry = new InstancedBufferGeometry();
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.setAttribute('position', new BufferAttribute(new Float32Array([-2, -2, 0, 2, -2, 0, 2, 2, 0, -2, 2, 0]), 3));
    this.order = new InstancedBufferAttribute(new Float32Array(count), 1);
    this.order.setUsage(35048); // DYNAMIC_DRAW
    geometry.setAttribute('splatIndex', this.order);
    geometry.instanceCount = count;
    const material = new ShaderMaterial({
      glslVersion: GLSL3,
      vertexShader,
      fragmentShader,
      uniforms: {
        centers: { value: this.centerTex },
        covA: { value: this.covATex },
        covB: { value: this.covBTex },
        colors: { value: colors },
        viewport: { value: new Vector2(1, 1) },
        opacity: { value: opacity },
      },
      transparent: true,
      // The (major, minor) basis can mirror the quad, so both windings must draw.
      side: DoubleSide,
      depthWrite: false,
      depthTest: true,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneMinusSrcAlphaFactor,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
  }

  set opacity(value: number) {
    this.mesh.material.uniforms.opacity!.value = value;
  }

  /** Uploads deformed centres and covariances (upper triangles). */
  setData(centers: Float32Array, covariances: Float32Array): void {
    this.centers.set(centers);
    const c = this.centerTex.image.data as Float32Array;
    const a = this.covATex.image.data as Float32Array;
    const b = this.covBTex.image.data as Float32Array;
    for (let i = 0; i < this.count; i++) {
      c[i * 4] = centers[i * 3]!;
      c[i * 4 + 1] = centers[i * 3 + 1]!;
      c[i * 4 + 2] = centers[i * 3 + 2]!;
      const o = i * 6;
      a[i * 4] = covariances[o]!;
      a[i * 4 + 1] = covariances[o + 1]!;
      a[i * 4 + 2] = covariances[o + 2]!;
      a[i * 4 + 3] = covariances[o + 3]!;
      b[i * 4] = covariances[o + 4]!;
      b[i * 4 + 1] = covariances[o + 5]!;
    }
    this.centerTex.needsUpdate = this.covATex.needsUpdate = this.covBTex.needsUpdate = true;
    this.dirty = true;
  }

  setViewport(width: number, height: number): void {
    (this.mesh.material.uniforms.viewport!.value as Vector2).set(width, height);
  }

  /** Re-sorts when the data, the camera or the body placement changed. Needs an up-to-date matrixWorld. */
  sort(camera: Camera): void {
    const matrix = this.mesh.matrixWorld;
    this.inverse.copy(matrix).invert();
    camera.getWorldPosition(this.a);
    camera.getWorldDirection(this.b).add(this.a);
    this.a.applyMatrix4(this.inverse);
    this.b.applyMatrix4(this.inverse).sub(this.a).normalize();
    if (!this.dirty && this.lastMatrix.equals(matrix) && this.lastForward.dot(this.b) > 0.99999) return;
    this.lastMatrix.copy(matrix);
    this.lastForward.copy(this.b);
    this.dirty = false;
    this.sorter.sort(this.centers, [this.b.x, this.b.y, this.b.z], this.order.array as Float32Array);
    this.order.needsUpdate = true;
    this.sorts++;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.centerTex.dispose();
    this.covATex.dispose();
    this.covBTex.dispose();
  }
}
