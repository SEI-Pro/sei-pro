/**
 * SEI Pro - Editor / Feature: Caixa de selecao (checkbox)
 *
 * Insere um icone de checkbox (U+2610) ancorado no ponto do cursor.
 *
 * Modulo de referencia da arquitetura modular (ver js/modules/editor/README.md):
 *  - Define o handler global com o MESMO nome usado pelo monolito em
 *    setClickButtons: $('.getInsertCheckboxButtom').on('click', ... getInsertCheckboxButtom(this)).
 *  - Toda a operacao no editor passa pelo SeiProEditorAdapter (CK4 e CK5).
 *  - Carregado ANTES do monolito (adapter -> modulos -> editor), portanto NAO
 *    chama helpers do monolito em tempo de avaliacao; randomString vem de
 *    sei-functions-pro.js (global, disponivel no clique).
 *
 * O span vai seguido de um espaco (&nbsp;), para o cursor ficar DEPOIS dele,
 * fora da caixa. Sem isso o texto digitado entrava na caixa e o Enter levava a
 * caixa (mesmo data-id) ao paragrafo seguinte:
 *  - CK4: o cursor ficava dentro do span; marcar a caixa apagava o texto do item.
 *  - CK5: o texto herda os atributos do caractere anterior (htmlSpan e bold
 *    sao copyOnEnter no GHS do SEI 5); o nbsp e texto sem atributo, entao o
 *    que vem depois dele tambem nao herda.
 * (contenteditable="false" foi descartado quando a limpeza automatica do CK4 --
 * auto-cleanup.js -- ainda reescrevia o corpo no 'change', tirando o atributo e
 * jogando o cursor para o inicio do documento. Hoje o CK4 limpa so a saida e
 * preserva o atributo; o nbsp segue resolvendo o cursor nos dois editores.)
 *
 * Observacao: o toggle de marcar/desmarcar (setActionCheckbox/toggleCheckboxSEI)
 * ainda vive no monolito, ligado por instancia em setCKEDITOR_instances, e so
 * existe no CK4 (iframe). No CK5 clicar na caixa ainda nao marca.
 */
(function () {
    'use strict';

    window.getInsertCheckboxButtom = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var html = '<span class="ancoraSei checkboxSEI" data-id="' + randomString(16) + '" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;';
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, html);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'checkbox' });
    }
})();
