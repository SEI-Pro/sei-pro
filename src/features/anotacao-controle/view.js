/**
 * Feature "Mostrar anotação do processo na tela de controle de processos"
 * (config `mostraranotacaocontrole`) — camada de VIEW (DOM vanilla).
 *
 * DOM nativo (src/dom), SEM jQuery. O núcleo PURO (parsing/normalização) vive em
 * core/sticknote.js; os helpers puros de formatação em ./domain.js; o efeito de
 * rede (prioridade) em ./io.js. As demais dependências são globais legados do
 * MESMO mundo isolado (sei-functions-pro.js / core-stack), lidos de `window` de
 * forma preguiçosa — ponte temporária até esses helpers virarem módulos.
 *
 * Lifecycle: a feature NÃO se auto-inicia; expõe `init`/`render` via
 * SeiPro.features.anotacaoControle (ver index.js). O sei-pro.js chama essa API
 * nos dois pontos do ciclo do tablesorter (init da lista + rebuild da tabela),
 * preservando exatamente o comportamento anterior.
 */
import { qs, qsa, el, remove } from '../../dom/index.js';
import {
    normalizeSticknoteHomeText
} from '../../core/sticknote.js';
import {
    buildChecklistTooltipHtml,
    buildSticknoteHomeRecord,
    parseSticknoteHomeAttributes,
    buildSticknoteCardHtml
} from './domain.js';
import { fetchSticknotePriority } from './io.js';

// --- Dependências legadas/core resolvidas de window (mesmo mundo isolado).
function getParamsUrlPro(u) { return window.getParamsUrlPro(u); }
function normalizeMojibakeUtf8(v) { return window.normalizeMojibakeUtf8 ? window.normalizeMojibakeUtf8(v) : v; }
function setOptionsPro(k, v) { return window.setOptionsPro(k, v); }
function replaceTextToProcessoSEI(t) { return window.replaceTextToProcessoSEI ? window.replaceTextToProcessoSEI(t) : t; }
function verifyConfigValue(n) { return typeof window.verifyConfigValue !== 'undefined' ? window.verifyConfigValue(n) : false; }
function checkConfigValue(n) { return typeof window.checkConfigValue !== 'undefined' ? window.checkConfigValue(n) : false; }

var PROCESS_TABLES_SEL = '#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado';
var NON_DATA_ROW_SEL = '.tableHeader, .tagintable, .infraCaption, .tablesorter-filter-row';

// Tabelas de processos presentes na página (0..3).
function processTables() {
    return qsa(PROCESS_TABLES_SEL);
}

// querySelectorAll do seletor em TODAS as tabelas (substitui jQuery $(tabelas).find(sel)).
function findIn(tables, selector) {
    return tables.reduce(function (acc, table) {
        return acc.concat(qsa(selector, table));
    }, []);
}

// Desfaz um wrapper, promovendo seus filhos ao lugar dele (substitui replaceWith(html)).
function unwrap(node) {
    var parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
}

// Move todo o conteúdo de `node` para dentro de um <div class=className> (substitui wrapInner).
function wrapInner(node, className) {
    var wrapper = document.createElement('div');
    wrapper.className = className;
    while (node.firstChild) wrapper.appendChild(node.firstChild);
    node.appendChild(wrapper);
}

