// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Minimal MAIN-world CKEditor bridge for the isolated AI feature.
 *
 * No extension storage, runtime messaging, provider profile or LLM operation is
 * exposed here. The page can already read and mutate its own CKEditor; this
 * bridge only gives the isolated content script a serializable editor seam.
 */
import { state } from './state.js';

const BRIDGE_ID = 'seipro-editor-ai-bridge';
const REQUEST_EVENT = 'seipro-editor-ai-request';
const RESPONSE_EVENT = 'seipro-editor-ai-response';
const OPEN_EVENT = 'seipro-editor-ai-open';
const INLINE_EVENT = 'seipro-editor-ai-inline';

function bridgeElement() {
    let element = document.getElementById(BRIDGE_ID);
    if (!element) {
        element = document.createElement('span');
        element.id = BRIDGE_ID;
        element.hidden = true;
        element.setAttribute('aria-hidden', 'true');
        (document.documentElement || document.body).appendChild(element);
    }
    return element;
}

function currentEditor(editorId) {
    const instances = globalThis.CKEDITOR?.instances || {};
    if (editorId && instances[editorId]) return instances[editorId];
    if (state.oEditor && typeof state.oEditor.getData === 'function') return state.oEditor;
    return Object.values(instances).find((editor) =>
        editor?.focusManager?.hasFocus
    ) || Object.values(instances)[0] || null;
}

function currentAccessMetadata() {
    const props = globalThis.dadosProcessoPro?.propProcesso || {};
    const checked = document.querySelector(
        '[name="rdoNivelAcesso"]:checked, [name="nivel_acesso"]:checked'
    );
    const raw = props.rdoNivelAcesso
        ?? props.nivel_acesso
        ?? checked?.value
        ?? null;
    const accessKnown = raw !== null && raw !== undefined && String(raw).trim() !== '';
    return {
        nivelAcesso: accessKnown ? raw : null,
        accessKnown,
        hipoteseLegal: props.selHipoteseLegal
            || props.hdnNomeHipoteseLegal
            || props.hipotese_legal
            || ''
    };
}

function processSnapshot() {
    const data = globalThis.dadosProcessoPro || {};
    const props = data.propProcesso || {};
    const links = [
        ...(data.treeModel?.linksAll || []),
        ...(data.listLinksAll || []),
        ...(data.treeModel?.links || []),
        ...(data.listLinks || [])
    ];
    const sourceDocuments = data.treeModel?.documents
        || data.listDocumentos
        || data.listDocumentosAssinados
        || [];
    const documents = sourceDocuments.map((item, index) => {
        const id = String(item.id_documento || item.id_protocolo || item.id || index);
        const src = item.src || links.find((link) => String(link).includes(`id_documento=${id}`)) || '';
        const accessFields = ['nivelAcesso', 'nivel_acesso', 'sigilo'];
        const accessKnown = item.accessKnown !== false && accessFields.some((field) =>
            Object.prototype.hasOwnProperty.call(item, field)
        );
        return {
            id,
            numeroSEI: String(item.numeroSEI || item.nr_sei || item.numero || ''),
            tipo: item.tipo || item.nome_documento || item.documento || item.nome || 'Documento',
            data: item.data || item.data_documento || item.data_assinatura || '',
            unidade: item.unidade || '',
            nivelAcesso: item.nivelAcesso ?? item.nivel_acesso ?? item.sigilo ?? null,
            accessKnown,
            hipoteseLegal: item.hipoteseLegal || item.hipotese_legal || '',
            src: absolutize(src)
        };
    });
    return {
        process: compact({
            processNumber: props.hdnProtocoloFormatado || props.txtProtocoloExibir,
            processType: props.hdnNomeTipoProcedimento || props.selTipoProcedimento,
            specification: props.txtDescricao,
            interestedParties: props.selInteressados_select || props.selInteressadosProcedimento || props.interessados,
            subjects: props.selAssuntos_select || props.assuntos,
            notes: props.txaObservacoes,
            openedAt: props.hdnDtaGeracao || props.txtDtaGeracaoExibir || props.data_geracao,
            accessLevel: props.rdoNivelAcesso ?? props.nivel_acesso
        }),
        documents,
        history: Array.isArray(data.listAndamento) ? data.listAndamento : []
    };
}

