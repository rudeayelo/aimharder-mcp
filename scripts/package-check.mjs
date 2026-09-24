import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, copyFile, realpath, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const run = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const live = process.argv.includes('--live');
if (live && process.env.AIMHARDER_LIVE_CHECK !== '1') {
  process.stderr.write('Set AIMHARDER_LIVE_CHECK=1 for installed-package live account verification.\n');
  process.exit(1);
}
const work = await mkdtemp(join(tmpdir(), 'aimharder-package-'));
// Build/install subprocesses receive no account credentials, hooks or NODE_PATH overrides.
const baseEnv = { PATH: `${dirname(process.execPath)}:${process.env.PATH ?? ''}`, HOME: process.env.HOME, TMPDIR: tmpdir() };
try {
  await run('pnpm', ['build'], { cwd: root, env: baseEnv });
  const packed = await run('npm', ['pack', '--json', '--pack-destination', work], { cwd: root, env: baseEnv });
  const [archive] = JSON.parse(packed.stdout);
  const paths = archive.files.map(file => file.path);
  assert.ok(paths.includes('dist/index.js'));
  const consumerDocs = new Set([
    'docs/configuration.md', 'docs/tools.md',
    'docs/clients/chatgpt-desktop.md', 'docs/clients/claude-desktop.md',
    'docs/clients/codex.md',
    'docs/clients/hermes.md', 'docs/clients/openclaw.md',
  ]);
  for (const path of paths) {
    assert.ok(/^(?:dist\/[a-z-]+\.js|README\.md|LICENSE|CONTEXT\.md|package\.json)$/.test(path) || consumerDocs.has(path), `Unexpected archive path: ${path}`);
  }
  for (const path of consumerDocs) assert.ok(paths.includes(path), `Missing consumer documentation: ${path}`);
  await writeFile(join(work, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  await run('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', join(work, archive.filename)], { cwd: work, env: baseEnv, timeout: 120_000 });
  const installed = join(work, 'node_modules/aimharder-mcp');
  const metadata = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
  assert.equal(metadata.bin['aimharder-mcp'], 'dist/index.js');
  assert.equal(metadata.engines.node, '>=24');
  for (const name of ['typescript', 'vitest', 'msw', '@types/node']) {
    await assert.rejects(access(join(work, 'node_modules', name)));
  }
  const binary = join(work, 'node_modules/.bin/aimharder-mcp');
  assert.equal(await realpath(binary), await realpath(join(installed, 'dist/index.js')));
  await copyFile(join(root, 'scripts/package-harness.mjs'), join(work, 'harness.mjs'));
  if (!live) await copyFile(join(root, 'tests/fixtures/package-fetch.mjs'), join(work, 'fixture.mjs'));
  const env = { ...baseEnv, PACKAGE_CHECK_LIVE: live ? '1' : '0' };
  if (live) for (const key of ['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES']) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
  const checked = await run(process.execPath, [join(work, 'harness.mjs')], { cwd: work, env, timeout: 90_000 });
  assert.equal(checked.stderr, '');
  process.stdout.write(JSON.stringify({ ...JSON.parse(checked.stdout), archive: { name: archive.filename, fileCount: paths.length, bytes: archive.size, integrity: archive.integrity }, runtime: process.version }) + '\n');
} catch {
  // In particular do not expose execFile errors containing the child environment or responses.
  process.stderr.write('Installed-package verification failed; raw subprocess output is suppressed.\n');
  process.exitCode = 1;
} finally {
  await rm(work, { recursive: true, force: true });
}
