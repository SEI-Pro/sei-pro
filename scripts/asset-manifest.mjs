/**
 * Manifesto de assets estáticos — fonte única do mapeamento fonte → dist.
 *
 * ADR-0011: até 2026-08-07, 137 arquivos (3,6 MB) existiam APENAS em dist/ commitado,
 * sem nenhuma fonte no repositório — incluindo `sei-pro.css` (120 KB). Apagar dist/
 * os perdia de forma irrecuperável, e `npm run build` não os regenerava.
 *
 * Este arquivo é consumido por:
 *  - `scripts/build.mjs` / `scripts/dist-pipeline.mjs` → copia fonte → dist a cada build
 *  - `scripts/rescue-dist-assets.mjs` → movimento único de resgate (git mv)
 *  - `tests/structure/dist-reproducible.test.js` → verifica fontes e saídas
 *
 * Regra: asset novo entra aqui com fonte em `vendor/`, `src/css/` ou `assets/`.
 * Nunca adicione arquivo diretamente em dist/. Saídas geradas (bundles, legados,
 * CSS de feature) vivem em `scripts/dist-pipeline.mjs`.
 *
 * `vendor/` = terceiros (com VERSION.txt). `src/css/` = folhas de estilo nossas.
 * `assets/` = binários e dados nossos (ícones, config).
 */

