import {afterAll,beforeAll,expect,test} from 'vitest';
import {readFile,readdir} from 'node:fs/promises';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {buildWorker} from '../build.mjs';
import {initializeTestRecovery} from './recovery-fixture.js';
let worker:Miniflare;
let receiverMode='success';
const batches:Array<{events:Array<Record<string,any>>}>=[];
const warnings:string[]=[];
const attempts:Array<{url:string;authorization:string|null;redirect:string}>=[];
async function settle(){await new Promise(resolve=>setTimeout(resolve,60));}
async function invoke(query='',envelope:unknown={status:'not-connected'}){
  const response=await worker.dispatchFetch('http://localhost:8787/__events'+query,{method:'POST',body:JSON.stringify(envelope),headers:{'content-type':'application/json'}});
  expect(await response.json()).toEqual({ok:true});await settle();
}
beforeAll(async()=>{
  await buildWorker('tests/telemetry-fixture-worker.ts','dist/telemetry-fixture-worker.js');
  worker=new Miniflare(convertV4MiniflareOptions({
    handleStructuredLogs:entry=>warnings.push(entry.message),
    modules:true,scriptPath:'dist/telemetry-fixture-worker.js',compatibilityDate:'2026-10-12',compatibilityFlags:['nodejs_compat'],
    d1Databases:['AUTH_DB','RECOVERY_DB'],
    bindings:{AUTH_SECRET:'synthetic-auth-secret-at-least-32-characters',BASE_URL:'http://localhost:8787',RECOVERY_AUTHORITY_ID:'synthetic-authority',LOGNORTH_ENABLED:'true',LOGNORTH_URL:'https://telemetry.example.invalid',LOGNORTH_API_KEY:'lgn-'+ 'a'.repeat(64),LOGNORTH_ENVIRONMENT:'synthetic',LOGNORTH_RELEASE:'test-97'},
    outboundService:async request=>{
      attempts.push({url:request.url,authorization:request.headers.get('authorization'),redirect:request.redirect});
      const batch=await request.json() as {events:Array<Record<string,any>>};batches.push(batch);
      if(receiverMode==='timeout')return new Promise<Response>(()=>{});
      if(receiverMode==='slow-body')return new Response(new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode('{'));}}),{status:201});
      if(receiverMode==='redirect')return new Response(null,{status:302,headers:{location:'https://attacker.invalid/SECRET'}});
      if(receiverMode==='rejected')return new Response('SECRET ACK BODY',{status:429,headers:{'retry-after':'0'}});
      if(receiverMode==='malformed')return new Response('SECRET ACK BODY',{status:201});
      if(receiverMode==='oversize')return new Response('SECRET'.repeat(1000),{status:201});
      if(receiverMode==='partial')return Response.json({created:0,errors:['SECRET ACK BODY']},{status:201});
      if(receiverMode==='mismatch')return Response.json({created:batch.events.length+1},{status:201});
      if(receiverMode==='invalid-errors')return Response.json({created:batch.events.length,errors:'SECRET ACK BODY'},{status:201});
      return Response.json({created:batch.events.length},{status:201});
    }
  }));await worker.ready;await initializeTestRecovery(worker);
  const database=await worker.getD1Database('AUTH_DB');
  for(const file of (await readdir('migrations')).filter(name=>/^\d+.*\.sql$/.test(name)).sort())await database.exec((await readFile(`migrations/${file}`,'utf8')).replaceAll('\n',' '));
});
afterAll(async()=>{await worker?.dispose();});
test('account-context classifications never serialize upstream payloads or unknown codes',async()=>{
  for(const [envelope,outcome,code] of [
    [{status:'not-connected',secret:'SECRET'},'denied','NOT_CONNECTED'],
    [{status:'connected',account:{authenticated:true,id:'SECRET'},gyms:[],selectedGym:{id:'SECRET'}},'success',undefined],
    [{status:'authentication-required',error:{code:'AUTHENTICATION_FAILED',message:'SECRET',accessibleGymIds:['SECRET']}},'denied','AUTHENTICATION_FAILED'],
    [{status:'authentication-required',error:{code:'IDENTITY_MISMATCH',message:'SECRET'}},'technical_failure','IDENTITY_MISMATCH'],
    [{status:'invalid-settings',error:{code:'INVALID_TIME_ZONE_CONFIGURATION'}},'denied','INVALID_TIME_ZONE_CONFIGURATION'],
    [{status:'connected',secret:'SECRET'},'unclassified',undefined],
    [{status:'SECRET',error:{code:'SECRET',message:'SECRET'}},'unclassified',undefined],
  ] as const){
    await invoke('',envelope);const event=batches.at(-1)!.events[0]!;
    expect(event.context).toMatchObject({event_type:'mcp.tool.completed',tool:'get_account_context',outcome,environment:'synthetic',release:'test-97'});
    expect(event.context.code).toBe(code);expect(event.context.path).toBeUndefined();expect(event.context.status).toBeUndefined();
    expect(JSON.stringify(event)).not.toContain('SECRET');
    expect(Object.keys(event).sort()).toEqual(['context','duration_ms','message','timestamp','trace_id']);
    expect(event.duration_ms).toBeGreaterThanOrEqual(0);
    expect(event.context.error_class!==undefined).toBe(['technical_failure','unclassified'].includes(outcome));
  }
});
test('concurrent invocations receive fresh opaque correlation without cross-request buffers',async()=>{
  const before=batches.length;await Promise.all([invoke(),invoke()]);
  const events=batches.slice(before).flatMap(batch=>batch.events);expect(events).toHaveLength(2);
  expect(new Set(events.map(event=>event.trace_id)).size).toBe(2);
});
test('buffer prioritizes technical outcomes, bounds bytes/count and discards oversize whole events',async()=>{
  await invoke('?overflow');const events=batches.at(-1)!.events;
  expect(events).toHaveLength(32);expect(events.slice(-3).map(event=>event.context.outcome)).toEqual(['partial','denied','technical_failure']);
  expect(new TextEncoder().encode(JSON.stringify({events})).byteLength).toBeLessThanOrEqual(65536);
  for(const event of events)expect(new TextEncoder().encode(JSON.stringify(event)).byteLength).toBeLessThanOrEqual(2048);
  const before=attempts.length;await invoke('?oversize');expect(attempts).toHaveLength(before);
});
test('disabled and invalid configuration produce no ingestion or application failure',async()=>{
  const before=attempts.length;
  for(const query of ['?enabled=false','?enabled=wrong','?destination=http://attacker.invalid','?destination=https://attacker.invalid/path','?destination=https://user:password@attacker.invalid','?destination=https://attacker.invalid/?secret=SECRET','?key=lgn-agent-SECRET'])await invoke(query);
  expect(attempts).toHaveLength(before);
});
test('each malformed, rejected, redirect or partially accepted response ends after one attempt',async()=>{
  for(const mode of ['redirect','rejected','malformed','oversize','partial','mismatch','invalid-errors']){
    receiverMode=mode;const before=attempts.length;await invoke();expect(attempts).toHaveLength(before+1);
  }
  receiverMode='success';
  expect(new Set(attempts.map(attempt=>attempt.url))).toEqual(new Set(['https://telemetry.example.invalid/api/v1/events/batch']));
  expect(new Set(attempts.map(attempt=>attempt.authorization))).toEqual(new Set(['Bearer lgn-'+ 'a'.repeat(64)]));
  expect(warnings.length).toBeGreaterThan(0);
  expect(warnings.join(' ')).not.toContain('SECRET');
});
test('network and acknowledgement-body deadlines do not delay the response and cancel after two seconds',async()=>{
  for(const mode of ['timeout','slow-body']){
    receiverMode=mode;const before=attempts.length;
    const started=performance.now();await invoke();expect(performance.now()-started).toBeLessThan(1000);
    await new Promise(resolve=>setTimeout(resolve,2100));expect(attempts).toHaveLength(before+1);
  }
  receiverMode='success';
});
test('known configuration denials at HTTP 503 remain denials and hostile paths use static templates',async()=>{
  const auth=await worker.dispatchFetch('http://localhost:8787/api/auth/request-password-reset',{method:'POST',headers:{'content-type':'application/json',origin:'http://localhost:8787'},body:JSON.stringify({email:'SECRET@example.invalid'})});
  expect(auth.status).toBe(503);await settle();expect(batches.at(-1)!.events[0]!.context).toMatchObject({http_status:503,outcome:'denied',code:'EMAIL_UNAVAILABLE'});
  for(const [path,template] of [['/api/portal/connections/SECRET/revoke?token=SECRET','/api/portal/connections/:id/revoke'],['/portal/participants/SECRET/suspend','/portal/participants/:id/suspend'],['/SECRET?token=SECRET','unmatched']]){
    await worker.dispatchFetch('http://localhost:8787'+path,{headers:{authorization:'Bearer SECRET',cookie:'SECRET'}});await settle();
    const event=batches.at(-1)!.events[0]!;expect(event.context.path).toBe(template);expect(JSON.stringify(event)).not.toContain('SECRET');
  }
  const recovery=await worker.getD1Database('RECOVERY_DB');await recovery.exec("UPDATE recovery_head SET gate='closed'");
  const denied=await worker.dispatchFetch('http://localhost:8787/mcp',{method:'POST'});expect(denied.status).toBe(503);await settle();
  expect(batches.at(-1)!.events[0]!.context).toMatchObject({outcome:'technical_failure',code:'RECOVERY_UNAVAILABLE',http_status:503});
});

