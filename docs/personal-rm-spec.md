# Personal exercise records and calculated loads: feature specification

Status: feature scope confirmed by the account holder on 2026-09-27. Issues #33–#38 are implemented and closed. Search, progression and one current/future WOD load passed narrow authorized source comparisons. The WOD's separate-field split variants lacked source exercise IDs, so their unavailable status was verified live but calculated split arithmetic still lacks a live example. On 2026-09-28 the account holder accepted this evidence limit and version `0.3.0` was published. The exact registry artifact passed an anonymized MCP check; an authenticated check of that artifact remains pending. See [validation](validation.md#personal-rm-follow-up-2026-09-27-issues-35-38).

## Purpose and scope

Answer questions about the account holder's AimHarder exercise RMs and show a calculated load next to each applicable original `%RM` prescription in a published workout requested for today or a later gym-local date. Keep the source workout and the personal record distinct. Do not estimate RMs from past activities, rewrite the prescribed percentage, or add retrospective loads to past workouts.

The independent lookup starts from an identified exercise, an exercise-name search, or the exercises in a requested workout. It need not enumerate every exercise on which the account holder has ever recorded a result. An ambiguous name search returns candidate exercises for explicit selection; it does not merge records by name. The source exercise ID, not a similar name, must establish the workout-to-record join.

## Personal exercise answers

- For an unqualified question such as "What is my deadlift RM?", return the latest dated 1RM for the selected exercise, with its verified unit and source date. This is the latest recorded value, even when an older value was higher. If no 1RM exists, say so and mention available 3/5/10RM or WOD data without substituting them for 1RM.
- For a progression question, show available dated 1, 3, 5, and 10RM series separately. Distinguish every RM-series point from an event that AimHarder explicitly marks as a new RM. Do not include the WOD series in the RM progression view or call every point a new mark. Do not call a source date a publication date without verification.
- The separate WOD series is useful exercise context, including when no 1RM exists. It is not an RM and never supplies the basis for a `%RM` calculation. A direct 1RM answer need not list WOD points unless they are relevant to explaining unavailable 1RM data or the user asks for that context.
- Source arrays establish only the records returned by that exercise-detail view. Do not claim complete lifetime history without a verified upstream coverage contract.

## Published workout answers

- Automatically consider personal loads when `get_published_workouts` returns a workout dated today or later in the selected gym's reported IANA time zone. Apply this to every returned publication alternative and each source-labeled difficulty variant that contains an eligible `%RM` exercise. Do not infer a unique session, choose an RX level, or treat one publication as superseding another.
- For a plain, unambiguous `%RM` percentage, calculate `latest recorded 1RM for the same source exercise × percentage / 100`. This 1RM interpretation is the agreed product rule, not a verified AimHarder formula. Show the original percentage, calculated value and unit, selected 1RM value and source date, and the basis used. Do not round to available plates or convert units automatically.
- If the source provides separately verified `valor2h` and `valor2m` percentages, calculate and label both alternatives. Do not select a branch from account profile data. If only `valor2` contains an equal slash pair such as `85/85`, it may be treated as one percentage. Leave an unequal unstructured pair uncalculated until its meaning is verified.
- If the exercise identity, 1RM, percentage, date, or physical unit cannot be verified, omit that calculated value and explain why for that exercise. A personal-record read failure must not erase an otherwise valid workout or its original prescription. Show what was successfully retrieved, with explicit incomplete personal-enrichment coverage.
- If an RM source returns records without gym attribution, they may be used for the selected gym's workout only after own-account and exercise-ID verification. State that their gym of origin is unverified; do not invent a gym-specific RM.

## Research and security gates before implementation

The account holder supplied one exercise-detail response and one `workoutAndEjers` search response; [API research](api-research.md#personal-exercise-detail-sample-2026-09-25) records their structure and limits. Before accepting an implementation, separately verify with authorized read-only requests:

1. Exercise search behavior and exact ID matching, including ambiguous names and the observed 50-row search response. A complete personal-exercise index is not required.
2. The authenticated own-account exercise route, how to derive and verify its user ID, and how the returned exercise and `chartUserId` identities are checked. Do not expose an arbitrary user selector.
3. The 1/3/5/10RM and WOD arrays, source date meaning, `history.record` links, physical units (the chart field is named `lbs` even when supplied history text uses `kg`), decimal precision, and empty/malformed responses.
4. Exercise IDs across unselected and difficulty-variant prescriptions, and sex-specific versus preformatted slash values. The observed `85/85` alone does not prove what each side means; `85/75` was only a design example.

Keep new reads bounded and restricted to the authenticated account and source exercise IDs. Apply existing origin, redirect, response-size, retry, secret-handling, and untrusted-content safeguards. Do not store raw personal responses in Git, fixtures, or logs.

## Acceptance

- MCP-level tests with anonymized fixtures cover exact and ambiguous exercise selection, latest versus highest 1RM, separated progression series and new-mark flags, WOD-only data, missing and malformed records, units, percentages, split prescriptions, variants, dates, and partial enrichment.
- A read-only live comparison checks the independent RM answer and at least one applicable published workout against the account holder's AimHarder view. Verify source exercise identity, selected record/date/unit, preserved `%RM`, calculated arithmetic, and the result seen through a compatible MCP client or harness. Record unavailable cases and unverified upstream branches as such.
- Documentation, glossary, ADRs, and tool descriptions agree with the delivered behavior. The current [workout applicability decision](adr/2026-09-22-published-workout-applicability.md) continues to describe shipped behavior until this later feature is implemented and validated.
