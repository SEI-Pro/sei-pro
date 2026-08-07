// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Public, dependency-free Atividades feature API. */
import { createAtividadesCommands } from './application/commands.js';
import { createAtividadesQueries } from './application/queries.js';

export function createAtividadesFeatureApi({ application, handlers, context, legacyRequest }) {
    if (!application || !handlers || !context || !context.store) {
        throw new TypeError('Atividades API requires application, handlers and context.store');
    }
    const commands = createAtividadesCommands(handlers);
    const queries = createAtividadesQueries({ handlers, context });
    return Object.freeze({
        version: 2,
        handlers: Object.freeze({ ...handlers }),
        state: Object.freeze({ get: () => context.store.get(), subscribe: context.store.subscribe }),
        commands: Object.freeze(commands),
        queries: Object.freeze(queries),
        request: application.request,
        legacyRequest: typeof legacyRequest === 'function' ? legacyRequest : null
    });
}
