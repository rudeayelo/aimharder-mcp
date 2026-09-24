# Tools and results

The six tools read one configured account. An optional `gymId` selects an accessible gym; multiple gyms require `AIMHARDER_DEFAULT_GYM`. Date queries use the gym's IANA zone, assumed `Europe/Madrid` unless configured. Field names are English; AimHarder content keeps its source language.

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
