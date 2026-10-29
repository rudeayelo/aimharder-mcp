# First Runway video trial

Generated on 2026-10-29 after the owner's explicit request to run the first trial. **Review candidate, not an accepted final animation.** No public home page or production service was changed.

## Watch

- [12 fps edit](kettle-12fps.mp4): 960 × 960 H.264 MP4, 73 frames, 6.083333 seconds, 1,266,753 bytes, no audio.
- [Original provider output](source.mp4): 960 × 960 H.264 MP4, 145 frames at 24 fps, 6.041667 seconds, 2,837,544 bytes, no audio.
- [Contact sheet](contact-sheet.jpg): original sampled at 4 frames/second, row-major order, 24 frames from approximately 0.0–5.75 seconds. It excludes the final neutral frame at 6.0 seconds.
- [Final frame](final-frame.jpg): extracted at 6.0 seconds from the original.
- [Private comparison preview](https://mini.taild6f227.ts.net:8443/aimharder-video-95/): manual playback, original/12 fps switching and download. Tailnet access and the local preview process are required. This is an experimental media viewer, not the public home-page design.

## Request and cost evidence

Model `klingO3_standard`, requested duration 6 seconds, square `960:960`, `audio: false`. The exact [final prompt](../reference-pack/final-video-prompt.txt) and its SHA-256 in [the receipt](receipt.json) identify the input. First and last keyframes both used `01-front-neutral.png`; appearance references were the three-quarter, profile, rear and eye-emote sheet. The storyboard was not submitted.

The first inline-data generation request received **HTTP 413** with no task ID. Its [rejection receipt](rejected-inline-request.json) is preserved; this was a transport rejection, not a failed generated clip. The same five unique assets were then uploaded through the provider's documented [ephemeral upload flow](https://docs.dev.runwayml.com/assets/uploads/) and referenced by internal provider URIs. Those capability-bearing URIs, signed form fields and signed output URLs are not stored here. A corrected small generation request was accepted once; that one task reached `SUCCEEDED` and produced one output.

Provider estimated cost: **78 credits**, matching the separately observed **78-credit balance decrease** over this operation. This agrees with the checked 13 credits/second × 6 seconds [published rate](https://docs.dev.runwayml.com/guides/pricing/), equivalent to USD 0.78 in credit face value before taxes. Full account balances and credentials are excluded from these repository receipts. The item was read from 1Password using the available service-account environment; the key stayed in process memory and was used only in authenticated API headers.

## Post-processing

The source file is unchanged. The 12 fps edit drops/resamples frames through FFmpeg's `fps=12` filter; it does not synthesize intermediate frames or regenerate content. It uses H.264, CRF 18, `yuv420p`, no audio and `+faststart`.

```sh
ffmpeg -i source.mp4 -vf fps=12 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -an -movflags +faststart kettle-12fps.mp4
```

The rate conversion preserves playback speed rather than slowing 24 fps footage to half speed. Frame quantization makes the edit 0.041666 seconds longer than the source: it retains a final sample at 6.0 seconds, held for one 12 fps frame. Do not describe both files as exactly six seconds. Metadata and checksums are in [media-metadata.json](media-metadata.json).

## Visual review

The sampled frames show one character, a small airborne turn with the plain blue back visible, a return to front and subsequent side-to-side rocking. Face/eye features disappear during the rear-facing segment. No copied reference-sheet captions or repeated actors appear in the sampled frames. The final extracted frame is neutral and broadly matches the opening identity/framing.

The result does **not** fully match the requested acting:

- The turn's precise 30° axis inclination is unverified and appears milder than the storyboard. Exact angular/physical continuity cannot be established from these generated frames.
- Eye shapes sometimes shrink to dots or become double horizontal marks; the intended gentle happy arches are not clearly realized. Eye sizes/material and silhouette proportions drift slightly during action.
- Rocking continues late into the shot, and neutral is recovered at the final extracted frame rather than through the requested long final rest. Endpoint resemblance does not establish a seamless loop or a natural settling transition.
- The 12 fps file has the requested encoded frame rate. That alone does not establish convincing handmade stop-motion timing; the owner's perceptual review remains pending.

The take is useful for evaluating motion but should not be promoted as the final logo animation. No second paid generation was submitted. The next iteration should prioritize clear single-aperture eyes and a shorter rocking phase with a longer neutral hold, then assess the tilt separately rather than adding complexity.

## Checks and boundaries

FFprobe confirmed actual codec, dimensions, frame counts, frame rates and duration of both files. Contact-sheet and final-frame inspection were completed. The Tailscale browser preview loaded the 960-square 12 fps asset without a media error and played to its end. Source/12 fps switching is kept local to the preview. No autoplay is used. Actual device acceptance, small-size wordmark composition, alpha extraction, seamless looping and owner approval remain pending.

This delivery changes generated media, an isolated preview and documentation only. No runtime TypeScript, MCP, sporting-action, credential-storage, deployment or public API behavior changed. No full runtime test suite or typecheck was run. Existing product/security ADR decisions remain unchanged; no new ADR is warranted for the reversible media trial.
