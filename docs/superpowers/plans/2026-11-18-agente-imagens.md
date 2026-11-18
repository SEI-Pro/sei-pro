# Agente de IA: figuras dos documentos — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O agente passa a saber onde há figura nos documentos que lê e, com a permissão do usuário, a enxergá-la por uma chamada de visão isolada (`ver_imagem`).

**Architecture:** Detecção pura e local (matriz de transformação das operações do pdf.js; `<img data:>` do HTML do SEI) gera marcas no texto do `documento_ler`. A ferramenta `ver_imagem` busca o documento de novo, recorta a figura no painel, pede permissão com miniatura e chama o modelo com visão sem ferramentas. O painel injeta recorte, descrição e checagem de visão pelo contexto da ferramenta, no mesmo padrão do `delegar`.

**Tech Stack:** TypeScript, esbuild, pdf.js 6.3.289 (das Ferramentas de PDF), canvas do navegador, linkedom e tsx nos testes.

**Spec:** [docs/superpowers/specs/2026-11-18-agente-imagens-design.md](../specs/2026-11-18-agente-imagens-design.md)

## Global Constraints

- Nenhuma imagem sai do computador sem o usuário ver a miniatura e permitir. A imagem nunca entra no histórico do motor, que continua `content: string`.
- A chamada de visão vai com `tools: []`. A descrição volta por `varrer` + `envelopar`, como conteúdo de documento.
- `ver_imagem` fica fora do agente auxiliar (`delegar`) e das rotinas.
- Documento sigiloso: recusa. Documento restrito: `consentirRestrito`, como no `documento_ler`.
- Filtros iniciais:
  - área < 3% da página ou os dois lados < 72 pt → descarta;
  - mesma caixa (±2 pt) em ≥ 3 páginas, inteira nos 15% de cima ou de baixo da página → descarta;
  - caixas que se tocam ou se sobrepõem → uma figura;
  - imagem ≥ 80% da página → página digitalizada (com ou sem camada de texto), nunca figura;
  - `<img>` com os dois lados declarados < 48 px → descarta.
- Detecção no `documento_ler`: primeiras 60 páginas (o teto de 5 s caiu na revisão final; ver o spec).
- "Enviar as imagens desta conversa" não vale para documento restrito, nem atravessa sessão restaurada ou sincronização.
- Recorte: margem de 2%, lado maior ≤ 1536 px, JPEG com qualidade 0,85.
- Ids de figura: `p{pagina}-{indice}` (de cima para baixo, a partir de 1), `p{pagina}`, `img-{n}` (n-ésima `<img src="data:image/...">` do documento, contando também as descartadas), `arquivo`.
- Marcas com o texto exato do spec (incluindo as da seção "Decisões tomadas depois da revisão"): `[possível figura desenhada na página 3 (legenda "Gráfico 2 – …"); para ver: ver_imagem figura "p3"]`, `[páginas 6–200 digitalizadas sem texto reconhecido; para ver uma: ver_imagem figura "pN"]`, `[figuras não procuradas a partir da página 61]`, `[figura p3-1: imagem na página 3, cerca de 40% da página; para ver: ver_imagem]`, `[página 7 digitalizada sem texto reconhecido; para ver: ver_imagem figura "p7"]`, `[figura img-1: imagem no corpo do documento, 640×480 px; para ver: ver_imagem]`, `[imagem externa ao documento, não lida]`, `[arquivo de imagem; para ver: ver_imagem figura "arquivo"]`.
- Os testes rodam em Node 20 (`npm run verificar` em `agente-ia/`, `npx tsx tests/verificar.ts` em `sei-nucleo/`). Nada que dependa do pdf.js real entra na suíte.
- Em `dist/js/*.js`, acentos como `\uXXXX`. Os bundles só são gerados no release.
- No clone compartilhado, `git add` só por caminho explícito.

## Review Focus

