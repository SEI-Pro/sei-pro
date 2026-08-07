// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades — delegated view handlers (data-act).
 *
 * Conventions:
 *   data-act="atividades-<special>"     — named chrome / composite acts
 *   data-act="atividades-call"          — generic call via data-fn
 *     data-fn="removeConfigRow"         — global function name
 *     data-scope="parent"               — call parent[fn] (iframe → parent)
 *     data-id / data-arg / data-arg2    — extra scalar args
 *     data-pass-el="0"|"false"          — omit `el` as first arg
 *
 * Replaces MAIN-world inline onclick/onchange across the feature.
 */
import { on } from '../../dom/index.js';
import { resolveAtividadesHandler } from './handlers.js';
import { getAtividadesContext } from './context.js';

function callScoped(scope, name, ...args) {
    const fn = resolveAtividadesHandler(name, scope || '');
    if (typeof fn === 'function') return fn(...args);
    return undefined;
}

function readArgs(el) {
    const args = [];
    const passEl = el.getAttribute('data-pass-el');
    if (passEl !== '0' && passEl !== 'false') args.push(el);

    const id = el.getAttribute('data-id');
    if (id != null && id !== '') args.push(/^-?\d+$/.test(id) ? Number(id) : id);

    const arg = el.getAttribute('data-arg');
    if (arg != null) args.push(arg);

    const arg2 = el.getAttribute('data-arg2');
    if (arg2 != null) args.push(arg2);

    const arg3 = el.getAttribute('data-arg3');
    if (arg3 != null) args.push(arg3);

    return args;
}

function dispatchCall(el, ev) {
    const fn = el.getAttribute('data-fn');
    if (!fn) return false;
    const scope = el.getAttribute('data-scope') || '';
    const args = readArgs(el);
    // cloneConfig historically receives the click event as 2nd arg when present.
    if (fn === 'cloneConfig' && ev) args.push(ev);
    callScoped(scope, fn, ...args);
    return true;
}

