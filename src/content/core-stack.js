/**
 * Entry legada transitória — mantém dist/js/core-stack.bundle.js enquanto os
 * contextos de página ainda não foram migrados para src/entries/*. Quando todos
 * os blocos do manifest apontarem para entries, este arquivo é removido.
 *
 * A composição vive em src/core/stack.js (reusada pelas entries).
 */
import { installCoreStack } from '../core/stack.js';
import { installDatasLegacyApi } from '../shared/legacy/datas-legacy-api.js';
import { installMonitoradoStoreLegacyApi } from '../features/monitorados/store-legacy-api.js';

installCoreStack();
installDatasLegacyApi();
// Ponte transitória do bloco legado amplo: aliases globais de Processos
// Monitorados ainda precisam existir antes de sei-functions-pro/init*. Mantém a
// dependência de feature fora de src/core/stack.js até haver entries por contexto.
installMonitoradoStoreLegacyApi();
