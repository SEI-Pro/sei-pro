/** O quadro: colunas por marcador, responsável, prazo ou tipo; arrastar e soltar chama `aoMover`. */
import { h } from '../../../sei-comum/src/ui/dom';
import { lerNota } from '../modelo/checklist';
import type { Ctx } from '../modelo/contexto';
import { resumoDoPrazo } from '../modelo/derivados';
import { agrupar } from '../modelo/grupos';
import { type ColunaQuadro, type ExtrasQuadro, montarQuadro } from '../modelo/quadro';
import type { ConfigQuadro, Processo } from '../modelo/tipos';
import { corDoMarcador } from './cores';
import { iconeGrade } from './icones';

const NS_SVG = 'http://www.w3.org/2000/svg';

function svgEl(tag: string, attrs: Record<string, string>, doc: Document = document): SVGElement {
  const el = doc.createElementNS(NS_SVG, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function svgExclamacao(): SVGElement {
  const svg = svgEl('svg', { viewBox: '0 0 24 24', width: '17', height: '17', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(
    svgEl('path', { d: 'M12 3L2.2 20h19.6L12 3z', fill: '#facc15', stroke: '#9ca3af', 'stroke-width': '1.4', 'stroke-linejoin': 'round' }),
    svgEl('path', { d: 'M12 9.2v5.2', stroke: '#111827', 'stroke-width': '2.1', 'stroke-linecap': 'round' }),
    svgEl('circle', { cx: '12', cy: '17.3', r: '1.2', fill: '#111827' }),
  );
  return svg;
}

function svgMarcador(cor: string): SVGElement {
  const fill = corDoMarcador(cor);
  const claro = fill === '#ffffff' || fill === '#e0b000';
  const svg = svgEl('svg', { viewBox: '0 0 24 24', width: '16', height: '16', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(
    svgEl('path', {
      d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
      fill,
      stroke: claro ? '#9ca3af' : 'none',
      'stroke-width': claro ? '1.5' : '0',
      'stroke-linejoin': 'round',
    }),
    svgEl('circle', { cx: '7.2', cy: '7.2', r: '1.7', fill: claro ? '#9ca3af' : '#ffffff' }),
  );
  return svg;
}

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
  aoEditarAnotacao?(id: string): void;
  aoAlternarTarefa?(id: string, indiceLinha: number): void;
  aoAlternarColuna?(chave: string): void;
}

const TIPO_DND = 'application/x-spro-cartao';
const TIPO_DND_COL = 'application/x-spro-coluna';

function anotacaoEl(p: Processo, props: PropsQuadro): HTMLElement | null {
  const texto = p.anotacao?.texto?.trim();
  if (!texto) return null;
  const podeEditar = !p.sigiloso && !!props.aoEditarAnotacao;
  const linhas = lerNota(p.anotacao!.texto);
  const filhos = linhas.map((l, idx) => {
    if (l.marca === null) return h('div', { class: 'spro-anot-linha' }, l.texto || '\u00A0');
    const chk = h('button', {
      type: 'button',
      role: 'checkbox',
      class: `spro-anot-check${l.marca ? ' spro-anot-check-on' : ''}`,
      'aria-checked': String(l.marca),
      'aria-label': l.marca ? `Desmarcar ${l.texto}` : `Marcar ${l.texto}`,
      title: l.marca ? 'Desmarcar tarefa' : 'Marcar tarefa como concluída',
      draggable: 'false',
      onmousedown: (ev: Event) => ev.stopPropagation(),
      onclick: (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        props.aoAlternarTarefa?.(p.id, idx);
      },
    }, l.marca ? '\u2713' : '');
    return h('div', { class: `spro-anot-linha spro-anot-tarefa${l.marca ? ' spro-anot-feita' : ''}` }, chk, h('span', { class: 'spro-anot-txt' }, l.texto));
  });
  const dica = [p.anotacao?.autor ? `Última edição: ${p.anotacao.autor}` : '', podeEditar ? 'Clique para editar a anotação' : ''].filter(Boolean).join('\n');
  const box = h('div', {
    class: `spro-cartao-anotacao${p.anotacao?.prioridade ? ' spro-cartao-anotacao-prio' : ''}${podeEditar ? ' spro-cartao-anotacao-editavel' : ''}`,
    title: dica || undefined,
    ...(podeEditar ? { onclick: (ev: Event) => { ev.stopPropagation(); props.aoEditarAnotacao?.(p.id); } } : {}),
  }, ...filhos);
  return box;
}

function sinaisCartaoEl(p: Processo, de: string, props: PropsQuadro): HTMLElement | null {
  const itens: HTMLElement[] = [];
  if (p.documentoNovo) {
    const dica = p.documentoNovoDica || 'Um documento foi incluído ou assinado neste processo';
    itens.push(h('span', { class: 'spro-cartao-excl', title: dica, 'aria-label': dica }, svgExclamacao()));
  }
  const outrosMarcadores = props.cfg.colunas === 'marcador'
    ? p.marcadores.filter((m) => `m:${m.nome}` !== de)
    : p.marcadores;
  for (const m of outrosMarcadores) {
    const dica = m.texto ? `${m.nome}\n${m.texto}` : m.nome;
    itens.push(h('span', { class: 'spro-cartao-marc-ic', title: dica, 'aria-label': dica }, svgMarcador(m.cor)));
  }
  return itens.length ? h('div', { class: 'spro-cartao-sinais' }, ...itens) : null;
}

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
  const boxAnotacao = anotacaoEl(p, props);
  const boxSinais = sinaisCartaoEl(p, de, props);
  const btnNovaAnotacao = !boxAnotacao && !p.sigiloso && props.aoEditarAnotacao
    ? h('button', {
        type: 'button',
        class: 'spro-anot-vazia',
        title: 'Adicionar anotação',
        'aria-label': 'Adicionar anotação',
        onclick: (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); props.aoEditarAnotacao?.(p.id); },
      }, '+ anotação')
    : null;
  const c = h('div', { class: `spro-cartao${cb.checked ? ' spro-sel' : ''}`, draggable: 'true', 'data-id': p.id, 'data-de': de },
    h('div', { class: 'spro-cartao-topo' }, cb, h('a', { class: `spro-proc${p.naoVisualizado ? ' spro-novo' : ''}`, href: p.link ?? '#', draggable: 'false' }, p.protocolo)),
    p.tipo ? h('div', { class: 'spro-cartao-tipo' }, p.tipo) : null,
    p.especificacao ? h('div', { class: 'spro-cartao-espec', title: p.especificacao }, p.especificacao) : null,
    boxAnotacao,
    boxSinais,
    h('div', { class: 'spro-cartao-rodape' },
      h('div', { class: 'spro-cartao-acoes' }, btnPrazo, btnNovaAnotacao),
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
  const recolhida = props.cfg.colunasRecolhidas?.includes(col.chave) ?? false;
  const corpo = h('div', { class: 'spro-col-corpo' }, ...col.itens.map((p) => cartao(p, col.chave, props)));
  if (!col.itens.length) corpo.append(h('div', { class: 'spro-col-vazia' }, col.aceitaSoltar ? 'Solte aqui' : 'Vazia'));
  const lim = props.cfg.limite;
  const podeOrdenar = !!props.aoReordenarColuna;
  const btnRecolher = props.aoAlternarColuna
    ? h('button', {
        type: 'button',
        class: 'spro-col-recolher',
        'aria-expanded': String(!recolhida),
        'aria-label': recolhida ? `Expandir coluna ${col.titulo}` : `Recolher coluna ${col.titulo}`,
        title: recolhida ? 'Expandir coluna' : 'Recolher coluna',
        draggable: 'false',
        onmousedown: (ev: Event) => ev.stopPropagation(),
        onclick: (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
          props.aoAlternarColuna?.(col.chave);
        },
      }, recolhida ? '+' : '−')
    : null;
  const topo = h('div', {
    class: `spro-col-topo${podeOrdenar ? ' spro-col-arrastavel' : ''}`,
    ...(podeOrdenar ? { draggable: 'true', title: 'Arraste para reordenar a coluna' } : {}),
  },
    podeOrdenar ? h('span', { class: 'spro-col-alca', 'aria-hidden': 'true' }, '\u22EE\u22EE') : null,
    h('span', { class: 'spro-col-titulo', title: col.titulo }, col.titulo),
    h('span', { class: `spro-col-n${col.excedeu ? ' spro-excedeu' : ''}`, title: col.excedeu ? `Passou do limite de ${lim}` : undefined }, lim > 0 ? `${col.itens.length}/${lim}` : String(col.itens.length)),
    btnRecolher,
    col.aceitaSoltar ? null : h('span', { class: 'spro-col-trava', title: col.motivoSomenteLeitura }, iconeGrade('bloquear', 13)));
  const raiz = h('section', { class: `spro-col${col.tom ? ` spro-tom-${col.tom}` : ''}${col.excedeu ? ' spro-col-cheia' : ''}${recolhida ? ' spro-col-recolhida' : ''}`, 'data-chave': col.chave }, topo, corpo);
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
