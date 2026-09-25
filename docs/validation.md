# Validation record

This page records what was checked against AimHarder, what was checked only with anonymized fixtures, and what remains unknown. Live checks used one account at one location (9NBC). They do not establish behavior for every gym. The user defined recent and period activity questions in terms of **activity entries**; earlier physical-session grouping blockers were superseded by [the entry semantics decision](adr/2026-09-22-activity-entry-query-semantics.md).

## Current release status

The user accepted first-release functional QA on 2026-09-24 using the combined evidence below and [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13). The exact single-run future-workout-plus-booking harness check was **not performed**; the user accepted separate live comparisons and a Hermes future-WOD check instead. See the [QA evidence decision](adr/2026-09-24-functional-qa-evidence-for-first-release.md).

`aimharder-mcp` is public on npm. Versions `0.1.0`, `0.1.1`, and `0.1.2` passed authenticated exact registry-artifact verification. Version `0.1.2` was published automatically through npm OIDC and is the current consumer pin. The registry and client results are recorded below, separately from the functional QA verdict.

## Release automation preparation (2026-09-24)

The [automation ADR](adr/2026-09-24-github-actions-npm-release-automation.md) records the agreed Changesets, CI, GitHub App, and npm OIDC workflow. On Node 24.14.0 and pnpm 12.5.1, the checkout passed a frozen install, typecheck, all 272 fixture tests, build, and the isolated 24-file package check. Changesets reported a patch release, and a temporary-copy run of `scripts/version-release.mjs` produced `0.1.2`, an updated changelog and six matching consumer-documentation pins; the resulting lockfile passed a frozen check. `actionlint` accepted both new workflows.

