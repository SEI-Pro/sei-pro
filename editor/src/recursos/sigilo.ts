import { h, icone } from "@comum/ui/dom";
import { htmlParaNos } from "../adaptador/html";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { criarAbas, dica, formulario, grupo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Sigilo (porte de `sigilo.js`): marcacao, tarja e gerenciamento das marcas de sigilo do documento.
 *
 * - `getMarkSigilo`: liga/desliga a marca (`span.sigiloSEI`) na selecao. No CK5 a marca e o atributo `htmlSpan` do GHS
 *   no model (a vista nao chega ao `data.get`); no CK4 e um `span` no corpo.
 * - `getTarjaSigilo`: marca a selecao e ja tarja todas as marcas.
 * - `getBoxSigilo`/`openDialogSigilo`: dialogo "Gerenciar marcas de sigilo do documento" (localizar, tarjar, remover, guia).
 * - `actionsMarkSigilo`: as acoes em massa (`replace`, `email_cpf`, `apply`, `remove`), tambem chamadas pelo monolito
 *   (certidao de sigilo e Documento Modelo) com `this_` nulo.
 * - A tarja guarda o texto original em `data-text` (para "Remover marcas" reverter com o editor aberto); o filtro de saida
 *   (`registrarSaidaSigiloCK4Pro`/`CK5Pro`) tira esse atributo do HTML gravado.
 *
 * Os helpers do monolito (`hasSelection`, `randomNumber`) sao opcionais em `window`: a ausencia nunca derruba a acao.
 */

/** Bloco cheio que forma a tarja. */
const TARJA = "█";
const CLASSE_MARCA = "sigiloSEI";
const CLASSE_TARJA = "sigiloSEI_tarja";
const URL_GUIA = "https://seipro.app/pages/SIGILODOC.html";

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  hasSelection?(editor: object): boolean;
  randomNumber?(min: number, max: number): number;
}

// ---------------------------------------------------------------------------
// Superficie do CKEditor 5 / 4 usada aqui (sem tipos oficiais no SEI)
// ---------------------------------------------------------------------------

interface NoModelo {
  is?(tipo: string): boolean;
  getAttribute(nome: string): unknown;
  previousSibling: NoModelo | null;
  nextSibling: NoModelo | null;
}
interface PosicaoModelo {
  textNode: NoModelo | null;
  nodeAfter: NoModelo | null;
  nodeBefore: NoModelo | null;
}
interface EscritorModelo {
  setAttribute(nome: string, valor: unknown, alvo: unknown): void;
  removeAttribute(nome: string, alvo: unknown): void;
}
interface ModeloCk5 {
  change(fn: (w: EscritorModelo) => void): void;
  createRange(a: unknown, b: unknown): unknown;
  createPositionBefore(no: unknown): unknown;
  createPositionAfter(no: unknown): unknown;
  document: { selection: { isCollapsed: boolean; getFirstPosition(): PosicaoModelo | null } };
}
interface DespachanteCk5 {
  on(
    evento: string,
    fn: (evt: unknown, dados: DadosAtributo, api?: { options?: { seiProInterno?: boolean } }) => void,
    o?: { priority: string },
  ): void;
}
interface DadosAtributo {
  attributeNewValue?: ValorGhs | null;
}
interface ValorGhs {
  classes?: unknown;
  attributes?: Record<string, string>;
  styles?: unknown;
  [chave: string]: unknown;
}
interface EditorSigilo {
  model?: ModeloCk5;
  data?: { downcastDispatcher?: DespachanteCk5 };
  dataProcessor?: {
    htmlFilter?: { addRules?(regras: unknown, opcoes?: unknown): void };
  };
  _saidaSigiloProRegistrada?: boolean;
  _saidaSigiloCK5ProRegistrada?: boolean;
}
const ed = (e: object): EditorSigilo => e as EditorSigilo;

// ---------------------------------------------------------------------------
// Utilitarios puros
// ---------------------------------------------------------------------------

const escaparRegExp = (s: string): string => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const palavra = (texto: string, flags: string): RegExp => new RegExp(`\\b${escaparRegExp(texto)}\\b`, flags);
const plural = (n: number, um: string, varios: string): string => (n === 1 ? um : varios);

