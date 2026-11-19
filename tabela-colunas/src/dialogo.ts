/**
 * Diálogo "Tabela com colunas em %": cria uma tabela nova ou ajusta a tabela onde está o cursor.
 *
 * A parte de estado (`novoEstado`, `comColunas`, `comLarguraTabela`…) é pura e testada; `montarDialogo`
 * só desenha e liga eventos. Montagem sem innerHTML (`h()` do sei-comum).
 */

import { h } from '../../sei-comum/src/ui/dom';
import {
  BORDAS,
  type Borda,
  cssDoTraco,
  type Desenho,
  desenhoPadrao,
  ESPESSURAS_PT,
  type EstiloLinha,
  MIN_DUPLA_PT,
  PREDEFINIDAS,
  tracoValido,
  caixasDasCelulas,
  ladosDasCelulas,
  regiaoDe,
} from './bordas';
import { deMarca, ehMarca, escuro, partirDoTema, type Personalizacao, pinturaPersonalizada } from './personalizar';
import type { Escolha, Leitura, PosicaoTabela, Tema } from './editor';
import {
  type Alinhamento,
  achar,
  alinhamentosDe,
  type EstiloTabela,
  estiloCabecalho,
  medidasDe,
  ROTULO_ALINHAMENTO,
  rotuloTamanho,
  tamanhoPadrao,
  tamanhos,
} from './estilos';
import {
  definirColuna,
  garantirMinimo,
  larguraTabelaValida,
  maxColunas,
  minimoColuna,
  minimoPossivel,
  moverDivisoria,
  uniformes,
} from './larguras';

export const MAX_COLUNAS = 50;
export const MAX_LINHAS = 500;

export type Estado = Escolha & { existe: boolean };

export function novoEstado(leitura?: Leitura, opcoes: { temaPadrao?: string } = {}): Estado {
  // Limpeza ligada na 1ª vez que a tabela passa por aqui (típico de tabela colada) e só se há o que tirar.
  if (leitura) return { ...leitura, larguras: leitura.larguras.slice(), limpar: !leitura.jaTratada && leitura.sujeira > 0, bordas: null };
  const colunas = 3;
  return {
    existe: false,
    linhas: 3,
    colunas,
    larguraTabela: 100,
    larguras: uniformes(colunas),
    tema: opcoes.temaPadrao ?? '',
    cabecalho: true,
    estiloCelulas: '',
    estiloCabecalho: '',
    limpar: false,
    bordas: null,
    personalizado: null,
    posicao: 'centro',
  };
}

// ---------------------------------------------------------------- modelos de texto

/** Escolha do texto das células por "modelo": tamanho × alinhamento, mais o cabeçalho centralizado. */
export interface Texto {
  /** Tabela existente começa sem mexer no texto. */
  alterar: boolean;
  tamanhoPt: number;
  alinhamento: Alinhamento;
  cabecalhoCentralizado: boolean;
}

/** Alinhamento disponível no tamanho: se o pedido não existe, o primeiro que existe. */
export function ajustarTexto(estilos: EstiloTabela[], t: Texto): Texto {
  const lista = tamanhos(estilos);
  const tamanhoPt = lista.includes(t.tamanhoPt) ? t.tamanhoPt : (tamanhoPadrao(estilos) ?? t.tamanhoPt);
  const alins = alinhamentosDe(estilos, tamanhoPt);
  const alinhamento = alins.includes(t.alinhamento) ? t.alinhamento : (alins[0] ?? t.alinhamento);
  return { ...t, tamanhoPt, alinhamento };
}

export function textoInicial(estilos: EstiloTabela[], estado: Estado): Texto {
  const padrao = tamanhoPadrao(estilos) ?? 11;
  const atual = estado.existe ? medidasDe(estilos, estado.estiloCelulas) : undefined;
  const cab = estado.existe ? medidasDe(estilos, estado.estiloCabecalho) : undefined;
  return ajustarTexto(estilos, {
    alterar: !estado.existe && estilos.length > 0,
    tamanhoPt: atual?.tamanhoPt ?? padrao,
    alinhamento: atual?.alinhamento ?? 'esquerda',
    cabecalhoCentralizado: estado.existe ? cab?.alinhamento === 'centro' : true,
  });
}

/** Estilos que o modelo escolhido grava no corpo e no cabeçalho (vazio = não mexer). */
export function estilosDoTexto(estilos: EstiloTabela[], t: Texto, comCabecalho: boolean): Pick<Escolha, 'estiloCelulas' | 'estiloCabecalho'> {
  if (!t.alterar) return { estiloCelulas: '', estiloCabecalho: '' };
  const corpo = achar(estilos, t.tamanhoPt, t.alinhamento) ?? '';
  const cab = comCabecalho && t.cabecalhoCentralizado ? estiloCabecalho(estilos, t.tamanhoPt, corpo) : corpo;
  return { estiloCelulas: corpo, estiloCabecalho: cab };
}

