// Decorative 32k kettle: existing body, curved eye rig and stop-motion clips.
import {FPS, CLIPS, poseAt} from '../identity/idol-motion-prototype/motion-poses.js';
import {eyePoseAt} from '../identity/idol-motion-prototype/hybrid/eye-poses.js';
const stage = document.querySelector('.footer-kettle');
const shadow = stage.querySelector('.footer-kettle-ground');
const params = new URLSearchParams(location.search);
const wide = matchMedia('(min-width: 1200px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const frozen = params.get('motion') === 'off' || reduced.matches;
const clips = ['blink', 'rock', 'curious', 'look', 'hop'];
const inspectionClip = clips.includes(params.get('footerEmote')) ? params.get('footerEmote') : null;
const inspectionFrame = Math.max(0, Math.floor(Number(params.get('footerFrame')) || 0));
let visible = false, paused = false, loading = false, ready = false, disposed = false;
let request = null, previous = null, elapsed = 0, nextAt = .8, started = 0;
let mode = 'idle', lastMode = '', lastFrame = -1, draw = null, cleanup = null;
stage.dataset.renderer = 'poster';
const canPlay = () => !disposed && ready && wide.matches && visible && !document.hidden && !paused && !frozen && !inspectionClip;
function schedule() {
  stage.dataset.paused = String(!canPlay());
  if (canPlay() && request === null) request = requestAnimationFrame(tick);
  else if (!canPlay() && request !== null) { cancelAnimationFrame(request); request = null; previous = null; }
}
function tick(now) {
  request = null;
  if (!canPlay()) { previous = null; return; }
  if (previous !== null) elapsed += Math.min(.05, (now - previous) / 1000);
  previous = now;
  if (mode === 'idle' && elapsed >= nextAt) {
    const choices = clips.filter(clip => clip !== lastMode);
    mode = choices[Math.floor(Math.random() * choices.length)];
    lastMode = mode; started = elapsed; lastFrame = -1;
    stage.dataset.lastEmote = mode;
    stage.dataset.emoteCount = String((Number(stage.dataset.emoteCount) || 0) + 1);
  }
  let frame = mode === 'idle' ? 0 : Math.floor((elapsed - started) * (CLIPS[mode].fps ?? FPS));
  if (mode !== 'idle' && frame >= CLIPS[mode].frames.length) {
    mode = 'idle'; frame = 0; nextAt = elapsed + 1.5 + Math.random() * 2.5; lastFrame = -1;
  }
  if (frame !== lastFrame) { draw(mode === 'idle' ? 'blink' : mode, frame); lastFrame = frame; }
  stage.dataset.emote = mode;
  stage.dataset.time = elapsed.toFixed(3);
  schedule();
}
async function start() {
  if (loading || ready || disposed || !wide.matches || !visible || frozen) return;
  loading = true;
  let loader;
  try {
    const [THREE, {SogsLoader, SplatMesh}, {SOURCE_BOUNDS}, {createEyes}, {installAffineSort}] = await Promise.all([
      import('three'), import('../identity/idol-motion-prototype/vendor/visus-2.5.0.js'),
      import('../identity/idol-motion-prototype/asset-profiles.js'),
      import('../identity/idol-motion-prototype/hybrid/eye-rig.js'),
      import('../identity/idol-motion-prototype/affine-sort.js'),
    ]);
    loader = new SogsLoader();
    const data = await loader.loadAsync('../identity/idol-motion-prototype/hybrid/kettle-body-32k.sog');
    if (disposed) return;
    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setSize(512,512,false); renderer.setPixelRatio(1); renderer.setClearColor(0,0);
    cleanup = () => renderer.dispose();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden','true');
    stage.append(renderer.domElement);
    const scene = new THREE.Scene();
    // Widen the frustum for hop headroom, then preserve the neutral poster's crop.
    const frustumScale = Math.tan(13*Math.PI/180)/Math.tan(17.5*Math.PI/180);
    const displayScale = 195/(405*frustumScale);
    Object.assign(renderer.domElement.style, {
      width: `${512*displayScale}px`, height: `${512*displayScale}px`,
      left: `${110-(256+.5*frustumScale)*displayScale}px`,
      top: `${248-(256+217*frustumScale)*displayScale}px`,
    });
    const camera = new THREE.PerspectiveCamera(35,1,.01,100);
    camera.position.set(3,.76,0); camera.lookAt(0,.5,0);
    const min = new THREE.Vector3(...SOURCE_BOUNDS.min), max = new THREE.Vector3(...SOURCE_BOUNDS.max);
    const center = min.clone().add(max).multiplyScalar(.5), height = max.y - min.y;
    const bounds = {min,max,center}, support = [];
    const step = Math.max(1,Math.floor(data.numSplats/2048));
    for (let i=0;i<data.numSplats;i+=step) support.push(new THREE.Vector3((data.centers[i*3]-center.x)/height,(max.y-data.centers[i*3+1])/height,(center.z-data.centers[i*3+2])/height));
    const pivot = new THREE.Group(), body = new THREE.Group();
    body.matrixAutoUpdate = false; scene.add(pivot); pivot.add(body);
    const mesh = new SplatMesh(data,{autoSort:true}); installAffineSort(mesh);
    mesh.scale.setScalar(1/height); mesh.rotation.x = Math.PI;
    mesh.position.set(-center.x/height,max.y/height,center.z/height); body.add(mesh);
    const eyes = createEyes(body,bounds);
    const matrix = new THREE.Matrix4(), point = new THREE.Vector3(), zero = new THREE.Vector3();
    const euler = new THREE.Euler(0,0,0,'YXZ');
    const render = () => { if (!disposed && wide.matches && visible && !document.hidden) renderer.render(scene,camera); };
    draw = (clip, frame) => {
      const pose = poseAt(clip,frame), radians = Math.PI/180;
      pivot.quaternion.setFromEuler(euler.set(pose.roll*radians,pose.yaw*radians,pose.pitch*radians,'YXZ'));
      const width = 1/Math.sqrt(pose.height); pivot.scale.set(width,pose.height,width);
      body.matrix.set(1,pose.bend,0,0,0,1,0,0,0,0,1,0,0,0,0,1); body.matrixWorldNeedsUpdate = true;
      matrix.compose(zero,pivot.quaternion,pivot.scale).multiply(body.matrix);
      let lowest = Infinity;
      for (const sample of support) { point.copy(sample).applyMatrix4(matrix); lowest = Math.min(lowest,point.y); }
      pivot.position.set(0,pose.lift-(Number.isFinite(lowest)?lowest:0),pose.sway);
      eyes.apply(eyePoseAt(clip,frame));
      shadow.style.transform = `scale(${1-pose.lift*1.3})`;
      shadow.style.opacity = String(Math.max(.3,1-pose.lift*2));
      stage.dataset.frame = String(frame); stage.dataset.pose = clip;
      render();
    };
    mesh.sorter.addEventListener('updated', () => { if (!ready || disposed) return; render(); stage.dataset.renderer = 'ready'; });
    cleanup = () => {
      mesh.dispose?.();
      scene.traverse(object => { object.geometry?.dispose(); if (object.material) for (const material of [object.material].flat()) material.dispose(); });
      renderer.dispose();
    };
    ready = true;
    draw(inspectionClip ?? 'blink', inspectionClip ? Math.min(inspectionFrame,CLIPS[inspectionClip].frames.length-1) : 0);
    if (inspectionClip) stage.dataset.emote = inspectionClip;
    schedule();
  } catch {
    ready = false; draw = null;
    if (request !== null) cancelAnimationFrame(request); request = null;
    cleanup?.(); stage.querySelector('canvas')?.remove(); stage.dataset.renderer = 'poster';
  } finally { loader?.dispose?.(); loading = false; }
}
const observer = new IntersectionObserver(entries => {
  visible = entries.some(entry => entry.isIntersecting); previous = null;
  if (visible) { start(); if (draw) draw(inspectionClip ?? (mode === 'idle' ? 'blink' : mode), inspectionClip ? Math.min(inspectionFrame,CLIPS[inspectionClip].frames.length-1) : Math.max(0,lastFrame)); }
  schedule();
});
observer.observe(stage);
wide.addEventListener('change', () => { previous = null; start(); schedule(); });
document.addEventListener('visibilitychange', () => { previous = null; schedule(); });
for (const id of ['pause','replay']) document.querySelector('#'+id)?.addEventListener('click', () => {
  paused = document.querySelector('.scene')?.dataset.paused === 'true'; previous = null;
  if (id === 'replay') { mode = 'idle'; elapsed = 0; nextAt = .8; lastFrame = -1; }
  schedule();
});
window.addEventListener('pagehide', event => { if (request !== null) cancelAnimationFrame(request); request = null; previous = null; if (!event.persisted) { disposed = true; cleanup?.(); observer.disconnect(); } });
window.addEventListener('pageshow', schedule);
reduced.addEventListener('change', () => location.reload());
