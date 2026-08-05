const DB_NAME = 'seipro-editor-snippets';
const STORE_NAME = 'snippets';
let singleton;

function openDatabase(indexedDBImpl = globalThis.indexedDB) {
    return new Promise((resolve, reject) => {
        if (!indexedDBImpl) {
            reject(new Error('IndexedDB indisponível'));
            return;
        }
        const request = indexedDBImpl.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const database = request.result;
            const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('unit', 'unit', { unique: false });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Não foi possível abrir os trechos'));
    });
}

function requestResult(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function createSnippetRepository({ indexedDBImpl = globalThis.indexedDB } = {}) {
    let databasePromise;
    const database = () => {
        databasePromise ||= openDatabase(indexedDBImpl);
        return databasePromise;
    };
    return {
        async list(unit) {
            const db = await database();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const rows = await requestResult(
                transaction.objectStore(STORE_NAME).index('unit').getAll(String(unit || 'geral'))
            );
            return rows.sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
        },
        async save({ id, unit, name, body }) {
            const snippet = {
                id: String(id || `snippet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
                unit: String(unit || 'geral'),
                name: String(name || '').trim(),
                body: String(body || ''),
                updatedAt: new Date().toISOString()
            };
            if (!snippet.name || !snippet.body.trim()) {
                throw new Error('Informe o nome e o conteúdo do trecho');
            }
            const db = await database();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            await requestResult(transaction.objectStore(STORE_NAME).put(snippet));
            return snippet;
        },
        async remove(id) {
            const db = await database();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            await requestResult(transaction.objectStore(STORE_NAME).delete(String(id)));
            return true;
        }
    };
}

export function getSnippetRepository() {
    singleton ||= createSnippetRepository();
    return singleton;
}
