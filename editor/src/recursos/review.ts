import { h, icone } from "@comum/ui/dom";
import { htmlParaNos } from "../adaptador/html";
import type { Editor } from "../adaptador/tipos";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { dica, formulario } from "../ui/formulario";
import { textoAleatorio } from "../util/aleatorio";
import type { Contexto, Recurso } from "./tipos";

/**
 * Revisao de texto (porte de `review.js`): controle de alteracoes e comentarios no editor.
 *
 * As marcas sao `span.reviewSeiPro` com `data-review` (add|delete), `data-id-review`, `data-user-review`,
 * `data-date-review` e, se houver, `data-comment`; o espaco-marcador e `span.reviewSP`. Ao clicar numa marca abre o
 * balao (cartao `div.reviewDisplayPro`) com Aceitar, Rejeitar e o comentario; o dialogo "Gerenciar Revisoes" lista
 * todas as marcas do documento e aceita/rejeita uma a uma ou todas de uma vez.
 *
 * Diferencas em relacao ao legado: o balao e um elemento da pagina do editor (o legado o inseria DENTRO do documento,
 * sujando o texto e brigando com a reconciliacao do CK5); o cartao criado aqui liga os botoes por ouvintes diretos (o
 * marcado de `getHtmlReviewDisplayPro` continua trazendo `data-spro-click`, que o despachante global resolve); tudo
 * entra por DOM, nunca por texto HTML (usuario, data e comentario sao texto).
 */

export type TipoRevisao = "add" | "delete";

/** O que o monolito deixa em `window` e este recurso usa (opcional: a ausencia nunca derruba a revisao). */
interface Monolito {
  getOptionsPro?(item: string): unknown;
}

// ---------- API crua do CK4 usada so no rastreio tecla a tecla (o adaptador nao a expoe) ----------
interface Ck4No {
  type: number;
  getText(): string;
}
interface Ck4Intervalo {
  startContainer: Ck4No;
  startOffset: number;
  endContainer: Ck4No;
  endOffset: number;
  setStart(no: Ck4No, deslocamento: number): void;
  setEnd(no: Ck4No, deslocamento: number): void;
  collapse(aoInicio: boolean): void;
  setStartAt(el: unknown, posicao: number): void;
}
interface Ck4Selecao {
  getRanges(): Ck4Intervalo[];
  getStartElement(): { $: Element } | null;
  getSelectedText(): string;
  selectRanges(intervalos: Ck4Intervalo[]): void;
  getNative?(): Selection | null;
}
interface Ck4Cru {
  getSelection(): Ck4Selecao | null;
  createRange?(): Ck4Intervalo;
  editable?(): unknown;
}
interface Ck4Global {
  NODE_TEXT?: number;
  POSITION_AFTER_START?: number;
  dom?: { walker?: new (r: Ck4Intervalo) => { previous(): Ck4No | null } };
}

/** Evento de tecla no formato que o CK4 entrega (`evt.data`); o CK5 e adaptado para o mesmo. */
interface EventoTecla {
  data?: { keyCode?: number; domEvent?: { $?: { key?: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } } };
}

/** Dados que o cartao mostra (nomes do legado: `id_review`). */
export interface DadosCartao {
  date: string;
  id_review: string;
  type: string;
  user: string;
  comment?: string;
  /** Texto da marca no cabecalho do cartao (texto simples). */
  text?: string | false;
  /** Trecho do paragrafo com a marca destacada: HTML (parseado de forma inerte) ou nos ja prontos. */
  html?: string | readonly Node[] | false;
}

export interface AcaoRevisao {
  mode?: string;
  idReview?: string;
  type?: string;
  readonly?: boolean;
}

const COR_ADD = { fundo: "#F0F8FF", texto: "#0000FF", tag: "u" } as const;
const COR_DEL = { fundo: "#FFF0F5", texto: "#FF0000", tag: "s" } as const;
const cores = (t: string) => (t === "add" ? COR_ADD : COR_DEL);

const ESTILO_BALAO =
  "position:fixed;z-index:2147483000;padding:10px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.2);text-align:left;";

const TECLAS_IGNORADAS = new Set([
  "Shift",
  "Meta",
  "Control",
  "Alt",
  "AltGraph",
  "CapsLock",
  "NumLock",
  "ScrollLock",
  "Escape",
  "ContextMenu",
  "Dead",
  "Unidentified",
  "Process",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
]);

const MSG_VAZIO = "Nenhuma revisão identificada neste documento.";
const MSG_FEITO = "Revisões realizadas com sucesso";
const MSG_CK5 =
  "No editor do SEI 5, o rastreio automático de alterações ao digitar ainda não está disponível. Selecione um trecho antes de digitar para registrar a revisão, ou use o gerenciador de revisões.";

