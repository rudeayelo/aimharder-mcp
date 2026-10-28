import { recoveryAdmission } from './recovery-authority.js';
import { APIError } from 'better-auth/api';
import type { HostedEnvironment } from './auth.js';
import { digest, participant } from './admission.js';
export const grantClaim = 'https://ahmcp.link/mcp-grant';
interface Grant { id: string; userId: string; clientId: string; revocationGeneration: number; }
function invalidGrant(): never {
  throw new APIError('BAD_REQUEST', { error: 'invalid_grant', error_description: 'Authorization is unavailable. Authorize this client again.' });
}
// The maintained provider uses this same configured SHA-256 storage hook.
// Raw authorization codes and refresh tokens never enter the service ledger.
export async function readIssuingGrant(env: HostedEnvironment, body: Record<string, unknown>): Promise<Grant> {
  if (body.grant_type === 'authorization_code' && typeof body.code === 'string') {
    const id = await digest(body.code);
    const verification = await env.AUTH_DB.prepare('SELECT value FROM verification WHERE identifier=?').bind(id).first<{ value: string }>();
    if (!verification) invalidGrant();
    let value: { type?: string; userId?: string; query?: { client_id?: string }; portalMcpGeneration?: number };
    try { value = JSON.parse(verification.value); } catch { invalidGrant(); }
    if (value.type !== 'authorization_code' || !value.userId || !value.query?.client_id ||
      !Number.isSafeInteger(value.portalMcpGeneration) || value.portalMcpGeneration! < 0) invalidGrant();
    if (!await participant(env, value.userId)) invalidGrant();
    return { id, userId: value.userId, clientId: value.query.client_id, revocationGeneration: value.portalMcpGeneration! };
  }
  if (body.grant_type === 'refresh_token' && typeof body.refresh_token === 'string') {
    const row = await env.AUTH_DB.prepare('SELECT g.id,g.userId,g.clientId,g.revocationGeneration FROM oauthRefreshToken r JOIN portal_mcp_grant g ON g.id=r.authorizationCodeId WHERE r.token=? AND g.revokedAt IS NULL')
      .bind(await digest(body.refresh_token)).first<Grant>();
    if (row && await participant(env, row.userId)) return row;
  }
  invalidGrant();
}
export async function issueGrantClaim(env: HostedEnvironment, grant: Grant | undefined, userId: string | undefined) {
  if (!grant || grant.userId !== userId || !await participant(env, grant.userId)) invalidGrant();
  // Never reset an existing tombstone. A refresh retains the original grant ID.
  await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO portal_mcp_grant (id,userId,clientId,revocationGeneration)
    SELECT ?,?,?,? WHERE COALESCE((SELECT generation FROM portal_mcp_revocation WHERE userId=? AND clientId=?),0)=?`)
    .bind(grant.id, grant.userId, grant.clientId, grant.revocationGeneration, grant.userId, grant.clientId, grant.revocationGeneration).run();
  if (!await currentGrant(env, grant.id, grant.userId, grant.clientId)) invalidGrant();
  return { [grantClaim]: grant.id };
}
export async function currentGrant(env: HostedEnvironment, id: unknown, userId: unknown, clientId: unknown, connectionRevision?: string, activityFeature?: 'publication'|'deletion'): Promise<boolean> {
  if (typeof id !== 'string' || typeof userId !== 'string' || typeof clientId !== 'string') return false;
  if(!await recoveryAdmission(env,userId))return false;
  return Boolean(await env.AUTH_DB.prepare(`SELECT g.id FROM portal_mcp_grant g JOIN oauthClient c ON c.clientId=g.clientId
    JOIN portal_participant p ON p.userId=g.userId JOIN user u ON u.id=p.userId
    WHERE p.status='active' AND u.emailVerified=1 AND g.id=? AND g.userId=? AND g.clientId=? AND g.revokedAt IS NULL AND COALESCE(c.disabled,0)=0
    AND COALESCE((SELECT generation FROM portal_mcp_revocation r WHERE r.userId=g.userId AND r.clientId=g.clientId),0)=g.revocationGeneration${connectionRevision === undefined ? '' : ' AND EXISTS (SELECT 1 FROM portal_aimharder_connection a WHERE a.userId=g.userId AND a.revision=?)'}${activityFeature === undefined ? '' : ` AND EXISTS (SELECT 1 FROM portal_activity_policy f WHERE f.role=p.role AND f.${activityFeature}=1)`}`)
    .bind(id, userId, clientId, ...(connectionRevision === undefined ? [] : [connectionRevision])).first());
}
export async function revokeClient(env: HostedEnvironment, userId: string, clientId: string) {
  const now = Date.now();
  // This atomic batch is the revocation point. Concurrent stale issuers retain a
  // revoked grant ID; pending code issuers retain their older generation.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare('INSERT INTO portal_mcp_revocation (userId,clientId,generation) SELECT ?,clientId,1 FROM oauthClient WHERE clientId=? ON CONFLICT(userId,clientId) DO UPDATE SET generation=generation+1').bind(userId, clientId),
    env.AUTH_DB.prepare('UPDATE portal_mcp_grant SET revokedAt=? WHERE userId=? AND clientId=?').bind(now, userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthAccessToken WHERE userId=? AND clientId=?').bind(userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthRefreshToken WHERE userId=? AND clientId=?').bind(userId, clientId),
    env.AUTH_DB.prepare('DELETE FROM oauthConsent WHERE userId=? AND clientId=?').bind(userId, clientId),
  ]);
}
