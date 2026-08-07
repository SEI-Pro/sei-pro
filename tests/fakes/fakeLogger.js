/**
 * Fake logger port (ADR-0005 / ADR-0006).
 * Records calls instead of writing to console.
 *
 * @param {{ scope?: string, debugEnabled?: boolean }} [options]
 */
export function fakeLogger(options = {}) {
    const entries = [];
    let debugEnabled = options.debugEnabled !== false;

    const logger = {
        scope: options.scope || '',
        entries,
        isDebugEnabled: () => debugEnabled,
        setDebugEnabled(value) { debugEnabled = !!value; },
        debug(...args) {
            if (debugEnabled) entries.push({ level: 'debug', args });
        },
        warn(...args) {
            entries.push({ level: 'warn', args });
        },
        error(...args) {
            entries.push({ level: 'error', args });
        },
        messagesOf(level) {
            return entries.filter((e) => e.level === level).map((e) => e.args);
        }
    };

    return logger;
}
