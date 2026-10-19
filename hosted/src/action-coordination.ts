import { AimHarderError } from '../../src/errors.js';
import { digest } from './admission.js';
import type { HostedEnvironment } from './auth.js';
import { decryptActionFacts, encryptActionFacts } from './vault.js';

// Recovery records never authorize dispatch. Unused preparations stay in memory.
export const actionRecoveryLifetime = 10 * 60_000;
interface Preparation { action:string; revision:string; identity:number; expires:number; gymId:string; }
interface Journal { action:string; referenceDigest:string; revision:string; expires:number; instance:string; phase:'consumed'|'possibly-sent'|'finished'; facts:string|null; }
export class AccountActionCoordinator {
  #instance=crypto.randomUUID();
  #preparations=new Map<string,Preparation>();
  constructor(private storage:DurableObjectStorage,private env:HostedEnvironment){}
  async sweep(subject:string){
    await this.env.AUTH_DB.prepare('DELETE FROM portal_action_journal WHERE userId=? AND expires<=?').bind(subject,Date.now()).run();
    const next=await this.env.AUTH_DB.prepare('SELECT MIN(expires) AS expires FROM portal_action_journal WHERE userId=?').bind(subject).first<{expires:number|null}>();
    if(next?.expires)await this.storage.setAlarm(next.expires);
  }
  remember(reference:string,preparation:Preparation){
    for(const [key,value] of this.#preparations)if(value.expires<=Date.now())this.#preparations.delete(key);
    if(this.#preparations.size>=32)this.#preparations.delete(this.#preparations.keys().next().value!);
    this.#preparations.set(reference,preparation);
  }
  async #put(subject:string,row:Journal){
    await this.env.AUTH_DB.prepare(`INSERT INTO portal_action_journal (userId,referenceDigest,revision,expires,instance,phase,facts,action) VALUES (?,?,?,?,?,?,?,?)
      ON CONFLICT(userId,referenceDigest) DO UPDATE SET revision=excluded.revision,expires=excluded.expires,instance=excluded.instance,phase=excluded.phase,facts=CASE WHEN excluded.phase='finished' THEN portal_action_journal.facts ELSE excluded.facts END,action=excluded.action`)
      .bind(subject,row.referenceDigest,row.revision,row.expires,row.instance,row.phase,row.facts,row.action).run();
  }
  async execute<T,F>(options:{action:string;subject:string;revision:string;identity:number;reference:string;gymId?:string;
    dispatch:(beforeDispatch:(facts:F)=>Promise<void>)=>Promise<T>;
    authorize:()=>Promise<void>;recover:(facts:F,originalRevision:string)=>Promise<T>;
  }):Promise<T>{
    const now=Date.now();const referenceDigest=await digest(options.reference);
    await this.sweep(options.subject);
    const rows=(await this.env.AUTH_DB.prepare('SELECT action,referenceDigest,revision,expires,instance,phase,facts FROM portal_action_journal WHERE userId=?').bind(options.subject).all<Journal>()).results;
    const previous=rows.find(row=>row.referenceDigest===referenceDigest);
    if(previous&&previous.action===options.action&&previous.instance!==this.#instance&&previous.phase!=='consumed'&&previous.facts){
      await options.authorize();
      const facts=await decryptActionFacts(this.env,options.subject,previous.revision,previous.action+':'+referenceDigest,previous.facts) as F;
      await this.env.AUTH_DB.prepare('UPDATE portal_action_journal SET instance=? WHERE userId=? AND referenceDigest=?').bind(this.#instance,options.subject,referenceDigest).run();
      return options.recover(facts,previous.revision);
    }
    const preparation=this.#preparations.get(options.reference);this.#preparations.delete(options.reference);
    if(previous||!preparation||preparation.expires<=now||preparation.action!==options.action||preparation.revision!==options.revision||preparation.identity!==options.identity||(options.gymId!==undefined&&options.gymId!==preparation.gymId))throw new AimHarderError('BOOKING_REFERENCE_INVALID');
    if(rows.length>=64)throw new AimHarderError('BOOKING_REFERENCE_INVALID');
    const journal:Journal={action:options.action,referenceDigest,revision:options.revision,expires:now+actionRecoveryLifetime,instance:this.#instance,phase:'consumed',facts:null};
    // The durable D1 consumption completes before any preflight or sporting write.
    await this.#put(options.subject,journal);
    const alarm=await this.storage.getAlarm();if(alarm===null||alarm>journal.expires)await this.storage.setAlarm(journal.expires);
    const result=await options.dispatch(async facts=>{
      journal.facts=await encryptActionFacts(this.env,options.subject,options.revision,options.action+':'+referenceDigest,facts);journal.phase='possibly-sent';
      // Termination after this committed fence can only reconcile, never resend.
      await this.#put(options.subject,journal);
      try{await options.authorize();if(preparation.expires<=Date.now())throw new AimHarderError('BOOKING_REFERENCE_INVALID');}
      catch(error){journal.facts=null;journal.phase='consumed';await this.#put(options.subject,journal);throw error;}
    });
    journal.phase='finished';if(journal.expires>Date.now())await this.#put(options.subject,journal);else await this.sweep(options.subject);
    return result;
  }
}
