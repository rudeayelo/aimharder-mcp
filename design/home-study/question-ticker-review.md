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

## Compact topic pills

Reviewed `060a238...690cd13` on 2026-11-01 by separate reviewers.

### Standards

No actionable findings. Requested typography, icon size, transparent zero-width border and natural height are consistent. Active colors reuse the question token; unused tokens and the obsolete mobile font override are removed. English documentation distinguishes current styling and historical evidence. No lifecycle or production behavior changes.

### Spec

No actionable findings. All three topics use 11px/600 uppercase labels, 16px icons and no minimum height or visible border. Active fill matches the question, with white label/icon colors in both themes. Existing mobile padding, question-wall behavior and frozen variants remain preserved.

Compact-topic findings: Standards **0**, Spec **0**. Owner visual approval remains pending.

## Segmented topic geometry

Separate reviewers checked `bb8e0c8...aff20bc` on 2026-11-01.

### Standards

No actionable findings. The compact first/middle/last corner rules and 4px gap are consistent across widths; the mobile override is removed. Documentation separates current native exports from earlier browser captures. No unrelated behavior changes.

### Spec

No actionable findings. The first pill has 4px right corners, the middle has four 4px corners, the last has 4px left corners, and outer ends stay rounded. Gap is 4px. No unrequested scope.

Segment findings: Standards **0**, Spec **0**.

## Inner-corner rendering correction

Separate reviewers checked `3ea191d...980c98a` on 2026-11-01.

### Standards

No actionable findings. Bounded outer radii fit the desktop/narrow heights and preserve the intended inner corners. Documentation corrects the earlier computed-style verification gap and records a rendered regression check against the previous export. No new dependencies or production behavior changes.

### Spec

No actionable findings. The fix addresses the rendered symptom: 18px exterior radii fit the 36.5px desktop height, preserving 4px interior corners. Current native Light/Dark exports and raster probes confirm the visible correction. The middle pill and 4px spacing remain unchanged.

Corner-fix findings: Standards **0**, Spec **0**. Owner visual approval remains pending.

## Question size and speed

Separate reviewers checked `a19a899...a752e2d` on 2026-11-01.

### Standards

No actionable findings. Base size and four durations change consistently, preserving emphasis timing and lifecycle. Documentation accounts for reduced travel distance and distinguishes computed CSS speed from device performance.

### Spec

No actionable findings. Questions use 26px through the shared base rule, with modestly faster movement. Alternating directions, the three-second question/topic rotation and frozen variants remain unchanged.

Size/speed findings: Standards **0**, Spec **0**.

## Faster, tighter tickers

Separate reviewers checked `3a74689...909b8bd` on 2026-11-01.

### Standards

No actionable findings. Durations produce approximately 30% faster drift, and 10.5px is exactly 25% less gap. Lifecycle and emphasis timing remain unchanged. Documentation distinguishes current measurements from historical checkpoints.

### Spec

No actionable findings. The cumulative requests for faster movement and 25% smaller row gaps are implemented; native field/fade geometry is updated consistently. Row heights, alternating directions and the three-second emphasis interval remain unchanged.

Faster/tighter findings: Standards **0**, Spec **0**.
