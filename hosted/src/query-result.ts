import { classifyActivityOutcome } from './activity-outcome.js';
import { classifyBookingOutcome } from './booking-outcome.js';
import { classifyReadOutcome, queryToolNames } from './query-outcome.js';
import { classifyAccountContext, classifyError, type Classification } from './telemetry.js';
import { safeError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { accountOperation } from './account-connection.js';

/** Classify trusted parsed account state before serializing the unchanged MCP result. */
export async function runAccountQuery(env: HostedEnvironment, subject: string, kind: string, input: unknown, authorization?: {grantId: string; clientId: string}) {
  const started=performance.now();
  let classification:Classification={outcome:'unclassified'};
  try {
    const response = await accountOperation(env, subject, { kind, input, ...(authorization ? {authorization} : {}) });
    const envelope = await response.json() as { status?: string; result?: Record<string, unknown> };
    classification = envelope.status==='queried' && envelope.result && typeof envelope.result==='object' && !Array.isArray(envelope.result)
      ? classifyReadOutcome(kind,envelope.result) ?? classifyBookingOutcome(kind,envelope) ?? classifyActivityOutcome(kind,envelope.result) ?? {outcome:'unclassified'}
      : classifyAccountContext(envelope,response.status);
    if (!response.ok || envelope.status !== 'queried' || !envelope.result || typeof envelope.result !== 'object')
      return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(envelope) }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(envelope.result) }], structuredContent: envelope.result };
  } catch (error) {
    classification=classifyError(error);
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: safeError(error) }) }] };
  } finally {
    const name=queryToolNames[kind];
    if(name)env.TELEMETRY?.tool(name,started,classification);
  }
}
