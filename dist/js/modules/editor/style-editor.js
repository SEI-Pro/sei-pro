/**
 * SEI Pro - Editor feature: style-editor
 *
 * Editor de estilo avancado (toggle "seiSlim"). Ativa/desativa um modo de
 * estilizacao visual aplicando classes CSS no <body> da pagina e reinjetando
 * o pacote de icones (Font Awesome Pro) no <head>.
 *
 * Observacao de portabilidade CK4 -> CK5:
 *   Esta feature NAO manipula a instancia do editor, o iframe, a selecao nem
 *   qualquer API do CKEDITOR. Toda a operacao e sobre o DOM da pagina (<head>
 *   / <body>) e localStorage. Portanto e agnostica de versao e funciona igual
 *   em CK4 (SEI 3.1/4) e CK5 (SEI 5) sem precisar do adapter de editor.
 *
 *   insertFontIcon e um helper COMPARTILHADO definido em sei-functions-pro.js
 *   (usado por outras features). Nao pertence a este modulo; apenas e chamado
 *   em tempo de clique/boot, quando ja esta carregado.
 *
 * Handlers globais expostos (mesmos nomes usados pelo monolito):
 *   - getBoxStyleEditor(this_)  (bind em setClickButtons via .getNewStyleButton)
 *   - updateStyleEditor(mode)   (chamado por getBoxStyleEditor)
 */
(function () {
    'use strict';

    // Toggle do botao "Ativar estilo avancado". Alterna a classe visual do
    // botao (on/off) e aplica/remove o modo seiSlim de estilizacao.
    window.getBoxStyleEditor = function (this_) {
        var btn = $('.getNewStyleButton');
        // O estado vem da mesma chave que define o botao ao nascer: no CK5 ele nao recebe
        // cke_button_off, e o primeiro clique caia direto no 'remove'.
        if (!localStorage.getItem('seiSlim_editor')) {
            btn.addClass('cke_button_on').removeClass('cke_button_off');
            updateStyleEditor('set');
        } else {
            btn.addClass('cke_button_off').removeClass('cke_button_on');
            updateStyleEditor('remove');
        }
    };

    // Aplica (mode='set') ou remove (mode='remove') o modo de estilo avancado.
    // 'set':    persiste a flag, reinjeta os icones e marca o <body> com as
    //           classes seiSlim.
    // 'remove': limpa a flag e zera as classes do <body>.
    window.updateStyleEditor = function (mode) {
        if (mode == 'set') {
            localStorage.setItem('seiSlim_editor', true);
            $('head').find('link[data-style="seipro-fonticon"]').remove();
            $('head').find('style[data-style="seipro-fonticon"]').remove();
            insertFontIcon('head');
            $('body').addClass('seiSlim seiSlim_parent seiSlim_view');
        } else {
            localStorage.removeItem('seiSlim_editor');
            // So as classes que o 'set' pos: zerar o class do <body> levava junto newSEI/isSEI_5 e
            // seiEditor, das quais dependem os icones da barra no CK5 (sumiam e nao voltavam mais).
            $('body').removeClass('seiSlim seiSlim_parent seiSlim_view');
        }
    };

    SeiProEditorAdapter.registerFeature({ id: 'style-editor' });
})();