function agora(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Substitui a marca pelo seu texto (mantem o conteudo, tira o envoltorio). */
function trocarPeloTexto(marca: Element): void {
  const pai = marca.parentNode;
  if (!pai) return;
  pai.insertBefore(marca.ownerDocument.createTextNode(marca.textContent ?? ""), marca);
  pai.removeChild(marca);
}

/** Tira o espaco-marcador (`span.reviewSP`) que vem logo antes de uma marca de insercao. */
function tirarEspacoAnterior(marca: Element): void {
  const anterior = marca.previousElementSibling;
  if (anterior?.classList?.contains("reviewSP")) anterior.parentNode?.removeChild(anterior);
}

function tirar(no: Element): void {
  no.parentNode?.removeChild(no);
}

/**
 * Aceita ou rejeita revisoes no corpo (funcao pura sobre DOM). Aceitar uma insercao mantem o texto; aceitar uma
 * exclusao apaga o texto; rejeitar faz o inverso. `acceptAll`/`rejectAll` valem para todas as marcas.
 */
export function aplicarRevisao(corpo: Element, a: AcaoRevisao): void {
  for (const balao of [...corpo.querySelectorAll(".reviewDisplayPro")]) tirar(balao);
  const modo = a.mode;
  if (modo === "acceptAll" || modo === "rejectAll") {
    for (const marca of [...corpo.querySelectorAll(".reviewSeiPro")]) {
      const tipo = marca.getAttribute("data-review");
      if (tipo === "add") {
        tirarEspacoAnterior(marca);
        if (modo === "acceptAll") trocarPeloTexto(marca);
        else tirar(marca);
      } else if (tipo === "delete") {
        if (modo === "acceptAll") tirar(marca);
        else trocarPeloTexto(marca);
      }
    }
    return;
  }
  if (modo !== "accept" && modo !== "reject") return;
  const marca = [...corpo.querySelectorAll("span[data-id-review]")].find((m) => m.getAttribute("data-id-review") === String(a.idReview));
  if (!marca) return;
  const ehInsercao = (marca.getAttribute("data-review") ?? a.type) === "add";
  if (ehInsercao) tirarEspacoAnterior(marca);
  if (modo === "accept") {
    if (ehInsercao) trocarPeloTexto(marca);
    else tirar(marca);
  } else if (ehInsercao) tirar(marca);
  else trocarPeloTexto(marca);
}

/** Tira de um trecho copiado do documento tudo o que executaria algo ao ser posto na tela. */
const TAGS_DO_TRECHO = new Set(["P", "SPAN", "B", "I", "U", "S", "STRONG", "EM", "BR", "SUB", "SUP", "DEL", "INS"]);
const TAGS_DESCARTADAS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "LINK",
  "META",
  "BASE",
  "FORM",
  "SVG",
  "MATH",
  "TEMPLATE",
  "NOSCRIPT",
]);
const ATRIBUTOS_DO_TRECHO = new Set(["class", "style"]);

