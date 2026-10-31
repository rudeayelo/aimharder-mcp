# Connect naming and wordmark study

Historical comparison. On 2026-10-31 the owner selected **AIHarder** as the working consumer name, using the existing standalone composition with the kettle on the left. The [current home refinement](../../home-study/desktop-refinement.md) applies it only to English desktop Light/Dark while the design is refined. This original naming board is retained as evidence.

Prepared 2026-10-30 for #95. The owner selected **Krona One** and ended further motion experiments for this stage. This is a static naming/composition comparison before the public home-page study.

[Open through Tailscale](https://mini.taild6f227.ts.net:8443/aimharder-brand-95/connect-study/). Reuses the existing `design/identity` server on localhost:8945 and its scoped Tailscale route. No new hosting or deployment is introduced.

## Brief and reference lock

Designing the consumer product wordmark while retaining `aimharder-mcp` as the technical npm package. The owner's proposed product name is **AimHarder Connect**; **AIHarder**, without CONNECT, is the alternative made by removing the M. The owner subsequently selected AimHarder Connect as the working name; AIHarder is retained as an alternative, not the current home-page build target. Package/repository names, MCP identifiers, authentication and runtime behavior are unchanged.

Primary build target: the [existing actual-font wordmark composition](../wordmark-study/README.md), narrowed to owner-selected Krona One 400. Preserve the white review surface, blue AIM / navy HARDER, established enlarged blue sculptural kettle, orange recessed eyes and horizontal composition. For AIHarder, the retained AI prefix takes the same blue role. CONNECT takes the former navy MCP role. The standalone AIHarder variant places the same kettle to the left of the name, following the owner's 2026-10-30 placement refinement.

Refero research refreshed two searches and full records on 2026-10-30: [GT America](https://www.gt-america.com), style `d511736a-a382-41d0-9a7c-0ac678e29237`, for type-led specimens on white; [shadcn/ui](https://ui.shadcn.com), style `c14c0a94-1037-449e-bf5b-4cb972656ac7`, for quiet separators and secondary labels. Their fonts, action colors, imagery, component catalogues and site layouts are not imported. The bundled typography/visual-QA references support real font files, consistent cap height and explicit rendered inspection.

| Decision | Source / role | Application |
| --- | --- | --- |
| Krona One Regular 400 | Explicit owner selection | Actual existing local font; no generated lettering or alternative font tabs. |
| Blue prefix / navy remainder and CONNECT | Owner's original two-color pattern | Existing `#2490F4` / `#14283F`; removing M does not introduce a new color. |
| Enlarged sculptural symbol | Existing wordmark study and selected circular-face character | Same static neutral master and 1.5× symbol multiplier; no new motion or image generation. |
| Two naming specimens | Owner's two naming ideas and explicit standalone-name correction | AIMHARDER [symbol] CONNECT; [symbol] AIHARDER. |
| Common nominal cap height | Existing typography comparison and craft reference | Identical type/symbol scale across rows, without stretching glyphs. |
| White board / fine dividers / minimal labels | Existing board and bounded Refero references | Branding comparison only; no home-page or product UI design. |

The font is the unchanged [Krona One file](../wordmark-study/assets/KronaOne-Regular.ttf), with provenance/checksum/license in the [font manifest](../wordmark-study/font-manifest.json). The image is the unchanged [neutral master](../video/reference-pack/01-front-neutral.png) used in the previous lettering study. It is a static source illustration, not a new render of the later Gaussian reconstruction. Its white raster background limits this specimen to white surfaces. This comparison makes no new 3D/eye/motion acceptance claim.

## Naming assessment

**AimHarder Connect** retains the complete AimHarder spelling and adds a functional product descriptor. It offers a clear separation between the consumer product and the technical package. **AIHarder** foregrounds the AI pun and shortens the wordmark, while changing the familiar spelling; the owner needs to assess recognition and pronunciation. These are design judgments, not user-research findings or name availability checks.

The board preserves the two naming candidates. AimHarder Connect is now the working selection, alongside selected Krona One. Optical spacing, production master artwork and the visual public-home experiment remain pending; the [first home structure](../../home-study/README.md) is proposed. No domain, trademark, account or package-name availability has been investigated.

## Verification

Source truth: the locked existing wordmark, owner-selected Krona One, unchanged neutral master and requested naming variants. Implementation evidence: [desktop capture](desktop-preview.png) and [390px mobile capture](mobile-preview.png).

- Chrome confirmed the actual Krona family loaded, both requested spellings, blue prefix/navy remainder, the same enlarged symbol and identical cap-height settings. No substitute font, stretched glyphs, motion or generated lettering is used.
- At 1200px, specimen widths are approximately 825px / 442px inside a 1104px stage. At 390px, they are approximately 286px / 153px inside 358px. At 320px, all marks fit and document width equals viewport width. Narrow-screen checks are desktop emulation, not physical-device acceptance. Temporary viewport overrides were reset.
- Browser console contained no reported errors. Font/image checksums, local references, Tailscale HTTP delivery and whitespace checks passed. No production TypeScript, package metadata or dependency changed; no runtime test suite was run for this static specimen.
- The owner's left-symbol AIHarder refinement was inspected on desktop and at 390px, and both captures were refreshed. Only the standalone row's symbol/text order changed; type size, symbol scale, colors and spacing are retained.
- Visual QA passed against the reference lock: exact selected font, color roles, static media and horizontal order preserved; no unresolved clipping or overlap observed.

Existing architecture/product/security ADRs are unaffected: this records a selected display font and reversible naming candidates, without adopting a product rename or changing distribution. The provisional `.pen` UI foundations and product-UI font are unchanged.
