import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background bug report adapter stays isolated', () => {
  it('service worker loads the bug report handler before delegating enviarRelatorioBug', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const router = readFileSync(join(rootDir, 'src/background/router.js'), 'utf8');
    const bugReportHandler = readFileSync(join(rootDir, 'src/background/bug-report-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');

    expect(background).toContain("'bug-report-handler.js'");
    expect(background).toMatch(/loadHandlers\(globalApi, importScriptsApi\)/);
    expect(router).toMatch(/SeiProBackgroundBugReport\.handleBugReportMessage\(message, sender, sendResponse\)/);
    expect(background).not.toMatch(/function isAllowedBugReportSender\(/);
    expect(bugReportHandler).toMatch(/function handleBugReportMessage\(message, sender, sendResponse\)/);
    expect(bugReportHandler).toMatch(/global\.SeiProBackgroundBugReport\s*=/);
    expect(bugReportHandler).toMatch(/hostname === ['"]sei\.prf\.gov\.br['"]/);
    expect(bugReportHandler).toMatch(/sendViaGet/);
    expect(build).toMatch(/src\/background\/bug-report-handler\.js/);
  });
});
