import { qs, qsa } from './dom.js';
import { globalRef } from '../../core/global.js';
import { setPanelMonitorados } from './panel.js';
import { getStoreMonitoradoPro } from './store.js';
import { iconHtml } from './icon.js';

/**
 * Monitorados — glue de inicialização por contexto, vanilla ESM.
 *
 * Portado de:
 *   - initPanelMonitorados            (sei-pro.js)     — painel na lista de processos
 *   - initAppendIconMonitorados/...   (sei-pro-all.js) — estrela em listas de bloco/
 *                                                        acompanhamento/sobrestamento
 *
 * São wrappers de retry que esperam o stack legado ficar pronto e então chamam a
 * view vanilla (setPanelMonitorados/iconHtml). Os call-sites legados continuam
 * chamando estes nomes via aliasGlobal (legacy-api.js).
 */

const g = (n) => globalRef[n];
const debug = () => (typeof g('verifyConfigValue') === 'function' && g('verifyConfigValue')('debugpage'));

// --- Painel de monitorados na lista de processos -----------------------------
export function initPanelMonitorados(timeout = 9000) {
    if (timeout <= 0) return;
    // orderDivPanel ainda é legado (ordenação dos painéis): gate de prontidão.
    const ready = typeof g('localStorageRestorePro') !== 'undefined' && typeof g('orderDivPanel') !== 'undefined';
    if (!ready) {
        setTimeout(function () {
            initPanelMonitorados(timeout - 100);
            if (debug()) console.log('Reload initPanelMonitorados');
        }, 500);
        return;
    }
    const store = getStoreMonitoradoPro();
    if (typeof g('checkConfigValue') === 'function' && g('checkConfigValue')('gerenciarmonitorados')
        && store && Object.prototype.hasOwnProperty.call(store, 'monitorados')) {
        setTimeout(function () {
            setPanelMonitorados('insert');
            if (debug()) console.log('setPanelMonitorados');
        }, 500);
    }
}

// --- Estrela em listas auxiliares (bloco / acompanhamento / sobrestamento) ----
const APPEND_TABLES = '#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable';

export function setAppendIconMonitorados() {
    qsa(APPEND_TABLES).forEach(function (table) {
        qsa('tbody tr', table).forEach(function (tr) {
            const td = qsa('td', tr)[2];
            if (!td) return;
            const a = td.querySelector('a[href*="acao=procedimento_trabalhar"]');
            const href = a ? a.getAttribute('href') : undefined;
            const id = (typeof href !== 'undefined') ? String(g('getParamsUrlPro')(href).id_procedimento) : false;
            qsa('.seipro-monitorado-icon', td).forEach(function (n) { n.remove(); });
            if (id && id !== 'undefined') td.insertAdjacentHTML('afterbegin', iconHtml(id, 'left'));
        });
    });
}

export function initAppendIconMonitorados(timeout = 9000) {
    const hasTable = qs(APPEND_TABLES);
    // parent.name != '' indica frame embutido (não roda nessas tabelas dentro de iframe).
    if (timeout <= 0 || (window.parent && window.parent.name !== '') || !hasTable) return;
    const ready = typeof g('getParamsUrlPro') !== 'undefined' && typeof g('checkConfigValue') !== 'undefined';
    if (!ready) {
        setTimeout(function () {
            initAppendIconMonitorados(timeout - 100);
            if (debug()) console.log('Reload initAppendIconMonitorados => ' + timeout);
        }, 500);
        return;
    }
    if (g('checkConfigValue')('gerenciarmonitorados')) setAppendIconMonitorados();
}
