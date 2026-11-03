# AIHarder — configured account settings

Date: 2026-11-03. The owner selected compact frame A as the base and explicitly rejected the wizard. The page is now settings, starts fully configured, and disables only genuinely dependent controls. This supersedes the A/B wizard comparison on the reused private route. B is historical, not a current alternative.

## Reference lock and decisions

Primary visual source is the owner-selected A: centered 640px frame, identity and small language/appearance utilities, expandable sections and restrained footer. Keep the accepted brand/type/button tokens. Remove step counts, numbered/completed step markers, next/back/finish actions, layout switcher and setup/after-setup modes. Start with all three independent sections expanded so the configured settings can be reviewed together.

The previously inspected Linear connected-accounts reference contributes separate account/app identities; the user-selected A owns the actual composition. No new visual research or unrelated screens are needed for this directed refinement. English desktop Light/Dark native frames A are updated in place. Spanish remains in HTML during this narrow design iteration; previous public/auth/mobile/native B frames remain unchanged.

The existing custody/lifecycle contract preserves AI-client grants when AimHarder is disconnected. Therefore app-access management must remain available without an upstream connection. Confirmation preferences belong to the encrypted AimHarder configuration, so both preference switches and their save action are unavailable until that connection exists. Missing connection must not mean inaccessible settings sections. This is UI dependency presentation, not a new authorization gate or change to backend scope.

Both confirmation preferences retain the final merged PR #121 contract: independent account settings, both default on, shared across clients. Cancellation/deletion confirmations remain mandatory. Editing or disabling a setting never enables a role-restricted action.

## Prototype boundary

Default fictional data: AimHarder account `alex@example.com`, ChatGPT personal installation and Hermes laptop installation, both authorized. There is no live session, credential input, account lookup, actual OAuth, network mutation or persistent preference storage. Local switches/save and native dialogs demonstrate dependencies and independent installation management using in-memory fixtures only. Any connection-shaped fields are static fictional examples. Review fixture controls are outside the product frame.

## Current behavior and evidence

All three sections start open and collapse independently. Save changes and Cancel enable only for dirty preferences; cancel restores the saved local values. Upstream disconnection preserves the app list and its management, disables the dependent switches, and displays the reason. Reconnection returns the fixture preferences to their default-on state. App disconnection affects only the selected installation; multiple same-provider fixtures are allowed. Legacy `layout` and `step` parameters are removed; the route defaults to `state=configured`, with `state=missing-connection` available for dependency review.

[Browser checks](private-settings-checks.json) record independent preference editing, cancel/save, preserved grants, disabled dependent switches, reconnection, per-installation revocation, multiple same-provider fixtures, accordion/dialog focus restoration, Spanish Dark without horizontal overflow and System locale/state retention. No captured browser errors remained. Credential-input count is zero. JavaScript syntax and local links/assets were checked; the runtime/backend suite is not applicable to this static checkpoint.

[Browser EN Light](previews/private-settings/configured-en-light.png) · [Browser ES Dark](previews/private-settings/configured-es-dark.png).

## Native design

The existing A roots `M3U1LB` (English Light) and `Vqh6E` (English Dark) now depict configured settings, at 1440×1100 with the same 640px frame. Identity and primary-action components are reused. Native renders were inspected and corrected for the Hermes raster asset and action-label wrapping before export. All 36 other root trees compared unchanged through the editor, including B. Placeholder flags are cleared. Existing nested-bounds diagnostics are not claimed resolved; this checkpoint verifies rendered layouts, not pixel parity or a new clean structural visitor pass.

[Pen Light](previews/private-settings/pen/M3U1LB.png) · [Pen Dark](previews/private-settings/pen/Vqh6E.png).

Public/auth/mobile screens, live account/auth/API behavior and security decisions are unaffected. No new ADR is needed for this reversible design refinement. Production persistence, credential entry, provider setup/consent and client acceptance remain separate implementation work. The owner-selected composition is implemented here; the current detailed visual treatment awaits owner review.
