# Visual foundations — work in progress

Current stage, 2026-10-30: the owner selected **AimHarder Connect** and **Krona One**, requested English/Spanish, Light/Dark/System and Lucide icons, and authorized the first home design in pen.dev. [design/ahmcp.pen](ahmcp.pen) now contains eight editable home-page representations (desktop/mobile × English/Spanish × Light/Dark), a shared wordmark and a preference/FAQ/focus state board. The [home handoff and previews](home-study/README.md) record source references, copy, contrast checks and remaining acceptance. This is a first visual candidate, not a functional website or a complete #95 delivery. Confirmation configuration stays in later settings work aligned with PR #121; the home does not emphasize it. The original provisional foundations are retained. `aimharder-mcp` remains the technical npm package.

Latest revision: the owner requested aligned header/body containers, a 25% larger logo, invitation-only wording in FAQ only, four animated hero conversations, an MCP-app logo strip and graphical setup steps. The [home prototype and handoff](home-study/README.md#latest-owner-directed-revision) make this reviewable in English/Spanish and light/dark/system modes, with a cycling Lucide theme button. The pen.dev editor did not respond, so `.pen` synchronization remains pending; existing canvas frames/exports still show the preceding checkpoint. The functional prototype is isolated from production and uses fictional data.

Design source: [ahmcp.pen](ahmcp.pen). Issue [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95), under [#103](https://github.com/rudeayelo/aimharder-mcp/issues/103).

## Review sequence — historical foundation checkpoint

The owner narrowed the current delivery on 2026-10-29: define basic visual elements first, then compare two identity trials made with GPT Image, then try one public home page. Define the remaining screens only after that exploration. The complete #95 inventory remains outstanding. No final navigation, identity or screen design is selected by this checkpoint. The subsequent [kettlebell robot identity trials](identity/README.md) are now available for review; neither has been selected.

At the historical foundation checkpoint, the editable file contained two foundation boards and three shared components: primary action, labeled input and status message. The later home frames are described above. Text and UI examples use fictional data. The components illustrate appearance, not working controls.

## Provisional reference lock

Use the white canvas, typographic hierarchy, Geist family, fine separators and flat controls from the archived [shadcn/ui reference](https://ui.shadcn.com), Refero style `c14c0a94-1037-449e-bf5b-4cb972656ac7`. Its role is visual structure, not its complete navigation or black primary action. The owner-requested AimHarder blue is an explicit palette adaptation. Use generous mobile-friendly controls rather than copying its compact component catalogue.

Revisited Strava (`94a3b2a6-2f79-4721-a2f5-6c5baaff8db9`) and Cron (`0528b40d-d5ef-4783-9206-d42fa97ad1d2`) style records for comparison. Their orange and full dark-brand directions remain unselected; the later owner-required Dark appearance is a theme of the selected blue identity, not adoption of those alternatives. Do not import their photography, calendar UI or brand assets. No custom imagery is required for these foundation boards.

Metaview, Cal, Cursor flow 9917, Linear and Family were retrieved again for later bounded interaction work. Their roles remain those in the [research record](../docs/research/2026-10-28-product-experience-references.md); no screen or navigation decision is final here.

## Candidate tokens and rationale

The official [AimHarder homepage](https://aimharder.com/) was checked again on 2026-10-29. It still links [main-CbA3Gj31.css](https://aimharder.com/new-web/assets/main-CbA3Gj31.css), declaring `--color-ah-blue:#2490f4`. This is observed CSS, not a certified brand guide. Its task hover `#1a7dd6` and tooltip accent `#004aad` are not assumed to be general secondary brand colors.

| Role | Candidate | Reason |
| --- | --- | --- |
| Brand | `#2490F4` | Official observed blue; identity emphasis, not white small-text buttons. |
| Primary action / links | `#1765B0` | Derived darker blue for accessible white labels; links also underlined. |
| Hover / pressed | `#12528F` / `#004AAD` | Darker interactive states. These roles are project proposals. |
| Focus | `#004AAD` | Project-proposed dark ring, with a white separation gap. |
| Orange accent candidate | `#FFAB62` | Warm counterpoint to blue, with dark text; exact role awaits identity exploration. Never substitute for semantic warning/success. |
| Canvas / secondary surface | `#FFFFFF` / `#F4F7FA` | Bright foundation and restrained grouping. |
| Primary / supporting text | `#14283F` / `#516174` | Readable cool neutrals. |
| Divider / control boundary | `#CFD8E3` / `#73849A` | Decorative separators are lighter; interactive boundaries remain distinguishable. |
| Selection | `#E9F3FE` with `#1765B0` | Pair with a visible selection marker or label. |
| Success | `#176443` on `#EAF5EF` | Named verified state, separate from setup suggestion. |
| Error | `#B42318` on `#FFF0EE` | Error explanation and actionable next step. |
| Warning | `#805000` on `#FFF4DE` | Named attention state, separate from orange brand exploration. |

Krona One Regular 400 is selected for the wordmark. Geist 400/500/600 remains provisional for product UI; the display-font decision does not replace the UI family. Body is 16px with 1.5 line height; supporting copy 14px; labels/captions 13–14px; headings 24/32/36px; future display candidate 56px. Use a 4px spacing base, 16–24px task gaps, 10px control corners, 14px grouping corners, 48px control height and minimal elevation. Monospace belongs only to public configuration values when those are designed.

## Measured contrast

Calculated using sRGB relative luminance and `(lighter + 0.05) / (darker + 0.05)`; rounded to two decimals. Candidate normal text pairs meet 4.5:1.

| Foreground / background | Ratio |
| --- | --- |
| Primary text / white | 14.95:1 |
| Supporting text / white | 6.34:1 |
| Supporting text / secondary surface | 5.90:1 |
| White / primary action | 5.96:1 |
| White / hover | 7.99:1 |
| White / pressed | 8.13:1 |
| Primary text / orange | 8.01:1 |
| Action text / selected surface | 5.31:1 |
| Success text / success surface | 6.40:1 |
| Error text / error surface | 5.93:1 |
| White / destructive action | 6.57:1 |
| Warning text / warning surface | 6.28:1 |
| Control boundary / white | 3.82:1 |
| Focus ring / white | 8.13:1 |
| Focus ring / selected surface | 7.25:1 |

White on brand blue is **3.30:1**: do not use for normal text. Primary dark text on that blue is 4.53:1; the darker action blue gives greater margin for button labels. Disabled controls use primary dark text on the divider surface; avoid the supporting text pairing there (4.40:1).

## Review evidence and limits

- Opened and saved the source through the pen.dev MCP editor. All design objects remain editable; common controls use shared references and tokens.
- Rendered and visually inspected both boards. The rendered previews show readable hierarchy and no visible clipping or overlap. The editor's bounds visitor still flags some nested auto-layout elements as clipped despite their complete appearance in the renders; resolve/recheck those bounds before promoting the foundations into screen layouts. Do not treat this as a clean structural QA pass.
- Previews: [foundations](previews/NXGWi.png), [controls and states](previews/Bjaja.png).
- State samples include default, hover, pressed, disabled, focused, invalid credentials, verified connection, pending authorization and expired invitation. They are specimens, not a complete state inventory.
- Focus requires a 3px ring with a 2px white gap in implementation. The current drawing illustrates the ring; the gap and actual keyboard behavior still need verification. Keep visible labels, inline error association, focus restoration, underlined links and 48px touch targets. Static artwork cannot establish keyboard or screen-reader behavior.
- No runtime, API, auth, MCP, provider, support-inbox or deployment behavior changed. No API research update is needed. Reviewed identity/custody, client authorization, invited admission, activity-role, self-service and hosted Madrid ADRs; their decisions are unchanged, so no new ADR is warranted for these reversible visual candidates.
- No behavioral tests were added: this checkpoint changes design/documentation only. Full implementation verification belongs to subsequent deliveries. Two subsequent GPT Image trials are linked above; the public home-page experiment, mobile layouts, final navigation and the remaining #95 inventory have not been produced.

Next review: assess the first public-home designs, copy and proportions before implementation or the remaining screens. Earlier foundation and image-comparison observations above retain their historical scope.
