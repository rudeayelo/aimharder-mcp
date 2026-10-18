import { readFile, readdir } from 'node:fs/promises';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { buildWorker } from '../build.mjs';

let worker: Miniflare;
const origin = 'http://localhost:8787';
const messages: { to: string; subject: string; text: string }[] = [];
const failedMailRecipients: string[] = [];
let mailFails = false;
let mailFailureStatus = 503;
let mailAcknowledgement = '{"id":"synthetic-message"}';
const password = 'synthetic-password-strong';
function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return worker.dispatchFetch(origin + path, {
    method: 'POST', headers: { origin, 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body), redirect: 'manual',
  });
}
function messageUrl(email: string, subject: string) {
  const message = messages.findLast(item => item.to === email && item.subject === subject);
  expect(message, `Expected synthetic ${subject} delivery`).toBeDefined();
  return message!.text.match(/http[^\s]+/)![0]!;
}
function cookies(response: { headers: { getSetCookie(): string[] } }) {
  return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
}
beforeAll(async () => {
  await buildWorker('tests/portal-fixture-worker.ts', 'dist/portal-fixture-worker.js');
  worker = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: 'dist/portal-fixture-worker.js',
    compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['AUTH_DB'],
    bindings: { AUTH_SECRET: 'synthetic-local-auth-secret-at-least-32-characters', BASE_URL: origin,
      MAIL_FROM: 'noreply@example.invalid', RESEND_API_KEY: 'synthetic-resend-key' },
    outboundService: async request => {
      if (request.url === 'https://api.resend.com/emails' && request.method === 'POST') {
        expect(request.headers.get('authorization')).toBe('Bearer synthetic-resend-key');
        expect(request.headers.get('content-type')).toBe('application/json');
        const body = await request.json() as { from: string; to: string[]; subject: string; text: string };
        expect(body.from).toBe('noreply@example.invalid');
        expect(body.to).toHaveLength(1);
        const message = { ...body, to: body.to[0]! };
        if (mailFails) {
          failedMailRecipients.push(message.to);
          return new Response('synthetic-private-provider-error', { status: mailFailureStatus,
            headers: { location: 'https://untrusted-mail.invalid/redirect' } });
        }
        messages.push(message);
        return new Response(mailAcknowledgement, { headers: { 'content-type': 'application/json' } });
      }
      throw new Error('Unexpected external request');
    },
  }));
  await worker.ready;
  const database = await worker.getD1Database('AUTH_DB');
  for (const migration of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
    await database.exec((await readFile(`migrations/${migration}`, 'utf8')).replaceAll('\n', ' '));
  await worker.dispatchFetch(origin + '/__fixture');
});
afterAll(async () => { await worker?.dispose(); });
let adminCookie = '';
test('the invited owner verifies email before password sign-in, through maintained public auth routes', async () => {
  const page = await worker.dispatchFetch(origin + '/accept-invitation?token=synthetic-owner-invitation');
  expect(page.status).toBe(200);
  expect(await page.text()).toContain('Accept invitation');
  const signup = await post('/api/auth/sign-up/email', {
    email: 'owner@example.invalid', password, name: 'Synthetic Owner', role: 'admin', emailVerified: true,
    callbackURL: origin + '/verification-result',
  }, { 'x-portal-invitation': 'synthetic-owner-invitation' });
  expect(signup.status).toBe(200);
  expect(cookies(signup)).not.toContain('session_token');
  expect((await post('/api/auth/sign-in/email', { email: 'owner@example.invalid', password })).status).toBe(403);
  const verification = await worker.dispatchFetch(messageUrl('owner@example.invalid', 'Verify your email'), { redirect: 'manual' });
  expect(verification.status).toBe(302);
  const signIn = await post('/api/auth/sign-in/email', { email: 'owner@example.invalid', password });
  expect(signIn.status).toBe(200);
  adminCookie = cookies(signIn);
  const pageAfter = await worker.dispatchFetch(origin + '/', { headers: { cookie: adminCookie } });
  expect(await pageAfter.text()).toContain('Manage invitations');
});

