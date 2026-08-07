/**
 * Install pure SEI HTML parsers on `SeiPro.sei.parse`.
 */
import { seiNamespace } from '../namespace.js';
import { parseListaProcessos } from './lista.js';
import { parseArvore } from './arvore.js';
import { parseDocumento } from './documento.js';

export { parseListaProcessos } from './lista.js';
export { parseArvore } from './arvore.js';
export { parseDocumento } from './documento.js';

export function installParse() {
    const api = {
        lista: parseListaProcessos,
        arvore: parseArvore,
        documento: parseDocumento
    };
    seiNamespace().parse = api;
    return api;
}
