// The Kettle character: body, eyes, clips and interaction behind one API.
// Rendering happens only while something changes (a clip exposure, the gaze,
// a drag or the camera), and stops while the Kettle is hidden or off-screen.
import {
  CircleGeometry,
  DataTexture,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  SRGBColorSpace,
  UnsignedByteType,
  Vector3,
  WebGLRenderer,
} from 'three';
import { KETTLE_FPS, type Clip, type ClipTuning } from './clip.ts';
import { composePose } from './compose.ts';
import { bakeSplats, placeBody, supportSamples, type Matrix3 } from './deform.ts';
import { createEyeRig, type EyeRig } from './eyes.ts';
import { FollowLayer, type Motion } from './follow.ts';
import { GAZE_FOLLOW, definitionOf } from './library.ts';
import { loadKettleBody } from './load.ts';
import type { ModelSplats } from './model.ts';
import { ClipPlayer, type PlayOptions } from './player.ts';
import { BODY_CHANNELS, CHANNELS, EYE_CHANNELS, lerpPose, neutralPose, type Pose } from './pose.ts';
import { SplatLayer, colorTexture } from './splat-mesh.ts';
import { springBack } from './spring.ts';
import { DEFAULT_TUNING, createClip, parseTuning, resolveTuning, type Tuning } from './tuning.ts';

export type Surface = 'landing' | 'footer' | 'portal' | 'none';
export type CameraPreset = 'front' | 'three-quarter' | 'side' | 'eye-detail' | 'stage';

export interface CameraView {
  /** Degrees around the body; 0 faces the Kettle. */
  azimuth: number;
  /** Degrees above the horizon. */
  elevation: number;
  /** Distance in body heights. */
  distance: number;
  /** Height of the point looked at, in body heights. */
  targetY: number;
  fov: number;
}

export interface Interactions {
  /** Eyes and a little of the head follow a mouse or pen (never touch). */
  gaze: boolean;
  /** Clicking or tapping the Kettle plays a reaction. */
  poke: boolean;
  /** Dragging turns the Kettle; releasing plays the drag-release reaction. */
  drag: boolean;
}

export interface MotionTiming {
  /** Gaze following on the 12 fps grid, or at display rate. */
  gaze: Motion;
  /** Drag rotation on the 12 fps grid, or at display rate (the default: direct manipulation never lags). */
  drag: Motion;
}

export interface KettleOptions {
  container: HTMLElement;
  /** URL of `kettle-body-32k.sog`. */
  asset: string | URL;
  /** Static image shown while loading and when WebGL is unavailable. */
  poster?: string;
  /** Sets the default interactions for a product surface. */
  surface?: Surface;
  interactions?: Partial<Interactions>;
  timing?: Partial<MotionTiming>;
  /** `auto` follows `prefers-reduced-motion`. */
  reducedMotion?: 'auto' | boolean;
  /** Overrides of `tuning.json`, in the same format. */
  tuning?: Tuning;
  camera?: CameraPreset | Partial<CameraView>;
  /** Clips a click or tap plays, in turn. Defaults to the poke reaction. */
  pokeClips?: string[];
  /** Ground shadow under the body. */
  shadow?: boolean;
  /** Maximum device pixel ratio. */
  maxPixelRatio?: number;
}

export type KettleStatus = 'loading' | 'ready' | 'poster';

export interface KettleState {
  status: KettleStatus;
  clip: string | null;
  frame: number;
  frames: number;
  playing: boolean;
  paused: boolean;
  /** The pose on screen, before the drag turn. */
  pose: Pose;
  gaze: { x: number; y: number };
  /** Drag turn in degrees. */
  dragTurn: number;
  dragging: boolean;
  reducedMotion: boolean;
  interactions: Interactions;
  timing: MotionTiming;
  visible: boolean;
  /** Frames drawn since creation; idle Kettles do not draw. */
  renders: number;
  /** Last clip skipped because reduced motion replaces it with the still pose. */
  skipped: string | null;
  camera: CameraView;
}

