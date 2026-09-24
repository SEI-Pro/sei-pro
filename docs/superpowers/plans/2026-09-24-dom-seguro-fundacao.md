# DOM seguro — fundação e primeiras camadas (plano 1 de 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o portão de inserção de HTML (`htmlPro`), o despachante de ações
`data-spro-*` e as quatro ferramentas de verificação, e provar o padrão ao vivo convertendo os
cinco arquivos mais simples da extensão.

**Architecture:** Um bloco novo em `dist/js/sei-functions-pro.js`, delimitado por sentinelas,
concentra toda a sanitização e todo o despacho de eventos. `htmlPro` sanitiza com contexto de
parsing (embrulha fragmento de tabela antes de passar pelo DOMPurify e desembrulha depois),
insere e garante o despachante no documento de destino. As ações deixam de viajar em atributo
`on*` e passam a viajar em `data-spro-*`, resolvidas por caminho pontuado sem `eval`. Só o mundo
da página despacha, porque `sei-functions-pro.js` roda nos dois mundos e um despachante em cada
dispararia toda ação duas vezes.

**Tech Stack:** JavaScript ES5 no `dist/` (é o dialeto do arquivo e ele roda no mundo da página
do SEI), jQuery 3.4.1, DOMPurify 3.2.5, Node 20 com `node:test` e jsdom 24 para os testes,
ferramentas de linha de comando em ESM no `tools/`.

**Spec:** [docs/superpowers/specs/2026-09-23-dom-seguro-firefox-design.md](../specs/2026-09-23-dom-seguro-firefox-design.md)

## Decomposição em quatro planos

O spec cobre 10 camadas mais a frente de bibliotecas. Isso não cabe num plano só, e o autor
pediu explicitamente para avançar em camadas, testando antes de seguir. A divisão:

| plano | conteúdo | por quê |
|---|---|---|
| **1 (este)** | camada 0 (infra + ferramentas), camada 1 (`sei-legis.js`), camada 2 (4 arquivos pequenos) | entrega software funcionando e **prova o padrão ao vivo** antes de escalar |
| 2 | camadas 3 a 7 (`all`, `projetos`, `favoritos`, `sei-pro`, `arvore`) | repetição do padrão já validado |
| 3 | camadas 8 e 9 (`sei-functions-pro`, `atividades` em 5 sub-entregas) | os dois mais delicados, com o padrão maduro |
| 4 | frente 2 — bibliotecas de terceiros | independente, roda em paralelo |

Os planos 2, 3 e 4 só são escritos depois que este for validado ao vivo.

## Global Constraints

- **Acentos em `dist/js/*.js` têm de ser `\uXXXX`.** UTF-8 cru vira mojibake quando o SEI injeta
  o script sem `charset=utf-8`. Rodar `node tools/escape-nonascii.mjs --check <arquivo>` antes de
  cada commit que toque `dist/js/`. Nas mensagens de console deste plano, escrever sem acento
  (`acao inexistente`), como já faz `sei-pro-editor-adapter.js`.
- **Dialeto ES5 em `dist/js/*.js`** fora dos template literals: `var`, `function`, sem arrow, sem
  `const`/`let`, sem `?.`. É o padrão do arquivo e ele convive com navegadores antigos em órgãos.
  Template literal é permitido (é o objetivo do trabalho) e já é usado em `js/modules/`.
- **Toda conversão é iso-funcional.** Nada de mudança de comportamento, texto ou layout.
- **`tools/` e `tests/` são ignorados pelo git** (ver `.gitignore`). As ferramentas e os testes
  deste plano **não entram em commit** — existem só na máquina do autor. Os commits contêm apenas
  `dist/`, `docs/` e `pages/`.
- **Nunca `git add -A`.** O repositório pode ter outra sessão trabalhando; adicionar por caminho.
- **Versão alvo:** `2.1.1` → `2.1.2`, aplicada em todos os 12 manifests só na Task 11.
- **Todo release atualiza `pages/HISTORICO.md`.**

## Review Focus

Cinco situações que o spec pressupõe, que nenhum teste de tarefa exercita por acidente, e onde o
teste correspondente foi encaixado:

1. **`htmlPro` chamado antes do DOMPurify carregar.** A extensão carrega o purify por
   `$.getScript`, de forma assíncrona; uma inserção precoce não pode cair em HTML cru nem
   estourar. → teste na Task 2.
2. **`data-spro-args` com JSON inválido** (aspas que o autor escapou errado no template). Tem de
   avisar e não rodar a ação, nunca inserir `undefined` na tela. → teste na Task 4.
3. **Nome de ação apontando para propriedade que não é função** (`data-spro-click="window"`, ou
   função que foi removida numa refatoração). Tem de avisar, não estourar. → teste na Task 4.
4. **Elemento `<a href="url-real">` com `data-spro-click`.** `preventDefault` indiscriminado
   mataria navegação legítima; o spec manda prevenir só quando o `href` é `#`, `javascript:` ou
   ausente. → teste na Task 4.
5. **Ação disparada dentro de iframe, chamando função do topo (`parent.fn`).** É metade dos
   handlers da árvore e do visualizador; resolver caminho pontuado no `window` errado deixa o
   botão mudo. → teste na Task 4.

---

## Task 1: Harness de teste e sanitização com contexto de parsing

**Files:**
- Create: `tests/package.json`
- Create: `tests/dom-seguro/harness.mjs`
- Create: `tests/dom-seguro/sanitizar.test.mjs`
- Modify: `dist/js/sei-functions-pro.js` (inserir bloco novo logo após `sanitizeHTML`, hoje na linha 555)

**Interfaces:**
- Consumes: `isCopiaIsoladaPro()` e `getRuntimeExtensaoPro()`, já definidos em
  `dist/js/sei-functions-pro.js` por volta da linha 140.
- Produces: `SEIPRO_PURIFY_CONFIG`, `ENVELOPES_PRO`, `avisarPro(msg, detalhe)`,
  `erroPro(msg, detalhe)`, `sanitizarFragmentoPro(html, doc) -> string`. As sentinelas
  `// === INICIO SEI PRO DOM ===` e `// === FIM SEI PRO DOM ===` delimitam o bloco e são o
  contrato do harness — não removê-las nem duplicá-las.

- [ ] **Step 1: Criar o projeto de teste**

`tests/package.json`:

```json
{
  "name": "seipro-tests",
  "private": true,
  "type": "module",
  "devDependencies": { "jsdom": "^24.1.0" }
}
```

Rodar: `cd tests && npm install`

- [ ] **Step 2: Escrever o harness**

O harness carrega o bloco **do arquivo real**, não de uma cópia — assim o teste não pode
divergir do que é publicado.

`tests/dom-seguro/harness.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const RAIZ = new URL('../../', import.meta.url);
const INICIO = '// === INICIO SEI PRO DOM ===';
const FIM = '// === FIM SEI PRO DOM ===';

function lerBloco() {
  const fonte = readFileSync(new URL('dist/js/sei-functions-pro.js', RAIZ), 'utf8');
  const i = fonte.indexOf(INICIO);
  const f = fonte.indexOf(FIM);
  if (i < 0 || f < 0) throw new Error('sentinelas do bloco SEI PRO DOM nao encontradas');
  if (fonte.indexOf(INICIO, i + 1) >= 0) throw new Error('sentinela de inicio duplicada');
  return fonte.slice(i, f + FIM.length);
}

/**
 * Monta uma janela jsdom com jQuery, DOMPurify e o bloco real carregados.
 * `isolada` simula a copia do mundo isolado (que nao instala despachante).
 */
export function montar({ html = '<!doctype html><html><body></body></html>', isolada = false } = {}) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://sei.exemplo.br/sei/' });
  const w = dom.window;
  w.eval(readFileSync(new URL('dist/js/lib/jquery-3.4.1.min.js', RAIZ), 'utf8'));
  w.eval(readFileSync(new URL('dist/js/lib/purify.min.js', RAIZ), 'utf8'));
  // Definidos fora do bloco, no arquivo real; aqui entram como dublê.
  w.eval('function isCopiaIsoladaPro() { return window.__isolada === true; }');
  w.__isolada = isolada;
  w.eval(lerBloco());
  return { dom, w, $: w.jQuery };
}

/** Remove a janela para o processo de teste nao vazar memoria entre casos. */
export function desmontar(ctx) { try { ctx.dom.window.close(); } catch (e) {} }
```

- [ ] **Step 3: Escrever os testes que falham**

