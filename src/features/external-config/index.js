/**
 * Feature de configuração externa (contexto `db`). Origem: dist/js/init_db.js.
 *
 * Recebe configurações vindas de páginas externas via parâmetros de URL
 * (acao_pro=set_database / set_option / change_database) e as persiste em
 * chrome.storage.sync (bases de Atividades, Projetos, provedores de IA e opções).
 *
 * Porte isolated-first, SEM jQuery. Mudanças vs. legado:
 *  - storage via fachada SeiPro.core.storage (delega ao service worker) em vez de
 *    chrome.storage.sync direto.
 *  - removido o ramo `short_name == 'SPro'` (transição da extensão antiga) e
 *    getConfigHost/appendIconEntidadeLogin (código morto neste fork).
 */
import { getSeiPro } from '../../core/global.js';
import { publishFeature } from '../../app/publish-feature.js';
import { getParamsUrlPro } from '../../core/util.js';
import { qs } from '../../dom/index.js';
import { redactLegacyAiCredentials } from '../ai/io/profiles.js';

function sei() { return getSeiPro(); }
function storage() { return sei().core.storage; }
function getManifest() { return sei().core.runtime.getManifestExtension(); }

// Lê dataValues (array) de sync, tolerando ausente/vazio.
function readDataValues() {
    return storage().getSync({ dataValues: '' }).then(function (items) {
        return items && items.dataValues ? JSON.parse(items.dataValues) : [];
    });
}
function writeDataValues(dataValues) {
    // API credentials belong exclusively to chrome.storage.local through the
    // current AI-profile flow. Never reintroduce them in the legacy sync blob.
    const safe = redactLegacyAiCredentials(dataValues).dataValues;
    return storage().setSync({ dataValues: JSON.stringify(safe) }).then(function () {
        localStorage.setItem('configBasePro', JSON.stringify(safe));
    });
}

export function setOptionsSEIPro(optionKey, optionValue) {
    return readDataValues().then(function (dataValues) {
        dataValues.forEach(function (entry) {
            if (typeof entry.configGeral === 'undefined') return;
            var changed = false;
            entry.configGeral.forEach(function (cfg) {
                if (cfg.name === optionKey) {
                    var v = optionValue;
                    if (v === 'true') v = true;
                    if (v === 'false') v = false;
                    cfg.value = v;
                    changed = true;
                }
            });
            if (!changed) entry.configGeral.push({ name: optionKey, value: optionValue });
        });
        if (dataValues.length > 0) return writeDataValues(dataValues);
    });
}

function redirectHome(newItem) {
    var menu = qs(sei().sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu');
    var a = menu && menu.querySelector('a[href*="controlador.php?acao=procedimento_controlar"]');
    var urlHome = a && a.getAttribute('href');
    if (urlHome) {
        setTimeout(function () { window.location.href = urlHome; }, 1500);
    }
}

export function getOptionsSEIPro(data) {
    if (!data.type || data.type !== 'NEW_BASE') return Promise.resolve();
    var newItem = data.newItem;
    return readDataValues().then(function (dataValues) {
        if (data.mode === 'insert' || data.mode === 'remove') {
            dataValues = dataValues.filter(function (entry) { return entry.baseTipo !== data.base; });
        }
        if (data.mode !== 'remove') dataValues.push(newItem);
        return writeDataValues(dataValues).then(function () {
            if (data.alert) {
                alert(data.mode === 'insert'
                    ? 'Configurações carregadas com sucesso!'
                    : 'Configurações removidas com sucesso!\n\n Recarregue a página.');
            }
            if (data.mode !== 'remove') redirectHome(newItem);
        });
    });
}

// Monta o payload NEW_BASE para cada tipo de base recebido por URL.
export function baseItem(base, param, manifest) {
    const common = {
        CLIENT_ID: '',
        API_KEY: '',
        spreadsheetId: '',
        URL_API: param.url || '',
        KEY_USER: param.token || '',
        model: param.model || ''
    };
    switch (base) {
        case 'atividades':
            return { baseName: manifest.short_name, baseTipo: 'atividades',
                conexaoTipo: param.token === '' ? 'googleapi' : 'api',
                ...common, CLIENT_ID: param.token === '' ? param.client_id : '' };
        case 'openai':
            return { baseName: 'Open AI (Chat GPT)', baseTipo: 'openai', conexaoTipo: 'api', ...common };
        case 'gemini':
            return { baseName: 'Gemini (Google)', baseTipo: 'gemini', conexaoTipo: 'api', ...common };
        case 'anthropic':
            return { baseName: 'Anthropic (Claude)', baseTipo: 'anthropic', conexaoTipo: 'api', ...common };
        case 'moonshot':
            return { baseName: 'Moonshot (Kimi)', baseTipo: 'moonshot', conexaoTipo: 'api', ...common };
        case 'ollama':
            return { baseName: 'Ollama', baseTipo: 'ollama', conexaoTipo: 'api', ...common };
        case 'openai_compatible':
            return { baseName: param.base_name || 'OpenAI-compatible', baseTipo: 'openai_compatible', conexaoTipo: 'api', ...common };
        case 'projetos':
            return { baseName: param.base_name, baseTipo: 'projetos', conexaoTipo: 'sheets',
                CLIENT_ID: param.client_id, API_KEY: param.api_key, spreadsheetId: param.sheet_id,
                URL_API: '', KEY_USER: '' };
        default:
            return null;
    }
}

function observeAcaoPro() {
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro === 'undefined') return;
    var manifest = getManifest();

    if (param.acao_pro === 'set_database') {
        var base = param.base;
        var hasToken = typeof param.token !== 'undefined' && typeof param.url !== 'undefined';
        var hasClientId = typeof param.client_id !== 'undefined';
        if (!hasToken && !(hasClientId && base === 'projetos')) return;
        var item = baseItem(base, param, manifest);
        if (!item) return;
        var alertFlag = base === 'atividades' ? (param.token !== '') : true;
        return getOptionsSEIPro({ type: 'NEW_BASE', mode: param.mode, base: base, alert: alertFlag, newItem: item });
    }

    if (param.acao_pro === 'set_option' && typeof param.option_key !== 'undefined' && typeof param.option_value !== 'undefined') {
        return setOptionsSEIPro(param.option_key, param.option_value);
    }
}

function changeBasePro() {
    var param = getParamsUrlPro(window.location.href);
    if (param.acao_pro !== 'change_database' || typeof param.url === 'undefined' || param.base !== 'atividades') return;
    var perfil = JSON.parse(localStorage.getItem('configBasePro_atividades') || '{}');
    return getOptionsSEIPro({
        type: 'NEW_BASE', mode: 'insert', base: 'atividades', alert: false,
        newItem: { baseName: 'Atividades', baseTipo: 'atividades', conexaoTipo: 'api',
            CLIENT_ID: '', API_KEY: '', spreadsheetId: '', URL_API: param.url, KEY_USER: perfil.KEY_USER }
    });
}

export function installExternalConfig() {
    observeAcaoPro();
    changeBasePro();
    sei().core.bootstrap.getPathExtensionPro();
}

publishFeature({
    id: 'external-config',
    nsKey: 'externalConfig',
    api: Object.freeze({
        setOptionsSEIPro,
        getOptionsSEIPro
    }),
    install: installExternalConfig
});
