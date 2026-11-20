# Comparador de Documentos em TS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refazer o Comparador de Documentos como pacote TS (`comparador-documentos/`), com o mesmo resultado visual do legado e muito mais rápido, sem travar a página.

**Architecture:** Content script na aba do SEI abre um modal em iframe (`modalIframe`) com um app próprio. A página lê A e B como HTML (um único `abrirArvore` dá a lista e o `src` de cada documento), quebra cada um em blocos folha com `DOMParser`, e manda os blocos a um Web Worker. O Worker alinha os blocos por hash (fase 1) e faz diff de palavras só nos blocos alterados (fase 2), devolvendo uma `Edicao`. A página aplica a `Edicao` sobre o DOM do documento "depois" (estrutura preservada) e sanitiza.

**Tech Stack:** TypeScript, esbuild (IIFE para o content script, ESM para o app, IIFE para o worker), `@comum/*`, `@nucleo/*`, biome, tsx + linkedom nas provas.

**Spec:** `docs/superpowers/specs/2026-11-20-comparador-documentos-ts-design.md`

**Refinamentos em relação ao desenho** (decididos ao ler o código; valem para o plano):
- Worker não tem DOM: a quebra em blocos (`DOMParser`) e a aplicação do resultado ficam na página; o Worker recebe `Bloco[]` e devolve uma `Edicao`.
- A e B são lidos igual: `abrirArvore` (já usado pelo Documentos em Lote) dá todos os documentos com `src` (`documento_visualizar`). Isso elimina as três requisições em série; o A deixa de ser lido do DOM da árvore, e o selecionado é identificado por `#ifrArvore .infraArvoreNoSelecionado` (`span<id>`), como no legado.

## Global Constraints

- Pacote `comparador-documentos/` no molde do `documentos-lote/`; aliases `@cd/*` (src do pacote), `@comum/*` (`../sei-comum/src/*`), `@nucleo/*` (`../sei-nucleo/src/*`).
- Constantes: `EVENTO_ABRIR = "spro-comparador-abrir"`, `ATRIBUTO_ATIVO = "data-seipro-comparador"`, `CANAL_COMPARADOR = "seipro-comparador"`; opção legada `comparardocumentos`; botão `#iconCompareDocs`.
- JS de `dist/` sai ASCII (`charset: "ascii"`); nunca editar `dist/js` gerado à mão (banner "GERADO por ... NAO EDITE").
- Sem jQuery, sem `innerHTML` cru, sem `onclick` no resultado; HTML do SEI só entra no iframe depois de sanitizado.
- Resultado: `<del style="background-color: #FFF0F5;color: #FF0000;">` e `<ins style="background-color: #F0F8FF;color: #0000FF;">` (valores do legado).
- Modal sem botão Cancelar (X e Esc fecham). Nome do arquivo baixado: `Comparativo <A> - <B> (<NAMESPACE_SPRO>).html`, com BOM (`﻿`) e o DOCTYPE HTML 4.01 strict do legado.
- Só documentos gerados no SEI (`externo === false`), não cancelados e não sigilosos; do mesmo processo.
- Nada do conteúdo sai do computador.
- Todo release atualiza `HISTORICO.md`. O legado só sai na Task 10, depois da validação ao vivo.
- Comandos do pacote: `npm run tipos`, `npm run verificar`, `npm run checar`, `npm run build`.

## Review Focus

- Documento vazio ou só com imagens (A, B ou os dois): comparação sem erro, "sem diferenças" quando iguais. Teste na Task 4.
- A e B são o mesmo documento: não oferece B igual ao A na lista. Teste na Task 6.
- Documento com `<script>`, `onclick` ou `javascript:` vindo do SEI: nada disso chega ao iframe do resultado. Teste na Task 4.
- Documento muito grande (milhares de blocos, tabelas aninhadas): termina e não trava; teste de tamanho na Task 3 e medição na Task 9.
- B sigiloso, cancelado ou anexo (PDF): não aparece na lista; se escolhido por corrida, mensagem de erro clara. Teste na Task 6.

---

### Task 1: Esqueleto do pacote

