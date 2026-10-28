/**
 * Utilitários das provas da interface (linkedom): menus, seletores, teclas e
 * o `<dialog>` que o linkedom não tem. Mesma forma dos utilitários do
 * Favoritos e do Histórico, sem importar o núcleo do SEI.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { criarAbrirModal } from "@comum/ui/dialogo";
import { montarApp } from "../src/app/app";
import type { DepsApp } from "../src/app/tipos";
import { escoposDaUnidade } from "../src/modelo/escopo";
import { avaliar, concluir, iniciar, pausar } from "../src/modelo/operacoes";
import type { Vis } from "../src/modelo/tipos";
import { PADRAO } from "../src/preferencias";
import { RepositorioDemandas } from "../src/repositorio";
import { T0 } from "./apoioRepositorio";
import { HOJE } from "./fabrica";
import { instalarDom } from "./util";

type Proto = Record<string, unknown>;

/** Documento novo como `document` global, com `<dialog>` funcionando (showModal/close/open). */
export function telaDoApp(html = '<html><body><div id="app"></div></body></html>'): Document {
  const doc = instalarDom(html);
  const proto = Object.getPrototypeOf(doc.createElement("dialog")) as Proto;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  proto.showModal = function (this: HTMLElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Ev("close"));
  };
  Object.defineProperty(proto, "open", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("open");
    },
  });
  return doc;
}

/**
 * O linkedom não acompanha o foco: aqui `focus()` passa a marcar o `activeElement` do documento,
 * que volta a ser o `body` quando o elemento focado sai da página (como no navegador).
 */
export function rastrearFoco(doc: Document): void {
  let proto = Object.getPrototypeOf(doc.createElement("button")) as Proto | null;
  while (proto && !Object.hasOwn(proto, "focus")) proto = Object.getPrototypeOf(proto) as Proto | null;
  if (!proto) throw new Error("sem focus() no linkedom");
  let ativo: HTMLElement | null = null;
  proto.focus = function (this: HTMLElement) {
    ativo = this;
  };
  Object.defineProperty(doc, "activeElement", { configurable: true, get: () => (ativo?.isConnected ? ativo : doc.body) });
}

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
export function tecla(el: Element, key: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  el.dispatchEvent(ev);
}

/** Texto visível de um elemento, sem espaços repetidos. */
export const texto = (el: Element | null | undefined): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** Itens do menu aberto pelo botão de rótulo `menu` (abre e fecha). */
export function itensDoMenu(raiz: ParentNode, menu: string): string[] {
  const b = raiz.querySelector<HTMLButtonElement>(`button[aria-haspopup="menu"][aria-label="${menu}"]`);
  if (!b) return [];
  b.click();
  // Itens comuns e marcáveis (menuitemcheckbox).
  const itens = [...b.ownerDocument.querySelectorAll(".spro-menu-pop [role^='menuitem']")].map((i) =>
    texto(i.querySelector(".spro-menu-rotulo")),
  );
  b.click();
  return itens;
}

/** Abre o menu pelo rótulo do botão e clica o item pelo texto. */
export function itemDoMenu(raiz: ParentNode, menu: string, item: string): boolean {
  const b = raiz.querySelector<HTMLButtonElement>(`button[aria-haspopup="menu"][aria-label="${menu}"]`);
  if (!b) return false;
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const alvo = [...b.ownerDocument.querySelectorAll<HTMLButtonElement>(".spro-menu-pop [role^='menuitem']")].find(
    (i) => texto(i.querySelector(".spro-menu-rotulo")) === item,
  );
  if (!alvo) {
    b.click();
    return false;
  }
  alvo.click();
  return true;
}

/** O seletor inteligente (combobox) pelo rótulo. */
export function combo(raiz: ParentNode, rotulo: string): HTMLButtonElement | null {
  return raiz.querySelector<HTMLButtonElement>(`button[role="combobox"][aria-label="${rotulo}"]`);
}

/** Opções que o seletor oferece agora (abre e fecha). */
export function opcoesDoCombo(raiz: ParentNode, rotulo: string): string[] {
  const b = combo(raiz, rotulo);
  if (!b) return [];
  b.click();
  const valores = [...b.ownerDocument.querySelectorAll(".spro-combo-pop [role='option']")].map((o) => o.getAttribute("data-valor") ?? "");
  b.click();
  return valores;
}

/** Escolhe uma opção do seletor: abre, clica e, na escolha múltipla, fecha de novo. */
export function escolherCombo(raiz: ParentNode, rotulo: string, valor: string): void {
  const b = combo(raiz, rotulo);
  if (!b) throw new Error(`seletor "${rotulo}" não encontrado`);
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const op = b.ownerDocument.querySelector<HTMLElement>(`.spro-combo-pop [role="option"][data-valor="${escaparValor(valor)}"]`);
  if (!op) throw new Error(`opção "${valor}" não encontrada em "${rotulo}"`);
  op.click();
  if (b.getAttribute("aria-expanded") === "true") b.click();
}

