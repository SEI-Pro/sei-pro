// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — page / iframe helpers.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */


export const sanitizeHTML = (html) => DOMPurify.sanitize(html, { 
    ADD_ATTR: ['target'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|chrome-extension|moz-extension):|[^a-z]|[a-z+\-.]+(?:[^a-z+\-.:]|$))/i
});

// FUNÇÃO PARA NORMALIZAR HTML (remover espaços e quebras de linha extras)
// normalizeHTML migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6

// FUNÇÃO PARA FORMATAR NUMERO EM DUAS CASAS DECIMAIS
export const format2Decimal = v => isNaN(v = +v) ? '0.00' : v.toFixed(2);

export function getIframeArvoreElement() {
    var ifrArvore = $('#ifrArvore');
    return (ifrArvore.length > 0 && typeof ifrArvore[0] !== 'undefined' && ifrArvore[0]) ? ifrArvore[0] : null;
}

export function getIframeArvoreWindow() {
    var ifrArvore = getIframeArvoreElement();
    return (ifrArvore && ifrArvore.contentWindow) ? ifrArvore.contentWindow : null;
}

// FUNÇÃO MÃE PARA CONTROLAR A EXECUÇÃO COM TIMEOUT E CHECAGENS
// FUNÇÃO GENÉRICA PARA INICIALIZAR COM TENTATIVAS E ATRASO, USADA PARA EVITAR ERROS EM DEPENDÊNCIAS QUE DEMORAM A CARREGAR
export const initWithRetry = ({
    timeout = 9000,
    interval = 500,
    debugLabel = '',
    condition = () => true,
    fnName = '',
    param = null
}) => {
    // INTERROMPE SE O TEMPO ESTIVER ESGOTADO
    if (timeout <= 0) return;

    // VERIFICA A CONDIÇÃO DEFINIDA
    if (typeof condition === 'function' && condition()) {
        try {
            if (typeof param === 'function') {
                // EXECUTA UMA FUNÇÃO ANÔNIMA DIRETAMENTE
                param();
            } else if (fnName && typeof window[fnName] === 'function') {
                // CHAMA UMA FUNÇÃO GLOBAL PELO NOME
                window[fnName](param);
            }
        } catch (error) {
            console.error(`Erro ao executar ${debugLabel || fnName}:`, error);
        }
    } else {
        // REAGENDA A CHAMADA COM O TEMPO REDUZIDO
        setTimeout(() => {
            initWithRetry({
                timeout: timeout - 100,
                interval,
                debugLabel,
                condition,
                fnName,
                param
            });

            if (
                typeof verifyConfigValue !== 'undefined' &&
                verifyConfigValue('debugpage')
            ) {
                console.log(`Reload ${debugLabel || fnName} => ${timeout}`);
            }
        }, interval);
    }
};

// [migrado para core/sei] getIsNewSEI

// FUNÇÃO PARA OBTER O NÚMERO DO PROCESSO
export const getNumProcesso = () => {
    const num_processo = $('#ifrArvore').length ? $('#ifrArvore').contents().find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim() : dadosProcessoPro.propProcesso.hdnProtocoloFormatado;
    return num_processo;
};

export const getIdProcedimento = () => {
    let id_procedimento = $("#ifrArvore").length ? getParamsUrlPro($("#ifrArvore").attr('src')).id_procedimento : getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = typeof id_procedimento === 'undefined' ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
    return id_procedimento ?? false;
};

