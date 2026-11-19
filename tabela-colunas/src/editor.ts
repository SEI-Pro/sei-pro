/**
 * Leitura e gravação da tabela no CKEditor 5 do SEI 5.
 *
 * Tudo passa pelo MODEL e pelos comandos que o próprio editor já tem, nunca pelo DOM (no CK5 o DOM é só
 * a vista: mexer nele não é salvo):
 * - `insertTable` cria a tabela na posição do cursor;
 * - `temaTabela` (plugin TemaTabela do SEI) aplica o tema `infra-doc-tabela__*`, como o botão "Tema da
 *   tabela" da barra de tabela;
 * - `resizeColumnWidths` (TableColumnResize) grava a largura da tabela e das colunas, o mesmo caminho das
 *   alças de arrastar. Sai `<table style="width:X%">` + `<colgroup><col style="width:Y%">`.
 * Tudo dentro de um só `model.change`: um Ctrl+Z desfaz a operação inteira.
 */

import {
  deMedidasDaTela,
  deMedidasDoEditor,
  larguraTabelaValida,
  lerPorcentagem,
  normalizar,
  paraEditor,
  uniformes,
} from './larguras';
import { MARCAS, pinturaZebra } from './zebra';
import { BRANCO_HEX, ehMarca, escuro, hexValido, lerListras, type Personalizacao, pinturaPersonalizada } from './personalizar';
import { caixasDasCelulas, type Desenho, LADOS, ladosDasCelulas, mesclarLados, regiaoDe, valoresDosLados } from './bordas';

// O CKEditor 5 do SEI não publica tipos: a superfície usada aqui é pequena e checada em tempo de execução.
// biome-ignore lint/suspicious/noExplicitAny: API do CKEditor sem tipos
type Qualquer = any;
export type Editor = Qualquer;
export type ElementoModel = Qualquer;

export interface Tema {
  classeCss: string;
  cabecalhos?: { linha?: boolean; coluna?: boolean };
}

export interface Escolha {
  linhas: number;
  colunas: number;
  /** % da largura do texto. */
  larguraTabela: number;
  /** % da tabela, somando 100. */
  larguras: number[];
  /** Classe `infra-doc-tabela__*`; vazio = sem tema. */
  tema: string;
  cabecalho: boolean;
  /** Estilo `Tabela_*` para os parágrafos das células; vazio = não mexer. */
  estiloCelulas: string;
  /** Estilo das linhas de cabeçalho; vazio = o mesmo das células. */
  estiloCabecalho: string;
  /** Tirar a formatação colada antes de aplicar (ver `sujeiraDaTabela`). */
  limpar: boolean;
  /** Bordas a desenhar; `null` = não mexer. Só sem tema (o tema do SEI força as bordas dele). */
  bordas: Desenho | null;
  /** Tema como ponto de partida, gravado célula a célula com estas cores; `null` = tema do SEI como é. */
  personalizado: Personalizacao | null;
  /** Posição da tabela na página; vazio = não mexer (editor sem a propriedade de alinhamento da tabela). */
  posicao: PosicaoTabela | '';
}

export type PosicaoTabela = 'esquerda' | 'centro' | 'direita';

export interface Leitura extends Escolha {
  existe: boolean;
  /** Itens de formatação que a limpeza tiraria. */
  sujeira: number;
  /** Já passou por esta ferramenta (tem o `word-wrap` que ela grava). */
  jaTratada: boolean;
}

const ATRIBUTO_TEMA = 'temaTabela';
const ATRIBUTO_ESTILO = 'estilo';
/** Alinhamento da tabela do CK5 (TableProperties), o mesmo do botão "Propriedades da tabela" do SEI. */
const ATRIBUTO_POSICAO = 'tableAlignment';

function plugin(editor: Editor, nome: string): Qualquer {
  try {
    return editor?.plugins?.has(nome) ? editor.plugins.get(nome) : null;
  } catch {
    return null;
  }
}

export function ehCk5(editor: Editor): boolean {
  return !!(editor?.model && editor.editing && editor.conversion);
}

export function tabelaDaSelecao(editor: Editor): ElementoModel | null {
  const sel = editor.model.document.selection;
  const el = sel.getSelectedElement();
  if (el?.is?.('element', 'table')) return el;
  return sel.getFirstPosition()?.findAncestor('table') ?? null;
}

/** Células selecionadas da tabela (seleção de várias células do CK5); vazio com o cursor numa só. */
export function celulasSelecionadas(editor: Editor, tabela: ElementoModel): ElementoModel[] {
  try {
    const tu = plugin(editor, 'TableUtils');
    const sel = editor.model.document.selection;
    const lista: ElementoModel[] = tu?.getSelectedTableCells?.(sel) ?? plugin(editor, 'TableSelection')?.getSelectedTableCells?.() ?? [];
    return Array.from(lista).filter((c) => c?.findAncestor?.('table') === tabela);
  } catch {
    return [];
  }
}

export function raizDaSelecao(editor: Editor): string | undefined {
  return editor.model.document.selection.getFirstPosition()?.root?.rootName;
}

