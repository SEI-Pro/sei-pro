/**
 * Lista de processos — HTML/template factories (extracted from the monolito).
 */

export function homeFilterSelectHtml() {
    return (
        '<select id="filterTableHome" class="selectPro seipro-lista-filter" ' +
        'style="width:250px;margin-right:20px !important;" ' +
        'onchange="getFilterTableHome(this)" data-placeholder="Filtrar processos...">'
    );
}

export function assignmentFilterSelectHtml() {
    return (
        '<select id="filterAssignmentTableHome" class="selectPro seipro-lista-filter-assignment" ' +
        'style="width:250px;margin-right:20px !important;" ' +
        'onchange="getFilterAssignmentTableHome(this)" ' +
        'data-placeholder="Filtrar atribui\u00E7\u00E3o...">'
    );
}

export function csvExportLinkHtml() {
    return (
        '<a class="newLink seipro-lista-csv" onclick="getTableProcessosCSV()" id="processoToCSV" ' +
        'onmouseover="return infraTooltipMostrar(\'Exportar informa\u00E7\u00F5es de processos em planilha CSV\');" ' +
        'onmouseout="return infraTooltipOcultar();" ' +
        'style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>'
    );
}

