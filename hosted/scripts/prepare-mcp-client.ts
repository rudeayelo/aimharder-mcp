import { randomUUID } from 'node:crypto';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Operator-owned, offline registration preparation. No metadata URL is fetched.
const kind = process.env.MCP_CLIENT_KIND;
if (kind !== 'chatgpt' && kind !== 'hermes') throw new Error('MCP_CLIENT_KIND must be chatgpt or hermes.');
const base = new URL(process.env.BASE_URL ?? '');
if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash)
  throw new Error('BASE_URL must be an HTTPS origin.');
const callback = new URL(process.env.MCP_REDIRECT_URI ?? '');
if (callback.username || callback.password || callback.search || callback.hash) throw new Error('Invalid callback.');
if (kind === 'chatgpt') {
  if (callback.origin !== 'https://chatgpt.com' || !(/^\/connector\/oauth\/[a-zA-Z0-9_-]+$/.test(callback.pathname) || callback.pathname === '/connector_platform_oauth_redirect'))
    throw new Error('Copy the exact ChatGPT callback from its connection management page.');
} else if (callback.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(callback.hostname) || !callback.port || callback.pathname !== '/callback') {
  throw new Error('Hermes requires a pinned HTTP loopback port and /callback path.');
}
const output = process.env.MCP_CLIENT_OUTPUT_DIR;
if (!output || !isAbsolute(output)) throw new Error('Set an absolute MCP_CLIENT_OUTPUT_DIR outside the checkout.');
const directory = resolve(await realpath(dirname(resolve(output))), basename(resolve(output)));
const checkout = await realpath(fileURLToPath(new URL('../..', import.meta.url)));
const location = relative(checkout, directory);
if (!location.startsWith(`..${sep}`) && location !== '..' && !isAbsolute(location)) throw new Error('Output must be outside the checkout.');
await mkdir(directory, { mode: 0o700 });
const clientId = `aimharder-${kind}-${randomUUID()}`;
const name = kind === 'chatgpt' ? 'ChatGPT' : 'Hermes';
const resource = `${base.origin}/mcp`;
const scopes = ['openid', 'profile', 'offline_access', 'mcp:access'];
const q = (value: string) => `'${value.replaceAll("'", "''")}'`;
const sql = [
  `INSERT INTO oauthClient (id,clientId,name,redirectUris,tokenEndpointAuthMethod,applicationType,grantTypes,responseTypes,requirePKCE,scopes,skipConsent,subjectType) VALUES (${q(clientId)},${q(clientId)},${q(name)},${q(JSON.stringify([callback.href]))},'none','${kind === 'hermes' ? 'native' : 'web'}','["authorization_code","refresh_token"]','["code"]',1,${q(JSON.stringify(scopes))},0,'public');`,
  `INSERT OR IGNORE INTO oauthResource (id,identifier,name,allowedScopes) VALUES (${q(randomUUID())},${q(resource)},'AimHarder MCP', '["mcp:access"]');`,
  `INSERT INTO oauthClientResource (id,clientId,resourceId) VALUES (${q(randomUUID())},${q(clientId)},${q(resource)});`,
].join('\n') + '\n';
await writeFile(resolve(directory, 'mcp-client.sql'), sql, { flag: 'wx', mode: 0o600 });
await writeFile(resolve(directory, 'client-settings.json'), JSON.stringify({ clientId, name, redirectUri: callback.href,
  serverUrl: resource, tokenEndpointAuthMethod: 'none', scopes }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
console.info('MCP client registration prepared privately. Review and apply it once to the intended database. Nothing was applied or contacted.');
