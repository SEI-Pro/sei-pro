/**
 * Provedor: endereços e cabeçalhos de cada serviço, o controle fino do modelo
 * e o que acontece quando o serviço recusa um desses ajustes. Sem rede: o
 * `fetch` é substituído por um que grava o que recebeu.
 */

import { Acumulador, aceitaImagem, ehErroDeImagem, comCache, atalhoDeEndereco, criarProvedor, enderecoDoServico, ENDERECO_OUTRO, lerSSE, limparAssinaturasDeOutro, listarModelos, parametroRecusado, serveParaConversar, SERVICOS, TEMPERATURA_PADRAO, campoModeloEhSelect, enderecoLocal, esperaDaTentativa, mensagemDeErro, valeRepetir, valorSelectEndereco } from "../src/motor/provedor";
import { promptSistema } from "../src/motor/prompt";
import type { ChamadaTool, PedidoLLM } from "../src/motor/tipos";
import { checar, secao, lanca } from "./util";

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

  /**
   * Issue #169: o Gemini 3 assina cada chamada de ferramenta e RECUSA a rodada
   * seguinte se a assinatura não voltar ("Function call is missing a
   * thought_signature", HTTP 400). Na camada compatível com OpenAI ela vem em
   * `tool_calls[].extra_content` — inclusive no streaming, no primeiro pedaço.
   */
  secao("provedor: assinatura de ferramenta do Gemini 3");
  const assinatura = { google: { thought_signature: "Ep4DCpsDAWkUfRM=" } };
  const acc = new Acumulador();
  acc.somar({
    choices: [
      {
        delta: {
          tool_calls: [{ id: "function-call-1", type: "function", extra_content: assinatura, function: { name: "documentos_listar", arguments: '{"proc' } }],
        },
      },
    ],
  });
  acc.somar({ choices: [{ delta: { tool_calls: [{ function: { arguments: 'esso":"1"}' } }] }, finish_reason: "tool_calls" }] });
  const comAssinatura = acc.resposta();
  checar("a assinatura sobrevive ao streaming", JSON.stringify(comAssinatura.chamadas[0].extra_content) === JSON.stringify(assinatura), comAssinatura.chamadas[0]);
  checar("e os argumentos continuam sendo juntados", comAssinatura.chamadas[0].function.arguments === '{"processo":"1"}');

  const semAssinatura = new Acumulador();
  semAssinatura.somar({ choices: [{ delta: { tool_calls: [{ index: 0, id: "c1", function: { name: "x", arguments: "{}" } }] }, finish_reason: "tool_calls" }] });
  checar("quem nao assina nao ganha campo nenhum", !("extra_content" in semAssinatura.resposta().chamadas[0]));

  const historico: PedidoLLM["mensagens"] = [
    { role: "user", content: "liste" },
    { role: "assistant", content: null, tool_calls: [{ id: "c1", type: "function", function: { name: "documentos_listar", arguments: "{}" }, extra_content: assinatura }] } as never,
    { role: "tool", tool_call_id: "c1", content: "[]" } as never,
  ];
  const paraGemini = limparAssinaturasDeOutro(historico, "gemini-3.5-flash", "gemini");
  checar("indo para o Gemini, a assinatura vai junto", (paraGemini[1] as { tool_calls: ChamadaTool[] }).tool_calls[0].extra_content !== undefined);
  const viaOpenRouter = limparAssinaturasDeOutro(historico, "google/gemini-3-pro-preview", "openrouter");
  checar("pelo OpenRouter com modelo Gemini, tambem vai", (viaOpenRouter[1] as { tool_calls: ChamadaTool[] }).tool_calls[0].extra_content !== undefined);
  // Trocar de modelo no meio da conversa é possível no painel, e o histórico é o mesmo.
  const paraOutro = limparAssinaturasDeOutro(historico, "gpt-5", "openai");
  checar("trocando para outro provedor, a assinatura sai", (paraOutro[1] as { tool_calls: ChamadaTool[] }).tool_calls[0].extra_content === undefined);
  checar("e o resto da chamada fica intacto", (paraOutro[1] as { tool_calls: ChamadaTool[] }).tool_calls[0].function.name === "documentos_listar");
  checar("historico sem assinatura nao e copiado a toa", limparAssinaturasDeOutro([{ role: "user", content: "oi" }], "gpt-5", "openai").length === 1);

  const espiaoGemini = espiao([]);
  await criarProvedor({ servico: "gemini", chave: "k", modelo: "gemini-3.5-flash", fetch: espiaoGemini.f }).conversar(
    { mensagens: historico, tools: [] },
    new AbortController().signal,
    () => {},
  );
  const enviadas = espiaoGemini.chamadas[0].corpo.messages as Array<{ tool_calls?: ChamadaTool[] }>;
  checar("no corpo que sai para o Gemini a assinatura esta la", enviadas[1].tool_calls?.[0].extra_content !== undefined, enviadas[1]);

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

  const renomeia = espiao([{ status: 400, corpo: '{"error":{"message":"Unsupported parameter: \'max_tokens\' is not supported with this model. Use \'max_completion_tokens\' instead."}}' }]);
  await criarProvedor({ servico: "openai", chave: "k", modelo: "gpt-5", ajustes: { maxTokens: 700 }, fetch: renomeia.f }).conversar(PEDIDO, new AbortController().signal, () => {});
  checar(
    "max_tokens vira max_completion_tokens em vez de sumir",
    renomeia.chamadas.length === 2 && !("max_tokens" in renomeia.chamadas[1].corpo) && renomeia.chamadas[1].corpo.max_completion_tokens === 700,
    renomeia.chamadas[1]?.corpo,
  );

  /**
   * O provedor pode deixar a conexão aberta sem `[DONE]` e sem mais dados
   * (visto em captura de rede do OpenRouter). Antes disso aqui, `read()` ficava
   * pendurado para sempre: painel em "pensando" eterno e rodada que não fecha.
   */
  secao("provedor: stream que para no meio");
  const streamParado = (textoParcial: string) => {
    let entregou = false;
    let cancelado = false;
    const corpo = new ReadableStream<Uint8Array>({
      pull(c) {
        if (entregou) return new Promise<void>(() => undefined); // silêncio para sempre
        entregou = true;
        c.enqueue(new TextEncoder().encode(`data: {"choices":[{"delta":{"content":${JSON.stringify(textoParcial)}}}]}\n\n`));
      },
      cancel() {
        cancelado = true;
      },
    });
    return { corpo, foiCancelado: () => cancelado };
  };

  const parado = streamParado("Comecei a responder");
  const recebido: string[] = [];
  let erroStream = "";
  try {
    for await (const p of lerSSE(parado.corpo, 80)) recebido.push(String(p.choices?.[0]?.delta?.content ?? ""));
  } catch (e) {
    erroStream = (e as Error).name;
  }
  checar("desiste do silencio em vez de pendurar", erroStream === "ErroStreamParado", erroStream);
  checar("entrega o que chegou antes de parar", recebido.join("") === "Comecei a responder", recebido);
  checar("solta o corpo da resposta", parado.foiCancelado());

  const provedorParado = espiao([]);
  (provedorParado as { f: typeof fetch }).f = (async () => {
    const s2 = streamParado("Texto parcial");
    return { ok: true, status: 200, text: async () => "", body: s2.corpo } as unknown as Response;
  }) as unknown as typeof fetch;
  const resposta = await criarProvedor({ servico: "openrouter", chave: "k", fetch: provedorParado.f, silencioMaximo: 80 }).conversar(
    PEDIDO,
    new AbortController().signal,
    () => {},
  );
  checar("a rodada termina com o texto parcial", resposta.texto === "Texto parcial" && resposta.interrompida === true, resposta);
  checar("e sem ferramenta pela metade", resposta.chamadas.length === 0 && resposta.fim === "parado");

  secao("provedor: catalogo de modelos");
  const modelos = espiao([{ status: 200, corpo: '{"data":[{"id":"models/gemini-2.5-flash"},{"id":"models/gemini-2.5-pro"}]}' }]);
  const lista = await listarModelos({ servico: "gemini", chave: "k", fetch: modelos.f });
  checar("gemini: tira o prefixo models/", lista.map((m) => m.id).join(",") === "gemini-2.5-flash,gemini-2.5-pro", lista);
  const ruido = espiao([
    { status: 200, corpo: '{"data":[{"id":"gpt-5"},{"id":"text-embedding-3-large"},{"id":"gpt-4o-realtime-preview"},{"id":"dall-e-3"},{"id":"whisper-1"}]}' },
  ]);
  const so = await listarModelos({ servico: "openai", chave: "k", fetch: ruido.f });
  checar("openai: catalogo sem embedding, voz e imagem", so.map((m) => m.id).join(",") === "gpt-5", so);
  checar("servico do orgao nao filtra nada", serveParaConversar("compativel", "qualquer-coisa-v1"));

  secao("prompt: instrucoes do usuario");
  const semInstrucao = promptSistema(null);
  const comInstrucao = promptSistema(null, new Date(), "Cite sempre o numero SEI.");
  checar("sem instrucoes, prompt nao muda", !semInstrucao.includes("preferencias-do-usuario"));
  checar("instrucoes entram delimitadas", comInstrucao.includes("<preferencias-do-usuario>") && comInstrucao.includes("Cite sempre o numero SEI."));
  checar("e vem com o lembrete de que nao furam as regras", /NÃO dispensam aprova/.test(comInstrucao));
}

