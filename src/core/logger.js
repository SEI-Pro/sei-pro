import { getSeiPro, globalRef } from './global.js';

export function installLogger() {
    function isDebugEnabled() {
        if (typeof globalRef.verifyConfigValue === 'function') {
            return globalRef.verifyConfigValue('debugpage') === true;
        }
        return false;
    }

    function debug() {
        if (!isDebugEnabled()) return;
        console.log.apply(console, arguments);
    }

    function warn() {
        console.warn.apply(console, arguments);
    }

    function error() {
        console.error.apply(console, arguments);
    }

    const logger = {
        isDebugEnabled,
        debug,
        warn,
        error
    };

    getSeiPro().core.logger = logger;
    return logger;
}
