import { aliasGlobal } from '../../core/global.js';
import {
    defaultConfigDate,
    defaultMonitoradoStore,
    findMonitoradoIndex,
    monitoradoProcessDataReady,
    monitoradoProcessPayloadReady
} from './domain.js';
import {
    flushMonitoradoRemote,
    getConfigDatetimeMonitorado,
    getOptionsConfigDate,
    getStoreMonitoradoPro,
    installMonitoradoStore,
    persistMonitoradoStore,
    saveConfigMonitorado,
    scheduleMonitoradoRemote
} from './store.js';

/**
 * Processos Monitorados — ponte de compatibilidade do store.
 *
 * Este arquivo é carregado por src/content/core-stack.js porque os aliases de
 * store precisam existir antes dos scripts legados em todos os blocos do
 * manifest. Mantém aliasGlobal fora da camada de IO (store.js) e limita a
 * exceção transitória a um arquivo *legacy-api* dedicado.
 *
 * TODO: remover quando os call-sites legados de getStoreMonitoradoPro e afins
 * forem migrados para uma entry/contexto específico.
 */
export function installMonitoradoStoreLegacyApi() {
    const monitorados = installMonitoradoStore();

    aliasGlobal('getStoreMonitoradoPro', getStoreMonitoradoPro);
    aliasGlobal('getOptionsConfigDate', getOptionsConfigDate);
    aliasGlobal('persistMonitoradoStore', persistMonitoradoStore);
    aliasGlobal('scheduleMonitoradoRemote', scheduleMonitoradoRemote);
    aliasGlobal('flushMonitoradoRemote', flushMonitoradoRemote);
    aliasGlobal('getConfigDatetimeMonitorado', getConfigDatetimeMonitorado);
    aliasGlobal('saveConfigMonitorado', saveConfigMonitorado);
    aliasGlobal('defaultConfigDate', defaultConfigDate);
    aliasGlobal('defaultMonitoradoStore', defaultMonitoradoStore);
    aliasGlobal('findMonitoradoIndex', findMonitoradoIndex);
    aliasGlobal('monitoradoProcessDataReady', monitoradoProcessDataReady);
    aliasGlobal('monitoradoProcessPayloadReady', monitoradoProcessPayloadReady);

    return monitorados;
}
