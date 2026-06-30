/**
 * Controlar Prazos — IO (fronteira de entrada/saída).
 * LEITURA do DOM/HTML nativo do SEI (parse de linha → prazoInfo, href hasheado) +
 * REDE (resolve/relê o prazo nativo via fetch) + preenchimento do FORM nativo.
 * Globais consumidos ($, moment, getParamsUrlPro, parseControlePrazoNativo,
 * extractGroupTableTooltipToArray, divComandos, removeAcentos) resolvem do escopo
 * global do mundo isolado. Relocado verbatim (split domain/io/view).
 */
export function getControlePrazoNativeInfo(row) {
    var _row = $(row);
    var nativeLink = _row.find('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]').first();
    if (nativeLink.length == 0) {
        nativeLink = _row.find('img[src*="controle_prazo"]').first().closest('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]');
        if (nativeLink.length == 0) {
            nativeLink = _row.find('img[src*="controle_prazo"]').first();
        }
    }
    if (nativeLink.length == 0) {
        return false;
    }

    var nativeAnchor = nativeLink.closest('a');
    var href = nativeLink.attr('href') || nativeAnchor.attr('href') || '';
    var onmouseover = nativeLink.attr('onmouseover') || nativeAnchor.attr('onmouseover') || nativeLink.attr('title') || nativeAnchor.attr('title') || '';
    var tooltipArray = extractGroupTableTooltipToArray(onmouseover);
    var tooltip = (tooltipArray && tooltipArray.length > 0 && tooltipArray[0] != '') ? tooltipArray[0] : onmouseover;
    var src = nativeLink.attr('src') || nativeLink.find('img').attr('src') || nativeAnchor.find('img').attr('src') || '';
    var prazoInfo = (typeof parseControlePrazoNativo === 'function') ? parseControlePrazoNativo(tooltip, src) : false;

    if (!prazoInfo || (!prazoInfo.dateDue && !prazoInfo.dateFinished)) {
        return false;
    }

    var params = getParamsUrlPro(href);
    prazoInfo.id_controle_prazo = (params && typeof params.id_controle_prazo !== 'undefined') ? params.id_controle_prazo : false;
    prazoInfo.id_procedimento = (params && typeof params.id_procedimento !== 'undefined') ? params.id_procedimento : false;
    prazoInfo.href = href;
    prazoInfo.tooltip = tooltip;
    prazoInfo.src = src;
    prazoInfo.nativeLink = nativeAnchor.length > 0 ? nativeAnchor : nativeLink;
    return prazoInfo;
}
export function getControlePrazoNativeHref(row, id_procedimento, id_controle_prazo = false, allowFallback = true) {
    var _row = $(row);
    var nativeLink = _row.find('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]').first();
    var href = nativeLink.attr('href') || nativeLink.closest('a').attr('href') || '';
    if (!href) {
        var comandoNative = $(divComandos+' a[href*="acao=controle_prazo_definir"], '+divComandos+' a[onclick*="controle_prazo_definir"]').first();
        href = comandoNative.attr('href') || comandoNative.closest('a').attr('href') || comandoNative.attr('onclick') || '';
        if (href) {
            var hrefMatch = href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g'));
            href = (hrefMatch && hrefMatch.length > 0) ? hrefMatch[0] : href;
        }
    }
    // Sem fallback de URL construída à mão: o SEI assina a querystring com infra_hash,
    // então uma URL sem hash é rejeitada (cai na tela de login). Se não houver link
    // nativo disponível, devolvemos '' e o chamador trata como "form indisponível".
    if (href && id_controle_prazo && href.indexOf('id_controle_prazo=') === -1) {
        href = href + (href.indexOf('?') === -1 ? '?' : '&') + 'id_controle_prazo=' + id_controle_prazo;
    }
    return href;
}

