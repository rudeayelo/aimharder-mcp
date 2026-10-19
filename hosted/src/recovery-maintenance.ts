import type {HostedEnvironment} from './auth.js';
import {recoveryAvailable,recordDeletionPurged} from './recovery-authority.js';
import {eraseDeletedProjection} from './account-deletion.js';
interface Deletion {userId:string;cleanupDeadline:number;purgePending:number;purgedAt:number|null;memoryClearedAt:number|null;status:string;}
/** Current residual inventory, including non-FK state, before a full projection can erase it. */
export async function deletedPayloadPresent(env:HostedEnvironment,subject:string,invitations:string[]):Promise<boolean>{
 if(await env.AUTH_DB.prepare('SELECT id FROM user WHERE id=?').bind(subject).first())return true;
 if(await env.AUTH_DB.prepare("SELECT id FROM verification WHERE value=? OR (CASE WHEN json_valid(value) THEN json_extract(value,'$.userId') END)=? LIMIT 1").bind(subject,subject).first())return true;
 for(const id of invitations)if(await env.AUTH_DB.prepare('SELECT id FROM portal_invitation WHERE id=?').bind(id).first())return true;
 return false;
}
/** Tombstone-only purge is safe under an open/closed gate and held original read-back.
 * It never resets another user's auth, restores a capability, writes a restore marker,
 * opens the gate or depends on a possibly abandoned public/maintenance lease. */
export async function maintainDeletedAccounts(env:HostedEnvironment):Promise<{memoryPurgeSubjects:string[];status:'ok'|'failed'|'overdue'}>{
 if(!await recoveryAvailable(env))throw new Error('Recovery maintenance unavailable');
 const now=Date.now();let purged=0;let failed=false;const memoryPurgeSubjects:string[]=[];
 await env.RECOVERY_DB!.prepare(`INSERT INTO recovery_watchdog(id,lastAttemptAt,status) VALUES (1,?,'running') ON CONFLICT(id) DO UPDATE SET lastAttemptAt=excluded.lastAttemptAt,status='running'`).bind(now).run();
 try{
  const deleted=(await env.RECOVERY_DB!.prepare('SELECT userId,cleanupDeadline,purgePending,purgedAt,memoryClearedAt,status FROM recovery_deleted').all<Deletion>()).results;
  for(const row of deleted){
   try{
   await env.RECOVERY_DB!.prepare('UPDATE recovery_deleted SET lastAttemptAt=? WHERE userId=?').bind(now,row.userId).run();
   const invitations=(await env.RECOVERY_DB!.prepare('SELECT id FROM recovery_invitation WHERE userId=?').bind(row.userId).all<{id:string}>()).results;
   const residual=await deletedPayloadPresent(env,row.userId,invitations.map(row=>row.id));
   if(residual){
    if(invitations.length)await env.AUTH_DB.batch(invitations.map(invitation=>env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_deleted_invitation(id) VALUES (?)').bind(invitation.id)));
    await eraseDeletedProjection(env,row.userId);purged++;
   }
   await recordDeletionPurged(env,row.userId,residual);
   if(residual||row.memoryClearedAt===null)memoryPurgeSubjects.push(row.userId);
   }catch{
    failed=true;
    // A corrupt/failing identity must not indefinitely postpone another
    // participant's otherwise available original-deadline purge.
    try{await env.RECOVERY_DB!.prepare("UPDATE recovery_deleted SET status=CASE WHEN status='overdue' OR cleanupDeadline<? THEN 'overdue' ELSE 'failed' END WHERE userId=?").bind(Date.now(),row.userId).run();}catch{/* Global failure still records the selective reporting failure; continue later tombstones. */}
   }
  }
  // Observe known residual state before global expired-state cleanup can erase it.
  // If an evidence write failed, retain that row for the next trusted attempt.
  if(!failed)await env.AUTH_DB.prepare('DELETE FROM verification WHERE expiresAt<=?').bind(now).run();
  const overdue=await env.RECOVERY_DB!.prepare("SELECT userId FROM recovery_deleted WHERE status='overdue' LIMIT 1").first();
  const status=overdue?'overdue':failed?'failed':'ok';
  await env.RECOVERY_DB!.prepare("UPDATE recovery_watchdog SET lastSuccessAt=CASE WHEN ?='ok' THEN ? ELSE lastSuccessAt END,lastPurgedCount=?,status=? WHERE id=1").bind(status,Date.now(),purged,status).run();
  return {memoryPurgeSubjects,status};
 }catch{
  await env.RECOVERY_DB!.prepare("UPDATE recovery_deleted SET status=CASE WHEN status='overdue' OR cleanupDeadline<? THEN 'overdue' ELSE 'failed' END WHERE lastSuccessAt IS NULL OR lastAttemptAt>lastSuccessAt").bind(Date.now()).run();
  await env.RECOVERY_DB!.prepare("UPDATE recovery_watchdog SET status=CASE WHEN EXISTS(SELECT 1 FROM recovery_deleted WHERE status='overdue') THEN 'overdue' ELSE 'failed' END WHERE id=1").run();
  const overdue=await env.RECOVERY_DB!.prepare("SELECT userId FROM recovery_deleted WHERE status='overdue' LIMIT 1").first();
  return {memoryPurgeSubjects,status:overdue?'overdue':'failed'};
 }
}
/** Trusted operator health projection; no secret or private sporting data. */
export async function recoveryMaintenanceStatus(env:HostedEnvironment){
 const health=await env.RECOVERY_DB!.prepare('SELECT lastAttemptAt,lastSuccessAt,status,lastPurgedCount FROM recovery_watchdog WHERE id=1').first();
 const deleted=(await env.RECOVERY_DB!.prepare('SELECT userId,cleanupDeadline,purgePending,purgedAt,memoryClearedAt,lastAttemptAt,lastSuccessAt,status FROM recovery_deleted').all<Deletion>()).results;
 let remainingDeletedIdentities=0;for(const row of deleted)if(await env.AUTH_DB.prepare('SELECT id FROM user WHERE id=?').bind(row.userId).first())remainingDeletedIdentities++;
 return {...health,remainingDeletedIdentities,deletions:deleted};
}
