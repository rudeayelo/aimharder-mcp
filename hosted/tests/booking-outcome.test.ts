import {expect,test} from 'vitest';
import {classifyBookingOutcome} from '../src/booking-outcome.js';
// Future/unreachable discriminants cannot be synthesized by today's production client.
// Keep this focused classifier guard separate from native authenticated journeys.
test('unknown booking variants remain unclassified without leaking future values or widening a tool contract',()=>{
 for(const kind of ['prepare-booking-creation','execute-booking-creation','prepare-booking-cancellation','execute-booking-cancellation','execute-late-booking-cancellation']){
  const action=kind.includes('creation')?'create':'cancel';
  for(const result of [{action,status:'PRIVATE_FUTURE'},{action,status:null},{action:'PRIVATE_FUTURE',status:'confirmed'},null,[]])
   expect(classifyBookingOutcome(kind,{status:'queried',result})).toEqual({outcome:'unclassified'});
 }
 expect(classifyBookingOutcome('execute-late-booking-cancellation',{status:'queried',result:{action:'cancel',status:'pending-credit-loss'}})).toEqual({outcome:'unclassified'});
 expect(classifyBookingOutcome('execute-booking-cancellation',{status:'queried',result:{action:'cancel',status:'waitlisted'}})).toEqual({outcome:'unclassified'});
 expect(classifyBookingOutcome('prepare-booking-cancellation',{status:'queried',result:{action:'cancel',status:'already-booked'}})).toEqual({outcome:'unclassified'});
});
