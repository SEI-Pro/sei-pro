import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background fetch adapter stays isolated', () => {
  it('service worker loads the fetch handler before delegating fetch actions', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const fetchHandler = readFileSync(join(rootDir, 'src/background/fetch-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');

    expect(background).toContain("'fetch-handler.js'");
    expect(background).toMatch(/loadHandlers\(globalApi, importScriptsApi\)/);
    expect(router).toMatch(/SeiProBackgroundFetch\.handleFetchMessage\(message, sender, sendResponse, browserApi\)/);
    expect(fetchHandler).toMatch(/function handleFetchMessage\(message, sender, sendResponse, browserApi\)/);
    expect(fetchHandler).toMatch(/global\.SeiProBackgroundFetch\s*=/);
    expect(fetchHandler).toMatch(/generativelanguage\.googleapis\.com/);
    expect(build).toMatch(/src\/background\/fetch-handler\.js/);
  });
});
