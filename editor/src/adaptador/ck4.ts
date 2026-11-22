import { htmlParaNos } from "./html";
import { anexarMenuCk4, anexarMenuDom, type Ck4ComMenu } from "./menu";
import type { Adaptador, DefinicaoEstilo, Editor, ItemMenu } from "./tipos";

/** Superficie do CKEditor 4 que o adaptador usa. */
interface Ck4Instancia extends Partial<Ck4ComMenu> {
  name: string;
  readOnly: boolean;
  status?: string;
  container?: { $: HTMLElement };
  document?: { getBody(): { $: HTMLElement } | null };
  focus(): void;
  fire(evento: string, dados?: unknown): void;
  insertHtml(html: string): void;
  insertText(texto: string): void;
  insertElement?(el: unknown): void;
  getSelection(): Ck4Selecao | null;
  getSelectedHtml?(): { getHtml?(): string } | null;
  getData(): string;
  setData(html: string): void;
  execCommand(comando: string, valor?: unknown): void;
  applyStyle(estilo: unknown): void;
  on(evento: string, fn: (...a: unknown[]) => void): void;
  removeListener(evento: string, fn: (...a: unknown[]) => void): void;
}

interface Ck4Selecao {
  getStartElement(): { $: Element } | null;
  getSelectedText(): string;
  createBookmarks(serializavel: boolean): unknown;
  selectBookmarks(marcas: unknown): void;
}

interface Ck4Global {
  instances: Record<string, Ck4Instancia>;
  currentInstance?: Ck4Instancia;
  TRISTATE_OFF: number;
  style?: new (def: DefinicaoEstilo) => unknown;
  dom?: { element: { createFromHtml(html: string, doc: unknown): unknown } };
}

type Janela = Window & typeof globalThis & { CKEDITOR?: Ck4Global; oEditor?: Ck4Instancia };

const ck = (e: Editor): Ck4Instancia => e as Ck4Instancia;

