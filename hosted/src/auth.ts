import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { mcp } from '@better-auth/mcp';

export interface HostedEnvironment {
  AUTH_DB: D1Database;
  AUTH_SECRET: string;
  BASE_URL: string;
}

export function createAuth(env: HostedEnvironment) {
  return betterAuth({
    baseURL: env.BASE_URL,
    secret: env.AUTH_SECRET,
    database: env.AUTH_DB,
    logger: { disabled: true },
    emailAndPassword: { enabled: true, disableSignUp: true },
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
