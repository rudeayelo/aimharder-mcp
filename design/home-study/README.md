# AimHarder Connect — public home structure

Date: 2026-10-30. Status: first information-architecture and content proposal for owner review under #95. The owner selected **AimHarder Connect** as the working product name and **Krona One** for the wordmark. `aimharder-mcp` remains the technical npm package. AIHarder is a retained naming alternative, not the current build target.

The owner additionally requires English/Spanish presentation, a simple text language selector without flags, and Light/Dark/System appearance. Confirmation steps are not a home-page selling point; the later settings design must follow PR #121.

This checkpoint proposes the structure of one public home page. It does not draw the remaining screens, adopt final copy/navigation, implement a page, activate support or deploy anything. The existing editable design handoff remains `design/ahmcp.pen` when the visual home experiment is produced.

## Goal and product boundary

Help an invited gym member answer three questions: what can I do from my AI chat, how do I connect my own AimHarder account, and how do I enter? The intended main action is **Sign in**. Invitation links remain the entry path for new participants; the public site does not introduce open registration or a waiting list.

Accepted requirements and implementation limits are in [Product experience design](../../docs/product-experience.md), [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95), [#103](https://github.com/rudeayelo/aimharder-mcp/issues/103), the [self-service requirement](../../docs/adr/2026-10-28-self-service-invited-onboarding.md) and the [identity/custody decision](../../docs/adr/2026-10-15-hosted-identity-and-credential-custody.md). The owner's later working-name instruction supersedes the earlier AimHarder MCP presentation-name requirement in those tracker briefs; it does not rename technical identifiers or change access policy.

## Proposed page order

| Block | Visitor question | Proposed content and behavior |
| --- | --- | --- |
| 1. Header | Where am I, and how do I enter? | AimHarder [kettle] CONNECT wordmark; How it works and FAQ anchors; a simple English / Español language selector; an appearance selector with Light / Dark / System; Sign in. Utility controls remain subordinate to the access action. Keep GitHub in the footer. |
| 2. Hero + conversation | What does it do for me? | Proposed headline: **Your AimHarder training, in your AI chat.** Supporting line: **Check classes, see your workouts and review your activity using the AimHarder account you already have.** One labeled illustrative conversation shows the benefit. Sign in is primary; See how it works scrolls to setup. Small access note: **Invitation-only pilot.** |
| 3. Useful things to ask | Does this cover my actual needs? | Three concise prompt-led examples: classes/bookings; workouts and prescribed weights; personal activity and records. Prefer three clear rows or a simple prompt selector, not a large feature-card catalogue. Booking and activity actions may be illustrated without highlighting confirmation mechanics. Align any action example with the effective policy in PR #121. |
| 4. Three setup steps | What will I need to do? | **Connect AimHarder → Connect your AI chat → Ask your first question.** Portal access/invitation precedes these tasks. Start with the accepted prompt: **What classes can I book tomorrow?** Client-specific instructions belong after sign-in, not all at once on the public home page. |
| 5. Short FAQ | Can I use it, and do I trust it? | Invitation-only access; client requirements; how account access/data are handled; independent disconnect controls; independent-project status. Confirmation preferences belong in connection settings, not in the home-page pitch. Short expandable answers with contextual next actions. |
| 6. Closing action + footer | What next? | Repeat Sign in with the access note. Project GitHub, privacy information and independent-project disclosure. Contact support uses the accepted target only after its inbox is activated and tested. No unrelated sitemap or second acquisition funnel. |

### Illustrative conversation and prompts

The hero demonstrates one complete, concise read request rather than a montage of tools. Suggested request: **What is tomorrow's workout?** A fictional response can describe one explicitly fictional workout; it must be labeled **Illustrative example** beside the conversation. Do not use real participant data, exact current class availability or a simulated live chat input. The home page explains the connection, while conversations take place in the participant's AI client.

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
- The current neutral mascot raster has a white background and is not a finished dark-mode asset. Prepare a transparent runtime/static equivalent for the visual experiment; do not use a white image tile, global inversion or blending that changes the eyes/body colors. Asset export and dark-theme visual acceptance remain pending.
- Avoid a flash of the wrong theme on load. Preserve focus, reading position and the current page when a preference changes; do not reload into an unrelated page.

### Initial bilingual copy candidates

| English | Spanish |
| --- | --- |
| Your AimHarder training, in your AI chat. | Tu entrenamiento de AimHarder, en tu chat de IA. |
| Sign in | Iniciar sesión |
| How it works | Cómo funciona |
| See how it works | Ver cómo funciona |
| FAQ | Preguntas frecuentes |
| Invitation-only pilot. | Piloto por invitación. |
| Connect AimHarder | Conecta AimHarder |
| Connect your AI chat | Conecta tu chat de IA |
| Ask your first question | Haz tu primera pregunta |
| Illustrative example | Ejemplo ilustrativo |

These are draft UI translations for the first home experiment, not a new language rule for upstream content or finalized copy.

## Reference lock and research

Research refreshed on 2026-10-30 using the Refero design skill: three style searches (approachable conversation-led AI products, restrained white product marketing, and fitness product demonstration) and three full style records. These are archived design descriptions, not evidence of current product compatibility or a live service.

Primary visual foundation: the existing [white/blue foundations](../README.md) and [selected wordmark](../identity/connect-study/README.md). Keep the established blue prefix, navy lettering and white surfaces in Light mode, with readable semantic counterparts in Dark mode and orange eyes in both. Krona One is for the logo; product/body text stays with the provisional readable UI family. The mascot has the previously agreed limited role near the logo and occasional incidental placement. Do not add new emotes, a giant mascot hero, lifestyle imagery or a sporting dashboard.

| Reference | Bounded contribution | Excluded |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com), `c14c0a94-1037-449e-bf5b-4cb972656ac7` | White canvas, readable hierarchy, quiet separators and subordinate navigation; remains the structural foundation. | Its black action color, component grid and full navigation catalogue. |
| [Reclaim](https://reclaim.ai), `9bdb7d7f-7c20-4672-bf61-ef781750915e` | Benefit copy beside a contained product demonstration; adapt this as a labeled conversation example. | Violet/green palette, calendar UI, statistics, testimonials and implied product evidence. |
| [Foodnoms](https://foodnoms.com), `4c7e1e62-5c2d-4874-9640-ccbf7d88b5e8` | Explain a consumer utility through concrete product use. | Phone mockups implying a native app, its green/orange palette, charts and nutrition content. |
| [Earlier bounded screen research](../../docs/research/2026-10-28-product-experience-references.md) | Metaview's task orientation, Cal/Mamitsu's scoped client choice and Family's short FAQs. | Those products' branding, onboarding details and unverified compatibility promises. |

Preference-pattern research added on 2026-10-30: a style search plus language/appearance screen searches. Full archived records were read for [Klarna language selection](https://refero.design/pages/101766c2-4348-4476-a224-64987084643c), borrowing named languages and explicit selection only, and [B150 theme selection](https://refero.design/pages/1c4fd50d-3723-47c8-a7e7-85eec181b951), borrowing the three distinct Light/Dark/System options only. Do not import their settings-page layouts, onboarding gate, colors, illustration, inferred persistence or extra language inventory. The owner's requirements determine the simple header controls; persistence/default behavior above is a proposal, not observed behavior of those references.

### Decision ledger

| Decision | Source | Reason |
| --- | --- | --- |
| Working name AimHarder Connect, technical package unchanged | Owner, 2026-10-30 | Separate consumer value from implementation terminology. |
| Sign in primary; invitation-only note nearby | Accepted public-page brief / #95 | Match the actual admission policy without creating a second entry funnel. |
| Conversation first, capabilities as prompts | Accepted example-question requirement + bounded demonstration references | Explain value to a nontechnical participant without a tool list. |
| Three setup tasks | Accepted self-service requirement | Explain the intended journey without promising all pending engineering is complete. |
| FAQ + independent disclosure | Accepted help, privacy and independence requirements | Address real access/trust questions concisely. |
| English/Spanish, no flags | Owner, 2026-10-30 | Provide a simple language choice across the public home. |
| Light/Dark/System | Owner, 2026-10-30; bounded preference patterns | Support explicit appearance and system-following without introducing another brand direction. |
| Confirmation preferences in settings, not the home pitch | Owner + inspected PR #121 | Match the two independent account policies without making a global promise. |
| No additional screens or new motion tests | Owner's staged review and latest steering | Settle this one page before expanding scope. |

## Responsive and next-stage criteria

Desktop proposal: a concise message/action column beside the conversation. Mobile: logo/navigation, headline and access action first, then the example and remaining sections in reading order. Keep the same content hierarchy; avoid a carousel required to discover capabilities. A static poster is the baseline for the logo; if existing motion is later integrated, honor reduced motion and render only as needed.

This is a content/structure proposal, not a rendered wireframe. The next deliverable is one desktop/mobile visual home experiment in the selected brand direction, with explicit illustrative data, real font files and existing mascot assets. Validate text, media, focus, contrast, spacing and clipping in both languages and both effective palettes. Verify saved preferences, System tracking, no initial theme flash, keyboard controls and mobile layout, including the translated control labels. Dark logo/poster assets must be checked before accepting that view. Final copy, layout, responsive dimensions, page links and production implementation remain pending. No new architecture/security/distribution ADR is warranted for this proposal; existing access, custody, action and validation decisions remain unchanged.
