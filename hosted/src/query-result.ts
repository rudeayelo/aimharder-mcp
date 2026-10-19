import { safeError } from '../../src/errors.js';
import type { HostedEnvironment } from './auth.js';
import { accountOperation } from './account-connection.js';

/** Invoke the subject-owned account queue; never interpret a query's own status. */
export async function runAccountQuery(env: HostedEnvironment, subject: string, kind: string, input: unknown) {
  try {
    const response = await accountOperation(env, subject, { kind, input });
    const envelope = await response.json() as { status?: string; result?: Record<string, unknown> };
    if (!response.ok || envelope.status !== 'queried' || !envelope.result || typeof envelope.result !== 'object')
      return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(envelope) }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(envelope.result) }], structuredContent: envelope.result };
  } catch (error) {
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: safeError(error) }) }] };
  }
}
