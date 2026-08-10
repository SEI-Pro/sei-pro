// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — boot / load scripts.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import { refreshSeiPageSelectors } from './state.js';

import {
    checkPageAtividadesVisualizacao
} from './atividades-bridge.js';

import {
    checkMenuSEIPro,
    checkPageVisualizacao,
    getIframeArvoreElement,
    initModalNewSEISigiloso,
    patchNativeEditorOpen,
    resizeArvoreMaxWidth,
    setResizeArvoreMaxWidth,
    setSizeIframePro
} from './modules.js';

export function fnJqueryPro() {
    try { refreshSeiPageSelectors(); } catch (e) { /* selectors optional until DOM ready */ }
    if (typeof $.tablesorter !== 'undefined') {
        $.tablesorter.characterEquivalents = {
            'a' : '\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5', // áàâãäąå
            'A' : '\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5', // ÁÀÂÃÄĄÅ
            'c' : '\u00e7\u0107\u010d', // çćč
            'C' : '\u00c7\u0106\u010c', // ÇĆČ
            'e' : '\u00e9\u00e8\u00ea\u00eb\u011b\u0119', // éèêëěę
            'E' : '\u00c9\u00c8\u00ca\u00cb\u011a\u0118', // ÉÈÊËĚĘ
            'i' : '\u00ed\u00ec\u0130\u00ee\u00ef\u0131', // íìİîïı
            'I' : '\u00cd\u00cc\u0130\u00ce\u00cf', // ÍÌİÎÏ
            'o' : '\u00f3\u00f2\u00f4\u00f5\u00f6\u014d', // óòôõöō
            'O' : '\u00d3\u00d2\u00d4\u00d5\u00d6\u014c', // ÓÒÔÕÖŌ
            'ss': '\u00df', // ß (s sharp)
            'SS': '\u1e9e', // ẞ (Capital sharp s)
            'u' : '\u00fa\u00f9\u00fb\u00fc\u016f', // úùûüů
            'U' : '\u00da\u00d9\u00db\u00dc\u016e' // ÚÙÛÜŮ
        };
    }
    $.fn.wrapInTag = function (opts) {
        function getText(obj) {
            return obj.textContent ? obj.textContent : obj.innerText;
        }

        var tag = opts.tag || 'span',
            words = opts.words || [],
            tagclass = opts.class || '',
            regex = RegExp('\\b'+words.join('|')+'\\b', 'igm'),
            replacement = '<'+tag+' class="'+tagclass+'">$&</'+tag+'>';

        $(this).contents().each(function () {
            if (this.nodeType === 3) //Node.TEXT_NODE
            {
                $(this).replaceWith(getText(this).replace(regex, replacement));
            }
            else if (!opts.ignoreChildNodes) {
                $(this).wrapInTag(opts);
            }
        });
    };
    $.fn.extend({
        insertAtCaret: function(myValue) {
        this.each(function() {
            if (document.selection) {
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) +
                myValue + this.value.substring(endPos,this.value.length);
            this.focus();
            this.selectionStart = startPos + myValue.length;
            this.selectionEnd = startPos + myValue.length;
            this.scrollTop = scrollTop;
            } else {
            this.value += myValue;
            this.focus();
            }
        });
        return this;
        }
    });
    $.fn.moveTo = function(selector){
        return this.each(function(){
            var cl = $(this).clone();
            $(cl).prependTo(selector);
            $(this).remove();
        });
    };
    $.extend({
        replaceTag: function (element, tagName, withDataAndEvents, deepWithDataAndEvents) {
            var newTag = $("<" + tagName + ">")[0];
            $.each(element.attributes, function() {
                newTag.setAttribute(this.name, this.value);
            });
            $(element).children().clone(withDataAndEvents, deepWithDataAndEvents).appendTo(newTag);
            return newTag;
        }
    })
    $.fn.extend({
        replaceTag: function (tagName, withDataAndEvents, deepWithDataAndEvents) {
            // Use map to reconstruct the selector with newly created elements
            return this.map(function() {
                return jQuery.replaceTag(this, tagName, withDataAndEvents, deepWithDataAndEvents);
            })
        }
    });
    if (SeiPro.sei.adapter.isNewSEI()) $('body').addClass('newSEI');
    if (SeiPro.sei.adapter.isSEI5()) $('body').addClass('SeiPro.sei.adapter.isSEI5()');
    initModalNewSEISigiloso();
    if (typeof window.__seiProReadyResolve === 'function') {
        window.__seiProReadyResolve(window);
        window.__seiProReadyResolve = null;
    }
}


