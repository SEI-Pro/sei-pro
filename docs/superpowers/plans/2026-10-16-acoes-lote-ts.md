# Ações em Lote (TypeScript) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as Ações em Lote da árvore do processo (legado jQuery em `dist/js/sei-functions-pro.js:9318-10215`) por um pacote TypeScript `acoes-lote/`, com as 12 ações, fila de etapas, prévia, execução retomável e resultado, só no SEI Pro Lab.

**Architecture:** Mesmo molde do `processos-lote/`. Um content script marca o `<html>`, ouve `spro-acoes-lote-abrir` e abre um modal iframe (`criarControleModal`) com o app numa página da extensão. O app roda o laço (`ExecutorLote`) e pede cada operação à aba por RPC, porque é a aba que tem a sessão do SEI. As operações no SEI usam o `sei-nucleo`, estendido nas Tarefas 4 e 5.

**Tech Stack:** TypeScript 5.9, esbuild 0.25 (`charset: "ascii"`), biome 2, tsx + linkedom para as provas (sem vitest), `fflate` para o ZIP, `chrome.storage.local`.

**Spec:** `docs/superpowers/specs/2026-10-16-acoes-lote-ts-design.md`. Leia-o inteiro antes de qualquer tarefa.

**Worktree:** `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-acoes-lote`, branch `feat/acoes-lote-ts`. Nunca `git add -A`: adicione só os arquivos da tarefa. Rode `npm install` dentro de `acoes-lote/` na Tarefa 1.

**Modelo por tarefa:** as Tarefas 4 e 5 (extensões do `sei-nucleo` com formulários do SEI sem molde no código) vão para o Opus. As demais vão para o Sonnet. A Tarefa 13 (SEI real) fica com o coordenador.

## Global Constraints

- Nome do recurso: **"Ações em Lote"**, em todo texto visível. Nunca "Iniciar ações em lote".
- JS gerado só com ASCII. O build falha com byte > 0x7f. Na fonte TS, acentos podem ficar crus, porque o esbuild escapa. Nos arquivos `dist/js/*.js` legados, o acento tem que ser `\uXXXX` (ver memória `feedback_sei_unicode_escape`).
- Content script e `web_accessible_resources` **só** em `dist/manifest.json`. `manifest_seipro.json` e os `_v2` não mudam.
- DOM só por `h()` (`@comum/ui/dom`), sem `innerHTML`. Modal sem botão Cancelar: o X e o Esc fecham. Ctrl+Enter executa. Cores por tokens `--spro-*`, com tema claro e escuro.
- Sigiloso fora: documento sigiloso ou documento de processo sigiloso é sempre `pulado` com o motivo `"Sigiloso: fora das Ações em Lote"`. O nível Sigiloso nunca é oferecido.
- A senha de assinatura nunca vai para storage nem para o lote persistido.
- Chaves de storage com o prefixo `acoes-lote/`, uma por entidade, no `chrome.storage.local`.
- Escrita com concorrência 1. Leitura (prévia, download) com concorrência 3.
- Links do SEI se colhem da página, nunca se montam (regra do `sei-nucleo`).
- Ids de documento comparados por igualdade exata, nunca por substring.
- Textos ao usuário em português do Brasil. Em toda mensagem de pulado ou erro, o motivo vem por extenso.

## Review Focus

1. **Árvore com pastas fechadas e vários volumes.** A lista tem que trazer todos os documentos, não só os visíveis. Prova na Tarefa 2 com `sei-nucleo/tests/fixtures/sei41/arvore_completa.html`.
2. **Documento cancelado na seleção.** Toda ação o pula com `"Documento cancelado"`, exceto baixar. Prova na Tarefa 2.
3. **Sessão expira no meio do lote.** O lote pausa (`parar`). Ao retomar, o item que estava em POST é `incerto` e não se repete. Prova na Tarefa 10.
4. **Fechar o modal durante a execução.** O lote pausa e fica retomável, sem continuar escondido como no legado. Prova na Tarefa 10.
5. **Senha errada.** O primeiro erro de senha pausa o lote em vez de tentar N vezes. Prova na Tarefa 6 (mapeamento) e na Tarefa 10 (pausa).

---

### Task 1: Esqueleto do pacote, marca, modal e ponte com o legado

**Files:**
- Create:
  - `acoes-lote/package.json`, `acoes-lote/build.mjs`, `acoes-lote/tsconfig.json`, `acoes-lote/biome.json`
    - Copiar do `processos-lote/`, trocando nomes, alias `@al/*` e saídas.
    - Adicionar a dependência `fflate` na mesma versão do `ferramentas-pdf/package.json`.
  - `acoes-lote/estatico/acoes-lote.html`, `acoes-lote/estatico/acoes-lote.css`
  - `acoes-lote/src/modelo/constantes.ts`
  - `acoes-lote/src/pagina/{main,marca,modal,contexto}.ts`
  - `acoes-lote/src/app/main.ts`: stub que conecta e mostra "Carregando…".
  - `acoes-lote/tests/{verificar,util,verificar-pagina}.ts`
