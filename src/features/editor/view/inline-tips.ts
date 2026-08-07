// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';
import { readAiEditorConfig, requestAiInline } from '../ai-bridge.js';
import { buildProcessDocumentReference, listProcessDocuments } from '../domain/process-documents.js';

export function setOnKeyEditor(destroy = false) {
    if ((!state.loadOnKeyEditor || state.loadOnKeyEditor != state.oEditor.name) && !destroy) {
            state.oEditor.on('key', function (evt) {
                var self = this;
                var event = evt;
                api.keyActionEditor(event, self);
                setTimeout(function() {
                    evtInlineOpenAI(event);
                    api.keyupActionEditor(event, self);
                }, 10);
            });
            state.loadOnKeyEditor = state.oEditor.name;
    } else if (destroy) {
        removeOptionsPro('setInlineAI');
    }
}
export function evtInlineOpenAI(evt) {
    const keyCode = evt?.data?.keyCode ?? evt?.keyCode;
    const config = readAiEditorConfig();
    if (keyCode !== 13 || !config.inlineEnabled) return false;
    const keyword = config.keyword;
    const start = state.oEditor?.getSelection?.().getStartElement?.();
    const paragraph = start?.$?.closest?.('p') || q(start?.$).closest('p').get(0);
    const text = String(paragraph?.textContent || '');
    const index = text.indexOf(keyword);
    if (index < 0) return false;
    const prompt = text.slice(index + keyword.length).trim();
    if (!prompt) return false;
    requestAiInline({
        editorId: state.oEditor?.name || state.idEditor || '',
        prompt,
        marker: text
    });
    return true;
}
export function keyupActionEditor(evt, self) {
    const editor = self || state.oEditor;
    const startElement = editor?.getSelection?.()?.getStartElement?.()?.$;
    const pElement = q(startElement).closest('p');
    if (!pElement.length) return false;

    const text = String(pElement.text() || '');
    const keyCode = evt?.data?.keyCode ?? evt?.keyCode;
    const interactiveWriting = verifyConfigValue('escrivainterativa');
    const canSuggest = !pElement.find('.imgBgAncora').length
        && !pElement.find('.minutaAncora').length;
    const iframe = q(editor?.container?.$).find('iframe').contents();

    if (interactiveWriting && canSuggest
        && (keyCode == 2228275 || text.includes('#'))) {
        api.showTagsTips(pElement[0], iframe);
    } else if (interactiveWriting && canSuggest
        && (keyCode == 2228274 || text.includes('@'))) {
        api.showInteressadosTips(pElement[0], iframe);
        // console.log('@',pElement[0], $(oEditor.container.$).find('iframe').contents());
    }
    return true;
    // console.log(evt.data.keyCode, verifyConfigValue('escrivainterativa'), !pElement.find('.imgBgAncora').length, !pElement.find('.minutaAncora').length, evt.data.keyCode == 2228274, pElement.find('.linkDisplayPro').length, pElement.text().indexOf('@'));
}
export function keyActionEditor(evt, self) {
    const editor = self || state.oEditor;
    const startElement = editor?.getSelection?.()?.getStartElement?.()?.$;
    const pElement = q(startElement).closest('p');
    if (!pElement.length) return false;
    if (verifyConfigValue('escrivainterativa')) {
        if ((evt.data.keyCode == 40 || evt.data.keyCode == 38) && pElement.find('.linkDisplayPro').length) {
            evt.cancel();
            evt.stop();
            state.indexDisplayPro = evt.data.keyCode == 40 ? state.indexDisplayPro+1 : state.indexDisplayPro;
            state.indexDisplayPro = evt.data.keyCode == 38 ? state.indexDisplayPro-1 : state.indexDisplayPro;
            state.indexDisplayPro = state.indexDisplayPro < 0 ? 0 : state.indexDisplayPro;
        } else if ((evt.data.keyCode == 13 || evt.data.keyCode == 9) && pElement.find('.linkDisplayPro').length) {
            evt.cancel();
            evt.stop();
            pElement.find('.linkDisplayPro li.highlighted').trigger('click');
            return false;
        }
    }
    // console.log(evt.data.keyCode);
}
export function getTextTagTip(keyCode = '#') {


    /* var range = oEditor.getSelection().getRanges()[0],
        startNode = range.startContainer;
    var textP = startNode.getText().substring(0,range.startOffset); */

    var e = state.oEditor;
    var r = state.oEditor.getSelection().getRanges()[ 0 ];
        r.collapse( 1 );
        r.setStartAt( ( r.startPath().block || r.startPath().blockLimit ).getFirst(), CKEDITOR.POSITION_AFTER_START );
    var docFr = r.cloneContents();
    var textP = docFr.$.textContent;
        textP = (textP.indexOf(keyCode) !== -1) ? textP.split(keyCode)[1].trim() : false;
        textP = textP ? textP.replace(invisibleCharacters, "") : textP;
        // console.log(textP);
    return textP;
}
export function showInteressadosTips(this_, iframeDoc) {
    var textTip = api.getTextTagTip('@');
    var index = 0;
    // if (textTip && textTip !== '' && state.lastTextTip != textTip) {
    if (textTip && textTip != '') {
        state.lastTextTip = textTip;
        getInteressadosProcesso(textTip, function(result){
            state.resultTextTip = result;
            api.renderTagsTips(this_, iframeDoc, textTip, result);
        });
    } else {
        // if (lastTextTip && resultTextTip) renderTagsTips(this_, iframeDoc, state.lastTextTip, state.resultTextTip);
    }
}
export function renderTagsTips(this_, iframeDoc, textTip, result) {
    var htmlTips = q.map(result, function(v, i){
                        return "<li contenteditable='false' data-text='<span contenteditable=\"false\" style=\"text-indent:0px;\" class=\"ancoraSei interessadoSeiPro\" data-id=\""+v.id+"\">"+v.descricao+"</span>&nbsp;' data-id='"+v.id+"' data-keycode='@' data-index='"+i+"' data-texttip='"+textTip+"' data-seipro-hover='hoverTapTip' data-seipro-action='setTagTip' class='"+(state.indexDisplayPro == i ? 'highlighted' : '')+"'>"+v.descricao+"</li>";
                    }).join('');
        htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;

    var html =  '<div class="linkDisplayPro" unselectable="on" contenteditable="false">'+
                '  <ul>'+
                '    '+htmlTips+
                '  </ul>'+
                '</div>';

    iframeDoc.find('.linkDisplayPro').remove();
    q(this_).append(html);
    api.replaceTextOnEditor('@','<a name="tagtip"></a></span>@');
    api.centralizeTapTip(this_);
}
export function showTagsTips(this_, iframeDoc) {
    var textTip = api.getTextTagTip();
    var index = 0;
    var listDocumentos = q.map(listProcessDocuments(globalThis), function (v) {
                            var select_text = ( v.nr_sei != '' ) ? v.documento+' ('+v.nr_sei+')' : v.documento;
                            var citacaoDoc = getCitacaoDoc();
                            var referenceNumber = String(v.nr_sei || v.numeroSEI || v.numero || '').trim();
                            var linkText = referenceNumber || String(v.documento || '').trim();
                            var nrSeiHtml = buildProcessDocumentReference({ ...v, nr_sei: linkText });
                            var citacaoDocumento = ( referenceNumber || getConfigValue('citacaodoc') == 'citacaodoc_4') ? v.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;

                            if ( v.documento != '' ) { return [[select_text, citacaoDocumento]] }
                        });
    var listDadosProcesso = api.arrayDadosEditor();
    var listTagTip = listDadosProcesso.concat(listDocumentos);
    var htmlTips = q.map(listTagTip, function(v){
                        var txtTag = !!v[0] ? removeAcentos(v[0]).replace(/[^\x00-\x7F]/g, '').toLowerCase() : false;
                        var txtTip = !!v[0] ? removeAcentos(textTip).replace(/[^\x00-\x7F]/g, '').toLowerCase() : false;
                        var checkTag = txtTag && txtTip ? txtTag.includes(txtTip) : false;
                        if (!!v[1] && (!textTip || textTip == '' || checkTag) ) {
                            index++;
                            return "<li contenteditable='false' data-text='"+v[1]+"' data-keycode='#' data-index='"+index+"' data-texttip='"+textTip+"' data-seipro-hover='hoverTapTip' data-seipro-action='setTagTip' class='"+(state.indexDisplayPro == index-1 ? 'highlighted' : '')+"'>"+v[0]+"</li>"
                        }
                    }).join('');
        htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;
    var html =  '<div class="linkDisplayPro" unselectable="on" contenteditable="false">'+
                '  <ul>'+
                '    '+htmlTips+
                '  </ul>'+
                '</div>';

            iframeDoc.find('.linkDisplayPro').remove();
            q(this_).append(html);
            api.replaceTextOnEditor('#','<a name="tagtip"></a></span>#');
            api.centralizeTapTip(this_);
}
export function centralizeTapTip(this_) {
    var boxDisplayLink = q(this_).find('.linkDisplayPro');
    var boxDisplayLink_offset = q(this_).find('a[name="tagtip"]').offset();
    if (typeof boxDisplayLink_offset !== 'undefined') {
        var elemBody = q('iframe[title*="'+oEditor.name+'"]').contents().find('body');
        var ckeContent = q('iframe[title*="'+state.oEditor.name+'"]').closest('.cke_contents');
        var heightBody = elemBody.height();
        var boxDisplayLink_left = boxDisplayLink_offset.left;
        var boxDisplayLink_top = boxDisplayLink_offset.top;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = q(window).width();
        // var marginLeft = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-(boxDisplayLink_left+boxDisplayLink_width+45) : 0;
            // marginLeft = marginLeft < 0 ? 0 : marginLeft;
        var marginTop = (boxDisplayLink_top + 223) > heightBody ? '-240px' : '15px';

        var leftBox = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? undefined : boxDisplayLink_left;
        var rightBox = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-boxDisplayLink_left - 40 : undefined;
            rightBox = (windowWidth/3)*2 > boxDisplayLink_left && boxDisplayLink_left > (windowWidth/3) ? (windowWidth-boxDisplayLink_width)/2 : rightBox;

        // console.log({boxDisplayLink_offset: boxDisplayLink_offset, boxDisplayLink_width: boxDisplayLink_width, windowWidth: windowWidth, mid: (windowWidth/3)*2 > boxDisplayLink_left && boxDisplayLink_left > (windowWidth/3)});
        // console.log(windowWidth/3, (windowWidth/3)*2, boxDisplayLink_left, (windowWidth/3)*2 > boxDisplayLink_left, boxDisplayLink_left > (windowWidth/3) );

        if (heightBody < 250) {
            elemBody.css({'margin-bottom': '250px'});
            ckeContent.addClass('resizeDisplayLink');
            marginTop = boxDisplayLink_top > 250 ? marginTop : '15px';
        }

            // boxDisplayLink.css({'margin-left': marginLeft, 'margin-top': marginTop, 'left': boxDisplayLink_left, top: boxDisplayLink_offset.top});
            boxDisplayLink.css({'margin-top': marginTop, 'left': leftBox, 'right': rightBox, top: boxDisplayLink_offset.top});
            q(this_).find('a[name="tagtip"]').remove();
        if (!q(this_).find('.linkDisplayPro ul li.highlighted').length) {
            q(this_).find('.linkDisplayPro ul li').eq(0).addClass('highlighted');
            state.indexDisplayPro = 0;
        }
        if (state.indexDisplayPro > 6) q(this_).find('.linkDisplayPro ul').scrollTop(29.5*(state.indexDisplayPro-6));
    }
}
export function hoverTapTip(this_) {
    var _this = q(this_);
    _this.closest('ul').find('li.highlighted').removeClass('highlighted');
    _this.addClass('highlighted');
    state.indexDisplayPro = _this.data('index');
}
export function setTagTip(this_) {
    var _this = q(this_);
    var textTip = api.getTextTagTip();
    var textTip = _this.data('texttip');
    var textReplace = _this.data('text');
    var keyCode = _this.data('keycode');
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest('p');
        q(state.oEditor.getSelection().getStartElement().$).closest('p').find('.linkDisplayPro').remove();
        api.replaceTextOnEditor(keyCode+textTip, textReplace);
        state.indexDisplayPro = 0;
        state.lastTextTip = false;
        state.resultTextTip = false;
        api.restoreIframeDisplayLink();
}
export function restoreIframeDisplayLink() {
    if (typeof oEditor !== 'undefined' && typeof state.oEditor.name !== 'undefined') {
        var elemBody = q('iframe[title*="'+state.oEditor.name+'"]').contents().find('body');
        var ckeContent = q('iframe[title*="'+oEditor.name+'"]').closest('.cke_contents');
        if (ckeContent.hasClass('resizeDisplayLink')) {
            elemBody.css({'margin-bottom': '0'});
            ckeContent.removeClass('resizeDisplayLink');
        }
    }
}
var storeCursorLocation = function( oEditor ) {
    state.bookmark = state.oEditor.getSelection().createBookmarks( true );
};
var restoreCursorLocation = function( oEditor ) {
    state.oEditor.getSelection().selectBookmarks( state.bookmark );
};
export function replaceTextOnEditor(findString, replaceString) {
    state.oEditor.focus();
    storeCursorLocation(state.oEditor);
    var sel = state.oEditor.getSelection();
    var element = sel.getStartElement();
    var data = element.getHtml();
    var replaced_text = data.replace(invisibleCharacters, "").replace(findString, replaceString);
        element.setHtml(replaced_text);
        restoreCursorLocation(state.oEditor);
}
export function selectTextOnEditor(findString) {
    try {
        var sel = state.oEditor.getSelection();
        var element = sel.getStartElement();
        var pElement = q(element.$).closest('p');
            pElement.html(pElement.html().replace(/^\n|\n$/g, ''));
            sel.selectElement(element);

        var ranges = state.oEditor.getSelection().getRanges();
        var startIndex = element.getHtml().indexOf(findString);
        if (startIndex != -1) {
            ranges[0].setStart(element.getFirst(), startIndex);
            ranges[0].setEnd(element.getFirst(), startIndex + findString.length);
            console.log([ranges[0]]);
            sel.selectRanges([ranges[0]]);

            var range = sel.getRanges()[0];
                range.deleteContents();
                range.select();
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}
// INSERE REFERENCIA INTERNA
export function getRefInterna(this_) {
    api.setParamEditor(this_);

    let listP = api.getNiveisParagrafos();
        listP = (listP) ? q.map(listP, function(v){ return '<option value="'+v.ref+'-'+v.item+'">'+v.item+'. '+v.text.replace(/^(.{50}[^\s]*).*/, "$1")+'...'+'</option>'; }).join('') : false;

    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="prefixo"><i class="iconPopup iconSwitch fas fa-text-size cinzaColor"></i>Prefixo:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" id="prefixo" style="width:70%">
                        <div style="float: right;">
                            <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="hidePrefix" tabindex="0">
                                <label class="onoff-switch-label" for="hidePrefix"></label>
                            </div>
                            <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="hidePrefix">N\u00E3o utilizar prefixo</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="selectRef"><i class="iconPopup iconSwitch fas fa-sort-numeric-down cinzaColor"></i>Par\u00E1grafo numerado:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select multiple="multiple" id="selectRef">
                        ${listP}
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    `);

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = q('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title : 'Inserir refer\u00EAncia interna',
            width : 800,
            height : 450,
            open: function () {
                initChosenReplace('box_multiple', this, true);
                q('#selectRef').on('change', function() { resizeHeigthDialogBox(dialogBoxPro) });
            },
            buttons: [{
                text: 'Atualizar refer\u00EAncias',
                class: 'confirm',
                click: function(event) {
                    let valuePrefixo = q('#prefixo').val();
                    let hidePrefix = q('#hidePrefix').is(':checked');
                        hidePrefix = valuePrefixo == '' ? true : hidePrefix;
                    api.updateRefsInternas(valuePrefixo, hidePrefix);
                    api.clickScroolToRef();
                    alertaBoxPro('Sucess', 'check-circle',  'Refer\u00EAncias atualizadas com sucesso');
                    // resetDialogBoxPro('dialogBoxPro');
                }
            },{
                text: 'Inserir',
                class: 'confirm ui-state-active',
                click: function(event) {
                    const valuePrefixo = q('#prefixo').val();
                    const selectMult = q('#selectRef option:checked');
                    const list_refs = q.map(selectMult,function(e){
                        if (e.value != '') return e.value
                    });
                    let hidePrefix = q('#hidePrefix').is(':checked');
                        hidePrefix = valuePrefixo == '' ? true : hidePrefix;
                    let htmlRefInterna = '';
                    if (q.isArray(list_refs) && list_refs.length) {
                        q.each(list_refs, function(i, v){
                            let valueSelect = (v.indexOf('-') !== -1) ? v.split('-') : false;
                            let refInterna = (valueSelect) ? ' <a href="#RefPro_'+valueSelect[0]+'" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">['+valuePrefixo+' '+valueSelect[1]+']</a> ' : false;
                            if (refInterna) htmlRefInterna += refInterna;
                            if (i < list_refs.length-2) htmlRefInterna += ', ';
                            if (i == list_refs.length-2) htmlRefInterna += ' e ';
                        });
                    }
                    state.oEditor.focus();
                    state.oEditor.fire('saveSnapshot');
                    state.oEditor.insertHtml(htmlRefInterna);
                    state.oEditor.fire('saveSnapshot');
                    api.updateRefsInternas(valuePrefixo, hidePrefix);
                    api.clickScroolToRef();
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
        });
}
export function updateRefsInternas(valuePrefixo, hidePrefix = false) {
    const iframe_ = getEditorIframe();
    const textPrefixo = hidePrefix ? '' : valuePrefixo+' ';
    if (iframe_.find('body').length) {
        const listRefs = api.getNiveisParagrafos();
        if (listRefs) {
            iframe_.find('.refInternaPro').each(function(){
                const _this = q(this);
                let ref_this = _this.attr('href');
                    ref_this = (ref_this.indexOf('_') !== -1) ? ref_this.split('_')[1] : false;
                let item = (ref_this) ? jmespath.search(listRefs, "[?ref=='"+ref_this+"'] | [0].item ") : false;
                    item = (item && item !== null) ? item : false;
                if (item) _this.text('['+textPrefixo+item+']');
            })
        }
    }
}
export function getNiveisParagrafos() {
    var iframe_ = getEditorIframe();
    if (iframe_.find('body').length) {
        var i_Paragrafo_Numerado_Nivel1 = 0;
        var i_Paragrafo_Numerado_Nivel2 = 0;
        var i_Paragrafo_Numerado_Nivel3 = 0;
        var i_Paragrafo_Numerado_Nivel4 = 0;

        var i_Item_Nivel1 = 0;
        var i_Item_Nivel2 = 0;
        var i_Item_Nivel3 = 0;
        var i_Item_Nivel4 = 0;

        var arrayParagrafos = [];

        iframe_.find('p').each(function(i){
            var randRef = randomString(16);
            var iNumerado = false;
            var _this = q(this);
            var hasClass = function(className) { return _this.hasClass(className); };
            if (hasClass('Paragrafo_Numerado_Nivel1')) {
                i_Paragrafo_Numerado_Nivel1++;
                i_Paragrafo_Numerado_Nivel2 = 0;
                i_Paragrafo_Numerado_Nivel3 = 0;
                i_Paragrafo_Numerado_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Paragrafo_Numerado_Nivel2')) {
                i_Paragrafo_Numerado_Nivel2++;
                i_Paragrafo_Numerado_Nivel3 = 0;
                i_Paragrafo_Numerado_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Paragrafo_Numerado_Nivel3')) {
                i_Paragrafo_Numerado_Nivel3++;
                i_Paragrafo_Numerado_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Paragrafo_Numerado_Nivel4')) {
                i_Paragrafo_Numerado_Nivel4++;
                iNumerado = true;
            }

            if (hasClass('Item_Nivel1')) {
                i_Item_Nivel1++;
                i_Item_Nivel2 = 0;
                i_Item_Nivel3 = 0;
                i_Item_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Item_Nivel2')) {
                i_Item_Nivel2++;
                i_Item_Nivel3 = 0;
                i_Item_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Item_Nivel3')) {
                i_Item_Nivel3++;
                i_Item_Nivel4 = 0;
                iNumerado = true;
            }
            if (hasClass('Item_Nivel4')) {
                i_Item_Nivel4++;
                iNumerado = true;
            }

            if (hasClass('sessionBreakPro')) {
                i_Paragrafo_Numerado_Nivel1 = 0;
                i_Paragrafo_Numerado_Nivel2 = 0;
                i_Paragrafo_Numerado_Nivel3 = 0;
                i_Paragrafo_Numerado_Nivel4 = 0;

                i_Item_Nivel1 = 0;
                i_Item_Nivel2 = 0;
                i_Item_Nivel3 = 0;
                i_Item_Nivel4 = 0;
            }

            var item = (hasClass('Paragrafo_Numerado_Nivel1')) ? i_Paragrafo_Numerado_Nivel1 : '';
                item = (hasClass('Paragrafo_Numerado_Nivel2')) ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2 : item;
                item = (hasClass('Paragrafo_Numerado_Nivel3')) ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2+'.'+i_Paragrafo_Numerado_Nivel3 : item;
                item = (hasClass('Paragrafo_Numerado_Nivel4')) ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2+'.'+i_Paragrafo_Numerado_Nivel3+'.'+i_Paragrafo_Numerado_Nivel4 : item;

                item = (hasClass('Item_Nivel1')) ? i_Item_Nivel1 : item;
                item = (hasClass('Item_Nivel2')) ? i_Item_Nivel1+'.'+i_Item_Nivel2 : item;
                item = (hasClass('Item_Nivel3')) ? i_Item_Nivel1+'.'+i_Item_Nivel2+'.'+i_Item_Nivel3 : item;
                item = (hasClass('Item_Nivel4')) ? i_Item_Nivel1+'.'+i_Item_Nivel2+'.'+i_Item_Nivel3+'.'+i_Item_Nivel4 : item;

            if (iNumerado) {
                if (_this.find('a[name*="RefPro_"]').length == 0) {
                    _this.prepend('<a name="RefPro_'+randRef+'">');
                } else {
                    randRef = _this.find('a[name*="RefPro_"]').attr('name').replace('RefPro_','');
                }
                arrayParagrafos.push({ref: randRef, item: item, text: _this.text()});
            }
        });
        return arrayParagrafos;
    } else {
        return false;
    }
}

function getEditorIframe() {
    if (state.iframeEditor && typeof state.iframeEditor.find === 'function'
        && state.iframeEditor.find('body').length) {
        return state.iframeEditor;
    }
    if (!state.idEditor) return q();
    var editorFrame = q('#cke_'+state.idEditor).find('iframe').eq(0);
    if (editorFrame.length) return editorFrame.contents();
    return q('iframe[title*="'+state.idEditor+'"]').eq(0).contents();
}

export function clickScroolToRef() {
    q('iframe.cke_wysiwyg_frame').each(function(index){
        var iframe_ = q(this).contents();
        if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
            iframe_.find('.anchorRefInternaPro').unbind().on('click', function(){
                var _this = q(this);
                var ref = _this.attr('href');
                    ref = (typeof ref !== 'undefined') ? ref.replace('#','') : false;
                if (ref) {
                    var container = q('#divEditores');
                    var element = iframe_.find('a[name="'+ref+'"]').closest('p');
                    var position = element.offset().top + 270;
                    container.animate({
                        scrollTop: position
                    });
                }
            });
        }
    });
}

export function getCharOnCursor(position = 'prev') {
    var range = state.oEditor.getSelection().getRanges()[ 0 ],
        startNode = range.startContainer;
    var pos = (position == 'prev') ? range.startOffset - 1 : range.startOffset;

    if ( startNode.type == CKEDITOR.NODE_TEXT && range.startOffset )
        // Range at the non-zero position of a text node.
        return startNode.getText()[ pos ];
    else {
        // Expand the range to the beginning of editable.
        range.collapse( true );
        range.setStartAt( state.oEditor.editable(), CKEDITOR.POSITION_AFTER_START );

        // Let's use the walker to find the closes (previous) text node.
        var walker = new CKEDITOR.dom.walker( range ),
            node;

        while ( ( node = walker.previous() ) ) {
            // If found, return the last character of the text node.
            if ( node.type == CKEDITOR.NODE_TEXT )
                return node.getText().slice( -1 );
        }
    }

    // Selection starts at the 0 index of the text node and/or there's no previous text node in contents.
    return null;
}
api.setOnKeyEditor = setOnKeyEditor;
api.evtInlineOpenAI = evtInlineOpenAI;
api.keyupActionEditor = keyupActionEditor;
api.keyActionEditor = keyActionEditor;
api.getTextTagTip = getTextTagTip;
api.showInteressadosTips = showInteressadosTips;
api.renderTagsTips = renderTagsTips;
api.showTagsTips = showTagsTips;
api.centralizeTapTip = centralizeTapTip;
api.hoverTapTip = hoverTapTip;
api.setTagTip = setTagTip;
api.restoreIframeDisplayLink = restoreIframeDisplayLink;
api.replaceTextOnEditor = replaceTextOnEditor;
api.selectTextOnEditor = selectTextOnEditor;
api.getRefInterna = getRefInterna;
api.updateRefsInternas = updateRefsInternas;
api.getNiveisParagrafos = getNiveisParagrafos;
api.clickScroolToRef = clickScroolToRef;
api.getCharOnCursor = getCharOnCursor;
