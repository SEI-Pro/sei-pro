import { htmlParaNos } from "../../src/adaptador/html";
import { type JanelaFalsa, paginaFalsa } from "./pagina";

export interface SecaoCk5 {
  raiz: string;
  label: string;
  html: string;
  somenteLeitura?: boolean;
  principal?: boolean;
}

interface ModeloFalso {
  elemento: Element;
  /** Como no CK5 real: elemento do model tem `root` (RootElement); so a raiz tem `rootName`. */
  root: { rootName: string | null };
  name: string;
  /** O elemento inserido imediatamente antes (por `insertContent` com posicao `createPositionBefore`), ou null. */
  readonly previousSibling: ModeloFalso | null;
  getChildren(): Iterable<ModeloFalso>;
  is(tipo: string): boolean;
  getAttribute(nome: string): string | undefined;
}

interface RaizFalsa {
  rootName: string;
  isAttached(): boolean;
}

/** Instancia CK5 falsa (multi-root): registra `model.change`, insercoes, comandos e marcadores. */
export class InstanciaCk5 {
  state = "ready";
  focos = 0;
  mudancas = 0;
  /** Quantos `model.change` estao abertos agora (para provar que uma acao inteira roda num so batch). */
  profundidade = 0;
  insercoes: Array<{ html: string; posicao: unknown }> = [];
  executados: Array<[string, unknown]> = [];
  dadosPorRaiz: Record<string, string> = {};
  marcadores = new Map<string, unknown>();
  selecaoRaiz: string;
  selecaoBackward = false;
  readonly roots: RaizFalsa[];
  readonly elementos = new Map<string, HTMLElement>();
  readonly selecoesDefinidas: unknown[] = [];
  /** Intervalos (elemento DOM do link) removidos por `writer.remove` e textos reinseridos por `writer.insertText`. */
  readonly removidos: Array<Element | null> = [];
  readonly textosInseridos: Array<{ texto: string; atributos: Record<string, string>; posicao: unknown; profundidade: number }> = [];
  /** Paragrafos (DOM) que `getSelectedBlocks()` devolve. */
  blocos: Element[] = [];
  /** Atributos do model por elemento DOM (o que `writer.setAttribute` grava), p.ex. `estilo`. */
  readonly atributos = new Map<Element, Record<string, string>>();
  private readonly modelos = new Map<Element, ModeloFalso>();
  /** Elemento inserido antes de cada elemento (o `previousSibling` do model). */
  readonly inseridoAntes = new Map<Element, ModeloFalso>();
  private readonly doc: Document;

  /** Elemento do model de um elemento DOM (sempre o mesmo objeto). */
  modeloDe(el: Element): ModeloFalso {
    let m = this.modelos.get(el);
    if (!m) {
      const mapa = this.inseridoAntes;
      const modeloDe = (x: Element) => this.modeloDe(x);
      m = {
        elemento: el,
        root: { rootName: this.raizDoElemento(el) },
        name: el.tagName === "P" ? "paragraph" : el.tagName.toLowerCase(),
        // o inserido antes (se houve) ou, como no model de verdade, o irmao anterior que ja existia
        get previousSibling() {
          const anterior = el.previousElementSibling;
          return mapa.get(el) ?? (anterior ? modeloDe(anterior) : null);
        },
        getChildren: () => [...el.querySelectorAll(":scope > p")].map((x) => this.modeloDe(x)),
        is: (t: string) => t === "element",
        getAttribute: (n: string) => this.atributos.get(el)?.[n],
      };
      this.modelos.set(el, m);
    }
    return m;
  }

  constructor(secoes: SecaoCk5[], doc: Document) {
    this.doc = doc;
    this.doc = doc;
    this.roots = [...secoes.map((s) => ({ rootName: s.raiz, isAttached: () => true })), { rootName: "$graveyard", isAttached: () => true }];
    for (const s of secoes) {
      const el = doc.createElement("div");
      el.className = "ck-editor__editable ck-editor__editable_inline";
      el.setAttribute("aria-label", s.label);
      (el as unknown as { ckeditorInstance: unknown }).ckeditorInstance = this;
      for (const n of htmlParaNos(doc, s.html)) el.append(n);
      doc.body.append(el);
      this.elementos.set(s.raiz, el);
      this.dadosPorRaiz[s.raiz] = s.html;
    }
    this.selecaoRaiz = (secoes.find((s) => s.principal) ?? (secoes[0] as SecaoCk5)).raiz;
  }

