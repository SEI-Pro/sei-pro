/**
 * Installs the full core + sei stack on window.SeiPro with legacy global aliases.
 * Replaces the 12-script core/sei block in manifest content_scripts.
 *
 * DECISÃO ARQUITETURAL — execução em DOIS mundos (intencional).
 * O bundle é injetado pelo manifest em dois contextos:
 *   1. mundo ISOLADO (entradas content_scripts com jQuery/init_*.js): tem chrome.*;
 *      é onde os init scripts bootstrapam e acessam APIs de extensão.
 *   2. mundo MAIN da página (entrada world:"MAIN", document_start): é onde os
 *      arquivos de feature carregados via $.getScript executam — eles precisam do
 *      core (getParamsUrlPro, isNewSEI, verifyConfigValue, getUrlExtension, ...).
 * Sem a cópia no MAIN, o core ficaria só no mundo isolado e o código de feature
 * quebraria com ReferenceError (ver PLANO_MIGRACAO_ARQUITETURA.md).
 *
 * CONSEQUÊNCIA: há DOIS objetos SeiPro independentes, um por mundo. Isso é
 * isolamento por design, não divergência. Estado mutável NÃO cruza mundos
 * (linkState faz ponte só com globais legados DENTRO de um mundo). Qualquer
 * estado que precise ser visto pelos dois mundos deve trafegar por
 * sessionStorage/storage (é o que runtime.js faz com a base da extensão).
 * O install é idempotente (getSeiPro guarda; aliasGlobal só define se ausente) e
 * não toca chrome.* na instalação, então rodar nos dois mundos é seguro.
 */
import { createNamespace } from '../core/namespace.js';
import { createRuntime } from '../core/runtime.js';
import { installUtil } from '../core/util.js';
import { installBootstrap } from '../core/bootstrap.js';
import { installConfig } from '../core/config.js';
import { installValidacao } from '../core/validacao.js';
import { installTexto } from '../core/texto.js';
import { installCor } from '../core/cor.js';
import { installDatas } from '../core/datas.js';
import { installUi } from '../core/ui.js';
import { installMessaging } from '../core/messaging.js';
import { installStorage } from '../core/storage.js';
import { installLogger } from '../core/logger.js';
import { installVersion } from '../sei/version.js';
import { installAdapter } from '../sei/adapter.js';
import { installUrls } from '../sei/urls.js';

export function installCoreStack() {
    createNamespace();
    createRuntime();
    installUtil();
    installBootstrap();
    installConfig();
    installValidacao();
    installTexto();
    installCor();
    installDatas();
    installUi();
    installMessaging();
    installStorage();
    installLogger();
    installVersion();
    installAdapter();
    installUrls();
}

installCoreStack();
