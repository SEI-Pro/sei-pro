// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { parseAcaoRemoverId } from '../parse/marcador.js';
import { forceTrueConfirm } from '../dom/confirm.js';

/**
 * Seção "Marcador" do painel infoarvore (Etapa D — split por seção).
 * Render READ + remoção inline (via submitViaIframe + forceTrueConfirm). A adição
 * (openInlineEditor no clique do lápis) fica em index.js e re-renderiza via refreshers.
 *
 * ctx = { doc, marcPanel, findToolbarLink, fetchPage, invalidatePage, submitViaIframe,
 *         refreshSection, refreshers, sectionEnabled, log, warn, err, report }
 */
// Parsing PURO do documento de marcadores (SEI 4.1+ tabela / fallback form single).
// Só LÊ docM → testável com jsdom. VERBATIM.
export function parseMarcadorItems(docM) {
    var items = [];
    // SEI 4.1+: table-of-marcadores layout (one row per marcador).
    var rows = docM.querySelectorAll('table.infraTable tr');
    for (var r = 1; r < rows.length; r++) { // skip header
        var tds = rows[r].querySelectorAll('td');
        if (tds.length < 4) continue;
        var img = tds[1].querySelector('img');
        var remA = rows[r].querySelector('a[onclick*="acaoRemover"]');
        var remMatch = remA ? parseAcaoRemoverId(remA.getAttribute('onclick')) : null;
        var tagA = tds[1].querySelector('a[title]');
        items.push({
            id: remMatch,
            iconSrc: img ? img.getAttribute('src') : null,
            tag: (tagA && tagA.getAttribute('title')) || (tds[1].textContent || '').trim(),
            note: (tds[2].textContent || '').trim(),
            user: (tds[3].textContent || '').trim()
        });
    }
    // Legacy fallback: single-marcador form layout.
    if (!items.length) {
        var sel = docM.getElementById('selMarcador');
        var ta  = docM.getElementById('txaTexto');
        var opt = sel && (sel.querySelector('option[selected]') || (sel.options && sel.options[sel.selectedIndex]));
        var tag = opt ? opt.textContent.trim() : '';
        var note = ta ? ta.value || ta.textContent || '' : '';
        if (tag || note) items.push({ id: null, iconSrc: opt && (opt.getAttribute('data-imagesrc') || opt.dataset.imagesrc), tag: tag, note: note, user: '' });
    }
    return items;
}

export function installMarcadorSection(ctx) {
    var doc = ctx.doc, marcPanel = ctx.marcPanel;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var submitViaIframe = ctx.submitViaIframe, refreshSection = ctx.refreshSection, refreshers = ctx.refreshers;
    var sectionEnabled = ctx.sectionEnabled, log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;

    var marcadorUrl = findToolbarLink('andamento_marcador_gerenciar');
    function renderMarcadorItemRow(it) {
        var row = doc.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;';

        var lbl = doc.createElement('span');
        lbl.style.flex = '1';
        if (it.iconSrc) {
            var im = doc.createElement('img');
            im.src = it.iconSrc;
            im.style.cssText = 'width:14px;vertical-align:middle;margin-right:6px;';
            lbl.appendChild(im);
        }
        var s = doc.createElement('strong');
        s.textContent = it.tag;
        lbl.appendChild(s);
        if (it.note) {
            var n = doc.createElement('div');
            n.style.cssText = 'opacity:0.8;margin-left:20px;';
            n.textContent = it.note;
            lbl.appendChild(n);
        }
        row.appendChild(lbl);

        if (it.id) {
            var rmBtn = doc.createElement('a');
            rmBtn.className = 'newLink';
            rmBtn.title = 'Remover marcador';
            rmBtn.style.cssText = 'cursor:pointer;color:#c00;flex-shrink:0;';
            rmBtn.innerHTML = '<i class="fas fa-times"></i>';
            rmBtn.addEventListener('click', function () {
                if (rmBtn.style.opacity === '0.4') return;
                rmBtn.style.opacity = '0.4';
                rmBtn.style.pointerEvents = 'none';
                submitViaIframe(marcadorUrl, function (w, d2) {
                    var removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoRemover"]'))
                        .find(function (a) {
                            var oc = a.getAttribute('onclick') || '';
                            return oc.indexOf("acaoRemover('" + it.id + "'") !== -1;
                        });
                    if (removeLink) {
                        forceTrueConfirm(w);
                        removeLink.click();
                    } else if (typeof w.acaoRemover === 'function') {
                        forceTrueConfirm(w);
                        w.acaoRemover(it.id, it.tag || '');
                    } else {
                        var hdn = d2.getElementById('hdnInfraItemId');
                        if (hdn) hdn.value = it.id;
                        var f = d2.getElementById('frmGerenciarMarcador') || d2.querySelector('form');
                        if (f) f.submit();
                    }
                }).then(function () {
                    refreshSection('marcador', 'post-remove marcador');
                }).catch(function (e) {
                    err('marcador remove:', e.message);
                    rmBtn.style.opacity = '1';
                    rmBtn.style.pointerEvents = '';
                });
            });
            row.appendChild(rmBtn);
        }
        return row;
    }
    if (!marcadorUrl) {
        warn('infoarvore_marcador: toolbar link not found — section will stay as "carregando"');
        marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span style="opacity:0.6">(sem marcador)</span>';
        return;
    }
    function renderMarcador() {
      invalidatePage(marcadorUrl);
      marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span style="opacity:0.6">carregando…</span>';
      fetchPage(marcadorUrl).then(function (docM) {
        var items = parseMarcadorItems(docM);
        var bd = marcPanel.querySelector('.seipro-marcador-body');
        bd.innerHTML = '';
        if (!items.length) { bd.innerHTML = '<span style="opacity:0.6">(sem marcador)</span>'; return; }
        items.forEach(function (it) { bd.appendChild(renderMarcadorItemRow(it)); });
      }).catch(function (e) {
        marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span class="infoAlerta">(falha ao carregar marcador)</span>';
        report('infoarvore_marcador: fetch failed', { error: e.message, url: marcadorUrl });
      });
    }
    refreshers.marcador = renderMarcador;
    if (sectionEnabled('marcador')) renderMarcador();
    else log('infoarvore_marcador: skipped (section disabled by user)');
}
