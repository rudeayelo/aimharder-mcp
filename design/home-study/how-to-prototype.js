import {t,localize} from './public-copy.js';
// Throwaway UI demos. Synthetic data, no form submission, installation or AI call.
const section = document.querySelector('#how-it-works');
const params = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const inspect = params.has('howAt') ? Math.max(0, +params.get('howAt') || 0) : null;
const still = params.get('motion') === 'off' || reduced.matches || inspect !== null;
const symbol = key => `assets/apps/${key === 'hermes' || key === 'openclaw' ? `${key}-selfhst-light.svg` : key === 'pi' ? 'pi-mono-light.png' : `${key}-light.png`}`;
const icon = name => `<i class="icon" style="--icon:url('./assets/lucide/${name}.svg')" aria-hidden="true"></i>`;
const cursor = `<img class="demo-cursor" src="assets/cursor-macos-style.svg" alt="">`;
section.innerHTML = `
  <div id="how-grainient" class="how-backdrop" aria-hidden="true"></div>
  <div class="how-inner">
    <h2 class="how-heading" id="how-heading">How you get started</h2>
    <div class="how-grid">
      <figure class="how-step">
        <div class="how-preview" id="connect-preview" role="img" aria-label="Illustrative animation: a fictional AimHarder account is filled in, connected and marked successful.">
          <div class="connect-demo" aria-hidden="true">
            <img class="connect-logo" src="assets/apps/aimharder.svg" alt="">
            <div class="demo-field"><span class="demo-field-label">Username</span><span class="demo-field-value" data-user data-placeholder="Your AimHarder username"></span></div>
            <div class="demo-field"><span class="demo-field-label">Password</span><span class="demo-field-value" data-password data-placeholder="Your password"></span></div>
            <div class="demo-action connect-action" data-action="disabled">Connect</div>
          </div>${cursor}
        </div>
        <figcaption><div class="how-step-title"><span class="how-step-number">01</span><h3>Connect your account</h3></div><p class="how-step-description">Link your AimHarder account to bring your training into the conversation.</p></figcaption>
      </figure>
      <figure class="how-step">
        <div class="how-preview" id="install-preview" role="img" aria-label="Illustrative animation: scroll through AI apps, choose ChatGPT, and install AIHarder.">
          <div class="services-demo" aria-hidden="true"><p class="services-heading">Your AI apps</p><div class="services-window"><div class="services-list">
            ${[['claude','Claude'],['hermes','Hermes'],['openclaw','OpenClaw'],['pi','Pi'],['chatgpt','ChatGPT'],['other','Other clients']].map(([key,name]) => `<div class="service-option" data-app="${key}">${key === 'other' ? '<i class="service-symbol icon" style="--icon:url(\'./assets/lucide/message-circle.svg\')"></i>' : `<img class="service-symbol" src="${symbol(key)}" alt="">`}<span class="service-name">${name}</span>${key === 'chatgpt' ? '<div class="demo-action service-action" data-action="ready">Install</div>' : ''}</div>`).join('')}
          </div></div></div><div class="service-track" aria-hidden="true"><div class="service-thumb"></div></div>${cursor}
        </div>
        <figcaption><div class="how-step-title"><span class="how-step-number">02</span><h3>Choose your AI app</h3></div><p class="how-step-description">Pick the AI app you already use and add AIHarder.</p></figcaption>
      </figure>
      <figure class="how-step">
        <div class="how-preview chat-preview" id="chat-preview" data-service="chatgpt" role="img" aria-label="Fictional conversations with ChatGPT, Claude and Hermes about bookings, workouts and recorded activity.">
          <div class="chat-demo" aria-hidden="true"><div class="chat-demo-header"><img data-chat-logo src="${symbol('chatgpt')}" alt=""><span data-chat-service>ChatGPT</span></div><div class="chat-messages"><p class="chat-question"></p><div class="chat-assistant"><img class="chat-avatar" src="${symbol('chatgpt')}" alt=""><div class="chat-answer"><p class="chat-answer-name">ChatGPT</p><div class="chat-thinking"><span></span><span></span><span></span></div><p class="chat-answer-copy"></p></div></div></div></div>
        </div>
        <figcaption><div class="how-step-title"><span class="how-step-number">03</span><h3>Just ask</h3></div><p class="how-step-description">Ask about your classes, workouts and records. Your assistant takes it from there.</p></figcaption>
      </figure>
    </div>
  </div>`;
