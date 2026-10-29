# Video input preparation

Latest emote candidate: [playful rock](atomic-emotes/trial-06-guided-rock/README.md), one 39-credit Kling 4 task using a GPT Image lean pose. The character rocks left/right and settles; amplitudes exceed the requested small leans. The two-second 12 fps edit awaits owner review.

Latest emote candidate: [guided delight](atomic-emotes/trial-05-guided-delight/README.md), with a GPT Image middle pose, full generated take and a restrained two-second 12 fps pose edit. One successful task cost 39 credits; owner acceptance remains pending.

Latest motion candidate: [guided curious gaze](atomic-emotes/trial-04-guided-curious-glance/README.md), using a GPT Image target pose as a middle keyframe and locally reversing the return to remove overshoot. The separate WAN model comparison also failed the eye-shape constraint. Total new Runway cost: 69 credits. Both comparisons and the two-second clean edit are preserved.

Latest generation: [atomic curious-glance trial](atomic-emotes/trial-02-curious-glance/README.md), one 39-credit Kling 4 task, with original and two-second review edit. The unchanged-eye-shape requirement is not met; this emote is not accepted.

Current blink timing: the owner preferred 2× speed. The [double-blink delivery](atomic-emotes/double-blink/README.md) now lasts one second at 24 fps, preserving all 24 frames and shared neutral endpoints. No new generation was required; earlier two-second entries are historical.

Latest local edit: [two quick blinks](atomic-emotes/double-blink/README.md), assembled from existing poses into exactly 24 frames at 12 fps. No new generation or credit expenditure.

Latest execution: [atomic blink with Kling 4](atomic-emotes/trial-01-blink/README.md), one successful 39-credit task, delivered as exactly two seconds at 12 fps with shared neutral holds. Eye closure is a single slit per eye in the inspected sequence; timing and boundary transitions await owner acceptance.

Current direction, 2026-10-29: the owner now wants **two-second atomic emotes**, each starting and ending at the same neutral pose, for later combination in code. The [atomic prompt package](atomic-emotes/README.md) supersedes the composite six-second choreography as the next experiment. It contains six complete prompts and a proposed Kling 4 comparison; no new videos have been generated. Kling 4 requires at least three source seconds, so the proposed two-second delivery includes a reviewed retime and common neutral boundaries. Earlier entries below are historical checkpoints.

Generation update, 2026-10-29: the owner explicitly authorized the [first actual Runway trial](trial-01/README.md), which is now available as original and 12 fps MP4s. One accepted Kling O3 Standard task succeeded after a rejected oversized inline request was corrected using ephemeral uploads. Estimated cost and observed credit decrease both equal 78 credits. Visual deviations and pending owner acceptance are documented in the trial; earlier no-generation statements below describe the preparation checkpoint.

Current update, 2026-10-29: the [multi-reference pack and final prompt](reference-pack/README.md) now supersede the initial single-frame-only, five-second proposal below. It adds three-quarter/profile/rear views, eye-emote references and a review storyboard for a six-second hop with a roughly 30° tilted 360° turn and diminishing side-to-side landing rebounds. The planned model is now Kling O3 Standard via Runway so references and endpoint frames can be supplied. No Runway video generation has been performed; historical source details below document the earlier draft.

Status: prepared input for owner review, 2026-10-29. No Runway generation request has been made for this delivery. No Runway credits were consumed. Part of the ongoing staged design under [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95); no home-page implementation or deployment.

## Current direction

The owner selected a **blue body**, the previously selected **dark circular face**, and **orange recessed eyes**. Color exploration is deferred. The owner rejected the flat cursor-following SVG prototype as too close to Grok Bot and now wants a cute prerecorded video integrated between the independently rendered AIMHARDER and MCP lettering. The requested first motion is a small hop with a full turn, in a stop-motion style at 12 fps. A later set of four or five pre-generated clips selected randomly on page load is an idea for subsequent exploration, not an instruction to generate that set now or to generate on visitor requests.

## Ready assets

