/**
 * Installs the full core + sei stack on window.SeiPro with legacy global aliases.
 * Replaces the 12-script core/sei block in manifest content_scripts.
 */
import { createNamespace } from '../core/namespace.js';
import { createRuntime } from '../core/runtime.js';
import { installUtil } from '../core/util.js';
import { installBootstrap } from '../core/bootstrap.js';
import { installConfig } from '../core/config.js';
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
    installUi();
    installMessaging();
    installStorage();
    installLogger();
    installVersion();
    installAdapter();
    installUrls();
}

installCoreStack();