test('future or missing read discriminants remain classifier issues in the trusted-envelope native harness',async()=>{
 for(const kind of ['class-sessions','upcoming-bookings','booking-history','published-workouts','personal-activity','exercise-1rm','find-exercise-1rm','exercise-progression']){
  await invoke('?kind='+kind,{status:'SECRET_FUTURE',coverage:{status:'SECRET_FUTURE'},secret:'SECRET'});
  const event=batches.at(-1)!.events[0]!;
  expect(event.context).toMatchObject({outcome:'unclassified',error_class:'HostedClassifierFailure'});expect(JSON.stringify(event)).not.toContain('SECRET');
 }
});
test('every safe client error code maps to a closed diagnostic without safeError gym identifiers',async()=>{
 const denied=['AUTHENTICATION_FAILED','ACCESS_RESTRICTED','SESSION_EXPIRED','INVALID_CONFIGURATION','INVALID_TIME_ZONE_CONFIGURATION','NO_ACCESSIBLE_GYMS','DEFAULT_GYM_REQUIRED','GYM_NOT_ACCESSIBLE','GYM_TIME_ZONE_REQUIRED','CONFIRMED_GYM_TIME_ZONE_REQUIRED','INVALID_CLASS_QUERY','INVALID_WORKOUT_QUERY','INVALID_ACTIVITY_QUERY','INVALID_EXERCISE_QUERY','INVALID_BOOKING_PREPARATION_QUERY','INVALID_CANCELLATION_PREPARATION_QUERY','INVALID_BOOKING_EXECUTION_QUERY','INVALID_LATE_CANCELLATION_QUERY','BOOKING_REFERENCE_INVALID','INVALID_ACTIVITY_PUBLICATION_QUERY','INVALID_ACTIVITY_DELETION_EXECUTION_QUERY','ACTIVITY_REFERENCE_INVALID'];
 const technical=['IDENTITY_MISMATCH','REQUEST_FAILED','INVALID_RESPONSE','UNSUPPORTED_MEMBERSHIP','INVALID_CLASS_RESPONSE','INVALID_BOOKING_RESPONSE','INVALID_WORKOUT_RESPONSE','INVALID_ACTIVITY_RESPONSE','INVALID_EXERCISE_RESPONSE','INVALID_ACTIVITY_PREFERENCES','INVALID_ACTIVITY_SOURCE','ACTIVITY_LIMIT'];
 for(const [codes,outcome] of [[denied,'denied'],[technical,'technical_failure'],[['ACTION_OUTCOME_UNCERTAIN'],'uncertain']] as const)for(const code of codes){
  await invoke('',{status:'authentication-required',error:{code,message:'SECRET',accessibleGymIds:['SECRET']}});
  const event=batches.at(-1)!.events[0]!;expect(event.context).toMatchObject({outcome,code});expect(JSON.stringify(event)).not.toContain('SECRET');
 }
});
