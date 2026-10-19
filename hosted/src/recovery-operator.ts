/** Trusted operator module; not an HTTP route. Provider API may execute its SQL plan. */
import type { HostedEnvironment } from './auth.js';
import {eraseDeletedAccountMemory} from './account-connection.js';
import {recordDeletedMemoryErased} from './recovery-authority.js';
import {deletedPayloadPresent,maintainDeletedAccounts} from './recovery-maintenance.js';
import { recoveryAvailable } from './recovery-authority.js';
interface Head {authorityId:string;epoch:number;gate:'open'|'closed';closedAt:number|null;checkpoint:string;}
import { retentionAuditPlan, projectionPlan, securitySnapshotSchema, type SecuritySnapshot } from './recovery-plan.js';
async function head(env:HostedEnvironment):Promise<Head>{
  if(!await recoveryAvailable(env))throw new Error('Independent authority unavailable');
  const value=await env.RECOVERY_DB!.prepare('SELECT * FROM recovery_head WHERE authorityId=?').bind(env.RECOVERY_AUTHORITY_ID).first<Head>();
  if(!value)throw new Error('Independent authority unavailable');return value;
}
async function drained(env:HostedEnvironment,checkpoint:string){
  const value=await head(env);
  const leases=await env.RECOVERY_DB!.prepare('SELECT COUNT(*) AS count FROM recovery_lease').first<{count:number}>();
  if(value.gate!=='closed'||value.checkpoint!==checkpoint||leases?.count!==0)throw new Error('Recovery is not closed and drained');
  return value;
}
export async function closeRecovery(env:HostedEnvironment,expectedCheckpoint:string){
  const now=Date.now();
  await env.RECOVERY_DB!.batch([
    env.RECOVERY_DB!.prepare("UPDATE recovery_head SET gate='closed',closedAt=? WHERE authorityId=? AND checkpoint=? AND gate='open'").bind(now,env.RECOVERY_AUTHORITY_ID,expectedCheckpoint),
    env.RECOVERY_DB!.prepare("INSERT OR IGNORE INTO recovery_interval(epoch,closedAt) SELECT epoch,closedAt FROM recovery_head WHERE authorityId=? AND checkpoint=? AND gate='closed'").bind(env.RECOVERY_AUTHORITY_ID,expectedCheckpoint),
  ]);
  const value=await head(env);
  if(value.checkpoint!==expectedCheckpoint||value.gate!=='closed')throw new Error('Recovery checkpoint changed');
  return {checkpoint:value.checkpoint,epoch:value.epoch,leases:(await env.RECOVERY_DB!.prepare('SELECT COUNT(*) AS count FROM recovery_lease').first<{count:number}>())!.count};
}
export async function sealRecovery(env:HostedEnvironment,checkpoint:string){
  await drained(env,checkpoint);
  const users=(await env.AUTH_DB.prepare(`SELECT p.userId,p.role,p.status,p.accessGeneration,c.revision FROM portal_participant p LEFT JOIN portal_aimharder_connection c ON c.userId=p.userId`).all<SecuritySnapshot['users'][number]>()).results;
  const policies=(await env.AUTH_DB.prepare('SELECT role,publication,deletion FROM portal_activity_policy').all<SecuritySnapshot['policies'][number]>()).results;
  const methods=(await env.AUTH_DB.prepare('SELECT id,userId,providerId,accountId FROM account').all<SecuritySnapshot['methods'][number]>()).results;
  const clients=(await env.AUTH_DB.prepare('SELECT clientId,disabled FROM oauthClient').all<SecuritySnapshot['clients'][number]>()).results;
  await env.RECOVERY_DB!.prepare('INSERT INTO recovery_snapshot(checkpoint,value) VALUES (?,?)').bind(checkpoint,JSON.stringify({users,policies,clients,methods})).run();
  return {checkpoint,participants:users.length};
}
export async function authorizeRestorePoint(env:HostedEnvironment,checkpoint:string,bookmark:string,targetAt:number){
  const value=await drained(env,checkpoint);const now=Date.now();
  const seal=await env.RECOVERY_DB!.prepare('SELECT checkpoint FROM recovery_snapshot WHERE checkpoint=?').bind(checkpoint).first();
  const dirty=await env.RECOVERY_DB!.prepare('SELECT epoch FROM recovery_interval WHERE closedAt<=? AND (openedAt IS NULL OR openedAt>=?)').bind(targetAt,targetAt).first();
  const deletionInterval=await env.RECOVERY_DB!.prepare('SELECT userId FROM recovery_deleted WHERE deletedAt<=? AND (purgedAt IS NULL OR purgedAt>=?) LIMIT 1').bind(targetAt,targetAt).first();
  if(deletionInterval||!seal||!bookmark||bookmark.length>256||!Number.isSafeInteger(targetAt)||targetAt>now||targetAt<now-7*86400000||targetAt>=value.closedAt!||dirty)throw new Error('Restore point is outside a clean retained interval');
  await env.RECOVERY_DB!.prepare('INSERT INTO recovery_restore(checkpoint,bookmark,targetAt,authorizedAt) VALUES (?,?,?,?)').bind(checkpoint,bookmark,targetAt,now).run();
  return {checkpoint,bookmark,targetAt};
}
export async function reconcileRecovery(env:HostedEnvironment,checkpoint:string){
  const value=await drained(env,checkpoint);
  const sealed=await env.RECOVERY_DB!.prepare('SELECT value FROM recovery_snapshot WHERE checkpoint=?').bind(checkpoint).first<{value:string}>();
  if(!sealed)throw new Error('Latest pre-restore security snapshot unavailable');
  if(!await env.RECOVERY_DB!.prepare('SELECT checkpoint FROM recovery_restore WHERE checkpoint=?').bind(checkpoint).first())throw new Error('Native restore point has not been authorized');
  const snapshot=securitySnapshotSchema.parse(JSON.parse(sealed.value));
  const deletions=(await env.RECOVERY_DB!.prepare('SELECT userId FROM recovery_deleted').all<{userId:string}>()).results;
  const invitations=(await env.RECOVERY_DB!.prepare('SELECT id,userId FROM recovery_invitation').all<{id:string;userId:string}>()).results;
  const residual:string[]=[];
  for(const row of deletions)if(await deletedPayloadPresent(env,row.userId,invitations.filter(invitation=>invitation.userId===row.userId).map(invitation=>invitation.id)))residual.push(row.userId);
  const auditId=crypto.randomUUID();const audit=retentionAuditPlan(deletions.map(row=>row.userId),residual,checkpoint,auditId,Date.now());
  await env.RECOVERY_DB!.batch(audit.before.map(statement=>env.RECOVERY_DB!.prepare(statement.sql).bind(...statement.params)));
  const statements=projectionPlan(snapshot,deletions.map(row=>row.userId),invitations.map(row=>row.id),value.epoch,checkpoint,auditId);
  await env.AUTH_DB.batch(statements.map(statement=>env.AUTH_DB.prepare(statement.sql).bind(...statement.params)));
  await env.RECOVERY_DB!.batch(audit.after.map(statement=>env.RECOVERY_DB!.prepare(statement.sql).bind(...statement.params)));
  return {checkpoint,nextEpoch:value.epoch+1};
}
export async function openRecovery(env:HostedEnvironment,checkpoint:string){
  const value=await drained(env,checkpoint);
  const applied=await env.AUTH_DB.prepare('SELECT epoch,checkpoint,auditId FROM portal_recovery_checkpoint WHERE id=1').first<{epoch:number;checkpoint:string;auditId:string}>();
  if(applied?.epoch!==value.epoch+1||applied.checkpoint!==checkpoint)throw new Error('Restore projection has not been reconciled');
  const audit=await env.RECOVERY_DB!.prepare('SELECT auditId,completedAt FROM recovery_projection_audit WHERE checkpoint=?').bind(checkpoint).first<{auditId:string;completedAt:number|null}>();
  if(!audit||audit.auditId!==applied.auditId||audit.completedAt===null)throw new Error('Restore retention audit has not completed');
  const maintenance=await maintainDeletedAccounts(env);
  // No public leases remain here; normal scheduled persistence cleanup never
  // waits for memory erasure behind an original account operation.
  for(const subject of maintenance.memoryPurgeSubjects){await eraseDeletedAccountMemory(env,subject);await recordDeletedMemoryErased(env,subject);}
  if(maintenance.status!=='ok')throw new Error('Recovery cleanup requires operator attention');
  await env.RECOVERY_DB!.batch([
    env.RECOVERY_DB!.prepare("UPDATE recovery_interval SET openedAt=? WHERE epoch=? AND openedAt IS NULL").bind(Date.now(),value.epoch),
    env.RECOVERY_DB!.prepare("UPDATE recovery_head SET gate='open',epoch=epoch+1,closedAt=NULL,checkpoint=? WHERE authorityId=? AND gate='closed' AND checkpoint=? AND NOT EXISTS(SELECT 1 FROM recovery_lease)").bind(crypto.randomUUID(),env.RECOVERY_AUTHORITY_ID,checkpoint),
    env.RECOVERY_DB!.prepare('DELETE FROM recovery_snapshot WHERE checkpoint=?').bind(checkpoint),
  ]);
  if((await head(env)).gate!=='open')throw new Error('Recovery did not reopen');
  return {epoch:value.epoch+1};
}
