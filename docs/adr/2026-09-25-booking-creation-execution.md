# ADR: confirmed booking creation and read reconciliation

Status: accepted for issue #23 on 2026-09-25; amended with one live standard creation observed under #27 on 2026-09-25.

## Decision

Expose `execute_booking_creation` only for a fresh, unused `prepare_booking_creation` reference with an explicit confirmation marker. The MCP client must show the preview and obtain account-holder confirmation of that exact action. The marker cannot itself prove human consent. Consume the reference before network access, then recheck the authenticated account, selected membership, confirmed IANA zone, exact schedule session, offered state, and current upcoming view. An existing matching booking, waitlist, or unknown entry blocks the write; absence in that view is not proof of no booking because its horizon is unverified.

Use one standard form POST to the fixed verified-gym `/api/book` origin with schedule session `id` and `day=YYYYMMDD`. The public official frontend did not disclose authenticated creation; unofficial clients supplied the initial lead, and one live standard success later verified this request shape at 9NBC. Their extra `insist` and family parameters are not used. No HTTP response alone establishes success. Interpret a denial indication only together with a fresh still-unbooked schedule; mark its precise meaning unverified. Read the daily schedule and upcoming view after the attempt. A booked daily row with no conflicting upcoming row or denial establishes the reported booking state; an unexpected waitlist is distinct. Unknown or contradictory evidence produces `uncertain`, with no automatic write retry.

## Consequences

The confirmed #27 Open Box request used form fields `id` and `day`, returned HTTP 200 with `bookState=1`, and was independently found booked in both the fresh daily schedule and upcoming view. This validates that one standard path at 9NBC, not every denial, waitlist, eligibility, or credit effect. The published npm package remains read-only. A real booking still requires separate action-time account-holder confirmation. The existing read-only credential ADR stays historical; its retry policy applies to queries, never to an attempted write.
