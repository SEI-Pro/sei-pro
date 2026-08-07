// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';

/**
 * Orquestra a gravação do recebimento na borda legada.
 *
 * A implementação de seleção e persistência permanece em core/datas; este
 * módulo concentra apenas a leitura do contexto legado e a composição das
 * dependências de storage. Assim a fachada global pode continuar aceitando a
 * assinatura histórica sem carregar essa orquestração no monólito.
 */
export function recordDataRecebimento(listAndamento, context = {}) {
    const datas = getSeiPro().core && getSeiPro().core.datas;
    if (!datas || typeof datas.buildDataRecebimentoRecord !== 'function'
        || typeof datas.persistDataRecebimentoRecord !== 'function') return false;

    const {
        unidadeAtual = '',
        datetime = '',
        observacoes = '',
        acompanhamentoesp = '',
        restore,
        store,
        isEmptyObject
    } = context;
    const record = datas.buildDataRecebimentoRecord(listAndamento, unidadeAtual, {
        datetime, observacoes, acompanhamentoesp
    });
    if (!record) return false;

    datas.persistDataRecebimentoRecord(record, { restore, store, isEmptyObject });
    return true;
}

export function installDatasView() {
    const seiPro = getSeiPro();
    seiPro.shared = seiPro.shared || {};
    seiPro.shared.datasView = { recordDataRecebimento };
    return seiPro.shared.datasView;
}