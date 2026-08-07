// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Raiz de composição do contexto DOCUMENTO/visualizador — ADR-0005. */
import { createStorage } from '../platform/storage.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { registerDocumentoExclusiveFeatures } from '../generated/documento-feature-registry.js';
import { boot } from '../app/boot.js';
import { ready } from '../dom/index.js';

const ns = globalThis.SeiPro || {};
registerDocumentoExclusiveFeatures();

ready(async function () {
    const logger = createLogger({ scope: 'documento' });
    const messaging = createMessaging();
    const storage = createStorage({ messaging });
    const result = await boot('documento', {
        logger,
        messaging,
        storage,
        config: ns.core && ns.core.config,
        clock: { now: () => Date.now() },
        document: typeof document !== 'undefined' ? document : null
    });
    if (result.failed.length) logger.warn('features indisponíveis neste contexto', result.failed);
});
