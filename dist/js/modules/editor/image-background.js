/**
 * SEI Pro - Editor Feature: image-background
 *
 * Imagem de fundo de pagina e configuracoes de pagina para impressao.
 * Entrada: pageImageBackground (botao da toolbar 'pageImageBackgroundButtom').
 * Abre um dialogo (jQuery UI via SeiProEditorAdapter.openDialog) com:
 *   - Upload de imagem (PNG/JPG/SVG)
 *   - Selects de layout/papel/escala/margens/fonte/posicao/disposicao/
 *     repeticao/utilizacao + textos de cabecalho/rodape + checkboxes
 *   - Preview visual ao vivo da pagina
 * Ao confirmar, injeta no inicio do corpo do documento um paragrafo com a
 * ancora .imgBgAncora contendo um <style> com regras @media print/@page que
 * aplicam a imagem de fundo e configuracoes na impressao.
 *
 * Portado do monolito sei-pro-editor.js (CK4) para o contrato do adapter
 * (CK4/CK5). O antigo CKEDITOR.dialog (.cke_dialog_page_contents,
 * CKEDITOR.dialog.getCurrent().getContentElement) foi substituido por um
 * dialogo jQuery UI cujos campos sao lidos por id dentro do $box. A insercao
 * no corpo usa transformBodyHtml/getBodyContainer/findInBody do adapter.
 *
 * NOTA (SEI 5 / CK5): o bloco depende de um <style> com @page/@media print
 * embutido no corpo. O DataSchema do CK5 conhece <style> (htmlStyle, raw
 * content), entao ele sobrevive desde que o GHS esteja liberado -- ver
 * ghs-unlock.js. O que NAO sobrevive e o resto da estrutura antiga: <span>
 * sem liberacao do GHS, <a> sem href e contenteditable="false" sao todos
 * descartados no upcast.
 *
 * O efeito colateral disso e a armadilha principal deste modulo: o downcast do
 * <style> e writer.createRawElement -- um elemento invisivel e sem widget. Um
 * <p> que fique so com o <style> tem altura zero, nao aceita cursor e nao pode
 * ser apagado; o documento parece travado naquele ponto. Por isso o rotulo
 * visivel (ROTULO_ANCORA) vem antes do <style> e normalizeImgBgAncora()
 * reconstroi o rotulo em documentos que ja foram salvos sem ele.
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js,
 * chamados apenas em tempo de clique): setParamEditor, verifyConfigValue,
 * setChosenInCke, qualityImages, alertaBoxPro, sanitizeHTML, enableButtonSavePro.
 * Globais compartilhados: qualidadeImagens.
 */
