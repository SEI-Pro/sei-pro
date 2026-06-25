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
    const etq = Array.isArray(value.etiquetas) ? value.etiquetas : [];
    const tagsMonitorado = etq.length ? etq.join(';') : '';
    const tagsHtml = etq.map((i) => globalRef.getHtmlEtiqueta(i, 'monitorado')).join('');
    const tagsClass = etq.map((i) => 'tagTableName_' + globalRef.normalizeNameTag(i)).join(' ');
    const datesVal = (value.configdate && value.configdate.date != null) ? value.configdate.date : '';
    if (value.configdate && value.configdate.dateTo != null) value.configdate.dateTo = globalRef.moment().format('YYYY-MM-DD');
    const datesHtml = value.configdate ? globalRef.getDatesPreview(value.configdate) : '';
    const datesEl = datesHtml ? elFromHtml(datesHtml) : null;
    const tagDatesClass = datesEl && datesEl.dataset.tagname ? 'tagTableName_' + datesEl.dataset.tagname : '';
    const aberto = arrayProcessosUnidade.indexOf(value.processo) !== -1;
    const iconProcesso = aberto ? 'far fa-folder-open' : 'fas fa-folder';
    const tipsProcesso = aberto ? 'Processo aberto nesta unidade' : 'Processo fechado nesta unidade';
    const issetOrder = value.order != null && value.order != -1;
    const order = issetOrder ? value.order : index;
    const categoria = (value.categoria != null && value.categoria !== '') ? value.categoria : false;
    const procRow = qsa('#P' + id + ' td:nth-child(2) a');
    const htmlIconsHome = procRow.map((a) => a.outerHTML).join('');
    const hasMap = value.latlng != null;

    return '<tr data-tagname="SemGrupo" data-index="' + index + '" data-id_procedimento="' + id + '" class="' + tagsClass + ' ' + tagDatesClass + '">'
        + '<td align="center"><input type="checkbox" data-act="row-check" id="monitoradoPro_' + id + '" name="monitoradoPro" value="' + id + '"></td>'
        + '<td align="left">'
        + '<a class="followLinkProcesso bLink" style="text-decoration:underline;" href="' + linkDoc + '"><i class="' + iconProcesso + ' bLink" style="text-decoration:underline;" title="' + tipsProcesso + '"></i> ' + esc(value.processo) + '</a>'
        + '<a class="newLink followLink followLinkNewtab" href="' + linkDoc + '" title="Abrir em nova aba" target="_blank"><i class="fas fa-external-link-alt" style="font-size:90%;text-decoration:underline;"></i></a>'
        + '<div class="info_icons_monitorado">' + htmlIconsHome + '</div>'
        + '</td>'
        + '<td align="left" class="tdmonitorado_dates ' + (datesHtml.trim() === '' ? 'info_dates_follow_empty' : '') + '">'
        + '<span class="info_dates_monitorado">' + datesHtml + '</span>'
        + '<a class="newLink followLink followLinkDates followLinkDatesEdit" data-act="dates-show" title="Editar prazo"><i class="fas fa-pencil-alt"></i></a>'
        + '<a class="newLink followLink followLinkDates followLinkDatesAdd" data-act="dates-show" title="Adicionar prazo"><i class="fas fa-stopwatch"></i></a>'
        + '<span class="info_dates_monitorado_txt" style="display:none;">'
        + '<input value="' + datesVal + '" data-act="dates-hide-blur" data-key="dates" type="date" class="monitoradoDatesPro" name="monitoradoDatesPro">'
        + '<a class="newLink" data-act="dates-hide" style="padding:2px;margin:0 2px;" title="Salvar"><i class="fas fa-thumbs-up"></i></a>'
        + '<a class="newLink monitoradoConfigDates" data-act="dates-config" style="padding:2px;margin:0 2px;" title="Opções"><i class="fas fa-cog"></i></a>'
        + '</span>'
        + '</td>'
        + '<td align="left" class="tdmonitorado_tags ' + (tagsHtml.trim() === '' ? 'info_tags_follow_empty' : '') + '" data-etiqueta-mode="monitorado">'
        + '<span class="info_tags_follow">' + tagsHtml + '</span>'
        + '<span class="info_tags_follow_txt" style="display:none"><input value="' + tagsMonitorado + '" class="monitoradoTagsPro" name="monitoradoTagsPro"></span>'
        + '<a class="newLink followLink followLinkTags followLinkTagsEdit" data-act="tags-show" title="Editar etiqueta"><i class="fas fa-pencil-alt"></i></a>'
        + '<a class="newLink followLink followLinkTags followLinkTagsAdd" data-act="tags-show" title="Adicionar etiqueta"><i class="fas fa-tags"></i></a>'
        + '</td>'
        + '<td class="tdmonitorado_map ' + (hasMap ? '' : 'info_maps_follow_empty') + '">'
        + '<span class="info_maps_follow">' + (hasMap ? '<a class="newLink" data-act="map-single-ro"><i class="fas fa-map-marked azulColor"></i></a>' : '') + '</span>'
        + '<a class="newLink followLink followLinkMaps followLinkMapsEdit" data-act="map-single" title="Editar mapa"><i class="fas fa-pencil-alt"></i></a>'
        + '<a class="newLink followLink followLinkMaps followLinkMapsAdd" data-act="map-single" title="Adicionar mapa"><i class="fas fa-map-marker-alt"></i></a>'
        + '</td>'
        + '<td class="content_desc">'
        + '<span class="info_txt" style="display:none"><input data-act="desc-blur" data-key="desc" value="' + esc(value.descricao) + '" name="monitoradoDescriptionPro"></span>'
        + '<span class="info">' + esc(value.descricao) + '</span>'
        + '<a class="newLink followLink followLinkDesc" data-act="desc-edit" title="Editar especificação"><i class="fas fa-pencil-alt"></i></a>'
        + '</td>'
        + '<td>' + esc(value.tipo_procedimento)
        + '<a class="newLink followLink followLinkTags followLinkMonitoradoRemove" data-act="remove-row" title="Remover dos Processos Monitorados"><i class="fas fa-trash-alt"></i></a>'
        + '</td>'
        + '<td class="td_monitorado_category">'
        + '<span class="info_category_txt">' + (categoria ? esc(categoria) : '') + '</span>'
        + '<span class="info_category" style="display:none"></span>'
        + '<a class="newLink followLink followLinkTags followLinkMonitoradoCategory" data-act="category-edit" title="Editar categoria"><i class="fas fa-pencil-alt"></i></a>'
        + '</td>'
        + '<td align="center" data-order="' + order + '">'
        + '<a class="newLink sorterTrMonitorado" style="margin-right:20px;cursor:grab;"><span class="fa-layers fa-fw"><i class="fas fa-bars cinzaColor"></i>'
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
    const list = selectedCategoryView !== '' ? jp.search(all, "[?categoria=='" + selectedCategoryView + "']") : all;
    if (!list || !list.length) return null;
    const count = list.length + (list.length === 1 ? ' registro:' : ' registros:');
    const checkMaps = jp.search(all, 'length([?not_null(latlng)])') > 0;
    const arrayProcessosUnidade = (typeof globalRef.getProcessoUnidadePro === 'function') ? globalRef.getProcessoUnidadePro() : [];
    const th = isNewSEI() ? 'infraTh' : '';
    const checkImg = isNewSEI() ? 'svg/check.svg' : 'imagens/check.gif';

    let table = '<table class="tableInfo tableZebra infraTable tableFollow tableMonitorados tabelaControle" data-name-table="Processos Monitorados" data-tabletype="monitorados" id="monitoradoTablePro">'
        + '<caption class="infraCaption" style="text-align:left;">' + count + '</caption>'
        + '<thead><tr class="tableHeader">'
        + '<th class="tituloControle ' + th + '" style="width:50px;" align="center"><span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" data-act="select-all"><img src="/infra_css/' + checkImg + '" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'
        + '<th class="tituloControle ' + th + '" style="width:210px;">Processo</th>'
        + '<th class="tituloControle ' + th + ' tituloFilter" data-filter-type="date" style="width:150px;">Prazo</th>'
        + '<th class="tituloControle ' + th + ' tituloFilter" data-filter-type="etiqueta" style="width:150px;">Marcador</th>'
        + '<th class="tituloControle ' + th + ' tituloFilter" data-filter-type="etiqueta" style="width:80px;">Mapa</th>'
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
        + '<a class="newLink iconMonitorados_remove" data-act="remove-selected" title="Remover processos monitorados" style="margin:0;font-size:14pt;display:none"><span class="fa-layers fa-fw"><i class="fas fa-trash-alt"></i><span class="fa-layers-counter">1</span></span></a>'
        + '<span style="display:block;float:right;width:200px;">' + selectCategory + '</span>'
        + '<a class="newLink iconMonitorados_update" data-act="update" title="Atualizar Informações" style="margin-right:10px;font-size:14pt;float:right;"><i class="fas fa-sync-alt"></i></a>'
        + '<a class="newLink iconMonitorados_maps" data-act="map-multiple" title="Mapa de processos monitorados" style="margin:0;font-size:14pt;float:right;' + (checkMaps ? '' : 'display:none;') + '"><i class="fas fa-map-marker-alt"></i></a>'
        + '<a class="newLink iconMonitorados_config" data-act="config" title="Configurações" style="margin:0;font-size:14pt;float:right;"><i class="fas fa-cog"></i></a>'
        + '</div>'
        + '<div class="tabelaPanelScroll">' + table + '</div>'
        + '</div></div>' };
}

