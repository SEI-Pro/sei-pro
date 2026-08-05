/**
 * Editor context entry — boots editor + legis without init.js getScript.
 * Built as dist/js/sei-pro-editor.js (stable manifest name).
 *
 * Normally WAR-injected into the page MAIN world by editor-loader.js so the
 * bundle can see SEI's CKEDITOR. page-runtime installs first (side effect) so
 * URL_SPRO / config globals exist before editor boot.
 */
import '../features/editor/page-runtime.js';
import '../features/legis/index.js';
import '../features/editor/index.js';
