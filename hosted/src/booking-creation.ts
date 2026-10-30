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
    description: 'Read the current daily schedule and prepare one exact class booking. Requires a user-confirmed gym IANA zone and exact class name, date, start and end time. Ambiguous, missing, already booked, waitlisted or unsupported targets receive no reference. Preparation sends no write. Read writeConfirmationRequired from preparation. Account context exposes separate bookingCreation and activityPublication settings in writeConfirmationPolicy; cancellation and deletion always require confirmation. When true, show the exact preview and obtain separate account-holder confirmation before execution with confirmed: true. When false, an explicit request for this exact action is sufficient; omit confirmed and do not ask for another confirmation. A query or preview-only request never authorizes execution.',
    inputSchema: bookingCreationQuerySchema,
    outputSchema: z.object({ writeConfirmationRequired: z.boolean(), action: z.literal('create'), status: z.enum(['ready', 'ambiguous', 'missing', 'already-booked', 'waitlisted', 'unsupported']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      alternatives: z.array(z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string(), currentState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']), eligibility: z.enum(['offered', 'unsupported']) })),
      currentState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']).optional(),
      actionReference: z.string().optional(), expiresAt: z.string().optional(), notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'prepare-booking-creation', query, authorization));
  server.registerTool('execute_booking_creation', {
    description: 'Create exactly one booking from a fresh prepare_booking_creation reference. Recheck the target and eligibility, send at most one standard write, then reconcile with fresh reads. An uncertain result requires manual inspection before a new action. Read writeConfirmationRequired from preparation. Account context exposes separate bookingCreation and activityPublication settings in writeConfirmationPolicy; cancellation and deletion always require confirmation. When true, show the exact preview and obtain separate account-holder confirmation before execution with confirmed: true. When false, an explicit request for this exact action is sufficient; omit confirmed and do not ask for another confirmation. A query or preview-only request never authorizes execution.',
    inputSchema: bookingExecutionSchema,
    outputSchema: z.object({ action: z.literal('create'), status: z.enum(['confirmed', 'rejected', 'waitlisted', 'uncertain', 'stale']),
      gym: gymSchema, target: z.object({ className: z.string(), date: dateSchema, startTime: z.string(), endTime: z.string() }),
      observedState: z.enum(['unbooked', 'booked', 'waitlisted', 'unknown']),
      notices: z.array(z.string()),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async query => runAccountQuery(env, subject, 'execute-booking-creation', query, authorization));
}
