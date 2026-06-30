import { globalRef } from '../../core/global.js';
import { qs, qsa, frameDoc } from './dom.js';
import { openModal } from '../../shared/ui/modal.js';
import { getStoreMonitoradoPro, persistMonitoradoStore } from './store.js';
import { findMonitoradoIndex, monitoradoProcessDataReady, monitoradoProcessPayloadReady } from './domain.js';

/**
 * Monitorados — comandos de add/remover + sincronização de dados do processo,
 * vanilla ESM. Reescreve o cluster do arquivo principal legado.
 *
 * Store/domínio via ESM; o fluxo de SESSÃO do processo (dadosProcessoPro,
 * getDadosIframeProcessoPro, pullDadosProcessoSession) e alguns helpers de UI
 * (setPanelMonitorados/appendIconMonitorados/appendStarOnProcess já portados;
 * monitoradosLabelOptions/addKanbanProc/confirmaBoxPro ainda legados) seguem
 * via globalRef. O diálogo de sucesso usa o modal compartilhado.
 */

const g = (n) => globalRef[n];
const dados = () => globalRef.dadosProcessoPro;
const setDados = (v) => { globalRef.dadosProcessoPro = v; };

function processAnchor(treeDoc) {
    if (!treeDoc) return null;
    return treeDoc.querySelector('#topmenu a[target="ifrConteudoVisualizacao"], #topmenu a[target="ifrVisualizacao"]');
}
function visualizacaoDoc() {
    const ifr = document.querySelector('#ifrConteudoVisualizacao, #ifrVisualizacao');
    try { return ifr && ifr.contentDocument ? ifr.contentDocument : null; } catch (e) { return null; }
}

// ---- Store commands ----
export function removeMonitoradoPro(id_procedimento, store = false) {
    store = store || getStoreMonitoradoPro();
    store.monitorados = store.monitorados.filter((item) => item.id_procedimento != id_procedimento);
    return store;
}
export function addMonitoradoPro(id_procedimento = false) {
    let store = getStoreMonitoradoPro();
    const d = dados() || {};
    const id = id_procedimento || (d.listAndamento ? d.listAndamento.id_procedimento : false);
    if (id !== false) store = removeMonitoradoPro(id, store);
    const andamento = d.listAndamento || {};
    const prop = d.propProcesso || {};
    store.monitorados.push({
        id_procedimento: andamento.id_procedimento,
        processo: andamento.processo,
        andamento: andamento.andamento || [],
        documentos: d.listDocumentosAssinados || [],
        tipo_procedimento: prop.hdnNomeTipoProcedimento || '',
        assuntos: prop.selAssuntos_select || [],
        interessados: prop.selInteressadosProcedimento || [],
        descricao: prop.txtDescricao || '',
        order: -1, categoria: ''
    });
    return store;
}
export function storeMonitoradoPro(mode, id_procedimento) {
    const store = (mode === 'add') ? addMonitoradoPro(id_procedimento) : removeMonitoradoPro(id_procedimento);
    const d = dados();
    if (d && Array.isArray(d.tiposDocumentos) && d.tiposDocumentos.length > 0) store.config.tiposdocs = d.tiposDocumentos;
    persistMonitoradoStore(store);
    if (typeof g('appendIconMonitorados') === 'function') g('appendIconMonitorados')();
    if (!document.getElementById('ifrArvore')) {
        if (!document.getElementById('monitoradosPro')) {
            if (g('setPanelMonitorados')) g('setPanelMonitorados')('insert');
            if (g('initAppendIconMonitorados')) g('initAppendIconMonitorados')();
        } else if (!store.monitorados || store.monitorados.length === 0) {
            const panel = document.getElementById('monitoradosPro'); if (panel) panel.remove();
            if (g('appendStarOnProcess')) g('appendStarOnProcess')();
        } else if (g('setPanelMonitorados')) {
            g('setPanelMonitorados')('refresh');
        }
        setDados({});
        const kanban = document.getElementById('processosKanban');
        if (kanban && kanban.offsetParent !== null && g('addKanbanProc')) g('addKanbanProc')();
    }
}

