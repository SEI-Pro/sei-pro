/** Fronteira IO da entry de lista: DOM e flags são dependências explícitas. */

export function readListaEntryInputs({ root, checkConfigValue } = {}) {
    const queryRoot = root && typeof root.querySelector === 'function' ? root : null;
    const hasAny = (selector) => Boolean(queryRoot && queryRoot.querySelector(selector));
    const enabledValue = (name, fallback = true) => (
        typeof checkConfigValue === 'function' ? checkConfigValue(name) : fallback
    );

    return {
        hasProcessTables: hasAny('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado'),
        hasTreeFrame: hasAny('#ifrArvore'),
        enabled: {
            'controlar-prazos': enabledValue('gerenciarprazos'),
            'nao-lido': true,
            monitorados: enabledValue('gerenciarmonitorados')
        }
    };
}
