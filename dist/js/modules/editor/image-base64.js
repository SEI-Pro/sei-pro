/**
 * SEI Pro - Editor Feature: image-base64
 *
 * Upload de imagem como base64 (arquivo local, multiplos arquivos com
 * drag-and-drop, ou URL) e insercao no documento do editor (CK4/CK5).
 *
 * Entrada (mantida por compat com o monolito):
 *   - initDialogUploadImgBase64(): boot hook (chamado por initFunctions via
 *     tryRun). No CK4 nao registra mais o CKEDITOR.dialog (a feature passou a
 *     usar dialogo jQuery UI on-demand); no CK5 e no-op.
 *   - openDialogUploadImgBase64(editor): abre o dialogo (jQuery UI via adapter)
 *     de upload/propriedades de imagem. E o ponto chamado pela integracao de
 *     contexto/doubleclick de imagem.
 *   - getDialogUploadImgBase64(): no-op (dialogo on-demand).
 *
 * Portado do monolito sei-pro-editor.js. O antigo CKEDITOR.dialog.add
 * ("base64imageDialog") foi substituido por SeiProEditorAdapter.openDialog,
 * lendo os inputs por id dentro do $box. A insercao usa insertElement /
 * insertHtml do adapter (pipeline view->model no CK5, insertElement no CK4).
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js,
 * usados apenas em tempo de clique/boot): qualidadeImagens (var), isDarkMode
 * (var), qualityImages, isBase64, getBase64Image, isValidHttpUrl,
 * infraFormatarTamanhoBytes, randomString, checkConfigValue, alertaBoxPro.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Boot hook. No SEI 3.1/4 o monolito chamava getDialogUploadImgBase64()
    // (CKEDITOR.dialog.add). Agora o dialogo e on-demand (jQuery UI via
    // adapter), entao este boot hook so existe para preservar a chamada de
    // initFunctions/tryRun. Idempotente; seguro em CK4 e CK5.
    // ----------------------------------------------------------------
    window.initDialogUploadImgBase64 = function () {
        if (typeof checkConfigValue === 'function' && checkConfigValue('editarimagens')) {
            getDialogUploadImgBase64();
        }
    };

    // Mantido por compat com initFunctions(): o dialogo agora e on-demand,
    // aberto em openDialogUploadImgBase64(). No-op em CK4 e CK5.
    window.getDialogUploadImgBase64 = function () { /* no-op: dialogo on-demand */ };

    // ----------------------------------------------------------------
    // Abre o dialogo de upload/propriedades de imagem. Funciona em CK4 e CK5
    // (jQuery UI via SeiProEditorAdapter.openDialog). Se a imagem selecionada
    // for um <img>, os campos sao pre-preenchidos a partir dela.
    //
    // Compat de assinatura: o monolito chamava openDialogUploadImgBase64(editor),
    // onde editor era ora a instancia, ora um elemento DOM (this_). Resolvemos
    // a instancia pelo adapter se nao vier uma instancia valida.
    // ----------------------------------------------------------------
    window.openDialogUploadImgBase64 = function (editorOrRef) {
        var editor = (editorOrRef && (editorOrRef.model || editorOrRef.insertElement || editorOrRef.getSelection))
            ? editorOrRef
            : SeiProEditorAdapter.getInstance(editorOrRef);
        if (!editor) return;

        var fsupport = fileSupportBase64();
        var defaultQuality = (typeof qualidadeImagens !== 'undefined') ? qualidadeImagens : 60;
        var dark = (typeof isDarkMode !== 'undefined') ? isDarkMode : false;

        // Imagem atualmente selecionada (se houver). No CK4/CK5 usamos o
        // elemento DOM apontado pela selecao via adapter.
        var selectedImg = resolveSelectedImg(editor);

        // Estado por instancia do dialogo (substitui as closures do CK4).
        var state = { imgScal: 1, lock: true };

        var sourceHtml = fsupport
            ? '<div style="margin-bottom:8px;">'
                + '  <label style="display:block;margin-bottom:4px;"><input type="checkbox" id="b64_filecheckbox" checked> Navegar neste computador:</label>'
                + '  <div class="dropFilePro" id="b64_dropzone" style="border:1px dashed #ccc;border-radius:10px;background:#f2f2f2;padding:24px 12px;text-align:center;color:#999;font-size:13pt;cursor:pointer;'
                + (dark ? 'filter:invert(1) brightness(1.5);' : '') + '">'
                + '    Arraste arquivos para c\u00E1 ou clique para selecionar'
                + '    <input type="file" id="b64_file" accept="image/*" multiple style="display:none;">'
                + '  </div>'
                + '</div>'
                + '<div style="margin-bottom:8px;">'
                + '  <label style="display:block;margin-bottom:4px;"><input type="checkbox" id="b64_urlcheckbox"> URL da Imagem:</label>'
                + '  <input type="text" id="b64_url" style="width:100%;box-sizing:border-box;">'
                + '</div>'
            : '<div style="margin-bottom:8px;">'
                + '  <label style="display:block;margin-bottom:4px;">URL da Imagem:</label>'
                + '  <input type="text" id="b64_url" style="width:100%;box-sizing:border-box;">'
                + '</div>';

        var htmlBox =
            '<div class="dialogBoxDiv seipro-b64-dialog" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">'
            + '<style>'
            + '.seipro-b64-dialog, .seipro-b64-dialog * { box-sizing:border-box; }'
            + '.seipro-b64-dialog .seiProTabs .ui-tabs-anchor { padding:6px 12px; font-size:12px; }'
            + '.seipro-b64-dialog label { font-size:12px; color:#555; }'
            + '.seipro-b64-dialog input[type="text"], .seipro-b64-dialog input[type="number"], .seipro-b64-dialog select { font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; }'
            + '.seipro-b64-dialog .b64-grid { display:flex; gap:8px; margin-bottom:8px; }'
            + '.seipro-b64-dialog .b64-grid > div { flex:1; }'
            + '.seipro-b64-dialog .previewImage { cursor:move; max-width:400px; max-height:100px; float:left; margin:5px; }'
            + '</style>'
            + '<div id="b64Tabs" class="seiProTabs">'
            + '  <ul>'
            + '    <li><a href="#b64TabSource">Imagem</a></li>'
            + '    <li><a href="#b64TabProps">Propriedades</a></li>'
            + '  </ul>'
            + '  <div id="b64TabSource">'
            + sourceHtml
            + '    <div id="b64_loading" style="text-align:center;color:#999;"></div>'
            + '    <div id="b64_preview" class="dropFilePro" style="text-align:center;max-width:700px;min-height:20px;"></div>'
            + '  </div>'
            + '  <div id="b64TabProps">'
            + '    <div style="margin-bottom:8px;"><label>Texto Alternativo</label><br><input type="text" id="b64_alt" style="width:100%;"></div>'
            + '    <div class="b64-grid">'
            + '      <div><label>Largura</label><br><input type="text" id="b64_width" style="width:100%;"></div>'
            + '      <div><label>Altura</label><br><input type="text" id="b64_height" style="width:100%;"></div>'
            + '      <div style="display:flex;align-items:flex-end;"><label><input type="checkbox" id="b64_lock" checked> Travar Propor\u00E7\u00F5es</label></div>'
            + '    </div>'
            + '    <div class="b64-grid">'
            + '      <div><label>Margem Vertical</label><br><input type="text" id="b64_vmargin" value="0" style="width:100%;"></div>'
            + '      <div><label>Margem Horizontal</label><br><input type="text" id="b64_hmargin" value="0" style="width:100%;"></div>'
            + '      <div><label>Borda</label><br><input type="text" id="b64_border" value="0" style="width:100%;"></div>'
            + '    </div>'
            + '    <div class="b64-grid">'
            + '      <div><label>Largura M\u00E1xima</label><br><input type="text" id="b64_maxwidth" value="0" style="width:100%;"></div>'
            + '      <div><label>Altura M\u00E1xima</label><br><input type="text" id="b64_maxheight" value="0" style="width:100%;"></div>'
            + '      <div><label>Alinhamento</label><br><select id="b64_align" style="width:100%;">'
            + '        <option value="none">N\u00E3o definido</option>'
            + '        <option value="top">Superior</option>'
            + '        <option value="bottom">Inferior</option>'
            + '        <option value="left">Esquerda</option>'
            + '        <option value="right">Direita</option>'
            + '      </select></div>'
            + '    </div>'
            + '    <div class="b64-grid">'
            + '      <div><label>Qualidade da Imagem (1 = baixa / 100 = alta)</label><br><input type="number" id="b64_quality" min="1" max="100" value="' + defaultQuality + '" style="width:100%;"></div>'
            + '      <div><label>Filtro</label><br><select id="b64_filter" style="width:100%;">'
            + '        <option value="none">N\u00E3o definido</option>'
            + '        <option value="grayscale">Escala de Cinza</option>'
            + '        <option value="blur">Borrado</option>'
            + '        <option value="shadow">Caixa Sombreada</option>'
            + '        <option value="invert">Cores Invertidas</option>'
            + '        <option value="sepia">Envelhecido</option>'
            + '      </select></div>'
            + '      <div id="b64_imglength" style="text-align:left;font-size:12px;align-self:flex-end;"></div>'
            + '    </div>'
            + '  </div>'
            + '</div>'
            + '</div>';

        SeiProEditorAdapter.openDialog({
            id: 'dialogUploadImgBase64Pro',
            title: 'Imagem',
            html: htmlBox,
            width: 760,
            height: 'auto',
            onOpen: function ($box) {
                var $tabs = $box.find('#b64Tabs');
                if ($tabs.tabs) $tabs.tabs();

                // Dropzone: clique abre o seletor de arquivos.
                $box.find('#b64_dropzone').on('click', function (e) {
                    if (e.target && e.target.id === 'b64_file') return;
                    $box.find('#b64_file').trigger('click');
                });
                // Drag-and-drop sobre a dropzone.
                $box.find('#b64_dropzone')
                    .on('dragover', function (e) { e.preventDefault(); e.stopPropagation(); })
                    .on('drop', function (e) {
                        e.preventDefault(); e.stopPropagation();
                        var dt = e.originalEvent && e.originalEvent.dataTransfer;
                        if (dt && dt.files && dt.files.length) handleFiles($box, dt.files);
                    });
                $box.find('#b64_file').on('change', function () {
                    if (this.files && this.files.length) handleFiles($box, this.files);
                });
                $box.find('#b64_url').on('change blur', function () {
                    var v = ($(this).val() || '').trim();
                    if (v) imagePreviewLoad($box, v);
                });

                // Travar proporcoes e proporcionalidade largura/altura.
                $box.find('#b64_lock').on('change', function () {
                    state.lock = !!this.checked;
                    if (state.lock) imageDimensions($box, state, 'width');
                });
                $box.find('#b64_width').on('keyup', function () { if (state.lock) imageDimensions($box, state, 'width'); });
                $box.find('#b64_height').on('keyup', function () { if (state.lock) imageDimensions($box, state, 'height'); });
                $box.find('#b64_vmargin, #b64_hmargin, #b64_border, #b64_maxwidth, #b64_maxheight')
                    .on('keyup', function () { integerValue($(this)); });

                // Pre-preenche a partir da imagem selecionada (se houver).
                if (selectedImg) {
                    prefillFromImage($box, selectedImg, state);
                    $tabs.tabs && $tabs.tabs('option', 'active', 1);
                }
            },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    insertImagesFromPreview($box, editor, selectedImg);
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    };

    // ----------------------------------------------------------------
    // Helpers privados da feature (eram funcoes aninhadas no CK4 dialog).
    // ----------------------------------------------------------------

    // Suporte a FileReader / input file.
    function fileSupportBase64() {
        try {
            if (typeof FileReader !== 'undefined' && FileReader) {
                var n = document.createElement('input');
                if (n && ('files' in n)) return true;
            }
        } catch (e) {}
        return false;
    }

    // Resolve o <img> atualmente selecionado no editor (ou null).
    function resolveSelectedImg(editor) {
        var el = SeiProEditorAdapter.getSelectionElement(editor);
        if (el && el.tagName && el.tagName.toLowerCase() === 'img') return el;
        // Fallback: cursor logo apos/dentro de um wrapper de imagem.
        if (el && el.querySelector) {
            var inner = el.querySelector('img');
            if (inner) return inner;
        }
        return null;
    }

    // Le os arquivos de imagem e gera previews base64.
    function handleFiles($box, files) {
        if (!files || !files.length) return;
        $box.find('#b64_loading').text('Carregando...');
        var list = Array.prototype.slice.call(files);
        list.forEach(function (f) {
            if (f && f.type && !/image.*/.test(f.type)) return;
            if (typeof FileReader === 'undefined') return;
            var fr = new FileReader();
            fr.onload = function (e) {
                $box.find('#b64_loading').text('');
                imagePreviewLoad($box, e.target.result);
            };
            fr.onerror = function () { $box.find('#b64_loading').text(''); };
            fr.onabort = function () { $box.find('#b64_loading').text(''); };
            try { fr.readAsDataURL(f); } catch (e2) {}
        });
    }

    // Carrega e exibe a imagem na area de preview. Se nao for base64,
    // converte via getBase64Image (helper compartilhado).
    function imagePreviewLoad($box, src) {
        if (typeof src !== 'string' || !src) {
            $box.find('#b64_loading').text('');
            return;
        }
        var $preview = $box.find('#b64_preview');
        var i = new Image();
        $box.find('#b64_loading').text('Carregando...');
        i.onload = function () {
            $box.find('#b64_loading').text('');
            // Se largura/altura ainda nao foram setadas, usa o tamanho natural.
            if (!$box.find('#b64_width').val()) $box.find('#b64_width').val(this.width);
            if (!$box.find('#b64_height').val()) $box.find('#b64_height').val(this.height);

            var $i = $(this);
            $i.addClass('previewImage').attr('alt', '');
            if (!$i.attr('data-width')) $i.attr('data-width', this.width);
            if (!$i.attr('data-height')) $i.attr('data-height', this.height);

            // Anexa via API DOM (sem innerHTML): a imagem ja e um node criado.
            try { $preview.get(0).appendChild(this); } catch (e) {}
        };
        i.onerror = function () { $box.find('#b64_loading').text(''); };
        i.onabort = function () { $box.find('#b64_loading').text(''); };
        i.src = src;
        if (typeof isBase64 === 'function' && !isBase64(src) && typeof getBase64Image === 'function') {
            try { getBase64Image($(i)); } catch (e) {}
        }
    }

    // Le as dimensoes atuais (com unidade) dos campos width/height.
    function getImageDimensions($box) {
        var o = {
            w: ($box.find('#b64_width').val() || '').toString(),
            h: ($box.find('#b64_height').val() || '').toString(),
            uw: 'px', uh: 'px'
        };
        if (o.w.indexOf('%') >= 0) o.uw = '%';
        if (o.h.indexOf('%') >= 0) o.uh = '%';
        o.w = parseInt(o.w, 10); if (isNaN(o.w)) o.w = 0;
        o.h = parseInt(o.h, 10); if (isNaN(o.h)) o.h = 0;
        return o;
    }

    // Recalcula largura/altura mantendo a proporcao (imgScal).
    function imageDimensions($box, state, src) {
        var o = getImageDimensions($box);
        var u = 'px';
        if (src === 'width') {
            if (o.uw === '%') u = '%';
            o.h = Math.round(o.w / state.imgScal);
        } else {
            if (o.uh === '%') u = '%';
            o.w = Math.round(o.h * state.imgScal);
        }
        var wOut = o.w, hOut = o.h;
        if (u === '%') { wOut = o.w + '%'; hOut = o.h + '%'; }
        $box.find('#b64_width').val(wOut);
        $box.find('#b64_height').val(hOut);
    }

    // Normaliza um campo para inteiro (preservando sufixo "%").
    function integerValue($elem) {
        var v = ($elem.val() || '').toString(), u = '';
        if (v.indexOf('%') >= 0) u = '%';
        v = parseInt(v, 10);
        if (isNaN(v)) v = 0;
        $elem.val(v + u);
    }

    // Pre-preenche os campos do dialogo a partir da imagem selecionada.
    function prefillFromImage($box, img, state) {
        var $img = $(img);

        // Tamanho do arquivo (base64) -> bytes.
        var src = img.getAttribute && img.getAttribute('src');
        if (typeof src === 'string' && src.indexOf('data:') === 0) {
            try {
                var base64strImg = src.substring(src.indexOf(',') + 1);
                var decoded = atob(base64strImg);
                if (typeof infraFormatarTamanhoBytes === 'function') {
                    $box.find('#b64_imglength').text('Tamanho da imagem: ' + infraFormatarTamanhoBytes(decoded.length));
                }
            } catch (e) {}
        }

        var orgWidth = $img.attr('width');
        var orgHeight = $img.attr('height');
        if ((orgWidth == null || orgHeight == null) && img.naturalWidth) {
            orgWidth = img.width || img.naturalWidth;
            orgHeight = img.height || img.naturalHeight;
        }
        if (orgWidth != null && orgHeight != null) {
            $box.find('#b64_width').val(orgWidth);
            $box.find('#b64_height').val(orgHeight);
            var w = parseInt(orgWidth, 10), h = parseInt(orgHeight, 10);
            state.imgScal = 1;
            if (!isNaN(w) && !isNaN(h) && h > 0 && w > 0) state.imgScal = w / h;
            if (state.imgScal <= 0) state.imgScal = 1;
        }

        if (typeof src === 'string') {
            if (src.indexOf('data:') === 0) imagePreviewLoad($box, src);
            else $box.find('#b64_url').val(src);
        }

        setIf($box, '#b64_alt', $img.attr('alt'));
        setIf($box, '#b64_hmargin', $img.attr('hspace'));
        setIf($box, '#b64_vmargin', $img.attr('vspace'));
        setIf($box, '#b64_border', $img.attr('border'));
        setIf($box, '#b64_maxwidth', $img.attr('maxwidth'));
        setIf($box, '#b64_maxheight', $img.attr('maxheight'));
        setIf($box, '#b64_filter', $img.attr('filter'));

        var q = $img.attr('quality');
        if (typeof q === 'string' && q !== '') {
            $box.find('#b64_quality').val(parseInt(parseFloat(q) * 100, 10));
        }

        var align = $img.attr('align');
        if (typeof align === 'string') {
            switch (align) {
                case 'top': case 'text-top': $box.find('#b64_align').val('top'); break;
                case 'baseline': case 'bottom': case 'text-bottom': $box.find('#b64_align').val('bottom'); break;
                case 'left': $box.find('#b64_align').val('left'); break;
                case 'right': $box.find('#b64_align').val('right'); break;
            }
        }
    }

    function setIf($box, sel, value) {
        if (typeof value === 'string' && value !== '') $box.find(sel).val(value);
    }

    // Constroi um objeto com src + atributos + style a partir dos campos do
    // dialogo. NAO retorna HTML: a montagem do elemento e feita via API DOM
    // (document.createElement) em applyImgInsertion, evitando innerHTML.
    function buildImgSpecFromPreview($box, previewImg, selectedImg) {
        var src = $(previewImg).attr('src');
        if (typeof src !== 'string' || src === '') return null;

        var dataW = $(previewImg).attr('data-width');
        var dataH = $(previewImg).attr('data-height');

        var spec = { src: src, attrs: {}, css: [] };

        var alt = ($box.find('#b64_alt').val() || '').replace(/^\s+/, '').replace(/\s+$/, '');
        spec.attrs.alt = alt;

        // mapa: id-no-dialogo -> [nome-atributo, template-css, tipo, minimo]
        var attr = {
            width:     ['width', 'width:#;', 'integer', 1],
            height:    ['height', 'height:#;', 'integer', 1],
            maxwidth:  ['maxwidth', 'max-width:#;object-fit: contain;', 'integer', 1],
            maxheight: ['maxheight', 'max-height:#;object-fit: contain;', 'integer', 1],
            vmargin:   ['vspace', 'margin-top:#;margin-bottom:#;', 'integer', 0],
            hmargin:   ['hspace', 'margin-left:#;margin-right:#;', 'integer', 0],
            align:     ['align', ''],
            filter:    ['filter', ''],
            border:    ['border', 'border:# solid black;', 'integer', 0]
        };

        var setMaxWidth = false, setMaxHeight = false;

        for (var k in attr) {
            if (!attr.hasOwnProperty(k)) continue;
            var value = ($box.find('#b64_' + k).val() || '').toString();
            var attrvalue = value, cssvalue = value, unit = 'px';

            if (k === 'align') {
                switch (value) {
                    case 'top': case 'bottom': attr[k][1] = 'vertical-align:#;'; break;
                    case 'left': case 'right': attr[k][1] = 'float:#;'; break;
                    default: value = null; break;
                }
            } else if (k === 'filter') {
                switch (value) {
                    case 'grayscale': attr[k][1] = 'filter:grayscale(1);'; break;
                    case 'blur': attr[k][1] = 'filter:blur(3px);'; break;
                    case 'shadow': attr[k][1] = 'filter:drop-shadow(2px 4px 6px black);'; break;
                    case 'invert': attr[k][1] = 'filter:invert(1);'; break;
                    case 'sepia': attr[k][1] = 'filter:sepia(1);'; break;
                    default: value = null; break;
                }
            }

            if (attr[k][2] === 'integer') {
                if (value && value.indexOf('%') >= 0) unit = '%';
                value = parseInt(value, 10);
                if (isNaN(value)) value = null;
                else if (value < attr[k][3]) value = null;
                if (value != null) {
                    if (unit === '%') { attrvalue = value + '%'; cssvalue = value + '%'; }
                    else { attrvalue = value; cssvalue = value + 'px'; }
                }
            }

            if (value != null) {
                if (k === 'width' && dataW && !selectedImg) {
                    spec.attrs.width = dataW;
                } else if (k === 'height' && dataH && !selectedImg) {
                    spec.attrs.height = dataH;
                } else {
                    spec.attrs[attr[k][0]] = attrvalue;
                    spec.css.push(attr[k][1].replace(/#/g, cssvalue));
                    if (k === 'maxwidth') setMaxWidth = true;
                    if (k === 'maxheight') setMaxHeight = true;
                }
            }
        }

        // max-width descarta height; max-height descarta width (espelha o monolito).
        if (setMaxWidth) delete spec.attrs.height;
        if (setMaxHeight) delete spec.attrs.width;

        // Qualidade da imagem (atributo quality, base 0..1).
        var qualidadeAtual = (typeof qualidadeImagens !== 'undefined') ? qualidadeImagens : 60;
        var quality = ($box.find('#b64_quality').val() || '').toString();
        var q = (quality !== '') ? parseInt(quality, 10) * 0.01 : (qualidadeAtual * 0.01);
        if (q > 100) q = 100; if (q < 0) q = 0;
        if (qualidadeAtual > 0) spec.attrs.quality = q;

        return spec;
    }

    // Cria o elemento <img> a partir da spec via API DOM (sem innerHTML) e
    // serializa para HTML para a insercao via adapter (insertElement/insertHtml).
    function specToImgHtml(spec) {
        var img = document.createElement('img');
        img.setAttribute('src', spec.src);
        for (var name in spec.attrs) {
            if (!spec.attrs.hasOwnProperty(name)) continue;
            var v = spec.attrs[name];
            if (v == null || v === '') {
                if (name === 'alt') img.setAttribute('alt', '');
                continue;
            }
            img.setAttribute(name, String(v));
        }
        if (spec.css.length) img.setAttribute('style', spec.css.join(''));
        return img.outerHTML;
    }

    // Insere as imagens de preview no editor. Se houver imagem selecionada,
    // atualiza os atributos dela; caso contrario, insere novas. So insere
    // imagens que NAO sejam URLs http (base64/local), espelhando o onOk do
    // monolito.
    function insertImagesFromPreview($box, editor, selectedImg) {
        var previews = $box.find('#b64_preview img.previewImage');
        // Sem preview (ex.: so URL preenchida sem carregar) -> tenta a URL.
        if (!previews.length) {
            var url = ($box.find('#b64_url').val() || '').trim();
            if (url) {
                var imgUrl = document.createElement('img');
                imgUrl.setAttribute('src', url);
                var specUrl = buildImgSpecFromPreview($box, imgUrl, selectedImg);
                if (specUrl) applyImgInsertion(editor, specUrl, selectedImg);
            }
            return;
        }

        previews.each(function () {
            var src = $(this).attr('src');
            if (typeof isValidHttpUrl === 'function' && isValidHttpUrl(src)) return; // pula URLs http puras
            var spec = buildImgSpecFromPreview($box, this, selectedImg);
            if (spec) applyImgInsertion(editor, spec, selectedImg);
        });
    }

    // Aplica a insercao/atualizacao no editor via adapter (CK4/CK5).
    function applyImgInsertion(editor, spec, selectedImg) {
        SeiProEditorAdapter.withEdit(editor, function () {
            if (selectedImg && selectedImg.setAttribute) {
                // Atualiza a imagem selecionada in-place (sem innerHTML). Em CK5
                // a mudanca de atributo no editable e reconciliada pelo modelo.
                selectedImg.setAttribute('src', spec.src);
                for (var name in spec.attrs) {
                    if (!spec.attrs.hasOwnProperty(name)) continue;
                    var v = spec.attrs[name];
                    if (v == null || v === '') continue;
                    selectedImg.setAttribute(name, String(v));
                }
                if (spec.css.length) selectedImg.setAttribute('style', spec.css.join(''));
            } else {
                SeiProEditorAdapter.insertElement(editor, specToImgHtml(spec));
            }
        });

        // Aplica compressao via helper compartilhado, quando disponivel.
        var qualidadeAtual = (typeof qualidadeImagens !== 'undefined') ? qualidadeImagens : 0;
        if (qualidadeAtual > 0 && typeof qualityImages === 'function') {
            setTimeout(function () {
                try {
                    SeiProEditorAdapter.findInBody(editor, 'img').each(function () {
                        if ($(this).attr('data-cke-quality-applied')) return;
                        var qAttr = $(this).attr('quality');
                        var q = qAttr ? parseFloat(qAttr) : (qualidadeAtual * 0.01);
                        qualityImages(this, this, q);
                        $(this).attr('data-cke-quality-applied', '1');
                    });
                } catch (e) {}
            }, 0);
        }
    }

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'image-base64' });
})();
