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
  tool_calls?: Array<{ index?: number; id?: string; type?: string; function?: { name?: string; arguments?: string }; extra_content?: unknown }>;
}

interface Pedaco {
  choices?: Array<{ delta?: Delta; finish_reason?: string | null }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number; prompt_tokens_details?: { cached_tokens?: number } };
  error?: { message?: string; code?: number | string };
}

/** O provedor parou de responder no meio do stream (ver `SILENCIO_MAXIMO`). */
export class ErroStreamParado extends Error {
  constructor() {
    super("O servi\u00E7o de IA parou de responder no meio da resposta. O que chegou at\u00E9 aqui foi mantido.");
    this.name = "ErroStreamParado";
  }
}

/** Lê um corpo SSE e entrega cada `data:` já como objeto. Ignora comentários (`: OPENROUTER PROCESSING`). */
/**
 * Silêncio que faz desistir do stream.
 *
 * O provedor pode deixar a conexão aberta sem mandar `[DONE]` nem mais nada —
 * visto em captura de rede do OpenRouter. Sem isto, `read()` fica pendurado
 * para sempre: o painel mostra "pensando" eternamente e a rodada nunca fecha.
 * O relógio reinicia a cada PEDAÇO recebido, inclusive os comentários de
 * keep-alive, para não matar modelo lento que ainda está trabalhando.
 */
export const SILENCIO_MAXIMO = 90_000;

