import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { mcp } from '@better-auth/mcp';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { admitVerifiedIdentity, canRecover, denyAdmission, digest, invited, participant, pendingInvitation, verificationLifetimeSeconds } from './admission.js';
import { mailConfigured, sendPortalMail } from './mail.js';

export interface HostedEnvironment {
  AUTH_DB: D1Database;
  AUTH_SECRET: string;
  BASE_URL: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
}

export function createAuth(env: HostedEnvironment) {
  let deliveryFailed = false;
  async function deliver(message: Parameters<typeof sendPortalMail>[1]) {
    try { await sendPortalMail(env, message); }
    catch { deliveryFailed = true; }
  }
  return betterAuth({
    baseURL: env.BASE_URL,
    secret: env.AUTH_SECRET,
    database: env.AUTH_DB,
    logger: { disabled: true },
    telemetry: { enabled: false },
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
        if (['/sign-up/email', '/send-verification-email', '/request-password-reset'].includes(ctx.path) && !mailConfigured(env)) {
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
      }),
      after: createAuthMiddleware(async ctx => {
        // Better Auth intentionally catches background email callback failures.
        // Recovery must remain generic even if only an eligible recipient reaches
        // a failing sender. Global missing configuration is rejected uniformly above.
        if (deliveryFailed && ctx.path !== '/request-password-reset') throw new APIError('SERVICE_UNAVAILABLE', { code: 'EMAIL_UNAVAILABLE', message: 'Email delivery is unavailable. Please try later.' });
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            await invited(env, ctx?.request?.headers.get('x-portal-invitation') ?? ctx?.headers?.get('x-portal-invitation') ?? null, user.email);
          },
          after: async (user, ctx) => {
            const invitation = await invited(env, ctx?.request?.headers.get('x-portal-invitation') ?? ctx?.headers?.get('x-portal-invitation') ?? null, user.email);
            await env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_pending_admission (userId,invitationId) VALUES (?,?)').bind(user.id, invitation.id).run();
          },
        },
      },
      session: { create: { before: async session => {
        if (!await participant(env, session.userId)) denyAdmission();
      } } },
    },
    plugins: [
      jwt(),
      mcp({
        loginPage: '/sign-in',
        consentPage: '/consent',
        resource: `${env.BASE_URL}/mcp`,
        scopes: ['openid', 'profile', 'offline_access', 'mcp:read'],
        grantTypes: ['authorization_code', 'refresh_token'],
        allowDynamicClientRegistration: false,
        allowUnauthenticatedClientRegistration: false,
        clientPrivileges: () => false,
      }),
    ],
  });
}
