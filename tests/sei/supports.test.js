import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createNamespace } from '../../src/core/namespace.ts';
import { createRuntime } from '../../src/platform/runtime.ts';
import { installUtil } from '../../src/core/util.ts';
import { installVersion } from '../../src/sei/version.ts';
import { installSupports } from '../../src/sei/supports.ts';
import { globalRef } from '../../src/core/global.ts';

describe('sei.supports', () => {
    beforeEach(() => {
        delete globalRef.SeiPro;
        globalRef.sessionStorage = {
            _data: {},
            getItem(key) {
                return this._data[key] ?? null;
            },
            setItem(key, value) {
                this._data[key] = value;
            }
        };
        createNamespace();
        createRuntime();
        installUtil();
        installVersion();
        installSupports();
    });

    it('maps version flags to named capabilities', () => {
        vi.spyOn(globalRef.SeiPro.sei.version, 'resolveVersionFlags').mockReturnValue({
            isNewSEI: true,
            isSEI_5: true,
            version: '5.0.0'
        });
        expect(globalRef.SeiPro.sei.supports.sidebarLayout()).toBe(true);
        expect(globalRef.SeiPro.sei.supports.sei5Editor()).toBe(true);
        expect(globalRef.SeiPro.sei.supports.processCommandsV410()).toBe(true);
        expect(globalRef.SeiPro.sei.supports.modernCheckbox()).toBe(true);
    });

    it('is false on legacy SEI', () => {
        vi.spyOn(globalRef.SeiPro.sei.version, 'resolveVersionFlags').mockReturnValue({
            isNewSEI: false,
            isSEI_5: false,
            version: '3.1.0'
        });
        expect(globalRef.SeiPro.sei.supports.sidebarLayout()).toBe(false);
        expect(globalRef.SeiPro.sei.supports.processCommandsV410()).toBe(false);
        expect(globalRef.SeiPro.sei.supports.modernArvoreAssets()).toBe(false);
    });
});
