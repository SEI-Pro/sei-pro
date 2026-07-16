import { describe, expect, it } from 'vitest';
import { getMonitoradoToggleAction, isMonitoradoToggle } from '@src/features/monitorados/view.js';

const target = (attrs) => ({
    getAttribute: (name) => attrs[name] ?? null,
    matches: (selector) => selector === '[data-act="monitorado-toggle"]'
        && attrs['data-act'] === 'monitorado-toggle'
});

describe('monitorados/view', () => {
    it('converte o markup do toggle em ação de add/remove', () => {
        expect(getMonitoradoToggleAction(target({
            'data-id_procedimento': '42', 'data-mode': 'remove'
        }))).toEqual({ id_procedimento: '42', mode: 'remove' });
        expect(getMonitoradoToggleAction(target({
            'data-id_procedimento': '43', 'data-mode': 'add'
        }))).toEqual({ id_procedimento: '43', mode: 'add' });
    });

    it('rejeita alvo sem id ou modo desconhecido e reconhece apenas o data-act da estrela', () => {
        expect(getMonitoradoToggleAction(target({ 'data-mode': 'add' }))).toBeNull();
        expect(getMonitoradoToggleAction(target({ 'data-id_procedimento': '1', 'data-mode': 'other' }))).toBeNull();
        expect(isMonitoradoToggle(target({ 'data-act': 'monitorado-toggle' }))).toBe(true);
        expect(isMonitoradoToggle(target({ 'data-act': 'other' }))).toBe(false);
    });
});