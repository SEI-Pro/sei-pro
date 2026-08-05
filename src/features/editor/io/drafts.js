const DEFAULT_DB_NAME = 'seipro-editor';
const DEFAULT_STORE_NAME = 'drafts';
const DEFAULT_MAX_SNAPSHOTS = 20;

function requestResult(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });
}

function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed'));
        transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'));
    });
}

export function normalizeDraftContext({ processId, documentId } = {}) {
    const normalizedProcessId = String(processId || '').trim();
    const normalizedDocumentId = String(documentId || '').trim();
    if (!normalizedProcessId || !normalizedDocumentId) {
        throw new TypeError('Drafts require processId and documentId');
    }
    return {
        processId: normalizedProcessId,
        documentId: normalizedDocumentId,
        contextKey: `${normalizedProcessId}:${normalizedDocumentId}`
    };
}

export function createIndexedDbDraftAdapter({
    indexedDB = globalThis.indexedDB,
    dbName = DEFAULT_DB_NAME,
    storeName = DEFAULT_STORE_NAME
} = {}) {
    if (!indexedDB || typeof indexedDB.open !== 'function') {
        throw new Error('IndexedDB is not available');
    }

    let databasePromise;
    function openDatabase() {
        if (!databasePromise) {
            databasePromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, 1);
                request.onupgradeneeded = () => {
                    const database = request.result;
                    const store = database.objectStoreNames.contains(storeName)
                        ? request.transaction.objectStore(storeName)
                        : database.createObjectStore(storeName, { keyPath: 'id' });
                    if (!store.indexNames.contains('contextKey')) {
                        store.createIndex('contextKey', 'contextKey', { unique: false });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error || new Error('Unable to open the draft database'));
            });
        }
        return databasePromise;
    }

    return {
        async put(record) {
            const database = await openDatabase();
            const transaction = database.transaction(storeName, 'readwrite');
            transaction.objectStore(storeName).put(record);
            await transactionDone(transaction);
            return record;
        },
        async get(id) {
            const database = await openDatabase();
            const transaction = database.transaction(storeName, 'readonly');
            return requestResult(transaction.objectStore(storeName).get(id));
        },
        async getAllByContext(contextKey) {
            const database = await openDatabase();
            const transaction = database.transaction(storeName, 'readonly');
            const index = transaction.objectStore(storeName).index('contextKey');
            return requestResult(index.getAll(contextKey));
        },
        async delete(id) {
            const database = await openDatabase();
            const transaction = database.transaction(storeName, 'readwrite');
            transaction.objectStore(storeName).delete(id);
            await transactionDone(transaction);
        }
    };
}

export function createDraftRepository({
    adapter,
    now = () => new Date(),
    createId = () => globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
    maxSnapshots = DEFAULT_MAX_SNAPSHOTS
} = {}) {
    if (!adapter) throw new TypeError('A draft storage adapter is required');

    async function listDrafts(context) {
        const normalized = normalizeDraftContext(context);
        const drafts = await adapter.getAllByContext(normalized.contextKey);
        return drafts.slice().sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    }

    async function saveDraft({ processId, documentId, editors = {}, title = '', sourceUrl = '' } = {}) {
        const context = normalizeDraftContext({ processId, documentId });
        const savedAt = now().toISOString();
        const normalizedEditors = Object.fromEntries(
            Object.entries(editors).map(([id, html]) => [String(id), String(html ?? '')])
        );
        const record = {
            id: `${context.contextKey}:${savedAt}:${createId()}`,
            ...context,
            savedAt,
            title: String(title || ''),
            sourceUrl: String(sourceUrl || ''),
            editors: normalizedEditors
        };

        await adapter.put(record);
        const drafts = await listDrafts(context);
        await Promise.all(drafts.slice(maxSnapshots).map((draft) => adapter.delete(draft.id)));
        return record;
    }

    async function loadDraft({ processId, documentId, draftId } = {}) {
        const context = normalizeDraftContext({ processId, documentId });
        if (draftId) {
            const draft = await adapter.get(String(draftId));
            return draft?.contextKey === context.contextKey ? draft : null;
        }
        return (await listDrafts(context))[0] || null;
    }

    async function deleteDraft({ processId, documentId, draftId } = {}) {
        const context = normalizeDraftContext({ processId, documentId });
        if (draftId) {
            const draft = await adapter.get(String(draftId));
            if (!draft || draft.contextKey !== context.contextKey) return false;
            await adapter.delete(draft.id);
            return true;
        }
        const drafts = await listDrafts(context);
        await Promise.all(drafts.map((draft) => adapter.delete(draft.id)));
        return drafts.length;
    }

    return { saveDraft, loadDraft, listDrafts, deleteDraft };
}

let defaultRepository;
export function getDraftRepository() {
    if (!defaultRepository) {
        defaultRepository = createDraftRepository({ adapter: createIndexedDbDraftAdapter() });
    }
    return defaultRepository;
}

export const saveDraft = (draft) => getDraftRepository().saveDraft(draft);
export const loadDraft = (query) => getDraftRepository().loadDraft(query);
export const listDrafts = (query) => getDraftRepository().listDrafts(query);
export const deleteDraft = (query) => getDraftRepository().deleteDraft(query);