1. **PDF que o pdf.js não abre a lista de operações** (protegido, corrompido, fonte faltando): a leitura do texto segue igual, só sem marcas. → teste na Tarefa 3.
2. **Numeração diferente entre a marca e o recorte:** o modelo pede `p3-1` e o recorte pega outra figura. As duas pontas usam a MESMA função (`figurasDoDocumento`). → teste na Tarefa 5.
3. **Página girada** (`/Rotate 90`, comum em planta e tabela larga): o retângulo em PDF precisa virar o retângulo certo em pixels. → teste na Tarefa 5.
4. **Usuário cancela no meio** (Parar durante o cartão ou durante a chamada de visão): não chama o provedor, ou descarta a resposta e não soma gasto fantasma. → teste na Tarefa 6.
5. **Serviço do órgão com modelo sem visão** (400 com texto livre): vira o recado de "modelo não enxerga imagem", não um erro cru. → teste na Tarefa 1.

---

### Task 1: Mensagem com imagem, visão no catálogo e recado de modelo sem visão

**Files:**
- Modify: `agente-ia/src/motor/tipos.ts` (união `Mensagem`)
- Modify: `agente-ia/src/motor/provedor.ts` (`ModeloDisponivel`, `listarModelos`, novas funções)
- Test: `agente-ia/tests/verificar-provedor.ts`

**Interfaces:**
- Produces:
  - `type ParteConteudo = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }`;
  - na união, `{ role: "user"; content: string | ParteConteudo[] }`;
  - `ModeloDisponivel.imagem: boolean | null` (`null` = o serviço não informa);
  - `aceitaImagem(o: { servico: Servico; modelo: string; fetch?: typeof fetch }): Promise<boolean | null>`: OpenRouter consulta `/models` público, com cache em memória por sessão; demais serviços → `null`;
  - `ehErroDeImagem(status: number, corpo: string): boolean`.

- [ ] **Step 1: Write the failing tests** — seção `"provedor: imagens"`:
  - catálogo falso com `architecture.input_modalities: ["text","image"]` → `imagem === true`; `["text"]` → `false`; serviço `openai` → `null`;
  - `aceitaImagem` com `fetch` falso: duas chamadas fazem um fetch só (cache);
  - `ehErroDeImagem(400, '{"error":{"message":"This model does not support image input"}}') === true`, idem para "vision", "modalit", "image_url"; `ehErroDeImagem(400, "context length exceeded") === false`; `ehErroDeImagem(500, "image") === false`;
  - um pedido com `content` em partes chega ao corpo do `fetch` com as partes intactas, e `comCache` e `limparAssinaturasDeOutro` não lançam com ele.
- [ ] **Step 2:** `cd agente-ia && npm run verificar` → FALHA nos novos.
- [ ] **Step 3:** Implementar. `ehErroDeImagem`: status 4xx e corpo casando `/image|vision|modalit|multimodal/i`. Na `mensagemDeErro`, se `ehErroDeImagem`, devolver "O modelo escolhido não enxerga imagem. Escolha um modelo com visão em Configuração (o modelo auxiliar basta)."
- [ ] **Step 4:** `npm run verificar` e `npx tsc --noEmit` → 0 falhas.
- [ ] **Step 5:** Commit (`agente-ia/src/motor/tipos.ts agente-ia/src/motor/provedor.ts agente-ia/tests/verificar-provedor.ts`).

### Task 2: Detecção pura das figuras de PDF

**Files:**
- Create: `agente-ia/src/painel/figuras.ts`
- Test: `agente-ia/tests/verificar-figuras.ts` (registrar em `tests/verificar.ts`)

**Interfaces:**
- Produces:
  - `interface Caixa { x: number; y: number; largura: number; altura: number }`, em pontos PDF, origem embaixo à esquerda;
  - `interface PaginaVista { n: number; largura: number; altura: number; caixas: Caixa[]; camada: boolean; ocrLeu: boolean }`;
  - `interface Figura { id: string; pagina: number; caixa: Caixa; fracao: number }`;
  - `caixasDasImagens(fnArray: number[], argsArray: unknown[][], OPS: Record<string, number>): Caixa[]`;
  - `figurasDoDocumento(paginas: PaginaVista[]): { figuras: Figura[]; paginasSemTexto: number[] }`;
  - `marcaDeLegenda(pagina: number, legenda: string): string` e `LEGENDA = /^(Figura|Gráfico|Mapa|Imagem|Foto|Fotografia|Ilustração|Quadro|Diagrama|Fluxograma)\s*(n[ºo°.]\s*)?\d+/i`;
  - `marcaDeIntervalo(paginas: number[]): string`, que agrupa páginas seguidas, como `faixas` faz em `anexo.ts`;
  - `marcaDeFigura(f: Figura): string`, `marcaDePagina(n: number): string`;
  - `lerIdFigura(id: string): { tipo: "figura"; pagina: number; indice: number } | { tipo: "pagina"; pagina: number } | { tipo: "html"; indice: number } | { tipo: "arquivo" } | null`.

