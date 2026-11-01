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
  track.style.setProperty('--duration', `${[106, 124, 116, 130][index]}s`);
  for (let copy = 0; copy < 2; copy++) {
    const group = document.createElement('ul');
    group.className = 'question-group';
    if (copy) group.setAttribute('aria-hidden', 'true');
    for (const question of row) {
      const item = document.createElement('li');
      item.className = 'question-chip';
      item.dataset.question = question.id;
      item.dataset.topic = question.topic;
      item.style.setProperty('--chip-width', `${question.width}px`);
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
  const candidates = [...tickers.querySelectorAll('.question-chip')].filter(item => {
    const rect = item.getBoundingClientRect();
    return item.dataset.topic === topic && item.dataset.question !== previousQuestion &&
      rect.left >= bounds.left + 96 && rect.right <= bounds.right - 96;
  });
  candidates.sort((a, b) => {
    const score = item => {
      const rect = item.getBoundingClientRect();
      const row = [...tickers.children].indexOf(item.closest('.question-ticker'));
      return Math.abs((rect.left + rect.right - bounds.left - bounds.right) / 2) +
        (row === step % rows.length ? 0 : 200);
    };
    return score(a) - score(b);
  });
  const chosen = candidates[0];
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
requestAnimationFrame(() => { highlight(); syncTimer(); });
