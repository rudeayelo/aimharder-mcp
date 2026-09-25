# ADR: separate confirmation for a late cancellation that may lose credit

Status: accepted for issue #26 on 2026-09-25. Live upstream validation remains pending in #27.

## Decision

When a standard `execute_booking_cancellation` request returns the frontend-observed `cancelState=2`, report `pending-credit-loss` only if a new daily schedule and upcoming-booking read show one same, still booked, cancellable reservation with no conflicting state. Include the exact gym, class, local date and time, current state, possible credit loss, and unknown credit balance. Issue a new two-minute, single-use in-memory reference bound to the account, gym, and reservation. A changed, missing, cancelled, ambiguous, or unreadable reservation produces uncertainty with no late reference.

Expose `execute_late_booking_cancellation` with that new reference and `confirmedCreditLoss: true`. Its description requires the MCP client to show the warning and obtain a separate account-holder confirmation of the possible loss. This marker and reference cannot prove human consent by themselves. Consume the reference before rechecking the same account, gym, zone, reservation, and cancellation eligibility. Send at most one form `POST /api/cancelBook` with the verified reservation `id` and `late=1`, then reconcile through fresh read-only views. Report `confirmed` only with a compatible `cancelState=1` and fresh cancelled state, `rejected` for a compatible source denial while still booked, and `uncertain` for conflicting, unsupported, failed, or unreadable outcomes. Never retry a write automatically.

## Consequences

The 9NBC published 90-minute rule informs the preview and warning; it does not establish an API cutoff, account credit balance, or actual refund. This flow has public MCP fixture coverage, not a live authenticated late-cancellation contract. The released npm package remains read-only. Live validation requires a separate, action-time account-holder confirmation for any real creation or cancellation.
