/**
 * Os ícones fixos ao lado do documento na árvore (os "ícones rápidos" do SEI Pro): copiar número, copiar link,
 * duplicar... Mesma configuração do legado (`configViewFlashDocArvorePro`), mesmas classes (`action-doc action-<modo>`,
 * `data-id`), porque os Favoritos e as Ações em Lote procuram os ícones por elas. Idempotente: pode rodar a cada
 * mudança da árvore (pastas abertas, duas linhas, numeração).
 */
import { h, icone } from "@comum/ui/dom";
import type { AlvoDocumento, ItemMenu, OpcoesMenu } from "./acoes";
import { iconesFixosDoDocumento } from "./acoes";
import { idDoNo } from "./documentos";

export const CLASSE_ICONE = "spro-pm-icone";
const ATR_ASSINATURA = "data-spro-pm-sig";

const PASSAM_DE_LADO = ["breackline_doc"];

function textoDoNo(a: Element): string {
  return (a.textContent ?? "").replace(/\s+/g, " ").trim();
}

function criarIcone(it: ItemMenu & { modo: string }, id: string): HTMLElement {
  const el = h(
    "span",
    {
      class: `action-doc action-${it.modo} ${CLASSE_ICONE}`,
      "data-id": id,
      "data-action": it.modo,
      "data-rotulo": it.rotulo,
      role: "button",
      // Fora da ordem de Tab (seriam 3 paradas por documento): pelo teclado, as mesmas ações estão no menu do ícone do documento.
      tabindex: "-1",
      "aria-label": it.rotulo,
    },
    icone(it.icone, 13),
  );
  return el;
}

/** Coloca (ou refaz) os ícones de um documento logo depois do nome dele. */
function colocarNoDocumento(nome: HTMLElement, id: string, itens: Array<ItemMenu & { modo: string }>): boolean {
  const sig = itens.map((i) => i.modo).join(",");
  let existente: HTMLElement[] = [];
  for (let n = nome.nextElementSibling; n; n = n.nextElementSibling) {
    if (n.classList.contains(CLASSE_ICONE)) existente.push(n as HTMLElement);
    else if (PASSAM_DE_LADO.some((c) => n.classList.contains(c)) || n.classList.contains("action-doc")) continue;
    else break;
  }
  existente = existente.filter((e) => e.getAttribute("data-id") === id);
  if (existente.length && existente[0]?.getAttribute(ATR_ASSINATURA) === sig && existente.length === itens.length) return false;
  for (const e of existente) e.remove();
  if (!itens.length) return true;
  // Depois do nome e das quebras de linha do "duas linhas", antes de tudo o mais (estrela dos favoritos, unidade geradora).
  let ponto: Element = nome;
  while (ponto.nextElementSibling && PASSAM_DE_LADO.some((c) => ponto.nextElementSibling?.classList.contains(c)))
    ponto = ponto.nextElementSibling;
  for (const it of itens) {
    const el = criarIcone(it, id);
    el.setAttribute(ATR_ASSINATURA, sig);
    ponto.after(el);
    ponto = el;
  }
  return true;
}

export type FabricaDeAlvo = (id: string, rotulo: string) => AlvoDocumento;

/**
 * Coloca os ícones em todos os documentos da árvore que têm ícone próprio (`anchorImg<id>`), menos o processo.
 * `opcoes()` e `selecao()` são lidos a cada passada: a personalização vale sem recarregar.
 */
export function colocarIcones(
  doc: Document,
  idProcedimento: string,
  alvoDe: FabricaDeAlvo,
  opcoes: () => OpcoesMenu,
  selecao: () => readonly string[] | null,
): number {
  let mudou = 0;
  const opc = opcoes();
  const sel = selecao();
  for (const nome of doc.querySelectorAll<HTMLElement>('a[id^="anchor"]:not([id^="anchorImg"])')) {
    const id = idDoNo(nome.id, "anchor");
    if (!id || id === idProcedimento) continue;
    if (!doc.getElementById(`anchorImg${id}`)) continue;
    const alvo = alvoDe(id, textoDoNo(nome));
    const itens = iconesFixosDoDocumento(alvo, opc, sel);
    if (colocarNoDocumento(nome, id, itens)) mudou += 1;
  }
  return mudou;
}

/** Tira todos os ícones (a personalização desligou o bloco). */
export function tirarIcones(doc: Document): void {
  for (const e of doc.querySelectorAll(`.${CLASSE_ICONE}`)) e.remove();
}

/**
 * Acompanha a árvore e mantém os ícones. `aoEscolher` roda o item; o ícone vira "feito" por um instante.
 * Devolve o desligador.
 */
export function manterIcones(
  doc: Document,
  executar: (id: string, modo: string) => void | Promise<void>,
  recolocar: () => void,
): () => void {
  const janela = doc.defaultView;
  const Observador =
    (janela as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ?? globalThis.MutationObserver;
  let espera: ReturnType<typeof setTimeout> | undefined;
  const agendar = () => {
    clearTimeout(espera);
    espera = setTimeout(recolocar, 150);
  };
  const alvo = doc.querySelector("#divArvore") ?? doc.body;
  const obs = typeof Observador === "function" && alvo ? new Observador(agendar) : null;
  obs?.observe(alvo, { childList: true, subtree: true });

  const disparar = (el: HTMLElement) => {
    if (el.getAttribute("aria-busy") === "true") return;
    const id = el.getAttribute("data-id") ?? "";
    const modo = el.getAttribute("data-action") ?? "";
    el.setAttribute("aria-busy", "true");
    const fim = () => {
      el.removeAttribute("aria-busy");
      el.classList.add("feito");
      setTimeout(() => el.classList.remove("feito"), 900);
    };
    void Promise.resolve(executar(id, modo))
      .catch((e) => console.warn("[SEI Pro] ícone rápido:", e))
      .finally(fim);
  };
  const aoClicar = (ev: Event) => {
    const el = (ev.target as Element | null)?.closest?.(`.${CLASSE_ICONE}`) as HTMLElement | null;
    if (!el) return;
    ev.preventDefault();
    ev.stopPropagation();
    disparar(el);
  };
  const aoTeclar = (ev: KeyboardEvent) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    const el = (ev.target as Element | null)?.closest?.(`.${CLASSE_ICONE}`) as HTMLElement | null;
    if (!el) return;
    ev.preventDefault();
    disparar(el);
  };
  doc.addEventListener("click", aoClicar, true);
  doc.addEventListener("keydown", aoTeclar, true);
  return () => {
    obs?.disconnect();
    clearTimeout(espera);
    doc.removeEventListener("click", aoClicar, true);
    doc.removeEventListener("keydown", aoTeclar, true);
  };
}
