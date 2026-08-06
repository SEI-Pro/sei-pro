#!/usr/bin/env node
/**
 * Codemod: replace pure infraTooltipMostrar/Ocultar inline handlers in
 * src/features/atividades/*.js with data-tip="…".
 *
 * Converts pure `infraTooltipMostrar(oneArg)` + `infraTooltipOcultar` pairs.
 *
 * Leaves alone (fix manually / follow-up):
 *  - `_infraTooltipMostrar` / other mouseover functions
 *  - `infraTooltipMostrar` with multiple arguments
 *  - orphan `onmouseout` / empty `onmouseover=""` / select-all `onmouseenter`
 *
 * Handles:
 *  - either attribute order
 *  - \' escapes inside JS string builders
 *  - unicode escapes in tip text
 *  - dynamic concatenations: \'LIT ' + expr + '\'
 *  - jQuery .attr('onmouseover', …) / attr object keys
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/features/atividades/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));

/** Advance index past a \'…\' or '…' string starting at i. */
function skipString(src, i) {
    if (src.startsWith("\\'", i)) {
        i += 2;
        while (i < src.length) {
            if (src.startsWith("\\'", i)) return i + 2;
            i++;
        }
        return src.length;
    }
    if (src[i] === "'") {
        i++;
        while (i < src.length) {
            if (src[i] === '\\') {
                i += 2;
                continue;
            }
            if (src[i] === "'") return i + 1;
            i++;
        }
        return src.length;
    }
    if (src[i] === '"') {
        i++;
        while (i < src.length) {
            if (src[i] === '\\') {
                i += 2;
                continue;
            }
            if (src[i] === '"') return i + 1;
            i++;
        }
        return src.length;
    }
    return i;
}

function findMatchingParen(src, openIdx) {
    if (src[openIdx] !== '(') return -1;
    let depth = 0;
    let i = openIdx;
    while (i < src.length) {
        if (src.startsWith("\\'", i) || src[i] === "'" || src[i] === '"') {
            i = skipString(src, i);
            continue;
        }
        if (src[i] === '(') depth++;
        else if (src[i] === ')') {
            depth--;
            if (depth === 0) return i;
        }
        i++;
    }
    return -1;
}

function hasMultipleArgs(tipExpr) {
    let i = 0;
    let depth = 0;
    while (i < tipExpr.length) {
        if (tipExpr.startsWith("\\'", i) || tipExpr[i] === "'" || tipExpr[i] === '"') {
            i = skipString(tipExpr, i);
            continue;
        }
        if (tipExpr[i] === '(') depth++;
        else if (tipExpr[i] === ')') depth--;
        else if (tipExpr[i] === ',' && depth === 0) return true;
        i++;
    }
    return false;
}

function tipExprToDataTip(tipExpr) {
    const t = tipExpr.trim();
    if (t.startsWith("\\'") && t.endsWith("\\'")) {
        return `data-tip="${t.slice(2, -2)}"`;
    }
    if (t.startsWith("'") && t.endsWith("'")) {
        return `data-tip="${t.slice(1, -1)}"`;
    }
    return `data-tip="' + (${t}) + '"`;
}

function transformDynamicPairs(src) {
    let out = '';
    let i = 0;
    let n = 0;
    const OVER = 'onmouseover="return infraTooltipMostrar(';

    while (i < src.length) {
        const a = src.indexOf(OVER, i);
        const b = src.indexOf('onmouseout="return infraTooltipOcultar()', i);

        if (a === -1 && b === -1) {
            out += src.slice(i);
            break;
        }

        let mode = null;
        let start = -1;

        if (b !== -1 && (a === -1 || b < a)) {
            const m = src.slice(b).match(/^onmouseout="return\s+infraTooltipOcultar\(\)\s*;?"\s+onmouseover="return\s+infraTooltipMostrar\(/);
            if (m) {
                mode = 'out-first';
                start = b;
            } else {
                out += src.slice(i, b + 1);
                i = b + 1;
                continue;
            }
        } else {
            mode = 'over-first';
            start = a;
        }

        if (mode === 'over-first') {
            const callOpen = start + OVER.length - 1;
            const callEnd = findMatchingParen(src, callOpen);
            if (callEnd < 0) {
                out += src.slice(i, start + 1);
                i = start + 1;
                continue;
            }
            const tipExpr = src.slice(callOpen + 1, callEnd);
            let j = callEnd + 1;
            if (src[j] === ';') j++;
            if (src[j] !== '"') {
                out += src.slice(i, start + 1);
                i = start + 1;
                continue;
            }
            j++;
            const ws = src.slice(j).match(/^\s*/);
            j += ws ? ws[0].length : 0;
            const outMatch = src.slice(j).match(/^onmouseout="return\s+infraTooltipOcultar\(\)\s*;?"/);

            if (hasMultipleArgs(tipExpr)) {
                const end = outMatch ? j + outMatch[0].length : j;
                out += src.slice(i, end);
                i = end;
                continue;
            }

            n += 1;
            out += src.slice(i, start) + tipExprToDataTip(tipExpr);
            i = outMatch ? j + outMatch[0].length : j;
            continue;
        }

        // out-first
        const outMatch = src.slice(start).match(/^onmouseout="return\s+infraTooltipOcultar\(\)\s*;?"\s+/);
        if (!outMatch) {
            out += src.slice(i, start + 1);
            i = start + 1;
            continue;
        }
        const overStart = start + outMatch[0].length;
        if (!src.startsWith(OVER, overStart)) {
            out += src.slice(i, start + 1);
            i = start + 1;
            continue;
        }
        const callOpen = overStart + OVER.length - 1;
        const callEnd = findMatchingParen(src, callOpen);
        if (callEnd < 0) {
            out += src.slice(i, start + 1);
            i = start + 1;
            continue;
        }
        const tipExpr = src.slice(callOpen + 1, callEnd);
        let j = callEnd + 1;
        if (src[j] === ';') j++;
        if (src[j] !== '"') {
            out += src.slice(i, start + 1);
            i = start + 1;
            continue;
        }
        j++;
        if (hasMultipleArgs(tipExpr)) {
            out += src.slice(i, j);
            i = j;
            continue;
        }
        n += 1;
        out += src.slice(i, start) + tipExprToDataTip(tipExpr);
        i = j;
    }

    return { out, n };
}

function transform(src) {
    let total = 0;
    let { out, n } = transformDynamicPairs(src);
    total += n;

    out = out.replace(
        /(['"])onmouseover\1\s*:\s*(['"])return\s+infraTooltipMostrar\(\\'([^'\\]*)\\'\)\s*;?\s*\2/g,
        (_m, _q1, _q2, text) => {
            total += 1;
            return `'data-tip': '${text}'`;
        }
    );

    out = out.replace(
        /\.attr\(\s*(['"])onmouseover\1\s*,\s*(['"])return\s+infraTooltipMostrar\(\\'([^'\\]*)\\'\)\s*;?\s*\2\s*\)/g,
        (_m, _q1, _q2, text) => {
            total += 1;
            return `.attr('data-tip', '${text}')`;
        }
    );

    return { out, n: total };
}

// Restore from git first if previous partial run left mixed state — re-run is mostly idempotent
// on already-converted data-tip (no onmouseover left to match).

let grand = 0;
for (const file of files) {
    const path = join(dir, file);
    const src = readFileSync(path, 'utf8');
    const { out, n } = transform(src);
    if (out !== src) {
        writeFileSync(path, out);
        console.log(`${file}: ${n} replacement(s)`);
        grand += n;
    }
}
console.log(`Total: ${grand}`);