`tests/dom-seguro/sanitizar.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montar, desmontar } from './harness.mjs';

function comJanela(fn) {
  const ctx = montar();
  try { return fn(ctx); } finally { desmontar(ctx); }
}

test('fragmento de <tr> sobrevive a sanitizacao', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<tr class="linha"><td>a</td><td>b</td></tr>');
    assert.match(out, /<tr class="linha">/);
    assert.match(out, /<td>a<\/td>/);
    assert.match(out, /<td>b<\/td>/);
  });
});

test('varios <tr> irmaos sobrevivem', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<tr><td>1</td></tr><tr><td>2</td></tr>');
    assert.equal((out.match(/<tr>/g) || []).length, 2);
  });
});

test('<td> solto sobrevive com seus atributos', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<td colspan="3" align="right">x</td>');
    assert.match(out, /<td[^>]*colspan="3"/);
    assert.match(out, /align="right"/);
  });
});

test('<option> solto sobrevive', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<option value="1" selected="selected">a</option>');
    assert.match(out, /<option[^>]*value="1"/);
  });
});

test('<li> solto sobrevive', () => {
  comJanela(({ w }) => {
    assert.match(w.sanitizarFragmentoPro('<li class="i">a</li>'), /<li class="i">a<\/li>/);
  });
});

test('atributo on* continua sendo removido', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<a onclick="x()" onmouseover="return t()">y</a>');
    assert.doesNotMatch(out, /onclick/);
    assert.doesNotMatch(out, /onmouseover/);
  });
});

test('data-spro-* sobrevive', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<a data-spro-click="fn" data-spro-args="[1]" data-spro-tip="t">y</a>');
    assert.match(out, /data-spro-click="fn"/);
    assert.match(out, /data-spro-args="\[1\]"/);
    assert.match(out, /data-spro-tip="t"/);
  });
});

test('accesskey sobrevive pela config', () => {
  comJanela(({ w }) => {
    assert.match(w.sanitizarFragmentoPro('<a accesskey=";">y</a>'), /accesskey=";"/);
  });
});

test('target sobrevive pela config', () => {
  comJanela(({ w }) => {
    assert.match(w.sanitizarFragmentoPro('<a href="https://x/" target="_blank">y</a>'), /target="_blank"/);
  });
});

test('style inline, classe e icone FA sobrevivem', () => {
  comJanela(({ w }) => {
    const out = w.sanitizarFragmentoPro('<div class="c" style="color:red"><i class="fas fa-sync"></i></div>');
    assert.match(out, /style="color:red"/);
    assert.match(out, /<i class="fas fa-sync">/);
  });
});

test('iframe e script continuam removidos (config restrita)', () => {
  comJanela(({ w }) => {
    assert.equal(w.sanitizarFragmentoPro('<iframe src="about:blank"></iframe>').trim(), '');
    assert.equal(w.sanitizarFragmentoPro('<script>x()</script>').trim(), '');
  });
});

test('entrada nao-string nao estoura', () => {
  comJanela(({ w }) => {
    assert.equal(w.sanitizarFragmentoPro(null), '');
    assert.equal(w.sanitizarFragmentoPro(undefined), '');
    assert.equal(w.sanitizarFragmentoPro(42), '42');
  });
});
```

- [ ] **Step 4: Rodar e confirmar que falha**

Rodar: `cd tests && node --test dom-seguro/sanitizar.test.mjs`
Esperado: FALHA com `Error: sentinelas do bloco SEI PRO DOM nao encontradas`

- [ ] **Step 5: Inserir o bloco em `dist/js/sei-functions-pro.js`**

Logo após o `sanitizeHTML` existente (hoje a linha 555, logo antes de `normalizeHTML`). Não
alterar o `sanitizeHTML` — há 17 pontos em `js/modules/editor/` usando-o.

```javascript
// === INICIO SEI PRO DOM ===
// Portao unico de insercao de HTML da extensao. Existe por causa da rejeicao da AMO de
// 17/06/2025 ("Unsanitized DOM injection"): toda marcacao gerada pela extensao passa por
// aqui, e nenhuma acao viaja mais em atributo on*.
//
// POR QUE NAO BASTA CHAMAR sanitizeHTML NOS PONTOS DE INSERCAO. O DOMPurify parseia o
// fragmento fora do elemento-pai, e o parser de HTML descarta <tr>, <td> e <tbody> que nao
// estejam dentro de uma tabela: "<tr><td>a</td></tr>" volta como "a". Medido com o
// purify.min.js 3.2.5 desta pasta. sanitizarFragmentoPro embrulha antes e desembrulha depois.
var SEIPRO_PURIFY_CONFIG = {
    // 'target' ja era necessario ao sanitizeHTML; 'accesskey' aparece em 33 pontos da
    // extensao (a marca de "selecionar tudo" do SEI) e o DOMPurify o remove por padrao.
    ADD_ATTR: ['target', 'accesskey'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|chrome-extension|moz-extension):|[^a-z]|[a-z+\-.]+(?:[^a-z+\-.:]|$))/i
};

// Tag inicial do fragmento -> abertura que o parser precisa para nao descartar o conteudo.
var ENVELOPES_PRO = {
    tr: '<table>', tbody: '<table>', thead: '<table>', tfoot: '<table>', colgroup: '<table>',
    td: '<table><tr>', th: '<table><tr>',
    option: '<select>', optgroup: '<select>',
    li: '<ul>', dt: '<dl>', dd: '<dl>'
};

function avisarPro(msg, detalhe) {
    try { console.warn('[SEIPro] ' + msg, detalhe === undefined ? '' : detalhe); } catch (e) {}
}

function erroPro(msg, detalhe) {
    try { console.error('[SEIPro] ' + msg, detalhe === undefined ? '' : detalhe); } catch (e) {}
}

// Sanitiza um fragmento respeitando o contexto de parsing que ele exige.
function sanitizarFragmentoPro(html, doc) {
    doc = doc || document;
    if (html === null || html === undefined) return '';
    var texto = String(html);
    var achadoTag = /^\s*<\s*([a-zA-Z][\w-]*)/.exec(texto);
    var tag = achadoTag ? achadoTag[1].toLowerCase() : '';
    var abre = ENVELOPES_PRO[tag];
    if (!abre) return DOMPurify.sanitize(texto, SEIPRO_PURIFY_CONFIG);
    // '<table><tr>' -> '</tr></table>'
    var fecha = abre.match(/[a-z]+/g).reverse().map(function (t) { return '</' + t + '>'; }).join('');
    var limpo = DOMPurify.sanitize(abre + texto + fecha, SEIPRO_PURIFY_CONFIG);
    var caixa = doc.createElement('div');
    caixa.innerHTML = limpo;
    // O parser insere <tbody> sozinho, entao a profundidade do desembrulho nao e fixa:
    // acha-se o primeiro elemento da tag original e devolve-se o conteudo do pai dele.
    var achado = caixa.querySelector(tag);
    if (!achado || !achado.parentNode) return '';
    return achado.parentNode.innerHTML;
}
// === FIM SEI PRO DOM ===
```

- [ ] **Step 6: Rodar os testes**

Rodar: `cd tests && node --test dom-seguro/sanitizar.test.mjs`
Esperado: `# pass 12`, `# fail 0`

- [ ] **Step 7: Conferir a regra dos acentos e commitar**

```bash
node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: sanitizacao com contexto de parsing

O DOMPurify descarta <tr>, <td> e <tbody> soltos porque os parseia fora
da tabela: um fragmento de linha volta como texto puro. Como a extensao
monta tabelas em pedacos, sanitizar direto nos pontos de insercao
quebraria a tela. sanitizarFragmentoPro embrulha o fragmento na tag que
o parser exige e desembrulha depois.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `htmlPro` — o portão de inserção

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (dentro do bloco, antes da sentinela de fim)
- Create: `tests/dom-seguro/htmlpro.test.mjs`

**Interfaces:**
- Consumes: `sanitizarFragmentoPro(html, doc)`, `avisarPro(msg, detalhe)` da Task 1.
- Produces: `htmlPro(alvo, html, modo) -> jQuery` e `estiloPro(doc, chave, css, posicao) -> Element`.
  `modo` é `'html'` (padrão), `'append'`, `'prepend'`, `'before'`, `'after'` ou `'replace'`.
  `htmlPro` chama `installActionsPro(doc)`, que só existe a partir da Task 4 — até lá a chamada
  fica protegida por `typeof`.

`estiloPro` nasce aqui, mas **os 11 pontos da seção 4.4 do spec** (os `<iframe>`, `<style>` e
`<script>` que a sanitização remove) vivem em `sei-functions-pro.js` e `sei-pro-atividades.js`
— eles são convertidos nas camadas 8 e 9, ou seja, no **plano 3**. Nenhum deles está entre os
cinco arquivos deste plano, então nada aqui depende dessa conversão. O helper entra agora
porque é parte indivisível do portão e custa dez linhas testadas.

- [ ] **Step 1: Escrever os testes que falham**

`tests/dom-seguro/htmlpro.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montar, desmontar } from './harness.mjs';

function comJanela(fn, opcoes) {
  const ctx = montar(opcoes);
  try { return fn(ctx); } finally { desmontar(ctx); }
}

test('htmlPro substitui o conteudo por padrao', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a">velho</div>');
    w.htmlPro('#a', '<span class="novo">x</span>');
    assert.equal($('#a').html(), '<span class="novo">x</span>');
  });
});

test('htmlPro devolve o jQuery do alvo, para encadear', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a"></div>');
    const r = w.htmlPro('#a', '<b>x</b>');
    assert.equal(r.attr('id'), 'a');
  });
});

test('htmlPro aceita seletor, elemento e objeto jQuery como alvo', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a"></div><div id="b"></div><div id="c"></div>');
    w.htmlPro('#a', '<b>1</b>');
    w.htmlPro(w.document.getElementById('b'), '<b>2</b>');
    w.htmlPro($('#c'), '<b>3</b>');
    assert.equal($('#a b').text(), '1');
    assert.equal($('#b b').text(), '2');
    assert.equal($('#c b').text(), '3');
  });
});