- Modify:
  - `dist/manifest.json`: content script e `web_accessible_resources`, ao lado das entradas do processos-lote.
  - `dist/js/sei-functions-pro.js:9918` (`getDocumentosActions`).
  - `dist/js/sei-functions-pro.js:13134-13135` e `dist/js/sei-pro-arvore.js:189-190`: textos "Iniciar ações em lote" passam a "Ações em lote", sempre escapados.

**Interfaces:**
- Produces:
  - `CANAL_ACOES_LOTE = "spro-acoes-lote"`, `EVENTO_ABRIR = "spro-acoes-lote-abrir"`, `ATRIBUTO_ATIVO = "data-seipro-acoes-lote"`, `PREFIXO_STORAGE = "acoes-lote/"`.
  - `interface ContextoAcoes { host: string; login: string; nomeUsuario: string; unidadeSigla: string; temaEscuro: boolean; corTema?: string; base: string; linkArvore: string; idProcedimento: string }`
  - `contextoAcoes(doc: Document, o: { temaEscuro: boolean; corTema?: string }, url?: string): ContextoAcoes | null`: lê o `#ifrArvore[src]` da tela `procedimento_trabalhar` e devolve `null` sem login ou sem árvore.
  - `CONFIG_MODAL: ConfigModal`: título `"Ações em Lote"`, `seletorItemMenu: "#iconBatchActions"`, texto sem modal no molde do processos-lote.
  - Saídas do build: `dist/js/init_acoes_lote.js`, `dist/js/acoes-lote/app.js`, `dist/html/acoes-lote.html`, `dist/css/acoes-lote.css`.

- [ ] **Step 1: Escrever as provas que falham** em `tests/verificar-pagina.ts`:
  - `marcarAtivo` põe `data-seipro-acoes-lote="1"` no `<html>`.
  - `contextoAcoes` sobre `sei-nucleo/tests/fixtures/sei41/trabalhar.html` devolve `idProcedimento` e `linkArvore` iguais aos do `#ifrArvore` da fixture, além do login.
  - Em documento sem `#ifrArvore`, `contextoAcoes` devolve `null`.
- [ ] **Step 2: Rodar** `cd acoes-lote && npm install && npx tsx tests/verificar.ts`. Esperado: FALHA (módulos inexistentes).
- [ ] **Step 3: Implementar.**
  - `pagina/main.ts` igual ao do processos-lote, com a opção legada `"acoesemlote"` e os tratadores ainda vazios.
  - `getDocumentosActions` ganha no topo:
    ```js
    if (document.documentElement.hasAttribute('data-seipro-acoes-lote')) { document.dispatchEvent(new CustomEvent('spro-acoes-lote-abrir')); return; }
    ```
    O botão e o menu flash chamam `parent.getDocumentosActions()` de dentro do iframe da árvore, então o evento nasce na janela de cima, onde o content script ouve.
- [ ] **Step 4: Rodar** `npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && npm run build:rapido`. Esperado: tudo passa e o build lista as 4 saídas.
- [ ] **Step 5: Commit** dos arquivos acima, com a mensagem `"Acoes em Lote: esqueleto do pacote TS, modal e ponte com o legado"`.

### Task 2: Modelo dos documentos: linhas, elegibilidade, filtros e atalhos

**Files:**
- Create: `acoes-lote/src/modelo/acoes.ts`, `acoes-lote/src/modelo/documentos.ts`, `acoes-lote/src/modelo/filtros.ts`, `acoes-lote/tests/verificar-documentos.ts`

**Interfaces:**
- Consumes: `DocumentoArvore` e `Arvore` de `@nucleo/dominio/arvore`, e `ContextoAcoes` (Task 1).
- Produces:
  - `type AcaoId = "ciencia" | "excluir" | "cancelar-assinatura" | "baixar" | "alterar-nivel" | "assinar" | "duplicar" | "cancelar-documento" | "incluir-bloco" | "alterar-dados" | "mover" | "pdf"`
  - `interface DefAcao { id: AcaoId; rotulo: string; escreve: boolean; destrutiva: boolean; final: boolean; confirmar: boolean }` e `ACOES: readonly DefAcao[]`, na ordem da tabela da seção 5 da spec.
    - `final` vale `true` para excluir, cancelar-documento, mover, baixar e pdf.
    - `confirmar` vale `true` para excluir, cancelar-documento, cancelar-assinatura e mover.
  - `interface LinhaDoc { id: string; numero: string; titulo: string; tipo: string; externo: boolean; formato: string; nivel: NivelAcesso; assinado: boolean; assinaturas: string[]; cancelado: boolean; unidade: string; pasta: string | null; data?: string }`
  - `linhasDaArvore(a: Arvore): LinhaDoc[]`. O `tipo` é o título sem o número final (ex.: `"Despacho 12"` vira `"Despacho"`).
  - `type Elegibilidade = { ok: true } | { ok: false; motivo: string }`
  - `elegivel(acao: AcaoId, l: LinhaDoc, processoSigiloso: boolean): Elegibilidade`. Esta é a parte estática; o resto o SEI decide na prévia (Task 6).
  - `interface Filtro { texto?: string; tipos?: string[]; unidades?: string[]; assinatura?: "todos" | "assinados" | "nao-assinados"; nivel?: "todos" | "publico" | "restrito"; origem?: "todos" | "internos" | "externos"; de?: string; ate?: string }`
  - `filtrar(linhas: LinhaDoc[], f: Filtro): LinhaDoc[]`
  - `type Atalho = "nao-assinados-minha-unidade" | "assinados-por-mim" | "externos"`
  - `aplicarAtalho(a: Atalho, linhas: LinhaDoc[], ctx: Pick<ContextoAcoes, "unidadeSigla" | "nomeUsuario">): string[]` devolve os ids.
  - `contarPorAcao(sel: LinhaDoc[], processoSigiloso: boolean): Record<AcaoId, number>`

