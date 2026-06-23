/**
 * Regras PURAS da seção "Atribuição".
 * O fatiamento dos fragmentos (split '<br />') e a leitura do DOM (textContent,
 * a.ancoraSigla) ficam na view; aqui só a heurística de "não atribuído".
 */

// Um fragmento está "não atribuído" quando NÃO contém "atribuído para" (case-
// insensitive) E possui o link de sigla (a.ancoraSigla). VERBATIM do legado.
export function isAtribuicaoUnassigned(text, hasAncoraSigla) {
    var t = (typeof text === 'string') ? text : '';
    return !/atribuído para/i.test(t) && !!hasAncoraSigla;
}