/** Seção somente leitura (Cabeçalho, Título, Rodapé) ou documento bloqueado. */
export function raizSomenteLeitura(editor: Editor, raiz: string | undefined): boolean {
  if (!raiz || editor.isReadOnly) return true;
  try {
    return !!editor.editing.view.document.getRoot(raiz)?.isReadOnly;
  } catch {
    return false;
  }
}

export function podeInserir(editor: Editor): boolean {
  const cmd = editor.commands.get('insertTable');
  return !!cmd?.isEnabled && !raizSomenteLeitura(editor, raizDaSelecao(editor));
}

export function temRedimensionamento(editor: Editor): boolean {
  return !!editor.commands.get('resizeColumnWidths');
}

/** Temas do SEI (os 8 padrões mais os que o órgão cadastrou), na ordem do botão "Tema da tabela". */
export function temas(editor: Editor): Tema[] {
  if (!editor.commands.get(ATRIBUTO_TEMA)) return [];
  const lista = plugin(editor, 'TemaTabelaEditing')?.temas;
  return Array.isArray(lista) ? lista.filter((t: Tema) => t && typeof t.classeCss === 'string') : [];
}

/** Estilos de parágrafo do órgão para tabela (`Tabela_*`) que a seção aceita. */
export function estilosDeTabela(editor: Editor, raiz: string | undefined): string[] {
  const estilos = plugin(editor, 'EstiloEditing')?.estilos ?? {};
  return Object.keys(estilos)
    .filter((nome) => /^Tabela_/i.test(nome) && (!raiz || (estilos[nome]?.permitidoEm ?? []).includes(raiz)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/**
 * CSS dos estilos do órgão (`.Tabela_Texto_8{font-size:8pt;text-align:left}`…). No 5.0.5 fica em
 * `infra.estilo.css`; em outras versões, em `estilo.css`.
 */
export function cssDosEstilos(editor: Editor): unknown {
  const ler = (chave: string) => {
    try {
      return editor.config?.get?.(chave);
    } catch {
      return undefined;
    }
  };
  const cfg = (globalThis as { INFRA_EDITOR_CONFIG?: Qualquer }).INFRA_EDITOR_CONFIG;
  return ler('infra.estilo.css') ?? ler('estilo.css') ?? cfg?.infra?.estilo?.css ?? cfg?.estilo?.css;
}

// ---------------------------------------------------------------- leitura

function utils(editor: Editor): Qualquer {
  return plugin(editor, 'TableUtils');
}

function domDaTabela(editor: Editor, tabela: ElementoModel): HTMLTableElement | null {
  try {
    const vista = editor.editing.mapper.toViewElement(tabela);
    const dom = vista && editor.editing.view.domConverter.mapViewToDom(vista);
    if (!dom) return null;
    return dom.tagName === 'TABLE' ? dom : dom.querySelector('table');
  } catch {
    return null;
  }
}

/** Largura da tabela na tela em % do texto: para tabela sem largura em % (antiga, em px ou automática). */
function medirLarguraTabela(editor: Editor, tabela: ElementoModel): number | undefined {
  const dom = domDaTabela(editor, tabela);
  const editavel = dom?.closest('.ck-editor__editable') as HTMLElement | null;
  if (!dom || !editavel) return undefined;
  const cs = getComputedStyle(editavel);
  const util = editavel.clientWidth - Number.parseFloat(cs.paddingLeft || '0') - Number.parseFloat(cs.paddingRight || '0');
  const largura = dom.getBoundingClientRect().width;
  if (!(util > 0) || !(largura > 0)) return undefined;
  return larguraTabelaValida((largura / util) * 100);
}

/** Larguras das colunas na tela, pela primeira linha sem células mescladas. */
function medirColunas(editor: Editor, tabela: ElementoModel, n: number): number[] | undefined {
  const dom = domDaTabela(editor, tabela);
  if (!dom) return undefined;
  for (const linha of Array.from(dom.rows)) {
    const celulas = Array.from(linha.cells);
    if (celulas.length === n && celulas.every((c) => c.colSpan === 1)) {
      return deMedidasDaTela(celulas.map((c) => c.getBoundingClientRect().width));
    }
  }
  return undefined;
}

function* itensDaTabela(editor: Editor, tabela: ElementoModel): Generator<ElementoModel> {
  const faixa = editor.model.createRangeOn(tabela);
  for (const { item } of faixa.getWalker({ ignoreElementEnd: true })) {
    if (item?.is?.('element')) yield item;
  }
}

/** Linhas da tabela separadas em cabeçalho (as `headingRows` primeiras) e corpo. */
function linhasDaTabela(tabela: ElementoModel): { cabecalho: ElementoModel[]; corpo: ElementoModel[] } {
  const linhas = (Array.from(tabela.getChildren?.() ?? tabela.children ?? []) as ElementoModel[]).filter(
    (n) => n?.name === 'tableRow',
  );
  const n = Math.min(linhas.length, Number(tabela.getAttribute('headingRows') ?? 0) || 0);
  return { cabecalho: linhas.slice(0, n), corpo: linhas.slice(n) };
}

function paragrafos(editor: Editor, linhas: ElementoModel[]): ElementoModel[] {
  const saida: ElementoModel[] = [];
  for (const linha of linhas) for (const item of itensDaTabela(editor, linha)) if (item.name === 'paragraph') saida.push(item);
  return saida;
}

function estiloComum(lista: ElementoModel[]): string {
  let comum: string | undefined;
  for (const p of lista) {
    const estilo = p.getAttribute(ATRIBUTO_ESTILO) ?? '';
    if (comum === undefined) comum = estilo;
    else if (comum !== estilo) return '';
  }
  return comum ?? '';
}

// ---------------------------------------------------------------- posição na página

export function temPosicao(editor: Editor): boolean {
  try {
    return !!editor.commands.get(ATRIBUTO_POSICAO) || !!editor.model.schema.checkAttribute?.(['$root', 'table'], ATRIBUTO_POSICAO);
  } catch {
    return false;
  }
}

/** Sem o atributo, a tabela fica no padrão do editor (no CK5, centralizada). */
function posicaoPadrao(editor: Editor): string {
  try {
    return editor.config?.get?.('table.tableProperties.defaultProperties.alignment') || 'center';
  } catch {
    return 'center';
  }
}

/** `left`/`blockLeft` → esquerda, `right`/`blockRight` → direita, o resto → centro. */
export function posicaoDe(valor: unknown): PosicaoTabela {
  const v = String(valor ?? '');
  return /left/i.test(v) ? 'esquerda' : /right/i.test(v) ? 'direita' : 'centro';
}

const blocoPorEditor = new WeakMap<object, boolean>();

/**
 * O CK5 novo tem `blockLeft`/`blockRight` (margem: a tabela fica de um lado e o texto segue abaixo, como
 * no Word); o antigo só tem `left`/`right`, que flutuam (o texto corre ao lado). Descobre convertendo uma
 * tabela de teste com margem à esquerda, fora do documento, uma vez por editor.
 */
export function temPosicaoEmBloco(editor: Editor): boolean {
  const guardado = blocoPorEditor.get(editor);
  if (guardado !== undefined) return guardado;
  let ok = false;
  try {
    const vista = editor.data.processor.toView(
      '<figure class="table" style="margin-left:0;margin-right:auto;width:50%"><table><tbody><tr><td>x</td></tr></tbody></table></figure>',
    );
    const fragmento = editor.data.toModel(vista);
    for (const { item } of editor.model.createRangeIn(fragmento).getWalker()) {
      if (item.is?.('element', 'table')) {
        ok = item.getAttribute(ATRIBUTO_POSICAO) === 'blockLeft';
        break;
      }
    }
  } catch {
    ok = false;
  }
  blocoPorEditor.set(editor, ok);
  return ok;
}

function lerPosicao(editor: Editor, tabela: ElementoModel): PosicaoTabela | '' {
  if (!temPosicao(editor)) return '';
  return posicaoDe(tabela.getAttribute(ATRIBUTO_POSICAO) ?? posicaoPadrao(editor));
}

function aplicarPosicao(editor: Editor, writer: Qualquer, tabela: ElementoModel, posicao: PosicaoTabela | ''): void {
  if (!posicao || !temPosicao(editor)) return;
  const padrao = posicaoPadrao(editor);
  if (posicaoDe(tabela.getAttribute(ATRIBUTO_POSICAO) ?? padrao) === posicao) return;
  const bloco = temPosicaoEmBloco(editor);
  const valor = posicao === 'centro' ? 'center' : posicao === 'esquerda' ? (bloco ? 'blockLeft' : 'left') : bloco ? 'blockRight' : 'right';
  if (valor === padrao) writer.removeAttribute(ATRIBUTO_POSICAO, tabela);
  else writer.setAttribute(ATRIBUTO_POSICAO, valor, tabela);
}

export function lerTabela(editor: Editor, tabela: ElementoModel): Leitura {
  const tu = utils(editor);
  const colunas: number = tu.getColumns(tabela);
  const linhas: number = tu.getRows(tabela);
  const larguraTabela =
    lerPorcentagem(tabela.getAttribute('tableWidth')) ?? medirLarguraTabela(editor, tabela) ?? 100;

  let larguras: number[] | undefined;
  const redim = plugin(editor, 'TableColumnResizeEditing');
  const grupo = redim?.getColumnGroupElement?.(tabela);
  if (grupo) {
    const medidas: string[] = redim.getTableColumnsWidths(grupo) ?? [];
    if (medidas.length === colunas) larguras = deMedidasDoEditor(medidas);
    else if (medidas.length) larguras = normalizar(Array.from({ length: colunas }, (_, i) => lerPorcentagem(medidas[i])));
  }
  larguras ??= medirColunas(editor, tabela, colunas) ?? uniformes(colunas);
  const { cabecalho, corpo } = linhasDaTabela(tabela);

  return {
    existe: true,
    linhas,
    colunas,
    larguraTabela: larguraTabelaValida(larguraTabela),
    larguras,
    tema: tabela.getAttribute(ATRIBUTO_TEMA) ?? '',
    cabecalho: (tabela.getAttribute('headingRows') ?? 0) > 0,
    estiloCelulas: estiloComum(paragrafos(editor, corpo)),
    estiloCabecalho: estiloComum(paragrafos(editor, cabecalho)),
    limpar: false,
    bordas: null,
    personalizado: lerPersonalizacao(tabela),
    posicao: lerPosicao(editor, tabela),
    sujeira: sujeiraDaTabela(editor, tabela).length,
    jaTratada: jaTratada(tabela),
  };
}

function jaTratada(tabela: ElementoModel): boolean {
  return tabela.getAttribute('htmlTableAttributes')?.styles?.['word-wrap'] === 'break-word';
}

// ---------------------------------------------------------------- limpeza da formatação colada

/** Tabela: bordas, fundo e altura (nomes do CK5 novo e do antigo). */
const SUJEIRA_TABELA = [
  // `tableAlignment` fica: é a posição na página, que o diálogo mostra e regrava (ver `aplicarPosicao`).
  'tableBorderStyle', 'tableBorderColor', 'tableBorderWidth', 'tableBackgroundColor', 'tableHeight',
  'borderStyle', 'borderColor', 'borderWidth', 'backgroundColor', 'alignment', 'height',
];
/** Célula: bordas, fundo, espaçamento, largura e altura fixas, alinhamentos. */
const SUJEIRA_CELULA = [
  'tableCellBorderStyle', 'tableCellBorderColor', 'tableCellBorderWidth', 'tableCellBackgroundColor', 'tableCellPadding',
  'tableCellWidth', 'tableCellHeight', 'tableCellHorizontalAlignment', 'tableCellVerticalAlignment',
  'borderStyle', 'borderColor', 'borderWidth', 'backgroundColor', 'padding', 'width', 'height', 'horizontalAlignment', 'verticalAlignment',
];
/** Parágrafo (e outros blocos) dentro da célula. O estilo do SEI (`estilo`) fica. */
const SUJEIRA_BLOCO = ['alignment', 'blockIndent', 'lineHeight'];
/** Texto: fonte, tamanho e cores. Negrito, itálico, sublinhado, links etc. ficam. */
const SUJEIRA_TEXTO = ['fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight'];
/** Elementos cujos atributos não são "formatação" (imagem perde o tamanho). */
const SEM_LIMPEZA = /^image|^media/;

const ehHtml = (chave: string) => /^html[A-Z]/.test(chave);

export interface Sujeira {
  chave: string;
  alvo: ElementoModel;
}

/**
 * O que a limpeza tira: estilos, classes e atributos de HTML colado (GHS `html*`), propriedades de tabela
 * e célula do CK5, fonte/tamanho/cor do texto. Mantém mesclagens, cabeçalho, tema, estilo do SEI,
 * negrito/itálico/sublinhado e links. As marcas desta ferramenta (zebra, `word-wrap`) não contam.
 */
export function sujeiraDaTabela(editor: Editor, tabela: ElementoModel): Sujeira[] {
  const saida: Sujeira[] = [];
  const faixa = editor.model.createRangeOn(tabela);
  for (const { item } of faixa.getWalker({ ignoreElementEnd: true })) {
    if (!item) continue;
    const texto = item.is?.('$textProxy') || item.is?.('$text');
    const nome: string = item.name ?? '';
    if (!texto && SEM_LIMPEZA.test(nome)) continue;
    const lista = texto
      ? SUJEIRA_TEXTO
      : nome === 'table'
        ? SUJEIRA_TABELA
        : nome === 'tableCell'
          ? SUJEIRA_CELULA
          : nome === 'tableRow'
            ? []
            : SUJEIRA_BLOCO;
    for (const chave of Array.from(item.getAttributeKeys?.() ?? []) as string[]) {
      if (!lista.includes(chave) && !ehHtml(chave)) continue;
      const valor = item.getAttribute(chave);
      if (chave === ATRIBUTO_FUNDO && typeof valor === 'string' && MARCAS.has(valor)) continue;
      if (chave === 'htmlTableAttributes' && jaSoQuebra(valor)) continue;
      saida.push({ chave, alvo: texto ? editor.model.createRangeOn(item) : item });
    }
  }
  return saida;
}

function jaSoQuebra(valor: Qualquer): boolean {
  const estilos = Object.keys(valor?.styles ?? {});
  return estilos.length === 1 && estilos[0] === 'word-wrap' && !valor.classes?.length && !Object.keys(valor.attributes ?? {}).length;
}

function limpar(editor: Editor, writer: Qualquer, tabela: ElementoModel): void {
  // Junta tudo antes de mexer: mudar atributo de texto parte os nós e atrapalharia o percurso.
  for (const { chave, alvo } of sujeiraDaTabela(editor, tabela)) writer.removeAttribute(chave, alvo);
}

// ---------------------------------------------------------------- bordas desenhadas (ver bordas.ts)

const NOMES_BORDA_CELULA = [
  ['tableCellBorderStyle', 'tableCellBorderColor', 'tableCellBorderWidth'],
  ['borderStyle', 'borderColor', 'borderWidth'],
] as const;
const NOMES_BORDA_TABELA = [['tableBorderStyle'], ['borderStyle']] as const;

function primeiroAceito<T extends readonly string[]>(editor: Editor, el: ElementoModel, opcoes: readonly T[]): T | null {
  return opcoes.find((o) => editor.model.schema.checkAttribute(el, o[0])) ?? null;
}

function desenharBordas(editor: Editor, writer: Qualquer, tabela: ElementoModel, d: Desenho, selecionadas: ElementoModel[]): void {
  const linhas = filhos(tabela, 'tableRow').map((r) => filhos(r, 'tableCell'));
  const primeira = linhas[0]?.[0];
  const nomes = primeira && primeiroAceito(editor, primeira, NOMES_BORDA_CELULA);
  if (!nomes) return;
  const grade = linhas.map((l) =>
    l.map((c) => ({ rowspan: Number(c.getAttribute('rowspan') ?? 1) || 1, colspan: Number(c.getAttribute('colspan') ?? 1) || 1 })),
  );
  const caixas = caixasDasCelulas(grade);
  const escolhidas: Array<[number, number]> = [];
  if (d.onde === 'selecao') {
    linhas.forEach((l, r) => l.forEach((c, i) => selecionadas.includes(c) && escolhidas.push([r, i])));
  }
  const regiao = regiaoDe(caixas, escolhidas.length > 1 ? escolhidas : undefined);
  if (!regiao) return;
  const lados = ladosDasCelulas(caixas, regiao, d.ligadas);
  const [chEstilo, chCor, chLargura] = nomes;
  linhas.forEach((linha, r) =>
    linha.forEach((cel, i) => {
      if (!LADOS.some((l) => lados[r][i][l] !== undefined)) return;
      const v = valoresDosLados(lados[r][i], d.traco);
      for (const [chave, novos] of [[chEstilo, v.estilo], [chCor, v.cor], [chLargura, v.largura]] as const) {
        const valor = mesclarLados(cel.getAttribute(chave), novos);
        if (valor === undefined) writer.removeAttribute(chave, cel);
        else writer.setAttribute(chave, valor, cel);
      }
    }),
  );
  // A borda da própria tabela (1px dupla cinza da folha do SEI) disputa a aresta de fora com as células:
  // com a tabela inteira desenhada, ela sai e ficam só as das células.
  const inteira = regiao.r0 === 0 && regiao.c0 === 0 && regiao.r1 === caixas.length - 1 && regiao.c1 === Math.max(...caixas.flat().map((c) => c.c1));
  const daTabela = inteira && primeiroAceito(editor, tabela, NOMES_BORDA_TABELA);
  if (daTabela) writer.setAttribute(daTabela[0], 'none', tabela);
}

// ---------------------------------------------------------------- gravação

/** Estilos inline que brigam com as % e empurram a tabela para fora da margem. */
const ESTILOS_CONFLITANTES = ['width', 'min-width', 'max-width', 'white-space'];

function semEstilos(writer: Qualquer, item: ElementoModel, nomes: string[]): void {
  for (const chave of Array.from(item.getAttributeKeys()) as string[]) {
    if (!chave.startsWith('html') || !chave.endsWith('Attributes')) continue;
    const valor = item.getAttribute(chave);
    if (!valor?.styles) continue;
    const estilos = { ...valor.styles };
    let mudou = false;
    for (const n of nomes) {
      if (n in estilos) {
        delete estilos[n];
        mudou = true;
      }
    }
    if (!mudou) continue;
    const novo = { ...valor, styles: estilos };
    if (!Object.keys(estilos).length) delete novo.styles;
    if (Object.keys(novo).length) writer.setAttribute(chave, novo, item);
    else writer.removeAttribute(chave, item);
  }
}

/**
 * Tira o que fixa largura fora do colgroup: largura de célula (CK5 `tableCellWidth` e `width` inline do
 * Word/SEI 4) e `white-space: nowrap`, que impede a quebra e alarga a coluna.
 */
function limparLargurasConflitantes(editor: Editor, writer: Qualquer, tabela: ElementoModel): void {
  for (const item of itensDaTabela(editor, tabela)) {
    if (item.name === 'tableCell') {
      if (item.hasAttribute('tableCellWidth')) writer.removeAttribute('tableCellWidth', item);
      semEstilos(writer, item, ESTILOS_CONFLITANTES);
    } else if (item.name === 'tableRow') {
      semEstilos(writer, item, ESTILOS_CONFLITANTES);
    }
  }
  semEstilos(writer, tabela, ['min-width', 'max-width', 'white-space', 'table-layout']);
}

/**
 * `word-wrap: break-word` na tabela (herdado pelas células). A folha do SEI já usa `overflow-wrap`, mas
 * o gerador de PDF do SEI (wkhtmltopdf 0.12.6, WebKit antigo) só conhece o nome antigo: sem ele, URL ou
 * número longo alarga a coluna no PDF gerado.
 */
function garantirQuebra(editor: Editor, writer: Qualquer, tabela: ElementoModel): void {
  const chave = 'htmlTableAttributes';
  if (!editor.model.schema.checkAttribute(tabela, chave)) return;
  const valor = tabela.getAttribute(chave) ?? {};
  if (valor.styles?.['word-wrap'] === 'break-word') return;
  writer.setAttribute(chave, { ...valor, styles: { ...(valor.styles ?? {}), 'word-wrap': 'break-word' } }, tabela);
}

function aplicarEstilo(editor: Editor, writer: Qualquer, tabela: ElementoModel, lista: ElementoModel[], nome: string): void {
  const estilo = plugin(editor, 'EstiloEditing')?.estilos?.[nome];
  const raiz = tabela.root?.rootName;
  if (!estilo || (raiz && !(estilo.permitidoEm ?? []).includes(raiz))) return;
  for (const p of lista) {
    if (editor.model.schema.checkAttribute(p, ATRIBUTO_ESTILO)) writer.setAttribute(ATRIBUTO_ESTILO, nome, p);
  }
}

/** Corpo com o estilo das células; linhas de cabeçalho com o delas (ou o mesmo, se vazio). */
function aplicarEstilosNasCelulas(editor: Editor, writer: Qualquer, tabela: ElementoModel, e: Escolha): void {
  const { cabecalho, corpo } = linhasDaTabela(tabela);
  if (e.estiloCelulas) aplicarEstilo(editor, writer, tabela, paragrafos(editor, corpo), e.estiloCelulas);
  const doCabecalho = e.estiloCabecalho || e.estiloCelulas;
  if (doCabecalho) aplicarEstilo(editor, writer, tabela, paragrafos(editor, cabecalho), doCabecalho);
}

function ajustarCabecalho(editor: Editor, writer: Qualquer, tabela: ElementoModel, cabecalho: boolean): void {
  const tu = utils(editor);
  const atual = tabela.getAttribute('headingRows') ?? 0;
  if (cabecalho && atual < 1) tu.setHeadingRowsCount(writer, tabela, 1);
  else if (!cabecalho && atual > 0) tu.setHeadingRowsCount(writer, tabela, 0);
}

// ---------------------------------------------------------------- zebra pela 1ª coluna (ver zebra.ts)

const ATRIBUTO_FUNDO = 'tableCellBackgroundColor';

function filhos(el: ElementoModel, nome: string): ElementoModel[] {
  return (Array.from(el.getChildren?.() ?? el.children ?? []) as ElementoModel[]).filter((n) => n?.name === nome);
}

/** Grade (rowspan/colspan) das células do model. */
function gradeDe(linhas: ElementoModel[][]): Array<Array<{ rowspan: number; colspan: number }>> {
  return linhas.map((l) =>
    l.map((c) => ({ rowspan: Number(c.getAttribute('rowspan') ?? 1) || 1, colspan: Number(c.getAttribute('colspan') ?? 1) || 1 })),
  );
}

/**
 * Pinta (ou despinta) as células: zebra pela 1ª coluna nos temas do SEI (`pinturaZebra`) e, na tabela
 * personalizada (sem tema, listras com a marca `rgb(…)`), refaz as listras. Devolve se mudou algo.
 */
export function ajustarZebra(editor: Editor, writer: Qualquer, tabela: ElementoModel): boolean {
  const linhas = filhos(tabela, 'tableRow').map((r) => filhos(r, 'tableCell'));
  if (!linhas.length || !editor.model.schema.checkAttribute(linhas[0][0] ?? tabela, ATRIBUTO_FUNDO)) return false;
  const grade = gradeDe(linhas);
  const tema = tabela.getAttribute(ATRIBUTO_TEMA) ?? '';
  const cab = Number(tabela.getAttribute('headingRows') ?? 0) || 0;
  const colCab = Number(tabela.getAttribute('headingColumns') ?? 0) || 0;
  const plano = pinturaZebra(grade, tema, cab, colCab);
  // Personalizada: só as células do corpo que já são desta ferramenta (marca) ou novas sem cor.
  const listras = tema ? null : lerListras(grade, linhas.map((l) => l.map((c) => c.getAttribute(ATRIBUTO_FUNDO))), cab, colCab);
  const pessoal = listras ? pinturaPersonalizada(grade, cab, colCab, { cabecalhoCor: '', ...listras }) : null;
  let mudou = false;
  linhas.forEach((linha, r) =>
    linha.forEach((cel, i) => {
      const tem = cel.getAttribute(ATRIBUTO_FUNDO);
      if (pessoal) {
        const p = pessoal[r][i];
        if (p.cabecalho || !p.fundo || (tem !== undefined && !ehMarca(tem)) || tem === p.fundo) return;
        writer.setAttribute(ATRIBUTO_FUNDO, p.fundo, cel);
        mudou = true;
        return;
      }
      const quer = plano?.[r]?.[i] ?? null;
      if (quer) {
        if (tem !== quer) {
          writer.setAttribute(ATRIBUTO_FUNDO, quer, cel);
          mudou = true;
        }
      } else if (typeof tem === 'string' && MARCAS.has(tem)) {
        writer.removeAttribute(ATRIBUTO_FUNDO, cel);
        mudou = true;
      }
    }),
  );
  return mudou;
}

// ---------------------------------------------------------------- tema personalizado (ver personalizar.ts)

const ATRIBUTO_COR_TEXTO = 'fontColor';

function textosDe(editor: Editor, cel: ElementoModel): Array<{ item: ElementoModel; faixa: ElementoModel }> {
  const saida: Array<{ item: ElementoModel; faixa: ElementoModel }> = [];
  for (const { item } of editor.model.createRangeIn(cel).getWalker({ ignoreElementEnd: true })) {
    if (item?.is?.('$textProxy') || item?.is?.('$text')) saida.push({ item, faixa: editor.model.createRangeOn(item) });
  }
  return saida;
}

/** Grava o visual: fundo do cabeçalho, listras pela 1ª coluna e texto branco em cabeçalho escuro. */
function aplicarPersonalizacao(editor: Editor, writer: Qualquer, tabela: ElementoModel, p: Personalizacao): void {
  if (p.colunaCabecalho) {
    if ((Number(tabela.getAttribute('headingColumns') ?? 0) || 0) < 1) writer.setAttribute('headingColumns', 1, tabela);
  } else if (tabela.hasAttribute('headingColumns')) writer.removeAttribute('headingColumns', tabela);
  const linhas = filhos(tabela, 'tableRow').map((r) => filhos(r, 'tableCell'));
  if (!linhas.length) return;
  const pintura = pinturaPersonalizada(
    gradeDe(linhas),
    Number(tabela.getAttribute('headingRows') ?? 0) || 0,
    p.colunaCabecalho ? 1 : 0,
    p,
  );
  const branco = escuro(p.cabecalhoCor);
  const podeFundo = editor.model.schema.checkAttribute(linhas[0][0], ATRIBUTO_FUNDO);
  linhas.forEach((linha, r) =>
    linha.forEach((cel, i) => {
      const { fundo, cabecalho } = pintura[r][i];
      if (podeFundo) {
        if (fundo) writer.setAttribute(ATRIBUTO_FUNDO, fundo, cel);
        else if (cel.hasAttribute(ATRIBUTO_FUNDO)) writer.removeAttribute(ATRIBUTO_FUNDO, cel);
      }
      // Texto branco em cabeçalho escuro; o branco desta ferramenta sai quando o fundo clareia.
      for (const { item, faixa } of textosDe(editor, cel)) {
        if (cabecalho && branco) {
          if (item.getAttribute(ATRIBUTO_COR_TEXTO) !== BRANCO_HEX) writer.setAttribute(ATRIBUTO_COR_TEXTO, BRANCO_HEX, faixa);
        } else if (item.getAttribute(ATRIBUTO_COR_TEXTO) === BRANCO_HEX) writer.removeAttribute(ATRIBUTO_COR_TEXTO, faixa);
      }
    }),
  );
}

/** Sai do modo personalizado: tira as listras marcadas, o fundo do cabeçalho e o texto branco dele. */
function desfazerPersonalizacao(editor: Editor, writer: Qualquer, tabela: ElementoModel): void {
  const linhas = filhos(tabela, 'tableRow').map((r) => filhos(r, 'tableCell'));
  if (!linhas.length) return;
  const pintura = pinturaPersonalizada(
    gradeDe(linhas),
    Number(tabela.getAttribute('headingRows') ?? 0) || 0,
    Number(tabela.getAttribute('headingColumns') ?? 0) || 0,
    { cabecalhoCor: '', listrasCor: '', primeiroListrado: false },
  );
  linhas.forEach((linha, r) =>
    linha.forEach((cel, i) => {
      const fundo = cel.getAttribute(ATRIBUTO_FUNDO);
      if (fundo !== undefined && (ehMarca(fundo) || pintura[r][i].cabecalho)) writer.removeAttribute(ATRIBUTO_FUNDO, cel);
      if (!pintura[r][i].cabecalho) return;
      for (const { item, faixa } of textosDe(editor, cel)) {
        if (item.getAttribute(ATRIBUTO_COR_TEXTO) === BRANCO_HEX) writer.removeAttribute(ATRIBUTO_COR_TEXTO, faixa);
      }
    }),
  );
}

/** Tabela sem tema com o visual desta ferramenta: listras marcadas ou cabeçalho com fundo. */
function lerPersonalizacao(tabela: ElementoModel): Personalizacao | null {
  if (tabela.getAttribute(ATRIBUTO_TEMA)) return null;
  const linhas = filhos(tabela, 'tableRow').map((r) => filhos(r, 'tableCell'));
  if (!linhas.length) return null;
  const cab = Number(tabela.getAttribute('headingRows') ?? 0) || 0;
  const colCab = Number(tabela.getAttribute('headingColumns') ?? 0) || 0;
  const listras = lerListras(gradeDe(linhas), linhas.map((l) => l.map((c) => c.getAttribute(ATRIBUTO_FUNDO))), cab, colCab);
  const fundoCab = cab > 0 ? linhas[0][0]?.getAttribute(ATRIBUTO_FUNDO) : undefined;
  const cabecalhoCor = typeof fundoCab === 'string' ? hexValido(fundoCab) : '';
  if (!listras && !(cabecalhoCor && jaTratada(tabela))) return null;
  return {
    cabecalhoCor,
    listrasCor: listras?.listrasCor ?? '',
    primeiroListrado: listras?.primeiroListrado ?? false,
    colunaCabecalho: colCab > 0,
  };
}

const comZebra = new WeakSet<object>();

/**
 * Mantém a zebra pela 1ª coluna em qualquer mudança da tabela (mesclar, dividir, trocar o tema pelo botão
 * do SEI, inserir linha): um post-fixer do model, no mesmo passo de desfazer da mudança.
 */
export function registrarZebra(editor: Editor): void {
  if (!ehCk5(editor) || comZebra.has(editor)) return;
  comZebra.add(editor);
  let avisou = false;
  // Outro post-fixer que tirasse o fundo (ex.: do tema) brigaria com este sem fim: no máximo 3 rodadas
  // por mudança; o contador zera quando a mudança termina.
  let rodadas = 0;
  editor.model.document.on?.('change', () => {
    rodadas = 0;
  });
  editor.model.document.registerPostFixer((writer: Qualquer) => {
    if (rodadas >= 3) return false;
    try {
      const tabelas = new Set<ElementoModel>();
      for (const m of editor.model.document.differ.getChanges()) {
        const pos = m.type === 'attribute' ? m.range?.start : m.position;
        if (!pos || pos.root?.rootName === '$graveyard') continue;
        const no = m.type === 'remove' ? null : pos.nodeAfter;
        if (no?.is?.('element', 'table')) tabelas.add(no);
        const acima = pos.findAncestor?.('table');
        if (acima) tabelas.add(acima);
      }
      let mudou = false;
      for (const t of tabelas) if (t.root?.rootName !== '$graveyard' && ajustarZebra(editor, writer, t)) mudou = true;
      if (mudou) rodadas++;
      return mudou;
    } catch (e) {
      if (!avisou) console.warn('[SEIPro/tabela-colunas] zebra pela 1a coluna', e);
      avisou = true;
      return false;
    }
  });
}

/**
 * Cria (sem `tabela`) ou ajusta a tabela. Devolve a tabela do model, ou `null` se não deu para inserir.
 */
export function aplicar(
  editor: Editor,
  tabelaExistente: ElementoModel | null,
  e: Escolha,
  /** Células selecionadas quando o diálogo abriu (para bordas "nas células selecionadas"). */
  selecionadas: ElementoModel[] = [],
): ElementoModel | null {
  // Tabela apagada enquanto o diálogo estava aberto: vai para o "$graveyard" do model.
  if (tabelaExistente && tabelaExistente.root?.rootName === '$graveyard') return null;
  let tabela: ElementoModel | null = tabelaExistente;
  editor.model.change((writer: Qualquer) => {
    if (!tabela) {
      editor.execute('insertTable', { rows: e.linhas, columns: e.colunas });
      tabela = tabelaDaSelecao(editor);
      if (!tabela) return;
    } else if (tabelaDaSelecao(editor) !== tabela) {
      // O comando do tema age na tabela da seleção.
      writer.setSelection(tabela, 'on');
    }

    // Primeiro a limpeza: o que vem depois (tema, larguras, bordas, estilos) grava sobre a tabela limpa.
    if (e.limpar && tabelaExistente) limpar(editor, writer, tabela);
    if (!e.personalizado && lerPersonalizacao(tabela)) desfazerPersonalizacao(editor, writer, tabela);
    // Personalizada: sem a classe do tema (as regras !important dele venceriam as cores e bordas).
    const tema = e.personalizado ? '' : e.tema;
    const temaAtual = tabela.getAttribute(ATRIBUTO_TEMA) ?? '';
    if (tema !== temaAtual && editor.commands.get(ATRIBUTO_TEMA)) {
      editor.execute(ATRIBUTO_TEMA, tema || undefined);
    }
    ajustarCabecalho(editor, writer, tabela, e.cabecalho);
    limparLargurasConflitantes(editor, writer, tabela);
    garantirQuebra(editor, writer, tabela);
    editor.execute('resizeColumnWidths', {
      table: tabela,
      tableWidth: `${larguraTabelaValida(e.larguraTabela)}%`,
      columnWidths: paraEditor(e.larguras),
    });
    aplicarPosicao(editor, writer, tabela, e.posicao);
    if (e.bordas && !tema) desenharBordas(editor, writer, tabela, e.bordas, selecionadas);
    if (e.personalizado) aplicarPersonalizacao(editor, writer, tabela, e.personalizado);
    aplicarEstilosNasCelulas(editor, writer, tabela, e);
    ajustarZebra(editor, writer, tabela);
  });
  return tabela;
}