**Files:**
- Create: `comparador-documentos/package.json`, `tsconfig.json`, `biome.json` (copiar do `documentos-lote/`, trocando nome e o alias `@dl` por `@cd`, sem `@pl`), `build.mjs`, `src/modelo/constantes.ts`, `tests/util.ts`, `tests/verificar.ts`, `tests/verificar-constantes.ts`

**Interfaces:**
- Produces: `@cd/modelo/constantes` com `EVENTO_ABRIR`, `ATRIBUTO_ATIVO`, `CANAL_COMPARADOR`, `OPCAO_LEGADA = "comparardocumentos"`, `COR_REMOVIDO = "background-color: #FFF0F5;color: #FF0000;"`, `COR_ACRESCENTADO = "background-color: #F0F8FF;color: #0000FF;"`, `DOCTYPE_DOWNLOAD` (o `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">` do legado). `tests/util.ts` reexporta o de `sei-comum/tests/util` (`checar`, `resumo`) mais `igual`.

- [ ] **Step 1: Prova que falha** — `tests/verificar-constantes.ts` exporta `verificarConstantes()` e checa com `igual` os seis valores acima; `tests/verificar.ts` a chama e termina em `resumo()`.
- [ ] **Step 2:** Rodar `cd comparador-documentos && npm install && npm run verificar`. Esperado: falha (módulo de constantes não existe).
- [ ] **Step 3:** Criar `constantes.ts`. Criar `build.mjs` no molde do `documentos-lote/build.mjs` com três entradas: `src/pagina/main.ts` → `js/init_comparador.js` (iife), `src/app/main.ts` → `js/comparador/app.js` (esm), `src/worker/main.ts` → `js/comparador/worker.js` (iife); copia `estatico/comparador-documentos.html` para `dist/html/` e compõe `dist/css/comparador-documentos.css` de `sei-comum/src/ui/base.css` + `lista.css` + `alturaRedimensionavel.css` + `estatico/comparador-documentos.css`. Entradas cujo fonte ainda não existe são puladas com aviso (como no molde).
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar`. Esperado: tudo passa.
- [ ] **Step 5: Commit** — `git add comparador-documentos && git commit -m "Comparador TS: esqueleto do pacote (build, constantes, provas)"`

### Task 2: Blocos folha (página)

**Files:**
- Create: `comparador-documentos/src/modelo/blocos.ts`, `tests/verificar-blocos.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Produces:
  - `interface Bloco { html: string; texto: string }` (`html` = serialização do bloco; `texto` = texto normalizado: espaços colapsados, sem entidades, minúsculas não — só trim/colapso).
  - `interface DocumentoBlocos { corpo: Element; folhas: Element[]; blocos: Bloco[] }` (`folhas[i]` é o elemento de `blocos[i]`).
  - `function lerBlocos(html: string, parser?: DOMParser): DocumentoBlocos` — `parser` padrão `new DOMParser()` (nas provas, o do linkedom).

- [ ] **Step 1: Provas que falham** em `verificar-blocos.ts`, sobre HTML pequeno: (a) `<head>`, `<style>`, `<script>` e comentários não geram bloco; (b) cada `<p>`, `<li>`, `<h1..h6>`, `<td>`/`<th>` sem filho de bloco, é uma folha, na ordem do documento; (c) texto solto entre blocos vira um bloco próprio (`<div>texto<p>x</p></div>` dá dois); (d) tabela aninhada: só as folhas mais internas contam; (e) bloco só com `<img>` tem `texto === ""` e entra (a imagem conta pelo `src`: dois blocos de imagem com o mesmo `src` têm o mesmo `texto` `"[img:<src>]"`); (f) documento vazio → `blocos.length === 0` sem lançar; (g) `onclick="x"` presente no HTML de entrada não aparece em nenhum `Bloco.html`.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar `lerBlocos`: `DOMParser` `text/html`; remover `script, style, link, meta, noscript` e comentários; elementos de bloco = `p, div, li, h1-h6, td, th, blockquote, pre, caption`; folha = elemento de bloco sem descendente de bloco; texto direto de um contêiner que também tem folhas vira folha sintética (um `<span data-spro-solto>` envolvendo o trecho). Remover atributos `on*` e `href="javascript:..."` dos blocos ao serializar (a sanitização final da Task 4 é a segunda trava).
- [ ] **Step 4:** `npm run verificar`. Esperado: passa.
- [ ] **Step 5: Commit** — "Comparador TS: leitura do documento em blocos folha"