- [kettle-blue-first-frame.png](kettle-blue-first-frame.png): one neutral, front-facing, complete blue kettle on an opaque white square. No typography or contact-sheet labels. Generated with the built-in GPT Image tool, using only the blue/circular-face option of [the color sheet](../robot-color-study.png) as the visual reference. The full generation instruction is in [first-frame-prompt.txt](first-frame-prompt.txt).
- [hop-spin-prompt.txt](hop-spin-prompt.txt): motion-focused English prompt, within Gen-4.5's 1,000 UTF-16-code-unit limit. It requests the hop, one vertical-axis full turn, held poses and a return to rest. This is a request for the model, not a guarantee of exact motion, cadence or endpoint.

Image file checks: valid PNG signature and IHDR, **1254 × 1254**, **1,265,283 bytes**, square aspect ratio. SHA-256: `8877e4f830912a62264840deb6cefda02199e86e6f091d2ca7cc893f3c96d794`. Base64 payload is 1,687,044 characters before the small data-URI prefix, within the documented 5 MB data-URI input limit. The generation prompt requested 1024 square, but the actual output is 1254 square; the actual dimensions above are authoritative. No resampling or crop was applied.

Visual inspection confirms a single sharp still character, recognizable open handle, circular dark face and orange recessed eyes. Approximate framing: silhouette occupies 65% of canvas height, with 18% headroom and 16% beneath the base; side clearance accommodates a turn. There is a minimal contact shadow. Generated background/lighting may be near-white rather than perfectly uniform RGB white, so check the eventual video against the actual page background before claiming a seamless composite. Shape fidelity and eye size still need owner review at the final logo display size.

## Proposed first Runway shot

| Setting | Proposal |
| --- | --- |
| Model | `gen4.5` |
| Input | One square image as the first frame |
| Output ratio | `960:960` |
| Duration | 5 seconds |
| Output | Default MP4; no premium intermediate format required for the initial experiment |
| Motion | Brief rest → anticipation → small hop with a single 360° turn → settle → front-facing rest |
| Presentation | Render actual font-based lettering outside the video; animate only the kettle |

Reuse this exact master frame for initial comparisons and change one motion instruction at a time. Do not feed the multi-character sheet, the wordmark or the experimental SVG screenshot as the first frame. Do not assume alpha survives or is generated: the proposed first experiment uses an opaque white background. A transparent final asset, if required, needs a separately verified extraction/export workflow.

**Initial 360° limitation, subsequently addressed with references:** the initial draft had no rear view. The new pack now includes plain-blue rear and profile proposals, not yet owner-reviewed, and a compatible multi-reference model plan. Reference images reduce ambiguity but do not establish stable geometry. Check that the face disappears behind the body rather than duplicating or floating across it, and that the handle remains attached. Extra reference boards remain unsupported by the historical Gen-4.5 request shape below.

## Current source contracts checked

- Runway's [image-to-video prompting guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide) says the image establishes the initial composition, subject, lighting and style, while the text prompt should focus on motion. It warns that visible input defects can be intensified.
- The [input guide](https://docs.dev.runwayml.com/assets/inputs/) lists square `960:960` output for Gen-4.5 image-to-video and a 5 MB image data-URI limit. Source and output share aspect ratio, avoiding ratio-driven cropping. A data URI or provider ephemeral upload avoids having to expose the source image through a public asset server; a tailnet-only URL is not a suitable provider-fetchable URL.
- The current [official Gen-4.5 SDK request types](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/types/image_to_video_create_params.py) allow only `first` for its prompt-image position. Do not infer a supported last-frame control from older general API-version documentation. Asking for a return pose does not lock the last frame or establish a seamless loop.
- The [Gen-4.5 product guide](https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5) lists 24/25 fps outputs. The checked API request shape exposes no 12 fps field. Request held stop-motion poses, then inspect the result and create a **12 fps delivery without frame interpolation**, preserving duration. Dropping frames alone does not create good stop-motion timing; rests and distinct action poses still need review.

## Acceptance of the eventual clip

Review consistent silhouette, front-only face, rigid handle, orange eye identity, jump clearance, one intended rotation, landing weight, stop-motion cadence, initial/final resting pose and white-background stability. Then inspect small-size readability beside the real wordmark and optimize for the page. Keep a static poster and honor reduced-motion preferences. Do not claim successful looping, transparency or actual 12 fps output until those artifacts have been produced and inspected.

The inputs and source contracts were checked; no video was generated or accepted. No credentials or account details are stored in these artifacts. API credentials remain in 1Password and are not page assets. Existing product/security ADRs are unchanged: this prepares reversible media assets and does not add runtime integration or a distribution/security decision.
