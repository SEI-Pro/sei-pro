/**
 * Ler a árvore que um quadro já tem na tela e esperar por ela. Separado de `arvore.ts` (os painéis) porque a capa,
 * que mora em outro quadro, só precisa disto.
 */
import { type Arvore, lerArvore } from "@nucleo/dominio/arvore";
import { paginaDe } from "@nucleo/sessao/pagina";

export const PRAZO_ARVORE_MS = 10_000;

/** Lê a árvore que o quadro já tem, ou null enquanto a página ainda não a traz inteira. */
export function tentarLerArvore(doc: Document): Arvore | null {
  if (!doc.getElementById("frmArvore")) return null;
  try {
    return lerArvore(paginaDe(doc));
  } catch {
    return null;
  }
}

/** Espera a árvore por MutationObserver (e um relógio de reserva) até o prazo. Devolve null se ela nunca vier. */
export function aguardarArvore(doc: Document, prazoMs = PRAZO_ARVORE_MS): Promise<Arvore | null> {
  return new Promise((resolver) => {
    const logo = tentarLerArvore(doc);
    if (logo) return resolver(logo);
    const janela = doc.defaultView;
    const Observador =
      (janela as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ?? globalThis.MutationObserver;
    let acabou = false;
    const terminar = (a: Arvore | null) => {
      if (acabou) return;
      acabou = true;
      obs?.disconnect();
      clearTimeout(limite);
      clearInterval(reserva);
      resolver(a);
    };
    const checar = () => {
      const a = tentarLerArvore(doc);
      if (a) terminar(a);
    };
    const obs = typeof Observador === "function" && doc.documentElement ? new Observador(checar) : null;
    obs?.observe(doc.documentElement, { childList: true, subtree: true });
    const reserva = setInterval(checar, 250);
    const limite = setTimeout(() => terminar(null), prazoMs);
  });
}
