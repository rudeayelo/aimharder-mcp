# AIHarder hero — Grainient and flat header mark

Date: 2026-11-01. Current desktop English Light/Dark HTML trial under #95.

The owner supplied a React Bits Grainient export and requested adapting it as the hero background, reducing header/hero vertical spacing, lowering the reply's background opacity and making a flat header mascot: navy kettle silhouette, white circular face, navy eyes. This refines the existing home prototype; no additional product screens or locale/device variants were created.

## Reference and decisions

| Decision | Reference | Implementation |
| --- | --- | --- |
| Flowing blue/white grain | Owner's component export and [official Grainient](https://reactbits.dev/backgrounds/grainient) source | Adapt the supplied WebGL2 field/composite shaders to the existing HTML prototype, preserving the requested palette/settings without adding React dependencies. |
| Text legibility | Existing AIHarder palette/type roles and the owner's hero | Use the gradient across the complete hero width, including behind the pitch. Keep the top edge fade and a blue bottom boundary; retain readable foreground tokens. Dark uses the existing navy base with the same blue accent. |
| Compact spacing | Owner's density request | Header minimum content height 120 → 88px; hero padding 72px top / 64px bottom → 32px each. The 1px header rule makes its measured total height 89px. Shared horizontal gutters stay aligned. |
| Translucent reply | Owner's opacity request | Surface alpha 90% → 60% in both themes. Keep 12px backdrop blur, border, asymmetric corner and the established compact message stack. |
| Flat header mark | Owner's explicit three-color construction, existing neutral kettle | Vectorize the existing alpha silhouette, including the handle hole. Use `#14283F`, a white face circle and navy rounded eyes. Dark adds a 0.5px-equivalent light keyline for separation while keeping those fills. |

## Artifacts and reproduction

- [Live HTML trial](hero-motion-prototype.html?theme=light&reply=long), [Light capture](previews/hero-grainient-light.png), [Dark capture](previews/hero-grainient-dark.png), [checks](hero-surface-checks.json).
- [Static composition](hero-graphic-still.html?theme=light&state=answer) uses the same spacing, mark, alpha and a still shader background. The character/typing animation remains exclusive to the motion prototype.
- [Flat SVG Light](assets/kettle-flat-light.svg) / [Dark](assets/kettle-flat-dark.svg), reproducible with [render-flat-mark.html](render-flat-mark.html). The exporter reads the unchanged neutral poster alpha at threshold 160, traces closed contours, simplifies at 1.4px and smooths the vector outline. No raster retouch, generated replacement mascot or manual silhouette drawing is used. Face/eye geometry is deliberately flat as requested.
- [Background mount](hero-background-mount.js), [app-integrated renderer](grainient-background.js), [upstream notice/license](vendor/README.md).

The requested values are retained: white / `#0065e0`, angle 180, flow 0.8, silk 0.5, grain 0.08, scale 1.4, grain size 1.3, saturation 0.99 and stir 0.95, with intro/click swirl disabled. Light mode is enabled only for Light; Dark uses `#0d1521` as its first color. Background layer opacity and the top edge fade integrate these colors with the existing page instead of changing text/CTA roles.

The background has one tracked render loop, stops when paused/hidden/offscreen, renders still for reduced motion or `motion=off`, caps DPR at 1, and limits scheduling to 30fps. These are implementation limits, not a measured device performance guarantee. The existing 3D/typing clock is unchanged. A CSS gradient remains when WebGL2 is unavailable; actual context-loss/device fallback was not exercised.

## Verification and boundaries

Inspected Light/Dark at 1440px and Light at 1200px; no horizontal overflow or console warning/error was observed. Both themes load the new SVG header mark and two render canvases (background plus kettle) during normal motion. Measured reply fill is 60% alpha. Background time/frame advanced during Play, then remained at 0.862/90 across later reads after Pause. The `motion=off` branch shows the complete answer/poster and a still background. Actual OS preference changes and physical-device GPU/perceptual acceptance remain unobserved.

The existing pen file and native exports were modified before this turn and were preserved. These latest changes are HTML-only; no new pen sync is claimed. Other home variants, API behavior, authentication, deployment and npm dependencies are unchanged. The public-repository/MIT ADR was reviewed: project-authored server licensing and npm contents remain unchanged; the app-integrated third-party source retains its own notice. No new architecture/security/distribution decision or ADR is needed for this visual study.

Review found and fixed incomplete initialization cleanup: missing WebGL or failed shader/program setup now removes the canvas and releases allocated resources so it cannot cover the CSS fallback. API-stub smoke checks exercised both failed initialization branches (all allocated shaders/programs released); these do not replace an actual GPU/context-loss exercise. Standards and Spec review have no residual actionable findings. JavaScript syntax, 57 asset hashes, vendor/capture hashes and local documentation links were checked. No production server test suite was run for this isolated design prototype.

## Full-width background correction — 2026-11-01

The owner requested that the gradient cover the whole hero instead of appearing only on the right. Removed the horizontal white/navy overlays in both HTML sources and themes; the same shader now remains visible behind the pitch, central character and message stack. Top/bottom boundary fades remain. The Light support copy uses the existing ink token to stay readable over the blue. No shader, motion timing, page geometry or native pen changes are involved.

