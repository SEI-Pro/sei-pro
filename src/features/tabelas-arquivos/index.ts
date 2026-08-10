import * as tables from './tables-filesystem.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const tabelasArquivos = defineLegacyFeature({ id: 'tabelas-arquivos', nsKey: 'tabelasArquivos', modules: [tables] });
export const installTabelasArquivos = tabelasArquivos.install;
