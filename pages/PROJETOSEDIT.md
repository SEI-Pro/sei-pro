# Creating and editing projects

Projects live in the **Projetos** panel on the SEI home page (enable **Gerenciar Projetos** in the extension options).

## Create a project

1. Open the SEI control list so the home panels load.
2. In the **Projetos** toolbar, click **+**.
3. Enter a name (required), optional type, and optional SEI process number.
4. Save.

If the panel is empty, click **Carregar demonstracao** to seed sample projects.

## Edit a project

Use the toolbar on the project tab: edit, clone, archive, share, or delete.

## Stages (Gantt bars)

1. On a project tab, click **+** to add a stage.
2. Set planned start/end, optional predecessor (FS), owner, macro-stage, tags, calendar mode (**dias corridos** or **dias uteis**), and milestone flag.
3. Drag bars on the chart to reprogram (confirms cascade to dependents).
4. Click a bar for details, edit, or delete.

## Portfolio and reports

- **Portfolio** — all projects on one timeline
- **Por responsavel** — stages grouped by owner
- **Filter** — critical / overdue report with CSV export
- **Export / Import JSON** — share projects as files

## Sharing

Use the share action on a project tab to list users and permissions (`leitura` / `edicao`). With an Atividades API backend, `share_projeto` also syncs remotely.

## Related

- [PROJETOS.md](./PROJETOS.md) — overview and local-first status
- [PROJETOSSHARE.md](./PROJETOSSHARE.md) — sharing options
