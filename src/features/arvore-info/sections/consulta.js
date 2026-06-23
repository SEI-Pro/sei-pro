import { acessoLabel, splitInteressado } from '../parse/consulta.js';

/**
 * Seção "Consulta" do painel infoarvore (Etapa D — split por seção).
 * Lê a página procedimento_alterar/consultar e popula 5 sub-seções READ-ONLY:
 * Tipo de Processo, Nível de Acesso, Assuntos, Observações, Interessados.
 *
 * É view (DOM): recebe um `ctx` com os elementos de painel e as dependências de
 * runtime (fetch/toolbar/refreshers/logger). A lógica PURA (mapa de acesso, split
 * de interessados) vem de parse/consulta.js. VERBATIM do legado.
 *
 * ctx = { doc, intPanel, tipoPanel, acessoPanel, assuntosPanel, obsPanel,
 *         findToolbarLink, fetchPage, invalidatePage, refreshers, sectionEnabled,
 *         log, warn, report }
 */
export function installConsultaSection(ctx) {
    var doc = ctx.doc;
    var intPanel = ctx.intPanel, tipoPanel = ctx.tipoPanel, acessoPanel = ctx.acessoPanel,
        assuntosPanel = ctx.assuntosPanel, obsPanel = ctx.obsPanel;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var log = ctx.log, warn = ctx.warn, report = ctx.report;

    var intBody = intPanel.querySelector('.seipro-interessados-body');
    // Prefer "procedimento_alterar" — form layout includes #txaObservacoes. Fall back to consultar (read-only).
    var consultaUrl = findToolbarLink('procedimento_alterar') || findToolbarLink('procedimento_consultar');
    if (!consultaUrl) {
        warn('infoarvore_interessados: consulta link not found');
        intBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        tipoPanel.querySelector('.seipro-tipo-body').innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        acessoPanel.querySelector('.seipro-acesso-body').innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        assuntosPanel.querySelector('.seipro-assuntos-body').innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        obsPanel.querySelector('.seipro-obs-body').innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        refreshers.consulta = function () {
            var msg = '<span style="opacity:0.6">(indisponível)</span>';
            intBody.innerHTML = msg;
            tipoPanel.querySelector('.seipro-tipo-body').innerHTML = msg;
            acessoPanel.querySelector('.seipro-acesso-body').innerHTML = msg;
            assuntosPanel.querySelector('.seipro-assuntos-body').innerHTML = msg;
            obsPanel.querySelector('.seipro-obs-body').innerHTML = msg;
        };
        return;
    }

    function setSectionText(panelBody, text, emptyText) {
        panelBody.innerHTML = '';
        if (text) {
            var a = doc.createElement('a');
            a.className = 'newLink seipro-copy';
            a.style.cssText = 'cursor:pointer;max-width:calc(100% - 70px);';
            a.textContent = text;
            panelBody.appendChild(a);
        } else {
            panelBody.innerHTML = '<span style="opacity:0.6">' + (emptyText || '(indisponível)') + '</span>';
        }
    }

    function appendCopyRow(panelBody, text) {
        var row = doc.createElement('div');
        var a = doc.createElement('a');
        a.className = 'newLink seipro-copy';
        a.style.cssText = 'cursor:pointer;display:block;max-width:calc(100% - 70px);';
        a.textContent = text;
        row.appendChild(a);
        panelBody.appendChild(row);
    }

    function getSelectedOptionText(docA, selector) {
        var el = docA.querySelector(selector);
        var opt = el && (el.querySelector('option[selected]') || (el.options && el.options[el.selectedIndex]));
        return {
            element: el,
            text: opt ? opt.textContent.trim() : ''
        };
    }

    function getAcessoText(docA) {
        var rdo = docA.querySelector('input[name="rdoNivelAcesso"]:checked');
        var hipoteseText = '';
        if (rdo && rdo.value === '1') {
            var hipSel = docA.getElementById('selHipoteseLegal');
            var hipOpt = hipSel && (hipSel.querySelector('option[selected]') || (hipSel.options && hipSel.options[hipSel.selectedIndex]));
            if (hipOpt && hipOpt.textContent.trim()) hipoteseText = hipOpt.textContent.trim();
        }
        return { text: acessoLabel(rdo ? rdo.value : null, hipoteseText), element: rdo };
    }

    function getOptionTexts(docA, selector) {
        var nodes = docA.querySelectorAll(selector);
        var items = [];
        nodes.forEach(function (o) {
            var txt = (o.textContent || '').trim();
            if (txt) items.push(txt);
        });
        return items;
    }

    function getInteressadosTexts(docA) {
        var opts = docA.querySelectorAll('#selInteressadosProcedimento option, #selInteressados option');
        var items = [];
        for (var i = 0; i < opts.length; i++) {
            var name = (opts[i].textContent || '').trim();
            if (!name) continue;
            splitInteressado(name).forEach(function (part) {
                items.push(part);
            });
        }
        return items;
    }

    function renderConsultaSections(docC) {
        // --- Tipo de Processo
        var tipoBody = tipoPanel.querySelector('.seipro-tipo-body');
        var tipoData = getSelectedOptionText(docC, '#selTipoProcedimento');
        var tipoName = tipoData.text;
        setSectionText(tipoBody, tipoName, '(indisponível)');
        if (!tipoName) report('infoarvore_consulta: Tipo de Processo unavailable in fetched form', { hasSelTipo: !!tipoData.element });

        // --- Nível de Acesso
        var acessoBody = acessoPanel.querySelector('.seipro-acesso-body');
        var acessoData = getAcessoText(docC);
        var acessoTxt = acessoData.text;
        setSectionText(acessoBody, acessoTxt, '(indisponível)');
        if (!acessoTxt) report('infoarvore_consulta: Nível de Acesso unavailable', { hasRdo: !!acessoData.element });

        // --- Assuntos
        var assBody = assuntosPanel.querySelector('.seipro-assuntos-body');
        var assOpts = getOptionTexts(docC, '#selAssuntos option');
        assBody.innerHTML = '';
        if (!assOpts.length) { assBody.innerHTML = '<span style="opacity:0.6">(sem assuntos)</span>'; }
        else {
            assOpts.forEach(function (txt) { appendCopyRow(assBody, txt); });
        }

        // --- Observações
        var obsBody = obsPanel.querySelector('.seipro-obs-body');
        var obsTA = docC.getElementById('txaObservacoes');
        var obsVal = obsTA ? (obsTA.value || obsTA.textContent || '').trim() : '';
        setSectionText(obsBody, obsVal, '(sem observações)');
        if (obsBody.firstChild && obsVal) obsBody.firstChild.style.whiteSpace = 'pre-wrap';

        // --- Interessados
        var opts = getInteressadosTexts(docC);
        intBody.innerHTML = '';
        if (!opts.length) { intBody.innerHTML = '<span style="opacity:0.6">(sem interessados)</span>'; log('infoarvore_interessados: empty'); return; }
        opts.forEach(function (part) { appendCopyRow(intBody, part); });

        log('infoarvore_consulta: tipo="' + tipoName + '" acesso="' + acessoTxt + '" assuntos=' + assOpts.length + ' obs.len=' + obsVal.length);
        log('infoarvore_interessados: populated', opts.length, 'interessado(s)');
    }

    function renderConsulta() {
      invalidatePage(consultaUrl);
      fetchPage(consultaUrl).then(function (docC) {
        renderConsultaSections(docC);
      }).catch(function (e) {
        var msg = '<span class="infoAlerta">(falha ao carregar)</span>';
        intBody.innerHTML = msg;
        tipoPanel.querySelector('.seipro-tipo-body').innerHTML = msg;
        acessoPanel.querySelector('.seipro-acesso-body').innerHTML = msg;
        assuntosPanel.querySelector('.seipro-assuntos-body').innerHTML = msg;
        obsPanel.querySelector('.seipro-obs-body').innerHTML = msg;
        report('infoarvore_consulta: fetch failed — 5 sections (Tipo/Acesso/Assuntos/Obs/Interessados) shown as "(falha ao carregar)"', { error: e.message, url: consultaUrl });
      });
    }
    refreshers.consulta = renderConsulta;
    // Consulta fetch feeds 5 sections; skip only if all 5 are disabled.
    var consultaSections = ['interessados', 'tipo_procedimento', 'nivel_acesso', 'assuntos', 'observacoes'];
    if (consultaSections.some(sectionEnabled)) renderConsulta();
    else log('infoarvore_consulta: skipped (all 5 dependent sections disabled by user)');
}
