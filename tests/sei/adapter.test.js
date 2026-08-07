import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createNamespace } from '../../src/core/namespace.ts';
import { createRuntime } from '../../src/platform/runtime.ts';
import { installUtil } from '../../src/core/util.ts';
import { installVersion } from '../../src/sei/version.ts';
import { installSelectors } from '../../src/sei/selectors.ts';
import { installAdapter } from '../../src/sei/adapter.ts';
import { globalRef } from '../../src/core/global.ts';

function installSeiStack() {
    createNamespace();
    createRuntime();
    installUtil();
    installVersion();
    installSelectors();
    installAdapter();
}

describe('SeiPro.sei.adapter', () => {
    beforeEach(() => {
        delete globalRef.SeiPro;
        delete globalRef.sessionStorage;
        globalRef.sessionStorage = {
            _data: {},
            getItem(key) { return this._data[key] ?? null; },
            setItem(key, value) { this._data[key] = value; }
        };
    });

    it('pick returns novo when isNewSEI', () => {
        installSeiStack();
        vi.spyOn(globalRef.SeiPro.sei.version, 'resolveVersionFlags').mockReturnValue({
            isNewSEI: true,
            isSEI_5: false,
            version: '4.1.0'
        });
        expect(globalRef.SeiPro.sei.adapter.pick('#infraMenu', '#main-menu')).toBe('#infraMenu');
    });

    it('pick returns legado when not isNewSEI', () => {
        installSeiStack();
        vi.spyOn(globalRef.SeiPro.sei.version, 'resolveVersionFlags').mockReturnValue({
            isNewSEI: false,
            isSEI_5: false,
            version: '3.1.0'
        });
        expect(globalRef.SeiPro.sei.adapter.pick('#infraMenu', '#main-menu')).toBe('#main-menu');
    });

    it('atLeast delegates to version util', () => {
        installSeiStack();
        vi.spyOn(globalRef.SeiPro.sei.version, 'resolveVersionFlags').mockReturnValue({
            isNewSEI: true,
            isSEI_5: true,
            version: '5.0.0'
        });
        expect(globalRef.SeiPro.sei.adapter.atLeast('5')).toBe(true);
        expect(globalRef.SeiPro.sei.adapter.atLeast('6')).toBe(false);
    });
});
