# AimHarder domain

AimHarder organizes scheduled classes, workout content, personal bookings, and personal activity at a gym. These concepts remain distinct even when they refer to the same training day.

## Language

**Pilot participant**:
A person invited to use the hosted AimHarder service with their own AimHarder account.
_Avoid_: Gym administrator or another member's account holder as an implied role.

**Self-service onboarding**:
An invited participant's setup of their service access, AimHarder connection and AI client without administrator intervention after invitation.
_Avoid_: Treating routine operator registration or private delivery of client configuration as self-service.

**Portal account**:
A participant's identity in the hosted service, distinct from their AimHarder account and their identities in AI clients.
_Avoid_: AimHarder account when referring to portal access.

**Service administrator**:
A portal account holder with the `admin` role who manages the pilot and feature availability by role. This role is distinct from an administrator of an AimHarder gym.
_Avoid_: Gym administrator as a synonym for service administrator.

**Pilot user**:
A portal account holder with the `user` role who participates in the invited pilot using their own AimHarder account.
_Avoid_: Using user to imply administrative privileges in the hosted service.

**Suspended portal account**:
A portal account whose access to the service is blocked by the administrator while its configuration is retained for possible reactivation. Suspension is distinct from deleting the account.
_Avoid_: Deleted account or disconnected AimHarder account as synonyms for suspension.

**Deleted portal account**:
A former participant's portal identity whose service access and active associated data have been removed. Minimal opaque denial records prevent old backups from restoring that identity's access.
_Avoid_: Suspension or AimHarder disconnection as a synonym for deletion.

**Controlled restoration**:
Operator recovery of service data that preserves later deletions and revocations before access resumes. Earlier copies do not acquire a new retention deadline through restoration.
_Avoid_: Restoring access merely because an old credential or authorization exists in a backup.

**AimHarder connection**:
The association between a portal account and its holder's linked AimHarder account. One connection can provide access to several gyms when that AimHarder account has those memberships.
_Avoid_: A separate AimHarder account for each gym.

**MCP client connection**:
A participant's authorization for an AI client, such as ChatGPT or Hermes, to use the hosted service on their behalf. Revoking it is distinct from disconnecting their AimHarder account.
_Avoid_: AimHarder connection when referring to a client's access to the service.

**AimHarder account**:
The participant's identity and access rights in AimHarder, distinct from their identity in the hosted service or an AI client.
_Avoid_: Using an unqualified account when the service identity and AimHarder identity could be confused.

**Class type**:
A category of class, such as WOD, Metcon, or Open Box.
_Avoid_: Workout when referring to a class category.

**Class session**:
A specific scheduled class at a gym on a particular date and time.
_Avoid_: Workout or booking when referring to the scheduled class itself.

**Workout**:
The prescribed training content, which may be shared by multiple class sessions. A workout published in a gym feed does not necessarily belong to one unique session.
_Avoid_: Class session when referring to training instructions.

**AMRAP result**:
The number of complete prescribed exercise rounds plus the scored repetitions completed in the next unfinished round. Repetition scoring follows the workout's convention and can count each completed metre of a distance exercise as one repetition.
_Avoid_: Requiring every scored repetition to be a movement repetition, or counting partial-round progress as another complete round.

**Exercise**:
A movement named in a workout prescription that may also have the account holder's recorded performance.
_Avoid_: Workout when referring to one movement.

**Source exercise ID**:
The validated `ejerId` from an AimHarder exercise row. Published workout variants may supply a canonical positive decimal string for this direct ID; the projection validates it as a safe integer. A difficulty-variant replacement can have a different ID from the unselected prescription; similar names do not prove shared identity.
_Avoid_: Exercise name as an identity key.

**RM record**:
A dated AimHarder load for the account holder and one exercise in a named repetition-maximum series, such as 1RM or 3RM. The latest record need not be the highest historical load.
_Avoid_: WOD series entry or prescribed load.

**RM progression**:
The dated sequence of an exercise's recorded RM values. A point in the sequence is not necessarily a newly achieved personal mark.
_Avoid_: New-mark history when referring to every recorded point.

**New RM mark**:
An exercise result that AimHarder identifies as a new mark for a named repetition count.
_Avoid_: Any RM progression point.

**WOD series entry**:
A dated point in AimHarder's personal WOD series for an exercise. It provides performance context but is not an RM record.
_Avoid_: 1RM or personal maximum.

**Calculated load**:
A load derived from an exercise's relative `%RM` prescription and a personal RM record. It is neither the original prescription nor a result achieved by the account holder.
_Avoid_: Recorded result or absolute source prescription.

**Booking**:
The account holder's reservation for a class session. A booking does not establish attendance.
_Avoid_: Attendance or completed workout as synonyms for a booking.

**Waitlist entry**:
The account holder's place in a class session's waiting list. It is not a confirmed booking or evidence of attendance.
_Avoid_: Confirmed booking.

**Booking credit**:
A unit of booking allowance granted by a subscription or session pack. Its availability and expiry belong to that credit source, not to a booking count.
_Avoid_: Booking or attendance as a synonym for credit.

**Credit balance**:
The currently available booking credits for a specific subscription or session pack and its validity period.
_Avoid_: A single monthly total across credit sources with different expiry rules.

**Action reference**:
A short-lived, single-use server token bound to one prepared booking or activity preview. A late-credit-loss warning can issue a separate reference only after a fresh check of the same still booked reservation. A reference identifies a proposed action, not a completed write or proof that the account holder confirmed it.
_Avoid_: Booking confirmation or reservation ID as synonyms for an action reference.

**Activity entry**:
A distinct record of the account holder's personal activity. Several entries on the same date remain separate entries, even when their content is similar. An entry does not by itself establish a booking or verified attendance.
_Avoid_: Booking or attendance as synonyms for an activity record.

**Training session**:
A distinct occurrence of personal training. Several activity entries may describe one training session; grouping requires evidence beyond a shared date or similar content.
_Avoid_: Treating every activity entry, active day, or booking as one verified training session.

**Day with activity**:
A gym-local calendar date with at least one personal activity entry. It does not state how many distinct training sessions occurred that day.
_Avoid_: Session count or attendance count when describing days with activity.
