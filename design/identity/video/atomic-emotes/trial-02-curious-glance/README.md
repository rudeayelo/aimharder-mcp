# Kling 4 curious glance trial

Generated 2026-10-29 after the owner authorized the next emote. One accepted `kling_4` task succeeded. Provider estimate and separately observed balance decrease both equal **39 credits (USD 0.39 in credit face value before tax)**. No second generation was submitted.

**Review result: the requested unchanged-eye-shape constraint is not met. This take is not an accepted curious-glance asset.**

## Outputs

- [Two-second 12 fps review edit](glance-2s-12fps.mp4): 940 × 940, 24 frames, exactly two seconds, no audio.
- [Retimed edit before neutral-boundary replacement](retimed-2s-12fps.mp4).
- [Original provider output](source.mp4): 940 square, 73 video frames at 24 fps, 3.041667 seconds of video. The AAC track extends the container to 3.041995 seconds; its content was not assessed and is stripped from the edits.
- [Source contact sheet](contact-sheet.jpg): 24 samples at 8 fps, row-major order.
- [All 24 delivery frames](delivery-contact-sheet.jpg).
- [Source midpoint](midpoint.png): original zero-based frame 30, showing the unwanted eye occlusion.
- [Shared neutral plate](neutral-plate.png).
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-02-curious-glance/): requires tailnet access and the running local server. Manual playback, with original/edit switching.

## Input and request evidence

The submitted [curious-glance prompt](../prompts/02-curious-glance.txt) requests a stationary body and a small movement of both capsule eyes toward screen-right, retaining their original shape and size, then returning to center. Its trimmed-text SHA-256 is in [receipt.json](receipt.json).

Request: `model: kling_4`, `duration: 3`, `ratio: auto_720p`. Both first and last keyframes use the unchanged [neutral master](../../reference-pack/01-front-neutral.png). No other image references, middle frames, video references or audio parameter were supplied. Ephemeral uploads were used; credential values, upload capabilities, signed output URLs and account balances are excluded from these artifacts.

## Processing and checks

The review edit follows the earlier blink delivery workflow. Source timestamps are scaled by **48/73**, followed by `fps=12` and a 24-frame limit, accounting for the actual 73 source frames. This produces a two-second review edit without frame interpolation. First and last three frames then use an unchanged copy of the same 940-square neutral plate used by the blink clip. The edited files use H.264 CRF 18, `yuv420p`, no audio and `+faststart`. The unmodified provider output and pre-boundary-replacement edit remain separate.

The pre-encode endpoint plates are identical; lossy H.264 encoding does not guarantee decoded pixel equality. This normalization cannot repair the unwanted expression in the middle of the clip. The [metadata/checksums](media-metadata.json) record actual files; FFprobe confirms 24 frames, 12 fps, 2.000000 seconds and no audio for both edits. Source and midpoint images were inspected. The browser preview loads the 940-square edit and plays to its end without a reported media error.

## Visual result and next decision

The generated body stays broadly stationary and front-facing, and the eyes return to neutral. A small rightward shift is visible, but the model also introduces dark lid-like occlusion across the upper eyes and changes the visible orange shapes into short rectangular forms. This violates the prompt's constant capsule shape and size; it reads partly as narrowing or squinting rather than a clean curious glance. Minor material variation remains. Exact displacement and rigid geometry were not measured.

Owner review of the clip remains pending. Do not promote this take as satisfying the requested emote. A potential next step is a controlled local edit of the original eye features, or a clean target-pose keyframe for a separate model trial; neither correction was performed here. No other emotes, production player, public page or runtime integration were created. The overall staged design remains in progress.

Only media and documentation changed. No MCP runtime checks were run. Existing product/security/architecture ADRs are unaffected by this reversible media experiment.
