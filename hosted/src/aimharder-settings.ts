import { classifyAccountContext } from './telemetry.js';
import type { Gym } from '../../src/client.js';
import type { HostedEnvironment } from './auth.js';
import { createAuth } from './auth.js';
import { participant } from './admission.js';
import { accountOperation } from './account-connection.js';
import { page } from './portal.js';

/** Only the private account object's known envelope is classified. Failure to
 * observe it must never change the original API response or portal behavior. */
async function observeAccountResponse(env:HostedEnvironment,response:Response){
  if(!env.TELEMETRY || response.ok)return;
  try{
    const envelope=await response.clone().json() as Record<string,unknown>;
    env.TELEMETRY.httpOutcome(classifyAccountContext(envelope,response.status));
  }catch{env.TELEMETRY.httpOutcome({outcome:'unclassified'});}
}
function escape(value: string) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
function replacementForm(): string {
  return `<h2>Update AimHarder password</h2><p>Keep the same verified AimHarder identity, gym settings and AI client authorizations. Old sessions and prepared actions are discarded.</p><form method="post" action="/portal/aimharder/password"><label>New AimHarder password<input name="password" type="password" required autocomplete="off" maxlength="4096"></label><button>Update AimHarder password</button></form><h2>Replace AimHarder account</h2><p>Verify the new account before replacing the current connection. Existing AI client authorizations are retained. Previous sessions and prepared actions are discarded. Earlier operations finish against their original account before this change completes.</p><form method="post" action="/portal/aimharder/replace"><label>New AimHarder email<input name="username" type="email" required autocomplete="off" maxlength="512"></label><label>New AimHarder password<input name="password" type="password" required autocomplete="off" maxlength="4096"></label><button>Replace AimHarder account</button></form><h2>Disconnect AimHarder</h2><p>Remove stored AimHarder credentials, sessions and preparations. This does not cancel bookings or delete activity. Your portal account and AI client authorizations are retained.</p><form method="post" action="/portal/aimharder/disconnect"><button>Disconnect AimHarder</button></form>`;
}
function settingsForm(gyms: Gym[], connected: boolean, selected?: string, replacing = false, policy = { bookingCreation: true, activityPublication: true }): string {
  return `<form method="post" action="/portal/aimharder${connected ? '/settings' : replacing ? '/replace' : ''}">${connected ? '' : '<label>AimHarder email<input name="username" type="email" required autocomplete="off" maxlength="512"></label><label>AimHarder password<input name="password" type="password" required autocomplete="off" maxlength="4096"></label>'}${gyms.length ? `<label>Default gym<select name="defaultGym" required>${selected ? '' : '<option value="" selected disabled>Choose a default gym</option>'}${gyms.map(gym => `<option value="${escape(gym.id)}"${gym.id === selected ? ' selected' : ''}>${escape(gym.name)} (${escape(gym.id)})</option>`).join('')}</select></label><p>Confirm each gym’s IANA time zone, such as Europe/Madrid. Leave it blank to retain the explicitly assumed Europe/Madrid zone.</p>${gyms.map(gym => `<label>${escape(gym.name)} time zone<input name="zone:${escape(gym.id)}" value="${gym.timeZoneStatus === 'user-confirmed' ? escape(gym.timeZone ?? '') : ''}" maxlength="100"></label>`).join('')}` : ''}<input type="hidden" name="bookingConfirmationPresent" value="1"><input type="hidden" name="publicationConfirmationPresent" value="1"><label class="confirmation-switch"><span>Ask for confirmation when making a reservation</span><input type="checkbox" role="switch" name="requireBookingConfirmation" value="true"${policy.bookingCreation ? ' checked' : ''}></label><label class="confirmation-switch"><span>Ask for confirmation when posting a new workout</span><input type="checkbox" role="switch" name="requirePublicationConfirmation" value="true"${policy.activityPublication ? ' checked' : ''}></label><p>These preferences apply to all your MCP clients. Cancellations and deletions always require confirmation.</p><button>${connected ? 'Save settings' : replacing ? 'Replace AimHarder account' : 'Connect AimHarder'}</button></form>`;
}
async function boundedText(request: Request): Promise<string> {
  if (Number(request.headers.get('content-length') ?? 0) > 16_384 || !request.body) throw new Error('Invalid body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16_384) { await reader.cancel(); throw new Error('Invalid body'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
export async function handleAimHarderSettings(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!['/api/portal/aimharder', '/api/portal/aimharder/settings', '/aimharder', '/portal/aimharder', '/portal/aimharder/settings', '/api/portal/aimharder/replace', '/portal/aimharder/replace', '/api/portal/aimharder/disconnect', '/portal/aimharder/disconnect', '/api/portal/aimharder/password', '/portal/aimharder/password'].includes(path)) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !await participant(env, session.user.id)) return Response.json({ status: 'unauthorized' }, { status: session ? 403 : 401 });
  if (!['GET', 'POST'].includes(request.method) || request.method === 'GET' && path !== '/api/portal/aimharder' && path !== '/aimharder') return new Response(null, { status: 405 });
  if (request.method === 'POST' && request.headers.get('origin') !== new URL(env.BASE_URL).origin) return Response.json({ status: 'forbidden' }, { status: 403 });
  if (request.method === 'POST') {
    let value: unknown;
    try {
      const text = await boundedText(request);
      if (path.startsWith('/portal/')) {
        const form = new URLSearchParams(text);
        const gymTimeZones = Object.fromEntries([...form.entries()].filter(([name, zone]) => name.startsWith('zone:') && zone.trim()).map(([name, zone]) => [name.slice(5), zone.trim()]));
        value = path.endsWith('/password') ? {password:form.get('password')} : path.endsWith('/disconnect') ? {} : { ...(path.endsWith('/settings') ? {} : { username: form.get('username'), password: form.get('password') }), ...(form.get('defaultGym') ? { defaultGym: form.get('defaultGym') } : {}), gymTimeZones, ...(form.has('bookingConfirmationPresent') ? { requireBookingConfirmation: !form.has('requireBookingConfirmation') ? false : form.get('requireBookingConfirmation') === 'true' ? true : null } : {}), ...(form.has('publicationConfirmationPresent') ? { requirePublicationConfirmation: !form.has('requirePublicationConfirmation') ? false : form.get('requirePublicationConfirmation') === 'true' ? true : null } : {}) };
      } else value = JSON.parse(text);
    } catch { return Response.json({ status: 'invalid-settings' }, { status: 400 }); }
    const result = await accountOperation(env, session.user.id, { kind: path.endsWith('/settings') ? 'settings' : path.endsWith('/replace') ? 'replace' : path.endsWith('/disconnect') ? 'disconnect' : path.endsWith('/password') ? 'password' : 'connect', input: value }).then(response => new Response(response.body, response));
    await observeAccountResponse(env,result);
    result.headers.set('cache-control', 'no-store');
    if (path.startsWith('/api/')) return result;
    if (result.ok) return new Response(null, { status: 303, headers: { location: '/aimharder', 'cache-control': 'no-store' } });
    const outcome = await result.json() as { status: string; gyms?: Gym[]; writeConfirmationPolicy?: { bookingCreation: boolean; activityPublication: boolean } };
    const retainedConnection = path.endsWith('/settings');
    return page('Connection not saved', outcome.status === 'default-gym-required'
      ? `<p>${retainedConnection ? 'Select a verified default gym and optionally confirm its zone. Your stored credentials are retained.' : 'Select a verified default gym, optionally confirm its zone, and submit your credentials again. The submitted credentials have not been stored; any existing connection is retained.'}</p>${settingsForm(outcome.gyms ?? [], retainedConnection, undefined, path.endsWith('/replace'), outcome.writeConfirmationPolicy ?? { bookingCreation: true, activityPublication: true })}`
      : '<p>Check your credentials and gym settings. Your existing connection is retained when a change fails.</p><a href="/aimharder">Connection settings</a>', result.status);
  }
  const result = await accountOperation(env, session.user.id, { kind: 'status' }).then(response => new Response(response.body, response));
  await observeAccountResponse(env,result);
  result.headers.set('cache-control', 'no-store');
  if (path === '/api/portal/aimharder') return result;
  const outcome = await result.json() as { status: string; gyms?: Gym[]; selectedGym?: Gym; writeConfirmationPolicy?: { bookingCreation: boolean; activityPublication: boolean } };
  return page('AimHarder connection', `<p>Status: ${escape(outcome.status)}.</p>${outcome.gyms ? `<ul>${outcome.gyms.map(gym => `<li>${escape(gym.name)} (${escape(gym.id)}), ${escape(gym.timeZone ?? '')} (${escape(gym.timeZoneStatus)})</li>`).join('')}</ul>` : ''}${outcome.status === 'selection-required' ? '<p>Your memberships changed. Select a current default gym and confirm its zone. Your stored AimHarder credentials are retained.</p>' : ''}${outcome.status === 'connected' || outcome.status === 'selection-required' ? settingsForm(outcome.gyms ?? [], true, outcome.selectedGym?.id, false, outcome.writeConfirmationPolicy ?? { bookingCreation: true, activityPublication: true }) + replacementForm() : outcome.status === 'not-connected' ? `<p>Your AimHarder email may differ from your portal email. Credentials are encrypted and recoverable by the service. AI clients do not receive them.</p>${settingsForm([], false)}` : '<p>Account access could not be verified. Check your AimHarder access or contact the service operator.</p>' + replacementForm()}`);
}
