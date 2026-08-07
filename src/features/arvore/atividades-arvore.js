/**
 * Árvore — atividades panel/filter in tree.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    atividadesStateParent,
    callParentAtividades
} from './atividades-bridge.js';

import {
    isSparklingModalVisible
} from './modules.js';


export function initAtividadesProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (isSparklingModalVisible()) {
        setTimeout(function(){ 
            initAtividadesProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAtividadesProcesso => '+TimeOut); 
        }, 500);
        return;
    }
    if (
        typeof atividadesStateParent().arrayConfigAtividades !== 'undefined' &&
        typeof atividadesStateParent().arrayConfigAtividades.perfil !== 'undefined'
    ) {
        if (parent.checkConfigValue('gerenciaratividades')) { 
            setAtividadesProcesso();
        }
    } else {
        setTimeout(function(){ 
            if (TimeOut == 9000) { callParentAtividades('getAtividades'); }
            initAtividadesProcesso(TimeOut - 100); 
        }, 500);
    }
}
export function setAtividadesProcesso() {
    var htmlAtividades = getAtividadesProcessoArvore();
    $('.panelDadosArvore_atividades').remove();
    $('.panelDadosArvore').eq(0).before(htmlAtividades);

    if (htmlAtividades != '') {
        $('.kanban-item .checklist_progress').each(function(){
            $(this).progressbar({
                value: $(this).data('valuenow'),
                max: $(this).data('max')
            });
        });
    }
}
export function filterTagKanbanArvore(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.panelDadosArvore_atividades');
    var head = _parent.find('.panelArvoreHead');
    var data = _this.data();
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? data.tagname : false;
    var htmlFilter = '';
        _parent.find('#filterTagKanban').remove();
    if (tagName) {
        _parent.find('.kanban-item').hide();
        var itemFilter = _parent.find('.kanban-item.tagKanName_'+tagName);
        var nameTag = (typeof data.nametag !== 'undefined') ? data.nametag : _this.text().trim();
        var iconTag = (typeof data.icontag !== 'undefined') ? 'fas fa-'+data.icontag : _this.find('i').attr('class');
            itemFilter.show();
            htmlFilter =    '<span id="filterTagKanban" class="tituloFilter" style="padding: 0 10px 20px; font-size: 9pt; text-align: center;">'+
                            '   Filtro: '+
                            '   <span class="tag" style="background-color: '+data.colortag+'">'+
                            '       <span class="tag-text" style="color: '+data.textcolor+'; margin-right: 5px;">'+
                            '           <i class="tagicon tagicon '+iconTag+'" style="font-size: 120%; margin: 0 2px; color: '+data.textcolor+'"></i>'+
                            '           '+nameTag+
                            '           </span>'+
                            '       <button onclick="filterTagKanbanArvore(this); return false;" class="tag-remove"></button>'+
                            '   </span>'+
                            '</span>';
            head.append(htmlFilter);
    } else {
        _parent.find('.kanban-item').show();
    }
}
export function getAtividadesProcessoArvore() {
    var htmlAtividades = '';
    var htmlInfoAtividades = '';
    var atividadesState = atividadesStateParent();
    if ((atividadesState.arrayAtividadesProcPro || []).length > 0) {
        $.each(atividadesState.arrayAtividadesProcPro,function(index, value){
            var params_url = getParamsUrlPro($(`a[target="${ifrVisualizacao_}"]`).attr('href'));
            var id_procedimento = params_url.id_procedimento;
            if (value.id_procedimento == parseInt(id_procedimento)) {
                var htmlActionsAtividade = callParentAtividades('actionsAtividade', value.id_demanda, 'icon');
                var kanbanItem = callParentAtividades('getKanbanItem', value);
                if (!htmlActionsAtividade || !kanbanItem) return;
                
                    htmlInfoAtividades +=   '<div class="kanban-item '+kanbanItem.class.join(' ')+'" data-eid="_id_'+value.id_demanda+'">'+
                                            '   '+kanbanItem.title+
                                            (htmlActionsAtividade.action == 'info' ? '' :
                                            '   <span class="info_dates_monitorado" style="display: block;padding: 0;margin: 10px 0 0 0;">'+
                                            '       <a class="newLink" href="#" data-seipro-arvore-action="parent-atividades" data-fn="actionsAtividade" data-id="'+value.id_demanda+'">'+
                                            '           <i style="margin-right: 3px;" class="'+htmlActionsAtividade.icon+' azulColor"></i>'+
                                            '           '+htmlActionsAtividade.name+
                                            '       </a>'+
                                            '   </span>'+
                                            '')+
                                            '</div>';
            }
        });
    
        htmlAtividades =    '<div class="panelDadosArvore panelDadosArvore_atividades" data-type="atividades">'+
                            '   <label class="newLink panelArvoreHead" style="margin-bottom: 10px; display: block;">'+
                            '      <i class="fas fa-check-circle azulColor iconDadosProcesso"></i>'+
                            '      Atividades:'+
                            '       <span class="atividadesProActionsArvore">'+
                            '       </span>'+
                            '      <i class="fas fa-chevron-'+(getOptionsPro('panelDadosArvorePro_atividades') == 'hide' ? 'right' : 'down')+' azulColor" style="float: right; cursor:pointer; margin-right: 20px;" onclick="togglePanelDadosArvore(this)"></i>'+
                            '   </label>'+
                            '   <div class="infoDadosArvore kanban-container" style="'+(getOptionsPro('panelDadosArvorePro_atividades') == 'hide' ? 'display:none' : '')+';padding: 10px 0;max-height: 800px;overflow-y: scroll;">'+
                            '       '+htmlInfoAtividades+
                            '   </div>'+
                            '</div>';
    }
    return htmlAtividades;
}
