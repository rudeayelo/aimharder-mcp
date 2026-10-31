# AIHarder — public home study

Additional graphic experiment: the [kettle-led hero study](graphic-hero-study.md) uses the agreed “Focus more on training, less on tapping” headline and an [animated 3D prototype](hero-motion-prototype.html). The current HTML trial uses a faster reaction, half-length thinking, right-aligned compact bubbles, rapid typed replies and a small hop/dance during writing. The pen contains the previous larger translucent reply and stronger shadow; the latest compact stack is still pending there because the editor did not answer; the six other home variants and older HTML prototype remain at their previous checkpoint.

**Active refinement:** the working name is now **AIHarder**. Only the English desktop Light/Dark frames are being refined; Spanish/mobile variants and the HTML prototype remain at the previous checkpoint until agreement. The [desktop refinement](desktop-refinement.md) is the current review target. Button A is selected; the latest candidate uses a 25% larger logo, a bold headline and attenuated Works with logos. This later scope supersedes the earlier all-variant iteration below.

Updated: 2026-10-31. Status: revised editable public-home design for owner review under #95, following the structure proposal below. The owner selected **AimHarder Connect** as the working product name and **Krona One** for the wordmark. `aimharder-mcp` remains the technical npm package. AIHarder is a retained naming alternative, not the current build target.

The owner additionally requires English/Spanish presentation, a simple text language selector without flags, Light/Dark/System appearance and **Lucide icons exclusively**. Confirmation steps are not a home-page selling point; the later settings design must follow PR #121.

This checkpoint contains one public home-page design in [design/ahmcp.pen](../ahmcp.pen), with desktop/mobile, English/Spanish and light/dark representations. It does not draw other product screens, adopt final copy/navigation, implement a production page, activate support or deploy anything. The structure below records the design rationale and later corrections, with explicit artifact boundaries.

## Latest owner-directed revision

The following records the earlier eight-page synchronization. The narrower AIHarder desktop revision above is current for `uAXkc` and `p7u8w`; do not treat the other six variants or HTML prototype as updated to that refinement.

The current design source is [ahmcp.pen](../ahmcp.pen). A [functional home prototype](home-prototype.html) demonstrates the animation timing and is also [available through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/home-prototype.html?lang=es&theme=system). This is one directed revision of the selected home, not a new set of competing visual directions or additional product screens. The question is whether the simpler animated conversation and illustrated setup make the page clearer and livelier.

Changes requested by the owner:

- One shared 1200px content container: header/logo and rightmost action align with the rest of the page at desktop widths. Narrow layouts use the same shared gutters.
- Wordmark enlarged 25%: desktop Krona One 14 → 17.5px, mobile 12 → 15px; kettle and spacing scale accordingly.
- Invitation-only copy appears only in the access FAQ. The hero, setup introduction and closing action no longer repeat it.
- Simpler conversation without its old heading, example badge or context slogan. A read-only text composer has Lucide plus and send-arrow affordances. Four local fictional examples type, send, then show a response: workout, classes, next booking and recorded activity. Pause and direct example selection are available; reduced motion starts with a complete static answer. The home is not a real AI chat.
- A separate strip identifies ChatGPT, Claude, Hermes, OpenClaw and Pi. Setup illustrations show AimHarder with pseudo fields, AI-app selection, and a first useful class-list answer. No new mascot animation or dynamic background was added.
- Latest preference correction: appearance is a single icon button cycling **System → Light → Dark → System**, using Lucide monitor/sun/moon. Its localized accessible label and tooltip state the current and next modes. Language remains a simple text selector without flags.

**Canvas sync completed on 2026-10-31:** the editor responded on retry. All eight existing home frames now contain the correction, including enlarged shared wordmark, aligned header, simplified composer/conversation, graphical setup steps, app strip and cycling-theme icon. The existing preference board now shows monitor/sun/moon cycle states instead of appearance menus. New board `OWSCj` contains typing/sent/answer states, timing notes and all four English/Spanish examples. The source was edited through the pen.dev API and saved by the editor; the `.pen` JSON was not changed with a filesystem script. Earlier editor failures remain historical context, not a current blocker. The canvas depicts editable states; actual playback remains in the separate prototype.