- [ ] **Step 1: Escrever as provas que falham** em `tests/verificar-documentos.ts`:
  - `linhasDaArvore(lerArvore(fixture arvore_completa.html))` traz a mesma contagem de documentos que `arvore.documentos.length` (Review Focus 1).
  - `elegivel("excluir", {cancelado: true})` devolve `{ ok: false, motivo: "Documento cancelado" }`, e `elegivel("baixar", {cancelado: true})` devolve `{ ok: true }` (Review Focus 2).
  - Documento ou processo sigiloso devolve `{ ok: false, motivo: "Sigiloso: fora das Ações em Lote" }` em toda ação, baixar inclusive.
  - `duplicar` em externo devolve `"Só documento interno pode ser duplicado"`.
  - `cancelar-assinatura` em documento não assinado devolve `"Documento sem assinatura"`.
  - `assinar` em documento externo devolve `"Documento externo não se assina no SEI"`.
  - Os filtros e os três atalhos sobre linhas sintéticas.
  - `contarPorAcao` bate com a soma de `elegivel`.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.** Funções puras, sem DOM.
- [ ] **Step 4: Rodar** `npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: modelo de documentos, elegibilidade e filtros"`.

### Task 3: Fila de etapas, plano por documento e lote persistido

**Files:**
- Create: `acoes-lote/src/modelo/fila.ts`, `acoes-lote/src/repositorio.ts`, `acoes-lote/tests/verificar-fila.ts`, `acoes-lote/tests/verificar-repositorio.ts`

**Interfaces:**
- Consumes: `AcaoId`, `ACOES`, `LinhaDoc`, `elegivel` (Task 2) e `Area` de `@comum/armazenamento/area`.
- Produces:
  - `type ModoLista = "acrescentar" | "remover" | "substituir"`
  - `interface ItemLista { id: string; texto: string }`
  - `type ParamsEtapa`, união discriminada por `acao`:
    - `{acao:"ciencia"}`, `{acao:"excluir"}`, `{acao:"cancelar-assinatura"}`, `{acao:"duplicar"}`
    - `{acao:"baixar"; modo:"arquivos"|"zip"}`, `{acao:"pdf"}`
    - `{acao:"alterar-nivel"; nivel:"publico"|"restrito"; hipotese?: string}`
    - `{acao:"assinar"; cargo: string}`: **sem senha**.
    - `{acao:"cancelar-documento"; motivo: string}`
    - `{acao:"incluir-bloco"; bloco: {id: string; texto: string} | {novo: string}}`
    - `{acao:"alterar-dados"; descricao?: string; observacao?: string; nivel?: "publico"|"restrito"; hipotese?: string; interessados?: {modo: ModoLista; itens: ItemLista[]}; assuntos?: {modo: ModoLista; itens: ItemLista[]}}`
    - `{acao:"mover"; destino: {protocolo: string; idProcedimento: string; tipo: string}; motivo: string}`
  - `validarFila(etapas: ParamsEtapa[]): string[]`: lista de erros, vazia quando válida.
  - `type SituacaoEtapa = "pendente" | "ok" | "pulado" | "erro" | "incerto"`
  - `interface EtapaDoc { acao: AcaoId; situacao: SituacaoEtapa; mensagem?: string; dados?: Record<string, string> }`
  - `interface PlanoDoc { doc: LinhaDoc; etapas: EtapaDoc[] }`
  - `planejar(sel: LinhaDoc[], etapas: ParamsEtapa[], processoSigiloso: boolean): PlanoDoc[]`
  - `proximaEtapa(p: PlanoDoc): number | null`: índice da primeira `pendente`, ou `null`.
  - `registrar(p: PlanoDoc, i: number, r: { situacao: SituacaoEtapa; mensagem?: string; dados?: Record<string,string> }): PlanoDoc`: imutável.
  - `interface LoteAcoes { id: string; idProcedimento: string; protocolo: string; criadoEm: number; atualizadoEm: number; aba: string; etapas: ParamsEtapa[]; planos: PlanoDoc[] }`
  - `class RepositorioAcoes { constructor(area: Area, host: string, login: string); salvar(l: LoteAcoes): Promise<void>; doProcesso(idProcedimento: string): Promise<LoteAcoes | null>; descartar(id: string): Promise<void> }`
    - Chave: `acoes-lote/andamento/<host|login>/<idProcedimento>`.