function absolutize(value) {
    if (!value) return '';
    try {
        return new URL(value, location.href).href;
    } catch (_) {
        return String(value);
    }
}

function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) =>
        item !== undefined && item !== null && item !== ''
    ));
}

function snapshot(payload = {}) {
    const editor = currentEditor(payload.editorId);
    if (!editor) throw new Error('Nenhum editor CKEditor ativo foi encontrado');
    const selection = editor.getSelection?.();
    return {
        editorId: editor.name || payload.editorId || '',
        html: String(editor.getData?.() || ''),
        selectedText: String(selection?.getSelectedText?.() || ''),
        title: document.title || '',
        documentId: new URLSearchParams(location.search).get('id_documento') || '',
        ...currentAccessMetadata(),
        ...processSnapshot()
    };
}

function insertHtml(payload = {}) {
    const editor = currentEditor(payload.editorId);
    if (!editor) throw new Error('Nenhum editor CKEditor ativo foi encontrado');
    const html = String(payload.html || '');
    editor.focus?.();
    editor.fire?.('saveSnapshot');
    if (payload.inlineMarker) {
        const editable = editor.editable?.();
        const root = editable?.$;
        const paragraphs = root ? Array.from(root.querySelectorAll('p')) : [];
        const marker = String(payload.inlineMarker);
        const target = paragraphs.find((paragraph) =>
            String(paragraph.textContent || '').includes(marker)
        );
        if (target) {
            target.insertAdjacentHTML('afterend', html);
            target.remove();
        } else {
            editor.insertHtml?.(html);
        }
    } else {
        editor.insertHtml?.(html);
    }
    editor.fire?.('saveSnapshot');
    return { inserted: true, editorId: editor.name || '' };
}

function handleOperation(operation, payload) {
    if (operation === 'snapshot') return snapshot(payload);
    if (operation === 'insertHtml') return insertHtml(payload);
    throw new Error(`Operação de editor não permitida: ${operation}`);
}

export function installEditorAiBridge() {
    const element = bridgeElement();
    if (element.dataset.mainInstalled === 'true') return element;
    element.dataset.mainInstalled = 'true';
    element.addEventListener(REQUEST_EVENT, () => {
        let request = {};
        try {
            request = JSON.parse(element.dataset.request || '{}');
            const result = handleOperation(request.operation, request.payload || {});
            element.dataset.response = JSON.stringify({
                id: request.id,
                ok: true,
                result
            });
        } catch (error) {
            element.dataset.response = JSON.stringify({
                id: request.id,
                ok: false,
                error: String(error?.message || error)
            });
        }
        element.dispatchEvent(new CustomEvent(RESPONSE_EVENT));
    });
    return element;
}

export function requestAiOpen(editorId = '') {
    const element = bridgeElement();
    element.dataset.open = JSON.stringify({ editorId });
    element.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function requestAiInline({ editorId = '', prompt = '', marker = '' } = {}) {
    const element = bridgeElement();
    element.dataset.inline = JSON.stringify({ editorId, prompt, marker });
    element.dispatchEvent(new CustomEvent(INLINE_EVENT));
}

export function readAiEditorConfig() {
    const element = bridgeElement();
    try {
        const config = JSON.parse(element.dataset.config || '{}');
        return {
            inlineEnabled: config.inlineEnabled === true,
            keyword: String(config.keyword || '+gpt')
        };
    } catch (_) {
        return { inlineEnabled: false, keyword: '+gpt' };
    }
}

export const EDITOR_AI_BRIDGE = Object.freeze({
    id: BRIDGE_ID,
    requestEvent: REQUEST_EVENT,
    responseEvent: RESPONSE_EVENT,
    openEvent: OPEN_EVENT,
    inlineEvent: INLINE_EVENT
});
