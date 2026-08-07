// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — portfolio Gantt + per-owner views.
 */
import { openModal } from '../../../shared/ui/modal.js';
import { listProjetos } from '../store.js';
import { sortProjetos } from '../domain/filters.js';
import { groupByResponsavel } from '../domain/schedule.js';
import { buildGanttOptions, portfolioToGanttTasks } from '../gantt-adapter.js';
import { a11yTableHtml } from '../templates.js';
import { escapeText, loadGanttLib } from './helpers.js';

export function openPortfolio({ includeArquivados = false } = {}) {
    const tasks = portfolioToGanttTasks(sortProjetos(listProjetos(), { includeArquivados }));
    openModal({
        title: 'Portfolio de projetos',
        width: 900,
        content: '<div id="seiproPortfolioGantt" class="seipro-projetos__gantt"></div>',
        onOpen(modal) {
            const host = modal.body.querySelector('#seiproPortfolioGantt');
            const svg = document.createElement('svg');
            svg.id = 'gantt_portfolio';
            host.appendChild(svg);
            loadGanttLib().then((Gantt) => {
                if (!Gantt || !tasks.length) {
                    host.innerHTML = '<p>Nenhum projeto para exibir.</p>';
                    return;
                }
                new Gantt('#gantt_portfolio', tasks, buildGanttOptions({ editable: false }));
            });
        },
        buttons: [{ text: 'Fechar', onClick: (r) => r.close() }]
    });
}

export function openResponsavelView() {
    const groups = groupByResponsavel(listProjetos());
    const html = groups.map((g) =>
        '<h4>' + escapeText(g.responsavel) + ' (' + g.etapas.length + ')</h4>' + a11yTableHtml(g.etapas)
    ).join('') || '<p>Sem dados.</p>';
    openModal({
        title: 'Visao por responsavel',
        width: 800,
        content: '<div class="seipro-projetos-responsavel">' + html + '</div>',
        buttons: [{ text: 'Fechar', onClick: (r) => r.close() }]
    });
}