Run locally with `python3 -m http.server 8946 --bind 127.0.0.1 --directory design`, then open `/home-study/home-prototype.html`. The existing scoped `/aimharder-home-95` Tailscale route exposes only this design server. No production application, authentication, account data or backend connection is involved. Sign-in/privacy controls show explicit prototype notices. Locale/theme choices live in the URL for review; production preference persistence remains pending.

[Current desktop capture](previews/home-revision-desktop-es-light.png) · [Current mobile Dark capture](previews/home-revision-mobile-es-dark.png) · [Overview](previews/home-revision-overview.png) · [Browser checks](revision-checks.json) · [Asset sources and MCP claim boundary](assets/README.md).

## Current canvas and previews

The saved canvas contains the original foundation boards plus these updated home frames and state boards. Locale variants use literal localized text for reliable canvas rendering; themed variables carry semantic palette roles. Components reuse the existing primary-action component and a new shared Krona One wordmark. [copy.json](copy.json) supplies both languages and the full FAQ answer inventory.

| Frame | Width | Locale / appearance | Render |
| --- | --- | --- | --- |
| `uAXkc` | 1440 | English / Light | [PNG](previews/uAXkc.png) |
| `p7u8w` | 1440 | English / Dark | [PNG](previews/p7u8w.png) |
| `uzAUz` | 1440 | Spanish / Light | [PNG](previews/uzAUz.png) |
| `Qg3nb` | 1440 | Spanish / Dark | [PNG](previews/Qg3nb.png) |
| `T37OLV` | 390 | English / Light | [PNG](previews/T37OLV.png) |
| `qJZFz` | 390 | English / Dark | [PNG](previews/qJZFz.png) |
| `bMKmj` | 390 | Spanish / Light | [PNG](previews/bMKmj.png) |
| `PuPqO` | 390 | Spanish / Dark | [PNG](previews/PuPqO.png) |
| `idH0v` | 1440 | Language, cycling appearance icons, expanded FAQ and keyboard-focus states | [PNG](previews/idH0v.png) |
| `OWSCj` | 1440 | Conversation motion states and four bilingual examples | [PNG](previews/OWSCj.png) |

[Desktop Light through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/previews/uAXkc.png) · [Desktop Dark through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/previews/p7u8w.png) · [Spanish mobile Dark through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/previews/PuPqO.png). The scoped tailnet route proxies a local static server on localhost:8946 rooted at `design/`; the server must remain running. This is artifact delivery, not service deployment.

## Goal and product boundary

Help an invited gym member answer three questions: what can I do from my AI chat, how do I connect my own AimHarder account, and how do I enter? The intended main action is **Sign in**. Invitation links remain the entry path for new participants; the public site does not introduce open registration or a waiting list.