export interface Kettle {
  readonly ready: Promise<void>;
  readonly canvas: HTMLCanvasElement | null;
  readonly state: KettleState;
  /** Plays a clip; resolves when it ends, is replaced or is skipped. */
  play(id: string, options?: PlayOptions): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  /** Shows one exposure of the loaded clip and pauses there. */
  seek(frame: number): void;
  setSpeed(speed: number): void;
  setLoop(loop: boolean): void;
  /** Points the eyes at a normalised target (-1..1, x to the viewer's right, y up), or releases them. */
  setGaze(target: { x: number; y: number } | null): void;
  setInteractions(interactions: Partial<Interactions>): void;
  setTiming(timing: Partial<MotionTiming>): void;
  setReducedMotion(value: 'auto' | boolean): void;
  /** Replaces tuned values (same format as `tuning.json`); a playing clip is rebuilt in place. */
  setTuning(tuning: Tuning): void;
  setCamera(view: CameraPreset | Partial<CameraView>): void;
  subscribe(listener: (state: KettleState) => void): () => void;
  destroy(): void;
}

export const CAMERA_PRESETS: Record<CameraPreset, CameraView> = {
  front: { azimuth: 0, elevation: 4, distance: 4.4, targetY: 0.75, fov: 32 },
  'three-quarter': { azimuth: 32, elevation: 6, distance: 4.4, targetY: 0.75, fov: 32 },
  side: { azimuth: 90, elevation: 4, distance: 4.4, targetY: 0.75, fov: 32 },
  'eye-detail': { azimuth: 16, elevation: 3, distance: 1.7, targetY: 0.42, fov: 32 },
  stage: { azimuth: 14, elevation: 5, distance: 4.2, targetY: 0.7, fov: 32 },
};

const SURFACE_INTERACTIONS: Record<Surface, Interactions> = {
  landing: { gaze: true, poke: true, drag: false },
  footer: { gaze: true, poke: true, drag: false },
  portal: { gaze: false, poke: false, drag: false },
  none: { gaze: false, poke: false, drag: false },
};

/** Model-space point between the eyes, used to aim the gaze at the pointer. */
const FACE_POINT = new Vector3(0.42, 0.4, 0);
const DRAG_THRESHOLD = 6;
const DRAG_DEGREES_PER_PIXEL = 0.6;
const ECHO_OPACITY = [0.45, 0.25];

function shadowTexture(): DataTexture {
  const size = 64, data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2 + 0.5, y - size / 2 + 0.5) / (size / 2);
      const a = Math.max(0, 1 - d) ** 1.6;
      data.set([0, 0, 0, Math.round(a * 255)], (y * size + x) * 4);
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
  texture.needsUpdate = true;
  return texture;
}

const samePose = (a: Pose, b: Pose, channels: readonly string[]) => channels.every((c) => a[c as keyof Pose] === b[c as keyof Pose]);
const NONRIGID = ['stretch', 'bulge', 'bend', 'bendFront', 'twist', 'flop', 'flopFront'] as const;

function webglAvailable(): boolean {
  try {
    if (typeof WebGL2RenderingContext === 'undefined') return false;
    const probe = document.createElement('canvas').getContext('webgl2');
    // Release the probe at once: browsers cap the number of live contexts.
    probe?.getExtension('WEBGL_lose_context')?.loseContext();
    return probe !== null;
  } catch {
    return false;
  }
}

