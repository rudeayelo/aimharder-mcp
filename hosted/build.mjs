import { build } from 'esbuild';
export async function buildWorker(entry = 'src/worker.ts', outfile = 'dist/worker.js') {
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
  });
}
if (process.argv[1]?.endsWith('/build.mjs')) await buildWorker();
