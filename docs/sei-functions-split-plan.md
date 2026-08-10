# Registro de dissolução de `sei-functions` (Fase 5.5 / ADR-0007)

A pasta `src/features/sei-functions/` herdou o legado `sei-functions-pro.js`. Não era uma
capacidade: era um saco de clusters. A decisão foi **dissolver**, não renomear, e ela foi
executada nesta fatia. O bundle transitório agora se chama `legacy-context.bundle.js`, a
raiz de composição é `src/entries/legacy-context.ts` e o runtime transversal vive em
`src/shared/sei-runtime/`.

O helper puro `format2DecimalDomain` foi levado para `src/shared/sei-runtime/domain.ts` e
continua coberto por `tests/features/sei-functions/domain.test.js` (o nome histórico do
arquivo de teste é mantido para rastreabilidade).

## Clusters → destinos realizados

| Arquivo(s) de origem | LOC (aprox.) | Feature atual | Chaves schema (antes `feature: "sei-functions"` ou vizinho) | `pages/` | Risco / notas |
|---|---:|---|---|---|---|
| `notifications-process.ts` | 1278 | `notificacoes-processo` | `notificacaonovoprocesso` (ownership explícito compartilhado com lista durante o strangler) | — | badge / background; smoke difícil |
| `editor-captcha.ts` | 1004 | `editor-captcha` | (implícito no fluxo de assinatura/editor) | — | sensível; caracterizar antes |
| `batch-capa.ts` | 1485 | `acoes-capa` | overlap com lote | `ACOESEMLOTE.md` | grande; coordenar com docs-lote |
| `tags-menus.ts` | 855 | `menus-rapidos` | `menurapido`, `menususpenso`, `ordenarmenu` | `MENURAPIDO.md`, `MENUSUSPENSO.md` | |
| `wizards-menu.ts` | 595 | `menus-rapidos` (ou `wizards`) | — | — | |
| `image-docs.ts` | 700 | `midia-documentos` | `editarimagens`, `qualidadeimagens` | `EDITARIMAGENS.md`, `QUALIDADEIMAGENS.md`, `REDIMENSIONAIMG.md` | |
| `media-viewers.ts` | 518 | `midia-documentos` | — | `PLAYVIDEO.md` | |
| `session-history-tables.ts` | 481 | `historico-processos` | `historicoproc` | `HISTORICOPROC.md`, `HISTORICO.md` | |
| `marcadores-arvore.ts` | 561 | `cores-marcadores` | `coresmarcadores` | `CORESMARCADORES.md` | |
| `visualizacao-toolbar.ts` | 640 | `chrome-ui` | várias | — | |
| `slim-ui-chrome.ts` | 572 | `chrome-ui` | — | — | |
| `layout-dialogs.ts`, `host-clipboard-dialogs.ts` | ~1165 | `dialogs-host` | — | — | UI compartilhada |
| `interessados-forms.ts` | 369 | `interessados-forms` | — | — | |
| `tables-filesystem.ts` | 312 | `tabelas-arquivos` | `ordernartabela` | `ORDENARTABELA.md`, `ESTILOTABELA.md` | |
| `editor-native-url.ts` | 250 | `url-amigavel` | `urlamigavel` | `URLAMIGAVEL.md` | |
| `wait-load-home.ts`, `boot.ts`, `state.ts`, `page-helpers.ts` | runtime | `shared/sei-runtime` | `debugpage`, `disablequery`, … | — | glue; não virar “feature” |
| defaults `newdoc*` / `newproc_*` (espalhados) | — | `chrome-ui` / `arvore` (ownership transitório) | `newdocdefault`, `newdocespec`, `newdocformat`, `newdocname`, `newdocnivel`, `newdocobs`, `newdocsigilo`, `newdoctoday`, `newproc_selfunidade` | `VALDEFAULT.md`, `SIGILODOC.md`, `DOCPUBLICO.md` | consolidar quando houver fronteira de produto |
| certidão | (em batch / helpers) | `acoes-capa` (ownership transitório) | `certidaosigilo`, `certidaosigilo_nomedoc` | `CERTIDAOSIGILO.md` | |
| atalhos editor | espalhado | `editor` / `editor-captcha` (ownership transitório) | `teclasatalho`, `combinacaoteclas`, `citacaodoc`, `salvamentoautomatico`, `substituiselecao` | `TECLASATALHO.md`, `SALVAMENTOAUTOMATICO.md`, `SUBSTITUIRSELECAO.md` | |
| formulários | — | `dialogs-host` (ownership transitório) | `gerenciarformularios` | — | call-sites ainda atravessam bootstrap/arvore |
| ditado / escrita | — | `editor-captcha` (ownership transitório) | `ditado`, `escrivainterativa` | `DITADO.md`, `ESCRITAINTERATIVA.md` | |
| demais chaves órfãs no saco | — | ownership transitório por `pages/` + CSV | `atalhopublicacoeseletronicas`, `estilolegistica`, `linhanumerada`, `naoassinados`, `natjus`, `indicadorglobalblocoassinatura`, `selecaointeligenteblocoassinatura`, `sincronizarprocessos`, `trocaunidade`, … | respectivos `pages/` | uma decisão de produto por grupo |

## O que foi feito

1. Foram criadas as fronteiras `acoes-capa`, `editor-captcha`, `dialogs-host`,
   `interessados-forms`, `cores-marcadores`, `midia-documentos`, `notificacoes-processo`,
   `historico-processos`, `chrome-ui`, `tabelas-arquivos`, `menus-rapidos` e
   `url-amigavel`, cada uma com `feature.ts`, `index.ts` e installer.
2. `deps.ts` substitui o barrel circular por resolução tardia de dependências legadas; o
   contrato global fica concentrado em `shared/sei-runtime/legacy-api.ts`.
3. O auto-boot foi removido dos módulos e voltou a existir apenas na raiz
   `entries/legacy-context.ts`; a ordem do Manifest agora aponta para
   `legacy-context.bundle.js` e `legacy-sei.css`. A raiz executa os instaladores
   com `app/installers.ts`, isolando uma falha e registrando o id sem impedir os
   clusters seguintes.
4. As chaves do schema, snapshots do manifest, allowlists e testes foram atualizados; a
   cobertura de build/auditoria não deixa artefatos `sei-functions-pro.js` órfãos.

## Regra operacional

- Teste de domínio **antes** de mover (mesmo protocolo da fatia 5.2 de atividades).
- Atualizar `feature` no `CONFIG_SCHEMA` e o descritor na mesma fatia.
- Não adicionar comportamento **novo** ao runtime legado; novos fluxos entram na capability
  dona e atravessam `.api`.
- O próximo passo é reduzir as fachadas em `src/features/atividades/` e migrar os
  call-sites para as quatro capabilities de atividades, não recriar um agregador.

## Verificação

`npm run typecheck`, `npm test` (217 arquivos / 1171 testes), `npm run audit:dist`,
`npm run manifest:check` e `npm run registry:check` são os portões desta dissolução.
