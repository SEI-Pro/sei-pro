import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = 'dist/js/core-stack.bundle.js';

function createStorage() {
  const data = {};
  return {
    _data: data,
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    },
    removeItem(key) {
      delete data[key];
    }
  };
}

export function loadCoreScripts(scriptPaths) {
  const SeiPro = { core: {}, sei: {}, features: {}, state: {} };
  const sandbox = {
    window: {},
    SeiPro,
    chrome: {
      runtime: {
        getURL(url) {
          return `chrome-extension://test-id/${url}`;
        },
        getManifest() {
          return { version: '1.7.16', short_name: 'SEI Pro PRF', icons: {} };
        }
      }
    },
    browser: undefined,
    sessionStorage: createStorage(),
    localStorage: createStorage(),
    console,
    URL,
    jmespath: null,
    jQuery: null,
    $: null
  };
  sandbox.window = sandbox;

  // Phase 5: the core+sei stack is shipped as a single bundled IIFE built from
  // src/. Loading it installs the whole stack (installCoreStack) onto SeiPro.
  // The legacy per-file paths are kept in callers only as documentation.
  const code = readFileSync(join(rootDir, BUNDLE), 'utf8');
  vm.runInNewContext(code, sandbox, { filename: BUNDLE });

  return sandbox;
}

export function loadUtilCore() {
  return loadCoreScripts();
}

export function loadConfigCore(jmespathImpl) {
  const sandbox = loadCoreScripts();
  // config helpers read jmespath lazily at call time, so injecting it after the
  // bundle has installed is sufficient.
  sandbox.jmespath = jmespathImpl;
  return sandbox;
}
