// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Boot de contexto: resolve features do registry (ou da lista do contexto)
 * e chama install(ctx) respeitando configKey quando houver.
 *
 * Isolamento de falha (ADR-0006): exceção em install não impede as demais;
 * ids falhos vão em `failed` e são logados / marcados na UI quando possível.
 */
import { getContext } from './contexts.js';
import { featuresForContext, getRegisteredFeature } from './feature-registry.js';
import { getSeiPro } from '../core/global.js';
import { createLogger } from '../platform/logger.js';

function resolveConfig(deps) {
    if (deps.config && typeof deps.config.verifyConfigValue === 'function') {
        return deps.config;
    }
    const core = getSeiPro().core;
    return (core && core.config) || null;
}

function isFeatureEnabled(configKey, deps) {
    if (!configKey) return true;
    const config = resolveConfig(deps);
    if (!config || typeof config.verifyConfigValue !== 'function') return true;
    try {
        return !!config.verifyConfigValue(configKey);
    } catch (e) {
        // Uma configuração inválida não pode habilitar silenciosamente uma
        // capacidade opcional (em especial integrações externas).
        return false;
    }
}

function resolveLogger(deps) {
    if (deps.logger && typeof deps.logger.error === 'function') {
        return deps.logger;
    }
    return createLogger({ scope: 'boot' });
}

/**
 * Marca features indisponíveis no documento (ADR-0006: falha visível).
 * @param {string[]} failed
 * @param {object} deps
 */
function markFailedFeatures(failed, deps) {
    if (!failed.length) return;
    const doc = deps.document || deps.root || (typeof document !== 'undefined' ? document : null);
    if (!doc || !doc.documentElement) return;
    const logger = resolveLogger(deps);
    try {
        doc.documentElement.setAttribute('data-seipro-failed-features', failed.join(','));
        if (typeof doc.body !== 'undefined' && doc.body) {
            let marker = doc.getElementById('seipro-failed-features');
            if (!marker) {
                marker = doc.createElement('div');
                marker.id = 'seipro-failed-features';
                marker.setAttribute('role', 'status');
                marker.className = 'seipro-failed-features';
                marker.hidden = true;
                doc.body.appendChild(marker);
            }
            marker.textContent = 'SEI Pro: recursos indisponíveis — ' + failed.join(', ');
            marker.hidden = false;
        }
    } catch (e) {
        logger.warn('não foi possível marcar features falhas na UI', e);
    }
}

/**
 * @param {string} contextId
 * @param {object} [ctx]
 * @returns {Promise<{
 *   context: string,
 *   installed: string[],
 *   failed: string[],
 *   cleanup: () => void
 * }>}
 */
export async function boot(contextId, ctx = {}) {
    const context = getContext(contextId);
    if (!context) {
        return {
            context: contextId,
            installed: [],
            failed: [],
            cleanup() {}
        };
    }

    const fromRegistry = featuresForContext(contextId);
    const ids = fromRegistry.length
        ? fromRegistry.map((f) => f.id)
        : context.features.slice();

    const installed = [];
    const failed = [];
    const cleanups = [];
    const deps = {
        contextId,
        root: typeof document !== 'undefined' ? document : null,
        document: typeof document !== 'undefined' ? document : null,
        ...ctx
    };
    const logger = resolveLogger(deps);
    if (!deps.logger) deps.logger = logger;

    for (const id of ids) {
        const entry = getRegisteredFeature(id);
        if (!entry) continue;
        if (!isFeatureEnabled(entry.configKey, deps)) continue;
        try {
            const cleanup = await entry.install(deps);
            if (typeof cleanup === 'function') {
                cleanups.push({ id, cleanup });
            }
            installed.push(id);
        } catch (error) {
            logger.error('feature "' + id + '" falhou ao instalar', error);
            failed.push(id);
        }
    }

    if (failed.length) {
        markFailedFeatures(failed, deps);
    }

    return {
        context: contextId,
        installed,
        failed,
        cleanup() {
            for (let i = cleanups.length - 1; i >= 0; i -= 1) {
                try {
                    cleanups[i].cleanup();
                } catch (error) {
                    logger.error('cleanup da feature "' + cleanups[i].id + '" falhou', error);
                }
            }
        }
    };
}
