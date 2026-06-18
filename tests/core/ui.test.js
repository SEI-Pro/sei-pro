import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = join(rootDir, 'dist/js/core-stack.bundle.js');

// Build a sandbox, run the bundled core stack in it, and return a handle to the
// installed SeiPro plus the captured body classes. Exercises the real artifact.
function setup({ storage = {}, parentNewSEI = false, hasAreaTelaE = false } = {}) {
    const classes = new Set();
    const headChildren = [];
    let repareCalls = 0;

    const body = {
        classList: { add: (c) => classes.add(c) }
    };
    const document = {
        body,
        head: { appendChild: (n) => headChildren.push(n) },
        getElementById: (id) =>
            id === 'divInfraAreaTelaE' ? (hasAreaTelaE ? {} : null) : null,
        createElement: () => ({ appendChild() {}, set type(_v) {} }),
        createTextNode: (t) => ({ text: t })
    };

    const sandbox = {
        console,
        localStorage: {
            getItem: (k) => (k in storage ? storage[k] : null),
            setItem() {}
        },
        document,
        parent: { isNewSEI: parentNewSEI },
        initRepareBgTableColor: () => { repareCalls += 1; }
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;

    vm.runInNewContext(readFileSync(BUNDLE, 'utf8'), sandbox, { filename: BUNDLE });

    return {
        loadStyleDesign: sandbox.SeiPro.core.ui.loadStyleDesign,
        classes,
        headChildren,
        repareCalls: () => repareCalls
    };
}

describe('loadStyleDesign — per-page class contract (regression for the consolidated helper)', () => {
    it('does nothing extra when slim mode is off', () => {
        const t = setup({ storage: {} });
        t.loadStyleDesign(undefined, 'arvore', { checkParentNewSEI: true });
        expect([...t.classes]).toEqual([]);
    });

    it('init_arvore: seiSlim + seiSlim_arvore + newSEI from parent.isNewSEI', () => {
        const t = setup({ storage: { seiSlim: '1' }, parentNewSEI: true });
        t.loadStyleDesign(undefined, 'arvore', { checkParentNewSEI: true });
        expect([...t.classes].sort()).toEqual(['newSEI', 'seiSlim', 'seiSlim_arvore']);
    });

    it('init_all: seiSlim_parent + seiSlim_view (divInfraAreaTelaE absent)', () => {
        const t = setup({ storage: { seiSlim: '1' } });
        t.loadStyleDesign(undefined, undefined, { parent: true, autoView: true });
        expect([...t.classes].sort()).toEqual(['seiSlim', 'seiSlim_parent', 'seiSlim_view']);
    });

    it('init_all: omits seiSlim_view when divInfraAreaTelaE is present', () => {
        const t = setup({ storage: { seiSlim: '1' }, hasAreaTelaE: true });
        t.loadStyleDesign(undefined, undefined, { parent: true, autoView: true });
        expect(t.classes.has('seiSlim_view')).toBe(false);
        expect(t.classes.has('seiSlim_parent')).toBe(true);
    });

    it('init_visualizacao: seiSlim_view + viewer extras (seiBtnRight, seiIconLabel)', () => {
        const t = setup({ storage: { seiSlim: '1', seiBtnRight: '1', iconLabel: '1' } });
        t.loadStyleDesign(undefined, 'view', { viewerExtras: true });
        expect([...t.classes].sort()).toEqual([
            'seiBtnRight', 'seiIconLabel', 'seiSlim', 'seiSlim_view'
        ]);
    });

    it('init_visualizacao_html: seiSlim_html + dark-mode extras (CSS injected + initRepareBgTableColor)', () => {
        const t = setup({ storage: { seiSlim: '1', darkModePro: '1' } });
        t.loadStyleDesign(undefined, 'html', { htmlExtras: true });
        expect([...t.classes].sort()).toEqual(['dark-mode', 'seiSlim', 'seiSlim_html']);
        expect(t.headChildren.length).toBe(1); // extra <style> appended
        expect(t.repareCalls()).toBe(1);
    });

    it('htmlExtras are skipped when dark mode is off', () => {
        const t = setup({ storage: { seiSlim: '1' } });
        t.loadStyleDesign(undefined, 'html', { htmlExtras: true });
        expect(t.classes.has('dark-mode')).toBe(false);
        expect(t.headChildren.length).toBe(0);
        expect(t.repareCalls()).toBe(0);
    });
});
