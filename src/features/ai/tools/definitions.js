export const AI_TOOL_DEFINITIONS = Object.freeze([
    {
        name: 'listar_documentos',
        description: 'List documents in the current SEI process. Returns metadata only.',
        parameters: {
            type: 'object',
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: 'ler_documento',
        description: 'Read one SEI document as Markdown. Restricted content requires user consent.',
        parameters: {
            type: 'object',
            properties: {
                numero_sei: {
                    type: 'string',
                    minLength: 1,
                    description: 'SEI document number from listar_documentos'
                }
            },
            required: ['numero_sei'],
            additionalProperties: false
        }
    },
    {
        name: 'dados_processo',
        description: 'Return structured metadata for the current SEI process.',
        parameters: {
            type: 'object',
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: 'documento_atual',
        description: 'Read the draft currently open in the CKEditor 4 editor.',
        parameters: {
            type: 'object',
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: 'historico_processo',
        description: 'Return process history already available in the current SEI session.',
        parameters: {
            type: 'object',
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: 'buscar_legislacao',
        description: 'Search the SEI Pro legislation catalogue by law, decree or normative term. Read-only.',
        parameters: {
            type: 'object',
            properties: {
                termo: {
                    type: 'string',
                    minLength: 2,
                    description: 'Normative reference or search term'
                }
            },
            required: ['termo'],
            additionalProperties: false
        }
    }
]);

export function getAiToolDefinition(name) {
    return AI_TOOL_DEFINITIONS.find(function (tool) { return tool.name === name; }) || null;
}
