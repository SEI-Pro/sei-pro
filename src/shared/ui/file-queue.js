/**
 * File queue — shared vanilla primitive (src/shared/ui/).
 *
 * Replaces Dropzone.js for the essential subset SEI Pro uses:
 * queue files, optional accept filter, preview hooks, one-at-a-time XHR upload
 * with progress, reorder. No jQuery.
 *
 * API (Dropzone-compatible where the features still expect it):
 *   createFileQueue({
 *     previewsContainer, clickable, paramName, accept,
 *     renameFile(file) → string,
 *     createPreview(item) → Element,   // optional; feature owns markup
 *     timeout,
 *     onAddedFile(item), onAddedFiles(items), onRemovedFile(item),
 *     onSuccess(item, xhr), onError(item, error),
 *   })
 *   → { handleFiles, addFile, getQueuedFiles, getAcceptedFiles, getRejectedFiles,
 *       removeAllFiles, processQueue, destroy, files, options, on }
 */

export function extensionAllowed(fileName, acceptCsv) {
    if (!acceptCsv) return true;
    const name = String(fileName || '').toLowerCase();
    const allowed = String(acceptCsv)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (allowed.length === 0) return true;
    return allowed.some((ext) => (ext.startsWith('.') ? name.endsWith(ext) : name.endsWith('.' + ext)));
}

export function formatFileSize(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return n + ' b';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KiB';
    return (n / (1024 * 1024)).toFixed(1) + ' MiB';
}

/**
 * POST multipart file upload (XHR so upload.onprogress works).
 * Resolves with the XHR; rejects with { xhr, message }.
 */
export function uploadFormFile({
    url,
    file,
    fileName,
    paramName = 'filArquivo',
    timeout = 900000,
    onProgress,
    xhrFactory = () => new XMLHttpRequest()
}) {
    return new Promise((resolve, reject) => {
        const xhr = xhrFactory();
        const form = new FormData();
        form.append(paramName, file, fileName || file.name);
        xhr.open('POST', url, true);
        xhr.timeout = timeout;
        xhr.withCredentials = true;
        if (xhr.upload && typeof onProgress === 'function') {
            xhr.upload.onprogress = (event) => {
                if (!event.lengthComputable) return;
                onProgress(event.loaded / event.total, event);
            };
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr);
            else reject({ xhr, message: 'HTTP ' + xhr.status });
        };
        xhr.onerror = () => reject({ xhr, message: 'Network error' });
        xhr.ontimeout = () => reject({ xhr, message: 'Timeout' });
        xhr.send(form);
    });
}

function toPublicFile(item) {
    const file = item.file;
    // Dropzone-like: File + previewElement + status helpers used by callers
    file.previewElement = item.previewElement;
    file.status = item.status;
    file.uploadName = item.uploadName;
    file.xhr = item.xhr;
    file._queueItem = item;
    return file;
}

