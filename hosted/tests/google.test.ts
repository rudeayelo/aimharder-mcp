import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { buildWorker } from '../build.mjs';

const origin = 'http://localhost:8787';
const password = 'synthetic-google-password';
let worker: Miniflare;
const mail: { to: string[]; subject: string; text: string }[] = [];
const googleCodes = new Map<string, { email: string; sub: string; email_verified: boolean }>();
function cookies(response: { headers: { getSetCookie(): string[] } }) {
  return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
}
function post(path: string, body: unknown, cookie = '', invitation = '') {
  return worker.dispatchFetch(origin + path, { method: 'POST', redirect: 'manual',
    headers: { origin, 'content-type': 'application/json', cookie, 'x-portal-invitation': invitation }, body: JSON.stringify(body) });
}
function messageUrl(email: string, subject: string) {
  return mail.findLast(item => item.to[0] === email && item.subject === subject)!.text.match(/http[^\s]+/)![0]!;
}
let admin = '';
async function invite(email: string) {
  const issued = await post('/api/portal/invitations', { email }, admin);
  expect(issued.status).toBe(201);
  const { id } = await issued.json() as { id: string };
  return { id, token: new URL(messageUrl(email, 'Your AimHarder MCP invitation')).searchParams.get('token')! };
}
async function startGoogle(invitation = '', cookie = '', link = false) {
  const started = await post(`/api/auth/${link ? 'link-social' : 'sign-in/social'}`, {
    provider: 'google', callbackURL: origin + '/account', errorCallbackURL: origin + '/google-result',
  }, cookie, invitation);
  expect(started.status).toBe(200);
  const { url } = await started.json() as { url: string };
  const google = new URL(url);
  expect(google.origin + google.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
  expect(google.searchParams.get('redirect_uri')).toBe(origin + '/api/auth/callback/google');
  expect(new Set(google.searchParams.get('scope')!.split(' '))).toEqual(new Set(['openid', 'email', 'profile']));
  expect(google.searchParams.get('code_challenge_method')).toBe('S256');
  return { google, cookie: [cookie, cookies(started)].filter(Boolean).join('; ') };
}
async function finishGoogle(start: Awaited<ReturnType<typeof startGoogle>>, email: string, options: { verified?: boolean; sub?: string; cookie?: string } = {}) {
  const code = crypto.randomUUID();
  googleCodes.set(code, { email, sub: options.sub ?? email, email_verified: options.verified ?? true });
  return worker.dispatchFetch(`${origin}/api/auth/callback/google?code=${code}&state=${start.google.searchParams.get('state')}`, {
    redirect: 'manual', headers: { cookie: options.cookie ?? start.cookie },
  });
}
async function identity(cookie: string) {
  return (await worker.dispatchFetch(origin + '/api/auth/get-session', { headers: { cookie } })).json() as Promise<{ user: { id: string; name: string } } | null>;
}
beforeAll(async () => {
  await buildWorker('tests/portal-fixture-worker.ts', 'dist/google-fixture-worker.js');
  worker = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'dist/google-fixture-worker.js',
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'], d1Databases: ['AUTH_DB'],
    bindings: { BASE_URL: origin, AUTH_SECRET: 'synthetic-google-auth-secret-at-least-32-characters',
      RESEND_API_KEY: 'synthetic-resend-key', MAIL_FROM: 'noreply@example.invalid',
      GOOGLE_CLIENT_ID: 'synthetic-google-client', GOOGLE_CLIENT_SECRET: 'synthetic-google-secret' },
    outboundService: async request => {
      if (request.url === 'https://api.resend.com/emails' && request.method === 'POST') {
        mail.push(await request.json() as typeof mail[number]);
        return Response.json({ id: 'synthetic-message' });
      }
      if (request.url === 'https://oauth2.googleapis.com/token' && request.method === 'POST') {
        const body = new URLSearchParams(await request.text());
        expect(body.get('client_id')).toBe('synthetic-google-client');
        expect(body.get('client_secret')).toBe('synthetic-google-secret');
        expect(body.get('redirect_uri')).toBe(origin + '/api/auth/callback/google');
        expect(body.get('code_verifier')!.length).toBeGreaterThan(32);
        const profile = googleCodes.get(body.get('code')!);
        if (!profile) return Response.json({ error: 'invalid_grant' }, { status: 400 });
        googleCodes.delete(body.get('code')!);
        // Only the external Google token endpoint is substituted. Better Auth's
        // actual redirect/state/PKCE/profile and durable admission paths run in workerd.
        const jwt = [Buffer.from('{"alg":"RS256","typ":"JWT"}').toString('base64url'),
          Buffer.from(JSON.stringify({ ...profile, name: 'Synthetic Google Participant', iss: 'https://accounts.google.com',
            aud: 'synthetic-google-client', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+3600 })).toString('base64url'), 'synthetic-signature'].join('.');
        return Response.json({ access_token: 'synthetic-access', token_type: 'Bearer', expires_in: 3600, id_token: jwt });
      }
      throw new Error('Unexpected outbound Google test request');
    },
  }));
  await worker.ready;
  const db = await worker.getD1Database('AUTH_DB');
  for (const file of ['0001-auth.sql', '0002-invitations.sql', '0003-account-method-uniqueness.sql'])
    await db.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
  await worker.dispatchFetch(origin + '/__fixture');
  expect((await post('/api/auth/sign-up/email', { email: 'owner@example.invalid', name: 'Owner', password }, '', 'synthetic-owner-invitation')).status).toBe(200);
  await worker.dispatchFetch(messageUrl('owner@example.invalid', 'Verify your email'), { redirect: 'manual' });
  admin = cookies(await post('/api/auth/sign-in/email', { email: 'owner@example.invalid', password }));
});
afterAll(async () => { await worker?.dispose(); });

