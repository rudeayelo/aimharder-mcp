import { APIError } from 'better-auth/api';
import type { HostedEnvironment } from './auth.js';
import { digest, participant } from './admission.js';
export const grantClaim = 'https://ahmcp.link/mcp-grant';
interface Grant { id: string; userId: string; clientId: string; authorizedAt: number; }
function invalidGrant(): never {
  throw new APIError('BAD_REQUEST', { error: 'invalid_grant', error_description: 'Authorization is unavailable. Authorize this client again.' });
}
// The maintained provider uses this same configured SHA-256 storage hook.
// Raw authorization codes and refresh tokens never enter the service ledger.
export async function readIssuingGrant(env: HostedEnvironment, body: Record<string, unknown>): Promise<Grant> {
  if (body.grant_type === 'authorization_code' && typeof body.code === 'string') {
    const id = await digest(body.code);
    const verification = await env.AUTH_DB.prepare('SELECT value,createdAt FROM verification WHERE identifier=?').bind(id).first<{ value: string; createdAt: number }>();
    if (!verification) invalidGrant();
    let value: { type?: string; userId?: string; query?: { client_id?: string } };
    try { value = JSON.parse(verification.value); } catch { invalidGrant(); }
    if (value.type !== 'authorization_code' || !value.userId || !value.query?.client_id) invalidGrant();
    if (!await participant(env, value.userId)) invalidGrant();
    return { id, userId: value.userId, clientId: value.query.client_id, authorizedAt: verification.createdAt };
  }
  if (body.grant_type === 'refresh_token' && typeof body.refresh_token === 'string') {
    const row = await env.AUTH_DB.prepare('SELECT g.id,g.userId,g.clientId,g.authorizedAt FROM oauthRefreshToken r JOIN portal_mcp_grant g ON g.id=r.authorizationCodeId WHERE r.token=? AND g.revokedAt IS NULL')
      .bind(await digest(body.refresh_token)).first<Grant>();
    if (row && await participant(env, row.userId)) return row;
  }
  invalidGrant();
}
export async function issueGrantClaim(env: HostedEnvironment, grant: Grant | undefined, userId: string | undefined) {
  if (!grant || grant.userId !== userId || !await participant(env, grant.userId)) invalidGrant();
  // Never reset an existing tombstone. A refresh retains the original grant ID.
  await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO portal_mcp_grant (id,userId,clientId,authorizedAt)
    SELECT ?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM portal_mcp_revocation WHERE userId=? AND clientId=? AND revokedBefore>=?)`)
    .bind(grant.id, grant.userId, grant.clientId, grant.authorizedAt, grant.userId, grant.clientId, grant.authorizedAt).run();
  if (!await currentGrant(env, grant.id, grant.userId, grant.clientId)) invalidGrant();
  return { [grantClaim]: grant.id };
}
export async function currentGrant(env: HostedEnvironment, id: unknown, userId: unknown, clientId: unknown): Promise<boolean> {
  if (typeof id !== 'string' || typeof userId !== 'string' || typeof clientId !== 'string' || !await participant(env, userId)) return false;
  return Boolean(await env.AUTH_DB.prepare(`SELECT g.id FROM portal_mcp_grant g JOIN oauthClient c ON c.clientId=g.clientId
    WHERE g.id=? AND g.userId=? AND g.clientId=? AND g.revokedAt IS NULL AND COALESCE(c.disabled,0)=0
    AND NOT EXISTS (SELECT 1 FROM portal_mcp_revocation r WHERE r.userId=g.userId AND r.clientId=g.clientId AND r.revokedBefore>=g.authorizedAt)`)
    .bind(id, userId, clientId).first());
}
export async function revokeClient(env: HostedEnvironment, userId: string, clientId: string) {
  const now = Date.now();
  // This atomic batch is the revocation point. Concurrent stale issuers retain a
  // revoked grant ID; unexchanged old codes are rejected by the cutoff.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare('INSERT INTO portal_mcp_revocation (userId,clientId,revokedBefore) SELECT ?,clientId,? FROM oauthClient WHERE clientId=? ON CONFLICT(userId,clientId) DO UPDATE SET revokedBefore=MAX(revokedBefore,excluded.revokedBefore)').bind(userId, now, clientId),
    env.AUTH_DB.prepare('UPDATE portal_mcp_grant SET revokedAt=? WHERE userId=? AND clientId=?').bind(now, userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthAccessToken WHERE userId=? AND clientId=?').bind(userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthRefreshToken WHERE userId=? AND clientId=?').bind(userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthConsent WHERE userId=? AND clientId=?').bind(userId, clientId),
  ]);
}
