/**
 * Atividades — runtime e inicialização tardia da feature.
 *
 * A inicialização que antes acontecia ao importar o monólito só roda depois
 * que legacy-api.js publicou todas as funções compatíveis. Isso remove a
 * dependência de ordem entre módulos sem alterar os globais consumidos pelo SEI.
 */
import { installAtividadesState } from './state.js';

installAtividadesState();

let chartAtividadesLoading = false;

export function loadChartAtividades() {
    if (typeof Chart !== 'undefined' || chartAtividadesLoading) return;
    var base = typeof URL_SPRO !== 'undefined' ? URL_SPRO : '';
    if (!base || typeof $ === 'undefined' || typeof $.getScript !== 'function') return;
    chartAtividadesLoading = true;
    if (typeof loadStylePro === 'function') loadStylePro(base + 'css/chart.min.css');
    $.getScript(base + 'js/lib/chart.min.js');
}

export function loadKanbanStyleAtividades() {
    var base = typeof URL_SPRO !== 'undefined' ? URL_SPRO : '';
    if (!base || typeof loadStylePro !== 'function') return;
    loadStylePro(base + 'css/jkanban.min.css');
}

/** Run after every feature export has been installed in the compatibility API. */
export function initializeAtividadesRuntime() {
// ADICIONA ACOMPANHAMENTO DE ATIVIDADES
try {
globalThis.loadAtividadesPro = true;
} catch (e) { if (typeof globalThis.loadAtividadesPro === 'undefined') globalThis.loadAtividadesPro = false; }
try {
globalThis.debugScreen = false;
} catch (e) { if (typeof globalThis.debugScreen === 'undefined') globalThis.debugScreen = false; }

try { if (typeof ensureSEIProLogCapture === 'function') ensureSEIProLogCapture(); } catch (e) { /* optional */ }
try {
globalThis.perfilLoginAtiv = false;
} catch (e) { if (typeof globalThis.perfilLoginAtiv === 'undefined') globalThis.perfilLoginAtiv = false; }
try {
globalThis.urlServerAtiv = false;
} catch (e) { if (typeof globalThis.urlServerAtiv === 'undefined') globalThis.urlServerAtiv = false; }
try {
globalThis.backendServerAtiv = false;
} catch (e) { if (typeof globalThis.backendServerAtiv === 'undefined') globalThis.backendServerAtiv = false; }
try {
globalThis.userHashAtiv = false;
} catch (e) { if (typeof globalThis.userHashAtiv === 'undefined') globalThis.userHashAtiv = false; }
try {
globalThis.delayServerAtiv = 0;
} catch (e) { if (typeof globalThis.delayServerAtiv === 'undefined') globalThis.delayServerAtiv = false; }
try {
globalThis.arrayConfigAtividades = (typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && hybridStorageRestorePro('configDataAtividadesPadraoPro') !== null) ? restoreLocalDataConfigArray() : [];
} catch (e) { if (typeof globalThis.arrayConfigAtividades === 'undefined') globalThis.arrayConfigAtividades = []; }
try {
globalThis.arrayConfigAtivUnidade = (typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && hybridStorageRestorePro('configDataAtivUnidadePro') !== null) ? hybridStorageRestorePro('configDataAtivUnidadePro') : [];
} catch (e) { if (typeof globalThis.arrayConfigAtivUnidade === 'undefined') globalThis.arrayConfigAtivUnidade = []; }
try {
globalThis.ganttAtividades = false;
} catch (e) { if (typeof globalThis.ganttAtividades === 'undefined') globalThis.ganttAtividades = false; }
try {
globalThis.ganttAfastamentos = false;
} catch (e) { if (typeof globalThis.ganttAfastamentos === 'undefined') globalThis.ganttAfastamentos = false; }
try {
globalThis.ganttRecorrencias = false;
} catch (e) { if (typeof globalThis.ganttRecorrencias === 'undefined') globalThis.ganttRecorrencias = false; }
try {
globalThis.kanbanAtividades = false;
} catch (e) { if (typeof globalThis.kanbanAtividades === 'undefined') globalThis.kanbanAtividades = false; }
try {
globalThis.kanbanAtividadesMoving = false;
} catch (e) { if (typeof globalThis.kanbanAtividadesMoving === 'undefined') globalThis.kanbanAtividadesMoving = false; }
// var googleOneTap = false;
try {
globalThis.tableConfigEditor = {};
} catch (e) { if (typeof globalThis.tableConfigEditor === 'undefined') globalThis.tableConfigEditor = false; }
try {
globalThis.tableConfigList = {};
} catch (e) { if (typeof globalThis.tableConfigList === 'undefined') globalThis.tableConfigList = false; }
try {
globalThis.arrayAtividadesPro = (typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && hybridStorageRestorePro('configDataAtividadesPro') !== null) ? hybridStorageRestorePro('configDataAtividadesPro') : [];
} catch (e) { if (typeof globalThis.arrayAtividadesPro === 'undefined') globalThis.arrayAtividadesPro = []; }
try {
globalThis.arrayAtividadesProcPro = typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && (hybridStorageRestorePro('configDataAtividadesProcPro') !== null) ? hybridStorageRestorePro('configDataAtividadesProcPro') : [];
} catch (e) { if (typeof globalThis.arrayAtividadesProcPro === 'undefined') globalThis.arrayAtividadesProcPro = false; }
try {
globalThis.arrayPrescricoesProcPro = typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && (hybridStorageRestorePro('configDataPrescricoesProcPro') !== null) ? hybridStorageRestorePro('configDataPrescricoesProcPro') : [];
} catch (e) { if (typeof globalThis.arrayPrescricoesProcPro === 'undefined') globalThis.arrayPrescricoesProcPro = false; }
try {
globalThis.checkLoadAtividadesProcPro = false;
} catch (e) { if (typeof globalThis.checkLoadAtividadesProcPro === 'undefined') globalThis.checkLoadAtividadesProcPro = false; }
try {
globalThis.checkLoadMonitoradosProcPro = false;
} catch (e) { if (typeof globalThis.checkLoadMonitoradosProcPro === 'undefined') globalThis.checkLoadMonitoradosProcPro = false; }
try {
globalThis.arrayAtividades = ($('#ifrArvore').length > 0) ? arrayAtividadesProcPro : arrayAtividadesPro;
} catch (e) { if (typeof globalThis.arrayAtividades === 'undefined') globalThis.arrayAtividades = []; }
try {
globalThis.perfilAtividadesSelected = typeof getOptionsPro !== 'undefined' && getOptionsPro('panelAtividadesViewSyncUnidade')
    ? siglaUnidadeAtual
    : (typeof getOptionsPro !== 'undefined' && getOptionsPro('perfilAtividadesSelected')) ? getOptionsPro('perfilAtividadesSelected') : '';
} catch (e) { if (typeof globalThis.perfilAtividadesSelected === 'undefined') globalThis.perfilAtividadesSelected = false; }
try {
globalThis.arrayProcessosUnidade = typeof getProcessoUnidadePro !== 'undefined' ? getProcessoUnidadePro() : false;
} catch (e) { if (typeof globalThis.arrayProcessosUnidade === 'undefined') globalThis.arrayProcessosUnidade = false; }
try {
globalThis.arrayNomenclaturas = [];
} catch (e) { if (typeof globalThis.arrayNomenclaturas === 'undefined') globalThis.arrayNomenclaturas = false; }
try {
globalThis.timeRestoreAtividades = (typeof getOptionEntidade !== 'undefined' && getOptionEntidade('cache_demandas_value') && getOptionEntidade('cache_demandas_time')) ? { time: getOptionEntidade('cache_demandas_time'), value: getOptionEntidade('cache_demandas_value') } : { time: 'day', value: 1 };
} catch (e) { if (typeof globalThis.timeRestoreAtividades === 'undefined') globalThis.timeRestoreAtividades = false; }
try {
globalThis.lastUpdateAtividades = (typeof getOptionsPro !== 'undefined' && !getOptionsPro('panelLocalStorePro') && localStorageRestorePro('lastUpdateAtividades') !== null)
    ? localStorageRestorePro('lastRestoreAtividades') !== null && moment(localStorageRestorePro('lastRestoreAtividades'), 'YYYY-MM-DD HH:mm:ss').add(timeRestoreAtividades.value, timeRestoreAtividades.time) < moment() ? false : localStorageRestorePro('lastUpdateAtividades')
    : false;
} catch (e) { if (typeof globalThis.lastUpdateAtividades === 'undefined') globalThis.lastUpdateAtividades = false; }
globalThis.dly = undefined;
try {
globalThis.loadRowsPanelAtiv = false;
} catch (e) { if (typeof globalThis.loadRowsPanelAtiv === 'undefined') globalThis.loadRowsPanelAtiv = false; }

try {
globalThis.indexReportUpdate = 0;
} catch (e) { if (typeof globalThis.indexReportUpdate === 'undefined') globalThis.indexReportUpdate = false; }
try {
globalThis.listReportsUpdate = ['atividades', 'programas', 'afastamentos', 'planos', 'planos-arquivados', 'usuarios', 'objetivos'];
} catch (e) { if (typeof globalThis.listReportsUpdate === 'undefined') globalThis.listReportsUpdate = false; }
try {
globalThis.nameReportsUpdate = ['Atividades', 'Programas de Gest\u00E3o', 'Afastamentos', 'Planos de Trabalho', 'Planos de Trabalho [ARQUIVADOS]', 'Usu\u00E1rios', 'Objetivos'];
} catch (e) { if (typeof globalThis.nameReportsUpdate === 'undefined') globalThis.nameReportsUpdate = false; }

try {
globalThis.indexAPIUpdate = 0;
} catch (e) { if (typeof globalThis.indexAPIUpdate === 'undefined') globalThis.indexAPIUpdate = false; }
try {
globalThis.stopUpdateApi = false;
} catch (e) { if (typeof globalThis.stopUpdateApi === 'undefined') globalThis.stopUpdateApi = false; }
try {
globalThis.listAPIUpdate = ['api_mgi_planos_trabalho', 'api_mgi_planos_entrega'];
} catch (e) { if (typeof globalThis.listAPIUpdate === 'undefined') globalThis.listAPIUpdate = false; }
// var listAPIUpdate = ['api_mgi_participante', 'api_mgi_planos_entrega', 'api_mgi_planos_trabalho'];
try {
globalThis.nameAPIUpdate = ['Planos de Trabalho (MGI)', 'Planos de Entregas (MGI)'];
} catch (e) { if (typeof globalThis.nameAPIUpdate === 'undefined') globalThis.nameAPIUpdate = false; }
// var nameAPIUpdate = [ 'Participantes (MGI)', 'Planos de Entregas (MGI)', 'Planos de Trabalho (MGI)'];
try {
globalThis.notificacaoTexto = {
    avaliacao_plano: "Prezado(a) {apelido},\n\nO plano de trabalho [b]#{id_plano}[/b], com vig\u00EAncia de {data_inicio_vigencia} \u00E0 {data_fim_vigencia} foi avaliado pela chefia imediata\n\nNota Atribu\u00EDda: {nota_atribuida}.\n\n{tabela_entregas}\n\nJustificativas: {justificativas}.\n\nComent\u00E1rios: {comentarios}.\n\nNome do Avaliador: {nome_avaliador}.\n\nData da Avalia\u00E7\u00E3o: {data_avaliacao}.\n\n{texto_recurso}\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exerc\u00EDcio ({contato_unidade})",
    avaliacao_plano_nao_aceito: "- - - - \u26A0\uFE0F Aviso - - - -\n\nNos termos do {fundamento_analise_recurso}, o participante do PGD que tiver plano de trabalho avaliado como \u201Cinadequado\u201D ou como \u201Cn\u00E3o executado\u201D, poder\u00E1 recorrer da avalia\u00E7\u00E3o, prestando justificativas no prazo de [b]{prazo_apresentacao_recurso} dias {contagem_dias_recurso} a contar desta notifica\u00E7\u00E3o de avalia\u00E7\u00E3o[/b]\n\n[red]Fique atento! O prazo m\u00E1ximo para recorrer encerra-se dia {data_fim_recurso}.[/red]\n\nAcesse as configura\u00E7\u00F5es do sistema (\u2699\uFE0F > Planos de Trabalho) e apresente as justificativas para recorrer da avalia\u00E7\u00E3o da nota.",
    recurso_apresentacao: "Prezado(a) {apelido}},\n\nApresentado recurso sobre a avalia\u00E7\u00E3o do plano de trabalho [b]#{id_plano}[/b], com vig\u00EAncia de {data_inicio_vigencia} \u00E0 {data_fim_vigencia}.\n\nNota Atribu\u00EDda: {nota_atribuida}.\n\nComent\u00E1rios: {comentarios}\n\nNome do Avaliador: {nome_avaliador}.\n\nData da Avalia\u00E7\u00E3o: {data_avaliacao}.\n\n- - - -  \uD83D\uDD3D Abaixo, conte\u00FAdo do RECURSO - - - -\n\nNome do Avaliado: {nome_avaliado}\n\nData da Apresenta\u00E7\u00E3o de Recurso: {data_apresentacao_recurso}.\n\n[b]Justificativas para reconsidera\u00E7\u00E3o da nota:[/b] {justificativa_avaliado}\n\n- - - - \u26A0\uFE0F Aviso - - - -\n\nNos termos do {fundamento_analise_recurso}, a chefia imediata dever\u00E1 analisar o recurso apresentado pelo participante no prazo de [b]{prazo_analise_recurso} dias {contagem_dias_recurso} a contar desta notifica\u00E7\u00E3o.[/b]\n\n[red]Ap\u00F3s o prazo mencionado, o cadastramento de novos planos e demandas poder\u00E1 ser restringido para toda a unidade.[/red]\n\nAcesse as configura\u00E7\u00F5es do sistema (\u2699\uFE0F > Planos de Trabalho) e avalie as justificativas apresentadas.[\b]\n\n[red]Ressalta-se que caso a justificativa apresentada seja acatada, a avalia\u00E7\u00E3o inicial dever\u00E1 ser ajustada. Entretanto, se n\u00E3o acatada, o chefe da unidade de execu\u00E7\u00E3o dever\u00E1 apresentar os motivos da negativa e dar ci\u00EAncia \u00E0 unidade de gest\u00E3o de pessoas.[/red]",
    recurso_analise: "Prezado(a) {apelido},\n\nRegistrada an\u00E1lise do recurso sobre a avalia\u00E7\u00E3o do plano de trabalho [b]#{id_plano}[/b], com vig\u00EAncia de {data_inicio_vigencia} \u00E0 {data_fim_vigencia}.\n\nNota Atribu\u00EDda: {nota_atribuida}\n\nComent\u00E1rios: {comentarios}\n\nNome do Avaliador: {nome_avaliador}.\n\n- - - -  \uD83D\uDD3D Abaixo, conte\u00FAdo do RECURSO - - - -\n\nNome do Avaliado: {nome_avaliado}\n\nData da Apresenta\u00E7\u00E3o de Recurso: {data_apresentacao_recurso}.\n\n[b]Justificativas para reconsidera\u00E7\u00E3o da nota:[/b] {justificativa_avaliado}\n\n- - - -  \uD83D\uDD3D Abaixo, resultado da AN\u00C1LISE DO RECURSO - - - -\n\nNome do Avaliador: {nome_avaliador_recurso}\n\nData da An\u00E1lise: {data_analise_recurso}\n\n{resultado_analise}\n\n- - - - \u26A0\uFE0F Aviso - - - -\n\n[red]Nos termos do {fundamento_analise_recurso}, o chefe da unidade de execu\u00E7\u00E3o dever\u00E1 cientificar a unidade de gest\u00E3o de pessoas para provid\u00EAncias.[/red]\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exerc\u00EDcio ({contato_unidade})",
    cancelamento_avaliacao_plano: "Prezado(a) {apelido},\n\nA avalia\u00E7\u00E3o do plano de trabalho [b]#{id_plano}[/b], com vig\u00EAncia de {data_inicio_vigencia} \u00E0 {data_fim_vigencia}. foi [b]cancelada[/b] pela chefia imediata.\n\nNome do Cancelador: {nome_cancelador}.\n\nData do Cancelamento: {data_cancelamento}.\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exerc\u00EDcio ({contato_unidade})",
    omissao_demanda: "Prezado(a) {apelido},\n\nA demanda [b]#{id_demanda}[/b] atribu\u00EDda \u00E0 voc\u00EA foi encerrada por omiss\u00E3o de entregas pactuadas.\n\nAssunto: {assunto}.\n\nAtividade: {nome_atividade}.\n\nData de distribui\u00E7\u00E3o: {data_distribuicao}.\n\nPrazo de entrega: {prazo_entrega}.\n\nTempo pactuado: {tempo_pactuado}.\n\nComent\u00E1rios: {comentarios}.\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exerc\u00EDcio ({contato_unidade})"
};
} catch (e) { if (typeof globalThis.notificacaoTexto === 'undefined') globalThis.notificacaoTexto = false; }

try {
globalThis.listLabelsTiposMetadados = [
    { label: 'N\u00FAmero', value: 'number' },
    { label: 'Texto', value: 'text' },
    { label: 'CPF', value: 'cpf' },
    { label: 'Usu\u00E1rio', value: 'usuario' },
    { label: 'Unidade', value: 'unidade' },
    { label: 'CNPJ', value: 'cnpj' },
    { label: 'Telefone', value: 'telefone' },
    { label: 'Processo', value: 'processo' },
    { label: 'Sim/N\u00E3o', value: 'boolean' },
    { label: 'URL', value: 'url' },
    { label: 'Mapa', value: 'latlong' },
    { label: 'Data', value: 'date' },
    { label: 'Data/Hora', value: 'datetime' }
];
} catch (e) { if (typeof globalThis.listLabelsTiposMetadados === 'undefined') globalThis.listLabelsTiposMetadados = false; }
try {
globalThis.chartColors = {
    blue: "rgb(54, 162, 235)",
    dark_blue: "rgb(4 110 188)",
    green: "rgb(75, 192, 192)",
    red: "rgb(255, 99, 132)",
    magenta: "rgb(218,112,214)",
    orange: "rgb(255, 159, 64)",
    purple: "rgb(153, 102, 255)",
    cyan: "rgb(0,206,209)",
    grey: "rgb(201, 203, 207)",
    yellow: "rgb(255, 205, 86)",
    maroon: "rgb(128,0,0)",
    olive: "rgb(85,107,47)",
    teal: "rgb(0,128,128)",
    navy: "rgb(65,105,225)",
    silver: "rgb(192,192,192)",
    salmon: "rgb(250,128,114)",
    steel: "rgb(70,130,180)",
    violet: "rgb(238,130,238)",
    pink: "rgb(255,192,203)",
    chocolate: "rgb(210,105,30)",
    light_grey: "rgb(220,220,220)",
    dark_grey: "rgb(102 102 102)",
    silver_blue: "rgb(236 240 242)"
}
if (typeof Chart !== 'undefined') Chart.defaults.color = (localStorage.getItem('darkModePro') ? chartColors.light_grey : chartColors.dark_grey);
} catch (e) { if (typeof globalThis.chartColors === 'undefined') globalThis.chartColors = false; }

/* getName → shared/nomenclatura.js */
/* getNameGenre → shared/nomenclatura.js */
}
