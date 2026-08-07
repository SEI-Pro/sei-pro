/**
 * ADR-0008: debt metrics must equal the committed baseline.
 * Rising breaks the build; falling without updating the baseline also breaks.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { measureRatchets } from '../../scripts/measure-ratchets.mjs';

const root = process.cwd();
const baseline = JSON.parse(
    readFileSync(join(root, 'tests/structure/ratchets.baseline.json'), 'utf8')
);

describe('architecture ratchets (ADR-0008)', () => {
    const actual = measureRatchets();

    it('exposes the same metric keys as the baseline', () => {
        expect(Object.keys(actual).sort()).toEqual(Object.keys(baseline).sort());
    });

    for (const key of Object.keys(baseline).sort()) {
        it(`${key} equals baseline (${baseline[key]})`, () => {
            const value = actual[key];
            if (value > baseline[key]) {
                throw new Error(
                    `Ratchet ${key} increased: actual=${value} baseline=${baseline[key]}. ` +
                        'Debt must not grow; fix the regression.'
                );
            }
            if (value < baseline[key]) {
                throw new Error(
                    `Ratchet ${key} decreased: actual=${value} baseline=${baseline[key]}. ` +
                        'Update tests/structure/ratchets.baseline.json in the same commit ' +
                        '(node scripts/measure-ratchets.mjs --write).'
                );
            }
            expect(value).toBe(baseline[key]);
        });
    }
});