Regras de `validarFila`, com as mensagens exatas:
- Fila vazia: `"Escolha ao menos uma ação."`
- Ação repetida: `"A ação X aparece duas vezes."`
- Etapa `final` fora da última posição: `"X precisa ser a última etapa."`
- `baixar` e `pdf` juntas: `"Escolha baixar ou PDF, não os dois."`
- `alterar-nivel` e `alterar-dados` juntas: `"Use só Alterar dados para mudar o nível junto com outros campos."`
- Restrito sem hipótese: `"Nível restrito exige hipótese legal."`
- `cancelar-documento` com motivo vazio: `"Informe o motivo do cancelamento."`
- `mover` com motivo vazio: `"Informe o motivo da movimentação."`
- `assinar` sem cargo: `"Escolha o cargo da assinatura."`
- `alterar-dados` sem nenhum campo: `"Nada para alterar."`

Regras de `planejar`:
- Cada etapa nasce `pendente` ou `pulado`, com o motivo de `elegivel`.
- Depois de uma etapa `pulado` ou `erro`, as etapas seguintes daquele documento ficam `pulado`, com a mensagem `"Etapa anterior não concluída"`. `registrar` aplica a mesma regra quando grava `erro`.
- Efeito de etapa anterior: se a fila tem `assinar` antes de `cancelar-assinatura`, a elegibilidade de `cancelar-assinatura` considera o documento assinado.
- `LoteAcoes` serializa sem senha. A prova confere isso.

- [ ] **Step 1: Escrever as provas que falham:** cada mensagem de `validarFila`; `planejar` com documento cancelado mais `[alterar-nivel, assinar]` dá as duas etapas `pulado`; `registrar(erro)` na etapa 0 deixa a etapa 1 `pulado`; `proximaEtapa`; repositório com `areaMemoria`: salvar, ler por processo, descartar e `JSON.stringify(lote)` sem a chave `senha`.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc e biome. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: fila de etapas, plano por documento e lote retomavel"`.

### Task 4 (Opus): sei-nucleo — alterar dados do documento com listas e pesquisa de contatos e assuntos

**Files:**
- Modify: `sei-nucleo/src/dominio/documento.ts` (`AlteracaoDocumento`, `alterarDocumento`), `sei-nucleo/src/index.ts`
- Create: `sei-nucleo/src/dominio/lupas.ts`, `sei-nucleo/tests/verificar-documento-dados.ts`, e a fixture `sei-nucleo/tests/fixtures/sei5/documento_alterar.html`, capturada no SEI MJ na Tarefa 13. Até lá, prove com `sei41/despacho_alterar.html` e marque a prova do 5 como pendente.

**Interfaces:**
- Produces:
  - `AlteracaoDocumento` ganha:
    - `observacao?: string`
    - `interessados?: { modo: "acrescentar" | "remover" | "substituir"; itens: ItemLupa[] }`
    - `assuntos?: { modo: "acrescentar" | "remover" | "substituir"; itens: ItemLupa[] }`
  - `pesquisarContatos(sei: Sei, refDocumento: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa[]>`
  - `pesquisarAssuntos(sei: Sei, refDocumento: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa[]>`
  - Os links de autocompletar são colhidos do JS do formulário `documento_alterar` (`infraAjaxAutoCompletar(...)`). A chamada vai por `sei.ajax`.

- [ ] **Step 1: Escrever as provas que falham** com a fixture do 4.1:
  - acrescentar um interessado novo muda a lupa para `antigos + novo`, sem duplicar quem já está;
  - remover tira por `id`;
  - substituir troca a lista inteira;
  - `observacao` vazia não gera mudança;
  - a prévia (`aplicar: false`) devolve `mudancas` com antes e depois de "Interessados" e de "Assuntos", e não envia;
  - os links de autocompletar são extraídos da fixture.
- [ ] **Step 2: Rodar** `cd sei-nucleo && npx tsx tests/verificar.ts`. Esperado: FALHA.
- [ ] **Step 3: Implementar.**
  - Lupas: `form.itensLupa` e `form.definirLupa`. Os nomes dos selects (`selInteressados`, `selAssuntos`) e dos ocultos (`hdnInteressados`, `hdnAssuntos`) se confirmam na fixture.
  - Observação: campo `txaObservacoes`.
  - A recusa de sigiloso do núcleo não muda.
- [ ] **Step 4: Rodar** as provas do `sei-nucleo` inteiras e o `tsc`. Esperado: passa, sem regressão do agente.
- [ ] **Step 5: Commit**: `"sei-nucleo: alterar documento com interessados, assuntos e observacao; pesquisa de contatos e assuntos"`.

### Task 5 (Opus): sei-nucleo — duplicar, mover e gerar PDF

**Files:**
- Modify: `sei-nucleo/src/dominio/documento.ts`, `sei-nucleo/src/index.ts`
- Create: `sei-nucleo/src/dominio/moverDocumento.ts`, `sei-nucleo/src/dominio/pdfProcesso.ts`, `sei-nucleo/tests/verificar-acoes-lote.ts`
- Fixtures:
  - usar `sei41/p_procedimento_gerar_pdf.html`;
  - criar `sei41/documento_mover.html` a partir do HTML de `documento_mover.php` do SEI 5 (`/Users/phs/Develop/Git/ANTAQ/SEI/5.0.0/v5.0.0/sei/web/documento_mover.php`, lido com `iconv -f latin1`), marcada como sintética no `LEIAME`;
  - na Tarefa 13, substituir pelas capturas reais do SP e do MJ.

