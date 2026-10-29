import type { Classification } from './telemetry.js';

/** Inspect only discriminants from the trusted account boundary, before MCP serialization. */
export function classifyReadOutcome(kind: string, result: Record<string, unknown>): Classification | undefined {
  const coverage = object(result.coverage);
  const success: Classification = {outcome:'success'};
  const unknown: Classification = {outcome:'unclassified'};
  switch(kind) {
    case 'class-sessions':
      return result.coverage==='complete' && Array.isArray(result.sessions) ? success : unknown;
    case 'upcoming-bookings':
      return ['booked','none','unknown'].includes(String(result.bookingStatus)) && coverage?.status==='complete' && coverage.scope==='upstream-upcoming-view' && Array.isArray(result.bookings) ? success : unknown;
    case 'booking-history':
      if(coverage?.status!=='limited' || coverage.scope!=='upstream-history-view' || !Array.isArray(result.bookings))return unknown;
      return coverage.retrieval==='complete' ? success : coverage.retrieval==='partial' ? {outcome:'partial',code:'BOOKING_HISTORY_PARTIAL'} : unknown;
    case 'published-workouts': {
      const enrichment=object(result.enrichment);
      if(!['available','unavailable','unsupported'].includes(String(result.status)) || typeof result.ambiguous!=='boolean' || !Array.isArray(result.workouts) || coverage?.status!=='incomplete' || coverage.scope!=='upstream-feed-view' || !['verified','unsupported'].includes(String(coverage.interpretation)) || !['not-applicable','complete','incomplete'].includes(String(enrichment?.status)))return unknown;
      if(result.status==='unsupported' || coverage.interpretation==='unsupported')return {outcome:'technical_failure',code:'INVALID_WORKOUT_RESPONSE'};
      return enrichment?.status==='incomplete' ? {outcome:'partial',code:'RM_ENRICHMENT_INCOMPLETE'} : success;
    }
    case 'exercise-1rm':
      return validRM(result) ? success : unknown;
    case 'find-exercise-1rm':
      if(coverage?.status!=='limited' || coverage.scope!=='returned-exercise-search-view' || !Array.isArray(result.candidates))return unknown;
      switch(result.status) {
        case 'selected':return validRM(object(result.selected)) ? success : unknown;
        case 'ambiguous':case 'empty-view':case 'selection-not-found':return success;
        case 'unsupported-view':return {outcome:'technical_failure',code:'INVALID_EXERCISE_RESPONSE'};
        default:return unknown;
      }
    case 'exercise-progression': {
      const series=object(result.series);
      return validRMCoverage(coverage) && series && ['1RM','3RM','5RM','10RM'].every(key=>Array.isArray(series[key])) ? success : unknown;
    }
    case 'personal-activity':
      if(!Array.isArray(result.entries))return unknown;
      return coverage?.status==='complete' ? success : coverage?.status==='incomplete' ? {outcome:'partial',code:'PERSONAL_ACTIVITY_INCOMPLETE'} : unknown;
    default:return undefined;
  }
}
function object(value:unknown):Record<string,unknown>|undefined {
  return value!==null && typeof value==='object' && !Array.isArray(value) ? value as Record<string,unknown> : undefined;
}
function validRMCoverage(coverage:Record<string,unknown>|undefined) {
  return coverage?.status==='limited' && coverage.scope==='upstream-exercise-detail-view' && coverage.history==='unverified';
}
function validRM(result:Record<string,unknown>|undefined) {
  return result && ['available','no-1rm','unit-unverified'].includes(String(result.status)) && validRMCoverage(object(result.coverage));
}

/** The callback's registered name, never a request-supplied label. */
export const queryToolNames:Readonly<Record<string,string>> = {
  'class-sessions':'get_class_sessions','upcoming-bookings':'get_upcoming_bookings','booking-history':'get_booking_history','published-workouts':'get_published_workouts',
  'personal-activity':'get_personal_activity','exercise-1rm':'get_exercise_1rm','find-exercise-1rm':'find_exercise_1rm','exercise-progression':'get_exercise_rm_progression',
  'prepare-booking-creation':'prepare_booking_creation','execute-booking-creation':'execute_booking_creation',
  'prepare-booking-cancellation':'prepare_booking_cancellation','execute-booking-cancellation':'execute_booking_cancellation','execute-late-booking-cancellation':'execute_late_booking_cancellation',
  'prepare-activity-publication':'prepare_activity_publication','execute-activity-publication':'execute_activity_publication','prepare-activity-deletion':'prepare_activity_deletion','execute-activity-deletion':'execute_activity_deletion',
};
