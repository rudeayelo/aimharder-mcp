import type { HostedEnvironment } from './auth.js';

/** Independent security state. Never restore this database with AUTH_DB. */
export const recoverySchema = [
  `CREATE TABLE recovery_head (authorityId TEXT PRIMARY KEY, epoch INTEGER NOT NULL, gate TEXT NOT NULL CHECK(gate IN ('open','closed')), closedAt INTEGER, checkpoint TEXT NOT NULL)`,
  `CREATE TABLE recovery_lease (id TEXT PRIMARY KEY, epoch INTEGER NOT NULL, startedAt INTEGER NOT NULL)`,
  `CREATE TABLE recovery_deleted (userId TEXT PRIMARY KEY, deletedAt INTEGER NOT NULL)`,
  `CREATE TABLE recovery_invitation (id TEXT PRIMARY KEY)`,
  `CREATE TABLE recovery_snapshot (checkpoint TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE recovery_restore (checkpoint TEXT PRIMARY KEY, bookmark TEXT NOT NULL, targetAt INTEGER NOT NULL, authorizedAt INTEGER NOT NULL)`,
  `CREATE TABLE recovery_interval (epoch INTEGER PRIMARY KEY, closedAt INTEGER NOT NULL, openedAt INTEGER)`,
];
export async function recoveryAvailable(env: HostedEnvironment): Promise<boolean> {
  if (!env.RECOVERY_DB || !env.RECOVERY_AUTHORITY_ID) return false;
  return Boolean(await env.RECOVERY_DB.prepare('SELECT authorityId FROM recovery_head WHERE authorityId=?').bind(env.RECOVERY_AUTHORITY_ID).first());
}
export async function acquireRecoveryLease(env: HostedEnvironment): Promise<string | null> {
  if (!env.RECOVERY_DB || !env.RECOVERY_AUTHORITY_ID) return null;
  const id=crypto.randomUUID();
  const inserted=await env.RECOVERY_DB.prepare(`INSERT INTO recovery_lease(id,epoch,startedAt) SELECT ?,epoch,? FROM recovery_head WHERE authorityId=? AND (gate='open' OR EXISTS(SELECT 1 FROM recovery_lease parent WHERE parent.id=? AND parent.epoch=recovery_head.epoch))`).bind(id,Date.now(),env.RECOVERY_AUTHORITY_ID,env.RECOVERY_LEASE??'').run();
  return inserted.meta.changes ? id : null;
}
export async function releaseRecoveryLease(env: HostedEnvironment, id: string) {
  await env.RECOVERY_DB!.prepare('DELETE FROM recovery_lease WHERE id=?').bind(id).run();
}
export async function recoveryEpoch(env:HostedEnvironment):Promise<number>{
  const row=await env.RECOVERY_DB!.prepare('SELECT epoch FROM recovery_head WHERE authorityId=?').bind(env.RECOVERY_AUTHORITY_ID).first<{epoch:number}>();
  if(!row)throw new Error('Independent recovery authority unavailable');return row.epoch;
}
export async function recoveryAdmission(env: HostedEnvironment, subject?: string): Promise<boolean> {
  if (!env.RECOVERY_DB || !env.RECOVERY_AUTHORITY_ID || !env.RECOVERY_LEASE) return false;
  return Boolean(await env.RECOVERY_DB.prepare(`SELECT l.id FROM recovery_lease l JOIN recovery_head h ON h.authorityId=? AND h.epoch=l.epoch WHERE l.id=?${subject ? ' AND NOT EXISTS(SELECT 1 FROM recovery_deleted WHERE userId=?)' : ''}`).bind(env.RECOVERY_AUTHORITY_ID,env.RECOVERY_LEASE,...(subject?[subject]:[])).first());
}
export async function deletedIdentity(env: HostedEnvironment, subject: string): Promise<boolean> {
  if (!await recoveryAvailable(env)) throw new Error('Independent recovery authority unavailable');
  return Boolean(await env.RECOVERY_DB!.prepare('SELECT userId FROM recovery_deleted WHERE userId=?').bind(subject).first());
}
export async function recordDeletion(env: HostedEnvironment, subject: string, invitations: string[]) {
  if (!await recoveryAdmission(env,subject)) throw new Error('Independent recovery authority unavailable');
  await env.RECOVERY_DB!.batch([
    env.RECOVERY_DB!.prepare('INSERT OR IGNORE INTO recovery_deleted(userId,deletedAt) VALUES (?,?)').bind(subject,Date.now()),
    ...invitations.map(id=>env.RECOVERY_DB!.prepare('INSERT OR IGNORE INTO recovery_invitation(id) VALUES (?)').bind(id)),
    env.RECOVERY_DB!.prepare('UPDATE recovery_head SET checkpoint=? WHERE authorityId=?').bind(crypto.randomUUID(),env.RECOVERY_AUTHORITY_ID),
  ]);
}
export async function invitationAllowed(env: HostedEnvironment, id:string):Promise<boolean> {
  if(!await recoveryAdmission(env))return false;
  return !await env.RECOVERY_DB!.prepare('SELECT id FROM recovery_invitation WHERE id=?').bind(id).first();
}
