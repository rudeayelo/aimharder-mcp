# AIHarder — kettle at the FAQ boundary

Date: 2026-11-02. Owner-directed addition to the current English desktop Light/Dark home: a right-aligned kettle with random emotes crossing from FAQ into the closing Sign in band, with most of its visible volume in FAQ. Hide it on smaller terminals.

## Reference lock and placement

The owner's explicit placement is primary. Reuse the existing hero/identity prototype, original hybrid 32k Gaussian body, complete curved eye recess rig and authored stop-motion clips. The existing [footer study](footer-study.md) supplies the locked palette, typography, spacing and CTA. No new visual direction, mascot design, bitmap generation, client logos or third-party model assets are introduced.

At widths ≥1200px the decorative actor is right-aligned to the shared content well. Its 220 × 248px stage crosses the boundary by 44px. The calibrated visible body is approximately 170 × 195px, leaving roughly three quarters of its volume in FAQ. A wide, theme-aware contact shadow grounds it. FAQ bottom padding becomes 216px on these widths to reserve space above the boundary; question rows and the CTA remain clear. The actor is absolute and pointer-transparent. It follows the closing boundary when FAQ disclosures change height.

Below 1200px the actor is hidden and FAQ returns to its previous 80px bottom padding. No additional footer renderer/model is initialized on a fresh narrow view. The other six native device/locale variants remain frozen.

## Motion and resource boundary

[footer-kettle.js](footer-kettle.js) reuses `motion-poses.js`, `hybrid/eye-poses.js`, `hybrid/eye-rig.js`, the existing affine-sort correction and `kettle-body-32k.sog`. Random selection cycles among blink, rock, curiosity, look-around and little-hop clips, excluding an immediate repeat. Neutral holds last 1.5–4 seconds. Existing authored exposure timing is retained: 12fps body clips and 24fps double blink. Body scale/contact correction and all curved recessed eye geometry move together.

The module dynamically imports renderer dependencies and initializes a 512px/DPR1 transparent renderer with extra frustum headroom for the hop, preserving the neutral display crop only when the actor is wide and visible. The model URL is shared with the existing hero; normal browser caching applies, while the renderer instance is separate. Draws occur on pose changes and sorter updates rather than continuously during idle holds. The new actor stops offscreen, on hidden documents and through the shared review Pause control. Page exit cancels its frame request and releases renderer resources. These statements concern this new actor, not a new performance guarantee for the earlier hero/background implementations.

`motion=off`, reduced-motion preference and unavailable 3D keep the existing neutral transparent PNG. Preference changes reload the prototype, matching the existing page. `footerEmote=blink|rock|curious|look|hop&footerFrame=<n>` freezes a deterministic rig frame for review; the normal route is random. Read-only datasets expose the current frame/clip and count, with no telemetry or persistence.

## Pen and acceptance

Native Light/Dark use editable shadow/poster layers `Q8CwD` and `G15vMc` inside the existing closing roots, with the same boundary placement. The saved neutral still reserves 200px below FAQ; HTML uses 216px for the hop peak. The editor disconnected and the reopened view did not answer during the final spacing adjustment, so the extra 16px is validated in HTML only. This is a neutral still; actual random playback remains in HTML. [Light page](previews/footer-kettle/uAXkc.png) · [Dark page](previews/footer-kettle/p7u8w.png). All 26 protected native subtrees outside FAQ/closing were unchanged, including the footer, header, hero, question wall, How to, reusable components and other six variants.

[Browser and native checks](footer-kettle-checks.json) record desktop rendering, breakpoint hiding, still fallback, animation states and suspension. No product services, account access or API/security behavior changed. Existing ADRs are unaffected. Device-performance acceptance, broader browser testing, production integration and owner motion/visual acceptance remain separate.

Two-axis review against `dfddbae...b9514e8`: Standards 0 findings; Spec 0 findings. JavaScript syntax, 76 existing asset hashes and changed local references passed. Browser checks observed 16 randomly selected emotes over about 69 seconds, all five deterministic clip frames, stable pause/offscreen clocks, hidden fresh 1199px view without footer canvas, poster still mode, usable CTA and final Light/Dark renders without overflow or console warnings/errors. This does not replace real-device performance or owner visual acceptance.
