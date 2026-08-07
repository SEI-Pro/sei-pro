// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — main panel view (vanilla DOM + frappe-gantt 1.2.2).
 */
import { qs, on, ready } from '../../../dom/index.js';
import { globalRef } from '../../../core/global.js';
import { createTabs } from '../../../shared/ui/tabs.js';
import {
    buildGanttOptions,
    projetoToGanttTasks,
    taskDatesToEtapaPatch
} from '../gantt-adapter.js';
import {
    ensureDemoSeed,
    getStoreProjetos,
    listProjetos,
    replaceProjetos
} from '../store.js';
import {
    sortProjetos,
    tiposOptions,
    flattenEtapas,
    exportProjetoJson,
    importProjetoJson
} from '../domain/filters.js';
import { deadlineAlerts } from '../domain/progress.js';
import { formatDateTime } from '../domain/datas.js';
import { findProjeto } from '../domain/model.js';
import {
    a11yTableHtml,
    emptyStateHtml,
    panelShellHtml,
    elFromHtml
} from '../templates.js';
import { act, can, downloadText, escapeText, loadGanttLib } from './helpers.js';
import { openProjetoForm } from './projeto-form.js';
import { openEtapaForm } from './etapa-form.js';
import { buildPopup } from './popup.js';
import { openShare } from './share.js';
import { openFilterReport } from './report.js';
import { openPortfolio, openResponsavelView } from './portfolio.js';

const ganttInstances = new Map();
let tabsApi = null;
let includeArquivados = false;
let selectedTipo = '';
let showExecucao = true;

function atividadesState() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    return api && api.state && typeof api.state.get === 'function' ? api.state.get() : {};
}

function mountPoint() {
    return (
        qs('#divInfraAreaTelaD') ||
        qs('#divInfraBarraLocalizacao') ||
        qs('#divInfraAreaTela') ||
        document.body
    );
}

function orderPanel(node) {
    if (typeof globalRef.orderDivPanel === 'function') {
        try {
            globalRef.orderDivPanel(node.outerHTML, '', 'projetosGantt');
            return qs('#projetosGantt');
        } catch (e) { /* fall through */ }
    }
    const host = mountPoint();
    const old = qs('#projetosGantt');
    if (old) old.remove();
    host.appendChild(node);
    return node;
}

function refresh() {
    refreshProjetosPanel();
}

function renderGantt(container, projeto) {
    const host = container.querySelector('.seipro-projetos__gantt');
    const a11y = container.querySelector('.seipro-projetos__a11y');
    if (!host) return;
    host.innerHTML = '';
    const svg = document.createElement('svg');
    svg.id = 'gantt_' + projeto.id_projeto;
    svg.className = 'svg_gantt';
    host.appendChild(svg);

    const { tasks, holidayOpts, etapas } = projetoToGanttTasks(projeto, {
        showExecucao,
        showMacro: true,
        applySchedule: true,
        ignoreNonBusiness: false
    });
    if (a11y) a11y.innerHTML = a11yTableHtml(etapas);

    loadGanttLib().then((Gantt) => {
        if (!Gantt) return;
        const editable = can('update_projeto_etapa');
        const options = buildGanttOptions({
            editable,
            holidayOpts,
            popup: (ctx) => buildPopup(ctx, { onSaved: refresh }),
            onDateChange(task, start, end) {
                if (!confirm('Reprogramar etapa e dependentes?')) {
                    refresh();
                    return;
                }
                const patch = taskDatesToEtapaPatch({ ...task, _start: start, _end: end });
                act('update_projeto_etapa', {
                    id_projeto: projeto.id_projeto,
                    id_etapa: patch.id_etapa,
                    data_inicio_programado: formatDateTime(patch.data_inicio_programado),
                    data_fim_programado: formatDateTime(patch.data_fim_programado)
                }).then(refresh);
            },
            onProgressChange(task, progress) {
                act('update_projeto_etapa', {
                    id_projeto: projeto.id_projeto,
                    id_etapa: Number(String(task.id).replace(/_exec$/, '')),
                    progresso_execucao: progress
                });
            }
        });
        const g = new Gantt('#' + svg.id, tasks, options);
        ganttInstances.set(projeto.id_projeto, g);
    }).catch((err) => {
        host.innerHTML = '<p class="seipro-projetos__error">Nao foi possivel carregar o Gantt: ' + String(err.message || err) + '</p>';
    });
}

