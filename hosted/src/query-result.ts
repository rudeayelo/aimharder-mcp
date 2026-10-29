import { classifyBookingOutcome } from './booking-outcome.js';
import { classifyAccountContext, classifyError } from './telemetry.js';
import { safeError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { accountOperation } from './account-connection.js';

/** Invoke the subject-owned account queue; never interpret a query's own status. */
export async function runAccountQuery(env: HostedEnvironment, subject: string, kind: string, input: unknown, authorization?: {grantId: string; clientId: string}) {
  const started=performance.now();
  const tool=kind.replaceAll('-','_');
  try {
    const response = await accountOperation(env, subject, { kind, input, ...(authorization ? {authorization} : {}) });
    const envelope = await response.json() as { status?: string; result?: Record<string, unknown> };
    env.TELEMETRY?.tool(tool,started,classifyBookingOutcome(kind,envelope)??classifyAccountContext(envelope,response.status));
    if (!response.ok || envelope.status !== 'queried' || !envelope.result || typeof envelope.result !== 'object')
      return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(envelope) }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(envelope.result) }], structuredContent: envelope.result };
  } catch (error) {
    env.TELEMETRY?.tool(tool,started,classifyError(error));
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: safeError(error) }) }] };
  }
}
