// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Entry legada transitória — mantém dist/js/core-stack.bundle.js enquanto os
 * contextos de página ainda não foram migrados para src/entries/* (fase 4.9).
 *
 * Progresso (fase 4): login e db já têm raiz em src/entries/ com ports
 * injetados em boot(); lista expõe createListaDeps. Este bundle permanece
 * porque blocos legados do manifest (até 40 scripts) ainda o carregam antes de
 * sei-functions / init*. Dissolver só quando o último bloco gordo migrar —
 * remover agora quebra contextos não migrados.
 *
 * A composição vive em src/core/stack.ts (reusada pelas entries).
 * Helpers de feature em shared/ + ponte monitorados ficam aqui (fora de core/).
 */
import { installCoreStack } from '../core/stack.js';
import { installSharedLegacyHelpers } from '../shared/install-legacy-helpers.js';
import { installDatasView } from '../shared/legacy/datas-view.js';
import { installDatasLegacyApi } from '../shared/legacy/datas-legacy-api.js';
import { installMonitoradoStoreLegacyApi } from '../features/monitorados/store-legacy-api.js';

installCoreStack();
installSharedLegacyHelpers();
installDatasView();
installDatasLegacyApi();
// Ponte transitória do bloco legado amplo: aliases globais de Processos
// Monitorados ainda precisam existir antes de sei-functions-pro/init*. Mantém a
// dependência de feature fora de src/core/stack.js até haver entries por contexto.
installMonitoradoStoreLegacyApi();
