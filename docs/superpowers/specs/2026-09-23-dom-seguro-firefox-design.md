# DOM seguro e template literals — especificação de desenho

Data: 23/09/2026 · Status: desenho aprovado em conversa (seções 1 a 8), incluindo as duas
decisões destacadas ao final da conversa.

## 1. Objetivo

Destravar a publicação do SEI Pro na loja do Firefox (AMO), rejeitado em 17/06/2025 na versão
1.6, e, no mesmo movimento, melhorar a base de código: substituir a concatenação de strings por
template literals e tirar a lógica de ação de dentro de atributos `on*`.

A rejeição tem três itens:

| # | Item da Mozilla | Tratamento |
|---|---|---|
| 1 | *Third party library information missing* (`js/lib/*`) | Frente 2 (seção 8) |
| 2 | *Unsanitized DOM injection* (`sei-legis.js:652`, `sei-pro-arvore.js:1647` "etc.") | Frente 1 (seções 3 a 7) |
| 3 | *Includes unrelated changes* | Não é código. Vale só para reenvio dentro da mesma revisão; a 1.6 é de junho/2025 e hoje estamos na 2.1, então o envio é revisão nova. Resolve-se com nota ao revisor. |

## 2. O problema, medido

Medições feitas sobre `dist/js/` em 23/09/2026 (contagem por varredura dos literais de HTML).

**1.861 handlers inline**, em 11 arquivos:

| arquivo | handlers | inserções (`.html()`/`innerHTML`) |
|---|---|---|
| `sei-pro-atividades.js` | 1.175 | 144 |
| `sei-functions-pro.js` | 217 | 107 |
| `sei-pro-arvore.js` | 126 | 14 |
| `sei-pro.js` | 103 | 26 |
| `sei-pro-favoritos.js` | 98 | 14 |
| `sei-pro-projetos.js` | 85 | 9 |
| `sei-pro-all.js` | 31 | 1 |
| `sei-pro-prescricoes.js` | 12 | 3 |
| `sei-pro-docs-lote.js` | 8 | 12 |
| `init.js` | 4 | 2 |
| `sei-pro-proc-lote.js` | 2 | 11 |
| `sei-legis.js` | 0 | 56 |

Os 1.861 se reduzem a cinco formatos:

| formato | quantidade |
|---|---|
| `onmouseover="return infraTooltipMostrar('x')"` + `onmouseout="return infraTooltipOcultar()"` | 830 |
| `fn(this)` | 758 |
| `fn(arg, …)` | 189 |
| `fn()` | 60 |
| expressão solta, `javascript:`, nome montado por ternário | 24 |

Por evento: `onclick` 681, `onmouseout` 419, `onmouseover` 418, `onchange` 265,
`onmouseenter` 25, `oninput` 18, `onkeypress` 16, `onblur` 14, `onkeyup` 2, `ondblclick` 2,
`onpaste` 1.

### 2.1 O que o DOMPurify faz com a marcação real do SEI

Teste executado com o próprio `dist/js/lib/purify.min.js` (DOMPurify 3.2.5) e a config atual de
`sanitizeHTML`. **Este é o achado que define o desenho:**

| entrada | saída |
|---|---|
| `<tr>`/`<td>`/`<tbody>` soltos | **destruídos** — sobra só o texto |
| `<iframe>` | **removido inteiro** |
| `<style>` | **removido inteiro** (sobrevive apenas com `FORCE_BODY: true`) |
| `<script>` | removido |
| `accesskey` (33 usos) | removido |
| `href="javascript:…"` (2 usos) | removido |
| `style` inline, `data-*`, `class`, `<i class="fas">`, SVG, `select`/`option`, `canvas`, `form`, `<li>` | **preservados** |

Conclusão: chamar `sanitizeHTML` direto nos 418 pontos de inserção quebraria a extensão. A
sanitização precisa acontecer **com contexto de parsing**, dentro de um helper.

### 2.2 As três armadilhas de execução

