import type { HostedEnvironment } from './auth.js';
import { createAuth } from './auth.js';
import { participant } from './admission.js';
import { handleInvitations, listInvitations } from './invitations.js';

function escape(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
export function page(title: string, body: string, status = 200): Response {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · AimHarder MCP</title><style>body{font:18px system-ui;max-width:42rem;margin:3rem auto;padding:0 1.2rem;color:#172f37;background:#f6faf9}h1{line-height:1.15}label{display:block;margin:1rem 0}input,button{font:inherit;padding:.6rem;max-width:100%;box-sizing:border-box}input{display:block;width:100%}button{background:#145d54;color:white;border:0;border-radius:.3rem;cursor:pointer}a{color:#145d54}td,th{padding:.5rem;text-align:left}table{display:block;overflow:auto}nav{margin-bottom:2rem}</style></head><body><nav><a href="/">AimHarder MCP</a></nav><main><h1>${escape(title)}</h1>${body}</main></body></html>`, {
    status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store',
      // Origin-only referrers keep capabilities private without causing browser
      // form POSTs to serialize their Origin as null under no-referrer.
      'referrer-policy': 'strict-origin', 'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" },
  });
}
export async function handlePortal(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/portal/') && request.method === 'POST') {
    if (request.headers.get('origin') !== new URL(env.BASE_URL).origin) return page('Request rejected', '<p>Return to the portal and try again.</p>', 403);
    const form = await request.formData();
    const field = (key: string) => typeof form.get(key) === 'string' ? String(form.get(key)) : '';
    const headers = new Headers({ 'content-type': 'application/json', origin: new URL(env.BASE_URL).origin });
    if (request.headers.has('cookie')) headers.set('cookie', request.headers.get('cookie')!);
    let path: string;
    let body: object;
    let success: Response;
    switch (url.pathname) {
      case '/portal/sign-up':
        path = '/sign-up/email';
        headers.set('x-portal-invitation', field('invitation'));
        body = { email: field('email'), name: field('name'), password: field('password'), callbackURL: `${env.BASE_URL}/verification-result` };
        success = page('Check your email', '<p>Follow the verification link sent to your invited email address before signing in. If you already registered, use the resend link on the sign-in page.</p><a href="/sign-in">Sign in</a>');
        break;
      case '/portal/sign-in':
        path = '/sign-in/email'; body = { email: field('email'), password: field('password') };
        success = new Response(null, { status: 303, headers: { location: new URLSearchParams(field('oauth_query')).has('client_id')
          ? `/api/auth/oauth2/authorize?${new URLSearchParams(field('oauth_query'))}` : '/' } });
        break;
      case '/portal/recovery':
        path = '/request-password-reset'; body = { email: field('email'), redirectTo: `${env.BASE_URL}/reset-password` };
        success = page('Recovery requested', '<p>If this address is eligible and email delivery is available, follow the recovery email. If no message arrives, try again later or contact the administrator.</p><a href="/sign-in">Sign in</a>');
        break;
      case '/portal/reset-password':
        path = '/reset-password'; body = { token: field('token'), newPassword: field('password') };
        success = page('Password updated', '<p>Your old sessions have been signed out.</p><a href="/sign-in">Sign in with your new password</a>');
        break;
      case '/portal/send-verification':
        path = '/send-verification-email'; body = { email: field('email'), callbackURL: `${env.BASE_URL}/verification-result` };
        success = page('Check your email', '<p>If there is a pending account with a current invitation for this address, follow the verification email.</p><a href="/sign-in">Sign in</a>');
        break;
      case '/portal/sign-out':
        path = '/sign-out'; body = {}; success = new Response(null, { status: 303, headers: { location: '/sign-in' } });
        break;
      default: {
        const revoke = /^\/portal\/invitations\/([^/]+)\/revoke$/.exec(url.pathname);
        if (url.pathname !== '/portal/invitations' && !revoke) return null;
        const response = await handleInvitations(new Request(`${env.BASE_URL}/api/portal/invitations${revoke ? `/${revoke[1]}/revoke` : ''}`, {
          method: 'POST', headers, body: JSON.stringify(revoke ? {} : { email: field('email') }),
        }), env, auth);
        if (!response?.ok) return page('Invitation unavailable', '<p>The invitation could not be issued or revoked. Check the address and current invitation status, then try again.</p><a href="/admin/invitations">Manage invitations</a>', response?.status ?? 400);
        return new Response(null, { status: 303, headers: { location: '/admin/invitations' } });
      }
    }
    const response = await auth.handler(new Request(`${env.BASE_URL}/api/auth${path}`, { method: 'POST', headers, body: JSON.stringify(body) }));
    if (!response.ok) return page('Unable to continue', response.status === 503
      ? '<p>Email delivery is unavailable. Please try later.</p>'
      : '<p>Check your details and invitation, verify your email before signing in, or request a new link. Expired or revoked invitations require a new invitation from the administrator.</p><a href="/sign-in">Sign in</a>', response.status);
    for (const cookie of response.headers.getSetCookie()) success.headers.append('set-cookie', cookie);
    return success;
  }
  if (request.method !== 'GET') return null;
  if (url.pathname === '/sign-in') return page('Sign in', '<p>Use your portal password. Your AimHarder password belongs to the separate account connection.</p><form method="post" action="/portal/sign-in">' + (url.searchParams.has('client_id') ? `<input name="oauth_query" type="hidden" value="${escape(url.search.slice(1))}">` : '') + '<label>Email<input name="email" type="email" required autocomplete="username"></label><label>Portal password<input name="password" type="password" required autocomplete="current-password"></label><button>Sign in</button></form><p><a href="/recover">Forgot password?</a> · <a href="/resend-verification">Resend verification email</a></p>');
  if (url.pathname === '/recover' || url.pathname === '/resend-verification') {
    const recovering = url.pathname === '/recover';
    return page(recovering ? 'Recover portal access' : 'Verify your email', `<form method="post" action="/portal/${recovering ? 'recovery' : 'send-verification'}"><label>Email<input name="email" type="email" required autocomplete="email"></label><button>Send link</button></form><p><a href="/sign-in">Sign in</a></p>`);
  }
  if (url.pathname === '/reset-password') return page('Reset portal password', url.searchParams.has('error') || !url.searchParams.has('token')
    ? '<p>This recovery link is invalid or expired.</p><a href="/recover">Request a new link</a>'
    : `<form method="post" action="/portal/reset-password"><input name="token" type="hidden" value="${escape(url.searchParams.get('token')!)}"><label>New portal password<input name="password" type="password" required minlength="8" autocomplete="new-password"></label><button>Update password</button></form>`);
  if (url.pathname === '/verification-result') return page('Email verification', url.searchParams.has('error')
    ? '<p>This verification link is invalid or expired. If your invitation was revoked or expired, ask the administrator for a new invitation.</p><a href="/resend-verification">Request a new verification link</a>'
    : '<p>Your email is verified. You can now sign in.</p><a href="/sign-in">Sign in</a>');
  if (url.pathname === '/admin/invitations') {
    const session = await auth.api.getSession({ headers: request.headers });
    const actor = session && await participant(env, session.user.id);
    if (actor?.role !== 'admin') return page('Administrator access required', '<a href="/sign-in">Sign in</a>', session ? 403 : 401);
    const invitations = await listInvitations(env);
    return page('Manage invitations', `<p>Invite a participant by their portal email. Invitations expire after seven days and grant the user role.</p><form method="post" action="/portal/invitations"><label>Participant email<input name="email" type="email" required></label><button>Send invitation</button></form><table><thead><tr><th>Email</th><th>Status</th><th>Expires</th><th>Action</th></tr></thead><tbody>${invitations.map(item => `<tr><td>${escape(item.email)}</td><td>${item.status}</td><td>${new Date(item.expiresAt).toISOString().slice(0,10)}</td><td>${item.status === 'pending' ? `<form method="post" action="/portal/invitations/${escape(item.id)}/revoke"><button>Revoke</button></form>` : ''}</td></tr>`).join('')}</tbody></table>`);
  }
  if (url.pathname === '/accept-invitation') return page('Accept invitation', `<p>Use the email address that received your invitation. Your portal password is separate from your AimHarder password.</p><form method="post" action="/portal/sign-up"><input type="hidden" name="invitation" value="${escape(url.searchParams.get('token') ?? '')}"><label>Name<input name="name" required autocomplete="name" maxlength="100"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Portal password<input name="password" type="password" minlength="8" required autocomplete="new-password"></label><button>Create account</button></form>`);
  if (url.pathname === '/') {
    const session = await auth.api.getSession({ headers: request.headers });
    const actor = session && await participant(env, session.user.id);
    return page('AimHarder MCP', actor ? `<p>You are signed in.</p><p><a href="/connections">Connected MCP clients</a> · <a href="/connect-clients">Connect ChatGPT or Hermes</a></p>${actor.role === 'admin' ? '<a href="/admin/invitations">Manage invitations</a>' : ''}<form method="post" action="/portal/sign-out"><button>Sign out</button></form>` : '<p>An invitation is required to join this pilot.</p><a href="/sign-in">Sign in</a>');
  }
  return null;
}
