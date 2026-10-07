# ADR: booking creation without a credit-use warning

Status: accepted on 2026-10-07 for [issue #64](https://github.com/rudeayelo/aimharder-mcp/issues/64).

## Context

The account holder reports duplicate confirmation when creating a booking and explicitly requests removal of the warning that booking may consume a credit. Creation previews currently include this warning in both notices and a structured `credit` object, and the MCP descriptions require the client to disclose it.

## Decision

Remove the credit-use warning and the entire `credit` object from `prepare_booking_creation` and `execute_booking_creation`, including their output schemas. The client shows the exact gym, class and gym-local date/time and obtains one explicit account-holder confirmation of that action. No additional credit-use acknowledgement is requested.

This supersedes only the booking-creation credit-disclosure requirement in the [manual booking decision](2026-09-24-manual-booking-writes.md) and the credit fields in the [creation preparation decision](2026-09-25-booking-creation-preparation.md). The [creation execution decision](2026-09-25-booking-creation-execution.md) still governs reference consumption, fresh eligibility checks, one standard write and read-back. Cancellation warnings and separate late-credit-loss confirmation retain their existing policy.

## Consequences

Creation consumers must stop expecting the removed `credit` field. A minor changeset announces this output-contract change while the package is in `0.x`. Removing the warning does not establish whether a booking consumes a credit or verify a balance. No upstream endpoint, request shape, account scope, authentication or retry behavior changes.

The public MCP fixture harness verifies tool metadata, preparation and execution outputs, the existing confirmation gate and one-write read-back behavior. This does not establish the number of prompts shown by a particular client app; client permission dialogs remain under that client's control. No real booking is required for this presentation change.
