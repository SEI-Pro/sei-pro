import type { ItemMenu } from "./tipos";

type Construtor = (alvo: Element | null) => ItemMenu[];
type CorpoComMenu = HTMLElement & { __seiProCtxBuilders?: Construtor[] };

/**
 * Menu de contexto por DOM (CK5 e CK4 sem menu nativo). Cada recurso registra o seu construtor e UM
 * listener junta os itens de todos. O registro (`corpo.__seiProCtxBuilders`) e o MESMO objeto do
 * adapter legado (`attachDomContextMenu`): os dois lados somam construtores sem se descartar.
 */
export function anexarMenuDom(corpo: HTMLElement | null, construtor: Construtor): void {
  if (!corpo || typeof construtor !== "function") return;
  const c = corpo as CorpoComMenu;
  let construtores = c.__seiProCtxBuilders;
  if (!construtores) {
    const lista: Construtor[] = [];
    construtores = c.__seiProCtxBuilders = lista;
    corpo.addEventListener("contextmenu", (ev) => {
      const e = ev as MouseEvent;
      if (e.shiftKey) return; // Shift + botao direito: sempre o menu do navegador
      let itens: ItemMenu[] = [];
      for (const b of lista) {
        try {
          itens = itens.concat(b(e.target as Element | null) || []);
        } catch {
          // um construtor com defeito nao derruba os demais
        }
      }
      if (!itens.length) return;
      e.preventDefault();
      desenharMenu(corpo.ownerDocument, itens, e.clientX, e.clientY);
    });
  }
  if (!construtores.includes(construtor)) construtores.push(construtor);
}

function desenharMenu(doc: Document, itens: ItemMenu[], x: number, y: number): void {
  doc.getElementById("seiProCtxMenu")?.remove();
  const menu = doc.createElement("div");
  menu.id = "seiProCtxMenu";
  menu.style.cssText =
    "position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  for (const it of itens) {
    const linha = doc.createElement("div");
    linha.textContent = it.label;
    linha.style.cssText = "padding:6px 14px;cursor:pointer;white-space:nowrap;";
    linha.addEventListener("mouseenter", () => {
      linha.style.background = "#eef";
    });
    linha.addEventListener("mouseleave", () => {
      linha.style.background = "";
    });
    linha.addEventListener("click", () => {
      menu.remove();
      it.action();
    });
    menu.append(linha);
  }
  doc.body.append(menu);
  const fechar = () => {
    menu.remove();
    doc.removeEventListener("mousedown", fechar);
  };
  setTimeout(() => doc.addEventListener("mousedown", fechar), 0);
}

/** Interface minima do CK4 usada pelo menu nativo. */
export interface Ck4ComMenu {
  contextMenu: { addListener(fn: (el: { $?: Element } | null) => Record<string, number> | null): void };
  addMenuGroup(nome: string, ordem: number): void;
  addCommand(nome: string, def: { exec(): boolean }): void;
  getCommand(nome: string): unknown;
  addMenuItem(nome: string, def: { label: string; command: string; group: string }): void;
  getMenuItem(nome: string): unknown;
}

type EstadoCk4 = { acoes: Record<string, () => void>; construtores: Construtor[] };

/** CK4: os itens entram no menu de contexto NATIVO, junto dos itens do proprio CKEditor. */
export function anexarMenuCk4(editor: Ck4ComMenu & { __seiProCtx?: EstadoCk4 }, tristateOff: number, construtor: Construtor): void {
  if (typeof construtor !== "function") return;
  let st = editor.__seiProCtx;
  if (!st) {
    const estado: EstadoCk4 = { acoes: {}, construtores: [] };
    st = editor.__seiProCtx = estado;
    try {
      editor.addMenuGroup("seiProGroup", 5);
    } catch {
      // o grupo ja existia
    }
    editor.contextMenu.addListener((elemento) => {
      const alvo = elemento?.$ ?? null;
      let resultado: Record<string, number> | null = null;
      for (const b of estado.construtores) {
        let itens: ItemMenu[] = [];
        try {
          itens = b(alvo) || [];
        } catch {
          itens = [];
        }
        for (const it of itens) {
          const nome = `seiPro_${String(it.label).replace(/[^A-Za-z0-9]/g, "_")}`;
          estado.acoes[nome] = it.action;
          if (!editor.getCommand(nome)) {
            editor.addCommand(nome, {
              exec: () => {
                estado.acoes[nome]?.();
                return true;
              },
            });
          }
          if (!editor.getMenuItem(nome)) editor.addMenuItem(nome, { label: it.label, command: nome, group: "seiProGroup" });
          resultado = resultado ?? {};
          resultado[nome] = tristateOff;
        }
      }
      return resultado;
    });
  }
  if (!st.construtores.includes(construtor)) st.construtores.push(construtor);
}
