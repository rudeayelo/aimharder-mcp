# Side-bounce dance trial

Generated 2026-10-29 after the owner approved the queued dance: two low rebounds toward each side, then return to neutral, keeping the eyes open. One accepted `kling_4` task succeeded. Estimated cost and separately observed credit decrease both equal **39 credits (USD 0.39 in credit face value before tax)**. No second generation was submitted.

## Watch

- [Two-second 12 fps edit](dance-2s-12fps.mp4).
- [Original provider output](source.mp4).
- [Retimed output before boundary replacement](retimed-2s-12fps.mp4).
- [Source samples](contact-sheet.jpg) and [all 24 delivered frames](delivery-contact-sheet.jpg), row-major order.
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-08-side-bounce-dance/), requiring tailnet access and the running local server. Manual original/edit playback and download.

## Inputs and request

The original [neutral master](../../reference-pack/01-front-neutral.png) is both first and last keyframe. The existing [airborne pose and left-lean pose](../dance-reference/README.md) are supplied as two unpositioned `references` entries, not chronological middle frames. No new GPT Image asset was generated. The [guided prompt](../dance-reference/guided-video-prompt.txt) specifies LEFT, LEFT, RIGHT, RIGHT and treats the references as examples of the same character's low lift and side lean.

Request: `model: kling_4`, `duration: 3`, `ratio: auto_720p`. Kling 4 exposes no audio toggle in this request shape. No video references were supplied. The [receipt](receipt.json) preserves task identity, prompt hash, status and cost evidence. Credentials, account balances and upload/signed-output capabilities are excluded. The [reference manifest](../dance-reference/manifest.json) preserves unchanged source-image checksums.

## Processing

The source is 940 square, 73 H.264 frames at 24 fps, 3.041667 seconds of video. Its AAC track extends the container to 3.041995 seconds; audio content was not assessed and is removed from both edits. The source is preserved unchanged.

Timestamp factor 48/73, `fps=12` and a 24-frame limit create exactly two seconds without interpolation. The delivery uses the common neutral plate for **frame 1 and frames 22–24**, one-based. Unlike earlier clips' three-frame opening hold, the one-frame opening replacement preserves the generated first takeoff preparation rather than jumping directly into the first airborne pose. The first and last imagery still use the same [neutral plate](neutral-plate.png); lossy H.264 does not guarantee decoded pixel equality.

Both edited files use H.264 CRF 18, `yuv420p`, no audio and `+faststart`. [Actual metadata and checksums](media-metadata.json) record source and edits, including the exact boundary-frame replacement list. FFprobe confirms **24 frames, 12 fps, 2.000000 seconds, 940 × 940 and no audio**.

## Review

The source samples and all delivered frames show four airborne/landing phases, with leftward leans during the first part and opposite leans during the latter part, followed by upright center rest. The eyes remain open capsules; no new facial parts, spin or extra actor appears. The handle, face and eyes broadly accompany the body.

The model adds stronger leans/lifts than the small reference targets and visible squash-like shape changes around some landings. The left/right travel distances and exact hop count/direction timing are visual inspection findings, not measured 3% translation or validated rigid-body physics. The edit preserves the generated acting without another pose assembly or paid retry. Owner review of rhythm, four-beat readability, visible joins and small-logo composition remains pending.

The browser preview loaded the 940-square two-second edit and played to completion without a reported media error. Local links, prompt/reference hashes, sanitized receipt and exact media metadata were checked. No production page, runtime player or deployment changed. No MCP runtime tests apply; existing product/security/architecture ADRs are unaffected. Surprise remains deferred, and no additional emote was generated.
