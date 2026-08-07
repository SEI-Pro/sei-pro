// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Kanban na lista de processos — cluster da feature.
 */
import { callAtividades } from './atividades-bridge.js';
import {
    getAllMarcadoresHome,
    getListTypes,
    getPanelProc,
    initAddKanbanProc,
    loadKanbanStylePro,
    storeGroupTablePro
} from './modules.js';

export function addKanbanProc(type = storeGroupTablePro(), loop = 3) {
    if (typeof jKanban === 'undefined') {
        loadKanbanStylePro();
        $.getScript(URL_SPRO+"js/lib/jkanban.min.js");
    }
    if (!type || type == 'all' || type == '') {
        setOptionsPro('panelProcessosView', 'Tabela');
        // Chamada direta no mundo isolado (evita .trigger('click') → MAIN onclick).
        var btnTabela = document.querySelector('#processosProActions .btn[data-value="Tabela"]');
        if (btnTabela) getPanelProc(btnTabela);
    } else {
        var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        if (type == 'users') {
            if (getOptionsPro('arrayListUsersSEI') && getOptionsPro('arrayListUsersSEI').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('arrayListUsersSEI'),function(v){
                    return (typeof getAtribuicaoDisplayLabel === 'function')
                        ? getAtribuicaoDisplayLabel(v.name, v.name, checkConfigValue('nomesusuarios'))
                        : v.name;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaAtribuicao();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else if (type == 'tags') {
            if (getOptionsPro('listaMarcadores') && getOptionsPro('listaMarcadores').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('listaMarcadores'),function(v){
                    return v.name;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaMarcador();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else {
            var itensKanban = getListTypes(type);
            $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
        }
        if (!!itensKanban && type != '') {
            itensKanban = $.map(itensKanban, function(v, i){ return {order: i, name: v, id: getTagName(v, type)} });
            var tr = tableProc.find('tr[data-tagname]:not(.tagintable)');
            var itens = tr.map(function(){ 
                    var tagName = $(this).data('tagname');
                    var idTag = 'id_'+tagName;
                    var itemBoard = $.grep(itensKanban, function(item){ return item.id == tagName; })[0];
                    var nameLabel = (itemBoard && itemBoard.name !== '') ? itemBoard.name : 'Sem Grupo';
                    var linkProc = $(this).find('a[href*="acao=procedimento_trabalhar"]');
                    var tip = extractTooltipToArray(linkProc.attr('onmouseover'));
                        tip = (typeof tip !== 'undefined') ? tip : false;
                    var linkParams = getParamsUrlPro(linkProc.attr('href'));
                    var id_protocolo = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
                    if (id_protocolo !== false && id_protocolo !== 'false' && id_protocolo !== '' && id_protocolo !== null && typeof id_protocolo !== 'undefined') {
                        return {
                            id: idTag,
                            title: nameLabel,
                            id_protocolo: String(id_protocolo),
                            processo: linkProc.text(),
                            especificacao: tip ? tip[0] : false,
                            tipo: tip ? tip[1] : false,
                            html_icons: $(this).find('td').eq(1).html(),
                            html_proc: $(this).find('td').eq(2).html(),
                            html_atribuicao: $(this).find('td').eq(3).html(),
                            html_prazo: $(this).find('td.seipro-prazo-box-display').html(),
                            color: $(this).data('color') ? $(this).css('color') : false
                        }
                    }
            }).get();

            $('#processosKanban').remove();
            $('#newFiltro').after('<div id="processosKanban" style="display: inline-block;margin-top: 60px;width: 100%;"></div>');

            var bords_list = $.map(itensKanban, function(v, i){
                var item = $.grep(itens, function(row){ return row.id == 'id_'+v.id; });
                var title = v.name == '' ? 'Sem Grupo' : v.name;
                    title = ((type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && title.indexOf('.') !== -1 ) ? title.split('.')[1] : title;
                var boardOrderStore = getOptionsPro('panelProcessosOrder_'+type);
                var boardOrderItem = (boardOrderStore && $.isArray(boardOrderStore)) ? $.grep(boardOrderStore, function(row){ return row.id == v.id; })[0] : null;
                var order_board = boardOrderItem && typeof boardOrderItem.order !== 'undefined' ? boardOrderItem.order : i;
                    order_board = order_board === null ? 9999 : order_board;
                var collapse_board = boardOrderItem && typeof boardOrderItem.collapse !== 'undefined' ? boardOrderItem.collapse : false;

                var itens_board = $.map(item,function(value, index){
                    if (!value || !value.id_protocolo || value.id_protocolo === 'false') {
                        return;
                    }

                    var iten_urgente = value.especificacao && value.especificacao.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
                    var item_pinboard = false;
                    var order_item = false;
                    if (boardOrderItem && $.isArray(boardOrderItem.itens)) {
                        order_item = $.grep(boardOrderItem.itens, function(row){ return row.id == String(value.id_protocolo); })[0] || false;
                    }
                        item_pinboard = order_item === null || order_item === false ? item_pinboard : order_item.pinboard;
                        order_item = order_item === null || order_item === false ? 9999 : order_item.order;
                        order_item = iten_urgente ? -1 : order_item;
                    var pinBoard = '<span style="float: right;margin: -5px -10px 0 0;" class="kanban-pinboard info_noclick"><a class="newLink info_noclick '+(item_pinboard ? 'newLink_active' : '')+'" onclick="pinKanbanItensProc(this, '+value.id_protocolo+')" onmouseover="return infraTooltipMostrar(\''+(item_pinboard ? 'Remover do topo' : 'Fixar no topo')+'\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-thumbtack cinzaColor"></i></a></span>';
                    
                    return {
                        id: value.id_protocolo,
                        order: order_item,
                        title:  pinBoard+
                                '<div class="kanban-content">'+
                                '   <div class="kanban-title-card content_edit" data-field="assunto" data-id="'+value.id_protocolo+'">'+
                                '       <span class="info" data-type="proc" style="width: 75%;">'+
                                '           '+value.html_proc+
                                '           <a class="newLink info_noclick followLinkNewtab" href="controlador.php?acao=procedimento_trabalhar&id_procedimento='+value.id_protocolo+'" onmouseover="return infraTooltipMostrar(\'Abrir em nova aba\');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>'+
                                '       </span>'+
                                '   </div>'+
                                '   <div class="kanban-description">'+
                                '       <span class="sub info_noclick" data-type="especificacao">'+value.especificacao+'</span>'+
                                '       <span class="sub info_noclick" data-type="tipo">'+value.tipo+'</span>'+
                                '       <span class="sub info_noclick" data-type="atribuicao">'+value.html_atribuicao+'</span>'+
                                '       <span class="sub info_noclick" data-type="icons">'+value.html_icons+'</span>'+
                                '       <span class="sub info_noclick" data-type="prazo">'+value.html_prazo+'</span>'+
                                '   </div>'+
                                '</div>',
                        click: function(el) {
                            var id_protocolo = el.dataset.eid;
                            var checkOver = ($(el).find('.info_noclick:hover').length > 0) ? $(el).find('.info_noclick:hover') : false;
                            var newTab = ($(el).find('.followLinkNewtab:hover').length > 0) ? $(el).find('.followLinkNewtab:hover') : false;
                            if (!dialogBoxPro && !checkOver && id_protocolo) window.location.href = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo;
                            if (!dialogBoxPro && id_protocolo && newTab) openLinkNewTab('controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo);
                        },
                        class: iten_urgente ? 'urgente' : ''
                    }
                });
                itens_board.sort(function(a,b){ return a.order - b.order;});

                if (v.id == 'SemGrupo' && itens_board.length === 0) {
                    return null;
                }

                return {
                    id: v.id,
                    title: title,
                    order: order_board,
                    class: 'proc_'+type,
                    color: (typeof item[0] !== 'undefined') ? item[0].color : false,
                    collapse: collapse_board,
                    item: itens_board
                }
            });

            bords_list.sort(function(a,b){ return a.order - b.order;});

            var kanban = new jKanban({
                element: '#processosKanban',
                gutter: '10px',
                widthBoard: "calc(25% - 20px)",
                // responsivePercentage: true,
                itemHandleOptions:{
                    enabled: true,
                },
                dragEl: function(el, source){
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                        kanbanProcessosMoving = {source: sourceEl, id: el.dataset.eid, order: elemItem.index()};
                        // drag_auto_scroll(el);
                },
                dropEl: function(el, target, source, sibling){
                    updateOrderKanbanBoardProc();

                    var targetEl = target.parentElement.getAttribute('data-id');
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                    var titleSource = elemItem.closest('.kanban-board').find('.kanban-title-board').text();
                    var elemContent = elemItem.find('.kanban-content');
                    var elemProc = elemContent.find('span[data-type="proc"]');
                    var elemUser = elemContent.find('span[data-type="atribuicao"]');
                    var elemIcons = elemContent.find('span[data-type="icons"]');
                    var elemTypes = elemContent.find('span[data-type="tipo"]');

                    if (type == 'users' && sourceEl != targetEl) {
                        var arrayListUsersSEI = getOptionsPro('arrayListUsersSEI');
                        if (arrayListUsersSEI) {
                            var userMatch = $.grep(arrayListUsersSEI, function(item){
                                return item.name && item.name.indexOf(targetEl) !== -1;
                            })[0];
                            var idUser = userMatch ? userMatch.value : false;
                                idUser = idUser == 'SemGrupo' ? 'null' : idUser;
                            var linkAtribuicao = tableProc.find('a[href*="&id_usuario_atribuicao='+idUser+'"]').attr('href');
                                elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');

                                updateDadosArvore('Atribuir Processo', 'selAtribuicao', idUser, id_protocolo, function(){ 
                                    if (targetEl != 'SemGrupo') {
                                        var targetAtribuicao = '(<a href="'+linkAtribuicao+'" title="Atribu\u00EDdo para '+targetEl+'" class="ancoraSigla">'+targetEl+'</a>)';
                                        elemUser.html(targetAtribuicao);
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html(targetAtribuicao);
                                    } else {
                                        elemUser.html('');
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html('');
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                });
                        }
                    } else if (type == 'tags' && sourceEl != targetEl) {
                        var listMarcadores = getOptionsPro('listaMarcadores');
                            listMarcadores = listMarcadores ? $.map(listMarcadores, function(v){
                                                return {name: getTagName(v.name, type), value: v.value, img: v.img}
                                            }) : false;
                            listMarcadores = listMarcadores !== null ? listMarcadores : false;    

                        var arrayMarcador = listMarcadores ? $.grep(listMarcadores, function(item){ return item.name == targetEl; })[0] : false;
                        var valueMarcador = arrayMarcador !== null && arrayMarcador ? arrayMarcador.value : false;  
                        var elemIconTag = elemIcons.find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var elemIconTagTable = tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var valueText = elemIconTag.attr('onmouseover');
                            valueText = (typeof valueText !== 'undefined') ? extractTooltipToArray(valueText) : false;
                            valueText = valueText ? valueText[0] : false;
                            valueText = typeof valueText !== 'undefined' && valueText ? valueText : '';

                            if (valueMarcador || targetEl == 'SemGrupo') {
                                var valuesIframe = [
                                    {element: 'txaTexto', value: valueText},
                                    {element: 'hdnIdMarcador', value: (targetEl == 'SemGrupo') ? '' : valueMarcador}
                                ];

                                updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, id_protocolo, function(){ 
                                    var arrayListMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
                                    var markerStyle = arrayListMarcadores && valueMarcador ? $.grep(arrayListMarcadores, function(item){ return item.icon == arrayMarcador.img; })[0] : null;
                                    var styleMarcador = markerStyle && typeof markerStyle.style !== 'undefined' ? markerStyle.style : null;
                                        styleMarcador = styleMarcador !== null ? styleMarcador : '';
                                    if (targetEl != 'SemGrupo' && sourceEl != 'SemGrupo') {
                                        elemIconTag.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                        elemIconTagTable.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                    } else if (targetEl != 'SemGrupo' && sourceEl == 'SemGrupo') {
                                        var targetMarcador = '<a href="#controlador.php?acao=andamento_marcador_gerenciar&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&id_procedimento='+id_protocolo+'" onmouseover="return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');" onmouseout="return infraTooltipOcultar();" data-color="true" style="'+styleMarcador+'"><img src="'+arrayMarcador.img+'" class="imagemStatus"></a>';
                                            elemIcons.append(targetMarcador);
                                            tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).append(targetMarcador);
                                    } else if (targetEl == 'SemGrupo') {
                                        elemIconTag.remove();
                                        elemIconTagTable.remove();
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    getAllMarcadoresHome();
                                });
                            }

                    } else if (type == 'types' && sourceEl != targetEl && targetEl != 'SemGrupo') {
                        elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');
                        initListTypesSEI(function (){
                            var tipoMatch = (typeof arrayListTypesSEI.selectTipoProc !== 'undefined') ? $.grep(arrayListTypesSEI.selectTipoProc, function(item){ return item.name == titleSource; })[0] : null;
                            var idTypeProc = tipoMatch ? tipoMatch.value : false;
                                if (idTypeProc) {
                                    updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', idTypeProc, id_protocolo, function(){ 
                                        elemTypes.text(titleSource);
                                        elemProc.find('i.fa-sync').remove();
                                        elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                        setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    });
                                } else {
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-times vemelhoColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-times').remove(); }, 2000);
                                }
                        });
                    } else if (sourceEl != targetEl) {
                        cancelMoveKanbanItensProc();
                    }
                    kanbanProcessosMoving = false;
                },
                dragendBoard: function(el){
                    updateOrderKanbanBoardProc();
                },
                boards: bords_list
            });
            /*
            autoScroll([
                    document.querySelector('.kanban-container')
                ],{
                    margin: 20,
                    maxSpeed: 5,
                    scrollWhenOutside: true,
                    autoScroll: function(){
                        //Only scroll when the pointer is down, and there is a child being dragged.
                        console.log('***', this.down, kanban.drake.dragging);
                        return this.down && kanban.drake.dragging;
                    }
                }
            );
            */

            kanbanProcessos = kanban;
            tableProc.hide();
            updateCountKanbanBoardProc();
        }
    }
}
export function cancelMoveKanbanItensProc() {
    var itemMove = kanbanProcessosMoving;
    if (itemMove && $('#processosKanban').is(':visible')) {
        var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+itemMove.source+"'] | [0].item | [?id=='"+itemMove.id+"'] | [0]");
            item = item == null ? false : item;
            kanbanProcessos.removeElement(item.id);
            kanbanProcessos.addElement(itemMove.source, item, itemMove.order);
    }
}
export function pinKanbanItensProc(this_, id_protocolo) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _hasActive = _this.hasClass('newLink_active');
    var source = _parent.data('id');
    var order = (_hasActive) ? -1 : 0;
    var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+source+"'] | [0].item | [?id=='"+id_protocolo+"'] | [0]");
        item = item == null ? false : item;
    if (item) {
        kanbanProcessos.removeElement(item.id);
        kanbanProcessos.addElement(source, item, order);
        
        if (!_hasActive) {
            $('#processosKanban .kanban-container').animate({scrollTop: 0}, 500, function() {
                $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').addClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Remover do topo\')');
                updateOrderKanbanBoardProc();
            });
        } else {
            $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').removeClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Fixar no topo\')');
            updateOrderKanbanBoardProc();
        }
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    }
}
export function updateOrderKanbanBoardProc() {
    var type = storeGroupTablePro();
    var arrayOrder = $('#processosKanban .kanban-board').map(function(){
                        var _this = $(this);
                        var itens = _this.find('.kanban-item').map(function(i){ return {id: String($(this).data('eid')), order: i, pinboard: $(this).find('.kanban-pinboard a').hasClass('newLink_active') }  }).get();
                        var boards = {id: _this.data('id'), order: _this.data('order'), collapse: _this.data('collapse'), itens: itens};
                        return boards;
                    }).get();
    setOptionsPro('panelProcessosOrder_'+type, arrayOrder);
    // console.log('panelProcessosOrder_'+type, arrayOrder);
}
export function collapseKanbanBoardProc(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _data = _parent.data();
        _parent.attr('data-collapse', _data.collapse ? false : true).data('collapse', _data.collapse ? false : true);
        _parent.find('.kanban-collapse i').attr('class', _data.collapse ? 'fas fa-plus-square azulColor' : 'fas fa-minus-square cinzaColor');
        updateOrderKanbanBoardProc();
}
export function updateCountKanbanBoardProc() {
    if (!kanbanProcessos || !kanbanProcessos.options || !$.isArray(kanbanProcessos.options.boards)) {
        return;
    }
    $.each(kanbanProcessos.options.boards, function(i, v){
        var elemBoard = $('#processosKanban .kanban-board[data-id="'+v.id+'"]');
        var countBoard = elemBoard.find('.kanban-item:visible').length;
        var iconCollapse = elemBoard.find('.kanban-collapse').length ? false : '<div class="kanban-collapse" onclick="collapseKanbanBoardProc(this)"><i class="fas fa-'+(v.collapse ? 'plus': 'minus')+'-square '+(v.collapse ? 'azulColor': 'cinzaColor')+'"></i></div>';
            elemBoard.attr('data-collapse',v.collapse).find('.kanban-title-board').attr('data-count',countBoard).after(iconCollapse);
    });
}
