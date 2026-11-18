# DOM seguro — camadas 3 a 7 (plano 2 de 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter para o portão de inserção e para o despachante `data-spro-*` os cinco
arquivos das camadas 3 a 7 — `sei-pro-all.js`, `sei-pro-projetos.js`, `sei-pro-favoritos.js`,
`sei-pro.js` e `sei-pro-arvore.js` (443 handlers inline, 173 pontos de inserção) — sem mudar
o funcionamento, e corrigir a regressão que o plano 1 publicou na 2.2.2.

**Architecture:** O plano 1 fez a conversão a mão, com substituições por expressão regular, e a
revisão achou que **todos** os defeitos sérios vieram dessa parte mecânica. Este plano troca a mão
por ferramenta: dois codemods sobre o tokenizador e a árvore sintática (`acorn`) — um para os
handlers, testado contra o `onclick` inline real, outro para as inserções, que deriva o modo do
verbo — e detectores para cada classe de erro que a triagem de 28/09 encontrou: handler arrancado
sem rastro, HTML de função ainda não convertida passando pelo portão, parse no documento vivo,
modo de inserção trocado e perda de tipo de argumento. O bloco do `sei-functions-pro.js` ganha os
helpers que essas classes exigem, e o `sei-pro-arvore.js`, um resolvedor para a corrida de carga
do seu frame.

**Tech Stack:** JavaScript ES5 em `dist/js/` (template literal permitido), jQuery 3.4.1,
DOMPurify 3.2.5, Node 20 com `node:test` e jsdom 24, puppeteer-core com Chrome for Testing para a
validação ao vivo.

**Spec:** [docs/superpowers/specs/2026-09-23-dom-seguro-firefox-design.md](../specs/2026-09-23-dom-seguro-firefox-design.md)
**Plano anterior:** [docs/superpowers/plans/2026-09-24-dom-seguro-fundacao.md](2026-09-24-dom-seguro-fundacao.md)

---

## O que a triagem de 28/09/2026 mudou

O plano 1 previu o plano 2 como "repetição do padrão já validado". Medir os cinco arquivos antes
de escrever mostrou que não é. Sete achados, todos com número:

1. **O plano 1 publicou uma regressão.** Na janela *Gerenciar prescrições*, o selo de prazo vem do
   `getDatesPreview` — função do `sei-functions-pro.js`, que só será convertido no plano 3 — com
   `onmouseover` (tooltip da data) e `onclick`. O `prescricoes` passou esse HTML pelo portão, que
   arrancou os dois. Está no ar desde a 2.2.2. Nenhum teste, verificador ou validação ao vivo viu,
   porque **atributo removido não deixa rastro**.
2. **Produtores pendentes.** 36 funções do `sei-functions-pro.js` devolvem HTML com handler inline.
   Os cinco arquivos deste plano consomem 12 delas (`getDatesPreview` sozinho, 9 vezes). Todo HTML
   que vem de uma delas precisa entrar **sem** sanitização até o plano 3 converter a função —
   senão o handler morre, como em prescrições.
3. **Duas populações novas de inserção.** Além das três do plano 1 (marcação da extensão, texto,
   round-trip do documento do usuário): **marcação nativa do SEI realocada** (linhas da tabela de
   processos, paginação, marcadores — com os handlers inline do próprio SEI) e **parse só para
   ler**. Os cinco arquivos têm 28 `$(html)` sobre respostas do servidor; o jQuery parseia isso
   **no documento vivo**, onde um `<img onerror>` da resposta executa antes de qualquer inserção.
4. **Código-fonte montado como string.** `loadScriptFavoriteTag` (favoritos) escreve JavaScript
   num texto e o injeta num `<script>` dentro de outro frame. É o padrão que o revisor da AMO mais
   penaliza, e o portão não resolve (o sanitizador remove `<script>`).
5. **Corrida no `ifrArvore`.** O `init_arvore.js` pede `sei-functions-pro.js` e `sei-pro-arvore.js`
   em paralelo (linhas 92 e 93). `initSeiProArvore()` roda no `ready` e pode chegar antes do
   `htmlPro` existir no frame — um `ReferenceError` ali abortaria a inicialização inteira da árvore.
6. **Delegação chega tarde.** O "Cancelar" da área de upload chama `dropzoneCancelInfo(event)`,
   que faz `stopImmediatePropagation()` para o Dropzone não abrir o seletor de arquivos. Inline,
   isso rodava no próprio alvo. Delegado ao documento, roda **depois** do Dropzone.
7. **Tipo do argumento.** `onclick="fn('+id+')"` passava **número**. Um `argsPro(id)` ingênuo
   passaria **string**, e um `===` com número quebraria em silêncio.

Também apareceram falsos positivos nas ferramentas do plano 1 (`<script>` e `<id>` achados em
comentários; `<caption>` acusado embora só apareça dentro de uma `<table>` completa) — corrigidos
na Task 4.

## As cinco populações

Toda inserção de HTML nos arquivos convertidos cai em exatamente uma. **Classificar antes de
converter.**

| # | população | exemplo | caminho |
|---|---|---|---|
| P1 | marcação da extensão (constante ou com dado de fora) | diálogos, botões, linhas montadas pela extensão | `htmlPro` |
| P2 | texto | nome, rótulo, número | `.text()` / `document.createTextNode` |
| P3 | round-trip do documento do usuário no editor | numeração da Legística | `reescreverDocumentoPro` |
| P4 | marcação **nativa do SEI** realocada | linhas da tabela de processos, paginação, marcadores | mover o **nó** (clonar ou `lerHtmlPro` + `.append(no)`); **nunca** serializar e reparsear |
| P5 | parse só para ler | `$(respostaAjax).find(...)`, `$(html).hasClass(...)` | `lerHtmlPro` |
| — | HTML vindo de **produtor pendente** (função de arquivo não convertido que ainda monta `on*=`) | saída do `getDatesPreview` | `htmlCruPro(alvo, html, modo, 'plano-3: <produtor>')` — provisório, contado |

## Global Constraints

- **Acentos em `dist/js/*.js` são `\uXXXX`.** Todo código novo é ASCII puro. Em arquivo com passivo
  de acentos crus, o critério é "a contagem do `escape-nonascii.mjs --check` não aumenta".
- **ES5 em `dist/js/*.js`** fora de template literal: `var`, `function`, sem arrow, sem
  `const`/`let`, sem `?.`. Arquivos que já usam arrow e `const` (`sei-pro-docs-lote.js`,
  `sei-pro-proc-lote.js`) seguem o próprio estilo.
- **Toda conversão é iso-funcional.** Nenhuma mudança de comportamento, texto ou layout.
- **Trabalhar no worktree** `../sei-pro-dom-seguro` (branch `fix/dom-seguro-plano-2`). Outra
  sessão costuma estar no clone principal — em 28/09 havia `sei-pro-docs-lote.js` modificado lá.
- **`tools/` e `tests/` são ignorados pelo git** e não vêm com o worktree: a Task 1 os copia.
  Commits contêm só `dist/`, `docs/` e `pages/`. **Nunca `git add -A`.**
- **Base de comparação** das ferramentas: a ref local `refs/dom-seguro/base-plano2` (= `30279d7`,
  a 2.2.3). Exportar `SPRO_REF_BASE=refs/dom-seguro/base-plano2` antes de rodar os verificadores.
- **`htmlCruPro` é provisório.** Motivo obrigatório no formato `'plano-3: <produtor>'`. A extensão
  só vai à AMO quando o `check-dom-injection` contar zero usos — o que só o plano 3 alcança.
- **No SEI, navegar só por clique.** URL sem `infra_hash` derruba a sessão.
- **Não recarregar a extensão com `uninstallExtension`** — derruba o Chrome inteiro. Para carregar
  código novo, parar e subir o daemon de novo.
- **A sincronização com a API do PGD foi desligada no banco local** em 25/09/2026
  (`sincronizar_dados_api: false` na tabela `entidades`). Não religar.
- **Versão:** a seguinte à maior tag `v*` existente no momento do fechamento (em 28/09: 2.2.3).
- **Todo release atualiza `pages/HISTORICO.md`.**

## Review Focus

Cinco situações que o spec pressupõe, que um teste de caminho feliz não exercita, e onde cada
teste foi encaixado:

1. **"Cancelar" dentro da área do Dropzone.** A ação tem de parar a propagação antes de o Dropzone
   abrir o seletor de arquivos. → teste de captura na Task 2.
2. **HTML de produtor pendente passando pelo portão.** O usuário perde tooltip e clique sem nenhum
   erro. → aviso em tempo de execução (Task 2) e detector estático que reprova (Task 4).
3. **Árvore inicializando antes do bloco local.** A árvore tem de montar igual, sem
   `ReferenceError`. → teste do resolvedor na Task 10.
4. **Argumento numérico virando string.** A função recebe o mesmo tipo que recebia do `onclick`.
   → teste de equivalência contra o handler inline real na Task 3.
5. **Salvar a anotação ao sair do campo (`blur`).** `blur` não borbulha; o jQuery 3.4.1 o delega
   capturando o `blur` nativo no documento. → teste na Task 2, movendo o foco de verdade.

---
## Task 1: Worktree, ferramentas e harness ao vivo

**Files:**
- Copy: `../sei-pro/tools/` → `tools/` e `../sei-pro/tests/` → `tests/` (ignorados pelo git)
- Create: `tests/ao-vivo/daemon.mjs`, `tests/ao-vivo/conn.mjs`, `tests/ao-vivo/sonda.mjs`, `tests/ao-vivo/backend.mjs`

**Interfaces:**
- Consumes: o worktree `../sei-pro-dom-seguro`, criado junto com este plano.
- Produces: `abrir(padrao) -> {browser, p}` (conn.mjs); `sondar(p) -> Array<{frame, marca,
  despachantes, orfaos, inline}>` e `avisosSeiPro(p) -> string[]` (sonda.mjs);
  `conectarAtividades(browser, p)` (backend.mjs). O daemon grava o id da extensão em
  `tests/ao-vivo/.extensao-id`.

- [ ] **Step 1: Copiar ferramentas e testes para o worktree e instalar**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-dom-seguro"
rsync -a --exclude node_modules --exclude 'perfil-chrome' ../sei-pro/tools/ tools/
rsync -a --exclude node_modules --exclude 'perfil-chrome' ../sei-pro/tests/ tests/
(cd tests && npm install --no-fund --no-audit && npm install --no-save puppeteer-core@24)
git status --short
```
Esperado: `git status` vazio — `tools/` e `tests/` não aparecem.

- [ ] **Step 2: Confirmar a base verde**

```bash
export SPRO_REF_BASE=refs/dom-seguro/base-plano2
(cd tests && node --test dom-seguro/ 2>&1 | grep -E "^# (tests|pass|fail)")
node tools/check-dom-injection.mjs | tail -1
```
Esperado: `# pass 62`, `# fail 0`, e `check-dom-injection: 0 erro(s), 0 aviso(s)`.

- [ ] **Step 3: Escrever o daemon do Chrome de teste**

O Chrome do MCP chrome-devtools sobe com `--disable-extensions`, e o Chrome do sistema é gerenciado
pela organização e recusa extensão descompactada. Só o Chrome for Testing serve.

`tests/ao-vivo/daemon.mjs`:

```javascript
// Sobe o Chrome for Testing com a extensao DESTE worktree e fica vivo na porta 9444.
// Para carregar codigo novo: parar este processo e subir de novo. NAO usar uninstallExtension --
// com abas anexadas ele derruba o Chrome inteiro (medido em 25/09/2026).
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.SPRO_CHROME ||
  '/Users/phs/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const DIST = resolve(AQUI, '../../dist');
const PERFIL = resolve(AQUI, 'perfil-chrome');   // estavel: o login do SEI sobrevive entre subidas

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: false, pipe: true,
  enableExtensions: true,                          // sem isto o puppeteer manda --disable-extensions
  userDataDir: PERFIL, defaultViewport: null,
  args: ['--remote-debugging-port=9444', '--window-size=1500,1000'],
});
const id = await browser.installExtension(DIST);
writeFileSync(resolve(AQUI, '.extensao-id'), id);
console.log('extensao', id, 'carregada de', DIST);
const [aba] = await browser.pages();
await aba.goto('https://treinamento.sei.sp.gov.br/sei/', { waitUntil: 'domcontentloaded' });
console.log('DAEMON VIVO na 9444');
process.on('SIGTERM', async () => { await browser.close(); process.exit(0); });
await new Promise(() => {});
```

- [ ] **Step 4: Escrever a conexão por target**

`browser.pages()` anexa a TODAS as abas, e uma aba travada derruba tudo com
`Network.enable timed out`. Atacar só a aba que interessa.

`tests/ao-vivo/conn.mjs`:

```javascript
import puppeteer from 'puppeteer-core';

export async function abrir(padrao = /treinamento\.sei\.sp/) {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9444', defaultViewport: null, protocolTimeout: 180000,
  });
  const alvo = browser.targets().filter((t) => t.type() === 'page').find((t) => padrao.test(t.url()));
  if (!alvo) return { browser, p: null };
  const p = await alvo.page();
  p.on('dialog', async (d) => { try { await d.accept(); } catch (e) {} });
  return { browser, p };
}
```

- [ ] **Step 5: Escrever a sonda**

A sonda mede o que importa em cada documento da aba. Duas diferenças em relação ao plano 1:
conta o despachante instalado **pelo topo** num iframe (o `htmlPro` do topo instala com o jQuery
do topo, e o `jQuery._data` do frame não vê), e junta os avisos `[SEIPro]` do console — é por eles
que a Task 2 torna visível o handler arrancado.

`tests/ao-vivo/sonda.mjs`:

```javascript
import { abrir } from './conn.mjs';

const AVISOS = new WeakMap();

// Liga a coleta ANTES da acao que se quer observar.
export function coletarAvisos(p) {
  const lista = [];
  AVISOS.set(p, lista);
  p.on('console', (m) => { const t = m.text(); if (t.indexOf('[SEIPro]') !== -1) lista.push(t.slice(0, 220)); });
  p.on('pageerror', (e) => lista.push('pageerror: ' + String(e).slice(0, 200)));
  return lista;
}
export function avisosSeiPro(p) { return AVISOS.get(p) || []; }

const MEDIR = () => {
  const conta = (jq) => {
    try { return ((jq._data(document, 'events') || {}).click || []).filter((e) => e.namespace === 'sproAcoes').length; }
    catch (e) { return 0; }
  };
  let pai = 0;
  try { if (parent !== window && parent.jQuery) pai = conta(parent.jQuery); } catch (e) {}
  return {
    marca: document.documentElement.getAttribute('data-spro-actions'),
    despachantes: (window.jQuery ? conta(window.jQuery) : 0) + pai,
    inline: document.querySelectorAll('[onclick],[onchange],[onmouseover],[onblur],[onkeypress]').length,
    acoes: document.querySelectorAll('[data-spro-click],[data-spro-change],[data-spro-tip],[data-spro-blur],[data-spro-keypress]').length,
  };
};

export async function sondar(p) {
  const linhas = [];
  for (const f of p.frames()) {
    try { linhas.push({ frame: f === p.mainFrame() ? 'topo' : (f.name() || '?'), ...(await f.evaluate(MEDIR)) }); }
    catch (e) {}
  }
  let orfaos = null;
  try { orfaos = await p.evaluate(() => (typeof auditActionsPro === 'function' ? auditActionsPro().orfaos.map((o) => o.atributo + '=' + o.nome) : null)); }
  catch (e) {}
  return { linhas, orfaos };
}

// Uso direto: node tests/ao-vivo/sonda.mjs
if (import.meta.url === 'file://' + process.argv[1]) {
  const { browser, p } = await abrir();
  if (!p) { console.log('aba do SEI SP nao encontrada'); process.exit(0); }
  const r = await sondar(p);
  console.table(r.linhas);
  console.log('orfaos:', r.orfaos);
  await browser.disconnect(); process.exit(0);
}
```

- [ ] **Step 6: Escrever o conector do backend de atividades**

Receita da memória `reference_backend_atividades_local`: endpoint `http://localhost:8080/`, chave do
usuário `soares` (o dump não tem `pedro.soares`), gravação pela página de opções, e o login do SEI
alinhado **só no harness** — senão o código limpa a configuração de propósito (é a proteção contra
chave de outra pessoa).

`tests/ao-vivo/backend.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const CHAVE = '0b9c6b-d99c80-be8bfb-2c5092-7203ae';   // usuario 'soares', perfil Administrador, banco LOCAL

export async function gravarConfig(browser, opcoesExtras = []) {
  const id = readFileSync(resolve(AQUI, '.extensao-id'), 'utf8').trim();
  const dataValues = [
    { configGeral: [
      { name: 'gerenciaratividades', value: true }, { name: 'gerenciarprescricoes', value: true },
      { name: 'gerenciarprojetos', value: true }, { name: 'gerenciarfavoritos', value: true },
      { name: 'proclote', value: true }, ...opcoesExtras,
    ] },
    { baseName: 'SEI Pro', baseTipo: 'atividades', conexaoTipo: 'api', CLIENT_ID: '', API_KEY: '',
      spreadsheetId: '', URL_API: 'http://localhost:8080/', KEY_USER: CHAVE },
  ];
  const opt = await browser.newPage();
  await opt.goto(`chrome-extension://${id}/html/options.html`, { waitUntil: 'domcontentloaded' });
  await opt.evaluate(async (dv) => { await new Promise((r) => chrome.storage.sync.set({ dataValues: JSON.stringify(dv) }, r)); }, dataValues);
  await opt.close();
}

// Chamar depois que a tela do SEI terminou de carregar.
export async function conectarAtividades(p) {
  await p.evaluate((chave) => {
    window.userSEI = 'soares';
    window.perfilLoginAtiv = { URL_API: 'http://localhost:8080/', KEY_USER: chave, CLIENT_ID: '' };
    window.urlServerAtiv = 'http://localhost:8080/';
    window.userHashAtiv = chave;
    if (typeof initAtividades === 'function') initAtividades();
  }, CHAVE);
  await new Promise((r) => setTimeout(r, 15000));
  return p.evaluate(() => ({ url: window.urlServerAtiv, chaves: window.arrayConfigAtividades ? Object.keys(window.arrayConfigAtividades).length : 0 }));
}
```

- [ ] **Step 7: Subir o daemon e conferir a extensão no SEI SP**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-dom-seguro"
node tests/ao-vivo/daemon.mjs &    # em segundo plano; anotar o PID
sleep 15 && cat tests/ao-vivo/.extensao-id
```
Pedir ao autor que faça login no SEI SP de Treinamento na janela **Google Chrome for Testing**
(`pedro.soares` / `pedro.soares`, órgão `GESP-TREINAMENTO`). Depois:
```bash
node tests/ao-vivo/sonda.mjs
```
Esperado: linha `topo` com `marca: 'sim'` e `despachantes: 1`; `orfaos: []`.

- [ ] **Step 8: Não há commit nesta task**

`tools/` e `tests/` são ignorados. Conferir: `git status --short` vazio.

---
## Task 2: Bloco — o handler arrancado passa a gritar, e os helpers que as novas classes exigem

**Files:**
- Modify: `dist/js/sei-functions-pro.js` — dentro do bloco `SEI PRO DOM` (hoje linhas 557–903)
- Create: `tests/dom-seguro/plano2-bloco.test.mjs`

**Interfaces:**
- Consumes: `htmlPro`, `sanitizarFragmentoPro`, `reescreverDocumentoPro`, `installActionsPro`,
  `dispararAcaoPro`, `mostrarTipPro`, `avisarPro` (plano 1).
- Produces:
  - `relatarRemocoesPro()` — chamada por `htmlPro`; avisa `[SEIPro] htmlPro: handler inline removido: <attr> em <tag.classe> = <valor>` uma vez por assinatura. `htmlPro` também avisa quando o fragmento **começa** com `<style>`/`<script>`/`<iframe>`: esse some inteiro sem passar pelo `DOMPurify.removed`.
  - `htmlCruPro(alvo, html, modo, motivo) -> jQuery` — insere **sem** sanitizar e instala o despachante no documento do alvo. `motivo` no formato `'plano-3: <produtor>'`.
  - `lerHtmlPro(html) -> jQuery` — os mesmos nós de topo que `$(html)` devolveria, parseados num documento inerte.
  - `literalInlinePro(v)` — o valor que um token solto teria dentro de um `onclick` (número, booleano, `null`).
  - `data-spro-captura` (com `data-spro-click`) — a ação roda na fase de captura do documento.
  - `data-spro-tip-titulo` — segundo argumento do `infraTooltipMostrar`.
  - `confirmarDialogoNoEnterPro(el, ev)` e `removerAncestralPro(el, seletor)`.
  - `resolverAcaoPro` passa a **subir de janela** quando não acha o nome onde o elemento está
    (a local sempre ganha). É o que faz `parent.fn` funcionar no iframe aninhado do SEI 4.1.
  - `reescreverParentPro(html)` — a troca `parent.` → `parent.getJanelaProcessoPro().` que o
    `getHtmlJanelaProcessoPro` faz, agora sem tocar em `data-spro-*`.
  - `EVENTOS_ACAO_PRO` ganha `mouseover` e `mouseout`.

- [ ] **Step 1: Escrever os testes que falham**

