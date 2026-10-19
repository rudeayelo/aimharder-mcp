// Offline native-D1 API plan. Input/output contain opaque security metadata only.
import { z } from 'zod';
import { retentionAuditPlan, projectionPlan, securitySnapshotSchema } from '../src/recovery-plan.ts';
const opaque=z.string().min(1).max(256);
const manifestSchema=z.object({applicationDatabaseId:z.uuid(),recoveryDatabaseId:z.uuid(),authorityId:opaque,checkpoint:opaque,epoch:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER-1),gate:z.literal('closed'),leases:z.literal(0),snapshot:securitySnapshotSchema,deletedUsers:z.array(opaque).max(10000),residualDeletedUsers:z.array(opaque).max(10000),deletedInvitations:z.array(opaque).max(20000),closedAt:z.number().int(),backendRecoverableDays:z.literal(7),copiedDeletedPayloads:z.literal(false),restore:z.object({bookmark:opaque,targetAt:z.number().int(),authorizedAt:z.number().int()}).strict(),intervals:z.array(z.object({closedAt:z.number().int(),openedAt:z.number().int().nullable()}).strict()).max(10000)}).strict();
try{
 let input='';for await(const chunk of process.stdin){input+=String(chunk);if(Buffer.byteLength(input)>5_242_880)throw new Error('Input too large');}
 const manifest=manifestSchema.parse(JSON.parse(input));
 if(manifest.applicationDatabaseId===manifest.recoveryDatabaseId)throw new Error('Recovery authority must be independent');
 const now=Date.now();const target=manifest.restore.targetAt;
 if(target>=manifest.closedAt||target>manifest.restore.authorizedAt||target<manifest.restore.authorizedAt-7*86400000||manifest.restore.authorizedAt>now||manifest.intervals.some(interval=>target>=interval.closedAt&&(interval.openedAt===null||target<=interval.openedAt)))throw new Error('Restore point outside clean retained interval');
 const deleted=new Set(manifest.deletedUsers);if(manifest.residualDeletedUsers.some(id=>!deleted.has(id)))throw new Error('Residual inventory is not a tombstone');
 const auditId=crypto.randomUUID();const audit=retentionAuditPlan(manifest.deletedUsers,manifest.residualDeletedUsers,manifest.checkpoint,auditId,now);
 const statements=projectionPlan(manifest.snapshot,manifest.deletedUsers,manifest.deletedInvitations,manifest.epoch,manifest.checkpoint,auditId);
 process.stdout.write(JSON.stringify({applicationDatabaseId:manifest.applicationDatabaseId,recoveryDatabaseId:manifest.recoveryDatabaseId,authorizedNativeRestore:manifest.restore,authorityId:manifest.authorityId,checkpoint:manifest.checkpoint,epoch:manifest.epoch,requiresFreshClosedDrainedReadback:true,independentAuditBeforeStatements:audit.before,authDatabaseStatements:statements,independentAuditAfterStatements:audit.after,independentAuditReadback:{sql:'SELECT auditId,completedAt FROM recovery_projection_audit WHERE checkpoint=?',params:[manifest.checkpoint],expectedAuditId:auditId,requiresCompletedAt:true},readback:{sql:'SELECT epoch,checkpoint,auditId FROM portal_recovery_checkpoint WHERE id=1',params:[],expected:{epoch:manifest.epoch+1,checkpoint:manifest.checkpoint,auditId}},independentGateMustRemainClosed:true}));
}catch{process.stderr.write('Recovery preparation failed. No plan was prepared.\n');process.exitCode=1;}
