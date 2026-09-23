import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version || !/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(version)) {
  process.stderr.write('Usage: AIMHARDER_LIVE_CHECK=1 node scripts/registry-check.mjs <exact-version>\n');
  process.exit(1);
}
if (process.env.AIMHARDER_LIVE_CHECK !== '1') {
  process.stderr.write('Set AIMHARDER_LIVE_CHECK=1 for published-package live account verification.\n');
  process.exit(1);
}

const run = promisify(execFile);
const registry = 'https://registry.npmjs.org/';
const root = fileURLToPath(new URL('..', import.meta.url));
const work = await mkdtemp(join(tmpdir(), 'aimharder-registry-'));
// npm receives no AimHarder credentials. Only the installed MCP harness receives them.
const baseEnv = { PATH: `${dirname(process.execPath)}:${process.env.PATH ?? ''}`, HOME: process.env.HOME, TMPDIR: tmpdir(), npm_config_cache: join(work, 'npm-cache') };
try {
  const { stdout } = await run('npm', ['view', `aimharder-mcp@${version}`, 'version', 'dist.tarball', '--json', '--registry', registry, '--prefer-online'], { cwd: work, env: baseEnv, timeout: 90_000 });
  const published = JSON.parse(stdout);
  assert.equal(published.version, version);
  assert.equal(published['dist.tarball'], `${registry}aimharder-mcp/-/aimharder-mcp-${version}.tgz`);
  await writeFile(join(work, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  await run('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--prefer-online', '--registry', registry, `aimharder-mcp@${version}`], { cwd: work, env: baseEnv, timeout: 120_000 });
  const installed = join(work, 'node_modules/aimharder-mcp');
  const metadata = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
  assert.equal(metadata.name, 'aimharder-mcp');
  assert.equal(metadata.version, version);
  assert.equal(metadata.bin['aimharder-mcp'], 'dist/index.js');
  await copyFile(join(root, 'scripts/package-harness.mjs'), join(work, 'harness.mjs'));
  const env = { ...baseEnv, PACKAGE_CHECK_LIVE: '1' };
  for (const key of ['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES']) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
  const checked = await run(process.execPath, [join(work, 'harness.mjs')], { cwd: work, env, timeout: 90_000 });
  assert.equal(checked.stderr, '');
  process.stdout.write(JSON.stringify({ registry, version, registryArtifact: published['dist.tarball'], ...JSON.parse(checked.stdout), runtime: process.version }) + '\n');
} catch {
  process.stderr.write('Published-package verification failed; raw registry, subprocess and account output is suppressed.\n');
  process.exitCode = 1;
} finally {
  await rm(work, { recursive: true, force: true });
}
