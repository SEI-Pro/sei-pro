import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = 'dist/js/core-stack.bundle.js';

// Phase 5: the whole core+sei stack ships as one bundled IIFE built from src/.
// Running it installs everything (installCoreStack) onto sandbox.SeiPro. Mocks
// (jQuery, jmespath, getOptionsPro…) are read lazily by the installed helpers,
// so they can sit on the sandbox before the bundle runs and be picked up when
// the helpers are actually called.
function runBundle(sandbox) {
    const filePath = path.join(repoRoot, BUNDLE);
    vm.runInNewContext(readFileSync(filePath, 'utf8'), sandbox, { filename: filePath });
}

function createSandbox(extra = {}) {
    const sandbox = {
        console,
        Map,
        JSON,
        decodeURIComponent,
        encodeURIComponent,
        ...extra
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    return sandbox;
}

export function loadCore() {
    const sandbox = createSandbox();
    runBundle(sandbox);
    return sandbox.SeiPro;
}

export function loadConfigWithEmptyStorage() {
    const sandbox = createSandbox({
        localStorage: {
            getItem() { return null; }
        },
        jmespath: {
            search() { return null; }
        }
    });
    runBundle(sandbox);
    return sandbox.SeiPro.core.config;
}

export function loadConfigWithData(configBasePro, jmespathImpl) {
    const sandbox = createSandbox({
        localStorage: {
            getItem(key) {
                if (key === 'configBasePro') {
                    return JSON.stringify(configBasePro);
                }
                return null;
            }
        },
        jmespath: jmespathImpl || {
            search(data, expression) {
                if (expression === '[*].configGeral | [0]') {
                    return data[0] && data[0].configGeral ? data[0].configGeral : null;
                }
                return null;
            }
        }
    });
    runBundle(sandbox);
    return sandbox.SeiPro.core.config;
}

export function loadSeiVersion(options = {}) {
    const isNewSEI = options.isNewSEI === true;
    const sandbox = createSandbox({
        sessionStorage: {
            _data: {},
            getItem(key) { return this._data[key] || null; },
            setItem(key, value) { this._data[key] = String(value); }
        },
        // version.js persiste a versão detectada via setOptionsPro (core/options),
        // que usa web storage local — precisa existir no sandbox.
        localStorage: {
            _data: {},
            getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
            setItem(key, value) { this._data[key] = String(value); },
            removeItem(key) { delete this._data[key]; }
        },
        jQuery: function (selector) {
            if (selector === '#divInfraSidebarMenu ul#infraMenu') {
                return { length: isNewSEI ? 1 : 0 };
            }
            return { length: 0, attr: function () { return undefined; } };
        },
        getOptionsPro: options.getOptionsPro,
        setOptionsPro: options.setOptionsPro
    });
    sandbox.$ = sandbox.jQuery;
    if (options.version) {
        sandbox.sessionStorage.setItem('versaoSei', options.version);
    }
    runBundle(sandbox);
    return { SeiPro: sandbox.SeiPro, sandbox };
}

export function loadSeiAdapter(options = {}) {
    // The bundle installs version + adapter + urls together.
    return loadSeiVersion(options).SeiPro;
}

export function loadSeiUrls(options = {}) {
    return loadSeiVersion(options).SeiPro;
}
