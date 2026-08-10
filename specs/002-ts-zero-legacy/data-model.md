# Data Model: Código Novo Sem Legado

**Feature**: `002-ts-zero-legacy` | **Date**: 2026-08-10

Logical entities for the delivery-policy / gate domain (not a database schema).

## Entities

### CapacidadeModerna

Feature descrita por `src/features/<id>/feature.ts`.

| Attribute | Description |
|-----------|-------------|
| id | Stable feature id |
| maturity | `declared` \| `wired` \| `exclusive` |
| contexts | Execution contexts where it installs |
| configKey | Options schema key or justified null |
| modulePaths | Source files owned by the feature |

**Validation**:
- Every product feature MUST have a descriptor with valid maturity.
- For a touched fecho at merge: every capacidade in the fecho MUST be `exclusive`.

**State transitions (per feature)**:
1. `declared` → `wired` (modern install + parallel legacy still possible)
2. `wired` → `exclusive` (composition-root only; no parallel legacy for this feature)
3. Under this policy: merge of a touch that includes the feature REQUIRES `exclusive` (no merge while still `wired`/`declared` if in fecho)

### SuperficieLegada

Anything the policy treats as forbidden coupling targets for a touched fecho.

| Attribute | Description |
|-----------|-------------|
| kind | `non-exclusive-feature` \| `legacy-loader` \| `banned-global` \| `untyped-product-js` |
| locator | Feature id, path prefix, or global/API name |

**Validation**:
- Derived: maturity ≠ `exclusive` ⇒ feature modules are legacy surface.
- Shared modern infra is **not** SuperficieLegada (see below).

### InfraestruturaModernaCompartilhada

Allowlisted non-feature roots consumable by exclusive closures.

| Attribute | Description |
|-----------|-------------|
| rootPath | e.g. `src/core`, `src/sei`, `src/platform`, `src/shared`, `src/config`, `src/app` |
| rule | Must not depend on SuperficieLegada |

**Validation**: See [contracts/shared-modern-infra.md](./contracts/shared-modern-infra.md).

### FechoDeDependencias

Closed set required for the touched product behavior.

| Attribute | Description |
|-----------|-------------|
| touchedPaths | Product-runtime paths changed in the delivery |
| capacidades | CapacidadeModerna set owning/reached by those paths |
| infraUsed | InfraestruturaModernaCompartilhada modules imported |
| edges | Import/call edges inside the fecho |

**Validation (merge invariants)**:
- All `capacidades` have `maturity = exclusive`.
- No edge from fecho code → SuperficieLegada.
- All touched product code files are TypeScript without `@ts-nocheck` (and without new `any`/`@ts-ignore` debt per gate rules).
- Fecho is the unit that must be exclusive — not necessarily the entire extension.

**State transitions**:
1. `open` — work in progress; may span prerequisite slices
2. `exclusive-ready` — all merge invariants hold
3. `merged` — dual gate passed

### MudancaEntrega

A PR / delivery slice under the policy.

| Attribute | Description |
|-----------|-------------|
| scope | `docs-only` \| `tooling-only` \| `product-runtime` |
| fecho | FechoDeDependencias if product-runtime |
| automatedGate | pass \| fail |
| humanPolicyReview | pass \| fail \| pending |

**Validation**:
- `docs-only` → exclusive-closure gate N/A; dual exclusive-maturity not required.
- `tooling-only` → typed/no-legacy-coupling for changed tooling; no forced feature exclusive.
- `product-runtime` → fecho exclusive-ready + automatedGate pass + humanPolicyReview pass before merge.

### InspecaoSeiEfemerica

Agent inspection session against a real SEI page.

| Attribute | Description |
|-----------|-------------|
| pageContext | Which SEI page/flow was inspected |
| accessGranted | boolean (human-controlled) |
| persistedArtifacts | MUST be empty (no HTML/screenshot files saved) |

**Validation**:
- If DOM evidence required and `accessGranted = false` → block DOM-dependent delivery.
- `persistedArtifacts` non-empty ⇒ policy violation (FR-016).

### PortaoDuplo

Merge gate pair.

| Attribute | Description |
|-----------|-------------|
| automatedChecks | typecheck, lint, structure policy tests, existing verify suite |
| humanChecks | exclusive honesty, DOM/HTML quality, fecho honesty (FR-015) |

**Invariant**: Merge allowed iff both pass for in-scope deliveries.

## Relationships

```text
MudancaEntrega 1──0..1 FechoDeDependencias
FechoDeDependencias *──* CapacidadeModerna
FechoDeDependencias *──* InfraestruturaModernaCompartilhada
CapacidadeModerna (maturity≠exclusive) ⊂ SuperficieLegada
InspecaoSeiEfemerica ── supports ── MudancaEntrega (when UI/DOM)
PortaoDuplo ── gates ── MudancaEntrega
```
