import type { HostedEnvironment } from './auth.js';

export type PortalMail = {
  kind: 'invitation' | 'verification' | 'recovery';
  to: string;
  url: string;
};
export interface EmailSender {
  send(message: { to: string; from: string; subject: string; text: string }): Promise<unknown>;
}
export function mailConfigured(env: HostedEnvironment): boolean {
  return Boolean(env.EMAIL && env.MAIL_FROM && !/[\r\n]/.test(env.MAIL_FROM));
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
    await env.EMAIL!.send({ from: env.MAIL_FROM!, to: message.to, subject,
      text: `${subject}\n\n${message.url}\n\nThis link expires. If you did not request it, you can ignore this message.` });
  } catch { throw new Error('Email delivery unavailable'); }
}
