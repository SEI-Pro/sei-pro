/**
 * Controlar Prazos — DOMÍNIO.
 * Montagem (quase pura) do texto de tooltip do prazo nativo. Sem efeito de DOM/rede.
 * Lê getCurrentUserNamePro do escopo global isolado (legado) no momento da chamada.
 * Relocado verbatim do antigo sei-pro-controle-prazo.js (split domain/io/view).
 */
export function buildControlePrazoNativeTooltip(prazoInfo, dateValue) {
    var dateText = (dateValue && moment(dateValue, 'YYYY-MM-DD HH:mm:ss').isValid()) ? moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : '';
    if (prazoInfo && prazoInfo.concluido) {
        return 'Conclu\u00EDdo em ' + dateText;
    }
    if (prazoInfo && prazoInfo.content) {
        return prazoInfo.content;
    }
    var userName = (typeof getCurrentUserNamePro === 'function') ? getCurrentUserNamePro() : '';
    var daysRemaining = (prazoInfo && prazoInfo.diasRestantes !== null && typeof prazoInfo.diasRestantes !== 'undefined') ? prazoInfo.diasRestantes : '';
    if (userName && dateText && daysRemaining !== '') {
        return userName + ' ' + dateText + ' (' + daysRemaining + ' ' + (Math.abs(daysRemaining) == 1 ? 'dia' : 'dias') + ')';
    }
    if (userName && dateText) {
        return userName + ' ' + dateText;
    }
    return dateText || (prazoInfo && prazoInfo.content) || '';
}
