import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background message router stays isolated', () => {
  it('keeps background.js as a thin service-worker facade', () => {
    const background = readFileSync(join(rootDir, 'src/background/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8');

    expect(background).toContain("importScripts('storage-handler.js', 'fetch-handler.js', 'bug-report-handler.js', 'process-notification-handler.js', 'install-handler.js', 'router.js')");
    expect(background).toMatch(/browser\.runtime\.onMessage\.addListener\(handleMessage\)/);
    expect(background).toMatch(/SeiProBackgroundRouter\.handleMessage\(message, sender, sendResponse, browser\)/);
    expect(background).not.toMatch(/var action = message && message\.action/);
    expect(router).toMatch(/function handleMessage\(message, sender, sendResponse, browserApi\)/);
    expect(router).toMatch(/global\.SeiProBackgroundRouter\s*=/);
    expect(router).toMatch(/syncNotificacaoProcessos/);
    expect(router).toMatch(/enviarRelatorioBug/);
    expect(build).toMatch(/src\/background\/router\.js/);
  });
});
