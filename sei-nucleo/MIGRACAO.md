# Migração do legado para o sei-nucleo

Tabela função legada → função nova. Serve para o caminho inverso: quando uma
funcionalidade do SEI Pro for tocada, trocar a implementação antiga pela do
núcleo (carregando `dist/js/sei-nucleo.js` no mesmo mundo) e apagar a antiga.

Status: ✅ existe no núcleo e foi validado ao vivo no SEI 4.1.5 · 🟡 existe, falta
validar ao vivo · ⏳ ainda não existe (ver fase no plano).

## Infraestrutura

| Legado (`dist/js/`) | Núcleo | Status | Observação |
|---|---|---|---|
| `escapeComponent`, `fixedEncodeURIComponent`, `encodeURI_toHex` (`sei-functions-pro.js`) | `codificarLatin1`, `paraLatin1Seguro` | ✅ | fim do `%uXXXX` gravado como texto |
| `procLote_paraLatin1`, `docsLote_paraLatin1`, `PROCLOTE_TROCAS` | `paraLatin1Seguro(texto, "texto" \| "html")` | ✅ | em HTML a tipografia vira entidade em vez de sumir |
| `$.ajax` + `xhr: () => xhr` + `responseURL` | `criarHttp().obter/enviar` → `Pagina.url` | ✅ | |
| checagens de `#txaInfraValidacao` espalhadas | `verificarPagina` | ✅ | também sessão expirada e exceção |
| `getLinksInText`, `getLinksArvoreAjax` | `linksAssinados` | ✅ | |
| `getLinkMenuAcaoPro` | `Sei.linkMenu` | ✅ | prefere o link do menu (o legado pegava `tipo_filtro=M`) |
| `getLinkArvoreProcessoPro`, busca em `arrayLinksArvore(All)` | `acaoNaArvore`, `linkDaAcao` | ✅ | ação exata, nunca junta dois links |
| `extractFormParams`, `prepareFormData`, `preencherHiddenLupasFormPro` | `Formulario` | ✅ | lupas sincronizadas pelo script da tela |
| `updateDadosArvore`, `updateDadosArvoreIframe`, `updateDadosArvoreMult`, `getCheckerProcessoPro` (iframe oculto) | `Formulario.abrir(...).definir(...).enviar({ sucesso })` | ✅ | sem iframe, com prova de sucesso |
| `getIDProtocoloSEI`, `getContentProcSEIByProtocolo` | `Sei.localizar` | ✅ | protocolo, nº SEI ou só dígitos |
| `getSeiVersionPro`/`setSeiVersionPro` | `lerVersao`, `lerContexto` | ✅ | |
| `getLoginSEIPro` | `lerContexto().usuario` | ✅ | lê o `title` do `#lnkUsuarioSistema` |

## Leitura

| Legado | Núcleo | Status |
|---|---|---|
| `setDataDocs`, `getDocsArvore`, `getListDocumentosArvore`, `getLinksArvore`, `getLinksArvorePasta` | `abrirArvore`, `lerArvore` (nível, hipótese, assinaturas, cancelado, pastas) | ✅ |
| `ajaxDadosProcessoPro` (`propProcesso`) | `consultarProcesso` | ✅ |
| `getDadosHistoricoPro`, `getDadosHistoricoPaginacao`, `getArrayHistorico`, `restaurarPaginacaoHistoricoPro` | `andamentos({ tipo: resumido \| completo \| total })` | ✅ |
| `getProcessoUnidadePro`, `getProcessosPaginacao`, `getMapaControleProcesso` | `listarCaixa` | ✅ |
| `getContentDocSEI`, `getDownloadAnexoFromArvore` | `localizarDocumento` + `lerConteudo` | ✅ |
| `getTypeSEI`, `getListTypesSEI`, `getHipoteseLegal`, `getListaAtribuicaoProcesso`, `getAjaxListaMarcador`, `getListaGruposAcompEsp` | `listarOpcoes`, `tiposDocumento` | ✅ |
| `getMarcadoresListagemPro`, `getDataMarcadorProcesso` | `marcadoresDoProcesso` | ✅ |
| `getAllTextProcesso` (PDF do processo + OCR) | ⏳ fase 2 (hoje: documento a documento) | ⏳ |

## Escrita

| Legado | Núcleo | Status |
|---|---|---|
| ação "alterar sigilo" das Ações em Lote (`getBatchActionsPro`, `documento_alterar`) | `alterarDocumento` | ✅ |
| `editFieldProc`, `getChangeTypeProc`, `addUrgenteProcessoPro`, `addTrancadoProcessoPro` | `alterarProcesso` | ✅ |
| `sticknoteUpdate`, `sticknoteRemove` | `definirAnotacao` | ✅ |
| `automaticActions` (andamento, remover atribuição/anotação) | `registrarAndamento`, `atribuirProcesso(null)`, `definirAnotacao("")` | ✅ |
| `setMarcadorProcessoPro`, `postFormCadastroMarcadorPro`, `postRemoverMarcadoresListagemPro`, `setPrazoMarcador` | `definirMarcador` | ✅ |
| `updateDadosFormAdicionarPro` (acompanhamento) | `definirAcompanhamento` | 🟡 (prévia validada; gravação não executada) |
| `getFormDocPro`, `setNewDoc`, `docsLote_clickNewDoc/selectDocType/formNewDoc/confirmDocData` | `criarDocumento` | ✅ |
| `docsLote_editDocContent`, `docsLote_saveDoc`, `setDocAutomatico` | `editarConteudo` (CK4 ✅, CK5 🟡) | ✅/🟡 |
| `createProc`, `procLote_criarUm` | ⏳ fase 2 (`criarProcesso`) | ⏳ |
| `getProcessoNaoLido`, `getInteressadosProcessoAjax` (envio e autocompletar de unidade) | `enviarProcesso` (unidade ambígua é erro, nunca o primeiro resultado) | ✅ |
| `reopenProcessAjax`, `execConcluirReabrirProcessoPro` | `concluirProcesso`, `reabrirProcesso` | ✅ |
| ação Assinar das Ações em Lote (senha no DOM de iframe oculto) | `assinarDocumento` (senha só no POST; prova = assinatura na árvore) | ✅ |
| ações Excluir/Cancelar assinatura/Ciência/Duplicar das Ações em Lote | ⏳ fase 2 | ⏳ |
| blocos (interno e de assinatura), sobrestamento, ciências | ⏳ fase 3 (sem script legado) | ⏳ |

## Como migrar uma funcionalidade

1. Carregue o bundle no mundo da página junto do legado:
   `$.getScript(getUrlExtension("js/sei-nucleo.js"))` (e inclua em
   `web_accessible_resources`).
2. Crie a instância uma vez: `window.seiNucleo = new SeiNucleo.Sei(location.href, () => ({ url: location.href, status: 200, html: document.documentElement.outerHTML, doc: document }))`.
3. Troque o corpo da função legada por uma chamada ao núcleo, mantendo a
   assinatura antiga enquanto houver quem a chame; trate `ErroSei.codigo`.
4. Apague a implementação antiga e marque ✅ aqui.
