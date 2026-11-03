# AIHarder — closing action and footer

Login continuation, 2026-11-03: all current Home Sign in actions now open the separate [Login design](login-study.md), preserving language and appearance. The old closing notice has been removed. Home/Privacy/Login are synchronized in English/Spanish desktop Light/Dark; the four mobile variants remain frozen. Earlier checkpoints below describe their original behavior.

Privacy continuation, 2026-11-03: the motion-home footer now links to the [Privacy design draft](privacy-study.md), preserving the selected theme. This supersedes the Privacy-placeholder dialog described in earlier checkpoints below. Closing Sign in remains a review notice.

Current refinement, 2026-11-03: the footer domain label has been removed and Support added beside GitHub/Privacy. The original checkpoint below records its earlier presentation; see [home polish](#home-polish--2026-11-03) for the current design.

Date: 2026-11-02. Owner-directed completion of the English desktop Light/Dark home composition under #95. Activate and refine the retained closing/footer pieces after FAQ. This completes the current page inventory; it does not approve the design or implement the production website. Other six device/locale variants remain frozen.

## Reference lock and decisions

The existing AIHarder study and retained closing/footer drafts are primary: the 1200px content well, Geist, blue Sign in treatment, exact button shadow, independent-project wording, GitHub and Privacy. Keep the selected `aiharder.link` design domain. The existing prototype's review-only notices supply the interaction boundary; no live authentication or legal policy is invented.

Full Refero screen records were retrieved before implementation:

- [Family](https://refero.design/pages/5ab0d7a8-a7aa-42f9-984f-ca3491fe9d70): borrow the separation of a closing action band from a quiet footer after FAQ. Exclude the cream palette, flowers, wallet claims and secondary contact funnel.
- [Cartesia](https://refero.design/pages/ee911f3a-5c7c-4082-8cf1-a3f533187c9b): borrow the hierarchy of final action before project navigation. Exclude multiple competing actions, multi-column sitemap, black/bright-gradient branding and illustrations.

One directed continuation, not competing variants. No new artwork or icon assets. The closing band uses the existing muted surface token, a 32px/700 heading and the existing primary button. The footer returns to the page background with a thin upper rule, domain/disclosure at left and GitHub/Privacy at right.

## Pieces and behavior

- **Closing:** “Bring your training into the conversation.” with **Sign in**. Invitation-only wording remains in FAQ rather than repeated here.
- **Footer:** `aiharder.link`; “An independent project. Not affiliated with AimHarder.”; the existing [project repository](https://github.com/rudeayelo/aimharder-mcp); **Privacy**.
- The domain is a design label, not a link promising a live site. Support remains beside the FAQ at the selected `support@aiharder.link` target; no extra footer support flow is added.
- Closing Sign in opens a review-only notice stating real access will be connected during implementation. Privacy opens the previous prototype's notice that the complete policy will be linked in the final website. Neither control authenticates, submits data or publishes a privacy policy. The existing header/hero Sign in placeholders remain unchanged.
- Native HTML `dialog` handles modal focus, Escape and restoration to the triggering control. A visible Close control also dismisses it. The notices are review scaffolding, not another product-screen design.
- The existing animation review controls and selfh.st attribution remain below the product footer, outside the product composition. Responsive stacking is defensive HTML behavior; Spanish/mobile Pen propagation remains pending.

## Pen handoff

Reused the existing roots: Light closing `L7kaAs`, footer `yZ4bJ`; Dark closing `C7OvpZ`, footer `oNuGF`. They are now enabled. Typography, domain, disclosure, action and navigation remain editable. HTML owns review interactions; native Pen is a static visual artifact. [Light closing](previews/footer/L7kaAs.png) · [Light footer](previews/footer/yZ4bJ.png) · [Dark closing](previews/footer/C7OvpZ.png) · [Dark footer](previews/footer/oNuGF.png).

All 26 protected root/section subtrees (other variants, components, header, hero, question wall, How to and FAQ) were compared before/after and unchanged. The active pages now include all completed sections. Existing previous-section checks remain historical evidence for their delivery checkpoints.

## Verification and limits

[Recorded checks](footer-checks.json) cover Light/Dark rendering, no horizontal overflow, native exports, source links, 76 unchanged asset hashes, notice text, native modal focus, Escape/Close and restored trigger focus. No new automated tests or production suite are appropriate for this throwaway visual prototype. Two-axis review against `91f4900...cfab4a5` returned Standards 0 findings and Spec 0 findings.

The actual sign-in integration, complete privacy notice, domain/hosting/mail activation, locale/device propagation and owner visual acceptance remain separate. No operational/API/security change is made; existing ADRs are unaffected.

Later owner refinement: a decorative random-emote kettle now crosses the FAQ/closing boundary. See [boundary study](footer-kettle-study.md) for responsive hiding, placement, lifecycle and the completed native synchronization and animation boundary.

## Home polish — 2026-11-03

The owner's four browser annotations and the accepted home are the reference lock for this directed adjustment; no new visual direction or assets were needed.

- One separator between the question wall and How to: remove the question wall's grey bottom border and retain the existing How to blue 1px top border, `#79a4dc` in Light and `#2d609b` in Dark, exactly matching the hero's bottom rule. The same correction applies in Pen.
- Remove the standalone `aiharder.link` footer label. Keep the independent-project disclosure; the selected design domain and support address remain unchanged.
- Add **Support** between **GitHub** and **Privacy**, using the existing 14px/500 navigation styling. HTML uses `mailto:support@aiharder.link`; the native static text records that destination in its context. This does not validate or activate the mailbox or send email.
- Reduce only the header Sign in from 142 × 48px to 112 × 40px. HTML explicitly uses 14px text and 8px/20px padding; the smaller responsive rule keeps 8px/16px padding and a 100px minimum width. Native header instances match 112 × 40px. Existing gradients, borders and shadows remain; hero/closing actions are unchanged.

English desktop Light/Dark were updated in HTML and Pen. Native screenshots and read-back verified complete layouts, 24 protected subtrees outside the edited header/question-wall/footer remained unchanged, and placeholder flags were cleared. Other six native variants remain frozen. [Updated Pen Light](previews/polish-20261103/pen/uAXkc.png) · [Updated Pen Dark](previews/polish-20261103/pen/p7u8w.png).

[Browser/native checks](home-polish-checks.json) verified 0px question bottom border, one 1px How to border with the hero's exact color, no gap at the boundary, absent footer domain, Support mailto target, compact header dimensions and no horizontal overflow in Light/Dark at 1200px and Light at the owner's 1030px width. Browser warnings/errors were absent in the inspected Dark run. Mailto destination was read without opening an email client or sending a message. [Header Light](previews/polish-20261103/header-light.jpg) · [Footer Light](previews/polish-20261103/footer-light.jpg) · [Border Light](previews/polish-20261103/border-light.jpg) · [Header Dark](previews/polish-20261103/header-dark.jpg) · [Footer Dark](previews/polish-20261103/footer-dark.jpg).

This is a reversible visual prototype refinement. No API behavior, authentication, production deployment or architectural decision changes; existing ADRs are unaffected. Actual integration, mailbox validation, locale/device propagation and owner visual acceptance remain separate.

Two-axis review of `77ea2b1...9310cfb`: Standards 0 findings; Spec 0 findings. JavaScript syntax, five changed-document link checks, whitespace checks and 76 existing asset hashes passed.
