// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — create/edit etapa modal.
 */
import { openModal } from '../../../shared/ui/modal.js';
import { createTagsInput } from '../../../shared/ui/tags-input.js';
import { formatDateTime, formatDateTimeLocal } from '../domain/datas.js';
import { etapaFormHtml } from '../templates.js';
import { act, formToObject } from './helpers.js';

export function openEtapaForm(projeto, etapa, { onSaved } = {}) {
    const isEdit = !!(etapa && etapa.id_etapa);
    return openModal({
        title: isEdit ? 'Editar etapa' : 'Nova etapa',
        width: 560,
        content: etapaFormHtml(etapa || {}, projeto),
        onOpen(modal) {
            const form = modal.body.querySelector('form');
            if (etapa) {
                const s = form.querySelector('[name="data_inicio_programado"]');
                const e = form.querySelector('[name="data_fim_programado"]');
                if (s) s.value = formatDateTimeLocal(etapa.data_inicio_programado);
                if (e) e.value = formatDateTimeLocal(etapa.data_fim_programado);
            }
            const tagInput = form.querySelector('#proj_etiqueta');
            if (tagInput) createTagsInput(tagInput, { delimiter: ';' });
        },
        buttons: [
            {
                text: 'Salvar',
                class: 'infraButton',
                onClick(modal) {
                    const form = modal.body.querySelector('form');
                    if (!form.checkValidity()) { form.reportValidity(); return; }
                    const data = formToObject(form);
                    data.data_inicio_programado = formatDateTime(data.data_inicio_programado);
                    data.data_fim_programado = formatDateTime(data.data_fim_programado);
                    data.progresso_execucao = Number(data.progresso_execucao) || 0;
                    if (data.id_dependencia) {
                        data.predecessoras = [{ id_etapa: Number(data.id_dependencia), tipo: 'FS', lag_dias: 0 }];
                    } else {
                        data.predecessoras = [];
                        data.id_dependencia = false;
                    }
                    const action = isEdit ? 'update_projeto_etapa' : 'save_etapa';
                    act(action, data).then(() => {
                        modal.close();
                        if (typeof onSaved === 'function') onSaved();
                    });
                }
            },
            { text: 'Cancelar', onClick: (r) => r.close() }
        ]
    });
}