export function createKettle(options: KettleOptions): Kettle {
  const { container } = options;
  const listeners = new Set<(state: KettleState) => void>();
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reducedSetting = options.reducedMotion ?? 'auto';
  let tuning: Tuning = { ...DEFAULT_TUNING, ...(options.tuning ? parseTuning(options.tuning) : {}) };
  const interactions: Interactions = { ...SURFACE_INTERACTIONS[options.surface ?? 'none'], ...options.interactions };
  const timing: MotionTiming = { gaze: 'stepped', drag: 'smooth', ...options.timing };
  const pokeClips = options.pokeClips?.length ? options.pokeClips : ['poke'];
  let pokeIndex = 0;
  const player = new ClipPlayer();
  const follow = new FollowLayer(resolveTuning(GAZE_FOLLOW.id, tuning[GAZE_FOLLOW.id]));
  const clipCache = new Map<string, Clip>();
  const clipFor = (id: string): Clip => {
    let clip = clipCache.get(id);
    if (!clip) clipCache.set(id, (clip = createClip(id, tuning[id])));
    return clip;
  };

  const state: KettleState = {
    status: 'loading', clip: null, frame: 0, frames: 0, playing: false, paused: false, pose: neutralPose(),
    gaze: { x: 0, y: 0 }, dragTurn: 0, dragging: false, reducedMotion: false, interactions: { ...interactions },
    timing: { ...timing }, visible: false, renders: 0, skipped: null, camera: CAMERA_PRESETS.front,
  };
  const reduced = () => (reducedSetting === 'auto' ? reducedQuery.matches : reducedSetting);
  state.reducedMotion = reduced();

  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  let poster: HTMLImageElement | null = null;
  if (options.poster) {
    poster = document.createElement('img');
    poster.src = options.poster;
    poster.alt = '';
    poster.setAttribute('aria-hidden', 'true');
    poster.draggable = false;
    Object.assign(poster.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' });
    container.append(poster);
  }

  let destroyed = false;
  let renderer: WebGLRenderer | null = null;
  let canvas: HTMLCanvasElement | null = null;
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.05, 50);
  let cameraView: CameraView = CAMERA_PRESETS.front;
  const spin = new Group(); // drag turn, around the vertical axis through the base
  const body = new Group(); // rigid part of the pose
  scene.add(spin);
  spin.add(body);
  const echoGroups = [new Group(), new Group()];
  for (const group of echoGroups) spin.add(group);
  let shadow: Mesh<CircleGeometry, MeshBasicMaterial> | null = null;
  if (options.shadow !== false) {
    shadow = new Mesh(new CircleGeometry(0.42, 48), new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0.3 }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    shadow.renderOrder = 0;
    scene.add(shadow);
  }

  const loading = new AbortController();
  let colors: DataTexture | null = null;
  let model: ModelSplats | null = null;
  let support: Float32Array = new Float32Array();
  let main: SplatLayer | null = null;
  const echoes: SplatLayer[] = [];
  let eyes: EyeRig | null = null;
  let bakedCenters = new Float32Array(), bakedCov = new Float32Array();
  let shown: Pose | null = null;
  const echoShown: Array<string> = ['', ''];
  let raf = 0;
  let dirty = true;
  let suspendedPlayback = false;
  /** When the Kettle went off-screen or hidden; clip time and the spring stand still meanwhile. */
  let suspendedAt: number | null = null;
  let lastExposure = -1;
  /** A caller (not the pointer) aims the eyes, e.g. the portal guide looking at its bubble. */
  let externalGaze = false;

  // Drag state.
  let dragTurn = 0;
  let dragTarget = 0;
  let pointer: { id: number; x: number; y: number; startTurn: number; dragging: boolean; samples: Array<[number, number]> } | null = null;
  let spring: { start: number; values: number[] } | null = null;

  const matrix = new Matrix4();
  const setRotation = (group: Group, rotation: Matrix3, position: [number, number, number]) => {
    const r = rotation;
    matrix.set(r[0], r[1], r[2], 0, r[3], r[4], r[5], 0, r[6], r[7], r[8], 0, 0, 0, 0, 1);
    group.quaternion.setFromRotationMatrix(matrix);
    group.position.set(...position);
  };

  const applyCamera = () => {
    const v = cameraView, az = (v.azimuth * Math.PI) / 180, el = (v.elevation * Math.PI) / 180;
    camera.fov = v.fov;
    camera.position.set(v.distance * Math.cos(el) * Math.cos(az), v.targetY + v.distance * Math.sin(el), v.distance * Math.cos(el) * Math.sin(az));
    camera.lookAt(0, v.targetY, 0);
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const setCamera = (view: CameraPreset | Partial<CameraView>) => {
    cameraView = typeof view === 'string' ? CAMERA_PRESETS[view] : { ...cameraView, ...view };
    applyCamera();
    if (canRun()) render();
    emit();
  };
  cameraView = typeof options.camera === 'string' || !options.camera ? CAMERA_PRESETS[options.camera ?? 'front'] : { ...cameraView, ...options.camera };
  applyCamera();

  const emit = () => {
    state.clip = player.clip?.id ?? null;
    state.frame = player.frame;
    state.frames = player.clip?.frames.length ?? 0;
    state.playing = player.playing;
    state.paused = player.paused && player.clip !== null;
    state.gaze = { x: follow.x, y: follow.y };
    state.dragTurn = dragTurn;
    state.dragging = pointer?.dragging ?? false;
    state.reducedMotion = reduced();
    state.interactions = { ...interactions };
    state.timing = { ...timing };
    state.camera = { ...cameraView };
    for (const listener of listeners) listener(state);
  };

  const composeAt = (frame: number | null): Pose => {
    const clip = player.clip;
    return composePose({
      clip,
      clipPose: frame === null ? player.pose() : player.poseAt(frame),
      clipPlaying: player.playing || (player.paused && clip !== null && player.frame < (clip?.frames.length ?? 0) - 1),
      follow: frame === null && (interactions.gaze || externalGaze) ? follow.pose(reduced()) : null,
      directed: externalGaze,
      reduced: reduced(),
    });
  };

  const applyPose = (p: Pose) => {
    if (!model || !main || !eyes) return;
    if (!shown || !samePose(p, shown, NONRIGID)) {
      bakeSplats(model, p, bakedCenters, bakedCov);
      main.setData(bakedCenters, bakedCov);
    }
    if (!shown || !samePose(p, shown, BODY_CHANNELS) || !samePose(p, shown, EYE_CHANNELS)) {
      if (!shown || !samePose(p, shown, NONRIGID) || !samePose(p, shown, EYE_CHANNELS)) eyes.apply(p);
      const placement = placeBody(p, support);
      setRotation(body, placement.rotation, placement.position);
      if (shadow) {
        const lift = Math.max(0, placement.position[1] - placeBody(neutralPose(), support).position[1]);
        shadow.position.z = placement.position[2];
        shadow.scale.setScalar(Math.max(0.35, 1 - lift * 0.9) * (1 + Math.max(0, p.bulge) * 0.5));
        shadow.material.opacity = 0.3 * Math.max(0.25, 1 - lift * 1.2);
      }
    }
    // Multiple-image smear: in-between images from the previous exposure to
    // this one, drawn behind the body and fainter the further back they are.
    const count = player.clip && !reduced() ? Math.min(2, p.echo) : 0;
    const previous = player.frame > 0 ? player.poseAt(player.frame - 1) : null;
    echoes.forEach((layer, index) => {
      const group = echoGroups[index]!;
      if (index >= count || !previous) {
        group.visible = false;
        echoShown[index] = '';
        return;
      }
      group.visible = true;
      const key = `${player.clip!.id}:${player.frame}:${count}:${index}`;
      if (echoShown[index] === key) return;
      echoShown[index] = key;
      const ghost = lerpPose(previous, player.pose(), 1 - (index + 1) / (count + 1));
      bakeSplats(model!, ghost, bakedCenters, bakedCov);
      layer.setData(bakedCenters, bakedCov);
      const placement = placeBody(ghost, support);
      setRotation(group, placement.rotation, placement.position);
    });
    shown = { ...p };
    state.pose = shown;
    dirty = true;
  };

  const render = () => {
    if (!renderer || !main) return;
    spin.rotation.y = (dragTurn * Math.PI) / 180;
    scene.updateMatrixWorld();
    main.sort(camera);
    for (const [index, layer] of echoes.entries()) if (echoGroups[index]!.visible) layer.sort(camera);
    renderer.render(scene, camera);
    state.renders++;
    dirty = false;
    if (poster) poster.style.visibility = 'hidden';
  };

  /** Not animating: still loading, off-screen, in a hidden tab, or showing the poster. */
  const suspended = () => state.status !== 'ready' || !state.visible || document.hidden;
  const canRun = () => !destroyed && !suspended();
  const exposureAt = (time: number) => Math.floor((time * KETTLE_FPS) / 1000);

  /** Freezes clip time and the drag spring while the Kettle cannot be seen. */
  function suspend(): void {
    if (suspendedAt !== null) return;
    suspendedAt = performance.now();
    if (player.playing) {
      player.pause();
      suspendedPlayback = true;
    }
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function unsuspend(): void {
    if (destroyed || suspended()) return;
    const now = performance.now();
    if (spring && suspendedAt !== null) spring.start += exposureAt(now) - exposureAt(suspendedAt);
    if (suspendedPlayback) player.resume(now);
    suspendedPlayback = false;
    suspendedAt = null;
    dirty = true;
    wake();
  }
  /** Ends the clip (settling its promise) when the Kettle can no longer animate. */
  function toPoster(): void {
    state.status = 'poster';
    player.stop();
    spring = null;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (poster) poster.style.visibility = 'visible';
    if (canvas) canvas.style.visibility = 'hidden';
    emit();
  }

  function wake() {
    if (!raf && canRun()) raf = requestAnimationFrame(loop);
  }

  function loop(now: number) {
    raf = 0;
    if (!canRun()) return;
    const exposure = Math.floor((now * KETTLE_FPS) / 1000);
    const newExposure = exposure !== lastExposure;
    lastExposure = exposure;
    player.tick(now);
    const gazeMoving = follow.update(now, timing.gaze);
    // Drag: direct manipulation, or the stepped spring back to the front.
    if (pointer?.dragging) {
      if (timing.drag === 'smooth' || newExposure) dragTurn = dragTarget;
    } else if (spring) {
      const index = exposure - spring.start;
      dragTurn = index < spring.values.length ? spring.values[index]! : 0;
      if (index >= spring.values.length) spring = null;
    }
    const p = composeAt(null);
    if (!shown || !samePose(p, shown, CHANNELS)) applyPose(p);
    if (dirty || spin.rotation.y !== (dragTurn * Math.PI) / 180) render();
    emit();
    const active = player.playing || gazeMoving || !follow.settled || pointer?.dragging || spring !== null;
    if (active) raf = requestAnimationFrame(loop);
  }

  // ---- Loading ----
  const ready = (async () => {
    if (!webglAvailable()) {
      toPoster();
      return;
    }
    try {
      model = await loadKettleBody(options.asset, loading.signal);
      if (destroyed) return;
      renderer = new WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = SRGBColorSpace;
      canvas = renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
      container.append(canvas);
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        if (!destroyed) toPoster();
      });
      support = supportSamples(model);
      bakedCenters = new Float32Array(model.count * 3);
      bakedCov = new Float32Array(model.count * 6);
      colors = colorTexture(model.colors, model.count);
      main = new SplatLayer(model.count, colors);
      body.add(main.mesh);
      for (const [index, group] of echoGroups.entries()) {
        const layer = new SplatLayer(model.count, colors, ECHO_OPACITY[index]);
        echoes.push(layer);
        group.add(layer.mesh);
        group.visible = false;
      }
      eyes = createEyeRig();
      body.add(eyes.group);
      state.status = 'ready';
      resize();
      applyPose(composeAt(null));
      bindPointer();
      if (suspended()) suspend();
      else {
        unsuspend();
        render();
      }
      emit();
    } catch (error) {
      if (destroyed) return;
      toPoster();
      throw error;
    }
  })();
  ready.catch(() => {});

  // ---- Size and visibility ----
  function resize() {
    if (!renderer) return;
    const { width, height } = container.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    camera.aspect = Math.max(1, width) / Math.max(1, height);
    camera.updateProjectionMatrix();
    const w = Math.max(1, Math.round(width * ratio)), h = Math.max(1, Math.round(height * ratio));
    main?.setViewport(w, h);
    for (const layer of echoes) layer.setViewport(w, h);
    dirty = true;
    if (canRun()) render();
  }
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(container);

  const setVisible = (visible: boolean) => {
    if (state.visible === visible) return;
    state.visible = visible;
    if (suspended()) suspend();
    else unsuspend();
    emit();
  };
  const intersection = new IntersectionObserver((entries) => setVisible(entries.some((entry) => entry.isIntersecting)));
  intersection.observe(container);
  const onVisibility = () => {
    if (suspended()) suspend();
    else unsuspend();
    emit();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onReducedChange = () => {
    if (reducedSetting === 'auto') kettle.setReducedMotion('auto');
  };
  reducedQuery.addEventListener('change', onReducedChange);

  // ---- Pointer interaction ----
  const faceOnScreen = (): { x: number; y: number } | null => {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    scene.updateMatrixWorld();
    const point = FACE_POINT.clone().applyMatrix4(body.matrixWorld).project(camera);
    return { x: rect.left + ((point.x + 1) / 2) * rect.width, y: rect.top + ((1 - point.y) / 2) * rect.height };
  };

  const onWindowPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !interactions.gaze || externalGaze || pointer?.dragging) return;
    const face = faceOnScreen();
    if (!face) return;
    const radius = follow.tuning.amount.radius!;
    follow.setTarget({ x: Math.tanh((event.clientX - face.x) / radius), y: Math.tanh((face.y - event.clientY) / radius) });
    wake();
  };
  const onWindowLeave = (event: PointerEvent | FocusEvent) => {
    if ('relatedTarget' in event && event.relatedTarget) return;
    if (!externalGaze) follow.setTarget(null);
    wake();
  };

  const startSpring = (from: number, speed: number) => {
    const reaction = resolveTuning('drag-release', tuning['drag-release']);
    const turn = ((((from + 180) % 360) + 360) % 360) - 180;
    // Under reduced motion the turn eases straight back, never past the front.
    const values = springBack(turn, reaction.timing.springBack!, reduced() ? 0 : reaction.amount.springOvershoot!);
    dragTurn = turn;
    spring = { start: exposureAt(performance.now()), values };
    const { minSpeed, fullSpeed } = reaction.amount;

    if (!reduced() && Math.abs(speed) >= minSpeed!) {
      const intensity = Math.max(0.35, Math.min(1, (Math.abs(speed) - minSpeed!) / Math.max(1, fullSpeed! - minSpeed!)));
      void play('drag-release', { intensity, mirror: speed < 0 });
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    // One pointer at a time: a second finger or the mouse during a drag is ignored.
    if (pointer || event.button !== 0 || (!interactions.poke && !interactions.drag) || state.status !== 'ready') return;
    canvas!.setPointerCapture(event.pointerId);
    // Input timestamps, not processing time, so a slow frame does not hide a fast fling.
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startTurn: dragTurn, dragging: false, samples: [[event.timeStamp, dragTurn]] };
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x;
    if (!pointer.dragging && interactions.drag && Math.hypot(dx, event.clientY - pointer.y) > DRAG_THRESHOLD) {
      pointer.dragging = true;
      spring = null;
      pointer.startTurn = dragTurn;
    }
    if (!pointer.dragging) return;
    dragTarget = pointer.startTurn + dx * DRAG_DEGREES_PER_PIXEL;
    const now = event.timeStamp;
    pointer.samples.push([now, dragTarget]);
    while (pointer.samples.length > 2 && now - pointer.samples[0]![0] > 200) pointer.samples.shift();
    wake();
  };
  /**
   * Turn speed (degrees per second) at the release itself. A pointer that stood
   * still before letting go has speed 0: "still" means no move for 100 ms, or
   * for 1.5 × the recent gap between moves when input arrives more slowly.
   */
  const releaseSpeed = (samples: Array<[number, number]>, at: number): number => {
    const before = samples.filter(([t]) => t <= at);
    const last = before.at(-1), previous = before.at(-2);
    if (!last || !previous) return 0;
    const gap = last[0] - previous[0];
    if (at - last[0] > Math.max(100, 1.5 * gap)) return 0;
    const recent = before.filter(([t]) => at - t <= Math.max(120, 1.5 * gap));
    const from = recent.length >= 2 ? recent[0]! : previous;
    return last[0] > from[0] ? ((last[1] - from[1]) * 1000) / (last[0] - from[0]) : 0;
  };
  /** Ends the active pointer: `release` may fling or poke; `cancel` only springs back. */
  const endPointer = (event: PointerEvent, kind: 'release' | 'cancel') => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const ended = pointer;
    pointer = null;
    if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (ended.dragging) {
      startSpring(dragTarget, kind === 'release' ? releaseSpeed(ended.samples, event.timeStamp) : 0);
    } else if (kind === 'release' && interactions.poke && canvas) {
      // Captured pointers report their release anywhere; only a release over the Kettle pokes.
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (inside) {
        const face = faceOnScreen();
        const id = pokeClips[pokeIndex++ % pokeClips.length]!;
        void play(id, { mirror: face !== null && event.clientX < face.x });
      }
    }
    wake();
    emit();
  };
  const onPointerUp = (event: PointerEvent) => endPointer(event, 'release');
  const onPointerCancel = (event: PointerEvent) => endPointer(event, 'cancel');

  function bindPointer() {
    if (!canvas) return;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('lostpointercapture', onPointerCancel);
    updateCursor();
  }
  function updateCursor() {
    if (!canvas) return;
    canvas.style.cursor = interactions.drag ? 'grab' : interactions.poke ? 'pointer' : '';
    canvas.style.touchAction = interactions.drag ? 'pan-y' : 'manipulation';
    canvas.style.pointerEvents = interactions.drag || interactions.poke ? 'auto' : 'none';
  }
  window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onWindowLeave);
  window.addEventListener('blur', onWindowLeave);

  // ---- Public API ----
  function play(id: string, playOptions: PlayOptions = {}): Promise<void> {
    const definition = definitionOf(id);
    // Without WebGL (or after teardown) nothing animates: settle at once.
    if (destroyed || state.status === 'poster') return Promise.resolve();
    if (reduced() && definition.reducedMotion === 'still') {
      player.stop();
      state.skipped = id;
      wake();
      emit();
      return Promise.resolve();
    }
    state.skipped = null;
    return new Promise((resolve) => {
      player.play(clipFor(id), performance.now(), playOptions, resolve);
      // Queued while unseen: it starts from its first exposure once visible.
      suspendedPlayback = false;
      if (suspended()) {
        player.pause();
        suspendedPlayback = true;
      }
      echoShown.fill('');
      wake();
      emit();
    });
  }

  const kettle: Kettle = {
    ready,
    get canvas() {
      return canvas;
    },
    state,
    play,
    stop() {
      player.stop();
      wake();
      emit();
    },
    pause() {
      player.pause();
      suspendedPlayback = false;
      emit();
    },
    resume() {
      if (suspended()) suspendedPlayback = player.clip !== null;
      else player.resume(performance.now());
      wake();
      emit();
    },
    seek(frame) {
      player.seek(frame);
      if (canRun()) {
        const p = composeAt(null);
        applyPose(p);
        render();
      }
      emit();
    },
    setSpeed(speed) {
      const now = performance.now();
      const wasPlaying = player.playing;
      if (wasPlaying) player.pause();
      player.speed = Math.max(0.05, speed);
      if (wasPlaying) player.resume(now);
    },
    setLoop(loop) {
      player.loop = loop;
    },
    setGaze(target) {
      externalGaze = target !== null;
      follow.setTarget(target);
      wake();
    },
    setInteractions(next) {
      Object.assign(interactions, next);
      if (!interactions.gaze && !externalGaze) follow.setTarget(null);
      updateCursor();
      wake();
      emit();
    },
    setTiming(next) {
      Object.assign(timing, next);
      emit();
    },
    setReducedMotion(value) {
      reducedSetting = value;
      shown = null;
      // Re-pose at once so no frame shows the previous setting's motion.
      if (canRun()) {
        applyPose(composeAt(null));
        render();
      }
      wake();
      emit();
    },
    setTuning(next) {
      tuning = { ...tuning, ...parseTuning(next) };
      clipCache.clear();
      follow.tuning = resolveTuning(GAZE_FOLLOW.id, tuning[GAZE_FOLLOW.id]);
      const current = player.clip;
      if (current) {
        const frame = player.frame;
        const rebuilt = clipFor(current.id);
        // Swap frames in place so the review keeps its position.
        current.frames = rebuilt.frames;
        player.seek(Math.min(frame, rebuilt.frames.length - 1));
        if (state.playing) player.resume(performance.now());
        echoShown.fill('');
      }
      shown = null;
      wake();
      emit();
    },
    setCamera,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      loading.abort();
      player.stop();
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reducedQuery.removeEventListener('change', onReducedChange);
      window.removeEventListener('pointermove', onWindowPointerMove);
      document.documentElement.removeEventListener('pointerleave', onWindowLeave);
      window.removeEventListener('blur', onWindowLeave);
      main?.dispose();
      for (const layer of echoes) layer.dispose();
      eyes?.dispose();
      colors?.dispose();
      shadow?.geometry.dispose();
      shadow?.material.map?.dispose();
      shadow?.material.dispose();
      if (renderer) {
        canvas?.removeEventListener('pointerdown', onPointerDown);
        renderer.dispose();
        renderer.forceContextLoss();
      }
      canvas?.remove();
      poster?.remove();
      listeners.clear();
    },
  };
  return kettle;
}

export type { ClipTuning, Tuning };
