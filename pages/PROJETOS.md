# Project management (Gantt)

The **Projetos** feature adds a Gantt-based project manager to the SEI home page.

## Status

Active again in **local-first** mode. The old Google Sheets / Google Cloud OAuth flow is discontinued and removed from the runtime. Projects and stages persist in the extension store (`configDataProjetosPro`). When an Atividades API backend is configured, writes can still sync through that API.

## What you get

- Projects with stages on a Gantt chart (frappe-gantt 1.2.2)
- Business-day calendar with Brazilian holidays
- Dependencies (FS / SS / FF / SF), critical path, and float
- Milestones, baseline vs actual deviation, portfolio and per-owner views
- Import / export JSON and CSV reports
- Demo seed data so the panel works without a remote server

## Enable

1. Open the extension options
2. Turn on **Gerenciar Projetos** (`gerenciarprojetos`)
3. Reload the SEI control page — the **Projetos** panel appears on the home area

If the store is empty, use **Carregar demonstracao** in the empty state (or the panel seeds demo data automatically once).

## Optional remote sync

If you already use the Atividades backend (`URL_API` + access key), keep `gerenciarprojetos` on. The panel still works offline; remote sync uses the same action names as before (`save_projeto`, `update_projeto_etapa`, …).

## Related

- [PROJETOSEDIT.md](./PROJETOSEDIT.md) — create and edit projects / stages
- [PROJETOSSHARE.md](./PROJETOSSHARE.md) — sharing options

### Historical (Google Sheets)

These pages described the Sheets setup and are obsolete for runtime use:

- [BASEDADOS.md](./BASEDADOS.md) — Google Spreadsheet as database
- [SEISHEETS.md](./SEISHEETS.md) — connect SEI Pro to Sheets
- [PROJETOSIMPORT.md](./PROJETOSIMPORT.md) — import Sheets keys

Sharing is now handled inside the panel (share table) and/or via JSON export.

## Next

> [Group process list by markers, type, owner, or control point](./AGRUPAR.md)
