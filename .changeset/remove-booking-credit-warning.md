---
"aimharder-mcp": minor
---

Remove booking-creation credit-use warnings so clients request one confirmation of the exact gym, class and local date/time. The `credit` field is removed from `prepare_booking_creation` and `execute_booking_creation` outputs and schemas. Cancellation credit-loss warnings and confirmation requirements remain in effect.