test('verified Google invitation admission creates one stable participant identity and supports returning sign-in', async () => {
  const invitation = await invite('google@example.invalid');
  const callback = await finishGoogle(await startGoogle(invitation.token), 'google@example.invalid');
  expect(callback.status).toBe(302);
  expect(callback.headers.get('location')).toBe(origin + '/account');
  const cookie = cookies(callback);
  const first = await identity(cookie);
  expect(first?.user.name).toBe('Synthetic Google Participant');
  expect(await (await worker.dispatchFetch(origin + '/', { headers: { cookie } })).text()).toContain('You are signed in');
  const returning = await finishGoogle(await startGoogle(), 'google@example.invalid');
  expect((await identity(cookies(returning)))?.user.id).toBe(first?.user.id);
});

test('Google admission rejects uninvited, wrong-email, unverified, revoked and expired claims and does not consume the rightful invitation', async () => {
  const invitation = await invite('rightful@example.invalid');
  for (const attempt of [
    { token: '', email: 'outsider@example.invalid', verified: true },
    { token: invitation.token, email: 'wrong@example.invalid', verified: true },
    { token: invitation.token, email: 'rightful@example.invalid', verified: false },
  ]) {
    const response = await finishGoogle(await startGoogle(attempt.token), attempt.email, { verified: attempt.verified });
    expect(response.headers.get('location')).toContain('error=');
    expect(await identity(cookies(response))).toBe(null);
  }
  const revoked = await invite('revoked-google@example.invalid');
  const inFlight = await startGoogle(revoked.token);
  expect((await post(`/api/portal/invitations/${revoked.id}/revoke`, {}, admin)).status).toBe(200);
  expect((await finishGoogle(inFlight, 'revoked-google@example.invalid')).headers.get('location')).toContain('error=');
  const expired = await invite('expired-google@example.invalid');
  const expiring = await startGoogle(expired.token);
  // Synthetic time-dependent external setup; outcomes are asserted only via HTTP.
  const db = await worker.getD1Database('AUTH_DB');
  await db.prepare('UPDATE portal_invitation SET expiresAt=? WHERE id=?').bind(Date.now()-1, expired.id).run();
  expect((await finishGoogle(expiring, 'expired-google@example.invalid')).headers.get('location')).toContain('error=');
  const rightful = await finishGoogle(await startGoogle(invitation.token), 'rightful@example.invalid');
  expect((await identity(cookies(rightful)))?.user.id).toBeTruthy();
});

