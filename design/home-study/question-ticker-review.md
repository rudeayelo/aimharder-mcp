# Question ticker review

Date: 2026-11-01. Fixed point `17c323b21657f61e3983a7bf055092b7166cf26c`; reviewed commit `ec0a12d`. Separate reviewers inspected the scoped artifacts without filesystem access to `.pen` contents.

## Standards

No actionable Standards violations or material heuristic findings. The ticker keeps one interval, clears it before rescheduling, pauses for hidden pages and shares the existing Pause/Replay controls. Still/reduced-motion paths suppress drift and timed emphasis; duplicate rows are hidden from assistive technology. Recorded activity and 1RM wording respects domain semantics. English documentation distinguishes static Pen state, HTML animation and unobserved acceptance. Asset hashes match.

## Spec

No actionable findings. The delta implements blue emphasis on “less on tapping,” transparent face cutouts in both header marks, and white silhouette/eyes in Dark. Reviewed native exports show the exact centered title, icon topic pills, four fading ticker rows and one matching featured question/topic pair. The runtime source uses 3000ms rotation, alternating drift, shared Pause/Replay and hidden-tab suspension. Decorative examples introduce no fake clickable controls. Static Pen versus HTML animation and the six frozen variants remain distinguished. No unrequested scope identified.

Final findings: Standards **0**, Spec **0**. Owner visual approval, actual OS preference changes and device/performance acceptance remain pending.

## Text-wall refinement

Reviewed `aa48aed...09c3802` on 2026-11-01 with separate Standards and Spec reviewers.

### Standards

No actionable documented violations or material heuristic findings. The revision removes obsolete fixed widths and question-pill styling consistently, preserves alternating motion and pause/still behavior, and waits for fonts before measuring. Documentation distinguishes the current text wall from the historical pill treatment, static native state and browser evidence. Hashes match.

### Spec

No actionable findings. Questions are now unboxed at 32px, while topic pills remain. Four alternating rows, fading edges and timed topic/question emphasis are preserved. The larger-phrase selection rule maintains rotation. Native Light/Dark exports match the owner’s text-wall request, with no additional screens or services and unchanged protected-root fingerprints.

Text-wall findings: Standards **0**, Spec **0**. Owner visual approval remains pending.
