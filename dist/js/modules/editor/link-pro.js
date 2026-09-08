/**
 * SEI Pro - Feature: link-pro
 *
 * Edicao avancada de links no editor: popover (tip) sobre links http com
 * acoes Abrir / Copiar / Editar / Remover, e dialogo de edicao de texto+URL.
 *
 * Portado de CKEditor 4 (SEI 3.1/4) para CKEditor 5 (SEI 5) via
 * window.SeiProEditorAdapter. As funcoes globais mantem os MESMOS nomes que o
 * monolito usa em setOnBodyActs (showLinkTips/hideLinkTips), nos onclick do
 * popover (openLinkPro/copyLinkPro/editLinkPro/removeLinkPro) e em
 * initFunctions (getDialogLinkPro).
 *
 * Observacoes de portabilidade:
 *  - As acoes (open/remove/copy/edit) e o dialogo (openDialogLinkPro) ja
 *    operam pelo adapter (getInstance/findInBody/withEdit), entao funcionam
 *    em CK4 e CK5.
 *  - showLinkTips/hideLinkTips sao chamadas por setOnBodyActs (path CK4) com
 *    um "iframeDoc" (jQuery contents() do iframe). Em CK5 nao ha iframe; o
 *    modulo deriva o corpo do texto pelo adapter (getBodyContainer) quando o
 *    argumento nao e fornecido, mantendo o comportamento gracioso.
 *
 * Helpers compartilhados usados (definidos no monolito, disponiveis em tempo
 * de clique/boot): alertaBoxPro, copyToClipboard, sanitizeHTML,
 * resetDialogBoxPro, randomString, restoreIframeDisplayLink. A variavel global
 * idEditor (CK4) tambem e do monolito.
 */
