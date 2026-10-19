import { z } from 'zod';
import type { HostedEnvironment, createAuth } from './auth.js';
import { participant } from './admission.js';
import { recordDeletion } from './recovery-authority.js';
import { accountOperation } from './account-connection.js';
import { page } from './portal.js';

export async function eraseDeletedProjection(env: HostedEnvironment, subject:string) {
  // Opaque maintained verification records can contain encrypted OAuth state.
  // Invalidate pending transactions rather than retain unassociable deleted data.
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare('DELETE FROM verification'),
    env.AUTH_DB.prepare('DELETE FROM portal_verification_delivery WHERE userId=? OR invitationId IN (SELECT id FROM portal_deleted_invitation)').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_pending_admission WHERE userId=? OR invitationId IN (SELECT id FROM portal_deleted_invitation)').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_participant WHERE userId=?').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM user WHERE id=?').bind(subject),
    env.AUTH_DB.prepare('DELETE FROM portal_invitation WHERE acceptedUserId IS NULL AND id IN (SELECT id FROM portal_deleted_invitation)'),
  ]);
}
export async function handleAccountDeletion(request:Request,env:HostedEnvironment,auth:ReturnType<typeof createAuth>):Promise<Response|null> {
  const path=new URL(request.url).pathname;
  if(!['/api/portal/account/delete','/portal/account/delete'].includes(path))return null;
  if(request.method!=='POST')return new Response(null,{status:405});
  if(request.headers.get('origin')!==new URL(env.BASE_URL).origin)return new Response(null,{status:403});
  const session=await auth.api.getSession({headers:request.headers});
  if(!session||!await participant(env,session.user.id))return page('Sign in required','<a href="/sign-in">Sign in</a>',401);
  const body=request.headers.get('content-type')?.includes('application/json')?await request.json().catch(()=>null):Object.fromEntries(await request.formData());
  if(!z.object({confirmed:z.union([z.literal(true),z.literal('true')])}).strict().safeParse(body).success)return page('Confirm account deletion','<p>Confirm deletion from Account access.</p>',400);
  const invitations=(await env.AUTH_DB.prepare('SELECT id FROM portal_invitation WHERE acceptedUserId=? OR email=?').bind(session.user.id,session.user.email).all<{id:string}>()).results.map(row=>row.id);
  await recordDeletion(env,session.user.id,invitations);
  if(invitations.length)await env.AUTH_DB.batch(invitations.map(id=>env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_deleted_invitation(id) VALUES (?)').bind(id)));
  await eraseDeletedProjection(env,session.user.id);
  await accountOperation(env,session.user.id,{kind:'erase-deleted'});
  return path.startsWith('/api/')?new Response(null,{status:204}):page('Portal account deleted','<p>Portal access, MCP authorizations and active service data have been removed. Your AimHarder bookings and activity were not changed. Earlier encrypted backups expire within the documented recovery limit, no later than 30 days after deletion.</p>');
}
