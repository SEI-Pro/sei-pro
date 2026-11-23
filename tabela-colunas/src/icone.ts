/**
 * Ícone do botão "Tabela com colunas em %".
 */

const SVG = 'http://www.w3.org/2000/svg';

/**
 * Ícone em SVG, como os botões nativos do CK5. O botão vem do monólito com um `<i class="fab ...">`, mas
 * `css/sei-pro.css` força `.fab` na fonte Brands, que só tem logotipos: o ícone de colunas saía em
 * branco e o botão ficava vazio na barra.
 */
export function desenharIcone(botao: Element): void {
  if (botao.querySelector('svg.spro-tc-icone')) return;
  const doc = botao.ownerDocument;
  const svg = doc.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'ck ck-icon ck-button__icon spro-tc-icone');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  const tracos: Array<[string, Record<string, string>]> = [
    ['rect', { x: '2', y: '2.5', width: '16', height: '11', rx: '1.5' }],
    ['path', { d: 'M2 6h16M7.5 2.5v11M12.5 2.5v11' }],
    ['path', { d: 'M3.5 17h13M5.5 15.3 3.5 17l2 1.7M14.5 15.3l2 1.7-2 1.7' }],
  ];
  for (const [tag, attrs] of tracos) {
    const el = doc.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'currentColor');
    el.setAttribute('stroke-width', '1.4');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    svg.append(el);
  }
  const fonte = botao.querySelector('i');
  if (fonte) {
    svg.classList.add(...Array.from(fonte.classList).filter((c) => /Color$/.test(c)));
    fonte.replaceWith(svg);
  } else botao.prepend(svg);
}

/** O monólito monta a barra depois de carregar os módulos: espera o botão aparecer (até 60 s). */
export function vigiarBotao(doc: Document): void {
  const aplicarEmTodos = () => {
    const botoes = doc.querySelectorAll('.getTabelaColunasButtom');
    botoes.forEach(desenharIcone);
    return botoes.length > 0;
  };
  if (aplicarEmTodos()) return;
  const obs = new MutationObserver(() => {
    if (aplicarEmTodos()) obs.disconnect();
  });
  obs.observe(doc.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 60000);
}