`tests/dom-seguro/plano2-bloco.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montar, desmontar } from './harness.mjs';

// Valores vindos do jsdom sao de outro realm: comparar tamanhos e primitivos, nao deepEqual de arrays.
function comJanela(fn, opcoes) {
  const ctx = montar(opcoes);
  try { return fn(ctx); } finally { desmontar(ctx); }
}
function espiarAvisos(w) {
  const avisos = [];
  w.console.warn = (...a) => avisos.push(a.join(' '));
  return avisos;
}

// --- o handler arrancado passa a deixar rastro (Review Focus 2) ---------------------------
test('htmlPro avisa quando o sanitizador arranca um handler inline', () => {
  comJanela(({ w }) => {
    const avisos = espiarAvisos(w);
    w.htmlPro('body', '<span class="dateBoxIcon" onmouseover="return infraTooltipMostrar(1)">a</span>', 'append');
    const m = avisos.find((x) => x.includes('handler inline removido'));
    assert.ok(m, 'avisos: ' + JSON.stringify(avisos));
    assert.match(m, /onmouseover/);
    assert.match(m, /<span\.dateBoxIcon>/);
  });
});

test('o mesmo handler arrancado avisa uma vez so', () => {
  comJanela(({ w }) => {
    const avisos = espiarAvisos(w);
    for (let i = 0; i < 5; i++) w.htmlPro('body', '<a class="k" onclick="f()">x</a>', 'append');
    assert.equal(avisos.filter((x) => x.includes('handler inline removido')).length, 1);
  });
});

// Nao usar <style> aqui: o DOMPurify PERMITE <style> dentro de um elemento. O sumico de <style>
// visto no plano 1 era do parser, que joga um <style> solto no <head> -- nao e remocao, e o
// DOMPurify.removed nao registra.
test('htmlPro avisa quando o sanitizador remove <script> ou <iframe>', () => {
  comJanela(({ w }) => {
    const avisos = espiarAvisos(w);
    w.htmlPro('body', '<div><script>x()</script><iframe src="about:blank"></iframe>a</div>', 'append');
    assert.ok(avisos.some((x) => x.includes('elemento removido: <script>')), JSON.stringify(avisos));
    assert.ok(avisos.some((x) => x.includes('elemento removido: <iframe>')), JSON.stringify(avisos));
  });
});

test('fragmento que comeca com <style> avisa: some sem aparecer no DOMPurify.removed', () => {
  comJanela(({ w, $ }) => {
    const avisos = espiarAvisos(w);
    w.htmlPro('head', "<style type='text/css' data-style='x'>.a{}</style>", 'append');
    assert.equal($('style[data-style="x"]').length, 0, 'o <style> de fato nao entra');
    assert.ok(avisos.some((x) => x.includes('nunca sobrevive ao portao')), JSON.stringify(avisos));
  });
});

test('marcacao limpa nao gera aviso', () => {
  comJanela(({ w }) => {
    const avisos = espiarAvisos(w);
    w.htmlPro('body', '<a data-spro-click="f" data-spro-tip="t">x</a>', 'append');
    assert.equal(avisos.length, 0, JSON.stringify(avisos));
  });
});

// --- htmlCruPro: a excecao provisoria e contada ------------------------------------------
test('htmlCruPro preserva o handler inline que o portao arrancaria', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="c"></div>');
    w.htmlCruPro('#c', '<span onclick="x()">a</span>', 'html', 'plano-3: getDatesPreview');
    assert.equal($('#c span').attr('onclick'), 'x()');
  });
});

test('htmlCruPro instala o despachante no documento do alvo, mesmo num iframe', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<iframe id="ifr"></iframe>');
    const doc = w.document.getElementById('ifr').contentDocument;
    doc.body.innerHTML = '<div id="c"></div>';
    w.htmlCruPro($(doc.getElementById('c')), '<b>x</b>', 'html', 'plano-3: getDatesPreview');
    assert.equal(doc.documentElement.getAttribute('data-spro-actions'), 'sim');
  });
});

test('htmlCruPro sem motivo no formato avisa, e insere mesmo assim', () => {
  comJanela(({ w, $ }) => {
    const avisos = espiarAvisos(w);
    $('body').append('<div id="c"></div>');
    w.htmlCruPro('#c', '<b>x</b>', 'html', 'porque sim');
    assert.equal($('#c b').length, 1);
    assert.ok(avisos.some((x) => x.includes('plano-3: <produtor>')));
  });
});

// --- lerHtmlPro: parse inerte com a mesma forma do $(html) -------------------------------
test('lerHtmlPro acha o mesmo que $(html) nos usos da extensao', () => {
  comJanela(({ w, $ }) => {
    const casos = [
      ['<div><span id="a">x</span></div>', '#a'],
      ['<table><tbody><tr class="infraTrClara"><td>1</td></tr></tbody></table>', 'tr.infraTrClara'],
      ['<html><head><title>t</title></head><body><div id="w"><a href="?acao=x">1</a></div></body></html>', 'a[href*="acao"]'],
      ['  <div class="k">a</div>  ', '.k'],
    ];
    for (const [html, sel] of casos) {
      assert.equal(w.lerHtmlPro(html).find(sel).length, $(html).find(sel).length, html);
      assert.equal(w.lerHtmlPro(html).filter(sel).length, $(html).filter(sel).length, 'filter ' + html);
    }
  });
});

test('lerHtmlPro preserva hasClass, html() e text() do no de topo', () => {
  comJanela(({ w, $ }) => {
    const h = '<span class="dateboxDisplay tagTableText_date_atrasado"><i class="fas"></i> 3 dias</span>';
    assert.equal(w.lerHtmlPro(h).hasClass('tagTableText_date_atrasado'), true);
    assert.equal(w.lerHtmlPro(h).html(), $(h).html());
    assert.equal(w.lerHtmlPro(h).text(), $(h).text());
  });
});

test('lerHtmlPro parseia num documento inerte, fora do documento vivo', () => {
  comJanela(({ w }) => {
    const nos = w.lerHtmlPro('<img src="x" onerror="alert(1)"><p>a</p>');
    assert.equal(nos.length, 2);
    assert.notEqual(nos[0].ownerDocument, w.document);
    assert.equal(nos[0].ownerDocument.defaultView, null, 'documento sem contexto de navegacao');
  });
});

test('lerHtmlPro com entrada vazia ou sem marcacao devolve colecao vazia', () => {
  comJanela(({ w }) => {
    assert.equal(w.lerHtmlPro('').length, 0);
    assert.equal(w.lerHtmlPro(null).length, 0);
    assert.equal(w.lerHtmlPro('so texto').length, 0);
  });
});

// --- literalInlinePro: o tipo que o onclick inline dava ao token solto (Review Focus 4) ----
test('literalInlinePro devolve o tipo que o token teria no onclick', () => {
  comJanela(({ w }) => {
    assert.equal(w.literalInlinePro(482), 482);
    assert.equal(w.literalInlinePro('482'), 482);
    assert.equal(w.literalInlinePro('4.5'), 4.5);
    assert.equal(w.literalInlinePro(true), true);
    assert.equal(w.literalInlinePro('true'), true);
    assert.equal(w.literalInlinePro('false'), false);
    assert.equal(w.literalInlinePro('null'), null);
    assert.equal(w.literalInlinePro('undefined'), undefined);
    assert.equal(w.literalInlinePro('abc'), 'abc');
  });
});

// --- captura: a acao que precisa parar a propagacao (Review Focus 1) ---------------------
test('data-spro-captura roda antes do listener do ancestral e pode interromper o evento', () => {
  comJanela(({ w, $ }) => {
    const ordem = [];
    w.parar = function (ev) { ordem.push('acao'); ev.stopImmediatePropagation(); };
    w.htmlPro('body', `<div id="zona"><span id="cancelar" data-spro-click="parar" data-spro-captura data-spro-args="${w.argsPro('$ev')}"><i id="ico">x</i></span></div>`, 'append');
    w.document.getElementById('zona').addEventListener('click', () => ordem.push('dropzone'));
    w.document.getElementById('ico').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    assert.equal(ordem.join(','), 'acao', 'o Dropzone nao pode receber o clique');
  });
});

test('sem data-spro-captura a delegacao chega depois do ancestral (e por isso a captura existe)', () => {
  comJanela(({ w }) => {
    const ordem = [];
    w.parar = function (ev) { ordem.push('acao'); ev.stopImmediatePropagation(); };
    w.htmlPro('body', `<div id="zona"><span id="c" data-spro-click="parar" data-spro-args="${w.argsPro('$ev')}">x</span></div>`, 'append');
    w.document.getElementById('zona').addEventListener('click', () => ordem.push('dropzone'));
    w.document.getElementById('c').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    assert.equal(ordem.join(','), 'dropzone,acao');
  });
});

test('acao com captura dispara uma vez so', () => {
  comJanela(({ w }) => {
    let n = 0;
    w.umaVez = function () { n++; };
    w.htmlPro('body', '<span id="c" data-spro-click="umaVez" data-spro-captura>x</span>', 'append');
    w.document.getElementById('c').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    assert.equal(n, 1);
  });
});

// --- blur: nao borbulha (Review Focus 5) ---------------------------------------------------
// Mover o foco DE VERDADE, e nao disparar um evento sintetico: o jQuery 3.4.1 so escuta focusout
// quando window.onfocusin existe -- e nem o Chrome nem o jsdom o tem. Nesse caso ele captura o
// blur nativo no documento. Um teste que disparasse focusout falharia por medir o mecanismo errado.
test('data-spro-blur dispara uma vez quando o campo perde o foco', () => {
  comJanela(({ w }) => {
    const vistos = [];
    w.salvarNota = function (el) { vistos.push(el.id); };
    w.htmlPro('body', '<div id="nota" tabindex="0" contenteditable="true" data-spro-blur="salvarNota">x</div><input id="outro">', 'append');
    w.document.getElementById('nota').focus();
    w.document.getElementById('outro').focus();
    assert.equal(vistos.join(','), 'nota');
  });
});

// --- tooltip com titulo ------------------------------------------------------------------
test('data-spro-tip-titulo vira o segundo argumento do tooltip do SEI', () => {
  comJanela(({ w, $ }) => {
    const chamadas = [];
    w.infraTooltipMostrar = function (t, titulo) { chamadas.push(t + '|' + titulo); };
    w.infraTooltipOcultar = function () {};
    w.htmlPro('body', '<a id="x" data-spro-tip="texto" data-spro-tip-titulo="Titulo">c</a>', 'append');
    $('#x').trigger('mouseover');
    assert.equal(chamadas.join(), 'texto|Titulo');
  });
});

// --- helpers comuns ------------------------------------------------------------------------
test('confirmarDialogoNoEnterPro clica no botao de confirmar do dialogo so no Enter', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    $('body').append('<div class="ui-dialog"><input id="campo"><button class="confirm ui-button">ok</button></div>');
    $('.confirm').on('click', () => { n++; });
    w.confirmarDialogoNoEnterPro(w.document.getElementById('campo'), { which: 65 });
    assert.equal(n, 0);
    w.confirmarDialogoNoEnterPro(w.document.getElementById('campo'), { which: 13 });
    assert.equal(n, 1);
  });
});

test('Enter pelo despachante chega ao helper com elemento e evento', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    w.htmlPro('body', `<div class="ui-dialog"><input id="campo" data-spro-keypress="confirmarDialogoNoEnterPro" data-spro-args="${w.argsPro('$el', '$ev')}"><button class="confirm ui-button">ok</button></div>`, 'append');
    $('.confirm').on('click', () => { n++; });
    $('#campo').trigger($.Event('keypress', { which: 13 }));
    assert.equal(n, 1);
  });
});

test('removerAncestralPro remove o ancestral indicado', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="lista"><span class="item"><i id="x">x</i></span></div>');
    w.removerAncestralPro(w.document.getElementById('x'), 'span');
    assert.equal($('#lista .item').length, 0);
  });
});

// --- iframe aninhado do SEI 4.1: o resolvedor sobe de janela ---------------------------------
function aninhar(w) {
  const ifr1 = w.document.createElement('iframe'); w.document.body.appendChild(ifr1);
  const d1 = ifr1.contentDocument; d1.body.innerHTML = '';
  const ifr2 = d1.createElement('iframe'); d1.body.appendChild(ifr2);
  const d2 = ifr2.contentDocument; d2.body.innerHTML = '<div id="caixa"></div>';
  return { w1: ifr1.contentWindow, d2 };
}

test('acao num iframe aninhado acha parent.fn no topo quando o pai imediato nao a tem', () => {
  comJanela(({ w, $ }) => {
    const { d2 } = aninhar(w);
    let n = 0;
    w.acaoDoTopo = function () { n++; };
    w.htmlPro($(d2.getElementById('caixa')), '<a id="x" data-spro-click="parent.acaoDoTopo">c</a>', 'append');
    d2.getElementById('x').dispatchEvent(new d2.defaultView.MouseEvent('click', { bubbles: true }));
    assert.equal(n, 1);
  });
});

test('acao sem prefixo tambem sobe de janela, e a funcao local sempre ganha', () => {
  comJanela(({ w, $ }) => {
    const { w1, d2 } = aninhar(w);
    const quem = [];
    w.nivelada = function () { quem.push('topo'); };
    w.htmlPro($(d2.getElementById('caixa')), '<a id="x" data-spro-click="nivelada">c</a>', 'append');
    d2.getElementById('x').dispatchEvent(new d2.defaultView.MouseEvent('click', { bubbles: true }));
    d2.defaultView.nivelada = function () { quem.push('local'); };
    d2.getElementById('x').dispatchEvent(new d2.defaultView.MouseEvent('click', { bubbles: true }));
    assert.equal(quem.join(','), 'topo,local');
    assert.ok(w1);
  });
});

test('reescreverParentPro troca parent. no onclick e deixa os data-spro-* intactos', () => {
  comJanela(({ w }) => {
    const r = w.reescreverParentPro('<a onclick="parent.fn(this)" data-spro-click="parent.gn">x</a><b onclick="parent.getJanelaProcessoPro().hn()">y</b>');
    assert.match(r, /onclick="parent\.getJanelaProcessoPro\(\)\.fn\(this\)"/);
    assert.match(r, /data-spro-click="parent\.gn"/);
    assert.equal((r.match(/getJanelaProcessoPro/g) || []).length, 2, 'nao reescreve duas vezes');
  });
});

test('data-spro-mouseover dispara junto com o tooltip, e antes dele', () => {
  comJanela(({ w, $ }) => {
    const ordem = [];
    w.atualizarDica = function (el) { ordem.push('acao:' + el.id); };
    w.infraTooltipMostrar = function (t) { ordem.push('tip:' + t); };
    w.infraTooltipOcultar = function () {};
    w.htmlPro('body', '<a id="x" data-spro-mouseover="atualizarDica" data-spro-tip="Selecionar Tudo">c</a>', 'append');
    $('#x').trigger('mouseover');
    assert.equal(ordem.join(','), 'acao:x,tip:Selecionar Tudo');
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Rodar: `cd tests && node --test dom-seguro/plano2-bloco.test.mjs`
Esperado: FALHA na maioria, com `w.htmlCruPro is not a function`, `w.lerHtmlPro is not a function`
e afins. Os testes "sem data-spro-captura…", "acao com captura dispara uma vez so" (sem captura o
clique delegado já dispara uma vez) e "data-spro-blur…" podem **passar** já no RED: eles fixam
comportamento que existe e não pode regredir. Anotar quais passaram.

- [ ] **Step 3: Acrescentar o detector em `htmlPro`**

Em `dist/js/sei-functions-pro.js`, dentro de `htmlPro`, substituir:

```javascript
        limpo = sanitizarFragmentoPro(texto, doc);
    }
```

por:

```javascript
        // Fragmento que COMECA com <style>, <script>, <iframe>... some inteiro e sem passar pelo
        // DOMPurify.removed: o parser o manda para o <head> antes de o sanitizador olhar.
        if (/^\s*<(style|script|iframe|link|meta|object|embed)\b/i.test(texto)) avisarPro('htmlPro: fragmento comeca com uma tag que nunca sobrevive ao portao -- construir por DOM API', texto.slice(0, 60));
        limpo = sanitizarFragmentoPro(texto, doc);
        relatarRemocoesPro();
    }
```

- [ ] **Step 4: Tooltip com título**

Em `mostrarTipPro`, substituir:

```javascript
        } else if (typeof win.infraTooltipMostrar === 'function') {
            win.infraTooltipMostrar(texto);
        }
```

por:

```javascript
        } else if (typeof win.infraTooltipMostrar === 'function') {
            var titulo = el.getAttribute('data-spro-tip-titulo');
            if (titulo !== null) win.infraTooltipMostrar(texto, titulo);
            else win.infraTooltipMostrar(texto);
        }
```

- [ ] **Step 5: Captura no despachante**

Em `installActionsPro`, substituir:

```javascript
            $doc.on(evento + '.sproAcoes', '[' + atributo + ']', function (e) {
                dispararAcaoPro(this, e, atributo);
            });
        })(EVENTOS_ACAO_PRO[i]);
    }
```

por:

```javascript
            $doc.on(evento + '.sproAcoes', '[' + atributo + ']', function (e) {
                if (evento === 'click' && this.hasAttribute('data-spro-captura')) return;
                dispararAcaoPro(this, e, atributo);
            });
        })(EVENTOS_ACAO_PRO[i]);
    }
    // Acao que precisa PARAR a propagacao nao pode esperar a delegacao: quando o clique chega ao
    // documento, quem escuta num ancestral ja agiu -- o Dropzone, por exemplo, ja abriu o seletor
    // de arquivos. O onclick inline rodava no proprio alvo, antes disso. data-spro-captura liga a
    // acao na fase de CAPTURA do documento, que vem antes de todos.
    if (doc.addEventListener) {
        doc.addEventListener('click', function (ev) {
            var el = (ev.target && ev.target.closest) ? ev.target.closest('[data-spro-click][data-spro-captura]') : null;
            if (el) dispararAcaoPro(el, ev, 'data-spro-click');
        }, true);
    }
```

- [ ] **Step 6: Os helpers novos, antes da sentinela de fim**

Acrescentar imediatamente antes de `// === FIM SEI PRO DOM ===`:

```javascript
// Atributo removido nao deixa rastro: foi assim que o selo de prazo da janela de prescricoes
// perdeu o tooltip na 2.2.2 sem que teste, verificador ou validacao ao vivo notassem. O DOMPurify
// guarda em DOMPurify.removed o que tirou na ULTIMA chamada; aqui isso vira aviso no console, uma
// vez por assinatura, para que a validacao ao vivo enxergue a perda.
var REMOCOES_RELATADAS_PRO = {};
function relatarRemocoesPro() {
    var lista = (typeof DOMPurify !== 'undefined' && DOMPurify && DOMPurify.removed) ? DOMPurify.removed : [];
    for (var i = 0; i < lista.length; i++) {
        var r = lista[i], assinatura = null;
        if (r.attribute && /^on/i.test(r.attribute.name)) {
            var de = '?';
            if (r.from && r.from.tagName) {
                var classe = r.from.getAttribute ? (r.from.getAttribute('class') || '') : '';
                de = r.from.tagName.toLowerCase() + (classe ? '.' + classe.split(/\s+/)[0] : '');
            }
            assinatura = 'handler inline removido: ' + r.attribute.name + ' em <' + de + '> = ' + String(r.attribute.value).slice(0, 60);
        } else if (r.element && r.element.nodeType === 1 && /^(script|style|iframe|object|embed|link)$/i.test(r.element.tagName)) {
            assinatura = 'elemento removido: <' + r.element.tagName.toLowerCase() + '>';
        }
        if (assinatura && !REMOCOES_RELATADAS_PRO[assinatura]) {
            REMOCOES_RELATADAS_PRO[assinatura] = true;
            avisarPro('htmlPro: ' + assinatura);
        }
    }
}

// Insercao SEM sanitizar, com prazo de validade. Existe so para HTML que vem de funcao de arquivo
// ainda nao convertido e que ainda monta on*= (o getDatesPreview, por exemplo): o portao arrancaria
// o handler, e o usuario perderia tooltip e clique sem nenhum erro. O motivo e obrigatorio e tem
// formato fixo -- 'plano-3: <produtor>' --, porque o check-dom-injection conta estes usos: o plano 3
// so termina com ZERO deles, e a extensao so vai a AMO depois disso. Instala o despachante no
// documento de destino, que pode ser um iframe sem copia propria do sei-functions-pro.js.
function htmlCruPro(alvo, html, modo, motivo) {
    var $alvo = (alvo && alvo.jquery) ? alvo : $(alvo);
    if (!/^plano-3: [\w$.]+$/.test(String(motivo))) avisarPro('htmlCruPro sem motivo no formato "plano-3: <produtor>"', motivo);
    if (!$alvo.length) { avisarPro('htmlCruPro: alvo inexistente', alvo); return $alvo; }
    reescreverDocumentoPro($alvo, html, modo);
    if (typeof installActionsPro === 'function') installActionsPro($alvo[0].ownerDocument || document);
    return $alvo;
}

// Parse SO PARA LER. $(html) parseia no documento VIVO: um <img src=x onerror=...> que venha na
// resposta do servidor dispara ali mesmo, antes de qualquer insercao. O DOMParser devolve um
// documento inerte, sem contexto de navegacao: nada carrega, nada executa. Devolve os mesmos nos
// de topo que o $(html) devolvia -- o jQuery descarta as tags html/head/body e poe o conteudo das
// duas no mesmo nivel --, entao .find(), .filter(), .hasClass() e .html() respondem igual.
// Cuidado ao MOVER um desses nos para a pagina com .append(): o jQuery executa <script> que
// encontrar ao inserir.
function lerHtmlPro(html) {
    var texto = (html === null || html === undefined) ? '' : String(html);
    var ini = texto.indexOf('<'), fim = texto.lastIndexOf('>');
    if (ini < 0 || fim < ini) return $([]);
    var doc = new DOMParser().parseFromString(texto.slice(ini, fim + 1), 'text/html');
    var nos = Array.prototype.slice.call(doc.head.childNodes).concat(Array.prototype.slice.call(doc.body.childNodes));
    return $(nos);
}

// O valor que um token SOLTO teria dentro de um onclick: onclick="fn(482)" passava o numero 482,
// e onclick="fn(true)" o booleano. Montado por concatenacao ('fn('+id+')'), o token so existia como
// texto; argsPro(id) passaria a string "482" e um === com numero quebraria em silencio.
function literalInlinePro(v) {
    if (typeof v !== 'string') return v;
    var s = v.replace(/^\s+|\s+$/g, '');
    if (/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return Number(s);
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s === 'null') return null;
    if (s === 'undefined') return undefined;
    return v;
}

// onkeypress="if (event.which == 13) { $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click') }"
// aparecia igual em varios arquivos: Enter no campo confirma o dialogo.
function confirmarDialogoNoEnterPro(el, ev) {
    var tecla = ev ? (ev.which || ev.keyCode) : 0;
    if (tecla == 13) $(el).closest('.ui-dialog').find('.confirm.ui-button').trigger('click');
}

// onclick="$(this).closest('span').remove()" e variantes: remove o ancestral indicado.
function removerAncestralPro(el, seletor) {
    $(el).closest(seletor).remove();
}
```

- [ ] **Step 7: O resolvedor sobe de janela**

No SEI 4.1, o formulário do processo (Enviar Processo, por exemplo) fica num iframe **aninhado**,
e `parent.fn` a partir dali cai numa janela sem as funções do SEI Pro. O `onclick` inline dependia
do `getHtmlJanelaProcessoPro` reescrever o HTML; com `data-spro-*`, o resolvedor sobe sozinho.

No bloco, substituir:

```javascript
function resolverAcaoPro(nome, win) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(String(nome))) return null;
    var partes = String(nome).split('.');
```

por:

```javascript
// No SEI 4.1 o formulario do processo fica num iframe ANINHADO (ifrVisualizacao dentro de
// ifrConteudoVisualizacao): "parent.fn" a partir dali cai numa janela sem as funcoes do SEI Pro.
// O onclick inline dependia de getHtmlJanelaProcessoPro reescrever o HTML; aqui o resolvedor sobe
// de janela sozinho, ate o topo, quando nao acha o nome onde o elemento esta. A janela do proprio
// elemento vem primeiro: funcao local sempre ganha.
function resolverAcaoPro(nome, win) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(String(nome))) return null;
    var janela = win;
    for (var degrau = 0; janela && degrau < 6; degrau++) {
        var achado = resolverAcaoNaJanelaPro(nome, janela);
        if (achado) return achado;
        var pai = null;
        try { pai = janela.parent; } catch (e) { pai = null; }
        if (!pai || pai === janela) break;
        janela = pai;
    }
    return null;
}

function resolverAcaoNaJanelaPro(nome, win) {
    var partes = String(nome).split('.');
```

- [ ] **Step 8: A reescrita de `parent.` deixa os `data-spro-*` em paz**

Acrescentar antes de `// === FIM SEI PRO DOM ===`:

```javascript
// getHtmlJanelaProcessoPro troca "parent." por "parent.getJanelaProcessoPro()." no HTML que vai
// para o iframe aninhado do SEI 4.1, para o onclick inline alcancar as funcoes do SEI Pro. Dentro
// de um data-spro-*, a troca produziria um nome com parenteses, que o despachante recusa -- e la
// nem e preciso, porque resolverAcaoPro sobe de janela sozinho. A troca so atinge o que esta FORA
// dos atributos data-spro-*.
function reescreverParentPro(html) {
    return String(html).replace(/(data-spro-[a-z-]+="[^"]*")|\bparent\.(?!getJanelaProcessoPro\()/g, function (m, atributo) {
        return atributo ? atributo : 'parent.getJanelaProcessoPro().';
    });
}
```

E, **fora do bloco**, em `getHtmlJanelaProcessoPro` (hoje linha 128), substituir:

```javascript
    return String(html).replace(/\bparent\.(?!getJanelaProcessoPro\()/g, 'parent.getJanelaProcessoPro().');
}
```

por:

```javascript
    return reescreverParentPro(html);
}
```

A declaração de função é içada dentro do script, então `getHtmlJanelaProcessoPro` (linha 120)
enxerga `reescreverParentPro` (no bloco, depois) na hora da chamada.

- [ ] **Step 9: O despachante atende `mouseover` e `mouseout`**

O `sei-pro.js` tem `onmouseover="updateTipSelectAll(this)"` ao lado do tooltip "Selecionar Tudo":
a função atualiza a dica antes de ela aparecer. O codemod converte para `data-spro-mouseover`;
sem este passo, o despachante não o atenderia. Substituir:

