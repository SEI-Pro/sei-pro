/**
 * Atividades · configuração (strangler / ADR-0007 fase 5.3).
 *
 * Reexporta pontos de entrada do painel/opções ainda hospedados em `atividades/`.
 * Não remove nem altera o install de `atividades` — fatia só cria a fronteira.
 *
 * Consumidores novos preferem este módulo; o descritor (`feature.ts`) não importa
 * estes reexports para não puxar o monólito no scan/registry.
 */
export {
    openModalConfigPanel,
    getTabsConfigPanel,
    getTabConfig,
    addConfigItem,
    updateConfigServer
} from '../atividades/config-panel.js';

export {
    editConfigOptions,
    changeConfigOptions,
    checkDatesLoopArray,
    checkDatesBetweenArray,
    configPessoal,
    saveConfigPersonalUser,
    saveOptionConfigItem
} from '../atividades/config-options.js';

export {
    checkDatesLoopArray as checkDatesLoopArrayDomain,
    checkDatesBetweenArray as checkDatesBetweenArrayDomain
} from '../atividades/config-domain.js';

export {
    selectEntityConfig,
    selectEntityOption,
    hasEntityOption,
    selectUnitConfig,
    selectConfigItem
} from '../atividades/config-queries.js';

export { createConfigUseCases } from '../atividades/config-use-cases.js';

export function installAtividadesConfigFeature() {
    // no-op until composition root wires this feature independently
}
