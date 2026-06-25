/**
 * Feature "Mostrar anotação do processo na tela de controle de processos"
 * (config `mostraranotacaocontrole`) — camada de VIEW (DOM).
 *
 * Extraída VERBATIM de sei-pro.js (cluster resolveSticknoteHomeParsed →
 * initReplaceSticknoteHome). O núcleo PURO (parsing/normalização) vive em
 * core/sticknote.js e é importado modularmente aqui. As demais dependências são
 * globais legados/core do MESMO mundo isolado (sei-functions-pro.js, core-stack
 * bundle), lidos de `window` de forma preguiçosa — igual ao padrão usado pelas
 * outras features migradas (o jQuery e os helpers já estão carregados quando
 * estas funções rodam).
 *
 * Lifecycle: a feature NÃO se auto-inicia; expõe `init`/`render` via
 * SeiPro.features.anotacaoControle (ver index.js). O sei-pro.js chama essa API
 * nos dois pontos do ciclo do tablesorter (init da lista + rebuild da tabela),
 * preservando exatamente o comportamento anterior.
 */
import {
    parseSticknoteHomeLabel,
    normalizeSticknoteHomeText,
    parseSticknoteChecklistLine
} from '../../core/sticknote.js';

// --- Dependências legadas/core resolvidas de window (mesmo mundo isolado).
function getParamsUrlPro(u) { return window.getParamsUrlPro(u); }
function normalizeMojibakeUtf8(v) { return window.normalizeMojibakeUtf8 ? window.normalizeMojibakeUtf8(v) : v; }
function setOptionsPro(k, v) { return window.setOptionsPro(k, v); }
function replaceTextToProcessoSEI(t) { return window.replaceTextToProcessoSEI ? window.replaceTextToProcessoSEI(t) : t; }
function verifyConfigValue(n) { return typeof window.verifyConfigValue !== 'undefined' ? window.verifyConfigValue(n) : false; }
function checkConfigValue(n) { return typeof window.checkConfigValue !== 'undefined' ? window.checkConfigValue(n) : false; }

