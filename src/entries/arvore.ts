// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Raiz de composição do contexto ÁRVORE (iframe do processo) — ADR-0005.
 *
 * O bloco ainda recebe `core-stack` e as bibliotecas legadas necessárias pelos
 * clusters de árvore. Esta entry é a única responsável por registrar e instalar
 * a feature moderna; `init_arvore.js` deixa de fazer descoberta dinâmica.
 */
import { createStorage } from '../platform/storage.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { registerArvoreExclusiveFeatures } from '../generated/arvore-feature-registry.js';
import { boot } from '../app/boot.js';
import { ready } from '../dom/index.js';

const ns = globalThis.SeiPro || {};
registerArvoreExclusiveFeatures();

ready(async function () {
    const logger = createLogger({ scope: 'arvore' });
    const messaging = createMessaging();
    const storage = createStorage({ messaging });
    const result = await boot('arvore', {
        logger,
        messaging,
        storage,
        config: ns.core && ns.core.config,
        clock: { now: () => Date.now() },
        document: typeof document !== 'undefined' ? document : null
    });
    if (result.failed.length) {
        logger.warn('features indisponíveis neste contexto', result.failed);
    }
});