**Interfaces:**
- Produces:
  - `duplicarDocumento(sei: Sei, numero: string, op: OpcoesEscrita): Promise<ResultadoEscrita>`, com `dados: { idDocumento, numero }`.
    - Lê o formulário `documento_alterar` do original para obter série, descrição, número quando não é numérico, nome na árvore, interessados, assuntos, observação, nível e hipótese.
    - Cria no mesmo processo pelo fluxo de `criarDocumento`, com `rdoTextoInicial: "D"` e `txtProtocoloDocumentoTextoBase: numero`. Extraia o miolo de `criarDocumento` para uma função interna compartilhada, em vez de copiar.
    - Recusa externo com `SEI_ACAO_INDISPONIVEL`.
    - Fatos do legado: `dist/js/sei-pro-arvore.js:905-960`.
  - `resolverProcessoDestino(sei: Sei, numeroDoc: string, protocolo: string, sinal?: AbortSignal): Promise<{ idProcedimento: string; protocolo: string; tipo: string }>`
    - Usa o AJAX `protocolo_RI1023` da tela de mover (`idProcedimento=<protocolo>`), que devolve `IdProcedimento`, `ProtocoloProcedimentoFormatado` e `NomeTipoProcedimento`.
  - `moverDocumento(sei: Sei, numero: string, destino: { idProcedimento: string; protocolo: string }, motivo: string, op: OpcoesEscrita): Promise<ResultadoEscrita>`
    - Formulário `#frmDocumentoMover`, com os campos `txtProcedimentoDestino`, `hdnIdProcedimentoDestino`, `txaMotivo` e o submit `sbmMover=Mover`.
    - Sucesso: a URL de resposta traz `acao_origem=documento_mover` e `resultado=1`.
    - Link `documento_mover` colhido das ações do documento.
    - Invalida as árvores de origem e de destino.
  - `gerarPdfDocumentos(sei: Sei, refProcesso: string, idsDocumentos: string[], sinal?: AbortSignal): Promise<{ link: string; nome: string; foraDoPdf: string[] }>`
    - Formulário `#frmProcedimentoPdf`, aberto pelo link `procedimento_gerar_pdf` da árvore (`acaoNaArvore`).
    - Campos: `rdoTipo=A`, `hdnDocumentosApenas = serializarLupa(...)` e `hdnFlagGerar=1`.
    - Só entram os ids que o `documento_selecionar` da lupa oferece. Os demais vão para `foraDoPdf`.
    - O link do arquivo vem de `document.getElementById('ifrDownload').src = '<link exibir_arquivo>'` na resposta.
    - Erro de validação do SEI vira `ErroSei("SEI_VALIDACAO")`.

- [ ] **Step 1: Escrever as provas que falham:** os campos postados por cada função, capturados com o `Http` falso que as provas do núcleo já usam (ver `tests/util.ts`); a extração do link do `ifrDownload`; o duplicar, com `rdoTextoInicial=D` e `txtProtocoloDocumentoTextoBase`; a recusa de externo; a prévia sem envio.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** as provas do núcleo e o `tsc`. Esperado: passa.
- [ ] **Step 5: Commit**: `"sei-nucleo: duplicar e mover documento, PDF dos documentos escolhidos"`.

### Task 6: Executor da aba (tratadores RPC)

**Files:**
- Create: `acoes-lote/src/pagina/executor.ts`, `acoes-lote/src/sei/download.ts`, `acoes-lote/tests/verificar-executor.ts`
- Modify: `acoes-lote/src/pagina/main.ts` (liga os tratadores)

**Interfaces:**
- Consumes:
  - do núcleo, as funções da tabela da spec, seção 5;
  - das Tasks 4 e 5, `pesquisarContatos`, `pesquisarAssuntos`, `duplicarDocumento`, `moverDocumento`, `resolverProcessoDestino` e `gerarPdfDocumentos`;
  - de `@nucleo/dominio/blocos`, `listarBlocosParaInclusao`, `incluirNoBloco` e `criarBloco`;
  - `ParamsEtapa` (Task 3).
- Produces:
  - `interface ChamadasSei`: todas as funções do núcleo usadas, trocáveis nas provas, no molde de `processos-lote/src/pagina/executor.ts`.
  - `type RespostaEtapa = { situacao: "ok"; resumo: string; mudancas: ResultadoEscrita["mudancas"]; dados?: Record<string,string>; incerto?: boolean } | { situacao: "pulado" | "erro"; erro: string; parar?: boolean }`
  - `tratadoresAcoesLote(d: DepsExecutor): Record<string, Tratador>`, com os tratadores:
    - `contexto() -> ContextoAcoes`, sem `base` e sem `linkArvore`: nada com `infra_hash` vai ao app.
    - `arvore({forcar}) -> { protocolo, sigiloso, linhas: LinhaDoc[] }` — `LinhaDoc.data` (data de geração) vem do histórico do processo (`andamentos` do núcleo, eventos de geração/inclusão de documento), em melhor esforço: se o histórico falhar, as linhas vão sem data e o filtro de período fica desabilitado com o aviso `"Datas indisponíveis neste processo."`
    - `previa({etapa: ParamsEtapa, numero}) -> RespostaEtapa`: núcleo com `aplicar: false`.
    - `executar({etapa: ParamsEtapa, numero, senha?}) -> RespostaEtapa`: núcleo com `aplicar: true`.
    - `cargos({numero}) -> string[]`: prévia do `assinarDocumento` sem senha, lendo `dados.cargos`.
    - `blocos() -> {id, texto}[]`, `hipoteses({nivel}) -> {id, texto}[]`, `contatos({termo}) -> ItemLista[]`, `assuntos({termo}) -> ItemLista[]`, `destino({protocolo, numero}) -> {...}`
    - `baixarArquivo({numero}) -> RespostaEtapa`, `zipAdicionar({numero}) -> RespostaEtapa`, `zipFechar({nome}) -> RespostaEtapa`, `pdf({numeros}) -> RespostaEtapa`
    - `recarregarArvore()`, `fechar()`, `minimizar({minimizado})`

