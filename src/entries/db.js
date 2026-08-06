/**
 * Entry do contexto DB (recepção de configuração externa por URL).
 * Substitui [core-stack.bundle + jquery + jmespath + purify + init_db.js]
 * por um bundle isolado, sem jQuery.
 */
import { installCoreStack } from '../core/stack.js';
import { installExternalConfig } from '../features/external-config/index.js';
import { ready } from '../dom/index.js';

installCoreStack();
ready(installExternalConfig);
