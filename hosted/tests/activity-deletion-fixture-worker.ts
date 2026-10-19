// Synthetic admission/bootstrap only; every query uses the production entry point.
import setup from './mcp-auth-fixture-worker.js';
import production from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
import { AccountConnection as ProductionAccountConnection } from '../src/account-connection.js';
const clockGlobal=globalThis as typeof globalThis & {syntheticClock?:{now:()=>number;offset:number}};
const clock=clockGlobal.syntheticClock??={now:Date.now,offset:0};Date.now=()=>clock.now()+clock.offset;
export class AccountConnection extends ProductionAccountConnection {
 override fetch(request:Request):Promise<Response>{if(request.headers.has('x-fixture-clock')){clock.offset=Number(request.headers.get('x-fixture-clock'));return Promise.resolve(new Response(null,{status:204}));}return super.fetch(request);}

 constructor(state:DurableObjectState,env:HostedEnvironment){
  function statement(original:D1PreparedStatement,sql:string,values:unknown[]=[]):D1PreparedStatement{
   return new Proxy(original,{get(target,property){
    if(property==='bind')return(...args:unknown[])=>statement(target.bind(...args),sql,args);
    if(property==='first'&&sql.startsWith('SELECT g.id FROM portal_mcp_grant')&&values.length>=4)return async()=>{await fetch('https://synthetic-scheduler.invalid/execution-guard');return target.first();};
    if(property==='run'&&sql.startsWith('INSERT INTO portal_action_journal'))return async()=>{
      const phase=String(values[5]);
      const before=await fetch('https://synthetic-scheduler.invalid/action/'+phase+'/before');if(!before.ok)throw new Error('Synthetic interruption');
      const result=await target.run();
      const after=await fetch('https://synthetic-scheduler.invalid/action/'+phase+'/after');if(!after.ok)throw new Error('Synthetic interruption');return result;
    };
    const value=Reflect.get(target,property);return typeof value==='function'?value.bind(target):value;
   }});
  }
  const database=new Proxy(env.AUTH_DB,{get(target,property){if(property==='prepare')return(sql:string)=>statement(target.prepare(sql),sql);const value=Reflect.get(target,property);return typeof value==='function'?value.bind(target):value;}});
  super(state,{...env,AUTH_DB:database});
 }
}
export default { async fetch(request: Request, env: HostedEnvironment) {
  if(new URL(request.url).pathname==='/__fixture/clock'){clock.offset+=Number(request.headers.get('x-fixture-ms')??0);for(const subject of ['portal-fixture','other-participant'])await env.ACCOUNT_CONNECTIONS!.get(env.ACCOUNT_CONNECTIONS!.idFromName(subject)).fetch('https://fixture-clock.internal/',{headers:{'x-fixture-clock':String(clock.offset)}});return new Response(null,{status:204});}
  if (new URL(request.url).pathname === '/__fixture') {
    const response = await setup.fetch(request, env);
    await env.AUTH_DB.prepare("UPDATE portal_participant SET role='admin' WHERE userId='portal-fixture'").run();
    return response;
  }
  return production.fetch(request, env);
} };
