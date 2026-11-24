// Records every clip exposure by exposure (deterministic: it seeks instead of
// waiting on a clock) and encodes MP4 and GIF at 12 fps with ffmpeg.
// Usage: node scripts/record.ts <out-dir> [clip-id ...] [--camera front,three-quarter] [--size 480]
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { CLIP_DEFINITIONS } from '../src/index.ts';
import { startLabServer } from '../lab/server.ts';
import { chromiumPath, CHROMIUM_ARGS } from '../tests/chromium.ts';

const args = process.argv.slice(2);
const option = (name: string, fallback: string) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args.splice(index, 2)[1]! : fallback;
};
const cameras = option('camera', 'front,three-quarter').split(',');
const size = Number(option('size', '480'));
const [out, ...only] = args;
if (!out) throw new Error('Usage: node scripts/record.ts <out-dir> [clip-id ...]');
const clips = CLIP_DEFINITIONS.filter((definition) => !only.length || only.includes(definition.id));
const lab = await startLabServer({ port: 0 });
const browser = await chromium.launch({ executablePath: chromiumPath(), args: CHROMIUM_ARGS });
try {
  for (const camera of cameras) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.goto(`${lab.url}/harness.html?surface=none&camera=${camera}`);
    await page.waitForSelector('html[data-kettle="ready"]', { state: 'attached', timeout: 60_000 });
    for (const clip of clips) {
      const dir = join(out, 'frames', `${clip.id}-${camera}`);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      const frames = await page.evaluate(async (id) => {
        const kettle = (window as unknown as { kettle: import('../src/index.ts').Kettle }).kettle;
        void kettle.play(id);
        kettle.pause();
        return kettle.state.frames;
      }, clip.id);
      // One extra neutral exposure on each side shows the clip starting and ending at rest.
      for (let frame = -1; frame <= frames; frame++) {
        await page.evaluate((f) => (window as unknown as { kettle: import('../src/index.ts').Kettle }).kettle.seek(Math.max(0, f)), frame);
        await page.waitForTimeout(30);
        await page.screenshot({ path: join(dir, `${String(frame + 1).padStart(4, '0')}.png`) });
      }
      const base = join(out, `${clip.id}-${camera}`);
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', '12', '-i', join(dir, '%04d.png'), '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', `${base}.mp4`], { timeout: 120_000 });
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', '12', '-i', join(dir, '%04d.png'), '-vf', 'split[a][b];[a]palettegen=reserve_transparent=0[p];[b][p]paletteuse', '-loop', '0', `${base}.gif`], { timeout: 120_000 });
      console.log(`${clip.id} ${camera}: ${frames} exposures`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  await lab.close();
}