```javascript
var EVENTOS_ACAO_PRO = ['click', 'change', 'input', 'blur', 'focus', 'keyup', 'keydown',
    'keypress', 'submit', 'dblclick', 'contextmenu', 'paste', 'mouseenter', 'mouseleave'];
```

por:

```javascript
var EVENTOS_ACAO_PRO = ['click', 'change', 'input', 'blur', 'focus', 'keyup', 'keydown',
    'keypress', 'submit', 'dblclick', 'contextmenu', 'paste', 'mouseenter', 'mouseleave',
    'mouseover', 'mouseout'];
```

As ações são ligadas antes do tooltip, então a ordem inline (a ação no `mouseover`, a dica no
`mouseenter`) se mantém.

- [ ] **Step 10: Rodar a suíte inteira**

Rodar: `cd tests && node --test dom-seguro/ 2>&1 | grep -E "^# (tests|pass|fail)"`
Esperado: `# pass 87`, `# fail 0` (62 do plano 1 + 25 novos).

- [ ] **Step 11: Acentos, sintaxe e commit**

```bash
node --check dist/js/sei-functions-pro.js
node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js   # contagem NAO pode subir
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: o handler arrancado passa a deixar rastro

O plano 1 publicou uma regressao que ninguem viu: o selo de prazo da
janela de prescricoes vem de uma funcao ainda nao convertida, com
onmouseover e onclick, e o portao arrancou os dois. Atributo removido nao
deixa rastro -- agora htmlPro le o DOMPurify.removed e avisa no console.

Mais os helpers que a triagem do plano 2 pediu: htmlCruPro (a excecao
provisoria para HTML de funcao nao convertida, contada e com motivo),
lerHtmlPro (parse inerte, sem o documento vivo), literalInlinePro (o tipo
que o onclick dava ao token solto), captura para acao que precisa parar
a propagacao, titulo no tooltip, e o resolvedor que sobe de janela -- no
iframe aninhado do SEI 4.1, parent.fn caia numa janela sem as funcoes.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 3: Os dois codemods, provados contra o comportamento real

**Files:**
- Create: `tools/converter-handlers.mjs` — `on*="..."` → `data-spro-*`
- Create: `tools/converter-insercoes.mjs` — `X.append(marcacao)` → `htmlPro(X, marcacao, 'append')`
- Create: `tests/ferramentas/converter-handlers.test.mjs`, `tests/ferramentas/converter-insercoes.test.mjs`
- Modify: `tests/package.json` (dependência de desenvolvimento `acorn`)

**Interfaces:**
- Consumes: `argsPro`, `literalInlinePro`, `htmlPro` e o despachante (Task 2) — o teste de
  equivalência roda o código convertido com o bloco real.
- Produces:
  - `converterFonte(fonte, nomes={args:'argsPro', literal:'literalInlinePro'}) -> { saida, contagem: {tooltip, oculta, chamada, comentario}, manuais }`
    — na árvore, `--args argsArvorePro --literal literalArvorePro` (a marcação é montada lá antes
    de o bloco local existir).
    e o CLI `node tools/converter-handlers.mjs <arquivo> [--aplicar]`.
  - `converterInsercoes(fonte, portao='htmlPro') -> { saida, literal, vazio, manuais }` e o CLI
    `node tools/converter-insercoes.mjs <arquivo> [--portao htmlArvorePro] [--aplicar]`.

**Por que dois codemods.** No plano 1 a revisão achou que **todos** os defeitos sérios vieram da
conversão mecânica feita com expressão regular — o pior, 12 `.append()` que viraram `htmlPro()`
sem o modo e passaram a substituir o conteúdo. Aqui a conversão é feita por ferramenta testada:

- `converter-handlers` converte só handler dentro de string de aspas simples (o padrão da
  extensão), nos formatos regulares — par de tooltip, `fn(this)`, `fn()`, `parent.fn(...)`,
  argumentos `this`/`event`/literais/`\'...\'`/concatenação. O resto fica intocado e listado.
  Usa o tokenizador `acorn`: um lexer caseiro, testado na triagem, se perdia em expressão
  regular e template literal.
- `converter-insercoes` trabalha na árvore sintática e **deriva o modo do verbo** — não há como
  perder o `'append'`. Converte só marcação literal; variável, chamada e nó jQuery ficam para a
  classificação por população. Recusa fragmento que começa com `<style>`/`<script>`/`<iframe>`.

**Dois defeitos que os protótipos destes codemods tiveram, e que os testes agora fixam:**
o primeiro lexer via handler "fora de string" (trocado pelo `acorn`); e o `converter-insercoes`
usava `nome in MODO`, que é verdadeiro para `hasOwnProperty` — `obj.hasOwnProperty('x')` viraria
`htmlPro(obj, 'x', ...)`, com sintaxe válida e o `favoritos` quebrando em silêncio (11 chamadas).
Quem pegou foi o `conferir-modos` por árvore sintática da Task 4.

**Medido na triagem (simulação sobre a base, os dois codemods em série):**

| arquivo | handlers | → tooltip | → ocultar | → chamada | comentário | manuais | inserções literais | `.html('')` | inserções manuais |
|---|---|---|---|---|---|---|---|---|---|
| `sei-pro-all.js` | 31 | 6 | 6 | 12 | 4 | 3 | 1 | 0 | 14 |
| `sei-pro-projetos.js` | 85 | 14 | 14 | 49 | 0 | 8 | 11 | 1 | 7 |
| `sei-pro-favoritos.js` | 98 | 20 | 21 | 52 | 0 | 5 | 7 | 4 | 12 |
| `sei-pro.js` | 103 | 29 | 29 | 42 | 0 | 3 | 25 | 4 | 42 |
| `sei-pro-arvore.js` | 126 | 30 | 30 | 54 | 6 | 6 | 13 | 0 | 23 |

Aplicados a cópias dos cinco: `node --check` passa, a contagem de acentos não muda, e o
`conferir-modos` dá **zero divergência** em todos.

- [ ] **Step 1: Instalar o `acorn` como dependência de desenvolvimento dos testes**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-dom-seguro/tests"
npm install --save-dev --no-fund --no-audit acorn@8
node -e "console.log(require('acorn/package.json').version)"
```
Esperado: `8.x`.

- [ ] **Step 2: Escrever os testes que falham**

`tests/ferramentas/converter-handlers.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { converterFonte } from '../../tools/converter-handlers.mjs';
import { montar, desmontar } from '../dom-seguro/harness.mjs';

// As fixtures sao CODIGO-FONTE JS, escritas com String.raw para que \' fique como no arquivo real.
const conv = (fonte) => converterFonte(fonte);

test('fn(this) e fn() viram data-spro-click sem argumentos', () => {
  const r = conv(String.raw`var h = '<a onclick="fn(this)">a</a><b onclick="gn()">b</b>';`);
  assert.equal(r.saida, String.raw`var h = '<a data-spro-click="fn">a</a><b data-spro-click="gn">b</b>';`);
  assert.equal(r.contagem.chamada, 2);
});

test('caminho pontuado e prefixo javascript: sao preservados e removidos', () => {
  const r = conv(String.raw`var h = '<a onclick="parent.parent.fn(this)">a</a><i onclick="javascript:gn(this)">b</i>';`);
  assert.match(r.saida, /data-spro-click="parent\.parent\.fn"/);
  assert.match(r.saida, /data-spro-click="gn"/);
});

test('par de tooltip vira data-spro-tip e o ocultar sai junto com o espaco', () => {
  const r = conv(String.raw`var h = '<a class="k" onmouseover="return infraTooltipMostrar(\'Ola\');" onmouseout="return infraTooltipOcultar();">x</a>';`);
  assert.equal(r.saida, String.raw`var h = '<a class="k" data-spro-tip="Ola">x</a>';`);
});

test('tooltip com concatenacao continua concatenando', () => {
  const r = conv(String.raw`var h = '<a onmouseover="return infraTooltipMostrar(\''+txt+'\')">x</a>';`);
  assert.equal(r.saida, String.raw`var h = '<a data-spro-tip="'+txt+'">x</a>';`);
});

test('_infraTooltipMostrar e o titulo do tooltip', () => {
  const r = conv(String.raw`var h = '<a onmouseover="return _infraTooltipMostrar(this, \'T\')">x</a><b onmouseover="return infraTooltipMostrar(\'texto\',\''+tit+'\')">y</b>';`);
  assert.match(r.saida, /data-spro-tip="T" data-spro-tip-el/);
  assert.match(r.saida, /data-spro-tip="texto" data-spro-tip-titulo="'\+tit\+'"/);
});

test('argumentos viram argsPro, com $el, $ev, String() e literalInlinePro()', () => {
  const r = conv(String.raw`var h = '<a onclick="fn(this, \'x\', \''+nome+'\', '+id+', event, true)">a</a>';`);
  assert.equal(r.saida, String.raw`var h = '<a data-spro-click="fn" data-spro-args="'+argsPro('$el', 'x', String(nome), literalInlinePro(id), '$ev', true)+'">a</a>';`);
});

test('nomes dos helpers configuraveis, para a arvore', () => {
  const r = converterFonte(String.raw`var h = '<a onclick="fn(this, '+id+')">a</a>';`, { args: 'argsArvorePro', literal: 'literalArvorePro' });
  assert.match(r.saida, /argsArvorePro\('\$el', literalArvorePro\(id\)\)/);
});

test('expressao com aspas dentro da concatenacao', () => {
  const r = conv(String.raw`var h = '<a onclick="fn(this, \''+(a ? 'x' : 'y')+'\')">a</a>';`);
  assert.match(r.saida, /argsPro\('\$el', String\(\(a \? 'x' : 'y'\)\)\)/);
});

test('o que nao e regular fica intocado e listado como manual', () => {
  const fonte = String.raw`var h = '<a onclick="f1(this);f2(this)">a</a><b onchange="'+fn+'(this)">b</b><i onclick="if (x) { y() }">c</i><u onkeypress="if (event.which == 13) { z() }">d</u>';`;
  const r = conv(fonte);
  assert.equal(r.saida, fonte);
  assert.equal(r.manuais.length, 4);
});

test('handler em comentario e ignorado, nao convertido nem listado', () => {
  const fonte = String.raw`// var h = '<a onclick="fn(this)">a</a>';
var g = 1;`;
  const r = conv(fonte);
  assert.equal(r.saida, fonte);
  assert.equal(r.contagem.comentario, 1);
  assert.equal(r.manuais.length, 0);
});

// O escape e montado em tempo de execucao: escrito literalmente neste arquivo, as ferramentas de
// edicao o convertem no proprio caractere (medido em 28/09/2026), e o teste deixaria de testar.
const BS = String.fromCharCode(92);
const ESC = BS + 'u00E7' + BS + 'u00E3';        // o "cao" de "Acao", escapado como em dist/js

test('a saida e JavaScript valido, ASCII, preserva os escapes e converter de novo nao muda nada', () => {
  const fonte = "var h = '<a onclick=\"fn(this, '+id+')\" onmouseover=\"return infraTooltipMostrar(" + BS + "'A" + ESC + "o" + BS + "')\" onmouseout=\"return infraTooltipOcultar();\">x</a>';";
  assert.ok([...fonte].every((c) => c.charCodeAt(0) < 128), 'a fixture tem de ser ASCII');
  const r = conv(fonte);
  assert.doesNotThrow(() => new vm.Script(r.saida));
  assert.ok([...r.saida].every((c) => c.charCodeAt(0) < 128), 'saida tem de ser ASCII');
  assert.ok(r.saida.includes('data-spro-tip="A' + ESC + 'o"'), r.saida);
  assert.equal(conv(r.saida).saida, r.saida);
});

// --- Equivalencia: o que a funcao recebe pelo onclick inline REAL e pelo despachante (Review Focus 4)
// O jsdom com runScripts 'dangerously' executa o atributo onclick como o navegador. Mesmo clique,
// mesma funcao: argumentos e TIPOS tem de ser identicos.
function viaInline(fonte, vars) {
  const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'dangerously' });
  const w = dom.window;
  w.__rec = [];
  w.eval(`${vars}; function rec(){ window.__rec.push(Array.prototype.map.call(arguments, function(a){ return a && a.nodeType ? 'EL:' + a.id : (typeof a) + ':' + String(a); })); }`);
  w.eval(fonte + '; document.body.innerHTML = h;');
  w.document.getElementById('alvo').click();
  const r = JSON.stringify(w.__rec);
  dom.window.close();
  return r;
}
function viaDespachante(fonte, vars) {
  const ctx = montar();
  try {
    const { w } = ctx;
    w.__rec = [];
    w.eval(`${vars}; function rec(){ window.__rec.push(Array.prototype.map.call(arguments, function(a){ return a && a.nodeType ? 'EL:' + a.id : (typeof a) + ':' + String(a); })); }`);
    w.eval(converterFonte(fonte).saida);
    w.htmlPro('body', w.h, 'append');
    w.document.getElementById('alvo').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    return JSON.stringify(w.__rec);
  } finally { desmontar(ctx); }
}

test('equivalencia: mesmos argumentos e mesmos tipos que o onclick inline', () => {
  const fonte = String.raw`var h = '<a id="alvo" onclick="rec(this, \''+nome+'\', '+id+', '+idTexto+', '+flag+', \'fixo\', 7)">x</a>';`;
  const vars = `var nome = 'Ofício 12/2026'; var id = 482; var idTexto = '0482'; var flag = true;`;
  const inline = viaInline(fonte, vars);
  assert.notEqual(inline, '[]', 'o onclick inline tem de ter disparado');
  assert.equal(viaDespachante(fonte, vars), inline);
});

test('equivalencia: sem argumento e so com this', () => {
  const fonte = String.raw`var h = '<button id="alvo" onclick="rec(this)">x</button>';`;
  assert.equal(viaDespachante(fonte, ''), viaInline(fonte, ''));
});

test('equivalencia do tooltip: o SEI recebe o mesmo texto', () => {
  const fonte = String.raw`var h = '<a id="alvo" onmouseover="return infraTooltipMostrar(\'Prazo: '+dias+' dias\', \''+tit+'\')" onmouseout="return infraTooltipOcultar();">x</a>';`;
  const vars = `var dias = 3; var tit = 'Controle';`;
  const inline = (() => {
    const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'dangerously' });
    const w = dom.window; w.__rec = [];
    w.eval(`${vars}; function infraTooltipMostrar(a, b){ window.__rec.push(a + '|' + b); return true; } function infraTooltipOcultar(){}`);
    w.eval(fonte + '; document.body.innerHTML = h;');
    w.document.getElementById('alvo').dispatchEvent(new w.MouseEvent('mouseover', { bubbles: true }));
    const r = JSON.stringify(w.__rec); dom.window.close(); return r;
  })();
  const ctx = montar();
  try {
    const { w } = ctx; w.__rec = [];
    w.eval(`${vars}; window.infraTooltipMostrar = function(a, b){ window.__rec.push(a + '|' + b); }; window.infraTooltipOcultar = function(){};`);
    w.eval(converterFonte(fonte).saida);
    w.htmlPro('body', w.h, 'append');
    w.document.getElementById('alvo').dispatchEvent(new w.MouseEvent('mouseover', { bubbles: true }));
    assert.equal(JSON.stringify(w.__rec), inline);
  } finally { desmontar(ctx); }
});
```

`tests/ferramentas/converter-insercoes.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { converterInsercoes } from '../../tools/converter-insercoes.mjs';

const conv = (f, portao) => converterInsercoes(f, portao);

test('append com marcacao literal vira htmlPro com o modo do verbo', () => {
  assert.equal(conv("$('#a').append('<b>x</b>');").saida, "htmlPro($('#a'), '<b>x</b>', 'append');");
});

test('html() nao leva modo; os outros verbos levam o seu', () => {
  const r = conv("a.html('<i>1</i>'); b.prepend('<i>2</i>'); c.before('<i>3</i>'); d.after('<i>4</i>'); e.replaceWith('<i>5</i>');");
  assert.equal(r.saida, "htmlPro(a, '<i>1</i>'); htmlPro(b, '<i>2</i>', 'prepend'); htmlPro(c, '<i>3</i>', 'before'); htmlPro(d, '<i>4</i>', 'after'); htmlPro(e, '<i>5</i>', 'replace');");
});

test('a cadeia continua: o receptor inteiro entra e o resto da cadeia fica', () => {
  const r = conv("$('#t').find('td').eq(1).after('<i>'+x+'</i>').show();");
  assert.equal(r.saida, "htmlPro($('#t').find('td').eq(1), '<i>'+x+'</i>', 'after').show();");
});

test(".html('') vira .empty()", () => {
  assert.equal(conv("$('#a').html('');").saida, "$('#a').empty();");
});

test('template literal e concatenacao com pedaco literal sao convertidos', () => {
  const r = conv("x.html(`<p>${a}</p>`); y.append(pre + '<b>' + pos);");
  assert.equal(r.literal, 2);
});

test('argumento que nao e marcacao literal fica intocado e vai para manuais', () => {
  const f = "x.append(html); y.after($(this).clone()); z.html(montar());";
  const r = conv(f);
  assert.equal(r.saida, f);
  assert.equal(r.manuais.length, 3);
});

test('hasOwnProperty, toString e afins nunca sao tratados como insercao', () => {
  const f = "if (obj.hasOwnProperty('chave') && o.toString('x') && o.constructor('y')) {}";
  const r = conv(f);
  assert.equal(r.saida, f);
  assert.equal(r.manuais.length, 0);
});

test('fragmento que comeca com <style> ou <script> vai para manuais (precisa DOM API)', () => {
  const f = "$('head').append(\"<style type='text/css'>.x{}</style>\"); $('head').prepend('<script>x()</script>');";
  const r = conv(f);
  assert.equal(r.saida, f);
  assert.equal(r.manuais.length, 2);
  assert.match(r.manuais[0].trecho, /DOM API/);
});

test('portao configuravel, para a arvore', () => {
  assert.equal(conv("$('#a').append('<b>x</b>');", 'htmlArvorePro').saida, "htmlArvorePro($('#a'), '<b>x</b>', 'append');");
});

test('insercao dentro de insercao: a interna fica manual, nenhuma troca se sobrepoe', () => {
  const r = conv("a.append(b.html('<i>x</i>') + '<b>y</b>');");
  assert.doesNotThrow(() => new vm.Script(r.saida));
  assert.equal(r.literal, 1);
  assert.equal(r.manuais.length, 1);
});
```

Nota: o escape do teste de ASCII é montado com `String.fromCharCode(92)` de propósito. Escrito
literalmente, as ferramentas de edição o convertem no próprio caractere (medido em 28/09/2026) e
o teste deixaria de testar o que diz.

- [ ] **Step 3: Rodar e confirmar que falha**

Rodar: `cd tests && node --test ferramentas/`
Esperado: FALHA de importação — `Cannot find module '.../tools/converter-handlers.mjs'` (e o
mesmo para `converter-insercoes.mjs`).

- [ ] **Step 4: Escrever `tools/converter-handlers.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Codemod: converte handlers inline (on<evento>="...") em atributos data-spro-*.
 *
 * POR QUE EXISTE. No plano 1 a conversao foi feita com substituicoes por expressao regular, e a
 * revisao achou que TODOS os defeitos serios vieram dessa parte mecanica (modo de insercao perdido,
 * leitor esquecido). Este codemod converte so os formatos regulares, de modo deterministico, e
 * deixa o resto intocado numa lista de "manuais". O teste de equivalencia em
 * tests/ferramentas/converter-handlers.test.mjs compara, clique a clique, o que a funcao recebe
 * pelo onclick inline real e pelo despachante -- valor E tipo.
 *
 * So converte handler que esta dentro de string JS de ASPAS SIMPLES (o padrao da extensao).
 * O valor do atributo pode atravessar concatenacoes ('+expr+').
 *
 * Uso:
 *   node tools/converter-handlers.mjs <arquivo.js>            (simulacao: conta e lista manuais)
 *   node tools/converter-handlers.mjs <arquivo.js> --aplicar  (grava)
 *   node tools/converter-handlers.mjs <arquivo.js> --args argsArvorePro --literal literalArvorePro --aplicar   (na arvore)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// Eventos que o despachante atende (EVENTOS_ACAO_PRO no sei-functions-pro.js).
const EVENTOS_ACAO = ['click', 'change', 'input', 'blur', 'focus', 'keyup', 'keydown', 'keypress',
  'submit', 'dblclick', 'contextmenu', 'paste', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout'];
const RE_ATRIBUTO = /(\s?)\bon(click|change|blur|focus|input|keyup|keydown|keypress|submit|mouseover|mouseout|mouseenter|mouseleave|dblclick|contextmenu|paste)="/g;
const PH = (i) => '\u0001' + i + '\u0001';

// --- 1. Onde estao as strings de aspas simples e os comentarios -------------------------------
// Tokenizador de verdade (acorn), instalado em tests/. Um lexer caseiro se perdia em expressao
// regular e template literal e passava a ver handler "fora de string" onde nao estava.
const exigir = createRequire(new URL('../tests/package.json', import.meta.url));
const acorn = exigir('acorn');

export function analisarFonte(fonte) {
  const spans = [];
  const comentarios = [];
  for (const t of acorn.tokenizer(fonte, { ecmaVersion: 'latest', onComment: (b, txt, ini, fim) => comentarios.push([ini, fim]) })) {
    if (t.type.label === 'string' && fonte[t.start] === "'") spans.push([t.start + 1, t.end - 1]);
  }
  return { spans, comentarios };
}

function spanDe(spans, pos) {
  let lo = 0, hi = spans.length - 1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (pos < spans[m][0]) hi = m - 1; else if (pos >= spans[m][1]) lo = m + 1; else return m;
  }
  return -1;
}

function parentesesEquilibrados(txt) {
  let prof = 0, q = null;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '(' || c === '[' || c === '{') prof++;
    else if (c === ')' || c === ']' || c === '}') { if (--prof < 0) return false; }
  }
  return prof === 0 && !q;
}

// --- 2. O valor do atributo, atravessando concatenacoes -------------------------------------
function coletarValor(fonte, spans, s, p) {
  const segs = [];
  for (let guarda = 0; guarda < 40; guarda++) {
    const fim = spans[s][1];
    const q = fonte.indexOf('"', p);
    if (q !== -1 && q < fim) { segs.push({ lit: fonte.slice(p, q) }); return { segs, fechamento: q }; }
    segs.push({ lit: fonte.slice(p, fim) });
    let achou = -1, expr = null;
    for (let j = s + 1; j < Math.min(spans.length, s + 12); j++) {
      if (fonte[spans[j][0] - 1] !== "'") continue;
      const meio = fonte.slice(fim + 1, spans[j][0] - 1);
      const m = /^\s*\+([\s\S]*)\+\s*$/.exec(meio);
      if (m && parentesesEquilibrados(m[1]) && !/\n\s*\n/.test(meio)) { achou = j; expr = m[1].trim(); break; }
    }
    if (achou < 0) return null;
    segs.push({ cod: expr });
    s = achou; p = spans[achou][0];
  }
  return null;
}

// --- 3. Interpretar o corpo do handler ------------------------------------------------------
function dividirArgs(txt) {
  const args = [];
  let prof = 0, dentro = false, atual = '';
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (c === '\\' && txt[i + 1] === "'") { dentro = !dentro; atual += "\\'"; i++; continue; }
    if (!dentro) {
      if (c === '(') prof++;
      else if (c === ')') { if (--prof < 0) return null; }
      else if (c === ';') return null;
      else if (c === ',' && prof === 0) { args.push(atual.trim()); atual = ''; continue; }
    }
    atual += c;
  }
  if (dentro || prof !== 0) return null;
  if (atual.trim() !== '' || args.length) args.push(atual.trim());
  return args;
}

