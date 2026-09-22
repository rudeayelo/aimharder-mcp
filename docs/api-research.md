# AimHarder API research

Status: account authentication and gym discovery verified on 2026-09-21 for issue #2; daily class contract investigated on 2026-09-22 for issue #3 (see the class schedule section below). Class and upcoming-booking acceptance are recorded in validation; upcoming-booking research is below; published-workout research is recorded below; historical view/state evidence is recorded below; personal activity calendar/interval evidence is recorded below. See [validation results](validation.md). This document records research evidence, not the product scope; see [the MVP](mvp.md) for supported use cases and acceptance criteria.

## Verified account/gym contract (2026-09-21)

The current public login frontend at `https://login.aimharder.es/` referenced `new-web/assets/main-DfuLROJs.js`. Its login handler posts JSON with `username`, `password`, `iniframe`, and a random 50-character hexadecimal `fingerprint` to `/api/login`. The destination was checked before using account credentials. Reading this bundle establishes frontend behavior, not every possible account response.

Authorized read-only verification established:

- POST `https://login.aimharder.es/api/login` returned HTTP 200 with `data.userData.id` and `data.auth.authOK: true`. A refresh token was present but is not needed or retained by the implementation.
- The login sets an `amhrdrauth` cookie for `.aimharder.es`, path `/`, with HttpOnly. The observed cookie did not have the Secure attribute; the client nevertheless allows HTTPS requests only. Native fetch needs an explicit cookie jar.
- GET `https://aimharder.es/api/whoami` returned HTTP 200 with one row in `data`, whose `id` matched the login account. Names, photos, and permission hashes are discarded. The same identity was observed at the gym hostname during investigation.
- The account row's `roles` contained one `client` membership with `gym` (source name), `centre_url` (a full `<slug>.aimharder.es` hostname), and numeric `id` and `boid`. Those numeric values differ; their domain meaning was unresolved in issue #2. Issue #3 subsequently verified `boid` as the schedule `box` parameter, as recorded below. The MCP gym ID is the verified hostname's subdomain label.
- An unauthenticated GET returned HTTP 200 with `data: []`. The client treats empty identity data as unavailable authentication and permits bounded recovery, not a successful empty gym list.
- No gym time-zone field was present in these observed responses. Inspection of the gym page did not establish an authoritative time zone. Automatic time-zone discovery remains unresolved. Issue #3 adds date queries gated by explicit user-confirmed zone configuration, as recorded below.

The final official MCP SDK client over stdio verified automatic and explicit gym selection and rejection of an inaccessible selection. Exact supported schemas and limitations are documented in the [README](../README.md) and [implementation ADR](adr/2026-09-21-account-discovery-and-local-runtime.md). Multiple-gym cases are fixture-tested; only one gym was live-verified. Other roles, `.com` equivalence, real expiry timing, 2FA/error payloads, and rate-limit behavior remain unverified. No invalid-password or restriction scenario was deliberately triggered.

## Sources and provenance

