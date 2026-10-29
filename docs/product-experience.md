# Product experience design

Status: accepted product brief recorded on 2026-10-28; remaining visual and navigation decisions delegated to [design ticket #95](https://github.com/rudeayelo/aimharder-mcp/issues/95). This document separates accepted requirements, historical proposals and pending engineering. No final screen design, implementation or deployment is approved by this record alone.

Parent specification: [#103 — Deliver the remote MCP UX/UI and GitHub documentation](https://github.com/rudeayelo/aimharder-mcp/issues/103), published on 2026-10-29 with `ready-for-agent` and `wayfinder:map`. It is the canonical tracker specification, including 72 user stories, implementation/testing decisions, scope boundaries and an ordered delivery map. Existing #95 and #92 are linked as native sub-issues, with #95 first. The parent does not implement or complete its deliveries.

## Accepted direction

The owner accepted the following recommendations on 2026-10-28:

- Design primarily for a member of the owner's gym who wants to use AimHarder through an AI chat. Keep invitation-only admission for the initial pilot. Explain capabilities, setup and recovery without requiring knowledge of MCP.
- Cover the whole remote-service experience: the public website, invitations and sign-in, AimHarder connection, AI-client authorization, settings, administration, errors and transactional email. Review instructions visible in the AI chat as well. Changes to tool behavior require a specific decision.
- Keep `ahmcp.link` as the intended public domain. The owner's earlier mention of `ahmcp.com` was a mistake, not a migration request.
- Make the GitHub README a product entry point with immediately discoverable hosted remote and local npm usage paths, shared capabilities, and separate setup guides. Link technical details and validation evidence from the relevant sections.
- Keep the website design in a pen.dev `.pen` file. The later design handoff fixes the path as `design/ahmcp.pen`; #95 resolves the concrete screen/state inventory within its required coverage.

The owner also accepted the following recommendations in the second round:

- Retain **AimHarder MCP** as the product name, paired with a plain-language explanation of its benefit. Keep the independent-project disclosure visible. “Your AimHarder training, in your AI chat” was an illustrative line, not final copy.
- Explain the product and invitation-only pilot on the public page, with **Sign in** as its primary access action. Invited participants start from their invitation link. Do not add open registration or a waiting list.
- Use the portal to configure and manage the service. Sporting queries and actions happen in the AI chat; do not add a sporting calendar, training-history view or booking forms to the portal.
- Guide initial setup through connecting AimHarder, connecting an AI client and trying a first query. The returning-participant home shows connection status and links to settings.
- Use a restrained, approachable visual direction with readable typography, generous spacing, one accent color and clearly labeled fictional conversation examples.
- Prioritize invitation acceptance, sign-in and AimHarder connection on mobile, with desktop layouts as well. Adapt help to the selected AI client. Mobile website design does not establish mobile setup capability in every client.

The owner emphasized that onboarding for the different clients must be **very clear and concise**. Client selection, prerequisites, step wording, expected results and recovery instructions must serve that requirement. Later decisions fix the initial guide coverage as ChatGPT, Hermes and Other clients with concrete requirements; #95 resolves the guide presentation.

In the third round, the owner accepted client-specific instructions and corrected the remaining proposals:

- Each guide must have a concrete scope for its client, using [Mamitsu's connection page](https://usemamitsu.com/connect) as an interaction reference. The fourth round accepts an **Other clients** option, within the compatibility limits below.
- Onboarding must be self-service after invitation. Do not make routine client setup depend on asking the administrator to register callbacks or deliver configuration. The present operator-only preparation is an implementation gap, not the intended experience. See the [self-service onboarding decision](adr/2026-10-28-self-service-invited-onboarding.md).
- Do not mention time zones or expose time-zone controls in the hosted frontend. Use `Europe/Madrid` for the current frontend experience, retaining manual backend configuration for future needs. The fourth round extends this presentation rule to AI-chat answers and confirmations while preserving backend metadata. See the [hosted frontend time-zone decision](adr/2026-10-28-hosted-frontend-madrid-time-zone.md) for the implementation/provenance implications.
- Use a useful first-query prompt: “What classes can I book tomorrow?” The owner's original Spanish example was “¿A qué clases me puedo apuntar mañana?”. Do not require a time-zone check to finish onboarding. A response must still distinguish published classes/occupancy from verified booking eligibility.
- The website is focused on remote MCP. A simple link to the GitHub project is sufficient; do not require participants to visit technical GitHub documentation to finish routine onboarding. GitHub is the technical entry point and links to both local and remote usage paths.
- No private support channel had been established in the third round. The earlier reference to a “usual private channel” was an unsupported assumption, and Q14 was not accepted. In the fourth round, the owner accepted a dedicated project support address as described below.

In the fourth round, the owner accepted these recommendations:

- Participants may copy required configuration between the portal and their chosen client, including an exact callback address when the client requires it. The portal prepares the configuration without operator intervention. Preserve independent disconnection of each installation.
- Add **Other clients**, with a copyable remote URL, required OAuth configuration and concise steps for compatible clients. State concrete requirements rather than claiming every MCP client works.
- Keep time-zone details out of AI-chat answers and confirmations as well as the website. Backend configuration and truthful tool metadata remain available.
- Use a dedicated project support email, proposed as `support@ahmcp.link`, alongside FAQs and GitHub Issues for reproducible bugs. The address is accepted as the design target but has not been configured or tested. The fifth round accepts Resend Inboxes as the handling service, with activation pending.

In the fifth round, the owner generally accepted the recommendations, while asking to clarify the content of **Help** before settling that navigation entry:

- Use Resend Inboxes for human-operated support at `support@ahmcp.link`, accessed through its dashboard. The website's **Contact support** action opens an email to that address. Provider/account activation is pending and no automatic support agent is part of this decision.
- Structure the public page around capabilities, sample questions, three setup steps and short access/privacy FAQs. **Sign in** is primary; GitHub is a secondary project link. Examples cover queries and actions requiring confirmation.
- The proposed participant navigation is **Home**, **Connect your client**, **Settings** and **Help**, with **Administration** restricted to administrators. Home shows the next setup step or current connection state. Settings groups portal account, AimHarder connection and authorized-client management. The content and navigation prominence of Help remain under discussion.

The intent is to help a participant understand the product, start using it and recover from problems. The documentation must also help local users choose and maintain their distinct setup path. [Issue #92](https://github.com/rudeayelo/aimharder-mcp/issues/92) already defines the local/remote documentation review; its scope remains relevant to this design work.

## Current implementation baseline

These are source and tracker observations, not UX decisions:

- The root [README](../README.md) leads with local stdio installation and includes historical hosted pending statements that need reconciliation with the latest scoped closeout.
- The portal currently renders server-generated HTML in [portal.ts](../hosted/src/portal.ts), using a single column and a minimal home page linking to account settings, AimHarder connection and MCP client management.
- [connections.ts](../hosted/src/connections.ts) supplies client setup instructions, OAuth consent and independent client revocation. Setup currently includes operator-provided client configuration and distinct ChatGPT and Hermes instructions.
- [aimharder-settings.ts](../hosted/src/aimharder-settings.ts) supplies upstream connection, gym/time-zone settings, password updates, account replacement and disconnection.
- [mail.ts](../hosted/src/mail.ts) sends plain-text invitation, verification and password-recovery email.
- The current remote setup and [client preparation script](../hosted/scripts/prepare-mcp-client.ts) target ChatGPT and Hermes. The [Codex guide](clients/codex.md) documents local stdio; actual remote Pilot connector evidence does not supply a participant-facing remote Codex setup guide.
- Remote setup still requires operator provisioning of a public client ID and exact approved callback. These are configuration parameters, not participant passwords or OAuth tokens. The UI must not imply that copying only a server URL completes every client setup.
- That operator-only setup is the existing baseline, superseded as a product experience by the accepted self-service requirement. Its replacement mechanism is not yet selected or implemented.
- The portal can list currently authorized MCP clients. It has no implemented first-successful-query indicator; an OAuth grant alone is not evidence that a sporting query succeeded.
- The Mamitsu reference was inspected on 2026-10-28, including its **Other agents** state. It switches the instructions with the client selection; the generic state supplies a copyable server URL and brief Streamable HTTP/OAuth steps. Its installation commands, skills, client support and authentication are not requirements or compatibility evidence for this project.
- No existing `.pen` or branding asset was found in this checkout during the initial audit.
- The [acceptance ledger](hosted-pilot-acceptance.md) identifies the isolated test environment separately from the intended production origin. Choosing `ahmcp.link` for the design does not establish production availability.

## Vocabulary and existing decisions

Use the established terms in [CONTEXT.md](../CONTEXT.md), especially portal account, AimHarder connection and MCP client connection. Their lifecycle actions remain distinct even if the visible labels are simplified during design.

Reviewed decisions:

- [Invited hosted pilot](adr/2026-10-15-invited-hosted-mcp-pilot.md): audience, full existing feature scope and role availability remain unchanged.
- [Hosted identity and credential custody](adr/2026-10-15-hosted-identity-and-credential-custody.md): separate identities, credential custody, administration limits and distinct lifecycle actions remain unchanged.
- [Scoped hosted-pilot acceptance](adr/2026-10-28-scoped-hosted-pilot-acceptance.md): preserve accepted closeout, deferred checks and uncertainty rather than claiming all original criteria passed or production launched.
- [Hosted MCP client authorization](adr/2026-10-18-hosted-mcp-client-authorization.md): the trusted operator-only registration workflow needs a successor for self-service; existing runtime safeguards remain in force until that successor is designed, implemented and verified.
- [Default gym time zone](adr/2026-09-24-default-gym-time-zone.md): the hosted frontend policy changes presentation and setup, while backend overrides, source provenance and local setup remain separate concerns.

The third round requires the two linked ADRs because self-service changes the registration responsibility and hiding time-zone configuration intersects with existing action prerequisites. They record accepted product requirements with pending engineering and validation. Keep project artifacts and copy in English.

## Support inbox assessment

Resend Inboxes is a suitable candidate for the accepted support address, based on official documentation checked on 2026-10-28:

- [Inboxes introduction](https://resend.com/docs/dashboard/inboxes/introduction): the dashboard can receive, organize and reply to email threads. A basic human-operated support inbox does not require a custom inbox UI or receiving webhook implementation in this project.
- [Creating inboxes](https://resend.com/docs/dashboard/inboxes/create-inboxes): the address must use a verified sending domain. Receiving requires the appropriate MX setup or forwarding an existing address to a Resend-provisioned receiving address. A forwarding address does not by itself make an unconfigured public address receive mail.
- [Pricing](https://resend.com/pricing): Free lists three included inboxes; inbox email uses the transactional quota. The [product page](https://resend.com/products/inboxes) advertises a free entry plan with 3,000 sent/received emails. These are published allowances, not verification of this account's remaining quota or an account-specific billing offer.

The [existing Resend decision](adr/2026-10-18-resend-transactional-delivery.md) originally covered transactional sending only and preserves existing root receiving-mail configuration. Its later product amendment records the accepted Inboxes direction. Sending-domain verification alone does not prove that `support@ahmcp.link` can receive. Before activation, inspect the actual account availability/price and domain receiving setup, preserve unrelated mail routing, and test one inbound message and one human reply. No account access, inbox creation, DNS change, message send, agent connection or purchase was performed for this assessment. Provider selection and human-operated handling are accepted; configuration and verification remain pending.

## FAQ presentation

The owner proposed an FAQ format for the help content. Use a short participant-facing FAQ with grouped questions and concise, expandable answers. Put support contact at the end and link to the relevant client guide when a question concerns setup. This is the current presentation direction; final placement is still proposed below.

Suggested question groups and coverage:

- **Access:** How do I join? What if my invitation did not arrive or has expired? How do I recover access?
- **Connections:** Which clients can I use? How do I connect one? What if I change my AimHarder password? How do I disconnect a client?
- **Using the service and privacy:** What can I ask? Why do sporting actions need confirmation? Who can access my AimHarder credentials?

Each answer should resolve one question and provide a relevant next action when needed. Keep setup instructions in the client guides and recovery instructions contextual to the actual state. Do not add search, ticket tracking or a custom support inbox to the portal for this small FAQ.

Recommend making **FAQ** a persistent secondary link rather than a primary navigation item. Its final placement is delegated to #95, rather than awaiting another owner preference round. Do not add private configuration, sporting data, credentials or diagnostic logs to contact links automatically.

## Design-reference research

The owner authorized Refero research for product UX, panel design and UI inspiration on 2026-10-28. The [reference research](research/2026-10-28-product-experience-references.md) covers three full styles, six selected screens and one complete flow; seven raw screen images were inspected. Reference screenshots document archived examples, not current compatibility or user research for this product.

The initial light/teal, white/orange and dark/orange directions were research proposals and were not selected. The owner's later direction is to adopt AimHarder's blue as the starting point and investigate a complementary accent, potentially orange. The [official homepage](https://aimharder.com/) links a [public stylesheet](https://aimharder.com/new-web/assets/main-CbA3Gj31.css) declaring `--color-ah-blue: #2490f4`. This is observed implementation evidence, not a certified brand guide. Exact shades, roles and contrast must be resolved in the design ticket.

## Design delegation and delivery

The owner proposed delegating the remaining design and navigation decisions to a first ticket. [Issue #95: Define AimHarder MCP visual identity and navigation in pen.dev](https://github.com/rudeayelo/aimharder-mcp/issues/95) now contains the self-contained brief, research references, deliverables and acceptance criteria. It is labeled `enhancement` and `ready-for-agent`.

The assignee should resolve palette, typography, navigation, FAQ placement and screen/state presentation within this accepted brief, then present a concrete design for review. The owner does not need another interview about each color or menu label before the ticket can start. The target artifact is `design/ahmcp.pen`, with supporting design rationale, desktop/mobile views, component/state inventory and documentation updates.

[Issue #92](https://github.com/rudeayelo/aimharder-mcp/issues/92) remains the local/remote technical-documentation review. Coordinate its terminology and information hierarchy with the design; this does not block correcting its independently verified outdated usage/status material. Engineering for self-service provisioning, the Madrid policy, support inbox activation and eventual frontend implementation remains separate work to identify in the handoff.

The ticket is open; its creation does not complete the `.pen` design or validate the intended runtime behavior. Existing identity, role, confirmation and deployment decisions remain in force except for the explicitly accepted product amendments linked above. This delegation requires no new ADR: it assigns reversible visual/navigation decisions without selecting another architecture, distribution model or security policy.

## Decisions and follow-ups assigned to the design handoff

- Final public-page copy within the accepted structure.
- Self-service provisioning design, first-query verification and support inbox activation.
- Final FAQ wording and navigation prominence.
- Detailed onboarding and returning-participant states.
- Visual palette, responsive layouts and accessibility acceptance.
- Settings, administration and transactional-email presentation.
- GitHub information architecture for participants, local users, contributors and operators.
- Final screen inventory, `.pen` location and design-review criteria.

Resolve the visual/navigation branches in #95 and record implementation/operational follow-ups separately. Do not treat an unresolved branch, reference screenshot or intended UI as implemented or live-validated behavior.

## Specification completeness review (2026-10-29)

Review of this brief, #95, #92 and the two October 28 product-amendment ADRs found no additional essential owner decision needed before starting the design ticket. The product brief is sufficient for that work. The full implementation specification remains incomplete until the delegated design and technical follow-ups produce their concrete contracts and acceptance evidence.

The remaining work falls into these areas:

- **Design:** #95 resolves the visual system, navigation, copy, screen/state inventory and responsive presentation and supplies the reviewable `.pen` artifact.
- **Self-service client setup:** specify and verify controlled registration/configuration delivery, exact callbacks, independently managed installations, conditional generic-client compatibility and the completion criterion for the suggested first query. Do not infer successful use from consent or introduce unrequested telemetry.
- **Hosted Madrid policy:** reconcile service-selected configuration with action prerequisites and truthful provenance; preserve manually configured backend overrides and specify their effective behavior.
- **Interface and wording:** implement the selected web/email designs and assign the accepted review of instructions, errors and confirmations visible in the AI chat to explicit implementation/verification work. The design ticket alone does not change MCP behavior.
- **Support activation:** configure and verify receiving/reply handling for the accepted address and provider, preserving existing mail routing and checking account-specific conditions.
- **Documentation and acceptance:** #92 covers both usage paths. Add a final integrated journey in which an invited participant completes setup without operator intervention and makes a useful query in each initially supported remote client. Keep local-path checks, conditional generic support and actual-client evidence distinct.

These are follow-up specification/delivery areas, not additional accepted features. At the owner's explicit `to-spec` request, they are now consolidated in parent #103. The design handoff and technical deliveries resolve the remaining concrete contracts within that specification. Apart from existing #95/#92, further implementation packages have not yet been published as separate child tickets. Existing verified documentation corrections in #92 can proceed independently of final visual decisions.

The proposed primary test boundary is the existing public Worker HTTP interface, consumed by browser journeys and an actual MCP SDK, with external AimHarder/Google/mail responses simulated in automated tests. The specification records existing portal/auth/connection/lifecycle test prior art, visual/accessibility review, separate actual-client/provider evidence and local-package/document checks. The skill's test-boundary check was presented to the owner asynchronously; an unanswered check is not treated as approval or execution evidence. Incorporate any subsequent correction before implementation.
