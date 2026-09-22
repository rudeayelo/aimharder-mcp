import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

test('the archive installs and serves MCP from outside the checkout without development dependencies', async () => {
  const { stdout } = await promisify(execFile)(process.execPath, ['scripts/package-check.mjs'], { timeout: 180_000 });
  expect(JSON.parse(stdout)).toMatchObject({ mode: 'anonymized', initialization: 'passed', accountContext: 'passed', sanitizedErrors: 'passed', serverStderr: 'empty' });
}, 190_000);
