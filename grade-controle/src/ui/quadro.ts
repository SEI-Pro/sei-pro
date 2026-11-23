/** O quadro: colunas por marcador, responsável, prazo ou tipo; arrastar e soltar chama `aoMover`. */
import { h } from '../../../sei-comum/src/ui/dom';
import type { Ctx } from '../modelo/contexto';
import { resumoDoPrazo } from '../modelo/derivados';
import { agrupar } from '../modelo/grupos';
import { type ColunaQuadro, type ExtrasQuadro, montarQuadro } from '../modelo/quadro';
import type { ConfigQuadro, Processo } from '../modelo/tipos';
import { iconeGrade } from './icones';

export interface PropsQuadro {
  processos: Processo[];
  cfg: ConfigQuadro;
  ctx: Ctx;
  extras: ExtrasQuadro;
  selecionados: ReadonlySet<string>;
  aoMover(id: string, de: string, para: string): void;
  aoSelecionar(id: string, marcado: boolean): void;
  aoAbrirPrazo?(id: string): void;
  aoReordenarColuna?(de: string, para: string, chaves: string[]): void;
}

const TIPO_DND = 'application/x-spro-cartao';
const TIPO_DND_COL = 'application/x-spro-coluna';

function cartao(p: Processo, de: string, props: PropsQuadro): HTMLElement {
  const r = resumoDoPrazo(p, props.ctx);
  const cb = h('input', { type: 'checkbox', class: 'spro-cb', 'aria-label': `Marcar ${p.protocolo}` });
  cb.checked = props.selecionados.has(p.id);
  cb.addEventListener('change', () => props.aoSelecionar(p.id, cb.checked));
  const rotuloPrazo = r ? 'Editar o prazo' : 'Definir um prazo';
  const btnPrazo = props.aoAbrirPrazo
    ? h('button', {
        type: 'button',
        class: 'spro-prazo-b',
        title: r ? `${r.dica}\n\n${rotuloPrazo}` : rotuloPrazo,
        'aria-label': rotuloPrazo,
        onclick: (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); props.aoAbrirPrazo?.(p.id); },
      }, r ? h('span', { class: `spro-prazo spro-prazo-${r.situacao}` }, r.texto) : h('span', { class: 'spro-prazo-vazio' }, 'definir'))
    : (r ? h('span', { class: `spro-prazo spro-prazo-${r.situacao}`, title: r.dica }, r.texto) : null);
  const anotacaoTexto = p.anotacao?.texto?.trim();
  const c = h('div', { class: `spro-cartao${cb.checked ? ' spro-sel' : ''}`, draggable: 'true', 'data-id': p.id, 'data-de': de },
    h('div', { class: 'spro-cartao-topo' }, cb, h('a', { class: `spro-proc${p.naoVisualizado ? ' spro-novo' : ''}`, href: p.link ?? '#', draggable: 'false' }, p.protocolo)),
    p.tipo ? h('div', { class: 'spro-cartao-tipo' }, p.tipo) : null,
    p.especificacao ? h('div', { class: 'spro-cartao-espec', title: p.especificacao }, p.especificacao) : null,
    anotacaoTexto ? h('div', { class: `spro-cartao-anotacao${p.anotacao?.prioridade ? ' spro-cartao-anotacao-prio' : ''}`, title: p.anotacao?.autor ? `${anotacaoTexto}\n— ${p.anotacao.autor}` : anotacaoTexto }, anotacaoTexto) : null,
    h('div', { class: 'spro-cartao-rodape' },
      btnPrazo,
      p.atribuicao ? h('span', { class: 'spro-avatar', title: p.atribuicao.nome }, p.atribuicao.sigla.slice(0, 2).toUpperCase()) : null));
  c.addEventListener('dragstart', (ev) => {
    ev.stopPropagation();
    ev.dataTransfer?.setData(TIPO_DND, JSON.stringify({ id: p.id, de }));
    ev.dataTransfer?.setData('text/plain', p.protocolo);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
    c.classList.add('spro-arrastando');
  });
  c.addEventListener('dragend', () => c.classList.remove('spro-arrastando'));
  return c;
}