test('matching emails cannot silently merge accounts; explicit Google linking needs a still-current admitted session', async () => {
  const email = 'owner@example.invalid';
  const before = await identity(admin);
  const implicit = await finishGoogle(await startGoogle(), email);
  expect(implicit.headers.get('location')).toContain('error=account_not_linked');
  expect(await identity(cookies(implicit))).toBe(null);
  const pending = await startGoogle('', admin, true);
  expect((await post('/api/auth/sign-out', {}, admin)).status).toBe(200);
  const expiredSessionCallback = await finishGoogle(pending, email);
  expect(expiredSessionCallback.headers.get('location')).toContain('error=');
  // The failed link must not let matching-email Google sign-in take over the identity.
  expect((await finishGoogle(await startGoogle(), email)).headers.get('location')).toContain('error=account_not_linked');
  admin = cookies(await post('/api/auth/sign-in/email', { email, password }));
  expect((await identity(admin))?.user.id).toBe(before?.user.id);
  const wrongAccount = await finishGoogle(await startGoogle('', admin, true), 'wrong-owner@example.invalid');
  expect(wrongAccount.headers.get('location')).toContain('error=');
  const linked = await finishGoogle(await startGoogle('', admin, true), email);
  expect(linked.headers.get('location')).toBe(origin + '/account');
  const googleLogin = await finishGoogle(await startGoogle(), email);
  expect((await identity(cookies(googleLogin)))?.user.id).toBe(before?.user.id);
  expect((await identity(cookies(googleLogin)))?.user.name).toBe('Owner');
});

test('a Google-created participant explicitly adds a password after fresh Google proof, preserving profile and recovery identity', async () => {
  const email = 'password-add@example.invalid';
  const invitation = await invite(email);
  const googleLogin = await finishGoogle(await startGoogle(invitation.token), email);
  const cookie = cookies(googleLogin);
  const before = await identity(cookie);
  expect((await post('/api/auth/update-user', { name: 'My portal configuration' }, cookie)).status).toBe(200);
  const beforeRecoveryMail = mail.length;
  expect((await post('/api/auth/request-password-reset', { email, redirectTo: origin + '/reset-password' })).status).toBe(200);
  expect(mail.length).toBe(beforeRecoveryMail);
  expect((await post('/api/portal/password', { newPassword: password })).status).toBe(401);
  const added = await post('/api/portal/password', { newPassword: password }, cookie);
  expect(added.status).toBe(200);
  expect((await post('/api/portal/password', { newPassword: 'replacement-password' }, cookie)).status).toBe(409);
  const passwordLogin = await post('/api/auth/sign-in/email', { email, password });
  expect(passwordLogin.status).toBe(200);
  expect((await identity(cookies(passwordLogin)))?.user).toMatchObject({ id: before!.user.id, name: 'My portal configuration' });
  const googleAgain = await finishGoogle(await startGoogle(), email);
  expect((await identity(cookies(googleAgain)))?.user).toMatchObject({ id: before!.user.id, name: 'My portal configuration' });
  expect((await post('/api/auth/request-password-reset', { email, redirectTo: origin + '/reset-password' })).status).toBe(200);
  const recovery = await worker.dispatchFetch(messageUrl(email, 'Reset your portal password'), { redirect: 'manual' });
  const resetToken = new URL(recovery.headers.get('location')!).searchParams.get('token')!;
  expect((await post('/api/auth/reset-password', { token: resetToken, newPassword: 'synthetic-recovered-password' })).status).toBe(200);
  const recovered = await post('/api/auth/sign-in/email', { email, password: 'synthetic-recovered-password' });
  expect((await identity(cookies(recovered)))?.user.id).toBe(before!.user.id);
  const account = await worker.dispatchFetch(origin + '/account', { headers: { cookie: cookies(recovered) } });
  expect(await account.text()).toContain('Google is linked');
});

