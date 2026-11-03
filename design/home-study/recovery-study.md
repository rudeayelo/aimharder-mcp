# AIHarder — password recovery design

Date: 2026-11-03. Continuation of #95 after the accepted focused [Login design](login-study.md). The owner requested the password-recovery page. This checkpoint covers requesting a reset link and a generic inbox-confirmation state in English/Spanish desktop Light/Dark. The email template, new-password/token screen and private pages remain later work. No production service is changed.

## Reference lock

The accepted AIHarder Login is the primary visual target: centered 400px column, flat Light/Dark canvas, Krona/Geist identity above the heading, discreet language/appearance controls, existing blue primary action and quiet independent-project/Support/Privacy footer. Retain the 48px controls, 8px corners and literal `rgba(0,0,0,0.1) 0px 4px 6px 0px` shadow. No public navigation, decorative card or Google sign-in action on recovery. The same direction is used directly; unrequested alternative layouts are not added.

Research inspected before implementation:

| Source | Bounded contribution | Rejected |
| --- | --- | --- |
| [Linear style](https://linear.app), Refero style `554b801c-3b31-4086-a7e5-ae613cdd618b` | Restrained supporting copy and functional accent roles; secondary to the accepted AIHarder tokens. | Lime actions, dashboard surfaces and product imagery. |
| [Cal recovery](https://refero.design/pages/48a1e812-f5d1-48ce-a9a3-655111c33289) | One email field and an explicit return to login. | Card wrapper and external palette. |
| [Linktree recovery](https://refero.design/pages/f535b4a2-0ee8-400b-ba0c-0b34bbe120db) | Clear centered heading and short instructions. | Its branding and unrelated routes. |
| [Pitch recovery journey](https://refero.design/flows/590) | Email request → loading → inbox guidance. | Purple graphics, signup and passwordless alternatives; categorical claims of delivery. |

The existing `/recover` and `/portal/recovery` behavior in `hosted/src/portal.ts` grounds the email-only request and generic response. This is research of an existing contract, not new API implementation. The initial wording distinguishes AIHarder identity from AimHarder connection credentials. Confirmation says “If this email is linked to an AIHarder account…” and does not reveal account existence or claim verified mail delivery. Support remains the design target `support@aiharder.link`, without new inbox activation evidence.

## Prototype and states

[Request EN](recovery-study.html?lang=en&theme=light) · [Request ES](recovery-study.html?lang=es&theme=dark) · [Confirmation](recovery-study.html?lang=en&theme=light&state=sent).

The existing static server serves these alongside Login; no new dependencies or runtime setup are required. Login’s Forgot password link now opens recovery. Shared navigation preserves `lang=en|es` and `theme=light|dark|system` in Login, Home and Privacy links. Appearance and language controls are the same as Login.

- Initial HTML email input and submit are disabled, and the field has no submission name. They become enabled only after local handlers are installed. Missing JavaScript or a failed translation fetch leaves them disabled.
- Missing/malformed email shows a localized inline message and focuses the field.
- Valid synthetic input disables the controls and shows the existing spinner with “Sending…” for 650ms. The local timer replaces the request with inbox guidance and focuses its heading.
- The email is cleared on confirmation and is never put in URLs, storage, artifacts or logs. There is no fetch, authentication request, provider request or mail dispatch in the recovery handler.
- Confirmation provides Back to sign in and Try another email. The latter restores the empty request and focuses email. The URL-only `state=sent` control is review scaffolding, not evidence of a real request.
- HTML owns working interaction. Pen shows editable ready/confirmation stills. No actual password change is performed or designed here.

## Pen matrix

All eight new frames are 1440×900 in [ahmcp.pen](../ahmcp.pen), directly below Login.

| State | EN Light | EN Dark | ES Light | ES Dark |
| --- | --- | --- | --- | --- |
| Request | `f9e3b` | `IajMZ` | `wibes` | `bTwVh` |
| Inbox confirmation | `j6Soqk` | `eQRfd` | `NElwi` | `mlYB3` |

Native text, fields, actions and Lucide mail icon are editable; the brand uses the existing shared component. The 16 existing Home/Privacy/Login/mobile page trees compared unchanged. All new root placeholder flags are cleared. [Request native](previews/recovery/pen/f9e3b.png) · [Confirmation native](previews/recovery/pen/j6Soqk.png). The initial native action labels were left-aligned; render inspection caught this and the eight labels are now centered before final export. No clean nested-bounds-visitor claim is made; prior native diagnostics remain unresolved.

## Verification and boundaries

[Checks](recovery-checks.json) record actual Login → Recovery navigation, missing/invalid input, loading, generic confirmation, field clearing, focus, retry and return to Login. English Light and Spanish Dark render without horizontal overflow at the normal desktop review viewport. Spanish/System navigation preserves the mode while resolving to the current OS Dark appearance. The English page reports no captured console errors. Synthetic `example.com` input was used; no managed or real account credential was used.

[Request browser](previews/recovery/request-en-light.jpg) · [Confirmation browser](previews/recovery/sent-en-light.jpg) · [Spanish request](previews/recovery/request-es-dark.jpg) · [Spanish confirmation](previews/recovery/sent-es-dark.jpg).

Relevant JavaScript syntax and local links are checked. The local/hosted runtime test suites are not run for this static design-only checkpoint. ADR/security/API/authentication behavior is unchanged; the prototype enforces the existing no-secret/no-request boundary. Actual email delivery, token expiry, password changes, provider integration, narrow-device acceptance and owner visual approval are not established by this work. The current `.pen` still has no propagated new mobile auth screens.
