/**
 * Regras PURAS da seção "Marcador".
 * A varredura das linhas da tabela / fallback de form fica na view; aqui só a
 * extração do id do marcador a partir do atributo onclick do link de remover.
 */

// Extrai o id de `acaoRemover('<id>'...)`. Retorna o id ou null. VERBATIM.
export function parseAcaoRemoverId(onclickAttr) {
    var s = (typeof onclickAttr === 'string') ? onclickAttr : '';
    var m = s.match(/acaoRemover\('([^']+)'/);
    return m ? m[1] : null;
}