/**
 * O 429 não é um erro só.
 *
 * A OpenAI devolve 429 tanto para "você está indo rápido demais" quanto para
 * "sua conta não tem crédito" — e o conselho de um é o oposto do conselho do
 * outro. Quem está sem crédito e lê "aguarde alguns segundos e tente de novo"
 * fica tentando para sempre, que foi o que um usuário relatou com a tela cheia
 * do mesmo aviso.
 */
export async function verificarErro429(): Promise<void> {
  secao("provedor: 429 por falta de credito");
  {
    const corpo = JSON.stringify({
      error: { message: "You exceeded your current quota, please check your plan and billing details.", type: "insufficient_quota", code: "insufficient_quota" },
    });
    const m = mensagemDeErro(429, corpo, "openai");
    checar("diz que e credito, nao pressa", /crédito|quota/i.test(m), m);
    checar("e avisa que tentar de novo nao resolve", /não resolve|não adianta/i.test(m), m);
    checar("nao manda esperar alguns segundos", !/aguarde alguns segundos/i.test(m), m);
    checar("diz onde resolver", /billing|créditos/i.test(m), m);
  }

  secao("provedor: 429 por ritmo");
  {
    const corpo = JSON.stringify({ error: { message: "Rate limit reached for gpt-4o in organization org-x on tokens per min (TPM): Limit 30000", type: "tokens", code: "rate_limit_exceeded" } });
    const m = mensagemDeErro(429, corpo, "openai");
    checar("continua explicando o limite", /limite|ritmo/i.test(m), m);
    checar("e explica por que acontece no agente", /ferramenta|tokens/i.test(m), m);
    const comEspera = mensagemDeErro(429, corpo, "openai", "26");
    checar("com retry-after, diz quantos segundos", /26 segundos/.test(comEspera), comEspera);
  }

  secao("provedor: quanto esperar antes de repetir");
  {
    checar("sem cabecalho, dobra a espera (1s, 2s, 4s)", esperaDaTentativa(0, null) === 1000 && esperaDaTentativa(2, null) === 4000);
    checar("com retry-after em segundos, respeita", esperaDaTentativa(0, "26") === 26_000);
    checar("com retry-after em data, calcula", esperaDaTentativa(0, new Date(Date.now() + 15_000).toUTCString()) >= 13_000);
    checar("mas nao espera mais que o teto", esperaDaTentativa(0, "600") === 60_000);
    checar("cabecalho invalido cai na espera padrao", esperaDaTentativa(1, "amanha") === 2000);
  }

  secao("provedor: o que NAO se repete");
  {
    const quota = JSON.stringify({ error: { type: "insufficient_quota" } });
    checar("falta de credito nao se repete", !valeRepetir(429, quota));
    checar("limite de ritmo se repete", valeRepetir(429, JSON.stringify({ error: { code: "rate_limit_exceeded" } })));
    checar("erro de servidor se repete", valeRepetir(503, ""));
    checar("chave recusada nao se repete", !valeRepetir(401, ""));
  }

  secao("provedor: o laco nao insiste quando nao adianta");
  {
    // Servidor que responde sempre 429 por falta de credito.
    let tentativas = 0;
    const buscar = (async () => {
      tentativas += 1;
      return {
        ok: false,
        status: 429,
        headers: { get: () => null },
        text: async () => JSON.stringify({ error: { type: "insufficient_quota", message: "You exceeded your current quota" } }),
      } as unknown as Response;
    }) as unknown as typeof fetch;
    const p = criarProvedor({ servico: "openai", url: "", chave: "sk-x", modelo: "gpt-4o", ajustes: {}, cache: false, fetch: buscar });
    const e = await lanca(() => p.conversar({ mensagens: [{ role: "user", content: "oi" }], tools: [] }, new AbortController().signal, () => undefined));
    checar("falha de primeira, sem repetir", tentativas === 1, tentativas);
    checar("com a mensagem de credito", /cr\u00E9dito|quota/i.test(e?.message ?? ""), e?.message);
  }
  {
    // Limite de ritmo: repete, respeitando o retry-after (aqui, 0 segundo).
    let tentativas = 0;
    const buscar = (async () => {
      tentativas += 1;
      if (tentativas < 3) {
        return { ok: false, status: 429, headers: { get: (k: string) => (k.toLowerCase() === "retry-after" ? "0" : null) }, text: async () => JSON.stringify({ error: { code: "rate_limit_exceeded" } }) } as unknown as Response;
      }
      const corpo = 'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n';
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(corpo)); c.close(); } }),
      } as unknown as Response;
    }) as unknown as typeof fetch;
    const p = criarProvedor({ servico: "openai", url: "", chave: "sk-x", modelo: "gpt-4o", ajustes: {}, cache: false, fetch: buscar });
    const r = await p.conversar({ mensagens: [{ role: "user", content: "oi" }], tools: [] }, new AbortController().signal, () => undefined);
    checar("limite de ritmo e repetido ate passar", tentativas === 3, tentativas);
    checar("e a resposta chega", r.texto === "ok", r);
  }
}

