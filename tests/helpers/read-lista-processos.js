import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

/** Concatenate all JS sources under src/features/lista-processos (post body.js split). */
export function readListaProcessosSource() {
    const dir = join(rootDir, 'src/features/lista-processos');
    return readdirSync(dir)
        .filter((name) => name.match(/\.(js|ts)$/))
        .sort()
        .map((name) => readFileSync(join(dir, name), 'utf8'))
        .join('\n');
}

export function readListaProcessosFile(name) {
    return readFileSync(join(rootDir, 'src/features/lista-processos', name), 'utf8');
}
