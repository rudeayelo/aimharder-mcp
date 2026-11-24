// The Kettle lab: review, tune and place the Kettle's clips. It uses only the
// module's public API (`../src/index.ts`). Development tool; never deployed.
import {
  CAMERA_PRESETS,
  CLIP_DEFINITIONS,
  DEFAULT_EYE_LOOK,
  DEFAULT_TUNING,
  GAZE_FOLLOW,
  SURFACES,
  TUNABLE_IDS,
  createKettle,
  parseTuning,
  resolveTuning,
  serializeTuning,
  type CameraPreset,
  type ClipTuning,
  type EyeLook,
  type Kettle,
  type KettleOptions,
  type ParamRange,
  type Tuning,
} from '../src/index.ts';

const ASSET = '/assets/kettle-body-32k.sog';
/** The shipped poster (design/assets/kettle/kettle-poster-front.png), shown without WebGL. */
const POSTER = '/assets/kettle-poster.png';
const app = document.querySelector<HTMLElement>('#app')!;
const root = document.documentElement;

// ---------- small DOM helpers ----------
type Attrs = Record<string, string | number | boolean | undefined>;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Array<Node | string | null>): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (name === 'text') element.textContent = String(value);
    else element.setAttribute(name, value === true ? '' : String(value));
  }
  for (const child of children) if (child !== null) element.append(child);
  return element;
}
const button = (label: string, attrs: Attrs = {}) => h('button', { type: 'button', ...attrs, text: label });