test('htmlPro honra os cinco modos de insercao', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="p"><i id="a">A</i></div>');
    w.htmlPro('#a', '<b>ap</b>', 'append');
    w.htmlPro('#a', '<b>pre</b>', 'prepend');
    assert.equal($('#a').html(), '<b>pre</b>A<b>ap</b>');
    w.htmlPro('#a', '<u>antes</u>', 'before');
    w.htmlPro('#a', '<u>depois</u>', 'after');
    assert.equal($('#p').children().first().prop('tagName'), 'U');
    assert.equal($('#p').children().last().prop('tagName'), 'U');
    w.htmlPro('#a', '<em id="novo">x</em>', 'replace');
    assert.equal($('#a').length, 0);
    assert.equal($('#novo').length, 1);
  });
});

test('htmlPro sanitiza: onclick nao chega ao DOM', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a"></div>');
    w.htmlPro('#a', '<a onclick="alert(1)">x</a>');
    assert.equal($('#a a').attr('onclick'), undefined);
  });
});

test('htmlPro insere fragmento de tabela sem destruir a linha', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<table id="t"><tbody id="tb"></tbody></table>');
    w.htmlPro('#tb', '<tr class="l"><td>a</td></tr>', 'append');
    assert.equal($('#tb tr.l td').text(), 'a');
  });
});

test('alvo inexistente avisa e nao estoura', () => {
  comJanela(({ w }) => {
    const avisos = [];
    w.console.warn = (...a) => avisos.push(a.join(' '));
    const r = w.htmlPro('#nao-existe', '<b>x</b>');
    assert.equal(r.length, 0);
    assert.ok(avisos.some((m) => m.includes('alvo inexistente')));
  });
});

// Review Focus 1: DOMPurify ainda nao carregou
test('sem DOMPurify, htmlPro aborta insercao com marcacao e avisa', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a">intacto</div>');
    const guardado = w.DOMPurify;
    w.DOMPurify = undefined;
    const avisos = [];
    w.console.warn = (...a) => avisos.push(a.join(' '));
    w.htmlPro('#a', '<b>perigo</b>');
    assert.equal($('#a').html(), 'intacto', 'nao pode inserir HTML cru');
    assert.ok(avisos.some((m) => m.includes('DOMPurify ausente')));
    w.DOMPurify = guardado;
  });
});

test('sem DOMPurify, texto puro ainda e inserido', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<div id="a"></div>');
    const guardado = w.DOMPurify;
    w.DOMPurify = undefined;
    w.htmlPro('#a', 'so texto');
    assert.equal($('#a').text(), 'so texto');
    w.DOMPurify = guardado;
  });
});

test('estiloPro cria o bloco de estilo e e idempotente pela chave', () => {
  comJanela(({ w, $ }) => {
    w.estiloPro(w.document, 'seipro-teste', '.x{color:red}');
    w.estiloPro(w.document, 'seipro-teste', '.x{color:blue}');
    const achados = $('style[data-style="seipro-teste"]');
    assert.equal(achados.length, 1, 'a segunda chamada substitui a primeira');
    assert.equal(achados.text(), '.x{color:blue}');
  });
});

