# Validation record

This page records what was checked against AimHarder, what was checked only with anonymized fixtures, and what remains unknown. Live checks used one account at one location (9NBC). They do not establish behavior for every gym. The user defined recent and period activity questions in terms of **activity entries**; earlier physical-session grouping blockers were superseded by [the entry semantics decision](adr/2026-09-22-activity-entry-query-semantics.md).

## Current release status

The user accepted first-release functional QA on 2026-09-24 using the combined evidence below and [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). The exact single-run future-workout-plus-booking harness check was **not performed**; the user accepted separate live comparisons and a Hermes future-WOD check instead. See the [QA evidence decision](adr/2026-09-24-functional-qa-evidence-for-first-release.md).

`aimharder-mcp@0.1.0` has **not been published to npm**. Local archives and an installed Hermes copy were checked, but the exact registry-version check in [#12](https://github.com/rudeayelo/aimharder-mcp/issues/12) remains pending.

## How checks were performed

Live checks used the official MCP SDK over stdio, a built server or locally installed archive, and separate read-only AimHarder responses for comparison. Credentials and private responses stayed in process memory; recorded output contains sanitized counts and outcomes. No booking, cancellation, profile edit or other-member query was made. The tested gym's `Europe/Madrid` zone was confirmed by the user before the date-based live checks.

Automated tests use the public MCP interface and real API client with anonymized HTTP fixtures; unexpected requests fail. They cover failure, retry, partial-coverage, date-boundary and multi-gym cases that were **not** deliberately reproduced with the live account. A passing fixture is not evidence that AimHarder uses that response format in another gym.

## Account and gym discovery (2026-09-21)

An authorized login POST succeeded, and root `/api/whoami` returned one matching account identity and one `client` gym membership. An unauthenticated GET returned HTTP 200 with `data: []`: HTTP success alone does not prove authentication. The initial SDK stdio check initialized the server, listed `get_account_context`, selected the sole gym automatically and explicitly, rejected an inaccessible ID and produced empty stderr. It did not find an upstream gym-zone field. At that point the server reported an unverified zone; the later [default-zone change](#consumer-setup-and-default-zone-2026-09-24) supersedes that behavior.

The first source-built slice passed `pnpm typecheck`, `pnpm build` and 52 MCP/fixture tests. Fixtures covered membership variants, identity mismatches, session expiry, malformed responses, cookie scope, redirects and restrictions. Real multi-gym selection, 2FA, invalid credentials, rate limits and `.com` account equivalence remain unverified.

## Class schedules and occupancy (2026-09-22)

The official schedule frontend established daily `/api/bookings` requests with membership `boid` as `box`. One observed Wednesday had 19 sessions; a Sunday returned a valid empty list. Source `ocupation/limit` means displayed occupied places/capacity, not attendance or booking eligibility. The user confirmed the tested gym's `Europe/Madrid` zone, including daylight-saving changes; this was operator confirmation, not API discovery.

Two independent live stdio comparisons passed:

| Query | Result |
| --- | --- |
| 2026-09-21 through 2026-09-27 | Seven daily responses, 73 sessions and two empty days. Session IDs, dates, time labels, class types, occupancy and capacity matched fresh raw responses. |
| 2026-09-23, 07:00 Metcon | The exact filtered result matched the 19-session daily response, including occupancy and capacity. |

The full suite then passed 100 tests on Node 24. Fixture cases covered null/zero counts, duplicates, unknown envelopes, later-day failure, routing, DST and date boundaries. A complete result covers the requested daily responses; it does not guarantee future publication or an atomic occupancy snapshot.

## Upcoming bookings (2026-09-22)

The official `/diary` frontend reads `/api/nextBookings` and renders `nextClasses` separately from `history`. One live upcoming entry had state `1` (booked); the renderer maps `0` to waitlisted. Its ID was neither the matching schedule-session ID nor the class-type ID, so the tool leaves those joins null. The response had no verified pagination or future-date horizon.

`AIMHARDER_LIVE_BOOKINGS=1` passed a separate SDK stdio comparison: the one entry's date, time, class name and state matched a fresh upstream response and an unambiguous daily schedule match. Default/explicit gym selection, inaccessible-gym rejection and empty stderr also passed. The Node 24 full suite passed 136 tests. Empty, waitlisted, unknown-state, multi-gym and malformed-response cases had fixture coverage only. `coverage.status: "complete"` covers the current upcoming view, **not** an arbitrary future interval; no matching booking cannot prove absence on a chosen date.

## Published workouts and combined questions (2026-09-22)

The gym's current publication feed and workout detail establish intended `recordDate` separately from `publishDate`. An independent live comparison found one available 2026-09-22 WOD with three blocks and nine exercises; its source titles, notes and prescriptions matched. Five class sessions shared that day's class type, without a unique workout-to-session ID. The 2026-09-23 WOD was unavailable in the inspected feed view while five matching sessions existed. Three future-dated pinned announcements were excluded. This `unavailable` result was limited to the current feed page, not proof that no publication would appear later.

The consuming SDK client `queryTraining` also passed separate live comparisons. It preserved an unavailable next-day workout with unconfirmed booking status, an available current-day workout with several sessions, and one actual booked time on another date/class despite unavailable workout content. These reads were not atomic and did not establish a complete future booking horizon. The workout tool's targeted suite passed 19 tests and the combined consumer suite 17; the full Node 24 suite passed 172 tests at that stage. Future available content was still pending at that moment; [later checks](#difficulty-variants-and-future-content-2026-09-23) supplied that evidence separately.

## Booking history (2026-09-22)

The authenticated `/diary` renderer and a fresh `/api/nextBookings` response exposed 30 historical records. A live SDK stdio comparison matched all 30 dates, times, class names, source flags, state precedence and newest-first output. The renderer labels `lateCancel=1` before booked/waitlisted states. `assist=1` appeared together with `lateCancel=1`; attendance remains unverified.

No historical cursor, total or date horizon was observed. Thirty is an observed count, not a hard limit. Empty history does not prove empty lifetime history. Duplicate, malformed, partial and access-error cases were checked with fixtures. The targeted history/context/upcoming run passed 99 tests on Node 24.

## Personal activity and entry summaries (2026-09-22)

The authenticated activity calendar uses zero-based month numbers and lists source activity IDs by date. The implementation retrieves calendar partitions and linked workout details, then verifies account, gym and record date. It does not use feed publication order to infer training chronology. An SDK stdio comparison over an actual 22-date interval matched source IDs, record dates, exercise names, prescriptions, block notes and complete date coverage against fresh calendar/detail responses. Empty adjacent months and matching IDs in the personal feed were also observed.

The activity tool's targeted context/activity run passed 86 tests. Fixtures covered inclusive 1–31-day ranges, rejected 32-day ranges, three-month traversal, duplicate/conflicting IDs, partial detail recovery, 500-detail bound, expiry and authorization errors. Partial/multi-gym variants were not manufactured live. Entries have no verified within-day training time, physical-session identifier or attendance meaning.

The initial #9/#10 implementation counted recent days and period entries/days while physical-session grouping was unresolved. Historical tests and checks for that alternative remain in Git history. The user then clarified that **five recent activity entries** and **distinct activity-entry counts** are the intended answers. The [entry semantics ADR](adr/2026-09-22-activity-entry-query-semantics.md) supersedes the grouping blocker. Revised live SDK comparisons passed:

| Query | Result |
| --- | --- |
| Five recent entries ending 2026-09-22 | One complete 31-date window; five source entries matched independent calendar/details. No cutoff-day tie occurred. Within-day order remains unverified. |
| Previous month, August 2026 | Complete 31 dates, zero entries and zero days with activity. |
| 2026-09-01 through 2026-09-22 | Complete 22 dates, ten entries on ten dates; identities, dates and notes matched. |

Several entries on one day, split cutoff ties, incomplete windows and cross-window conflicts were fixture-tested. Exact period counts require complete requested-date coverage. After the clarification, the Node 24 full suite passed 251 tests across 10 files, including the isolated package check.

## Local install and Hermes (2026-09-22–23)

The `0.1.0` archive was installed outside the checkout under Node 24.21.0 with production dependencies and lifecycle scripts disabled. The installed executable initialized through the official MCP SDK, listed six tools and passed fixture-based account/gym selection, sanitized-error and missing-credential startup checks. TypeScript, tests, fixtures and private files were absent from the consumer install. `pnpm test:package` repeats this local archive check.

A separate `AIMHARDER_LIVE_CHECK=1 pnpm test:package:live` passed account/gym discovery against the actual account, including explicit selection and inaccessible-gym rejection. It did not recheck every query family through that archive. `hermes mcp test aimharder` connected a local installation and listed six tools; tool listing alone did not authenticate. A separate installed SDK client authenticated and discovered the gym. The user later supplied a Hermes future-WOD response; its source revision was not independently identified in that excerpt.

The Hermes setup used a private environment mount. Credential values, mount paths and account identifiers were not recorded. Updating the installed package requires reinstalling it and reloading the Hermes MCP connection; `/reload-mcp` alone does not replace package files. None of these checks used the public npm registry version.

## Recorded activity results (2026-09-23)

A user-supplied workout-detail sample established allowed block result fields (`res`, `reps`, `time`, `rondas`, `rx`, `rxstr`) and confirmed that `time` is seconds. This was a supplied sample, not a new authenticated request. The projection preserves missing, null and zero values; `rx: false` alone does not establish scaling. The sample also linked `chartData[block.id]` to the current activity with `idAction`, supplying `result.desc`. The user's `7R` example meant seven complex rounds in that class, not a universal score format. Unrelated chart history, profiles and rankings remain excluded.

Fixture-based MCP tests and local sample comparisons passed (259 tests for basic results; 267 after description support). The new live result comparison was **not** run at that stage. A later [live activity check](#difficulty-variants-and-future-content-2026-09-23) verified the result projection on the observed account. An updated local Hermes installation exposed `blocks[].result.desc` in its schema; the user's open chat still required a reload.

## Difficulty variants and future content (2026-09-23)

Authenticated read-only investigation of the user's screenshots and the official gym renderer established source-order `scaledops` labels with matching `scaledver` block/exercise replacements and shared-block fallback. The observed labels were `SCALED`, `INTERMEDIO` and `RX`; other gyms may differ. No full upstream response or private identifier was stored.

An independent SDK stdio comparison found **future** 2026-09-24 WOD and Metcon publications, each with three variants. Source labels, selected block notes, exercise names and exposed prescription values matched fresh feed/detail responses. No matching class sessions were visible for that date during the check, so this proved future-content retrieval, **not** a complete next-day workout-and-booking scenario. The same harness compared personal activity over 2026-09-01 through 2026-09-23: all 23 dates had complete coverage and available block results matched independent account details.

On Node 24.21.0, typecheck, build, `pnpm test` (271 tests), package check, syntax and links passed. The rebuilt local archive was installed for Hermes; `hermes mcp test aimharder` found six tools. A separate installed SDK client confirmed an available future WOD with three labels and empty stderr. This was still a **local** package.

## Exercise value and load units (2026-09-24)

Authenticated read-only comparisons of WOD, GAP and Mobility publications with the official renderer established the observed `formaReg`, `tipoud` and `tipoud2` unit mappings. The SDK stdio harness matched 23 September WOD/GAP/Mobility and 24 September WOD source prescriptions and variants; a 23-date personal-activity comparison also passed with complete coverage.

Concrete checked examples:

| Source prescription | Returned meaning |
| --- | --- |
| Front Squat `valor2="85/85"`, `tipoud=4` | `loadUnit: "%RM"`; relative load retained, no personal-max conversion. |
| Level-specific dumbbell snatch `valor2` | `loadUnit: "kg"` for each observed variant. |
| Rest `valor1=["60","60","60"]` | `valueUnit: "s"`; the UI displays 60 seconds as `1'`. |
| Unweighted lunge with `valor1` and null `valor2` | `valueUnit: "reps"`, no phantom load unit. |
| Mobility carry with null `valor2` | `valueUnit: "m"`, no phantom kilogram load. |

The official renderer's observed weight labels are `kg`, `lbs`, `pood`, `%BW`, `%RM`, `RIR` and `RPE`; distance labels include `m`, `mi`, `yd`, `ft`, `steps` and `km`. Unknown formats remain unlabeled. On Node 24.21.0, typecheck, build, 272 tests, package check, syntax and links passed. The rebuilt Hermes installation matched the checkout JavaScript and its SDK client confirmed the same units with the actual account. An open Hermes conversation still needed `/reload-mcp`.

## First-release functional QA verdict (#13, 2026-09-24)

The audited source baseline was `2d0ab1666cb98861b38e4fd4eefe79f1c7bc4de5`. On Node 24.14.0, typecheck, build, the full suite (**272 tests in 10 files**), targeted package/consumer tests and the isolated package check passed. The archive had 37 allowlisted files at that stage, initialized over MCP, listed six tools and produced empty stderr. A fresh local-archive live account/gym check passed. Later [consumer-documentation packaging](#consumer-documentation-and-narrowed-archive-2026-09-24-issue-14) narrowed the archive to 23 files.

The user accepted the independent future-WOD, class, booking, activity and installed-Hermes evidence together. The Hermes excerpt showed future WOD content and correctly said an empty schedule did not confirm a reservable class. It did not show matching booking times or a structured booking coverage result. The original one-run combined future-content criterion was replaced by this aggregate evidence; it must not be reported as a command that passed. The `queryTraining` consumer keeps booking status `unconfirmed` when no matching reservation is visible.

Before publication, `npm whoami --registry=https://registry.npmjs.org/` returned the authorized `rude` account and `npm view aimharder-mcp@0.1.0` returned E404. This establishes login and an absent package record at that time, not name ownership or a release. [#12](https://github.com/rudeayelo/aimharder-mcp/issues/12) still requires publishing and testing the exact public version.

## Consumer documentation and narrowed archive (2026-09-24, issue #14)

The README was changed to focus on consumers. The npm allowlist includes the README, glossary, configuration, tools and four client guides; research, ADRs, development and validation remain on GitHub. On Node 24.14.0, typecheck, build, 272 tests and `pnpm test:package` passed. The isolated 23-file archive installed outside the checkout, listed six tools and passed anonymized account/gym/error checks with empty stderr. Local Markdown links and anchors passed. No registry package was downloaded or published.

The ChatGPT desktop STDIO form was observed in a user screenshot, but no package connection was tested there. Claude Desktop and OpenClaw guides followed their client documentation without package tests. Hermes evidence concerns a local archive.

## Consumer setup and default zone (2026-09-24)

The user requested `npx` as the generic command, Node `>=24`, and an optional gym-zone override. Unmapped gyms now use an explicitly reported **assumed** `Europe/Madrid`; configured zones report `user-confirmed`. This is a product assumption, not an upstream time-zone discovery. Prior live date checks used a confirmed zone and do not validate the fallback for another gym. See the [default-zone ADR](adr/2026-09-24-default-gym-time-zone.md).

On Node 24.14.0, typecheck, build, 272 tests and the 23-file isolated package check passed. On Node 26.9.0, typecheck, the same fixture suite and package check passed; test workers emitted experimental `localStorage` warnings without failed assertions. These checks cover those tested versions and fixtures, not future Node versions or real use of the assumed zone. The npm version remains unpublished.
