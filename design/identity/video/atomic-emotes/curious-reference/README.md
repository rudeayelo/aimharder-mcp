# Curious gaze target pose

Created 2026-10-29 with the built-in GPT Image tool under the `imagegen` skill, after the owner requested a clean still of the emote to use as a video reference. This is one target pose of the existing character, not a new character or a contact sheet.

[View the generated pose](curious-right.png). The [neutral master](../../reference-pack/01-front-neutral.png) was the edit target. The exact [image prompt](image-prompt.txt), actual dimensions and checksum in [manifest.json](manifest.json) preserve provenance. The image was copied unchanged from the built-in tool output into this repository. It has an opaque background, 1254 × 1254 pixels, and is not a validated mesh render.

The intended change was a small joint translation of both complete eye apertures toward screen-right, preserving full capsule shapes and body geometry. Inspection shows a clear rightward gaze and fully visible orange capsules, with no dark lids. However, the displacement is visibly larger than requested and the spacing between the eyes changes slightly. Fine material details also vary. Treat it as a target-pose candidate pending owner approval, not proof of pixel-identical body geometry or exactly 6% translation.

The image is supplied as a **middle keyframe** in the [guided Kling 4 trial](../trial-04-guided-curious-glance/README.md), with the neutral master as both first and last keyframe. The [guided video prompt](guided-video-prompt.txt) names the three states and asks for full-eye translation without lid occlusion. A middle keyframe gives stronger pose guidance than an unpositioned style reference, but does not enforce rigid geometry or exact intermediate timing.

The already-running WAN comparison could not be modified after submission. WAN's current keyframe mode cannot be mixed with unpositioned reference-image mode, and its checked schema does not expose Kling 4's middle-keyframe control. The separate guided trial therefore returns to Kling 4 rather than silently passing an unsupported WAN request.