test('estiloPro recusa chave fora do formato', () => {
  comJanela(({ w }) => {
    assert.equal(w.estiloPro(w.document, 'a"]/*', '.x{}'), null);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Rodar: `cd tests && node --test dom-seguro/htmlpro.test.mjs`
Esperado: FALHA com `TypeError: w.htmlPro is not a function`

- [ ] **Step 3: Implementar dentro do bloco**

Acrescentar antes de `// === FIM SEI PRO DOM ===`:

```javascript
// Insere HTML com sanitizacao. E o unico caminho permitido: o verificador
// tools/check-dom-injection.mjs reprova .html()/.innerHTML em arquivo ja convertido.
// Devolve o jQuery do alvo, como .html()/.append()/.after(), para ser drop-in.
function htmlPro(alvo, html, modo) {
    var $alvo = (alvo && alvo.jquery) ? alvo : $(alvo);
    if (!$alvo.length) { avisarPro('htmlPro: alvo inexistente', alvo); return $alvo; }
    var doc = $alvo[0].ownerDocument || document;
    var texto = (html === null || html === undefined) ? '' : String(html);
    var limpo;
    if (typeof DOMPurify === 'undefined' || !DOMPurify || typeof DOMPurify.sanitize !== 'function') {
        // O purify entra por $.getScript, de forma assincrona. Cair para HTML cru aqui
        // derrotaria o proposito do portao, entao texto puro passa e marcacao nao.
        if (/[<&]/.test(texto)) { avisarPro('htmlPro: DOMPurify ausente, insercao abortada', texto.slice(0, 80)); return $alvo; }
        limpo = texto;
    } else {
        limpo = sanitizarFragmentoPro(texto, doc);
    }
    switch (modo || 'html') {
        case 'append':  $alvo.append(limpo); break;
        case 'prepend': $alvo.prepend(limpo); break;
        case 'before':  $alvo.before(limpo); break;
        case 'after':   $alvo.after(limpo); break;
        case 'replace': $alvo.replaceWith(limpo); break;
        default:        $alvo.html(limpo);
    }
    if (typeof installActionsPro === 'function') installActionsPro(doc);
    return $alvo;
}

// Bloco <style> por DOM API. O DOMPurify remove <style> do fragmento, e a config
// permissiva que o deixaria passar enfraqueceria o argumento perante a AMO; como sao
// poucos pontos, eles constroem o elemento em vez de injetar marcacao.
function estiloPro(doc, chave, css, posicao) {
    doc = doc || document;
    if (!/^[\w-]+$/.test(String(chave))) { avisarPro('estiloPro: chave invalida', chave); return null; }
    var anterior = doc.querySelector('style[data-style="' + chave + '"]');
    if (anterior && anterior.parentNode) anterior.parentNode.removeChild(anterior);
    var el = doc.createElement('style');
    el.setAttribute('type', 'text/css');
    el.setAttribute('data-style', chave);
    el.textContent = String(css);
    var casa = doc.head || doc.documentElement;
    if (posicao === 'prepend' && casa.firstChild) casa.insertBefore(el, casa.firstChild);
    else casa.appendChild(el);
    return el;
}
```

- [ ] **Step 4: Rodar os testes**

Rodar: `cd tests && node --test dom-seguro/htmlpro.test.mjs`
Esperado: `# pass 11`, `# fail 0`

- [ ] **Step 5: Commitar**

```bash
node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: htmlPro, o portao unico de insercao

Substitui .html()/.append() com string por um caminho unico que sanitiza,
insere e (a partir da proxima etapa) religa as acoes. Sem DOMPurify
carregado ele recusa marcacao em vez de cair para HTML cru, que era o
defeito que a AMO apontou.

estiloPro cobre os blocos <style>, que o DOMPurify remove e que nao
justificam afrouxar a config.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Ferramenta de diagnóstico prévio (`diff-sanitize` e `inventario-acoes`)

**Files:**
- Create: `tools/diff-sanitize.mjs`
- Create: `tools/inventario-acoes.mjs`

**Interfaces:**
- Consumes: `dist/js/lib/purify.min.js`, e a mesma `SEIPRO_PURIFY_CONFIG` do bloco (a ferramenta
  a lê do arquivo real, para não haver duas verdades).
- Produces: dois comandos de linha. `node tools/diff-sanitize.mjs <arquivo.js>` imprime tags e
  atributos que a sanitização removeria. `node tools/inventario-acoes.mjs <arquivo.js>` imprime
  o inventário esperado de ações. Ambos saem com código 0 sempre — são diagnóstico, não portão.

- [ ] **Step 1: Escrever `tools/diff-sanitize.mjs`**

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

const texto = readFileSync(resolve(RAIZ, arquivo), 'utf8');

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
  RE_ATTR.lastIndex = 0;
  while ((a = RE_ATTR.exec(m[2]))) attrsPorTag.get(tag).add(a[1].toLowerCase());
}

const ENVELOPES = { tr: '<table>', tbody: '<table>', thead: '<table>', tfoot: '<table>',
  colgroup: '<table>', td: '<table><tr>', th: '<table><tr>', option: '<select>',
  optgroup: '<select>', li: '<ul>', dt: '<dl>', dd: '<dl>' };

function sobrevive(html, tag) {
  const limpo = w.sanitizarFragmentoPro(html);
  const caixa = w.document.createElement('div');
  caixa.innerHTML = ENVELOPES[tag] ? `<table><tbody><tr>${limpo}</tr></tbody></table>` : limpo;
  return caixa.querySelector(tag) !== null;
}

const tagsPerdidas = [];
const attrsPerdidos = [];
for (const [tag, n] of [...tags].sort((a, b) => b[1] - a[1])) {
  const amostra = `<${tag}></${tag}>`;
  if (!sobrevive(amostra, tag)) { tagsPerdidas.push([tag, n]); continue; }
  for (const attr of attrsPorTag.get(tag)) {
    if (/^on/i.test(attr)) continue; // removidos de proposito; sao o alvo da conversao
    const comAttr = `<${tag} ${attr}="v"></${tag}>`;
    const limpo = w.sanitizarFragmentoPro(comAttr);
    const caixa = w.document.createElement('div');
    caixa.innerHTML = ENVELOPES[tag] ? `<table><tbody><tr>${limpo}</tr></tbody></table>` : limpo;
    const el = caixa.querySelector(tag);
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

- [ ] **Step 2: Escrever `tools/inventario-acoes.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Inventario ESPERADO de acoes de um arquivo, tirado dos atributos on* antes da conversao.
 *
 * POR QUE EXISTE. Depois de converter, auditActionsPro() diz quais acoes o DOM tem e se
 * todas resolvem. Sem uma lista de ANTES, a comparacao vira impressao. Esta ferramenta
 * produz a lista de antes, e ainda separa os handlers que nao sao chamada simples -- os
 * que precisam de decisao humana.
 *
 * Uso: node tools/inventario-acoes.mjs dist/js/sei-pro-favoritos.js
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arquivo = process.argv[2];
if (!arquivo) { console.error('uso: node tools/inventario-acoes.mjs <arquivo.js>'); process.exit(2); }
const texto = readFileSync(resolve(RAIZ, arquivo), 'utf8');

const RE = /\bon(click|change|blur|focus|input|keyup|keydown|keypress|submit|mouseover|mouseout|mouseenter|mouseleave|dblclick|contextmenu|paste|select|scroll|load|error)\s*=\s*(\\?["'])/g;

const simples = new Map();     // nome -> contagem
const tooltips = new Map();    // texto -> contagem
const manuais = [];            // precisa de decisao humana
let m;
while ((m = RE.exec(texto))) {
  const evento = 'on' + m[1];
  const aspas = m[2];
  const ini = m.index + m[0].length;
  const fim = texto.indexOf(aspas, ini);
  const carga = (fim < 0 ? '' : texto.slice(ini, fim)).trim();
  const linha = texto.slice(0, m.index).split('\n').length;

  const tip = /^return\s+_?infraTooltip(Mostrar|Ocultar)\s*\(([\s\S]*)\)\s*;?$/.exec(carga);
  if (tip) { tooltips.set(carga, (tooltips.get(carga) || 0) + 1); continue; }

  const chamada = /^([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(([\s\S]*)\)\s*;?$/.exec(carga);
  if (chamada && !/[;{]/.test(chamada[2])) {
    const nome = chamada[1];
    const args = chamada[2].trim();
    const chave = `${nome}  [${evento}]${args === '' || args === 'this' ? '' : '  args: ' + args}`;
    simples.set(chave, (simples.get(chave) || 0) + 1);
    continue;
  }
  manuais.push(`${arquivo}:${linha}  ${evento}="${carga.slice(0, 100)}"`);
}

console.log(`\n=== inventario de acoes: ${arquivo} ===\n`);
console.log(`CHAMADAS (${[...simples.values()].reduce((a, b) => a + b, 0)}):`);
for (const [k, n] of [...simples].sort()) console.log(`   ${String(n).padStart(4)}x  ${k}`);
console.log(`\nTOOLTIPS (${[...tooltips.values()].reduce((a, b) => a + b, 0)}): viram data-spro-tip`);
console.log(`\nPRECISAM DE DECISAO HUMANA (${manuais.length}):`);
for (const l of manuais) console.log('   ' + l);
console.log('');
```

- [ ] **Step 3: Rodar as duas nos arquivos da camada 2 e conferir**

```bash
node tools/diff-sanitize.mjs dist/js/sei-legis.js
node tools/diff-sanitize.mjs dist/js/sei-pro-docs-lote.js
node tools/inventario-acoes.mjs dist/js/sei-pro-prescricoes.js
node tools/inventario-acoes.mjs dist/js/sei-pro-docs-lote.js
```

Esperado: saída legível, sem exceção. `diff-sanitize` em `sei-legis.js` deve apontar poucas ou
nenhuma tag perdida; `inventario-acoes` em `sei-pro-prescricoes.js` deve listar 12 handlers.

- [ ] **Step 4: Não commitar**

`tools/` é ignorado pelo git (ver `.gitignore`). Confirmar que nada entrou:

```bash
git status --short
```

Esperado: nenhuma linha citando `tools/`.

---

## Task 4: O despachante de ações

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (dentro do bloco, antes da sentinela de fim)
- Create: `tests/dom-seguro/acoes.test.mjs`

**Interfaces:**
- Consumes: `avisarPro`, `erroPro` (Task 1), `htmlPro` (Task 2), `isCopiaIsoladaPro()` (já existe
  no arquivo).
- Produces: `EVENTOS_ACAO_PRO` (array), `resolverAcaoPro(nome, win) -> {fn, dono}|null`,
  `argumentosAcaoPro(el, ev) -> Array|null`, `devePrevenirPro(el) -> boolean`,
  `dispararAcaoPro(el, ev, atributo)`, `mostrarTipPro(el)`, `ocultarTipPro(el)`,
  `installActionsPro(doc) -> boolean`.

- [ ] **Step 1: Escrever os testes que falham**

`tests/dom-seguro/acoes.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montar, desmontar } from './harness.mjs';

function comJanela(fn, opcoes) {
  const ctx = montar(opcoes);
  try { return fn(ctx); } finally { desmontar(ctx); }
}

test('data-spro-click chama a funcao com o elemento como argumento padrao', () => {
  comJanela(({ w, $ }) => {
    const vistos = [];
    w.minhaAcao = function (el) { vistos.push(el && el.id); };
    w.htmlPro('body', '<a id="x" data-spro-click="minhaAcao">c</a>', 'append');
    $('#x').trigger('click');
    assert.deepEqual(vistos, ['x']);
  });
});

test('funcao sem parametro tambem funciona (argumento extra e ignorado)', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    w.semArg = function () { n++; };
    w.htmlPro('body', '<a id="x" data-spro-click="semArg">c</a>', 'append');
    $('#x').trigger('click');
    assert.equal(n, 1);
  });
});

test('data-spro-args passa argumentos, com $el e $ev', () => {
  comJanela(({ w, $ }) => {
    let rec = null;
    w.comArgs = function (a, b, c) { rec = [a, b && b.id, typeof c]; };
    w.htmlPro('body', `<a id="x" data-spro-click="comArgs" data-spro-args='[482,"$el","$ev"]'>c</a>`, 'append');
    $('#x').trigger('click');
    assert.deepEqual(rec, [482, 'x', 'object']);
  });
});

// Review Focus 2
test('data-spro-args com JSON invalido avisa e nao roda a acao', () => {
  comJanela(({ w, $ }) => {
    let rodou = false;
    w.naoDeveRodar = function () { rodou = true; };
    const avisos = [];
    w.console.warn = (...a) => avisos.push(a.join(' '));
    w.htmlPro('body', `<a id="x" data-spro-click="naoDeveRodar" data-spro-args='[1,]'>c</a>`, 'append');
    $('#x').trigger('click');
    assert.equal(rodou, false);
    assert.ok(avisos.some((m) => m.includes('argumentos invalidos')));
  });
});

// Review Focus 3
test('nome que nao resolve em funcao avisa e nao estoura', () => {
  comJanela(({ w, $ }) => {
    const avisos = [];
    w.console.warn = (...a) => avisos.push(a.join(' '));
    w.htmlPro('body', '<a id="x" data-spro-click="naoExisteEsta">c</a><a id="y" data-spro-click="document">d</a>', 'append');
    $('#x').trigger('click');
    $('#y').trigger('click');
    assert.equal(avisos.filter((m) => m.includes('acao inexistente')).length, 2);
  });
});

test('nome com caractere proibido e recusado sem avaliar nada', () => {
  comJanela(({ w }) => {
    assert.equal(w.resolverAcaoPro('alert(1)', w), null);
    assert.equal(w.resolverAcaoPro('a["b"]', w), null);
    assert.equal(w.resolverAcaoPro('', w), null);
  });
});

test('excecao dentro da acao vira console.error, nao quebra a pagina', () => {
  comJanela(({ w, $ }) => {
    const erros = [];
    w.console.error = (...a) => erros.push(a.join(' '));
    w.explode = function () { throw new Error('boom'); };
    w.htmlPro('body', '<a id="x" data-spro-click="explode">c</a>', 'append');
    $('#x').trigger('click');
    assert.ok(erros.some((m) => m.includes('erro na acao explode')));
  });
});

// Review Focus 4
test('preventDefault so em ancora sem href, # ou javascript:', () => {
  comJanela(({ w, $ }) => {
    w.nada = function () {};
    w.htmlPro('body', [
      '<a id="sem" data-spro-click="nada">a</a>',
      '<a id="hash" href="#" data-spro-click="nada">b</a>',
      '<a id="real" href="https://exemplo.br/" data-spro-click="nada">c</a>',
      '<button id="bt" data-spro-click="nada">d</button>'
    ].join(''), 'append');
    const prevenido = (id) => { const e = $.Event('click'); $('#' + id).trigger(e); return e.isDefaultPrevented(); };
    assert.equal(prevenido('sem'), true);
    assert.equal(prevenido('hash'), true);
    assert.equal(prevenido('real'), false, 'navegacao legitima nao pode ser bloqueada');
    assert.equal(prevenido('bt'), false);
  });
});

test('data-spro-change responde a change, nao a click', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    w.mudou = function () { n++; };
    w.htmlPro('body', '<input id="x" type="checkbox" data-spro-change="mudou">', 'append');
    $('#x').trigger('click');
    assert.equal(n, 0);
    $('#x').trigger('change');
    assert.equal(n, 1);
  });
});

test('elemento inserido depois do despachante tambem responde (delegacao)', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    w.tardio = function () { n++; };
    w.htmlPro('body', '<div id="caixa"></div>', 'append');
    w.htmlPro('#caixa', '<a id="x" data-spro-click="tardio">c</a>', 'append');
    $('#x').trigger('click');
    assert.equal(n, 1);
  });
});

