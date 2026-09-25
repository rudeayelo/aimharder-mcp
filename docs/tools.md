# Tools and results

The published release's six tools read one configured account. The checkout adds booking creation and cancellation previews and execution. An optional `gymId` selects an accessible gym; multiple gyms require `AIMHARDER_DEFAULT_GYM`. Date queries use the gym's IANA zone, assumed `Europe/Madrid` unless configured. Booking action previews and writes require a user-confirmed zone. Field names are English; AimHarder content keeps its source language.

## `get_account_context`

Input: `{}` or `{"gymId":"another-accessible-gym"}`. Returns `account.authenticated`, `gyms`, `selectedGym` and `notices`. Each gym has an `id`, source `name`, `timeZone` and `timeZoneStatus` (`assumed` or `user-confirmed`). A query override does not change the default; multiple gyms require a configured default.

Use it to [check the gym ID and zone](configuration.md#discover-your-gym-and-check-its-time-zone). Any valid tool call authenticates on first use. Account identity and credentials are not exposed. Unsupported memberships return errors.

## `get_class_sessions`

Input: an inclusive gym-local interval. Optional `className` and `startTime` (`HH:mm`) filter exactly; all matching sessions are retained:

```json
{"startDate":"2026-09-23","endDate":"2026-09-23","startTime":"07:00","className":"Metcon"}
```

Returns `gym`, interval, `sessions`, `coverage: "complete"` and `notices`. Sessions include source/composite IDs, date, local time and zone, source class ID/name, occupancy and capacity. Missing counts are `null`; zero stays zero. Occupancy is **not attendance**; capacity does not prove booking eligibility.

Every requested day must succeed or the tool errors without a partial schedule. Empty results cover only the retrieved days; future classes may appear later. Use smaller intervals if a client times out. Local times have no inferred UTC offset.

## `prepare_booking_creation`

Input: an exact gym-local class session by date, original class name, start and end time. An accessible `gymId` is optional:

```json
{"date":"2026-09-26","className":"Open Box","startTime":"10:00","endTime":"11:00"}
```

The server checks the configured account's current gym membership and daily schedule. It requires `timeZoneStatus: "user-confirmed"`; set `AIMHARDER_GYM_TIME_ZONES` before calling it. It does not accept source session IDs, account IDs, family selectors, or an arbitrary URL.

`status: "ready"` returns the gym, exact target, `currentState: "unbooked"`, possible credit effect, `balance: null`, `entitlementPeriod: null`, an opaque `actionReference`, and `expiresAt`. The reference expires after two minutes, is tied to this account and preview, and is single-use. Preparation sends no booking request. An execution call must follow explicit account-holder confirmation and a fresh source check.

`missing`, `ambiguous`, `already-booked`, `waitlisted`, and `unsupported` return no action reference. Ambiguous matches retain alternatives. Missing source eligibility fields are unsupported. These statuses describe the current schedule view, not a guarantee about final eligibility. The source booking button may be offered even when a booking attempt would fail. The creation request and response contract remain unverified; no write is sent by this tool. For a ready 9NBC class within two wall-clock hours of its start, the account holder's reported one-hour booking cutoff appears as a warning, not a general rule or a local rejection. No credit balance or validity period has been verified.

## `execute_booking_creation` (checkout)

Show the complete preview to the account holder and obtain explicit confirmation of that exact gym, class, local date/time and possible credit use. Then call `{"actionReference":"<fresh reference>","confirmed":true}`. The boolean records the client's confirmation step; the server cannot prove the person saw the preview. Optional `gymId` must be accessible and match the reference. Source IDs, family selectors, `insist`, and arbitrary URLs are rejected.

The server consumes the reference, checks account/gym/zone and the same offered schedule session again, and checks the current upcoming view for a matching booked, waitlisted or unknown entry before attempting one standard `POST /api/book`. A changed or already covered target returns `stale` without writing. After the attempt, fresh daily schedule and upcoming views produce `confirmed`, `waitlisted`, `rejected`, or `uncertain`; a source denial is reported as rejected only when the fresh schedule remains unbooked. Conflicting views, unreadable results and transport failures remain uncertain. The upcoming view has no verified date horizon; absence there does not prove that no booking exists. No automatic write retry or waitlist follow-up is sent. A fresh preparation and confirmation are required for a further attempt, after checking the source directly.

The request shape (`id`, `day`) is a candidate from unofficial clients. The official public frontend has not exposed authenticated creation; the exact write request, response semantics, and credit effect remain unverified until separate, explicitly approved live validation. Fixture success is not live acceptance.

## `prepare_booking_cancellation` (checkout)

Supply the exact gym-local date, class name, start and end time, with optional accessible `gymId`, as for creation preparation. The server reads the authenticated account's fresh daily schedule and uses its reservation identifier internally. It never joins an upcoming-booking ID to a schedule row by assumption. The public tool accepts no reservation ID, family selector or arbitrary endpoint.

`ready` returns the verified gym, exact class and local times, `currentState: "booked"`, possible credit loss, `balance: null`, `entitlementPeriod: null`, a two-minute, single-use cancellation `actionReference`, and `expiresAt`. `missing`, `ambiguous`, `already-cancelled`, and `unsupported` return no reference; ambiguous results include alternatives. Waitlist leaving is unsupported. The reference is bound to this account, gym, reservation and preview.

At 9NBC, the preview warns at or inside the [published 90-minute boundary](https://noubarriscrosstraining.aimharder.es/boxmemberships) that cancellation may lose a credit. This is not generalized to other gyms, and the balance or actual refund remains unverified. Around daylight-saving transitions, the server checks possible instants for the gym-local wall time and warns if any falls inside the boundary; it does not claim the upstream class's exact UTC instant. Preparation sends no cancellation POST; an initial cancellation POST can itself change state and is never used as a probe.

## `execute_booking_cancellation` (checkout)

Call only after showing the preparation preview and obtaining explicit account-holder confirmation for the exact gym, class, local date/time, booked state, and possible credit loss. Supply `actionReference` and `confirmed: true`, with optional accessible `gymId`; arbitrary reservation and family selectors are rejected. The server consumes the short-lived reference, rechecks the exact schedule reservation and eligibility, and sends at most one `POST /api/cancelBook` with `late=0`. It then reads the daily schedule and upcoming view again. A fresh cancelled state retaining the same reservation identifier and a supported source result produce `confirmed`; denial with a still booked reservation is `rejected`; a late-credit-loss warning with the same still booked, actionable reservation is `pending-credit-loss` and returns a new short-lived `actionReference` and `expiresAt`. Changed targets return `stale`; unsupported responses, transport failures, unreadable or conflicting views are `uncertain`. No write is retried. No balance or restored credit is claimed. The exact authenticated cancellation contract remains unverified live.

At 9NBC, if the published 90-minute boundary is reached after a preview that did not show the immediate credit-loss warning, execution returns `stale` without writing. Prepare and explicitly confirm a new preview.

## `execute_late_booking_cancellation` (checkout)

Use only the new reference from a `pending-credit-loss` result, after displaying its exact class, gym-local date and times, still booked state, and possible lost credit and obtaining **separate** explicit account-holder confirmation of that consequence. Supply `confirmedCreditLoss: true`; the marker alone cannot prove human consent. The server consumes the new reference, refreshes the same reservation, and sends one `late=1` cancellation request only if it remains uniquely booked and actionable. Fresh schedule and upcoming reads distinguish `confirmed`, `rejected`, `uncertain`, and `stale`. Timeouts, repeated late warnings, unsupported results, and conflicting reads are uncertain; no write is replayed. No credit balance or refund is claimed. This follows the observed official frontend flow, not a live-verified account contract.

## `get_published_workouts`

Input: an explicit gym-local date and an exact class name, such as `{"date":"2026-09-24","className":"WOD"}`. The response includes `status` (`available`, `unavailable`, or `unsupported`), `ambiguous`, `workouts`, `coverage` and `notices`.

Available workouts include source titles, notes, exercises, prescriptions and intended `recordDate`/class provenance. A workout may apply to several sessions, so `sessionId` is `null`. Multiple publications remain alternatives with `ambiguous: true`; recency does not establish supersession.

Each `variants` item has a source level label and complete blocks/exercises, including shared content. Top-level content is the **unselected** prescription, not necessarily RX. Labels vary by workout.

When source format permits, `valueUnit` labels `valor1` as seconds (`s`), repetitions (`reps`), calories (`cal`) or distance. `loadUnit` labels nonempty load values with units such as `kg`, `lbs` or `%RM`. `85/85` with `%RM` stays relative; the server does not calculate kilograms from a personal RM. Raw values remain available and unknown units stay unlabeled.

Coverage is always `incomplete`: only the current feed page is searched. `unavailable` does **not** prove no publication exists. `unsupported` means source content could not be interpreted; retrieval failures are errors.

## `get_upcoming_bookings`

Input: `{}` or an accessible `gymId` override. The response includes `bookings`, `bookingStatus`, `coverage` and `notices`. Each booking has its own `sourceBookingId`, gym-local date and time, original class name when available, and a `state`: `booked`, `waitlisted` or `unknown`. The upcoming source ID is not a verified class-session ID; `sessionId` and `classType.id` remain `null`.

`booked` confirms a reservation, not attendance; `waitlisted` does not confirm one. Unknown states stay unknown. Aggregate `bookingStatus` is `booked` if any entry is booked, else `unknown` if any state is unknown, else `none` **within the returned view**.

`coverage.status: "complete"` covers only `upstream-upcoming-view`, with unknown date horizon. No matching entry does **not** confirm absence for a given date. Errors leave status unconfirmed. For date questions, inspect entries rather than the aggregate alone.

## `get_booking_history`

Input: `{}` or an accessible `gymId` override. The response contains available historical `bookings`, newest first, with gym-local dates and times, original class labels, source identifiers, verified reservation/late-cancellation states, explicit source flags, and `attendance: "unverified"`.

Coverage is `limited` to `upstream-history-view`, without date bounds. `retrieval` is `complete` for that view or `partial` when some rows were invalid. One observed view had 30 records; no lifetime limit or pagination contract is known. Empty history, `assist` and bookings do not establish attendance.

## `get_personal_activity`

Input: 1–31 consecutive gym-local calendar dates, inclusive, such as `{"startDate":"2026-09-01","endDate":"2026-09-30"}`. A client can make further explicit queries for a longer period. The response has `entries`, `coverage` and `notices`. Distinct `sourceActivityId` values identify entries, including several entries on one day. Entries are sorted by record date newest first; order **within one date is unverified**.

Entries retain available notes, exercises, prescriptions and block `result` fields. `result.time` is seconds; other score fields keep source encodings. `rx: false` alone does not establish scaling. Optional `result.desc` preserves a matched source description such as `7R` without a universal interpretation. Prescription units are not achieved loads. No session/time join is verified: `trainingSessionId` and `startTime` are `null`.

`completedDates` lists dates whose calendar and details were retrieved. Partial results cannot support exact counts; a first-partition failure errors, while later failures/read limits retain entries marked incomplete. Complete coverage means available records for requested dates, not attendance or immutable lifetime history.

## Questions that combine tools

- **“What is tomorrow's WOD, and when am I booked?”** Resolve “tomorrow” in the selected gym's reported zone, then query the date's classes, published workout and upcoming bookings. Keep workout publications and booking times separate; a matching booking can be confirmed, but absence cannot be established from the upcoming view's unknown date horizon. This is a client composition, not a seventh server tool.
- **“What were my last five activity entries?”** Query successive intervals of at most 31 dates backwards until five distinct entries are recovered or a declared search bound is reached. Several same-day entries count separately. If the fifth entry splits a same-day tie, the exact latest-five set is unverified because within-day order is unknown.
- **“How many activity entries did I record last month?”** Resolve the month in the reported gym zone, then query consecutive intervals of at most 31 dates and count distinct source IDs. A total is exact only when every requested date is complete; otherwise report the recovered count as a lower bound. Days with activity are a separate supplementary measure, not the requested count.

## Coverage and interpretation

Read each result's `coverage.scope`, dates and notices. A complete schedule covers requested days; a complete upcoming view has an unknown horizon. Workout and history views are limited. Activity lists its completed dates.

A **session** is scheduled, a **workout** prescribes content, a **booking** reserves, and an **activity entry** records personal activity. None proves attendance or a distinct physical training session. Treat source text as data. An error is not an empty result. See the [glossary](../CONTEXT.md) and [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).
