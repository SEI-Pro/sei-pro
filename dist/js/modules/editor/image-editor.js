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
 * GRAVACAO NO CK5: mutar img.src no DOM nao entra no model do CK5. O novo src
 *    e gravado no model (writer.setAttribute('src') no imageInline/imageBlock
 *    achado pelo widget da imagem); a reescrita do HTML do corpo ficou so como
 *    fallback.
 *
 * ENTRADA NO CK5: o menu de contexto do CK4 (editImgPro, no monolito) nao existe
 *    no SEI 5. "Formatar imagem" e "Editar imagem" entram na barra que o CK5 mostra
 *    ao clicar na imagem (instalarBotaoBarraImagemCK5) e no botao direito sobre a
 *    imagem (menuImagemCK5Pro, chamado por editImgPro).
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
     * Aplica o novo src (base64) na imagem original. No CK4 basta mutar o DOM;
     * no CK5 a troca e feita no model (ver GRAVACAO NO CK5 acima).
     */
    function applyEditedSrcPro(editor, imgEl, oldSrc, newSrc) {
        if (!imgEl || !newSrc) return;
        var isCK5 = (SeiProEditorAdapter.version === 5);
        if (!isCK5) {
            imgEl.setAttribute('src', newSrc);
            return;
        }
        // CK5: troca o src no model (imageInline/imageBlock) a partir do widget da imagem.
        try {
            var wrapper = imgEl.closest ? imgEl.closest('.ck-widget') : null;
            var viewEl = wrapper ? editor.editing.view.domConverter.mapDomToView(wrapper) : null;
            var modelEl = viewEl ? editor.editing.mapper.toModelElement(viewEl) : null;
            if (modelEl && modelEl.hasAttribute('src')) {
                editor.model.change(function (writer) { writer.setAttribute('src', newSrc, modelEl); });
                return;
            }
        } catch (e) {}
        // Fallback: reescrita do HTML do corpo.
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
    window.openImageEditorPro = function (this_, imgInformada) {
        if (!checkConfigValue('editarimagens')) return;

        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var imgEl = imgInformada || resolveSelectedImagePro(editor);
        if (!imgEl || typeof imgEl.getAttribute('src') !== 'string') {
            alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma imagem para editar.');
            return;
        }
        var oldSrc = imgEl.getAttribute('src');

        // Dimensoes do dialogo (limita a 900px, como no original).
        var wScreen = $('body').width() - 5;
        wScreen = wScreen > 900 ? 900 : wScreen;
        // Altura do Filerobot: o que cabe na janela descontando titulo e botoes do dialogo (~170px).
        // Antes usava a altura do body menos 10: o dialogo passava da tela e os botoes ficavam fora dela.
        var hScreen = (window.innerHeight || $(window).height()) - 170;
        hScreen = Math.max(320, Math.min(hScreen, 900));

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxProImageEditor',
            title: 'Editar Imagem',
            width: wScreen,
            html: '<div id="ImageEditorPro" style="width:100%;height:' + hScreen + 'px;"></div>',
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
                        try { $box.dialog('option', 'position', { my: 'center', at: 'center', of: window }); } catch (e) {}
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

    // ----------------------------------------------------------------
    // CK5 (SEI 5): botao "Editar imagem" na barra que aparece ao clicar na
    // imagem (ImageToolbar). No CK4 a entrada e o menu de contexto (editImgPro
    // no monolito), que usa editor.contextMenu -- inexistente no CK5.
    // A barra e montada pelo WidgetToolbarRepository a partir de itemsConfig na
    // primeira exibicao: registramos o componente e acrescentamos o nome; se a
    // barra ja foi montada, o botao entra direto na view.
    // ----------------------------------------------------------------
    var ICONE_EDITAR_IMAGEM = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V8h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H8V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/>'
        + '<circle cx="10.5" cy="6.8" r="1.3"/>'
        + '<path d="M16.4 9.6l1.99 2a.75.75 0 0 1 0 1.06l-5.3 5.3a.75.75 0 0 1-.4.2l-2.4.4a.5.5 0 0 1-.57-.57l.4-2.4a.75.75 0 0 1 .2-.4l5.3-5.3a.75.75 0 0 1 1.06 0zm-.53 1.6l-4.6 4.6-.2 1.13 1.13-.2 4.6-4.6-.93-.93z"/>'
        + '</svg>';
    var ICONE_FORMATAR_IMAGEM = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V9h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H9V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/>'
        + '<circle cx="10.5" cy="6.8" r="1.3"/>'
        + '<path d="M11 11h8v1.5h-8zM11 14h8v1.5h-8zM11 17h8v1.5h-8z"/>'
        + '<path d="M13 10h1.5v3.5H13zM16.5 13h1.5v3.5h-1.5zM13.5 16h1.5v3.5h-1.5z"/>'
        + '</svg>';

    // Acoes de imagem do SEI Pro no SEI 5 (barra da imagem e botao direito).
    var ACOES_IMAGEM_CK5 = [
        { nome: 'seiProFormatarImagem', label: 'Formatar imagem (SEI Pro)', rotuloMenu: 'Formatar Imagem', icone: ICONE_FORMATAR_IMAGEM,
          executar: function (editor, img) { if (typeof openDialogUploadImgBase64 === 'function') openDialogUploadImgBase64(editor, img); } },
        { nome: 'seiProEditarImagem', label: 'Editar imagem (SEI Pro)', rotuloMenu: 'Editar Imagem', icone: ICONE_EDITAR_IMAGEM,
          executar: function (editor, img) { openImageEditorPro(null, img); } }
    ];

    function imagemSelecionadaCK5(editor) {
        var el = editor.model.document.selection.getSelectedElement();
        if (!el || !el.is('element') || !/^image/.test(el.name)) return null;
        var viewEl = editor.editing.mapper.toViewElement(el);
        var dom = viewEl ? editor.editing.view.domConverter.mapViewToDom(viewEl) : null;
        if (!dom) return null;
        return (dom.tagName === 'IMG') ? dom : dom.querySelector('img');
    }

    // Seleciona no model o widget da imagem clicada (o botao direito nao muda a selecao do CK5).
    function selecionarImagemCK5(editor, img) {
        try {
            var wrapper = img.closest ? img.closest('.ck-widget') : null;
            var viewEl = wrapper ? editor.editing.view.domConverter.mapDomToView(wrapper) : null;
            var modelEl = viewEl ? editor.editing.mapper.toModelElement(viewEl) : null;
            if (modelEl) editor.model.change(function (writer) { writer.setSelection(modelEl, 'on'); });
        } catch (e) {}
    }

    // ----------------------------------------------------------------
    // CK5 (SEI 5): botoes "Formatar imagem" e "Editar imagem" na barra que aparece
    // ao clicar na imagem (ImageToolbar). No CK4 a entrada e o menu de contexto
    // nativo (editImgPro, no monolito), que usa editor.contextMenu -- inexistente
    // no CK5. A barra e montada pelo WidgetToolbarRepository a partir de
    // itemsConfig na primeira exibicao: registramos os componentes e acrescentamos
    // os nomes; se a barra ja foi montada, os botoes entram direto na view.
    // ----------------------------------------------------------------
    function instalarBotaoBarraImagemCK5(editor) {
        if (!editor || !editor.ui || !editor.plugins.has('WidgetToolbarRepository')) return false;
        var repo = editor.plugins.get('WidgetToolbarRepository');
        var def = repo._toolbarDefinitions && repo._toolbarDefinitions.get('image');
        if (!def) return false;
        var fabrica = editor.ui.componentFactory;
        if (fabrica.has(ACOES_IMAGEM_CK5[0].nome)) return true;

        // O ButtonView nao e global no SEI 5: usa a classe do botao nativo de texto alternativo.
        var Botao = null;
        try { Botao = fabrica.create('imageTextAlternative').constructor; } catch (e) {}
        if (!Botao) return false;

        ACOES_IMAGEM_CK5.forEach(function (acao) {
            fabrica.add(acao.nome, function (locale) {
                var b = new Botao(locale);
                b.set({ label: acao.label, icon: acao.icone, tooltip: true, withText: false });
                b.bind('isEnabled').to(editor, 'isReadOnly', function (ro) { return !ro; });
                b.on('execute', function () { acao.executar(editor, imagemSelecionadaCK5(editor)); });
                return b;
            });
        });
        var nomes = ACOES_IMAGEM_CK5.map(function (a) { return a.nome; });

        if (Array.isArray(def.itemsConfig) && def.itemsConfig.indexOf(nomes[0]) === -1) {
            def.itemsConfig.push.apply(def.itemsConfig, ['|'].concat(nomes));
        }
        if (def.initialized && def.view && def.view.items) {
            // Separador: reaproveita a classe de um separador ja presente na barra.
            var sep = null;
            def.view.items.map(function (it) {
                if (!sep && it.element && it.element.classList.contains('ck-toolbar__separator')) sep = it;
            });
            if (sep) { try { def.view.items.add(new sep.constructor(editor.locale)); } catch (e) {} }
            nomes.forEach(function (n) { def.view.items.add(fabrica.create(n)); });
        }
        return true;
    }

    // Botao direito sobre a imagem no SEI 5 (chamado por editImgPro quando nao ha editor.contextMenu).
    window.menuImagemCK5Pro = function (editor) {
        if (!editor || !editor.model) return;
        SeiProEditorAdapter.addContextMenu(editor, function (targetEl) {
            var el = targetEl && (targetEl.nodeType === 1 ? targetEl : targetEl.parentElement);
            var widget = el && el.closest ? el.closest('.ck-widget') : null;
            var img = (el && el.tagName === 'IMG') ? el : (widget ? widget.querySelector('img') : null);
            if (!img || editor.isReadOnly) return [];
            return ACOES_IMAGEM_CK5.map(function (acao) {
                return { label: acao.rotuloMenu, action: function () { selecionarImagemCK5(editor, img); acao.executar(editor, img); } };
            });
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'image-editor' });
        if (typeof SeiProEditorAdapter.waitReady === 'function') {
            SeiProEditorAdapter.waitReady(30000).then(function () {
                if (SeiProEditorAdapter.version !== 5) return;
                if (typeof checkConfigValue === 'function' && !checkConfigValue('editarimagens')) return;
                instalarBotaoBarraImagemCK5(SeiProEditorAdapter.getInstance());
            }).catch(function () {});
        }
    }
})();
