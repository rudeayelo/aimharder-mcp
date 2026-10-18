// This entry point is only bundled by the local harness, never by build.mjs.
import { hashPassword } from 'better-auth/crypto';
import { handleHostedRequest } from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';

export default {
  async fetch(request: Request, env: HostedEnvironment) {
    if (new URL(request.url).pathname === '/__fixture') {
      const start = performance.now();
      const hash = await hashPassword('synthetic-portal-password');
      const hashMilliseconds = performance.now() - start;
      const now = Date.now();
      await env.AUTH_DB.batch([
        env.AUTH_DB.prepare(
          'INSERT INTO user (id,name,email,emailVerified,createdAt,updatedAt) VALUES (?,?,?,?,?,?)'
        ).bind('portal-fixture', 'Fixture Participant', 'participant@example.invalid', 1, now, now),
        env.AUTH_DB.prepare(
          'INSERT INTO account (id,accountId,providerId,userId,password,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)'
        ).bind('fixture-password', 'portal-fixture', 'credential', 'portal-fixture', hash, now, now),
        env.AUTH_DB.prepare(
          'INSERT INTO oauthClient (id,clientId,name,redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        ).bind(
          'fixture-client',
          'fixture-client',
          'Synthetic MCP harness',
          JSON.stringify(['http://127.0.0.1:9999/callback']),
          'none',
          'native',
          JSON.stringify(['authorization_code', 'refresh_token']),
          JSON.stringify(['code']),
          1,
          JSON.stringify(['openid', 'profile', 'offline_access', 'mcp:read']),
          0
        ),
        env.AUTH_DB.prepare(
          'INSERT OR IGNORE INTO oauthResource (id,identifier,name,allowedScopes) VALUES (?,?,?,?)'
        ).bind(
          'fixture-resource',
          `${env.BASE_URL}/mcp`,
          'MCP account queries',
          JSON.stringify(['mcp:read'])
        ),
        env.AUTH_DB.prepare('INSERT INTO oauthClientResource (id,clientId,resourceId) VALUES (?,?,?)').bind(
          'fixture-client-resource',
          'fixture-client',
          `${env.BASE_URL}/mcp`
        ),
      ]);
      return Response.json({ hashMilliseconds });
    }
    return handleHostedRequest(request, env, async (subject) =>
      subject === 'portal-fixture'
        ? {
            username: 'upstream@example.invalid',
            password: 'synthetic-upstream-password',
            gymTimeZones: {},
            defaultGym: undefined,
          }
        : null
    );
  },
};