test('data-spro-tip aciona o tooltip nativo do SEI', () => {
  comJanela(({ w, $ }) => {
    const chamadas = [];
    w.infraTooltipMostrar = function (t) { chamadas.push(['mostrar', t]); };
    w.infraTooltipOcultar = function () { chamadas.push(['ocultar']); };
    w.htmlPro('body', '<a id="x" data-spro-tip="Atualizar">c</a>', 'append');
    $('#x').trigger('mouseover');
    $('#x').trigger('mouseout');
    assert.deepEqual(chamadas, [['mostrar', 'Atualizar'], ['ocultar']]);
  });
});

test('data-spro-tip-el usa a variante que recebe o elemento', () => {
  comJanela(({ w, $ }) => {
    const chamadas = [];
    w._infraTooltipMostrar = function (el, t) { chamadas.push([el.id, t]); };
    w.infraTooltipOcultar = function () {};
    w.htmlPro('body', '<a id="x" data-spro-tip="Tabela" data-spro-tip-el>c</a>', 'append');
    $('#x').trigger('mouseover');
    assert.deepEqual(chamadas, [['x', 'Tabela']]);
  });
});

test('tooltip ausente na pagina nao estoura', () => {
  comJanela(({ w, $ }) => {
    w.htmlPro('body', '<a id="x" data-spro-tip="t">c</a>', 'append');
    assert.doesNotThrow(() => { $('#x').trigger('mouseover'); $('#x').trigger('mouseout'); });
  });
});

test('installActionsPro e idempotente: nao duplica o disparo', () => {
  comJanela(({ w, $ }) => {
    let n = 0;
    w.umaVez = function () { n++; };
    w.installActionsPro(w.document);
    w.installActionsPro(w.document);
    w.htmlPro('body', '<a id="x" data-spro-click="umaVez">c</a>', 'append');
    $('#x').trigger('click');
    assert.equal(n, 1);
  });
});

test('a copia do mundo isolado nao instala despachante', () => {
  comJanela(({ w }) => {
    assert.equal(w.installActionsPro(w.document), false);
    assert.equal(w.document.documentElement.getAttribute('data-spro-actions'), null);
  }, { isolada: true });
});

// Review Focus 5
test('acao dentro de iframe resolve parent.fn no topo', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<iframe id="ifr"></iframe>');
    const ifr = w.document.getElementById('ifr');
    const doc = ifr.contentDocument;
    doc.body.innerHTML = '<div id="caixa"></div>';
    let recebido = null;
    w.acaoDoTopo = function (id) { recebido = id; };
    // O htmlPro do topo insere no documento do iframe e instala o despachante la.
    w.htmlPro($(doc.getElementById('caixa')), `<a id="x" data-spro-click="parent.acaoDoTopo" data-spro-args='[482]'>c</a>`, 'append');
    $(doc.getElementById('x')).trigger('click');
    assert.equal(recebido, 482);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Rodar: `cd tests && node --test dom-seguro/acoes.test.mjs`
Esperado: FALHA — `w.installActionsPro is not a function`

- [ ] **Step 3: Implementar dentro do bloco**

Acrescentar antes de `// === FIM SEI PRO DOM ===`:

```javascript
// Eventos que podem carregar acao em data-spro-<evento>.
var EVENTOS_ACAO_PRO = ['click', 'change', 'input', 'blur', 'focus', 'keyup', 'keydown',
    'keypress', 'submit', 'dblclick', 'contextmenu', 'paste', 'mouseenter', 'mouseleave'];

// Resolve "fn", "parent.fn" ou "top.a.b" andando no objeto. Sem eval, sem new Function.
// Devolve tambem o dono, para que a chamada preserve o 'this' que o onclick tinha:
// "parent.fn(x)" chamava com this = parent, e "fn(x)" com this = window.
function resolverAcaoPro(nome, win) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(String(nome))) return null;
    var partes = String(nome).split('.');
    var dono = win, atual = win;
    for (var i = 0; i < partes.length; i++) {
        if (atual === null || atual === undefined) return null;
        dono = atual;
        try { atual = atual[partes[i]]; } catch (e) { return null; } // iframe de outra origem
    }
    return (typeof atual === 'function') ? { fn: atual, dono: dono } : null;
}

// Sem data-spro-args, o argumento e o proprio elemento: cobre fn(this) e fn() de uma vez,
// porque o JavaScript ignora argumento a mais. Devolve null quando o JSON esta quebrado.
function argumentosAcaoPro(el, ev) {
    var bruto = el.getAttribute('data-spro-args');
    if (bruto === null) return [el];
    var lista;
    try { lista = JSON.parse(bruto); } catch (e) { avisarPro('argumentos invalidos', bruto); return null; }
    if (!(lista instanceof Array)) lista = [lista];
    var saida = [];
    for (var i = 0; i < lista.length; i++) {
        if (lista[i] === '$el') saida.push(el);
        else if (lista[i] === '$ev') saida.push(ev);
        else saida.push(lista[i]);
    }
    return saida;
}

// So ancora sem destino real. Prevenir sempre mataria link de navegacao legitima.
function devePrevenirPro(el) {
    if (!el || el.tagName !== 'A') return false;
    var href = el.getAttribute('href');
    return href === null || href === '' || href === '#' || /^javascript:/i.test(href);
}

function dispararAcaoPro(el, ev, atributo) {
    var nome = el.getAttribute(atributo) || '';
    var win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    var alvo = resolverAcaoPro(nome, win);
    if (!alvo) { avisarPro('acao inexistente: ' + nome, el); return; }
    var args = argumentosAcaoPro(el, ev);
    if (args === null) return;
    if (devePrevenirPro(el)) ev.preventDefault();
    try { alvo.fn.apply(alvo.dono, args); }
    catch (e) { erroPro('erro na acao ' + nome, e); }
}

function mostrarTipPro(el) {
    var texto = el.getAttribute('data-spro-tip') || '';
    var win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    try {
        if (el.hasAttribute('data-spro-tip-el')) {
            if (typeof win._infraTooltipMostrar === 'function') win._infraTooltipMostrar(el, texto);
        } else if (typeof win.infraTooltipMostrar === 'function') {
            win.infraTooltipMostrar(texto);
        }
    } catch (e) {}
}

function ocultarTipPro(el) {
    var win = (el && el.ownerDocument && el.ownerDocument.defaultView) || window;
    try { if (typeof win.infraTooltipOcultar === 'function') win.infraTooltipOcultar(); } catch (e) {}
}

// Instala UM despachante por documento, por delegacao a partir do proprio documento --
// o que cobre tambem o que for inserido depois.
//
// SO O MUNDO DA PAGINA INSTALA. Este arquivo roda em duas copias (content script no mundo
// isolado e $.getScript no mundo da pagina); um despachante em cada mundo dispararia toda
// acao DUAS VEZES. E as funcoes do SEI (infraTooltipMostrar) e dos demais modulos so
// existem no mundo da pagina, entao e la que a resolucao tem de acontecer.
function installActionsPro(doc) {
    doc = doc || document;
    var raiz = doc.documentElement;
    if (!raiz) return false;
    if (raiz.getAttribute('data-spro-actions') === 'sim') return true;
    if (isCopiaIsoladaPro()) return false;
    var $doc = $(doc);
    for (var i = 0; i < EVENTOS_ACAO_PRO.length; i++) {
        (function (evento) {
            var atributo = 'data-spro-' + evento;
            $doc.on(evento + '.sproAcoes', '[' + atributo + ']', function (e) {
                dispararAcaoPro(this, e, atributo);
            });
        })(EVENTOS_ACAO_PRO[i]);
    }
    $doc.on('mouseover.sproAcoes', '[data-spro-tip]', function () { mostrarTipPro(this); });
    $doc.on('mouseout.sproAcoes', '[data-spro-tip]', function () { ocultarTipPro(this); });
    raiz.setAttribute('data-spro-actions', 'sim');
    return true;
}

// O despachante do documento principal sobe junto com o arquivo, para que marcacao
// inserida pela copia isolada tambem encontre quem a atenda.
if (typeof isCopiaIsoladaPro === 'function' && !isCopiaIsoladaPro()) {
    try { installActionsPro(document); } catch (e) {}
}
```

- [ ] **Step 4: Rodar os testes**

Rodar: `cd tests && node --test dom-seguro/acoes.test.mjs`
Esperado: `# pass 16`, `# fail 0`

- [ ] **Step 5: Rodar a suíte inteira**

Rodar: `cd tests && node --test dom-seguro/`
Esperado: `# pass 39`, `# fail 0`

- [ ] **Step 6: Commitar**

```bash
node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: despachante de acoes data-spro-*

Tira a acao de dentro do atributo on*, que o DOMPurify remove, e a poe em
data-*, que ele preserva. Resolve o nome andando no objeto -- sem eval e
sem new Function -- e preserva o 'this' que a chamada inline tinha.

So o mundo da pagina instala o despachante: este arquivo roda em duas
copias e um despachante em cada dispararia toda acao duas vezes.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Auditoria em runtime

**Files:**
- Modify: `dist/js/sei-functions-pro.js` (dentro do bloco, antes da sentinela de fim)
- Create: `tests/dom-seguro/auditoria.test.mjs`

**Interfaces:**
- Consumes: `resolverAcaoPro` (Task 4).
- Produces: `auditActionsPro() -> {total, orfaos, semDespachante, documentos}`. `orfaos` é um
  array de `{documento, atributo, nome, html}`. É a ferramenta que responde "todo gatilho
  aponta para função existente?" sem clicar em nada.

- [ ] **Step 1: Escrever os testes que falham**

`tests/dom-seguro/auditoria.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montar, desmontar } from './harness.mjs';

