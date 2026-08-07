/** Pure configuration selectors. */

export function selectEntityConfig(config, entityId) {
    if (!config || !Array.isArray(config.entidades)) return null;
    const entity = config.entidades.find((item) => item && item.id_entidade == entityId);
    return entity && entity.config ? entity.config : null;
}

export function selectEntityOption(config, entityId, option) {
    const entity = selectEntityConfig(config, entityId);
    if (!entity || !Object.prototype.hasOwnProperty.call(entity, option)) return false;
    return entity[option];
}

export function hasEntityOption(config, entityId, option) {
    return !!selectEntityOption(config, entityId, option);
}

export function selectUnitConfig(unit, option, nested) {
    const config = unit && unit.config;
    if (!config || !Object.prototype.hasOwnProperty.call(config, option) || config[option] == null) return false;
    if (nested) {
        const value = config[option];
        return value && Object.prototype.hasOwnProperty.call(value, nested) ? value[nested] : false;
    }
    return config[option];
}

export function selectConfigItem(lists, idKey, id) {
    for (const list of lists || []) {
        if (!Array.isArray(list)) continue;
        const found = list.find((item) => item && item[idKey] == id);
        if (found) return found;
    }
    return false;
}
