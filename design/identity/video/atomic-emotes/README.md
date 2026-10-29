# Atomic kettle emotes

Latest generation: [curious glance with Kling 4](trial-02-curious-glance/README.md), one successful task at 39 credits. The model introduces lid-like eye occlusion and changes the orange capsule shapes, so the take is a review artifact rather than an accepted emote. The other four prompts remain ungenerated.

Timing update: the owner preferred the double blink at 2× playback speed. Its [current delivery](double-blink/README.md) is therefore one second at 24 fps, retaining all 24 poses/holds. This supersedes the two-second duration for this emote; the other ungenerated prompts retain their preparation targets.

Latest edit: the [double blink](double-blink/README.md) assembles two quick blinks into the approved 24-frame schedule using existing poses. It is two seconds at 12 fps, shares neutral opening/closing holds and consumes no additional credits.

Execution update: the owner authorized the [first Kling 4 blink trial](trial-01-blink/README.md). It succeeded at 39 credits and now includes a two-second 12 fps edit with shared neutral boundary holds. Earlier no-generation statements below describe prompt preparation; the other five emotes remain ungenerated.

Prepared 2026-10-29 under [design #95](https://github.com/rudeayelo/aimharder-mcp/issues/95). The owner changed the direction after [trial 01](../trial-01/README.md): each delivered clip should last **two seconds**, perform **one emote**, and start and finish in the same neutral pose. Clips will be combined in code later. This package contains prompts only; no new generation, paid request, playback code or home-page implementation was performed.

The previous six-second composite choreography is historical. Its eye drift motivates shorter, simpler acting and a model comparison; it does not prove that the previous model alone caused the defect or that a newer model will solve it.

## Proposed model comparison

Official Runway documentation checked 2026-10-29:

| Candidate | Duration and endpoint support | Role |
| --- | --- | --- |
| Kling 4, `kling_4` | 3–30 seconds; first, optional middle and last keyframes; reference images | Proposed next trial at 3 seconds, then retime to 2 seconds. Account access and result quality unverified. |
| Kling O3 Standard, `klingO3_standard` | 3–15 seconds; first/last and references | Baseline for a controlled comparison of the same simple emote. |
| Gen-4.5, `gen4.5` | 2–10 seconds; first frame only in the current request schema | Can generate two seconds directly but cannot provide the same explicit last-frame control. |

Sources: [Runway input constraints](https://docs.dev.runwayml.com/assets/inputs/), [API model enumeration](https://docs.dev.runwayml.com/api/), [official SDK request types](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/types/image_to_video_create_params.py). Context7 lookup did not return a matching Runway API library, so the provider's own documentation and request types were used directly.

Kling 4 is actually listed by Runway; it is not another name for Runway Gen-4. Its first/last controls constrain generation but do not guarantee identical decoded endpoint pixels or a seamless transition. There is no verified native 12 fps control in the checked request shape.

At the currently published promotion through November 30, 2026 UTC, a 3-second Kling 4 720p image-to-video request without video references is estimated at **39 credits (USD 0.39 before tax)**: ceil(ceil(3 × 15.7) × 0.8). The 1080p equivalent is 57 credits. Kling O3 Standard is 39 credits for 3 seconds; Gen-4.5 is 24 credits for 2 seconds. Kling 4 includes audio and exposes no audio toggle; strip it for delivery. These are estimates from [current pricing and rounding rules](https://docs.dev.runwayml.com/guides/pricing/), not charges incurred by this package. Recheck pricing and account availability before execution.

## Inputs and eye constraints

Use the same [neutral master](../reference-pack/01-front-neutral.png) as **both first and last keyframe**. The [manifest](manifest.json) records its hash and all prompt hashes. Use `kling_4`, `duration: 3`, `ratio: auto_720p`; submit one prompt at a time in one shot, without an audio parameter. No request has yet validated these settings on the account.

For these front-facing emotes, start with only the two endpoint assignments of that one image. Omit the multi-expression sheet, rear/profile views and old storyboard. This reduces competing shapes in the first comparison. It is a hypothesis to test, not a confirmed explanation of the old result. If eye drift persists, prepare one clean target-state image for the selected emote and evaluate a middle keyframe separately; do not submit a contact sheet as a middle frame.

Keep exactly two orange shapes, one connected aperture per eye. Prefer capsule changes over happy arches for this first set. A blink uses one slit per eye, never two stacked marks. No mouth, eyebrows, limbs or extra facial parts. Shape, lighting, backdrop and framing stay constant. For body emotes the eyes stay neutral, so a hop is not also an expression test. Numerical motion and eye-size targets are acting guidance, not enforced geometry.

## Ready-to-use prompts

Each file is a complete English prompt with the same character lock, timing and final neutral hold; no concatenation is needed.

| Order | Emote | Intended action |
| --- | --- | --- |
| 1 | [Blink](prompts/01-blink.txt) | Body still; one relaxed simultaneous blink, one slit per eye. |
| 2 | [Curious glance](prompts/02-curious-glance.txt) | Body still; eyes glance screen-right and return, capsule shape unchanged. |
| 3 | [Delight](prompts/03-delight.txt) | Body still; capsules enlarge gently by about 10% and return. |
| 4 | [Surprise](prompts/04-surprise.txt) | Body still; capsules stretch vertically about 15% and return. |
| 5 | [Playful rock](prompts/05-playful-rock.txt) | Neutral eyes; small alternating lean, approximately 8° then 4°, settle. |
| 6 | [Small hop](prompts/06-small-hop.txt) | Neutral eyes; one low vertical hop, land and settle without a turn. |

Start with the blink to test the eye defect directly. If satisfactory, the curious glance tests translating the same eye shapes; the hop tests body/material stability. Generate the remaining candidates only after assessing those results. The full tilted spin remains a later, separate candidate; it is deliberately absent from these short prompts.

## Two-second delivery and shared boundaries

| Delivered timing | Three-second source prompt | Intended state |
| --- | --- | --- |
| 0–0.25 s | 0–0.375 s | Hold neutral. |
| 0.25–1.5 s | 0.375–2.25 s | One emote, including its return movement. |
| 1.5–1.75 s | 2.25–2.625 s | Finish recovery to neutral. |
| 1.75–2 s | 2.625–3 s | Hold neutral. |

For a usable 3-second source, the proposed delivery is a 1.5× retime to **24 frames at 12 fps**, exactly two seconds, with no frame interpolation and no audio. This affects apparent weight and must be judged after retiming; it is not an invisible conversion. If it feels rushed, revise the acting or use another compatible model rather than silently extending the requested delivery. Simply trimming a three-second take would discard its neutral ending.

Do not assume the provider's last decoded frame matches the source image. For later assembly, create one shared neutral plate at the final dimensions, crop and color treatment. After a take has naturally returned close to neutral, use this same plate for its first and last neutral holds (target three frames at each end). Inspect both transitions into that plate: a visible snap means the take needs repair or rejection. An inserted plate cannot fix incompatible motion. H.264 encoding is lossy, so exact source-frame identity is not a guarantee of decoded pixel equality; check visible joins and, if strict pixel equality is required, validate a lossless master/frame sequence separately.

This boundary-normalization workflow is a proposal for the later media-processing stage. None of the six clips or their normalized boundary frames exists yet. When playback code is built, hold the same static neutral image between clips, retain constant layout, preload the next clip and handle reduced motion with that still. These are future requirements, not implemented behavior.

## Acceptance and scope

Inspect the entire selected take, the retimed version and repeated joins between different emotes. Check exactly one action, stable two-eye identity, rigid handle/body, neutral recovery without a snap, no reference-sheet text or extra actors, 24 delivered frames, 12 fps, two-second duration and absence of audio. Also check at the eventual logo size. Reject a take whose eye shapes drift even if its endpoints match.

Documentation links and prompt hashes are checked for this package. Model access, eye fidelity, motion quality, endpoint continuity and actual delivery encoding remain unverified until generation. Existing product, security and architecture ADRs are unaffected by this reversible prompt study. No runtime tests apply to these text-only media inputs. The overall design issue remains in progress.
