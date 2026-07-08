/**
 * Composição da stack core + sei + platform sobre window.SeiPro.
 *
 * Reusável por todas as entries (src/entries/*). Cada entry chama
 * installCoreStack() e em seguida instala as features/bridges daquele contexto.
 * O install é idempotente (getSeiPro guarda; aliasGlobal só define se ausente).
 *
 * Refundação isolated-first: roda SOMENTE no mundo isolado do content script
 * (tem DOM + chrome.*). Não há mais a cópia no mundo MAIN.
 */
import { createNamespace } from './namespace.js';
import { createRuntime } from '../platform/runtime.js';
import { installUtil } from './util.js';
import { installAsync } from './async.js';
import { installBootstrap } from './bootstrap.js';
import { installConfig } from './config.js';
import { installValidacao } from './validacao.js';
import { installTexto } from './texto.js';
import { installCor } from './cor.js';
import { installDatas } from './datas.js';
import { installFeriados } from './feriados.js';
import { installNumeros } from './numeros.js';
import { installSerial } from './serial.js';
import { installPrazos } from './prazos.js';
import { installQuickFilter } from './quickfilter.js';
import { installQuickFilterDom } from './quickfilter-dom.js';
import { installSticknote } from './sticknote.js';
import { installDocsLote } from './docslote.js';
import { installUi } from './ui.js';
import { installMessaging } from '../platform/messaging.js';
import { installStorage } from '../platform/storage.js';
import { installNet } from '../platform/net.js';
import { installLogger } from '../platform/logger.js';
import { installReport } from '../platform/report.js';
import { installWebstore } from '../platform/webstore.js';
import { installOptions } from './options.js';
import { installCookies } from './cookies.js';
import { installHelpers } from './helpers.js';
import { installVersion } from '../sei/version.js';
import { installAdapter } from '../sei/adapter.js';
import { installUrls } from '../sei/urls.js';
import { installTooltip } from '../sei/tooltip.js';
import { installPrazoPreview } from '../shared/ui/prazo-preview.js';
import { installPrazoPreviewLegacyApi } from '../shared/ui/prazo-preview-legacy-api.js';
import { installLegacyInlineBridge } from '../platform/legacy-inline-bridge.js';

export function installCoreStack() {
    createNamespace();
    createRuntime();
    installUtil();
    installAsync();
    installBootstrap();
    installConfig();
    installValidacao();
    installTexto();
    installCor();
    installDatas();
    installFeriados();
    installNumeros();
    installSerial();
    installWebstore();
    installOptions();
    installCookies();
    installHelpers();
    installPrazos();
    installQuickFilter();
    installQuickFilterDom();
    installSticknote();
    installDocsLote();
    installUi();
    installMessaging();
    installStorage();
    installNet();
    installLogger();
    installReport();
    installVersion();
    installAdapter();
    installUrls();
    installTooltip();
    installPrazoPreview();    // view compartilhada de etiqueta/preview de prazo
    installPrazoPreviewLegacyApi(); // aliases getDatesPreview/… usados pelo legado
    installLegacyInlineBridge(); // ponte estrita p/ onclick="nossaFuncao(...)" do legado ainda não migrado
}
