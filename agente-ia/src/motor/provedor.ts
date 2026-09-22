/**
 * Provedor do modelo: `POST /chat/completions` com streaming (SSE).
 *
 * Dois serviços, o mesmo formato (o da API da OpenAI):
 *
 * - **OpenRouter** (padrão): catálogo com preço e custo por requisição, e
 *   `provider.data_collection: "deny"`, que só deixa rotear para provedores
 *   que não guardam nem treinam com o que recebem.
 * - **Compatível com OpenAI**: qualquer endereço que fale o mesmo protocolo —
 *   NVIDIA, Groq, um vLLM ou Ollama do próprio órgão. Sem catálogo de preços
 *   (o painel passa a mostrar tokens) e sem garantia de política de dados:
 *   quem escolhe o endereço responde por ele.
 *
 * Tudo sai direto do painel (página da extensão), sem backend no meio: a chave
 * do usuário vai do navegador dele para o serviço e para mais ninguém. O
 * OpenRouter responde com `Access-Control-Allow-Origin: *`; os outros, não —
 * por isso o painel pede permissão de host antes de usar um endereço novo.
 *
 * O streaming traz as chamadas de tool em fragmentos (`delta.tool_calls[i]`
 * com pedaços de `arguments`); `Acumulador` junta pelo índice.
 */

import type { ChamadaTool, PedidoLLM, Provedor, RespostaLLM, Uso } from "./tipos";

export const URL_OPENROUTER = "https://openrouter.ai/api/v1";
export const MODELO_PADRAO = "anthropic/claude-sonnet-5";

interface Delta {
  content?: string | null;
  tool_calls?: Array<{ index: number; id?: string; type?: string; function?: { name?: string; arguments?: string } }>;
}

interface Pedaco {
  choices?: Array<{ delta?: Delta; finish_reason?: string | null }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
  error?: { message?: string; code?: number | string };
}

/** Lê um corpo SSE e entrega cada `data:` já como objeto. Ignora comentários (`: OPENROUTER PROCESSING`). */
export async function* lerSSE(corpo: ReadableStream<Uint8Array>): AsyncGenerator<Pedaco> {
  const leitor = corpo.getReader();
  const dec = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await leitor.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    let fim: number;
    while ((fim = buffer.indexOf("\n")) >= 0) {
      const linha = buffer.slice(0, fim).trim();
      buffer = buffer.slice(fim + 1);
      if (!linha.startsWith("data:")) continue;
      const dado = linha.slice(5).trim();
      if (dado === "[DONE]") return;
      try {
        yield JSON.parse(dado) as Pedaco;
      } catch {
        /* linha partida ou keep-alive: ignora */
      }
    }
  }
}

/** Junta os pedaços do stream numa resposta completa. */
export class Acumulador {
  texto = "";
  fim = "";
  uso?: Uso;
  private readonly chamadas: Array<{ id: string; nome: string; args: string }> = [];

  somar(p: Pedaco, aoTexto?: (t: string) => void): void {
    if (p.error) throw new Error(p.error.message ?? "Erro do provedor de IA.");
    const escolha = p.choices?.[0];
    const d = escolha?.delta;
    if (d?.content) {
      this.texto += d.content;
      aoTexto?.(d.content);
    }
    for (const tc of d?.tool_calls ?? []) {
      const c = (this.chamadas[tc.index] ??= { id: "", nome: "", args: "" });
      if (tc.id) c.id = tc.id;
      if (tc.function?.name) c.nome += tc.function.name;
      if (tc.function?.arguments) c.args += tc.function.arguments;
    }
    if (escolha?.finish_reason) this.fim = escolha.finish_reason;
    if (p.usage) {
      this.uso = { entrada: p.usage.prompt_tokens ?? 0, saida: p.usage.completion_tokens ?? 0, custo: p.usage.cost ?? 0 };
    }
  }

  resposta(): RespostaLLM {
    const chamadas: ChamadaTool[] = this.chamadas
      .filter((c) => c && c.nome)
      .map((c, i) => ({ id: c.id || `chamada_${i}`, type: "function", function: { name: c.nome, arguments: c.args || "{}" } }));
    return { texto: this.texto, chamadas, fim: this.fim || (chamadas.length ? "tool_calls" : "stop"), uso: this.uso };
  }
}

