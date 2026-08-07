/**
 * Registra features do piloto login/db no feature-registry.
 * Importado pelas entries correspondentes antes de boot().
 */
import { registerFeature } from './feature-registry.js';
import { installLoginAutofill } from '../features/login/index.js';
import { installExternalConfig } from '../features/external-config/index.js';

let registered = false;

export function registerPilotFeatures() {
    if (registered) return;
    registerFeature({
        id: 'login',
        configKey: 'autopreenchersenha',
        contexts: ['login'],
        install: installLoginAutofill
    });
    registerFeature({
        id: 'external-config',
        configKey: null,
        contexts: ['db'],
        install: installExternalConfig
    });
    registered = true;
}
