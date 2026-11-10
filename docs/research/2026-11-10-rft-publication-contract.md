# RFT publication contract and regression loop

Tracking: [issue #127](https://github.com/rudeayelo/aimharder-mcp/issues/127).

## Evidence

A bounded read of the account holder's Hermes publication attempt on 10 November 2026 found `status=rejected`, one general/block-reference/block-type error, no exercise-reference errors, and `blockIndices=[3]`. The selected block was RFT (`type=10`), with an explicitly entered round result and no entered elapsed time. No raw conversation, request, action reference, private identifier or personal result is retained here. The response exposed counts and indices only, so its exact backend error text is unavailable.

Authenticated read-only inspection of the official [AimHarder home page](https://aimharder.es/home) and its inline `saveCRW`, `validateEjers`, result controls and renderer established:

| Meaning | RFT (`type=10`) | AMRAP (`type=2`) |
| --- | --- | --- |
| Completed rounds | `reps`, from `twodReps-*`, labeled “Rondas completadas” | `res`, from `twodRes-*` |
| Repetitions in the unfinished round | `res`, from `twodRes-*`, labeled “reps última ronda” | `reps`, from `twodReps-*` |
| Entered elapsed time | `time`, from minute/second controls | Not the RFT time-result field |
| Prescribed round target | `timecap` | Not an AMRAP round-result field |

The Copy editor was opened for the same gym source without submitting it. It visibly presented separate elapsed-time and completed-round inputs. `validateEjers` requires nonempty, nonzero RFT time unless `sstipo=2`, requires the prescribed target and an entered result, and rejects completed rounds greater than the target. `saveCRW` assigns the fields above and copies active values into the selected variant branch. The published result renderer independently uses RFT `reps` for completed rounds and `res` for unfinished-round repetitions.

The checkout previously reused AMRAP mappings for RFT, reversing these two fields, and allowed a ready reference with no entered RFT time. Missing time is consistent with the observed rejection; the response does not prove that it was the only backend validation error. The inverted mapping is independently demonstrated by the official editor code. No browser publication, MCP execution, edit or deletion was performed for this investigation.

## Correction

RFT rounds now map to `reps`, additional repetitions to `res`, and elapsed seconds to `time`. Both active and selected-variant fields use that mapping; own-entry reconciliation uses it independently of raw field names. RFT completed rounds must not exceed the verified positive integer target.

Preparation lists missing elapsed time and completed rounds in `requiredBlockResults` and returns `draft` without an action reference. Requirements follow the effective selected block; deleted blocks and the editor's non-scoring RFT mode (`sstipo=2`) add no requirements. Copied results, source targets, comments and time-cap notes cannot supply achieved values. Additional repetitions remain optional. Existing EMOM requirements, AMRAP mappings, confirmation preferences, account/target checks and at-most-one dispatch remain unchanged.

## Repeatable verification

Run `pnpm test:publication` without credentials. It exercises MCP preparation, form serialization, simulated responses and own-entry reconciliation, including the existing full publication/deletion journey. CI already runs these files through `pnpm test`.

The RFT regression uses anonymized four-block sources and a final difficulty-enabled RFT. Six initial cases failed against the original checkout: missing time in either confirmation mode, missing rounds, reversed outbound/read-back fields for numeric and string type codes, and excess completed rounds. They passed after the correction. Further cases cover copied results, independent effective variants, deleted blocks, non-scoring mode and unsupported round targets. The original live rejection was not replayed.

For each future publication failure:

1. Read the existing client outcome and own calendar/detail before considering a new write. Distinguish rejected, accepted-but-conflicting and uncertain results; never replay an uncertain POST.
2. Open a matching verified gym source in the official Copy editor. Inspect controls and the currently served serializer/validator first. Preserve the original source separately from achieved values.
3. Add an anonymized MCP regression that compares outbound fields with the independently observed editor contract and checks a matching and conflicting fresh own read-back. Run it red before changing the shared client.
4. Run the focused suite and relevant root/hosted checks. Record actual results and limits in [validation](../validation.md).
5. If a real browser or MCP POST is still needed, prepare an exact source/date/variant/result/load/comment/audience preview and follow the account's publication confirmation policy. Record only allowlisted body structure and typed outcomes; never retain auth headers, full HARs or raw private responses. A duplicate test entry and its later deletion are distinct actions; deletion retains its own mandatory confirmation.

This loop automates regression checks. It does not schedule live writes, post copies of historical own entries, or establish a universal AimHarder schema. Acceptance of a corrected real RFT publication and its persisted results/audience remains unverified.
