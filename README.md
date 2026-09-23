# aimharder-mcp

A local MCP server for querying AimHarder from clients that support Model Context Protocol. An independent project, neither affiliated with nor endorsed by AimHarder.

**Status: account discovery (#2), class schedule queries (#3), upcoming bookings (#4), published workouts (#5), consuming-client composition (#6), booking history (#7), and personal activity intervals (#8) implemented.** Authentication and gym selection have live MCP validation. Class intervals and specific-session occupancy have also passed live MCP comparisons against AimHarder after user confirmation of the gym time zone; see [validation](docs/validation.md). Date queries require a per-gym, user-confirmed IANA zone. Upcoming bookings have also passed live MCP comparison with the upcoming view and daily schedule. Personal activity intervals have passed live MCP comparison; recent-entry retrieval (#9) and period entry counts (#10) use the activity-entry unit confirmed by the user. Published future WOD and Metcon content passed a separate live MCP comparison on 2026-09-23; final QA and registry-release acceptance remain open.

## Install a local archive

Node.js **24 LTS** is required. The compiled package is prepared and tested locally; **no npm registry version has been published**. An archive recipient needs npm and Node, with no TypeScript, pnpm, checkout, or compilation:

```sh
mkdir aimharder-install
cd aimharder-install
npm init -y
npm install --ignore-scripts --omit=dev /absolute/path/to/aimharder-mcp-0.1.0.tgz
```

After injecting `AIMHARDER_USERNAME` and `AIMHARDER_PASSWORD` into the client process environment, configure its stdio server as follows. Ensure Node 24 is on that process's `PATH` (the executable uses `#!/usr/bin/env node`).

```json
{
  "mcpServers": {
    "aimharder": {
      "command": "/absolute/path/to/aimharder-install/node_modules/.bin/aimharder-mcp",
      "args": []
    }
  }
}
```

The environment variables below also apply to the installed executable. An environment file can instead be loaded by configuring the Node 24 executable as `command` with arguments `--env-file=/absolute/path/to/private.env` and `/absolute/path/to/aimharder-install/node_modules/aimharder-mcp/dist/index.js`. Never commit that file or credentials in client configuration.

## Develop from a checkout

Requirements: Node.js **24 LTS** and pnpm **12.5.1**. The supported Node major is recorded in `.node-version`; use your preferred Node version manager. Install pnpm with `npm install --global pnpm@12.5.1` if necessary.

```sh
git clone https://github.com/rudeayelo/aimharder-mcp.git
cd aimharder-mcp
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Run `pnpm build` after source updates. Dependencies are locked; the MSW browser-worker postinstall is disabled because this project uses Node tests only. There is no database or service deployment. Local archive packaging (#11) is implemented; registry publication and exact-version registry validation remain pending in [#12](https://github.com/rudeayelo/aimharder-mcp/issues/12).

## Configure and connect

Credentials are supplied through the server process environment. A secrets manager is optional. You can inject variables with your preferred manager, configure them in your MCP client, or use a local environment file:

```sh
cp .env.example .env
chmod 600 .env
```

Edit `.env` locally to set the values. Keep it private; Git ignores it. The application does not automatically load environment files: Node's `--env-file` option in the example below loads it explicitly.

| Variable | Meaning |
| --- | --- |
| `AIMHARDER_USERNAME` | Required account login username/email. |
| `AIMHARDER_PASSWORD` | Required account password; whitespace is preserved. |
| `AIMHARDER_GYM_TIME_ZONES` | JSON object mapping discovered gym IDs to IANA zones, for example `{"sample-gym":"Europe/Madrid"}`. Required for each gym used in date queries; optional for account discovery. Confirm the zone with the gym or its schedule settings before configuring it. Fixed numeric offsets are rejected. |
| `AIMHARDER_DEFAULT_GYM` | Optional for one gym; required for several. Use a discovered gym ID, such as `sample-gym`, without a URL or domain. Omit this variable entirely if not needed. |

Configure a local **stdio** server in any MCP-compatible client. This common configuration format uses illustrative absolute paths; replace them with your Node 24 executable and checkout paths:

```json
{
  "mcpServers": {
    "aimharder": {
      "command": "/absolute/path/to/node",
      "args": [
        "--env-file=/absolute/path/to/aimharder-mcp/.env",
        "/absolute/path/to/aimharder-mcp/dist/index.js"
      ]
    }
  }
}
```

If your client supplies the environment directly, omit `--env-file`. Use the Node executable directly so package-manager output cannot interfere with MCP stdout. `pnpm start` is also available for a shell with credentials already exported; the process waits for MCP messages on stdin. Authentication is lazy: initializing the connection and listing tools do not contact AimHarder.

For an installed-package Hermes setup, see [the Hermes connection guide](docs/hermes-setup.md).

### Tool: `get_account_context`

Call with `{}` to select the only gym or configured default. Call with `{"gymId":"another-verified-gym"}` to select another discovered gym for that query without restarting. Subsequent omitted selections still use the default. Multiple gyms always require a valid configured default, including when using an override. A missing or inaccessible default returns an error with the discovered `accessibleGymIds` so you can configure one and restart.

Example response using anonymized data:

```json
{
  "account": { "authenticated": true },
  "gyms": [
    { "id": "sample-gym", "name": "Gimnasio de prueba", "timeZone": null, "timeZoneStatus": "unverified" }
  ],
  "selectedGym": { "id": "sample-gym", "name": "Gimnasio de prueba", "timeZone": null, "timeZoneStatus": "unverified" },
  "notices": ["Some gym time zones have not been verified. Do not infer gym-local dates from the computer time zone."]
}
```

The same result is available as MCP structured content and JSON text. Gym names preserve the source language and must be treated as untrusted data. Account identity is verified internally; personal names, account IDs, photos, permission hashes, credentials, and session tokens are not returned.

Gym IDs are the subdomain labels from verified account memberships, not AimHarder's numeric identifiers. Class queries internally use the membership `boid` as the verified `box` parameter. Discovery is fetched on every query. Currently supported memberships have `role: "client"` and a `centre_url` hostname under `.aimharder.es`; other formats return a clear error rather than silently omitting gyms. No cross-domain `.com` authentication is attempted.

### Tool: `get_class_sessions`

Query an inclusive interval of explicit `YYYY-MM-DD` dates, interpreted in the selected gym's configured zone:

```json
{"startDate":"2026-09-21","endDate":"2026-09-27"}
```

For a specific Wednesday's 07:00 Metcon, use the same date at both endpoints and optional exact filters:

```json
{"startDate":"2026-09-23","endDate":"2026-09-23","startTime":"07:00","className":"Metcon"}
```

An optional `gymId` follows the same verified membership and default-selection rules as account discovery. Class names are matched exactly and retain their original language. Every matching session is returned when date/time/type are ambiguous. There is no automatic selection among alternatives.

The result includes `gym`, `startDate`, `endDate`, `coverage: "complete"`, `sessions`, and `notices`. Each session has:

- `sessionId`: a gym/date/source-ID composite; `sourceId`: the upstream session ID.
- `date`, `startTime` (`HH:mm`), original `timeLabel`, and explicit IANA `timeZone`.
- `classType` with source `id` and `name`.
- `occupancy` and `capacity`: source occupied places and displayed capacity; null when absent, zero when zero.

Occupancy does not establish attendance. Capacity does not establish booking eligibility. Times are gym-local wall times; no UTC instant or offset is invented for ambiguous/nonexistent DST times. The client resolves relative dates such as “tomorrow” in the returned gym zone. Account context returns the configured zone with `timeZoneStatus: "user-confirmed"`, or null/`"unverified"` when absent; confirmation is an operator assertion, not automatic upstream discovery.

The tool fetches one response per calendar day. All days must succeed and validate; any failure returns an MCP tool error with no schedule. A successful empty `sessions` array means no matching sessions in those daily responses. Unknown envelope fields, nonempty response messages, or duplicate daily IDs fail conservatively rather than conceal restrictions or possible pagination. Complete coverage does not promise all future classes are published or form an atomic occupancy snapshot. Large intervals can exceed a client's timeout; choose smaller explicit intervals when needed.

### Tool: `get_upcoming_bookings`

Call with `{}` or `{"gymId":"another-verified-gym"}`. The tool requires the selected gym's confirmed time zone and returns the account holder's current upcoming view. Default/explicit selection follows account discovery; no family/account selector is accepted.

The result contains `gym`, `bookings`, `bookingStatus`, `coverage`, and English `notices`. Each entry includes `sourceBookingId`, gym-local `date`, original `dateLabel`, `startTime`, `timeLabel`, `timeZone`, `classType`, `state`, and `sourceState`. `sessionId` and `classType.id` are null because the upcoming identifier is not a verified schedule-session identifier. Class names retain their source language, or null when absent. Treat source text as untrusted content.

States are `booked` (source 1), `waitlisted` (0), or `unknown` (other/missing values). A waitlist is not a confirmed reservation; a booking is not attendance. `bookingStatus` is `booked` if any confirmed reservation exists, otherwise `unknown` if any entry has an unknown state, otherwise `none`. Inspect individual entries when matching a particular class.

`coverage` has `status: "complete"`, `scope: "upstream-upcoming-view"`, and null `startDate`/`endDate`. This describes successful retrieval of the current upcoming view, **not a guaranteed date interval or unlimited future horizon**. An empty view or `bookingStatus: "none"` does not prove no relevant booking on an arbitrary date. Clients composing a date-specific answer must preserve that uncertainty.

The verified Spanish full-date format is supported; unsupported locales and malformed/duplicate records fail with `INVALID_BOOKING_RESPONSE`. Unknown envelope fields, including potential pagination or restrictions, also fail without a partial successful result. Errors leave booking status unconfirmed. This upcoming tool exposes no history, postal addresses, coach details, booking writes or cancellation tools are exposed. See [API evidence](docs/api-research.md) and [the coverage decision](docs/adr/2026-09-22-upcoming-bookings-and-view-coverage.md).

## Session and errors

The API client is separate from MCP. Only the verified login POST, account discovery GET, daily class schedule GET, upcoming-booking GET, gym homepage/publication-feed GET and workout-detail GET at a verified gym are enabled. Cookies stay in memory, redirects are rejected, each HTTP request times out after 15 seconds, and response bodies are limited to 1 MiB. Concurrent tool requests are serialized around the account session.

An empty identity result or query HTTP 401 permits one reauthentication and one retry of the query. For classes, this allowance covers discovery and the entire interval; recovery rechecks membership and restarts the interval once. Repeated expiration stops with `SESSION_EXPIRED`. HTTP 403/429 stops with `ACCESS_RESTRICTED`, without reauthentication. Malformed responses, transport failures, and identity mismatches are errors, never empty successful results. Login failures, including unsupported additional-authentication responses, stop further login attempts until the server restarts. Upstream messages are not echoed. Specific invalid-password, 2FA, and restriction payloads have not been verified live; see [API research](docs/api-research.md).

`INVALID_CONFIGURATION` and `INVALID_TIME_ZONE_CONFIGURATION` require correcting the environment. `GYM_TIME_ZONE_REQUIRED` requires confirming and configuring that gym's zone before any date query. `INVALID_CLASS_RESPONSE` means no interval result can safely be returned. `DEFAULT_GYM_REQUIRED` and `GYM_NOT_ACCESSIBLE` require selecting a verified gym. `UNSUPPORTED_MEMBERSHIP` or `INVALID_RESPONSE` indicate a contract this version cannot establish safely. Do not infer a gym time zone from location, browser settings, or the computer's time zone.

## Verification

Automated tests use the public MCP interface, real API client, and anonymized HTTP fixtures. They require no real account and reject unhandled network requests:

```sh
pnpm typecheck
pnpm test
pnpm build
```

For an explicitly authorized live read-only check with your own account:

```sh
AIMHARDER_LIVE_CHECK=1 node --env-file=.env scripts/live-check.mjs
```

With already injected credentials, `AIMHARDER_LIVE_CHECK=1 pnpm test:live` is equivalent. The harness launches the built server over stdio, checks authentication, default and explicit selection, and rejects an unverified gym. It prints only a sanitized summary. To additionally verify class queries, first confirm and configure the gym zone, then set explicit dates:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_START_DATE=2026-09-21 AIMHARDER_LIVE_END_DATE=2026-09-27 node --env-file=.env scripts/live-check.mjs
```

Choose an interval containing class sessions. This compares the MCP interval and a specific 07:00 Metcon (or another available session) against independent raw responses, kept only in memory. Counts can change between reads; a mismatch fails safely without printing private payloads. These checks perform real authentication/discovery and, when dates are supplied, schedule reads, never booking or profile writes. [Validation results and limitations](docs/validation.md) distinguish live observations from fixture coverage.

To verify actual upcoming reservations and their times, use the same confirmed zone configuration and enable:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_BOOKINGS=1 node --env-file=.env scripts/live-check.mjs
```

This mode requires at least one actual upcoming entry and compares MCP results with independent upcoming and daily schedule reads, including default/explicit gym selection. It does not create a reservation to satisfy validation. It prints only counts and outcomes; raw responses remain in memory.

### Tool: `get_published_workouts`

Input: `{ "date": "2026-09-23", "className": "WOD", "gymId": "optional-accessible-gym" }`. The date is explicit and gym-local; class names match exactly. The result returns `available`, `unavailable`, or `unsupported`, workout alternatives with original titles, notes, exercises and source prescription fields, and provenance identifying the intended date and class label. Multiple publications remain ambiguous. Workouts have no unique session ID.

Each workout also returns `variants` when AimHarder supplies difficulty options. Each variant has its source `label` and a complete `blocks` and `exercises` list, including unchanged blocks shared between levels. For example, `SCALED`, `INTERMEDIO`, and `RX` may change an exercise name, count, or load. The top-level `blocks` and `exercises` retain the unselected source prescription for compatibility; do not assume they mean RX. An empty `variants` array means no labeled variants were supplied. Labels are source content and can differ by gym or workout.

An exercise's `prescription.valueUnit` labels its `valor1` entries when the source format is known: `s` for time, `reps`, `cal`, or a source distance unit such as `m`. `prescription.loadUnit` labels `valor2`, `valor2h`, and `valor2m` when a load value and a recognized source unit code are present. Known load labels are `kg`, `lbs`, `pood`, `%BW`, `%RM`, `RIR`, and `RPE`. For example, `valor1: ["3", "3", "3"]`, `valueUnit: "reps"`, `valor2: "85/85"`, `loadUnit: "%RM"` preserves a relative load, while `valor2: "15/10"`, `loadUnit: "kg"` is a mass. Time stays in source seconds: `valor1: ["60"]`, `valueUnit: "s"` corresponds to the UI's `1'`. A distance-only carry can have `valueUnit: "m"` and no `loadUnit`; an exercise with no load value does not gain one from `tipoud` alone. Raw values and unit codes remain available; unknown codes receive no inferred label.

Coverage is the current feed page and always marked incomplete. `unavailable` is not proof of unpublished content; older pages and later publications may differ. Retrieval failures are errors. Source content is untrusted data; source prescription encodings are preserved and unverified units are not guessed. See [the applicability, difficulty-variant and unit decision](docs/adr/2026-09-22-published-workout-applicability.md).

For independent live comparison with feed, detail, and daily schedule reads:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_WORKOUT_DATE=2026-09-22 AIMHARDER_LIVE_WORKOUT_CLASS=WOD node --env-file=.env scripts/live-check.mjs
```

The harness compares matching publication IDs, original content and prescription values. If the current view has no matching future content, it reports that limitation instead of claiming full future acceptance.

## Combined workout and booking example

After configuration and `pnpm build`, run the included consuming-client example:

```sh
node --env-file=.env scripts/query-training.mjs tomorrow WOD
node --env-file=.env scripts/query-training.mjs 2026-09-23 Metcon
```

An optional gym argument selects another verified gym: `node --env-file=.env scripts/query-training.mjs tomorrow WOD another-gym`. Class names are exact and case-sensitive; quote names containing spaces. This example performs live authentication and read-only queries and prints the requested workout content and your booking details. Treat its output as private account data, not publishable diagnostic logs.

The example uses the official MCP SDK over stdio and reusable `queryTraining` from `src/consumer.ts`. It first calls `get_account_context`, resolves tomorrow in the selected gym's user-confirmed IANA zone, and calls the existing class, workout and upcoming-booking tools with the explicit date and gym. It validates gym/date/class applicability before combining the results. No new server tool is needed; any compatible conversational client can follow the same sequence.

The structured answer preserves independent `classes`, `workouts`, and `bookingView` outcomes. `bookingSummary.bookings` lists every confirmed matching booking and its time; waitlisted, unknown-state and missing-class candidates stay in `otherCandidates`. Positive bookings remain available if schedules or workouts fail. Missing or failed booking lookups retain valid workout content. Titles and provenance distinguish competing workouts; booking times remain separate, without a guessed session join or a selected latest publication.

`bookingSummary.status` is `booked` when at least one exact date/type reservation is confirmed, otherwise `unconfirmed`. Its `completeness` is always `unconfirmed`: the upcoming view has no verified date horizon, so neither empty results nor other-class bookings establish date-specific absence. Workout coverage remains the current feed page, including when an available publication is returned. Queries are sequential independent reads, not an atomic snapshot. Source text remains untrusted data.

For sanitized combined live verification:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_TRAINING=1 node --env-file=.env scripts/live-check.mjs
```

The harness queries tomorrow's WOD, today's WOD, and an existing reserved date/class, then compares content and booking data against independent read-only responses. This mode requires an existing confirmed reservation; it never creates one. Available and unavailable outcomes are recorded honestly; absence of future content leaves first-delivery future-content acceptance pending. See [validation](docs/validation.md).

## Remaining MVP

Implementation #6 was closed by user request on 2026-09-23; [QA #13](https://github.com/rudeayelo/aimharder-mcp/issues/13) owns the final functional acceptance audit. A later standalone live MCP comparison observed published future WOD and Metcon content; the complete combined experience remains for QA #13 to audit. QA #13 blocks npm publication #12; full MVP completion also requires the registry-release checks in #12.

The combined experience is implemented and live-tested with available current content, unavailable next-day content, and an actual reservation. Published future content later passed a separate live MCP comparison; that check did not repeat the combined booking experience. The recent-entry and period entry-count experiences below use distinct activity records, as confirmed by the user; physical training-session grouping is not required. Creating or canceling bookings, automation, per-exercise analysis, a UI, and a remote service remain outside the MVP.

Public npm distribution is part of MVP acceptance. Local compiled-package installation and live account discovery are verified; publish and verify the registry artifact after all functional acceptance criteria pass. The preferred package name is `aimharder-mcp`, subject to publishability. See [the distribution decision](docs/adr/2026-09-22-npm-distribution-for-mvp.md).

## Documentation

- [Domain glossary](CONTEXT.md).
- [Scope, acceptance criteria, and implementation tickets](docs/mvp.md).
- [MVP specification](https://github.com/rudeayelo/aimharder-mcp/issues/1).
- [API research and validation gaps](docs/api-research.md).
- [Validation results](docs/validation.md).
- [Class schedules and time-zone decision](docs/adr/2026-09-22-class-schedules-and-confirmed-time-zones.md).
- [Implementation stack and session decision](docs/adr/2026-09-21-account-discovery-and-local-runtime.md).
- [MVP decision](docs/adr/2026-09-21-local-typescript-mcp-mvp.md).
- [API client separation](docs/adr/2026-09-21-api-client-separated-from-interfaces.md).
- [Credentials and read-only operations](docs/adr/2026-09-21-credential-security-and-read-only-access.md).
- [Public repository and license](docs/adr/2026-09-21-public-repository-and-mit-license.md).
- [Agent instructions](https://github.com/rudeayelo/aimharder-mcp/blob/main/AGENTS.md).

All project content is maintained in English.

## License

[MIT](LICENSE).

### Tool: `get_booking_history`

Input: `{ "gymId": "optional-verified-gym" }`. Returns the selected gym and available historical bookings, newest first, with gym-local date/time, original class name, source identifiers and flags. The verified history renderer labels late cancellations before booked/waitlisted states. `attendance` is always `unverified`, including simultaneous `assist=1` and `lateCancel=1`.

Coverage is always `limited` to `upstream-history-view`, with null interval endpoints: the observed view contained 30 records and has no verified pagination or historical horizon. A successful empty view does not establish empty lifetime history. `retrieval` is `complete` for the returned view or `partial` when valid records were recovered alongside malformed/conflicting records. Identical projected duplicates collapse; conflicting identities are omitted. Invalid envelopes, access failure, or wholly uninterpretable records return errors. See [the history decision](docs/adr/2026-09-22-booking-history-state-and-coverage.md).

For an explicit independent live stdio comparison, run the existing harness with `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_HISTORY=1`, credentials and confirmed gym zone supplied through the environment.

### Tool: `get_personal_activity`

Input: `{ "startDate": "2026-03-01", "endDate": "2026-03-31", "gymId": "optional-verified-gym" }`. Accepts 1–31 consecutive calendar dates inclusively and requires the selected gym's confirmed IANA zone. Use multiple explicit queries for longer periods.

Returns `entries` sorted by record date newest first, with `sourceActivityId`, original available notes/exercises/prescriptions and the gym zone. Equal-date records have no verified within-day order. `startTime` and `trainingSessionId` are null: activity entries are not automatically distinct training sessions or attendance. Workout titles remain empty where no verified source title exists.

Exercise prescriptions use the same verified `valueUnit` and `loadUnit` labels as published workouts when the source format and unit code are known. These describe the prescription, not a personally achieved load or performance result.

Each block also includes `result`, with available source fields `res`, `reps`, `time`, `rondas`, `rx`, and `rxstr`. `time` is measured in **seconds**, as confirmed by the user; other numeric score meanings remain source encodings. For example, `{ "time": 600, "rx": false, "rxstr": "SCALED" }` records 600 seconds and preserves the source scaling label. Missing fields stay absent, explicit nulls stay null, and zero values are preserved. An empty object means no exposed result fields, including for deleted blocks; it does not mean a score of zero. `rx=false` alone does not establish a scaled result: use the available source label without inventing one. Recent-entry and period consumers retain these results. The optional `result.desc` preserves the description from `chartData[block.id]` only when `idAction` matches the current activity. The user confirmed that `7R` means seven completed complex rounds in the supplied class; this is not a universal gym format and is not converted into a numeric rounds field. Rankings, chart history, profile information and other members' results are excluded. Published gym workouts retain their existing prescription-only output.

Coverage is `complete` or `incomplete` with `completedDates` and a nullable sanitized `reason`. Only dates with a successfully retrieved calendar partition and all referenced details are complete; a recovered entry alone does not establish date coverage. A failed first partition is an error. Later partition/detail failures preserve recovered entries. Calendar reads cover at most three month partitions; 500 detail reads bound a query, after which results are explicitly incomplete. Empty successful periods have zero entries and complete requested-date coverage. Dates come from the activity calendar and verified detail record dates, never publication chronology. See [the decision](docs/adr/2026-09-22-personal-activity-calendar-coverage.md).

Live read-only comparison with independent raw calendar/detail responses:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_ACTIVITY_START=2026-03-01 AIMHARDER_LIVE_ACTIVITY_END=2026-03-31 pnpm test:live
```

Inject credentials and confirmed zones as described above, and build first. The harness prints sanitized pass/coverage results, without activity content or identifiers. Use an interval containing actual activity to validate available details.

### Recent activity consuming-client example

After building, run `node scripts/query-recent-activity.mjs 2026-09-22 3` with the same credentials and confirmed zones. The arguments are an explicit gym-local end date, an optional maximum number of windows (default 3, maximum 12), and an optional verified gym ID. The end date bounds the search; it is not assumed to mean today. Output contains private account activity, so do not copy it into logs or issues.

`queryRecentActivity` composes `get_account_context` and `get_personal_activity` through MCP. It searches backward in disjoint explicit windows of at most 31 inclusive dates until it finds five **activity entries** or reaches its bound. Programmatic `count` means requested entries (1–31); multiple entries on one date count separately. Output has `basis: "activity-entries"`, `requestedCount`, and a flat `entries` list with at most that many entries and original details. Source IDs deduplicate references without collapsing similar content.

Entries are ordered by record date descending, with source ID ascending only as deterministic same-date presentation. `ordering.withinDate` is `unverified`. If the cutoff splits a date tie, `ordering.boundaryTie` reports its date and selected/omitted counts, and `latestEntriesVerified` is false; otherwise that flag requires a complete search with enough entries. It verifies the selected entry set, not within-day training chronology. Failed/incomplete windows preserve recovered entries and prevent a verified latest claim. Windows, completed dates, notices and `searchedStartDate` expose the retrieval boundary; empty or sparse bounded results do not prove exhausted lifetime history.

The user clarified that “last five training sessions” means the last five activity entries for this feature. There is no physical-session grouping requirement or blocked `trainingSessions` output. See [the entry semantics decision](docs/adr/2026-09-22-activity-entry-query-semantics.md) and [validation](docs/validation.md).

Separate sanitized live verification: build, inject credentials/zones, then run `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_RECENT_END=2026-09-22 pnpm test:live`. This compares entry selection, coverage, tie metadata and available content against independently retrieved calendar/detail responses.

### Activity frequency consuming-client example

After building, run `node scripts/query-activity-period.mjs previous-month` to resolve the previous calendar month in the selected gym's confirmed time zone. An optional next argument selects a verified gym. For another inclusive period, run `node scripts/query-activity-period.mjs 2026-08-01 2026-09-22`, optionally followed by a gym ID. Use the same credential/zone configuration as above. Example output includes private activity details; do not copy it into logs or issues.

`queryActivityPeriod` composes account context and explicit `get_personal_activity` queries, each spanning at most 31 dates. Longer periods use consecutive nonoverlapping windows. Programmatic `maxWindows` defaults to 12 (allowed 1–12); this bounds client work, not upstream retention. Failure, incomplete retrieval or reaching that limit preserves recovered entries and marks the entire requested period incomplete. The output retains the requested interval, individual windows/notices, `completedDates` and original entry content. Identity deduplication preserves distinct source records even when their content matches; conflicting repeated identities invalidate the affected window.

`basis` is `activity-entries`: the user clarified that “how many times did I train last month?” means the number of recorded activity entries. `counts.activityEntries` is the primary answer; `counts.daysWithActivity` is supplementary. Both separately expose `observed` and `exact`. Exact counts require complete calendar coverage; otherwise `exact` is null and `counts.interpretation` is `recovered-lower-bound`. A complete empty period has zero available entries/days. Distinct entries on the same date count separately. These counts do not establish class attendance, and no physical-session grouping or blocked `trainingSessions` result is required. See [the scope decision](docs/adr/2026-09-22-activity-entry-query-semantics.md).

Separate sanitized live checks: after building and injecting credentials/zones, run `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_PREVIOUS_MONTH=1 pnpm test:live`, or use `AIMHARDER_LIVE_PERIOD_START=2026-09-01 AIMHARDER_LIVE_PERIOD_END=2026-09-22` in place of the previous-month variable. The harness compares available entry identities, dates, notes, day counts and complete coverage against independently fetched AimHarder calendar/details. See [validation](docs/validation.md).

## Package verification and future release

Maintainers run these commands **from a checkout with development dependencies installed**; verification scripts and test fixtures are deliberately absent from the consumer archive:

```sh
pnpm typecheck
pnpm test:package
npm pack
```

`npm pack` builds via `prepack`. The package allowlist contains compiled JavaScript, README, MIT license, glossary, and public Markdown documentation. It excludes source/tests, harness scripts, evidence, secrets, local configuration, dependencies, source maps, and generated archives. The isolated check creates an archive, validates every path, installs it in a temporary directory outside the checkout with lifecycle scripts disabled and development dependencies omitted, then launches the installed executable using the official MCP SDK over stdio. Both the harness and server resolve dependencies from that isolated install. All child-process HTTP is replaced with anonymized fixtures; unexpected requests fail closed. It checks initialization, six tools, account discovery, gym selection, sanitized access errors, and empty startup stdout on missing credentials. `pnpm test` includes this check. npm dependency downloads require registry access or a populated cache; no real AimHarder credentials or access are used in the automated check. Temporary installations are removed afterward.

For a **separate live read-only installed-package check**, inject account credentials and optional gym configuration, then run:

```sh
AIMHARDER_LIVE_CHECK=1 pnpm test:package:live
```

This independently builds and installs an archive, authenticates, and queries account/gym context with the installed binary. It reports only sanitized verification results and archive integrity; no other live query families are exercised. See [recorded evidence and limitations](docs/validation.md).

Registry publication belongs to #12 and requires complete functional MVP acceptance, name/account verification and user-authorized release. The preferred name is not reserved. After publication, document and verify the actual exact version with a pinned client command such as `npx --yes aimharder-mcp@<published-version>` (replace the placeholder; it is not an available release). Local archive verification does not establish registry availability.