// Na tela de controle, anotação longa estica a lista. Limita o card a ~2 linhas e,
// se houver mais, sobrepõe uma setinha (chevron) no canto inferior direito DENTRO
// do card — com fade para legibilidade. Posição absoluta: não ocupa espaço entre as
// linhas da lista. A altura de 2 linhas é medida pelo line-height computado (robusto
// a tema/zoom). O toggle é removido na limpeza do próximo render. Dentro do processo
// NÃO há clamp (mostra tudo).
function clampToTwoLines(card) {
    if (!card || !card.parentNode) return;
    var cs = window.getComputedStyle(card);
    var lineHeight = parseFloat(cs.lineHeight);
    if (!lineHeight || isNaN(lineHeight)) lineHeight = (parseFloat(cs.fontSize) || 12) * 1.35;
    var twoLines = Math.round(lineHeight * 2 + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0));
    if (card.scrollHeight <= twoLines + 1) return; // já cabe em 2 linhas
    var collapsed = true;
    var icon = el('i', { className: 'fas fa-chevron-down' });
    function apply() {
        if (collapsed) {
            card.style.maxHeight = twoLines + 'px'; card.style.overflow = 'hidden';
            icon.className = 'fas fa-chevron-down'; toggle.title = 'Ver anotação completa';
        } else {
            card.style.maxHeight = ''; card.style.overflow = '';
            icon.className = 'fas fa-chevron-up'; toggle.title = 'Recolher anotação';
        }
    }
    var toggle = el('span', {
        className: 'seipro-sticknote-toggle',
        title: 'Ver anotação completa',
        on: { click: function (ev) { ev.preventDefault(); ev.stopPropagation(); collapsed = !collapsed; apply(); } }
    }, icon);
    apply();
    card.appendChild(toggle);
}

