/**
 * Transporte HTTP do núcleo: o único lugar que fala com o servidor do SEI.
 *
 * Roda em qualquer contexto da mesma origem do SEI (mundo isolado do content
 * script, mundo da página, iframe) porque usa `fetch` com os cookies da sessão.
 *
 * TODA resposta passa por `verificarPagina`, que transforma as três formas de
 * falha do SEI em erro tipado (ver `infra_php/InfraPagina.php` e
 * `InfraSessao.php` do SEI 5):
 *
 * - redirecionamento para `login.php` → sessão encerrada. Inclui "Link sem
 *   assinatura" e "Hash inválido": o SEI DESLOGA o usuário nesses casos, e é por
 *   isso que o núcleo nunca monta nem concatena link assinado;
 * - `#divInfraExcecao` → página de exceção;
 * - `#txaInfraValidacao` → mensagem de validação (o `alert` que o usuário veria).
 *
 * Substitui no legado: os `$.ajax` espalhados, `xhr: () => xhr` para ler o
 * `responseURL`, e os `replace` do cabeçalho `<?xml ... iso-8859-1?>`.
 */

import { codificarLatin1, decodificarLatin1, TIPO_FORMULARIO, type ModoLatin1 } from "./codificacao";
import { analisarHtml, textoDe } from "./dom";
import { comoErroSei, ErroSei } from "./erros";

export interface Pagina {
  /** URL final, depois dos redirecionamentos. É a prova de sucesso de muitas ações. */
  url: string;
  status: number;
  html: string;
  /** Analisado sob demanda. */
  readonly doc: Document;
}

export interface OpcoesHttp {
  sinal?: AbortSignal;
  /** Campos com conteúdo HTML (entidades em vez de perda de caractere). */
  modos?: Readonly<Record<string, ModoLatin1>>;
  /**
   * Não lançar erro em `#txaInfraValidacao`. Para telas que reexibem a
   * mensagem da operação anterior e para quem quer ler a mensagem sozinho.
   */
  aceitarValidacao?: boolean;
}

export interface Http {
  /** Raiz do SEI, terminando em `/` (ex.: `https://sei.orgao.gov.br/sei/`). */
  readonly base: URL;
  obter(url: string, op?: OpcoesHttp): Promise<Pagina>;
  enviar(url: string, campos: ReadonlyArray<readonly [string, string]>, op?: OpcoesHttp): Promise<Pagina>;
  /** Resolve `controlador.php?...` contra a raiz do SEI. */
  absoluta(url: string): string;
  /** Bytes crus (anexos, PDFs). Não passa por `verificarPagina`, salvo se a resposta for HTML. */
  baixar(url: string, op?: OpcoesHttp): Promise<Arquivo>;
}

export interface Arquivo {
  bytes: Uint8Array;
  /** Content-Type sem parâmetros. */
  tipo: string;
  /** Do Content-Disposition, quando houver. */
  nome: string;
}

export interface DependenciasHttp {
  fetch?: typeof fetch;
  /** Máximo de requisições simultâneas. O PHP serializa a sessão; mais que isso só enfileira no servidor. */
  concorrencia?: number;
}

function criarPagina(url: string, status: number, html: string): Pagina {
  let doc: Document | null = null;
  return {
    url,
    status,
    html,
    get doc() {
      return (doc ??= analisarHtml(html));
    },
  };
}

/** Lança o erro tipado correspondente, se a página for de falha. */
export function verificarPagina(p: Pagina, op: OpcoesHttp = {}): Pagina {
  if (/\/login\.php/i.test(p.url) || /[?&]acao=(?:infra_)?sair\b/.test(p.url)) {
    throw new ErroSei(
      "SEI_SESSAO_EXPIRADA",
      "A sess\u00E3o do SEI foi encerrada. Fa\u00E7a login de novo no SEI e repita o pedido.",
    );
  }
  if (p.status >= 500) {
    throw new ErroSei("SEI_EXCECAO", `O SEI respondeu com erro ${p.status}.`);
  }
  // Busca barata no texto antes de analisar o DOM: a maioria das páginas não tem nada disso.
  // O nome também aparece em JavaScript/CSS de telas normais: só vale o elemento.
  if (p.html.includes('id="divInfraExcecao"')) {
    const el = p.doc.querySelector("#divInfraExcecao");
    if (el) {
      const msg = textoDe(el);
      throw new ErroSei("SEI_EXCECAO", msg || "O SEI exibiu uma p\u00E1gina de erro.", msg);
    }
  }
  if (!op.aceitarValidacao && p.html.includes("txaInfraValidacao")) {
    const msg = p.doc.querySelector<HTMLTextAreaElement>("#txaInfraValidacao")?.textContent?.trim() ?? "";
    if (msg) throw new ErroSei("SEI_VALIDACAO", msg, msg);
  }
  return p;
}

export function criarHttp(base: string | URL, deps: DependenciasHttp = {}): Http {
  const raiz = new URL(".", base);
  const fazer = deps.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const limite = Math.max(1, deps.concorrencia ?? 3);
  let ativos = 0;
  const fila: Array<() => void> = [];

  async function vez<T>(fn: () => Promise<T>): Promise<T> {
    if (ativos >= limite) await new Promise<void>((r) => fila.push(r));
    ativos += 1;
    try {
      return await fn();
    } finally {
      ativos -= 1;
      fila.shift()?.();
    }
  }

  const absoluta = (url: string) => new URL(url.replace(/&amp;/g, "&"), raiz).href;

  async function requisitar(url: string, init: RequestInit, op: OpcoesHttp): Promise<Pagina> {
    return vez(async () => {
      try {
        const r = await fazer(absoluta(url), { credentials: "same-origin", redirect: "follow", ...init, signal: op.sinal });
        const html = decodificarLatin1(await r.arrayBuffer());
        return verificarPagina(criarPagina(r.url || absoluta(url), r.status, html), op);
      } catch (e) {
        throw comoErroSei(e);
      }
    });
  }

  async function baixar(url: string, op: OpcoesHttp = {}): Promise<Arquivo> {
    return vez(async () => {
      try {
        const r = await fazer(absoluta(url), { credentials: "same-origin", redirect: "follow", signal: op.sinal });
        const bytes = new Uint8Array(await r.arrayBuffer());
        const tipo = (r.headers?.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
        if (tipo === "text/html") verificarPagina(criarPagina(r.url || absoluta(url), r.status, decodificarLatin1(bytes)), op);
        const cd = r.headers?.get("content-disposition") ?? "";
        const nome = decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(cd)?.[1] ?? /filename="?([^";]+)"?/i.exec(cd)?.[1] ?? "");
        return { bytes, tipo, nome };
      } catch (e) {
        throw comoErroSei(e);
      }
    });
  }

  return {
    base: raiz,
    absoluta,
    baixar,
    obter: (url, op = {}) => requisitar(url, { method: "GET" }, op),
    enviar: (url, campos, op = {}) =>
      requisitar(
        url,
        { method: "POST", headers: { "Content-Type": TIPO_FORMULARIO }, body: codificarLatin1(campos, op.modos) },
        op,
      ),
  };
}
