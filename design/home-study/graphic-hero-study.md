# AIHarder — graphic hero composition

Date: 2026-10-31. Desktop English design and throwaway motion experiment under #95.

The owner requested the kettle near the center of the hero, an incoming question above/right, a thinking moment and an answer in another speech bubble. The text composer and example paginator are removed. The agreed headline is **Focus more on training, less on tapping.** It means reducing the management surrounding training, not increasing training volume. The prominent mascot is explicitly authorized for this experiment and supersedes the earlier incidental-only mascot constraint here.

## Artifacts and scope

- **Current motion trial:** [Animated 3D prototype](hero-motion-prototype.html?theme=light), with Pause/Replay and Light/Dark/long-reply review controls outside the product hero.
- [Static composition](hero-graphic-still.html?theme=light&state=answer), served through the existing scoped Tailscale design route.
- [Light answer](previews/hero-graphic-answer-light.png), [Light thinking](previews/hero-graphic-thinking-light.png), [Dark answer](previews/hero-graphic-answer-dark.png).
- Query values `state=waiting|question|thinking|answer` select stills. They do not run a timed sequence. No input, paginator, live AI, authentication or actual account data is present.
- This HTML file is a static rendering source for the pantallazo, not the later animated mockup or production frontend.
- The first draft was prepared through Rex while the code-mode host was unavailable. The tool connection subsequently recovered: the two active English desktop home frames in pen were synchronized to the attentive-pose graphic composition. The later larger-reply/shadow revision is currently HTML-only: the editor did not answer three execute attempts, so it was not edited through the filesystem. Node-ID-named images are pen exports; `hero-graphic-...png` images are browser captures. Other locale/device variants remain unchanged.

## Reference lock

The owner's annotated screenshot supplies the composition. Preserve the established AIHarder/Krona One wordmark, Geist bold heading, accepted blue button A, shared content gutters, muted monochrome client row and simple language/theme affordances. The waiting state reuses the neutral poster. Attention and thinking use new transparent renders from the existing 32k model and curved eye rig, following the owner’s three-quarter pose reference. No raster retouch or AI-generated replacement artwork is used. Lucide supplies UI icons. Original client assets and font provenance remain in assets/sources.json. The bubbles are native layout primitives with no speech tails. Character motion and response timing will communicate who is replying. No new product screens or mobile/Spanish variants were created.

The booking conversation is fictional: **When is my next booking? → Tomorrow at 19:00. CrossFit. Booking confirmed.** No live request was made. Keeping it short makes the surrounding administration concrete and lets the mascot carry the illustration.

## Verification and next step

Inspected the answer composition in Light/Dark at 1440px and the thinking still; checked the normal 1200px viewport for image loading, page overflow and absence of inputs. Header and hero assets render locally. The 1200px mascot is slightly smaller to keep it clear of the reply bubble. Captures are from the browser. No production TypeScript, dependencies or architecture/security decisions changed, so no runtime test suite or ADR amendment is needed.

The still is separate from the later [motion prototype](hero-motion-prototype.html). Browser inspection of the latter does not establish production integration, real-device performance or owner acceptance.

## Attention and expression refinement — 2026-10-31

The owner supplied a right-facing pose reference and requested that the character look toward the incoming upper-right message. [render-hero-pose.html](render-hero-pose.html) uses the original model, renderer and full curved eye rig; [hero-pose-assets.json](hero-pose-assets.json) records camera, body/eye poses, alpha bounds and source hashes. Body rotation and the complete eye recesses move together. This is not a flat eye overlay or a rotation of the old PNG.

- Waiting: neutral poster, no question or reply.
- Question: attentive body turn, upward/right gaze.
- Thinking: slightly higher gaze and a gentle asymmetric narrowing; a tail-free thinking bubble. This is a still, not an animated emote.
- Answer: attentive pose and a tail-free response bubble. The later answering emote can use a short anticipation/settle and subtle eye change timed with the bubble appearing; the thinking emote can use a brief pause, blink and small planted movement. These animation behaviors remain proposed, not implemented.

