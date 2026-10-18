import { requireMcpAuth } from '@better-auth/mcp';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/server/validators/cf-worker';
import { z } from 'zod';
import { AimHarderClient } from '../../src/client.js';
import { gymIdSchema, type Configuration } from '../../src/config.js';
import { safeError } from '../../src/errors.js';
import { createAuth, type HostedEnvironment } from './auth.js';
import { handlePortal } from './portal.js';
import { handleInvitations } from './invitations.js';
import { participant } from './admission.js';

/** The vault resolves only the verified portal subject, never a tool argument. */
export type ResolveConnection = (portalAccountId: string) => Promise<Configuration | null>;

export async function handleHostedRequest(
  request: Request,
  env: HostedEnvironment,
  resolveConnection: ResolveConnection
): Promise<Response> {
  const auth = createAuth(env);
  if (new URL(request.url).pathname !== '/mcp') return await handleInvitations(request, env, auth) ?? await handlePortal(request, env, auth) ?? auth.handler(request);
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } });
  return requireMcpAuth(
    auth,
    async (authenticatedRequest, claims) => {
      if (!claims.sub || !await participant(env, claims.sub)) return new Response(null, { status: 403 });
      const handler = createMcpHandler(
        () => {
          const server = new McpServer(
            { name: 'aimharder-mcp-hosted', version: '0.0.0' },
            { jsonSchemaValidator: new CfWorkerJsonSchemaValidator() }
          );
          server.registerTool(
            'get_account_context',
            {
              description:
                'Query the authenticated participant’s linked AimHarder account and accessible gyms.',
              inputSchema: z.object({ gymId: gymIdSchema.optional() }).strict(),
              annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: true,
              },
            },
            async ({ gymId }) => {
              try {
                if (!claims.sub) throw new Error('Missing subject');
                const connection = await resolveConnection(claims.sub);
                if (!connection)
                  return {
                    isError: true,
                    content: [
                      {
                        type: 'text',
                        text: 'No AimHarder connection is configured for this portal account.',
                      },
                    ],
                  };
                const result = await new AimHarderClient(connection).getAccountContext(gymId);
                return {
                  content: [{ type: 'text', text: JSON.stringify(result) }],
                  structuredContent: { ...result },
                };
              } catch (error) {
                return {
                  isError: true,
                  content: [{ type: 'text', text: JSON.stringify({ error: safeError(error) }) }],
                };
              }
            }
          );
          return server;
        },
        { legacy: 'reject' }
      );
      return handler.fetch(authenticatedRequest);
    },
    { resource: `${env.BASE_URL}/mcp`, requiredScopes: ['mcp:read'] }
  )(request);
}

// The feasibility gate has no live credential vault or deployment entry configuration.
export default {
  fetch: (request: Request, env: HostedEnvironment) => handleHostedRequest(request, env, async () => null),
};
