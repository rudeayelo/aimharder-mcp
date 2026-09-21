# AimHarder API research

Status: preliminary observations recorded on 2026-09-21. No authenticated integration test performed by this project has been verified. This document records research evidence, not the product scope; see [the MVP](mvp.md) for supported use cases and acceptance criteria.

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

FitBot uses .com while the gym website uses .es. Domain equivalence, cookies, redirects, and authentication across domains remain unverified.

## User-provided samples

The user provided API responses during definition. They are evidence of those samples, not integration tests performed by this project:

- `/api/bookings?day=YYYYMMDD&box=…`: a sample with 19 sessions, schedules, occupancy, and capacity limits.
- `/api/nextBookings?box=…`: a sample with one upcoming booking and 30 historical records. One record combines `assist=1` and `lateCancel=1`; interpretation remains pending.
- Account `/api/activity`: a sample with 32 entries, exercises, and WOD blocks. The user reports pagination with `loadAfter` set to the previous `lastLoaded`; termination and coverage remain unverified.
- `/api/activityCalendar`: a sample grouped by date with four days of activity; parameter semantics and coverage remain pending.
- Gym `/api/activity` with `timeLineContent=7`: mixes workouts and announcements, including pinned announcements with future dates. Do not indiscriminately use the `when` field as the workout date.

Authentication, domains, identity, gym and time zone, states and units, pagination, and the relationship between sessions and published workouts remain unverified. Original responses attached to the conversation have not been copied into the repository; prepare anonymized samples when implementing tests.

## Validation priorities

1. Verify the current login flow and destination domains before sending credentials. Apply the [credential and read-only access policy](adr/2026-09-21-credential-security-and-read-only-access.md), including stopping on invalid credentials, 2FA, or restrictions.
2. Confirm account identity, available gyms, gym selection, and time zone through authorized read-only requests.
3. Check classes, occupancy, upcoming bookings, booking history, activity, and published workout details against AimHarder. Distinguish available classes from personal bookings and verify the meaning of states and units.
4. Verify pagination termination, date coverage, partial results, and the relationship between sessions and workouts. Rate limits remain unknown.
5. Prepare anonymized fixtures for the automated tests required by the MVP. Record live validation separately from third-party observations and user-provided samples.

Research does not authorize booking creation, cancellations, bulk access to other members' data, or other write operations. The login POST is the authentication exception.
