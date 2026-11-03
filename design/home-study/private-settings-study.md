# AIHarder — participant settings

Date: 2026-11-03. Current refinement of owner-selected compact A. The owner rejected both the wizard and collapsible sections. Earlier screenshots/checks under `private-settings/` and `private-settings-checks.json` describe the preceding accordion checkpoint, not the current route. B remains historical.

## Reference lock and decisions

The accepted A remains the visual foundation: centered 640px frame, existing Geist/Krona identity, semantic light/dark tokens, small language/appearance controls and quiet footer. The owner now requires fixed sections, larger titles, gym information/default choice, obvious Disconnect buttons, removal of invented installation subtitles and the shared-app subtitle, plus user email/Google/password settings. Page title is 32px and section titles 20px (28px/19px below 550px). There is no wizard, tab switcher, collapse affordance or public-site menu.

Fresh bounded reference research inspected [Luma account settings](https://refero.design/pages/f1baccfe-fe07-4d6d-bd55-906ecdbaac6b) and [Dropbox security settings](https://refero.design/pages/6bb72ede-e9e9-4da2-a2a1-757f29547caa). Borrow only fixed labeled rows with trailing account actions and explicit third-party linkage. The existing AIHarder composition owns the layout, typography, palette and button treatment. Reject their sidebars, tabs, profile fields, payment/security features and unrelated palette. No new media is needed; provider marks remain existing assets.

## Current content

- **AimHarder:** account and connection status, a secondary Disconnect action, then available gym names. Two fictional gyms demonstrate native radio selection of the default; the `Default` label moves to the selected row. A single gym is displayed without a choice control. No inferred address, timezone or membership metadata is added.
- **AI apps:** provider mark/name and an obvious Disconnect button per authorization, followed by Connect an app. Personal/laptop installation labels were fictional fixture descriptions, not observed account data; they are removed. Grant identities remain distinct internally even when provider names match.
- **Confirmations:** the final PR #121 two-switch contract remains independent, default on and account-wide. No shared-app subtitle. Mandatory cancellation/deletion confirmation remains explicit. Save/Cancel enable only for pending edits.
- **Your account:** email with Change email; Google identity with Connect/Disconnect; AIHarder password with Change/Add password. These are distinct from AimHarder credentials.

Secondary actions use a bordered neutral gradient and the accepted `rgba(0,0,0,0.1) 0px 4px 6px 0px` shadow, with hover/focus/pressed states. No destructive-red treatment is introduced for reversible disconnection.

## Dependency and contract boundaries

`hosted/src/aimharder-settings.ts` and the existing custody/lifecycle ADR preserve AI-client authorizations when AimHarder is disconnected. Gym choice and both confirmation preferences disable in that state; managing AI-app access and the AIHarder identity remains available. Existing source also supports accessible gym discovery/default selection. This fixture does not perform discovery or validate real memberships.

The Google linking ADR requires explicit linking to the same verified email and recent authentication. The new user-account rows are design proposals for the requested scope, not evidence that all actions are already implemented. Current `hosted/src/identity.ts` supports explicit Google linking/password addition; this checkpoint does not add backend email change, Google unlink or password-change endpoints. Email-change verification, linked-Google email reconciliation, reauthentication, password policy and session invalidation need concrete production contracts before implementation. The Google-only fixture disables disconnection until a password is added locally; this is proposed UI dependency behavior, not a new enforced backend policy. No architecture/security ADR is superseded by this static proposal.

## Prototype behavior

All account addresses and gym names are fictional. No actual authentication, credential input, lookup, OAuth redirect, mail, persistent settings or account mutation occurs. Credential/email-shaped modal fields are static `role=img` specimens and accept no input. Email preview keeps the current address and reports that no email was sent. Password preview reports that no password changed. Google actions only change fixture state. Review fixture controls remain outside the product frame.

Default route: `state=configured`. `state=missing-connection` shows disabled dependent controls. Optional review-only `gyms=single` shows the sole gym without radios; `auth=google-only` shows the password prerequisite. Legacy `layout`/`step` parameters are removed. Locale and appearance stay in the URL; fixture edits reset on reload.

## Verification and artifacts

[Browser checks](private-settings-v2-checks.json) record fixed headings/no collapse controls, exact title sizes, removed subtitles, button borders/gradient, gym selection/focus, single-gym presentation, upstream dependency disabling with retained apps, independent preferences, Google connect/disconnect, Google-only prerequisite, password/email specimens with no credential inputs, unchanged current email pending verification, Spanish Dark without overflow and System mode. Captured browser errors: none.

[Browser English Light](previews/private-settings-v2/configured-en-light.png) · [Spanish Dark](previews/private-settings-v2/configured-es-dark.png).

The two editable English desktop A roots remain `M3U1LB` and `Vqh6E`. They are now 1440×1500, moved together to y=21600 to fit the added content without overlapping historical B. Their 640px frame and shared identity/action components remain. All 36 other root trees compared unchanged through the editor. Placeholder flags are cleared. Light/Dark exports were visually inspected for wrapping, asset rendering, alignment and clipping. Existing nested-bounds diagnostics are not claimed resolved; this is render review, not pixel parity or a new clean structural visitor pass.

[Pen Light](previews/private-settings-v2/pen/M3U1LB.png) · [Pen Dark](previews/private-settings-v2/pen/Vqh6E.png).

JavaScript syntax, translation JSON, local links/assets and whitespace are checked. Runtime/backend suites are not rerun for static-only design changes. English/Spanish HTML is current; only the two English desktop A native frames change during this refinement. Public/auth/mobile and B native frames, runtime/API/auth behavior, deployment and existing ADR decisions are unchanged. Real provider/account/client acceptance remains separate.
