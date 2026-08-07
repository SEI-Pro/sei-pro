// TODO: remover quando call-sites legados de sticknote migrarem para ESM.
import { aliasGlobal } from '../../core/global.js';
import {
    parseSticknoteHomeLabel,
    normalizeSticknoteHomeText,
    parseSticknoteChecklistLine,
    installSticknote
} from './domain.js';

export function installSticknoteLegacyApi() {
    installSticknote();
    aliasGlobal('parseSticknoteHomeLabel', parseSticknoteHomeLabel);
    aliasGlobal('normalizeSticknoteHomeText', normalizeSticknoteHomeText);
    aliasGlobal('parseSticknoteChecklistLine', parseSticknoteChecklistLine);
}
