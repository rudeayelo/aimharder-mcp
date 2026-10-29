# Hop, anticipation and landing pose inputs

Prepared 2026-10-29 after the owner requested closed eyes during anticipation and a small base-rocking recovery on landing. The [guided video prompt](guided-video-prompt.txt) treats these as beats of one hop-and-settle gesture, not unrelated emotes.

| Ordered middle pose | Source and role |
| --- | --- |
| [Anticipation, eyes closed](anticipation-closed.png) | Unchanged copy of [the existing blink closed pose](../double-blink/poses/closed.png), a 940-square decoded provider frame. Each eye is one orange slit. |
| [Airborne apex](airborne.png) | New built-in GPT Image edit of the [neutral master](../../reference-pack/01-front-neutral.png). Requests a low vertical lift of the complete rigid character with open neutral eyes. |
| [Landing rock](landing-rock.png) | Unchanged copy of [the existing left-lean reference](../rock-reference/rock-left.png), to guide grounded recovery. |

The neutral master remains the first and last keyframe. These three middle poses are supplied in array order to [the Kling 4 trial](../trial-07-guided-hop/README.md). They are keyframes, not an unpositioned reference set. Their array order guides chronology; exact timestamps and physical continuity are not guaranteed.

The [new image prompt](image-prompt.txt) asks for a low hop apex with the same upright body/handle/face/eyes and floor level. Inspection confirms a single airborne character, open capsule eyes, a visible base-to-floor gap and a separated shadow. Exact lift percentage, fixed rigid geometry and pixel-identical material preservation are not established. Fine eye/rim and material differences persist across these generated references. The closed-eye input is 940 square and the other two poses are 1254 square; all share the same square composition, but projected geometry is not a validated mesh.

The [manifest](manifest.json) records actual dimensions, hashes and source paths for all three files. Only the apex is newly generated; the other two are exact reused assets. No new Runway image-generation task was used. Owner acceptance of the eventual motion and final small-logo composition remains separate.
