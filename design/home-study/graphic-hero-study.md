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

## Previous timing: thinking compression and reply bounce — 2026-10-31

The timings in this section describe the previous trial, superseded by the faster sequence below. The owner asked for slow compression while thinking, a small hop with rebound timed to the answer, a larger reply with a tighter lower-left corner, translucency/blur over the character and a stronger ground shadow, especially in Light. This is one directed refinement, not additional layout variants.

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

## Faster reaction, compact message stack and typed replies — 2026-10-31

The owner liked the direction and asked for a faster reaction when the question arrives, half the thinking time, the reply directly below the question, right-aligned thinking dots, rapid typewriter text and an emote during writing. These instructions refine the same desktop English Light/Dark hero; they do not request new screen variants.

- The question arrives at 0.9s. The body/gaze reacts over 180ms with a fast ease-out, slight overshoot and settle, instead of the former 600ms turn. The thinking state starts at 1.12s.
- Thinking/compression lasts **1.075s**, exactly half the former 2.15s. The response starts at 2.195s, with the existing anticipation, stretch, airborne arc, compressed landing and smaller follow-through rebound shifted to match.
- Both reply states sit **16px below the measured bottom of the question**, with identical right alignment. A ResizeObserver accommodates wrapping. The static composition uses the same 84px default top position. The 344px translucent surface and asymmetric lower-left corner are retained.
- Text reveals at approximately **105 characters/second** (minimum 0.7s, maximum 2.2s). The short answer takes 0.7s; the 211-character long example takes about 2.01s. Hidden text retains its footprint so the bubble does not resize or rewrap as characters appear. A single complete accessible answer replaces per-character announcements.
- The initial hop accompanies the short answer. While a longer answer continues typing, the kettle extends the gesture into small side-to-side bounces with a restrained roll/yaw, volume-preserving squash, moving contact shadow and an eased settle. Body, handle and complete eye relief remain on the same rig.
- Typing uses the same elapsed clock as the character. Pause freezes both; Replay resets both. The single-frame scheduler remains intact. Reduced motion and 3D fallback show the complete answer immediately.

Browser inspection verified the 180ms reaction, 16px gaps/zero right-edge offset for both thinking and reply states, partial/full text, stable 286.25px long-reply height, the dance during writing, pause/resume, and the complete no-canvas fallback at 1200px. Light/Dark captures at 1440px are in [checks](hero-motion-checks.json), including [partial typing](previews/hero-motion-typing-light.png). No console warnings/errors were observed. Actual OS preference changes, real-device performance and owner acceptance remain separate.

The native pen and its exports were already modified at the start of this revision: the previous larger translucent reply and stronger shadow had eventually persisted, despite the earlier tool timeout. They were preserved. The new attempt to move the native reply to y=84 also timed out; the latest file inspection still shows y=170 in both active homes. The current compact stack and all timing/typewriter/emote changes are therefore verified in HTML; latest pen alignment remains pending. No direct pen-file edits were made. No API, production configuration, dependencies or architecture/security/distribution decisions changed; no ADR update is required.

The final Standards and Spec reviews found no actionable issues. A later browser read confirmed paused time/text remained at 3.602s and 147 characters. JavaScript syntax, capture hashes and documentation links were checked; no production runtime test suite was run for this isolated visual prototype.
