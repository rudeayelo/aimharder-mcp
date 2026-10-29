# WAN 3.0 curious glance comparison

Generated 2026-10-29 after the owner requested another model. One accepted Runway `wan3` task succeeded. Estimated cost and separately observed credit decrease both equal **30 credits (USD 0.30 in credit face value before tax)**. No WAN retry was submitted.

**Review: this model also fails the unchanged-capsule constraint.**

## Compare

- [Two-second 12 fps review edit](glance-2s-12fps.mp4).
- [Original provider output](source.mp4): 960 × 960, 90 frames at 30 fps, exactly 3 seconds, no audio.
- [Retimed edit before boundary replacement](retimed-2s-12fps.mp4).
- [Source samples](contact-sheet.jpg) and [all 24 delivery frames](delivery-contact-sheet.jpg), both row-major.
- [Tailscale preview with Kling 4 comparison](https://mini.taild6f227.ts.net:8443/aimharder-emotes-95/trial-03-wan-curious-glance/), requiring tailnet access and the running local server.

## Inputs and processing

The exact same [three-second curious-glance prompt](../prompts/02-curious-glance.txt) and neutral first/last images used by [Kling 4 trial 02](../trial-02-curious-glance/README.md) were reused. Model changed to `wan3`, `duration: 3`, `ratio: auto_720p`, `audio: false`. Prompt SHA-256, task state and actual charge evidence are in [receipt.json](receipt.json); no credentials, full account balances or signed/upload capability URLs are stored.

This compares the same image, acting instruction and requested duration across models; their native output resolution/frame rate and audio support differ. The newly generated [GPT Image target pose](../curious-reference/README.md) arrived after WAN was submitted and was **not** supplied to this task.

Current source contracts: [Runway input guide](https://docs.dev.runwayml.com/assets/inputs/), [official request types](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/types/image_to_video_create_params.py), and [pricing](https://docs.dev.runwayml.com/guides/pricing/), checked 2026-10-29. WAN supports first/last keyframes and 2–30 seconds; its 720p rate is 10 credits per generated second. No claim of superior motion quality was made before the test.

For the two-second review edit, timestamps are scaled by 60/90 (two-thirds), sampled at 12 fps without interpolation and resized to the existing common **940-square delivery plate size** using Lanczos. The source remains unchanged at 960 square. First and last three delivered frames use [the same neutral plate](neutral-plate.png) as the blink clip. H.264 CRF 18, `yuv420p`, no audio and `+faststart` are used. Both retimed and normalized outputs contain exactly 24 frames, 12 fps and 2.000000 seconds; actual metadata, filter and checksums are in [media-metadata.json](media-metadata.json). Boundary image identity before encode is not a guarantee of decoded H.264 pixel identity.

## Result

The source samples show a small rightward eye shift, but also major eye-height changes, unwanted blinking and some body/face movement. This is not the requested clean translation of full capsules on a stationary body. It is not accepted as the curious-glance asset and does not establish that switching models solves the issue. A separate [guided Kling 4 trial](../trial-04-guided-curious-glance/README.md) uses the owner's requested target pose instead.

Source samples and the delivery sheet were inspected, and FFprobe validated dimensions, frame rate, count, duration and absence of audio. Owner review and logo-size acceptance remain pending. No production player or public page changed. No MCP runtime tests apply; existing architecture/security/product ADRs are unaffected by this media comparison.
