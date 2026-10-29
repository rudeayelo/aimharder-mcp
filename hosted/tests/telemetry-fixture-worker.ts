import { classifyActivityOutcome } from '../src/activity-outcome.js';
// Synthetic telemetry-boundary harness. Never bundled into the application.
import { createTelemetry, TelemetryInvocation, classifyAccountContext } from '../src/telemetry.js';
import type { HostedEnvironment } from '../src/auth.js';
import { handleHostedRequest } from '../src/worker.js';
export default {
  async fetch(request:Request,env:HostedEnvironment,ctx:ExecutionContext){
    const url=new URL(request.url);
    if(url.pathname==='/__events'){
      const config={...env};
      if(url.searchParams.has('enabled'))config.LOGNORTH_ENABLED=url.searchParams.get('enabled')!;
      if(url.searchParams.has('destination'))config.LOGNORTH_URL=url.searchParams.get('destination')!;
      if(url.searchParams.has('key'))config.LOGNORTH_API_KEY=url.searchParams.get('key')!;
      // Oversize injection exercises the boundary's discard guard; production
      // labels cannot reach this size because configuration is separately bounded.
      const telemetry=url.searchParams.has('oversize')?new TelemetryInvocation({url:env.LOGNORTH_URL+'/api/v1/events/batch',key:env.LOGNORTH_API_KEY!,environment:'x'.repeat(2048),release:'synthetic'}):createTelemetry(config);
      const start=performance.now();
      if(url.searchParams.has('overflow')){
        for(let i=0;i<35;i++)telemetry?.tool('get_account_context',start,{outcome:'success'});
        telemetry?.tool('get_account_context',start,{outcome:'partial'});
        telemetry?.tool('get_account_context',start,{outcome:'denied'});
        telemetry?.tool('get_account_context',start,{outcome:'technical_failure',code:'IDENTITY_MISMATCH'});
      }else if(url.searchParams.has('activityKind')){
        const kind=url.searchParams.get('activityKind')!;
        telemetry?.tool(kind.replaceAll('-','_'),start,classifyActivityOutcome(kind,await request.json() as Record<string,unknown>)??{outcome:'unclassified'});
      }else{
        const envelope=await request.json() as Record<string,unknown>;
        telemetry?.tool('get_account_context',start,classifyAccountContext(envelope));
      }
      if(telemetry)ctx.waitUntil((async()=>{await telemetry.flush();await telemetry.flush();})());
      return Response.json({ok:true});
    }
    return handleHostedRequest(request,env,undefined,ctx);
  }
};
