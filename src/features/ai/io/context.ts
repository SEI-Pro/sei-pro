// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { globalRef, getSeiPro } from '../../../core/global.js';
import { trimContext } from '../../../core/llm/budget.js';
import { htmlToMarkdown } from '../../../core/markdown/html-to-markdown.js';
import {
    createAccessAuditRecord,
    partitionDocumentsByAccess,
    requiresDocumentConsent,
    restrictedContentNotice
} from '../domain/access-gate.js';
import {
    documentLabel,
    formatDocumentChunk,
    preferredDocumentIds
} from '../domain/prompt.js';

export async function listProcessDocuments({
    source = globalRef,
    fetchImpl = globalRef.fetch && globalRef.fetch.bind(globalRef),
    providedDocuments,
    signal
} = {}) {
    throwIfAborted(signal);
    if (Array.isArray(providedDocuments)) return normalizeDocuments(providedDocuments);
    const processData = resolveProcessSource(source);
    const existing = normalizeDocuments(
        processData.treeModel?.documents
        || processData.listDocumentos
        || processData.listDocumentosAssinados
        || [],
        processData
    );
    if (existing.length) return existing;
    if (typeof fetchImpl !== 'function') return [];
    return fetchTreeDocuments(processData, { source, fetchImpl, signal });
}

export function getProcessData(source = globalRef) {
    const data = resolveProcessSource(source);
    const props = data.propProcesso || {};
    return compactObject({
        processNumber: props.hdnProtocoloFormatado || props.txtProtocoloExibir,
        processType: props.hdnNomeTipoProcedimento || props.selTipoProcedimento,
        specification: props.txtDescricao,
        interestedParties: props.selInteressados_select || props.interessados,
        subjects: props.selAssuntos_select || props.assuntos,
        notes: props.txaObservacoes,
        openedAt: props.hdnDtaGeracao || props.data_geracao,
        accessLevel: props.rdoNivelAcesso || props.nivel_acesso
    });
}

export function getCurrentEditor(source = globalRef) {
    if (source.oEditor && typeof source.oEditor.getData === 'function') return source.oEditor;
    const instances = source.CKEDITOR && source.CKEDITOR.instances;
    if (!instances) return null;
    return Object.values(instances).find(function (instance) {
        return instance && instance.focusManager && instance.focusManager.hasFocus;
    }) || Object.values(instances)[0] || null;
}

export function currentDocumentMarkdown(source = globalRef) {
    const editor = getCurrentEditor(source);
    return editor && typeof editor.getData === 'function'
        ? htmlToMarkdown(editor.getData())
        : '';
}

export function createDocumentFetchState(maxDocs = 15) {
    const limit = Math.max(0, Number(maxDocs) || 0);
    return {
        limit,
        fetched: 0,
        bodyCache: new Map(),
        consume() {
            if (this.fetched >= this.limit) {
                throw new Error(`Limite de leitura de documentos atingido (${this.limit})`);
            }
            this.fetched += 1;
            return this.fetched;
        }
    };
}

export async function readProcessDocument(document, {
    profile,
    confirmRestricted,
    fetchImpl = globalRef.fetch && globalRef.fetch.bind(globalRef),
    parseHtml = defaultParseHtml,
    fetchState,
    signal
} = {}) {
    throwIfAborted(signal);
    if (!document || !document.src) throw new Error('O documento não possui URL legível no SEI');
    const cacheKey = String(document.id || document.numeroSEI || document.src);
    const cached = fetchState?.bodyCache?.get(cacheKey);
    if (cached) return cached;
    let prefix = '';
    if (requiresDocumentConsent(document)) {
        if (typeof confirmRestricted !== 'function') {
            throw new Error(`É necessária confirmação para ler ${documentLabel(document)}`);
        }
        const granted = await confirmRestricted(document, profile);
        throwIfAborted(signal);
        if (!granted) throw new Error('O envio do documento protegido não foi autorizado');
        prefix = `${restrictedContentNotice(document)}\n`;
        await recordRestrictedAccess(document, profile);
    }
    fetchState?.consume?.();
    const html = await fetchDocumentBody(document.src, { fetchImpl, parseHtml, signal });
    throwIfAborted(signal);
    const markdown = htmlToMarkdown(html);
    const result = {
        ...document,
        markdown,
        text: `${prefix}${formatDocumentChunk(document, markdown)}`.trim()
    };
    fetchState?.bodyCache?.set(cacheKey, result);
    return result;
}

