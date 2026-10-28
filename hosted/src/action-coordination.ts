import { AimHarderError } from '../../src/errors.js';
import { digest } from './admission.js';
import type { HostedEnvironment } from './auth.js';
import { decryptActionFacts, encryptActionFacts } from './vault.js';

// Recovery records never authorize dispatch. Unused preparations stay in memory.
export const actionRecoveryLifetime = 10 * 60_000;
interface Preparation { accessGeneration:number; action:string; revision:string; identity:number; expires:number; gymId:string; }
interface Journal { action:string; referenceDigest:string; revision:string; expires:number; instance:string; phase:'consumed'|'possibly-sent'|'finished'; facts:string|null; }
interface Retention { until:number; generation:number; timer:ReturnType<typeof setTimeout>|undefined; settle:()=>void; }
export class AccountActionCoordinator {
  #instance=crypto.randomUUID();
  #preparations=new Map<string,Preparation>();
  #retention:Retention|undefined;
  constructor(private storage:DurableObjectStorage,private env:HostedEnvironment,private retain:(promise:Promise<void>)=>void){}
  #settleRetention(retention:Retention){
    clearTimeout(retention.timer);retention.generation++;retention.settle();
    if(this.#retention===retention)this.#retention=undefined;
  }
  #scheduleRetention(retention:Retention,expires:number){
    clearTimeout(retention.timer);const generation=++retention.generation;
    retention.timer=setTimeout(()=>{
      if(this.#retention===retention&&retention.generation===generation)this.#refreshRetention();
    },Math.max(0,Math.min(expires,retention.until)-Date.now()));
  }
  #refreshRetention(){
    const now=Date.now();
    for(const [key,value]of this.#preparations)if(value.expires<=now)this.#preparations.delete(key);
    const expires=Math.max(...[...this.#preparations.values()].map(value=>value.expires));
    const previous=this.#retention;
    if(!(expires>now)){if(previous)this.#settleRetention(previous);return;}
    if(previous&&previous.until>now){this.#scheduleRetention(previous,expires);return;}
    let settle!:()=>void;
    const promise=new Promise<void>(resolve=>{settle=resolve;});
    const retention:Retention={until:now+120_000,generation:0,timer:undefined,settle};
    this.#retention=retention;this.#scheduleRetention(retention,expires);
    try{this.retain(promise);}
    catch(error){this.#preparations.clear();this.#settleRetention(retention);if(previous)this.#settleRetention(previous);throw error;}
    // A replenished stream starts a fresh bounded hold before settling its predecessor.
    if(previous)this.#settleRetention(previous);
  }
  async sweep(subject:string){
    await this.env.AUTH_DB.prepare('DELETE FROM portal_action_journal WHERE userId=? AND expires<=?').bind(subject,Date.now()).run();
    const next=await this.env.AUTH_DB.prepare('SELECT MIN(expires) AS expires FROM portal_action_journal WHERE userId=?').bind(subject).first<{expires:number|null}>();
    if(next?.expires)await this.storage.setAlarm(next.expires);
  }
  async hasPossibleDispatch(subject:string,reference:string){
    return Boolean(await this.env.AUTH_DB.prepare("SELECT 1 FROM portal_action_journal WHERE userId=? AND referenceDigest=? AND expires>? AND phase IN ('possibly-sent','finished') AND facts IS NOT NULL")
      .bind(subject,await digest(reference),Date.now()).first());
  }
  discardPreparations(){this.#preparations.clear();this.#refreshRetention();}
  remember(reference:string,preparation:Preparation){
    if(!Number.isFinite(preparation.expires)||preparation.expires>Date.now()+120_000)throw new RangeError('Invalid preparation lifetime');
    for(const [key,value] of this.#preparations)if(value.expires<=Date.now())this.#preparations.delete(key);
    if(this.#preparations.size>=32)this.#preparations.delete(this.#preparations.keys().next().value!);
    this.#preparations.set(reference,preparation);
    this.#refreshRetention();
  }
  async #put(subject:string,row:Journal){
    await this.env.AUTH_DB.prepare(`INSERT INTO portal_action_journal (userId,referenceDigest,revision,expires,instance,phase,facts,action) VALUES (?,?,?,?,?,?,?,?)
      ON CONFLICT(userId,referenceDigest) DO UPDATE SET revision=excluded.revision,expires=excluded.expires,instance=excluded.instance,phase=excluded.phase,facts=CASE WHEN excluded.phase='finished' THEN portal_action_journal.facts ELSE excluded.facts END,action=excluded.action`)
      .bind(subject,row.referenceDigest,row.revision,row.expires,row.instance,row.phase,row.facts,row.action).run();
  }
  async execute<T,F>(options:{accessGeneration:number;action:string;invalidReference?:'BOOKING_REFERENCE_INVALID'|'ACTIVITY_REFERENCE_INVALID';subject:string;revision:string;identity:number;reference:string;gymId?:string;
    dispatch:(beforeDispatch:(facts:F)=>Promise<void>,afterDispatch:(facts:F)=>Promise<void>)=>Promise<T>;
    authorize:()=>Promise<void>;recover:(facts:F,originalRevision:string)=>Promise<T>;
  }):Promise<T>{
    const now=Date.now();const referenceDigest=await digest(options.reference);
    await this.sweep(options.subject);
    const rows=(await this.env.AUTH_DB.prepare('SELECT action,referenceDigest,revision,expires,instance,phase,facts FROM portal_action_journal WHERE userId=?').bind(options.subject).all<Journal>()).results;
    const previous=rows.find(row=>row.referenceDigest===referenceDigest);
    if(previous&&previous.action===options.action&&previous.instance!==this.#instance&&previous.phase!=='consumed'&&previous.facts){
      await options.authorize();
      const facts=await decryptActionFacts(this.env,options.subject,previous.revision,previous.action+':'+referenceDigest,previous.facts) as F;
      try{await this.env.AUTH_DB.prepare('UPDATE portal_action_journal SET instance=? WHERE userId=? AND referenceDigest=?').bind(this.#instance,options.subject,referenceDigest).run();}
      catch{
        // This marker only bounds duplicate read-only recovery. The retained
        // durable dispatch fence still forbids a write; preserve available reads.
      }
      return options.recover(facts,previous.revision);
    }
    const preparation=this.#preparations.get(options.reference);this.#preparations.delete(options.reference);
    this.#refreshRetention();
    if(previous||!preparation||preparation.expires<=now||preparation.action!==options.action||preparation.revision!==options.revision||preparation.identity!==options.identity||preparation.accessGeneration!==options.accessGeneration||(options.gymId!==undefined&&options.gymId!==preparation.gymId))throw new AimHarderError(options.invalidReference??'BOOKING_REFERENCE_INVALID');
    if(rows.length>=64)throw new AimHarderError(options.invalidReference??'BOOKING_REFERENCE_INVALID');
    const journal:Journal={action:options.action,referenceDigest,revision:options.revision,expires:now+actionRecoveryLifetime,instance:this.#instance,phase:'consumed',facts:null};
    // The durable D1 consumption completes before any preflight or sporting write.
    const alarm=await this.storage.getAlarm();if(alarm===null||alarm>journal.expires)await this.storage.setAlarm(journal.expires);
    await this.#put(options.subject,journal);
    const result=await options.dispatch(async facts=>{
      journal.facts=await encryptActionFacts(this.env,options.subject,options.revision,options.action+':'+referenceDigest,facts);journal.phase='possibly-sent';
      // Termination after this committed fence can only reconcile, never resend.
      await this.#put(options.subject,journal);
      try{await options.authorize();if(preparation.expires<=Date.now())throw new AimHarderError(options.invalidReference??'BOOKING_REFERENCE_INVALID');}
      catch(error){journal.facts=null;journal.phase='consumed';await this.#put(options.subject,journal);throw error;}
    },async facts=>{
      // Preserve only response interpretation, never the upstream response itself.
      journal.facts=await encryptActionFacts(this.env,options.subject,options.revision,options.action+':'+referenceDigest,facts);
      await this.#put(options.subject,journal);
    });
    journal.phase='finished';
    try{if(journal.expires>Date.now())await this.#put(options.subject,journal);else await this.sweep(options.subject);}
    catch{
      // The prior durable fence already prohibits replay. A phase-marker or
      // cleanup failure must not hide the original account's reconciled result.
    }
    return result;
  }
}
