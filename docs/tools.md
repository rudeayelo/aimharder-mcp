# Tools and results

Version `0.4.0` exposes eighteen tools for one configured account, including read queries, booking previews and actions, own-account exercise RM queries, and activity publication/deletion previews and actions. Exact public artifact verification is recorded separately in [validation](validation.md). An optional `gymId` selects an accessible gym; multiple gyms require `AIMHARDER_DEFAULT_GYM`. Date queries use the gym's IANA zone, assumed `Europe/Madrid` unless configured. Booking and activity actions require a user-confirmed zone. Field names are English; AimHarder content keeps its source language.

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

`missing`, `ambiguous`, `already-booked`, `waitlisted`, and `unsupported` return no action reference. Ambiguous matches retain alternatives. Missing required source eligibility fields are unsupported; the `hidden` field may be absent because the observed schedule omits it and the official renderer does not require it for the booking button. These statuses describe the current schedule view, not a guarantee about final eligibility. The source booking button may be offered even when a booking attempt would fail, and `enabled=1` does not establish the account's booking window. One standard creation at 9NBC was observed live; preparation itself sends no write. For a ready 9NBC class within two wall-clock hours of its start, the account holder's reported one-hour booking cutoff appears as a warning, not a general rule or a local rejection. No credit balance or validity period has been verified.

## `execute_booking_creation`

Show the complete preview to the account holder and obtain explicit confirmation of that exact gym, class, local date/time and possible credit use. Then call `{"actionReference":"<fresh reference>","confirmed":true}`. The boolean records the client's confirmation step; the server cannot prove the person saw the preview. Optional `gymId` must be accessible and match the reference. Source IDs, family selectors, `insist`, and arbitrary URLs are rejected.

The server consumes the reference, checks account/gym/zone and the same offered schedule session again, and checks the current upcoming view for a matching booked, waitlisted or unknown entry before attempting one standard `POST /api/book`. A changed or already covered target returns `stale` without writing. After the attempt, fresh daily schedule and upcoming views produce `confirmed`, `waitlisted`, `rejected`, or `uncertain`; a source denial is reported as rejected only when the fresh schedule remains unbooked. Conflicting views, unreadable results and transport failures remain uncertain. The upcoming view has no verified date horizon; absence there does not prove that no booking exists. No automatic write retry or waitlist follow-up is sent. A fresh preparation and confirmation are required for a further attempt, after checking the source directly.

The request shape (`id`, `day`) was observed in one confirmed standard 9NBC Open Box booking. Its HTTP response included `bookState=1`, but fresh schedule and upcoming reads established the booked state. Denials, waitlists, other gyms, and the actual credit effect remain unverified live; fixture success does not establish those branches.

## `prepare_booking_cancellation`

Supply the exact gym-local date, class name, start and end time, with optional accessible `gymId`, as for creation preparation. The server reads the authenticated account's fresh daily schedule and uses its reservation identifier internally. It never joins an upcoming-booking ID to a schedule row by assumption. The public tool accepts no reservation ID, family selector or arbitrary endpoint.

`ready` returns the verified gym, exact class and local times, `currentState: "booked"`, possible credit loss, `balance: null`, `entitlementPeriod: null`, a two-minute, single-use cancellation `actionReference`, and `expiresAt`. `missing`, `ambiguous`, `already-cancelled`, and `unsupported` return no reference; ambiguous results include alternatives. Waitlist leaving is unsupported. The reference is bound to this account, gym, reservation and preview.

