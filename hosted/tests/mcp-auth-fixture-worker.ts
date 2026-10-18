// Disposable synthetic setup only; never included in the deployed Worker.
import feasibilityFixture from './fixture-worker.js';
import { handleHostedRequest } from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
function pauseBeforeRevocationBatch(database: D1Database): D1Database {
  return new Proxy(database, { get(target, property) {
    if (property === 'batch') return async (statements: D1PreparedStatement[]) => {
      await fetch('https://synthetic-scheduler.invalid/revocation-batch');
      return target.batch(statements);
    };
    const value = Reflect.get(target, property);
    return typeof value === 'function' ? value.bind(target) : value;
  } });
}
// Scheduling only: pause at real D1 writes, never replace authorization data.
function pauseBeforeAuthorizationWrite(database: D1Database, kind: 'consent' | 'code'): D1Database {
  const insert = kind === 'consent' ? /\binsert\s+into\s+["`]?oauthConsent["`]?/i : /\binsert\s+into\s+["`]?verification["`]?/i;
  function statementProxy(statement: D1PreparedStatement, sql: string): D1PreparedStatement {
    return new Proxy(statement, { get(target, property) {
      if (property === 'bind') return (...values: unknown[]) => statementProxy(target.bind(...values), sql);
      const value = Reflect.get(target, property);
      if (typeof value !== 'function') return value;
      return async (...args: unknown[]) => {
        if (insert.test(sql)) await fetch(`https://synthetic-scheduler.invalid/${kind}-write`);
        return Reflect.apply(value, target, args);
      };
    } });
  }
  return new Proxy(database, { get(target, property) {
    if (property === 'prepare') return (sql: string) => statementProxy(target.prepare(sql), sql);
    const value = Reflect.get(target, property);
    return typeof value === 'function' ? value.bind(target) : value;
  } });
}
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
    const delayedCode = new URL(request.url).pathname === '/api/auth/oauth2/consent' && request.headers.has('x-fixture-pause-code');
    const delayedRevoke = new URL(request.url).pathname.endsWith('/revoke') && request.headers.has('x-fixture-pause-revocation');
    const delayedConsent = new URL(request.url).pathname === '/api/auth/oauth2/consent' && request.headers.has('x-fixture-pause-consent-write');
    const database = delayedCode ? pauseBeforeAuthorizationWrite(env.AUTH_DB, 'code') : delayedRevoke ? pauseBeforeRevocationBatch(env.AUTH_DB) : delayedConsent ? pauseBeforeAuthorizationWrite(env.AUTH_DB, 'consent') : env.AUTH_DB;
    return handleHostedRequest(request, { ...env, AUTH_DB: database }, async () => null);
  },
};