/**
 * Modelos de raciocínio com ferramentas.
 *
 * Relato de uma usuária (Patrícia, 06/10/2026): o modelo novo recusava toda
 * pergunta com "Function tools with reasoning_effort are not supported ... To
 * use function tools, use /v1/responses or set reasoning to 'none'".
 *
 * O detalhe que custa entender: o SEI Pro NÃO envia `reasoning_effort`. Ele é
 * o padrão do próprio modelo, e a saída é mandá-lo explicitamente como "none"
 * — acrescentar um campo, não remover, que era tudo o que o agente sabia fazer
 * diante de um 400.
 */
export async function verificarRaciocinioComFerramentas(): Promise<void> {
  secao("provedor: modelo de raciocinio que recusa ferramentas");
  {
    const enviados: Array<Record<string, unknown>> = [];
    const buscar = (async (_u: string, init: RequestInit) => {
      const corpo = JSON.parse(String(init.body)) as Record<string, unknown>;
      enviados.push(corpo);
      if (corpo.reasoning_effort !== "none") {
        return {
          ok: false,
          status: 400,
          headers: { get: () => null },
          text: async () =>
            JSON.stringify({
              error: {
                message: 'Function tools with reasoning_effort are not supported for gpt-6.1-sol in /v1/chat/completions. To use function tools, use /v1/responses or set reasoning to "none".',
                type: "invalid_request_error",
              },
            }),
        } as unknown as Response;
      }
      const sse = 'data: {"choices":[{"delta":{"content":"pronto"}}]}\n\ndata: [DONE]\n\n';
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(sse)); c.close(); } }),
      } as unknown as Response;
    }) as unknown as typeof fetch;

    const p = criarProvedor({ servico: "openai", url: "", chave: "sk-x", modelo: "gpt-6.1-sol", ajustes: {}, cache: false, fetch: buscar });
    const tools = [{ type: "function" as const, function: { name: "processos_listar", description: "lista", parameters: { type: "object" as const, properties: {}, additionalProperties: false as const } } }];
    const r = await p.conversar({ mensagens: [{ role: "user", content: "liste" }], tools }, new AbortController().signal, () => undefined);

    checar("tentou duas vezes", enviados.length === 2, enviados.length);
    checar("a primeira foi sem reasoning_effort (nos nao mandamos)", enviados[0].reasoning_effort === undefined, enviados[0].reasoning_effort);
    checar("a segunda manda reasoning_effort none", enviados[1].reasoning_effort === "none", enviados[1].reasoning_effort);
    checar("e as ferramentas continuam no pedido", Array.isArray(enviados[1].tools) && (enviados[1].tools as unknown[]).length === 1);
    checar("a conversa chega ao fim", r.texto === "pronto", r);
  }

  secao("provedor: sem ferramentas, nao mexe no raciocinio");
  {
    const enviados: Array<Record<string, unknown>> = [];
    const buscar = (async (_u: string, init: RequestInit) => {
      enviados.push(JSON.parse(String(init.body)) as Record<string, unknown>);
      const sse = 'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n';
      return { ok: true, status: 200, headers: { get: () => null }, body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(sse)); c.close(); } }) } as unknown as Response;
    }) as unknown as typeof fetch;
    const p = criarProvedor({ servico: "openai", url: "", chave: "sk-x", modelo: "gpt-6.1-sol", ajustes: {}, cache: false, fetch: buscar });
    await p.conversar({ mensagens: [{ role: "user", content: "oi" }], tools: [] }, new AbortController().signal, () => undefined);
    checar("pedido limpo, sem reasoning_effort", enviados[0].reasoning_effort === undefined, enviados[0]);
  }

  secao("provedor: a mensagem explica em portugues");
  {
    const corpo = 'Function tools with reasoning_effort are not supported for gpt-6.1-sol in /v1/chat/completions. To use function tools, use /v1/responses or set reasoning to "none".';
    const m = mensagemDeErro(400, corpo, "openai");
    checar("diz que o modelo nao combina raciocinio com ferramentas", /racioc\u00EDnio/i.test(m), m);
    checar("e que o agente precisa das ferramentas para trabalhar no SEI", /ferramenta/i.test(m), m);
    checar("sugere o caminho: outro modelo", /outro modelo/i.test(m), m);
    checar("sem jargao de API na frase principal", !/\/v1\//.test(m.split(".")[0]), m);
  }

  secao("provedor: se nem assim aceitar, o erro chega ao usuario");
  {
    let vezes = 0;
    const buscar = (async () => {
      vezes += 1;
      return {
        ok: false,
        status: 400,
        headers: { get: () => null },
        text: async () => JSON.stringify({ error: { message: "Function tools with reasoning_effort are not supported for gpt-6.1-sol." } }),
      } as unknown as Response;
    }) as unknown as typeof fetch;
    const p = criarProvedor({ servico: "openai", url: "", chave: "sk-x", modelo: "gpt-6.1-sol", ajustes: {}, cache: false, fetch: buscar });
    const tools = [{ type: "function" as const, function: { name: "x", description: "y", parameters: { type: "object" as const, properties: {}, additionalProperties: false as const } } }];
    const e = await lanca(() => p.conversar({ mensagens: [{ role: "user", content: "oi" }], tools }, new AbortController().signal, () => undefined));
    checar("nao entra em laco infinito", vezes <= 3, vezes);
    checar("a mensagem ao usuario e em portugues e diz o que fazer", /outro modelo/i.test(e?.message ?? ""), e?.message);
    // O texto cru do provedor nao se perde: vai no diagnostico que o botao de
    // copiar do cartao de erro leva para o chamado.
    checar("e o texto original fica no diagnostico", /reasoning_effort/.test((e as { corpo?: string })?.corpo ?? ""), (e as { corpo?: string })?.corpo);
  }
}

