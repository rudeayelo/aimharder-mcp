# Landing page critique, iteration 1

Date: 10 November 2026. Tracking: [#95](https://github.com/rudeayelo/aimharder-mcp/issues/95).

Independent [Impeccable](https://impeccable.style) critique of the iteration-1 landing page, English desktop only, Light frame `6:77` and Dark frame `6:346` in the [iteration-1 Figma file](https://www.figma.com/design/9jDoWpeUEGTbtMoENvbzAB) (read-only since the [Figma decision](../adr/2026-11-24-figma-design-source-of-truth.md)). Score 14/20 over the applicable Nielsen heuristics (1, 3, 5, 7 and 9 not applicable to static frames); no P0 or P1 issues. The record below is preserved as produced, from `.impeccable/critique/2026-11-10T18-20-30Z__www-figma-com-design-9jdowpeuegtbtmoenvbzab.md` at tag [`archive/95-iteration-1`](https://github.com/rudeayelo/aimharder-mcp/tree/archive/95-iteration-1). Its recommendations are proposals; the general recommendations adopted for the redesign are in [Product experience](../product-experience.md#landing-recommendations-from-the-iteration-1-critique).

## Critique

Independent Impeccable critique of the selected AIHarder English desktop Figma landing frames, Light 6:77 and Dark 6:346, in file 9jDoWpeUEGTbtMoENvbzAB. Two isolated assessments were synthesized: visual design and native-layer evidence. The Persuade surface was assessed only as drawn in Figma.

The landing has a recognizable identity. The blue Kettle connects training and assistance, the typography has a clear hierarchy, and the 1200px shared content grid keeps the header and all sections aligned. The benefit headline, compatible-app strip and three setup steps form a coherent sequence. The main opportunity is clearer product communication and a more deliberate hierarchy in the middle of the page.

### Strengths

- The Kettle is product-specific and gives AIHarder a memorable visual asset.
- The 56px headline, 40px section titles and shared grid establish a coherent composition in both themes.
- Benefit, examples, setup, FAQ and closing action form a readable progression. FAQ and support give the reader a clear place to resolve concerns.

### Priority issues

1. [P2] Explain the connector relationship directly in the hero. The benefit headline and the paragraph describe training tasks, while the visitor must combine Works with and the later setup steps to understand that AIHarder connects AimHarder to an existing AI chat. Keep the selected headline and make the supporting sentence explicit. A candidate is “Connect AimHarder to your AI chat. Book classes, check workouts and review your records.” This is proposed copy. Suggested command: impeccable clarify.
2. [P2] Shorten the hero demonstration and make the promised action concrete. “When is my next booking?” receives a next class, another booking and an invitation to ask about workouts. Keep the next booking as the main result and remove the unrelated paragraph. Another example can demonstrate booking a class, so Book classes is evidenced by a visible request and result. Suggested command: impeccable distill.
3. [P2] Give the question wall a clearer information role. Its 568.5px height slightly exceeds the 535px hero, while its fully highlighted question repeats the hero. Most other questions have 0.28 opacity. Preserve the selected opposing ticker directions, large type and fading edges, but make a workout or record question readable at the center. Let the active category and emphasized question visibly agree. Consider a shorter section or fewer simultaneous rows. Static Figma does not establish ticker speed or motion comfort. Suggested command: impeccable layout.
4. [P2] Fix the active topic contrast in Dark. White 11px text on #47a3f6 measures 2.68:1. Use the darker primary-action blue under the white label, preserving the selected white-on-blue rule. Light inactive labels measure 3.23:1, so their informative role warrants an optical legibility pass. The decorative faded question text is intentional and is not classified as a broken control. Suggested command: impeccable colorize.
5. [P3] Strengthen the setup instructions relative to the illustrations. The three 320px light panels become the brightest region in Dark. Their explanatory headings and 15px descriptions receive less attention. Strengthen the step names, simplify miniature detail and soften the exterior frames or shadows while preserving authentic provider interfaces. Suggested command: impeccable typeset.

### Nielsen assessment, 0–4 per applicable heuristic

| Heuristic | Score | Evidence |
| --- | --- | --- |
| Status visibility | n/a | Runtime state changes cannot be assessed in the selected static frames. |
| Match to real world | 3 | Training language is concrete; the connector relationship is inferred. |
| Control and freedom | n/a | No executable flow is assessed. |
| Consistency | 3 | Coherent grid and components; the active Dark topic has a contrast exception. |
| Error prevention | n/a | No working form is assessed. |
| Recognition over recall | 3 | Clear action and steps; category emphasis needs clarification. |
| Flexibility and efficiency | n/a | Not applicable as app accelerators on this landing. |
| Aesthetics and minimalism | 2 | Strong identity; the wall and long answer compete with useful information. |
| Error recovery | n/a | No visible error state in scope. |
| Help and documentation | 3 | FAQ and contact are visible and relevant. |
| Applicable total | 14/20 | Visual judgment, not a runtime acceptance score. |

Cognitive load is low at decision points: one principal action and three categories. Five compatible-app marks are grouped information, not five decisions. The main cost is perceptual, in the long answer and mostly faded question wall. The hero is the emotional high point; the wall adds breadth with limited certainty; the three steps recover practical clarity. The closing action maintains continuity.

### Persona risks

- First-time visitor: may recognize the benefit before understanding where AIHarder is used. Clarify the relationship with the existing AI chat.
- Low-vision reader: the small active topic in Dark is the concrete color problem. Faded decorative examples should not contain the only explanation of a capability.
- Visitor evaluating booking support: a booking lookup does not by itself demonstrate booking creation. Show one concise example of the action being promised.

### Minor observations

The logo, Kettle, blue gradients and overall architecture merit preservation. Reduce grain intensity slightly behind small setup details if it continues to compete with them. Keep the explicit owner decision that invitation-only wording belongs in FAQ. The initial whole-page Dark export incompletely displayed a CTA, question and eyes; a fresh direct hero export plus native-layer inspection confirmed all are present. These were discarded as export artifacts, not reported as design defects.

### Deterministic evidence

The Dark active topic contrast is measured from resolved solid Figma paints. Primary CTA gradients use the darker blue range in both themes. Image-composite contrast was not certified. Impeccable's DOM detector cannot assess native Figma design layers, and scanning the editor would measure unrelated chrome. The user's Figma-only scope was honored. No prototype, implementation, mobile variant or interaction behavior was inspected.

### Questions for a next iteration

1. Should the first pass prioritize hero communication, question-wall hierarchy, or both?
2. Should the wall retain four rows with stronger central emphasis, or use three rows with more readable examples?
