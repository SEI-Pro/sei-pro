# Config keys inventory (Phase 2.1 / ADR-0009)

Scanned on 2026-08-07 against `src/`, `src/options/options.html`, and
`docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv`.

## Counts

| Source | Distinct keys |
|---|---|
| `verifyConfigValue` / `checkConfigValue` / `getConfigValue` string literals in `src/` | **69** |
| `options.html` `data-name` attributes | **73** |
| `opcoes_funcoes.csv` first column | **72** |
| Schema (`src/config/schema.ts`) | **74** |
| ADR-0009 cited code literals | 79 (overcount vs re-scan) |

## Discrepancy summary

**Discrepancy count resolved: 5 classes (documented below).**

1. **ADR 79 vs re-scan 69** — ADR counted ~79 distinct literals; a fresh scan of
   `verifyConfigValue|checkConfigValue|getConfigValue('…')` finds **69**. The gap is
   historical measurement drift (duplicates / dynamic names / files moved), not missing
   product keys. Schema covers the union of HTML + CSV + known extras, not the ADR
   headline number.
2. **CSV/HTML only (not in verify/check/get call sites): 3**
   - `monitoradosacimacontrole`
   - `natjus`
   - `salvamentoautomatico`
   Present in options UI and CSV; kept in schema.
3. **Code/HTML but not in CSV: 1**
   - `llmProvedoresExternos` (Phase S.8 / ADR-0015) — read from `configGeral` in
     `background/llm-handler.ts`, not only via the three helpers.
4. **Neither CSV nor configGeral helpers: 1**
   - `bugReportOptIn` — `chrome.storage.local` telemetry opt-in (Phase S.5).
5. **CSV ⊆ schema** — all 72 CSV keys are in the schema. Net schema − CSV = **+2**
   (`llmProvedoresExternos`, `bugReportOptIn`).

## Schema membership rule

A key enters the schema if it appears in any of:

- string literal argument to `verifyConfigValue` / `checkConfigValue` / `getConfigValue`
- `data-name` on the options page
- `opcoes_funcoes.csv`
- explicitly required by ADR-0015 (`llmProvedoresExternos`, `bugReportOptIn`)
