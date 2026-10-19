import type { HostedEnvironment } from './auth.js';
import { createAuth } from './auth.js';
import { participant } from './admission.js';
import { accountOperation } from './account-connection.js';
import { page } from './portal.js';
export async function handleAimHarderSettings(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!['/api/portal/aimharder', '/api/portal/aimharder/settings', '/aimharder', '/portal/aimharder', '/portal/aimharder/settings'].includes(path)) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !await participant(env, session.user.id)) return Response.json({ status: 'unauthorized' }, { status: session ? 403 : 401 });
  if (request.method !== 'GET' && request.method !== 'POST') return new Response(null, { status: 405 });
  if (request.method === 'POST' && request.headers.get('origin') !== new URL(env.BASE_URL).origin) return Response.json({ status: 'forbidden' }, { status: 403 });
  if (request.method === 'POST') {
    const length = Number(request.headers.get('content-length') ?? 0);
    if (length > 16_384) return Response.json({ status: 'invalid-settings' }, { status: 413 });
    let value: unknown;
    try {
      const text = await request.text();
      if (new TextEncoder().encode(text).byteLength > 16_384) return Response.json({ status: 'invalid-settings' }, { status: 413 });
      if (path.startsWith('/portal/')) {
        const form = new URLSearchParams(text);
        value = { username: form.get('username'), password: form.get('password'), ...(form.get('defaultGym') ? { defaultGym: form.get('defaultGym') } : {}), gymTimeZones: JSON.parse(form.get('gymTimeZones') || '{}') };
      } else value = JSON.parse(text);
    } catch { return Response.json({ status: 'invalid-settings' }, { status: 400 }); }
    const result = await accountOperation(env, session.user.id, { kind: path.endsWith('/settings') ? 'settings' : 'connect', input: value });
    if (path.startsWith('/api/')) return result;
    if (result.ok) return new Response(null, { status: 303, headers: { location: '/aimharder' } });
    const outcome = await result.json() as { status: string; gyms?: { id: string }[] };
    return page('Connection not saved', `<p>${outcome.status === 'default-gym-required' ? 'Select a verified default gym and submit your credentials again.' : 'Check your credentials and gym settings. An existing connection cannot be replaced yet.'}</p><a href="/aimharder">Connection settings</a>`, result.status);
  }
  const result = await accountOperation(env, session.user.id, { kind: 'status' });
  if (path === '/api/portal/aimharder') return result;
  const outcome = await result.json() as { status: string; gyms?: { id: string; name: string; timeZone: string; timeZoneStatus: string }[] };
  const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]!);
  return page('AimHarder connection', `<p>Status: ${escape(outcome.status)}.</p>${outcome.gyms ? `<ul>${outcome.gyms.map(gym => `<li>${escape(gym.name)} (${escape(gym.id)}), ${escape(gym.timeZone)} (${escape(gym.timeZoneStatus)})</li>`).join('')}</ul>` : ''}${outcome.status === 'not-connected' ? '<p>Your AimHarder email may differ from your portal email. Credentials are encrypted and recoverable by the service. AI clients do not receive them.</p><form method="post" action="/portal/aimharder"><label>AimHarder email<input name="username" type="email" required autocomplete="off"></label><label>AimHarder password<input name="password" type="password" required autocomplete="off"></label><label>Default gym ID (required for multiple gyms)<input name="defaultGym"></label><label>Confirmed gym zones (JSON gym ID to IANA zone)<input name="gymTimeZones" value="{}"></label><button>Connect AimHarder</button></form>' : ''}`);
}