/** Trecho mostrado no cartao: lista de PERMISSAO (so formatacao simples; o resto vira texto ou some), nunca de bloqueio. */
function limparTrecho(no: Element): void {
  for (const el of [...no.querySelectorAll(".reviewDisplayPro")]) tirar(el);
  for (const el of [...no.querySelectorAll("*")]) {
    if (!el.parentNode) continue;
    const tag = el.tagName.toUpperCase();
    if (TAGS_DESCARTADAS.has(tag)) {
      tirar(el);
    } else if (!TAGS_DO_TRECHO.has(tag)) {
      // Elemento fora da lista: some a tag e fica so o texto (sem atributos, sem filhos perigosos que ja foram tratados).
      el.replaceWith(...[...el.childNodes]);
    }
  }
  for (const el of [no, ...no.querySelectorAll("*")]) {
    for (const atributo of [...el.attributes]) {
      const nome = atributo.name.toLowerCase();
      const perigoso = nome === "style" && /url\s*\(|expression|javascript:|@import/i.test(atributo.value);
      if (!ATRIBUTOS_DO_TRECHO.has(nome) || perigoso) el.removeAttribute(atributo.name);
    }
  }
}

interface Ligacoes {
  rolar(id: string): void;
  decidir(modo: "accept" | "reject", id: string, tipo: string, readonly: boolean): void;
  comentar(alvo: HTMLElement): void;
}

interface Balao {
  el: HTMLElement;
  marca: HTMLElement;
}
interface Estado {
  balao: Balao | null;
  gerenciador: { fechar(): void } | null;
  instrumentados: WeakSet<object>;
  avisouCk5: boolean;
  mousedownLigado: boolean;
}
const estados = new WeakMap<Contexto, Estado>();
const estadoDe = (c: Contexto): Estado => {
  const existente = estados.get(c);
  if (existente) return existente;
  const novo: Estado = { balao: null, gerenciador: null, instrumentados: new WeakSet(), avisouCk5: false, mousedownLigado: false };
  estados.set(c, novo);
  return novo;
};

function criar(c: Contexto) {
  const A = c.adaptador;
  const estado = estadoDe(c);
  const w = c.win as unknown as Monolito;
  const doc = c.doc;
  const avisar = (t: string) => avisarEditor(doc, t);

  const usuarioAtual = (): string => {
    const u = w.getOptionsPro?.("usuarioSistema");
    return typeof u === "string" ? u : "";
  };
  const analisar = (html: string): Document =>
    new (c.win as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(
      `<!doctype html><html><body>${html}</body></html>`,
      "text/html",
    );

  // ---------- cartao da revisao ----------

  /**
   * Monta o cartao. Com `lig` os botoes tem ouvintes diretos; sem ele (`getHtmlReviewDisplayPro`) levam o
   * `data-spro-click` que o despachante global resolve (com o prefixo `parent.` do legado).
   */
  function criarCartao(d: DadosCartao, readonly: boolean, lig: Ligacoes | null): HTMLElement {
    const comentario = d.comment ?? "";
    const id = String(d.id_review);
    const tipo = String(d.type);
    const cor = cores(tipo);
    const trecho: readonly Node[] | null = d.html ? (typeof d.html === "string" ? htmlParaNos(doc, d.html) : d.html) : null;

    const acao = (modo: "accept" | "reject", cor_: string, rotulo: string, titulo: string, icon: "check" | "cancelar") => {
      const el = h(
        "span",
        {
          class: "action",
          role: "button",
          tabindex: "0",
          style: `float:right;font-size:80%;margin-left:10px;cursor:pointer;color:${cor_};`,
          ...(lig ? {} : { "data-spro-click": "parent.removeReviewPro" }),
          "data-readonly": String(readonly),
          "data-id-review": id,
          "data-mode": modo,
          "data-type": tipo,
          title: titulo,
        },
        icone(icon, 14, doc),
        ` ${rotulo}`,
      );
      if (lig) {
        el.addEventListener("click", () => lig.decidir(modo, id, tipo, readonly));
        el.addEventListener("keydown", (ev) => {
          const tecla = (ev as KeyboardEvent).key;
          if (tecla === "Enter" || tecla === " ") {
            ev.preventDefault();
            lig.decidir(modo, id, tipo, readonly);
          }
        });
      }
      return el;
    };

    const textoComentario = comentario === "" ? (readonly ? "Nenhum comentário" : "Adicionar comentário") : comentario;
    const blocoComentario = (editavel: boolean): HTMLElement => {
      const el = h(
        "span",
        {
          style: "color:#777;font-size:90%;display:block;font-style:italic;margin:10px 0 5px 0;padding:5px;border-radius:5px;",
          ...(editavel
            ? { "data-info": comentario === "" ? "new" : "update", ...(lig ? {} : { "data-spro-click": "parent.addCommentReviewPro" }) }
            : {}),
        },
        icone("nota", 14, doc),
        " ",
        h("span", { class: "commentReview info", style: "padding:3px;" }, textoComentario),
      );
      if (editavel && lig) el.addEventListener("click", () => lig.comentar(el));
      return el;
    };

    const donoDoComentario = usuarioAtual() === d.user && !readonly;
    return h(
      "div",
      { class: "reviewDisplayPro", unselectable: "on" },
      h(
        "span",
        { contenteditable: "false" },
        d.text
          ? h(
              "span",
              { style: "margin:5px;display:block;" },
              h("span", { style: `background-color:${cor.fundo};` }, h(cor.tag, { style: `color:${cor.texto};` }, d.text)),
            )
          : null,
        trecho
          ? h(
              "div",
              {
                class: "textReview",
                "data-spro-tip": "Clique para rolar até o texto",
                ...(lig
                  ? { onclick: () => lig.rolar(id) }
                  : { "data-spro-click": "scroolToReview", "data-spro-args": JSON.stringify([id]) }),
              },
              ...trecho,
            )
          : null,
        h(
          "span",
          { style: "color:#777;font-size:90%;margin-left:5px;" },
          icone("pessoa", 14, doc),
          h("span", { class: "info" }),
          " ",
          h("strong", { class: "title-reviewtip", title: d.user }, d.user),
        ),
        h("span", { style: "color:#777;font-size:80%;margin-left:10px;font-style:italic;" }, icone("relogio", 13, doc), ` ${d.date}`),
        acao("accept", "#9CB639", "Aceitar", "Aceitar revisão", "check"),
        acao("reject", "#E46E64", "Rejeitar", "Rejeitar revisão", "cancelar"),
        donoDoComentario ? blocoComentario(true) : comentario === "" && !readonly ? null : blocoComentario(false),
      ),
    ) as HTMLElement;
  }

  /** Atributos de uma marca do documento -> dados do cartao (tudo texto). */
  function dadosDaMarca(marca: Element): DadosCartao {
    return {
      date: marca.getAttribute("data-date-review") ?? "",
      id_review: marca.getAttribute("data-id-review") ?? "",
      type: marca.getAttribute("data-review") ?? "",
      user: marca.getAttribute("data-user-review") ?? "",
      comment: marca.getAttribute("data-comment") ?? "",
      text: false,
    };
  }

  // ---------- escrita ----------

  /** Roda a transformacao do corpo (aceitar/rejeitar, gravar comentario). CK5: fora do `model.change`, que o adaptador proibe. */
  function transformar(ed: Editor, fn: (html: string) => string): boolean {
    if (A.somenteLeitura(ed)) {
      A.recusarEscrita();
      return false;
    }
    if (A.versao === 4) A.withEdit(ed, () => A.transformBodyHtml(ed, fn));
    else A.transformBodyHtml(ed, fn);
    return true;
  }

  function aoCorpo(html: string, fn: (corpo: HTMLElement) => void): string {
    const corpo = analisar(html).body;
    fn(corpo);
    return corpo.innerHTML;
  }

  // ---------- balao ----------

  function ocultar(forcar: boolean): void {
    const b = estado.balao;
    if (!b) return;
    if (!forcar) {
      let sobre = false;
      try {
        sobre = b.el.matches(":hover");
      } catch {
        sobre = false;
      }
      if (sobre) return;
    }
    b.el.remove();
    estado.balao = null;
  }

  function showReviewTips(this_: Element | null, _doc?: unknown): void {
    ocultar(true);
    const marca = this_?.closest?.("span.reviewSeiPro") as HTMLElement | null | undefined;
    if (!marca) return;
    const lig: Ligacoes = {
      rolar: (id) => scroolToReview(id),
      decidir: (modo, id, tipo, readonly) => decidir({ mode: modo, idReview: id, type: tipo, readonly }),
      comentar: (alvo) => editarComentario(alvo),
    };
    const el = criarCartao(dadosDaMarca(marca), false, lig);
    el.setAttribute("style", ESTILO_BALAO);
    doc.body.append(el);
    estado.balao = { el, marca };

    // posicao: logo abaixo da marca; o documento do CK4 e um iframe, entao soma o deslocamento dele
    const caixa = marca.getBoundingClientRect?.();
    if (caixa) {
      const quadro = marca.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.();
      const largura = el.getBoundingClientRect?.().width ?? 0;
      const esquerda = Math.max(8, Math.min(caixa.left + (quadro?.left ?? 0), (c.win.innerWidth || 0) - largura - 8));
      el.style.left = `${esquerda}px`;
      el.style.top = `${caixa.bottom + (quadro?.top ?? 0) + 4}px`;
      el.style.setProperty("margin", "0", "important");
    }
  }

  function hideReviewTips(_doc?: unknown): void {
    ocultar(false);
  }

  // ---------- comentario ----------

  /** Grava (ou apaga) o comentario na marca; o CK5 reconstroi o DOM a partir do model, entao tambem vai pelo corpo. */
  function gravarNaMarca(marca: Element, texto: string): void {
    if (texto !== "") {
      marca.setAttribute("data-comment", texto.replace(/(\r\n|\n|\r)/gm, " "));
      marca.setAttribute("data-date-review", agora());
    } else marca.removeAttribute("data-comment");
  }

  function persistirComentario(marca: Element): void {
    const ed = A.getInstance(marca);
    if (!ed) return;
    if (A.versao !== 5) {
      A.saveSnapshot(ed);
      return;
    }
    const id = marca.getAttribute("data-id-review") ?? "";
    const comentario = marca.getAttribute("data-comment");
    const data = marca.getAttribute("data-date-review");
    transformar(ed, (html) =>
      aoCorpo(html, (corpo) => {
        const alvo = [...corpo.querySelectorAll("span[data-id-review]")].find((m) => m.getAttribute("data-id-review") === id);
        if (!alvo) return;
        if (comentario !== null) {
          alvo.setAttribute("data-comment", comentario);
          if (data !== null) alvo.setAttribute("data-date-review", data);
        } else alvo.removeAttribute("data-comment");
      }),
    );
  }

  /** Clique no comentario do cartao do autor: vira editavel e grava na marca enquanto se digita (como o legado, 100 ms depois da tecla). */
  function editarComentario(alvo: HTMLElement): void {
    const info = alvo.querySelector<HTMLElement>(".commentReview");
    if (!info) return;
    const ed = A.getInstance(alvo);
    if (ed && A.somenteLeitura(ed)) {
      A.recusarEscrita();
      return;
    }
    const marca = (estado.balao?.el.contains(alvo) ? estado.balao.marca : null) ?? (alvo.closest(".reviewSeiPro") as HTMLElement | null);
    if (!marca) return;
    if (alvo.getAttribute("data-info") === "new") info.textContent = "";
    info.setAttribute("contenteditable", "true");
    info.focus?.();
    if (info.getAttribute("data-spro-edicao")) return;
    info.setAttribute("data-spro-edicao", "sim");
    const sincronizar = () => {
      const texto = (info.textContent ?? "").trim();
      alvo.setAttribute("data-info", texto !== "" ? "update" : "new");
      gravarNaMarca(marca, texto);
    };
    info.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key === "Enter") {
        ev.preventDefault();
        info.blur?.();
        return;
      }
      setTimeout(sincronizar, 100);
    });
    info.addEventListener("blur", () => {
      sincronizar();
      persistirComentario(marca);
    });
  }

  function addCommentReviewPro(this_: Element | null): void {
    if (this_) editarComentario(this_ as HTMLElement);
  }

  // ---------- aceitar / rejeitar ----------

  function mensagemNoGerenciador(texto: string): void {
    const caixa = doc.querySelector("#boxReviews");
    if (!caixa) return;
    caixa.replaceChildren(h("div", { class: "spro-nota" }, h("label", {}, texto)));
    doc.querySelector("#reviewBarra")?.setAttribute("hidden", "");
  }

  function setRemoveReviewPro(_this: Element | null, editor?: Editor | null, dados?: AcaoRevisao): void {
    const ed = editor ?? A.getInstance(_this);
    if (!ed) return;
    const a: AcaoRevisao = dados ?? {
      mode: _this?.getAttribute("data-mode") ?? undefined,
      idReview: _this?.getAttribute("data-id-review") ?? undefined,
      type: _this?.getAttribute("data-type") ?? undefined,
      readonly: _this?.getAttribute("data-readonly") === "true",
    };
    ocultar(true);
    if (!transformar(ed, (html) => aoCorpo(html, (corpo) => aplicarRevisao(corpo, a)))) return;
    const lote = a.mode === "acceptAll" || a.mode === "rejectAll";
    if (lote) {
      if (!doc.querySelector("#boxReviews")) return;
      mensagemNoGerenciador(MSG_FEITO);
      const g = estado.gerenciador;
      setTimeout(() => {
        if (g && estado.gerenciador === g) g.fechar();
      }, 3000);
    } else if (a.readonly) contentDialogReview();
  }

  function decidir(a: AcaoRevisao): void {
    const ed = A.getInstance();
    if (ed) setRemoveReviewPro(null, ed, a);
  }

  /** Chamado pelo despachante global: `this_` e o proprio botao do cartao (`data-spro-click="parent.removeReviewPro"`). */
  function removeReviewPro(this_: Element | null): void {
    const ed = A.getInstance(this_);
    if (!ed) return;
    setRemoveReviewPro(this_, ed);
  }

  // ---------- rolagem ----------

  function localizarMarca(id: string): HTMLElement | null {
    for (const ed of A.getAllInstances()) {
      const m = A.findInBody(ed, ".reviewSeiPro").find((x) => x.getAttribute("data-id-review") === id);
      if (m) return m;
    }
    return null;
  }

  function scroolToReview(idReview: unknown): void {
    const marca = localizarMarca(String(idReview));
    if (!marca) return;
    const container = doc.getElementById("divEditores");
    if (A.versao === 4 && container?.scrollTo) {
      const bloco = marca.closest("p") ?? marca;
      const caixa = bloco.getBoundingClientRect?.();
      if (caixa) {
        container.scrollTo({ top: caixa.top + (bloco.ownerDocument.defaultView?.pageYOffset ?? 0) + 200, behavior: "smooth" });
        return;
      }
    }
    marca.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }

  // ---------- insercao de marcas ----------

  /** A marca: o span com os atributos de revisao e, dentro, o `u`/`s` colorido (ou so os nos, quando `envolver` e falso). */
  function montarMarca(tipo: TipoRevisao, ref: string, nos: readonly Node[], envolver = true): HTMLElement {
    const cor = cores(tipo);
    return h(
      "span",
      {
        "data-review": tipo,
        class: "reviewSeiPro",
        "data-id-review": ref,
        "data-date-review": agora(),
        "data-user-review": usuarioAtual(),
        style: `background-color:${cor.fundo};`,
      },
      ...(envolver ? [h(cor.tag, { style: `color:${cor.texto};` }, ...nos)] : nos),
    );
  }

  function inserirMarca(
    ed: Editor,
    tipo: TipoRevisao,
    modo: "insert" | "change",
    texto: string,
    addSp: boolean,
    pClass: string | false,
  ): void {
    const ref = textoAleatorio(8);
    if (modo === "change") {
      if (A.versao === 4) {
        // CK4: estilo de span (fundo) e de u/s (cor) sobre a selecao, com os mesmos atributos nos dois
        const atributos = {
          "data-review": tipo,
          "data-user-review": usuarioAtual(),
          "data-date-review": agora(),
          "data-id-review": ref,
          class: "reviewSeiPro",
        };
        A.applyStyle(ed, { element: "span", attributes: { ...atributos, style: `background-color: ${cores(tipo).fundo}` } });
        A.applyStyle(ed, { element: cores(tipo).tag, attributes: { ...atributos, style: `color:${cores(tipo).texto}` } });
        return;
      }
      // CK5 nao tem estilo de classe: envolve o trecho selecionado (ou um u/s vazio) numa marca
      const selecionado = A.getSelectedHtml(ed);
      const cor = cores(tipo);
      const nos = selecionado ? htmlParaNos(doc, selecionado) : [h(cor.tag, { style: `color:${cor.texto};` })];
      const marca = montarMarca(tipo, ref, nos, false);
      A.withEdit(ed, () => A.insertHtml(ed, marca.outerHTML));
      return;
    }
    const marca = montarMarca(tipo, ref, [doc.createTextNode(texto)]);
    const espaco = addSp ? '<span class="reviewSP">&nbsp;</span> ' : "";
    const html = pClass ? `${h("p", { class: pClass }, marca).outerHTML} ` : marca.outerHTML + espaco;
    A.withEdit(ed, () => A.insertHtml(ed, html));
  }

  function setStyleReview(type?: string, mode?: string, text?: string, addSp?: boolean, pClass?: string | false): void {
    const ed = A.getInstance();
    if (!ed) return;
    inserirMarca(
      ed,
      type === "delete" ? "delete" : "add",
      mode === "change" ? "change" : "insert",
      text ?? "",
      addSp ?? false,
      pClass ?? false,
    );
  }

  // ---------- rastreio ao digitar ----------

  const botoesRevisao = (): Element[] => [...doc.querySelectorAll(".getReviewButton")];
  const modoAtivo = (): boolean => botoesRevisao().some((b) => b.classList.contains("cke_button_on"));

  function cruDoCk4(ed: Editor): Ck4Cru | null {
    const cru = ed as Ck4Cru;
    const sel = typeof cru.getSelection === "function" ? cru.getSelection() : null;
    return sel && typeof sel.getRanges === "function" && typeof cru.createRange === "function" ? cru : null;
  }
  const ckGlobal = (): Ck4Global => (c.win as unknown as { CKEDITOR?: Ck4Global }).CKEDITOR ?? {};

  function posicionarCursor(cru: Ck4Cru): Ck4Intervalo | null {
    const antigos = cru.getSelection()?.getRanges() ?? [];
    const antigo = antigos[antigos.length - 1];
    if (!antigo || !cru.createRange) return null;
    const novo = cru.createRange();
    novo.setStart(antigo.endContainer, antigo.endOffset);
    novo.setEnd(antigo.endContainer, antigo.endOffset);
    return novo;
  }

  function caractereNoCursor(cru: Ck4Cru, posicao: "prev" | "next"): string | null {
    const intervalo = cru.getSelection()?.getRanges()[0];
    if (!intervalo) return null;
    const no = intervalo.startContainer;
    const g = ckGlobal();
    const TEXTO = g.NODE_TEXT ?? 3;
    const indice = posicao === "prev" ? intervalo.startOffset - 1 : intervalo.startOffset;
    if (no.type === TEXTO && intervalo.startOffset) return no.getText()[indice] ?? null;
    const Caminhante = g.dom?.walker;
    if (!Caminhante || !cru.editable) return null;
    intervalo.collapse(true);
    intervalo.setStartAt(cru.editable(), g.POSITION_AFTER_START ?? 3);
    const caminhante = new Caminhante(intervalo);
    for (let n = caminhante.previous(); n; n = caminhante.previous()) {
      if (n.type === TEXTO) return n.getText().slice(-1);
    }
    return null;
  }

  /** Paragrafos entre o foco e a ancora da selecao (copias), para marcar cada um como excluido. */
  function paragrafosSelecionados(cru: Ck4Cru): Element[] {
    const nativa = cru.getSelection()?.getNative?.();
    const inicio = nativa?.focusNode?.parentElement ?? null;
    const fim = nativa?.anchorNode?.parentElement ?? null;
    const lista: Element[] = [];
    for (let el: Element | null = inicio; el; el = el.nextElementSibling) {
      lista.push(el.cloneNode(true) as Element);
      if (el === fim) break;
    }
    return lista;
  }

  const eNaMarcaDeAdicao = (el: Element | null | undefined) => el?.closest("span")?.getAttribute("data-review") === "add";

  function rastrearCk4(ed: Editor, cru: Ck4Cru, evt: EventoTecla): void {
    const codigo = evt.data?.keyCode;
    const tecla = evt.data?.domEvent?.$?.key ?? "";
    const sel = cru.getSelection();
    if (!sel) return;
    const inicio = sel.getStartElement()?.$ ?? null;
    const span = inicio?.closest("span") ?? null;
    const textoSelecionado = sel.getSelectedText();
    if (span?.classList.contains("commentReview")) return;

    const comoMarca = (t: string) => (t === " " ? "\u00a0" : t);
    if (textoSelecionado === "" && codigo === 8 && span?.getAttribute("data-review") !== "add") {
      A.saveSnapshot(ed);
      const novo = posicionarCursor(cru);
      const apagado = caractereNoCursor(cru, "prev");
      if (apagado) inserirMarca(ed, "delete", "insert", comoMarca(apagado), false, false);
      if (novo) sel.selectRanges([novo]);
      A.saveSnapshot(ed);
    } else if (textoSelecionado === "" && codigo === 46) {
      A.saveSnapshot(ed);
      posicionarCursor(cru);
      const apagado = caractereNoCursor(cru, "next");
      if (apagado) inserirMarca(ed, "delete", "insert", comoMarca(apagado), false, false);
      A.saveSnapshot(ed);
    } else if (!teclaIgnorada(tecla, evt)) {
      if (textoSelecionado !== "") {
        A.saveSnapshot(ed);
        const novoTexto = textoParaAdicionar(codigo, tecla);
        if (textoSelecionado.includes("\n\n")) {
          for (const p of paragrafosSelecionados(cru)) {
            inserirMarca(ed, "delete", "insert", p.textContent ?? "", true, p.getAttribute("class") ?? false);
          }
          A.saveSnapshot(ed);
        } else {
          inserirMarca(ed, "delete", "insert", textoSelecionado, true, false);
          inserirMarca(ed, "add", "insert", novoTexto, false, false);
          A.saveSnapshot(ed);
        }
        const novoInicio = cru.getSelection()?.getStartElement()?.$ ?? null;
        const spanNovo = novoInicio?.closest("span") ?? null;
        if (codigo !== 8 && codigo !== 46 && tecla.length === 1 && spanNovo?.getAttribute("data-review") === "add") {
          const intervalo = posicionarCursor(cru);
          setTimeout(() => {
            for (const u of spanNovo.querySelectorAll("u")) u.textContent = tecla;
            if (intervalo) cru.getSelection()?.selectRanges([intervalo]);
          });
        }
      } else if (!eNaMarcaDeAdicao(inicio)) {
        A.saveSnapshot(ed);
        inserirMarca(ed, "add", "change", "", false, false);
        A.saveSnapshot(ed);
      }
    }
  }

  /** Teclas que nao escrevem nem apagam (modificadoras, setas, sem nome) e atalhos Ctrl/Cmd+tecla. */
  const teclaIgnorada = (tecla: string, evt: EventoTecla): boolean =>
    tecla === "" || TECLAS_IGNORADAS.has(tecla) || tecla.startsWith("Arrow") || atalho(evt);

  const atalho = (evt: EventoTecla): boolean => {
    const d = evt.data?.domEvent?.$;
    return !!(d && (d.ctrlKey || d.metaKey) && !d.altKey);
  };

  /** Texto da insercao ao digitar sobre uma selecao: o caractere; nada para Delete/espaco/teclas sem caractere; espaco para Backspace. */
  function textoParaAdicionar(codigo: number | undefined, tecla: string): string {
    if (codigo === 8) return " ";
    if (codigo === 46 || codigo === 32) return "";
    return tecla.length === 1 ? tecla : "";
  }

  function rastrearCk5(ed: Editor, evt: EventoTecla): void {
    const codigo = evt.data?.keyCode;
    const tecla = evt.data?.domEvent?.$?.key ?? "";
    if (teclaIgnorada(tecla, evt)) return;
    const selecionado = A.getSelectedText(ed);
    if (selecionado !== "") {
      // unico caso reproduzivel pelo adaptador: trecho selecionado vira "excluido" + o caractere digitado "inserido"
      const novo = textoParaAdicionar(codigo, tecla);
      inserirMarca(ed, "delete", "insert", selecionado, true, false);
      if (novo) inserirMarca(ed, "add", "insert", novo, false, false);
      return;
    }
    // apagar/inserir caractere a caractere preservando o cursor depende da API de intervalos do CK4: avisa uma vez
    if (!estado.avisouCk5) {
      estado.avisouCk5 = true;
      avisar(MSG_CK5);
    }
  }

  function getStyleReview(evt?: EventoTecla): void {
    const ed = A.getInstance();
    if (ed) rastrearTecla(ed, evt ?? {});
  }

  function initStyleReview(this_?: Element | null): boolean {
    // a instancia do botao clicado: com secoes no CK4 o ouvinte nao pode ir para o Cabecalho
    const ed = A.getInstance(this_ ?? null);
    if (!ed) return false;
    if (estado.instrumentados.has(ed)) return false;
    if (A.versao === 4) {
      A.on(ed, "key", (evt) => {
        if (modoAtivo()) rastrearTecla(ed, evt as EventoTecla);
      });
    } else {
      A.on(ed, "keydown", (ev) => {
        const nativo = ev as KeyboardEvent;
        if (modoAtivo()) rastrearTecla(ed, { data: { keyCode: nativo.keyCode, domEvent: { $: nativo } } });
      });
    }
    estado.instrumentados.add(ed);
    return true;
  }

  /** O ouvinte atende o editor onde a tecla foi digitada (e nao so o que tem o foco). */
  function rastrearTecla(ed: Editor, evt: EventoTecla): void {
    const cru = A.versao === 4 ? cruDoCk4(ed) : null;
    if (cru) rastrearCk4(ed, cru, evt);
    else rastrearCk5(ed, evt);
  }

  function getBoxReview(this_?: Element | null): void {
    const botoes = botoesRevisao();
    // o botao do CK4 nasce com cke_button_off e o do CK5 sem classe nenhuma: desligado = sem cke_button_on
    const ligar = !modoAtivo();
    for (const b of botoes) {
      b.classList.add(ligar ? "cke_button_on" : "cke_button_off");
      b.classList.remove(ligar ? "cke_button_off" : "cke_button_on");
      b.setAttribute("aria-pressed", String(ligar));
    }
    if (ligar) initStyleReview(this_ ?? null);
  }

  // ---------- gerenciador de revisoes ----------

  /** Cartoes (um por revisao, sem repetir o id: o CK4 marca o trecho com dois elementos de mesmo id). */
  function cartoesDoDocumento(ed: Editor): HTMLElement[] {
    const marcas = A.findInBody(ed, ".reviewSeiPro");
    const vistos = new Set<string>();
    const lig: Ligacoes = {
      rolar: (id) => scroolToReview(id),
      decidir: (modo, id, tipo, readonly) => decidir({ mode: modo, idReview: id, type: tipo, readonly }),
      comentar: () => {},
    };
    const saida: HTMLElement[] = [];
    for (const marca of marcas) {
      const id = marca.getAttribute("data-id-review") ?? "";
      if (id !== "" && vistos.has(id)) continue;
      vistos.add(id);
      const bloco = (marca.closest("p") ?? marca).cloneNode(true) as Element;
      for (const m of [bloco, ...bloco.querySelectorAll(".reviewSeiPro")]) {
        if (m.classList.contains("reviewSeiPro") && (m.getAttribute("data-id-review") ?? "") === id) m.classList.add("reviewHighlights");
      }
      limparTrecho(bloco);
      const nos = [...bloco.childNodes].map((n) => doc.importNode(n, true));
      saida.push(criarCartao({ ...dadosDaMarca(marca), html: nos }, true, lig));
    }
    return saida;
  }

  function contentDialogReview(alertText?: string): void {
    const caixa = doc.querySelector("#boxReviews");
    if (!caixa) return;
    ocultar(true);
    const ed = A.getInstance();
    const cartoes = ed ? cartoesDoDocumento(ed) : [];
    const barra = doc.querySelector("#reviewBarra");
    if (cartoes.length === 0) {
      caixa.replaceChildren(h("div", { class: "spro-nota" }, h("label", {}, alertText ?? MSG_VAZIO)));
      barra?.setAttribute("hidden", "");
      return;
    }
    caixa.replaceChildren(...cartoes);
    barra?.removeAttribute("hidden");
    const contagem = doc.querySelector("#reviewContagem");
    if (contagem) contagem.textContent = cartoes.length === 1 ? "1 revisão no documento" : `${cartoes.length} revisões no documento`;
  }

  function getBoxCtrReview(this_?: Element | null): void {
    const ed = A.getInstance(this_ ?? null);
    if (!ed) return;
    estado.gerenciador?.fechar();
    const lote = (modo: "acceptAll" | "rejectAll") => () => decidir({ mode: modo });
    const rejeitar = h(
      "button",
      { type: "button", class: "spro-botao", id: "reviewRejectAll", title: "Rejeitar todas as revisões", onclick: lote("rejectAll") },
      "Rejeitar todas",
    );
    const aceitar = h(
      "button",
      {
        type: "button",
        class: "spro-botao primario",
        id: "reviewAcceptAll",
        title: "Aceitar todas as revisões",
        onclick: lote("acceptAll"),
      },
      "Aceitar todas",
    );
    const raiz = formulario(
      dica(
        "Alterações e comentários marcados no texto. Aceitar mantém a alteração; rejeitar a desfaz. Clique no trecho para ir até ele no documento.",
      ),
      h(
        "div",
        { class: "spro-barra", id: "reviewBarra" },
        h("span", { class: "spro-nota", id: "reviewContagem" }),
        h("div", { style: "display:flex;gap:8px;" }, rejeitar, aceitar),
      ),
      h("div", { id: "boxReviews" }),
    );
    raiz.id = "dialogReviewPro";
    const g = abrirDialogo(doc, {
      titulo: "Gerenciar Revisões",
      largura: 700,
      conteudo: raiz,
      aoFechar: () => {
        if (estado.gerenciador === g) estado.gerenciador = null;
        ocultar(true);
      },
    });
    estado.gerenciador = g;
    contentDialogReview();
  }

  const iniciar = (): void => {
    if (A.versao !== 5 || estado.mousedownLigado) return;
    estado.mousedownLigado = true;
    // CK5: o monolito so liga o mousedown nos iframes do CK4
    doc.addEventListener(
      "mousedown",
      (ev) => {
        const alvo = ev.target as Element | null;
        if (!alvo || estado.balao?.el.contains(alvo)) return;
        const marca = alvo.closest?.("span.reviewSeiPro");
        if (marca && alvo.closest(".ck-editor__editable_inline") && c.checkOpcao("revisaotexto")) showReviewTips(marca);
        else ocultar(false);
      },
      true,
    );
  };

  const globais = {
    setStyleReview,
    showReviewTips,
    hideReviewTips,
    scroolToReview,
    getHtmlReviewDisplayPro: (data: DadosCartao, readonly?: boolean) => criarCartao(data, readonly ?? false, null).outerHTML,
    addCommentReviewPro,
    removeReviewPro,
    setRemoveReviewPro,
    getBoxCtrReview,
    /** Compat com o `initFunctions` do monolito: o dialogo abre sob demanda em `getBoxCtrReview`. */
    getDialogReview: () => {},
    contentDialogReview,
    getBoxReview,
    initStyleReview,
    getStyleReview,
  };
  return { globais, iniciar };
}

export const recurso: Recurso = {
  id: "review",
  globais: (c: Contexto) => criar(c).globais,
  iniciar: (c: Contexto) => criar(c).iniciar(),
};