1. **Dois mundos.** Só `init*.js` e `sei-functions-pro.js` são content scripts (mundo isolado);
   todo o resto entra por `$.getScript` no mundo da **página**. E `sei-functions-pro.js` roda nos
   **dois** — um listener delegado global instalado nos dois mundos dispara cada ação **duas
   vezes**. O código já trata esse problema para a visualização, com `isCopiaIsoladaPro()` e a
   marca `data-spro-visualizacao` no `<html>` (visível aos dois mundos); o desenho reusa esse
   idioma.
2. **Cross-frame.** Handlers como `parent.actionsAtividade(482)` vivem em `ifrArvore`/
   `ifrVisualizacao` e chamam função do topo. O despachante precisa ser **por documento** e
   resolver caminho pontuado.
3. **`infraTooltipMostrar` é função nativa do SEI**, existe só no mundo da página — reforça (1).

## 3. Decisões tomadas

| Tema | Decisão |
|---|---|
| Alvo | **Código único** para Chrome e Firefox. Sem variante de build. |
| Entrega | **Release por camada**: cada arquivo convertido é validado ao vivo e vai para produção antes do próximo. |
| Estilo | Template literal (crase + `${}`) + sanitização na inserção por helper único. Sem tagged template com escape automático, sem reescrita por DOM API em massa. |
| Config do DOMPurify | **Restrita**: sem `ADD_TAGS`. Os ~11 pontos que injetam `<iframe>`, `<style>` ou `<script>` são convertidos para construção por DOM API. Mantém o argumento limpo perante a Mozilla. |
| Camada 9 (atividades) | Subdividida em 5 releases menores (quadro, cronograma, painel, contatos, configurações), não um só. |
| Bibliotecas | Inventariar tudo; trocar só o indefensável. Forks com release própria ficam, apenas declarados. |
| Critério de pronto | Verificador estático + auditoria em runtime + clique real nos fluxos. |

## 4. `htmlPro()` — o portão único de inserção

Definido em `dist/js/sei-functions-pro.js`, ao lado de `sanitizeHTML`.

### 4.1 Assinatura

```js
htmlPro(alvo, html)            // substitui o conteúdo  (equivale a .html())
htmlPro(alvo, html, modo)      // modo: 'html' | 'append' | 'prepend' | 'before' | 'after' | 'replace'
```

- `alvo`: seletor, elemento DOM ou objeto jQuery.
- `html`: string, normalmente um template literal.
- **Retorna o jQuery do alvo**, como fazem `.html()`, `.append()` e `.after()` — é drop-in, o
  encadeamento existente continua valendo.

Duas fronteiras, para não haver dúvida na conversão:

- **`htmlPro` é só para string.** Inserção de objeto jQuery ou de nó já construído
  (`$alvo.append($outro)`) não passa pelo helper e fica como está — não há HTML sendo parseado
  ali, e o `check-dom-injection` não a acusa.
- **Texto é `.text()`, não `htmlPro`.** Sempre que o conteúdo inserido for texto puro — o caso de
  `sei-legis.js:652`, `this_.html(textRef)` — a conversão correta é `.text()`, não sanitizar uma
  string de HTML. Sanitizar texto e inseri-lo como HTML continua sendo injeção de HTML.

### 4.2 O que ele faz, em ordem

1. **Escolhe o contexto de parsing** farejando a primeira tag do fragmento, com o alvo como
   desempate:

   | primeira tag do fragmento | embrulho usado |
   |---|---|
   | `tr`, `tbody`, `thead`, `tfoot`, `colgroup` | `<table>` |
   | `td`, `th` | `<table><tbody><tr>` |
   | `option`, `optgroup` | `<select>` |
   | `li` | `<ul>` |
   | `dt`, `dd` | `<dl>` |
   | qualquer outra | nenhum |

   Sanitiza embrulhado e desembrulha depois. É isso que impede a tabela de virar texto.

