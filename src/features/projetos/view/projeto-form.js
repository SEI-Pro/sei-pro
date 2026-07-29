/**
 * Projetos — create/edit projeto modal.
 */
import { openModal } from '../../../shared/ui/modal.js';
import { getStoreProjetos } from '../store.js';
import { tiposOptions } from '../domain/filters.js';
import { projetoFormHtml } from '../templates.js';
import { act, formToObject } from './helpers.js';

export function openProjetoForm(projeto, { onSaved } = {}) {
    const store = getStoreProjetos();
    const isEdit = !!(projeto && projeto.id_projeto);
    openModal({
        title: isEdit ? 'Editar projeto' : 'Novo projeto',
        width: 520,
        content: projetoFormHtml(projeto || {}, store.tipos_projetos || tiposOptions(store.projetos)),
        buttons: [
            {
                text: 'Salvar',
                class: 'infraButton',
                onClick(ref) {
                    const form = ref.body.querySelector('form');
                    if (!form.checkValidity()) { form.reportValidity(); return; }
                    const data = formToObject(form);
                    const action = isEdit ? 'edit_projeto' : 'save_projeto';
                    act(action, data).then(() => {
                        ref.close();
                        if (typeof onSaved === 'function') onSaved();
                    });
                }
            },
            { text: 'Cancelar', onClick: (r) => r.close() }
        ]
    });
}
