# AIHarder — current editable Pen replica

Date: 2026-11-01. The owner requested a replica of the design as currently developed in the HTML prototype. The existing English desktop Light `uAXkc` and Dark `p7u8w` frames in [ahmcp.pen](../ahmcp.pen) now show the header, hero and question wall together, at 1440px wide. The file was saved through native Pen and reopened in the conversation editor.

## Current design and source lock

The source is [hero-motion-prototype.html](hero-motion-prototype.html), with its current stylesheet, question data, mascot assets and typography. This is a literal synchronization of the established design, not a new visual direction. Browser comparisons used `motion=off&ticker=still&reply=long` at 1440px so the poster, full answer and initial topic/question could be compared without animation.

The pages include the flat transparent-face mark, white negative mark in Dark, Krona One wordmark, bold three-line headline with blue final line, selected button A, muted client logos, pale-blue-to-blue Grainient background, attentive kettle and contact shadow, navy question, translucent tail-free long reply, centered heading, compact segmented topic pills and four unboxed question rows. Questions remain 26px/500, with 10.5px row gaps and 4px topic gaps. The outer topic radii are bounded at 18px so the interior corners retain their intended 4px curve.

The background and transparent character are image assets; foreground text, layout, buttons, bubbles, shadows, topic pills, question rows and edge fades are native editable elements. Motion is recorded in context notes: alternating directions, 100/118/109/123-second cycles and three-second question/topic emphasis. Playback remains in HTML.

## Alignment corrections

Comparing current browser geometry exposed small drift in the previous native header/hero. Both headers now use three equal 400px groups, correctly centering the menu. Language/appearance spacing, 12px chevrons, ink-colored language labels, 14px header button labels, 22px hero-link arrows and their gaps match the HTML. The hero action is 50px high. Local line heights and reply insets/confirmation spacing were adjusted to match browser text/layout metrics without changing shared frozen components or global theme tokens.

| Element at 1440px | Browser source | Native replica |
| --- | --- | --- |
| Header height | 89px | 89px |
| Header group x / width | 120/400, 520/400, 920/400px | Same |
| Hero top / height | 89 / 535px | Same |
| Reply width / height | 344 / 286.25px | 344 / 286px |
| Questions top | 624px | 624px |
| Ticker field height | 239.5px | 239.5px |
| Defined product content height | 1193px | 1192.5px, exported at 1193px |

Fractional text-line rounding differs slightly between the browser and Pen. This is an editable visual replica, not a claim of pixel-identical rendering across engines. Existing intentional mascot overflow and ticker clipping remain; a clean bounds-visitor pass is not claimed.

## Retained drafts and verification

The source prototype currently contains the header and two refined sections. To show that same scope in Pen, the older setup, FAQ, closing action and footer remain as disabled draft layers inside the two active pages. They were not deleted or redesigned and can be re-enabled when their sections are refined. The prototype's external review controls are not product design and were not copied.

All eight draft roots retain their content, descendant structure and styling. Semantic comparison normalizes their changed visibility, cached flow coordinates and the editor's equivalent `fill_container(1440)` fallback representation. Fifteen other protected roots, including all six frozen locale/device variants and the original shared components/boards, match their previous fingerprints exactly.

Inspected native screenshots of both complete pages, headers and heroes; exported current native PNGs. Inspected both browser themes at the same width, checked dimensions/colors against the source, saved the document and confirmed that its Edited indicator disappeared. The temporary browser viewport was reset and the comparison tab closed. [Checks](current-pen-replica-checks.json) record native state, browser geometry and artifact hashes.

[Current Light page](previews/uAXkc.png) · [Current Dark page](previews/p7u8w.png) · [Light browser source](previews/current-source-light.jpg) · [Dark browser source](previews/current-source-dark.jpg).

This delivery changes native design artifacts and documentation only. HTML source, API behavior, credentials, production dependencies and deployment are unchanged. Existing architecture/security/distribution ADRs apply; no new ADR or MCP runtime suite is required. Animation, owner visual acceptance, device performance and propagation to the other six variants remain outside this static handoff.
