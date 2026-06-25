/**
 * Entry do contexto de LOGIN / assinatura (isolated-world).
 * Páginas: login.php (SEI novo) e controlador.php?acao=documento_assinar.
 *
 * Substitui o par legado [core-stack.bundle + jquery + init_pwd.js] por um único
 * bundle isolado, sem jQuery e sem mundo MAIN.
 */
import { installCoreStack } from '../core/stack.js';
import { installLoginAutofill } from '../features/login/index.js';
import { ready } from '../dom/index.js';

installCoreStack();
ready(installLoginAutofill);