The `verify` check passed on [implementation PR #16](https://github.com/rudeayelo/aimharder-mcp/pull/16) in [Actions run 36022019846](https://github.com/rudeayelo/aimharder-mcp/actions/runs/36022019846). Repository Actions may create pull requests, and `main` requires a pull request plus the `verify` check, including for administrators. The `aimharder-mcp-release` GitHub App was installed only on this repository with Contents and Pull requests write access; its App ID and private key are in the repository Actions variable and secret. npm displayed the successful OIDC trusted-publisher connection for `rudeayelo/aimharder-mcp` and `release.yml`, with `npm publish` allowed. The automated release and local registry-check results are recorded below.

## Automated npm release 0.1.2 (2026-09-24)

After [implementation PR #16](https://github.com/rudeayelo/aimharder-mcp/pull/16) merged, the [version job](https://github.com/rudeayelo/aimharder-mcp/actions/runs/36022897896) used the GitHub App to create [release PR #17](https://github.com/rudeayelo/aimharder-mcp/pull/17). Its `verify` check passed all 272 fixture tests, typecheck, build, and isolated package check. The PR updated `package.json` to `0.1.2`, generated the changelog, and changed the README and five client guides to the same pinned version. `pnpm-lock.yaml` needed no change; the frozen installation passed. The release PR merged at source revision `9e76cf3fcef66e1b3ea10f5d5432fc9dd92ccfc0`.

The [release run](https://github.com/rudeayelo/aimharder-mcp/actions/runs/36023101635) passed the same pre-publication checks, packed the package, and reported `Successfully published: aimharder-mcp@0.1.2` through the OIDC-enabled publish job. It created [tag and GitHub Release `v0.1.2`](https://github.com/rudeayelo/aimharder-mcp/releases/tag/v0.1.2) at that source revision. The public npm registry returned the exact version, [tarball](https://registry.npmjs.org/aimharder-mcp/-/aimharder-mcp-0.1.2.tgz), integrity `sha512-XGrOg0fAPtXvT6mD8Cw4jq4VVS2HkH9J0fc7AxHpTTqjlRkBgIn5mguCS58FbabqPbS6iI1W3aaOvZD8IHdy8w==`, and a provenance attestation entry. The registry initially returned 404 shortly after the workflow finished and then served the version; that first 404 was publication propagation, not a failed release.

A later [documentation-only merge](https://github.com/rudeayelo/aimharder-mcp/pull/18) passed CI. Its [release run](https://github.com/rudeayelo/aimharder-mcp/actions/runs/36023803717) completed the mode selector and skipped the version, pack, and publish jobs, confirming that an ordinary merge with no unpublished version does not publish.

At 2026-09-24 16:04:59–16:05:03 UTC, `scripts/registry-check.mjs 0.1.2` installed the exact version from npm into a clean temporary directory/cache and passed on Node 24.14.0. The local 1Password service-account credential supplied the existing AimHarder login fields only to the verification subprocess; no values were printed, committed, or sent to GitHub Actions. The SDK stdio check passed initialization, listing all six tools, read-only authenticated account/gym discovery for one accessible gym, explicit selection, inaccessible-gym rejection, sanitized errors, and empty server stderr. This verifies the public registry artifact for the tested account and gym; it does not expand the broader functional QA or prove behavior at other gyms. Afterward, npm displayed the saved publishing-access setting **Require two-factor authentication and disallow bypass 2fa tokens**, while the `release.yml` OIDC trusted publisher remained enabled for direct `npm publish`.

## Public npm and client checks (2026-09-24)

The first published version, [`aimharder-mcp@0.1.0`](https://www.npmjs.com/package/aimharder-mcp/v/0.1.0), came from source revision `b0ca938ba130a61a6840a9803bffe601a585fb26`. Node 24.14.0 and pnpm 12.5.1 passed frozen installation, typecheck, build, 272 tests and isolated package verification. `npm pack --ignore-scripts` produced 23 allowlisted files with integrity `sha512-cZEfrJbcwyaSs8OyAEfQPHTZy1OCPq6rDudnR2ST1lvikHtXZ1ha6vPhWNo3z0YXu1RQo+uAGJlb10ZrttoB7Q==`. A read-only account/gym check from that local archive passed before publication.

The public registry returned version `0.1.0`, [the exact tarball](https://registry.npmjs.org/aimharder-mcp/-/aimharder-mcp-0.1.0.tgz) and the same integrity. `scripts/registry-check.mjs` installed that version into a clean temporary directory with a separate npm cache, then passed SDK stdio initialization, six-tool listing, a live account/gym query, explicit selection, rejection of an inaccessible gym, sanitized errors and empty server stderr on Node 24.14.0. This verifies the registry artifact, rather than only the checkout archive.

Hermes profile `ona` ran that pinned public version through the `npx` CLI under Node 24.21.0 with a private environment file outside the repository. `hermes -p ona mcp test aimharder` connected and listed six tools; a one-shot Hermes tool call returned authenticated account context without publishing identity details. Codex CLI had the same version-pinned local MCP command registered. An isolated `codex exec` session called `get_account_context` and returned authenticated account context. The first Codex CLI attempt timed out negotiating with its own code-mode host; after making its existing host executable available on `PATH`, the tool call passed. That timeout was a Codex client setup issue, not a registry artifact failure. The currently running Codex desktop task did not separately reload or call the newly registered server.

The `0.1.0` tarball bundled text saying npm publication was pending. Version [`0.1.1`](https://www.npmjs.com/package/aimharder-mcp/v/0.1.1) corrects the consumer docs and adds a Codex guide without changing MCP behavior. Its source revision is `2f63beb20f6d06078c956668642f65bb1a37e7dd`. On Node 24.14.0 and pnpm 12.5.1, frozen installation, typecheck, build, all 272 tests, the 24-file isolated package check and a separate live read-only check of that archive passed. The packed integrity was `sha512-aKuhn5r7GKjfmWZoQMuzRma+EC8PQK4AImRn9VZFSkqZaLS/uTWiwStjGQVvy0qyRsNGtI/SWWiMbYx8rv+mVQ==`.

At 2026-09-24 14:56 UTC, the public registry listed `0.1.1` as `latest` and returned [its tarball](https://registry.npmjs.org/aimharder-mcp/-/aimharder-mcp-0.1.1.tgz) with that same integrity. `scripts/registry-check.mjs` fetched the exact version with a clean temporary installation and cache. On Node 24.14.0 it passed initialization, six-tool listing, live account/gym discovery, explicit selection, inaccessible-gym rejection, sanitized errors and empty stderr. Immediately after, Hermes Agent 0.21.4 on Node 24.21.0 connected to the pinned `npx` release, listed six tools and returned authenticated account context. Codex CLI 0.156.1 called the same tool from its global MCP configuration and returned authenticated account context. These checks establish the installed registry version for one account and location; they do not expand the functional QA coverage or prove that the running Codex desktop app reloaded its configuration.

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

## Booking credits research (2026-09-24)

With account-holder authorization for local 1Password CLI access, a separate read-only check verified the existing account identity and 9NBC membership, then inspected the complete key structures of fresh `/api/whoami`, `/api/nextBookings`, and daily `/api/bookings` responses for 23 and 25 September (19 and 14 class rows). None contained an identifiable remaining-credit or tariff-period field. No balance endpoint has been verified, so a credit count or post-cancellation refund cannot be claimed from these reads. The [research note](research/2026-09-24-booking-credits.md) records first-party frontend leads and the remaining authenticated-account discovery gap. No booking or cancellation write was made.

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

Before publication, `npm whoami --registry=https://registry.npmjs.org/` returned the authorized `rude` account and `npm view aimharder-mcp@0.1.0` returned E404. This established login and an absent package record at that time, not name ownership or a release. The subsequent registry result is recorded [above](#public-npm-and-client-checks-2026-09-24).

## Consumer documentation and narrowed archive (2026-09-24, issue #14)

The README was changed to focus on consumers. The npm allowlist includes the README, glossary, configuration, tools and four client guides; research, ADRs, development and validation remain on GitHub. On Node 24.14.0, typecheck, build, 272 tests and `pnpm test:package` passed. The isolated 23-file archive installed outside the checkout, listed six tools and passed anonymized account/gym/error checks with empty stderr. Local Markdown links and anchors passed. No registry package was downloaded or published.

The ChatGPT desktop STDIO form was observed in a user screenshot, but no package connection was tested there. Claude Desktop and OpenClaw guides followed their client documentation without package tests. Hermes evidence concerns a local archive.

## Consumer setup and default zone (2026-09-24)

The user requested `npx` as the generic command, Node `>=24`, and an optional gym-zone override. Unmapped gyms now use an explicitly reported **assumed** `Europe/Madrid`; configured zones report `user-confirmed`. This is a product assumption, not an upstream time-zone discovery. Prior live date checks used a confirmed zone and do not validate the fallback for another gym. See the [default-zone ADR](adr/2026-09-24-default-gym-time-zone.md).

On Node 24.14.0, typecheck, build, 272 tests and the 23-file isolated package check passed. On Node 26.9.0, typecheck, the same fixture suite and package check passed; test workers emitted experimental `localStorage` warnings without failed assertions. These checks cover those tested versions and fixtures, not future Node versions or real use of the assumed zone. npm publication occurred after this local setup check.

## Read-only booking creation preparation (2026-09-25, issue #22)

The checkout's `prepare_booking_creation` tool was checked through an MCP SDK client with an in-memory transport and anonymized HTTP fixtures. The behavioral test verified exact gym/date/class/time matching, ambiguous alternatives, observed booking and waitlist states, source eligibility flags, a confirmed-zone gate, inaccessible-gym rejection, and sanitized failures. The request trace contained one login POST and only read-only account/schedule GETs; no booking or cancellation POST was sent. Reference storage tests cover action, account and gym binding, two-minute expiry, and single use. These are fixture results, not live upstream acceptance. The creation write contract, real-time eligibility, and credit balance remain unverified. No live booking was attempted.

## Booking creation execution (2026-09-25, issue #23)

The checkout's `execute_booking_creation` tool was tested through an MCP SDK client and anonymized HTTP fixtures. Thirteen targeted cases covered one write and fresh confirmed reads, expired/reused or invalid references, changed/already booked targets, duplicate prevention through the upcoming view, source denial, malformed response, authentication interruption, connection loss, unreadable or conflicting follow-up views, waitlist, and no automatic retry. Node 24.14.0 typecheck, build and targeted tests passed. The request contract is a candidate based on unofficial implementations, not a verified authenticated upstream write. No live booking was attempted, and no credit effect was validated.

## Read-only cancellation preparation (2026-09-25, issue #24)

The checkout's `prepare_booking_cancellation` tool was tested through an MCP SDK client with anonymized daily-schedule fixtures. Seven targeted cases cover an account-scoped reservation match, ambiguity, absence, already-cancelled and unsupported rows, confirmed zone and gym checks, the exact 9NBC 90-minute boundary including spring daylight saving, gym-local midnight/daylight-saving labels, safe errors, and cancellation-reference binding/expiry. The request trace contains the authentication POST plus account and schedule GETs; no cancellation POST was sent. These are fixture results, not live reservation-ID or credit-balance validation. No live cancellation was attempted.

For the combined #23–#24 checkout on Node 24.14.0, `pnpm typecheck` and `pnpm build` passed. The final `pnpm test` run passed **317 tests in 13 files**. `pnpm test:package` packed and installed the checkout outside the repository with production dependencies only, then passed MCP initialization, nine-tool discovery, account/gym selection, safe errors and empty server stderr. The local archive had 25 files. This checks a local archive; it is neither npm publication nor live AimHarder booking/cancellation acceptance.

## Standard cancellation execution (2026-09-25, issue #25)

The checkout's `execute_booking_cancellation` tool passed seven public MCP fixture cases covering a single standard cancellation request routed to the schedule reservation, fresh cancelled-state reconciliation, stale/expired/reused references, changed or ambiguous reservations, denial, a pending late-credit-loss warning, conflicting views, unsupported responses, connection loss, and authentication interruption. The fixtures asserted one write at most per action, `late=0`, source-ID privacy, and no unverified credit refund. Node 24.14.0 `pnpm typecheck` and the targeted test file passed. These are simulated response branches; the authenticated cancellation request/response and credit effect remain unverified live. No real cancellation was attempted.

## Late credit-loss confirmation (2026-09-25, issue #26)

The public MCP fixture suite checks that a `cancelState=2` warning remains pending while the same reservation is booked, and that changed or uncertain follow-up state offers no late reference. It also covers refusal to confirm the credit consequence, a changed, missing, cancelled or ambiguous reservation before execution, expired/reused references, one `late=1` attempt after separate confirmation, source denial, and connection loss without duplicate writes. These are simulated branches of the official frontend-observed flow. No real late cancellation, balance read, or credit-loss observation has been made.

On Node 24.14.0, `pnpm typecheck`, `pnpm build`, and the final `pnpm test` run passed **334 tests in 14 files**. The first full run exposed stale nine-tool expectations in the context and package harness, which were updated. A two-axis review identified three cancellation edge cases; tests and implementation were corrected before the final run. `pnpm test:package` packed and installed the local checkout outside the repository with production dependencies, initialized MCP, discovered eleven tools, checked account/gym selection and sanitized errors, and observed empty server stderr. The local archive had 25 files. Local Markdown links passed. This is not npm publication or live acceptance of either write contract.