export async function readCurrentDocument({
    profile,
    confirmRestricted,
    currentDocumentProvider,
    source = globalRef,
    signal
} = {}) {
    throwIfAborted(signal);
    const snapshot = typeof currentDocumentProvider === 'function'
        ? await currentDocumentProvider()
        : {
            html: getCurrentEditor(source)?.getData?.() || '',
            documentId: '',
            title: globalRef.document?.title || '',
            nivelAcesso: getProcessData(source).accessLevel,
            accessKnown: getProcessData(source).accessLevel != null,
            hipoteseLegal: ''
        };
    throwIfAborted(signal);
    const html = String(snapshot?.html || '');
    if (!html.trim()) return null;
    const document = {
        id: snapshot.documentId || 'documento-atual',
        numeroSEI: snapshot.numeroSEI || snapshot.documentId || '',
        tipo: snapshot.title || 'Documento atual',
        nivelAcesso: snapshot.nivelAcesso,
        accessKnown: snapshot.accessKnown === true,
        hipoteseLegal: snapshot.hipoteseLegal || ''
    };
    let prefix = '';
    if (requiresDocumentConsent(document)) {
        if (typeof confirmRestricted !== 'function') {
            throw new Error('É necessária confirmação para enviar o documento atual');
        }
        const granted = await confirmRestricted(document, profile);
        throwIfAborted(signal);
        if (!granted) return null;
        prefix = `${restrictedContentNotice(document)}\n`;
        await recordRestrictedAccess(document, profile);
    }
    const markdown = htmlToMarkdown(html);
    return {
        ...document,
        markdown,
        text: `${prefix}${formatDocumentChunk(document, markdown)}`.trim()
    };
}

export async function gatherProcessContext({
    instruction = '',
    profile,
    maxDocs = 15,
    maxTokens = 24000,
    includeBodies = true,
    onProgress,
    source = globalRef,
    fetchImpl = globalRef.fetch && globalRef.fetch.bind(globalRef),
    confirmRestricted,
    currentDocumentProvider,
    fetchState = createDocumentFetchState(maxDocs),
    processSnapshot,
    signal
} = {}) {
    throwIfAborted(signal);
    const documents = await listProcessDocuments({
        source,
        fetchImpl,
        providedDocuments: processSnapshot?.documents,
        signal
    });
    const access = partitionDocumentsByAccess(documents);
    const candidates = includeBodies
        ? rankDocumentsForContext(
            access.public.filter((document) => String(document.src || '').trim()),
            instruction
        ).slice(0, maxDocs)
        : [];
    const chunks = [];
    for (const document of candidates) {
        throwIfAborted(signal);
        if (typeof onProgress === 'function') onProgress(`Lendo ${documentLabel(document)}`);
        try {
            chunks.push(await readProcessDocument(document, {
                profile,
                fetchImpl,
                fetchState,
                signal
            }));
        } catch (error) {
            if (isAbortError(error)) throw error;
            if (typeof onProgress === 'function') {
                onProgress(`Ignorado ${document.numeroSEI || document.id}: ${error.message}`);
            }
        }
    }
    const kept = trimContext(chunks, {
        maxTokens,
        preferIds: preferredDocumentIds(instruction, documents)
    });
    const keptIds = new Set(kept.map(function (chunk) { return String(chunk.id); }));
    let currentDocument = null;
    try {
        throwIfAborted(signal);
        currentDocument = await readCurrentDocument({
            profile,
            confirmRestricted,
            currentDocumentProvider,
            source,
            signal
        });
    } catch (error) {
        if (isAbortError(error)) throw error;
        if (typeof onProgress === 'function') {
            onProgress(`Documento atual não incluído: ${error.message}`);
        }
    }
    const fetchedIds = new Set(chunks.map((chunk) => String(chunk.id)));
    const notFetched = access.public.filter((document) => !fetchedIds.has(String(document.id)));
    return {
        process: processSnapshot?.process || getProcessData(source),
        documents,
        chunks: kept,
        omitted: [
            ...notFetched,
            ...chunks.filter(function (chunk) { return !keptIds.has(String(chunk.id)); })
        ],
        restrictedDocuments: access.restricted,
        currentDocument: currentDocument?.text || '',
        currentDocumentMetadata: currentDocument,
        history: processSnapshot?.history || []
    };
}

