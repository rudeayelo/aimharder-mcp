// Synthetic setup and scheduling only; authentication, persistence and actors are real.
import setup from './booking-creation-fixture-worker.js';
import production from '../src/worker.js';
import type { HostedEnvironment } from '../src/auth.js';
export { AccountConnection } from './booking-creation-fixture-worker.js';
function scheduledDatabase(database:D1Database,phase:string):D1Database {
 function statement(original:D1PreparedStatement,sql:string):D1PreparedStatement {
  return new Proxy(original,{get(target,property){
   if(property==='bind')return(...values:unknown[])=>statement(target.bind(...values),sql);
   const value=Reflect.get(target,property);
   if(typeof value!=='function')return value;
   return async(...args:unknown[])=>{
    const selected=phase==='code-write'?/\binsert\s+into\s+["`]?verification["`]?/i.test(sql):sql.includes('SELECT c.clientId,COALESCE(r.generation,0)');
    if(selected)await fetch('https://synthetic-scheduler.invalid/'+phase);
    return Reflect.apply(value,target,args);
   };
  }});
 }
 return new Proxy(database,{get(target,property){if(property==='prepare')return(sql:string)=>statement(target.prepare(sql),sql);const value=Reflect.get(target,property);return typeof value==='function'?value.bind(target):value;}});
}
export default {fetch(request:Request,env:HostedEnvironment){
 if(new URL(request.url).pathname.startsWith('/__fixture'))return setup.fetch(request,env);
 const phase=request.headers.get('x-fixture-schedule');
 return production.fetch(request,phase?{...env,AUTH_DB:scheduledDatabase(env.AUTH_DB,phase)}:env);
}};
