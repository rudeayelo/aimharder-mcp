# Validation record

Current interpretation: the user clarified #9 and #10 to retrieve/count activity entries. Historical sections below describe the former session-grouping blockers; those blockers are superseded by [the entry semantics decision](adr/2026-09-22-activity-entry-query-semantics.md). Revised verification is recorded at the end.


## Account and gym discovery (2026-09-21)

Historical issue #2 verification; the class-query update below records subsequent behavior. Scope: [issue #2](https://github.com/rudeayelo/aimharder-mcp/issues/2), part of [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). This validates the account/gym slice, not the complete MVP.

## Live read-only verification

Environment: macOS, Node 24.21.0, pnpm 12.5.1, MCP TypeScript SDK 1.30.0. Account credentials were injected into the process; their values and the secret-store configuration are not recorded here.

The public login frontend was inspected before transmitting credentials. Authorized probes established the JSON login request, cookie scoping, and account discovery shape. The final check used `scripts/live-check.mjs`: an official SDK `Client` with `StdioClientTransport` launching `dist/index.js`. No bookings, profile edits, other members' queries, or refresh-token redirects were performed.

| Check | Observed result |
| --- | --- |
| POST login on `login.aimharder.es` | HTTP 200; authentication success; an in-memory domain cookie was supplied. |
| GET root `/api/whoami` | HTTP 200; one account, matching the login identity; one `client` gym membership. |
| GET gym `/api/whoami` during contract research | HTTP 200; same account identity. The implementation only needs the root endpoint. |
| Unauthenticated `/api/whoami` during research | HTTP 200 with `data: []`; HTTP success alone does not establish authentication. |
| MCP initialization and tool listing | Passed over stdio; exactly `get_account_context` exposed. |
| Automatic selection | Passed for the account's only discovered gym. |
| Explicit selection without restart | Passed for that gym. |
| Unverified gym selection | Returned an MCP tool error. |
| Server stderr during successful harness run | Empty. |
| Gym time zone | Not present in the observed discovery fields; no verified time-zone literal found in the examined gym page. Returned as unknown with a notice. |

Sanitized harness summary: `authenticated: true`, `accessibleGymCount: 1`, `explicitSelection: "passed"`, `inaccessibleSelection: "rejected"`, `timeZoneStatus: "unverified"`, `serverStderr: "empty"`.

## Automated verification

`tests/context.test.ts` exercises a real MCP SDK client/server pair over the in-memory transport and the real AimHarder API client. MSW replaces only HTTP responses, rejects unhandled requests, and uses synthetic identity, gym, credential, cookie, and token data. No environment credentials are read by these tests.

Coverage includes automatic/default/explicit selection, required configuration, discovery refresh after membership changes, duplicate and conflicting memberships, unsupported domains and roles, malformed responses, identity mismatches, session reuse and concurrent calls, expiry recovery/exhaustion, failed reauthentication, login failure/challenge responses, restrictions, missing/expired/mis-scoped cookies, redirect rejection, network failures, oversized bodies, source-language preservation, and exclusion of private data from results and output streams.

Final checks passed: `pnpm typecheck`, `pnpm test` (52 tests), and `pnpm build`. All local Markdown links resolved across 14 files, and `git diff --check` passed. The explicit live stdio harness also passed as recorded above. A frozen-lockfile reinstall succeeded; startup without credentials exited with the expected sanitized configuration error. Separate Standards and Spec reviews against baseline `a429ea5` reported zero findings. The staged-file privacy scan found no secret tokens or private secrets-manager references.

## Limits of the evidence

- Only one real account with one client gym membership was checked. Multiple gyms and other synthetic response variants have automated coverage, not a live multi-gym account validation.
- Empty unauthenticated identity data was observed live. HTTP 401 recovery is a conservative HTTP convention tested synthetically; real session expiry was not forced.
- Invalid credentials, 2FA, restrictions, and rate limits were not provoked against the real account. Unknown login shapes stop safely; tests do not establish their actual upstream payloads or messages. HTTP 403/429 stop without recovery.
- `.com` cookie equivalence and account variants outside the observed membership format remain unverified and unsupported.
- Numeric membership identifiers and gym time zones remain unresolved. No date-dependent tool is exposed, and no system-time-zone fallback is used.
- Class schedules, occupancy, workouts, bookings, activity, and their date/state semantics have not been implemented or live-validated by this slice.

## npm distribution planning