export function rankDocumentsForContext(documents = [], instruction = '') {
    const preferred = new Set(preferredDocumentIds(instruction, documents));
    return documents.map((document, index) => ({ document, index }))
        .sort((left, right) => {
            const leftPreferred = preferred.has(String(left.document.id)) ? 1 : 0;
            const rightPreferred = preferred.has(String(right.document.id)) ? 1 : 0;
            if (leftPreferred !== rightPreferred) return rightPreferred - leftPreferred;
            const leftTime = parseDocumentDate(left.document.data);
            const rightTime = parseDocumentDate(right.document.data);
            if (leftTime !== rightTime) return rightTime - leftTime;
            return left.index - right.index;
        })
        .map(({ document }) => document);
}

function parseDocumentDate(value) {
    const text = String(value || '').trim();
    const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);
    if (br) return Date.UTC(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
    const parsed = Date.parse(text);
    return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizeDocuments(documents, processData = {}) {
    const links = [
        ...(processData.treeModel?.linksAll || []),
        ...(processData.listLinksAll || []),
        ...(processData.treeModel?.links || []),
        ...(processData.listLinks || [])
    ];
    const seen = new Set();
    return documents.map(function (document, index) {
        const id = String(
            document.id_documento
            || document.id_protocolo
            || document.id
            || index
        );
        const matchingLink = links.find(function (link) {
            return String(link || '').includes(`id_documento=${id}`);
        });
        const accessFields = ['nivelAcesso', 'nivel_acesso', 'sigilo'];
        const accessKnown = document.accessKnown !== false && accessFields.some(function (field) {
            return Object.prototype.hasOwnProperty.call(document, field);
        });
        const access = document.nivelAcesso
            ?? document.nivel_acesso
            ?? document.sigilo
            ?? null;
        return {
            ...document,
            id,
            numeroSEI: String(document.numeroSEI || document.nr_sei || document.numero || ''),
            tipo: document.tipo || document.nome_documento || document.documento || document.nome || 'Documento',
            data: document.data || document.data_documento || document.data_assinatura || '',
            unidade: document.unidade || '',
            nivelAcesso: access,
            accessKnown,
            hipoteseLegal: document.hipoteseLegal || document.hipotese_legal || '',
            src: absolutizeUrl(document.src || matchingLink || '', globalRef.location?.href)
        };
    }).filter(function (document) {
        if (!document.id || seen.has(document.id)) return false;
        seen.add(document.id);
        return true;
    });
}

export function parseTreeDocuments(html, idProcedimento = '') {
    const byNode = new Map();
    String(html || '').split(/\r?\n/).forEach(function (line) {
        const nodeMatch = /^Nos\[(\d+)\]\s*=\s*new infraArvoreNo\("DOCUMENTO/i.exec(line.trim());
        if (!nodeMatch) return;
        const quoted = [...line.matchAll(/"((?:\\.|[^"])*)"/g)].map(function (match) {
            return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        });
        const id = quoted[1] || '';
        const rawLabel = quoted[5] || quoted[4] || 'Documento';
        const numberMatch = line.match(/\((\d{4,})\)/);
        const accessText = /sigil/i.test(line) ? 2 : (/restrit|iconNA/i.test(line) ? 1 : 0);
        byNode.set(nodeMatch[1], {
            id,
            id_documento: id,
            id_procedimento: idProcedimento,
            numeroSEI: numberMatch ? numberMatch[1] : (quoted[20] || quoted[24] || ''),
            tipo: rawLabel.replace(/\(\d+\)\s*$/, '').trim(),
            nivelAcesso: accessText || null,
            accessKnown: accessText > 0
        });
    });
    String(html || '').split(/\r?\n/).forEach(function (line) {
        const srcMatch = /^Nos\[(\d+)\]\.src\s*=\s*'([^']+)'/i.exec(line.trim());
        if (srcMatch && byNode.has(srcMatch[1])) byNode.get(srcMatch[1]).src = srcMatch[2];
    });
    return [...byNode.values()];
}