The English Light/Dark pen heroes now use this composition and the agreed headline, with the composer/paginator removed. The old composer-motion board is explicitly marked historical. Transparent image margins are intentionally cropped, and the character extends into the inter-column gap; bounds diagnostics flag these graphic overlaps, so no clean bounds pass is claimed. The visible character and reply are complete in the exported render. Other six home variants and shared components are preserved.

No real account query, new API behavior, production animation or architecture/security change is involved. Existing ADRs remain applicable. Pose and expression approval remains with the owner.

## Thinking compression, reply bounce and translucent bubble — 2026-10-31

The owner asked for slow compression while thinking, a small hop with rebound timed to the answer, a larger reply with a tighter lower-left corner, translucency/blur over the character and a stronger ground shadow, especially in Light. This is one directed refinement, not additional layout variants.

| Decision | Source | Applied behavior |
| --- | --- | --- |
| Planted compression | Owner’s motion request; existing curved 3D rig | A common root scales the existing 32k body, handle and complete eye recesses together. Y falls from 1 to 0.85 over 2.15 seconds; X/Z expand with approximate volume preservation. |
| Reply gesture | Owner’s hop/rebound request | Answer and launch begin at 3.8s. A short stretch leads to a 0.065-unit lift, a compressed landing, a 0.022-unit secondary hop and a settle by 4.82s. |
| Reply surface | Owner’s bubble request | 344px wide at 1440px desktop (formerly 282), 28px padding, radii 24/24/24/6, 90% surface fill and 12px backdrop blur. At 1200px it narrows to 300px to retain visible eyes. No speech tail. |
| Contact | Owner’s shadow request | Two layered elliptical contact shadows. The footprint broadens with compression, shrinks and fades with lift. This is a designed screen-space shadow, not a physically simulated light source. |

[hero-motion-prototype.js](hero-motion-prototype.js) renders the existing model directly with the established Three/Visus setup. No new media generation, dependencies or eye overlays were added. The common ground pivot remains fixed while thinking; only flight adds vertical translation. The full curved relief changes for a brief blink and gentle squint. The actor viewport permits expansion so squash/stretch does not clip the body or handle.

The 8.5-second local sequence loops waiting → question → thinking → answer. Pause/Replay and a longer fictional reply are review aids, outside the product hero. `at=3.75` freezes near maximum compression; `at=4.08` freezes the main hop; `at=4.9` shows the settled answer. `motion=off` or the OS reduced-motion preference displays the attentive poster and complete answer without loading the 32k model. The review controls do not sign in, query accounts or create real bookings.

Browser checks covered 1440px Light, 1440px Dark with the longer reply, and a 1200px static fallback. The inspected compression is 0.8502 at 3.75s, lift is 0.0650 at 4.08s, and playback/pausing changed the visible phase/time as intended. No console warnings/errors were observed in the inspected run. The reduced-motion code path was checked through `motion=off`; an actual OS preference change and real-device acceptance remain unobserved. [Checks](hero-motion-checks.json) and [Light reply](previews/hero-motion-answer-light.png), [thinking](previews/hero-motion-thinking-light.png), [Dark long reply](previews/hero-motion-long-dark.png) record this trial. Earlier `hero-graphic-*` captures and node-ID-named pen exports remain historical to the preceding composition.

**Pen sync remains pending for this refinement.** The editor opened but did not answer three execute calls. The pre-existing local pen change (4px background blur on the Light reply) was preserved; no direct pen-file edits were made. The six frozen variants, production app and API/security/distribution decisions are unchanged. Existing ADRs remain applicable; no new ADR is required for this visual prototype.

Review found and fixed a duplicate animation-frame scheduling risk on tab visibility return or rapid Pause/Play. One tracked pending frame is now cancelled on hide/pause and scheduled idempotently on resume. Browser pause/resume was rechecked after the fix with no observed console warnings/errors. Standards and Spec review cover this directed prototype, not production readiness.
