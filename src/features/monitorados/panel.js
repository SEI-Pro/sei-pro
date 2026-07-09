import { globalRef } from '../../core/global.js';
import { qs, qsa, elFromHtml } from './dom.js';
import { getStoreMonitoradoPro } from './store.js';

/**
 * Monitorados — Painel/tabela na home do SEI (render vanilla + dispatcher delegado).
 *
 * Melhor prática aplicada: o RENDER e a montagem viram vanilla ESM aqui, mas a
 * INFRAESTRUTURA COMPARTILHADA de lista (tablesorter, tagsInput, sistema de
 * etiquetas, edição de descrição, ordenação/drag de painéis, getDatesPreview)
 * permanece global/compartilhada — clonar isso dentro da feature seria duplicação.
 *
 * Os ~16 handlers que eram onclick inline (quebrados no isolated-only, pois rodavam
 * no mundo MAIN) agora são DELEGADOS por data-act num listener real do mundo
 * isolado, roteando para as funções existentes (já portadas: mapas; ainda globais:
 * datas/categorias/etiqueta/desc) — o que reativa os botões do painel.
 */

const g = (name) => globalRef[name];
const opt = (name) => (typeof globalRef.getOptionsPro === 'function' ? globalRef.getOptionsPro(name) : '');
const esc = (s) => (typeof globalRef.escapeHtml === 'function' ? globalRef.escapeHtml(s) : String(s == null ? '' : s));
const isNewSEI = () => globalRef.SeiPro && globalRef.SeiPro.sei && globalRef.SeiPro.sei.adapter.isNewSEI();

function sortedMonitorados() {
    const jp = globalRef.jmespath;
    let list = getStoreMonitoradoPro().monitorados;
    list.forEach((m) => { if (m.order === null) m.order = -1; });
    if (typeof globalRef.checkObjHasProperty === 'function' && globalRef.checkObjHasProperty(list, 'order')) {
        list = jp.search(list, 'sort_by([*],&order)');
    }
    return list;
}

