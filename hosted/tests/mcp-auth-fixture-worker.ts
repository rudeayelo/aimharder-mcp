// Disposable synthetic setup only; never included in the deployed Worker.
import feasibilityFixture from './fixture-worker.js';
import { handleHostedRequest } from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export default {
  async fetch(request: Request, env: HostedEnvironment) {
    if (new URL(request.url).pathname === '/__fixture') {
      const result = await feasibilityFixture.fetch(request, env);
      const now = Date.now();
      await env.AUTH_DB.batch([
        env.AUTH_DB.prepare('INSERT INTO user (id,name,email,emailVerified,createdAt,updatedAt) VALUES (?,?,?,?,?,?)').bind('other-participant', 'Other Participant', 'other@example.invalid', 1, now, now),
        env.AUTH_DB.prepare(`INSERT INTO account (id,accountId,providerId,userId,password,createdAt,updatedAt) SELECT 'other-password','other-participant','credential','other-participant',password,createdAt,updatedAt FROM account WHERE id='fixture-password'`),
        env.AUTH_DB.prepare('INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,createdAt,acceptedAt,acceptedUserId) VALUES (?,?,?,?,?,?,?)').bind('other-invitation', 'other@example.invalid', 'synthetic-other-invitation', now, now, now, 'other-participant'),
        env.AUTH_DB.prepare('INSERT INTO portal_participant (userId,invitationId,role,admittedAt) VALUES (?,?,?,?)').bind('other-participant', 'other-invitation', 'user', now),
        env.AUTH_DB.prepare(`INSERT INTO oauthClient (id,clientId,name,redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent) SELECT 'other-client','other-client','Other synthetic client',redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent FROM oauthClient WHERE clientId='fixture-client'`),
        env.AUTH_DB.prepare('INSERT INTO oauthClientResource (id,clientId,resourceId) VALUES (?,?,?)').bind('other-resource', 'other-client', `${env.BASE_URL}/mcp`),
      ]);
      return result;
    }
    return handleHostedRequest(request, env, async () => null);
  },
};
