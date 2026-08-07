// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Raiz de composição do contexto DB (configuração externa por URL) — ADR-0005.
 * Constrói ports explicitamente e injeta em boot().
 */
import { installCoreStack } from '../core/stack.js';
import { createStorage } from '../platform/storage.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { registerDbExclusiveFeatures } from '../generated/db-feature-registry.js';
import { boot } from '../app/boot.js';
import { ready } from '../dom/index.js';

const ns = installCoreStack();
registerDbExclusiveFeatures();

ready(async function () {
    const logger = createLogger({ scope: 'db' });
    const messaging = createMessaging();
    const storage = createStorage({ messaging });
    const result = await boot('db', {
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
