# AIHarder — question ticker study

Date: 2026-11-01. Current English desktop Light/Dark refinement under #95.

## Owner brief and reference lock

The owner asked for blue emphasis on “less on tapping”, a transparent face cutout in both flat header marks, a white negative mark in Dark, and a centered section titled **Your classes, workouts and records, one question away**. Topic pills and multiple questions should look inactive, with one question and its topic emphasized every three seconds. Four horizontal rows drift in alternating directions and fade at the edges.

The existing AIHarder composition remains the dominant visual source: Krona One branding, Geist typography, navy/blue palette, compact header/hero, 120px gutters at 1440px and the selected button A. Two Refero style records were retrieved before implementation:

| Reference | Bounded contribution | Excluded |
| --- | --- | --- |
| [Dock](https://dock.us), style `a30dfeb9-9330-4e29-9477-76476481ef09` | Its product tab bar distinguishes the selected category with a soft surface and stronger text; retain centered section spacing. | Roobert, global pill CTAs, proprietary colors, product screenshots and card grids. |
| [Reworkd](https://www.reworkd.ai), style `ecdf390e-47c3-4560-a35f-2e160bfb64f6` | Small rounded category tags, restrained neutral inactive states and blue emphasis on a spacious canvas. | Suisse typography, screenshot framing, data-grid graphics and a new gradient section. |

These are archived Refero style descriptions, not current-site behavior claims. Refero's section-search endpoint was unavailable; the two full style records, existing project design and the owner's explicit ticker composition provide the reference lock. The marquee and three-second timing come from the owner, not an inferred reference behavior.

## Decisions and implementation

- The hero keeps its three-line 56px bold headline. The final line uses `#1476cc` in Light and `#47a3f6` in Dark. Light uses the deeper blue to retain legibility over the pale blue hero background.
- The existing traced silhouette has a genuine transparent circular cutout. Light silhouette/eyes are navy; Dark silhouette/eyes are pure white, without the former navy fill or light keyline. The handle hole remains transparent. Existing SVGs and their faithful Pen PNG derivatives were updated together; the [vector exporter](render-flat-mark.html) uses the same construction.
- The following section centers its heading, topic row and question field. At 1440px the native section is 586px high: 72px vertical padding, 92px title, 24px title/topic gap, 44px topics, 32px before the 250px row field. HTML measures 587px including its bottom border.
- Three Lucide topics: Classes & bookings / calendar-days, Workouts & weights / dumbbell, Activity & records / activity. Twenty fictional example questions are defined once in [question-ticker-data.json](question-ticker-data.json), four rows of five, for both the prototype and native design build.
- Inactive questions use a neutral pale surface, fine border, muted text and 62% opacity. The featured question is solid blue with white text in Light, or light blue with navy text in Dark. Its topic receives a soft blue surface and stronger text/icon. No shadows, arrows or added mascot compete with the hero.
- These are timed decorative examples, not actual enabled chat buttons. They remain noninteractive lists, with no tab stops or fake submission. Duplicate marquee copies are hidden from assistive technology, and emphasis changes do not create repeated live announcements.
- Rows drift over 106/124/116/130 seconds, alternating left/right. The 96px edge masks hide the wrap. Every 3000ms the prototype chooses one fully visible question for the next topic, preferring a different row and the center. Native Pen depicts one static moment with the next-booking question and Classes & bookings featured; animation remains in HTML.
- The existing review Pause/Play and Replay controls govern both the character and question rotation. Background tabs pause timers/tracks. `motion=off`, `ticker=still` or reduced-motion preference keeps the question field still. The JavaScript includes a reduced-motion branch; an actual OS preference change remains outside this verification.

## Scope, verification and delivery

Updated only the English desktop Light `uAXkc` and Dark `p7u8w` pages and their dedicated logo component. New native section IDs are Light `ES3Gf` and Dark `lKHEL`. Fifteen protected roots, including the six frozen home variants and previous specimen/state boards, have identical before/after fingerprints. Copy for those variants was not propagated.

The document was edited through native Pen MCP, saved through the desktop app and checked for absence of its Edited indicator. Native screenshots and exports show the new headline, themed mark and question section. The bounds visitor flags the intentionally clipped ticker rows; this is required by the fading-edge composition, not a clean bounds pass. The existing hero overflow caveats remain documented in [the preceding synchronization](pen-sync.md).

Browser inspection at 1200px confirmed both themes, four rows/20 accessible originals, opposite drift directions, one featured question/topic pair and no horizontal page overflow. Four observations approximately three seconds apart changed topics Classes → Workouts → Activity → Classes, with a matching question every time. Pause stopped both movement and emphasis; Replay resumed them. The explicit motion-off URL showed no row animation. No console warnings/errors were observed in the inspected Dark session. Pixel decoding verified transparent face/handle holes and navy/white eye colors. Hashes, native node audits and observations are in [checks](question-ticker-checks.json). The [two-axis review](question-ticker-review.md) reports no actionable findings.

[Animated Light](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/hero-motion-prototype.html?theme=light&reply=long#questions) · [Animated Dark](https://mini.taild6f227.ts.net:8443/aimharder-home-95/home-study/hero-motion-prototype.html?theme=dark&reply=long#questions) · [Pen Light section](previews/ES3Gf.png) · [Pen Dark section](previews/lKHEL.png) · [Light browser capture](previews/questions-ticker-light.jpg) · [Dark browser capture](previews/questions-ticker-dark.jpg).

This is a throwaway visual prototype with fictional questions and no live account calls. Records wording refers to recorded entries/1RM, not attendance or a verified historical maximum. No production API, authentication, package dependencies, deployment, distribution or validation-policy decision changed; existing ADRs apply, so no new ADR or MCP runtime suite is needed. Owner visual approval, production motion controls/performance and propagation to the other variants remain pending.
