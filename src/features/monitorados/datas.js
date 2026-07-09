import { globalRef } from '../../core/global.js';
import { qs, qsa, elFromHtml } from './dom.js';
import { openModal } from '../../shared/ui/modal.js';
import { getStoreMonitoradoPro, persistMonitoradoStore, getOptionsConfigDate } from './store.js';
import { findMonitoradoIndex, monitoradoProcessDataReady } from './domain.js';

/**
 * Monitorados — Contagem de prazo (caixa de configuração de datas), vanilla ESM.
 *
 * Reescreve o slice legado: formulário grande + jQuery UI dialog -> modal
 * compartilhado (src/shared/ui/modal.js) + DOM vanilla; os onchange/onclick
 * inline viram data-act delegados no corpo do modal. A prévia (configDatesPreview)
 * e o fluxo de dados de sessão (getDadosIframeProcessoPro/pullDadosProcessoSession)
 * permanecem globais (infra compartilhada / sessão do processo).
 */

const g = (name) => globalRef[name];
const byId = (id) => document.getElementById(id);
const moment = () => globalRef.moment;
const preview = () => { if (typeof globalRef.configDatesPreview === 'function') globalRef.configDatesPreview(); };
const configDateClassByType = {
    selectdoc: 'seipro-monitorado-dates-selectdoc',
    setdate: 'seipro-monitorado-dates-setdate',
    countdays: 'seipro-monitorado-dates-countdays'
};
const configDateClass = (type) => configDateClassByType[type] || ('configDates_' + type);

function appendNewdoclist(nameDoc) {
    return '<span class="seipro-monitorado-datebox"><i class="far fa-file-alt" style="color:#777;padding-right:3px;"></i> ' + nameDoc
        + ' <i class="fas fa-times seipro-newdoc-remove" style="color:#F783AD;padding-left:3px;cursor:pointer"></i></span>';
}
function appendArrayNewdoclist(listArray) {
    return (listArray || []).map(appendNewdoclist).join('');
}

function sw(state, on, off) { return state ? on : off; }

