// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades request boundary.
 *
 * Authorization, payload preparation and transport live here. The legacy UI
 * response adapter is isolated in server-response.js and receives its host
 * ports explicitly.
 */
import { callAtiv, hasAtiv } from './call.js';
import { getAtividadesContext } from './context.js';
import { postAtividadesServer } from './io.js';
import { createAtividadesRequestService } from './request.js';
import { createAtividadesServerPorts } from './server-ports.js';
import { routeAtividadesResponse } from './server-response.js';

export function getServerAtividades(param, mode, deps = {}) {
    const context = deps.context || getAtividadesContext();
    const ports = deps.ports || createAtividadesServerPorts(context);
    const page = ports.page || context.page || {};
    mode = typeof mode === 'string' ? mode : '';
    const checkCapability = deps.checkCapability || (
        hasAtiv('checkCapacidade')
            ? (...args) => callAtiv('checkCapacidade', ...args)
            : (name) => context.permissions && typeof context.permissions.check === 'function'
                ? context.permissions.check(name)
                : false
    );
    const requestService = createAtividadesRequestService({
        context,
        transport: deps.transport || {
            request: (url, data, options) => postAtividadesServer(url, data, {
                ajax: page.$ && typeof page.$.ajax === 'function' ? page.$.ajax.bind(page.$) : undefined,
                ...options,
                beforeSend: options && options.authToken
            })
        },
        version: typeof deps.version !== 'undefined' ? deps.version : (page.VERSION_SPRO || ''),
        checkCapability
    });
    const prepared = requestService.prepare(param, mode);
    param = prepared.param;

    if (!prepared.allowed) {
        const $ = page.$;
        if (typeof $ === 'function') {
            $('#atividadesProActions').find('.iconAtividade_update i').removeClass('fa-spin');
        }
        if (!checkCapability(mode)) {
            callAtiv('loadingTagConfig', param.type, 'set');
        }
        return Promise.resolve({ skipped: true, mode, param });
    }

    context.store.patch({ delayServerAtiv: 1 });
    context.schedule(() => context.store.patch({ delayServerAtiv: 0 }), 1000);

    const loadingButtonConfirm = ports.loadingButtonConfirm;
    if (typeof loadingButtonConfirm === 'function' && mode.indexOf('_monitorados') === -1) {
        loadingButtonConfirm(true);
    }
    if (mode.indexOf('config_update_') !== -1) {
        callAtiv('loadingTagConfig', param.type, 'get');
    }

    const request = (nextParam, nextMode) => getServerAtividades(nextParam, nextMode, deps);
    const authToken = undefined;
    return routeAtividadesResponse(
        requestService.send(prepared, { authToken }),
        param,
        mode,
        { context, page, ports, deps, request }
    );
}

/** Explicit application-facing name. */
export const requestAtividades = getServerAtividades;
