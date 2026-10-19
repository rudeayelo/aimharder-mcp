// Only synthetic auth/bootstrap data; production handles every connection request.
import setup from './mcp-auth-fixture-worker.js';
import production from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export { AccountConnection } from '../src/account-connection.js';
export default { fetch(request: Request, env: HostedEnvironment) {
  return new URL(request.url).pathname === '/__fixture' ? setup.fetch(request, env) : production.fetch(request, env);
} };
