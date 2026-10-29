import type { Classification } from './telemetry.js';

/** Closed domain classifications from the trusted account envelope, before MCP serialization. */
export function classifyBookingOutcome(kind:string,envelope:Record<string,unknown>):Classification|undefined {
  const creation=kind==='prepare-booking-creation'||kind==='execute-booking-creation';
  const cancellation=['prepare-booking-cancellation','execute-booking-cancellation','execute-late-booking-cancellation'].includes(kind);
  if(!creation&&!cancellation)return;
  if(envelope.status!=='queried')return;
  const result=envelope.result;
  if(!result||typeof result!=='object'||Array.isArray(result))return {outcome:'unclassified'};
  const {action,status}=result as Record<string,unknown>;
  if(action!==(creation?'create':'cancel'))return {outcome:'unclassified'};
  if(kind.startsWith('prepare-')){
    if(status==='ready')return {outcome:'success'};
    if(['ambiguous','missing','unsupported',...(creation?['already-booked','waitlisted']:['already-cancelled'])].includes(String(status)))return {outcome:'denied',code:'BOOKING_NOT_EXECUTABLE'};
  }else{
    if(status==='confirmed')return {outcome:'success'};
    if(status==='uncertain')return {outcome:'uncertain',code:'BOOKING_EFFECT_UNCONFIRMED'};
    if(status==='stale')return {outcome:'denied',code:'BOOKING_STALE'};
    if(status==='rejected')return {outcome:'denied',code:'BOOKING_REFUSED'};
    if(creation&&status==='waitlisted')return {outcome:'denied',code:'BOOKING_WAITLISTED'};
    if(kind==='execute-booking-cancellation'&&status==='pending-credit-loss')return {outcome:'denied',code:'BOOKING_CREDIT_CONFIRMATION_REQUIRED'};
  }
  return {outcome:'unclassified'};
}
