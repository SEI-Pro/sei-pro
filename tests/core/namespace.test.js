import { describe, expect, it, beforeEach } from 'vitest';
import { createNamespace } from '../../src/core/namespace.ts';
import { globalRef } from '../../src/core/global.ts';

describe('SeiPro namespace linkState', () => {
    beforeEach(() => {
        delete globalRef.SeiPro;
        delete globalRef.linkedVar;
    });

    it('keeps SeiPro.state and legacy global in sync on read', () => {
        globalRef.linkedVar = 'initial';
        const root = createNamespace();
        root.linkState('linkedVar');
        expect(root.state.linkedVar).toBe('initial');
    });

    it('keeps SeiPro.state and legacy global in sync on write via state', () => {
        globalRef.linkedVar = 'initial';
        const root = createNamespace();
        root.linkState('linkedVar');
        root.state.linkedVar = 'via-state';
        expect(globalRef.linkedVar).toBe('via-state');
    });

    it('keeps SeiPro.state and legacy global in sync on write via global', () => {
        globalRef.linkedVar = 'initial';
        const root = createNamespace();
        root.linkState('linkedVar');
        globalRef.linkedVar = 'via-global';
        expect(root.state.linkedVar).toBe('via-global');
    });

    it('is idempotent when linking the same name twice', () => {
        globalRef.linkedVar = 'x';
        const root = createNamespace();
        root.linkState('linkedVar');
        root.linkState('linkedVar');
        expect(root.state.linkedVar).toBe('x');
    });
});
