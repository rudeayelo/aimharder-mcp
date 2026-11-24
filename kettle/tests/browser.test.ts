// The Kettle in Chromium (software WebGL), served by the lab under the strict
// CSP the module must run with, driven through real input, the lab's controls
// and the module's public state.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser, type BrowserContextOptions, type Page } from 'playwright-core';
import { startLabServer, type LabServer } from '../lab/server.ts';
import { CHROMIUM_ARGS, chromiumPath } from '../lab/chromium.ts';
import { createClip, parseTuning, type KettleState } from '../src/index.ts';
import { kettleBlueShare, readPng } from './png.ts';

/** The policy the module must run under, written out here rather than read from the server. */
const EXPECTED_CSP =
  "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

let lab: LabServer;
let browser: Browser;

beforeAll(async () => {
  lab = await startLabServer({ port: 0 });
  browser = await chromium.launch({ executablePath: chromiumPath(), args: CHROMIUM_ARGS });
});
afterAll(async () => {
  await browser?.close();
  await lab?.close();
});

/** Counts live WebGL contexts: created and not yet released with WEBGL_lose_context. */
function trackContexts(): void {
  const live = new Set<object>();
  Object.assign(window, { liveContexts: () => live.size });
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
    const context = (getContext as (...a: unknown[]) => unknown).call(this, type, ...rest) as (WebGLRenderingContext & { tracked?: boolean }) | null;
    if (context && type.startsWith('webgl') && !context.tracked) {
      context.tracked = true;
      live.add(context);
      const getExtension = context.getExtension.bind(context);
      context.getExtension = ((name: string) => {
        const extension = getExtension(name);
        if (name !== 'WEBGL_lose_context' || !extension) return extension;
        const lose = extension as WEBGL_lose_context;
        return { loseContext: () => { live.delete(context); lose.loseContext(); }, restoreContext: () => lose.restoreContext() };
      }) as typeof context.getExtension;
    }
    return context;
  } as typeof HTMLCanvasElement.prototype.getContext;
}

