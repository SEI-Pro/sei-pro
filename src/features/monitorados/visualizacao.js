import { globalRef } from '../../core/global.js';
import { waitFor } from './dom.js';
import { createTagsInput } from '../../shared/ui/tags-input.js';
import { getStoreMonitoradoPro } from './store.js';

/**
 * Monitorados — tela de visualização do processo (vanilla ESM). Injeta o
 * checkbox "Manter em Processos Monitorados" + opções no iframe do processo.
 *
 * Conserta o problema do isolated-only: os handlers eram onclick="parent.fn"
 * (rodavam no MAIN do iframe, sem enxergar o mundo isolado). Agora um listener
 * DELEGADO é anexado ao documento do iframe (same-origin) a partir do mundo
 * isolado do content script — e roteia data-act para as funções já portadas.
 * As etiquetas usam o tags-input compartilhado montado dentro do iframe (doc:).
 */

const g = (n) => globalRef[n];

function visIframe() {
    const sel = globalRef.$ifrVisualizacao;
    let ifr = (typeof sel === 'string' && sel) ? document.querySelector(sel) : null;
    if (!ifr) ifr = document.querySelector('#ifrConteudoVisualizacao, #ifrVisualizacao');
    return ifr;
}

export function monitoradosLabelOptions(id_procedimento) {
    const store = getStoreMonitoradoPro();
    const value = globalRef.jmespath.search(store.monitorados, "[?id_procedimento=='" + id_procedimento + "'] | [0]") || false;
    const config = (value && value.configdate) ? value.configdate : '';
    const etq = (value && Array.isArray(value.etiquetas)) ? value.etiquetas : [];
    const tagsMonitorado = etq.length ? etq.join(';') : '';
    const tagsHtml = (typeof g('getHtmlEtiqueta') === 'function') ? etq.map((i) => g('getHtmlEtiqueta')(i, 'monitorado')).join('') : '';
    const catSelect = (typeof g('selectCategoryMonitorado') === 'function')
        ? g('selectCategoryMonitorado')(value ? value.categoria : '', 'changeCategoryMonitorado', true, id_procedimento).replace('<select ', '<select id="categoria_monitorado" ')
        : '';
    const dateVal = (config && config.date != null) ? config.date : '';
    return '<table style="font-size:10pt;width:100%;min-width:610px;" class="seiProForm">'
        + '<tr data-id_procedimento="' + id_procedimento + '" data-index="0">'
        + '<td style="vertical-align:bottom;text-align:left;" class="label"><label for="categoria_monitorado"><i class="iconPopup iconSwitch fas fa-layer-group cinzaColor"></i>Categoria:</label></td>'
        + '<td>' + catSelect + '</td>'
        + '<td style="vertical-align:bottom;" class="label"><label class="last" for="monitoradoPrazoSend"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor" style="float:initial;"></i>Prazo:</label></td>'
        + '<td><span class="info_dates_monitorado_txt"><input id="monitoradoPrazoSend" value="' + dateVal + '" style="width:120px;background:#f9fafa;" data-act="dates-hide-blur" data-key="dates" type="date" class="seipro-monitorado-dates" name="monitoradoPrazoSend">'
        + '<a class="newLink seipro-monitorado-config-dates" data-act="dates-config" style="padding:5px 8px;margin:8px 2px 0 10px;font-size:10pt;" title="Opções"><i class="fas fa-cog"></i></a></span></td>'
        + '</tr>'
        + '<tr data-id_procedimento="' + id_procedimento + '" data-index="0" style="height:40px;">'
        + '<td align="left" class="tdmonitorado_tags" data-etiqueta-mode="monitorado" colspan="4">'
        + '<span class="info_tags_follow">' + tagsHtml + '</span>'
        + '<span class="info_tags_follow_txt" style="display:none;margin-top:-8px !important;"><input value="' + tagsMonitorado + '" class="monitoradoTagsPro" name="monitoradoTagsPro"></span>'
        + '<a class="newLink followLinkTagsAdd_send" data-act="tags-show" style="font-size:10pt;"><i class="fas fa-tags"></i> Adicionar etiqueta</a>'
        + '</td></tr></table>';
}

