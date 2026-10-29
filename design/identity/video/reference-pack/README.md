# Kettle video reference pack

Subsequent execution: the owner authorized [trial 01](../trial-01/README.md), which now contains an actual generated take, its 12 fps edit, receipts and visual-review limits. The no-generation statements below describe this reference package's original preparation delivery, not the later execution status.

Prepared 2026-10-29 for [design #95](https://github.com/rudeayelo/aimharder-mcp/issues/95). This is the current reference package and final shot prompt, superseding the earlier single-frame-only five-second draft. No Runway request was sent and no video was generated in this delivery. All new images used the built-in GPT Image tool, with the prior front master as the design reference. Full image-generation prompts and file hashes are included.

## Files and roles

| File | Role |
| --- | --- |
| [01-front-neutral.png](01-front-neutral.png) | Existing authoritative first frame, copied unchanged. Use again for the intended final resting frame. |
| [02-three-quarter.png](02-three-quarter.png) | Reference for front/side volume and natural face foreshortening. |
| [03-profile.png](03-profile.png) | Reference for body depth and the handle seen edge-on. Eyes disappear from exact side view. |
| [04-rear.png](04-rear.png) | Plain blue rear. No duplicated face, eyes, ports or rear decoration. |
| [05-eye-emotes.png](05-eye-emotes.png) | Six alternate eye states of one character; appearance guidance, not six actors. |
| [06-motion-storyboard.png](06-motion-storyboard.png) | Pose/storyboard for human review. Do not include in the initial provider input. |
| [final-video-prompt.txt](final-video-prompt.txt) | Final English motion prompt for the intended six-second shot. |
| [image-generation-prompts.json](image-generation-prompts.json) | Exact prompts for the five newly generated images. |
| [manifest.json](manifest.json) | Actual dimensions, bytes, data-URI sizes and SHA-256 hashes. |

The first four images are square, 1254 × 1254. The expression and pose sheets are 1536 × 1024. Every encoded image individually fits the currently documented 5 MB data-URI image limit; this does not establish acceptance of a particular multi-image request or its total payload. The provider request has not been submitted.

## Character lock

Blue satin tactile kettle, dark circular front face, two orange recessed eyes, integrated rigid open handle, no mouth or limbs. Only the front has a face; the back is plain blue. Preserve these features through movement. The selected body color is blue; other earlier colors and the flat SVG cursor-following experiment are not the current direction. The source framing leaves clearance for a small hop; do not animate a full wordmark or add text to the video. Actual font-based letters will be composed outside the clip later.

These are generated raster references, not views rendered from one validated 3D mesh. Visual inspection confirms the intended view/face-occlusion roles and the same overall identity, but the three-quarter view faces screen-left while the exact profile faces screen-right; they illustrate complementary sides, not consecutive camera angles. Do not infer rotation direction from file order. Fine texture, projected proportions, face-rim thickness and eye cavities vary slightly between images. The profile has a visible thin face rim; keep the final face flush rather than turning it into a protruding screen. The rear and depth are proposals prepared under the owner's instruction to generate references; they have not been separately owner-approved.

## Eye acting

| State | Intended use | Eye change relative to neutral |
| --- | --- | --- |
| Neutral | Opening and final rest | Centered vertical capsules. |
| Anticipation | Before takeoff | Move together about 5% of face width right and slightly upward; height about 90%. |
| Delight | Front-visible portion of airborne turn | About 110% size, slight upward gaze. |
| Impact blink | First floor contact | Brief closed horizontal slits. |
| Happy | Recovery beat | Two small closed-eye arches, then reopen. |
| Settle | Return to rest | Near-neutral, about 95% height, slight asymmetry before fully neutral. |

The percentages are prompt targets, not measurements verified from the sheet or guaranteed animation constraints. The reference sheet illustrates the distinctions. Keep movement small and within the circular face. Eyes rotate with the body and disappear behind it; they are not camera-facing features attached independently to the scene.

## Six-second choreography

| Time | Action |
| --- | --- |
| 0.0–0.7 s | Front-facing rest. |
| 0.7–1.2 s | Small leftward anticipation, eyes glance right and shorten slightly. |
| 1.2–3.1 s | Small hop and one complete 360° turn about a body axis inclined approximately 30° from vertical. Whole body/handle remain rigid. |
| 3.1–3.6 s | Front returns, land on the right base edge first; brief impact blink. |
| 3.6–4.8 s | Two or three alternating rocking rebounds, diminishing approximately 12°, 6°, 3°. |
| 4.8–5.2 s | Brief happy eye arches. |
| 5.2–6.0 s | Return to neutral, upright, original position and scale. |

The storyboard illustrates direction and weight but does not encode exact angles, timing or a continuous trajectory. Its sixth panel is already neutral; the brief happy beat is defined by the expression sheet and final prompt. Exact physical continuity, 30° inclination, frame cadence and endpoint matching need video inspection. The intended spin is a tilted pirouette about the kettle's own axis, not a cartwheel or end-over-end flip.

## Proposed Runway mapping

Use **Kling O3 Standard via Runway**, model `klingO3_standard`, square `960:960`, duration **6 seconds**, `audio: false`, single shot. This is a compatible planned request shape, not verified access or acceptance on the account. Gen-4.5's earlier first-frame-only route cannot use this complete reference setup.

- First keyframe: `01-front-neutral.png`.
- Last keyframe: the same `01-front-neutral.png`.
- Appearance references, without a keyframe position: `02-three-quarter.png`, `03-profile.png`, `04-rear.png`, `05-eye-emotes.png`.
- Exclude `06-motion-storyboard.png` from the first request. It is for review and prompt development, not a frame to reproduce.

This uses six image entries counting both endpoint assignments, within the conservative seven-total-image limit in the [current Runway input guide](https://docs.dev.runwayml.com/assets/inputs/). The [official request types](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/types/image_to_video_create_params.py) expose `first`/`last` for Kling O3 Standard and a separate reference-image array. The input guide describes up to seven images including keyframes; do not interpret the SDK array's standalone upper bound as seven extra references plus two keyframes. Use data URIs or provider ephemeral uploads at generation time; a tailnet-only URL is not provider-fetchable. No credentials belong in this package.

The captioned expression sheet might cause unwanted text, repeated figures or edits to the environment despite the prompt. If that happens, first retry a simpler reference set or prepare single-state images; do not assume the provider understands reference-sheet roles perfectly. The prompt explicitly requests one character and one uninterrupted shot. Matching first/last frames helps constrain endpoints but does not prove a seamless loop or stable geometry in between.

Request the stop-motion look with held poses; after a usable clip exists, inspect it and prepare an actual **12 fps** delivery without interpolation, preserving duration. The checked Kling O3 request type exposes no native 12 fps setting. A reduced frame rate alone cannot establish convincing stop-motion timing. Playback, alpha/white-background compositing, compression, the final wordmark placement and reduced-motion behavior are later checks, not outputs of this package.

## Validation and delivery boundary

All five new images were rendered by GPT Image and visually inspected. The master copy's hash matches the earlier first frame. Six PNGs have checked dimensions, nonzero sizes and SHA-256 entries; local documentation links and `git diff --check` pass. No runtime/API changes, production behavior, sporting actions or deployments occurred. No behavioral tests are warranted for these media/documentation additions. Reviewed project product/identity/security boundaries remain unchanged, so no new ADR is warranted. The owner still needs to review these references and the resulting actual video; the overall #95 design remains incomplete.
