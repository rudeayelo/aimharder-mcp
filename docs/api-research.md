# AimHarder API research

Status: account authentication and gym discovery verified on 2026-09-21 for issue #2; other API families remain preliminary. See [validation results](validation.md). This document records research evidence, not the product scope; see [the MVP](mvp.md) for supported use cases and acceptance criteria.

## Verified account/gym contract (2026-09-21)

The current public login frontend at `https://login.aimharder.es/` referenced `new-web/assets/main-DfuLROJs.js`. Its login handler posts JSON with `username`, `password`, `iniframe`, and a random 50-character hexadecimal `fingerprint` to `/api/login`. The destination was checked before using account credentials. Reading this bundle establishes frontend behavior, not every possible account response.

Authorized read-only verification established:

- POST `https://login.aimharder.es/api/login` returned HTTP 200 with `data.userData.id` and `data.auth.authOK: true`. A refresh token was present but is not needed or retained by the implementation.
- The login sets an `amhrdrauth` cookie for `.aimharder.es`, path `/`, with HttpOnly. The observed cookie did not have the Secure attribute; the client nevertheless allows HTTPS requests only. Native fetch needs an explicit cookie jar.
- GET `https://aimharder.es/api/whoami` returned HTTP 200 with one row in `data`, whose `id` matched the login account. Names, photos, and permission hashes are discarded. The same identity was observed at the gym hostname during investigation.
- The account row's `roles` contained one `client` membership with `gym` (source name), `centre_url` (a full `<slug>.aimharder.es` hostname), and numeric `id` and `boid`. Those numeric values differ; their domain meaning is not yet established. The MCP gym ID is the verified hostname's subdomain label.
- An unauthenticated GET returned HTTP 200 with `data: []`. The client treats empty identity data as unavailable authentication and permits bounded recovery, not a successful empty gym list.
- No gym time-zone field was present in these observed responses. Inspection of the gym page did not establish an authoritative time zone. This remains explicitly unresolved; the server returns null plus a notice and exposes no date-dependent queries yet.

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
- `/api/nextBookings?box=…`: a sample with one upcoming booking and 30 historical records. One record combines `assist=1` and `lateCancel=1`; interpretation remains pending.
- Account `/api/activity`: a sample with 32 entries, exercises, and WOD blocks. The user reports pagination with `loadAfter` set to the previous `lastLoaded`; termination and coverage remain unverified.
- `/api/activityCalendar`: a sample grouped by date with four days of activity; parameter semantics and coverage remain pending.
- Gym `/api/activity` with `timeLineContent=7`: mixes workouts and announcements, including pinned announcements with future dates. Do not indiscriminately use the `when` field as the workout date.

The `.es` account/gym contract is now verified separately above. Time zone, other domains/account variants, states and units, pagination, and the relationship between sessions and published workouts remain unverified. Original responses attached to the conversation have not been copied into the repository; prepare anonymized samples when implementing tests.

## Reported 9NBC workout convention

The user reports that a daily workout published in the gym activity feed is shared by the day's class sessions of that type. For example, three WOD sessions at different times use the same daily WOD content; the feed workout is not assigned to one unique session.

This is a user-reported convention, not an integration result. Whether other gyms publish shared daily workouts or session-specific workouts remains unknown. Verify how the feed identifies the intended workout date and class type, and how to relate those to the account holder's bookings. Do not assume that publication time is the workout date or that matching calendar dates alone establish applicability.

## Activity interpretation for summaries

Recent-training summaries and monthly training counts require verifying whether multiple activity entries describe one training session, how duplicates and pagination overlap are identified, and whether the data establishes attendance. Do not equate activity entries, days with activity, bookings, and completed training sessions. Verify chronology and complete coverage before reporting the latest five sessions or an exact monthly total.

## Validation priorities

1. Recheck the login flow and destination domains before extending the verified `.es` contract. Apply the [credential and read-only access policy](adr/2026-09-21-credential-security-and-read-only-access.md), including stopping on invalid credentials, 2FA, or restrictions.
2. Extend account/gym validation to additional account variants when needed, and establish an authoritative gym time zone through authorized read-only requests.
3. Check classes, occupancy, upcoming bookings, booking history, activity, and published workout details against AimHarder. Distinguish available classes from personal bookings and verify the meaning of states and units.
4. Verify pagination termination, date coverage, partial results, and the relationship between sessions and workouts. Rate limits remain unknown.
5. Prepare anonymized fixtures for the automated tests required by the MVP. Record live validation separately from third-party observations and user-provided samples.

Research does not authorize booking creation, cancellations, bulk access to other members' data, or other write operations. The login POST is the authentication exception.