function formHtml(configdate, id_procedimento, store, monitoradoIndex) {
    const docList = (store.monitorados[monitoradoIndex] && store.monitorados[monitoradoIndex].documentos) || [];
    const duenumber = configdate.duenumber > 0 ? configdate.duenumber : Math.abs(configdate.duenumber);
    let docsOptions = '';
    docList.forEach((value) => {
        if (value.data_assinatura === '') return;
        const selected = (configdate.listdocs && configdate.listdocs == value.id_protocolo) ? 'selected' : '';
        docsOptions += '<option data-sign="' + value.data_assinatura + '" data-id-protocolo="' + value.id_documento + '" value="' + value.id_documento + '" ' + selected + '>' + value.nome_documento + ' (SEI nº ' + value.nr_sei + ') [assinado em ' + value.data_assinatura + ']</option>';
    });
    let tiposOptions = '';
    if (store.config && Array.isArray(store.config.tiposdocs)) {
        store.config.tiposdocs.forEach((v) => { if (v.name !== '') tiposOptions += '<option value="' + v.id + '">' + v.name + '</option>'; });
    }

    // Cada switch: checkbox com data-act + data-type; demais inputs com data-act="preview".
    const swRow = (icon, label, id, type, checked, act = 'switch-change', extra = '') =>
        '<tr style="height:40px;"><td><i class="iconPopup iconSwitch fas ' + icon + ' ' + sw(checked, 'azulColor', 'cinzaColor') + '"></i> ' + label + '</td>'
        + '<td><div class="onoffswitch" style="float:right;"><input type="checkbox" data-act="' + act + '" ' + extra + ' class="onoffswitch-checkbox" id="configDatesBox_' + id + '" data-type="' + type + '" tabindex="0" ' + (checked ? 'checked' : '') + '><label class="onoff-switch-label" for="configDatesBox_' + id + '"></label></div></td></tr>';

    return '<div id="configDatesBox">'
        + '<table style="font-size:10pt;width:100%;" class="seiProForm">'
        + '<tr style="height:40px;"><td colspan="2">Contar o tempo decorrido do processo a partir:</td></tr>'
        + swRow('fa-file-signature', 'Da data de assinatura de um documento', 'selectdoc', 'selectdoc', configdate.selectdoc, 'switch-selectdoc', 'data-id="' + id_procedimento + '"')
        + '<tr style="height:40px;' + sw(configdate.selectdoc, '', 'display:none') + '" class="seipro-monitorado-dates-selectdoc"><td colspan="2"><select data-act="setupdate" id="configDatesBox_listdocs">' + docsOptions + '</select></td></tr>'
        + '<tr style="height:10px;display:none" class="seipro-monitorado-dates-selectdoc"><td colspan="2"></td></tr>'
        + swRow('fa-calendar-check', 'De uma data específica', 'setdate', 'setdate', configdate.setdate)
        + '<tr style="height:40px;' + sw(configdate.setdate, '', 'display:none') + '" class="seipro-monitorado-dates-setdate"><td><i class="iconPopup fas fa-clock cinzaColor"></i> Data referencial</td>'
        + '<td><input type="date" data-act="preview" id="configDatesBox_date" value="' + configdate.date + '" style="width:130px;float:right;"></td></tr>'
        + '<tr style="height:10px;"><td colspan="2"><a class="newLink ' + sw(configdate.advanced, 'newLink_active', '') + '" data-act="advanced" style="font-size:10pt;cursor:pointer;margin:5px 0 0 0;float:right;"><i class="fas fa-wrench cinzaColor"></i> Opções avançadas</a></td></tr>'
        + '</table>'
        + '<table style="font-size:10pt;width:100%;' + sw(configdate.advanced, '', 'display:none') + '" class="seiProForm configDates_advanced">'
        + '<tr class="hrForm"><td colspan="4"></td></tr>'
        + '<tr style="height:40px;"><td colspan="2">Visualizar o resultado:</td></tr>'
        + swRow('fa-stopwatch', 'Em tempo relativo', 'countdown', 'countdown', configdate.countdown)
        + swRow('fa-calendar-day', 'Em número de dias', 'countdays', 'countdays', configdate.countdays)
        + '<tr style="height:40px;' + sw(configdate.countdays, '', 'display:none') + '" class="seipro-monitorado-dates-countdays"><td><i class="iconPopup iconSwitch fas fa-briefcase ' + sw(configdate.workday, 'azulColor', 'cinzaColor') + '"></i> Calcular em dias úteis</td>'
        + '<td><div class="onoffswitch" style="float:right;"><input type="checkbox" data-act="switch-icon" class="onoffswitch-checkbox" id="configDatesBox_workday" data-type="workday" tabindex="0" ' + (configdate.workday ? 'checked' : '') + '><label class="onoff-switch-label" for="configDatesBox_workday"></label></div></td></tr>'
        + '<tr class="hrForm"><td colspan="4"></td></tr>'
        + '<tr style="height:40px;"><td colspan="2">Sinalizar a partir:</td></tr>'
        + swRow('fa-pen-fancy', 'Da assinatura de um novo documento (EM BREVE)', 'newdoc', 'newdoc', configdate.newdoc)
        + '<tr class="configDates_newdoc"><td colspan="2"><span id="configDatesBox_newdoclist">' + appendArrayNewdoclist(configdate.newdoclist) + '</span></td></tr>'
        + '<tr style="height:40px;' + sw(configdate.newdoc, '', 'display:none') + '" class="configDates_newdoc"><td colspan="2"><select id="configDatesBox_listnewdoc" data-act="docs-change"><option value="0">Qualquer tipo de documento</option>' + tiposOptions + '</select></td></tr>'
        + '<tr style="height:10px;"><td colspan="2"></td></tr>'
        + swRow('fa-hourglass-half', 'Do número de dias decorridos', 'duedate', 'duedate', configdate.duedate)
        + '<tr style="height:40px;' + sw(configdate.duedate, '', 'display:none') + '" class="configDates_duedate"><td colspan="2">'
        + '<input type="number" data-act="preview" id="configDatesBox_duenumber" value="' + duenumber + '" style="width:40px;margin-left:35px !important;" min="0"> dias '
        + '<select id="configDatesBox_duecounter" data-act="preview" style="width:auto;"><option value="corrido" ' + sw(configdate.duecounter === 'corrido', 'selected', '') + '>corridos</option><option value="util" ' + sw(configdate.duecounter === 'util', 'selected', '') + '>úteis</option></select>'
        + '<select id="configDatesBox_duemode" data-act="preview" style="width:auto;"><option value="depois" ' + sw(configdate.duemode === 'depois', 'selected', '') + '>depois</option><option value="antes" ' + sw(configdate.duemode === 'antes', 'selected', '') + '>antes</option></select>'
        + '<span class="seipro-monitorado-dates-selectdoc" style="display:none">da data de assinatura</span><span class="seipro-monitorado-dates-setdate">da data de referência</span></td></tr>'
        + '<tr style="height:10px;" class="configDates_duedate"><td colspan="2"></td></tr>'
        + swRow('fa-calendar-alt', 'De uma data de vencimento específica', 'duesetdate', 'duesetdate', configdate.duesetdate)
        + '<tr style="height:40px;' + sw(configdate.duesetdate, '', 'display:none') + '" class="configDates_duesetdate"><td><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i> Data de vencimento</td>'
        + '<td><input type="date" data-act="preview" id="configDatesBox_duesetdt" value="' + configdate.dateDue + '" style="width:130px;float:right;"></td></tr>'
        + '</table>'
        + '<table style="font-size:10pt;width:100%;" class="seiProForm"><tr class="hrForm"><td colspan="4"></td></tr>'
        + '<tr style="height:40px;"><td colspan="2">Prévia:</td></tr>'
        + '<tr style="height:40px;"><td colspan="2"><div id="dateboxPreview" style="display:none;text-align:center;"></div></td></tr></table>'
        + '<input type="hidden" value="' + id_procedimento + '" id="configDatesBox_id_procedimento"></div>';
}

