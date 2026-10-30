# Write confirmation preference

One preference controls all sporting writes for the configured account: booking creation, standard cancellation, late cancellation with possible credit loss, activity publication (workout results) and own-activity deletion. It does not change portal login, client OAuth consent, account deletion or other account-management forms.

Confirmations are **enabled by default**. In the hosted portal, open AimHarder connection settings, choose **Write confirmations**, then save. **Ask before each write** retains exact preview and separate confirmation. **Do not ask again** lets the agent complete an explicitly requested exact action without a second question. This is shared by all MCP clients connected to that account; another participant keeps their own preference. The JSON settings field is `requireWriteConfirmation`, a boolean. Missing updates preserve the existing value; invalid values fail. A settings save discards existing preparations, so prepare again afterwards. Password updates and account replacement retain the setting; disconnection removes connection settings and a newly connected account defaults to enabled.

For local stdio, set `AIMHARDER_REQUIRE_WRITE_CONFIRMATION=false` in the server process environment and restart to disable confirmations, or use `true`/omit it to require them. Only those literal values are accepted.

## MCP client behavior

`get_account_context` and all four preparation tools return `writeConfirmationRequired`. Fresh late-credit-loss warnings also return it. Always resolve ambiguity and use the exact prepared target; a read or preview-only request never authorizes writing.

- When true: show the full exact preview, obtain separate account-holder confirmation and execute with `confirmed: true`. For the late-cancellation tool, show possible credit loss and use `confirmedCreditLoss: true` after its separate confirmation.
- When false: execute an explicitly requested exact action with its fresh reference without asking again; omit the confirmation marker. Existing true markers remain accepted. Literal false is rejected, rather than treated as authorization.

For example, creation execution can use `{"actionReference":"<fresh reference>"}` when disabled, or `{"actionReference":"<fresh reference>","confirmed":true}` after confirmation when enabled. Deletion still requires the exact `sourceActivityId`. A missing marker under an enabled policy returns `WRITE_CONFIRMATION_REQUIRED` before reference consumption or write dispatch.

Both modes keep preparation, fresh eligibility and ownership checks, role permissions, two-minute single-use references, at-most-one upstream request per execution and honest fresh read-back. Late cancellation still requires the distinct reference issued by a fresh standard warning and never happens inside the standard request automatically. Unknown outcomes require manual inspection before any new attempt; disabling confirmation does not enable retries, batches, scheduling or inferred achieved results. Client-owned approval dialogs may still appear.

The [decision](https://github.com/rudeayelo/aimharder-mcp/blob/main/docs/adr/2026-10-30-account-write-confirmation-preference.md) amends earlier mandatory-confirmation rules. Historical live receipts still describe the policy used at their observation time. This checkout's new behavior is not evidence of a deployed update or actual client acceptance.