function dispatchSpecial(act, el, ev) {
    switch (act) {
        case 'atividades-panel-show':
            callScoped('', 'toggleTablePro', '#atividadesProDiv', 'show');
            callScoped('', 'getPanelAtividades_');
            return true;
        case 'atividades-panel-hide':
            callScoped('', 'toggleTablePro', '#atividadesProDiv', 'hide');
            return true;
        case 'atividades-panel-view':
            callScoped('', 'getPanelAtiv', el);
            return true;
        case 'atividades-panel-afast':
            callScoped('', 'getPanelAfast', el);
            return true;
        case 'atividades-panel-relatorio':
            callScoped('', 'getPanelRelatorio', el);
            return true;
        case 'atividades-update':
            callScoped('', 'updateAtividade_', el);
            return true;
        case 'atividades-panel-home':
            callScoped('', 'changePanelHome', el);
            return true;
        case 'atividades-config-modal':
            callScoped('', 'openModalConfigPanel');
            return true;
        case 'atividades-afastamento-save': {
            const id = el.getAttribute('data-id');
            if (id != null && id !== '') callScoped('', 'saveAfastamento', el, /^\d+$/.test(id) ? Number(id) : id);
            else callScoped('', 'saveAfastamento', el);
            return true;
        }
        case 'atividades-afastamento-remove': {
            const id = el.getAttribute('data-id');
            if (id != null && id !== '') callScoped('', 'removeAfastamento', el, /^\d+$/.test(id) ? Number(id) : id);
            else callScoped('', 'removeAfastamento', el);
            return true;
        }
        case 'atividades-select-all':
            callScoped('', 'setSelectAllTr', el);
            return true;
        case 'atividades-change-perfil':
            callScoped('', 'changePerfilAtiv', el);
            return true;
        case 'atividades-change-chart':
            callScoped('', 'changeChartAtiv', el);
            return true;
        case 'atividades-dismiss-alert':
            if (el.closest) {
                const box = el.closest('div');
                if (box) box.remove();
            }
            return true;
        case 'atividades-tablesorter-cancel':
            if (typeof globalThis.$ === 'function') {
                globalThis.$(el).closest('table').trigger('updateAll');
                globalThis.$(el).remove();
            }
            return true;
        case 'atividades-gantt-hide-popup': {
            const key = el.getAttribute('data-gantt') || 'ganttAtividades';
            const gantt = typeof globalThis !== 'undefined' ? globalThis[key] : null;
            if (gantt && typeof gantt.hide_popup === 'function') gantt.hide_popup();
            return true;
        }
        case 'atividades-toggle-painel': {
            const targetId = el.getAttribute('data-target') || 'profileProDiv';
            const mode = el.getAttribute('data-mode') || 'hide';
            callScoped('', 'togglePainelPro', targetId, mode);
            return true;
        }
        case 'atividades-dialog-doc': {
            callScoped('', 'openDialogDoc', {
                title: el.getAttribute('data-title') || '',
                id_procedimento: el.getAttribute('data-id-procedimento') || '',
                id_documento: el.getAttribute('data-id-documento') || ''
            });
            return true;
        }
        case 'atividades-comment-homologacao': {
            if (typeof globalThis.$ === 'function') {
                const ok = globalThis.$(el).val().length > 100;
                callScoped('', 'updateButtonConfirm', el, ok);
            }
            return true;
        }
        case 'atividades-open-box-icons':
            callScoped(
                el.getAttribute('data-scope') || 'parent',
                'openBoxIconsFA',
                el.getAttribute('data-arg') || 'selectIconEtiqueta',
                el.getAttribute('data-arg2') || 'afastamento',
                el.getAttribute('data-arg3') || 'options'
            );
            return true;
        case 'atividades-composite': {
            const chain = (el.getAttribute('data-chain') || '').split('|').filter(Boolean);
            const scope = el.getAttribute('data-scope') || '';
            chain.forEach((name) => {
                if (name === 'repairTemposDemandaQuick') callScoped('', name);
                else if (name === 'filterReset') {
                    if (typeof globalThis.$ === 'function') globalThis.$(el).closest('table').trigger('filterReset');
                } else if (name === 'checkTempoProdutividade') {
                    if (typeof globalThis.$ === 'function') callScoped('', name, globalThis.$(el));
                } else if (name === 'updateRecalculaPrazo') callScoped('', name, el);
                else callScoped(scope, name, el);
            });
            return true;
        }
        case 'atividades-dynamic-action': {
            // Markup builders set data-fn to the exported function name.
            return dispatchCall(el, ev);
        }
        default:
            return false;
    }
}

function applyInputFilter(el) {
    const filter = el.getAttribute('data-input-filter');
    if (!filter || typeof el.value !== 'string') return;
    if (filter === 'digits') {
        el.value = el.value.replace(/[^0-9]/g, '');
        return;
    }
    if (filter === 'clamp-minmax' && el.value !== '') {
        const n = parseInt(el.value, 10);
        const max = parseInt(el.max, 10);
        const min = parseInt(el.min, 10);
        if (!Number.isNaN(n) && !Number.isNaN(max) && n > max) el.value = String(max);
        else if (!Number.isNaN(n) && !Number.isNaN(min) && n < min) el.value = String(min);
    }
}

/** data-on="blur,input,keyup" — optional; click/change always allowed. */
function isEventAllowed(ev, el, act) {
    if (ev.type === 'click' || ev.type === 'change') return true;
    if (act === 'atividades-comment-homologacao' && ev.type === 'input') return true;
    const on = el.getAttribute('data-on');
    if (!on) return false;
    const tokens = on.split(',').map((s) => s.trim());
    if (ev.type === 'focusout') return tokens.includes('blur') || tokens.includes('focusout');
    return tokens.includes(ev.type);
}

function handleAct(ev, el) {
    const act = el.getAttribute('data-act');
    if (!act || act.indexOf('atividades-') !== 0) return;
    if (!isEventAllowed(ev, el, act)) return;

    // Optional alternate handler on blur (e.g. select saves via changeSelectConfigItem).
    if (ev.type === 'focusout' && el.getAttribute('data-blur-fn')) {
        const blurFn = el.getAttribute('data-blur-fn');
        const scope = el.getAttribute('data-scope') || '';
        callScoped(scope, blurFn, el);
        return;
    }

    if (act === 'atividades-call' || act === 'atividades-dynamic-action') {
        if (ev.type === 'click') ev.preventDefault();
        dispatchCall(el, ev);
        return;
    }

    if (dispatchSpecial(act, el, ev)) {
        if (ev.type === 'click') ev.preventDefault();
    }
}