const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`kettle-lab:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(`kettle-lab:${key}`, JSON.stringify(value));
    } catch {
      /* private mode: the lab still works without persistence */
    }
  },
};

/** Clipboard on localhost; falls back to selecting text on plain-HTTP tailnet URLs. */
async function copyText(text: string, fallback: HTMLTextAreaElement): Promise<string> {
  fallback.value = text;
  try {
    await navigator.clipboard.writeText(text);
    return 'Copied to the clipboard.';
  } catch {
    fallback.focus();
    fallback.select();
    return document.execCommand('copy') ? 'Copied.' : 'Select the text below and copy it.';
  }
}

// ---------- shared state ----------
/**
 * Format of the saved lab state. 1 (#146): tuned values only. 2 (#148): also
 * the module defaults each entry was tuned against, so an entry is dropped
 * once the module's defaults for that clip change. Marks and notes are kept.
 */
const STATE_VERSION = 2;
/** Clips whose module defaults changed between format 1 and 2; their format-1 tuning is dropped. */
const CHANGED_SINCE_FORMAT_1 = ['double-blink', 'curiosity', 'look-around', 'rock', 'tilted-spin', 'poke'];
const defaultsOf = (id: string) => JSON.stringify(DEFAULT_TUNING[id] ?? null);

function loadTuning(): Tuning {
  const saved = storage.get<Record<string, unknown>>('tuning', {});
  const base = storage.get<number>('version', 1) >= 2
    ? storage.get<Record<string, string>>('tuning-base', {})
    : Object.fromEntries(TUNABLE_IDS.filter((id) => !CHANGED_SINCE_FORMAT_1.includes(id)).map((id) => [id, defaultsOf(id)]));
  // Entries for removed clips, or tuned against other defaults, are dropped one by one.
  const current = Object.entries(saved).filter(([id]) => TUNABLE_IDS.includes(id) && base[id] === defaultsOf(id));
  try {
    return parseTuning(Object.fromEntries(current));
  } catch {
    return {};
  }
}
function saveTuning(): void {
  storage.set('tuning', tuning);
  storage.set('tuning-base', Object.fromEntries(Object.keys(tuning).map((id) => [id, defaultsOf(id)])));
  storage.set('version', STATE_VERSION);
}
let tuning: Tuning = loadTuning();
saveTuning();
/** Eye floor colour and minimum light tried in the lab (the module's `eyes` option). */
function loadEyes(): EyeLook {
  const saved = storage.get<Partial<EyeLook>>('eyes', {});
  const color = typeof saved.color === 'string' && /^#[0-9a-f]{6}$/i.test(saved.color) ? saved.color : DEFAULT_EYE_LOOK.color;
  const minLight = typeof saved.minLight === 'number' && saved.minLight >= 0 && saved.minLight <= 1 ? saved.minLight : DEFAULT_EYE_LOOK.minLight;
  return { color, minLight };
}
let eyeLook = loadEyes();
function setEyeLook(next: EyeLook): void {
  eyeLook = next;
  storage.set('eyes', eyeLook);
  for (const kettle of kettles) kettle.setEyes(eyeLook);
}

const kettles = new Set<Kettle>();
const reducedToggle = document.querySelector<HTMLInputElement>('#reduced')!;
const darkToggle = document.querySelector<HTMLInputElement>('#dark')!;
const reducedSetting = () => (reducedToggle.checked ? true : 'auto') as true | 'auto';

function makeKettle(container: HTMLElement, options: Omit<KettleOptions, 'container' | 'asset'>): Kettle {
  const kettle = createKettle({ container, asset: ASSET, poster: POSTER, tuning, eyes: eyeLook, reducedMotion: reducedSetting(), ...options });
  kettles.add(kettle);
  kettle.ready.catch((error: unknown) => console.error(error));
  return kettle;
}
function dropKettles(): void {
  for (const kettle of kettles) kettle.destroy();
  kettles.clear();
}
reducedToggle.checked = storage.get('reduced', false);
darkToggle.checked = storage.get('dark', false);
root.dataset.theme = darkToggle.checked ? 'dark' : 'light';
reducedToggle.addEventListener('change', () => {
  storage.set('reduced', reducedToggle.checked);
  for (const kettle of kettles) kettle.setReducedMotion(reducedSetting());
});
darkToggle.addEventListener('change', () => {
  storage.set('dark', darkToggle.checked);
  root.dataset.theme = darkToggle.checked ? 'dark' : 'light';
});

function setTuning(id: string, values: ClipTuning): void {
  tuning = { ...tuning, [id]: values };
  saveTuning();
  for (const kettle of kettles) kettle.setTuning({ [id]: values });
}

// ---------- decisions ----------
type Mark = 'keep' | 'adjust' | 'remove' | '';
const marks = storage.get<Record<string, { mark: Mark; note: string }>>('marks', {});
function decisionsMarkdown(): string {
  const rows = [...CLIP_DEFINITIONS.map((d) => [d.id, d.name]), [GAZE_FOLLOW.id, GAZE_FOLLOW.name]].map(([id, name]) => {
    const entry = marks[id!] ?? { mark: '', note: '' };
    return `| \`${id}\` | ${name} | ${entry.mark || '—'} | ${entry.note.replace(/\|/g, '\\|') || ''} |`;
  });
  const changed = Object.keys(tuning).length ? `\n\nTuned values (paste into \`kettle/src/tuning.json\`):\n\n\`\`\`json\n${serializeTuning(tuning)}\n\`\`\`` : '';
  return `### Kettle lab decisions\n\n| Clip | Name | Keep / adjust / remove | Note |\n| --- | --- | --- | --- |\n${rows.join('\n')}${changed}\n`;
}

