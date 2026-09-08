/**
 * SEI Pro - Editor / Feature: Alinhar texto (esquerda/centro/direita/justificado)
 *
 * Tres funcoes globais (mesmos nomes do monolito):
 *   - openAlignText(this_)  -> abre/fecha o dropdown .divAlignText (botao .getAlignButtom).
 *   - setAlignText(this_, mode) -> aplica o alinhamento (mode: left|center|right|justify)
 *     ao(s) paragrafo(s) da selecao, trocando a classe SEI de alinhamento quando o
 *     paragrafo ja usa uma da familia (normal / Tabela / Maiusculas) ou caindo para
 *     text-align inline.
 *   - closeAlignText() -> fecha o dropdown (chamado no blur/boot do editor).
 *
 * PORTADO de CK4 para CK5.
 *
 * Versao antiga (CK4):
 *   - setParamEditor(this_) populava os globais idEditor/oEditor (CKEDITOR.instances);
 *   - oEditor.getSelection().getStartElement() pegava o paragrafo inicial;
 *   - setNextElemEditor() iterava paragrafo a paragrafo lendo a selecao do
 *     contentWindow do IFRAME do editor (inexistente no CK5);
 *   - mutava element.closest('p') via jQuery (DOM do iframe);
 *   - openAlignText/closeAlignText usavam .closest('.cke_top') e '#cke_'+idEditor,
 *     que sao DOM exclusivo do CK4.
 *
 * Estrategia CK5 (via SeiProEditorAdapter, conforme README, secao "Alinhamento"):
 *   - getInstance(this_) resolve a instancia (CK4: pelo wrapper .cke; CK5: unica).
 *   - Em vez de setNextElemEditor + iframe, percorremos os <p> do range da selecao
 *     nativa (window.getSelection): do paragrafo do anchorNode ate o do focusNode.
 *     Isso funciona tanto no editable inline do CK5 quanto no body do iframe do CK4
 *     (a selecao nativa aponta para dentro do documento ativo). Se nao houver
 *     selecao, usamos o paragrafo do cursor via getSelectionParagraph.
 *   - As mutacoes de classe/style do <p> rodam dentro de withEdit() (CK4: focus +
 *     saveSnapshot; CK5: editor.model.change). Mutar o DOM do editable dentro do
 *     model.change e' reconciliado pelo CK5, mas como alteramos apenas
 *     classe/atributo style de um <p> existente (General HTML Support preserva
 *     class/style), o resultado persiste; needsLiveTest cobre essa premissa.
 *
 * Limitacoes (needsLiveTest): no CK5 a alteracao e' feita no DOM do editable (nao
 * via comando 'alignment' nativo, porque o SEI usa CLASSES de paragrafo, nao
 * text-align puro); a familia de classe (normal/Tabela/Maiusc) e' preservada como
 * no original. alertaBoxPro nao e' usado aqui (o original tambem nao avisava sem
 * selecao). Ver README.md.
 */
