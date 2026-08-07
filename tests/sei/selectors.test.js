import { describe, expect, it, beforeEach } from 'vitest';
import { createNamespace } from '../../src/core/namespace.ts';
import { createRuntime } from '../../src/platform/runtime.ts';
import { installUtil } from '../../src/core/util.ts';
import { installVersion } from '../../src/sei/version.ts';
import { installSelectors } from '../../src/sei/selectors.ts';
import { installAdapter } from '../../src/sei/adapter.ts';
import { resolveSelectors, INFO_PANEL, MAIN_MENU } from '../../src/sei/selectors.ts';
import { globalRef } from '../../src/core/global.ts';

describe('sei.selectors', () => {
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
    });

    it('exposes intentional literals (not version-resolved yet)', () => {
        expect(INFO_PANEL.novo).toBe('#divArvoreInformacao');
        expect(INFO_PANEL.legado).toBe('#divInformacao');
        expect(MAIN_MENU.novo).toBe('#infraMenu');
    });

    it('resolveSelectors composes version variants without string literals in adapter', () => {
        const isAtLeast = (v, t) => String(v).localeCompare(String(t), undefined, { numeric: true }) >= 0;
        const novo410 = resolveSelectors(true, '4.1.0', isAtLeast);
        expect(novo410.divComandos).toBe('#divBotoesControleProcessos');
        expect(novo410.ifrVisualizacao_).toBe('ifrConteudoVisualizacao');
        expect(novo410.mainMenu).toBe('#infraMenu');

        const legado = resolveSelectors(false, '3.1.0', isAtLeast);
        expect(legado.divComandos).toBe('#divComandos');
        expect(legado.mainMenu).toBe('#main-menu');
        expect(legado.frmEditor).toBe('#frmEditor');

        const sei5 = resolveSelectors(true, '5.0.0', isAtLeast);
        expect(sei5.frmEditor).toBe('.infra-editor__editor-completo');
    });

    it('installSelectors mounts getSeiPro().sei.selectors', () => {
        createNamespace();
        createRuntime();
        installUtil();
        installVersion();
        installSelectors();
        installAdapter();
        expect(typeof globalRef.SeiPro.sei.selectors.resolve).toBe('function');
        expect(typeof globalRef.SeiPro.sei.selectors.current).toBe('function');
        expect(globalRef.SeiPro.sei.adapter.selectors(true, '5.0.0').mainMenu).toBe('#infraMenu');
    });
});