// ---------- viewer ----------
function viewer(): HTMLElement {
  const stored = storage.get('selected', 'double-blink');
  let selected = TUNABLE_IDS.includes(stored) ? stored : 'double-blink';
  const stage = h('div', { class: 'stage', 'data-stage': 'viewer' });
  const orbitLayer = h('div', { class: 'orbit-layer', hidden: true });
  stage.append(orbitLayer);
  const kettle = makeKettle(stage, { surface: 'none', camera: 'front' });
  Object.assign(window, { kettle });

  // Clip list with decision markers.
  const list = h('ol', { class: 'clip-list' });
  const items = [...CLIP_DEFINITIONS.map((d) => ({ id: d.id, name: d.name, kind: d.kind as string })), { id: GAZE_FOLLOW.id, name: GAZE_FOLLOW.name, kind: 'reaction' }];
  for (const item of items) {
    const entry = (marks[item.id] ??= { mark: '', note: '' });
    const select = h('select', { 'aria-label': `Decision for ${item.name}` },
      ...(['', 'keep', 'adjust', 'remove'] as const).map((value) => h('option', { value, text: value || '—', selected: entry.mark === value })));
    select.addEventListener('change', () => {
      entry.mark = select.value as Mark;
      storage.set('marks', marks);
    });
    const note = h('input', { type: 'text', placeholder: 'Note', value: entry.note, 'aria-label': `Note for ${item.name}` });
    note.addEventListener('input', () => {
      entry.note = note.value;
      storage.set('marks', marks);
    });
    const pick = button(item.name, { class: 'clip-name', 'data-clip': item.id, 'aria-pressed': String(item.id === selected) });
    pick.addEventListener('click', () => select_(item.id, true));
    list.append(h('li', { 'data-kind': item.kind }, pick, h('div', { class: 'mark' }, select, note)));
  }
  const exportArea = h('textarea', { class: 'export', rows: 6, readonly: true, 'aria-label': 'Exported Markdown' });
  const exportStatus = h('p', { class: 'hint', role: 'status' });
  const exportButton = button('Copy decisions as Markdown');
  exportButton.addEventListener('click', async () => (exportStatus.textContent = await copyText(decisionsMarkdown(), exportArea)));

  // Transport.
  const play = button('Play', { 'data-action': 'play' });
  const loop = h('input', { type: 'checkbox', id: 'loop' });
  const back = button('◀ Frame', { 'aria-label': 'Previous exposure' });
  const forward = button('Frame ▶', { 'aria-label': 'Next exposure' });
  const slider = h('input', { type: 'range', min: 0, max: 0, value: 0, 'aria-label': 'Exposure' });
  const readout = h('output', { class: 'readout' });
  const speed = h('select', { 'aria-label': 'Speed' }, ...[0.1, 0.25, 0.5, 1, 1.5, 2].map((v) => h('option', { value: v, text: `${v}×`, selected: v === 1 })));
  play.addEventListener('click', () => {
    if (selected === GAZE_FOLLOW.id) return;
    const s = kettle.state;
    if (s.clip === selected && s.paused && s.frame < s.frames - 1) kettle.resume();
    else if (s.playing) kettle.pause();
    else void kettle.play(selected, { loop: loop.checked, speed: Number(speed.value) });
  });
  loop.addEventListener('change', () => kettle.setLoop(loop.checked));
  speed.addEventListener('change', () => kettle.setSpeed(Number(speed.value)));
  const ensureLoaded = () => {
    if (kettle.state.clip !== selected) {
      void kettle.play(selected, { loop: loop.checked, speed: Number(speed.value) });
      kettle.pause();
      kettle.seek(0);
    }
  };
  back.addEventListener('click', () => { ensureLoaded(); kettle.seek(kettle.state.frame - 1); });
  forward.addEventListener('click', () => { ensureLoaded(); kettle.seek(kettle.state.frame + 1); });
  slider.addEventListener('input', () => { ensureLoaded(); kettle.seek(Number(slider.value)); });

  // Camera.
  const cameras = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Camera' });
  let orbit = { ...CAMERA_PRESETS.front };
  const setPreset = (name: CameraPreset | 'orbit') => {
    for (const b of cameras.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.camera === name));
    orbitLayer.hidden = name !== 'orbit';
    if (name !== 'orbit') {
      orbit = { ...CAMERA_PRESETS[name] };
      kettle.setCamera(name);
    }
  };
  for (const name of ['front', 'three-quarter', 'side', 'eye-detail', 'orbit'] as const) {
    const b = button(name === 'orbit' ? 'Free orbit' : name.replace('-', ' '), { 'data-camera': name, 'aria-pressed': String(name === 'front') });
    b.addEventListener('click', () => setPreset(name));
    cameras.append(b);
  }
  // The orbit follows the pointer that started it; other fingers are ignored.
  let drag: { id: number; x: number; y: number } | null = null;
  orbitLayer.addEventListener('pointerdown', (e) => {
    if (drag) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    orbitLayer.setPointerCapture(e.pointerId);
  });
  orbitLayer.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    orbit.azimuth -= (e.clientX - drag.x) * 0.4;
    orbit.elevation = Math.max(-30, Math.min(75, orbit.elevation + (e.clientY - drag.y) * 0.3));
    drag = { id: drag.id, x: e.clientX, y: e.clientY };
    kettle.setCamera(orbit);
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
    orbitLayer.addEventListener(type, (e) => {
      if (drag?.id === e.pointerId) drag = null;
    });
  }
  orbitLayer.addEventListener('wheel', (e) => {
    e.preventDefault();
    orbit.distance = Math.max(1.2, Math.min(9, orbit.distance * (1 + e.deltaY * 0.001)));
    kettle.setCamera(orbit);
  }, { passive: false });

  // Tuning.
  const tuningPanel = h('div', { class: 'tuning-fields' });
  const jsonArea = h('textarea', { class: 'json', rows: 8, spellcheck: false, 'aria-label': 'Clip JSON' });
  const jsonStatus = h('p', { class: 'hint', role: 'status' });
  const copyButton = button('Copy as JSON');
  const applyButton = button('Apply pasted JSON');
  const resetButton = button('Reset to module values');
  const current = (id: string) => resolveTuning(id, tuning[id] ?? DEFAULT_TUNING[id]);
  /** The selected clip in the `tuning.json` format, plus `eyes`: the module's `eyes` option, not part of `tuning.json`. */
  const copied = () => JSON.stringify({ ...JSON.parse(serializeTuning({ [selected]: current(selected) })), eyes: eyeLook }, null, 2);
  copyButton.addEventListener('click', async () => (jsonStatus.textContent = await copyText(copied(), jsonArea)));
  applyButton.addEventListener('click', () => {
    try {
      const data: unknown = JSON.parse(jsonArea.value);
      // Anything but a plain object gets the module's own error, before `eyes` is taken out.
      if (data === null || typeof data !== 'object' || Array.isArray(data)) parseTuning(data as object);
      const { eyes, ...clips } = data as Record<string, unknown>;
      const parsed = parseTuning(clips);
      if (eyes !== undefined) {
        const look = eyes as Partial<EyeLook>;
        if (typeof look.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(look.color) || typeof look.minLight !== 'number' || look.minLight < 0 || look.minLight > 1) {
          throw new Error('eyes needs a #rrggbb color and a minLight from 0 to 1');
        }
        setEyeLook({ color: look.color, minLight: look.minLight });
        renderEyes();
      }
      for (const [id, values] of Object.entries(parsed)) setTuning(id, values);
      jsonStatus.textContent = `Applied ${[...Object.keys(parsed), ...(eyes !== undefined ? ['eyes'] : [])].join(', ')}.`;
      renderTuning();
    } catch (error) {
      jsonStatus.textContent = `Not applied: ${(error as Error).message}`;
    }
  });
  resetButton.addEventListener('click', () => {
    const { [selected]: _, ...rest } = tuning;
    tuning = rest;
    saveTuning();
    for (const k of kettles) k.setTuning({ [selected]: DEFAULT_TUNING[selected]! });
    renderTuning();
  });
  function field(group: 'timing' | 'amount', name: string, range: ParamRange, value: number): HTMLElement {
    const input = h('input', { type: 'range', min: range.min, max: range.max, step: range.step, value, 'data-param': `${group}.${name}` });
    const number = h('input', { type: 'number', min: range.min, max: range.max, step: range.step, value, 'aria-label': range.label });
    const update = (raw: string) => {
      const values = current(selected);
      values[group][name] = Number(raw);
      setTuning(selected, values);
      input.value = number.value = String(values[group][name]);
      jsonArea.value = copied();
    };
    input.addEventListener('input', () => update(input.value));
    number.addEventListener('change', () => update(number.value));
    return h('label', { class: 'field' }, h('span', { text: range.label + (group === 'timing' ? ' (exposures)' : '') }), input, number);
  }
  function renderTuning(): void {
    tuningPanel.replaceChildren();
    const definition = selected === GAZE_FOLLOW.id ? GAZE_FOLLOW : CLIP_DEFINITIONS.find((d) => d.id === selected)!;
    const values = current(selected);
    tuningPanel.append(h('h3', { text: 'Timing' }));
    for (const [name, range] of Object.entries(definition.timing)) tuningPanel.append(field('timing', name, range, values.timing[name]!));
    tuningPanel.append(h('h3', { text: 'Amount' }));
    for (const [name, range] of Object.entries(definition.amount)) tuningPanel.append(field('amount', name, range, values.amount[name]!));
    jsonArea.value = copied();
  }
  // Eye floor colour and its minimum light, for every Kettle in the lab.
  const eyeColor = h('input', { type: 'color', 'aria-label': 'Eye colour' });
  const eyeMinLight = h('input', { type: 'range', min: 0, max: 1, step: 0.01, 'aria-label': 'Eye floor minimum light' });
  const eyeMinLightValue = h('output', {});
  function renderEyes(): void {
    eyeColor.value = eyeLook.color;
    eyeMinLight.value = String(eyeLook.minLight);
    eyeMinLightValue.textContent = String(eyeLook.minLight);
  }
  // Each control changes only its own value, so an imported value the slider cannot show survives a colour change.
  const updateEyes = (change: Partial<EyeLook>) => {
    setEyeLook({ ...eyeLook, ...change });
    renderEyes();
    jsonArea.value = copied();
  };
  eyeColor.addEventListener('input', () => updateEyes({ color: eyeColor.value }));
  eyeMinLight.addEventListener('input', () => updateEyes({ minLight: Number(eyeMinLight.value) }));
  const resetEyes = button('Brand accent');
  resetEyes.addEventListener('click', () => {
    setEyeLook({ ...DEFAULT_EYE_LOOK });
    renderEyes();
    jsonArea.value = copied();
  });
  renderEyes();
  const eyeControls = h('div', { class: 'row eye-controls' },
    h('label', {}, 'Eye colour ', eyeColor), h('label', {}, 'Floor minimum light ', eyeMinLight, ' ', eyeMinLightValue), resetEyes);
  const title = h('h2', { class: 'clip-title' });
  const meta = h('p', { class: 'hint' });
  function select_(id: string, autoplay: boolean): void {
    selected = id;
    storage.set('selected', id);
    for (const b of list.querySelectorAll<HTMLButtonElement>('[data-clip]')) b.setAttribute('aria-pressed', String(b.dataset.clip === id));
    const definition = CLIP_DEFINITIONS.find((d) => d.id === id);
    title.textContent = definition?.name ?? GAZE_FOLLOW.name;
    meta.textContent = definition
      ? `${definition.kind === 'reaction' ? 'Reaction' : 'Emote'} · reduced motion: ${definition.reducedMotion === 'eyes' ? 'eyes only' : 'still pose'}${definition.ownsGaze ? ' · drives the gaze' : ''}`
      : 'Continuous layer, tuned here and tried in the interaction playground.';
    renderTuning();
    if (definition && autoplay) void kettle.play(id, { loop: loop.checked, speed: Number(speed.value) });
  }
  kettle.subscribe((s) => {
    slider.max = String(Math.max(0, s.frames - 1));
    slider.value = String(s.frame);
    const seconds = s.frames ? (s.frames / 12).toFixed(2) : '0';
    readout.textContent = s.clip ? `Exposure ${s.frame + 1} / ${s.frames} · ${seconds} s at 12 fps` : s.skipped ? `${s.skipped}: still pose under reduced motion` : 'Neutral';
    play.textContent = s.playing ? 'Pause' : 'Play';
  });
  select_(selected, false);

  return h('section', { class: 'viewer', 'data-section': 'viewer' },
    h('aside', { class: 'panel clips' }, h('h2', { text: 'Clips' }), list, exportButton, exportStatus, exportArea),
    h('div', { class: 'center' },
      h('div', { class: 'heading' }, title, meta),
      stage,
      h('div', { class: 'transport' }, play, h('label', {}, loop, ' Loop'), back, forward, slider, speed, readout),
      cameras,
      eyeControls),
    h('aside', { class: 'panel tuning' }, h('h2', { text: 'Tuning' }), tuningPanel, h('div', { class: 'row' }, copyButton, applyButton, resetButton), jsonStatus, jsonArea));
}