(function () {
    'use strict';

    // Mapa: familia de classe SEI de alinhamento -> classe alvo por modo.
    // Espelha exatamente as familias do setAlignText original (CK4).
    var ALIGN_FAMILIES = [
        {
            members: ['Texto_Alinhado_Esquerda', 'Texto_Centralizado', 'Texto_Alinhado_Direita', 'Texto_Justificado'],
            byMode: {
                left: 'Texto_Alinhado_Esquerda',
                center: 'Texto_Centralizado',
                right: 'Texto_Alinhado_Direita',
                justify: 'Texto_Justificado'
            }
        },
        {
            members: ['Tabela_Texto_Alinhado_Esquerda', 'Tabela_Texto_Centralizado', 'Tabela_Texto_Alinhado_Direita', 'Tabela_Texto_Justificado'],
            byMode: {
                left: 'Tabela_Texto_Alinhado_Esquerda',
                center: 'Tabela_Texto_Centralizado',
                right: 'Tabela_Texto_Alinhado_Direita',
                justify: 'Tabela_Texto_Justificado'
            }
        },
        {
            members: ['Texto_Alinhado_Esquerda_Maiusc', 'Texto_Centralizado_Maiusculas', 'Texto_Alinhado_Direita_Maiusc', 'Texto_Justificado_Maiusculas'],
            byMode: {
                left: 'Texto_Alinhado_Esquerda_Maiusc',
                center: 'Texto_Centralizado_Maiusculas',
                right: 'Texto_Alinhado_Direita_Maiusc',
                justify: 'Texto_Justificado_Maiusculas'
            }
        }
    ];

    // Retorna a classe-alvo se a classe atual do <p> pertence a uma das familias;
    // caso contrario null (sinaliza fallback para text-align inline).
    function resolveAlignClass(currentClass, mode) {
        for (var i = 0; i < ALIGN_FAMILIES.length; i++) {
            var fam = ALIGN_FAMILIES[i];
            if (fam.members.indexOf(currentClass) !== -1) {
                return fam.byMode[mode] || '';
            }
        }
        return null;
    }

    // Sobe ate o <p> ancestral (inclusive) a partir de um node DOM qualquer.
    function paragraphOf(node) {
        if (!node) return null;
        var el = (node.nodeType === 1) ? node : node.parentElement;
        if (!el) return null;
        return el.closest ? el.closest('p') : null;
    }

    // Coleta os <p> abrangidos pela selecao nativa atual. Se nao houver range,
    // ou anchor/focus coincidirem, retorna so o paragrafo do cursor. Percorre do
    // <p> inicial ao final via nextElementSibling (mesma ideia do setNextElemEditor
    // original, mas sem depender do iframe/contentWindow).
    function collectSelectedParagraphs(editor) {
        var sel = null;
        try { sel = window.getSelection && window.getSelection(); } catch (e) {}

        if (!sel || sel.rangeCount === 0 || !sel.anchorNode) {
            var single = SeiProEditorAdapter.getSelectionParagraph(editor);
            return single ? [single] : [];
        }

        var startP = paragraphOf(sel.anchorNode);
        var endP = paragraphOf(sel.focusNode);
        if (!startP && !endP) {
            var only = SeiProEditorAdapter.getSelectionParagraph(editor);
            return only ? [only] : [];
        }
        if (!startP) startP = endP;
        if (!endP) endP = startP;
        if (startP === endP) return [startP];

        // A ordem do anchor/focus pode estar invertida (selecao de baixo para
        // cima). Usa compareDocumentPosition para descobrir quem vem primeiro.
        var first = startP, last = endP;
        try {
            var pos = startP.compareDocumentPosition(endP);
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) { first = endP; last = startP; }
        } catch (e2) {}

        var out = [];
        var cur = first;
        var guard = 0;
        while (cur && guard < 5000) {
            if (cur.tagName && cur.tagName.toLowerCase() === 'p') out.push(cur);
            if (cur === last) break;
            cur = cur.nextElementSibling;
            guard++;
        }
        if (out.length === 0) out.push(first);
        return out;
    }

    // Aplica o alinhamento a um unico <p> (troca de classe ou text-align inline).
    function applyAlignToParagraph(p, mode) {
        if (!p) return;
        var currentClass = p.getAttribute('class') || '';
        var newClass = resolveAlignClass(currentClass, mode);
        if (newClass !== null && newClass !== '') {
            p.removeAttribute('style');
            p.setAttribute('class', newClass);
        } else if (newClass === null) {
            // Paragrafo fora das familias SEI: usa text-align inline (como o original).
            p.removeAttribute('style');
            p.style.textAlign = mode;
        }
    }

    // Altera o alinhamento do texto selecionado. mode: left|center|right|justify.
    window.setAlignText = function (this_, mode) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var paragraphs = collectSelectedParagraphs(editor);
        if (!paragraphs.length) return;

        SeiProEditorAdapter.withEdit(editor, function () {
            for (var i = 0; i < paragraphs.length; i++) {
                applyAlignToParagraph(paragraphs[i], mode);
            }
        });
    };

    // Localiza o container .divAlignText associado ao botao .getAlignButtom de
    // forma agnostica de versao. CK4 usava .closest('.cke_top'); como o
    // .divAlignText e' irmao dos demais botoes custom na toolbar, procuramos o
    // ancestral mais proximo que o contenha; em ultimo caso, o(s) global(is).
    function findAlignDropdown(buttonEl) {
        if (window.$ && buttonEl) {
            var $btn = $(buttonEl);
            // 1) caminho CK4 original.
            var $top = $btn.closest('.cke_top');
            if ($top.length) {
                var $d = $top.find('.divAlignText');
                if ($d.length) return $d;
            }
            // 2) qualquer ancestral que contenha o dropdown (CK5 e variacoes).
            var $anc = $btn.parents().filter(function () {
                return $(this).find('.divAlignText').length > 0;
            }).first();
            if ($anc.length) return $anc.find('.divAlignText').first();
        }
        // 3) fallback global (toolbar unica).
        return window.$ ? $('.divAlignText') : null;
    }

    // Abre/fecha o dropdown de alinhamento (botao .getAlignButtom).
    window.openAlignText = function (this_) {
        if (!window.$) return;
        var $btn = $(this_);
        var $dropdown = findAlignDropdown(this_);
        if ($btn.hasClass('cke_button_on')) {
            $btn.addClass('cke_button_off').removeClass('cke_button_on');
            if ($dropdown) $dropdown.hide();
        } else {
            $btn.addClass('cke_button_on').removeClass('cke_button_off');
            if ($dropdown) $dropdown.show();
        }
    };

    // Fecha o dropdown de alinhamento. Chamado no blur/boot do editor. Versao
    // agnostica: reseta todos os botoes .getAlignButtom e esconde os dropdowns
    // (toolbar e' unica), sem depender de '#cke_'+idEditor (DOM exclusivo do CK4).
    window.closeAlignText = function () {
        if (!window.$) return;
        $('.getAlignButtom').addClass('cke_button_off').removeClass('cke_button_on');
        $('.divAlignText').hide();
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'align' });
    }
})();
