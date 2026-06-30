import { globalRef } from '../../core/global.js';
import { qs, qsa } from './dom.js';
import { getStoreMonitoradoPro, persistMonitoradoStore, getOptionsConfigDate } from './store.js';
import { findMonitoradoIndex } from './domain.js';

/**
 * Monitorados — edição rápida de prazo na linha da tabela (vanilla ESM).
 * Roteado pelo dispatcher do painel (data-act dates-show/dates-hide/dates-key).
 * getDatesPreview (preview do prazo) segue global (infra de prazos compartilhada).
 */

const g = (n) => globalRef[n];

function updateDatesMonitorado(el) {
    const tr = el.closest('tr');
    if (!tr) return;
    const store = getStoreMonitoradoPro();
    const id = parseInt(tr.getAttribute('data-id_procedimento'));
    const idx = findMonitoradoIndex(store, id);
    if (idx < 0) return;
    const config = getOptionsConfigDate(idx);
    const v = (el.value || '').trim();
    if (v === '') return;
    if (v !== config.date && config.date !== '') { config.selectdoc = false; config.setdate = true; }
    config.date = v;
    config.dateTo = globalRef.moment().format('YYYY-MM-DD');
    const td = el.closest('td');
    const info = td && qs('.info_dates_monitorado', td);
    const followLink = td && qs('.followLink', td);
    if (info && followLink) info.innerHTML = g('getDatesPreview')(config) + followLink.outerHTML;
    store.monitorados[idx].configdate = config;
    persistMonitoradoStore(store);
}

function showDatesMonitorado(el, mode) {
    if (el.closest('#frmAtividadeListar')) { updateDatesMonitorado(el); return; }
    const tr = el.closest('tr');
    const table = el.closest('table');
    const configBtn = tr && qs('.monitoradoConfigDates', tr);
    if (!(configBtn && configBtn.matches(':hover'))) {
        if (table) {
            qsa('.info_dates_monitorado', table).forEach((n) => { n.style.display = ''; });
            qsa('.info_dates_monitorado_txt', table).forEach((n) => { n.style.display = 'none'; });
            qsa('.followLinkDates', table).forEach((n) => { n.style.display = ''; });
        }
        if (typeof globalRef.infraTooltipOcultar === 'function') globalRef.infraTooltipOcultar();
        updateDatesMonitorado(el);
    }
    if (mode === 'show' && tr) {
        const td = el.closest('td');
        if (td) qsa('.followLinkDates', td).forEach((n) => { n.style.display = 'none'; });
        qsa('.info_dates_monitorado', tr).forEach((n) => { n.style.display = 'none'; });
        const txt = qs('.info_dates_monitorado_txt', tr);
        if (txt) { txt.style.display = 'inline-flex'; const inp = qs('input.seipro-monitorado-dates', txt); if (inp) { inp.focus(); inp.click(); } }
    }
    if (tr) {
        const td = el.closest('td');
        const info = qs('.info_dates_monitorado', tr);
        if (td) td.classList.toggle('info_dates_follow_empty', !(info && info.textContent.trim() !== ''));
    }
}

function keyDatesMonitorado(e) {
    if (e.which === 13 || e.key === 'Enter') {
        const target = e.target || e.currentTarget;
        if (target) showDatesMonitorado(target, 'hide');
    }
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    updateDatesMonitorado,
    showDatesMonitorado,
    keyDatesMonitorado
};
