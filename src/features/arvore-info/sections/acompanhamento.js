/**
 * Seção "Acompanhamento Especial" do painel infoarvore (Etapa D — split por seção).
 * Render READ + remoção inline (via submitViaIframe). A EDIÇÃO/adição (editAcompInline)
 * fica em index.js (acoplada ao scaffolding compartilhado de editores) e re-renderiza
 * por meio do registry `refreshers` (refreshSection('acomp')).
 *
 * ctx = { doc, acompPanel, findToolbarLink, getToolbarLinks, fetchPage, invalidatePage,
 *         submitViaIframe, refreshSection, refreshers, sectionEnabled, log, warn, err, report }
 */
// Parsing PURO do documento de acompanhamento especial (só LÊ docA). Testável jsdom. VERBATIM.
export function parseAcompItems(docA) {
    var rows = docA.querySelectorAll('table.infraTable tr');
    var items = [];
    for (var r = 1; r < rows.length; r++) {
        var tds = rows[r].querySelectorAll('td');
        if (tds.length < 3) continue;
        var acompId = null;
        var exLink = rows[r].querySelector('a[onclick*="acaoExcluir"]');
        if (exLink) {
            var idM = exLink.getAttribute('onclick').match(/acaoExcluir\((\d+)/);
            if (idM) acompId = idM[1];
        }
        if (!acompId) {
            var chk = rows[r].querySelector('input[type="checkbox"][name*="chk"]');
            if (chk) acompId = chk.value;
        }
        items.push({
            id: acompId,
            grupo: (tds[1].textContent || '').trim(),
            obs: (tds[2].textContent || '').trim(),
            user: tds[3] ? (tds[3].textContent || '').trim() : '',
            date: tds[4] ? (tds[4].textContent || '').trim() : ''
        });
    }
    return items;
}

export function installAcompanhamentoSection(ctx) {
    var doc = ctx.doc, acompPanel = ctx.acompPanel;
    var findToolbarLink = ctx.findToolbarLink, getToolbarLinks = ctx.getToolbarLinks;
    var fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage, submitViaIframe = ctx.submitViaIframe;
    var refreshSection = ctx.refreshSection, refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;

    var acompBody = acompPanel.querySelector('.seipro-acomp-body');
    var acompUrl = findToolbarLink('acompanhamento_gerenciar')
                || findToolbarLink('acompanhamento_listar')
                || findToolbarLink('acompanhamento_cadastrar')
                || findToolbarLink('acompanhamento_alterar');
    function renderAcompItemRow(it) {
        var row = doc.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;';
        var txt = it.obs + (it.grupo ? (it.obs ? ' ' : '') + '(' + it.grupo + ')' : '');
        var a = doc.createElement('a');
        a.className = 'newLink seipro-copy';
        a.style.cssText = 'cursor:pointer;flex:1;white-space:pre-wrap;';
        a.textContent = txt || '(em acompanhamento)';
        row.appendChild(a);
        if (it.id) {
            var btn = doc.createElement('a');
            btn.className = 'newLink';
            btn.title = 'Remover acompanhamento especial';
            btn.style.cssText = 'cursor:pointer;color:#c00;flex-shrink:0;';
            btn.innerHTML = '<i class="fas fa-times"></i>';
            btn.addEventListener('click', function () {
                if (btn.style.opacity === '0.4') return;
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
                submitViaIframe(acompUrl, function (w, d2) {
                    var removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoExcluir"]'))
                        .find(function (a) {
                            var oc = a.getAttribute('onclick') || '';
                            return oc.indexOf('acaoExcluir(' + it.id) !== -1 || oc.indexOf("acaoExcluir('" + it.id + "'") !== -1;
                        });
                    if (removeLink) {
                        removeLink.click();
                    } else if (typeof w.acaoExcluir === 'function') {
                        w.acaoExcluir(it.id, it.obs || it.grupo || '');
                    } else {
                        var chks = d2.querySelectorAll('input[type="checkbox"]');
                        for (var c = 0; c < chks.length; c++) { chks[c].checked = (chks[c].value == it.id); }
                        var f = d2.querySelector('form'); if (f) f.submit();
                    }
                }).then(function () {
                    refreshSection('acomp', 'post-remove acomp');
                }).catch(function (e) {
                    err('acomp remove:', e.message);
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = '';
                });
            });
            row.appendChild(btn);
        }
        return row;
    }
    function renderAcomp() {
        invalidatePage(acompUrl);
        acompBody.innerHTML = '<span style="opacity:0.6">carregando…</span>';
        fetchPage(acompUrl).then(function (docA) {
            var items = parseAcompItems(docA);
            acompBody.innerHTML = '';
            if (!items.length) {
                acompBody.innerHTML = '<span style="opacity:0.6">(não está em acompanhamento especial)</span>';
                return;
            }
            items.forEach(function (it) { acompBody.appendChild(renderAcompItemRow(it)); });
        }).catch(function (e) {
            acompBody.innerHTML = '<span class="infoAlerta">(falha ao carregar)</span>';
            report('infoarvore_acomp: fetch failed', { error: e.message, url: acompUrl });
        });
    }
    refreshers.acomp = renderAcomp;
    if (!acompUrl) {
        acompBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
        var names = getToolbarLinks().map(function (l) { return (l.url.match(/acao=([^&]+)/) || [])[1]; }).filter(Boolean);
        warn('infoarvore_acomp: no acompanhamento_* toolbar link. Toolbar actions:', names.join(', '));
    } else if (sectionEnabled('acompanhamento_especial')) renderAcomp();
    else log('infoarvore_acomp: skipped (section disabled by user)');
}