function argParaJs(a, exprs, nomes) {
  if (a === 'this') return "'$el'";
  if (a === 'event') return "'$ev'";
  if (/^-?\d+(\.\d+)?$/.test(a) || a === 'true' || a === 'false' || a === 'null') return a;
  let m = /^\\'([\s\S]*)\\'$/.exec(a);
  if (m) {
    const interno = m[1];
    if (interno.indexOf("\\'") !== -1 || interno.indexOf('\\\\') !== -1) return null;
    const partes = interno.split(/\u0001(\d+)\u0001/);
    if (partes.length === 3 && partes[0] === '' && partes[2] === '') return 'String(' + exprs[+partes[1]] + ')';
    const pedacos = [];
    for (let i = 0; i < partes.length; i++) {
      if (i % 2 === 0) { if (partes[i] !== '') pedacos.push("'" + partes[i] + "'"); }
      else pedacos.push('(' + exprs[+partes[i]] + ')');
    }
    if (!pedacos.length) return "''";
    if (pedacos.every((x) => x[0] === '(')) pedacos.unshift("''");   // garante concatenacao de string
    return pedacos.join(' + ');
  }
  m = /^\u0001(\d+)\u0001$/.exec(a);
  if (m) return nomes.literal + '(' + exprs[+m[1]] + ')';
  return null;
}

function textoDeTooltip(a, exprs) {
  const m = /^\\'([\s\S]*)\\'$/.exec(a);
  if (!m || m[1].indexOf("\\'") !== -1 || m[1].indexOf('\\\\') !== -1) return null;
  return m[1].replace(/\u0001(\d+)\u0001/g, (_, i) => "'+" + exprs[+i] + "+'");
}

const RE_TIP = /^return\s+(_?)infraTooltipMostrar\(([\s\S]*)\)\s*;?\s*$/;
const RE_OCULTA = /^return\s+infraTooltipOcultar\(\s*\)\s*;?\s*$/;
const RE_CHAMADA = /^(?:javascript:\s*)?((?:parent\.)*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(([\s\S]*)\)\s*;?\s*$/;
const PALAVRAS = /^(if|for|while|return|typeof|new|var|function|switch)$/;

function converterCorpo(evento, bruto, exprs, nomes) {
  const corpo = bruto.trim();
  if (evento === 'mouseout' || evento === 'mouseleave') {
    if (RE_OCULTA.test(corpo)) return { tipo: 'oculta', saida: '' };
  }
  if (evento === 'mouseover' || evento === 'mouseenter') {
    const t = RE_TIP.exec(corpo);
    if (t) {
      const args = dividirArgs(t[2]);
      if (!args) return null;
      const comEl = t[1] === '_';
      if (comEl && args.shift() !== 'this') return null;
      if (args.length < 1 || args.length > 2) return null;
      const texto = textoDeTooltip(args[0], exprs);
      if (texto === null) return null;
      let saida = 'data-spro-tip="' + texto + '"';
      if (args[1] !== undefined) {
        const titulo = textoDeTooltip(args[1], exprs);
        if (titulo === null) return null;
        saida += ' data-spro-tip-titulo="' + titulo + '"';
      }
      if (comEl) saida += ' data-spro-tip-el';
      return { tipo: 'tooltip', saida };
    }
  }
  if (EVENTOS_ACAO.indexOf(evento) === -1) return null;
  const c = RE_CHAMADA.exec(corpo);
  if (!c || c[1].indexOf('\u0001') !== -1 || PALAVRAS.test(c[1].split('.').pop())) return null;
  const args = dividirArgs(c[2]);
  if (!args) return null;
  const js = args.map((a) => argParaJs(a, exprs, nomes));
  if (js.some((x) => x === null)) return null;
  const semArgs = args.length === 0 || (args.length === 1 && args[0] === 'this');
  return {
    tipo: 'chamada',
    saida: 'data-spro-' + evento + '="' + c[1] + '"' + (semArgs ? '' : ' data-spro-args="\'+' + nomes.args + '(' + js.join(', ') + ')+\'"'),
  };
}

// --- 4. Aplicar no arquivo inteiro ----------------------------------------------------------
// nomes: os helpers chamados NA MONTAGEM da string. Na arvore o bloco pode ainda nao ter carregado
// quando a marcacao e montada (init_arvore.js pede os dois arquivos em paralelo), entao la se usam
// os resolvedores argsArvorePro/literalArvorePro, que caem para os do topo.
export function converterFonte(fonte, nomes = { args: 'argsPro', literal: 'literalInlinePro' }) {
  const { spans, comentarios } = analisarFonte(fonte);
  const emComentario = (pos) => comentarios.some(([i, f]) => pos >= i && pos < f);
  const trocas = [];
  const manuais = [];
  const contagem = { tooltip: 0, oculta: 0, chamada: 0, comentario: 0 };
  RE_ATRIBUTO.lastIndex = 0;
  let m;
  while ((m = RE_ATRIBUTO.exec(fonte))) {
    const inicioAttr = m.index + m[1].length;
    const linha = fonte.slice(0, m.index).split('\n').length;
    if (emComentario(inicioAttr)) { contagem.comentario++; continue; }
    const s = spanDe(spans, inicioAttr);
    if (s < 0) { manuais.push({ linha, motivo: 'fora de string de aspas simples', trecho: fonte.slice(inicioAttr, inicioAttr + 90) }); continue; }
    const valor = coletarValor(fonte, spans, s, m.index + m[0].length);
    if (!valor) { manuais.push({ linha, motivo: 'valor nao delimitado', trecho: fonte.slice(inicioAttr, inicioAttr + 90) }); continue; }
    const exprs = [];
    let bruto = '';
    for (const sg of valor.segs) { if ('lit' in sg) bruto += sg.lit; else { bruto += PH(exprs.length); exprs.push(sg.cod); } }
    const r = converterCorpo(m[2], bruto, exprs, nomes);
    if (!r) { manuais.push({ linha, motivo: 'formato nao regular', trecho: ('on' + m[2] + '="' + bruto.replace(/\u0001(\d+)\u0001/g, (_, i) => "'+" + exprs[+i] + "+'")).slice(0, 110) }); continue; }
    contagem[r.tipo]++;
    // Removendo o atributo (oculta), leva junto o espaco que o precedia.
    const ini = r.saida === '' ? m.index : inicioAttr;
    trocas.push({ ini, fim: valor.fechamento + 1, saida: r.saida });
    RE_ATRIBUTO.lastIndex = valor.fechamento + 1;
  }
  let saida = fonte;
  for (let i = trocas.length - 1; i >= 0; i--) saida = saida.slice(0, trocas[i].ini) + trocas[i].saida + saida.slice(trocas[i].fim);
  return { saida, contagem, manuais };
}

// --- CLI ---------------------------------------------------------------------------------------
if (import.meta.url === 'file://' + process.argv[1]) {
  const arquivo = process.argv[2];
  if (!arquivo) { console.error('uso: node tools/converter-handlers.mjs <arquivo.js> [--args nome --literal nome] [--aplicar]'); process.exit(2); }
  const fonte = readFileSync(arquivo, 'utf8');
  const opc = (n, pad) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : pad; };
  const r = converterFonte(fonte, { args: opc('--args', 'argsPro'), literal: opc('--literal', 'literalInlinePro') });
  console.log(`\n=== ${arquivo} ===`);
  console.log(`tooltips ${r.contagem.tooltip} | ocultar removidos ${r.contagem.oculta} | chamadas ${r.contagem.chamada} | em comentario (ignorados) ${r.contagem.comentario} | manuais ${r.manuais.length}`);
  for (const x of r.manuais) console.log(`   MANUAL ${arquivo}:${x.linha}  (${x.motivo})  ${x.trecho}`);
  if (process.argv.includes('--aplicar')) { writeFileSync(arquivo, r.saida); console.log('\ngravado.'); }
  else console.log('\n(simulacao; use --aplicar para gravar)');
}
```

- [ ] **Step 5: Escrever `tools/converter-insercoes.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Codemod de INSERCAO: X.html(markup) / X.append(markup) / ... viram htmlPro(X, markup, 'modo').
 *
 * POR QUE EXISTE. O defeito critico do plano 1 nasceu aqui: 12 conversoes de .append() viraram
 * htmlPro() sem o terceiro argumento e passaram a SUBSTITUIR o conteudo. Este codemod trabalha na
 * arvore sintatica (acorn) e deriva o modo do proprio verbo -- nao ha como perder o 'append'.
 *
 * Converte so quando o argumento e MARCACAO LITERAL: string, template literal, ou concatenacao que
 * tenha ao menos um pedaco literal. .html('') vira .empty(). Todo o resto (variavel, chamada,
 * no jQuery) vai para a lista de manuais, porque exige decidir a populacao: P1 htmlPro, P2 texto,
 * P4 mover o no, P5 lerHtmlPro, ou htmlCruPro para HTML de produtor pendente.
 * O receptor e presumido jQuery (e o padrao da extensao); conferir no diff.
 *
 * Uso:
 *   node tools/converter-insercoes.mjs <arquivo.js>            (simulacao)
 *   node tools/converter-insercoes.mjs <arquivo.js> --aplicar
 *   node tools/converter-insercoes.mjs <arquivo.js> --portao htmlArvorePro --aplicar   (na arvore)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const acorn = createRequire(new URL('../tests/package.json', import.meta.url))('acorn');
const MODO = { html: null, append: 'append', prepend: 'prepend', before: 'before', after: 'after', replaceWith: 'replace' };

function temLiteral(no) {
  if (!no) return false;
  if (no.type === 'Literal' && typeof no.value === 'string') return true;
  if (no.type === 'TemplateLiteral') return true;
  if (no.type === 'BinaryExpression' && no.operator === '+') return temLiteral(no.left) || temLiteral(no.right);
  return false;
}

// Um fragmento que COMECA com estas tags nunca sobrevive ao portao, e sem deixar rastro no
// DOMPurify.removed: o parser as manda para o <head> antes de o sanitizador olhar.
const TAG_QUE_SOME = /^\s*<(style|script|iframe|link|meta|object|embed)\b/i;
function primeiroLiteral(no) {
  if (no.type === 'Literal') return String(no.value);
  if (no.type === 'TemplateLiteral') return no.quasis[0].value.cooked || '';
  if (no.type === 'BinaryExpression') return primeiroLiteral(no.left);
  return '';
}

function visitar(no, fn) {
  if (!no || typeof no.type !== 'string') return;
  fn(no);
  for (const k of Object.keys(no)) {
    if (k === 'start' || k === 'end') continue;
    const v = no[k];
    if (Array.isArray(v)) v.forEach((x) => visitar(x, fn));
    else if (v && typeof v.type === 'string') visitar(v, fn);
  }
}

