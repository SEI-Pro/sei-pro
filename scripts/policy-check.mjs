#!/usr/bin/env node
/**
 * CLI: exclusive-closure / typing policy gate (002-ts-zero-legacy).
 * Exit 0 = pass; 1 = fail.
 */
import { assertExclusiveClosure } from './policy/assert-exclusive-closure.mjs';
import { resolveTouchedPaths, TouchedPathsError } from './policy/touched-paths.mjs';

let paths;
try {
    paths = resolveTouchedPaths();
} catch (error) {
    if (error instanceof TouchedPathsError) {
        console.error(`[policy] FAIL P0: ${error.message}`);
        process.exit(1);
    }
    throw error;
}
const result = assertExclusiveClosure({ paths });

if (result.skipped?.length && result.ok) {
    console.log(`[policy] scope=${result.scope} — skipped ${result.skipped.join(', ')}`);
}
if (result.note) console.log(`[policy] ${result.note}`);

if (!result.ok) {
    console.error(`[policy] FAIL (${result.failures.length}) scope=${result.scope}`);
    for (const f of result.failures) {
        console.error(`  [${f.code}] ${f.message}`);
    }
    process.exit(1);
}

console.log(
    `[policy] PASS scope=${result.scope} productFiles=${result.productPaths?.length ?? 0}` +
        (result.fecho ? ` fechoFeatures=${result.fecho.featureIds.length}` : '')
);
process.exit(0);