At 9NBC, the preview warns at or inside the [published 90-minute boundary](https://noubarriscrosstraining.aimharder.es/boxmemberships) that cancellation may lose a credit. This is not generalized to other gyms, and the balance or actual refund remains unverified. Around daylight-saving transitions, the server checks possible instants for the gym-local wall time and warns if any falls inside the boundary; it does not claim the upstream class's exact UTC instant. Preparation sends no cancellation POST; an initial cancellation POST can itself change state and is never used as a probe.

## `execute_booking_cancellation`

Call only after showing the preparation preview and obtaining explicit account-holder confirmation for the exact gym, class, local date/time, booked state, and possible credit loss. Supply `actionReference` and `confirmed: true`, with optional accessible `gymId`; arbitrary reservation and family selectors are rejected. The server consumes the short-lived reference, rechecks the exact schedule reservation and eligibility, and sends at most one `POST /api/cancelBook` with `late=0`. It then reads the daily schedule and upcoming view again. A supported `cancelState=1` with a nonconflicting cancelled row retaining the reservation identifier, or with the same class session now unbooked and its reservation identifier removed, produces `confirmed`. Denial with a still booked reservation is `rejected`; a late-credit-loss warning with the same still booked, actionable reservation is `pending-credit-loss` and returns a new short-lived `actionReference` and `expiresAt`. Changed targets return `stale`; unsupported responses, transport failures, unreadable or conflicting views are `uncertain`. No write is retried. No balance or restored credit is claimed. One standard 9NBC cancellation was observed live; the corrected unbooked-row `confirmed` branch is fixture-tested after that write.

At 9NBC, if the published 90-minute boundary is reached after a preview that did not show the immediate credit-loss warning, execution returns `stale` without writing. Prepare and explicitly confirm a new preview.

## `execute_late_booking_cancellation`

Use only the new reference from a `pending-credit-loss` result, after displaying its exact class, gym-local date and times, still booked state, and possible lost credit and obtaining **separate** explicit account-holder confirmation of that consequence. Supply `confirmedCreditLoss: true`; the marker alone cannot prove human consent. The server consumes the new reference, refreshes the same reservation, and sends one `late=1` cancellation request only if it remains uniquely booked and actionable. Fresh schedule and upcoming reads distinguish `confirmed`, `rejected`, `uncertain`, and `stale`. Timeouts, repeated late warnings, unsupported results, and conflicting reads are uncertain; no write is replayed. No credit balance or refund is claimed. This follows the observed official frontend flow, not a live-verified account contract.

## `get_published_workouts`

Input: an explicit gym-local date and an exact class name, such as `{"date":"2026-09-24","className":"WOD"}`. The response includes `status` (`available`, `unavailable`, or `unsupported`), `ambiguous`, `workouts`, `enrichment`, `coverage` and `notices`.

Available workouts include source titles, notes, exercises, prescriptions and intended `recordDate`/class provenance. A workout may apply to several sessions, so `sessionId` is `null`. Multiple publications remain alternatives with `ambiguous: true`; recency does not establish supersession.

Each `variants` item has a source level label and complete blocks/exercises, including shared content. Top-level content is the **unselected** prescription, not necessarily RX. Labels vary by workout.

Each exercise in the unselected prescription and each variant has `sourceExerciseId`, taken only from a positive, safe integer upstream `ejerId` or its canonical decimal-string representation. `null` means the row supplied no supported identity. A replacement variant uses its own ID; a shared exercise keeps its source ID. Names never establish identity or a personal-record join.

When source format permits, `valueUnit` labels `valor1` as seconds (`s`), repetitions (`reps`), calories (`cal`) or distance. `loadUnit` labels nonempty load values with units such as `kg`, `lbs` or `%RM`. Raw values remain available and unknown units stay unlabeled.

For a requested date today or later in the reported gym zone, each `%RM` exercise in every returned publication and source-labeled variant receives `personalLoad`. Its `alternatives` preserve the original percentage, source field and label, exact source exercise ID, latest dated 1RM basis, verified physical unit and precise `1RM × percentage / 100` result. This formula is a product rule, not a verified AimHarder rule; no conversion or plate rounding occurs. A separately supplied `valor2h`/`valor2m` pair produces male/female source-labeled alternatives without profile selection. An equal preformatted pair such as `85/85` produces one load; an unequal or malformed unstructured pair remains uncalculated. Missing identity, 1RM, physical unit, supported percentage, or an ordinary failed/bounded personal detail read produces an unavailable reason while retaining the prescription. Authentication, access, account-identity and gym-verification failures stop the tool with a safe error. At most 24 distinct personal exercise IDs are read per workout query; repeated IDs reuse the result. `enrichment` reports complete or incomplete coverage of eligible exercises in the **returned** workouts. Past dates have `not-applicable` enrichment and no present-day `personalLoad`.

Coverage is always `incomplete`: only the current feed page is searched. `unavailable` does **not** prove no publication exists. `unsupported` means source content could not be interpreted; retrieval failures are errors.

## `prepare_activity_publication`

Prepare one own activity entry from a workout source ID returned by `get_published_workouts` for the selected gym. With no result or actual load, the tool returns a read-only `draft` with exercise suggestions and no action reference. After choosing a load actually used, prepare again with a supported structured block result or a deliberately confirmed actual kilogram load to obtain a `ready` reference. A general comment alone cannot authorize a publication. Optional `activityDate` defaults to the workout's intended date and must be today or earlier in a configured, user-confirmed gym zone. When several difficulty levels exist, pass exactly one source label in `variantLabel`; a sole level is selected automatically.

```json
{"sourceActivityId":8001,"activityDate":"2026-09-28","variantLabel":"RX","blockResults":[{"blockIndex":0,"kind":"time-seconds","value":275}]}
```

The current supported result inputs include elapsed seconds for a source For Time or RFT block, rounds and leftover repetitions in separately mapped fields for an AMRAP/RFT or compatible free-text block, and numeric kilograms, pounds, or repetitions for a free-text block whose verified result code names that unit. A compatible block may accept both time and completed repetitions, or rounds and leftover repetitions, in one preparation. The `rondas` source field is a prescription field; a completed-round result uses `res`, while leftover repetitions use `reps`. Other score formats and arbitrary text are rejected. `actualLoads` accepts entries with `exerciseIndex`, a positive decimal `actualKilograms`, `confirmedActual: true`, and an optional source alternative label. It supports an eligible `%RM` row, a row already prescribed in kg, or an empty load field whose verified Copy format is repetitions with load (`formaReg=4`) and whose input unit is kilograms (`tipoud=0`). The last case preserves the empty original prescription without adding a prescribed `loadUnit`; its calculated suggestion is unavailable with reason `no-relative-load-prescription`. Unknown units and other exercise formats remain unsupported. This input identifies the value actually used; it is not a conversion merely because a unit label changed. The fixture-tested execution path writes it only after confirmation; numeric persistence remains unverified live.

A `ready` response includes the verified gym, source, intended and chosen dates, selected difficulty, full effective prescription, entered results, current account publication audience, separate WOD TV result setting, and a two-minute single-use reference. Both `draft` and `ready` show `exerciseSuggestions` for effective `%RM` rows before an actual load is chosen. Each alternative retains the original source percentage and a date-correct suggestion or an explicit unavailable reason; split male/female alternatives are shown separately without selecting a profile. Each entered actual kilogram load then shows the original prescription, a separately confirmed actual number, and its selected suggestion or an unavailable reason. A suggestion uses only the exact source exercise ID's latest uniquely dated own 1RM on or before the activity date, with a same-action history description corroborating kilograms; it applies precise percentage arithmetic without plate rounding. A later RM is excluded. A manual actual load remains possible without a calculable suggestion. At most 24 distinct eligible personal exercise IDs are read; unsupported percentages and missing IDs cause no personal request. Source history completeness and RM gym of origin remain unverified.

Preparation is read-only. `missing` means the source was absent from the bounded current gym feed, not that it never existed. `unsupported` and safe errors return no reference for mismatched Copy content, unknown preferences, future dates, invalid variants, or unsupported scores. For split kg prescriptions, the gym detail may display `first/second` while Copy uses `valor2=first`, `valor2h=first`, and `valor2m=second`; this exact normalization is accepted only when both alternatives agree. A manually entered actual kg value needs no inferred sex or source alternative. Decimal-string exercise IDs in variant rows are accepted only when they represent positive safe integers. The current own activity detail provides no reliable Copy-source linkage, so same-date entries alone do not produce a duplicate warning.

## `execute_activity_publication`

Input: the `actionReference` from one ready preview, `confirmed: true` after the account holder reviews that exact action, and an optional accessible `gymId`. A missing or false confirmation fails before any write. The reference expires after two minutes and is consumed on the first valid execution attempt. Execution rechecks account membership, confirmed gym zone, current account publication and WOD TV preferences, current gym feed, workout, Copy identity, effective variant and all mapped form fields. A change or unsupported Copy field returns `stale` without a POST.

One confirmed execution sends at most one multipart `POST /api/activity` to the verified selected gym origin. It does not choose a per-entry audience. An eligible `%RM`, fixed-kg, or empty verified kilogram-input exercise may receive a manually confirmed `actualKilograms` value; the verified Copy editor writes it to the effective row's `valor2` and sets `tipoud` to `0` (kg). The account holder may identify `single`, `male`, or `female` source alternatives; split alternatives are never chosen from an inferred profile. A direct manual load is allowed without a source exercise ID or calculable RM. The preview preserves the original prescription separately from the actual load. Shared rows in the selected variant and only the chosen `scaledver` replacement change; other variant rows retain their source values. In the observed editor flow, split `valor2h`/`valor2m` source fields also remain in the payload, so confirmation checks the explicit `valor2`/kg pair. A fresh own read-back has fixture coverage; numeric kilogram persistence is not yet verified live.

The result separates the accepted response ID (`acceptedResponseId`) from `confirmed`: only a fresh own calendar entry plus owner, gym, date, copied exercise identities and prescriptions, and submitted block results and actual loads in detail can confirm the publication. A requested comment must also exactly match the own detail's `activityDesc`; a missing field produces `observedEntry: "unverified-comment"` and an `uncertain` result, while a different value is `conflicting`. Source formatting changes may therefore prevent confirmation even when the comment was stored. The preparation snapshot retains the original prescription, suggestion, RM basis and actual load as separate values. `sourceProvenance.originalPrescription` appears only if the gym publication is fetched and matched again after a confirmed own read-back; otherwise its status is `unavailable`. An explicit upstream rejection returns `rejected`; missing/conflicting read-back, unexpected responses, and transport failures remain `uncertain`. If the response has no usable ID, `observedEntry: "unidentified"` means the calendar row cannot be linked to that POST; it does not claim absence. No possibly sent POST is retried automatically. The [anonymized MCP client journey](../tests/activity-journey.test.ts) exercises publication followed by deletion, exact previews, one write per action, and fresh own read-backs. It does not establish live AimHarder persistence, effective audience, or deletion permanence. One separately confirmed live attempt on 2026-10-01 returned `rejected`; successful publication remains unverified.

For a structurally valid rejection, `rejectionDiagnostics` reports counts of the four upstream error arrays and deduplicated `blockIndices`/`exerciseIndices` only for canonical nonnegative integer references within the submitted Copy arrays. These are Copy-array positions, not source exercise IDs or a diagnosis of why a field failed; they are not indices into a variant-filtered preview. Error messages, arbitrary objects, private identifiers, invalid indices, and raw responses are withheld. Accepted and malformed responses, transport failures, and execution paths that stop before a POST have no rejection diagnostics. This diagnostic addition does not trigger a retry or prove that no separate entry exists. The rejected live attempt preceded this addition, so its discarded detail cannot be reconstructed.

## `get_exercise_1rm`

Input: one known positive integer source exercise ID, such as `{"exerciseId":101}`. An accessible `gymId` may select the origin used for the read. The account holder's user ID is derived from the authenticated session and is never an input or output. Arbitrary URLs and member selectors are rejected.

`status: "available"` returns the exercise's validated source ID and name, the **latest dated** 1RM value, its source calendar date and a `kg` or `lbs` unit corroborated by a same-date, same-action source history description containing that exact load. This is not the historical maximum. `unit-unverified` retains the latest value and source date with `unit: null` when the source cannot corroborate a physical unit; the chart field named `lbs` and the `ud` code do not establish it alone. `no-1rm` means no 1RM was present in the returned exercise-detail view. The response also counts available 3RM, 5RM, 10RM and **separate WOD** entries without treating them as 1RM values.

Coverage is `limited` to one exercise-detail response with unverified history completeness and gym of origin. The observed numeric source dates represent UTC midnight; the tool accepts that format and calls the resulting calendar date a source date, not a publication date. Unsupported dates, conflicting latest points, malformed responses, or an identity mismatch are errors rather than invented records. Exercise names and history text are untrusted source data; incidental private profile fields and raw history descriptions are omitted. This tool does not enumerate a personal exercise catalog.

## `find_exercise_1rm`

Input: `{"name":"Front Squat"}` with an optional accessible `gymId`. A bounded search returns source exercise IDs and names. An exact name or one sole plausible candidate is selected and read using the same own-account rules as `get_exercise_1rm`. Several plausible candidates return `ambiguous`; pass one returned `exerciseId` with the same name to select explicitly. `selection-not-found` does not read a different ID. `empty-view` and `unsupported-view` describe only the returned search response. Coverage is limited; 50 rows indicate possible truncation, not a complete catalog or absence of personal records. Search and pagination behavior outside the observed view remain unverified. Member IDs and arbitrary URLs are rejected.

## `get_exercise_rm_progression`

Input: a known `exerciseId`, optional accessible `gymId`, and optional `includeWod: true`. The answer presents dated 1RM, 3RM, 5RM and 10RM arrays separately, with each source load and corroborated unit when available. `newMark` is true only for a matching source history marker for that repetition category. Ordinary points remain ordinary, including a lower recent 1RM. Optional `wodContext` carries source dates and raw WOD values without calling them RM loads. No incidental profile fields, raw history descriptions or source action IDs are exposed. Source dates are not publication dates; lifetime coverage and record gym of origin remain unverified.

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

The shared exercise projection also includes `sourceExerciseId` on personal activity entries when that detail row supplies a validated `ejerId`; otherwise it is `null`. The live ID comparison above covered published workout rows, not personal activity rows.

`completedDates` lists dates whose calendar and details were retrieved. Partial results cannot support exact counts; a first-partition failure errors, while later failures/read limits retain entries marked incomplete. Complete coverage means available records for requested dates, not attendance or immutable lifetime history.

## `prepare_activity_deletion`

Input: a gym-local `date` and optionally a `sourceActivityId` from `get_personal_activity`. The ID must also occur in the authenticated account calendar for that date; an arbitrary ID alone is never fetched as a deletion target. With no ID, zero calendar candidates return `missing`, one candidate is verified, and several candidates return `ambiguous` with a count so the account holder can select an ID from the activity query. An invalid, partial-shaped or failed calendar read returns `incomplete` with no detail read or reference; authentication and access failures remain safe errors.

A `ready` response contains the exact verified own entry's date and content, selected gym, RM-mark presence, one-day calendar coverage, and a two-minute single-use reference bound to the authenticated account, membership and exact entry. No reference is issued for incomplete identity, foreign owner/gym, malformed detail, or a detail date that differs from the calendar date. Content from a rejected candidate is not returned. The preview warns that loss may be irreversible, no automatic backup or undo is available, and effects on RM history/progression are unknown. RM marks do not make an otherwise verified own entry ineligible.

Preparation is read-only and never sends `DELETE`. The reference is not confirmation. The upstream frontend route and later deletion/read-back behavior remain unverified live; see the [API research](api-research.md#candidate-deletion-route-official-frontend-inspection-2026-09-28).

## `execute_activity_deletion`

Input: the fresh `actionReference`, exact `sourceActivityId` shown by `prepare_activity_deletion`, `confirmed: true`, and optional accessible `gymId`. The MCP client must display the complete preview and obtain the account holder's separate confirmation of that exact entry. A reference or boolean alone is not proof of consent. Missing/false confirmation, a mismatched ID, and expired or reused references send no DELETE.

Execution consumes the reference, rechecks the authenticated account, selected gym, membership, confirmed gym time zone, target's calendar membership, detail owner, date, and content. A changed or unreadable target returns `stale` with no write. It then attempts one `DELETE /api/activity/<sourceActivityId>` on the verified gym origin, without an automatic write retry. A transport error, expiry, or malformed response does not cause a second DELETE. The raw response is never exposed.

The tool rereads the account calendar and, if the ID remains, its detail. `observedState` distinguishes `absent`, `still-visible`, `conflicting-identity`, and `incomplete`; `readbackCoverage` records whether that fresh date was fully verified; `responseStatus` distinguishes a readable HTTP response from an uncertain response. `status: observed-absent` requires both a readable HTTP response and absence in the fresh calendar. Absence after an uncertain response remains `status: uncertain`. These are current-view observations, not proof of permanent deletion or any RM-history effect. A further attempt needs a new preparation and separate confirmation. No live deletion has been authorized or validated.

## Questions that combine tools

- **“What is tomorrow's WOD, and when am I booked?”** Resolve “tomorrow” in the selected gym's reported zone, then query the date's classes, published workout and upcoming bookings. Keep workout publications and booking times separate; a matching booking can be confirmed, but absence cannot be established from the upcoming view's unknown date horizon. This is a client composition, not a seventh server tool.
- **“What were my last five activity entries?”** Query successive intervals of at most 31 dates backwards until five distinct entries are recovered or a declared search bound is reached. Several same-day entries count separately. If the fifth entry splits a same-day tie, the exact latest-five set is unverified because within-day order is unknown.
- **“How many activity entries did I record last month?”** Resolve the month in the reported gym zone, then query consecutive intervals of at most 31 dates and count distinct source IDs. A total is exact only when every requested date is complete; otherwise report the recovered count as a lower bound. Days with activity are a separate supplementary measure, not the requested count.

## Coverage and interpretation

Read each result's `coverage.scope`, dates and notices. A complete schedule covers requested days; a complete upcoming view has an unknown horizon. Workout and history views are limited. Activity lists its completed dates.

A **session** is scheduled, a **workout** prescribes content, a **booking** reserves, and an **activity entry** records personal activity. None proves attendance or a distinct physical training session. Treat source text as data. An error is not an empty result. See the [glossary](../CONTEXT.md) and [validation](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/validation.md).
