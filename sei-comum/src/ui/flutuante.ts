/**
 * Camada flutuante (lista do combobox, menu): onde anexar, onde posicionar e
 * quando fechar. Fica em `position: fixed` e, por isso, não é cortada por
 * nenhum `overflow` de quem a abriu.
 *
 * Onde anexar:
 * - dentro de um `<dialog>` modal aberto, no próprio diálogo: o resto da página
 *   fica inerte e abaixo da camada de cima (top layer);
 * - numa Shadow Root (o balão da página do SEI), nela, para herdar o estilo;
 * - senão, no `body`.
 *
 * Avisa pelo evento `spro-popover` da janela até onde a camada desce: o iframe
 * abaixo da lista de processos cresce com o conteúdo e precisa saber.
 */

export interface OpcoesFlutuante {
  /** Alinha a borda direita da camada com a da âncora (menus de ação no canto). */
  alinharDireita?: boolean;
  /** Largura mínima; o padrão é a largura da âncora. */
  larguraMinima?: number;
  /** Largura fixa (ignora a da âncora). */
  largura?: number;
  /** Altura máxima. */
  alturaMaxima?: number;
  /** Espaço entre a âncora e a camada, em px (padrão 4). Negativo = a camada entra um pouco na âncora, sem vão para o mouse atravessar. */
  distancia?: number;
  /** Clique fora ou rolagem da página fecharam. */
  aoFechar: () => void;
}

export interface Flutuante {
  posicionar(): void;
  fechar(): void;
}

/** As camadas abertas, com a âncora e o fecho de cada uma. */
const abertas = new Set<{ ancora: Element; fechar: () => void }>();

/**
 * Fecha as camadas cuja âncora saiu da página (quem a abriu foi redesenhado):
 * a camada ficaria solta, sem dono, e pularia para o canto no próximo scroll.
 * O app chama a cada redesenho.
 */
export function fecharOrfaos(): void {
  for (const a of [...abertas]) if (!a.ancora.isConnected) a.fechar();
}

let janelaCresce: (() => boolean) | null = null;

/**
 * A janela cresce com o conteúdo (o iframe abaixo da lista de processos): a
 * camada abre sempre para baixo e anuncia a altura inteira, para o iframe
 * crescer até ela caber. Sem isto (painel lateral), abre para cima quando falta
 * espaço embaixo.
 */
export function definirJanelaQueCresce(f: (() => boolean) | null): void {
  janelaCresce = f;
}

/** Onde a camada deve morar para ficar visível e clicável a partir da âncora. */
export function destinoDaCamada(ancora: Element): ParentNode {
  const dialogo = ancora.closest?.("dialog[open]");
  if (dialogo) return dialogo;
  const raiz = ancora.getRootNode?.() as (Node & { host?: Element }) | undefined;
  const doc = ancora.ownerDocument;
  if (raiz && raiz !== doc && raiz.host) return raiz as unknown as ShadowRoot;
  return doc.body ?? doc.documentElement;
}

function anunciar(janela: Window | null, fundo: number): void {
  const w = janela as (Window & { CustomEvent?: typeof CustomEvent }) | null;
  try {
    if (w?.CustomEvent) w.dispatchEvent(new w.CustomEvent("spro-popover", { detail: { fundo } }));
  } catch {
    /* sem janela de verdade (testes) */
  }
}

export function abrirFlutuante(ancora: HTMLElement, camada: HTMLElement, o: OpcoesFlutuante): Flutuante {
  const doc = ancora.ownerDocument;
  const janela = doc.defaultView;
  destinoDaCamada(ancora).append(camada);
  let aberta = true;

  const posicionar = () => {
    if (!aberta) return;
    const r = ancora.getBoundingClientRect?.();
    if (!r) return;
    const altJanela = janela?.innerHeight ?? 0;
    const largJanela = janela?.innerWidth ?? 0;
    const largura = Math.min(o.largura ?? Math.max(r.width, o.larguraMinima ?? 0), Math.max(180, largJanela - 16));
    const esquerdaIdeal = o.alinharDireita ? r.right - largura : r.left;
    const esquerda = Math.max(8, Math.min(esquerdaIdeal, largJanela - largura - 8));
    const maxima = o.alturaMaxima ?? 360;
    const dist = o.distancia ?? 4;
    // Mede o conteúdo sem o teto anterior: com ele, a medida nunca passaria do espaço que já havia.
    camada.style.maxHeight = "none";
    const desejada = Math.min(camada.scrollHeight || maxima, maxima);
    const embaixo = altJanela - r.bottom - 8;
    const emCima = r.top - 8;
    const cresce = janelaCresce?.() ?? false;
    const paraCima = !cresce && embaixo < Math.min(desejada, 200) && emCima > embaixo;
    camada.style.left = `${esquerda}px`;
    camada.style.width = `${largura}px`;
    camada.style.maxHeight = `${cresce ? maxima : Math.max(140, Math.min(maxima, paraCima ? emCima : embaixo > 140 ? embaixo : maxima))}px`;
    camada.classList.toggle("spro-flutuante-cima", paraCima);
    if (paraCima) {
      camada.style.top = "";
      camada.style.bottom = `${altJanela - r.top + dist}px`;
    } else {
      camada.style.bottom = "";
      camada.style.top = `${r.bottom + dist}px`;
    }
    anunciar(janela, paraCima ? 0 : Math.ceil(r.bottom + dist + desejada + 12));
  };

  const fora = (ev: Event) => {
    const caminho = (ev.composedPath?.() ?? []) as EventTarget[];
    const alvo = ev.target as Node | null;
    const dentro = (no: Node) => caminho.includes(no) || (!!alvo && !!no.contains?.(alvo));
    if (dentro(camada) || dentro(ancora)) return;
    o.aoFechar();
  };
  // Rolagem ou mudança de tamanho com a âncora já redesenhada (fora da página): a camada fecha.
  const reposicionar = () => {
    if (ancora.isConnected) posicionar();
    else o.aoFechar();
  };
  const rolou = (ev: Event) => {
    if (ev.target instanceof Node && camada.contains(ev.target)) return;
    reposicionar();
  };
  // A janela perdeu o foco (clique na página do SEI, fora do iframe, ou em outra aba): fecha, como um menu nativo.
  const saiu = () => o.aoFechar();
  doc.addEventListener("pointerdown", fora, true);
  janela?.addEventListener("scroll", rolou, true);
  janela?.addEventListener("resize", reposicionar);
  janela?.addEventListener("blur", saiu);
  const registro = { ancora, fechar: () => o.aoFechar() };
  abertas.add(registro);
  posicionar();

  return {
    posicionar,
    fechar() {
      if (!aberta) return;
      aberta = false;
      abertas.delete(registro);
      doc.removeEventListener("pointerdown", fora, true);
      janela?.removeEventListener("scroll", rolou, true);
      janela?.removeEventListener("resize", reposicionar);
      janela?.removeEventListener("blur", saiu);
      camada.remove();
      anunciar(janela, 0);
    },
  };
}
