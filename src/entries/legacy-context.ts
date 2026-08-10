/**
 * Raiz de composição do legado transversal.
 *
 * O antigo `sei-functions-pro.js` era um barrel de clusters sem fronteira.
 * Agora esta entry apenas orquestra capabilities nomeadas; cada cluster tem
 * módulo, descritor e API próprios. A entry é o único lugar autorizado a
 * instalar o conjunto amplo exigido pelos init*.js ainda não migrados.
 */
import { installSeiRuntime, startSeiRuntime } from '../shared/sei-runtime/install.js';
import { createLogger } from '../platform/logger.js';
import { runInstallersSafely, type NamedInstaller } from '../app/installers.js';
import { installAcoesCapa } from '../features/acoes-capa/index.js';
import { installEditorCaptcha } from '../features/editor-captcha/index.js';
import { installDialogsHost } from '../features/dialogs-host/index.js';
import { installInteressadosForms } from '../features/interessados-forms/index.js';
import { installCoresMarcadores } from '../features/cores-marcadores/index.js';
import { installMidiaDocumentos } from '../features/midia-documentos/index.js';
import { installNotificacoesProcesso } from '../features/notificacoes-processo/index.js';
import { installHistoricoProcessos } from '../features/historico-processos/index.js';
import { installChromeUi } from '../features/chrome-ui/index.js';
import { installTabelasArquivos } from '../features/tabelas-arquivos/index.js';
import { installMenusRapidos } from '../features/menus-rapidos/index.js';
import { installUrlAmigavel } from '../features/url-amigavel/index.js';

/** A ordem é parte do contrato do Manifest e permanece explícita. */
export const LEGACY_CONTEXT_INSTALLERS: readonly NamedInstaller[] = Object.freeze([
    ['dialogs-host', installDialogsHost],
    ['historico-processos', installHistoricoProcessos],
    ['cores-marcadores', installCoresMarcadores],
    ['menus-rapidos', installMenusRapidos],
    ['chrome-ui', installChromeUi],
    ['tabelas-arquivos', installTabelasArquivos],
    ['acoes-capa', installAcoesCapa],
    ['interessados-forms', installInteressadosForms],
    ['midia-documentos', installMidiaDocumentos],
    ['notificacoes-processo', installNotificacoesProcesso],
    ['editor-captcha', installEditorCaptcha],
    ['url-amigavel', installUrlAmigavel]
]);

function markLegacyContextFailures(failed: readonly string[]) {
    if (!failed.length) return;

    const root = globalThis.SeiPro;
    if (root) {
        root.state = root.state || {};
        root.state.legacyContextFailed = failed.slice();
    }

    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-seipro-failed-features', failed.join(','));
    }
}

type LegacyContextLogger = {
    error(message: string, error: unknown): void;
};

type LegacyContextOptions = {
    logger?: LegacyContextLogger;
    installers?: readonly NamedInstaller[];
    installRuntime?: () => unknown;
    startRuntime?: () => unknown;
};

export function bootLegacyContext(options: LegacyContextOptions = {}) {
    const logger = options.logger || createLogger({ scope: 'legacy-context' });
    const installers: NamedInstaller[] = [
        ['sei-runtime', options.installRuntime || installSeiRuntime],
        ...(options.installers || LEGACY_CONTEXT_INSTALLERS),
        ['sei-runtime-start', options.startRuntime || startSeiRuntime]
    ];
    const { failed } = runInstallersSafely(installers, { logger });
    markLegacyContextFailures(failed);
    return globalThis.SeiPro;
}

bootLegacyContext();