// Resolve {text, user} de um link de anotação a partir das fontes disponíveis na
// página, na ordem de confiança: aria-label (formato rotulado) → onmouseover
// (string JS escapada). Retorna false quando nenhuma fonte casa.
function resolveSticknoteHomeParsed(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var ariaLabel = _this.attr('aria-label');
    if (ariaLabel) {
        var parsed = parseSticknoteHomeLabel(ariaLabel);
        if (parsed) {
            return parsed;
        }
    }
    var tooltip = _this.attr('onmouseover');
        tooltip = (typeof tooltip !== 'undefined') ? tooltip.split("'") : false;
    if (tooltip) {
        return { text: tooltip[1] || '', user: tooltip[3] || '' };
    }
    return false;
}
function replaceSticknoteHome() {
    var $ = window.jQuery;
    var arraySticknoteHome = [];
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('a[href*="acao=anotacao_registrar"]').each(function(){
        var _this = $(this);
        var parsed = resolveSticknoteHomeParsed(_this);
        if (parsed && parsed.text) {
            var id_protocolo = _this.attr('href');
                id_protocolo = (typeof id_protocolo !== 'undefined') ? getParamsUrlPro(id_protocolo).id_protocolo : false;
            var texttip = normalizeSticknoteHomeText(parsed.text);
            var usertip = normalizeMojibakeUtf8(parsed.user || '');
            var _return = $.map(texttip.split('\n'), function(v){
                if (v === '') {
                    return v;
                }
                var item = parseSticknoteChecklistLine(v);
                if (!item.isItem) {
                    return v;
                }
                var icon = item.checked ? '<i class=\\"fas fa-check-square\\"></i> ' : '<i class=\\"far fa-square\\"></i> ';
                var style = item.checked ? ' style=\\"text-decoration: line-through;\\"' : '';
                return '<div'+style+'>'+icon+item.text+'</div>';
            }).join('');
            _this
                .attr('onmouseover', 'return infraTooltipMostrar(' + JSON.stringify(_return) + ',' + JSON.stringify(usertip) + ');')
                .attr('data-sticknote-text', texttip)
                .attr('data-sticknote-user', usertip);
            if (id_protocolo) {
                arraySticknoteHome.push({id_protocolo: id_protocolo, usertip: usertip, texttip: texttip});
            }
        }
    });
    setOptionsPro('arraySticknoteHome', arraySticknoteHome);
}
// Renderiza o texto da anotação como HTML de parágrafos para o card inline,
// aplicando o estilo de checklist (stickNoteCheck/stickNoteChecked) por linha.
function sticknoteChecklistClass(item) {
    if (!item.isItem) {
        return '';
    }
    return item.checked ? ' class="stickNoteCheck stickNoteChecked"' : ' class="stickNoteCheck"';
}
function formatDadosAnotacaoHome(value) {
    var $ = window.jQuery;
    value = normalizeMojibakeUtf8(value);
    value = normalizeSticknoteHomeText(value);
    if (value === '') {
        return '';
    }
    if (value.indexOf('\n') === -1) {
        var single = parseSticknoteChecklistLine(value);
        return '<div'+sticknoteChecklistClass(single)+'>'+replaceTextToProcessoSEI(single.text)+'</div>';
    }
    var result = '';
    $.each(value.split('\n'), function(i, v){
        if (v != '') {
            var item = parseSticknoteChecklistLine(v);
            result += '<div'+sticknoteChecklistClass(item)+'>'+replaceTextToProcessoSEI(item.text)+'</div>';
        } else if (i != 0 || i != value.length-1) {
            result += '<div><br></div>';
        }
    });
    return result;
}
function getSticknoteHomeLinks() {
    var $ = window.jQuery;
    return $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('a[href*="acao=anotacao_registrar"]');
}
function getSticknoteHomeText(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var texttip = _this.attr('data-sticknote-text');
    if (typeof texttip !== 'undefined') {
        return normalizeSticknoteHomeText(normalizeMojibakeUtf8(texttip));
    }
    var parsed = resolveSticknoteHomeParsed(_this);
    if (parsed && parsed.text) {
        return normalizeSticknoteHomeText(normalizeMojibakeUtf8(parsed.text));
    }
    return '';
}
function getSticknoteHomePriority(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var priority = _this.attr('data-sticknote-priority');
    if (typeof priority !== 'undefined') {
        return priority === 'true';
    }
    return false;
}
function loadSticknoteHomePriority(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var href = _this.attr('href');
    if (!href || _this.attr('data-sticknote-priority-loading') === 'true') {
        return;
    }
    _this.attr('data-sticknote-priority-loading', 'true');
    $.ajax({ url: href }).done(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var priority = doc.querySelector('#chkSinPrioridade');
        priority = priority ? priority.checked : false;
        _this.attr('data-sticknote-priority', priority ? 'true' : 'false');
        scheduleRenderSticknoteHomeInline();
    }).always(function() {
        _this.removeAttr('data-sticknote-priority-loading');
    });
}
// Coalesce os re-renders disparados pelas respostas de prioridade: numa lista com
// N processos, sem isso cada XHR concluído reconstruiria a tabela inteira
// (O(N) tear-downs/rebuilds + thrash de layout). Agrupa num único render.
var _sticknoteRenderTimer = null;
function scheduleRenderSticknoteHomeInline() {
    if (_sticknoteRenderTimer) {
        clearTimeout(_sticknoteRenderTimer);
    }
    _sticknoteRenderTimer = setTimeout(function() {
        _sticknoteRenderTimer = null;
        renderSticknoteHomeInline();
    }, 100);
}
function renderSticknoteHomeInline() {
    var $ = window.jQuery;
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    tableProc.find('.sticknoteHomeDetailedNoteCell .sticknoteHomeInline').each(function() {
        $(this).replaceWith($(this).html());
    });
    tableProc.find('.sticknoteHomeInline').remove();
    tableProc.removeClass('sticknoteHomeLayout');
    tableProc.find('.sticknoteHomeInsertedCell').remove();
    tableProc.find('.sticknoteHomeInsertedHead').remove();
    tableProc.find('.sticknoteHomeCheckCell').removeClass('sticknoteHomeCheckCell');
    tableProc.find('.sticknoteHomeCheckHead').removeClass('sticknoteHomeCheckHead');
    tableProc.find('.sticknoteHomeIconCell').removeClass('sticknoteHomeIconCell');
    tableProc.find('.sticknoteHomeDetailedNoteCell').removeClass('sticknoteHomeDetailedNoteCell sticknoteHomeNoteCell');
    tableProc.find('.sticknoteHomeProcessCell').removeClass('sticknoteHomeProcessCell');
    tableProc.find('td[data-sticknote-home-icon="true"]').removeAttr('data-sticknote-home-icon').css({'width':'','min-width':'','max-width':''});
    tableProc.find('td[data-sticknote-orig-width]').each(function() {
        var orig = $(this).attr('data-sticknote-orig-width');
        if (orig) $(this).attr('width', orig); else $(this).removeAttr('width');
        $(this).removeAttr('data-sticknote-orig-width');
    });
    tableProc.find('thead tr th[data-sticknote-orig-colspan], tr.tableHeader th[data-sticknote-orig-colspan]').each(function() {
        var orig = $(this).attr('data-sticknote-orig-colspan');
        if (orig) $(this).attr('colspan', orig); else $(this).removeAttr('colspan');
        $(this).removeAttr('data-sticknote-orig-colspan');
    });
    if (!verifyConfigValue('mostraranotacaocontrole')) {
        return;
    }
    tableProc.addClass('sticknoteHomeLayout');
    tableProc.find('tbody tr')
        .not('.tableHeader, .tagintable, .infraCaption, .tablesorter-filter-row')
        .has('a[href*="acao=procedimento_trabalhar"]')
        .each(function() {
            $(this).find('td').eq(0).addClass('sticknoteHomeCheckCell');
        });
    tableProc.find('a[href*="acao=procedimento_trabalhar"]').each(function() {
        var processLink = $(this);
        var table = processLink.closest('table');
        var processCell = processLink.closest('td');
        if (!processCell.length) return;
        processCell.addClass('sticknoteHomeProcessCell');
        if (!table.is('#tblProcessosDetalhado')) {
            $('<td class="sticknoteHomeInsertedCell sticknoteHomeNoteCell"></td>').insertBefore(processCell);
        }
    });
    tableProc.each(function() {
        var $table = $(this);
        if ($table.is('#tblProcessosDetalhado')) return;
        var processRow = $table.find('tbody tr').not('.tableHeader, .infraCaption, .tablesorter-filter-row').has('a[href*="acao=procedimento_trabalhar"]').first();
        var processCellIdx = -1;
        if (processRow.length) {
            processCellIdx = processRow.find('td').index(processRow.find('a[href*="acao=procedimento_trabalhar"]').first().closest('td'));
        }
        if (processCellIdx <= 0) return;
        var headRow = $table.find('thead tr').last();
        if (!headRow.length) {
            headRow = $table.find('tbody tr').not('.tableHeader, .infraCaption, .tablesorter-filter-row').has('th').first();
        }
        var processHead = headRow.find('th').eq(processCellIdx);
        if (!processHead.length) {
            processHead = headRow.find('th').last();
        }
        if (processHead.length) {
            $('<th class="tituloControle infraTh sticknoteHomeInsertedHead"></th>').insertBefore(processHead);
        }
        headRow.find('th').eq(0).addClass('sticknoteHomeCheckHead');
    });
    var detailedNoteColIdx = -1;
    var detailedTable = $('#tblProcessosDetalhado');
    if (detailedTable.length) {
        var detailedHeadRow = detailedTable.find('thead tr').last();
        if (!detailedHeadRow.length) {
            detailedHeadRow = detailedTable.find('tbody tr').has('th').first();
        }
        detailedHeadRow.find('th').each(function(i) {
            var label = $(this).text().replace(/\s+/g, ' ').trim().toLowerCase();
            if (label.indexOf('anotação') !== -1 || label.indexOf('anotacao') !== -1) {
                detailedNoteColIdx = i;
                return false;
            }
        });
        if (detailedNoteColIdx >= 0) {
            detailedTable.find('tbody tr').not('.tableHeader, .infraCaption, .tablesorter-filter-row').has('td').each(function() {
                var noteCell = $(this).find('td').eq(detailedNoteColIdx);
                if (!noteCell.length) return;
                var noteText = noteCell.text().replace(/\u00a0/g, ' ').trim();
                if (noteText === '') return;
                noteCell.addClass('sticknoteHomeDetailedNoteCell sticknoteHomeNoteCell');
                if (!noteCell.find('.sticknoteHomeInline').length) {
                    noteCell.wrapInner('<div class="sticknoteHomeInline"></div>');
                }
            });
        }
    }
    getSticknoteHomeLinks().each(function() {
        var _this = $(this);
        var texttip = getSticknoteHomeText(_this);
        var processLink = _this.closest('tr').find('a[href*="acao=procedimento_trabalhar"]').eq(0);
        if (!processLink.length) {
            return;
        }
        if (typeof texttip === 'undefined' || texttip.trim() == '') {
            return;
        }
        var table = processLink.closest('table');
        if (table.is('#tblProcessosDetalhado')) {
            return;
        }
        var iconCell = _this.closest('td');
        var noteCell = false;
        iconCell
            .addClass('sticknoteHomeIconCell')
            .attr('data-sticknote-home-icon', 'true')
            .css({'width':'','min-width':'','max-width':''});
        noteCell = processLink.closest('td').prev('.sticknoteHomeInsertedCell');
        if (!noteCell.length) {
            noteCell = $('<td class="sticknoteHomeInsertedCell sticknoteHomeNoteCell"></td>').insertBefore(processLink.closest('td'));
        }
        var priority = getSticknoteHomePriority(_this);
        noteCell.find('.sticknoteHomeInline').remove();
        noteCell.prepend('<div class="sticknoteHomeInline '+(priority ? 'priority' : '')+'">'+formatDadosAnotacaoHome(texttip)+'</div>');
        if (typeof _this.attr('data-sticknote-priority') === 'undefined') {
            loadSticknoteHomePriority(_this);
        }
    });
    tableProc.each(function() {
        var $table = $(this);
        if ($table.is('#tblProcessosDetalhado')) return;
        var iconColIdx = -1;
        var iconCellByClass = $table.find('.sticknoteHomeIconCell').first();
        if (iconCellByClass.length) {
            iconColIdx = iconCellByClass.closest('tr').find('td').index(iconCellByClass);
        } else {
            $table.find('tbody tr').each(function() {
                $(this).find('td').each(function(i) {
                    if ($(this).attr('width') === '20%') { iconColIdx = i; return false; }
                });
                if (iconColIdx >= 0) return false;
            });
        }
        if (iconColIdx < 0) return;
        $table.find('tbody tr').each(function() {
            var cell = $(this).find('td').eq(iconColIdx);
            if (!cell.length) return;
            if (!cell.attr('data-sticknote-orig-width')) {
                cell.attr('data-sticknote-orig-width', cell.attr('width') || '');
            }
            cell.attr('width', '28');
        });
        $table.find('thead tr th[colspan], tbody tr.tableHeader th[colspan]').each(function() {
            var th = $(this);
            var colspan = parseInt(th.attr('colspan'), 10);
            if (!th.attr('data-sticknote-orig-colspan')) {
                th.attr('data-sticknote-orig-colspan', th.attr('colspan') || '');
            }
            if (!Number.isNaN(colspan)) {
                th.attr('colspan', colspan + 1);
            }
        });
    });
}
function initReplaceSticknoteHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof window.checkConfigValue !== 'undefined') {
        if (checkConfigValue('mostraranotacaocontrole')) {
            replaceSticknoteHome();
            renderSticknoteHomeInline();
        }
    } else {
        setTimeout(function(){
            initReplaceSticknoteHome(TimeOut - 100);
            if (verifyConfigValue('debugpage')) console.log('Reload initReplaceSticknoteHome');
        }, 500);
    }
}

export { initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome };
