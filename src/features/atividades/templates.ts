// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades — HTML/template factories for panel chrome shells.
 * Markup with behaviour still lives in panel.js until full view extraction.
 */

export function atividadesPanelRootHtml(attrs = {}) {
    const order = attrs['data-order'] != null ? ` data-order="${attrs['data-order']}"` : '';
    return `<div id="atividadesPro" class="panelHomePro seipro-atividades-root" style="display: inline-block; width: 100%;"${order}></div>`;
}

export function atividadesPanelDivHtml(style = '') {
    const styleAttr = style ? ` style="${style}"` : '';
    return `<div id="atividadesProDiv" class="seipro-atividades-panel"${styleAttr}></div>`;
}

export const ATIVIDADES_ACT = Object.freeze({
    PANEL_SHOW: 'atividades-panel-show',
    PANEL_HIDE: 'atividades-panel-hide',
    PANEL_VIEW: 'atividades-panel-view',
    PANEL_AFAST: 'atividades-panel-afast',
    PANEL_RELATORIO: 'atividades-panel-relatorio',
    UPDATE: 'atividades-update',
    PANEL_HOME: 'atividades-panel-home',
    CONFIG_MODAL: 'atividades-config-modal',
    AFASTAMENTO_SAVE: 'atividades-afastamento-save',
    AFASTAMENTO_REMOVE: 'atividades-afastamento-remove',
    SELECT_ALL: 'atividades-select-all',
    CHANGE_PERFIL: 'atividades-change-perfil',
    CHANGE_CHART: 'atividades-change-chart',
    CALL: 'atividades-call',
    DIALOG_DOC: 'atividades-dialog-doc',
    COMPOSITE: 'atividades-composite',
    TOGGLE_PAINEL: 'atividades-toggle-painel',
    OPEN_LINK: 'atividades-call'
});

/** Escape attribute values for HTML data-* attrs. */
export function escapeAttr(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

/** Build data-act attrs for openDialogDoc previews. */
export function atividadesDialogDocAttrs({ title, id_procedimento, id_documento }) {
    return [
        `data-act="${ATIVIDADES_ACT.DIALOG_DOC}"`,
        `data-title="${escapeAttr(title)}"`,
        `data-id-procedimento="${escapeAttr(id_procedimento)}"`,
        `data-id-documento="${escapeAttr(id_documento)}"`
    ].join(' ');
}

/**
 * Parse legacy action strings used by toolbar icons into data-act attrs.
 * Examples: "saveAtividade()", "selectAtividadeBox('start')"
 */
/** Gantt bar legacy class → dual seipro modifier (P6). */
const BAR_CLASS_MAP = Object.freeze({
    'bar-em-execucao': 'seipro-atividades-bar--em-execucao',
    'bar-iniciado': 'seipro-atividades-bar--iniciado',
    'bar-fora-execucao': 'seipro-atividades-bar--fora-execucao',
    'bar-concluido-noprazo': 'seipro-atividades-bar--concluido-noprazo',
    'bar-nao-iniciado': 'seipro-atividades-bar--nao-iniciado',
    'bar-concluido-foraprazo': 'seipro-atividades-bar--concluido-foraprazo',
    'bar-ematraso': 'seipro-atividades-bar--ematraso'
});

export function withSeiproBarClasses(classStr) {
    return String(classStr || '')
        .split(/\s+/)
        .filter(Boolean)
        .map((cls) => (BAR_CLASS_MAP[cls] ? `${cls} ${BAR_CLASS_MAP[cls]}` : cls))
        .join(' ');
}

export function atividadesActionAttrs(action, { scope = '' } = {}) {
    const raw = String(action || '').trim();
    const m = raw.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);
    if (!m) {
        return `data-act="${ATIVIDADES_ACT.CALL}" data-fn="${escapeAttr(raw)}" data-pass-el="0"${scope ? ` data-scope="${scope}"` : ''}`;
    }
    const fn = m[1];
    const inner = m[2].trim();
    let attrs = `data-act="${ATIVIDADES_ACT.CALL}" data-fn="${escapeAttr(fn)}" data-pass-el="0"`;
    if (scope) attrs += ` data-scope="${scope}"`;
    if (inner) {
        const lit = inner.match(/^'([^']*)'$/) || inner.match(/^"([^"]*)"$/);
        if (lit) attrs += ` data-arg="${escapeAttr(lit[1])}"`;
        else if (/^\d+$/.test(inner)) attrs += ` data-id="${inner}"`;
        else attrs += ` data-arg="${escapeAttr(inner.replace(/^'|'$/g, ''))}"`;
    }
    return attrs;
}