2. **Sanitiza** com a config única `SEIPRO_PURIFY_CONFIG`:

   ```js
   { ADD_ATTR: ['target', 'accesskey'],
     ALLOWED_URI_REGEXP: <a mesma já usada por sanitizeHTML> }
   ```

   Uma config só, num lugar só — é o que se mostra ao revisor.

3. **Insere** conforme o modo.

4. **Instala o despachante** no `ownerDocument` do alvo (seção 5), se ainda não houver.

### 4.3 Degradação

Se o DOMPurify não tiver carregado, `htmlPro` **não insere HTML cru**: registra aviso no console
e insere o fragmento sem sanitizar apenas quando a string não contém `<` — caso contrário aborta.
Silenciosamente cair para HTML cru derrotaria o propósito.

### 4.4 Os pontos que saem do helper (decisão 1)

Convertidos para construção por DOM API, para manter a config restrita:

| ponto | conteúdo |
|---|---|
| `sei-functions-pro.js:821` | `<style data-style="seipro-fonticon">` |
| `sei-functions-pro.js:2144` | `<iframe>` do diálogo de documentos em lote |
| `sei-functions-pro.js:8628` | `<script data-config="config-seipro-checker">` |
| `sei-functions-pro.js:10759` | `<style data-style="seipro-resizeimg">` |
| `sei-functions-pro.js:11929`, `:12047` | `<iframe>` do visualizador |
| `sei-functions-pro.js:13203` | `<style data-style="seipro-colorpage">` |
| `sei-functions-pro.js:13436` | `<style data-style="seipro-styleicon">` |
| `sei-functions-pro.js:13868` | `<style data-style="seipro-sizeiframe">` |
| `sei-pro-atividades.js:2849` | `<iframe id="chartRelatorioPanelBI">` |
| `sei-pro-atividades.js:26661` | `<iframe id="googleCalendar">` |

Para os `<style>`, um helper `estiloPro(doc, chave, css)` que cria o elemento, define
`textContent` e o insere — idempotente pela chave, substituindo o bloco anterior.

## 5. O despachante de ações

### 5.1 Contrato dos atributos

```html
<a data-spro-click="updateAtividade_" data-spro-tip="Atualizar Informações">
<a data-spro-click="parent.actionsAtividade" data-spro-args="[482]">
<a data-spro-click="actFavoritePro" data-spro-args='["$el","add"]'>
<input data-spro-change="configDatesSwitchChangeHome">
```

- Um atributo por evento: `data-spro-click`, `-change`, `-input`, `-blur`, `-focus`, `-keyup`,
  `-keydown`, `-keypress`, `-submit`, `-dblclick`, `-contextmenu`, `-paste`, `-mouseenter`,
  `-mouseleave`.
- **`data-spro-args`** é JSON. Dois marcadores: `"$el"` vira o elemento, `"$ev"` vira o evento.
  **Sem o atributo, o argumento padrão é `[elemento]`** — por isso `fn(this)` (758 casos) e
  `fn()` (60 casos) usam a mesma forma, sem atributo extra: o JavaScript ignora argumento a mais.
  JSON inválido: aviso no console, ação não roda.
- **`data-spro-tip="texto"`** cobre os 830 tooltips. `mouseover` chama `infraTooltipMostrar(texto)`
  e `mouseout` chama `infraTooltipOcultar()`. A variante `_infraTooltipMostrar(this, 'texto')`
  (13 usos) é marcada com `data-spro-tip-el` presente.

### 5.2 Resolução do nome — sem `eval`

Regex `^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$`, resolvida andando no objeto a partir do `window`
do documento do elemento (`parent.fn`, `top.fn.g`). Nome que não resolve vira
`console.warn('[SEIPro] ação inexistente: <nome>')` — nunca exceção, nunca `eval`, nunca
`new Function`.

### 5.3 Instalação — `installActionsPro(doc)`

- **Idempotente por documento**: marca `doc.documentElement` com `data-spro-actions`.
- **Só o mundo da página instala.** A cópia isolada (`isCopiaIsoladaPro() === true`) não instala.
  Se, por qualquer razão, a cópia da página não tiver chegado a instalar, a isolada assume — o
  mesmo padrão de `isCopiaResponsavelVisualizacaoPro()`.
