// Synthetic operator bootstrap only; never bundled into production.
import type { HostedEnvironment } from '../src/auth.js';
import { recoverySchema } from '../src/recovery-authority.js';
export async function seedRecovery(env:HostedEnvironment){
  if(!env.RECOVERY_DB)throw new Error('Synthetic recovery binding required');
  for(const sql of recoverySchema)await env.RECOVERY_DB.prepare(sql.replace('CREATE TABLE ','CREATE TABLE IF NOT EXISTS ')).run();
  await env.RECOVERY_DB.prepare("INSERT OR IGNORE INTO recovery_head(authorityId,epoch,gate,checkpoint) VALUES ('synthetic-authority',0,'open','synthetic-initial')").run();
}
