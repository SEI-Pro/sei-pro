import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { getPageCkeditor, bindCkeditorGlobal } from '../../../src/features/editor/ckeditor-access.js';

describe('ckeditor-access', () => {
    beforeEach(() => {
        delete globalThis.CKEDITOR;
    });

    afterEach(() => {
        delete globalThis.CKEDITOR;
    });

    it('returns globalThis.CKEDITOR when already bound', () => {
        const fake = { dialog: {}, instances: {} };
        globalThis.CKEDITOR = fake;
        expect(getPageCkeditor()).toBe(fake);
    });

    it('bindCkeditorGlobal assigns globalThis.CKEDITOR', () => {
        const fake = { dialog: {}, instances: {} };
        bindCkeditorGlobal(fake);
        expect(globalThis.CKEDITOR).toBe(fake);
    });

    it('returns null when CKEDITOR is unavailable', () => {
        expect(getPageCkeditor()).toBeNull();
    });
});
