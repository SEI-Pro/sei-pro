import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

/**
 * Compatibility helper for structural tests while the old aggregate is gone.
 * The source is now distributed across named capability folders plus the
 * shared runtime bridge; tests intentionally inspect the complete legacy
 * surface, not a historical directory name.
 */
export function readSeiFunctionsSource() {
    const dirs = [
        'src/shared/sei-runtime',
        'src/features/acoes-capa',
        'src/features/editor-captcha',
        'src/features/dialogs-host',
        'src/features/interessados-forms',
        'src/features/cores-marcadores',
        'src/features/midia-documentos',
        'src/features/notificacoes-processo',
        'src/features/historico-processos',
        'src/features/chrome-ui',
        'src/features/tabelas-arquivos',
        'src/features/menus-rapidos',
        'src/features/url-amigavel'
    ];
    const files = [];
    for (const rel of dirs) {
        const dir = join(rootDir, rel);
        for (const name of readdirSync(dir)) {
            const full = join(dir, name);
            if (statSync(full).isFile() && /\.(js|ts)$/.test(name)) files.push(full);
        }
    }
    return files.sort().map((file) => readFileSync(file, 'utf8')).join('\n');
}

export function readSeiFunctionsFile(name) {
    const candidates = [
        'src/shared/sei-runtime',
        'src/features/acoes-capa',
        'src/features/editor-captcha',
        'src/features/dialogs-host',
        'src/features/interessados-forms',
        'src/features/cores-marcadores',
        'src/features/midia-documentos',
        'src/features/notificacoes-processo',
        'src/features/historico-processos',
        'src/features/chrome-ui',
        'src/features/tabelas-arquivos',
        'src/features/menus-rapidos',
        'src/features/url-amigavel'
    ];
    for (const rel of candidates) {
        const file = join(rootDir, rel, name);
        try { return readFileSync(file, 'utf8'); } catch (_) { /* try next capability */ }
    }
    throw new Error(`legacy capability file not found: ${name}`);
}
