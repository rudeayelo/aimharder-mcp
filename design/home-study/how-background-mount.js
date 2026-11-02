// The same app-integrated Grainient as the hero, with the How to palette.
import {mountGrainient} from './grainient-background.js';
const container = document.querySelector('#how-grainient');
const params = new URLSearchParams(location.search);
const dark = document.documentElement.dataset.theme === 'dark';
const still = params.get('motion') === 'off' || params.has('howAt') ||
  !document.querySelector('#motion-status') || matchMedia('(prefers-reduced-motion: reduce)').matches;
container.dataset.renderer = 'css-fallback';
const dispose = mountGrainient(container, {
  colors: [dark ? '#0d1521' : '#ffffff', '#0065e0'],
  angle: 180, flow: .8, silk: .5, grainAmount: .08,
  scale: 1.4, grainSize: 1.3, saturation: .99, stir: .95,
  clickSwirl: false, intro: false, lightMode: !dark,
  speed: still ? 0 : 1, grainAnimated: !still, interactive: false, dpr: 1,
});
if (dispose) {
  container.dataset.renderer = 'webgl2';
  container.dataset.motion = still ? 'still' : 'animated';
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
}
