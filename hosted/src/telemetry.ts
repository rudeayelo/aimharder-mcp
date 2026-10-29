import { queryToolNames } from './query-outcome.js';
import { activityOutcomeCodes } from './activity-outcome.js';
import { AimHarderError } from '../../src/errors.js';

export type Outcome = 'success' | 'denied' | 'partial' | 'uncertain' | 'technical_failure' | 'unclassified';
export interface Classification { outcome: Outcome; code?: string }
export interface TelemetryConfiguration {
  LOGNORTH_ENABLED?: string;
  LOGNORTH_URL?: string;
  LOGNORTH_API_KEY?: string;
  LOGNORTH_ENVIRONMENT?: string;
  LOGNORTH_RELEASE?: string;
}
const toolNames = new Set(['get_account_context',...Object.values(queryToolNames)]);
const messages = { 'http.completed': 'Hosted HTTP request completed', 'mcp.tool.completed': 'Hosted MCP tool completed', 'maintenance.main.completed': 'Scheduled deletion maintenance completed', 'maintenance.memory.completed': 'Scheduled memory maintenance completed' } as const;
const priority: Record<Outcome,number> = {success:0,denied:1,partial:2,uncertain:3,technical_failure:3,unclassified:3};
const issues = { technical_failure: ['HostedTechnicalFailure','Hosted operation failed technically'], uncertain: ['HostedWriteUncertain','Hosted write effect is unconfirmed'], unclassified: ['HostedClassifierFailure','Hosted outcome has no supported classification'] } as const;
// Labels and codes originate in source catalogs, never arbitrary upstream strings.
const deniedCodes = new Set(['AUTHENTICATION_FAILED','ACCESS_RESTRICTED','SESSION_EXPIRED','INVALID_CONFIGURATION','INVALID_TIME_ZONE_CONFIGURATION','NO_ACCESSIBLE_GYMS','DEFAULT_GYM_REQUIRED','ALREADY_CONNECTED','CONNECTION_CHANGED','GYM_NOT_ACCESSIBLE','GYM_TIME_ZONE_REQUIRED','CONFIRMED_GYM_TIME_ZONE_REQUIRED','INVALID_CLASS_QUERY','INVALID_WORKOUT_QUERY','INVALID_ACTIVITY_QUERY','INVALID_EXERCISE_QUERY','INVALID_BOOKING_PREPARATION_QUERY','INVALID_CANCELLATION_PREPARATION_QUERY','INVALID_BOOKING_EXECUTION_QUERY','INVALID_LATE_CANCELLATION_QUERY','BOOKING_REFERENCE_INVALID','INVALID_ACTIVITY_PUBLICATION_QUERY','INVALID_ACTIVITY_DELETION_EXECUTION_QUERY','ACTIVITY_REFERENCE_INVALID']);
const technicalCodes = new Set(['IDENTITY_MISMATCH','REQUEST_FAILED','INVALID_RESPONSE','UNSUPPORTED_MEMBERSHIP','INVALID_CLASS_RESPONSE','INVALID_BOOKING_RESPONSE','INVALID_WORKOUT_RESPONSE','INVALID_ACTIVITY_RESPONSE','INVALID_EXERCISE_RESPONSE','INVALID_ACTIVITY_PREFERENCES','INVALID_ACTIVITY_SOURCE','ACTIVITY_LIMIT']);
const codes = new Set<string>([...activityOutcomeCodes,'BOOKING_NOT_EXECUTABLE','BOOKING_EFFECT_UNCONFIRMED','BOOKING_STALE','BOOKING_REFUSED','BOOKING_WAITLISTED','BOOKING_CREDIT_CONFIRMATION_REQUIRED',...deniedCodes,...technicalCodes,'ACTION_OUTCOME_UNCERTAIN','BOOKING_HISTORY_PARTIAL','PERSONAL_ACTIVITY_INCOMPLETE','RM_ENRICHMENT_INCOMPLETE','MAINTENANCE_MAIN_FAILED','MAINTENANCE_OVERDUE','MAINTENANCE_MEMORY_FAILED','HTTP_DENIED','HTTP_FAILURE','HTTP_UNCLASSIFIED','EMAIL_UNAVAILABLE','GOOGLE_UNAVAILABLE','RECOVERY_UNAVAILABLE','NOT_CONNECTED']);
function classifyCode(code:unknown):Classification {
  if(typeof code!=='string')return {outcome:'unclassified'};
  if(deniedCodes.has(code))return {outcome:'denied',code};
  if(technicalCodes.has(code))return {outcome:'technical_failure',code};
  if(code==='ACTION_OUTCOME_UNCERTAIN')return {outcome:'uncertain',code};
  return {outcome:'unclassified'};
}
export function classifyError(error: unknown): Classification {
  return error instanceof AimHarderError ? classifyCode(error.code) : {outcome:'technical_failure',code:'REQUEST_FAILED'};
}
export function classifyAccountContext(envelope: Record<string,unknown>,httpStatus?:number): Classification {
  if(!envelope || typeof envelope!=='object' || Array.isArray(envelope))return {outcome:'unclassified'};
  const error=envelope.error;
  if(error!==undefined && error!==null){
    return typeof error==='object' && 'code' in error ? classifyCode(error.code) : {outcome:'unclassified'};
  }
  if(envelope.status==='connected' && typeof envelope.account==='object' && envelope.account!==null && 'authenticated' in envelope.account && envelope.account.authenticated===true && Array.isArray(envelope.gyms) && typeof envelope.selectedGym==='object' && envelope.selectedGym!==null)return {outcome:'success'};
  if(envelope.status==='unavailable' && !error){
    if(httpStatus===403)return {outcome:'denied',code:'ACCESS_RESTRICTED'};
    if(httpStatus===503)return {outcome:'technical_failure',code:'REQUEST_FAILED'};
  }
  if(!error && envelope.status==='default-gym-required')return {outcome:'denied',code:'DEFAULT_GYM_REQUIRED'};
  if(!error && envelope.status==='connection-changed')return {outcome:'denied',code:'CONNECTION_CHANGED'};
  if(!error && envelope.status==='already-connected')return {outcome:'denied',code:'ALREADY_CONNECTED'};
  if(envelope.status==='invalid-settings' && !error)return {outcome:'denied',code:'INVALID_CONFIGURATION'};
  if(envelope.status==='not-connected')return {outcome:'denied',code:'NOT_CONNECTED'};
  return {outcome:'unclassified'};
}
const routes = new Set(['/', '/mcp','/sign-in','/recover','/resend-verification','/reset-password','/verification-result','/google-result','/accept-invitation','/account','/connect-clients','/connections','/consent','/aimharder','/admin/invitations','/admin/participants','/admin/activity-access','/portal/activity-access',
  ...['sign-in','sign-up','google','link-google','add-password','recovery','send-verification','sign-out','reset-password','invitations','oauth/consent','account/delete','aimharder','aimharder/settings','aimharder/replace','aimharder/disconnect','aimharder/password'].map(p=>'/portal/'+p),
  ...['password','connections','invitations','participants','account/delete','aimharder','aimharder/settings','aimharder/replace','aimharder/disconnect','aimharder/password'].map(p=>'/api/portal/'+p),
  ...['get-session','sign-in/email','sign-up/email','sign-in/social','callback/google','link-social','jwks','token','account-info','change-email','change-password','delete-user','delete-user/callback','error','get-access-token','list-accounts','list-sessions','ok','refresh-token','revoke-other-sessions','revoke-session','revoke-sessions','unlink-account','update-session','update-user','verify-password','sign-out','request-password-reset','reset-password','send-verification-email','verify-email','oauth2/authorize','oauth2/consent','oauth2/token','oauth2/revoke','oauth2/register','oauth2/end-session','oauth2/continue','oauth2/client/rotate-keys','oauth2/client/rotate-secret','oauth2/create-client','oauth2/delete-client','oauth2/delete-consent','oauth2/end-session/confirm','oauth2/get-client','oauth2/get-clients','oauth2/get-consent','oauth2/get-consents','oauth2/introspect','oauth2/public-client','oauth2/public-client-prelogin','oauth2/update-client','oauth2/update-consent','oauth2/userinfo','admin/oauth2/create-client','admin/oauth2/update-client','admin/oauth2/resources','.well-known/oauth-authorization-server','.well-known/openid-configuration'].map(p=>'/api/auth/'+p),
  '/.well-known/oauth-protected-resource/mcp','/.well-known/oauth-authorization-server/api/auth','/api/auth/.well-known/openid-configuration']);
