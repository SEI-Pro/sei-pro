/*
 * Main-world companion for the shared QR adapter.
 *
 * Content scripts cannot read globals created by a page <script>. The adapter
 * therefore uses this DOM-only bridge when QRCode is not visible in its own
 * world. The bridge loads the same vendored qrcode.js and exchanges options
 * through data attributes/events, so no page API is exposed.
 */
(function () {
    if (typeof window === 'undefined' || !window.document) return;

    var doc = window.document;
    var renderEvent = 'seipro-qr-render';
    var renderedEvent = 'seipro-qr-rendered';
    var errorEvent = 'seipro-qr-error';
    var state = window.__SEI_PRO_QR_BRIDGE__;
    if (state && state.installed) return;

    state = { installed: true, libraryPromise: null };
    window.__SEI_PRO_QR_BRIDGE__ = state;

    function dispatch(target, name, message) {
        var event;
        try {
            event = new CustomEvent(name, {
                bubbles: false,
                detail: message || ''
            });
        } catch (e) {
            event = doc.createEvent('Event');
            event.initEvent(name, false, false);
        }
        target.dispatchEvent(event);
    }

    function level(QRCode, value) {
        var key = String(value || 'M').toUpperCase();
        return QRCode.CorrectLevel && QRCode.CorrectLevel[key]
            || (QRCode.CorrectLevel && QRCode.CorrectLevel.M);
    }

    function optionsFor(QRCode, options) {
        var size = Number(options.size || options.width || options.height || 128);
        if (!isFinite(size) || size <= 0) size = 128;
        size = Math.round(size);
        return {
            text: String(options.text || ''),
            width: size,
            height: Number(options.height) > 0 ? Math.round(Number(options.height)) : size,
            typeNumber: Number(options.minVersion || options.typeNumber || 0) || 0,
            colorDark: options.fill || options.colorDark || '#000000',
            colorLight: options.background === null
                ? 'rgba(0,0,0,0)'
                : (options.background || options.colorLight || '#ffffff'),
            correctLevel: level(QRCode, options.ecLevel || options.correctLevel)
        };
    }

    function loadLibrary(target) {
        if (typeof window.QRCode === 'function') return Promise.resolve(window.QRCode);
        if (state.libraryPromise) return state.libraryPromise;

        var url = target.getAttribute('data-seipro-qr-script');
        if (!url) return Promise.reject(new Error('QR code library URL is missing'));

        state.libraryPromise = new Promise(function (resolve, reject) {
            var script = doc.createElement('script');
            script.async = false;
            script.src = url;
            script.onload = function () {
                script.dataset.seiproLoaded = 'true';
                if (typeof window.QRCode === 'function') resolve(window.QRCode);
                else reject(new Error('The QR code library did not expose QRCode'));
            };
            script.onerror = function () {
                reject(new Error('Failed to load the QR code library'));
            };
            (doc.head || doc.documentElement).appendChild(script);
        }).catch(function (error) {
            state.libraryPromise = null;
            throw error;
        });
        return state.libraryPromise;
    }

    function render(target) {
        var raw = target.getAttribute('data-seipro-qr-options') || '{}';
        var options;
        try {
            options = JSON.parse(raw);
        } catch (e) {
            options = {};
        }

        loadLibrary(target).then(function (QRCode) {
            var safe = optionsFor(QRCode, options);
            target.replaceChildren();
            var instance;
            try {
                instance = new QRCode(target, safe);
            } catch (error) {
                if (!safe.typeNumber) throw error;
                target.replaceChildren();
                instance = new QRCode(target, Object.assign({}, safe, { typeNumber: 0 }));
            }
            var image = target.querySelector('img[src]');
            if (!image) {
                var canvas = target.querySelector('canvas');
                if (canvas && typeof canvas.toDataURL === 'function') {
                    image = doc.createElement('img');
                    image.src = canvas.toDataURL('image/png');
                    image.width = safe.width;
                    image.height = safe.height;
                    target.replaceChildren(image);
                }
            }
            if (image) {
                image.alt = options.alt || options.text || 'Código QR';
                image.decoding = 'async';
            }
            target.removeAttribute('data-seipro-qr-options');
            target.removeAttribute('data-seipro-qr-script');
            target.removeAttribute('data-seipro-qr-code');
            dispatch(target, renderedEvent, '');
            return instance;
        }).catch(function (error) {
            target.setAttribute('data-seipro-qr-error', String(error && error.message || error));
            dispatch(target, errorEvent, String(error && error.message || error));
        });
    }

    doc.addEventListener(renderEvent, function (event) {
        var target = event && event.target;
        if (!target || !target.getAttribute || !target.hasAttribute('data-seipro-qr-options')) return;
        render(target);
    }, true);
})();
