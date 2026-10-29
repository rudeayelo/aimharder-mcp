# Guided delight emote

Generated 2026-10-29 after the owner approved creating the delight target with GPT Image and using it as an intermediate video pose. One accepted `kling_4` task succeeded. Estimated cost and separately observed credit decrease both equal **39 credits (USD 0.39 in credit face value before tax)**. No further video generation was submitted.

## Watch

- [Subtle two-second edit](delight-subtle-2s-12fps.mp4): proposed review candidate, using only the early enlargement poses and reversing them for the return.
- [Full generated expression, two-second edit](delight-2s-12fps.mp4): preserves the model's much larger eye expression, with shared neutral boundary holds.
- [Original provider output](source.mp4): 940 square, 73 video frames at 24 fps, 3.041667 seconds of video. Its AAC track extends the container to 3.041995 seconds. Audio content was not assessed and is stripped from delivery.
- [Retimed take before boundary replacement](retimed-2s-12fps.mp4).
- [Source contact sheet](contact-sheet.jpg), [all full-expression edit frames](delivery-contact-sheet.jpg), and [all subtle edit frames](subtle-contact-sheet.jpg). Row-major order.
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-05-guided-delight/): requires tailnet access and the running local server. Manual playback with subtle/full/original selection.

## Inputs

First and last keyframes both use the original [neutral master](../../reference-pack/01-front-neutral.png). The [GPT Image delight pose](../delight-reference/delight.png) is explicitly assigned `position: middle`. No unpositioned reference-image array or video reference is supplied. Request: `model: kling_4`, `duration: 3`, `ratio: auto_720p`. Kling 4 exposes no audio toggle in this request shape.

The [exact guided video prompt](../delight-reference/guided-video-prompt.txt) requests one gentle enlargement of both full capsule eyes around their original centers and a return to neutral, while the body stays still. [Receipt](receipt.json) records the trimmed prompt hash, task status and cost evidence. [Image provenance](../delight-reference/README.md) records the built-in GPT Image prompt and actual target-file metadata. This image was not generated through the Runway image API. Credentials, account balances and capability-bearing upload/output URLs are excluded from artifacts.

## Result and local editing

Source-frame inspection shows both eyes enlarging together and returning to the neutral capsules, without new face parts or the lid-like occlusion observed in the earlier unguided curious-glance take. However, Kling greatly exceeds the requested subtle enlargement at its peak and changes the eye surface appearance. The raw peak reads as a much broader expression than the supplied target. Do not describe the original take as exact 10% scaling or perfectly rigid geometry. Body/material details also vary slightly.

The full-expression review edit uses timestamp factor 48/73, `fps=12`, a 24-frame limit, and the common neutral plate for its first/last three frames. This accounts for the provider's actual extra source frame and yields exactly two seconds without interpolation.

The **subtle edit** caps enlargement by selecting only early source frames. The return reuses those same poses in reverse. This preserves the desired smaller change without another generation; it is a local pose assembly, not the untouched provider result. The [edit decision](subtle-edit-decision.json) records every delivered frame.

| Delivered frames (one-based) | Pose |
| --- | --- |
| 1–3 | Shared neutral plate. |
| 4–5 | Original zero-based frames 9, 10. |
| 6–14 | Hold original frame 11, the restrained enlargement. |
| 15–16 | Original frames 10, 9, reversing the enlargement. |
| 17–24 | Shared neutral plate. |

The slight eye-size change is visually selected rather than guaranteed 10% scaling on both axes. Whether this reads as delight at the final logo size remains for owner review. The subtle edit has exactly **24 frames, 12 fps, two seconds, 940 × 940**, without audio. All delivery edits use H.264 CRF 18, `yuv420p` and `+faststart`. [Actual metadata and checksums](media-metadata.json) distinguish the source, retimed take, normalized full expression and subtle assembly.

## Verification and scope

The target image, original samples and complete subtle frame sheet were inspected. FFprobe confirms both full-expression and subtle edits contain 24 frames at 12 fps, duration 2.000000 seconds, and no audio stream. The Tailscale browser preview loads the 940-square subtle clip and plays to completion without a reported media error.

The shared [neutral plate](neutral-plate.png) is unchanged from the blink pipeline. Pre-encode endpoint imagery matches; lossy H.264 does not guarantee decoded pixel identity. Slight pose/material changes may remain visible as stop-motion pops. Owner acceptance, small-logo readability and cross-emote playback remain pending. No production page, runtime player, deployment or other emote was changed. No MCP runtime tests apply to these media and documentation changes; existing product/security/architecture ADRs are unaffected.