  raizDoElemento(el: Element | null): string | null {
    for (const [nome, dom] of this.elementos) if (el && (dom === el || dom.contains(el))) return nome;
    return null;
  }

  focus() {
    this.focos += 1;
  }
  execute(comando: string, args?: unknown) {
    this.executados.push([comando, args]);
  }

  readonly writer = {
    createPositionBefore: (el: unknown) => ({ antes: el }),
    createPositionAt: (raiz: RaizFalsa, onde: string) => ({ em: raiz.rootName, onde }),
    createText: (texto: string, atributos?: Record<string, string>) => ({ texto, atributos }),
    createRange: (a: unknown, b: unknown) => ({ a, b }),
    /** Sem marcas no model do falso: os executores de notas veem um corpo vazio (a logica e testada em `nota-rodape.ts` com um model proprio). */
    createRangeIn: () => ({ getItems: () => [] as unknown[] }),
    addMarker: (nome: string, o: unknown) => {
      this.marcadores.set(nome, o);
    },
    setAttribute: (nome: string, valor: string, modelo: ModeloFalso) => {
      this.atributos.set(modelo.elemento, { ...this.atributos.get(modelo.elemento), [nome]: valor });
    },
    removeMarker: (nome: string) => {
      this.marcadores.delete(nome);
    },
    setSelection: (r: unknown) => {
      this.selecoesDefinidas.push(r);
      // `setSelection(raiz, "end")` leva a selecao para aquela raiz (o que o CK5 faz de verdade)
      const nome = (r as { rootName?: string } | null)?.rootName;
      if (nome) this.selecaoRaiz = nome;
    },
    /** `remove(intervalo)` + `insertText(texto, atributos, posicao)`: o que o CK5 faz ao trocar o texto de um link. */
    remove: (intervalo: { intervaloDe?: Element }) => {
      this.removidos.push(intervalo.intervaloDe ?? null);
    },
    insertText: (texto: string, atributos: Record<string, string>, posicao: unknown) => {
      this.textosInseridos.push({ texto, atributos, posicao, profundidade: this.profundidade });
    },
  };

  model = ((self: InstanciaCk5) => ({
    change: <T>(fn: (w: InstanciaCk5["writer"]) => T): T => {
      this.mudancas += 1;
      self.profundidade += 1;
      try {
        return fn(self.writer);
      } finally {
        self.profundidade -= 1;
      }
    },
    insertContent: (conteudo: { html?: string; texto?: string; atributos?: Record<string, string> }, posicao?: unknown) => {
      const alvo = (posicao as { antes?: ModeloFalso } | undefined)?.antes;
      // o elemento novo, como o model o teria: irmao anterior do alvo
      if (alvo) this.inseridoAntes.set(alvo.elemento, this.modeloDe(this.doc.createElement("p")));
      this.insercoes.push({
        html: conteudo.html ?? `texto:${conteudo.texto}${conteudo.atributos ? `|${JSON.stringify(conteudo.atributos)}` : ""}`,
        posicao,
      });
    },
    createPositionFromPath: (raiz: RaizFalsa, caminho: number[]) => ({ raiz: raiz.rootName, caminho }),
    markers: {
      get: (nome: string) => (this.marcadores.has(nome) ? { getRange: () => ({ marcador: nome }) } : null),
      has: (nome: string) => this.marcadores.has(nome),
    },
    document: {
      get roots() {
        return self.roots;
      },
      getRoot: (nome: string) => this.roots.find((r) => r.rootName === nome),
      selection: {
        isBackward: false,
        getSelectedBlocks: () => self.blocos.map((b) => self.modeloDe(b)),
        getFirstPosition: () => ({ root: this.roots.find((r) => r.rootName === this.selecaoRaiz) }),
        getFirstRange: () => {
          const raiz = this.roots.find((r) => r.rootName === this.selecaoRaiz);
          return { start: { root: raiz, path: [0, 0] }, end: { root: raiz, path: [0, 3] } };
        },
      },
    },
  }))(this);