// [migrado para core/sei] loadStyleDesign
export function loadScriptVisualizacaoPro() {
    if ( $($ifrVisualizacao).length ) {
        function tryPatchWindow(w) {
            try {
                if (!w) return;
                if (!patchNativeEditorOpen(w) && !w.__SEI_PRO_EDITOR_OPEN_PATCHED__) {
                    // linkEditarConteudo may appear after partial loads — retry briefly.
                    if (w.__SEI_PRO_EDITOR_OPEN_RETRY__) return;
                    w.__SEI_PRO_EDITOR_OPEN_RETRY__ = true;
                    var tries = 0;
                    var timer = setInterval(function() {
                        tries++;
                        if (patchNativeEditorOpen(w) || w.__SEI_PRO_EDITOR_OPEN_PATCHED__ || tries >= 20) {
                            clearInterval(timer);
                            w.__SEI_PRO_EDITOR_OPEN_RETRY__ = false;
                        }
                    }, 250);
                }
            } catch (e) { /* noop */ }
        }

        function tryPatchViz() {
            var w = $($ifrVisualizacao)[0] && $($ifrVisualizacao)[0].contentWindow;
            tryPatchWindow(w);
        }

        function tryPatchNestedViz() {
            var $ifrInternoVisualizacao = $($ifrVisualizacao).contents().find('#ifrVisualizacao');
            if (!$ifrInternoVisualizacao.length) return;

            var nestedWindow = $ifrInternoVisualizacao[0] && $ifrInternoVisualizacao[0].contentWindow;
            tryPatchWindow(nestedWindow);
            $ifrInternoVisualizacao.off('load.seipro-editor-open').on('load.seipro-editor-open', function() {
                tryPatchWindow(this.contentWindow);
                scriptVisualizacaoPro($(this).contents());
            });
        }

        $($ifrVisualizacao).off("load.seipro").on("load.seipro", function() {
            tryPatchViz();
            tryPatchNestedViz();
            scriptVisualizacaoPro($($ifrVisualizacao).contents());
        });
        try {
            var readyWin = $($ifrVisualizacao)[0] && $($ifrVisualizacao)[0].contentWindow;
            if (readyWin && readyWin.document && readyWin.document.readyState === 'complete') {
                tryPatchViz();
                tryPatchNestedViz();
            }
        } catch (e2) { /* noop */ }
    }
}
export function scriptVisualizacaoPro(ifrV) {
    if (typeof loadStyleDesign === 'function') loadStyleDesign(ifrV.find('body'), 'view');
    if (typeof loadFontIcons === 'function') loadFontIcons('head', ifrV);
    if (typeof checkPageVisualizacao === 'function') checkPageVisualizacao();
    if (typeof checkPageAtividadesVisualizacao === 'function') checkPageAtividadesVisualizacao();
    if (typeof checkPageMonitoradosVisualizacao === 'function') checkPageMonitoradosVisualizacao();
}