/**
 * Install once on `root` (default document). Safe to call multiple times.
 */
export function installAtividadesView(root) {
    const target = root || (typeof document !== 'undefined' ? document : null);
    const page = getAtividadesContext().page;
    if (!target || target.__seiproAtividadesViewBound) return;
    target.__seiproAtividadesViewBound = true;

    on(target, 'click', '[data-act^="atividades-"]', function (ev, el) {
        handleAct(ev, el);
    });

    on(target, 'change', '[data-act^="atividades-"]', function (ev, el) {
        handleAct(ev, el);
    });

    // focusout bubbles (unlike blur) — covers former onblur handlers.
    on(target, 'focusout', '[data-act^="atividades-"]', function (ev, el) {
        handleAct(ev, el);
    });

    on(target, 'input', '[data-act^="atividades-"], [data-input-filter]', function (ev, el) {
        if (el.hasAttribute('data-input-filter')) applyInputFilter(el);
        if (el.getAttribute('data-act')) handleAct(ev, el);
    });

    on(target, 'keyup', '[data-act^="atividades-"]', function (ev, el) {
        handleAct(ev, el);
    });

    // Enter on checklist inputs (was onkeypress inline in kanban).
    on(target, 'keydown', '[data-act^="atividades-"][data-enter-fn]', function (ev, el) {
        if (ev.key !== 'Enter' && ev.which !== 13) return;
        ev.preventDefault();
        const fn = el.getAttribute('data-enter-fn');
        const scope = el.getAttribute('data-scope') || '';
        const arg = el.getAttribute('data-enter-arg');
        if (fn) callScoped(scope, fn, el, arg);
    });

    // Star hover + select-all tip (were inline onmouseover/out calling feature globals).
    on(target, 'mouseover', '[data-hover-fn]', function (ev, el) {
        const fn = el.getAttribute('data-hover-fn');
        if (!fn) return;
        if (el.hasAttribute('data-hover-arg')) {
            const arg = el.getAttribute('data-hover-arg');
            if (arg === '') callScoped('', fn, el);
            else callScoped('', fn, el, arg);
        } else {
            callScoped('', fn, el, 'over');
        }
    });
    on(target, 'mouseout', '[data-hover-fn]', function (ev, el) {
        const fn = el.getAttribute('data-hover-fn');
        if (!fn) return;
        // Select-all links use data-hover-arg="" only to refresh tip text; hide on leave.
        if (!el.hasAttribute('data-hover-out-arg') && el.getAttribute('data-hover-arg') === '') {
            if (typeof page.infraTooltipOcultar === 'function') page.infraTooltipOcultar();
            return;
        }
        const arg = el.hasAttribute('data-hover-out-arg')
            ? el.getAttribute('data-hover-out-arg')
            : 'out';
        callScoped('', fn, el, arg);
    });

    // Delegated tooltips (were inline onmouseover/out → infraTooltipMostrar/Ocultar).
    on(target, 'mouseover', '[data-tip]', function (ev, el) {
        const tip = el.getAttribute('data-tip');
        if (tip == null || tip === '') return;
        if (typeof page.infraTooltipMostrar !== 'function') return;
        const title = el.getAttribute('data-tip-title');
        if (title != null && title !== '') page.infraTooltipMostrar(tip, title);
        else page.infraTooltipMostrar(tip);
    });
    on(target, 'mouseout', '[data-tip]', function () {
        if (typeof page.infraTooltipOcultar === 'function') page.infraTooltipOcultar();
    });
}

/** @deprecated thin seed kept for modules composition / structure tests */
export function noopAtividadesView() {
    return null;
}

export {
    callScoped as __testCallScoped,
    readArgs as __testReadArgs,
    dispatchCall as __testDispatchCall,
    dispatchSpecial as __testDispatchSpecial
};
