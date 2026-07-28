/**
 * Sei Functions Pro — pure domain helpers still owned here.
 *
 * Prefer SeiPro.core.* (texto, numeros, serial, validacao, cor, datas, options…)
 * for anything already carved out by core-stack. This module is the extension
 * point for future extractions from body.js.
 */
export function format2DecimalDomain(v) {
    return Number.isNaN((v = +v)) ? '0.00' : v.toFixed(2);
}
