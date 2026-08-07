// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Parse PURO dos payloads que o SEI embute em <script> inline (`Nos[0]...`).
 * Sem DOM: recebem o texto do script e devolvem string/null. A varredura dos
 * <script> e o parse do HTML resultante ficam na camada de view (index.js).
 *
 * Há DOIS formatos distintos no legado — preservados VERBATIM:
 *  - `Nos[0].acoes = '...';`  (barra de ações; payload com aspas/barra escapadas)
 *  - `Nos[0].html  = '...'`   (lista de responsáveis; payload simples até a 1ª aspa)
 */

// Extrai e DESescapa o payload de `Nos[0].acoes = '...';` (regex não-gananciosa
// até `';`). Retorna o HTML pronto para parse, ou null se não casar.
export function extractNosAcoesHtml(scriptText) {
    var t = (typeof scriptText === 'string') ? scriptText : '';
    var m = t.match(/Nos\[0\]\.acoes\s*=\s*'([\s\S]*?)';/);
    if (!m) return null;
    return m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, '/');
}

// Extrai o payload bruto de `Nos[0].html = '...'` (até a 1ª aspa simples).
// NÃO desescapa (espelha o legado da Atribuição). Retorna a string ou null.
export function extractNosHtml(scriptText) {
    var t = (typeof scriptText === 'string') ? scriptText : '';
    if (t.indexOf('Nos[0].html = ') === -1) return null;
    var m = t.match(/Nos\[0\]\.html\s*=\s*'([^']+)'/);
    return m ? m[1] : null;
}
