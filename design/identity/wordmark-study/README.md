# Wordmark composition study

Prepared 2026-10-29 under [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95), after the owner said the motion set is sufficient and requested a return to brand design. This is an isolated brand composition study, not a public home page or additional product screens. No new images, videos or paid generations were requested.

**Decision update — 2026-10-30:** the owner selected Krona One. This three-font board is now historical comparison evidence. Continue with the [Connect naming study](../connect-study/README.md), which compares consumer product names while retaining `aimharder-mcp` for the technical package. No further motion experiments are requested for this stage.

[Interactive comparison](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/wordmark-study/) requires Tailscale and the local server. [Desktop preview](desktop-preview.jpg) and [mobile preview](mobile-preview.jpg) are actual browser captures. Start the existing directory server from the repository root with `python3 -m http.server 8945 --bind 127.0.0.1 --directory design/identity`; the scoped Serve path `/aimharder-brand-95` proxies that port and preserves other routes.

## Brief and reference lock

Designing a horizontal AimHarder MCP wordmark for web use. Goal: choose the lettering and assess its balance with the established blue 3D kettle, before drawing the single public home-page experiment. Tone: geometric, athletic and approachable. The memorable element is the dark circular face with two orange recessed eyes. The owner requested `AIMHARDER [symbol] MCP`, blue AIM and a different color for HARDER, and previously explored Krona One, Big Shoulders and Aldrich. The generated Krona-inspired direction was liked, while its inaccurate type identity was explicitly noted.

**Primary direction:** the owner's existing wide, low, all-caps wordmark brief and [earlier generated lettering reference](../identity-3d-krona-reference.png). Preserve the color split, centered kettle role and actual selected circular-face character. The earlier image is shown only as a lettering reference; its old face is not the current symbol.

Research used the `refero-design` skill. Three style searches covered playful blue/mascot branding, geometric developer-tool branding and athletic typography. Two full style records were retrieved:

- [GT America](https://www.gt-america.com), Refero `d511736a-a382-41d0-9a7c-0ac678e29237`: borrow the idea of typography as the primary graphic event on white, with a restricted palette. Its typeface, intense blue/orange tokens, packaging collage, CTA treatment and maximalist layouts are not adopted.
- [shadcn/ui](https://ui.shadcn.com), Refero `c14c0a94-1037-449e-bf5b-4cb972656ac7`: retain the existing foundation's quiet white review surface, light separators and restrained supporting text. Its black primary-action role does not replace AimHarder blue, and its system font does not determine the wordmark.

The bundled typography craft reference supports comparing actual glyphs and using distinct display/UI roles. This is a font comparison, not a proposal to deploy three simultaneous brand fonts. The review page uses a system sans for labels; the existing provisional product-UI Geist choice is unchanged.

| Decision | Source / role | Application |
| --- | --- | --- |
| AIM blue, HARDER and MCP navy | Owner's two-color pattern and existing proposed assignment | `#2490F4` / `#14283F`; no new palette exploration. |
| Current sculptural kettle | Owner's selected blue body, dark circular face and orange recessed eyes | Existing neutral master, not the rejected flat cursor-following SVG. |
| Three exact fonts | Owner's earlier named candidates and supplied specimens | Krona One 400, Big Shoulders 600, Aldrich 400. No generated replacement lettering. |
| Comparable cap height | Typography comparison requirement | Normalize from each font's `OS/2.sCapHeight`; do not horizontally stretch glyphs. |
| White board and fine separators | Existing foundation plus bounded Refero references | Keep review controls secondary to the mark. |
| Manual one-shot motion | Limited incidental mascot role | Reuse existing local clips, return to still; no autoplay or cursor tracking. |

## Files and typographic details

[The interactive study](index.html) typesets real lettering, shows a smaller use and all three fonts at a common nominal cap height. It also preserves the generated reference so a preference for custom lettering is not confused with selecting the real Krona One font. Typeface, final tracking, symbol scale and optical spacing remain review candidates. At preparation, the first tab was a starting proposal; the owner subsequently selected Krona One as recorded above.

Fonts are bundled unchanged from the [Google Fonts source](https://github.com/google/fonts): [Krona One](https://github.com/google/fonts/tree/main/ofl/kronaone), [Big Shoulders](https://github.com/google/fonts/tree/main/ofl/bigshoulders), [Aldrich](https://github.com/google/fonts/tree/main/ofl/aldrich). The existing Krona font was reused; the other two were downloaded from that official repository. [Font manifest](font-manifest.json) records file hashes, source URLs and cap-height ratios. Individual SIL Open Font License texts are retained in `assets/`.

- Krona One: Regular 400, cap/em 1563/2048. Wide geometric candidate; proposed as closest to the broad original brief.
- Big Shoulders: SemiBold 600, variable-font optical size pinned to 72, cap/em 1600/2000. More condensed athletic alternative. Optical size is explicit, rather than an assertion that it recreates every setting in the owner's screenshot.
- Aldrich: Regular 400, cap/em 1434/2048. More technical alternative.

On 2026-10-30 the owner requested a 50% larger symbol. The shared `--symbol-scale: 1.5` increases both image/video dimensions and their reserved slot by 50%, while letter sizing and typeface settings remain unchanged. The rendered character is now about 1.86 times nominal cap height (source content inside its image canvas), compared with about 1.24 previously. Narrow screens up to 360px use 12px page gutters so the complete horizontal logo still fits without shrinking its lettering. Small vertical optical corrections accommodate each font's line-box metrics. This is a CSS image/clip composition, not a vector master, alpha extraction or validated 3D mesh. White raster/video backgrounds are retained; reverse/dark-background use is not established.

The static image is the unchanged [neutral master](../video/reference-pack/01-front-neutral.png). The selector references existing quick blink, rock, hop, dance, curious and delight clips. Only the large specimen plays; comparison and small-use marks stay static. Playback requires an explicit button press, uses no loop and restores the shared still on completion or stop. Hidden-page transitions also restore still. A reduced-motion preference displays a static-first explanation; real OS/device acceptance remains pending. This is prototype behavior, not a production runtime contract.

## Verification and boundaries

Initial browser inspection confirmed all three distinct type renderings, type-selection state, unchanged word order, color split and symbol placement. The rock and dance clips played in the fixed logo slot, then returned to the shared neutral still. No media error was reported.

The 2026-10-30 size revision was visually inspected at the normal 1200px browser width. Image and video canvas widths are both about 150.47px, versus 100.31px previously, confirming the 1.5× multiplier at the same letter size. At 390px and 320px the document has no horizontal overflow; the selected Krona logo is about 290px wide within the 350px/296px stage. Desktop/mobile captures were refreshed. The enlarged video played and returned to the shared still without a reported media error. Temporary viewport changes were reset. This does not validate physical mobile devices or all font/motion combinations.

JavaScript syntax, local links, font/media references, checksums and `git diff --check` were checked. No production TypeScript changed and no runtime test suite/typecheck was run for the isolated board. Existing `design/ahmcp.pen` foundation boards remain unchanged; after choosing the wordmark direction, its selected composition can be recorded in that design handoff. No new architecture/security/product ADR is warranted for these reversible visual candidates.

Next review: choose the consumer product name in the Connect study, then refine optical spacing and the production wordmark. Public home-page exploration and the rest of #95 remain later stages.
