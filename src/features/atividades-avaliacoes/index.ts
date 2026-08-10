// @ts-nocheck — fatia legada isolada; a tipagem entra após a caracterização.
import * as ratings from './ratings.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const atividadesAvaliacoes = defineLegacyFeature({
    id: 'atividades-avaliacoes',
    nsKey: 'atividadesAvaliacoes',
    modules: [ratings]
});
export const installAtividadesAvaliacoesFeature = atividadesAvaliacoes.install;
