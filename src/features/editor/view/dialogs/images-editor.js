/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';
import { openImageCrop } from '../../../../shared/ui/image-crop.js';

export function hideLinkTips(iframeDoc) {
    if (iframeDoc.find('.linkDisplayPro:hover').length == 0) {
        iframeDoc.find('.linkDisplayPro').closest('a');
        iframeDoc.find('.linkDisplayPro').remove();
        api.restoreIframeDisplayLink();
    }
}
export function showLinkTips(this_, iframeDoc) {
    iframeDoc.find('.linkDisplayPro').remove();
    var eLink = q(this_);
    var tLink = eLink.text();
        tLink = q("<div/>").text(tLink).html();
    var hrefLink = eLink.attr('href');
    var hLinkTiny = ( hrefLink.length > 50 ) ? hrefLink.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : hrefLink;
    var linkRef = randomString(8);
    var html =  '<div class="linkDisplayPro" unselectable="on">'+
                '    <span contenteditable="false">'+
                '        <a data-seipro-action="openLinkPro" data-seipro-link-ref="'+linkRef+'" data-seipro-editor-id="'+state.idEditor+'" title="Abrir link"><i class="fas fa-globe-americas" style="padding-right: 5px;"></i><span class="info"></span><strong style="font-size: 13pt;" class="title-linktip" title="'+tLink+'">'+hLinkTiny+'</strong> <i class="fas fa-external-link-alt" style="font-size: 11px; padding: 3px; vertical-align: top;"></i></a> '+
                '        <a data-seipro-action="copyLinkPro" data-seipro-link-ref="'+linkRef+'" data-seipro-editor-id="'+state.idEditor+'" title="Copiar link"><i class="far fa-copy" style="color: #777;"></i></a>'+
                '        <a data-seipro-action="editLinkPro" data-seipro-editor-id="'+state.idEditor+'" title="Editar link"><i class="fas fa-pen" style="color: #777;"></i></a>'+
                '        <a data-seipro-action="removeLinkPro" data-seipro-link-ref="'+linkRef+'" data-seipro-editor-id="'+state.idEditor+'" title="Remover link"><i class="fas fa-unlink" style="color: #777;"></i></a>'+
                '    </span>'+
                '</div>';
        q(this_).attr('data-reflinkpro', linkRef).prepend(html);

        var boxDisplayLink = q(this_).find('.linkDisplayPro');
        var boxDisplayLink_left = boxDisplayLink.offset().left;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = q(window).width();
        var margin = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-(boxDisplayLink_left+boxDisplayLink_width+45) : 0;
            boxDisplayLink.css('margin-left', margin);
}
export function openImageEditorPro(this_) {
    api.setParamEditor(this_);
    let selectedImg = state.oEditor && state.oEditor.getSelection()
        ? state.oEditor.getSelection().getSelectedElement()
        : null;
    if (!selectedImg || selectedImg.getName() !== 'img') return;
    const srcImg = selectedImg.getAttribute('src');
    if (typeof srcImg !== 'string' || !srcImg) return;
    openImageCrop({
        src: srcImg,
        onSave: (dataUrl) => {
            selectedImg.setAttribute('src', dataUrl);
            try { state.oEditor.fire('saveSnapshot'); } catch (e) { /* noop */ }
        }
    });
}
export function initDialogImageEditorPro() {
    /* Image edit uses shared/ui/image-crop — no CKEditor/Filerobot dialog. */
}
export function getDialogImageEditorPro() {
    /* no-op: openImageEditorPro opens image-crop directly */
}
export function pageImageBackground(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('pageImageBackground');
}
export function getDialogPageImageBackground() {
    var htmlImportFile =    `<label class="cke_dialog_ui_labeled_label">Importar imagem (PNG, JPG ou SVG)</label>
                            <div class="cke_dialog_ui_labeled_content cke_dialog_ui_input_file">
                                <input style="width:95%" id="fileInputImportImage" type="file" accept="image/*">
                            </div>`;

      CKEDITOR.dialog.add( 'pageImageBackground', function(editor)
      {
         return {
            title : 'Adicionar Image de Fundo e Configura\u00E7\u00F5es de P\u00E1gina para Impress\u00E3o',
            minWidth : 650,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                api.getImagePageBackground(true, function(src, config) { api.templateImagePageBackground(src, config) });
                event.data.hide = false;
            },
            onShow : function() {
                centralizeDialogBoxEditor();
                q('#'+CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoEscala')._.inputId).attr('type', 'number').attr('step','10').addClass('tipoEscala');
                q('#'+CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'textoCabecalho')._.inputId).addClass('textoCabecalho');
                q('#'+CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'textoRodape')._.inputId).addClass('textoRodape');
                q('.cke_dialog_page_contents').find('select').css('width','100%');
                q('#fileInputImportImage, .cke_dialog_page_contents input, .cke_dialog_page_contents select').on('change',function(){
                    let _this = q(this);
                    let val = _this.val();
                    let pageBox = q('#boxBgPreview');
                    let imgBox = q('#imgBgPreview');

                    api.getPreviewImagePageBackground();

                    if (val == 'landscape') {
                        pageBox.css({'width':'297px', 'height':'210px'});
                    } else if (val == 'portrait') {
                        pageBox.css({'height':'297px', 'width':'210px'});
                    } else if (val == 'letter') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'279.4px', 'width':'215.9px'});
                        else pageBox.css({'width':'279.4px', 'height':'215.9px'});
                    } else if (val == 'legal') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'356px', 'width':'216px'});
                        else pageBox.css({'width':'356px', 'height':'216px'});
                    } else if (val == 'tabloid') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'432px', 'width':'279px'});
                        else pageBox.css({'width':'432px', 'height':'279px'});
                    } else if (val == 'A4') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'297px', 'width':'210px'});
                        else pageBox.css({'width':'297px', 'height':'210px'});
                    } else if (val == 'A5') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'210px', 'width':'148px'});
                        else pageBox.css({'width':'210px', 'height':'148px'});
                    } else if (val == 'A3') {
                        if (pageBox.height() > pageBox.width()) pageBox.css({'height':'420px', 'width':'297px'});
                        else pageBox.css({'width':'420px', 'height':'297px'});
                    } else if (_this.hasClass('tipoEscala')) {
                        pageBox.find('p').css({'font-size': val+'%'});
                    } else if (_this.hasClass('tipoFonte')) {
                        pageBox.find('p').css({'font-family':val});
                    } else if (_this.hasClass('tipoPosicao')) {
                        imgBox.css({'background-position':val});
                    } else if (_this.hasClass('tipoDisposicao')) {
                        imgBox.css({'background-size':val});
                    } else if (_this.hasClass('tipoRepeticao')) {
                        imgBox.css({'background-repeat':val});
                    } else if (_this.hasClass('tipoUtilizacao')) {
                        if (val == 'page_cover') pageBox.find('p').css({'visibility':'hidden'});
                        else pageBox.find('p').css({'visibility':'visible'});
                    } else if (_this.hasClass('tipoPadding')) {
                        if (val == '3cm 2cm 3cm 2cm') {
                            imgBox.css({'padding':'30px 20px'});
                        } else if (val == '1cm 1cm 1cm 1cm') {
                            imgBox.css({'padding':'10px'});
                        } else {
                            imgBox.css({'padding':'0'});
                        }
                    } else if (_this.hasClass('tipoMargem')) {
                        if (val == '3cm 2cm 3cm 2cm') {
                            imgBox.css({'margin':'30px 20px'});
                        } else if (val == '1cm 1cm 1cm 1cm') {
                            imgBox.css({'margin':'10px'});
                        } else {
                            imgBox.css({'margin':'0'});
                        }
                    }
                    centralizeDialogBoxEditor();
                });
                if (verifyConfigValue('substituiselecao')) api.setChosenInCke();
                setTimeout(function () {
                    api.resetOptionsImgBg();
                }, 100);
            },
            contents :
            [
               {
                    id : 'tab1',
                    label : 'Impress\u00E3o',
                    elements :
                    [
                        {
                            type: 'hbox',
                            widths: ["100%"],
                            style: "margin-top:10px;",
                            children: [
                                {
                                    type: 'html',
                                    html: htmlImportFile
                                }
                            ]
                        },{
                            type: 'hbox',
                            widths: ["33%", "33%", "33%"],
                            children: [
                                {
                                    type: 'select',
                                    id: 'tipoLayout',
                                    className: 'tipoLayout',
                                    label: 'Layout',
                                    width: '200px',
                                    items: [ ['Paisagem', 'landscape'], [ 'Retrato', 'portrait' ] ],
                                    'default': 'portrait'
                                },{
                                    type: 'select',
                                    id: 'tipoPapel',
                                    className: 'tipoPapel',
                                    label: 'Tamanho do Papel',
                                    width: '200px',
                                    items: [ ['A5', 'A5'], ['A4', 'A4'], ['A3', 'A3'], ['Tabloid', 'tabloid'], ['Letter', 'letter'], ['Legal', 'legal'] ],
                                    'default': 'A4'
                                },{
                                    type: 'text',
                                    id: 'tipoEscala',
                                    className: 'tipoEscala',
                                    label: 'Escala (%)',
                                    width: '200px',
                                    'default': '100'
                                }
                            ]
                        },{
                            type: 'hbox',
                            widths: ["33%", "33%", "33%"],
                            children: [
                                {
                                    type: 'select',
                                    id: 'tipoMargem',
                                    className: 'tipoMargem',
                                    label: 'Margens Externas',
                                    width: '200px',
                                    items: [ ['Padr\u00E3o (3cm 2cm)', '3cm 2cm 3cm 2cm'], ['Nenhuma (0cm)', '0cm'], ['M\u00EDnima (1cm)', '1cm 1cm 1cm 1cm'] ],
                                    'default': '0cm'
                                },{
                                    type: 'select',
                                    id: 'tipoPadding',
                                    className: 'tipoPadding',
                                    label: 'Margens Internas',
                                    width: '200px',
                                    items: [ ['Padr\u00E3o (3cm 2cm)', '3cm 2cm 3cm 2cm'], ['Nenhuma (0cm)', '0cm'], ['M\u00EDnima (1cm)', '1cm 1cm 1cm 1cm'] ],
                                    'default': '3cm 2cm 3cm 2cm'
                                },{
                                    type: 'select',
                                    id: 'tipoFonte',
                                    className: 'tipoFonte',
                                    label: 'Fonte',
                                    width: '200px',
                                    items: [ ['Helvetica'], ['Arial'], ['Arial Black'], ['Calibri'], ['Verdana'], ['Tahoma'], ['Trebuchet MS'], ['Impact'], ['Gill Sans'], ['Times New Roman'], ['Georgia'], ['Palatino'], ['Baskerville'], ['Andal\u00E9 Mono'], ['Courier'], ['Lucida'], ['Monaco'], ['Bradley Hand'], ['Brush Script MT'], ['Luminari'], ['Comic Sans MS'] ],
                                    'default': 'Calibri'
                                }
                            ]
                        },{
                            type: 'hbox',
                            widths: ["33%", "33%", "33%"],
                            children: [
                                {
                                    type: 'select',
                                    id: 'tipoPosicao',
                                    className: 'tipoPosicao',
                                    label: 'Posi\u00E7\u00E3o da Imagem',
                                    width: '200px',
                                    items: [
                                        ['Topo Centralizada \u2238', 'top center'],
                                        ['Top Direito \u25F3', 'top right'],
                                        ['Top Esquerdo \u25F0', 'top left'],
                                        ['Inferior Centralizado \u2A66', 'bottom center'],
                                        ['Inferior Direito \u25F2', 'bottom right'],
                                        ['Inferior Esquerdo \u25F1', 'bottom left'],
                                        ['Meio Centralizada \u29C7'],
                                        ['Meio Direito \u27E5', 'center center'],
                                        ['Meio Esquerdo \u27E4', 'center left'] ],
                                    'default': 'top center'
                                },{
                                    type: 'select',
                                    id: 'tipoDisposicao',
                                    className: 'tipoDisposicao',
                                    label: 'Disposi\u00E7\u00E3o da Imagem',
                                    width: '200px',
                                    items: [ ['Capa (cover)', 'cover'], ['Contida (contain)', 'contain']],
                                    'default': 'contain'
                                },{
                                    type: 'select',
                                    id: 'tipoRepeticao',
                                    className: 'tipoRepeticao',
                                    label: 'Repeti\u00E7\u00E3o da Imagem',
                                    width: '200px',
                                    items: [ ['Sem repeti\u00E7\u00E3o', 'no-repeat'], ['Repeti\u00E7\u00E3o horizontal', 'repeat-x'], ['Repeti\u00E7\u00E3o vertical', 'repeat-y'], ['Repeti\u00E7\u00E3o vertical e horizontal', 'repeat'], ['Comprimida ou estivada', 'round'], ['Repeti\u00E7\u00E3o em corte', 'space']],
                                    'default': 'no-repeat'
                                }
                            ]
                        },{
                            type: 'hbox',
                            widths: ["33%", "33%", "33%"],
                            children: [
                                {
                                    type: 'select',
                                    id: 'tipoUtilizacao',
                                    className: 'tipoUtilizacao',
                                    label: 'Utiliza\u00E7\u00E3o da Imagem',
                                    width: '200px',
                                    items: [ ['Imagem de fundo', 'background'], ['Imagem como capa de livro', 'page_cover']],
                                    'default': 'background'
                                },{
                                    type: 'text',
                                    id: 'textoCabecalho',
                                    className: 'textoCabecalho',
                                    label: 'Texto do Cabe\u00E7alho',
                                    width: '200px',
                                    'default': ''
                                },{
                                    type: 'text',
                                    id: 'textoRodape',
                                    className: 'textoRodape',
                                    label: 'Texto do Rodap\u00E9',
                                    width: '200px',
                                    'default': ''
                                }
                            ]
                        },{
                            type: 'hbox',
                            widths: ["25%", "25%", "25%", "25%"],
                            children: [
                                {
                                    type: 'checkbox',
                                    id: 'visibleOnPrint',
                                    className: 'visibleOnPrint',
                                    'default': 'checked',
                                    label: 'Vis\u00EDvel apenas ao imprimir'
                                },{
                                    type: 'checkbox',
                                    id: 'onlyFirst',
                                    className: 'onlyFirst',
                                    'default': '',
                                    label: 'Aplicar apenas na primeira p\u00E1gina'
                                },{
                                    type: 'checkbox',
                                    id: 'reduceQualityImg',
                                    className: 'reduceQualityImg',
                                    'default': 'checked',
                                    label: 'Reduzir qualidade da imagem'
                                }
                            ]
                        },{
                            type: "html",
                            id: "imgpreview",
                            html: new CKEDITOR.template(
                                    `<div id="boxBgPreview" style="text-align: left; width: 210px; height: 297px; margin: 20px auto; border: 1px solid rgb(204, 204, 204); border-radius: 5px; box-shadow: rgb(219, 219, 219) 0px 6px 5px -5px; overflow: hidden; font-size: 100%;" class="cke_dialog_ui_html">
                                        <div id="imgBgPreview" style="padding: 30px 20px;"><p style="font-family: Calibri; color: rgb(119, 119, 119); font-size: 100%; white-space: pre-line;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut mi lacus. Nulla et metus finibus, pretium enim at, ultrices dui. Aliquam ut mauris convallis, eleifend orci quis, pulvinar augue. Aenean ultrices malesuada ante, non tempor sem placerat in. Nunc ultrices odio ut lorem gravida volutpat. Praesent sed arcu sollicitudin, molestie urna eget, consectetur nulla. Ut sed orci mollis, consequat tortor sed, congue leo.
                                        <br>Donec ac auctor libero, eu rutrum libero. Nunc sollicitudin felis tempor, convallis augue vitae, tincidunt elit. In quis volutpat erat. Phasellus feugiat purus porta libero vehicula sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam porttitor, diam quis pulvinar finibus, dolor risus convallis sem, eu pellentesque odio enim a arcu. Phasellus sem turpis, malesuada eget efficitur ornare, tristique in odio. Proin molestie tempus odio nec scelerisque. Pellentesque id faucibus libero, vel semper augue.
                                        <br>Sed convallis ante leo, eu rhoncus nisi dignissim a. Nullam convallis magna sed magna consectetur, nec gravida velit suscipit. Donec sit amet mi ut massa dapibus imperdiet nec quis eros. Vestibulum fringilla mattis metus at lobortis.</p>
                                        </div>
                                    </div>
                                    <a data-seipro-action="resetOptionsImgBg" class="linkDialog" style="float: right;margin-right: 20px;">Resetar configura\u00E7\u00F5es</a>`
                                ).output()
                        }
                    ]
                }
            ]
         };
      } );
}
export function getImagemBgOnEditor() {
    let imgBgAncora = state.iframeEditor.find('.imgBgAncora');
    let config = imgBgAncora.data();
        config = typeof config !== 'undefined' ? config : false;
    let styleText = imgBgAncora.find('style').text() || '';
    let src = styleText.match(/\((.*?)\)/);
        src = typeof src !== 'undefined' && src !== null ? src[1].replace(/('|")/g,'') : false;
    if (src) {
        q('#imgBgPreview').css('background-image', 'url("'+src+'")');
        q('#imgBgPreview').css('background-position', config?.posicao || 'center');
        q('#imgBgPreview').css('background-size', config?.disposicao || 'contain');
        q('#imgBgPreview').css('background-repeat', config?.repeticao || 'no-repeat');
    } else {
        q('#imgBgPreview').css('background-image', 'none');
    }
    return src;
}
export function resetOptionsImgBg() {
    let config = state.iframeEditor.find('.imgBgAncora').data();
        config = typeof config !== 'undefined' ? config : false;
    q('#fileInputImportImage').val('');
    q('.cke_dialog_page_contents .tipoLayout').val(config ? config.layout : 'portrait').trigger('change');
    q('.cke_dialog_page_contents .tipoPapel').val(config ? config.papel : 'A4').trigger('change');
    q('.cke_dialog_page_contents .tipoEscala').val(config ? config.escala : '100').trigger('change');
    q('.cke_dialog_page_contents .tipoMargem').val(config ? config.margem : '0cm').trigger('change');
    q('.cke_dialog_page_contents .tipoPadding').val(config ? config.padding : '3cm 2cm 3cm 2cm').trigger('change');
    q('.cke_dialog_page_contents .tipoFonte').val(config ? config.fonte : 'Calibri').trigger('change');
    q('.cke_dialog_page_contents .tipoPosicao').val(config ? config.posicao : 'top center').trigger('change');
    q('.cke_dialog_page_contents .tipoDisposicao').val(config ? config.disposicao : 'contain').trigger('change');
    q('.cke_dialog_page_contents .textoCabecalho').val(config ? config.cabecalho : '').trigger('change');
    q('.cke_dialog_page_contents .textoRodape').val(config ? config.rodape : '').trigger('change');
    q('.cke_dialog_page_contents .visibleOnPrint').prop('checked',config ? config.visivel : true);
    q('.cke_dialog_page_contents .onlyFirst').prop('checked',config ? config.primeirapg : false);
    q('.cke_dialog_page_contents .reduceQualityImg').prop('checked',config ? config.reducao : true);
    q('.cke_dialog_page_contents .tipoRepeticao').val(config ? config.repeticao : 'no-repeat').trigger('change');
    q('.cke_dialog_page_contents .tipoUtilizacao').val(config ? config.utilizacao : 'background').trigger('change');
    api.getImagemBgOnEditor();
    api.setChosenInCke();
    api.getPreviewImagePageBackground();
}
export function getPreviewImagePageBackground() {
    let elem = q('#imgBgPreview');
    api.getImagePageBackground(false, function(src, config){
        elem.css({
            // 'font-family': config.fonte,
            // 'background-position': config.posicao,
            // 'background-size': config.disposicao,
            // 'background-repeat': config.repeticao,
            'background-image': 'url("'+src+'")'
        });
    });
}
export function getImagePageBackground(insert = false, callback = false) {
    var src = api.getImagemBgOnEditor();
    var importImage = document.getElementById('fileInputImportImage').files;
    var visibleOnPrint = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'visibleOnPrint').getValue();
    var onlyFirst = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'onlyFirst').getValue();
    var reduceQualityImg = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'reduceQualityImg').getValue();
    var tipoLayout = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoLayout').getValue();
    var tipoPapel = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoPapel').getValue();
    var tipoMargem = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoMargem').getValue();
    var tipoPadding = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoPadding').getValue();
    var tipoEscala = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoEscala').getValue();
    var tipoFonte = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoFonte').getValue();
    var tipoPosicao = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoPosicao').getValue();
    var tipoDisposicao = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoDisposicao').getValue();
    var tipoRepeticao = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoRepeticao').getValue();
    var tipoUtilizacao = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoUtilizacao').getValue();
    var textoCabecalho = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'textoCabecalho').getValue();
    var textoRodape = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'textoRodape').getValue();

    if (importImage.length) {
        api.loadImagePageBackground(importImage[0], {
            primeirapg: onlyFirst,
            cabecalho: textoCabecalho,
            rodape: textoRodape,
            visivel: visibleOnPrint,
            reducao: reduceQualityImg,
            layout: tipoLayout,
            papel: tipoPapel,
            margem: tipoMargem,
            padding: tipoPadding,
            escala: tipoEscala,
            fonte: tipoFonte,
            posicao: tipoPosicao,
            disposicao: tipoDisposicao,
            utilizacao: tipoUtilizacao,
            repeticao: tipoRepeticao
        }, callback);
    } else if (insert && src) {
        api.templateImagePageBackground(src, {
            primeirapg: onlyFirst,
            cabecalho: textoCabecalho,
            rodape: textoRodape,
            visivel: visibleOnPrint,
            reducao: reduceQualityImg,
            layout: tipoLayout,
            papel: tipoPapel,
            margem: tipoMargem,
            padding: tipoPadding,
            escala: tipoEscala,
            fonte: tipoFonte,
            posicao: tipoPosicao,
            disposicao: tipoDisposicao,
            utilizacao: tipoUtilizacao,
            repeticao: tipoRepeticao
        });
    }
}
export function loadImagePageBackground(item, config, callback = false) {
    var reader = new FileReader();
        reader.onload = function (evt) {
            var element = state.oEditor.document.createElement('img', {
                attributes: {
                    src: evt.target.result,
                    class: 'img-base64'
                }
            });

            if (state.qualidadeImagens > 0 && config.reducao) qualityImages(element.$, element.$);
            // We use a timeout callback to prevent a bug where insertElement inserts at first caret position
            setTimeout(function () {
                var src = config.reducao ? q(element).attr('src') : evt.target.result;
                if (typeof callback === 'function') callback(src, config);
            }, 10);
        };
        reader.readAsDataURL(item);
}
export function templateImagePageBackground(src, config){
    var imgBgAncora = state.iframeEditor.find('.imgBgAncora');
    var config_cabecalho = config.cabecalho == '' ? `` : `body:before {
                                                            display: block;
                                                            position: fixed;
                                                            text-align: center;
                                                            content: "${config.cabecalho}";
                                                            top: 0.5cm;
                                                            width: 100%;
                                                            color: #717171;
                                                            font-size: 8pt;
                                                            font-family: Calibri;
                                                        }`;
    var config_rodape = config.rodape == '' ? `` : `body:after {
                                                        display: block;
                                                        position: fixed;
                                                        text-align: center;
                                                        content: "${config.rodape}";
                                                        bottom: 0.5cm;
                                                        width: 100%;
                                                        color: #717171;
                                                        font-size: 8pt;
                                                        font-family: Calibri;
                                                    }`;
    var config_capa = config.utilizacao == 'page_cover' && config.papel == 'A4' && config.layout == 'landscape' ? 'padding-top: 21cm !important;' : '';
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'A4' && config.layout == 'portrait' ? 'padding-top: 29.7cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'letter' && config.layout == 'landscape' ? 'padding-top: 21.59cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'letter' && config.layout == 'portrait' ? 'padding-top: 27.94cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'legal' && config.layout == 'landscape' ? 'padding-top: 21.6cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'legal' && config.layout == 'portrait' ? 'padding-top: 35.6cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'tabloid' && config.layout == 'landscape' ? 'padding-top: 27.9cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'tabloid' && config.layout == 'portrait' ? 'padding-top: 43.2cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'A5' && config.layout == 'landscape' ? 'padding-top: 14.8cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'A5' && config.layout == 'portrait' ? 'padding-top: 21cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'A3' && config.layout == 'landscape' ? 'padding-top: 29.7cm !important;' : config_capa;
        config_capa = config.utilizacao == 'page_cover' && config.papel == 'A3' && config.layout == 'portrait' ? 'padding-top: 42cm !important;' : config_capa;

    var title = q('td[class*="cke_dialog_ui_hbox"]').map(function(){
                    let input = q(this).find('select').length ? q(this).find('select option:selected').text() : '';
                        input = q(this).find('input.cke_dialog_ui_input_text').length ? q(this).find('input.cke_dialog_ui_input_text').val() : input;
                        input = q(this).find('input[type="checkbox"]').length ? ( q(this).find('input[type="checkbox"]').is(':checked') ? 'Sim' : 'N\u00E3o') : input;
                        if (input != '') return q(this).find('label').text()+': '+input.trim();
                }).get().join('\n');

    var htmlBgPage = `<p class="Tabela_Texto_Alinhado_Esquerda">
                        <span class="imgBgAncora" title="${title}" contenteditable="false" data-cabecalho="${config.cabecalho}" data-rodape="${config.rodape}" data-primeirapg="${config.primeirapg}" data-visivel="${config.visivel}" data-reducao="${config.reducao}" data-layout="${config.layout}" data-papel="${config.papel}" data-margem="${config.margem}" data-padding="${config.padding}" data-escala="${config.escala}" data-fonte="${config.fonte}" data-posicao="${config.posicao}" data-disposicao="${config.disposicao}" data-utilizacao="${config.utilizacao}" data-repeticao="${config.repeticao}">
                            <a class="ancoraSei" contenteditable="false" style="text-indent:0;">
                                <style data-style="seipro-imagebg-print" type="text/css">
                                    .imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }
                                    html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }
                                    body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }
                                    @media print {
                                        @page`+(config.primeirapg ? `:first` : ``)+` {
                                                size: ${config.papel} ${config.layout};
                                                margin: ${config.margem};
                                            }
                                        `+(config.visivel ? `` : `}`)+`
                                            body p,
                                            body p * {
                                                font-size: ${config.escala}% !important;
                                                font-family: ${config.fonte} !important;
                                            }
                                            .imgBgAncora { display: none; }
                                            body {
                                                padding: ${config.padding};
                                                ${config_capa}
                                                background-position: ${config.posicao};
                                                background-size: ${config.disposicao};
                                                background-repeat: ${config.repeticao};
                                                background-image: url("${src}");
                                            }
                                            ${config_cabecalho}
                                            ${config_rodape}
                                        `+(config.visivel ? `}` : ``)+`
                                </style>
                                \uD83D\uDDA8\uFE0F * CONFIGURA\u00C7\u00D5ES DE IMPRESS\u00C3O
                            </a>
                        </span>
                    </p>`;
            state.oEditor.focus();
            storeCursorLocation(state.oEditor);
            state.oEditor.fire('saveSnapshot');
            if (imgBgAncora.length) imgBgAncora.closest('p').remove();
            state.iframeEditor.find('body').prepend(htmlBgPage);
            oEditor.fire('saveSnapshot');
            // restoreCursorLocation(state.oEditor);
            enableButtonSavePro();

        var imgBgAncora_new = state.iframeEditor.find('.imgBgAncora');
            imgBgAncora_new.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            imgBgAncora_new.get(0).scrollIntoView();
}
api.hideLinkTips = hideLinkTips;
api.showLinkTips = showLinkTips;
api.openImageEditorPro = openImageEditorPro;
api.initDialogImageEditorPro = initDialogImageEditorPro;
api.getDialogImageEditorPro = getDialogImageEditorPro;
api.pageImageBackground = pageImageBackground;
api.getDialogPageImageBackground = getDialogPageImageBackground;
api.getImagemBgOnEditor = getImagemBgOnEditor;
api.resetOptionsImgBg = resetOptionsImgBg;
api.getPreviewImagePageBackground = getPreviewImagePageBackground;
api.getImagePageBackground = getImagePageBackground;
api.loadImagePageBackground = loadImagePageBackground;
api.templateImagePageBackground = templateImagePageBackground;
