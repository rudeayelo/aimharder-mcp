import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { activityDeletionQuerySchema,activityDeletionExecutionSchema } from '../../src/activity-deletion.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
export function registerActivityDeletion(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
  server.registerTool('prepare_activity_deletion',{
    description: 'Prepare a read-only preview of one exact own calendar entry. Verify owner, gym, date and content; arbitrary IDs do not select another account. Show coverage, possible irreversible loss, no backup or undo and unknown RM-history effects. Current hosted role permission is required. Preparation never sends DELETE. Always show the exact full preview and obtain separate account-holder confirmation before execution with confirmed: true. Booking and publication preference switches do not affect this action.',
    inputSchema:activityDeletionQuerySchema,
    outputSchema:z.object({status:z.enum(['ready','missing','ambiguous','incomplete','foreign-owner','foreign-gym','unsupported'])}).passthrough(),
    annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:false,openWorldHint:true},
  },async query=>runAccountQuery(env,subject,'prepare-activity-deletion',query,authorization));
  server.registerTool('execute_activity_deletion',{
    description: 'Delete the exact own entry using a fresh prepare_activity_deletion reference and its sourceActivityId. Recheck owner, gym, date, content and current hosted role permission before at most one DELETE, then read the own calendar/detail. Absence does not prove permanence or RM effects. Never retry an uncertain write automatically. Always show the exact full preview and obtain separate account-holder confirmation before execution with confirmed: true. Booking and publication preference switches do not affect this action.',
    inputSchema:activityDeletionExecutionSchema,
    outputSchema:z.object({status:z.enum(['stale','observed-absent','still-visible','conflicting-identity','incomplete','uncertain'])}).passthrough(),
    annotations:{readOnlyHint:false,destructiveHint:true,idempotentHint:false,openWorldHint:true},
  },async query=>runAccountQuery(env,subject,'execute-activity-deletion',query,authorization));
}
