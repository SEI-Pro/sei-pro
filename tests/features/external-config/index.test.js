// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { baseItem, setOptionsSEIPro, getOptionsSEIPro } from '@src/features/external-config/index.ts';

// Fake da fachada de storage (delega ao SW na produção); aqui guarda em memória.
function fakeStorage(initial) {
    const store = { dataValues: initial == null ? '' : JSON.stringify(initial) };
    return {
        _store: store,
        getSync: (keys) => Promise.resolve(Object.assign({}, keys, store)),
        setSync: (items) => { Object.assign(store, items); return Promise.resolve(); }
    };
}
function stub(storage) {
    window.SeiPro = {
        core: { storage, runtime: { getManifestExtension: () => ({ short_name: 'SEI Pro PRF' }) } },
        sei: { adapter: { isNewSEI: () => true } }
    };
    return storage;
}

describe('feature external-config — persistência de opções/bases', () => {
    beforeEach(() => { delete window.SeiPro; localStorage.clear(); });

    it('setOptionsSEIPro atualiza opção existente em configGeral', async () => {
        const st = stub(fakeStorage([{ configGeral: [{ name: 'foo', value: false }] }]));
        await setOptionsSEIPro('foo', 'true');
        const saved = JSON.parse(st._store.dataValues);
        expect(saved[0].configGeral[0].value).toBe(true); // 'true' coage p/ boolean
    });

    it('setOptionsSEIPro adiciona opção ausente', async () => {
        const st = stub(fakeStorage([{ configGeral: [] }]));
        await setOptionsSEIPro('nova', 'x');
        expect(JSON.parse(st._store.dataValues)[0].configGeral).toContainEqual({ name: 'nova', value: 'x' });
    });

    it('getOptionsSEIPro insert substitui base do mesmo tipo', async () => {
        const st = stub(fakeStorage([{ baseTipo: 'openai', URL_API: 'velha' }]));
        await getOptionsSEIPro({ type: 'NEW_BASE', mode: 'insert', base: 'openai', alert: false,
            newItem: { baseTipo: 'openai', URL_API: 'nova' } });
        const saved = JSON.parse(st._store.dataValues);
        expect(saved).toHaveLength(1);
        expect(saved[0].URL_API).toBe('nova');
    });

    it('never persists an AI credential in the legacy sync configuration', async () => {
        const st = stub(fakeStorage([]));
        await getOptionsSEIPro({ type: 'NEW_BASE', mode: 'insert', base: 'openai', alert: false,
            newItem: { baseTipo: 'openai', URL_API: 'https://api.openai.com', KEY_USER: 'secret' } });
        expect(JSON.parse(st._store.dataValues)).toEqual([
            { baseTipo: 'openai', URL_API: 'https://api.openai.com' }
        ]);
        expect(localStorage.getItem('configBasePro')).not.toContain('secret');
    });

    it('getOptionsSEIPro remove apaga a base sem reinserir', async () => {
        const st = stub(fakeStorage([{ baseTipo: 'gemini' }, { baseTipo: 'openai' }]));
        await getOptionsSEIPro({ type: 'NEW_BASE', mode: 'remove', base: 'gemini', alert: false, newItem: {} });
        const saved = JSON.parse(st._store.dataValues);
        expect(saved).toEqual([{ baseTipo: 'openai' }]);
    });

    it('ignora payload que não é NEW_BASE', async () => {
        const st = stub(fakeStorage([{ baseTipo: 'x' }]));
        await getOptionsSEIPro({ type: 'OUTRO' });
        expect(JSON.parse(st._store.dataValues)).toHaveLength(1);
    });

    it('builds legacy URL profiles for every new AI provider type', () => {
        const manifest = { short_name: 'SEI Pro PRF' };
        const params = { url: 'https://gateway.example', token: 'secret', base_name: 'Gateway' };
        expect(baseItem('anthropic', params, manifest).baseName).toBe('Anthropic (Claude)');
        expect(baseItem('moonshot', params, manifest).baseTipo).toBe('moonshot');
        expect(baseItem('ollama', params, manifest).baseTipo).toBe('ollama');
        expect(baseItem('openai_compatible', params, manifest)).toMatchObject({
            baseName: 'Gateway',
            baseTipo: 'openai_compatible',
            URL_API: 'https://gateway.example',
            KEY_USER: 'secret'
        });
    });
});
