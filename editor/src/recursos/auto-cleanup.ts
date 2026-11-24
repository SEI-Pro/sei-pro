import type { Editor } from "../adaptador/tipos";
import type { Contexto, Recurso } from "./tipos";

/**
 * Limpeza automatica de HTML (porte de `auto-cleanup.js`).
 *
 * O SEI 5 recusa o documento ("Documento possui conteudo nao permitido") quando o HTML traz residuos do CKEditor (wrapper,
 * atributos, marcadores `{cke_protected}`) ou de extensoes (Dark Reader, servicos de copia) e cores em rgb()/rgba() (so aceita
 * hexadecimal). Esta rotina remove o lixo e converte as cores: na colagem, antes de salvar e sob demanda (`limparEditorPro`).
 *
 * Estrategia (agnostica de versao, via adaptador):
 *  - SALVAR no CK5: filtro na SAIDA de dados (evento `get` do `editor.data`, o que o `getFullData` do SEI usa); model e vista
 *    nao sao tocados (reescrever o corpo jogava o cursor para o inicio e perdia o que o usuario digitava).
 *  - SALVAR no CK4: `htmlFilter` de saida do `dataProcessor`; o DOM vivo do iframe tambem fica intacto. `contenteditable` e
 *    conteudo LEGITIMO (link para protocolo do SEI, Bloquear Edicao, Legistica, sigilo, citacao) e nunca e removido.
 *  - COLAGEM no CK4: `evt.data.dataValue` limpo in-place. No CK5 o filtro de saida basta (a colagem so e tratada no caminho
 *    de reserva, quando o editor nao tem o evento `get`: limpeza do corpo no tick seguinte, via `transformBodyHtml`).
 *  - Caminho de reserva (editor sem `data.on` / sem `htmlFilter`): colagem + mousedown no botao Salvar + `change` coalescido.
 *
 * O monolito chama `registrarLimpezaAutomaticaPro(editor)` por instancia do CK4 (`setCKEDITOR_instances`); `iniciar` registra
 * o CK5 (instancia unica; idempotente, por flag na instancia).
 */

/** Atributos que nunca devem ir no conteudo salvo (nome exato). */
export const ATRIBUTOS_LIXO_PRO: string[] = [
  "contenteditable",
  "spellcheck",
  "data-editor",
  "data-processed",
  "data-complete",
  "data-hveid",
];
/** ... e por prefixo (data-cke-saved-src/href, data-sfc-*, data-copy-service-*). */
export const PREFIXOS_ATRIBUTO_LIXO_PRO: string[] = ["data-cke-saved-", "data-sfc-", "data-copy-service"];
/** Classes a remover (residuos do CKEditor e do realce de contraste do modo escuro). */
export const PREFIXOS_CLASSE_LIXO_PRO: string[] = ["cke_", "dark-mode-"];
/** Atributos da lista de lixo que sao conteudo LEGITIMO (o nome `_CK4_` fica por compatibilidade; vale no CK5 tambem). */
export const ATRIBUTOS_PRESERVADOS_CK4_PRO: string[] = ["contenteditable"];

