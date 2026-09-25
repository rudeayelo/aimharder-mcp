# AimHarder domain

AimHarder organizes scheduled classes, workout content, personal bookings, and personal activity at a gym. These concepts remain distinct even when they refer to the same training day.

## Language

**Class type**:
A category of class, such as WOD, Metcon, or Open Box.
_Avoid_: Workout when referring to a class category.

**Class session**:
A specific scheduled class at a gym on a particular date and time.
_Avoid_: Workout or booking when referring to the scheduled class itself.

**Workout**:
The prescribed training content, which may be shared by multiple class sessions. A workout published in a gym feed does not necessarily belong to one unique session.
_Avoid_: Class session when referring to training instructions.

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
A short-lived, single-use server token bound to one prepared booking creation or cancellation preview. A late-credit-loss warning can issue a separate reference only after a fresh check of the same still booked reservation. A reference identifies a proposed action, not a completed write or proof that the account holder confirmed it.
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
