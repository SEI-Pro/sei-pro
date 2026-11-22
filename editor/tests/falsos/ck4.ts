import { parseHTML } from "linkedom";
import { type JanelaFalsa, paginaFalsa } from "./pagina";

export interface SecaoCk4 {
  nome: string;
  titulo: string;
  html: string;
  somenteLeitura?: boolean;
}

/** Instancia CK4 falsa: so a superficie que o backend usa, registrando o que recebe. */
export class InstanciaCk4 {
  readonly config: { title: string };
  readonly container: { $: HTMLElement };
  readonly corpo: HTMLElement;
  status = "ready";
  snapshots = 0;
  /** Todo evento disparado por `fire`, na ordem. */
  eventosDisparados: string[] = [];
  inseridos: string[] = [];
  textos: string[] = [];
  comandos: Array<[string, unknown]> = [];
  estilos: unknown[] = [];
  focos = 0;
  selecao: { elemento: Element | null; texto: string; html: string } = { elemento: null, texto: "", html: "" };
  private escutas = new Map<string, Array<(...a: unknown[]) => void>>();
  // menu de contexto nativo
  ouvintesMenu: Array<(el: { $?: Element } | null) => Record<string, number> | null> = [];
  comandosMenu = new Map<string, { exec(): boolean }>();
  itensMenu = new Map<string, { label: string; command: string; group: string }>();
  grupos: string[] = [];

  constructor(
    readonly name: string,
    titulo: string,
    html: string,
    public readOnly: boolean,
    cke: HTMLElement,
  ) {
    this.config = { title: titulo };
    this.container = { $: cke };
    const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
    this.corpo = document.body as unknown as HTMLElement;
  }

  get document() {
    return { getBody: () => ({ $: this.corpo }) };
  }
  focus() {
    this.focos += 1;
  }
  fire(evento: string, dados?: unknown) {
    this.eventosDisparados.push(evento);
    if (evento === "saveSnapshot") this.snapshots += 1;
    for (const fn of this.escutas.get(evento) ?? []) fn(dados);
  }
  on(evento: string, fn: (...a: unknown[]) => void) {
    this.escutas.set(evento, [...(this.escutas.get(evento) ?? []), fn]);
  }
  removeListener(evento: string, fn: (...a: unknown[]) => void) {
    this.escutas.set(
      evento,
      (this.escutas.get(evento) ?? []).filter((f) => f !== fn),
    );
  }
  insertHtml(html: string) {
    if (this.readOnly) throw new TypeError("checkReadOnly");
    this.inseridos.push(html);
  }
  insertText(texto: string) {
    if (this.readOnly) throw new TypeError("checkReadOnly");
    this.textos.push(texto);
  }
  insertElement(el: unknown) {
    this.inseridos.push(`el:${JSON.stringify(el)}`);
  }
  getData() {
    return this.corpo.innerHTML;
  }
  setData(html: string) {
    this.corpo.innerHTML = html;
  }
  execCommand(comando: string, valor?: unknown) {
    this.comandos.push([comando, valor]);
  }
  applyStyle(estilo: unknown) {
    this.estilos.push(estilo);
  }
  getSelection() {
    const s = this.selecao;
    return {
      getStartElement: () => (s.elemento ? { $: s.elemento } : null),
      getSelectedText: () => s.texto,
      createBookmarks: () => ["marca"],
      selectBookmarks: (m: unknown) => {
        this.comandos.push(["selectBookmarks", m]);
      },
    };
  }
  getSelectedHtml() {
    return this.selecao.html ? { getHtml: () => this.selecao.html } : null;
  }
  // --- menu de contexto nativo ---
  contextMenu = {
    addListener: (fn: (el: { $?: Element } | null) => Record<string, number> | null) => {
      this.ouvintesMenu.push(fn);
    },
  };
  addMenuGroup(nome: string) {
    this.grupos.push(nome);
  }
  addCommand(nome: string, def: { exec(): boolean }) {
    this.comandosMenu.set(nome, def);
  }
  getCommand(nome: string) {
    return this.comandosMenu.get(nome);
  }
  addMenuItem(nome: string, def: { label: string; command: string; group: string }) {
    this.itensMenu.set(nome, def);
  }
  getMenuItem(nome: string) {
    return this.itensMenu.get(nome);
  }
  /** Simula o clique direito com o alvo dado: devolve os nomes dos itens que o menu nativo mostraria. */
  abrirMenu(alvo: Element | null): string[] {
    const nomes: string[] = [];
    for (const ouvinte of this.ouvintesMenu) nomes.push(...Object.keys(ouvinte(alvo ? { $: alvo } : null) ?? {}));
    return nomes;
  }
}

export interface FalsoCk4 {
  versao: 4;
  doc: Document;
  win: JanelaFalsa;
  instancia(nome: string): InstanciaCk4;
  /** Marca a selecao da instancia: elemento onde esta o cursor, texto e HTML selecionados. */
  selecionar(nome: string, s: { elemento?: Element | null; texto?: string; html?: string; ancora?: Node | null; foco?: Node | null }): void;
  /** Define a instancia com foco (`CKEDITOR.currentInstance`). */
  focar(nome: string | null): void;
}

/** Pagina com `CKEDITOR.instances` (uma instancia por secao, cada uma com o corpo num documento proprio, como o iframe). */
export function criarCk4(opcoes: { secoes: SecaoCk4[] }): FalsoCk4 {
  const { doc, win } = paginaFalsa();
  const instances: Record<string, InstanciaCk4> = {};
  const ckeGlobal = {
    instances,
    currentInstance: undefined as InstanciaCk4 | undefined,
    TRISTATE_OFF: 2,
    style: class {
      constructor(readonly def: unknown) {}
    },
    dom: { element: { createFromHtml: (html: string) => ({ html }) } },
  };
  for (const s of opcoes.secoes) {
    const cke = doc.createElement("div");
    cke.id = `cke_${s.nome}`;
    cke.className = "cke";
    const barra = doc.createElement("span");
    barra.className = "cke_toolbox";
    cke.append(barra);
    doc.body.append(cke);
    instances[s.nome] = new InstanciaCk4(s.nome, s.titulo, s.html, !!s.somenteLeitura, cke);
  }
  win.CKEDITOR = ckeGlobal;
  return {
    versao: 4,
    doc,
    win,
    instancia: (nome) => instances[nome] as InstanciaCk4,
    selecionar(nome, s) {
      const i = instances[nome] as InstanciaCk4;
      i.selecao = { elemento: s.elemento ?? null, texto: s.texto ?? "", html: s.html ?? "" };
      // a selecao nativa do documento do iframe da secao (o que `doc.getSelection()` devolve)
      const ancora = s.ancora ?? s.elemento ?? null;
      (i.corpo.ownerDocument as unknown as { getSelection(): unknown }).getSelection = () => ({
        rangeCount: ancora ? 1 : 0,
        anchorNode: ancora,
        focusNode: s.foco ?? ancora,
      });
    },
    focar(nome) {
      ckeGlobal.currentInstance = nome ? instances[nome] : undefined;
    },
  };
}