### Task 3: Diff em duas fases (puro, roda no Worker)

**Files:**
- Create: `comparador-documentos/src/modelo/alinhar.ts` (fase 1), `src/modelo/palavras.ts` (fase 2), `src/modelo/diff.ts` (junta), `tests/verificar-diff.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `Bloco` (Task 2).
- Produces:
  - `alinhar.ts`: `type Par = { antes: number; depois: number }`; `function alinharBlocos(antes: Bloco[], depois: Bloco[]): { iguais: Par[]; } ` — pares por `texto` idêntico, em ordem crescente nos dois lados (LCS sobre hashes, com poda de prefixo e sufixo iguais antes).
  - `palavras.ts`: `function diffPalavras(antesHtml: string, depoisHtml: string): string` — tokeniza em tags e palavras; mantém as tags e o texto de `depoisHtml`; palavra só do antes entra como `<del style=...>palavra</del>`, só do depois como `<ins style=...>palavra</ins>`.
  - `diff.ts`: `interface Edicao { depois: string[]; removidos: Array<{ antesDe: number; html: string }> }` e `function compararBlocos(antes: Bloco[], depois: Bloco[]): Edicao`. `depois[i]` = HTML final do bloco `i` do "depois": igual → o `html`; alterado → `diffPalavras`; sem par → `<ins style=...>html</ins>`. Entre dois pares iguais, blocos do antes e do depois nos trechos livres são pareados por semelhança (índice de Jaccard de palavras ≥ `LIMIAR_PAREAMENTO = 0.5`, guloso e em ordem) para a fase 2; antes sem par → `removidos` com `html` embrulhado em `<del style=...>`, `antesDe` = índice do próximo bloco do depois (`depois.length` se no fim).

- [ ] **Step 1: Provas que falham** em `verificar-diff.ts`: (a) listas idênticas → `depois` igual aos `html`, `removidos` vazio; (b) bloco inserido no meio → só ele com `<ins`; (c) bloco removido → um `removidos` com `antesDe` certo e `<del`; (d) uma palavra trocada dentro de um parágrafo → `<del>` da velha e `<ins>` da nova no mesmo bloco, resto intacto; (e) inverter antes/depois troca del por ins; (f) listas vazias nos dois lados e só de um lado; (g) 5.000 blocos com 5% alterados termina em menos de 1 s (`performance.now`); (h) blocos repetidos (10 parágrafos iguais) não produzem pares cruzados (índices crescentes).
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar. `alinharBlocos`: poda prefixo/sufixo, LCS clássico por programação dinâmica no miolo restante (com mapa de posições por hash para reduzir; se `miolo.antes * miolo.depois > 4_000_000`, usar a variante de Hunt–Szymanski/janela de ancoragem por blocos únicos e recursão nos intervalos). `diffPalavras`: LCS de palavras com a mesma poda. O custo só cresce com o que mudou.
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar`. Esperado: passa.
- [ ] **Step 5: Commit** — "Comparador TS: diff em duas fases (blocos por hash, depois palavras)"

### Task 4: Aplicar a Edicao e sanitizar (página)

