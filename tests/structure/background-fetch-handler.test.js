import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background fetch adapter stays isolated', () => {
  it('service worker loads the fetch handler before delegating fetch actions', () => {
    const background = readFileSync(join(rootDir, 'src/background/background.js'), 'utf8');
    const fetchHandler = readFileSync(join(rootDir, 'src/background/fetch-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8');

    expect(background).toContain("importScripts('storage-handler.js', 'fetch-handler.js', 'bug-report-handler.js', 'process-notification-handler.js')");
    expect(background).toMatch(/SeiProBackgroundFetch\.handleFetchMessage\(message, sender, sendResponse, browser\)/);
    expect(fetchHandler).toMatch(/function handleFetchMessage\(message, sender, sendResponse, browserApi\)/);
    expect(fetchHandler).toMatch(/global\.SeiProBackgroundFetch\s*=/);
    expect(fetchHandler).toMatch(/generativelanguage\.googleapis\.com/);
    expect(build).toMatch(/src\/background\/fetch-handler\.js/);
  });
});
