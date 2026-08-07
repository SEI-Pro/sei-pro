// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — home + assignment filters.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import * as templates from './templates.js';
import {
    normalizeHomeFilterText,
    normalizeHomeFilterKey,
    rewriteHomeFilterCaption
} from './domain.js';

import {
    checkLoadedTableSorter
} from './modules.js';

export function normalizeProcessoAtribuicaoText(link) {
    var target = $(link);
    var title = target.attr('title');
    if (typeof title !== 'undefined' && title !== '') {
        title = title.replace('Atribu\u00EDdo para', '').trim().split(/(\s).+\s/).join('');
        if (title) {
            return title;
        }
    }
    return target.text().trim();
}

export function updateHomeFilterCaption(table, filteredRows) {
    var caption = table.find('caption.infraCaption').eq(0);
    if (caption.length === 0) {
        return;
    }

    var baseCaption = caption.data('seiProCaptionBase');
    if (typeof baseCaption === 'undefined' || baseCaption === null || baseCaption === '') {
        baseCaption = caption.text();
        caption.data('seiProCaptionBase', baseCaption);
    }

    var visibleRows = (typeof filteredRows === 'number' && !isNaN(filteredRows))
        ? filteredRows
        : table.find('tbody tr').filter(function(){
            var row = $(this);
            return row.is(':visible') &&
                !row.hasClass('tableHeader') &&
                !row.hasClass('tagintable') &&
                !row.hasClass('infraCaption') &&
                row.find('a[href*="acao=procedimento_trabalhar"]').length > 0;
        }).length;
    caption.text(rewriteHomeFilterCaption(baseCaption, visibleRows));
}
export function syncHomeProcessCaption() {
    updateHomeFilterCaption($('#tblProcessosRecebidos'));
    updateHomeFilterCaption($('#tblProcessosGerados'));
}
export function updateVisibleHeadersForHomeFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;

    table.find('tbody tr').each(function(){
        var row = $(this);
        if (row.hasClass('tableHeader') || row.hasClass('tagintable') || row.hasClass('infraCaption')) {
            if (currentHeader !== null) {
                currentHeader.toggle(hasVisibleRows);
            }
            currentHeader = row;
            hasVisibleRows = false;
            return;
        }

        if (!row.hasClass('seiProHomeFilterHidden')) {
            hasVisibleRows = true;
        }
    });

    if (currentHeader !== null) {
        currentHeader.toggle(hasVisibleRows);
    }
}
export function getHomeRowTagValue(row) {
    var tagName = row.attr('data-tagname');
    if (typeof tagName !== 'undefined' && tagName !== null && tagName !== '') {
        return String(tagName);
    }

    var markerLink = row.find('a[href*="acao=andamento_marcador_gerenciar"]').first();
    if (markerLink.length > 0) {
        var markerTooltip = extractGroupTableTooltipToArray(markerLink.attr('onmouseover'));
        var markerName = (markerTooltip && typeof markerTooltip[1] !== 'undefined' && markerTooltip[1] !== '') ? markerTooltip[1] : '';
        if (markerName === '') {
            var ariaLabel = markerLink.attr('aria-label');
            if (typeof ariaLabel !== 'undefined' && ariaLabel !== '') {
                markerName = ariaLabel.split('/').pop().trim();
            } else {
                markerName = markerLink.text().trim();
            }
        }
        if (markerName !== '') {
            return String(markerName);
        }
    }

    return 'SemGrupo';
}
export function rowMatchesHomeFilter(row, value, dataType) {
    var normalizedValue = normalizeHomeFilterText(value);

    if (dataType == 'user') {
        return normalizeHomeFilterText(getProcessoAtribuicaoValue(row)) === normalizedValue;
    }

    if (dataType == 'tag') {
        var tagName = getHomeRowTagValue(row);
        if (value === 'null') {
            return tagName === 'SemGrupo' || row.find('a[href*="acao=andamento_marcador_gerenciar"]').length === 0;
        }
        return normalizeHomeFilterKey(tagName) === normalizeHomeFilterKey(value);
    }

    if (dataType == 'proc') {
        if (normalizedValue === 'nao visualizado') {
            return row.find('a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso').length > 0;
        }
        var processLink = row.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
        var processText = processLink.text() || '';
        var tooltip = extractTooltipToArray(processLink.attr('onmouseover'));
        var tooltipText = (tooltip && tooltip.length > 0) ? tooltip.join(' ') : '';
        var rowText = normalizeHomeFilterText(processText + ' ' + tooltipText + ' ' + row.text());
        return rowText.indexOf(normalizedValue) !== -1;
    }

    return true;
}
export function applyHomeFilterFallback(value, dataType) {
    var tables = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var normalizedType = String(dataType || 'clean');
    var normalizedValue = String(value || '');

    tables.each(function(){
        var table = $(this);
        table.find('tbody tr').each(function(){
            var row = $(this);
            if (row.hasClass('tableHeader') || row.hasClass('tagintable') || row.hasClass('infraCaption')) {
                row.removeClass('seiProHomeFilterHidden');
                return;
            }

            var show = (normalizedType === 'clean' || normalizedValue === 'all') ? true : rowMatchesHomeFilter(row, normalizedValue, normalizedType);
            row.toggle(show);
            row.toggleClass('seiProHomeFilterHidden', !show);
        });

        updateVisibleHeadersForHomeFilter(table);
        updateHomeFilterCaption(table);
    });
}
export function getFilterTableHome(this_) {
    var _this = $(this_);
    var value = _this.val() || '';
    var data = _this.find('option:selected').data() || {};
    var filters = [];
    var tagFilterSelected = data.type == 'tag';
    var hasTablesorterHome = checkLoadedTableSorter() && tableHomePro.length > 0;
    var clearFilters = ['', '', '', '', ''];

    if ($('#selectGroupTablePro').val() != '') {
        $('#selectGroupTablePro').val('').trigger('change').trigger('chosen:updated');
    }

    if (value === 'all' || data.type === 'clean') {
        applyHomeFilterFallback('', 'clean');
        $.each(tableHomePro, function(i){
            if (tableHomePro[i] && typeof tableHomePro[i].trigger === 'function') {
                tableHomePro[i].trigger('filterReset').trigger('update');
            }
        });
        sessionStorageRemovePro('setFiltersTableHome');
        if (verifyConfigValue('substituiselecao')) {
            forcePlaceHoldChosen();
            _this.trigger('chosen:updated');
        }
        return;
    }

    if (data.type == 'user') {
        filters[3] = (value == '' ? '""' : '('+value+')');
    } else if (data.type == 'proc') {
        filters[2] = (value == '' ? '""' : extractOnlyAlphaNum(removeAcentos(value)));
    } else if (data.type == 'tag') {
        filters[1] = (value == 'null') ? '!Marcador?' : (value == '' ? '' : 'Marcador? '+extractOnlyAlphaNum(removeAcentos(value)));
    }

    if (tagFilterSelected && hasTablesorterHome) {
        setTimeout(function() {
            $.each(tableHomePro, function(i){
                $.tablesorter.setFilters(tableHomePro[i][0], clearFilters, true);
                tableHomePro[i].trigger('update');
            });
            applyHomeFilterFallback(value, data.type);
            sessionStorageStorePro('setFiltersTableHome', {value: value, type: data.type});
        }, 100);
    } else {
        applyHomeFilterFallback(value, data.type);

        if (hasTablesorterHome && filters.length > 0) {
            setTimeout(function() {
                $.each(tableHomePro, function(i){
                    $.tablesorter.setFilters(tableHomePro[i][0], filters, true);
                });
                sessionStorageStorePro('setFiltersTableHome', filters);
            });
        } else {
            sessionStorageStorePro('setFiltersTableHome', {value: value, type: data.type});
        }
    }

    if (verifyConfigValue('substituiselecao')) {
        forcePlaceHoldChosen();
        _this.trigger('chosen:updated');
    }
}
export function selectFilterTableHome(includeUserFilters = true) {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return normalizeProcessoAtribuicaoText(this) }).get();

    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return normalizeProcessoAtribuicaoText(this) }).get();
        users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users) : [];

    var tipos = tableProc.find('a[href*="acao=procedimento_trabalhar"]').map(function(){ 
            var tipoNomeProc = extractGroupTableTooltipToArray($(this).attr('onmouseover'));
                tipoNomeProc = (tipoNomeProc) ? tipoNomeProc[1] : false;
            if (tipoNomeProc) {
                return tipoNomeProc;
            }
        }).get();
        tipos = (typeof tipos !== 'undefined' && tipos !== null) ? uniqPro(tipos) : [];

    var marcadores = tableProc.find('a[href*="acao=andamento_marcador_gerenciar"]').map(function(){ 
            var tipoNomeTag = extractGroupTableTooltipToArray($(this).attr('onmouseover'));
                tipoNomeTag = (tipoNomeTag) ? tipoNomeTag[1] : false;
            if (tipoNomeTag) {
                return tipoNomeTag;
            }
        }).get();
        marcadores = (typeof marcadores !== 'undefined' && marcadores !== null) ? uniqPro(marcadores) : [];

    var html =  templates.homeFilterSelectHtml() +
                '   <option value="" data-type="clean">&nbsp;</option>'+
                '   <option value="all" data-type="clean">Todos os processos</option>'+
                '   <option value="(N\u00E3o visualizado)" data-type="proc">Processos n\u00E3o visualizados</option>';

        if (includeUserFilters && users.length > 0) {
            html += '   <optgroup label="Por atribui\u00E7\u00E3o">'+
                    '       <option value="" data-type="user">Processos sem atribui\u00E7\u00E3o</option>';
            $.each(users, function(i, v){
                html += '       <option value="'+v+'" data-type="user">Atribu\u00EDdos \u00E0 '+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (tipos.length > 0) {
            html += '   <optgroup label="Por tipo de processo">';
            $.each(tipos, function(i, v){
                html += '       <option value="'+v+'" data-type="proc">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (marcadores.length > 0) {
            html += '   <optgroup label="Por marcadores">';
            html += '       <option value="null" data-type="tag">Sem marcador</option>';
            $.each(marcadores, function(i, v){
                html += '       <option value="'+v+'" data-type="tag">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        html += '</select>';
    return html;
}
export function getAssignmentFilterOptionsHome() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){
        return normalizeProcessoAtribuicaoText(this);
    }).get();

    users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users.filter(function(user){ return user !== ''; })) : [];

    return users;
}
export function selectAssignmentFilterHome() {
    var users = getAssignmentFilterOptionsHome();
    var html =  templates.assignmentFilterSelectHtml() +
                '   <option value="">&nbsp;</option>'+
                '   <option value="">Todos os processos</option>'+
                '   <option value="__unassigned__">Processos sem atribui\u00E7\u00E3o</option>';
    $.each(users, function(i, v){
        html += '   <option value="'+v+'">Atribu\u00EDdos \u00E0 '+v+'</option>';
    });
    html += '</select>';
    return html;
}
export function getProcessoAtribuicaoValue(row) {
    var link = row.find('a[href*="acao=procedimento_atribuicao_listar"]').first();
    if (link.length === 0) {
        return '';
    }
    return normalizeProcessoAtribuicaoText(link);
}
export function updateVisibleHeadersForAssignmentFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;

    table.find('tbody tr').each(function(){
        var row = $(this);
        if (row.hasClass('tableHeader') || row.hasClass('tagintable')) {
            if (currentHeader !== null) {
                currentHeader.toggle(hasVisibleRows);
            }
            currentHeader = row;
            hasVisibleRows = false;
            return;
        }

        if (currentHeader !== null && row.is(':visible')) {
            hasVisibleRows = true;
        }
    });

    if (currentHeader !== null) {
        currentHeader.toggle(hasVisibleRows);
    }
}
export function applyAssignmentFilterHomeFallback(value) {
    var filterValue = value || '';
    var tables = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');

    tables.each(function(){
        var table = $(this);
        table.find('tbody tr').not('.tableHeader').not('.tagintable').not('.infraCaption').each(function(){
            var row = $(this);
            var assignedTo = getProcessoAtribuicaoValue(row);
            var show = true;

            if (filterValue === '__unassigned__') {
                show = assignedTo === '';
            } else if (filterValue !== '') {
                show = assignedTo === filterValue;
            }

            row.toggle(show);
        });

        updateVisibleHeadersForAssignmentFilter(table);
    });
}
export function getFilterAssignmentTableHome(this_) {
    var value = $(this_).val() || '';
    sessionStorageStorePro('filterAssignmentTableHome', value);

    if (typeof tableHomePro !== 'undefined' && tableHomePro.length > 0 && typeof $.tablesorter !== 'undefined') {
        $.each(tableHomePro, function(i){
            var tableElement = tableHomePro[i][0];
            var filters = $.tablesorter.storage(tableElement, 'tablesorter-filters') || [];
            filters[3] = value === '__unassigned__' ? '""' : (value !== '' ? '('+value+')' : '');
            $.tablesorter.setFilters(tableElement, filters, true);
        });
    } else {
        applyAssignmentFilterHomeFallback(value);
    }
}
export function restoreAssignmentFilterHome() {
    var target = $('#filterAssignmentTableHome');
    if (target.length === 0) {
        return;
    }

    var savedValue = sessionStorageRestorePro('filterAssignmentTableHome');
    if (typeof savedValue === 'undefined' || savedValue === null) {
        savedValue = '';
    }

    target.val(savedValue);
    if (verifyConfigValue('substituiselecao')) {
        target.trigger('chosen:updated');
    }
    getFilterAssignmentTableHome(target);
}
// Feature "Filtrar a página pelo campo de pesquisa rápida" (config filtrarpaginapelapesquisarapida)
// migrada para src/features/quick-filter/ (bundle quick-filter-list.bundle.js, self-boot). — Fase 6.
