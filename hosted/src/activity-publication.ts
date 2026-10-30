import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { publicationExecutionSchema, publicationQuerySchema } from '../../src/activity-publication.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
export function registerActivityPublication(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
 server.registerTool('prepare_activity_publication',{
  description: 'Prepare one own activity entry from a current verified gym workout. Supply its source ID, activity date, difficulty variant and supported achieved results or actual loads. Historical RM suggestions and prescribed rounds are not achieved performance. Missing EMOM completed rounds or all achieved values return a draft without a reference. Show the source, variant, results, loads, audience, WOD TV and duplicate notices. Current role permission is required on the hosted service. Read writeConfirmationRequired from preparation. Account context exposes separate bookingCreation and activityPublication settings in writeConfirmationPolicy; cancellation and deletion always require confirmation. When true, show the exact preview and obtain separate account-holder confirmation before execution with confirmed: true. When false, an explicit request for this exact action is sufficient; omit confirmed and do not ask for another confirmation. A query or preview-only request never authorizes execution.',
  inputSchema:publicationQuerySchema,outputSchema:z.object({status:z.enum(['draft','ready','missing','unsupported'])}).passthrough(),
  annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:true},
 },query=>runAccountQuery(env,subject,'prepare-activity-publication',query,authorization));
 server.registerTool('execute_activity_publication',{
  description: 'Publish the exact fresh activity preview. Recheck source, account preferences and current hosted role permission before at most one POST, then read the own calendar/detail. An uncertain result is never retried automatically. Read writeConfirmationRequired from preparation. Account context exposes separate bookingCreation and activityPublication settings in writeConfirmationPolicy; cancellation and deletion always require confirmation. When true, show the exact preview and obtain separate account-holder confirmation before execution with confirmed: true. When false, an explicit request for this exact action is sufficient; omit confirmed and do not ask for another confirmation. A query or preview-only request never authorizes execution.',
  inputSchema:publicationExecutionSchema,outputSchema:z.object({status:z.enum(['confirmed','rejected','stale','uncertain'])}).passthrough(),
  annotations:{readOnlyHint:false,destructiveHint:false,idempotentHint:false,openWorldHint:true},
 },query=>runAccountQuery(env,subject,'execute-activity-publication',query,authorization));
}
