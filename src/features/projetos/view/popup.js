/**
 * Projetos — frappe-gantt popup builder.
 */
import { listProjetos } from '../store.js';
import { findProjeto } from '../domain/model.js';
import { effectiveProgress } from '../domain/progress.js';
import { popupDetailsHtml } from '../templates.js';
import { act, can } from './helpers.js';
import { openEtapaForm } from './etapa-form.js';

export function buildPopup(ctx, { onSaved } = {}) {
    const task = ctx.task;
    const meta = task._meta || {};
    if (meta.kind !== 'etapa') {
        ctx.set_title(task.name);
        ctx.set_subtitle(meta.kind || '');
        return;
    }
    const etapa = meta.etapa;
    const { progress } = effectiveProgress(etapa);
    ctx.set_title(etapa.nome_etapa);
    ctx.set_subtitle(etapa.macroetapa || '');
    ctx.set_details(popupDetailsHtml(etapa, { progress, critico: meta.critico, folga: meta.folga }));
    if (can('update_projeto_etapa')) {
        ctx.add_action('<i class="fas fa-edit"></i> Editar', () => {
            const p = findProjeto(listProjetos(), meta.id_projeto);
            if (p) openEtapaForm(p, etapa, { onSaved });
        });
    }
    if (can('delete_projeto_etapa')) {
        ctx.add_action('<i class="fas fa-trash"></i> Excluir', () => {
            if (!confirm('Excluir esta etapa?')) return;
            act('delete_projeto_etapa', { id_projeto: meta.id_projeto, id_etapa: etapa.id_etapa })
                .then(() => { if (typeof onSaved === 'function') onSaved(); });
        });
    }
}
