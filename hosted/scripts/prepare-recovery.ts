// Offline native-D1 API plan. Input/output contain opaque security metadata only.
import { z } from 'zod';
import { projectionPlan, securitySnapshotSchema } from '../src/recovery-plan.ts';
const opaque=z.string().min(1).max(256);
const manifestSchema=z.object({applicationDatabaseId:z.uuid(),recoveryDatabaseId:z.uuid(),authorityId:opaque,checkpoint:opaque,epoch:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER-1),gate:z.literal('closed'),leases:z.literal(0),snapshot:securitySnapshotSchema,deletedUsers:z.array(opaque).max(10000),deletedInvitations:z.array(opaque).max(20000),closedAt:z.number().int(),backendRecoverableDays:z.literal(7),copiedDeletedPayloads:z.literal(false),restore:z.object({bookmark:opaque,targetAt:z.number().int(),authorizedAt:z.number().int()}).strict(),intervals:z.array(z.object({closedAt:z.number().int(),openedAt:z.number().int().nullable()}).strict()).max(10000)}).strict();
try{
 let input='';for await(const chunk of process.stdin){input+=String(chunk);if(Buffer.byteLength(input)>5_242_880)throw new Error('Input too large');}
 const manifest=manifestSchema.parse(JSON.parse(input));
 if(manifest.applicationDatabaseId===manifest.recoveryDatabaseId)throw new Error('Recovery authority must be independent');
 const now=Date.now();const target=manifest.restore.targetAt;
 if(target>=manifest.closedAt||target>manifest.restore.authorizedAt||target<manifest.restore.authorizedAt-7*86400000||manifest.restore.authorizedAt>now||manifest.intervals.some(interval=>target>=interval.closedAt&&(interval.openedAt===null||target<=interval.openedAt)))throw new Error('Restore point outside clean retained interval');
 const statements=projectionPlan(manifest.snapshot,manifest.deletedUsers,manifest.deletedInvitations,manifest.epoch,manifest.checkpoint);
 process.stdout.write(JSON.stringify({applicationDatabaseId:manifest.applicationDatabaseId,recoveryDatabaseId:manifest.recoveryDatabaseId,authorizedNativeRestore:manifest.restore,authorityId:manifest.authorityId,checkpoint:manifest.checkpoint,epoch:manifest.epoch,requiresFreshClosedDrainedReadback:true,authDatabaseStatements:statements,readback:{sql:'SELECT epoch,checkpoint FROM portal_recovery_checkpoint WHERE id=1',params:[],expected:{epoch:manifest.epoch+1,checkpoint:manifest.checkpoint}},independentGateMustRemainClosed:true}));
}catch{process.stderr.write('Recovery preparation failed. No plan was prepared.\n');process.exitCode=1;}
