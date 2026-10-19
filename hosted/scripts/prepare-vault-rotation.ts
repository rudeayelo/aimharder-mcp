// Trusted offline operator command. Input/output contain encrypted rows only.
import { decryptActionFacts, encryptActionFacts, decryptConnection, encryptConnection, type ConnectionRow } from '../src/vault.ts';
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
interface ActionRow { userId:string;revision:string;referenceDigest:string;action:string;expires:number;facts:string|null; }
try {
  let input = '';
  for await (const chunk of process.stdin) {
    input += String(chunk);
    if (Buffer.byteLength(input) > 5_242_880) throw new Error('Input too large');
  }
  const value=JSON.parse(input) as ConnectionRow[]|{connections:ConnectionRow[];actions:ActionRow[]};
  // Legacy connection-array input remains supported, but is not a complete
  // hosted key-retirement inventory once operation journals are deployed.
  const actionInventoryProvided=!Array.isArray(value);
  const rows=Array.isArray(value)?value:value.connections;
  const actions=Array.isArray(value)?[]:value.actions;
  if (!Array.isArray(rows) || rows.length > 100 || !Array.isArray(actions)||actions.length>1500) throw new Error('Invalid rows');
  const env = { VAULT_KEYS: process.env.VAULT_KEYS ?? '', VAULT_ACTIVE_KEY_ID: process.env.VAULT_ACTIVE_KEY_ID ?? '' };
  const statements: string[] = [];
  for (const row of rows) {
    if (!row || typeof row.userId !== 'string' || typeof row.revision !== 'string' || typeof row.envelope !== 'string') throw new Error('Invalid row');
    const payload = await decryptConnection(env, row);
    const envelope = await encryptConnection(env, row.userId, row.revision, payload);
    statements.push(`UPDATE portal_aimharder_connection SET envelope=${quote(envelope)} WHERE userId=${quote(row.userId)} AND revision=${quote(row.revision)} AND envelope=${quote(row.envelope)};`);
  }
  const now=Date.now();let actionRows=0;
  if(actionInventoryProvided)statements.push(`DELETE FROM portal_action_journal WHERE expires<=${now};`);
  for(const row of actions){
    if(!row||typeof row.userId!=='string'||typeof row.revision!=='string'||typeof row.referenceDigest!=='string'||!/^[a-f0-9]{64}$/.test(row.referenceDigest)||typeof row.action!=='string'||!Number.isSafeInteger(row.expires)||(row.facts!==null&&typeof row.facts!=='string'))throw new Error('Invalid action row');
    if(row.expires<=now||row.facts===null)continue;
    const context=row.action+':'+row.referenceDigest;
    const facts=await decryptActionFacts(env,row.userId,row.revision,context,row.facts);
    const envelope=await encryptActionFacts(env,row.userId,row.revision,context,facts);actionRows++;
    statements.push(`UPDATE portal_action_journal SET facts=${quote(envelope)} WHERE userId=${quote(row.userId)} AND referenceDigest=${quote(row.referenceDigest)} AND action=${quote(row.action)} AND revision=${quote(row.revision)} AND facts=${quote(row.facts)} AND expires>${now};`);
  }
  process.stdout.write(JSON.stringify({ rows: rows.length, actionRows, actionInventoryProvided, activeKeyId: env.VAULT_ACTIVE_KEY_ID, sql: statements.join('\n') }));
} catch {
  process.stderr.write('Vault rotation preparation failed. No update was prepared.\n');
  process.exitCode = 1;
}