function comJanela(fn, opcoes) {
  const ctx = montar(opcoes);
  try { return fn(ctx); } finally { desmontar(ctx); }
}

test('auditoria conta as acoes e nao acha orfao quando tudo resolve', () => {
  comJanela(({ w }) => {
    w.aa = function () {}; w.bb = function () {};
    w.htmlPro('body', '<a data-spro-click="aa">1</a><input data-spro-change="bb">', 'append');
    const r = w.auditActionsPro();
    assert.equal(r.total, 2);
    assert.deepEqual(r.orfaos, []);
  });
});

test('auditoria aponta o gatilho orfao com nome e atributo', () => {
  comJanela(({ w }) => {
    w.existe = function () {};
    w.htmlPro('body', '<a data-spro-click="existe">1</a><a data-spro-click="sumiu">2</a>', 'append');
    const r = w.auditActionsPro();
    assert.equal(r.total, 2);
    assert.equal(r.orfaos.length, 1);
    assert.equal(r.orfaos[0].nome, 'sumiu');
    assert.equal(r.orfaos[0].atributo, 'data-spro-click');
  });
});

test('auditoria ignora data-spro-args, -tip e -tip-el', () => {
  comJanela(({ w }) => {
    w.cc = function () {};
    w.htmlPro('body', `<a data-spro-click="cc" data-spro-args='[1]' data-spro-tip="t" data-spro-tip-el>1</a>`, 'append');
    const r = w.auditActionsPro();
    assert.equal(r.total, 1);
    assert.deepEqual(r.orfaos, []);
  });
});

test('auditoria alcanca dentro de iframe', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<iframe id="ifr"></iframe>');
    const doc = w.document.getElementById('ifr').contentDocument;
    doc.body.innerHTML = '<a data-spro-click="soNoIframe">x</a>';
    const r = w.auditActionsPro();
    assert.equal(r.total, 1);
    assert.equal(r.orfaos.length, 1);
    assert.equal(r.orfaos[0].nome, 'soNoIframe');
  });
});

test('auditoria acusa documento com acao mas sem despachante', () => {
  comJanela(({ w, $ }) => {
    $('body').append('<iframe id="ifr"></iframe>');
    const doc = w.document.getElementById('ifr').contentDocument;
    doc.body.innerHTML = '<a data-spro-click="qualquer">x</a>';
    const r = w.auditActionsPro();
    assert.equal(r.semDespachante.length, 1);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Rodar: `cd tests && node --test dom-seguro/auditoria.test.mjs`
Esperado: FALHA — `w.auditActionsPro is not a function`

- [ ] **Step 3: Implementar dentro do bloco**

```javascript
// Varre o DOM e diz se todo data-spro-* aponta para funcao que existe. E o que substitui
// "clicar em tudo para ver se ligou": roda no console da pagina depois de abrir cada tela.
function auditActionsPro() {
    var docs = [], vistos = [];
    (function coletar(doc, nivel) {
        if (!doc || nivel > 4) return;
        for (var v = 0; v < vistos.length; v++) if (vistos[v] === doc) return;
        vistos.push(doc);
        docs.push(doc);
        var ifrs = doc.getElementsByTagName('iframe');
        for (var i = 0; i < ifrs.length; i++) {
            try { coletar(ifrs[i].contentDocument, nivel + 1); } catch (e) {} // outra origem
        }
    })(document, 0);

    var res = { total: 0, orfaos: [], semDespachante: [], documentos: docs.length };
    var ignorados = { 'data-spro-args': 1, 'data-spro-tip': 1, 'data-spro-tip-el': 1 };
    for (var d = 0; d < docs.length; d++) {
        var doc = docs[d];
        var win = doc.defaultView || window;
        var nesteDoc = 0;
        var todos = doc.querySelectorAll('*');
        for (var e = 0; e < todos.length; e++) {
            var el = todos[e], attrs = el.attributes;
            for (var a = 0; a < attrs.length; a++) {
                var nomeAttr = attrs[a].name;
                if (nomeAttr.indexOf('data-spro-') !== 0 || ignorados[nomeAttr]) continue;
                nesteDoc++;
                res.total++;
                if (!resolverAcaoPro(attrs[a].value, win)) {
                    res.orfaos.push({
                        documento: (doc.location && doc.location.href) || '?',
                        atributo: nomeAttr,
                        nome: attrs[a].value,
                        html: el.outerHTML.slice(0, 120)
                    });
                }
            }
        }
        if (nesteDoc > 0 && doc.documentElement.getAttribute('data-spro-actions') !== 'sim') {
            res.semDespachante.push((doc.location && doc.location.href) || '?');
        }
    }
    try {
        console.log('[SEIPro] auditoria: ' + res.total + ' acoes em ' + res.documentos +
            ' documento(s), ' + res.orfaos.length + ' orfa(s), ' +
            res.semDespachante.length + ' documento(s) sem despachante');
        if (res.orfaos.length && console.table) console.table(res.orfaos);
    } catch (x) {}
    return res;
}
```

- [ ] **Step 4: Rodar a suíte inteira**

Rodar: `cd tests && node --test dom-seguro/`
Esperado: `# pass 44`, `# fail 0`

- [ ] **Step 5: Commitar**

```bash
node tools/escape-nonascii.mjs --check dist/js/sei-functions-pro.js
git add dist/js/sei-functions-pro.js
git commit -m "DOM seguro: auditActionsPro, a auditoria de gatilhos

Responde 'todo data-spro-* aponta para funcao que existe?' sem clicar em
nada, e alcanca os iframes da arvore e do visualizador. E o que pega o
gatilho mudo, que passaria por qualquer verificador estatico.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: O verificador de empacotamento

**Files:**
- Create: `tools/check-dom-injection.mjs`

**Interfaces:**
- Consumes: nada do runtime; lê os arquivos de `dist/js/`.
- Produces: `node tools/check-dom-injection.mjs` sai com código 1 se houver ERRO. A lista
  `ARQUIVOS_CONVERTIDOS` no topo do arquivo cresce a cada camada — é o registro de quais
  arquivos já estão sob a regra.

- [ ] **Step 1: Escrever a ferramenta**

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
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const RE_HANDLER = /\bon(click|change|blur|focus|input|keyup|keydown|keypress|submit|mouseover|mouseout|mouseenter|mouseleave|dblclick|contextmenu|paste|select|scroll|load|error)\s*=\s*(\\?["'])/g;
// .html(qualquer coisa) -- getter .html() continua permitido.
const RE_HTML = /\.html\(\s*(?!\))/g;
const RE_INNER = /\.innerHTML\s*=|insertAdjacentHTML\s*\(/g;
// insercao com literal de marcacao
const RE_INSERE_LITERAL = /\.(append|prepend|before|after|replaceWith)\(\s*(['"`])\s*</g;
// insercao com variavel: nao da para saber se e HTML; vira aviso, nao erro
const RE_INSERE_VAR = /\.(append|prepend|before|after|replaceWith)\(\s*([A-Za-z_$][\w$]*)\s*\)/g;

function linhaDe(texto, indice) { return texto.slice(0, indice).split('\n').length; }

function varrer(caminho) {
  const texto = readFileSync(resolve(RAIZ, caminho), 'utf8');
  const erros = [], avisos = [];
  const achar = (re, lista, rotulo) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(texto))) lista.push(`${caminho}:${linhaDe(texto, m.index)}  ${rotulo}: ${m[0].trim()}`);
  };
  achar(RE_HANDLER, erros, 'acao em atributo on*');
  achar(RE_HTML, erros, 'use htmlPro no lugar de .html(...)');
  achar(RE_INNER, erros, 'use htmlPro no lugar de innerHTML/insertAdjacentHTML');
  achar(RE_INSERE_LITERAL, erros, 'use htmlPro para inserir marcacao');
  achar(RE_INSERE_VAR, avisos, 'conferir: se a variavel for HTML, use htmlPro');
  return { erros, avisos };
}

