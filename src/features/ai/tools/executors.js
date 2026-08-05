import { validateToolCall } from '../../../core/llm/tools.js';
import { globalRef } from '../../../core/global.js';
import { normalizeAccessLevel } from '../domain/access-gate.js';
import {
    readCurrentDocument,
    getProcessData,
    listProcessDocuments,
    readProcessDocument
} from '../io/context.js';
import { getAiToolDefinition } from './definitions.js';
import { searchLegislation } from '../../../shared/legislation-search.js';

export function createAiToolExecutor({
    profile,
    maxDocs = 15,
    confirmRestricted,
    onProgress,
    source = globalRef,
    fetchImpl,
    fetchState,
    currentDocumentProvider,
    processSnapshot
} = {}) {
    let documentCache;

    async function documents() {
        if (!documentCache) {
            documentCache = await listProcessDocuments({
                source,
                fetchImpl,
                providedDocuments: processSnapshot?.documents
            });
        }
        return documentCache;
    }

    return {
        get docsFetched() {
            return Number(fetchState?.fetched || 0);
        },

        async execute(call = {}) {
            const definition = getAiToolDefinition(call.name);
            if (!definition) throw new Error(`Ferramenta de leitura desconhecida: ${call.name}`);
            const args = normalizeArguments(call.arguments);
            if (!validateToolCall(definition, args)) {
                throw new Error(`Argumentos inválidos para ${call.name}`);
            }
            progress(call.name, args, onProgress);

            if (call.name === 'listar_documentos') {
                return (await documents()).map(toDocumentMetadata);
            }
            if (call.name === 'dados_processo') return processSnapshot?.process || getProcessData(source);
            if (call.name === 'documento_atual') {
                const current = await readCurrentDocument({
                    profile,
                    confirmRestricted,
                    currentDocumentProvider,
                    source
                });
                return current || { message: 'O documento atual não foi autorizado para envio.' };
            }
            if (call.name === 'historico_processo') {
                const data = source.dadosProcessoPro || {};
                return processSnapshot?.history || data.listAndamento || { message: 'O histórico do processo não está disponível nesta sessão.' };
            }
            if (call.name === 'ler_documento') {
                const wanted = String(args.numero_sei).replace(/\D/g, '');
                const document = (await documents()).find(function (item) {
                    return String(item.numeroSEI || '').replace(/\D/g, '') === wanted;
                });
                if (!document) throw new Error(`O documento SEI ${args.numero_sei} não foi encontrado`);
                return readProcessDocument(document, {
                    profile,
                    confirmRestricted,
                    fetchImpl,
                    fetchState
                });
            }
            if (call.name === 'buscar_legislacao') {
                return searchLegislation([String(args.termo || '').trim()], {
                    fetchImpl: fetchImpl || globalRef.fetch?.bind(globalRef)
                });
            }
            throw new Error(`A ferramenta ${call.name} não está implementada`);
        }
    };
}

function normalizeArguments(value) {
    if (value == null || value === '') return {};
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch (_) {
        return {};
    }
}

function toDocumentMetadata(document) {
    return {
        numero_sei: document.numeroSEI,
        tipo: document.tipo,
        data: document.data,
        unidade: document.unidade,
        nivel_acesso: document.accessKnown === false
            ? null
            : normalizeAccessLevel(document.nivelAcesso)
    };
}

function progress(name, args, onProgress) {
    if (typeof onProgress !== 'function') return;
    if (name === 'ler_documento') {
        onProgress(`Lendo documento SEI ${args.numero_sei}…`);
        return;
    }
    const labels = {
        listar_documentos: 'Listando documentos do processo…',
        dados_processo: 'Lendo dados do processo…',
        documento_atual: 'Lendo a minuta atual…',
        historico_processo: 'Lendo o histórico do processo…',
        buscar_legislacao: `Pesquisando legislação sobre “${args.termo || ''}”…`
    };
    onProgress(labels[name] || `Executando ${name}…`);
}
