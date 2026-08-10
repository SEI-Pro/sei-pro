// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv, hasAtiv } from './call.js';
/**
 * Atividades — painel e tabelas de configuração.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { getServerAtividades } from './server.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function openModalConfigPanel() {
    openConfigBoxPro('',
        function () {
            getTabsConfigPanel('configBoxProDiv');
            var htmlBox = '   	<div id="configuracoesProActions" class="panelHome panelHomeConfiguracao">' +
                '           <a class="newLink iconAtividade_update" data-act="atividades-call" data-fn="updateAtividade_" data-tip="Atualizar Informa\u00E7\u00F5es" style="margin: 0;font-size: 14pt;float: right;">' +
                '               <i class="fas fa-sync-alt"></i>' +
                '           </a>' +
                (callAtiv('checkCapacidade','config_atividades') ? callAtiv('getHtmlActionsConfig','atividades') : '') +
                (callAtiv('checkCapacidade','config_planos') || callAtiv('checkCapacidade','config_self_planos') ? callAtiv('getHtmlActionsConfig','planos') : '') +
                (callAtiv('checkCapacidade','config_termos') || callAtiv('checkCapacidade','config_self_termos') ? callAtiv('getHtmlActionsConfig','termos') : '') +
                (callAtiv('checkCapacidade','config_programas') ? callAtiv('getHtmlActionsConfig','programas') : '') +
                (callAtiv('checkCapacidade','config_users') ? callAtiv('getHtmlActionsConfig','users') : '') +
                (callAtiv('checkCapacidade','config_unidades') ? callAtiv('getHtmlActionsConfig','unidades') : '') +
                (callAtiv('checkCapacidade','config_mapas') ? callAtiv('getHtmlActionsConfig','mapas') : '') +
                (callAtiv('checkCapacidade','config_acoes') ? callAtiv('getHtmlActionsConfig','acoes') : '') +
                (callAtiv('checkCapacidade','config_entregas') ? callAtiv('getHtmlActionsConfig','entregas') : '') +
                (callAtiv('checkCapacidade','config_objetivos') ? callAtiv('getHtmlActionsConfig','objetivos') : '') +
                (callAtiv('checkCapacidade','config_cadeia_valor') ? callAtiv('getHtmlActionsConfig','cadeia_valor') : '') +
                (callAtiv('checkCapacidade','config_tipos_prescricoes') ? callAtiv('getHtmlActionsConfig','tipos_prescricoes') : '') +
                (callAtiv('checkCapacidade','config_tipos_metadados') ? callAtiv('getHtmlActionsConfig','tipos_metadados') : '') +
                (callAtiv('checkCapacidade','config_tipos_eixos') ? callAtiv('getHtmlActionsConfig','tipos_eixos') : '') +
                (callAtiv('checkCapacidade','config_tipos_entregas') ? callAtiv('getHtmlActionsConfig','tipos_entregas') : '') +
                (callAtiv('checkCapacidade','config_tipos_documentos') ? callAtiv('getHtmlActionsConfig','tipos_documentos') : '') +
                (callAtiv('checkCapacidade','config_tipos_requisicoes') ? callAtiv('getHtmlActionsConfig','tipos_requisicoes') : '') +
                (callAtiv('checkCapacidade','config_tipos_avaliacoes') ? callAtiv('getHtmlActionsConfig','tipos_avaliacoes') : '') +
                (callAtiv('checkCapacidade','config_tipos_justificativas') ? callAtiv('getHtmlActionsConfig','tipos_justificativas') : '') +
                (callAtiv('checkCapacidade','config_tipos_modalidades') ? callAtiv('getHtmlActionsConfig','tipos_modalidades') : '') +
                (callAtiv('checkCapacidade','config_tipos_motivos') ? callAtiv('getHtmlActionsConfig','tipos_motivos') : '') +
                (callAtiv('checkCapacidade','config_tipos_capacidades') ? callAtiv('getHtmlActionsConfig','tipos_capacidades') : '') +
                (callAtiv('checkCapacidade','config_perfis') ? callAtiv('getHtmlActionsConfig','perfis') : '') +
                (callAtiv('checkCapacidade','config_nomenclaturas') ? callAtiv('getHtmlActionsConfig','nomenclaturas') : '') +
                (callAtiv('checkCapacidade','config_entidades') ? callAtiv('getHtmlActionsConfig','entidades') : '') +
                '   	</div>';

            $('#configBoxProDiv').prepend(htmlBox);
            setTimeout(function () {
                if (configBoxPro) centralizeDialogBox(configBoxPro);
            }, 500);
        },
        function () {
            callAtiv('updateAtividade',$('.panelHome').find('.iconAtividade_update')[0]);
        }
    );
}
export function getTabsConfigPanel(panel = 'panelInfoHomeConfiguracao') {
    var tabs = 'tabsPanelConfig';
    var htmlToolbar = '<div id="' + tabs + '" style="border: none; min-height: 300px;">' +
        '    <ul>' +
        '    <li><a href="#tabs-configpessoal"><i data-icon="user-cog" class="fas fa-user-cog cinzaColor" style="margin-right: 5px;"></i>Configura\u00E7\u00F5es Pessoais</a></li>' +
        (callAtiv('checkCapacidade','config_atividades') ?
            '    <li><a href="#tabs-atividades"><i data-icon="clipboard-list" class="fas fa-clipboard-list cinzaColor" style="margin-right: 5px;"></i>' + __.Atividades + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_planos') || callAtiv('checkCapacidade','config_self_planos') ?
            '    <li><a href="#tabs-planos"><i data-icon="handshake" class="fas fa-handshake cinzaColor" style="margin-right: 5px;"></i>Planos de Trabalho</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_termos') || callAtiv('checkCapacidade','config_self_termos') ?
            '    <li><a href="#tabs-termos"><i data-icon="file-signature" class="fas fa-file-signature cinzaColor" style="margin-right: 5px;"></i>Termos de Ci\u00EAncia e Responsabilidade</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_programas') ?
            '    <li><a href="#tabs-programas"><i data-icon="cubes" class="fas fa-cubes cinzaColor" style="margin-right: 5px;"></i>' + __.Programas + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_entregas') ?
            '    <li><a href="#tabs-entregas"><i data-icon="hand-holding" class="fas fa-hand-holding cinzaColor" style="margin-right: 5px;"></i>Entregas</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_acoes') ?
            '    <li><a href="#tabs-acoes"><i data-icon="puzzle-piece" class="fas fa-puzzle-piece cinzaColor" style="margin-right: 5px;"></i>A\u00E7\u00F5es Estrat\u00E9gicas</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_objetivos') ?
            '    <li><a href="#tabs-objetivos"><i data-icon="map-signs" class="fas fa-map-signs cinzaColor" style="margin-right: 5px;"></i>Objetivos Estrat\u00E9gicos</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_cadeia_valor') ?
            '    <li><a href="#tabs-cadeia_valor"><i data-icon="share-alt" class="fas fa-share-alt cinzaColor" style="margin-right: 5px;"></i>Cadeia de Valor</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_mapas') ?
            '    <li><a href="#tabs-mapas"><i data-icon="network-wired" class="fas fa-network-wired cinzaColor" style="margin-right: 5px;"></i>Mapas Estrat\u00E9gicos</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_users') ?
            '    <li><a href="#tabs-users"><i data-icon="users" class="fas fa-users cinzaColor" style="margin-right: 5px;"></i>Usu\u00E1rios</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_unidades') ?
            '    <li><a href="#tabs-unidades"><i data-icon="briefcase" class="fas fa-briefcase cinzaColor" style="margin-right: 5px;"></i>Unidades</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_prescricoes') ?
            '    <li><a href="#tabs-tipos_prescricoes"><i data-icon="history" class="fas fa-history cinzaColor" style="margin-right: 5px;"></i>Tipos de ' + __.Prescricoes + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_metadados') ?
            '    <li><a href="#tabs-tipos_metadados"><i data-icon="dice-d6" class="fas fa-dice-d6 cinzaColor" style="margin-right: 5px;"></i>Tipos de Metadados</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_eixos') ?
            '    <li><a href="#tabs-tipos_eixos"><i data-icon="exchange-alt" class="fas fa-exchange-alt cinzaColor" style="margin-right: 5px;"></i>Tipos de Eixos Tem\u00E1ticos</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_entregas') ?
            '    <li><a href="#tabs-tipos_entregas"><i data-icon="exchange-alt" class="fas fa-hand-holding-medical cinzaColor" style="margin-right: 5px;"></i>Tipos de Entregas</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_documentos') ?
            '    <li><a href="#tabs-tipos_documentos"><i data-icon="file-alt" class="fas fa-file-alt cinzaColor" style="margin-right: 5px;"></i>Tipos de Documentos</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_requisicoes') ?
            '    <li><a href="#tabs-tipos_requisicoes"><i data-icon="inbox" class="fas fa-inbox cinzaColor" style="margin-right: 5px;"></i>Tipos de Requisi\u00E7\u00F5es</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_avaliacoes') ?
            '    <li><a href="#tabs-tipos_avaliacoes"><i data-icon="star" class="fas fa-star cinzaColor" style="margin-right: 5px;"></i>Tipos de Avalia\u00E7\u00F5es</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_justificativas') ?
            '    <li><a href="#tabs-tipos_justificativas"><i data-icon="star" class="fas fa-star cinzaColor" style="margin-right: 5px;"></i>Tipos de Justificativas de Avalia\u00E7\u00E3o</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_modalidades') ?
            '    <li><a href="#tabs-tipos_modalidades"><i data-icon="wrench" class="fas fa-wrench cinzaColor" style="margin-right: 5px;"></i>Tipos de Modalidades de Trabalho</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_motivos') ?
            '    <li><a href="#tabs-tipos_motivos"><i data-icon="luggage-cart" class="fas fa-luggage-cart cinzaColor" style="margin-right: 5px;"></i>Tipos de Motivos de Afastamento</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_capacidades') ?
            '    <li><a href="#tabs-tipos_capacidades"><i data-icon="users-cog" class="fas fa-users-cog cinzaColor" style="margin-right: 5px;"></i>Tipos de Capacidades</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_perfis') ?
            '    <li><a href="#tabs-perfis"><i data-icon="shield-alt" class="fas fa-shield-alt cinzaColor" style="margin-right: 5px;"></i>Tipos de Perfis</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_nomenclaturas') ?
            '    <li><a href="#tabs-nomenclaturas"><i data-icon="ad" class="fas fa-ad cinzaColor" style="margin-right: 5px;"></i>Nomenclaturas</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_entidades') ?
            '    <li><a href="#tabs-entidades"><i data-icon="university" class="fas fa-university cinzaColor" style="margin-right: 5px;"></i>Entidades</a></li>' +
            '' : '') +
        '    </ul>' +
        '    <div id="tabs-configpessoal">' +
        '       ' + callAtiv('configPessoal',) +
        '    </div>' +
        (callAtiv('checkCapacidade','config_atividades') ?
            '    <div id="tabs-atividades"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_planos') || callAtiv('checkCapacidade','config_self_planos') ?
            '    <div id="tabs-planos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_termos') || callAtiv('checkCapacidade','config_self_termos') ?
            '    <div id="tabs-termos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_programas') ?
            '    <div id="tabs-programas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_entregas') ?
            '    <div id="tabs-entregas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_acoes') ?
            '    <div id="tabs-acoes"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_objetivos') ?
            '    <div id="tabs-objetivos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_cadeia_valor') ?
            '    <div id="tabs-cadeia_valor"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_mapas') ?
            '    <div id="tabs-mapas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_users') ?
            '    <div id="tabs-users"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_unidades') ?
            '    <div id="tabs-unidades"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_prescricoes') ?
            '    <div id="tabs-tipos_prescricoes"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_metadados') ?
            '    <div id="tabs-tipos_metadados"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_eixos') ?
            '    <div id="tabs-tipos_eixos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_entregas') ?
            '    <div id="tabs-tipos_entregas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_documentos') ?
            '    <div id="tabs-tipos_documentos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_requisicoes') ?
            '    <div id="tabs-tipos_requisicoes"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_avaliacoes') ?
            '    <div id="tabs-tipos_avaliacoes"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_justificativas') ?
            '    <div id="tabs-tipos_justificativas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_modalidades') ?
            '    <div id="tabs-tipos_modalidades"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_motivos') ?
            '    <div id="tabs-tipos_motivos"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_tipos_capacidades') ?
            '    <div id="tabs-tipos_capacidades"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_perfis') ?
            '    <div id="tabs-perfis"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_nomenclaturas') ?
            '    <div id="tabs-nomenclaturas"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','config_entidades') ?
            '    <div id="tabs-entidades"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        '</div>';
    $('.' + panel).html(htmlToolbar);
    $('#' + tabs).tabs({
        activate: function (event, ui) {
            var active = $(this).tabs("option", "active");
            var type = ui.newPanel[0].id.replace('tabs-', '');
            setChangeAllItensPerfil(type);
            setOptionsPro(tabs + 'ActiveTabs', active);
            removeOptionsPro('rememberScroll_config_' + type);
            resetDialogBoxPro('dialogBoxPro');
            getTabConfig(type, 'get');
            $('.actionsConfig_icons').hide().find('.newLink').not('.iconConfig_confirm').hide();
            $('.actionsConfig_' + type).show();
        }
    }).on("click", '[role="tab"]', function () {
        var _this = $(this);
        var type = _this.attr('aria-controls').replace('tabs-', '');
        if (!_this.find('.fa-spinner').length) getTabConfig(type, 'get');
    });
    var tabActive = getOptionsPro(tabs + 'ActiveTabs');
    if (tabActive) {
        $('#' + tabs).tabs("option", "active", tabActive);
    }
    getListTypesSEI();
    initMaskPhoneConfig();
}
export function setChangeAllItensPerfil(type) {
    if (!getOptionsPro('changeAllItensTableConfig_' + type) && !callAtiv('checkPerfilNivelAdm',)) {
        setOptionsPro('changeAllItensTableConfig_' + type, 'show');
    }
}
export function initMaskPhoneConfig(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (TimeOut == 9000 && typeof $.mask === 'undefined') $.getScript(URL_SPRO + "js/lib/jquery.maskedinput.min.js");

    if (typeof $.mask !== 'undefined') {
        if ($("#tabs-configpessoal #tel_celular").length > 0) {
            $("#tabs-configpessoal #tel_celular").mask('+99 (99) 99999-999?9', {
                placeholder: '+55 (__) _____-____', completed: function () {
                    this.removeClass('requiredNull');
                }
            }).on('keypress', function () {
                var value = $(this).val();
                if (value.substring(0, 3) != '+55') {
                    $(this).after('<input type="text" id="tel_celular" data-act="atividades-call" data-fn="saveConfigPersonalUser" style="width:calc(100% - 15px) !important" tabindex="0" value="' + value.substring(0, 3) + '">').remove();
                    setTimeout(() => {
                        $('#tel_celular').focus();
                    }, 1000);
                }
            }).on('focus', function () {
                setTimeout(() => {
                    if ($(this).val() == '+55 (__) _____-____') {
                        setCaretPosition(this, 5);
                    }
                }, 1000);
            });
        }
    } else {
        setTimeout(function () {
            initMaskPhoneConfig(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initMaskPhoneConfig');
        }, 500);
    }
}
export function getFilterTable(type, mode = 'config') {
    let table_id = mode == 'config' ? 'tableConfiguracoesPanel_' + type : 'tableRelatorio_' + type;
    let tablefilter = localStorage.getItem('tablesorter-filters');
    tablefilter = tablefilter !== null ? JSON.parse(tablefilter)[window.location.pathname][table_id] : false;
    tablefilter = typeof tablefilter !== 'undefined' && tablefilter.length ? tablefilter : false;
    return tablefilter;
}
export function loadingTagConfig(type, mode = 'get') {
    if (mode == 'get') {
        $('#tabs-' + type).prepend('<div class="indeterminate-progress-bar"><div class="indeterminate-progress-bar__progress"></div></div>');
    } else {
        $('#tabs-' + type).find('.indeterminate-progress-bar').remove();
    }
}
export function getTabConfig(type, mode, data = false, loop = true, offset = 0, return_param = false) {
    if ((callAtiv('checkCapacidade','config_' + type) || callAtiv('checkCapacidade','config_self_' + type)) && mode == 'get') {
        var filter = getFilterTable(type);
        var show_all = (getOptionsPro('changeAllItensTableConfig_' + type) && getOptionsPro('changeAllItensTableConfig_' + type) == 'show') ? true : false;
        var archived = (getOptionsPro('changeArchivedTableConfig_' + type) && getOptionsPro('changeArchivedTableConfig_' + type) == 'show') ? 'show' : 'hide';
        var disabled = (getOptionsPro('changeDisabledTableConfig_' + type) && getOptionsPro('changeDisabledTableConfig_' + type) == 'show') ? 'show' : 'hide';
        var lista_inferior = (getOptionsPro('changeListaInfTableConfig_' + type) && getOptionsPro('changeListaInfTableConfig_' + type) == 'show') ? 'show' : 'hide';
        var column_filter = $('#tableConfiguracoesPanel_' + type).find('input.tablesorter-filter:focus').attr('data-column');
        var action = (callAtiv('checkCapacidade','config_self_' + type)) ? 'config_self_' + type : 'config_' + type;
        var param = {
            disabled: disabled,
            archived: archived,
            lista_inferior: lista_inferior,
            offset: offset,
            filter: JSON.stringify(filter),
            column_filter: column_filter,
            action: action
        };
        if (show_all || filter) {
            getServerAtividades(param, action);
        } else {
            setTimeout(() => {
                infraTooltipOcultar();
                $('a[href="#tabs-' + type + '"]').find('i').removeClass('fa-spinner').removeClass('fa-spin');
                callAtiv('getTableTabConfig',type, { status: 1, config: [], next_offset: 100, offset: 0 });
                if (!getFilterTable(type) && !show_all) {
                    setTimeout(() => {
                        let tableConfig = $('#tableConfiguracoesPanel_' + type);
                        tableConfig.find('button[data-value="Pesquisar"]').trigger('click');
                        tableConfig.find('.dataFallback').attr('data-text', 'Digite um termo para iniciar a pesquisa').find('a')
                            .removeAttr('onclick')
                            .attr({ 'data-act': 'atividades-call', 'data-fn': 'initFilterBtn', 'data-tip': 'Iniciar a pesquisa' })
                            .find('i.icon-parent').attr('class', 'fas fa-search icon-parent').end().find('i.fa-layers-bottom').remove();
                        getServerAtividades({ return_empty: true, mode: 'check', action: action }, action);
                    }, 500);
                }
            }, 500);
        }
        $('#tabs-' + type).find('.dataFallback').addClass('dataLoading');
        var iconTab = $('a[href="#tabs-' + type + '"]').find('i');
        iconTab.addClass('fa-spinner').addClass('fa-spin');
        loadingTagConfig(type, mode);
    } else if ((callAtiv('checkCapacidade','config_' + type) || callAtiv('checkCapacidade','config_self_' + type)) && mode == 'set') {
        if (typeof SimpleTableCellEditor === 'undefined' && loop) {
            $.getScript((URL_SPRO + "js/lib/jquery-table-edit.min.js"));
            setTimeout(function () {
                getTabConfig(type, mode, data, false, offset, return_param);
            }, 1000);
        } else {
            callAtiv('getTableTabConfig',type, data, return_param);
            infraTooltipOcultar();
            var iconTab = $('a[href="#tabs-' + type + '"]').find('i');
            iconTab.removeClass('fa-spinner').removeClass('fa-spin');
        }
        loadingTagConfig(type, mode);
    }
}
export function initFilterBtn(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    table.find('button[data-value="Pesquisar"]').trigger('click');
}
export function setNewItemCell(this_, event) {
    if (event.which == 13) {
        setTimeout(function () {
            $(this_).closest('td').text($(this_).val().trim());
        }, 500);
    }
}
export function addConfigItem(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    var tr = table.find('tbody tr:last-child');
    var len = table.find('tbody tr').length;
    var div = table.closest('div');
    table.find('tbody tr td').removeClass('inEdit');
    table.find('tbody').append(tr.clone().attr('data-index', len).attr('data-value', ''));
    table.find('tbody tr:last-child').find('td:first-child').removeClass('inEdit').text('').trigger('click');
    console.log(tr.data('key'));
    if (typeof div !== 'undefined' && typeof div[0] !== 'undefined') div.scrollTop(div[0].scrollHeight);
    if (tr.data('key') == 'documentos' || tr.data('key') == 'planos_acrescimo') {
        table.find('tbody tr:last-child').find('td:nth-child(2)')
            .removeClass('editCellLoadingError')
            .removeClass('editCellConfirm')
            .removeClass('inEdit')
            .text('');
        table.find('tbody tr:last-child').find('td:nth-child(3)')
            .removeClass('editCellLoadingError')
            .removeClass('editCellConfirm')
            .removeClass('inEdit')
            .text('');
        table.find('tbody tr:last-child').find('td:nth-child(4)').text('');
        table.find('tbody tr:last-child').find('td:nth-child(5)').text('');
    } else if (tr.data('key') == 'id_unidade' || tr.data('key') == 'id_user') {
        table.find('tbody tr:last-child').find('.onoffswitch-checkbox').prop('checked', false);
    } else if (tr.data('key') == 'entregas_programa') {
        table.find('tbody tr:last-child').find('td:nth-child(1)')
            .removeClass('editCellLoadingError')
            .removeClass('editCellConfirm')
            .removeClass('inEdit')
            .text('').trigger('click');
        table.find('tbody tr:last-child').find('td:nth-child(4)').text('');
        table.find('tbody tr:last-child').find('td:nth-child(5)').text('');
    } else if (tr.data('key') == 'modalidades') {
        table.find('tbody tr:last-child').find('td:nth-child(2)').text('');
    } else if (tr.data('key') == 'metadados') {
        table.find('tbody tr:last-child').find('td:nth-child(2)').text('');
    } else if (tr.data('key') == 'exclui_unidades' || tr.data('key') == 'unidades') {
        table.find('tbody tr:last-child').find('td:nth-child(2)').text('');
    } else if (tr.data('key') == 'complexidade') {
        table.find('tbody tr:last-child').find('td').removeClass('inEdit');
        table.find('tbody tr:last-child').find('td:nth-child(1)').text('').trigger('click');
        table.find('tbody tr:last-child').find('td:nth-child(2)').text('');
        table.find('tbody tr:last-child').find('td:nth-child(3)').text('');
        var onoffswitch = table.find('tbody tr:last-child').find('.onoffswitch');
        onoffswitch.find('input[type="checkbox"]')
            .attr('class', 'onoffswitch-checkbox switch_complexidadeDefault switch_complexidadeDefault_' + len)
            .attr('id', 'changeItemConfig_atividades_' + len).prop('checked', false);
        onoffswitch.find('label.onoff-switch-label').attr('for', 'changeItemConfig_atividades_' + len)
    }
}
export function changeSwitchConfigItem(this_) {
    var _this = $(this_);
    var tr = _this.closest('tr');
    var data_type = tr.data('key');
    var table = _this.closest('table');
    table.find('.switch_' + data_type + 'Default').not('.switch_' + data_type + 'Default_' + tr.data('index')).prop('checked', false);
    // _this.prop('checked',true);

}
export function changeSwitchConfigTable(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_tr = tr.data();
    var type = tr.data('key');
    var value = (_this.is(':checked')) ? 1 : 0;
    callAtiv('updateConfigServerInline',_this, type, value, data, data_tr);
    td.addClass('editCellLoading');
}
export function alertDistCargaHoraria(_this, disable_button = true) {
    let _parent = _this.closest('.ui-tabs-panel');
    let total_carga_horaria = _parent.find('.configBox_entregas_programa tbody tr').filter(function () { return $(this).data('value') != 'remove' }).map(function (v) {
        let carga_horaria = $(this).find('td').eq(3).text().trim();
        carga_horaria = isNumeric(carga_horaria) ? parseInt(carga_horaria) : false;
        if (carga_horaria) return carga_horaria;
    }).get().reduce(function (a, b) { return a + b; }, 0);

    let alert_carga_horaria = 'Distribui\u00E7\u00E3o de carga hor\u00E1ria total do participante: <strong>' + total_carga_horaria + '%</strong>';
    alert_carga_horaria = total_carga_horaria > 100 ? alert_carga_horaria + '<br><br><i class="fas fa-exclamation-triangle vermelhoColor" style="margin: 0 5px; font-size: 10pt;"></i><strong class="vermelhoColor">Reduza ' + (total_carga_horaria - 100) + '% antes de prosseguir</strong>' : alert_carga_horaria;
    alert_carga_horaria = total_carga_horaria < 100 ? alert_carga_horaria + '<br><br><i class="fas fa-exclamation-triangle vermelhoColor" style="margin: 0 5px; font-size: 10pt;"></i><strong class="vermelhoColor">Aumente ' + (100 - total_carga_horaria) + '% antes de prosseguir</strong>' : alert_carga_horaria;
    alert_carga_horaria = total_carga_horaria == 100 ? alert_carga_horaria + '<br><br><i class="fas fa-check-circle verdeColor" style="margin: 0 5px; font-size: 10pt;"></i><strong class="azulColor">Distribui\u00E7\u00E3o adequada!</strong>' : alert_carga_horaria;

    let icon = total_carga_horaria == 100 ? '<i class="fas fa-check-double verdeColor" style="margin: 0 5px; font-size: 10pt;" data-tip="Distribui\u00E7\u00E3o adequada!"></i>' : '<i class="fas fa-exclamation-triangle vermelhoColor" style="margin: 0 5px; font-size: 10pt;" data-tip="Distribui\u00E7\u00E3o inadequada!"></i>';
    let labelid = _parent.attr('aria-labelledby');
    let tab = $('#boxConfiguracoes_planos_tabs_mes ul.ui-tabs-nav li[aria-labelledby="' + labelid + '"]');
    tab.find('a i').remove();
    tab.find('a').append(icon);
    _parent.find('.totalPercentCargaHoraria').text(total_carga_horaria);

    if (disable_button && total_carga_horaria != 100) {
        $("#btnSalvarOptions_planos").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
    } else {
        $("#btnSalvarOptions_planos").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    }

    return { total: total_carga_horaria, html: alert_carga_horaria };
}
export function openDialogEntrega(this_) {
    var _this = $(this_);
    var tr = _this.closest('tr');
    var id_entrega = tr.attr('data-id_entrega');
    var arrayEntregas = typeof tableConfigList.planos !== 'undefined'
        ? $.map(jmespath.search(tableConfigList.planos, "[?entregas_programa].entregas_programa"), function (v) { return v }).filter((value, index, self) => {
            return self.findIndex(v => v['id_entrega'] === value['id_entrega']) === index;
        })
        : arrayConfigAtividades.entregas;
    arrayEntregas = typeof arrayEntregas === 'undefined'
        ? $.map(jmespath.search(arrayConfigAtividades.planos, "[?entregas_programa].entregas_programa"), function (v) { return v }).filter((value, index, self) => {
            return self.findIndex(v => v['id_entrega'] === value['id_entrega']) === index;
        })
        : arrayEntregas;
    arrayEntregas = typeof arrayEntregas === 'undefined'
        ? $.map(jmespath.search(arrayConfigAtividades.planos, "[?entregas].entregas"), function (v) { return v }).filter((value, index, self) => {
            return self.findIndex(v => v['id_entrega'] === value['id_entrega']) === index;
        })
        : arrayEntregas;

    var value = typeof id_entrega !== 'undefined' ? jmespath.search(arrayEntregas, "[?id_entrega==`" + id_entrega + "`] | [0]") : null;
    value = value === null
        ? false
        : value;
    if (value) {
        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeInfo seipro-atividades-info" style="height: 80vh;overflow-y: auto;">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine tableInfo">' +
            '      <tr style="height: 40px;">' +
            '          <td>Nome da Entrega:</td>' +
            '          <td>' + (value.nome_entrega ? value.nome_entrega : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Tipo de Entrega:</td>' +
            '          <td>' + (value.nome_tipo_entrega ? value.nome_tipo_entrega : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>A\u00E7\u00E3o Estrat\u00E9gica:</td>' +
            '          <td>' + (value.nome_acao_sigla ? value.nome_acao_sigla : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Descri\u00E7\u00E3o da Entrega:</td>' +
            '          <td>' + (value.descricao_entrega ? value.descricao_entrega : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Crit\u00E9rios de Avalia\u00E7\u00E3o:</td>' +
            '          <td>' + (value.criterios_avaliacao ? value.criterios_avaliacao : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Objetivo Estrat\u00E9gico:</td>' +
            '          <td>' + (value.nome_objetivo ? value.nome_objetivo : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Demandante:</td>' +
            '          <td>' + (value.id_unidade_demandante ? value.sigla_unidade_demandante + ' - ' + value.nome_unidade_demandante : (value.nome_demandante ? value.nome_demandante : '-')) + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Destinat\u00E1rio:</td>' +
            '          <td>' + (value.id_unidade_destinatario ? value.sigla_unidade_destinatario + ' - ' + value.nome_unidade_destinatario : (value.nome_destinatario ? value.nome_destinatario : '-')) + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Data de Vig\u00EAncia:</td>' +
            '          <td>' + ((value.data_inicio_vigencia == '0000-00-00 00:00:00' || value.data_fim_vigencia == '0000-00-00 00:00:00') ? '-' : getDatesFormatBR(value.data_inicio_vigencia) + ' \u00E0 ' + getDatesFormatBR(value.data_fim_vigencia)) + '</td>' +
            '      </tr>' +

            '      <tr style="height: 40px;">' +
            '          <td>Meta (%):</td>' +
            '          <td>' + (value.meta ? value.meta : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Valor inicial (%):</td>' +
            '          <td>' + (value.valor_inicial ? value.valor_inicial : '') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Progresso esperado (%):</td>' +
            '          <td>' + (value.progresso_esperado ? value.progresso_esperado : '-') + '</td>' +
            '      </tr>' +
            '      <tr style="height: 40px;">' +
            '          <td>Progresso esperado (%):</td>' +
            '          <td>' + (value.progresso_realizado ? value.progresso_realizado : '-') + '</td>' +
            '      </tr>' +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: 'Informa\u00E7\u00F5es da entrega',
                width: 700,
                height: 'auto',
                close: function () {
                    resetDialogBoxPro('alertBoxPro');
                },
                buttons: [{
                    text: 'Ok',
                    click: function (event) {
                        resetDialogBoxPro('alertBoxPro');
                    }
                }]
            });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar a entrega.');
    }
}
export function changeSelectConfigItem(this_) {
    var _this = $(this_);
    var tr = _this.closest('tr');
    var tr_key = tr.data('key');
    var td = _this.closest('td');
    var td_key = td.data('key');
    var data_tr = tr.data();
    var table = _this.closest('table');
    var value_txt = _this.find('option:selected').text().trim();
    var value = _this.val();

    if (td.data('key') == 'tipo_modalidade') {
        tr.find('td').eq(2).text(value);
    }
    if (
        tr_key == 'exclui_unidades' ||
        tr_key == 'unidades' ||
        td_key == 'mapas' ||
        td_key == 'acoes' ||
        td_key == 'objetivos' ||
        td_key == 'cadeia_valor' ||
        td_key == 'nome_eixo' ||
        td_key == 'tipos_prescricoes'
    ) {
        tr.find('td').eq(1).text(value);
    }
    if (td_key == 'entregas') {
        tr.find('td:nth-child(3) a.newLink').show();
        tr.attr('data-id_entrega', value);
    }
    if (td_key == 'id_usuario_metadado' || td_key == 'id_unidade_metadado') {
        var config = _this.find('option:selected').data('config');
        var tipo_metadado = typeof config !== 'undefined' ? config.tipo_metadado : false;
        var classEdit = tipo_metadado == 'text' ? 'editCell' : '';
        classEdit = tipo_metadado == 'url' ? 'editCell' : classEdit;
        classEdit = tipo_metadado == 'number' ? 'editCellNum' : classEdit;
        classEdit = tipo_metadado == 'boolean' ? 'editCellSelect' : classEdit;
        classEdit = tipo_metadado == 'usuario' ? 'editCellSelect' : classEdit;
        classEdit = tipo_metadado == 'unidade' ? 'editCellSelect' : classEdit;
        classEdit = tipo_metadado == 'cpf' ? 'editCellCPF' : classEdit;
        classEdit = tipo_metadado == 'cnpj' ? 'editCellCNPJ' : classEdit;
        classEdit = tipo_metadado == 'processo' ? 'editCellPEN' : classEdit;
        classEdit = tipo_metadado == 'telefone' ? 'editCellPhone' : classEdit;
        classEdit = tipo_metadado == 'date' ? 'editCellDate' : classEdit;
        classEdit = tipo_metadado == 'datetime' ? 'editCellDatetime' : classEdit;
        classEdit = tipo_metadado == 'latlong' ? 'editCellLatlong' : classEdit;
        tr.find('td').eq(1).attr('class', classEdit).attr('data-tipometa', tipo_metadado).data('tipometa', tipo_metadado);
    }

    if (table.data('format') == 'obj_mult' && typeof td.data('tipometa') !== 'undefined') {
        td.attr('data-value', value);
        td.data('value', value);
    }
    if (table.data('format') == 'obj_mult' && typeof td.data('tipometa') === 'undefined') {
        value = (value == '') ? 'remove' : value;
        tr.attr('data-value', value);
        tr.data('value', value);
    }
    if (tr.find('td').length > 2) {
        _this.closest('td').next().trigger('click');
    } else {
        table.find('tbody tr:last-child').find('td:first-child').trigger('click');
    }
    if (tr.find('td').length == 2 && tr.data('index') == table.find('tbody tr').length - 1 && value_txt != '' && (data_tr.key != 'perfil' || data_tr.key != 'cadeia_valor' || data_tr.key != 'tipos_prescricoes')) {
        addConfigItem(this_);
    }

    setTimeout(function () {
        if (!td.find('input, select').is(':visible')) {
            td.removeClass('inEdit');
        }
    }, 500);
}
export function configTableNewItem(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    if (_this.val() == 'new') {
        setTimeout(function () {
            td.removeClass('inEdit').removeClass('editCellSelect').addClass('editCellNew');
            td.html('').trigger('click');
        }, 100);
    }
}
export function updateConfigServer(param) {

    // var param_key = param.key;
    var param_key = (isJson(param.key)) ? JSON.parse(param.key) : param.key;

    objIndex = (typeof tableConfigList[param.type] === 'undefined' || tableConfigList[param.type] == 0 || tableConfigList[param.type].length == 0) ? -1 : tableConfigList[param.type].findIndex((obj => obj[param.rowindex] == param.id));
    if (objIndex !== -1) {
        tableConfigList[param.type][objIndex][param_key] = param.value;
    }

    objIndexAtiv = (typeof arrayConfigAtividades[param.type] === 'undefined' || arrayConfigAtividades[param.type] == 0 || arrayConfigAtividades[param.type].length == 0) ? -1 : arrayConfigAtividades[param.type].findIndex((obj => obj[param.rowindex] == param.id));
    if (objIndexAtiv !== -1) {
        arrayConfigAtividades[param.type][objIndexAtiv][param_key] = param.value;
    }

    var action = callAtiv('checkCapacidade','config_update_self_' + param.type) ? 'config_update_self_' + param.type : 'config_update_' + param.type;
    if (callAtiv('checkCapacidade',action)) {
        var filter = getFilterTable(param.type);
        param.action = action;
        param.filter = JSON.stringify(filter);
        getServerAtividades(param, action);
    }
    return { objIndex: objIndex, objIndexAtiv: objIndexAtiv };
}
export function resetButtonTabConfig(classPanel = '') {
    var loadConfirm = $('#configuracoesProActions ' + classPanel + ' .iconConfig_confirm');
    loadConfirm.find('i.icon-parent').attr('class', loadConfirm.data('icon'));
}
export function updateServerTabConfig(data, param) {
    var table = $('#tabelaConfigPanel_' + param.type);
    var body = table.find('tbody');
    resetButtonTabConfig('.actionsConfig_' + param.type);

    if (data.status == 1) {
        if (param.id != 0) {
            var id = (param.id == -1) ? data.result : param.id;
            id = (param.action == 'config_update_keys') ? param.id_user : id;
            var tr = body.find('tr[data-id="' + id + '"]');
            updateConfigCells(data, param, tr, id);
        } else {
            $.each(param.ids, function (index, value) {
                var tr = body.find('tr[data-id="' + value + '"]');
                updateConfigCells(data, param, tr, value);
            })
        }
    }
}
export function updateConfigCells(data, param, tr, id = false) {
    var param_key = (isJson(param.key)) ? JSON.parse(param.key) : param.key;
    var td = tr.find('td[data-key="' + param_key + '"]');
    var table = tr.closest('table').attr('id');

    if (data.status == 0) {
        td.removeClass('editCellLoading').addClass('editCellLoadingError');
    } else {
        if (param.mode == 'disable') { tr.addClass('disabled') }
        else if (param.mode == 'close') {

            if (moment() > moment(param.date_config, 'YYYY-MM-DD')) { tr.addClass('closed'); }

            var ids = (param.ids.length == 0) ? [param.id.toString()] : param.ids;
            var type_id = (param.type == 'planos') ? 'id_plano' : false;
            type_id = (param.type == 'termos') ? 'id_termo' : type_id;
            var date_config = param.date_config + ' 23:59:59';
            var listUpdate = [];
            $.each(tableConfigList[param.type], function (i, v) {
                if ($.inArray(v[type_id].toString(), ids) !== -1) {
                    listUpdate.push(v);
                    tableConfigList[param.type][i][param_key] = date_config;
                    td.text(moment(param.date_config, 'YYYY-MM-DD').format('DD/MM/YYYY')).attr('data-time-sorter', param.date_config);
                }
            });
            if (listUpdate.length > 0) {
                if (param.type == 'planos') dialogUpdateCalcPlanos(listUpdate, 'update');
            }
        }
        else if (param.mode == 'approve') { tr.addClass('approve').removeClass('disapprove') }
        else if (param.mode == 'disapprove') { tr.addClass('disapprove').removeClass('approve') }
        else if (param.mode == 'reactive') { tr.removeClass('disabled') }
        else if (param.mode == 'clone' || param.mode == 'new') {
            setTimeout(function () {
                if (delayServerAtiv == 0) {
                    delayServerAtiv = 1; setTimeout(function () { delayServerAtiv = 0; }, 1000);
                }
            }, 1000);
        } else if (param.mode == 'option') {
            loadingButtonConfirm(false);
            if (data.status == 1) {
                if (dialogBoxPro) dialogBoxPro.dialog('close');
                resetDialogBoxPro('dialogBoxPro');
                alertaBoxPro('Sucess', 'check-circle', 'Op\u00E7\u00F5es editadas com sucesso!');
            } else {
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao enviar sua informa\u00E7\u00F5es.');
            }
        }
        if (typeof data.return_row !== 'undefined' && data.return_row.length) {
            addNewsRowsTableTabConfig(param, data, id || data.new_id, tr, table);
        }
        loadingTagConfig(param.type, 'set');

        if (param.action == 'config_update_users' && param.mode == 'new') {
            loadingButtonConfirm(false);
            resetDialogBoxPro('dialogBoxPro');
            alertaBoxPro('Sucess', 'check-circle', 'Usu\u00E1rio criado com sucesso! Link de acesso enviado para o email cadastrado.');
        } else if (param.action == 'config_resend_keys') {
            loadingButtonConfirm(false);
            alertaBoxPro('Sucess', 'check-circle', 'Link de acesso reenviado com sucesso para o email do usu\u00E1rio!');
        } else if (param.action == 'config_update_keys') {
            var table = $('#configBox_keys');
            if (param.mode == 'disable_key') {
                loadingButtonConfirm(false);
                alertaBoxPro('Sucess', 'check-circle', 'Chave de acesso revogada com sucesso!');
                var trKey = table.find('tbody tr[data-id="' + param.id + '"]');
                trKey.find('.keyVigente').hide();
                trKey.find('.keyRevogada').show();
            } else if (param.mode == 'resend_key') {
                loadingButtonConfirm(false);
                alertaBoxPro('Sucess', 'check-circle', 'Link de acesso reenviado com sucesso para o email do usu\u00E1rio!');
            } else if (param.mode == 'new_key') {
                loadingButtonConfirm(false);
                alertaBoxPro('Sucess', 'check-circle', 'Chave de acesso criada com sucesso! Link de acesso enviado no email do usu\u00E1rio');
                table.find('tbody tr .keyVigente').hide();
                table.find('tbody tr .keyRevogada').show();

                var last_tr = table.find('tbody tr:last-child');
                var id_hash = data.id_hash;
                var len = table.find('tbody tr').length;
                table.find('tbody').append(last_tr.clone().attr('data-index', len).attr('data-id', id_hash));
                table.find('tbody tr:last-child').find('td:first-child').text('ID:' + id_hash);
                table.find('tbody tr:last-child').find('.keyVigente').show();
                table.find('tbody tr:last-child').find('.keyRevogada').hide();
            }
            var linkIcon = table.find('.newLink.loading');
            var icon = linkIcon.find('i');
            linkIcon.removeClass('loading');
            icon.attr('class', icon.data('icon'));

            if (typeof data.return_row !== 'undefined' && data.return_row.length) $('#configBox_keys_container').html(callAtiv('tableConfigKeyUsers',data.return_row[0]));

        } else if (param.action == 'config_update_planos' && param.mode == 'clone') {
            setTimeout(function () {
                if (delayServerAtiv == 0) {
                    delayServerAtiv = 1; setTimeout(function () { delayServerAtiv = 0; }, 1000);
                    var listUpdate = [];
                    var tableConfig = $('#tabelaConfigPanel_' + param.type);
                    if (data.last_ids.length > 0) {
                        $.each(data.last_ids, function (i, v) {
                            var checkbox = tableConfig.find('tr[data-id="' + v + '"]').find('input[name="configuracoesPro"]');
                            checkbox.trigger('click');
                            var value = jmespath.search(tableConfigList.planos, "[?id_plano==`" + v + "`] | [0]");
                            if (value !== null) {
                                listUpdate.push(value);
                            }
                        });
                        dialogUpdateCalcPlanos(listUpdate, 'clone');
                    }
                }
            }, 5000);
        }

        setTimeout(function () {
            td.removeClass('editCellLoading').removeClass('editCellLoadingError');
            if (tr.find('.checkboxSelectConfiguracoes').is(':checked')) {
                tr.find('.checkboxSelectConfiguracoes').trigger('click');
            }
        }, 500);
    }
}
export function dialogUpdateCalcPlanos(listUpdate = tableConfigList.planos, messageBox = 'update') {
    alertaBoxPro('Sucess', 'check-circle', 'Atualizando c\u00E1lculo de horas nos planos de trabalho... <span id="countLoopPlanos"></span> <div class="info_checklist" style="height:20px"><div id="progressLoopPlanos" class="checklist_progress" style="float:none; width:95%"></div></div>');
    var time = 0;
    var index = 0;
    var total = listUpdate.length;
    $('#progressLoopPlanos').progressbar({
        value: 0,
        max: total
    });

    $.each(listUpdate, function (i, v) {
        time += 2000;

        setTimeout(function () {
            var counter = index + 1;
            callAtiv('updateConfigTempoPactuadoById',v.id_plano);
            $('#progressLoopPlanos').progressbar({ value: counter });
            $('#countLoopPlanos').text('(' + counter + '/' + total + ')');
            index++;

            if (index >= total) {
                resetDialogBoxPro('alertBoxPro');
                if (messageBox == 'update') {
                    alertaBoxPro('Sucess', 'check-circle', 'C\u00E1lculos de horas dos planos atualizados com sucesso');
                } else if (messageBox == 'clone') {
                    alertaBoxPro('Sucess', 'check-circle', 'Planos de trabalho duplicados com sucesso');
                }
            }
        }, time);
    });
}
export function getMotivosPendenciasPlanos(plano) {
    if (plano) {
        var return_ = (plano.avaliacao_pendente && callAtiv('checkOptionEntidade','pendencias_plano_avaliacao_pendente')) ? '<br>- Avalia\u00E7\u00E3o Pendente: Demandas do plano sem avalia\u00E7\u00E3o' : '';
        return_ += (plano.entrega_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_entrega_insuficiente')) ? '<br>- Entregas Insuficientes: Tempo entregue menor que a meta proporcional do plano' : '';
        // return_ += (plano.execucao_parcial) ? '<br>- Execu\u00E7\u00E3o Parcial: Tempo homologado menor que a meta proporcional do plano' : '';
        return_ += (plano.pactuacao_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_pactuacao_insuficiente')) ? '<br>- Pactua\u00E7\u00E3o Insuficiente: Tempo pactuado menor que a meta proporcional do plano' : '';
        return_ += (plano.produtividade_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_produtividade_insuficiente')) ? '<br>- Produtividade Insuficiente: Tempo despendido maior que o tempo pactuado' : '';
        return return_;
    } else {
        return '';
    }
}
export function regularizaPlano(this_ = false, data_this = false) {
    var _this = this_ ? $(this_) : false;
    var data = _this ? _this.data() : data_this;
    var id_plano = _this ? _this.closest('tr').data('id') : data.id_plano;
    id_plano = (typeof id_plano === 'undefined') ? data.id_plano : id_plano;
    var plano = (typeof id_plano !== 'undefined') ? jmespath.search(tableConfigList.planos, "[?id_plano==`" + id_plano + "`] | [0]") : null;
    plano = (plano === null) ? jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + id_plano + "`] | [0]") : plano;
    var pendencias_plano = (plano !== null) ? plano.pendencias_plano[data.refplano] : false;
    var action = 'config_update_planos';
    var capacidade = callAtiv('checkCapacidade',action);

    if (_this) {
        var idTable = '#tableConfiguracoesPanel_planos';
        var countSelected = $(idTable + ' tr.infraTrMarcada').length;
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    }


    if (pendencias_plano) {
        var htmlBox = '<div id="boxPlano" class="atividadeWork seipro-atividades-work">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '           <tr>' +
            '               <td colspan="3">' +
            '                   <i style="margin: 0 5px;" class="fas fa-exclamation-triangle vermelhoColor"></i> Existe pend\u00EAncias do ' + (data.refplano == 'presente' ? 'plano vigente' : 'plano anterior') + ' que necessitam de regulariza\u00E7\u00E3o (' + moment(pendencias_plano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(pendencias_plano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ')' +
            '               </td>' +
            '           </tr>' +
            '           <tr>' +
            '               <td colspan="3">' +
            '                   <div id="statusUserRegulariza"><canvas id="chartStatusUserRegulariza" width="500" height="70"></canvas></div>' +
            '               </td>' +
            '           </tr>' +
            (pendencias_plano.avaliacao_pendente && callAtiv('checkOptionEntidade','pendencias_plano_avaliacao_pendente') ?
                '           <tr>' +
                '               <td style="vertical-align: bottom; text-align: left; width: 200px;" class="label">' +
                '                    <label><i class="iconPopup iconSwitch fas fa-star cinzaColor"></i>Avalia\u00E7\u00E3o Pendente</label>' +
                '                </td>' +
                '                <td style="text-align: left;">Demandas do plano sem avalia\u00E7\u00E3o cadastrada</td>' +
                '                <td style="text-align: left;"><i style="margin: 0 5px;" class="fas fa-exclamation-triangle vermelhoColor"></i> Solicite a avalia\u00E7\u00E3o pela chefia imediata ' + (!capacidade ? 'com a chefia imediata' : '') + '</td>' +
                '           </tr>' +
                '' : '') +
            (pendencias_plano.entrega_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_entrega_insuficiente') ?
                '           <tr>' +
                '               <td style="vertical-align: bottom; text-align: left; width: 200px;" class="label">' +
                '                    <label><i class="iconPopup iconSwitch fas fa-inbox cinzaColor"></i>Entregas Insuficientes</label>' +
                '                </td>' +
                '                <td style="text-align: left;">Tempo entregue menor que a meta proporcional do plano</td>' +
                '                <td style="text-align: left;"><i style="margin: 0 5px;" class="fas fa-exclamation-circle laranjaColor"></i> Conclua demandas at\u00E9 a meta ou justifique a circunst\u00E2ncia ' + (!capacidade ? 'com a chefia imediata' : '') + '</td>' +
                '           </tr>' +
                '' : '') +
            (pendencias_plano.pactuacao_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_pactuacao_insuficiente') ?
                '           <tr>' +
                '               <td style="vertical-align: bottom; text-align: left; width: 200px;" class="label">' +
                '                    <label><i class="iconPopup iconSwitch fas fa-handshake cinzaColor"></i>Pactua\u00E7\u00E3o Insuficiente</label>' +
                '                </td>' +
                '                <td style="text-align: left;">Tempo pactuado menor que a meta proporcional do plano</td>' +
                '                <td style="text-align: left;"><i style="margin: 0 5px;" class="fas fa-exclamation-circle laranjaColor"></i> Conclua demandas at\u00E9 a meta ou justifique a circunst\u00E2ncia ' + (!capacidade ? 'com a chefia imediata' : '') + '</td>' +
                '           </tr>' +
                '' : '') +
            (pendencias_plano.produtividade_insuficiente && callAtiv('checkOptionEntidade','pendencias_plano_produtividade_insuficiente') ?
                '           <tr>' +
                '               <td style="vertical-align: bottom; text-align: left; width: 200px;" class="label">' +
                '                    <label><i class="iconPopup iconSwitch fas fa-chart-line cinzaColor"></i>Produtividade Insuficiente</label>' +
                '                </td>' +
                '                <td style="text-align: left;">Tempo despendido maior que o tempo pactuado</td>' +
                '                <td style="text-align: left;"><i style="margin: 0 5px;" class="fas fa-exclamation-circle laranjaColor"></i> Justifique a circunst\u00E2ncia ' + (!capacidade ? 'com a chefia imediata' : '') + '</td>' +
                '           </tr>' +
                '' : '') +
            (capacidade ?
                '           <tr>' +
                '               <td colspan="3">' +
                '                   <textarea id="comment_homologacao" style="height: 150px;" data-act="atividades-comment-homologacao"></textarea>' +
                '               </td>' +
                '           </tr>' +
                '' : '') +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: 'Regularizar plano de trabalho',
                width: 780,
                open: function () {
                    var element = $('#chartStatusUserRegulariza');
                    var mostrar_notas = jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + pendencias_plano.id_unidade + "`] | [0].config.planos.mostrar_notas");
                    var apelido_display = (mostrar_notas !== null && mostrar_notas) ? 'apelido_avaliacao' : 'apelido';
                    var chartStatusUser = callAtiv('getSingleChartTempoPlano',element, pendencias_plano, pendencias_plano[apelido_display]);
                    chartStatusUser.options.scales.x.ticks.display = false;
                    // chartStatusUser.options.legend.display = false;
                    // chartStatusUser.options.title = {display: true, text: unidade.nome_unidade+' - '+unidade.sigla_unidade};
                    chartStatusUser.update();
                },
                close: function () {
                    $('#boxPlano').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: (capacidade ? 'Salvar' : 'Ok'),
                    class: 'confirm',
                    click: function (event) {
                        if (capacidade) {
                            var comment_homologacao = $('#comment_homologacao').val();
                            if (comment_homologacao.length < 100) {
                                alertaBoxPro('Error', 'exclamation-triangle', 'Justificativa curta.');
                            } else {
                                var param = {
                                    action: action,
                                    id: pendencias_plano.id_plano,
                                    type: 'planos',
                                    key: comment_homologacao,
                                    mode: 'homologacao'
                                };
                                getServerAtividades(param, action);
                            }
                        } else {
                            $('#boxPlano').remove();
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }
                }]
            });
    }
}
export function addNewsRowsTableTabConfig(param, data, id, tr, table_id) {
    var v = jmespath.search(data.return_row, "[?" + data.return_row[0].primarykey + "==`" + id + "`] | [0]");
    var new_tr = $('#' + table_id).find('tbody').find('tr[data-id="' + id + '"]');
    var label_id = getLabIdTables(param.type);

    if (typeof tableConfigList[param.type] === 'undefined') tableConfigList[param.type] = [];

    objIndex = (typeof tableConfigList[param.type] === 'undefined' || tableConfigList[param.type] == 0 || tableConfigList[param.type].length == 0) ? -1 : tableConfigList[param.type].findIndex((obj => obj[label_id] == param.id));
    if (objIndex !== -1) {
        tableConfigList[param.type][objIndex] = v;
    } else if (typeof tableConfigList[param.type] !== 'undefined') {
        tableConfigList[param.type].push(v);
    }

    objIndexAtiv = (typeof arrayConfigAtividades[param.type] === 'undefined' || arrayConfigAtividades[param.type] == 0 || arrayConfigAtividades[param.type].length == 0) ? -1 : arrayConfigAtividades[param.type].findIndex((obj => obj[label_id] == param.id));
    if (objIndexAtiv !== -1) {
        arrayConfigAtividades[param.type][objIndexAtiv] = v;
    }
    var htmlRowConfig = getRowsTableTabConfig(param.type, 'body', tableConfigList[param.type], v);
    if (new_tr.length) {
        setTimeout(() => {
            $('#' + table_id).find('tbody').find('tr[data-id="' + id + '"]').after(htmlRowConfig).remove();
        });
    } else {
        setTimeout(() => {
            $('#' + table_id).find('tbody').prepend(htmlRowConfig);
        });
    }
    if (typeof data.refresh_page !== 'undefined' && data.refresh_page && typeof tableConfigList[param.type][0] !== 'undefined') {
        var primarykey = tableConfigList[param.type][0].primarykey;
        var uniqTableConfig = tableConfigList[param.type].filter((value, index, self) => {
            return self.findIndex(v => v[primarykey] === value[primarykey]) === index;
        });
        tableConfigList[param.type] = uniqTableConfig;
        callAtiv('getTableTabConfig',param.type, { offset: false, next_offset: false, status: 1, config: uniqTableConfig }, param);
    }
    // $('#'+table_id).trigger('update');
}
export function getUnidadeInstituidora() {
    var config_unidade = callAtiv('getConfigDadosUnidade',arrayConfigAtividades.perfil.unidade);
    return (typeof config_unidade.unidade_instituidora !== 'undefined' && config_unidade.unidade_instituidora !== null) ? config_unidade.unidade_instituidora : false;
}
export function getRowsTableTabConfig(type, mode, list = false, value = false) {
    var _return = '';
    var listUnidades = list && list.length ? uniqPro(jmespath.search(list, "[?sigla_unidade].sigla_unidade")) : null;
    var countUnidades = (listUnidades !== null) ? listUnidades.length : 0;
    var checkOutrasUnidades = (countUnidades > 1 || (countUnidades == 1 && arrayConfigAtivUnidade.sigla_unidade != listUnidades[0])) ? true : false;
    var isInitOffset = (typeof list.offset === 'undefined' || list.offset == 0) ? true : false;

    if (type == 'atividades') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome d' + __.a_Atividade + '</th>' +
                '              <th class="tituloControle tituloFilter">Tempo Pactuado (horas)</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Dias de Planejamento</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 350px;">Macroatividade</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">Etiquetas</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 350px;">Cadeia de Valor</th>' +
                (checkOutrasUnidades ?
                    '              <th class="tituloControle tituloFilter" style="width: 90px;">Unidade</th>' +
                    '' : '') +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 160px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                if (value.exclude == false) {
                    var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                    var classClone = (value.nome_atividade.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                    var classNew = (value.nome_atividade.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                    var classHomologa = (value.homologado) ? { name: ' approve', text: 'HOMOLOGADO' } : { name: ' disapprove', text: '' };
                    // var config = (typeof value.config !== 'undefined' && value.config !== null) ? value.config : false;
                    var tagsAtiv = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas.join(';') : '';
                    var tagsAtivHtml = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(value.etiquetas, function (i) { return getHtmlEtiqueta(i, 'ativ') }).join('') : '';
                    var label_id = getLabIdTables(type);

                    _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_atividade + '" data-index="' + value.id_atividade + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : (classHomologa ? ' ' + classHomologa.name : '')) + '">' +
                        '           <td align="center" data-id="' + value.id_atividade + '">' +
                        '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_atividade + '" name="configuracoesPro" value="' + value.id_atividade + '" ' + ((callAtiv('checkCapacidade','config_approve_atividades') || !value.homologado) ? '' : 'disabled') + '></td>' +
                        '           <td align="left" class="' + (callAtiv('checkCapacidade','config_approve_atividades') || !value.homologado ? 'editCell' : '') + '" data-key="nome_atividade" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : (classHomologa ? ' ' + classHomologa.text : ''))) + '"><span>' + value.nome_atividade + '</span></td>' +
                        '           <td align="left" class="' + (callAtiv('checkCapacidade','config_approve_atividades') || !value.homologado ? 'editCellNum' : '') + '" data-key="tempo_pactuado">' + value.tempo_pactuado + '</td>' +
                        '           <td align="left" class="editCellNum" data-key="dias_planejado">' + value.dias_planejado + '</td>' +
                        '           <td align="left" class="editCellSelect" data-array="self" data-key="macroatividade" data-value="macroatividade" data-blank-item="true" data-blank-value="">' + (value.macroatividade ? value.macroatividade : '') + '</td>' +
                        '           <td align="left" class="" data-array="self" data-key="etiquetas" data-value="etiquetas" data-type="etiqueta" data-etiqueta-mode="tipo_ativ" class="tdmonitorado_tags ' + ((tagsAtivHtml.trim() == '' && callAtiv('checkCapacidade','config_approve_atividades')) ? 'info_tags_follow_empty' : '') + '" >' +
                        '               <span class="info_tags_follow">' + tagsAtivHtml +
                        '               </span>' +
                        (!callAtiv('checkCapacidade','edit_etiqueta_atividades') ? '' :
                            '               <span class="info_tags_follow_txt seipro-atividades-tags" style="display:none">' +
                            '                   <input value="' + tagsAtiv + '" class="atividadeTagsPro" name="atividadeTagsPro">' +
                            '               </span>' +
                            '               <a class="newLink followLink followLinkTags followLinkTagsEdit" data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="tipo_ativ\" data-tip="Editar etiqueta"><i class="fas fa-edit" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLink followLinkTags followLinkTagsAdd" data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="tipo_ativ\" data-tip="Adicionar etiqueta"><i class="fas fa-tags" style="font-size: 100%;"></i></a>'
                        ) +
                        '           </td>' +
                        '           <td align="left" class="editCellSelect" data-array="cadeia_valor" data-key="id_cadeia_valor" data-value="nome_processo" data-new-item="false" data-blank-item="true">' + (value.id_cadeia_valor ? value.nome_processo : '') + '</td>' +
                        (checkOutrasUnidades ?
                            '           <td align="left" class="' + (callAtiv('checkCapacidade','config_approve_atividades') || !value.homologado ? 'editCellSelect' : '') + '" data-array="unidades" data-key="id_unidade" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade + '</td>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '           <td align="left">' +
                            '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_atividade + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                            '           </td>' +
                            '           <td align="right" data-key="action">' +
                            (callAtiv('checkCapacidade','config_approve_atividades') ?
                                '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_atividade + '" data-mode="disapprove" style="' + (!value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-tip="Cancelar Homologa\u00E7\u00E3o"><i class="fas fa-thumbs-down vermelhoColor" style="font-size: 100%;"></i></a>' +
                                '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_atividade + '" data-mode="approve" style="' + (value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-tip="Homologar"><i class="fas fa-thumbs-up" style="font-size: 100%;"></i></a>' +
                                '' : '') +
                            (callAtiv('checkCapacidade','config_update_pgr') || !value.homologado ?
                                '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_atividade + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                                '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_atividade + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                                (callAtiv('checkCapacidade','config_new_' + type) ?
                                    '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_atividade + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                                    '' : '') +
                                '' : '') +
                            '           </td>' +
                            '' : '') +
                        '       </tr>';
                }
            } else {
                var colspan = 7;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'planos') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Respons\u00E1vel</th>' +
                (checkOutrasUnidades ?
                    '              <th class="tituloControle tituloFilter" style="width: 100px;">Unidade</th>' +
                    '' : '') +
                '              <th class="tituloControle tituloFilter" style="min-width: 110px;">Tipo de Modalidade</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 70px;">Carga Hor\u00E1ria</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 140px;">Meta Total do Plano (horas)</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 140px;">Meta Proporcional do Plano (horas)</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 140px;">Execu\u00E7\u00E3o do Plano (%)</th>' +
                (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Qtd. de Entregas Vinculadas</th>' +
                    '' : '') +
                '              <th class="tituloControle tituloFilter" style="min-width: 350px;" colspan="2">Op\u00E7\u00F5es</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 220px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value && value.show) {
                var checkPlanoTrabalho = checkPlanoAntesAssinatura(value, type);
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
                var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
                var exige_entregas_programa = (modalidade_config && modalidade_config.hasOwnProperty('exige_entregas_programa')) ? modalidade_config.exige_entregas_programa : false;
                var view_modelos = (modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;
                var assinatura = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.assinatura !== 'undefined' && value.config.hasOwnProperty('assinatura')) ? value.config.assinatura : false;
                var checkLimitePlano = callAtiv('calcLimitePlanosModalidade',value);
                var numMonthsPlano = getNumMonthsBetween2Dates(value);
                var classCheckLimitePlano = !checkPlanoTrabalho.check && hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite ? 'editCellLoadingError' : '';
                var textExcedeLimite = !checkPlanoTrabalho.check && hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite ? 'O plano de trabalho excede o limite de vagas da modalidade (' + checkLimitePlano.limite_modalidade + '% dos ' + checkLimitePlano.vagas_programa + ' participantes v\u00E1lidos = ' + checkLimitePlano.limite_vagas + ' vagas). Reduza ao menos ' + (checkLimitePlano.planos_vigentes - checkLimitePlano.limite_vagas) + ' vagas' : '';
                textExcedeLimite = !checkPlanoTrabalho.check && hasAtiv('checkLimitePlano') && checkLimitePlano.vagas_programa < checkLimitePlano.minimo_participantes ? 'A unidade n\u00E3o possui o m\u00EDnimo de ' + checkLimitePlano.minimo_participantes + ' participantes para a ades\u00E3o a essa modalidade de plano' : textExcedeLimite;
                var alertaExcedeLimite = !checkPlanoTrabalho.check && hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite ? 'data-tip="' + textExcedeLimite + '"' : '';
                var btnAssinatura = checkPlanoTrabalho.btn;
                btnAssinatura = typeof btnAssinatura !== 'undefined' ? btnAssinatura : '';
                btnAssinatura = classDisabled != '' ? '' : btnAssinatura;
                var homologacao = (typeof value.homologado !== 'undefined' && value.homologado !== null && value.homologado && typeof value.config !== 'undefined' && value.config !== null && typeof value.config.homologacao !== 'undefined' && value.config.hasOwnProperty('homologacao')) ? value.config.homologacao : false;
                var classArchived = (typeof value.data_arquivamento !== 'undefined' && moment(value.data_arquivamento, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_arquivamento != '0000-00-00 00:00:00') ? { name: ' archived', text: 'ARQUIVADO' } : false;
                var btnHomologacao = (homologacao)
                    ? '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" ' + (callAtiv('checkCapacidade','config_update_cancela_homologa_plano') && !classArchived ? 'data-act="atividades-call" data-fn="cancelHomologacaoPlano"' : '') + ' data-tip="' + value.config.homologacao.result + ' em ' + moment(value.config.homologacao.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + (value.config.homologacao.type != 'system' ? '<br>- ' + value.config.homologacao.comment.replace(/['"]+/g, '').replace(/(\r\n|\n|\r)/gm, "<br>") : '') + (callAtiv('checkCapacidade','config_update_cancela_homologa_plano') ? (!classArchived ? '<br><br><b>Clique para Cancelar a Homologa\u00E7\u00E3o</b>' : '') : '') + '"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-' + (value.config.homologacao.type == 'system' ? 'cog' : 'user-tie') + ' azulColor iconPlanoHomologa" style="font-size: 100%; margin-left: -10px;"></i></a>'
                    : !value.homologado && !value.em_execucao && !value.execucao_futura && value.vigencia && value.pendencias_plano && value.pendencias_plano.presente && !value.pendencias_plano.presente.homologavel
                        ? '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-act="atividades-call" data-fn="regularizaPlano" data-refplano="presente" data-tip="Plano de trabalho pendente de homologa\u00E7\u00E3o. Clique para mais detalhes. ' + getMotivosPendenciasPlanos(value.pendencias_plano.presente) + ' "><i class="fas fa-check-double vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
                        : '';
                btnHomologacao = classDisabled != '' ? '' : btnHomologacao;
                var btnProdutividadeMensalPlano = classDisabled != '' || !callAtiv('checkCapacidade','chart_produtividade_mensal') ? '' : '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-act="atividades-call" data-fn="getChartProdutividadeMes" data-pass-el="0" data-id="' + value.id_plano + '" data-tip="Clique para visualizar o relat\u00F3rio geral do plano"><i class="fas fa-chart-line azulColor" style="font-size: 100%;"></i></a>';
                var btnMemoriaCalculoPlano = classDisabled == '' && (getOptionsPro('panelAtividadesViewSubordinada') || arrayConfigAtividades.perfil.id_unidade == value.id_unidade) ? '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-act="atividades-call" data-fn="getRelatorioMetaProporcional" data-pass-el="0" data-id="' + value.id_plano + '" data-tip="Clique para visualizar a mem\u00F3ria de c\u00E1lculo da meta proporcional do plano"><i class="fas fa-calculator azulColor" style="font-size: 100%;"></i></a>' : '';
                var btnDemandasPlano = classDisabled != '' ? '' : '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-id_plano="' + value.id_plano + '" data-act="atividades-call" data-fn="getTableRelatorioPlano" data-tip="Clique para visualizar a lista de ' + __.demandas + ' do plano"><i class="fas fa-check-circle azulColor" style="font-size: 100%;"></i></a>';

                var classAssinatura = (view_modelos && assinatura && (!callAtiv('getOptionEntidade','tipo_vinculacao_termo') || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 1)) ? 'alertAssinatura ' : '';
                var classHomologado = (callAtiv('checkHomologacaoPreviaPlanos',value) && value.homologado) ? 'alertHomologacao ' : '';

                var numAvaliacoesPlano = value.avaliacao_plano ? uniqPro(jmespath.search(value.avaliacao_plano, "[].indice_mes_entrega")).length : 0;
                var checkPlanoAvaliado = numAvaliacoesPlano > 0 && numAvaliacoesPlano == numMonthsPlano ? true : false;
                var checkAvaliavel = value.homologado && callAtiv('checkHomologacaoPreviaPlanos',value) && callAtiv('checkOptionEntidade','exigir_avaliacao_previa_planos') && checkPlanoTrabalho.check && callAtiv('checkCapacidade','rate_plano') ? true : false;
                var classAvaliado = checkAvaliavel && checkPlanoAvaliado ? { name: ' rate', text: 'AVALIADO' } : { name: ' ', text: '' };
                var classAvaliado = checkAvaliavel && !checkPlanoAvaliado ? false : classAvaliado;

                var verifyRecurso = verifyStatusRecurso(value);
                var checkRecurso = verifyRecurso.check;
                var statusRecurso = verifyRecurso.status;

                var classArchivable = (homologacao && typeof value.data_arquivamento !== 'undefined' && moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment() && (moment(value.data_arquivamento, 'YYYY-MM-DD HH:mm:ss') > moment() || value.data_arquivamento == '0000-00-00 00:00:00')) ? ' archivable' : '';
                classArchivable = callAtiv('checkHomologacaoPreviaPlanos',value) && checkPlanoAvaliado && (!checkRecurso || (checkRecurso && statusRecurso.status > 2)) ? ' archivable' : classArchivable;
                classArchivable = classArchived ? '' : classArchivable;

                var checkHomologavel = !checkPlanoAvaliado && callAtiv('checkHomologacaoPreviaPlanos',value) && checkPlanoTrabalho.check && callAtiv('checkCapacidade','config_approve_planos') ? true : false;
                checkHomologavel = !callAtiv('checkOptionEntidade','permitir_autohomologacao_planos') && value.id_user == arrayConfigAtividades.perfil.id_user ? false : checkHomologavel;
                checkHomologavel = callAtiv('checkPerfilNivelAdm',) && !checkPlanoAvaliado ? true : checkHomologavel;
                var classHomologa = value.homologado ? { name: ' approve', text: 'HOMOLOGADO' } : { name: ' disapprove', text: '' };
                classHomologa = checkHomologavel ? classHomologa : { name: '', text: '' };

                var entregas = (typeof value.entregas !== 'undefined' && value.entregas !== null) ? value.entregas : false;

                var checkEditavel = callAtiv('checkHomologacaoPreviaPlanos',value) ? callAtiv('checkCapacidade','config_update_' + type) && !value.homologado : callAtiv('checkCapacidade','config_update_' + type);
                checkEditavel = classDisabled != '' ? false : checkEditavel;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_plano + '"  data-idref="' + value.id_user + '" data-idreftype="id_user" class="' + (classArchived ? classArchived.name : '') + classArchivable + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : (classAvaliado ? ' ' + classAvaliado.name : (classHomologa ? ' ' + classHomologa.name : '')))) + '">' +
                    '           <td align="center" data-id="' + value.id_plano + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_plano + '" name="configuracoesPro" value="' + value.id_plano + '" ' + ((type == 'planos' && callAtiv('checkCapacidade','config_update_self_planos')) || callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (checkEditavel ? 'editCellSelect' : '') + ' ' + classAssinatura + classHomologado + '" data-array="usuarios" data-key="id_user" data-value="nome_completo" data-new-item="false" data-text="' + (classArchived ? classArchived.text : (classClosed ? classClosed.text : (classFuture ? classFuture.text : (classAvaliado ? ' ' + classAvaliado.text : (classHomologa ? ' ' + classHomologa.text : ''))))) + '"><span>' + value.nome_completo + '</span></td>' +
                    (checkOutrasUnidades ?
                        '           <td align="left" class="' + (checkEditavel ? 'editCellSelect' : '') + ' ' + classAssinatura + classHomologado + '" data-array="unidades" data-key="id_unidade" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade + '</td>' +
                        '' : '') +
                    '           <td align="left" ' + alertaExcedeLimite + ' class="' + classCheckLimitePlano + ' ' + (checkEditavel ? 'editCellSelect' : '') + ' ' + classAssinatura + classHomologado + '" data-array="tipos_modalidades" data-key="id_tipo_modalidade" data-value="nome_modalidade" data-new-item="false">' + value.nome_modalidade + '</td>' +
                    '           <td align="left" style="text-align:center;" class="' + (checkEditavel ? 'editCellNum' : '') + ' ' + classAssinatura + classHomologado + '" data-key="carga_horaria">' + value.carga_horaria + '</td>' +
                    '           <td align="left" style="text-align:center;" class="' + (checkEditavel ? 'editCellDate' : '') + ' ' + classAssinatura + classHomologado + '" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" style="text-align:center;" class="' + (checkEditavel ? 'editCellDate' : '') + ' ' + classAssinatura + classHomologado + '" data-key="data_fim_vigencia" data-ref-limit="data_fim" data-label-limit="data_inicio" data-limit="min" data-time-sorter="' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" class="" data-key="tempo_total" style="text-align: center;">' + format2Decimal(value.tempo_total) + '</td>' +
                    '           <td align="left" class="" data-key="tempo_proporcional" style="text-align: center;">' + format2Decimal(value.tempo_proporcional) + '</td>' +
                    '           <td align="left" class="" style="text-align: center;">' + (value.execucao_plano ? parseFloat((value.execucao_plano * 100).toFixed(2)) : 0) + '</td>' +
                    (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                        '           <td align="left" class="" data-key="quantidade_entregas" style="text-align: center;">' + (exige_entregas_programa && callAtiv('checkHomologacaoPreviaProgramas',value) ? value.quantidade_entregas : '-') + '</td>' +
                        '' : '') +
                    '           <td align="left" style="width: 250px;" data-time-sorter="' + (view_modelos && assinatura ? assinatura[0].datetime : (view_modelos ? '0000-00-00 00:00:00' : '')) + '">' +
                    '               ' + btnDemandasPlano + btnProdutividadeMensalPlano + btnMemoriaCalculoPlano + btnAssinatura + btnHomologacao +
                    (checkRecurso && statusRecurso.status == 1 && value.id_user == arrayConfigAtividades.perfil.id_user ?
                        '               <a class="newLink" data-type="' + type + '" data-id="' + value.id_plano + '" data-indice="' + verifyRecurso.indice + '" data-mode="rate" style="font-size: 10pt;" data-act="atividades-call" data-fn="ratePlano">' +
                        '                   <i class="fas fa-gavel" style="font-size: 100%;"></i>Recursar' +
                        '               </a>' +
                        '' : '') +
                    (callAtiv('checkCapacidade','config_update_self_planos_entregas') && entregas && !value.homologado && value.id_user == arrayConfigAtividades.perfil.id_user ?
                        '               <a class="newLink" data-type="' + type + '" data-id="' + value.id_plano + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="getDialogEntregasPlanos">' +
                        '                   <i class="fas fa-hand-holding" style="font-size: 100%;"></i>Vincular entregas' +
                        '               </a>' +
                        '' : '') +
                    '           </td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left" style="width: 100px;">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_plano + '">' +
                        '                   <i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es' +
                        '               </a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action" style="width: 200px;">' +
                        (checkHomologavel ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="disapprove" style="' + (!value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-tip="Cancelar Homologa\u00E7\u00E3o"><i class="fas fa-thumbs-down vermelhoColor" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="approve" style="' + (value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-tip="Homologar"><i class="fas fa-thumbs-up" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (classDisabled == '' && callAtiv('checkCapacidade','config_update_archive_planos') && classArchivable != '' ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="archive" data-act="atividades-call" data-fn="archiveConfig" data-tip="Arquivar"><i class="fas fa-inbox" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (classDisabled == '' && callAtiv('checkCapacidade','config_update_archive_planos') && classArchived ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="unarchive" data-act="atividades-call" data-fn="archiveConfig" data-tip="Desarquivar"><i class="fas fa-box-open" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (classDisabled == '' && !classAvaliado ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="close" data-act="atividades-call" data-fn="closeConfig" data-tip="Encerrar Antecipadamente"><i class="fas fa-hourglass-end" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_update_pgr') ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (classDisabled == '' && callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_plano + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else if (!value) {
                var colspan = 9;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + (colspan + 1) + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'termos') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Respons\u00E1vel</th>' +
                (checkOutrasUnidades ?
                    '              <th class="tituloControle tituloFilter" style="width: 100px;">Unidade</th>' +
                    '' : '') +
                '              <th class="tituloControle tituloFilter" style="min-width: 110px;">Tipo de Modalidade</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 350px;" colspan="2">Op\u00E7\u00F5es</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) || callAtiv('checkCapacidade','config_update_self_termos') ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 150px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value && value.show) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
                var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
                var view_modelos = (modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;
                var assinatura = (typeof value.config_documento !== 'undefined' && value.config_documento !== null && typeof value.config_documento.assinatura !== 'undefined' && value.config_documento.hasOwnProperty('assinatura')) ? value.config_documento.assinatura : false;
                var checkPlanoTrabalho = checkTermoAntesAssinatura(value, type);
                var btnAssinatura = checkPlanoTrabalho.btn;
                btnAssinatura = typeof btnAssinatura !== 'undefined' ? btnAssinatura : '';
                var classAssinatura = (view_modelos && assinatura && callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 2) ? 'alertAssinatura' : '';
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_termo + '"  data-idref="' + value.id_user + '" data-idreftype="id_user" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : '')) + '">' +
                    '           <td align="center" data-id="' + value.id_termo + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_termo + '" name="configuracoesPro" value="' + value.id_termo + '" ' + ((type == 'planos' && callAtiv('checkCapacidade','config_update_self_planos')) || callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + ' ' + classAssinatura + '" data-array="usuarios" data-key="id_user" data-value="nome_completo" data-new-item="false" data-text="' + (classClosed ? classClosed.text : (classFuture ? classFuture.text : '')) + '"><span>' + value.nome_completo + '</span></td>' +
                    (checkOutrasUnidades ?
                        '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + ' ' + classAssinatura + '" data-array="unidades" data-key="id_unidade" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade + '</td>' +
                        '' : '') +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + ' ' + classAssinatura + '" data-array="tipos_modalidades" data-key="id_tipo_modalidade" data-value="nome_modalidade" data-new-item="false">' + value.nome_modalidade + '</td>' +
                    '           <td align="left" style="text-align:center;" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellDate' : '') + ' ' + classAssinatura + '" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" style="text-align:center;" class="' + classAssinatura + '" data-time-sorter="' + (value.data_fim_vigencia == '0000-00-00 00:00:00' ? '0000-00-00' : moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) + '">' + (value.data_fim_vigencia == '0000-00-00 00:00:00' ? '-' : moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '</td>' +
                    '           <td align="left" style="width: 190px;" ' + (!callAtiv('checkCapacidade','config_update_' + type) && callAtiv('checkCapacidade','config_update_self_termos') && value.id_user != arrayConfigAtividades.perfil.id_user ? 'colspan="3"' : '') + ' data-time-sorter="' + (view_modelos && assinatura ? assinatura[0].datetime : (view_modelos ? '0000-00-00 00:00:00' : '')) + '">' +
                    '               ' + btnAssinatura +
                    '           </td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) || (callAtiv('checkCapacidade','config_update_self_termos') && value.id_user == arrayConfigAtividades.perfil.id_user) ?
                        '           <td align="left" style="width: 150px;">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_termo + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action" style="width: 200px;">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_termo + '" data-mode="close" data-act="atividades-call" data-fn="closeConfig" data-tip="Encerrar Antecipadamente"><i class="fas fa-hourglass-end" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_update_pgr') || (callAtiv('checkCapacidade','config_update_self_termos') && value.id_user == arrayConfigAtividades.perfil.id_user) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_termo + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_termo + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_termo + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else if (!value) {
                var colspan = 9;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + (colspan + 1) + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'programas') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                (checkOutrasUnidades ?
                    '              <th class="tituloControle tituloFilter">Unidade</th>' +
                    '' : '') +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                    '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                    (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                        '              <th class="tituloControle tituloFilter" style="width: 80px;">Qtd. de Entregas Vinculadas</th>' +
                        '' : '') +
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Planos V\u00E1lidos</th>' +
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Qtd. de Demandas</th>' +
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Meta Total (horas)</th>' +
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Meta Proporcional (horas)</th>' +
                    (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                        '              <th class="tituloControle tituloFilter" style="width: 80px;">Produtividade M\u00E9dia (%)</th>' +
                        '' : '') +
                    '              <th class="tituloControle tituloFilter" style="width: 80px;">Execu\u00E7\u00E3o (%)</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="width: 150px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="width: 150px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var produtividade = parseFloat((value.produtividade * 100).toFixed(2));
                var execucao_plano = parseFloat((value.execucao_plano * 100).toFixed(2));
                var checkConformidade = checkProgramaConformidade(value, type);
                var btnConformidade = checkConformidade.btn;

                var checkHomologavel = !value.id_avaliacao && callAtiv('checkHomologacaoPreviaProgramas',value) && (getUnidadeInstituidora() || value.id_unidade != arrayConfigAtividades.perfil.id_unidade) && checkConformidade.check && callAtiv('checkCapacidade','config_approve_programas') ? true : false;
                var classHomologa = value.homologado ? { name: ' approve', text: 'HOMOLOGADO' } : { name: ' disapprove', text: '' };
                classHomologa = checkHomologavel ? classHomologa : { name: '', text: '' };

                var checkAvaliavel = value.homologado && callAtiv('checkHomologacaoPreviaProgramas',value) && callAtiv('checkOptionEntidade','exigir_avaliacao_previa_programas') && checkConformidade.check && callAtiv('checkCapacidade','rate_programa') ? true : false;
                var classAvaliado = checkAvaliavel && value.id_avaliacao ? { name: ' rate', text: 'AVALIADO' } : { name: ' ', text: '' };
                var classAvaliado = checkAvaliavel && !value.id_avaliacao ? false : classAvaliado;

                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_programa + '" data-idref="' + value.id_unidade + '" data-idreftype="id_unidade" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : (classAvaliado ? ' ' + classAvaliado.name : (classHomologa ? ' ' + classHomologa.name : '')))) + '">' +
                    '           <td align="center" data-id="' + value.id_programa + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_programa + '" name="configuracoesPro" value="' + value.id_programa + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    (checkOutrasUnidades ?
                        '           <td align="left" class="' + (value.homologado ? '' : 'editCellSelect') + '" data-array="unidades" data-key="id_unidade" data-value="nome_sigla_unidade" data-new-item="false">' + value.nome_sigla + '</td>' +
                        '' : '') +
                    '           <td align="left" class="editCellDate" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_fim_vigencia" data-ref-limit="data_fim" data-label-limit="data_inicio" data-limit="min" data-time-sorter="' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                        '           <td align="left" class="" data-key="quantidade_entregas" style="text-align: center;">' + value.quantidade_entregas + '</td>' +
                        '' : '') +
                    '           <td align="left" class="" data-key="total_planos" style="text-align: center;">' + value.total_planos + '</td>' +
                    '           <td align="left" class="" data-key="quantidade_demandas" style="text-align: center;">' + value.quantidade_demandas + '</td>' +
                    '           <td align="left" class="" data-key="tempo_total" style="text-align: center;">' + format2Decimal(value.tempo_total) + '</td>' +
                    '           <td align="left" class="" data-key="tempo_proporcional" style="text-align: center;">' + format2Decimal(value.tempo_proporcional) + '</td>' +
                    (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                        '           <td align="left" class="" data-key="produtividade" style="text-align: center;">' + produtividade + '</td>' +
                        '' : '') +
                    '           <td align="left" class="" data-key="execucao_plano" style="text-align: center;">' + execucao_plano + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' + btnConformidade +
                        (callAtiv('checkHomologacaoPreviaProgramas',value) ?
                            '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_programa + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                            '' : '') +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (checkHomologavel ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_programa + '" data-mode="disapprove" style="' + (!value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-word="ESTOU CIENTE" data-alert="<br><br><b style=\'font-weight: bold;\'>Esta a\u00E7\u00E3o ir\u00E1 cancelar a homologa\u00E7\u00E3o de TODOS os planos de trabalho vinculados</b>" data-tip="Cancelar Homologa\u00E7\u00E3o"><i class="fas fa-thumbs-down vermelhoColor" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_programa + '" data-mode="approve" style="' + (value.homologado ? 'display:none' : '') + '" data-act="atividades-call" data-fn="approveConfig" data-tip="Homologar"><i class="fas fa-thumbs-up" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_update_pgr') ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_programa + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_programa + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_programa + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 12;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'users') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome Completo</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Apelido</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Matr\u00EDcula</th>' +
                (callAtiv('checkCapacidade','view_lgpd') ?
                    '              <th class="tituloControle tituloFilter" style="width: 150px;">CPF</th>' +
                    '' : '') +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Usu\u00E1rio SEI</th>' +
                '              <th class="tituloControle tituloFilter">E-mail</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 200px;" data-filter-type="lotacao">Lota\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 120px;">Perfil</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 120px;">Acesso</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_completo.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_completo.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var lotacao = (value.lotacao !== null) ? $.map(value.lotacao, function (v) {
                    var tagName = normalizeNameTag(v.sigla_unidade);
                    var tagColor = (typeof v.config_lotacao !== 'undefined' && v.config_lotacao !== null && v.config_lotacao.principal) ? { color: '#bfd5e8', background: '#406987', textcolor: 'white' } : { color: '#406987', background: '#bfd5e8', textcolor: 'black' };
                    return '<span data-tagname="' + tagName + '" data-textcolor="' + tagColor.textcolor + '" data-icontag="briefcase" data-type="lotacao" style="background-color: ' + tagColor.background + '; color: ' + tagColor.color + ';" class="tag_text tagTableText_' + tagName + '" data-act="atividades-call" data-fn="filterTagView" data-colortag="' + tagColor.color + '">' +
                        '   <i class="tagicon fas fa-briefcase" style="font-size: 90%;margin: 0 2px; color: ' + tagColor.color + '"></i>' +
                        '   ' + v.sigla_unidade +
                        '</span>';
                }).join('') : false;
                lotacao = (lotacao) ? '<span class="info_tags_follow" style="display: block;">' + lotacao + '</span>' : '';
                var tagsConfigClass = (lotacao) ? $.map(value.lotacao, function (i) { return 'tagTableName_' + normalizeNameTag(i.sigla_unidade); }).join(' ') : '';
                var label_id = getLabIdTables(type);
                var user_key = value && typeof value.keys !== 'undefined' && value.keys !== null ? jmespath.search(value.keys, "[?data_fim=='0000-00-00 00:00:00'] | [0]") : null;
                user_key = user_key !== null ? user_key : false;
                var icon_user_key = user_key ? '<span style="background-color: #bfe8c4;padding: 3px 5px;border-radius: 5px;"><i class="fas fa-key" style="font-size: 90%;margin: 0 2px;color: #408743;"></i> ID:' + user_key.id_hash + '</span>' : '';

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_user + '" class="' + tagsConfigClass + ' ' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_user + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_user + '" name="configuracoesPro" value="' + value.id_user + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_completo" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_completo + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="apelido">' + value.apelido + '</td>' +
                    '           <td align="left" class="editCell" data-key="matricula">' + value.matricula + '</td>' +
                    (callAtiv('checkCapacidade','view_lgpd') ?
                        '           <td align="left" class="editCellCPF" data-key="cpf">' + (typeof value.cpf !== 'undefined' && value.cpf !== null ? maskCPF(value.cpf) : '') + '</td>' +
                        '' : '') +
                    '           <td align="left" class="editCell" data-key="login">' + value.login + '</td>' +
                    '           <td align="left" class="editCell" data-key="email">' + value.email + '</td>' +
                    '           <td align="left" class="" data-key="lotacao">' +
                    '               ' + lotacao +
                    // '               <table style="width: 110px;float: right;" data-id="'+value.id_user+'"><tr data-id="'+value.keys[0].id_hash+'"><td style="height: 25px !important;"><a class="newLink keyVigente keyResend" style="font-size: 10pt; cursor:pointer;" data-act="atividades-call" data-fn="configUpdateKey" data-arg="resend_key"><i class="fas fa-envelope-open-text" data-icon="fas fa-envelope-open-text" style="font-size: 100%;"></i>Reenviar</a></td></tr></table>'+
                    '           </td>' +
                    '           <td align="left" data-key="perfil">' + value.nome_perfil + '</td>' +
                    '           <td align="left" data-key="user_key">' + icon_user_key + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_user + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_users_all') ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_user + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_user + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            (callAtiv('checkCapacidade','config_new_' + type) ?
                                '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_user + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                                '' : '') +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 9;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'unidades') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da Unidade</th>' +
                '              <th class="tituloControle tituloFilter">Sigla da Unidade</th>' +
                '              <th class="tituloControle tituloFilter">C\u00F3digo SIORG</th>' +
                '              <th class="tituloControle tituloFilter">Depend\u00EAncia</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_unidade.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_unidade.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var dependencia_config = (value.dependencia_config && value.dependencia_config !== null && (Object.keys(value.dependencia_config).length > 0 || value.dependencia_config.length > 0)) ? value.dependencia_config : false;
                var autoedicao_subordinadas = (dependencia_config && dependencia_config !== null && typeof dependencia_config.administrativo !== 'undefined' && typeof dependencia_config.administrativo.autoedicao_subordinadas !== 'undefined' && dependencia_config.administrativo.autoedicao_subordinadas) ? dependencia_config.administrativo.autoedicao_subordinadas : false;
                var checkAutoEdit = (callAtiv('checkCapacidade','config_unidades_all') || arrayConfigAtivUnidade.dependencia == 0 || (arrayConfigAtivUnidade.dependencia != 0 && jmespath.search(tableConfigList.unidades, "[?dependencia==`" + arrayConfigAtivUnidade.dependencia + "`] | [0].dependencia_config.administrativo.autoedicao_subordinadas")) || value.dependencia == 0 || autoedicao_subordinadas) ? true : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_unidade + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_unidade + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_unidade + '" name="configuracoesPro" value="' + value.id_unidade + '" ' + (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ? 'editCell' : '') + '" data-key="nome_unidade" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_unidade + '</span></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ? 'editCell' : '') + '" data-key="sigla_unidade">' + value.sigla_unidade + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ? 'editCell' : '') + '" data-key="cod_siorg">' + value.cod_siorg + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ? 'editCellSelect' : '') + '" data-array="unidades_all" data-keyref="id_unidade" data-key="dependencia" data-value="sigla_unidade" data-new-item="false" data-blank-item="true">' + (value.dependencia_sigla ? value.dependencia_sigla : '') + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_unidade + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) && checkAutoEdit ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_unidade + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_unidade + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) && checkAutoEdit ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_unidade + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 5;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'cadeia_valor') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Processo</th>' +
                '              <th class="tituloControle tituloFilter">Depend\u00EAncia</th>' +
                '              <th class="tituloControle tituloFilter">Selecion\u00E1vel</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_processo.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_processo.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_cadeia_valor + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_cadeia_valor + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_cadeia_valor + '" name="configuracoesPro" value="' + value.id_cadeia_valor + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_processo" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_processo + '</span></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="cadeia_valor" data-parent_id="' + value.id_cadeia_valor + '" data-keyref="id_cadeia_valor" data-key="dependencia" data-value="nome_processo" data-new-item="false" data-blank-item="true">' + (value.dependencia_nome ? value.dependencia_nome : '') + '</td>' +
                    '           <td align="left" data-key="selecionavel" style="text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);display: inline-block;">' +
                    '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_selecionavel" data-act="atividades-call" data-fn="changeSwitchConfigTable" id="changeItemConfig_' + type + '_' + value.id_cadeia_valor + '" tabindex="0" ' + (value.selecionavel && value.selecionavel == 1 ? 'checked' : '') + ' ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '>' +
                    '                  <label class="onoff-switch-label" for="changeItemConfig_' + type + '_' + value.id_cadeia_valor + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_cadeia_valor + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_cadeia_valor + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_cadeia_valor + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_cadeia_valor + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'objetivos') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Objetivo</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Mapa Estr\u00E9gico</th>' +
                '              <th class="tituloControle tituloFilter">Fundamenta\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 400px;">Depend\u00EAncia</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var classClone = (value.nome_objetivo.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_objetivo.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_objetivo + '" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : '')) + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_objetivo + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_objetivo + '" name="configuracoesPro" value="' + value.id_objetivo + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_objetivo" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : (classClosed ? classClosed.text : (classFuture ? classFuture.text : '')))) + '"><span>' + value.nome_objetivo + '</span></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="mapas" data-keyref="id_mapa" data-key="id_mapa" data-value="nome_mapa" data-new-item="false" data-blank-item="true">' + (value.nome_mapa ? value.nome_mapa : '') + '</td>' +
                    '           <td align="left" class="editCell" data-key="fundamentacao">' + (value.fundamentacao || '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="objetivos" data-keyref="id_objetivo" data-parent_id="' + value.id_objetivo + '" data-key="dependencia" data-value="nome_objetivo" data-new-item="false" data-blank-item="true">' + (value.dependencia_nome ? value.dependencia_nome : '') + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_objetivo + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_objetivo + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_objetivo + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_objetivo + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'mapas') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Mapa Estrat\u00E9gico</th>' +
                '              <th class="tituloControle tituloFilter">Miss\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter">Vis\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var classClone = (value.nome_mapa.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_mapa.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);
                var btnConformidade = checkMapaConformidade(value, type).btn;

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_mapa + '" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : '')) + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_mapa + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_mapa + '" name="configuracoesPro" value="' + value.id_mapa + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_mapa" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : (classClosed ? classClosed.text : (classFuture ? classFuture.text : '')))) + '"><span>' + value.nome_mapa + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="missao">' + (value.missao || '') + '</td>' +
                    '           <td align="left" class="editCell" data-key="visao">' + (value.visao || '') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_fim_vigencia" data-ref-limit="data_fim" data-label-limit="data_inicio" data-limit="min" data-time-sorter="' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' + btnConformidade +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_mapa + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_mapa + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_mapa + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_mapa + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 6;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'acoes') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da A\u00E7\u00E3o Estrat\u00E9gica</th>' +
                '              <th class="tituloControle tituloFilter">C\u00F3digo da A\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">Descri\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">Objetivo Estrat\u00E9gico</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">Cadeia de Valor</th>' +
                '              <th class="tituloControle tituloFilter">Unidade Vinculada</th>' +
                '              <th class="tituloControle tituloFilter">Unidade Executora</th>' +
                '              <th class="tituloControle tituloFilter">Meta (%)</th>' +
                '              <th class="tituloControle tituloFilter">Execu\u00E7\u00E3o (%)</th>' +
                '              <th class="tituloControle tituloFilter">Estrat\u00E9gico</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var classClone = (value.nome_acao.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_acao.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_acao + '" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : '')) + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_acao + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_acao + '" name="configuracoesPro" value="' + value.id_acao + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_acao" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : (classClosed ? classClosed.text : (classFuture ? classFuture.text : '')))) + '"><span>' + value.nome_acao + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="cod_acao">' + (value.cod_acao || '') + '</td>' +
                    '           <td align="left" class="editCell" data-key="descricao_acao">' + (value.descricao_acao || '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="objetivos" data-keyref="id_objetivo" data-key="id_objetivo" data-value="nome_objetivo" data-new-item="false" data-blank-item="true">' + (value.nome_objetivo ? value.nome_objetivo : '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="cadeia_valor" data-key="id_cadeia_valor" data-value="nome_processo" data-new-item="false" data-blank-item="true">' + (value.id_cadeia_valor ? value.nome_processo : '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="unidades_all" data-key="id_unidade" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="unidades_all" data-key="id_unidade_executora" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade_executora + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="meta">' + (value.meta || '') + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="execucao">' + (value.execucao || '') + '</td>' +
                    '           <td align="left" data-key="estrategico" style="text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);display: inline-block;">' +
                    '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_estrategico" data-act="atividades-call" data-fn="changeSwitchConfigTable" id="changeItemConfig_' + type + '_' + value.id_acao + '" tabindex="0" ' + (value.estrategico && value.estrategico == 1 ? 'checked' : '') + ' ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '>' +
                    '                  <label class="onoff-switch-label" for="changeItemConfig_' + type + '_' + value.id_acao + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    '           <td align="left" class="editCellDate" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_fim_vigencia" data-ref-limit="data_fim" data-label-limit="data_inicio" data-limit="min" data-time-sorter="' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_acao + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_acao + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_acao + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_acao + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 12;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'entregas') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da Entrega</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">A\u00E7\u00E3o Estrat\u00E9gica</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 250px;">Objetivos Estrat\u00E9gicos</th>' +
                '              <th class="tituloControle tituloFilter">Unidade Vinculada</th>' +
                '              <th class="tituloControle tituloFilter">Demandante</th>' +
                '              <th class="tituloControle tituloFilter">Destinat\u00E1rio</th>' +
                '              <th class="tituloControle tituloFilter">Tipo de Entrega</th>' +
                '              <th class="tituloControle tituloFilter">Meta (%)</th>' +
                '              <th class="tituloControle tituloFilter">Valor Inicial (%)</th>' +
                '              <th class="tituloControle tituloFilter">Progresso Esperado (%)</th>' +
                '              <th class="tituloControle tituloFilter">Progresso Realizado (%)</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de In\u00EDcio</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 150px;">Data de Encerramento</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClosed = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? { name: ' closed', text: 'ENCERRADO' } : false;
                var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
                var classClone = (value.nome_entrega.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_entrega.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_entrega + '" class="' + classDisabled + (classClosed ? ' ' + classClosed.name : (classFuture ? classFuture.name : '')) + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_entrega + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_entrega + '" name="configuracoesPro" value="' + value.id_entrega + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_entrega" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : (classClosed ? classClosed.text : (classFuture ? classFuture.text : '')))) + '"><span>' + value.nome_entrega + '</span></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="acoes" data-keyref="id_acao" data-key="id_acao" data-value="nome_acao_sigla" data-new-item="false" data-blank-item="true">' + (value.nome_acao_sigla ? value.nome_acao_sigla : '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="objetivos" data-keyref="id_objetivo" data-key="id_objetivo" data-value="nome_objetivo" data-new-item="false" data-blank-item="true">' + (value.nome_objetivo ? value.nome_objetivo : '') + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="unidades" data-key="id_unidade" data-value="sigla_unidade" data-new-item="false">' + value.sigla_unidade + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="unidades_all" data-keyref="id_unidade" data-key="id_unidade_demandante" data-value="sigla_unidade" data-new-item="true" data-blank-item="true">' + (value.sigla_unidade_demandante || value.nome_demandante) + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="unidades_all" data-keyref="id_unidade" data-key="id_unidade_destinatario" data-value="sigla_unidade" data-new-item="true" data-blank-item="true">' + (value.sigla_unidade_destinatario || value.nome_destinatario) + '</td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCellSelect' : '') + '" data-array="tipos_entregas" data-key="id_tipo_entrega" data-value="nome_tipo_entrega" data-new-item="false">' + value.nome_tipo_entrega + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="meta">' + (value.meta || '') + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="valor_inicial">' + (value.valor_inicial || '') + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="progresso_esperado">' + (value.progresso_esperado || '') + '</td>' +
                    '           <td align="left" class="editCellNum" data-min="0" data-max="100" data-key="progresso_realizado">' + (value.progresso_realizado || '') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_inicio_vigencia" data-ref-limit="data_inicio" data-label-limit="data_fim" data-limit="max" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '           <td align="left" class="editCellDate" data-key="data_fim_vigencia" data-ref-limit="data_fim" data-label-limit="data_inicio" data-limit="min" data-time-sorter="' + (value.data_fim_vigencia == '0000-00-00 00:00:00' ? '0000-00-00' : moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) + '">' + (value.data_fim_vigencia == '0000-00-00 00:00:00' ? '-' : moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_entrega + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entrega + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entrega + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entrega + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 12;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'tipos_prescricoes') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da ' + __.Prescricao + '</th>' +
                '              <th class="tituloControle tituloFilter">Prazo (Dias)</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_prescricao.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_prescricao.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var config = (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0)) ? value.config : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_tipo_prescricao + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_tipo_prescricao + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_tipo_prescricao + '" name="configuracoesPro" value="' + value.id_tipo_prescricao + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) ? 'editCell' : '') + '" data-key="nome_prescricao" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_prescricao + '</span></td>' +
                    '           <td align="left" class="editCellNum" data-key="prazo">' + value.prazo + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (config ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_tipo_prescricao + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        (callAtiv('checkCapacidade','config_update_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_prescricao + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_prescricao + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_prescricao + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 3;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'entidades') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da Entidade</th>' +
                '              <th class="tituloControle tituloFilter">Sigla da Entidade</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_entidade.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_entidade.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_entidade + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_entidade + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_entidade + '" name="configuracoesPro" value="' + value.id_entidade + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_entidade" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_entidade + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="sigla_entidade">' + value.sigla_entidade + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_entidade + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entidade + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entidade + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_entidade + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'nomenclaturas') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da Nomenclatura</th>' +
                '              <th class="tituloControle tituloFilter">Refer\u00EAncia</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Descri\u00E7\u00E3o</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_nomenclatura.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_nomenclatura.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_nomenclatura + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_nomenclatura + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_nomenclatura + '" name="configuracoesPro" value="' + value.id_nomenclatura + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_nomenclatura" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_nomenclatura + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="ref_nomenclatura">' + value.ref_nomenclatura + '</td>' +
                    '           <td align="left" class="editCell" data-key="descricao">' + value.descricao + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_nomenclatura + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_nomenclatura + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_nomenclatura + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_nomenclatura + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'perfis') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Tipo de Perfil</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">N\u00EDvel</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Descri\u00E7\u00E3o</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_perfil.indexOf('(C\u00F3pia)') !== -1 || value.nome_perfil.indexOf('Duplicado') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_perfil.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_perfil + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_perfil + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_perfil + '" name="configuracoesPro" value="' + value.id_perfil + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_perfil" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_perfil + '</span></td>' +
                    '           <td align="left" class="editCellNum" data-key="nivel">' + value.nivel + '</td>' +
                    '           <td align="left" class="editCell" data-key="descricao">' + (value.descricao || '') + '</td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_perfil + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_perfil + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_perfil + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_perfil + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'tipos_metadados') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome do Metadado</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Refer\u00EAncia do Metadado</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Tipo de Metadado</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Dado Sens\u00EDvel (LGPD)</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_metadado.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_metadado.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var nome_tipo_metadado = jmespath.search(listLabelsTiposMetadados, "[?value=='" + value.tipo_metadado + "'] | [0].label");
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_tipo_metadado + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_tipo_metadado + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_tipo_metadado + '" name="configuracoesPro" value="' + value.id_tipo_metadado + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_metadado" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_metadado + '</span></td>' +
                    '           <td align="left" class="editCell" data-key="ref_metadado">' + (value.ref_metadado || '') + '</td>' +
                    '           <td align="left" class="editCellSelect" data-array="' + type + '" data-key="tipo_metadado" data-value="tipo_metadado" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '" data-new-item="false" data-blank-item="false" data-key="tipo_metadado">' + (nome_tipo_metadado || '') + '</td>' +
                    '           <td align="left" data-key="lgpd" style="text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);display: inline-block;">' +
                    '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_lgpd" data-act="atividades-call" data-fn="changeSwitchConfigTable" id="changeItemConfig_' + type + '_' + value.id_tipo_metadado + '" tabindex="0" ' + (value.lgpd && value.lgpd == 1 ? 'checked' : '') + ' ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '>' +
                    '                  <label class="onoff-switch-label" for="changeItemConfig_' + type + '_' + value.id_tipo_metadado + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_tipo_metadado + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_metadado + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_metadado + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_metadado + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 5;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (type == 'tipos_avaliacoes') {
        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Nome da avalia\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 50px;">Nota atribu\u00EDda</th>' +
                '              <th class="tituloControle tituloFilter">Pergunta</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Tipo de avalia\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Tipo de execu\u00E7\u00E3o</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Aceita entrega?</th>' +
                '              <th class="tituloControle tituloFilter" style="width: 160px;">Exige justificativa?</th>' +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="min-width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value.nome_avaliacao.indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value.nome_avaliacao.indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                var label_id = getLabIdTables(type);

                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + label_id + '" data-id="' + value.id_tipo_avaliacao + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value.id_tipo_avaliacao + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value.id_tipo_avaliacao + '" name="configuracoesPro" value="' + value.id_tipo_avaliacao + '" ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '></td>' +
                    '           <td align="left" class="editCell" data-key="nome_avaliacao" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value.nome_avaliacao + '</span></td>' +
                    '           <td align="center" class="editCellNumInt" data-key="nota_atribuida">' + value.nota_atribuida + '</td>' +
                    '           <td align="left" class="editCell" data-key="pergunta">' + value.pergunta + '</td>' +
                    '           <td align="left" class="editCellSelect" data-array="' + type + '" data-key="tipo_avaliacao" data-value="tipo_avaliacao" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '" data-new-item="false" data-blank-item="false" data-key="tipo_avaliacao">' + (value.nome_tipo_avaliacao || '') + '</td>' +
                    '           <td align="left" class="editCellSelect" data-array="' + type + '" data-key="tipo_execucao" data-value="tipo_execucao" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '" data-new-item="false" data-blank-item="false" data-key="tipo_execucao">' + (value.nome_tipo_execucao || '') + '</td>' +
                    '           <td align="left" data-key="aceita_entrega" style="text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);display: inline-block;">' +
                    '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_aceita_entrega" data-act="atividades-call" data-fn="changeSwitchConfigTable" id="changeItemConfig_' + type + '_aceita_entrega_' + value.id_tipo_avaliacao + '" tabindex="0" ' + (value.aceita_entrega && value.aceita_entrega == 1 ? 'checked' : '') + ' ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '>' +
                    '                  <label class="onoff-switch-label" for="changeItemConfig_' + type + '_aceita_entrega_' + value.id_tipo_avaliacao + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    '           <td align="left" data-key="exige_justificativa" style="text-align: center;">' +
                    '              <div class="onoffswitch" style="transform: scale(0.8);display: inline-block;">' +
                    '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox switch_exige_justificativa" data-act="atividades-call" data-fn="changeSwitchConfigTable" id="changeItemConfig_' + type + '_exige_justificativa_' + value.id_tipo_avaliacao + '" tabindex="0" ' + (value.exige_justificativa && value.exige_justificativa == 1 ? 'checked' : '') + ' ' + (callAtiv('checkCapacidade','config_update_' + type) ? '' : 'disabled') + '>' +
                    '                  <label class="onoff-switch-label" for="changeItemConfig_' + type + '_exige_justificativa_' + value.id_tipo_avaliacao + '"></label>' +
                    '              </div>' +
                    '           </td>' +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value.id_tipo_avaliacao + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_avaliacao + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_avaliacao + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value.id_tipo_avaliacao + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    } else if (
        type == 'tipos_eixos' ||
        type == 'tipos_entregas' ||
        type == 'tipos_documentos' ||
        type == 'tipos_justificativas' ||
        type == 'tipos_modalidades' ||
        type == 'tipos_motivos' ||
        type == 'tipos_capacidades' ||
        type == 'perfis' ||
        type == 'tipos_requisicoes'
    ) {
        param = (type == 'tipos_eixos') ? { name_head: 'Tipo de Eixo Tem\u00E1tico', label_id: 'id_tipo_eixo', label_name: 'nome_eixo', icon: 'fas fa-exchange-alt', index: 6, edit_table: true, col_descricao: false } : null;
        param = (type == 'tipos_entregas') ? { name_head: 'Tipo de Entrega', label_id: 'id_tipo_entrega', label_name: 'nome_tipo_entrega', icon: 'fas fa-hand-holding-medical', index: 7, edit_table: true, col_descricao: false } : null;
        param = (type == 'tipos_documentos') ? { name_head: 'Tipo de Documento', label_id: 'id_tipo_documento', label_name: 'nome_documento', icon: 'fas fa-file-alt', index: 8, edit_table: true, col_descricao: false } : param;
        param = (type == 'tipos_requisicoes') ? { name_head: 'Tipo de Requisi\u00E7\u00E3o', label_id: 'id_tipo_requisicao', label_name: 'nome_requisicao', icon: 'fas fa-inbox', index: 9, edit_table: true, col_descricao: false } : param;
        param = (type == 'tipos_justificativas') ? { name_head: 'Tipo de Justificativa de Avalia\u00E7\u00E3o', label_id: 'id_tipo_justificativa', label_name: 'nome_justificativa', icon: 'fas fa-star', index: 10, edit_table: true, col_descricao: false } : param;
        param = (type == 'tipos_modalidades') ? { name_head: 'Tipo de Modalidade de Trabalho', label_id: 'id_tipo_modalidade', label_name: 'nome_modalidade', icon: 'fas fa-wrench', index: 11, edit_table: true, col_descricao: false } : param;
        param = (type == 'tipos_motivos') ? { name_head: 'Tipo de Motivos de Afastamento', label_id: 'id_tipo_motivo', label_name: 'nome_motivo', icon: 'fas fa-luggage-cart', index: 12, edit_table: true, col_descricao: false } : param;
        param = (type == 'tipos_capacidades') ? { name_head: 'Tipo de Capacidade', label_id: 'id_tipo_capacidade', label_name: 'nome_capacidade', icon: 'fas fa-users-cog', index: 13, edit_table: true, col_descricao: true } : param;
        param = (type == 'perfis') ? { name_head: 'Tipo de Perfil', label_id: 'id_perfil', label_name: 'nome_perfil', icon: 'fas fa-shield-alt', index: 14, edit_table: true, col_descricao: true } : param;

        if (mode == 'header') {
            _return = (!isInitOffset) ? '' :
                '          <tr class="tableHeader">' +
                '              <th class="tituloControle" data-sorter="false" style="width: 50px;" align="center"><label class="lblInfraCheck_label" for="lnkInfraCheck_configuracoes_' + type + '" accesskey=";"></label><a class="lnkInfraCheck" id="lnkInfraCheck_configuracoes_' + type + '" data-act="atividades-call" data-fn="setSelectAllTr" data-hover-fn="updateTipSelectAll" data-hover-arg="" data-tip="Selecionar Tudo"><img src="/infra_css/' + (SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif') + '" id="imgRecebidosCheck_' + type + '"></a></th>' +
                '              <th class="tituloControle tituloFilter" style="min-width: 250px;">' + param.name_head + '</th>' +
                (param.col_descricao ?
                    '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Descri\u00E7\u00E3o</th>' +
                    '' : '') +
                (type == 'tipos_capacidades' ?
                    '              <th class="tituloControle tituloFilter" style="min-width: 250px;">Vincula\u00E7\u00E3o</th>' +
                    '' : '') +
                (callAtiv('checkCapacidade','config_update_' + type) ?
                    '              <th class="tituloControle" data-sorter="false" style="width: 100px;">Op\u00E7\u00F5es</th>' +
                    '              <th class="tituloControle" data-sorter="false" style="width: 120px;">A\u00E7\u00F5es</th>' +
                    '' : '') +
                '          </tr>';
        } else if (mode == 'body') {
            if (value) {
                var classDisabled = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? ' disabled' : '';
                var classClone = (value[param.label_name].indexOf('(C\u00F3pia)') !== -1) ? { name: ' clone', text: 'C\u00D3PIA' } : false;
                var classNew = (value[param.label_name].indexOf('(Novo)') !== -1) ? { name: ' new', text: 'NOVO' } : false;
                _return = '       <tr data-tagname="SemGrupo" data-type="' + type + '" data-rowindex="' + value[param.label_id] + '" data-id="' + value[param.label_id] + '" class="' + classDisabled + (classClone ? ' ' + classClone.name : '') + (classNew ? ' ' + classNew.name : '') + '">' +
                    '           <td align="center" data-id="' + value[param.label_id] + '">' +
                    '               <input type="checkbox" class="checkboxSelectConfiguracoes" data-act="atividades-call" data-fn="followSelecionarItens" id="configuracoesPro_' + value[param.label_id] + '" value="' + value[param.label_id] + '" name="configuracoesPro" ' + (callAtiv('checkCapacidade','config_update_' + type) && param.edit_table ? '' : 'disabled') + '></td>' +
                    (type == 'tipos_documentos' || type == 'tipos_requisicoes' ?
                        '           <td align="left" class="editCellSelect" data-array="' + type + '" data-key="' + param.label_name + '" data-value="' + param.label_name + '" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '" data-new-item="false" data-blank-item="true">' + (value[param.label_name] ? value[param.label_name] : '') + '</td>' +
                        '' :
                        '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && param.edit_table ? 'editCell' : '') + '" data-key="' + param.label_name + '" data-text="' + (classNew ? classNew.text : (classClone ? classClone.text : '')) + '"><span>' + value[param.label_name] + '</span></td>' +
                        (param.col_descricao ?
                            '           <td align="left" class="' + (callAtiv('checkCapacidade','config_update_' + type) && param.edit_table ? 'editCell' : '') + '" data-key="descricao"><span>' + (value.descricao !== null ? value.descricao : '') + '</span></td>' +
                            '' : '') +
                        (type == 'tipos_capacidades' ?
                            '           <td align="left" data-key="lista_perfis"><span>' + (value.lista_perfis !== null ? value.lista_perfis : '') + '</span></td>' +
                            '' : '') +
                        '') +
                    (callAtiv('checkCapacidade','config_update_' + type) ?
                        '           <td align="left">' +
                        '               <a class="newLink followLinkTr ' + (value.config && value.config !== null && (Object.keys(value.config).length > 0 || value.config.length > 0) ? 'newLink_selected' : '') + '" style="font-size: 10pt;" data-act="atividades-call" data-fn="editConfigOptions" data-id="' + value[param.label_id] + '"><i class="fas fa-plus-circle" style="font-size: 100%;"></i>Op\u00E7\u00F5es</a>' +
                        '           </td>' +
                        '           <td align="right" data-key="action">' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value[param.label_id] + '" data-mode="disable" data-act="atividades-call" data-fn="disableConfig_" data-tip="Desativar"><i class="fas fa-times-circle" style="font-size: 100%;"></i></a>' +
                        '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value[param.label_id] + '" data-mode="reactive" data-act="atividades-call" data-fn="reactiveConfig" data-tip="Reativar"><i class="fas fa-undo-alt" style="font-size: 100%;"></i></a>' +
                        (callAtiv('checkCapacidade','config_new_' + type) && param.edit_table ?
                            '               <a class="newLink followLinkTr" data-type="' + type + '" data-id="' + value[param.label_id] + '" data-mode="clone" data-act="atividades-call" data-fn="cloneConfig" data-tip="Duplicar"><i class="fas fa-copy" style="font-size: 100%;"></i></a>' +
                            '' : '') +
                        '           </td>' +
                        '' : '') +
                    '       </tr>';
            } else {
                var colspan = 4;
                colspan = (callAtiv('checkCapacidade','config_update_' + type)) ? colspan + 1 : colspan;
                colspan = (checkOutrasUnidades) ? colspan + 1 : colspan;
                _return = '       <tr class="noData">' +
                    '           <td align="center" colspan="' + colspan + '">' +
                    '               <div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                    '                   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                    '                   ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                    '                   </div>' +
                    '               </div>' +
                    '           </td>' +
                    '       </tr>';
            }
        }
    }
    return _return;
}
export function cancelHomologacaoPlano(this_) {
    var _this = $(this_);
    var data = _this.closest('tr').data();
    confirmaFraseBoxPro('O plano de trabalho j\u00E1 foi homologado. Tem certeza que deseja <b style="font-weight: bold;">CANCELAR</b>?', 'CANCELAR', function () {
        getCancelHomologacaoPlano(this_, data.id);
    });
}
export function getCancelHomologacaoPlano(this_, id_plano) {
    var _this = $(this_);
    if (id_plano > 0) {
        var action = 'config_update_cancela_homologa_plano';
        var param = {
            action: action,
            type: 'planos',
            mode: 'update',
            id: id_plano
        };
        getServerAtividades(param, action);
        _this.find('.iconPlanoHomologa').attr('class', 'fas fa-spinner fa-spin azulColor');
        infraTooltipOcultar();
    }
}
export function checkValidadeEntregasPrograma(value) {
    return value.quantidade_entregas == 0 || typeof value.entregas === 'undefined' || value.entregas === null || !value.entregas.length ? false : true;
}
export function checkHomologadoEntregasPrograma(value) {
    return !value.homologado || !checkValidadeEntregasPrograma(value) ? false : true;
}
export function checkProgramaConformidade(value, type) {
    var limiteMesesPrograma = callAtiv('checkOptionEntidade','limite_meses_programas') ? callAtiv('getOptionEntidade','limite_meses_programas') : 6;
    var limitarAnoCivil = callAtiv('checkOptionEntidade','limitar_ano_civil') ? callAtiv('getOptionEntidade','limitar_ano_civil') : false;
    var nrMesesPrograma = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'), 'months');
    nrMesesPrograma = typeof nrMesesPrograma !== 'undefined' && nrMesesPrograma !== null ? nrMesesPrograma + 1 : 0;
    var checkLimiteAnoCivil = (limitarAnoCivil && moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').endOf('year')) ? false : true;
    var returnConformidade = (checkLimiteAnoCivil && nrMesesPrograma <= limiteMesesPrograma && !value.homologado && callAtiv('checkHomologacaoPreviaProgramas',value))
        ? {
            check: true,
            alert: 'Em conformidade (Dispon\u00EDvel para homologa\u00E7\u00E3o)',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Em conformidade (Dispon\u00EDvel para homologa\u00E7\u00E3o)"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i></a>'
        }
        : '';
    returnConformidade = (checkLimiteAnoCivil && nrMesesPrograma <= limiteMesesPrograma && !callAtiv('checkHomologacaoPreviaProgramas',value))
        ? {
            check: true,
            alert: 'Em conformidade',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Em conformidade"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = checkLimiteAnoCivil && nrMesesPrograma <= limiteMesesPrograma && value.homologado && callAtiv('checkHomologacaoPreviaProgramas',value)
        ? {
            check: true,
            alert: 'Homologado',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Homologado"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = returnConformidade.check && value.id_avaliacao && callAtiv('checkOptionEntidade','exigir_avaliacao_previa_programas')
        ? {
            check: true,
            alert: 'Avaliado. ',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" data-type="programas" data-id="' + value.id_programa + '" data-mode="rate" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Avaliado"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i><i class="fas fa-star azulColor" style="font-size: 100%;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = callAtiv('checkHomologacaoPreviaProgramas',value) && !checkValidadeEntregasPrograma(value)
        ? {
            check: false,
            alert: '\u00C9 necess\u00E1rio vincular ao menos uma entrega ao ' + __.programa + '.',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="\u00C9 necess\u00E1rio vincular ao menos uma entrega ao ' + __.programa + '"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = (nrMesesPrograma > limiteMesesPrograma)
        ? {
            check: false,
            alert: 'A dura\u00E7\u00E3o d' + __.o_programa + ' supera o limite m\u00E1ximo de meses permitido (' + limiteMesesPrograma + ')',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="A dura\u00E7\u00E3o d' + __.o_programa + ' supera o limite m\u00E1ximo de meses permitido (' + limiteMesesPrograma + ')"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = (!checkLimiteAnoCivil)
        ? {
            check: false,
            alert: 'Final da vig\u00EAncia d' + __.o_programa + ' superior ao fim do ano civil (31/12)',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Final da vig\u00EAncia d' + __.o_programa + ' superior ao fim do ano civil (31/12)"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnConformidade;
    returnConformidade = (value.data_fim == '0000-00-00 00:00:00' && value.programa_concomitante)
        ? {
            check: false,
            alert: 'Existe programa concomitante (' + moment(value.programa_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.programa_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.programa_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Desative um dos programas e tente novamente.',
            btn: '<a class="newLink" data-act="atividades-call" data-fn="editConfigOptions" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Existe programa concomitante (' + moment(value.programa_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.programa_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.programa_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Encerre ou desative um dos programas e tente novamente."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnConformidade;
    return returnConformidade;
}
export function checkTermoAntesAssinatura(value, type) {
    var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
    var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
    var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
    var assinatura = (typeof value.config_documento !== 'undefined' && value.config_documento !== null && typeof value.config_documento.assinatura !== 'undefined' && value.config_documento.hasOwnProperty('assinatura')) ? value.config_documento.assinatura : false;
    var view_modelos = ((assinatura || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 2) && modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;
    var id_reference = typeof value.id_reference !== 'undefined' ? value.id_reference : value.id_termo;

    var returnAssinatura = (view_modelos && value.vigencia)
        ? {
            check: true,
            alert: (assinatura ? 'Termo de Ades\u00E3o assinado eletronicamente por ' + assinatura[0].nome_completo + ', em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : 'Visualizar Termo de Ades\u00E3o para assinatura'),
            btn: '<a class="newLink viewModelDoc" data-type="' + type + '" data-sign="true" data-user="' + value.id_user + '" data-id_reference="' + id_reference + '" data-icon="pencil-alt" data-action="view" data-mode="modelo_termo_adesao" data-title="Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="' + (assinatura ? 'Termo de Ades\u00E3o assinado eletronicamente por ' + assinatura[0].nome_completo + ', em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : 'Visualizar Termo de Ades\u00E3o para assinatura') + '"><i class="fas fa-signature ' + (assinatura ? 'azulColor' : 'cinzaColor') + '" style="font-size: 100%;"></i> <i class="fas fa-' + (assinatura ? 'user-edit azulColor' : 'pencil-alt cinzaColor') + '" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : '';
    returnAssinatura = (classFuture && !assinatura)
        ? {
            check: false,
            alert: 'Dispon\u00EDvel para assinatura ap\u00F3s iniciada a vig\u00EAncia do termo',
            btn: '<a class="newLink viewModelDoc" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Dispon\u00EDvel para assinatura ap\u00F3s iniciada a vig\u00EAncia do plano"><i class="fas fa-signature cinzaColor" style="font-size: 100%;"></i> <i class="fas fa-pencil-alt cinzaColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (value.vigencia && value.termo_concomitante)
        ? {
            check: false,
            alert: 'Existe termo concomitante para esse usu\u00E1rio na unidade ' + value.termo_concomitante.sigla_unidade + ' (' + moment(value.termo_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.termo_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.termo_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Desative um dos planos e tente novamente.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Existe termo concomitante para esse usu\u00E1rio na unidade ' + value.termo_concomitante.sigla_unidade + ' (' + moment(value.termo_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.termo_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.termo_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Encerre ou desative um dos termos e tente novamente."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    return returnAssinatura;
}
export function checkMapaConformidade(value, type) {
    var returnConformidade = value.mapa_concomitante
        ? {
            check: false,
            alert: 'Existe mapa estrat\u00E9gico concomitante para essa entidade (' + moment(value.mapa_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.mapa_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.mapa_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Desative um dos mapas e tente novamente.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Existe termo concomitante para essa entidade (' + moment(value.mapa_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + (value.mapa_concomitante.data_fim_vigencia == '0000-00-00 00:00:00' ? 'atual' : moment(value.mapa_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')) + '). Encerre ou desative um dos mapas e tente novamente."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : {
            check: false,
            alert: '',
            btn: ''
        };
    return returnConformidade;
}
export function verifyStatusRecurso(value) {
    var indicesAvaliacoesPlano = value.avaliacao_plano ? jmespath.search(value.avaliacao_plano, "[*].indice_mes_entrega") : false;
    var verifyRecurso = false;
    var checkRecurso = false;
    var statusRecurso = false;
    var indiceRecurso = false;
    if (indicesAvaliacoesPlano) {
        for (var i in indicesAvaliacoesPlano) {
            var indice = indicesAvaliacoesPlano[i];
            let iStatusRecurso = checkStatusRecurso(value, indice);
            if (iStatusRecurso.check && iStatusRecurso.list) {
                verifyRecurso = iStatusRecurso;
                checkRecurso = iStatusRecurso.check;
                statusRecurso = iStatusRecurso.status;
                indiceRecurso = indice;
            }
        }
    }
    return { verify: verifyRecurso, check: checkRecurso, status: statusRecurso, indice: indiceRecurso };
}
export function checkStatusRecurso(value, indice = false) {
    let checkRecurso = callAtiv('checkOptionEntidade','recurso_avaliacao_planos') && value.recurso_avaliacao && value.recurso_avaliacao.length ? true : false;
    let listRecurso = checkRecurso && indice ? jmespath.search(value.recurso_avaliacao, "[?indice_mes_entrega==`" + indice + "`]") : false;
    listRecurso = listRecurso === null ? false : listRecurso;
    listRecurso = listRecurso && listRecurso.length ? listRecurso : false;
    let statusRecurso = false;
    if (checkRecurso && listRecurso) {
        let data_fim_recurso = jmespath.search(listRecurso, "[*].data_fim_vigencia | [0]");
        statusRecurso = jmespath.search(listRecurso, "[?aceito==`false`] | [?data_justificativa=='0000-00-00 00:00:00'] | [?data_analise=='0000-00-00 00:00:00'] | length(@) ") > 0 && moment(data_fim_recurso) >= moment() ? { status: 1, text: 'Em fase de recurso at\u00E9 ' + moment(data_fim_recurso, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm'), color: 'laranjaColor' } : { status: 0, text: '', color: '' };
        statusRecurso = jmespath.search(listRecurso, "[?aceito==`false`] | [?data_justificativa!='0000-00-00 00:00:00'] | [?data_analise=='0000-00-00 00:00:00'] | length(@)") > 0 ? { status: 2, text: 'Recurso apresentado', color: 'cianoColor' } : statusRecurso;
        statusRecurso = jmespath.search(listRecurso, "[?aceito==`true`] | [?data_justificativa!='0000-00-00 00:00:00'] | [?data_analise!='0000-00-00 00:00:00'] | length(@)") > 0 ? { status: 3, text: 'Recurso acatado', color: 'verdeColor' } : statusRecurso;
        statusRecurso = jmespath.search(listRecurso, "[?aceito==`false`] | [?data_justificativa!='0000-00-00 00:00:00'] | [?data_analise!='0000-00-00 00:00:00'] | length(@)") > 0 ? { status: 4, text: 'Recurso n\u00E3o acatado', color: 'vermelhoColor' } : statusRecurso;
        statusRecurso = jmespath.search(listRecurso, "[?aceito==`false`] | [?data_justificativa=='0000-00-00 00:00:00'] | [?data_analise=='0000-00-00 00:00:00'] | length(@)") > 0 && moment(data_fim_recurso) < moment() ? { status: 5, text: 'Recurso n\u00E3o apresentado at\u00E9 ' + moment(data_fim_recurso, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm'), color: 'vermelhoColor' } : statusRecurso;
    }
    return { check: checkRecurso, status: statusRecurso, list: listRecurso };
}
/* getNumMonthsBetween2Dates → domain.js (re-exported above) */
export function checkPlanoAntesAssinatura(value, type) {
    var classFuture = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? { name: ' future', text: 'FUTURO' } : false;
    var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
    var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
    var assinatura = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.assinatura !== 'undefined' && value.config.hasOwnProperty('assinatura')) ? value.config.assinatura : false;
    // var view_modelos = ((assinatura || !getOptionEntidade('tipo_vinculacao_termo') || getOptionEntidade('tipo_vinculacao_termo') == 1) && modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;        
    var view_modelos = modalidade_config && modalidade_config.hasOwnProperty('modelos') ? modalidade_config.modelos : false;
    var exige_entregas_programa = (callAtiv('checkHomologacaoPreviaPlanos',value) && modalidade_config && modalidade_config.hasOwnProperty('exige_entregas_programa')) ? modalidade_config.exige_entregas_programa : false;
    var exige_autorizacao = (modalidade_config && modalidade_config.hasOwnProperty('exige_autorizacao')) ? modalidade_config.exige_autorizacao : false;
    var carga_horaria_padrao = (modalidade_config && modalidade_config.hasOwnProperty('carga_horaria_padrao')) ? modalidade_config.carga_horaria_padrao : false;
    var exclui_unidades = (modalidade_config && modalidade_config.hasOwnProperty('exclui_unidades')) ? modalidade_config.exclui_unidades : false;
    var checkExcluiUnidades = (exclui_unidades) ? jmespath.search(exclui_unidades, "[?id_unidade==`" + value.id_unidade + "`]") : false;
    checkExcluiUnidades = (exclui_unidades && checkExcluiUnidades !== null && checkExcluiUnidades.length > 0) ? true : false;

    var documento_autorizacao = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.documentos !== 'undefined' && value.config.hasOwnProperty('documentos') && value.config.documentos.length) ? value.config.documentos : false;
    documento_autorizacao = (documento_autorizacao) ? jmespath.search(documento_autorizacao, "[?nr_sei!=''] | [?id_procedimento!=`0`]") : false;
    documento_autorizacao = (documento_autorizacao && documento_autorizacao !== null && documento_autorizacao.length > 0) ? true : false;
    var checkLimitePlano = callAtiv('calcLimitePlanosModalidade',value);
    var textExcedeLimite = hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite ? 'O plano de trabalho excede o limite de vagas da modalidade (' + checkLimitePlano.limite_modalidade + '% dos ' + checkLimitePlano.vagas_programa + ' participantes v\u00E1lidos = ' + checkLimitePlano.limite_vagas + ' vagas). Reduza ao menos ' + (checkLimitePlano.planos_vigentes - checkLimitePlano.limite_vagas) + ' vagas' : '';
    var alertaExcedeLimite = hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite ? 'data-tip="' + textExcedeLimite + '"' : '';
    // var entidade = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`"+value.id_entidade+"`] | [0]");
    var limiteMesesPlanos = callAtiv('checkOptionEntidade','limite_meses_planos') ? callAtiv('getOptionEntidade','limite_meses_planos') : 6;
    var nrMesesPlano = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').diff(moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss'), 'months');
    nrMesesPlano = typeof nrMesesPlano !== 'undefined' && nrMesesPlano !== null ? nrMesesPlano + 1 : 0;
    var limitarAnoCivil = callAtiv('checkOptionEntidade','limitar_ano_civil') ? callAtiv('getOptionEntidade','limitar_ano_civil') : false;
    var checkLimiteAnoCivil = (limitarAnoCivil && moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').endOf('year')) ? false : true;
    var type_documento = !callAtiv('getOptionEntidade','tipo_vinculacao_termo') || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 1 ? 'planos' : 'termos';
    var numMonthsPlano = getNumMonthsBetween2Dates(value);
    var value_entregas = typeof value.entregas !== 'undefined' && value.entregas.length ? jmespath.search(value.entregas, "[?indice_mes_entrega<=`" + numMonthsPlano + "`]") : null;
    var distCargaHoraria = value_entregas != null && value_entregas.length ? value_entregas.map(function (v) { return v.carga_horaria_entrega }).reduce(function (a, b) { return a + b; }, 0) : 0;
    var mediaDistCargaHoraria = distCargaHoraria / numMonthsPlano;
    var verifyRecurso = verifyStatusRecurso(value);
    var checkRecurso = verifyRecurso.check;
    var statusRecurso = verifyRecurso.status;
    var dataAvaliacao = jmespath.search(value.avaliacao_plano, "[*].data_avaliacao");
    var prazoAvaliacaoPlano = callAtiv('checkOptionEntidade','prazo_avaliacao_plano') ? callAtiv('getOptionEntidade','prazo_avaliacao_plano') : 30;
    var entrega_fim_vigencia = jmespath.search(value_entregas, "[*].execucao.entrega_fim_vigencia | [0]");
    var ckeckPrazoAvaliacaoPlano = dataAvaliacao !== null && moment(entrega_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').add(prazoAvaliacaoPlano, 'days') < moment(dataAvaliacao, 'YYYY-MM-DD HH:mm:ss') ? false : true;
    var iconPrazoAvaliacaoPlano = !ckeckPrazoAvaliacaoPlano ? 'laranjaColor' : 'azulColor';
    var statusPrazoAvaliacaoPlano = !ckeckPrazoAvaliacaoPlano ? 'em atraso' : 'no prazo';
    // console.log(value.id_plano, statusPrazoAvaliacaoPlano, iconPrazoAvaliacaoPlano, prazoAvaliacaoPlano, 'Prazo-> '+ moment(entrega_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').add(prazoAvaliacaoPlano, 'days').format('DD/MM/YYYY [\u00E0s] HH:mm'), 'Avaliacao-> '+ moment(dataAvaliacao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm'))


    var txtDataAvaliacao = dataAvaliacao !== null ? statusPrazoAvaliacaoPlano + ' em ' + moment(dataAvaliacao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : '';

    var ref_assinatura = typeof value.ref_assinatura !== 'undefined' ? value.ref_assinatura : 'planos';
    var id_reference = typeof value.id_reference !== 'undefined' ? value.id_reference : value.id_plano;

    var conformidadePlano = exige_entregas_programa && callAtiv('checkHomologacaoPreviaProgramas',value) && mediaDistCargaHoraria == 100 && value.entregas_programa
        ? {
            check: true,
            alert: 'Em conformidade ' + (callAtiv('checkHomologacaoPreviaPlanos',value) ? '(Dispon\u00EDvel para homologa\u00E7\u00E3o)' : '') + '. ',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Em conformidade ' + (callAtiv('checkHomologacaoPreviaPlanos',value) ? '(Dispon\u00EDvel para homologa\u00E7\u00E3o)' : '') + '"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i></a> '
        }
        : { alert: '', btn: '', check: false };
    conformidadePlano = conformidadePlano.check && value.homologado && callAtiv('checkHomologacaoPreviaPlanos',value)
        ? {
            check: true,
            alert: 'Homologado. ',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Homologado"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i></a>'
        }
        : conformidadePlano;
    conformidadePlano = conformidadePlano.check && value.avaliacao_plano && callAtiv('checkOptionEntidade','recurso_avaliacao_planos')
        ? {
            check: true,
            alert: 'Avaliado ' + txtDataAvaliacao,
            btn: '<a class="newLink" data-type="planos" data-id="' + value.id_plano + '" data-mode="rate" data-act="atividades-call" data-fn="getChartProdutividadeMes" data-pass-el="0" data-id="' + value.id_plano + '" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Avaliado ' + txtDataAvaliacao + ' [clique para visualizar]"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i><i class="fas fa-star ' + iconPrazoAvaliacaoPlano + '" style="font-size: 100%;"></i></a>'
        }
        : conformidadePlano;
    conformidadePlano = conformidadePlano.check && checkRecurso
        ? {
            check: true,
            alert: 'Avaliado ' + txtDataAvaliacao + ' (' + statusRecurso.text + '). ',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-type="entregas" data-mode="rate" data-id="' + value.id_plano + '" data-indice="' + verifyRecurso.indice + '" data-act="atividades-call" data-fn="ratePlano" data-tip="Avaliado ' + txtDataAvaliacao + ' (' + statusRecurso.text + ')"><i class="fas fa-check-double azulColor" style="font-size: 100%;"></i><i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i><i class="fas fa-star azulColor" style="font-size: 100%;"></i><i class="fas fa-gavel ' + statusRecurso.color + '" style="font-size: 100%;margin:0;"></i></a>'
        }
        : conformidadePlano;

    var returnAssinatura = (view_modelos && value.vigencia)
        ? {
            check: true,
            alert: conformidadePlano.alert + (assinatura ? 'Termo de Ades\u00E3o assinado eletronicamente por ' + assinatura[0].nome_completo + ', em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : 'Visualizar Termo de Ades\u00E3o para assinatura'),
            btn: conformidadePlano.btn + '<a class="newLink viewModelDoc" data-type="' + ref_assinatura + '" data-sign="true" data-user="' + value.id_user + '" data-id_reference="' + id_reference + '" data-icon="pencil-alt" data-action="view" data-mode="modelo_termo_adesao" data-title="Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="' + (assinatura ? 'Termo de Ades\u00E3o assinado eletronicamente por ' + assinatura[0].nome_completo + ', em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') + ' [clique para visualizar]' : 'Visualizar Termo de Ades\u00E3o para assinatura') + '"><i class="fas fa-signature ' + (assinatura ? 'azulColor' : 'cinzaColor') + '" style="font-size: 100%;"></i> <i class="fas fa-' + (assinatura ? 'user-edit azulColor' : 'pencil-alt cinzaColor') + '" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : conformidadePlano;
    returnAssinatura = exige_entregas_programa && callAtiv('checkHomologacaoPreviaProgramas',value) && mediaDistCargaHoraria != 100
        ? {
            check: false,
            alert: 'A distribui\u00E7\u00E3o de carga hor\u00E1ria das entregas do plano deve ser igual a 100%. Clique em Op\u00E7\u00F5es do plano para adequar a distribui\u00E7\u00E3o.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="A distribui\u00E7\u00E3o de carga hor\u00E1ria das entregas do plano deve ser igual a 100%. Clique em Op\u00E7\u00F5es do plano para adequar a distribui\u00E7\u00E3o."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = exige_entregas_programa && callAtiv('checkHomologacaoPreviaProgramas',value) && !value.entregas_programa
        ? {
            check: false,
            alert: 'Nenhum plano de entregas homologado na unidade. Solicite adequa\u00E7\u00E3o ao gestor da unidade.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Nenhum plano de entregas homologado na unidade. Solicite adequa\u00E7\u00E3o ao gestor da unidade."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = exige_entregas_programa && callAtiv('checkHomologacaoPreviaProgramas',value) && value.quantidade_entregas == 0
        ? {
            check: false,
            alert: '\u00C9 necess\u00E1rio vincular ao menos uma entrega ao plano de trabalho.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="\u00C9 necess\u00E1rio vincular ao menos uma entrega ao plano de trabalho"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (conformidadePlano.check && view_modelos && value.vigencia && type_documento == 'termos' && !value.homologado && value.entregas_programa)
        ? {
            check: true,
            alert: conformidadePlano.alert + 'Termo dispon\u00EDvel para vincula\u00E7\u00E3o ap\u00F3s a homologa\u00E7\u00E3o do plano',
            btn: conformidadePlano.btn + '<a class="newLink viewModelDoc" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Termo dispon\u00EDvel para vincula\u00E7\u00E3o ap\u00F3s a homologa\u00E7\u00E3o do plano"><i class="fas fa-signature cinzaColor" style="font-size: 100%;"></i> <i class="fas fa-clock cinzaColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (classFuture && !assinatura)
        ? {
            check: false,
            alert: 'Dispon\u00EDvel para assinatura ap\u00F3s iniciada a vig\u00EAncia do plano',
            btn: conformidadePlano.btn + '<a class="newLink viewModelDoc" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Dispon\u00EDvel para assinatura ap\u00F3s iniciada a vig\u00EAncia do plano"><i class="fas fa-signature cinzaColor" style="font-size: 100%;"></i> <i class="fas fa-pencil-alt cinzaColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (checkExcluiUnidades && !assinatura)
        ? {
            check: false,
            alert: 'Tipo de modalidade n\u00E3o dispon\u00EDvel para essa unidade',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Tipo de modalidade n\u00E3o dispon\u00EDvel para essa unidade"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (!checkLimiteAnoCivil && !assinatura)
        ? {
            check: false,
            alert: 'Final da vig\u00EAncia do plano de trabalho superior ao fim do ano civil (31/12)',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Final da vig\u00EAncia do plano de trabalho superior ao fim do ano civil (31/12)"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = ((typeof value.id_programa === 'undefined' || value.id_programa === null && !value.id_programa || value.id_programa == 0) && !assinatura)
        ? {
            check: false,
            alert: getNameGenre('programa', 'Nenhum', 'Nenhuma') + ' ' + __.programa + ' definido pela unidade dentro da vig\u00EAncia do atual plano de trabalho. Comunique o Gestor da unidade e tente novamente mais tarde',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="' + getNameGenre('programa', 'Nenhum', 'Nenhuma') + ' ' + __.programa + ' definido pela unidade dentro da vig\u00EAncia do atual plano de trabalho. Comunique o Gestor da unidade e tente novamente mais tarde"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (exige_autorizacao && !documento_autorizacao && !assinatura)
        ? {
            check: false,
            alert: 'A ades\u00E3o \u00E0 modalidade exige a vincula\u00E7\u00E3o de ato administrativo autorizativo',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="A ades\u00E3o \u00E0 modalidade exige a vincula\u00E7\u00E3o de ato administrativo autorizativo"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (carga_horaria_padrao && value.carga_horaria < carga_horaria_padrao && !documento_autorizacao && !assinatura)
        ? {
            check: false,
            alert: 'A redu\u00E7\u00E3o da carga hor\u00E1ria exige a vincula\u00E7\u00E3o de ato administrativo autorizativo',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="A redu\u00E7\u00E3o da carga hor\u00E1ria exige a vincula\u00E7\u00E3o de ato administrativo autorizativo"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (nrMesesPlano > limiteMesesPlanos && !assinatura)
        ? {
            check: false,
            alert: 'A dura\u00E7\u00E3o do plano de trabalho supera o limite m\u00E1ximo de meses permitido (' + limiteMesesPlanos + ')',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="A dura\u00E7\u00E3o do plano de trabalho supera o limite m\u00E1ximo de meses permitido (' + limiteMesesPlanos + ')"><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (value.vigencia && value.pendencias_plano && value.pendencias_plano.presente && value.pendencias_plano.presente.plano_concomitante)
        ? {
            check: false,
            alert: 'Existe plano de trabalho concomitante nesta unidade para esse usu\u00E1rio (' + moment(value.pendencias_plano.presente.plano_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.pendencias_plano.presente.plano_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '). Desative um dos planos e tente novamente.',
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-tip="Existe plano de trabalho concomitante nesta unidade para esse usu\u00E1rio (' + moment(value.pendencias_plano.presente.plano_concomitante.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.pendencias_plano.presente.plano_concomitante.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '). Desative um dos planos e tente novamente."><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (!assinatura && value.vigencia && value.pendencias_plano && value.pendencias_plano.anterior && !value.pendencias_plano.anterior.homologavel)
        ? {
            check: false,
            alert: 'Existe pend\u00EAncias do plano anterior que necessitam de regulariza\u00E7\u00E3o (' + moment(value.pendencias_plano.anterior.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.pendencias_plano.anterior.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '). Clique para mais detalhes. ' + getMotivosPendenciasPlanos(value.pendencias_plano.anterior),
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" data-act="atividades-call" data-fn="regularizaPlano" data-refplano="anterior" data-tip="Existe pend\u00EAncias do plano anterior que necessitam de regulariza\u00E7\u00E3o (' + moment(value.pendencias_plano.anterior.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.pendencias_plano.anterior.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '). Clique para mais detalhes. ' + getMotivosPendenciasPlanos(value.pendencias_plano.anterior) + ' "><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;
    returnAssinatura = (!assinatura && hasAtiv('checkLimitePlano') && checkLimitePlano.excede_limite)
        ? {
            check: false,
            alert: textExcedeLimite,
            btn: '<a class="newLink" style="cursor: pointer; margin: 0;display: inline-block;" ' + alertaExcedeLimite + '><i class="fas fa-signature vermelhoColor" style="font-size: 100%;"></i><i class="fas fa-exclamation-triangle vermelhoColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
        }
        : returnAssinatura;

    return returnAssinatura;
}
