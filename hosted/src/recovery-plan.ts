import { z } from 'zod';
const opaque=z.string().min(1).max(256);
export const securitySnapshotSchema=z.object({
 users:z.array(z.object({userId:opaque,role:z.enum(['admin','user']),status:z.enum(['active','suspended']),accessGeneration:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER-1),revision:opaque.nullable()}).strict()).max(100),
 policies:z.array(z.object({role:z.enum(['admin','user']),publication:z.union([z.literal(0),z.literal(1)]),deletion:z.union([z.literal(0),z.literal(1)])}).strict()).length(2),
 methods:z.array(z.object({id:opaque,userId:opaque,providerId:z.enum(['credential','google']),accountId:opaque}).strict()).max(200),
 clients:z.array(z.object({clientId:opaque,disabled:z.number().int().nullable()}).strict()).max(100),
}).strict().superRefine((value,ctx)=>{
 for(const [kind,ids] of [['users',value.users.map(row=>row.userId)],['clients',value.clients.map(row=>row.clientId)],['policies',value.policies.map(row=>row.role)],['methods',value.methods.map(row=>row.id)]] as const)if(new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:`Duplicate ${kind}`});
 for(const user of value.users)if(value.methods.filter(method=>method.userId===user.userId).length>2)ctx.addIssue({code:'custom',message:'Too many linked methods'});
});
export type SecuritySnapshot=z.infer<typeof securitySnapshotSchema>;
export interface RecoveryStatement {sql:string;params:(string|number|null)[];}
export function projectionPlan(snapshot:SecuritySnapshot,deleted:string[],invites:string[],epoch:number,checkpoint:string,auditId:string):RecoveryStatement[]{
 const forbidden=new Set(deleted);const users=snapshot.users.filter(row=>!forbidden.has(row.userId));
 const statements:RecoveryStatement[]=[];
 const add=(sql:string,...params:(string|number|null)[])=>statements.push({sql,params});
 for(const table of ['session','verification','oauthAccessToken','oauthRefreshToken','oauthConsent','portal_mcp_grant','portal_mcp_revocation','portal_action_journal','portal_pending_admission','portal_verification_delivery'])add(`DELETE FROM ${table}`);
 const notPermitted=users.length?`userId NOT IN (${users.map(()=>'?').join(',')})`:'1';
 add(`DELETE FROM portal_participant WHERE ${notPermitted}`,...users.map(row=>row.userId));
 add(`DELETE FROM user WHERE ${users.length?`id NOT IN (${users.map(()=>'?').join(',')})`:'1'}`,...users.map(row=>row.userId));
 for(const id of invites){add('INSERT OR IGNORE INTO portal_deleted_invitation(id) VALUES (?)',id);add('DELETE FROM portal_invitation WHERE id=?',id);}
 add('DELETE FROM portal_invitation WHERE acceptedAt IS NOT NULL AND acceptedUserId IS NULL');
 for(const user of users){
  const methods=snapshot.methods.filter(method=>method.userId===user.userId);
  add(`DELETE FROM account WHERE userId=?${methods.length?` AND NOT (${methods.map(()=>'(id=? AND providerId=? AND accountId=?)').join(' OR ')})`:''}`,user.userId,...methods.flatMap(method=>[method.id,method.providerId,method.accountId]));
 }
 add("UPDATE account SET password=CASE WHEN providerId='credential' THEN 'recovery-proof-required' ELSE password END,accessToken=NULL,refreshToken=NULL,idToken=NULL");
 add('UPDATE portal_invitation SET revokedAt=COALESCE(revokedAt,?) WHERE acceptedAt IS NULL',Date.now());
 for(const row of users)add('UPDATE portal_participant SET role=?,status=?,accessGeneration=? WHERE userId=?',row.role,row.status,row.accessGeneration+1,row.userId);
 for(const row of snapshot.policies)add('UPDATE portal_activity_policy SET publication=?,deletion=? WHERE role=?',row.publication,row.deletion,row.role);
 add('UPDATE oauthClient SET disabled=1');
 for(const row of snapshot.clients)add('UPDATE oauthClient SET disabled=? WHERE clientId=?',row.disabled,row.clientId);
 for(const row of users)add('DELETE FROM portal_aimharder_connection WHERE userId=? AND (? IS NULL OR revision<>?)',row.userId,row.revision,row.revision);
 // Marker is LAST. Sequential native API application is safely resumable while
 // the independent gate remains closed; no cross-database transaction is assumed.
 add('INSERT OR REPLACE INTO portal_recovery_checkpoint(id,epoch,checkpoint,auditId) VALUES (1,?,?,?)',epoch+1,checkpoint,auditId);
 return statements;
}

/** Both native and binding operators record deadline evidence before deleting it.
 * SQLite wall time prevents a prepared plan from freezing its audit clock. The
 * completion postlude catches deadline crossings during a staged cleanup. */
export function retentionAuditPlan(deleted:string[],residual:string[],checkpoint:string,auditId:string,preparedAt:number){
 const clock="MAX(?,CAST(strftime('%s','now') AS INTEGER)*1000+CAST(substr(strftime('%f','now'),4,3) AS INTEGER))";
 const present=new Set(residual);const before:RecoveryStatement[]=[];const after:RecoveryStatement[]=[];
 for(const userId of deleted){
  before.push({sql:`UPDATE recovery_deleted SET purgePending=CASE WHEN ?=1 THEN 1 ELSE purgePending END,status=CASE WHEN status='overdue' OR (cleanupDeadline<${clock} AND (?=1 OR purgePending=1 OR purgedAt IS NULL)) THEN 'overdue' ELSE status END WHERE userId=?`,params:[present.has(userId)?1:0,preparedAt,present.has(userId)?1:0,userId]});
  after.push({sql:`UPDATE recovery_deleted SET purgedAt=COALESCE(purgedAt,${clock}),lastAttemptAt=${clock},lastSuccessAt=${clock},status=CASE WHEN status='overdue' OR (cleanupDeadline<${clock} AND (?=1 OR purgePending=1 OR purgedAt IS NULL)) THEN 'overdue' ELSE 'cleaned' END,purgePending=0 WHERE userId=?`,params:[preparedAt,preparedAt,preparedAt,preparedAt,present.has(userId)?1:0,userId]});
 }
 before.push({sql:`INSERT OR REPLACE INTO recovery_projection_audit(checkpoint,auditId,startedAt,completedAt) VALUES (?,?,${clock},NULL)`,params:[checkpoint,auditId,preparedAt]});
 after.push({sql:`UPDATE recovery_projection_audit SET completedAt=${clock} WHERE checkpoint=? AND auditId=?`,params:[preparedAt,checkpoint,auditId]});
 return {before,after};
}
