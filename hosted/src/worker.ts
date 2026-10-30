import { createTelemetry, classifyAccountContext, classifyError } from './telemetry.js';
import { requireMcpAuth } from '@better-auth/mcp';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/server/validators/cf-worker';
import { z } from 'zod';
import { AimHarderClient } from '../../src/client.js';
import { gymIdSchema, type Configuration } from '../../src/config.js';
import { safeError } from '../../src/errors.js';
import { createAuth, type HostedEnvironment } from './auth.js';
import { handleActivityPolicy } from './activity-policy.js';
import {maintainDeletedAccounts} from './recovery-maintenance.js';
import { handleAccountDeletion } from './account-deletion.js';
import { acquireRecoveryLease, releaseRecoveryLease } from './recovery-authority.js';
import { handleIdentity } from './identity.js';
import { handlePortal } from './portal.js';
import { handleParticipants } from './participants.js';
import { handleInvitations } from './invitations.js';
import { participant } from './admission.js';
import { currentGrant, grantClaim } from './oauth-grants.js';
import { handleConnections } from './connections.js';
import {recordDeletedMemoryErased} from './recovery-authority.js';
import { accountOperation,eraseDeletedAccountMemory } from './account-connection.js';
import { registerActivityPublication } from './activity-publication.js';
import { registerBookingCancellation } from './booking-cancellation.js';
import { registerActivityDeletion } from './activity-deletion.js';
import { registerBookingCreation } from './booking-creation.js';
import { registerActivityQueries } from './activity-queries.js';
import { registerScheduleQueries } from './schedule-queries.js';
import { handleAimHarderSettings } from './aimharder-settings.js';
export { AccountConnection } from './account-connection.js';

/** Retained feasibility-harness adapter; production uses the private account object. */
export type ResolveConnection = (portalAccountId: string) => Promise<Configuration | null>;

async function dispatchHostedRequest(
  request: Request,
  env: HostedEnvironment,
  resolveConnection?: ResolveConnection
): Promise<Response> {
  const auth = createAuth(env);
  // Internal handlers need the maintained session getter to apply their own
  // admission/status response. The public getter receives the same live gate.
  if (new URL(request.url).pathname.replace(/\/$/, '') === '/api/auth/get-session') {
    const session = await auth.api.getSession({ headers: request.headers });
    if (session && !await participant(env, session.user.id)) return Response.json({ message: 'Portal access is unavailable.' }, { status: 403, headers: { 'cache-control': 'no-store' } });
  }
  if (new URL(request.url).pathname !== '/mcp') return await handleAccountDeletion(request, env, auth) ?? await handleParticipants(request, env, auth) ?? await handleActivityPolicy(request, env, auth) ?? await handleAimHarderSettings(request, env, auth) ?? await handleConnections(request, env, auth) ?? await handleIdentity(request, env, auth) ?? await handleInvitations(request, env, auth) ?? await handlePortal(request, env, auth) ?? auth.handler(request);
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } });
  return requireMcpAuth(
    auth,
    async (authenticatedRequest, claims) => {
      if (!await currentGrant(env, claims[grantClaim], claims.sub, claims.client_id)) return new Response(null, { status: 401, headers: { 'www-authenticate': `Bearer error="invalid_token", resource_metadata="${env.BASE_URL}/.well-known/oauth-protected-resource/mcp"` } });
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
              const started=performance.now();
              let outcome: import('./telemetry.js').Classification={outcome:'unclassified'};
              try {
                if (!claims.sub) throw new Error('Missing subject');
                if (!resolveConnection) {
                  const response = await accountOperation(env, claims.sub, { kind: 'context', ...(gymId ? { gymId } : {}) });
                  const result = await response.json() as Record<string, unknown>;
                  outcome=classifyAccountContext(result,response.status);
                  if (!response.ok || result.status !== 'connected') return { isError: true, content: [{ type: 'text', text: JSON.stringify(result) }] };
                  const { status: _status, ...context } = result;
                  return { content: [{ type: 'text', text: JSON.stringify(context) }], structuredContent: context };
                }
                const connection = await resolveConnection(claims.sub);
                if (!connection) {
                  outcome={outcome:'denied',code:'NOT_CONNECTED'};
                  return {
                    isError: true,
                    content: [
                      {
                        type: 'text',
                        text: 'No AimHarder connection is configured for this portal account.',
                      },
                    ],
                  };
                }
                const result = await new AimHarderClient(connection).getAccountContext(gymId);
                outcome={outcome:'success'};
                return {
                  content: [{ type: 'text', text: JSON.stringify(result) }],
                  structuredContent: { ...result },
                };
              } catch (error) {
                outcome=classifyError(error);
                return {
                  isError: true,
                  content: [{ type: 'text', text: JSON.stringify({ error: safeError(error) }) }],
                };
              } finally { env.TELEMETRY?.tool('get_account_context',started,outcome); }
            }
          );
          if (!resolveConnection && claims.sub) {
            registerScheduleQueries(server, env, claims.sub);
            registerActivityQueries(server, env, claims.sub);
            registerActivityPublication(server, env, claims.sub, {grantId:String(claims[grantClaim]),clientId:String(claims.client_id)});
            registerBookingCancellation(server, env, claims.sub, {grantId:String(claims[grantClaim]),clientId:String(claims.client_id)});
            registerActivityDeletion(server,env,claims.sub,{grantId:String(claims[grantClaim]),clientId:String(claims.client_id)});
            registerBookingCreation(server, env, claims.sub, {grantId:String(claims[grantClaim]),clientId:String(claims.client_id)});
          }
          return server;
        },
        { legacy: 'reject' }
      );
      return handler.fetch(authenticatedRequest);
    },
    { resource: `${env.BASE_URL}/mcp`, requiredScopes: ['mcp:access'] }
  )(request);
}

