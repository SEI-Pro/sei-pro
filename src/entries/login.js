/**
 * Entry do contexto de LOGIN / assinatura (isolated-world).
 * Páginas: login.php (SEI novo) e controlador.php?acao=documento_assinar.
 *
 * Usa src/app boot + registry (piloto da arquitetura canônica).
 */
import { installCoreStack } from '../core/stack.js';
import { registerPilotFeatures } from '../app/register-pilot-features.js';
import { boot } from '../app/boot.js';
import { ready } from '../dom/index.js';

installCoreStack();
registerPilotFeatures();
ready(function () {
    boot('login');
});
