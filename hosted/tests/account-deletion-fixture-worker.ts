// Synthetic-only operator seam; excluded from production build.
import setup from './account-connection-fixture-worker.js';
import type { HostedEnvironment } from '../src/auth.js';
import { closeRecovery, sealRecovery, reconcileRecovery, openRecovery } from '../src/recovery-operator.js';
export { AccountConnection } from '../src/account-connection.js';
export default {async fetch(request:Request,env:HostedEnvironment){
 const path=new URL(request.url).pathname;
 if(path==='/__fixture/linked-google'){
   const now=Date.now();await env.AUTH_DB.prepare("INSERT INTO account(id,accountId,providerId,userId,createdAt,updatedAt) VALUES ('synthetic-google','synthetic-google-subject','google','portal-fixture',?,?)").bind(now,now).run();return new Response(null);
 }
 if(path.startsWith('/__fixture/recovery/')){
   const checkpoint=(await env.RECOVERY_DB!.prepare('SELECT checkpoint FROM recovery_head').first<{checkpoint:string}>())!.checkpoint;
   const command=path.split('/').at(-1);
   try{
     const result=command==='close'?await closeRecovery(env,checkpoint):command==='seal'?await sealRecovery(env,checkpoint):command==='reconcile'?await reconcileRecovery(env,checkpoint):command==='open'?await openRecovery(env,checkpoint):null;
     return Response.json(result);
   }catch{return Response.json({error:'Recovery precondition failed'},{status:409});}
 }
 return setup.fetch(request,env);
}};