let totalErros = 0, totalAvisos = 0;
for (const caminho of ARQUIVOS_CONVERTIDOS) {
  const { erros, avisos } = varrer(caminho);
  totalErros += erros.length;
  totalAvisos += avisos.length;
  for (const e of erros) console.error('ERRO   ' + e);
  for (const a of avisos) console.warn('AVISO  ' + a);
}

if (process.argv.includes('--todos')) {
  console.log(`\n(${ARQUIVOS_CONVERTIDOS.length} arquivo(s) sob a regra; os demais ainda nao foram convertidos)`);
}
console.log(`\ncheck-dom-injection: ${totalErros} erro(s), ${totalAvisos} aviso(s)`);
process.exit(totalErros > 0 ? 1 : 0);
```

- [ ] **Step 2: Confirmar que ela reprova o estado atual**

Os cinco arquivos ainda não foram convertidos, então o verificador tem de acusar.

Rodar: `node tools/check-dom-injection.mjs`
Esperado: várias linhas `ERRO`, e saída `ERRO ... 0 erro(s)` **não** deve aparecer — o código de
saída tem de ser 1. Conferir com `echo $?`.

- [ ] **Step 3: Não commitar (tools/ é ignorado)**

```bash
git status --short
```
Esperado: nenhuma linha citando `tools/`.

---

## Task 7: Camada 1 — `sei-legis.js`

**Files:**
- Modify: `dist/js/sei-legis.js` (56 inserções, 0 handlers inline)

**Interfaces:**
- Consumes: `htmlPro` (Task 2). `sei-legis.js` entra pelo `$.getScript` de `init.js`, no mundo da
  página, depois de `sei-functions-pro.js` — o helper já existe quando ele roda.
- Produces: nada para tarefas seguintes.

Este arquivo é a camada 1 porque **a Mozilla o citou nominalmente** (`js\sei-legis.js line 652`) e
porque não tem nenhum handler inline: exercita só o `htmlPro`, isolando a variável.

- [ ] **Step 1: Diagnóstico prévio**

```bash
node tools/diff-sanitize.mjs dist/js/sei-legis.js
node tools/inventario-acoes.mjs dist/js/sei-legis.js
```

Anotar as tags e atributos que a sanitização removeria. Esperado: inventário de ações vazio.
Se `diff-sanitize` apontar tag perdida, tratar aquele ponto por DOM API antes de seguir.

- [ ] **Step 2: Separar texto de marcação**

Percorrer as 56 chamadas com `grep -n "\.html(" dist/js/sei-legis.js`. Para cada uma, decidir:

- **conteúdo é texto puro** → trocar por `.text(...)`. É o caso do ponto citado pela Mozilla,
  `dist/js/sei-legis.js:652`:

  ```javascript
  // ANTES
  this_.html(textRef).removeClass('error');
  // DEPOIS  -- textRef vem de getNameRef(), e texto extraido do documento
  this_.text(textRef).removeClass('error');
  ```

  Sanitizar texto e inseri-lo como HTML continuaria sendo injeção de HTML; `.text()` é a
  correção certa, e é mais barata.

- **conteúdo é marcação** → trocar por `htmlPro`, e converter a concatenação em template literal:

  ```javascript
  // ANTES
  box.html('<div class="legisBox">'+
           '   <span class="t">'+titulo+'</span>'+
           '</div>');
  // DEPOIS
  htmlPro(box, `<div class="legisBox">
                   <span class="t">${titulo}</span>
                </div>`);
  ```

- [ ] **Step 3: Conferir que o verificador aprova**

Rodar: `node tools/check-dom-injection.mjs`
Esperado: nenhuma linha `ERRO` citando `sei-legis.js`. Avisos de `.append(variavel)` são para
conferência manual: abrir cada linha citada e confirmar que a variável não é HTML.

- [ ] **Step 4: Conferir a regra dos acentos**

Rodar: `node tools/escape-nonascii.mjs --check dist/js/sei-legis.js`
Esperado: `OK 0`. O arquivo já tem 2 caracteres não-ASCII hoje — se aparecerem, rodar
`node tools/escape-nonascii.mjs dist/js/sei-legis.js` e conferir o diff.

- [ ] **Step 5: Validar ao vivo**

Pedir ao autor que faça login no **SEI SP de Treinamento** (4.1.5). Então:

1. Abrir um processo e criar ou editar um documento que use a Legística.
2. Acionar a numeração de dispositivos e as referências cruzadas.
3. No console da página, rodar `auditActionsPro()`.

Esperado: as referências continuam sendo resolvidas e renumeradas na tela;
`auditActionsPro()` devolve `orfaos: []` e `semDespachante: []`.

- [ ] **Step 6: Commitar**

```bash
git add dist/js/sei-legis.js
git commit -m "DOM seguro: sei-legis.js pelo portao de insercao

Primeiro dos dois arquivos que a AMO citou nominalmente. A linha 652 era
.html(textRef) com texto extraido do documento -- virou .text(), que e a
correcao certa: sanitizar texto e inseri-lo como HTML continuaria sendo
injecao de HTML. As demais insercoes passam por htmlPro, com o template
em crase no lugar da concatenacao.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Camada 2a — `init.js` (mundo isolado)

**Files:**
- Modify: `dist/js/init.js` (2 inserções, 4 handlers inline nas linhas 67 e 68)

**Interfaces:**
- Consumes: nada do bloco. **`init.js` roda no mundo ISOLADO**, onde o despachante não é
  instalado — por isso este arquivo **não usa `data-spro-*`**.
- Produces: nada.

Este arquivo é o contraexemplo útil: mostra o caminho para código do mundo isolado.

- [ ] **Step 1: Entender por que aqui é diferente**

`init.js` é content script (mundo isolado). O despachante vive só no mundo da página, e
`infraTooltipMostrar` também. Marcação criada aqui com `data-spro-tip` seria atendida pelo
despachante da página — o que funciona —, mas os dois links das linhas 67-68 pertencem à barra
que o próprio `init.js` monta e controla. O caminho honesto e sem dependência de ordem de
carregamento é **ligar por clausura**.

- [ ] **Step 2: Converter as linhas 67-68**

As duas âncoras hoje carregam `onmouseover="return infraTooltipMostrar('…')"` e
`onmouseout="return infraTooltipOcultar();"`. Retirar os quatro atributos da marcação, passar a
inserção por `htmlPro` e ligar o tooltip logo depois:

```javascript
// Tooltip do SEI vive no mundo da pagina; este arquivo roda no isolado. Em vez de
// data-spro-tip (que depende do despachante da pagina), liga-se por clausura, que e
// o caminho sem dependencia de ordem de carregamento.
function ligarTooltipIsoladoPro(el, texto) {
    if (!el) return;
    el.addEventListener('mouseover', function () {
        try { if (typeof infraTooltipMostrar === 'function') infraTooltipMostrar(texto); } catch (e) {}
    });
    el.addEventListener('mouseout', function () {
        try { if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar(); } catch (e) {}
    });
}
```

E, no ponto onde a barra é montada, após a inserção:

```javascript
ligarTooltipIsoladoPro(document.getElementById('authorizeButtonPro'), 'Conectar Base de Dados (SeiPro)');
ligarTooltipIsoladoPro(document.getElementById('signoutButtonPro'), 'Conectado! Clique para desconectar Base de Dados (SeiPro)');
```

Converter também a concatenação do bloco para template literal e a inserção para `htmlPro`.

- [ ] **Step 3: Verificador e acentos**

```bash
node tools/check-dom-injection.mjs
node tools/escape-nonascii.mjs --check dist/js/init.js
```
Esperado: nenhum `ERRO` citando `init.js`; `OK 0` nos acentos.

- [ ] **Step 4: Validar ao vivo**

No SEI SP de Treinamento, abrir a tela de processos. Passar o mouse sobre o ícone de conectar a
base de dados do SEI Pro na barra superior.
Esperado: o tooltip do SEI aparece com o texto certo e some ao tirar o mouse; o ícone continua
alternando entre conectado e desconectado ao clicar.

- [ ] **Step 5: Commitar**

```bash
git add dist/js/init.js
git commit -m "DOM seguro: init.js, o caso do mundo isolado

init.js e content script: o despachante data-spro-* nao existe no mundo
isolado, e infraTooltipMostrar tampouco. Os dois links da barra ligam o
tooltip por clausura, que nao depende de ordem de carregamento. Fica como
referencia para os demais init*.js.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Camada 2b — `sei-pro-proc-lote.js` e `sei-pro-docs-lote.js`

**Files:**
- Modify: `dist/js/sei-pro-proc-lote.js` (11 inserções, 2 handlers)
- Modify: `dist/js/sei-pro-docs-lote.js` (12 inserções, 8 handlers)

**Interfaces:**
- Consumes: `htmlPro` (Task 2), despachante (Task 4).
- Produces: nada.

- [ ] **Step 1: Diagnóstico prévio dos dois**

```bash
node tools/diff-sanitize.mjs dist/js/sei-pro-proc-lote.js
node tools/inventario-acoes.mjs dist/js/sei-pro-proc-lote.js
node tools/diff-sanitize.mjs dist/js/sei-pro-docs-lote.js
node tools/inventario-acoes.mjs dist/js/sei-pro-docs-lote.js
```

Guardar a saída de `inventario-acoes`: é o inventário esperado que a auditoria tem de reproduzir.

- [ ] **Step 2: Converter, aplicando a tabela de tradução**

Para cada handler, a tradução do spec (seção 6):

```javascript
// ANTES
'<a class="newLink" onclick="processarLotePro(this)"'+
'   onmouseover="return infraTooltipMostrar(\'Processar\')"'+
'   onmouseout="return infraTooltipOcultar();">Processar</a>'

