---
"aimharder-mcp": patch
---

Fix `prepare_activity_publication` always failing with `INVALID_ACTIVITY_PREFERENCES`. AimHarder's redesigned settings page no longer contains the publication audience, so the server now reads it, and the WOD TV setting, from AimHarder's settings API. Unknown values and Aimfighter accounts still fail closed.