// HTML de uma linha da tabela. Mantém classes/ids do legado (tablesorter/CSS
// dependem deles); onclick -> data-act (+ data-* p/ args) para a delegação.
function rowHtml(value, index, arrayProcessosUnidade) {
    const id = value.id_procedimento;
    const linkDoc = globalRef.url_host + '?acao=procedimento_trabalhar&id_procedimento=' + id;
    // prazo/marcador/anotação não são mais dados próprios — vêm do nativo (espelho).
    const aberto = arrayProcessosUnidade.indexOf(value.processo) !== -1;
    const iconProcesso = aberto ? 'far fa-folder-open' : 'fas fa-folder';
    const tipsProcesso = aberto ? 'Processo aberto nesta unidade' : 'Processo fechado nesta unidade';
    const issetOrder = value.order != null && value.order != -1;
    const order = issetOrder ? value.order : index;
    const categoria = (value.categoria != null && value.categoria !== '') ? value.categoria : false;
    // Ícones clonados da célula nativa do processo, EXCETO anotação e marcador:
    // ambos já têm coluna própria nesta tabela, então duplicá-los ao lado do número
    // é redundante. Filtra pelas âncoras de anotação (acao=anotacao_registrar) e de
    // marcador (href de marcador ou o <img class="imagemStatus" de marcador>).
    const procRow = qsa('#P' + id + ' td:nth-child(2) a');
    const htmlIconsHome = procRow.filter((a) => {
        const href = a.getAttribute('href') || '';
        if (/acao=anotacao_registrar/i.test(href)) return false;
        if (/marcador/i.test(href)) return false;
        if (a.querySelector('img.imagemStatus[src*="marcador"]')) return false;
        return true;
    }).map((a) => a.outerHTML).join('');

    return '<tr data-tagname="SemGrupo" data-index="' + index + '" data-id_procedimento="' + id + '">'
        + '<td align="center"><input type="checkbox" data-act="row-check" id="monitoradoPro_' + id + '" name="monitoradoPro" value="' + id + '"></td>'
        + '<td align="left">'
        + '<a class="followLinkProcesso bLink" style="text-decoration:underline;" href="' + linkDoc + '"><i class="' + iconProcesso + ' bLink" style="text-decoration:underline;" title="' + tipsProcesso + '"></i> ' + esc(value.processo) + '</a>'
        + '<a class="newLink followLink followLinkNewtab" href="' + linkDoc + '" title="Abrir em nova aba" target="_blank"><i class="fas fa-external-link-alt" style="font-size:90%;text-decoration:underline;"></i></a>'
        + '<div class="seipro-monitorado-native-icons">' + htmlIconsHome + '</div>'
        + '</td>'
        // Prazo: espelho read-only da célula nativa de controle de prazo (#P{id} .seipro-prazo-box-display).
        + '<td align="left" class="seipro-monitorado-native-cell" data-native="prazo"></td>'
        // Marcador: espelho read-only do marcador nativo do SEI.
        + '<td align="left" class="seipro-monitorado-native-cell" data-native="marcador"></td>'
        // Anotação: espelho read-only da anotação nativa (#P{id} .seipro-sticknote-note-cell).
        + '<td class="seipro-monitorado-native-cell" data-native="anotacao"></td>'
        // Tipo de Processo: vem do processo (tooltip do link nativo), não do store.
        + '<td class="seipro-monitorado-type-cell"><span data-native="tipo"></span>'
        + '<a class="newLink followLink followLinkTags seipro-monitorado-remove-row" data-act="remove-row" title="Remover dos Processos Monitorados"><i class="fas fa-trash-alt"></i></a>'
        + '</td>'
        + '<td class="seipro-monitorado-category-cell">'
        + '<span class="seipro-monitorado-category-text">' + (categoria ? esc(categoria) : '') + '</span>'
        + '<span class="seipro-monitorado-category-editor" style="display:none"></span>'
        + '<a class="newLink followLink followLinkTags followLinkMonitoradoCategory" data-act="category-edit" title="Editar categoria"><i class="fas fa-pencil-alt"></i></a>'
        + '</td>'
        + '<td align="center" data-order="' + order + '">'
        + '<a class="newLink seipro-monitorado-sorter" style="margin-right:20px;cursor:grab;"><span class="fa-layers fa-fw"><i class="fas fa-bars cinzaColor"></i>'
        + (issetOrder ? '<span class="fa-layers-counter">' + value.order + '</span>' : '') + '</span></a>'
        + '</td>'
        + '</tr>';
}