async function issueInvitation(email: string) {
  const response = await post('/api/portal/invitations', { email }, { cookie: adminCookie });
  expect(response.status).toBe(201);
  const { id } = await response.json() as { id: string };
  const url = new URL(messageUrl(email, 'Your AimHarder MCP invitation'));
  return { id, token: url.searchParams.get('token')! };
}
async function signup(email: string, token?: string) {
  return post('/api/auth/sign-up/email', { email, password, name: 'Synthetic Participant',
    role: 'admin', emailVerified: true, callbackURL: origin + '/verification-result' },
  token ? { 'x-portal-invitation': token } : {});
}
test('only the administrator issues, lists and revokes email-bound invitations; accepted participants remain users', async () => {
  expect((await post('/api/portal/invitations', { email: 'outsider@example.invalid' })).status).toBe(401);
  const { id, token } = await issueInvitation('member@example.invalid');
  expect((await signup('uninvited@example.invalid')).status).toBe(403);
  expect((await signup('wrong-address@example.invalid', token)).status).toBe(403);
  expect((await signup('MEMBER@example.invalid', token)).status).toBe(200);
  const verified = await worker.dispatchFetch(messageUrl('member@example.invalid', 'Verify your email'), { redirect: 'manual' });
  expect(verified.status).toBe(302);
  const signIn = await post('/api/auth/sign-in/email', { email: 'member@example.invalid', password });
  expect(signIn.status).toBe(200);
  const memberCookie = cookies(signIn);
  const home = await worker.dispatchFetch(origin + '/', { headers: { cookie: memberCookie } });
  expect(await home.text()).not.toContain('Manage invitations');
  expect((await post('/api/portal/invitations', { email: 'other@example.invalid' }, { cookie: memberCookie })).status).toBe(403);
  const list = await worker.dispatchFetch(origin + '/api/portal/invitations', { headers: { cookie: adminCookie } });
  const text = await list.text();
  expect(text).toContain('accepted');
  expect(text).not.toContain(token);
  expect(text).not.toContain('tokenDigest');
  expect((await post(`/api/portal/invitations/${id}/revoke`, {}, { cookie: adminCookie })).status).toBe(409);
  const unused = await issueInvitation('revoked@example.invalid');
  expect((await post(`/api/portal/invitations/${unused.id}/revoke`, {}, { cookie: adminCookie })).status).toBe(200);
  expect((await signup('revoked@example.invalid', unused.token)).status).toBe(403);
});

test('recovery preserves the admitted identity, revokes old sessions and cannot admit pending or unknown accounts', async () => {
  const invite = await issueInvitation('pending@example.invalid');
  expect((await signup('pending@example.invalid', invite.token)).status).toBe(200);
  for (const email of ['pending@example.invalid', 'unknown@example.invalid']) {
    const before = messages.length;
    const recovery = await post('/api/auth/request-password-reset', { email, redirectTo: origin + '/reset-password' });
    expect(recovery.status).toBe(200);
    expect(messages.length).toBe(before);
    expect((await recovery.json() as { status: boolean }).status).toBe(true);
  }
  const oldSignIn = await post('/api/auth/sign-in/email', { email: 'member@example.invalid', password });
  const oldCookie = cookies(oldSignIn);
  const identity = await oldSignIn.json() as { user: { id: string } };
  expect((await post('/api/auth/request-password-reset', { email: 'member@example.invalid', redirectTo: origin + '/reset-password' })).status).toBe(200);
  const resetCallback = await worker.dispatchFetch(messageUrl('member@example.invalid', 'Reset your portal password'), { redirect: 'manual' });
  expect(resetCallback.status).toBe(302);
  const resetUrl = new URL(resetCallback.headers.get('location')!);
  const resetPage = await worker.dispatchFetch(resetUrl);
  expect(await resetPage.text()).toContain('Reset portal password');
  const resetToken = resetUrl.searchParams.get('token')!;
  const reset = await post('/api/auth/reset-password', { token: resetToken, newPassword: 'synthetic-new-password' });
  expect(reset.status).toBe(200);
  const oldSession = await worker.dispatchFetch(origin + '/api/auth/get-session', { headers: { cookie: oldCookie } });
  expect(await oldSession.json()).toBe(null);
  expect((await post('/api/auth/reset-password', { token: resetToken, newPassword: 'synthetic-third-password' })).status).toBeGreaterThanOrEqual(400);
  expect((await post('/api/auth/sign-in/email', { email: 'member@example.invalid', password })).status).toBe(401);
  const fresh = await post('/api/auth/sign-in/email', { email: 'member@example.invalid', password: 'synthetic-new-password' });
  expect(fresh.status).toBe(200);
  expect((await fresh.json() as typeof identity).user.id).toBe(identity.user.id);
});

