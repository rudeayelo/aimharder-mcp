// Disposable synthetic setup only; never included in the deployed Worker.
import feasibilityFixture from './fixture-worker.js';
import { handleHostedRequest } from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export default {
  async fetch(request: Request, env: HostedEnvironment) {
    if (new URL(request.url).pathname === '/__fixture') {
      const result = await feasibilityFixture.fetch(request, env);
      await env.AUTH_DB.batch([
        env.AUTH_DB.prepare(`INSERT INTO oauthClient (id,clientId,name,redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent) SELECT 'other-client','other-client','Other synthetic client',redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent FROM oauthClient WHERE clientId='fixture-client'`),
        env.AUTH_DB.prepare('INSERT INTO oauthClientResource (id,clientId,resourceId) VALUES (?,?,?)').bind('other-resource', 'other-client', `${env.BASE_URL}/mcp`),
      ]);
      return result;
    }
    return handleHostedRequest(request, env, async () => null);
  },
};
