/**
 * SEI Pro - Editor / Feature: Tamanho da fonte (aumentar/diminuir)
 *
 * changeFontSize(this_, mode) aumenta (mode=='up') ou diminui (mode=='down')
 * em 2px o tamanho da fonte do texto selecionado.
 *
 * PORTADO de CK4 para CK5: a versao antiga usava setParamEditor + o global
 * oEditor (CKEDITOR.instances), oEditor.getSelection().getStartElement() para
 * ler o font-size atual e `new CKEDITOR.style({element:'span', attributes:
 * {style:'font-size:Npx'}})` + oEditor.applyStyle() para envolver a selecao.
 * Nada disso existe no CK5 (sem CKEDITOR.style/instances/iframe).
 *
 * Estrategia CK5 (conforme contrato/README, secao "feature de APLICACAO DE
 * ESTILO"): nao ha comando nativo garantido para uma span com font-size.
 *  1) le o elemento da selecao via getSelectionElement(editor) e calcula o
 *     font-size atual (CSS computado), depois +/-2px;
 *  2) respeita os limites do original: novo tamanho > 7 && < 70 px;
 *  3) pega o HTML selecionado via getSelectedHtml(editor); se vazio, aborta
 *     com alertaBoxPro (nada selecionado);
 *  4) dentro de withEdit(), substitui a selecao por
 *     <span style="font-size:Npx">HTML_SELECIONADO</span> via insertHtml().
 *
 * Limitacoes (needsLiveTest): aplicacoes repetidas aninham spans de font-size
 * (a span externa vence pela cascata, entao o comportamento visual fica
 * correto); o original com CKEDITOR.style fazia merge/normalizacao das spans.
 * A leitura do tamanho usa o CSS computado do elemento ancora da selecao.
 *
 * setParamEditor/hasSelection (CK4) sao substituidos por getInstance + checagem
 * de getSelectedHtml. alertaBoxPro e global (sei-functions-pro.js). Ver README.md.
 */
(function () {
    'use strict';

    // Le o font-size (px) do elemento da selecao. Usa CSS computado quando
    // disponivel; cai para jQuery .css() (mundo da pagina) e, por fim, 16px.
    function readFontSizePx(el) {
        if (!el) return 16;
        var px = NaN;
        try {
            if (window.getComputedStyle) {
                px = parseFloat(window.getComputedStyle(el).fontSize);
            }
        } catch (e) {}
        if (isNaN(px) && window.$) {
            try { px = parseFloat($(el).css('font-size')); } catch (e2) {}
        }
        return isNaN(px) ? 16 : px;
    }

    // Modifica o tamanho da fonte da selecao (mode: 'up' | 'down').
    window.changeFontSize = function (this_, mode) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var html = SeiProEditorAdapter.getSelectedHtml(editor);
        if (!html || html === '') {
            alertaBoxPro('Error', 'exclamation-triangle', 'Selecione um texto para alterar o tamanho da fonte');
            return;
        }

        var el = SeiProEditorAdapter.getSelectionElement(editor);
        var fontSize = readFontSizePx(el);
        var newFontSize = (mode == 'up') ? fontSize + 2 : fontSize - 2;

        // Mesmos limites do original (CK4): novo tamanho > 7 && < 70 px.
        if (!(newFontSize > 7 && newFontSize < 70)) return;

        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(
                editor,
                '<span style="font-size: ' + newFontSize + 'px">' + html + '</span>'
            );
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'font-size' });
    }
})();