export function converterInsercoes(fonte, portao = 'htmlPro') {
  const ast = acorn.parse(fonte, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
  const achados = [];
  visitar(ast, (no) => {
    if (no.type !== 'CallExpression' || no.arguments.length !== 1) return;
    const c = no.callee;
    // hasOwnProperty, e nao 'in': 'in' ve o que o objeto HERDA, e obj.hasOwnProperty('x') viraria
    // htmlPro(obj, 'x', ...) -- sintaxe valida, node --check passa, e o arquivo quebra em silencio.
    if (c.type !== 'MemberExpression' || c.computed || !Object.prototype.hasOwnProperty.call(MODO, c.property.name)) return;
    const verbo = c.property.name, arg = no.arguments[0];
    const linha = fonte.slice(0, no.start).split('\n').length;
    const recv = fonte.slice(c.object.start, c.object.end);
    if (verbo === 'html' && arg.type === 'Literal' && arg.value === '') {
      achados.push({ ini: no.start, fim: no.end, saida: recv + '.empty()', tipo: 'vazio', linha });
    } else if (temLiteral(arg) && TAG_QUE_SOME.test(primeiroLiteral(arg))) {
      achados.push({ tipo: 'manual', linha, trecho: 'comeca com tag que o sanitizador nunca deixa passar: construir por DOM API -- ' + fonte.slice(arg.start, Math.min(arg.end, arg.start + 60)).replace(/\s+/g, ' ') });
    } else if (temLiteral(arg)) {
      const modo = MODO[verbo];
      achados.push({ ini: no.start, fim: no.end, tipo: 'literal', linha,
        saida: portao + '(' + recv + ', ' + fonte.slice(arg.start, arg.end) + (modo ? ", '" + modo + "'" : '') + ')' });
    } else {
      achados.push({ tipo: 'manual', linha, trecho: fonte.slice(no.start, Math.min(no.end, no.start + 110)).replace(/\s+/g, ' ') });
    }
  });
  // Aplica do fim para o comeco; troca que se sobrepoe a outra ja aplicada vira manual.
  const trocas = achados.filter((a) => a.tipo !== 'manual').sort((a, b) => b.ini - a.ini);
  let saida = fonte, limite = Infinity;
  const aplicadas = [], manuais = achados.filter((a) => a.tipo === 'manual');
  for (const t of trocas) {
    if (t.fim > limite) { manuais.push({ tipo: 'manual', linha: t.linha, trecho: 'sobreposta a outra insercao' }); continue; }
    saida = saida.slice(0, t.ini) + t.saida + saida.slice(t.fim);
    limite = t.ini;
    aplicadas.push(t);
  }
  const conta = (tp) => aplicadas.filter((a) => a.tipo === tp).length;
  return { saida, literal: conta('literal'), vazio: conta('vazio'), manuais: manuais.sort((a, b) => a.linha - b.linha) };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const arquivo = process.argv[2];
  if (!arquivo) { console.error('uso: node tools/converter-insercoes.mjs <arquivo.js> [--portao nome] [--aplicar]'); process.exit(2); }
  const i = process.argv.indexOf('--portao');
  const portao = i > 0 ? process.argv[i + 1] : 'htmlPro';
  const r = converterInsercoes(readFileSync(arquivo, 'utf8'), portao);
  console.log(`\n=== ${arquivo} ===`);
  console.log(`marcacao literal -> ${portao}: ${r.literal} | .html('') -> .empty(): ${r.vazio} | manuais: ${r.manuais.length}`);
  for (const m of r.manuais) console.log(`   MANUAL ${arquivo}:${m.linha}  ${m.trecho}`);
  if (process.argv.includes('--aplicar')) { writeFileSync(arquivo, r.saida); console.log('\ngravado.'); }
  else console.log('\n(simulacao; use --aplicar para gravar)');
}
```

- [ ] **Step 6: Rodar os testes**

Rodar: `cd tests && node --test ferramentas/ dom-seguro/ 2>&1 | grep -E "^# (pass|fail)"`
Esperado: `# pass 111`, `# fail 0` (24 de ferramentas + 87 do bloco).

- [ ] **Step 7: Simular nos cinco arquivos e conferir a tabela**

```bash
for f in sei-pro-all sei-pro-projetos sei-pro-favoritos sei-pro sei-pro-arvore; do
  node tools/converter-handlers.mjs dist/js/$f.js | grep -E "^tooltips"
done
```
Esperado: as cinco primeiras colunas da tabela. (A simulação do `converter-insercoes` só dá os
números da tabela **depois** do `converter-handlers` aplicado; é feita em cada task de arquivo.)

- [ ] **Step 8: Não há commit** — `tools/` e `tests/` são ignorados pelo git.

---
## Task 4: Os detectores — produtor pendente, paridade, modos por árvore sintática, parse no documento vivo

**Files:**
- Create: `tools/produtores-pendentes.mjs`
- Create: `tools/paridade-acoes.mjs`
- Replace: `tools/conferir-modos.mjs`, `tools/check-dom-injection.mjs`, `tools/diff-sanitize.mjs` (versões novas, inteiras abaixo)

**Interfaces:**
- Consumes: `acorn` (Task 3); a lista `ARQUIVOS_CONVERTIDOS` do `check-dom-injection.mjs`, que o
  `produtores-pendentes.mjs` lê — uma fonte de verdade só.
- Produces:
  - `node tools/produtores-pendentes.mjs <arquivo>` — sai com 1 se algum `htmlPro`/`htmlArvorePro`
    recebe HTML de produtor pendente; lista as exceções já registradas com `htmlCruPro`.
  - `node tools/paridade-acoes.mjs <arquivo> [ref]` — pares (evento, função) cuja **contagem** caiu.
  - `node tools/conferir-modos.mjs <arquivo> [ref]` — agora por árvore sintática e por ordem de
    ocorrência; sai com 1 se houver divergência.
  - `check-dom-injection.mjs`: ignora comentários; reprova parse no documento vivo (`$(html)` com
    nome de variável de HTML) e `outerHTML` reparseado; exige motivo literal `'plano-3: <produtor>'`
    em todo `htmlCruPro` e os conta; aceita `htmlArvorePro`/`htmlCruPro` na auditoria de modo.
  - `diff-sanitize.mjs`: ignora comentários; acusa tag perdida só quando ela começa um fragmento
    que não é continuação de concatenação (ou é das que somem em qualquer posição).

**Os defeitos das versões do plano 1 que esta task corrige:**
- `conferir-modos` lia as chamadas por expressão regular e se perdia em conteúdo com parêntese
  (`')'` dentro de string, `(i+1)`, `rgba(...)`): acusou 3 divergências falsas na árvore. E casava
  sempre com a **primeira** ocorrência de um conteúdo na base: `iconStar` inserido com dois verbos
  diferentes em dois pontos virava divergência. A versão nova lê pela árvore sintática e casa pela
  ordem de ocorrência.
- `check-dom-injection` e `diff-sanitize` acusavam código **comentado**.
- `diff-sanitize` acusava `<caption>` numa tabela montada em strings concatenadas.

**Medido na triagem, com as versões abaixo:**
- `produtores-pendentes` acusa **um** ponto nos cinco arquivos do plano 1: `sei-pro-prescricoes.js:148`
  (a regressão publicada). Zero nos outros quatro.
- `check-dom-injection` acusa **13** parses no documento vivo, todos em `sei-pro-docs-lote.js`
  (linhas 50, 492, 510, 519, 551, 717, 720, 745, 1182, 1211, 1230, 1376, 1441) — tratados na
  Task 11 — e mais nada.
- `diff-sanitize` acusa só os achados reais: `<iframe>` no `all`, `<script>` no `favoritos`,
  `<style>` e `div[contenteditable]` na árvore.
- `conferir-modos`, aplicado depois dos dois codemods em cópias dos cinco arquivos: zero divergência.

- [ ] **Step 1: Escrever `tools/produtores-pendentes.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Acusa HTML de "produtor pendente" que entra pelo portao sanitizador.
 *
 * POR QUE EXISTE. Na 2.2.2 o selo de prazo da janela de prescricoes perdeu tooltip e clique: ele
 * vem do getDatesPreview, funcao do sei-functions-pro.js (ainda nao convertido), que monta onclick
 * e onmouseover; o prescricoes, ja convertido, passou esse HTML por htmlPro, e o sanitizador
 * arrancou os dois. Nenhum teste viu. Este detector acha o caso ANTES de publicar.
 *
 * Produtor pendente = funcao de um arquivo de dist/js AINDA NAO convertido (fora da lista
 * ARQUIVOS_CONVERTIDOS do check-dom-injection.mjs) que devolve HTML com on*=.
 * No arquivo alvo, por funcao: variaveis contaminadas por produtor (ponto fixo) e chamadas de
 * htmlPro/htmlArvorePro cujo argumento contem produtor ou variavel contaminada.
 *
 * Uso: node tools/produtores-pendentes.mjs dist/js/sei-pro-prescricoes.js
 * Sai com codigo 1 se houver htmlPro contaminado (o caso que quebra).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const alvo = process.argv[2];
if (!alvo) { console.error('uso: node tools/produtores-pendentes.mjs <arquivo.js>'); process.exit(2); }

// Uma fonte de verdade: a lista de convertidos vem do proprio verificador.
const verificador = readFileSync(resolve(RAIZ, 'tools/check-dom-injection.mjs'), 'utf8');
const convertidos = new Set((/ARQUIVOS_CONVERTIDOS\s*=\s*\[([\s\S]*?)\]/.exec(verificador) || ['', ''])[1]
  .match(/dist\/js\/[\w.-]+\.js/g) || []);

// Corpos de funcao por "function NOME(" e "var NOME = function(" / "=> {". Aproximado, suficiente.
function funcoes(texto) {
  const RE = /(?:^|\n)[ \t]*(?:function\s+([A-Za-z_$][\w$]*)\s*\(|(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>))/g;
  const pos = [];
  let m;
  while ((m = RE.exec(texto))) pos.push({ nome: m[1] || m[2], ini: m.index });
  return pos.map((f, i) => ({ nome: f.nome, ini: f.ini, corpo: texto.slice(f.ini, i + 1 < pos.length ? pos[i + 1].ini : texto.length) }));
}

const RE_HANDLER = /\bon(click|change|mouseover|mouseout|blur|input|keypress|keyup|dblclick|mouseenter|mouseleave|paste)\s*=\s*\\?["']/;
const produtores = new Map();   // nome -> arquivo
for (const arq of readdirSync(resolve(RAIZ, 'dist/js')).filter((f) => f.endsWith('.js'))) {
  const rel = 'dist/js/' + arq;
  if (convertidos.has(rel) || rel === alvo || resolve(RAIZ, rel) === resolve(alvo)) continue;
  for (const f of funcoes(readFileSync(resolve(RAIZ, rel), 'utf8'))) {
    if (RE_HANDLER.test(f.corpo) && /\breturn\b/.test(f.corpo)) produtores.set(f.nome, arq);
  }
}

// Argumento de uma chamada que comeca em `ini` (logo apos o parentese de abertura).
function argumento(texto, ini) {
  let prof = 1, q = null;
  for (let i = ini; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '(') prof++;
    else if (c === ')' && --prof === 0) return texto.slice(ini, i);
  }
  return texto.slice(ini);
}

const texto = readFileSync(resolve(alvo), 'utf8');
const nomesProd = [...produtores.keys()];
const reProd = nomesProd.length ? new RegExp('\\b(' + nomesProd.join('|') + ')\\s*\\(') : null;
const achados = [];
for (const f of funcoes(texto)) {
  if (!reProd) break;
  // Ponto fixo: X = ...produtor(...)... ou X = ...Y... com Y contaminada (inclui +=).
  const contaminadas = new Set();
  for (let volta = 0; volta < 6; volta++) {
    const antes = contaminadas.size;
    const RE_ATRIB = /\b([A-Za-z_$][\w$]*)\s*(\+?=)(?!=)\s*([^;]*)/g;
    let a;
    while ((a = RE_ATRIB.exec(f.corpo))) {
      const expr = a[3];
      if (reProd.test(expr) || [...contaminadas].some((v) => new RegExp('\\b' + v.replace(/\$/g, '\\$') + '\\b').test(expr))) contaminadas.add(a[1]);
    }
    if (contaminadas.size === antes) break;
  }
  const RE_PORTAO = /\b(htmlPro|htmlArvorePro|htmlCruPro|htmlCruArvorePro)\s*\(/g;
  let c;
  while ((c = RE_PORTAO.exec(f.corpo))) {
    const arg = argumento(f.corpo, c.index + c[0].length);
    const prod = (reProd.exec(arg) || [])[1];
    const varC = [...contaminadas].find((v) => new RegExp('\\b' + v.replace(/\$/g, '\\$') + '\\b').test(arg));
    if (!prod && !varC) continue;
    const linha = texto.slice(0, f.ini + c.index).split('\n').length;
    const cru = /Cru/.test(c[1]);
    achados.push({ linha, portao: c[1], via: prod ? prod + '()' : 'variavel ' + varC, cru, funcao: f.nome });
  }
}

console.log(`\n=== ${alvo} ===`);
console.log(`${produtores.size} produtores pendentes conhecidos (funcoes de arquivos nao convertidos que montam on*=)`);
const errados = achados.filter((x) => !x.cru);
for (const x of achados) console.log(`${x.cru ? 'OK    ' : 'ERRO  '} ${alvo}:${x.linha}  ${x.portao}(... ${x.via} ...)  em ${x.funcao}()${x.cru ? '' : '  -> usar htmlCruPro(alvo, html, modo, \'plano-3: <produtor>\')'}`);
console.log(`\nprodutores-pendentes: ${errados.length} erro(s), ${achados.length - errados.length} excecao(oes) registrada(s)`);
process.exit(errados.length ? 1 : 0);
```

- [ ] **Step 2: Escrever `tools/paridade-acoes.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Paridade de acoes: todo handler que o arquivo tinha na base continua existindo depois?
 *
 * POR QUE EXISTE. A auditoria em runtime (auditActionsPro) diz se as acoes do DOM resolvem, mas
 * nao diz se alguma SUMIU na conversao -- acao que nao esta la nao aparece em auditoria nenhuma.
 * Aqui se compara, por (evento, funcao), a versao de base com a atual.
 *
 * Uso: node tools/paridade-acoes.mjs dist/js/sei-pro.js [ref]   (ref padrao: $SPRO_REF_BASE ou master)
 * Imprime os pares da base que nao aparecem mais como data-spro-<evento>="<funcao>". O esperado e
 * que sobrem SO os que viraram funcao nomeada -- cada task lista quais.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arquivo = process.argv[2];
const ref = process.argv[3] || process.env.SPRO_REF_BASE || 'master';
if (!arquivo) { console.error('uso: node tools/paridade-acoes.mjs <arquivo.js> [ref]'); process.exit(2); }

const base = execSync(`git show ${ref}:${arquivo}`, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const atual = readFileSync(resolve(RAIZ, arquivo), 'utf8');

const EV = 'click|change|blur|focus|input|keyup|keydown|keypress|submit|mouseover|mouseout|mouseenter|mouseleave|dblclick|contextmenu|paste';
function paresBase(t) {
  const out = new Map();
  const RE = new RegExp('\\bon(' + EV + ')="(?:javascript:\\s*)?((?:parent\\.)*[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*)\\s*\\(', 'g');
  let m;
  while ((m = RE.exec(t))) {
    if (/^_?infraTooltip(Mostrar|Ocultar)$/.test(m[2]) || /^(if|return)$/.test(m[2])) continue;
    const k = m[1] + ' ' + m[2]; out.set(k, (out.get(k) || 0) + 1);
  }
  return out;
}
function paresAtual(t) {
  const out = new Map();
  const RE = new RegExp('data-spro-(' + EV + ')="([^"]*)"', 'g');
  let m;
  while ((m = RE.exec(t))) { const k = m[1] + ' ' + m[2]; out.set(k, (out.get(k) || 0) + 1); }
  return out;
}
const b = paresBase(base), a = paresAtual(atual);
const tipsBase = (base.match(/\bon(mouseover|mouseenter)="return _?infraTooltipMostrar/g) || []).length;
const tipsAtual = (atual.match(/data-spro-tip="/g) || []).length;
// Por CONTAGEM, nao por presenca: um par que existe em outro ponto do arquivo esconderia a perda.
const faltam = [...b.keys()].filter((k) => (a.get(k) || 0) < b.get(k)).map((k) => k + '  (' + b.get(k) + ' -> ' + (a.get(k) || 0) + ')');
const novos = [...a.keys()].filter((k) => (b.get(k) || 0) < a.get(k)).map((k) => k + '  (' + (b.get(k) || 0) + ' -> ' + a.get(k) + ')');
console.log(`\n=== paridade: ${arquivo} (base ${ref}) ===`);
console.log(`pares (evento, funcao): base ${b.size}, atual ${a.size} | tooltips: base ${tipsBase}, atual ${tipsAtual}`);
console.log(`\nda base, ausentes agora (${faltam.length}):`); faltam.forEach((k) => console.log('   ' + k));
console.log(`\nnovos agora (${novos.length}):`); novos.forEach((k) => console.log('   ' + k));
```

- [ ] **Step 3: Substituir `tools/conferir-modos.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Confere, chamada a chamada, se o MODO de insercao sobreviveu a conversao.
 *
 * POR QUE EXISTE. check-dom-injection so acusa modo A MENOS (contagem por verbo). Nao pega o erro
 * inverso: 'append' onde o original era .html(), que APAGA o que estava la. A primeira versao
 * lia as chamadas por expressao regular e se perdia em conteudo com parentese -- ')' dentro de
 * uma string, (i+1), rgba(...) -- acusando divergencia onde nao havia. Esta le pela arvore
 * sintatica (acorn): casa cada insercao da base com a atual pelo inicio do conteudo inserido.
 *
 * Uso: node tools/conferir-modos.mjs dist/js/sei-pro.js [ref]   (ref padrao: $SPRO_REF_BASE ou master)
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const acorn = createRequire(new URL('../tests/package.json', import.meta.url))('acorn');
const arquivo = process.argv[2];
const ref = process.argv[3] || process.env.SPRO_REF_BASE || 'master';
if (!arquivo) { console.error('uso: node tools/conferir-modos.mjs <arquivo.js> [ref]'); process.exit(2); }

const VERBO_MODO = { html: 'html', append: 'append', prepend: 'prepend', before: 'before', after: 'after', replaceWith: 'replace' };
const PORTOES = /^(htmlPro|htmlArvorePro|htmlCruPro|htmlCruArvorePro|reescreverDocumentoPro)$/;
// 200 caracteres: com 60, duas mensagens de erro do mesmo arquivo colidiam e a divergencia sumia.
const assinar = (t) => t.replace(/\s+/g, ' ').trim().slice(0, 200);

function visitar(no, fn) {
  if (!no || typeof no.type !== 'string') return;
  fn(no);
  for (const k of Object.keys(no)) {
    const v = no[k];
    if (Array.isArray(v)) v.forEach((x) => visitar(x, fn));
    else if (v && typeof v.type === 'string') visitar(v, fn);
  }
}

function colher(fonte) {
  const out = [];
  visitar(acorn.parse(fonte, { ecmaVersion: 'latest', allowHashBang: true }), (no) => {
    if (no.type !== 'CallExpression') return;
    const c = no.callee, a = no.arguments;
    const linha = fonte.slice(0, no.start).split('\n').length;
    if (c.type === 'MemberExpression' && !c.computed && Object.prototype.hasOwnProperty.call(VERBO_MODO, c.property.name) && a.length === 1) {
      out.push({ linha, modo: VERBO_MODO[c.property.name], assinatura: assinar(fonte.slice(a[0].start, a[0].end)) });
    } else if (c.type === 'Identifier' && PORTOES.test(c.name) && a.length >= 2) {
      const m = a[2] && a[2].type === 'Literal' ? String(a[2].value) : 'html';
      out.push({ linha, modo: m, assinatura: assinar(fonte.slice(a[1].start, a[1].end)) });
    }
  });
  return out;
}

const base = colher(execSync(`git show ${ref}:${arquivo}`, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const atual = colher(readFileSync(resolve(RAIZ, arquivo), 'utf8'));
// Pareamento por ORDEM de ocorrencia: a mesma variavel costuma ser inserida com verbos
// diferentes em pontos diferentes (td.prepend(iconStar) aqui, .after(iconStar) ali). Casar
// sempre com a primeira da base inventava divergencia. A conversao nao reordena o codigo,
// entao a k-esima ocorrencia de um conteudo na base e a k-esima na versao atual.
const filas = new Map();
for (const b of base) { if (!filas.has(b.assinatura)) filas.set(b.assinatura, []); filas.get(b.assinatura).push(b); }
let casados = 0, divergencias = 0;
for (const d of atual) {
  const fila = filas.get(d.assinatura);
  const par = fila && fila.shift();
  if (!par) continue;
  casados++;
  if (par.modo !== d.modo) {
    divergencias++;
    console.error(`DIVERGE  ${arquivo}:${d.linha}  modo era '${par.modo}', virou '${d.modo}'`);
    console.error(`         conteudo: ${d.assinatura.slice(0, 120)}`);
  }
}
console.log(`\nconferir-modos: ${casados} chamada(s) casada(s), ${divergencias} divergencia(s)`);
process.exit(divergencias > 0 ? 1 : 0);
```

- [ ] **Step 4: Substituir `tools/check-dom-injection.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Portao de empacotamento: garante que arquivo ja convertido nao volte a injetar HTML
 * cru nem a carregar acao em atributo on*.
 *
 * POR QUE EXISTE. A conversao e manual e longa; sem um portao, o primeiro trecho novo
 * escrito no estilo antigo reabre a pendencia da AMO sem ninguem perceber.
 *
 * Uso:
 *   node tools/check-dom-injection.mjs          (reprova com codigo 1 se houver ERRO)
 *   node tools/check-dom-injection.mjs --todos  (mostra tambem os arquivos ainda nao convertidos)
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Comentario nao executa: codigo antigo comentado com onclick nao pode reprovar o arquivo.
// Tokenizador de verdade (acorn, instalado em tests/) para saber onde ha comentario.
const acorn = createRequire(new URL('../tests/package.json', import.meta.url))('acorn');
function faixasDeComentario(texto) {
  const faixas = [];
  try { for (const t of acorn.tokenizer(texto, { ecmaVersion: 'latest', onComment: (b, x, i, f) => faixas.push([i, f]) })) { /* consome */ } }
  catch (e) { /* arquivo que o acorn nao le: nada e ignorado */ }
  return faixas;
}

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Cresce a cada camada concluida. Arquivo fora desta lista nao e verificado.
const ARQUIVOS_CONVERTIDOS = [
  'dist/js/sei-legis.js',
  'dist/js/init.js',
  'dist/js/sei-pro-proc-lote.js',
  'dist/js/sei-pro-docs-lote.js',
  'dist/js/sei-pro-prescricoes.js'
];

// on<evento>="  dentro de literal. Nao casa com "el.onclick = fn" (sem aspas apos o =).
const RE_HANDLER = /\bon(click|change|blur|focus|input|keyup|keydown|keypress|submit|mouseover|mouseout|mouseenter|mouseleave|mousedown|mouseup|mousemove|dblclick|contextmenu|paste|copy|cut|drag|dragstart|dragend|dragover|dragenter|dragleave|drop|wheel|reset|invalid|select|scroll|load|error|toggle|animationend|transitionend)\s*=\s*(\\?["'])/g;
// .html(qualquer coisa) -- getter .html() continua permitido.
const RE_HTML = /\.html\(\s*(?!\))/g;
const RE_INNER = /\.innerHTML\s*=|insertAdjacentHTML\s*\(/g;
// insercao com literal de marcacao
const RE_INSERE_LITERAL = /\.(append|prepend|before|after|replaceWith)\(\s*(['"`])\s*</g;
// Insercao com QUALQUER argumento que nao comece por $( -- variavel, chamada, map().join(),
// concatenacao. Nao da para saber estaticamente se e HTML, entao vira aviso para conferencia.
// Antes isto so casava com variavel simples, e deixava passar o caso mais comum de todos:
// .append(lista.map(...).join('')), que e exatamente onde o dado do SEI vira marcacao.
// createTextNode nao parseia HTML: e a forma correta de inserir texto, nao um caso a conferir.
const RE_INSERE_VAR = /\.(append|prepend|before|after|replaceWith)\(\s*(?!\$\()(?!document\.createTextNode)(?!['"`]\s*<)([^)\n]{1,80})\)/g;

// Parse no documento VIVO: $(html) cria os nos no documento da pagina, e um <img onerror> que
// venha na resposta do servidor executa ali mesmo. Use lerHtmlPro. O nome da variavel e a pista
// (html, data, result, resposta...) -- $(this), $(elem) e afins nao casam.
const RE_PARSE_VIVO = /\$\(\s*([A-Za-z_$][\w$]*)\s*\)/g;
const NOME_DE_HTML = /html|data|result|resp|txt|body|pagina/i;
// Serializar e reparsear marcacao que ja existe (outerHTML dentro de uma insercao): arranca os
// handlers nativos do SEI se passar pelo portao, e e desnecessario -- mova ou clone o no (P4).
const RE_OUTER = /\.(html|append|prepend|before|after|replaceWith)\([^;\n]*outerHTML/g;
// htmlCruPro: a excecao provisoria. Motivo literal obrigatorio; o total e o que o plano 3 zera.
const RE_CRU = /\bhtmlCru(?:Arvore)?Pro\s*\(/g;

function argumentosDe(texto, ini) {
  let prof = 1, q = null;
  for (let i = ini; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '(') prof++;
    else if (c === ')' && --prof === 0) return texto.slice(ini, i);
  }
  return '';
}

function linhaDe(texto, indice) { return texto.slice(0, indice).split('\n').length; }

let totalCru = 0;
function varrer(caminho) {
  const texto = readFileSync(resolve(RAIZ, caminho), 'utf8');
  const comentarios = faixasDeComentario(texto);
  const emComentario = (i) => comentarios.some(([a, b]) => i >= a && i < b);
  const erros = [], avisos = [];
  const achar = (re, lista, rotulo, filtro) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(texto))) {
      if (emComentario(m.index) || (filtro && !filtro(m))) continue;
      lista.push(`${caminho}:${linhaDe(texto, m.index)}  ${rotulo}: ${m[0].trim().slice(0, 90)}`);
    }
  };
  achar(RE_PARSE_VIVO, erros, 'parse no documento vivo: use lerHtmlPro', (m) => NOME_DE_HTML.test(m[1]));
  achar(RE_OUTER, erros, 'outerHTML reparseado: mova ou clone o no (P4)');
  RE_CRU.lastIndex = 0;
  let c;
  while ((c = RE_CRU.exec(texto))) {
    if (emComentario(c.index)) continue;
    totalCru++;
    const args = argumentosDe(texto, c.index + c[0].length);
    if (!/,\s*'plano-3: [\w$.]+'\s*$/.test(args)) erros.push(`${caminho}:${linhaDe(texto, c.index)}  htmlCruPro sem motivo literal 'plano-3: <produtor>' no fim`);
  }
  achar(RE_HANDLER, erros, 'acao em atributo on*');
  achar(RE_HTML, erros, 'use htmlPro no lugar de .html(...)');
  achar(RE_INNER, erros, 'use htmlPro no lugar de innerHTML/insertAdjacentHTML');
  achar(RE_INSERE_LITERAL, erros, 'use htmlPro para inserir marcacao');
  achar(RE_INSERE_VAR, avisos, 'conferir: se a variavel for HTML, use htmlPro');
  return { erros, avisos };
}

// --- Auditoria de MODO de insercao -------------------------------------------------
// POR QUE EXISTE. A conversao trocou `$(x).append(html)` por `htmlPro($(x), html)`, e
// htmlPro SEM o terceiro argumento e 'html': SUBSTITUI o conteudo em vez de acrescentar.
// Numa varredura automatica isso passa despercebido -- e passou: 12 pontos de
// sei-pro-docs-lote.js perderam o modo, um deles apagando o <select> de Tipo de Documento
// logo depois de cria-lo. Aqui a contagem por verbo e comparada com a do ponto de partida
// do branch: se um `append` sumiu sem virar htmlPro(..., 'append'), o numero acusa.
const VERBOS = ['append', 'prepend', 'before', 'after', 'replaceWith'];
const MODO = { append: 'append', prepend: 'prepend', before: 'before', after: 'after', replaceWith: 'replace' };

// Equivalentes por DOM API: quando a conversao troca marcacao por construcao de no, a
// insercao continua existindo -- so mudou de forma. Sem contar isto, o detector acusa
// init.js, que virou appendChild de proposito.
const DOM_API = { append: ['appendChild'], prepend: ['insertBefore'], before: ['insertBefore'],
                  after: [], replaceWith: ['replaceChild'] };

function contarVerbos(texto) {
  const c = {};
  for (const v of VERBOS) {
    const direto = (texto.match(new RegExp('\\.' + v + '\\(', 'g')) || []).length;
    const viaHelper = (texto.match(new RegExp("(?:htmlPro|htmlArvorePro|htmlCruPro|htmlCruArvorePro|reescreverDocumentoPro)\\([\\s\\S]*?'" + MODO[v] + "'\\s*(?:,\\s*'plano-3: [\\w$.]+'\\s*)?\\)", 'g')) || []).length;
    let viaDom = 0;
    for (const m of DOM_API[v]) viaDom += (texto.match(new RegExp('\\.' + m + '\\(', 'g')) || []).length;
    c[v] = direto + viaHelper + viaDom;
  }
  return c;
}

function auditarModos(caminho, refBase) {
  let antigo;
  try {
    antigo = execSync(`git show ${refBase}:${caminho}`, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (e) { return []; }
  const novo = readFileSync(resolve(RAIZ, caminho), 'utf8');
  const a = contarVerbos(antigo), b = contarVerbos(novo);
  const achados = [];
  for (const v of VERBOS) {
    if (b[v] < a[v]) achados.push(`${caminho}  modo de insercao perdido: '${v}' caiu de ${a[v]} para ${b[v]} (htmlPro sem o 3o argumento SUBSTITUI o conteudo)`);
  }
  return achados;
}

let totalErros = 0, totalAvisos = 0;
for (const caminho of ARQUIVOS_CONVERTIDOS) {
  const { erros, avisos } = varrer(caminho);
  totalErros += erros.length;
  totalAvisos += avisos.length;
  for (const e of erros) console.error('ERRO   ' + e);
  for (const a of avisos) console.warn('AVISO  ' + a);
}

// A auditoria de modo compara com o ponto de partida do branch.
const REF_BASE = process.env.SPRO_REF_BASE || 'master';
for (const caminho of ARQUIVOS_CONVERTIDOS) {
  for (const m of auditarModos(caminho, REF_BASE)) { console.error('ERRO   ' + m); totalErros++; }
}

if (process.argv.includes('--todos')) {
  console.log(`\n(${ARQUIVOS_CONVERTIDOS.length} arquivo(s) sob a regra; os demais ainda nao foram convertidos)`);
}
console.log(`\nhtmlCruPro (excecoes provisorias, o plano 3 zera): ${totalCru}`);
console.log(`check-dom-injection: ${totalErros} erro(s), ${totalAvisos} aviso(s)`);
process.exit(totalErros > 0 ? 1 : 0);
```

- [ ] **Step 5: Substituir `tools/diff-sanitize.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Diagnostico PREVIO a conversao de um arquivo: diz o que a sanitizacao removeria.
 *
 * POR QUE EXISTE. O DOMPurify remove tag e atributo que ninguem lembrou de conferir
 * (<iframe>, <style>, accesskey, href="javascript:"). Descobrir isso depois de converter
 * 1.175 handlers e caro. Esta ferramenta roda ANTES, sobre o arquivo ainda intocado, e
 * devolve a lista fechada do que precisa de tratamento especial.
 *
 * Uso: node tools/diff-sanitize.mjs dist/js/sei-legis.js
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// O jsdom esta instalado em tests/, nao em tools/ (que nem tem package.json).
// createRequire ancorado no package.json de tests/ o encontra sem duplicar a dependencia.
const exigir = createRequire(new URL('../tests/package.json', import.meta.url));
const { JSDOM } = exigir('jsdom');

const arquivo = process.argv[2];
if (!arquivo) { console.error('uso: node tools/diff-sanitize.mjs <arquivo.js>'); process.exit(2); }

// A config vem do arquivo real: uma verdade so.
const fonteBloco = readFileSync(resolve(RAIZ, 'dist/js/sei-functions-pro.js'), 'utf8');
const inicio = fonteBloco.indexOf('// === INICIO SEI PRO DOM ===');
const fim = fonteBloco.indexOf('// === FIM SEI PRO DOM ===');
if (inicio < 0 || fim < 0) { console.error('bloco SEI PRO DOM nao encontrado'); process.exit(2); }

const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only' });
const w = dom.window;
w.eval(readFileSync(resolve(RAIZ, 'dist/js/lib/purify.min.js'), 'utf8'));
w.eval(fonteBloco.slice(inicio, fim).replace(/function htmlPro[\s\S]*$/, ''));

// Comentario nao vira DOM: tirar antes de varrer. Um <script> citado num comentario do sei-pro.js
// e um "#anchorUG<id>" num comentario da arvore apareciam como tags perdidas (falso positivo).
const textoBruto = readFileSync(resolve(RAIZ, arquivo), 'utf8');
const comentarios = [];
try { for (const t of exigir('acorn').tokenizer(textoBruto, { ecmaVersion: 'latest', onComment: (bl, x, i, f) => comentarios.push([i, f]) })) { /* consome */ } } catch (e) {}
let texto = textoBruto;
for (let k = comentarios.length - 1; k >= 0; k--) texto = texto.slice(0, comentarios[k][0]) + ' '.repeat(comentarios[k][1] - comentarios[k][0]) + texto.slice(comentarios[k][1]);

// So importa a perda de tag que COMECA um fragmento (a primeira coisa de uma string). Uma <caption>
// dentro de uma <table> completa sobrevive; acusa-la mandava reescrever codigo correto. As tags
// que o sanitizador remove em qualquer posicao continuam acusadas sempre.
// A marcacao costuma vir em varias strings concatenadas ('<table>'+'<caption>'+...): so e raiz a
// string que NAO continua uma concatenacao, isto e, que nao vem logo depois de um '+'.
const RAIZES = new Set();
{
  const RE_RAIZ = /['"`]\s*<([a-zA-Z][\w-]*)/g;
  let r;
  while ((r = RE_RAIZ.exec(texto))) {
    let k = r.index - 1;
    while (k >= 0 && /\s/.test(texto[k])) k--;
    if (texto[k] !== '+') RAIZES.add(r[1].toLowerCase());
  }
}
const SEMPRE = new Set(['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'frame', 'frameset']);

// Varre a marcacao embutida nos literais. Nao e um parser de JS: e uma varredura de
// "<tag ...>" que basta para levantar o vocabulario de tags e atributos do arquivo.
const RE_TAG = /<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const RE_ATTR = /([a-zA-Z_:][-\w:.]*)\s*=/g;
const tags = new Map();
const attrsPorTag = new Map();
let m;
while ((m = RE_TAG.exec(texto))) {
  const tag = m[1].toLowerCase();
  tags.set(tag, (tags.get(tag) || 0) + 1);
  if (!attrsPorTag.has(tag)) attrsPorTag.set(tag, new Set());
  let a;
  // Tira o VALOR dos atributos antes de procurar NOMES de atributo: sem isso, um texto
  // dentro de um atributo ("Anexo = tipo e Contrato = Numero", num tooltip) era lido como
  // se fossem atributos chamados anexo e contrato.
  const semValores = m[2].replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
  RE_ATTR.lastIndex = 0;
  while ((a = RE_ATTR.exec(semValores))) attrsPorTag.get(tag).add(a[1].toLowerCase());
}

const ENVELOPES = { tr: '<table>', tbody: '<table>', thead: '<table>', tfoot: '<table>',
  colgroup: '<table>', td: '<table><tr>', th: '<table><tr>', option: '<select>',
  optgroup: '<select>', li: '<ul>', dt: '<dl>', dd: '<dl>' };

// Sanitiza a amostra JA envelopada e reparseia a saida como ela e -- o envelope
// (<table>, <select>, <ul>) sobrevive a sanitizacao. Envelopar de novo na releitura,
// como uma versao anterior fazia, punha <tr> dentro de <tr> e o parser descartava,
// acusando perda de class/style em toda linha de tabela. Falso positivo.
function analisar(html, tag) {
  const abre = ENVELOPES[tag] || '';
  const fecha = abre ? abre.match(/[a-z]+/g).reverse().map((t) => `</${t}>`).join('') : '';
  const limpo = w.DOMPurify.sanitize(abre + html + fecha, w.SEIPRO_PURIFY_CONFIG);
  const caixa = w.document.createElement('div');
  caixa.innerHTML = limpo;
  return caixa.querySelector(tag);
}

function sobrevive(html, tag) {
  return analisar(html, tag) !== null;
}

const tagsPerdidas = [];
const attrsPerdidos = [];
for (const [tag, n] of [...tags].sort((a, b) => b[1] - a[1])) {
  const amostra = `<${tag}></${tag}>`;
  if (!sobrevive(amostra, tag)) { if (RAIZES.has(tag) || SEMPRE.has(tag)) tagsPerdidas.push([tag, n]); continue; }
  for (const attr of attrsPorTag.get(tag)) {
    if (/^on/i.test(attr)) continue; // removidos de proposito; sao o alvo da conversao
    const el = analisar(`<${tag} ${attr}="v"></${tag}>`, tag);
    if (!el || !el.hasAttribute(attr)) attrsPerdidos.push(`${tag}[${attr}]`);
  }
}

console.log(`\n=== ${arquivo} ===`);
console.log(`${tags.size} tags distintas na marcacao embutida\n`);
if (tagsPerdidas.length) {
  console.log('TAGS QUE A SANITIZACAO REMOVE (precisam de DOM API):');
  for (const [t, n] of tagsPerdidas) console.log(`   <${t}>  (${n} ocorrencias)`);
} else console.log('Nenhuma tag perdida.');
console.log('');
if (attrsPerdidos.length) {
  console.log('ATRIBUTOS QUE A SANITIZACAO REMOVE:');
  for (const a of [...new Set(attrsPerdidos)].sort()) console.log('   ' + a);
} else console.log('Nenhum atributo perdido.');
console.log('');
```

- [ ] **Step 6: Conferir cada detector contra o que a triagem mediu**

```bash
export SPRO_REF_BASE=refs/dom-seguro/base-plano2
for f in sei-legis init sei-pro-proc-lote sei-pro-docs-lote sei-pro-prescricoes; do
  node tools/produtores-pendentes.mjs dist/js/$f.js | tail -1 | sed "s/^/$f: /"
done
node tools/check-dom-injection.mjs | tail -4
for f in sei-pro-all sei-pro-favoritos sei-pro sei-pro-arvore; do node tools/diff-sanitize.mjs dist/js/$f.js; done
node tools/paridade-acoes.mjs dist/js/sei-pro.js | sed -n '/ausentes/,$p'
node tools/conferir-modos.mjs dist/js/sei-legis.js | tail -1
```
Esperado:
- `produtores-pendentes`: `sei-pro-prescricoes: ... 1 erro(s)`; os outros quatro `0 erro(s)`.
- `check-dom-injection`: os 13 `ERRO` de parse no `sei-pro-docs-lote.js` e mais nada;
  `htmlCruPro (...): 0`.
- `diff-sanitize`: exatamente os quatro achados reais.
- `paridade` num arquivo ainda não convertido: `ausentes agora (0)`.
- `conferir-modos` no `sei-legis.js` (plano 1): `0 divergencia(s)`.

- [ ] **Step 7: Não há commit** — `tools/` é ignorado pelo git.

---
## Task 5: Corrigir a regressão publicada na janela de prescrições

**Files:**
- Modify: `dist/js/sei-pro-prescricoes.js` — `getCtrPrescricao` (hoje linhas 12–158)
- Create: `tests/ao-vivo/prescricoes.mjs`

**Interfaces:**
- Consumes: `htmlCruPro` (Task 2), `produtores-pendentes.mjs` (Task 4), harness ao vivo (Task 1).
- Produces: nada para as tasks seguintes. É o primeiro uso de `htmlCruPro` e o modelo dos
  demais: **a janela continua sanitizada; só o HTML do produtor entra cru, num ponto reservado.**

- [ ] **Step 1: RED — o detector acusa a regressão**

Rodar: `node tools/produtores-pendentes.mjs dist/js/sei-pro-prescricoes.js`
Esperado: `ERRO   dist/js/sei-pro-prescricoes.js:148  htmlPro(... variavel htmlBox ...)` e código de saída 1.

- [ ] **Step 2: Reservar o array antes do `htmlBox`**

Substituir (linha 17):

```javascript
        var htmlBox =   '<div class="atividadeWork" style="max-height: 400px;overflow: auto;">';
```

por:

```javascript
        // O selo de prazo vem do getDatesPreview, que ainda monta onclick e onmouseover (plano 3).
        // Passando pelo portao, o sanitizador arrancava os dois -- foi a regressao da 2.2.2, que
        // tirou o tooltip do selo. A janela continua sanitizada; so o selo entra depois, sem
        // sanitizar, na celula reservada para ele. O htmlDuration nao pode aparecer na montagem do
        // htmlBox (nem para contar posicao): o produtores-pendentes.mjs rastreia pelo texto.
        var prazosPrescricaoPro = [];
        var htmlBox =   '<div class="atividadeWork" style="max-height: 400px;overflow: auto;">';
```

- [ ] **Step 3: Guardar o selo em vez de concatená-lo**

Substituir (linha 76):

```javascript
                            htmlDias = _diffDays;
```

por:

```javascript
                            htmlDias = _diffDays;
                            prazosPrescricaoPro.push(htmlDuration);
```

E substituir (linha 101):

```javascript
'              <td align="left">'+htmlDuration+'</td>'+
```

por:

```javascript
'              <td align="left" class="prazoPrescricaoPro" data-indice="'+(prazosPrescricaoPro.length - 1)+'"></td>'+
```

- [ ] **Step 4: Preencher as células depois da janela montada**

Substituir o fim da função (linhas 155–158; o trecho é único no arquivo):

```javascript
                    buttons: []
            });
    }
}
```

por:

```javascript
                    buttons: []
            });
            $('#dialogBoxPro .prazoPrescricaoPro').each(function () {
                htmlCruPro($(this), prazosPrescricaoPro[parseInt($(this).attr('data-indice'), 10)] || '', 'html', 'plano-3: getDatesPreview');
            });
    }
}
```

- [ ] **Step 5: GREEN — detectores e sintaxe**

```bash
node tools/produtores-pendentes.mjs dist/js/sei-pro-prescricoes.js | tail -1
node tools/check-dom-injection.mjs | grep -v docs-lote | tail -2
node --check dist/js/sei-pro-prescricoes.js
node tools/conferir-modos.mjs dist/js/sei-pro-prescricoes.js | tail -1
node tools/escape-nonascii.mjs --check dist/js/sei-pro-prescricoes.js
```
Esperado: `produtores-pendentes: 0 erro(s)`; `htmlCruPro (...): 1` e nenhum `ERRO` fora do
`docs-lote`; sintaxe OK; `0 divergencia(s)`; `OK 0`.

- [ ] **Step 6: Validar ao vivo com um registro sintético**

O banco local é da ANTT e não tem prescrição para processo do SEI SP; a janela é aberta com um
registro montado no harness, com os campos que `getCtrPrescricao` lê
(`data_fim, data_inicio, documento_relacionado, id_documento_sei, id_prescricao, id_procedimento,
key_prescricao, nome_prescricao, suspensao, id_tipo_prescricao`).

`tests/ao-vivo/prescricoes.mjs`:

```javascript
import { abrir } from './conn.mjs';
import { coletarAvisos } from './sonda.mjs';
import { conectarAtividades } from './backend.mjs';

