// Throwaway study: can this user-provided Gaussian object support controlled 12 fps emotes?
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { PlyLoader, SplatMesh } from './vendor/visus-2.5.0.js';
import { FPS, CLIPS, poseAt } from './motion-poses.js';

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
controls.maxDistance = 6;
const pivot = new THREE.Group();
scene.add(pivot);
let mode = 'rock', frame = 0, started = 0, playing = false, ready = false;
let supportPoints = [];
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
  slider.max=CLIPS[mode].frames.length-1;
  slider.value=f;
  label.textContent=`Frame ${f+1} / ${CLIPS[mode].frames.length}`;
  duration.textContent=`${(CLIPS[mode].frames.length/FPS).toFixed(2)} s · ${FPS} fps`;
}
function setPlaying(value) {
  playing = value;
  pause.textContent = value ? 'Pause' : 'Play';
  if (value) started = performance.now()-frame*1000/FPS;
}
function view(name) {
  const positions = { front:[3.6, .72, 0], quarter:[3.18,.85,1.8], back:[-3.6,.72,0], side:[0,.72,3.6] };
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
  const data = await new PlyLoader().loadAsync('./kettle.ply');
  // Normalize around the model's base; no Gaussian geometry/colors are edited.
  const box=data.boundingBox;
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
  mesh.scale.setScalar(1/h);
  // IDOL export is Y-down. Keep +X facing the camera and flip Y/Z.
  mesh.rotation.x = Math.PI;
  mesh.position.set(-box.center.x/h, box.max.y/h, box.center.z/h);
  pivot.add(mesh);
  ready=true;
  status.textContent=`${data.numSplats.toLocaleString('en')} splats · ready · fixed eyes`;
  document.querySelectorAll('button').forEach(b=>b.disabled=false);
  document.querySelector('[data-motion="rock"]').setAttribute('aria-pressed','true');
  drawFrame(0);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
} catch (error) {
  status.textContent=`Could not render the model: ${error.message}`;
  console.error(error);
}
renderer.setAnimationLoop(now=>{
  if (ready && playing) {
    const next = Math.floor((now-started)*FPS/1000);
    if (next>=CLIPS[mode].frames.length) {
      if (document.querySelector('#loop').checked) {started=now;drawFrame(0);}
      else {drawFrame(CLIPS[mode].frames.length-1);setPlaying(false);}
    } else if (next!==frame) drawFrame(next);
  }
  controls.update();
  renderer.render(scene,camera);
});