export function loadScriptArvorePro() {
    if (!window.__SEI_PRO_ARVORE_READY_LISTENER__) {
        window.__SEI_PRO_ARVORE_READY_LISTENER__ = true;
        window.addEventListener('sei-pro-arvore-ready', function() {
            if (typeof loadResizeIframeArvoreNewSEI === 'function') loadResizeIframeArvoreNewSEI();
            if (typeof resizeArvoreMaxWidth === 'function' && typeof verifyConfigValue === 'function' && verifyConfigValue('resizearvore')) resizeArvoreMaxWidth(true);
        });
    }
    if ( $('#ifrArvore').length ) {
        $('#ifrArvore').off("load.seipro").on("load.seipro", function() {
            if (typeof loadResizeIframeArvoreNewSEI === 'function') loadResizeIframeArvoreNewSEI();
        });
    }
}
export function initLoadSeiProArvore(TimeOut = 1000) {
    var ifrArvore = getIframeArvoreElement();
    if (ifrArvore && ifrArvore.contentWindow && typeof ifrArvore.contentWindow.initSeiProArvore === 'function' ) {
        ifrArvore.contentWindow.initSeiProArvore();
    }
}
// Subscreve funcao nativa do SEI
try {
if (localStorage.getItem('seiSlim') && !SeiPro.sei.adapter.isNewSEI()) {
    function movemouse(e) { 
        if (e == null) { e = window.event } 
        if (e.button <= 1 && isdrag){
        var tamanhoRedimensionamento = null;
            tamanhoRedimensionamento = nn6 ? tx + e.clientX - x : tx + event.clientX - x;
        var tamanhoLeft = 0;
        var tamanhoRight = 0;
        if (tamanhoRedimensionamento > 0){
            tamanhoLeft = (divLeftTamanhoInicial + tamanhoRedimensionamento);
            tamanhoRight = (divRightTamanhoInicial - tamanhoRedimensionamento);
        } else{
            tamanhoLeft = (divLeftTamanhoInicial - Math.abs(tamanhoRedimensionamento));
            tamanhoRight = (divRightTamanhoInicial + Math.abs(tamanhoRedimensionamento));
        }
        if (tamanhoLeft < 0 || tamanhoRight < 0){
            if (tamanhoRedimensionamento > 0){
            tamanhoLeft = 0;
            tamanhoRight = (divLeftTamanhoInicial - divRightTamanhoInicial) ;
            }else{
            tamanhoLeft = (divLeftTamanhoInicial - divRightTamanhoInicial);
            tamanhoRight = 0;
            }
        }   
        if(tamanhoLeft > 50 && tamanhoRight > 100){
            setSizeIframePro(tamanhoLeft);
        }
        }
        return false;
    }
} else if (localStorage.getItem('seiSlim') && SeiPro.sei.adapter.isNewSEI() && typeof $().resizable === 'function') {
    loadResizeIframeArvoreNewSEI();
}
} catch (e) { /* seiSlim resize bind deferred */ }
export function loadResizeIframeArvoreNewSEI() {
    if ($("#divIframeArvore").length && typeof $().resizable === 'function') {
        if ($("#divIframeArvore").data('ui-resizable')) return;
        $("#divIframeArvore").resizable({
            handles: "e,  w",
            minWidth: 200,
            maxWidth: $(document).width() - 600,
            start: function() {
                ifr = $('#ifrArvore');
                var d = $('<div></div>');
                $('#divConteudo').append(d[0]);
                d[0].id = 'temp_div';
                d.css({
                    position: 'absolute'
                });
                d.css({
                    top: ifr.position().top,
                    left: 0
                });
                d.height(ifr.height());
                d.width('100%');
            },
            stop: function() {
                $('#temp_div').remove();
                setSizeIframePro($('#ifrArvore').width());
            }
        });
        loadDBClickResizeIframeArvore();
    }
}
export function loadDBClickResizeIframeArvore() {
    $("#divIframeArvore").on('dblclick', function() { setResizeArvoreMaxWidth(60, true) }).attr('onmouseover', 'return infraTooltipMostrar(\'Duplo clique para redimensionar pela largura total da \u00E1rvore\')').attr('onmouseout', 'return infraTooltipOcultar();');
}
export function loadScriptPro() {
	if ( frmEditor.length || $('#divEditores').length ) {
	} else {
        $(document).ready(function () {
            loadScriptVisualizacaoPro();
            loadScriptArvorePro();
            checkMenuSEIPro();
        });
    }
}
loadScriptPro();

