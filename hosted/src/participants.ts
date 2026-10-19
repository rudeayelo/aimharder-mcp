import { createAuth, type HostedEnvironment } from './auth.js';
import { participant } from './admission.js';
import { page } from './portal.js';

function escape(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
/** Administration projects configuration presence only; it never opens an upstream connection. */
export async function handleParticipants(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  const api = path.startsWith('/api/portal/participants');
  if (!api && path !== '/admin/participants' && !path.startsWith('/portal/participants/')) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  const actor = session && await participant(env, session.user.id);
  const reply = (message: string, status: number) => api
    ? Response.json({ message }, { status, headers: { 'cache-control': 'no-store' } })
    : page('Participant administration', `<p>${escape(message)}</p><a href="/admin/participants">Manage participants</a>`, status);
  if (actor?.role !== 'admin') return reply('Administrator access required.', session ? 403 : 401);
  if (request.method === 'GET' && (path === '/api/portal/participants' || path === '/admin/participants')) {
    const { results } = await env.AUTH_DB.prepare(`SELECT p.userId,u.name,u.email,p.role,p.status,
      CASE WHEN c.userId IS NULL THEN 'not-connected' ELSE 'configured' END AS connectionStatus
      FROM portal_participant p JOIN user u ON u.id=p.userId LEFT JOIN portal_aimharder_connection c ON c.userId=p.userId
      ORDER BY p.admittedAt,p.userId LIMIT 100`).all<{userId:string;name:string;email:string;role:string;status:string;connectionStatus:string}>();
    if (api) return Response.json({ participants: results }, { headers: { 'cache-control': 'no-store' } });
    return page('Manage participants', `<p>Connection status shows whether configuration is saved. It does not test upstream access. Suspension retains configuration and blocks portal and MCP use. Reactivation requires a new MCP authorization.</p><table><thead><tr><th>Participant</th><th>Role</th><th>Status</th><th>AimHarder connection</th><th>Action</th></tr></thead><tbody>${results.map(item => `<tr><td>${escape(item.name)}<br>${escape(item.email)}</td><td>${escape(item.role)}</td><td>${escape(item.status)}</td><td>${escape(item.connectionStatus)}</td><td>${item.userId === actor.userId ? '' : `<form method="post" action="/portal/participants/${encodeURIComponent(item.userId)}/${item.status === 'active' ? 'suspend' : 'reactivate'}"><button>${item.status === 'active' ? 'Suspend' : 'Reactivate'}</button></form>`}</td></tr>`).join('')}</tbody></table><a href="/admin/invitations">Manage invitations</a>`);
  }
  if (request.method !== 'POST') return reply('Request unavailable.', 405);
  if (request.headers.get('origin') !== new URL(env.BASE_URL).origin) return reply('Request origin rejected.', 403);
  const action = /^\/(?:api\/portal|portal)\/participants\/([^/]+)\/(suspend|reactivate)$/.exec(path);
  if (!action) return reply('Request unavailable.', 405);
  let target: string;
  try { target = decodeURIComponent(action[1]!); } catch { return reply('Participant unavailable.', 400); }
  if (!target || target.length > 256) return reply('Participant unavailable.', 400);
  if (target === actor.userId) return reply('You cannot suspend your own administrator access.', 409);
  const expected = action[2] === 'suspend' ? 'active' : 'suspended';
  const next = action[2] === 'suspend' ? 'suspended' : 'active';
  const guard = `EXISTS (SELECT 1 FROM portal_participant target WHERE target.userId=? AND target.status=?)
    AND EXISTS (SELECT 1 FROM portal_participant administrator JOIN user u ON u.id=administrator.userId WHERE administrator.userId=? AND administrator.role='admin' AND administrator.status='active' AND u.emailVerified=1)`;
  const guarded = (sql: string, ...values: unknown[]) => env.AUTH_DB.prepare(sql).bind(...values, target, expected, actor.userId);
  // D1 serializes this entire batch. Every statement checks the same old status;
  // status changes last. No observer can admit a new generation while suspended.
  // Include clients without completed grants: their pending codes also carry a generation.
  const results = await env.AUTH_DB.batch([
    guarded(`INSERT INTO portal_mcp_revocation (userId,clientId,generation) SELECT ?,clientId,1 FROM oauthClient WHERE ${guard}
      ON CONFLICT(userId,clientId) DO UPDATE SET generation=generation+1`, target),
    guarded(`UPDATE portal_mcp_grant SET revokedAt=? WHERE userId=? AND ${guard}`, Date.now(), target),
    ...['oauthAccessToken','oauthRefreshToken','oauthConsent','session'].map(table => guarded(`DELETE FROM ${table} WHERE userId=? AND ${guard}`, target)),
    guarded(`UPDATE portal_participant SET status=?,accessGeneration=accessGeneration+1 WHERE userId=? AND ${guard}`, next, target),
  ]);
  if (!results.at(-1)?.meta.changes) return reply('Participant state did not change.', 409);
  return api ? new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } })
    : new Response(null, { status: 303, headers: { location: '/admin/participants', 'cache-control': 'no-store' } });
}