  data = {
    get: (o?: { rootName?: string }) => this.dadosPorRaiz[o?.rootName ?? "main"] ?? "",
    set: (v: string | Record<string, string>) => {
      if (typeof v === "string") this.dadosPorRaiz.main = v;
      else Object.assign(this.dadosPorRaiz, v);
    },
    toModel: (view: { html: string }) => ({ html: view.html }),
    processor: { toView: (html: string) => ({ html }) },
  };

  editing = {
    view: {
      document: { getRoot: (nome: string) => ({ viewRoot: nome }) },
      createRangeOn: (v: { dom?: Element }) => ({ visao: v }),
      domConverter: {
        mapViewToDom: (v: { viewRoot?: string; dom?: Element }) =>
          v.viewRoot ? (this.elementos.get(v.viewRoot) ?? null) : (v.dom ?? null),
        mapDomToView: (el: Element) => (this.raizDoElemento(el) ? { dom: el } : null),
      },
    },
    mapper: {
      toModelElement: (v: { dom: Element }) => this.modeloDe(v.dom),
      toModelRange: (r: { visao: { dom?: Element } }) => ({
        root: this.modeloDe(r.visao.dom as Element).root,
        intervaloDe: r.visao.dom,
        start: { intervaloDe: r.visao.dom },
      }),
      toViewElement: (m: ModeloFalso) => ({ dom: m.elemento, name: "p" }),
    },
  };

  ui = { view: { toolbar: { element: { querySelector: () => null } } } };
}

export interface FalsoCk5 {
  versao: 5;
  doc: Document;
  win: JanelaFalsa;
  /** Monta a instancia (o CK5 so aparece no DOM depois de montado). */
  montar(): InstanciaCk5;
  instancia(): InstanciaCk5;
  elemento(raiz: string): HTMLElement;
  /** Define onde esta a selecao: raiz do model, elemento do DOM, texto e HTML selecionados. */
  selecionar(s: {
    raiz?: string;
    elemento?: Element | null;
    texto?: string;
    html?: string;
    blocos?: Element[];
    ancora?: Node | null;
    foco?: Node | null;
  }): void;
}

/** Pagina SEI 5: `INFRA_EDITOR_CONFIG` desde o inicio; o DOM do CK5 so depois de `montar()` (`montarLogo` o faz de imediato). */
export function criarCk5(opcoes: { secoes: SecaoCk5[]; montarLogo?: boolean }): FalsoCk5 {
  const { doc, win } = paginaFalsa();
  const rootsAttributes: Record<string, unknown> = {};
  for (const s of opcoes.secoes) rootsAttributes[s.raiz] = { label: s.label, somenteLeitura: !!s.somenteLeitura, principal: !!s.principal };
  win.INFRA_EDITOR_CONFIG = { rootsAttributes };
  let inst: InstanciaCk5 | null = null;
  const f: FalsoCk5 = {
    versao: 5,
    doc,
    win,
    montar() {
      inst = new InstanciaCk5(opcoes.secoes, doc);
      return inst;
    },
    instancia: () => inst as InstanciaCk5,
    elemento: (raiz) => (inst as InstanciaCk5).elementos.get(raiz) as HTMLElement,
    selecionar(s) {
      const i = inst as InstanciaCk5;
      if (s.raiz) i.selecaoRaiz = s.raiz;
      i.blocos = s.blocos ?? [];
      const el = s.elemento ?? null;
      win.getSelection = () =>
        ({
          rangeCount: el ? 1 : 0,
          anchorNode: s.ancora ?? el,
          focusNode: s.foco ?? s.ancora ?? el,
          toString: () => s.texto ?? "",
          getRangeAt: () =>
            ({
              cloneContents: () => {
                const frag = doc.createDocumentFragment();
                for (const n of htmlParaNos(doc, s.html ?? "")) frag.append(n);
                return frag;
              },
            }) as unknown as Range,
        }) as unknown as Selection;
    },
  };
  if (opcoes.montarLogo !== false) f.montar();
  return f;
}
