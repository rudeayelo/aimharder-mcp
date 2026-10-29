# Guided curious gaze with a GPT Image target pose

Generated 2026-10-29 after the owner suggested generating the gesture as a GPT Image still and passing it to the video model. This is separate from the already-running [WAN 3.0 comparison](../trial-03-wan-curious-glance/README.md).

## Input setup

- First keyframe: original [neutral master](../../reference-pack/01-front-neutral.png).
- Middle keyframe: [GPT Image curious-right target](../curious-reference/curious-right.png).
- Last keyframe: same original neutral master.
- Prompt: [guided-video-prompt.txt](../curious-reference/guided-video-prompt.txt).
- Model: `kling_4`, requested duration 3 seconds, quality `auto_720p`, no unpositioned references or video references. The checked schema exposes no audio toggle for Kling 4.

The target image gives the model a complete rightward eye pose rather than asking it to infer the gesture from text alone. It is supplied explicitly as a `middle` keyframe. The original neutral frame remains authoritative for both endpoints. The generated target has some spacing/material drift and a stronger-than-requested gaze, documented in [its provenance](../curious-reference/README.md). It is a candidate, not an owner-approved pixel-exact edit.

This experiment changes both pose guidance and prompt relative to trial 02, so it cannot isolate a causal improvement from the reference image alone. Current contracts: [Runway input guide](https://docs.dev.runwayml.com/assets/inputs/), [official request types](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/types/image_to_video_create_params.py), and [pricing](https://docs.dev.runwayml.com/guides/pricing/), checked 2026-10-29. No capability-bearing upload/output URLs, full account balances or credentials are stored.

## Files

- [Two-second review edit](glance-2s-12fps.mp4).
- [Original generated output](source.mp4).
- [Retimed edit before shared neutral holds](retimed-2s-12fps.mp4).
- [Original samples](contact-sheet.jpg) and [all 24 delivery frames](delivery-contact-sheet.jpg), row-major order.
- [Shared neutral plate](neutral-plate.png).
- [Task and cost receipt](receipt.json), [actual media metadata](media-metadata.json).
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-04-guided-curious-glance/), requiring tailnet access and the running local server. Offers the guided original, WAN and unguided Kling 4 edits for comparison.

## Execution, processing and review

One accepted task succeeded. Provider estimate and separately observed credit decrease both equal **39 credits (USD 0.39 before tax in credit face value)**. Combined with WAN's 30 credits, this round consumed 69 Runway credits. The image was generated through the built-in GPT Image tool, not the Runway image API; no extra Runway image charge was incurred. No further generation was submitted.

The actual source is 940 square, 73 frames at 24 fps, 3.041667 seconds of video, with an AAC track extending its container to 3.041995 seconds. Its audio was not assessed and is removed from all edits. The ordinary two-second review edit uses timestamp factor 48/73, `fps=12`, 24 frames, and the shared neutral plate in its first/last three frames. The source and pre-boundary-replacement edit remain separate. H.264 CRF 18, `yuv420p`, no audio and `+faststart` are used.

Inspection shows a clear rightward translation of complete capsule eyes, without the dark lid-like occlusion of the earlier unguided take. The body stays broadly stationary. However, the generated return continues past center into a leftward gaze, adding an unwanted second direction. Eye spacing/shape and material are not perfectly rigid, and the supplied target itself has some drift. This is an improved candidate, not proof of exact geometry or complete adherence.

## Locally corrected return

The [clean two-second edit](curious-clean-2s-12fps.mp4) is the default preview and proposed review candidate. It omits the generated leftward overshoot and uses the already-generated outbound poses in reverse for the return. The [edit decision](clean-edit-decision.json) records every delivered frame; [all 24 clean frames](clean-contact-sheet.jpg) are available.

| Delivered frames (one-based) | Pose source |
| --- | --- |
| 1–3 | Shared neutral plate. |
| 4–6 | Original zero-based frames 15, 18, 21. |
| 7–13 | Hold original frame 24, the rightward pose. |
| 14–16 | Original frames 21, 18, 15, reversing the outbound poses. |
| 17–24 | Shared neutral plate. |

This is a pose assembly, not an unmodified model output. It introduces no interpolation or additional generation. FFprobe confirms **24 frames at 12 fps, exactly 2.000000 seconds, 940 × 940, no audio**. The common neutral plate matches the blink pipeline before encode; lossy H.264 does not guarantee decoded pixel equality. Fine pose/material changes may remain visible as stop-motion pops. Owner review of cadence, small-logo readability and joins remains pending.

Both source and delivered frame sheets were inspected. The Tailscale browser preview loads the 940-square clean edit and plays to its end without a reported media error. It offers the full generated motion and both model comparisons separately. No production page, runtime player, transparent export or other emote was implemented. No MCP runtime tests apply; existing product/security/architecture ADRs are unaffected.
