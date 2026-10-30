# ADR: fixed Madrid time zone in the hosted frontend

Status: accepted hosted frontend product requirement on 2026-10-28; implementation and validation pending. Amends hosted presentation/setup under the [default gym time-zone decision](2026-09-24-default-gym-time-zone.md). Local stdio configuration and backend overrides remain supported.

## Context

The current portal exposes per-gym IANA fields and time-zone provenance. Some sporting-action paths also require user-confirmed time-zone provenance. The owner considers these controls and references unnecessary for the current participants, and requires the hosted frontend to use `Europe/Madrid` without mentioning time zones. Support for other regions can be exposed later.

## Decision

Do not display time-zone controls, provenance labels, confirmation steps or explanatory time-zone copy in the hosted frontend. Use `Europe/Madrid` for the current frontend experience. Retain the backend's ability to configure a zone manually for future needs. The onboarding test is a useful class query, not verification of the zone.

This is a product configuration choice, not discovery of a gym's authoritative zone or proof of participant confirmation. Do not label an application-selected default as `user-confirmed`. The owner subsequently confirmed that AI-chat answers and confirmations should also omit time-zone explanations/checks while backend configuration and truthful tool-result metadata remain available. This decision does not remove tool-result metadata or change output contracts.

## Consequences

Hiding the HTML fields alone is insufficient. Current action preparation/execution checks require confirmed provenance, and current settings submission can replace saved zone mappings with an empty object when zone fields are absent. Subsequent implementation must reconcile the accepted default with those prerequisites and preserve stored/backend overrides rather than silently clearing them. The behavior of any existing non-Madrid override must be resolved before rollout.

Keep exact sporting-action previews, separate action confirmation, upstream state checks and honest read-back. A change to zone confirmation is not removal of those action safeguards. The implementation must distinguish service configuration from user confirmation and keep backend metadata truthful. No runtime behavior, configuration, tool schema or deployed data changes for this ADR alone.
