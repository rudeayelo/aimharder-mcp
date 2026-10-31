# AIHarder — graphic hero composition

Date: 2026-10-31. Static desktop English experiment under #95.

The owner requested the kettle near the center of the hero, an incoming question above/right, a thinking moment and an answer in another speech bubble. The text composer and example paginator are removed. The agreed headline is **Focus more on training, less on tapping.** It means reducing the management surrounding training, not increasing training volume. The prominent mascot is explicitly authorized for this experiment and supersedes the earlier incidental-only mascot constraint here.

## Artifacts and scope

- [Static composition](hero-graphic-still.html?theme=light&state=answer), served through the existing scoped Tailscale design route.
- [Light answer](previews/hero-graphic-answer-light.png), [Light thinking](previews/hero-graphic-thinking-light.png), [Dark answer](previews/hero-graphic-answer-dark.png).
- Query values `state=waiting|question|thinking|answer` select stills. They do not run a timed sequence. No input, paginator, live AI, authentication or actual account data is present.
- This HTML file is a static rendering source for the pantallazo, not the later animated mockup or production frontend.
- The code-mode tool host repeatedly failed before pen.dev tools could run. Consequently **the pen file remains unchanged** and synchronization is pending. The static draft was prepared through the Rex terminal and inspected using the browser. Do not describe its screenshots as pen exports.

## Reference lock

The owner's annotated screenshot supplies the composition. Preserve the established AIHarder/Krona One wordmark, Geist bold heading, accepted blue button A, shared content gutters, muted monochrome client row and simple language/theme affordances. The existing neutral transparent kettle poster is reused without image editing or new generation. Lucide supplies UI icons. Original client assets and font provenance remain in assets/sources.json. The bubbles and their tails are native layout primitives. No new product screens or mobile/Spanish variants were created.

The booking conversation is fictional: **When is my next booking? → Tomorrow at 19:00. CrossFit. Booking confirmed.** No live request was made. Keeping it short makes the surrounding administration concrete and lets the mascot carry the illustration.

## Verification and next step

Inspected the answer composition in Light/Dark at 1440px and the thinking still; checked the normal 1200px viewport for image loading, page overflow and absence of inputs. Header and hero assets render locally. The 1200px mascot is slightly smaller to keep it clear of the reply bubble. Captures are from the browser. No production TypeScript, dependencies or architecture/security decisions changed, so no runtime test suite or ADR amendment is needed.

Review the composition first. After agreement, build the timed waiting → question → thinking → reply mockup, with the existing 3D/eye rig if needed and reduced-motion behavior. The current still does not establish animation, real-device or accessibility acceptance.
