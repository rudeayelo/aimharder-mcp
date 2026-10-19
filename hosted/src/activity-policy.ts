import { z } from 'zod';
import { AimHarderError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { createAuth } from './auth.js';
import { participant } from './admission.js';
import { page } from './portal.js';
export type ActivityFeature = 'publication' | 'deletion';
export async function activityAllowed(env: HostedEnvironment, subject: string, feature: ActivityFeature): Promise<boolean> {
  const row = await env.AUTH_DB.prepare(`SELECT f.publication,f.deletion FROM portal_activity_policy f JOIN portal_participant p ON p.role=f.role JOIN user u ON u.id=p.userId WHERE p.userId=? AND p.status='active' AND u.emailVerified=1`).bind(subject).first<{publication:number;deletion:number}>();
  return row?.[feature] === 1;
}
export async function requireActivityPermission(env: HostedEnvironment, subject: string, feature: ActivityFeature) {
  if (!await activityAllowed(env, subject, feature)) throw new AimHarderError('ACCESS_RESTRICTED');
}
export function renderActivityControl(role: 'admin'|'user', feature: ActivityFeature, enabled: number) {
  return `<form method="post" action="/portal/activity-access"><input type="hidden" name="role" value="${role}"><input type="hidden" name="feature" value="${feature}"><label>${role}: Activity ${feature}<select name="enabled"><option value="1"${enabled ? ' selected' : ''}>Enabled</option><option value="0"${enabled ? '' : ' selected'}>Disabled</option></select></label><button>Save ${feature} access</button></form>`;
}
export async function handleActivityPolicy(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response|null> {
  const path=new URL(request.url).pathname;
  if (!(path==='/admin/activity-access'&&request.method==='GET') && !(path==='/portal/activity-access'&&request.method==='POST')) return null;
  const session=await auth.api.getSession({headers:request.headers});
  const actor=session&&await participant(env,session.user.id);
  if(actor?.role!=='admin')return page('Administrator access required','<a href="/sign-in">Sign in</a>',session?403:401);
  if(request.method==='POST'){
    if(request.headers.get('origin')!==new URL(env.BASE_URL).origin)return page('Request rejected','<p>Return to the portal.</p>',403);
    const form=await request.formData();
    const parsed=z.object({role:z.enum(['admin','user']),feature:z.enum(['publication','deletion']),enabled:z.enum(['0','1'])}).strict().safeParse(Object.fromEntries(form));
    if(!parsed.success||[...form.keys()].length!==3)return page('Invalid role policy','<p>Choose one role and feature.</p>',400);
    const {role,feature,enabled}=parsed.data;
    // The feature is validated above; no participant-specific policy exists.
    await env.AUTH_DB.prepare(`UPDATE portal_activity_policy SET ${feature}=? WHERE role=?`).bind(Number(enabled),role).run();
    return new Response(null,{status:303,headers:{location:'/admin/activity-access'}});
  }
  const rows=(await env.AUTH_DB.prepare('SELECT role,publication,deletion FROM portal_activity_policy ORDER BY role').all<{role:'admin'|'user';publication:number;deletion:number}>()).results;
  return page('Activity access by role','<p>Changes apply to all accounts in the selected role, including prepared actions. Each publication still requires its own exact confirmation.</p>'+rows.map(row=>renderActivityControl(row.role,'publication',row.publication)).join(''));
}
