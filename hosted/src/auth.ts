import type { TelemetryConfiguration, TelemetryInvocation } from './telemetry.js';
import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { mcp } from '@better-auth/mcp';
import { APIError, createAuthMiddleware, addOAuthServerContext, getOAuthState, getSessionFromCtx } from 'better-auth/api';
import { admitVerifiedIdentity, claimInvitation, canRecover, denyAdmission, digest, invited, participant, pendingInvitation, verificationLifetimeSeconds } from './admission.js';
import { issueGrantClaim, readIssuingGrant } from './oauth-grants.js';
import { mailConfigured, sendPortalMail } from './mail.js';

export interface HostedEnvironment extends TelemetryConfiguration {
  /** Invocation scoped; never persisted in account objects. */
  TELEMETRY?: TelemetryInvocation;
  AUTH_DB: D1Database;
  RECOVERY_DB?: D1Database;
  RECOVERY_AUTHORITY_ID?: string;
  /** Request scoped, never accepted from external headers. */
  RECOVERY_LEASE?: string;
  AUTH_SECRET: string;
  BASE_URL: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  ACCOUNT_CONNECTIONS?: DurableObjectNamespace;
  VAULT_KEYS?: string;
  VAULT_ACTIVE_KEY_ID?: string;
}

export function googleConfigured(env: HostedEnvironment): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID?.trim() && env.GOOGLE_CLIENT_SECRET?.trim());
}
async function invitationToken(headers?: Headers): Promise<string | null> {
  const state = await getOAuthState();
  const token = state?.serverContext?.portalInvitation;
  return typeof token === 'string' ? token : headers?.get('x-portal-invitation') ?? null;
}
// Request scoped: delivery outcome and issuing grant must never cross requests.
export function createAuth(env: HostedEnvironment) {
  let authorizationSnapshot: { userId: string; generations: Map<string, number> } | undefined;
  let deliveryFailed = false;
  let issuingGrant: Awaited<ReturnType<typeof readIssuingGrant>> | undefined;
  async function deliver(message: Parameters<typeof sendPortalMail>[1]) {
    try { await sendPortalMail(env, message); }
    catch { deliveryFailed = true; env.TELEMETRY?.httpOutcome({outcome:'technical_failure',code:'EMAIL_UNAVAILABLE'}); }
  }
  return betterAuth({
    baseURL: env.BASE_URL,
    secret: env.AUTH_SECRET,
    database: env.AUTH_DB,
    logger: { disabled: true },
    telemetry: { enabled: false },
    socialProviders: googleConfigured(env) ? { google: {
      clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET!,
      requireEmailVerification: true, prompt: 'select_account',
    } } : {},
    account: { accountLinking: { enabled: true, disableImplicitLinking: true,
      requireLocalEmailVerified: true, allowDifferentEmails: false, updateUserInfoOnLink: false },
      encryptOAuthTokens: true },
    user: { validateUserInfo: async ({ user, source }, ctx) => {
      if (source.method !== 'oauth') return;
      if (source.oauth?.providerId !== 'google' || user.emailVerified !== true) denyAdmission();
      if (source.action === 'link-account') {
        const state = await getOAuthState();
        const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
        if (!session || !state?.link || state.serverContext?.linkSession !== session.session.id ||
          state.link.userId !== session.user.id || !await participant(env, session.user.id) ||
          Date.now() - new Date(session.session.createdAt).getTime() > 5 * 60_000) denyAdmission();
      }
      if (source.action === 'create-user') await invited(env, await invitationToken(), String(user.email));
      else if (source.action === 'sign-in') {
        const local = await env.AUTH_DB.prepare('SELECT email FROM user WHERE id=?').bind(String(user.id)).first<{email: string}>();
        if (!local || local.email !== String(user.email).toLowerCase()) denyAdmission();
        if (!await participant(env, String(user.id))) await invited(env, await invitationToken(), local.email);
      }
    } },
    emailAndPassword: {
      enabled: true, requireEmailVerification: true, autoSignIn: false,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        if (await canRecover(env, user.id)) await deliver({ kind: 'recovery', to: user.email, url });
      },
    },
    emailVerification: {
      sendOnSignUp: true, autoSignInAfterVerification: false, expiresIn: verificationLifetimeSeconds,
      sendVerificationEmail: async ({ user, url, token }, request) => {
        // Better Auth defers create.after until sign-up completes, including on D1.
        // Bind the just-created identity here before issuing its verification delivery.
        if (!await pendingInvitation(env, user.id) && request?.headers.get('x-portal-invitation')) {
          const current = await invited(env, request.headers.get('x-portal-invitation'), user.email);
          await env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_pending_admission (userId,invitationId) VALUES (?,?)').bind(user.id, current.id).run();
        }
        const invitation = await pendingInvitation(env, user.id);
        if (!invitation) denyAdmission();
        const delivery = crypto.randomUUID();
        const deliveryUrl = new URL(url);
        deliveryUrl.searchParams.set('delivery', delivery);
        await env.AUTH_DB.prepare(
          'INSERT OR REPLACE INTO portal_verification_delivery (tokenDigest,userId,invitationId,expiresAt) VALUES (?,?,?,?)'
        ).bind(await digest(`${token}\0${delivery}`), user.id, invitation.id, Date.now() + verificationLifetimeSeconds * 1000).run();
        await deliver({ kind: 'verification', to: user.email, url: deliveryUrl.href });
      },
      beforeEmailVerification: async (user, request) => {
        const query = request && new URL(request.url).searchParams;
        const token = query && query.get('token');
        const delivery = query && query.get('delivery');
        if (!token || !delivery) denyAdmission();
        await admitVerifiedIdentity(env, user.id, `${token}\0${delivery}`);
      },
    },
    hooks: {
      before: createAuthMiddleware(async ctx => {
        let authorizationPrompt: string | undefined;
        // A cached portal cookie cannot authorize maintained account endpoints.
        const currentSession = await getSessionFromCtx(ctx, { disableCookieCache: true });
        if (currentSession && !['/sign-out', '/get-session'].includes(ctx.path) && !await participant(env, currentSession.user.id)) denyAdmission();
        if (['/oauth2/authorize', '/oauth2/consent', '/oauth2/continue'].includes(ctx.path)) {
          if (ctx.path === '/oauth2/authorize' && !authorizationSnapshot) {
            // Fresh authorizations always need an explicit decision. A stale
            // consent write must not silently reconnect after revocation.
            const prompts = new Set(String(ctx.query?.prompt ?? '').split(/\s+/).filter(Boolean));
            prompts.add('consent');
            authorizationPrompt = [...prompts].join(' ');
          }
          const session = currentSession;
          if (session && !await participant(env, session.user.id)) denyAdmission();
          if (session && !authorizationSnapshot) {
            // Snapshot before the maintained handler can read consent. A code
            // minted later must not adopt a revocation committed in between.
            const rows = await env.AUTH_DB.prepare(`SELECT c.clientId,COALESCE(r.generation,0) AS generation
              FROM portal_participant p JOIN user u ON u.id=p.userId JOIN session s ON s.userId=p.userId
              CROSS JOIN oauthClient c LEFT JOIN portal_mcp_revocation r ON r.userId=p.userId AND r.clientId=c.clientId
              WHERE p.userId=? AND p.status='active' AND u.emailVerified=1 AND s.id=? AND s.expiresAt>?`)
              .bind(session.user.id, session.session.id, Date.now()).all<{ clientId: string; generation: number }>();
            if (!rows.results.length) denyAdmission();
            authorizationSnapshot = { userId: session.user.id,
              generations: new Map(rows.results.map(row => [row.clientId, row.generation])) };
          }
        }
        if (ctx.path === '/oauth2/token') issuingGrant = await readIssuingGrant(env, ctx.body);

        if (ctx.path === '/sign-in/social' || ctx.path === '/link-social') {
          if (!googleConfigured(env)) {env.TELEMETRY?.httpOutcome({outcome:'denied',code:'GOOGLE_UNAVAILABLE'});throw new APIError('SERVICE_UNAVAILABLE', { code: 'GOOGLE_UNAVAILABLE', message: 'Google sign-in is unavailable.' });}
          // Only redirect-based sign-in is supported. Keep scopes fixed to identity.
          if (ctx.body.provider !== 'google' || ctx.body.idToken || ctx.body.scopes?.length || ctx.body.additionalParams) denyAdmission();
          const session = ctx.path === '/link-social' ? await getSessionFromCtx(ctx, { disableCookieCache: true }) : null;
          if (ctx.path === '/link-social' && (!session || !await participant(env, session.user.id) ||
            Date.now() - new Date(session.session.createdAt).getTime() > 5 * 60_000)) denyAdmission();
          await addOAuthServerContext({ portalInvitation: ctx.headers?.get('x-portal-invitation') ?? null,
            linkSession: session?.session.id ?? null });
        }
        if (['/sign-up/email', '/send-verification-email', '/request-password-reset'].includes(ctx.path) && !mailConfigured(env)) {
          env.TELEMETRY?.httpOutcome({outcome:'denied',code:'EMAIL_UNAVAILABLE'});
          throw new APIError('SERVICE_UNAVAILABLE', { code: 'EMAIL_UNAVAILABLE', message: 'Email delivery is unavailable. Please try later.' });
        }
        if (ctx.path === '/sign-up/email') {
          await invited(env, ctx.headers?.get('x-portal-invitation') ?? null, ctx.body.email);
          // A fresh invitation may replace only an unverified identity whose earlier
          // admission has expired/revoked. The conditional delete cannot erase an
          // admitted identity even when verification races this request.
          await env.AUTH_DB.prepare(
            `DELETE FROM user WHERE email=? AND emailVerified=0 AND NOT EXISTS (SELECT 1 FROM portal_participant WHERE userId=user.id) AND id IN (SELECT p.userId FROM portal_pending_admission p JOIN portal_invitation i ON i.id=p.invitationId WHERE i.revokedAt IS NOT NULL OR i.expiresAt<=?)`
          ).bind(ctx.body.email.toLowerCase(), Date.now()).run();
        }
        if (ctx.path === '/reset-password') {
          const token = ctx.body.token ?? ctx.query?.token;
          const reset = token && await ctx.context.internalAdapter.findVerificationValue(`reset-password:${token}`);
          if (!reset || !await canRecover(env, reset.value)) denyAdmission();
        }
        if (authorizationPrompt) return { context: { query: { ...ctx.query, prompt: authorizationPrompt } } };
      }),
      after: createAuthMiddleware(async ctx => {
        // Better Auth intentionally catches background email callback failures.
        // Recovery must remain generic even if only an eligible recipient reaches
        // a failing sender. Global missing configuration is rejected uniformly above.
        if (deliveryFailed && ctx.path !== '/request-password-reset') {env.TELEMETRY?.httpOutcome({outcome:'technical_failure',code:'EMAIL_UNAVAILABLE'});throw new APIError('SERVICE_UNAVAILABLE', { code: 'EMAIL_UNAVAILABLE', message: 'Email delivery is unavailable. Please try later.' });}
      }),
    },
    databaseHooks: {
      verification: { create: { before: async verification => {
        let value;
        try { value = JSON.parse(verification.value); }
        catch { return; /* Other verification formats belong to maintained flows. */ }
        if (value?.type !== 'authorization_code') return;
        if (!authorizationSnapshot || authorizationSnapshot.userId !== value.userId || typeof value.query?.client_id !== 'string') denyAdmission();
        return { data: { ...verification, value: JSON.stringify({ ...value,
          portalMcpGeneration: authorizationSnapshot.generations.get(value.query.client_id) ?? 0 }) } };
      } } },
      user: {
        create: {
          before: async (user, ctx) => {
            await invited(env, await invitationToken(ctx?.request?.headers ?? ctx?.headers), user.email);
          },
          after: async (user, ctx) => {
            if ((await getOAuthState())?.serverContext) return;
            const invitation = await invited(env, await invitationToken(ctx?.request?.headers ?? ctx?.headers), user.email);
            await env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_pending_admission (userId,invitationId) VALUES (?,?)').bind(user.id, invitation.id).run();
          },
        },
      },
      session: { create: { before: async session => {
        if (!await participant(env, session.userId)) {
          const state = await getOAuthState();
          const user = await env.AUTH_DB.prepare('SELECT email,emailVerified FROM user WHERE id=?').bind(session.userId).first<{email: string; emailVerified: number}>();
          if (!state?.serverContext || !user?.emailVerified) denyAdmission();
          const invitation = await invited(env, await invitationToken(), user.email);
          await claimInvitation(env, session.userId, invitation.id);
        }
      } } },
    },
    plugins: [
      jwt(),
      mcp({
        loginPage: '/sign-in',
        storeTokens: { hash: digest },
        customAccessTokenClaims: ({ user }) => issueGrantClaim(env, issuingGrant, user?.id),
        consentPage: '/consent',
        resource: `${env.BASE_URL}/mcp`,
        resources: [{ identifier: `${env.BASE_URL}/mcp`, name: 'AimHarder MCP', allowedScopes: ['mcp:access', 'offline_access'] }],
        resourceSeedMode: 'merge',
        scopes: ['openid', 'profile', 'offline_access', 'mcp:access'],
        grantTypes: ['authorization_code', 'refresh_token'],
        allowDynamicClientRegistration: false,
        allowUnauthenticatedClientRegistration: false,
        clientPrivileges: () => false,
        validateRedirectUri: (uri, registeredUris) => registeredUris.includes(uri),
      }),
    ],
  });
}
