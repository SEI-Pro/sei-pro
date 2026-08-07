/** Explicit command port for Atividades. */
const COMMANDS = Object.freeze([
    'saveAtividade', 'saveAtividadeFull', 'saveAtividadeQuick', 'startAtividade',
    'completeAtividade', 'pauseAtividade', 'archiveAtividade', 'deleteAtividade',
    'rateAtividade', 'rateCancelAtividade', 'saveAfastamento', 'removeAfastamento',
    'saveConfigPersonalUser', 'saveOptionConfigItem', 'updateConfigServer'
]);

export function createAtividadesCommands(handlers = {}) {
    const commands = Object.create(null);
    COMMANDS.forEach((name) => {
        if (typeof handlers[name] === 'function') commands[name] = (...args) => handlers[name](...args);
    });
    return Object.freeze(commands);
}

export { COMMANDS as ATIVIDADES_COMMAND_NAMES };

