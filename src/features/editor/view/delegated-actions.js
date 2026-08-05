import { api } from '../api.js';
import { state } from '../state.js';

const DIRECT_ACTIONS = new Set([
    'hoverTapTip',
    'setTagTip',
    'removeDynamicField',
    'editDynamicField',
    'replaceDadosEditor',
    'newDynamicField',
    'removeReviewPro',
    'addCommentReviewPro',
    'quickTableClick',
    'changeColorTable',
    'getSearchLegisMore',
    'insertLegisSEI',
    'getSearchLegis',
    'resetOptionsImgBg'
]);
const NO_ARGUMENT_ACTIONS = new Set([
    'getDadosIframeProcessoPublicoPro',
    'toggleOptionsQR',
    'resetOptionsQR'
]);
const TOOLBAR_ACTIONS = [
    ['.getTablestylesButtom', 'getSyleSelectedTable'],
    ['.getQuickTableButtom', 'getQuickTable'],
    ['.importDocButtom', 'importDocPro'],
    ['.getLinkLegisButtom', 'getLegisSEI'],
    ['.getCapLetterButtom', 'convertFirstLetter'],
    ['.getFontSizeUpButtom', 'changeFontSize', 'up'],
    ['.getFontSizeDownButtom', 'changeFontSize', 'down'],
    ['.getCopyStyleButtom', 'setCopyStyle'],
    ['.getAlignButtom', 'openAlignText'],
    ['.getAlignLeftButtom', 'setAlignText', 'left'],
    ['.getAlignCenterButtom', 'setAlignText', 'center'],
    ['.getAlignRightButtom', 'setAlignText', 'right'],
    ['.getAlignJustifyButtom', 'setAlignText', 'justify'],
    ['.getCitacaoDocumentoButtom', 'getCitacaoDocumento'],
    ['.getNotaRodapeButtom', 'getNotaRodape'],
    ['.getRefInternaButtom', 'getRefInterna'],
    ['.getPlataformAIButtom', 'loadPlataformAI', undefined, 'ferramentasia'],
    ['.getSumarioButtom', 'getSumarioDocumento'],
    ['.getDadosProcessoButtom', 'getDadosEditor'],
    ['.getQrCodeButtom', 'getQrCode'],
    ['.getPageBreakButtom', 'getPageBreak'],
    ['.getSessionBreakButtom', 'getSessionBreak'],
    ['.getBatchImgQualityButtom', 'openDialogBatchImgQuality'],
    ['.getInsertCheckboxButtom', 'getInsertCheckboxButtom'],
    ['.getProcessoPublicoButton', 'openDialogProcessoPublicoPro'],
    ['.getMinutaWatermarkButton', 'getMinutaWatermark'],
    ['.pageImageBackgroundButtom', 'pageImageBackground'],
    ['.getMarkSigiloButton', 'getMarkSigilo'],
    ['.getBoxSigiloButton', 'getBoxSigilo'],
    ['.getReviewButton', 'getBoxReview'],
    ['.getCtrReviewButton', 'getBoxCtrReview'],
    ['.getDitadoButton', 'getBoxDitado'],
    ['.getCtrDitadoButton', 'getBoxCtrDitado'],
    ['.getNewStyleButton', 'getBoxStyleEditor'],
    ['.getLegisButtom', 'initLegis', undefined, undefined, true],
    ['.cke_combo_button', 'setDarkModeCkePanel']
];
const installedRoots = new WeakSet();

function actionArguments(element, action) {
    if (action === 'actionsMarkSigilo') return [element, element.dataset.seiproMode || ''];
    if (action === 'scroolToReview') return [element.dataset.seiproReviewId || ''];
    if (['openLinkPro', 'copyLinkPro', 'removeLinkPro'].includes(action)) {
        return [element.dataset.seiproLinkRef || '', element.dataset.seiproEditorId || ''];
    }
    if (action === 'editLinkPro') return [element.dataset.seiproEditorId || ''];
    if (NO_ARGUMENT_ACTIONS.has(action)) return [];
    if (DIRECT_ACTIONS.has(action)) return [element];
    return null;
}