// ---- Fallback (scrape da linha da tabela de controle) ----
export function getFallbackMonitoradoRowData(target, id_procedimento) {
    let row = target && target.closest ? target.closest('tr') : null;
    if (!row && id_procedimento) {
        row = qsa('.tabelaControle tr').find((r) => {
            const a = r.querySelector('a[href*="id_procedimento="]');
            return a && String(g('getParamsUrlPro')(a.getAttribute('href')).id_procedimento) === String(id_procedimento);
        }) || null;
    }
    if (!row) return false;
    const rowText = row.textContent.trim();
    const checkbox = row.querySelector('input[type="checkbox"]');
    const hrefProcesso = row.querySelector('a[href*="acao=procedimento_trabalhar"]');
    const cells = row.querySelectorAll('td');
    let processo = cells[3] ? cells[3].textContent.trim() : '';
    let descricao = cells[2] ? cells[2].textContent.trim() : '';
    let tipo_procedimento = '';
    const cbHelp = checkbox ? (checkbox.getAttribute('title') || checkbox.getAttribute('aria-label') || checkbox.getAttribute('data-original-title') || '') : '';
    const cbDesc = checkbox ? (checkbox.getAttribute('alt') || checkbox.getAttribute('label') || '') : '';
    if (!processo && cbHelp) processo = cbHelp.trim();
    if (!processo && hrefProcesso) processo = hrefProcesso.textContent.trim();
    if (!descricao && cbDesc) { const m = cbDesc.match(/Especifica(?:ção|cao)\s+(.+)$/i); if (m && m[1]) descricao = m[1].trim(); }
    const tt = (hrefProcesso && hrefProcesso.getAttribute('onmouseover')) || '';
    const ttArr = (typeof g('extractTooltipToArray') === 'function') ? g('extractTooltipToArray')(tt) : null;
    if (ttArr && ttArr.length > 1) tipo_procedimento = ttArr[1].split(' / ')[0].trim();
    if (!tipo_procedimento && cbDesc) { const m = cbDesc.match(/Tipo\s+(.+?)(?:\s*\/\s*Especifica(?:ção|cao)\s+|$)/i); if (m && m[1]) tipo_procedimento = m[1].trim(); }
    if (!descricao && rowText) descricao = rowText.replace(/\s+/g, ' ').trim();
    if (!processo) processo = String(id_procedimento);
    return {
        listAndamento: { historico_completo: false, processo, id_procedimento: String(id_procedimento), andamento: [] },
        listDocumentosAssinados: [], tiposDocumentos: [],
        propProcesso: { hdnIdProcedimento: String(id_procedimento), hdnNomeTipoProcedimento: tipo_procedimento, selAssuntos_select: [], selInteressadosProcedimento: [], txtDescricao: descricao }
    };
}
function saveImmediateMonitoradoPro(target, id_procedimento) {
    const fallback = getFallbackMonitoradoRowData(target, id_procedimento);
    if (!fallback) return false;
    setDados(fallback);
    storeMonitoradoPro('add', id_procedimento);
    return fallback;
}

// ---- Sincronização com os dados de sessão do processo ----
function snapshot(item) {
    return JSON.stringify({
        processo: item.processo || '', andamento: item.andamento || [], documentos: item.documentos || [],
        tipo_procedimento: item.tipo_procedimento || '', assuntos: item.assuntos || [],
        interessados: item.interessados || [], descricao: item.descricao || ''
    });
}
export function syncMonitoradoProProcessData(id_procedimento, d) {
    if (id_procedimento == null || id_procedimento === '') return;
    if (!d || !d.propProcesso) return;
    const store = getStoreMonitoradoPro();
    if (!store.monitorados || !store.monitorados.length) return;
    const idx = findMonitoradoIndex(store, id_procedimento);
    if (idx === -1) return;
    const andamento = d.listAndamento || {};
    const prop = d.propProcesso || {};
    const item = store.monitorados[idx];
    const before = snapshot(item);
    item.id_procedimento = andamento.id_procedimento || item.id_procedimento;
    item.processo = andamento.processo || item.processo;
    item.andamento = andamento.andamento || item.andamento || [];
    item.documentos = d.listDocumentosAssinados || item.documentos || [];
    item.tipo_procedimento = prop.hdnNomeTipoProcedimento || item.tipo_procedimento || '';
    item.assuntos = prop.selAssuntos_select || item.assuntos || [];
    item.interessados = prop.selInteressadosProcedimento || item.interessados || [];
    item.descricao = prop.txtDescricao || item.descricao || '';
    if (Array.isArray(d.tiposDocumentos) && d.tiposDocumentos.length > 0) { store.config = store.config || {}; store.config.tiposdocs = d.tiposDocumentos; }
    persistMonitoradoStore(store);
    if (!document.getElementById('ifrArvore') && document.getElementById('monitoradosPro') && before !== snapshot(item) && g('setPanelMonitorados')) {
        g('setPanelMonitorados')('refresh');
    }
}
export function checkDataMonitoradoPro(this_, mode, id_procedimento) {
    const treeDoc = frameDoc('ifrArvore');
    const target = this_ || (treeDoc && treeDoc.getElementById('seipro-monitorado-icon_' + id_procedimento));
    let saved = false;
    const storeWhenReady = (d) => {
        setDados(d || dados());
        const dd = dados();
        if (dd && !dd.hasOwnProperty('tiposDocumentos')) dd.tiposDocumentos = [];
        if (dd && !dd.hasOwnProperty('listDocumentosAssinados')) dd.listDocumentosAssinados = [];
        if (mode === 'add' && saved) syncMonitoradoProProcessData(id_procedimento, dd);
        else { storeMonitoradoPro(mode, id_procedimento); saved = (mode === 'add'); }
    };
    if (mode === 'remove') { storeWhenReady(); return true; }
    const d0 = g('pullDadosProcessoSession')(id_procedimento);
    if (monitoradoProcessPayloadReady(id_procedimento, d0)) { storeWhenReady(d0); return true; }
    if (mode === 'add') saved = !!saveImmediateMonitoradoPro(target, id_procedimento);
    if (typeof g('waitMonitoradoProcessData') === 'function') {
        g('waitMonitoradoProcessData')(id_procedimento, (d) => { if (monitoradoProcessPayloadReady(id_procedimento, d)) storeWhenReady(d); }, () => {}, false);
    }
    if (mode === 'add' && g('getDadosIframeProcessoPro')) g('getDadosIframeProcessoPro')(id_procedimento, 'monitorados');
    return false;
}

