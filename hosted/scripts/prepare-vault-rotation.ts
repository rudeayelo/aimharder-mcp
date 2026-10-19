// Trusted offline operator command. Input/output contain encrypted rows only.
import { decryptConnection, encryptConnection, type ConnectionRow } from '../src/vault.ts';
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
try {
  let input = '';
  for await (const chunk of process.stdin) {
    input += String(chunk);
    if (Buffer.byteLength(input) > 5_242_880) throw new Error('Input too large');
  }
  const rows = JSON.parse(input) as ConnectionRow[];
  if (!Array.isArray(rows) || rows.length > 100) throw new Error('Invalid rows');
  const env = { VAULT_KEYS: process.env.VAULT_KEYS ?? '', VAULT_ACTIVE_KEY_ID: process.env.VAULT_ACTIVE_KEY_ID ?? '' };
  const statements: string[] = [];
  for (const row of rows) {
    if (!row || typeof row.userId !== 'string' || typeof row.revision !== 'string' || typeof row.envelope !== 'string') throw new Error('Invalid row');
    const payload = await decryptConnection(env, row);
    const envelope = await encryptConnection(env, row.userId, row.revision, payload);
    statements.push(`UPDATE portal_aimharder_connection SET envelope=${quote(envelope)} WHERE userId=${quote(row.userId)} AND revision=${quote(row.revision)} AND envelope=${quote(row.envelope)};`);
  }
  process.stdout.write(JSON.stringify({ rows: rows.length, activeKeyId: env.VAULT_ACTIVE_KEY_ID, sql: statements.join('\n') }));
} catch {
  process.stderr.write('Vault rotation preparation failed. No update was prepared.\n');
  process.exitCode = 1;
}
