// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { openModal } from '../../../shared/ui/modal.js';
import { semanticDiff } from '../domain/diff.js';

export function openSemanticDiffPanel({
    documents = [],
    loadDocument,
    readCurrentText
} = {}) {
    const content = document.createElement('div');
    content.className = 'seipro-diff-panel';
    const controls = document.createElement('div');
    controls.className = 'seipro-diff-controls';
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Documento anterior para comparação');
    documents.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.label;
        select.appendChild(option);
    });
    const compare = document.createElement('button');
    compare.type = 'button';
    compare.textContent = 'Comparar';
    const status = document.createElement('p');
    status.className = 'seipro-diff-status';
    status.setAttribute('aria-live', 'polite');
    const result = document.createElement('div');
    result.className = 'seipro-diff-result';
    controls.append(select, compare);
    content.append(controls, status, result);

    compare.disabled = documents.length === 0;
    if (!documents.length) status.textContent = 'Nenhum documento anterior legível foi encontrado no processo.';
    compare.addEventListener('click', async () => {
        const selected = documents.find((item) => item.id === select.value);
        if (!selected || typeof loadDocument !== 'function') return;
        compare.disabled = true;
        status.textContent = `Lendo ${selected.label}…`;
        try {
            const [before, after] = await Promise.all([
                loadDocument(selected),
                Promise.resolve(readCurrentText?.() || '')
            ]);
            const diff = semanticDiff(before, after);
            result.replaceChildren();
            diff.parts.forEach((part) => {
                const node = document.createElement(part.type === 'add'
                    ? 'ins'
                    : (part.type === 'remove' ? 'del' : 'span'));
                node.textContent = `${part.text} `;
                result.appendChild(node);
            });
            status.textContent = `${diff.added} termo(s) adicionado(s) e ${diff.removed} removido(s).${diff.truncated ? ' Comparação limitada aos primeiros 1.800 termos.' : ''}`;
        } catch (error) {
            status.textContent = `Não foi possível comparar: ${error.message}`;
        } finally {
            compare.disabled = false;
        }
    });

    return openModal({
        title: 'Comparar com documento anterior',
        content,
        width: 860,
        className: 'seipro-editor-modal'
    });
}