async function fetchTreeDocuments(processData, { source, fetchImpl, signal }) {
    const props = processData.propProcesso || {};
    const params = new URLSearchParams(source.location?.search || '');
    const id = props.hdnIdProcedimento || params.get('id_procedimento') || params.get('id_protocolo');
    if (!id) return [];
    const workUrl = new URL('controlador.php', source.location?.href || 'http://localhost/');
    workUrl.searchParams.set('acao', 'procedimento_trabalhar');
    workUrl.searchParams.set('id_procedimento', id);
    const processHtml = await fetchText(workUrl.href, fetchImpl, signal);
    const parsed = defaultParseHtml(processHtml);
    const treeSrc = parsed.querySelector('#ifrArvore')?.getAttribute('src');
    if (!treeSrc) return [];
    const treeHtml = await fetchText(absolutizeUrl(treeSrc, workUrl.href), fetchImpl, signal);
    return normalizeDocuments(parseTreeDocuments(treeHtml, id), processData);
}

async function fetchDocumentBody(src, { fetchImpl, parseHtml, signal }) {
    if (typeof fetchImpl !== 'function') throw new Error('A leitura de documentos do SEI está indisponível');
    const firstUrl = absolutizeUrl(src, globalRef.location?.href);
    const firstHtml = await fetchText(firstUrl, fetchImpl, signal);
    const parsed = parseHtml(firstHtml);
    const nestedSrc = parsed.querySelector(
        '#ifrArvoreHtml, #ifrVisualizacao, iframe[src*="documento_"]'
    )?.getAttribute('src');
    if (nestedSrc) {
        const nestedHtml = await fetchText(absolutizeUrl(nestedSrc, firstUrl), fetchImpl, signal);
        return extractDocumentContainer(parseHtml(nestedHtml));
    }
    return extractDocumentContainer(parsed);
}

function extractDocumentContainer(document) {
    const container = document.querySelector('#divArvoreHtml, #conteudo, article, main');
    return container ? container.innerHTML : document.body?.innerHTML || '';
}

async function fetchText(url, fetchImpl, signal) {
    throwIfAborted(signal);
    const response = await fetchImpl(url, { credentials: 'same-origin', signal });
    throwIfAborted(signal);
    if (!response || response.ok === false) {
        throw new Error(`O SEI retornou ${response?.status || 'uma resposta inválida'}`);
    }
    return typeof response.text === 'function' ? response.text() : String(response);
}

async function recordRestrictedAccess(document, profile) {
    const storage = getSeiPro().core.storage;
    if (!storage) return;
    const current = await storage.getLocal('llmAccessAudit');
    const records = Array.isArray(current && current.llmAccessAudit)
        ? current.llmAccessAudit.slice(-199)
        : [];
    records.push(createAccessAuditRecord(document, profile));
    await storage.setLocal({ llmAccessAudit: records });
}

function resolveProcessSource(source) {
    if (source.dadosProcessoPro && typeof source.dadosProcessoPro === 'object') {
        return source.dadosProcessoPro;
    }
    if (typeof source.pullDadosProcessoSession === 'function') {
        return source.pullDadosProcessoSession() || {};
    }
    return {};
}

function compactObject(value) {
    return Object.fromEntries(Object.entries(value).filter(function ([, item]) {
        return item !== undefined && item !== null && item !== '';
    }));
}

function absolutizeUrl(value, base) {
    if (!value) return '';
    try {
        return new URL(value, base || 'http://localhost/').href;
    } catch (_) {
        return String(value);
    }
}

function defaultParseHtml(html) {
    return new DOMParser().parseFromString(String(html || ''), 'text/html');
}

function throwIfAborted(signal) {
    if (!signal?.aborted) return;
    const error = new Error('Solicitação interrompida');
    error.name = 'AbortError';
    throw error;
}

function isAbortError(error) {
    return error?.name === 'AbortError' || error?.message === 'Solicitação interrompida';
}
