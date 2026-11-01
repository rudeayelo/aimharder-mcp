// Decorative examples only: the emphasis is timed, not a live prompt control.
const section = document.querySelector('#questions');
const {topics, rows} = await fetch('./question-ticker-data.json').then(response => {
  if (!response.ok) throw new Error('Question examples could not be loaded.');
  return response.json();
});
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const still = params.get('ticker') === 'still' || params.get('motion') === 'off' || reduced.matches;
section.dataset.still = String(still);
const heading = document.createElement('h2');
heading.id = 'questions-heading';
heading.className = 'questions-heading';
heading.append('Your classes, workouts and records,', document.createElement('br'), 'one question away');
const topicList = document.createElement('ul');
topicList.className = 'question-topics';
topicList.setAttribute('aria-label', 'Example topics');
for (const topic of topics) {
  const item = document.createElement('li');
  item.className = 'question-topic';
  item.dataset.topic = topic.id;
  const icon = document.createElement('i');
  icon.className = 'icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.style.setProperty('--icon', `url('./assets/lucide/${topic.icon}.svg')`);
  item.append(icon, document.createTextNode(topic.label));
  topicList.append(item);
}
const tickers = document.createElement('div');
tickers.className = 'question-tickers';
tickers.setAttribute('aria-label', 'Examples of questions you can ask');
for (const [index, row] of rows.entries()) {
  const viewport = document.createElement('div');
  viewport.className = 'question-ticker';
  const track = document.createElement('div');
  track.className = 'question-track';
  track.style.setProperty('--duration', `${[130, 154, 142, 160][index]}s`);
  for (let copy = 0; copy < 2; copy++) {
    const group = document.createElement('ul');
    group.className = 'question-group';
    if (copy) group.setAttribute('aria-hidden', 'true');
    for (const question of row) {
      const item = document.createElement('li');
      item.className = 'question-text';
      item.dataset.question = question.id;
      item.dataset.topic = question.topic;
      item.textContent = question.text;
      group.append(item);
    }
    track.append(group);
  }
  viewport.append(track);
  tickers.append(viewport);
}
section.append(heading, topicList, tickers);
let step = 0;
let paused = false;
let timer;
let previousQuestion;
function highlight() {
  const bounds = tickers.getBoundingClientRect();
  const topic = topics[step % topics.length].id;
  const fade = Math.min(96, bounds.width * .08);
  const candidates = [...tickers.querySelectorAll('.question-text')].map(item => {
    const rect = item.getBoundingClientRect();
    const center = (rect.left + rect.right) / 2;
    const visible = Math.max(0, Math.min(rect.right, bounds.right - fade) -
      Math.max(rect.left, bounds.left + fade)) / rect.width;
    const row = [...tickers.children].indexOf(item.closest('.question-ticker'));
    return {item, center, visible, score: (1 - visible) * 800 +
      Math.abs(center - (bounds.left + bounds.right) / 2) +
      (row === step % rows.length ? 0 : 200)};
  }).filter(({item, center, visible}) => item.dataset.topic === topic &&
    item.dataset.question !== previousQuestion && visible >= .6 &&
    center >= bounds.left + fade && center <= bounds.right - fade);
  candidates.sort((a, b) => a.score - b.score);
  const chosen = candidates[0]?.item;
  if (!chosen) return;
  section.querySelectorAll('.is-featured').forEach(item => item.classList.remove('is-featured'));
  chosen.classList.add('is-featured');
  topicList.querySelector(`[data-topic="${topic}"]`).classList.add('is-featured');
  section.dataset.activeTopic = topic;
  section.dataset.activeQuestion = chosen.dataset.question;
  previousQuestion = chosen.dataset.question;
  step++;
}
function syncTimer() {
  clearInterval(timer);
  section.dataset.paused = String(paused || document.hidden);
  if (!still && !paused && !document.hidden) timer = setInterval(highlight, 3000);
}
// Share the existing prototype review Pause control; no extra product controls.
document.querySelector('#pause')?.addEventListener('click', () => {
  paused = document.querySelector('.scene')?.dataset.paused === 'true';
  syncTimer();
});
document.querySelector('#replay')?.addEventListener('click', () => {
  paused = false;
  step = 0;
  previousQuestion = undefined;
  highlight();
  syncTimer();
});
document.addEventListener('visibilitychange', syncTimer);
window.addEventListener('pagehide', () => clearInterval(timer));
window.addEventListener('pageshow', syncTimer);
await document.fonts.ready;
requestAnimationFrame(() => { highlight(); syncTimer(); });
