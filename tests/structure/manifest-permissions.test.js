/**
 * ADR-0015 / Phase S.1–S.2: host permission wildcards forbidden;
 * URL query selectors belong in content-script globs, while
 * web_accessible_resources is constrained to an explicit origin allowlist.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'manifest.base.json'), 'utf8'));

/** Host patterns that grant (or allow requesting) essentially the whole web. */
const HOST_WILDCARD_RE = /^(https?:\/\/\*\/\*|<all_urls>|\*:\/\/\*\/\*)$/i;
const WEB_ACCESSIBLE_ORIGINS = [
    '*://sei.prf.gov.br/*',
    '*://*.sp.gov.br/*',
    '*://*.antt.gov.br/*',
    '*://sip-sei.ans.gov.br/*',
    '*://sip-sei.ans.br/*'
];

describe('manifest permissions (ADR-0015)', () => {
    it('rejects host wildcards in optional_host_permissions and host_permissions', () => {
        const optional = manifest.optional_host_permissions || [];
        const required = manifest.host_permissions || [];
        for (const pattern of [...optional, ...required]) {
            expect(pattern, `wildcard host permission: ${pattern}`).not.toMatch(HOST_WILDCARD_RE);
            expect(pattern).not.toBe('https://*/*');
            expect(pattern).not.toBe('http://*/*');
            expect(pattern).not.toBe('*://*/*');
            expect(pattern).not.toBe('<all_urls>');
        }
    });

    it('does not list script.google.com as required host_permissions (telemetry opt-in)', () => {
        const required = manifest.host_permissions || [];
        expect(required.some((p) => /script\.google/i.test(p))).toBe(false);
        const optional = manifest.optional_host_permissions || [];
        expect(optional).toContain('https://script.google.com/*');
        expect(optional).toContain('https://script.googleusercontent.com/*');
    });

    it('keeps known LLM hosts as optional (not required)', () => {
        const optional = manifest.optional_host_permissions || [];
        expect(optional).toContain('https://api.openai.com/*');
        expect(optional).toContain('http://localhost/*');
        expect(optional).not.toContain('https://*/*');
    });

    it('keeps query strings out of Chrome match patterns', () => {
        for (const [index, cs] of (manifest.content_scripts || []).entries()) {
            for (const key of ['matches', 'exclude_matches']) {
                for (const pattern of cs[key] || []) {
                    expect(pattern, `${key}[${index}] contains a query: ${pattern}`).not.toMatch(/[?#]/);
                }
            }
        }
    });

    it('does not use unsupported top-level-domain wildcards', () => {
        for (const cs of manifest.content_scripts || []) {
            for (const pattern of [...(cs.matches || []), ...(cs.exclude_matches || [])]) {
                const host = pattern.split('://')[1]?.split(/[/:]/, 1)[0];
                expect(host, `TLD wildcard is not supported: ${pattern}`).not.toMatch(/^\*\.[^.]+$/);
            }
        }
    });

    it('uses globs for action-specific query selectors', () => {
        const includeGlobs = (manifest.content_scripts || []).flatMap((cs) => cs.include_globs || []);
        const excludeGlobs = (manifest.content_scripts || []).flatMap((cs) => cs.exclude_globs || []);
        expect(includeGlobs.some((pattern) => pattern.includes('?acao=editor_montar'))).toBe(true);
        expect(excludeGlobs.some((pattern) => pattern.includes('?acao=editor_montar'))).toBe(true);
    });

    it('keeps web_accessible_resources at origin scope and on the allowlist', () => {
        for (const entry of manifest.web_accessible_resources || []) {
            expect(entry.matches || []).toEqual(WEB_ACCESSIBLE_ORIGINS);
            for (const pattern of entry.matches || []) {
                expect(pattern, `WAR match must end at the origin: ${pattern}`).toMatch(/\/\*$/);
                expect(pattern).not.toMatch(/[?#]/);
            }
        }
    });
});