// ---- Entry: clique no ícone-estrela ----
export function actMonitoradoPro(this_, mode) {
    let id_procedimento, treeDoc = null, visDoc = null;
    if (this_) {
        id_procedimento = this_.dataset ? this_.dataset.id_procedimento : (this_.getAttribute && this_.getAttribute('data-id_procedimento'));
    } else {
        treeDoc = frameDoc('ifrArvore');
        visDoc = visualizacaoDoc();
        const anchor = processAnchor(treeDoc);
        if (!anchor || !anchor.getAttribute('href')) return false;
        id_procedimento = String(g('getParamsUrlPro')(anchor.getAttribute('href')).id_procedimento);
    }
    checkDataMonitoradoPro(this_, mode, id_procedimento);

    if (mode === 'add' && visDoc && !visDoc.getElementById('frmAtividadeListar') && treeDoc) {
        const htmlBox = (typeof g('monitoradosLabelOptions') === 'function') ? g('monitoradosLabelOptions')(id_procedimento) : '';
        openModal({
            title: 'Opções: Processos Monitorados', width: 650,
            content: '<strong class="iframeSucessPro" style="background:#f9efad;font-size:10pt;padding:10px;border-radius:5px;margin:0 0 10px 0;display:block;color:#404040;"><i class="fas fa-check-circle azulColor" style="margin-right:5px;"></i> Processo adicionado com sucesso no painel de Processos Monitorados (página inicial do SEI)</strong>' + htmlBox,
            buttons: [{ text: 'Ok', class: 'confirm', onClick: (ref) => ref.close() }]
        });
    }
}

// ---- Remoção a partir do painel ----
export function removeMonitoradoPainelPro(this_, id_procedimento = 0) {
    const doRemove = () => {
        if (id_procedimento == 0) {
            qsa('#monitoradoTablePro input[name="monitoradoPro"]:checked').forEach((cb) => removeRow(cb, (cb.value || '').trim()));
            setTimeout(() => { if (this_ && this_.style) this_.style.display = 'none'; }, 500);
        } else {
            removeRow(this_, id_procedimento);
        }
    };
    if (typeof g('confirmaBoxPro') === 'function') g('confirmaBoxPro')('Tem certeza que deseja remover esse processo dos Processos Monitorados?', doRemove);
    else if (window.confirm('Remover esse processo dos Processos Monitorados?')) doRemove();
}
function removeRow(el, id_procedimento) {
    persistMonitoradoStore(removeMonitoradoPro(id_procedimento));
    const tr = el && el.closest ? el.closest('tr') : null;
    if (tr) tr.style.display = 'none';
}
export function updateMonitorados(this_) {
    const i = this_ && this_.querySelector ? this_.querySelector('i') : null;
    if (i) i.classList.add('fa-spin');
    if (g('setPanelMonitorados')) g('setPanelMonitorados')('refresh');
}

function bindProcessSync() {
    if (globalRef.__seiProMonitoradoProcessSyncBound) return;
    globalRef.__seiProMonitoradoProcessSyncBound = true;
    window.addEventListener('sei-pro-process-session-updated', (event) => {
        const detail = (event && event.detail) || {};
        const id = detail.id_procedimento;
        if (id == null || id === '') return;
        const d = g('pullDadosProcessoSession')(id);
        if (monitoradoProcessDataReady(id, d)) syncMonitoradoProProcessData(id, d);
    });
}

export function installCommands() {
    bindProcessSync();
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    actMonitoradoPro,
    storeMonitoradoPro,
    addMonitoradoPro,
    removeMonitoradoPro,
    removeMonitoradoPainelPro,
    updateMonitorados,
    checkDataMonitoradoPro,
    syncMonitoradoProProcessData,
    getFallbackMonitoradoRowData
};
