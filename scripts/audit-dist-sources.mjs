/**
 * Auditoria ADR-0011 / spec 001-build-generated-dist:
 * quais arquivos em dist/ NÃO são saídas declaradas do build?
 *
 * Uso: node scripts/audit-dist-sources.mjs [--json]
 * Exit 1 when any undeclared file exists (CI / npm run verify gate).
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listDeclaredDistOutputs } from './dist-pipeline.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, acc = []) {
    if (!existsSync(dir)) return acc;
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walk(full, acc);
        else acc.push(path.relative(root, full));
    }
    return acc;
}

const declared = listDeclaredDistOutputs(root);
const present = walk(path.join(root, 'dist')).sort();
const orphans = present.filter((f) => !declared.has(f));

const byDir = new Map();
let orphanBytes = 0;
for (const f of orphans) {
    const dir = path.dirname(f);
    const size = statSync(path.join(root, f)).size;
    orphanBytes += size;
    const cur = byDir.get(dir) || { count: 0, bytes: 0, files: [] };
    cur.count += 1;
    cur.bytes += size;
    cur.files.push(f);
    byDir.set(dir, cur);
}

if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ orphans, byDir: [...byDir] }, null, 2));
} else {
    const kb = (b) => (b / 1024).toFixed(0) + ' KB';
    console.log(`dist/: ${present.length} arquivos`);
    console.log(`produzidos pelo build: ${present.length - orphans.length}`);
    console.log(
        `SEM FONTE (não declarados pelo pipeline): ${orphans.length} — ${kb(orphanBytes)}\n`
    );
    for (const [dir, info] of [...byDir].sort((a, b) => b[1].bytes - a[1].bytes)) {
        console.log(`${dir}  →  ${info.count} arquivos, ${kb(info.bytes)}`);
        if (info.count <= 30) for (const f of info.files) console.log('    ' + path.basename(f));
    }
}

if (orphans.length > 0) {
    console.error(
        `\naudit-dist: FAIL — ${orphans.length} arquivo(s) em dist/ sem origem no pipeline declarado`
    );
    process.exit(1);
}