// ---- Switches mutuamente exclusivos (radio-like). fadeIn/fadeOut -> show/hide. ----
function switchGroup(el, o1, o2, o3) {
    const type = el.dataset.type;
    const group = o3 ? [o1, o2, o3] : [o1, o2];
    if (group.indexOf(type) !== -1) {
        let active;
        if (el.checked) active = type;
        else if (type === o2) active = o1;
        else active = o2;
        group.forEach((opt) => {
            const on = opt === active;
            const cb = byId('configDatesBox_' + opt);
            if (cb) {
                cb.checked = on;
                const row = cb.closest('tr');
                if (row) qsa('.iconSwitch', row).forEach((i) => i.classList.toggle('azulColor', on));
            }
            qsa('.' + configDateClass(opt)).forEach((n) => { n.style.display = on ? '' : 'none'; });
        });
    }
    const row = el.closest('tr');
    if (row) qsa('.iconSwitch', row).forEach((i) => i.classList.toggle('azulColor', el.checked));
}
function switchChange(el) {
    switchGroup(el, 'countdown', 'countdays');
    switchGroup(el, 'setdate', 'selectdoc');
    switchGroup(el, 'duedate', 'newdoc', 'duesetdate');
    preview();
    const sd = byId('configDatesBox_selectdoc');
    if (sd && sd.checked) setUpdate('update');
}
function switchIcon(el) {
    const row = el.closest('tr');
    if (row) qsa('.iconSwitch', row).forEach((i) => i.classList.toggle('azulColor', el.checked));
    preview();
}
function advanced(el) {
    qsa('.configDates_advanced').forEach((n) => { n.style.display = (n.style.display === 'none') ? '' : 'none'; });
    el.classList.toggle('newLink_active');
}
function setUpdate(mode) {
    const sel = byId('configDatesBox_listdocs');
    const opt = sel && sel.options[sel.selectedIndex];
    const dataSign = opt && opt.getAttribute('data-sign');
    if (dataSign) {
        byId('configDatesBox_date').value = moment()(dataSign, 'DD/MM/YYYY').format('YYYY-MM-DD');
        if (mode === 'update') preview();
    }
}
function docsChange(el) {
    const nameDoc = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
    const valueDoc = parseInt((el.value || '').trim());
    const listEl = byId('configDatesBox_newdoclist');
    const selected = qsa('.seipro-monitorado-datebox', listEl).map((s) => s.textContent.trim());
    if (valueDoc === 0) { listEl.innerHTML = ''; return; }
    if (!selected.includes(nameDoc)) {
        if (selected.length > 10) { alert('Atingido o limite de documentos para pesquisa (10)'); return; }
        listEl.insertAdjacentHTML('beforeend', appendNewdoclist(nameDoc));
    }
}

// ---- Leitura do formulário ----
function getConfigDates() {
    const chk = (id) => { const e = byId('configDatesBox_' + id); return !!(e && e.checked); };
    const val = (id) => { const e = byId('configDatesBox_' + id); return e ? (e.value || '').trim() : ''; };
    const duemode = val('duemode');
    let duenumber = val('duenumber');
    duenumber = (duemode === 'depois') ? duenumber : -Math.abs(duenumber);
    const newdoc = chk('newdoc');
    const listEl = byId('configDatesBox_newdoclist');
    const newdoclist = newdoc && listEl ? qsa('.seipro-monitorado-datebox', listEl).map((s) => s.textContent.trim()) : [];
    const countdays = chk('countdays'), duedate = chk('duedate'), duesetdate = chk('duesetdate');
    const listdocsSel = byId('configDatesBox_listdocs');
    const listdocs = listdocsSel && listdocsSel.options[listdocsSel.selectedIndex] ? listdocsSel.options[listdocsSel.selectedIndex].getAttribute('data-id-protocolo') : undefined;
    return {
        date: val('date'), dateDue: val('duesetdt'),
        advanced: (countdays || duedate || duesetdate || newdoclist.length > 0),
        newdoclist, listdocs, setdate: chk('setdate'), newdoc,
        countdown: chk('countdown'), countdays, workday: chk('workday'),
        duenumber: parseInt(duenumber), duecounter: val('duecounter'), duemode,
        duesetdate, duedate, selectdoc: chk('selectdoc')
    };
}