/** Atributo de evento (on*) ou URL com esquema executavel dentro de uma tag: nunca vai para o HTML gravado. */
const ATRIBUTO_PERIGOSO_PRO =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: o navegador ignora controles no inicio da URL (`java\0script:`)
  /<[^>]*\s(on[a-z]+\s*=|(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)\s*=\s*["']?[\s\u0000- ]*(javascript|vbscript|livescript|data\s*:\s*text\/html))/i;
// biome-ignore lint/suspicious/noControlCharactersInRegex: idem
const URL_PERIGOSA_PRO = /^[\s\u0000- ]*(javascript|vbscript|livescript|data\s*:\s*text\/html)/i;
const ATRIBUTOS_URL_PRO = /^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i;

const preservaAtributo = (preservar: string[] | undefined, nome: string): boolean => !!preservar && preservar.indexOf(nome) !== -1;

type FnRgbToHex = (r: number, g: number, b: number) => string;

/** Fallback trivial do `rgbToHex` do monolito (o legado usava o global quando existe). */
function hexLocal(r: number, g: number, b: number): string {
  const hex = (n: number): string => {
    const s = (n & 255).toString(16);
    return s.length === 1 ? `0${s}` : s;
  };
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Converte todo rgb()/rgba() do texto para #rrggbb. Aceita virgulas, `rgb(206 206 206)` e `rgb(206 206 206 / 50%)`.
 * O alfa nao some: 0 vira `transparent`; entre 0 e 1 vira a cor ja composta sobre o branco do documento
 * (`rgba(0,0,0,.05)` -> `#f2f2f2`); sem alfa ou alfa >= 1: `#rrggbb` direto.
 */
export function rgbParaHex(texto: string, rgbToHex: FnRgbToHex = hexLocal): string {
  if (!texto) return texto;
  return texto.replace(
    /rgba?\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)(?:\s*,\s*|\s+)(\d+)\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)/gi,
    (_m: string, rs: string, gs: string, bs: string, alfa: string | undefined, pct: string | undefined) => {
      const r = Number.parseInt(rs, 10);
      const g = Number.parseInt(gs, 10);
      const b = Number.parseInt(bs, 10);
      const a = alfa ? Number.parseFloat(alfa) / (pct ? 100 : 1) : 1;
      if (Number.isNaN(a) || a >= 1) return rgbToHex(r, g, b);
      if (a <= 0) return "transparent";
      const sobreBranco = (x: number): number => Math.round(a * x + (1 - a) * 255);
      return rgbToHex(sobreBranco(r), sobreBranco(g), sobreBranco(b));
    },
  );
}

/** Heuristica barata: so vale parsear/limpar se houver indicio de lixo. */
export function precisaLimpar(html: string, preservar?: string[]): boolean {
  if (/rgba?\(|cke_protected|data-cke-saved|data-sfc|data-copy-service|data-hveid|dark-mode-|\sspellcheck|\bcke_/i.test(html)) return true;
  if (ATRIBUTO_PERIGOSO_PRO.test(html)) return true;
  return !preservaAtributo(preservar, "contenteditable") && /\scontenteditable/i.test(html);
}

/** Comentarios `{cke_protected}` de toda a arvore (sem NodeFilter/NodeIterator). */
function comentariosProtegidos(no: Node, achados: Node[]): void {
  for (const f of Array.from(no.childNodes)) {
    if (f.nodeType === 8) {
      if (/cke_protected/.test(f.nodeValue ?? "")) achados.push(f);
    } else if (f.nodeType === 1) {
      comentariosProtegidos(f, achados);
    }
  }
}

/** Limpa, in-place, um no raiz (Element ou Document) e todos os descendentes. A ordem das passadas e a do legado. */
export function limparRaiz<T extends ParentNode & Node>(raiz: T, preservar?: string[], rgbToHex: FnRgbToHex = hexLocal): T {
  // 1) comentarios residuais (marcadores {cke_protected} do CKEditor)
  const comentarios: Node[] = [];
  comentariosProtegidos(raiz, comentarios);
  for (const c of comentarios) c.parentNode?.removeChild(c);

  // 2) atributos, classes e cores de cada elemento
  const elementos = raiz.querySelectorAll("*");
  for (let i = 0; i < elementos.length; i++) {
    const el = elementos[i] as Element;

    // 2a) atributos-lixo por nome exato
    for (const nome of ATRIBUTOS_LIXO_PRO) {
      if (preservaAtributo(preservar, nome)) continue;
      if (el.hasAttribute(nome)) el.removeAttribute(nome);
    }
    // 2b) atributos-lixo por prefixo (itera copia: removeAttribute muda a colecao)
    for (const attr of Array.from(el.attributes)) {
      const nome = attr.name;
      // atributo de evento e URL com esquema executavel (defesa em profundidade: o GHS do CK5 ja os descarta)
      if (/^on/i.test(nome) || (ATRIBUTOS_URL_PRO.test(nome) && URL_PERIGOSA_PRO.test(attr.value || ""))) {
        el.removeAttribute(nome);
        continue;
      }
      for (const prefixo of PREFIXOS_ATRIBUTO_LIXO_PRO) {
        if (nome.indexOf(prefixo) === 0) {
          el.removeAttribute(nome);
          break;
        }
      }
    }
    // 2c) classes-lixo; remove o atributo class se ficar vazio
    if (el.classList?.length) {
      for (const classe of Array.from(el.classList)) {
        for (const prefixo of PREFIXOS_CLASSE_LIXO_PRO) {
          if (classe.indexOf(prefixo) === 0) {
            el.classList.remove(classe);
            break;
          }
        }
      }
      if (!el.classList.length) el.removeAttribute("class");
    }
    // 2d) cores rgb()/rgba() -> hex no style inline
    const style = el.getAttribute("style");
    if (style && /rgba?\(/i.test(style)) el.setAttribute("style", rgbParaHex(style, rgbToHex));
  }
  return raiz;
}

/**
 * Recebe HTML e devolve HTML limpo (desembrulhando o `<body>`). O texto vai a um `DOMParser` (documento inerte); o embrulho
 * `<html><body>` mantem no corpo o que viria antes do primeiro elemento (comentarios, espacos).
 */
export function limparHtml(
  html: string,
  preservar: string[] | undefined,
  Parser: typeof DOMParser,
  rgbToHex: FnRgbToHex = hexLocal,
): string {
  if (typeof html !== "string" || html === "" || !precisaLimpar(html, preservar)) return html;
  const inerte = new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
  limparRaiz(inerte.body, preservar, rgbToHex);
  return inerte.body.innerHTML;
}

// ---------------------------------------------------------------------------
// Superficie do CKEditor 4 / 5 usada aqui (sem tipos oficiais no SEI)
// ---------------------------------------------------------------------------

interface EventoGet {
  return?: unknown;
}
interface EditorLimpeza {
  model?: unknown;
  data?: { on?(evento: string, fn: (evt: EventoGet, args?: unknown[]) => void, o?: { priority: string }): void };
  dataProcessor?: {
    htmlFilter?: { addRules?(regras: unknown, opcoes?: unknown): void };
  };
  _limpezaProRegistrada?: boolean;
  _limpezaProEmAndamento?: boolean;
  _limpezaProSalvarHook?: boolean;
}
const ed = (e: object): EditorLimpeza => e as EditorLimpeza;

interface Monolito {
  rgbToHex?: FnRgbToHex;
  enableButtonSavePro?(): void;
}

interface EventoColagem {
  data?: { dataValue?: unknown };
}

/** Seletores do botao Salvar: CK4 (`.cke_button__save`), CK5/SEI 5 (tooltip/aria-label "Salvar") e a barra de comandos do SEI. */
const SELETOR_SALVAR =
  '.cke_button__save, button[data-cke-tooltip-text*="Salvar"], button[aria-label*="Salvar"], #divInfraBarraComandosSuperior button';

/** Monta as funcoes ligadas a pagina (DOMParser, adaptador, helpers do monolito). */
function criarLimpeza(c: Contexto) {
  const A = c.adaptador;
  const w = c.win as unknown as Monolito;
  const Parser = (): typeof DOMParser => c.doc.defaultView?.DOMParser ?? globalThis.DOMParser;
  const rgbToHex: FnRgbToHex = (r, g, b) => (typeof w.rgbToHex === "function" ? w.rgbToHex(r, g, b) : hexLocal(r, g, b));
  const preservados = (): string[] => ATRIBUTOS_PRESERVADOS_CK4_PRO;

  const limparHtmlPro = (html: string, preservar?: string[]): string => limparHtml(html, preservar, Parser(), rgbToHex);
  const rgbParaHexPro = (texto: string): string => rgbParaHex(texto, rgbToHex);
  const limparRaizPro = <T extends ParentNode & Node>(raiz: T, preservar?: string[]): T => limparRaiz(raiz, preservar, rgbToHex);

  /** Limpeza sob demanda de uma instancia (getData -> limpa -> setData). Devolve true se algo mudou. */
  function limparEditorPro(editor?: Editor | null): boolean {
    const e = editor || A.getInstance();
    if (!e) return false;
    const original = A.getData(e);
    const limpo = limparHtmlPro(original, preservados());
    if (limpo === original) return false;
    A.setData(e, limpo);
    if (typeof w.enableButtonSavePro === "function") w.enableButtonSavePro();
    return true;
  }

  /** Limpa o corpo in-place via `transformBodyHtml`; a guarda evita laco com o `change`. */
  function limparCorpo(editor: Editor): void {
    const e = ed(editor);
    if (e._limpezaProEmAndamento) return;
    e._limpezaProEmAndamento = true;
    try {
      A.transformBodyHtml(editor, (html) => limparHtmlPro(html, preservados()));
    } catch {
      /* silencioso: a limpeza e best-effort */
    }
    // libera a guarda no proximo tick, para nao reentrar no lote de mutacoes que o transformBodyHtml acabou de gerar
    setTimeout(() => {
      e._limpezaProEmAndamento = false;
    }, 0);
  }

  /** CK4: limpa so a SAIDA do editor (o que o SEI grava), com o `htmlFilter` do proprio CK4. O DOM vivo fica intacto. */
  function registrarFiltroSaidaCK4(editor: Editor): boolean {
    const dp = ed(editor).dataProcessor;
    if (!dp?.htmlFilter || typeof dp.htmlFilter.addRules !== "function") return false;
    const preservar = preservados();
    dp.htmlFilter.addRules(
      {
        elements: {
          $: (el: { attributes?: Record<string, string> }) => {
            const attrs = el.attributes;
            if (!attrs) return;
            for (const nome in attrs) {
              if (!Object.hasOwn(attrs, nome) || preservaAtributo(preservar, nome)) continue;
              if (ATRIBUTOS_LIXO_PRO.indexOf(nome) !== -1) {
                delete attrs[nome];
                continue;
              }
              for (const prefixo of PREFIXOS_ATRIBUTO_LIXO_PRO) {
                // o CK4 ja converte os data-cke-saved-* da saida
                if (prefixo !== "data-cke-saved-" && nome.indexOf(prefixo) === 0) {
                  delete attrs[nome];
                  break;
                }
              }
            }
            if (typeof attrs.class === "string") {
              const classes = attrs.class.split(/\s+/).filter((cl) => {
                if (!cl) return false;
                for (const prefixo of PREFIXOS_CLASSE_LIXO_PRO) if (cl.indexOf(prefixo) === 0) return false;
                return true;
              });
              if (classes.length) attrs.class = classes.join(" ");
              else delete attrs.class;
            }
            if (typeof attrs.style === "string" && /rgba?\(/i.test(attrs.style)) attrs.style = rgbParaHexPro(attrs.style);
          },
        },
      },
      { applyToAll: true },
    );
    return true;
  }

  /**
   * CK5: limpa so a SAIDA de dados (`editor.data.get`, evento `get`, prioridade baixa = depois de o HTML ser montado), sem
   * tocar no model. Os vai-e-volta internos do SEI Pro (`transformBodyHtml`, opcao `seiProInterno`) ficam de fora.
   */
  function registrarFiltroSaidaCK5(editor: Editor): boolean {
    const dados = ed(editor).data;
    if (!dados || typeof dados.on !== "function") return false;
    const preservar = preservados();
    dados.on(
      "get",
      (evt, args) => {
        const opcoes = args?.[0] as { seiProInterno?: boolean } | undefined;
        if (opcoes?.seiProInterno) return;
        if (typeof evt.return === "string") evt.return = limparHtmlPro(evt.return, preservar);
      },
      { priority: "low" },
    );
    return true;
  }

  /** Caminho de reserva: antes de o SEI serializar, o mousedown no botao Salvar limpa o corpo. Idempotente por instancia. */
  function ligarBotaoSalvar(editor: Editor): void {
    const e = ed(editor);
    if (e._limpezaProSalvarHook) return;
    e._limpezaProSalvarHook = true;
    c.doc.addEventListener("mousedown", (ev) => {
      const alvo = ev.target as Element | null;
      let achou = false;
      try {
        achou = !!alvo?.closest?.(SELETOR_SALVAR);
      } catch {
        achou = false;
      }
      // mousedown dispara antes do click/submit que serializa o conteudo
      if (achou) limparCorpo(editor);
    });
  }

  /** Registra a limpeza automatica na instancia (colagem e passada final antes de salvar). Idempotente. */
  function registrarLimpezaAutomaticaPro(editor?: Editor | null): void {
    if (!editor) return;
    const e = ed(editor);
    if (e._limpezaProRegistrada) return;
    e._limpezaProRegistrada = true;

    // CK5: filtro na saida de dados, sem reescrever o model
    if (e.model && registrarFiltroSaidaCK5(editor)) return;

    // CK4: colagem + filtro de saida, sem reescrever o body
    if (!e.model && registrarFiltroSaidaCK4(editor)) {
      A.on(editor, "paste", (evt) => {
        const ev = evt as EventoColagem | undefined;
        if (ev?.data && typeof ev.data.dataValue === "string") ev.data.dataValue = limparHtmlPro(ev.data.dataValue, preservados());
      });
      return;
    }

    // reserva (a) colagem: CK4 sem htmlFilter entrega `evt.data.dataValue`; no CK5 (evento DOM, pre-insercao) a limpeza do corpo
    // roda no tick seguinte, com a colagem ja assentada
    A.on(editor, "paste", (evt) => {
      const ev = evt as EventoColagem | undefined;
      if (ev?.data && typeof ev.data.dataValue === "string") {
        ev.data.dataValue = limparHtmlPro(ev.data.dataValue, preservados());
        return;
      }
      setTimeout(() => limparCorpo(editor), 0);
    });

    // reserva (b) salvar: hook no botao + limpeza defensiva e coalescida em `change`
    ligarBotaoSalvar(editor);
    let agendada = false;
    A.on(editor, "change", () => {
      if (e._limpezaProEmAndamento || agendada) return;
      agendada = true;
      // coalesce: nao limpa a cada tecla; uma passada apos a rajada
      setTimeout(() => {
        agendada = false;
        const corpo = A.getData(editor);
        if (typeof corpo === "string" && precisaLimpar(corpo, preservados())) limparCorpo(editor);
      }, 400);
    });
  }

  return { limparHtmlPro, rgbParaHexPro, limparRaizPro, limparEditorPro, registrarLimpezaAutomaticaPro };
}

export const recurso: Recurso = {
  id: "auto-cleanup",
  globais(c: Contexto) {
    const f = criarLimpeza(c);
    return {
      ATRIBUTOS_LIXO_PRO,
      PREFIXOS_ATRIBUTO_LIXO_PRO,
      PREFIXOS_CLASSE_LIXO_PRO,
      ATRIBUTOS_PRESERVADOS_CK4_PRO,
      precisaLimparEditorPro: precisaLimpar,
      rgbParaHexPro: f.rgbParaHexPro,
      limparRaizEditorPro: f.limparRaizPro,
      limparHtmlEditorPro: f.limparHtmlPro,
      limparEditorPro: f.limparEditorPro,
      registrarLimpezaAutomaticaPro: f.registrarLimpezaAutomaticaPro,
    };
  },

  /**
   * CK5: registra na instancia unica (o legado fazia no boot). No CK4 quem registra e o monolito (`setCKEDITOR_instances`):
   * registrar aqui, antes de a instancia ter o `dataProcessor`, travaria a flag no caminho de reserva.
   */
  iniciar(c: Contexto) {
    if (c.adaptador.versao !== 5) return;
    try {
      criarLimpeza(c).registrarLimpezaAutomaticaPro(c.adaptador.getInstance());
    } catch {
      /* editor nao pronto */
    }
  },
};