function panelHtml() {
    const jp = globalRef.jmespath;
    const hidden = opt('monitoradosProDiv') === 'hide';
    const statusView = hidden ? 'display:none;' : 'display: inline-table;';
    const iconShow = hidden ? '' : 'display:none;';
    const iconHide = hidden ? 'display:none;' : '';
    const all = sortedMonitorados();
    const selectedCategoryView = opt('panelMonitoradosView') || '';
    const listCat = selectedCategoryView !== '' ? jp.search(all, "[?categoria=='" + selectedCategoryView + "']") : all;
    // Só mostra favoritos cujo processo está na lista de controle visível (#P{id}).
    // Os demais continuam persistidos, mas só reaparecem quando voltam à lista.
    const list = (listCat || []).filter((m) => document.getElementById('P' + m.id_procedimento));
    if (!list || !list.length) return null;
    const count = list.length + (list.length === 1 ? ' registro:' : ' registros:');
    const arrayProcessosUnidade = (typeof globalRef.getProcessoUnidadePro === 'function') ? globalRef.getProcessoUnidadePro() : [];
    const th = isNewSEI() ? 'infraTh' : '';
    const checkImg = isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif';

    let table = '<table class="tableInfo tableZebra infraTable tableFollow seipro-table-monitorados tabelaControle" data-name-table="Processos Monitorados" data-tabletype="monitorados" id="monitoradoTablePro">'
        + '<caption class="infraCaption" style="text-align:left;">' + count + '</caption>'
        + '<thead><tr class="tableHeader">'
        + '<th class="tituloControle ' + th + '" style="width:50px;" align="center"><span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" data-act="select-all"><img src="/infra_css/' + checkImg + '" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'
        + '<th class="tituloControle ' + th + '" style="width:210px;">Processo</th>'
        + '<th class="tituloControle ' + th + ' tituloFilter" data-filter-type="date" style="width:150px;">Prazo</th>'
        + '<th class="tituloControle ' + th + ' tituloFilter" data-filter-type="etiqueta" style="width:150px;">Marcador</th>'
        + '<th class="tituloControle ' + th + '">Anotação</th>'
        + '<th class="tituloControle ' + th + '">Tipo de Processo</th>'
        + '<th class="tituloControle ' + th + '">Categoria</th>'
        + '<th class="tituloControle ' + th + '" style="width:50px;" align="center"><i class="fas fa-sort-numeric-up"></i></th>'
        + '</tr></thead><tbody>';
    list.forEach((value, index) => {
        if (selectedCategoryView === '' || selectedCategoryView === value.categoria) {
            table += rowHtml(value, index, arrayProcessosUnidade);
        }
    });
    table += '</tbody></table>';

    const idOrder = (opt('orderPanelHome') && jp.search(opt('orderPanelHome'), "[?name=='monitoradosPro'].index | length(@)") > 0)
        ? jp.search(opt('orderPanelHome'), "[?name=='monitoradosPro'].index | [0]") : '';
    const selectCategory = (typeof globalRef.selectCategoryMonitorado === 'function')
        ? globalRef.selectCategoryMonitorado(selectedCategoryView, 'changePanelCategoryMonitorado') : '';

    return { idOrder, html: '<div class="panelHomePro" style="display:inline-block;width:100%;" id="monitoradosPro" data-order="' + idOrder + '">'
        + '<div class="infraBarraLocalizacao titlePanelHome"><i class="fas fa-star starGold" style="margin:0 5px;font-size:1.1em;"></i> Processos Monitorados'
        + '<a class="newLink" id="monitoradosProDiv_showIcon" data-act="toggle-show" title="Mostrar Tabela" style="font-size:11pt;' + iconShow + '"><i class="fas fa-plus-square cinzaColor"></i></a>'
        + '<a class="newLink" id="monitoradosProDiv_hideIcon" data-act="toggle-hide" title="Recolher Tabela" style="font-size:11pt;' + iconHide + '"><i class="fas fa-minus-square cinzaColor"></i></a>'
        + '</div>'
        + '<div id="monitoradosProDiv" class="panelHome" style="width:100%;' + statusView + '">'
        + '<div id="monitoradosProActions" style="top:0;position:absolute;z-index:9999;left:190px;width:calc(100% - 230px)">'
        + '<a class="newLink seipro-monitorados-remove-selected" data-act="remove-selected" title="Remover processos monitorados" style="margin:0;font-size:14pt;display:none"><span class="fa-layers fa-fw"><i class="fas fa-trash-alt"></i><span class="fa-layers-counter">1</span></span></a>'
        + '<span style="display:block;float:right;width:200px;">' + selectCategory + '</span>'
        + '<a class="newLink seipro-monitorados-update" data-act="update" title="Atualizar Informações" style="margin-right:10px;font-size:14pt;float:right;"><i class="fas fa-sync-alt"></i></a>'
        + '<a class="newLink seipro-monitorados-config" data-act="config" title="Configurações" style="margin:0;font-size:14pt;float:right;"><i class="fas fa-cog"></i></a>'
        + '</div>'
        + '<div class="tabelaPanelScroll">' + table + '</div>'
        + '</div></div>' };
}

function positionBeforeControl() {
    const panel = qs('#monitoradosPro');
    const control = qs('#processosSEIPro');
    if (panel && control) control.parentNode.insertBefore(panel, control);
}