function renderAlerts(root, projetos) {
    const box = root.querySelector('#projetosAlerts');
    if (!box) return;
    const alerts = deadlineAlerts(flattenEtapas(projetos));
    if (!alerts.length) {
        box.innerHTML = '';
        box.hidden = true;
        return;
    }
    box.hidden = false;
    box.innerHTML = alerts.slice(0, 8).map((a) =>
        '<div class="seipro-projetos__alert seipro-projetos__alert--' + a.level + '">' +
        escapeText(a.nome_etapa) + ': ' + escapeText(a.message) +
        '</div>'
    ).join('');
}

function fillTipoSelect(root, projetos) {
    const sel = root.querySelector('#selectTipoProjetoPro');
    if (!sel) return;
    const tipos = tiposOptions(projetos, getStoreProjetos().tipos_projetos);
    sel.innerHTML = '<option value="">Todos</option>' + tipos.map((t) =>
        '<option value="' + t.id_tipo_projeto + '"' +
        (String(selectedTipo) === String(t.id_tipo_projeto) ? ' selected' : '') +
        '>' + escapeText(t.nome_tipo_projeto) + '</option>'
    ).join('');
}

function renderTabs(root, projetos) {
    const host = root.querySelector('#projetosTabs');
    if (!host) return;
    ganttInstances.clear();
    if (tabsApi) { try { tabsApi.destroy(); } catch (e) { /* noop */ } tabsApi = null; }

    if (!projetos.length) {
        host.innerHTML = emptyStateHtml();
        return;
    }

    const items = projetos.map((p) => {
        const toolbar =
            '<div class="seipro-projetos__proj-toolbar">' +
            (can('save_projeto_etapa') ? '<button type="button" class="newLink" data-act="add-etapa" data-id_projeto="' + p.id_projeto + '" title="Adicionar etapa"><i class="fas fa-plus-circle"></i></button>' : '') +
            (can('edit_projeto') ? '<button type="button" class="newLink" data-act="edit-projeto" data-id_projeto="' + p.id_projeto + '" title="Editar"><i class="fas fa-edit"></i></button>' : '') +
            (can('clone_projeto') ? '<button type="button" class="newLink" data-act="clone-projeto" data-id_projeto="' + p.id_projeto + '" title="Clonar"><i class="fas fa-clone"></i></button>' : '') +
            (can('archive_projeto') ? '<button type="button" class="newLink" data-act="archive-projeto" data-id_projeto="' + p.id_projeto + '" title="Arquivar"><i class="fas fa-archive"></i></button>' : '') +
            (can('share_projeto') ? '<button type="button" class="newLink" data-act="share-projeto" data-id_projeto="' + p.id_projeto + '" title="Compartilhar"><i class="fas fa-share-square"></i></button>' : '') +
            (can('delete_projeto') ? '<button type="button" class="newLink" data-act="delete-projeto" data-id_projeto="' + p.id_projeto + '" title="Excluir"><i class="fas fa-trash"></i></button>' : '') +
            (!p.ativo ? '<span class="seipro-projetos__tag">ARQUIVADO</span>' : '') +
            '</div>';
        const content =
            toolbar +
            '<div class="seipro-projetos__gantt"></div>' +
            '<details class="seipro-projetos__a11y-wrap"><summary>Tabela acessivel</summary>' +
            '<div class="seipro-projetos__a11y"></div></details>';
        return {
            id: String(p.id_projeto),
            label: p.nome_projeto + (p.sigla_unidade ? ' [' + p.sigla_unidade + ']' : ''),
            content
        };
    });

    tabsApi = createTabs(host, {
        items,
        onChange(id) {
            const p = findProjeto(projetos, id);
            const panel = host.querySelector('#seipro-panel-' + id);
            if (p && panel) renderGantt(panel, p);
        }
    });
    const first = projetos[0];
    const panel = host.querySelector('#seipro-panel-' + first.id_projeto);
    if (panel) renderGantt(panel, first);
}

export function refreshProjetosPanel() {
    const root = qs('#projetosGantt');
    if (!root) return;
    const projetos = sortProjetos(listProjetos(), {
        includeArquivados,
        idTipo: selectedTipo || null
    });
    fillTipoSelect(root, listProjetos());
    renderAlerts(root, projetos);
    renderTabs(root, projetos);
}

