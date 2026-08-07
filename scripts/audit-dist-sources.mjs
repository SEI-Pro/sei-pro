/**
 * Auditoria de ADR-0011: quais arquivos de dist/ NÃO são produzidos pelo build?
 *
 * Todo arquivo listado como "sem fonte" existe apenas porque foi commitado — apagar
 * dist/ o perde de forma irrecuperável. Este script é o inventário do resgate.
 *
 * Uso: node scripts/audit-dist-sources.mjs [--json]
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildSrc = readFileSync(path.join(root, 'scripts/build.mjs'), 'utf8');

/** Saídas declaradas: bundles/legados de build.mjs + assets do asset-manifest. */
function declaredOutputs() {
    const out = new Set();
    for (const m of buildSrc.matchAll(/['"](dist\/[^'"]+)['"]/g)) out.add(m[1]);

    // Assets estáticos: fonte de verdade é scripts/asset-manifest.mjs.
    for (const { out: o } of ALL_FILE_PAIRS) out.add(o);
    for (const { src, out: o } of ASSET_DIRS) {
        const absSrc = path.join(root, src);
        if (!existsSync(absSrc)) continue;
        for (const file of walk(absSrc)) {
            out.add(path.join(o, path.relative(src, file)));
        }
    }

    // Entries auto-descobertas: src/entries/*.js (exceto roots with stable legacy
    // output aliases) → dist/js/<name>.bundle.js.
    for (const f of readdirSync(path.join(root, 'src/entries'))) {
        if (
            (f.endsWith('.js') || f.endsWith('.ts'))
            && f !== 'background.js'
            && f !== 'atividades.ts'
            && f !== 'sei-functions.ts'
            && f !== 'editor.js'
            && f !== 'editor.ts'
            && f !== 'arvore.ts'
        ) {
            out.add('dist/js/' + f.replace(/\.(js|ts)$/, '.bundle.js'));
        }
    }
    // copyLegacy() escreve em dist/js/<basename>
    const legacyBlock = buildSrc.match(/const legacyFiles = \[([\s\S]*?)\];/);
    if (legacyBlock) {
        for (const m of legacyBlock[1].matchAll(/['"](src\/[^'"]+\.js)['"]/g)) {
            out.add('dist/js/' + path.basename(m[1]));
        }
    }
    out.add('dist/manifest.json');
    return out;
}

function walk(dir, acc = []) {
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walk(full, acc);
        else acc.push(path.relative(root, full));
    }
    return acc;
}

const declared = declaredOutputs();
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
    console.log(`SEM FONTE (só existem porque foram commitados): ${orphans.length} — ${kb(orphanBytes)}\n`);
    for (const [dir, info] of [...byDir].sort((a, b) => b[1].bytes - a[1].bytes)) {
        console.log(`${dir}  →  ${info.count} arquivos, ${kb(info.bytes)}`);
        if (info.count <= 30) for (const f of info.files) console.log('    ' + path.basename(f));
    }
}
