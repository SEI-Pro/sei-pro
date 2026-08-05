export function validateToolCall(toolDef, args) {
    if (!toolDef || typeof toolDef !== 'object' || !toolDef.parameters) return false;
    let value = args;
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (_) {
            return false;
        }
    }
    return validateSchema(toolDef.parameters, value);
}

export function formatToolsForProvider(providerId, tools = []) {
    if (!Array.isArray(tools)) throw new TypeError('Tools must be an array');

    if (providerId === 'anthropic') {
        return tools.map(function (tool) {
            return {
                name: tool.name,
                description: tool.description || '',
                input_schema: tool.parameters
            };
        });
    }
    if (providerId === 'gemini') {
        if (!tools.length) return [];
        return [{
            functionDeclarations: tools.map(function (tool) {
                return {
                    name: tool.name,
                    description: tool.description || '',
                    parameters: tool.parameters
                };
            })
        }];
    }
    if (['openai', 'moonshot', 'ollama', 'openai_compatible'].includes(providerId)) {
        return tools.map(function (tool) {
            return {
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description || '',
                    parameters: tool.parameters
                }
            };
        });
    }
    throw new Error(`Unsupported provider: ${providerId}`);
}

export function assertWithinCaps({
    iterations = 0,
    maxIterations = 8,
    docsFetched = 0,
    maxDocs = 15
} = {}) {
    if (iterations > maxIterations) {
        throw new Error(`Tool iteration cap exceeded (${maxIterations})`);
    }
    if (docsFetched > maxDocs) {
        throw new Error(`Document fetch cap exceeded (${maxDocs})`);
    }
    return true;
}

function validateSchema(schema, value) {
    if (!schema || typeof schema !== 'object') return true;
    if (schema.enum && !schema.enum.some(function (item) { return Object.is(item, value); })) {
        return false;
    }
    if (Array.isArray(schema.anyOf)) {
        return schema.anyOf.some(function (candidate) { return validateSchema(candidate, value); });
    }
    if (Array.isArray(schema.oneOf)) {
        return schema.oneOf.filter(function (candidate) {
            return validateSchema(candidate, value);
        }).length === 1;
    }
    if (schema.type && !matchesType(schema.type, value)) return false;

    if (schema.type === 'object' || (!schema.type && isObject(value))) {
        if (!isObject(value)) return false;
        const properties = schema.properties || {};
        if ((schema.required || []).some(function (name) {
            return !Object.prototype.hasOwnProperty.call(value, name);
        })) return false;
        if (schema.additionalProperties === false && Object.keys(value).some(function (name) {
            return !Object.prototype.hasOwnProperty.call(properties, name);
        })) return false;
        return Object.keys(properties).every(function (name) {
            return !Object.prototype.hasOwnProperty.call(value, name)
                || validateSchema(properties[name], value[name]);
        });
    }

    if (schema.type === 'array') {
        if (schema.minItems != null && value.length < schema.minItems) return false;
        if (schema.maxItems != null && value.length > schema.maxItems) return false;
        return !schema.items || value.every(function (item) {
            return validateSchema(schema.items, item);
        });
    }
    if (typeof value === 'string') {
        if (schema.minLength != null && value.length < schema.minLength) return false;
        if (schema.maxLength != null && value.length > schema.maxLength) return false;
        if (schema.pattern && !(new RegExp(schema.pattern)).test(value)) return false;
    }
    if (typeof value === 'number') {
        if (schema.minimum != null && value < schema.minimum) return false;
        if (schema.maximum != null && value > schema.maximum) return false;
    }
    return true;
}

function matchesType(type, value) {
    if (Array.isArray(type)) return type.some(function (item) { return matchesType(item, value); });
    if (type === 'null') return value === null;
    if (type === 'array') return Array.isArray(value);
    if (type === 'object') return isObject(value);
    if (type === 'integer') return Number.isInteger(value);
    if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
    return typeof value === type;
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
