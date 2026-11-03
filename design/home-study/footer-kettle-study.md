# AIHarder — kettle at the FAQ boundary

Current refinement: 2026-11-03. The owner moved the random-emote kettle into the left-hand whitespace below the FAQ contact, enlarged it and requested less overlap with Sign in. This supersedes the original right-aligned placement from 2026-11-02. English desktop Light/Dark only; hide it on smaller terminals.

## Reference lock and placement

The owner's explicit placement is primary. Reuse the existing hero/identity prototype, original hybrid 32k Gaussian body, complete curved eye recess rig and authored stop-motion clips. The existing [footer study](footer-study.md) supplies the locked palette, typography, spacing and CTA. No new visual direction, mascot design, bitmap generation, client logos or third-party model assets are introduced.

At widths ≥1024px the decorative actor starts at the shared container's left edge. Its 300 × 340px stage crosses the closing boundary by only 16px, previously 44px. The calibrated neutral body is approximately 239 × 274px, 40.5% larger than before. The shadow grows with it. FAQ returns to its original 80px bottom padding; a 480px minimum height on the two-column FAQ layout reserves space below the support link even when answers collapse. The actor remains absolute and pointer-transparent and follows the boundary as disclosures change height.

Below 1024px the actor is hidden, no extra FAQ minimum height applies, and a fresh view creates no footer renderer/model. This preserves the smaller-terminal exclusion while allowing a 1044px desktop review panel. The other six native device/locale variants remain frozen.

## Visibility diagnosis

The exact 1044px browser check returned `display: none`, `paused: true` and a zero-size stage before the change, while the 1200px view rendered and cycled emotes. The old 1200px breakpoint therefore reproduced the reported invisibility at the prior panel width; the user's current in-app viewport was not directly accessible. After lowering both CSS and JavaScript gates to 1024px, the same 1044px check returned a visible stage, ready renderer and advancing random emotes. This is a responsive visibility correction, not a change to clip timing.

## Motion and resource boundary

[footer-kettle.js](footer-kettle.js) reuses `motion-poses.js`, `hybrid/eye-poses.js`, `hybrid/eye-rig.js`, the existing affine-sort correction and `kettle-body-32k.sog`. Random selection cycles among blink, rock, curiosity, look-around and little-hop clips, excluding an immediate repeat. Neutral holds last 1.5–4 seconds. Existing authored exposure timing is retained: 12fps body clips and 24fps double blink. Body scale/contact correction and all curved recessed eye geometry move together.

The module dynamically imports renderer dependencies and initializes a 512px/DPR1 transparent renderer with extra frustum headroom for the hop, preserving the neutral display crop only when the actor is wide and visible. The model URL is shared with the existing hero; normal browser caching applies, while the renderer instance is separate. Draws occur on pose changes and sorter updates rather than continuously during idle holds. The new actor stops offscreen, on hidden documents and through the shared review Pause control. Page exit cancels its frame request and releases renderer resources. These statements concern this new actor, not a new performance guarantee for the earlier hero/background implementations.

`motion=off`, reduced-motion preference and unavailable 3D keep the existing neutral transparent PNG. Preference changes reload the prototype, matching the existing page. `footerEmote=blink|rock|curious|look|hop&footerFrame=<n>` freezes a deterministic rig frame for review; the normal route is random. Read-only datasets expose the current frame/clip and count, with no telemetry or persistence.

## Pen and acceptance

Historical Pen checkpoint (2026-11-02): native Light/Dark use editable shadow/poster layers `Q8CwD` and `G15vMc` inside the existing closing roots, at the earlier right-hand boundary placement. The saved neutral still reserves 200px below FAQ; HTML uses 216px for the hop peak. The editor disconnected and the reopened view did not answer during the final spacing adjustment, so the extra 16px is validated in HTML only. This is a neutral still; actual random playback remains in HTML. [Light page](previews/footer-kettle/uAXkc.png) · [Dark page](previews/footer-kettle/p7u8w.png). All 26 protected native subtrees outside FAQ/closing were unchanged, including the footer, header, hero, question wall, How to, reusable components and other six variants.

Current HTML placement is not yet synchronized to Pen: the editor reopened but did not answer the state request on 2026-11-03. Existing native exports below remain historical.

[Browser and native checks](footer-kettle-checks.json) record desktop rendering, breakpoint hiding, still fallback, animation states and suspension. No product services, account access or API/security behavior changed. Existing ADRs are unaffected. Device-performance acceptance, broader browser testing, production integration and owner motion/visual acceptance remain separate.

Two-axis review against `dfddbae...b9514e8`: Standards 0 findings; Spec 0 findings. JavaScript syntax, 76 existing asset hashes and changed local references passed. Browser checks observed 16 randomly selected emotes over about 69 seconds, all five deterministic clip frames, stable pause/offscreen clocks, hidden fresh 1199px view without footer canvas, poster still mode, usable CTA and final Light/Dark renders without overflow or console warnings/errors. This does not replace real-device performance or owner visual acceptance.

## Left placement verification — 2026-11-03

Browser QA at 1044px verified Light/Dark rendering, advancing random emotes (12 selections over about 49 seconds), 16px stage overlap, 84.8px minimum gap between the support link and stage, and no horizontal overflow. At 1023px a fresh page hid the actor and created no footer canvas. At default 1200px the enlarged hop frame remained inside its stage headroom; static `motion=off` retained the enlarged poster without a footer canvas. No browser warnings/errors were observed. See [Light](previews/footer-kettle/left-light.jpg), [Dark](previews/footer-kettle/left-dark.jpg) and the dated refinement in [checks](footer-kettle-checks.json). Native synchronization, real-device performance and owner visual acceptance remain pending. Existing ADRs are unaffected by this visual-only correction.
