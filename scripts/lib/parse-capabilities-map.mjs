/**
 * Parse structured anchors from docs/capabilities-map.md.
 * Anchors are fenced blocks whose body is JSON (JSON-compatible YAML 1.2)
 * after a marker comment line:
 *   # capabilities-map:inventory | gaps | exceptions
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../..');
export const DEFAULT_MAP_PATH = path.join(REPO_ROOT, 'docs/capabilities-map.md');

const MARKERS = {
    inventory: '# capabilities-map:inventory',
    gaps: '# capabilities-map:gaps',
    exceptions: '# capabilities-map:exceptions'
};

/**
 * @param {string} markdown
 * @param {string} marker
 * @returns {unknown}
 */
export function extractAnchorPayload(markdown, marker) {
    const fenceRe = /```(?:yaml|yml|json)?\s*\n([\s\S]*?)```/gi;
    let match;
    while ((match = fenceRe.exec(markdown)) !== null) {
        const body = match[1];
        const trimmed = body.trimStart();
        if (!trimmed.startsWith(marker)) continue;
        const withoutMarker = trimmed.slice(marker.length).replace(/^\s*\n/, '');
        const jsonText = withoutMarker
            .split('\n')
            .filter((line) => !/^\s*#/.test(line))
            .join('\n')
            .trim();
        if (!jsonText) {
            throw new Error(`Empty capabilities-map anchor after ${marker}`);
        }
        try {
            return JSON.parse(jsonText);
        } catch (err) {
            throw new Error(`Invalid JSON in capabilities-map anchor ${marker}: ${err.message}`);
        }
    }
    throw new Error(`Missing capabilities-map anchor: ${marker}`);
}

/**
 * Extract backtick-wrapped ids from the first column of markdown tables
 * inside a section delimited by `headingPattern` until the next same-or-higher heading.
 * @param {string} markdown
 * @param {RegExp} headingPattern - e.g. /^## Inventory\s*$/m
 * @param {{ stopAt?: RegExp }} [opts]
 * @returns {string[]}
 */
export function extractProseTableIds(markdown, headingPattern, opts = {}) {
    const start = markdown.search(headingPattern);
    if (start < 0) {
        throw new Error(`capabilities-map prose section not found: ${headingPattern}`);
    }
    const after = markdown.slice(start);
    const stopAt = opts.stopAt || /^#{1,3} /m;
    const rest = after.replace(/^[^\n]*\n/, '');
    const stopMatch = rest.search(stopAt);
    const section = stopMatch >= 0 ? rest.slice(0, stopMatch) : rest;
    const ids = [];
    for (const line of section.split('\n')) {
        if (!/^\|/.test(line) || /^\|\s*[-:| ]+\s*\|/.test(line)) continue;
        // Skip header rows that label the id column
        if (/^\|\s*id\s*\|/i.test(line) || /^\|\s*P\s*\|/i.test(line)) continue;
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (cells.length === 0) continue;
        // Inventory/Residuals: first cell is `id`. Gap register: second cell is `id`.
        const candidates = [cells[0], cells[1]].filter(Boolean);
        for (const cell of candidates) {
            const m = cell.match(/^`([a-z0-9-]+)`$/);
            if (m) {
                ids.push(m[1]);
                break;
            }
        }
    }
    return ids;
}

/**
 * @param {string} [mapPath]
 * @returns {{ inventory: { entries: object[] }, gaps: { gaps: object[] }, exceptions: { exceptions: object[] }, prose: { capabilityIds: string[], residualIds: string[], gapIds: string[] }, mapPath: string, markdown: string }}
 */
export function parseCapabilitiesMap(mapPath = DEFAULT_MAP_PATH) {
    const abs = path.isAbsolute(mapPath) ? mapPath : path.join(REPO_ROOT, mapPath);
    if (!fs.existsSync(abs)) {
        throw new Error(`capabilities-map not found: ${abs}`);
    }
    const markdown = fs.readFileSync(abs, 'utf8');
    const inventory = extractAnchorPayload(markdown, MARKERS.inventory);
    const gaps = extractAnchorPayload(markdown, MARKERS.gaps);
    const exceptions = extractAnchorPayload(markdown, MARKERS.exceptions);

    if (!inventory || !Array.isArray(inventory.entries)) {
        throw new Error('inventory anchor must be { entries: [] }');
    }
    if (!gaps || !Array.isArray(gaps.gaps)) {
        throw new Error('gaps anchor must be { gaps: [] }');
    }
    if (!exceptions || !Array.isArray(exceptions.exceptions)) {
        throw new Error('exceptions anchor must be { exceptions: [] }');
    }

    const capabilityIds = extractProseTableIds(markdown, /^## Inventory\s*$/m, {
        stopAt: /^### Residuals/m
    });
    const residualIds = extractProseTableIds(markdown, /^### Residuals & non-capabilities\s*$/m, {
        stopAt: /^## /m
    });
    const gapIds = extractProseTableIds(markdown, /^## Gap register\s*$/m, {
        stopAt: /^## /m
    });

    return {
        inventory,
        gaps,
        exceptions,
        prose: { capabilityIds, residualIds, gapIds },
        mapPath: abs,
        markdown
    };
}

export { MARKERS };