**Files:**
- Create: `comparador-documentos/src/modelo/resultado.ts`, `tests/verificar-resultado.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `DocumentoBlocos`, `Edicao`.
- Produces: `function montarResultado(depois: DocumentoBlocos, ed: Edicao, doc: Document): string` — devolve o HTML completo do documento resultado (`<html><head><meta charset>...<body>...`), a partir do corpo do "depois": cada folha `i` recebe `ed.depois[i]`; cada `removidos` entra antes da folha `antesDe` (ou no fim do corpo). Depois sanitiza: remove `script`, atributos `on*`, `javascript:` e imagens com `src` repetido (mantém a primeira, como o legado). `function semDiferencas(ed: Edicao): boolean`.

- [ ] **Step 1: Provas que falham:** (a) folha alterada aparece no lugar certo, estrutura de tabela preservada; (b) removido aparece na posição de `antesDe`; (c) `<script>`, `onclick` e `href="javascript:"` do documento de entrada não aparecem na saída; (d) duas `<img>` de mesmo `src` → uma só; (e) documentos vazios nos dois lados → HTML válido e `semDiferencas` verdadeiro; (f) `semDiferencas` falso quando há `<ins`/`<del`.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar com a DOM API (`template`/`insertAdjacentHTML` só sobre fragmento sanitizado, nunca `innerHTML` do corpo da extensão); o `doc` vem de fora (DOMParser da página; linkedom nas provas).
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar`. Esperado: passa.
- [ ] **Step 5: Commit** — "Comparador TS: monta o resultado sobre o documento depois, sanitizado"

### Task 5: Worker e cliente com plano B

**Files:**
- Create: `comparador-documentos/src/worker/main.ts`, `src/app/trabalhador.ts`, `tests/verificar-trabalhador.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `compararBlocos`, `Bloco`, `Edicao`.
- Produces: no worker, mensagem de entrada `{ id: number; antes: Bloco[]; depois: Bloco[] }`, saída `{ id; ok: true; edicao: Edicao } | { id; ok: false; erro: string }` (`self.onmessage`). Em `trabalhador.ts`: `interface Comparador { comparar(antes: Bloco[], depois: Bloco[], sinal?: AbortSignal): Promise<Edicao>; encerrar(): void }` e `function criarComparador(url: string, criar?: (url: string) => Pick<Worker, "postMessage" | "terminate" | "onmessage" | "onerror">): Comparador`. Se `criar` lançar, ou o worker disparar `onerror` antes de responder, cai no plano B: `compararBlocos` direto na thread, cedendo a thread entre as fases (`await new Promise(r => setTimeout(r))`), e marca `comparador.modo` (`"worker" | "fatias"`).

- [ ] **Step 1: Provas que falham** com um Worker falso: (a) resposta ok devolve a `Edicao`; (b) `ok:false` rejeita com o texto; (c) `criar` lançando → resultado igual pelo plano B e `modo === "fatias"`; (d) `onerror` → plano B; (e) `AbortSignal` abortado rejeita com `AbortError` e chama `terminate`; (f) duas comparações seguidas usam `id` diferentes e não se misturam.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar. A URL do worker é `chrome.runtime.getURL("js/comparador/worker.js")` (passada pelo app); o `build.mjs` já o gera.
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar && npm run build:rapido`. Esperado: passa e gera `dist/js/comparador/worker.js` em ASCII.
- [ ] **Step 5: Commit** — "Comparador TS: worker de comparacao com plano B em fatias"

### Task 6: Acesso ao SEI (lista, conteúdo, criar documento)

