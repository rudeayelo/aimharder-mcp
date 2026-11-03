import {lang, t, localize} from './public-copy.js';
export function mountPublicNavigation({reloadAppearance = false} = {}) {
  const modes = ['light','dark','system'], params = new URLSearchParams(location.search);
  let mode = modes.includes(params.get('theme')) ? params.get('theme') : (reloadAppearance ? 'light' : 'system');
  const system = matchMedia('(prefers-color-scheme:dark)');
  const language = document.querySelector('#language');
  language.value = lang;
  const urlFor = (file, hash = '') => {
    const url = new URL(file, location.href);
    url.search = new URLSearchParams(file==='hero-motion-prototype.html'?{lang,theme:mode,reply:'long'}:{lang,theme:mode});
    url.hash = hash; return url;
  };
  const apply = () => {
    document.documentElement.dataset.theme = mode === 'system' ? (system.matches?'dark':'light') : mode;
    const next = modes[(modes.indexOf(mode)+1)%modes.length];
    document.querySelector('#appearance').setAttribute('aria-label', lang==='es'?`Tema: ${t(mode[0].toUpperCase()+mode.slice(1))}. Cambiar a ${t(next[0].toUpperCase()+next.slice(1))}.`:`Appearance: ${mode}. Switch to ${next}.`);
    const icon = mode==='system'?'monitor':mode==='dark'?'moon':'sun';
    document.querySelector('#appearance-icon').style.setProperty('--icon',`url('./assets/lucide/${icon}.svg')`);
    for (const link of document.querySelectorAll('[data-home],[data-home-anchor]')) link.href=urlFor('hero-motion-prototype.html',link.dataset.homeAnchor||'');
    for (const link of document.querySelectorAll('[data-signin]')) link.href=urlFor('login-study.html');
    for (const link of document.querySelectorAll('[data-privacy],#privacy-self')) link.href=urlFor('privacy-study.html');
  };
  if(reloadAppearance)document.title='AIHarder — '+t('Home');
  localize(document.querySelector('header'));
  localize(document.querySelector('footer'));
  localize(document.querySelector('.privacy-review'));
  apply();
  language.addEventListener('change', () => {const url=new URL(location.href);url.searchParams.set('lang',language.value);location.assign(url);});
  document.querySelector('#appearance').addEventListener('click', () => {
    mode=modes[(modes.indexOf(mode)+1)%modes.length];
    const url=new URL(location.href);url.searchParams.set('theme',mode);
    if(reloadAppearance) location.assign(url);else {history.replaceState(null,'',url);apply();}
  });
  system.addEventListener('change',()=>{if(mode==='system'){if(reloadAppearance)location.reload();else apply();}});
  return {refresh:apply};
}
