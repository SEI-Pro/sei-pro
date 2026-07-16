import { aliasGlobal } from '../../core/global.js';
import {
    extractGroupTableTooltipToArray,
    getTagName
} from './domain.js';

// Ponte temporária: sei-pro.js continua chamando os dois nomes globais.
aliasGlobal('extractGroupTableTooltipToArray', extractGroupTableTooltipToArray);
aliasGlobal('getTagName', getTagName);