function positionBeforeControl() {
    const panel = qs('#monitoradosPro');
    const control = qs('#processosSEIPro');
    if (panel && control) control.parentNode.insertBefore(panel, control);
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
        if (typeof globalRef.L === 'undefined') {
            if (typeof globalRef.loadStylePro === 'function') globalRef.loadStylePro(globalRef.URL_SPRO + 'css/leaflet.css');
            if (globalRef.jQuery) globalRef.jQuery.getScript(globalRef.URL_SPRO + 'js/lib/leaflet.js', function (d, ts, jqxhr) {
                if (typeof globalRef.L === 'object' && jqxhr.status === 200) globalRef.jQuery.getScript(globalRef.URL_SPRO + 'js/lib/leaflet-geocoder.js');
            });
        }
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
}

// ---- Dispatcher delegado (revive os botões; roteia data-act -> handler) ----
// A maioria dos alvos ainda são globais (datas/categorias/etiqueta/desc/infra
// compartilhada); mapas já são da feature. Trocar o alvo conforme cada porte.
const CLICK = {
    'select-all': (el) => g('getSelectAllTr') && g('getSelectAllTr')(el, 'SemGrupo'),
    'dates-show': (el) => g('showDatesMonitorado') && g('showDatesMonitorado')(el, 'show'),
    'dates-hide': (el) => g('showDatesMonitorado') && g('showDatesMonitorado')(el, 'hide'),
    'dates-config': (el) => g('openBoxConfigDates') && g('openBoxConfigDates')(el),
    'tags-show': (el) => g('showFollowEtiqueta') && g('showFollowEtiqueta')(el, 'show', 'monitorado'),
    'map-single-ro': (el) => g('openBoxSingleMap') && g('openBoxSingleMap')(el, true),
    'map-single': (el) => g('openBoxSingleMap') && g('openBoxSingleMap')(el),
    'desc-edit': (el) => g('editFollowDesc') && g('editFollowDesc')(el, 'monitorado'),
    'remove-row': (el) => g('removeMonitoradoPainelPro') && g('removeMonitoradoPainelPro')(el, el.closest('tr') && el.closest('tr').dataset.id_procedimento),
    'category-edit': (el) => g('editCategoryMonitorado') && g('editCategoryMonitorado')(el, el.closest('tr') && el.closest('tr').dataset.id_procedimento),
    'toggle-show': () => g('toggleTablePro') && g('toggleTablePro')('#monitoradosProDiv', 'show'),
    'toggle-hide': () => g('toggleTablePro') && g('toggleTablePro')('#monitoradosProDiv', 'hide'),
    'remove-selected': (el) => g('removeMonitoradoPainelPro') && g('removeMonitoradoPainelPro')(el),
    'update': (el) => g('updateMonitorados') && g('updateMonitorados')(el),
    'map-multiple': () => g('openBoxMultipleMap') && g('openBoxMultipleMap')(),
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
        if (el && g('followSelecionarItens')) g('followSelecionarItens')(el);
    });
    root.addEventListener('focusout', (ev) => {
        const el = ev.target.closest('[data-act]');
        if (!el || !el.closest('#monitoradosPro')) return;
        if (el.dataset.act === 'dates-hide-blur' && g('showDatesMonitorado')) g('showDatesMonitorado')(el, 'hide');
        if (el.dataset.act === 'desc-blur' && g('saveFollowDesc')) g('saveFollowDesc')(el, 'monitorado');
    });
    root.addEventListener('keydown', (ev) => {
        const el = ev.target.closest('[data-act]');
        if (!el || !el.closest('#monitoradosPro')) return;
        if (el.dataset.key === 'dates' && g('keyDatesMonitorado')) g('keyDatesMonitorado')(ev);
        if (el.dataset.key === 'desc' && g('keyFollowDesc')) g('keyFollowDesc')(ev, 'monitorado');
    });
}