/**
 * Ollama local devolve 403 quando a origem chrome-extension:// não está em
 * OLLAMA_ORIGINS. Não é a chave: o aviso tem de mandar liberar a origem.
 */
export async function verificarErro403Local(): Promise<void> {
  secao("provedor: 403 de servidor local (OLLAMA_ORIGINS)");
  checar("localhost e local", enderecoLocal("http://localhost:11434/v1"));
  checar("127.0.0.1 e local", enderecoLocal("http://127.0.0.1:11434/v1"));
  checar("[::1] e local", enderecoLocal("http://[::1]:11434/v1"));
  checar("rede 192.168 e local", enderecoLocal("http://192.168.0.10:11434/v1"));
  checar("host.docker.internal-like .internal e local", enderecoLocal("http://llm.corp.internal:11434/v1"));
  checar("169.254 e local", enderecoLocal("http://169.254.1.5/v1"));
  checar("IPv6 ULA e local", enderecoLocal("http://[fd12:3456::1]:11434/v1"));
  checar("IPv6 publico nao e local", !enderecoLocal("http://[2001:db8::1]/v1"));
  checar("NVIDIA nao e local", !enderecoLocal("https://integrate.api.nvidia.com/v1"));
  checar("endereco invalido nao e local", !enderecoLocal("nada"));
  {
    const m = mensagemDeErro(403, "", "compativel", null, "http://localhost:11434/v1");
    checar("403 local cita OLLAMA_ORIGINS", /OLLAMA_ORIGINS/.test(m), m);
    checar("403 local nao afirma que a chave foi recusada", !/chave do .* foi recusada/.test(m), m);
    checar("403 local cobre o Firefox", /moz-extension/.test(m), m);
    checar("403 local nao presume Ollama: manda conferir a chave se nao for", /Se n\u00E3o for o Ollama/.test(m), m);
    checar("403 local aponta a documentacao", /CHAVEIA/.test(m), m);
  }
  checar("401 local continua falando da chave", /foi recusada/.test(mensagemDeErro(401, "", "compativel", null, "http://localhost:11434/v1")));
  checar("403 remoto continua falando da chave", /foi recusada/.test(mensagemDeErro(403, "", "compativel", null, "https://api.groq.com/openai/v1")));
  checar("403 da OpenAI continua falando da chave", /foi recusada/.test(mensagemDeErro(403, "", "openai")));
  {
    const { f } = espiao([{ status: 403, corpo: "" }]);
    const p = criarProvedor({ servico: "compativel", url: "http://localhost:11434/v1", chave: "ollama", modelo: "qwen", fetch: f });
    let msg = "";
    try {
      await p.conversar(PEDIDO, new AbortController().signal, () => {});
    } catch (e) {
      msg = (e as Error).message;
    }
    checar("conversa com Ollama local: 403 vira aviso de OLLAMA_ORIGINS", /OLLAMA_ORIGINS/.test(msg), msg);
  }
  {
    const { f } = espiao([{ status: 403, corpo: "" }]);
    let msg = "";
    try {
      await listarModelos({ servico: "compativel", url: "http://localhost:11434/v1", chave: "ollama", fetch: f });
    } catch (e) {
      msg = (e as Error).message;
    }
    checar("Atualizar com 403 local tambem cita OLLAMA_ORIGINS", /OLLAMA_ORIGINS/.test(msg), msg);
  }
}

