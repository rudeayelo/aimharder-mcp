const messages = {
  INVALID_ACTIVITY_QUERY: 'Supply valid inclusive gym-local dates spanning at most 31 calendar dates.',
  INVALID_ACTIVITY_RESPONSE: 'AimHarder returned unsupported or inconsistent personal activity data.',
  ACTIVITY_LIMIT: 'The activity detail limit of 500 records was reached; coverage is incomplete.',
  INVALID_WORKOUT_QUERY: 'Supply a valid gym-local date and exact className, with optional verified gymId.',
  INVALID_WORKOUT_RESPONSE: 'AimHarder returned an unsupported or incomplete gym feed. Workout retrieval could not be confirmed.',
  INVALID_BOOKING_RESPONSE: 'AimHarder returned an unsupported, restricted, or incomplete upcoming-booking response. Booking status could not be confirmed.',
  INVALID_TIME_ZONE_CONFIGURATION: 'AIMHARDER_GYM_TIME_ZONES must be a JSON object mapping gym IDs to confirmed IANA time zones.',
  GYM_TIME_ZONE_REQUIRED: 'A valid IANA zone could not be established for the selected gym. Check AIMHARDER_GYM_TIME_ZONES and restart. No date query was made.',
  INVALID_CLASS_QUERY: 'Supply valid inclusive calendar dates and optional startTime (HH:mm), className, and gymId filters.',
  INVALID_CLASS_RESPONSE: 'AimHarder returned an unsupported, restricted, or incomplete class response. No schedule is returned for this interval.',
  INVALID_CONFIGURATION: 'Set AIMHARDER_USERNAME and AIMHARDER_PASSWORD to non-empty values, and use a gym slug for AIMHARDER_DEFAULT_GYM if supplied.',
  AUTHENTICATION_FAILED: 'Authentication did not complete. Check credentials, additional authentication requirements, or account restrictions, then restart the server.',
  ACCESS_RESTRICTED: 'AimHarder denied access. Check account restrictions before trying again.',
  SESSION_EXPIRED: 'The session expired again after one reauthentication. No further retry was attempted.',
  INVALID_RESPONSE: 'AimHarder returned an unsupported or invalid response. Account or gym access could not be verified.',
  IDENTITY_MISMATCH: 'The authenticated account identity changed unexpectedly. Access could not be verified.',
  REQUEST_FAILED: 'The AimHarder request failed or attempted a redirect. No further retry was attempted.',
  NO_ACCESSIBLE_GYMS: 'No accessible gym was established from the account response.',
  UNSUPPORTED_MEMBERSHIP: 'The account includes an unverified membership format. Gym discovery could not be completed.',
  DEFAULT_GYM_REQUIRED: 'Multiple gyms are accessible. Set AIMHARDER_DEFAULT_GYM to one of their gym IDs and restart the server.',
  GYM_NOT_ACCESSIBLE: 'The requested or configured gym is not in the verified accessible gym list.',
} as const;

export class AimHarderError extends Error {
  constructor(readonly code: keyof typeof messages, readonly accessibleGymIds: string[] = []) {
    super(messages[code]);
    this.name = 'AimHarderError';
  }
}

export function safeError(error: unknown) {
  const safe = error instanceof AimHarderError ? error : new AimHarderError('REQUEST_FAILED');
  return { code: safe.code, message: safe.message, ...(safe.accessibleGymIds.length ? { accessibleGymIds: safe.accessibleGymIds } : {}) };
}
