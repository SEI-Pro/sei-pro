# Plano de dissolução de `sei-functions` (Fase 5.5 / ADR-0007)

A pasta `src/features/sei-functions/` herdou o legado `sei-functions-pro.js`. Não é uma
capacidade: é um saco de clusters. **Não renomear** — dissolver até a pasta deixar de
existir. Nesta fatia: mapa + ratchet; zero remoção da pasta.

Helper puro já isolado dentro do saco: `domain.ts` → `format2DecimalDomain` (coberto por
`tests/features/sei-functions/domain.test.js`). Migra junto do primeiro consumidor que
sair do saco; não extrair pasta só por uma função de formatação.

## Clusters → features-alvo

| Arquivo(s) atuais | LOC (aprox.) | Feature futura | Chaves schema (hoje `feature: "sei-functions"` ou vizinho) | `pages/` | Risco / notas |
|---|---:|---|---|---|---|
| `notifications-process.ts` | 1278 | `notificacoes-processo` | `notificacaonovoprocesso` (schema aponta `lista-processos` — realinhar) | — | badge / background; smoke difícil |
| `editor-captcha.ts` | 1004 | `editor-captcha` | (implícito no fluxo de assinatura/editor) | — | sensível; caracterizar antes |
| `batch-capa.ts` | 1485 | `acoes-capa` ou fundir em `docs-lote` | overlap com lote | `ACOESEMLOTE.md` | grande; coordenar com docs-lote |
| `tags-menus.ts` | 855 | `menus-rapidos` | `menurapido`, `menususpenso`, `ordenarmenu` | `MENURAPIDO.md`, `MENUSUSPENSO.md` | |
| `wizards-menu.ts` | 595 | `menus-rapidos` (ou `wizards`) | — | — | |
| `image-docs.ts` | 700 | `midia-documentos` | `editarimagens`, `qualidadeimagens` | `EDITARIMAGENS.md`, `QUALIDADEIMAGENS.md`, `REDIMENSIONAIMG.md` | |
| `media-viewers.ts` | 518 | `midia-documentos` | — | `PLAYVIDEO.md` | |
| `session-history-tables.ts` | 481 | `historico-processos` | `historicoproc` | `HISTORICOPROC.md`, `HISTORICO.md` | |
| `marcadores-arvore.ts` | 561 | `cores-marcadores` | `coresmarcadores` | `CORESMARCADORES.md` | |
| `visualizacao-toolbar.ts` | 640 | `chrome-ui` / `visualizacao-toolbar` | várias | — | |
| `slim-ui-chrome.ts` | 572 | `chrome-ui` | — | — | |
| `layout-dialogs.ts`, `host-clipboard-dialogs.ts` | ~1165 | `dialogs-host` | — | — | UI compartilhada |
| `interessados-forms.ts` | 369 | `interessados-forms` | — | — | |
| `tables-filesystem.ts` | 312 | `tabelas-arquivos` | `ordernartabela` | `ORDENARTABELA.md`, `ESTILOTABELA.md` | |
| `editor-native-url.ts` | 250 | `url-amigavel` / editor | `urlamigavel` | `URLAMIGAVEL.md` | |
| `wait-load-home.ts`, `boot.ts`, `state.ts`, `page-helpers.ts` | runtime | dissolver no último passo | `debugpage`, `disablequery`, … | — | glue; não virar “feature” |
| defaults `newdoc*` / `newproc_*` (espalhados) | — | `documento-defaults` | `newdocdefault`, `newdocespec`, `newdocformat`, `newdocname`, `newdocnivel`, `newdocobs`, `newdocsigilo`, `newdoctoday`, `newproc_selfunidade` | `VALDEFAULT.md`, `SIGILODOC.md`, `DOCPUBLICO.md` | |
| certidão | (em batch / helpers) | `certidao-sigilo` | `certidaosigilo`, `certidaosigilo_nomedoc` | `CERTIDAOSIGILO.md` | |
| atalhos editor | espalhado | `atalhos-editor` | `teclasatalho`, `combinacaoteclas`, `citacaodoc`, `salvamentoautomatico`, `substituiselecao` | `TECLASATALHO.md`, `SALVAMENTOAUTOMATICO.md`, `SUBSTITUIRSELECAO.md` | |
| formulários | — | `formularios` | `gerenciarformularios` | — | |
| ditado / escrita | — | `escrita-assistida` | `ditado`, `escrivainterativa` | `DITADO.md`, `ESCRITAINTERATIVA.md` | |
| demais chaves órfãs no saco | — | nomear por `pages/` + CSV | `atalhopublicacoeseletronicas`, `estilolegistica`, `linhanumerada`, `naoassinados`, `natjus`, `indicadorglobalblocoassinatura`, `selecaointeligenteblocoassinatura`, `sincronizarprocessos`, `trocaunidade`, … | respectivos `pages/` | uma fatia por chave/grupo |

## Ordem sugerida (baixo risco → alto)

1. Clusters com página + chave clara e arquivo coeso: `cores-marcadores`, `historico-processos`, `atalhos-editor`, `certidao-sigilo`, `documento-defaults`.
2. `menus-rapidos`, `midia-documentos`.
3. `notificacoes-processo`, `editor-captcha` (com caracterização + smoke).
4. `batch-capa` / overlap `docs-lote`.
5. Glue (`boot`, `wait-load-home`, `page-helpers`, `state`) — último; só quando não restar cluster.

## Regra operacional

- Teste de domínio **antes** de mover (mesmo protocolo da fatia 5.2 de atividades).
- Atualizar `feature` no `CONFIG_SCHEMA` e o descritor na mesma fatia.
- Baixar ratchet de linhas / arquivos >500 de `sei-functions` no mesmo commit.
- Proibido adicionar comportamento **novo** a `sei-functions` (ADR-0007).
