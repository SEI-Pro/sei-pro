// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getConfig as readTypedConfig } from '../config/read.js';
import { aliasGlobal, getSeiPro, globalRef } from './global.js';
import { isDefaultEnabledConfigOption } from '../shared/config-defaults.js';

export function installConfig() {
    function readConfigBasePro() {
        const raw = globalRef.localStorage.getItem('configBasePro');
        if (typeof raw === 'undefined' || raw === null || raw === '') {
            return [];
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    // Extrai o array configGeral do primeiro elemento que o contém — substitui a
    // query jmespath '[*].configGeral | [0]' por JS puro. A lib jmespath NÃO é
    // carregada em todos os contextos de content script (ex.: o bloco da tela de
    // login carrega só login.bundle.js); depender dela aqui fazia toda leitura de
    // config retornar `false` no login, desligando features como autopreenchersenha.
    function pickConfigGeral(configBasePro) {
        if (!Array.isArray(configBasePro)) return null;
        for (let i = 0; i < configBasePro.length; i++) {
            const el = configBasePro[i];
            if (el && Array.isArray(el.configGeral)) return el.configGeral;
        }
        return null;
    }

    function queryConfigValue(name) {
        const configGeral = pickConfigGeral(readConfigBasePro());
        if (!Array.isArray(configGeral)) {
            return false;
        }
        for (let i = 0; i < configGeral.length; i++) {
            if (configGeral[i] && configGeral[i].name === name) {
                return configGeral[i].value !== null && typeof configGeral[i].value !== 'undefined'
                    ? configGeral[i].value
                    : false;
            }
        }
        return false;
    }

    function verifyConfigValue(name) {
        return queryConfigValue(name) === true;
    }

    function getConfigValue(name) {
        return queryConfigValue(name);
    }

    // Features that default ON when the config entry is absent.
    // Shared with the options page via src/shared/config-defaults.js.
    function isDefaultEnabledConfigValue(name) {
        return isDefaultEnabledConfigOption(name);
    }

    // Semântica "default-enabled" (porte VERBATIM do legado — Fase 6):
    // diferente de verifyConfigValue, retorna `true` quando a config está ausente
    // (recurso ligado por padrão) e só `false` quando explicitamente desligada.
    // Depende da query jmespath retornar `null` p/ ausente (≠ `false` de queryConfigValue),
    // por isso NÃO reusa queryConfigValue. Igualdade frouxa (`== false`) preservada.
    function checkConfigValue(name) {
        var configBasePro = readConfigBasePro();
        const configGeral = pickConfigGeral(configBasePro);
        // `null` p/ ausente espelha a query jmespath original ('[?name==X].value | [0]'),
        // que retorna null quando não há entrada — distinto de `false` (desligado explícito).
        var dataValuesConfig = null;
        if (Array.isArray(configGeral)) {
            for (let i = 0; i < configGeral.length; i++) {
                if (configGeral[i] && configGeral[i].name === name) {
                    dataValuesConfig = (configGeral[i].value !== null && typeof configGeral[i].value !== 'undefined')
                        ? configGeral[i].value
                        : null;
                    break;
                }
            }
        }
        if ((dataValuesConfig === false || dataValuesConfig === null) && isDefaultEnabledConfigValue(name)) {
            return true;
        }
        if (dataValuesConfig == false && typeof configBasePro !== 'undefined' && configBasePro !== null && configBasePro.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    // New typed reader (ADR-0009). Does not replace verify/check/getConfigValue.
    function getConfig(name) {
        return readTypedConfig(name, { readConfigBasePro });
    }

    const config = {
        readConfigBasePro,
        queryConfigValue,
        verifyConfigValue,
        getConfigValue,
        getConfig,
        isDefaultEnabledConfigValue,
        checkConfigValue
    };

    getSeiPro().core.config = config;

    aliasGlobal('verifyConfigValue', verifyConfigValue);
    aliasGlobal('getConfigValue', getConfigValue);
    aliasGlobal('getConfig', getConfig);
    aliasGlobal('isDefaultEnabledConfigValue', isDefaultEnabledConfigValue);
    aliasGlobal('checkConfigValue', checkConfigValue);

    return config;
}
