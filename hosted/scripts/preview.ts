import { readFile, readdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { buildWorker } from '../build.mjs';

const port = Number(process.env.PREVIEW_PORT ?? 8787);
const baseURL = process.env.PREVIEW_BASE_URL ?? `http://localhost:${port}`;
await buildWorker();
const worker = new Miniflare(convertV4MiniflareOptions({
  modules: true, scriptPath: 'dist/worker.js', host: '127.0.0.1', port,
  compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['AUTH_DB'],
  bindings: { AUTH_SECRET: randomBytes(32).toString('base64url'), BASE_URL: baseURL },
  // Preview is anonymous and cannot contact mail, identity or AimHarder providers.
  outboundService: () => new Response(null, { status: 503 }),
}));
await worker.ready;
const database = await worker.getD1Database('AUTH_DB');
for (const file of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
  await database.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
console.info(`Anonymous portal preview listening on http://127.0.0.1:${port}`);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => { void worker.dispose().finally(() => process.exit(0)); });
