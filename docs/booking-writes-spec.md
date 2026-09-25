# Manual booking writes: confirmed feature specification

Status: confirmed by the account holder on 2026-09-24 and published as [implementation issue #21](https://github.com/rudeayelo/aimharder-mcp/issues/21). The creation preview and execution for #22–#23 are implemented in the checkout with fixture validation; live write validation is pending. This is a later feature phase, not a change to the released read-only MVP. See the [scope and safety decision](adr/2026-09-24-manual-booking-writes.md), [preparation decision](adr/2026-09-25-booking-creation-preparation.md), [execution decision](adr/2026-09-25-booking-creation-execution.md), [API research](api-research.md#booking-write-frontend-investigation-2026-09-24), and [credit investigation](research/2026-09-24-booking-credits.md).

## Supported actions

- Create or cancel one booking at a time for the authenticated account holder at a currently verified accessible gym.
- Require a user-confirmed IANA zone for the selected gym. The account holder confirmed `Europe/Madrid` for 9NBC.
- Limit the first delivery to a standard booking and cancellation. Defer waitlist joins/leaves, `insist`, family-account actions, batches, and automation. Retain and report an unexpected waitlisted or unknown result without calling it a confirmed booking or silently issuing another write.
- Keep API-client write methods separate from MCP interaction and confirmation logic.

## Preparation and confirmation

1. Read the current schedule and, where relevant, the account's current booking view. Identify a unique target by gym, gym-local date, class name, start/end time, and the appropriate source identifier. Creation targets the schedule session; cancellation requires the reservation identifier from a fresh schedule row. Do not treat the existing upcoming booking ID as a verified schedule-session join.
2. If the target is ambiguous, absent, already in the requested state, or not exposed as actionable by the source, return the observed state or alternatives without a write. Do not accept an arbitrary supplied source ID as a substitute for a verified match.
3. Produce a read-only preview with action, target, current state, known credit consequences, unknown credit balance, and a short-lived single-use action reference. Near the account holder's reported one-hour booking cutoff, warn that eligibility may fail; let AimHarder decide rather than imposing an unverified local cutoff.
4. The client must obtain explicit account-holder confirmation for that preview before executing. Re-read the relevant source data immediately before execution and invalidate the reference if the target or eligibility changed. A server reference limits stale writes but cannot prove that a human saw the preview; MCP descriptions and consuming clients must preserve the confirmation step.

## Execution and reconciliation

- Send only the selected standard write after confirmation. A timeout, connection failure, unsupported response, or authentication interruption must not trigger an automatic write retry. Reconcile through fresh read-only views. If the result remains uncertain, report it as uncertain and require a new preparation and confirmation for any further attempt.
- After a creation or cancellation, use a fresh read to confirm the observed booking state. A successful HTTP response alone is insufficient. Preserve conflicting views and unknown states instead of claiming success.
- For 9NBC, the [published rule](https://noubarriscrosstraining.aimharder.es/boxmemberships) says cancellation fewer than 90 minutes before class loses the credit. Warn at or inside that boundary before the first cancellation write. The official frontend's initial `late=0` request can itself cancel; it is not a preflight. If AimHarder instead returns a late-cancellation warning, stop, refresh the booking state, show the credit loss, and require a separate confirmation before any `late=1` request. Whether a late request is ultimately allowed remains source-dependent.
- Do not claim a credit was refunded or state a remaining balance without a verified credit read. The lack of a balance endpoint does not block a separately confirmed booking write. A future balance tool must keep monthly subscriptions and longer-lived session packs separate, using source-backed periods and expiry.

## Live validation

- At validation time, inspect the account's actual five-day booking window and choose the eligible Open Box session furthest in the future within that window. Verify the specific class is offered to this account and leave ample time before the published cancellation boundary. If eligibility is not verifiable, stop and present any alternative class for separate confirmation.
- Obtain action-time confirmation for the booking, make one write, and check fresh booking state. Prepare cancellation only after the resulting reservation is identified. Obtain a second action-time confirmation for cancellation, make one write, and check fresh state. Pause if the source warns of credit loss or if any result is uncertain. If cancellation cannot be confirmed promptly, surface the unresolved reservation and the remaining cancellation window to the account holder for direct action; do not let an uncertain result disappear from the validation report.
- Use anonymized fixtures for creation and cancellation state handling, stale/ambiguous targets, late-warning flow, duplicate calls, uncertain transport outcomes, and zone boundaries. Keep live responses and secrets out of the repository. Record exactly which write contracts and credit effects were independently verified.

## Delivery tickets

The confirmed implementation plan is tracked as individual [GitHub issues](https://github.com/rudeayelo/aimharder-mcp/issues/21). GitHub's native blocking relationships determine the working frontier.

| Ticket | Delivers | Blocked by |
| --- | --- | --- |
| [#22](https://github.com/rudeayelo/aimharder-mcp/issues/22) | Read-only booking preview | None |
| [#23](https://github.com/rudeayelo/aimharder-mcp/issues/23) | Confirmed booking write and reconciliation | #22 |
| [#24](https://github.com/rudeayelo/aimharder-mcp/issues/24) | Read-only cancellation preview | #22 |
| [#25](https://github.com/rudeayelo/aimharder-mcp/issues/25) | Confirmed cancellation write and reconciliation | #24 |
| [#26](https://github.com/rudeayelo/aimharder-mcp/issues/26) | Second confirmation for late credit loss | #25 |
| [#27](https://github.com/rudeayelo/aimharder-mcp/issues/27) | Live Open Box creation and cancellation check | #23, #26 |

## Open upstream contracts

The public official schedule exposes the cancellation route and its observed response branches, but no authenticated cancellation request has been made. The checkout's candidate creation request uses `POST /api/book` with form fields `id` and `day`, omitting third-party `insist` and family selectors. Its exact request/response contract is not verified by the public official frontend; unofficial clients and fixtures are leads only. Booking eligibility, schedule reservation-ID mapping, unusual states, and the account's credit period/balance require further evidence. No credit-balance endpoint is verified for this account, and booking counts cannot reconstruct one.