test('revoking a pending invitation blocks its verification; a new invitation creates a fresh credential generation', async () => {
  const first = await issueInvitation('reinvited@example.invalid');
  expect((await signup('reinvited@example.invalid', first.token)).status).toBe(200);
  const oldVerification = messageUrl('reinvited@example.invalid', 'Verify your email');
  expect((await post(`/api/portal/invitations/${first.id}/revoke`, {}, { cookie: adminCookie })).status).toBe(200);
  expect((await worker.dispatchFetch(oldVerification, { redirect: 'manual' })).status).toBe(403);
  const second = await issueInvitation('reinvited@example.invalid');
  const freshSignup = await post('/api/auth/sign-up/email', {
    email: 'reinvited@example.invalid', name: 'Reinvited Participant', password: 'synthetic-reinvited-password',
    callbackURL: origin + '/verification-result',
  }, { 'x-portal-invitation': second.token });
  expect(freshSignup.status).toBe(200);
  const newVerification = messageUrl('reinvited@example.invalid', 'Verify your email');
  expect(newVerification !== oldVerification).toBe(true);
  expect((await worker.dispatchFetch(oldVerification, { redirect: 'manual' })).status).toBe(403);
  expect((await worker.dispatchFetch(newVerification, { redirect: 'manual' })).status).toBe(302);
  expect((await post('/api/auth/sign-in/email', { email: 'reinvited@example.invalid', password })).status).toBe(401);
  expect((await post('/api/auth/sign-in/email', { email: 'reinvited@example.invalid', password: 'synthetic-reinvited-password' })).status).toBe(200);
});

async function seedInvitation(email: string, token: string, expiresAt: number) {
  const db = await worker.getD1Database('AUTH_DB');
  const tokenDigest = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))).toString('hex');
  await db.prepare('INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,createdAt) VALUES (?,?,?,?,?)')
    .bind(crypto.randomUUID(), email, tokenDigest, expiresAt, Date.now()).run();
}
test('expired invitations fail both admission stages while already admitted users can recover after invite expiry', async () => {
  await seedInvitation('expired@example.invalid', 'synthetic-expired', Date.now() - 1);
  expect((await signup('expired@example.invalid', 'synthetic-expired')).status).toBe(403);
  await seedInvitation('expires-pending@example.invalid', 'synthetic-pending-expiry', Date.now() + 1000);
  await seedInvitation('expires-accepted@example.invalid', 'synthetic-accepted-expiry', Date.now() + 1000);
  expect((await signup('expires-pending@example.invalid', 'synthetic-pending-expiry')).status).toBe(200);
  expect((await signup('expires-accepted@example.invalid', 'synthetic-accepted-expiry')).status).toBe(200);
  expect((await worker.dispatchFetch(messageUrl('expires-accepted@example.invalid', 'Verify your email'), { redirect: 'manual' })).status).toBe(302);
  await new Promise(resolve => setTimeout(resolve, 1050));
  expect((await worker.dispatchFetch(messageUrl('expires-pending@example.invalid', 'Verify your email'), { redirect: 'manual' })).status).toBe(403);
  const recovery = await post('/api/auth/request-password-reset', { email: 'expires-accepted@example.invalid', redirectTo: origin + '/reset-password' });
  expect(recovery.status).toBe(200);
  expect(Boolean(messageUrl('expires-accepted@example.invalid', 'Reset your portal password'))).toBe(true);
});