export type Servico = "openrouter" | "compativel";

/** Atalhos de serviços compatíveis, para o usuário não precisar decorar endereço. */
export const COMPATIVEIS: Array<{ nome: string; url: string; ajuda: string }> = [
  { nome: "NVIDIA", url: "https://integrate.api.nvidia.com/v1", ajuda: "Chave nvapi-... de build.nvidia.com. O plano gratuito \u00E9 de avalia\u00E7\u00E3o: os termos da NVIDIA n\u00E3o cobrem uso em produ\u00E7\u00E3o." },
  { nome: "Groq", url: "https://api.groq.com/openai/v1", ajuda: "Chave gsk_... de console.groq.com." },
  { nome: "Ollama nesta m\u00E1quina", url: "http://localhost:11434/v1", ajuda: "Modelo rodando no pr\u00F3prio computador: nada sai da m\u00E1quina. A chave pode ser qualquer texto." },
];

export interface OpcoesProvedor {
  servico?: Servico;
  /** Endereço da API compatível (ignorado no OpenRouter). */
  url?: string;
  chave: string;
  modelo?: string;
  temperatura?: number;
  /** Para testes. */
  fetch?: typeof fetch;
}

/** `https://x/v1/` → `https://x/v1`; aceita o endereço com ou sem barra no fim. */
export function normalizarUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

const base = (o: OpcoesProvedor) => ((o.servico ?? "openrouter") === "openrouter" ? URL_OPENROUTER : normalizarUrl(o.url ?? ""));

function esperar(ms: number, sinal: AbortSignal): Promise<void> {
  return new Promise((ok, erro) => {
    const t = setTimeout(ok, ms);
    sinal.addEventListener("abort", () => (clearTimeout(t), erro(new DOMException("cancelado", "AbortError"))), { once: true });
  });
}

/** Mensagem de erro do provedor em linguagem de usuário. */
export function mensagemDeErro(status: number, corpo: string, servico: Servico = "openrouter"): string {
  let msg = corpo;
  try {
    msg = (JSON.parse(corpo) as { error?: { message?: string } }).error?.message ?? corpo;
  } catch {
    /* não é JSON */
  }
  const onde = servico === "openrouter" ? "OpenRouter" : "servi\u00E7o de IA";
  if (status === 401 || status === 403) return `A chave do ${onde} foi recusada. Confira a chave nas configura\u00E7\u00F5es do agente.`;
  if (status === 402) return `Sem cr\u00E9dito no ${onde} para este modelo. Adicione cr\u00E9ditos ou escolha um modelo mais barato.`;
  if (status === 404 && servico === "compativel") return "O endere\u00E7o do servi\u00E7o respondeu 404. Confira a URL (costuma terminar em /v1) e o nome do modelo.";
  if (status === 429) return "Muitas requisi\u00E7\u00F5es ao modelo agora. Aguarde alguns segundos e tente de novo.";
  // O pedido leva `data_collection: "deny"`: se todo provedor daquele modelo
  // guarda ou treina com os dados, o OpenRouter fica sem para onde rotear.
  if (/no allowed providers/i.test(msg)) {
    return "Nenhum provedor deste modelo passa pela pol\u00EDtica de dados: o agente s\u00F3 aceita quem n\u00E3o guarda o conte\u00FAdo, e a sua conta do OpenRouter pode bloquear outros (openrouter.ai/settings/privacy). Escolha outro modelo nas configura\u00E7\u00F5es.";
  }
  return `O provedor de IA respondeu ${status}: ${msg.slice(0, 300)}`;
}

