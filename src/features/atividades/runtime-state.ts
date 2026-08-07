// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Runtime state factory for Atividades.
 *
 * This module only reads host adapters supplied by the context and returns a
 * plain state patch. It deliberately does not write globals, touch the DOM or
 * schedule work. The browser runtime can therefore be initialized and tested
 * without loading the page bundle.
 */

const REPORT_KEYS = Object.freeze([
    'atividades',
    'programas',
    'afastamentos',
    'planos',
    'planos-arquivados',
    'usuarios',
    'objetivos'
]);

const REPORT_NAMES = Object.freeze([
    'Atividades',
    'Programas de Gestão',
    'Afastamentos',
    'Planos de Trabalho',
    'Planos de Trabalho [ARQUIVADOS]',
    'Usuários',
    'Objetivos'
]);

const API_KEYS = Object.freeze(['api_mgi_planos_trabalho', 'api_mgi_planos_entrega']);
const API_NAMES = Object.freeze(['Planos de Trabalho (MGI)', 'Planos de Entregas (MGI)']);

const METADATA_TYPE_LABELS = Object.freeze([
    { label: 'Número', value: 'number' },
    { label: 'Texto', value: 'text' },
    { label: 'CPF', value: 'cpf' },
    { label: 'Usuário', value: 'usuario' },
    { label: 'Unidade', value: 'unidade' },
    { label: 'CNPJ', value: 'cnpj' },
    { label: 'Telefone', value: 'telefone' },
    { label: 'Processo', value: 'processo' },
    { label: 'Sim/Não', value: 'boolean' },
    { label: 'URL', value: 'url' },
    { label: 'Mapa', value: 'latlong' },
    { label: 'Data', value: 'date' },
    { label: 'Data/Hora', value: 'datetime' }
]);

const CHART_COLORS = Object.freeze({
    blue: 'rgb(54, 162, 235)',
    dark_blue: 'rgb(4 110 188)',
    green: 'rgb(75, 192, 192)',
    red: 'rgb(255, 99, 132)',
    magenta: 'rgb(218,112,214)',
    orange: 'rgb(255, 159, 64)',
    purple: 'rgb(153, 102, 255)',
    cyan: 'rgb(0,206,209)',
    grey: 'rgb(201, 203, 207)',
    yellow: 'rgb(255, 205, 86)',
    maroon: 'rgb(128,0,0)',
    olive: 'rgb(85,107,47)',
    teal: 'rgb(0,128,128)',
    navy: 'rgb(65,105,225)',
    silver: 'rgb(192,192,192)',
    salmon: 'rgb(250,128,114)',
    steel: 'rgb(70,130,180)',
    violet: 'rgb(238,130,238)',
    pink: 'rgb(255,192,203)',
    chocolate: 'rgb(210,105,30)',
    light_grey: 'rgb(220,220,220)',
    dark_grey: 'rgb(102 102 102)',
    silver_blue: 'rgb(236 240 242)'
});

