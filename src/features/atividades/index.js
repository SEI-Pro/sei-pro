/**
 * Atividades — entry do bundle (substitui a cópia legada sei-pro-atividades.js).
 *
 * Decomposição: runtime · domain · io · view · templates · handlers · legacy-api.
 * Saída: dist/js/sei-pro-atividades.js (mesmo nome do legado para o manifest).
 *
 * Shared: src/shared/nomenclatura.js (getName / getNameGenre).
 * Core: SeiPro.core.prazos (getRecalculaPrazo) — not redefined here.
 *
 * Public surface: prefer SeiPro.features.atividades.* from other features.
 * data-act uses handlers; legacy globals are opt-in via legacy-api.js.
 */
import { ready } from '../../dom/index.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';
import { getAtividadesContext } from './context.js';
import { getName, getNameGenre } from '../../shared/nomenclatura.js';
import { installAtividadesLegacyApi } from './legacy-api.js';
import { initializeAtividadesRuntime } from './runtime.js';
import { installAtividadesView } from './view.js';
import { atividadesHandlers } from './handlers.js';
import { initPerfilLoginAtiv, checkHostPermission } from './boot.js';
import { getServerAtividades } from './server.js';
import { createAtividadesDispatcher, installAtividadesDispatcher } from './call.js';
import { createAtividadesApplication, installAtividadesApplication } from './application.js';
import { createAtividadesTransport } from './io.js';
import { createAtividadesFeatureApi } from './api.js';
import { createAtividadesResponseRouter } from './response.js';
import { createAtividadesStorage } from './storage.js';
import { createAtividadesEffects } from './effects.js';
import { createAtividadesServerPorts } from './server-ports.js';
import { createActivityUseCases } from './activity-use-cases.js';
import { createConfigUseCases } from './config-use-cases.js';

installAtividadesState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.shared = namespace.shared || {};
namespace.shared.nomenclatura = { getName, getNameGenre };

// Internal calls are resolved against the composed registry, never against a
// global function name.  The namespace is still published for sibling bundles.
installAtividadesDispatcher(createAtividadesDispatcher({ registry: atividadesHandlers }));

const context = getAtividadesContext();
const storage = createAtividadesStorage({ context });
const effects = createAtividadesEffects(context);
const application = createAtividadesApplication({
    context,
    handlers: atividadesHandlers,
    transport: createAtividadesTransport(),
    router: createAtividadesResponseRouter({
        resolve: (name) => atividadesHandlers[name]
    })
});
installAtividadesApplication(application);
const featureApi = createAtividadesFeatureApi({
    application,
    handlers: atividadesHandlers,
    context,
    legacyRequest: getServerAtividades
});
const useCases = Object.freeze({
    activity: createActivityUseCases({ context, handlers: atividadesHandlers }),
    config: createConfigUseCases({ context, handlers: atividadesHandlers })
});
const ports = Object.freeze({
    context,
    storage,
    effects,
    server: createAtividadesServerPorts(context)
});
namespace.features.atividades = Object.freeze({
    api: featureApi,
    useCases,
    ports
});

installAtividadesLegacyApi();
initializeAtividadesRuntime();
installAtividadesView();

ready(function () {
    try { refreshAtividadesState(); } catch (e) { /* ignore */ }
    const ns = globalThis.NAMESPACE_SPRO;
    if (typeof ns !== 'undefined' && (ns === 'ANTAQ Pro' || ns === 'ANTT Pro')) {
        checkHostPermission();
    } else {
        initPerfilLoginAtiv();
    }
});
