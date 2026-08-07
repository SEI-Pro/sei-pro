// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades application service.
 *
 * This is the public use-case boundary.  Views and sibling features should
 * call these commands/queries instead of knowing how state, permissions or
 * the backend are wired.  The default implementation is assembled at boot;
 * every dependency can be replaced in unit tests or another host shell.
 */
import {
    buildAtividadesRequestParams,
    isAtividadesServerModeAllowed,
    isPerfilNivelAdm
} from './domain.js';
import { classifyAtividadesResponse } from './response.js';

const APPLICATION_KEY = '__SEI_PRO_ATIVIDADES_APPLICATION__';

export function createAtividadesApplication({
    context,
    transport,
    handlers = {},
    router = () => undefined,
    version = '',
    auth = {}
} = {}) {
    if (!context || !context.store) throw new TypeError('Atividades application requires context');
    if (!transport || typeof transport.request !== 'function') {
        throw new TypeError('Atividades application requires a transport port');
    }

    let requestInFlight = false;

    const permissions = {
        can(name) {
            return typeof context.permissions.check === 'function'
                ? !!context.permissions.check(name)
                : !!(typeof handlers.checkCapacidade === 'function' && handlers.checkCapacidade(name));
        },
        isAdmin() {
            return isPerfilNivelAdm(context.store.get().arrayConfigAtividades
                && context.store.get().arrayConfigAtividades.perfil);
        }
    };

    const request = (input = {}, mode = '') => {
        const state = context.store.get();
        const allowed = isAtividadesServerModeAllowed(mode, {
            checkCapacidade: permissions.can,
            delayServerAtiv: state.delayServerAtiv,
            checkLoadingButtonConfirm: () => requestInFlight
        });
        if (!state.urlServerAtiv || !state.userHashAtiv || !allowed) {
            if (input && input.type) context.effects.loading(false);
            return Promise.resolve({ skipped: true, allowed, mode });
        }
        const param = buildAtividadesRequestParams(input, mode, {
            userHashAtiv: state.userHashAtiv,
            version,
            getOptionsPro: context.options.get,
            lastUpdateAtividades: state.lastUpdateAtividades,
            verifyConfigValue: context.options.verifyConfig,
            checkConfigValue: context.options.checkConfig
        });
        requestInFlight = true;
        context.store.patch({ delayServerAtiv: 1 });
        const unlock = () => {
            requestInFlight = false;
            context.store.patch({ delayServerAtiv: 0 });
        };
        context.effects.loading(true);
        return Promise.resolve()
            .then(() => transport.request(state.urlServerAtiv, param, { mode, auth }))
            .then((data) => {
                context.events.emit('seipro:atividades-response', classifyAtividadesResponse(data, param, mode));
                return router(data, param, mode, context);
            })
            .finally(() => {
                unlock();
                context.effects.loading(false);
            });
    };

    return Object.freeze({
        context,
        state: () => context.store.get(),
        permissions,
        request,
        dispatch(name, ...args) {
            const fn = handlers[name];
            return typeof fn === 'function' ? fn(...args) : undefined;
        }
    });
}

export function installAtividadesApplication(application, page = globalThis) {
    if (!application || typeof application.request !== 'function') {
        throw new TypeError('Invalid Atividades application');
    }
    page[APPLICATION_KEY] = application;
    return application;
}

export function getAtividadesApplication(page = globalThis) {
    return page[APPLICATION_KEY] || null;
}

export const ATIVIDADES_APPLICATION_KEY = APPLICATION_KEY;
