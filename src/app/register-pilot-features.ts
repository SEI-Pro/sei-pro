// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Registra descritores do piloto login/db no feature-registry.
 * Importado pelas entries correspondentes antes de boot().
 * Metadados vêm de feature.ts (ADR-0004) — sem listas duplicadas de configKey.
 */
import { registerFeature } from './feature-registry.js';
import loginFeature from '../features/login/feature.js';
import externalConfigFeature from '../features/external-config/feature.js';

const PILOT_DESCRIPTORS = [loginFeature, externalConfigFeature];

let registered = false;

export function registerPilotFeatures() {
    if (registered) return;
    for (const descriptor of PILOT_DESCRIPTORS) {
        registerFeature(descriptor);
    }
    registered = true;
}
