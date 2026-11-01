# AIHarder — current Pen synchronization

This records the preceding hero synchronization checkpoint. The later [question ticker study](question-ticker-study.md) is current for the headline, flat mark and following section; its checks replace the affected asset/export hashes recorded here.

Saved on 2026-11-01 in [ahmcp.pen](../ahmcp.pen), following the owner's request to transfer the current HTML hero to Pen. Only English desktop Light `uAXkc` and Dark `p7u8w`, and their dedicated logo component `GqxcO`, were updated. The in-chat editor timed out on a read attempt; the native Pen desktop MCP completed the edits, and the desktop save indicator was cleared after saving.

## Current composition

The header is 89px high. The hero is 535px high with 120px horizontal gutters, 32px top padding and 33px bottom padding including its 1px boundary. The editable conversation scene is 470px high. This is the existing 1440px desktop composition; no new breakpoint or mobile design was introduced.

The hero includes the bold agreed headline, introductory copy, selected button A gradient/border, attenuated Works with row, flat navy/white header mascot and current WOD example. Question and reply use 18px corners with a distinctive 6px corner, the requested 0/4/6 black 10% shadow, and a 60%-alpha reply with background blur. The reply is 344px wide at y=84, directly below the incoming message. The longer fictional answer is shown fully written.

The kettle is at x=-80/y=86 with the existing attentive three-quarter render and complete curved eye recesses. Its two contact-shadow ellipses are wider/darker, with the outer shadow at y=466. This mirrors the latest 10px upward adjustment. The existing model, pose render and source artwork remain unchanged.

Only the Grainient background is a raster capture, exported at 1440 × 535 from [the background-only renderer](render-pen-background.html) at still clock zero. Text, layout, buttons, bubbles and shadows remain native editable design nodes. The character remains a transparent rendered image. New flat-logo and client-icon PNGs faithfully rasterize the existing SVGs because native Pen did not display those SVG fills correctly. [Asset provenance and notices](assets/README.md) apply.

## Verification and limits

- Inspected native exports of both headers and heroes, the flat logo component, full reply and client row. Saved the document in the desktop app and checked that its Edited indicator disappeared.
- Compared 15 protected root objects before/after through the Pen API: all fingerprints matched. This includes the six other home variants, old state/specimen boards and original shared components. The dedicated updated logo has only the two active home references.
- Checked native node properties for dimensions, colors, shadows, themed assets, WOD copy and absence of CrossFit labels in the two active pages. [Verification record](pen-sync-checks.json) and [two-axis review](pen-sync-review.md) contain IDs and fingerprints. Updated exports are actual Pen renders, not browser captures.
- Bounds diagnostics still flag intentional overflow: the transparent character image and contact shadows extend below the 470px scene into the hero padding, and the character extends into the inter-column gap. Export inspection shows the complete visible character/contact; this is not a clean bounds-visitor pass.
- Playback, typing, thinking and reply emotes remain in the [HTML prototype](hero-motion-prototype.html). This static synchronization does not implement animation in Pen, validate production integration or establish owner approval.

[Light home](previews/uAXkc.png) · [Dark home](previews/p7u8w.png) · [Light hero](previews/o4sdvx.png) · [Dark hero](previews/QJRsJ.png) · [Light header](previews/Py7nJ.png) · [Dark header](previews/Y5q0PC.png).

This delivery changes design artifacts and documentation only. Production code, dependencies, API contracts, access policy and deployment are unaffected. Existing architecture/security/distribution ADRs remain applicable; no new ADR or MCP runtime test is needed for the static canvas synchronization. Owner visual approval and wider variant propagation remain pending.
