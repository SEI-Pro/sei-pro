# Módulos do Editor SEI Pro (`js/modules/editor/`)

Cada arquivo aqui é **uma feature** das ferramentas de produtividade do editor do SEI.
Esta pasta faz parte da portabilidade do editor de **CKEditor 4** (SEI 3.1/4) para
**CKEditor 5** (SEI 5) e da quebra do monólito `js/sei-pro-editor.js` (8472 linhas)
em arquivos pequenos e fáceis de manter.

## Como os módulos carregam

1. `init.js` carrega `js/sei-pro-editor-adapter.js` primeiro.
2. O adapter expõe `window.SeiProEditorAdapter` e a lista canônica de módulos em
   `SeiProEditorAdapter.MODULES`.
3. `init.js` chama `SeiProEditorAdapter.loadModules(getUrlExtension, $.getScript)`,
   que carrega **todos os módulos desta pasta ANTES** do monólito
   `js/sei-pro-editor.js`.
4. O monólito faz o boot (`addButton` via `waitReady`), montando a toolbar.

Ordem garantida: **adapter → módulos → monólito**. Por isso:

- Um módulo só pode **definir funções globais** no topo (escopo global via
  `$.getScript`). **NÃO** chame helpers do monólito (`htmlButtonPro`, `htmlButton`,
  `setNextElemEditor`, etc.) em tempo de avaliação — eles ainda não existem.
- Tudo bem chamar helpers do monólito **dentro** dos handlers (`onClick`/`init`),
  pois eles rodam em tempo de clique/boot, quando o monólito já carregou.

## Contrato de uma feature

O rendering do botão na toolbar e o bind de clique continuam no monólito
(`htmlButton`/`addButton`/`setClickButtons`) — isso já funciona em CK4 e CK5.
A extração consiste em **mover as definições de função** da feature para o módulo,
preservando os **mesmos nomes globais** (o `setClickButtons`/`initFunctions` do
monólito continua referenciando-os por nome) e **registrando** a feature para
enumeração/diagnóstico:

```js
(function () {
    'use strict';

    // 1) Define o(s) handler(s) global(is) com o MESMO nome que o monólito usava.
    //    (o monólito faz: $('.getInsertCheckboxButtom').on('click', ... getInsertCheckboxButtom(this)))
    window.getInsertCheckboxButtom = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, '...');
        });
    };

    // 2) Registra a feature (leve: id + init opcional). Idempotente.
    SeiProEditorAdapter.registerFeature({
        id: 'checkbox',
        // init: function () { ... }  // opcional; roda no boot (equivalente ao que estava em initFunctions)
    });
})();
```

### Regras

- **Acentos:** todo caractere acentuado deve ser escrito como escape `\uXXXX`
  (ex.: `seleção`). UTF-8 cru vira mojibake quando o SEI injeta o script.
- **Roteie tudo pelo adapter:** nada de `CKEDITOR.*`, `CKEDITOR.dialog`, acesso a
  `iframe`/`.contents()` ou `editor.getSelection()` cru. Use as primitivas do
  `SeiProEditorAdapter` (`getInstance`, `withEdit`, `insertHtml`, `insertHtmlBefore`,
  `getBodyContainer`, `findInBody`, `appendToBody`, `transformBodyHtml`,
  `getSelectionElement/Paragraph`, `execCommand`, `applyStyle`, `getData/setData`,
  `insertElement`, `saveSelection/restoreSelection`, `getSelectedText/Html`,
  `on/off/fire`, `openDialog`).
- **Classes, estilos e atributos:** nunca por mutação de DOM (`el.setAttribute`,
  `el.style.x`) — no CK5 o DOM é só a view e a alteração não entra no model nem
  é salva. Use `SeiProGhs.addClasse/removeClasse/setEstilos/setAtributos`
  (`ghs-unlock.js`), que aplicam pelo model via General HTML Support.
- **Diálogos:** use `SeiProEditorAdapter.openDialog(def)` (jQuery UI on-demand) —
  nunca `CKEDITOR.dialog.add/openDialog/getCurrent`.
- **Sem chamadas em tempo de avaliação** a helpers do monólito (ver acima).
- Ao extrair, **remova** as definições correspondentes do monólito
  `js/sei-pro-editor.js` para não duplicar globais.

## Registrar um módulo novo

Adicione o nome do arquivo ao array `MODULES` em `js/sei-pro-editor-adapter.js`
(é a lista canônica que o loader percorre) e garanta que `js/modules/editor/*.js`
está no `web_accessible_resources`/`resources` de todos os `manifest*.json`.