section.dataset.still = String(still);
localize(section);
const connect = section.querySelector('#connect-preview');
const connectContent = connect.querySelector('.connect-demo');
const user = connect.querySelector('[data-user]');
const password = connect.querySelector('[data-password]');
const connectAction = connect.querySelector('.demo-action');
const connectCursor = connect.querySelector('.demo-cursor');
const install = section.querySelector('#install-preview');
const installContent = install.querySelector('.services-demo');
const listWindow = install.querySelector('.services-window');
const list = install.querySelector('.services-list');
const targetRow = list.querySelector('[data-app=chatgpt]');
const installAction = targetRow.querySelector('.demo-action');
const installCursor = install.querySelector('.demo-cursor');
const thumb = install.querySelector('.service-thumb');
const chat = section.querySelector('#chat-preview');
const question = chat.querySelector('.chat-question');
const assistant = chat.querySelector('.chat-assistant');
const answer = chat.querySelector('.chat-answer-copy');
const thinking = chat.querySelector('.chat-thinking');
const conversations = [
  {key:'chatgpt', name:'ChatGPT', question:'When is my next booking?', answer:'Tomorrow at 19:00 — WOD. You also have a booking on Thursday at 18:00.'},
  {key:'claude', name:'Claude', question:'What’s tomorrow’s WOD?', answer:'Strength: back squat, 5 × 5.\nConditioning: a 12-minute AMRAP.'},
  {key:'hermes', name:'Hermes', question:'Show my activity this week.', answer:'You’ve logged 3 activity entries this week. Your latest entry was Monday’s WOD.'},
].map(item=>({...item,question:t(item.question),answer:t(item.answer)}));
const smooth = n => { n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n); };
const progress = (t, start, duration) => Math.max(0, Math.min(1, (t - start) / duration));
const fade = (t, end) => smooth(t / .45) * (1 - smooth((t - end) / .65));
const text = (node, value) => { if (node.textContent !== value) node.textContent = value; };
function action(node, phase, labels) {
  if (node.dataset.action === phase) return;
  node.dataset.action = phase;
  node.innerHTML = (phase === 'loading' ? icon('loader-circle') : phase === 'success' ? icon('check') : '') + `<span>${t(labels[phase])}</span>`;
}
let geometry;
function measure() {
  const c = connect.getBoundingClientRect(), b = connectAction.getBoundingClientRect();
  const viewport = listWindow.getBoundingClientRect(), parent = install.getBoundingClientRect();
  geometry = {
    connectWidth:c.width, connectHeight:c.height,
    connectTarget:[b.left - c.left + b.width * .72, b.top - c.top + b.height * .5],
    installWidth:parent.width, installHeight:parent.height,
    scroll:Math.max(0, list.scrollHeight - listWindow.clientHeight),
    installTarget:[viewport.left - parent.left + targetRow.offsetLeft + installAction.offsetLeft + installAction.offsetWidth * .5,
      viewport.top - parent.top + targetRow.offsetTop + targetRow.offsetHeight * .5 - Math.max(0, list.scrollHeight - listWindow.clientHeight)],
  };
}
function pointer(node, from, to, u, visible, pressed) {
  const x = from[0] + (to[0] - from[0]) * smooth(u), y = from[1] + (to[1] - from[1]) * smooth(u);
  node.style.transform = `translate3d(${x}px,${y}px,0) scale(${pressed ? .88 : 1})`;
  node.style.opacity = visible.toFixed(3);
}
let provider = -1;
function render(time) {
  const t = time % 10.5;
  const connectPhase = t < 3.1 ? 'disabled' : t < 3.85 ? 'ready' : t < 5.1 ? 'loading' : 'success';
  connect.dataset.phase = connectPhase;
  connectContent.style.opacity = fade(t, 8.9).toFixed(3);
  text(user, 'alex@example.com'.slice(0, Math.floor(progress(t, .6, 1.45) * 16)));
  text(password, '•'.repeat(Math.floor(progress(t, 2.1, 1) * 8)));
  action(connectAction, connectPhase, {disabled:'Connect',ready:'Connect',loading:'Connecting',success:'Connected'});
  const cursorVisibility = smooth((t - 2.75) / .3) * (1 - smooth((t - 4.25) / .35)) * fade(t, 8.9);
  pointer(connectCursor, [geometry.connectWidth * .91, geometry.connectHeight * .94], geometry.connectTarget, progress(t, 2.75, .9), cursorVisibility, t >= 3.7 && t < 3.85);
  const u = time % 11.5;
  const scroll = smooth(progress(u, 1.1, 1.7));
  const installPhase = u < 4.15 ? 'ready' : u < 5.65 ? 'loading' : 'success';
  install.dataset.phase = u < 1.1 ? 'waiting' : u < 2.8 ? 'scrolling' : u < 3.2 ? 'hovering' : installPhase;
  installContent.style.opacity = fade(u, 9.5).toFixed(3);
  list.style.transform = `translateY(${-geometry.scroll * scroll}px)`;
  thumb.style.transform = `translateY(${148 * scroll}px)`;
  thumb.parentElement.style.opacity = fade(u, 9.5).toFixed(3);
  targetRow.classList.toggle('is-hovered', u >= 3.2);
  action(installAction, installPhase, {ready:'Install',loading:'Installing',success:'Installed'});
  const installVisible = smooth((u - .7) / .3) * (1 - smooth((u - 4.55) / .35)) * fade(u, 9.5);
  const hover = [geometry.installWidth * .58, geometry.installTarget[1]];
  if (u < 3.25) pointer(installCursor, [geometry.installWidth * .85, geometry.installHeight * .52], hover, progress(u, .7, 2.5), installVisible, false);
  else pointer(installCursor, hover, geometry.installTarget, progress(u, 3.25, .7), installVisible, u >= 4 && u < 4.15);
  const index = Math.floor(time / 8) % conversations.length, v = time % 8, conversation = conversations[index];
  if (provider !== index) {
    provider = index;
    chat.dataset.service = conversation.key;
    chat.querySelector('[data-chat-logo]').src = chat.querySelector('.chat-avatar').src = symbol(conversation.key);
    text(chat.querySelector('[data-chat-service]'), conversation.name);
    text(chat.querySelector('.chat-answer-name'), conversation.name);
    text(question, conversation.question);
  }
  const ending = 1 - smooth((v - 6.5) / .7);
  question.style.opacity = (smooth((v - .3) / .25) * ending).toFixed(3);
  assistant.style.opacity = (smooth((v - 1.05) / .25) * ending).toFixed(3);
  chat.querySelector('.chat-messages').style.transform = `translateY(${-5 * (1 - ending)}px)`;
  thinking.style.display = v >= 1.05 && v < 2.1 ? 'flex' : 'none';
  const characters = Math.floor(progress(v, 2.1, 1.6) * conversation.answer.length);
  text(answer, conversation.answer.slice(0, characters));
  chat.dataset.phase = v < 1.05 ? 'question' : v < 2.1 ? 'thinking' : v < 6.5 ? 'answer' : 'reset';
  chat.dataset.characters = String(characters);
  section.dataset.time = time.toFixed(3);
}
const review = document.querySelector('.review-controls');
const replaySteps = document.createElement('button'); replaySteps.textContent = t('Replay steps'); replaySteps.type = 'button'; replaySteps.id = 'how-replay';
const pauseSteps = document.createElement('button'); pauseSteps.textContent = t('Pause steps'); pauseSteps.type = 'button'; pauseSteps.id = 'how-pause';
review.append(replaySteps, pauseSteps);
let elapsed = inspect ?? (still ? 6.2 : 0), previous = null, request = null, visible = false, paused = false;
function canPlay() { return !still && !paused && visible && !document.hidden; }
function schedule() {
  section.dataset.paused = String(!canPlay());
  if (canPlay() && request === null) request = requestAnimationFrame(frame);
  else if (!canPlay() && request !== null) { cancelAnimationFrame(request); request = null; previous = null; }
}
function frame(now) {
  request = null;
  if (!canPlay()) { previous = null; return; }
  if (previous !== null && now - previous < 1000 / 30) { schedule(); return; }
  if (previous !== null) elapsed += Math.min(.05, (now - previous) / 1000);
  previous = now;
  render(elapsed);
  schedule();
}
function controls() { pauseSteps.textContent = t(paused ? 'Play steps' : 'Pause steps'); schedule(); }
pauseSteps.addEventListener('click', () => { paused = !paused; previous = null; controls(); });
replaySteps.addEventListener('click', () => { elapsed = 0; paused = false; previous = null; render(elapsed); controls(); });
document.querySelector('#pause')?.addEventListener('click', () => { paused = document.querySelector('.scene')?.dataset.paused === 'true'; previous = null; controls(); });
document.querySelector('#replay')?.addEventListener('click', () => { elapsed = 0; paused = false; previous = null; render(elapsed); controls(); });
document.addEventListener('visibilitychange', () => { previous = null; schedule(); });
const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); previous = null; schedule(); }, {threshold:.08});
observer.observe(section);
const resize = new ResizeObserver(() => { measure(); render(elapsed); });
resize.observe(connect); resize.observe(install);
await document.fonts.ready;
measure(); render(elapsed); controls();
if (location.hash === '#how-it-works') section.scrollIntoView();
pauseSteps.disabled = replaySteps.disabled = still;
window.addEventListener('pagehide', () => { if (request !== null) cancelAnimationFrame(request); request = null; previous = null; });
window.addEventListener('pageshow', schedule);
