import type { Classification } from './telemetry.js';

// Closed source labels: no identifiers, sporting values or response diagnostics.
export const activityOutcomeCodes = [
  'ACTIVITY_PUBLICATION_MISSING','ACTIVITY_PUBLICATION_UNSUPPORTED','ACTIVITY_PUBLICATION_REJECTED','ACTIVITY_PUBLICATION_STALE','ACTIVITY_PUBLICATION_UNCERTAIN',
  'ACTIVITY_DELETION_MISSING','ACTIVITY_DELETION_AMBIGUOUS','ACTIVITY_DELETION_PREPARATION_INCOMPLETE','ACTIVITY_DELETION_UNSUPPORTED','ACTIVITY_DELETION_STALE',
  'ACTIVITY_DELETION_STILL_VISIBLE','ACTIVITY_DELETION_CONFLICTING_IDENTITY','ACTIVITY_DELETION_READBACK_INCOMPLETE','ACTIVITY_DELETION_UNCERTAIN','observed_absent',
] as const;

/** Classify only the trusted, parsed account result, before MCP serialization. */
export function classifyActivityOutcome(kind:string,result:Record<string,unknown>):Classification|undefined {
  switch(kind){
    case 'prepare-activity-publication':
      switch(result.status){
        case 'draft': case 'ready': return {outcome:'success'};
        case 'missing': return {outcome:'denied',code:'ACTIVITY_PUBLICATION_MISSING'};
        case 'unsupported': return {outcome:'denied',code:'ACTIVITY_PUBLICATION_UNSUPPORTED'};
        default:return {outcome:'unclassified'};
      }
    case 'execute-activity-publication':
      switch(result.status){
        case 'confirmed':return {outcome:'success'};
        case 'rejected':return {outcome:'denied',code:'ACTIVITY_PUBLICATION_REJECTED'};
        case 'stale':return {outcome:'denied',code:'ACTIVITY_PUBLICATION_STALE'};
        case 'uncertain':return {outcome:'uncertain',code:'ACTIVITY_PUBLICATION_UNCERTAIN'};
        default:return {outcome:'unclassified'};
      }
    case 'prepare-activity-deletion':
      switch(result.status){
        case 'ready':return {outcome:'success'};
        case 'missing':return {outcome:'denied',code:'ACTIVITY_DELETION_MISSING'};
        case 'ambiguous':return {outcome:'denied',code:'ACTIVITY_DELETION_AMBIGUOUS'};
        case 'unsupported':return {outcome:'denied',code:'ACTIVITY_DELETION_UNSUPPORTED'};
        case 'incomplete':return {outcome:'technical_failure',code:'ACTIVITY_DELETION_PREPARATION_INCOMPLETE'};
        case 'foreign-owner':case 'foreign-gym':return {outcome:'technical_failure',code:'IDENTITY_MISMATCH'};
        default:return {outcome:'unclassified'};
      }
    case 'execute-activity-deletion':
      switch(result.status){
        case 'stale':return {outcome:'denied',code:'ACTIVITY_DELETION_STALE'};
        // This denotes fresh calendar absence only, never permanent erasure or RM effects.
        case 'observed-absent':return {outcome:'success',code:'observed_absent'};
        case 'still-visible':return {outcome:'uncertain',code:'ACTIVITY_DELETION_STILL_VISIBLE'};
        case 'conflicting-identity':return {outcome:'uncertain',code:'ACTIVITY_DELETION_CONFLICTING_IDENTITY'};
        case 'incomplete':return {outcome:'uncertain',code:'ACTIVITY_DELETION_READBACK_INCOMPLETE'};
        case 'uncertain':return {outcome:'uncertain',code:'ACTIVITY_DELETION_UNCERTAIN'};
        default:return {outcome:'unclassified'};
      }
    default:return undefined;
  }
}