- [ ] **Step 1: Write the failing tests** (`verificarFiguras`):
  - **matriz:** `transform [300,0,0,200,100,300]` + `paintImageXObject` → `{x:100,y:300,largura:300,altura:200}`;
  - **pilha:** `save`, `transform` de escala 2, `restore` antes da imagem → a escala não vale;
  - **forma:** `paintFormXObjectBegin` com matriz `[1,0,0,1,50,50]` desloca a imagem dentro dela, e `paintFormXObjectEnd` desfaz;
  - **rotação e espelho:** rotação de 90° e escala negativa dão caixa de largura e altura positivas;
  - **pequenas:** em A4 (595×842), imagem de 30×30 → descartada; imagem de 300×200 → `fracao ≈ 0,12`;
  - **repetidas:** caixa de cabeçalho (inteira nos 15% de cima) repetida ±2 pt em 3 páginas → nenhuma figura dela; em 2 páginas → fica. Uma foto no meio da página, repetida na mesma posição em 5 páginas (relatório fotográfico), → 5 figuras;
  - **fatias:** três fatias de 300×60 empilhadas que se tocam → 1 figura com a caixa que as envolve;
  - **ordem:** duas figuras na página 3, a de cima recebe `p3-1`;
  - **página digitalizada:** imagem ≥ 80% → nunca figura. Com `camada: false` e `ocrLeu: false`, entra em `paginasSemTexto`. Com `camada: true` (escaneado com OCR) ou `ocrLeu: true`, não entra;
  - **intervalo:** `marcaDeIntervalo([6,7,8,10])` → `[páginas 6–8, 10 digitalizadas sem texto reconhecido; para ver uma: ver_imagem figura "pN"]`; página única → `[página 7 digitalizada sem texto reconhecido; para ver: ver_imagem figura "p7"]`;
  - **legenda:** `LEGENDA` casa "Gráfico 2 – Movimentação", "Figura nº 3" e "FOTO 1"; não casa "Figura de linguagem" nem "Quadro de pessoal";
  - **marca:** `marcaDeFigura` de uma figura `p3-1` com `fracao 0,4` dá exatamente a marca do Global Constraints; `marcaDePagina(7)` também;
  - **ids:** `lerIdFigura("p3-1")`, `("p7")`, `("img-2")`, `("arquivo")` devolvem os quatro tipos; `("x")` e `("p0")` devolvem `null`.
- [ ] **Step 2:** `npm run verificar` → FALHA (módulo ausente).
- [ ] **Step 3:** Implementar. A matriz é multiplicada em `transform` (m × n) e em `paintFormXObjectBegin` (args[0]). A caixa da imagem é o envoltório dos quatro cantos do quadrado unitário pela matriz. A fração arredonda para 5% na marca ("cerca de 40%").
- [ ] **Step 4:** `npm run verificar` → 0 falhas.
- [ ] **Step 5:** Commit.

### Task 3: Leitura do PDF com marcas

**Files:**
- Modify: `agente-ia/src/painel/pdf.ts` (`paginasDeTexto`, `textoDoPdf`, `extrairTextoPdf`)
- Modify: `agente-ia/src/painel/figuras.ts` (montagem)
- Test: `agente-ia/tests/verificar-figuras.ts`

**Interfaces:**
- Consumes: `caixasDasImagens` e `figurasDoDocumento` (Tarefa 2).
- Produces:
  - `interface LinhaLida { texto: string; y: number }`;
  - `textoDaPaginaComMarcas(linhas: LinhaLida[], figuras: Figura[]): string`: a marca entra antes da primeira linha cujo `y` fica abaixo do topo da figura (`caixa.y + caixa.altura`); sem linhas, ela vai no fim;
  - `rodapeDeFiguras(total: number): string`, que dá `"[documento com N figura(s) marcada(s)]"` e `""` para 0;
  - `textoDaPaginaComMarcas` também marca por legenda (`marcaDeLegenda`) quando a página não tem figura marcada, logo depois da linha da legenda;
  - orçamento: `paginasVistasDoPdf(bytes, { maxPaginas: 60, maxMs: 5000 })` para de procurar caixas ao passar de um dos dois. O texto segue sendo lido até `LIMITE_PAGINAS`, e as páginas não vistas recebem `[figuras não procuradas a partir da página N]` uma vez.
  - `extrairTextoPdf` mantém a assinatura e passa a devolver o texto com as marcas e o rodapé.