(function () {
    'use strict';

    // Resolve o documento/container onde os links vivem. Em CK4
    // setOnBodyActs passa o iframeDoc (jQuery contents()); usamos ele direto.
    // Em CK5 (ou chamada sem argumento) derivamos o corpo do texto pelo adapter.
    function resolveLinkDoc(iframeDoc) {
        if (iframeDoc && iframeDoc.find) return iframeDoc;
        var editor = SeiProEditorAdapter.getInstance();
        var body = editor ? SeiProEditorAdapter.getBodyContainer(editor) : null;
        return body && window.$ ? $(body) : null;
    }

    // ----------------------------------------------------------------
    // Acoes do popover (chamadas via onclick="parent.<fn>(...)").
    // ----------------------------------------------------------------

    window.openLinkPro = function (linkRef, idEditor) {
        var editor = SeiProEditorAdapter.getInstance();
        var link = SeiProEditorAdapter.findInBody(editor, 'a[data-reflinkpro="' + linkRef + '"]');
        var url = link.attr('href');
        var win = window.open(url, '_blank');
        if (win) {
            win.focus();
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Por favor, permita popups para essa p\u00E1gina');
        }
    };

    window.removeLinkPro = function (linkRef, idEditor) {
        var editor = SeiProEditorAdapter.getInstance();
        SeiProEditorAdapter.withEdit(editor, function () {
            var link = SeiProEditorAdapter.findInBody(editor, 'a[data-reflinkpro="' + linkRef + '"]');
            if (link.closest('span').attr('contenteditable') == 'false') {
                link.closest('span').removeAttr('contenteditable');
            }
            link.after(link.html()).remove();
            SeiProEditorAdapter.findInBody(editor, '.linkDisplayPro').remove();
        });
    };

    window.copyLinkPro = function (linkRef, idEditor) {
        var editor = SeiProEditorAdapter.getInstance();
        var el = SeiProEditorAdapter.findInBody(editor, 'a[data-reflinkpro="' + linkRef + '"]');
        var url = el.attr('href');
        copyToClipboard(url);
        el.find('.info').text('Link copiado!').show();
        setTimeout(function () {
            el.find('.info').text('').hide();
        }, 2000);
    };

    window.editLinkPro = function (idEditor) {
        openDialogLinkPro();
    };

    // Mantido por compatibilidade com initFunctions(); o dialogo agora eh
    // jQuery UI construido on-demand em openDialogLinkPro().
    window.getDialogLinkPro = function () { /* no-op */ };

    /**
     * Abre o dialogo de edicao de link (jQuery UI). Substitui o CKEDITOR.dialog
     * 'editLinkPro'. Preenche os campos a partir do link em foco
     * (a[data-reflinkpro]).
     */
    window.openDialogLinkPro = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        // O link em foco eh identificado pelo elemento que abriu o popover --
        // usamos o elemento apontado pela selecao atual como aproximacao.
        var selectedEl = SeiProEditorAdapter.getSelectionElement(editor);
        var aEl = selectedEl ? $(selectedEl).closest('a[data-reflinkpro]') : $();
        if (!aEl.length) {
            // fallback: pega o primeiro link com data-reflinkpro do corpo
            aEl = SeiProEditorAdapter.findInBody(editor, 'a[data-reflinkpro]').first();
        }
        var linkRef = aEl.attr('data-reflinkpro') || '';
        var currentHref = aEl.attr('href') || '';
        var currentText = aEl.text() || '';

        var htmlBox = sanitizeHTML(
            '<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 14pt;color: #616161;">'
            + '    <table style="font-size: 10pt;width: 100%;" class="seiProForm">'
            + '        <tr><td><label for="linkProNome">Texto vis\u00EDvel:</label></td></tr>'
            + '        <tr><td><input type="text" id="linkProNome" style="width:100%"></td></tr>'
            + '        <tr><td><label for="linkProUrl">URL:</label></td></tr>'
            + '        <tr><td><input type="text" id="linkProUrl" style="width:100%" required></td></tr>'
            + '        <input type="hidden" id="linkProRef">'
            + '    </table>'
            + '</div>'
        );

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title: 'Editar link',
                width: 460,
                height: 260,
                open: function () {
                    $('#linkProNome').val(currentText);
                    $('#linkProUrl').val(currentHref);
                    $('#linkProRef').val(linkRef);
                },
                buttons: [{
                    text: 'Salvar',
                    'class': 'confirm ui-state-active',
                    click: function () {
                        var urlLink = ($('#linkProUrl').val() || '').trim();
                        var nomeLink = ($('#linkProNome').val() || '').trim();
                        var refAtualizar = $('#linkProRef').val();
                        if (!urlLink) {
                            alertaBoxPro('Error', 'exclamation-triangle', 'Digite um link');
                            return;
                        }
                        if (!nomeLink) nomeLink = urlLink;
                        SeiProEditorAdapter.withEdit(editor, function () {
                            SeiProEditorAdapter.findInBody(editor, 'a[data-reflinkpro="' + refAtualizar + '"]')
                                .attr('href', urlLink)
                                .attr('data-cke-saved-href', urlLink)
                                .text(nomeLink);
                        });
                        resetDialogBoxPro('dialogBoxPro');
                    }
                }]
            });
    };

    // ----------------------------------------------------------------
    // Popover (tip) sobre links http.
    // ----------------------------------------------------------------

    window.hideLinkTips = function (iframeDoc) {
        var doc = resolveLinkDoc(iframeDoc);
        if (!doc) return;
        if (doc.find('.linkDisplayPro:hover').length == 0) {
            doc.find('.linkDisplayPro').closest('a');
            doc.find('.linkDisplayPro').remove();
            if (typeof restoreIframeDisplayLink === 'function') restoreIframeDisplayLink();
        }
    };

    window.showLinkTips = function (this_, iframeDoc) {
        var doc = resolveLinkDoc(iframeDoc);
        if (doc) doc.find('.linkDisplayPro').remove();

        var eLink = $(this_);
        var tLink = eLink.text();
        tLink = $('<div/>').text(tLink).html();
        var hrefLink = eLink.attr('href');
        var hLinkTiny = (hrefLink.length > 50)
            ? hrefLink.replace(/^(.{50}[^\s]*).*/, '$1') + '...'
            : hrefLink;
        var linkRef = randomString(8);
        // idEditor eh um global do monolito (CK4). Em CK5 fica indefinido, mas
        // os onclick (parent.openLinkPro etc) nao usam o segundo argumento para
        // resolver a instancia -- o adapter pega a unica instancia ativa.
        var idEditorRef = (typeof idEditor !== 'undefined' && idEditor) ? idEditor : '';
        var html = '<div class="linkDisplayPro" unselectable="on">'
            + '    <span contenteditable="false">'
            + '        <a onclick="parent.openLinkPro(\'' + linkRef + '\',\'' + idEditorRef + '\')" title="Abrir link"><i class="fas fa-globe-americas" style="padding-right: 5px;"></i><span class="info"></span><strong style="font-size: 13pt;" class="title-linktip" title="' + tLink + '">' + hLinkTiny + '</strong> <i class="fas fa-external-link-alt" style="font-size: 11px; padding: 3px; vertical-align: top;"></i></a> '
            + '        <a onclick="parent.copyLinkPro(\'' + linkRef + '\',\'' + idEditorRef + '\')" title="Copiar link"><i class="far fa-copy" style="color: #777;"></i></a>'
            + '        <a onclick="parent.editLinkPro(\'' + idEditorRef + '\')" title="Editar link"><i class="fas fa-pen" style="color: #777;"></i></a>'
            + '        <a onclick="parent.removeLinkPro(\'' + linkRef + '\',\'' + idEditorRef + '\')" title="Remover link"><i class="fas fa-unlink" style="color: #777;"></i></a>'
            + '    </span>'
            + '</div>';
        $(this_).attr('data-reflinkpro', linkRef).prepend(html);

        var boxDisplayLink = $(this_).find('.linkDisplayPro');
        if (!boxDisplayLink.length || !boxDisplayLink.offset()) return;
        var boxDisplayLink_left = boxDisplayLink.offset().left;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = $(window).width();
        var margin = (boxDisplayLink_left + boxDisplayLink_width > windowWidth)
            ? windowWidth - (boxDisplayLink_left + boxDisplayLink_width + 45)
            : 0;
        boxDisplayLink.css('margin-left', margin);
    };

    // Registro da feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'link-pro' });
})();
