import type { createAuth, HostedEnvironment } from './auth.js';
import { participant } from './admission.js';
import { revokeClient } from './oauth-grants.js';
import { page } from './portal.js';
function escape(value: string) { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!); }

export async function handleConnections(request: Request, env: HostedEnvironment, auth: ReturnType<typeof createAuth>): Promise<Response | null> {
  const url = new URL(request.url);
  const revoke = /^\/(?:api\/)?portal\/connections\/([^/]+)\/revoke$/.exec(url.pathname);
  if (!revoke && !['/connect-clients', '/connections', '/api/portal/connections', '/consent', '/portal/oauth/consent'].includes(url.pathname)) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Sign in to the portal.' }, { status: 401 });
  if (!await participant(env, session.user.id)) return Response.json({ error: 'Portal access is unavailable.' }, { status: 403 });
  if (url.pathname === '/connect-clients' && request.method === 'GET') return page('Connect ChatGPT or Hermes', `<p>MCP server URL: <code>${escape(env.BASE_URL)}/mcp</code></p><p>Ask the service operator for your approved client ID and exact callback configuration. Select OAuth with a provided public client, no client secret, and scopes <code>openid profile offline_access mcp:access</code>.</p><p>In ChatGPT, add a custom MCP server from Plugins and select the provided OAuth client. Use the callback shown by the connection management page. If the UI does not offer provided clients, stop and contact the operator.</p><p>In Hermes, set the remote server URL, <code>auth: oauth</code>, <code>oauth.client_id</code>, <code>oauth.redirect_host</code> and the approved <code>oauth.redirect_port</code>, then run <code>hermes mcp login aimharder</code> in a fresh terminal.</p><p>Sign in to this portal and review the client consent screen. Before your AimHarder account is connected, account queries return a not-connected result.</p><p>Refresh is automatic in compatible clients. To disconnect one client, open <a href="/connections">Connected MCP clients</a>. Your other clients and portal account remain available.</p>`);
  if (revoke && request.method === 'POST') {
    if (request.headers.get('origin') !== new URL(env.BASE_URL).origin) return new Response(null, { status: 403 });
    let clientId: string;
    try { clientId = decodeURIComponent(revoke[1]!); } catch { return new Response(null, { status: 400 }); }
    if (clientId.length > 256) return new Response(null, { status: 400 });
    await revokeClient(env, session.user.id, clientId);
    return url.pathname.startsWith('/api/') ? new Response(null, { status: 204 }) : new Response(null, { status: 303, headers: { location: '/connections' } });
  }
  if (url.pathname === '/consent' && request.method === 'GET') {
    const client = await env.AUTH_DB.prepare('SELECT name,redirectUris FROM oauthClient WHERE clientId=? AND COALESCE(disabled,0)=0').bind(url.searchParams.get('client_id') ?? '').first<{ name: string; redirectUris: string }>();
    const redirectUri = url.searchParams.get('redirect_uri') ?? '';
    let callback: URL;
    try {
      const registered = client && JSON.parse(client.redirectUris);
      if (!client || !Array.isArray(registered) || !registered.includes(redirectUri)) throw new Error();
      callback = new URL(redirectUri);
      const chatgpt = callback.origin === 'https://chatgpt.com';
      const hermes = callback.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(callback.hostname) && Boolean(callback.port);
      if ((!chatgpt && !hermes) || callback.username || callback.password || callback.hash) throw new Error();
    } catch { return page('Client unavailable', '<p>Start again from your MCP client.</p>', 400); }
    return page('Authorize MCP client', `<p>${escape(client.name)} requests access to your AimHarder MCP portal account. Your AimHarder password will not be shared with the client.</p><p>This authorizes service access. Booking and activity actions, when available, require their exact preview and separate confirmation.</p><p>Scopes: ${escape(url.searchParams.get('scope') ?? '')}</p><form method="post" action="/portal/oauth/consent"><input type="hidden" name="oauth_query" value="${escape(url.search.slice(1))}"><button name="accept" value="true">Authorize</button> <button name="accept" value="false">Deny</button></form>`, 200, false, callback.origin);
  }
  if (url.pathname === '/portal/oauth/consent' && request.method === 'POST') {
    if (request.headers.get('origin') !== new URL(env.BASE_URL).origin) return new Response(null, { status: 403 });
    const form = await request.formData();
    const response = await auth.handler(new Request(`${env.BASE_URL}/api/auth/oauth2/consent`, { method: 'POST',
      headers: { cookie: request.headers.get('cookie') ?? '', origin: new URL(env.BASE_URL).origin, 'content-type': 'application/json' },
      body: JSON.stringify({ accept: form.get('accept') === 'true', oauth_query: String(form.get('oauth_query') ?? '') }) }));
    if (!response.ok) return page('Authorization unavailable', '<p>Start again from your MCP client.</p>', response.status);
    const result = await response.json() as { url: string };
    return new Response(null, { status: 303, headers: { location: result.url, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
  }
  if (request.method !== 'GET' || !['/api/portal/connections', '/connections'].includes(url.pathname)) return new Response(null, { status: 405 });
  const rows = await env.AUTH_DB.prepare('SELECT c.clientId,c.name FROM oauthConsent o JOIN oauthClient c ON c.clientId=o.clientId WHERE o.userId=? AND COALESCE(c.disabled,0)=0 GROUP BY c.clientId').bind(session.user.id).all();
  if (url.pathname === '/connections') return page('Connected MCP clients', `<p>Revoking a client stops its access and refresh. Your portal account and other clients stay connected.</p>${rows.results.map(item => `<p>${escape(String(item.name))}</p><form method="post" action="/portal/connections/${encodeURIComponent(String(item.clientId))}/revoke"><button>Revoke</button></form>`).join('') || '<p>No clients are connected.</p>'}`);
  return Response.json({ connections: rows.results }, { headers: { 'cache-control': 'no-store' } });
}