const NOTIFICATION_TEXT = Object.freeze({
    avaliacao_plano: 'Prezado(a) {apelido},\n\nO plano de trabalho [b]#{id_plano}[/b], com vigência de {data_inicio_vigencia} à {data_fim_vigencia} foi avaliado pela chefia imediata\n\nNota Atribuída: {nota_atribuida}.\n\n{tabela_entregas}\n\nJustificativas: {justificativas}.\n\nComentários: {comentarios}.\n\nNome do Avaliador: {nome_avaliador}.\n\nData da Avaliação: {data_avaliacao}.\n\n{texto_recurso}\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exercício ({contato_unidade})',
    avaliacao_plano_nao_aceito: '- - - - ⚠️ Aviso - - - -\n\nNos termos do {fundamento_analise_recurso}, o participante do PGD que tiver plano de trabalho avaliado como “inadequado” ou como “não executado”, poderá recorrer da avaliação, prestando justificativas no prazo de [b]{prazo_apresentacao_recurso} dias {contagem_dias_recurso} a contar desta notificação de avaliação[/b]\n\n[red]Fique atento! O prazo máximo para recorrer encerra-se dia {data_fim_recurso}.[/red]\n\nAcesse as configurações do sistema (⚙️ > Planos de Trabalho) e apresente as justificativas para recorrer da avaliação da nota.',
    recurso_apresentacao: 'Prezado(a) {apelido}},\n\nApresentado recurso sobre a avaliação do plano de trabalho [b]#{id_plano}[/b], com vigência de {data_inicio_vigencia} à {data_fim_vigencia}.\n\nNota Atribuída: {nota_atribuida}.\n\nComentários: {comentarios}\n\nNome do Avaliador: {nome_avaliador}.\n\nData da Avaliação: {data_avaliacao}.\n\n- - - -  🔽 Abaixo, conteúdo do RECURSO - - - -\n\nNome do Avaliado: {nome_avaliado}\n\nData da Apresentação de Recurso: {data_apresentacao_recurso}.\n\n[b]Justificativas para reconsideração da nota:[/b] {justificativa_avaliado}\n\n- - - - ⚠️ Aviso - - - -\n\nNos termos do {fundamento_analise_recurso}, a chefia imediata deverá analisar o recurso apresentado pelo participante no prazo de [b]{prazo_analise_recurso} dias {contagem_dias_recurso} a contar desta notificação.[/b]\n\n[red]Após o prazo mencionado, o cadastramento de novos planos e demandas poderá ser restringido para toda a unidade.[/red]\n\nAcesse as configurações do sistema (⚙️ > Planos de Trabalho) e avalie as justificativas apresentadas.[\\b]\n\n[red]Ressalta-se que caso a justificativa apresentada seja acatada, a avaliação inicial deverá ser ajustada. Entretanto, se não acatada, o chefe da unidade de execução deverá apresentar os motivos da negativa e dar ciência à unidade de gestão de pessoas.[/red]',
    recurso_analise: 'Prezado(a) {apelido},\n\nRegistrada análise do recurso sobre a avaliação do plano de trabalho [b]#{id_plano}[/b], com vigência de {data_inicio_vigencia} à {data_fim_vigencia}.\n\nNota Atribuída: {nota_atribuida}\n\nComentários: {comentarios}\n\nNome do Avaliador: {nome_avaliador}.\n\n- - - -  🔽 Abaixo, conteúdo do RECURSO - - - -\n\nNome do Avaliado: {nome_avaliado}\n\nData da Apresentação de Recurso: {data_apresentacao_recurso}.\n\n[b]Justificativas para reconsideração da nota:[/b] {justificativa_avaliado}\n\n- - - -  🔽 Abaixo, resultado da ANÁLISE DO RECURSO - - - -\n\nNome do Avaliador: {nome_avaliador_recurso}\n\nData da Análise: {data_analise_recurso}\n\n{resultado_analise}\n\n- - - - ⚠️ Aviso - - - -\n\n[red]Nos termos do {fundamento_analise_recurso}, o chefe da unidade de execução deverá cientificar a unidade de gestão de pessoas para providências.[/red]\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exercício ({contato_unidade})',
    cancelamento_avaliacao_plano: 'Prezado(a) {apelido},\n\nA avaliação do plano de trabalho [b]#{id_plano}[/b], com vigência de {data_inicio_vigencia} à {data_fim_vigencia}. foi [b]cancelada[/b] pela chefia imediata.\n\nNome do Cancelador: {nome_cancelador}.\n\nData do Cancelamento: {data_cancelamento}.\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exercício ({contato_unidade})',
    omissao_demanda: 'Prezado(a) {apelido},\n\nA demanda [b]#{id_demanda}[/b] atribuída à você foi encerrada por omissão de entregas pactuadas.\n\nAssunto: {assunto}.\n\nAtividade: {nome_atividade}.\n\nData de distribuição: {data_distribuicao}.\n\nPrazo de entrega: {prazo_entrega}.\n\nTempo pactuado: {tempo_pactuado}.\n\nComentários: {comentarios}.\n\nPara maiores esclarecimentos, entre em contato com sua unidade de exercício ({contato_unidade})'
});

function call(page, name, fallback, ...args) {
    return typeof page[name] === 'function' ? page[name](...args) : fallback;
}

function hasOption(page, key, getOption) {
    if (typeof getOption === 'function') return !!getOption(key);
    return !!call(page, 'getOptionsPro', false, key);
}

function restoreHybrid(page, key, getOption) {
    if (hasOption(page, 'panelLocalStorePro', getOption)) return null;
    return call(page, 'hybridStorageRestorePro', null, key);
}

