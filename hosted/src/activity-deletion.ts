import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { activityDeletionQuerySchema,activityDeletionExecutionSchema } from '../../src/activity-deletion.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
export function registerActivityDeletion(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
  server.registerTool('prepare_activity_deletion',{
    description:'Prepare a read-only exact preview of one existing own activity entry from the authenticated calendar. Verifies owner, gym and date; an arbitrary sourceActivityId alone cannot select another account. Shows exact content, coverage, possible irreversible loss, no backup or undo, and unknown RM effects. Requires current activity deletion permission. The short-lived reference does not establish account-holder consent and never sends DELETE.',
    inputSchema:activityDeletionQuerySchema,
    outputSchema:z.object({status:z.enum(['ready','missing','ambiguous','incomplete','foreign-owner','foreign-gym','unsupported'])}).passthrough(),
    annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:true},
  },async query=>runAccountQuery(env,subject,'prepare-activity-deletion',query,authorization));
  server.registerTool('execute_activity_deletion',{
    description:'Delete the exact own entry from a fresh prepare_activity_deletion reference only after showing the complete preview and obtaining separate explicit account-holder confirmation. Supply its exact sourceActivityId and confirmed:true. Rechecks current role permission, owner, gym, membership and unchanged entry immediately before at most one DELETE; fresh own calendar/detail reads report absence, continued visibility or uncertainty. Never automatically retry an uncertain attempt. Absence does not prove permanence or RM effects.',
    inputSchema:activityDeletionExecutionSchema,
    outputSchema:z.object({status:z.enum(['stale','observed-absent','still-visible','conflicting-identity','incomplete','uncertain'])}).passthrough(),
    annotations:{readOnlyHint:false,destructiveHint:true,idempotentHint:false,openWorldHint:true},
  },async query=>runAccountQuery(env,subject,'execute-activity-deletion',query,authorization));
}
