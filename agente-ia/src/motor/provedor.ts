/**
 * Provedor do modelo: `POST /chat/completions` com streaming (SSE).
 *
 * Vários serviços, o mesmo formato (o da API da OpenAI):
 *
 * - **OpenRouter** (padrão): catálogo com preço e custo por requisição, e
 *   `provider.data_collection: "deny"`, que só deixa rotear para provedores
 *   que não guardam nem treinam com o que recebem.
 * - **OpenAI**, **Google Gemini** e **Anthropic**: endereço já pronto, para
 *   quem tem conta direto com o fabricante. Gemini e Anthropic são atendidos
 *   pela camada compatível com OpenAI que eles mesmos publicam; a Anthropic
 *   ainda exige dois cabeçalhos próprios (versão da API e a autorização
 *   explícita para chamada vinda do navegador).
 * - **Outro serviço compatível**: qualquer endereço que fale o mesmo protocolo
 *   — NVIDIA, Groq, um vLLM ou Ollama do próprio órgão. Sem catálogo de preços
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

export type Servico = "openrouter" | "openai" | "gemini" | "anthropic" | "compativel";

export interface ServicoInfo {
  nome: string;
  /** Endereço fixo do serviço; vazio no "compatível", onde quem informa é o usuário. */
  url: string;
  /** Como a chave se parece, para o campo de senha. */
  exemploChave: string;
  /** Onde criar a chave e o que o usuário precisa saber. */
  ajuda: string;
  /** Sugestão inicial de modelo (o painel confirma pela lista do serviço). */
  modeloPadrao?: string;
  /** Cabeçalhos que o serviço exige além do Authorization. */
  cabecalhos?: Record<string, string>;
}

/**
 * Os serviços que o painel oferece prontos.
 *
 * A Anthropic é o caso especial: a camada compatível com OpenAI exige o
 * cabeçalho de versão e, para chamada feita de dentro do navegador, o
 * `anthropic-dangerous-direct-browser-access` — sem ele a API recusa por CORS.
 */
