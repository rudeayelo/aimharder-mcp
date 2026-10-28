// Synthetic admission/bootstrap only; all queried routes use production handlers.
import setup from './account-connection-fixture-worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export { AccountConnection } from '../src/account-connection.js';
export default { async fetch(request: Request, env: HostedEnvironment) {
  const response = await setup.fetch(request, env);
  if (new URL(request.url).pathname === '/__fixture')
    await env.AUTH_DB.prepare('UPDATE portal_participant SET role=? WHERE userId=?').bind('admin', 'portal-fixture').run();
  return response;
} };
