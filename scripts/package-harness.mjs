// Copied into the isolated install: imports resolve only against its production dependencies.
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const work = fileURLToPath(new URL('.', import.meta.url));
const binary = join(work, 'node_modules/.bin/aimharder-mcp');
const packageVersion = JSON.parse(await readFile(join(work, 'node_modules/aimharder-mcp/package.json'), 'utf8')).version;
const live = process.env.PACKAGE_CHECK_LIVE === '1';
const env = { PATH: process.env.PATH };
if (live) {
  for (const key of ['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES']) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
} else Object.assign(env, { AIMHARDER_USERNAME: 'account@example.invalid', AIMHARDER_PASSWORD: 'synthetic-password', NODE_OPTIONS: `--import=${join(work, 'fixture.mjs')}` });
async function withClient(extra, check) {
  const transport = new StdioClientTransport({ command: binary, args: [], cwd: work, env: { ...env, ...extra }, stderr: 'pipe' });
  const client = new Client({ name: 'installed-package-harness', version: '1.0.0' });
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += chunk.toString(); });
  try { await client.connect(transport); await check(client); assert.equal(stderr, ''); }
  finally { await client.close(); }
}
let gymCount;
await withClient({}, async client => {
  const tools = await client.listTools();
  assert.equal(client.getServerVersion()?.version, packageVersion);
  assert.deepEqual(tools.tools.map(tool => tool.name), ['get_account_context', 'get_class_sessions', 'prepare_booking_creation', 'execute_booking_creation', 'prepare_booking_cancellation', 'execute_booking_cancellation', 'execute_late_booking_cancellation', 'get_upcoming_bookings', 'get_booking_history', 'get_published_workouts', 'get_personal_activity']);
  const result = await client.callTool({ name: 'get_account_context', arguments: {} });
  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent.account.authenticated, true);
  const { gyms, selectedGym } = result.structuredContent;
  assert.ok(gyms.length > 0);
  assert.ok(gyms.some(gym => gym.id === selectedGym.id));
  gymCount = gyms.length;
  if (!live) assert.equal(selectedGym.id, 'sample-gym');
  const explicit = await client.callTool({ name: 'get_account_context', arguments: { gymId: selectedGym.id } });
  assert.notEqual(explicit.isError, true);
  assert.equal(explicit.structuredContent.selectedGym.id, selectedGym.id);
  let unknown = 'unverified-gym';
  while (gyms.some(gym => gym.id === unknown)) unknown += '-x';
  const rejected = await client.callTool({ name: 'get_account_context', arguments: { gymId: unknown } });
  assert.equal(rejected.isError, true);
  assert.match(JSON.stringify(rejected), /GYM_NOT_ACCESSIBLE/);
});
if (!live) await withClient({ PACKAGE_FIXTURE_DENY: '1' }, async client => {
  const denied = await client.callTool({ name: 'get_account_context', arguments: {} });
  assert.equal(denied.isError, true);
  assert.doesNotMatch(JSON.stringify(denied), /synthetic-password|private upstream content|synthetic-cookie/);
});
// Startup validation needs neither credentials nor an HTTP mock, and must leave stdout empty.
try {
  await promisify(execFile)(binary, [], { cwd: work, env: { PATH: process.env.PATH } });
  assert.fail('Startup without credentials unexpectedly succeeded');
} catch (error) {
  assert.equal(error.code, 1);
  assert.equal(error.stdout, '');
  assert.match(error.stderr, /^INVALID_CONFIGURATION: /);
}
process.stdout.write(JSON.stringify({ mode: live ? 'live-read-only' : 'anonymized', initialization: 'passed', toolCount: 11, accountContext: 'passed', accessibleGymCount: gymCount, explicitSelection: 'passed', inaccessibleSelection: 'rejected', sanitizedErrors: 'passed', serverStderr: 'empty' }) + '\n');
