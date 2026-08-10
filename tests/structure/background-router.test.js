import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background message router stays isolated', () => {
  it('keeps the service-worker entry as a thin composition root', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');

    expect(background).toContain("'llm-handler.js'");
    expect(background).toContain("'router.js'");
    expect(background).toMatch(/browserApi\.runtime\.onMessage\?\.addListener\(handleMessage\)/);
    expect(background).toMatch(/browserApi\.runtime\.onConnect\?\.addListener\(handleConnect\)/);
    expect(background).toMatch(/SeiProBackgroundRouter\.handleMessage\(message, sender, sendResponse, browserApi\)/);
    expect(background).not.toMatch(/var action = message && message\.action/);
    expect(router).toMatch(/function handleMessage\(message, sender, sendResponse, browserApi\)/);
    expect(router).toMatch(/global\.SeiProBackgroundRouter\s*=/);
    expect(router).toMatch(/syncNotificacaoProcessos/);
    expect(router).toMatch(/enviarRelatorioBug/);
    expect(router).toMatch(/SeiProBackgroundLlm\.handleLlmCompleteMessage\(message, sender, sendResponse, browserApi\)/);
    expect(build).toMatch(/src\/background\/router\.js/);
  });
});
