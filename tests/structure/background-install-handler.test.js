import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: background install adapter stays isolated', () => {
  it('service worker loads the install handler before delegating onInstalled', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const installHandler = readFileSync(join(rootDir, 'src/background/install-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8');

    expect(background).toContain("'install-handler.js'");
    expect(background).toMatch(/SeiProBackgroundInstall\.handleInstalled\(details, browserApi\)/);
    expect(background).not.toMatch(/browser\.tabs\.create\(\{ url: 'https:\/\/sei-pro\.github\.io\/sei-pro\/' \}\)/);
    expect(installHandler).toMatch(/function handleInstalled\(details, browserApi\)/);
    expect(installHandler).toMatch(/global\.SeiProBackgroundInstall\s*=/);
    expect(build).toMatch(/src\/background\/install-handler\.js/);
  });
});