// Listener delegado no doc do iframe — roteia para as funções (já portadas) globais.
function bindVisDispatcher(idoc, id_procedimento) {
    if (idoc.__seiproMonitoradoVisBound) return;
    idoc.__seiproMonitoradoVisBound = true;
    idoc.addEventListener('click', (ev) => {
        const el = ev.target.closest('[data-act]');
        if (!el) return;
        if (el.dataset.act === 'dates-config' && g('openBoxConfigDates')) { ev.preventDefault(); g('openBoxConfigDates')(el); }
        else if (el.dataset.act === 'tags-show' && g('showFollowEtiqueta')) { ev.preventDefault(); g('showFollowEtiqueta')(el, 'show', 'monitorado'); }
    });
    idoc.addEventListener('change', (ev) => {
        const cb = ev.target.closest('[data-act="vis-checkbox"]');
        if (cb && g('actionMonitoradoCheckbox')) { g('actionMonitoradoCheckbox')(cb); return; }
        const sel = ev.target.closest('select.selectPro[data-act="category-change"]');
        if (sel && g('changeCategoryMonitorado')) g('changeCategoryMonitorado')(sel);
    });
    idoc.addEventListener('focusout', (ev) => {
        const el = ev.target.closest('[data-act="dates-hide-blur"]');
        if (el && g('showDatesMonitorado')) g('showDatesMonitorado')(el, 'hide');
    });
    idoc.addEventListener('keydown', (ev) => {
        const el = ev.target.closest('[data-key="dates"]');
        if (el && g('keyDatesMonitorado')) g('keyDatesMonitorado')(ev);
    });
}

export function getMonitoradosEnviarProcesso() {
    const ifr = visIframe();
    if (!ifr || !ifr.contentDocument) return;
    const idoc = ifr.contentDocument;
    const id = String(g('getParamsUrlPro')(window.location.href).id_procedimento);
    const value = globalRef.jmespath.search(getStoreMonitoradoPro().monitorados, "[?id_procedimento=='" + id + "'] | [0]");
    const form = idoc.getElementById('frmAtividadeListar');
    if (!form) return;
    if (!idoc.getElementById('divSinAdicionarMonitorados')) {
        form.insertAdjacentHTML('beforeend',
            '<div id="divSinAdicionarMonitorados" class="infraDivCheckbox" style="position:absolute;top:100%;left:0;">'
            + '<input type="checkbox" id="chkSindicionarMonitorados" data-act="vis-checkbox" name="chkSindicionarMonitorados" class="infraCheckbox" tabindex="510" ' + (value ? 'checked' : '') + '>'
            + '<label id="lblSinAdicionarMonitorados" for="chkSindicionarMonitorados" class="infraLabelCheckbox">Manter processo em Processos Monitorados</label>'
            + '<div class="monitoradosLabelOptions seiProForm" style="display:' + (value ? 'block' : 'none') + ';font-size:9pt;clear:both;">' + monitoradosLabelOptions(id) + '</div></div>');
    }
    if (typeof g('loadStylePro') === 'function') {
        const head = idoc.head;
        g('loadStylePro')(globalRef.URL_SPRO + 'css/sei-pro.css', head, idoc);
        g('loadStylePro')((localStorage.getItem('seiSlim') ? globalRef.URL_SPRO + 'css/fontawesome.pro.min.css' : globalRef.URL_SPRO + 'css/fontawesome.min.css'), head, idoc);
    }
    bindVisDispatcher(idoc, id);
    const tagInput = idoc.querySelector('.monitoradoTagsPro');
    if (tagInput && !tagInput.dataset.seiproTagsInit) {
        tagInput.dataset.seiproTagsInit = '1';
        const persist = () => { if (typeof g('saveFollowEtiqueta') === 'function') g('saveFollowEtiqueta')(tagInput); };
        createTagsInput(tagInput, {
            doc: idoc, delimiter: ';', placeholder: 'Adicionar etiqueta', limit: 8, minChars: 2,
            source: () => (typeof g('sugestEtiquetaPro') === 'function' ? g('sugestEtiquetaPro')('monitorado') : []),
            onAdd: persist, onRemove: persist
        });
    }
}

export function checkPageMonitoradosVisualizacao() {
    const ifr = visIframe();
    if (!ifr || !ifr.contentDocument) return;
    waitFor(ifr.contentDocument, '#frmAtividadeListar[action*="acao=procedimento_enviar"]').then((el) => { if (el) getMonitoradosEnviarProcesso(); });
}

export function installVisualizacao() {
    globalRef.loadMonitoradosPro = true; // guard que o init.js legado consulta
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    monitoradosLabelOptions,
    getMonitoradosEnviarProcesso,
    checkPageMonitoradosVisualizacao
};
