/**
 * Projetos (Gantt) — feature entry (esbuild → dist/js/sei-pro-projetos.js).
 */
import { getSeiPro } from '../../core/global.js';
import { installProjetosStore } from './store.js';
import { installProjetosView } from './view/panel.js';
import { installProjetosLegacyApi } from './legacy-api.js';
import { bootProjetos } from './boot.js';
import * as domain from './domain/index.js';

const ns = getSeiPro().features.projetos || (getSeiPro().features.projetos = {});
ns.domain = domain;
installProjetosStore();
installProjetosLegacyApi();
installProjetosView();
bootProjetos();
