# Published workout interpretation across five weekdays (2026-11-02)

## Scope and evidence boundary

The read-only audit covered every publication found in the selected gym's current feed for **27, 28, 29 and 30 October and 2 November 2026**, the five weekdays ending on 2 November in the reported gym zone. Saturday 31 October and Sunday 1 November were excluded. The sample contains **26 publications, 99 base blocks, 315 base exercise rows and 22 labeled variants across eight publications**, spanning eight class categories.

The current feed contained 32 records: one pinned announcement and 31 workouts. Of those workouts, 26 matched the requested dates, one was on the excluded Saturday and four were on 26 October. The first page reached all requested dates, but this does **not** establish an exhaustive date-wide inventory or prove that no additional publication exists outside that view. No pagination/completeness claim is added to the MCP contract.

Sources were the verified gym feed, 26 independent authenticated HTTPS detail-document reads, fresh Pilot `get_published_workouts` calls, the authenticated UI and official inline `getCabeceraWOD`/`paintWOD` functions in the [AimHarder home page](https://aimharder.es/home). Detail responses were parsed from browser DOM `textContent`, not retained as original response bytes. Local references are [the reader](../../src/workouts.ts), [API client](../../src/client.ts), [MCP registration](../../src/server.ts), [API research](../api-research.md), [workout ADR](../adr/2026-09-22-published-workout-applicability.md), [activity result mapper](../../src/activity-publication.ts) and [write serializer](../../src/activity-publication-write.ts). A write mapping is implementation evidence, not independent proof of published instructions.

The [read-only/privacy boundary](../adr/2026-09-21-credential-security-and-read-only-access.md) remained in force. No sporting write was sent. This note omits private publication/profile identifiers, credentials, personal RM values, calculated personal loads, full responses and complete workout programs. Examples retain only the minimum source structure needed to explain a finding.

## Method and comparison results

Publications were selected by detail `recordDate` and exact source class, retaining every matching alternative. Publication timestamps and pinned announcements were not intended-date evidence. There were **25 distinct date/class queries** for 26 publications because one date/class returned two alternatives.

All 26 independent detail documents were parsed and the reader's projected structural subset was compared with fresh Pilot results, including every variant. **Twenty-four matched exact structural hashes; the two Metcon publications matched after decoding exercise-name `&#039;` to its apostrophe presentation.** This concerns the browser document's entity presentation, not an unexplained exercise substitution. Notes, derived unit labels and calculated personal enrichment were excluded from the hash comparison. It establishes equality of that subset, not byte-exact responses, complete instruction preservation or personal-load correctness.

The UI initially rendered all 26 publications, and all 22 difficulty labels were selected and inspected with the class selection verified. For publications with difficulty options, the initial UI selected **SCALED**. It must not be described as independent unselected-base UI validation: unselected source fields were compared structurally with the independent detail. The earlier [single-WOD note](2026-11-02-published-workout-interpretation.md) is narrower; this expanded audit explicitly records the selected-default distinction.

An initial batch of six concurrent Pilot requests returned `ACCESS_RESTRICTED` for 2 November EF. Work stopped at that access boundary. After the account holder explicitly authorized a retry, the remaining 22 date/class queries ran sequentially and succeeded, completing successful recorded coverage for all 25 distinct date/class queries. No further live error occurred. This does not establish HTTP 403 versus 429, rate limiting, authentication failure or another root cause. No automatic retry loop or new concurrency policy is inferred.

## Five-day coverage ledger

Counts mean publications found in the inspected feed view. Every publication has independent detail/subset comparison and an initial UI render; every supplied label was also selected.

| Intended date | Weekday | Classes found | Publications | Independent detail / MCP subset |
| --- | --- | --- | --- | --- |
| 2026-10-27 | Tuesday | Gymnastics, WOD, StrongWOD, EF, GAP | 5 | All matched |
| 2026-10-28 | Wednesday | Metcon, WOD, EF, GAP, Mobility, BARBELL CYCLING | 7 | All matched; Metcon name-entity normalization |
| 2026-10-29 | Thursday | Metcon, WOD, StrongWOD, EF, GAP | 5 | All matched; Metcon name-entity normalization |
| 2026-10-30 | Friday | WOD, StrongWOD, BARBELL CYCLING | 3 | All matched |
| 2026-11-02 | Monday | Gymnastics, StrongWOD, WOD, EF, Mobility, GAP | 6 | All matched |
| **Total** | **Five weekdays** | **Eight class categories** | **26** | **24 exact + 2 normalized structural matches** |

The two 28 October EF publications remain distinct alternatives and the MCP retains ambiguity. Neither recency nor matching class/date proves that one supersedes the other.

## Block-type coverage

Counts refer to 99 **base** blocks, without recounting variant replacements. Official-renderer branch inspection and actual rendered occurrence remain separate evidence levels.

| `type` | Base blocks | Interpretation and limit |
| --- | --- | --- |
| `1` | 6 | For Time iterates `valor1` columns, then source exercise rows, skipping zero-valued positions. Do not read each row's whole array consecutively. |
| `2` | 3 | AMRAP header uses `timecap` as duration: `timecaptype=1` means seconds, otherwise minutes in this branch. |
| `3` | 9 | EMOM uses `time`/`timecap` for interval presentation; total/grouping uses exercise `roundrepeat` and block `reps`/`rondas` with exercise `round`. |
| `4` | 4 | Tabata examples had empty values and no supplied timing prescription. Do not invent 20 seconds work, 10 seconds rest or eight rounds. |
| `5` | 0 | No actual example; no new interpretation established. |
| `6` | 35 | `LIBRE=6`; observed `sstipo=1` renders `Fuerza`. Complex outer sets and inner repeats remain distinct. |
| `7` | 0 | No actual example; no new interpretation established. |
| `8` | 0 | Previously inspected `TECNICA=8` shares a conditional complex-set branch; no rendered example in this audit. |
| `9` | 0 | No actual example; no new interpretation established. |
| `10` | 7 | Rounds For Time uses `timecap` as prescribed rounds, including numeric strings; a separate textual cap remains in notes. |
| `11` | 27 | Present; preserve raw content and type-dependent selectors. Local result-kind mapping alone does not validate every custom/free-text prescription. |
| `12` | 7 | Mobility occurs. The inspected conditional outer complex-set branch is not a universal array multiplication rule. |
| `13` | 1 | Ladder header uses `timecap` duration with the AMRAP-style seconds/minutes selector; buy-in/first-round/increment rows have different roles. |
| `14` | 0 | No actual example; no new interpretation established. |
| **Total** | **99** | **Nine observed codes; five absent codes.** |

### EMOM intervals, totals and grouping

The official published header displays EMOM when `time` is null, or when `time=0` and `timecap=1`. With `time=0` and `timecap>1`, it displays `E{n}MO{n}M`. Other non-null `time` values display the interval in seconds. Here `timecap` is an interval component, **not total rounds**.

`paintWOD` obtains total rounds from exercise `roundrepeat` when a group changes; active `getPieTipoWODPaint` displays that computed total, not a source `totalrounds` field. The footer calls it minutes when `timecap=1`, otherwise rounds. The observed StrongWOD displayed 14 minutes from `roundrepeat=14`; Gymnastics displayed `E3MO3M` and five rounds from `roundrepeat=5`.

This supersedes the earlier [editor-observation summary](../api-research.md#emom-result-mapping-and-second-rejected-attempt-2026-10-01) that called EMOM `timecap` total rounds **for published interpretation**. Historical write attempts, their evidence and `res` as the completed-round result are unchanged.

Block **`reps`** is an instruction-bearing EMOM layout selector:

- `reps=0` emits sequential groups with a `{roundrepeat} Rondas` heading.
- `reps=1` emits cyclic interval slots from block `rondas` and exercise `round`. The observed two-slot, one-minute interval with `time=0` displayed odd/even minutes. A three-slot, two-minute example displayed starts `0,6,12` / `2,8,14` / `4,10,16`, totaling nine intervals.
- Null or absent mode supplies no verified sequential/cyclic selection; preserve that uncertainty.

Independent source examples established `reps=1`, `rondas=2` in StrongWOD; `reps=0`, `rondas=2` in sequential EF groups; and `reps=1`, `rondas=3` in the two-minute cyclic EF example. The previous read allowlist discarded `reps`. The correction preserves optional raw scalar `reps` **only for type 3**, in base/variant prescriptions and the shared own-activity projection. This published mode is separate from recorded personal `result.reps`; it does not add a new result interpretation or write capability. Implementation checks belong to the delivery validation record.

### Ladders, changing arrays and Max sentinels

For the observed Ladder, negative exercise `roundrepeat` marks buy-in (`-1` is a single buy-in); `round` identifies the first ladder values and later increments. The GAP example rendered buy-in 25, first ladder value 6 and increment 3, matching `round=1`/`roundrepeat=-1`, `round=2` and `round=3` rows. These are different roles, not repeat counts to multiply. Broader negative encodings remain unverified.

For Time loops column first, then source exercise order. Minimal observed arrays `[10,8,5,3]` and `[10,7,5,2]` produced the interleaving `10,10,8,7,5,5,3,2`; a row `[0,0,0,200]` appeared only at the end. Equal arrays `[21,15,9]` also produced a visible `21-15-9 reps` header. Preserve position and type-dependent order; zero placeholders are not zero-repetition sets to execute.

`valor1=9999` renders **Max**, with time/repetition wording depending on format. It is not a literal prescription for 9,999 seconds or repetitions. Guidance must explain that sentinel while preserving the original encoding. Unknown/missing values must not become invented quantities.

### Complex axes, source conflicts and omitted fields

The 28 and 30 October Barbell samples displayed **3 × 2 complexes**, confirming simultaneous outer primary-array sets and inner `complexrep` repeats. This extends the earlier zero-marker case with absent inner count. Preserve both axes, source order and group boundaries; never overwrite `complexrep` with array length or infer it from the marker.

Some notes named movement distance while structured format fields labeled primary values as repetitions. Preserve both source statements; do not silently repair the structured unit from a name or remove contrary notes because of a unit label.

The inspected detail blocks' omitted keys were `pwid`, `id`, `res`, `reps`, `video`, `link` and `selectedscaling`. `totalrounds` was a renderer computation, not a source field. The correction narrowly retains type-3 `reps`; it does not expose arbitrary result, identity or media fields. Media content values were not yet checked, so this audit does not claim that media were empty or irrelevant. Prior Copy/write restrictions are not proof of published read semantics. No broader custom/media projection contract is established.

## Findings and remaining limits

Confirmed guidance/correction targets are EMOM interval versus computed total, the omitted type-3 grouping mode, Ladder row roles, For Time column order/zero placeholders, the Max sentinel, AMRAP/Ladder duration units, unspecified Tabata timing and both complex repetition axes. Keep source number/string/null/absent distinctions and raw arrays; this does not introduce a normalized workout model.

Filtered titles remain independent of block positions. Null/absent exercise block association remains a code edge case: base rows survive while variant construction skips them, but no supplied example here establishes visible loss. Prior runtime field differences remain unexplained without deployed artifact/version evidence.

Types 5, 7, 8, 9 and 14 lack live examples. Exhaustive publication coverage, other gyms/locales, media content, personal-load arithmetic/unit provenance, attendance, unique scheduled-session linkage and write acceptance remain outside this audit. No deployment or package publication is established by it.

The subsequent owner-authorized [delivery receipt](../hosted-workout-interpretation-deployment.md) separately establishes main integration, the hosted code-only rollout and exact `0.5.4` npm artifact verification. It preserves this audit's source/coverage limits.
