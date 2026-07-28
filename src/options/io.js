/**
 * Options page — IO boundary.
 *
 * chrome.storage.sync for dataValues, FileReader/Blob import-export, and
 * runtime messaging. No DOM. Callers pass already-serialized payloads.
 */
function getRuntimeApi() {
    if (typeof browser !== 'undefined' && browser.runtime) return browser;
    if (typeof chrome !== 'undefined' && chrome.runtime) return chrome;
    return null;
}

function getStorageArea() {
    const api = getRuntimeApi();
    if (!api || !api.storage || !api.storage.sync) return null;
    return api.storage.sync;
}

function readLastError() {
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime) return chrome.runtime.lastError || null;
    } catch (e) { /* ignore */ }
    return null;
}

/** Read dataValues string from sync storage. Resolves to '' on missing/error. */
export function loadDataValues() {
    return new Promise((resolve) => {
        const storage = getStorageArea();
        if (!storage) {
            resolve('');
            return;
        }
        try {
            storage.get({ dataValues: '' }, (items) => {
                const err = readLastError();
                if (err) {
                    console.warn('options io: storage.get failed', err);
                    resolve('');
                    return;
                }
                resolve(items && typeof items.dataValues === 'string' ? items.dataValues : '');
            });
        } catch (e) {
            console.warn('options io: storage.get threw', e);
            resolve('');
        }
    });
}

/** Persist dataValues string. Rejects when chrome.runtime.lastError is set. */
export function saveDataValues(serialized) {
    return new Promise((resolve, reject) => {
        const storage = getStorageArea();
        if (!storage) {
            reject(new Error('chrome.storage.sync unavailable'));
            return;
        }
        try {
            storage.set({ dataValues: String(serialized || '') }, () => {
                const err = readLastError();
                if (err) {
                    reject(new Error(err.message || String(err)));
                    return;
                }
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

export function clearDataValues() {
    return saveDataValues('');
}

/** Notify the background to sync process-notification config. */
export function syncProcessNotificationOption(enabled) {
    const runtimeApi = getRuntimeApi();
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== 'function') {
        return;
    }
    try {
        runtimeApi.runtime.sendMessage({
            action: 'syncNotificacaoProcessosConfig',
            enabled: enabled === true
        });
    } catch (error) {
        console.warn('options io: could not sync process notifications', error);
    }
}

export function getExtensionManifest() {
    const runtimeApi = getRuntimeApi();
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.getManifest !== 'function') {
        return null;
    }
    try {
        return runtimeApi.runtime.getManifest();
    } catch (e) {
        return null;
    }
}

/** Read a local JSON file as text (import config). */
export function readTextFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('no file'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target && e.target.result ? String(e.target.result) : '');
        reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
        reader.readAsText(file);
    });
}

/** Trigger a browser download of a JSON string. */
export function downloadJsonFile(filename, jsonText) {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8,%EF%BB%BF' });
    if (typeof navigator !== 'undefined' && navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
        return;
    }
    const link = document.createElement('a');
    if (typeof link.download === 'undefined') return;
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