// Pre-condicao: SEI SP logado, com um PROCESSO aberto (procedimento_trabalhar), aberto por clique.
const { browser, p } = await abrir();
const avisos = coletarAvisos(p);
console.log('backend:', JSON.stringify(await conectarAtividades(p)));
const r = await p.evaluate(() => {
  // So no harness: o tipo de prescricao do banco da ANTT nao se aplica ao tipo de processo do SEI SP.
  if (!window.arrayConfigAtividades.tipos_prescricoes || !arrayConfigAtividades.tipos_prescricoes.length) {
    arrayConfigAtividades.tipos_prescricoes = [{ id_tipo_prescricao: 1, nome_tipo_prescricao: 'Teste', prazo: 60, config: {} }];
  }
  window.checkListTipoPrescricaoInProcesso = function () { return true; };
  var tipo = arrayConfigAtividades.tipos_prescricoes[0].id_tipo_prescricao;
  getCtrPrescricao([{
    id_tipo_prescricao: tipo, id_prescricao: 1, key_prescricao: false, nome_prescricao: 'Teste',
    documento_relacionado: '', id_documento_sei: '', id_procedimento: '',
    data_inicio: moment().subtract(40, 'days').format('YYYY-MM-DD HH:mm:ss'),
    data_fim: '0000-00-00 00:00:00', suspensao: false,
  }]);
  var selo = document.querySelector('#dialogBoxPro .prazoPrescricaoPro .dateboxDisplay');
  return {
    selo: !!selo,
    onclick: selo ? selo.getAttribute('onclick') : null,
    tooltip: !!(selo && selo.querySelector('[onmouseover]')),
    marca: document.documentElement.getAttribute('data-spro-actions'),
  };
});
console.log(JSON.stringify(r, null, 1));
await new Promise((t) => setTimeout(t, 1000));
console.log('avisos [SEIPro]:', JSON.stringify(avisos));
await browser.disconnect(); process.exit(0);
```

Subir o daemon com o código desta branch (Task 1, Step 7), pedir o login ao autor, abrir um
processo por clique e rodar `node tests/ao-vivo/prescricoes.mjs`.
Esperado: `selo: true`, `onclick` não nulo (`parent.filterTagView(this)`), `tooltip: true`,
`marca: "sim"`, e **nenhum** aviso `handler inline removido`. Se `getCtrPrescricao` exigir outro
campo, ler a função e acrescentá-lo ao registro — sem alterar a função.

Contraprova, que mostra a regressão que se está corrigindo: com o daemon carregando o `dist/` do
clone principal em `master` (a 2.2.3), o mesmo script dá `onclick: null` e `tooltip: false`.

- [ ] **Step 7: Commit**

```bash
git add dist/js/sei-pro-prescricoes.js
git commit -m "Prescricoes: o selo de prazo volta a ter tooltip e clique

Regressao publicada na 2.2.2. O selo vem do getDatesPreview, que ainda
monta onclick e onmouseover (so o plano 3 o converte); o prescricoes,
convertido no plano 1, passava a janela inteira pelo portao, e o
sanitizador arrancava os dois atributos sem deixar rastro.

A janela continua sanitizada. So o selo entra depois, sem sanitizar, na
celula reservada para ele, por htmlCruPro -- a excecao provisoria, com
motivo e contada pelo verificador.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## O roteiro de cada arquivo (Tasks 6 a 10)

Toda task de arquivo segue a mesma ordem. **A ordem importa:** os handlers manuais que estão em
template literal têm de ser convertidos **antes** do codemod de inserção, senão ele manda marcação
com `on*=` ainda dentro pelo portão, e o sanitizador arranca.

1. **Diagnóstico** — `diff-sanitize` e `paridade` (base = atual: 0 ausentes).
2. **Handlers** — `converter-handlers --aplicar`; depois os manuais da task.
3. **Inserções** — `converter-insercoes --aplicar`; depois as manuais da task, pela população.
4. **Parse** — todo `$(html)` do arquivo vira `lerHtmlPro(html)` (o verificador lista as linhas).
5. **Produtores** — `produtores-pendentes`; cada `ERRO` vira `htmlCruPro(..., 'plano-3: <produtor>')`,
   com o produtor que a ferramenta nomeou. Se o HTML contaminado for pequeno e isolável, preferir o
   modelo da Task 5 (reservar o ponto e inserir só o trecho do produtor cru).
6. **Registro e verificação** — acrescentar o arquivo a `ARQUIVOS_CONVERTIDOS` no
   `check-dom-injection.mjs` e rodar a bateria:
   ```bash
   export SPRO_REF_BASE=refs/dom-seguro/base-plano2
   node --check $F
   node tools/check-dom-injection.mjs | grep -E "$(basename $F)|htmlCruPro|check-dom"
   node tools/conferir-modos.mjs $F | tail -1
   node tools/paridade-acoes.mjs $F | sed -n '/ausentes/,$p'
   node tools/produtores-pendentes.mjs $F | tail -1
   node tools/escape-nonascii.mjs --check $F
   (cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (pass|fail)")
   ```
   Esperado: nenhum `ERRO` do arquivo; `0 divergencia(s)`; ausentes = só os que viraram função
   nomeada nesta task; `produtores-pendentes: 0 erro(s)`; contagem de acentos igual à da base;
   suíte verde.
7. **Ao vivo** — subir o daemon de novo (código novo), login pelo autor, percorrer os fluxos da
   task, e em cada tela: `node tests/ao-vivo/sonda.mjs`. Esperado em toda linha: `marca: 'sim'`,
   `despachantes: 1`; `orfaos: []`; e **nenhum** aviso `[SEIPro] htmlPro:` coletado.
8. **Commit** — só o arquivo da task (e o `sei-functions-pro.js`, se a task o tocou).

---
## Task 6: `sei-pro-all.js` (camada 3)

**Files:**
- Modify: `dist/js/sei-pro-all.js` — roda em todas as telas do SEI, no mundo da página, depois do
  bloco (espera `checkHostLimit` em `initSeiProAllAposFunctions`).

**Interfaces:**
- Consumes: `htmlPro`, `htmlCruPro`, `lerHtmlPro`, `argsPro` e o despachante (Task 2); as
  ferramentas (Tasks 3 e 4).
- Produces: `abrirVisualizacaoRapidaPro(el, nrSEI)` e `abrirAnexoRapidoPro(el)`.

**Números da triagem:** 31 handlers (24 pelo codemod, 4 em comentário, 3 manuais); inserções: 1
pelo codemod, 14 manuais; 3 parses; 1 `<iframe>`.

- [ ] **Step 1: Diagnóstico e codemod de handlers**

```bash
F=dist/js/sei-pro-all.js
node tools/diff-sanitize.mjs $F
node tools/converter-handlers.mjs $F --aplicar
```
Esperado: `diff-sanitize` acusa só `<iframe>`; o codemod reporta `tooltips 6 | ocultar removidos 6 |
chamadas 12 | em comentario (ignorados) 4 | manuais 3`.

- [ ] **Step 2: Os três handlers manuais**

Linha 152 — a guarda `typeof` vira o próprio despachante, que já ignora (com aviso) ação inexistente.
Trocar o atributo:
`onclick="if(typeof initProcLoteModal===\'function\')initProcLoteModal()"` por
`data-spro-click="initProcLoteModal"`.

Linhas 665 e 671 — duas chamadas num `onclick` viram uma função nomeada. Acrescentar ao arquivo,
logo antes de `function startQuickViewSearch()`:

```javascript
// Dois handlers numa acao so: o onclick fazia markQuickViewSearch(this);openSEINrPro(this, nr).
function abrirVisualizacaoRapidaPro(el, nrSEI) {
    markQuickViewSearch(el);
    openSEINrPro(el, nrSEI);
}
function abrirAnexoRapidoPro(el) {
    markQuickViewSearch(el);
    openDialogAnexo(el);
}
```

E trocar os atributos:
- linha 665: `onclick="markQuickViewSearch(this);openSEINrPro(this, \''+nrSEI+'\')"` →
  `data-spro-click="abrirVisualizacaoRapidaPro" data-spro-args="'+argsPro('$el', String(nrSEI))+'"`
- linha 671: `onclick="markQuickViewSearch(this);openDialogAnexo(this)"` →
  `data-spro-click="abrirAnexoRapidoPro"`

- [ ] **Step 3: Codemod de inserções e as 14 manuais**

```bash
node tools/converter-insercoes.mjs $F --aplicar
```
Esperado: `marcacao literal -> htmlPro: 1 | .html('') -> .empty(): 0 | manuais: 14`.

| linha | trecho | população | conversão |
|---|---|---|---|
| 41 | `ifrView.find(tableID).last().after($(this)[0].outerHTML)` | P4 | `ifrView.find(tableID).last().after(this)` — o nó da resposta, lida por `lerHtmlPro` (Step 4) |
| 47 | `ifrView.find(divPaginas).after($html.find(divPaginas))` | P4 | inalterado: com `$html = lerHtmlPro(html)`, move os nós da paginação do SEI com os handlers nativos |
| 154 | `$(idMenu).append(newLinkMenu)` | P1 | `htmlPro($(idMenu), newLinkMenu, 'append')` |
| 179 | `$(this).after($(this).text())` | P2 | `$(this).after(document.createTextNode($(this).text()))` — `.after(string)` parseava o texto como HTML |
| 288 | `_this.find('thead').prepend(htmlFilter)` | P1 | `htmlPro(_this.find('thead'), htmlFilter, 'prepend')` |
| 424 | `tablePesquisa.prepend(htmlFilter)` | P1 | `htmlPro(tablePesquisa, htmlFilter, 'prepend')` |
| 480 | `td.prepend(iconStar)` | produtor | `htmlCruPro(td, iconStar, 'prepend', 'plano-3: htmlIconFavorites')` (confirmar o produtor no Step 5) |
| 666, 672, 694 | `$(this).after(html)` | P1 | `htmlPro($(this), html, 'after')` |
| 775, 776 | `$(...).append(htmlSlimPro)` e a vizinha | P1 | `htmlPro($(...), <var>, 'append')`, com o mesmo seletor |
| 819 | `txtNome.after(htmlUserColor)` | P1 | `htmlPro(txtNome, htmlUserColor, 'after')` |
| 908 | `$('#frmInfraConfigurar').after(ifrConfig)` | `<iframe>` | DOM API, abaixo |

Linha 906–908 (tela *Configurar* do SEI, que embute as opções do SEI Pro). Substituir a criação do
`ifrConfig` por construção de nó — o sanitizador remove `<iframe>`:

```javascript
        let ifrConfig = document.createElement('iframe');
        ifrConfig.id = 'ifrConfig';
        ifrConfig.src = URL_SPRO + 'html/options.html';
        ifrConfig.setAttribute('style', 'border: 0;margin: 20px auto;display: block;height: 800px');
        ifrConfig.setAttribute('width', '800');
        ifrConfig.setAttribute('frameborder', '0');
        ifrConfig.setAttribute('scrolling', 'yes');
        $('#ifrConfig').remove();
        $('#frmInfraConfigurar').after(ifrConfig);
```

- [ ] **Step 4: Parse no documento vivo**

Linhas 37 e 701: `let $html = $(html);` → `let $html = lerHtmlPro(html);`.
Linha 378: `downloadTablePesquisa(this_, $(htmlTable))` → `downloadTablePesquisa(this_, lerHtmlPro(htmlTable))`.

- [ ] **Step 5: Produtores, registro e bateria**

Rodar o roteiro (itens 5 e 6). Paridade esperada: ausente `click markQuickViewSearch (2 -> 0)`;
novos `click abrirVisualizacaoRapidaPro`, `click abrirAnexoRapidoPro`, `click initProcLoteModal`.

- [ ] **Step 6: Ao vivo, no SEI SP**

1. Menu → *Processos em Lote*: o diálogo abre (linha 152).
2. *Pesquisa*: pesquisar um termo com muitos resultados. Os ícones de visualização rápida aparecem
   ao lado de cada documento; clicar num abre a visualização (665) e num anexo (671).
3. Na mesma pesquisa, avançar de página: os resultados novos entram e a paginação continua
   clicável (41, 47 — P4, com os handlers nativos do SEI).
4. Baixar e copiar a tabela da pesquisa (378).
5. A estrela de favorito nos resultados (480).
6. Menu → *Configurar*: as opções do SEI Pro aparecem embutidas (908).
Em cada tela, a sonda (item 7 do roteiro).

- [ ] **Step 7: Commit**

```bash
git add dist/js/sei-pro-all.js
git commit -m "DOM seguro: sei-pro-all.js pelo portao

Camada 3. Handlers pelo codemod testado contra o onclick inline real;
inserções pelo codemod que deriva o modo do verbo. Os resultados da
pesquisa e a paginacao, que vem do proprio SEI com handlers nativos, sao
movidos como nos -- nao serializados e reparseados. A resposta do servidor
e lida num documento inerte (lerHtmlPro), e nao mais no documento vivo.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 7: `sei-pro-projetos.js` (camada 4)

**Files:**
- Modify: `dist/js/sei-pro-projetos.js` — painel de projetos (cronograma com frappe-gantt), carregado
  por `init.js` no mundo da página.

**Interfaces:**
- Consumes: Task 2 e ferramentas.
- Produces: `abrirDetalheProjetoPro(el, idProjeto)` e `atualizarDatasEObrigatoriosPro(el)`.

**Números da triagem:** 85 handlers (77 pelo codemod, 8 manuais); inserções: 12 pelo codemod (11
literais + 1 `.empty()`), 7 manuais; nenhum parse; o `changeDocumentoRelacionado` (linha 1819)
já foi acertado na correção do plano 1.

- [ ] **Step 1: Diagnóstico e codemod de handlers**

```bash
F=dist/js/sei-pro-projetos.js
node tools/diff-sanitize.mjs $F
node tools/converter-handlers.mjs $F --aplicar
```
Esperado: nenhuma tag nem atributo perdido; `tooltips 14 | ocultar removidos 14 | chamadas 49 | em comentario (ignorados) 0 | manuais 8`.

- [ ] **Step 2: Os oito handlers manuais**

Acrescentar antes de `function closeAllPopupsProjeto()`:

```javascript
// Duas chamadas num handler so viraram funcoes nomeadas (uma acao por atributo).
function abrirDetalheProjetoPro(el, idProjeto) {
    showProjetoDetalhe(el);
    resizeHeightCanvasProjeto(idProjeto);
}
function atualizarDatasEObrigatoriosPro(el) {
    updateDatesRange(el);
    checkThisAtivRequiredFields(el);
}
```

- Linha 470: `onclick="showProjetoDetalhe(this);resizeHeightCanvasProjeto('+etapa.id_projeto+');"` →
  `data-spro-click="abrirDetalheProjetoPro" data-spro-args="'+argsPro('$el', literalInlinePro(etapa.id_projeto))+'"`
- Linhas 712, 720, 1042, 1048, 1367, 1375: `onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)"` →
  `data-spro-change="atualizarDatasEObrigatoriosPro"`
- Linha 1688 (template literal — o codemod não converte): `onchange="shareTableNewItem(this)"` →
  `data-spro-change="shareTableNewItem"`

- [ ] **Step 3: Codemod de inserções e as sete manuais**

```bash
node tools/converter-insercoes.mjs $F --aplicar
```
Esperado: `marcacao literal -> htmlPro: 11 | .html('') -> .empty(): 1 | manuais: 7`.

| linha | trecho | população | conversão |
|---|---|---|---|
| 61 | `$('#projetosGantt_temp').after(htmlProjetosGantt)` | P1 | `htmlPro($('#projetosGantt_temp'), htmlProjetosGantt, 'after')` |
| 164 | `$('#projetosTabs ul').append(liTabsProjetosGantt)` | P1 | `htmlPro(..., 'append')` |
| 165 | `$('#projetosTabs').append(svgProjetosGantt)` | P1 (SVG) | `htmlPro(..., 'append')` — conferir ao vivo que o cronograma desenha |
| 228 | `$('#projetosTabs ul').append(htmlFallback)` | P1 | `htmlPro(..., 'append')` |
| 1412, 1833, 1835 | `.append($('<option/>', {...}))` | nó jQuery | inalterado — não há parse de HTML |

- [ ] **Step 4: Produtores, registro e bateria**

Roteiro, itens 5 e 6 (o triagem aponta `getHtmlEtiqueta` como candidato — a ferramenta decide).
Paridade esperada: ausentes `click showProjetoDetalhe (2 -> 1)` e `change updateDatesRange (6 -> 0)`;
novos `click abrirDetalheProjetoPro (0 -> 1)` e `change atualizarDatasEObrigatoriosPro (0 -> 6)`.

- [ ] **Step 5: Ao vivo, no SEI SP, com o backend conectado**

`tests/ao-vivo/backend.mjs` (`gravarConfig` + `conectarAtividades`). No Controle de Processos:
1. O painel de projetos abre; as abas e o cronograma (SVG) desenham (61, 164, 165).
2. Abrir o detalhe de uma etapa (470).
3. Editar as datas de uma etapa: o intervalo se ajusta e os campos obrigatórios são marcados
   (712 e vizinhas).
4. Compartilhar a tabela com uma unidade (1688).
Se o banco local não tiver projeto visível para o usuário `soares`, registrar isso e validar os
passos 1 e 3 com um projeto criado **no banco local** — nunca no SEI.

- [ ] **Step 6: Commit**

