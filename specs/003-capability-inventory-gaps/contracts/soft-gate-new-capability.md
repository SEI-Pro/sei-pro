# Contract: Soft Gate for New User Capabilities

**Feature**: `003-capability-inventory-gaps`  
**Surfaces**: Spec Kit specs, `DEVELOPMENT.md`, `.github/pull_request_template.md`

## Purpose

Enforce FR-007 without a hard block: while open **P1** gaps exist, brand-new user capabilities may proceed only with explicit justification.

## Trigger

- Change introduces a **new** user-facing capability (new inventory id / new `feature.ts` meant as user capability), **and**
- `docs/capabilities-map.md` gap register has ≥1 gap with `status: open` and `priority: P1`.

Non-triggers: consolidating/migrating an existing inventory entry; docs-only; closing gaps; infra/non-capability work.

## Required justification (Spec Kit)

In the new capability’s `spec.md` (Clarifications or Assumptions), include:

1. List of deferred open P1 gap ids (copied from the map).
2. One short paragraph: why this new capability still prevails now.
3. Confirmation the capability is born in inventory format (user name, one-sentence summary, toggle story).

## PR checklist item

When the PR adds a new user capability:

- [ ] Soft gate: listed deferred P1 gap ids + justification (or N/A: no open P1 / not a new capability)

Incomplete → reject merge (process), same spirit as 002 dual-gate checklist.

## Automation

- **This feature**: process + docs; no mandatory CI parser of Spec Kit text.
- Coverage hard-fail (map↔sources) remains independent and always on.

## Bypass

Silent bypass (new capability with open P1 and no justification) is **not** allowed. Absolute block until P1 empty is **not** required.
