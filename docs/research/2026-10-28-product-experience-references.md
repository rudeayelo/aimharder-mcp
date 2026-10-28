# Product experience references

Research date: 2026-10-28. Status: research and design proposals; no final visual direction, screen design, implementation or deployment approval.

Later owner steering on the same date: [design ticket #95](https://github.com/rudeayelo/aimharder-mcp/issues/95) delegates the final palette and navigation. Adopt AimHarder's blue as the starting direction and evaluate a complementary accent such as orange. The earlier teal/orange alternatives below remain historical research inputs, not an approved palette or a prerequisite for another owner-choice round.

## Brief and evidence boundary

Designing the public website and invited-participant portal for **AimHarder MCP**, primarily for members of the owner's gym who want to use AimHarder through an AI chat. The portal explains the service, guides self-service setup and manages connections. Sporting queries and actions remain in the AI chat. The intended domain is `ahmcp.link`; selecting it for a design does not establish a production deployment.

The accepted brief is recorded in [Product experience design](../product-experience.md). Its constraints include concise instructions for each client, independent client disconnection, mobile-first attention to invitation/sign-in/upstream connection, English project copy, and no time-zone controls or explanations in the frontend. Existing backend safeguards and unresolved engineering work are not replaced by visual references.

Research used Refero's connected API to search archived **web screens** from four angles: integration setup, setup checklists, connected-account settings, and FAQs. A fifth search covered connection flows. Full details were retrieved for four selected standalone screens and Cursor flow **9917**. Raw screenshot images were visually inspected for all six selected screens and the flow's intermediate connecting screen.

These are observations of archived product captures, not claims about the products' current features, availability, responsive behavior or implementations. Refero's generated descriptions include estimated colors, suggested animations and hypothetical behavior; those suggestions are not treated as observed evidence. No capture date was supplied by the retrieved records. Original page URLs below identify captured context rather than live destinations that were tested.

## Selected screen references

### 1. Metaview: current setup task with visible progress

Source: [Refero screen 2caa9aa9-e38f-4210-b5f7-3a50668133e8](https://refero.design/pages/2caa9aa9-e38f-4210-b5f7-3a50668133e8). Captured context: `my.metaview.app/onboarding`. Full screenshot inspected.

**Observed:** a narrow left setup checklist and a wider current-task panel. Completed steps have checkmarks; the current substep is emphasized. The task panel names the connection goal, gives a short explanation and presents the available provider actions. A support email appears beneath the setup container.

**Proposed adaptation:** use the accepted three-task sequence—connect AimHarder, connect an AI client, try a useful query—to orient initial setup. Let the main panel focus on the next task, rather than filling Home with statistics. On mobile, propose a compact progress summary above the task instead of assuming the archived desktop layout scales unchanged.

**Reject:** Metaview's interview-specific substeps, referral task, timing promise and security/compliance badges. This screenshot is an onboarding reference, not evidence of a returning-user home. An authorization alone cannot mark the first sporting query as completed.

### 2. Cal: scan provider choices and their prerequisites

Source: [Refero screen 3e718e1d-c288-47f9-a8dd-d9325cb8774d](https://refero.design/pages/3e718e1d-c288-47f9-a8dd-d9325cb8774d). Captured context: `app.cal.com/getting-started/connected-video`. Full screenshot inspected.

**Observed:** one focused column with a heading, a short purpose statement, a compact step indicator and provider rows. Each row pairs a recognizable provider name/icon with its own Connect action. A work/school-account prerequisite is attached to the Microsoft row, where it matters. A separate Next Step button sits below the list and appears disabled in the captured state.

**Proposed adaptation:** make client choice easy to scan, then reveal only the chosen client's concise instructions. Put plan/workspace/version prerequisites beside that client. Include the accepted Other clients option with concrete requirements. The previously accepted [Mamitsu reference](../product-experience.md#current-implementation-baseline) remains the direct precedent for switching the instructions when the client selection changes; this Cal capture supports the choice list, not an observed instruction switch.

**Reject:** a large integration marketplace and unsupported parity claims. A uniform-looking Connect button must not conceal materially different manual steps. Do not infer the reason for the disabled button from the screenshot.

### 3. Linear: separate connection purposes within settings

Source: [Refero screen 6faefb43-55c6-4c99-a36c-19b02bbea27c](https://refero.design/pages/6faefb43-55c6-4c99-a36c-19b02bbea27c). Captured context: `linear.app/refero-design/settings/account/connections`. Full screenshot inspected.

**Observed:** Connected accounts is a distinct settings destination. Service sections have a heading, a brief explanation and an action row. The service name and action remain aligned consistently while the explanatory text describes each connection's purpose. The captured rows show Connect actions, not a demonstrated revocation journey.

**Proposed adaptation:** group portal access, AimHarder connection and authorized AI clients under Settings while preserving their distinct identities and effects. Give each group one plain-language explanation and explicit actions. State the scope of disconnection at the point of action.

**Reject:** Linear's large project-management sidebar, review switch and alpha badge. Do not add feature controls, sporting data or diagnostic panels to participant settings merely because other products have them. The independent revocation requirement comes from this project's accepted decisions, not this screenshot.

### 4. Family: questions first, contact after self-service answers

Source: [Refero screen 5ab0d7a8-a7aa-42f9-984f-ca3491fe9d70](https://refero.design/pages/5ab0d7a8-a7aa-42f9-984f-ca3491fe9d70). Captured context: `family.co/faqs`. Full screenshot inspected.

**Observed:** a narrow, left-aligned question list with thin separators and plus/minus controls. One expanded answer appears directly beneath its question and contains relevant links. A separate contact section follows the questions. The page also displays an update date.

**Proposed adaptation:** use a small set of concrete access/privacy questions on the public page. For participant recovery, put short state-specific answers beside invitation, sign-in and connection forms, with the accepted support email as the fallback. Keep answers and links close to the question instead of creating a large documentation hub by default.

**Reject:** crypto content, importing secrets, the long question inventory and decorative contact illustration. An accordion is a candidate pattern, not a settled requirement. This capture does not resolve whether Help deserves a primary navigation position; that branch remains open in the interview.

### 5–6. Cursor: retain the list and change the affected row

Sources: [integration list, ce9cd873-7c38-476d-887e-7477d446ba89](https://refero.design/pages/ce9cd873-7c38-476d-887e-7477d446ba89), and [connected state, 99c819dd-2796-4cc0-886b-c8ca065d717b](https://refero.design/pages/99c819dd-2796-4cc0-886b-c8ca065d717b). Both belong to [Cursor flow 9917](https://refero.design/flows/9917). Both full screenshots inspected.

**Observed:** the first screen presents a small Review Settings list with provider names, one-line purpose descriptions and aligned Connect actions. In the later capture, the same GitHub row gains a connected-account line and a Manage control; the other rows retain their positions and actions. Continue remains a separate action below the list.

**Proposed adaptation:** after client authorization, return to a recognizable client/connection context and update the relevant installation with its actual state and management action. A returning Home can summarize connections and the next useful action without showing a training dashboard. Use explicit connection names where installations need independent management.

**Reject:** Cursor's developer integrations, cloud-agent features, broad marketing navigation and near-identical styling. A connected badge must represent a current authorization or verified upstream connection as appropriate; it cannot imply that every query works or that a write was confirmed.

## Journey logic: Cursor flow 9917

Source: [Integrations Review and Connect](https://refero.design/flows/9917), retrieved with `refero_get_flow`. Three archived steps and all three raw screenshots were reviewed:

| Step | Archived evidence | Proposed lesson for AimHarder MCP |
| --- | --- | --- |
| Review | [Integration list](https://refero.design/pages/ce9cd873-7c38-476d-887e-7477d446ba89): provider rows and Connect actions | Begin with a choice and explain what it enables. |
| Connect | [Connecting state, e9202e93-a8a4-44a8-9f6b-45aa7ae53cc2](https://refero.design/pages/e9202e93-a8a4-44a8-9f6b-45aa7ae53cc2): explicit Connecting to GitHub message and progress glyph | Name the current operation during a real pending state; keep cancellation/recovery understandable. |
| Return | [Connected state](https://refero.design/pages/99c819dd-2796-4cc0-886b-c8ca065d717b): same row with account context and Manage | Confirm the specific connection and expose its next management action. |

The archive supports this sequence of visible states. It does not show the authorization exchange, error handling, cancellation, retries, timing or mobile behavior. Those must be designed from this project's requirements and tested independently. Do not infer a current Cursor capability or a particular OAuth mechanism from the capture.

For this product, self-service configuration generation and callback handling remain engineering work. Copyable public configuration can support the journey, but no selected screenshot proves that a single button or server URL completes every MCP client setup. The first-query prompt remains the accepted **What classes can I book tomorrow?**; its answer must distinguish schedule availability from confirmed booking eligibility.

## Proposed synthesis and decision ledger

The dominant interaction reference is **Cursor's connection list and return state**. Metaview contributes only setup orientation, Cal contributes provider selection and prerequisite placement, Linear contributes connection-purpose grouping, and Family contributes compact answers followed by contact. Visual style selection is separate; do not blend these products' palettes or copy their complete navigation.

| Proposed choice | Evidence or accepted requirement | Boundaries |
| --- | --- | --- |
| Show the next setup task with concise progress | Accepted three-task onboarding; Metaview capture | No fabricated query-success check or onboarding time promise. |
| Select a client before showing its guide | Accepted client-specific instructions and Mamitsu interaction; Cal provider rows | Only verified requirements/support claims; keep Other clients conditional. |
| Preserve connection context after authorization | Cursor flow 9917 | Current authorization is distinct from upstream connection and query success. |
| Explain the purpose of each settings group | Established domain model; Linear capture | Portal account, AimHarder connection and client authorization keep separate lifecycle actions. |
| Use short FAQs and a contact fallback | Accepted public-page/privacy structure and support email; Family capture | Help placement and final question inventory remain proposals. |

These are recommendations for the next interview and reference lock, not additional owner-accepted decisions. The complete screen inventory, final copy, visual language and engineering acceptance still require resolution. No design file or runtime behavior was changed during this research.

## Visual direction research

Three style searches covered a broad restrained SaaS direction, fitness products, and known developer-product brands. Three full style records were then retrieved with `refero_get_style`: shadcn/ui, Strava and Cron. These records describe archived/reference visual systems; they are not live-site audits, exact pixel specifications or proof of accessible color combinations. The three written directions below are alternatives, not a blended design. No bitmap mockups are needed to choose between them; the final deliverable is editable UI in pen.dev.

### A. Light interface with the existing teal action color — initial unselected recommendation

Primary style reference: [shadcn/ui](https://ui.shadcn.com), Refero style ID `c14c0a94-1037-449e-bf5b-4cb972656ac7`.

**Preserve:** bright white canvas, strong near-black text, fine neutral separators, consistent form geometry and a single sans-serif family. The source owns canvas, typography and form structure, not product content or navigation. Keep the accepted participant-facing copy and generous spacing rather than importing a dense component catalogue.

**Borrow only:** Cursor's stable connection-list/return pattern; the current [portal](../../hosted/src/portal.ts) owns the teal `#145d54` used for primary actions and links. This explicitly bounded reuse of existing product color is the chromatic exception to the monochrome style foundation. Do not reuse semantic error or success colors as brand decoration.

**Proposed tokens:** background `#ffffff`, primary text `#0a0a0a`, supporting text `#525252`, borders `#e5e5e5`, secondary/configuration surface `#f2f2f2`, action teal `#145d54`. Geist at 400/500/600, with body text at 16px for readable mobile forms; monospace only for configuration values. Controls use a 10px radius and grouping surfaces may use 14px. Prefer separators and aligned rows over many enclosing cards. Spacing follows a 4px base, with 16–24px within tasks and larger gaps between distinct sections.

**Media:** real editable product UI and clearly labeled fictional conversation examples. Functional monochrome icons; no required lifestyle photography or custom illustration. Preserve the source's explanatory, text-first media role.

**Reject:** a heavy application sidebar, decorative gradients, statistic tiles, sports charts, and importing every source component into a small portal. This direction fits the accepted sober/approachable brief with the least new brand machinery.

### B. White interface with an athletic orange accent

Primary style reference: [Strava](https://strava.com), Refero style ID `94a3b2a6-2f79-4721-a2f5-6c5baaff8db9`.

**Preserve:** white/near-black contrast, assertive Inter headings, 4px control radii and orange `#fc5200` reserved for primary actions/active navigation. Retain large real training photography on the public page if this is chosen as the dominant direction; it is a central source role, not an optional decorative ingredient. Photography must be licensed and must not imply actual participants or product evidence. Settings remain a functional light interface.

**Borrow only:** Cursor's connection-state continuity and Family's compact question/answer structure. Keep their palettes and illustrations out of this direction.

**Media and tokens:** source-style photography plus the product's conversation examples; white background, near-black text, light neutral separators and one orange interaction accent. Use dark `#21211f` text on orange buttons to meet the checked contrast target rather than copying inaccessible white-on-orange small labels. This is an explicit accessibility correction, not a semantic repurposing of orange.

**Reject:** Strava branding, open-signup messaging, leaderboards, sporting dashboards and claims of a community larger than the invited pilot. This option creates a stronger athletic identity but requires additional media and brand work.

### C. Dark interface with an orange action accent

Primary style reference: [Cron](https://cron.com), Refero style ID `0528b40d-d5ef-4783-9206-d42fa97ad1d2`.

**Preserve:** near-black `#0f0d0a` canvas, `#161412` secondary controls, white primary text, `#cccccc` supporting text and orange `#ff4700` limited to primary actions. Use a system sans-serif, clear section spacing and precise 4px controls. The source's explanatory media role is a contained product/conversation example, not lifestyle photography.

**Borrow only:** the same bounded connection-list and FAQ patterns. Use dark text on orange buttons for the checked contrast target; do not copy malformed or inaccessible tokens from generated style metadata.

**Reject:** atmospheric glow, giant display type inside settings, terminal styling for ordinary instructions and a second accent palette. This is a distinct alternative to the recommended light direction, not a commitment to supporting both themes.

### Contrast spot checks and design acceptance

Calculated sRGB contrast for the proposed pairs:

| Text / surface | Ratio |
| --- | --- |
| White / existing teal `#145d54` | 7.71:1 |
| `#0a0a0a` / white | 19.80:1 |
| `#525252` / white | 7.81:1 |
| `#21211f` / orange `#fc5200` | 4.87:1 |
| `#0f0d0a` / orange `#ff4700` | 5.69:1 |
| `#cccccc` / near-black `#0f0d0a` | 12.08:1 |

These checks cover text pairs only. They do not establish component-boundary/focus contrast or accessibility of a finished design. The selected `.pen` direction must subsequently be checked for mobile/desktop layout, readable copy, focus/selected/error/disabled states, touch targets and clipping. Illustrate only product states that the implementation can distinguish, or explicitly mark required engineering work.

### Initial reference-lock proposal and current handoff

The initial recommendation was **A** as the visual foundation, with **Cursor flow 9917** owning connection-state continuity, **Metaview** contributing setup orientation, **Cal/Mamitsu** contributing client choice, **Linear** contributing purpose-based settings groups and **Family** contributing the FAQ accordion/contact sequence. Each reference has a bounded job; this is not a palette average or a copy of another product. The owner did not select A and subsequently directed the design toward AimHarder's blue.

The final reference lock and navigation are delegated to #95. Design file location: `design/ahmcp.pen` in this checkout. Within the accepted brief, resolve the final direction and design the public page; invitation/sign-in/recovery; setup/current-task and returning-home states; client-specific and generic connection guides; account/AimHarder/client settings; FAQ; administrator views; and transactional email layouts. Include desktop and mobile representations plus relevant pending/error/empty/confirmation states. Present the concrete design for owner review. Do not imply implemented self-service registration, query-success tracking, active support mail or production availability merely by drawing the intended experience.

### Official blue evidence for the design ticket

Anonymous inspection on 2026-10-28 found the [official AimHarder homepage](https://aimharder.com/) linking [main-CbA3Gj31.css](https://aimharder.com/new-web/assets/main-CbA3Gj31.css), which declares `--color-ah-blue: #2490f4` and `--color-task-primary: #2490f4`. This is a strong starting point for the palette, not a certified brand guide.

The same stylesheet names `#1a7dd6` as task-primary hover and `#004aad` as tooltip accent. Preserve those observed roles when evaluating them rather than assuming all blue shades are general brand tokens. Recheck the current official asset before finalizing the palette; hashed asset URLs can change. No orange shade or color-combination contrast has been selected for the final blue-based design.

At this checkpoint, no `.pen` file or final screen design has been created. Frontend/backend implementation, provider activation and publication are distinct from producing the design artifact and updating its documentation.
