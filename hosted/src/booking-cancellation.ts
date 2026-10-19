import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { gymIdSchema } from '../../src/config.js';
import { dateSchema } from '../../src/classes.js';
import { bookingCancellationQuerySchema, bookingExecutionSchema, lateCancellationExecutionSchema } from '../../src/booking-preparation.js';
import type { HostedEnvironment } from './auth.js';
import { runAccountQuery } from './query-result.js';
const gymSchema=z.object({id:gymIdSchema,name:z.string(),timeZone:z.string().nullable(),timeZoneStatus:z.enum(['assumed','user-confirmed'])});
export function registerBookingCancellation(server:McpServer,env:HostedEnvironment,subject:string,authorization:{grantId:string;clientId:string}){
  server.registerTool('prepare_booking_cancellation', {
    description: 'Read the configured account’s fresh daily schedule and prepare cancellation of one exact booked class. Requires a user-confirmed gym IANA zone. Matches the schedule reservation internally; no reservation ID or family selector is accepted. Ambiguous, missing, cancelled, waitlisted, or unsupported targets receive no executable reference. At 9NBC, show the published 90-minute credit-loss risk before any cancellation request. Show the full preview and obtain explicit account-holder confirmation before execute_booking_cancellation. This preview sends no cancellation POST.',
    inputSchema: bookingCancellationQuerySchema,
    outputSchema: z.object({ action: z.literal('cancel'), status: z.enum(['ready', 'ambiguous', 'missing', 'already-cancelled', 'unsupported']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      alternatives: z.array(z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string(),
        currentState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']), eligibility: z.enum(['offered', 'unsupported']) })),
      currentState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']).optional(),
      credit: z.object({ possibleLoss: z.string(), balance: z.null(), entitlementPeriod: z.null() }).optional(),
      actionReference: z.string().optional(), expiresAt: z.string().optional(), notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'prepare-booking-cancellation', query, authorization));
  server.registerTool('execute_booking_cancellation', {
    description: 'Cancel one exact prepared booking. The MCP client MUST show the gym, class, local date/time, current booked state and possible credit loss from the preview, then obtain explicit account-holder confirmation before calling with confirmed: true. A reference alone does not prove consent. Rechecks the reservation, sends at most one standard cancellation request, then reconciles with fresh reads. A late-credit-loss warning remains pending; never retry automatically. One standard cancellation was observed at 9NBC; late and other response branches remain unverified live.',
    inputSchema: bookingExecutionSchema,
    outputSchema: z.object({ action: z.literal('cancel'), status: z.enum(['confirmed', 'rejected', 'pending-credit-loss', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']),
      credit: z.object({ possibleLoss: z.string(), balance: z.null(), entitlementPeriod: z.null() }), notices: z.array(z.string()),
      actionReference: z.string().optional(), expiresAt: z.string().optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-booking-cancellation', query, authorization));
  server.registerTool('execute_late_booking_cancellation', {
    description: 'After execute_booking_cancellation reports pending-credit-loss, the MCP client MUST show its exact gym, class, local date/time, still-booked state and possible lost credit, then obtain a SEPARATE explicit account-holder confirmation of that consequence. Only then call with the NEW actionReference and confirmedCreditLoss: true. Rechecks the same reservation, sends at most one late request, and reconciles by reading. Never retry automatically. No refund or balance is verified.',
    inputSchema: lateCancellationExecutionSchema,
    outputSchema: z.object({ action: z.literal('cancel'), status: z.enum(['confirmed', 'rejected', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']),
      credit: z.object({ possibleLoss: z.string(), balance: z.null(), entitlementPeriod: z.null() }), notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-late-booking-cancellation', query, authorization));
}