// Resolve o link hasheado de "Definir Controle de Prazo" de um processo SEM prazo.
// O SEI assina a URL com infra_hash, então é preciso obtê-la do próprio SEI:
// GET procedimento_trabalhar (frameset) -> src do frame procedimento_visualizar ->
// GET visualizar -> href da toolbar controle_prazo_definir. Retorna Promise<string|false>.
export function fetchControlePrazoDefinirHref(trabalharHref) {
    if (!trabalharHref) return Promise.resolve(false);
    var absTrab;
    try { absTrab = new URL(trabalharHref, location.href).href; } catch (e) { return Promise.resolve(false); }
    return fetch(absTrab, { credentials: 'include' })
        .then(function(r){ return r.text(); })
        .then(function(html){
            var m = html.match(/src="([^"]*procedimento_visualizar[^"]*)"/i);
            if (!m) return false;
            var visUrl = new URL(m[1].replace(/&amp;/g, '&'), absTrab).href;
            return fetch(visUrl, { credentials: 'include' })
                .then(function(r){ return r.text(); })
                .then(function(vhtml){
                    var lm = vhtml.match(/href="([^"]*controle_prazo_definir[^"]*)"/i);
                    return lm ? new URL(lm[1].replace(/&amp;/g, '&'), visUrl).href : false;
                });
        })
        .catch(function(){ return false; });
}
// Re-lê o prazo nativo (fonte da verdade) de um processo após gravar, para obter a
// data de vencimento CALCULADA pelo SEI (relevante no modo "dias"/dias úteis, onde não
// dá para inferir client-side). Mesmos 2 fetches do resolver de href; parseia o ícone
// controle_prazo via getControlePrazoNativeInfo (mesma lógica do read da coluna).
// Retorna Promise<prazoInfo|false>.
export function fetchControlePrazoNativeInfo(trabalharHref) {
    if (!trabalharHref) return Promise.resolve(false);
    var absTrab;
    try { absTrab = new URL(trabalharHref, location.href).href; } catch (e) { return Promise.resolve(false); }
    return fetch(absTrab, { credentials: 'include' })
        .then(function(r){ return r.text(); })
        .then(function(html){
            var m = html.match(/src="([^"]*procedimento_visualizar[^"]*)"/i);
            if (!m) return false;
            var visUrl = new URL(m[1].replace(/&amp;/g, '&'), absTrab).href;
            return fetch(visUrl, { credentials: 'include' })
                .then(function(r){ return r.text(); })
                .then(function(vhtml){
                    // Só o ÍCONE DE STATUS (controle_prazo1/2.svg) carrega data no tooltip;
                    // o controle_prazo_gerenciar.svg é a AÇÃO da toolbar (sem data) e deve ser ignorado.
                    var block = vhtml.match(/<a\b[^>]*controle_prazo_definir[^>]*>\s*<img\b[^>]*src="[^"]*controle_prazo[12]\.svg[^"]*"[^>]*>/i);
                    if (!block) return false;
                    return getControlePrazoNativeInfo($('<div>').html(block[0].replace(/&amp;/g, '&') + '</a>')) || false;
                });
        })
        .catch(function(){ return false; });
}
// Localiza recursivamente o documento (mesmo em frame aninhado) que contém o
// formulário nativo de controle de prazo.
export function findControlePrazoFormDoc(doc) {
    try {
        if (doc && doc.getElementById && doc.getElementById('frmControlePrazoCadastro')) return doc;
        var frames = (doc && doc.querySelectorAll) ? doc.querySelectorAll('iframe, frame') : [];
        for (var i = 0; i < frames.length; i++) {
            try {
                var sub = findControlePrazoFormDoc(frames[i].contentDocument);
                if (sub) return sub;
            } catch (e) {}
        }
    } catch (e) {}
    return null;
}
// Preenche o formulário nativo no documento do iframe (clica o rádio para disparar
// o onclick do SEI que habilita os campos, depois preenche data/dias/dias úteis).
export function fillNativeControlePrazoFormDoc(fdoc, mode, dateRef, daysRef, daysUteis) {
    var radioId = (mode === 'concluir') ? 'optConcluir' : (mode === 'dias') ? 'optDias' : 'optDataCerta';
    var radio = fdoc.getElementById(radioId);
    if (radio) {
        radio.checked = true;
        try { radio.click(); } catch (e) {}
    }
    if (mode === 'data') {
        var t = fdoc.getElementById('txtPrazo');
        if (t) t.value = moment(dateRef, 'YYYY-MM-DD').format('DD/MM/YYYY');
    } else if (mode === 'dias') {
        var d = fdoc.getElementById('txtDias');
        if (d) d.value = String(parseInt(daysRef, 10));
        var c = fdoc.getElementById('chkSinDiasUteis');
        if (c) c.checked = !!daysUteis;
    }
}
export function findControlePrazoSalvarBtn(fdoc) {
    var btns = fdoc.querySelectorAll('button, input[type=submit], input[type=button]');
    for (var i = 0; i < btns.length; i++) {
        var label = (btns[i].value || btns[i].textContent || '').trim();
        if (/salvar/i.test(label)) return btns[i];
    }
    var form = fdoc.getElementById('frmControlePrazoCadastro');
    return form ? (form.querySelector('button[type=submit], input[type=submit]') || null) : null;
}
