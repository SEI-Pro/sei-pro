import { assertWithinCaps } from '../../../core/llm/tools.js';
import { openLlmStream } from '../../../platform/net-stream.js';

export function streamLlmRound(request, {
    onDelta,
    onToolStart
} = {}) {
    const stream = openLlmStream(request);
    const completion = new Promise(function (resolve, reject) {
        let text = '';
        let settled = false;

        function cleanup() {
            try { stream.port.onMessage.removeListener(onMessage); } catch (_) { /* no-op */ }
            try { stream.port.onDisconnect.removeListener(onDisconnect); } catch (_) { /* no-op */ }
        }
        function finish(action, value) {
            if (settled) return;
            settled = true;
            cleanup();
            action(value);
        }
        function onMessage(message) {
            if (!message || (message.requestId && message.requestId !== stream.requestId)) return;
            if (message.type === 'delta') {
                const delta = String(message.delta || '');
                text += delta;
                if (typeof onDelta === 'function') onDelta(delta, message);
            } else if (message.type === 'tool_start') {
                if (typeof onToolStart === 'function') onToolStart(message.tool);
            } else if (message.type === 'done') {
                finish(resolve, {
                    text,
                    toolCalls: Array.isArray(message.toolCalls) ? message.toolCalls : [],
                    finishReason: message.finishReason,
                    usage: message.usage,
                    cancelled: message.cancelled === true
                });
            } else if (message.type === 'error') {
                finish(reject, new Error(message.error || 'A geração de IA falhou'));
            }
        }
        function onDisconnect() {
            finish(reject, new Error('A conexão com a IA foi encerrada antes da conclusão'));
        }

        stream.port.onMessage.addListener(onMessage);
        stream.port.onDisconnect.addListener(onDisconnect);
    });
    return { ...stream, completion };
}

export async function runToolLoop({
    profile,
    system,
    prompt,
    tools = [],
    executor,
    maxIterations = 8,
    maxDocs = 15,
    maxTokens = 4096,
    temperature = 0.2,
    onDelta,
    onRoundStart,
    onToolStart,
    onToolResult
} = {}) {
    if (!profile || !profile.id) throw new Error('Configure um perfil de IA');
    if (!executor || typeof executor.execute !== 'function') {
        throw new TypeError('O executor de ferramentas de leitura é obrigatório');
    }
    const messages = [{ role: 'user', content: String(prompt || '') }];
    let activeStream = null;
    let cancelled = false;

    const task = (async function () {
        for (let iteration = 1; iteration <= maxIterations; iteration++) {
            assertWithinCaps({
                iterations: iteration,
                maxIterations,
                docsFetched: executor.docsFetched,
                maxDocs
            });
            if (typeof onRoundStart === 'function') onRoundStart(iteration);
            activeStream = streamLlmRound({
                profileId: profile.id,
                model: profile.model,
                messages,
                system,
                tools,
                maxTokens,
                temperature
            }, { onDelta, onToolStart });
            const round = await activeStream.completion;
            if (cancelled || round.cancelled) return { cancelled: true, text: round.text };
            if (!round.toolCalls.length) return { ...round, iterations: iteration };
            if (iteration === maxIterations) {
                throw new Error(`Limite de rodadas de ferramentas atingido (${maxIterations})`);
            }

            const results = [];
            for (const call of round.toolCalls) {
                const result = await executor.execute(call);
                results.push({ name: call.name, id: call.id, result });
                if (typeof onToolResult === 'function') onToolResult(call, result);
            }
            assertWithinCaps({
                iterations: iteration,
                maxIterations,
                docsFetched: executor.docsFetched,
                maxDocs
            });
            messages.push({
                role: 'assistant',
                content: round.text || `Requested read tools: ${round.toolCalls.map(function (call) {
                    return call.name;
                }).join(', ')}`
            });
            messages.push({
                role: 'user',
                content: [
                    'READ-ONLY TOOL RESULTS',
                    JSON.stringify(results),
                    'Use these results to answer the original task. Call another read tool only if necessary.'
                ].join('\n')
            });
        }
        throw new Error(`Limite de rodadas de ferramentas atingido (${maxIterations})`);
    })();

    return {
        task,
        cancel() {
            cancelled = true;
            return activeStream ? activeStream.cancel() : false;
        }
    };
}