export function createFileQueue(opts = {}) {
    const items = [];
    const listeners = {};
    const options = {
        url: opts.url || '',
        params: opts.params || {},
        acceptedFiles: opts.accept || opts.acceptedFiles || null,
        paramName: opts.paramName || 'filArquivo',
        timeout: opts.timeout || 900000
    };
    const renameFile = typeof opts.renameFile === 'function' ? opts.renameFile : (f) => f.name;
    const createPreview = typeof opts.createPreview === 'function' ? opts.createPreview : null;
    const previewsContainer =
        typeof opts.previewsContainer === 'string'
            ? (typeof document !== 'undefined' ? document.querySelector(opts.previewsContainer) : null)
            : opts.previewsContainer || null;

    let clickableEl = null;
    let fileInput = null;
    let processing = false;
    let destroyed = false;

    function emit(event, ...args) {
        const list = listeners[event] || [];
        list.forEach((fn) => {
            try { fn(...args); } catch (_e) { /* keep going */ }
        });
        // Map dropzone-style event names to onX options (addedfiles → onAddedFiles).
        const OPT_BY_EVENT = {
            addedfile: 'onAddedFile',
            addedfiles: 'onAddedFiles',
            removedfile: 'onRemovedFile',
            success: 'onSuccess',
            error: 'onError'
        };
        const optName = OPT_BY_EVENT[event]
            || ('on' + event.charAt(0).toUpperCase() + event.slice(1));
        if (typeof opts[optName] === 'function') {
            try { opts[optName](...args); } catch (_e) { /* keep going */ }
        }
    }

    function bindClickable() {
        const clickable = opts.clickable;
        if (!clickable || typeof document === 'undefined') return;
        clickableEl = typeof clickable === 'string' ? document.querySelector(clickable) : clickable;
        if (!clickableEl) return;
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        if (options.acceptedFiles) fileInput.accept = options.acceptedFiles;
        (clickableEl.ownerDocument || document).body.appendChild(fileInput);
        clickableEl.addEventListener('click', onClickableClick);
        fileInput.addEventListener('change', onFileInputChange);
    }

    function onClickableClick(event) {
        event.preventDefault();
        if (fileInput) fileInput.click();
    }

    function onFileInputChange() {
        if (!fileInput || !fileInput.files) return;
        handleFiles(Array.from(fileInput.files));
        fileInput.value = '';
    }

    function setAcceptedFiles(csv) {
        options.acceptedFiles = csv || null;
        if (fileInput) fileInput.accept = options.acceptedFiles || '';
    }

    function addItem(file) {
        const uploadName = renameFile(file);
        const accepted = extensionAllowed(uploadName || file.name, options.acceptedFiles);
        const item = {
            file,
            uploadName,
            status: accepted ? 'queued' : 'rejected',
            previewElement: null,
            xhr: null,
            errorMessage: accepted ? '' : 'Tipo de arquivo não permitido'
        };
        if (createPreview) {
            item.previewElement = createPreview(item);
            if (item.previewElement && previewsContainer) {
                previewsContainer.appendChild(item.previewElement);
            }
            if (!accepted && item.previewElement) {
                item.previewElement.classList.add('dz-error', 'seipro-file-error');
                const err = item.previewElement.querySelector('[data-seipro-file-error], .dz-error-message span');
                if (err) err.textContent = item.errorMessage;
            }
            const removeBtn = item.previewElement && item.previewElement.querySelector('[data-seipro-file-remove], [data-dz-remove]');
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeItem(item);
                });
            }
        }
        items.push(item);
        emit('addedfile', toPublicFile(item));
        return item;
    }

    function removeItem(item) {
        const idx = items.indexOf(item);
        if (idx === -1) return;
        items.splice(idx, 1);
        if (item.previewElement && item.previewElement.parentNode) {
            item.previewElement.parentNode.removeChild(item.previewElement);
        }
        emit('removedfile', toPublicFile(item));
    }

    function handleFiles(fileList) {
        if (destroyed) return;
        const list = Array.from(fileList || []);
        const added = list.map(addItem);
        emit('addedfiles', added.map(toPublicFile));
        return added.map(toPublicFile);
    }

    function getQueuedFiles() {
        return items.filter((i) => i.status === 'queued').map(toPublicFile);
    }
    function getAcceptedFiles() {
        return items.filter((i) => i.status === 'success').map(toPublicFile);
    }
    function getRejectedFiles() {
        return items.filter((i) => i.status === 'error' || i.status === 'rejected').map(toPublicFile);
    }

    function removeAllFiles() {
        [...items].forEach(removeItem);
    }

    function setProgress(item, ratio) {
        if (!item.previewElement) return;
        item.previewElement.classList.add('dz-processing', 'seipro-file-processing');
        const bar = item.previewElement.querySelector('.dz-upload, [data-seipro-file-progress]');
        if (bar) bar.style.width = Math.round(ratio * 100) + '%';
    }

    function markError(item, message) {
        item.status = 'error';
        item.errorMessage = message || 'Erro no envio';
        if (item.previewElement) {
            item.previewElement.classList.add('dz-error', 'seipro-file-error');
            item.previewElement.classList.remove('dz-processing', 'seipro-file-processing');
            const err = item.previewElement.querySelector('[data-seipro-file-error], .dz-error-message span');
            if (err) err.textContent = item.errorMessage;
        }
    }

    function markSuccess(item) {
        item.status = 'success';
        if (item.previewElement) {
            item.previewElement.classList.add('dz-success', 'dz-complete', 'seipro-file-success');
            item.previewElement.classList.remove('dz-processing', 'seipro-file-processing');
            const bar = item.previewElement.querySelector('.dz-upload, [data-seipro-file-progress]');
            if (bar) bar.style.width = '100%';
        }
    }

    function processQueue() {
        if (destroyed || processing) return Promise.resolve();
        const next = items.find((i) => i.status === 'queued');
        if (!next) return Promise.resolve();
        if (!options.url) {
            markError(next, 'URL de upload não configurada');
            emit('error', toPublicFile(next));
            if (typeof opts.onError === 'function') opts.onError(toPublicFile(next), next.errorMessage);
            return Promise.resolve();
        }
        processing = true;
        next.status = 'uploading';
        setProgress(next, 0);
        return uploadFormFile({
            url: options.url,
            file: next.file,
            fileName: next.uploadName,
            paramName: options.paramName,
            timeout: options.timeout,
            onProgress: (ratio) => setProgress(next, ratio),
            xhrFactory: opts.xhrFactory || (() => new XMLHttpRequest())
        }).then((xhr) => {
            next.xhr = xhr;
            markSuccess(next);
            const pub = toPublicFile(next);
            emit('success', pub);
        }).catch((err) => {
            next.xhr = err && err.xhr ? err.xhr : null;
            markError(next, (err && err.message) || 'Erro no envio');
            emit('error', toPublicFile(next));
        }).finally(() => {
            processing = false;
        });
    }

    function destroy() {
        destroyed = true;
        if (clickableEl) clickableEl.removeEventListener('click', onClickableClick);
        if (fileInput && fileInput.parentNode) fileInput.parentNode.removeChild(fileInput);
        removeAllFiles();
        clickableEl = null;
        fileInput = null;
    }

    function on(event, handler) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
        return api;
    }

    const api = {
        files: items,
        options,
        handleFiles,
        addFile: (file) => toPublicFile(addItem(file)),
        getQueuedFiles,
        getAcceptedFiles,
        getRejectedFiles,
        removeAllFiles,
        processQueue,
        destroy,
        on,
        setAcceptedFiles,
        /** Reorder queue to match DOM order of preview elements. */
        reorderByPreview(orderedElements) {
            const map = new Map(items.map((i) => [i.previewElement, i]));
            const next = [];
            orderedElements.forEach((el) => {
                const item = map.get(el);
                if (item) next.push(item);
            });
            items.forEach((i) => {
                if (!next.includes(i)) next.push(i);
            });
            items.length = 0;
            next.forEach((i) => items.push(i));
        }
    };

    // Lazy getter so Dropzone-like `.files` stays live
    Object.defineProperty(api, 'files', {
        get() { return items.map(toPublicFile); }
    });

    bindClickable();
    return api;
}
