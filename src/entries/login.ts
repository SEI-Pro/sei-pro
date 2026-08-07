// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Raiz de composição do contexto LOGIN / assinatura (ADR-0005).
 * Páginas: login.php (SEI novo) e controlador.php?acao=documento_assinar.
 *
 * Constrói ports explicitamente e injeta em boot(); a stack ainda popula
 * SeiPro para consumidores legados do piloto.
 */
import { installCoreStack } from '../core/stack.js';
import { createStorage } from '../platform/storage.js';
import { createLogger } from '../platform/logger.js';
import { createMessaging } from '../platform/messaging.js';
import { registerPilotFeatures } from '../app/register-pilot-features.js';
import { boot } from '../app/boot.js';
import { ready } from '../dom/index.js';

const ns = installCoreStack();
registerPilotFeatures();

ready(async function () {
    const logger = createLogger({ scope: 'login' });
    const messaging = createMessaging();
    const storage = createStorage({ messaging });
    const result = await boot('login', {
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
