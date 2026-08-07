/**
 * Domínio PURO da feature "Filtrar a página pelo campo de pesquisa rápida"
 * (config `filtrarpaginapelapesquisarapida`).
 *
 * Sem DOM, sem jQuery, sem chrome.*. A tokenização e o cálculo de faixas de
 * destaque vivem em core/quickfilter.js (compartilhados com a árvore e o
 * visualizador). Aqui ficam só os bits puros específicos do FILTRO de linhas
 * da lista de processos: montar o "haystack" normalizado de uma linha e decidir
 * se ela casa com os tokens.
 */
import { normalizeFilterText } from '../../shared/quickfilter/domain.js';

// Normaliza, deduplica e junta os segmentos de texto crus de uma linha num único
// haystack pesquisável. `rawSegments` é uma lista de strings (texto, title,
// aria-label, tooltips, …) coletada pela view a partir do DOM.
export function buildRowHaystack(rawSegments) {
    const segments = [];
    const seen = Object.create(null);
    for (let i = 0; i < rawSegments.length; i++) {
        const value = normalizeFilterText(String(rawSegments[i] || '').replace(/ /g, ' '));
        if (value === '' || seen[value]) continue;
        seen[value] = true;
        segments.push(value);
    }
    return segments.join(' ');
}

// Uma linha casa se TODOS os tokens aparecem no haystack (AND). Sem tokens = casa.
export function rowMatchesTokens(haystack, tokens) {
    if (!tokens || tokens.length === 0) return true;
    return tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
}
