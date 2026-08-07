/**
 * ADR-0011 — dist/ não volta para o controle de versão.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8' });

describe('ADR-0011: dist/ fora do git', () => {
    it('nenhum arquivo de dist/ está rastreado', () => {
        const tracked = git('ls-files', 'dist').trim();
        expect(
            tracked ? tracked.split('\n') : [],
            'dist/ é saída gerada; se um asset precisa existir, a fonte vai em vendor/, src/ ou assets/'
        ).toEqual([]);
    });

    it('.gitignore ignora dist/', () => {
        // --no-index é essencial: sem ele, git check-ignore não reporta caminho
        // RASTREADO, e o teste mediria rastreamento em vez da regra de ignore.
        let ignored = true;
        try {
            git('check-ignore', '-q', '--no-index', 'dist/manifest.json');
        } catch {
            ignored = false;
        }
        expect(ignored, 'adicione /dist/ ao .gitignore').toBe(true);
    });
});
