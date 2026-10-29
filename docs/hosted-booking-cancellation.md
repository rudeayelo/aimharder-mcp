# Hosted confirmed booking cancellation

Issue [#78](https://github.com/rudeayelo/aimharder-mcp/issues/78) exposes the existing three cancellation tools through authenticated MCP HTTP. Both `user` and `admin` can cancel their own existing reservations without a feature switch. Reservations need not have been created by this service. The [shared coordination decision](adr/2026-10-19-confirmed-hosted-action-coordination.md) governs account isolation, durable consumption, dispatch and read-only recovery.

## Actual Hermes standard cancellation (2026-10-21)

Actual parent **75812 exited 0**, with maintained Hermes child exit 0/reaped and no timeout. The owner separately confirmed standard cancellation of the exact human-shown booked preview, including possible credit loss and unknown balance/entitlement period. Preparation-only **89816** had passed without execution. The actual execution run used five requested registry calls: context, **one fresh preparation/one standard execution**, upcoming bookings and schedule. Every material safe-preview field, including credit risk and notices, matched the original shown preview, excluding **only `expiresAt`**. The actual original reply remained bound to the exact intent; no newly shown expiry/confirmation is claimed. The old reference was never loaded/replayed; the fresh reference stayed in memory, valid for at most two minutes and checked before dispatch.

The supported per-thread Hermes callback received one request, granted/consumed **one once approval** and restored the previous callback, without session/permanent approval or trust-mode changes. Execution returned **`confirmed` / observed state `unbooked`** for the exact target. A separate own-account upcoming read found **zero active target candidates**, including unknown-name candidates; the complete schedule still contained the target, whose projection does **not** establish account booking state. No late warning arose, no late tool was dispatched and the separate late-credit-loss consequence flow remains unexercised. Possible credit loss remained disclosed; balance and entitlement period stayed null, with no refund or actual credit effect verified.

This is actual standard cancellation/read-back evidence after the separately confirmed creation, without erasing that historical success or earlier failed checkpoints. The installed remote OAuth profile/client were verified; no installed Hermes patch, global trust, server/client-configuration or runtime/deployment change, new OAuth consent, direct store/cache/TTL/clock edit or automatic write replay occurred. Unique RPC and raw upstream response are unobserved. The no-network approval sentinel remains synthetic evidence, separate from this actual pass. Booking/gym/date/time/identity details remain private. Coordination/confirmation ADRs and API decisions are unchanged; no implementation/archive input changed. The late-consequence flow remains unexercised; separate consequence confirmation was not applicable to this standard response. At that Hermes checkpoint, ChatGPT cancellation and other action/lifecycle/cost gates remained open.

## Owner-reported ChatGPT standard cancellation (2026-10-21)

The later [manual ChatGPT cancellation checkpoint](hosted-pilot-acceptance.md#owner-reported-chatgpt-standard-cancellation-with-native-empty-view-2026-10-21) reports one confirmed standard execution, target unbooked and an empty ChatGPT upcoming view. A separate native read found zero current entries/target candidates with null date horizon, without exposing an explicit unbooked state or proving exhaustive absence. Raw confirmation/references/arguments/timestamps/wire and independent POST/ChatGPT subject proof remain unobserved. No late execution or verified credit/refund effect is claimed. Earlier creation and failed checkpoints remain preserved; no additional action is authorized and #84/#69 stay open.

## Participant journey

1. Connect your own AimHarder account, confirm the gym's IANA zone, and call `prepare_booking_cancellation` with an exact class name, gym-local date and start/end times. The fresh account-scoped daily schedule supplies the internal reservation ID; arbitrary reservation IDs, family and member selectors are never accepted.
2. Show the full gym/class/date/time preview, booked state and possible credit loss. Obtain a separate explicit account-holder confirmation before calling `execute_booking_cancellation` with that fresh reference and `confirmed: true`. Preparation sends no cancellation request. Missing, ambiguous, already cancelled, waitlisted and unsupported targets receive no executable reference.
3. Inspect the result from fresh schedule and upcoming reads. If AimHarder returns a credit-loss warning and the exact reservation is still booked and actionable, `pending-credit-loss` includes a **new**, short-lived reference. No second request is sent automatically.
4. Show that warning's exact target and possible credit loss. Obtain a **new, separate** explicit confirmation of the consequence before calling the distinct `execute_late_booking_cancellation` tool with the new reference and `confirmedCreditLoss: true`. The first confirmation and original reference cannot authorize a late request. The late tool rechecks the exact reservation before its single possible request.

Every actual cancellation, including a late attempt, needs its own exact human confirmation. Cancellation must never be used as unconfirmed cleanup after creating a test booking. The strict MCP literals are client contract checks; they do not prove a human confirmed the action.

## Outcomes, interruption and credits

The subject-owned account object serializes the complete prepare/execute/read-back operation. The existing client consumes its reference and freshly checks account, membership, gym settings, reservation and offered cancellation state. The shared durable coordinator consumes permission before preflight and persists an encrypted possibly-sent fence before the final current admission/grant/generation/connection-revision and expiry checks immediately before fetch. It sends at most one POST per confirmed action. Standard and late actions have separate coordinator identities and cannot exchange their references.

Confirmed cancellation requires an accepted interpreted response and compatible fresh reads of the same source session/reservation, including the observed released-session branch. Denial with the unchanged booking can be rejected; a lost or incomplete response, conflicting or incomplete reads remain uncertain. A successful HTTP status alone never establishes cancellation. `credit.balance` and `credit.entitlementPeriod` remain null: no refund, balance or actual lost credit is inferred from the cancellation state. The published 9NBC 90-minute warning is gym-specific evidence, not a universal cancellation rule or verified credit transaction.

Unused preparations and new late references are lost on actor restart. A retained encrypted consumed/possibly-sent journal permits only fresh original-account reconciliation; it never replays a write or reissues late execution permission. A recovered pending warning contains no executable reference: inspect the booking and prepare again, then confirm the new exact proposal before any request. Missing original identity/revision/connection yields uncertainty without reading a replacement account or resurrecting credentials. Foreign, expired, stale, wrong-gym and repeated references do not authorize dispatch. Shared two-minute preparation and ten-minute recovery limits, bounded inventory, alarms and key-rotation procedure remain in the [creation guide](hosted-booking-creation.md#operator-activation-and-key-maintenance).

If saving response interpretation fails after a possible send, the original account is still freshly read and its honest current result returned with a recovery-limit notice. A failed final phase marker cannot discard that result. The prior durable fence prevents replay; later recovery without response facts may be less conclusive.

## Synthetic verification and remaining evidence

The implemented [residency amendment](adr/2026-10-21-bounded-preparation-residency.md) retains unused standard and separately confirmed late preparations through their original expiry, coalescing overlap and releasing the hold on consumption/discard. It does not extend either reference, survive a forced restart or authorize late execution from the standard confirmation. The isolated [native comparison](validation.md#bounded-preparation-residency-native-comparison-2026-10-21) passes; the code-only test-pilot activation and native context are verified, with the later [manual ChatGPT standard-cancellation observation](#owner-reported-chatgpt-standard-cancellation-2026-10-21) and remaining action/credit limits recorded separately.

Fourteen public journeys use actual portal/OAuth, MCP SDK v2 HTTP, workerd, D1, persistent SQLite account objects and the real shared AimHarder client. External AimHarder HTTP, fixture time and failures around real durable journal writes are synthetic. They cover pre-existing own reservations for both roles, exact previews and strict confirmations, separate late reference/consequence confirmation, concurrency and independent accounts, foreign/wrong-gym/expired/revision/reservation changes, revocation/expiry during held preflight, interrupted consumption/dispatch/result, persistent restart and original-identity and missing-connection protection, denied/lost/incomplete/conflicting outcomes and post-send and recovery bookkeeping failures, plus explicit wrong-gym denial before protected recovery reads for creation and cancellation. Unexpected external requests fail the harness. No real cancellation, mail, provider mutation, purchase or plan change occurred.

The [historical 9NBC standard cancellation](api-research.md#live-standard-open-box-cycle-2026-09-25) remains separate API evidence; the later [actual Hermes checkpoint](#actual-hermes-standard-cancellation-2026-10-21) adds a confirmed hosted standard-cancellation journey under the unchanged contract. Late cancellation, other gyms and credit effects remain unverified live. The later [ChatGPT standard-cancellation observation](#owner-reported-chatgpt-standard-cancellation-2026-10-21) has manual evidence and uncaptured-confirmation limits; remaining lifecycle enforcement and cost/load measurements stay separate. Migration `0006-action-journal.sql` must already be active before deploying this code; this ticket adds no migration, provider binding or public maintenance route. Local stdio inputs, outputs and eighteen-tool surface remain unchanged.


## Default-off technical observations (#99, 2026-10-29)

Hosted booking callbacks classify the trusted account result before MCP
serialization and record one tool completion in the invocation-local telemetry
buffer. Ready preparations and confirmed executions are successful; missing,
ambiguous, already-booked/cancelled, waitlisted, unsupported, stale and refused
results are expected denials. A normal cancellation's pending credit-loss result
is a distinct denial requiring the existing separate confirmation. An uncertain
execution creates the static `HostedWriteUncertain` issue; it does not assert
that the booking or cancellation failed. Unknown variants create only a static
classifier issue.

The exporter receives no preview, action reference, target, reservation, account,
gym or sporting payload. Preparation and execution retain separate random
request traces. Collection remains disabled by default, uses the existing
bounded one-attempt delivery, and changes no confirmation, consumption, queue,
recovery or dispatch contract. See the [technical observation validation](validation.md#booking-tool-observations-99-2026-10-29)
for synthetic evidence and the separate deployment/acceptance limits.
