// @ts-nocheck — fatia legada isolada; a tipagem entra após a caracterização.
import * as afastamentos from './afastamentos.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const atividadesAfastamentos = defineLegacyFeature({
    id: 'atividades-afastamentos',
    nsKey: 'atividadesAfastamentos',
    modules: [afastamentos]
});
export const installAtividadesAfastamentosFeature = atividadesAfastamentos.install;
