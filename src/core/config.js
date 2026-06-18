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

    const config = {
        readConfigBasePro,
        queryConfigValue,
        verifyConfigValue,
        getConfigValue
    };

    getSeiPro().core.config = config;

    aliasGlobal('verifyConfigValue', verifyConfigValue);
    aliasGlobal('getConfigValue', getConfigValue);

    return config;
}
