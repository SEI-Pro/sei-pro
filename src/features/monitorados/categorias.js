import { aliasGlobal, globalRef } from '../../core/global.js';
import { qs, qsa } from './dom.js';
import { openModal } from '../../shared/ui/modal.js';
import { getStoreMonitoradoPro, persistMonitoradoStore } from './store.js';
import { findMonitoradoIndex } from './domain.js';

/**
 * Monitorados — Categorias, vanilla ESM. Substitui chosen + jQuery UI dialog:
 * <select> nativo + modal compartilhado para "nova categoria". onchange inline
 * -> data-act, despachado por um listener delegado no document (home).
 *
 * selectCategoryMonitorado é exposto por aliasGlobal (chamado pelo painel e pelo
 * legado de visualização). A edição inline da linha e o filtro do cabeçalho são
 * roteados pelo dispatcher de categorias.
 */

const g = (name) => globalRef[name];

// Monta o <select> de categorias. `func` ('changeCategoryMonitorado' |
// 'changePanelCategoryMonitorado') vira data-act; sem onchange inline.
function selectCategoryMonitorado(select = '', func = false, newItem = false, id_procedimento = 0) {
    const list = getStoreMonitoradoPro().monitorados;
    let cats = globalRef.jmespath.search(list, '[*].categoria');
    cats = (cats !== null && typeof globalRef.uniqPro === 'function') ? globalRef.uniqPro(cats) : (cats || []);
    const options = (cats || []).map((v) => {
        if (v === null || v === '') return '';
        return '<option value="' + v + '" ' + (select !== null && v == select ? 'selected' : '') + '>' + v + '</option>';
    }).join('');
    const act = func === 'changePanelCategoryMonitorado' ? 'category-panel' : (func === 'changeCategoryMonitorado' ? 'category-change' : '');
    const attrs = id_procedimento
        ? 'style="margin:0 !important;font-size:10pt;" data-id="' + id_procedimento + '"'
        : 'style="width:100%;font-size:10pt;"';
    return '<select class="selectPro" ' + attrs + (act ? ' data-act="' + act + '"' : '') + '>'
        + '<option value="&nbsp;">&nbsp;</option>' + options
        + (newItem ? '<option value="new">➕ Nova categoria</option>' : '') + '</select>';
}

// Pencil da coluna Categoria: alterna entre texto e <select> inline.
function editCategoryMonitorado(el, id_procedimento) {
    const td = el.closest('td');
    const catElem = qs('.info_category', td);
    const catTxt = qs('.info_category_txt', td);
    const icon = el.querySelector('i');
    if (catElem && catElem.offsetParent !== null) {
        catElem.style.display = 'none';
        if (catTxt) catTxt.style.display = '';
        if (icon) icon.className = 'fas fa-pencil-alt';
    } else {
        const value = globalRef.jmespath.search(getStoreMonitoradoPro().monitorados, "[?id_procedimento=='" + id_procedimento + "'] | [0]");
        catElem.style.display = '';
        catElem.innerHTML = selectCategoryMonitorado(value ? value.categoria : '', 'changeCategoryMonitorado', true, id_procedimento);
        if (catTxt) catTxt.style.display = 'none';
        if (icon) icon.className = 'fas fa-thumbs-up';
    }
}

function changePanelCategoryMonitorado(el) {
    if (typeof globalRef.setOptionsPro === 'function') globalRef.setOptionsPro('panelMonitoradosView', (el.value || '').trim());
    if (typeof globalRef.setPanelMonitorados === 'function') globalRef.setPanelMonitorados('refresh');
}

function saveCategoryMonitorado(refEl, value) {
    const id = refEl && refEl.dataset ? refEl.dataset.id : undefined;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id);
    if (idx >= 0) store.monitorados[idx].categoria = value;
    persistMonitoradoStore(store);
    if (typeof globalRef.setPanelMonitorados === 'function') globalRef.setPanelMonitorados('refresh');
}

function promptNewCategory(selectEl) {
    let saved = false;
    const commit = (ref, v) => { saved = true; saveCategoryMonitorado(selectEl, v); ref.close(); };
    openModal({
        title: 'Adicionar nova categoria', width: 400,
        content: '<div class="seiProForm" style="text-align:center;font-size:9pt;"><i class="fas fa-info-circle azulColor" style="margin-right:5px;"></i> Digite o nome da nova categoria:<br><br><input type="text" class="required infraText" id="nomeNovoItem" style="width:90% !important;"></div>',
        buttons: [{ text: 'Ok', class: 'confirm', onClick: (ref) => commit(ref, ref.body.querySelector('#nomeNovoItem').value.trim()) }],
        onOpen: (ref) => {
            const inp = ref.body.querySelector('#nomeNovoItem');
            inp.focus();
            inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(ref, inp.value.trim()); });
        },
        onClose: () => {
            if (saved) return;
            // Cancelado: reverte a célula da linha (volta ao texto).
            const td = selectEl.closest('td');
            if (td) {
                const catElem = qs('.info_category', td);
                const catTxt = qs('.info_category_txt', td);
                if (catElem) { catElem.style.display = 'none'; catElem.innerHTML = ''; }
                if (catTxt) catTxt.style.display = '';
            }
        }
    });
}

function changeCategoryMonitorado(selectEl) {
    if (selectEl.value === 'new') promptNewCategory(selectEl);
    else saveCategoryMonitorado(selectEl, (selectEl.value || '').trim());
}

export function installCategorias() {
    aliasGlobal('selectCategoryMonitorado', selectCategoryMonitorado);
    aliasGlobal('editCategoryMonitorado', editCategoryMonitorado);
    aliasGlobal('changePanelCategoryMonitorado', changePanelCategoryMonitorado);
    aliasGlobal('changeCategoryMonitorado', changeCategoryMonitorado);
    aliasGlobal('saveCategoryMonitorado', saveCategoryMonitorado);

    if (globalRef.__seiproMonitoradoCategoriaBound) return;
    globalRef.__seiproMonitoradoCategoriaBound = true;
    document.addEventListener('change', (ev) => {
        const el = ev.target.closest('select.selectPro[data-act]');
        if (!el) return;
        if (el.dataset.act === 'category-panel') changePanelCategoryMonitorado(el);
        else if (el.dataset.act === 'category-change') changeCategoryMonitorado(el);
    });
}
