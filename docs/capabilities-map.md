# Mapa de capacidades (Fase 5 / ADR-0007)

Insumo canônico: `pages/` (~78 docs de usuário) +
`docs/mapping-funcoes-configuracoes/{funcoes,opcoes_funcoes}.csv` + pastas em
`src/features/`. Fronteira-alvo = capacidade que o usuário reconhece e liga/desliga
(ADR-0007), não página do SEI nem arquivo legado.

Estado desta fatia: **fundação + strangler** — stubs e reexports; dissolução completa
de `atividades` (~25k LOC) e `sei-functions` fica nas fatias seguintes.

---

## 1. Split de `atividades` (validado no plano)

| Feature-alvo | Capacidade (vocabulário do usuário) | `configKey` (hoje / alvo) | Arquivos-fonte atuais | Stub / shell |
|---|---|---|---|---|
| `atividades-config` | Administração de configuração de atividades (planos, programas, unidades, chaves, perfis) | hoje: compartilha `gerenciaratividades`; alvo: chave própria | `config-options.ts` (~5458), `config-panel.ts` (~2743), `config-table.ts`, `config-domain.ts`, `config-queries.ts`, `config-use-cases.ts` | **shell ativo** (strangler reexport) |
| `atividades-afastamentos` | Registro e gestão de afastamentos | hoje: sob `gerenciaratividades`; alvo: chave própria | `afastamentos.ts` (~2074) | stub no-op |
| `atividades-avaliacoes` | Avaliação / recurso de entregas de planos | hoje: sob `gerenciaratividades`; alvo: chave própria | `ratings.ts`, trechos de `config-panel.ts` / `config-options.ts` (rate/recurso) | stub no-op |
| `atividades-registro` | Registro diário de atividades / trabalho / formulários de atividade | hoje: `gerenciaratividades` | `activity-actions.ts`, `activity-work.ts`, `activity-form.ts`, `activity-use-cases.ts`, `panel.ts`, `kanban.ts`, … | stub no-op |
| `atividades` (legado residual) | Orquestração / runtime até o strangler esvaziar | `gerenciaratividades` | `index.ts`, `boot.ts`, `runtime*.ts`, `handlers.ts`, `call.ts`, `io.ts`, `server*.ts`, … | permanece instalável |

### Ordem de extração (próximas fatias)

1. **Caracterização** do domínio puro (`config-domain`, `config-queries`, wrappers em `config-options`) — **feita nesta fatia**.
2. **`atividades-config`**: migrar `config-panel` / `config-options` / `config-table` para a pasta nova; `atividades` passa a importar de lá (inverter o strangler).
3. **`atividades-afastamentos`**: mover `afastamentos.ts` + CSS/gantt de afastamento.
4. **`atividades-avaliacoes`**: extrair `ratings.ts` + fluxos `ratePlano` / recurso.
5. **`atividades-registro`**: activity-* + panel/kanban/charts.
6. Esvaziar `atividades` residual ou renomear para runtime compartilhado **só se** ainda houver núcleo legítimo; senão dissolver.

`gerenciarprescricoes` no schema aponta `feature: "atividades"`, mas o descritor
`prescricoes` já reivindica a chave — alinhar schema na fatia que tocá-la.

As chaves compartilhadas durante o strangler (`gerenciaratividades`,
`gerenciarprescricoes` e `filtrarpaginapelapesquisarapida`) são exceções explícitas em
`tests/structure/capability-coverage.test.js`; uma capability que compartilhar chave não
pode fazê-lo silenciosamente.

Não há página dedicada em `pages/` para atividades/afastamentos/avaliações (gap de
documentação de usuário); stubs usam `configKey: null` até existirem chaves próprias.

---

## 2. Clusters de `sei-functions` → features futuras

Ver detalhe em [`sei-functions-split-plan.md`](./sei-functions-split-plan.md). Resumo:

| Cluster (pasta atual) | Feature-alvo sugerida | `configKey`(s) schema | `pages/` relacionadas |
|---|---|---|---|
| `notifications-process.ts` | `notificacoes-processo` | `notificacaonovoprocesso` (hoje em `lista-processos`) | — |
| `editor-captcha.ts` | `editor-captcha` | (comportamento editor; sem chave única) | — |
| `batch-capa.ts` | `acoes-capa` / docs lote | várias | `ACOESEMLOTE.md`, … |
| `tags-menus.ts`, `wizards-menu.ts` | `menus-rapidos` | `menurapido`, `menususpenso`, `ordenarmenu` | `MENURAPIDO.md`, `MENUSUSPENSO.md` |
| `image-docs.ts`, `media-viewers.ts` | `midia-documentos` | `editarimagens`, `qualidadeimagens` | `EDITARIMAGENS.md`, `QUALIDADEIMAGENS.md`, `PLAYVIDEO.md` |
| `session-history-tables.ts` | `historico-processos` | `historicoproc` | `HISTORICOPROC.md`, `HISTORICO.md` |
| `marcadores-arvore.ts` | `cores-marcadores` | `coresmarcadores` | `CORESMARCADORES.md` |
| `visualizacao-toolbar.ts`, `slim-ui-chrome.ts` | `chrome-ui` | várias UX | `TITULOPAGINA.md`, … |
| defaults de novo doc (`newdoc*`) | `documento-defaults` | `newdocdefault`, `newdocespec`, … | `VALDEFAULT.md`, `SIGILODOC.md`, … |
| certidão / sigilo | `certidao-sigilo` | `certidaosigilo`, `certidaosigilo_nomedoc` | `CERTIDAOSIGILO.md` |
| teclas / citação / salvamento | `atalhos-editor` | `teclasatalho`, `combinacaoteclas`, `citacaodoc`, `salvamentoautomatico` | `TECLASATALHO.md`, `SALVAMENTOAUTOMATICO.md` |
| `domain.ts` (`format2DecimalDomain`) | helper puro já isolado; destino com o primeiro consumidor migrado | — | — |

A pasta `src/features/sei-functions/` **não é apagada nesta fatia**.

---

## 3. Features já alinhadas a capacidade

Descritores atuais com `configKey` coerente: `login`, `monitorados`, `controlar-prazos`,
`docs-lote`, `lista-agrupamento`, `nao-lido`, `anotacao-controle`, `arvore-info`,
`projetos`, `quick-filter` / `quick-highlight` (mesma chave), `prescricoes`, `ai` (chaves
no schema; `configKey` null no descritor), etc. Ver `capability-coverage.test.js`.

---

## 4. Lacunas conhecidas (allowlist consciente)

| Lacuna | Motivo |
|---|---|
| Schema `feature: "telemetry"` sem pasta | chave `bugReportOptIn` ainda sem feature dedicada |
| Muitas chaves sob `feature: "sei-functions"` | saco de gatos; split planejado |
| Stubs `atividades-*` com `configKey: null` | strangler; chave própria só após extração |
| `pages/` sem doc de atividades | documentar quando a feature sair do monólito |
