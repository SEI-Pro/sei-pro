/**
 * Characterization tests for atividades config-options / domain (Phase 5.2).
 * Cover current behaviour BEFORE moving large files (ADR-0007).
 */
import { describe, expect, it } from 'vitest';
import {
    checkDatesBetweenArray,
    checkDatesLoopArray
} from '../../../src/features/atividades/config-domain.ts';
import {
    selectEntityConfig,
    selectEntityOption,
    hasEntityOption,
    selectUnitConfig,
    selectConfigItem
} from '../../../src/features/atividades/config-queries.ts';
import * as configOptions from '../../../src/features/atividades/config-options.ts';

/** Minimal moment stub compatible with config-domain date checks. */
function makeMoment() {
    const wrap = (value) => {
        const raw = String(value).replace(' ', 'T');
        const date = new Date(raw.includes('T') ? raw : `${raw}T00:00:00`);
        const api = {
            _date: date,
            isBetween(start, end, _unit, boundary = '()') {
                const t = date.getTime();
                const a = start._date.getTime();
                const b = end._date.getTime();
                if (boundary === '[]') return t >= a && t <= b;
                if (boundary === '[)') return t >= a && t < b;
                if (boundary === '(]') return t > a && t <= b;
                return t > a && t < b;
            },
            clone() {
                return wrap(date.toISOString());
            },
            add(n, unit) {
                const d = new Date(date.getTime());
                if (unit === 'days' || unit === 'day') d.setDate(d.getDate() + n);
                else if (unit === 'months' || unit === 'month') d.setMonth(d.getMonth() + n);
                date.setTime(d.getTime());
                return api;
            },
            diff(other) {
                return date.getTime() - other._date.getTime();
            },
            format() {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                const h = String(date.getHours()).padStart(2, '0');
                const mi = String(date.getMinutes()).padStart(2, '0');
                return `${y}-${m}-${d}T${h}:${mi}`;
            }
        };
        return api;
    };
    return wrap;
}

describe('atividades/config-options characterization (phase 5.2)', () => {
    it('exposes the key config-options entry points used by the admin UI', () => {
        const expected = [
            'editConfigOptions',
            'changeConfigOptions',
            'checkDatesLoopArray',
            'checkDatesBetweenArray',
            'configPessoal',
            'saveConfigPersonalUser',
            'saveOptionConfigItem',
            'tableConfigKeyUsers',
            'getTabEntregasPlanos',
            'tempoProporcionalTabEntregasPlanos'
        ];
        for (const name of expected) {
            expect(typeof configOptions[name], name).toBe('function');
        }
    });

    it('config-domain detects a date inside an open range', () => {
        const moment = makeMoment();
        const labels = { id: 'id_user', inicio: 'inicio', fim: 'fim', idreftype: 'id_ref' };
        const rows = [
            {
                id_user: 1,
                id: 2,
                id_ref: 9,
                inicio: '2026-01-01 00:00:00',
                fim: '2026-01-10 00:00:00'
            }
        ];
        expect(
            checkDatesBetweenArray(rows, '2026-01-05', 1, 3, labels, { moment })
        ).toEqual([9]);
        expect(
            checkDatesBetweenArray(rows, '2026-01-15', 1, 3, labels, { moment })
        ).toEqual([]);
    });

    it('config-domain loop finds the first conflicting day in a window', () => {
        const moment = makeMoment();
        const labels = { id: 'id_user', inicio: 'inicio', fim: 'fim', idreftype: 'id_ref' };
        const rows = [
            {
                id_user: 1,
                id: 2,
                id_ref: 11,
                inicio: '2026-02-03 00:00:00',
                fim: '2026-02-05 00:00:00'
            }
        ];
        const hit = checkDatesLoopArray(
            rows,
            '2026-02-01T00:00',
            '2026-02-10T00:00',
            1,
            99,
            labels,
            { moment }
        );
        expect(hit).toEqual([11]);
    });

    it('config-queries pure selectors keep entity/unit lookup semantics', () => {
        const config = {
            entidades: [
                { id_entidade: 7, config: { habilitado: true, limite: 0 } },
                { id_entidade: 8, config: { habilitado: false } }
            ]
        };
        expect(selectEntityConfig(config, 7)).toEqual(config.entidades[0].config);
        expect(selectEntityOption(config, 7, 'limite')).toBe(0);
        expect(hasEntityOption(config, 7, 'limite')).toBe(false);
        expect(selectUnitConfig({ config: { ativo: false } }, 'ativo')).toBe(false);
        expect(selectConfigItem([[{ id: 1 }], [{ id: 2, name: 'b' }]], 'id', 2)).toEqual({
            id: 2,
            name: 'b'
        });
    });
});
