/**
 * Tooltips da casca: o `title` nativo do navegador (caixa cinza do sistema, que se soma ao tooltip do SEI)
 * é suspenso SÓ enquanto o mouse está sobre o botão (vira `data-spro-dica`) e devolvido ao sair; uma única
 * caixa, no mesmo visual do tooltip do SEI no tema, mostra o texto. Elementos que já têm o tooltip do SEI
 * (`infraTooltipMostrar`) só perdem o `title` durante o hover.
 * Por que não tirar o `title` de uma vez: o SEI e o SEI Pro LEEM `title` como dado (login e nome do usuário em
 * #lnkUsuarioSistema, nome da unidade, ícones da árvore). Sem ele, o contexto da aba vinha sem login e
 * Favoritos, Projetos, Demandas e a ordem dos painéis desistiam de carregar. Autocontido: não depende de
 * nenhuma função da página, e desligar o tema devolve o `title` do botão sob o mouse.
 */

export const ATRIBUTO_DICA = "data-spro-dica";
export const MARCA_CAIXA = "data-spro-dica-caixa";

/** Onde os botões da casca vivem (barra superior, barras de ações, menu e árvore). */
export const ESCOPOS_DICAS = [
  "#divInfraBarraSistemaPadrao",
  "div.barraBotoesSEI",
  "#divArvoreAcoes",
  "#infraMenu",
  "#divInfraAreaTelaE",
  "#divArvore",
];

const SELETOR_ESCOPO = ESCOPOS_DICAS.join(",");
const SELETOR_ALVO = `[${ATRIBUTO_DICA}],[title]`;
const ATRASO_MS = 250;

/** O tooltip do SEI costuma morar no <a> e o title na <img> de dentro: vale o elemento ou qualquer ancestral. */
export const temTooltipDoSei = (el: Element): boolean => el.closest('[onmouseover*="infraTooltipMostrar"]') !== null;

/** Botões cujo `title` o próprio SEI lê no clique para alternar estado (ex.: Exibir/Ocultar Menu do Sistema). */
const SELETOR_PRESERVADO = "#lnkInfraMenuSistema, #lnkInfraMenuSistemaMovel";

/** O botão da casca sob o ponteiro (com `title`, ou já suspenso), ou null se estiver fora dos escopos. */
export function alvoDaDica(el: Element | null): Element | null {
  const alvo = el?.closest?.(SELETOR_ALVO) ?? null;
  if (!alvo || alvo.closest(SELETOR_PRESERVADO)) return null;
  return alvo.closest(SELETOR_ESCOPO) ? alvo : null;
}

/** Liga os tooltips no documento. Devolve o desligador (devolve o `title` suspenso e remove a caixa). */
export function iniciarDicas(doc: Document): () => void {
  const visao = doc.defaultView;
  let caixa: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  /** O botão cujo `title` está suspenso agora, com o texto original. */
  let suspenso: { el: Element; titulo: string } | null = null;

  const esconder = () => {
    clearTimeout(timer);
    caixa?.remove();
    caixa = null;
  };

  const devolver = () => {
    esconder();
    if (!suspenso) return;
    const { el, titulo } = suspenso;
    suspenso = null;
    el.removeAttribute(ATRIBUTO_DICA);
    if (!el.hasAttribute("title")) el.setAttribute("title", titulo);
  };

  const suspender = (el: Element) => {
    const titulo = el.getAttribute("title") ?? "";
    suspenso = { el, titulo };
    el.removeAttribute("title");
    const texto = titulo.trim();
    // Campos de texto: o placeholder já diz o mesmo e o balão cobriria o que vem logo abaixo.
    if (texto && !/^(input|textarea|select)$/i.test(el.tagName)) el.setAttribute(ATRIBUTO_DICA, texto);
  };

  const mostrar = (alvo: Element) => {
    const texto = alvo.getAttribute(ATRIBUTO_DICA);
    if (!texto || !doc.body) return;
    esconder();
    caixa = doc.createElement("div");
    caixa.setAttribute(MARCA_CAIXA, "");
    caixa.setAttribute("role", "tooltip");
    caixa.textContent = texto;
    doc.body.appendChild(caixa);
    const r = alvo.getBoundingClientRect();
    const c = caixa.getBoundingClientRect();
    const largura = visao?.innerWidth ?? 1200;
    const esquerda = Math.min(Math.max(8, r.left + r.width / 2 - c.width / 2), Math.max(8, largura - c.width - 8));
    const abaixo = r.bottom + 8;
    const cabeEmbaixo = abaixo + c.height < (visao?.innerHeight ?? 800) - 4;
    caixa.style.left = `${Math.round(esquerda)}px`;
    caixa.style.top = `${Math.round(cabeEmbaixo ? abaixo : Math.max(4, r.top - c.height - 8))}px`;
  };

  const aoEntrar = (ev: Event) => {
    const alvo = alvoDaDica(ev.target as Element | null);
    if (!alvo) return;
    if (suspenso?.el !== alvo) {
      devolver();
      suspender(alvo);
    }
    if (temTooltipDoSei(alvo) || !alvo.hasAttribute(ATRIBUTO_DICA)) return;
    clearTimeout(timer);
    timer = setTimeout(() => mostrar(alvo), ATRASO_MS);
  };
  const aoSair = (ev: Event) => {
    if (!suspenso) return;
    const para = (ev as MouseEvent).relatedTarget as Node | null;
    if (para && suspenso.el.contains(para)) return;
    devolver();
  };

  doc.addEventListener("mouseover", aoEntrar, true);
  doc.addEventListener("mouseout", aoSair, true);
  doc.addEventListener("mousedown", devolver, true);
  doc.addEventListener("scroll", esconder, true);

  return () => {
    doc.removeEventListener("mouseover", aoEntrar, true);
    doc.removeEventListener("mouseout", aoSair, true);
    doc.removeEventListener("mousedown", devolver, true);
    doc.removeEventListener("scroll", esconder, true);
    devolver();
  };
}
