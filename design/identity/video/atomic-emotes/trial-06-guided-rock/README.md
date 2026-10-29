# Guided playful rock

Prepared and generated 2026-10-29 after the owner chose a body-motion emote next. Surprise is deferred because of its similarity to the delight expression; this does not authorize generation of the remaining emotes.

## Input

First and last keyframes use the same original [neutral master](../../reference-pack/01-front-neutral.png). The [GPT Image left-lean pose](../rock-reference/rock-left.png) is explicitly assigned as the middle keyframe. Model `kling_4`, requested duration 3 seconds, quality `auto_720p`; no unpositioned reference images, reference video or audio parameter. Kling 4 exposes no audio toggle in this request shape.

The [guided prompt](../rock-reference/guided-video-prompt.txt) requests one grounded left lean of about eight degrees, a smaller right lean of about four degrees and a return to the original upright pose. Eyes remain neutral while the body, face and handle move as one rigid unit. [Target image provenance](../rock-reference/README.md) records the exact GPT Image instruction and actual file metadata. These angles and rigid geometry are generation targets, not established physical constraints.

## Outputs

- [Two-second 12 fps review edit](rock-2s-12fps.mp4).
- [Original provider take](source.mp4).
- [Retimed take before common neutral holds](retimed-2s-12fps.mp4).
- [Original samples](contact-sheet.jpg) and [all delivery frames](delivery-contact-sheet.jpg), row-major order.
- [Shared neutral plate](neutral-plate.png).
- [Task/cost receipt](receipt.json) and [actual media metadata](media-metadata.json).
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-06-guided-rock/), requiring tailnet access and the running local server. Playback is manual.

## Execution and review

One accepted task succeeded. Provider estimated cost and separately observed balance decrease both equal **39 credits (USD 0.39 in credit face value before tax)**. The GPT Image reference was generated through the built-in tool, not the Runway image API. No further generation was submitted.

Inspection shows an upright start, one left lean, an opposite recovery and a return to upright rest. The handle, face and capsule eyes broadly follow the body's tilt together. No independent eye blink, new facial parts, spin or obvious airborne hop appears in the inspected frame sequences. The base appears grounded through the rocking. These observations do not establish exact rigid geometry, contact physics or zero sliding.

Both leans are visibly stronger than the requested approximately 8°/4°, and the rightward recovery is not clearly as small relative to the left as intended. The current review edit retains this broader acting rather than capping it automatically; owner review of amplitude and cadence is pending. Fine silhouette/material and eye-rim variation persists. Exact angles were not measured.

## Delivery processing

The source is 940 square, H.264 at 24 fps, 73 frames, 3.041667 seconds of video. Its AAC track extends the container to 3.041995 seconds; audio content was not assessed and is removed from both edits. Source timestamps are scaled by 48/73, then sampled with `fps=12`, limited to 24 frames, and retained at 940 square. This accounts for the extra provider frame and creates a two-second review delivery without interpolation.

The normalized edit replaces its first and last three frames with an unchanged copy of the existing 940-square [neutral plate](neutral-plate.png), matching the other emote pipeline. Original and pre-boundary-replacement versions remain separate. H.264 CRF 18, `yuv420p`, no audio and `+faststart` are used. Pre-encode boundary imagery matches, but lossy H.264 does not guarantee decoded pixel identity. Check visible joins at the eventual logo size.

## Verification and scope

The target pose, original source samples and all 24 delivered frames were inspected. FFprobe confirms **24 frames at 12 fps, exactly 2.000000 seconds, 940 × 940 and no audio** for both edits. The submitted prompt hash matches the saved guided prompt. The Tailscale preview loads the 940-square delivery and plays to completion without a reported media error. Original output, sanitized receipt and checksums preserve provenance.

Owner acceptance, final logo-size readability and cross-emote playback remain pending. The owner separately chose to retain the subtle delight edit as a minor variation despite finding it very subtle; that decision does not accept this new rock clip. No production page, runtime player, deployment or remaining emote was implemented. No MCP runtime tests apply; existing product/security/architecture ADRs are unaffected by this media experiment.