export async function* lerSSE(corpo: ReadableStream<Uint8Array>, silencioMaximo = SILENCIO_MAXIMO): AsyncGenerator<Pedaco> {
  const leitor = corpo.getReader();
  const dec = new TextDecoder();
  let buffer = "";
  for (;;) {
    let relogio: ReturnType<typeof setTimeout> | undefined;
    const semResposta = new Promise<"silencio">((ok) => {
      relogio = setTimeout(() => ok("silencio"), silencioMaximo);
    });
    const leitura = await Promise.race([leitor.read(), semResposta]);
    clearTimeout(relogio);
    if (leitura === "silencio") {
      // Larga o corpo pendurado e devolve o que já chegou: o texto parcial é
      // melhor que um painel travado, e o motor precisa poder seguir.
      await leitor.cancel().catch(() => undefined);
      throw new ErroStreamParado();
    }
    const { value, done } = leitura;
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
  private readonly chamadas: Array<{ id: string; nome: string; args: string; extra?: unknown }> = [];

  somar(p: Pedaco, aoTexto?: (t: string) => void): void {
    if (p.error) throw new Error(p.error.message ?? "Erro do provedor de IA.");
    const escolha = p.choices?.[0];
    const d = escolha?.delta;
    if (d?.content) {
      this.texto += d.content;
      aoTexto?.(d.content);
    }
    for (const tc of d?.tool_calls ?? []) {
      // O Gemini manda a chamada inteira num pedaço só e SEM `index`; a OpenAI e
      // o OpenRouter mandam em fragmentos numerados. Sem índice, um `id` novo
      // abre outra chamada e o resto continua a última.
      const i = typeof tc.index === "number" ? tc.index : tc.id && this.chamadas.length ? this.chamadas.length : Math.max(0, this.chamadas.length - 1);
      const c = (this.chamadas[i] ??= { id: "", nome: "", args: "" });
      if (tc.id) c.id = tc.id;
      // Assinatura do Gemini 3: chega no primeiro fragmento e precisa voltar
      // intacta na próxima rodada, senão a API recusa o histórico.
      if (tc.extra_content !== undefined) c.extra = tc.extra_content;
      if (tc.function?.name) c.nome += tc.function.name;
      if (tc.function?.arguments) c.args += tc.function.arguments;
    }
    if (escolha?.finish_reason) this.fim = escolha.finish_reason;
    if (p.usage) {
      this.uso = {
        entrada: p.usage.prompt_tokens ?? 0,
        saida: p.usage.completion_tokens ?? 0,
        custo: p.usage.cost ?? 0,
        ...(p.usage.prompt_tokens_details?.cached_tokens ? { cache: p.usage.prompt_tokens_details.cached_tokens } : {}),
      };
    }
  }

  resposta(): RespostaLLM {
    const chamadas: ChamadaTool[] = this.chamadas
      .filter((c) => c && c.nome)
      .map((c, i) => ({ id: c.id || `chamada_${i}`, type: "function" as const, function: { name: c.nome, arguments: c.args || "{}" }, ...(c.extra !== undefined ? { extra_content: c.extra } : {}) }));
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
  /** O que o usuário precisa saber, sem endereços soltos no meio do texto. */
  ajuda: string;
  /** Página do fabricante onde a chave é criada. */
  painelChave?: { texto: string; url: string };
  /** Âncora do passo a passo na documentação do SEI Pro. */
  ancoraDoc?: string;
  /** Sugestão inicial de modelo (o painel confirma pela lista do serviço). */
  modeloPadrao?: string;
  /** Cabeçalhos que o serviço exige além do Authorization. */
  cabecalhos?: Record<string, string>;
}

/** Passo a passo de como conseguir a chave de cada serviço. */
export const DOC_CHAVES = "https://seipro.app/pages/CHAVEIA.html";

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
    ajuda: "Cat\u00E1logo com pre\u00E7os de v\u00E1rios fabricantes e a \u00FAnica op\u00E7\u00E3o em que o agente exige provedor que n\u00E3o guarde os dados.",
    painelChave: { texto: "openrouter.ai/keys", url: "https://openrouter.ai/keys" },
    ancoraDoc: "openrouter",
    modeloPadrao: MODELO_PADRAO,
  },
  openai: {
    nome: "OpenAI",
    url: "https://api.openai.com/v1",
    exemploChave: "sk-...",
    ajuda: "Conta direto com a OpenAI (ChatGPT). A cobran\u00E7a \u00E9 por uso da API, separada da assinatura do ChatGPT.",
    painelChave: { texto: "platform.openai.com/api-keys", url: "https://platform.openai.com/api-keys" },
    ancoraDoc: "openai",
    modeloPadrao: "gpt-5",
  },
  gemini: {
    nome: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai",
    exemploChave: "AIza...",
    ajuda: "Conta direto com o Google, pela camada compat\u00EDvel com OpenAI do Gemini.",
    painelChave: { texto: "aistudio.google.com/apikey", url: "https://aistudio.google.com/apikey" },
    ancoraDoc: "gemini",
    modeloPadrao: "gemini-2.5-flash",
  },
  anthropic: {
    nome: "Anthropic",
    url: "https://api.anthropic.com/v1",
    exemploChave: "sk-ant-...",
    ajuda: "Conta direto com a Anthropic (Claude), pela camada compat\u00EDvel com OpenAI.",
    painelChave: { texto: "console.anthropic.com", url: "https://console.anthropic.com/settings/keys" },
    ancoraDoc: "anthropic",
    modeloPadrao: "claude-sonnet-5",
    cabecalhos: { "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
  },
  compativel: {
    nome: "Outro servi\u00E7o compat\u00EDvel (avan\u00E7ado)",
    url: "",
    exemploChave: "chave do servi\u00E7o",
    ajuda: "Endere\u00E7o que fala o protocolo da OpenAI, terminando em /v1 \u2014 NVIDIA, Groq, Ollama ou um servidor do pr\u00F3prio \u00F3rg\u00E3o.",
    ancoraDoc: "outro-servico-compativel",
  },
};

/**
 * No serviço "compatível" o campo de modelo era um `<input list=datalist>`. O
 * datalist do navegador SÓ sugere o que casa com o texto atual: com um modelo
 * já escolhido, a setinha não reabria a lista. Com o catálogo carregado usamos
 * um `<select>`, que sempre mostra tudo; a opção "Outro" (`outro`) devolve o
 * campo livre para um modelo fora da lista. Sem catálogo (servidor sem
 * /models, ou ainda sem clicar em Atualizar) o campo livre continua.
 */
export function campoModeloEhSelect(servico: Servico, catalogoCarregado: boolean, outro = false): boolean {
  return servico !== "compativel" || (catalogoCarregado && !outro);
}

/** Valor da opção "Outro" no select de modelos (n\u00E3o \u00E9 id de modelo real). */
export const MODELO_OUTRO = "__outro__";

/** Atalhos de endereço para o serviço "compatível", para não decorar URL. */
export const COMPATIVEIS: Array<{ nome: string; url: string; ajuda: string }> = [
  { nome: "NVIDIA", url: "https://integrate.api.nvidia.com/v1", ajuda: "Chave nvapi-... de build.nvidia.com. O plano gratuito \u00E9 de avalia\u00E7\u00E3o: os termos da NVIDIA n\u00E3o cobrem uso em produ\u00E7\u00E3o." },
  { nome: "Groq", url: "https://api.groq.com/openai/v1", ajuda: "Chave gsk_... de console.groq.com." },
  { nome: "Ollama nesta m\u00E1quina", url: "http://localhost:11434/v1", ajuda: "Modelo rodando no pr\u00F3prio computador: nada sai da m\u00E1quina. A chave pode ser qualquer texto. Antes, libere a extens\u00E3o no Ollama (OLLAMA_ORIGINS) e reinicie-o; sem isso a conversa falha com 403. Passo a passo na documenta\u00E7\u00E3o." },
];

/** Valor do select de atalhos quando o usuário digita a URL à mão. */
export const ENDERECO_OUTRO = "";

/** Atalho conhecido (NVIDIA, Groq, Ollama…) para esta URL, se houver. */
export function atalhoDeEndereco(url: string): (typeof COMPATIVEIS)[number] | undefined {
  const n = normalizarUrl(url);
  return COMPATIVEIS.find((c) => c.url === n);
}

/**
 * Valor do <select> de endereço: URL do atalho, ou `ENDERECO_OUTRO` (= digitar).
 * O datalist filtrava pelo texto atual e escondia os atalhos com o campo cheio;
 * o select sempre lista todos, e "Outro" preserva URL livre.
 */
export function valorSelectEndereco(url: string): string {
  return atalhoDeEndereco(url)?.url ?? ENDERECO_OUTRO;
}

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
  /** Marcação de cache de prompt (padrão: ligada). */
  cache?: boolean;
  /** Silêncio tolerado no meio do stream, em ms (ver `SILENCIO_MAXIMO`). Para testes. */
  silencioMaximo?: number;
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
/**
 * O modelo exige que o raciocínio seja desligado para aceitar ferramentas?
 *
 * Caso real (relato de usuária, 06/10/2026): um modelo de raciocínio recusava
 * toda pergunta com "Function tools with reasoning_effort are not supported
 * for <modelo> in /v1/chat/completions. To use function tools, use
 * /v1/responses or set reasoning to \"none\"".
 *
 * O ponto que confunde: o SEI Pro NÃO envia `reasoning_effort`. Ele é o padrão
 * do próprio modelo. A saída, que a mensagem indica, é declará-lo como "none"
 * — ou seja, ACRESCENTAR um campo, enquanto o agente só sabia remover o campo
 * que o erro citasse.
 */
export function precisaDesligarRaciocinio(corpo: string): boolean {
  const texto = corpo.toLowerCase();
  return texto.includes("reasoning") && /tool|function/.test(texto);
}

export function parametroRecusado(corpo: string): string | null {
  const nomes = ["temperature", "top_p", "max_tokens", "frequency_penalty", "presence_penalty", "stream_options"];
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
/**
 * Erro do serviço de IA, com o que o diagnóstico precisa.
 *
 * A mensagem é para o usuário; `status` e `corpo` são para quem for ajudar a
 * resolver — e é isso que o botão de copiar do cartão de erro leva junto.
 */
export class ErroProvedor extends Error {
  constructor(
    mensagem: string,
    readonly status: number,
    readonly corpo: string,
  ) {
    super(mensagem);
    this.name = "ErroProvedor";
  }
}

/** O 429 é de falta de crédito (permanente) e não de pressa (passageiro)? */
export function semCredito(corpo: string): boolean {
  return /insufficient_quota|exceeded your current quota|billing|sem cr\u00E9dito/i.test(corpo);
}

/**
 * Segundos do cabeçalho `Retry-After`, que vem em segundos ou como data.
 *
 * Devolve `null` quando não há cabeçalho ou ele não faz sentido — aí vale a
 * espera dobrada de sempre.
 */
export function segundosDoRetryAfter(valor: string | null | undefined): number | null {
  if (!valor) return null;
  const n = Number(valor.trim());
  if (Number.isFinite(n) && n >= 0) return Math.round(n);
  const quando = Date.parse(valor);
  if (Number.isNaN(quando)) return null;
  return Math.max(0, Math.round((quando - Date.now()) / 1000));
}

/** Teto da espera entre tentativas: além disso, é melhor devolver o erro. */
const ESPERA_MAXIMA = 60_000;

/**
 * Quanto esperar antes de repetir o pedido.
 *
 * O provedor sabe melhor que nós: quando ele manda `Retry-After`, é esse o
 * tempo. Sem ele, dobra-se a espera. Antes era sempre 1s, 2s e 4s — curto
 * demais para um limite por MINUTO, e cada tentativa gastava mais da cota que
 * já estava estourada.
 */
export function esperaDaTentativa(tentativa: number, retryAfter: string | null | undefined): number {
  const pedido = segundosDoRetryAfter(retryAfter);
  if (pedido !== null) return Math.min(pedido * 1000, ESPERA_MAXIMA);
  return Math.min(1000 * 2 ** tentativa, ESPERA_MAXIMA);
}

/** Vale repetir este pedido, ou o erro é permanente? */
export function valeRepetir(status: number, corpo: string): boolean {
  if (status >= 500) return true;
  if (status !== 429) return false;
  return !semCredito(corpo);
}

/**
 * O endereço aponta para esta máquina (ou para a rede local)? Num servidor
 * local, 403 quase nunca é chave: o Ollama, por exemplo, não confere chave e
 * devolve 403 quando a origem `chrome-extension://...` não está em
 * OLLAMA_ORIGINS. O Chrome só manda `Origin` no POST (o GET de /models vai
 * sem), por isso "Atualizar" lista os modelos e a conversa falha.
 */
export function enderecoLocal(url: string | undefined): boolean {
  if (!url) return false;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^\[|\]$/g, "");
  } catch {
    return false;
  }
  return (
    host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") ||
    host === "::1" || host === "0.0.0.0" || /^127\./.test(host) || /^169\.254\./.test(host) ||
    /^f[cd][0-9a-f]{2}:/.test(host) || /^fe[89ab][0-9a-f]:/.test(host) ||
    /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

export function mensagemDeErro(status: number, corpo: string, servico: Servico = "openrouter", retryAfter?: string | null, url?: string): string {
  let msg = corpo;
  try {
    msg = (JSON.parse(corpo) as { error?: { message?: string } }).error?.message ?? corpo;
  } catch {
    /* não é JSON */
  }
  const onde = SERVICOS[servico]?.nome.replace(/ \(.*\)$/, "") ?? "servi\u00E7o de IA";
  if (status === 403 && servico === "compativel" && enderecoLocal(url)) {
    return (
      `O servidor local (${url}) recusou o pedido (403). Se for o Ollama, a causa quase certa n\u00E3o \u00E9 a chave (ele n\u00E3o confere chave): ` +
      "ele recusa extens\u00F5es do navegador at\u00E9 a origem delas ser liberada. Defina OLLAMA_ORIGINS=chrome-extension://*,moz-extension://* e reinicie o Ollama " +
      `(passo a passo no Windows, Mac e Linux: ${DOC_CHAVES}#outro-servico-compativel). Se n\u00E3o for o Ollama, confira a chave e as regras de acesso do servidor.`
    );
  }
  if (ehErroDeImagem(status, corpo)) return "O modelo escolhido n\u00E3o enxerga imagem. Escolha um modelo com vis\u00E3o em Configura\u00E7\u00E3o (o modelo auxiliar basta).";
  if (status === 401 || status === 403) return `A chave do ${onde} foi recusada. Confira a chave nas configura\u00E7\u00F5es do agente.`;
  if (status === 402) return `Sem cr\u00E9dito no ${onde} para este modelo. Adicione cr\u00E9ditos ou escolha um modelo mais barato.`;
  // O agente depende de ferramentas: é com elas que ele lê o processo e
  // escreve no SEI. Um modelo que não as aceita não serve aqui, por melhor que
  // seja — então a mensagem manda trocar de modelo, e não "tente de novo".
  if (status === 400 && precisaDesligarRaciocinio(corpo)) {
    return `O modelo escolhido n\u00E3o aceita, neste servi\u00E7o, combinar racioc\u00EDnio com as ferramentas que o agente usa para ler o processo e escrever no SEI. O agente j\u00E1 tentou desligar o racioc\u00EDnio e o ${onde} recusou. Escolha outro modelo nas configura\u00E7\u00F5es do agente \u2014 os da gera\u00E7\u00E3o anterior e as vers\u00F5es "mini" costumam aceitar.`;
  }
  if (status === 404 && servico !== "openrouter") return `O ${onde} respondeu 404. Confira o endere\u00E7o (costuma terminar em /v1) e o nome do modelo.`;
  if (status === 429) {
    // A OpenAI (e quem imita a API dela) devolve 429 para DUAS coisas opostas:
    // conta sem crédito e pedido rápido demais. Quem está sem crédito e lê
    // "aguarde alguns segundos" fica tentando para sempre — foi o que um
    // usuário relatou, com a tela inteira do mesmo aviso.
    if (semCredito(corpo)) {
      return `A sua conta do ${onde} est\u00E1 sem cr\u00E9dito para a API (quota esgotada). Tentar de novo n\u00E3o resolve: adicione cr\u00E9ditos na conta do ${onde} ou configure outro servi\u00E7o nas configura\u00E7\u00F5es do agente.`;
    }
    const espera = segundosDoRetryAfter(retryAfter);
    return (
      `O ${onde} limitou o ritmo${espera ? `: espere ${espera} segundos` : " de uso agora"}. ` +
      "Cada pergunta do agente leva junto o cat\u00E1logo de ferramentas do SEI (cerca de 9 mil tokens), e conta nova costuma ter limite baixo por minuto. " +
      "Se repetir, escolha um modelo com limite maior (um \"mini\" costuma ter) ou aumente o limite da sua conta."
    );
  }
  // O pedido leva `data_collection: "deny"`: se todo provedor daquele modelo
  // guarda ou treina com os dados, o OpenRouter fica sem para onde rotear.
  if (/no allowed providers/i.test(msg)) {
    return "Nenhum provedor deste modelo passa pela pol\u00EDtica de dados: o agente s\u00F3 aceita quem n\u00E3o guarda o conte\u00FAdo, e a sua conta do OpenRouter pode bloquear outros (openrouter.ai/settings/privacy). Escolha outro modelo nas configura\u00E7\u00F5es.";
  }
  return `O provedor de IA respondeu ${status}: ${msg.slice(0, 300)}`;
}

/**
 * Prepara as mensagens para o cache de prompt.
 *
 * OpenAI e Gemini fazem cache sozinhos, sem marcação. A família Claude precisa
 * que se diga ONDE termina o trecho estável (`cache_control`), e é justamente
 * ela que mais se beneficia aqui: o prompt do agente, as ferramentas e as
 * skills repetem inteiros a cada rodada da conversa.
 *
 * Dois pontos marcados, que é o que costuma render: o fim das instruções de
 * sistema e o fim do histórico anterior ao último pedido do usuário.
 */
export function comCache(mensagens: PedidoLLM["mensagens"], modelo: string, servico: Servico): PedidoLLM["mensagens"] {
  const claude = servico === "anthropic" || /(^|\/)(anthropic|claude)/i.test(modelo);
  if (!claude || !mensagens.length) return mensagens;
  const marcar = (m: PedidoLLM["mensagens"][number]) =>
    typeof m.content === "string" && m.content.length > 500
      ? ({ ...m, content: [{ type: "text", text: m.content, cache_control: { type: "ephemeral" } }] } as unknown as PedidoLLM["mensagens"][number])
      : m;
  const saida = [...mensagens];
  if (saida[0]?.role === "system") saida[0] = marcar(saida[0]);
  // O último "user" é o pedido novo; o ponto estável é o que vem antes dele.
  for (let i = saida.length - 2; i > 0; i -= 1) {
    if (saida[i].role === "assistant" || saida[i].role === "tool") {
      saida[i] = marcar(saida[i]);
      break;
    }
  }
  return saida;
}

/**
 * Tira do histórico as assinaturas que pertencem a OUTRO provedor.
 *
 * A `thought_signature` do Gemini 3 é obrigatória para ele e desconhecida para
 * os demais — e campo estranho no corpo costuma virar 400. Como o usuário pode
 * trocar de modelo no meio da conversa e o histórico continua o mesmo, a
 * limpeza acontece na hora de enviar, não na hora de guardar.
 */
export function limparAssinaturasDeOutro(mensagens: PedidoLLM["mensagens"], modelo: string, servico: Servico): PedidoLLM["mensagens"] {
  if (servico === "gemini" || /gemini/i.test(modelo)) return mensagens;
  let mexeu = false;
  const saida = mensagens.map((m) => {
    const chamadas = (m as { tool_calls?: ChamadaTool[] }).tool_calls;
    if (!Array.isArray(chamadas) || !chamadas.some((c) => c?.extra_content !== undefined)) return m;
    mexeu = true;
    return { ...m, tool_calls: chamadas.map(({ extra_content: _assinatura, ...resto }) => resto) };
  });
  return mexeu ? saida : mensagens;
}

export function criarProvedor(o: OpcoesProvedor): Provedor {
  const fazer = o.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const servico = o.servico ?? "openrouter";
  const openrouter = servico === "openrouter";
  const modelo = o.modelo || (openrouter ? MODELO_PADRAO : "");
  return {
    modelo,
    async conversar(pedido: PedidoLLM, sinal: AbortSignal, aoTexto: (t: string) => void): Promise<RespostaLLM> {
      // `stream_options` é como a OpenAI e as camadas compatíveis mandam o
      // consumo de tokens no streaming (sem ele, o painel fica sem contagem);
      // o OpenRouter usa `usage: {include: true}`, que já vai abaixo.
      const parametros: Record<string, unknown> = {
        ...parametrosDoModelo(o),
        ...(openrouter ? {} : { stream_options: { include_usage: true } }),
      };
      const recusados = new Set<string>();
      const montar = () =>
        JSON.stringify({
          model: modelo,
          messages: limparAssinaturasDeOutro(o.cache === false ? pedido.mensagens : comCache(pedido.mensagens, modelo, servico), modelo, servico),
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
            ...(openrouter ? { "HTTP-Referer": "https://seipro.app/", "X-Title": "SEI Pro - Agente de IA" } : {}),
          },
          body: montar(),
          signal: sinal,
        });
        if (r.status === 429 || r.status >= 500) {
          // O corpo só pode ser lido uma vez: lê-se aqui e o texto é
          // reaproveitado tanto para decidir quanto para a mensagem final.
          const texto = await r.text();
          const quando = r.headers?.get?.("retry-after") ?? null;
          if (valeRepetir(r.status, texto) && tentativa < 3) {
            await esperar(esperaDaTentativa(tentativa, quando), sinal);
            continue;
          }
          throw new ErroProvedor(mensagemDeErro(r.status, texto, servico, quando, base(o)), r.status, texto.slice(0, 500));
        }
        if (r.status === 400) {
          const texto = await r.text();
          // Caso conhecido da OpenAI: os modelos novos trocaram `max_tokens`
          // por `max_completion_tokens`. Renomear preserva o teto que o usuário
          // pediu; descartar o campo o perderia em silêncio.
          if (/max_completion_tokens/.test(texto) && "max_tokens" in parametros && !("max_completion_tokens" in parametros)) {
            parametros.max_completion_tokens = parametros.max_tokens;
            recusados.add("max_tokens");
            continue;
          }
          // Modelo de raciocínio que só aceita ferramentas com o raciocínio
          // desligado: aqui se ACRESCENTA o campo, em vez de remover.
          if (precisaDesligarRaciocinio(texto) && parametros.reasoning_effort !== "none") {
            parametros.reasoning_effort = "none";
            continue;
          }
          // Ajuste fino que este modelo não aceita: tira o campo citado e repete.
          const culpado = parametroRecusado(texto);
          if (culpado && !recusados.has(culpado) && culpado in parametros) {
            recusados.add(culpado);
            continue;
          }
          throw new ErroProvedor(mensagemDeErro(400, texto, servico, null, base(o)), 400, texto.slice(0, 500));
        }
        if (!r.ok || !r.body) {
          const texto = await r.text();
          throw new ErroProvedor(mensagemDeErro(r.status, texto, servico, r.headers?.get?.("retry-after") ?? null, base(o)), r.status, texto.slice(0, 500));
        }
        const acc = new Acumulador();
        try {
          for await (const pedaco of lerSSE(r.body, o.silencioMaximo)) acc.somar(pedaco, aoTexto);
        } catch (e) {
          if (!(e instanceof ErroStreamParado)) throw e;
          // Chamada de ferramenta pela metade não se executa: os argumentos
          // podem estar cortados no meio do JSON. Texto parcial, sim, vale.
          const parcial = acc.resposta();
          return { ...parcial, chamadas: [], fim: "parado", interrompida: true };
        }
        return acc.resposta();
      }
    },
  };
}

