# Kling 4 atomic blink trial

Subsequent edit: the [double blink](../double-blink/README.md) reuses three poses from this take for two quick blinks, with no additional generation. The files below preserve the original slow-blink experiment.

Generated 2026-10-29 after the owner requested the first atomic blink trial. One accepted `kling_4` task succeeded. Provider estimate and observed balance decrease both equal **39 credits**, equivalent to USD 0.39 in credit face value before tax. No additional generation was submitted.

## Watch and inspect

- [Two-second 12 fps delivery](blink-2s-12fps.mp4): 940 × 940, 24 frames, exactly 2 seconds, H.264, no audio.
- [Retimed output before boundary replacement](retimed-2s-12fps.mp4).
- [Original provider output](source.mp4): 940 × 940, 24 fps, 73 video frames, 3.041667 seconds of video. Its AAC track extends the container to 3.041995 seconds. Audio was not assessed and is removed from delivery.
- [Original contact sheet](contact-sheet.jpg): sampled at 8 fps, 24 frames, row-major order.
- [Delivery contact sheet](delivery-contact-sheet.jpg): all 24 delivered frames, row-major order.
- [Shared neutral plate](neutral-plate.png).
- [Private comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-blink-95/): Tailscale and the running local preview server are required. Playback starts manually.

The exact [submitted prompt](../prompts/01-blink.txt) is identified by SHA-256 in [receipt.json](receipt.json). The first and last keyframe both use the unchanged [neutral master](../../reference-pack/01-front-neutral.png). There are no additional reference images, middle frames or video references. Request: `duration: 3`, `ratio: auto_720p`, single shot. Kling 4 supplied audio without an audio request field. The key was read from 1Password into process memory; credentials, signed URLs, upload URIs and account balances are excluded from artifacts.

## Delivery processing

The actual source contains 73 frames at 24 fps, slightly longer than the requested three seconds. A frame timestamp factor of **48/73** followed by `fps=12` and a 24-frame limit creates exactly two seconds without interpolation. This is approximately 1.521× speed, accounting for the provider's extra frame rather than blindly assuming a 3.000-second source. Both edits strip audio and use H.264 CRF 18, `yuv420p` and `+faststart`.

The final delivery is encoded from a 24-frame PNG sequence. Frames 1–3 and 22–24 (one-based) use the same neutral master resized once to 940 square with FFmpeg Lanczos; frames 4–21 use the retimed generation. This provides common opening/closing holds for later combination. The pre-encode boundary images are identical; lossy H.264 does not guarantee pixel-identical decoded frames. The separately retained retimed version makes the provider result distinguishable from boundary normalization.

Equivalent retime command, run from this directory:

```sh
ffmpeg -i source.mp4 -vf 'setpts=(48/73)*(PTS-STARTPTS),fps=12' -frames:v 24 -c:v libx264 -crf 18 -pix_fmt yuv420p -an -movflags +faststart retimed-2s-12fps.mp4
```

## Review

Inspection shows one simultaneous close/reopen cycle. Each eye becomes one orange slit and returns to a vertical capsule; the double-line artifact from the earlier composite take is not visible in the inspected frame sequences. No additional eyes, mouth, captions or actors appear. The body remains broadly front-facing and stationary, although subtle generated contour/material variation persists; do not claim perfectly rigid geometry.

The eyes stay closed through much of the action, making this a slow, deliberate blink rather than a quick natural blink. The retimed cadence and small transitions between generated footage and the common neutral plate need owner review. The sampled boundary poses are close, but the plate change does not establish a perceptually invisible join at every display size. This single take also changes model, duration, prompt and reference set together; improvement cannot be attributed to Kling 4 alone.

FFprobe confirms both edited files have exactly 24 frames at 12 fps, duration 2.000000, and no audio stream. The Tailscale browser preview loads the delivery at 940 square and plays to its end without a reported media error. [Metadata and checksums](media-metadata.json) preserve the actual outputs. No second emote, production page, runtime integration, transparent export or cross-emote sequence was created. Owner acceptance and small-logo readability remain pending.

Documentation-only/media checks apply here; no MCP runtime test suite was run. Existing product/security/architecture ADRs are unaffected by this reversible media trial.
