// Synthetic admission/bootstrap only; every query uses the production entry point.
import setup from './mcp-auth-fixture-worker.js';
import production from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export { AccountConnection } from '../src/account-connection.js';
export default { async fetch(request: Request, env: HostedEnvironment, ctx: ExecutionContext) {
  if (new URL(request.url).pathname === '/__fixture') {
    const response = await setup.fetch(request, env);
    await env.AUTH_DB.prepare("UPDATE portal_participant SET role='admin' WHERE userId='portal-fixture'").run();
    return response;
  }
  return production.fetch(request, env, ctx);
} };
