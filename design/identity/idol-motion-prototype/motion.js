// Throwaway study: can this user-provided Gaussian object support controlled 12 fps emotes?
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { PlyLoader, SplatMesh } from './vendor/visus-2.5.0.js';

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
const neutral = { y: 0, roll: 0, pitch: 0, yaw: 0 };
const tracks = {
  rock: [[0,0,0],[3,0,-10],[7,0,14],[11,0,-9],[15,0,5],[19,0,-2],[22,0,0],[23,0,0]],
  hop: [[0,0,0],[3,-.035,-6],[5,.05,7],[9,.30,12],[12,.23,5],[15,0,-11],[18,.015,7],[21,0,-3],[22,0,0],[23,0,0]],
  spin: [[0,0,0,0],[3,-.025,-9,0],[5,.10,-15,30],[9,.30,-30,145],[12,.26,-22,245],[15,.08,-9,340],[16,0,10,360],[19,.01,-7,360],[22,0,0,360],[23,0,0,360]]
};
function poseAt(f) {
  if (f === 0 || f === 23) return neutral;
  const track = tracks[mode];
  let i = 1;
  while (track[i][0] < f) i++;
  const a = track[i-1], b = track[i];
  let t = (f-a[0])/(b[0]-a[0]);
  t = t*t*(3-2*t);
  const mix = k => (a[k] || 0) + ((b[k] || 0)-(a[k] || 0))*t;
  return {y: mix(1), roll: mix(2)*Math.PI/180, yaw: mix(3)*Math.PI/180, pitch: 0};
}
function drawFrame(f) {
  frame = f;
  const p = poseAt(f);
  // The asset faces +X: rotate about X for a visible lateral rock.
  pivot.position.y = p.y;
  pivot.rotation.set(p.roll, p.yaw, p.pitch);
  slider.value = f;
  label.textContent = `Frame ${f+1} / 24`;
}
function setPlaying(value) {
  playing = value;
  pause.textContent = value ? 'Pause' : 'Play';
  if (value) started = performance.now()-frame*1000/12;
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
pause.onclick=()=>{if(frame===23)drawFrame(0);setPlaying(!playing);};
slider.oninput=()=>{setPlaying(false);drawFrame(Number(slider.value));};
try {
  const data = await new PlyLoader().loadAsync('./kettle.ply');
  const mesh = new SplatMesh(data, { autoSort:true });
  // Normalize around the model's base; no Gaussian geometry/colors are edited.
  const box=data.boundingBox;
  const h=box.max.y-box.min.y;
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
    const next = Math.floor((now-started)*12/1000);
    if (next>23) {
      if (document.querySelector('#loop').checked) {started=now;drawFrame(0);}
      else {drawFrame(23);setPlaying(false);}
    } else if (next!==frame) drawFrame(next);
  }
  controls.update();
  renderer.render(scene,camera);
});
