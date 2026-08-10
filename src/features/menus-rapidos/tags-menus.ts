// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — tags, etiquetas, flash menus.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    atividadesState,
    checkCapacidade,
    getAtividadesServer,
    getHtmlKanbanUserPriority,
    getKanbanUserPriority,
    updateCountKanbanBoard
} from '../../shared/sei-runtime/atividades-bridge.js';

import {
    alertaBoxPro,
    centralizeDialogBox,
    getIDProtocoloSEI,
    getIframeArvoreElement,
    loadingButtonConfirm,
    resetDialogBoxPro,
    setSessionProcessosPro,
    updateDadosArvore
} from '../../shared/sei-runtime/deps.js';

export function filterTagView(this_) {
    if ($('#kanbanAtivPanel').is(':visible')) {
        filterTagKanban(this_);
    } else if ($('#tabelaAtivPanel').is(':visible') || $('#monitoradosProDiv').is(':visible') || $('#tableAfastamentoPanel').is(':visible') || $('table.tableInfo[id*="tableConfiguracoesPanel_"]').is(':visible')) {
        filterTagTable(this_);
    } else if ($('#ifrArvore').length > 0) {
        $('#ifrArvore')[0].contentWindow.filterTagKanbanArvore(this_);
    }
}
export function filterTagKanban(this_) {
    var _this = $(this_);
    var _parent = _this.closest('#kanbanAtivPanel');
    var data = _this.data();
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? data.tagname : false;
    var tagType = (typeof data.type !== 'undefined' && data.type !== null && data.type !== '') ? data.type : false;
    var htmlFilter = '';
        _parent.find('#filterTagKanban').remove();
    if (tagName) {
        _parent.find('.kanban-item').hide();
        var divPriorityUser = (data.type == 'user' && checkCapacidade('update_prioridades')) ? getHtmlKanbanUserPriority() : '';
        var itemFilter = _parent.find('.kanban-item.tagKanName_'+tagName);
        var nameTag = (typeof data.nametag !== 'undefined') ? data.nametag : _this.text().trim();
        var iconTag = (typeof data.icontag !== 'undefined') ? 'fas fa-'+data.icontag : _this.find('i').attr('class');
            itemFilter.show();
            htmlFilter =    '<div id="filterTagKanban" class="tituloFilter" style="padding: 0 10px 20px; font-size: 9pt; text-align: center;">'+
                            '   Filtro: '+
                            '   <span class="tag" style="background-color: '+data.colortag+'">'+
                            '       <span class="tag-text" style="color: '+data.textcolor+'; margin-right: 5px;">'+
                            '           <i class="tagicon tagicon '+iconTag+'" style="font-size: 120%; margin: 0 2px; color: '+data.textcolor+'"></i>'+
                            '           '+nameTag+
                            '           </span>'+
                            '       <button onclick="filterTagKanban(this); return false;" class="tag-remove"></button>'+
                            '   </span>'+divPriorityUser+
                            '</div>';
            _parent.prepend(htmlFilter);
            if (data.type == 'user') { getKanbanUserPriority(this_, 'add') } else { getKanbanUserPriority(this_, 'remove') }
            dialogBoxPro = true;
        setTimeout(function(){
            dialogBoxPro = false;
        }, 100);
        setOptionsPro('filterTag_kanban', (tagName ? tagName : ''));
        setOptionsPro('filterTagType_kanban', tagType);
        setOptionsPro('filterTag_removed', false);
    } else {
        _parent.find('.kanban-item').show();
        _parent.find('.kanban-item-priority').remove();
        removeOptionsPro('filterTag_kanban');
        removeOptionsPro('filterTagType_kanban');
        getKanbanUserPriority(this_, 'remove');
        setOptionsPro('filterTag_removed', true);
    }
    // console.log('$$$$$$ tagName', tagName);
    _parent.find('.kanban-container').animate({scrollTop: 0}, 500);
    if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    updateCountKanbanBoard();
}
export function filterTagTable(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('table');
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? 'tagTableName_'+data.tagname : false;
    var tagName_ = (tagName) ? data.tagname : '';
    var th_head = _parent.find('th.tituloFilter[data-filter-type="'+data.type+'"]');
    var typeTable = _parent.data('tabletype');
        _parent.find('thead .tableHeader').find('span.tag').remove();
        $('#tabelaAtivPanel').find('.filterTagClean').hide();
    if (tagName) {
        var colorTag = (data.colortag) ? data.colortag : '#bfd5e8';
        var nameTag = (data.nametag) ? data.nametag : $(this_).text();
        var textColour = (getBrightnessColor(colorTag) > 125) ? 'black' : 'white';
        var iconTagClass = _this.find('i').attr('class');
        var iconTag = '<i class="tagicon '+iconTagClass+'" style="font-size: 120%; margin: 0 2px; color: '+textColour+'"></i> ';
        var htmlFilter = '<span class="tag" style="margin-left: 10px; background-color: '+colorTag+'"><span class="tag-text" style="color: '+textColour+'; margin-right: 5px;">'+iconTag+nameTag+'</span><button onclick="filterTagView(this)" class="tag-remove"></button></span>';
            _parent.find('tbody').find('tr').hide();
            _parent.find('tbody').find('tr.'+tagName).show();
            $('#tabelaAtivPanel').find('.filterTagClean').show();
            setOptionsPro('filterTag_removed', false);
    } else {
        var htmlFilter = '';
        $('.tableFollow[data-tabletype="'+typeTable+'"]').find('tbody tr').show();
        $('#tabelaAtivPanel').find('.filterTagClean').hide();
        setOptionsPro('filterTag_removed', true);
    }
        /*    
        console.log({
            mode: 'show', 
            len: th_head.find('.tablesorter-header-inner').length, 
            type: data.type, 
            html: htmlFilter, 
            tagName: tagName, 
            typeTable: typeTable, 
            table_len: _this.closest('table').length,
            class: _this.attr('class'), 
            table_len: _this.closest('table').length, 
            tr_len: _this.closest('table').find('tbody tr').length
        });
        */
       
        updateCountTableMonitorado();
        th_head.find('.tablesorter-header-inner').append(htmlFilter);
        setOptionsPro('filterTag_'+typeTable, tagName_);
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
}
// getRecentDateRow migrada para SeiPro.core.datas (src/core/datas.js) — Fase 6
export function normalizeAreaTela() {
    $('#divInfraAreaTela').css({'height':'','margin-bottom': '40px', 'display': 'inline-block'});
}
export function initClassicEditor() {
    if (typeof ClassicEditor === 'undefined') {
        $.getScript(URL_SPRO+"js/lib/ckeditor/ckeditor.js");  
        // var htmlScript = '<script data-config="ckeditor-seipro" type="text/javascript" charset="UTF-8" src="'+URL_SPRO+'js/lib/ckeditor/ckeditor.js"></script>';
        // $(htmlScript).appendTo('head');
    }
}
export function initPanelResize(element, name, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $(element).resizable !== 'undefined') { 
        setPanelResize(element, name);
    } else {
        setTimeout(function(){ 
            initPanelResize(element, name, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initPanelResize'); 
        }, 500);
    }
}
export function setPanelResize(element, name) {
    normalizeAreaTela();
    $(element).resizable({
        handles: 's',
        stop: function( event, ui ) {
            setOptionsPro('panelHeight_'+name, ui.size.height);
            normalizeAreaTela()
        }
    });
    if (getOptionsPro('panelHeight_'+name) != '') {
        $(element).css('height',getOptionsPro('panelHeight_'+name)+'px');
    }
    if (SeiPro.sei.adapter.isNewSEI() && $('#divRecebidosAreaPaginacaoInferior').is(':visible')) {
        $(element).find('.ui-resizable-handle.ui-resizable-s').css('bottom','-30px');
    }
    $(element)
        .find('.ui-resizable-handle.ui-resizable-s')
        .dblclick(function() {
            removeOptionsPro('panelHeight_'+name);
            normalizeAreaTela();
        $(element).css('height','');
        })
        .attr('onmouseout','return infraTooltipOcultar()')
        .attr('onmouseover','return infraTooltipMostrar(\'Arraste para redimensionar. Dois cliques para desativar.\')');
}
export function saveFollowDesc(this_, mode) {
    var ativState = atividadesState();
    var type_container = ($(this_).closest('.kanban-content').length > 0) ? 'kanban' : 'table';
    var _container = (type_container == 'kanban') ? $(this_).closest('.kanban-container') : $(this_).closest('table');
    var _data_id = (type_container == 'kanban') ? $(this_).closest('.kanban-item').data('eid').replace('_id_','') : $(this_).closest('tr').data('index');
    var _content = (type_container == 'kanban') ? $(this_).closest('.kanban-content') : $(this_).closest('tr');
    var _content_desc = _content.find('.content_desc');

    var info = _content_desc.find('span.info');
    var info_txt = _content_desc.find('span.info_txt');
    var value = info_txt.find('input').val().replace(/[\u200B]/g, '');
    var index = parseInt(_data_id);
    var id_procedimento = (typeof $(this_).closest('tr').data('id_procedimento') !== 'undefined') ? parseInt($(this_).closest('tr').data('id_procedimento')) : false;
        info.show();
        info_txt.hide();
        // console.log(index, value, mode);
    if (value != info.text()) {
        info.text(value);
        if (mode == 'ativ') {
            var _ativServer = getAtividadesServer(); if (_ativServer) _ativServer({action: 'edit_assunto', id: index, assunto: value}, 'edit_assunto');
            var ativList = ativState.arrayAtividades || [];
            var ativIndex = (index) ? ativList.findIndex((obj => obj.id_demanda == index)) : index;
            if (ativIndex >= 0 && ativList[ativIndex]) ativList[ativIndex].assunto = value;
            if (ativIndex >= 0 && ativState.arrayAtividadesPro && ativState.arrayAtividadesPro[ativIndex]) ativState.arrayAtividadesPro[ativIndex].assunto = value;
            console.log('saveFollowDesc', ativIndex);
            if (type_container == 'table' && $('.kanban-item').is(':visible')) {
                var kanban_item = $('.kanban-item[data-eid="_id_'+index+'"] .content_desc');
                    kanban_item.find('span.info').text(value);
                    kanban_item.find('span.info_txt input').val(value);
            }
        } else if (mode == 'monitorado') {
            var storeMonitorados = getStoreMonitoradoPro();
            var monitoradoIndex = (id_procedimento) ? storeMonitorados.monitorados.findIndex((obj => obj.id_procedimento == id_procedimento)) : index;
                storeMonitorados['monitorados'][monitoradoIndex].descricao = value;
                localStorageStorePro('configDataMonitoradosPro', storeMonitorados);
        }
    }
}
export function editFollowDesc(this_, mode) {
    var type_container = ($(this_).closest('.kanban-content').length > 0) ? 'kanban' : 'table';
    var _container = (type_container == 'kanban') ? $(this_).closest('.kanban-container') : $(this_).closest('table');
    var _all_desc = _container.find('.content_desc');
    var _content = (type_container == 'kanban') ? $(this_).closest('.kanban-content') : $(this_).closest('tr');
    var _content_desc = _content.find('.content_desc');
    var info = _content_desc.find('span.info');
    var info_txt = _content_desc.find('span.info_txt');
        showFollowEtiqueta(this_, 'close', mode);
    if (info.is(':visible')) {
        _all_desc.find('span.info').show();
        _all_desc.find('span.info_txt').hide();
        info.hide();
        info_txt.show().find('input').focus().trigger('click');
        info_txt.show().find('input').select();  
    } else if (info.is(':hidden')) {
        info.show();
        info_txt.hide();
        parent.saveFollowDesc(this_, mode);
    }
}
export function keyFollowDesc(e, mode) {
    if(e.which == 13) {
        var target = (e && e.target) ? e.target : (e && e.currentTarget) ? e.currentTarget : (e && e.path && e.path.length > 0) ? e.path[0] : false;
        if (target) parent.saveFollowDesc(target, mode);
        if (mode == 'monitorado') {
            saveConfigMonitorado();
        }
    }
}
export function showFollowEtiqueta(this_, status, mode) {
    var _this = $(this_);
    var table = _this.closest('table');
    var td = _this.closest('td');
    var td_info_tags_follow = td.find('.info_tags_follow');
    if(status == 'close' && td.find('input.tag-input').val() != '') {
        td.find('input.tag-input').trigger($.Event( "keypress", { which: 13 } ));
    }
    checkEtiquetaPriority(this_); 
    table.find('.info_tags_follow').show();
    table.find('.info_tags_follow_txt').hide();
    table.find('.followLinkTags').show();
    table.find('.btnCloseEtiqueta').remove();
    var emptyTagsClass = td.hasClass('seipro-monitorado-tags-cell') || mode == 'monitorado' ? 'seipro-monitorado-tags-empty' : 'info_tags_follow_empty';
    td.removeClass(emptyTagsClass == 'seipro-monitorado-tags-empty' ? 'info_tags_follow_empty' : 'seipro-monitorado-tags-empty');
    if (td_info_tags_follow.length > 0 && td_info_tags_follow.html().trim() == '') {
        td.addClass(emptyTagsClass);
    } else {
        td.removeClass(emptyTagsClass);
    }
    if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    if(status == 'show') {
        var btnClose =  '<a class="newLink btnCloseEtiqueta" onclick="parent.showFollowEtiqueta(this, \'close\', \''+mode+'\')" onmouseover="return infraTooltipMostrar(\'Fechar\');" onmouseout="return infraTooltipOcultar();">'+
                        '   <i class="fas fa-check-square cinzaColor" style="font-size: 100%;"></i>'+
                        '</a>';
        td.find('.followLinkTags').hide();
        td_info_tags_follow.not('.info_tags_user').hide();
        td.find('.info_tags_follow_txt').show().find('input.tag-input').focus().trigger('click').after(btnClose);
        addOptionsEtiqueta(this_, mode);
    } 
    setTimeout(function(){ 
        if (status == 'close' && mode == 'monitorado' && !_this.closest('tr').find('.content_desc span.info_txt').is(':visible')) {
            saveConfigMonitorado();
        }
    }, 500);
    if ($($ifrVisualizacao).length > 0) {
        $($ifrVisualizacao)[0].contentWindow.infraTooltipOcultar();
    }
}
export function checkEtiquetaPriority(this_) {
    var tr = $(this_).closest('tr');
    if (tr.hasClass('tagTableName_urgente')) {
        // tr.css('background-color','#f9e2e0');
        tr.addClass('importanteBoxDisplay');
    } else if (tr.hasClass('tagTableName_importante')) {
        // tr.css('background-color','#fffcd7');
        tr.addClass('urgenteBoxDisplay');
    } else {
        // tr.css('background-color','');
        tr.removeClass('urgenteBoxDisplay').removeClass('importanteBoxDisplay');
    }
}
export function getColorTags(mode) {
    var ativState = atividadesState();
    var colorTags = (mode == 'ativ') 
            ? (ativState.arrayConfigAtivUnidade && ativState.arrayConfigAtivUnidade.config && ativState.arrayConfigAtivUnidade.config.etiquetas)
                ? ativState.arrayConfigAtivUnidade.config.etiquetas.config.colortags
                : []
            : getStoreMonitoradoPro().config.colortags;
        colorTags = (typeof colorTags !== 'undefined') ? colorTags : [];
    return colorTags;
}
export function addOptionsEtiqueta(this_, mode) {
    var colorTags = getColorTags(mode);
    $(this_).closest('table').find('.tagMonitoradoAddColor, .tagMonitoradoAddColorInput, .tagMonitoradoEditIcon').remove();
    $(this_).closest('table').find('.tagsinput .tag').each(function(){
        var tagNamed = $(this).find('.tag-text').text();
        var tagName = removeAcentos(tagNamed).replace(/\ /g, '').toLowerCase();
        var tags = jmespath.search(colorTags, "[?name=='"+tagName+"'].value | [0]");
        var colorValue = (tags !== null && tags.length > 0) ? tags : '';
            colorValue = (colorValue == '') ? '#bfd5e8' : colorValue;
            colorValue = (tagName == 'urgente' && tags === null) ? '#c24242' : colorValue;
            colorValue = (tagName == 'importante' && tags === null) ? '#da9d2a' : colorValue;
        var iconValue = (jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | length(@)") > 0) ? jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | [0]") : '';
            iconValue = (iconValue == '') ? 'tag' : iconValue;
            iconValue = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'exclamation' : iconValue;
        var textColour = (colorValue != '') ? (getBrightnessColor(colorValue) > 125) ? 'black' : 'white' : '';
            textColour = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'white' : textColour;
        var backgroundColor = ($(this).data('colortag')) ? $(this).data('colortag') : colorValue;
        var htmlOptions =   '<input type="color" class="tagMonitoradoAddColorInput" value="'+backgroundColor+'" onchange="parent.changeColorEtiqueta(this, \''+mode+'\')">'+
                            '<i class="tagMonitoradoEditIcon fas fa-'+iconValue+'" data-icontag="'+iconValue+'" onclick="parent.openBoxIconsFA(\'selectIconEtiqueta\', \''+tagName+'\', \''+mode+'\')" onmouseover="return infraTooltipMostrar(\'Alterar \u00EDcone\');" onmouseout="return infraTooltipOcultar();"></i>'+
                            '<i class="tagMonitoradoAddColor fas fa-fill-drip" onclick="parent.openColorEtiqueta(this)" onmouseover="return infraTooltipMostrar(\'Alterar cor\');" onmouseout="return infraTooltipOcultar();"></i>';
        if (colorValue != '') {
            $(this).css({'background-color': colorValue, 'color': textColour}).find('.tag-text').css('color',textColour);
        }
        $(this).addClass('tagTableText_'+tagName);
        $(this).append(htmlOptions);
    });
}
export function openColorEtiqueta(this_) {
    $(this_).closest('.tag').find('input[type="color"]').trigger('click');
}
export function selectIconEtiqueta(this_, tagName, mode) {
    var table = (mode == 'ativ') 
            ? $('.tableAtividades').is(':visible') 
                ? $('.tableAtividades tbody, .atividadeInfo') 
                : $('.kanbanAtividade, .atividadeInfo')
            : $('.seipro-table-monitorados tbody');
        table = ($($ifrVisualizacao).contents().find('.seipro-monitorados-label-options').length > 0) ? $($ifrVisualizacao).contents().find('.seipro-monitorados-label-options table') : table;
        table = (mode == 'options') ? $('#dialogBoxPro') : table;
    var icon = $(this_).find('.iconListTxt').text();
    var value = table.find('.tag_text.tagTableText_'+tagName).data('colortag');
    table.find('.tag_text.tagTableText_'+tagName).attr('data-icontag', icon).data('icontag', icon).find('i.tagicon').attr('class', 'fas fa-'+icon);
    table.find('.tag.tagTableText_'+tagName).attr('data-icontag', icon).data('icontag', icon).find('i.tagMonitoradoEditIcon').attr('data-icontag', icon).data('icontag', icon).attr('class', 'tagMonitoradoEditIcon fas fa-'+icon);
    resetDialogBoxPro('alertBoxPro');
    $('#listIconsFontAwesome').remove();
    if (mode != 'options') saveConfigEtiqueta(tagName, value, icon, mode);
}
export function changeColorEtiqueta(this_, mode) {
    var value = $(this_).val();
    var textColour = (getBrightnessColor(value) > 125) ? 'black' : 'white';
    var tagNamed = (mode == 'options') ? 'afastamento' : removeAcentos($(this_).closest('.tag').find('.tag-text').text()).replace(/\ /g, '').toLowerCase();
    var tagName = 'tagTableText_'+tagNamed;
    var index = parseInt($(this_).closest('tr').data('index'));
    var icon = $(this_).closest('.tag').find('.tagMonitoradoEditIcon').data('icontag');
    var table = (mode == 'options') ? $(this_).closest('.seiProForm') : $(this_).closest('tbody');
        table.find('.'+tagName).attr('data-colortag',value).attr('data-textcolor',textColour).data('colortag',value).data('textcolor',textColour).css({'background-color': value, 'color': textColour}).find('.tag-text').css('color', textColour).find('.tagicon').css('color', textColour);
        table.find('.'+tagName).find('.tagicon').css('color', textColour);
        table.find('.'+tagName+' .tagMonitoradoAddColorInput').val(value);
        if (mode != 'options') saveConfigEtiqueta(tagNamed, value, icon, mode);
}
export function saveConfigEtiqueta(name, value, icon, mode) {
    var ativState = atividadesState();
    var storeEtiqueta = (mode == 'ativ') 
            ? (ativState.arrayConfigAtivUnidade && ativState.arrayConfigAtivUnidade.config && ativState.arrayConfigAtivUnidade.config.etiquetas)
                ? ativState.arrayConfigAtivUnidade.config.etiquetas : {config: {colortags: []}}
            : getStoreMonitoradoPro();
            // console.log(storeEtiqueta);
    var colorTags = (Object.keys(storeEtiqueta).length > 0 && typeof storeEtiqueta.config.colortags !== 'undefined') 
                        ? storeEtiqueta.config.colortags : [];
    if (colorTags.findIndex((obj => obj.name == name)) != -1) {
        var index = colorTags.findIndex((obj => obj.name == name));
        storeEtiqueta['config']['colortags'][index] = {name: name, value: value, icon: icon};
    } else {
        storeEtiqueta['config']['colortags'].push({name: name, value: value, icon: icon});
    }
    
    if (mode == 'ativ' || mode == 'tipo_ativ') {
        if (ativState.arrayConfigAtivUnidade && ativState.arrayConfigAtivUnidade.config && ativState.arrayConfigAtivUnidade.config.etiquetas) {
            ativState.arrayConfigAtivUnidade.config.etiquetas.config = storeEtiqueta.config;
        } else {
            var itemPushConfig = ativState.arrayConfigAtivUnidade['config'];
                itemPushConfig['etiquetas'] = {config: storeEtiqueta.config};
            ativState.arrayConfigAtivUnidade['config'] = itemPushConfig;
            console.log(itemPushConfig, ativState.arrayConfigAtivUnidade['config']);
        }
        var _ativServer = getAtividadesServer(); if (_ativServer) _ativServer({action: 'edit_etiqueta_config', config_etiquetas: ativState.arrayConfigAtivUnidade['config']['etiquetas']}, 'edit_etiqueta_config');
    } else if (mode == 'monitorado') {
        localStorageStorePro('configDataMonitoradosPro', storeEtiqueta);
    }
}
export function saveFollowEtiqueta() {
    var ativState = atividadesState();
    var mode = $(this).closest('td').data('etiqueta-mode');
    if ($(this).closest('.info_tags_follow_txt').is(':visible')) {
        var tags = $(this).closest('.info_tags_follow_txt').find('.tag-text').map(function () { return $(this).text(); }).get();
        var tagsHtml = $.map(tags, function (value) { return getHtmlEtiqueta(value, mode) }).join('');
        var tagsMonitoradoClass = $.map(tags, function (value) { return 'tagTableName_'+removeAcentos(value).replace(/\ /g, '').toLowerCase(); }).join(' ');   
        var index = parseInt($(this).closest('tr').data('index'));
            $(this).closest('td').find('.info_tags_follow').html(tagsHtml);
            $(this).closest('tr').attr('class',tagsMonitoradoClass);
            addOptionsEtiqueta(this, mode);
        if (typeof $('.ui-autocomplete-input').autocomplete !== 'undefined') {
            $('.ui-autocomplete-input').autocomplete("option", { source: sugestEtiquetaPro(mode) });
        }
        if (mode == 'ativ') {
            if ($('div.ui-dialog').is(':visible')) {
                $('.kanban-item[data-eid="_id_'+index+'"] .info_tags_follow_etiquetas').html(tagsHtml);
                $('.tableAtividades tbody tr[data-index="'+index+'"] td.tdmonitorado_tags .info_tags_follow').html(tagsHtml);
            }
            var _ativServer = getAtividadesServer(); if (_ativServer) _ativServer({action: 'edit_etiqueta', id: index, etiquetas: tags}, 'edit_etiqueta');
            if (ativState.arrayConfigAtividades && ativState.arrayConfigAtividades.etiquetas && typeof ativState.arrayConfigAtividades.etiquetas.list !== 'undefined') {
                $.each(tags, function(i,value){
                    if (value != '' && $.inArray(value, ativState.arrayConfigAtividades['etiquetas']['list']) == -1) {
                        ativState.arrayConfigAtividades['etiquetas']['list'].push(value);
                    }
                });
            }
            var demandaIndex = (ativState.arrayAtividades || []).findIndex((obj => obj.id_demanda == index));
            if (demandaIndex != -1) {
                ativState.arrayAtividades[demandaIndex].etiquetas = tags;
                if (ativState.arrayAtividadesPro && ativState.arrayAtividadesPro[demandaIndex]) ativState.arrayAtividadesPro[demandaIndex].etiquetas = tags;
            }
        } else if (mode == 'tipo_ativ') {
            console.log(index, tags);
            var _ativServer = getAtividadesServer(); if (_ativServer) _ativServer({action: 'edit_etiqueta_atividades', id: index, etiquetas: tags}, 'edit_etiqueta_atividades');
            if (ativState.arrayConfigAtividades && ativState.arrayConfigAtividades.etiquetas && typeof ativState.arrayConfigAtividades.etiquetas.list !== 'undefined') {
                $.each(tags, function(i,value){
                    if (value != '' && $.inArray(value, ativState.arrayConfigAtividades['etiquetas']['list']) == -1) {
                        ativState.arrayConfigAtividades['etiquetas']['list'].push(value);
                    }
                });
            }
            var atividadeIndex = tableConfigList.atividades.findIndex((obj => obj.id_atividade == index));
            if (atividadeIndex != -1) {
                tableConfigList.atividades[atividadeIndex].etiquetas = tags;
            }
        } else if (mode == 'monitorado') {
            var storeMonitorados = getStoreMonitoradoPro();
            var id_procedimento = parseInt($(this).closest('tr').data('id_procedimento'));
            var monitoradoIndex = storeMonitorados.monitorados.findIndex((obj => obj.id_procedimento == id_procedimento));
            storeMonitorados['monitorados'][monitoradoIndex].etiquetas = tags;
            localStorageStorePro('configDataMonitoradosPro', storeMonitorados);
        }
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    }
}
// normalizeNameTag migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
export function sugestEtiquetaPro(mode) {
    var ativState = atividadesState();
    return (mode == 'ativ') 
        ? (ativState.arrayConfigAtividades && typeof ativState.arrayConfigAtividades.etiquetas !== 'undefined' ? ativState.arrayConfigAtividades['etiquetas']['list'] : [])
        : uniqPro($.map(getStoreMonitoradoPro()['monitorados'], function (value) { return value.etiquetas; }));
}
export function getHtmlEtiqueta(name, mode) {
    var colorTags = getColorTags(mode);
    var tagName = removeAcentos(name).replace(/\ /g, '').toLowerCase();
    var tags = jmespath.search(colorTags, "[?name=='"+tagName+"'].value | [0]");
    var backgroundColor = (tags !== null && tags.length > 0) ? tags : '';
        backgroundColor = (tagName == 'urgente' && tags === null) ? '#c24242' : backgroundColor;
        backgroundColor = (tagName == 'importante' && tags === null) ? '#da9d2a' : backgroundColor;
    var iconTag = (jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | length(@)") > 0) ? jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | [0]") : 'tag';
        iconTag = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'exclamation' : iconTag;
    var textColour = (backgroundColor != '') ? (getBrightnessColor(backgroundColor) > 125) ? 'black' : 'white' : '';
        textColour = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'white' : textColour;
    var styleTag = (backgroundColor != '') ? 'style="background-color: rgb('+$.map(hexToRgb(backgroundColor),function(e){ return e }).join(", ")+'); color: '+textColour+'"' : '';
    return '<span data-colortag="'+backgroundColor+'"  data-type="etiqueta" data-icontag="'+iconTag+'" '+styleTag+' data-tagname="'+tagName+'" data-textcolor="'+textColour+'" class="tag_text tagTableText_'+tagName+'" onclick="parent.filterTagView(this)"><i class="tagicon fas fa-'+iconTag+'" style="font-size: 90%;margin: 0 2px; color: '+textColour+'"></i> '+name+'</span>'; 
}
// getDatesFormatBR migrada para SeiPro.core.datas (src/core/datas.js) — Fase 6
// getDatesPreview / configDatesPreview / getProgressPreview migradas para
// src/shared/ui/prazo-preview.js (infra de view COMPARTILHADA, instalada no core-stack;
// globais preservados via aliasGlobal). updateTablePrazoProcesso migrada para
// src/features/controlar-prazos/sei-pro-controle-prazo.js.
export function openBoxIconsFA(action, nametag, mode) {
    var htmlBox = '<div id="listIconsFontAwesome">'+
                  '    <input type="text" id="searchIconFA" onkeyup="filterIconsFA()" placeholder="Filtrar pelo nome...">';
        $.each(listIconsFontAwesome, function(i,value){
            htmlBox += '<span class="iconList" onclick="'+action+'(this, \''+nametag+'\', \''+mode+'\')"><i class="fas fa-'+value+' azulColor"></i> <span class="iconListTxt">'+value+'</span></span>';
        });
        htmlBox += '</div>';
    
        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div>'+htmlBox+'</div>')
            .dialog({
                title: "Icones",
                close: function() { $('#listIconsFontAwesome').remove() },
                width: 800
        });
}
export function filterIconsFA() {
  var filter = $('#searchIconFA').val().toUpperCase();
      $("#listIconsFontAwesome").find('.iconList').each(function(){
        if ($(this).find('.iconListTxt').text().toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
      });
}
export function setOrderMenuSEISortable() {
    let arrayOrder = getOptionsPro('orderMenuSEI')
        arrayOrder = !!arrayOrder ? arrayOrder.reverse() : false;
    if (arrayOrder) {
        arrayOrder.forEach(function(v){
            var elem = $(idMenu+' > li').map(function(t){ if ($(this).find('a').eq(0).text().trim() == v) return this });
            elem.prependTo(idMenu);
        });
    }
}
export function saveOrderMenuSEISortable() {
    let arrayOrder = $(idMenu+' > li').map(function(){
        return $(this).find('a').eq(0).text();
    }).get();
    setOptionsPro('orderMenuSEI', arrayOrder);
}
export function initMenuSEISortable(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().sortable !== 'undefined') { 
        menuSEISortable();
    } else {
        setTimeout(function(){ 
            initMenuSEISortable(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initMenuSEISortable'); 
        }, 500);
    }
}
export function menuSEISortable() {
    if (typeof $().sortable !== 'undefined') {
        $(idMenu).sortable({
            items: '> li',
            cursor: 'pointer',
            axis: 'y',
            dropOnEmpty: false,
            start: function (e, ui) {
                ui.item.addClass("selected");
            },
            stop: function (e, ui) {
                ui.item.removeClass("selected");
                saveOrderMenuSEISortable();
            }
        });
        setOrderMenuSEISortable();
    }
}
export function configFlashMenuTrPro(value, color, state, mode) { 
    var index = randomString(4);
    return  '        <tr>'+
            '           <td>'+
            '               <p><i class="iconPopup fa '+value.icon+' '+color+'"></i><span class="info">'+value.name+'</span></p>'+
            '           </td>'+
            '           <td>'+
            '               <div class="onoffswitch">'+
            '                   <input type="checkbox" data-name="'+value.name+'" onchange="changeFlashMenuPro(this, \''+mode+'\')" name="onoffswitch" class="onoffswitch-checkbox" id="itemFlashMenu_'+index+'" tabindex="0" '+state+'>'+
            '                   <label class="onoff-switch-label" for="itemFlashMenu_'+index+'"></label>'+
            '               </div>'+
            '           </td>'+
            '        </tr>';
}
export function configFlashMenuPro(arrayLinksArvore) { 
    var selectedItensMenu = ( typeof localStorageRestorePro('configViewFlashMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashMenuPro')) ) ? localStorageRestorePro('configViewFlashMenuPro') : [['Incluir Documento'],['Consultar/Alterar Processo'],['Enviar Documento Externo'],['Atribuir Processo'],['Add/Remover Urg\u00EAncia']];
    var selectedItensDocMenu = ( typeof localStorageRestorePro('configViewFlashDocMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocMenuPro')) ) ? localStorageRestorePro('configViewFlashDocMenuPro') : [['Copiar n\u00FAmero SEI'],['Copiar nome do documento'],['Copiar link do documento']];
    var selectedItensDocArvore = ( typeof localStorageRestorePro('configViewFlashDocArvorePro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocArvorePro')) ) ? localStorageRestorePro('configViewFlashDocArvorePro') : [["Copiar n\u00FAmero SEI"],["Copiar link do documento"],["Duplicar documento"]];
    var selectedItensPanelArvore = ( typeof localStorageRestorePro('configViewFlashPanelArvorePro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashPanelArvorePro')) ) ? localStorageRestorePro('configViewFlashPanelArvorePro') : [["Anota\u00E7\u00F5es"],["Marcador"],["Acompanhamento Especial"],["Tipo de Procedimento"],["Assuntos"],["Interessados"],["Atribui\u00E7\u00E3o"],["N\u00EDvel de Acesso"],["Observa\u00E7\u00F5es"]];

    var textBox =   '<div id="flashMenu_tabs" style="border: none; min-height: 300px; margin: 0;">'+
                    '   <ul style="font-size: 10px;">'+
                    '       <li><a href="#tabs_flashMenuPro"><i class="fa fa-scroll cinzaColor"></i> Processo</a></li>'+
                    '       <li><a href="#tabs_flashDocMenuPro"><i class="fa fa-file cinzaColor"></i> Documentos</a></li>'+
                    '       <li><a href="#tabs_flashDocArvorePro"><i class="fa fa-tree cinzaColor"></i> \u00C1rvore</a></li>'+
                    '       <li><a href="#tabs_flashPanelArvorePro"><i class="fa fa-info-circle cinzaColor"></i> Painel</a></li>'+
                    '   </ul>'+
                    '   <div id="tabs_flashMenuPro">'+
                    '       <h3 style="font-weight: bold; color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar menu do processo" data-mode="menuproc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_proc" tabindex="0" '+(getOptionsPro('optionsFlashMenu_menuproc') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoff-switch-label" for="optionFlashMenu_proc"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-scroll cinzaColor"></i> Menu r\u00E1pido do processo'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_menuproc '+(getOptionsPro('optionsFlashMenu_menuproc') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashMenu" style="font-size: 10pt;width: 100%;">';
    
        $.each(selectedItensMenu,function(index, value){
            if ( jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'proc');
            }         
        });
        $.each(iconsFlashMenu,function(index, value){
            if ( jmespath.search(selectedItensMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'proc');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';
    
        textBox +=  '   <div id="tabs_flashDocMenuPro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar menu dos documentos" data-mode="menudoc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_doc" tabindex="0" '+(getOptionsPro('optionsFlashMenu_menudoc') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoff-switch-label" for="optionFlashMenu_doc"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-file cinzaColor"></i> Menu r\u00E1pido dos documentos'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_menudoc '+(getOptionsPro('optionsFlashMenu_menudoc') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocMenu" style="font-size: 10pt;width: 100%;">';
    
    var statusMenuClick = ( jmespath.search(selectedItensDocMenu, "[?[0]=='Ativar menu ao clicar'] | length(@)") > 0 ) ? {chekbox: 'checked', class: 'azulColor'} : {chekbox: '', class: 'cinzaColor'};    
    textBox += configFlashMenuTrPro({name: "Ativar menu ao clicar", icon: "fas fa-mouse-pointer", alt: ""}, statusMenuClick.class, statusMenuClick.chekbox, 'doc');
    
        $.each(selectedItensDocMenu,function(index, value){
            if ( jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'doc');
            }         
        });
        $.each(iconsFlashDocMenu,function(index, value){
            if ( jmespath.search(selectedItensDocMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'doc');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';

        textBox +=  '   <div id="tabs_flashDocArvorePro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar icones na arvore" data-mode="iconstree" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_tree" tabindex="0" '+(getOptionsPro('optionsFlashMenu_iconstree') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoff-switch-label" for="optionFlashMenu_tree"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-tree cinzaColor"></i> \u00CDcones r\u00E1pidos na \u00E1rvore'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_iconstree '+(getOptionsPro('optionsFlashMenu_iconstree') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';    
        $.each(selectedItensDocArvore,function(index, value){
            if ( jmespath.search(iconsFlashDocArvore, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashDocArvore, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'tree');
            }         
        });
        $.each(iconsFlashDocArvore,function(index, value){
            if ( jmespath.search(selectedItensDocArvore, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'tree');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';

        textBox +=  '   <div id="tabs_flashPanelArvorePro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar painel de informa\u00E7\u00F5es na arvore" data-mode="panelinfo" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_panelinfo" tabindex="0" '+(getOptionsPro('optionsFlashMenu_panelinfo') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoff-switch-label" for="optionFlashMenu_panelinfo"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-info-circle cinzaColor"></i> Painel de Informa\u00E7\u00F5es na \u00E1rvore'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_panelinfo '+(getOptionsPro('optionsFlashMenu_panelinfo') == 'disabled' ? 'disableOptions' : '')+'">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';    
        $.each(selectedItensPanelArvore,function(index, value){
            if ( jmespath.search(iconsFlashPanelArvore, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashPanelArvore, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'panel');
            }         
        });
        $.each(iconsFlashPanelArvore,function(index, value){
            if ( jmespath.search(selectedItensPanelArvore, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'panel');
            }            
        });
        textBox +=  '           </table>'+
                    '       </div>'+
                    '   </div>'+
                    '</div>';
    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</div>')
        .dialog({
            title: "Personalizar Menu R\u00E1pido",
        	width: 600,
        	open: function(){
                $('#flashMenu_tabs').tabs();
                setTimeout(function(){ 
                    centralizeDialogBox(dialogBoxPro);
                }, 100);
            },
        	buttons: [{
                text: "Ok",
                click: function() { 
                    var ifrArvore = getIframeArvoreElement();
                    if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    }).on('dialogclose', function(event) {
         var ifrArvore = getIframeArvoreElement();
         if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
     });
    $(".tableFlashMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'proc');
        }
    });
    $(".tableFlashDocMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'doc');
        }
    });
    $(".tableFlashDocArvore").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'tree');
        }
    });
}
export function changeFlashMenuGeneralPro(this_) {
    var _this = $(this_);
    var mode = _this.data('mode');
    var _parent = _this.closest('.dialogBoxDiv');
    var status = _this.is(':checked');
    var status_var = (status) ? 'enabled' : 'disabled';
    if (status) {
        _parent.find('.optionsFlashMenu_'+mode).removeClass('disableOptions');
    } else {
        _parent.find('.optionsFlashMenu_'+mode).addClass('disableOptions');
    }
    setOptionsPro('optionsFlashMenu_'+mode, status_var);
    console.log('.optionsFlashMenu_'+mode, status, status_var);
}
export function changeFlashMenuPro(this_, mode) {
    var configView = '';
    if (mode == 'proc') {
        configView = 'configViewFlashMenuPro';
    } else if (mode == 'doc') {
        configView = 'configViewFlashDocMenuPro';
    } else if (mode == 'tree') {
        configView = 'configViewFlashDocArvorePro';
    } else if (mode == 'panel') {
        configView = 'configViewFlashPanelArvorePro';
    } 
    var arrayShowItensMenu = []
    $(this_).closest('table').find('input').each(function(){
        if ($(this).is(':checked')) {
            arrayShowItensMenu.push([$(this).data('name')]);
            $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        } else {
            $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
        }
    });
    console.log(configView, arrayShowItensMenu);
    localStorageStorePro(configView, arrayShowItensMenu);
}
export function addUrgenteProcessoPro() {
    var id_procedimento = dadosProcessoPro.propProcesso.hdnIdProcedimento;
    var new_text = dadosProcessoPro.propProcesso.txtDescricao;
        new_text = typeof new_text !== 'undefined' && new_text.toLowerCase().indexOf('(urgente)') === -1 
                        ? new_text+' (URGENTE)' 
                        : (typeof new_text !== 'undefined' && new_text.toLowerCase().indexOf('(urgente)') !== -1) ? new_text.replace(/\(urgente\)/ig,'').trim() : false; 
    var checkUrgencia = typeof new_text !== 'undefined' && new_text && new_text.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
    var modeUrgencia = checkUrgencia ? 'Adicionada' : 'Removida';
    var txtUrgencia = modeUrgencia+' marca de urg\u00EAncia no processo';

    updateDadosArvore('Consultar/Alterar Processo', 'txtDescricao', new_text, id_procedimento, function(){ 
        dadosProcessoPro.propProcesso.txtDescricao = new_text;
        // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
        setSessionProcessosPro(dadosProcessoPro);
        resetDialogBoxPro('dialogBoxPro');
        alertaBoxPro('Sucess', 'check-circle', txtUrgencia); 
    });
}
export function dialogCopyNewDoc(doc) {
    var textBox =   '<div>Digite o n\u00FAmero do processo que deseja copiar o documento <span style="display: inline-block; padding: 3px 5px; margin: 3px 5px;background: #eaeaea; border-radius: 5px; color: #666;">'+doc.text().trim()+'</span></div>'+
                    '<div class="dialogBoxDiv seiProForm">'+
                    '   <input onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="dialogBoxProcesso" type="text" style="font-size: 10pt; width: 80%;">'+
                    '</div>';
    removeOptionsPro('currentCloneDoc');

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            width: 450,
            title: 'Copiar documento para outro processo',
            buttons: [{
                text: "Copiar",
                class: 'confirm ui-state-active',
                open: function() {
                    appendAutocompleteProc(this, $('#dialogBoxProcesso'));
                },
                click: function() {
                    loadingButtonConfirm(true);
                    getIDProtocoloSEI($('#dialogBoxProcesso').val().trim(),  
                        function(html){
                            let $html = $(html);
                            var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                            $('#ifrArvore')[0].contentWindow.getDadosDoc(doc, params.id_procedimento);    
                        }, 
                        function(){
                            alertaBoxPro('Error', 'exclamation-triangle', 'Protocolo n\u00E3o encontrado!');
                            loadingButtonConfirm(false);
                        }
                    );
                }
            }]
    });
}
export const appendAutocompleteProc = (this_, elem) => {
    const sourceAutocomplete = jmespath.search(objProcessosUnidadePro, '[*].{especificacao: especificacao, processo_sei: processo_sei}')
    .map(item => ({
        label: `${item.processo_sei}${item.especificacao ? ' - ' + item.especificacao : ''}`,
        value: item.processo_sei
    }));

    elem.autocomplete({
        source: sourceAutocomplete,
        minLength: 0 // Permite abrir o menu sem precisar digitar
    }).focus(function () {
        $(this).autocomplete("search", ""); // Força a abertura do menu ao focar
    });

    setTimeout(() => {
        $(this_).closest('.ui-dialog').css('overflow','visible');
        elem.focus();
    }, 100);
};
