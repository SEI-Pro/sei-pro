/**
 * Resgate único de ADR-0011 — passos 1 e 2.
 *
 * Move para uma fonte real (`vendor/`, `src/css/`, `assets/`) os assets que só
 * existiam em `dist/` commitado, e remove o lixo. Usa `git mv` para preservar
 * histórico. Idempotente: pares já movidos são ignorados.
 *
 * Só depois deste script (e de um rebuild limpo verde) `dist/` pode sair do git.
 *
 *   node scripts/rescue-dist-assets.mjs --dry-run
 *   node scripts/rescue-dist-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

/** Artefatos obsoletos, sem referência no manifest nem no build. */
const DELETE = [
    'dist/background.js',   // duplicata obsoleta (abr/2025); o manifest usa js/background.js
    'dist/jsconfig.json'    // config de editor para dist/js/lib, sem propósito
];

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });

let moved = 0;
let skipped = 0;
let deleted = 0;
const problems = [];

function movePair(from, to) {
    const absFrom = path.join(root, from);
    const absTo = path.join(root, to);

    if (existsSync(absTo)) { skipped++; return; }
    if (!existsSync(absFrom)) {
        problems.push(`fonte ausente e destino inexistente: ${from} → ${to}`);
        return;
    }
    console.log(`${dryRun ? '[dry] ' : ''}mv ${from} → ${to}`);
    if (dryRun) { moved++; return; }
    mkdirSync(path.dirname(absTo), { recursive: true });
    try {
        git('mv', from, to);
    } catch {
        // Não rastreado pelo git: move sem histórico.
        execFileSync('mv', [absFrom, absTo], { cwd: root });
    }
    moved++;
}

function walk(dir, acc = []) {
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walk(full, acc);
        else acc.push(path.relative(root, full));
    }
    return acc;
}

console.log('— pares explícitos —');
for (const { src, out } of ALL_FILE_PAIRS) movePair(out, src);

console.log('\n— árvores —');
for (const { src, out } of ASSET_DIRS) {
    const absOut = path.join(root, out);
    if (!existsSync(absOut)) { skipped++; continue; }
    for (const file of walk(absOut)) {
        movePair(file, path.join(src, path.relative(out, file)));
    }
}

console.log('\n— remoção de obsoletos —');
for (const rel of DELETE) {
    if (!existsSync(path.join(root, rel))) { skipped++; continue; }
    console.log(`${dryRun ? '[dry] ' : ''}rm ${rel}`);
    if (!dryRun) {
        try { git('rm', '-q', rel); } catch { execFileSync('rm', [rel], { cwd: root }); }
    }
    deleted++;
}

console.log(`\nmovidos: ${moved}  |  já resgatados/ignorados: ${skipped}  |  removidos: ${deleted}`);
if (problems.length) {
    console.error('\nPENDÊNCIAS (resolver à mão):');
    for (const p of problems) console.error('  - ' + p);
    process.exitCode = 1;
} else if (!dryRun) {
    console.log('\nPróximo passo: npm run build && npm test');
}
