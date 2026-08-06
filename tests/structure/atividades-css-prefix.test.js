import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');
const atividadesDir = join(rootDir, 'src/features/atividades');

describe('migration: atividades CSS P6 prefix', () => {
  it('style.css usa seletores .seipro-* em vez de #ids da feature', () => {
    const css = read('src/features/atividades/style.css');
    expect(css).toContain('.seipro-atividades-root');
    expect(css).toContain('.seipro-atividades-panel');
    expect(css).toContain('.seipro-atividades-gantt');
    expect(css).toContain('.seipro-atividades-table-panel');
    expect(css).toContain('.seipro-atividades-box');
    expect(css).toContain('.seipro-atividades-bar--em-execucao');
    expect(css).not.toMatch(/#ganttAtivPanel\b/);
    expect(css).not.toMatch(/#tabelaAtivPanel\b/);
    expect(css).not.toMatch(/#boxAtividade\b/);
    expect(css).not.toMatch(/#atividadesProDiv\b/);
  });

  it('style.css inclui seletores P6 leftovers com dual-class .seipro-*', () => {
    const css = read('src/features/atividades/style.css');
    expect(css).toContain('.seipro-atividades-progress--atraso');
    expect(css).toContain('.seipro-atividades-progress--analise');
    expect(css).toContain('.seipro-atividades-progress--periodo');
    expect(css).toContain('.seipro-atividades-progress--entregue');
    expect(css).toContain('.seipro-atividades-progress-bar');
    expect(css).toContain('.seipro-atividades-progress-txt');
    expect(css).toContain('.seipro-atividades-preview');
    expect(css).toContain('.seipro-atividades-tags .tag-input');
    expect(css).toContain('.seipro-atividades-table.tableFollow');
    // dual-class: legacy names may remain alongside seipro
    expect(css).toMatch(/\.atividadesProgresso_atraso[\s\S]*\.seipro-atividades-progress--atraso|\.seipro-atividades-progress--atraso[\s\S]*\.atividadesProgresso_atraso/);
    // bare top-level .tableFollow rules for atividades sizing should be scoped
    expect(css).not.toMatch(/^\.tableFollow\s/m);
  });

  it('markup dual-class preserva ids legados e adiciona .seipro-*', () => {
    const panel = read('src/features/atividades/panel.js');
    expect(panel).toContain('id="tabelaAtivPanel" class="seipro-atividades-table-panel');
    expect(panel).toContain('id="ganttAtivPanel" class="seipro-atividades-gantt');
    expect(panel).toContain('id="atividadesProActions" class="seipro-atividades-actions');
    expect(panel).toContain('tableAtividades seipro-atividades-table');

    const templates = read('src/features/atividades/templates.js');
    expect(templates).toContain('withSeiproBarClasses');
    expect(templates).toContain('seipro-atividades-bar--');

    const seiFunctions = read('src/features/sei-functions/body.js');
    expect(seiFunctions).toContain('id="ganttHistoryPainel" class="seipro-atividades-gantt-history"');
    expect(seiFunctions).toContain('id="boxHistory" class="tabelaPanelScroll seipro-atividades-history"');

    const boot = read('src/features/atividades/boot.js');
    expect(boot).toContain('preview_atividade seipro-atividades-preview');
  });

  it('forbids inline onmouse*/tooltip handlers in atividades/*.js', () => {
    const files = readdirSync(atividadesDir).filter((f) => f.endsWith('.js'));
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(join(atividadesDir, file), 'utf8');
      if (src.includes('onmouseover=') || src.includes('onmouseout=') || src.includes('onmouseenter=')) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});
