// Renders the neutral Kettle (front camera, square, transparent) to the poster
// the module shows while loading and without WebGL. Usage: node scripts/poster.ts [size]
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { startLabServer, POSTER } from '../lab/server.ts';
import { chromiumPath, CHROMIUM_ARGS } from '../lab/chromium.ts';

const size = Number(process.argv[2] ?? 512);
const lab = await startLabServer({ port: 0 });
const browser = await chromium.launch({ executablePath: chromiumPath(), args: CHROMIUM_ARGS });
try {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.goto(`${lab.url}/harness.html?surface=none&camera=front&transparent=1`);
  await page.waitForSelector('html[data-kettle="ready"]', { state: 'attached', timeout: 60_000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(POSTER), omitBackground: true });
  console.log(`Poster written to ${POSTER}`);
} finally {
  await browser.close();
  await lab.close();
}
