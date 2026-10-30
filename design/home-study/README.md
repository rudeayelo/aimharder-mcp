# AimHarder Connect — public home structure

Date: 2026-10-30. Status: first information-architecture and content proposal for owner review under #95. The owner selected **AimHarder Connect** as the working product name and **Krona One** for the wordmark. `aimharder-mcp` remains the technical npm package. AIHarder is a retained naming alternative, not the current build target.

This checkpoint proposes the structure of one public home page. It does not draw the remaining screens, adopt final copy/navigation, implement a page, activate support or deploy anything. The existing editable design handoff remains `design/ahmcp.pen` when the visual home experiment is produced.

## Goal and product boundary

Help an invited gym member answer three questions: what can I do from my AI chat, how do I connect my own AimHarder account, and how do I enter? The intended main action is **Sign in**. Invitation links remain the entry path for new participants; the public site does not introduce open registration or a waiting list.

Accepted requirements and implementation limits are in [Product experience design](../../docs/product-experience.md), [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95), [#103](https://github.com/rudeayelo/aimharder-mcp/issues/103), the [self-service requirement](../../docs/adr/2026-10-28-self-service-invited-onboarding.md) and the [identity/custody decision](../../docs/adr/2026-10-15-hosted-identity-and-credential-custody.md). The owner's later working-name instruction supersedes the earlier AimHarder MCP presentation-name requirement in those tracker briefs; it does not rename technical identifiers or change access policy.

## Proposed page order

| Block | Visitor question | Proposed content and behavior |
| --- | --- | --- |
| 1. Header | Where am I, and how do I enter? | AimHarder [kettle] CONNECT wordmark; How it works and FAQ anchors; Sign in. Keep GitHub in the footer. |
| 2. Hero + conversation | What does it do for me? | Proposed headline: **Your AimHarder training, in your AI chat.** Supporting line: **Check classes, see your workouts and review your activity using the AimHarder account you already have.** One labeled illustrative conversation shows the benefit. Sign in is primary; See how it works scrolls to setup. Small access note: **Invitation-only pilot.** |
| 3. Useful things to ask | Does this cover my actual needs? | Three concise prompt-led examples: classes/bookings; workouts and prescribed weights; personal activity and records. Prefer three clear rows or a simple prompt selector, not a large feature-card catalogue. Include one short confirmed-action example, not just reads. |
| 4. Three setup steps | What will I need to do? | **Connect AimHarder → Connect your AI chat → Ask your first question.** Portal access/invitation precedes these tasks. Start with the accepted prompt: **What classes can I book tomorrow?** Client-specific instructions belong after sign-in, not all at once on the public home page. |
| 5. Short FAQ | Can I use it, and do I trust it? | Invitation-only access; client requirements; how account access/data are handled; confirmation and disconnect controls; independent-project status. Short expandable answers with contextual next actions. |
| 6. Closing action + footer | What next? | Repeat Sign in with the access note. Project GitHub, privacy information and independent-project disclosure. Contact support uses the accepted target only after its inbox is activated and tested. No unrelated sitemap or second acquisition funnel. |

### Illustrative conversation and prompts

The hero demonstrates one complete, concise read request rather than a montage of tools. Suggested request: **What is tomorrow's workout?** A fictional response can describe one explicitly fictional workout; it must be labeled **Illustrative example** beside the conversation. Do not use real participant data, exact current class availability or a simulated live chat input. The home page explains the connection, while conversations take place in the participant's AI client.

Supporting prompt candidates:

- Classes/bookings: **What classes can I book tomorrow?** A response must distinguish listed sessions/occupancy from verified booking eligibility. Do not promise a place based only on capacity.
- Workouts/weights: **What is tomorrow's workout, and what weights should I use?** Ground weight examples in source prescriptions and available own records/calculation support; do not present an unrestricted coaching service.
- Activity/records: **Show my activity from this week.** Avoid turning recorded entries into verified physical attendance or training-session counts.

A compact action illustration can use **Book the 19:00 class**, followed by an exact preview/confirmation request. Stop the illustration at the confirmation affordance; do not imply that an unconfirmed request changed a booking. Do not advertise autonomous actions. Capability illustrations do not establish complete current real-client/pilot acceptance.

### FAQ content constraints

- **How do I get access?** The pilot is invitation-only; invitees start from their invitation email, returning participants sign in. No public sign-up or waitlist action.
- **Which AI chats can I connect?** Present the initial ChatGPT and Hermes guide paths, plus Other clients with explicit compatibility requirements. State the prerequisites actually verified for the chosen client when writing the final copy; do not promise arbitrary client/plan/mobile support.
- **What happens to my AimHarder details?** The hosted service stores recoverable encrypted AimHarder credentials for authentication. It can decrypt them for that purpose; they must not go into the AI conversation. Never claim zero credential storage or end-to-end encryption. Full policy wording belongs in the privacy destination, not a technical diagram in the hero.
- **Can I control access and changes?** Each AI-client connection can be disconnected independently. Disconnecting AimHarder and deleting the portal account are separate actions. Relevant sporting writes require an exact preview and confirmation; existing role availability still applies.
- **Is this an official AimHarder product?** Preserve the independent-project disclosure. The working name/logo does not imply endorsement or official affiliation.

## Reference lock and research

Research refreshed on 2026-10-30 using the Refero design skill: three style searches (approachable conversation-led AI products, restrained white product marketing, and fitness product demonstration) and three full style records. These are archived design descriptions, not evidence of current product compatibility or a live service.

Primary visual foundation: the existing [white/blue foundations](../README.md) and [selected wordmark](../identity/connect-study/README.md). Keep the established blue prefix, navy lettering, white surfaces and orange eyes. Krona One is for the logo; product/body text stays with the provisional readable UI family. The mascot has the previously agreed limited role near the logo and occasional incidental placement. Do not add new emotes, a giant mascot hero, lifestyle imagery or a sporting dashboard.

| Reference | Bounded contribution | Excluded |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com), `c14c0a94-1037-449e-bf5b-4cb972656ac7` | White canvas, readable hierarchy, quiet separators and subordinate navigation; remains the structural foundation. | Its black action color, component grid and full navigation catalogue. |
| [Reclaim](https://reclaim.ai), `9bdb7d7f-7c20-4672-bf61-ef781750915e` | Benefit copy beside a contained product demonstration; adapt this as a labeled conversation example. | Violet/green palette, calendar UI, statistics, testimonials and implied product evidence. |
| [Foodnoms](https://foodnoms.com), `4c7e1e62-5c2d-4874-9640-ccbf7d88b5e8` | Explain a consumer utility through concrete product use. | Phone mockups implying a native app, its green/orange palette, charts and nutrition content. |
| [Earlier bounded screen research](../../docs/research/2026-10-28-product-experience-references.md) | Metaview's task orientation, Cal/Mamitsu's scoped client choice and Family's short FAQs. | Those products' branding, onboarding details and unverified compatibility promises. |

### Decision ledger

| Decision | Source | Reason |
| --- | --- | --- |
| Working name AimHarder Connect, technical package unchanged | Owner, 2026-10-30 | Separate consumer value from implementation terminology. |
| Sign in primary; invitation-only note nearby | Accepted public-page brief / #95 | Match the actual admission policy without creating a second entry funnel. |
| Conversation first, capabilities as prompts | Accepted example-question requirement + bounded demonstration references | Explain value to a nontechnical participant without a tool list. |
| Three setup tasks | Accepted self-service requirement | Explain the intended journey without promising all pending engineering is complete. |
| FAQ + independent disclosure | Accepted help, privacy and independence requirements | Address real access/trust questions concisely. |
| No additional screens or new motion tests | Owner's staged review and latest steering | Settle this one page before expanding scope. |

## Responsive and next-stage criteria

Desktop proposal: a concise message/action column beside the conversation. Mobile: logo/navigation, headline and access action first, then the example and remaining sections in reading order. Keep the same content hierarchy; avoid a carousel required to discover capabilities. A static poster is the baseline for the logo; if existing motion is later integrated, honor reduced motion and render only as needed.

This is a content/structure proposal, not a rendered wireframe. The next deliverable is one desktop/mobile visual home experiment in the selected brand direction, with explicit illustrative data, real font files and existing mascot assets. Validate text, media, focus, contrast, spacing and clipping against this structure. Final copy, layout, responsive dimensions, page links and production implementation remain pending. No new architecture/security/distribution ADR is warranted for this proposal; existing access, custody, action and validation decisions remain unchanged.
