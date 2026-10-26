/** A tabela: cabeçalho ordenável, grupos recolhíveis e linhas virtualizadas (só as visíveis existem no DOM). */
import { h, icone } from '../../../sei-comum/src/ui/dom';
import type { Ctx } from '../modelo/contexto';
import { diasNaCaixa, diasParado, resumoDoPrazo } from '../modelo/derivados';
import { sinaisDe, textoPrazo } from '../modelo/exportar';
import { DICA_IDADE, rotuloIdade } from '../modelo/idade';
import type { LinhaLista } from '../modelo/linhas';
import { calcularJanela } from '../modelo/janela';
import { type Coluna, type CampoOrdem, type CriterioOrdem, type Densidade, type Processo, ROTULO_COLUNA } from '../modelo/tipos';
import { resumoDaNota } from '../modelo/checklist';
import { corDoMarcador } from './cores';
import { iconeGrade } from './icones';
import { botaoCopiarNumero, copiarTexto } from './copiarNumero';

export const ALTURA: Record<Densidade, number> = { compacta: 34, confortavel: 48 };
const LARGURA: Record<Coluna, string> = {
  processo: 'minmax(340px, 370px)',
  tipo: 'minmax(120px, 1.2fr)',
  especificacao: 'minmax(200px, 2fr)',
  responsavel: 'minmax(90px, 130px)',
  marcadores: 'minmax(120px, 1.3fr)',
  prazo: 'minmax(120px, 150px)',
  anotacao: 'minmax(130px, 1.4fr)',
  caixa: '84px',
  parado: '84px',
  sinais: 'minmax(110px, 150px)',
};
export const ORDENAVEL: Partial<Record<Coluna, CampoOrdem>> = {
  processo: 'protocolo', tipo: 'tipo', responsavel: 'responsavel', marcadores: 'marcador', prazo: 'prazo', caixa: 'caixa', parado: 'parado', sinais: 'novo',
};

export interface PropsTabela {
  linhas: LinhaLista[];
  colunas: Coluna[];
  densidade: Densidade;
  ctx: Ctx;
  ordem: CriterioOrdem[];
  selecionados: ReadonlySet<string>;
  foco: string | null;
  aoOrdenar(campo: CampoOrdem, acrescentar: boolean): void;
  aoSelecionar(id: string, marcado: boolean): void;
  aoGrupo(chave: string): void;
  aoMarcarGrupo(ids: string[], marcado: boolean): void;
  /** Clones dos icones dos outros modulos (monitorado, projeto, demanda) da linha nativa. */
  icones(id: string): HTMLElement[];
  nomesCompletos: boolean;
  /** Na visao detalhada do SEI nao se sabe se o processo e recebido ou gerado: sem o icone de origem. */
  semOrigem?: boolean;
  /** Processo cuja especificacao esta em edicao, e o texto que o usuario ja digitou. */
  editando: string | null;
  rascunho: string;
  aoEditarEspec(id: string): void;
  aoDigitarEspec(texto: string): void;
  aoSalvarEspec(id: string): void;
  aoCancelarEspec(): void;
  aoAbrirPrazo(id: string): void;
  aoEditar(id: string, que: 'responsavel' | 'anotacao' | 'marcadores'): void;
}

/** "Maria da Silva Souza" -> "Maria Souza" (a mesma regra do legado). */
export function nomeCurto(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  return partes.length > 2 ? `${partes[0]} ${partes[partes.length - 1]}` : nome;
}

function botaoLapis(rotulo: string, fn: () => void): HTMLElement {
  return h('button', { type: 'button', class: 'spro-lapis', title: rotulo, 'aria-label': rotulo, onclick: (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); fn(); } }, icone('lapis', 13));
}

const el = (tag: 'div' | 'span', classe: string, texto?: string) => h(tag, { class: classe }, texto);