/** Bibliotecas de terceiros: vendor/<lib>/ → dist/js/lib/, dist/css/ */
export const VENDOR_FILES = [
    // jQuery e plugins
    { src: 'vendor/jquery/jquery-3.7.1.min.js', out: 'dist/js/lib/jquery-3.7.1.min.js' },
    { src: 'vendor/jquery-ui/jquery-ui.min.js', out: 'dist/js/lib/jquery-ui.min.js' },
    { src: 'vendor/jquery-ui/jquery-ui.css', out: 'dist/css/jquery-ui.css' },
    { src: 'vendor/jquery-ui/images/ui-icons_444444_256x240.png', out: 'dist/css/images/ui-icons_444444_256x240.png' },
    { src: 'vendor/jquery-ui/images/ui-icons_555555_256x240.png', out: 'dist/css/images/ui-icons_555555_256x240.png' },
    { src: 'vendor/jquery-ui/images/ui-icons_777620_256x240.png', out: 'dist/css/images/ui-icons_777620_256x240.png' },
    { src: 'vendor/jquery-ui/images/ui-icons_777777_256x240.png', out: 'dist/css/images/ui-icons_777777_256x240.png' },
    { src: 'vendor/jquery-ui/images/ui-icons_cc0000_256x240.png', out: 'dist/css/images/ui-icons_cc0000_256x240.png' },
    { src: 'vendor/jquery-ui/images/ui-icons_ffffff_256x240.png', out: 'dist/css/images/ui-icons_ffffff_256x240.png' },
    { src: 'vendor/jquery-table-edit/jquery-table-edit.min.js', out: 'dist/js/lib/jquery-table-edit.min.js' },
    { src: 'vendor/jquery-visible/jquery-visible.min.js', out: 'dist/js/lib/jquery-visible.min.js' },
    { src: 'vendor/jquery-maskedinput/jquery.maskedinput.min.js', out: 'dist/js/lib/jquery.maskedinput.min.js' },
    { src: 'vendor/jquery-tablesorter/jquery.tablesorter.combined.min.js', out: 'dist/js/lib/jquery.tablesorter.combined.min.js' },
    { src: 'vendor/jquery-tagsinput/jquery.tagsinput-revisited.js', out: 'dist/js/lib/jquery.tagsinput-revisited.js' },
    { src: 'vendor/jquery-toolbar/jquery.toolbar.min.js', out: 'dist/js/lib/jquery.toolbar.min.js' },
    { src: 'vendor/jquery-toolbar/jquery.toolbar.css', out: 'dist/css/jquery.toolbar.css' },
    { src: 'vendor/chosen/chosen.jquery.min.js', out: 'dist/js/lib/chosen.jquery.min.js' },
    { src: 'vendor/chosen/chosen.min.css', out: 'dist/css/chosen.min.css' },
    // modalLink: terceiro COM PATCH LOCAL (namespace isolado p/ não colidir com
    // jQuery UI dialog). Ver vendor/modallink/VERSION.txt antes de atualizar.
    { src: 'vendor/modallink/modalLink.js', out: 'dist/js/lib/modalLink.js' },

    // CKEditor 4 (roda no mundo MAIN — pertence à página do SEI)
    { src: 'vendor/ckeditor/ckeditor.js', out: 'dist/js/lib/ckeditor/ckeditor.js' },
    { src: 'vendor/ckeditor/tableselection.js', out: 'dist/js/lib/ckeditor/tableselection.js' },
    { src: 'vendor/ckeditor/tableselection.plugin.css', out: 'dist/js/lib/ckeditor/tableselection.css' },
    // Variante carregada como CSS de content script (conteúdo difere da do plugin).
    { src: 'vendor/ckeditor/tableselection.content.css', out: 'dist/css/tableselection.css' },

    // Datas
    { src: 'vendor/moment/moment.min.js', out: 'dist/js/lib/moment.min.js' },
    { src: 'vendor/moment/moment-duration-format.min.js', out: 'dist/js/lib/moment-duration-format.min.js' },
    { src: 'vendor/moment/moment-weekday-calc.js', out: 'dist/js/lib/moment-weekday-calc.js' },

    // Gráficos e board
    { src: 'vendor/chart/chart.min.js', out: 'dist/js/lib/chart.min.js' },
    { src: 'vendor/chart/chart.min.css', out: 'dist/css/chart.min.css' },
    { src: 'vendor/jkanban/jkanban.min.js', out: 'dist/js/lib/jkanban.min.js' },
    { src: 'vendor/jkanban/jkanban.min.css', out: 'dist/css/jkanban.min.css' },
    { src: 'vendor/frappe-gantt/frappe-gantt.umd.js', out: 'dist/js/lib/frappe-gantt.js' },
    { src: 'vendor/frappe-gantt/frappe-gantt.css', out: 'dist/css/frappe-gantt.css' },

    // Dados, arquivos e texto
    { src: 'vendor/jmespath/jmespath.min.js', out: 'dist/js/lib/jmespath.min.js' },
    { src: 'vendor/jszip/jszip.min.js', out: 'dist/js/lib/jszip.min.js' },
    { src: 'vendor/jszip/jszip-utils.min.js', out: 'dist/js/lib/jszip-utils.min.js' },
    { src: 'vendor/papaparse/papaparse.js', out: 'dist/js/lib/papaparse.js' },
    { src: 'vendor/jschardet/jschardet.min.js', out: 'dist/js/lib/jschardet.min.js' },
    { src: 'vendor/diff2html/diff2html.min.js', out: 'dist/js/lib/diff2html.min.js' },
    { src: 'vendor/mammoth/mammoth.browser.min.js', out: 'dist/js/lib/mammoth.browser.min.js' },
    { src: 'vendor/qrcode/qrcode.min.js', out: 'dist/js/lib/qrcode.min.js' },

    // Segurança e diversos
    { src: 'vendor/dompurify/purify.min.js', out: 'dist/js/lib/purify.min.js' },
    { src: 'vendor/crypto-js/crypto-js.min.js', out: 'dist/js/lib/crypto-js.min.js' },
    { src: 'vendor/favico/favico-0.3.10.min.js', out: 'dist/js/lib/favico-0.3.10.min.js' },

    // Font Awesome Pro (subset licenciado: só as famílias e glifos usados)
    { src: 'vendor/fontawesome/fontawesome.pro.min.css', out: 'dist/css/fontawesome.pro.min.css' }
];

/** Folhas de estilo NOSSAS. `sei-pro.css` deve ser fatiada por feature (ADR-0007). */
export const OWN_CSS = [
    // TODO(ADR-0007): 120 KB de estilos de todas as features num arquivo. Fatiar em
    // src/features/<x>/style.css conforme cada feature migrar; remover daqui ao esvaziar.
    { src: 'src/css/sei-pro.css', out: 'dist/css/sei-pro.css' },
    { src: 'src/css/sei-slim.css', out: 'dist/css/sei-slim.css' }
];

/** Dados estáticos nossos. */
export const DATA_FILES = [
    { src: 'assets/config_hosts.json', out: 'dist/config_hosts.json' }
];

/** Árvores copiadas recursivamente (muitos arquivos, estrutura preservada). */
export const ASSET_DIRS = [
    { src: 'assets/icons', out: 'dist/icons' },
    { src: 'vendor/fontawesome/webfonts', out: 'dist/webfonts/pro' }
];

/** Todo par explícito fonte → dist (não inclui ASSET_DIRS). */
export const ALL_FILE_PAIRS = [...VENDOR_FILES, ...OWN_CSS, ...DATA_FILES];
