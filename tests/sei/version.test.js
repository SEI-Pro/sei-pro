import { describe, expect, it } from 'vitest';
import { loadSeiVersion } from '../helpers/load-seipro.js';

describe('SEI version detection', () => {
    it('detects legacy SEI from DOM', () => {
        const { SeiPro } = loadSeiVersion({ isNewSEI: false });
        expect(SeiPro.sei.version.detectNewSEIFromDom()).toBe(false);
    });

    it('detects SEI 4 sidebar layout', () => {
        const { SeiPro } = loadSeiVersion({ isNewSEI: true });
        expect(SeiPro.sei.version.detectNewSEIFromDom()).toBe(true);
    });

    it('flags SEI 5 when version is at least 5', () => {
        const { SeiPro } = loadSeiVersion({ isNewSEI: true, version: '5.0.0' });
        expect(SeiPro.sei.version.isSEI5(true, '5.0.0')).toBe(true);
        expect(SeiPro.sei.version.isSEI5(true, '4.9.9')).toBe(false);
        expect(SeiPro.sei.version.isSEI5(false, '5.0.0')).toBe(false);
    });

    it('resolves combined flags from session and DOM', () => {
        const { SeiPro } = loadSeiVersion({ isNewSEI: true, version: '5.1.2' });
        const flags = SeiPro.sei.version.resolveVersionFlags();
        expect(flags.isNewSEI).toBe(true);
        expect(flags.isSEI_5).toBe(true);
        expect(flags.version).toBe('5.1.2');
    });

    it('compares minimum versions with isAtLeast', () => {
        const { SeiPro } = loadSeiVersion();
        expect(SeiPro.sei.version.isAtLeast('4.1.0', '4.1.0')).toBe(true);
        expect(SeiPro.sei.version.isAtLeast('4.0.9', '4.1.0')).toBe(false);
        expect(SeiPro.sei.version.isAtLeast('5.0.0', '5')).toBe(true);
    });
});
