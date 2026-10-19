import { readFile, readdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { recoverySchema } from '../src/recovery-authority.ts';
import { buildWorker } from '../build.mjs';

const port = Number(process.env.PREVIEW_PORT ?? 8787);
const baseURL = process.env.PREVIEW_BASE_URL ?? `http://localhost:${port}`;
await buildWorker();
const worker = new Miniflare(convertV4MiniflareOptions({
  modules: true, scriptPath: 'dist/worker.js', host: '127.0.0.1', port,
  compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['AUTH_DB','RECOVERY_DB'],
  bindings: { RECOVERY_AUTHORITY_ID:'anonymous-preview',AUTH_SECRET: randomBytes(32).toString('base64url'), BASE_URL: baseURL },
  // Preview is anonymous and cannot contact mail, identity or AimHarder providers.
  outboundService: () => new Response(null, { status: 503 }),
}));
await worker.ready;
const recovery=await worker.getD1Database('RECOVERY_DB');
for(const sql of recoverySchema)await recovery.exec(sql);
await recovery.prepare("INSERT INTO recovery_head(authorityId,epoch,gate,checkpoint) VALUES ('anonymous-preview',0,'open','anonymous-initial')").run();
const database = await worker.getD1Database('AUTH_DB');
for (const file of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
  await database.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
console.info(`Anonymous portal preview listening on http://127.0.0.1:${port}`);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => { void worker.dispose().finally(() => process.exit(0)); });
