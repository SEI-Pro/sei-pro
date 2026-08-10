// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — pure domain helpers.
 *
 * Prefer SeiPro.core.* (texto, numeros, serial, validacao, cor, datas, options…)
 * for anything already carved out by core-stack.
 */
export function format2DecimalDomain(v) {
    return Number.isNaN((v = +v)) ? '0.00' : v.toFixed(2);
}