test('verification and revoke races have one durable outcome, including simultaneous verification retries', async () => {
  const email = 'racing@example.invalid';
  const invite = await issueInvitation(email);
  expect((await signup(email, invite.token)).status).toBe(200);
  const verificationUrl = messageUrl(email, 'Verify your email');
  const [verification, revoke] = await Promise.all([
    worker.dispatchFetch(verificationUrl, { redirect: 'manual' }),
    post(`/api/portal/invitations/${invite.id}/revoke`, {}, { cookie: adminCookie }),
  ]);
  const signIn = await post('/api/auth/sign-in/email', { email, password });
  if (revoke.status === 200) {
    expect(verification.status).toBe(403);
    expect(signIn.status).toBe(403);
  } else {
    expect(revoke.status).toBe(409);
    expect(verification.status).toBe(302);
    expect(signIn.status).toBe(200);
  }
  const duplicate = await issueInvitation('simultaneous@example.invalid');
  await signup('simultaneous@example.invalid', duplicate.token);
  const url = messageUrl('simultaneous@example.invalid', 'Verify your email');
  const attempts = await Promise.all([worker.dispatchFetch(url, { redirect: 'manual' }), worker.dispatchFetch(url, { redirect: 'manual' })]);
  expect(attempts.map(response => response.status)).toEqual([302, 302]);
  expect((await post('/api/auth/sign-in/email', { email: 'simultaneous@example.invalid', password })).status).toBe(200);
});

test('invitation and verification delivery failures report unavailable while recovery stays generic', async () => {
  const pending = await issueInvitation('mail-retry@example.invalid');
  mailFails = true;
  try {
    const failedInvite = await post('/api/portal/invitations', { email: 'undelivered@example.invalid' }, { cookie: adminCookie });
    expect(failedInvite.status).toBe(503);
    expect((await signup('mail-retry@example.invalid', pending.token)).status).toBe(503);
    const recovery = await post('/api/auth/request-password-reset', { email: 'owner@example.invalid', redirectTo: origin + '/reset-password' });
    expect(recovery.status).toBe(200);
  } finally { mailFails = false; }
  const resend = await post('/api/auth/send-verification-email', { email: 'mail-retry@example.invalid', callbackURL: origin + '/verification-result' });
  expect(resend.status).toBe(200);
  expect((await worker.dispatchFetch(messageUrl('mail-retry@example.invalid', 'Verify your email'), { redirect: 'manual' })).status).toBe(302);
  const list = await worker.dispatchFetch(origin + '/api/portal/invitations', { headers: { cookie: adminCookie } });
  const data = await list.json() as { invitations: { email: string; status: string }[] };
  expect(data.invitations.find(item => item.email === 'undelivered@example.invalid')?.status).toBe('revoked');
});

test('public HTML forms complete enrollment, sign-in and sign-out, and reject cross-origin admin writes', async () => {
  const invite = await issueInvitation('forms@example.invalid');
  const acceptedPage = await worker.dispatchFetch(origin + '/accept-invitation?token=' + encodeURIComponent(invite.token));
  const html = await acceptedPage.text();
  expect(html).toContain('action="/portal/sign-up"');
  expect(acceptedPage.headers.get('referrer-policy')).toBe('strict-origin');
  async function form(path: string, fields: Record<string, string>, cookie = '') {
    return worker.dispatchFetch(origin + path, { method: 'POST', redirect: 'manual',
      headers: { origin, 'content-type': 'application/x-www-form-urlencoded', cookie },
      body: new URLSearchParams(fields).toString() });
  }
  const enrollment = await form('/portal/sign-up', { invitation: invite.token, email: 'forms@example.invalid', name: 'Form Participant', password });
  expect(enrollment.status).toBe(200);
  expect(await enrollment.text()).toContain('Check your email');
  await worker.dispatchFetch(messageUrl('forms@example.invalid', 'Verify your email'), { redirect: 'manual' });
  const login = await form('/portal/sign-in', { email: 'forms@example.invalid', password });
  expect(login.status).toBe(303);
  const cookie = cookies(login);
  const home = await worker.dispatchFetch(origin + '/', { headers: { cookie } });
  expect(await home.text()).toContain('You are signed in');
  expect((await form('/portal/sign-out', {}, cookie)).status).toBe(303);
  const session = await worker.dispatchFetch(origin + '/api/auth/get-session', { headers: { cookie } });
  expect(await session.json()).toBe(null);
  expect((await post('/api/portal/invitations', { email: 'cross-origin@example.invalid' }, { cookie: adminCookie, origin: 'https://attacker.invalid' })).status).toBe(403);
  expect((await worker.dispatchFetch(origin + '/portal/invitations', { method: 'POST', headers: { origin: 'https://attacker.invalid', cookie: adminCookie }, body: 'email=cross-origin@example.invalid' })).status).toBe(403);
  expect((await worker.dispatchFetch(origin + '/portal/recovery', { method: 'POST', headers: { origin: 'null' }, body: 'email=synthetic@example.invalid' })).status).toBe(403);
});

