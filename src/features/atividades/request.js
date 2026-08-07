/**
 * Request use-case for the Atividades backend.
 *
 * It owns authorization, payload enrichment and concurrency state. Response
 * effects are deliberately supplied by the caller so this module remains
 * independent of the page UI.
 */
import { buildAtividadesRequestParams, isAtividadesServerModeAllowed } from './domain.js';

export function createAtividadesRequestService({ context, transport, version = '', checkCapability } = {}) {
    if (!context || !transport) throw new TypeError('Request service requires context and transport');

    function prepare(input = {}, mode = '') {
        const state = context.store.get();
        const allowed = !!state.urlServerAtiv && !!state.userHashAtiv &&
            isAtividadesServerModeAllowed(mode, {
                checkCapacidade: (name) => typeof checkCapability === 'function'
                    ? !!checkCapability(name)
                    : context.permissions.check(name),
                delayServerAtiv: state.delayServerAtiv,
                checkLoadingButtonConfirm: () => false
            });
        if (!allowed) return { allowed: false, param: input, mode };
        const param = buildAtividadesRequestParams(input, mode, {
            userHashAtiv: state.userHashAtiv,
            version,
            getOptionsPro: context.options.get,
            lastUpdateAtividades: state.lastUpdateAtividades,
            verifyConfigValue: context.options.verifyConfig,
            checkConfigValue: context.options.checkConfig
        });
        return { allowed: true, param, mode };
    }

    function send(prepared, options = {}) {
        if (!prepared || !prepared.allowed) return Promise.resolve({ skipped: true });
        return transport.request(context.store.get().urlServerAtiv, prepared.param, options);
    }

    return Object.freeze({ prepare, send, request(input, mode, options) {
        const prepared = prepare(input, mode);
        return send(prepared, options);
    } });
}
