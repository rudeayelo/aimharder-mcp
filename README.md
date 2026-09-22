# aimharder-mcp

A local MCP server for querying AimHarder from clients that support Model Context Protocol. An independent project, neither affiliated with nor endorsed by AimHarder.

**Status: account discovery (#2) and class schedule queries (#3) implemented.** Authentication and gym selection have live MCP validation. Daily classes and occupancy have been inspected against AimHarder; final class acceptance and its time-zone confirmation are recorded in [validation](docs/validation.md). Date queries require a per-gym, user-confirmed IANA zone. Workouts, bookings, and personal activity remain pending; the complete MVP is not delivered yet.

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

Run `pnpm build` after source updates. Dependencies are locked; the MSW browser-worker postinstall is disabled because this project uses Node tests only. There is no database, service deployment, or package publication step.

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

## Session and errors

The API client is separate from MCP. Only the verified login POST, account discovery GET, and daily class schedule GET at a verified gym are enabled. Cookies stay in memory, redirects are rejected, each HTTP request times out after 15 seconds, and response bodies are limited to 1 MiB. Concurrent tool requests are serialized around the account session.

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

## Remaining MVP

Published future workouts, upcoming bookings and history, and personal activity queries remain planned. The first combined experience will answer "What are we doing in tomorrow's WOD, and when am I booked?". Creating or canceling bookings, automation, per-exercise analysis, a UI, and a remote service remain outside the MVP.

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
