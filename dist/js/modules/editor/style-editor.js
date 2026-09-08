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
        if (btn.hasClass('cke_button_off')) {
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
            $('body').attr('class', '');
        }
    };

    SeiProEditorAdapter.registerFeature({ id: 'style-editor' });
})();