function onPanelClick(ev) {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const root = qs('#projetosGantt');
    if (!root || !root.contains(btn)) return;
    const actName = btn.dataset.act;
    const id = Number(btn.dataset.id_projeto);

    if (actName === 'toggle-panel') {
        const body = qs('#projetosGanttDiv');
        if (body) body.style.display = body.style.display === 'none' ? 'inline-table' : 'none';
        return;
    }
    if (actName === 'add-projeto') return openProjetoForm(null, { onSaved: refresh });
    if (actName === 'edit-projeto') {
        const p = findProjeto(listProjetos(), id);
        if (p) openProjetoForm(p, { onSaved: refresh });
        return;
    }
    if (actName === 'add-etapa') {
        const p = findProjeto(listProjetos(), id);
        if (p) openEtapaForm(p, {}, { onSaved: refresh });
        return;
    }
    if (actName === 'clone-projeto') {
        act('clone_projeto', { id_projeto: id }).then(refresh);
        return;
    }
    if (actName === 'archive-projeto') {
        act('archive_projeto', { id_projeto: id }).then(refresh);
        return;
    }
    if (actName === 'delete-projeto') {
        if (!confirm('Excluir este projeto?')) return;
        act('delete_projeto', { id_projeto: id }).then(refresh);
        return;
    }
    if (actName === 'share-projeto') {
        const p = findProjeto(listProjetos(), id);
        if (p) openShare(p, { onSaved: refresh });
        return;
    }
    if (actName === 'open-filter') return openFilterReport();
    if (actName === 'open-portfolio') return openPortfolio({ includeArquivados });
    if (actName === 'open-responsavel') return openResponsavelView();
    if (actName === 'toggle-arquivados') {
        includeArquivados = !includeArquivados;
        refresh();
        return;
    }
    if (actName === 'refresh') return refresh();
    if (actName === 'seed-demo') {
        ensureDemoSeed(true);
        refresh();
        return;
    }
    if (actName === 'export-json') {
        downloadText('projetos.json', JSON.stringify(listProjetos(), null, 2), 'application/json');
        return;
    }
    if (actName === 'import-json') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = importProjetoJson(String(reader.result));
                    if (Array.isArray(data)) {
                        data.forEach((p) => act('import_projeto', { projeto: exportProjetoJson(p) }));
                    } else {
                        act('import_projeto', { projeto: exportProjetoJson(data) });
                    }
                    setTimeout(refresh, 50);
                } catch (e) {
                    alert(e.message || 'Falha ao importar');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}

function onPanelChange(ev) {
    const sel = ev.target.closest('#selectTipoProjetoPro');
    if (!sel) return;
    selectedTipo = sel.value;
    refresh();
}

export function setProjetosPanel() {
    ensureDemoSeed(false);
    let root = qs('#projetosGantt');
    if (!root) {
        root = elFromHtml(panelShellHtml());
        root = orderPanel(root) || qs('#projetosGantt') || root;
    }
    refreshProjetosPanel();
}

export function initProjetosPanel(timeout = 9000) {
    if (timeout <= 0) return;
    if (qs('#ifrArvore') && window !== window.top) return;
    try {
        const enabled = typeof globalRef.checkConfigValue === 'function'
            ? globalRef.checkConfigValue('gerenciarprojetos')
            : typeof globalRef.verifyConfigValue === 'function'
                ? globalRef.verifyConfigValue('gerenciarprojetos')
                : true;
        if (!enabled) return;
    } catch (e) { /* default on */ }

    if (!document.body) {
        setTimeout(() => initProjetosPanel(timeout - 100), 100);
        return;
    }
    setProjetosPanel();
}

export function bindProjetosPanel(root = document) {
    on(root, 'click', onPanelClick);
    on(root, 'change', onPanelChange);
}

export function installProjetosView() {
    bindProjetosPanel(document);
    ready(() => {
        setTimeout(() => initProjetosPanel(), 400);
    });
}

export function initProjetos(mode, arrayProjetos, queryIdProjeto) {
    let list = arrayProjetos;
    if (!Array.isArray(list)) {
        const cfg = atividadesState().arrayConfigAtividades;
        list = (cfg && Array.isArray(cfg.projetos)) ? cfg.projetos : null;
    }
    if (Array.isArray(list) && list.length) {
        const cfg = atividadesState().arrayConfigAtividades;
        replaceProjetos(list, cfg && cfg.tipos_projetos);
    }
    if (mode === 'refresh' || mode === 'update' || qs('#projetosGantt')) {
        refreshProjetosPanel();
    } else {
        initProjetosPanel();
    }
    if (queryIdProjeto) {
        setTimeout(() => selectProjetoTab(queryIdProjeto), 250);
    }
}

export function setProjetos(mode, arrayProjetos, queryIdProjeto) {
    initProjetos(mode, arrayProjetos, queryIdProjeto);
}

export function selectProjetoTab(idProjeto) {
    const id = String(idProjeto);
    if (tabsApi && typeof tabsApi.select === 'function') {
        tabsApi.select(id);
        return;
    }
    const btn = qs('#projetosTabs [role="tab"][data-tab-id="' + id + '"]');
    if (btn) btn.click();
}

// Re-export forms for legacy-api convenience
export { openProjetoForm } from './projeto-form.js';
export { openEtapaForm } from './etapa-form.js';