```bash
git add dist/js/sei-pro-projetos.js
git commit -m "DOM seguro: sei-pro-projetos.js pelo portao

Camada 4. Sete handlers faziam duas chamadas e viraram funcoes nomeadas;
o resto pelos codemods.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 8: `sei-pro-favoritos.js` (camada 5)

**Files:**
- Modify: `dist/js/sei-pro-favoritos.js` — painel de favoritos, estrela na árvore, e a caixa
  *Manter processo em Favoritos* no formulário de **Enviar Processo** (iframe aninhado no SEI 4.1).

**Interfaces:**
- Consumes: Task 2 (inclusive a subida de janela e `reescreverParentPro`), `removerAncestralPro`,
  `confirmarDialogoNoEnterPro`, ferramentas.
- Produces: `alternarDatasEDocumentoPro(el, idProcedimento)`,
  `reautorizarArquivosFavoritosPro()`; `loadScriptFavoriteTag` reescrita sem código em texto.

**Números da triagem:** 98 handlers (93 pelo codemod, 5 manuais); inserções: 11 pelo codemod (7
literais + 4 `.empty()`), 12 manuais; um `<script>` montado como string.

- [ ] **Step 1: Diagnóstico e codemod de handlers**

```bash
F=dist/js/sei-pro-favoritos.js
node tools/diff-sanitize.mjs $F
node tools/converter-handlers.mjs $F --aplicar
```
Esperado: `diff-sanitize` acusa só o `<script>` (linha 1475); `tooltips 20 | ocultar removidos 21 |
chamadas 52 | em comentario (ignorados) 0 | manuais 5`.

- [ ] **Step 2: Os cinco handlers manuais**

Acrescentar antes de `function removeFav(this_)`:

```javascript
// Duas chamadas num handler so viraram funcoes nomeadas (uma acao por atributo).
function alternarDatasEDocumentoPro(el, idProcedimento) {
    configDatesSwitchChange(el);
    getDadosSelectDoc(el, idProcedimento);
}
function reautorizarArquivosFavoritosPro() {
    initFileSystem();
    setPanelFavorites('refresh');
}
```

- Linha 98: `onchange="configDatesSwitchChange(this); getDadosSelectDoc(this, \''+id_procedimento+'\')"` →
  `data-spro-change="alternarDatasEDocumentoPro" data-spro-args="'+argsPro('$el', String(id_procedimento))+'"`
- Linha 367: `onclick="javascript:$(this).closest(\'span\').remove()"` →
  `data-spro-click="removerAncestralPro" data-spro-args="'+argsPro('$el', 'span')+'"`
- Linha 775: o nome da função vem numa variável. Trocar `'onchange="'+func+'(this)"'` por
  `'data-spro-change="'+func+'"'`.
- Linha 788: `onkeypress="if (event.which == 13) { ... }"` (o atributo inteiro) →
  `data-spro-keypress="confirmarDialogoNoEnterPro" data-spro-args="'+argsPro('$el', '$ev')+'"`
- Linha 1061: `onclick="initFileSystem(); setPanelFavorites(\'refresh\');"` →
  `data-spro-click="reautorizarArquivosFavoritosPro"`

- [ ] **Step 3: `loadScriptFavoriteTag` deixa de escrever código em texto**

Hoje (linhas 1474–1510) a função monta o JavaScript do plugin de etiquetas como **string** e o
injeta num `<script>` dentro do frame do formulário. É o padrão que o revisor da AMO mais penaliza,
e o portão não resolve. Substituir a função inteira por:

```javascript
function loadScriptFavoriteTag(iFrame) {
    // Antes, esta funcao escrevia o codigo abaixo como TEXTO e o injetava num <script> dentro do
    // frame -- codigo dinamico, o padrao que o revisor da AMO mais penaliza, e que o portao nao
    // resolve (o sanitizador remove <script>). Agora o mesmo codigo roda daqui, sobre o jQuery do
    // proprio frame: o plugin de etiquetas e as funcoes sao as mesmas, so nao ha texto virando codigo.
    // As funcoes de callback sao as do topo, que era para onde o parent.getJanelaProcessoPro()
    // do texto antigo apontava.
    var doc = iFrame && iFrame[0];
    var win = doc && doc.defaultView;
    if (!win) return;
    var aplicar = function (TimeOut) {
        if (TimeOut <= 0) return;
        var jq = win.jQuery;
        if (jq && typeof jq.fn.tagsInput !== 'undefined') {
            jq('.favoriteTagsPro').tagsInput({
                interactive: true,
                placeholder: 'Adicionar etiqueta',
                minChars: 2,
                maxChars: 100,
                limit: 8,
                autocomplete_url: '',
                autocomplete: { 'source': sugestEtiquetaPro('fav') },
                hide: true,
                delimiter: [';'],
                unique: true,
                removeWithBackspace: true,
                onAddTag: saveFollowEtiqueta,
                onRemoveTag: saveFollowEtiqueta,
                onChange: saveFollowEtiqueta
            });
            return;
        }
        if (jq && !doc.querySelector('script[data-spro-lib="tagsinput"]')) {
            var s = doc.createElement('script');
            s.src = URL_SPRO + 'js/lib/jquery.tagsinput-revisited.js';
            s.setAttribute('data-spro-lib', 'tagsinput');
            (doc.head || doc.documentElement).appendChild(s);
        }
        setTimeout(function () { aplicar(TimeOut - 100); }, 500);
    };
    aplicar(9000);
}
```

Antes de trocar, conferir no texto atual que as opções do `tagsInput` são exatamente as acima
(uma a uma) — a versão nova tem de ser iso-funcional.

- [ ] **Step 4: Codemod de inserções e as 12 manuais**

```bash
node tools/converter-insercoes.mjs $F --aplicar
```
Esperado: `marcacao literal -> htmlPro: 7 | .html('') -> .empty(): 4 | manuais: 12`.

| linha | trecho | população | conversão |
|---|---|---|---|
| 338 | `selectDoc.html(htmlBox)` | P1 | `htmlPro(selectDoc, htmlBox)` |
| 381 | `$('#configDatesBox_newdoclist').append(htmlDoc)` | P1 | `htmlPro(..., 'append')` |
| 454 | `trFavorite.find('.info_dates_fav').html(htmlDatePreview)` | produtor | `htmlCruPro(trFavorite.find('.info_dates_fav'), htmlDatePreview, 'html', 'plano-3: getDatesPreview')` — manter o `.show().closest(...)` da cadeia |
| 612 | `ifrArvore.find(...).eq(0).after(iconStar)` | produtor | `htmlCruPro(ifrArvore.find(...).eq(0), iconStar, 'after', 'plano-3: htmlIconFavorites')` — instala o despachante no `ifrArvore` |
| 758 | `category_elem.show().html(categoriaLista)` | P1 | `htmlPro(category_elem.show(), categoriaLista)` |
| 1027 | `$('#favoritesPro_temp').after(htmlPanelFavorites)` | a ferramenta decide | `htmlPro(..., 'after')`, ou `htmlCruPro` com o produtor que o Step 6 apontar |
| 1049 | `td.prepend(iconStar)` | produtor | `htmlCruPro(td, iconStar, 'prepend', 'plano-3: htmlIconFavorites')` |
| 1064 | `$('#favoritosProActions').append(htmlFileSystemStatus)` | P1 | `htmlPro(..., 'append')` |
| 1302 | `tableFavorites.find('thead').prepend(htmlFilterFav)` | P1 | `htmlPro(..., 'prepend')` |
| 1375 | `.html(htmlDatePreview+followLink[0].outerHTML)` | produtor + P4 | código abaixo |
| 1427 | `ifrVisualizacao.find('#frmAtividadeListar').append(htmlAddFav)` | P1 (ou produtor) | `htmlPro(..., 'append')`; se o Step 6 acusar, `htmlCruPro` |
| 1566 | `$('#mapid').before(htmlLoadingLocation)` | P1 | `htmlPro(..., 'before')` |

Linha 1375 — o selo vem de produtor (cru) e o link já existe na página (nó, não string):

```javascript
            var $infoDatas = $(this_).closest('td').find('.info_dates_fav');
            var copiaLink = followLink.first().clone();   // o que o outerHTML serializava
            htmlCruPro($infoDatas, htmlDatePreview, 'html', 'plano-3: getDatesPreview');
            $infoDatas.append(copiaLink);
```

A cópia é tirada **antes** de substituir o conteúdo — funciona igual se o `.followLink` estiver
dentro ou fora de `.info_dates_fav`, como o `outerHTML` funcionava.

Linha 1426, `htmlAddFav = getHtmlJanelaProcessoPro(htmlAddFav);` — **manter**. Com a Task 2 a
reescrita não toca mais em `data-spro-*`, e o resolvedor sobe de janela até achar a função no
topo, então o `data-spro-click` do formulário aninhado funciona sem ela; os `onclick` que ainda
vierem de produtor continuam precisando dela.

- [ ] **Step 5: Parse** — o verificador não acusa `$(html)` neste arquivo; nada a fazer.

- [ ] **Step 6: Produtores, registro e bateria**

Roteiro, itens 5 e 6. Paridade esperada: ausentes `change configDatesSwitchChange` (uma a menos),
`click $ (1 -> 0)` e `click initFileSystem (1 -> 0)`; novos `alternarDatasEDocumentoPro`,
`removerAncestralPro`, `keypress confirmarDialogoNoEnterPro`, `reautorizarArquivosFavoritosPro` e
um `change '+func+'` (o nome dinâmico da linha 775).

- [ ] **Step 7: Ao vivo, no SEI SP 4.1.5 (o iframe aninhado) e no SEI MJ 5**

1. Controle de Processos: o painel de favoritos abre, as datas e categorias funcionam (338, 381,
   454, 758, 1027), a estrela da tabela (1049).
2. Num processo: a estrela na árvore (612) — marcar e desmarcar.
3. **Enviar Processo** (sem enviar): a caixa *Manter processo em Favoritos* aparece (1427); marcar,
   e nas etiquetas digitar uma e confirmar que o autocompletar aparece e que ela é salva (é o
   `loadScriptFavoriteTag` novo). No 4.1.5, é aqui que a subida de janela é exercitada: clicar nos
   controles da caixa e conferir na sonda do frame aninhado `orfaos: []`.
   **Nunca clicar em Enviar.** Fechar a janela.
4. Remover um documento da lista de datas (367) e confirmar a categoria nova com Enter (788).

- [ ] **Step 8: Commit**

```bash
git add dist/js/sei-pro-favoritos.js
git commit -m "DOM seguro: sei-pro-favoritos.js, sem codigo montado em texto

Camada 5. loadScriptFavoriteTag escrevia o JavaScript do plugin de
etiquetas numa string e o injetava num <script> dentro do frame do
formulario -- codigo dinamico, o que o revisor da AMO mais penaliza. Agora
o mesmo codigo roda do topo sobre o jQuery do frame.

O selo de datas e a estrela vem de funcoes ainda nao convertidas e entram
por htmlCruPro, contados; o link de acompanhamento, que ja existia na
pagina, e copiado como no em vez de serializado.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 9: `sei-pro.js` (camada 6)

**Files:**
- Modify: `dist/js/sei-pro.js` — o Controle de Processos: tabela agrupada, filtros, quadro
  (kanban), prazos, marcadores, texto padrão, upload na tela inicial. Roda depois do bloco
  (`initSeiProAposFunctions`).

**Interfaces:**
- Consumes: Task 2 (captura, `confirmarDialogoNoEnterPro`, `lerHtmlPro`, `htmlCruPro`, `mouseover`),
  ferramentas.
- Produces: `cancelarUploadProcessosPro(ev)`.

**Números da triagem:** 103 handlers (100 pelo codemod — inclusive os 4 `updateTipSelectAll` como
`data-spro-mouseover` —, 3 manuais); inserções: 29 pelo codemod (25 literais + 4 `.empty()`), 42
manuais; 16 parses no documento vivo.

- [ ] **Step 1: Diagnóstico e codemod de handlers**

```bash
F=dist/js/sei-pro.js
node tools/diff-sanitize.mjs $F
node tools/converter-handlers.mjs $F --aplicar
```
Esperado: `Nenhuma tag perdida` e `Nenhum atributo perdido`; `tooltips 29 | ocultar removidos 29 |
chamadas 42 | em comentario (ignorados) 0 | manuais 3`.

- [ ] **Step 2: Os três handlers manuais**

Linhas 2487 e 2488 — o `onkeypress` inteiro (Enter confirma o diálogo) →
`data-spro-keypress="confirmarDialogoNoEnterPro" data-spro-args="'+argsPro('$el', '$ev')+'"`.

Linha 3390 — o "Cancelar" da área de upload da tela inicial precisa parar a propagação **antes**
do Dropzone (Review Focus 1). Acrescentar, logo antes da função que monta esse HTML:

```javascript
// O Cancelar fica DENTRO da area do Dropzone. dropzoneCancelInfo para a propagacao para o Dropzone
// nao abrir o seletor de arquivos; por isso a acao vai com data-spro-captura (fase de captura).
function cancelarUploadProcessosPro(ev) {
    dropzoneCancelInfo(ev);
    removeUploadFilesInProcess();
}
```

E trocar `onclick="dropzoneCancelInfo(event); removeUploadFilesInProcess(); return false;"` por
`data-spro-click="cancelarUploadProcessosPro" data-spro-captura data-spro-args="'+argsPro('$ev')+'"`.
O `return false` não faz falta: é um `<span>`, sem ação padrão.

- [ ] **Step 3: Codemod de inserções e as 42 manuais**

```bash
node tools/converter-insercoes.mjs $F --aplicar
```
Esperado: `marcacao literal -> htmlPro: 25 | .html('') -> .empty(): 4 | manuais: 42`.

**P4 — marcação do SEI realocada (mover o nó, nunca reparsear):**
- Linhas 199–201: o laço clona uma linha do SEI, serializa e reinsere a string. Trocar
  `var outerHTML = $('<div>').append($(this).clone().addClass('typeGerados')).html();` e
  `$('#divRecebidos').find('table tbody').append(outerHTML);` por uma linha só:
  `$('#divRecebidos').find('table tbody').append($(this).clone().addClass('typeGerados'));`
- Linha 968: `$('#tblProcessos'+tipo).append($(this)[0].outerHTML)` → `.append(this)` (o `tr` vem de
  `lerHtmlPro`, Step 4).
- Linha 2659 (marcadores vindos por AJAX, com os handlers nativos do SEI): no `map` da linha 2648,
  trocar `html: this.outerHTML` por `no: this`, e `td.append(v.html)` por `td.append(v.no)`.
  Antes, conferir com `grep -n "v.html" dist/js/sei-pro.js` que `v.html` não é usado em outro ponto
  da mesma função.
- Linhas 451, 814–816, 2281: já são nós (`cloneTr`, linhas movidas, cartão do quadro) — inalteradas.

**Produtor (`getDatesPreview`) — `htmlCruPro`:** linhas 2671, 3105 e 3118
(`...find('td.prazoBoxDisplay').html(htmlDatePreview)` e `htmlDateAdd`) →
`htmlCruPro(<receptor>, <var>, 'html', 'plano-3: getDatesPreview')`.

**P1 — `htmlPro` com o modo do verbo:** 449 (`after`), 471 (`append`), 472 (`append`, `<th>`), 678
(`after`, a cadeia `.css(...)` continua), 809 (`prepend`), 1068, 1235 (`append`), 1258 (`html`),
1278 (`html`, a cadeia `.dialog(...)` continua), 1370, 1373 (`append`), 1401 (`prepend`), 1609
(`before`), 1610 (`after`), 1711 (`prepend`), 2200, 2201 (`html`), 2259, 2260 (`append`), 2401
(`after`), 2540, 2559 (`html`, a cadeia `.chosenImage()` continua), 3009 (`prepend`), 3059, 3068
(`append`), 3397 (`after`, a cadeia `.data(...)` continua), 3521 (`after` no fim da cadeia do
`.sortable(...)` que começa na 3507). Para cada uma, se o Step 5 acusar produtor, trocar por
`htmlCruPro` com o produtor nomeado.

**Linha 1393** — duas inserções encadeadas. Substituir
`$('#divInfraBarraLocalizacao').css('width', '100%').addClass('titlePanelHome').append(htmlToggleTable).prepend(htmlIconTable);` por:

```javascript
        var $barraLocalizacao = $('#divInfraBarraLocalizacao').css('width', '100%').addClass('titlePanelHome');
        htmlPro($barraLocalizacao, htmlToggleTable, 'append');
        htmlPro($barraLocalizacao, htmlIconTable, 'prepend');
```

**Linha 3346** (P5 — decodificar entidades da mensagem de erro): substituir
`texto = $.trim($('<div>').html(String(texto).replace(/<[^>]*>/g, ' ')).text()).replace(/\s+/g, ' ');` por
`texto = $.trim(lerHtmlPro('<div>' + String(texto).replace(/<[^>]*>/g, ' ') + '</div>').text()).replace(/\s+/g, ' ');`

- [ ] **Step 4: Parse no documento vivo**

`lerHtmlPro` no lugar de `$(...)` em: 963 (`$(html)`), 1528 (`$(htmlTable)`), 2553, 2597
(`$(html)`), 2643 (`$(htmlResult)`), 2672 e 3106 (`$(htmlDatePreview).hasClass(...)`), 2801,
2821, 2827, 2832, 2843 (`$(htmlTxtPadrao)` — ler uma vez numa variável e reusar), 2847
(`$(htmlLink)`).

Dois casos inserem, não só leem:
- **Linha 1365** — `$(html).insertBefore($(this));` → `htmlPro($(this), html, 'before');`
- **Linha 395** — a cadeia opera sobre as linhas recém-inseridas. Substituir:

```javascript
		$(htmlBody).appendTo('#divRecebidos table tbody')
            .filter('tr.tableHeader').attr('data-htagname', tagName_)
            .find('a.controleTableTag').attr('data-htagname', tagName_);
```

por:

```javascript
		// appendTo devolvia as linhas novas; htmlPro devolve o alvo. As novas sao as que vem depois
		// das que ja estavam.
		var $tbodyRecebidos = $('#divRecebidos table tbody');
		var qtdAntes = $tbodyRecebidos.children().length;
		htmlPro($tbodyRecebidos, htmlBody, 'append');
		$tbodyRecebidos.children().slice(qtdAntes)
            .filter('tr.tableHeader').attr('data-htagname', tagName_)
            .find('a.controleTableTag').attr('data-htagname', tagName_);
```

(Se o Step 5 acusar produtor em `htmlBody`, o mesmo padrão com `htmlCruPro`.)

- [ ] **Step 5: Produtores, registro e bateria**

Roteiro, itens 5 e 6. Paridade esperada: ausente `click dropzoneCancelInfo (1 -> 0)`; novos
`click cancelarUploadProcessosPro (0 -> 1)` e `keypress confirmarDialogoNoEnterPro (0 -> 2)`.

- [ ] **Step 6: Medir o custo do portão na tela mais cheia**

Esta é a tela com mais inserções por linha da tabela. No SEI SP (a unidade de teste tem ~200
processos), com o Controle de Processos aberto:

```javascript
// no console da pagina
var t0 = performance.now();
for (var i = 0; i < 200; i++) htmlPro($('<div>'), '<span class="dateboxDisplay"><i class="fas fa-clock"></i> 3 dias</span>');
console.log('200 insercoes pelo portao:', Math.round(performance.now() - t0), 'ms');
```
Esperado: abaixo de 150 ms. Se passar disso, registrar e parar para decidir com o autor antes do
commit — não otimizar por conta própria.

- [ ] **Step 7: Ao vivo, no SEI SP e no SEI MJ**

1. Controle de Processos: agrupar por marcador e por tipo (395, 449, 451); o cabeçalho de grupo
   ainda recolhe e expande suas linhas (o `data-htagname` do 395); "Selecionar tudo" mostra a dica
   certa (o `data-spro-mouseover`); ordenar e filtrar (1711, 3009).
2. Prazos: definir um prazo num processo (2485–2488 com Enter), conferir o selo (2671/3105) e o
   tooltip dele.
3. Marcadores: adicionar um marcador por atribuição em lote e ver o ícone nativo do SEI com tooltip
   (2659 — P4).
4. Quadro (kanban): mover um cartão (2281) e recolher uma coluna (2401).
5. Texto padrão (2801–2847): abrir a lista e criar um, sem salvar.
6. Upload na tela inicial: arrastar um arquivo e clicar **Cancelar** — o seletor de arquivos **não**
   pode abrir (3390, captura).

- [ ] **Step 8: Commit**

```bash
git add dist/js/sei-pro.js
git commit -m "DOM seguro: sei-pro.js, o Controle de Processos

Camada 6, a tela mais cheia da extensao. As linhas e os marcadores que
vem do proprio SEI sao movidos como nos, com os handlers nativos; o
Cancelar do upload roda na fase de captura, antes do Dropzone; as
respostas por AJAX sao lidas num documento inerte. Os selos de prazo vem
do getDatesPreview, ainda nao convertido, e entram por htmlCruPro.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 10: `sei-pro-arvore.js` (camada 7) — o frame que carrega em paralelo com o bloco

**Files:**
- Modify: `dist/js/sei-pro-arvore.js` — roda no `ifrArvore`, no mundo da página **do frame**.
- Create: `tests/dom-seguro/arvore-resolvedor.test.mjs`

**Interfaces:**
- Consumes: `htmlPro`, `htmlCruPro`, `lerHtmlPro`, `argsPro`, `literalInlinePro` — **do frame, se
  já carregaram, senão do topo**; o despachante com captura (Task 2).
- Produces: o bloco `RESOLVEDOR ARVORE` — `htmlArvorePro`, `htmlCruArvorePro`, `lerHtmlArvorePro`,
  `argsArvorePro`, `literalArvorePro`, `estiloArvorePro` — e `enviarUploadArvorePro(el)`.

**Por que esta task é diferente (achado 5 da triagem).** O `init_arvore.js` pede
`sei-functions-pro.js` e este arquivo em paralelo (linhas 92–93), e `initSeiProArvore()` roda no
`ready`: pode chegar antes de o bloco existir no frame. Tudo o que este arquivo chama do bloco
passa por um resolvedor local que cai para o topo — inclusive `argsPro` e `literalInlinePro`,
que o codemod põe **na montagem** das strings. Um detalhe que o teste fixa: o alvo vira jQuery
**deste** documento antes de ir ao topo; um seletor entregue ao `htmlPro` do topo seria procurado
no documento do topo.

**Números da triagem:** 126 handlers (114 pelo codemod, 6 em comentário, 6 manuais — 3 deles num
template literal); inserções: 13 pelo codemod, 23 manuais (2 são `<style>`); 10 parses.

- [ ] **Step 1: Escrever o teste do resolvedor (falha: o bloco ainda não existe no arquivo)**

`tests/dom-seguro/arvore-resolvedor.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { montar, desmontar } from './harness.mjs';

// O resolvedor e lido do arquivo real, entre sentinelas -- o teste nao pode divergir do publicado.
const RAIZ = new URL('../../', import.meta.url);
function resolvedor() {
  const f = readFileSync(new URL('dist/js/sei-pro-arvore.js', RAIZ), 'utf8');
  const i = f.indexOf('// === INICIO RESOLVEDOR ARVORE ===');
  const j = f.indexOf('// === FIM RESOLVEDOR ARVORE ===');
  if (i < 0 || j < 0) throw new Error('sentinelas do RESOLVEDOR ARVORE nao encontradas');
  return f.slice(i, j);
}
const JQ = readFileSync(new URL('dist/js/lib/jquery-3.4.1.min.js', RAIZ), 'utf8');

// Topo com o bloco; frame da arvore SEM o bloco -- o caso da corrida (Review Focus 3).
function arvoreSemBloco(w) {
  const ifr = w.document.createElement('iframe');
  w.document.body.appendChild(ifr);
  const fw = ifr.contentWindow;
  fw.document.body.innerHTML = '<div id="caixa"></div>';
  fw.eval(JQ);
  fw.eval(resolvedor());
  return fw;
}

