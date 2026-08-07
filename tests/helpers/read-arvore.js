import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

/** Concatenate all JS sources under src/features/arvore (post body.js split). */
export function readArvoreSource() {
    const dir = join(rootDir, 'src/features/arvore');
    return readdirSync(dir)
        .filter((name) => name.match(/\.(js|ts)$/))
        .sort()
        .map((name) => readFileSync(join(dir, name), 'utf8'))
        .join('\n');
}

export function readArvoreFile(name) {
    return readFileSync(join(rootDir, 'src/features/arvore', name), 'utf8');
}
