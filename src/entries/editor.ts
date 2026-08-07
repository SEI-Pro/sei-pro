// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor context entry — boots editor + legis without init.js getScript.
 * Built as dist/js/sei-pro-editor.js (stable manifest name).
 *
 * Normally WAR-injected into the page MAIN world by editor-loader.js so the
 * bundle can see SEI's CKEDITOR. page-runtime installs first (side effect) so
 * URL_SPRO / config globals exist before editor boot.
 */
import { installEditorPageRuntime } from '../features/editor/page-runtime.js';
import '../features/legis/index.js';
import { registerEditorExclusiveFeatures } from '../generated/editor-feature-registry.js';
import { boot } from '../app/boot.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { createStorage } from '../platform/storage.js';
import { ready } from '../dom/index.js';

installEditorPageRuntime();
registerEditorExclusiveFeatures();

ready(async function () {
    const logger = createLogger({ scope: 'editor' });
    const messaging = createMessaging();
    const storage = createStorage({ messaging });
    const result = await boot('editor', {
        logger,
        messaging,
        storage,
        config: globalThis.SeiPro?.core?.config,
        clock: { now: () => Date.now() },
        document: typeof document !== 'undefined' ? document : null
    });
    if (result.failed.length) logger.warn('features indisponíveis neste contexto', result.failed);
});
