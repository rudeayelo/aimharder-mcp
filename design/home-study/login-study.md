# AIHarder — login and public-language continuation

Date: 2026-11-03. After the Privacy refinements, the owner requested the login page and explicitly asked for current Pen and Spanish versions. This supersedes the earlier English-only desktop freeze: update English/Spanish desktop Light/Dark for Home, Privacy and Login. Keep the four existing mobile variants unchanged. Private account screens remain subsequent work.

## Reference lock and decisions

Primary target: the accepted AIHarder public shell, Geist/Krona, navy and blue, 112 × 40px header action, selected button gradient/border/shadow and independent-project footer. Login is a focused 400px centered form without a surrounding card or new mascot illustration. The owner subsequently requested a distinct authentication shell: no public header/logo/navigation, a flat canvas, discreet language/appearance controls, and a quiet text-only footer with the independent-project disclosure, Support and Privacy. There is no GitHub link, footer rule or public-site CTA. No WebGL is used.

Full Refero sources reviewed before implementation:

- [Pop Site sign-in](https://refero.design/pages/6042bc33-dd50-451c-a52a-e9c4ce6e29e9): borrow explicit email/password labels and a clear recovery path; reject emoji, open sign-up and its black button treatment.
- [Acctual sign-in](https://refero.design/pages/d054dd7a-770d-456d-9da2-c5948dd5fc20): borrow a prominent Google alternative above the form and a narrow single column; reject floating financial graphics, unsupported business claims and its palette.
- [Linear sign-in flow](https://refero.design/flows/6690): borrow the public-site-to-sign-in journey and clear return route; reject magic links, passkeys, SAML and workspace screens because those are not the accepted account contract.
- The previously reviewed Expo and Linear style references in [Privacy](privacy-study.md) support restrained surfaces, reading hierarchy and functional accent roles. Existing AIHarder tokens override external brand rules.

| Decision | Source and boundary | Reason |
| --- | --- | --- |
| Google plus email/password | `hosted/src/portal.ts`, `hosted/src/auth.ts` | Reflect the actual supported methods; no new identity method. |
| Explicit AIHarder password helper | Hosted custody/identity distinction | Prevent confusion with the later AimHarder connection. |
| Forgot password and verification resend | Existing `/recover` and `/resend-verification` entry points | Preserve recovery affordances without designing those pages yet. |
| No open sign-up or invitation banner | Existing invited admission + owner's home copy direction | Do not introduce open enrollment or repeat pilot copy. |
| Separate authentication shell | Owner correction | Remove the complete public header; retain only discreet language/theme settings and a small text footer. |
| Real language selector and preserved appearance | Owner's explicit bilingual requirement | Keep language/theme through all three public design routes. |

The form is a design prototype: local required/email validation, disabled/loading preview, generic failure specimen and a clear no-request result. It never submits credentials, authenticates, contacts Google, sends recovery/verification mail or opens a private account. Field values are not put in URLs, storage, logs or artifacts. Other auth destinations remain explanatory prototype notices. No operational auth/security policy changes.

## Language boundary

Spanish desktop Home, Privacy and Login are authorized in this continuation. English and Spanish UI use `lang=en|es`, with a simple text language selector and no flags. `public-copy.es.json` localizes shared/home UI and fictional animations; `privacy-copy.es.json` translates the same draft notice and retains all seven section IDs. Brand/service names and technical identifiers stay unchanged. Project documentation stays English.


## Current Pen matrix

| Page | English Light / Dark | Spanish Light / Dark |
| --- | --- | --- |
| Home | `uAXkc` / `p7u8w` | `uzAUz` / `Qg3nb` |
| Privacy | `U3l0MJ` / `g8DEOq` | `dlTr0` / `vGnGn` |
| Login | `kHs1c` / `B3kekr` | `FLliZ` / `TDh9Q` |

All are 1440px wide. Home is 2770.5px high, Privacy is 2280px in English / 2420px in Spanish, and Login is 900px. The Spanish home roots were updated in place by copying the accepted current sections and localizing editable text/instance overrides; no old mobile page was replaced. Native appearance icons match each explicit theme. The 14 frozen mobile/component/history subtrees were unchanged, and no known untranslated UI copy remained in the six Spanish pages after instance expansion. All root placeholder flags were cleared. [Pen exports](previews/public-bilingual/pen/uzAUz.png) include the complete current matrix in that directory; [Login EN Dark](previews/public-bilingual/pen/B3kekr.png) · [Login ES Dark](previews/public-bilingual/pen/TDh9Q.png) · [Privacy ES](previews/public-bilingual/pen/dlTr0.png). Native text-field drawings remain static design layers, not functioning auth controls.

## HTML behavior and verification

[Login EN](login-study.html?lang=en&theme=dark) and [Login ES](login-study.html?lang=es&theme=dark) share the focused shell. Header/hero/closing Sign in actions in the current Home and the Privacy header all navigate to Login with locale/theme preserved. The login footer contains only the disclosure and Support/Privacy links; there is no header, GitHub link or footer border. Discreet language/theme settings are independent of public navigation.

`public-copy.js` and `public-navigation.js` supply local copy and public-route settings. Home fictional questions, typed hero replies, animated How to conversations and button phases, FAQ, accessibility text, review controls and footer are localized before animation consumes them. The 6% smaller Spanish hero accent line accommodates the longer phrase while retaining the accepted hierarchy. The localized Privacy content keeps the same seven anchor IDs and normal-weight index geometry. No actual upstream data is involved. Components that depend on asynchronously created How to/footer DOM import that owner module using the same versioned URL as HTML, preventing duplicate mounting or an early null-stage read.

[Browser checks](login-checks.json) record actual language switching, EN/ES layouts, the Home → Privacy → Login journey, System retention through Login → Privacy → Home, and Spanish Home at 1030px without overflow. Login was checked at 1200px, 1030px and 390px (400/400/350px form widths), with no overflow. Narrow HTML checks are defensive; no mobile Pen design was propagated. Source-only claims about no auth submission are distinguished from browser observations: validation focuses missing fields, loading disables the form, the preview result clears the password, Google opens a no-request notice and Escape returns focus. Generic error and reset specimens were checked in Spanish. No real account or managed credential was used; a password-manager prompt intercepted the first synthetic paste, was canceled, and the successful repeat used keyboard input.

A browser console check caught an introduced translation-helper/timeline-name collision in the hero (`t` was numeric inside the frame callback). The import is now aliased to `translate`; a fresh Spanish run advances through typed answers and repeats the cycle, and English is checked separately. Initial console errors remain recorded as an initial failure alongside fresh post-fix observations. The footer character and How to background each mount once; Spanish random footer emotes were observed. Existing image/font/model files were not changed.

[Browser EN Dark](previews/login/en-dark.jpg) · [EN Light](previews/login/en-light.jpg) · [ES Dark](previews/login/es-dark.jpg) · [ES Light](previews/login/es-light.jpg) · [Home ES](previews/spanish-public/home-es-light.jpg) · [Privacy ES](previews/spanish-public/privacy-es-light.jpg).

## Review correction: fail-closed form readiness

The standards review found an unsafe native fallback: the initial HTML had enabled, named email/password fields and default GET submission before the asynchronous module installed its handler. The HTML now starts with both inputs and submit disabled, has no credential field names, and shows a loading status. Only the final statement after handler installation enables the form. A failed script or Spanish-copy fetch leaves it disabled. This enforces the existing no-request prototype boundary; it does not change production authentication.

A browser probe compared temporary scriptless copies before/after: enabled named fields changed from `email,password` to none, and all three controls changed from enabled to disabled. No field values or native submissions were used. The browser read-only scope did not expose a usable FormData constructor, so the probe inspected the DOM-backed enabled named controls instead. The fixtures were removed after verification. Normal English/Spanish initialization re-enables all controls, clears the loading message, and Spanish empty-submit validation still focuses email. Evidence is in `nativeSubmissionSafety` in [checks](login-checks.json). The original finding remains documented rather than retroactively described as a pass.

## Limits and next work

This is a throwaway design prototype, not production authentication or an account implementation. No API contract, custody, access, retention, Google configuration, email provider or deployment changed; existing ADRs are unaffected. Login/translation checks do not prove real provider interoperability, credential validation, recovery email delivery or private-page authorization. Recovery/verification pages and private screens remain subsequent design work. Privacy copy still needs owner/legal review before publication. Earlier unresolved nested Privacy bounds-visitor warnings remain; complete native renders/content audits are not a clean structural-visitor or pixel-identical browser/native claim. Do not repeat those diagnostics as a new pass. Source syntax, local links and existing asset hashes are verified separately from owner visual acceptance.
