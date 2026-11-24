// The Kettle in Chromium (software WebGL), served under the strict CSP the
// module must run with, driven only through real input and its public state.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser, type BrowserContextOptions, type Page } from 'playwright-core';
import { startLabServer, type LabServer } from '../lab/server.ts';
import type { KettleState } from '../src/index.ts';
import { CHROMIUM_ARGS, chromiumPath } from '../lab/chromium.ts';

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

interface Problems {
  errors: string[];
}

async function open(path: string, context: BrowserContextOptions = {}): Promise<{ page: Page; problems: Problems }> {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 640 }, ...context });
  const page = await ctx.newPage();
  const problems: Problems = { errors: [] };
  page.on('console', (message) => message.type() === 'error' && problems.errors.push(message.text()));
  page.on('pageerror', (error) => problems.errors.push(error.message));
  await ctx.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (event) => console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI}`)),
  );
  await page.goto(`${lab.url}${path}`);
  return { page, problems };
}

const state = (page: Page, name = 'kettle') =>
  page.evaluate((n) => JSON.parse(JSON.stringify((window as unknown as Record<string, { state: KettleState }>)[n]!.state)) as KettleState, name);

async function ready(page: Page, name = 'kettle'): Promise<void> {
  await page.waitForFunction((n) => (window as unknown as Record<string, { state?: KettleState }>)[n]?.state?.status === 'ready', name, { timeout: 60_000 });
}

/** Screen position of the Kettle's face in the harness (front camera, 640 × 640). */
const FACE = { x: 320, y: 400 };

/** Software WebGL can take a while per frame, so input arrives slowly; lower the fling threshold. */
const lowFlingThreshold = (page: Page) =>
  page.evaluate(() => (window as any).kettle.setTuning({ 'drag-release': { amount: { minSpeed: 40 } } }));

describe('Kettle in Chromium', () => {
  it('loads every lab section with no console errors under the strict CSP', async () => {
    for (const [hash, name] of [['viewer', 'kettle'], ['playground', 'kettle'], ['compositions', 'heroKettle']] as const) {
      const { page, problems } = await open(`/#${hash}`, { viewport: { width: 1440, height: 1000 } });
      await ready(page, name);
      expect((await state(page, name)).renders, hash).toBeGreaterThan(0);
      if (hash === 'compositions') {
        await ready(page, 'footerKettle');
        await ready(page, 'portalKettle');
      }
      expect(problems.errors, hash).toEqual([]);
      await page.context().close();
    }
  });

  it('follows a mouse, plays the poke on click and the drag-release reaction after a fast drag', async () => {
    const { page, problems } = await open('/harness.html?surface=landing&drag=1');
    await ready(page);
    await lowFlingThreshold(page);
    await page.mouse.move(630, 300);
    await page.waitForFunction(() => (window as any).kettle.state.gaze.x > 0.3);
    await page.mouse.move(10, 300, { steps: 4 });
    await page.waitForFunction(() => (window as any).kettle.state.gaze.x < -0.3);
    expect((await state(page)).pose.gazeX).toBeLessThan(0);

    await page.mouse.click(FACE.x, FACE.y);
    await page.waitForFunction(() => (window as any).kettle.state.clip === 'poke' && (window as any).kettle.state.playing);
    await page.waitForFunction(() => !(window as any).kettle.state.playing, null, { timeout: 10_000 });

    await page.mouse.move(FACE.x - 150, FACE.y);
    await page.mouse.down();
    await page.mouse.move(FACE.x + 250, FACE.y, { steps: 6 });
    await page.mouse.up();
    await page.waitForFunction(() => (window as any).kettle.state.clip === 'drag-release');
    await page.waitForFunction(() => !(window as any).kettle.state.playing && (window as any).kettle.state.dragTurn === 0, null, { timeout: 10_000 });
    expect(problems.errors).toEqual([]);
    await page.context().close();
  });

  it('never follows touch, pokes on a tap and reacts to a touch drag', async () => {
    const { page, problems } = await open('/harness.html?surface=landing&drag=1', { hasTouch: true, isMobile: true });
    await ready(page);
    await lowFlingThreshold(page);
    await page.touchscreen.tap(FACE.x, FACE.y);
    await page.waitForFunction(() => (window as any).kettle.state.clip === 'poke');
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: FACE.y }] });
    await touch('touchStart', FACE.x - 150);
    for (let x = FACE.x - 100; x <= FACE.x + 250; x += 70) await touch('touchMove', x);
    await touch('touchEnd', 0);
    await page.waitForFunction(() => (window as any).kettle.state.clip === 'drag-release');
    const after = await state(page);
    expect(after.gaze).toEqual({ x: 0, y: 0 });
    expect(problems.errors).toEqual([]);
    await page.context().close();
  });

  it('replaces hops, spins and large deformations with the still pose under reduced motion, keeping eyes and small gaze', async () => {
    const { page } = await open('/harness.html?surface=landing', { reducedMotion: 'reduce' });
    await ready(page);
    for (const id of ['little-hop', 'tilted-spin', 'body-flex', 'rock', 'drag-release']) {
      await page.evaluate((clip) => (window as any).kettle.play(clip), id);
      const s = await state(page);
      expect(s.skipped).toBe(id);
      expect(Object.values(s.pose).every((value) => value === 0)).toBe(true);
    }
    await page.evaluate(() => void (window as any).kettle.play('double-blink'));
    await page.waitForFunction(() => (window as any).kettle.state.pose.blinkL > 0.9);
    const blink = await state(page);
    expect([blink.pose.lift, blink.pose.stretch, blink.pose.lean, blink.pose.turn]).toEqual([0, 0, 0, 0]);
    await page.waitForFunction(() => !(window as any).kettle.state.playing, null, { timeout: 10_000 });
    await page.mouse.move(630, 100);
    await page.waitForFunction(() => (window as any).kettle.state.gaze.x > 0.6);
    const gaze = await state(page);
    expect(gaze.pose.gazeX).toBeLessThanOrEqual(0.35);
    expect(gaze.pose.turn).toBe(0);
    await page.context().close();
  });

  it('keeps the portal guide looking where the page points while curiosity plays', async () => {
    const { page } = await open('/harness.html?surface=portal');
    await ready(page);
    await page.evaluate(() => (window as any).kettle.setGaze({ x: 1, y: 0 }));
    await page.waitForFunction(() => (window as any).kettle.state.gaze.x === 1);
    await page.evaluate(() => void (window as any).kettle.play('curiosity'));
    // Curiosity's own gaze peaks near 0.4; the page's target adds to it.
    await page.waitForFunction(() => (window as any).kettle.state.playing && (window as any).kettle.state.pose.gazeX > 1);
    await page.context().close();
  });

  it('draws only while something moves', async () => {
    const { page } = await open('/harness.html?surface=none');
    await ready(page);
    await page.waitForFunction(() => (window as any).kettle.state.renders > 0);
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
  it('shows the static poster when WebGL is unavailable', async () => {
    const noWebgl = await chromium.launch({ executablePath: chromiumPath(), args: ['--disable-3d-apis'] });
    try {
      const page = await noWebgl.newPage({ viewport: { width: 400, height: 400 } });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${lab.url}/harness.html?surface=landing&poster=1`);
      await page.waitForFunction(() => (window as any).kettle?.state?.status === 'poster');
      const poster = page.locator('#stage img');
      await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0 && getComputedStyle(img).visibility === 'visible')).toBe(true);
      expect(await page.locator('#stage canvas').count()).toBe(0);
      expect(errors).toEqual([]);
    } finally {
      await noWebgl.close();
    }
  });
});