/** Digita no campo de busca do seletor aberto e clica "Criar “…”". */
export async function criarNoCombo(raiz: ParentNode, rotulo: string, valor: string): Promise<void> {
  const b = combo(raiz, rotulo);
  if (!b) throw new Error(`seletor "${rotulo}" não encontrado`);
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const doc = b.ownerDocument;
  const busca = doc.querySelector<HTMLInputElement>(".spro-combo-pop .spro-combo-busca");
  if (!busca) throw new Error(`seletor "${rotulo}" sem busca`);
  busca.value = valor;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  busca.dispatchEvent(new Ev("input", { bubbles: true }));
  const criar = doc.querySelector<HTMLButtonElement>(".spro-combo-pop .spro-combo-criar");
  if (!criar) throw new Error(`seletor "${rotulo}" sem "Criar"`);
  criar.click();
  await new Promise((r) => setTimeout(r, 5));
  if (b.getAttribute("aria-expanded") === "true") b.click();
}

/** Valor como aparece no seletor de atributo (aspas e barras escapadas). */
function escaparValor(v: string): string {
  return v.replace(/["\\]/g, "\\$&");
}

/** Muda o valor de um campo e avisa como o navegador ("input" e "change"). */
export function digitar(el: Element | null | undefined, valor: string): void {
  if (!el) throw new Error("campo não encontrado");
  (el as HTMLInputElement).value = valor;
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev("input", { bubbles: true }));
  el.dispatchEvent(new Ev("change", { bubbles: true }));
}

/** Marca uma caixa ou rádio como o navegador faz (o linkedom não reflete o atributo). */
export function marcar(el: Element | null | undefined, ligado = true): void {
  if (!el) throw new Error("campo não encontrado");
  (el as HTMLInputElement).checked = ligado;
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev("change", { bubbles: true }));
}

/** O app inteiro em memória: dois repositórios (unidade e eu), contexto da Ana e dependências simples. */
export function appDeTeste(sobrepor: Partial<DepsApp> = {}) {
  const doc = telaDoApp();
  const raiz = doc.getElementById("app") as HTMLElement;
  const area = areaMemoria();
  const esc = escoposDaUnidade("sei.exemplo.gov.br", "ana", "110000001");
  const relogio = { agora: T0 };
  let n = 0;
  const carimbo = () => {
    relogio.agora += 1_000;
    return { agora: relogio.agora, dispositivo: "dev-a", por: "ana", nome: "Ana Lima" };
  };
  const gerarId = () => `d${++n}`;
  const repos = {
    unidade: new RepositorioDemandas(area, esc.unidade, carimbo, gerarId),
    eu: new RepositorioDemandas(area, esc.eu, carimbo, gerarId),
  };
  let prefs = { ...PADRAO, visao: "tabela" as const };
  const abrirModal = criarAbrirModal();
  const deps: DepsApp = {
    raiz,
    repos,
    contexto: {
      host: "sei.exemplo.gov.br",
      login: "ana",
      nome: "Ana Lima",
      unidade: { id: "110000001", sigla: "SUPAC", nome: "Superintendência" },
      versao: "2.8",
      temaEscuro: false,
    },
    modo: "pagina",
    hoje: () => HOJE,
    usuarios: async () => [
      { login: "ana", nome: "Ana Lima" },
      { login: "carla", nome: "Carla Dias" },
    ],
    processosDaCaixa: async () => [{ protocolo: "50300.001234/2026-11", idProcedimento: "77", sigiloso: false }],
    etapasDoProjetos: async () => [],
    tabelas: async () => [],
    preferencias: {
      ler: async () => prefs,
      gravar: async (p) => {
        prefs = { ...prefs, ...p } as typeof prefs;
        return prefs;
      },
    },
    area,
    abrirModal,
    confirmar: async () => true,
    ...sobrepor,
  };
  return { doc, raiz, area, repos, deps, relogio, montar: () => montarApp(deps) };
}

/** O diálogo aberto de cima (o `<dialog>` do linkedom só tem o atributo `open`). */
export function dialogoAberto(doc: Document): HTMLElement | null {
  const abertos = [...doc.querySelectorAll<HTMLElement>("dialog.spro-dialogo[open]")];
  return abertos.at(-1) ?? null;
}

/** Fecha o diálogo de cima pelo X (o mesmo caminho do Esc). */
export function fecharDialogo(doc: Document): void {
  dialogoAberto(doc)?.querySelector<HTMLButtonElement>('button[aria-label="Fechar"]')?.click();
}

export type Teste = ReturnType<typeof appDeTeste>;

/** Cria uma demanda direto no repositório, já no estado pedido. */

export async function nova(
  t: Teste,
  vis: Vis,
  titulo: string,
  estado: "nao_iniciada" | "iniciada" | "pausada" | "concluida" | "avaliada" | "arquivada" = "nao_iniciada",
  extra: Record<string, unknown> = {},
): Promise<string> {
  const repo = t.repos[vis];
  const d = await repo.criar({ titulo, prazo: "2026-10-20", distribuidaEm: "2026-10-01", ...extra });
  if (estado !== "nao_iniciada") await repo.aplicar(d.id, iniciar);
  if (estado === "pausada") await repo.aplicar(d.id, pausar);
  if (estado === "concluida" || estado === "avaliada" || estado === "arquivada")
    await repo.aplicar(d.id, (x, c) => concluir(x, { data: "2026-10-10" }, c));
  if (estado === "avaliada") await repo.aplicar(d.id, (x, c) => avaliar(x, { nota: 4 }, c));
  if (estado === "arquivada") await repo.aplicar(d.id, (x, c) => ({ demanda: { ...x, arquivadoEm: c.agora }, registros: [] }));
  return d.id;
}
