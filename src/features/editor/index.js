import { getSeiPro } from '../../core/global.js';
import { extractTextWithNumbering } from './domain.js';

const root = getSeiPro();
root.features = root.features || {};
root.features.editor = { extractTextWithNumbering };
