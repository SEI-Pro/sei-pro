// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Regras PURAS da seção "Consulta" (Tipo / Nível de Acesso / Assuntos /
 * Observações / Interessados). A leitura do form (selects, radios) fica na view;
 * aqui o mapa de acesso e a separação nome/(unidade) de interessados.
 */

// Rótulo do nível de acesso a partir do valor do radio (0/1/2) + hipótese legal
// (só anexada quando Restrito). `value` null/ausente → ''. VERBATIM do legado.
export function acessoLabel(value, hipoteseText) {
    if (value == null || value === '') return '';
    var map = { '0': 'Público', '1': 'Restrito', '2': 'Sigiloso' };
    var txt = map[value] || value;
    if (value === '1' && hipoteseText) txt += ': ' + hipoteseText;
    return txt;
}

// Separa "Nome (Unidade)" em ['Nome', 'Unidade']; sem parêntese → ['Nome'].
// Apara espaços, remove ')' e descarta partes vazias. VERBATIM do legado.
export function splitInteressado(name) {
    var n = (typeof name === 'string') ? name : '';
    var parts = n.indexOf('(') !== -1
        ? n.split('(').map(function (s) { return s.trim().replace(')', ''); })
        : [n];
    return parts.filter(function (p) { return p; });
}
