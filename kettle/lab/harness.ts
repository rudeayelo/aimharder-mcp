// Minimal page for automated checks: one Kettle filling the viewport, driven
// only through the public API. Query: ?surface=landing&drag=1&camera=front&entrance=little-hop&offscreen
import { createKettle, type CameraPreset, type Surface } from '../src/index.ts';

const params = new URLSearchParams(location.search);
const stage = document.querySelector<HTMLElement>('#stage')!;
// Starts out of view; a test brings it back by clearing the transform.
if (params.has('offscreen')) stage.style.transform = 'translateY(-5000px)';
const kettle = createKettle({
  container: stage,
  asset: '/assets/kettle-body-32k.sog',
  surface: (params.get('surface') ?? 'landing') as Surface,
  interactions: params.has('drag') ? { drag: params.get('drag') === '1' } : {},
  camera: (params.get('camera') ?? 'front') as CameraPreset,
  ...(params.has('entrance') ? { entrance: params.get('entrance') || null } : {}),
  ...(params.has('poster') ? { poster: '/assets/kettle-poster.png' } : {}),
});
if (params.has('transparent')) document.documentElement.classList.add('transparent');
Object.assign(window, { kettle });
kettle.ready.then(
  () => document.documentElement.setAttribute('data-kettle', kettle.state.status),
  (error: unknown) => {
    document.documentElement.setAttribute('data-kettle', 'error');
    console.error(error);
  },
);
