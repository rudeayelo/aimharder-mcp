# AIHarder — graphic hero composition

Date: 2026-10-31. Static desktop English experiment under #95.

The owner requested the kettle near the center of the hero, an incoming question above/right, a thinking moment and an answer in another speech bubble. The text composer and example paginator are removed. The agreed headline is **Focus more on training, less on tapping.** It means reducing the management surrounding training, not increasing training volume. The prominent mascot is explicitly authorized for this experiment and supersedes the earlier incidental-only mascot constraint here.

## Artifacts and scope

- [Static composition](hero-graphic-still.html?theme=light&state=answer), served through the existing scoped Tailscale design route.
- [Light answer](previews/hero-graphic-answer-light.png), [Light thinking](previews/hero-graphic-thinking-light.png), [Dark answer](previews/hero-graphic-answer-dark.png).
- Query values `state=waiting|question|thinking|answer` select stills. They do not run a timed sequence. No input, paginator, live AI, authentication or actual account data is present.
- This HTML file is a static rendering source for the pantallazo, not the later animated mockup or production frontend.
- The first draft was prepared through Rex while the code-mode host was unavailable. The tool connection subsequently recovered: the two active English desktop home frames in pen are now synchronized to the graphic composition. Node-ID-named images are pen exports; `hero-graphic-...png` images are browser captures. Other locale/device variants remain unchanged.

## Reference lock

The owner's annotated screenshot supplies the composition. Preserve the established AIHarder/Krona One wordmark, Geist bold heading, accepted blue button A, shared content gutters, muted monochrome client row and simple language/theme affordances. The waiting state reuses the neutral poster. Attention and thinking use new transparent renders from the existing 32k model and curved eye rig, following the owner’s three-quarter pose reference. No raster retouch or AI-generated replacement artwork is used. Lucide supplies UI icons. Original client assets and font provenance remain in assets/sources.json. The bubbles are native layout primitives with no speech tails. Character motion and response timing will communicate who is replying. No new product screens or mobile/Spanish variants were created.

The booking conversation is fictional: **When is my next booking? → Tomorrow at 19:00. CrossFit. Booking confirmed.** No live request was made. Keeping it short makes the surrounding administration concrete and lets the mascot carry the illustration.

## Verification and next step

Inspected the answer composition in Light/Dark at 1440px and the thinking still; checked the normal 1200px viewport for image loading, page overflow and absence of inputs. Header and hero assets render locally. The 1200px mascot is slightly smaller to keep it clear of the reply bubble. Captures are from the browser. No production TypeScript, dependencies or architecture/security decisions changed, so no runtime test suite or ADR amendment is needed.

Review the composition first. After agreement, build the timed waiting → question → thinking → reply mockup, with the existing 3D/eye rig if needed and reduced-motion behavior. The current still does not establish animation, real-device or accessibility acceptance.

## Attention and expression refinement — 2026-10-31

The owner supplied a right-facing pose reference and requested that the character look toward the incoming upper-right message. [render-hero-pose.html](render-hero-pose.html) uses the original model, renderer and full curved eye rig; [hero-pose-assets.json](hero-pose-assets.json) records camera, body/eye poses, alpha bounds and source hashes. Body rotation and the complete eye recesses move together. This is not a flat eye overlay or a rotation of the old PNG.

- Waiting: neutral poster, no question or reply.
- Question: attentive body turn, upward/right gaze.
- Thinking: slightly higher gaze and a gentle asymmetric narrowing; a tail-free thinking bubble. This is a still, not an animated emote.
- Answer: attentive pose and a tail-free response bubble. The later answering emote can use a short anticipation/settle and subtle eye change timed with the bubble appearing; the thinking emote can use a brief pause, blink and small planted movement. These animation behaviors remain proposed, not implemented.

The English Light/Dark pen heroes now use this composition and the agreed headline, with the composer/paginator removed. The old composer-motion board is explicitly marked historical. Transparent image margins are intentionally cropped, and the character extends into the inter-column gap; bounds diagnostics flag these graphic overlaps, so no clean bounds pass is claimed. The visible character and reply are complete in the exported render. Other six home variants and shared components are preserved.

No real account query, new API behavior, production animation or architecture/security change is involved. Existing ADRs remain applicable. Pose and expression approval remains with the owner.
