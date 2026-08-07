// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, globalRef } from '../../core/global.js';
import { recordDataRecebimento } from './datas-view.js';

/**
 * Ponte de compatibilidade para o entry legado de datas.
 *
 * TODO: remover quando os call-sites legados de getDataRecebimentoPro forem
 * migrados para uma entry/contexto específica. O wrapper mantém a assinatura
 * histórica e compõe o contexto a partir dos globals publicados pelo script
 * legado, enquanto a seleção/persistência permanece nos adapters testáveis.
 */
export function getDataRecebimentoProLegacy(listAndamento, listProc = false, acompanhamentoEsp = '') {
    const processo = globalRef.dadosProcessoPro;
    const observacoes = processo && processo.propProcesso
        && processo.propProcesso.txaObservacoes !== undefined
        ? processo.propProcesso.txaObservacoes
        : '';
    const moment = globalRef.moment;
    const datetime = typeof moment === 'function'
        ? moment().format('YYYY-MM-DD HH:mm:ss')
        : '';
    const $ = globalRef.$;

    return recordDataRecebimento(listAndamento, {
        unidadeAtual: globalRef.siglaUnidadeAtual || '',
        datetime,
        observacoes,
        acompanhamentoesp: acompanhamentoEsp,
        restore: globalRef.localStorageRestorePro,
        store: globalRef.localStorageStorePro,
        isEmptyObject: $ && $.isEmptyObject
    });
}

export function installDatasLegacyApi() {
    aliasGlobal('getDataRecebimentoPro', getDataRecebimentoProLegacy);
    return getDataRecebimentoProLegacy;
}
