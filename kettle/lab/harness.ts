// Minimal page for automated checks: one Kettle filling the viewport, driven
// only through the public API. Query: ?surface=landing&drag=1&camera=front
import { createKettle, type CameraPreset, type Surface } from '../src/index.ts';

const params = new URLSearchParams(location.search);
const stage = document.querySelector<HTMLElement>('#stage')!;
const kettle = createKettle({
  container: stage,
  asset: '/assets/kettle-body-32k.sog',
  surface: (params.get('surface') ?? 'landing') as Surface,
  interactions: params.has('drag') ? { drag: params.get('drag') === '1' } : {},
  camera: (params.get('camera') ?? 'front') as CameraPreset,
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
