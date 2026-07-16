import { globalRef } from '../../core/global.js';
import { qs, qsa, elFromHtml, frameDoc, waitFor } from './dom.js';
import { getStoreMonitoradoPro } from './store.js';
import { getMonitoradoToggleAction, isMonitoradoToggle } from './view.js';

/**
 * Monitorados — ícone-estrela no topo da árvore do processo (adicionar/remover).
 *
 * Reescrita vanilla do par legado insertIconMonitorados/appendIconMonitorados +
 * htmlIconMonitorados (este vivia em sei-functions-pro.js). O clique agora é
 * DELEGADO no mundo isolado (ver index.js) — o onclick inline legado apontava
 * para parent.actMonitoradoPro no mundo MAIN, que não enxerga as funções do
 * content script isolado (causa de "o ícone não faz nada" no isolated-only).
 */

const TARGET_SEL = 'a[target="ifrConteudoVisualizacao"], a[target="ifrVisualizacao"]';

// id_procedimento do processo a partir da âncora do topo da árvore.
function processAnchor(treeDoc) {
    return treeDoc.querySelector('#topmenu ' + TARGET_SEL);
}

function idFromAnchor(anchor) {
    if (!anchor || !anchor.getAttribute('href')) return '';
    const params = globalRef.getParamsUrlPro(anchor.getAttribute('href'));
    const id = String(params && params.id_procedimento);
    return (!id || id === 'undefined') ? '' : id;
}

// Markup do ícone (estado add/remove conforme o store). Mantém id/classe/estilo
// do legado para o CSS existente continuar valendo até a extração do CSS.
export function iconHtml(id_procedimento, float = false) {
    const monitorados = getStoreMonitoradoPro().monitorados || [];
    const isMonitored = monitorados.some((m) => String(m.id_procedimento) === String(id_procedimento));
    const floatStyle = float ? 'float:' + float + ';' : '';
    const base = 'seipro-monitorado-icon" data-id_procedimento="' + id_procedimento + '" id="seipro-monitorado-icon_' + id_procedimento + '"';
    return isMonitored
        ? '<i title="Remover dos Processos Monitorados" class="fas fa-star starGold ' + base + ' data-act="monitorado-toggle" data-mode="remove" style="font-size:12pt;margin:0 5px;cursor:pointer;-webkit-text-fill-color:#FED35B;-webkit-text-stroke-color:rgb(216 162 22);-webkit-text-stroke-width:2px;' + floatStyle + '"></i>'
        : '<i title="Adicionar aos Processos Monitorados" class="far fa-star ' + base + ' data-act="monitorado-toggle" data-mode="add" style="font-size:12pt;margin:0 5px;color:#666;cursor:pointer;' + floatStyle + '"></i>';
}

// (Re)insere o ícone ao lado da âncora do processo na árvore.
export function mountIcon() {
    const treeDoc = frameDoc('ifrArvore');
    if (!treeDoc) return;
    const anchor = processAnchor(treeDoc);
    if (!anchor) return;
    const id = idFromAnchor(anchor);
    if (!id) return;
    qsa('.seipro-monitorado-icon', treeDoc).forEach((n) => n.remove());
    anchor.insertAdjacentElement('afterend', elFromHtml(iconHtml(id)));
}

// Liga a delegação do clique no doc da árvore (uma vez por documento).
// O handler chama o fluxo legado window.actMonitoradoPro (que ainda trata
// diálogo/painel) — mas agora a partir de um listener REAL no mundo isolado,
// no lugar do onclick inline quebrado. Quando o painel for portado, troca-se
// o alvo por uma função da própria feature.
// Liga a delegação do clique da estrela num documento (idempotente por doc).
// Usada tanto na árvore (initIcon) quanto na tela de controle de processos, onde
// a estrela é inserida por appendStarOnProcess no MESMO document do content script
// (por isso precisa ser ligada em `document`, não só no doc da árvore).
export function bindToggle(doc, onToggle) {
    if (!doc || doc.__seiproMonitoradoIconBound) return;
    doc.__seiproMonitoradoIconBound = true;
    doc.addEventListener('click', function (ev) {
        const icon = ev.target.closest ? ev.target.closest('[data-act="monitorado-toggle"]') : null;
        if (!isMonitoradoToggle(icon)) return;
        const action = getMonitoradoToggleAction(icon);
        if (!action) return;
        ev.preventDefault();
        const handler = onToggle || ((target, mode) => {
            if (typeof globalRef.actMonitoradoPro === 'function') globalRef.actMonitoradoPro(target, mode);
        });
        if (typeof handler === 'function') {
            handler(icon, action.mode, action.id_procedimento);
        }
    });
}

// Aguarda a árvore montar e então insere o ícone + liga a delegação.
export function initIcon() {
    const treeDoc = frameDoc('ifrArvore');
    if (!treeDoc) return;
    bindToggle(treeDoc);
    waitFor(treeDoc, '#topmenu ' + TARGET_SEL).then((el) => { if (el) mountIcon(); });
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    insertIconMonitorados: initIcon,
    appendIconMonitorados: mountIcon,
    htmlIconMonitorados: iconHtml
};
