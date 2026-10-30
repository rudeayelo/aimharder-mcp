# ADR: separate confirmation for a late cancellation that may lose credit

Status: accepted for issue #26 on 2026-09-25; reconciliation amended after the standard #27 cycle. The late-credit-loss path remains unverified live.

Confirmation amendment: partially superseded on 2026-10-30 by the [account write-confirmation preference](2026-10-30-account-write-confirmation-preference.md). Only booking creation and activity publication have independent confirmation preferences, both enabled by default. Cancellation and deletion confirmations remain mandatory. Other decisions and historical receipts below remain unchanged.

## Decision

When a standard `execute_booking_cancellation` request returns the frontend-observed `cancelState=2`, report `pending-credit-loss` only if a new daily schedule and upcoming-booking read show one same, still booked, cancellable reservation with no conflicting state. Include the exact gym, class, local date and time, current state, possible credit loss, and unknown credit balance. Issue a new two-minute, single-use in-memory reference bound to the account, gym, and reservation. A changed, missing, cancelled, ambiguous, or unreadable reservation produces uncertainty with no late reference.

Expose `execute_late_booking_cancellation` with that new reference and `confirmedCreditLoss: true`. Its description requires the MCP client to show the warning and obtain a separate account-holder confirmation of the possible loss. This marker and reference cannot prove human consent by themselves. Consume the reference before rechecking the same account, gym, zone, reservation, and cancellation eligibility. Send at most one form `POST /api/cancelBook` with the verified reservation `id` and `late=1`, then reconcile through fresh read-only views. A compatible `cancelState=1` and nonconflicting fresh state support `confirmed` either when the same reservation identifier remains on a cancelled row or when the same source class session is unbooked with no reservation identifier and no conflicting upcoming entry. A compatible source denial while still booked supports `rejected`; conflicting, unsupported, failed, or unreadable outcomes remain `uncertain`. A repeated `cancelState=2` warning after the late attempt remains uncertain rather than being interpreted as denial. Never retry a write automatically.

## Consequences

The 9NBC published 90-minute rule informs the preview and warning; it does not establish an API cutoff, account credit balance, or actual refund. This flow has public MCP fixture coverage, not a live authenticated late-cancellation contract. The released npm package remains read-only. Live validation requires a separate, action-time account-holder confirmation for any real creation or cancellation.

## Hosted recovery amendment (2026-10-19)

The [hosted coordination decision](2026-10-19-confirmed-hosted-action-coordination.md#cancellation-extension) preserves this distinct late tool and consequence confirmation. Actor restart loses unused standard and late references. Read-only recovery of a retained standard warning never reissues late permission: it can report the still-pending warning without an executable reference, requiring a new preparation and the appropriate new confirmations before any later request. This amendment does not change local in-memory behavior or establish live late-credit-loss evidence.
