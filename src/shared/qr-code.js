import { loadScriptOnce } from './lazy-script.js';

const QR_SCRIPT = 'js/lib/qrcode.min.js';
const QR_BRIDGE_SCRIPT = 'js/qr-code-main.js';
let qrLibraryPromise = null;
let bridgeRequestId = 0;

function extensionUrl(path) {
    const base = globalThis.URL_SPRO || '';
    return `${base.replace(/\/?$/, '/')}${path}`;
}

function resolveElement(target) {
    if (!target) return null;
    if (target.elements && target.elements[0]) return target.elements[0];
    return target.nodeType ? target : null;
}

function normalizeSize(options) {
    const value = Number(options.size || options.width || options.height || 128);
    return Number.isFinite(value) && value > 0 ? Math.round(value) : 128;
}

function normalizeLevel(QRCode, options) {
    const level = String(options.ecLevel || options.correctLevel || 'M').toUpperCase();
    return QRCode.CorrectLevel?.[level] ?? QRCode.CorrectLevel?.M;
}

function loadQrCodeLibrary() {
    if (typeof globalThis.QRCode === 'function') return Promise.resolve(globalThis.QRCode);
    if (!qrLibraryPromise) {
        qrLibraryPromise = loadScriptOnce(extensionUrl(QR_SCRIPT))
            .then(() => {
                if (typeof globalThis.QRCode !== 'function') {
                    throw new Error('The QR code library did not expose QRCode');
                }
                return globalThis.QRCode;
            })
            .catch((error) => {
                // A transient network/CSP failure should not poison all later QR
                // requests for the lifetime of the page.
                qrLibraryPromise = null;
                throw error;
            });
    }
    return qrLibraryPromise;
}

function qrOptions(QRCode, options) {
    const size = normalizeSize(options);
    const background = options.background === null ? 'rgba(0,0,0,0)' : (options.background || options.colorLight || '#ffffff');
    return {
        text: String(options.text ?? ''),
        width: size,
        height: Number(options.height) > 0 ? Math.round(Number(options.height)) : size,
        typeNumber: Number(options.minVersion || options.typeNumber || 0) || 0,
        colorDark: options.fill || options.colorDark || '#000000',
        colorLight: background,
        correctLevel: normalizeLevel(QRCode, options)
    };
}

