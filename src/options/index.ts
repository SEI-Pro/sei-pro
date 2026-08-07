// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Options page entry — extension settings UI (options_page / popup / SEI iframe).
 *
 * Bundled to dist/js/options.bundle.js and loaded by dist/html/options.html.
 * Vanilla ESM; no jQuery / jmespath / jQuery UI.
 */
import { installOptionsPage } from './view.js';

function boot() {
    installOptionsPage().catch((error) => {
        console.error('options: failed to boot', error);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