export function setCaretPosition(elem, caretPos) {
    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else {
                elem.focus();
            }
        }
    }
}
export function getIsProcUrgente() {
    isProcUrgente = typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.propProcesso.txtDescricao !== 'undefined' ? dadosProcessoPro.propProcesso.txtDescricao : false;
    isProcUrgente = typeof isProcUrgente !== 'undefined' && isProcUrgente && isProcUrgente.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
    return isProcUrgente;
}
export function dropzoneCancelInfo(e) {
    if (typeof e !== 'undefined'){
        e.stopImmediatePropagation();
    }
    $(containerUpload).removeClass('dz-drag-hover');
    return false;
}
export function encodeUrlUploadArvore(response, params) {
    var id = response[0];
    var nome = response[1];
    var dthora = response[4];
    var tamanho = response[3];
    var tamanho_formatado = infraFormatarTamanhoBytes(parseInt(tamanho));
    var plus = '\u00B1';
    var hdnAnexos = id+plus+nome+plus+dthora+plus+tamanho+plus+tamanho_formatado+plus+params.userUnidade.user+plus+params.userUnidade.unidade;
        hdnAnexos = (hdnAnexos.indexOf(' ') !== -1) ? hdnAnexos.replace(/ /g,'+') : hdnAnexos;
        hdnAnexos = encodeURIComponent(hdnAnexos);
        hdnAnexos = (hdnAnexos.indexOf('%C2') !== -1) ? hdnAnexos.replace(/%C2/g,'') : hdnAnexos;
        hdnAnexos = (hdnAnexos.indexOf('%2B') !== -1) ? hdnAnexos.replace(/%2B/g,'+') : hdnAnexos;
    return hdnAnexos;
}
export function getConfigHost(callback = false, callback_else = false) {
    var hosts = URL_SPRO+"config_hosts.json";
        fetch(hosts)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => setConfigHost(json, callback, callback_else));
}
export function setConfigHost(host, callback, callback_else, save = true){
    var set_host = false;
    if (typeof host !== 'undefined' && host !== null &&typeof host.matches !== 'undefined' && host.matches !== null && host.matches.length > 0) {
        for (i = 0; i < host.matches.length; i++) {
            if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
        }
    }
    if (set_host && typeof callback === 'function') {
        callback();
    } else if (!set_host && typeof callback_else === 'function') {
        callback_else();
    }
    if (save) sessionStorage.setItem('configHost_Pro', JSON.stringify(host));
}
export function initUrlExtension(url) {
    if (typeof getUrlExtension === 'function') {
        return getUrlExtension(url);
    } else if (typeof URL_SPRO !== 'undefined') {
        return URL_SPRO+url;
    }
}
export function calcFilterResume(table) {
    table.find('.filterResume').each(function(){
        var data = $(this).data();
        var total = $('.filterResume_'+data.resumetype+':visible').map(function(v){ if ($(this).text() != '') return parseFloat($(this).text()); }).get();
        var count = $('.filterResume_'+data.resumetype+':visible').map(function(v){ if ($(this).text() != '') return $(this).text().trim(); }).get();
        var dist = (count.length > 0) ? uniqPro(count).length : 0;
        var sum = total.reduce(function(a, b) { return a + b; }, 0);
        var avg = (sum/total.length) || 0;
        var result = (data.resumemod == 'avg') ? avg.toFixed(2)+' <sup>[MED]</sup>' : sum.toFixed(2)+' <sup>[TOTAL]</sup>';
            result = (data.resumemod == 'dist') ? dist+' <sup>[DIST]</sup>' : result;
        $(this).html(result);
    })
}
export function checkProcessoSigiloso(content = $('html')) {
    var id_protocolo = getParamsUrlPro(window.location.href).id_procedimento;
    var check = content.find('script').map(function(v){ if(typeof $(this).attr('src') == 'undefined' && $(this).html().indexOf('usuario_validar_acesso') !== -1) { return true; } }).get();
        check = check.length ? check[0] : false;
    var checkSession = (typeof id_protocolo !== 'undefined' && sessionStorageRestorePro('processo_sigiloso_'+id_protocolo) !== null) ? true : false;
    var _return = (checkSession || check) ? true : false;
    return _return;
}
export function getStylesOnEditor() {
    var styles = false;
    $('script').each(function(){
        if (typeof $(this).attr('src') == 'undefined' && $(this).html().indexOf('stylesheetParser_validSelectors') !== -1) {
            var text = $(this).html();
                styles = text.indexOf('/') === -1 ? false : $.map(text.split('/'), function(v) {
                    return (v.indexOf('(') !== -1) ? v.replace('(p)','').match(/\(([^)]+)\)/) : null;
                });
                styles = styles ? styles.map(function(v){ return v.replace("(","").replace(")","") }) : false;
                styles = styles ? styles.join('|').replace(":before","").replace('||','|').replace(/\\r\\n/g, '') : false;
                styles = styles && styles.indexOf('|') !== -1 ? uniqPro(styles.split('|')) : false;
                styles = styles ? styles.filter(function(v){ return v.indexOf('before') === -1 }) : false;
        }
    });
    if (styles) {
        setOptionsPro('stylesEditor',styles);
    } else {
        removeOptionsPro('stylesEditor');
    }
}
export function filterTextExtractDate(elem, table, cellIndex) {
    var text = $(elem).text();
    if ($(table).find('tr.tablesorter-headerRow th.tablesorter-header[data-column="'+cellIndex+'"]').text().toLowerCase().indexOf('data') !== -1) {
        text = (text.indexOf(':') !== -1) ? moment(text, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : moment(text, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    return text;
}
export var romanToInt = function(s) {
    const mapRoman=new Map();
    mapRoman.set('I', 1);
    mapRoman.set('V', 5);
    mapRoman.set('X', 10);
    mapRoman.set('L', 50);
    mapRoman.set('C', 100);
    mapRoman.set('D', 500);
    mapRoman.set('M', 1000);
    var result=0;
    if(s){
        var s1=s.split('');
        s1.forEach(function(e,i){
            result += mapRoman.get(e) < mapRoman.get(s1[i+1]) ? -mapRoman.get(e) : mapRoman.get(e);
        });
    }
    return result;
}
function insertFontIcon(elementTo, target = $('html')) {
    var pathExtension = URL_SPRO;
    if ( target, target.find('link[data-style="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            "data-style": "seipro-fonticon",
            href: initUrlExtension("css/fontawesome.pro.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="1">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-solid-900.woff2) format("woff2") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-regular-400.woff2) format("woff2") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Duotone\";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.woff2) format("woff2") !important;\n'+
                            '   }\n'
                            '</style>';
        target.find('head').append(htmlStyleFont);
    }
    if (localStorage.getItem('seiSlim_editor')) {
        $('body').addClass('seiSlim seiSlim_parent seiSlim_view');
    }
}
// numberToLetter migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// decimalHourToMinute migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
export function reloadModalLink() {
    // Big-bang isolated: modalLink já é carregado eager via manifest. Recarregá-lo
    // via $.getScript(src do DOM) cairia no globalEval do jQuery, bloqueado pela
    // CSP da extensão no mundo isolado. Sai cedo quando já presente.
    if (typeof $.modalLink !== 'undefined') return;
    var urlModalink = $('head').find('script[src*="modalLink"]');
        urlModalink = (typeof urlModalink !== 'undefined') ? urlModalink.attr('src') : false;
    if (urlModalink) {
        $.getScript(urlModalink);
    }
}
// [migrado para core/sei] loadStylePro
export function checkLoadJqueryUI(callback = false) {
    if (typeof jQuery.ui === 'undefined')  {
        $.getScript(URL_SPRO+"js/lib/jquery-ui.min.js", function(){
            if (typeof callback === 'function') callback();
        });
        loadStylePro(URL_SPRO+'css/jquery-ui.css');
    } else if (typeof callback === 'function') {
        callback();
    }
}
export function checkValue(elem) {
    var len = (typeof elem.val() !== 'undefined' && elem.val() !== null) ? elem.val().trim().length : 0;
    return (len > 0) ? true : false;
}
// isJson migrada para SeiPro.core.serial (src/core/serial.js) — Fase 6
// tryParseJsonObject migrada para SeiPro.core.serial (src/core/serial.js) — Fase 6
// [migrado para core/helpers.js] trycatch
// avgArray migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// convertJsonBools migrada para SeiPro.core.serial (src/core/serial.js) — Fase 6
// [migrado para core/helpers.js] zeroWidthTrim
export function goToTextInDoc(pesquisaTexto) {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    var urlDoc = ifrArvoreHtml.attr('src');
        urlDoc = (urlDoc.indexOf('#') !== -1) ? urlDoc.split('#')[0] : urlDoc;
        ifrArvoreHtml.attr('src', urlDoc+'#:~:text='+encodeURIComponent(pesquisaTexto));
}
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
// extractEmails migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// extractCPFs migrada para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
// extractHexColor migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// arrayMax migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// validaCPF migrada para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
export function getChartLabelItemStore(idElem, chartObj){
    if (getOptionsPro(idElem+'_canvas')){
        var arrayLabels = getOptionsPro(idElem+'_canvas');
            arrayLabels.forEach(function(value, i) {
                // console.log({type: typeof chartObj.getDatasetMeta(0), meta: chartObj.getDatasetMeta(0), obj: chartObj});
                if (typeof chartObj.getDatasetMeta(0) === 'object') {
                    var _meta = (chartObj.config.type == 'pie' || chartObj.config.type == 'doughnut' || chartObj.config.type == 'line') 
                        ? (typeof chartObj.getDatasetMeta(0).data[value.index] !== 'undefined' ? chartObj.getDatasetMeta(0).data[value.index] : false)
                        : (typeof chartObj.getDatasetMeta(value.index) !== 'undefined' ? chartObj.getDatasetMeta(value.index) : false);

                    // console.log(idElem, typeof _meta, i, _meta);
                    if (_meta && typeof _meta === 'object' && typeof _meta.hidden !== 'undefined' && (value.hidden || value.hidden === null)) {
                        _meta.hidden = (value && value.hasOwnProperty('hidden') ? value.hidden : null);
                    }
                }
            });
            chartObj.update();
    }
}
export function replaceTextToProcessoSEI(text) {
    var Rexp = /(\d{5}\.?\d{6}\/?\d{4}\-?\d{2})/igm;
    var urlSEI = url_host.replace('controlador.php','');
    return text.replace(Rexp, "<a href='"+urlSEI+"#$1' target='_blank'>$1</a>");
}
// normalizeMojibakeUtf8 e replaceTextToUrl migradas para SeiPro.core.texto (src/core/texto.js) \u2014 Fase 6
// maskCNPJ, maskCPF, maskPEN migradas para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
export function setChartLabelItemStore(e, legendItem){
    var ci = this.chart;
    var is_line = (typeof legendItem.datasetIndex !== 'undefined') ? true : false;
    var index = (is_line) ? legendItem.datasetIndex : legendItem.index;
    var _meta = (is_line) ? ci.getDatasetMeta(index) : ci.getDatasetMeta(0).data[index];
    var _metas = (is_line) ? ci.data.datasets : ci.data.datasets[0].data;

    var alreadyHidden = (_meta.hidden === null) ? false : _meta.hidden;  
    if (alreadyHidden) {
        _meta.hidden = null;
    } else {
        _meta.hidden = true;
    }
    
    var arrayMetaChart = [];
    _metas.forEach(function(e, i) {
        var meta = (is_line) ? ci.getDatasetMeta(i) : ci.getDatasetMeta(0).data[i];
        arrayMetaChart.push({index: i, hidden: meta.hidden});
    });
    // console.log(arrayMetaChart);

    ci.update();
    setOptionsPro($(this.chart.canvas).attr('id'), arrayMetaChart);
}
// extractAllTextBetweenQuotes migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
export function appendDebugReport(comAnimacao = false) {
    if (!isSEIProPRFHost()) {
        $('.iconDebugScreen').remove();
        return;
    }
    var animacao = comAnimacao ? 'animation: 2s ease 0s infinite normal none running whitepulser;' : '';
    var tooltip = comAnimacao ? 'Erro detectado - clique para notificar' : 'Reportar problema ou sugest\u00E3o';
    var htmlIconDebug = '<i data-act="atividades-call" data-fn="dialogDebugScreen" data-pass-el="0" data-tip="'+tooltip+'" class="fas fa-bug brancoColor iconDebugScreen" style="float:none;font-size:14pt;margin-left:0;cursor:pointer;opacity:1;border-radius:50%;line-height:1;transition:color .15s ease,opacity .15s ease;'+animacao+'"></i>';
    $('.iconDebugScreen').remove();
    $('div[data-ref="infraAcaoBarraSistema"]').append(htmlIconDebug);
}
export function userTyped(this_) {
    $(this_).data('user-typed', ($(this_).val().trim() == '' ? false : true));
}