// ---- Espelho read-only das células nativas (#P{id}) -------------------------
// Seletores das fontes nativas na linha de controle do SEI:
//  - prazo:    célula .seipro-prazo-box-display (feature controlar-prazos)
//  - anotação: célula .seipro-sticknote-note-cell (feature anotacao-controle)
//  - marcador: marcador nativo do SEI na célula do processo
const NATIVE_SRC = {
    prazo: '.seipro-prazo-box-display',
    anotacao: '.seipro-sticknote-note-cell',
    // O marcador nativo é um <img class="imagemStatus" src="svg/marcador_*.svg"> dentro
    // de um <a> com o tooltip do nome do marcador. Casamos o img e subimos p/ a âncora.
    marcador: 'img.imagemStatus[src*="marcador"]'
};

// Sanitiza um clone: remove ids (evita duplicados) e handlers que dependem de
// ids/estado nativos (onclick/data-act). Mantém classes, estilo, título e
// onmouseover/onmouseout (tooltips do SEI usam globais da própria página).
function sanitizeClone(node) {
    if (node.removeAttribute) { node.removeAttribute('id'); node.removeAttribute('onclick'); node.removeAttribute('data-act'); }
    if (node.querySelectorAll) {
        node.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
        node.querySelectorAll('[onclick]').forEach((e) => e.removeAttribute('onclick'));
        node.querySelectorAll('[data-act]').forEach((e) => e.removeAttribute('data-act'));
    }
    return node;
}

