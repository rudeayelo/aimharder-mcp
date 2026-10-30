# ADR: independent booking and workout confirmation preferences

Status: accepted on 2026-10-30 for [issue #120](https://github.com/rudeayelo/aimharder-mcp/issues/120), amended to the owner's final two-switch scope before release.

## Context

The owner found a single global confirmation choice ambiguous and requested two separately labeled on/off switches: one for making a reservation, one for posting a new workout. Preferences belong to each account and apply to all its MCP clients.

## Decision

Add independent `requireBookingConfirmation` and `requirePublicationConfirmation` booleans to the encrypted hosted connection configuration and existing settings form/API. Both default to true. The form uses accessible native checkboxes with `role="switch"`, the owner's exact labels and a shared Save settings action. Explicit form presence markers distinguish unchecked fields from omitted settings. API omissions preserve each stored value independently; invalid types fail. Password updates and upstream account replacement retain both values unless explicitly changed; disconnecting deletes connection settings, so a new connection starts with both enabled. The prior unreleased global field is removed and does not authorize bypassing either confirmation.

Local stdio uses `AIMHARDER_REQUIRE_BOOKING_CONFIRMATION` and `AIMHARDER_REQUIRE_PUBLICATION_CONFIRMATION`, each accepting literal true/false and defaulting to true. Account context reports `writeConfirmationPolicy` with `bookingCreation` and `activityPublication`. Each preparation reports the effective `writeConfirmationRequired` for that exact action.

When the relevant switch is on, show the full exact preview and obtain separate confirmation with `confirmed: true`. When off, an explicit request to create that exact booking or publish that exact activity authorizes its prepared execution without another question. A query or preview-only request never authorizes a write. Standard cancellation, late credit-loss cancellation and activity deletion retain mandatory confirmation regardless of either switch. A late cancellation still uses its separately issued fresh reference and `confirmedCreditLoss: true` after consequence confirmation.

Execution markers are optional literal true fields in MCP schemas, with the effective policy checked before reference consumption/durable coordination and again in the shared client. Callers cannot override policy through execution arguments. Changing settings changes revision and discards outstanding preparations. Preserve exact target/zone/membership/ownership checks, role/grant policy, short-lived single-use references, at-most-one dispatch and fresh read-back. Unknown writes are never replayed automatically. Achieved-result/actual-load semantics remain unchanged.

This partially supersedes only unconditional creation/publication confirmation requirements in the linked earlier booking and activity decisions. Their cancellation/deletion confirmation requirements, other protections and historical receipts remain current. The broader global-policy implementation checkpoint in the validation record is historical and was not released or deployed. The pending #108/#115 UX slices must follow this final scope.

## Consequences

Existing accounts keep both confirmations enabled, and existing true markers stay compatible. Participants can remove friction independently for booking creation and workout publication without disabling confirmation for destructive actions. No database migration is required; missing preferences in older encrypted configurations mean true. This controls service-authored instructions and validation; client-owned approvals remain independent.

The reference lock preserves the existing portal's type, colors, layout and save flow. Refero's [Hello Ivy preferences](https://refero.design/pages/4fd0f520-5564-47d4-9d6d-d91df1a53ac4) informed separate labeled checkbox preferences; the owner's explicit switch request determines the final interaction. Existing portal colors represent on/off state, with keyboard focus and a native accessible checkbox underneath; no JavaScript is needed.

Automated MCP/HTTP fixtures establish independent modes, persistence and isolation. Actual upstream writes, deployment and ChatGPT/Hermes acceptance remain separate. See the [contract](../write-confirmations.md) and [validation](../validation.md).
