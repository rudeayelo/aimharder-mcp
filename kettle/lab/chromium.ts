// Chromium for browser checks: $KETTLE_CHROMIUM, else the first system browser found.
import { existsSync } from 'node:fs';

const CANDIDATES = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'];

export function chromiumPath(): string {
  const path = process.env.KETTLE_CHROMIUM ?? CANDIDATES.find((candidate) => existsSync(candidate));
  if (!path) throw new Error('No Chromium found; set KETTLE_CHROMIUM to a Chromium or Chrome executable');
  return path;
}

/** Software WebGL, so the checks run on machines without a GPU (CI). */
export const CHROMIUM_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
