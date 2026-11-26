import { readFileSync } from "node:fs";
import { definirAnalisador } from "@nucleo/sessao/dom";
import type { Http, Pagina } from "@nucleo/sessao/http";
import { parseHTML } from "linkedom";

definirAnalisador((html) => parseHTML(html).document as unknown as Document);

let n = 0;

/** Executa uma verificacao; imprime OK e o numero sequencial. */
export async function teste(nome: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (e) {
    console.error(`FALHOU: ${nome}`);
    throw e;
  }
  console.log(`OK ${++n}: ${nome}`);
}

/** Condicao booleana dentro de um teste. */
export function checar(nome: string, cond: boolean): void {
  if (!cond) throw new Error(`Checagem falhou: ${nome}`);
}

/** Espera que a chamada lance; devolve o erro para o teste inspecionar. */
export async function lanca(fn: () => Promise<unknown>): Promise<unknown> {
  try {
    await fn();
  } catch (e) {
    return e;
  }
  throw new Error("Esperava um erro, mas a chamada devolveu normalmente");
}

export const docDe = (html: string): Document => parseHTML(html).document as unknown as Document;

/** Conteudo bruto de uma fixture em tests/fixtures/sei5/. */
export function fixture(nome: string): string {
  return readFileSync(new URL(`./fixtures/sei5/${nome}`, import.meta.url), "utf8");
}

export const docFixture = (nome: string): Document => docDe(fixture(nome));

/** Fixture com a primeira linha `<!-- url: ... -->` (padrao do sei-nucleo). */
export function paginaFixture(nome: string): Pagina {
  const bruto = fixture(nome);
  const url = /^<!-- url: (.*?) -->/.exec(bruto)?.[1] ?? "https://sei.exemplo.gov.br/sei/controlador.php";
  const html = bruto.replace(/^<!-- url: .*? -->\n/, "");
  let doc: Document | null = null;
  return {
    url,
    status: 200,
    html,
    get doc() {
      if (!doc) doc = docDe(html);
      return doc;
    },
  };
}

export interface RotasHttp {
  obter?: (url: string) => Pagina | Promise<Pagina>;
  enviar?: (url: string, campos: ReadonlyArray<readonly [string, string]>) => Pagina | Promise<Pagina>;
  baixar?: (url: string) => Promise<never>;
}

/** Transporte falso: cada rota devolve a pagina que o teste mandar. */
export function httpRoteado(rotas: RotasHttp): Http & {
  pedidos: string[];
  envios: Array<{ url: string; campos: Array<[string, string]> }>;
} {
  const base = new URL("https://sei.exemplo.gov.br/sei/");
  const pedidos: string[] = [];
  const envios: Array<{ url: string; campos: Array<[string, string]> }> = [];
  const vazia = (url: string): Pagina => ({
    url,
    status: 200,
    html: "<html><body></body></html>",
    doc: docDe("<html><body></body></html>"),
  });
  return {
    base,
    pedidos,
    envios,
    async obter(url: string) {
      pedidos.push(url);
      return rotas.obter ? rotas.obter(url) : vazia(url);
    },
    async enviar(url: string, campos: ReadonlyArray<readonly [string, string]>) {
      envios.push({ url, campos: campos.map(([k, v]) => [k, v]) });
      return rotas.enviar ? rotas.enviar(url, campos) : vazia(url);
    },
    absoluta(url: string) {
      return new URL(url, base).href;
    },
    async baixar(url: string) {
      pedidos.push(url);
      if (rotas.baixar) return rotas.baixar(url);
      throw new Error("baixar nao usado neste teste");
    },
  };
}