const dynamicRoutes: Array<[RegExp,string]> = [
  [/^\/api\/auth\/reset-password\/[^/]+$/, '/api/auth/reset-password/:token'],
  [/^\/api\/auth\/admin\/oauth2\/resources\/[^/]+$/, '/api/auth/admin/oauth2/resources/:identifier'],
  [/^\/api\/auth\/admin\/oauth2\/resources\/[^/]+\/clients\/[^/]+$/, '/api/auth/admin/oauth2/resources/:identifier/clients/:client_id'],
  [/^\/api\/portal\/invitations\/[^/]+\/revoke$/, '/api/portal/invitations/:id/revoke'],
  [/^\/portal\/invitations\/[^/]+\/revoke$/, '/portal/invitations/:id/revoke'],
  [/^\/api\/portal\/connections\/[^/]+\/revoke$/, '/api/portal/connections/:id/revoke'],
  [/^\/portal\/connections\/[^/]+\/revoke$/, '/portal/connections/:id/revoke'],
  ...['/api/portal','/portal'].flatMap(prefix=>['suspend','reactivate'].map(action=>[new RegExp('^'+prefix+'/participants/[^/]+/'+action+'$'),prefix+'/participants/:id/'+action] as [RegExp,string])),
];
export function routeTemplate(request: Request): string {
  const rawPath=new URL(request.url).pathname;
  const path=rawPath==='/api/auth/get-session/'?'/api/auth/get-session':rawPath;
  if(routes.has(path))return path;
  return dynamicRoutes.find(([pattern])=>pattern.test(path))?.[1]??'unmatched';
}
function warn(category:string,count=1){console.warn('Hosted telemetry warning', {category,count});}
interface Event {message:string;timestamp:string;duration_ms:number;trace_id:string;context:Record<string,string|number>}
const bytes=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).byteLength;

