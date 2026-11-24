# Product experience design

This is the single decision record for the AIHarder user experience: what the hosted service must feel like for an invited gym member, what is kept from design iteration 1 and what the redesign in [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95) has to produce. It describes the current state. History lives in the issues and at tag [`archive/95-iteration-1`](https://github.com/rudeayelo/aimharder-mcp/tree/archive/95-iteration-1).

- Spec: [#95 — Redesign AIHarder in Figma](https://github.com/rudeayelo/aimharder-mcp/issues/95). Its Decisions section is binding; this document restates it and does not override it.
- Parent: [#103 — Deliver the remote MCP UX/UI and GitHub documentation](https://github.com/rudeayelo/aimharder-mcp/issues/103), which owns implementation tickets #106–#117.
- Design source: the new Figma file «AIHarder», per the [Figma decision](adr/2026-11-24-figma-design-source-of-truth.md). Pointer and asset locations: [design/README.md](../design/README.md).
- Name and domain: [provisional product name and domain](adr/2026-11-24-provisional-product-name-and-domain.md).

Nothing here is implemented or deployed by being written down. Implementation is #106–#117; the brand change in code is [#141](https://github.com/rudeayelo/aimharder-mcp/issues/141).

## Who it is for and the journey

The primary user is a member of the maintainer's gym who wants to use their AimHarder account from an AI chat, without learning what MCP is and without asking an operator for help. The pilot is invitation-only.

The journey to the first useful answer:

**Invitation → sign in → connect AimHarder → connect the AI client → first question.**

The first question is **What classes can I book tomorrow?** (Spanish: «¿A qué clases me puedo apuntar mañana?»). The portal suggests it but never claims it worked: an OAuth grant is not evidence that a sporting query succeeded, and the answer must tell published classes and occupancy apart from verified booking eligibility.

## Decisions

These come from the #95 spec, approved by the maintainer.

1. **Scope: invitation-only pilot, designed to be opened later.** No open registration, waiting list or sign-up flow is designed. Access-mode copy and the entry actions are isolated as a component variant, so opening the service later is a variant change, not a redesign.
2. **Order: participant journey first**, then the landing (see [Screen inventory](#screen-inventory-by-phase)).
3. **Name: AIHarder** in everything a user sees: web, emails, the hosted MCP server display name and service-authored text shown to users, OAuth consent and user documentation. `aimharder-mcp` is only the npm package and repository name. Domain `aiharder.link`, support address `support@aiharder.link`.
4. **Figma: a new file «AIHarder».** The iteration-1 file [AIHarder — Design](https://www.figma.com/design/9jDoWpeUEGTbtMoENvbzAB) is read-only.
5. **The brand is provisional and cheap to change.** The plan is to run the pilot with real users and, with good feedback, propose an agreement to AimHarder (collaboration, partnership or acquisition). If they decline, the project closes; if they accept the product but not the name, the name and domain change and the product continues separately on their API. The full rationale and reopening triggers are in the [name and domain ADR](adr/2026-11-24-provisional-product-name-and-domain.md).
6. **Logo: no new investment** beyond adapting the existing logo to the new tokens. Iterating the logo is a separate, lower-priority enhancement.
7. **Phases and reviews.** Each phase is a sub-issue of #95 with native blockers, approved by the maintainer. Landing: one approval per section plus one for the whole page. Access, portal and administration/emails: one grouped approval per block with a screenshot sheet. Where a point is open, present two variants.

### Brand seam rule

The product name, domain, support address and brand colors are defined **once**:

- **In Figma:** a brand variable collection with string variables (product name, domain, support email) and color variables (brand primary, accent). Every text layer that contains the name, domain or support email is bound to the string variables. Components reference semantic color roles, never raw hex values.
- **In code:** one brand module in the hosted service that every user-facing string reads from, with a test that fails when a user-facing surface hard-codes the name or domain ([#141](https://github.com/rudeayelo/aimharder-mcp/issues/141)).

A screen, email or document that types the name, domain, support address or a brand hex value by hand is a defect. Phase 1 proves the seam: changing the brand variables in a scratch duplicate updates every component and the logo lockup.

## Product requirements

These are accepted requirements that every screen has to respect.

### Portal scope

- The portal configures and manages the service. Sporting queries and actions happen in the AI chat: no sporting calendar, training history or booking forms in the portal.
- The portal account, the AimHarder connection and each MCP client connection (an AI client's authorization) are always shown as separate things, each with its own lifecycle (see [CONTEXT.md](../CONTEXT.md)). Disconnecting an AI client, disconnecting AimHarder and deleting the portal account are distinct actions, and each confirmation says exactly what it removes.
- A new participant sees one current task at a time with visible progress. A returning participant's Home shows the current connection state and links to settings.
- Settings group the portal account, the AimHarder connection (including the default gym when the account has several) and authorized-client management, plus the two independent confirmation preferences from the [confirmation-preference decision](adr/2026-10-30-account-write-confirmation-preference.md): **Ask for confirmation when making a reservation** and **Ask for confirmation when posting a new workout**, both on by default and shared across clients. There is no global confirmation-off switch; cancellations and deletions keep mandatory confirmation.
- Administration (invitations, participants, role availability, suspension) is visibly distinct from the participant portal but built from the same components.

### Onboarding and clients

- Onboarding is self-service after the invitation, per the [self-service onboarding decision](adr/2026-10-28-self-service-invited-onboarding.md). Routine setup never depends on an administrator registering callbacks or sending configuration.
- Client guides must be **very clear and concise**. The participant picks a client and sees only that client's instructions: prerequisites, step wording, expected outcome of each step and recovery. Initial guides: **ChatGPT**, **Hermes** and **Other clients**, the last with a copyable remote URL, the required OAuth configuration and concrete compatibility requirements, never a claim that every MCP client works. [Mamitsu's connection page](https://usemamitsu.com/connect) is the interaction reference.
- Participants may copy required public configuration between the portal and their client, including an exact callback address when the client needs one. Passwords, tokens and live authorization URLs never appear in copyable examples.
- Returning from client consent lands the participant back in the context of that connection.
- Do not mention time zones or show time-zone controls on the website, in AI-chat answers or in confirmations. The frontend uses `Europe/Madrid`; backend configuration and truthful tool metadata stay available ([hosted Madrid decision](adr/2026-10-28-hosted-frontend-madrid-time-zone.md)).
- Mobile priority: invitation acceptance, sign-in and AimHarder connection must be fully usable on a phone. A mobile-ready website does not mean every AI client can be set up from a phone.

### Support and help

- Support is a dedicated human-operated address, `support@aiharder.link`, intended to be handled in Resend Inboxes. The address is a design target: it is not configured or tested. Before activation, check the account's inbox availability and the domain's receiving setup, preserve existing mail routing, and test one inbound message and one reply ([Resend decision](adr/2026-10-18-resend-transactional-delivery.md)).
- Provider capabilities, from Resend's public documentation: the [Inboxes dashboard](https://resend.com/docs/dashboard/inboxes/introduction) receives, organizes and replies to threads, so a human-operated inbox needs no custom UI or receiving webhook here. [Creating an inbox](https://resend.com/docs/dashboard/inboxes/create-inboxes) requires a verified sending domain and either MX records or forwarding to a Resend receiving address; sending-domain verification alone does not make the address receive mail. [Pricing](https://resend.com/pricing) lists three inboxes on the free plan, counted against the transactional quota; these are published allowances, not this account's quota. No account, inbox, DNS or mail change has been made for this.
- **Contact support** opens a plain `mailto:` with no prefilled user data, configuration, credentials or diagnostic logs.
- Help is a short FAQ with concise expandable answers, each resolving one question with a next action when needed. Setup instructions stay in the client guides; recovery instructions stay next to the state they recover from. No search, ticketing or custom inbox in the portal.
- GitHub is the technical entry point for local and remote usage. The website links to it once; finishing routine onboarding never requires reading GitHub documentation.

### Language and appearance

- English and Spanish UI copy, including navigation, actions, examples, FAQ, alternative text and accessible names. A simple text selector, **English** / **Español**, with no flags or country choice. Brand names, technical identifiers, workout prescriptions and user data are not translated. Project documentation stays in English.
- **Light**, **Dark** and **System** appearance, default System, as one icon button that cycles the three. Language and appearance are secondary header utilities, never a gate before reading or signing in.
- Proposed behavior, not yet built: a saved explicit choice wins; otherwise the browser language with English fallback; preferences persist across public pages and into the portal; no flash of the wrong theme on load.

## Kept from iteration 1

The redesign is a visual redesign on a real design system, not a restart. Three things are kept.

### Landing structure and content

| # | Section | Content |
| --- | --- | --- |
| 1 | Header | Logo, section anchors, language selector, appearance button, **Sign in** (primary, compact). GitHub stays in the footer. |
| 2 | Hero | Three-line benefit headline (working copy: **Focus more on training, less on tapping.**, with the last phrase in blue), supporting line (owner-supplied: **Book classes, see your workouts and review the activity in your AimHarder account.**), **Sign in** as the primary action, and a **Works with** row of compatible-app marks (ChatGPT, Claude, Hermes, OpenClaw, Pi) at reduced emphasis. The Kettle sits beside an animated fictional conversation: a question arrives, the Kettle thinks, an answer appears. |
| 3 | Question wall | Centered title **Your classes, workouts and records, one question away**, three topic pills (Classes & bookings, Workouts & weights, Activity & records) and four rows of fictional questions drifting in alternating directions with faded edges; one question and its topic are emphasized at a time. |
| 4 | How you get started | Three steps, each with a small animated UI illustration: **Connect AimHarder → Connect your AI chat → Ask your first question.** Client-specific instructions belong after sign-in, not on the landing. |
| 5 | FAQ | Support invitation beside the heading (“Can’t find the answer you need? Drop us a line.” plus the support address) and five expandable answers: how to get access (invitation-only; the only place the landing states the access policy), which AI chats can connect, what happens to AimHarder details, disconnecting access, and whether this is an official AimHarder product. |
| 6 | Closing and footer | Repeated **Sign in**; footer with the independent-project disclosure, GitHub, Support and Privacy. |

Content constraints that carry over:

- All conversations, questions and results are fictional and labeled as a demonstration; no real availability, bookings or records are fetched.
- Credential handling copy says the service stores AimHarder credentials encrypted and can decrypt them to authenticate; never claim zero storage or end-to-end encryption, and credentials never enter the AI conversation.
- App marks show ecosystem relevance, not verified partnership or full compatibility.
- Confirmation preferences are explained in settings, not in the landing pitch; the landing promises neither universal confirmation nor universal one-step execution.
- Privacy is a separate page with a readable document column and anchored contents. Its iteration-1 copy was a draft grounded in the custody, authorization and deletion ADRs; it is not a published policy, and legal controller and retention details are still to be written.

### 3D Kettle

The Kettle is a kettlebell-shaped character: blue body, dark circular face, orange recessed eyes, no mouth or limbs. It is the product's memorable asset (the critique's main strength) and is used beside the logo, in the landing and in portal onboarding, not as a general mascot system.

- **Asset:** [kettle-body-32k.sog](../design/assets/kettle/README.md), a 32,768-Gaussian SOG body (414,243 bytes) with its provenance and licenses. Not the AI-generated videos and not the 17.8 MB source PLY.
- **Eyes:** drawn by a separate procedural rig, two deformable recesses on a fitted curved face surface, so blinks and gaze move the whole recess. The rig is rebuilt in the Kettle module with npm dependencies; the iteration-1 prototype code stays in the tag.
- **Module:** one framework-free module in [`kettle/`](../kettle/README.md) (renderer, body, eye rig, clips as data, interaction), a private package never published to npm. It is meant for the landing, the footer and portal onboarding, but none of them imports it yet: today its consumers are its local [lab](../kettle/README.md#the-lab) and the lab's tooling. The lab uses only the module's public API, so tuned values will be the production values. The renderer is the module's own ([ADR](adr/2026-11-24-kettle-own-splat-renderer.md)); its CSP needs are listed in the [module README](../kettle/README.md#content-security-policy).
- **Style direction** ([#146](https://github.com/rudeayelo/aimharder-mcp/issues/146)): strongly marked cartoon, in the manner of *The Amazing World of Gumball*, as expressive as a kettlebell with no mouth and no limbs allows. Character motion is stop-motion at 12 fps (on twos). The body carries strong anticipation, squash and stretch, overshoot and snappy holds; the eyes carry emotion through shape, size, lids, asymmetry and gaze. Multiple-image (echo) frames were tried in the lab and rejected ([#134](https://github.com/rudeayelo/aimharder-mcp/issues/134)); the [motion rules](#kettle-motion-spec) below apply. Every clip starts and ends on the same neutral pose. This supersedes iteration 1's restraint: body deformation is part of the language.
- **Interaction per surface:** landing and footer — the eyes, and a little of the head, follow the cursor, and clicking or tapping the Kettle plays an emote; the landing hero also turns when dragged (*provisional*, see the [surface defaults](#kettle-motion-spec)); portal — no free interaction, only the onboarding guide and the final celebration; touch — no cursor following, a tap plays an emote; reduced motion — gaze following stays at a small amplitude and hops, spins and large deformations are replaced by a still pose. Character motion is stepped at 12 fps; direct manipulation (dragging to turn, the camera) follows the pointer at display rate. No sound.
- **Animations:** the iteration-1 candidates were rebuilt in the lab, with the poke and drag-release reactions and gaze following, and decided in [#134](https://github.com/rudeayelo/aimharder-mcp/issues/134): body flex was removed, drag-release and gaze following were kept as they are, and the rest were adjusted. The kept clips are specified in the [motion spec](#kettle-motion-spec) below; their tuned values live in [`kettle/src/tuning.json`](../kettle/src/tuning.json).
- **Portal onboarding:** iteration 1 storyboarded a six-moment Kettle-guided walkthrough (spotlight the AimHarder connection, step aside during sign-in, spotlight Connect an app, celebrate the first connected app in a dialog the Kettle overlaps). Phase 5 redesigns it from the system's components.
- **Behavior rules:** honor reduced motion as above; show a static poster when WebGL is unavailable; render only while animating and pause while off-screen or hidden; hide decorative placements on small screens where they compete with content.

#### Kettle motion spec

Durations are in exposures at 12 fps (on twos), counting the neutral first and last exposures; every clip starts and ends on the same neutral pose. Triggers marked *provisional* come from the provisional surface defaults below.

| Clip | Trigger per surface | Duration | Motion | Reduced motion |
| --- | --- | --- | --- | --- |
| `double-blink` | Footer: once when it first comes into view (*provisional*). Portal: after curiosity in the onboarding guide cue. | 12 (1.0 s) | Two quick blinks, shut for two exposures each, and a small pop-open; the body barely squashes. | Eyes only |
| `curiosity` | Portal: the onboarding guide cue, with the page aiming the gaze at the bubble. | 31 (2.6 s) | Dip, pop into a head tilt with one big eye and one squint, hold; ease into a lean toward the camera, hold; ease back through a small counter-lean. | Eyes only, gaze within ±0.35 |
| `look-around` | Not assigned to a surface yet; played with `play()`. | 34 (2.8 s) | The eyes dart right, left, up and down; the body follows two exposures behind with turn, lean and stretch; a blink through the big turn; back to centre. | Eyes only, gaze within ±0.35 |
| `rock` | Not assigned to a surface yet; played with `play()`. | 17 (1.4 s) | Rocks 20° to one side and back in decaying swings, the handle lagging slightly. | Still pose |
| `little-hop` | Landing hero and footer: every other click or tap, alternating with poke (*provisional*). | 16 (1.3 s) | Squash, launch in a tall stretch, hang at the apex with happy-arc eyes, land squashed, recover. | Still pose |
| `tilted-spin` | Portal: the onboarding celebration dialog. | 21 (1.8 s) | Wind-up counter-turn, a 360° spin in five exposures tilted up to 26° with a twist smear and stretch, overshoot, land, hold with happy-arc eyes. | Still pose |
| `poke` | Landing hero and footer: every other click or tap, alternating with little hop (*provisional*). | 14 (1.2 s) | Knocked away from the poke with > < eyes, pops up surprised with big eyes, shakes it off. | Eyes only |
| `drag-release` | Landing hero only: releasing a fast drag (*provisional*). Scaled by the release speed. | 24 (2.0 s) | Dizzy wobble circles with spinning eyes and droopy lids, then a shake-off, while the turn springs back to the front. | Still pose; the turn returns without passing the front |
| Gaze following | Landing hero and footer: follows a mouse or pen, never touch, stepped at 12 fps (*provisional*). Portal: only where the page points it. | Continuous | The eyes, and a little of the head, turn toward the pointer and return to rest when it leaves. | Eyes only, gaze within ±0.35 |

Motion rules (from the maintainer's notes in #134):

1. **No echo or multiple-image frames**, in any clip. The cartoon effect comes from anticipation, squash and stretch, overshoot and holds. Where echoes carried speed (the hop launch, the spin), a stronger stretch and the twist smear carry it.
2. **No snap into a pose right before the return to neutral.** The return eases out of the last held pose. Applied to curiosity, where the note came from; the one-exposure accents before the settle in double blink, look around and poke (a blink or pop) and in drag-release (the shake-off) are as approved in the lab, pending the maintainer's confirmation.
3. **Eye shapes stay readable**, in every clip. Happy arcs and squints never distort the recess beyond a readable shape; the happy arc lifts the recess into an arch without folding it.

Surface defaults, **provisional**: proposed with the decision, not yet confirmed by the maintainer, and kept as configuration in the Kettle module (`SURFACES`, [module README](../kettle/README.md#using-the-module)) so they are cheap to change:

- A click or tap on the landing hero and the footer alternates poke and little hop.
- The footer plays one emote (double blink) when it first comes into view, then stays still; there is no idle scheduler.
- Dragging to turn is on in the landing hero only, never in the portal.
- Gaze following is stepped at 12 fps.
- Under reduced motion, eye-only clips keep their eye motion; every other clip is a still pose.

### Logo

The flat Kettle mark to the left of the **AIHARDER** wordmark in Krona One. “AI” is blue; “HARDER” is navy in Light and a light neutral in Dark. The mark is navy in Light and white in Dark, with a transparent circular face cutout. It is adapted to the new tokens only, bound to the brand variables, with no redesign.

## Landing recommendations from the iteration-1 critique

The [landing critique](research/2026-11-10-landing-page-critique.md) scored the iteration-1 desktop landing 14/20 (no P0 or P1). Its specific findings become these general rules for phase 3:

1. **Say what the product is in the hero.** The supporting line states the relationship directly: AIHarder connects your AimHarder account to the AI chat you already use. The headline can stay a benefit; the sentence under it must not leave the visitor to infer the connection from the app strip or the setup steps.
2. **Keep demonstrations short and evidence the promise.** One question, one concrete answer, nothing unrelated. Every capability the copy names (book classes, see workouts, review records) is shown by at least one visible request and result, including an action, not only a lookup.
3. **Decoration must not carry information.** The question wall keeps its motion and character, but the emphasized question is readable and matches the active topic, and no capability is explained only in faded text. Prefer fewer, more readable rows to a wall taller than the hero.
4. **Measure contrast in both themes, especially small active states.** White labels sit on the darker action blue, never on the light brand blue (white on `#47a3f6` measured 2.68:1; white on `#2490f4` is 3.30:1). Informative inactive labels need the same 4.5:1 as other text.
5. **Instructions outrank illustrations.** Step names and descriptions in How you get started are stronger than their illustrations; miniature UI detail is simplified and bright panels do not become the loudest area in Dark.
6. **Keep what works:** the Kettle, the logo, the blue gradients, the shared content grid and the section order, and invitation-only wording only in the FAQ.

## Screen inventory by phase

Every screen is designed at desktop and mobile, Light and Dark, in English, and checked with Spanish copy for fit. Empty, loading, error and disabled states are part of each screen.

| Phase | Issue | Screens and components |
| --- | --- | --- |
| 1 — Foundations and components | [#135](https://github.com/rudeayelo/aimharder-mcp/issues/135) | Variables: brand (strings and colors), semantic color roles with Light and Dark modes (surfaces, text, actions, links, focus, selection, success, warning, error, info, disabled), typography, spacing, radius, elevation. Components in all states: buttons and links, inputs, select, checkbox, switch, segmented control, card/surface, list row, inline message/banner, dialog/confirmation, stepper/progress, code/copy block, client picker, header/navigation/footer, email layout primitives, and the entry-action / access-copy variant (invitation-only now). Logo lockup adapted to tokens. Cover page in the iteration-1 file marking it read-only. Blocks every screen phase. |
| 4 — Access | [#136](https://github.com/rudeayelo/aimharder-mcp/issues/136) | Accept invitation (which email must match; expired, revoked and already-used invitations), sign in (Google and verified email/password), email verification sent / confirmed / failed, password recovery request and sent, set new password, email-mismatch and account-linking states. Mobile first. |
| 5 — Portal | [#137](https://github.com/rudeayelo/aimharder-mcp/issues/137) | Kettle-guided onboarding (connect AimHarder → choose AI client → first question, without claiming success), returning-participant Home, client picker with one guide at a time (ChatGPT, Hermes, Other clients), consent and return-from-authorization states, Settings (portal account, AimHarder connection, authorized clients, the two confirmation preferences), Account, and distinct disconnect / delete confirmations. |
| 6 — Administration and emails | [#138](https://github.com/rudeayelo/aimharder-mcp/issues/138) | Administration: invitations, participants, role availability, suspension. Transactional emails: invitation, verification, recovery, with name, domain and support address bound to the brand variables. |
| 3 — Landing and Privacy | [#139](https://github.com/rudeayelo/aimharder-mcp/issues/139) | The landing sections above, section by section with the critique rules applied and only the Kettle animations kept in #134; then Privacy. |
| Handover | [#140](https://github.com/rudeayelo/aimharder-mcp/issues/140) | Update map #103 and implementation tickets #106–#117 to the new Figma file, components and name. |

Phase numbers follow the spec. Delivery order ([#95](https://github.com/rudeayelo/aimharder-mcp/issues/95)): phase 1, the Kettle ([#134](https://github.com/rudeayelo/aimharder-mcp/issues/134), [#146](https://github.com/rudeayelo/aimharder-mcp/issues/146)), access and portal as one block (4 and 5), administration, emails (6), the landing (3), then handover.

## Visual direction starting points

These are inputs to phase 1, not final values. Final values live only in the Figma variables.

- **Brand blue:** AimHarder's `#2490f4`, observed in their [public stylesheet](https://aimharder.com/new-web/assets/main-CbA3Gj31.css) as `--color-ah-blue` (implementation evidence, not a brand guide). It is an identity color, not a background for small white text; actions use a darker derived blue (iteration 1 used `#1765B0`, 5.96:1 with white).
- **Accent:** the Kettle's orange (`#FFAB62`) was the iteration-1 counterpoint, with dark text on it. Phase 1 measures and chooses the complementary accent. The accent never stands in for warning or success.
- **Type:** Krona One for the wordmark only; Geist was the provisional UI family.
- **Tone:** restrained and approachable: readable type, generous spacing, one accent, quiet separators, 48px touch targets. [Reference research](research/2026-10-28-product-experience-references.md) inspires; the AIHarder design system decides.

### Checks every phase posts

- A screenshot sheet of every screen and state: desktop and mobile, Light and Dark, the Spanish fit check and a 200% text check on mobile.
- Measured contrast for every text/background and interactive-state pair: at least 4.5:1 for normal text, 3:1 for large text and non-text UI.
- The components and variables each screen uses. A detached instance or a raw color is a defect.
- Accessibility: every control reachable by keyboard, labeled, with a visible focus ring, and unclipped at 200% text.

## Implementation baseline

The current hosted service predates this design. Its gaps against the requirements above are known, not decided:

- The portal ([portal.ts](../hosted/src/portal.ts)) renders single-column server HTML; [connections.ts](../hosted/src/connections.ts) supplies client setup, consent and per-client revocation; [aimharder-settings.ts](../hosted/src/aimharder-settings.ts) supplies the AimHarder connection and gym settings; [mail.ts](../hosted/src/mail.ts) sends plain-text invitation, verification and recovery email.
- Remote client setup still needs an operator to provision a public client ID and exact callback. That is the runtime baseline until the self-service replacement is designed, implemented and verified; the design must not imply that copying a server URL alone completes setup.
- There is no first-successful-query indicator, and none is planned: consent is not evidence of a working query, and no telemetry is added for it.
- Code and some documents still use AimHarder MCP and `ahmcp.link` until [#141](https://github.com/rudeayelo/aimharder-mcp/issues/141).

## Vocabulary and existing decisions

Use the terms in [CONTEXT.md](../CONTEXT.md), especially portal account, AimHarder connection and MCP client connection; visible labels may be simpler, but the lifecycles stay distinct. The design must not imply behavior these decisions do not establish:

- [Invited hosted pilot](adr/2026-10-15-invited-hosted-mcp-pilot.md): audience, feature scope and role availability.
- [Hosted identity and credential custody](adr/2026-10-15-hosted-identity-and-credential-custody.md): separate identities, credential custody, administration limits.
- [Invited password admission](adr/2026-10-18-invited-password-admission.md) and [Google sign-in and explicit linking](adr/2026-10-18-google-sign-in-and-explicit-linking.md): sign-in, verification and linking.
- [Hosted MCP client authorization](adr/2026-10-18-hosted-mcp-client-authorization.md) and [self-service onboarding](adr/2026-10-28-self-service-invited-onboarding.md): OAuth/PKCE, consent, registration.
- [Participant suspension](adr/2026-10-19-hosted-participant-suspension.md) and [independent deletion and controlled restoration](adr/2026-10-19-independent-deletion-and-controlled-restoration.md): administration and account lifecycle.
- [Confirmation preferences](adr/2026-10-30-account-write-confirmation-preference.md) and [confirmed hosted action coordination](adr/2026-10-19-confirmed-hosted-action-coordination.md): what confirmations exist.
- [Scoped hosted-pilot acceptance](adr/2026-10-28-scoped-hosted-pilot-acceptance.md): do not present the pilot as launched or fully accepted.

## Open questions

- Confirmation of the provisional Kettle surface defaults, including which emote the footer plays and triggers for look around and rock, and whether motion rule 2 also covers the final accents of the other clips ([#134](https://github.com/rudeayelo/aimharder-mcp/issues/134)).
- Final landing copy, including the hero headline and supporting line, within the structure above.
- The complementary accent and final color values (phase 1).
- Help: whether it is a navigation entry or a persistent secondary FAQ link, and its exact content.
- Privacy policy content beyond the design draft.
- Licenses of the models behind the Kettle's source reconstruction, for public use (see the [asset notes](../design/assets/kettle/README.md#licenses)).
- Support inbox activation and `aiharder.link` activation in DNS, OAuth, Resend and the Worker, coordinated with the maintainer.