- Delegação a partir de `doc` (jQuery `.on(evento, '[data-spro-*]', …)`), o que cobre linhas
  inseridas depois.
- **`preventDefault`** só quando o elemento é `<a>` sem `href`, ou com `href` igual a `#` ou
  `javascript:…`. Em botão de formulário e link real, o comportamento nativo é preservado.

## 6. A tabela de tradução

| hoje | vira |
|---|---|
| `onmouseover="return infraTooltipMostrar('x')" onmouseout="return infraTooltipOcultar()"` | `data-spro-tip="x"` |
| `onmouseover="return _infraTooltipMostrar(this,'x')" onmouseout="…"` | `data-spro-tip="x" data-spro-tip-el` |
| `onclick="fn(this)"` / `onclick="fn()"` | `data-spro-click="fn"` |
| `onclick="fn(1,'a')"` | `data-spro-click="fn" data-spro-args="[1,&quot;a&quot;]"` |
| `onchange="fn(this)"` | `data-spro-change="fn"` |
| `onclick="$(this).closest('div').remove()"` | função nomeada nova + `data-spro-click` |
| `onclick="'+(cond?'a()':'b(this)')+'"` | `data-spro-click="${cond ? 'a' : 'b'}"` |
| `href="javascript:void(0)"` | `href` removido + `data-spro-click` |
| `oninput="javascript: if (…) { … }"` | função nomeada nova + `data-spro-input` |

Junto, em cada bloco tocado: concatenação `'…'+var+'…'` vira template literal com `${var}`.

## 7. Rede de segurança e ordem de execução

### 7.1 As quatro ferramentas

1. **`tools/diff-sanitize.mjs`** — roda **antes** de converter cada arquivo. Extrai todo literal
   de HTML do arquivo, passa pela `SEIPRO_PURIFY_CONFIG` e **lista toda tag e todo atributo
   perdidos**. Transforma "espero que não quebre" numa lista fechada, por arquivo, antes de
   tocar em qualquer linha. É o instrumento que dá confiança à camada 9.
2. **`tools/check-dom-injection.mjs`** — roda no empacotamento. Reprova se, em arquivo já
   convertido, sobrar `on*=` dentro de string, ou `.html(`/`innerHTML`/`insertAdjacentHTML` fora
   do helper. A lista de arquivos convertidos cresce a cada camada.
3. **`auditActionsPro()`** — em runtime, varre o documento e os iframes e lista todo
   `data-spro-*` cujo destino não resolve. **Pega gatilho órfão sem clicar em nada.**
4. **Clique real** nos fluxos do arquivo, no SEI ao vivo.

### 7.2 O inventário esperado

Antes de converter cada arquivo, roda-se uma varredura que extrai a lista de funções chamadas
pelos `on*` daquele arquivo. Depois da conversão, `auditActionsPro()` tem de devolver a **mesma
lista**, toda resolvível. A comparação é objetiva, não impressão.

### 7.3 Ambientes de teste

- **SEI 4.1.5**: SEI SP de Treinamento.
- **SEI 5**: SEI MJ de homologação (`hmlsei.mj.gov.br` — `sei.mj.gov.br` é **produção**).
- **Gestor de atividades**: backend local no Docker (`seipro-php` em `:8080`/`:8443`,
  `seipro-db` em `:3307`), endpoint gravado nas configurações da extensão, usuário admin
  `pedro.soares`.

O login é manual: eu peço, o autor loga.

### 7.4 As camadas