function invoke(element) {
    const action = element?.dataset?.seiproAction;
    const args = actionArguments(element, action);
    const handler = action && api[action];
    if (!args || typeof handler !== 'function') return false;
    handler(...args);
    return true;
}

function editorInstanceFor(element) {
    const editorId = element?.closest?.('div.cke')?.id?.replace(/^cke_/, '');
    return editorId ? globalThis.CKEDITOR?.instances?.[editorId] : null;
}

function isToolbarElementAvailable(element) {
    if (!element?.closest?.('.cke_button_disabled')) return true;
    return editorInstanceFor(element)?.readOnly === false;
}

function resolveToolbarElement(target, selector) {
    const clicked = target?.closest?.(selector);
    if (!clicked) return null;
    if (isToolbarElementAvailable(clicked)) return clicked;

    const candidates = Array.from(clicked.ownerDocument?.querySelectorAll?.(selector) || [])
        .filter(isToolbarElementAvailable);
    if (!candidates.length) return null;

    const focusedEditorId = state.idEditor || globalThis.CKEDITOR?.currentInstance?.name || '';
    const activeEditorId = focusedEditorId ? `cke_${focusedEditorId}` : '';
    return candidates.find((candidate) => candidate.closest('div.cke')?.id === activeEditorId)
        // In SEI's sectioned editor, the main body is the last editable section.
        || candidates[candidates.length - 1];
}

function invokeToolbarAction(target) {
    for (const [selector, action, extraArgument, requiredConfig, useGlobal] of TOOLBAR_ACTIONS) {
        const element = resolveToolbarElement(target, selector);
        if (!element) continue;
        if (requiredConfig
            && typeof globalThis.restrictConfigValue === 'function'
            && !globalThis.restrictConfigValue(requiredConfig)) {
            return false;
        }
        const handler = useGlobal ? globalThis[action] : api[action];
        if (typeof handler !== 'function') return false;
        const args = extraArgument === undefined ? [element] : [element, extraArgument];
        if (selector === '.cke_combo_button') args.length = 0;
        handler(...args);
        return true;
    }
    return false;
}

export function installDelegatedActions(root = document) {
    if (!root?.addEventListener || installedRoots.has(root)) return false;
    installedRoots.add(root);
    root.addEventListener('click', (event) => {
        const target = event.target?.closest?.('[data-seipro-action]');
        if ((!target || !invoke(target)) && !invokeToolbarAction(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
    }, true);
    root.addEventListener('change', (event) => {
        const target = event.target?.closest?.('[data-seipro-change]');
        const action = target?.dataset?.seiproChange;
        if (!target || action !== 'changeColorTable' || typeof api.changeColorTable !== 'function') return;
        api.changeColorTable(target);
    });
    root.addEventListener('mouseover', (event) => {
        const target = event.target?.closest?.('[data-seipro-hover]');
        const action = target?.dataset?.seiproHover;
        if (!target || typeof api[action] !== 'function') return;
        api[action](target);
    });
    root.addEventListener('mouseout', (event) => {
        const target = event.target?.closest?.('[data-seipro-leave]');
        const action = target?.dataset?.seiproLeave;
        if (!target || typeof api[action] !== 'function') return;
        api[action](target);
    });
    return true;
}

export function installEditorDelegatedActions({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    setIntervalFn = globalThis.setInterval,
    clearIntervalFn = globalThis.clearInterval
} = {}) {
    installDelegatedActions(document);
    const attachFrames = () => {
        Object.values(getInstances()).forEach((editor) => {
            installDelegatedActions(editor?.document?.$);
        });
    };
    attachFrames();
    const timer = setIntervalFn(attachFrames, 1_000);
    return () => clearIntervalFn(timer);
}
