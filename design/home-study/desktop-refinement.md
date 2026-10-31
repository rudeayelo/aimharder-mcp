# AIHarder — desktop refinement

Date: 2026-10-31. Owner-directed revision under #95.

## Scope

The active working product name is **AIHarder**, without CONNECT. This supersedes AimHarder Connect for the consumer design. The technical package/repository identifiers remain unchanged. The wordmark retains Krona One, blue AI and the neutral kettle to the left, following the earlier standalone composition.

Only the **English desktop Light (`uAXkc`) and Dark (`p7u8w`) home frames** were refined. The other six home frames, previous state boards, original wordmark component and original shared controls were compared against commit `5a57cbc` and remain byte-for-byte equivalent as parsed design objects. They intentionally retain the earlier checkpoint until the owner agrees to propagate the design. The HTML prototype also remains the earlier checkpoint.

New component `GqxcO` serves only the two active wordmark instances. No global component was renamed or restyled. New board `kUGfy` compares two button treatments; it is a specimen board, not another product screen.

## Home changes

- Three header groups: left-aligned brand, centered How it works / FAQ, right-aligned language/theme and Sign in. Existing 120px content gutters remain.
- Exact owner-supplied introduction: **Book classes, see your workouts and review the activity in your AimHarder account.**
- The separate app strip moved into the hero copy, below the actions. It now reads **Works with**, with compact monochrome symbols and names. There is no separate band or divider.
- Hermes uses the original black-and-white portrait from the [official Hermes website](https://hermes-agent.nousresearch.com/), downloaded from its [icon asset](https://web-assets.nousresearch.com/marketing/73edac8eae57c8914e23605b9f0a7015d9d3fd26/assets/hermes-agent/icon.png). The earlier wing was also a site asset, but is superseded in these two views at the owner's request. The portrait also replaces Hermes in their setup-step illustration.
- OpenClaw and Pi have monochrome hero derivatives; their original paths are preserved. Original colored setup symbols remain. The portrait is already monochrome and is copied without editing.

## Button references and proposals

Research used two Refero searches, then full archived style records for Linear Changelog, Shuttle and Sleeve. Sleeve's depth is primarily attached to media/window surfaces, so its gradients and large shadows were not borrowed for buttons.

The existing shadcn-derived page structure remains the primary foundation. The references below contribute only bounded button details; their fonts, palettes, pill radii, dark canvas and media styling are not imported.

| Reference | Borrowed role | Explicit exclusions |
| --- | --- | --- |
| [Linear Changelog](https://linear.app/changelog), Refero `11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6` | Its filled-button elevation combines inset highlights, a fine border and a short shadow. | No monochrome rebrand, pill geometry, global glow or dark-only layout. |
| [Shuttle](https://shuttle.zip/about), Refero `6285d741-d05c-4a28-aa86-6ca900dde2f8` | A restrained blue primary action, 8px radius and shallow button elevation. | Its large card shadow stays a card treatment; it is not used on the CTA. |

These are archived reference descriptions, not a claim that the current websites have identical buttons.

| Proposal | Treatment | Review status |
| --- | --- | --- |
| **A / Soft bevel** | Gentle vertical blue gradient, 1px border, inner top highlight and a 2px / 4px soft shadow. | Selected by the owner on 2026-10-31; retained on both active homes. |
| **B / Raised edge** | Solid blue, 1px border, inner highlight, small 3px lower edge and a short ambient shadow. Pressed reduces the edge to 1px. | Not selected; retained in the specimen board as a historical comparison. |

The gradient and lower edge are project proposals responding to the owner's brief. Both preserve 48px targets and 8px corners. Light uses white labels; Dark uses navy labels. Normal, hover and pressed are static specimens. Option A is selected for the active desktop design. Other locale/device frames still await propagation; production interaction behavior is not implemented.

## Verification and delivery

- Exported and visually inspected the two home candidates, header, hero and the button comparison. No visible clipping or overlap was observed.
- The pen bounds visitor reports clipping warnings whose reported bounds differ from the rendered positions for the new wordmark reference/header groups and comparison board despite complete rendered exports. This is not a clean structural visitor pass; do not substitute the earlier ten-frame clean result for this revision's diagnostics. The exported header has the intended three-column alignment. Recheck these editor diagnostics before wider propagation.
- Checked all asset hashes, local links, preservation of protected roots and button-label contrast over every gradient endpoint/state. No production source, package dependency or lockfile changed. This is visual design work, so MCP runtime tests were not run.
- [Light home](previews/uAXkc.png), [Dark home](previews/p7u8w.png), [button comparison](previews/kUGfy.png), [header](previews/Py7nJ.png), [hero](previews/o4sdvx.png).

No scope, authentication, security, distribution or validation-policy decision changed; existing ADRs remain applicable. Name/composition refinement and candidate button styling do not require an architectural ADR. Remaining work is owner selection, editor-diagnostic follow-up and propagation to the other variants only after agreement.

The [verification record](desktop-refinement-checks.json) lists protected roots and the 12 button-label contrast checks.

## Latest polish — 2026-10-31

- Enlarged the AIHarder wordmark by a further 25%: Krona One 17.5 → 21.875px, kettle 35 × 40 → 43.75 × 50px, gap 8 → 10px. The header is now 120px high to accommodate it. Pre-existing local Light-header width adjustments were preserved.
- The headline is provisionally **Your training. / Just ask.**, Geist 700 (bold), retaining 56px size. It is a copy candidate, not a final owner selection. Alternatives for review: **Less tapping. / More training.** and **From your gym / to your AI chat.** No extra home variants were created for these copy options.
- Works with symbols and product labels use 65% opacity as a group, making the row subordinate to the primary action. Its label remains unchanged.
- Recorded A / Soft bevel as the selected button finish; no new button styling was introduced.
- Refreshed only the two active English desktop exports, their header/hero details and the selection note on the existing button board. Verified the rest of the saved canvas against the pre-edit snapshot. The header and hero exports were visually inspected; the existing bounds-visitor limitation remains documented above. API, scope, security and ADRs are unaffected.
