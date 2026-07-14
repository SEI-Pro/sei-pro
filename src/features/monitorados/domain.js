import { globalRef } from '../../core/global.js';

/**
 * Processos Monitorados — núcleo PURO (sem DOM, sem jQuery, sem efeito).
 * Extraído de sei-pro-monitorados.js. `moment` é lido lazy via globalRef
 * (mesmo padrão de core/datas.js). Coberto por tests/features/monitorados.
 */

// Config padrão da contagem de prazo de um monitorado.
export function defaultConfigDate() {
    const moment = globalRef.moment;
    return {
        date: moment().format('YYYY-MM-DD'),
        listdocs: false,
        dateDue: moment().add(5, 'd').format('YYYY-MM-DD'),
        countdown: true,
        countdays: false,
        workday: false,
        setdate: true,
        duenumber: 5,
        duecounter: 'corrido',
        duemode: 'depois',
        duesetdate: false,
        duedate: false,
        newdoc: true,
        selectdoc: false,
        advanced: false,
        displayformat: false,
        displayicon: false,
        displaydue: false,
        displaydue_txt: 'Vencimento:',
        displaytip: '',
        deliverydoc: false,
        deliverydoc_style: '',
        newdoclist: []
    };
}

// Forma vazia do store (fonte da verdade em memória/localStorage).
export function defaultMonitoradoStore() {
    return { monitorados: [], config: { colortags: [] } };
}

// Índice de um processo no store (-1 se ausente). Comparação por string (ids podem vir number|string).
export function findMonitoradoIndex(store, id_procedimento) {
    if (!store || !store.monitorados) return -1;
    return store.monitorados.findIndex(function (obj) {
        return String(obj.id_procedimento) === String(id_procedimento);
    });
}

// Constrói o registro persistido ao adicionar um processo, sem ler DOM/globais.
export function buildMonitoradoItem(id_procedimento, dados = {}) {
    const andamento = dados.listAndamento || {};
    const prop = dados.propProcesso || {};
    return {
        id_procedimento: andamento.id_procedimento ?? id_procedimento,
        processo: andamento.processo,
        andamento: andamento.andamento || [],
        documentos: dados.listDocumentosAssinados || [],
        tipo_procedimento: prop.hdnNomeTipoProcedimento || '',
        assuntos: prop.selAssuntos_select || [],
        interessados: prop.selInteressadosProcedimento || [],
        descricao: prop.txtDescricao || '',
        order: -1,
        categoria: ''
    };
}

// Transições puras do toggle: removem duplicata antes de adicionar e não mutam a entrada.
export function addMonitoradoToStore(store, id_procedimento, dados = {}) {
    const next = { ...store, monitorados: (store.monitorados || []).filter(
        (item) => String(item.id_procedimento) !== String(id_procedimento)
    ) };
    next.monitorados.push(buildMonitoradoItem(id_procedimento, dados));
    return next;
}

export function removeMonitoradoFromStore(store, id_procedimento) {
    return {
        ...store,
        monitorados: (store.monitorados || []).filter(
            (item) => String(item.id_procedimento) !== String(id_procedimento)
        )
    };
}

// `dados` da sessão do processo está completo o bastante para uso? (predicado puro)
export function monitoradoProcessDataReady(id_procedimento, dados) {
    return (
        typeof dados !== 'undefined' &&
        dados &&
        Object.keys(dados).length > 0 &&
        dados.constructor === Object &&
        typeof dados.listAndamento !== 'undefined' &&
        dados.listAndamento !== null &&
        dados.hasOwnProperty('listAndamento') &&
        typeof dados.listAndamento.id_procedimento !== 'undefined' &&
        dados.listAndamento.id_procedimento !== null &&
        dados.listAndamento.hasOwnProperty('id_procedimento') &&
        String(dados.listAndamento.id_procedimento) == String(id_procedimento) &&
        typeof dados.propProcesso !== 'undefined' &&
        dados.propProcesso !== null
    );
}

// Idem, exigindo também a lista de documentos assinados. ($.isArray -> Array.isArray, equivalente.)
export function monitoradoProcessPayloadReady(id_procedimento, dados) {
    return (
        monitoradoProcessDataReady(id_procedimento, dados) &&
        typeof dados.listDocumentosAssinados !== 'undefined' &&
        Array.isArray(dados.listDocumentosAssinados)
    );
}