/** Com catálogo no compatível, o painel usa <select> (lista sempre aberta). */
export async function verificarCampoModeloSelect(): Promise<void> {
  secao("provedor: campo de modelo (select vs digitacao)");
  checar("openrouter sempre select", campoModeloEhSelect("openrouter", false));
  checar("openai sempre select", campoModeloEhSelect("openai", true));
  checar("compativel sem catalogo: digitacao", !campoModeloEhSelect("compativel", false));
  checar("compativel com catalogo: select", campoModeloEhSelect("compativel", true));
  checar("compativel com catalogo e Outro: volta a digitar", !campoModeloEhSelect("compativel", true, true));
  checar("Outro nao afeta os demais servicos", campoModeloEhSelect("openrouter", true, true));
}

/** Atalhos de endereço: select em vez de datalist (lista sempre abre completa). */
export async function verificarSelectEndereco(): Promise<void> {
  secao("provedor: select de endereco (atalhos vs digitar)");
  checar("localhost e atalho Ollama", atalhoDeEndereco("http://localhost:11434/v1/")?.nome.includes("Ollama") === true);
  checar("barra final nao impede o atalho", valorSelectEndereco("http://localhost:11434/v1/") === "http://localhost:11434/v1");
  checar("NVIDIA e atalho", valorSelectEndereco("https://integrate.api.nvidia.com/v1") === "https://integrate.api.nvidia.com/v1");
  checar("URL customizada e Outro", valorSelectEndereco("https://llm.orgao.gov.br/v1") === ENDERECO_OUTRO);
  checar("vazio e Outro", valorSelectEndereco("") === ENDERECO_OUTRO);
  checar("atalho desconhecido nao existe", atalhoDeEndereco("https://exemplo.invalid/v1") === undefined);
}

