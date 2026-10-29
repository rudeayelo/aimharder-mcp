# Side-bounce dance references

Prepared 2026-10-29 after the owner approved the queued dance: two low rebounds toward each side, then neutral, with open neutral eyes throughout. Both images are exact copies of existing project assets; no new GPT Image generation was needed.

| Appearance/pose reference | Source and intended role |
| --- | --- |
| [Airborne](airborne.png) | Existing [hop apex](../hop-reference/airborne.png), to guide small lift, rigid body/handle and separated shadow. |
| [Left lean](lean-left.png) | Existing [rock pose](../rock-reference/rock-left.png), to guide the playful grounded lean and connected body/face movement. |

The [manifest](manifest.json) records actual dimensions, source paths, bytes and checksums. The original [neutral master](../../reference-pack/01-front-neutral.png) is assigned as both first and last keyframe. These two extra poses are supplied as **unpositioned reference images** to Kling 4, not timed middle keyframes. They illustrate motion/appearance, while the [video prompt](guided-video-prompt.txt) specifies the four-beat sequence. This avoids forcing one airborne reference into a single chronological jump; reference images do not guarantee the correct hop count or geometry.

The prompt requests LEFT, LEFT, RIGHT, RIGHT, with tiny horizontal travel and a clear low hop/landing on each beat, returning to the starting center. The reference left lean is also appearance guidance for the opposite direction; no new right-lean image was generated. The eyes remain open and neutral. Body, handle, face and eyes should move together; exact physical rigidity is not established by the raster references. The resulting [video trial](../trial-08-side-bounce-dance/README.md) requires full motion and owner review.