export const extrairEmails = (texto: string): string[] => texto.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) ?? [];
export const extrairCpfs = (texto: string): string[] => texto.match(/(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))/gi) ?? [];
/** Ordena e tira os repetidos (o `uniqPro` do monolito). */
export const unicos = (lista: string[]): string[] => [...lista].sort().filter((x, i, a) => !i || x !== a[i - 1]);

/** Troca o elemento pelo seu conteudo. */
function desembrulhar(el: Element): void {
  const pai = el.parentNode;
  if (!pai) return;
  while (el.firstChild) pai.insertBefore(el.firstChild, el);
  pai.removeChild(el);
}

/** Envolve cada ocorrencia da palavra (`\b`) dos nos de texto de `el` num `span.sigiloSEI`; nao reentra em marcas nem tarjas. */
function envolverPalavras(el: Element, alvo: string): void {
  const rx = palavra(alvo, "igm");
  for (const no of [...el.childNodes]) {
    if (no.nodeType === 3) {
      const txt = no.nodeValue ?? "";
      rx.lastIndex = 0;
      if (!rx.test(txt)) continue;
      rx.lastIndex = 0;
      // nos montados sem innerHTML: o texto ja esta decodificado e um "<NOME>" literal nao pode virar elemento
      const doc = no.ownerDocument as Document;
      const frag = doc.createDocumentFragment();
      let ultimo = 0;
      let m: RegExpExecArray | null = rx.exec(txt);
      while (m !== null) {
        if (m[0] === "") {
          rx.lastIndex++;
        } else {
          if (m.index > ultimo) frag.appendChild(doc.createTextNode(txt.slice(ultimo, m.index)));
          const span = doc.createElement("span");
          span.className = CLASSE_MARCA;
          span.textContent = m[0];
          frag.appendChild(span);
          ultimo = m.index + m[0].length;
        }
        m = rx.exec(txt);
      }
      if (ultimo < txt.length) frag.appendChild(doc.createTextNode(txt.slice(ultimo)));
      no.parentNode?.insertBefore(frag, no);
      no.parentNode?.removeChild(no);
    } else if (no.nodeType === 1) {
      const e = no as Element;
      if (e.classList?.contains(CLASSE_MARCA) || e.classList?.contains(CLASSE_TARJA)) continue;
      envolverPalavras(e, alvo);
    }
  }
}

// ---------------------------------------------------------------------------
// CK5: a marca e o atributo htmlSpan (GHS) do texto no model
// ---------------------------------------------------------------------------

function classesDoValorGhs(valor: unknown): string[] {
  const classes = (valor as ValorGhs | null | undefined)?.classes as unknown;
  if (!classes) return [];
  if (typeof classes === "string") return classes.split(/\s+/);
  if (Array.isArray(classes)) return classes.slice();
  const comForEach = classes as { forEach?: (fn: (c: string) => void) => void };
  if (typeof comForEach.forEach === "function") {
    const lista: string[] = [];
    comForEach.forEach((c) => {
      lista.push(c);
    });
    return lista;
  }
  return Object.keys(classes as object);
}

function temClasseSigilo(no: NoModelo | null | undefined): boolean {
  if (!no || typeof no.is !== "function" || !no.is("$text")) return false;
  return classesDoValorGhs(no.getAttribute("htmlSpan")).includes(CLASSE_MARCA);
}

/** O valor do GHS sem a classe do sigilo, ou null se nada mais restar (o atributo sai do texto). */
function valorSemClasseSigilo(valor: ValorGhs): ValorGhs | null {
  const copia: ValorGhs = { ...valor };
  const classes = classesDoValorGhs(valor).filter((c) => c && c !== CLASSE_MARCA);
  if (classes.length) copia.classes = classes;
  else delete copia.classes;
  const vazio = (o: unknown): boolean => !o || (typeof o === "object" && Object.keys(o as object).length === 0);
  return vazio(copia.classes) && vazio(copia.attributes) && vazio(copia.styles) ? null : copia;
}