- [ ] **Step 1: Write the failing tests:**
  - linhas com y 780/500/200 e figura de y 300 a 500 → a marca sai entre a linha 780 e a de 500;
  - página sem figura com a linha "Gráfico 2 – Movimentação" → a marca de legenda sai logo depois dela; página COM figura marcada → sem marca de legenda;
  - orçamento: com `maxPaginas: 2` e 4 páginas → caixas só nas 2 primeiras e a marca "[figuras não procuradas a partir da página 3]";
  - figura sem nenhuma linha abaixo → a marca vai no fim;
  - `rodapeDeFiguras(0) === ""`.
  - **Review Focus 1:** a parte que junta texto e caixas recebe uma função de caixas que lança erro. O texto da página volta idêntico ao de antes e sem marca. A coleta das caixas fica em `try/catch`, por página.
- [ ] **Step 2:** `npm run verificar` → FALHA.
- [ ] **Step 3:** Implementar. Em `paginasDeTexto`:
  - guardar o `y` de cada linha (`transform[5]` do primeiro item da linha);
  - pegar `page.view` para largura e altura;
  - chamar `page.getOperatorList()` (com `try/catch`) e `caixasDasImagens(..., pdfjs.OPS)`.

  O `ocrLeu` vem do resultado do OCR em `extrairTextoPdf`: a página está entre `paginasProcessadas` e tem texto.
- [ ] **Step 4:** `npm run verificar` → 0 falhas.
- [ ] **Step 5: Conferência real em Node 22** (fora da suíte):
  - montar com `@cantoo/pdf-lib` um PDF de texto + figura 300×200 + logotipo 30×30 repetido em 3 páginas;
  - rodar `extrairTextoPdf` com `~/.nvm/versions/node/v22.22.3/bin/node`, num script na pasta temporária, com polyfill nenhum;
  - esperado: uma marca `p1-1`, nenhuma do logotipo, e o rodapé.
- [ ] **Step 6:** Commit.

### Task 4: Marcas de imagem no documento do editor do SEI

**Files:**
- Modify: `sei-nucleo/src/dominio/editor.ts` (`textoDoHtmlComOcultos`)
- Modify: `agente-ia/src/ponte/operacoes.ts` (`documento.ler`)
- Test: `sei-nucleo/tests/` (a suíte que já testa `textoDoHtmlComOcultos`) e `agente-ia/tests/verificar-ponte.ts`

**Interfaces:**
- Produces:
  - `textoDoHtmlComOcultos(html: string, o?: { marcarImagens?: boolean }): { texto: string; ocultos: …; imagens?: number }`, onde `imagens` conta as `data:` marcadas;
  - `imagemDoHtml(html: string, indice: number): { tipo: string; base64: string } | null`, com o `indice` começando em 1 e contando todas as `<img src="data:image/...">`;
  - `documento.ler` com `{ numero, marcarImagens: true }` → texto com as marcas;
  - `documento.ler` com `{ numero, imagemHtml: n }` → `{ ...meta, imagem: { tipo, base64 } }` ou erro `SEI_FIGURA_INEXISTENTE`;
  - para arquivo `image/*`, `conteudo.forma === "arquivo"` continua igual (o `tipo` diz que é imagem).

- [ ] **Step 1: Write the failing tests:**
  - HTML com `<img src="data:image/png;base64,AAA" width="640" height="480">` → `[figura img-1: imagem no corpo do documento, 640×480 px; para ver: ver_imagem]`;
  - sem `width`/`height` → `[figura img-1: imagem no corpo do documento; para ver: ver_imagem]`;
  - `width="20" height="20"` → nada, e a próxima é `img-2`;
  - `src="https://x/a.png"` → `[imagem externa ao documento, não lida]`;
  - sem a opção, o texto é idêntico ao de hoje;
  - `imagemDoHtml(html, 2)` devolve a segunda `data:` com `tipo` e `base64` separados; `imagemDoHtml(html, 9) === null`.