async function open(path: string, context: BrowserContextOptions = {}, using: Browser = browser) {
  const ctx = await using.newContext({ viewport: { width: 1280, height: 900 }, ...context });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  await ctx.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (event) => console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI}`)),
  );
  await ctx.addInitScript(trackContexts);
  const response = await page.goto(`${lab.url}${path}`);
  return { page, errors, response };
}

const state = (page: Page, name = 'kettle') =>
  page.evaluate((n) => JSON.parse(JSON.stringify((window as unknown as Record<string, { state: KettleState }>)[n]!.state)) as KettleState, name);

async function ready(page: Page, name = 'kettle', status = 'ready'): Promise<void> {
  await page.waitForFunction(([n, s]) => (window as any)[n!]?.state?.status === s, [name, status], { timeout: 60_000 });
}

/** Waits until the predicate on the Kettle's state holds. */
// Built in Node and sent as a function: a string predicate would be evaluated
// in the page with eval, which the strict CSP blocks.
const until = (page: Page, predicate: string, name = 'kettle', timeout = 15_000) =>
  page.waitForFunction(new Function('n', `const s = window[n].state; return ${predicate};`) as (n: string) => boolean, name, { timeout });

const frames = (page: Page, count = 3) =>
  page.evaluate((n) => new Promise<void>((done) => { let i = 0; const step = () => (++i >= n ? done() : requestAnimationFrame(step)); requestAnimationFrame(step); }), count);

/** Centre of the Kettle's body on screen. */
async function body(page: Page, name = 'kettle'): Promise<{ x: number; y: number }> {
  const box = await page.evaluate((n) => (window as any)[n].canvas.getBoundingClientRect().toJSON(), name);
  return { x: box.x + box.width / 2, y: box.y + box.height * 0.62 };
}

/** Software WebGL is slow, so input arrives slowly; lower the fling threshold. */
const lowFlingThreshold = (page: Page) =>
  page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { amount: { minSpeed: 40 } } }));

/**
 * A fast mouse drag with input timestamps 16 ms apart, sent through CDP. On a
 * loaded machine the page handles each event late, and sequential input would
 * otherwise arrive with slow timestamps and read (correctly) as a slow drag.
 */
async function fastDrag(page: Page, from: { x: number; y: number }, release = true) {
  const cdp = await page.context().newCDPSession(page);
  let t = Date.now() / 1000, x = from.x - 150;
  const send = (type: 'mouseMoved' | 'mousePressed' | 'mouseReleased', at: number, buttons: number) =>
    cdp.send('Input.dispatchMouseEvent', { type, x, y: from.y, button: 'left', buttons, clickCount: 1, timestamp: at });
  await send('mouseMoved', t, 0);
  await send('mousePressed', t, 1);
  for (let i = 1; i <= 6; i++) {
    x = from.x - 150 + (400 * i) / 6;
    await send('mouseMoved', (t += 0.016), 1);
  }
  const drag = {
    /** Moves the held pointer now. */
    move: (to: number) => ((x = to), send('mouseMoved', Date.now() / 1000, 1)),
    /** Releases 16 ms after the last move (a fling), or now. */
    up: (fling = false) => send('mouseReleased', fling ? t + 0.016 : Date.now() / 1000, 0),
  };
  if (release) await drag.up(true);
  return drag;
}

describe('Kettle lab in Chromium', () => {
  it('serves every section under the strict CSP, draws the body and logs no errors', async () => {
    for (const [hash, name] of [['viewer', 'kettle'], ['playground', 'kettle'], ['compositions', 'heroKettle']] as const) {
      const { page, errors, response } = await open(`/#${hash}`);
      const policy = response?.headers()['content-security-policy'];
      expect(policy, hash).toBe(EXPECTED_CSP);
      expect(policy, hash).not.toMatch(/unsafe-inline|unsafe-eval/);
      await ready(page, name);
      await until(page, 's.renders > 0', name);
      const shot = await page.evaluate((n) => (window as any)[n].canvas.getBoundingClientRect().toJSON(), name);
      const image = readPng(await page.screenshot({ clip: { x: shot.x, y: shot.y, width: shot.width, height: shot.height } }));
      expect(kettleBlueShare(image), `${hash} canvas shows the blue body`).toBeGreaterThan(0.03);
      if (hash === 'compositions') {
        await ready(page, 'footerKettle');
        await ready(page, 'portalKettle');
      }
      expect(errors, hash).toEqual([]);
      await page.context().close();
    }
  });

  it('shows the shipped poster in every placement without WebGL, and play() still settles', async () => {
    const noWebgl = await chromium.launch({ executablePath: chromiumPath(), args: ['--disable-3d-apis'] });
    try {
      const { page, errors } = await open('/#compositions', {}, noWebgl);
      for (const name of ['heroKettle', 'footerKettle', 'portalKettle']) await ready(page, name, 'poster');
      const posters = page.locator('.kettle-slot img');
      expect(await posters.count()).toBe(3);
      for (let i = 0; i < 3; i++) {
        await expect.poll(() => posters.nth(i).evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0 && getComputedStyle(img).visibility === 'visible')).toBe(true);
      }
      const settled = await page.evaluate(() => Promise.race([(window as any).heroKettle.play('rock').then(() => 'settled'), new Promise((r) => setTimeout(() => r('pending'), 2000))]));
      expect(settled).toBe('settled');
      expect(await page.locator('canvas').count()).toBe(0);
      expect(errors).toEqual([]);
    } finally {
      await noWebgl.close();
    }
  });

  it('starts a clip queued off-screen from its first exposure once it scrolls into view', async () => {
    const { page } = await open('/#compositions', { viewport: { width: 1280, height: 640 } });
    await ready(page, 'portalKettle');
    // The guide cue plays curiosity as soon as the portal Kettle loads, below the fold.
    await until(page, "s.clip === 'curiosity'", 'portalKettle');
    expect((await state(page, 'portalKettle')).visible).toBe(false);
    // Longer than the whole curiosity clip (2.6 s): it must not run while unseen.
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
      (window as any).seen = [];
      (window as any).portalKettle.subscribe((s: KettleState) => s.visible && (window as any).seen.push([s.clip, s.frame]));
    });
    await page.locator('.portal').scrollIntoViewIfNeeded();
    // Curiosity then plays on screen from its start, exposure by exposure.
    await page.waitForFunction(() => (window as any).seen.some(([clip, frame]: [string, number]) => clip === 'curiosity' && frame >= 8));
    const seen = (await page.evaluate(() => (window as any).seen)) as Array<[string, number]>;
    expect(seen[0]).toEqual(['curiosity', 0]);
    const shown = new Set(seen.filter(([clip]) => clip === 'curiosity').map(([, frame]) => frame));
    expect(shown.size, 'curiosity exposures seen on screen').toBeGreaterThanOrEqual(8);
    await page.context().close();
  });

  it('settles play() when the WebGL context is lost and when the lab tears the Kettle down', async () => {
    const { page } = await open('/#viewer');
    await ready(page);
    await page.evaluate(() => { (window as any).lost = (window as any).kettle.play('look-around', { loop: true }).then(() => 'settled'); });
    await until(page, 's.playing');
    await page.evaluate(() => (window as any).kettle.canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    expect(await page.evaluate(() => Promise.race([(window as any).lost, new Promise((r) => setTimeout(() => r('pending'), 2000))]))).toBe('settled');
    expect((await state(page)).status).toBe('poster');

    await page.click('[data-tab="playground"]');
    await ready(page);
    await page.evaluate(() => { (window as any).torn = (window as any).kettle.play('look-around', { loop: true }).then(() => 'settled'); });
    await until(page, 's.playing');
    await page.click('[data-tab="viewer"]');
    expect(await page.evaluate(() => Promise.race([(window as any).torn, new Promise((r) => setTimeout(() => r('pending'), 2000))]))).toBe('settled');
    await page.context().close();
  });

  it('does not grow live WebGL contexts over repeated mount and unmount', async () => {
    const { page, errors } = await open('/#viewer');
    await ready(page);
    for (let round = 0; round < 3; round++) {
      await page.click('[data-tab="compositions"]');
      for (const name of ['heroKettle', 'footerKettle', 'portalKettle']) await ready(page, name);
      await page.click('[data-tab="viewer"]');
      await ready(page);
    }
    // Only the viewer's own renderer is still alive.
    expect(await page.evaluate(() => (window as any).liveContexts())).toBe(1);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('copies tuned values and the eye colour as JSON and applies them back', async () => {
    const { page } = await open('/#viewer');
    await ready(page);
    await page.click('[data-clip="little-hop"]');
    const apexLift = async () => {
      await page.evaluate(() => { const k = (window as any).kettle; void k.play('little-hop'); k.pause(); k.seek(7); });
      return (await state(page)).pose.lift;
    };
    const defaultLift = await apexLift();
    const height = page.locator('input[type=number][aria-label="Hop height (body heights)"]');
    await height.fill('0.8');
    await height.dispatchEvent('change');
    const tunedLift = await apexLift();
    expect(tunedLift).toBeGreaterThan(defaultLift);
    // The eye floor colour and minimum light travel in the same JSON.
    await page.fill('input[aria-label="Eye colour"]', '#3366ff');
    await page.fill('input[aria-label="Eye floor minimum light"]', '0.6');
    await page.getByRole('button', { name: 'Copy as JSON' }).click();
    const copied = await page.locator('textarea.json').inputValue();
    // The clip entry is the module's own tuning format; `eyes` is the module's `eyes` option.
    const { eyes, ...clips } = JSON.parse(copied);
    expect(parseTuning(clips)['little-hop']!.amount.height).toBe(0.8);
    expect(eyes).toEqual({ color: '#3366ff', minLight: 0.6 });
    await page.getByRole('button', { name: 'Reset to module values' }).click();
    await page.getByRole('button', { name: 'Brand accent' }).click();
    expect(await apexLift()).toBeCloseTo(defaultLift, 6);
    expect(await page.inputValue('input[aria-label="Eye colour"]')).toBe('#ffab62');
    await page.locator('textarea.json').fill(copied);
    await page.getByRole('button', { name: 'Apply pasted JSON' }).click();
    expect(await apexLift()).toBeCloseTo(tunedLift, 6);
    expect(await page.inputValue('input[aria-label="Eye colour"]')).toBe('#3366ff');
    expect(await page.inputValue('input[aria-label="Eye floor minimum light"]')).toBe('0.6');
    await page.context().close();
  });

  it('opens on saved lab state that names a removed clip, keeping the other saved values', async () => {
    const { page, errors } = await open('/#viewer');
    await ready(page);
    const hopFrames = async () => {
      await page.evaluate(() => { const k = (window as any).kettle; void k.play('little-hop'); k.pause(); });
      return (await state(page)).frames;
    };
    const shipped = await hopFrames();
    // Saved before body-flex was removed (#134): selected, and tuned next to a clip whose defaults did not change.
    await page.evaluate(() => {
      // A format-1 lab (#146) kept no version and no defaults per entry.
      for (const key of ['version', 'tuning-base']) localStorage.removeItem(`kettle-lab:${key}`);
      localStorage.setItem('kettle-lab:selected', JSON.stringify('body-flex'));
      localStorage.setItem('kettle-lab:tuning', JSON.stringify({ 'body-flex': { timing: {}, amount: {} }, 'little-hop': { timing: { settle: 8 }, amount: {} } }));
    });
    await page.reload();
    await ready(page);
    expect(await page.getAttribute('[data-clip="double-blink"]', 'aria-pressed')).toBe('true');
    expect(await hopFrames()).toBe(shipped + 6);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('drops saved tuning made against older module defaults, keeping marks and notes', async () => {
    const { page, errors } = await open('/#viewer');
    await ready(page);
    // Saved by the lab before the round-2 defaults: curiosity's old one-exposure snap into the lean.
    await page.evaluate(() => {
      for (const key of ['version', 'tuning-base']) localStorage.removeItem(`kettle-lab:${key}`);
      localStorage.setItem('kettle-lab:tuning', JSON.stringify({ curiosity: { timing: { lean: 1 }, amount: {} } }));
      localStorage.setItem('kettle-lab:marks', JSON.stringify({ curiosity: { mark: 'adjust', note: 'lean snaps' } }));
    });
    await page.reload();
    await ready(page);
    await page.evaluate(() => { const k = (window as any).kettle; void k.play('curiosity'); k.pause(); });
    expect((await state(page)).frames).toBe(createClip('curiosity').frames.length);
    expect(await page.inputValue('select[aria-label="Decision for Curiosity"]')).toBe('adjust');
    expect(await page.inputValue('[aria-label="Note for Curiosity"]')).toBe('lean snaps');
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('rejects pasted JSON that is not an object, with the module tuning error', async () => {
    const { page } = await open('/#viewer');
    await ready(page);
    for (const payload of ['[]', 'true', '42', 'null']) {
      await page.locator('textarea.json').fill(payload);
      await page.getByRole('button', { name: 'Apply pasted JSON' }).click();
      expect(await page.locator('.tuning p[role="status"]').textContent(), payload).toBe('Not applied: Tuning must be a JSON object keyed by clip id');
    }
    await page.context().close();
  });

  it('keeps an imported floor minimum light the slider cannot show when only the eye colour changes', async () => {
    const { page } = await open('/#viewer');
    await ready(page);
    await page.locator('textarea.json').fill(JSON.stringify({ eyes: { color: '#ffab62', minLight: 0.813 } }));
    await page.getByRole('button', { name: 'Apply pasted JSON' }).click();
    await page.fill('input[aria-label="Eye colour"]', '#3366ff');
    await page.getByRole('button', { name: 'Copy as JSON' }).click();
    expect(JSON.parse(await page.locator('textarea.json').inputValue()).eyes).toEqual({ color: '#3366ff', minLight: 0.813 });
    await page.context().close();
  });

  it('keeps the free orbit on the pointer that started it', async () => {
    const { page } = await open('/#viewer', { hasTouch: true });
    await ready(page);
    await page.click('[data-camera="orbit"]');
    const start = (await state(page)).camera.azimuth;
    const box = (await page.locator('.orbit-layer').boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    const a = { x: box.x + 200, y: box.y + 200, id: 1 };
    const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', points: Array<{ x: number; y: number; id: number }>) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
    await touch('touchStart', [a]);
    await touch('touchStart', [a, { x: box.x + 300, y: box.y + 300, id: 2 }]);
    for (let dx = 40; dx <= 200; dx += 40) await touch('touchMove', [a, { x: box.x + 300 + dx, y: box.y + 300, id: 2 }]);
    await frames(page); // pointer moves are dispatched with animation frames
    expect((await state(page)).camera.azimuth).toBe(start);
    await touch('touchMove', [{ ...a, x: a.x + 100 }, { x: box.x + 500, y: box.y + 300, id: 2 }]);
    await expect.poll(async () => (await state(page)).camera.azimuth).not.toBe(start);
    await touch('touchEnd', []);
    await page.context().close();
  });
});

describe('Kettle interaction in Chromium', () => {
  it('follows a mouse, plays the poke on click and the drag-release reaction after a fast drag', async () => {
    const { page, errors } = await open('/#playground');
    await ready(page);
    await lowFlingThreshold(page);
    const centre = await body(page);
    await page.mouse.move(1270, centre.y - 150);
    await until(page, 's.gaze.x > 0.3');
    await page.mouse.move(5, centre.y - 150, { steps: 4 });
    await until(page, 's.gaze.x < -0.3');

    await page.mouse.click(centre.x, centre.y);
    await until(page, "s.clip === 'poke' && s.playing");
    await until(page, '!s.playing');

    await fastDrag(page, centre);
    await until(page, "s.clip === 'drag-release' && s.playing");
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('measures the fling up to the release: drag fast, hold still, release plays no wobble', async () => {
    const { page } = await open('/#playground');
    await ready(page);
    await lowFlingThreshold(page);
    const drag = await fastDrag(page, await body(page), false);
    await until(page, 's.dragging');
    await page.waitForTimeout(800); // the user holds still before letting go
    await drag.up();
    await until(page, '!s.dragging && s.dragTurn === 0');
    expect((await state(page)).clip).toBeNull();
    await page.context().close();
  });

  it('ignores a second pointer during a drag, and treats a lost capture as a release without wobble', async () => {
    const { page } = await open('/#playground', { hasTouch: true });
    await ready(page);
    await lowFlingThreshold(page);
    const centre = await body(page);
    const drag = await fastDrag(page, centre, false);
    await until(page, 's.dragging');
    await page.touchscreen.tap(centre.x, centre.y);
    await frames(page);
    let s = await state(page);
    expect(s.dragging).toBe(true);
    expect(s.clip).toBeNull();
    // Losing pointer capture (e.g. the element moved) ends the drag like a cancel.
    await page.evaluate(() => (window as any).kettle.canvas.releasePointerCapture(1));
    // The browser applies the capture change at the next pointer event.
    await drag.move(centre.x + 260);
    await until(page, '!s.dragging');
    await drag.up();
    await until(page, 's.dragTurn === 0');
    s = await state(page);
    expect(s.clip).toBeNull();
    await page.context().close();
  });

  it('springs back without wobble when a touch drag is cancelled', async () => {
    const { page } = await open('/#playground', { hasTouch: true, isMobile: true });
    await ready(page);
    await lowFlingThreshold(page);
    const centre = await body(page);
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: 'touchStart' | 'touchMove' | 'touchCancel', x: number) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchCancel' ? [] : [{ x, y: centre.y }] });
    await touch('touchStart', centre.x - 150);
    for (let x = centre.x - 80; x <= centre.x + 180; x += 70) await touch('touchMove', x);
    await until(page, 's.dragging');
    // Cancel in the middle of a fast move: a cancel must never fling.
    await Promise.all([touch('touchMove', centre.x + 260), touch('touchCancel', 0)]);
    await until(page, '!s.dragging && s.dragTurn === 0');
    expect((await state(page)).clip).toBeNull();
    await page.context().close();
  });

  it('pokes on a tap, never follows touch, and does not poke on a release outside the canvas', async () => {
    const { page } = await open('/#playground', { hasTouch: true, isMobile: true });
    await ready(page);
    const centre = await body(page);
    await page.touchscreen.tap(centre.x, centre.y);
    await until(page, "s.clip === 'poke'");
    expect((await state(page)).gaze).toEqual({ x: 0, y: 0 });
    await until(page, '!s.playing');

    await page.uncheck('[data-interaction="drag"]');
    await page.evaluate(() => (window as any).kettle.stop());
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(1250, 850, { steps: 4 });
    await page.mouse.up();
    await frames(page);
    expect((await state(page)).clip).toBeNull();
    await page.context().close();
  });

  it('under reduced motion: still pose for hops and spins, eyes only, capped gaze and a monotonic spring', async () => {
    const { page } = await open('/#playground');
    await ready(page);
    await page.check('#reduced');
    await until(page, 's.reducedMotion && s.pose.turn === 0');
    for (const id of ['little-hop', 'tilted-spin', 'rock', 'drag-release']) {
      await page.evaluate((clip) => (window as any).kettle.play(clip), id);
      const s = await state(page);
      expect(s.skipped).toBe(id);
      // Still pose: nothing moves but the (small) gaze following the mouse.
      expect(Object.entries(s.pose).filter(([channel, value]) => value !== 0 && !channel.startsWith('gaze'))).toEqual([]);
    }
    // Record every state the Kettle emits during the blink rather than polling for one exposure.
    await page.evaluate(() => {
      const seen = ((window as any).blink = { shut: 0, body: 0 });
      (window as any).kettle.subscribe((s: KettleState) => {
        if (s.clip !== 'double-blink') return;
        seen.shut = Math.max(seen.shut, s.pose.blinkL);
        seen.body = Math.max(seen.body, Math.abs(s.pose.lift), Math.abs(s.pose.stretch), Math.abs(s.pose.lean), Math.abs(s.pose.turn));
      });
      void (window as any).kettle.play('double-blink');
    });
    await until(page, "s.clip === 'double-blink' && !s.playing");
    const blink = (await page.evaluate(() => (window as any).blink)) as { shut: number; body: number };
    expect(blink.shut).toBeGreaterThan(0.9);
    expect(blink.body).toBe(0);

    // Gaze stays small even when tuning asks for more and the page directs it during a gaze clip.
    await page.evaluate(() => {
      const k = (window as any).kettle;
      k.setTuning({ 'gaze-follow': { amount: { reduced: 1 } } });
      k.setGaze({ x: 1, y: 1 });
    });
    await until(page, 's.gaze.x === 1');
    expect((await state(page)).pose.gazeX).toBeLessThanOrEqual(0.35);
    await page.evaluate(() => {
      (window as any).maxGaze = 0;
      (window as any).kettle.subscribe((s: KettleState) => ((window as any).maxGaze = Math.max((window as any).maxGaze, Math.abs(s.pose.gazeX), Math.abs(s.pose.gazeY))));
      void (window as any).kettle.play('curiosity');
    });
    // Curiosity's own gaze peaks by exposure 6; the directed gaze adds to it, and the cap must hold.
    await until(page, "s.clip === 'curiosity' && s.frame >= 8");
    const maxGaze = (await page.evaluate(() => (window as any).maxGaze)) as number;
    expect(maxGaze).toBeLessThanOrEqual(0.35);
    expect(maxGaze).toBeCloseTo(0.35, 6);
    await page.evaluate(() => {
      (window as any).kettle.stop();
      (window as any).kettle.setGaze(null);
    });

    // The drag turn returns to the front without passing it.
    await page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { timing: { springBack: 10 } } }));
    await page.evaluate(() => {
      (window as any).turns = [];
      (window as any).kettle.subscribe((s: KettleState) => !s.dragging && (window as any).turns.push(s.dragTurn));
    });
    const centre = await body(page);
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + 100, centre.y, { steps: 5 });
    await page.evaluate(() => ((window as any).turns = []));
    await page.mouse.up();
    await until(page, 's.dragTurn === 0');
    const turns = (await page.evaluate(() => (window as any).turns)) as number[];
    expect(turns.length).toBeGreaterThan(2);
    expect(turns.every((turn) => turn >= 0)).toBe(true);
    for (let i = 1; i < turns.length; i++) expect(turns[i]!).toBeLessThanOrEqual(turns[i - 1]!);
    await page.context().close();
  });

  it('starts a spring created while the Kettle is off-screen from its first exposure, with a finite turn', async () => {
    const { page } = await open('/#playground');
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { timing: { springBack: 10 }, amount: { minSpeed: 4000, springOvershoot: 0 } } }));
    const centre = await body(page);
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + 150, centre.y, { steps: 3 });
    await until(page, 's.dragging && s.dragTurn > 60');
    // Move the stage out of view, release there, wait, bring it back.
    await page.evaluate(() => ((document.querySelector('.stage') as HTMLElement).style.transform = 'translateY(-5000px)'));
    await until(page, '!s.visible');
    await page.mouse.up();
    const released = (await state(page)).dragTurn;
    await page.waitForTimeout(1500); // longer than the whole spring: it must not run unseen
    await page.evaluate(() => {
      (window as any).turns = [];
      (window as any).kettle.subscribe((s: KettleState) => s.visible && (window as any).turns.push(s.dragTurn));
      (document.querySelector('.stage') as HTMLElement).style.transform = '';
    });
    await until(page, 's.visible && s.dragTurn === 0');
    const turns = (await page.evaluate(() => (window as any).turns)) as number[];
    expect(turns.every(Number.isFinite)).toBe(true);
    const moving = turns.filter((turn) => turn !== released);
    expect(moving[0]!).toBeGreaterThan(released * 0.6);
    await page.context().close();
  });

  it('never plays the drag-release reaction on a cancel or a lost capture, even with minSpeed 0', async () => {
    const { page } = await open('/#playground', { hasTouch: true, isMobile: true });
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { amount: { minSpeed: 0 } } }));
    const centre = await body(page);
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: 'touchStart' | 'touchMove' | 'touchCancel', x: number) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchCancel' ? [] : [{ x, y: centre.y }] });
    await touch('touchStart', centre.x - 150);
    for (let x = centre.x - 80; x <= centre.x + 180; x += 70) await touch('touchMove', x);
    await until(page, 's.dragging');
    await touch('touchCancel', 0);
    await until(page, '!s.dragging && s.dragTurn === 0');
    expect((await state(page)).clip).toBeNull();

    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + 150, centre.y, { steps: 3 });
    await until(page, 's.dragging');
    await page.evaluate(() => (window as any).kettle.canvas.releasePointerCapture(1));
    await page.mouse.move(centre.x + 160, centre.y);
    await until(page, '!s.dragging && s.dragTurn === 0');
    await page.mouse.up();
    expect((await state(page)).clip).toBeNull();
    await page.context().close();
  });

  it('reads a sparse drag as still: one big move, 800 ms still, release plays no wobble', async () => {
    const { page } = await open('/#playground');
    await ready(page);
    await lowFlingThreshold(page);
    const centre = await body(page);
    await page.mouse.move(centre.x - 150, centre.y);
    await page.mouse.down();
    await page.waitForTimeout(1000); // a slow start, so the only sample gap is long
    await page.mouse.move(centre.x + 150, centre.y);
    await until(page, 's.dragging');
    await page.waitForTimeout(800); // held still
    await page.mouse.up();
    await until(page, '!s.dragging && s.dragTurn === 0');
    expect((await state(page)).clip).toBeNull();
    await page.context().close();
  });

  it('replaces a running spring with a monotonic return when reduced motion switches on', async () => {
    const { page } = await open('/#playground');
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { timing: { springBack: 10 }, amount: { minSpeed: 4000 } } }));
    const centre = await body(page);
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + 150, centre.y, { steps: 3 });
    await until(page, 's.dragging');
    // Reduced motion switches on right as the drag is released.
    await page.evaluate(() => {
      (window as any).turns = [];
      window.addEventListener('pointerup', () => {
        const kettle = (window as any).kettle;
        kettle.setReducedMotion(true);
        kettle.subscribe((s: KettleState) => (window as any).turns.push(s.dragTurn));
      }, { once: true });
    });
    await page.mouse.up();
    await until(page, 's.dragTurn === 0');
    const turns = (await page.evaluate(() => (window as any).turns)) as number[];
    expect(turns.length).toBeGreaterThan(2);
    expect(turns.every((turn) => turn >= 0)).toBe(true);
    for (let i = 1; i < turns.length; i++) expect(turns[i]!).toBeLessThanOrEqual(turns[i - 1]!);
    await page.context().close();
  });

  it('plays the footer entrance once when first seen, then stays still', async () => {
    const { page, errors } = await open('/harness.html?surface=footer');
    await ready(page);
    await until(page, "s.clip === 'double-blink' && s.playing");
    await until(page, '!s.playing');
    const ended = await state(page);
    expect(ended.frame).toBe(ended.frames - 1);
    // Scrolled away and back: no second entrance, no idle emotes.
    await page.evaluate(() => ((document.querySelector('#stage') as HTMLElement).style.transform = 'translateY(-5000px)'));
    await until(page, '!s.visible');
    await page.evaluate(() => ((document.querySelector('#stage') as HTMLElement).style.transform = ''));
    await until(page, 's.visible');
    await frames(page, 6);
    const back = await state(page);
    expect([back.playing, back.frame]).toEqual([false, ended.frame]);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('steps a drag on the 12 fps grid by default: the turn changes at most once per exposure', async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 360 } });
    // A virtual 60 Hz display: animation frames run only when the test steps them.
    await ctx.addInitScript(() => {
      const queue = new Map<number, FrameRequestCallback>();
      let id = 0;
      window.requestAnimationFrame = (callback) => (queue.set(++id, callback), id);
      window.cancelAnimationFrame = (handle) => void queue.delete(handle);
      (window as any).stepFrame = (now: number) => {
        const due = [...queue.values()];
        queue.clear();
        for (const callback of due) callback(now);
      };
    });
    const page = await ctx.newPage();
    await page.goto(`${lab.url}/harness.html?surface=landing`);
    await page.waitForFunction(() => (window as any).kettle?.state?.status === 'ready', null, { polling: 100, timeout: 60_000 });
    await page.evaluate(() => {
      (window as any).turnChanges = [];
      let last = 0;
      (window as any).kettle.subscribe((s: KettleState) => {
        if (s.dragTurn !== last) (window as any).turnChanges.push(Math.floor(((window as any).now * 12) / 1000));
        last = s.dragTurn;
      });
    });
    const centre = await body(page);
    let now = 10_000;
    await page.mouse.move(centre.x - 100, centre.y);
    await page.mouse.down();
    // A pointer moving on every display frame for two thirds of a second.
    for (let x = centre.x - 90; x <= centre.x + 70; x += 4) {
      await page.mouse.move(x, centre.y);
      await page.evaluate((t) => { (window as any).now = t; (window as any).stepFrame(t); }, (now += 1000 / 60));
    }
    expect((await state(page)).dragging).toBe(true);
    await page.mouse.up();
    const exposures = (await page.evaluate(() => (window as any).turnChanges)) as number[];
    expect(exposures.length).toBeGreaterThan(5);
    expect(new Set(exposures).size, 'turn changes within one exposure').toBe(exposures.length);
    await ctx.close();
  });

  it('decides the entrance when the Kettle is first seen, not when it loads', async () => {
    const reveal = (page: Page) => page.evaluate(() => ((document.querySelector('#stage') as HTMLElement).style.transform = ''));
    const watch = (page: Page) => page.evaluate(() => {
      (window as any).seen = [];
      (window as any).kettle.subscribe((s: KettleState) => s.visible && (window as any).seen.push([s.clip, s.frame]));
    });
    const seen = (page: Page) => page.evaluate(() => (window as any).seen) as Promise<Array<[string | null, number]>>;

    // Loaded out of view: nothing is queued until it is seen, then the entrance plays from its first exposure.
    let { page } = await open('/harness.html?surface=footer&offscreen');
    await ready(page);
    expect((await state(page)).clip).toBeNull();
    await watch(page);
    await reveal(page);
    await until(page, "s.clip === 'double-blink' && !s.playing");
    expect((await seen(page)).find(([clip]) => clip === 'double-blink')).toEqual(['double-blink', 0]);
    await page.context().close();

    // A clip the page plays while the Kettle loads takes precedence: no entrance.
    ({ page } = await open('/harness.html?surface=footer&offscreen'));
    expect((await state(page)).status).toBe('loading');
    await page.evaluate(() => void (window as any).kettle.play('rock'));
    await ready(page);
    await watch(page);
    await reveal(page);
    await until(page, "s.clip === 'rock' && !s.playing");
    await frames(page, 6);
    expect(new Set((await seen(page)).map(([clip]) => clip))).toEqual(new Set(['rock']));
    await page.context().close();

    // Reduced motion is read when the Kettle is first seen: on at load, off before the reveal, the hop plays.
    ({ page } = await open('/harness.html?surface=footer&offscreen&entrance=little-hop'));
    await page.evaluate(() => (window as any).kettle.setReducedMotion(true));
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setReducedMotion(false));
    await reveal(page);
    await until(page, "s.clip === 'little-hop' && s.playing");
    expect((await state(page)).skipped).toBeNull();
    await page.context().close();
  });

  it('keeps the portal guide looking where the page points while curiosity plays', async () => {
    const { page } = await open('/harness.html?surface=portal');
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setGaze({ x: 1, y: 0 }));
    await until(page, 's.gaze.x === 1');
    await page.evaluate(() => void (window as any).kettle.play('curiosity'));
    // Curiosity's own gaze peaks near 0.4; the page's target adds to it.
    await until(page, 's.playing && s.pose.gazeX > 1');
    await page.context().close();
  });

  it('draws only while something moves', async () => {
    const { page } = await open('/harness.html?surface=none');
    await ready(page);
    await until(page, 's.renders > 0');
    const idle = (await state(page)).renders;
    // Proving that nothing happens needs an observation window.
    await page.waitForTimeout(600);
    expect((await state(page)).renders).toBe(idle);
    await page.evaluate(() => (window as any).kettle.play('rock'));
    const after = await state(page);
    // At most one draw per exposure (software WebGL may drop some), then nothing.
    expect(after.renders).toBeGreaterThan(idle);
    expect(after.renders - idle).toBeLessThanOrEqual(after.frames + 2);
    await page.waitForTimeout(600);
    expect((await state(page)).renders).toBe(after.renders);
    await page.context().close();
  });
});
