# ADR: scoped hosted pilot acceptance

Status: accepted by the owner on 2026-10-28 for the closeout scope of [#84](https://github.com/rudeayelo/aimharder-mcp/issues/84) and [#69](https://github.com/rudeayelo/aimharder-mcp/issues/69); whole-branch review passed at `5983bdfa0ad31a6f9efc91ae2b5517ca666c2092`; tracker closure is recorded separately at integration closeout.

## Context

The [invited-pilot decision](2026-10-15-invited-hosted-mcp-pilot.md) and [runtime candidate](2026-10-16-proposed-cloudflare-hosted-runtime.md) originally kept full acceptance open for actual client, lifecycle, provider and cost evidence. The [ledger](../hosted-pilot-acceptance.md) now records extensive bounded observations and retains earlier failed attempts and unobserved stages. The owner deferred cost/capacity validation, has only one AimHarder account available, explicitly excluded live different-upstream replacement, and instructed closure of both issues after validating real activity publication/deletion.

## Decision

Accept the owner's selected closeout scope: complete the separately confirmed real activity publication and deletion journey, retain exact uncertainty and independent read-back evidence, complete final whole-branch review, then close #84 and #69 with explicit limits. This supersedes only the earlier requirement to keep those issues open for every outstanding observation; it does not redefine their original criteria as all passed or weaken product/security requirements.

The [actual publication](../hosted-activity-publication.md#actual-remote-pilot-publication-2026-10-28) used one confirmed/accepted/matched execution with independent new-entry comparison and original preservation. The [actual deletion](../hosted-activity-deletion.md#actual-remote-pilot-deletion-2026-10-28) used one separately confirmed execution targeting only the new entry, returned **uncertain response / observed absent**, and was not retried. Independent complete requested-date read-back found the new entry absent and the entire original unchanged. Accept this bounded current-state reconciliation without claiming a confirmed deletion response, permanence or known RM-history effects. Both actions used the remote Pilot connector in Codex; they are not web ChatGPT or Hermes activity-action UI evidence.

Cost and capacity remain **deferred and unverified**. The 20-participant/EUR 10-per-month planning target is unchanged; closure does not establish feasibility. Different-upstream live replacement is **explicitly excluded from this closeout**, because only one upstream account is available; synthetic replacement tests remain separate evidence. Other unobserved client/provider/method-specific stages and historical failures remain documented as limits, not passes. Physical backup expiry, ongoing retention/cleanup health and other operational obligations are not removed by issue closure.

## Consequences

The issue tracker may close under this explicit owner acceptance after the final review, rather than remain open indefinitely or imply all original criteria were demonstrated. The ledger remains the evidence source for future operational decisions and any further validation. No product feature, authentication, role policy, confirmation rule, upstream API contract or local stdio behavior changes. Future writes still require their own exact confirmation and at-most-once execution with honest fresh read-back.

No production launch, package release, deployment, purchase or plan change is authorized by this decision. The service remains an isolated invited test environment. Applied audience/WOD TV visibility, deletion permanence and RM effects remain unverified; no further sporting mutation is authorized as implicit test cleanup.