- [ ] **Step 2:** Rodar as duas suítes → FALHA.
- [ ] **Step 3:** Implementar. A troca do `<img>` pelo nó de texto acontece antes da extração do texto. As tabelas continuam separadas como já são.
- [ ] **Step 4:** Rodar as duas suítes e o `tsc` nos dois pacotes → 0 falhas.
- [ ] **Step 5:** Commit.

### Task 5: Recorte da figura no painel

**Files:**
- Create: `agente-ia/src/painel/imagem.ts`
- Test: `agente-ia/tests/verificar-figuras.ts` (só as funções puras)

**Interfaces:**
- Consumes: `figurasDoDocumento`, `lerIdFigura` (Tarefa 2); o mesmo coletor de páginas da Tarefa 3, exportado de `pdf.ts` como `paginasVistasDoPdf(bytes: Uint8Array): Promise<PaginaVista[]>`.
- Produces:
  - `interface ImagemPronta { dataUrl: string; largura: number; altura: number; descricao: string }`, onde `descricao` é o texto curto para o cartão (ex.: "figura p3-1 do documento 1234567");
  - `retanguloEmPixels(caixa: Caixa, pagina: { largura: number; altura: number; rotacao: 0 | 90 | 180 | 270 }, escala: number, margem = 0.02): { x: number; y: number; largura: number; altura: number }`;
  - `reduzir(largura: number, altura: number, max = 1536): { largura: number; altura: number }`;
  - `prepararImagem(conteudo: { tipo: string; base64: string }, figura: string, rotulo: string): Promise<ImagemPronta>`. Ele usa o navegador: PDF pelo pdf.js e canvas; `image/*` por `createImageBitmap`. Lança `Error` com `codigo: "FIGURA_INEXISTENTE"` e a mensagem listando os ids que existem.

- [ ] **Step 1: Write the failing tests:**
  - `retanguloEmPixels` de `{x:100,y:300,largura:300,altura:200}` em A4, sem rotação, escala 2 → origem em cima: `y = (842-500)*2` menos a margem;
  - **Review Focus 3:** a mesma caixa com `rotacao: 90` → largura e altura trocadas e a posição certa;
  - a margem nunca sai da página;
  - `reduzir(3000, 1500) → {1536, 768}`; `reduzir(800, 600)` não muda;
  - **Review Focus 2:** para a lista de `PaginaVista` da Tarefa 2, o id `p3-1` escolhido pelo recorte é a mesma `Figura` que `figurasDoDocumento` marcou. O recorte chama `figurasDoDocumento`, não reimplementa.
- [ ] **Step 2:** `npm run verificar` → FALHA.
- [ ] **Step 3:** Implementar. Para PDF:
  - escala tal que o recorte fique com lado maior ≤ 1536 px;
  - `page.render` num `OffscreenCanvas` (ou `<canvas>` do painel);
  - recorte com `drawImage`;
  - saída com `convertToBlob({type: "image/jpeg", quality: 0.85})` e `FileReader` para `dataUrl`.

  Para `pN`, a página inteira.
- [ ] **Step 4:** `npm run verificar` + `tsc` → 0 falhas.
- [ ] **Step 5:** Commit.

### Task 6: Ferramenta `ver_imagem` e contrato com o motor

**Files:**
- Create: `agente-ia/src/tools/imagem.ts`
- Modify: `agente-ia/src/motor/tools.ts` (`ContextoTool`, `EstadoConversa`)
- Modify: `agente-ia/src/motor/tipos.ts` (`InterfaceMotor.consentirImagem`)
- Modify: `agente-ia/src/motor/motor.ts` (`OpcoesMotor.imagens`, `contexto()`, `limpar()`)
- Modify: `agente-ia/src/tools/sei.ts` (`documento_ler` pede `marcarImagens: true`; arquivo `image/*` vira a marca de arquivo; registra `ver_imagem` em `TOOLS_SEI`)
- Test: `agente-ia/tests/verificar-imagem-tool.ts` (registrar em `tests/verificar.ts`)