export const SERVICOS: Record<Servico, ServicoInfo> = {
  openrouter: {
    nome: "OpenRouter (recomendado)",
    url: URL_OPENROUTER,
    exemploChave: "sk-or-v1-...",
    ajuda: "Cat\u00E1logo com pre\u00E7os de v\u00E1rios fabricantes e a \u00FAnica op\u00E7\u00E3o em que o agente exige provedor que n\u00E3o guarde os dados. Crie a chave em openrouter.ai/keys.",
    modeloPadrao: MODELO_PADRAO,
  },
  openai: {
    nome: "OpenAI",
    url: "https://api.openai.com/v1",
    exemploChave: "sk-...",
    ajuda: "Conta direto com a OpenAI. Crie a chave em platform.openai.com/api-keys.",
    modeloPadrao: "gpt-5",
  },
  gemini: {
    nome: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai",
    exemploChave: "AIza...",
    ajuda: "Conta direto com o Google, pela camada compat\u00EDvel com OpenAI do Gemini. Crie a chave em aistudio.google.com/apikey.",
    modeloPadrao: "gemini-2.5-flash",
  },
  anthropic: {
    nome: "Anthropic",
    url: "https://api.anthropic.com/v1",
    exemploChave: "sk-ant-...",
    ajuda: "Conta direto com a Anthropic, pela camada compat\u00EDvel com OpenAI. Crie a chave em console.anthropic.com.",
    modeloPadrao: "claude-sonnet-5",
    cabecalhos: { "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
  },
  compativel: {
    nome: "Outro servi\u00E7o compat\u00EDvel (avan\u00E7ado)",
    url: "",
    exemploChave: "chave do servi\u00E7o",
    ajuda: "Endere\u00E7o que fala o protocolo da OpenAI, terminando em /v1. O navegador vai pedir sua autoriza\u00E7\u00E3o para falar com ele.",
  },
};

/** Atalhos de endereço para o serviço "compatível", para não decorar URL. */
export const COMPATIVEIS: Array<{ nome: string; url: string; ajuda: string }> = [
  { nome: "NVIDIA", url: "https://integrate.api.nvidia.com/v1", ajuda: "Chave nvapi-... de build.nvidia.com. O plano gratuito \u00E9 de avalia\u00E7\u00E3o: os termos da NVIDIA n\u00E3o cobrem uso em produ\u00E7\u00E3o." },
  { nome: "Groq", url: "https://api.groq.com/openai/v1", ajuda: "Chave gsk_... de console.groq.com." },
  { nome: "Ollama nesta m\u00E1quina", url: "http://localhost:11434/v1", ajuda: "Modelo rodando no pr\u00F3prio computador: nada sai da m\u00E1quina. A chave pode ser qualquer texto." },
];

/**
 * Controle fino do modelo (a antiga "configuração avançada" do chat de IA).
 * Campo em branco é campo não enviado: cada serviço tem o seu padrão.
 */
export interface Ajustes {
  temperatura?: number;
  topP?: number;
  /** Teto de tokens da resposta. */
  maxTokens?: number;
  penalidadeFrequencia?: number;
  penalidadePresenca?: number;
}

/** O que o agente usa quando o usuário não mexeu em nada. */
export const TEMPERATURA_PADRAO = 0.2;

export interface OpcoesProvedor {
  servico?: Servico;
  /** Endereço da API compatível (ignorado quando o serviço tem endereço fixo). */
  url?: string;
  chave: string;
  modelo?: string;
  temperatura?: number;
  ajustes?: Ajustes;
  /** Para testes. */
  fetch?: typeof fetch;
}

/** Endereço do serviço, já normalizado. */
export function enderecoDoServico(servico: Servico, url?: string): string {
  return SERVICOS[servico]?.url || normalizarUrl(url ?? "");
}

/** `https://x/v1/` → `https://x/v1`; aceita o endereço com ou sem barra no fim. */
export function normalizarUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

const base = (o: { servico?: Servico; url?: string }) => enderecoDoServico(o.servico ?? "openrouter", o.url);

/** Authorization mais o que o serviço exigir (a Anthropic exige dois cabeçalhos). */
function cabecalhos(servico: Servico, chave: string): Record<string, string> {
  return { Authorization: `Bearer ${chave}`, ...(SERVICOS[servico]?.cabecalhos ?? {}) };
}

/** Só os parâmetros que o usuário definiu; em branco é campo que não vai no pedido. */
function parametrosDoModelo(o: OpcoesProvedor): Record<string, number> {
  const a = o.ajustes ?? {};
  const pares: Array<[string, number | undefined]> = [
    ["temperature", a.temperatura ?? o.temperatura ?? TEMPERATURA_PADRAO],
    ["top_p", a.topP],
    ["max_tokens", a.maxTokens],
    ["frequency_penalty", a.penalidadeFrequencia],
    ["presence_penalty", a.penalidadePresenca],
  ];
  return Object.fromEntries(pares.filter(([, v]) => typeof v === "number" && Number.isFinite(v))) as Record<string, number>;
}

/**
 * Parâmetro que o serviço recusou, pelo texto do erro 400.
 *
 * Os fabricantes divergem: modelos novos da OpenAI só aceitam a temperatura
 * padrão e trocaram `max_tokens` por `max_completion_tokens`; o Gemini ignora
 * umas penalidades e a Anthropic recusa outras. Em vez de manter uma tabela do
 * que cada modelo aceita — que envelhece mal —, o pedido é refeito sem o campo
 * que a mensagem citou.
 */
export function parametroRecusado(corpo: string): string | null {
  const nomes = ["temperature", "top_p", "max_tokens", "frequency_penalty", "presence_penalty"];
  const texto = corpo.toLowerCase();
  return nomes.find((n) => texto.includes(n)) ?? null;
}

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
  const onde = SERVICOS[servico]?.nome.replace(/ \(.*\)$/, "") ?? "servi\u00E7o de IA";
  if (status === 401 || status === 403) return `A chave do ${onde} foi recusada. Confira a chave nas configura\u00E7\u00F5es do agente.`;
  if (status === 402) return `Sem cr\u00E9dito no ${onde} para este modelo. Adicione cr\u00E9ditos ou escolha um modelo mais barato.`;
  if (status === 404 && servico !== "openrouter") return `O ${onde} respondeu 404. Confira o endere\u00E7o (costuma terminar em /v1) e o nome do modelo.`;
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
      const parametros = parametrosDoModelo(o);
      const recusados = new Set<string>();
      const montar = () =>
        JSON.stringify({
          model: modelo,
          messages: pedido.mensagens,
          tools: pedido.tools.length ? pedido.tools : undefined,
          stream: true,
          ...Object.fromEntries(Object.entries(parametros).filter(([k]) => !recusados.has(k))),
          // Campos só do OpenRouter: um servidor compatível pode recusar o que não conhece.
          ...(openrouter ? { parallel_tool_calls: true, usage: { include: true }, provider: { data_collection: "deny" } } : {}),
        });
      for (let tentativa = 0; ; tentativa += 1) {
        const r = await fazer(`${base(o)}/chat/completions`, {
          method: "POST",
          headers: {
            ...cabecalhos(servico, o.chave),
            "Content-Type": "application/json",
            ...(openrouter ? { "HTTP-Referer": "https://sei-pro.github.io/sei-pro/", "X-Title": "SEI Pro - Agente de IA" } : {}),
          },
          body: montar(),
          signal: sinal,
        });
        if ((r.status === 429 || r.status >= 500) && tentativa < 3) {
          await esperar(1000 * 2 ** tentativa, sinal);
          continue;
        }
        if (r.status === 400) {
          // Ajuste fino que este modelo não aceita: tira o campo citado e repete.
          const texto = await r.text();
          const culpado = parametroRecusado(texto);
          if (culpado && !recusados.has(culpado) && culpado in parametros) {
            recusados.add(culpado);
            continue;
          }
          throw new Error(mensagemDeErro(400, texto, servico));
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
  const endereco = `${base({ servico, url: o.url })}/models`;
  if (servico !== "openrouter") {
    const r = await f(endereco, { headers: o.chave ? cabecalhos(servico, o.chave) : {} });
    if (!r.ok) throw new Error(mensagemDeErro(r.status, await r.text(), servico));
    const j = (await r.json()) as { data?: Array<{ id: string; display_name?: string }> };
    return (j.data ?? [])
      // O Gemini devolve "models/gemini-2.5-flash"; o pedido quer o id sem o prefixo.
      .map((m) => ({ id: m.id.replace(/^models\//, ""), nome: m.display_name ?? m.id.replace(/^models\//, ""), contexto: 0, precoEntrada: 0, precoSaida: 0 }))
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
    const r = await f(`${base({ servico, url: o.url })}/models`, { headers: cabecalhos(servico, o.chave) });
    return { ok: r.ok };
  }
  const r = await f(`${URL_OPENROUTER}/key`, { headers: { Authorization: `Bearer ${o.chave}` } });
  if (!r.ok) return { ok: false };
  const j = (await r.json()) as { data?: { limit?: number | null; usage?: number } };
  return { ok: true, limite: j.data?.limit ?? null, usado: j.data?.usage };
}
