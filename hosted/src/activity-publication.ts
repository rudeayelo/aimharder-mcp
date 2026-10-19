import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { publicationExecutionSchema, publicationQuerySchema } from '../../src/activity-publication.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
export function registerActivityPublication(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
 server.registerTool('prepare_activity_publication',{
  description:'Prepare one own activity result from a verified gym source, date and difficulty variant. Current role permission is required. With no supported result or actual load, return a draft without an action reference. Historical RM suggestions are not achieved loads. Show the full ready preview including source, variant, date, structured results, actual loads, audience, WOD TV and duplicate notices, then obtain separate exact account-holder confirmation.',
  inputSchema:publicationQuerySchema,outputSchema:z.object({status:z.enum(['draft','ready','missing','unsupported'])}).passthrough(),
  annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:true},
 },query=>runAccountQuery(env,subject,'prepare-activity-publication',query,authorization));
 server.registerTool('execute_activity_publication',{
  description:'Publish the exact fresh activity preview after separate account-holder confirmation. Rechecks current role permission, source, audience and connection before at most one POST, then reads the own calendar/detail. Duplicate acknowledgement does not replace confirmation. An uncertain outcome requires manual inspection; no possibly sent write is retried.',
  inputSchema:publicationExecutionSchema,outputSchema:z.object({status:z.enum(['confirmed','rejected','stale','uncertain'])}).passthrough(),
  annotations:{readOnlyHint:false,destructiveHint:false,idempotentHint:false,openWorldHint:true},
 },query=>runAccountQuery(env,subject,'execute-activity-publication',query,authorization));
}