function colunaEl(col: ColunaQuadro, chaves: string[], props: PropsQuadro): HTMLElement {
  const corpo = h('div', { class: 'spro-col-corpo' }, ...col.itens.map((p) => cartao(p, col.chave, props)));
  if (!col.itens.length) corpo.append(h('div', { class: 'spro-col-vazia' }, col.aceitaSoltar ? 'Solte aqui' : 'Vazia'));
  const lim = props.cfg.limite;
  const podeOrdenar = !!props.aoReordenarColuna;
  const topo = h('div', {
    class: `spro-col-topo${podeOrdenar ? ' spro-col-arrastavel' : ''}`,
    ...(podeOrdenar ? { draggable: 'true', title: 'Arraste para reordenar a coluna' } : {}),
  },
    podeOrdenar ? h('span', { class: 'spro-col-alca', 'aria-hidden': 'true' }, '\u22EE\u22EE') : null,
    h('span', { class: 'spro-col-titulo', title: col.titulo }, col.titulo),
    h('span', { class: `spro-col-n${col.excedeu ? ' spro-excedeu' : ''}`, title: col.excedeu ? `Passou do limite de ${lim}` : undefined }, lim > 0 ? `${col.itens.length}/${lim}` : String(col.itens.length)),
    col.aceitaSoltar ? null : h('span', { class: 'spro-col-trava', title: col.motivoSomenteLeitura }, iconeGrade('bloquear', 13)));
  const raiz = h('section', { class: `spro-col${col.tom ? ` spro-tom-${col.tom}` : ''}${col.excedeu ? ' spro-col-cheia' : ''}`, 'data-chave': col.chave }, topo, corpo);
  if (podeOrdenar) {
    topo.addEventListener('dragstart', (ev) => {
      ev.stopPropagation();
      ev.dataTransfer?.setData(TIPO_DND_COL, col.chave);
      ev.dataTransfer?.setData('text/plain', col.titulo);
      if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
      raiz.classList.add('spro-col-arrastando');
    });
    topo.addEventListener('dragend', () => raiz.classList.remove('spro-col-arrastando'));
  }
  raiz.addEventListener('dragover', (ev) => {
    if (podeOrdenar && ev.dataTransfer?.types.includes(TIPO_DND_COL)) {
      ev.preventDefault();
      raiz.classList.add('spro-col-alvo');
      return;
    }
    if (!ev.dataTransfer?.types.includes(TIPO_DND)) return;
    if (!col.aceitaSoltar) return;
    ev.preventDefault();
    raiz.classList.add('spro-alvo');
  });
  raiz.addEventListener('dragleave', () => {
    raiz.classList.remove('spro-alvo');
    raiz.classList.remove('spro-col-alvo');
  });
  raiz.addEventListener('drop', (ev) => {
    raiz.classList.remove('spro-alvo');
    raiz.classList.remove('spro-col-alvo');
    if (podeOrdenar && ev.dataTransfer?.types.includes(TIPO_DND_COL)) {
      const colDe = ev.dataTransfer.getData(TIPO_DND_COL);
      if (colDe) {
        ev.preventDefault();
        if (colDe !== col.chave) props.aoReordenarColuna?.(colDe, col.chave, chaves);
        return;
      }
    }
    const bruto = ev.dataTransfer?.getData(TIPO_DND);
    if (!bruto) return;
    ev.preventDefault();
    try {
      const { id, de } = JSON.parse(bruto) as { id: string; de: string };
      props.aoMover(id, de, col.chave);
    } catch {
      /* arraste de outra origem */
    }
  });
  return raiz;
}

export function desenharQuadro(props: PropsQuadro): HTMLElement {
  const raiz = h('div', { class: 'spro-quadro' });
  raiz.style.setProperty('--spro-col-largura', `${props.cfg.larguraColuna ?? 280}px`);
  const faixa = (processos: Processo[]) => {
    const cols = montarQuadro(processos, props.cfg, props.ctx, props.extras);
    const chaves = cols.map((c) => c.chave);
    return h('div', { class: 'spro-colunas' }, ...cols.map((c) => colunaEl(c, chaves, props)));
  };
  if (props.cfg.raiasPorResponsavel && props.cfg.colunas !== 'responsavel') {
    for (const g of agrupar(props.processos, 'responsavel', props.ctx)) {
      raiz.append(h('div', { class: 'spro-raia' }, h('div', { class: 'spro-raia-nome' }, g.rotulo, h('span', { class: 'spro-grupo-n' }, String(g.itens.length))), faixa(g.itens)));
    }
  } else raiz.append(faixa(props.processos));
  if (!props.processos.length) raiz.prepend(h('div', { class: 'spro-vazio' }, 'Nenhum processo corresponde ao filtro.'));
  return raiz;
}
