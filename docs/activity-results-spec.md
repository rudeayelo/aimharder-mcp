# Record activity results: discovery

Status: feature behavior confirmed on 2026-09-28 and specified in [issue #42](https://github.com/rudeayelo/aimharder-mcp/issues/42). The publication slices #44–#47, deletion slices #48–#49, and validation slice #50 are included in npm version `0.4.0`. Issue #50 exercised one complete anonymized MCP client journey and compared a same-date own candidate with read-only source/calendar/detail views. On 2026-09-30, a different current WOD exposed split-kg Copy normalization and nested variant transport that blocked preparation in `0.4.0`; version `0.4.1` passed a read-only `ready` preview from the exact public npm artifact. The candidate from #50 cannot be linked to the account holder's supplied response ID, and effective audience remains unverified. No live activity write or deletion through this server has been authorized or validated; final parent-feature acceptance remains pending.

## Confirmed scope and decisions

- The first phase lets the authenticated account holder publish an activity and delete an existing own activity entry. Editing an existing entry is outside the first phase.
- Every publication and deletion requires separate account-holder confirmation of that specific action before it is sent to AimHarder. A request to design the feature, a sample `fetch` call, or a test plan does not authorize a live write.
- For `%RM` prescriptions, show the calculated kilogram load as an editable suggestion and record the load actually used. Preserve the original prescription and distinguish it from both the calculated suggestion and the achieved result. The Copy editor writes the actual load to `valor2` with `tipoud=0`; numeric persistence remains unverified live.
- The initial editable content is the gym-local date, block results, exercise loads, and an optional general comment. Photos, video, mentions, and schedule metadata are outside the initial editable scope. The source may require fixed or copied transport fields; those do not become user-facing editing capabilities.
- Publication starts from a workout/activity published by the selected gym and accessible to this account. Copying other members' entries, copying the account holder's past entries, and publishing from a blank form are outside the first phase.
- Deletion may target any verified own activity entry at the selected gym, including one created in AimHarder's web UI. A caller-supplied ID alone never establishes ownership.
- Warn when a reliably identified same-source, same-date own entry may already exist. A deliberate second entry is allowed only after the account holder explicitly confirms that duplicate; matching dates alone do not establish duplication.
- The published entry should have the visibility of AimHarder's web Copy flow. Show that visibility in the confirmation preview once verified; do not describe it as private without evidence.
- Select one source-supported difficulty variant label for the copied prescription across the whole new publication. The authenticated Copy editor stores selected replacements in `scaledver`. Its separate per-block `rx` result fields must not be conflated with that selector.
- Default to the source workout's intended gym-local date. The account holder may choose today or a past date, but may not publish a future-dated personal result.
- Block result inputs are structured values only. Arbitrary free-text block scores are outside this phase; the optional general comment remains available. Do not infer the meaning of gym-specific shorthand.
- Require at least one entered block result or actual exercise load before publication. A copied prescription and comment alone do not satisfy this requirement.
- For a past activity date, calculate the suggested load only from the latest eligible own RM record dated on or before that activity date. A later RM must not be applied retroactively. If no eligible record is available in the returned view, leave the suggestion unavailable rather than infer history completeness.
- Allow the account holder to enter an actual load in kilograms without a calculable RM or source exercise ID when the destination result field and its unit are verified. Do not fabricate an exercise identity or derived suggestion from a name.
- Accept a deliberately entered actual kg load for an exercise already prescribed in kg. Preserve the split source alternatives and distinguish the prescribed load from the actual load in the preview.
- An empty source load may receive an actual kilogram value when its verified Copy row uses the repetition/load format (`formaReg=4`) and kilogram input code (`tipoud=0`). Keep the original empty prescription unchanged in the preview; a configured input does not establish a prescribed weight.
- When a source `%RM` exercise row is changed to kilograms, calculate a numeric suggestion from an eligible own RM when available and allow correction to the load actually used; otherwise require manual entry. In every case require an explicit kilogram number before the write. An unchanged number is allowed only when deliberately chosen; a unit-code change alone does not prove a conversion. The copied source prescription remains separately available for explanation.
- When the source has separate `valor2h` and `valor2m` alternatives, require an explicit choice of the applicable source alternative or direct entry of the actual load; never select by inferred account sex. Preserve both original alternatives.
- Convert only the effective exercise rows for the explicitly selected difficulty variant, including shared blocks. Leave unselected variant rows and their source units and values intact.
- When several difficulty levels are available, require the account holder to choose one explicitly before the publication preview. A sole available level may be selected automatically.
- After a timed-out or otherwise uncertain publication or deletion attempt, perform fresh reads and report the observed state. Never retry the write automatically; a further attempt requires new preparation and confirmation.
- Keep the block-level `rx`/`rxstr` control out of the first delivery until its write semantics are verified. Do not derive it automatically from the publication-wide difficulty variant.
- Restrict each new structured block result to the source-supported result kind and unit, such as time, repetitions, rounds, kilograms, or pounds. An unrecognized result kind cannot receive a new result.
- Allow deletion of a verified own activity even when it contains RM marks. Before confirmation, identify the target and warn that the effect on RM history or progression is unverified; do not claim the marks will remain or be removed.
- If a requested historical gym publication cannot be found and verified through the bounded supported source view, report the Copy source as unavailable. Do not accept an arbitrary source ID as a substitute.
- After publication, return the original `%RM` prescription alongside the recorded kilogram load only when the gym publication can be independently reverified. Otherwise report original-source provenance as unavailable. Do not add persistent local personal-history storage in the first phase.
- Do not create automatic local backups before deletion. Show the exact own entry and the possible irreversible loss in the preview, then require the action-specific confirmation; no undo is promised.

See the [feature scope decision](adr/2026-09-28-manual-activity-publication-and-deletion.md).

## Candidate workflow and evidence boundary

The account holder supplied examples from the gym activity list's **Copy** flow: a `samewod` response, an exercise-list response, and a subsequent `POST /api/activity` in `fetch` form. The POST uses multipart form data with JSON-string exercise and block arrays. It retains the source exercise prescription fields in this sample, so it does not demonstrate the intended adjustment of RM loads to kilograms. The authenticated editor was later inspected read-only, and the checkout now implements the observed Copy field mapping with fixture tests. Live numeric persistence, applied audience, and read-back reconciliation remain unverified. The sanitized structure is recorded in [API research](api-research.md#candidate-activity-result-write-flow-user-supplied-samples-2026-09-28). Private source payloads and request headers remain outside this document and the repository.

A later account-holder publication capture changed seven exercise/variant unit codes from `%RM` to `kg` and returned an ID with empty error arrays. It did not change numeric/load fields relative to the earlier captured POST. This establishes a user-observed accepted unit change, not automatic percentage arithmetic or persisted content. The checkout requires an explicitly confirmed actual kilogram number, independently of its optional historical suggestion.

The existing [`get_personal_activity`](tools.md) path reads the account's calendar and activity details, including available block results. It does not write results. An activity entry, a published workout, and an exercise RM record are distinct domain concepts in the [glossary](../CONTEXT.md).

## Proposed user flow

1. Select one verified publication from the selected gym's supported view. If several difficulty variants exist, choose one explicitly. Default the new activity date to the publication's intended gym-local date, allowing a past date or today.
2. Enter source-supported structured block results, actual exercise loads in kilograms, and an optional general comment. For eligible `%RM` rows, show a date-appropriate calculated load as an editable suggestion; require the number actually used. Preserve source prescriptions in the preview. Require at least one result or actual load.
3. Prepare a read-only preview naming the account's gym, source publication, intended activity date, selected variant, entered results and loads, source-versus-calculated-versus-actual values, verified audience, and any reliably detected same-source/date entry. Stop when source identity, units, audience, target fields, or membership cannot be verified. A possible intentional duplicate needs explicit acknowledgement.
4. After the account holder confirms that exact preview, revalidate the account, gym, source, date, and payload; send one publication request. Do not retry an uncertain write. Read the returned own activity through the account calendar/detail path and report what was actually observed, distinguishing a returned ID from persisted and correctly projected content.
5. To delete, select one entry from verified own activity for the selected gym and show its date, content, source ID, possible permanent loss, and unknown effect on RM marks in a read-only preview. After separate confirmation, revalidate ownership and target identity, send one delete request, then refresh the calendar/detail view. Report uncertainty rather than treating an AJAX success callback or absent current-view row as proof of permanent deletion.

These steps describe the desired MCP behavior. The checkout documents its implemented tool names, write-field serialization, and fixture-tested result states in [tool documentation](tools.md); upstream response contracts still require live validation. No live write follows from this design document.

## Acceptance criteria for implementation

- Public MCP tests through the existing in-memory MCP client and simulated upstream HTTP seam use anonymized fixtures to cover preparation, exact action confirmation, own-account and selected-gym verification, source selection, variant choice, historic date and RM boundaries, editable calculated loads, manual kilograms, structured score/unit validation, possible duplicates, and deletion of an own entry with RM marks.
- Outbound tests verify the fixed gym origin, allowlisted requests and fields, one write per confirmed action, no automatic retry after a possibly sent write, and no raw personal/publisher data, credentials, or arbitrary account/source IDs in public outputs or logs.
- Read-back tests distinguish an accepted POST response from verified own activity content, and an accepted DELETE response from the subsequently observed account view. Ambiguous transport, incomplete calendar coverage, changed source/target, conflicting identity, and unexpected response structures remain explicit uncertainty or errors.
- Authorized live validation compares the account holder's own publication request, returned response, and later calendar/detail read; checks Copy-flow audience and source provenance; and validates deletion only after a separate action-specific confirmation of an exact own entry. The user-supplied POST/response establishes one accepted shape but does not replace read-back or authorize a test DELETE.
- Validate publication and deletion through at least one MCP-compatible client or harness. Update tool documentation, API research, validation evidence, affected ADRs, and status before claiming delivery. Publication of a new npm version is a separate release decision.

## Proposed delivery sequence

1. Inspect the authenticated Copy editor and perform read-only comparison of the account holder's already published example against its source and account calendar/detail view. Record what the current evidence establishes about unit fields, structured scores, audience, and original-source linkage. Keep personal values and private request data out of the repository.
2. Add read-only preparation tools for publication and deletion, with short-lived action references bound to the verified account, gym, exact source or own entry, selected date/variant, entered results, and displayed risk. Reject stale or changed targets before execution.
3. Add one confirmed publication request with read-back reconciliation. Cover eligible `%RM` numeric conversion and manual actual loads with anonymized fixtures. Validate any real publication only against an individually confirmed exact action; the account holder's supplied publication remains user evidence until a separate read-back is completed.
4. Add one confirmed deletion request with read-back reconciliation and the RM-effect warning. Validate a real deletion only after separately confirming the exact own entry to delete.
5. Run the project and MCP-compatible-client checks, update documentation and ADRs with actual evidence limits, then handle any release separately.

## Remaining evidence and design limits

- Whether a live numeric kilogram write is accepted and later read back with the same value, including when the source has split `valor2h`/`valor2m` fields. The fixture path follows the editor's `valor2` and `tipoud=0` mapping and preserves untouched source alternatives.
- Whether the accepted structured result fields persist and project exactly as the fixture response. The checkout reconciles by own calendar/detail, but no separate live publication was authorized.
- Whether a reliable same-source identifier becomes available on an own entry. The current detail has no verified Copy-source linkage, so date and exercise names alone cannot trigger a duplicate warning.
- Whether the account's selected publication audience is applied to a new record. The checkout reads `USPRIVACIDADDEF` and separate `USPRIVCAST` settings, with no per-publication audience control.
- The official frontend sends `DELETE /api/activity/<id>`, but owner authorization, response meaning, and post-delete visibility remain unverified.
- Whether a fresh account view after a real DELETE shows the expected target state; the checkout's reconciliation states remain fixture-verified only.
- Whether the bounded upstream exercise-detail view omits eligible historical RM points. The checkout applies the date cutoff to returned data and reports limited coverage; complete lifetime history remains unverified.
- Whether deletion removes or changes RM history, marks, or progression associated with the target entry. This unknown effect does not by itself block the account holder's confirmed deletion decision.
- Which live write, if any, the account holder will explicitly authorize for contract validation.

The historical security boundary is the [credential and read-only MVP decision](adr/2026-09-21-credential-security-and-read-only-access.md); the [manual booking-write decision](adr/2026-09-24-manual-booking-writes.md) covers bookings only.