**Files:**
- Create: `comparador-documentos/src/sei/documentos.ts`, `src/sei/criar.ts`, `src/pagina/contexto.ts` (copiar de `documentos-lote/src/pagina/contexto.ts`, acrescentando `idDocumentoSelecionado: string | null` e `tituloSelecionado: string`), `tests/verificar-sei.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `abrirArvore(http, link): Promise<Arvore>` e `DocumentoArvore` (`@nucleo/dominio/arvore`), `Sei`, `criarDocumento`/`NovoDocumento`/`tiposDocumento` (`@nucleo/dominio/documento`), `editarSecoes` (`@nucleo/dominio/editor`), padrão de `documentos-lote/src/sei/criar.ts`.
- Produces:
  - `interface Candidato { id: string; numero: string; titulo: string; src: string }`
  - `function listarCandidatos(arvore: Arvore, excluirId: string | null): Candidato[]` — só `!externo && !cancelado && nivel !== "sigiloso" && src`, sem o `excluirId`.
  - `function lerHtml(sei: Sei, c: Candidato): Promise<string>` — `sei.http.obter(c.src)`; erro de sessão/recusa vira `ErroSei` com texto em português.
  - `function tiposParaCriar(sei: Sei, processo: string): Promise<Array<{ id: string; nome: string }>>`.
  - `function criarComparativo(sei: Sei, p: { processo: string; tipoId: string; html: string }): Promise<{ idDocumento: string; numero: string }>` — cria o documento do tipo e grava `html` como conteúdo único (reaproveitando o fluxo do Documentos em Lote: `criarDocumento` + `editarSecoes`).
  - `contextoComparador(doc, tema, url): ContextoComparador | null` (mesmo molde do `contextoDocumentos`).

- [ ] **Step 1: Provas que falham** com fixtures de árvore (reaproveitar `documentos-lote/tests/fixtures`): (a) `listarCandidatos` tira externos, cancelados, sigilosos e o documento A; (b) árvore sem candidatos → lista vazia; (c) `lerHtml` com `Sei` falso devolve o HTML; recusa/sessão expirada → `ErroSei` com mensagem; (d) `criarComparativo` chama `criarDocumento` com o `tipoId` e grava o HTML (espiões); (e) `contextoComparador` acha o selecionado em `#ifrArvore` fixture com `span<id>` com classe `infraArvoreNoSelecionado`, e devolve `null` sem login.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar conforme as assinaturas.
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar`. Esperado: passa.
- [ ] **Step 5: Commit** — "Comparador TS: lista de candidatos, leitura e criacao do documento comparado"

### Task 7: Content script (aba do SEI)

**Files:**
- Create: `comparador-documentos/src/pagina/main.ts`, `src/pagina/modal.ts`, `src/pagina/marca.ts`, `src/pagina/executor.ts`, `tests/verificar-pagina.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `criarControleModal`, `ligarAvisoSemModal`, `ConfigModal` (`@comum/ui/modalIframe`), `lerOpcaoLegada`, `manterTemaNoContexto`, `Sei`, Task 6.
- Produces: `CONFIG_MODAL: ConfigModal = { evento: EVENTO_ABRIR, titulo: "Comparar Documentos", atributoIframe: "data-spro-comparador-modal", seletorItemMenu: "#iconCompareDocs", classeAviso: "spro-comparador-aviso", textoSemModal: "Não foi possível abrir o Comparador de Documentos nesta tela. Recarregue a página (F5) e tente de novo." }`; `marcarAtivo(doc)` põe `ATRIBUTO_ATIVO` no `<html>` de forma síncrona; `tratadoresComparador(deps): Record<string, Tratador>` com os pedidos RPC do app: `contexto` (devolve `{ tituloA, idA, origem, host }` sem `base`/`infra_hash`), `candidatos` (`Candidato[]` sem `src`; a aba guarda o `src` por id), `conteudo` (`{ id }` → `{ html }`, usa `lerHtml`), `tipos`, `criar` (`{ tipoId, html }` → `{ numero }`, depois recarrega a árvore), `fechar`, `minimizar`.
- Ligar a opção: só com `comparardocumentos` ligada (`armarSeLigado` do molde); sem opção/contexto, o clique mostra o aviso.