// ---------- interaction playground ----------
function playground(): HTMLElement {
  const stage = h('div', { class: 'stage', 'data-stage': 'playground' });
  const kettle = makeKettle(stage, { surface: 'none', camera: 'front', interactions: { gaze: true, poke: true, drag: true } });
  Object.assign(window, { kettle });
  const log = h('ol', { class: 'log', 'aria-live': 'polite' });
  const toggles = h('fieldset', { class: 'panel' }, h('legend', { text: 'Interactions' }));
  for (const name of ['gaze', 'poke', 'drag'] as const) {
    const input = h('input', { type: 'checkbox', checked: true, 'data-interaction': name });
    input.addEventListener('change', () => kettle.setInteractions({ [name]: input.checked }));
    toggles.append(h('label', {}, input, ` ${{ gaze: 'Gaze following (mouse or pen)', poke: 'Poke on click or tap', drag: 'Drag to turn, release reaction' }[name]}`));
  }
  const timing = h('fieldset', { class: 'panel' }, h('legend', { text: 'Stepped (12 fps) or smooth' }));
  for (const name of ['gaze', 'drag'] as const) {
    const select = h('select', { 'data-timing': name, 'aria-label': `${name} timing` },
      h('option', { value: 'stepped', text: 'Stepped 12 fps', selected: true }),
      h('option', { value: 'smooth', text: 'Smooth (display rate)' }));
    select.addEventListener('change', () => kettle.setTiming({ [name]: select.value as 'stepped' | 'smooth' }));
    timing.append(h('label', {}, `${name === 'gaze' ? 'Gaze following' : 'Drag rotation'}: `, select));
  }
  const surfaces = h('fieldset', { class: 'panel' }, h('legend', { text: 'Surface presets' }));
  const presets: Record<string, { gaze: boolean; poke: boolean; drag: boolean }> = {
    Landing: SURFACES.landing.interactions,
    Footer: SURFACES.footer.interactions,
    Portal: SURFACES.portal.interactions,
    Everything: { gaze: true, poke: true, drag: true },
  };
  for (const [name, value] of Object.entries(presets)) {
    const b = button(name);
    b.addEventListener('click', () => {
      kettle.setInteractions(value);
      for (const input of toggles.querySelectorAll<HTMLInputElement>('[data-interaction]')) input.checked = value[input.dataset.interaction as 'gaze'];
    });
    surfaces.append(b);
  }
  const guide = button('Portal guide cue');
  guide.addEventListener('click', async () => {
    kettle.setGaze({ x: 0.8, y: 0.3 });
    await kettle.play('curiosity');
    await kettle.play('double-blink');
    kettle.setGaze(null);
  });
  const celebrate = button('Portal celebration');
  celebrate.addEventListener('click', () => void kettle.play('tilted-spin'));
  surfaces.append(guide, celebrate);
  surfaces.append(h('p', { class: 'hint', text: 'Touch: open the browser device toolbar (touch emulation). Touch never moves the gaze; a tap pokes.' }));
  let last = '';
  kettle.subscribe((s) => {
    const line = `${s.clip ?? 'idle'}${s.dragging ? ' · dragging' : ''}${s.skipped ? ` · ${s.skipped} skipped (reduced motion)` : ''}`;
    if (line === last) return;
    last = line;
    log.prepend(h('li', { text: `${new Date().toLocaleTimeString()} ${line} · gaze ${s.gaze.x.toFixed(2)}, ${s.gaze.y.toFixed(2)} · turn ${s.dragTurn.toFixed(0)}°` }));
    while (log.children.length > 12) log.lastElementChild!.remove();
  });
  return h('section', { class: 'playground', 'data-section': 'playground' },
    h('div', { class: 'center' }, stage),
    h('aside', { class: 'controls' }, toggles, timing, surfaces, h('h3', { text: 'Events' }), log));
}

