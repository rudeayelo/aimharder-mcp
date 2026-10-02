# aimharder-mcp

## 0.4.2

### Patch Changes

- c4be615: Allow an explicitly confirmed actual kilogram load in a verified Copy repetition/load field configured for kilograms even when the original prescribed load is empty. Preserve the empty source prescription and require the same confirmation and fresh read-back as other activity results.

  Report bounded error-array counts and valid Copy-field positions for activity publication rejections without exposing upstream messages or private response data.

  Support EMOM completed rounds in the verified Copy result field and keep incomplete EMOM preparations as read-only drafts listing the missing block results. Preserve source round prescriptions.

  Materialize selected activity-variant prescriptions, scores and actual loads in active top-level payload fields, preserving unselected variant branches, so backends that persist active fields receive the chosen content.

  Reconcile observed own-activity formatting without weakening source verification: canonical integer encodings, unchanged notes text with inserted markup, exact source calorie alternatives, and removed split alternatives when the confirmed actual kilogram value still matches. Retain conflicts for changed identities, scores, loads, units and text.

## 0.4.1

### Patch Changes

- cd71a31: Accept exact split-kilogram Copy normalization, bounded nested variants, and canonical decimal-string exercise IDs when preparing activity publication. Permit explicitly confirmed actual kilograms on exercises already prescribed in kg, while keeping source alternatives and read-back checks intact.

## 0.4.0

### Minor Changes

- bf6aa07: Add confirmation-gated publication of own activity results from a verified gym workout and deletion of a verified own activity entry. Both actions show a read-only preview, recheck the exact target, attempt one write, and report a fresh account view. Document the supported inputs and the remaining live write-contract limits.

## 0.3.0

### Minor Changes

- 6a09a76: Expose validated source exercise IDs, own-account latest 1RM and progression queries, and bounded exercise-name search. Add calculated loads beside eligible current/future workout `%RM` prescriptions, including source-labeled split alternatives, while preserving original instructions and incomplete-coverage statuses.

## 0.2.0

### Minor Changes

- 2e68ea2: Add account-scoped booking creation and cancellation with read-only previews, single-use action references, separate confirmations, and fresh state checks. One standard Open Box booking and cancellation cycle was observed live at 9NBC; late credit loss and credit balances remain unverified.

## 0.1.2

### Patch Changes

- 12cbef4: Prepare reviewed Changesets version pull requests and publish npm releases through GitHub Actions with trusted publishing. Keep the consumer version pins synchronized with each release.

## 0.1.1

- Corrected consumer documentation, added the Codex guide, and kept the MCP behavior of 0.1.0. The exact npm artifact passed the live MCP registry check recorded in [validation](docs/validation.md#public-npm-and-client-checks-2026-09-24).

## 0.1.0

- First public npm release of the local, read-only AimHarder MCP server. The exact npm artifact passed the live MCP registry check recorded in [validation](docs/validation.md#public-npm-and-client-checks-2026-09-24).
