/**
 * SEI Pro - Editor / Feature: Editar Imagem (Filerobot Image Editor)
 *
 * Abre um editor de imagem completo (lib Filerobot) sobre a imagem selecionada
 * no editor. O usuario ajusta/anota/redimensiona e, ao salvar, o novo conteudo
 * (base64) substitui o src da imagem original.
 *
 * Entradas (nomes preservados, referenciados por initFunctions/cliques do
 * monolito):
 *  - initDialogImageEditorPro : chamada no boot (tryRun). Como o dialogo agora e
 *    construido on-demand via SeiProEditorAdapter.openDialog, vira no-op (so
 *    valida a config, por simetria).
 *  - getDialogImageEditorPro  : antes registrava o CKEDITOR.dialog. No-op agora.
 *  - openImageEditorPro       : ponto de entrada efetivo (menu de contexto /
 *    comando do editor) -- abre o dialogo jQuery UI com o Filerobot dentro.
 *
 * PORTADO de CK4 para CK5:
 *  - O dialogo deixou de usar CKEDITOR.dialog.add/getCurrent/cancelButton e passou
 *    a usar SeiProEditorAdapter.openDialog (jQuery UI on-demand).
 *  - A imagem selecionada era obtida via oEditor.getSelection().getStartElement().$
 *    (no CK4 ".$" e o no DOM). Agora resolvemos o <img> selecionado de forma
 *    agnostica de versao por resolveSelectedImagePro(), que usa
 *    SeiProEditorAdapter.getSelectionElement() e, em fallback, procura uma imagem
 *    marcada como selecionada no corpo (widget do CK5).
 *
 * LIMITACAO CONHECIDA (status=partial):
 *  - No CK4, escrever o novo src direto no no DOM da imagem e suficiente (o CK4
 *    le o DOM do iframe na hora de salvar). No CK5 o conteudo e governado pelo
 *    model: mutar img.src no DOM nao sincroniza o model e a alteracao se perde no
 *    proximo render/salvar. Fazemos best-effort no CK5 reescrevendo o HTML do
 *    corpo via SeiProEditorAdapter.transformBodyHtml (troca a tag <img ... src=
 *    "antigo"> pela nova). Isso cobre o caso comum, mas pode falhar quando ha
 *    varias imagens com src identico ou quando o src e muito grande/normalizado
 *    pelo CK5. Uma integracao plena exigiria localizar o model element da imagem
 *    e usar writer.setAttribute('src', ...) -- nao exposto pelo adapter hoje.
 *
 * Globais do monolito / sei-functions-pro.js usados no clique (ja carregados
 * quando o handler roda): checkConfigValue, checkLoadFileRobot, alertaBoxPro,
 * NAMESPACE_SPRO, e a lib global FilerobotImageEditor (carregada on-demand por
 * checkLoadFileRobot). imgEditor e a instancia ativa do Filerobot (global,
 * espelhando o comportamento original do monolito).
 *
 * Ver js/modules/editor/README.md.
 */
