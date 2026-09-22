# ADR: class schedules and confirmed gym time zones

Status: accepted implementation decision for [issue #3](https://github.com/rudeayelo/aimharder-mcp/issues/3). Live acceptance completed on 2026-09-22 after the user confirmed Europe/Madrid, including DST, and the MCP interval and specific-session comparisons passed; see [validation](../validation.md).

## Context

Live read-only investigation verified the daily class response and the frontend's use of membership `boid` as the `box` parameter. Neither account discovery nor the schedule response supplies an authoritative IANA time zone. The browser's time zone is not evidence of the gym's zone.

## Decision

Extend the allowed upstream operations with GET `https://<verified-gym>.aimharder.es/api/bookings?box=<membership-boid>&day=YYYYMMDD`, one request per inclusive calendar date. Continue to verify membership on every tool query and after session recovery. Do not expose arbitrary URLs, family/account selectors, participant lists, or booking writes.

Expose `get_class_sessions` with explicit `startDate` and `endDate`, optional `gymId`, and exact `startTime`/`className` filters. Validate each complete daily response before filtering, preserve all matching alternatives, and identify a session by gym, date, and upstream session ID. Map `ocupation` and `limit` to the occupied-place count and displayed capacity, matching the source UI. Missing/null counts stay null; zero remains zero. Do not infer attendance, remaining bookable places, or booking eligibility from these values.

Require an explicit per-gym IANA time-zone mapping in `AIMHARDER_GYM_TIME_ZONES`. Supplying a mapping asserts that the operator confirmed that zone with the gym or its schedule settings. Expose its provenance as `timeZoneStatus: "user-confirmed"`; do not claim it was discovered from AimHarder. Unconfigured gyms retain null/unverified context and reject date queries. This replaces the unconditional unknown-zone result in the [account discovery ADR](2026-09-21-account-discovery-and-local-runtime.md), not its prohibition on guessing system time.

Represent dates and start times as gym-local calendar dates and wall times with the IANA zone. Count calendar days independently of the process zone, including DST, month, year, and leap-day boundaries. Do not manufacture UTC instants or resolve repeated/nonexistent DST wall times when the upstream provides no offset. Keep distinct matching sessions instead of guessing between them.

Class intervals are all-or-error: every daily response must validate before a schedule is returned. A malformed/restricted response, unknown envelope field (including possible pagination), duplicate session ID within one day, or failed day invalidates the interval. `coverage: "complete"` means all requested daily schedule responses succeeded, not that all future classes are published. No partial class schedule is returned. Personal activity's separately specified partial-page behavior is unchanged.

One reauthentication allowance applies to the entire MCP request, including discovery and all days. On expiration, rediscover membership and retry the whole interval once, discarding the earlier attempt. Other errors stop without recovery. Tests exercise the real MCP interface and client with HTTP fixtures; live verification remains separate.

## Consequences

Operators must confirm and configure a zone for every queried gym. This works without a hard-coded gym/location table or trusting the caller's travel zone; automatic time-zone discovery remains an upstream research gap. Named zones preserve DST rules, but the response deliberately makes no absolute-instant claim.

Strict envelope validation can reject new upstream fields until investigated. Large intervals require one daily request each; no new class-specific interval limit is introduced. Calls may time out at the consuming client; no successful result is returned for an incomplete interval. Occupancy may change while days are fetched, so the result is not an atomic availability snapshot. The `boid` mapping is live-verified for one account; broader account variants remain unverified.
