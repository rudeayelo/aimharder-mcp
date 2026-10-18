import { z } from 'zod';
import type { HostedEnvironment } from './auth.js';
import { createAuth } from './auth.js';
import { digest, invitationLifetime, normalizeEmail, participant } from './admission.js';
import { mailConfigured, sendPortalMail } from './mail.js';

export async function listInvitations(env: HostedEnvironment) {
  const { results } = await env.AUTH_DB.prepare(
    `SELECT id,email,expiresAt,CASE WHEN acceptedAt IS NOT NULL THEN 'accepted' WHEN revokedAt IS NOT NULL THEN 'revoked' WHEN expiresAt<=? THEN 'expired' ELSE 'pending' END AS status FROM portal_invitation ORDER BY createdAt DESC LIMIT 100`
  ).bind(Date.now()).all<{ id: string; email: string; expiresAt: number; status: string }>();
  return results;
}
export async function handleInvitations(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!path.startsWith('/api/portal/invitations')) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ message: 'Sign in required.' }, { status: 401 });
  const actor = await participant(env, session.user.id);
  if (actor?.role !== 'admin') return Response.json({ message: 'Administrator access required.' }, { status: 403 });
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(env.BASE_URL).origin)
    return Response.json({ message: 'Request origin rejected.' }, { status: 403 });
  if (path === '/api/portal/invitations' && request.method === 'GET') return Response.json({ invitations: await listInvitations(env) });
  if (path === '/api/portal/invitations' && request.method === 'POST') {
    if (!mailConfigured(env)) return Response.json({ message: 'Email delivery is unavailable. Please try later.' }, { status: 503 });
    const parsed = z.object({ email: z.email().max(254) }).strict().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ message: 'Enter a valid email address.' }, { status: 400 });
    const email = normalizeEmail(parsed.data.email);
    const existing = await env.AUTH_DB.prepare('SELECT p.userId FROM portal_participant p JOIN user u ON u.id=p.userId WHERE u.email=?').bind(email).first();
    if (existing) return Response.json({ message: 'This participant has already joined.' }, { status: 409 });
    const id = crypto.randomUUID();
    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
    await env.AUTH_DB.prepare('INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,createdAt) VALUES (?,?,?,?,?)')
      .bind(id, email, await digest(token), Date.now() + invitationLifetime, Date.now()).run();
    const url = new URL('/accept-invitation', env.BASE_URL);
    url.searchParams.set('token', token);
    try { await sendPortalMail(env, { kind: 'invitation', to: email, url: url.href }); }
    catch {
      await env.AUTH_DB.prepare('UPDATE portal_invitation SET revokedAt=? WHERE id=? AND acceptedAt IS NULL').bind(Date.now(), id).run();
      return Response.json({ message: 'The invitation could not be delivered. Please try later.' }, { status: 503 });
    }
    return Response.json({ id, message: 'Invitation sent. It expires in seven days.' }, { status: 201 });
  }
  const revoke = /^\/api\/portal\/invitations\/([^/]+)\/revoke$/.exec(path);
  if (revoke && request.method === 'POST') {
    const result = await env.AUTH_DB.prepare('UPDATE portal_invitation SET revokedAt=? WHERE id=? AND acceptedAt IS NULL AND revokedAt IS NULL')
      .bind(Date.now(), revoke[1]).run();
    return Response.json({ message: result.meta.changes ? 'Invitation revoked.' : 'This invitation cannot be revoked.' }, { status: result.meta.changes ? 200 : 409 });
  }
  return new Response(null, { status: 405 });
}
