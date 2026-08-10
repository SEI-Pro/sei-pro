/**
 * ADR-0011 / spec 001-build-generated-dist — dist/ deve ser 100% reproduzível
 * a partir de src/, vendor/ e assets/ via o pipeline declarado.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ALL_FILE_PAIRS, ASSET_DIRS } from '../../scripts/asset-manifest.mjs';
import {
    listDeclaredDistOutputs,
    OPTIONAL_RESOURCES
} from '../../scripts/dist-pipeline.mjs';

const root = process.cwd();
const abs = (rel) => path.join(root, rel);
const manifest = JSON.parse(readFileSync(abs('manifest.base.json'), 'utf8'));

function walkDist(dir, acc = []) {
    if (!existsSync(dir)) return acc;
    for (const name of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, name.name);
        if (name.isDirectory()) walkDist(full, acc);
        else acc.push(path.relative(root, full));
    }
    return acc;
}

/** Arquivos que o navegador EXIGE para carregar a extensão. Ausência = quebra. */
function requiredReferences() {
    const refs = new Set();
    for (const block of manifest.content_scripts || []) {
        for (const f of block.js || []) refs.add(f);
        for (const f of block.css || []) refs.add(f);
    }
    for (const f of Object.values(manifest.icons || {})) refs.add(f);
    if (manifest.background?.service_worker) refs.add(manifest.background.service_worker);
    if (manifest.action?.default_popup) refs.add(manifest.action.default_popup);
    return [...refs];
}

/** web_accessible_resources: não quebram o carregamento, mas quebram a feature. */
function declaredResources() {
    const refs = new Set();
    for (const entry of manifest.web_accessible_resources || []) {
        for (const f of entry.resources || []) {
            if (!f.includes('*') && !OPTIONAL_RESOURCES.has(f)) refs.add(f);
        }
    }
    return [...refs];
}

describe('ADR-0011: dist/ é reproduzível', () => {
    it('toda fonte declarada no asset-manifest existe', () => {
        const missing = ALL_FILE_PAIRS
            .map(({ src }) => src)
            .concat(ASSET_DIRS.map(({ src }) => src))
            .filter((src) => !existsSync(abs(src)));
        expect(missing, 'fontes ausentes — asset órfão voltou a existir só em dist/').toEqual([]);
    });

    it('todo arquivo exigido para carregar a extensão existe em dist/', () => {
        expect(existsSync(abs('dist')), 'dist/ ausente — rode npm run build').toBe(true);

        const missing = requiredReferences().filter((ref) => !existsSync(abs(path.join('dist', ref))));
        expect(missing, 'content_scripts/icons/service worker referenciam arquivo inexistente').toEqual([]);
    });

    it('nenhum web_accessible_resource é referência morta', () => {
        const missing = declaredResources().filter((ref) => !existsSync(abs(path.join('dist', ref))));
        expect(
            missing,
            'recurso declarado que não existe: remova do manifest ou marque como opcional com motivo'
        ).toEqual([]);
    });

    it('nenhum asset é servido a partir de uma fonte fora de vendor/, src/ ou assets/', () => {
        const bad = ALL_FILE_PAIRS.filter(({ src }) => !/^(vendor|src|assets)\//.test(src));
        expect(bad.map((p) => p.src)).toEqual([]);
    });

    it('ASSET_DIRS também ficam sob vendor/, src/ ou assets/', () => {
        const bad = ASSET_DIRS.filter(({ src }) => !/^(vendor|src|assets)\//.test(src));
        expect(bad.map((p) => p.src)).toEqual([]);
    });

    it('todo arquivo em dist/ está em listDeclaredDistOutputs', () => {
        const declared = listDeclaredDistOutputs(root);
        const present = walkDist(abs('dist'));
        const orphans = present.filter((f) => !declared.has(f));
        expect(orphans, 'arquivo em dist/ sem origem no pipeline').toEqual([]);
    });

    it('toda lib em vendor/ tem VERSION.txt', () => {
        const missing = readdirSync(abs('vendor'), { withFileTypes: true })
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .filter((dir) => !existsSync(abs(path.join('vendor', dir, 'VERSION.txt'))));
        expect(missing, 'lib sem VERSION.txt: registre versão, licença e patches locais').toEqual([]);
    });

    it('THIRD_PARTY_NOTICES.md está sincronizado com vendor/', () => {
        expect(() =>
            execFileSync('node', ['scripts/write-third-party-notices.mjs', '--check'], {
                cwd: root,
                stdio: 'pipe'
            })
        ).not.toThrow();
    });

    it('cada OPTIONAL_RESOURCES tem motivo não vazio', () => {
        for (const [pathKey, reason] of OPTIONAL_RESOURCES) {
            expect(reason?.trim().length, `opcional sem motivo: ${pathKey}`).toBeGreaterThan(0);
        }
    });
});
