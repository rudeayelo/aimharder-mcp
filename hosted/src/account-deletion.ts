import { z } from 'zod';
import type { HostedEnvironment, createAuth } from './auth.js';
import { participant } from './admission.js';
import { recordDeletion,recordDeletionPending,recordDeletionPurged,recordDeletedMemoryErased } from './recovery-authority.js';
import { eraseDeletedAccountMemory } from './account-connection.js';
import { page } from './portal.js';

/** Global pending-auth invalidation must not erase another deleted owner's
 * only residual evidence before that owner's pending flag is acknowledged. */
async function verificationErasure(env:HostedEnvironment){
  const deleted=(await env.RECOVERY_DB!.prepare('SELECT userId FROM recovery_deleted').all<{userId:string}>()).results;
  const protectedIds:string[]=[];
  for(const row of deleted){
    const records=(await env.AUTH_DB.prepare("SELECT id FROM verification WHERE value=? OR (CASE WHEN json_valid(value) THEN json_extract(value,'$.userId') END)=?").bind(row.userId,row.userId).all<{id:string}>()).results;
    if(records.length)try{await recordDeletionPending(env,row.userId);}catch{protectedIds.push(...records.map(record=>record.id));}
  }
  // Stay below D1's statement parameter limit. A broad reporting outage may
  // postpone verification invalidation, but never another user's credential purge.
  const statement=protectedIds.length>90?null:env.AUTH_DB.prepare(`DELETE FROM verification${protectedIds.length?` WHERE id NOT IN (${protectedIds.map(()=>'?').join(',')})`:''}`).bind(...protectedIds);
  return {statement,pending:protectedIds.length>0};
}

export async function eraseDeletedProjection(env: HostedEnvironment, subject:string) {
  await recordDeletionPending(env,subject);
  const verification=await verificationErasure(env);
  // Opaque maintained verification records can contain encrypted OAuth state.
  // Invalidate pending transactions rather than retain unassociable deleted data.
  await env.AUTH_DB.batch([
    ...(verification.statement?[verification.statement]:[]),
    env.AUTH_DB.prepare('DELETE FROM portal_verification_delivery WHERE userId=? OR invitationId IN (SELECT id FROM portal_deleted_invitation)').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_pending_admission WHERE userId=? OR invitationId IN (SELECT id FROM portal_deleted_invitation)').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_participant WHERE userId=?').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM user WHERE id=?').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_invitation WHERE acceptedUserId IS NULL AND id IN (SELECT id FROM portal_deleted_invitation)'),
  ]);
  if(verification.pending)throw new Error('Pending verification purge needs independent evidence');
}
export async function handleAccountDeletion(request:Request,env:HostedEnvironment,auth:ReturnType<typeof createAuth>):Promise<Response|null> {
  const path=new URL(request.url).pathname;
  if(!['/api/portal/account/delete','/portal/account/delete'].includes(path))return null;
  if(request.method!=='POST')return new Response(null,{status:405});
  if(request.headers.get('origin')!==new URL(env.BASE_URL).origin)return new Response(null,{status:403});
  const session=await auth.api.getSession({headers:request.headers});
  if(!session||!await participant(env,session.user.id))return page('Sign in required','<a href="/sign-in">Sign in</a>',401);
  const json=request.headers.get('content-type')?.includes('application/json');
  const body=json?await request.json().catch(()=>null):Object.fromEntries(await request.formData());
  if(!(json?z.object({confirmed:z.literal(true)}).strict():z.object({confirmed:z.literal('true')}).strict()).safeParse(body).success)return page('Confirm account deletion','<p>Confirm deletion from Account access.</p>',400);
  const invitations=(await env.AUTH_DB.prepare('SELECT id FROM portal_invitation WHERE acceptedUserId=? OR email=?').bind(session.user.id,session.user.email).all<{id:string}>()).results.map(row=>row.id);
  await recordDeletion(env,session.user.id,invitations);
  try{
  if(invitations.length)await env.AUTH_DB.batch(invitations.map(id=>env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_deleted_invitation(id) VALUES (?)').bind(id)));
  await eraseDeletedProjection(env,session.user.id);
  await recordDeletionPurged(env,session.user.id,true);
  await eraseDeletedAccountMemory(env,session.user.id);
  await recordDeletedMemoryErased(env,session.user.id);
  }catch{return Response.json({message:'Deletion is recorded and access is blocked. Active-data cleanup needs operator maintenance.'},{status:503});}
  return path.startsWith('/api/')?new Response(null,{status:204}):page('Portal account deleted','<p>Portal access, MCP authorizations and active service data have been removed. Your AimHarder bookings and activity were not changed. Earlier encrypted backups expire within the documented recovery limit, no later than 30 days after deletion.</p>');
}
