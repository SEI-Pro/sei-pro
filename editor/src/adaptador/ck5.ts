import { anexarMenuDom } from "./menu";
import type { Adaptador, DefinicaoEstilo, Editor, ItemMenu } from "./tipos";

interface Ck5Raiz {
  rootName: string;
  isAttached(): boolean;
}

interface Ck5Writer {
  createPositionBefore(el: unknown): unknown;
  createPositionAt(raiz: Ck5Raiz, onde: "end"): unknown;
  createText(texto: string): unknown;
  createRange(a: unknown, b: unknown): unknown;
  addMarker(nome: string, o: { range: unknown; usingOperation: boolean }): void;
  removeMarker(nome: string): void;
  setSelection(range: unknown, o?: { backward: boolean }): void;
}

/** Superficie do CKEditor 5 (multi-root, uma instancia) que o adaptador usa. */
interface Ck5Instancia {
  state: string;
  focus(): void;
  execute(comando: string, args?: unknown): void;
  model: {
    change<T>(fn: (w: Ck5Writer) => T): T;
    insertContent(conteudo: unknown, onde?: unknown): void;
    createPositionFromPath(raiz: unknown, caminho: number[]): unknown;
    markers: { get(nome: string): { getRange(): unknown } | null; has(nome: string): boolean };
    document: {
      roots: Iterable<Ck5Raiz>;
      getRoot(nome: string): Ck5Raiz | undefined;
      selection: {
        isBackward: boolean;
        getFirstPosition(): { root: Ck5Raiz } | null;
        getFirstRange(): { start: { root: Ck5Raiz; path: number[] }; end: { root: Ck5Raiz; path: number[] } } | null;
      };
    };
  };
  data: {
    get(o?: { rootName?: string; seiProInterno?: boolean }): string;
    set(v: string | Record<string, string>): void;
    toModel(view: unknown): unknown;
    processor: { toView(html: string): unknown };
  };
  editing: {
    view: {
      document: { getRoot(nome: string): unknown };
      domConverter: { mapViewToDom(v: unknown): Element | null; mapDomToView(el: Element): unknown };
    };
    mapper: { toModelElement(view: unknown): { root?: { rootName: string } } | null };
  };
  ui?: { view?: { toolbar?: { element?: HTMLElement } } };
}

interface InfraConfig {
  rootsAttributes?: Record<string, { principal?: boolean; somenteLeitura?: boolean; label?: string }>;
}

type Janela = Window & typeof globalThis & { INFRA_EDITOR_CONFIG?: InfraConfig };

const ck = (e: Editor): Ck5Instancia => e as Ck5Instancia;

/** Comando do CK5 para cada nome de comando do CK4 que os recursos usam. */
const COMANDOS: Record<string, string> = { strike: "strikethrough", strikethrough: "strikethrough" };
const POR_ELEMENTO: Record<string, string> = {
  strong: "bold",
  b: "bold",
  em: "italic",
  i: "italic",
  u: "underline",
  s: "strikethrough",
  strike: "strikethrough",
};

let marcador = 0;

