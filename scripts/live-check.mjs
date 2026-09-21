import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

if (process.env.AIMHARDER_LIVE_CHECK !== '1') {
  process.stderr.write('Set AIMHARDER_LIVE_CHECK=1 to authorize live authentication and account discovery.\n');
  process.exit(1);
}
const env = {};
for (const key of ['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM']) {
  if (process.env[key] !== undefined) env[key] = process.env[key];
}
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))],
  env,
  stderr: 'pipe',
});
const client = new Client({ name: 'aimharder-live-harness', version: '1.0.0' });
let hasStderr = false;
transport.stderr?.on('data', () => { hasStderr = true; });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), ['get_account_context']);
  const result = await client.callTool({ name: 'get_account_context', arguments: {} });
  assert.notEqual(result.isError, true);
  const context = result.structuredContent;
  assert.equal(context.account.authenticated, true);
  assert.ok(context.gyms.length > 0);
  assert.ok(context.gyms.some((gym) => gym.id === context.selectedGym.id));
  for (const gym of context.gyms) {
    const explicit = await client.callTool({ name: 'get_account_context', arguments: { gymId: gym.id } });
    assert.notEqual(explicit.isError, true);
    assert.equal(explicit.structuredContent.selectedGym.id, gym.id);
  }
  let inaccessible = 'unverified-gym';
  while (context.gyms.some((gym) => gym.id === inaccessible)) inaccessible += '-x';
  const rejected = await client.callTool({ name: 'get_account_context', arguments: { gymId: inaccessible } });
  assert.equal(rejected.isError, true);
  assert.ok(rejected.content.some((item) => item.type === 'text' && item.text.includes('GYM_NOT_ACCESSIBLE')));
  assert.equal(hasStderr, false);
  process.stdout.write(JSON.stringify({
    harness: 'MCP SDK client over stdio', authenticated: true,
    accessibleGymCount: context.gyms.length,
    explicitSelection: 'passed', inaccessibleSelection: 'rejected',
    timeZoneStatus: context.selectedGym.timeZoneStatus,
    serverStderr: 'empty',
  }, null, 2) + '\n');
} catch {
  process.stderr.write('Live MCP validation failed. Check configuration, authentication, and supported account contracts. Raw errors and responses are suppressed.\n');
  process.exitCode = 1;
} finally {
  await client.close();
}
