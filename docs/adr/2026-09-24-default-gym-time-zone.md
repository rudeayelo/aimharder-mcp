# ADR: default gym time zone

Status: accepted on 2026-09-24. Supersedes the explicit-mapping requirement in the [class time-zone decision](2026-09-22-class-schedules-and-confirmed-time-zones.md).

## Context

AimHarder's observed account and schedule responses do not supply an authoritative IANA time zone. The first implementation required a user-confirmed mapping before any date query. For the first public package, the user chose a simpler setup: assume `Europe/Madrid` when no mapping exists. That choice is a product default, not evidence that all AimHarder gyms use that zone. The one gym used for live validation had its `Europe/Madrid` zone confirmed separately.

## Decision

Use `Europe/Madrid` for each accessible gym without an entry in `AIMHARDER_GYM_TIME_ZONES`. Expose `timeZone: "Europe/Madrid"` and `timeZoneStatus: "assumed"` in account and date-query gym objects. An explicit valid per-gym IANA mapping overrides the default and retains `timeZoneStatus: "user-confirmed"`. Invalid mapping JSON or zone values remain configuration errors. Do not infer a zone from the computer, gym name, browser locale, or AimHarder response. Do not silently present the default as confirmed.

Date queries and the bundled consuming-client examples may proceed with the assumed zone. They must preserve the reported zone and provenance; composition rejects a response whose gym, zone, or provenance differs from account discovery. Date inputs and outputs remain gym-local calendar dates and wall times, without inferred UTC instants. Other class-query and coverage behavior in the previous ADR remains in force.

## Consequences

Initial connection needs only account credentials for a one-gym account. Users can correct the assumption with a per-gym mapping. A wrong default can cause relative dates and activity date comparisons to refer to the wrong calendar day, especially near midnight or in another time zone, so public instructions tell users to check the gym zone before relying on date-based answers. Existing live checks with a configured, confirmed zone remain valid evidence for that configuration; they do not validate the assumed-zone path against another gym. Fixture tests cover the fallback and explicit override. Broader gym compatibility remains unverified.
