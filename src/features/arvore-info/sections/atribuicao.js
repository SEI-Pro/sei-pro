import { extractNosHtml } from '../parse/inline-payload.js';
import { isAtribuicaoUnassigned } from '../parse/atribuicao.js';

/**
 * Seção "Atribuição" do painel infoarvore (Etapa D — split por seção).
 * Fábrica retorna { renderRows, editInline }:
 *  - renderRows(body, items): pinta a lista de responsáveis (usado no render inicial
 *    e após salvar);
 *  - editInline(panel): editor inline (select de atribuição → submit via iframe →
 *    re-parse do Nos[0].html da própria árvore, sem recarregar o iframe).
 * A lógica PURA (extração de payload + heurística "não atribuído") vem de parse/.
 *
 * ctx = { doc, win, findToolbarLink, fetchPage, invalidatePage, submitViaIframe, log, err, report }
 */
// Parsing PURO da lista de responsáveis a partir do Nos[0].html inline (só LÊ docR;
// cria temp <div> no próprio docR). Testável jsdom. VERBATIM (createElement: doc→docR).
export function parseAtribuicaoItemsFromDoc(docR) {
    var newResp = [];
    var scrs = docR.querySelectorAll('script:not([src])');
    for (var i = 0; i < scrs.length; i++) {
        var txt = scrs[i].textContent || '';
        var raw = extractNosHtml(txt);
        if (raw === null) continue;
        raw.split('<br />').forEach(function (frag) {
            var tmp = docR.createElement('div');
            tmp.innerHTML = frag;
            var text = tmp.textContent.trim();
            if (text) newResp.push({ text: text, unassigned: isAtribuicaoUnassigned(text, tmp.querySelector('a.ancoraSigla')) });
        });
        break;
    }
    return newResp;
}

export function createAtribuicaoSection(ctx) {
    var doc = ctx.doc, win = ctx.win;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var submitViaIframe = ctx.submitViaIframe, log = ctx.log, err = ctx.err, report = ctx.report;

    function renderRows(body, items) {
        body.innerHTML = '';
        if (!items.length) {
            body.innerHTML = '<span class="infoAlerta">(sem responsáveis)</span>';
            return;
        }
        items.forEach(function (r) {
            var row = doc.createElement('div');
            var a = doc.createElement('a');
            a.className = 'newLink seipro-copy';
            a.style.cursor = 'pointer';
            a.style.maxWidth = 'calc(100% - 70px)';
            a.textContent = r.text + (r.unassigned ? ' ' : '');
            if (r.unassigned) {
                var alert = doc.createElement('span');
                alert.className = 'infoAlerta';
                alert.textContent = '(não atribuído)';
                a.appendChild(alert);
            }
            row.appendChild(a);
            body.appendChild(row);
        });
    }

    function editInline(panel) {
        var atribUrl = findToolbarLink('procedimento_atribuicao_cadastrar');
        if (!atribUrl) { report('inline atrib: toolbar link not found — edit Atribuição disabled', { sought: 'procedimento_atribuicao_cadastrar' }); return; }
        var body = panel.querySelector('.infoDadosArvore');
        var savedHTML = body.innerHTML;
        body.innerHTML = '<span style="opacity:0.6">carregando formulário…</span>';
        invalidatePage(atribUrl);
        fetchPage(atribUrl).then(function (docA) {
            var srcSel = docA.querySelector('#selAtribuicao');
            if (!srcSel) { err('inline atrib: #selAtribuicao not found'); body.innerHTML = savedHTML; return; }
            // Build editor UI
            var wrap = doc.createElement('div');
            wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
            var sel = doc.createElement('select');
            sel.style.cssText = 'width:100%;padding:4px;';
            Array.prototype.forEach.call(srcSel.options, function (o) {
                var opt = doc.createElement('option');
                opt.value = o.value;
                opt.textContent = o.text;
                if (o.selected) opt.selected = true;
                sel.appendChild(opt);
            });
            var btnRow = doc.createElement('div');
            btnRow.style.cssText = 'display:flex;gap:6px;justify-content:flex-end;';
            var btnSave = doc.createElement('button');
            btnSave.type = 'button'; btnSave.className = 'newLink'; btnSave.textContent = 'Salvar';
            btnSave.style.cssText = 'cursor:pointer;padding:2px 10px;';
            var btnCancel = doc.createElement('button');
            btnCancel.type = 'button'; btnCancel.className = 'newLink'; btnCancel.textContent = 'Cancelar';
            btnCancel.style.cssText = 'cursor:pointer;padding:2px 10px;';
            btnRow.appendChild(btnCancel); btnRow.appendChild(btnSave);
            wrap.appendChild(sel); wrap.appendChild(btnRow);
            body.innerHTML = ''; body.appendChild(wrap);

            btnCancel.addEventListener('click', function () { body.innerHTML = savedHTML; });
            btnSave.addEventListener('click', function () {
                btnSave.disabled = true; btnCancel.disabled = true;
                btnSave.textContent = 'salvando…';
                submitViaIframe(atribUrl, { selAtribuicao: sel.value }).then(function () {
                    log('inline atrib: saved, re-rendering responsáveis');
                    // Re-fetch the árvore page and re-parse Nos[0].html to update responsáveis in place
                    // — avoids reloading the iframe (which would reset the visualization pane).
                    invalidatePage(win.location.href);
                    return fetchPage(win.location.href).then(function (docR) {
                        var newResp = parseAtribuicaoItemsFromDoc(docR);
                        renderRows(body, newResp);
                        // Update pencil's data-text so the legacy edit dialog (if ever invoked) sees current user
                        var pencilA = panel.querySelector('.seipro-edit[data-mode="responsaveis"]');
                        if (pencilA) pencilA.dataset.text = (newResp[0] && newResp[0].text) || '';
                        // No refreshAll: the responsáveis list was just re-rendered in place from the
                        // árvore page re-fetch above. Other sections aren't affected by this edit, and
                        // refetching them would trigger stale-hash errors after the SEI save.
                    });
                }).catch(function (e) {
                    err('inline atrib submit:', e.message);
                    body.innerHTML = savedHTML;
                    report('inline atrib: submit failed — reverted to previous value');
                });
            });
        }).catch(function (e) {
            err('inline atrib fetch:', e.message);
            body.innerHTML = savedHTML;
        });
    }

    return { renderRows: renderRows, editInline: editInline, parseFromDoc: parseAtribuicaoItemsFromDoc };
}
