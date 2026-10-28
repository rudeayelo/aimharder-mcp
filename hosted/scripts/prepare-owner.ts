import { randomBytes, createHash } from 'node:crypto';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Trusted offline preparation only: no network, database writes, mail or credential output.
const email = z.email().max(254).parse(process.env.PORTAL_OWNER_EMAIL).toLowerCase();
const base = new URL(process.env.BASE_URL ?? '');
if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash)
  throw new Error('BASE_URL must be an HTTPS origin.');
const output = process.env.OWNER_BOOTSTRAP_OUTPUT_DIR;
if (!output || !isAbsolute(output)) throw new Error('Set an absolute OWNER_BOOTSTRAP_OUTPUT_DIR outside the checkout.');
// Resolve the existing parent before creation so symlinks cannot put artifacts
// inside the checkout. Never reuse or chmod an existing caller-owned directory.
const privateDirectory = resolve(await realpath(dirname(resolve(output))), basename(resolve(output)));
const checkout = await realpath(fileURLToPath(new URL('../..', import.meta.url)));
const location = relative(checkout, privateDirectory);
if (!location.startsWith(`..${sep}`) && location !== '..' && !isAbsolute(location))
  throw new Error('Owner bootstrap output must be outside the checkout.');
await mkdir(privateDirectory, { mode: 0o700 });
const token = randomBytes(32).toString('base64url');
const digest = createHash('sha256').update(token).digest('hex');
const now = Date.now();
const expiresAt = now + 7 * 24 * 60 * 60 * 1000;
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const sql = `INSERT INTO portal_invitation (id,email,tokenDigest,expiresAt,role,createdAt) VALUES ('owner-bootstrap',${quote(email)},'${digest}',${expiresAt},'admin',${now});\n`;
const url = new URL('/accept-invitation', base);
url.searchParams.set('token', token);
await writeFile(resolve(privateDirectory, 'owner-bootstrap.sql'), sql, { flag: 'wx', mode: 0o600 });
await writeFile(resolve(privateDirectory, 'owner-invitation.json'), JSON.stringify({
  kind: 'invitation', to: email, url: url.href, expiresAt: new Date(expiresAt).toISOString(),
}, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
console.info('Owner bootstrap artifacts prepared in the configured private directory. Nothing was applied or sent.');
