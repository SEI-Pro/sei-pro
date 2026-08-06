#!/usr/bin/env node
/**
 * Replace bare cross-fatia calls with callAtiv('name', ...) so legacy-api can
 * stop aliasing the full handler registry.
 *
 * Skips: strings, comments, regex literals, export/function defs, property
 * access (.name()), already-imported locals, callAtiv itself.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/features/atividades');
const skipFiles = new Set([
    'handlers.js', 'modules.js', 'legacy-api.js', 'index.js', 'view.js', 'call.js',
    'domain.js', 'io.js', 'templates.js', 'state.js', 'compat.js', 'runtime.js'
]);

const files = readdirSync(dir).filter((f) => f.endsWith('.js') && !skipFiles.has(f));

const exportsByFile = new Map();
for (const f of files) {
    const src = readFileSync(join(dir, f), 'utf8');
    const ex = new Set();
    for (const m of src.matchAll(/export function ([A-Za-z_$][\w$]*)/g)) ex.add(m[1]);
    exportsByFile.set(f, ex);
}
const nameToFile = new Map();
for (const [f, ex] of exportsByFile) {
    for (const n of ex) if (!nameToFile.has(n)) nameToFile.set(n, f);
}

function importedNames(src) {
    const names = new Set();
    for (const m of src.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g)) {
        for (const part of m[1].split(',')) {
            const bit = part.trim();
            if (!bit) continue;
            const as = bit.split(/\s+as\s+/);
            names.add((as[1] || as[0]).trim());
        }
    }
    return names;
}

function prevMeaningful(src, i) {
    let j = i - 1;
    while (j >= 0 && /\s/.test(src[j])) j--;
    return j < 0 ? '' : src[j];
}

function isRegexStart(src, i) {
    if (src[i] !== '/') return false;
    if (src[i + 1] === '/' || src[i + 1] === '*') return false;
    const p = prevMeaningful(src, i);
    if (p === '') return true;
    // division after identifier/number/)/]/]/
    if (/[\w)$\]]/.test(p)) return false;
    return true;
}

/** Walk source; return ranges [start,end) that are string/comment/regex. */
function opaqueRanges(src) {
    const ranges = [];
    let i = 0;
    while (i < src.length) {
        const c = src[i];
        const n = src[i + 1];
        if (c === '/' && n === '/') {
            const start = i;
            i += 2;
            while (i < src.length && src[i] !== '\n') i++;
            ranges.push([start, i]);
            continue;
        }
        if (c === '/' && n === '*') {
            const start = i;
            i += 2;
            while (i + 1 < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
            i = Math.min(src.length, i + 2);
            ranges.push([start, i]);
            continue;
        }
        if (isRegexStart(src, i)) {
            const start = i;
            i++; // /
            while (i < src.length) {
                if (src[i] === '\\') { i += 2; continue; }
                if (src[i] === '/') { i++; break; }
                if (src[i] === '\n') break;
                i++;
            }
            while (i < src.length && /[a-z]/i.test(src[i])) i++; // flags
            ranges.push([start, i]);
            continue;
        }
        if (c === "'" || c === '"' || c === '`') {
            const quote = c;
            const start = i;
            i++;
            while (i < src.length) {
                if (src[i] === '\\') { i += 2; continue; }
                if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
                    // skip ${...} with naive brace depth so nested quotes work later
                    i += 2;
                    let depth = 1;
                    while (i < src.length && depth > 0) {
                        const ch = src[i];
                        if (ch === '\\') { i += 2; continue; }
                        if (ch === "'" || ch === '"') {
                            const q = ch; i++;
                            while (i < src.length) {
                                if (src[i] === '\\') { i += 2; continue; }
                                if (src[i] === q) { i++; break; }
                                i++;
                            }
                            continue;
                        }
                        if (ch === '`') { // nested template — treat rest as opaque until `
                            i++;
                            while (i < src.length) {
                                if (src[i] === '\\') { i += 2; continue; }
                                if (src[i] === '`') { i++; break; }
                                i++;
                            }
                            continue;
                        }
                        if (ch === '{') depth++;
                        else if (ch === '}') depth--;
                        i++;
                    }
                    continue;
                }
                if (src[i] === quote) { i++; break; }
                i++;
            }
            ranges.push([start, i]);
            continue;
        }
        i++;
    }
    return ranges;
}

