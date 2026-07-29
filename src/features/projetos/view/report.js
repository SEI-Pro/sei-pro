/**
 * Projetos — filtered report modal + CSV export.
 */
import { openModal } from '../../../shared/ui/modal.js';
import { qsa } from '../../../dom/index.js';
import { listProjetos } from '../store.js';
import { exportEtapasCsv, filterEtapas, flattenEtapas } from '../domain/filters.js';
import { a11yTableHtml } from '../templates.js';
import { downloadText } from './helpers.js';

export function openFilterReport() {
    const all = flattenEtapas(listProjetos());
    openModal({
        title: 'Relatorio filtrado',
        width: 720,
        content:
            '<div class="seipro-projetos-report">' +
            '<label>Responsavel <input class="infraText" data-filter="responsavel"></label> ' +
            '<label>Macroetapa <input class="infraText" data-filter="macroetapa"></label> ' +
            '<label><input type="checkbox" data-filter="critico"> So criticos</label> ' +
            '<label><input type="checkbox" data-filter="atraso"> Atrasados</label>' +
            '<div class="seipro-projetos-report__out"></div>' +
            '<button type="button" class="newLink" data-act="export-csv">Exportar CSV</button>' +
            '</div>',
        onOpen(modal) {
            const out = modal.body.querySelector('.seipro-projetos-report__out');
            function run() {
                const filter = {};
                qsa('[data-filter]', modal.body).forEach((el) => {
                    if (el.type === 'checkbox') filter[el.dataset.filter] = el.checked;
                    else if (el.value.trim()) filter[el.dataset.filter] = el.value.trim();
                });
                const rows = filterEtapas(all, filter);
                out.innerHTML = a11yTableHtml(rows);
                out._rows = rows;
            }
            modal.body.addEventListener('input', run);
            modal.body.addEventListener('change', run);
            modal.body.addEventListener('click', (ev) => {
                if (ev.target.closest('[data-act="export-csv"]')) {
                    const csv = exportEtapasCsv(out._rows || all);
                    downloadText('projetos-relatorio.csv', csv, 'text/csv');
                }
            });
            run();
        },
        buttons: [{ text: 'Fechar', onClick: (r) => r.close() }]
    });
}
