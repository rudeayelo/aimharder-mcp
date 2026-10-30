import { createAuth, googleConfigured, type HostedEnvironment } from './auth.js';
import { participant } from './admission.js';
import { page } from './portal.js';

/** Browser account-method management; credentials stay inside maintained auth. */
export async function handleIdentity(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const url = new URL(request.url);
  const googleStart = ['/portal/google', '/portal/link-google'].includes(url.pathname);
  const addPassword = ['/portal/add-password', '/api/portal/password'].includes(url.pathname);
  if (request.method === 'POST' && (googleStart || addPassword)) {
    if (request.headers.get('origin') !== new URL(env.BASE_URL).origin) return new Response(null, { status: 403 });
    if (addPassword) {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) return new Response(null, { status: 401 });
      if (!await participant(env, session.user.id) || Date.now() - new Date(session.session.createdAt).getTime() > 5 * 60_000)
        return page('Sign in again', '<p>Sign in with Google again, then add your portal password within five minutes.</p><a href="/sign-in">Sign in</a>', 403);
      const accounts = await env.AUTH_DB.prepare('SELECT providerId FROM account WHERE userId=?').bind(session.user.id).all<{ providerId: string }>();
      if (accounts.results.some(account => account.providerId === 'credential')) return new Response(null, { status: 409 });
      if (!accounts.results.some(account => account.providerId === 'google')) return new Response(null, { status: 403 });
      try {
        const body = url.pathname.startsWith('/api/') ? await request.json() as { newPassword?: unknown }
          : { newPassword: (await request.formData()).get('password') };
        if (typeof body.newPassword !== 'string') return new Response(null, { status: 400 });
        // This maintained endpoint is deliberately server-only. The public adapter
        // above supplies same-origin, current admission and fresh Google proof.
        await auth.api.setPassword({ headers: request.headers, body: { newPassword: body.newPassword } });
        return url.pathname.startsWith('/api/') ? Response.json({ status: true })
          : page('Portal password added', '<p>You can now sign in using Google or your portal password.</p><a href="/account">Account access</a>');
      } catch { return page('Unable to add password', '<p>Use a password with at least eight characters and sign in with Google again before retrying.</p>', 400); }
    }
    if (!googleConfigured(env)) {env.TELEMETRY?.httpOutcome({outcome:'denied',code:'GOOGLE_UNAVAILABLE'});return page('Google unavailable', '<p>Google sign-in is unavailable. Use your portal password or try later.</p>', 503);}
    const form = await request.formData();
    const linking = url.pathname === '/portal/link-google';
    const continuation = new URLSearchParams(String(form.get('oauth_query') ?? ''));
    // Resume only the maintained authorization endpoint; it owns signature,
    // registered-client and redirect validation. Never accept a general return URL.
    const callbackURL = !linking && continuation.has('client_id')
      ? `${env.BASE_URL}/api/auth/oauth2/authorize?${continuation}` : `${env.BASE_URL}/account`;
    const headers = new Headers({ origin: new URL(env.BASE_URL).origin, 'content-type': 'application/json' });
    if (request.headers.has('cookie')) headers.set('cookie', request.headers.get('cookie')!);
    if (!linking && typeof form.get('invitation') === 'string') headers.set('x-portal-invitation', String(form.get('invitation')));
    const response = await auth.handler(new Request(`${env.BASE_URL}/api/auth/${linking ? 'link-social' : 'sign-in/social'}`, {
      method: 'POST', headers, body: JSON.stringify({ provider: 'google', callbackURL, errorCallbackURL: `${env.BASE_URL}/google-result` }),
    }));
    if (!response.ok) return page('Unable to continue', '<p>Sign in again before linking Google. An invitation for the verified Google email is required for a new account.</p><a href="/sign-in">Sign in</a>', response.status);
    const result = await response.json() as { url: string };
    const redirect = new Response(null, { status: 303, headers: { location: result.url, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
    for (const cookie of response.headers.getSetCookie()) redirect.headers.append('set-cookie', cookie);
    return redirect;
  }
  if (request.method !== 'GET') return null;
  if (url.pathname === '/google-result') return page('Google sign-in unavailable', '<p>Your Google email must be verified and match your invitation or existing portal account. Existing password accounts must sign in first and explicitly link Google in Account access. Revoked or expired invitations require a new invitation. If a linking session expired, sign in again and restart linking.</p><a href="/sign-in">Sign in</a>');
  if (url.pathname !== '/account') return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !await participant(env, session.user.id)) return page('Sign in required', '<a href="/sign-in">Sign in</a>', 401);
  const accounts = await env.AUTH_DB.prepare('SELECT providerId FROM account WHERE userId=?').bind(session.user.id).all<{ providerId: string }>();
  const google = accounts.results.some(account => account.providerId === 'google');
  const password = accounts.results.some(account => account.providerId === 'credential');
  return page('Account access', `<p>These methods use the same portal account and keep your configuration. Your AimHarder login is separate.</p>${google ? '<p>Google is linked.</p>' : googleConfigured(env) ? '<p>Sign in with your existing method again, then link the Google account with the same verified email within five minutes.</p><form method="post" action="/portal/link-google"><button>Link Google to this account</button></form>' : '<p>Google is currently unavailable.</p>'}${password ? '<p>A portal password is configured.</p><a href="/recover">Recover portal access</a>' : '<p>To add a password, sign in with Google again and submit this form within five minutes. Recovery becomes available after you add a password.</p><form method="post" action="/portal/add-password"><label>New portal password<input name="password" type="password" minlength="8" required autocomplete="new-password"></label><button>Add portal password</button></form>'}<h2>Delete portal account</h2><p>Remove portal access, linked sign-in methods, MCP grants and stored AimHarder credentials. Your AimHarder bookings and activity stay unchanged. This cannot be undone.</p><form method="post" action="/portal/account/delete"><label><input type="checkbox" name="confirmed" value="true" required>I confirm permanent portal account deletion</label><button>Delete portal account</button></form><p><a href="/">Return to portal</a></p>`, 200, !google && googleConfigured(env));
}