test('sem o bloco no frame, htmlArvorePro usa o htmlPro do topo e sanitiza', () => {
  const ctx = montar();
  try {
    const fw = arvoreSemBloco(ctx.w);
    assert.equal(typeof fw.htmlPro, 'undefined', 'o frame nao pode ter o bloco');
    fw.htmlArvorePro('#caixa', '<a id="x" onclick="y()" data-spro-click="parent.acaoTopo">c</a>', 'append');
    const a = fw.document.getElementById('x');
    assert.ok(a, 'inserido no documento da arvore');
    assert.equal(a.getAttribute('onclick'), null, 'passou pelo sanitizador');
  } finally { desmontar(ctx); }
});

test('o seletor e resolvido no documento da arvore, nao no do topo', () => {
  const ctx = montar();
  try {
    ctx.$('body').append('<div id="caixa"></div>');
    const fw = arvoreSemBloco(ctx.w);
    fw.htmlArvorePro('#caixa', '<b id="novo">x</b>', 'append');
    assert.ok(fw.document.getElementById('novo'), 'foi para a arvore');
    assert.equal(ctx.w.document.getElementById('novo'), null, 'nao foi para o topo');
  } finally { desmontar(ctx); }
});

test('a acao inserida pelo topo funciona no frame: despachante instalado la', () => {
  const ctx = montar();
  try {
    const fw = arvoreSemBloco(ctx.w);
    let n = 0;
    ctx.w.acaoTopo = function () { n++; };
    fw.htmlArvorePro('#caixa', `<a id="x" data-spro-click="parent.acaoTopo" data-spro-args="${fw.argsArvorePro('$el', 3)}">c</a>`, 'append');
    assert.equal(fw.document.documentElement.getAttribute('data-spro-actions'), 'sim');
    fw.document.getElementById('x').dispatchEvent(new fw.MouseEvent('click', { bubbles: true }));
    assert.equal(n, 1);
  } finally { desmontar(ctx); }
});

test('argsArvorePro e literalArvorePro funcionam sem o bloco local', () => {
  const ctx = montar();
  try {
    const fw = arvoreSemBloco(ctx.w);
    assert.equal(fw.literalArvorePro('482'), 482);
    assert.ok(fw.argsArvorePro('$el', 'x').includes('&quot;x&quot;'));
  } finally { desmontar(ctx); }
});

test('estiloArvorePro cria o bloco uma vez e respeita a posicao', () => {
  const ctx = montar();
  try {
    const fw = arvoreSemBloco(ctx.w);
    fw.estiloArvorePro('seipro', '.a{}', 'prepend');
    fw.estiloArvorePro('seipro', '.b{}', 'prepend');
    const s = fw.document.querySelectorAll('style[data-style="seipro"]');
    assert.equal(s.length, 1);
    assert.equal(s[0].textContent, '.a{}', 'a segunda chamada nao substitui (mesma semantica do original)');
  } finally { desmontar(ctx); }
});
```

Rodar: `cd tests && node --test dom-seguro/arvore-resolvedor.test.mjs`
Esperado: FALHA com `sentinelas do RESOLVEDOR ARVORE nao encontradas`.

- [ ] **Step 2: Inserir o resolvedor**

Logo depois de `var initSeiProArvoreAplicado = false;` (linha 11), inserir:

```javascript
// === INICIO RESOLVEDOR ARVORE ===
// O init_arvore.js pede o sei-functions-pro.js e este arquivo EM PARALELO (linhas 92-93, $.getScript
// assincrono), e initSeiProArvore roda no ready: pode chegar antes de o bloco existir neste frame. Um
// ReferenceError ali abortaria a inicializacao inteira da arvore. O topo carregou muito antes e tem o
// bloco; o htmlPro dele insere no documento DESTE frame e instala o despachante nele. Sem nenhum dos
// dois, a insercao nao acontece -- HTML cru nao e opcao -- e fica o aviso.
function blocoArvorePro(nome) {
    if (typeof window[nome] === 'function') return window[nome];
    try { if (window.parent !== window && typeof window.parent[nome] === 'function') return window.parent[nome]; } catch (e) {}
    try { console.warn('[SEIPro] ' + nome + ' indisponivel na arvore'); } catch (e) {}
    return null;
}
// O alvo vira jQuery DESTE documento antes de ir ao topo: um seletor entregue ao htmlPro do topo
// seria procurado no documento do topo.
function htmlArvorePro(alvo, html, modo) {
    var $alvo = (alvo && alvo.jquery) ? alvo : $(alvo);
    var f = blocoArvorePro('htmlPro');
    return f ? f($alvo, html, modo) : $alvo;
}
function htmlCruArvorePro(alvo, html, modo, motivo) {
    var $alvo = (alvo && alvo.jquery) ? alvo : $(alvo);
    var f = blocoArvorePro('htmlCruPro');
    return f ? f($alvo, html, modo, motivo) : $alvo;
}
function lerHtmlArvorePro(html) {
    var f = blocoArvorePro('lerHtmlPro');
    return f ? f(html) : $([]);
}
// Chamados NA MONTAGEM das strings (o codemod gera argsArvorePro/literalArvorePro aqui).
function argsArvorePro() {
    var f = blocoArvorePro('argsPro');
    return f ? f.apply(null, arguments) : '[]';
}
function literalArvorePro(v) {
    var f = blocoArvorePro('literalInlinePro');
    return f ? f(v) : v;
}
// Estilo constante por DOM API, sem depender do bloco (como o init.js): um <style> que comeca o
// fragmento nunca sobrevive ao portao.
function estiloArvorePro(chave, css, posicao) {
    if (document.querySelector('style[data-style="' + chave + '"]')) return;
    var el = document.createElement('style');
    el.setAttribute('type', 'text/css');
    el.setAttribute('data-style', chave);
    el.textContent = css;
    var casa = document.head || document.documentElement;
    if (posicao === 'prepend' && casa.firstChild) casa.insertBefore(el, casa.firstChild);
    else casa.appendChild(el);
}
// === FIM RESOLVEDOR ARVORE ===
```

Rodar de novo o teste do Step 1. Esperado: `# pass 5`, `# fail 0`.

- [ ] **Step 3: Os dois `<style>` por DOM API, sem o bloco**

Um `<style>` que começa o fragmento nunca sobrevive ao portão — e some sem aparecer no
`DOMPurify.removed`. O CSS é constante: vai por `estiloArvorePro`, que não depende do bloco. Os
`if` que testam se o estilo já existe ficam como estão.

Em `initCSSArvore` (linha 27), substituir:

```javascript
        $('head').prepend("<style type='text/css' data-style='seipro'> "
            +"   #divMsgClipboard.msgGeral.msgSucesso { "
            +"      margin-top: -50px !important;"
            +"      padding: .4em;"
            +"      border: .2em solid #d9d9d9;"
            +"      background: #ffffaa;"
            +"      box-shadow: 0 0 5px #a0a0a0;"
            +"    } "
            +"</style>");
```

por:

```javascript
        estiloArvorePro('seipro', " "
            +"   #divMsgClipboard.msgGeral.msgSucesso { "
            +"      margin-top: -50px !important;"
            +"      padding: .4em;"
            +"      border: .2em solid #d9d9d9;"
            +"      background: #ffffaa;"
            +"      box-shadow: 0 0 5px #a0a0a0;"
            +"    } "
            , 'prepend');
```

Em `initDestacarNaoAssinadosPro` (linha 2666), substituir:

```javascript
        $('head').append("<style type='text/css' data-style='seipro-naoassinados'> "
            +"   #divArvore a.naoAssinadoPro > span[id^='span'] { "
            +"      box-shadow: inset 2px 0 0 rgba(214, 150, 20, .75);"
            +"      border-radius: 3px;"
            +"      padding: 1px 6px 1px 7px;"
            +"      transition: background .2s ease;"
            +"    } "
            // Selecionado: o SEI pinta o texto de branco sobre o fundo dele; o fundo ambar cobriria esse fundo
            // e o nome sumiria. O selecionado fica so com o filete.
            +"   #divArvore a.naoAssinadoPro > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(234, 170, 40, .5); } "
            +"   #divArvore a.naoAssinadoPro:hover > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(234, 170, 40, .6); } "
            +"   body.dark-mode #divArvore a.naoAssinadoPro > span[id^='span'] { box-shadow: inset 2px 0 0 rgba(240, 190, 80, .8); } "
            +"   body.dark-mode #divArvore a.naoAssinadoPro > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(240, 190, 80, .16); } "
            +"</style>");
```

por:

```javascript
        estiloArvorePro('seipro-naoassinados', " "
            +"   #divArvore a.naoAssinadoPro > span[id^='span'] { "
            +"      box-shadow: inset 2px 0 0 rgba(214, 150, 20, .75);"
            +"      border-radius: 3px;"
            +"      padding: 1px 6px 1px 7px;"
            +"      transition: background .2s ease;"
            +"    } "
            // Selecionado: o SEI pinta o texto de branco sobre o fundo dele; o fundo ambar cobriria esse fundo
            // e o nome sumiria. O selecionado fica so com o filete.
            +"   #divArvore a.naoAssinadoPro > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(234, 170, 40, .5); } "
            +"   #divArvore a.naoAssinadoPro:hover > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(234, 170, 40, .6); } "
            +"   body.dark-mode #divArvore a.naoAssinadoPro > span[id^='span'] { box-shadow: inset 2px 0 0 rgba(240, 190, 80, .8); } "
            +"   body.dark-mode #divArvore a.naoAssinadoPro > span[id^='span']:not(.infraArvoreNoSelecionado) { background: rgba(240, 190, 80, .16); } "
            , 'append');
```

Os comentários de linha no meio da segunda concatenação ficam onde estão (válidos entre dois `+`).

- [ ] **Step 4: Codemod de handlers, com os nomes da árvore**

```bash
F=dist/js/sei-pro-arvore.js
node tools/diff-sanitize.mjs $F
node tools/converter-handlers.mjs $F --args argsArvorePro --literal literalArvorePro --aplicar
```
Esperado: `diff-sanitize` acusa só `div[contenteditable]` (os dois `<style>` saíram no Step 3); o
codemod: `tooltips 30 | ocultar removidos 30 | chamadas 54 | em comentario (ignorados) 6 | manuais 6`.

**O `div[contenteditable]`:** é a nota adesiva (linha 1877), com `contenteditable="false"`. O
sanitizador o remove — e isso é **equivalente**: sem o atributo o `div` também não é editável, e
todo o código que o consulta (linhas 1799, 1945, 1953) trata ausente igual a `"false"`. O modo de
edição continua sendo ligado por `.prop('contenteditable', true)` (linha 1717). Nada a fazer; o
Step 9 confere ao vivo.

- [ ] **Step 5: Os seis handlers manuais**

Acrescentar antes de `function sortUploadArvore()`:

```javascript
// Duas chamadas num handler so viraram funcao nomeada (uma acao por atributo).
function enviarUploadArvorePro(el) {
    sendUploadArvore('upload');
    statusUploadArvore(el);
}
```

- Linha 1115: `onclick="sendUploadArvore(\'upload\'); statusUploadArvore(this)"` → `data-spro-click="enviarUploadArvorePro"`
- Linha 1521 (o Cancelar dentro da área do Dropzone — captura): `onclick="parent.parent.dropzoneCancelInfo(event); return false;"` →
  `data-spro-click="parent.parent.dropzoneCancelInfo" data-spro-captura data-spro-args="'+argsArvorePro('$ev')+'"`
- Linha 2427: `<button onclick="filterTagKanbanArvore(this); return false;" class="tag-remove">` →
  `<button type="button" data-spro-click="filterTagKanbanArvore" class="tag-remove">`.
  O `return false` impedia o envio do formulário da árvore; `type="button"` faz o mesmo sem código.
- Linha 2539 (template literal, três atributos): `onclick="enableConsultasExtras();"` →
  `data-spro-click="enableConsultasExtras"`; o par de tooltip →
  `data-spro-tip="Clique para desativar"` (removendo o `onmouseout`).

- [ ] **Step 6: Codemod de inserções com o portão da árvore, e as manuais**

```bash
node tools/converter-insercoes.mjs $F --portao htmlArvorePro --aplicar
```
Esperado: `marcacao literal -> htmlArvorePro: 13 | .html('') -> .empty(): 0 | manuais: 21` (os
dois `<style>` já saíram no Step 3).

| linha | trecho | população | conversão |
|---|---|---|---|
| 120 | `$('body').prepend(htmlToolbarProc+htmlToolbarDoc)` | P1 / produtor | `htmlArvorePro($('body'), ..., 'prepend')`, ou `htmlCruArvorePro` se o Step 8 acusar |
| 602 | `$(this).after(html)` | P1 | `htmlArvorePro($(this), html, 'after')` |
| 1026 | `$('#anchor'+id_documento).before(html)` | P1 | `htmlArvorePro(..., 'before')` |
| 1136 | `.after(htmlUpload)` no fim da cadeia do `.sortable(...)` da 1122 | P1 | `htmlArvorePro(<a cadeia>, htmlUpload, 'after')` |
| 1527 | `$(containerUpload).prepend(html)` | P1 | `htmlArvorePro($(containerUpload), html, 'prepend')` — a cadeia `.data('index', 0)` continua |
| 1597, 1738 | `textarea.html(par)` | P1 (anotação) | `htmlArvorePro(textarea, par)` |
| 1629, 1697 | `textarea.prop('contenteditable',false).html(formatDadosAnotacao(...))` | P1 | `htmlArvorePro(textarea.prop('contenteditable',false), formatDadosAnotacao(...))` |
| 1792 | `_parent.find('.stickNoteDate').html(htmlStick)` | produtor | `htmlCruArvorePro(..., htmlStick, 'html', 'plano-3: getDatesPreview')` — o `htmlStick` leva o miolo do selo do `parent.getDatesPreview` |
| 1815 | `_this.html( paragraph )` | P1 (colagem) | `htmlArvorePro(_this, paragraph)` |
| 1825 | `_parent.find('.countLimit').html(textCount)` | P2 | `.text(textCount)` — conferir que `textCount` é texto |
| 1831 | `$('<div/>').html(value).contents()` | P5 | `lerHtmlArvorePro(value)` (os nós de topo são os mesmos que o `.contents()` dava) |
| 1899 | `$('#divConsultarAndamento').after(htmlAnotacao)` | P1 | `htmlArvorePro(..., 'after')` |
| 2069 | `...find('.dadosInteressados_result').html(htmlResult)` | P1 | `htmlArvorePro(...)` — a cadeia `.show()` continua |
| 2308, 2543 | `$('#frmArvore').append(...)` | a ferramenta decide | `htmlArvorePro(..., 'append')` ou `htmlCruArvorePro` |
| 2395 | `$('.panelDadosArvore').eq(0).before(htmlAtividades)` | a ferramenta decide | idem, `'before'` |
| 2430 | `head.append(htmlFilter)` | P1 | `htmlArvorePro(head, htmlFilter, 'append')` |
| 2507 | `$('<div/>').html(v).contents()` | P5 | `lerHtmlArvorePro(v)` |
| 2510 | `$('<div/>').append(result)` | nó | inalterado |

- [ ] **Step 7: Parse no documento vivo**

`lerHtmlArvorePro` no lugar de `$(...)` em: 373, 786, 839, 906, 975, 1166, 1242, 1962, 2347; e na
linha 1790, `$(htmlDateStick).html()` → `lerHtmlArvorePro(htmlDateStick).html()`.

- [ ] **Step 8: Produtores, registro e bateria**

Roteiro, itens 5 e 6, com duas diferenças: os produtores entram por `htmlCruArvorePro`, e a
paridade esperada é: ausente só `click sendUploadArvore (1 -> 0)`; novo
`click enviarUploadArvorePro (0 -> 1)`. Os de 1521 (`parent.parent.dropzoneCancelInfo`), 2427
(`filterTagKanbanArvore`) e 2539 (`enableConsultasExtras`) mantêm o nome e não aparecem. Suíte esperada: `# pass 116` (111 + 5 do resolvedor).

- [ ] **Step 9: Ao vivo, no SEI SP 4.1.5 e no SEI MJ 5**

A sonda mostra `despachantes` somando o do frame e o do topo; o que importa é `marca: 'sim'` no
`ifrArvore` e `orfaos: []`.
1. Abrir **vários** processos seguidos (a corrida é intermitente — a memória registra falha em 3 de
   4 aberturas numa versão antiga): a árvore monta toda vez, com numeração, duas linhas e menu
   rápido, se ligados; nenhum `pageerror`.
2. Menu rápido da árvore (a barra da linha 120) e os tooltips.
3. Anotações: abrir, editar, salvar ao **sair do campo** (`blur`), marcar um item de checklist. Ao
   reabrir o processo, o texto salvo está lá.
4. Upload na árvore: arrastar um arquivo e clicar **Cancelar** — o seletor de arquivos não abre
   (1521, captura). Não concluir nenhum upload.
5. Painel de dados do processo (2308, 2543) e a consulta de interessados (2069).
6. Filtro de etiquetas do quadro na árvore (2427): remover um filtro não recarrega a árvore.

- [ ] **Step 10: Commit**

```bash
git add dist/js/sei-pro-arvore.js
git commit -m "DOM seguro: sei-pro-arvore.js, com resolvedor para a corrida de carga

Camada 7. O init_arvore.js pede o bloco e este arquivo em paralelo, e a
arvore inicializa no ready -- pode chegar antes de o htmlPro existir no
frame. Um resolvedor local cai para o do topo, que insere no documento
da arvore e instala o despachante nele; o alvo e resolvido NESTE
documento antes de subir. Os dois <style> constantes sao construidos por
DOM API, sem depender do bloco. O Cancelar do upload roda na fase de
captura, antes do Dropzone.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 11: Parse no documento vivo no `sei-pro-docs-lote.js` (plano 1)

**Files:**
- Modify: `dist/js/sei-pro-docs-lote.js` — 13 `$(html)` sobre respostas do SEI.

**Interfaces:**
- Consumes: `lerHtmlPro` (Task 2).
- Produces: nada.

**Pré-condição.** Em 28/09/2026 havia no clone principal uma alteração **não commitada** neste
arquivo, de outra frente (campo de descrição no Documentos em Lote). Antes de começar:

```bash
git -C "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro" status --short dist/js/sei-pro-docs-lote.js
git log --oneline master -3 -- dist/js/sei-pro-docs-lote.js
```
Se a alteração ainda estiver pendente no clone principal, **parar e perguntar ao autor** — mexer
agora geraria conflito. Se já estiver no `master`, integrá-lo: `git merge master`, e rodar a
suíte e o verificador antes de seguir.

- [ ] **Step 1: RED** — `node tools/check-dom-injection.mjs | grep docs-lote` lista os 13 parses.

- [ ] **Step 2: Converter** — em cada linha acusada, `$(x)` → `lerHtmlPro(x)`. Para cada uma,
  ler o uso seguinte: `.find(...)`, `.attr(...)`, `.val()` e `.serialize()` num `<form>` funcionam
  igual sobre o documento inerte; se algum uso depender de o nó estar **no documento vivo**
  (medir tamanho, `.is(':visible')`), manter aquela linha e registrá-la na mensagem de commit.

- [ ] **Step 3: GREEN** — `check-dom-injection` sem `ERRO` do `docs-lote`; `conferir-modos` com
  `0 divergencia(s)`; suíte verde.

- [ ] **Step 4: Ao vivo** — Documentos em Lote por documento da árvore **e** por texto padrão, até o
  passo 2/6 (select de tipo com opções, OK habilitado ao escolher). Gerar documentos no SEI de
  treinamento só com autorização do autor na hora.

- [ ] **Step 5: Commit**

```bash
git add dist/js/sei-pro-docs-lote.js
git commit -m "Documentos em Lote: respostas do SEI lidas em documento inerte

O plano 1 converteu as insercoes deste arquivo, mas as respostas do SEI
continuavam sendo parseadas por \$(html), no documento vivo, onde um
<img onerror> da resposta executaria. Agora lerHtmlPro.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---
## Task 12: Fechamento

**Files:**
- Modify: `dist/manifest.json` (versão; os 11 manifests de whitelabel são ignorados pelo git mas
  recebem a mesma versão), `pages/HISTORICO.md`
- Memória: `project_dom_seguro_firefox.md`, `project_dom_seguro_licoes_conversao.md`

- [ ] **Step 1: Bateria completa**

```bash
export SPRO_REF_BASE=refs/dom-seguro/base-plano2
(cd tests && node --test dom-seguro/ ferramentas/ 2>&1 | grep -E "^# (tests|pass|fail)")
node tools/check-dom-injection.mjs | tail -3
for f in sei-legis init sei-pro-proc-lote sei-pro-docs-lote sei-pro-prescricoes sei-pro-all sei-pro-projetos sei-pro-favoritos sei-pro sei-pro-arvore; do
  printf "%-22s " $f; node tools/produtores-pendentes.mjs dist/js/$f.js | tail -1
  printf "%-22s " $f; node tools/conferir-modos.mjs dist/js/$f.js | tail -1
done
```
Esperado: `# pass 116`, `# fail 0`; `check-dom-injection: 0 erro(s)` e a contagem de `htmlCruPro`
registrada (é a dívida que o plano 3 zera); `0 erro(s)` e `0 divergencia(s)` nos dez arquivos.

- [ ] **Step 2: Regressão ampla ao vivo, nos dois SEI**

Daemon com o código final. SEI SP 4.1.5 e SEI MJ 5 (`hmlsei` — **não** `sei.mj.gov.br`). Em cada
tela, a sonda; esperado: `marca: 'sim'`, despachante único, `orfaos: []`, **zero** aviso
`[SEIPro] htmlPro:` e zero `pageerror`.
Telas: Controle de Processos (tabela, quadro, painel de favoritos, painel de projetos); processo
aberto (árvore, visualização, capa); editor de um documento (a Legística, do plano 1); Enviar
Processo (sem enviar); Pesquisa; Configurar; e o gestor de atividades com o backend conectado
(`tests/ao-vivo/backend.mjs`), nas oito telas que renderizaram na regressão de 25/09 — ele não
foi convertido, e tem de seguir intacto ao lado de tudo isto.

- [ ] **Step 3: Revisão final em contexto novo**

Pacote da branch inteira (`git diff refs/dom-seguro/base-plano2..HEAD`), revisor no modelo mais
capaz, com este plano, o spec, e a seção *Review Focus* colada. Críticos e importantes entram numa
passada de correção, cada um com teste que falha antes; menores vão para a mensagem final.

- [ ] **Step 4: Versão e histórico**

```bash
git tag --sort=-v:refname | head -3      # a versao nova e a seguinte a maior
V=<a seguinte>
for f in dist/manifest*.json; do perl -0pi -e "s/(\"version\"\s*:\s*\")[^\"]*(\")/\${1}$V\${2}/" "$f"; done
grep -h -o '"version": "[^"]*"' dist/manifest*.json | sort | uniq -c
git diff --stat dist/manifest.json
```
Esperado: os 12 com a versão nova; `1 insertion(+), 1 deletion(-)` no `manifest.json`.

Entrada no `pages/HISTORICO.md`, no formato que o site parseia (ver a entrada da 2.2.2), com: a
volta do tooltip e do clique no selo de prazo das prescrições (regressão da 2.2.2); a continuação
da preparação para o Firefox (cinco telas mais pelo caminho único; o JavaScript que era montado em
texto no *Manter em Favoritos*; as respostas do SEI lidas sem executar nada); e "sem mudança de
funcionamento". Sem jargão.

- [ ] **Step 5: Commit, memória e pergunta ao autor**

```bash
git add dist/manifest.json pages/HISTORICO.md
git commit -m "Versao <V>: DOM seguro nas camadas 3 a 7

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

Atualizar a memória: `project_dom_seguro_firefox.md` (plano 2 concluído; a contagem de
`htmlCruPro` que o plano 3 herda; os produtores pendentes por nome) e
`project_dom_seguro_licoes_conversao.md` (as classes novas: produtor pendente, as populações P4 e
P5, captura, tipo de argumento, iframe aninhado, corrida de carga, `in` que vê herança).

Integrar ao `master` e publicar são decisões do autor: perguntar.