/** Backend do CKEditor 5 (SEI 5): uma instancia multi-root, sem iframe. */
export function criarBackendCk5(win: Janela): Adaptador {
  const doc = win.document;
  const roots = (ed: Ck5Instancia): Ck5Raiz[] =>
    Array.from(ed.model.document.roots ?? []).filter((r) => r.isAttached() && r.rootName !== "$graveyard");
  const atributos = (nome: string) => win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[nome];
  const domDaRaiz = (ed: Ck5Instancia, nome: string): Element | null => {
    const v = ed.editing.view.document.getRoot(nome);
    return v ? ed.editing.view.domConverter.mapViewToDom(v) : null;
  };

  /** Editavel do corpo: a raiz "principal"; senao a de aria-label "Corpo do Texto"; senao a de mais filhos. */
  const corpoDe = (ed: Ck5Instancia): HTMLElement | null => {
    for (const r of roots(ed)) {
      if (atributos(r.rootName)?.principal) {
        const dom = domDaRaiz(ed, r.rootName);
        if (dom) return dom as HTMLElement;
      }
    }
    const preferido = doc.querySelector<HTMLElement>('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');
    if (preferido) return preferido;
    const todas = Array.from(doc.querySelectorAll<HTMLElement>(".ck-editor__editable_inline"));
    return todas.reduce<HTMLElement | null>((acc, el) => (el.childElementCount > (acc ? acc.childElementCount : -1) ? el : acc), null);
  };
  const raizDoCorpo = (ed: Ck5Instancia): Ck5Raiz | null => {
    const corpo = corpoDe(ed);
    return (corpo && roots(ed).find((r) => domDaRaiz(ed, r.rootName) === corpo)) || null;
  };
  /** Raiz onde esta a selecao: a unica pista de "em que secao o usuario esta" num editor multi-root. */
  const raizDaSelecao = (ed: Ck5Instancia): string | null => ed.model.document.selection.getFirstPosition()?.root.rootName ?? null;
  const raizSomenteLeitura = (nome: string | null | undefined) => !!nome && !!atributos(nome)?.somenteLeitura;
  const modelo = (ed: Ck5Instancia, html: string) => ed.data.toModel(ed.data.processor.toView(html));

  const insere = (e: Editor, html: string) => {
    const ed = ck(e);
    if (raizSomenteLeitura(raizDaSelecao(ed))) return;
    ed.model.change(() => ed.model.insertContent(modelo(ed, html), ed.model.document.selection));
  };

  const a: Adaptador = {
    versao: 5,
    getInstance() {
      const ed = (doc.querySelector(".ck-editor__editable_inline") as (Element & { ckeditorInstance?: Ck5Instancia }) | null)
        ?.ckeditorInstance;
      return ed && ed.state === "ready" ? ed : null;
    },
    getAllInstances() {
      const ed = a.getInstance();
      return ed ? [ed] : [];
    },
    focus: (e) => ck(e).focus(),
    /** No CK5 o undo e automatico para todo `model.change`: o snapshot manual nao existe. */
    saveSnapshot() {},
    withEdit(e, fn) {
      const ed = ck(e);
      ed.focus();
      ed.model.change(() => fn());
    },
    insertHtml: insere,
    insertText(e, texto) {
      const ed = ck(e);
      if (raizSomenteLeitura(raizDaSelecao(ed))) return;
      ed.model.change((w) => ed.model.insertContent(w.createText(texto)));
    },
    getSelectionElement() {
      const s = win.getSelection?.();
      const no = s && s.rangeCount > 0 ? s.anchorNode : null;
      if (!no) return null;
      return no.nodeType === 1 ? (no as Element) : no.parentElement;
    },
    getSelectionParagraph: (e) => a.getSelectionElement(e)?.closest("p") ?? null,
    insertHtmlBefore(e, ref, html) {
      const ed = ck(e);
      const visao = ed.editing.view.domConverter.mapDomToView(ref);
      const el = visao ? ed.editing.mapper.toModelElement(visao) : null;
      if (el) {
        if (raizSomenteLeitura(el.root?.rootName)) return;
        ed.model.change((w) => ed.model.insertContent(modelo(ed, html), w.createPositionBefore(el)));
        return;
      }
      insere(e, html); // sem mapeamento para o model: na selecao atual (menos preciso, mas funciona)
    },
    getToolbarContainer(e) {
      const tb = ck(e).ui?.view?.toolbar?.element;
      return tb ? (tb.querySelector<HTMLElement>(".ck-toolbar__items") ?? tb) : null;
    },
    getBodyContainer: (e) => corpoDe(ck(e)),
    findInBody(e, seletor) {
      const c = corpoDe(ck(e));
      return c ? Array.from(c.querySelectorAll<HTMLElement>(seletor)) : [];
    },
    /** No fim da raiz do corpo, pelo model (um append direto ao DOM seria reconciliado e apagado pelo CK5). */
    appendToBody(e, html) {
      const ed = ck(e);
      const raiz = raizDoCorpo(ed);
      if (!raiz) return insere(e, html);
      if (raizSomenteLeitura(raiz.rootName)) return;
      ed.model.change((w) => ed.model.insertContent(modelo(ed, html), w.createPositionAt(raiz, "end")));
    },
    /** Nao chamar dentro de `model.change`. `seiProInterno`: e um vai-e-volta, nao o HTML gravado. */
    transformBodyHtml(e, fn) {
      const ed = ck(e);
      const raiz = raizDoCorpo(ed);
      if (!raiz) return;
      const html = ed.data.get({ rootName: raiz.rootName, seiProInterno: true });
      const novo = fn(html);
      if (typeof novo !== "string" || novo === html) return;
      // `data.set` leva a selecao para a primeira secao: guarda e restaura onde o usuario estava.
      const rg = ed.model.document.selection.getFirstRange();
      const salva =
        rg && rg.start.root.rootName === rg.end.root.rootName
          ? { raiz: rg.start.root, ps: [...rg.start.path], pe: [...rg.end.path] }
          : null;
      const costas = ed.model.document.selection.isBackward;
      ed.data.set({ [raiz.rootName]: novo });
      if (!salva) return;
      ed.model.change((w) => {
        let ini: unknown;
        let fim: unknown;
        try {
          ini = ed.model.createPositionFromPath(salva.raiz, salva.ps);
          fim = ed.model.createPositionFromPath(salva.raiz, salva.pe);
        } catch {
          ini = fim = w.createPositionAt(salva.raiz, "end"); // caminho invalido depois da transformacao
        }
        w.setSelection(w.createRange(ini, fim), { backward: costas });
      });
    },
    /** Erros do CK5 (comando inexistente) NAO sao engolidos: o legado os mascarava e escondia recurso quebrado. */
    execCommand(e, comando, valor) {
      ck(e).execute(COMANDOS[comando] ?? comando, valor !== undefined ? { value: valor } : undefined);
    },
    applyStyle(e, def: DefinicaoEstilo) {
      const comando = POR_ELEMENTO[def.element.toLowerCase()];
      if (comando) ck(e).execute(comando);
    },
    getData(e) {
      const ed = ck(e);
      const raiz = raizDoCorpo(ed);
      return raiz ? ed.data.get({ rootName: raiz.rootName }) : ed.data.get();
    },
    setData(e, html) {
      const ed = ck(e);
      const raiz = raizDoCorpo(ed);
      if (raiz) ed.data.set({ [raiz.rootName]: html });
      else ed.data.set(html);
    },
    insertElement: (e, html) => a.insertHtml(e, html),
    /** Marcador do model na posicao da selecao; o nome e o token. Prefixo proprio (`spro-ed:`), sem colisao com o legado. */
    saveSelection(e) {
      const ed = ck(e);
      const nome = `spro-ed:${marcador++}`;
      ed.model.change((w) => {
        const range = ed.model.document.selection.getFirstRange();
        if (range) w.addMarker(nome, { range, usingOperation: false });
      });
      return nome;
    },
    restoreSelection(e, token) {
      const ed = ck(e);
      if (typeof token !== "string") return;
      const m = ed.model.markers.get(token);
      if (m) ed.model.change((w) => w.setSelection(m.getRange()));
      ed.model.change((w) => {
        if (ed.model.markers.has(token)) w.removeMarker(token);
      });
    },
    getSelectedText: () => String(win.getSelection?.() ?? ""),
    getSelectedHtml() {
      const s = win.getSelection?.();
      if (!s || s.rangeCount === 0) return "";
      const div = doc.createElement("div");
      div.append(s.getRangeAt(0).cloneContents());
      return div.innerHTML;
    },
    on(e, evento, fn) {
      if (evento === "change")
        return (ck(e) as unknown as { model: { document: { on(n: string, f: unknown): void } } }).model.document.on("change:data", fn);
      corpoDe(ck(e))?.addEventListener(evento, fn);
    },
    off(e, evento, fn) {
      if (evento === "change")
        return (ck(e) as unknown as { model: { document: { off(n: string, f: unknown): void } } }).model.document.off("change:data", fn);
      corpoDe(ck(e))?.removeEventListener(evento, fn);
    },
    /** O CK5 nao tem snapshot manual: so eventos DOM no editavel do corpo. */
    fire(e, evento, dados) {
      corpoDe(ck(e))?.dispatchEvent(new CustomEvent(evento, { detail: dados }));
    },
    addContextMenu(e, construtor: (alvo: Element | null) => ItemMenu[]) {
      anexarMenuDom(corpoDe(ck(e)), construtor);
    },
    waitReady(ms) {
      return new Promise<Editor>((resolve, reject) => {
        const inicio = Date.now();
        const sondar = () => {
          const ed = a.getInstance();
          if (ed) return resolve(ed);
          if (Date.now() - inicio > ms) return reject(new Error("Timeout aguardando CKEditor 5"));
          setTimeout(sondar, 100);
        };
        sondar();
      });
    },
    somenteLeitura: (e) => raizSomenteLeitura(raizDaSelecao(ck(e))),
  };
  return a;
}