- [ ] **Step 1: Provas que falham** (molde de `documentos-lote/tests/verificar-pagina.ts`): (a) `marcarAtivo` põe o atributo; (b) `armarSeLigado` não arma com a opção desligada e chama `semOpcao`; (c) `candidatos` não devolve `src` nem `infra_hash` na ponte; (d) `conteudo` de id fora da lista é recusado; (e) `criar` chama a recarga da árvore depois de criar; (f) `contexto` sem documento selecionado devolve `idA: null`.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar no molde de `documentos-lote/src/pagina/*`.
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar && npm run build:rapido`. Esperado: passa e gera `dist/js/init_comparador.js` ASCII.
- [ ] **Step 5: Commit** — "Comparador TS: content script e tratadores da aba"

### Task 8: App do modal (interface)

**Files:**
- Create: `comparador-documentos/estatico/comparador-documentos.html`, `estatico/comparador-documentos.css`, `src/app/main.ts`, `src/app/app.ts`, `tests/verificar-app.ts`; chamar em `tests/verificar.ts`

**Interfaces:**
- Consumes: `esperarConexaoDaAba`, `criarAbrirModal`, `baixar`, `h`, `combobox` (`@comum/ui/combobox`), `alturaRedimensionavel`, `acompanharTemaDoPainel`, Tasks 3 a 7.
- Produces: `class AppComparador` (molde `AppDocumentosLote`) com: A fixo (rótulo "A: <título>"; sem seleção, o aviso "Nenhum documento selecionado na árvore do processo"); combobox "Documento B" (busca por texto, acentos ignorados); botão "Inverter (A/B → B/A)" (`aria-pressed`); área do resultado dentro de um `iframe` `sandbox` sem scripts, altura `alturaRedimensionavel`; estado de carregando com o spinner do tema; rodapé com "Baixar" e "Criar Novo Documento" (este abre um modal com a combobox "Tipo do documento" e o botão "Criar"; sem Cancelar). Cache `Map<id, string>` de HTML por documento; inverter e reescolher não refazem requisições. Dispara a leitura de A e a lista de candidatos em paralelo ao abrir. Erro de leitura/sessão: mensagem no lugar do resultado, sem fechar o modal. "Baixar": `DOCTYPE_DOWNLOAD` + HTML do resultado, `Blob(["﻿", ...])`, nome conforme as Constraints. Mede e expõe (`window.__sproComparadorTempos`, só em console de depuração) os tempos `{ lerB, blocos, diff, montar }` em ms.

- [ ] **Step 1: Provas que falham** (linkedom, Worker falso, ponte falsa, como `verificar-app-*.ts` do molde): (a) abre com A e lista; B escolhido gera resultado com `<ins`/`<del`; (b) sem diferenças mostra "Os dois documentos são iguais."; (c) inverter reaproveita o cache (nenhum pedido `conteudo` novo) e troca ins/del; (d) sem A, mostra o aviso e desabilita a comparação; (e) erro de `conteudo` mostra a mensagem e mantém o modal; (f) "Baixar" cria Blob com BOM e o nome `Comparativo A - B (...)`; (g) "Criar Novo Documento" exige tipo escolhido e chama `criar` uma vez; (h) Esc e X fecham (pedem `fechar`); não existe botão "Cancelar" no DOM.
- [ ] **Step 2:** `npm run verificar`. Esperado: falha.
- [ ] **Step 3:** Implementar. HTML do app com `#app`; CSS compõe `base.css`/`lista.css`/`alturaRedimensionavel.css` do `@comum` mais o próprio (temas claro/escuro, como os outros módulos).
- [ ] **Step 4:** `npm run verificar && npm run tipos && npm run checar && npm run build`. Esperado: passa; gera `dist/html/comparador-documentos.html`, `dist/css/comparador-documentos.css`, `dist/js/comparador/app.js` (ASCII).
- [ ] **Step 5: Commit** — "Comparador TS: app do modal (A fixo, B pesquisavel, inverter, baixar, criar)"

### Task 9: Integração e validação ao vivo

**Files:**
- Modify: todos os `dist/manifest*.json` que listam `init_documentos_lote.js` (`grep -ln init_documentos_lote dist/manifest*.json`: acrescentar o `js/init_comparador.js` com os mesmos `matches`, `all_frames`, `run_at`, e os quatro itens de `web_accessible_resources`: `html/comparador-documentos.html`, `js/comparador/app.js`, `js/comparador/worker.js`, `css/comparador-documentos.css`), `tools/patch-manifests.mjs` se o gerador de manifests os cria, `sei-comum/src/ponte/rele.ts` (acrescentar `"seipro-comparador"` à lista de canais do relé do Firefox), `tools/gerar-pacote-firefox.mjs` (módulo `js/init_comparador.js`, marca `data-seipro-comparador`), `dist/js/sei-functions-pro.js` (em `initDialogCompareDocs`: se `document.documentElement.hasAttribute('data-seipro-comparador')`, `document.dispatchEvent(new CustomEvent('spro-comparador-abrir')); return;` — o molde está em `initDocLoteModalSelecaoDoc`, linha ~13509; lembrar que acentos em `dist/js` são `\uXXXX`)
- Create: `comparador-documentos/tests/medir.md` (resultado das medições)

