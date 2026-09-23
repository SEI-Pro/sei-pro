/**
 * Provedor: endereços e cabeçalhos de cada serviço, o controle fino do modelo
 * e o que acontece quando o serviço recusa um desses ajustes. Sem rede: o
 * `fetch` é substituído por um que grava o que recebeu.
 */

import { criarProvedor, enderecoDoServico, listarModelos, parametroRecusado, SERVICOS, TEMPERATURA_PADRAO } from "../src/motor/provedor";
import { promptSistema } from "../src/motor/prompt";
import type { PedidoLLM } from "../src/motor/tipos";
import { checar, secao } from "./util";

const PEDIDO: PedidoLLM = { mensagens: [{ role: "user", content: "oi" }], tools: [] };

/** `fetch` de mentira: guarda as chamadas e responde um SSE mínimo. */
function espiao(respostas: Array<{ status: number; corpo: string }>) {
  const chamadas: Array<{ url: string; cabecalhos: Record<string, string>; corpo: Record<string, unknown> }> = [];
  const f = (async (url: string, init: RequestInit) => {
    chamadas.push({
      url: String(url),
      cabecalhos: (init.headers ?? {}) as Record<string, string>,
      corpo: JSON.parse(String(init.body ?? "{}")) as Record<string, unknown>,
    });
    const r = respostas.shift() ?? { status: 200, corpo: 'data: {"choices":[{"delta":{"content":"ok"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n' };
    return {
      ok: r.status < 400,
      status: r.status,
      text: async () => r.corpo,
      json: async () => JSON.parse(r.corpo) as unknown,
      body: new ReadableStream<Uint8Array>({
        start(c) {
          c.enqueue(new TextEncoder().encode(r.corpo));
          c.close();
        },
      }),
    } as unknown as Response;
  }) as unknown as typeof fetch;
  return { chamadas, f };
}

export async function verificarProvedor(): Promise<void> {
  secao("provedor: servicos prontos");
  checar("cada servico tem endereco, menos o compativel", Object.entries(SERVICOS).every(([id, i]) => (id === "compativel" ? !i.url : /^https?:\/\//.test(i.url))));
  checar("endereco do gemini e o da camada compativel", enderecoDoServico("gemini") === "https://generativelanguage.googleapis.com/v1beta/openai");
  checar("compativel usa o endereco informado, sem barra final", enderecoDoServico("compativel", "http://localhost:11434/v1/") === "http://localhost:11434/v1");

  const anth = espiao([]);
  await criarProvedor({ servico: "anthropic", chave: "k", modelo: "claude-sonnet-5", fetch: anth.f }).conversar(PEDIDO, new AbortController().signal, () => {});
  checar("anthropic vai para o endereco dela", anth.chamadas[0].url === "https://api.anthropic.com/v1/chat/completions");
  checar("anthropic leva os dois cabecalhos proprios", anth.chamadas[0].cabecalhos["anthropic-version"] === "2023-06-01" && anth.chamadas[0].cabecalhos["anthropic-dangerous-direct-browser-access"] === "true");
  checar("so o openrouter manda politica de dados", anth.chamadas[0].corpo.provider === undefined);

  secao("provedor: controle fino");
  const semAjuste = espiao([]);
  await criarProvedor({ servico: "openai", chave: "k", modelo: "gpt-5", fetch: semAjuste.f }).conversar(PEDIDO, new AbortController().signal, () => {});
  const corpo0 = semAjuste.chamadas[0].corpo;
  checar("sem ajustes vai so a temperatura padrao", corpo0.temperature === TEMPERATURA_PADRAO && !("top_p" in corpo0) && !("max_tokens" in corpo0));

  const comAjuste = espiao([]);
  await criarProvedor({
    servico: "openrouter",
    chave: "k",
    ajustes: { temperatura: 0.9, topP: 0.5, maxTokens: 1200, penalidadeFrequencia: 0.3, penalidadePresenca: -0.2 },
    fetch: comAjuste.f,
  }).conversar(PEDIDO, new AbortController().signal, () => {});
  const corpo1 = comAjuste.chamadas[0].corpo;
  checar(
    "ajustes viram os campos da API",
    corpo1.temperature === 0.9 && corpo1.top_p === 0.5 && corpo1.max_tokens === 1200 && corpo1.frequency_penalty === 0.3 && corpo1.presence_penalty === -0.2,
    corpo1,
  );

  secao("provedor: ajuste que o modelo nao aceita");
  checar("acha o parametro citado no erro", parametroRecusado('{"error":{"message":"Unsupported value: \'temperature\' does not support 0.2"}}') === "temperature");
  checar("erro sem parametro conhecido nao vira retentativa", parametroRecusado('{"error":{"message":"model not found"}}') === null);
  const recusa = espiao([{ status: 400, corpo: '{"error":{"message":"Unsupported parameter: temperature"}}' }]);
  const r = await criarProvedor({ servico: "openai", chave: "k", modelo: "gpt-5", ajustes: { temperatura: 0.2, maxTokens: 500 }, fetch: recusa.f }).conversar(
    PEDIDO,
    new AbortController().signal,
    () => {},
  );
  checar("repete o pedido sem o campo recusado", recusa.chamadas.length === 2 && !("temperature" in recusa.chamadas[1].corpo) && recusa.chamadas[1].corpo.max_tokens === 500);
  checar("e a resposta chega normalmente", r.texto === "ok");

  secao("provedor: catalogo de modelos");
  const modelos = espiao([{ status: 200, corpo: '{"data":[{"id":"models/gemini-2.5-flash"},{"id":"models/gemini-2.5-pro"}]}' }]);
  const lista = await listarModelos({ servico: "gemini", chave: "k", fetch: modelos.f });
  checar("gemini: tira o prefixo models/", lista.map((m) => m.id).join(",") === "gemini-2.5-flash,gemini-2.5-pro", lista);

  secao("prompt: instrucoes do usuario");
  const semInstrucao = promptSistema(null);
  const comInstrucao = promptSistema(null, new Date(), "Cite sempre o numero SEI.");
  checar("sem instrucoes, prompt nao muda", !semInstrucao.includes("preferencias-do-usuario"));
  checar("instrucoes entram delimitadas", comInstrucao.includes("<preferencias-do-usuario>") && comInstrucao.includes("Cite sempre o numero SEI."));
  checar("e vem com o lembrete de que nao furam as regras", /NÃO dispensam aprova/.test(comInstrucao));
}
