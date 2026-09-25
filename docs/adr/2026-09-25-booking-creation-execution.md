# ADR: confirmed booking creation and read reconciliation

Status: accepted for issue #23 on 2026-09-25. Live upstream write validation remains pending in #27.

## Decision

Expose `execute_booking_creation` only for a fresh, unused `prepare_booking_creation` reference with an explicit confirmation marker. The MCP client must show the preview and obtain account-holder confirmation of that exact action. The marker cannot itself prove human consent. Consume the reference before network access, then recheck the authenticated account, selected membership, confirmed IANA zone, exact schedule session, and offered state.

Use one candidate standard form POST to the fixed verified-gym `/api/book` origin with schedule session `id` and `day=YYYYMMDD`. The public official frontend did not disclose authenticated creation. Unofficial client implementations suggest this route and fields, but their extra `insist` and family parameters are not used. No HTTP response alone establishes success. Interpret a denial indication only together with a fresh still-unbooked schedule; mark its precise meaning unverified. Read the daily schedule and upcoming view after the attempt. A booked daily row with no conflicting upcoming row establishes the reported booking state; an unexpected waitlist is distinct. Unknown or contradictory evidence produces `uncertain`, with no automatic write retry.

## Consequences

The checkout can exercise the manual creation workflow against fixture responses; this does not verify the candidate wire contract or credit effect live. The published npm package remains read-only. A real booking requires separate action-time account-holder confirmation, and live acceptance remains with #27. The existing read-only credential ADR stays historical; its retry policy applies to queries, never to an attempted write.