- [ ] **Step 1:** Fazer as edições acima; `cd sei-comum && npm run verificar` (a prova do relé deve passar com o canal novo) e `cd ../comparador-documentos && npm run build`.
- [ ] **Step 2:** Validar ao vivo no Chrome for Testing (portas e perfis da memória: SEI SP 4 na 9444, login de teste; ANTAQ SEI 5 conforme `reference_chrome_teste_porta_9555.md`). Em cada um: abrir processo com ao menos dois documentos gerados no SEI, selecionar A na árvore, clicar `#iconCompareDocs`, escolher B, conferir cores e estrutura; Inverter; Baixar (conferir BOM e nome); Criar Novo Documento (conferir que o documento aparece na árvore); abrir sem selecionar nada (aviso); documento sigiloso e PDF não aparecem na lista; console sem erro. Se o `documento_visualizar` do B não vier por `src` em alguma versão, registrar e ajustar `lerHtml`.
- [ ] **Step 3:** Medir legado × novo nos mesmos dois documentos, um curto e um longo com tabelas, nos dois SEIs: tempo até o resultado, tarefas longas (`PerformanceObserver` `longtask`) na thread principal e na do app. Para o legado, o botão original (antes da Task 10, com o marcador `data-seipro-comparador` removido do `<html>` para forçar o caminho antigo). Anotar em `tests/medir.md`. Critério: novo claramente mais rápido nos dois documentos e sem tarefa longa > 200 ms na página.
- [ ] **Step 4:** Conferir o Firefox: `node tools/gerar-pacote-firefox.mjs` sem erro e `web-ext lint` (ou o comando de lint do projeto, ver `project_dom_seguro_firefox.md`) limpo; app abre pelo relé.
- [ ] **Step 5: Commit** — "Comparador TS: manifests, rele do Firefox, gatilho do legado e medicoes"

### Task 10: Remoção do legado, documentação e release

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (remover `initDialogCompareDocs`, `invertCompareDoc`, `openDialogCompareDocs`, `getNewDocCompareDocs`, `getCompareDocs` e, se ninguém mais usar, `getContentDocSEI`, `decodeHtml`; manter `insertIconCompareDocs`/`appendIconCompareDocs`, que ainda desenham o botão e disparam o evento — o botão chama `parent.initDialogCompareDocs`, então substituir essa função por um stub que só dispara o evento ou o aviso, como `initDocLoteModalSelecaoDoc` faz), `dist/js/init.js:49` e `dist/js/lib/diff2html.min.js` (remover o `$.getScript` e o arquivo se `htmldiff` não for usado em outro lugar: `grep -rn "htmldiff" dist`), `pages/COMPARARDOCUMENTOS.md`, `HISTORICO.md`, versão nos manifests (seguir o padrão do último release `8fb5c400`)
- Modify (se existirem referências): `tools/fora-do-escopo.json`, `tools/gerar-pacote-firefox.mjs`

- [ ] **Step 1:** `grep -rn "CompareDoc\|htmldiff\|diff2html" dist tools funcionalidades.json` e confirmar que nada além do que se remove ainda os usa.
- [ ] **Step 2:** Fazer as remoções; rodar os portões de build do projeto (`node tools/check-dom-injection.mjs`, `node tools/escape-nonascii.mjs` ou os mesmos que o último release usou, ver `git show 8fb5c400 --stat`) e `cd comparador-documentos && npm run build`.
- [ ] **Step 3:** Repetir os fluxos principais da Task 9 Step 2 no SEI SP 4 e no ANTAQ 5 (abrir, comparar, inverter, baixar, criar) e conferir o console sem erros; Firefox lint limpo.
- [ ] **Step 4:** `pages/COMPARARDOCUMENTOS.md`: revisar "Como usar" (a lista de B tem busca, o resultado é redimensionável) e "Bom saber" (mais rápido, o cálculo acontece em segundo plano no computador). `HISTORICO.md`: entrada do release (memória `feedback_release_historico.md`).
- [ ] **Step 5: Commit** — "Versao 3.9.x: Comparador de Documentos em TS (diff em duas fases, em segundo plano); remove o legado e o htmldiff"
