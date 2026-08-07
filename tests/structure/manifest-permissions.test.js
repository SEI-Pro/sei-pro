/**
 * ADR-0015 / Phase S.1–S.2: host permission wildcards forbidden;
 * web_accessible_resources.matches ⊆ content_scripts.matches.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'manifest.base.json'), 'utf8'));

/** Host patterns that grant (or allow requesting) essentially the whole web. */
const HOST_WILDCARD_RE = /^(https?:\/\/\*\/\*|<all_urls>|\*:\/\/\*\/\*)$/i;

function collectContentScriptMatches(m) {
    const set = new Set();
    for (const cs of m.content_scripts || []) {
        for (const pattern of cs.matches || []) set.add(pattern);
    }
    return set;
}

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

    it('restricts web_accessible_resources.matches to content_script matches', () => {
        const csMatches = collectContentScriptMatches(manifest);
        expect(csMatches.size).toBeGreaterThan(0);
        for (const entry of manifest.web_accessible_resources || []) {
            for (const pattern of entry.matches || []) {
                expect(
                    csMatches.has(pattern),
                    `WAR match not in content_scripts: ${pattern}`
                ).toBe(true);
            }
            expect(entry.matches || []).not.toContain('*://*.br/*');
            expect(entry.matches || []).not.toContain('*://*.org/*');
        }
    });
});
