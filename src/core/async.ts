// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro, globalRef } from './global.js';

/**
 * Primitivos de espera assíncrona reutilizáveis — extraídos do padrão de "poll cego"
 * que estava espalhado pelo legado (retryCapaProcesso inline, waitLoadPro, os vários
 * waitFor locais de features). NÃO dependem de DOM, jQuery, chrome.* nem config.
 *
 * Motivação: recursos do SEI (dado da sessão, iframes, seleção de nó, containers)
 * costumam ficar prontos em momentos DISPERSOS no tempo. Um poll de janela fixa
 * (contador + intervalo constantes) desiste cedo demais quando o último recurso
 * demora, e acorda à toa quando é rápido. O padrão correto combina:
 *   - retry CIENTE DE PROGRESSO (só desiste quando para de avançar);
 *   - BACKOFF exponencial (menos despertares em esperas longas);
 *   - teto WALL-CLOCK absoluto (nunca fica preso);
 *   - NUDGE por evento (reage no instante em que um recurso fica pronto).
 */

const DEFAULT_BAG_KEY = '__SEI_PRO_RETRY__';

function resolveBag(bag) {
    if (bag) return bag;
    if (typeof globalRef === 'undefined') return {};
    return globalRef[DEFAULT_BAG_KEY] || (globalRef[DEFAULT_BAG_KEY] = {});
}

/**
 * Agenda uma nova execução de `run` enquanto as pré-condições não estão satisfeitas,
 * usando retry ciente de progresso + backoff exponencial + teto wall-clock. Deve ser
 * chamada no ramo "ainda não pronto"; quando ficar pronto, o chamador limpa o estado
 * com `clearRetry(key, bag)`.
 *
 * @param {Object} opts
 * @param {Function} opts.run          Reexecuta a rotina que verifica/monta (obrigatório).
 * @param {number}   [opts.progress=0] Nº de pré-condições já satisfeitas (dispara reset).
 * @param {string|number} [opts.key='default'] Chave de estado (ex.: id do processo).
 * @param {Object}   [opts.bag]        Saco de estado por chave (default: window.__SEI_PRO_RETRY__).
 * @param {number}   [opts.minDelay=300]
 * @param {number}   [opts.maxDelay=2000]
 * @param {number}   [opts.wallClockMs=30000]
 * @param {number}   [opts.noProgressLimit=15]
 * @param {string}   [opts.reason]     Rótulo de diagnóstico repassado a onGiveUp.
 * @param {Function} [opts.onGiveUp]   Chamado UMA vez ao desistir: ({key, progress, elapsed, reason}).
 * @returns {boolean} true se agendou novo retry; false se desistiu (ou já havia desistido).
 */
export function retryWithProgress(opts) {
    opts = opts || {};
    const run = opts.run;
    const progress = (typeof opts.progress === 'number') ? opts.progress : 0;
    const key = (opts.key != null) ? opts.key : 'default';
    const bag = resolveBag(opts.bag);
    const minDelay = opts.minDelay || 300;
    const maxDelay = opts.maxDelay || 2000;
    const wallClockMs = opts.wallClockMs || 30000;
    const noProgressLimit = opts.noProgressLimit || 15;

    const st = bag[key] || { count: 0, timer: null, startTime: Date.now(), bestProgress: -1, gaveUp: false };
    if (st.timer) { clearTimeout(st.timer); st.timer = null; }

    // Progresso: qualquer avanço zera o contador de tentativas "sem progresso",
    // mantendo o loop vivo para recursos que chegam dispersos no tempo.
    if (progress > st.bestProgress) {
        st.bestProgress = progress;
        st.count = 0;
        st.gaveUp = false;
    }
    if (st.gaveUp) { bag[key] = st; return false; }

    const elapsed = Date.now() - st.startTime;
    if (st.count >= noProgressLimit || elapsed >= wallClockMs) {
        st.gaveUp = true;
        st.timer = null;
        bag[key] = st;
        if (typeof opts.onGiveUp === 'function') {
            opts.onGiveUp({ key: key, progress: st.bestProgress, elapsed: elapsed, reason: opts.reason });
        }
        return false;
    }

    const delay = Math.min(minDelay * Math.pow(2, st.count), maxDelay);
    st.count++;
    st.timer = setTimeout(function () {
        st.timer = null;
        bag[key] = st;
        if (typeof run === 'function') run();
    }, delay);
    bag[key] = st;
    return true;
}

/** Limpa (e cancela o timer) do estado de retry de uma chave. Chamar no sucesso. */
export function clearRetry(key, bag) {
    bag = resolveBag(bag);
    key = (key != null) ? key : 'default';
    if (bag[key]) {
        if (bag[key].timer) clearTimeout(bag[key].timer);
        delete bag[key];
    }
}

/**
 * Registra listeners de eventos (uma ÚNICA vez, marcada por `flagKey`) que forçam uma
 * re-checagem imediata — o caminho "orientado a evento" que evita esperar o próximo
 * tick do poll. Idempotente: chamadas repetidas com o mesmo flag não duplicam.
 */
export function nudgeOnce(flagKey, eventNames, handler) {
    if (typeof globalRef === 'undefined' || typeof globalRef.addEventListener !== 'function') return;
    if (globalRef[flagKey]) return;
    globalRef[flagKey] = true;
    (eventNames || []).forEach(function (name) { globalRef.addEventListener(name, handler); });
}

export function installAsync() {
    const async = { retryWithProgress, clearRetry, nudgeOnce };
    getSeiPro().core.async = async;
    aliasGlobal('retryWithProgress', retryWithProgress);
    aliasGlobal('clearRetry', clearRetry);
    aliasGlobal('nudgeOnce', nudgeOnce);
    return async;
}
