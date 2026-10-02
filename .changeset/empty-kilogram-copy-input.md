---
"aimharder-mcp": patch
---

Allow an explicitly confirmed actual kilogram load in a verified Copy repetition/load field configured for kilograms even when the original prescribed load is empty. Preserve the empty source prescription and require the same confirmation and fresh read-back as other activity results.

Report bounded error-array counts and valid Copy-field positions for activity publication rejections without exposing upstream messages or private response data.

Support EMOM completed rounds in the verified Copy result field and keep incomplete EMOM preparations as read-only drafts listing the missing block results. Preserve source round prescriptions.

Materialize selected activity-variant prescriptions, scores and actual loads in active top-level payload fields, preserving unselected variant branches, so backends that persist active fields receive the chosen content.

Reconcile observed own-activity formatting without weakening source verification: canonical integer encodings, unchanged notes text with inserted markup, exact source calorie alternatives, and removed split alternatives when the confirmed actual kilogram value still matches. Retain conflicts for changed identities, scores, loads, units and text.
