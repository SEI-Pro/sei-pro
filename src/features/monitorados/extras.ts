// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { globalRef } from '../../core/global.js';
import { qs, qsa, elFromHtml } from './dom.js';
import { openModal } from '../../shared/ui/modal.js';
import { getStoreMonitoradoPro, persistMonitoradoStore } from './store.js';
import { iconHtml } from './icon.js';

/**
 * Monitorados — extras de UI vanilla: estrela na lista de processos, diálogo de
 * configurações (backup), remoção de linha, reindexação, toolbar.
 */

const g = (n) => globalRef[n];

// Estrela em cada processo da tabela de controle do SEI.
function appendStarOnProcess() {
    qsa('.tabelaControle tbody tr').forEach((tr) => {
        let id = tr.getAttribute('id');
        id = (id != null && id !== '') ? id.replace('P', '') : false;
        if (!id) {
            const a = tr.querySelector('a[href*="id_procedimento="]');
            id = a ? g('getParamsUrlPro')(a.getAttribute('href')).id_procedimento : false;
        }
        if (!id) {
            const a = tr.querySelector('a[href*="acao=procedimento_trabalhar"]');
            id = a ? g('getParamsUrlPro')(a.getAttribute('href')).id_procedimento : false;
        }
        const td = tr.querySelectorAll('td')[1];
        if (!td) return;
        qsa('.seipro-monitorado-icon', td).forEach((n) => n.remove());
        td.style.verticalAlign = 'middle';
        if (id) td.insertAdjacentElement('afterbegin', elFromHtml(iconHtml(id)));
    });
}

function openConfigMonitorados() {
    openModal({
        title: 'Configurações: Processos Monitorados', width: 450,
        content: '<table style="font-size:9pt;width:100%;" class="seiProForm"><tr style="height:40px;">'
            + '<td style="vertical-align:bottom;text-align:left;" class="label"><a class="newLink seipro-backup-dl" style="cursor:pointer"><i class="fas fa-download azulColor"></i>Baixar Processos Monitorados</a></td>'
            + '<td style="vertical-align:bottom;text-align:left;" class="label"><input type="file" id="selectLocalFilesPro" class="seipro-backup-file" style="display:none" /><a class="newLink seipro-backup-up" style="cursor:pointer;float:right;"><i class="fas fa-upload azulColor"></i>Carregar Processos Monitorados</a></td>'
            + '<td></td></tr></table>',
        onOpen: (ref) => {
            if (g('getLocalFilePro')) g('getLocalFilePro')();
            const dl = qs('.seipro-backup-dl', ref.body);
            const up = qs('.seipro-backup-up', ref.body);
            const file = qs('.seipro-backup-file', ref.body);
            if (dl) dl.addEventListener('click', () => { if (g('initDownloadLocalFilePro')) g('initDownloadLocalFilePro')(dl); });
            if (up) up.addEventListener('click', () => { if (g('initLoadLocalFilePro')) g('initLoadLocalFilePro')(); });
            if (file) file.addEventListener('change', () => { if (g('loadLocalFilePro')) g('loadLocalFilePro')(); });
        }
    });
}

function updateIndexTableMonitorado() {
    qsa('.tableFollow tbody tr').forEach((tr, index) => { tr.dataset.index = index; });
}

function removeMonitorado(el) {
    const tr = el.closest('tr');
    if (!tr) return;
    const store = getStoreMonitoradoPro();
    const index = parseInt(tr.getAttribute('data-index'));
    if (!(index >= 0)) return;
    store.monitorados.splice(index, 1);
    tr.style.transition = 'opacity .4s';
    tr.style.opacity = '0';
    setTimeout(() => {
        tr.remove();
        updateIndexTableMonitorado();
        if (g('updateCountTableMonitorado')) g('updateCountTableMonitorado')();
        persistMonitoradoStore(store);
    }, 400);
}

function actionToolbarMonitoradoPro(this_, triggerButton) {
    const action = triggerButton && triggerButton.dataset ? triggerButton.dataset.action : '';
    if (action === 'etiqueta' && g('showFollowEtiqueta')) g('showFollowEtiqueta')(this_, 'show');
    else if (action === 'remove') removeMonitorado(this_);
    else if (action === 'dates' && g('showDatesMonitorado')) g('showDatesMonitorado')(this_, 'show');
    else if (action === 'descricao' && g('editMonitoradoDesc')) g('editMonitoradoDesc')(this_);
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    appendStarOnProcess,
    openConfigMonitorados,
    removeMonitorado,
    updateIndexTableMonitorado,
    actionToolbarMonitoradoPro
};