function celula(p: Processo, c: Coluna, ctx: Ctx, props: PropsTabela): HTMLElement {
  const td = el('div', `spro-c spro-c-${c}`);
  switch (c) {
    case 'processo': {
      // Quatro lugares fixos (monitorado, projeto, demanda, acompanhamento): o numero do processo alinha em todas as linhas.
      const clones = props.icones(p.id);
      const slot = (classe: string) => clones.find((c) => c.classList.contains(classe)) ?? h('span', { class: 'spro-slot' });
      const acomp = p.acompanhamentoEspecial
        ? h('span', { class: 'spro-acomp', title: p.acompanhamentoGrupo ? `Acompanhamento especial: ${p.acompanhamentoGrupo}` : 'Acompanhamento especial' }, icone('olho', 15))
        : h('span', { class: 'spro-slot' });
      td.append(h('span', { class: 'spro-icones' }, slot('spro-fav-estrela'), slot('spro-prj-ic'), slot('spro-dem-cx'), acomp));
      const rec = p.grupo === 'recebidos';
      if (!props.semOrigem) td.append(h('span', { class: `spro-origem spro-origem-${p.grupo}`, title: rec ? 'Processo recebido: veio de outra unidade' : 'Processo gerado: autuado nesta unidade', role: 'img', 'aria-label': rec ? 'Processo recebido' : 'Processo gerado' }, iconeGrade(rec ? 'recebido' : 'gerado', 16)));
      const a = h('a', { class: `spro-proc${p.naoVisualizado ? ' spro-novo' : ''}`, href: p.link ?? '#', title: 'Abrir o processo' }, p.protocolo);
      td.append(a);
      if (p.link) td.append(h('a', { class: 'spro-nova-guia', href: p.link, target: '_blank', rel: 'noopener', title: 'Abrir em nova guia', 'aria-label': `Abrir ${p.protocolo} em nova guia` }, iconeGrade('novaGuia', 14)));
      td.append(botaoCopiarNumero(p.protocolo, (t) => copiarTexto(document, t)));
      if (p.sigiloso) td.append(h('span', { class: 'spro-sigilo', title: 'Processo sigiloso' }, 'sigiloso'));
      if (p.urgente) td.append(h('span', { class: 'spro-urgente', title: 'Marcado como urgente' }, 'urgente'));
      if (p.trancado) td.append(h('span', { class: 'spro-sigilo', title: 'Processo trancado' }, 'trancado'));
      break;
    }
    case 'tipo':
      td.append(el('span', 'spro-corta', p.tipo));
      td.title = p.tipo;
      break;
    case 'especificacao': {
      td.classList.add('spro-editavel');
      if (props.editando === p.id) {
        const entrada = h('input', { type: 'text', class: 'spro-espec-input', maxlength: '100', value: props.rascunho, 'aria-label': 'Especificação do processo' });
        entrada.addEventListener('input', () => props.aoDigitarEspec(entrada.value));
        entrada.addEventListener('keydown', (ev) => {
          ev.stopPropagation();
          if (ev.key === 'Enter') props.aoSalvarEspec(p.id);
          else if (ev.key === 'Escape') props.aoCancelarEspec();
        });
        const manter = (ev: Event) => ev.preventDefault();
        const ok = h('button', { type: 'button', class: 'spro-lapis spro-lapis-ok', title: 'Salvar (Enter)', 'aria-label': 'Salvar', onclick: () => props.aoSalvarEspec(p.id) }, icone('check', 14));
        const nao = h('button', { type: 'button', class: 'spro-lapis', title: 'Cancelar (Esc)', 'aria-label': 'Cancelar', onclick: () => props.aoCancelarEspec() }, icone('fechar', 14));
        ok.addEventListener('pointerdown', manter);
        nao.addEventListener('pointerdown', manter);
        td.append(h('span', { class: 'spro-edicao' }, entrada, ok, nao));
        break;
      }
      td.append(el('span', 'spro-corta', p.especificacao));
      td.title = p.especificacao;
      if (!p.sigiloso) td.append(botaoLapis('Editar a especificação', () => props.aoEditarEspec(p.id)));
      break;
    }
    case 'responsavel':
      td.classList.add('spro-editavel');
      if (p.atribuicao) {
        td.append(el('span', 'spro-corta', props.nomesCompletos ? nomeCurto(p.atribuicao.nome) : p.atribuicao.sigla));
        td.title = props.nomesCompletos ? p.atribuicao.sigla : p.atribuicao.nome;
      } else td.append(h('span', { class: 'spro-prazo-vazio spro-vazio-edicao' }, 'atribuir'));
      td.append(botaoLapis(p.atribuicao ? 'Mudar o responsável' : 'Atribuir a alguém', () => props.aoEditar(p.id, 'responsavel')));
      break;
    case 'marcadores':
      td.classList.add('spro-editavel');
      if (p.marcadores.length) {
        // As pílulas quebram de linha entre si, mas o lápis fica ao lado delas (e centralizado com o resto da linha).
        td.append(h('span', { class: 'spro-pilulas' }, ...p.marcadores.map((m) => h('span', { class: 'spro-marcador', title: m.texto ? `${m.nome}: ${m.texto}` : m.nome }, h('i', { style: `background:${corDoMarcador(m.cor)}` }), m.nome))));
      }
      if (!p.sigiloso) {
        if (!p.marcadores.length) td.append(h('span', { class: 'spro-prazo-vazio spro-vazio-edicao' }, 'marcar'));
        td.append(botaoLapis(p.marcadores.length ? 'Editar os marcadores' : 'Adicionar marcador', () => props.aoEditar(p.id, 'marcadores')));
      }
      break;
    case 'prazo': {
      const r = resumoDoPrazo(p, ctx);
      td.classList.add('spro-editavel');
      const rotulo = r ? 'Editar o prazo' : 'Definir um prazo';
      const b = h('button', { type: 'button', class: 'spro-prazo-b', title: r ? `${textoPrazo(p, ctx)}\n${r.dica}\n\n${rotulo}` : rotulo, 'aria-label': rotulo, onclick: (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); props.aoAbrirPrazo(p.id); } },
        r ? el('span', `spro-prazo spro-prazo-${r.situacao}`, r.texto) : el('span', 'spro-prazo-vazio', 'definir'));
      td.append(b, h('span', { class: 'spro-lapis spro-lapis-fixo', 'aria-hidden': 'true' }, icone('lapis', 13)));
      break;
    }
    case 'anotacao':
      td.classList.add('spro-editavel');
      if (p.anotacao) {
        td.append(el('span', `spro-corta${p.anotacao.prioridade ? ' spro-prio' : ''}`, resumoDaNota(p.anotacao.texto)));
        td.setAttribute('data-tip-nota', p.anotacao.texto);
        td.setAttribute('data-tip-autor', p.anotacao.autor);
      } else if (!p.sigiloso) td.append(h('span', { class: 'spro-prazo-vazio spro-vazio-edicao' }, 'anotar'));
      if (!p.sigiloso) td.append(botaoLapis(p.anotacao ? 'Editar a anotação' : 'Adicionar anotação', () => props.aoEditar(p.id, 'anotacao')));
      break;
    case 'caixa': {
      const t = rotuloIdade(diasNaCaixa(p, ctx));
      td.append(el('span', 'spro-suave', t));
      if (t) td.title = DICA_IDADE;
      break;
    }
    case 'parado': {
      const d = diasParado(p, ctx);
      td.append(el('span', 'spro-suave', rotuloIdade(d)));
      if (d !== null) td.title = 'Dias desde a última movimentação (visão detalhada do SEI).';
      break;
    }
    case 'sinais':
      for (const s of sinaisDe(p)) td.append(el('span', 'spro-sinal', s));
      break;
  }
  return td;
}