function applyAndClose(triggerEl, remove, ref) {
    const config = remove ? null : getConfigDates();
    const store = getStoreMonitoradoPro();
    const id = parseInt((byId('configDatesBox_id_procedimento') || {}).value || '');
    const idx = findMonitoradoIndex(store, id);
    if (idx < 0) { if (g('alertaBoxPro')) g('alertaBoxPro')('Error', 'exclamation-triangle', 'Erro ao cadastrar!'); return; }
    // Atualiza a linha do painel (quando aberta a partir do painel, não do frmAtividadeListar).
    const inAtividade = triggerEl && triggerEl.closest && triggerEl.closest('#frmAtividadeListar');
    const tr = qs('#monitoradoTablePro tr[data-id_procedimento="' + id + '"]');
    if (!inAtividade && tr) {
        const info = qs('.info_dates_monitorado', tr);
        if (info) { info.innerHTML = remove ? '' : g('getDatesPreview')(config); info.style.display = ''; }
        const txt = qs('.seipro-monitorado-dates-editor', tr); if (txt) txt.style.display = 'none';
        const editLink = qs('.followLinkDatesEdit', tr); if (editLink) editLink.style.display = '';
        const dateInput = qs('.seipro-monitorado-dates', tr); if (dateInput) dateInput.value = remove ? '' : config.date;
    }
    store.monitorados[idx].configdate = config;
    persistMonitoradoStore(store);
    if (g('alertaBoxPro')) g('alertaBoxPro')('Sucess', 'check-circle', 'Contagem de tempo ' + (remove ? 'removida' : 'cadastrada') + ' com sucesso!');
    if (ref) ref.close();
}

// ---- Fluxo de dados de sessão (select-doc): mantém globais de sessão ----
function waitProcessData(id, callback, onTimeout, requireDocs) {
    const eventName = 'sei-pro-process-session-updated';
    let resolved = false, timeoutId = null;
    const ready = (d) => monitoradoProcessDataReady(id, d) && (!requireDocs || typeof d.listDocumentosAssinados !== 'undefined');
    const handler = (event) => {
        const detail = (event && event.detail) || {};
        if (detail.id_procedimento != null && String(detail.id_procedimento) !== String(id)) return;
        const d = g('pullDadosProcessoSession')(id);
        if (ready(d)) { resolved = true; window.removeEventListener(eventName, handler); if (timeoutId) clearTimeout(timeoutId); callback(d); }
    };
    const d0 = g('pullDadosProcessoSession')(id);
    if (ready(d0)) { callback(d0); return true; }
    window.addEventListener(eventName, handler);
    timeoutId = setTimeout(() => { if (!resolved) { window.removeEventListener(eventName, handler); if (onTimeout) onTimeout(); } }, 15000);
    return false;
}
function getDadosSelectDoc(el, id) {
    if (!el.checked) return;
    globalRef.dadosProcessoPro = {};
    const cell = el.closest('tr') && el.closest('tr').querySelector('td');
    if (cell) cell.classList.add('editCellLoading');
    g('getDadosIframeProcessoPro')(String(id), 'monitorados');
    waitProcessData(id, () => {
        globalRef.dadosProcessoPro = g('pullDadosProcessoSession')(id);
        if (cell) cell.classList.remove('editCellLoading');
        updateSelect(id);
    }, () => { if (cell) cell.classList.remove('editCellLoading'); }, true);
}
function updateSelect(id) {
    const dados = globalRef.dadosProcessoPro;
    if (!dados || !Array.isArray(dados.listDocumentosAssinados) || !dados.listDocumentosAssinados.length) return;
    const sel = byId('configDatesBox_listdocs');
    const cur = sel ? (sel.value || '').trim() : '';
    sel.innerHTML = dados.listDocumentosAssinados.map((v) => {
        if (v.data_assinatura === '') return '';
        const s = (cur !== '' && cur == v.id_documento) ? 'selected' : '';
        return '<option data-sign="' + v.data_assinatura + '" data-id-protocolo="' + v.id_documento + '" ' + s + '>' + v.nome_documento + ' (SEI nº ' + v.nr_sei + ') [assinado em ' + v.data_assinatura + ']</option>';
    }).join('');
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id);
    if (idx >= 0) {
        store.monitorados[idx].documentos = dados.listDocumentosAssinados;
        store.monitorados[idx].andamento = dados.listAndamento.andamento;
        persistMonitoradoStore(store);
    }
}

