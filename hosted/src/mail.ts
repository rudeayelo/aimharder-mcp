import type { HostedEnvironment } from './auth.js';

export type PortalMail = {
  kind: 'invitation' | 'verification' | 'recovery';
  to: string;
  url: string;
};
export function mailConfigured(env: HostedEnvironment): boolean {
  return Boolean(env.RESEND_API_KEY?.trim() && !/[\r\n]/.test(env.RESEND_API_KEY) &&
    env.MAIL_FROM?.trim() && !/[\r\n]/.test(env.MAIL_FROM));
}
/** Only this external boundary is substituted by the local harness. Never log requests/responses. */
export async function sendPortalMail(env: HostedEnvironment, message: PortalMail): Promise<void> {
  if (!mailConfigured(env)) throw new Error('Email delivery unavailable');
  const subject = {
    invitation: 'Your AimHarder MCP invitation',
    verification: 'Verify your email',
    recovery: 'Reset your portal password',
  }[message.kind];
  try {
    const body = JSON.stringify({ from: env.MAIL_FROM!, to: [message.to], subject,
      text: `${subject}\n\n${message.url}\n\nThis link expires. If you did not request it, you can ignore this message.` });
    if (new TextEncoder().encode(body).byteLength > 16_384) throw new Error('Email delivery unavailable');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(10_000),
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body,
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error('Email delivery unavailable');
    }
    // Read only a bounded success acknowledgement; never expose provider bodies.
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Email delivery unavailable');
    const decoder = new TextDecoder();
    let acknowledgement = '', bytes = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > 4096) throw new Error('Email delivery unavailable');
        acknowledgement += decoder.decode(chunk.value, { stream: true });
      }
      acknowledgement += decoder.decode();
    } finally { await reader.cancel().catch(() => {}); }
    const result: unknown = JSON.parse(acknowledgement);
    if (!result || typeof result !== 'object' || !('id' in result) ||
      typeof result.id !== 'string' || !result.id.trim() || result.id.length > 256)
      throw new Error('Email delivery unavailable');
  } catch { throw new Error('Email delivery unavailable'); }
}
