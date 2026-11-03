# AIHarder — Privacy page study

Current continuation, 2026-11-03: Spanish desktop is now authorized and synchronized, with `privacy-copy.es.json` and two additional native pages. The public header's Sign in now opens the separate [Login design](login-study.md); its old review-only sign-in dialog is removed. Language and appearance are retained across Home, Privacy and Login. Earlier checkpoints below retain their original delivery-time scope.

Date: 2026-11-03. Owner-directed continuation of #95: add a lower blue border to How to, then design Privacy. Login and private pages are subsequent work. Active scope remains English desktop Light/Dark; other native variants stay frozen.

## Reference lock before implementation

Build target: the accepted AIHarder home, its Geist/Krona typography, navy/blue palette, 1200px well, compact header action and quiet disclosure footer. Preserve these signatures. This is a direct continuation of an established system, not a new visual direction.

Full Refero records reviewed:

- [Dub Privacy](https://refero.design/pages/4b38e08b-ed01-4631-bde0-ab63bab89844): borrow a narrow reading column and anchored contents for long text; reject its right sidebar, tables of legal definitions and large sitemap.
- [Airtable Privacy](https://refero.design/pages/5fb160df-d976-42cf-8150-0d1ab607f6ca): borrow left contents aligned beside the document and clear section hierarchy; reject its typography, multi-column footer and dense legal copy.
- [Linear Changelog style](https://linear.app/changelog), Refero style `11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6`: borrow restrained dark reading surfaces and type hierarchy; reject its monochrome brand, pills and product graphics.
- [Expo style](https://expo.dev), Refero style `87dac905-fe95-414e-bca7-3698dcd1e0a8`: borrow blue only for links/active navigation and flat document surfaces; retain AIHarder fonts, buttons and palette.

| Decision | Source and role | Reason |
| --- | --- | --- |
| Existing header, flat mark and footer | Accepted AIHarder home | Maintain one brand and a clear way home. |
| Left sticky contents and readable article | Airtable hierarchy + Dub reading pattern | Make the notice easy to scan and navigate. |
| One pale-blue credential summary | AIHarder blue surface and documented custody boundary | Highlight the most material distinction without legal marketing claims. |
| Plain text sections, no mascot/animation | Content-first references | Reading is the purpose; no new artwork is required. |
| Draft copy, separate review note | Missing approved legal text/controller/retention details | Do not present a design draft as a published legal policy. |

Token commitments: existing Light/Dark colors, Geist body 17px/1.65, 56px/700 title, 26px/600 section headings, 14px contents, 760px maximum reading width, 64px column gap, existing 112 × 40px header action. No new photography, generated artwork or icon family. Lucide only where icons are needed.

## Copy boundary

The page is a draft of a privacy notice, not an approved or published legal policy. Repository facts are the source: [hosted identity/custody](../../docs/adr/2026-10-15-hosted-identity-and-credential-custody.md), [account connection](../../docs/hosted-aimharder-connection.md), [MCP authorization](../../docs/hosted-mcp-authorization.md) and [account deletion](../../docs/hosted-account-deletion.md). The single English content source is [privacy-copy.json](privacy-copy.json), shared by HTML and the native design build. No effective date, named controller, jurisdiction, legal basis or exact backup-expiry claim is invented. These details, provider/transfer disclosures and final retention wording require owner/legal review before a public policy can be published. Operational support-domain migration and inbox validation remain outside this design.

The credentials are recoverably encrypted for service authentication, not end-to-end encrypted. Connected AI apps receive requested results and handle their own conversation retention. Disconnecting an app, disconnecting AimHarder and deleting the service account are separate. Service-account deletion does not delete AimHarder data or conversations held by AI providers. Current active-data deletion evidence does not establish physical backup expiry.


## Implementation and review

[Privacy prototype](privacy-study.html?theme=light) uses the accepted home shell, seven anchored sections and a single 760px reading column. The contents stay visible while scrolling, track the current section and become a compact grid on narrow screens. The icon control cycles Light → Dark → System; query parameters retain the preference through reloads, self-links and Home/FAQ/How to navigation. Browser preference changes are followed in System mode. At the initial Privacy-only checkpoint the language label and Sign in were specimens. The subsequent bilingual/login continuation now provides a real language selector and Login link; private pages remain deferred.

The motion-home footer Privacy control is now a real link to the draft, replacing its old policy-placeholder dialog. The closing Sign in notice is unchanged. Earlier `home-prototype.html` retains its historical notice behavior. The How to section now has one blue 1px rule at each edge: `#79a4dc` in Light, `#2d609b` in Dark. No adjacent question-wall border was reintroduced.

Editable native pages: `U3l0MJ` (Light) and `g8DEOq` (Dark), 1440 × 2324px, below the existing home studies. Header and footer were copied from the accepted two desktop pages, with the appropriate appearance icon and current Privacy link. Title, summary, contents and all seven sections are editable native text and match the single copy source. [Native Light](previews/privacy/pen/U3l0MJ.png) · [Native Dark](previews/privacy/pen/g8DEOq.png). Twenty-six existing protected subtrees remain identical; only the two home-footer Privacy destination contexts changed within the twenty-eight compared. The How to stroke update was tracked separately. All six other native variants remain frozen.

[Recorded checks](privacy-checks.json) cover actual home-to-Privacy navigation, seven sections, sticky/active contents, cold fragment navigation, contact target, Light/Dark/System cycling and query retention, no horizontal overflow at 1200/1030/390px, and the review-only Sign in notice with Escape/returned focus. [Browser Light](previews/privacy/browser-light.jpg) · [Browser Dark](previews/privacy/browser-dark.jpg). Inspection found no browser warnings/errors.

Native screenshots show the complete composition, but the bounds visitor reports 27 nested clipping warnings in each page. Its nested coordinates include offsets inconsistent with the rendered auto layout. An origin-normalization attempt left these diagnostics unchanged; ignored x/y properties were removed afterward. Do not describe this as a clean structural-visitor pass or pixel-identical browser/native output. The final exports remain visually complete and the browser has no overflow. Recheck these editor diagnostics before production reuse.

This delivery changes design artifacts only. The content does not supersede accepted custody, authorization or deletion ADRs, and it does not claim new operational retention or mailbox evidence. Existing ADRs/API contracts are unaffected. Legal copy approval, controller/contact identification, processing bases, provider/transfer and retention disclosures, production integration, locale/device propagation and owner visual acceptance remain separate. Login/private pages are the next requested design stage, not part of this delivery.

Review correction: the first Spec pass found that Home treated `theme=system` as Light. Home now resolves System through the browser preference before mounting themed assets and reloads if that preference changes. An actual Privacy → Home → Privacy round trip retained `theme=system` and the current dark OS palette; the Home lower How to rule also matched Dark. The initial Spec finding remains recorded as resolved, not omitted.

Final review: Standards 0 findings on the initial delivery and correction. Spec initially reported one System-return mismatch; after `5c28061`, no actionable findings remain. JavaScript syntax, changed-document/local-resource links, checks JSON and all 76 existing asset hashes passed. These checks do not approve legal copy or clear the native visitor diagnostics.


## Index and title refinement — 2026-11-03

Removed the Home/Privacy breadcrumb in HTML and both native Privacy pages. The brand still provides a route home. The reported index jump was reproduced at 1030px: the same label grew from 33px at weight 400 to 54px at weight 600, while its left border remained 2px in both states. Removed the active font-weight override, keeping all labels at normal weight (400); only text and border color change. The existing transparent 2px inactive border remains reserved. Native contents use normal weight throughout as well.

Actual anchor navigation across all seven sections in each theme at 1030px retained identical item dimensions/relative positions in every active state. [Refinement checks](privacy-refinement-checks.json) retain the failing measurements and passing geometry. [Updated browser](previews/privacy-refinement/browser-light.jpg) · [Native Light](previews/privacy-refinement/pen/U3l0MJ.png) · [Native Dark](previews/privacy-refinement/pen/g8DEOq.png). Existing home/other-device variants and shared components remain unchanged. The prior native nested-bounds diagnostics and legal-draft limitations remain; no API or ADR decision changes.
