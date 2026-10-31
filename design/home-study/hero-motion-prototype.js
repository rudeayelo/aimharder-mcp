// Throwaway motion study: one directed composition, synthetic data, no product services.
import * as THREE from 'three';
import {SogsLoader, SplatMesh} from '../identity/idol-motion-prototype/vendor/visus-2.5.0.js';
import {SOURCE_BOUNDS} from '../identity/idol-motion-prototype/asset-profiles.js';
import {createEyes} from '../identity/idol-motion-prototype/hybrid/eye-rig.js';

const params = new URLSearchParams(location.search);
const root = document.documentElement;
const stage = document.querySelector('.scene');
const actor = document.querySelector('.kettle');
const shadow = document.querySelector('.ground');
const status = document.querySelector('#motion-status');
const pause = document.querySelector('#pause');
const replay = document.querySelector('#replay');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const frozen = params.get('motion') === 'off' || reduced.matches;
const inspection = Number(params.get('at'));
const inspectAt = params.has('at') && Number.isFinite(inspection) ? Math.max(0, Math.min(8.49, inspection)) : null;
stage.dataset.inspection = String(inspectAt !== null || frozen);
let playing = !frozen && inspectAt === null;
let elapsed = inspectAt ?? (frozen ? 5 : 0);
let previous = null;
let drawFrame = null;
let frameRequest = null;
function requestFrame() {
  if (!drawFrame || frameRequest !== null || document.hidden) return;
  frameRequest = requestAnimationFrame(now => {
    frameRequest = null;
    drawFrame(now);
  });
}
function cancelFrame() {
  if (frameRequest !== null) cancelAnimationFrame(frameRequest);
  frameRequest = null;
}

for (const [id, key, value] of [
  ['theme-review', 'theme', root.dataset.theme === 'dark' ? 'light' : 'dark'],
  ['reply-review', 'reply', params.get('reply') === 'long' ? 'short' : 'long'],
]) {
  const query = new URLSearchParams(params);
  query.set(key, value);
  const link = document.querySelector('#' + id);
  link.href = '?' + query;
  link.textContent = id === 'theme-review' ? (value === 'dark' ? 'Dark' : 'Light') : (value === 'long' ? 'Long reply' : 'Short reply');
}
if (params.get('reply') === 'long') {
  const copy = document.createElement('p');
  copy.className = 'long-copy';
  copy.textContent = 'You also have a booking on Thursday at 18:00. Both classes are CrossFit. Ask me about the published workout whenever you want to check what is coming up.';
  document.querySelector('.answer').append(copy);
}
function phase(name) {
  root.dataset.state = name;
  stage.dataset.phase = name;
}
function controls() {
  pause.textContent = playing ? 'Pause' : 'Play';
  stage.dataset.paused = String(!playing);
}
pause.addEventListener('click', () => {
  if (frozen) return;
  stage.dataset.inspection = 'false';
  playing = !playing;
  previous = null;
  controls();
  if (playing) requestFrame();
  else cancelFrame();
});
replay.addEventListener('click', () => {
  if (frozen) return;
  stage.dataset.inspection = 'false';
  elapsed = 0;
  previous = null;
  playing = true;
  controls();
  requestFrame();
});
controls();
if (frozen) {
  phase('answer');
  status.textContent = 'Static · reduced motion';
  pause.disabled = replay.disabled = true;
} else {
  phase('waiting');
  pause.disabled = replay.disabled = true;
  start().catch(() => {
    stage.dataset.inspection = 'true';
    phase('answer');
    status.textContent = 'Static fallback · 3D unavailable';
    pause.disabled = replay.disabled = true;
  });
}

