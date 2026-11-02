# AIHarder — FAQ section study

Date: 2026-11-02. Owner-directed continuation of #95, English desktop Light/Dark only. Add the next section after How to, titled **FAQ**, with a support-email introduction instead of a generic subtitle and expandable questions. This is one directed extension of the existing home, not another screen or set of variants.

## Reference lock

The existing AIHarder page is the primary visual source: 1200px shared content well, Geist, 40px/700 section heading, existing navy/blue and Light/Dark semantic tokens, Lucide UI icons. Reuse the retained FAQ draft's two-column 320px/80px layout and five-question inventory. The owner's support placement supersedes the older proposal to put support at the end.

Full archived Refero screen records were retrieved before implementation:

- [Family FAQ](https://refero.design/pages/5ab0d7a8-a7aa-42f9-984f-ca3491fe9d70): borrow thin row dividers, concise expandable answers and restrained question hierarchy. Exclude wallet content, orange icons, cream illustration banner, fonts and navigation.
- [Around FAQ](https://refero.design/pages/322ddce8-90c6-4ebd-b49c-2fb697f804a4): borrow support email near the heading and clear disclosure state in Dark. Exclude its section categories, typography, black palette and footer.

Keep a plain page surface after the blue How to band. Heading/contact occupy the left column; five disclosures occupy the right. No extra card wrappers, search, ticketing system, support agent or confirmation-policy pitch.

## Content and behavior

[faq-study-copy.json](faq-study-copy.json) is the current copy source. Keep the older bilingual [copy.json](copy.json) unchanged for the six frozen variants. The first answer starts open. Native HTML `details`/`summary` gives independent disclosures with mouse and keyboard behavior; multiple answers can remain open for comparison. A Lucide chevron turns with state. Visible keyboard focus and reduced-motion behavior use existing tokens. The header FAQ link targets this section.

Five topics: invitation access, client requirements, encrypted credential custody, independent disconnect controls and independent-project status. Naming is AIHarder; technical identifiers remain unchanged. Client logos and fictional demos do not prove compatibility. Client requirements remain conditional instead of promising every displayed app works. Existing custody wording preserves that the server can recover credentials to authenticate; the AI chat does not receive them.

Support introduction: “Can’t find the answer you need? Drop us a line.” Then `support@aiharder.link` as a plain `mailto:` link with no prefilled user data, body or diagnostic logs. This is the accepted design target in [product experience](../../docs/product-experience.md); inbox activation and inbound/reply validation remain separate and were not performed. Opening an email draft is not delivery verification. No email is sent by the prototype.

## Pen handoff

The retained FAQ draft roots were replaced at the same page position with `RqxLb` (Light) and `lkUyn` (Dark). Foreground text, dividers, links and icons are editable. The first answer is visible; the other four answers are preserved as disabled body layers. HTML owns disclosure interaction; Pen is a static state. Native text line-height rounding can differ slightly from the browser.

The existing header, hero, question wall and How to remain visually unchanged. Closing/footer drafts stay disabled, and the other six variants remain frozen. All 28 protected native subtrees were compared before/after and were unchanged. [Light native section](previews/faq/RqxLb.png) · [Dark native section](previews/faq/lkUyn.png).

## Verification and limits

Runtime interaction, native export, copy consistency and local-link checks are recorded in [faq-checks.json](faq-checks.json). No production backend/authentication/MCP behavior is changed, no mailbox was activated, and no production deployment is included. Existing scope/security/custody ADRs are unchanged. Owner copy/visual acceptance, locale/mobile propagation and production integration remain pending.

Two-axis review against `cc63a36...5d5b4b7`: Standards 0 findings; Spec 0 findings. JavaScript syntax, current 75 asset hashes and changed local references passed. Chrome verified mouse, Enter, space, visible focus, all-five-open state and both themes without horizontal overflow or console warnings/errors. No production test suite was run for this isolated visual prototype.

Support-icon refinement (2026-11-02): an 18px Lucide `mail` icon sits 8px before the email, centered vertically and inheriting its theme color. The icon is decorative (`aria-hidden`); the same mailto link wraps icon and address. Native Light/Dark use the matching editable Lucide icon. No behavior, scope or ADR decisions changed.

Design-domain update (2026-11-02): the owner selected `aiharder.link` for the design, with `support@aiharder.link` as the current support target. It supersedes the earlier design-domain/address choice. Earlier browser-check records retain their observed old address; the domain-refinement readback is current. This is a presentation update, not domain registration, DNS/hosting migration or mailbox activation.
