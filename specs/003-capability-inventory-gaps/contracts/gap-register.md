# Contract: Gap Register

**Feature**: `003-capability-inventory-gaps`  
**Artifact**: `# capabilities-map:gaps` anchor in `docs/capabilities-map.md`

## Purpose

Prioritized, actionable backlog of capability honesty/consolidation work for Spec Kit (FR-004–FR-006, SC-003–SC-004).

## Priority meanings (normative)

| Level | Meaning |
|-------|---------|
| P1 | Blocks honest inventory/frontier or user toggle clarity |
| P2 | Ownership or maturity consolidation (when FR-013 applies) |
| P3 | User documentation coverage |
| P4 | Tidy-up / naming consistency |

## Required fields

See [data-model.md](../data-model.md) `Gap`.

## Ordering

1. Open gaps before closed/`not_a_gap` in the human register view.
2. Among open: P1, then P2, then P3, then P4.
3. Within a level: stable explicit order in YAML array (documenter’s choice; used for “top 5” answers).

## Soft-gate query

`openP1 = gaps.filter(g => g.status === 'open' && g.priority === 'P1')`

If `openP1.length > 0`, new user-capability Spec Kits MUST follow [soft-gate-new-capability.md](./soft-gate-new-capability.md).

## Maturity-type constraints

A gap with `type: maturity` is invalid unless related capabilities are not `exclusive` and evidence cites at least one of: parallel legacy path, unjustified shared/`null` key, residual owner (FR-013). Coverage gate C9 enforces this.