test('a social-only participant cannot acquire a password through recovery and expired recovery tokens fail', async () => {
  const db = await worker.getD1Database('AUTH_DB');
  const now = Date.now();
  // Initial synthetic provider/database state only; assertions stay on the public auth seam.
  await db.batch([
    db.prepare('INSERT INTO user (id,name,email,emailVerified,createdAt,updatedAt) VALUES (?,?,?,?,?,?)')
      .bind('social-only', 'Synthetic Social Participant', 'social@example.invalid', 1, now, now),
    db.prepare('INSERT INTO account (id,accountId,providerId,userId,createdAt,updatedAt) VALUES (?,?,?,?,?,?)')
      .bind('social-provider', 'synthetic-provider-subject', 'google', 'social-only', now, now),
    db.prepare('INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,createdAt,acceptedAt,acceptedUserId) VALUES (?,?,?,?,?,?,?)')
      .bind('social-invitation', 'social@example.invalid', 'synthetic-social-no-capability', now - 1, now, now, 'social-only'),
    db.prepare('INSERT INTO portal_participant (userId,invitationId,role,admittedAt) VALUES (?,?,?,?)')
      .bind('social-only', 'social-invitation', 'user', now),
    db.prepare('INSERT INTO verification (id,identifier,value,expiresAt,createdAt,updatedAt) VALUES (?,?,?,?,?,?)')
      .bind('social-reset', 'reset-password:synthetic-social-reset', 'social-only', now + 60000, now, now),
  ]);
  const before = messages.length;
  expect((await post('/api/auth/request-password-reset', { email: 'social@example.invalid', redirectTo: origin + '/reset-password' })).status).toBe(200);
  expect(messages.length).toBe(before);
  expect((await post('/api/auth/reset-password', { token: 'synthetic-social-reset', newPassword: password })).status).toBe(403);
  expect((await post('/api/auth/sign-in/email', { email: 'social@example.invalid', password })).status).toBe(401);
  const owner = await worker.dispatchFetch(origin + '/api/auth/get-session', { headers: { cookie: adminCookie } });
  const ownerId = (await owner.json() as { user: { id: string } }).user.id;
  await db.prepare('INSERT INTO verification (id,identifier,value,expiresAt,createdAt,updatedAt) VALUES (?,?,?,?,?,?)')
    .bind('expired-recovery', 'reset-password:synthetic-expired-recovery', ownerId, now - 1, now, now).run();
  expect((await post('/api/auth/reset-password', { token: 'synthetic-expired-recovery', newPassword: password })).status).toBeGreaterThanOrEqual(400);
});

test('the production entry has no fixture routes and disables enrollment and recovery without a configured sender', async () => {
  await buildWorker();
  const unconfigured = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: 'dist/worker.js', compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['AUTH_DB'], bindings: { AUTH_SECRET: 'synthetic-unconfigured-secret-at-least-32-characters', BASE_URL: origin },
    outboundService: () => { throw new Error('Unconfigured runtime must not send email'); },
  }));
  try {
    await unconfigured.ready;
    const db = await unconfigured.getD1Database('AUTH_DB');
    for (const file of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
      await db.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
    for (const path of ['/__fixture', '/__mail', '/api/portal/bootstrap'])
      expect((await unconfigured.dispatchFetch(origin + path)).status).toBe(404);
    for (const path of ['/sign-up/email', '/request-password-reset', '/send-verification-email']) {
      const denied = await unconfigured.dispatchFetch(origin + '/api/auth' + path, {
        method: 'POST', headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'closed@example.invalid', name: 'Closed', password }),
      });
      expect(denied.status).toBe(503);
      expect(await denied.text()).toContain('Email delivery is unavailable');
    }
  } finally { await unconfigured.dispose(); }
});

