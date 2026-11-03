# AIHarder — separate settings cards and account page

Date: 2026-11-03. Supersedes the single-frame layout in the [previous settings checkpoint](private-settings-study.md). The owner requested separate containers, global actions below them, a blue AimHarder card using the public hero palette, Your gym/Your gyms with a brief right-aligned default explanation, no Connected label, and account settings on a separate avatar-menu destination. The subsequent requested private-footer copy is applied literally in English: “AIHarder is an independent proyect. Not affiliated with AimHarder.” Spanish uses a natural translation.

## Reference lock

Primary reference is the existing owner-selected 640px private shell and the public hero's implemented palette: Light `#e8f2ff` to `#87b8f1`, Dark `#0d1521` to `#174678`. Preserve Geist/Krona, the existing secondary-action volume, 16px card corners, restrained borders and quiet footer. Borrow the hero's gradient colors for the AimHarder card; do not add its character, animation, canvas renderer or grain workload to settings. Existing Luma/Dropbox reference research contributes only the labeled account/action rows already reviewed. This is direct refinement of an established target, not a new visual direction.

Three standalone cards have 20px gaps. The heading sits outside the cards and global Cancel/Save changes sits beneath all three, aligned right. The AimHarder card alone carries the blue gradient. Your gym is singular with one available gym and Your gyms otherwise. The explanation “Used when you don’t specify a gym in your request.” is right aligned opposite that label for multiple choices. Light secondary text is darkened on blue for readability.

## Save boundary and navigation

The main page contains AimHarder, AI apps and Confirmations. Gym choice now participates in the same local draft as the two confirmation preferences. Changing either enables global Save/Cancel; Cancel restores both gym and preferences to the latest saved fixture snapshot. Save accepts both together in memory. Connection/disconnection actions retain their own local dialogs and remain separate from preference drafting. No new backend transaction or atomic persistence contract is implied.

The compact header regains a fictional-initial avatar button. It opens a simple navigation disclosure with Account settings, moves focus to the link, and closes on outside click or Escape; Escape restores focus. Native links preserve language, theme and review-query context, including after a theme change or upstream-state change.

`account-settings-study.html` contains only the email, Google and AIHarder-password rows, with a back link to Settings. It has no global Save/Cancel. Existing specimen dialogs continue to act independently and remain noneditable. The shared `private-home-study.js` renders the two fixed variants and `private-shell.js` owns their private navigation. This avoids a second copy of the fixture action logic.

As before, edits and saves are local to a loaded page. Navigating/reloading resets fixture state; these pages do not demonstrate production persistence or cross-page session storage. Production unsaved-change handling and save/error coordination remain implementation work. Account-change verification, provider linking/unlinking, password policy, reauthentication/session invalidation and real default-gym persistence remain the separate contracts identified in the preceding checkpoint. No backend/auth/API/ADR decision changes here.

## Verification

[Browser checks](private-cards-checks.json) verify three cards, shared actions outside the cards, exact gradient endpoints, removed Connected/account rows, gym dirty state, cancel restoration of gym plus preferences, a saved gym/preference snapshot, avatar focus/Escape behavior, actual navigation to the account page, no global save or credential inputs there, Spanish Dark without overflow and locale/theme retained on return. A stale-theme back-link discovered during inspection was corrected by refreshing private links after the shared appearance handler. Final read-back verifies Dark in both URL and rendered destination. No captured browser errors remained.

[Settings EN Light](previews/private-cards/settings-en-light.png) · [Settings ES Dark with menu](previews/private-cards/settings-es-dark-menu.png) · [Account EN Light](previews/private-cards/account-en-light.png) · [Account ES Dark](previews/private-cards/account-es-dark.png).

## Native artifact

The two English desktop Settings roots are updated in place: `M3U1LB` and `Vqh6E`, 1440×1300 at y=21600. Two English desktop Account settings roots are added beside them: `YiXOV` (Light) and `e8dyV` (Dark), 1440×1000. They reuse the compact shell, identity, existing account rows and primary-action component. All 36 other existing root trees compare unchanged through the editor. Placeholder flags are cleared; all four exports were visually inspected. Native frames show the closed avatar state; HTML owns its opening/focus/navigation and local save interaction.

[Native Settings Light](previews/private-cards/pen/M3U1LB.png) · [Settings Dark](previews/private-cards/pen/Vqh6E.png) · [Account Light](previews/private-cards/pen/YiXOV.png) · [Account Dark](previews/private-cards/pen/e8dyV.png).

Existing nested-bounds diagnostics are not claimed resolved, and pixel parity is not claimed. Spanish is supported in HTML during this targeted refinement; public/auth/mobile and historical B native frames are untouched. Syntax, translation JSON, whitespace and local links/assets are checked. Runtime/backend suites are not applicable to these static changes. No live account, credentials, grant, email or sporting data is accessed or changed; no deployment occurs.

## Review outcome

Parallel Standards and Spec review of `c830c20...bf64a04` returned no actionable findings on either axis. The review excluded native document bytes; editor comparisons and inspected exports cover that artifact separately. The supplied footer spelling is intentional, and fixture navigation resets remain an explicit prototype limitation. No runtime/security ADR or backend validation claim is added by this design checkpoint.
