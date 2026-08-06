#!/usr/bin/env node
/**
 * P6: rewrite atividades/style.css #ids → .seipro-* and dual-class markup.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cssPath = join(root, 'src/features/atividades/style.css');
const dir = join(root, 'src/features/atividades');

/** Legacy id → seipro class (ids kept in markup for jQuery). */
const ID_MAP = {
    atividadesPro: 'seipro-atividades-root',
    atividadesProDiv: 'seipro-atividades-panel',
    atividadesProActions: 'seipro-atividades-actions',
    atividadesStatus: 'seipro-atividades-status',
    tabelaAtivPanel: 'seipro-atividades-table-panel',
    ganttAtivPanel: 'seipro-atividades-gantt',
    ganttRecorrenciaPanel: 'seipro-atividades-gantt-recorrencia',
    ganttAfastamentoPanel: 'seipro-atividades-gantt-afastamento',
    ganttHistoryPainel: 'seipro-atividades-gantt-history',
    chartAtivPanel: 'seipro-atividades-chart',
    tableAfastamentoPanel: 'seipro-atividades-afastamento-table',
    tableRelatorioPanel: 'seipro-atividades-relatorio-panel',
    tabsPanelConfig: 'seipro-atividades-config-tabs',
    boxAtividade: 'seipro-atividades-box',
    boxHistory: 'seipro-atividades-history',
    ativ_etiquetas: 'seipro-atividades-etiquetas',
    infoAtivTagsPro: 'seipro-atividades-tags-input',
    // Orphan / legacy progress panels — keep as seipro for CSS, no markup required
    atividadesStatusTablePro: 'seipro-atividades-status-table',
    atividadesAnaliseGerencialPro: 'seipro-atividades-analise-gerencial',
    atividadesDistribuicaoPro: 'seipro-atividades-distribuicao'
};

/** Unprefixed feature classes → seipro (dual-class in markup). */
const CLASS_MAP = {
    tableAtividades: 'seipro-atividades-table',
    atividadeWork: 'seipro-atividades-work',
    atividadeInfo: 'seipro-atividades-info',
    atividadeBoxDisplay: 'seipro-atividades-box-display',
    atividadesProStatus: 'seipro-atividades-status',
    atividadesBtnPanel: 'seipro-atividades-btn-panel',
    filterTableAtivStatus: 'seipro-atividades-filter-status',
    ganttAtividade: 'seipro-atividades-gantt',
    afastamentoPanelPro: 'seipro-atividades-afastamento',
    relatorioPanelPro: 'seipro-atividades-relatorio',
    chartAtividade: 'seipro-atividades-chart',
    panelInfoHomeAtividade: 'seipro-atividades-info-home',
    iconAtividade: 'seipro-atividades-icon',
    iconBoxAtividade: 'seipro-atividades-icon-box',
    celStatusAtividade: 'seipro-atividades-status-cell',
    ativProcessos: 'seipro-atividades-processos',
    listMultProcessos: 'seipro-atividades-processos-list',
    'bar-em-execucao': 'seipro-atividades-bar--em-execucao',
    'bar-iniciado': 'seipro-atividades-bar--iniciado',
    'bar-fora-execucao': 'seipro-atividades-bar--fora-execucao',
    'bar-concluido-noprazo': 'seipro-atividades-bar--concluido-noprazo',
    'bar-nao-iniciado': 'seipro-atividades-bar--nao-iniciado',
    'bar-concluido-foraprazo': 'seipro-atividades-bar--concluido-foraprazo',
    'bar-ematraso': 'seipro-atividades-bar--ematraso',
    minView: 'seipro-atividades--min'
};

