# ADR: confirmed standard cancellation and read reconciliation

Status: accepted for issue #25 on 2026-09-25. The second confirmation for a late credit-loss attempt belongs to #26; live validation belongs to #27.

## Decision

Expose `execute_booking_cancellation` for a fresh, single-use cancellation reference and an explicit account-holder confirmation marker. The MCP client must show the exact preparation preview and obtain consent for that action. Consume the reference before source access. Recheck the authenticated account, accessible gym, confirmed IANA zone, exact schedule row, reservation identifier, booked state, and supported cancellation flags before writing.

Send at most one form `POST /api/cancelBook` with the verified schedule reservation `id` and `late=0`. Do not use this POST as a preflight. The public official frontend shows this route, fields, and `cancelState` branches, but authenticated request and response semantics remain unverified. Never replay a write after a timeout, connection loss, or authentication interruption. Reconcile through fresh daily schedule and upcoming-booking reads, with read-only reauthentication if needed. Only `cancelState=1` plus a nonconflicting fresh cancelled schedule supports `confirmed`; `cancelState=3` plus a still booked schedule supports `rejected`. `cancelState=2` plus a still booked schedule is `pending-credit-loss` and sends no second write. Unsupported responses, incomplete reads, and conflicting views are `uncertain`. A fresh read does not establish a credit refund or balance.

## Consequences

The checkout can execute a standard cancellation against fixtures; no live cancellation or credit effect has been verified. The published npm package remains read-only. A pending warning requires separate action-specific confirmation under #26. The historical credential security ADR's read-only retry policy never authorizes replaying a write.
