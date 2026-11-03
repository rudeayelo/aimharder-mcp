# AIHarder — participant home design

Date: 2026-11-03. The owner clarified that “admin” means the **signed-in participant area**, not administrator management of invitations/participants. This checkpoint designs only its shared header and Home in two fictional states: first entry and returning with connections. AI app setup, account settings and privileged administration remain later screens. Desktop English/Spanish Light/Dark follow the existing design delivery; existing mobile pages stay unchanged.

## Reference lock and decision ledger

Primary target: the accepted AIHarder identity and public/auth design tokens. Keep Krona One wordmark, Geist body, navy/blue, 8px controls and the selected subtle gradient/border/shadow on primary actions. Use a compact horizontal private header, not public How it works/FAQ navigation or a large dashboard sidebar. Home, AI apps and Settings are the three proposed destinations; Help stays contextual with a Support footer entry.

| Decision | Bounded source | Reason / rejected alternatives |
| --- | --- | --- |
| One current setup task with visible next steps | [Metaview setup](https://refero.design/pages/2caa9aa9-e38f-4210-b5f7-3a50668133e8), inspected in full | Help the new participant orient without drawing every setup screen. Reject its interview questionnaire and extra calls. |
| Clear account and app connection sections | [Linear connected accounts](https://refero.design/pages/6faefb43-55c6-4c99-a36c-19b02bbea27c), inspected in full | Separate AimHarder identity from AI-client authorization. Reject its large settings sidebar, reviews toggle and unrelated services. |
| Flat surfaces and restrained supporting copy | Previously inspected Linear style `554b801c-3b31-4086-a7e5-ae613cdd618b`; accepted AIHarder tokens remain primary | No charts, counters, decorative cards or new palette. |
| Compact private navigation | Owner's “participant area” clarification and product-experience brief | The product has a few connection/settings destinations, not a sporting dashboard. |
| First question is an invitation to try, not a tracked completed step | Accepted product brief and #95 | No invented query-success telemetry or automatic completion claim. |

Two states are compared within the same Home route using review controls, not alternative visual directions. The initial state shows the next AimHarder action and the later app/query steps. The returning state shows fictional AimHarder connection and independently authorized ChatGPT/Hermes installations, plus a copyable first question. The source contract in `hosted/src/connections.ts` supplies client identity/name and current authorization; no invented last-used timestamps or provider health are shown. Connection status and client authorization remain distinct. A saved-configuration-only signal must not be called verified Connected in production.

The self-service onboarding requirement in `docs/adr/2026-10-28-self-service-invited-onboarding.md` supersedes current operator-preparation instructions. This design must not require an administrator to prepare ordinary participant configuration. Client setup mechanisms and provider acceptance are separate engineering work. Time-zone controls, private sporting history, booking forms, statistics, role editors and participant administration are excluded from this Home.

## HTML prototype and state inventory

[First visit](private-home-study.html?lang=en&theme=light&state=new) · [Returning](private-home-study.html?lang=en&theme=light&state=connected) · [Spanish Dark](private-home-study.html?lang=es&theme=dark&state=connected).

The existing static server serves this route. The design is self-contained; Login continues to demonstrate sign-in locally and does not claim a real authenticated transition to this fictional account.

- `state=new`: one highlighted setup step and current AimHarder action; AI-app and first-question steps are future orientation, not verified completion.
- `state=connected`: fictional AimHarder connection plus separately authorized ChatGPT and Hermes installations. Labels are fictional display names, not measured usage or provider-health signals.
- The first-question copy button writes only that public sample question to the clipboard and reports Copied; failure asks the visitor to select the text. Copying is not query execution and marks nothing completed.
- The compact header proposes Home, AI apps and Settings; the user menu has Account settings, Support and Sign out. Future-screen buttons open clearly labeled design-preview notices. They do not change credentials, grant/revoke access, sign out a real user or draw those subsequent pages.
- All links to Home/Privacy retain locale and appearance. The review state selector, language changes and Light/Dark/System control preserve the selected fictional state.
- The AimHarder brand artwork stays unchanged. In Dark it sits on a small white base to keep the original colored lettering readable. The AIHarder logo retains the accepted reversed silhouette.
- The prototype has no input fields, active session, account lookup, product API requests, persistent state or live account data. Static translations and image/font/icon assets are served locally.

## Verification

[Browser checks](private-home-checks.json) record switching both states; connected versus authorized labels; public-question copy feedback; local future-screen notice; account-menu open/Escape; focus returned to its summary after closing a menu-triggered dialog; actual EN→ES language change; and Light→Dark→System while preserving the state. English console inspection returned no captured errors. Spanish first-entry/returning layouts were checked at 1030px with no horizontal overflow; the temporary viewport override was reset. The normal desktop renders were inspected in English Light and Spanish Dark. No new mobile design or real-device acceptance is claimed.

[First visit EN](previews/private-home/new-en-light.jpg) · [Returning EN](previews/private-home/connected-en-light.jpg) · [First visit ES Dark](previews/private-home/new-es-dark.jpg) · [Returning ES Dark](previews/private-home/connected-es-dark.jpg).

JavaScript syntax, local resource/documentation links and asset hashes are verified separately. Production runtime tests are not rerun for static-only files; backend/authentication, API contracts and ADR decisions are unaffected. AI-app setup, AimHarder credential entry, detailed settings, configurable action-confirmation policy under PR #121 and privileged administration are not implemented by this study.

## Pen synchronization blocker

The in-chat Pen editor could not be kept open or queried during this checkpoint. Three `open_editor` attempts reported an opened view, but each follow-up state/execute request either timed out or reported that no editor was open. No design mutation was attempted after a successful connection because there was no such connection. The existing `design/ahmcp.pen` remains unchanged. There are no new native frames or native proof exports, and no clean native-layout claim. Synchronizing the two participant Home states in English/Spanish Light/Dark remains pending editor availability. Do not treat the HTML screenshots as native Pen output or silently use the desktop editor for an in-chat document.
