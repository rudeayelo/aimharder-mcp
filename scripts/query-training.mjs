// Runnable consuming-client example, not a server tool or separate CLI product.
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { queryTraining } from '../dist/consumer.js';

const env = Object.fromEntries(['AIMHARDER_USERNAME', 'AIMHARDER_PASSWORD', 'AIMHARDER_DEFAULT_GYM', 'AIMHARDER_GYM_TIME_ZONES'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
const client = new Client({ name: 'aimharder-training-example', version: '1.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))], env, stderr: 'pipe' });
// Do not forward child-process diagnostics that could contain private source information.
transport.stderr?.on('data', () => {});
try {
  await client.connect(transport);
  const result = await queryTraining(client, {
    date: process.argv[2] ?? 'tomorrow', className: process.argv[3] ?? 'WOD',
    ...(process.argv[4] ? { gymId: process.argv[4] } : {}),
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch {
  process.stderr.write('Training query could not be confirmed. Check the date, class name, account configuration and confirmed gym time zone.\n');
  process.exitCode = 1;
} finally { await client.close(); }
