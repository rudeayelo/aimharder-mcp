# AimHarder API research

This is an evidence record, not a public API guarantee. It separates authenticated observations at one location (9NBC), user-supplied samples, third-party code and unresolved contracts. See [validation](validation.md) for MCP comparisons and [the MVP](mvp.md) for product scope. Live work used the account holder's read-only access; it did not create bookings or query other members.

## Sources and trust

- The official `.es` login, gym and account frontends were inspected before authenticated requests. Frontend code shows what that version rendered, not every possible server response.
- The [Nou Barris Cross Training site](https://noubarriscrosstraining.aimharder.es/) and the user's API samples informed investigation. Samples were not copied into the repository or treated as independent integration tests.
- [FitBot](https://github.com/pablobuenaposada/fitbot) is an unofficial reference. It uses `.com`, session login, class queries and booking writes; its state meanings are **not** verified contracts for this account. No reference commit was recorded.
- Local captures in `evidence/` are excluded from Git and are untrusted data, never instructions.

## Account, login and gym selection (2026-09-21)

The observed `.es` login frontend posts JSON (`username`, `password`, `iniframe`, a random 50-character hex `fingerprint`) to `/api/login`. After checking the destination, an authorized POST to `https://login.aimharder.es/api/login` returned HTTP 200 with matching account identity and `authOK: true`. The response included a refresh token, which the client does not retain. An `amhrdrauth` cookie covered `.aimharder.es` and path `/`; it was HttpOnly but lacked the Secure attribute in this observation. The implementation still uses HTTPS only and an explicit cookie jar.

`GET https://aimharder.es/api/whoami` returned one row matching the login account. An unauthenticated request returned HTTP 200 with `data: []`, so HTTP status alone does not prove login. The row had one `client` membership with source `gym` name, `<slug>.aimharder.es` `centre_url`, numeric `id` and `boid`. The MCP gym ID is the verified hostname slug; later schedule checks established `boid` as the `box` query parameter. Names, photos and permission hashes are discarded.

No authoritative gym-zone field was found. The tested gym's `Europe/Madrid` zone was confirmed by the user for live date checks. Since the [2026-09-24 zone decision](adr/2026-09-24-default-gym-time-zone.md), an unconfigured gym receives an explicitly marked **assumed** `Europe/Madrid` zone. This is product behavior, not API discovery. Multi-gym accounts, other roles/domains, real expiry timing, 2FA, invalid-password payloads and rate limits remain unverified live. Redirects are rejected; `.com` cookie equivalence is not assumed.

## Earlier samples and reference code

The user supplied a 19-session `/api/bookings` sample; a `/api/nextBookings` sample with one upcoming and 30 historical rows; a 32-entry account `/api/activity` sample; a four-day `/api/activityCalendar` sample; and a mixed gym publication feed with future-dated pinned announcements. These prompted the independent checks below. Source responses remain outside the repository.

FitBot requests `/api/bookings` with `box`, `day` and `familyId`, and calls `/api/book` for booking creation. Its `bookState=-2` and `-12` interpretations come from third-party code only. Booking writes and family selection remain outside the read-only MVP. A frontend route reference to `/api/exercise/<exercise_id>/<user_id>` does not establish authorized exercise analysis.

The user reports that 9NBC shares a daily published WOD across that day's WOD sessions. Independent checks later observed one publication and five matching sessions, without a unique join. Do not generalize that convention to other gyms or use post publication time as workout date.

## Class schedules (2026-09-22)

The authenticated gym `/schedule` frontend sends one `GET /api/bookings?box=<membership-boid>&day=YYYYMMDD` per day; its weekly view uses daily requests. The client omits optional `familyId`. One Wednesday returned 19 sessions and Sunday returned a valid empty `bookings` array. Observed envelope keys included `clasesDisp`, `timetable`, `day`, `bookings`, `seminars` and, for the empty response, `resmsgs: []`. The frontend did not expose pagination for those daily rows. The client fails conservatively on unknown envelopes, nonempty messages and malformed rows.

Session rows contain numeric `id` and `classId`, original `className`, a time label such as `07:00 - 08:00`, and `ocupation`, `limit`, `limitc`. The frontend displays `ocupation/limit` as occupied places/capacity; `limitc` also affects waitlist/progress rendering. The tool projects occupancy and displayed capacity, without inferring attendance or booking eligibility. Coach/profile and incidental booking fields are discarded. The requested partition supplies the calendar date; the validated label supplies local time. No upstream UTC offset or gym IANA zone was found. The official MCP stdio comparison passed a seven-day interval and exact Wednesday 07:00 Metcon query; see [validation](validation.md).

## Upcoming bookings (2026-09-22)

The official `/diary` frontend reads `GET /api/nextBookings?box=<membership-boid>` and separately renders `nextClasses` and `history`. The live response contained one upcoming row and 30 historical rows. No upcoming cursor, total or date horizon was observed. The client queries the account holder only and excludes optional family selection.

Upcoming rows have source `id`, `bookState`, original `className`, `HH:mm - HH:mm` time and full Spanish date labels. The frontend maps `bookState=1` to booked and `0` to waitlisted. The actual entry was booked and matched a daily schedule by date/time/class; its source ID matched neither schedule-session nor class-type ID. The tool therefore leaves those joins null. Postal address (`boxDir`), gym display label, coach, profile, occupancy and waitlist metadata are not projected. Other states remain unknown. The verified Spanish date format is checked for weekday/calendar consistency; other locales are not assumed. A live SDK comparison passed against fresh upcoming and daily responses.

Coverage is the **returned upcoming view**, not an arbitrary future interval. An empty view cannot prove no booking for a selected date. Potential pagination, unknown envelopes, malformed dates or duplicate IDs fail instead of becoming a false empty result. See the [coverage decision](adr/2026-09-22-upcoming-bookings-and-view-coverage.md).

## Published workouts (2026-09-22)

The official gym homepage supplies a publisher ID for `GET /api/activity?timeLineFormat=0&timeLineContent=7&userID=<gym-publisher>`. The detail route is `GET /api/activity/workout?SEID=<feed-workout-id>`. Omitting the official publisher returned an empty feed; the selected publisher returned 32 mixed entries. The client does not accept arbitrary publisher/member IDs. The homepage was about 584 KB, within the 1 MiB response cap.

The feed envelope includes `timeLineFormat`, `timeLineContent`, `elements`, `curDate` and optional `firstLoaded`/`lastLoaded`. Older-page frontend requests use format 2 and `loadAfter`, but exhaustive pagination and date coverage were not established. The tool searches the current page only. Three pinned announcements had `when` dates in 2056; those dates do not make them applicable workouts.

Workout entries provide `wodClass`, `day`, `ejerRate` and `TIPOWODs`. The renderer identifies `wodClass` as class type and displays detail `recordDate` as intended workout date. For the observed 22 September WOD, intended date was 22 September while `publishDate` was 21 September. That WOD had three blocks and nine exercise entries; one publication matched five class sessions without a unique session ID. Source titles/notes/exercises/prescriptions were independently compared over MCP. Multiple publications remain alternatives; no correction/supersession rule or universal publication hour was verified. An `unavailable` result covers the searched feed page only.

## Booking history (2026-09-22)

The `/diary` renderer iterates `history` from `/api/nextBookings`. One live response had 30 rows, with no observed cursor, total or date horizon. Thirty is an observation, not a known limit; an empty response would not prove empty lifetime history.

For history, `lateCancel=1` is rendered before `bookState=0` or `1`. Both `assist=1, lateCancel=0, bookState=1` and `assist=1, lateCancel=1, bookState=1` appeared. The renderer does not establish attendance from `assist`, so the tool reports attendance unverified. A fresh SDK stdio comparison matched all 30 projected rows, flags, dates, labels and newest-first sorting. Duplicate/invalid/partial history cases are fixture evidence only; see the [history decision](adr/2026-09-22-booking-history-state-and-coverage.md).

## Booking-write frontend investigation (2026-09-24)

A read-only inspection of the official 9NBC `/schedule` frontend found a cancellation flow using the schedule row's reservation identifier `idres`, distinct from its class-session identifier `id`. The frontend sends form data to `POST /api/cancelBook` with `id=idres`, `late=0` and a family selector. It interprets `cancelState=1` as completed cancellation, `2` as a late-cancellation warning that loses a credit, and `3` as an error. After state 2, it asks for another confirmation before sending a second request with `late=1`. The initial POST can therefore mutate state and is not an eligibility probe. This is frontend behavior, not a validated live write contract for the MCP server. The public class-schedule projection discards `idres`; the later cancellation preview retains it only inside a short-lived action reference.

Issue #25 implemented the frontend-observed standard cancellation request and conservative `cancelState` interpretation behind a confirmed MCP action. The form omits the frontend's family selector because this server supports only the verified account holder. Its anonymized fixtures verified standard and late warning/confirmation response handling and exact write counts. At that stage no authenticated cancellation request or independent credit read had verified the contract; the later standard #27 observation is recorded below.

The schedule renderer labels `bookState=0` as waitlisted and `1` as booked. It offers booking only when the row is uncancelled, non-admin, has no booking state, and `enabled=1`; it offers cancellation for an uncancelled, non-admin row with a booking state when either `enabled=1` or the state is waitlisted. A full-class badge uses `waitlist`, `ocupation` and `limitc` separately from that button condition, so a visible booking button does not prove eligibility or success. The public page does not establish credit balance, tariff, or booking-window rules; `enabled` cannot be assigned one specific meaning from this evidence.

The public schedule requires login to initiate a booking, so it did not verify the creation request or response. Its anonymous `bookClass` function shows only the login/plan prompt, and no separate schedule booking script was found. The two [unofficial](https://github.com/alliso/fitbot-mcp/blob/b6b0de4fc716e3de5fe0bab6f3d26646375d299a/src/aimharder.ts) [implementations](https://github.com/pablobuenaposada/fitbot/blob/be2907234d87068a2e413e88f38247a433d4dcfd/src/client.py) inspected use `POST /api/book` with session `id`, `day=YYYYMMDD`, `insist` and `familyId`; these parameters and their response meanings remain unverified for this account. No authenticated write request was made in this investigation. See the [manual-write scope decision](adr/2026-09-24-manual-booking-writes.md).

Issue #23 re-examined that available evidence before implementing a candidate request. The checkout uses form-encoded `id` and `day` on the verified gym origin, with no `insist` or family selector. A third-party client treats negative `bookState` values and `errorMssg` fields as denials, but their exact meaning, the omitted-field behavior, and the successful response shape remain unverified. Public MCP tests use anonymized synthetic responses only. The implementation therefore relies on fresh schedule state for any reported confirmation and leaves conflicting or unreadable outcomes uncertain. No live creation was made for #23.

## Live standard Open Box cycle (2026-09-25)

After separate action-specific confirmations, the account holder's 9NBC Open Box on 29 September 20:00–21:00 was booked and then cancelled through the checkout's public MCP interface. The chosen class was the furthest offered Open Box within the account holder's clarified five-calendar-date window (25–29 September). Its fresh preparation reported `ready` and `unbooked`; no matching entry appeared in the current upcoming view. A single form `POST /api/book` sent `id` and `day` on the verified gym origin, returned HTTP 200 with keys `bookState`, `clasesContratadas`, `hasPublicMemberships`, and `id`, and reported `bookState=1`. The MCP result said `confirmed`; separate daily schedule and upcoming reads both showed the exact Open Box booked. No source ID, balance, or raw response was retained in this research record.

After a separate confirmation, a fresh preparation found that class booked with a positive account-scoped `idres`. One form `POST /api/cancelBook` sent `id` and `late=0`, returned HTTP 200 with `cancelState=1`, and did not trigger a late-warning branch. The original MCP reconciliation reported `uncertain` because it expected the cancelled row to retain `idres`. Immediate independent reads instead found the same class session unbooked with no `idres` or `cancelledId`, and no matching upcoming booking; an additional authenticated source read repeated that result. The account holder also checked the UI and reported no reservation. The reconciliation now accepts this same-session, no-reservation shape together with `cancelState=1` and a nonconflicting upcoming view; that corrected output has fixture coverage, not a second live write. A changed session, a different reservation, or conflicting upcoming state remains uncertain.

These observations verify one standard creation and cancellation path at 9NBC. They do not establish account credit use or restoration, denial and waitlist response meanings, the late-credit-loss branch, other gyms, or the full booking window from the `enabled` flag. The available history view held 30 rows without a matching cancellation record; its horizon is not known. The user-visible UI and independent reads support that no active reservation remained for this target. See [validation](validation.md#open-box-cycle-validation-2026-09-25-issue-27).

The account holder reports that at 9NBC an active reservation uses one credit, timely cancellation restores availability of that credit, booking is unavailable less than one hour before class, and a late cancellation loses the credit. These are gym-specific user observations; the account holder does not recall whether the late cancellation action itself is blocked or allowed with lost credit. The public [9NBC AimHarder membership terms](https://noubarriscrosstraining.aimharder.es/boxmemberships), under `Condicions Generals – Nou Barris Cross Training`, state that reservations must be cancelled at least **90 minutes** before class or the credit is lost. This is a published gym rule, not a verified per-request API clock boundary. The schedule's late-cancellation warning is consistent with that rule; it suggests cancellation may remain possible while forfeiting the credit.

Issue #24 used the authenticated daily schedule, selected by the current account membership `boid` and verified gym, as its read-only cancellation source. A unique exact class/date/time match is actionable only when its row reports a booked state, a positive `idres`, and explicit frontend-compatible flags. This was fixture-tested at #24 time; #27 later observed one live positive `idres` and standard cancellation. No cancellation POST was sent for #24 itself.

On 2026-09-25, a fresh authenticated read of the account holder's 9NBC daily schedules found offered-looking Open Box rows with `enabled=1`, `bookState=null`, `cancelledId=null`, and `resadmin=0`, but no `hidden` property. The official public schedule renderer tests `hidden` only while labeling an already cancelled class; its booking and cancellation button conditions do not require that property. The checkout now accepts an absent `hidden` field while still rejecting a present nonzero value. This resolved a preview parsing mismatch before the live write cycle. The same read found `enabled=1` on Open Box rows beyond the account holder's reported five-day booking window, so the flag does not establish that account-specific window or final write eligibility. No booking or cancellation POST was sent during that read-only investigation.

A read-only check of the gym's separate [marketing site](https://noubarriscrosstraining.com/horarios-precios-y-promociones/) and its listed pages found no additional booking or cancellation cutoff. No official source checked established the reported one-hour booking cutoff or confirmed when a cancelled credit becomes reusable. Rules shown by a separate booking provider cannot establish AimHarder behavior.

A separate [read-only credit-balance investigation](research/2026-09-24-booking-credits.md) found no verified own-account endpoint or response field for credits remaining in the current period. A commented-out `pricingOptions` renderer is only a lead. A later authenticated own-account check of `whoami`, `nextBookings`, and two daily `bookings` responses found no identifiable balance or period key. Those views are not an exhaustive account API. Neither the current entitlement's period nor credit restoration after cancellation is established.

## Personal activity and calendar (2026-09-22)

The account profile reads its own `/api/activity` feed with `timeLineFormat=0`, `timeLineContent=2` and authenticated `userID`. Older pages use format 2 and `loadAfter=lastLoaded`, ending at sentinel `-1`. Two observed pages held 32 nonoverlapping records each. Exhaustive traversal was not performed, and feed `when` is not a verified record-date ordering key.

The account calendar requests `/api/activityCalendar` with zero-based `month` and full `year`. It exposes `YYYY-MM-DD` keys under `workouts`; each day's `rates.ids` points to workout details by `SEID`. An empty month used `workouts: []`. The renderer showed no calendar pagination. The implementation reads finite month partitions for requested dates instead of scanning the feed. Fresh detail reads verified `userId` against login identity, `boxId` against membership `boid`, and record date against calendar date in the confirmed gym zone. The personal feed contained the same IDs. Original notes, exercises and prescriptions are projected; profile/charts/leaderboards are excluded except the narrow current-result description below.

No verified training-session ID, within-day time or attendance link was found. One day can hold several distinct activity IDs. The user clarified that #9/#10 mean activity-entry recency and counts; earlier day-level physical-session blockers are historical and superseded by the [entry semantics ADR](adr/2026-09-22-activity-entry-query-semantics.md). Live comparisons found five recent entries in one complete 31-date window, an empty complete August 2026, and ten entries on ten dates during 1–22 September. Same-day tie and partial cases are fixture-tested. Exact counts require complete requested-date coverage; see [validation](validation.md).

## Difficulty variants (2026-09-23)

The user supplied screenshots of `SCALED`, `INTERMEDIO` and `RX` for a next-day WOD. An anonymous feed URL returned HTML, so authenticated read-only inspection first verified the account's gym membership. The official renderer collects `TIPOWODs[].scaledops` labels in source order, selects the corresponding `scaledver` block/exercise replacement, and keeps base content for shared blocks. The observed WOD had three blocks and ten exercises, with labels/replacements on its final block.

Independent SDK stdio comparisons of future 24 September WOD and Metcon matched one publication and three variants each, including labels, notes, exercise names and projected prescription values. This verifies the relationship for the observed gym/date, not a universal three-level rule. Malformed variant relationships are unsupported rather than guessed. See the [workout decision](adr/2026-09-22-published-workout-applicability.md).

## Recorded block results (2026-09-23)

A user-supplied workout-detail sample, rather than a new live query, showed `TIPOWODs` result fields `res`, `reps`, `time`, `rondas`, `rx` and `rxstr`. The user confirmed `time` means seconds. Other numeric encodings remain source values. Null, zero and absent fields retain their differences; `rx=false` alone does not prove a scaled result. Exercise `tWOD*` repeats block data and is not projected as another result.

The same sample linked `chartData[block.id]` to the current activity through `idAction`, supplying `desc`. Its `7R` meant seven complex rounds for that class, with no universal gym interpretation. Only a matching current activity/block contributes `result.desc`; unrelated chart history is excluded. Conflicting/malformed matches make coverage incomplete. Later live activity comparison checked the projected result fields for the observed account; see [validation](validation.md).

## Exercise value and load units (2026-09-24)

Authenticated read-only checks of 23/24 September WOD, GAP and Mobility details and the official renderer established these observed rules:

| `formaReg` | `valor1` meaning | Load-unit source |
| --- | --- | --- |
| `1` | Seconds | None |
| `2` | Distance | None |
| `3` | Repetitions | None |
| `4` | Repetitions | `tipoud` when a load value exists |
| `5` | Calories | None |
| `6` | Distance | `tipoud2` when a load value exists |

The renderer lists weight units `kg`, `lbs`, `pood`, `%BW`, `%RM`, `RIR`, `RPE` and distance units `m`, `mi`, `yd`, `ft`, `steps`, `km`. The observed Front Squat had `valor2="85/85"`, `tipoud=4` and therefore `%RM`, not kilograms. The 24 September dumbbell snatch had variant-specific kilogram loads. Rest values 30/60/90 were seconds; the UI displayed 60 as `1'`. An unweighted lunge and a distance carry had no load despite recognizable unit codes, because `valor2` was null. Empty values get no unit. The SDK stdio comparison matched these fields against fresh feed/detail responses, but other source formats and gyms remain unverified. The current server does not look up a personal RM or compute an absolute load; see [validation](validation.md).

## Remaining research boundaries

Only one account/location has live evidence. Future feed pages, complete booking/history horizons, other account roles/domains/locales, 2FA, rate limits and physical training-session grouping are not established. The assumed `Europe/Madrid` fallback is explicitly a product choice. The single confirmed standard write cycle does not authorize or validate further write branches; each real action still requires its own explicit confirmation.
