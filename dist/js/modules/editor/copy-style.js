/**
 * SEI Pro - Editor / Feature: Copiar formatacao (copy-style / "pincel")
 *
 * Captura a formatacao de um trecho (cor, cor de fundo, tamanho de fonte,
 * negrito, sublinhado, italico, tachado, sub/sobrescrito) e aplica em outra
 * selecao -- o classico "Copiar formatacao" (Format Painter).
 *
 * PORTADO de CK4 para CK5:
 *  - A versao antiga usava oEditor (CKEDITOR.instances) + getSelection(),
 *    CKEDITOR.style({element:'span', attributes:{style:...}}) + applyStyle,
 *    oEditor.execCommand(...) e editor.contextMenu/addMenuItem/addCommand.
 *    Nada disso existe no CK5.
 *  - Agora roteia tudo pelo SeiProEditorAdapter:
 *      getInstance/getSelectionElement (le o estilo da origem),
 *      getBodyContainer (marca/desmarca o modo "pincel ativo"),
 *      withEdit + execCommand (removeFormat/bold/underline/italic/strike/
 *      subscript/superscript) e getSelectedHtml + insertHtml para envolver a
 *      selecao numa <span style="..."> com cor/cor-de-fundo/tamanho (o CK5
 *      NAO expoe CKEDITOR.style, entao o wrap manual e a estrategia do
 *      contrato).
 *      addContextMenu substitui o menu de contexto nativo do CK4.
 *
 * Estado do modo "pincel": o flag fica em sessionStorage('copyStylePro')
 * (o estilo capturado) e numa classe 'cke_copyformatting_active' no body
 * container -- como no original, mas obtido via adapter (funciona em CK4 e
 * CK5). O estado visual do botao usa o seletor de classe '.getCopyStyleButtom'
 * (presente em ambas as versoes); as classes cke_button_on/off/disabled sao
 * inofensivas quando ausentes.
 *
 * Helpers que PERMANECEM no monolito (compartilhados por outras features):
 *  setParamEditor, hasSelection, getElementStyleSelected, getElementStyleSelected
 *  e o callers externos (initCKEDITOR_SEIPRO chama applyCopyStyle; o blur chama
 *  removeCopyStyle; o boot CK4 chama menuCopyStyle).
 *
 * Acentos escritos normalmente (a pipeline escapa para \uXXXX). Ver README.md.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Helpers internos (privados do modulo)
    // ----------------------------------------------------------------

    // Le o estilo do elemento DOM da selecao atual. Espelha
    // getElementStyleSelected (que recebe um jQuery) mas tolera ausencia de
    // jQuery/elemento. Mantemos uma copia local porque getElementStyleSelected
    // continua sendo um helper compartilhado no monolito e nem sempre esta
    // disponivel em tempo de avaliacao -- mas, em tempo de clique, preferimos
    // a versao do monolito quando existir.
    function readSelectionStyle(editor) {
        var el = SeiProEditorAdapter.getSelectionElement(editor);
        if (!el || !window.$) return null;
        var element = $(el);
        if (typeof window.getElementStyleSelected === 'function') {
            return getElementStyleSelected(element);
        }
        var fontSize = (parseFloat(element.css('font-size')) == 16 && (element.closest('sub').length || element.closest('sup').length)) ? false : parseFloat(element.css('font-size'));
        var color = (element.css('color') == 'rgb(0, 0, 0)') ? false : element.css('color');
        var backgroundColor = (element.css('background-color') == 'rgba(0, 0, 0, 0)') ? false : element.css('background-color');
        var bold = (element.closest('strong').length) ? true : false;
        var underline = (element.closest('u').length) ? true : false;
        var italic = (element.closest('em').length) ? true : false;
        var strike = (element.closest('s').length) ? true : false;
        var subscript = (element.closest('sub').length) ? true : false;
        var superscript = (element.closest('sup').length) ? true : false;
        return { fontSize: fontSize, color: color, backgroundColor: backgroundColor, bold: bold, underline: underline, italic: italic, strike: strike, subscript: subscript, superscript: superscript };
    }

    // Container do corpo do documento (iframe body no CK4, editable no CK5),
    // como elemento jQuery -- ou jQuery vazio.
    function bodyContainer$(editor) {
        var body = SeiProEditorAdapter.getBodyContainer(editor);
        return (body && window.$) ? $(body) : (window.$ ? $() : null);
    }

    // true se ha selecao nao-colapsada. Usa o helper compartilhado do monolito
    // quando presente; senao cai num teste via Selection nativa do adapter.
    function hasSelectionSafe(editor) {
        if (typeof window.hasSelection === 'function') {
            try { return hasSelection(editor); } catch (e) { /* fallback abaixo */ }
        }
        var txt = SeiProEditorAdapter.getSelectedText(editor);
        return !!(txt && txt.length);
    }

    // Liga/desliga o estado visual do botao (seletor de classe, agnostico de
    // versao). on=true => button_on; on=false => button_off; on='disabled' /
    // 'enabled' controlam o cke_button_disabled.
    function setButtonState(on) {
        if (!window.$) return;
        var $btn = $('.getCopyStyleButtom');
        if (!$btn.length) return;
        if (on === 'disabled') { $btn.addClass('cke_button_disabled'); return; }
        if (on === 'enabled') { $btn.removeClass('cke_button_disabled'); return; }
        if (on) { $btn.addClass('cke_button_on').removeClass('cke_button_off'); }
        else { $btn.addClass('cke_button_off').removeClass('cke_button_on'); }
    }

    // true se o modo pincel esta ativo (classe no body container).
    function isPainterActive(editor) {
        var $b = bodyContainer$(editor);
        return !!($b && $b.length && $b.hasClass('cke_copyformatting_active'));
    }

    // ----------------------------------------------------------------
    // Handlers GLOBAIS (mesmos nomes do monolito)
    // ----------------------------------------------------------------

    // Entrada do botao da toolbar. O monolito faz:
    //   $('.getCopyStyleButtom').on('click', ... setCopyStyle(this));
    window.setCopyStyle = function (this_) {
        if (typeof window.setParamEditor === 'function') setParamEditor(this_);
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        actionCopyStyle(editor);
    };

    // Captura (ou desativa, se ja ativo) a formatacao da selecao.
    window.actionCopyStyle = function (editor) {
        if (!editor) editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        if (isPainterActive(editor)) {
            removeCopyStyle();
            return;
        }
        var style = readSelectionStyle(editor);
        if (!style) return;
        try { sessionStorage.setItem('copyStylePro', JSON.stringify(style)); } catch (e) {}
        var $b = bodyContainer$(editor);
        if ($b && $b.length) $b.addClass('cke_copyformatting_active');
        setButtonState(true);
    };

    // Le o estilo capturado do sessionStorage (verbatim).
    window.getCopyStyle = function () {
        try { return JSON.parse(sessionStorage.getItem('copyStylePro')); }
        catch (e) { return null; }
    };

    // Aplica a formatacao capturada na selecao atual. Chamado em todo mouseup
    // (initCKEDITOR_SEIPRO) -- por isso so age quando o modo pincel esta ativo
    // E ha selecao. Tambem (des)habilita o botao conforme houver selecao.
    window.applyCopyStyle = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var selected = hasSelectionSafe(editor);
        var painterOn = isPainterActive(editor);
        var style = getCopyStyle();

        // Habilita/desabilita o botao (selecao OU modo pincel ativo).
        if (selected || painterOn) { setButtonState('enabled'); }
        else { setButtonState('disabled'); }

        if (!(style && selected && painterOn)) return;

        // Aplica dentro de um unico passo de edicao (undo agrupado).
        SeiProEditorAdapter.withEdit(editor, function () {
            // Limpa formatacao previa da selecao.
            SeiProEditorAdapter.execCommand(editor, 'removeFormat');

            // Cor de fundo, tamanho de fonte e cor: o CK5 nao tem applyStyle de
            // span arbitrario. Envolve a selecao numa span com o style composto.
            var spanStyles = [];
            if (style.backgroundColor && style.backgroundColor !== '') {
                spanStyles.push('background-color: ' + style.backgroundColor);
            }
            if (style.fontSize > 0) {
                spanStyles.push('font-size: ' + style.fontSize + 'px');
            }
            if (style.color && style.color !== '') {
                spanStyles.push('color: ' + style.color);
            }
            if (spanStyles.length) {
                var html = SeiProEditorAdapter.getSelectedHtml(editor);
                if (html && html !== '') {
                    SeiProEditorAdapter.insertHtml(
                        editor,
                        '<span style="' + spanStyles.join('; ') + '">' + html + '</span>'
                    );
                }
            }

            // Formatacoes simples via comandos nativos (mapeados pelo adapter).
            if (style.bold) { SeiProEditorAdapter.execCommand(editor, 'bold'); }
            if (style.underline) { SeiProEditorAdapter.execCommand(editor, 'underline'); }
            if (style.italic) { SeiProEditorAdapter.execCommand(editor, 'italic'); }
            if (style.strike) { SeiProEditorAdapter.execCommand(editor, 'strike'); }
            if (style.subscript) { SeiProEditorAdapter.execCommand(editor, 'subscript'); }
            if (style.superscript) { SeiProEditorAdapter.execCommand(editor, 'superscript'); }
        });

        // Mantem o modo pincel ativo enquanto Alt estiver pressionado (igual ao
        // original: aplicacao em sequencia). Sem Alt, desliga apos aplicar.
        var altHeld = false;
        try { altHeld = !!(window.event && window.event.altKey); } catch (e) {}
        if (!altHeld) { removeCopyStyle(); }
    };

    // Desliga o modo pincel: limpa sessionStorage, classe do body e estado do botao.
    window.removeCopyStyle = function () {
        var editor = SeiProEditorAdapter.getInstance();
        var $b = editor ? bodyContainer$(editor) : (window.$ ? $() : null);
        if ($b && $b.length) $b.removeClass('cke_copyformatting_active');
        try { sessionStorage.removeItem('copyStylePro'); } catch (e) {}
        setButtonState(false);
    };

    // Menu de contexto "Copiar formatacao". No CK4 era contextMenu/addMenuItem/
    // addCommand; aqui usa o menu de contexto DOM uniforme do adapter. Idempotente
    // (addContextMenu marca o body). O item so aparece quando o alvo esta dentro
    // de um <p> e ha selecao.
    window.menuCopyStyle = function (editor) {
        if (!editor) return;
        SeiProEditorAdapter.addContextMenu(editor, function (targetEl) {
            var inParagraph = targetEl && targetEl.closest && targetEl.closest('p');
            if (inParagraph && hasSelectionSafe(editor)) {
                return [{
                    label: 'Copiar formata\u00E7\u00E3o',
                    action: function () { actionCopyStyle(editor); }
                }];
            }
            return [];
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'copy-style' });
    }
})();
