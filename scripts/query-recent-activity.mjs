// Runnable consuming-client example, not a server tool or separate CLI product.
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { queryRecentActivity } from '../dist/recent-activity-consumer.js';

const env = Object.fromEntries(['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
const client = new Client({ name: 'aimharder-recent-activity-example', version: '1.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))], env, stderr: 'pipe' });
// Do not forward child-process diagnostics that could contain private source information.
transport.stderr?.on('data', () => {});
try {
  await client.connect(transport);
  const result = await queryRecentActivity(client, {
    endDate: process.argv[2], maxWindows: Number(process.argv[3] ?? 3),
    ...(process.argv[4] ? { gymId: process.argv[4] } : {}),
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch {
  process.stderr.write('Recent activity query could not be confirmed. Check the end date, window limit, account configuration and gym time zone.\n');
  process.exitCode = 1;
} finally { await client.close(); }
