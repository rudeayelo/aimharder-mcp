import { build } from 'esbuild';
export async function buildWorker(entry = 'src/worker.ts', outfile = 'dist/worker.js', options = {}) {
  return build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    conditions: ['workerd', 'worker', 'browser'],
    mainFields: ['module', 'main'],
    target: 'es2023',
    external: ['node:*'],
    metafile: true,
    ...options,
  });
}
if (process.argv[1]?.endsWith('/build.mjs')) await buildWorker();
