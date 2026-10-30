// Review-only home: all conversations are authored, fictional, local examples.
const [copy, examples] = await Promise.all([
  fetch('./copy.json', { cache: 'no-store' }).then(response => response.json()),
  fetch('./demo-examples.json', { cache: 'no-store' }).then(response => response.json()),
]);
const apps = [ ['chatgpt', 'ChatGPT'], ['claude', 'Claude'], ['hermes', 'Hermes'], ['openclaw', 'OpenClaw'], ['pi', 'Pi'] ];
const $ = selector => document.querySelector(selector);
const language = $('#language');
const appearance = $('#appearance');
const themeOrder = ['system', 'light', 'dark'];
const system = matchMedia('(prefers-color-scheme: dark)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const query = new URLSearchParams(location.search);
let locale = query.get('lang') === 'es' ? 'es' : 'en';
let theme = ['light', 'dark', 'system'].includes(query.get('theme')) ? query.get('theme') : 'system';
let active = 0;
let phase = 'typing';
let elapsed = 0;
let lastTick = 0;
let paused = reduced.matches;
let visible = true;
let animation;

function icons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(icon => icon.style.setProperty('--icon', `url('./assets/lucide/${icon.dataset.icon}.svg')`));
}
function symbol(key) {
  const node = document.createElement('span');
  node.className = 'brand-symbol';
  node.style.setProperty('--symbol', `url('./assets/apps/${key}.svg')`);
  return node;
}
for (const [key, name] of apps) {
  const logo = document.createElement('div');
  logo.className = 'app-logo';
  logo.dataset.app = key;
  logo.append(symbol(key), document.createTextNode(name));
  $('#app-strip').append(logo);
  const tile = document.createElement('div');
  tile.className = 'app-tile';
  tile.append(symbol(key));
  $('#step-apps').append(tile);
}
for (let i = 1; i <= 5; i++) {
  const details = document.createElement('details');
  details.open = i === 1;
  details.innerHTML = `<summary><span data-copy="q${i}"></span><i class="icon" data-icon="plus"></i></summary><p data-copy="a${i}"></p>`;
  $('#faqs').append(details);
}
examples.forEach((_, index) => {
  const button = document.createElement('button');
  button.addEventListener('click', () => selectExample(index));
  $('#examples').append(button);
});
function applyTheme() {
  document.documentElement.dataset.theme = theme === 'system' ? (system.matches ? 'dark' : 'light') : theme;
  const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  const label = locale === 'es' ? `Apariencia: ${copy[theme].es}. Cambiar a ${copy[next].es}` : `Appearance: ${copy[theme].en}. Switch to ${copy[next].en}`;
  appearance.dataset.mode = theme;
  appearance.setAttribute('aria-label', label);
  appearance.title = label;
  appearance.querySelector('.icon').dataset.icon = { system: 'monitor', light: 'sun', dark: 'moon' }[theme];
  icons(appearance);
}
function updateUrl() {
  const params = new URLSearchParams(location.search);
  params.set('lang', locale);
  params.set('theme', theme);
  history.replaceState(null, '', `${location.pathname}?${params}`);
}
function translate() {
  document.documentElement.lang = locale;
  document.querySelectorAll('[data-copy]').forEach(node => node.textContent = copy[node.dataset.copy][locale]);
  language.value = locale;
  $('#language-label').textContent = locale === 'es' ? 'Idioma' : 'Language';
  applyTheme();
  $('.mobile-menu').setAttribute('aria-label', locale === 'es' ? 'Abrir navegación' : 'Open navigation');
  $('#demo-description').textContent = locale === 'es' ? 'Demostración animada con cuatro conversaciones ficticias. Puedes pausar o elegir un ejemplo. Las conversaciones reales se hacen en tu app de IA.' : 'Animated demonstration with four fictional conversations. Pause or choose an example. Actual conversations happen in your AI app.';
  $('#review-note').textContent = locale === 'es' ? 'Prototipo de diseño · Datos ficticios · Sin conexión a cuentas · Logos del ecosistema MCP; requisitos según app.' : 'Design prototype · Fictional data · No account connection · MCP ecosystem logos; requirements vary by app.';
  [...$('#examples').children].forEach((button, index) => button.setAttribute('aria-label', `${locale === 'es' ? 'Ejemplo' : 'Example'} ${index + 1}: ${examples[index][locale].name}`));
  updatePause();
  selectExample(active);
}
function showAnswer() {
  const item = examples[active][locale];
  $('#demo-question').textContent = item.question;
  const reply = $('#demo-reply');
  reply.replaceChildren();
  const title = document.createElement('strong');
  title.className = 'reply-title';
  title.textContent = item.title;
  reply.append(title);
  for (const paragraph of item.paragraphs ?? []) {
    const node = document.createElement('p');
    node.innerHTML = paragraph;
    reply.append(node);
  }
  for (const [left, right] of item.rows ?? []) {
    const row = document.createElement('div');
    row.className = 'answer-line';
    const first = document.createElement('span');
    const second = document.createElement('span');
    first.textContent = left;
    second.textContent = right;
    row.append(first, second);
    reply.append(row);
  }
  if (item.note) {
    const note = document.createElement('p');
    note.className = 'minor';
    note.textContent = item.note;
    reply.append(note);
  }
}
function renderPhase() {
  const question = examples[active][locale].question;
  const typingDuration = 600 + question.length * 38;
  phase = elapsed < typingDuration ? 'typing' : elapsed < typingDuration + 650 ? 'sent' : 'answer';
  $('.hero-chat').dataset.phase = phase;
  $('.hero-chat').dataset.example = String(active);
  $('#demo-input').dataset.typing = String(phase === 'typing' && !paused);
  $('#demo-input').value = phase === 'typing' ? question.slice(0, Math.floor(Math.max(0, elapsed - 350) / 38)) : '';
  $('#demo-question').style.visibility = phase === 'typing' ? 'hidden' : 'visible';
  $('#demo-reply').hidden = phase !== 'answer';
  return typingDuration + 650 + 5600;
}
function selectExample(index) {
  active = index;
  elapsed = paused ? 10000 : 0;
  showAnswer();
  [...$('#examples').children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  renderPhase();
}
function updatePause() {
  $('#pause').setAttribute('aria-label', locale === 'es' ? (paused ? 'Reproducir ejemplos' : 'Pausar ejemplos') : (paused ? 'Play examples' : 'Pause examples'));
  $('#pause').setAttribute('aria-pressed', String(paused));
  $('#pause .icon').dataset.icon = paused ? 'play' : 'pause';
  icons($('#pause'));
}
function tick(now) {
  if (!paused && visible && !document.hidden) {
    elapsed += lastTick ? Math.min(now - lastTick, 100) : 0;
    const duration = renderPhase();
    if (elapsed > duration) selectExample((active + 1) % examples.length);
  }
  lastTick = now;
  animation = requestAnimationFrame(tick);
}
$('#pause').addEventListener('click', () => {
  paused = !paused;
  if (!paused && elapsed >= 10000) elapsed = 0;
  renderPhase();
  updatePause();
});
language.addEventListener('change', () => { locale = language.value; translate(); updateUrl(); });
appearance.addEventListener('click', () => {
  theme = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  applyTheme();
  updateUrl();
});
system.addEventListener('change', applyTheme);
reduced.addEventListener('change', () => { paused = reduced.matches; updatePause(); selectExample(active); });
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .15 }).observe($('.hero-chat'));
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  selectExample(Number(button.dataset.example));
  $('.hero-chat').scrollIntoView({ block: 'center', behavior: reduced.matches ? 'instant' : 'smooth' });
}));
$('.mobile-menu').addEventListener('click', () => {
  const open = $('.mobile-menu').getAttribute('aria-expanded') !== 'true';
  $('.mobile-menu').setAttribute('aria-expanded', String(open));
  $('#navigation').dataset.open = String(open);
});
$('#navigation').addEventListener('click', event => {
  if (event.target.closest('a')) { $('.mobile-menu').setAttribute('aria-expanded', 'false'); $('#navigation').dataset.open = 'false'; }
});
function notice(privacy = false) {
  $('#notice-title').textContent = locale === 'es' ? 'Prototipo de diseño' : 'Design prototype';
  $('#notice-body').textContent = locale === 'es' ? (privacy ? 'La política de privacidad completa se enlazará en la web final. Este prototipo sólo usa datos ficticios y no conecta ninguna cuenta.' : 'El acceso real se conectará al implementar la web. Esta vista sólo sirve para revisar el diseño y la animación.') : (privacy ? 'The full privacy policy will be linked in the final website. This prototype uses fictional data and connects no accounts.' : 'Real sign-in will be connected during implementation. This view is for reviewing the design and animation.');
  $('#notice-close').textContent = locale === 'es' ? 'Entendido' : 'Got it';
  $('#prototype-notice').showModal();
}
document.querySelectorAll('[data-signin]').forEach(button => button.addEventListener('click', () => notice()));
$('#privacy').addEventListener('click', () => notice(true));
window.addEventListener('pagehide', () => cancelAnimationFrame(animation));
applyTheme();
translate();
icons();
animation = requestAnimationFrame(tick);