// FRONTEIRA ÚNICA de codificação da feature. Resolve {text, user} de um link de
// anotação a partir das fontes disponíveis na página, na ordem de confiança:
// aria-label (formato rotulado) → onmouseover (string JS escapada). O conserto de
// mojibake (UTF-8 lido como Latin-1: "Ã§Ã£o" → "ção") é aplicado AQUI, UMA vez,
// SIMÉTRICO para texto e usuário e igual para as duas fontes. Tudo a jusante
// (storage arraySticknoteHome, data-attrs, tooltip nativo, card inline) recebe o
// valor já canônico — por isso não há (e não deve haver) re-normalização espalhada.
// normalizeMojibakeUtf8 é idempotente e guardada (não altera texto já correto).
function resolveSticknoteHomeParsed(link) {
    return parseSticknoteHomeAttributes(
        link.getAttribute('aria-label'),
        link.getAttribute('onmouseover')
    );
}
function replaceSticknoteHome() {
    var arraySticknoteHome = [];
    findIn(processTables(), 'a[href*="acao=anotacao_registrar"]').forEach(function (link) {
        var parsed = resolveSticknoteHomeParsed(link);
        if (parsed && parsed.text) {
            var href = link.getAttribute('href');
            var id_protocolo = (href != null) ? getParamsUrlPro(href).id_protocolo : false;
            // parsed.{text,user} já vêm canônicos da fronteira (resolveSticknoteHomeParsed);
            // aqui só normaliza espaços/quebras do texto. Antes o user era corrigido e o
            // texto NÃO — assimetria que deixava o tooltip nativo e o storage com mojibake.
            var texttip = normalizeSticknoteHomeText(parsed.text);
            var usertip = parsed.user || '';
            var _return = buildChecklistTooltipHtml(texttip);
            link.setAttribute('onmouseover', 'return infraTooltipMostrar(' + JSON.stringify(_return) + ',' + JSON.stringify(usertip) + ');');
            link.setAttribute('data-sticknote-text', texttip);
            link.setAttribute('data-sticknote-user', usertip);
            if (id_protocolo) {
                arraySticknoteHome.push(buildSticknoteHomeRecord(id_protocolo, texttip, usertip));
            }
        }
    });
    setOptionsPro('arraySticknoteHome', arraySticknoteHome);
}
function getSticknoteHomeLinks() {
    return findIn(processTables(), 'a[href*="acao=anotacao_registrar"]');
}
function getSticknoteHomeText(link) {
    // data-sticknote-text foi gravado por nós já canônico; parsed vem da fronteira
    // (também canônico). Logo, só falta normalizar espaços — nada de mojibake aqui.
    var texttip = link.getAttribute('data-sticknote-text');
    if (texttip != null) {
        return normalizeSticknoteHomeText(texttip);
    }
    var parsed = resolveSticknoteHomeParsed(link);
    if (parsed && parsed.text) {
        return normalizeSticknoteHomeText(parsed.text);
    }
    return '';
}
function getSticknoteHomePriority(link) {
    var priority = link.getAttribute('data-sticknote-priority');
    if (priority != null) {
        return priority === 'true';
    }
    return false;
}
function loadSticknoteHomePriority(link) {
    var href = link.getAttribute('href');
    if (!href || link.getAttribute('data-sticknote-priority-loading') === 'true') {
        return;
    }
    link.setAttribute('data-sticknote-priority-loading', 'true');
    fetchSticknotePriority(href).then(function (priority) {
        link.setAttribute('data-sticknote-priority', priority ? 'true' : 'false');
        scheduleRenderSticknoteHomeInline();
    }).catch(function () {
        /* falha de transporte: ignora (equivalente ao .always legado) */
    }).finally(function () {
        link.removeAttribute('data-sticknote-priority-loading');
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
    _sticknoteRenderTimer = setTimeout(function () {
        _sticknoteRenderTimer = null;
        renderSticknoteHomeInline();
    }, 100);
}
function renderSticknoteHomeInline() {
    var tableProc = processTables();

    // --- Limpeza do layout anterior (idempotente: desfaz tudo que o render injeta).
    findIn(tableProc, '.seipro-sticknote-toggle').forEach(remove);
    findIn(tableProc, '.seipro-sticknote-detailed-note-cell .seipro-sticknote-card').forEach(unwrap);
    findIn(tableProc, '.seipro-sticknote-card').forEach(remove);
    tableProc.forEach(function (t) { t.classList.remove('seipro-sticknote-layout'); });
    findIn(tableProc, '.seipro-sticknote-inserted-cell').forEach(remove);
    findIn(tableProc, '.seipro-sticknote-inserted-head').forEach(remove);
    findIn(tableProc, '.seipro-sticknote-check-cell').forEach(function (e) { e.classList.remove('seipro-sticknote-check-cell'); });
    findIn(tableProc, '.seipro-sticknote-check-head').forEach(function (e) { e.classList.remove('seipro-sticknote-check-head'); });
    findIn(tableProc, '.seipro-sticknote-icon-cell').forEach(function (e) { e.classList.remove('seipro-sticknote-icon-cell'); });
    findIn(tableProc, '.seipro-sticknote-detailed-note-cell').forEach(function (e) { e.classList.remove('seipro-sticknote-detailed-note-cell', 'seipro-sticknote-note-cell'); });
    findIn(tableProc, '.seipro-sticknote-process-cell').forEach(function (e) { e.classList.remove('seipro-sticknote-process-cell'); });
    findIn(tableProc, 'td[data-sticknote-home-icon="true"]').forEach(function (td) {
        td.removeAttribute('data-sticknote-home-icon');
        td.style.width = ''; td.style.minWidth = ''; td.style.maxWidth = '';
    });
    findIn(tableProc, 'td[data-sticknote-orig-width]').forEach(function (td) {
        var orig = td.getAttribute('data-sticknote-orig-width');
        if (orig) td.setAttribute('width', orig); else td.removeAttribute('width');
        td.removeAttribute('data-sticknote-orig-width');
    });
    findIn(tableProc, 'thead tr th[data-sticknote-orig-colspan], tr.tableHeader th[data-sticknote-orig-colspan]').forEach(function (th) {
        var orig = th.getAttribute('data-sticknote-orig-colspan');
        if (orig) th.setAttribute('colspan', orig); else th.removeAttribute('colspan');
        th.removeAttribute('data-sticknote-orig-colspan');
    });
    if (!verifyConfigValue('mostraranotacaocontrole')) {
        return;
    }

    // --- Monta o layout: classe na tabela + célula de "check" na 1ª coluna das linhas de processo.
    tableProc.forEach(function (t) { t.classList.add('seipro-sticknote-layout'); });
    tableProc.forEach(function (table) {
        qsa('tbody tr', table)
            .filter(function (tr) { return !tr.matches(NON_DATA_ROW_SEL); })
            .filter(function (tr) { return qs('a[href*="acao=procedimento_trabalhar"]', tr); })
            .forEach(function (tr) {
                var td = qsa('td', tr)[0];
                if (td) td.classList.add('seipro-sticknote-check-cell');
            });
    });

    // --- Para cada link de processo: marca a célula e insere a célula de anotação antes (exceto Detalhado).
    findIn(tableProc, 'a[href*="acao=procedimento_trabalhar"]').forEach(function (processLink) {
        var table = processLink.closest('table');
        var processCell = processLink.closest('td');
        if (!processCell) return;
        processCell.classList.add('seipro-sticknote-process-cell');
        if (!(table && table.matches('#tblProcessosDetalhado'))) {
            var noteTd = el('td', { className: 'seipro-sticknote-inserted-cell seipro-sticknote-note-cell' });
            processCell.parentNode.insertBefore(noteTd, processCell);
        }
    });

    // --- Cabeçalho: insere a coluna de anotação no thead de cada tabela (exceto Detalhado).
    tableProc.forEach(function (table) {
        if (table.matches('#tblProcessosDetalhado')) return;
        var processRow = qsa('tbody tr', table)
            .filter(function (tr) { return !tr.matches('.tableHeader, .infraCaption, .tablesorter-filter-row'); })
            .filter(function (tr) { return qs('a[href*="acao=procedimento_trabalhar"]', tr); })[0];
        var processCellIdx = -1;
        if (processRow) {
            var firstProcA = qs('a[href*="acao=procedimento_trabalhar"]', processRow);
            var pc = firstProcA ? firstProcA.closest('td') : null;
            processCellIdx = pc ? qsa('td', processRow).indexOf(pc) : -1;
        }
        if (processCellIdx <= 0) return;
        var theadRows = qsa('thead tr', table);
        var headRow = theadRows.length ? theadRows[theadRows.length - 1] : null;
        if (!headRow) {
            headRow = qsa('tbody tr', table)
                .filter(function (tr) { return !tr.matches('.tableHeader, .infraCaption, .tablesorter-filter-row'); })
                .filter(function (tr) { return qs('th', tr); })[0] || null;
        }
        if (!headRow) return;
        var ths = qsa('th', headRow);
        var processHead = ths[processCellIdx] || ths[ths.length - 1];
        if (processHead) {
            var th = el('th', { className: 'tituloControle infraTh seipro-sticknote-inserted-head' });
            processHead.parentNode.insertBefore(th, processHead);
        }
        var firstTh = qsa('th', headRow)[0];
        if (firstTh) firstTh.classList.add('seipro-sticknote-check-head');
    });

    // --- Tabela Detalhado: identifica a coluna "Anotação" e envolve o conteúdo no card inline.
    var detailedNoteColIdx = -1;
    var detailedTable = qs('#tblProcessosDetalhado');
    if (detailedTable) {
        var dHeadRows = qsa('thead tr', detailedTable);
        var detailedHeadRow = dHeadRows.length ? dHeadRows[dHeadRows.length - 1] : null;
        if (!detailedHeadRow) {
            detailedHeadRow = qsa('tbody tr', detailedTable).filter(function (tr) { return qs('th', tr); })[0] || null;
        }
        if (detailedHeadRow) {
            var dths = qsa('th', detailedHeadRow);
            for (var d = 0; d < dths.length; d++) {
                var label = (dths[d].textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
                if (label.indexOf('anotação') !== -1 || label.indexOf('anotacao') !== -1) {
                    detailedNoteColIdx = d;
                    break;
                }
            }
        }
        if (detailedNoteColIdx >= 0) {
            qsa('tbody tr', detailedTable)
                .filter(function (tr) { return !tr.matches('.tableHeader, .infraCaption, .tablesorter-filter-row'); })
                .filter(function (tr) { return qs('td', tr); })
                .forEach(function (tr) {
                    var noteCell = qsa('td', tr)[detailedNoteColIdx];
                    if (!noteCell) return;
                    var noteText = (noteCell.textContent || '').replace(/ /g, ' ').trim();
                    if (noteText === '') return;
                    noteCell.classList.add('seipro-sticknote-detailed-note-cell', 'seipro-sticknote-note-cell');
                    if (!qs('.seipro-sticknote-card', noteCell)) {
                        wrapInner(noteCell, 'seipro-sticknote-card');
                    }
                    clampToTwoLines(qs('.seipro-sticknote-card', noteCell));
                });
        }
    }

    // --- Renderiza o card inline da anotação ao lado de cada processo (exceto Detalhado).
    getSticknoteHomeLinks().forEach(function (link) {
        var texttip = getSticknoteHomeText(link);
        var tr = link.closest('tr');
        var processLink = tr ? qs('a[href*="acao=procedimento_trabalhar"]', tr) : null;
        if (!processLink) {
            return;
        }
        if (texttip == null || texttip.trim() === '') {
            return;
        }
        var table = processLink.closest('table');
        if (table && table.matches('#tblProcessosDetalhado')) {
            return;
        }
        var iconCell = link.closest('td');
        if (iconCell) {
            iconCell.classList.add('seipro-sticknote-icon-cell');
            iconCell.setAttribute('data-sticknote-home-icon', 'true');
            iconCell.style.width = ''; iconCell.style.minWidth = ''; iconCell.style.maxWidth = '';
        }
        var processCell = processLink.closest('td');
        var noteCell = processCell ? processCell.previousElementSibling : null;
        if (!(noteCell && noteCell.matches('.seipro-sticknote-inserted-cell'))) {
            noteCell = el('td', { className: 'seipro-sticknote-inserted-cell seipro-sticknote-note-cell' });
            processCell.parentNode.insertBefore(noteCell, processCell);
        }
        var priority = getSticknoteHomePriority(link);
        qsa('.seipro-sticknote-card', noteCell).forEach(remove);
        var inline = el('div', {
            className: 'seipro-sticknote-card ' + (priority ? 'seipro-sticknote-card--priority' : ''),
            innerHTML: buildSticknoteCardHtml(texttip, replaceTextToProcessoSEI)
        });
        noteCell.insertBefore(inline, noteCell.firstChild);
        clampToTwoLines(inline);
        if (link.getAttribute('data-sticknote-priority') == null) {
            loadSticknoteHomePriority(link);
        }
    });

    // --- Ajusta a largura da coluna do ícone e o colspan dos cabeçalhos de grupo.
    tableProc.forEach(function (table) {
        if (table.matches('#tblProcessosDetalhado')) return;
        var iconColIdx = -1;
        var iconCellByClass = qs('.seipro-sticknote-icon-cell', table);
        if (iconCellByClass) {
            var iconRow = iconCellByClass.closest('tr');
            iconColIdx = iconRow ? qsa('td', iconRow).indexOf(iconCellByClass) : -1;
        } else {
            var rows = qsa('tbody tr', table);
            for (var r = 0; r < rows.length && iconColIdx < 0; r++) {
                var tds = qsa('td', rows[r]);
                for (var c = 0; c < tds.length; c++) {
                    if (tds[c].getAttribute('width') === '20%') { iconColIdx = c; break; }
                }
            }
        }
        if (iconColIdx < 0) return;
        qsa('tbody tr', table).forEach(function (tr) {
            var cell = qsa('td', tr)[iconColIdx];
            if (!cell) return;
            if (!cell.getAttribute('data-sticknote-orig-width')) {
                cell.setAttribute('data-sticknote-orig-width', cell.getAttribute('width') || '');
            }
            cell.setAttribute('width', '28');
        });
        qsa('thead tr th[colspan], tbody tr.tableHeader th[colspan]', table).forEach(function (th) {
            var colspan = parseInt(th.getAttribute('colspan'), 10);
            if (!th.getAttribute('data-sticknote-orig-colspan')) {
                th.setAttribute('data-sticknote-orig-colspan', th.getAttribute('colspan') || '');
            }
            if (!Number.isNaN(colspan)) {
                th.setAttribute('colspan', String(colspan + 1));
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
        setTimeout(function () {
            initReplaceSticknoteHome(TimeOut - 100);
            if (verifyConfigValue('debugpage')) console.log('Reload initReplaceSticknoteHome');
        }, 500);
    }
}

export { initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome };
