# AIHarder — compact participant frame and first-entry wizard

Date: 2026-11-03. Supersedes the initial private Home proposal, which the owner rejected. The owner wants a small centered container without a site header/menu, minimal copy, two connection steps and a third optional introduction to confirmation settings. The frame should remain useful after setup. The example of three tabs is exploratory, not an accepted requirement.

## Reference lock before implementation

Keep AIHarder's accepted identity, Geist/Krona, navy/blue, existing control radii and subtle button shadow. Remove the full-width private header, Home/AI apps/Settings menu, welcome-dashboard grid and the sentence “Once connected, ask about classes, workouts and records in your AI app”. Do not add another training-query step. Public/auth screens remain unchanged.

Compare only two compact structures using identical three-section content on the same HTML route:

| Direction | Bounded source | Behavior |
| --- | --- | --- |
| A — expandable sections (default proposal) | [Doppler setup](https://refero.design/pages/31dc94e6-e46a-4c25-b6e3-f3a3fc427963), full description/layout inspected | One current section expands during setup. Afterwards the same three rows become a compact editable account summary. Reject sidebar, metrics, trial upsells, percentages and external palette. |
| B — section tabs (comparison) | [B150 preferences](https://refero.design/pages/4eab96f4-fe7f-4b08-b313-16a1796e8dcd), full description/layout inspected | Three in-container tabs represent both wizard steps and later account sections. Reject global header, search, notifications and unrelated settings. |

The accepted AIHarder design is the primary visual source; references contribute structure only. The prior Metaview/Linear research remains useful for a current task and separate account/app identities, but its earlier spacious header/dashboard composition is rejected. No new bitmap artwork or icon family is needed. The compact frame, not a complete new portal, is the question being tested.

## Confirmation policy source

[PR #121](https://github.com/rudeayelo/aimharder-mcp/pull/121) was read fresh on 2026-11-03 and is merged. Its final two-switch scope and the main-branch ADR `docs/adr/2026-10-30-account-write-confirmation-preference.md` specify independent account preferences, shared by all MCP clients, both on by default:

- Ask for confirmation when making a reservation.
- Ask for confirmation when posting a new workout.

Cancellation, late-credit-loss and activity-deletion confirmations remain mandatory. Client-owned approval prompts remain independent. The UI must not introduce a global bypass, per-app preferences or imply that switching either setting enables role-restricted actions. This checkpoint changes no live preference or backend policy.

## Prototype boundary

Connection entry is fictional presentation, not a credential-collection or authorization implementation. Credential-shaped fields are static examples, not editable inputs. Buttons simulate the two connections and navigation between the three sections. The third section uses local native switches; finishing switches the same frame into its after-setup state. No actual account, OAuth grant, preference, session or email is changed. Detailed provider setup remains later work. Comparison and restart controls sit outside the product frame.

## Current scope and behavior

The existing `private-home-study.html` route now hosts this comparison. Earlier spacious Home/header code is superseded; prior screenshots/checks remain historical evidence, not the current design. `layout=sections|tabs` compares A/B; `step=1|2|3` opens a fictional wizard stage; `state=connected` previews after setup. Both layouts use the same 640px frame and content. Step 3 is a preference introduction, not a third service connection or a training query.

- Stage 1 presents a fictional AimHarder username/password specimen. No real credential input or submission exists. Connect shows a 500ms local loading state and advances.
- Stage 2 selects ChatGPT, Hermes or Other clients. Connect app simulates authorization for the selected example; it does not substitute for provider-specific guides, callbacks or actual consent. Those mechanisms remain later work.
- Stage 3 contains exactly the two independent native switches from the merged policy, both initially on. Either can change without changing the other. Finish setup accepts unchanged defaults as well as edited choices.
- Finishing A collapses the same three sections into a compact account summary. They remain expandable. B keeps the same tabs and current content. Saving preferences only shows a local preview status. No preferences are persisted across reloads or sent to a backend.
- The two proposal selectors, restart and after-setup controls live outside the product frame. They do not appear as product navigation. There is no full-width header, private menu, first-query prompt or rejected reassurance sentence.
- Language and appearance controls are small in-frame identity utilities. HTML remains English/Spanish and supports Light/Dark/System. Layout, wizard stage and preview mode survive query-based language/appearance navigation; local unsaved preference edits intentionally do not survive page reload.

## Native comparison

The in-chat editor became available again on 2026-11-03. Four editable **English desktop** proposal frames were added to `design/ahmcp.pen`, each 1440×1000 with a 640px participant frame:

| Proposal | Light | Dark |
| --- | --- | --- |
| A — expandable sections, initial stage | `M3U1LB` | `Vqh6E` |
| B — tabs, initial stage | `fUXQE` | `RrsWw` |

[Native A Light](previews/private-frame/pen/M3U1LB.png) · [A Dark](previews/private-frame/pen/Vqh6E.png) · [B Light](previews/private-frame/pen/fUXQE.png) · [B Dark](previews/private-frame/pen/RrsWw.png).

All 34 existing root trees were compared unchanged through the editor. Root placeholder flags are cleared. Text, fields, controls and Lucide icons are editable; the AIHarder identity and primary actions reuse existing components. Heading weight was corrected to 700 in HTML/native before the final export. The ongoing layout choice is deliberately not propagated into Spanish/mobile native pages or every dynamic stage; HTML owns those interactive states during exploration. Earlier nested-bounds diagnostics remain unresolved; this checkpoint claims inspected renders, not a new clean structural-visitor or pixel-identical pass.

## Verification

[Browser checks](private-frame-checks.json) record the two connection simulations, disabled loading state, exact two-switch labels/defaults, an independent booking-off/publication-on case, local save feedback, post-setup section reuse, and keyboard tab navigation with valid ARIA panel targets. An initial inactive-tab target omission was corrected before these checks; each tab now controls an existing panel. The finish action returns focus to the frame heading. Review after-setup navigation clears stale save feedback.

English Light and Spanish Dark were inspected. At the supplied 1030px desktop review width the frame stays 640px with no horizontal overflow; the temporary viewport override was reset. System mode and Privacy links retain locale, layout and preview state. No captured English console errors remained. Credential input count is zero and the rejected copy/header are absent.

[Browser A](previews/private-frame/sections-first-en-light.jpg) · [Browser B](previews/private-frame/tabs-first-en-light.jpg) · [After setup](previews/private-frame/sections-after-en-light.jpg) · [Confirmations ES Dark](previews/private-frame/confirmations-es-dark.jpg).

Relevant JavaScript syntax and local links are checked. Runtime/package/hosted test suites are not rerun for this static design checkpoint. Backend/API/authentication/security/role and deployment decisions remain unchanged; no new ADR is needed for provisional visual alternatives within #95. Actual account linking, OAuth authorization, configuration persistence, per-installation management, physical-device acceptance and owner layout approval remain separate. This prototype does not claim a finished post-onboarding settings implementation.

## Review outcome

Spec review of `545016e...eb5b10b` reported no actionable findings. Standards review identified keyboard focus loss when collapsing a completed section after its DOM was replaced. The correction renders first and explicitly refocuses the clicked section header, including when all panels are closed; browser read-back confirmed `section-0` retained focus with `aria-expanded=false`. Standards review recognized the correction as closing the finding and reported no further material issues. These reviews do not select either layout for the owner or establish real connection/preference behavior.