// Tipo de processo a partir do link nativo: o tooltip é
// infraTooltipMostrar('<interessado>','<tipo>') — pegamos o 2º argumento.
function tipoFromNativeRow(nativeRow) {
    const a = nativeRow.querySelector('a[href*="procedimento_trabalhar"]');
    const oc = (a && a.getAttribute('onmouseover')) || '';
    const m = oc.match(/infraTooltipMostrar\((["'])([\s\S]*?)\1\s*,\s*(["'])([\s\S]*?)\3/);
    return m ? m[4] : '';
}

// Preenche os placeholders [data-native] de cada linha a partir do processo nativo
// (#P{id}): prazo/marcador/anotação por clone read-only; tipo por texto do tooltip.
function mirrorNativeCells() {
    qsa('#monitoradoTablePro tbody tr[data-id_procedimento]').forEach((tr) => {
        const id = tr.getAttribute('data-id_procedimento');
        const nativeRow = document.getElementById('P' + id);
        qsa('[data-native]', tr).forEach((cell) => {
            cell.textContent = '';
            if (!nativeRow) return;
            const kind = cell.getAttribute('data-native');
            if (kind === 'tipo') { cell.textContent = tipoFromNativeRow(nativeRow); return; }
            let src = nativeRow.querySelector(NATIVE_SRC[kind]);
            if (!src) return;
            if (kind === 'marcador') src = src.closest('a') || src; // sobe ao <a> p/ manter o tooltip
            const clone = sanitizeClone(src.cloneNode(true));
            // prazo/anotação: a fonte é a TD nativa → copia seus filhos. marcador: é o próprio elemento.
            if (clone.tagName === 'TD') Array.from(clone.childNodes).forEach((n) => cell.appendChild(n));
            else cell.appendChild(clone);
        });
    });
}

// Reaplica o espelho quando a origem (tabelas nativas de controle) muda — prazo
// editado, marcador/anotação alterados etc. Debounce via rAF; ignora mutações da
// própria tabela de monitorados para não recursar.
let nativeMirrorObserver = null;
function installNativeMirror() {
    if (nativeMirrorObserver) return;
    const natives = qsa('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (!natives.length) return;
    let pending = false;
    nativeMirrorObserver = new MutationObserver((records) => {
        if (pending) return;
        if (records.every((r) => r.target.closest && r.target.closest('#monitoradoTablePro'))) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; mirrorNativeCells(); });
    });
    natives.forEach((t) => nativeMirrorObserver.observe(t, { childList: true, subtree: true, characterData: true }));
}

export function setPanelMonitorados(mode) {
    if (!getStoreMonitoradoPro().monitorados.length || mode !== 'insert' && mode !== 'refresh') {
        if (typeof globalRef.checkFileLocalMonitorado === 'function') globalRef.checkFileLocalMonitorado();
        if (typeof globalRef.appendStarOnProcess === 'function') globalRef.appendStarOnProcess();
        return;
    }
    const built = panelHtml();
    if (!built) {
        if (typeof globalRef.checkFileLocalMonitorado === 'function') globalRef.checkFileLocalMonitorado();
        if (typeof globalRef.appendStarOnProcess === 'function') globalRef.appendStarOnProcess();
        return;
    }

    if (mode === 'insert') {
        const old = qs('#monitoradosPro'); if (old) old.remove();
        // orderDivPanel (shared) insere o painel respeitando a ordem salva.
        if (typeof globalRef.orderDivPanel === 'function') globalRef.orderDivPanel(built.html, built.idOrder, 'monitoradosPro');
        positionBeforeControl();
        if (opt('panelSortPro') && typeof globalRef.initSortDivPanel === 'function') globalRef.initSortDivPanel();
    } else { // refresh
        const cur = qs('#monitoradosPro');
        if (cur) {
            cur.id = 'monitoradosPro_temp';
            cur.insertAdjacentElement('afterend', elFromHtml(built.html));
            cur.remove();
            positionBeforeControl();
        }
    }
    if (typeof globalRef.initFunctionsPanelMonitorado === 'function') globalRef.initFunctionsPanelMonitorado();
    if (typeof globalRef.checkFileSystemInit === 'function') globalRef.checkFileSystemInit();
    if (typeof globalRef.appendStarOnProcess === 'function') globalRef.appendStarOnProcess();
    // Espelha prazo/marcador/anotação das linhas nativas e mantém sincronizado com a origem.
    mirrorNativeCells();
    installNativeMirror();
}

// ---- Dispatcher delegado (revive os botões; roteia data-act -> handler) ----
// A maioria dos alvos ainda são globais (datas/categorias/etiqueta/desc/infra
// compartilhada); mapas já são da feature. Trocar o alvo conforme cada porte.
const CLICK = {
    'select-all': (el) => g('getSelectAllTr') && g('getSelectAllTr')(el, 'SemGrupo'),
    // prazo/marcador/anotação agora são espelho do nativo (read-only) — sem editores aqui.
    'remove-row': (el) => g('removeMonitoradoPainelPro') && g('removeMonitoradoPainelPro')(el, el.closest('tr') && el.closest('tr').dataset.id_procedimento),
    'category-edit': (el) => g('editCategoryMonitorado') && g('editCategoryMonitorado')(el, el.closest('tr') && el.closest('tr').dataset.id_procedimento),
    'toggle-show': () => g('toggleTablePro') && g('toggleTablePro')('#monitoradosProDiv', 'show'),
    'toggle-hide': () => g('toggleTablePro') && g('toggleTablePro')('#monitoradosProDiv', 'hide'),
    'remove-selected': (el) => g('removeMonitoradoPainelPro') && g('removeMonitoradoPainelPro')(el),
    'update': (el) => g('updateMonitorados') && g('updateMonitorados')(el),
    'config': (el) => g('openConfigMonitorados') && g('openConfigMonitorados')(el)
};

export function bindPanelDispatcher(root = document) {
    if (root.__seiproMonitoradoPanelBound) return;
    root.__seiproMonitoradoPanelBound = true;
    root.addEventListener('click', (ev) => {
        const el = ev.target.closest('[data-act]');
        if (!el || !el.closest('#monitoradosPro')) return;
        const fn = CLICK[el.dataset.act];
        if (fn) { ev.preventDefault(); fn(el); }
    });
    root.addEventListener('change', (ev) => {
        const el = ev.target.closest('[data-act="row-check"]');
        if (!el) return;
        // Espelha a seleção no checkbox NATIVO do mesmo processo (#P{id}); o .click()
        // dispara o infraSelecionarItens nativo, então os comandos do SEI (Enviar
        // Processo etc.) passam a enxergar os favoritos selecionados aqui.
        const nativeRow = document.getElementById('P' + el.value);
        const nativeCb = nativeRow && nativeRow.querySelector('input[type=checkbox]');
        if (nativeCb && nativeCb.checked !== el.checked) nativeCb.click();
        if (g('followSelecionarItens')) g('followSelecionarItens')(el);
    });
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    setPanelMonitorados
};