(function () {
    'use strict';

    // Rotulo visivel da ancora. NAO e decorativo: no CK5 o <style> vira um raw
    // element (writer.createRawElement) invisivel e sem widget, entao um <p>
    // que so contenha o <style> fica com altura zero -- nao da para clicar,
    // editar nem apagar. O rotulo e o que mantem o paragrafo alcancavel.
    var ROTULO_ANCORA = '\uD83D\uDDA8\uFE0F * CONFIGURA\u00C7\u00D5ES DE IMPRESS\u00C3O';
    var TITULO_RECUPERADO = 'Configura\u00E7\u00F5es de impress\u00E3o (r\u00F3tulo recuperado pelo SEI Pro)';
    var SELETOR_STYLE = 'style[data-style="seipro-imagebg-print"]';

    // ----------------------------------------------------------------
    // Texto de preview (lorem ipsum) usado no quadro de pre-visualizacao.
    // ----------------------------------------------------------------
    var LOREM_PREVIEW =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut mi lacus. '
        + 'Nulla et metus finibus, pretium enim at, ultrices dui. Aliquam ut mauris convallis, '
        + 'eleifend orci quis, pulvinar augue. Aenean ultrices malesuada ante, non tempor sem '
        + 'placerat in. Nunc ultrices odio ut lorem gravida volutpat. Praesent sed arcu '
        + 'sollicitudin, molestie urna eget, consectetur nulla. Ut sed orci mollis, consequat '
        + 'tortor sed, congue leo.'
        + '<br>Donec ac auctor libero, eu rutrum libero. Nunc sollicitudin felis tempor, '
        + 'convallis augue vitae, tincidunt elit. In quis volutpat erat. Phasellus feugiat purus '
        + 'porta libero vehicula sodales. Pellentesque habitant morbi tristique senectus et netus '
        + 'et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis '
        + 'in faucibus.'
        + '<br>Sed convallis ante leo, eu rhoncus nisi dignissim a. Nullam convallis magna sed '
        + 'magna consectetur, nec gravida velit suscipit. Donec sit amet mi ut massa dapibus '
        + 'imperdiet nec quis eros. Vestibulum fringilla mattis metus at lobortis.';

    // Referencia ao editor "ativo" para a sessao do dialogo (substitui o oEditor
    // global do monolito). Setada ao abrir o dialogo via pageImageBackground().
    var _editor = null;

    // ----------------------------------------------------------------
    // Entrada da feature: clique no botao da toolbar. PORTE real para CK5
    // (o monolito so exibia um alerta de "em migracao").
    // ----------------------------------------------------------------
    window.pageImageBackground = function (this_) {
        if (typeof setParamEditor === 'function') setParamEditor(this_);
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) {
            if (typeof alertaBoxPro === 'function') {
                alertaBoxPro('Aten\u00E7\u00E3o', 'exclamation-circle', 'Editor n\u00E3o encontrado.');
            }
            return;
        }
        _editor = editor;
        openDialogPageImageBackground(editor);
    };

    // Mantemos o nome antigo para compatibilidade com initFunctions() -- o
    // registro de dialogo CK4 nao existe mais; o dialogo eh on-demand abaixo.
    window.getDialogPageImageBackground = function () { /* no-op: dialogo on-demand */ };

    // ----------------------------------------------------------------
    // Monta e abre o dialogo (jQuery UI). Substitui CKEDITOR.dialog.add.
    // ----------------------------------------------------------------
    window.openDialogPageImageBackground = function (editor) {
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        _editor = editor;

        var optsLayout =
            '<option value="landscape">Paisagem</option>'
            + '<option value="portrait" selected>Retrato</option>';
        var optsPapel =
            '<option value="A5">A5</option>'
            + '<option value="A4" selected>A4</option>'
            + '<option value="A3">A3</option>'
            + '<option value="tabloid">Tabloid</option>'
            + '<option value="letter">Letter</option>'
            + '<option value="legal">Legal</option>';
        var optsMargem =
            '<option value="3cm 2cm 3cm 2cm">Padr\u00E3o (3cm 2cm)</option>'
            + '<option value="0cm" selected>Nenhuma (0cm)</option>'
            + '<option value="1cm 1cm 1cm 1cm">M\u00EDnima (1cm)</option>';
        var optsPadding =
            '<option value="3cm 2cm 3cm 2cm" selected>Padr\u00E3o (3cm 2cm)</option>'
            + '<option value="0cm">Nenhuma (0cm)</option>'
            + '<option value="1cm 1cm 1cm 1cm">M\u00EDnima (1cm)</option>';
        var fontes = ['Helvetica', 'Arial', 'Arial Black', 'Calibri', 'Verdana', 'Tahoma',
            'Trebuchet MS', 'Impact', 'Gill Sans', 'Times New Roman', 'Georgia', 'Palatino',
            'Baskerville', 'Andal\u00E9 Mono', 'Courier', 'Lucida', 'Monaco', 'Bradley Hand',
            'Brush Script MT', 'Luminari', 'Comic Sans MS'];
        var optsFonte = fontes.map(function (f) {
            return '<option value="' + f + '"' + (f === 'Calibri' ? ' selected' : '') + '>' + f + '</option>';
        }).join('');
        var optsPosicao =
            '<option value="top center" selected>Topo Centralizada \u2238</option>'
            + '<option value="top right">Top Direito \u25F3</option>'
            + '<option value="top left">Top Esquerdo \u25F0</option>'
            + '<option value="bottom center">Inferior Centralizado \u2A66</option>'
            + '<option value="bottom right">Inferior Direito \u25F2</option>'
            + '<option value="bottom left">Inferior Esquerdo \u25F1</option>'
            + '<option value="center center">Meio Direito \u27E5</option>'
            + '<option value="center left">Meio Esquerdo \u27E4</option>';
        var optsDisposicao =
            '<option value="cover">Capa (cover)</option>'
            + '<option value="contain" selected>Contida (contain)</option>';
        var optsRepeticao =
            '<option value="no-repeat" selected>Sem repeti\u00E7\u00E3o</option>'
            + '<option value="repeat-x">Repeti\u00E7\u00E3o horizontal</option>'
            + '<option value="repeat-y">Repeti\u00E7\u00E3o vertical</option>'
            + '<option value="repeat">Repeti\u00E7\u00E3o vertical e horizontal</option>'
            + '<option value="round">Comprimida ou estivada</option>'
            + '<option value="space">Repeti\u00E7\u00E3o em corte</option>';
        var optsUtilizacao =
            '<option value="background" selected>Imagem de fundo</option>'
            + '<option value="page_cover">Imagem como capa de livro</option>';

        var rawHtml =
            '<div class="dialogBoxDiv seipro-imgbg" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">'
            + '<style>'
            + '.seipro-imgbg, .seipro-imgbg * { box-sizing:border-box; font-size:13px; }'
            + '.seipro-imgbg label.fld { display:block; font-size:12px; color:#555; margin-bottom:2px; }'
            + '.seipro-imgbg input[type="text"], .seipro-imgbg input[type="number"], .seipro-imgbg select { width:100%; font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; }'
            + '.seipro-imgbg .row { display:flex; gap:10px; margin-top:8px; }'
            + '.seipro-imgbg .row > div { flex:1; }'
            + '.seipro-imgbg .chkrow { display:flex; gap:16px; margin-top:10px; flex-wrap:wrap; }'
            + '.seipro-imgbg .chkrow label { font-size:12px; color:#444; }'
            + '.seipro-imgbg .linkDialog { float:right; margin-right:10px; cursor:pointer; color:#0000ee; text-decoration:underline; font-size:12px; }'
            + '</style>'
            + '<div class="row" style="margin-top:0;">'
            + '<div>'
            + '<label class="fld">Importar imagem (PNG, JPG ou SVG)</label>'
            + '<input type="file" id="fileInputImportImage" accept="image/*" style="width:100%;">'
            + '</div>'
            + '</div>'
            + '<div class="row">'
            + '<div><label class="fld">Layout</label><select id="tipoLayout" class="tipoLayout">' + optsLayout + '</select></div>'
            + '<div><label class="fld">Tamanho do Papel</label><select id="tipoPapel" class="tipoPapel">' + optsPapel + '</select></div>'
            + '<div><label class="fld">Escala (%)</label><input type="number" step="10" id="tipoEscala" class="tipoEscala" value="100"></div>'
            + '</div>'
            + '<div class="row">'
            + '<div><label class="fld">Margens Externas</label><select id="tipoMargem" class="tipoMargem">' + optsMargem + '</select></div>'
            + '<div><label class="fld">Margens Internas</label><select id="tipoPadding" class="tipoPadding">' + optsPadding + '</select></div>'
            + '<div><label class="fld">Fonte</label><select id="tipoFonte" class="tipoFonte">' + optsFonte + '</select></div>'
            + '</div>'
            + '<div class="row">'
            + '<div><label class="fld">Posi\u00E7\u00E3o da Imagem</label><select id="tipoPosicao" class="tipoPosicao">' + optsPosicao + '</select></div>'
            + '<div><label class="fld">Disposi\u00E7\u00E3o da Imagem</label><select id="tipoDisposicao" class="tipoDisposicao">' + optsDisposicao + '</select></div>'
            + '<div><label class="fld">Repeti\u00E7\u00E3o da Imagem</label><select id="tipoRepeticao" class="tipoRepeticao">' + optsRepeticao + '</select></div>'
            + '</div>'
            + '<div class="row">'
            + '<div><label class="fld">Utiliza\u00E7\u00E3o da Imagem</label><select id="tipoUtilizacao" class="tipoUtilizacao">' + optsUtilizacao + '</select></div>'
            + '<div><label class="fld">Texto do Cabe\u00E7alho</label><input type="text" id="textoCabecalho" class="textoCabecalho" value=""></div>'
            + '<div><label class="fld">Texto do Rodap\u00E9</label><input type="text" id="textoRodape" class="textoRodape" value=""></div>'
            + '</div>'
            + '<div class="chkrow">'
            + '<label><input type="checkbox" id="visibleOnPrint" class="visibleOnPrint" checked> Vis\u00EDvel apenas ao imprimir</label>'
            + '<label><input type="checkbox" id="onlyFirst" class="onlyFirst"> Aplicar apenas na primeira p\u00E1gina</label>'
            + '<label><input type="checkbox" id="reduceQualityImg" class="reduceQualityImg" checked> Reduzir qualidade da imagem</label>'
            + '</div>'
            + '<div id="boxBgPreview" style="text-align:left;width:210px;height:297px;margin:18px auto;border:1px solid rgb(204,204,204);border-radius:5px;box-shadow:rgb(219,219,219) 0px 6px 5px -5px;overflow:hidden;font-size:100%;">'
            + '<div id="imgBgPreview" style="padding:30px 20px;"><p style="font-family:Calibri;color:rgb(119,119,119);font-size:100%;white-space:pre-line;">' + LOREM_PREVIEW + '</p></div>'
            + '</div>'
            + '<a class="linkDialog" id="resetImgBgLink">Resetar configura\u00E7\u00F5es</a>'
            + '<div style="clear:both;"></div>'
            + '</div>';

        var htmlBox = (typeof sanitizeHTML === 'function') ? sanitizeHTML(rawHtml) : rawHtml;

        SeiProEditorAdapter.openDialog({
            id: 'dialogPageImageBackground',
            title: 'Adicionar Imagem de Fundo e Configura\u00E7\u00F5es de P\u00E1gina para Impress\u00E3o',
            html: htmlBox,
            width: 680,
            height: 620,
            onOpen: function ($box) {
                // Cada alteracao recalcula o preview e o quadro de pagina.
                $box.find('#fileInputImportImage, input, select').on('change', function () {
                    onChangeImgBg($box, $(this), editor);
                });
                $box.find('#resetImgBgLink').on('click', function () {
                    resetOptionsImgBg($box, editor);
                });
                if (typeof verifyConfigValue === 'function'
                    && verifyConfigValue('substituiselecao')
                    && typeof setChosenInCke === 'function') {
                    try { setChosenInCke(); } catch (e) {}
                }
                setTimeout(function () { resetOptionsImgBg($box, editor); }, 100);
            },
            buttons: [{
                text: 'OK',
                primary: true,
                click: function ($box) {
                    getImagePageBackground($box, editor, true, function (src, config) {
                        templateImagePageBackground(src, config, editor);
                    });
                    try { $box.dialog('close'); } catch (e) {}
                }
            }, {
                text: 'Cancelar',
                click: function ($box) { try { $box.dialog('close'); } catch (e) {} }
            }]
        });
    };

    // ----------------------------------------------------------------
    // Handler de "change" de qualquer campo: atualiza o preview da pagina e
    // da imagem (substitui o onShow().on('change') do CK4). Recebe o $box do
    // dialogo e o $elemento que disparou.
    // ----------------------------------------------------------------
    function onChangeImgBg($box, $this, editor) {
        var val = $this.val();
        var pageBox = $box.find('#boxBgPreview');
        var imgBox = $box.find('#imgBgPreview');

        getPreviewImagePageBackground($box, editor);

        if (val == 'landscape') {
            pageBox.css({ 'width': '297px', 'height': '210px' });
        } else if (val == 'portrait') {
            pageBox.css({ 'height': '297px', 'width': '210px' });
        } else if (val == 'letter') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '279.4px', 'width': '215.9px' });
            else pageBox.css({ 'width': '279.4px', 'height': '215.9px' });
        } else if (val == 'legal') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '356px', 'width': '216px' });
            else pageBox.css({ 'width': '356px', 'height': '216px' });
        } else if (val == 'tabloid') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '432px', 'width': '279px' });
            else pageBox.css({ 'width': '432px', 'height': '279px' });
        } else if (val == 'A4') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '297px', 'width': '210px' });
            else pageBox.css({ 'width': '297px', 'height': '210px' });
        } else if (val == 'A5') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '210px', 'width': '148px' });
            else pageBox.css({ 'width': '210px', 'height': '148px' });
        } else if (val == 'A3') {
            if (pageBox.height() > pageBox.width()) pageBox.css({ 'height': '420px', 'width': '297px' });
            else pageBox.css({ 'width': '420px', 'height': '297px' });
        } else if ($this.hasClass('tipoEscala')) {
            pageBox.find('p').css({ 'font-size': val + '%' });
        } else if ($this.hasClass('tipoFonte')) {
            pageBox.find('p').css({ 'font-family': val });
        } else if ($this.hasClass('tipoPosicao')) {
            imgBox.css({ 'background-position': val });
        } else if ($this.hasClass('tipoDisposicao')) {
            imgBox.css({ 'background-size': val });
        } else if ($this.hasClass('tipoRepeticao')) {
            imgBox.css({ 'background-repeat': val });
        } else if ($this.hasClass('tipoUtilizacao')) {
            if (val == 'page_cover') pageBox.find('p').css({ 'visibility': 'hidden' });
            else pageBox.find('p').css({ 'visibility': 'visible' });
        } else if ($this.hasClass('tipoPadding')) {
            if (val == '3cm 2cm 3cm 2cm') imgBox.css({ 'padding': '30px 20px' });
            else if (val == '1cm 1cm 1cm 1cm') imgBox.css({ 'padding': '10px' });
            else imgBox.css({ 'padding': '0' });
        } else if ($this.hasClass('tipoMargem')) {
            if (val == '3cm 2cm 3cm 2cm') imgBox.css({ 'margin': '30px 20px' });
            else if (val == '1cm 1cm 1cm 1cm') imgBox.css({ 'margin': '10px' });
            else imgBox.css({ 'margin': '0' });
        }
    }

    // ----------------------------------------------------------------
    // Le a ancora .imgBgAncora ja existente no corpo do documento e devolve o
    // src da imagem de fundo (data-uri), aplicando-o ao preview. Recebe o $box
    // (preview) e o editor. Substitui iframeEditor.find('.imgBgAncora').
    // ----------------------------------------------------------------
    // O <style> da ancora fica dentro do <span> no CK4, mas no CK5 o <span>
    // vira atributo de texto e o <style> um elemento proprio -- a serializacao
    // os separa e eles viram irmaos dentro do mesmo <p>. Procura nos dois
    // lugares e, em ultimo caso, pelo data-style no corpo inteiro.
    function cssDaAncora(editor, $ancora) {
        try {
            if ($ancora && $ancora.length) {
                var el = $ancora.get(0);
                var style = el.querySelector('style');
                if (!style && el.closest) {
                    var p = el.closest('p');
                    if (p) style = p.querySelector('style');
                }
                if (style) return style.textContent || '';
            }
            var $solto = SeiProEditorAdapter.findInBody(editor, SELETOR_STYLE);
            if ($solto && $solto.length) return $solto.get(0).textContent || '';
        } catch (e) {}
        return '';
    }

    window.getImagemBgOnEditor = function ($box, editor) {
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        var $ancora = SeiProEditorAdapter.findInBody(editor, '.imgBgAncora');
        var config = ($ancora && $ancora.length) ? $ancora.data() : false;
            config = (typeof config !== 'undefined') ? config : false;
        var src = cssDaAncora(editor, $ancora).match(/\((.*?)\)/);
            src = (typeof src !== 'undefined' && src !== null) ? src[1].replace(/('|")/g, '') : false;

        var $imgPrev = ($box && $box.find) ? $box.find('#imgBgPreview') : $('#imgBgPreview');
        if (src) {
            $imgPrev.css('background-image', 'url("' + src + '")');
            if (config) {
                $imgPrev.css('background-position', config.posicao);
                $imgPrev.css('background-size', config.disposicao);
                $imgPrev.css('background-repeat', config.repeticao);
            }
        } else {
            $imgPrev.css('background-image', 'none');
        }
        return src;
    };

    // ----------------------------------------------------------------
    // Restaura os campos do dialogo com os valores da config ja aplicada no
    // documento (ou os defaults). Recebe o $box do dialogo e o editor.
    // ----------------------------------------------------------------
    window.resetOptionsImgBg = function ($box, editor) {
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        $box = ($box && $box.find) ? $box : $('#dialogPageImageBackground');
        var $ancora = SeiProEditorAdapter.findInBody(editor, '.imgBgAncora');
        var config = ($ancora && $ancora.length) ? $ancora.data() : false;
            config = (typeof config !== 'undefined') ? config : false;

        $box.find('#fileInputImportImage').val('');
        $box.find('.tipoLayout').val(config ? config.layout : 'portrait').trigger('change');
        $box.find('.tipoPapel').val(config ? config.papel : 'A4').trigger('change');
        $box.find('.tipoEscala').val(config ? config.escala : '100').trigger('change');
        $box.find('.tipoMargem').val(config ? config.margem : '0cm').trigger('change');
        $box.find('.tipoPadding').val(config ? config.padding : '3cm 2cm 3cm 2cm').trigger('change');
        $box.find('.tipoFonte').val(config ? config.fonte : 'Calibri').trigger('change');
        $box.find('.tipoPosicao').val(config ? config.posicao : 'top center').trigger('change');
        $box.find('.tipoDisposicao').val(config ? config.disposicao : 'contain').trigger('change');
        $box.find('.textoCabecalho').val(config ? config.cabecalho : '').trigger('change');
        $box.find('.textoRodape').val(config ? config.rodape : '').trigger('change');
        $box.find('.visibleOnPrint').prop('checked', config ? config.visivel : true);
        $box.find('.onlyFirst').prop('checked', config ? config.primeirapg : false);
        $box.find('.reduceQualityImg').prop('checked', config ? config.reducao : true);
        $box.find('.tipoRepeticao').val(config ? config.repeticao : 'no-repeat').trigger('change');
        $box.find('.tipoUtilizacao').val(config ? config.utilizacao : 'background').trigger('change');
        getImagemBgOnEditor($box, editor);
        if (typeof setChosenInCke === 'function') { try { setChosenInCke(); } catch (e) {} }
        getPreviewImagePageBackground($box, editor);
    };

    // ----------------------------------------------------------------
    // Atualiza apenas o background-image do preview (le do upload ou da ancora).
    // ----------------------------------------------------------------
    window.getPreviewImagePageBackground = function ($box, editor) {
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        $box = ($box && $box.find) ? $box : $('#dialogPageImageBackground');
        var elem = $box.find('#imgBgPreview');
        getImagePageBackground($box, editor, false, function (src) {
            elem.css({ 'background-image': 'url("' + src + '")' });
        });
    };

    // ----------------------------------------------------------------
    // Coleta os valores dos campos do dialogo; se ha imagem para upload, a
    // carrega (loadImagePageBackground); senao, se insert+src ja existe,
    // re-monta o template. Substitui CKEDITOR.dialog.getCurrent()...getValue().
    // ----------------------------------------------------------------
    window.getImagePageBackground = function ($box, editor, insert, callback) {
        insert = insert || false;
        callback = callback || false;
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        $box = ($box && $box.find) ? $box : $('#dialogPageImageBackground');

        var src = getImagemBgOnEditor($box, editor);
        var importInput = $box.find('#fileInputImportImage')[0];
        var importImage = importInput ? importInput.files : [];

        var config = {
            primeirapg: $box.find('.onlyFirst').is(':checked'),
            cabecalho: $box.find('.textoCabecalho').val(),
            rodape: $box.find('.textoRodape').val(),
            visivel: $box.find('.visibleOnPrint').is(':checked'),
            reducao: $box.find('.reduceQualityImg').is(':checked'),
            layout: $box.find('.tipoLayout').val(),
            papel: $box.find('.tipoPapel').val(),
            margem: $box.find('.tipoMargem').val(),
            padding: $box.find('.tipoPadding').val(),
            escala: $box.find('.tipoEscala').val(),
            fonte: $box.find('.tipoFonte').val(),
            posicao: $box.find('.tipoPosicao').val(),
            disposicao: $box.find('.tipoDisposicao').val(),
            utilizacao: $box.find('.tipoUtilizacao').val(),
            repeticao: $box.find('.tipoRepeticao').val()
        };

        if (importImage && importImage.length) {
            loadImagePageBackground(importImage[0], config, callback);
        } else if (insert && src) {
            templateImagePageBackground(src, config, editor);
        } else if (!insert && src && typeof callback === 'function') {
            // Preview sem upload: usa o src ja existente na ancora.
            callback(src, config);
        }
    };

    // ----------------------------------------------------------------
    // Le o arquivo importado como data-uri; opcionalmente reduz a qualidade
    // (qualityImages, helper compartilhado, opera sobre um <img> DOM solto) e
    // entrega o src final ao callback. Substitui oEditor.document.createElement.
    // ----------------------------------------------------------------
    window.loadImagePageBackground = function (item, config, callback) {
        callback = callback || false;
        var reader = new FileReader();
        reader.onload = function (evt) {
            var raw = evt.target.result;
            var qualidade = (typeof qualidadeImagens !== 'undefined') ? qualidadeImagens : 0;
            if (qualidade > 0 && config.reducao && typeof qualityImages === 'function') {
                // qualityImages le naturalWidth/Height e escreve dst.src de forma
                // assincrona (onload do Image interno). Usamos um <img> DOM solto
                // como origem e destino, depois lemos o src reduzido.
                var imgEl = document.createElement('img');
                imgEl.className = 'img-base64';
                imgEl.onload = function () {
                    try { qualityImages(imgEl, imgEl); } catch (e) {}
                    setTimeout(function () {
                        var srcOut = imgEl.getAttribute('src') || raw;
                        if (typeof callback === 'function') callback(srcOut, config);
                    }, 60);
                };
                imgEl.src = raw;
            } else {
                setTimeout(function () {
                    if (typeof callback === 'function') callback(raw, config);
                }, 10);
            }
        };
        reader.readAsDataURL(item);
    };

    // ----------------------------------------------------------------
    // Monta o paragrafo .imgBgAncora (com <style> @page/@media print) e o
    // injeta no INICIO do corpo do documento, removendo a ancora anterior.
    // Substitui iframeEditor.find('body').prepend(...) por transformBodyHtml.
    // ----------------------------------------------------------------
    window.templateImagePageBackground = function (src, config, editor) {
        editor = editor || _editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var config_cabecalho = config.cabecalho == '' ? '' :
            'body:before {'
            + ' display: block; position: fixed; text-align: center;'
            + ' content: "' + config.cabecalho + '";'
            + ' top: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }';
        var config_rodape = config.rodape == '' ? '' :
            'body:after {'
            + ' display: block; position: fixed; text-align: center;'
            + ' content: "' + config.rodape + '";'
            + ' bottom: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }';

        var config_capa = '';
        var coverMap = {
            'A4 landscape': '21cm', 'A4 portrait': '29.7cm',
            'letter landscape': '21.59cm', 'letter portrait': '27.94cm',
            'legal landscape': '21.6cm', 'legal portrait': '35.6cm',
            'tabloid landscape': '27.9cm', 'tabloid portrait': '43.2cm',
            'A5 landscape': '14.8cm', 'A5 portrait': '21cm',
            'A3 landscape': '29.7cm', 'A3 portrait': '42cm'
        };
        if (config.utilizacao == 'page_cover') {
            var key = config.papel + ' ' + config.layout;
            if (coverMap[key]) config_capa = 'padding-top: ' + coverMap[key] + ' !important;';
        }

        // Titulo da ancora: resumo legivel das opcoes (substitui o map sobre
        // td.cke_dialog_ui_hbox do CK4). Reconstruido a partir da config.
        var titleParts = [
            'Layout: ' + (config.layout == 'portrait' ? 'Retrato' : 'Paisagem'),
            'Tamanho do Papel: ' + config.papel,
            'Escala (%): ' + config.escala,
            'Margens Externas: ' + config.margem,
            'Margens Internas: ' + config.padding,
            'Fonte: ' + config.fonte,
            'Posi\u00E7\u00E3o da Imagem: ' + config.posicao,
            'Disposi\u00E7\u00E3o da Imagem: ' + config.disposicao,
            'Repeti\u00E7\u00E3o da Imagem: ' + config.repeticao,
            'Utiliza\u00E7\u00E3o da Imagem: ' + (config.utilizacao == 'page_cover' ? 'Imagem como capa de livro' : 'Imagem de fundo')
        ];
        if (config.cabecalho) titleParts.push('Texto do Cabe\u00E7alho: ' + config.cabecalho);
        if (config.rodape) titleParts.push('Texto do Rodap\u00E9: ' + config.rodape);
        titleParts.push('Vis\u00EDvel apenas ao imprimir: ' + (config.visivel ? 'Sim' : 'N\u00E3o'));
        titleParts.push('Aplicar apenas na primeira p\u00E1gina: ' + (config.primeirapg ? 'Sim' : 'N\u00E3o'));
        titleParts.push('Reduzir qualidade da imagem: ' + (config.reducao ? 'Sim' : 'N\u00E3o'));
        var title = titleParts.join('\n');

        var styleCss =
            '.imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }'
            + ' html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }'
            + ' body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }'
            + ' @media print {'
            + '   @page' + (config.primeirapg ? ':first' : '') + ' { size: ' + config.papel + ' ' + config.layout + '; margin: ' + config.margem + '; }'
            + (config.visivel ? '' : ' }')
            + '   body p, body p * { font-size: ' + config.escala + '% !important; font-family: ' + config.fonte + ' !important; }'
            + '   .imgBgAncora { display: none; }'
            + '   body { padding: ' + config.padding + '; ' + config_capa
            + ' background-position: ' + config.posicao + '; background-size: ' + config.disposicao + ';'
            + ' background-repeat: ' + config.repeticao + '; background-image: url("' + src + '"); }'
            + '   ' + config_cabecalho
            + '   ' + config_rodape
            + (config.visivel ? ' }' : '');

        // Estrutura pensada para sobreviver ao upcast do CK5:
        //  - o rotulo vem ANTES do <style>, para o paragrafo ter conteudo
        //    visivel mesmo que o <style> seja filtrado;
        //  - sem <a class="ancoraSei"> (link sem href nao sobrevive e nao
        //    servia para nada aqui) e sem contenteditable (o CK5 descarta);
        //  - o <style> fica como irmao do <span>, que e como o CK5 serializa
        //    de qualquer forma (o <span> vira atributo de texto no model).
        var htmlBgPage =
            '<p class="Tabela_Texto_Alinhado_Esquerda">'
            + '<span class="imgBgAncora" title="' + title.replace(/"/g, '&quot;') + '"'
            + ' data-cabecalho="' + config.cabecalho + '" data-rodape="' + config.rodape + '"'
            + ' data-primeirapg="' + config.primeirapg + '" data-visivel="' + config.visivel + '"'
            + ' data-reducao="' + config.reducao + '" data-layout="' + config.layout + '"'
            + ' data-papel="' + config.papel + '" data-margem="' + config.margem + '"'
            + ' data-padding="' + config.padding + '" data-escala="' + config.escala + '"'
            + ' data-fonte="' + config.fonte + '" data-posicao="' + config.posicao + '"'
            + ' data-disposicao="' + config.disposicao + '" data-utilizacao="' + config.utilizacao + '"'
            + ' data-repeticao="' + config.repeticao + '">'
            + ROTULO_ANCORA
            + '</span>'
            + '<style data-style="seipro-imagebg-print" type="text/css">' + styleCss + '</style>'
            + '</p>';

        SeiProEditorAdapter.focus(editor);
        SeiProEditorAdapter.saveSnapshot(editor);

        // Remove ancora anterior (e seu <p>) e injeta a nova no inicio do corpo.
        // transformBodyHtml serializa o corpo, faz a manipulacao via DOMParser e
        // re-aplica (em CK5 isso usa editor.data.set na root do "Corpo do Texto").
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
            var body = doc.body;
            var prev = body.querySelector('.imgBgAncora');
            if (prev) {
                var p = prev.closest('p');
                (p || prev).remove();
            }
            // Sobras de documentos salvos antes da liberacao do GHS: o <span>
            // da ancora era descartado no upcast e o <style> ficava orfao num
            // paragrafo invisivel. Remove o paragrafo inteiro.
            var orfaos = body.querySelectorAll(SELETOR_STYLE);
            for (var i = 0; i < orfaos.length; i++) {
                var po = orfaos[i].closest ? orfaos[i].closest('p') : null;
                (po || orfaos[i]).remove();
            }
            body.insertAdjacentHTML('afterbegin', htmlBgPage);
            return body.innerHTML;
        });

        SeiProEditorAdapter.saveSnapshot(editor);
        if (typeof enableButtonSavePro === 'function') enableButtonSavePro();

        // Feedback visual: pisca a ancora recem-inserida e rola ate ela.
        setTimeout(function () {
            var $nova = SeiProEditorAdapter.findInBody(editor, '.imgBgAncora');
            if ($nova && $nova.length) {
                try { $nova.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100); } catch (e) {}
                try { $nova.get(0).scrollIntoView(); } catch (e) {}
            }
        }, 0);
    };

    // ----------------------------------------------------------------
    // Conserto de ancoras orfas (documentos salvos antes da liberacao do GHS).
    //
    // Sintoma: o <p> da ancora ficou so com o <style>, que no CK5 e um raw
    // element invisivel -- o paragrafo tem altura zero, nao aceita cursor e
    // nao da para apagar. A correcao devolve o rotulo visivel ao paragrafo,
    // preservando o <style> (e a impressao) como esta.
    // ----------------------------------------------------------------
    function ehAncoraOrfa(p) {
        if (!p || !p.querySelector) return false;
        if (p.querySelector('.imgBgAncora')) return false;
        if (!p.querySelector('style')) return false;
        // O texto do proprio <style> conta em textContent: remove antes de
        // decidir se sobrou algo visivel no paragrafo.
        var clone = p.cloneNode(true);
        var styles = clone.querySelectorAll('style');
        for (var i = 0; i < styles.length; i++) styles[i].parentNode.removeChild(styles[i]);
        return (clone.textContent || '').replace(/[\s\u00A0]/g, '') === '';
    }

    function temAncoraOrfa(editor) {
        var $styles = SeiProEditorAdapter.findInBody(editor, 'style');
        if (!$styles || !$styles.length) return false;
        var achou = false;
        $styles.each(function () {
            if (achou) return;
            if (ehAncoraOrfa(this.closest ? this.closest('p') : null)) achou = true;
        });
        return achou;
    }

    window.normalizeImgBgAncora = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor || !temAncoraOrfa(editor)) return false;

        var aplicar = function () {
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
                var body = doc.body;
                var styles = body.querySelectorAll('p > style');
                for (var i = 0; i < styles.length; i++) {
                    var p = styles[i].parentNode;
                    if (!ehAncoraOrfa(p)) continue;
                    p.insertAdjacentHTML('afterbegin',
                        '<span class="imgBgAncora" title="' + TITULO_RECUPERADO + '">' + ROTULO_ANCORA + '</span>');
                }
                return body.innerHTML;
            });
        };

        // Correcao na abertura do documento nao pode deixar o botao Salvar do
        // SEI piscando como se o usuario tivesse editado algo.
        if (window.SeiProGhs && SeiProGhs.semSujar) SeiProGhs.semSujar(aplicar, editor);
        else aplicar();

        return true;
    };

    // Boot: so depois do ghs-unlock liberar o GHS -- sem isso o <span> do
    // rotulo seria descartado no upcast e o conserto nao teria efeito.
    if (window.SeiProEditorAdapter && SeiProEditorAdapter.waitReady) {
        SeiProEditorAdapter.waitReady(20000).then(function (editor) {
            if (SeiProEditorAdapter.version !== 5) return;
            editor = editor || SeiProEditorAdapter.getInstance();
            var tentativas = 15;
            (function esperarGhs() {
                if (window.SeiProGhs && SeiProGhs.estaLiberado(editor)) {
                    window.normalizeImgBgAncora(editor);
                    return;
                }
                if (--tentativas <= 0) return;
                setTimeout(esperarGhs, 200);
            })();
        })['catch'](function () {});
    }

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'image-background' });
})();
