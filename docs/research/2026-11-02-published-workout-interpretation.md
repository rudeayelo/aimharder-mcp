# Published workout interpretation: API, MCP and UI comparison (2026-11-02)

## Question and evidence boundary

Can a consumer reconstruct the published workout's actual instructions from `get_published_workouts`, including the relationships between blocks, rounds, exercise values, timing and difficulty levels?

This note records a review of the current source, prior first-party observations and a fresh read-only API/MCP/UI/official-renderer comparison on 2 November. Live findings cover one publication and the inspected renderer branches; they do not establish every source format or gym. The checkout clarifies existing schema descriptions and notices while preserving raw fields. No normalized model, endpoint allowlist, authentication policy or write behavior changes follow from this work.

The guidance correction is tracked in [issue #124](https://github.com/rudeayelo/aimharder-mcp/issues/124). Shared block/complex descriptions and notices apply to published workouts and the existing own-activity prescription projection; the title warning applies to published workouts only. The clarification that `s` denotes exercise-value seconds does not assign that unit to block fields.

The existing conventions and boundaries are defined in the [MVP](../mvp.md), [domain glossary](../../CONTEXT.md), [workout decision](../adr/2026-09-22-published-workout-applicability.md) and [credential/read-only policy](../adr/2026-09-21-credential-security-and-read-only-access.md). The initial activity is a read-only comparison; workout content cannot establish attendance or a unique class-session association.

## Current projection

The following observations come from [the parser and output schema](../../src/workouts.ts), [the API client](../../src/client.ts), [the MCP registration](../../src/server.ts) and [the public tool contract](../tools.md#get_published_workouts).

| Area | Current behavior | Interpretation still left to a consumer |
| --- | --- | --- |
| Applicability | Detail `recordDate` supplies the intended date; feed `wodClass` supplies the exact class type. Distinct matching publications retain provenance. | A publication is not a unique scheduled session. No publication recency rule resolves competing alternatives. |
| Titles and blocks | `titles` contains nonempty feed `TIPOWODs[].title` values. `blocks` comes from the detail block array. | Titles have no explicit block index and are filtered independently from detail blocks. Do not assume `titles[i]` is proven to label `blocks[i]`. |
| Block instructions | `notes` and raw `type`, `timecap`, `timecaptype`, `time`, `rx`, `rondas`, `sstipo` are allowlisted. | No normalized block-type field is added. Schema guidance and notices explain observed type-dependent semantics: RFT `timecap` is rounds; notes retain a separate textual time cap. |
| Block order and deleted content | Detail block positions are retained. Deleted blocks become `{notes: null, prescription: {}}`; exercises attached to a deleted block are omitted. | An empty projected block is not a prescription to execute. The consumer must preserve source positions when using exercise `blockIndex`. |
| Exercise values | Raw `valor1`, `valor2`, `valor2h`, `valor2m`, format/unit codes, `round`, `roundrepeat`, `complex`, `complexrep` are allowlisted. Undefined fields are omitted; explicit nulls and zeroes remain. | `round` and `roundrepeat` have no normalized meaning in the output. The inspected renderer establishes an outer complex set count from repeated `valor1` entries only under its stated type/array conditions; broader array/set interpretations remain unverified. |
| Units | `valueUnit` labels nonempty `valor1` when `formaReg` and the source unit table resolve. `loadUnit` labels a nonempty load for verified loaded formats. | A missing label means no supported unit was assigned; exercise names must not supply one. `%RM` is relative and must stay separate from kilograms. |
| Complexes | Optional raw grouping markers and repeat counts survive independently in base and replacement exercises. | Consecutive equal non-null markers, including zero, form a group within one block. A type-conditional outer set count from `valor1` is distinct from `complexrep`; do not infer either from a marker or flatten the repetition axes. |
| Difficulty | Ordered source labels supply complete projected variants, including shared blocks. Replacement rows supply their own values and identities. | The top-level prescription is unselected and is not necessarily RX. A label need not apply to every block. |
| Missing block association | A base exercise with absent/null `tipoWOD` is returned with `blockIndex: null`; the variant-building loop skips such a row. | Whether an unassociated row is visible/shared in a real labeled workout is unverified. This is a source-code edge case to investigate, not a confirmed live omission. |
| Personal loads | Today/future `%RM` rows may receive a separate own-account calculation with exact-ID/latest-record/unit provenance and unavailable reasons. Past dates omit present-day calculations. | A calculated suggestion is not the source prescription, an AimHarder-native formula or achieved performance. |

Only the current gym feed page is searched. `unavailable` does not prove unpublished; malformed interpretation is `unsupported`, and retrieval failure is an error. These distinctions must survive any more readable rendering. See [API research](../api-research.md#published-workouts-2026-09-22) and the [workout decision](../adr/2026-09-22-published-workout-applicability.md).

## Existing primary-source observations

These are prior observations recorded in the repository, **not new checks on 2 November**:

- [Exercise units](../api-research.md#exercise-value-and-load-units-2026-09-24): official-renderer inspection and authenticated detail comparisons established seconds for `formaReg=1`, distance for `2`/`6`, repetitions for `3`/`4`, calories for `5`, and format-specific load-unit lookup. A 60-second rest displayed as `1'`. Recognizable unit codes without a load did not create an actual load.
- [Difficulty variants](../api-research.md#difficulty-variants-2026-09-23): source labels selected matching block/exercise replacement indexes, with base content retained for shared blocks. Future WOD and Metcon samples matched separate MCP/source reads. This does not establish a universal three-level model.
- [Complex prescription fields](../api-research.md#complex-prescription-fields-2026-10-21): one gym's observed workout and official renderer established marker grouping and separate repetition counts. An earlier allowlist omission discarded both fields; the current projection preserves them. This is a concrete reason to compare full instructions rather than exercise names alone.
- [EMOM result mapping](../api-research.md#emom-result-mapping-and-second-rejected-attempt-2026-10-01): the official editor labels EMOM `timecap` as total rounds and `res` as completed rounds. Consequently, `timecap` must not receive a universal duration interpretation. This prior editor observation does not establish every published block's header/timing rules.
- [Recorded results](../api-research.md#recorded-block-results-2026-09-23) distinguish prescribed `rondas` from personal result fields. A personal result's time encoding must not silently become the unit of every published timing field.

The current [anonymized MCP tests](../../tests/workouts.test.ts) cover original content/provenance, variants/shared blocks, raw block fields, recognized and absent units, complex field preservation, exact source IDs, calculated loads, ambiguity, unsupported formats and read-only requests. The repeated `valor1` values and rest fixtures verify preservation/units; they do not establish a new general set/round interpretation. Final implementation verification belongs in the [validation record](../validation.md#published-workout-api-mcp-and-ui-interpretation-2026-11-02); fixture checks do not extend this live sample's coverage.

## Fresh API, MCP, UI and official-renderer comparison (2026-11-02)

Fresh read-only requests through both connected AimHarder MCP surfaces returned the same 2 November WOD publication. The authenticated UI's initial view and explicitly selected SCALED, INTERMEDIO and RX labels were checked. The initial modal was not independently verified as an unselected-base mode; the unselected source was compared structurally with a separate authenticated browser navigation to the exact provenance detail endpoint. That independent source response was parsed from document `textContent` and inspected through an allowlist. HTML line-break strings made `innerText` unsuitable for JSON parsing; no byte-exact note comparison is claimed. Official inline `getCabeceraWOD` and `paintWOD` functions were inspected in the authenticated [AimHarder home page](https://aimharder.es/home). Private publication/profile identifiers, personal RM values and calculated personal loads are omitted.

| Observation | Source/UI evidence | Bounded interpretation |
| --- | --- | --- |
| Four blocks, ten exercise rows, three feed titles | Independent detail response and connected MCP projections | `titles` is a filtered feed list, not parallel to detail blocks. Do not zip by position. |
| Final `type=10`, `timecap=5`; replacements use `"5"`; notes `TC 10’` | UI showed five Rounds For Time and a separate ten-minute note. `getCabeceraWOD` defines `RFT=10` and appends `Rounds For Time` to `timecap`. | Here `timecap` denotes prescribed rounds, not a duration. Preserve numeric/string encodings and the separate note. |
| Middle blocks `type=6`, `sstipo=1`, `timecap=null` | UI headers displayed `Fuerza`. | The observed heading is strength; do not infer duration from null or type alone. |
| Consecutive strength rows with `complex=0`, `valor1=["3","3","3","3"]`, no `complexrep` | Raw detail retained these fields; UI displayed `4 X COMPLEX`, with three repetitions per movement. | Zero is a valid group marker. Four outer sets follow the inspected renderer's primary-array rule; a missing inner complex count remains missing. |
| Different final exercises/repetition counts by source label | UI and raw replacements distinguished SCALED's knees-up/single-under prescription, INTERMEDIO's toes-to-bar/double-under prescription and RX's different double-under count. Shared strength instructions, complex grouping, RFT rounds and textual cap remained visible across levels. | Preserve complete source-labeled variants; do not apply one level's exercise substitution or count to another. The unselected source remains separate from a selected label. |

The official `paintWOD` opens a complex when a non-null marker differs from its predecessor. For `LIBRE=6`, `TECNICA=8` and `MOBILITY=12`, its opening label prefixes `valor1.length + " x "` only when the array has multiple entries and its first entry is non-null/nonempty. It appends `complexrep` separately when non-null. This supplies two distinct repetition axes: an outer set count and an optional inner complex count. Never overwrite an explicit `complexrep` with the array length or infer an absent one. The branch was inspected for all three types; actual rendered-set acceptance in this sample covers strength only.

The other connected surface omitted complex markers, `sourceExerciseId` and `personalLoad` that the Pilot returned for this same publication. Their deployed versions and the cause of the difference were not established; do not attribute it to the current parser or assume both surfaces run the same artifact. No new deployment or release was performed by this comparison.

This establishes the observed publication's instructions and all three rendered difficulty labels against the inspected fields/renderer. It does not establish arbitrary time-cap units, `round`/`roundrepeat` semantics, other complex-array formats, cross-gym/locale coverage, exhaustive feeds, personal-load correctness or a unique scheduled-session association. No sporting write was sent.

The later [five-weekday audit](2026-11-02-five-weekday-workout-audit.md) extends the sample and supplies additional type-specific interpretations, including an additive type-3 block `reps` preservation correction. Statements in this single-publication note about unresolved broader semantics and its initial guidance-only implementation describe that narrower phase. The expanded record also clarifies that a difficulty-enabled initial UI render selects SCALED rather than proving an unselected-base display.

## Questions for further bounded comparisons

Use the exact same publication, intended date, class and selected source label in the UI, raw read-only response and MCP. Compare each block in source order. A readable answer generated from the MCP should then be checked against that UI, because correct raw fields can still yield incorrect instructions.

| UI question | Fields to inspect | Evidence needed before changing interpretation |
| --- | --- | --- |
| What is the visible block heading: strength, AMRAP, EMOM, for time, another type? | Feed/detail titles; block `type`, `sstipo` | Exact rendered label and the official renderer branch that produced it. Check title-to-block association rather than assuming array alignment. |
| What does each time or round figure in the heading mean? | `type`, `timecap`, `timecaptype`, `time`, `rondas` | Whether the UI says a duration, interval, prescribed total rounds or another selector; confirm its formatter and unit. Test more than one block type before generalizing. |
| How does the UI represent repeated sets or changing rep counts? | Exercise `valor1`, `round`, `roundrepeat`; block `rondas` | Visible order and repetition nesting. Distinguish repeating a block, repeating an exercise sequence and a list of values. |
| Does a rest belong between sets, between rounds or once after an exercise? | Exercise name, format, `valor1`, `round`, `roundrepeat`, order | The visible position/grouping and renderer logic. A valueUnit of `s` establishes the value's unit, not its repetition scope. |
| What exactly lies inside each repeated complex? | `blockIndex`, order, `complex`, `complexrep` for each selected row | Opening/closing boundaries, count and exercise order, including unmarked rows before/after. Preserve variant-specific markers. |
| Are all source variants complete and correctly labeled? | Block `scaledops`/`scaledver`, exercise replacements | Check every actual label, shared blocks, changed notes, exercise substitutions, rep counts and loads. The base is not an inferred level. |
| How are slash alternatives and loads presented? | `formaReg`, `tipoud`, `tipoud2`, `valor2`, `valor2h`, `valor2m` | UI unit and separate source inputs/labels. Do not infer sex branches from a slash string alone or select one for the account holder. |
| Is visible instruction text omitted or reordered? | Titles, notes, source exercise fields beyond the allowlist | Identify a concrete visible instruction and its owning first-party field/renderer branch; do not expose arbitrary raw fields to avoid an evidence gap. |

If the current sample lacks a construct, record it as unobserved and choose another available publication that contains it. One matching day validates that day's observed constructs; it is not exhaustive cross-gym or cross-type acceptance. Do not treat an unavailable older publication in the current feed as proof that it did not exist.

## Follow-up threshold

A confirmed omission needs an anonymized reproducer tying a visible instruction to a source field discarded or misrepresented by the projection. A confirmed consumer interpretation error needs the returned fields, the incorrect readable instruction and the official interpretation. Preserve unknowns while gathering that evidence. This delivery updates tool guidance, API research, validation and the existing workout ADR alongside schema/notice clarification. No new architecture decision is needed for these existing-field semantics. Future omissions still need source/UI evidence and anonymized regression coverage before changing behavior.
