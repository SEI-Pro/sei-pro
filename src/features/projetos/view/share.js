/**
 * Projetos — share table modal (inline edit, no jquery-table-edit).
 */
import { openModal } from '../../../shared/ui/modal.js';
import { qsa } from '../../../dom/index.js';
import { shareTableHtml } from '../templates.js';
import { act } from './helpers.js';

export function openShare(projeto, { onSaved } = {}) {
    let shares = (projeto.projetos_compartilhados || []).map((s) => ({ ...s }));
    openModal({
        title: 'Compartilhar — ' + projeto.nome_projeto,
        width: 520,
        content: shareTableHtml(shares),
        onOpen(modal) {
            modal.body.addEventListener('click', (ev) => {
                const btn = ev.target.closest('[data-act]');
                if (!btn) return;
                if (btn.dataset.act === 'share-add') {
                    shares.push({ usuario: '', permissao: 'leitura' });
                    modal.body.querySelector('.seipro-projetos-share').outerHTML = shareTableHtml(shares);
                }
                if (btn.dataset.act === 'share-remove') {
                    shares.splice(Number(btn.dataset.index), 1);
                    modal.body.querySelector('.seipro-projetos-share').outerHTML = shareTableHtml(shares);
                }
            });
            modal.body.addEventListener('focusout', (ev) => {
                const cell = ev.target.closest('[data-field]');
                if (!cell) return;
                const tr = cell.closest('tr');
                const i = Number(tr.dataset.index);
                if (shares[i]) shares[i][cell.dataset.field] = cell.textContent.trim();
            });
        },
        buttons: [
            {
                text: 'Salvar',
                onClick(modal) {
                    qsa('#seiproProjetosShareTable tbody tr', modal.body).forEach((tr, i) => {
                        shares[i] = {
                            usuario: tr.querySelector('[data-field="usuario"]').textContent.trim(),
                            permissao: tr.querySelector('[data-field="permissao"]').textContent.trim()
                        };
                    });
                    act('share_projeto', { id_projeto: projeto.id_projeto, projetos_compartilhados: shares })
                        .then(() => {
                            modal.close();
                            if (typeof onSaved === 'function') onSaved();
                        });
                }
            },
            { text: 'Fechar', onClick: (r) => r.close() }
        ]
    });
}
