import { aliasGlobal, getSeiPro, globalRef } from './global.js';

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

    function queryConfigValue(name) {
        const configBasePro = readConfigBasePro();
        if (typeof globalRef.jmespath === 'undefined' || globalRef.jmespath === null) {
            return false;
        }
        const configGeral = globalRef.jmespath.search(configBasePro, '[*].configGeral | [0]');
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

    // Features que vêm habilitadas por padrão quando a config está AUSENTE.
    function isDefaultEnabledConfigValue(name) {
        return ['filtrarpaginapelapesquisarapida'].indexOf(String(name || '')) !== -1;
    }

    // Semântica "default-enabled" (porte VERBATIM do legado — Fase 6):
    // diferente de verifyConfigValue, retorna `true` quando a config está ausente
    // (recurso ligado por padrão) e só `false` quando explicitamente desligada.
    // Depende da query jmespath retornar `null` p/ ausente (≠ `false` de queryConfigValue),
    // por isso NÃO reusa queryConfigValue. Igualdade frouxa (`== false`) preservada.
    function checkConfigValue(name) {
        const jmespath = globalRef.jmespath;
        const rawConfig = globalRef.localStorage.getItem('configBasePro');
        var configBasePro = (typeof rawConfig !== 'undefined' && rawConfig != '' && rawConfig !== null) ? JSON.parse(rawConfig) : [];
        var dataValuesConfig = (typeof jmespath !== 'undefined' && jmespath !== null) ? jmespath.search(configBasePro, '[*].configGeral | [0]') : false;
        dataValuesConfig = (typeof jmespath !== 'undefined' && jmespath !== null) ? jmespath.search(dataValuesConfig, "[?name=='" + name + "'].value | [0]") : false;
        if ((dataValuesConfig === false || dataValuesConfig === null) && isDefaultEnabledConfigValue(name)) {
            return true;
        }
        if (dataValuesConfig == false && typeof configBasePro !== 'undefined' && configBasePro !== null && configBasePro.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    const config = {
        readConfigBasePro,
        queryConfigValue,
        verifyConfigValue,
        getConfigValue,
        isDefaultEnabledConfigValue,
        checkConfigValue
    };

    getSeiPro().core.config = config;

    aliasGlobal('verifyConfigValue', verifyConfigValue);
    aliasGlobal('getConfigValue', getConfigValue);
    aliasGlobal('isDefaultEnabledConfigValue', isDefaultEnabledConfigValue);
    aliasGlobal('checkConfigValue', checkConfigValue);

    return config;
}