/**
 * O `/models` de cada fabricante devolve o catálogo INTEIRO — embedding,
 * transcrição, voz, imagem, vídeo e modelos antigos sem ferramentas. Num
 * seletor, isso é ruído: quem escolher um desses vê o agente falhar sem
 * entender por quê. Aqui ficam só os que conversam.
 */
const SO_CONVERSA: Partial<Record<Servico, { serve: RegExp; fora: RegExp }>> = {
  openai: { serve: /^(gpt|o\d|chatgpt)/i, fora: /embedding|tts|whisper|audio|realtime|image|dall|moderation|transcribe|search|instruct|babbage|davinci/i },
  gemini: { serve: /^gemini/i, fora: /embedding|image|imagen|veo|tts|audio|live|vision|aqa/i },
  anthropic: { serve: /^claude/i, fora: /^$/ },
};

/** Se o modelo daquele serviço serve para conversar com ferramentas. */
export function serveParaConversar(servico: Servico, id: string): boolean {
  const regra = SO_CONVERSA[servico];
  if (!regra) return true; // serviço do próprio órgão: quem sabe o que tem lá é o usuário
  return regra.serve.test(id) && !regra.fora.test(id);
}

export interface ModeloDisponivel {
  id: string;
  nome: string;
  contexto: number;
  /** Dólares por milhão de tokens; 0 quando o serviço não informa preço. */
  precoEntrada: number;
  precoSaida: number;
  /** Aceita imagem na entrada; `null` quando o serviço não informa. */
  imagem: boolean | null;
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
    if (!r.ok) throw new Error(mensagemDeErro(r.status, await r.text(), servico, null, endereco));
    const j = (await r.json()) as { data?: Array<{ id: string; display_name?: string }> };
    return (j.data ?? [])
      // O Gemini devolve "models/gemini-2.5-flash"; o pedido quer o id sem o prefixo.
      .map((m) => ({ id: m.id.replace(/^models\//, ""), nome: m.display_name ?? m.id.replace(/^models\//, ""), contexto: 0, precoEntrada: 0, precoSaida: 0, imagem: null }))
      .filter((m) => serveParaConversar(servico, m.id))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }
  const r = await f(endereco);
  const j = (await r.json()) as { data: ModeloDoOpenRouter[] };
  return j.data
    .filter((m) => m.supported_parameters?.includes("tools") && !m.id.endsWith(":batch"))
    .map((m) => ({
      id: m.id,
      nome: m.name,
      contexto: m.context_length,
      precoEntrada: Number(m.pricing.prompt) * 1e6,
      precoSaida: Number(m.pricing.completion) * 1e6,
      imagem: enxergaPeloCatalogo(m),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

interface ModeloDoOpenRouter {
  id: string;
  name: string;
  context_length: number;
  supported_parameters?: string[];
  pricing: { prompt: string; completion: string };
  architecture?: { input_modalities?: string[] };
}

const enxergaPeloCatalogo = (m: ModeloDoOpenRouter): boolean | null => (Array.isArray(m.architecture?.input_modalities) ? m.architecture.input_modalities.includes("image") : null);

/** O catálogo público do OpenRouter, uma vez por sessão (por `fetch`, para os testes não se misturarem). */
const catalogosDeVisao = new WeakMap<typeof fetch, Promise<Map<string, boolean | null>>>();

/**
 * O modelo aceita imagem? Só o OpenRouter diz de antemão (`architecture.input_modalities`);
 * nos demais serviços a resposta é `null` e quem decide é a tentativa (ver `ehErroDeImagem`).
 */
export async function aceitaImagem(o: { servico: Servico; modelo: string; fetch?: typeof fetch }): Promise<boolean | null> {
  if (o.servico !== "openrouter") return null;
  const f = o.fetch ?? fetch;
  let catalogo = catalogosDeVisao.get(f);
  if (!catalogo) {
    catalogo = f(`${URL_OPENROUTER}/models`)
      .then(async (r) => new Map(((await r.json()) as { data?: ModeloDoOpenRouter[] }).data?.map((m) => [m.id, enxergaPeloCatalogo(m)] as const) ?? []))
      .catch(() => new Map<string, boolean | null>());
    catalogosDeVisao.set(f, catalogo);
  }
  return (await catalogo).get(o.modelo) ?? null;
}

/** Recusa do serviço porque o modelo não aceita imagem (texto livre, cada serviço escreve de um jeito). */
export function ehErroDeImagem(status: number, corpo: string): boolean {
  return status >= 400 && status < 500 && /image|vision|modalit|multimodal/i.test(corpo);
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
