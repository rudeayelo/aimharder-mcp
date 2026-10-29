// Synthetic-only operator seam; excluded from production build.
import {recoveryMaintenanceStatus} from '../src/recovery-maintenance.js';
import production from '../src/worker.js';
import {accountOperation} from '../src/account-connection.js';
import setup from './account-connection-fixture-worker.js';
import type { HostedEnvironment } from '../src/auth.js';
import { closeRecovery, sealRecovery, authorizeRestorePoint, reconcileRecovery, openRecovery } from '../src/recovery-operator.js';
export { AccountConnection } from '../src/account-connection.js';
const clockNow=Date.now;let clockOffset=0;Date.now=()=>clockNow()+clockOffset;
let clockAfterBatch=0;
let deferred:(()=>Promise<Response>)|undefined;
let scheduledSettlements:string[]=[];
export default {async fetch(request:Request,env:HostedEnvironment,ctx:ExecutionContext){
 const path=new URL(request.url).pathname;
 if(path==='/__fixture/clock'){clockOffset+=Number(request.headers.get('x-fixture-ms')??0);return new Response(null,{status:204});}
 if(path==='/__fixture/clock-after-auth-batch'){clockAfterBatch=Number(request.headers.get('x-fixture-ms')??0);return new Response(null,{status:204});}
 // Pass-through persistence scheduling: the real batch finishes before the
 // controlled clock advances and the real independent completion is attempted.
 if(clockAfterBatch){const database=env.AUTH_DB;env={...env,AUTH_DB:new Proxy(database,{get(target,key){
  if(key==='batch')return async(statements:D1PreparedStatement[])=>{const result=await target.batch(statements);clockOffset+=clockAfterBatch;clockAfterBatch=0;return result;};
  const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;
 }})};}
 if(path==='/__fixture/scheduled-settlements')return Response.json(scheduledSettlements);
 if(path==='/__fixture/scheduled' && request.headers.has('x-fixture-telemetry')){scheduledSettlements=[];const nativeContext=ctx;ctx={waitUntil(promise:Promise<unknown>){nativeContext.waitUntil(promise);void promise.then(()=>scheduledSettlements.push('fulfilled'),()=>scheduledSettlements.push('rejected'));}} as ExecutionContext;env={...env,LOGNORTH_ENABLED:'true',LOGNORTH_URL:'https://telemetry.example.invalid',LOGNORTH_API_KEY:'lgn-'+ 'a'.repeat(64),LOGNORTH_ENVIRONMENT:'synthetic',LOGNORTH_RELEASE:'scheduled-test',...(request.headers.has('x-fixture-authority-fault')?{RECOVERY_AUTHORITY_ID:'wrong-authority'}:{})};}
 if(path==='/__fixture/scheduled'){try{await production.scheduled({cron:'*/5 * * * *',scheduledTime:Date.now(),noRetry(){}} as ScheduledController,env,ctx);return Response.json({outcome:'ok'});}catch{return Response.json({outcome:'failed'},{status:503});}}
 if(path==='/__fixture/watchdog-status')return Response.json(await recoveryMaintenanceStatus(env));
 if(path==='/__fixture/defer-query'){
   let parent:string|undefined;
   const recovery=new Proxy(env.RECOVERY_DB!,{get(target,key){
    if(key==='prepare')return(sql:string)=>{const statement=target.prepare(sql);if(!sql.startsWith('INSERT INTO recovery_lease'))return statement;return new Proxy(statement,{get(value,property){if(property==='bind')return(...args:unknown[])=>{parent=String(args[0]);return value.bind(...args);};const found=Reflect.get(value,property);return typeof found==='function'?found.bind(value):found;}});};
    const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;
   }});
   const sessionResponse=await production.fetch(new Request(new URL('/api/auth/get-session',request.url),{headers:request.headers}),{...env,RECOVERY_DB:recovery});
   const session=await sessionResponse.json() as {user?:{id:string}}|null;if(!session?.user||!parent)return new Response(null,{status:401});
   const context={...env,RECOVERY_LEASE:parent};const subject=session.user.id;
   deferred=()=>accountOperation(context,subject,{kind:'class-sessions',input:{startDate:'2026-10-25',endDate:'2026-10-25'}});
   return new Response(null,{status:204});
 }
 if(path==='/__fixture/release-deferred'){const callback=deferred;deferred=undefined;return callback?callback():new Response(null,{status:404});}
 if(path==='/__fixture/linked-google'){
   const now=Date.now();await env.AUTH_DB.prepare("INSERT INTO account(id,accountId,providerId,userId,createdAt,updatedAt) VALUES ('synthetic-google','synthetic-google-subject','google','portal-fixture',?,?)").bind(now,now).run();return new Response(null);
 }
 if(path.startsWith('/__fixture/recovery/')){
   const checkpoint=(await env.RECOVERY_DB!.prepare('SELECT checkpoint FROM recovery_head').first<{checkpoint:string}>())!.checkpoint;
   const command=path.split('/').at(-1);
   try{
     const target=command==='authorize'?await request.json() as {bookmark:string;targetAt:number}:null;
     const result=command==='authorize'?await authorizeRestorePoint(env,checkpoint,target!.bookmark,target!.targetAt):command==='close'?await closeRecovery(env,checkpoint):command==='seal'?await sealRecovery(env,checkpoint):command==='reconcile'?await reconcileRecovery(env,checkpoint):command==='open'?await openRecovery(env,checkpoint):null;
     return Response.json(result);
   }catch{return Response.json({error:'Recovery precondition failed'},{status:409});}
 }
 return setup.fetch(request,env);
}};