Mapeamento de erros, no molde de `processos-lote`:
- `SEI_SESSAO_EXPIRADA` e captcha: `erro` com `parar: true`.
- `SEI_SIGILOSO` e `SEI_ACAO_INDISPONIVEL`: `pulado`, com a mensagem do núcleo.
- Erro de senha na assinatura (mensagem de validação do SEI com "senha"): `erro` com `parar: true` e o texto `"Senha incorreta: o lote foi pausado para não bloquear sua conta."`.
- Falha depois do POST (não-`ErroSei` ou `CANCELADO` durante o envio): `ok` com `incerto: true` e o aviso `"O SEI não confirmou. Confira o documento antes de repetir."`.

Downloads (`sei/download.ts`): tudo na aba, com a sessão da aba.
- `baixarArquivo` busca `src` (externo: `documento_download_anexo`; interno: `documento_visualizar`, salvo como `.html`) e dispara um `<a download>` com um blob URL na janela de cima.
- `zipAdicionar` guarda os bytes num `Map` em memória. `zipFechar` monta com o `zipSync` do `fflate`, baixa e limpa o `Map`.
- `pdf` chama `gerarPdfDocumentos` e baixa o `link`.
- Nome de arquivo: `<numero> - <titulo>` sem `\/:*?"<>|`, com no máximo 120 caracteres.

- [ ] **Step 1: Escrever as provas que falham** com `ChamadasSei` falsas:
  - cada `ParamsEtapa` chama a função certa com os argumentos certos (inclusive `aplicar` true ou false);
  - sessão expirada vira `parar`;
  - senha errada vira `parar` com o texto exato (Review Focus 5);
  - `SEI_ACAO_INDISPONIVEL` vira `pulado`;
  - erro depois do envio vira `incerto`;
  - `contexto()` não contém `base` nem `linkArvore`;
  - `nomeArquivo` limpa os caracteres e corta em 120.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc, biome e build. Esperado: passa, e o gate ASCII continua ok.
- [ ] **Step 5: Commit**: `"Acoes em Lote: executor da aba (RPC), mapeamento de erros e downloads"`.

### Task 7: App — tela de seleção

**Files:**
- Create: `acoes-lote/src/app/app.ts` (estado e troca de telas), `acoes-lote/src/app/selecao.ts`, `acoes-lote/tests/verificar-app-selecao.ts`
- Modify: `acoes-lote/src/app/main.ts`, `acoes-lote/estatico/acoes-lote.css`

**Interfaces:**
- Consumes: os RPC `contexto`, `arvore` e `fechar` (Task 6); `filtrar`, `aplicarAtalho` e `contarPorAcao` (Task 2).
- Produces:
  - `type Tela = "selecao" | "configuracao" | "previa" | "execucao" | "resultado"`
  - `interface EstadoApp { ctx; protocolo; sigiloso; linhas: LinhaDoc[]; selecionados: Set<string>; filtro: Filtro; etapas: ParamsEtapa[]; planos: PlanoDoc[] }`
  - `montarSelecao(doc: Document, e: EstadoApp, acoes: { aoMudar(): void; configurar(acao?: AcaoId): void }): HTMLElement`

Comportamento:
- A tabela tem as colunas: caixa, Nº SEI, Documento, Tipo, Unidade, Data, Assinatura, Nível e Pasta.
- Acima da tabela ficam os filtros e os 3 atalhos.
- "Selecionar todos" marca só as linhas visíveis. Shift+clique seleciona uma faixa.
- A barra de ações traz um botão por ação, com o contador de elegíveis da seleção (`"Assinar (5)"`), desabilitado quando o contador é 0.
- Clicar numa ação abre a configuração com aquela ação como primeira etapa. O botão "Montar fila…" abre a configuração vazia.
- O menu da linha (⋯) lista as ações elegíveis daquele documento e abre a configuração com só ele selecionado.
- Processo sigiloso: no lugar da tabela aparece `"Este processo é sigiloso: as Ações em Lote não atuam nele."`.

- [ ] **Step 1: Escrever as provas que falham** com linkedom:
  - "Selecionar todos" com filtro ativo marca só as visíveis;
  - a faixa por Shift;
  - o contador do botão "Assinar";
  - botão desabilitado com 0;
  - o menu da linha;
  - o aviso de sigiloso.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar**, com o layout no molde de `processos-lote/src/app/` e o CSS de `sei-comum/src/ui/lista.css`.
