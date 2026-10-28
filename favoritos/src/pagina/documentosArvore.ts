/**
 * Documentos favoritos (sugestão #1206): uma estrela ao lado de cada documento
 * na árvore. O documento fica guardado no favorito do processo; se o processo
 * ainda não é favorito, ele entra na lista da unidade (ou fica na Pessoal, se
 * já estiver lá).
 *
 * A árvore é desenhada pelo JavaScript do SEI (`#anchor<id>` por nó) e se
 * redesenha ao abrir pastas: um observador recoloca as estrelas que faltarem.
 * A classe é própria (`spro-fav-doc`): a da estrela do processo seria pega pela
 * delegação dela e alternaria o processo inteiro.
 */

import { h, icone } from "@comum/ui/dom";
import type { DadosProcesso, DocumentoFavorito } from "../modelo/tipos";
import type { RepositorioFavoritos } from "../repositorio";

export interface DocumentoNaArvore {
  id: string;
  numero: string;
  titulo: string;
}

/** Liga ou desliga o documento. Devolve o novo estado (true = favorito). */
export async function alternarDocumento(
  repos: { unidade: RepositorioFavoritos | null; pessoal: RepositorioFavoritos },
  processo: DadosProcesso,
  d: DocumentoNaArvore,
): Promise<boolean> {
  let repo = (await repos.unidade?.contem(processo.id)) ? repos.unidade : (await repos.pessoal.contem(processo.id)) ? repos.pessoal : null;
  if (!repo) {
    repo = repos.unidade ?? repos.pessoal;
    await repo.adicionar(processo);
  }
  const f = await repo.obter(processo.id);
  const atuais = f?.documentos ?? [];
  if (atuais.some((x) => x.id === d.id)) {
    await repo.editar(processo.id, { documentos: atuais.filter((x) => x.id !== d.id) });
    return false;
  }
  const novo: DocumentoFavorito = { id: d.id, numero: d.numero, titulo: d.titulo, criadoEm: Date.now() };
  await repo.editar(processo.id, { documentos: [...atuais, novo] });
  return true;
}

function pintar(b: HTMLElement, ligado: boolean): void {
  const rotulo = ligado ? "Tirar dos documentos monitorados" : "Guardar este documento nos monitorados";
  b.setAttribute("aria-pressed", String(ligado));
  b.setAttribute("aria-label", rotulo);
  b.title = rotulo;
  b.replaceChildren(icone(ligado ? "alvoAtivo" : "alvo", 16));
}

/** Põe as estrelas e as mantém (a árvore se redesenha); `repintar` acompanha mudanças feitas em outro lugar. */
export function instalarEstrelasDocumentos(
  doc: Document,
  docs: DocumentoNaArvore[],
  o: { marcado(id: string): boolean; alternar(d: DocumentoNaArvore): Promise<void> },
): { parar(): void; repintar(): void } {
  const porId = new Map(docs.map((d) => [d.id, d]));
  const colocar = () => {
    // Uma por documento, onde quer que esteja: o SEI Pro antigo cola os ícones dele (copiar, link,
    // clonar) logo depois do nome e empurra a estrela; procurá-la só ao lado do nome a duplicava.
    const jaTem = new Set([...doc.querySelectorAll<HTMLElement>(".spro-fav-doc")].map((b) => b.dataset.doc));
    for (const d of docs) {
      const ancora = doc.getElementById(`anchor${d.id}`);
      if (!ancora || jaTem.has(d.id)) continue;
      // Depois dos ícones do legado, para ficar sempre no mesmo lugar da linha.
      let antes: Element = ancora;
      while (antes.nextElementSibling?.classList.contains("action-doc")) antes = antes.nextElementSibling;
      const b = h("button", { type: "button", class: "spro-fav-doc", "data-doc": d.id });
      pintar(b, o.marcado(d.id));
      antes.after(b);
    }
  };
  const repintar = () => {
    for (const b of doc.querySelectorAll<HTMLElement>(".spro-fav-doc")) pintar(b, o.marcado(b.dataset.doc ?? ""));
  };
  doc.addEventListener("click", (ev) => {
    const b = (ev.target as Element | null)?.closest?.(".spro-fav-doc") as HTMLElement | null;
    if (!b) return;
    ev.preventDefault();
    ev.stopPropagation();
    const d = porId.get(b.dataset.doc ?? "");
    if (!d || b.getAttribute("aria-busy") === "true") return;
    b.setAttribute("aria-busy", "true");
    void o
      .alternar(d)
      .catch((e) => console.warn("[SEI Pro] favoritos: documento", e))
      .finally(() => {
        b.removeAttribute("aria-busy");
        repintar();
      });
  });
  colocar();
  const alvo = doc.querySelector("#divArvore") ?? doc.body;
  let espera: ReturnType<typeof setTimeout> | undefined;
  const obs =
    typeof MutationObserver === "function"
      ? new MutationObserver(() => {
          clearTimeout(espera);
          espera = setTimeout(colocar, 150);
        })
      : null;
  obs?.observe(alvo, { childList: true, subtree: true });
  return {
    parar: () => {
      obs?.disconnect();
      clearTimeout(espera);
    },
    repintar,
  };
}

export { pintar as pintarEstrelaDocumento };