| # | arquivo | gatilhos | por que nessa ordem |
|---|---|---|---|
| 0 | infra + ferramentas | — | `htmlPro`, `estiloPro`, despachante, as 4 ferramentas |
| 1 | `sei-legis.js` | 0 | **citado na rejeição**; só inserção — vários `.html()` viram `.text()` |
| 2 | `init.js`, `sei-pro-proc-lote.js`, `sei-pro-docs-lote.js`, `sei-pro-prescricoes.js` | 26 | volume baixo, valida o padrão de ponta a ponta |
| 3 | `sei-pro-all.js` | 31 | |
| 4 | `sei-pro-projetos.js` | 85 | |
| 5 | `sei-pro-favoritos.js` | 98 | |
| 6 | `sei-pro.js` | 103 | |
| 7 | `sei-pro-arvore.js` | 126 | **citado na rejeição**; cross-frame |
| 8 | `sei-functions-pro.js` | 217 | roda nos dois mundos — o mais delicado |
| 9 | `sei-pro-atividades.js` | 1.175 | ANTT; em 5 sub-entregas: quadro, cronograma, painel, contatos, configurações |

Cada camada: `diff-sanitize` → conversão → `check-dom-injection` → `auditActionsPro` → clique ao
vivo → release. Toda camada atualiza `pages/HISTORICO.md`.

## 8. Frente 2 — bibliotecas de terceiros

Em paralelo, sem bloquear a frente 1. Produz `docs/bibliotecas-terceiros.md` com origem, versão,
URL oficial e conferência de hash de cada arquivo de `dist/js/lib/`, e troca só o indefensável.

Levantamento inicial:

| arquivo | situação | ação |
|---|---|---|
| `buffer.min.js` | **bundle próprio** de 3 libs ("vendorizado para SEI Pro") | separar nos três arquivos oficiais |
| `chosen.jquery.min.js` | fork **`v1.8.2-hanoii`**, não é release oficial | avaliar troca pela 1.8.7 oficial (já presente como `_chosen.jquery.min.js`); testar o caso do select oculto |
| `_chosen.jquery.min.js` | segunda cópia do Chosen, 1.8.7 oficial | remover uma das duas |
| `html-to-docx.browser.js` | build de navegador feito à mão | regerar do dist oficial ou declarar |
| `pdfjs.js` | é `pdf.min.js` renomeado | renomear de volta |
| `diff2html.min.js` | é `htmldiff.js` renomeado | renomear de volta |
| `jquery-table-edit.min.js` | é `SimpleTableCellEditor` renomeado | renomear de volta |
| `jquery-ui.min.js` | build customizado do download builder (1.12.1) | declarar a lista de módulos |
| `jquery.tablesorter.combined.min.js` | fork do Mottie, com release própria | declarar, manter |
| `jmespath`, `jkanban`, `frappe-gantt`, `leaflet-geocoder`, `moment-weekday-calc` | sem versão declarada | identificar versão e declarar |

Cada troca é testada ao vivo antes de entrar.

## 9. Fora de escopo

- Reescrita por DOM API em massa (só os ~11 pontos da seção 4.4).
- Tagged template com escape automático das interpolações.
- `dist/js/modules/`, `dist/js/agente/`, `dist/js/estudio/`, `dist/js/ferramentas-pdf/` — já
  nascem com template literal e, no caso dos módulos do editor, já usam `sanitizeHTML`. Entram
  só se o `check-dom-injection` apontar algo.
- Mudança de comportamento ou de interface. Toda conversão é **iso-funcional**.

## 10. Riscos

| risco | mitigação |
|---|---|
| Tag ou atributo que o DOMPurify remove e ninguém previu | `diff-sanitize.mjs` roda **antes** de cada arquivo e lista tudo |
| Ação dispara duas vezes (cópia isolada + página) | Despachante só no mundo da página, trava por atributo no `<html>`; teste explícito em `sei-functions-pro.js` (camada 8) |
| Gatilho fica mudo (função existe, atributo errado) | `auditActionsPro()` + comparação com o inventário esperado |
| Argumento errado nos 189 handlers com parâmetro | Clique real obrigatório nesses casos; são a minoria e ficam listados por arquivo |
| Regressão em produção no gestor da ANTT | Camada 9 subdividida em 5 entregas; é a última |
| `accesskey` e `href="javascript:"` sumindo | `accesskey` entra no `ADD_ATTR`; os 2 `href="javascript:"` viram `data-spro-click` |
