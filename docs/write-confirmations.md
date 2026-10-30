# Booking and workout confirmation preferences

Two independent switches apply to the configured account and all its MCP clients. Both default to **on**:

- **Ask for confirmation when making a reservation**: `requireBookingConfirmation` controls booking creation only.
- **Ask for confirmation when posting a new workout**: `requirePublicationConfirmation` controls publication of an own activity entry with workout results.

With a switch on, the agent shows the exact prepared action and asks for confirmation before writing. With it off, an explicit request to perform that action permits execution without a second question. A query or preview-only request never authorizes writing. Standard cancellation, late cancellation with possible credit loss, and activity deletion always require their existing separate confirmations; neither switch affects them.

Change the switches in hosted AimHarder connection settings, then save. The settings API accepts the two optional boolean fields independently. Omitted fields preserve their saved values; invalid values fail. The form sends explicit presence markers to distinguish an unchecked switch from an omitted preference. Saving changes connection revision and invalidates outstanding preparations. Password updates and upstream account replacement preserve both preferences unless explicitly changed. Disconnecting removes connection settings; a new connection defaults both to on. The earlier unreleased global preference is no longer used and does not disable either confirmation; the settings API rejects that removed field.

Local stdio supports `AIMHARDER_REQUIRE_BOOKING_CONFIRMATION=true|false` and `AIMHARDER_REQUIRE_PUBLICATION_CONFIRMATION=true|false`. Each defaults independently to true. Restart after changing process configuration.

## MCP client behavior

`get_account_context` returns `writeConfirmationPolicy: { bookingCreation: boolean, activityPublication: boolean }`. Every preparation returns its effective `writeConfirmationRequired`; cancellation and deletion preparations always return true. Late-credit-loss warnings also require confirmation.

When the relevant value is true, show the exact full preview, obtain separate account-holder confirmation and call execution with `confirmed: true`. A late cancellation uses its distinct fresh reference and `confirmedCreditLoss: true` after separate consequence confirmation. A missing marker returns `WRITE_CONFIRMATION_REQUIRED` before reference consumption or dispatch.

Only for creation or publication with the relevant switch off, omit `confirmed` when executing the explicitly requested exact action with its fresh reference. Existing true markers remain accepted; literal false is rejected. Deletion still requires its exact `sourceActivityId` and confirmation.

All paths preserve exact target matching, user-confirmed gym zone, membership/ownership and role/grant checks, two-minute single-use references, at-most-one dispatch and fresh read-back. Unknown results require manual inspection and are never automatically replayed. Disabling confirmation does not infer achieved performance from prescriptions or suggested loads. Clients may independently enforce approval dialogs.

The [decision](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/adr/2026-10-30-account-write-confirmation-preference.md) records the final scope. The [hosted deployment receipt](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/hosted-confirmation-switches-deployment.md) records actual activation and native context. Exact npm release verification and actual ChatGPT/Hermes acceptance remain separate.