Accepted requirements and implementation limits are in [Product experience design](../../docs/product-experience.md), [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95), [#103](https://github.com/rudeayelo/aimharder-mcp/issues/103), the [self-service requirement](../../docs/adr/2026-10-28-self-service-invited-onboarding.md) and the [identity/custody decision](../../docs/adr/2026-10-15-hosted-identity-and-credential-custody.md). The owner's later working-name instruction supersedes the earlier AimHarder MCP presentation-name requirement in those tracker briefs; it does not rename technical identifiers or change access policy.

## Proposed page order

| Block | Visitor question | Proposed content and behavior |
| --- | --- | --- |
| 1. Header | Where am I, and how do I enter? | AimHarder [kettle] CONNECT wordmark; How it works and FAQ anchors; a simple English / Español language selector; a single Lucide monitor/sun/moon button cycling System / Light / Dark; Sign in. Utility controls remain subordinate to the access action. Keep GitHub in the footer. |
| 2. Hero + conversation | What does it do for me? | Proposed headline: **Your AimHarder training, in your AI chat.** Supporting line: **Check classes, see your workouts and review your activity using the AimHarder account you already have.** A simplified animated conversation shows four fictional examples with a composer, pause control and example selection. Sign in is primary; See how it works scrolls to setup. Access policy appears only in the FAQ. |
| 3. MCP app strip | Where can I use it? | Product symbols and names for ChatGPT, Claude, Hermes, OpenClaw and Pi; ecosystem relevance, not a verified-partner claim. |
| 4. Useful things to ask | Does this cover my actual needs? | Three concise prompt-led examples: classes/bookings; workouts and prescribed weights; personal activity and records. Prefer three clear rows or a simple prompt selector, not a large feature-card catalogue. Booking and activity actions may be illustrated without highlighting confirmation mechanics. Align any action example with the effective policy in PR #121. |
| 5. Three setup steps | What will I need to do? | **Connect AimHarder → Connect your AI chat → Ask your first question.** Portal access/invitation precedes these tasks. Start with the accepted prompt: **What classes can I book tomorrow?** Client-specific instructions belong after sign-in, not all at once on the public home page. |
| 6. Short FAQ | Can I use it, and do I trust it? | Invitation-only access; client requirements; how account access/data are handled; independent disconnect controls; independent-project status. Confirmation preferences belong in connection settings, not in the home-page pitch. Short expandable answers with contextual next actions. |
| 7. Closing action + footer | What next? | Repeat Sign in without repeating the access policy. Project GitHub, privacy information and independent-project disclosure. Contact support uses the accepted target only after its inbox is activated and tested. No unrelated sitemap or second acquisition funnel. |

### Illustrative conversation and prompts

The current hero cycles four authored, fictional read-only conversations from [demo-examples.json](demo-examples.json). It starts typing in the composer, moves the sent question above, then reveals the answer underneath. A fixed conversation region prevents the rest of the page jumping between examples. The compact composer is presentational and read-only; questions are asked in the participant's AI app. The old visible example labels were removed at the owner's request. The review footer and screen-reader description identify the synthetic demo; no real availability, bookings or participant records are fetched.

Supporting prompt candidates:

- Classes/bookings: **What classes can I book tomorrow?** A response must distinguish listed sessions/occupancy from verified booking eligibility. Do not promise a place based only on capacity.
- Workouts/weights: **What is tomorrow's workout, and what weights should I use?** Ground weight examples in source prescriptions and available own records/calculation support; do not present an unrestricted coaching service.
- Activity/records: **Show my activity from this week.** Avoid turning recorded entries into verified physical attendance or training-session counts.

A compact action illustration may use **Book the 19:00 class**, with an explicitly fictional result consistent with the effective policy. Do not make a confirmation dialog the centerpiece or promise either universal confirmation or universal one-step execution. The public story is the useful result; policy controls are explained in settings. Capability illustrations do not establish complete current real-client/pilot acceptance.

### FAQ content constraints

- **How do I get access?** The pilot is invitation-only; invitees start from their invitation email, returning participants sign in. No public sign-up or waitlist action.
- **Which AI chats can I connect?** Present the initial ChatGPT and Hermes guide paths, plus Other clients with explicit compatibility requirements. State the prerequisites actually verified for the chosen client when writing the final copy; do not promise arbitrary client/plan/mobile support.
- **What happens to my AimHarder details?** The hosted service stores recoverable encrypted AimHarder credentials for authentication. It can decrypt them for that purpose; they must not go into the AI conversation. Never claim zero credential storage or end-to-end encryption. Full policy wording belongs in the privacy destination, not a technical diagram in the hero.
- **Can I disconnect access?** Each AI-client connection can be disconnected independently. Disconnecting AimHarder and deleting the portal account are separate actions. Keep action-policy preferences out of this public-page explanation.
- **Is this an official AimHarder product?** Preserve the independent-project disclosure. The working name/logo does not imply endorsement or official affiliation.

## Confirmation-policy integration — PR #121

Read-only integration reference: [PR #121](https://github.com/rudeayelo/aimharder-mcp/pull/121), **open** when inspected on 2026-10-30 at `3a4cb3d36eb5bc5b9f2fb00fc5a8c1ec253b29d5`. Scope was checked against its [confirmation contract](https://github.com/rudeayelo/aimharder-mcp/blob/3a4cb3d36eb5bc5b9f2fb00fc5a8c1ec253b29d5/docs/write-confirmations.md), [ADR](https://github.com/rudeayelo/aimharder-mcp/blob/3a4cb3d36eb5bc5b9f2fb00fc5a8c1ec253b29d5/docs/adr/2026-10-30-account-write-confirmation-preference.md) and actual connection-settings labels. This design work does not merge, implement or deploy that PR; recheck its final merged contract before implementation.

The later AimHarder connection-settings design must accommodate **two independent switches**, both on by default, a shared Save settings action and the account-wide/all-clients scope:

| English label from PR | Spanish copy candidate | Scope |
| --- | --- | --- |
| Ask for confirmation when making a reservation | Solicitar confirmación al hacer una reserva | Booking creation only. |
| Ask for confirmation when posting a new workout | Solicitar confirmación al publicar un entrenamiento | Own activity/workout-result publication only. |

Do not draw a global confirmation-off switch. Cancellation, late credit-loss cancellation and activity deletion keep their mandatory confirmation rules; client-owned approval prompts remain independent. Turning off one creation/publication switch applies only to an explicit request for that action. These contract details belong in the settings/engineering handoff, not the hero or a prominent marketing FAQ. Preserve current role/access rules and saved/default/unsaved states when that settings screen is designed. No settings screen is drawn at this checkpoint.

## Language and appearance requirements

### Language

- Provide complete **English and Spanish** home-page content, including navigation, actions, examples, FAQ, privacy/access notes, alternative text and accessible control names. Keep project documentation in English; localized UI strings are the explicit owner-requested exception. Brand names and technical identifiers stay unchanged.
- Use one small text selector with **English** and **Español** written in their own languages. No flags or country selection. Show the current language and a clear selected state; support keyboard operation and adequate touch targets.
- Proposed behavior: honor a saved explicit choice; otherwise use the browser's supported language, falling back to English. Remember the choice in the browser and preserve it across public navigation and the eventual portal entry. Do not infer locale from gym, country or time zone. Routing/storage implementation is not selected here.
- Translate service-authored UI and illustrative copy. Do not silently rewrite source workout prescriptions, proper names, user data or public configuration values. Check line length and wrapping independently in both locales.

### Appearance

- Offer explicit **Light**, **Dark** and **System** choices; Spanish labels are **Claro**, **Oscuro** and **Sistema**. Default proposal: **System**. Keep System visibly selected even when the effective palette is light or dark.
- System follows operating-system changes while active; a saved Light/Dark choice overrides it. Remember appearance independently of language. These are local presentation preferences, separate from account-wide action-policy switches.
- Place language and appearance as secondary header utilities. On narrow screens, keep Sign in prominent and make utilities available in a compact navigation area without a full-screen preferences flow. Never require a visitor to configure them before reading or signing in.
- Dark mode uses semantic surface/text/action/focus tokens, preserving the blue brand and orange-eye roles. Adapt navy HARDER/CONNECT lettering to a readable light neutral rather than leaving navy on a dark background. Contrast and component states need separate checks in both palettes.
- The earlier neutral master has a white background. This design instead uses [a transparent neutral PNG](assets/kettle-neutral.png), rendered from the existing hybrid 32k Gaussian body and curved eye rig by [render-mascot.html](render-mascot.html). No new AI character/image generation, global inversion or blending is used. This is a static candidate; final asset/appearance acceptance remains with the owner.
- Avoid a flash of the wrong theme on load. Preserve focus, reading position and the current page when a preference changes; do not reload into an unrelated page.

### Initial bilingual copy candidates

| English | Spanish |
| --- | --- |
| Your AimHarder training, in your AI chat. | Tu entrenamiento de AimHarder, en tu chat de IA. |
| Sign in | Iniciar sesión |
| How it works | Cómo funciona |
| See how it works | Ver cómo funciona |
| FAQ | Preguntas frecuentes |
| Connect AimHarder | Conecta AimHarder |
| Connect your AI chat | Conecta tu chat de IA |
| Ask your first question | Haz tu primera pregunta |

These are draft UI translations for the first home experiment, not a new language rule for upstream content or finalized copy.

## Reference lock and research

Research refreshed on 2026-10-30 using the Refero design skill: three style searches (approachable conversation-led AI products, restrained white product marketing, and fitness product demonstration) and three full style records. These are archived design descriptions, not evidence of current product compatibility or a live service.

Primary visual foundation: the existing [white/blue foundations](../README.md) and [selected wordmark](../identity/connect-study/README.md). Keep the established blue prefix, navy lettering and white surfaces in Light mode, with readable semantic counterparts in Dark mode and orange eyes in both. Krona One is for the logo; product/body text stays with the provisional readable UI family. The earlier checkpoint limited the mascot to the logo and incidental placement. The owner’s later graphic-hero experiment explicitly permits a larger character here; this does not add a general mascot role to other screens, lifestyle imagery or a sporting dashboard.

| Reference | Bounded contribution | Excluded |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com), `c14c0a94-1037-449e-bf5b-4cb972656ac7` | White canvas, readable hierarchy, quiet separators and subordinate navigation; remains the structural foundation. | Its black action color, component grid and full navigation catalogue. |
| [Reclaim](https://reclaim.ai), `9bdb7d7f-7c20-4672-bf61-ef781750915e` | Benefit copy beside a contained product demonstration; adapt this as a simplified conversation demonstration, per the owner revision. | Violet/green palette, calendar UI, statistics, testimonials and implied product evidence. |
| [Foodnoms](https://foodnoms.com), `4c7e1e62-5c2d-4874-9640-ccbf7d88b5e8` | Explain a consumer utility through concrete product use. | Phone mockups implying a native app, its green/orange palette, charts and nutrition content. |
| [Earlier bounded screen research](../../docs/research/2026-10-28-product-experience-references.md) | Metaview's task orientation, Cal/Mamitsu's scoped client choice and Family's short FAQs. | Those products' branding, onboarding details and unverified compatibility promises. |

Preference-pattern research added on 2026-10-30: a style search plus language/appearance screen searches. Full archived records were read for [Klarna language selection](https://refero.design/pages/101766c2-4348-4476-a224-64987084643c), borrowing named languages and explicit selection only, and [B150 theme selection](https://refero.design/pages/1c4fd50d-3723-47c8-a7e7-85eec181b951), borrowing the three distinct Light/Dark/System options only. Do not import their settings-page layouts, onboarding gate, colors, illustration, inferred persistence or extra language inventory. The owner's requirements determine the simple header controls; persistence/default behavior above is a proposal, not observed behavior of those references.

### Decision ledger

| Decision | Source | Reason |
| --- | --- | --- |
| Working name AimHarder Connect, technical package unchanged | Owner, 2026-10-30 | Separate consumer value from implementation terminology. |
| Sign in primary; invitation-only policy in FAQ only | Owner revision, 2026-10-30 / #95 | Explain admission once without creating a second entry funnel. |
| Conversation first, capabilities as prompts | Accepted example-question requirement + bounded demonstration references | Explain value to a nontechnical participant without a tool list. |
| Three setup tasks | Accepted self-service requirement | Explain the intended journey without promising all pending engineering is complete. |
| FAQ + independent disclosure | Accepted help, privacy and independence requirements | Address real access/trust questions concisely. |
| English/Spanish, no flags | Owner, 2026-10-30 | Provide a simple language choice across the public home. |
| Light/Dark/System | Owner, 2026-10-30; bounded preference patterns | Support explicit appearance and system-following without introducing another brand direction. |
| Confirmation preferences in settings, not the home pitch | Owner + inspected PR #121 | Match the two independent account policies without making a global promise. |
| Lucide icons only | Explicit owner instruction, 2026-10-30 | Native `icon` nodes with library `lucide`; no alternative pictogram libraries. |
| No additional screens or new motion tests | Owner's staged review and latest steering | Settle this one page before expanding scope. |

## Responsive and next-stage criteria

Desktop proposal: a concise message/action column beside the conversation. Mobile: logo/navigation, headline and access action first, then the example and remaining sections in reading order. Keep the same content hierarchy; avoid a carousel required to discover capabilities. A static poster is the baseline for the logo; if existing motion is later integrated, honor reduced motion and render only as needed.

The first desktop/mobile visual home experiment was drawn and exported before the owner revision above. Final copy, optical adjustments, functional links, interaction behavior and production implementation remain pending. The mobile layout keeps language/appearance and Sign in visible in a second header row; the menu affordance is reserved for section navigation. Page variants depict **System** as the selected preference with either effective palette; the separate state board shows the three explicit icon-button states and click order.

## Historical first-canvas verification — 2026-10-30

The auxiliary sizing warnings recorded below were resolved by the 2026-10-31 update; see the current checks at the end.

- [x] Rendered and visually inspected the desktop light/dark designs and the Spanish mobile header, hero, prompts, setup, FAQ and closing action. All eight pages were exported from pen.dev, not recreated in HTML.
- [x] All eight home-page subtrees report no layout/clipping problems in the editor's bounds visitor after layout settles. No unresolved `$home-...` content strings remain. Every new icon node uses `lucide`.
- [x] Locale variants include translated navigation, action labels, demo text and FAQ questions. [copy.json](copy.json) includes all FAQ answers, including those shown collapsed in the page design. Source exercise names and technical/brand identifiers remain unchanged.
- [x] The transparent poster is RGBA, 512 × 512, with alpha spanning 0–255. Its source-model and output hashes are recorded in [visual-checks.json](visual-checks.json). The renderer uses existing local dependencies; no root package/lockfile changed.
- [x] Measured key normal-text pairings exceed 4.5:1: Light text 14.95:1, supporting text on surface 5.90:1, Light action label 5.96:1, Dark text 16.40:1, Dark supporting text on surface 8.28:1 and Dark action label 5.56:1. Full samples are in the checks file. This is a color-pair audit, not a blanket accessibility certification.
- [x] Language/appearance menus, selected System, light/dark keyboard-focus examples and expanded privacy answers were visually inspected in [the state-board export](previews/idH0v.png). Its bounds visitor still reports nested sizing/clipping warnings despite the complete exported render; this auxiliary board does not have a clean structural visitor pass. Recheck the editor's sizing diagnostics before reusing those menu groups in further screens.
- [x] Existing foundation boards and their components were retained. Name, access policy and the #121 integration boundary agree with the design notes. Existing architecture/security/distribution ADRs remain applicable; no runtime/API or protocol decision changed.
- [ ] Owner visual/copy acceptance, physical-mobile review and actual font/rendering behavior in the final application.
- [ ] Implement and test language selection/persistence, System tracking, no initial theme flash, focus/keyboard handling, FAQ expansion and working navigation. Static canvas states do not establish those behaviors.
- [ ] Implement the selected home only after review; remaining portal/settings/email screens stay outside this first home delivery. Follow PR #121's final merged policy when settings work begins.

Relevant checks for this delivery are canvas rendering, structural/icon/localization audits, artifact provenance/contrast, file/link validation and `git diff --check`. No production TypeScript changed and no MCP runtime test suite was run for this design-only addition.

## Revision verification and remaining work

The isolated prototype was inspected in Chrome at 320, 390 and 1440px in both languages and effective palettes. Recorded checks found matching header/body edges, no horizontal page overflow, five app labels and no invitation mention outside FAQ. The four examples, automatic progression, pause/resume, theme cycle, locale change, mobile menu, FAQ disclosure and prototype notices were checked in the browser. Files named `home-revision-...png` are browser captures. Node-ID-named PNGs are now regenerated from the updated pen.dev source. Reduced-motion handling and System change tracking were inspected in code; OS-preference changes and assistive-technology behavior were not exercised. Syntax, local references, source hashes and whitespace were checked. Production MCP tests are unrelated to these static design assets.

Remaining: owner review; real mobile/perceptual and accessibility acceptance; production frontend implementation and preference persistence; per-client Connect validation. Earlier static-canvas acceptance does not establish these runtime behaviors. No architecture, security, API, distribution or validation policy changed, so existing ADRs remain applicable and no new ADR is needed.

Independent review of the earlier HTML revision found **0 actionable Standards findings** and **0 actionable Spec findings**. That review correctly recorded the then-pending `.pen` synchronization; the retry has now completed it.

## Canvas synchronization checks — 2026-10-31

- The eight home pages and both state boards report **zero current layout/clipping problems** in live pen.dev bounds inspection. [pen-sync-checks.json](pen-sync-checks.json) records the actual per-frame results, dimensions, icon family, absence of unresolved text variables and absence of invitation copy outside FAQ.
- The wordmark font sizes are 17.5px desktop and 15px mobile, 25% above their previous 14px and 12px values. Desktop header/body gutters are 120px; mobile gutters are 20px. The existing page IDs and component references are retained; Spanish desktop frames moved down to prevent overlap after the new sections increased height.
- Full-resolution pen exports of the header, hero and setup, plus Spanish mobile Dark and the motion-state board, were visually inspected. Node-ID previews were regenerated for all eight pages and both state boards. Static design review does not establish production or assistive-technology acceptance.
- SVG image fills did not render reliably in the editor. Faithful PNG derivatives were rasterized from the existing vector sources with `@resvg/resvg-js` 2.6.2, without redrawing geometry or generating new brand artwork. Monochrome light/dark vector derivatives retain original path geometry; original Pi colors remain. The conversion dependency lives only in a temporary tool directory; project dependencies/lockfiles are unchanged. All 44 asset hashes and image file references were verified.
- The original foundation boards and original primary-action/input/status components match the prior commit exactly. No frontend runtime, API, security, distribution or validation-policy behavior changed; no ADR amendment is required.
