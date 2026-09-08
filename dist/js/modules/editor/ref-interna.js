/**
 * SEI Pro - Editor / Feature: Referencia interna
 *
 * Insere referencias internas (cross-references) para paragrafos numerados /
 * itens do documento. Abre um dialogo (jQuery UI, padrao dialogBoxPro do SEI
 * Pro) com o prefixo e a lista de paragrafos numerados; insere ancoras
 * <a href="#RefPro_..."> e mantem os rotulos atualizados.
 *
 * EXTRAIDO verbatim do monolito (a feature ja estava limpa: usa o dialogo
 * jQuery UI dialogBoxPro -- NAO CKEDITOR.dialog -- e roteia as operacoes do
 * editor pelo SeiProEditorAdapter: getInstance, withEdit, insertHtml,
 * findInBody). Nada de oEditor/CKEDITOR/iframe nestas funcoes.
 *
 * Funcoes movidas (privadas da feature): getRefInterna, updateRefsInternas,
 * getNiveisParagrafos.
 *
 * Globais do monolito usados (no clique/boot, quando ja existem): sanitizeHTML,
 * resetDialogBoxPro, dialogBoxPro, initChosenReplace, resizeHeigthDialogBox,
 * alertaBoxPro, clickScroolToRef (helper compartilhado com a nota de rodape),
 * randomString, jmespath. Ver README.md.
 */
