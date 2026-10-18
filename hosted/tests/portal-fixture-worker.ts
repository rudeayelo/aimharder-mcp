import entry from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export default {
  async fetch(request: Request, env: HostedEnvironment) {
    if (new URL(request.url).pathname === '/__fixture') {
      const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('synthetic-owner-invitation'))), byte => byte.toString(16).padStart(2, '0')).join('');
      await env.AUTH_DB.prepare('INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,role,createdAt) VALUES (?,?,?,?,?,?)')
        .bind('owner-bootstrap', 'owner@example.invalid', digest, Date.now() + 86_400_000, 'admin', Date.now()).run();
      return new Response(null);
    }
    return entry.fetch(request, { ...env, EMAIL: {
      async send(message) {
        const response = await fetch('https://synthetic-mail.invalid/send', { method: 'POST', body: JSON.stringify(message) });
        if (!response.ok) throw new Error('Synthetic mail delivery unavailable');
      },
    } });
  },
};