async function start() {
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(768, 768);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  actor.append(canvas);
  function fitCanvas() {
    // Match the calibrated attentive-pose crop, including its transparent margins.
    const scale = Math.min(actor.clientWidth / 528, actor.clientHeight / 577);
    Object.assign(canvas.style, {
      width: 768 * scale + 'px', height: 768 * scale + 'px',
      left: ((actor.clientWidth - 528 * scale) / 2 - 114 * scale) + 'px',
      top: (actor.clientHeight - 577 * scale - 100 * scale) + 'px',
    });
  }
  new ResizeObserver(fitCanvas).observe(actor);
  fitCanvas();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, .01, 100);
  camera.position.set(3, .76, 0);
  camera.lookAt(0, .5, 0);
  const data = await new SogsLoader().loadAsync('../identity/idol-motion-prototype/hybrid/kettle-body-32k.sog');
  const bounds = {min: new THREE.Vector3(...SOURCE_BOUNDS.min), max: new THREE.Vector3(...SOURCE_BOUNDS.max)};
  bounds.center = bounds.min.clone().add(bounds.max).multiplyScalar(.5);
  const height = bounds.max.y - bounds.min.y;
  // A shared planted root deforms the splats, handle and complete curved eye recesses.
  const planted = new THREE.Group();
  planted.position.y = .018;
  scene.add(planted);
  const body = new THREE.Group();
  planted.add(body);
  const mesh = new SplatMesh(data, {autoSort: true});
  mesh.scale.setScalar(1 / height);
  mesh.rotation.x = Math.PI;
  mesh.position.set(-bounds.center.x / height, bounds.max.y / height, bounds.center.z / height);
  body.add(mesh);
  const eyes = createEyes(body, bounds);
  let ready = false;
  mesh.sorter.addEventListener('updated', () => {
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      pause.disabled = replay.disabled = false;
      stage.dataset.renderer = 'ready';
      previous = null;
      requestFrame();
    }
  });
  const smooth = n => {n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n);};
  // Scale-Y, lift, roll: slow compression; release; flight; landing; smaller rebound; settle.
  const keys = [
    [0, 1, 0, 0], [1.65, 1, 0, 0], [3.8, .85, 0, -.012],
    [3.91, 1.055, .014, .005], [4.08, 1.025, .065, .015],
    [4.29, 1, .008, .004], [4.34, .92, 0, -.014],
    [4.46, 1.025, .022, .009], [4.59, .975, 0, -.004],
    [4.82, 1, 0, 0], [8.5, 1, 0, 0],
  ];
  function sample(t) {
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const a = keys[i-1], b = keys[i], u = smooth((t-a[0])/(b[0]-a[0]));
        return a.slice(1).map((v,j) => v + (b[j+1]-v)*u);
      }
    }
    return [1, 0, 0];
  }
  drawFrame = now => {
    if (playing && previous !== null) elapsed = (elapsed + Math.min(.05, (now-previous)/1000)) % 8.5;
    previous = now;
    const t = elapsed;
    const name = t < .9 ? 'waiting' : t < 1.65 ? 'question' : t < 3.8 ? 'thinking' : 'answer';
    if (stage.dataset.phase !== name) phase(name);
    const [sy, lift, roll] = sample(t);
    planted.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
    planted.position.y = .018 + lift;
    const attention = smooth((t-.9)/.6);
    body.rotation.set(0, .16 + .22*attention, .11*attention + roll);
    const thinking = smooth((t-1.65)/.55) * (1-smooth((t-3.8)/.2));
    // A brief blink and gentle squint move all recessed layers with the curved face.
    const blink = t > 2.45 && t < 2.63 ? Math.sin((t-2.45)/.18*Math.PI) : 0;
    eyes.apply({open: [1-.10*thinking-.80*blink, 1-.18*thinking-.72*blink], width: 1-.025*thinking, gaze: -.018*attention, gazeY: .014*attention+.008*thinking});
    shadow.style.transform = `scale(${1 + (1-sy)*.35-lift*1.5})`;
    shadow.style.opacity = String(1-lift*6);
    // Visible, read-only inspection evidence; no private renderer state needed by QA.
    stage.dataset.scaleY = sy.toFixed(4);
    stage.dataset.lift = lift.toFixed(4);
    stage.dataset.time = t.toFixed(3);
    status.textContent = name === 'answer' ? 'Answering' : name[0].toUpperCase()+name.slice(1);
    renderer.render(scene, camera);
    if (playing && !document.hidden) requestFrame();
  };
  renderer.render(scene, camera);
  document.addEventListener('visibilitychange', () => {
    previous = null;
    cancelFrame();
    if (!document.hidden) requestFrame();
  });
  reduced.addEventListener('change', () => location.reload());
}