/** Backend do CKEditor 4 (SEI 3.1/4.x): uma instancia por secao, cada uma num iframe. */
export function criarBackendCk4(win: Janela, recusa: { fn?: () => void } = {}): Adaptador {
  const global = (): Ck4Global | undefined => win.CKEDITOR;
  const registrada = (ed?: Ck4Instancia): ed is Ck4Instancia => !!ed?.name && global()?.instances[ed.name] === ed;
  const editavel = (ed?: Ck4Instancia): ed is Ck4Instancia => registrada(ed) && !ed.readOnly;
  const corpoDe = (e: Editor): HTMLElement | null => ck(e).document?.getBody()?.$ ?? null;
  /** Operacao que escreve: na secao somente leitura o CK4 lanca TypeError (checkReadOnly), entao nao faz nada. */
  const escreve = (e: Editor | null | undefined, fn: (ed: Ck4Instancia) => void): void => {
    if (!e) return;
    const ed = ck(e);
    if (ed.readOnly) {
      recusa.fn?.();
      return;
    }
    fn(ed);
  };

  const a: Adaptador = {
    versao: 4,

    /**
     * Qual instancia recebe a acao. Ordem: (1) a que tem o FOCO (mesmo somente leitura) — com a barra compartilhada do SEI
     * 4.1 (`#divComandos`, uma so para todas as secoes) o botao mora dentro do wrapper da PRIMEIRA instancia (o
     * Cabecalho, somente leitura), entao o wrapper do botao nao diz onde esta o cursor; (2) a do wrapper `div.cke`
     * do elemento `ref`, se editavel (barras proprias por instancia); (3) a fixada em `oEditor` pelo monolito;
     * (4) a primeira EDITAVEL; (5) a primeira.
     */
    getInstance(ref) {
      const g = global();
      if (!g?.instances) return null;
      // com FOCO numa secao somente leitura devolve ELA: as escritas viram no-op. Nunca trocar de secao em silencio.
      if (registrada(g.currentInstance)) return g.currentInstance;
      const wrapper = ref?.closest?.("div.cke");
      const doWrapper = wrapper ? g.instances[wrapper.id.replace("cke_", "")] : undefined;
      if (editavel(doWrapper)) return doWrapper;
      if (editavel(win.oEditor)) return win.oEditor;
      const todas = Object.values(g.instances);
      return todas.find((i) => editavel(i)) ?? todas[0] ?? null;
    },
    getAllInstances: () => Object.values(global()?.instances ?? {}),
    focus: (e) => ck(e).focus(),
    saveSnapshot: (e) => ck(e).fire("saveSnapshot"),
    withEdit(e, fn) {
      const ed = ck(e);
      ed.focus();
      ed.fire("saveSnapshot");
      try {
        fn();
      } finally {
        ed.fire("saveSnapshot");
      }
    },
    insertHtml: (e, html) => escreve(e, (ed) => ed.insertHtml(html)),
    insertText: (e, texto) => escreve(e, (ed) => ed.insertText(texto)),
    getSelectionElement: (e) => ck(e).getSelection()?.getStartElement()?.$ ?? null,
    getSelectionParagraph(e) {
      return a.getSelectionElement(e)?.closest("p") ?? null;
    },
    /** A insercao e por DOM, dentro do iframe da secao (o documento do elemento de referencia). */
    insertHtmlBefore(e, ref, html) {
      escreve(e, () => ref.before(...htmlParaNos(ref.ownerDocument, html)));
    },
    getToolbarContainer: (e) => ck(e).container?.$.querySelector<HTMLElement>("span.cke_toolbox") ?? null,
    getBodyContainer: (e) => corpoDe(e),
    findInBody(e, seletor) {
      const c = corpoDe(e);
      return c ? Array.from(c.querySelectorAll<HTMLElement>(seletor)) : [];
    },
    appendToBody(e, html) {
      escreve(e, (ed) => {
        const c = corpoDe(ed);
        if (c) c.append(...htmlParaNos(c.ownerDocument, html));
      });
    },
    transformBodyHtml(e, fn) {
      escreve(e, (ed) => {
        const c = corpoDe(ed);
        if (!c) return;
        const atual = c.innerHTML;
        const novo = fn(atual);
        if (typeof novo === "string" && novo !== atual) c.replaceChildren(...htmlParaNos(c.ownerDocument, novo));
      });
    },
    execCommand: (e, comando, valor) => ck(e).execCommand(comando, valor),
    applyStyle(e, def) {
      const Estilo = global()?.style;
      if (Estilo) ck(e).applyStyle(new Estilo(def));
    },
    getData: (e) => ck(e).getData(),
    setData: (e, html) => escreve(e, (ed) => ed.setData(html)),
    insertElement(e, html) {
      escreve(e, (ed) => {
        const criar = global()?.dom?.element.createFromHtml;
        if (criar && ed.insertElement) ed.insertElement(criar(html, ed.document));
        else ed.insertHtml(html);
      });
    },
    saveSelection: (e) => ck(e).getSelection()?.createBookmarks(true) ?? null,
    restoreSelection(e, marcas) {
      const sel = ck(e).getSelection();
      if (sel && marcas) sel.selectBookmarks(marcas);
    },
    getSelectedText: (e) => ck(e).getSelection()?.getSelectedText() ?? "",
    /** `getSelectedHtml` e metodo do EDITOR (a selecao nao o tem); o CK 4.17 do SEI o tem. */
    getSelectedHtml(e) {
      const frag = ck(e).getSelectedHtml?.();
      return frag?.getHtml?.() ?? "";
    },
    on: (e, evento, fn) => ck(e).on(evento, fn),
    off: (e, evento, fn) => ck(e).removeListener(evento, fn),
    fire: (e, evento, dados) => ck(e).fire(evento, dados),
    addContextMenu(e, construtor: (alvo: Element | null) => ItemMenu[]) {
      const ed = ck(e);
      const g = global();
      if (g && ed.contextMenu && typeof ed.addMenuItem === "function") {
        anexarMenuCk4(ed as Ck4ComMenu, g.TRISTATE_OFF, construtor);
        return;
      }
      anexarMenuDom(corpoDe(e), construtor);
    },
    waitReady(ms) {
      return new Promise<Editor>((resolve, reject) => {
        const inicio = Date.now();
        const sondar = () => {
          const pronta = Object.values(global()?.instances ?? {}).find((i) => i.status === "ready");
          if (pronta) return resolve(pronta);
          if (Date.now() - inicio > ms) return reject(new Error("Timeout aguardando CKEditor 4"));
          setTimeout(sondar, 100);
        };
        sondar();
      });
    },
    somenteLeitura: (e) => !!ck(e).readOnly,
    aoRecusarEscrita(fn) {
      recusa.fn = fn;
    },
  };
  return a;
}
