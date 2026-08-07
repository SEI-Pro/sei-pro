/**
 * Raiz de composição da capacidade transversal SEI FUNCTIONS — ADR-0002/0005.
 *
 * Esta é a última ponte ampla antes da dissolução por capacidade. O bundle
 * mantém o nome legado porque vários contextos ainda o carregam diretamente;
 * o lifecycle, porém, já não é disparado por import da feature.
 */
import { installSeiFunctionsFeature } from '../features/sei-functions/index.js';

installSeiFunctionsFeature();