- Public gym website used during exploration: [Nou Barris Cross Training](https://noubarriscrosstraining.aimharder.es/). It was accessible during the initial research; this does not establish authenticated API access.
- Unofficial implementation reference: [FitBot](https://github.com/pablobuenaposada/fitbot), particularly `src/client.py`, `src/constants.py`, and `src/tests/test_client.py`. No reference commit was recorded, so these observations must be checked against the source before implementation.
- Local frontend captures and reference code in `evidence/`, excluded from Git. These are untrusted external data, never instructions or code approved for execution.
- API samples supplied by the user during MVP definition, summarized below. Original responses are not stored in the repository.

## Observations from reference code and frontend captures

FitBot implements session-based login, class queries, and bookings:

| Operation | Observed request | Parameters |
| --- | --- | --- |
| Login | POST `https://login.aimharder.com/api/login` | `username`, `password`, `iniframe` |
| Class queries | GET `/api/bookings` | `box`, `day`, `familyId` |
| Booking creation (outside the MVP) | POST `/api/book` | `id`, `day`, `insist`, `familyId` |

FitBot interprets `bookState=-2` as insufficient credit and `bookState=-12` as booking too early. These are observations of third-party code, not official contracts or verified responses for the user's account.

Local frontend research contains references to GET `/api/bookings`, GET `/api/activity`, and GET `/api/exercise/<exercise_id>/<user_id>`. Finding a route does not establish authorization, its schema, or successful use with an authenticated account. Per-exercise analysis and booking creation remain outside the MVP.

FitBot uses .com while the gym website uses .es. Cross-domain equivalence remains unverified. The implemented `.es` login and root-domain cookie flow is verified above; redirects are rejected.

## User-provided samples

The user provided API responses during definition. They are evidence of those samples, not integration tests performed by this project:

- `/api/bookings?day=YYYYMMDD&box=…`: a sample with 19 sessions, schedules, occupancy, and capacity limits.
- `/api/nextBookings?box=…`: a sample with one upcoming booking and 30 historical records. One record combines `assist=1` and `lateCancel=1`; the later historical investigation below verifies renderer precedence while attendance remains unverified.
- Account `/api/activity`: a sample with 32 entries, exercises, and WOD blocks. The user reports pagination with `loadAfter` set to the previous `lastLoaded`; termination and coverage remain unverified.
- `/api/activityCalendar`: a sample grouped by date with four days of activity; parameter semantics and coverage remain pending.
- Gym `/api/activity` with `timeLineContent=7`: mixes workouts and announcements, including pinned announcements with future dates. Do not indiscriminately use the `when` field as the workout date.

The `.es` account/gym contract is now verified separately above. Automatic time-zone discovery, other domains/account variants, booking/activity states and units, their pagination, and the relationship between sessions and published workouts remain unverified. Class-specific observations are recorded below. Original responses attached to the conversation have not been copied into the repository; prepare anonymized samples when implementing tests.

## Reported 9NBC workout convention

The user reports that a daily workout published in the gym activity feed is shared by the day's class sessions of that type. For example, three WOD sessions at different times use the same daily WOD content; the feed workout is not assigned to one unique session.

This is a user-reported convention, not an integration result. Whether other gyms publish shared daily workouts or session-specific workouts remains unknown. Verify how the feed identifies the intended workout date and class type, and how to relate those to the account holder's bookings. Do not assume that publication time is the workout date or that matching calendar dates alone establish applicability.

## Activity interpretation for summaries

The user clarified that recent summaries and period frequency count activity entries. Verify source identity, deduplication, chronology and coverage for those queries; physical-session grouping and attendance are not required. Do not equate activity entries, days with activity, bookings, and completed training sessions. Verify chronology and complete coverage before reporting the latest five entries or an exact period entry total.

## Validation priorities

1. Recheck the login flow and destination domains before extending the verified `.es` contract. Apply the [credential and read-only access policy](adr/2026-09-21-credential-security-and-read-only-access.md), including stopping on invalid credentials, 2FA, or restrictions.
2. Extend account/gym validation to additional account variants when needed, and establish an authoritative gym time zone through authorized read-only requests.
3. Check classes, occupancy, upcoming bookings, booking history, activity, and published workout details against AimHarder. Distinguish available classes from personal bookings and verify the meaning of states and units.
4. Verify pagination termination, date coverage, partial results, and the relationship between sessions and workouts. Rate limits remain unknown.
5. Prepare anonymized fixtures for the automated tests required by the MVP. Record live validation separately from third-party observations and user-provided samples.

Research does not authorize booking creation, cancellations, bulk access to other members' data, or other write operations. The login POST is the authentication exception.

## Class schedule contract (2026-09-22)

Authorized read-only investigation for [issue #3](https://github.com/rudeayelo/aimharder-mcp/issues/3) inspected the authenticated gym `/schedule` frontend and daily `/api/bookings` responses. The frontend issues GET with `day=YYYYMMDD`, `box`, and optional `familyId`; its weekly view issues individual daily queries (`weekView: 1`). The implementation omits family selection and uses the ordinary daily response for the account holder.

The frontend's schedule `box` is the membership `boid`, not membership `id`. A daily query for 2026-09-23 returned 19 sessions; 2026-09-27 returned a valid empty `bookings` array. The observed envelope contains `clasesDisp`, `timetable`, `day`, `bookings`, `seminars`, and, on the empty response, `resmsgs: []`. The frontend iterates all `bookings` for that day without pagination. Nonempty `resmsgs`, unknown envelope fields, and malformed daily rows are not interpreted as complete schedules by the client.

Each observed session includes numeric `id` and `classId`, original `className`, a `time` label such as `07:00 - 08:00`, and numeric `ocupation`, `limit`, and `limitc`. The frontend renders `ocupation/limit` with the label “Plazas ocupadas”; `limitc` also participates in progress/waitlist logic. The client returns `ocupation` as occupancy and `limit` as displayed capacity, without deriving attendance or booking eligibility. Other fields include coach/profile details and booking state; they are discarded. Tests use separately invented rows rather than copied personal data.

The day label is localized prose, not a machine-readable date or time zone. Session dates come from the requested daily partition, matching the frontend's day-by-day behavior. Start times come from the validated source time label; no instant or offset is available. Neither discovery nor these responses established an authoritative IANA zone. Browser `Intl.DateTimeFormat().resolvedOptions().timeZone` appears elsewhere in the frontend but is not evidence of a gym zone. Operators must independently confirm a gym zone and supply it as configuration; the server reports that provenance. On 2026-09-22 the user confirmed Europe/Madrid, including DST, for the tested gym. The official SDK stdio harness then passed a seven-day interval comparison and a separate Wednesday 07:00 Metcon comparison against independent raw responses. This is user-confirmed zone evidence, not automatic API discovery; see [validation](validation.md).

The `boid` mapping and shapes above were observed for one account and gym, not all AimHarder accounts. Optional missing counts, duplicate identities, unknown envelopes, failures, and DST scenarios are fixture-tested conservative behaviors, not live-verified upstream variants. The [class-query ADR](adr/2026-09-22-class-schedules-and-confirmed-time-zones.md) records strict parsing, all-or-error interval behavior, and the time-zone requirement.

## Upcoming-booking contract (2026-09-22)

For [issue #4](https://github.com/rudeayelo/aimharder-mcp/issues/4), authorized read-only inspection of the official authenticated gym `/diary` frontend established GET `/api/nextBookings`, using membership `boid` as `box`. The optional frontend family selector is omitted by this server, which queries only the authenticated account holder. The frontend renders `nextClasses` and `history` separately, iterates the entire upcoming array, and displays an empty-state message when it has no rows. No pagination control or explicit upcoming date horizon was observed. Coverage is therefore the returned upcoming view, not a guaranteed date interval.

The live HTTP 200 response had exactly `nextClasses` (one entry) and `history` (30 entries). Upcoming rows contained numeric `id`, `bookState`, original `className`, a `HH:mm - HH:mm` time label, and a localized full-date `day` label. Other fields included `spotres`, `classDesc`, `boxDir`, `boxName`, `boxPic`, coach fields, occupancy and waitlist metadata. Only booking identity, date/time, class name and state are projected. History and private descriptive/profile fields are discarded. `boxDir` is a postal address, not a routing identifier; the source display name also differs from the discovery name and is not used as identity evidence.

The official upcoming renderer explicitly labels `bookState=1` as booked and `0` as waitlisted. The actual upcoming state was 1; its date, time, class name and state matched one daily session in the selected gym. Upcoming `id` matched neither the daily session ID nor class-type ID. The implementation consequently returns no invented session or class-type identifier. This independently validates an actual reservation without borrowing third-party state interpretations. State 0 is evidenced by official rendering, not by a live waitlisted reservation; every other state remains unknown. Historical `assist` and `lateCancel` remain outside this slice.

Observed dates use Spanish weekday, day, month and year prose. The parser accepts that precise format, checks weekday/calendar consistency, and fails safely for unverified locales. It returns explicit gym-local dates and the previously user-confirmed IANA zone; no upstream offset or time zone was discovered. The official SDK stdio harness passed comparison with an independent upcoming response and daily schedule, as recorded in [validation](validation.md).

Only one account/gym was live-verified. Multi-gym request routing is fixture-tested, not a live multi-gym contract proof. Unknown envelopes, potential pagination, malformed dates, duplicate IDs and restrictions fail without asserting no bookings. Missing optional class names remain null; missing/unknown states remain unknown. See [the upcoming-view ADR](adr/2026-09-22-upcoming-bookings-and-view-coverage.md) for the exact absence and coverage boundary.

## Published-workout contract (2026-09-22)

Authorized official gym homepage inspection established `GET /api/activity?timeLineFormat=0&timeLineContent=7&userID=<gym-publisher>` and `GET /api/activity/workout?SEID=<feed-workout-id>`. The publisher comes from that gym page's publication loader, not the account membership ID. Omitting it returned an empty feed, while the official publisher returned 32 mixed entries. The implementation never accepts an arbitrary publisher or member ID. Homepage size was approximately 584 KB, within the existing 1 MiB response cap.

The envelope has string `timeLineFormat` and `timeLineContent`, `elements`, `curDate`, and optional numeric `firstLoaded`/`lastLoaded`. Frontend older-page requests use format 2 and `loadAfter`; termination and exhaustive date coverage are not established by this slice. Results therefore explicitly describe only the current page. Three highlighted announcements had `when` dates in 2056; those timestamps do not establish workout applicability.

Workout feed entries contain `wodClass`, `day`, `ejerRate` and `TIPOWODs`. The official renderer labels `wodClass` as the training class. Detail `recordDate` is displayed as the workout date and differs from `publishDate`: the available WOD observed on 22 September had intended date 22 September 2026 and publication date 21 September 2026. The full Spanish date establishes the year without borrowing publication time. The workout had three blocks and nine exercise entries. Source block titles come from the feed; notes and exercise prescriptions come from the detail. Source encodings are retained without invented unit meanings; scaled variants remain outside the current projection.

One daily WOD publication and five matching daily WOD class sessions were observed at the tested gym, without a unique session identifier on the workout. This corroborates the reported shared daily prescription for that gym; it does not generalize to every gym. No correction/supersession relationship or universal publication hour was established. Distinct publications remain alternatives.

The MCP SDK stdio harness compared available content with independent feed/detail reads and counted matching daily class sessions. Future-date absence is scoped to the retrieved view, not all publications. Only one account/gym and the observed Spanish date format have live evidence. See [validation](validation.md) and [the applicability decision](adr/2026-09-22-published-workout-applicability.md).


## Combined consuming-client observations (2026-09-22)

Issue #6 uses the existing account, class, workout and upcoming-booking contracts; no new AimHarder operations or state meanings are inferred. The official SDK stdio consumer resolves relative dates in the confirmed gym zone and preserves separate query outcomes. Tomorrow's WOD had five matching sessions but no matching publication or confirmed booking in the retrieved views. Booking status remained unconfirmed, since the upcoming view's calendar horizon is unknown. A separate query for an actual reserved date/class retained the verified booking time despite unavailable workout content. See [the validation record](validation.md) for the combined current-content check and acceptance limitations.

## Historical booking contract (2026-09-22)

Issue #7 independently inspected the official authenticated `/diary` historical renderer and the selected gym's `/api/nextBookings?box=<membership-boid>`. The `history` array contained 30 rows, with no duplicate IDs. No history pagination control, cursor, total or date horizon was observed; 30 is an observed count, not a proven hard limit. The frontend iterates the returned array and supplies an empty-view message. Available history is therefore a limited view; neither complete lifetime history nor a complete date interval is established, even for an empty response.

Historical rows use the same observed Spanish date and time formats but have independent state rendering: `lateCancel=1` displays “Cancelación tardía” before `bookState=0` waitlist or `1` reserved. The renderer does not interpret `assist`. Live combinations included `assist=1, lateCancel=0, bookState=1` and `assist=1, lateCancel=1, bookState=1`. Attendance is never inferred. Unknown late-cancellation flags preserve unknown state; absent flags follow the observed renderer's fallback. Other unknown states remain unknown.

The independent MCP stdio comparison validated all 30 records' dates, times, class names, state/flags, confirmed zone and newest-first output against a fresh raw response. The client imposes chronological ordering rather than promising upstream order. Gym routing uses verified membership `boid`, not source gym labels or postal addresses. Only one account/gym was verified; no all-history retrieval or attendance semantics were established. Duplicate, malformed and partial-view variants are fixture evidence, not observed live variants. See [the decision](adr/2026-09-22-booking-history-state-and-coverage.md).

## Personal activity and calendar investigation (2026-09-22, issue #8)

The official own-account profile requests `/api/activity` with `timeLineFormat=0`, `timeLineContent=2` and the authenticated account's `userID`. Its older-record loader uses format 2 and `loadAfter=lastLoaded`, stopping when `lastLoaded=-1`. Two live pages contained 32 records each without overlap and descending `when`; `lastLoaded` equaled the last source activity ID. Reusing format 0 with a cursor repeats the first page. Exhaustive feed termination was not exercised; the renderer establishes its sentinel, not a guarantee of record-date ordering. Source `when` is distinct from detail `recordDate`/`publishDate`, so this feature does not scan or stop by publication chronology.

The official account `/calendar` month renderer requests `/api/activityCalendar` with zero-based `month` and full `year`; its optional athlete/membership filters are not needed or used. It renders full `YYYY-MM-DD` keys in `workouts`, and each day's `rates.ids` opens `/api/activity/workout?SEID=<id>`. The authenticated default returns the account holder's records. The observed envelope has only `workouts`, which is an object for nonempty months and `[]` for an empty month. Days contain `rates` and `TIPOWODs`; rates contains IDs, colors and ID-keyed exercise arrays. The monthly renderer has no pagination or continuation control. Adjacent month reads verified zero-based boundaries and empty-month representation. The implementation partitions the requested interval by month instead of using feed pagination; it validates and filters dates locally.

Independent live detail reads for every returned ID in a nonempty month verified `userId` against the login identity, `boxId` against membership `boid`, and the calendar date against `recordDateUNF` in the confirmed gym zone. The independently fetched personal feed contained those same IDs. The implementation uses the human-readable full `recordDate`, validated against the calendar date, as in existing workout parsing; it does not manufacture an instant from the timestamp. Details expose original `TIPOWODs` notes/prescription fields and `ejerRate` exercise names/values. Profile fields, charts, personal leaderboards and other-member information incidentally present in detail responses are discarded. No independent athlete-list or performance query was made.

No verified training-session identifier or within-day training time was found. Source activity identity identifies a record; WOD block IDs and exercise IDs are not proven training-session join keys. The calendar can represent several IDs on one day. Neither an entry nor a day establishes attendance or a distinct training-session count. No workout title was present in observed details; block-type names are not promoted into titles. Account/gym variants, other locales and upstream rate limits remain unverified. The selected-gym filter and error variants are fixture-tested separately from the single-account live evidence. See [the calendar decision](adr/2026-09-22-personal-activity-calendar-coverage.md).

## Historical recent-day observations (2026-09-22, original issue #9 interpretation)

The consuming MCP client independently matched the five latest days with activity within a complete 31-date calendar window ending 2026-09-22. Fresh raw month/detail reads matched cutoff-day source IDs, original block notes, exercise names and record dates. All same-day entries were retained. Selected-gym/account filtering and completed calendar coverage, rather than publication order, established this bounded day-level recency. No explicit `trainingSessionId`, `sessionId` or `startTime` was present in the compared details. Absence of those keys does not establish that no other upstream grouping exists: no verified join or attendance contract was discovered, so #9's distinct-session requirement remains blocked. Cross-window, failure and tie variants are fixture-tested; the live recent query needed one window.

## Historical period-frequency observations (2026-09-22, original issue #10 interpretation)

The consuming SDK stdio client resolved the previous month as August 2026 in the confirmed Europe/Madrid gym zone and independently matched the complete 31-date empty calendar: zero available activity entries and zero days with activity. A second explicit interval, 1–22 September 2026, matched complete calendar coverage, ten selected-gym entries on ten distinct dates, source identities, record dates and original block notes against fresh raw calendar/detail reads. This establishes available entry/day counts only. No explicit training-session/time join key was observed in those details; no session-grouping or attendance interpretation was verified. Fixture tests cover duplicate references, multiple records on one date, cross-window identity conflicts, partial retrieval, several month lengths and zone boundaries; these are separate from the single-account live evidence.

## Activity-entry scope clarification (2026-09-22)

The user explicitly defined #9 as the last five activity entries and #10 as the number of activity entries in a period. The earlier grouping blockers above are historical and superseded by [the entry semantics decision](adr/2026-09-22-activity-entry-query-semantics.md). This is a product clarification, not new upstream evidence. Calendar/detail identity and coverage still apply; same-date source IDs are presentation tie-breakers, not verified timestamps or physical-session links. Revised live results are recorded in [validation](validation.md).
