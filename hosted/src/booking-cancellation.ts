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
    description: 'Read the fresh daily schedule and prepare cancellation of one exact own booked class in a user-confirmed gym IANA zone. No reservation ID or family selector is accepted. Unsupported or ambiguous targets receive no reference. Show possible credit loss, including the published 9NBC 90-minute rule. Preparation sends no POST. Always show the exact full preview and obtain separate account-holder confirmation before execution with confirmed: true. Booking and publication preference switches do not affect this action.',
    inputSchema: bookingCancellationQuerySchema,
    outputSchema: z.object({ writeConfirmationRequired: z.boolean(), action: z.literal('cancel'), status: z.enum(['ready', 'ambiguous', 'missing', 'already-cancelled', 'unsupported']),
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
    description: 'Cancel one exact prepared booking. Recheck the reservation, send at most one standard request, then reconcile with fresh reads. A late-credit-loss warning remains pending with a new reference; do not retry automatically. Always show the exact full preview and obtain separate account-holder confirmation before execution with confirmed: true. Booking and publication preference switches do not affect this action.',
    inputSchema: bookingExecutionSchema,
    outputSchema: z.object({ writeConfirmationRequired: z.boolean().optional(), action: z.literal('cancel'), status: z.enum(['confirmed', 'rejected', 'pending-credit-loss', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']),
      credit: z.object({ possibleLoss: z.string(), balance: z.null(), entitlementPeriod: z.null() }), notices: z.array(z.string()),
      actionReference: z.string().optional(), expiresAt: z.string().optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-booking-cancellation', query, authorization));
  server.registerTool('execute_late_booking_cancellation', {
    description: 'After a fresh standard cancellation reports pending-credit-loss, show the exact still-booked target and possible credit loss, then obtain separate account-holder confirmation with confirmedCreditLoss: true. Both preference switches leave this requirement in force. Use only the new late reference, recheck the same reservation, send at most one late request and reconcile with fresh reads. Never retry an uncertain write automatically. No refund or balance is verified.',
    inputSchema: lateCancellationExecutionSchema,
    outputSchema: z.object({ writeConfirmationRequired: z.boolean().optional(), action: z.literal('cancel'), status: z.enum(['confirmed', 'rejected', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['booked', 'waitlisted', 'cancelled', 'unbooked', 'unknown']),
      credit: z.object({ possibleLoss: z.string(), balance: z.null(), entitlementPeriod: z.null() }), notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-late-booking-cancellation', query, authorization));
}
