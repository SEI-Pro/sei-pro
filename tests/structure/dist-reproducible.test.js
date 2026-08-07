/**
 * ADR-0011 — dist/ deve ser 100% reproduzível a partir de src/, vendor/ e assets/.
 *
 * Contexto: em 2026-08-07, 137 arquivos (3,6 MB) existiam APENAS em dist/ commitado,
 * sem fonte no repositório — `sei-pro.css` (120 KB) entre eles. Um `rm -rf dist` os
 * perdia, e o build não os regenerava. Estes testes travam a regressão.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ALL_FILE_PAIRS, ASSET_DIRS } from '../../scripts/asset-manifest.mjs';

const root = process.cwd();
const abs = (rel) => path.join(root, rel);
const manifest = JSON.parse(readFileSync(abs('manifest.base.json'), 'utf8'));

/**
 * Recursos declarados no manifest que podem legitimamente não existir em dist/.
 * Cada entrada exige motivo — a lista não é escape hatch para referência morta.
 */
const OPTIONAL_RESOURCES = new Set([
    // Override opcional por instalação; src/bootstrap/init.js:48-65 carrega e avisa
    // sem falhar quando ausente.
    'js/sei-pro-config-local.js'
]);

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
        // `npm test` roda o build antes (pretest). Se dist/ não existe, o build falhou.
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
        const bad = ALL_FILE_PAIRS.filter(
            ({ src }) => !/^(vendor|src|assets)\//.test(src)
        );
        expect(bad.map((p) => p.src)).toEqual([]);
    });

    it('toda lib em vendor/ tem VERSION.txt', () => {
        const missing = readdirSync(abs('vendor'), { withFileTypes: true })
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .filter((dir) => !existsSync(abs(path.join('vendor', dir, 'VERSION.txt'))));
        expect(missing, 'lib sem VERSION.txt: registre versão, licença e patches locais').toEqual([]);
    });

    it('THIRD_PARTY_NOTICES.md está sincronizado com vendor/', () => {
        // Gerado por scripts/write-third-party-notices.mjs; o README o referencia.
        expect(() =>
            execFileSync('node', ['scripts/write-third-party-notices.mjs', '--check'], {
                cwd: root,
                stdio: 'pipe'
            })
        ).not.toThrow();
    });
});
