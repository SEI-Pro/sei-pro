import { htmlParaNos } from "../../src/adaptador/html";
import { type JanelaFalsa, paginaFalsa } from "./pagina";

export interface SecaoCk5 {
  raiz: string;
  label: string;
  html: string;
  somenteLeitura?: boolean;
  principal?: boolean;
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
  insercoes: Array<{ html: string; posicao: unknown }> = [];
  executados: Array<[string, unknown]> = [];
  dadosPorRaiz: Record<string, string> = {};
  marcadores = new Map<string, unknown>();
  selecaoRaiz: string;
  selecaoBackward = false;
  readonly roots: RaizFalsa[];
  readonly elementos = new Map<string, HTMLElement>();
  readonly selecoesDefinidas: unknown[] = [];

  constructor(secoes: SecaoCk5[], doc: Document) {
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

  private raizDoElemento(el: Element | null): string | null {
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
    createText: (texto: string) => ({ texto }),
    createRange: (a: unknown, b: unknown) => ({ a, b }),
    addMarker: (nome: string, o: unknown) => {
      this.marcadores.set(nome, o);
    },
    removeMarker: (nome: string) => {
      this.marcadores.delete(nome);
    },
    setSelection: (r: unknown) => {
      this.selecoesDefinidas.push(r);
    },
  };

  model = ((self: InstanciaCk5) => ({
    change: <T>(fn: (w: InstanciaCk5["writer"]) => T): T => {
      this.mudancas += 1;
      return fn(this.writer);
    },
    insertContent: (conteudo: { html?: string; texto?: string }, posicao?: unknown) => {
      this.insercoes.push({ html: conteudo.html ?? `texto:${conteudo.texto}`, posicao });
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
      domConverter: {
        mapViewToDom: (v: { viewRoot?: string; dom?: Element }) =>
          v.viewRoot ? (this.elementos.get(v.viewRoot) ?? null) : (v.dom ?? null),
        mapDomToView: (el: Element) => (this.raizDoElemento(el) ? { dom: el } : null),
      },
    },
    mapper: {
      toModelElement: (v: { dom: Element }) => ({ elemento: v.dom, rootName: this.raizDoElemento(v.dom) }),
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
  selecionar(s: { raiz?: string; elemento?: Element | null; texto?: string; html?: string }): void;
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
      const el = s.elemento ?? null;
      win.getSelection = () =>
        ({
          rangeCount: el ? 1 : 0,
          anchorNode: el,
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
