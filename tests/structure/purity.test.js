/**
 * Domain purity: src/core must not use chrome.* or browser.* APIs
 * (comments are ignored).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/** @type {string[]} TODO(ADR-0008): shrink — core files that still touch extension APIs */
const ALLOWLIST = [
    // Measured 2026-08-07: chrome./browser. in core appear only in comments.
];

const API_RE = /\b(?:chrome|browser)\./;

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else if (/\.(js|ts)$/.test(ent.name)) out.push(full);
    }
    return out;
}

function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

describe('core domain purity', () => {
    it('src/core has no chrome.* / browser.* usage outside allowlist', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src/core'))) {
            const text = stripComments(fs.readFileSync(file, 'utf8'));
            if (API_RE.test(text)) violators.push(toRel(file));
        }
        const allow = new Set(ALLOWLIST);
        const unexpected = violators.filter((f) => !allow.has(f));
        const stale = ALLOWLIST.filter((f) => !violators.includes(f));

        expect(
            unexpected,
            `core purity violations:\n${unexpected.join('\n')}`
        ).toEqual([]);
        expect(
            stale,
            `Stale ALLOWLIST entries — remove from purity.test.js:\n${stale.join('\n')}`
        ).toEqual([]);
    });
});

describe('sei.parse purity (ADR-0003)', () => {
    it('parsers do not import jQuery/domq or touch the global document', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src/sei/parse'))) {
            const text = stripComments(fs.readFileSync(file, 'utf8'));
            // Allowed: Document|Element parameters and root.querySelector on the argument.
            if (/\bfrom\s+['"][^'"]*jquery/i.test(text) || /\b\$\(/.test(text) || /\bdomq\b/.test(text)) {
                violators.push(toRel(file) + ' (jquery/domq)');
            }
            if (/\bdocument\.(?:getElementById|querySelector|querySelectorAll)\b/.test(text)) {
                violators.push(toRel(file) + ' (global document)');
            }
        }
        expect(violators, `sei.parse purity violations:\n${violators.join('\n')}`).toEqual([]);
    });
});
