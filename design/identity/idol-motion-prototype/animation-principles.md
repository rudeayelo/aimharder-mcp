# Animation direction — V2

The owner accepted the direction of the first 3D trial, requested faster gestures, and asked us to study the twelve animation principles. Sources reviewed: the supplied [Wikipedia article](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation) and the primary [Frank Thomas / Ollie Johnston physical-animation notes](https://frankanollie.com/PhysicalAnimation.html). The short Google share URL was inaccessible to the research tool; the named article was read directly.

These are artistic choices for this specific prototype, not a claim that every principle has been fully implemented or perceptually validated.

| Principle | Application to this kettle |
| --- | --- |
| Squash and stretch | Restrained preparation/impact compression and takeoff stretch. The two transverse scales compensate the height scale, preserving transform volume. The PLY remains unchanged. |
| Anticipation | Two preparation poses lead into lift or rotation, with a small counter-turn before the spin. |
| Staging | One gesture per clip, a fixed default camera and ample white space keep the handle and face readable. Drag is an inspection control. |
| Straight ahead / pose to pose | Explicit exposed poses define the gesture; no universal smoothing curve erases its accents. |
| Follow through / overlap | Angular overshoot and decaying settle continue after landing. Height and rotation settle on different beats. The curved-recess rig now closes the floor/walls/lip during anticipation and varies the complete carved contour during curiosity. Independent handle lag remains deferred. |
| Slow in / slow out | Unequal pose spacing contrasts preparation, fast impulse, slower apex and sharper impact. |
| Arcs | Parabolic vertical lift plus a small lateral excursion replaces eased, floating vertical segments. |
| Secondary action | Small supporting yaw enriches the rock/hop. The hybrid curiosity gesture moves and reshapes the complete curved eye recess, including its cavity walls. |
| Timing | Rock 14, hop 16 and spin 18 exposures at 12 fps replace 24-exposure clips. The eye-only double blink uses the separately owner-preferred 24 fps / one-second cadence. |
| Exaggeration | The spin keeps its 30-degree lean; restrained body compression clarifies impact. |
| Solid drawing / weight | The original 3D shape supplies volume; approximate sampled-base support keeps a tilted pose near its contact plane. This is artistic support, not physics. |
| Appeal | Preserve the simple orange eyes, circular face and recognizable silhouette. Final cuteness and naturalness remain owner judgments. |

## Web integration proposal (not implemented)

The prototype already uses Three.js with Visus. A production logo could place a transparent canvas between the text elements and use a static poster while the model loads, when motion is reduced, or when rendering is unavailable. Load the 3D renderer only where the mascot appears, stop rendering while idle/offscreen, and trigger infrequent gestures rather than endless motion. Video exports from the same model remain an alternative.

The source is still 17.8 MB uncompressed. Compression, actual mobile GPU/load-time measurements and the tradeoff against pre-rendered video must be evaluated before selecting the production delivery. No architecture ADR is adopted by this experiment.
