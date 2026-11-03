# AIHarder — animated How to study

Date: 2026-11-02. Implemented prototype; owner-directed continuation of the existing public-home prototype under #95. The question is whether three short, looping UI demonstrations explain connecting, installing and asking clearly.

## Brief and reference lock

Build one directed section on the existing route, in English desktop Light/Dark only. The owner specified the composition and animation, so no competing layout variants or variant switcher are introduced. Existing header, hero and question-wall decisions are locked. Reuse Geist, the existing blue action gradient/border/shadow, Lucide UI icons and authentic local product assets. All data and actions are fictional; the demos never submit credentials, install software or call an account.

| Source | Bounded contribution | Exclusions |
| --- | --- | --- |
| Owner's explicit brief and current AIHarder hero | Three columns, exact “How you get started” heading, no subtitle, navy-to-hero-blue background, UI animation sequences, number/title/description under each preview. | No new naming, overall page redesign, confirmation emphasis or additional product screens. |
| [Arcade](https://arcade.software), Refero style `ba425c3b-729e-48fd-b4d3-c4388123d6bd` | Clean product-demo surfaces, restrained frames and contained interface examples. | Inter, Arcade's brand tokens, complex shadows and screenshot-heavy layout. |
| [Frame.io](https://frame.io), Refero style `6a82f165-eb8e-4a87-a0dd-31593f08128b` | White heading over a full-width dark atmospheric band, then a contained row of product examples. | Violet palette, FrameGothic, heavy nested elevation and cinematic imagery. |
| [Amie onboarding](https://refero.design/pages/e08bc1ed-139f-496b-ba4d-bb0626dc6168) and [Cal connected apps](https://refero.design/pages/3e718e1d-c288-47f9-a8dd-d9325cb8774d) | Compact integration rows, original app symbols and concise per-row actions/status. | Their onboarding navigation, unrelated apps, final provider-specific installation claims and decorative 3D illustration. |

Full archived Refero style/screen records were retrieved before implementation. They supply bounded UI details; the existing product design and owner's animation brief remain primary. HTML/CSS primitives are appropriate for these explicitly requested interface demonstrations; no generated bitmap mockups are needed.

## Decisions

- Reuse the app-integrated Grainient renderer and notice for this site's How to background. The latest owner revision supersedes the first navy band: reuse the hero palette, alpha and wash, inverted vertically. Light runs from blue to pale blue, with a navy `#14283f` title. Dark also inverts the hero field and retains white text for contrast. Step captions use dark ink on the lighter lower Light area and light text in Dark.
- Three equal columns share the existing 1200px content well. Each preview is 320px high, with a clear/light UI surface. Captions place the step number and title together, followed by provisional copy. The title has no subtitle.
- Step 1: original AimHarder logo, a fictional `alex@example.com` username, password bullets, disabled → ready → loading → green/check action. The illustration cursor clicks the ready control. Content fades before values reset.
- Step 2: a clipped six-row list starts with ChatGPT below the viewport. “Other clients” follows ChatGPT with a generic Lucide message-circle. A cursor scrolls the list, hovers ChatGPT to reveal Install, clicks, then shows loading and green/check success. It resets through a fade.
- Step 3: ChatGPT, Claude and Hermes each show a question, thinking dots and a plain-text assistant answer with the correct avatar. Provider tints distinguish them. Both messages fade before the next exchange.
- Shared review Pause/Replay, reduced-motion/still mode, hidden-tab suspension and offscreen suspension apply. Native Pen represents editable stills of the key states; runtime animation stays in HTML.

## Scope and acceptance

Only the existing English desktop Light/Dark pages receive this section. Reuse the retained setup draft location; FAQ, closing/footer drafts and the six other variants remain frozen. The retained setup roots were replaced with the new section. Native roots are `ZLrrd` (Light) and `I95ri7` (Dark), within existing pages `uAXkc` and `p7u8w`. Native readback found all 28 protected roots/sections/drafts unchanged. Owner motion/visual acceptance and production integration remain separate.

## Playback and verification

- Connect loops every 10.5s: username at 0.6–2.05s, password at 2.1–3.1s, enabled blue action at 3.1s, cursor press at 3.7s, loading at 3.85–5.1s, green/check success from 5.1s. The form fades out at 8.9–9.55s and resets while invisible.
- Installation loops every 11.5s: scroll at 1.1–2.8s, reveal Install at 3.2s, click at 4s, loading at 4.15–5.65s, success from 5.65s. Fade/reset at 9.5–10.15s. The cursor tip lands inside the Install control at the click inspection frame.
- Chat cycles three providers over 24s (8s each). Question enters at 0.3s, dots at 1.05–2.1s, answer types at 2.1–3.7s, both messages fade at 6.5–7.2s. Surface tint changes with the provider.
- The demos render at up to 30fps and stop offscreen, when hidden or paused. “Pause steps” and “Replay steps” are review-only controls. The existing global Pause/Replay also affects the demos. The Grainient field follows the shared global Pause, visibility and offscreen behavior.
- `motion=off` and reduced-motion preferences show complete success states at 6.2s. `howAt=<seconds>` freezes an inspection frame and the new background. The OS preference branch was inspected in code; explicit still mode was exercised in-browser.
- Chrome checks at 1200px and 1440px: no horizontal overflow or console warnings/errors, all three provider phases observed, disabled/ready/loading/success phases verified, pause time held stable, and offscreen suspension observed. See [recorded checks](how-to-checks.json). A narrow stack is defensive CSS; mobile Pen/localization remain pending.
- Native visual inspection and [Light](previews/how-to-pen/ZLrrd.png)/[Dark](previews/how-to-pen/I95ri7.png) exports show the editable success composition. Native line-height rounding yields a 684px section versus 683px in HTML. A native visitor initially reported stale Light clipping/bounds; after export, a fresh full-page traversal confirmed the section at y=1192.5px with only the intentionally scrolled app list clipped. This is not a pixel-identical animation import.

JavaScript syntax, changed local references and asset hashes were checked. No runtime/API/MCP behavior changed; production tests and a filler ADR are not appropriate for this isolated design prototype. Existing scope, security and credential-custody decisions are unaffected. Real provider installation, live authentication, mobile/localized propagation and owner motion/visual acceptance remain unverified/pending.

## Delivery review

Two-axis review against `fa244c2...764b5ac`: **Standards 0 findings; Spec 0 findings**. A final local contrast check then darkened the Light descriptions to `#14283f` and removed step-number opacity; sampled caption-background contrast improved from 3.54:1 to 4.93:1 at y=558px. Native Light/Dark text treatment and exports were updated to match. This is the reviewable prototype checkpoint, not owner approval.

## Owner refinement — 2026-11-02

- Replaced the first navy background with the existing hero field inverted vertically, including the same theme colors, opacity, grain and wash. Light title is navy; Dark stays white over its inverted dark field. The earlier navy-to-blue brief/reference table records the initial iteration, superseded here.
- Added **Other clients** immediately after ChatGPT in the second preview, using the existing Lucide `message-circle` icon. The list now scrolls 146px at desktop instead of 80px; cursor targeting follows measured row geometry.
- Replaced the outlined Lucide pointer with a locally authored black arrow/white outline in the macOS style. This is an illustration, not an extracted system asset. Both demo pointers share it; the small white outline is part of the asset rather than a CSS halo. The owner's cursor request supersedes the earlier Lucide pointer choice; UI icons remain Lucide.
- Native English desktop Light/Dark success stills were synchronized, with all 28 protected subtrees unchanged. Runtime inspection at the click frame confirmed the cursor tip inside Install with the added row. Native success stills intentionally have no cursor because it has already faded.

Owner-refinement review against `f85c854...4bf267c`: Standards 0 findings; Spec 0 findings. Syntax, current 75 asset hashes and changed study links passed. No runtime/API/security decisions changed; ADRs remain unaffected.

Top-edge refinement (2026-11-02): How to now has a 1px upper border matching the hero’s lower border exactly: `#79a4dc` in Light and `#2d609b` in Dark. Native Pen uses the same top stroke. Background-only exports omit this separate border. No animation, content, scope or ADR decision changes.

Step-number refinement (2026-11-02): numbers use the same type size and line height as their block titles: 20px / 1.4 at desktop, 18px / 1.4 at the existing ≤1100px breakpoint. They use the existing light brand blue `#2490f4` in both appearances. Native desktop numbers match at 20px. No other content, animation, scope or ADR decisions changed.

2026-11-03 border refinement: removed the question wall’s preceding bottom rule in HTML and Pen, leaving only this section’s existing 1px top stroke, with the hero’s Light/Dark blue colors. See [home polish](footer-study.md#home-polish--2026-11-03). How to content, background and motion remain unchanged.
