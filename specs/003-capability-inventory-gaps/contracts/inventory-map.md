# Contract: Capabilities Map Structure

**Feature**: `003-capability-inventory-gaps`  
**Artifact**: `docs/capabilities-map.md`

## Purpose

Define the canonical layout so humans can read the inventory/gaps and machines can parse stable anchors (FR-001–FR-006, FR-011).

## Required sections (human)

1. **Intro** — purpose, ADR-0007 pointer, “not a substitute for `pages/`”.
2. **Inventory** — readable tables/groups of capabilities (may mirror YAML).
3. **Residuals & non-capabilities** — labeled; emptying conditions.
4. **Gap register** — ordered P1→P4 (then relative order within tier).
5. **Exceptions** — strangler/shared/null/schema-without-folder, linked to gaps.

## Required machine anchors

Fenced blocks with language tag `yaml` and a first-line comment marker:

````markdown
```yaml
# capabilities-map:inventory
entries: [...]
```
````

````markdown
```yaml
# capabilities-map:gaps
gaps: [...]
```
````

````markdown
```yaml
# capabilities-map:exceptions
exceptions: [...]
```
````

Exact field schemas: [data-model.md](../data-model.md).

## Parser contract

- Helper: `scripts/lib/parse-capabilities-map.mjs`
- Input: repo-root-relative path defaulting to `docs/capabilities-map.md`
- Output: `{ inventory, gaps, exceptions }` objects
- Missing anchor or invalid YAML → throw / test fail (fail closed)

## Consistency rules

- Every `entries[].id` in inventory prose tables (if present) MUST exist in the YAML inventory (no silent prose-only capabilities).
- YAML is authoritative for gates; prose MUST NOT claim a capability/gap absent from YAML.