On 2026-09-22 the user approved [packaging #11](https://github.com/rudeayelo/aimharder-mcp/issues/11) and [publication #12](https://github.com/rudeayelo/aimharder-mcp/issues/12) as additional MVP work. The public npm registry returned E404 for `aimharder-mcp`; this does not reserve the name or establish publishing permissions. Packaging, clean-environment installation, and registry release verification remain pending. Existing account/gym validation above covers the source-built server only. See [the distribution ADR](adr/2026-09-22-npm-distribution-for-mvp.md).

## Class schedules and occupancy (2026-09-22)

Scope: [issue #3](https://github.com/rudeayelo/aimharder-mcp/issues/3), under [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). The server exposes `get_class_sessions` separately from the reusable API client. See the [class-query decision](adr/2026-09-22-class-schedules-and-confirmed-time-zones.md).

### Live investigation and acceptance boundary

Authorized read-only inspection verified the gym frontend's daily request, membership `boid` as `box`, a 19-session day, a successful empty Sunday, the time-label format, and displayed `ocupation/limit` semantics. The Wednesday 07:00 Metcon appeared with available occupancy and capacity. No participant lists, family accounts, bookings, cancellations, or profile writes were requested; account fields were held in memory and omitted from evidence.

**Acceptance completed:** on 2026-09-22 the user confirmed that the tested gym uses `Europe/Madrid`, including daylight-saving changes. That per-gym mapping was injected into the harness/server environment, with `timeZoneStatus: "user-confirmed"`. This is operator confirmation, not an upstream time-zone field or a hard-coded application default.

The official MCP SDK client over stdio passed both independent live comparisons:

| Query | Observed result |
| --- | --- |
| Inclusive 2026-09-21 through 2026-09-27 | Seven daily partitions, 73 sessions, two empty days; MCP session identities, dates, time labels, class types, occupancy, and capacity matched the independent raw responses. |
| Wednesday 2026-09-23 | 19 sessions; the separate exact `07:00` / `Metcon` MCP query matched the raw response, including occupancy and capacity. |
| Context and access checks in both runs | One accessible gym; explicit selection passed; inaccessible selection rejected; confirmed time-zone provenance returned; server stderr empty. |

Both runs used the implementation in `4c7145a`, with no code changes after the 100-test full-suite result. Only authentication, account discovery, and allowed daily schedule reads were performed. Credentials and raw responses remained in process memory; the recorded summaries contain only counts and verification outcomes. The previous live-acceptance blocker is resolved.

The extended `scripts/live-check.mjs` is an official MCP SDK client over stdio. Optional explicit date environment variables enable an interval query and exact time/type query, compared with independent raw read-only AimHarder responses in memory. It prints only pass/fail counts and provenance. Without dates it retains the existing account/context check. A changing occupancy between independent reads may cause a comparison failure; passing checks represent the observed run, not an atomic snapshot.

### Automated checks

`tests/classes.test.ts` covers an inclusive week, Wednesday 07:00 Metcon, distinct times/types and ambiguous matches, unchanged source names, missing/null/zero counts, empty results, malformed/unknown/restricted envelopes, duplicate IDs, later-day failure, explicit/default/unknown gyms, numeric gym routing, one shared recovery allowance, session serialization, safe redirect/transport failures, configuration errors, DST and leap/month/year boundaries, and unknown-zone refusal. Only upstream HTTP responses are substituted; the MCP SDK and API client are real. No automated test reads live credentials.

During implementation, all 48 class tests passed with `TZ=Pacific/Honolulu` and all 52 existing context tests passed. Typechecking and the build passed. Final checks passed: `pnpm typecheck`, `pnpm test` (100 tests), `pnpm build`, `node --check scripts/live-check.mjs`, and `git diff --check`. Local Markdown links resolved. The updated live stdio account/context harness passed (one accessible gym, explicit selection accepted, inaccessible selection rejected, unconfigured zone reported unverified, server stderr empty). Standards review found zero issues; Spec review found zero code defects and initially flagged the live acceptance blocker, resolved by the subsequent confirmation and successful comparisons above. The independent reviews used baseline `aee618b` and excluded unrelated concurrent npm-planning changes.

### Remaining limitations

- Automatic gym time-zone discovery is unresolved. Supplying configuration asserts operator confirmation; it does not change verified gym access.
- Dates/times are gym-local wall values with a named zone, not absolute instants. The API supplies no offset to disambiguate DST transitions.
- One real account/gym establishes the observed class contract; multi-gym routing and error variants have fixture coverage only.
- Complete coverage means successful retrieval of each daily response. Future publication, live occupancy changes, actual attendance, and booking eligibility are not asserted.
- Unknown response envelopes and nonempty messages fail conservatively. No real restriction/expiry scenario was provoked.
- Workouts, upcoming bookings/history, and personal activity remain separate pending slices.

## Upcoming bookings (2026-09-22)

Scope: [issue #4](https://github.com/rudeayelo/aimharder-mcp/issues/4), under [specification #1](https://github.com/rudeayelo/aimharder-mcp/issues/1). The reusable API client and public `get_upcoming_bookings` tool are implemented. See [the view-coverage decision](adr/2026-09-22-upcoming-bookings-and-view-coverage.md).

### Live read-only verification

Environment: macOS, Node 24.21.0, pnpm 12.5.1, official MCP TypeScript SDK 1.30.0 client over stdio. Credentials were read from the authorized secrets manager into process memory. The tested gym uses the Europe/Madrid zone previously confirmed by the user, including DST. No credentials, account identifiers, postal addresses or raw account responses are recorded here.

The official authenticated `/diary` frontend verified the `box` parameter against membership `boid`, separate upcoming/history arrays, booked/waitlist rendering, and the empty upcoming view. The actual upcoming response contained one reserved entry and a separate 30-entry history collection; history was not interpreted. No upcoming pagination control or explicit calendar horizon was observed. The upcoming identifier differed from both the matching schedule-session and class-type identifiers, which remain null in the booking projection.

`AIMHARDER_LIVE_BOOKINGS=1` enabled the updated `scripts/live-check.mjs`. It passed:

| Check | Observed result |
| --- | --- |
| MCP startup/tool listing | Account context, class sessions and upcoming bookings exposed over stdio. |
| Actual upcoming comparison | One entry; source identifier, date label, normalized date, time, original class name and state matched an independent raw response. |
| Independent daily schedule comparison | One unambiguous match by date, time, class name and booked state, without equating source identifiers. |
| Gym selection | Default and explicit selections matched; an inaccessible selection was rejected. |
| Zone provenance | User-confirmed IANA zone returned; no automatic discovery claim. |
| Server stderr | Empty. |

Sanitized result: `upcomingComparison: "passed"`, `scheduleComparison: "passed"`, `bookingCount: 1`, `explicitSelection: "passed"`, `inaccessibleSelection: "rejected"`, `timeZoneProvenance: "user-confirmed"`. Only authentication, membership discovery, the account's upcoming view, daily schedules and official frontend reads were used. No reservations, cancellations, family-account queries or other-member queries were performed.

### Automated checks

The new `tests/bookings.test.ts` contains 36 behavioral tests through the actual MCP interface and API client, substituting only anonymized HTTP responses. Coverage includes zero/one/multiple entries, original content and privacy projection, missing optional details, waitlist/unknown/missing states, invalid/duplicate rows, incomplete/pagination/restriction envelopes, failures, default/explicit multi-gym routing, account/family-selector rejection, identity mismatch, recovery/exhaustion and membership removal after expiry, confirmed zones, DST and leap/year boundaries. Synthetic states and errors do not establish additional live upstream behavior.

The booking tests first failed because the tool was absent, then passed after implementation, including under `TZ=Pacific/Honolulu`. `pnpm typecheck`, the final `pnpm test` (136 tests across three files), `pnpm build`, `node --check scripts/live-check.mjs`, and `git diff --check` passed. All local Markdown links resolved across 16 working-tree files, and the staged documentation links also resolved independently. Initial checks used the shell default Node 26.9.0; typechecking, all 136 tests, build, harness syntax and live MCP verification were then repeated successfully on the supported Node 24.21.0. Separate Standards and Spec reviews of the staged delivery against baseline `86bcd70b` each reported zero findings. The staged diff contained no private account identifiers or secret-store references. The separate live MCP check passed as recorded above.

### Limits and composition boundary

- Only one real account/gym and one actual reserved entry were verified. Multi-gym, empty and unknown states have fixture coverage. Waitlist meaning comes from the official frontend; no live waitlist was manufactured.
- `coverage.status: "complete"` describes the returned upstream upcoming view only. Its date endpoints are unknown. Absence does not prove no relevant reservation on an arbitrary future date; later composition must preserve that uncertainty or verify sufficient date coverage.
- Only the observed Spanish full-date format is supported. Unsupported locales, malformed dates and unrecognized envelopes fail without claiming no bookings. Times are gym-local wall values with a named zone, not inferred instants.
- There is no verified session-ID join; consumers may compare date/time/type but must retain ambiguous alternatives. Missing optional class names remain null.
- Potential partial/paginated responses return an error without a successful partial result. Historical booking-state semantics and activity pagination are not implemented by this slice.
- The domain glossary, API/MCP separation, one-account architecture, distribution and license decisions remain unchanged. The allowlist and view-coverage decision are updated in the relevant ADRs. Unrelated npm-planning edits remain outside this delivery.

## Published workouts (issue #5, 2026-09-22)

The independent API client and public `get_published_workouts` tool retrieve the selected gym's current publication view, preserve original workout instructions, and distinguish available alternatives, unsupported interpretation, unavailable content in that view, and retrieval errors. See [the applicability decision](adr/2026-09-22-published-workout-applicability.md).

### Live read-only verification

The official MCP SDK client over stdio passed on Node 24 with the user's account and the previously confirmed Europe/Madrid gym zone. An independent raw session discovered the same gym publisher, scanned same-class feed candidates and their detail `recordDate` values, and compared the expected publication ID set and status with MCP. It compared original titles, notes, exercise names and all projected prescription values. Responses remained in memory; only sanitized counts/outcomes were printed. Server stderr was empty.

- 2026-09-22 WOD: one available matching workout, with three blocks and nine exercise entries; source notes/titles/prescriptions matched. Five daily WOD class sessions matched that class type. No unique session ID was fabricated. The detail's intended date was 22 September; its publication date was 21 September.
- 2026-09-23 WOD: zero matching workouts in the inspected current feed view, independently verified by scanning candidate detail dates. Five class sessions existed for that date. The result honestly reported `unavailable` with incomplete feed-view coverage. Actual future workout content was unavailable during this check, so future-content live acceptance is not claimed; future-date behavior is fixture-tested.
- Three future-dated pinned announcements were observed and excluded from workout answers. No live correction/supersession contract was established.

Only one account/gym was live-verified. The observed one-publication/multiple-session arrangement corroborates the reported daily sharing there, not a universal relationship. Pagination exhaustion, exhaustive historical/future coverage, other locales, and scaled variants remain limitations. The server does not interpret encoded prescription units without evidence. No booking, cancellation, publication or profile write was performed.

### Automated verification

Behavioral red/green tests ran through the public MCP interface with the real API client and anonymized HTTP fixtures. Initial future-content, announcement, ambiguity and unsupported-format cases failed before the tool existed. The final targeted suite passed 19 workout tests, covering source-language preservation, record-date/publication-date distinction, future queries, ambiguous/unverified corrections, incomplete coverage, missing workout markers, deleted/empty content, malformed envelopes, conflicting publishers, failures, retry bounds, private-field exclusion, read-only requests, confirmed zones and verified gym override routing.

On supported Node 24, `pnpm typecheck`, `pnpm test tests/workouts.test.ts`, `pnpm build`, harness syntax validation and `git diff --check` passed. A prior combined workout/context run passed 70 tests before the last gym-override case was added. The final full suite passed 155 tests across four files on supported Node 24, together with typechecking and build. All local links resolved across 17 Markdown files. Separate Standards and Spec reviews against baseline `fd48fa6` each reported zero actionable findings; the absence of live published future content remains explicit above. The domain glossary was reviewed and needs no vocabulary change; the security ADR and new applicability ADR reflect the added read-only operations and coverage boundary.

## Combined workout and booking experience (issue #6, 2026-09-22)

The reusable consuming-client `queryTraining` composes the existing four MCP tools, with `scripts/query-training.mjs` as a runnable official SDK stdio example. It resolves tomorrow after selecting the gym and confirming its zone; API-client/MCP separation and the existing read-only operation set remain intact. See [usage](../README.md#combined-workout-and-booking-example) and [the composition decision](adr/2026-09-21-api-client-separated-from-interfaces.md#consuming-client-composition-2026-09-22).

### Live read-only results

Environment: macOS, supported Node 24, official MCP TypeScript SDK 1.30.0 over stdio, one actual account/gym and the user's previously confirmed Europe/Madrid zone. `AIMHARDER_LIVE_TRAINING=1` ran the composition against the built server. Independent in-memory HTTP reads compared gym publications/detail dates and source content, the upcoming view, and daily schedules. Credentials and raw personal responses were not printed or persisted; server stderr was empty.

| Experience | Observed result |
| --- | --- |
| Tomorrow's WOD | Resolved to 2026-09-23 in the gym zone; five matching sessions, zero matching publications in the current view, zero matching confirmed booking times. Workout status was unavailable with incomplete feed coverage; booking status was unconfirmed, never no booking. |
| Current-day WOD | Five matching sessions and one available workout. Independent feed/detail comparison passed for the original content. The publication remained separate from the several session times, with no fabricated unique association. |
| Actual reserved date/class | A separate reusable query retained one actual confirmed booking time despite unavailable workout content. This was not the same date/class combination as the reference WOD query. Independent upcoming-view and daily-schedule comparisons passed. |
| Coverage and isolation | No verified calendar horizon was invented. No bookings, cancellations, profile changes, family selectors or other-member queries were performed. |

This demonstrates the combined live experience and its unavailable-content behavior. **Actual published future workout content remains unavailable during this validation, so the first functional delivery's future-content live acceptance remains pending.** Current-day availability is not substituted for that criterion. The full MVP also still requires recent-session/frequency experiences and npm distribution; activity intervals were validated separately below. Booking history was validated separately below. One-account/gym evidence does not establish universal daily sharing or exhaustive feed/booking coverage.

### Automated verification

The consuming-client tests first failed because composition did not exist, then passed through the public MCP interface with the real API client and anonymized HTTP fixtures. The targeted `tests/consumer.test.ts` suite passed 17 tests: multiple sessions and bookings, original future content, exact date/class selection, ambiguous alternatives with provenance, independent failures of every query family, incomplete booking envelopes, malformed workout responses, empty/waitlisted/unknown/missing-class booking uncertainty, invalid input, inaccessible gyms, confirmed-zone requirements, and gym-local tomorrow across DST/year boundaries. Typechecking and build passed on Node 24. The final full suite passed 172 tests across five files on supported Node 24; typechecking, build, both script syntax checks, whitespace checks and local links across 17 Markdown files also passed. Separate reviews against baseline `37399a2` found zero Standards findings and zero code defects or scope findings in Spec. Spec identified one remaining acceptance gap: actual published future-content live verification. At this review, #6 was kept open for that evidence; the user-approved QA handoff below supersedes its tracking status without changing the recorded result.

The domain glossary, credentials/security, account model, operation allowlist, distribution/license, and existing workout/upcoming interpretation decisions were reviewed without changes to their meaning. The API/interface-separation ADR now records the consuming-client composition boundary. README, MVP status, API evidence and this validation record distinguish implemented behavior from the remaining acceptance gap.

## Booking history (2026-09-22)

Issue #7 adds the independent API-client method and public MCP history tool. Behavioral red/green tests at the existing MCP/HTTP boundary cover ordering, limited empty history, unknown flags, simultaneous flags without attendance inference, exact duplicates, conflicting identities, malformed-row recovery, invalid pagination envelopes, access failures, required zones and rejected account/gym selectors. `pnpm typecheck`, `pnpm build` and targeted history/context/upcoming tests passed; the complete suite is reserved for the combined delivery.

The official SDK client over stdio passed an independent live comparison of 30 historical records against a fresh `/api/nextBookings` response. Date labels and normalized calendar dates, time labels, class names, state precedence, source flags, confirmed zone and newest-first ordering agreed. Simultaneous `assist=1` and `lateCancel=1` was observed and remained unverified attendance. Authentication, explicit/inaccessible gym selection and empty server stderr also passed. The harness flag is `AIMHARDER_LIVE_HISTORY=1`, together with the existing explicit live gate and environment configuration.

The result establishes the available historical view for one account/gym, not exhaustive history. No pagination contract, date horizon or definitive numeric upstream limit was found. Complete empty lifetime history cannot be asserted; this is explicitly represented as limited coverage. No booking or cancellation was performed. Architecture, authentication, distribution and domain glossary remain otherwise unchanged; the history and credential ADRs document the affected interpretation boundary.

Issue #7 review: Standards found one stale research-summary statement, corrected before commit; Spec found no actionable defects. The final targeted history/context/upcoming run passed 99 tests on Node 24. The combined-delivery full suite remains pending.

## Personal activity intervals (2026-09-22)

Issue #8 uses the independently verified account calendar month contract and ID-linked workout details through `get_personal_activity`. The public MCP/real-client/HTTP-fixture boundary was exercised red first, then green. The final targeted activity/context run passed 86 tests (34 activity, 52 context); `pnpm typecheck` and `pnpm build` passed on Node 24. Local Markdown links and `git diff --check` passed. The full suite and combined-delivery review are reserved for the parent delivery.

Behavioral cases include complete empty months, inclusive one/31-date ranges, invalid/reversed/32-date rejection before HTTP, DST and three-month boundary traversal, source identity deduplication without collapsing similar records, conflicting IDs across dates/partitions, bounded partition termination, malformed/unknown pagination metadata, first/later partition failure, partial-day detail recovery, the 500-detail limit, selected-gym filtering, foreign-account rejection, record-date disagreement, confirmed zones, and arbitrary-selector rejection. Recovery tests verify one allowance across discovery and later reads, retrying only the failed read, no refetch of recovered entries, repeated expiry, authentication failure, and changed account/membership.

The explicit official SDK stdio harness independently authenticated and retrieved raw calendar/detail responses for a 22-date actual interval. It compared all selected-gym IDs, original exercise names and prescription values, block notes, full record dates and completed-date coverage against the MCP result. Available detail comparison passed, coverage was complete for all requested dates, explicit/inaccessible gym selection passed, and server stderr was empty. The comparison was repeated successfully after stricter calendar validation. Only sanitized pass/coverage outcomes were emitted; no credentials, identifiers or workout content were persisted. Replay with injected credentials/confirmed zones and `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_ACTIVITY_START=<start> AIMHARDER_LIVE_ACTIVITY_END=<end> pnpm test:live` after building; use an actual nonempty interval to verify detail availability.

The independent investigation also confirmed an empty preceding/following calendar month, zero-based month semantics, self-account/gym identity for detail records, calendar dates against the timestamp in the confirmed zone, and matching source IDs in a separately fetched personal feed. The feed's first two pages and the official continuation/sentinel logic were inspected, but exhaustive feed traversal was not performed or needed: the implementation retrieves finite calendar partitions. This distinction is documented in [API research](api-research.md).

Training-session grouping, attendance and within-day training times remain unverified; the result explicitly provides no session identifier or start time. Live evidence is for one account/gym and the observed Spanish date locale. Concurrent edits can change records between reads; coverage is not an atomic snapshot or an assertion about deleted/unpublished records. Partial, multi-gym, retry and limit variants are fixture-tested, not manufactured live. The calendar/credential ADRs document changed access and recovery behavior; the glossary records training sessions versus active days. Distribution and unrelated architecture decisions are unchanged by this slice.

Issue #8 review: the Standards closeout finding (missing validation record during review) was resolved by the completed section above. Spec reported no actionable findings. The parent independently repeated all 86 targeted tests successfully before commit.

## Recent activity alternative (2026-09-22)

Issue #9 now has a consuming-client recent-day alternative using the reusable activity tool. It does **not** fulfill or close the latest-five-training-sessions requirement: training-session grouping, attendance and within-day chronology remain unverified. The output explicitly reports this blocker and distinguishes days from entries/sessions.

Behavioral red/green checks through the public MCP interface with real API-client HTTP fixtures cover older 31-date windows, multiple entries on one day, duplicate IDs, conflicting identities across windows, retaining all cutoff-day ties, sparse/empty bounded results, first-window failure, partial newer detail retrieval and input bounds. Node 24 `pnpm typecheck`, `pnpm build` and the targeted recent-activity tests passed (11 tests). No TDD skill was installed; red/green followed the repository's agreed MCP/HTTP seam. The full suite is reserved for the combined delivery.

The official SDK stdio client independently compared actual recent results with fresh raw calendar and detail queries. It returned five days in one 31-date window, with matched complete coverage, original notes/exercise names, source IDs including cutoff-day alternatives, and record dates. No explicit session/time key was found in those raw details. Authentication, explicit and inaccessible gym selection, and empty server stderr also passed. The existing 22-date interval comparison passed in the same live run. Only sanitized outcomes were printed; no booking or other write was performed. Replay with the explicit live gate and `AIMHARDER_LIVE_RECENT_END=<gym-local-end-date>` after building. Cross-window, partial, missing-detail and tied-date behavior is fixture evidence, not manufactured live data.

The existing activity ADR now records the consuming-client boundary and conservative alternative; no new server tool or upstream operation was added. The glossary, credential policy, account architecture and distribution ADRs retain their existing meanings. README, MVP status and API evidence distinguish the completed alternative from #9's remaining acceptance blocker.

Issue #9 reviews: Standards reported no findings; Spec reported no fixable defects and one known acceptance blocker (distinct training-session grouping). The combined recent/activity targeted run passed 45 tests. Issue #9 remains open.

## Issue #10: period activity frequency alternative (2026-09-22)

Implemented a consuming MCP client and runnable stdio example for previous-month and explicit-period queries. The full previous month is resolved in the selected gym's confirmed zone. Longer periods use explicit nonoverlapping intervals of at most 31 inclusive dates, capped by a configurable 1–12-window budget. Output separates activity-entry counts, days with activity and the blocked training-session total. Recovered counts are explicitly lower bounds on incomplete periods; exact alternative totals require complete coverage. Original entry details, per-window failures/notices and completed dates remain available.

Verification on Node 24:

- Red: the new MCP/HTTP tests initially failed because the period consumer module did not exist.
- Green: `pnpm test tests/activity-period.test.ts tests/recent-activity.test.ts tests/activity.test.ts` passed **64 tests** (19 period, 11 recent, 34 interval). Fixtures cover 28/29/30/31-day months and year rollover, opposite gym time-zone boundaries, complete empty periods, same-day distinct entries and duplicate references, adjacent windows reading overlapping calendar months, conflicting identity dates, first/later failures, incomplete recovered dates, window budget and zone/input validation. Session scenarios deliberately assert unresolved grouping, not an invented fixture session interpretation.
- `pnpm typecheck` and `pnpm build` passed. Shared consumer response validation was followed by rerunning the recent and interval regressions.
- The full suite is deferred to the coordinated final delivery, not claimed as run for this slice.

The official MCP SDK stdio harness separately passed independent raw calendar/detail comparison for the previous month (August 2026: 31 dates, complete, zero entries and zero activity days) and 1–22 September 2026 (22 dates, complete, ten entries on ten activity days). Both runs exited 0, with empty server stderr, verified gym selection and the confirmed Europe/Madrid zone. The harness compared identity/date/notes and the counting basis without printing private content or IDs. No booking or write operation was performed.

Replay after building and injecting credentials and confirmed zones: `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_PREVIOUS_MONTH=1 pnpm test:live`; for a nonempty alternative use `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_PERIOD_START=2026-09-01 AIMHARDER_LIVE_PERIOD_END=2026-09-22 pnpm test:live`. These issue explicit read-only queries; fixture tests require no credentials.

**Acceptance blocker:** #10 remains open. Neither source activity identity nor equal record dates establishes distinct training sessions or attendance. Complete entry/day coverage does not satisfy the requested exact training-session total, including for an empty calendar. Broader accounts, live multi-window periods, partial upstream scenarios and any undiscovered session grouping remain unverified. The existing activity ADR is extended for this composition; authentication/security, API separation, server tool schemas, domain vocabulary and distribution decisions are unchanged.

Issue #10 reviews: Standards found no hard violations and one optional duplication cleanup in the consumers; the small discovery/merge blocks remain local while shared response validation is centralized. Spec found no fixable defects and the documented session-grouping acceptance blocker. Issue #10 remains open.

## Installable compiled package (#11, 2026-09-22)

The local `aimharder-mcp@0.1.0` archive was installed outside the checkout using npm with `--ignore-scripts --omit=dev` under Node 24.21.0. The official MCP SDK client and server both resolved dependencies from that production installation; the executable was the installed `.bin/aimharder-mcp`. TypeScript, Vitest, MSW and Node type definitions were absent from the consumer install. The archive contained only compiled JavaScript and explicitly allowed public documentation/metadata, with no evidence, source, fixtures, credentials or local configuration.

Automated anonymized coverage exercises initialization, six-tool listing, automatic and explicit account/gym selection, inaccessible-gym rejection, sanitized authentication/access failure, and missing-credential startup with empty stdout. The child fetch seam intercepts all requests and rejects unknown URLs, so tests do not access AimHarder. A targeted test failed before packaging was implemented, then passed after the executable and allowlist were added. The check is included in `pnpm test` and can be run alone with `pnpm test:package`. npm dependency installation may access the registry; automated checks require no account credentials.

A separate `AIMHARDER_LIVE_CHECK=1 pnpm test:package:live` passed against one actual account and one accessible gym: initialization, six tools, authenticated context, automatic and explicit selection, and rejection of an inaccessible gym. Server stderr was empty and missing-credential startup remained sanitized. Credentials were supplied only in memory to the live harness/server; package build/install subprocesses received no account environment. Only authentication and account/gym reads were performed. No registry package was published, no other query family was revalidated through this package check, and other account variants remain fixture-tested only. Temporary installation and archive are removed after verification; sanitized output identifies artifact integrity without persisting credentials.

The npm distribution ADR and README describe this implementation. Existing security, API separation, query-scope and domain decisions remain unchanged. Registry release and exact-version registry verification belong to #12; #6 future-content evidence and #9/#10 training-session grouping remain open acceptance gaps.

## Coordinated issues #7–#11 delivery (2026-09-22)

The five implementation sessions ran consecutively, with independent Standards and Spec subagent reviews. On supported Node 24.21.0, the final `pnpm test` run passed **248 tests across 10 files**, including the external packaged-install test. That test rebuilt and packed the runtime, inspected the archive allowlist, installed production dependencies outside the checkout, and verified the installed executable over MCP with anonymized HTTP fixtures. `pnpm typecheck`, all tracked script syntax checks, local links across 19 Markdown files, and `git diff --check` also passed. No real account was used by the automated suite.

Separate explicit live SDK checks passed for available booking history, personal activity intervals, recent-day alternatives, period entry/day alternatives, and installed-package account/gym discovery. Their scope and limitations are recorded in the sections above; fixture results are not substituted for live evidence. The final documentation update follows those checks and does not change runtime behavior.

Final Standards review found no hard violations and one optional duplicated-merge cleanup in the two activity consumers. Final Spec review found no fixable defects or scope creep and two unresolved acceptance blockers: verified distinct training-session grouping for #9 and #10. Those issues remain open; the implemented day/entry alternatives do not fulfill their training-session requirements. Issues #7, #8 and #11 are complete within their documented availability boundaries. The older #6 future-content live gap and #12 registry publication remain outside this delivery.

All changes are committed locally on the existing `main` branch. No push or npm publication was performed. The credential, domain and architecture decisions remain consistent with the affected history/activity/distribution ADR updates; unrelated ADRs required no changes.

## Entry-based acceptance for #9 and #10 (2026-09-22)

The user clarified both conversational requests: recent results mean the latest five activity entries, and period frequency means the number of distinct activity entries. The previous grouping blockers are superseded by [the entry semantics ADR](adr/2026-09-22-activity-entry-query-semantics.md). No new upstream session, attendance or timestamp meaning is asserted.

The recent consumer now counts entries, returns a flat bounded list and removes the blocked physical-session result. Same-date IDs are only deterministic presentation order; a cutoff that splits tied-date entries reports selected/omitted counts and prevents uniquely verified latest membership. The period consumer uses `activity-entries` as its primary basis, retains supplementary day counts, and keeps null exact totals on incomplete coverage. Complete empty periods correctly have zero entries. Interval access, identity deduplication and retry/security behavior are unchanged.

Red/green checks exercised the real MCP/client and anonymized HTTP boundary: the revised recent assertions failed before the change, then all 14 recent tests passed; the period assertions likewise failed first, then all 19 period tests passed. Coverage includes multiple same-date entries, count-based stopping, date order versus ID order, split cutoff ties, incomplete newer results even when enough entries were recovered, cross-window identity conflicts and all existing monthly date/coverage cases.

Separate official SDK stdio live checks passed against independently fetched calendar/detail responses. Recent retrieval returned five entries from one complete 31-date window ending 2026-09-22, with no split cutoff tie, verified selection membership, original detail comparison and explicit unverified within-date order. Period checks passed for the previous month (31 complete dates, zero entries) and 1–22 September (22 complete dates, ten entries). Account/gym selection passed and server stderr was empty. Only sanitized counts/outcomes were recorded. Same-date ambiguity and partial cases remain fixture-tested, not manufactured live.

The glossary, MVP, README, research and GitHub parent/child specifications now use the confirmed entry unit. The earlier composition ADR sections are marked superseded; historical validation records are retained. Unrelated authentication, API separation, distribution, class and workout decisions are unchanged. The remaining first-delivery future-workout check (#6) and registry publication (#12) are unaffected.

Final revised verification passed on Node 24: **251 tests across 10 files**, including isolated package installation, plus typechecking, build, all script syntax checks, local links across 20 Markdown files and `git diff --check`. Separate Standards and Spec reviews against `cb73950` both reported zero findings. Issues #9 and #10 meet the user-clarified entry-based acceptance criteria; the former physical-session grouping blockers no longer apply. Changes are committed locally on `main`, without push or npm publication.

## Final QA handoff (2026-09-23)

The user explicitly approved closing implementation #6 and moving its outstanding actual published-future-workout live check to [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). No new live verification was performed in this handoff, and no missing evidence is marked passed. The user intends to check after the gym publishes tomorrow's content in the evening; the target date must be derived from the actual run time in the confirmed gym zone.

QA #13 owns the consolidated functional and local-package acceptance matrix, including current entry-based #9/#10 requirements. It blocks publication #12 through a native GitHub dependency. The QA ticket does not depend on #12: exact registry-version acceptance and full MVP closure remain subsequent release requirements. README, MVP and the distribution ADR reflect this ownership change. Authentication, API behavior, glossary and existing coverage limitations are unaffected.

## Hermes installed-package connection (2026-09-23)

A fresh local `0.1.0` archive was built and installed outside the checkout with Node 24.21.0, production dependencies and install scripts disabled. An official MCP SDK stdio client using that installation's dependencies initialized the installed server and listed all six tools with empty server stderr. Placeholder credentials were used only for discovery; no upstream request or live authentication was performed.

The selected Hermes profile now has an enabled stdio server entry pointing to the installed package and a separate environment-file path. `hermes -p <profile> mcp test aimharder` passed and discovered all six tools. A separate official SDK client authenticated the installed server against AimHarder and discovered the account's single gym with empty server stderr. Conversational acceptance inside an existing Hermes chat and the outstanding future-workout QA remain unverified.

The user enabled 1Password MCP integration and authorized account/environment access. The existing login's username and password were transferred in memory into a dedicated Developer Environment, which was mounted as a local `.env` through the 1Password MCP server. The mount and variable names were verified through MCP metadata without displaying secrets. The previously confirmed gym time zone was configured as `Europe/Madrid`. Private paths, identifiers and credentials are excluded from this record. See [the setup guide](hermes-setup.md).

The security, runtime and distribution ADRs were reviewed: this setup follows the existing local stdio, environment-based authentication and installed-package decisions. No architecture, API contract or scope decision changed, so no new ADR is needed.

## Recorded activity block results (2026-09-23)

Implemented personal `blocks[].result` projection from the existing workout-detail response. The user's supplied sample was parsed locally and all allowlisted block results matched the source without logging or storing personal data. The user confirmed `time` is in seconds. This sample comparison is not a new authenticated live request.

Verification: `pnpm typecheck`, `pnpm test` (259 tests across 10 files), and `pnpm build` passed. The official MCP SDK in-memory harness covers results, seconds preserved without conversion, null/absent/zero values, RX source labels, deleted blocks, excluded profile/ranking/chart data, partial recovery on invalid result types, and propagation to recent/period consumers. The live activity harness now independently compares all allowlisted result fields, but the new live comparison was not run: credentials were not available in this process. Prior live acceptance remains historical evidence, not proof of this extension. Local Markdown links and `git diff --check` passed.

The README, MVP, API research and personal-activity ADR were updated together. The glossary, published-workout decision and security decisions were reviewed and remain unchanged: no new domain term, endpoint, authentication behavior, or other-member data access is introduced.

### Current-result description follow-up (2026-09-23)

The supplied response was checked locally: the description reaches the correct activity block through the `TIPOWODs[].id` / `chartData` key and `idAction` join; the other block has no description. The user confirms the sample's `7R` meaning for that class, not all gyms. No personal response was copied into fixtures or logs.

`pnpm typecheck`, `pnpm test` (267 tests across 10 files), `pnpm build`, the live harness syntax check, local-link checks and `git diff --check` passed. MCP tests cover current activity/block selection, unrelated history exclusion, deleted blocks, arbitrary gym notation, null/empty/missing/duplicate descriptions, conflicting/invalid matches and recent/period consumer propagation. The live harness was extended, but this remains supplied-sample and fixture validation, not a new live acceptance claim. README, API research and activity/security ADRs now document the narrow exception to chart exclusion. Scope and glossary are otherwise unchanged.

### Installed Hermes package refresh (2026-09-23)

Rebuilt, repacked and reinstalled the local archive into the user-designated Hermes installation. Every installed JavaScript file matched the checkout build. Under Node 24.21.0, the installed parser preserved the supplied current-block description, and an official SDK stdio client confirmed that the installed `get_personal_activity` output schema exposes `blocks[].result.desc`. Initialization used synthetic configuration and made no authentication request. The private environment file was not read or changed. Hermes must reload its connection to start this refreshed installation; the agent did not reload the user's Hermes session. No architecture/security decision changed. The setup guide now distinguishes archive installation from connection reload.

## Published difficulty variants and installed-package refresh (2026-09-23)

The user's three screenshots and supplied gym API URL were investigated through an authenticated read-only session after verifying that the configured account belonged to the gym. An anonymous request yielded HTML rather than the feed JSON. The official gym renderer and fresh workout details established the ordered `scaledops`/`scaledver` relationship described in [API research](api-research.md). No full upstream response, cookie, credential or personal identifier was stored.

The official MCP SDK stdio harness compared `get_published_workouts` against independent raw feed/detail reads for **24 September 2026**, a future date at the time of the checks. WOD and Metcon each returned one available publication with three variants. For both classes, the ordered labels, selected block notes, exercise names and every exposed prescription value matched the raw response. The observed labels were `SCALED`, `INTERMEDIO` and `RX`. No matching class sessions appeared in the daily schedule for that date during these checks, so they establish published future-content retrieval, not a complete next-day workout-and-booking scenario. First-page feed coverage remains incomplete; other gyms, labels and source variants remain unverified.

The same live harness compared personal activity over 1–23 September: all 23 calendar dates had complete coverage and the returned details, including allowlisted block results, matched independently retrieved account records. This validates the previously added result projection on the observed account, without establishing a universal score convention or training-session grouping.

Verification on Node 24.21.0: `pnpm typecheck`, `pnpm build`, `pnpm test` (**271 tests across 10 files**), `pnpm test:package`, harness syntax, `git diff --check` and local Markdown link checks passed. The workout suite passed 23 tests, including WOD/Metcon variants, shared-block fallback, malformed variant handling and private-field exclusion. The package archive was installed at the user-designated Hermes path; all 13 installed JavaScript files matched the checkout build. `hermes mcp test aimharder` connected and discovered six tools. A separate official SDK stdio client called the installed server with the account and confirmed an available future WOD with the same three labels and empty server stderr. The Hermes discovery command starts a fresh server process; an already open Hermes chat still needs its connection reloaded to use the refreshed build.

README, MVP, API research and the amended published-workout ADR now describe the source-labeled variant output and the new future-content evidence. The earlier dated validation sections remain as historical results from before content was available. Final combined functional QA #13 and npm registry publication #12 remain open. The domain glossary, security and personal-activity decisions were reviewed; this change introduces no new domain category, endpoint, access scope or result-score interpretation.

## Exercise value and load units (2026-09-24)

The user's WOD, GAP and Mobility examples were compared with fresh authenticated, read-only publication details after verifying the configured account's membership in the gym. The official frontend's `formaReg`, `tipoud` and `tipoud2` rendering rules supplied the unit mapping; see [API research](api-research.md). Only selected public exercise fields were inspected, and no response, account identifier or credential was retained. This validates the observed gym and renderer, not all possible source formats.

An official MCP SDK stdio client compared the new `valueUnit` and `loadUnit` fields, raw prescription fields, exercise names, blocks and variants with independent feed/detail reads. The 23 September WOD passed with one publication and three variants, GAP passed with one publication and no variants, Mobility passed with one publication and no variants, and the 24 September WOD passed with one publication and three variants. A personal-activity comparison over 1–23 September also passed with complete coverage for 23 dates and available details. Server stderr remained empty.

A separate MCP call to the built server confirmed the concrete answer fields: Front Squat has `valor2="85/85"` and `loadUnit="%RM"`; the 24 September alternating dumbbell snatch has level-specific `valor2` and `loadUnit="kg"`; WOD `Descanso Rest` has 30/90-second `valor1` entries and `valueUnit="s"`; GAP's UI `1'` rest retains 60 seconds; the unweighted lunge has `valueUnit="reps"` without `loadUnit`; and Mobility's carry has `valueUnit="m"` without `loadUnit`. Empty `valor1` entries receive no unit. Raw values remain unchanged.

On Node 24.21.0, `pnpm typecheck`, `pnpm build`, `pnpm test` (**272 tests across 10 files**), `pnpm test:package`, harness syntax, `git diff --check`, and local Markdown link checks passed. The new behavioral test covers load, time, distance, repetitions, absent values and unknown unit codes through the public MCP interface. No new AimHarder operation or personal-max calculation was added. The README, MVP, API research, published-workout ADR and personal-activity ADR were updated; the glossary, credential security and distribution decisions remain unaffected.

The local archive was rebuilt and reinstalled at the path used by Hermes. All 13 installed JavaScript files and the checked package documentation matched the checkout. `hermes mcp test aimharder` discovered all six tools. An official MCP SDK client then queried that installed server with the configured account and confirmed the Front Squat `%RM`, unweighted lunge repetitions, GAP rest seconds, Mobility carry meters, and kilogram loads in all three 24 September WOD variants; server stderr was empty. An already open Hermes conversation still needs `/reload-mcp` to start the refreshed build.

## First-release functional QA verdict (#13, 2026-09-24)

The functional evidence below is evaluated against [the parent MVP](mvp.md) and [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). The source baseline is `2d0ab1666cb98861b38e4fd4eefe79f1c7bc4de5`; the first candidate release remains version `0.1.0`. The verified gym uses the user-confirmed `Europe/Madrid` zone. Historic live checks used the official MCP SDK over stdio; the user's 23 September future-WOD conversation used Hermes with a locally installed package. The exact source revision of that Hermes conversation is not independently identified by its excerpt; the later 24 September unit check above used a build matching the checkout at `2d0ab16`.

| Functional area | Evidence retained | Coverage boundary |
| --- | --- | --- |
| Account/gym and read-only access | Live SDK account selection and installed-package account query above; current `hermes mcp test aimharder` initialized the installed server and listed six tools. | One actual account/gym. Hermes tool discovery alone does not authenticate. Multiple gyms, 2FA and restrictions remain fixture-tested. |
| Weekly classes and exact occupancy | Seven-date and Wednesday 07:00 Metcon independent live comparisons in the class section above. | Occupancy is not attendance and may change between reads. |
| Published workouts | Independent feed/detail comparison of future 24 September WOD and Metcon, including source-labeled variants; subsequent independent unit comparison at `2d0ab16`. The user supplied a Hermes response from 23 September describing the future 24 September WOD's three variants. | The supplied excerpt establishes content retrieval, not its session/booking composition or the full source revision. Feed coverage is bounded. |
| Combined workout and bookings | Earlier SDK check compared current content, an unavailable next-day result, and an existing reservation. The 17 targeted consumer tests passed at this audit, including unconfirmed absence behavior. The user quoted Hermes: "la consulta de horarios de mañana no devolvió ninguna clase. Eso no confirma una sesión reservable." This reports an empty schedule without claiming a bookable session. | The Hermes excerpt does not report matching booking times or a structured booking coverage result. The exact combined published-future-content harness run was not performed; the user accepted aggregate evidence for first-release QA instead. No WOD booking is manufactured. |
| Upcoming and historical bookings | Earlier independent live upcoming, schedule-match and available-history comparisons. | Upcoming and history views have limited date/history coverage; attendance is unverified. |
| Personal activity, recent entries and period counts | Independent live calendar/detail, latest-five and month/interval comparisons above, with the user's confirmed activity-entry unit. Current result projection and prescription units were compared separately. | Same-date chronology is unverified; partial retrieval cannot support exact totals. No physical-session or attendance count is claimed. |
| Archive and protocol | On Node 24.14.0 with pnpm 12.5.1, `pnpm typecheck`, `pnpm test tests/package.test.ts`, `pnpm test tests/consumer.test.ts`, `pnpm build`, `pnpm test:package` and the full `pnpm test` suite (272 tests across 10 files) passed. The isolated archive had 37 allowlisted files, an installed executable, six tools and empty server stderr. A fresh `pnpm test:package:live` equivalent passed on 2026-09-24 with the installed archive and actual account/gym, including explicit/inaccessible selection and empty stderr. | These are local archives; the public registry version has not been published or checked. |

`npm whoami --registry=https://registry.npmjs.org/` returned the authorized account `rude`; `npm view aimharder-mcp@0.1.0` returned E404 before publication. That establishes current login and an absent package record, not guaranteed name ownership. The [release procedure](releasing.md) and `scripts/registry-check.mjs` are prepared for exact registry-version validation after the functional gate passes. No npm publication or registry-installed MCP result is claimed at this stage.

**QA verdict: accepted by the user on 2026-09-24 for the first release.** The user explicitly accepted the installed-package Hermes future-WOD check plus the independent and historical live/automated evidence above in place of the originally required single combined future-content harness run. This is a change to #13's validation criterion, recorded in [the QA evidence decision](adr/2026-09-24-functional-qa-evidence-for-first-release.md), not a claim that the command ran or that every query was repeated on one source revision. Hermes's quoted schedule wording correctly avoids inventing a reservable session. The `queryTraining` composition returns `bookingSummary.status: "unconfirmed"` when no matching reservation is visible. Only one actual account/gym was checked; feed, booking and history coverage limits remain. This resolves the functional QA gate for #12, whose public registry checks remain separate.