Verified the full-width correction visually in Light/Dark at 1200px. The background and hero each measured 1200px wide; computed overlays contain only the vertical fade and neither page overflows horizontally. The linked surface captures now show this correction. Earlier 1440px observations refer to the preceding surface revision. No ADR change is required for this visual correction.

## Blue lower boundary — 2026-11-01

The owner requested blue from the very bottom of the hero grading toward white above, with a blue-tinted lower boundary. Removed the bottom-to-white fade in both HTML sources/themes. The existing 180-degree Grainient palette now reaches the final bottom pixel; only the upper blend remains (white in Light, page navy in Dark). A 1px blue border closes the hero (`#79a4dc` Light / `#2d609b` Dark), replacing the adjacent review-footer divider to avoid a double rule. The prior full-width study’s retained bottom fade is superseded here. No shader, timing, API, native pen or architecture/ADR changes are involved.

Verified Light/Dark at 1200px: the gradient remains blue at the lower edge, the 1px border uses the theme-specific blue and the adjacent footer has no second top border. Computed styles confirm a top-only fade and no horizontal overflow. Captures/checks are updated; broader runtime tests are unnecessary for this CSS-only refinement.

## Pale upper blue, softer bubbles, wider contact and Hermes avatar — 2026-11-01

The owner's subsequent notes requested a very pale blue upper hero distinct from the white header, bubble colors suited to the background with slightly smaller radii and subtle shadows, and a darker/wider kettle shadow. The owner also asked how to harmonize Hermes with the other client symbols.

- Light now uses a `#e8f2ff` upper color wash fading out across the hero height, with the same pale-blue CSS fallback start. The underlying Grainient palette is unchanged; its blue lower edge/border remains. Dark retains its navy upper blend. This supersedes the preceding white upper blend.
- Incoming bubbles use `#d9e9ff` / `#203d5e`; replies and thinking use `#f8fbff99` / `#142b4599`, retaining 60% surface alpha and 12px blur. Major radii fall from 24 to 18px while the 6px distinctive corner remains; thinking uses 16px. A shared 0/3/12px shadow has 7% blue-black alpha in Light and 15% black in Dark, with a soft blue-tinted reply border.
- The outer kettle shadow grows from 236 to 300px (210 to 266px at the narrower desktop size), and the core from 180 to 224px (154 to 198px narrow). Both centers stay fixed; height/blur and the existing hop-linked transform/opacity behavior remain. Light outer alpha rises from 20% to 30%, core from 25% to 35%; Dark uses 65% / 70% black.
- Hermes retains the original girl portrait with a CSS-only circular 20px avatar, grayscale and 0.8 contrast. The shared Works with row opacity remains 65%. No source asset was retouched or replaced. A simplified vector portrait is an alternative proposal, not a generated or approved asset.

Inspected the combined refinements in Light/Dark at 1200px. Computed styles confirmed the pale upper wash, 18px/6px corners, subtle shared shadow, 266px centered shadow footprint and Hermes' original asset/20px/circular/contrast treatment; neither view overflows. Captures/checks are updated. These remain desktop English HTML refinements; no native pen, product API, architecture or ADR change is involved.

## Inverse incoming message and exact shared shadow — 2026-11-01

The owner requested a navy initial message with white text and the exact shadow `rgba(0,0,0,0.1) 0px 4px 6px 0px` for buttons and bubbles. Both HTML sources now use `#14283f` / white for the incoming bubble in both themes. Primary product buttons and all three bubble states use that single shadow, superseding the earlier inset/drop combination and the softer bubble shadows. Button gradients/borders, reply translucency, corner radii, mascot contact shadow, motion and layout remain as before. Prototype review controls are outside the product design. No native pen, API or architecture/ADR changes are involved.

Verified Light/Dark at 1200px: the initial bubble computes to navy/white and header/hero primary buttons plus question/thinking/answer bubbles all compute to the exact requested shadow. Updated captures and metadata record this CSS-only revision; no broader runtime checks are required.

## WOD and user-supplied themed SVGs — 2026-11-01

The current fictional example uses **WOD** rather than CrossFit, including its optional longer answer and complete accessible label. Hermes and OpenClaw now use the unmodified SVG Light/Dark artwork from the owner's selfh.st Dashboard Icons links, superseding the trial portrait crop and the earlier OpenClaw derivative. The icons share the row's 24px size and 65% opacity with no bespoke crop/filter. The source variants are mapped to contrasting UI themes by inspecting their black/white fills; see [asset notices](assets/README.md) for URLs, revision, license and the mapping. Required selfh.st/CC BY 4.0 attribution is in the review footer, outside the product hero.

Browser verification in Light/Dark at 1200px confirmed both SVGs loaded, correctly contrasting variants, 24px widths, no filters/circular crop, WOD in the short/long/accessible example, and no horizontal overflow or observed console warnings/errors. Current long-copy length is 201 characters. The entry-script revision changes with the copy to avoid stale cached text. Source SVGs, source hashes, complete collection license, captures and metadata are retained. The original photo and other assets stay available to frozen variants. No native pen, API, architecture/ADR or npm-dependency changes are involved.