function inRanges(pos, ranges) {
    let lo = 0;
    let hi = ranges.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const [a, b] = ranges[mid];
        if (pos < a) hi = mid - 1;
        else if (pos >= b) lo = mid + 1;
        else return true;
    }
    return false;
}

function ensureImport(out, names) {
    const want = names.filter(Boolean);
    const existing = out.match(/import\s*\{([^}]*)\}\s*from\s*'\.\/call\.js';/);
    if (existing) {
        const have = new Set(existing[1].split(',').map((s) => s.trim()).filter(Boolean));
        want.forEach((n) => have.add(n));
        const next = `import { ${[...have].join(', ')} } from './call.js';`;
        return out.replace(/import\s*\{[^}]*\}\s*from\s*'\.\/call\.js';/, next);
    }
    const importBlock = out.match(/^(?:import[\s\S]*?;\n)+/);
    const line = `import { ${want.join(', ')} } from './call.js';\n`;
    if (importBlock) {
        const end = importBlock[0].length;
        return `${out.slice(0, end)}${line}${out.slice(end)}`;
    }
    return line + out;
}

function transform(file, src) {
    const own = exportsByFile.get(file) || new Set();
    const local = importedNames(src);
    local.add('callAtiv');
    local.add('hasAtiv');
    const foreign = [...nameToFile.keys()].filter((n) => !own.has(n) && !local.has(n));
    if (!foreign.length) return { out: src, n: 0 };

    const ranges = opaqueRanges(src);
    foreign.sort((a, b) => b.length - a.length);
    const reParts = foreign.map((name) => name.replace(/[$]/g, '\\$&')).join('|');
    const re = new RegExp(`(?<![\\w.$])(${reParts})\\s*\\(`, 'g');

    let out = '';
    let i = 0;
    let n = 0;
    let m;
    while ((m = re.exec(src))) {
        const idx = m.index;
        if (inRanges(idx, ranges)) continue;
        const before = src.slice(Math.max(0, idx - 80), idx);
        if (/(?:export\s+)?function\s*$/.test(before)) continue;
        if (/\bcallAtiv\s*\(\s*['"`]\s*$/.test(before)) continue;

        out += src.slice(i, idx);
        out += `callAtiv('${m[1]}',`;
        i = idx + m[0].length;
        n++;
        re.lastIndex = i;
    }
    out += src.slice(i);

    // hasAtiv('X') ? X : → hasAtiv('X') ? (...a) => callAtiv('X', ...a) :
    out = out.replace(
        /hasAtiv\('([A-Za-z_$][\w$]*)'\)\s*\?\s*\1\s*:/g,
        "hasAtiv('$1') ? (...__a) => callAtiv('$1', ...__a) :"
    );

    if (n > 0) out = ensureImport(out, ['callAtiv']);

    // typeof foreignName !== 'undefined' → hasAtiv
    const ranges2 = opaqueRanges(out);
    const tre = new RegExp(
        `typeof\\s+(${foreign.map((x) => x.replace(/[$]/g, '\\$&')).join('|')})\\s*(!==|===|!=|==)\\s*(?:'undefined'|\"undefined\"|'function'|\"function\")`,
        'g'
    );
    let t;
    let rebuilt = '';
    let ti = 0;
    let typeofHits = 0;
    while ((t = tre.exec(out))) {
        if (inRanges(t.index, ranges2)) continue;
        const op = t[2];
        const lit = t[0].includes('function') ? 'function' : 'undefined';
        const positive = (lit === 'undefined' && (op === '!==' || op === '!='))
            || (lit === 'function' && (op === '===' || op === '=='));
        rebuilt += out.slice(ti, t.index);
        rebuilt += positive ? `hasAtiv('${t[1]}')` : `!hasAtiv('${t[1]}')`;
        ti = t.index + t[0].length;
        typeofHits++;
        tre.lastIndex = ti;
    }
    if (typeofHits) {
        rebuilt += out.slice(ti);
        out = ensureImport(rebuilt, ['callAtiv', 'hasAtiv']);
        n += typeofHits;
    }

    return { out, n };
}

let total = 0;
for (const file of files) {
    const path = join(dir, file);
    const src = readFileSync(path, 'utf8');
    const { out, n } = transform(file, src);
    if (out !== src) {
        writeFileSync(path, out);
        console.log(`${file}: ${n}`);
        total += n;
    } else {
        console.log(`${file}: 0`);
    }
}
console.log(`done. ${total} replacements`);
