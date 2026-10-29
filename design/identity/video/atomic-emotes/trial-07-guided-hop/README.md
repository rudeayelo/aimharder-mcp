# Guided hop with closed-eye anticipation and landing rock

Owner feedback: the owner likes this hop clip and moved on to the queued dance. It is retained as an approved motion candidate; earlier owner-review statements below describe the inspection checkpoint. Final logo composition and cross-emote runtime acceptance remain pending.

Generation requested 2026-10-29 after the owner approved the small-hop emote and added two acting requirements: close the eyes during anticipation and rock a little on the base after landing. The [catalog prompt](../prompts/06-small-hop.txt) was updated to match these requirements.

## Inputs

Request: `model: kling_4`, `duration: 3`, `ratio: auto_720p`, a single shot with no unpositioned references or reference video. Kling 4 exposes no audio toggle in this request shape.

| Keyframe role | Asset |
| --- | --- |
| First | Original [neutral master](../../reference-pack/01-front-neutral.png). |
| Middle 1 | [Grounded closed-eye anticipation](../hop-reference/anticipation-closed.png), reused from the blink take. |
| Middle 2 | [Airborne with open neutral eyes](../hop-reference/airborne.png), newly edited with built-in GPT Image. |
| Middle 3 | [Grounded landing lean](../hop-reference/landing-rock.png), reused from the rock reference. |
| Last | Same original neutral master. |

The middle keyframes are supplied in array order. The [guided video prompt](../hop-reference/guided-video-prompt.txt) asks for one low vertical hop, eye closure before takeoff, reopening during ascent and a small diminishing side-to-side base-rocking recovery. It explicitly excludes an extra airborne bounce, spin, squash or handle bending. Ordering does not lock exact timing or validate physical continuity. [Reference provenance](../hop-reference/README.md) and [manifest](../hop-reference/manifest.json) distinguish reused and new images.

## Completed outputs

The same accepted task eventually succeeded after the long provider delay. No second generation was submitted. Provider estimated cost was **39 credits (USD 0.39 in credit face value before tax)**; because status tracking resumed in another process, an independent final balance decrease is unavailable for this task. Do not relabel that estimate as a measured balance delta. The task receipt retains its original submission and completion times.

- [Two-second 12 fps edit](hop-2s-12fps.mp4).
- [Original provider output](source.mp4).
- [Retimed take before common neutral holds](retimed-2s-12fps.mp4).
- [Original samples](contact-sheet.jpg) and [all 24 delivered frames](delivery-contact-sheet.jpg), row-major order.
- [Actual media metadata and hashes](media-metadata.json), [sanitized task receipt](receipt.json).
- [Tailscale comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-07-guided-hop/), requiring tailnet access and the local HTTP server. Playback remains manual.

## Processing

The original is 940 square, 73 H.264 video frames at 24 fps, 3.041667 seconds of video. Its AAC track extends the container to 3.041995 seconds; its audio content was not assessed and is stripped from both edits. The local processor checked the downloaded source against the receipt checksum before processing. Source timestamps are scaled by 48/73, sampled with `fps=12`, limited to 24 frames and retained at 940 square, without interpolation. The first and last three frames use the unchanged shared [neutral plate](neutral-plate.png). The source and pre-boundary-replacement edit remain separate.

Both edits use H.264 CRF 18, `yuv420p`, no audio and `+faststart`. FFprobe verifies exactly **24 frames, 12 fps, 2.000000 seconds, 940 × 940 and no audio**. Pre-encode endpoint imagery is shared; lossy H.264 does not guarantee decoded pixel equality. Visible joins at the eventual logo size still need review.

The temporary local follow-up processed this existing task only and exited on completion. It submitted no replacement task, performed no automatic git commit and configured no chat notification. The preview retains its readiness check but now exposes the completed clip and original/edit controls. HTTP serving and inline script syntax were checked; live browser playback was not verified because both Chrome and the in-app browser were unavailable during this delivery.

## Visual inspection

The original samples and all 24 delivery frames were inspected after download. They show a brief closed-eye anticipation with one orange slit per eye, one airborne hop with open eyes and a separated shadow, contact with the floor, side-to-side base rocking and return to upright neutral rest. The handle, face and eyes broadly accompany the body. The reopened eyes briefly show a dark lid-like transition before recovering their full capsule appearance. Rocking amplitude and lift are stronger than the subtle source targets, and rigid geometry/contact physics are not established; fine material and silhouette drift persists. No spin, extra actor or clear second airborne hop appears in the inspected sequences.

These are frame-inspection findings, not owner perceptual acceptance or a validated physical simulation. Timing, eye transition quality, logo-size readability and cross-emote playback remain pending owner review. The output is retained as a review candidate without another paid generation or a corrective pose assembly.

## Scope and consistency

The catalog prompt now records the owner's closed-eye anticipation and grounded landing-rock requirements; this intentionally supersedes its original neutral-eye-only hop wording. Local prompt/reference hashes and links were checked. Earlier delight and rock receipts also had their descriptive relative middle-frame labels corrected to the actual previously uploaded asset paths; no provider inputs or generated outputs were changed by that metadata correction.

No production page, runtime player, deployment, dance or surprise generation was implemented. No MCP runtime tests apply; existing product/security/architecture ADRs are unaffected by this reversible media study.