- [ ] **Step 4: Rodar** verificar, tsc e biome. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: tela de selecao com filtros, atalhos e contadores"`.

### Task 8: App — configuração da fila

**Files:**
- Create: `acoes-lote/src/app/configuracao.ts`, `acoes-lote/tests/verificar-app-configuracao.ts`

**Interfaces:**
- Consumes: os RPC `cargos`, `blocos`, `hipoteses`, `contatos`, `assuntos` e `destino`; `validarFila` (Task 3); `criarCombo` de `@comum/ui/combobox`.
- Produces: `montarConfiguracao(doc: Document, e: EstadoApp, acoes: { voltar(): void; previa(senha?: string): void }): HTMLElement`. A senha volta por argumento e nunca entra em `EstadoApp`.

Comportamento:
- A lista de etapas pode ser reordenada (subir e descer) e cada etapa pode ser removida.
- "Adicionar etapa" só oferece as ações que ainda não estão na fila.
- Cada etapa tem os seus campos:
  - **Alterar nível:** Público ou Restrito, mais a hipótese (combo carregado por `hipoteses`).
  - **Assinar:** cargo (por `cargos` do primeiro documento elegível) e senha (`<input type="password" autocomplete="off">`).
  - **Cancelar documento:** motivo.
  - **Incluir em bloco:** bloco existente (combo) ou "Novo bloco" com descrição.
  - **Alterar dados:** descrição e observação (em branco = manter); interessados e assuntos, cada um com Acrescentar, Remover ou Substituir e um combo de busca; nível e hipótese.
  - **Mover:** número do processo de destino, resolvido ao sair do campo, mostrando protocolo e tipo; mais o motivo.
  - **Baixar:** arquivos separados ou ZIP.
- Os erros de `validarFila` aparecem acima do botão "Ver prévia", e o botão fica desabilitado enquanto houver erro.

- [ ] **Step 1: Escrever as provas que falham:**
  - fila inválida mostra as mensagens exatas da Task 3 e desabilita "Ver prévia";
  - a senha não aparece em `JSON.stringify(estado)`;
  - Substituir e Remover mostram o aviso `"Isso apaga dados dos documentos e não pode ser desfeito."`;
  - mover com destino resolvido mostra o tipo.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc e biome. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: configuracao da fila de etapas"`.

### Task 9: App — prévia e confirmação

**Files:**
- Create: `acoes-lote/src/app/previa.ts`, `acoes-lote/tests/verificar-app-previa.ts`

**Interfaces:**
- Consumes: `planejar` (Task 3); o RPC `previa`, com concorrência 3 via `ExecutorLote`; `ACOES[*].confirmar`.
- Produces: `montarPrevia(doc: Document, e: EstadoApp, acoes: { voltar(): void; executar(): void }): HTMLElement`, e `resumoConfirmacao(planos: PlanoDoc[], etapas: ParamsEtapa[]): string | null`. Este devolve `null` quando nenhuma etapa pede confirmação.

Comportamento:
- A prévia roda `previa` só para a **primeira** etapa `pendente` de cada documento. As etapas seguintes dependem do efeito da anterior, então ficam marcadas "a confirmar na execução".
- Cada linha mostra as etapas com situação e, para alterar, as mudanças campo a campo.
- Documento cujo `previa` volta `pulado` tem a etapa marcada e as seguintes puladas.
- Rodapé: `"N documentos · M etapas · K pulados"`.
- "Executar" pede confirmação quando há etapa com `confirmar`. Texto exato: `"Excluir 7 documentos? Isso não pode ser desfeito."`, com o verbo da ação e a contagem dos elegíveis. Com Substituir ou Remover em alterar dados, acrescenta `" Interessados/assuntos serão substituídos."` ou `" … removidos."`.

- [ ] **Step 1: Escrever as provas que falham:** `resumoConfirmacao` para excluir com 7 e para mover com 1; `null` só com ciência; a prévia marcando a etapa seguinte como "a confirmar na execução"; `pulado` na prévia propagando para as etapas seguintes.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc e biome. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: previa por documento e confirmacao"`.

### Task 10: App — execução, retomada e resultado

**Files:**
- Create: `acoes-lote/src/app/execucao.ts`, `acoes-lote/src/app/resultado.ts`, `acoes-lote/tests/verificar-app-execucao.ts`

**Interfaces:**
- Consumes: `ExecutorLote` e `RitmoAdaptativo` (`@comum/lote/executor`); `RepositorioAcoes`, `registrar` e `proximaEtapa` (Task 3); os RPC `executar`, `baixarArquivo`, `zipAdicionar`, `zipFechar`, `pdf`, `recarregarArvore` e `minimizar`; `montarTabelaResultado`, `copiarResultado` e `resultadoComoCsv` (`@comum/ui/tabelaResultado`).
- Produces: `executarLote(e: EstadoApp, senha: string | undefined, deps): ControleExecucao`, com `pausar()`, `continuar(senha?)`, `cancelar()`, `repetirFalhas()` e `progresso(): {feitos, total, falhas}`. Também `montarResultado(doc, e): HTMLElement`.