// DEPOIS
`<a class="newLink"
    data-spro-click="processarLotePro"
    data-spro-tip="Processar">Processar</a>`
```

```javascript
// ANTES -- chamada com argumento
'<a onclick="removerLinhaPro('+i+', \'doc\')">x</a>'
// DEPOIS
`<a data-spro-click="removerLinhaPro" data-spro-args='[${i},"doc"]'>x</a>`
```

Regras ao escrever o template:

- Aspas simples no atributo `data-spro-args` (o JSON usa aspas duplas por dentro).
- Texto com acento continua escrito como `\uXXXX` — rodar o `escape-nonascii.mjs` ao final.
- Toda inserção passa a `htmlPro(alvo, tpl)` ou `htmlPro(alvo, tpl, 'append')`.

- [ ] **Step 3: Verificador e acentos**

```bash
node tools/check-dom-injection.mjs
node tools/escape-nonascii.mjs --check dist/js/sei-pro-proc-lote.js dist/js/sei-pro-docs-lote.js
```
Esperado: nenhum `ERRO` para os dois arquivos.

- [ ] **Step 4: Validar ao vivo — Processos em Lote**

No SEI SP de Treinamento, abrir **Processos em Lote**.
1. Montar um lote com dois processos.
2. Conferir que os tooltips dos botões aparecem.
3. Remover uma linha do lote (é o handler com argumento).
4. Rodar `auditActionsPro()` no console.

Esperado: a linha é removida, o lote processa, `orfaos: []`.

- [ ] **Step 5: Validar ao vivo — Documentos em Lote**

No mesmo ambiente, abrir **Documentos em Lote**, montar um lote pequeno e gerar.
Esperado: a tabela final aparece, os botões respondem, `auditActionsPro()` devolve `orfaos: []`.

Obs.: há um defeito conhecido e **anterior** a esta mudança — a tabela final desloca número e
nome no ambiente de treinamento. Não é regressão; não tratar aqui.

- [ ] **Step 6: Commitar**

```bash
git add dist/js/sei-pro-proc-lote.js dist/js/sei-pro-docs-lote.js
git commit -m "DOM seguro: Processos em Lote e Documentos em Lote

Dez handlers e 23 insercoes pelo portao. Primeiro uso de data-spro-args
em producao: as chamadas com argumento passam a levar o argumento em JSON
no atributo, resolvido sem eval.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Camada 2c — `sei-pro-prescricoes.js`

**Files:**
- Modify: `dist/js/sei-pro-prescricoes.js` (3 inserções, 12 handlers)

**Interfaces:**
- Consumes: `htmlPro` (Task 2), despachante (Task 4).
- Produces: nada.

- [ ] **Step 1: Diagnóstico prévio**

```bash
node tools/diff-sanitize.mjs dist/js/sei-pro-prescricoes.js
node tools/inventario-acoes.mjs dist/js/sei-pro-prescricoes.js
```

- [ ] **Step 2: Converter**

Mesma tabela de tradução da Task 9. Acrescentar `'dist/js/sei-pro-prescricoes.js'` já está na
lista `ARQUIVOS_CONVERTIDOS` do verificador (foi posta lá na Task 6).

- [ ] **Step 3: Verificador e acentos**

```bash
node tools/check-dom-injection.mjs
node tools/escape-nonascii.mjs --check dist/js/sei-pro-prescricoes.js
```
Esperado: `0 erro(s)` no verificador — **todos os cinco arquivos da lista já convertidos**.

- [ ] **Step 4: Validar ao vivo**

No SEI SP de Treinamento, abrir a ferramenta de prescrições sobre um processo.
1. Conferir que a caixa monta.
2. Acionar cada botão da caixa.
3. Rodar `auditActionsPro()`.

Esperado: `orfaos: []`, e a lista de ações resolvidas bate com o inventário do Step 1.

- [ ] **Step 5: Commitar**

```bash
git add dist/js/sei-pro-prescricoes.js
git commit -m "DOM seguro: prescricoes pelo portao de insercao

Fecha a camada 2. Os cinco arquivos da fundacao passam no verificador com
zero erro.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Fechamento — regressão ampla e versão 2.1.2

**Files:**
- Modify: `dist/manifest.json` e os outros 11 manifests (versão)
- Modify: `pages/HISTORICO.md`

**Interfaces:**
- Consumes: tudo das tarefas anteriores.
- Produces: a versão 2.1.2 pronta para empacotar.

- [ ] **Step 1: Suíte de testes completa**

Rodar: `cd tests && node --test dom-seguro/`
Esperado: `# fail 0`

- [ ] **Step 2: Verificador**

Rodar: `node tools/check-dom-injection.mjs --todos`
Esperado: `0 erro(s)`. Avisos de `.append(variavel)` conferidos um a um.

- [ ] **Step 3: Regressão ampla no SEI 4.1.5 e no SEI 5**

O bloco novo entrou em `sei-functions-pro.js`, que roda em **toda** tela do SEI. Mesmo sem
converter esse arquivo ainda, é preciso confirmar que nada regrediu.

No SEI SP de Treinamento (4.1.5) e no SEI MJ de homologação (`hmlsei.mj.gov.br` — **não**
`sei.mj.gov.br`, que é produção), percorrer:

1. Tela de processos (controle de processos): ícones da barra, favoritos, marcadores.
2. Árvore do processo: numeração, menu rápido, duas linhas.
3. Visualização de documento.
4. Editor: abrir um documento e conferir que a barra do SEI Pro monta.
5. Assinatura de documento — é o caminho que já quebrou antes por mudança de carregamento.
6. Em cada tela, `auditActionsPro()` no console.

Esperado: nenhum comportamento diferente do de antes; console sem exceção nova;
`semDespachante: []` em todas as telas.

- [ ] **Step 4: Confirmar que a ação não dispara duas vezes**

Este é o risco central do desenho. Na tela de processos, no console da **página**:

```javascript
document.documentElement.getAttribute('data-spro-actions')   // 'sim'
jQuery._data(document, 'events').click.filter(e => e.namespace === 'sproAcoes').length
```

Esperado: `'sim'`, e exatamente **1** handler `sproAcoes` de click. Mais de um significa que a
cópia isolada instalou junto — e aí toda ação dispararia em duplicata.

- [ ] **Step 5: Subir a versão nos 12 manifests**

Trocar **so o valor da versao**. Reserializar o JSON inteiro reindentaria os 12 arquivos e
produziria um diff ilegivel, escondendo a mudanca de verdade.

```bash
cd "/Users/phs/Documents/Git/Lab2Code/SEI Pro/sei-pro"
for f in dist/manifest*.json; do
  perl -0pi -e 's/("version"\s*:\s*")[^"]*(")/${1}2.1.2${2}/' "$f"
done
grep -o '"version": "[^"]*"' dist/manifest*.json
git diff --stat dist/manifest.json
```
Esperado: `2.1.2` nos 12 arquivos, e `git diff --stat` mostrando **1 linha alterada** em
`dist/manifest.json` -- se mostrar mais, a formatacao foi mexida e o comando esta errado.

- [ ] **Step 6: Atualizar `pages/HISTORICO.md`**

Acrescentar a entrada da 2.1.2 no formato que o site já consome (o build do GitHub Pages
parseia esse arquivo — o formato das linhas é contrato). Texto:

> **2.1.2** — Preparação para a loja do Firefox: a extensão passou a construir sua interface por
> um caminho único, que higieniza todo o HTML antes de inserir na página. Sem mudança visível de
> funcionamento.

- [ ] **Step 7: Commitar**

```bash
git add dist/manifest.json pages/HISTORICO.md
git add dist/manifest_antaq.json dist/manifest_antaq_v2.json dist/manifest_antt.json \
        dist/manifest_antt_v2.json dist/manifest_cfq.json dist/manifest_cfq_v2.json \
        dist/manifest_conab.json dist/manifest_conab_v2.json dist/manifest_seipro.json \
        dist/manifest_seipro_v2.json dist/manifest_v2.json
git commit -m "Versao 2.1.2: fundacao do DOM seguro

Fecha a camada 0 (portao de insercao, despachante de acoes, auditoria e
verificador) e as camadas 1 e 2 (sei-legis, init, os dois modulos de
lote e prescricoes).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Obs.: os manifests de whitelabel são ignorados pelo git (`dist/manifest_*.json` no
`.gitignore`); o `git add` acima só terá efeito sobre `dist/manifest.json`. Conferir com
`git status --short` antes de commitar e ajustar a lista para o que estiver realmente rastreado.

- [ ] **Step 8: Registrar o ponto de parada**

Escrever a memória do projeto com: o que foi entregue, o número de handlers restantes por
arquivo, e que os planos 2, 3 e 4 ainda não foram escritos.
