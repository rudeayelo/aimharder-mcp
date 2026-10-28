import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { gymIdSchema } from '../../src/config.js';
import { dateSchema } from '../../src/classes.js';
import { bookingCreationQuerySchema, bookingExecutionSchema } from '../../src/booking-preparation.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
const gymSchema=z.object({id:gymIdSchema,name:z.string(),timeZone:z.string().nullable(),timeZoneStatus:z.enum(['assumed','user-confirmed'])});
export function registerBookingCreation(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
  server.registerTool('prepare_booking_creation', {
    description: 'Read the current daily schedule and prepare one exact class booking for the configured account. Requires a user-confirmed gym IANA zone and exact class name, date, start and end time. Ambiguous, missing, already booked, waitlisted or unsupported targets receive no action reference. The short-lived reference does not book a class. Show the full preview and obtain one explicit account-holder confirmation of the exact booking before execute_booking_creation.',
    inputSchema: bookingCreationQuerySchema,
    outputSchema: z.object({ action: z.literal('create'), status: z.enum(['ready', 'ambiguous', 'missing', 'already-booked', 'waitlisted', 'unsupported']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      alternatives: z.array(z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string(), currentState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']), eligibility: z.enum(['offered', 'unsupported']) })),
      currentState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']).optional(),
      actionReference: z.string().optional(), expiresAt: z.string().optional(), notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'prepare-booking-creation', query, authorization));
  server.registerTool('execute_booking_creation', {
    description: 'Create exactly one booking from a fresh prepare_booking_creation reference. The MCP client MUST show the exact gym, class and local date/time from that preview and obtain one explicit account-holder confirmation before calling with confirmed: true. A reference alone does not prove consent. Rechecks the target and sends at most one standard write, then reconciles with fresh reads. One standard creation was observed at 9NBC; other response branches remain unverified live. An uncertain result requires manual inspection before a new action.',
    inputSchema: bookingExecutionSchema,
    outputSchema: z.object({ action: z.literal('create'), status: z.enum(['confirmed', 'rejected', 'waitlisted', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']),
      notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-booking-creation', query, authorization));
}