export async function handleHostedRequest(request:Request,env:HostedEnvironment,resolveConnection?:ResolveConnection,ctx?:Pick<ExecutionContext,'waitUntil'>):Promise<Response>{
  const started=performance.now();
  const telemetry=ctx?createTelemetry(env):undefined;
  let response:Response|undefined;
  let thrown=false;
  try {
    let lease:string|null;
    try{lease=await acquireRecoveryLease(env,null);}catch{telemetry?.httpOutcome({outcome:'technical_failure',code:'RECOVERY_UNAVAILABLE'});return response=Response.json({error:'Service recovery is unavailable.'},{status:503});}
    if(!lease){telemetry?.httpOutcome({outcome:'technical_failure',code:'RECOVERY_UNAVAILABLE'});return response=Response.json({error:'Service recovery is unavailable.'},{status:503});}
    try{return response=await dispatchHostedRequest(request,{...env,RECOVERY_LEASE:lease,...(telemetry?{TELEMETRY:telemetry}:{})},resolveConnection);}
    finally{await releaseRecoveryLease(env,lease);}
  }catch(error){thrown=true;throw error;}
  finally{if(telemetry){telemetry.http(request,started,thrown?undefined:response,thrown);ctx!.waitUntil(telemetry.flush());}}
}

export default {
  scheduled:async(_controller:ScheduledController,env:HostedEnvironment,ctx:ExecutionContext)=>{
    const telemetry=createTelemetry(env);
    const mainStarted=performance.now();
    let result:Awaited<ReturnType<typeof maintainDeletedAccounts>>;
    try{result=await maintainDeletedAccounts(env);}
    catch(error){
      telemetry?.maintenance('main',mainStarted,{outcome:'technical_failure',code:'MAINTENANCE_MAIN_FAILED'});
      if(telemetry)ctx.waitUntil(telemetry.flush());
      throw error;
    }
    telemetry?.maintenance('main',mainStarted,result.status==='ok'?{outcome:'success'}:
      result.status==='failed'?{outcome:'technical_failure',code:'MAINTENANCE_MAIN_FAILED'}:
      result.status==='overdue'?{outcome:'technical_failure',code:'MAINTENANCE_OVERDUE'}:{outcome:'unclassified'});
    const memoryStarted=performance.now();
    const deferred=(async()=>{
      const memory=await Promise.allSettled(result.memoryPurgeSubjects.map(async subject=>{await eraseDeletedAccountMemory(env,subject);await recordDeletedMemoryErased(env,subject);}));
      const failed=memory.some(outcome=>outcome.status==='rejected');
      telemetry?.maintenance('memory',memoryStarted,failed?{outcome:'technical_failure',code:'MAINTENANCE_MEMORY_FAILED'}:{outcome:'success'});
      if(failed)throw new Error('Deleted account memory cleanup requires operator attention');
    })();
    // Preserve the application's original rejection independently of bounded export.
    ctx.waitUntil(deferred);
    if(telemetry)ctx.waitUntil(deferred.then(()=>telemetry.flush(),()=>telemetry.flush()));
    if(result.status!=='ok')throw new Error('Recovery cleanup requires operator attention');
  },
  fetch: (request: Request, env: HostedEnvironment,ctx?:ExecutionContext) => handleHostedRequest(request, env,undefined,ctx),
};