/** Faixa marcada em volta do cursor (nos de texto vizinhos com o mesmo valor), ou null. */
function faixaMarcaSigiloCk5(modelo: ModeloCk5): { range: unknown; valor: ValorGhs } | null {
  try {
    const selecao = modelo.document.selection;
    const pos = selecao.getFirstPosition();
    if (!pos) return null;
    let no: NoModelo | null = pos.textNode;
    // trecho selecionado que comeca logo depois de uma marca nao e essa marca: so o cursor encostado conta
    if (!temClasseSigilo(no)) {
      no = temClasseSigilo(pos.nodeAfter) ? pos.nodeAfter : selecao.isCollapsed && temClasseSigilo(pos.nodeBefore) ? pos.nodeBefore : null;
    }
    if (!no) return null;
    const valor = no.getAttribute("htmlSpan") as ValorGhs;
    const chave = JSON.stringify(valor);
    const mesmoValor = (x: NoModelo | null): x is NoModelo =>
      temClasseSigilo(x) && JSON.stringify((x as NoModelo).getAttribute("htmlSpan")) === chave;
    let ini: NoModelo = no;
    let fim: NoModelo = no;
    while (mesmoValor(ini.previousSibling)) ini = ini.previousSibling as NoModelo;
    while (mesmoValor(fim.nextSibling)) fim = fim.nextSibling as NoModelo;
    return { range: modelo.createRange(modelo.createPositionBefore(ini), modelo.createPositionAfter(fim)), valor };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Filtros de saida: o texto original (data-text) da tarja nao vai para o HTML gravado
// ---------------------------------------------------------------------------

/** CK4: o filtro de saida do `dataProcessor` (usado pelo `getData` que o SEI grava) tira `data-text` da tarja. Idempotente. */
export function registrarSaidaSigiloCK4Pro(editor: object | null | undefined): void {
  if (!editor) return;
  const e = ed(editor);
  if (e.model || e._saidaSigiloProRegistrada) return;
  const filtro = e.dataProcessor?.htmlFilter;
  if (!filtro || typeof filtro.addRules !== "function") return;
  e._saidaSigiloProRegistrada = true;
  filtro.addRules(
    {
      elements: {
        span(el: { attributes?: Record<string, string> }) {
          const attrs = el.attributes;
          if (attrs && /(^|\s)sigiloSEI_tarja(\s|$)/.test(attrs.class ?? "")) delete attrs["data-text"];
        },
      },
    },
    { applyToAll: true },
  );
}

function classesTemTarja(classes: unknown): boolean {
  if (!classes) return false;
  if (typeof classes === "string") return /(^|\s)sigiloSEI_tarja(\s|$)/.test(classes);
  const c = classes as { indexOf?: (x: string) => number; has?: (x: string) => boolean };
  if (typeof c.indexOf === "function") return c.indexOf(CLASSE_TARJA) !== -1;
  if (typeof c.has === "function") return c.has(CLASSE_TARJA);
  return Object.hasOwn(classes as object, CLASSE_TARJA);
}

/**
 * CK5: um conversor de downcast do pipeline de DADOS (o que o SEI grava e a area de transferencia usa; a vista de edicao, o
 * model e o Desfazer mantem o atributo) troca o valor do GHS por uma copia sem `data-text` antes do conversor do GHS montar
 * o elemento. O `transformBodyHtml` do adaptador usa a opcao `seiProInterno` e preserva o atributo. Idempotente.
 */
export function registrarSaidaSigiloCK5Pro(editor: object | null | undefined): void {
  if (!editor) return;
  const e = ed(editor);
  if (!e.model || e._saidaSigiloCK5ProRegistrada) return;
  const despachante = e.data?.downcastDispatcher;
  if (!despachante || typeof despachante.on !== "function") return;
  e._saidaSigiloCK5ProRegistrada = true;
  despachante.on(
    "attribute",
    (_evt, dados, api) => {
      if (api?.options?.seiProInterno) return;
      const valor = dados?.attributeNewValue;
      if (!valor || typeof valor !== "object" || !valor.attributes) return;
      if (!Object.hasOwn(valor.attributes, "data-text") || !classesTemTarja(valor.classes)) return;
      const attrs: Record<string, string> = {};
      for (const k of Object.keys(valor.attributes)) if (k !== "data-text") attrs[k] = valor.attributes[k] as string;
      dados.attributeNewValue = { ...valor, attributes: attrs };
    },
    { priority: "high" },
  );
}

function registrarSaidaSigiloPro(editor: object): void {
  registrarSaidaSigiloCK4Pro(editor);
  registrarSaidaSigiloCK5Pro(editor);
}

// ---------------------------------------------------------------------------
// Mensagens do dialogo
// ---------------------------------------------------------------------------

type Tom = "ok" | "info" | "aviso";
type Parte = Node | string;

/** Linha de resultado: icone colorido + partes (texto, `br`, contagem). Tudo entra como texto. */
function mensagem(tom: Tom, ...partes: Parte[]): HTMLElement {
  const nome = tom === "ok" ? "check" : tom === "aviso" ? "alerta" : "nota";
  const cor = tom === "ok" ? "var(--spro-ok)" : tom === "aviso" ? "var(--spro-aviso)" : "var(--spro-destaque)";
  const ic = icone(nome, 15);
  ic.setAttribute("style", `color:${cor};vertical-align:-2px;margin-right:6px;`);
  return h("label", {}, ic, ...partes);
}
const quebra = (): Node => h("br");

// ---------------------------------------------------------------------------
// O recurso
// ---------------------------------------------------------------------------

export const recurso: Recurso = {
  id: "sigilo",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);

    /** Roda `fn` sobre o corpo de um documento inerte (DOMParser) e devolve o HTML resultante. */
    function comCorpo(html: string, fn: (corpo: HTMLElement) => void): string {
      const Parser = c.doc.defaultView?.DOMParser ?? globalThis.DOMParser;
      const inerte = new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
      fn(inerte.body as HTMLElement);
      return inerte.body.innerHTML;
    }

    /** HTML do corpo como esta no editor (sem alterar nada). */
    function htmlCorpoAtual(editor: object): string | null {
      let atual: string | null = null;
      A.transformBodyHtml(editor, (html) => {
        atual = html;
        return html;
      });
      return atual;
    }

    const sorteio = (min: number, max: number): number =>
      typeof w.randomNumber === "function" ? w.randomNumber(min, max) : Math.floor(Math.random() * (max - min + 1) + min);

    // ---------- marcar / tarjar a selecao ----------

    /** Ha texto selecionado para marcar? Devolve o HTML da selecao ou avisa e devolve null. */
    function selecaoParaMarcar(editor: object, mensagemAviso: string): string | null {
      if (typeof w.hasSelection === "function" && !w.hasSelection(editor)) {
        avisar(mensagemAviso);
        return null;
      }
      const sel = A.getSelectedHtml(editor);
      if (!sel) {
        avisar(mensagemAviso);
        return null;
      }
      return sel;
    }

    /** Liga/desliga a marca de sigilo na selecao. */
    function getMarkSigilo(this_: Element | null): void {
      const editor = A.getInstance(this_);
      if (!editor) return;
      if (A.somenteLeitura(editor)) {
        A.recusarEscrita();
        return;
      }
      const modelo = ed(editor).model;

      // CK5: a marca e o atributo htmlSpan do texto no model; marcar o span da VISTA nao chegaria ao model nem ao data.get
      if (modelo) {
        const faixa = faixaMarcaSigiloCk5(modelo);
        if (faixa) {
          modelo.change((escritor) => {
            const novo = valorSemClasseSigilo(faixa.valor);
            if (novo) escritor.setAttribute("htmlSpan", novo, faixa.range);
            else escritor.removeAttribute("htmlSpan", faixa.range);
          });
          return;
        }
      }

      // CK4: a selecao ja esta dentro de um span.sigiloSEI? Desfaz, trocando o span pelo conteudo.
      const alvoSel = modelo ? null : A.getSelectionElement(editor);
      const embrulho = alvoSel?.closest ? alvoSel.closest(`span.${CLASSE_MARCA}`) : null;
      if (embrulho) {
        // o span e achado no HTML serializado por um atributo unico (o transformBodyHtml e a forma segura no CK5)
        const ficha = `seiProUnmark_${Date.now()}`;
        try {
          embrulho.setAttribute("data-seipro-unmark", ficha);
        } catch {
          // elemento sem escrita: a busca abaixo nao acha e nada muda
        }
        A.transformBodyHtml(editor, (html) =>
          comCorpo(html, (corpo) => {
            const alvo = corpo.querySelector(`span.${CLASSE_MARCA}[data-seipro-unmark="${ficha}"]`);
            if (alvo) desembrulhar(alvo);
          }),
        );
        return;
      }

      const sel = selecaoParaMarcar(editor, "Selecione um texto para adicionar a marca de sigilo.");
      if (sel === null) return;
      A.withEdit(editor, () => A.insertHtml(editor, `<span class="${CLASSE_MARCA}">${sel}</span>`));
    }

    /** Marca a selecao e ja tarja todas as marcas do documento. */
    function getTarjaSigilo(this_: Element | null): void {
      const editor = A.getInstance(this_);
      if (!editor) return;
      if (A.somenteLeitura(editor)) {
        A.recusarEscrita();
        return;
      }
      const sel = selecaoParaMarcar(editor, "Selecione um texto para tarjar.");
      if (sel === null) return;
      A.withEdit(editor, () => A.insertHtml(editor, `<span class="${CLASSE_MARCA}">${sel}</span>`));
      // a tarja entra depois de o CK5 reconciliar a vista (o transformBodyHtml nao roda dentro de model.change)
      setTimeout(() => actionsMarkSigilo(null, "apply", false, false, editor), 0);
    }

    // ---------- resultados do dialogo ----------

    const achar = (raiz: Element | null, id: string): HTMLElement | null => raiz?.querySelector<HTMLElement>(`#${id}`) ?? null;
    const mostrar = (el: HTMLElement | null, ...linhas: HTMLElement[]): void => {
      if (!el) return;
      el.replaceChildren(...linhas);
      el.removeAttribute("hidden");
    };
    const ocultar = (el: HTMLElement | null): void => {
      if (!el) return;
      el.replaceChildren();
      el.setAttribute("hidden", "");
    };
    const caixaDe = (this_: unknown): Element | null =>
      this_ && typeof (this_ as Element).querySelector === "function" ? (this_ as Element) : null;

    /** Aba "Tarjar": quantas marcas de sigilo ha agora no documento. */
    function htmlTabSigiloResult(this_: Element | null, editor?: object): void {
      const raiz = caixaDe(this_);
      if (!raiz) return;
      const e = editor ?? A.getInstance();
      if (!e) return;
      const corpo = A.getBodyContainer(e);
      const n = corpo ? corpo.querySelectorAll(`p span.${CLASSE_MARCA}`).length : 0;
      mostrar(
        achar(raiz, "tabSigilo1_result"),
        n === 0
          ? mensagem(
              "info",
              'Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba "Localizar texto" ou adicione manualmente com o botão de marca de sigilo da barra de ferramentas.',
            )
          : mensagem("info", `${n} ${plural(n, "marca", "marcas")} de sigilo ${plural(n, "encontrada", "encontradas")} no documento!`),
      );
    }

    /** Poe (ou tira) o rodape "#_contem_N_marcas_sigilo" conforme as tarjas do documento. */
    function rodapeSigiloMark(editor?: object): void {
      const e = editor ?? A.getInstance();
      if (!e) return;
      A.transformBodyHtml(e, (html) =>
        comCorpo(html, (corpo) => {
          const total = corpo.querySelectorAll(`.${CLASSE_TARJA}`).length;
          for (const marca of corpo.querySelectorAll(".sigiloSEI_sigilo_mark")) marca.parentNode?.removeChild(marca);
          if (total > 0) {
            const p = (corpo.ownerDocument as Document).createElement("p");
            p.setAttribute("class", "sigiloSEI_sigilo_mark");
            p.setAttribute("contenteditable", "false");
            p.setAttribute("style", "font-size: 6pt;color: #ccc;font-family: monospace;");
            p.textContent = `#_contem_${total}_marcas_sigilo`;
            corpo.appendChild(p);
          }
        }),
      );
    }

    // ---------- acoes em massa ----------

    /**
     * `this_`: raiz do dialogo (ou nulo nas chamadas internas); `mode`: `replace` | `remove` | `apply` | `email_cpf`;
     * `text`: texto a localizar (o `email_cpf` chama o `replace` por dado); `increment`: acumula a contagem do `replace`.
     */
    function actionsMarkSigilo(
      this_?: Element | null,
      mode?: string,
      text: string | false = false,
      increment: boolean | undefined = false,
      editor?: object,
    ): void {
      const e = editor ?? A.getInstance();
      if (!e) return;
      const raiz = caixaDe(this_);
      const r1 = achar(raiz, "tabSigilo1_result");
      const r2 = achar(raiz, "tabSigilo2_result");
      const r3 = achar(raiz, "tabSigilo3_result");
      const modelo = ed(e).model;

      if (mode === "replace") {
        const campo = achar(raiz, "inputSigiloTexto") as HTMLInputElement | null;
        const procurado = text ? text : raiz ? (campo?.value ?? "").trim() : "";
        let resultado: HTMLElement;
        if (procurado !== "") {
          let anterior = 0;
          if (increment && raiz) anterior = Number.parseInt(r2?.querySelector(".count")?.textContent ?? "0", 10) || 0;
          let total = 0;
          let encontradas = 0;
          A.transformBodyHtml(e, (html) =>
            comCorpo(html, (corpo) => {
              for (const p of corpo.querySelectorAll("p")) {
                // desfaz as marcas ja existentes do mesmo texto antes de remarcar (evita aninhar)
                for (const sp of p.querySelectorAll(`span.${CLASSE_MARCA}`))
                  if (palavra(procurado, "igm").test(sp.textContent ?? "")) desembrulhar(sp);
                envolverPalavras(p, procurado);
              }
              const textoTodo = [...corpo.querySelectorAll("p")].map((el) => el.textContent).join(" ");
              total = textoTodo.match(palavra(procurado, "igm"))?.length ?? 0;
            }),
          );
          if (modelo && total > 0) {
            // CK5: conta as marcas que ficaram no model (o upcast pode descartar o span), nao o HTML montado antes do data.set
            const rx = palavra(procurado, "i");
            const depois = htmlCorpoAtual(e);
            encontradas = total;
            total = 0;
            if (typeof depois === "string") {
              comCorpo(depois, (corpo) => {
                for (const sp of corpo.querySelectorAll(`p span.${CLASSE_MARCA}`)) if (rx.test(sp.textContent ?? "")) total++;
              });
            }
          }
          if (total === 0 && encontradas > 0) {
            resultado = mensagem("aviso", "Texto encontrado, mas o editor não manteve a marca de sigilo.");
          } else if (total > 0) {
            const n = total + anterior;
            resultado = mensagem(
              "ok",
              h("span", { class: "count" }, String(n)),
              ` ${plural(n, "marca", "marcas")} ${plural(n, "adicionada", "adicionadas")} com sucesso!`,
            );
          } else {
            resultado = mensagem("info", "Nenhum texto encontrado!");
          }
        } else {
          resultado = mensagem("info", "Digite um texto para adicionar a marca de sigilo");
        }
        if (raiz) {
          mostrar(r2, resultado);
          ocultar(r3);
          htmlTabSigiloResult(raiz, e);
        }
      } else if (mode === "remove") {
        let removidas = 0;
        A.transformBodyHtml(e, (html) =>
          comCorpo(html, (corpo) => {
            for (const sp of corpo.querySelectorAll(`span.${CLASSE_MARCA}`)) {
              desembrulhar(sp);
              removidas++;
            }
            // tarja: o texto original volta do data-text
            for (const sp of corpo.querySelectorAll(`span.${CLASSE_TARJA}`)) {
              const original = sp.getAttribute("data-text");
              if (typeof original !== "string" || original === "") continue;
              const caixa = htmlParaNos(corpo.ownerDocument as Document, `<div>${original}</div>`)[0] as Element | undefined;
              while (caixa?.firstChild) sp.parentNode?.insertBefore(caixa.firstChild, sp);
              sp.parentNode?.removeChild(sp);
              removidas++;
            }
          }),
        );
        const resultado =
          removidas === 0
            ? mensagem("info", "Nenhuma marca encontrada!")
            : mensagem(
                "ok",
                `${removidas} ${plural(removidas, "marca", "marcas")} ${plural(removidas, "removida", "removidas")} com sucesso!`,
              );
        if (raiz) {
          mostrar(r3, resultado);
          ocultar(r2);
          htmlTabSigiloResult(raiz, e);
        }
        rodapeSigiloMark(e);
      } else if (mode === "apply") {
        registrarSaidaSigiloPro(e); // o texto original (data-text) nao vai para o HTML gravado
        let tarjadas = 0;
        let tarjasAntes = 0;
        A.transformBodyHtml(e, (html) =>
          comCorpo(html, (corpo) => {
            tarjasAntes = corpo.querySelectorAll(`span.${CLASSE_TARJA}`).length;
            for (const sp of corpo.querySelectorAll(`span.${CLASSE_MARCA}`)) {
              if (!corpo.contains(sp)) continue; // marca aninhada: sumiu junto com a de fora
              sp.setAttribute("data-text", sp.innerHTML);
              sp.textContent = TARJA.repeat(sorteio(8, 15));
              sp.setAttribute("class", CLASSE_TARJA);
              tarjadas++;
            }
          }),
        );
        if (modelo && tarjadas > 0) {
          // CK5: so conta como tarjada a marca que virou span.sigiloSEI_tarja no model (ver o replace)
          const depois = htmlCorpoAtual(e);
          if (typeof depois === "string") {
            comCorpo(depois, (corpo) => {
              tarjadas = Math.min(tarjadas, Math.max(0, corpo.querySelectorAll(`span.${CLASSE_TARJA}`).length - tarjasAntes));
            });
          }
        }
        if (tarjadas > 0) {
          mostrar(
            r1,
            mensagem(
              "ok",
              `${tarjadas} ${plural(tarjadas, "marca", "marcas")} ${plural(tarjadas, "tarjada", "tarjadas")} com sucesso!`,
              quebra(),
              `${plural(tarjadas, "Esta marca tarjada poderá ser revertida", "Estas marcas tarjadas poderão ser revertidas")} na aba "Remover marcas" somente enquanto aberto este editor de documentos.`,
            ),
          );
        } else if (raiz) {
          htmlTabSigiloResult(raiz, e);
        }
        if (raiz) {
          ocultar(r2);
          ocultar(r3);
        }
        rodapeSigiloMark(e);
      } else if (mode === "email_cpf") {
        if (raiz) ocultar(r2);
        const corpo = A.getBodyContainer(e);
        const texto = corpo?.textContent ?? "";
        const emails = unicos(extrairEmails(texto));
        const cpfs = unicos(extrairCpfs(texto));
        const dados = [...cpfs, ...emails];
        if (dados.length === 0) {
          if (raiz) mostrar(r2, mensagem("info", "Nenhum dado pessoal (e-mail ou CPF) encontrado!"));
          return;
        }
        for (const dado of dados) actionsMarkSigilo(raiz, "replace", dado, true, e);
      }
    }

    // ---------- dialogo ----------

    function openDialogSigilo(editor?: object): void {
      const e = editor ?? A.getInstance();
      if (!e) return;
      const selecionado = A.getSelectedText(e) || "";

      const campo = h("input", {
        type: "text",
        id: "inputSigiloTexto",
        value: selecionado,
        placeholder: "Texto a marcar",
        autocomplete: "off",
        spellcheck: "false",
      });
      const botao = (id: string, rotulo: string, aoClicar: () => void, primario = true): HTMLElement =>
        h("button", { type: "button", id, class: primario ? "spro-botao primario" : "spro-botao", onclick: aoClicar }, rotulo);
      const resultado = (id: string): HTMLElement => h("div", { id, class: "spro-nota", hidden: "" });

      const raiz = h("div", { id: "dialogSigiloPro", class: "spro-form" });
      const agir = (modo: string) => () => actionsMarkSigilo(raiz, modo, false, false, e);

      const abaLocalizar = formulario(
        dica("Marque de uma vez, em todo o documento, um texto ou os dados pessoais encontrados nele."),
        grupo(
          "Localizar texto e adicionar marca de sigilo",
          { para: "inputSigiloTexto", dica: "Cada ocorrência do texto, no documento inteiro, recebe a marca de sigilo." },
          h("div", { class: "spro-linha" }, campo, botao("btnSigiloReplace", "Adicionar", agir("replace"))),
        ),
        grupo(
          "Localizar dados pessoais",
          { dica: "Procura e-mails e CPFs em todo o documento e adiciona a marca de sigilo a cada um." },
          h("div", {}, botao("btnSigiloEmailCpf", "Localizar dados pessoais", agir("email_cpf"), false)),
        ),
        resultado("tabSigilo2_result"),
      );
      const abaTarjar = formulario(
        dica("A tarja cobre com blocos pretos todo o texto que está com marca de sigilo."),
        grupo("Aplicar tarja de sigilo no documento", {}, h("div", {}, botao("btnSigiloApply", "Aplicar tarja", agir("apply")))),
        resultado("tabSigilo1_result"),
      );
      const abaRemover = formulario(
        dica("Tira as marcas de sigilo e devolve o texto original das tarjas."),
        grupo(
          "Remover todas as marcas de sigilo do documento",
          {},
          h("div", {}, botao("btnSigiloRemove", "Remover marcas", agir("remove"))),
        ),
        resultado("tabSigilo3_result"),
        h(
          "div",
          { id: "tabSigilo3_info", class: "spro-nota" },
          mensagem("aviso", "Marcas de sigilo já tarjadas não poderão ser revertidas após salvar e abandonar este editor de documentos."),
        ),
      );
      const abaGuia = formulario(
        dica(
          "Acesse o guia rápido sobre como ",
          h(
            "a",
            { href: URL_GUIA, target: "_blank", rel: "noopener noreferrer", class: "linkDialog" },
            "adicionar marca de sigilo e tarjas pretas de confidencialidade",
          ),
          ".",
        ),
      );

      const abas = criarAbas(
        "sigilo",
        [
          ["localizar", "1. Localizar texto e dados pessoais"],
          ["tarjar", "2. Tarjar marcas de sigilo"],
          ["remover", "Remover marcas"],
          ["guia", "Guia rápido"],
        ],
        { localizar: abaLocalizar, tarjar: abaTarjar, remover: abaRemover, guia: abaGuia },
      );
      raiz.append(h("div", { id: "sigiloTabs" }, abas.barra, h("div", {}, ...abas.paineis)));

      abrirDialogo(c.doc, { titulo: "Gerenciar marcas de sigilo do documento", largura: 720, conteudo: raiz });
      abas.selecionar("localizar");
      htmlTabSigiloResult(raiz, e);
    }

    function getBoxSigilo(this_: Element | null): void {
      const editor = A.getInstance(this_);
      if (!editor) return;
      openDialogSigilo(editor);
    }

    /** Mantido por compatibilidade com o `initFunctions()` do monolito: o dialogo abre sob demanda. */
    function getDialogSigilo(): void {}

    return {
      getMarkSigilo,
      getTarjaSigilo,
      getBoxSigilo,
      getDialogSigilo,
      openDialogSigilo,
      actionsMarkSigilo,
      registrarSaidaSigiloCK4Pro,
      registrarSaidaSigiloCK5Pro,
      rodapeSigiloMark,
      htmlTabSigiloResult,
    };
  },

  /** Registra o filtro de saida da tarja: no CK5 na instancia unica; no CK4 em todas as secoes (o monolito tambem o faz; e idempotente). */
  iniciar(c: Contexto) {
    if (c.adaptador.versao === 5) registrarSaidaSigiloCK5Pro(c.adaptador.getInstance());
    else for (const e of c.adaptador.getAllInstances()) registrarSaidaSigiloCK4Pro(e);
  },
};
