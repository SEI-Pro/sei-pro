# Mapa de capacidades (Fase 5 / ADR-0007)

Insumo canônico: `pages/` (~78 docs de usuário) +
`docs/mapping-funcoes-configuracoes/{funcoes,opcoes_funcoes}.csv` + pastas em
`src/features/`. Fronteira-alvo = capacidade que o usuário reconhece e liga/desliga
(ADR-0007), não página do SEI nem arquivo legado.

Estado desta fatia: **fronteiras instaladas** — as quatro capacidades grandes de
`atividades` têm pastas, descritores, installers e wrappers de compatibilidade; os clusters
de `sei-functions` foram extraídos e a pasta agregadora deixou de existir. O comportamento
continua sendo legado por desenho: esta etapa muda ownership e composição, não inventa
fluxos novos.

---

## 1. Split de `atividades` (validado no plano)

| Feature-alvo | Capacidade (vocabulário do usuário) | `configKey` (hoje / alvo) | Arquivos-fonte atuais | Stub / shell |
|---|---|---|---|---|
| `atividades-config` | Administração de configuração de atividades (planos, programas, unidades, chaves, perfis) | hoje: compartilha `gerenciaratividades`; alvo: chave própria | `config-options.ts` (~5458), `config-panel.ts` (~2743), `config-table.ts`, `config-domain.ts`, `config-queries.ts`, `config-use-cases.ts` | **wired**; installer real + wrappers de compatibilidade |
| `atividades-afastamentos` | Registro e gestão de afastamentos | hoje: sob `gerenciaratividades`; alvo: chave própria | `afastamentos.ts` (~2074) | **wired**; installer real |
| `atividades-avaliacoes` | Avaliação / recurso de entregas de planos | hoje: sob `gerenciaratividades`; alvo: chave própria | `ratings.ts`, trechos de `config-panel.ts` / `config-options.ts` (rate/recurso) | **wired**; installer real |
| `atividades-registro` | Registro diário de atividades / trabalho / formulários de atividade | hoje: `gerenciaratividades` | `activity-actions.ts`, `activity-work.ts`, `activity-form.ts`, `activity-use-cases.ts`, `panel.ts`, `kanban.ts`, … | **wired**; installer real |
| `atividades` (legado residual) | Orquestração / runtime compartilhado até o strangler esvaziar | `gerenciaratividades` | `index.ts`, `boot.ts`, `runtime*.ts`, `handlers.ts`, `call.ts`, `io.ts`, `server*.ts`, … | fachada de compatibilidade; corpo grande já extraído |

### Próximas fatias de redução

1. **Migrar call-sites** para os quatro `feature.api` novos, reduzindo os wrappers em
   `src/features/atividades/` sem alterar o wire público.
2. **Separar chaves de configuração** quando houver decisão de produto para cada capacidade;
   enquanto isso, o compartilhamento de `gerenciaratividades` é explícito no schema e nos
   testes.
3. **Esvaziar o núcleo residual** (`boot`, runtime, handlers e servidor) e movê-lo para
   `shared` somente quando continuar sendo uma dependência transversal legítima.

`gerenciarprescricoes` no schema aponta `feature: "atividades"`, mas o descritor
`prescricoes` já reivindica a chave — alinhar schema na fatia que tocá-la.

As chaves compartilhadas durante o strangler (`gerenciaratividades`,
`gerenciarprescricoes` e `filtrarpaginapelapesquisarapida`) são exceções explícitas em
`tests/structure/capability-coverage.test.js`; uma capability que compartilhar chave não
pode fazê-lo silenciosamente.

Não há página dedicada em `pages/` para atividades/afastamentos/avaliações (gap de
documentação de usuário); os descritores usam `configKey: null` até existirem chaves
próprias, embora a instalação das capabilities já seja real.

---

## 2. Clusters extraídos do antigo `sei-functions`

Ver o registro de execução em [`sei-functions-split-plan.md`](./sei-functions-split-plan.md).
O antigo agregador foi dissolvido: os arquivos abaixo vivem hoje nas pastas de capacidade
indicadas e são instalados por `src/entries/legacy-context.ts`.

| Cluster extraído | Feature atual | `configKey`(s) schema | `pages/` relacionadas |
|---|---|---|---|
| `notifications-process.ts` | `notificacoes-processo` | `notificacaonovoprocesso` (hoje em `lista-processos`) | — |
| `editor-captcha.ts` | `editor-captcha` | (comportamento editor; sem chave única) | — |
| `batch-capa.ts` | `acoes-capa` / docs lote | várias | `ACOESEMLOTE.md`, … |
| `tags-menus.ts`, `wizards-menu.ts` | `menus-rapidos` | `menurapido`, `menususpenso`, `ordenarmenu` | `MENURAPIDO.md`, `MENUSUSPENSO.md` |
| `image-docs.ts`, `media-viewers.ts` | `midia-documentos` | `editarimagens`, `qualidadeimagens` | `EDITARIMAGENS.md`, `QUALIDADEIMAGENS.md`, `PLAYVIDEO.md` |
| `session-history-tables.ts` | `historico-processos` | `historicoproc` | `HISTORICOPROC.md`, `HISTORICO.md` |
| `marcadores-arvore.ts` | `cores-marcadores` | `coresmarcadores` | `CORESMARCADORES.md` |
| `visualizacao-toolbar.ts`, `slim-ui-chrome.ts` | `chrome-ui` | várias UX | `TITULOPAGINA.md`, … |
| defaults de novo doc (`newdoc*`) | `chrome-ui` / `acoes-capa` (ownership transitório) | `newdocdefault`, `newdocespec`, … | `VALDEFAULT.md`, `SIGILODOC.md`, … |
| certidão / sigilo | `acoes-capa` (ownership transitório) | `certidaosigilo`, `certidaosigilo_nomedoc` | `CERTIDAOSIGILO.md` |
| teclas / citação / salvamento | `editor-captcha` (ownership transitório) | `teclasatalho`, `combinacaoteclas`, `citacaodoc`, `salvamentoautomatico` | `TECLASATALHO.md`, `SALVAMENTOAUTOMATICO.md` |
| `domain.ts` (`format2DecimalDomain`) | helper puro já isolado; destino com o primeiro consumidor migrado | — | — |

`src/features/sei-functions/` **não existe mais**. O runtime transversal que não é uma
capacidade está em `src/shared/sei-runtime/`; ele é instalado uma vez pela raiz legada e
não deve receber comportamento novo.

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
| Chaves ainda agrupadas em capacidades transitórias | ownership de produto ainda precisa ser refinado no schema |
| `atividades-*` com `configKey: null` | chave própria só após decisão de produto; a instalação já é real |
| `pages/` sem doc de atividades | documentar quando a feature sair do monólito |
