# AIHarder — page gradient and translucent settings containers

Date: 2026-11-03. The owner requested a page-wide gradient and the public home hero answer-bubble treatment for private containers. This replaces the opaque cards and AimHarder-only gradient in the [previous layout checkpoint](private-cards-study.md). The selected private composition, global draft/save behavior, account page, avatar navigation and requested footer copy remain intact.

The owner-provided reference is the existing `hero-motion-prototype.html` `.answer` and `.bubble` styling. Preserve exact surface roles: Light fill `#f8fbff99`, Dark fill `#142b4599`; border `#a9c3e480` / `#48688b80`; 12px backdrop blur; corners `18px 18px 18px 6px`; shadow `rgba(0,0,0,0.1) 0px 4px 6px 0px`. Apply the gradient to the entire private page: Light `#e8f2ff` to `#87b8f1`, Dark `#0d1521` to `#174678`. No character, motion canvas or grain workload is added. Secondary text uses `#314861` on Light so small copy remains readable over the page gradient; Dark retains `#abbacd`.

The shared CSS applies to both Settings and Account settings, in English and Spanish. JavaScript, API/auth/security contracts and ADRs are unaffected. These remain fictional design prototypes with the previously documented fixture/persistence limitations.

[Computed-style/browser checks](private-glass-checks.json) verify page gradient endpoints, translucent fill on all three main cards, border, asymmetric corners, blur, shadow, account-page consistency, navigation and no horizontal overflow in inspected desktop Light/Dark views. No captured browser errors. No runtime tests are needed for this reversible appearance-only change; whitespace and local links are checked.

[Browser Light](previews/private-glass/settings-en-light.png) · [Browser Spanish Dark](previews/private-glass/settings-es-dark.png) · [Account Spanish Dark](previews/private-glass/account-es-dark.png).

The four current English desktop native roots are updated in place: Settings `M3U1LB` / `Vqh6E`, Account `YiXOV` / `e8dyV`. Their fills, background-blur effects, corner radii, borders and shadows mirror these roles. All 36 other existing root trees compared unchanged via the editor. Placeholder flags are cleared. Selected native Light Settings and Dark Account exports were inspected; unchanged geometry remains from the preceding checkpoint. No pixel parity or resolved structural-visitor diagnostics is claimed.

[Native Settings Light](previews/private-glass/pen/M3U1LB.png) · [Settings Dark](previews/private-glass/pen/Vqh6E.png) · [Account Light](previews/private-glass/pen/YiXOV.png) · [Account Dark](previews/private-glass/pen/e8dyV.png).

Parallel Standards and Spec review of `7fe7758...3535f3d` returned no actionable findings on either axis; native bytes were excluded. No additional runtime tests were warranted for the appearance-only diff.

Footer spelling correction, 2026-11-03: the owner corrected “proyect” to “project” in the two current private HTML pages, the Spanish translation key and all four current English desktop native frames. Earlier captures preserve the preceding checkpoint. This copy-only change does not affect ADRs or runtime behavior.