export function criarProvedor(o: OpcoesProvedor): Provedor {
  const fazer = o.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const servico = o.servico ?? "openrouter";
  const openrouter = servico === "openrouter";
  const modelo = o.modelo || (openrouter ? MODELO_PADRAO : "");
  return {
    modelo,
    async conversar(pedido: PedidoLLM, sinal: AbortSignal, aoTexto: (t: string) => void): Promise<RespostaLLM> {
      const corpo = JSON.stringify({
        model: modelo,
        messages: pedido.mensagens,
        tools: pedido.tools.length ? pedido.tools : undefined,
        stream: true,
        temperature: o.temperatura ?? 0.2,
        // Campos só do OpenRouter: um servidor compatível pode recusar o que não conhece.
        ...(openrouter ? { parallel_tool_calls: true, usage: { include: true }, provider: { data_collection: "deny" } } : {}),
      });
      for (let tentativa = 0; ; tentativa += 1) {
        const r = await fazer(`${base(o)}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${o.chave}`,
            "Content-Type": "application/json",
            ...(openrouter ? { "HTTP-Referer": "https://sei-pro.github.io/sei-pro/", "X-Title": "SEI Pro - Agente de IA" } : {}),
          },
          body: corpo,
          signal: sinal,
        });
        if ((r.status === 429 || r.status >= 500) && tentativa < 3) {
          await esperar(1000 * 2 ** tentativa, sinal);
          continue;
        }
        if (!r.ok || !r.body) throw new Error(mensagemDeErro(r.status, await r.text(), servico));
        const acc = new Acumulador();
        for await (const pedaco of lerSSE(r.body)) acc.somar(pedaco, aoTexto);
        return acc.resposta();
      }
    },
  };
}

export interface ModeloDisponivel {
  id: string;
  nome: string;
  contexto: number;
  /** Dólares por milhão de tokens; 0 quando o serviço não informa preço. */
  precoEntrada: number;
  precoSaida: number;
}

/**
 * Modelos para o seletor do painel.
 *
 * No OpenRouter dá para filtrar os que aceitam tools (`supported_parameters`) e
 * mostrar preço. Num serviço compatível, `/models` costuma devolver só os ids:
 * o painel lista todos e avisa que nem todo modelo sabe usar ferramentas.
 */
export async function listarModelos(o: { servico?: Servico; url?: string; chave?: string; fetch?: typeof fetch } = {}): Promise<ModeloDisponivel[]> {
  const f = o.fetch ?? fetch;
  const servico = o.servico ?? "openrouter";
  const endereco = `${base({ servico, url: o.url, chave: "" })}/models`;
  if (servico !== "openrouter") {
    const r = await f(endereco, { headers: o.chave ? { Authorization: `Bearer ${o.chave}` } : {} });
    if (!r.ok) throw new Error(mensagemDeErro(r.status, await r.text(), servico));
    const j = (await r.json()) as { data?: Array<{ id: string }> };
    return (j.data ?? [])
      .map((m) => ({ id: m.id, nome: m.id, contexto: 0, precoEntrada: 0, precoSaida: 0 }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }
  const r = await f(endereco);
  const j = (await r.json()) as { data: Array<{ id: string; name: string; context_length: number; supported_parameters?: string[]; pricing: { prompt: string; completion: string } }> };
  return j.data
    .filter((m) => m.supported_parameters?.includes("tools") && !m.id.endsWith(":batch"))
    .map((m) => ({
      id: m.id,
      nome: m.name,
      contexto: m.context_length,
      precoEntrada: Number(m.pricing.prompt) * 1e6,
      precoSaida: Number(m.pricing.completion) * 1e6,
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

/** Confere a chave: `GET /key` no OpenRouter, `GET /models` autenticado nos demais. */
export async function conferirChave(o: { chave: string; servico?: Servico; url?: string; fetch?: typeof fetch }): Promise<{ ok: boolean; limite?: number | null; usado?: number }> {
  const f = o.fetch ?? fetch;
  const servico = o.servico ?? "openrouter";
  if (servico !== "openrouter") {
    const r = await f(`${base({ servico, url: o.url, chave: "" })}/models`, { headers: { Authorization: `Bearer ${o.chave}` } });
    return { ok: r.ok };
  }
  const r = await f(`${URL_OPENROUTER}/key`, { headers: { Authorization: `Bearer ${o.chave}` } });
  if (!r.ok) return { ok: false };
  const j = (await r.json()) as { data?: { limit?: number | null; usage?: number } };
  return { ok: true, limite: j.data?.limit ?? null, usado: j.data?.usage };
}