function bindForm(body, id_procedimento) {
    body.addEventListener('change', (ev) => {
        const el = ev.target.closest('[data-act]');
        if (!el) return;
        switch (el.dataset.act) {
            case 'switch-change': switchChange(el); break;
            case 'switch-selectdoc': switchChange(el); getDadosSelectDoc(el, id_procedimento); break;
            case 'switch-icon': switchIcon(el); break;
            case 'preview': preview(); break;
            case 'setupdate': setUpdate('update'); break;
            case 'docs-change': docsChange(el); break;
            default: break;
        }
    });
    body.addEventListener('click', (ev) => {
        const adv = ev.target.closest('[data-act="advanced"]');
        if (adv) { ev.preventDefault(); advanced(adv); return; }
        const rm = ev.target.closest('.seipro-newdoc-remove');
        if (rm) { const sp = rm.closest('.seipro-monitorado-datebox'); if (sp) sp.remove(); }
    });
}

export function openBoxConfigDates(triggerEl) {
    const tr = triggerEl && triggerEl.closest ? triggerEl.closest('tr') : null;
    const id_procedimento = tr ? parseInt(tr.getAttribute('data-id_procedimento')) : NaN;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id_procedimento);
    const dateInputEl = triggerEl && triggerEl.closest('.seipro-monitorado-dates-editor') ? triggerEl.closest('.seipro-monitorado-dates-editor').querySelector('.seipro-monitorado-dates') : null;
    const dateInput = dateInputEl ? (dateInputEl.value || '').trim() : '';
    const configdate = getOptionsConfigDate(idx);
    configdate.date = (dateInput === '') ? configdate.date : dateInput;

    openModal({
        title: 'Processos Monitorados: Opções',
        width: 500,
        content: formHtml(configdate, id_procedimento, store, idx),
        buttons: [
            { text: 'Remover', onClick: (ref) => applyAndClose(triggerEl, true, ref) },
            { text: 'Ok', class: 'confirm', onClick: (ref) => applyAndClose(triggerEl, false, ref) }
        ],
        onOpen: (ref) => { bindForm(ref.body, id_procedimento); preview(); }
    });
}

// Checkbox "Manter em Processos Monitorados" (tela de visualização do processo).
function actionMonitoradoCheckbox(el) {
    const box = el.closest('.infraDivCheckbox');
    const optionsDiv = box ? box.querySelector('.seipro-monitorados-label-options') : null;
    if (el.checked) {
        if (g('actMonitoradoPro')) g('actMonitoradoPro')(false, 'add');
        if (optionsDiv) optionsDiv.style.display = '';
    } else {
        if (g('actMonitoradoPro')) g('actMonitoradoPro')(false, 'remove');
        if (optionsDiv) {
            optionsDiv.style.display = 'none';
            optionsDiv.querySelectorAll('.selectPro, #monitoradoPrazoSend, .seipro-monitorado-tags-input').forEach((i) => { i.value = ''; });
            optionsDiv.querySelectorAll('.info_tags_follow').forEach((n) => { n.innerHTML = ''; });
            optionsDiv.querySelectorAll('div.tagsinput .tag').forEach((n) => n.remove());
        }
    }
}

// Atualiza a legenda "N registros" da tabela (linhas visíveis).
function updateCountTableMonitorado() {
    const rows = qsa('.tableFollow tbody tr').filter((r) => r.offsetParent !== null);
    const cap = qs('.tableFollow caption.infraCaption');
    if (cap) cap.textContent = rows.length + (rows.length === 1 ? ' registro:' : ' registros:');
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
// Nomes globais (esquerda) ainda chamados por HTML/JS legado durante a transição.
export const legacyApi = {
    openBoxConfigDates,
    getConfigDatesMonitorado: getConfigDates,
    configDatesSwitchChange: switchChange,
    configDatesSwitchIcon: switchIcon,
    configDatesAdvanced: advanced,
    configDatesDocsChange: docsChange,
    configDatesSetUpdate: setUpdate,
    updateSelectMonitorados: updateSelect,
    waitMonitoradoProcessData: waitProcessData,
    actionMonitoradoCheckbox,
    updateCountTableMonitorado
};