/** Leitura de figuras (ver_imagem): o pedido com imagem, o catálogo e o recado de modelo sem visão. */
function catalogoFalso(corpo: string) {
  const chamadas: string[] = [];
  const f = (async (url: string) => (chamadas.push(String(url)), { ok: true, status: 200, json: async () => JSON.parse(corpo) as unknown, text: async () => corpo })) as unknown as typeof fetch;
  return { chamadas, f };
}

export async function verificarImagemNoProvedor(): Promise<void> {
  secao("provedor: imagens");
  const catalogo = JSON.stringify({
    data: [
      { id: "anthropic/claude-sonnet-5", name: "Claude", context_length: 1, supported_parameters: ["tools"], pricing: { prompt: "0", completion: "0" }, architecture: { input_modalities: ["text", "image"] } },
      { id: "deepseek/deepseek-chat", name: "DeepSeek", context_length: 1, supported_parameters: ["tools"], pricing: { prompt: "0", completion: "0" }, architecture: { input_modalities: ["text"] } },
    ],
  });
  const lista = await listarModelos({ servico: "openrouter", fetch: catalogoFalso(catalogo).f });
  checar("catalogo do openrouter: modelo com visao", lista.find((m) => m.id === "anthropic/claude-sonnet-5")?.imagem === true, lista);
  checar("catalogo do openrouter: modelo so de texto", lista.find((m) => m.id === "deepseek/deepseek-chat")?.imagem === false, lista);
  const openai = await listarModelos({ servico: "openai", chave: "k", fetch: espiao([{ status: 200, corpo: '{"data":[{"id":"gpt-5"}]}' }]).f });
  checar("servico sem catalogo de visao: nao sabe", openai[0]?.imagem === null, openai);

  const cat = catalogoFalso(catalogo);
  const sim = await aceitaImagem({ servico: "openrouter", modelo: "anthropic/claude-sonnet-5", fetch: cat.f });
  const nao = await aceitaImagem({ servico: "openrouter", modelo: "deepseek/deepseek-chat", fetch: cat.f });
  checar("aceitaImagem pelo catalogo", sim === true && nao === false, { sim, nao });
  checar("o catalogo e buscado uma vez so", cat.chamadas.length === 1, cat.chamadas.length);
  checar("modelo fora do catalogo: nao sabe", (await aceitaImagem({ servico: "openrouter", modelo: "x/y", fetch: cat.f })) === null);
  checar("fora do openrouter: nao sabe", (await aceitaImagem({ servico: "compativel", modelo: "llava" })) === null);

  checar("erro de imagem: 'does not support image input'", ehErroDeImagem(400, '{"error":{"message":"This model does not support image input"}}'));
  checar("erro de imagem: vision", ehErroDeImagem(400, "model has no vision capability"));
  checar("erro de imagem: modalidade", ehErroDeImagem(422, "unsupported input modality"));
  checar("erro de imagem: image_url", ehErroDeImagem(400, "Unknown content type image_url"));
  checar("erro de imagem: outro 400 nao", !ehErroDeImagem(400, "context length exceeded"));
  checar("erro de imagem: 500 nao", !ehErroDeImagem(500, "image"));
  checar("recado de modelo sem visao", /n\u00E3o enxerga imagem/.test(mensagemDeErro(400, "This model does not support image input", "compativel")));

  const partes = [{ type: "text" as const, text: "descreva" }, { type: "image_url" as const, image_url: { url: "data:image/jpeg;base64,AAAA" } }];
  const pedido: PedidoLLM = { mensagens: [{ role: "system", content: "s" }, { role: "user", content: partes }], tools: [] };
  const env = espiao([]);
  await criarProvedor({ servico: "anthropic", chave: "k", modelo: "claude-sonnet-5", fetch: env.f }).conversar(pedido, new AbortController().signal, () => {});
  const enviadas = env.chamadas[0].corpo.messages as Array<{ content: unknown }>;
  checar("as partes vao intactas no corpo", JSON.stringify(enviadas[1].content) === JSON.stringify(partes), enviadas);
  checar("comCache aceita partes", Array.isArray(comCache(pedido.mensagens, "claude-sonnet-5", "anthropic")));
  checar("limparAssinaturas aceita partes", limparAssinaturasDeOutro(pedido.mensagens, "gpt-5", "openai").length === 2);
}