(function () {
    'use strict';

    // Instancia ativa do Filerobot (mantem o nome global usado originalmente).
    if (typeof window.imgEditor === 'undefined') window.imgEditor = null;

    /**
     * Resolve o elemento DOM <img> atualmente selecionado, agnostico de versao.
     * CK4: getSelectionElement devolve o no dentro do iframe; se o cursor estiver
     * na propria imagem ja resolve. CK5: a imagem normalmente vive num widget
     * (figure.image / span.image-inline) marcado como selecionado.
     * Retorna o no DOM <img> ou null.
     */
    function resolveSelectedImagePro(editor) {
        // 1) Tenta direto pelo elemento da selecao.
        var el = SeiProEditorAdapter.getSelectionElement(editor);
        if (el) {
            if (el.tagName && el.tagName.toLowerCase() === 'img') return el;
            // Pode ser o wrapper/figure: procura uma img dentro.
            if (el.querySelector) {
                var inner = el.querySelector('img');
                if (inner) return inner;
            }
            // Pode ser um no de texto/elemento irmao: sobe ate um wrapper de imagem.
            if (el.closest) {
                var fig = el.closest('figure, .image, .image-inline, .ck-widget');
                if (fig) {
                    var imgIn = fig.querySelector ? fig.querySelector('img') : null;
                    if (imgIn) return imgIn;
                }
            }
        }
        // 2) Fallback CK5: imagem marcada como selecionada no corpo do editor.
        try {
            var $sel = SeiProEditorAdapter.findInBody(editor, '.ck-widget_selected img, .image_selected img, img.ck-widget_selected');
            if ($sel && $sel.length) return $sel[0];
        } catch (e) {}
        // 3) Ultimo recurso: se houver uma unica imagem no corpo, usa ela.
        try {
            var $all = SeiProEditorAdapter.findInBody(editor, 'img');
            if ($all && $all.length === 1) return $all[0];
        } catch (e) {}
        return null;
    }

    /**
     * Aplica o novo src (base64) na imagem original. No CK4 basta mutar o DOM.
     * No CK5 reescreve o HTML do corpo (best-effort) trocando o src antigo pelo
     * novo, ja que mutar o DOM nao sincroniza o model. Ver LIMITACAO acima.
     */
    function applyEditedSrcPro(editor, imgEl, oldSrc, newSrc) {
        if (!imgEl || !newSrc) return;
        var isCK5 = (SeiProEditorAdapter.version === 5);
        if (!isCK5) {
            imgEl.setAttribute('src', newSrc);
            return;
        }
        // CK5: best-effort via reescrita do HTML do corpo.
        var done = false;
        try {
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                if (typeof html !== 'string' || !oldSrc) return html;
                // Troca apenas a primeira ocorrencia do src antigo.
                var idx = html.indexOf(oldSrc);
                if (idx === -1) return html;
                done = true;
                return html.slice(0, idx) + newSrc + html.slice(idx + oldSrc.length);
            });
        } catch (e) {}
        if (!done) {
            // Fallback visual (nao persiste no model do CK5, mas mostra o
            // resultado e mantem o comportamento minimo).
            try { imgEl.setAttribute('src', newSrc); } catch (e2) {}
            alertaBoxPro('Info', 'info-circle', 'A imagem foi editada, mas a grava\u00E7\u00E3o no SEI 5 pode n\u00E3o persistir. Verifique antes de salvar.');
        }
    }

    /**
     * Abre o editor de imagem (Filerobot) num dialogo jQuery UI sobre a imagem
     * selecionada. Carrega a lib on-demand via checkLoadFileRobot.
     */
    window.openImageEditorPro = function (this_) {
        if (!checkConfigValue('editarimagens')) return;

        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var imgEl = resolveSelectedImagePro(editor);
        if (!imgEl || typeof imgEl.getAttribute('src') !== 'string') {
            alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma imagem para editar.');
            return;
        }
        var oldSrc = imgEl.getAttribute('src');

        // Dimensoes do dialogo (limita a 900px, como no original).
        var wScreen = $('body').width() - 5;
        wScreen = wScreen > 900 ? 900 : wScreen;
        var hScreen = $('body').height() - 10;
        hScreen = hScreen > 900 ? 900 : hScreen;

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxProImageEditor',
            title: 'Editar Imagem',
            width: wScreen,
            html: '<div id="ImageEditorPro" style="width:100%;"></div>',
            onOpen: function ($box) {
                $('#ImageEditorPro').css('height', hScreen);
                checkLoadFileRobot(function () {
                    if (typeof FilerobotImageEditor === 'undefined') {
                        alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel carregar o editor de imagem.');
                        return;
                    }
                    var container = document.querySelector('#ImageEditorPro');
                    if (!container) return;

                    var TABS = FilerobotImageEditor.TABS;
                    var TOOLS = FilerobotImageEditor.TOOLS;

                    var config = {
                        source: oldSrc,
                        onSave: function (editedImageObject) {
                            var newSrc = editedImageObject && editedImageObject.imageBase64;
                            if (newSrc) {
                                SeiProEditorAdapter.withEdit(editor, function () {
                                    applyEditedSrcPro(editor, imgEl, oldSrc, newSrc);
                                });
                            }
                            try { $box.dialog('close'); } catch (e) {}
                        },
                        annotationsCommon: { fill: '#ff0000' },
                        Text: { text: (typeof NAMESPACE_SPRO !== 'undefined' ? NAMESPACE_SPRO : '') + '...' },
                        translations: { 'toolbar.adjust': 'Ajustes' },
                        language: 'pt',
                        tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.FINETUNE, TABS.FILTERS, TABS.RESIZE, TABS.WATERMARK],
                        defaultTabId: TABS.ADJUST,
                        defaultToolId: TOOLS.TEXT,
                        loadableDesignState: false,
                        observePluginContainerSize: true
                    };

                    var filerobotImageEditor = new FilerobotImageEditor(container, config);
                    filerobotImageEditor.render({
                        onClose: function (closingReason) {
                            try { filerobotImageEditor.terminate(); } catch (e) {}
                            try { $box.dialog('close'); } catch (e) {}
                        }
                    });
                    window.imgEditor = filerobotImageEditor;

                    // Garante a altura do container apos o Filerobot montar.
                    setTimeout(function () {
                        $('#ImageEditorPro').css('height', hScreen);
                    }, 500);
                });
            },
            onClose: function () {
                // Encerra a instancia do Filerobot ao fechar o dialogo.
                try { if (window.imgEditor && window.imgEditor.terminate) window.imgEditor.terminate(); } catch (e) {}
                window.imgEditor = null;
            },
            buttons: [{
                text: 'Aplicar',
                primary: true,
                click: function ($box) {
                    // Equivalente ao onOk original: pega o estado atual do
                    // Filerobot e grava na imagem selecionada.
                    if (!window.imgEditor || typeof window.imgEditor.getCurrentImgData !== 'function') {
                        try { $box.dialog('close'); } catch (e) {}
                        return;
                    }
                    var data = window.imgEditor.getCurrentImgData();
                    var newSrc = data && data.imageData && data.imageData.imageBase64;
                    if (newSrc) {
                        SeiProEditorAdapter.withEdit(editor, function () {
                            applyEditedSrcPro(editor, imgEl, oldSrc, newSrc);
                        });
                    }
                    try { $box.dialog('close'); } catch (e) {}
                }
            }, {
                text: 'Cancelar',
                click: function ($box) {
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    };

    /**
     * Mantida por compatibilidade com initFunctions() do monolito (tryRun por
     * nome). O dialogo e construido on-demand em openImageEditorPro(); aqui so
     * validamos a config, sem registrar nada no CKEDITOR.
     */
    window.initDialogImageEditorPro = function () {
        if (checkConfigValue('editarimagens')) {
            getDialogImageEditorPro();
        }
    };

    // PORTADO: antes registrava CKEDITOR.dialog.add('ImageEditorPro', ...). Como
    // o dialogo agora e jQuery UI on-demand, vira no-op (mantido o nome global).
    window.getDialogImageEditorPro = function () { /* no-op */ };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'image-editor' });
    }
})();
