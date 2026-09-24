import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const packageFile = join(root, 'package.json');
const previousVersion = JSON.parse(readFileSync(packageFile, 'utf8')).version;

execFileSync('pnpm', ['exec', 'changeset', 'version'], { cwd: root, stdio: 'inherit' });
const nextVersion = JSON.parse(readFileSync(packageFile, 'utf8')).version;
assert.notEqual(nextVersion, previousVersion, 'Changesets did not change the package version');
assert.match(nextVersion, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

const consumerDocs = [
  'README.md',
  'docs/clients/chatgpt-desktop.md',
  'docs/clients/claude-desktop.md',
  'docs/clients/codex.md',
  'docs/clients/hermes.md',
  'docs/clients/openclaw.md',
];
const pin = /aimharder-mcp@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/g;
for (const path of consumerDocs) {
  const file = join(root, path);
  const content = readFileSync(file, 'utf8');
  let count = 0;
  const updated = content.replace(pin, (_match, version) => {
    assert.equal(version, previousVersion, `${path} contains an unexpected pinned version`);
    count++;
    return `aimharder-mcp@${nextVersion}`;
  });
  assert.ok(count > 0, `${path} has no pinned package example`);
  writeFileSync(file, updated);
}

execFileSync('pnpm', ['install', '--lockfile-only', '--ignore-scripts'], { cwd: root, stdio: 'inherit' });
process.stdout.write(`Prepared aimharder-mcp@${nextVersion} with synchronized consumer examples.\n`);
