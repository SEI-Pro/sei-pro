// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import * as openai from './openai.js';
import * as anthropic from './anthropic.js';
import * as gemini from './gemini.js';
import * as moonshot from './moonshot.js';
import * as ollama from './ollama.js';

export const providers = {
    openai,
    anthropic,
    gemini,
    moonshot,
    ollama,
    openai_compatible: openai
};

export function getProvider(id) {
    const provider = providers[id];
    if (!provider) throw new Error(`Unsupported provider: ${id}`);
    return provider;
}

export function listProviders() {
    return Object.keys(providers);
}
