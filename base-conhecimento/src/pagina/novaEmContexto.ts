/**
 * "Nova em contexto": intenção de uso único (a pasta escolhida) gravada ao
 * clicar em Nova, consumida no retorno do cadastro. Fica no chrome.storage.local,
 * expira em 10 minutos e só vale para o mesmo host/unidade. Nunca toca no SEI.
 */

import type { Area } from "@comum/armazenamento/area";
import type { IdentidadeArvore } from "../arvore/modelo";

export interface Intencao {
  host: string;
  unidade: string;
  pastaId: string;
  /** Caminho na hora do clique (para a faixa e os avisos). */
  caminho: string;
  criadoEm: number;
}

export const CHAVE_INTENCAO = "spro_bc_nova_pasta";
export const TTL_INTENCAO_MS = 10 * 60_000;

export async function gravarIntencao(
  area: Area,
  ident: IdentidadeArvore,
  pastaId: string,
  caminho: string,
  agora = Date.now(),
): Promise<void> {
  await area.gravar({
    [CHAVE_INTENCAO]: { host: ident.host, unidade: ident.unidade, pastaId, caminho, criadoEm: agora },
  });
}

function comoIntencao(v: unknown): Intencao | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Partial<Intencao>;
  if (
    typeof o.host !== "string" ||
    typeof o.unidade !== "string" ||
    typeof o.pastaId !== "string" ||
    typeof o.caminho !== "string" ||
    typeof o.criadoEm !== "number" ||
    !Number.isFinite(o.criadoEm)
  ) {
    return null;
  }
  return { host: o.host, unidade: o.unidade, pastaId: o.pastaId, caminho: o.caminho, criadoEm: o.criadoEm };
}

/** Válida (mesma identidade e dentro do TTL); null se ausente ou inválida. */
export async function lerIntencao(area: Area, ident: IdentidadeArvore, agora = Date.now()): Promise<Intencao | null> {
  const intencao = comoIntencao((await area.obter(CHAVE_INTENCAO))[CHAVE_INTENCAO]);
  if (!intencao) return null;
  if (intencao.host !== ident.host || intencao.unidade !== ident.unidade) return null;
  if (agora - intencao.criadoEm > TTL_INTENCAO_MS) return null;
  return intencao;
}

export async function limparIntencao(area: Area): Promise<void> {
  await area.remover(CHAVE_INTENCAO);
}

/**
 * Área apoiada na sessionStorage: a intenção é da ABA. Duas abas do SEI na lista
 * não compartilham (nem limpam) a intenção uma da outra.
 */
export function areaDaAba(s: Pick<Storage, "getItem" | "setItem" | "removeItem" | "length" | "key">): Area {
  const chavesDaSessao = (): string[] => {
    const ks: string[] = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k !== null) ks.push(k);
    }
    return ks;
  };
  return {
    async obter(chaves = null) {
      const lista = chaves === null ? chavesDaSessao() : typeof chaves === "string" ? [chaves] : chaves;
      const saida: Record<string, unknown> = {};
      for (const k of lista) {
        const bruto = s.getItem(k);
        if (bruto === null) continue;
        try {
          saida[k] = JSON.parse(bruto);
        } catch {
          // Valor corrompido na sessão: ignora (a intenção simplesmente não existe).
        }
      }
      return saida;
    },
    async gravar(itens) {
      for (const [k, v] of Object.entries(itens)) s.setItem(k, JSON.stringify(v));
    },
    async remover(chaves) {
      for (const k of typeof chaves === "string" ? [chaves] : chaves) s.removeItem(k);
    },
    aoMudar() {
      return () => undefined;
    },
  };
}

const ID_NUMERICO = /^\d+$/;

/** `{ id }` quando a URL é o retorno de criação; null nos demais casos. */
export function sinalDeCriacao(url: string): { id: string } | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const p = u.searchParams;
  if (p.get("acao") !== "base_conhecimento_listar") return null;
  if (p.get("acao_origem") !== "base_conhecimento_cadastrar") return null;
  if (p.get("resultado") !== "1") return null;
  const id = p.get("id_base_conhecimento");
  if (!id || !ID_NUMERICO.test(id)) return null;
  return { id };
}

const CSS_FAIXA = `:host{all:initial}
.faixa{display:flex;align-items:center;gap:12px;margin:0 0 10px;padding:8px 12px;border-radius:4px;background:#e7f0f8;color:#155f9b;font:12px system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.texto{flex:1}
.nao-organizar{min-height: 44px;padding:0 10px;border:1px solid #155f9b;border-radius:4px;background:#fff;color:#155f9b;font:inherit;font-weight:600;cursor:pointer}
.nao-organizar:hover{background:#d7e7f4}
.nao-organizar:focus-visible{outline:2px solid #155f9b;outline-offset:2px}`;

/**
 * Faixa da tela de cadastro: mostra o destino antes de criar (visual do SEI,
 * Shadow DOM). O botão limpa a intenção; falar com a área é de quem chama.
 */
export function montarFaixaDestino(doc: Document, intencao: Intencao, aoNaoOrganizar: () => void): { raiz: HTMLElement; destruir(): void } {
  const host = doc.createElement("div");
  host.className = "spro-bc-faixa";
  const raiz = host.attachShadow({ mode: "open" });

  const estilo = doc.createElement("style");
  estilo.textContent = CSS_FAIXA;

  const texto = doc.createElement("span");
  texto.className = "texto";
  texto.textContent = `Será organizado em: "${intencao.caminho}".`;

  const botao = doc.createElement("button");
  botao.type = "button";
  botao.className = "nao-organizar";
  botao.setAttribute("aria-label", "Não organizar");
  botao.textContent = "Não organizar";

  const caixa = doc.createElement("div");
  caixa.className = "faixa";
  caixa.append(texto, botao);
  raiz.append(estilo, caixa);

  const destruir = (): void => {
    host.remove();
  };
  botao.addEventListener("click", () => {
    destruir();
    aoNaoOrganizar();
  });

  return { raiz: host, destruir };
}
