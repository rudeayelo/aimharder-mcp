// Anonymous public HTTP checks only. Never accepts credentials or prints bodies.
let target: URL;
try { target = new URL(process.env.HOSTED_SMOKE_BASE_URL ?? 'https://pilot-test.ahmcp.link'); }
catch { throw new Error('Smoke target must be a valid origin.'); }
const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
if (target.username || target.password || target.pathname !== '/' || target.search || target.hash ||
    (target.origin !== 'https://pilot-test.ahmcp.link' && !(loopback && target.protocol === 'http:')))
  throw new Error('Smoke target must be the isolated test HTTPS origin or a local HTTP loopback origin.');

const results: { check: string; status: number; result: 'passed' }[] = [];
const mailStage = process.env.HOSTED_SMOKE_MAIL_STAGE ?? 'disabled';
if (!['disabled', 'configured'].includes(mailStage)) throw new Error('Smoke mail stage must be disabled or configured.');
async function check(path: string, expected: number, contains?: string, init?: RequestInit) {
  const response = await fetch(new URL(path, target), {
    ...init, redirect: 'manual', credentials: 'omit', signal: AbortSignal.timeout(10_000),
  });
  const text = await response.text();
  if (response.status !== expected || (contains && !text.includes(contains)))
    throw new Error(`Anonymous smoke check failed: ${path.split('?')[0]}`);
  results.push({ check: `${init?.method ?? 'GET'} ${path}`, status: response.status, result: 'passed' });
  return response;
}
for (const [path, text] of [['/', 'An invitation is required'], ['/sign-in', 'Portal password'], ['/recover', 'Recover portal access']] as const)
  await check(path, 200, text);
await check('/admin/invitations', 401, 'Administrator access required');
await check('/api/portal/invitations', 401, 'Sign in required.');
for (const path of ['/__fixture', '/__mail', '/api/portal/bootstrap']) await check(path, 404);
const deniedMcp = await check('/mcp', 401, undefined, { method: 'POST' });
if (!deniedMcp.headers.get('www-authenticate')?.includes('oauth-protected-resource'))
  throw new Error('Anonymous MCP challenge is missing.');
await check('/.well-known/oauth-protected-resource/mcp', 200, `${target.origin}/mcp`);
// Never probe enrollment/recovery when mail is configured: those are delivery-capable writes.
if (mailStage === 'disabled') {
  for (const path of ['/api/auth/sign-up/email', '/api/auth/request-password-reset'])
    await check(path, 503, 'Email delivery is unavailable.', {
      method: 'POST', headers: { origin: target.origin, 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'smoke@example.invalid', name: 'Anonymous Smoke', password: 'synthetic-unused-password' }),
    });
}
await check('/portal/recovery', 403, 'Request rejected', {
  method: 'POST', headers: { origin: 'https://untrusted.example.invalid', 'content-type': 'application/x-www-form-urlencoded' },
  body: 'email=smoke%40example.invalid',
});
console.info(JSON.stringify({ target: loopback ? 'local-loopback' : 'isolated-test', mailStage, checks: results }));