Comportamento:
- A unidade do `ExecutorLote` é o documento. `processar` roda as etapas pendentes daquele documento em ordem: `executar` e depois `registrar`.
- Antes de cada `executar`, a etapa é gravada como `incerto` no repositório. Depois, é regravada com o desfecho. Uma etapa `incerto` nunca se repete sozinha; ela entra no resultado como "Confira".
- `pdf` e `baixar` com ZIP rodam uma vez no fim, sobre os documentos que chegaram até ali sem falha. A situação se aplica a cada um.
- `parar` pausa o lote e mostra a mensagem.
- Fechar o modal durante a execução (evento de fechamento da ponte) pausa e salva (Review Focus 4).
- Ao abrir o app com um lote salvo para o mesmo processo, aparece `"Há um lote de Ações em Lote parado neste processo (X de N). Continuar de onde parou?"`, com Continuar e Descartar. Se houver etapa `assinar` pendente, pede a senha antes.
- Lote com `atualizadoEm` de menos de 15 s e `aba` diferente: `"Este lote pode estar rodando em outra aba."`
- Resultado:
  - uma linha por documento, com uma coluna por etapa (texto da situação mais a mensagem), link do documento e o número do duplicado quando houver;
  - Copiar (texto e HTML), CSV e "Tentar de novo só as falhas" (reabre só as etapas `erro`, nunca `incerto`);
  - `recarregarArvore()` uma vez ao terminar;
  - "Minimizar" durante a execução chama `minimizar`.

- [ ] **Step 1: Escrever as provas que falham** com RPC falso e `esperar` instantâneo:
  - sessão expirada no documento 3 de 5 pausa; o documento 3 fica `incerto` se o erro veio depois do envio; ao retomar, ele não é repetido (Review Focus 3);
  - fechar a ponte pausa e salva (Review Focus 4);
  - senha errada pausa no primeiro documento e não chama `executar` no segundo (Review Focus 5);
  - `repetirFalhas` não toca etapas `incerto`;
  - aviso de lote em outra aba;
  - o CSV traz uma coluna por etapa;
  - nenhuma gravação do repositório contém a senha.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc, biome e `npm run build`. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: execucao retomavel, pausa por sessao/senha e resultado"`.

### Task 11: Acessibilidade de teclado, temas e pente fino de integração

**Files:**
- Modify: `acoes-lote/src/app/*.ts`, `acoes-lote/estatico/acoes-lote.css`
- Test: `acoes-lote/tests/verificar-app-teclado.ts`

- [ ] **Step 1: Escrever as provas que falham:** Esc fecha (chama o RPC `fechar`) em qualquer tela, exceto durante a execução, quando pausa e pergunta; Ctrl+Enter na configuração vai à prévia e, na prévia, executa; nenhum botão "Cancelar" no DOM; o tema escuro (`#tema=escuro`) põe a classe do tema no `<html>`, como o processos-lote.
- [ ] **Step 2: Rodar** e ver falhar.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Rodar** verificar, tsc, biome e `npm run build`. Esperado: passa.
- [ ] **Step 5: Commit**: `"Acoes em Lote: teclado e temas"`.

### Task 12: Página de ajuda e build final

**Files:**
- Create: `pages/ACOESEMLOTE.md`, no molde de `pages/PROCESSOSEMLOTE.md`, com o título "Ações em Lote".
- Modify: `funcionalidades.json`, se o recurso constar dele (procure "lote"); o nome passa a "Ações em Lote" e o link aponta para a página nova.

A página explica: as 12 ações; a fila; a prévia; pausar, retomar e minimizar; que sigiloso fica de fora (mudança em relação à versão anterior); e que a senha não é guardada.

O `HISTORICO.md` **não** muda aqui: muda no release (memória `feedback_release_historico`).

- [ ] **Step 1:** Escrever a página e ajustar o catálogo.
- [ ] **Step 2: Rodar** o build de todos os pacotes tocados: `cd acoes-lote && npm run build`, `cd sei-nucleo && npx tsx tests/verificar.ts`, e as provas do `processos-lote`, que importam o núcleo. Esperado: tudo verde.
- [ ] **Step 3: Conferir** que `git diff master -- dist/manifest_seipro.json dist/manifest_v2*.json` está vazio. Conferir também que não há arquivos `"* 2.*"` (cópias do iCloud) no dist: `find dist -name "* 2.*"`.
- [ ] **Step 4: Commit**: `"Acoes em Lote: pagina de ajuda e build"`.

### Task 13 (coordenador): Validação no SEI SP (4.1.5) e no SEI MJ de homologação (5.0.4)

Roteiro da spec, seção 10, com o harness de `reference_sei_sp_treinamento`. O autor faz o login e digita a senha da assinatura.

- [ ] Capturar as fixtures reais (`documento_alterar`, `documento_mover`, `procedimento_gerar_pdf`, formulário de assinatura) nos dois SEIs, substituir as sintéticas e rodar as provas do núcleo de novo.
- [ ] Abrir pelo botão e pelo menu flash; conferir os dois temas, o Esc e o foco.
- [ ] Rodar cada uma das 12 ações nos documentos de teste, mais uma fila de 3 etapas.
- [ ] Testar pausar, cancelar, retomar depois de fechar o modal e repetir falhas.
- [ ] Testar ZIP e PDF.
- [ ] Confirmar que o legado não abre no Lab.
- [ ] Corrigir o que falhar com teste novo e commit por correção.