export function criarTabela(inicial: PropsTabela) {
  let p = inicial;
  const cabecalho = el('div', 'spro-cab');
  const corpo = el('div', 'spro-corpo');
  const rolagem = h('div', { class: 'spro-rolagem', tabindex: '-1' }, corpo);
  const raiz = h('div', { class: 'spro-tabela', role: 'table' }, cabecalho, rolagem);
  let ultimaChave = '';
  let focarEdicao = false;
  let focoNaEdicao = false;

  const modelo = () => `36px ${p.colunas.map((c) => LARGURA[c]).join(' ')}`;

  function desenharCabecalho() {
    cabecalho.replaceChildren();
    cabecalho.style.gridTemplateColumns = modelo();
    const todos = p.linhas.filter((l): l is Extract<LinhaLista, { tipo: 'processo' }> => l.tipo === 'processo').map((l) => l.processo.id);
    const marcados = todos.filter((id) => p.selecionados.has(id)).length;
    const geral = h('input', { type: 'checkbox', class: 'spro-cb', 'aria-label': 'Marcar todos os processos visíveis', title: 'Marcar todos os visíveis', disabled: !todos.length });
    geral.checked = todos.length > 0 && marcados === todos.length;
    geral.indeterminate = marcados > 0 && marcados < todos.length;
    geral.addEventListener('change', () => p.aoMarcarGrupo(todos, geral.checked));
    cabecalho.append(el('div', 'spro-c spro-c-cb'));
    cabecalho.firstElementChild!.append(geral);
    for (const c of p.colunas) {
      const campo = ORDENAVEL[c];
      const i = campo ? p.ordem.findIndex((o) => o.campo === campo) : -1;
      const celulaCab = h('div', { class: `spro-c spro-th${campo ? ' spro-ordenavel' : ''}`, role: 'columnheader', ...(i >= 0 ? { 'aria-sort': p.ordem[i]!.decrescente ? 'descending' : 'ascending' } : {}) });
      if (campo) {
        const b = h('button', { type: 'button', class: 'spro-th-b', title: 'Ordenar (Shift acrescenta outro critério)', onclick: (ev: Event) => p.aoOrdenar(campo, (ev as MouseEvent).shiftKey) }, ROTULO_COLUNA[c]);
        if (i >= 0) b.append(h('span', { class: 'spro-seta-ordem' }, `${p.ordem[i]!.decrescente ? '↓' : '↑'}${p.ordem.length > 1 ? i + 1 : ''}`));
        celulaCab.append(b);
      } else celulaCab.append(ROTULO_COLUNA[c]);
      cabecalho.append(celulaCab);
    }
  }

  function linhaProcesso(proc: Processo, grupo: string): HTMLElement {
    const sel = p.selecionados.has(proc.id);
    const cb = h('input', { type: 'checkbox', class: 'spro-cb', 'aria-label': `Marcar ${proc.protocolo}`, title: proc.naPaginaAtual ? undefined : `Está na página ${proc.pagina + 1} do SEI: as ações do SEI aceitam processos de uma página por vez` });
    cb.checked = sel;
    cb.addEventListener('change', () => p.aoSelecionar(proc.id, cb.checked));
    const tr = h('div', { class: `spro-linha${sel ? ' spro-sel' : ''}${p.foco === proc.id ? ' spro-foco' : ''}${proc.urgente ? ' spro-linha-urgente' : ''}`, role: 'row', 'data-id': proc.id, 'data-grupo': grupo });
    tr.style.gridTemplateColumns = modelo();
    tr.style.height = `${ALTURA[p.densidade]}px`;
    const caixa = el('div', 'spro-c spro-c-cb');
    caixa.append(cb);
    tr.append(caixa, ...p.colunas.map((c) => celula(proc, c, p.ctx, p)));
    return tr;
  }

  function linhaGrupo(l: Extract<LinhaLista, { tipo: 'grupo' }>): HTMLElement {
    const ids = l.grupo.itens.map((x) => x.id);
    const botao = h('button', { type: 'button', class: 'spro-grupo-b', 'aria-expanded': String(!l.recolhido), onclick: () => p.aoGrupo(l.grupo.chave) },
      h('span', { class: `spro-grupo-seta${l.recolhido ? ' spro-fechado' : ''}` }, iconeGrade('seta', 14)),
      h('span', { class: 'spro-grupo-nome' }, l.grupo.rotulo),
      h('span', { class: 'spro-grupo-n' }, String(l.grupo.itens.length)));
    const linha = h('div', { class: `spro-grupo${l.grupo.tom ? ` spro-tom-${l.grupo.tom}` : ''}`, role: 'row' }, botao);
    if (ids.length) {
      const todos = ids.every((id) => p.selecionados.has(id));
      linha.append(h('button', { type: 'button', class: 'spro-link', onclick: () => p.aoMarcarGrupo(ids, !todos) }, todos ? 'Desmarcar grupo' : 'Marcar grupo'));
    }
    linha.style.height = `${ALTURA[p.densidade]}px`;
    return linha;
  }

  function desenharJanela() {
    const altura = ALTURA[p.densidade];
    const j = calcularJanela(p.linhas.length, altura, rolagem.scrollTop || 0, rolagem.clientHeight || 0);
    corpo.style.paddingTop = `${j.antes}px`;
    corpo.style.paddingBottom = `${j.depois}px`;
    corpo.replaceChildren(...p.linhas.slice(j.inicio, j.fim).map((l) => (l.tipo === 'grupo' ? linhaGrupo(l) : linhaProcesso(l.processo, l.grupo))));
    const entrada = corpo.querySelector<HTMLInputElement>('.spro-espec-input');
    if (entrada && focarEdicao) {
      focarEdicao = false;
      entrada.focus();
      entrada.setSelectionRange?.(entrada.value.length, entrada.value.length);
    } else if (entrada && entrada.getRootNode() instanceof ShadowRoot && (entrada.getRootNode() as ShadowRoot).activeElement !== entrada && focoNaEdicao) entrada.focus();
  }

  let quadro = 0;
  rolagem.addEventListener('scroll', () => {
    if (quadro) return;
    const win = rolagem.ownerDocument.defaultView;
    if (!win?.requestAnimationFrame) return desenharJanela();
    quadro = win.requestAnimationFrame(() => {
      quadro = 0;
      desenharJanela();
    });
  });

  function atualizar(novo: PropsTabela) {
    const mudouEstrutura = novo.colunas.join() !== p.colunas.join() || novo.ordem !== p.ordem || novo.selecionados !== p.selecionados;
    if (novo.editando && novo.editando !== p.editando) focarEdicao = true;
    focoNaEdicao = !!novo.editando;
    p = novo;
    const chave = `${p.colunas.join()}|${p.densidade}`;
    if (mudouEstrutura || chave !== ultimaChave) {
      desenharCabecalho();
      ultimaChave = chave;
    }
    if (!p.linhas.length) {
      corpo.style.paddingTop = corpo.style.paddingBottom = '0';
      corpo.replaceChildren(h('div', { class: 'spro-vazio' }, 'Nenhum processo corresponde ao filtro.'));
      return;
    }
    desenharJanela();
  }

  /** Rola até a linha (teclado) e devolve se existe. */
  function mostrar(id: string): boolean {
    const i = p.linhas.findIndex((l) => l.tipo === 'processo' && l.processo.id === id);
    if (i < 0) return false;
    const a = ALTURA[p.densidade];
    if (i * a < rolagem.scrollTop) rolagem.scrollTop = i * a;
    else if ((i + 1) * a > rolagem.scrollTop + rolagem.clientHeight && rolagem.clientHeight > 0) rolagem.scrollTop = (i + 1) * a - rolagem.clientHeight;
    desenharJanela();
    return true;
  }

  atualizar(inicial);
  return { el: raiz, atualizar, mostrar, rolagem };
}
