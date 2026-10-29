# Double blink edit

Current selection: the owner preferred playback at **2× speed**. The [one-second 24 fps edit](double-blink-1s-24fps.mp4) applies exactly that retime, retaining all 24 frames and neutral endpoint poses, with no interpolation or new generation. FFprobe confirms 24 frames at 24 fps, 1.000000 second and no audio; [metadata](fast-media-metadata.json). The preview defaults to this faster version and retains the two-second edit for comparison. The schedule below documents the earlier 12 fps timing; at the selected speed every hold lasts half as long (each blink 167 ms, the gap 167 ms, final neutral 333 ms). Owner approval of this encoded file remains pending.

Edited 2026-10-29 after the owner approved assembling two quick blinks from the existing [Kling 4 take](../trial-01-blink/README.md). **No new provider request or credit expenditure.**

[Watch the two-second edit](double-blink-2s-12fps.mp4), inspect [all 24 frames](contact-sheet.jpg), or use the [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/double-blink/). The preview requires tailnet access and the running local server. It also offers the previous slow blink for comparison.

## Exact timing

Frame numbers below are one-based. Each frame lasts 1/12 second.

| Frames | Pose |
| --- | --- |
| 1–4 | Open / shared neutral. |
| 5 | Half-closed. |
| 6–7 | Closed. |
| 8 | Half-open, reusing the half-closed pose. |
| 9–12 | Open / shared neutral. |
| 13 | Half-closed. |
| 14–15 | Closed. |
| 16 | Half-open, reusing the half-closed pose. |
| 17–24 | Open / shared neutral. |

Each closing/closed/opening gesture occupies four frames (333 ms), separated by four open frames (333 ms). The final neutral hold lasts eight frames (667 ms). Total: **24 frames, 12 fps, exactly two seconds**.

## Source and assembly

- [Open pose](poses/open.png): unchanged copy of the previous trial's 940-square shared neutral plate.
- [Half-closed pose](poses/half-closed.png): decoded source frame **17**, zero-based, of the original 24 fps provider video (approximately 0.708 s). Visually selected as the intermediate closure; not a claim of exactly 50% measured eye height.
- [Closed pose](poses/closed.png): decoded source frame **27**, zero-based (1.125 s), one orange slit per eye.

The full frames are reused without painting, morphing, optical flow or interpolation. Both blinks use the same intermediate and closed poses. The [edit decision](edit-decision.json) records the complete sequence. Assembly copies those PNGs into a numbered temporary sequence and encodes it with FFmpeg at input `-framerate 12`, `-frames:v 24`, H.264 CRF 18, `yuv420p`, `-an` and `+faststart`. No motion retime is needed: the poses are explicitly held for the listed frame counts.

The uncompressed opening and closing poses are identical. H.264 is lossy, so decoded pixel identity is not guaranteed. The generated intermediate poses retain small body/material differences from the neutral plate, which may read as a slight stop-motion pop. This edit deliberately preserves existing full-frame poses rather than introducing a new facial composite. Owner review at the eventual logo size remains pending.

## Verification and boundaries

All three poses and the complete 24-frame contact sheet were visually inspected. FFprobe confirms 940 × 940 H.264, 24 frames, 12 fps, exactly 2.000000 seconds, and no audio stream; [metadata and SHA-256](media-metadata.json) are recorded. The Tailscale browser preview loaded the video and played to completion without a reported media error. The schedule is the owner's approved sequence; perceptual approval remains pending.

This is a local media edit with an isolated comparison viewer. No production home page, runtime player, model contract or MCP behavior changed. No runtime test suite was run; product/security/architecture ADRs are unaffected.
