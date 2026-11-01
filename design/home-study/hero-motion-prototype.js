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
const timing = {question: .9, thinking: 1.12, answer: 2.195, cycle: 8.5};
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
  copy.textContent = 'You also have a booking on Thursday at 18:00. Both are WOD classes. Ask me about the published workout whenever you want to check what is coming up.';
  document.querySelector('.answer').append(copy);
}
// Retain the complete text footprint so typing never resizes the bubble.
const answer = document.querySelector('.answer');
const fullAnswer = Array.from(answer.querySelectorAll('p, strong'), node => node.textContent.trim().replace(/[.!?]$/, '')).join('. ');
const textWalker = document.createTreeWalker(answer, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (textWalker.nextNode()) {
  if (textWalker.currentNode.textContent.trim()) textNodes.push(textWalker.currentNode);
}
let totalCharacters = 0;
const runs = textNodes.map(node => {
  const text = Array.from(node.textContent);
  const wrapper = document.createElement('span');
  const visible = document.createElement('span');
  visible.className = 'reply-visible';
  const remainder = document.createElement('span');
  remainder.className = 'reply-unrevealed';
  wrapper.append(visible, remainder);
  node.replaceWith(wrapper);
  const start = totalCharacters;
  totalCharacters += text.length;
  return {text, start, visible, remainder};
});
// Expose one complete answer instead of announcing each character to assistive technology.
answer.setAttribute('role', 'img');
answer.setAttribute('aria-label', 'Fictional answer: ' + fullAnswer);
const typingDuration = Math.max(.7, Math.min(2.2, totalCharacters / 105));
let lastCount = -1;
function typeAnswer(time, complete = false) {
  const count = complete ? totalCharacters : Math.floor(Math.max(0, Math.min(1, (time-timing.answer)/typingDuration))*totalCharacters);
  if (count === lastCount) return;
  lastCount = count;
  for (const run of runs) {
    const n = Math.max(0, Math.min(run.text.length, count-run.start));
    run.visible.textContent = run.text.slice(0, n).join('');
    run.remainder.textContent = run.text.slice(n).join('');
  }
  stage.dataset.typed = String(count);
  stage.dataset.characters = String(totalCharacters);
  stage.dataset.typing = String(count < totalCharacters);
  const confirmed = runs.find(run => run.visible.closest('.confirmed'));
  answer.querySelector('.confirmed .icon').style.visibility = confirmed && count <= confirmed.start ? 'hidden' : 'visible';
}
const question = document.querySelector('.question');
function placeReply() {
  // The question can wrap; keep both reply states exactly 16px below its real bottom.
  if (question.offsetHeight) stage.style.setProperty('--reply-top', (question.offsetTop+question.offsetHeight+16)+'px');
}
new ResizeObserver(placeReply).observe(question);
typeAnswer(0, frozen);
function phase(name) {
  root.dataset.state = name;
  stage.dataset.phase = name;
  placeReply();
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
    typeAnswer(0, true);
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
  // Anticipation compresses in half the previous thinking time; quick release follows.
  const a = timing.answer;
  const keys = [
    [0, 1, 0, 0], [timing.thinking, 1, 0, 0], [a, .85, 0, -.012],
    [a+.11, 1.055, .014, .005], [a+.28, 1.025, .065, .015],
    [a+.49, 1, .008, .004], [a+.54, .92, 0, -.014],
    [a+.66, 1.025, .022, .009], [a+.79, .975, 0, -.004],
    [a+1.02, 1, 0, 0], [timing.cycle, 1, 0, 0],
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
    if (playing && previous !== null) elapsed = (elapsed + Math.min(.05, (now-previous)/1000)) % timing.cycle;
    previous = now;
    const t = elapsed;
    const name = t < timing.question ? 'waiting' : t < timing.thinking ? 'question' : t < timing.answer ? 'thinking' : 'answer';
    if (stage.dataset.phase !== name) phase(name);
    typeAnswer(t);
    let [sy, lift, roll] = sample(t);
    // Longer answers extend the hop into a small side-to-side dance, then ease to rest.
    const danceStart = timing.answer+.8;
    const danceLength = typingDuration-.65;
    const danceProgress = Math.max(0, Math.min(1, (t-danceStart)/danceLength));
    const envelope = typingDuration > 1 ? Math.sin(Math.PI*danceProgress) : 0;
    const beat = Math.sin((t-danceStart)*Math.PI*5);
    const sway = .025*beat*envelope;
    roll += .045*beat*envelope;
    lift += .018*Math.abs(beat)*envelope;
    sy -= .025*(1-Math.abs(beat))*envelope;
    planted.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
    planted.position.y = .018 + lift;
    planted.position.z = sway;
    // Fast ease-out reaction on question arrival, with a small overshoot and settle.
    const reaction = Math.max(0, Math.min(1, (t-timing.question)/.18));
    const attention = 1-Math.pow(1-reaction,3)+.10*Math.sin(Math.PI*reaction);
    body.rotation.set(0, .16 + .22*attention + sway, .11*attention + roll);
    const thinking = smooth((t-timing.thinking)/.22) * (1-smooth((t-timing.answer)/.14));
    // A brief blink and gentle squint move all recessed layers with the curved face.
    const blink = t > 1.58 && t < 1.76 ? Math.sin((t-1.58)/.18*Math.PI) : 0;
    eyes.apply({open: [1-.10*thinking-.80*blink, 1-.18*thinking-.72*blink], width: 1-.025*thinking, gaze: -.018*attention, gazeY: .014*attention+.008*thinking});
    shadow.style.transform = `translateX(${-sway*390}px) scale(${1 + (1-sy)*.35-lift*1.5})`;
    shadow.style.opacity = String(1-lift*6);
    // Visible, read-only inspection evidence; no private renderer state needed by QA.
    stage.dataset.scaleY = sy.toFixed(4);
    stage.dataset.lift = lift.toFixed(4);
    stage.dataset.time = t.toFixed(3);
    stage.dataset.attention = attention.toFixed(4);
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
