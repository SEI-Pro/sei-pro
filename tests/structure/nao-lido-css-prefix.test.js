import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: nao-lido CSS ownership audit', () => {
  it('keeps the feature free of unprefixed feature-owned CSS while preserving SEI legacy hooks', () => {
    const view = read('src/features/nao-lido/view.js');
    const producer = read('src/features/lista-processos/pagination-tabs.js');
    const legacyConsumer = readSeiFunctionsSource();

    // There is no feature stylesheet or feature-owned markup left in nao-lido.
    // These are SEI/lista legacy contracts, not classes owned by the migrated feature.
    expect(existsSync(join(rootDir, 'src/features/nao-lido/style.css'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/nao-lido/nao-lido.css'))).toBe(false);
    expect(view).toContain('[data-act="nao-lido-marcar"]');
    expect(view).toContain("$('.processoNaoVisualizado')");
    expect(view).toContain("attr('class', 'processoNaoVisualizado')");
    expect(producer).toContain('iconPro_Observe iconNaoLido');
    expect(legacyConsumer).toContain('processoNaoVisualizadoSigiloso');
    expect(legacyConsumer).toContain('processoCredencialAssinaturaSigiloso');
  });
});