test('concurrent password addition chooses one credential and cannot replace the winning password', async () => {
  const email = 'concurrent-password@example.invalid';
  const invitation = await invite(email);
  const callback = await finishGoogle(await startGoogle(invitation.token), email);
  const cookie = cookies(callback);
  const [first, second] = await Promise.all([
    post('/api/portal/password', { newPassword: 'synthetic-first-password' }, cookie),
    post('/api/portal/password', { newPassword: 'synthetic-second-password' }, cookie),
  ]);
  expect([first.status, second.status].filter(status => status === 200)).toHaveLength(1);
  const winner = first.status === 200 ? 'synthetic-first-password' : 'synthetic-second-password';
  expect((await post('/api/auth/sign-in/email', { email, password: winner })).status).toBe(200);
});

test('Google does not move an admitted subject to a newly claimed email and does not allow custom scopes or direct tokens', async () => {
  const changed = await finishGoogle(await startGoogle(), 'changed@example.invalid', { sub: 'google@example.invalid' });
  expect(changed.headers.get('location')).toContain('error=');
  expect(await identity(cookies(changed))).toBe(null);
  for (const body of [
    { idToken: { token: 'synthetic-direct-token' } },
    { scopes: ['https://www.googleapis.com/auth/drive'] },
    { additionalParams: { access_type: 'offline' } },
  ]) expect((await post('/api/auth/sign-in/social', { provider: 'google', callbackURL: origin + '/account', ...body })).status).toBe(403);
});

test('public Google forms preserve same-origin controls and show explicit account-method management', async () => {
  async function form(path: string, fields: Record<string, string>, cookie = '', sourceOrigin = origin) {
    return worker.dispatchFetch(origin + path, { method: 'POST', redirect: 'manual',
      headers: { origin: sourceOrigin, cookie, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields).toString() });
  }
  const email = 'google-forms@example.invalid';
  const invitation = await invite(email);
  const accept = await worker.dispatchFetch(origin + '/accept-invitation?token=' + invitation.token);
  expect(await accept.text()).toContain('Accept with Google');
  const started = await form('/portal/google', { invitation: invitation.token });
  expect(started.status).toBe(303);
  const callback = await finishGoogle({ google: new URL(started.headers.get('location')!), cookie: cookies(started) }, email);
  const cookie = cookies(callback);
  const account = await worker.dispatchFetch(origin + '/account', { headers: { cookie } });
  const html = await account.text();
  expect(html).toContain('Google is linked');
  expect(html).toContain('Add portal password');
  expect((await form('/portal/add-password', { password }, cookie, 'https://attacker.invalid')).status).toBe(403);
  expect((await form('/portal/add-password', { password }, cookie)).status).toBe(200);
  const signIn = await worker.dispatchFetch(origin + '/sign-in?client_id=synthetic-client&state=synthetic-state');
  expect(await signIn.text()).toContain('name="oauth_query"');
  const resume = await form('/portal/google', { oauth_query: 'client_id=synthetic-client&state=synthetic-state' });
  const resumed = await finishGoogle({ google: new URL(resume.headers.get('location')!), cookie: cookies(resume) }, email);
  expect(resumed.headers.get('location')).toBe(origin + '/api/auth/oauth2/authorize?client_id=synthetic-client&state=synthetic-state');
});

test('old sessions and changed session owners cannot approve linking or add a Google-only password', async () => {
  const email = 'stale-google@example.invalid';
  const invitation = await invite(email);
  const callback = await finishGoogle(await startGoogle(invitation.token), email);
  const cookie = cookies(callback);
  const current = await identity(cookie);
  const db = await worker.getD1Database('AUTH_DB');
  await db.prepare('UPDATE session SET createdAt=? WHERE userId=?').bind(Date.now() - 6*60_000, current!.user.id).run();
  expect((await post('/api/portal/password', { newPassword: password }, cookie)).status).toBe(403);
  expect((await post('/api/auth/link-social', { provider: 'google', callbackURL: origin + '/account' }, cookie)).status).toBe(403);
  const pending = await startGoogle('', admin, true);
  const other = await finishGoogle(await startGoogle(), email);
  const replaced = [cookies(other), pending.cookie.split('; ').filter(value => !value.includes('session_token')).join('; ')].join('; ');
  expect((await finishGoogle(pending, 'owner@example.invalid', { cookie: replaced })).headers.get('location')).toContain('error=');
  expect((await identity(admin))?.user.name).toBe('Owner');
});
