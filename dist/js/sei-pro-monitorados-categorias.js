// Monitorados — Categorias
// Slice da view de Processos Monitorados (sei-pro-monitorados.js). Script global,
// carregado em sequência pelo manifest. Seleção/edição de categoria do processo monitorado.
function editCategoryMonitorado(this_, id_procedimento) {
    var _this = $(this_);
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    var category_elem = _this.closest('td').find('.info_category');
    var category_txt = _this.closest('td').find('.info_category_txt');
    if (category_elem.is(':visible')) {
        category_elem.hide();
        category_txt.show();
        _this.find('i').attr('class','fas fa-pencil-alt');
    } else {
        var value = jmespath.search(storeMonitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        var categoriaLista = selectCategoryMonitorado(value.categoria, 'changeCategoryMonitorado', true, id_procedimento);
        category_elem.show().html(categoriaLista);
        category_txt.hide();
        _this.find('i').attr('class','fas fa-thumbs-up');
    }
}
function selectCategoryMonitorado(select = '', func = false, newItem = false, id_procedimento = 0) {
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    var listaCategorias = jmespath.search(storeMonitorados,"[*].categoria");
        listaCategorias = (listaCategorias !== null) ? uniqPro(listaCategorias) : false;
    var categoriaLista = (listaCategorias) 
        ? $.map(listaCategorias, function(v, i){
            if (v !== null && v != '') {
                var selected = (select !== null && v == select) ? 'selected' : '';
                return '<option value="'+v+'" '+selected+'>'+v+'</option>';
            }
        }).join('')
        : '';
        categoriaLista = '<select class="selectPro" '+(id_procedimento ? 'style="margin: 0 !important;font-size: 10pt;" data-id="'+id_procedimento+'"' : 'style="width: 100%;font-size: 10pt;"')+' '+(func ? 'onchange="'+func+'(this)"' : '')+'><option value="&nbsp;">&nbsp;</option>'+categoriaLista+(newItem ? '<option value="new">\u2795 Nova categoria</option>' : '')+'</select>';
   return categoriaLista;
}
function changePanelCategoryMonitorado(this_) {
    var _this = $(this_);
    setOptionsPro('panelMonitoradosView', _this.val().trim());
    setPanelMonitorados('refresh');
}
function changeCategoryMonitorado(this_) {
    var _this = $(this_);
    if (_this.val() == 'new') {
        var textBox =   '<i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Digite o nome da nova categoria:'+
                        '<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">'+
                        '   <input onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" type="text" style="width: 90% !important;" class="required infraText" value="" name="nomeNovoItem" id="nomeNovoItem">'+
                        '</span>';
        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
            .dialog({
                width: 400,
                title: 'Adicionar nova categoria',
                close: function() {
                    if ($(this_).closest('#frmAtividadeListar').length == 0 && $('#iframeBoxPro:visible').length == 0) {
                        _this.closest('td').find('.info_category').hide().html('');
                        _this.closest('td').find('.info_category_txt').show();
                    } else {
                        var newValue = $('#nomeNovoItem').val().trim();
                        _this.find('option:selected').before('<option value="'+newValue+'">'+newValue+'</option>').end().val(newValue);
                        if ($('#iframeBoxPro:visible').length > 0) {
                            initChosenReplace('box_refresh', this_);
                        }
                    }
                },
                open: function() {
                    $('#nomeNovoItem').focus();
                },
                buttons: [{
                    text: "Ok",
                    class: 'confirm ui-state-active',
                    click: function() {
                        saveCategoryMonitorado(this_, $('#nomeNovoItem').val().trim());
                    }
                }]
        });
    } else {
        saveCategoryMonitorado(this_, _this.val().trim());
    }
}
function saveCategoryMonitorado(this_, value) {
    var _this = $(this_);
    var data = _this.data();
    var id_procedimento = data.id;
    var storeMonitorados = getStoreMonitoradoPro();
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex >= 0) {
            var item = storeMonitorados.monitorados[monitoradoIndex];
                item.categoria = value;
            storeMonitorados.monitorados[monitoradoIndex] = item;
    }
    persistMonitoradoStore(storeMonitorados);
    setPanelMonitorados('refresh');
    if (alertBoxPro) {   
        alertBoxPro.dialog('close');
        resetDialogBoxPro('alertBoxPro');
    }
}