**Interfaces:**
- Consumes: `ImagemPronta` (Tarefa 5), `ehErroDeImagem` (Tarefa 1).
- Produces:
  - `interface ServicoDeImagens {`
    - `enxerga(): Promise<boolean | null>;`
    - `preparar(conteudo: { tipo: string; base64: string }, figura: string, rotulo: string): Promise<ImagemPronta>;`
    - `descrever(img: ImagemPronta, pedido: string, sinal: AbortSignal): Promise<string>;`
    - `}`, em `motor/tools.ts`;
  - `ContextoTool.imagens?: ServicoDeImagens`;
  - `ContextoTool.consentirImagem(img: ImagemPronta, o: { restrito: boolean }): Promise<boolean>`:
    - com `estado.consentimentoImagens === true` e `!o.restrito`, devolve `true` sem perguntar;
    - senão chama `ui.consentirImagem`;
    - `"todas"` grava `estado.consentimentoImagens = true`;
    - documento restrito pergunta sempre, e o cartão de restrito não oferece "todas";
  - `EstadoConversa.consentimentoImagens: boolean` (`false` em `limpar()`);
  - `InterfaceMotor.consentirImagem?(img: ImagemPronta): Promise<"esta" | "todas" | "nao">`; sem ela, a resposta é `"nao"`;
  - `OpcoesMotor.imagens?: ServicoDeImagens`, repassado ao contexto como o `delegar`;
  - a tool `ver_imagem`, `efeito: "leitura"`, com parâmetros `documento` (texto), `figura` (texto) e `pergunta?` (texto, até 500), e o retorno `{ documento, figura, descricao }`, onde `descricao` vem envelopada.

- [ ] **Step 1: Write the failing tests** (contexto falso, no padrão de `verificar-historico-tool.ts`):
  - sem `ctx.imagens` → erro "Este painel não lê imagens" e nenhum `sei`;
  - sigiloso → erro `SEI_SIGILOSO`, sem `preparar`;
  - restrito com `consentirRestrito` → `false` dá erro `CONTEUDO_RESTRITO_NAO_AUTORIZADO`;
  - `enxerga() → false` → recado de modelo sem visão, sem cartão;
  - cartão `"nao"` → erro "O usuário não autorizou o envio desta imagem", e `descrever` não chamado;
  - `"todas"` → a 2ª chamada não pergunta de novo; `"esta"` → pergunta de novo;
  - `"todas"` dado antes + documento restrito → pergunta mesmo assim;
  - `descrever` recebe a imagem e um pedido com documento, figura e `pergunta`;
  - a `descricao` devolvida passa por `varrer` (um "ignore as instruções anteriores" dentro dela gera achado e `registrarAchados`) e sai envelopada com o `nonce`;
  - **Review Focus 4:** sinal abortado antes do cartão → nenhum `descrever`; abortado durante `descrever` → erro de cancelamento e nada devolvido;
  - `documento_ler` de um arquivo `image/png` devolve `[arquivo de imagem; para ver: ver_imagem figura "arquivo"]`;
  - `ver_imagem` NÃO aparece entre as tools de efeito leitura que o `delegar` monta. Filtrar por nome em `main.ts`; o teste verifica a lista exportada `TOOLS_FORA_DO_AUXILIAR`, que inclui `"ver_imagem"`.
- [ ] **Step 2:** `npm run verificar` → FALHA.
- [ ] **Step 3:** Implementar. A descrição da tool para o modelo diz:
  - chamar quando a resposta depender de uma figura marcada (gráfico, mapa, tabela em imagem, foto, planta);
  - não chamar para brasão, logotipo ou assinatura;
  - uma figura por chamada.

  Os passos seguem a seção 2 do spec. PDF usa `documento.ler` normal; `img-N` usa `imagemHtml`; `arquivo` usa o arquivo.
- [ ] **Step 4:** `npm run verificar` + `tsc` → 0 falhas.
- [ ] **Step 5:** Commit.

### Task 7: Painel — serviço de imagens, cartão com miniatura e prompt

**Files:**
- Modify: `agente-ia/src/painel/main.ts` (`criarMotor`, `delegar`, `interfaceMotor`, novo `cartaoImagem`)
- Modify: o prompt de sistema (arquivo de `promptSistema`)
- Modify: CSS do painel (miniatura com `max-height: 220px`, borda)
- Test: `agente-ia/tests/verificar-imagem-tool.ts` (prompt) e `verificar-dom.ts`, se o cartão couber no padrão de lá

