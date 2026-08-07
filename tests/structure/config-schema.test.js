/**
 * ADR-0009 / Phase 2.2 — schema completeness vs inventory sources.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    CONFIG_SCHEMA,
    getDefaultEnabledConfigKeys,
    isConfigKey
} from '../../src/config/schema.ts';

const root = process.cwd();

function walkSrc(dir, acc = []) {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, name.name);
        if (name.isDirectory()) {
            if (name.name === 'node_modules' || name.name === 'dist') continue;
            walkSrc(p, acc);
        } else if (/\.(ts|js)$/.test(name.name)) {
            acc.push(p);
        }
    }
    return acc;
}

function extractHelperLiterals() {
    const re =
        /\b(?:verifyConfigValue|checkConfigValue|getConfigValue)\s*\(\s*['"]([^'"]+)['"]/g;
    const keys = new Set();
    for (const file of walkSrc(join(root, 'src'))) {
        const text = readFileSync(file, 'utf8');
        let m;
        while ((m = re.exec(text))) keys.add(m[1]);
    }
    return keys;
}

function extractHtmlDataNames() {
    const html = readFileSync(join(root, 'src/options/options.html'), 'utf8');
    const keys = new Set();
    const re = /data-name=["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(html))) keys.add(m[1]);
    return keys;
}

function extractCsvKeys() {
    const csv = readFileSync(
        join(root, 'docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv'),
        'utf8'
    );
    const keys = new Set();
    for (const line of csv.split(/\r?\n/).slice(1)) {
        if (!line.trim()) continue;
        const first = line.split(',')[0].replace(/^"|"$/g, '').trim();
        if (first) keys.add(first);
    }
    return keys;
}

describe('CONFIG_SCHEMA completeness', () => {
    const schemaKeys = new Set(Object.keys(CONFIG_SCHEMA));
    const codeKeys = extractHelperLiterals();
    const htmlKeys = extractHtmlDataNames();
    const csvKeys = extractCsvKeys();

    it('declares required fields on every entry', () => {
        for (const key of schemaKeys) {
            const entry = CONFIG_SCHEMA[key];
            expect(['boolean', 'string', 'number']).toContain(entry.type);
            expect(entry.default).not.toBeUndefined();
            expect(typeof entry.label).toBe('string');
            expect(entry.label.length).toBeGreaterThan(0);
        }
    });

    it('includes every verify/check/getConfigValue literal from src/', () => {
        const missing = [...codeKeys].filter((k) => !schemaKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('includes every options.html data-name', () => {
        const missing = [...htmlKeys].filter((k) => !schemaKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('includes every opcoes_funcoes.csv key', () => {
        const missing = [...csvKeys].filter((k) => !schemaKeys.has(k));
        expect(missing).toEqual([]);
    });

    it('includes llmProvedoresExternos and bugReportOptIn', () => {
        expect(isConfigKey('llmProvedoresExternos')).toBe(true);
        expect(CONFIG_SCHEMA.llmProvedoresExternos.default).toBe(true);
        expect(isConfigKey('bugReportOptIn')).toBe(true);
        expect(CONFIG_SCHEMA.bugReportOptIn.storage).toBe('local');
    });

    it('documents inventory discrepancy count in keys-inventory.md', () => {
        const inventory = readFileSync(join(root, 'src/config/keys-inventory.md'), 'utf8');
        expect(inventory).toMatch(/Discrepancy count/i);
        expect(inventory).toMatch(/\b69\b/);
        expect(inventory).toMatch(/\b72\b/);
        expect(inventory).toMatch(/\b74\b/);
    });

    it('default-enabled list matches boolean defaults true', () => {
        const enabled = getDefaultEnabledConfigKeys();
        expect(enabled).toEqual(expect.arrayContaining([
            'filtrarpaginapelapesquisarapida',
            'gerenciarmonitorados',
            'autopreenchersenha',
            'llmProvedoresExternos'
        ]));
        for (const key of enabled) {
            expect(CONFIG_SCHEMA[key].default).toBe(true);
        }
    });
});
