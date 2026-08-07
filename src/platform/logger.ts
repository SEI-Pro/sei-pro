// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro, globalRef } from '../core/global.js';

/**
 * Logger (isolated-world). Factory pura (ADR-0005) — não muta global.
 *
 * @param {{
 *   scope?: string,
 *   isDebugEnabled?: () => boolean,
 *   sink?: { log: Function, warn: Function, error: Function }
 * }} [options]
 */
export function createLogger(options = {}) {
    const scope = typeof options.scope === 'string' && options.scope ? options.scope : '';
    const sink = options.sink || console;

    function defaultIsDebugEnabled() {
        if (typeof globalRef.verifyConfigValue === 'function') {
            return globalRef.verifyConfigValue('debugpage') === true;
        }
        return false;
    }

    const isDebugEnabled = typeof options.isDebugEnabled === 'function'
        ? options.isDebugEnabled
        : defaultIsDebugEnabled;

    function prefix(args) {
        if (!scope) return Array.prototype.slice.call(args);
        return ['[' + scope + ']'].concat(Array.prototype.slice.call(args));
    }

    function debug() {
        if (isDebugEnabled()) sink.log.apply(sink, prefix(arguments));
    }
    function warn() { sink.warn.apply(sink, prefix(arguments)); }
    function error() { sink.error.apply(sink, prefix(arguments)); }

    return { isDebugEnabled, debug, warn, error, scope };
}

/** Compat: anexa logger em SeiPro.core.logger. */
export function installLogger() {
    const logger = createLogger();
    getSeiPro().core.logger = logger;
    return logger;
}