// ---------- compositions ----------
function wordmark(): HTMLElement {
  return h('span', { class: 'wordmark' }, h('span', { class: 'lead', text: 'AI' }), h('span', { class: 'rest', text: 'HARDER' }));
}
function lines(count: number, cls = 'line'): HTMLElement[] {
  return Array.from({ length: count }, () => h('span', { class: cls }));
}
function compositions(): HTMLElement {
  const heroStage = h('div', { class: 'kettle-slot hero-kettle' });
  const hero = h('article', { class: 'mock hero', 'aria-label': 'Landing hero mockup' },
    h('header', { class: 'mock-nav' }, wordmark(), h('span', { class: 'nav-links' }, ...lines(3, 'pill')), h('span', { class: 'mock-button secondary', text: 'Sign in' })),
    h('div', { class: 'hero-body' },
      h('div', { class: 'hero-copy' },
        h('p', { class: 'eyebrow', text: 'Placeholder headline' }),
        h('div', { class: 'headline' }, ...lines(2, 'block')),
        h('div', { class: 'paragraph' }, ...lines(3)),
        h('div', { class: 'row' }, h('span', { class: 'mock-button', text: 'Primary action' }), h('span', { class: 'mock-button secondary', text: 'Secondary' }))),
      h('div', { class: 'hero-art' }, h('div', { class: 'bubble', text: 'When is my next class?' }), heroStage)));
  const footerStage = h('div', { class: 'kettle-slot footer-kettle' });
  const footer = h('article', { class: 'mock footer', 'aria-label': 'Footer mockup' },
    h('div', { class: 'footer-cta' }, h('div', { class: 'headline small' }, ...lines(1, 'block')), footerStage),
    h('footer', { class: 'footer-bar' }, wordmark(), h('span', { class: 'nav-links' }, ...lines(4, 'pill')), h('span', { class: 'caption', text: 'Placeholder legal line' })));
  const portalStage = h('div', { class: 'kettle-slot portal-kettle' });
  const dialog = h('div', { class: 'dialog', hidden: true },
    h('div', { class: 'dialog-card' }, h('div', { class: 'kettle-slot dialog-kettle' }), h('p', { class: 'dialog-title', text: 'Placeholder success message' }), h('span', { class: 'mock-button', text: 'Done' })));
  const portal = h('article', { class: 'mock portal', 'aria-label': 'Portal onboarding mockup' },
    h('header', { class: 'mock-nav' }, wordmark(), h('span', { class: 'avatar' })),
    h('div', { class: 'portal-body' },
      h('ol', { class: 'steps' }, h('li', { class: 'current', text: 'Connect AimHarder' }), h('li', { text: 'Choose your AI app' }), h('li', { text: 'Ask a first question' })),
      h('div', { class: 'card' },
        h('div', { class: 'guide' }, portalStage, h('div', { class: 'bubble guide-bubble', text: 'First, connect your AimHarder account.' })),
        h('div', { class: 'paragraph' }, ...lines(3)),
        h('div', { class: 'row' }, h('span', { class: 'mock-button', text: 'Connect AimHarder' })))),
    dialog);
  const replayGuide = button('Replay guide cue');
  const celebrate = button('Show celebration dialog');
  const controls = h('div', { class: 'row composition-controls' }, replayGuide, celebrate, h('span', { class: 'hint', text: 'Theme and reduced motion follow the header toggles.' }));

  queueMicrotask(() => {
    // The module's surface defaults, as the product will use them.
    const heroKettle = makeKettle(heroStage, { surface: 'landing', camera: 'stage' });
    const footerKettle = makeKettle(footerStage, { surface: 'footer', camera: 'stage' });
    const portalKettle = makeKettle(portalStage, { surface: 'portal', camera: 'three-quarter', shadow: false });
    let dialogKettle: Kettle | null = null;
    Object.assign(window, { heroKettle, footerKettle, portalKettle });
    const guideCue = async () => {
      await portalKettle.ready;
      portalKettle.setGaze({ x: 0.9, y: 0.25 });
      await portalKettle.play('curiosity');
      await portalKettle.play('double-blink');
      portalKettle.setGaze(null);
    };
    void guideCue();
    replayGuide.addEventListener('click', () => void guideCue());
    celebrate.addEventListener('click', async () => {
      dialog.hidden = false;
      dialogKettle ??= makeKettle(dialog.querySelector<HTMLElement>('.dialog-kettle')!, { surface: 'portal', camera: 'stage' });
      Object.assign(window, { dialogKettle });
      await dialogKettle.ready;
      await dialogKettle.play('tilted-spin');
    });
    dialog.addEventListener('click', () => (dialog.hidden = true));
  });
  return h('section', { class: 'compositions', 'data-section': 'compositions' }, controls, hero, footer, portal);
}

// ---------- tabs ----------
const sections: Record<string, () => HTMLElement> = { viewer, playground, compositions };
function show(tab: string): void {
  dropKettles();
  app.replaceChildren((sections[tab] ?? viewer)());
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-tab]')) b.setAttribute('aria-pressed', String(b.dataset.tab === tab));
  storage.set('tab', tab);
  if (location.hash.slice(1) !== tab) history.replaceState(null, '', `#${tab}`);
}
for (const b of document.querySelectorAll<HTMLButtonElement>('[data-tab]')) b.addEventListener('click', () => show(b.dataset.tab!));
window.addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1) || storage.get('tab', 'viewer'));