function restoreLocal(page, key) {
    return call(page, 'localStorageRestorePro', null, key);
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function calculateLastUpdate(page, timeRestoreAtividades, getOption) {
    if (!hasOption(page, 'panelLocalStorePro', getOption)) {
        const lastUpdate = restoreLocal(page, 'lastUpdateAtividades');
        if (lastUpdate !== null && lastUpdate !== undefined) {
            const previous = restoreLocal(page, 'lastRestoreAtividades');
            const moment = page.moment;
            if (previous !== null && typeof moment === 'function') {
                try {
                    const expires = moment(previous, 'YYYY-MM-DD HH:mm:ss')
                        .add(timeRestoreAtividades.value, timeRestoreAtividades.time);
                    if (expires < moment()) return false;
                } catch (e) {
                    // Keep the persisted value when the optional date adapter fails.
                }
            }
            return lastUpdate;
        }
    }
    return false;
}

/** Build the initial state patch consumed by the canonical Atividades store. */
export function createAtividadesRuntimeState(context) {
    if (!context || !context.page) throw new TypeError('Runtime state requires Atividades context');
    const page = context.page;
    const options = context.options || {};
    const getOption = typeof options.get === 'function' ? options.get : (key) => call(page, 'getOptionsPro', undefined, key);
    const configDefault = restoreHybrid(page, 'configDataAtividadesPadraoPro', getOption);
    const configUnit = restoreHybrid(page, 'configDataAtivUnidadePro', getOption);
    const atividades = restoreHybrid(page, 'configDataAtividadesPro', getOption);
    const atividadesProcesso = restoreHybrid(page, 'configDataAtividadesProcPro', getOption);
    const prescricoesProcesso = restoreHybrid(page, 'configDataPrescricoesProcPro', getOption);
    const arrayAtividadesPro = asArray(atividades);
    const arrayAtividadesProcPro = asArray(atividadesProcesso);
    const timeRestoreAtividades = getOption('cache_demandas_value') && getOption('cache_demandas_time')
        ? { time: getOption('cache_demandas_time'), value: getOption('cache_demandas_value') }
        : { time: 'day', value: 1 };
    const jquery = context.dom && context.dom.$;
    const inProcessFrame = !!(jquery && typeof jquery === 'function' && jquery('#ifrArvore').length > 0);
    const arrayProcessosUnidade = call(page, 'getProcessoUnidadePro', false);
    const perfilAtividadesSelected = getOption('panelAtividadesViewSyncUnidade')
        ? page.siglaUnidadeAtual
        : (getOption('perfilAtividadesSelected') || '');

    return {
        loadAtividadesPro: true,
        debugScreen: false,
        perfilLoginAtiv: false,
        urlServerAtiv: false,
        backendServerAtiv: false,
        userHashAtiv: false,
        delayServerAtiv: 0,
        arrayConfigAtividades: typeof page.restoreLocalDataConfigArray === 'function' && configDefault !== null
            ? (page.restoreLocalDataConfigArray() || [])
            : asArray(configDefault),
        arrayConfigAtivUnidade: asArray(configUnit),
        ganttAtividades: false,
        ganttAfastamentos: false,
        ganttRecorrencias: false,
        kanbanAtividades: false,
        kanbanAtividadesMoving: false,
        tableConfigEditor: {},
        tableConfigList: {},
        arrayAtividadesPro,
        arrayAtividadesProcPro,
        arrayPrescricoesProcPro: asArray(prescricoesProcesso),
        checkLoadAtividadesProcPro: false,
        checkLoadMonitoradosProcPro: false,
        arrayAtividades: inProcessFrame ? arrayAtividadesProcPro : arrayAtividadesPro,
        perfilAtividadesSelected,
        arrayProcessosUnidade,
        arrayNomenclaturas: [],
        timeRestoreAtividades,
        lastUpdateAtividades: calculateLastUpdate(page, timeRestoreAtividades, getOption),
        dly: undefined,
        loadRowsPanelAtiv: false,
        indexReportUpdate: 0,
        listReportsUpdate: [...REPORT_KEYS],
        nameReportsUpdate: [...REPORT_NAMES],
        indexAPIUpdate: 0,
        stopUpdateApi: false,
        listAPIUpdate: [...API_KEYS],
        nameAPIUpdate: [...API_NAMES],
        notificacaoTexto: { ...NOTIFICATION_TEXT },
        listLabelsTiposMetadados: METADATA_TYPE_LABELS.map((item) => ({ ...item })),
        chartColors: { ...CHART_COLORS }
    };
}

export const ATIVIDADES_RUNTIME_CONSTANTS = Object.freeze({
    reportKeys: REPORT_KEYS,
    reportNames: REPORT_NAMES,
    apiKeys: API_KEYS,
    apiNames: API_NAMES,
    metadataTypeLabels: METADATA_TYPE_LABELS,
    chartColors: CHART_COLORS,
    notificationText: NOTIFICATION_TEXT
});
