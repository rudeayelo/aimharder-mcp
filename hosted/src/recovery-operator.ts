/** Trusted operator module; not an HTTP route. Provider API may execute its SQL plan. */
import type { HostedEnvironment } from './auth.js';
import { recoveryAvailable } from './recovery-authority.js';
import { eraseDeletedProjection } from './account-deletion.js';
interface Head {authorityId:string;epoch:number;gate:'open'|'closed';closedAt:number|null;checkpoint:string;}
interface SecuritySnapshot {
  users:{userId:string;role:'admin'|'user';status:'active'|'suspended';accessGeneration:number;revision:string|null}[];
  policies:{role:'admin'|'user';publication:number;deletion:number}[];
  clients:{clientId:string;disabled:number|null}[];
}
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
  const clients=(await env.AUTH_DB.prepare('SELECT clientId,disabled FROM oauthClient').all<SecuritySnapshot['clients'][number]>()).results;
  await env.RECOVERY_DB!.prepare('INSERT OR REPLACE INTO recovery_snapshot(checkpoint,value) VALUES (?,?)').bind(checkpoint,JSON.stringify({users,policies,clients})).run();
  return {checkpoint,participants:users.length};
}
export async function reconcileRecovery(env:HostedEnvironment,checkpoint:string){
  const value=await drained(env,checkpoint);
  const sealed=await env.RECOVERY_DB!.prepare('SELECT value FROM recovery_snapshot WHERE checkpoint=?').bind(checkpoint).first<{value:string}>();
  if(!sealed)throw new Error('Latest pre-restore security snapshot unavailable');
  const snapshot=JSON.parse(sealed.value) as SecuritySnapshot;
  const deletions=(await env.RECOVERY_DB!.prepare('SELECT userId FROM recovery_deleted').all<{userId:string}>()).results;
  const forbidden=new Set(deletions.map(row=>row.userId));
  const permitted=new Map(snapshot.users.filter(row=>!forbidden.has(row.userId)).map(row=>[row.userId,row]));
  const restored=(await env.AUTH_DB.prepare('SELECT id FROM user').all<{id:string}>()).results;
  for(const user of restored)if(!permitted.has(user.id))await eraseDeletedProjection(env,user.id);
  // All restored executable authentication capabilities require fresh proof.
  const statements=[
    ...['session','verification','oauthAccessToken','oauthRefreshToken','oauthConsent','portal_mcp_grant','portal_mcp_revocation','portal_action_journal','portal_pending_admission','portal_verification_delivery'].map(table=>env.AUTH_DB.prepare(`DELETE FROM ${table}`)),
    env.AUTH_DB.prepare("UPDATE account SET password=CASE WHEN providerId='credential' THEN 'recovery-proof-required' ELSE password END,accessToken=NULL,refreshToken=NULL,idToken=NULL"),
    env.AUTH_DB.prepare('UPDATE portal_invitation SET revokedAt=COALESCE(revokedAt,?) WHERE acceptedAt IS NULL').bind(Date.now()),
    ...snapshot.users.filter(row=>permitted.has(row.userId)).map(row=>env.AUTH_DB.prepare('UPDATE portal_participant SET role=?,status=?,accessGeneration=? WHERE userId=?').bind(row.role,row.status,row.accessGeneration+1,row.userId)),
    ...snapshot.policies.map(row=>env.AUTH_DB.prepare('UPDATE portal_activity_policy SET publication=?,deletion=? WHERE role=?').bind(row.publication,row.deletion,row.role)),
    ...snapshot.clients.map(row=>env.AUTH_DB.prepare('UPDATE oauthClient SET disabled=? WHERE clientId=?').bind(row.disabled,row.clientId)),
    ...snapshot.users.map(row=>env.AUTH_DB.prepare('DELETE FROM portal_aimharder_connection WHERE userId=? AND (? IS NULL OR revision<>?)').bind(row.userId,row.revision,row.revision)),
    env.AUTH_DB.prepare('INSERT OR REPLACE INTO portal_recovery_checkpoint(id,epoch,checkpoint) VALUES (1,?,?)').bind(value.epoch+1,checkpoint),
  ];
  await env.AUTH_DB.batch(statements);
  return {checkpoint,nextEpoch:value.epoch+1};
}
export async function openRecovery(env:HostedEnvironment,checkpoint:string){
  const value=await drained(env,checkpoint);
  const applied=await env.AUTH_DB.prepare('SELECT epoch,checkpoint FROM portal_recovery_checkpoint WHERE id=1').first<{epoch:number;checkpoint:string}>();
  if(applied?.epoch!==value.epoch+1||applied.checkpoint!==checkpoint)throw new Error('Restore projection has not been reconciled');
  await env.RECOVERY_DB!.batch([
    env.RECOVERY_DB!.prepare("UPDATE recovery_interval SET openedAt=? WHERE epoch=? AND openedAt IS NULL").bind(Date.now(),value.epoch),
    env.RECOVERY_DB!.prepare("UPDATE recovery_head SET gate='open',epoch=epoch+1,closedAt=NULL,checkpoint=? WHERE authorityId=? AND gate='closed' AND checkpoint=? AND NOT EXISTS(SELECT 1 FROM recovery_lease)").bind(crypto.randomUUID(),env.RECOVERY_AUTHORITY_ID,checkpoint),
    env.RECOVERY_DB!.prepare('DELETE FROM recovery_snapshot WHERE checkpoint=?').bind(checkpoint),
  ]);
  if((await head(env)).gate!=='open')throw new Error('Recovery did not reopen');
  return {epoch:value.epoch+1};
}
