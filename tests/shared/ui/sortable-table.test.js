// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { compareValues, createSortableTable } from '@src/shared/ui/sortable-table.js';

describe('shared/ui/sortable-table — compareValues (puro)', () => {
    it('numérico quando ambos são números', () => {
        expect(compareValues('2', '10')).toBeLessThan(0);
        expect(compareValues('10', '2')).toBeGreaterThan(0);
    });
    it('locale/numeric para strings', () => {
        expect(compareValues('a', 'b')).toBeLessThan(0);
        expect(compareValues('item2', 'item10')).toBeLessThan(0);
    });
});

function mkTable() {
    document.body.innerHTML = `
      <table id="t">
        <thead><tr><th>Nome</th><th>Num</th></tr></thead>
        <tbody>
          <tr><td>banana</td><td>10</td></tr>
          <tr><td>abacaxi</td><td>2</td></tr>
          <tr><td>caju</td><td>30</td></tr>
        </tbody>
      </table>`;
    return document.getElementById('t');
}
const names = (t) => Array.prototype.map.call(t.tBodies[0].rows, (r) => r.cells[0].textContent);

describe('shared/ui/sortable-table — sort/filter (DOM)', () => {
    beforeEach(() => { document.body.innerHTML = ''; localStorage.clear && localStorage.clear(); });

    it('ordena por coluna numérica via api.sort', () => {
        const t = mkTable();
        const api = createSortableTable(t, { headers: { 1: { filter: true } } });
        api.sort(1, 1);
        expect(names(t)).toEqual(['abacaxi', 'banana', 'caju']); // 2,10,30
        api.sort(1, -1);
        expect(names(t)).toEqual(['caju', 'banana', 'abacaxi']);
    });

    it('filtra linhas por coluna', () => {
        const t = mkTable();
        const api = createSortableTable(t, { headers: { 0: { filter: true } } });
        api.filter(0, 'caj');
        expect(api.visibleCount()).toBe(1); // só "caju" (abacaxi contém "ca")
        api.filter(0, '');
        expect(api.visibleCount()).toBe(3);
    });

    it('clique no cabeçalho ordena asc->desc', () => {
        const t = mkTable();
        createSortableTable(t, {});
        const th0 = t.tHead.rows[0].cells[0];
        th0.click();
        expect(names(t)).toEqual(['abacaxi', 'banana', 'caju']);
        th0.click();
        expect(names(t)).toEqual(['caju', 'banana', 'abacaxi']);
    });
});
