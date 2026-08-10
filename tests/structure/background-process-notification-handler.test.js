import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background process notification adapter stays isolated', () => {
  it('service worker loads the process notification handler before delegating notification actions', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const processNotificationHandler = readFileSync(join(rootDir, 'src/background/process-notification-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');

    expect(background).toContain("'process-notification-handler.js'");
    expect(background).toMatch(/loadHandlers\(globalApi, importScriptsApi\)/);
    expect(router).toMatch(/SeiProBackgroundProcessNotification\.handleProcessNotificationMessage\(action, message, sendResponse, browserApi\)/);
    expect(background).not.toMatch(/function syncProcessNotificationState\(/);
    expect(background).not.toMatch(/function createProcessNotification\(/);
    expect(processNotificationHandler).toMatch(/function handleProcessNotificationMessage\(action, message, sendResponse, browserApi\)/);
    expect(processNotificationHandler).toMatch(/global\.SeiProBackgroundProcessNotification\s*=/);
    expect(processNotificationHandler).toMatch(/syncNotificacaoProcessos/);
    expect(processNotificationHandler).toMatch(/syncNotificacaoProcessosConfig/);
    expect(build).toMatch(/src\/background\/process-notification-handler\.js/);
  });
});
