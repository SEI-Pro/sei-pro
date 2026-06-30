// docs-lote / domain — lógica PURA da feature "Enviar Múltiplos Documentos Externos".
// Sem DOM, sem jQuery, sem chrome.*, sem globais do SEI. 100% testável.
//
// Recebe dados, devolve dados. Toda extração que depende só de uma string ou de
// estruturas simples (regex, interpolação, cruzamento de campos, serialização de
// form) vive aqui — separada do scraping (io.js) e dos diálogos (view.js).

// Extrai a URL de "novo documento" de dentro do HTML da árvore (string crua).
export function extractNewDocUrl(htmlArvore) {
    const m = String(htmlArvore || '').match(
        /controlador\.php\?acao=documento_escolher_tipo&acao_origem=arvore_visualizar[^"]*/
    );
    if (!m) throw new Error('Erro ao encontrar o link de novo documento');
    return m[0];
}

// Extrai o link do editor (editor_montar) do HTML retornado ao confirmar o documento.
export function extractEditorUrl(htmlDocCreated) {
    const m = String(htmlDocCreated || '').match(
        /controlador\.php\?acao=editor_montar&id_procedimento=[^'"]*/
    );
    if (!m) throw new Error('Link de edição não encontrado');
    return m[0];
}

// Substitui ##campo## pelo valor correspondente na linha do CSV. Campos sem
// correspondência são mantidos literais (igual ao legado).
export function interpolateEspecificacao(template, dataCSV) {
    return String(template || '').replace(/##(.*?)##/g, (match, chave) =>
        dataCSV && dataCSV[chave] !== undefined ? dataCSV[chave] : match
    );
}

// Interseção entre os campos dinâmicos do modelo (##campo##) e os cabeçalhos do CSV.
// Retorna a lista de cabeçalhos que casam com algum campo dinâmico (ordem do CSV).
export function computeDataCrossing(dynamicFields, csvHeaders) {
    const cleanFields = (dynamicFields || []).map((f) => String(f).replaceAll('#', ''));
    const out = [];
    (csvHeaders || []).forEach((header) => {
        if (cleanFields.indexOf(header) !== -1) out.push(header);
    });
    return out;
}

// Monta a regex global que casa qualquer ##campo## listado em dataCrossing.
export function buildCrossingRegex(dataCrossing) {
    return new RegExp((dataCrossing || []).map((d) => `##${d}##`).join('|'), 'g');
}

// Serializa um objeto de parâmetros em querystring x-www-form-urlencoded, escapando
// seletivamente as chaves indicadas. `escapeFn` é injetada (escapeComponent do core)
// para manter o domínio puro. Preserva a semântica do legado (sem encodeURIComponent
// global — só as chaves marcadas passam por escapeFn).
export function serializeParams(params, shouldEscapeKey, escapeFn) {
    let postData = '';
    for (const k in params) {
        if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
        if (postData !== '') postData += '&';
        const valor = shouldEscapeKey && shouldEscapeKey(k) ? escapeFn(params[k]) : params[k];
        postData += `${k}=${valor}`;
    }
    return postData;
}
