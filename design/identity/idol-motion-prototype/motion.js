// Throwaway study: can this user-provided Gaussian object support controlled 12 fps emotes?
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { PlyLoader, SogsLoader, SplatMesh } from './vendor/visus-2.5.0.js';
import { FPS, CLIPS, poseAt } from './motion-poses.js';
import { PROFILES, SOURCE_BOUNDS } from './asset-profiles.js';
import { createEyes } from './hybrid/eye-rig.js';
import { eyePoseAt } from './hybrid/eye-poses.js';
const parameters = new URLSearchParams(location.search);
const profileKey = Object.hasOwn(PROFILES,parameters.get('asset')) ? parameters.get('asset') : 'hybrid';
const profile = PROFILES[profileKey];
const quality = document.querySelector('#quality');
quality.value = profileKey;
quality.onchange = () => {
  parameters.set('asset',quality.value);
  location.search=parameters.toString();
};

const stage = document.querySelector('#stage');
const status = document.querySelector('#status');
const slider = document.querySelector('#frame');
const label = document.querySelector('#frame-label');
const pause = document.querySelector('#pause');
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.prepend(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 16;
const pivot = new THREE.Group();
scene.add(pivot);
let mode = 'blink', frame = 0, started = 0, playing = false, ready = false;
let eyeRig=null;
const clipFPS=()=>CLIPS[mode].fps??FPS;
const supportPoints = [];
let renderScheduled=false, dirty=true;
function requestRender() {
  dirty=true;
  if (!playing && !renderScheduled) {
    renderScheduled=true;
    requestAnimationFrame(()=>{renderScheduled=false; controls.update(); dirty=false; renderer.render(scene,camera);});
  }
}
controls.addEventListener('change',requestRender);
const supportMatrix = new THREE.Matrix4();
const supportPoint = new THREE.Vector3();
const rotation = new THREE.Quaternion();
const euler = new THREE.Euler(0,0,0,'YXZ');
const scale = new THREE.Vector3();
const zero = new THREE.Vector3();
const duration = document.querySelector('#duration');
function drawFrame(f) {
  frame = f;
  const p = poseAt(mode,f);
  const radians = Math.PI/180;
  // Yaw is around world-up; lateral tilt follows the character through its spin.
  euler.set(p.roll*radians,p.yaw*radians,p.pitch*radians,'YXZ');
  rotation.setFromEuler(euler);
  const width = 1/Math.sqrt(p.height);
  scale.set(width,p.height,width); // Unit determinant: preserve volume.
  pivot.quaternion.copy(rotation);
  pivot.scale.copy(scale);
  // Approximate the rounded base using sampled Gaussian centers. Avoid rotating
  // through the floor; this is an artistic contact correction, not rigid physics.
  supportMatrix.compose(zero,rotation,scale);
  let lowest=Infinity;
  for (const point of supportPoints) {
    supportPoint.copy(point).applyMatrix4(supportMatrix);
    lowest=Math.min(lowest,supportPoint.y);
  }
  pivot.position.set(0,p.lift-(Number.isFinite(lowest)?lowest:0),p.sway);
  if(eyeRig)eyeRig.apply(eyePoseAt(mode,f));
  slider.max=CLIPS[mode].frames.length-1;
  slider.value=f;
  label.textContent=`Frame ${f+1} / ${CLIPS[mode].frames.length}`;
  duration.textContent=`${(CLIPS[mode].frames.length/clipFPS()).toFixed(2)} s · ${clipFPS()} fps`;
  requestRender();
}
function setPlaying(value) {
  playing = value;
  pause.textContent = value ? 'Pause' : 'Play';
  if (value) started = performance.now()-frame*1000/clipFPS();
  renderer.setAnimationLoop(value ? tick : null);
  requestRender();
}
function view(name) {
  const positions = { front:[3.6, .72, 0], quarter:[3.18,.85,1.8], back:[-3.6,.72,0], side:[0,.72,3.6], logo:[13.5,1.25,0] };
  camera.position.set(...positions[name]);
  controls.target.set(0,.52,0);
  controls.update();
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view === name)));
}
view('front');
new ResizeObserver(()=>{
  const {width,height} = stage.getBoundingClientRect();
  renderer.setSize(width,height);
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  requestRender();
}).observe(stage);
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
document.querySelectorAll('[data-motion]').forEach(b=>b.onclick=()=>{
  mode=b.dataset.motion;
  document.querySelectorAll('[data-motion]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  drawFrame(0);
  setPlaying(true);
});
pause.onclick=()=>{if(frame===CLIPS[mode].frames.length-1)drawFrame(0);setPlaying(!playing);};
slider.oninput=()=>{setPlaying(false);drawFrame(Number(slider.value));};
try {
  status.textContent=`Loading ${profile.title} · ${(profile.bytes/1e6).toFixed(2)} MB…`;
  const loader=profile.file.endsWith('.sog') ? new SogsLoader() : new PlyLoader();
  const data = await loader.loadAsync('./'+profile.file);
  // Runtime normalization only; the hybrid eye backing was prepared offline.
  const box={
    min:new THREE.Vector3(...SOURCE_BOUNDS.min),
    max:new THREE.Vector3(...SOURCE_BOUNDS.max),
    center:new THREE.Vector3(...SOURCE_BOUNDS.min).add(new THREE.Vector3(...SOURCE_BOUNDS.max)).multiplyScalar(.5)
  };
  const h=box.max.y-box.min.y;
  // Copy the support samples before the renderer may transfer its data buffers.
  const step=Math.max(1,Math.floor(data.numSplats/2048));
  for (let i=0;i<data.numSplats;i+=step) {
    supportPoints.push(new THREE.Vector3(
      (data.centers[i*3]-box.center.x)/h,
      (box.max.y-data.centers[i*3+1])/h,
      (box.center.z-data.centers[i*3+2])/h));
  }
  const mesh = new SplatMesh(data, { autoSort:true });
  mesh.sorter.addEventListener('updated',requestRender);
  mesh.scale.setScalar(1/h);
  // IDOL export is Y-down. Keep +X facing the camera and flip Y/Z.
  mesh.rotation.x = Math.PI;
  mesh.position.set(-box.center.x/h, box.max.y/h, box.center.z/h);
  pivot.add(mesh);
  if(profile.eyes)eyeRig=createEyes(pivot,box);
  else mode='rock';
  ready=true;
  status.textContent=`${profile.title} · ${data.numSplats.toLocaleString('en')} splats · ${(profile.bytes/1e6).toFixed(2)} MB`;
  if (loader.dispose) loader.dispose();
  document.querySelectorAll('button').forEach(b=>b.disabled=Boolean(b.dataset.eyeOnly&&!profile.eyes));
  document.querySelector(`[data-motion="${mode}"]`).setAttribute('aria-pressed','true');
  drawFrame(0);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
} catch (error) {
  status.textContent=`Could not render the model: ${error.message}`;
  console.error(error);
}
function tick(now) {
  if (ready && playing) {
    const next = Math.max(0,Math.floor((now-started)*clipFPS()/1000));
    if (next>=CLIPS[mode].frames.length) {
      if (document.querySelector('#loop').checked) {started=now;drawFrame(0);}
      else {drawFrame(CLIPS[mode].frames.length-1);setPlaying(false);}
    } else if (next!==frame) drawFrame(next);
  }
  controls.update();
  if (dirty) {dirty=false;renderer.render(scene,camera);}
}
