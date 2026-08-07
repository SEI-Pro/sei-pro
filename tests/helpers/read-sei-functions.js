import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

/** Concatenate all JS sources under src/features/sei-functions (post body.js split). */
export function readSeiFunctionsSource() {
    const dir = join(rootDir, 'src/features/sei-functions');
    return readdirSync(dir)
        .filter((name) => name.endsWith('.js'))
        .sort()
        .map((name) => readFileSync(join(dir, name), 'utf8'))
        .join('\n');
}

export function readSeiFunctionsFile(name) {
    return readFileSync(join(rootDir, 'src/features/sei-functions', name), 'utf8');
}
