// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const LEGIS_SEARCH_URL = 'https://seipro.app/legis/search.php';
const DEFAULT_TIMEOUT_MS = 10000;

function ioError(error, message) {
    return { error, message, data: [] };
}

/**
 * Searches the SEI Pro legislation catalogue.
 *
 * Empty input is a successful empty result. Network failures are represented as
 * data so callers can preserve the document and continue operating offline.
 */
export async function searchLegislation(
    norms,
    {
        fetchImpl = globalThis.fetch,
        navigatorRef = globalThis.navigator,
        timeoutMs = DEFAULT_TIMEOUT_MS
    } = {}
) {
    const requestedNorms = Array.isArray(norms) ? norms.filter(Boolean) : [];
    if (requestedNorms.length === 0) return [];
    if (navigatorRef?.onLine === false) {
        return ioError('offline', 'Legislation search is unavailable while offline.');
    }
    if (typeof fetchImpl !== 'function') {
        return ioError('unavailable', 'Fetch is not available in this context.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const body = new URLSearchParams();
    requestedNorms.forEach((norm) => body.append('norma[]', norm));

    try {
        const response = await fetchImpl(LEGIS_SEARCH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body,
            signal: controller.signal
        });
        if (!response.ok) {
            return ioError('http', `Legislation search failed with HTTP ${response.status}.`);
        }

        const data = await response.json();
        return Array.isArray(data)
            ? data
            : ioError('invalid-response', 'Legislation search returned an invalid response.');
    } catch (error) {
        if (error?.name === 'AbortError') {
            return ioError('timeout', `Legislation search timed out after ${timeoutMs} ms.`);
        }
        return ioError('network', error?.message || 'Legislation search failed.');
    } finally {
        clearTimeout(timeoutId);
    }
}

export { DEFAULT_TIMEOUT_MS, LEGIS_SEARCH_URL };