/** Owns only one execution's bounded observations, with no participant/account state. */
export class TelemetryInvocation {
  readonly traceId=crypto.randomUUID();
  private events: Event[]=[];
  private dropped=0;
  private sent=false;
  private httpClassification:Classification|undefined;
  httpOutcome(classification:Classification){this.httpClassification=classification;}
  constructor(private config:{url:string;key:string;environment:string;release:string}){}
  private record(type:keyof typeof messages,started:number,classification:Classification,labels:Record<string,string|number>={}){
    if(this.sent)return;
    const outcome=Object.hasOwn(priority,classification.outcome) && (!classification.code || codes.has(classification.code))?classification.outcome:'unclassified';
    const context:Event['context']={event_type:type,environment:this.config.environment,release:this.config.release,...labels,outcome};
    if(classification.code && codes.has(classification.code))context.code=classification.code;
    if(outcome in issues){const issue=issues[outcome as keyof typeof issues];context.error_class=issue[0];context.error=issue[1];
      if(classification.code && codes.has(classification.code)){context.error_class=issue[0]+':'+classification.code;}}
    const elapsed=performance.now()-started;
    const event:Event={message:messages[type],timestamp:new Date().toISOString(),duration_ms:Number.isFinite(elapsed)?Math.max(0,Math.floor(elapsed)):0,trace_id:this.traceId,context};
    if(bytes(event)>2048){this.dropped++;return;}
    this.events.push(event);
    while(this.events.length>32 || bytes({events:this.events})>65536){
      let index=0;
      for(let i=1;i<this.events.length;i++)if(priority[this.events[i]!.context.outcome as Outcome]<priority[this.events[index]!.context.outcome as Outcome])index=i;
      // Retain earlier arrivals when priorities tie.
      const lowest=priority[this.events[index]!.context.outcome as Outcome];
      for(let i=this.events.length-1;i>=0;i--)if(priority[this.events[i]!.context.outcome as Outcome]===lowest){index=i;break;}
      this.events.splice(index,1);this.dropped++;
    }
  }
  tool(tool:string,started:number,classification:Classification){
    if(!toolNames.has(tool))return;
    this.record('mcp.tool.completed',started,classification,{tool});
  }
  maintenance(phase:'main'|'memory',started:number,classification:Classification){this.record(`maintenance.${phase}.completed`,started,classification);}
  http(request:Request,started:number,response?:Response,thrown=false){
    const status=response?.status;
    const classification:Classification=thrown?{outcome:'technical_failure',code:'HTTP_FAILURE'}:status && status>=500?{outcome:'technical_failure',code:'HTTP_FAILURE'}:status && [400,401,403,404,405,409,410,422,429].includes(status)?{outcome:'denied',code:'HTTP_DENIED'}:status && status>=200 && status<400?{outcome:'success'}:{outcome:'unclassified',code:'HTTP_UNCLASSIFIED'};
    this.record('http.completed',started,thrown?classification:this.httpClassification??classification,{path:routeTemplate(request),...(status?{http_status:status}:{})});
  }
  async flush():Promise<void>{
    if(this.sent)return;this.sent=true;
    if(this.dropped)warn('dropped_events',this.dropped);
    if(!this.events.length)return;
    const events=this.events;this.events=[];
    const controller=new AbortController();
    let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
    let expired=false;
    let clear=()=>{};
    const timeout=new Promise<never>((_,reject)=>{const timer=setTimeout(()=>{expired=true;controller.abort();void reader?.cancel().catch(()=>{});reject(new Error());},2000);clear=()=>clearTimeout(timer);});
    try{
      await Promise.race([timeout,(async()=>{
        const response=await fetch(this.config.url,{method:'POST',headers:{authorization:`Bearer ${this.config.key}`,'content-type':'application/json'},body:JSON.stringify({events}),redirect:'manual',signal:controller.signal});
        if(expired)return;
        if(response.status!==201){void response.body?.cancel().catch(()=>{});warn('rejection');return;}
        reader=response.body?.getReader();
        let size=0;const chunks:Uint8Array[]=[];
        if(reader)while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>4096){void reader.cancel().catch(()=>{});warn('rejection');return;}chunks.push(chunk.value);}
        if(expired)return;
        const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.byteLength;}
        let ack:unknown;try{ack=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(data));}catch{warn('rejection');return;}
        if(!ack || typeof ack!=='object' || !('created' in ack) || !Number.isSafeInteger(ack.created) || Number(ack.created)<0 || ('errors' in ack && (!Array.isArray(ack.errors) || ack.errors.length>0)) || ack.created!==events.length){warn('partial_acceptance');}
      })()]);
    }catch{warn(expired?'timeout':'rejection');}finally{clear();}
  }
}
export function createTelemetry(env:TelemetryConfiguration):TelemetryInvocation|undefined{
  if(env.LOGNORTH_ENABLED===undefined || env.LOGNORTH_ENABLED==='false')return;
  try{
    if(env.LOGNORTH_ENABLED!=='true')throw new Error();
    const url=new URL(env.LOGNORTH_URL??'');
    if(env.LOGNORTH_URL?.includes('?')||env.LOGNORTH_URL?.includes('#')||url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error();
    const key=env.LOGNORTH_API_KEY;
    if(!key||!/^lgn-[0-9a-f]{64}$/.test(key))throw new Error();
    const environment=env.LOGNORTH_ENVIRONMENT,release=env.LOGNORTH_RELEASE;
    if(!environment||!release||!/^[A-Za-z0-9._-]{1,48}$/.test(environment)||!/^[A-Za-z0-9._-]{1,96}$/.test(release))throw new Error();
    return new TelemetryInvocation({url:url.origin+'/api/v1/events/batch',key,environment,release});
  }catch{warn('invalid_configuration');return;}
}
