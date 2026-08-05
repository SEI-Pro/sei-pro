/**
 * Resolve CKEDITOR for the editor bundle.
 *
 * When WAR-injected into the page MAIN world (editor-loader.js), `window.CKEDITOR`
 * is the real SEI instance. When running in the isolated world (tests / legacy),
 * we still try a few DOM probes, but MAIN injection is the supported path.
 */

export function getPageCkeditor() {
    if (globalThis.CKEDITOR && globalThis.CKEDITOR.dialog) {
        return globalThis.CKEDITOR;
    }
    try {
        if (typeof window !== 'undefined' && window.CKEDITOR && window.CKEDITOR.dialog) {
            globalThis.CKEDITOR = window.CKEDITOR;
            return window.CKEDITOR;
        }
    } catch (e) { /* noop */ }
    return null;
}

/**
 * Wait until page CKEDITOR exposes the dialog API.
 */
export function waitForPageCkeditor({ timeoutMs = 15000, intervalMs = 100 } = {}) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        function tick() {
            const cke = getPageCkeditor();
            if (cke && cke.dialog) {
                resolve(cke);
                return;
            }
            if (Date.now() - start >= timeoutMs) {
                reject(new Error('CKEDITOR not available on page within timeout'));
                return;
            }
            setTimeout(tick, intervalMs);
        }
        tick();
    });
}

/** Ensure bare `CKEDITOR` identifier works inside the IIFE bundle. */
export function bindCkeditorGlobal(cke) {
    if (!cke) return;
    globalThis.CKEDITOR = cke;
    try {
        if (typeof window !== 'undefined') window.CKEDITOR = cke;
    } catch (e) { /* noop */ }
}