function rewriteCss(css) {
    let out = css;
    // Prefer longest ids first
    for (const [id, cls] of Object.entries(ID_MAP).sort((a, b) => b[0].length - a[0].length)) {
        out = out.replace(new RegExp(`#${id}\\b`, 'g'), `.${cls}`);
    }
    for (const [oldCls, newCls] of Object.entries(CLASS_MAP).sort((a, b) => b[0].length - a[0].length)) {
        // .oldCls → .newCls (word boundary after)
        out = out.replace(new RegExp(`\\.${oldCls.replace(/-/g, '\\-')}\\b`, 'g'), `.${newCls}`);
    }
    // #atividadesPro.minView already handled via id+class maps → .seipro-atividades-root.seipro-atividades--min
    out = out.replace(
        /\/\* Panel chrome shells[\s\S]*?\.seipro-atividades-root \[data-act\^=\"atividades-\"\] \{[\s\S]*?\}\n+/,
        `/* P6: feature selectors use .seipro-*; legacy #ids remain in markup for jQuery. */\n`
        + `.seipro-atividades-root { display: inline-block; width: 100%; }\n`
        + `.seipro-atividades-panel { width: 98%; }\n`
        + `.seipro-atividades-root [data-act^="atividades-"] { cursor: pointer; }\n\n`
    );
    // Drop SEI-native scopes we shouldn't own (keep rule body under feature root if useful)
    out = out.replace(/#divInfraAreaTelaD\s+div\.seipro-atividades-status/g, '.seipro-atividades-status');
    out = out.replace(/#frmProcedimentoControlar\s+div\.infraAreaTabela\s+/g, '');
    // boxProjeto rules: nest under seipro box only (projetos owns its CSS)
    out = out.replace(/,\s*\n?#boxProjeto[^\n,{]*/g, '');
    out = out.replace(/#boxProjeto[^\n,{]*,\s*/g, '');
    out = out.replace(/#boxProjeto[^\n,{]*\{[^}]*\}/g, '');
    return out;
}

function dualClassInJs(src) {
    let out = src;
    // id="foo" → id="foo" class="seipro-..."  OR append to existing class=
    for (const [id, cls] of Object.entries(ID_MAP)) {
        // id="foo" without class nearby on same tag opener — common patterns in string concat
        out = out.replace(
            new RegExp(`id="${id}"(?![^>]*class=)`, 'g'),
            `id="${id}" class="${cls}"`
        );
        // id="foo" class="existing → prepend seipro if missing
        out = out.replace(
            new RegExp(`id="${id}" class="(?!([^"]*\\b${cls}\\b))`, 'g'),
            `id="${id}" class="${cls} `
        );
        // class="... " id="foo"
        out = out.replace(
            new RegExp(`class="([^"]*)"([^>]*)id="${id}"`, 'g'),
            (m, classes, mid) => {
                if (classes.split(/\s+/).includes(cls)) return m;
                return `class="${cls} ${classes}"${mid}id="${id}"`;
            }
        );
    }
    // Dual-class known feature classes in class="..."
    for (const [oldCls, newCls] of Object.entries(CLASS_MAP)) {
        if (oldCls === 'minView') continue; // modifier applied differently
        out = out.replace(
            new RegExp(`class="([^"]*\\b${oldCls.replace(/-/g, '\\-')}\\b[^"]*)"`, 'g'),
            (m, classes) => {
                if (classes.split(/\s+/).includes(newCls)) return m;
                return `class="${classes} ${newCls}"`;
            }
        );
    }
    // customClass: 'bar-em-execucao' → dual
    for (const [oldCls, newCls] of Object.entries(CLASS_MAP)) {
        if (!oldCls.startsWith('bar-')) continue;
        out = out.replace(
            new RegExp(`(customClass\\s*[:=]\\s*['"])${oldCls.replace(/-/g, '\\-')}(['"])`, 'g'),
            `$1${oldCls} ${newCls}$2`
        );
        out = out.replace(
            new RegExp(`(custom_class\\s*[:=]\\s*['"])${oldCls.replace(/-/g, '\\-')}(['"])`, 'g'),
            `$1${oldCls} ${newCls}$2`
        );
    }
    return out;
}

// CSS
const cssBefore = readFileSync(cssPath, 'utf8');
const cssAfter = rewriteCss(cssBefore);
writeFileSync(cssPath, cssAfter);
console.log('style.css rewritten');

// JS markup
let jsCount = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    if (['domain.js', 'io.js', 'view.js', 'legacy-api.js', 'modules.js', 'index.js', 'state.js', 'compat.js', 'runtime.js', 'server.js'].includes(file)) {
        // still dual-class templates/panel etc.; skip pure modules without markup
        if (!['templates.js'].includes(file) && file !== 'compat.js') {
            // panel etc. need it — only skip true non-markup
        }
    }
    const path = join(dir, file);
    const src = readFileSync(path, 'utf8');
    if (!/id="|class="|customClass|custom_class/.test(src)) continue;
    const next = dualClassInJs(src);
    if (next !== src) {
        writeFileSync(path, next);
        jsCount++;
        console.log('dual-class:', file);
    }
}
console.log('updated', jsCount, 'js files');