// Implementações globais explícitas para evitar dependência do escopo legado do arquivo.
(function() {
    function getRuntimeApiSeiPro() {
        if (typeof browser !== 'undefined' && browser.runtime) return browser;
        if (typeof chrome !== 'undefined' && chrome.runtime) return chrome;
        return null;
    }

    function getProcessNotificationCountSeiPro() {
        return $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
            .find('a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso, a.processoCredencialAssinaturaSigiloso')
            .length;
    }

    window.initProcessNotificationsPro = function initProcessNotificationsPro() {
        if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;

        var start = function() {
            if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
            if (typeof checkConfigValue !== 'function') return;

            var sync = function(force) {
                var enabled = checkConfigValue('notificacaonovoprocesso');
                var count = enabled ? getProcessNotificationCountSeiPro() : 0;
                var stateKey = [
                    window.location.host || '',
                    $('#lnkUsuarioSistema').attr('title') || (typeof getOptionsPro === 'function' ? getOptionsPro('usuarioSistema') : '') || '',
                    typeof siglaUnidadeAtual !== 'undefined' ? siglaUnidadeAtual : ''
                ].join('::');

                if (!stateKey.replace(/:/g, '').trim()) return false;

                if (
                    !force &&
                    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ &&
                    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.enabled === enabled &&
                    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.count === count &&
                    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.key === stateKey
                ) {
                    return false;
                }

                window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ = {
                    enabled: enabled,
                    count: count,
                    key: stateKey
                };

                var runtimeApi = getRuntimeApiSeiPro();
                if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== 'function') {
                    return false;
                }

                runtimeApi.runtime.sendMessage({
                    action: 'syncNotificacaoProcessos',
                    enabled: enabled,
                    count: count,
                    key: stateKey,
                    label: (typeof siglaUnidadeAtual !== 'undefined' ? siglaUnidadeAtual : '') || window.location.host || ''
                }, function() {});

                return true;
            };

            sync(true);
            window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__ = window.setInterval(function() {
                sync(false);
            }, 10000);
        };

        if (window.__SEI_PRO_CONFIG_READY__) {
            start();
        } else {
            window.addEventListener('sei-pro-config-ready', start, { once: true });
        }
    };

    window.initSmartSignatureSelectionPro = function initSmartSignatureSelectionPro() {
        if (
            window.location.href.indexOf('acao=rel_bloco_protocolo_listar') === -1 ||
            window.__SEI_PRO_SMART_SIGNATURE_SELECTION__
        ) {
            return false;
        }

        var normalize = function(text) {
            return String(text || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        };

        var getCurrentUserName = function() {
            var userTitle = $('#lnkUsuarioSistema').attr('title') || '';
            var userText = $('#lnkUsuarioSistema').text() || '';
            var userName = '';
            var titleMatchers = [
                /(.+)\s-\s/,
                /(.+)\s\(.*/,
                /(.+?)\s*\/\s*.*/
            ];

            $.each(titleMatchers, function(_, matcher) {
                var match = userTitle.match(matcher);
                if (!userName && match && match[1]) userName = match[1].trim();
            });

            if (!userName && userTitle) userName = userTitle.split('\n')[0].trim();
            if (!userName && userText) userName = userText.trim();
            return userName;
        };

        var getTable = function() {
            var table = $('#tblProtocolosBlocos').first();
            if (table.length) return table;
            table = $('#frmRelBlocoProtocoloLista #divInfraAreaTabela table.infraTable').first();
            return table;
        };

        var getSignatureColumnIndex = function(table) {
            var indexAssinatura = -1;
            var headerCells = table.find('thead tr:first th, thead tr:first td');
            if (!headerCells.length) headerCells = table.find('tr:first th, tr:first td');

            headerCells.each(function(index) {
                if (/^Assinaturas?$/i.test($(this).text().trim())) {
                    indexAssinatura = index;
                    return false;
                }
            });

            return indexAssinatura;
        };

        var toggleCheckbox = function($checkbox, checked) {
            if ($checkbox.prop('checked') !== checked) {
                $checkbox.trigger('click');
            }
        };

        var applySelection = function(type) {
            var table = getTable();
            var indexAssinatura = getSignatureColumnIndex(table);
            var usuario = normalize(getCurrentUserName());

            if (!table.length || indexAssinatura < 0) return false;

            table.find('tr').each(function() {
                var tr = $(this);
                var checkbox = tr.find('input[type="checkbox"]').first();
                var cells = tr.find('td');
                if (!checkbox.length || cells.length <= indexAssinatura) return;

                var assinatura = normalize(cells.eq(indexAssinatura).text());
                var hasAssinatura = assinatura.length > 0;
                var hasMinhaAssinatura = !!(usuario && hasAssinatura && assinatura.indexOf(usuario) !== -1);

                if (type === 'todos') toggleCheckbox(checkbox, true);
                if (type === 'nenhum') toggleCheckbox(checkbox, false);
                if (type === 'sem-assinatura') toggleCheckbox(checkbox, !hasAssinatura);
                if (type === 'sem-minha-assinatura') toggleCheckbox(checkbox, !hasMinhaAssinatura);
                if (type === 'com-minha-assinatura') toggleCheckbox(checkbox, hasMinhaAssinatura);
            });

            return true;
        };

        var render = function() {
            var table = getTable();
            var caption = $('#tblProtocolosBlocos caption.infraCaption').first();
            if (!caption.length) caption = table.find('caption.infraCaption').first();
            var toolbar = $('#frmRelBlocoProtocoloLista #divInfraBarraComandosSuperior').first();
            var target = caption.length ? caption : toolbar;

            if (!table.length || !target.length || target.find('.seiProSignatureSelection').length) {
                return false;
            }

            target.append(
                '<span class="seiProSignatureSelection">' +
                    '<span class="seiProSignatureSelection_label">Selecionar:</span>' +
                    '<a class="newLink" href="#" data-selection-signature="todos">Todos</a>' +
                    '<a class="newLink" href="#" data-selection-signature="nenhum">Nenhum</a>' +
                    '<a class="newLink" href="#" data-selection-signature="sem-assinatura">Sem assinatura</a>' +
                    '<a class="newLink" href="#" data-selection-signature="sem-minha-assinatura">Sem minha assinatura</a>' +
                    '<a class="newLink" href="#" data-selection-signature="com-minha-assinatura">Com minha assinatura</a>' +
                '</span>'
            );

            return true;
        };

        var start = function() {
            if (window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) return;
            if (typeof checkConfigValue !== 'function' || !checkConfigValue('selecaointeligenteblocoassinatura')) return;
            if (!$('#frmRelBlocoProtocoloLista').length || !$('#tblProtocolosBlocos').length || !$('#btnAssinar').length) return;
            if (!render()) return;

            $(document).off('click.seiProSignatureSelection').on('click.seiProSignatureSelection', '.seiProSignatureSelection a[data-selection-signature]', function(event) {
                event.preventDefault();
                applySelection($(this).attr('data-selection-signature'));
            });

            window.__SEI_PRO_SMART_SIGNATURE_SELECTION__ = true;
        };

        if (window.__SEI_PRO_CONFIG_READY__) {
            start();
        } else {
            window.addEventListener('sei-pro-config-ready', start, { once: true });
        }

        return true;
    };

    window.initGlobalSignatureBlockIndicatorPro = function initGlobalSignatureBlockIndicatorPro() {
        if (window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__) return false;

        var cacheKey = 'seiProSignatureBlocksIndicatorCache';
        var cacheTtlMs = 60 * 1000;

        var getTargetLinks = function() {
            return $('#infraMenu a[href*="acao=bloco_assinatura_listar"], #main-menu a[href*="acao=bloco_assinatura_listar"]');
        };

        var renderCount = function(count) {
            getTargetLinks().each(function() {
                var link = $(this);
                var badge = link.find('.seiProSignatureBlocksIndicator');
                if (!badge.length) {
                    badge = $('<span class="seiProSignatureBlocksIndicator is-zero"></span>');
                    link.append(badge);
                }

                if (count > 0) {
                    badge.text(count > 99 ? '99+' : String(count)).removeClass('is-zero');
                } else {
                    badge.text('').addClass('is-zero');
                }
            });
        };

        var getListUrl = function() {
            var menuLink = getTargetLinks().first().attr('href');
            if (menuLink) return menuLink;

            var url = new URL(window.location.href);
            url.search = '';
            url.hash = '';
            return url.pathname + '?acao=bloco_assinatura_listar';
        };

        var getCachedCount = function() {
            try {
                var cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
                if (!cached || !cached.key || !cached.updatedAt) return null;

                var cacheScope = [
                    window.location.host || '',
                    $('#lnkUsuarioSistema').attr('title') || '',
                    typeof siglaUnidadeAtual !== 'undefined' ? siglaUnidadeAtual : ''
                ].join('::');

                if (cached.key !== cacheScope) return null;
                if ((Date.now() - cached.updatedAt) > cacheTtlMs) return null;

                return cached.count;
            } catch (error) {
                return null;
            }
        };

        var setCachedCount = function(count) {
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    key: [
                        window.location.host || '',
                        $('#lnkUsuarioSistema').attr('title') || '',
                        typeof siglaUnidadeAtual !== 'undefined' ? siglaUnidadeAtual : ''
                    ].join('::'),
                    count: count,
                    updatedAt: Date.now()
                }));
            } catch (error) {}
        };

        var shouldEnable = function() {
            if (typeof checkConfigValue !== 'function') return true;
            return checkConfigValue('indicadorglobalblocoassinatura');
        };

        var fetchCount = function() {
            if (!shouldEnable()) {
                renderCount(0);
                return;
            }

            var url = getListUrl();
            if (!url) return;

            fetch(url, { credentials: 'same-origin' })
                .then(function(response) {
                    if (!response.ok) throw new Error('Falha ao consultar blocos de assinatura');
                    return response.text();
                })
                .then(function(html) {
                    var doc = new DOMParser().parseFromString(html, 'text/html');
                    var count = doc.querySelectorAll('#tblBlocos tbody tr td a[onclick*="acaoAssinar("]').length;
                    setCachedCount(count);
                    renderCount(count);
                })
                .catch(function(error) {
                    if (typeof verifyConfigValue === 'function' && verifyConfigValue('debugpage')) {
                        console.warn('Falha ao atualizar indicador global de blocos de assinatura:', error && error.message ? error.message : error);
                    }
                });
        };

        var start = function() {
            if (window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__) return;
            if (!getTargetLinks().length) return;

            var cachedCount = getCachedCount();
            if (cachedCount !== null) renderCount(cachedCount);
            fetchCount();
            window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__ = window.setInterval(fetchCount, cacheTtlMs);
        };

        $(function() {
            window.setTimeout(start, 300);
        });

        return true;
    };
})();