function inteiro(v: number, min: number, max: number, padrao: number): number {
  const n = Math.round(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : padrao;
}

export function minimoDoEstado(e: Estado): number {
  return minimoPossivel(e.colunas, e.larguraTabela);
}

/** Nova quantidade de colunas (só na tabela nova): as larguras voltam a ser iguais. */
export function comColunas(e: Estado, n: number): Estado {
  const colunas = inteiro(n, 1, MAX_COLUNAS, e.colunas);
  if (colunas === e.colunas) return e;
  return { ...e, colunas, larguras: uniformes(colunas) };
}

export function comLinhas(e: Estado, n: number): Estado {
  return { ...e, linhas: inteiro(n, 1, MAX_LINHAS, e.linhas) };
}

/** Largura da tabela mudou: o mínimo de impressão por coluna muda junto. */
export function comLarguraTabela(e: Estado, valor: number): Estado {
  const larguraTabela = larguraTabelaValida(valor);
  const novo = { ...e, larguraTabela };
  return { ...novo, larguras: garantirMinimo(e.larguras, minimoDoEstado(novo)) };
}

export function comColuna(e: Estado, i: number, valor: number): Estado {
  return { ...e, larguras: definirColuna(e.larguras, i, valor, minimoDoEstado(e)) };
}

export function comDivisoria(base: number[], e: Estado, i: number, delta: number, passo = 0.5): Estado {
  const alvo = Math.round((base[i] + delta) / passo) * passo;
  return { ...e, larguras: moverDivisoria(base, i, alvo - base[i], minimoDoEstado(e)) };
}

export function igualar(e: Estado): Estado {
  return { ...e, larguras: garantirMinimo(uniformes(e.colunas), minimoDoEstado(e)) };
}

/** Aviso de impressão: muitas colunas para a largura escolhida. */
export function avisoImpressao(e: Estado): string {
  const max = maxColunas(e.larguraTabela);
  if (e.colunas <= max) return '';
  const max100 = maxColunas(100);
  const sugestao = e.larguraTabela < 100 && e.colunas <= max100 ? ' Aumente a largura da tabela' : ' Reduza as colunas';
  return `Com ${e.colunas} colunas a tabela não cabe na página impressa: em ${fmt(e.larguraTabela)}% cabem até ${max}.${sugestao} ou use a página em paisagem.`;
}

export function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

// ---------------------------------------------------------------- desenho

const ID_CSS = 'spro-tabela-colunas-css';
const CSS = `
.spro-tc{font:13px/1.4 Arial,sans-serif;color:#333}
.spro-tc fieldset{border:1px solid #ddd;border-radius:6px;margin:0 0 10px;padding:8px 10px}
.spro-tc legend{font-weight:bold;padding:0 4px}
.spro-tc label{margin-right:12px}
.spro-tc input[type=number]{width:64px;padding:3px 5px;border:1px solid #bbb;border-radius:4px;background:#f7f7f7}
.spro-tc .spro-tc-ajuda{color:#666;font-size:12px;margin:4px 0 0}
.spro-tc .spro-tc-aviso{color:#a12;font-size:12px;margin:6px 0 0}
.spro-tc .spro-tc-aviso:empty{display:none}
.spro-tc-barra{position:relative;display:flex;height:34px;border:1px solid #888;border-radius:4px;margin:8px 0 6px;user-select:none;background:#fff}
.spro-tc-seg{flex:none;display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap;font-size:11px;color:#333;box-sizing:border-box}
.spro-tc-seg:nth-child(odd){background:#eef3f8}
.spro-tc-div{position:absolute;top:-4px;bottom:-4px;width:12px;margin-left:-6px;cursor:col-resize;z-index:2;outline:none}
.spro-tc-div::after{content:"";position:absolute;left:5px;top:0;bottom:0;width:2px;background:#1f5fa8;border-radius:1px}
.spro-tc-div:hover::after,.spro-tc-div:focus::after{background:#e3006b;width:3px;left:4px}
.spro-tc-campos{display:flex;flex-wrap:wrap;gap:6px 10px}
.spro-tc-campos label{margin:0;display:flex;align-items:center;gap:4px;font-size:12px;color:#555}
.spro-tc-campos input[type=number]{width:58px}
.spro-tc-temas{display:flex;flex-wrap:wrap;gap:8px}
.spro-tc-tema{border:2px solid transparent;border-radius:6px;padding:4px;background:#fff;cursor:pointer;line-height:0}
.spro-tc-tema[aria-pressed=true]{border-color:#1f5fa8;background:#eef3f8}
.spro-tc-tema table.table{position:relative;z-index:0;width:72px!important;height:52px!important;margin:0!important;table-layout:fixed;border-collapse:collapse;font-size:5px;line-height:5px}
.spro-tc-tema table.table td,.spro-tc-tema table.table th{min-width:0!important;padding:0!important;height:10px}
.spro-tc-tema .spro-tc-sem{display:flex;width:72px;height:52px;align-items:center;justify-content:center;font-size:11px;line-height:1.2;color:#555;border:1px dashed #999}
.spro-tc-linha{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0}
.spro-tc-linha>span:first-child{min-width:82px;color:#555}
.spro-tc-opcao{border:1px solid #bbb;border-radius:4px;background:#fff;padding:3px 9px;cursor:pointer;font:12px Arial,sans-serif;color:#333}
.spro-tc-opcao[aria-pressed=true]{border-color:#1f5fa8;background:#1f5fa8;color:#fff}
.spro-tc-opcao:disabled{opacity:.4;cursor:not-allowed}
.spro-tc-previa{border:1px solid #888;border-collapse:collapse;width:100%;table-layout:fixed;margin:8px 0 2px;font-family:Arial,sans-serif}
.spro-tc-previa td,.spro-tc-previa th{border:1px solid #888;padding:2px 4px;font-weight:normal}
.spro-tc-previa th{background:#f2f2f2;font-weight:bold}
.spro-tc-off{opacity:.45;pointer-events:none}
.spro-tc-previa-tema{border-collapse:collapse;width:100%;table-layout:fixed;margin:8px 0 2px;font:12px Arial,sans-serif}
.spro-tc-previa-tema td,.spro-tc-previa-tema th{padding:3px 6px;font-weight:normal;text-align:left;vertical-align:middle}
.spro-tc-limpeza{margin:0 0 8px;padding:6px 10px;border:1px solid #e0c97a;border-radius:6px;background:#fffbea}
.spro-tc-limpeza .spro-tc-ajuda{cursor:help}
.spro-tc-abas{display:flex;gap:2px;border-bottom:1px solid #bbb;margin:0 0 10px}
.spro-tc-aba{border:1px solid transparent;border-bottom:0;border-radius:6px 6px 0 0;background:transparent;padding:6px 14px;margin-bottom:-1px;cursor:pointer;font:13px Arial,sans-serif;color:#555}
.spro-tc-aba:hover{background:#f2f2f2}
.spro-tc-aba[aria-selected=true]{border-color:#bbb;background:#fff;color:#1f5fa8;font-weight:bold}
.spro-tc-aba:focus-visible{outline:2px solid #1f5fa8;outline-offset:-2px}
.spro-tc-painel{min-height:240px}
.spro-tc-painel:focus{outline:none}
.spro-tc-painel[hidden]{display:none}
.spro-tc-bordas{display:flex;gap:14px;align-items:flex-start}
.spro-tc-grade{position:relative;flex:none;width:132px;height:92px;margin:6px 0}
.spro-tc-fundo{position:absolute;left:8px;right:8px;top:8px;bottom:8px;background:repeating-linear-gradient(#f3f3f3 0 3px,#fff 3px 9px)}
.spro-tc-aresta{position:absolute;margin:0;padding:0;border:0;background:transparent;cursor:pointer;left:8px;right:8px;height:16px}
.spro-tc-aresta:hover,.spro-tc-aresta:focus{background:#e3006b22;outline:none}
.spro-tc-aresta.spro-tc-v{top:8px;bottom:8px;width:16px;height:auto}
.spro-tc-aresta-superior{top:0}
.spro-tc-aresta-inferior{bottom:0}
.spro-tc-aresta-horizontal{top:38px}
.spro-tc-aresta-esquerda{left:0;right:auto}
.spro-tc-aresta-direita{right:0;left:auto}
.spro-tc-aresta-vertical{left:58px;right:auto}
.spro-tc-traco{position:absolute;left:0;right:0;top:7px;height:0}
.spro-tc-v .spro-tc-traco{top:0;bottom:0;left:7px;right:auto;width:0;height:auto}
.spro-tc-cor{width:22px;height:22px;padding:0}
.spro-tc-cor[aria-pressed=true]{outline:2px solid #1f5fa8;outline-offset:1px}
.spro-tc input[type=color]{width:30px;height:24px;padding:0;border:1px solid #bbb;border-radius:4px;background:#fff;cursor:pointer}
`;

function garantirCss(doc: Document): void {
  if (doc.getElementById(ID_CSS)) return;
  const s = doc.createElement('style');
  s.id = ID_CSS;
  s.textContent = CSS;
  doc.head.append(s);
}

/**
 * Miniatura do tema com a própria classe do SEI (a folha do editor já tem as regras `.infra-doc`). O SEI
 * pinta listras e cabeçalho com `td:before` em `z-index:-1`: a tabela da miniatura abre o próprio
 * empilhamento (`position:relative; z-index:0`, no CSS acima), senão o fundo do botão cobre a pintura.
 */
function miniatura(tema?: Tema): HTMLElement {
  if (!tema) return h('span', { class: 'spro-tc-sem' }, 'Sem tema');
  const cab = tema.cabecalhos ?? {};
  const linha = (cabecalho: boolean) =>
    h('tr', {}, ...[0, 1, 2, 3].map((c) => (cabecalho || (cab.coluna && c === 0) ? h('th', {}, ' ') : h('td', {}, ' '))));
  const corpo = h('tbody', {}, ...[1, 2, 3, 4].map(() => linha(false)));
  return h(
    'table',
    { class: `table infra-doc-tabela ${tema.classeCss}` },
    cab.linha ? h('thead', {}, linha(true)) : null,
    corpo,
  );
}

export interface Contexto {
  temas: Tema[];
  /** Estilos `Tabela_*` da seção, com tamanho e alinhamento (ver estilos.ts). */
  estilos: EstiloTabela[];
  /** Tabela selecionada: colunas e linhas vêm dela e não mudam aqui. */
  existe: boolean;
  /** Itens de formatação que a limpeza tiraria (tabela existente). */
  sujeira?: number;
  /** Células selecionadas (mais de uma permite bordas só nelas). */
  selecionadas?: number;
  /** O editor tem o alinhamento da tabela na página (TableProperties). */
  posicao?: boolean;
  /** Esquerda/direita só flutuam (CK5 antigo): o texto de fora corre ao lado da tabela. */
  posicaoFlutua?: boolean;
}

/**
 * Desenha o conteúdo do diálogo e devolve `ler()` com a escolha atual. `aoMudar` é para testes.
 */
export function montarDialogo(
  doc: Document,
  inicial: Estado,
  ctx: Contexto,
  aoMudar?: (e: Estado) => void,
): { raiz: HTMLElement; ler: () => Estado } {
  garantirCss(doc);
  let estado = inicial;

  const campoLinhas = h('input', { type: 'number', min: '1', max: String(MAX_LINHAS), value: String(estado.linhas) });
  const campoColunas = h('input', { type: 'number', min: '1', max: String(MAX_COLUNAS), value: String(estado.colunas) });
  const campoLargura = h('input', { type: 'number', min: '10', max: '100', step: '1', value: String(estado.larguraTabela) });
  const barra = h('div', { class: 'spro-tc-barra', 'aria-label': 'Larguras das colunas' });
  const campos = h('div', { class: 'spro-tc-campos' });
  const minimoTexto = h('p', { class: 'spro-tc-ajuda' });
  const aviso = h('p', { class: 'spro-tc-aviso', role: 'status' });
  const temas = h('div', { class: 'spro-tc-temas ck ck-content infra-doc', role: 'group', 'aria-label': 'Tema da tabela' });
  const cabecalho = h('input', { type: 'checkbox', id: 'spro-tc-cab' });
  cabecalho.checked = estado.cabecalho;

  // Texto das células por modelo (tamanho × alinhamento). Tabela existente começa sem mexer no texto.
  let texto = textoInicial(ctx.estilos, estado);
  const atual = (): Estado => ({
    ...estado,
    ...estilosDoTexto(ctx.estilos, texto, estado.cabecalho),
    bordas: desenhar && (!estado.tema || pers) ? { ...desenho, ligadas: { ...desenho.ligadas } } : null,
    personalizado: pers ? { ...pers } : null,
    posicao: ctx.posicao ? estado.posicao || 'centro' : '',
  });
  const avisar = () => aoMudar?.(atual());

  const alterarTexto = h('input', { type: 'checkbox', id: 'spro-tc-alterar' });
  alterarTexto.checked = texto.alterar;
  const cabCentro = h('input', { type: 'checkbox', id: 'spro-tc-cab-centro' });
  cabCentro.checked = texto.cabecalhoCentralizado;
  const linhaTamanhos = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Tamanho da letra' });
  const linhaAlinhamentos = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Alinhamento' });
  const previa = h('table', { class: 'spro-tc-previa' });
  const nomeEstilo = h('p', { class: 'spro-tc-ajuda' });
  const controlesTexto = h('div', {}, linhaTamanhos, linhaAlinhamentos, h('label', { for: 'spro-tc-cab-centro' }, cabCentro, ' Cabeçalho centralizado'), previa, nomeEstilo);

  function opcao(rotulo: string, ativo: boolean, habilitado: boolean, acao: () => void, dica?: string): HTMLButtonElement {
    const b = h('button', { type: 'button', class: 'spro-tc-opcao', 'aria-pressed': String(ativo), disabled: !habilitado, title: dica });
    b.textContent = rotulo;
    b.addEventListener('click', acao);
    return b;
  }

  // ------------------------------------------------ posição na página
  const linhaPosicao = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Posição na página' });
  const ajudaPosicao = h('p', { class: 'spro-tc-ajuda' });
  const POSICOES: Array<[PosicaoTabela, string]> = [
    ['esquerda', 'Esquerda'],
    ['centro', 'Centralizada'],
    ['direita', 'Direita'],
  ];
  function desenharPosicao(): void {
    const atualPos = estado.posicao || 'centro';
    linhaPosicao.replaceChildren(
      h('span', {}, 'Posição'),
      ...POSICOES.map(([valor, rotulo]) =>
        opcao(rotulo, atualPos === valor, true, () => {
          estado = { ...estado, posicao: valor };
          desenharPosicao();
          avisar();
        }),
      ),
    );
    const partes: string[] = [];
    if (estado.larguraTabela >= 100) partes.push('Com 100% a tabela ocupa a linha toda: a posição só aparece com largura menor.');
    if (ctx.posicaoFlutua && atualPos !== 'centro') partes.push('Neste editor, à esquerda ou à direita o texto de fora corre ao lado da tabela.');
    ajudaPosicao.textContent = partes.join(' ');
    ajudaPosicao.hidden = !partes.length;
  }

  function mudarTexto(novo: Partial<Texto>): void {
    texto = ajustarTexto(ctx.estilos, { ...texto, ...novo });
    desenharTexto();
    avisar();
  }

  function desenharTexto(): void {
    const padrao = tamanhoPadrao(ctx.estilos);
    linhaTamanhos.replaceChildren(
      h('span', {}, 'Tamanho'),
      ...tamanhos(ctx.estilos).map((pt) => opcao(rotuloTamanho(pt, padrao), pt === texto.tamanhoPt, true, () => mudarTexto({ tamanhoPt: pt }))),
    );
    const noTamanho = alinhamentosDe(ctx.estilos, texto.tamanhoPt);
    const todos = (['esquerda', 'centro', 'direita', 'justificado'] as Alinhamento[]).filter((a) => ctx.estilos.some((e) => e.alinhamento === a));
    linhaAlinhamentos.replaceChildren(
      h('span', {}, 'Alinhamento'),
      ...todos.map((a) =>
        opcao(
          ROTULO_ALINHAMENTO[a],
          a === texto.alinhamento,
          noTamanho.includes(a),
          () => mudarTexto({ alinhamento: a }),
          noTamanho.includes(a) ? undefined : `Não há estilo de ${fmt(texto.tamanhoPt)} pt com esse alinhamento`,
        ),
      ),
    );
    const { estiloCelulas, estiloCabecalho: doCab } = estilosDoTexto(ctx.estilos, { ...texto, alterar: true }, estado.cabecalho);
    const medCorpo = ctx.estilos.find((e) => e.nome === estiloCelulas);
    const medCab = ctx.estilos.find((e) => e.nome === doCab) ?? medCorpo;
    const css = (m?: EstiloTabela) =>
      m ? `font-size:${m.tamanhoPt}pt;text-align:${({ esquerda: 'left', centro: 'center', direita: 'right', justificado: 'justify' } as const)[m.alinhamento]}` : '';
    const corpoPrevia = h('tbody', {}, h('tr', {}, h('td', { style: css(medCorpo) }, 'Texto da célula'), h('td', { style: css(medCorpo) }, '1.234,56')));
    if (estado.cabecalho) {
      const cabPrevia = h('thead', {}, h('tr', {}, h('th', { style: css(medCab) }, 'Título'), h('th', { style: css(medCab) }, 'Valor')));
      previa.replaceChildren(cabPrevia, corpoPrevia);
    } else previa.replaceChildren(corpoPrevia);
    nomeEstilo.textContent = estiloCelulas
      ? `Estilo do SEI: ${estiloCelulas}${estado.cabecalho && doCab !== estiloCelulas ? `; cabeçalho: ${doCab}` : ''}.`
      : '';
    cabCentro.disabled = !estado.cabecalho;
    controlesTexto.classList.toggle('spro-tc-off', !texto.alterar);
  }

  alterarTexto.addEventListener('change', () => mudarTexto({ alterar: alterarTexto.checked }));
  cabCentro.addEventListener('change', () => mudarTexto({ cabecalhoCentralizado: cabCentro.checked }));

  // ------------------------------------------------ limpeza
  const limparCx = h('input', { type: 'checkbox', id: 'spro-tc-limpar' });
  limparCx.checked = estado.limpar;
  limparCx.addEventListener('change', () => {
    estado = { ...estado, limpar: limparCx.checked };
    avisar();
  });

  // ------------------------------------------------ bordas
  let desenho: Desenho = { ...desenhoPadrao(), onde: (ctx.selecionadas ?? 0) > 1 ? 'selecao' : 'tabela' };
  // Tabela nova sem tema já sai com a grade gravada (o "Gerar PDF" não desenha a grade da folha do SEI).
  let desenhar = !ctx.existe;
  const desenharCx = h('input', { type: 'checkbox', id: 'spro-tc-bordas' });
  const grade = h('div', { class: 'spro-tc-grade', role: 'group', 'aria-label': 'Clique nas linhas para ligar ou desligar cada borda' });
  const linhaOnde = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Onde desenhar' });
  const linhaPredef = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Bordas prontas' });
  const linhaEstilo = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Estilo da linha' });
  const linhaEspessura = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Espessura' });
  const linhaCor = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Cor' });
  const ajudaBordas = h('p', { class: 'spro-tc-ajuda' });
  const controlesBordas = h(
    'div',
    {},
    linhaOnde,
    linhaPredef,
    h('div', { class: 'spro-tc-bordas' }, grade, h('div', {}, linhaEstilo, linhaEspessura, linhaCor)),
  );

  const ROTULO_BORDA: Record<Borda, string> = {
    superior: 'Borda superior',
    inferior: 'Borda inferior',
    esquerda: 'Borda esquerda',
    direita: 'Borda direita',
    horizontal: 'Bordas horizontais internas',
    vertical: 'Bordas verticais internas',
  };
  const ESTILOS_LINHA: Array<[EstiloLinha, string]> = [
    ['solid', 'Contínua'],
    ['dashed', 'Tracejada'],
    ['dotted', 'Pontilhada'],
    ['double', 'Dupla'],
  ];
  const CORES: Array<[string, string]> = [
    ['#000000', 'Preto'],
    ['#595959', 'Cinza escuro'],
    ['#a6a6a6', 'Cinza claro'],
    ['#1f4e79', 'Azul escuro'],
  ];
  const corLivre = h('input', { type: 'color', value: desenho.traco.cor, title: 'Outra cor', 'aria-label': 'Outra cor' });
  corLivre.addEventListener('input', () => mudarDesenho({ traco: { ...desenho.traco, cor: corLivre.value } }));
  desenharCx.addEventListener('change', () => {
    desenhar = desenharCx.checked;
    desenharPainelBordas();
    desenharPreviaTema();
    avisar();
  });

  // ------------------------------------------------ tema personalizado
  let pers: Personalizacao | null = inicial.personalizado ? { ...inicial.personalizado } : null;
  const persCx = h('input', { type: 'checkbox', id: 'spro-tc-pers' });
  const linhaCorCab = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Cor do cabeçalho' });
  const linhaCorListra = h('div', { class: 'spro-tc-linha', role: 'group', 'aria-label': 'Cor das listras' });
  const faseCx = h('input', { type: 'checkbox', id: 'spro-tc-fase' });
  const colunaCx = h('input', { type: 'checkbox', id: 'spro-tc-colcab' });
  const previaTema = h('table', { class: 'spro-tc-previa-tema' });
  const controlesPers = h(
    'div',
    {},
    linhaCorCab,
    linhaCorListra,
    h(
      'p',
      {},
      h('label', { for: 'spro-tc-fase' }, faseCx, ' Listra começa na 1ª linha do corpo'),
      ' ',
      h('label', { for: 'spro-tc-colcab' }, colunaCx, ' 1ª coluna como cabeçalho'),
    ),
    previaTema,
  );
  const CORES_CAB: Array<[string, string]> = [
    ['', 'Sem cor'],
    ['#e5e5e5', 'Cinza claro'],
    ['#999999', 'Cinza'],
    ['#000000', 'Preto'],
    ['#1f4e79', 'Azul escuro'],
    ['#dbe5f1', 'Azul claro'],
    ['#375623', 'Verde escuro'],
    ['#e2efda', 'Verde claro'],
    ['#fff2cc', 'Amarelo claro'],
  ];
  const CORES_LISTRA: Array<[string, string]> = [
    ['', 'Sem listras'],
    ['#f2f2f2', 'Cinza bem claro'],
    ['#e5e5e5', 'Cinza claro'],
    ['#dbe5f1', 'Azul claro'],
    ['#e2efda', 'Verde claro'],
    ['#fff2cc', 'Amarelo claro'],
    ['#fbe4d5', 'Laranja claro'],
  ];
  const corCabLivre = h('input', { type: 'color', title: 'Outra cor', 'aria-label': 'Outra cor do cabeçalho' });
  const corListraLivre = h('input', { type: 'color', title: 'Outra cor', 'aria-label': 'Outra cor das listras' });
  corCabLivre.addEventListener('input', () => mudarPers({ cabecalhoCor: corCabLivre.value }));
  corListraLivre.addEventListener('input', () => mudarPers({ listrasCor: corListraLivre.value }));
  faseCx.addEventListener('change', () => mudarPers({ primeiroListrado: faseCx.checked }));
  colunaCx.addEventListener('change', () => mudarPers({ colunaCabecalho: colunaCx.checked }));

  /** Começa (ou recomeça, ao trocar de tema) pelo visual do tema escolhido, com as bordas dele. */
  function partir(): void {
    const t = ctx.temas.find((x) => x.classeCss === estado.tema);
    const { p, bordas } = partirDoTema(estado.tema, t?.cabecalhos ?? {}, estado.cabecalho);
    pers = p;
    desenho = { ...bordas, onde: desenho.onde };
    desenhar = true;
  }
  persCx.addEventListener('change', () => {
    if (persCx.checked) partir();
    else {
      pers = null;
      if (estado.tema) desenhar = false;
    }
    desenharPers();
    desenharPainelBordas();
    avisar();
  });

  function mudarPers(novo: Partial<Personalizacao>): void {
    if (!pers) return;
    pers = { ...pers, ...novo };
    desenharPers();
    avisar();
  }

  function amostra(cor: string, nome: string, ativo: boolean, acao: () => void): HTMLButtonElement {
    const b = opcao(cor ? '' : nome, ativo, true, acao, nome);
    b.setAttribute('aria-label', nome);
    if (cor) {
      b.classList.add('spro-tc-cor');
      b.style.background = cor;
    }
    return b;
  }

  /** Prévia: cabeçalho e 3 linhas do corpo, com a 1ª célula da 2ª e da 3ª mescladas (zebra por grupo). */
  function desenharPreviaTema(): void {
    if (!pers) {
      previaTema.replaceChildren();
      return;
    }
    const cab = estado.cabecalho ? 1 : 0;
    const um = { rowspan: 1, colspan: 1 };
    const grade = [...(cab ? [[um, um, um]] : []), [um, um, um], [{ rowspan: 2, colspan: 1 }, um, um], [um, um]];
    const textos = [...(cab ? [['Título', 'Valor', 'Data']] : []), ['Item 1', '10', '01/01'], ['Grupo', '20', '02/01'], ['30', '03/01']];
    const pintura = pinturaPersonalizada(grade, cab, pers.colunaCabecalho ? 1 : 0, pers);
    const caixas = caixasDasCelulas(grade);
    const regiao = regiaoDe(caixas);
    const lados = desenhar && regiao ? ladosDasCelulas(caixas, regiao, desenho.ligadas) : null;
    const traco = cssDoTraco(desenho.traco);
    const textoBranco = escuro(pers.cabecalhoCor);
    previaTema.replaceChildren(
      ...grade.map((linha, r) =>
        h(
          'tr',
          {},
          ...linha.map((cel, i) => {
            const pin = pintura[r][i];
            const fundo = pin.fundo ? (ehMarca(pin.fundo) ? deMarca(pin.fundo) : pin.fundo) : '';
            const estilo = [
              fundo ? `background:${fundo}` : '',
              pin.cabecalho && textoBranco ? 'color:#fff' : '',
              ...(['top', 'right', 'bottom', 'left'] as const).map((l) => (lados ? `border-${l}:${lados[r][i][l] ? traco : 'none'}` : '')),
            ]
              .filter(Boolean)
              .join(';');
            return h(pin.cabecalho ? 'th' : 'td', { style: estilo, rowspan: cel.rowspan > 1 ? String(cel.rowspan) : undefined }, textos[r]?.[i] ?? '');
          }),
        ),
      ),
    );
  }

  function desenharPers(): void {
    persCx.checked = !!pers;
    controlesPers.hidden = !pers;
    if (!pers) return;
    const atualCab = pers.cabecalhoCor;
    const atualListra = pers.listrasCor;
    linhaCorCab.replaceChildren(
      h('span', {}, 'Cabeçalho'),
      ...CORES_CAB.map(([cor, nome]) => amostra(cor, nome, atualCab === cor, () => mudarPers({ cabecalhoCor: cor }))),
      corCabLivre,
    );
    linhaCorListra.replaceChildren(
      h('span', {}, 'Listras'),
      ...CORES_LISTRA.map(([cor, nome]) => amostra(cor, nome, atualListra === cor, () => mudarPers({ listrasCor: cor }))),
      corListraLivre,
    );
    corCabLivre.value = atualCab || '#e5e5e5';
    corListraLivre.value = atualListra || '#e5e5e5';
    faseCx.checked = pers.primeiroListrado;
    faseCx.disabled = !atualListra;
    colunaCx.checked = pers.colunaCabecalho;
    desenharPreviaTema();
  }

  function mudarDesenho(novo: Partial<Desenho>): void {
    desenho = { ...desenho, ...novo, traco: tracoValido({ ...desenho.traco, ...(novo.traco ?? {}) }) };
    desenharPainelBordas();
    desenharPreviaTema();
    avisar();
  }

  function aresta(b: Borda): HTMLElement {
    const ligada = desenho.ligadas[b];
    const vertical = b === 'esquerda' || b === 'direita' || b === 'vertical';
    const traco = h('span', { class: 'spro-tc-traco' });
    traco.style.setProperty(vertical ? 'border-left' : 'border-top', ligada ? cssDoTraco(desenho.traco) : '1px dashed #c8c8c8');
    const botao = h('button', {
      type: 'button',
      class: `spro-tc-aresta spro-tc-aresta-${b}${vertical ? ' spro-tc-v' : ''}`,
      'aria-pressed': String(ligada),
      'aria-label': ROTULO_BORDA[b],
      title: ROTULO_BORDA[b],
    }, traco);
    botao.addEventListener('click', () => mudarDesenho({ ligadas: { ...desenho.ligadas, [b]: !ligada } }));
    return botao;
  }

  function desenharPainelBordas(): void {
    const comTema = !!estado.tema && !pers;
    desenharCx.checked = desenhar && !comTema;
    desenharCx.disabled = comTema;
    const n = ctx.selecionadas ?? 0;
    linhaOnde.replaceChildren(
      ...(n > 1
        ? [
            h('span', {}, 'Aplicar em'),
            opcao(`${n} células selecionadas`, desenho.onde === 'selecao', true, () => mudarDesenho({ onde: 'selecao' })),
            opcao('Toda a tabela', desenho.onde === 'tabela', true, () => mudarDesenho({ onde: 'tabela' })),
          ]
        : []),
    );
    linhaPredef.replaceChildren(
      h('span', {}, 'Prontas'),
      ...(
        [
          ['todas', 'Todas'],
          ['externas', 'Externas'],
          ['internas', 'Internas'],
          ['nenhuma', 'Nenhuma'],
        ] as const
      ).map(([k, rotulo]) =>
        opcao(rotulo, BORDAS.every((b) => desenho.ligadas[b] === PREDEFINIDAS[k][b]), true, () => mudarDesenho({ ligadas: { ...PREDEFINIDAS[k] } })),
      ),
    );
    grade.replaceChildren(h('span', { class: 'spro-tc-fundo' }), ...BORDAS.map(aresta));
    linhaEstilo.replaceChildren(
      h('span', {}, 'Linha'),
      ...ESTILOS_LINHA.map(([v, rotulo]) => opcao(rotulo, desenho.traco.estilo === v, true, () => mudarDesenho({ traco: { ...desenho.traco, estilo: v } }))),
    );
    linhaEspessura.replaceChildren(
      h('span', {}, 'Espessura'),
      ...ESPESSURAS_PT.map((pt) => {
        const cabe = desenho.traco.estilo !== 'double' || pt >= MIN_DUPLA_PT;
        return opcao(
          `${fmt(pt)} pt`,
          desenho.traco.larguraPt === pt,
          cabe,
          () => mudarDesenho({ traco: { ...desenho.traco, larguraPt: pt } }),
          cabe ? undefined : `A linha dupla precisa de pelo menos ${fmt(MIN_DUPLA_PT)} pt`,
        );
      }),
    );
    corLivre.value = desenho.traco.cor;
    linhaCor.replaceChildren(
      h('span', {}, 'Cor'),
      ...CORES.map(([cor, nome]) => {
        const b = opcao('', desenho.traco.cor === cor, true, () => mudarDesenho({ traco: { ...desenho.traco, cor } }), nome);
        b.classList.add('spro-tc-cor');
        b.setAttribute('aria-label', nome);
        b.style.background = cor;
        return b;
      }),
      corLivre,
    );
    controlesBordas.classList.toggle('spro-tc-off', !desenhar || comTema);
    ajudaBordas.textContent = comTema
      ? 'Os temas do SEI desenham as próprias bordas. Para mudar, marque "Personalizar cores e bordas" na aba Tema (ou escolha "Sem tema").'
      : 'Clique nas linhas do quadro para ligar ou desligar cada borda. Gravadas em cada célula, aparecem no editor, na impressão e no "Gerar PDF" do SEI (que não mostra a grade padrão).';
  }

  const mudar = (novo: Estado, origem?: HTMLElement) => {
    estado = novo;
    desenharColunas(origem);
    avisar();
  };

  function desenharColunas(origem?: HTMLElement): void {
    const minimo = minimoDoEstado(estado);
    // Barra: um segmento por coluna e uma divisória arrastável entre cada par. Com a mesma quantidade de
    // colunas os elementos são reaproveitados: recriar a divisória no meio do arrasto perdia o ponteiro.
    if (barra.querySelectorAll('.spro-tc-seg').length !== estado.colunas) {
      barra.replaceChildren(...estado.larguras.map(() => h('div', { class: 'spro-tc-seg' })));
      for (let i = 0; i < estado.colunas - 1; i++) {
        const div = h('div', {
          class: 'spro-tc-div',
          tabindex: '0',
          role: 'separator',
          'aria-orientation': 'vertical',
          'aria-label': `Divisória entre as colunas ${i + 1} e ${i + 2}`,
        });
        ligarDivisoria(div, i);
        barra.append(div);
      }
    }
    const segmentos = barra.querySelectorAll<HTMLElement>('.spro-tc-seg');
    const divisorias = barra.querySelectorAll<HTMLElement>('.spro-tc-div');
    let acumulado = 0;
    estado.larguras.forEach((v, i) => {
      segmentos[i].style.width = `${v}%`;
      segmentos[i].textContent = `${fmt(v)}%`;
      acumulado += v;
      if (divisorias[i]) {
        divisorias[i].style.left = `${acumulado}%`;
        divisorias[i].setAttribute('aria-valuenow', String(v));
      }
    });
    // Campos: só redesenha os que o usuário não está editando.
    if (campos.childElementCount !== estado.colunas) {
      campos.replaceChildren(
        ...estado.larguras.map((_, i) => {
          const c = h('input', { type: 'number', min: '1', max: '100', step: '0.5', 'data-col': String(i) });
          c.addEventListener('change', () => mudar(comColuna(estado, i, Number.parseFloat(c.value)), c));
          return h('label', {}, `${i + 1}:`, c, '%');
        }),
      );
    }
    campos.querySelectorAll('input').forEach((c, i) => {
      if (c !== origem || Number.parseFloat(c.value) !== estado.larguras[i]) c.value = String(estado.larguras[i]);
    });
    minimoTexto.textContent = `Soma: 100%. Menor coluna que cabe na impressão: ${fmt(minimoColuna(estado.larguraTabela))}% da tabela${minimo < minimoColuna(estado.larguraTabela) ? ' (não dá com tantas colunas)' : ''}.`;
    aviso.textContent = avisoImpressao(estado);
  }

  function ligarDivisoria(div: HTMLElement, i: number): void {
    div.addEventListener('pointerdown', (ev: PointerEvent) => {
      ev.preventDefault();
      const base = estado.larguras.slice();
      const largura = barra.getBoundingClientRect().width || 1;
      const x0 = ev.clientX;
      div.setPointerCapture?.(ev.pointerId);
      const mover = (m: PointerEvent) => mudar(comDivisoria(base, estado, i, ((m.clientX - x0) / largura) * 100));
      const soltar = () => {
        div.removeEventListener('pointermove', mover);
        div.removeEventListener('pointerup', soltar);
        div.removeEventListener('pointercancel', soltar);
      };
      div.addEventListener('pointermove', mover);
      div.addEventListener('pointerup', soltar);
      div.addEventListener('pointercancel', soltar);
    });
    div.addEventListener('keydown', (ev: KeyboardEvent) => {
      const passo = ev.shiftKey ? 5 : 0.5;
      const delta = ev.key === 'ArrowLeft' ? -passo : ev.key === 'ArrowRight' ? passo : 0;
      if (!delta) return;
      ev.preventDefault();
      mudar(comDivisoria(estado.larguras, estado, i, delta, 0.5));
    });
  }

  function desenharTemas(): void {
    const opcoes: Array<Tema | undefined> = [undefined, ...ctx.temas];
    temas.replaceChildren(
      ...opcoes.map((t) => {
        const valor = t?.classeCss ?? '';
        const b = h('button', {
          type: 'button',
          class: 'spro-tc-tema',
          title: t ? t.classeCss.replace(/^infra-doc-tabela__/, 'Tema ') : 'Sem tema',
          'aria-pressed': String(estado.tema === valor),
        }, miniatura(t));
        b.addEventListener('click', () => {
          // Todo tema do SEI tem linha de cabeçalho: escolher um tema liga o cabeçalho, como no SEI.
          const cab = t?.cabecalhos?.linha ? true : estado.cabecalho;
          cabecalho.checked = cab;
          estado = { ...estado, tema: valor, cabecalho: cab };
          if (pers) partir();
          desenharTemas();
          desenharPers();
          desenharTexto();
          desenharPainelBordas();
          avisar();
        });
        return b;
      }),
    );
  }

  campoLinhas.addEventListener('change', () => {
    estado = comLinhas(estado, Number.parseFloat(campoLinhas.value));
    campoLinhas.value = String(estado.linhas);
    avisar();
  });
  campoColunas.addEventListener('change', () => {
    mudar(comColunas(estado, Number.parseFloat(campoColunas.value)));
    campoColunas.value = String(estado.colunas);
  });
  campoLargura.addEventListener('change', () => {
    mudar(comLarguraTabela(estado, Number.parseFloat(campoLargura.value)));
    campoLargura.value = String(estado.larguraTabela);
    desenharPosicao();
  });
  cabecalho.addEventListener('change', () => {
    estado = { ...estado, cabecalho: cabecalho.checked };
    desenharTexto();
    avisar();
  });

  const igualarBtn = h('button', { type: 'button', class: 'spro-tc-igualar' }, 'Colunas iguais');
  igualarBtn.addEventListener('click', () => mudar(igualar(estado)));

  const secao = (titulo: string, ...filhos: Array<Node | string | null>) => h('fieldset', {}, h('legend', {}, titulo), ...filhos);

  const abas: Array<{ id: string; rotulo: string; conteudo: HTMLElement }> = [
    {
      id: 'colunas',
      rotulo: 'Tamanho e colunas',
      conteudo: h(
        'div',
        {},
        ctx.existe
          ? h('p', { class: 'spro-tc-ajuda' }, `Tabela selecionada: ${estado.colunas} colunas e ${estado.linhas} linhas. Para incluir ou excluir colunas, use a barra de tabela do editor.`)
          : secao('Tamanho', h('label', {}, 'Linhas ', campoLinhas), h('label', {}, 'Colunas ', campoColunas)),
        secao(
          'Largura',
          h('label', {}, 'Tabela ', campoLargura, ' % da largura do texto'),
          h('p', { class: 'spro-tc-ajuda' }, '100% vai de margem a margem. A largura acompanha a página na tela, no PDF e na impressão.'),
          ctx.posicao ? linhaPosicao : null,
          ctx.posicao ? ajudaPosicao : null,
        ),
        secao('Colunas (% da tabela)', igualarBtn, barra, campos, minimoTexto, aviso),
      ),
    },
    ...(ctx.temas.length
      ? [
          {
            id: 'tema',
            rotulo: 'Tema',
            conteudo: h(
              'div',
              {},
              secao(
                'Tema do SEI',
                temas,
                h('p', { class: 'spro-tc-ajuda' }, 'Temas zebrados: quando a 1ª célula da linha está mesclada com as de baixo, todas essas linhas ficam com a mesma cor.'),
              ),
              secao(
                'Personalizar',
                h('label', { for: 'spro-tc-pers' }, persCx, ' Personalizar cores e bordas'),
                h(
                  'p',
                  { class: 'spro-tc-ajuda' },
                  'Parte do tema escolhido (ou do zero, sem tema). Cores e bordas ficam gravadas em cada célula, no lugar da classe do tema: as bordas se ajustam na aba Bordas, e sai igual na tela, na impressão e no "Gerar PDF".',
                ),
                controlesPers,
              ),
            ),
          },
        ]
      : []),
    {
      id: 'bordas',
      rotulo: 'Bordas',
      conteudo: h('div', {}, secao('Bordas', h('label', { for: 'spro-tc-bordas' }, desenharCx, ' Desenhar bordas'), controlesBordas, ajudaBordas)),
    },
    {
      id: 'texto',
      rotulo: 'Texto',
      conteudo: h(
        'div',
        {},
        secao(
          'Texto das células',
          h('label', { for: 'spro-tc-cab' }, cabecalho, ' Primeira linha como cabeçalho (repete em cada página impressa)'),
          ctx.estilos.length
            ? h(
                'div',
                {},
                estado.existe ? h('p', {}, h('label', { for: 'spro-tc-alterar' }, alterarTexto, ' Alterar o texto das células')) : null,
                controlesTexto,
              )
            : h('p', { class: 'spro-tc-ajuda' }, 'Esta parte do documento não tem estilos de tabela do órgão.'),
        ),
      ),
    },
  ];

  // Abas (padrão WAI-ARIA): setas trocam de aba, Home/End vão às pontas.
  const listaAbas = h('div', { class: 'spro-tc-abas', role: 'tablist', 'aria-label': 'Partes da tabela' });
  const botoesAba = abas.map((a, i) => {
    const b = h('button', {
      type: 'button',
      role: 'tab',
      id: `spro-tc-aba-${a.id}`,
      class: 'spro-tc-aba',
      'aria-controls': `spro-tc-painel-${a.id}`,
      'aria-selected': String(i === 0),
      tabindex: i === 0 ? '0' : '-1',
    });
    b.textContent = a.rotulo;
    b.addEventListener('click', () => mostrarAba(i));
    b.addEventListener('keydown', (ev: KeyboardEvent) => {
      const n = abas.length;
      const alvo = ev.key === 'ArrowRight' ? (i + 1) % n : ev.key === 'ArrowLeft' ? (i - 1 + n) % n : ev.key === 'Home' ? 0 : ev.key === 'End' ? n - 1 : -1;
      if (alvo < 0) return;
      ev.preventDefault();
      mostrarAba(alvo);
      botoesAba[alvo].focus();
    });
    return b;
  });
  listaAbas.append(...botoesAba);
  const paineis = abas.map((a, i) => {
    const p = h('div', { role: 'tabpanel', id: `spro-tc-painel-${a.id}`, class: 'spro-tc-painel', 'aria-labelledby': `spro-tc-aba-${a.id}`, tabindex: '0' }, a.conteudo);
    p.hidden = i !== 0;
    return p;
  });
  function mostrarAba(i: number): void {
    botoesAba.forEach((b, j) => {
      b.setAttribute('aria-selected', String(i === j));
      b.setAttribute('tabindex', i === j ? '0' : '-1');
    });
    paineis.forEach((p, j) => {
      p.hidden = i !== j;
    });
  }

  const raiz = h(
    'div',
    { class: 'spro-tc' },
    ctx.existe
      ? h(
          'div',
          { class: 'spro-tc-limpeza' },
          h('label', { for: 'spro-tc-limpar' }, limparCx, ' Limpar a formatação antes de aplicar'),
          h(
            'span',
            {
              class: 'spro-tc-ajuda',
              title: 'Sai: fontes, cores, fundos, bordas, espaçamentos, alturas e alinhamentos fixos, estilos e classes do HTML colado. Ficam: o texto, negrito, itálico, sublinhado, links, mesclagens e o estilo do SEI.',
            },
            ctx.sujeira ? ` (${ctx.sujeira} ${ctx.sujeira === 1 ? 'item' : 'itens'} de formatação encontrados)` : ' (nenhuma formatação extra encontrada)',
          ),
        )
      : null,
    listaAbas,
    ...paineis,
  );

  desenharColunas();
  desenharTemas();
  desenharTexto();
  desenharPainelBordas();
  desenharPers();
  desenharPosicao();
  return { raiz, ler: atual };
}
