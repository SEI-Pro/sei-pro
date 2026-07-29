/**
 * Árvore upload view — vanilla DOM (no jQuery).
 */
import { on, qs } from '../../dom/index.js';
import { createSortable } from '../../shared/ui/sortable.js';

export function bindArvoreToolbarProcess({ element, $, onAction }) {
    // jQuery toolbar plugin still used by menus — kept as injected dep until E-arvore-menus closes.
    return element.toolbar({
        content: '#toolbar-options-proc',
        position: 'bottom',
        adjustment: 5,
        style: 'menu'
    }).on('toolbarItemClick', function (event, triggerButton) {
        onAction($(this), triggerButton);
    });
}

export function bindUploadArvoreNativeDragEvents(deps = {}) {
    const root = deps.root || document;
    const hasUploadFiles = deps.hasUploadFiles;
    const openModalDropzone = deps.openModalDropzone;
    const cancelUpload = deps.cancelUpload;
    const getDropzone = deps.getDropzone || (() => null);

    if (typeof hasUploadFiles !== 'function') return;
    if (typeof openModalDropzone !== 'function' || typeof cancelUpload !== 'function') return;
    if (root.__seiproUploadDragBound) return;
    root.__seiproUploadDragBound = true;

    const onDragOver = (event) => {
        const dataTransfer = event.dataTransfer;
        if (!hasUploadFiles(dataTransfer)) return;
        event.preventDefault();
        if (dataTransfer) dataTransfer.dropEffect = 'copy';
        openModalDropzone();
    };
    const onDragLeave = (event) => {
        if (event.clientX <= 0 && event.clientY <= 0) cancelUpload();
    };
    const onDrop = (event) => {
        const dataTransfer = event.dataTransfer;
        if (!hasUploadFiles(dataTransfer)) return;
        event.preventDefault();
        cancelUpload();
        const dropzone = getDropzone();
        if (dropzone && typeof dropzone.handleFiles === 'function') {
            dropzone.handleFiles(Array.from(dataTransfer.files || []));
        }
    };

    root.addEventListener('dragenter', onDragOver);
    root.addEventListener('dragover', onDragOver);
    root.addEventListener('dragleave', onDragLeave);
    root.addEventListener('drop', onDrop);

    return () => {
        root.removeEventListener('dragenter', onDragOver);
        root.removeEventListener('dragover', onDragOver);
        root.removeEventListener('dragleave', onDragLeave);
        root.removeEventListener('drop', onDrop);
        root.__seiproUploadDragBound = false;
    };
}

export function bindUploadConfirmActions(deps = {}) {
    const root = deps.root || document;
    if (!root || root.__seiproArvoreUploadActionsBound) return;
    root.__seiproArvoreUploadActionsBound = true;

    const onCancel = deps.onCancel;
    const onSend = deps.onSend;
    const onStatus = deps.onStatus;

    on(root, 'click', '[data-seipro-arvore-action="dropzone-cancel"]', (event) => {
        event.preventDefault();
        if (typeof onCancel === 'function') onCancel(event);
    });
    on(root, 'click', '[data-seipro-arvore-action="send-upload"]', (event, match) => {
        event.preventDefault();
        if (typeof onStatus === 'function') onStatus(match);
        if (typeof onSend === 'function') onSend(match);
    });
}

export function setUploadHover(container, on) {
    if (!container) return;
    container.classList.toggle('dz-drag-hover', !!on);
    container.classList.toggle('seipro-arvore-upload-hover', !!on);
}

export function ensureUploadOverlay(container, html) {
    if (!container) return null;
    let overlay = container.querySelector('#dz-infoupload, [data-seipro-arvore-upload-overlay]');
    if (!overlay) {
        container.insertAdjacentHTML('afterbegin', html);
        overlay = container.querySelector('#dz-infoupload, [data-seipro-arvore-upload-overlay]');
        container.dataset.seiproUploadIndex = container.dataset.seiproUploadIndex || '0';
    }
    return overlay;
}

export function setPreviewError(previewEl, message) {
    if (!previewEl) return;
    previewEl.classList.add('dz-error', 'seipro-file-error');
    const span = previewEl.querySelector('[data-seipro-file-error], .dz-error-message span');
    if (span) span.textContent = message || '';
}

export function updatePreviewAfterSave(previewEl, { idDocumento, href, title, icon, ifrTarget }) {
    if (!previewEl) return;
    const link = previewEl.querySelector('a.dz-filename, a[target="' + (ifrTarget || 'ifrVisualizacao') + '"]');
    if (link) {
        link.setAttribute('href', href || '');
        link.id = 'anchor' + idDocumento;
        const span = link.querySelector('span');
        if (span) {
            span.textContent = title || '';
            span.id = 'span' + idDocumento;
        }
    }
    const imgAnchor = previewEl.querySelector('a#anchorImgID, a[id^="anchorImg"]');
    if (imgAnchor) {
        imgAnchor.id = 'anchorImg' + idDocumento;
        const img = imgAnchor.querySelector('img');
        if (img) {
            img.src = icon || img.src;
            img.id = 'icon' + idDocumento;
        }
    }
}

export function bindUploadSortable(container, { onReorder } = {}) {
    if (!container) return null;
    return createSortable(container, {
        items: '.dz-file-preview, .seipro-arvore-file-preview',
        handle: '.dz-filename',
        onUpdate: (ordered) => {
            if (typeof onReorder === 'function') onReorder(ordered);
        }
    });
}

export function statusUploadButton(el) {
    if (!el) return;
    const icon = el.querySelector('i');
    if (icon) icon.className = 'fas fa-sync-alt fa-spin azulColor';
    el.removeAttribute('onclick');
}

export function qsUploadPreview(root, index) {
    const list = (root || document).querySelectorAll('.dz-preview, .seipro-arvore-file-preview');
    return list[index] || null;
}

export function getUploadIndex(container) {
    if (!container) return 0;
    const raw = container.dataset ? container.dataset.seiproUploadIndex : null;
    if (raw != null) return parseInt(raw, 10) || 0;
    return 0;
}

export function setUploadIndex(container, index) {
    if (!container) return;
    if (container.dataset) container.dataset.seiproUploadIndex = String(index);
}

export { qs };