test('configured recovery sender failure gives indistinguishable native and HTML outcomes for every eligibility class', async () => {
  const failedAttemptsBefore = failedMailRecipients.length;
  mailFails = true;
  try {
    const nativeOutcomes: { status: number; body: string }[] = [];
    const formOutcomes: { status: number; body: string }[] = [];
    for (const email of ['owner@example.invalid', 'unknown@example.invalid', 'pending@example.invalid', 'social@example.invalid']) {
      const native = await post('/api/auth/request-password-reset', { email, redirectTo: origin + '/reset-password' });
      nativeOutcomes.push({ status: native.status, body: await native.text() });
      const form = await worker.dispatchFetch(origin + '/portal/recovery', {
        method: 'POST', headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
      });
      formOutcomes.push({ status: form.status, body: await form.text() });
    }
    for (const outcome of nativeOutcomes) {
      expect(outcome.status).toBe(200);
      expect(outcome).toEqual(nativeOutcomes[1]);
    }
    for (const outcome of formOutcomes) {
      expect(outcome.status).toBe(200);
      expect(outcome).toEqual(formOutcomes[1]);
      expect(outcome.body).toContain('If no message arrives');
      expect(outcome.body).not.toContain('will arrive');
    }
    expect(failedMailRecipients.slice(failedAttemptsBefore)).toEqual(['owner@example.invalid', 'owner@example.invalid']);
  } finally { mailFails = false; }
});

test('Resend redirects, credential errors and rate limits fail safely without following or retrying the send', async () => {
  mailFails = true;
  try {
    for (const status of [302, 401, 429, 503]) {
      mailFailureStatus = status;
      const before = failedMailRecipients.length;
      const response = await post('/api/portal/invitations', { email: `failure-${status}@example.invalid` }, { cookie: adminCookie });
      expect(response.status).toBe(503);
      expect(await response.text()).toBe('{"message":"The invitation could not be delivered. Please try later."}');
      expect(failedMailRecipients.length - before).toBe(1);
    }
  } finally { mailFails = false; mailFailureStatus = 503; }
});

test('partial Resend configuration closes enrollment and recovery without making external requests', async () => {
  for (const configuration of [
    { MAIL_FROM: 'noreply@example.invalid' },
    { RESEND_API_KEY: 'synthetic-key' },
    { RESEND_API_KEY: ' ', MAIL_FROM: 'noreply@example.invalid' },
    { RESEND_API_KEY: 'synthetic-key', MAIL_FROM: 'noreply@example.invalid\r\nBcc: hidden@example.invalid' },
  ]) {
    const partial = new Miniflare(convertV4MiniflareOptions({
      modules: true, scriptPath: 'dist/worker.js', compatibilityDate: '2026-10-12', compatibilityFlags: ['nodejs_compat'],
      d1Databases: ['AUTH_DB'], bindings: { AUTH_SECRET: 'synthetic-partial-secret-at-least-32-characters', BASE_URL: origin, ...configuration },
      outboundService: () => { throw new Error('Partial mail configuration must not reach external services'); },
    }));
    try {
      await partial.ready;
      const db = await partial.getD1Database('AUTH_DB');
      for (const file of (await readdir('migrations')).filter(name => /^\d+.*\.sql$/.test(name)).sort())
        await db.exec((await readFile(`migrations/${file}`, 'utf8')).replaceAll('\n', ' '));
      for (const path of ['/api/auth/sign-up/email', '/api/auth/request-password-reset']) {
        const response = await partial.dispatchFetch(origin + path, {
          method: 'POST', headers: { origin, 'content-type': 'application/json' },
          body: JSON.stringify({ email: 'closed@example.invalid', name: 'Closed', password }),
        });
        expect(response.status).toBe(503);
        expect(await response.text()).toContain('Email delivery is unavailable');
      }
    } finally { await partial.dispose(); }
  }
});

test('a successful provider status without a bounded message acknowledgement is unavailable to the participant', async () => {
  try {
    for (const [index, body] of ['{}', 'not-json', '{"id":"' + 'x'.repeat(5000) + '"}'].entries()) {
      mailAcknowledgement = body;
      const response = await post('/api/portal/invitations', { email: `bad-ack-${index}@example.invalid` }, { cookie: adminCookie });
      expect(response.status).toBe(503);
      expect(await response.text()).not.toContain(body);
    }
  } finally { mailAcknowledgement = '{"id":"synthetic-message"}'; }
});