(function () {
    'use strict';

    window.getRefInterna = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        let listP = getNiveisParagrafos(editor);
            listP = (listP) ? $.map(listP, function(v){ return '<option value="'+v.ref+'-'+v.item+'">'+v.item+'. '+v.text.replace(/^(.{50}[^\s]*).*/, "$1")+'...'+'</option>'; }).join('') : false;

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
                                <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                    <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="hidePrefix" tabindex="0">
                                    <label class="infraAreaDados" for="hidePrefix"></label>
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
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title : 'Inserir refer\u00EAncia interna',
                width : 600,
                height : 300,
                open: function () {
                    initChosenReplace('box_multiple', this, true);
                    $('#selectRef').on('change', function() { resizeHeigthDialogBox(dialogBoxPro) });
                },
                buttons: [{
                    text: 'Atualizar refer\u00EAncias',
                    class: 'confirm',
                    click: function(event) {
                        let valuePrefixo = $('#prefixo').val();
                        let hidePrefix = $('#hidePrefix').is(':checked');
                            hidePrefix = valuePrefixo == '' ? true : hidePrefix;
                        updateRefsInternas(editor, valuePrefixo, hidePrefix);
                        clickScroolToRef();
                        alertaBoxPro('Sucess', 'check-circle',  'Refer\u00EAncias atualizadas com sucesso');
                        // resetDialogBoxPro('dialogBoxPro');
                    }
                },{
                    text: 'Inserir',
                    class: 'confirm ui-state-active',
                    click: function(event) {
                        const valuePrefixo = $('#prefixo').val();
                        const selectMult = $('#selectRef option:checked');
                        const list_refs = $.map(selectMult,function(e){
                            if (e.value != '') return e.value
                        });
                        let hidePrefix = $('#hidePrefix').is(':checked');
                            hidePrefix = valuePrefixo == '' ? true : hidePrefix;
                        let htmlRefInterna = '';
                        if ($.isArray(list_refs) && list_refs.length) {
                            $.each(list_refs, function(i, v){
                                let valueSelect = (v.indexOf('-') !== -1) ? v.split('-') : false;
                                let refInterna = (valueSelect) ? ' <a href="#RefPro_'+valueSelect[0]+'" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">['+valuePrefixo+' '+valueSelect[1]+']</a> ' : false;
                                if (refInterna) htmlRefInterna += refInterna;
                                if (i < list_refs.length-2) htmlRefInterna += ', ';
                                if (i == list_refs.length-2) htmlRefInterna += ' e ';
                            });
                        }
                        SeiProEditorAdapter.withEdit(editor, function () {
                            SeiProEditorAdapter.insertHtml(editor, htmlRefInterna);
                        });
                        updateRefsInternas(editor, valuePrefixo, hidePrefix);
                        clickScroolToRef();
                        resetDialogBoxPro('dialogBoxPro');
                    }
                }]
            });
    };

    window.updateRefsInternas = function (editor, valuePrefixo, hidePrefix = false) {
        // Assinatura anterior era updateRefsInternas(valuePrefixo, hidePrefix);
        // mantemos compat chamando via adapter quando o 1o argumento eh string.
        if (typeof editor === 'string' || typeof editor === 'undefined') {
            hidePrefix = (arguments.length >= 2) ? valuePrefixo : false;
            valuePrefixo = editor;
            editor = SeiProEditorAdapter.getInstance();
        }
        if (!editor) return;
        const textPrefixo = hidePrefix ? '' : valuePrefixo+' ';
        const refs = SeiProEditorAdapter.findInBody(editor, '.refInternaPro');
        if (!refs || !refs.length) return;
        const listRefs = getNiveisParagrafos(editor);
        if (!listRefs) return;
        refs.each(function(){
            const _this = $(this);
            let ref_this = _this.attr('href');
                ref_this = (ref_this.indexOf('_') !== -1) ? ref_this.split('_')[1] : false;
            let item = (ref_this) ? jmespath.search(listRefs, "[?ref=='"+ref_this+"'] | [0].item ") : false;
                item = (item && item !== null) ? item : false;
            if (item) _this.text('['+textPrefixo+item+']');
        });
    };

    window.getNiveisParagrafos = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return false;
        var paragraphs = SeiProEditorAdapter.findInBody(editor, 'p');
        if (!paragraphs || !paragraphs.length) return false;
        // Shim para manter o bloco original (que trabalhava com iframe_.find('p').each)
        var iframe_ = { find: function(sel) { return paragraphs.filter ? paragraphs.filter(sel) : paragraphs; } };
        // Bloco original abaixo dependia de `iframe_.find('body').attr('contenteditable') == 'true'`
        // como guard; no CK5 nao ha body/iframe e ja validamos acima que o editor existe.
        if (true) {
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
                var _this = $(this);
                var _class = _this.attr('class');
                if (_class == 'Paragrafo_Numerado_Nivel1') {
                    i_Paragrafo_Numerado_Nivel1++;
                    i_Paragrafo_Numerado_Nivel2 = 0;
                    i_Paragrafo_Numerado_Nivel3 = 0;
                    i_Paragrafo_Numerado_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Paragrafo_Numerado_Nivel2') {
                    i_Paragrafo_Numerado_Nivel2++;
                    i_Paragrafo_Numerado_Nivel3 = 0;
                    i_Paragrafo_Numerado_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Paragrafo_Numerado_Nivel3') {
                    i_Paragrafo_Numerado_Nivel3++;
                    i_Paragrafo_Numerado_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Paragrafo_Numerado_Nivel4') {
                    i_Paragrafo_Numerado_Nivel4++;
                    iNumerado = true;
                }

                if (_class == 'Item_Nivel1') {
                    i_Item_Nivel1++;
                    i_Item_Nivel2 = 0;
                    i_Item_Nivel3 = 0;
                    i_Item_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Item_Nivel2') {
                    i_Item_Nivel2++;
                    i_Item_Nivel3 = 0;
                    i_Item_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Item_Nivel3') {
                    i_Item_Nivel3++;
                    i_Item_Nivel4 = 0;
                    iNumerado = true;
                }
                if (_class == 'Item_Nivel4') {
                    i_Item_Nivel4++;
                    iNumerado = true;
                }

                if (_class == 'sessionBreakPro') {
                    i_Paragrafo_Numerado_Nivel1 = 0;
                    i_Paragrafo_Numerado_Nivel2 = 0;
                    i_Paragrafo_Numerado_Nivel3 = 0;
                    i_Paragrafo_Numerado_Nivel4 = 0;

                    i_Item_Nivel1 = 0;
                    i_Item_Nivel2 = 0;
                    i_Item_Nivel3 = 0;
                    i_Item_Nivel4 = 0;
                }

                var item = (_class == 'Paragrafo_Numerado_Nivel1') ? i_Paragrafo_Numerado_Nivel1 : '';
                    item = (_class == 'Paragrafo_Numerado_Nivel2') ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2 : item;
                    item = (_class == 'Paragrafo_Numerado_Nivel3') ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2+'.'+i_Paragrafo_Numerado_Nivel3 : item;
                    item = (_class == 'Paragrafo_Numerado_Nivel4') ? i_Paragrafo_Numerado_Nivel1+'.'+i_Paragrafo_Numerado_Nivel2+'.'+i_Paragrafo_Numerado_Nivel3+'.'+i_Paragrafo_Numerado_Nivel4 : item;

                    item = (_class == 'Item_Nivel1') ? i_Item_Nivel1 : item;
                    item = (_class == 'Item_Nivel2') ? i_Item_Nivel1+'.'+i_Item_Nivel2 : item;
                    item = (_class == 'Item_Nivel3') ? i_Item_Nivel1+'.'+i_Item_Nivel2+'.'+i_Item_Nivel3 : item;
                    item = (_class == 'Item_Nivel4') ? i_Item_Nivel1+'.'+i_Item_Nivel2+'.'+i_Item_Nivel3+'.'+i_Item_Nivel4 : item;

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
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'ref-interna' });
    }
})();
