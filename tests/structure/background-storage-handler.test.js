import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background storage adapter stays isolated', () => {
  it('service worker loads the storage handler before delegating storage actions', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const storageHandler = readFileSync(join(rootDir, 'src/background/storage-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8');

    expect(background).toContain("'storage-handler.js'");
    expect(background).toMatch(/loadHandlers\(globalApi, importScriptsApi\)/);
    expect(router).toMatch(/SeiProBackgroundStorage\.handleStorageMessage\(action, message, sendResponse, browserApi\)/);
    expect(storageHandler).toMatch(/function handleStorageMessage\(action, message, sendResponse, browserApi\)/);
    expect(storageHandler).toMatch(/global\.SeiProBackgroundStorage\s*=/);
    expect(build).toMatch(/src\/background\/storage-handler\.js/);
  });
});
