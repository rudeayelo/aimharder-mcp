import * as THREE from 'three';
import {SogsLoader, SplatMesh} from '../identity/idol-motion-prototype/vendor/visus-2.5.0.js';
import {SOURCE_BOUNDS} from '../identity/idol-motion-prototype/asset-profiles.js';
import {installAffineSort} from '../identity/idol-motion-prototype/affine-sort.js';
import {createEyes} from '../identity/idol-motion-prototype/hybrid/eye-rig.js';
import {eyePoseAt} from '../identity/idol-motion-prototype/hybrid/eye-poses.js';
import {CLIPS, FPS, poseAt} from '../identity/idol-motion-prototype/motion-poses.js';

const duration = clip => CLIPS[clip].frames.length / (CLIPS[clip].fps ?? FPS);

export async function createOnboardingKettle() {
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(384, 384, false);
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  const loader = new SogsLoader();
  let data;
  try {
    data = await loader.loadAsync(new URL('../identity/idol-motion-prototype/hybrid/kettle-body-32k.sog', import.meta.url).href);
  } catch (error) {
    renderer.dispose();
    throw error;
  } finally {
    loader.dispose?.();
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .01, 100);
  camera.position.set(3, .76, 0);
  camera.lookAt(0, .5, 0);
  const min = new THREE.Vector3(...SOURCE_BOUNDS.min);
  const max = new THREE.Vector3(...SOURCE_BOUNDS.max);
  const center = min.clone().add(max).multiplyScalar(.5);
  const height = max.y - min.y;
  const support = [];
  const stride = Math.max(1, Math.floor(data.numSplats / 2048));
  for (let i = 0; i < data.numSplats; i += stride) {
    support.push(new THREE.Vector3(
      (data.centers[i * 3] - center.x) / height,
      (max.y - data.centers[i * 3 + 1]) / height,
      (center.z - data.centers[i * 3 + 2]) / height,
    ));
  }

  const pivot = new THREE.Group();
  scene.add(pivot);
  const mesh = new SplatMesh(data, {autoSort: true});
  installAffineSort(mesh);
  mesh.scale.setScalar(1 / height);
  mesh.rotation.x = Math.PI;
  mesh.position.set(-center.x / height, max.y / height, center.z / height);
  pivot.add(mesh);
  const eyes = createEyes(pivot, {min, max, center});
  const euler = new THREE.Euler(0, 0, 0, 'YXZ');
  const matrix = new THREE.Matrix4(), point = new THREE.Vector3(), origin = new THREE.Vector3();
  const radians = Math.PI / 180;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionOff = new URLSearchParams(location.search).get('motion') === 'off';
  let stage, spin, request, previous, elapsed = 0, last = '', sorted = false, failed = false;

  function draw(clip, frame) {
    const pose = poseAt(clip, frame);
    const expression = eyePoseAt(clip, frame);
    const lead = spin ? 0 : Math.min(1, elapsed * 4);
    const bob = spin || clip !== 'curious' ? 0 : .065 * Math.sin(Math.PI * frame / (CLIPS.curious.frames.length - 1));
    const yaw = spin ? pose.yaw : 16 + 8 * lead + pose.yaw;
    const pitch = spin ? pose.pitch : -4 - 3 * lead;
    pivot.quaternion.setFromEuler(euler.set(pose.roll * radians, yaw * radians, pitch * radians));
    const width = 1 / Math.sqrt(pose.height);
    pivot.scale.set(width, pose.height, width);
    matrix.compose(origin, pivot.quaternion, pivot.scale);
    let floor = Infinity;
    for (const sample of support) floor = Math.min(floor, point.copy(sample).applyMatrix4(matrix).y);
    pivot.position.set(0, pose.lift + bob - floor, pose.sway);
    eyes.apply(spin ? expression : {...expression, gaze: expression.gaze - .017, gazeY: -.013});
    stage.dataset.emote = clip;
    stage.dataset.frame = String(frame);
    renderer.render(scene, camera);
  }

  function schedule() {
    if (stage && sorted && !failed && !motionOff && !reduced.matches && !document.hidden && request === undefined) {
      request = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    request = undefined;
    if (!stage || failed || document.hidden || reduced.matches) return;
    if (previous !== undefined) elapsed += Math.min(.1, (now - previous) / 1000);
    previous = now;
    const clip = spin ? 'spin' : elapsed < duration('curious') ? 'curious' : 'blink';
    const start = clip === 'blink' ? duration('curious') + .25 : 0;
    const frame = Math.max(0, Math.min(CLIPS[clip].frames.length - 1, Math.floor((elapsed - start) * (CLIPS[clip].fps ?? FPS))));
    if (last !== clip + frame) {
      draw(clip, frame);
      last = clip + frame;
    }
    if (elapsed < start + duration(clip)) schedule();
  }

  function cancel() {
    if (request !== undefined) cancelAnimationFrame(request);
    request = previous = undefined;
  }

  function hide() {
    cancel();
    stage = null;
  }

  function show(element, celebration = false) {
    if (failed) return;
    cancel();
    stage = element;
    spin = celebration;
    elapsed = 0;
    const clip = spin ? 'spin' : 'curious';
    last = clip + '0';
    if (canvas.parentElement !== stage) {
      if (canvas.parentElement) canvas.parentElement.dataset.renderer = 'poster';
      stage.append(canvas);
    }
    draw(clip, 0);
    if (sorted) stage.dataset.renderer = 'ready';
    schedule();
  }

  mesh.sorter.addEventListener('updated', () => {
    sorted = true;
    if (stage && !failed && !document.hidden) {
      renderer.render(scene, camera);
      stage.dataset.renderer = 'ready';
      schedule();
    }
  });
  canvas.addEventListener('webglcontextlost', () => {
    failed = true;
    if (stage) stage.dataset.renderer = 'poster';
    hide();
  });
  document.addEventListener('visibilitychange', () => {
    cancel();
    if (stage && sorted && !failed && !document.hidden) {
      renderer.render(scene, camera);
      stage.dataset.renderer = 'ready';
      schedule();
    }
  });
  reduced.addEventListener('change', () => {
    if (stage) show(stage, spin);
  });
  window.addEventListener('pagehide', event => {
    cancel();
    if (event.persisted) return;
    failed = true;
    mesh.dispose?.();
    scene.traverse(node => { node.geometry?.dispose(); node.material?.dispose(); });
    renderer.dispose();
  });
  window.addEventListener('pageshow', schedule);
  return {show, hide};
}
