// `pnpm lab` starts the lab on 127.0.0.1. `pnpm lab --host` listens on every
// interface so the lab is reachable on the tailnet. `--port <n>` changes the port.
import { execFileSync } from 'node:child_process';
import { startLabServer } from './server.ts';

const args = process.argv.slice(2);
const exposed = args.includes('--host');
const portIndex = args.indexOf('--port');
const port = portIndex >= 0 ? Number(args[portIndex + 1]) : 5174;
const lab = await startLabServer({ host: exposed ? '0.0.0.0' : '127.0.0.1', port });
console.log(`Kettle lab: ${lab.url}/`);
if (exposed) {
  try {
    const status = JSON.parse(execFileSync('tailscale', ['status', '--json'], { encoding: 'utf8', timeout: 5000 })) as {
      Self?: { DNSName?: string; TailscaleIPs?: string[] };
    };
    const name = status.Self?.DNSName?.replace(/\.$/, '');
    const ip = status.Self?.TailscaleIPs?.find((address) => address.includes('.'));
    if (name) console.log(`Tailnet:    http://${name}:${port}/`);
    if (ip) console.log(`            http://${ip}:${port}/`);
  } catch {
    console.log('Listening on all interfaces; Tailscale status unavailable.');
  }
}