function createQrInstance(QRCode, scratch, options) {
    const base = qrOptions(QRCode, options);
    try {
        return new QRCode(scratch, base);
    } catch (error) {
        // qrcode.js treats typeNumber as an exact version. The old plugin's
        // minVersion option meant “at least this version”, so retry in auto
        // mode for long text instead of making the QR dialog fail.
        if (!base.typeNumber) throw error;
        scratch.replaceChildren();
        return new QRCode(scratch, { ...base, typeNumber: 0 });
    }
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function hasAdvancedDrawingOptions(options) {
    return options.quiet != null
        || options.radius != null
        || Number(options.mode || 0) > 0
        || !!options.label
        || !!options.image;
}

function drawRoundedModule(ctx, x, y, size, radius) {
    const r = clamp(size * radius, 0, size / 2);
    if (!r) {
        ctx.fillRect(x, y, size, size);
        return;
    }
    if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, r);
        ctx.fill();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

/**
 * qrcode.js exposes the encoded matrix on the instance but does not expose
 * the old jquery-qrcode presentation options. Draw those options on a small
 * canvas so the editor's quiet/radius/label/image controls keep working after
 * the library consolidation.
 */
function drawAdvancedQr(instance, options, doc) {
    if (!hasAdvancedDrawingOptions(options)) return null;
    const matrix = instance?._oQRCode?.modules;
    const moduleCount = instance?._oQRCode?.moduleCount;
    if (!Array.isArray(matrix) || !Number.isFinite(moduleCount) || moduleCount <= 0) return null;

    const width = normalizeSize(options);
    const height = Number(options.height) > 0 ? Math.round(Number(options.height)) : width;
    const canvas = doc.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx;
    try {
        ctx = canvas.getContext('2d');
    } catch (_) {
        return null;
    }
    if (!ctx) return null;

    const background = options.background === null
        ? null
        : (options.background || options.colorLight || '#ffffff');
    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }

    const quiet = clamp(Math.round(Number(options.quiet) || 0), 0, 8);
    const cell = Math.max(1, Math.floor(Math.min(width, height) / (moduleCount + quiet * 2)));
    const qrSize = cell * (moduleCount + quiet * 2);
    const offsetX = Math.floor((width - qrSize) / 2);
    const offsetY = Math.floor((height - qrSize) / 2);
    ctx.fillStyle = options.fill || options.colorDark || '#000000';
    const radius = clamp(Number(options.radius) || 0, 0, 1);
    for (let row = 0; row < moduleCount; row += 1) {
        for (let column = 0; column < moduleCount; column += 1) {
            if (!matrix[row]?.[column]) continue;
            drawRoundedModule(
                ctx,
                offsetX + (column + quiet) * cell,
                offsetY + (row + quiet) * cell,
                cell,
                radius
            );
        }
    }

    const mode = Number(options.mode) || 0;
    const markerSize = clamp(Number(options.mSize) || 0.2, 0.01, 0.4) * Math.min(width, height);
    const markerX = clamp(Number(options.mPosX) || 0.5, 0, 1) * width;
    const markerY = clamp(Number(options.mPosY) || 0.5, 0, 1) * height;
    if ((mode === 1 || mode === 2) && options.label) {
        const labelWidth = Math.max(markerSize * 2, Math.min(width * 0.9, markerSize * 4));
        const labelHeight = Math.max(18, markerSize);
        const left = clamp(markerX - labelWidth / 2, 0, Math.max(0, width - labelWidth));
        const top = clamp(markerY - labelHeight / 2, 0, Math.max(0, height - labelHeight));
        ctx.fillStyle = background || '#ffffff';
        ctx.fillRect(left, top, labelWidth, labelHeight);
        ctx.fillStyle = options.fontcolor || '#ff9818';
        ctx.font = `${Math.max(10, Math.round(labelHeight * 0.45))}px ${options.fontname || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(options.label), left + labelWidth / 2, top + labelHeight / 2, labelWidth - 8);
    } else if ((mode === 3 || mode === 4) && options.image) {
        const imageSize = Math.max(1, markerSize);
        const left = clamp(markerX - imageSize / 2, 0, Math.max(0, width - imageSize));
        const top = clamp(markerY - imageSize / 2, 0, Math.max(0, height - imageSize));
        if (mode === 4) {
            ctx.fillStyle = background || '#ffffff';
            ctx.fillRect(left, top, imageSize, imageSize);
        }
        try {
            ctx.drawImage(options.image, left, top, imageSize, imageSize);
        } catch (_) { /* image may not be decoded yet */ }
    }
    return canvas;
}

function dataUrlFromNode(node) {
    if (!node) return null;
    if (node.tagName === 'CANVAS' && typeof node.toDataURL === 'function') {
        try { return node.toDataURL('image/png'); } catch { /* fall through */ }
    }
    if (node.tagName === 'IMG' && node.src) return node.src;
    if (node.tagName === 'SVG' && typeof XMLSerializer !== 'undefined') {
        const svg = new XMLSerializer().serializeToString(node);
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
    return null;
}

function appendRenderedImage(target, source, options) {
    const doc = target.ownerDocument || globalThis.document;
    const image = doc.createElement('img');
    image.src = source;
    image.width = normalizeSize(options);
    image.height = Number(options.height) > 0 ? Math.round(Number(options.height)) : image.width;
    image.alt = options.alt || options.text || 'Código QR';
    image.decoding = 'async';
    target.replaceChildren(image);
    target.removeAttribute('data-seipro-qr-code');
    return image;
}

function bridgeOptions(options) {
    // DOM attributes are the only data crossing the isolated/main-world
    // boundary. Keep this payload JSON-only; image elements and callbacks stay
    // on the local path where they are available.
    return {
        text: String(options.text ?? ''),
        size: normalizeSize(options),
        height: Number(options.height) > 0 ? Math.round(Number(options.height)) : undefined,
        fill: options.fill || options.colorDark || '#000000',
        background: options.background === null
            ? null
            : (options.background || options.colorLight || '#ffffff'),
        ecLevel: options.ecLevel || options.correctLevel || 'M',
        minVersion: Number(options.minVersion || options.typeNumber || 0) || 0,
        alt: options.alt || options.text || 'Código QR'
    };
}

function canUsePageBridge() {
    return !!(
        globalThis.URL_SPRO
        && typeof globalThis.document?.createElement === 'function'
        && typeof globalThis.CustomEvent === 'function'
    );
}

function isExtensionIsolatedWorld() {
    const runtime = globalThis.chrome?.runtime || globalThis.browser?.runtime;
    return !!(runtime?.id && runtime.id !== 'seipro-page-inject' && typeof runtime.getURL === 'function');
}

function renderThroughPageBridge(target, options) {
    if (!canUsePageBridge()) {
        return Promise.reject(new Error('The QR code library did not expose QRCode'));
    }

    const doc = target.ownerDocument || globalThis.document;
    const bridgeUrl = extensionUrl(QR_BRIDGE_SCRIPT);
    const requestId = `seipro-qr-${++bridgeRequestId}`;
    const payload = bridgeOptions(options);

    return new Promise((resolve, reject) => {
        let timer;
        const cleanup = () => {
            clearTimeout(timer);
            target.removeEventListener('seipro-qr-rendered', onRendered);
            target.removeEventListener('seipro-qr-error', onError);
            target.removeAttribute('data-seipro-qr-bridge-id');
        };
        const onRendered = () => {
            cleanup();
            resolve(target.querySelector('img, canvas, svg') || target);
        };
        const onError = (event) => {
            cleanup();
            target.removeAttribute('data-seipro-qr-options');
            target.removeAttribute('data-seipro-qr-script');
            reject(new Error(event?.detail || target.getAttribute('data-seipro-qr-error') || 'QR code rendering failed'));
        };

        target.addEventListener('seipro-qr-rendered', onRendered, { once: true });
        target.addEventListener('seipro-qr-error', onError, { once: true });
        target.setAttribute('data-seipro-qr-bridge-id', requestId);
        target.setAttribute('data-seipro-qr-options', JSON.stringify(payload));
        target.setAttribute('data-seipro-qr-script', extensionUrl(QR_SCRIPT));
        timer = setTimeout(() => onError({ detail: 'QR code bridge timed out' }), 15000);

        loadScriptOnce(bridgeUrl, doc).then(() => {
            const EventCtor = doc.defaultView?.CustomEvent || globalThis.CustomEvent;
            target.dispatchEvent(new EventCtor('seipro-qr-render', { bubbles: false }));
        }).catch(onError);
    });
}

/**
 * Render one QR code using the single vendored qrcode.js implementation.
 * The common qrcode options are preserved; legacy styling options are mapped
 * to the closest native equivalent (fill/background/size/error correction).
 */
export function renderQrCode(target, options = {}) {
    const element = resolveElement(target);
    if (!element) return Promise.resolve(null);
    if (typeof globalThis.QRCode !== 'function'
        && isExtensionIsolatedWorld()
        && canUsePageBridge()) {
        return renderThroughPageBridge(element, options);
    }
    return loadQrCodeLibrary().then((QRCode) => {
        const doc = element.ownerDocument || globalThis.document;
        const scratch = doc.createElement('div');
        scratch.style.cssText = 'position:fixed;left:-100000px;top:-100000px;width:1px;height:1px;overflow:hidden;';
        (doc.body || doc.documentElement).appendChild(scratch);
        try {
            const instance = createQrInstance(QRCode, scratch, options);
            const advancedCanvas = drawAdvancedQr(instance, options, doc);
            const source = advancedCanvas || scratch.querySelector('canvas, img[src], svg');
            const dataUrl = dataUrlFromNode(source);
            if (dataUrl) return appendRenderedImage(element, dataUrl, options);
            const clone = source ? element.ownerDocument.importNode(source, true) : null;
            element.replaceChildren();
            if (clone) element.appendChild(clone);
            return clone;
        } finally {
            scratch.remove();
        }
    }, (error) => {
        if (canUsePageBridge(element)) return renderThroughPageBridge(element, options);
        throw error;
    });
}

export function createQrCodePlaceholder(text, options = {}) {
    const span = document.createElement('span');
    span.className = options.className || 'seipro-qr-code';
    span.dataset.seiproQrCode = encodeURIComponent(String(text ?? ''));
    return span.outerHTML;
}

export function hydrateQrCodePlaceholders(root = globalThis.document, options = {}) {
    if (!root?.querySelectorAll) return Promise.resolve([]);
    const placeholders = Array.from(root.querySelectorAll('[data-seipro-qr-code]'));
    return Promise.all(placeholders.map((placeholder) => {
        const encoded = placeholder.dataset.seiproQrCode || '';
        let text = '';
        try { text = decodeURIComponent(encoded); } catch { text = encoded; }
        return renderQrCode(placeholder, { ...options, text })
            .catch(() => placeholder);
    }));
}

export { loadQrCodeLibrary };