**Interfaces:**
- Consumes: `ServicoDeImagens`, `ImagemPronta`, `aceitaImagem`, `ContadorDeUso.fonte()` e `anotarModelo()`.
- Produces:
  - **`enxerga()`:** o modelo auxiliar, se configurado, senão o principal, pelo `aceitaImagem`.
  - **`preparar`:** é `prepararImagem`.
  - **`descrever`:**
    - `criarProvedor` com o modelo escolhido (o auxiliar se ele enxerga, senão o principal) e `cache: false`;
    - `conversar({ mensagens: [system, user com partes], tools: [] })`;
    - o gasto vai para uma `this.contador.fonte()` nova, e o modelo para `anotarModelo`;
    - um 4xx com `ehErroDeImagem` no auxiliar, sendo o principal outro modelo, faz UMA nova tentativa com o principal; senão vira o recado da Tarefa 1.
  - **`cartaoImagem(img)`:**
    - mostra a miniatura (`<img src=dataUrl>`) e `img.descricao`;
    - linha de aviso: "A imagem vai ao serviço de IA como está: dados pessoais nela não são mascarados.";
    - botões **Enviar esta imagem** (primário), **Enviar as imagens desta conversa** e **Não enviar**.
  - **Prompt do auxiliar** (`delegar`): "Se os documentos lidos trouxerem marcas [figura …] ou [possível figura …] que pesem na tarefa, liste-as no fim da resposta (nº do documento, id da figura e legenda): você não pode vê-las, quem pediu pode."
  - **Prompt:** "Onde o texto de um documento trouxer [figura …] ou [página … digitalizada …], há uma imagem que você não viu. Se a resposta depender dela, chame ver_imagem; se não chamar, diga que a resposta não considerou a imagem. Não peça brasão, logotipo nem assinatura."

- [ ] **Step 1:** Testes:
  - o prompt de sistema contém `ver_imagem` e a frase "não considerou a imagem";
  - o texto do prompt do auxiliar sai de uma constante exportada (`INSTRUCAO_FIGURAS_AUXILIAR`), e o teste confere que ela fala em listar as figuras;
  - a escolha do modelo de visão sai de `modeloDeVisao(config, enxergaAux: boolean | null, enxergaPrincipal: boolean | null): { primeiro: string; reserva?: string }`, função pura em `painel/uso.ts`, testada nos casos OpenRouter (escolhe o que enxerga), serviço sem catálogo (auxiliar com o principal de reserva) e sem auxiliar.
- [ ] **Step 2:** `npm run verificar` → FALHA.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm run verificar`, `tsc` e `npm run build:rapido` (o bundle compila; NÃO commitar o dist) → 0 falhas.
- [ ] **Step 5:** Commit (só fontes e testes).

### Task 8: Conferência em campo

**Files:** nenhum, salvo correções que apareçam (cada uma com teste antes).

- [ ] **Step 1: SEI SP de treinamento (4.1.5)**, extensão do `dist` com o bundle regerado:
  - PDF com gráfico → marca `p…`, `ver_imagem`, cartão, descrição coerente, gasto somado no topo;
  - documento do editor com imagem colada → `img-1`;
  - JPG externo → `arquivo`.
- [ ] **Step 2: SEI 5 (MJ de homologação):** o mesmo; modelo DeepSeek como auxiliar e como principal → recado de modelo sem visão, conversa segue.
- [ ] **Step 3:** "Não enviar" → nada na aba de rede do painel para o serviço de IA.
- [ ] **Step 4:** Registrar o resultado na memória do projeto. O HISTORICO.md fica para o release.

### Task 9: Rascunho da política e da declaração da loja

**Files:**
- Create: `docs/superpowers/specs/2026-11-18-agente-imagens-politica-rascunho.md`, que não vai para a política publicada: o autor publica pela web.

- [ ] **Step 1:** Escrever o trecho da política (o que sai, quando, com que permissão e para qual serviço) e o ajuste da declaração de uso de dados da Chrome Web Store. Antes, conferir o texto atual da política publicada em seipro.app.
- [ ] **Step 2:** Commit do rascunho.
