# aimharder-mcp

A local MCP server for querying AimHarder from clients that support Model Context Protocol. An independent project, neither affiliated with nor endorsed by AimHarder.

**Status: account discovery (#2), class schedule queries (#3), upcoming bookings (#4), published workouts (#5), consuming-client composition (#6), booking history (#7), and personal activity intervals (#8) implemented.** Authentication and gym selection have live MCP validation. Class intervals and specific-session occupancy have also passed live MCP comparisons against AimHarder after user confirmation of the gym time zone; see [validation](docs/validation.md). Date queries require a per-gym, user-confirmed IANA zone. Upcoming bookings have also passed live MCP comparison with the upcoming view and daily schedule. Personal activity intervals have passed live MCP comparison; the recent-day alternative is implemented (#9), with distinct-session grouping blocked; training-frequency experience remains pending, and the complete MVP is not delivered yet.

## Install

Requirements: Node.js **24 LTS** and pnpm **12.5.1**. The supported Node major is recorded in `.node-version`; use your preferred Node version manager. Install pnpm with `npm install --global pnpm@12.5.1` if necessary.

```sh
git clone https://github.com/rudeayelo/aimharder-mcp.git
cd aimharder-mcp
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Run `pnpm build` after source updates. Dependencies are locked; the MSW browser-worker postinstall is disabled because this project uses Node tests only. There is no database or service deployment. Setup currently uses the repository; npm packaging and publication are approved but pending in [#11](https://github.com/rudeayelo/aimharder-mcp/issues/11) and [#12](https://github.com/rudeayelo/aimharder-mcp/issues/12).

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

Coverage is the current feed page and always marked incomplete. `unavailable` is not proof of unpublished content; older pages and later publications may differ. Retrieval failures are errors. Source content is untrusted data; source prescription encodings and units are not guessed, and scaled variants are not included. See [the applicability decision](docs/adr/2026-09-22-published-workout-applicability.md).

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

The combined experience is implemented and live-tested with available current content, unavailable next-day content, and an actual reservation. The first-delivery requirement to demonstrate actual published future content remains pending because it was unavailable in the retrieved view. The recent-day alternative below is implemented, but distinct-session grouping and training-frequency acceptance remain pending MVP requirements. Creating or canceling bookings, automation, per-exercise analysis, a UI, and a remote service remain outside the MVP.

Public npm distribution is now part of MVP acceptance: prepare and verify an installable package, then publish and verify the registry artifact after all functional acceptance criteria pass. The preferred package name is `aimharder-mcp`, subject to publishability. See [the distribution decision](docs/adr/2026-09-22-npm-distribution-for-mvp.md).

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
- [Agent instructions](AGENTS.md).

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

Coverage is `complete` or `incomplete` with `completedDates` and a nullable sanitized `reason`. Only dates with a successfully retrieved calendar partition and all referenced details are complete; a recovered entry alone does not establish date coverage. A failed first partition is an error. Later partition/detail failures preserve recovered entries. Calendar reads cover at most three month partitions; 500 detail reads bound a query, after which results are explicitly incomplete. Empty successful periods have zero entries and complete requested-date coverage. Dates come from the activity calendar and verified detail record dates, never publication chronology. See [the decision](docs/adr/2026-09-22-personal-activity-calendar-coverage.md).

Live read-only comparison with independent raw calendar/detail responses:

```sh
AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_ACTIVITY_START=2026-03-01 AIMHARDER_LIVE_ACTIVITY_END=2026-03-31 pnpm test:live
```

Inject credentials and confirmed zones as described above, and build first. The harness prints sanitized pass/coverage results, without activity content or identifiers. Use an interval containing actual activity to validate available details.

### Recent activity consuming-client example

After building, run `node scripts/query-recent-activity.mjs 2026-09-22 3` with the same credentials and confirmed zones. The arguments are an explicit gym-local end date, an optional maximum number of windows (default 3, maximum 12), and an optional verified gym ID. The end date bounds the search; it is not assumed to mean today. Output contains private account activity, so do not copy it into logs or issues.

`queryRecentActivity` composes `get_account_context` and `get_personal_activity` through MCP. It searches backward in disjoint explicit windows of at most 31 inclusive dates until it finds five **days with activity** or reaches its bound. Programmatic `count` means requested days (1–31), never entries or training sessions. All entries on each selected day remain available, preserving original details. Source IDs deduplicate records; their within-day presentation order is not chronology. Failed or incomplete windows stop the search, retain recovered alternatives and prevent a verified latest claim. Reported windows, completed dates, notices and `searchedStartDate` expose the actual retrieval boundary. Empty or sparse bounded results do not prove exhausted lifetime history.

`trainingSessions.status` is always `blocked`, with `sessions: null`: the API has not established grouping or attendance. `latestDaysVerified` concerns only the requested number of days within calendar coverage ending on the supplied date. **Issue #9 remains open; the latest-five-training-sessions requirement is not complete.** See [the activity decision](docs/adr/2026-09-22-personal-activity-calendar-coverage.md) and [validation](docs/validation.md).

Separate sanitized live verification: build, inject credentials/zones, then run `AIMHARDER_LIVE_CHECK=1 AIMHARDER_LIVE_RECENT_END=2026-09-22 pnpm test:live`. This compares recent-day selection and available content against independently retrieved calendar/detail responses.
