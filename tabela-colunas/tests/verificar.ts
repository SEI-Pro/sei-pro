/**
 * Verificações do Tabela com colunas em %: contas, estado do diálogo, diálogo desenhado (linkedom) e
 * gravação no model com um editor falso (registra comandos e atributos).
 */

import { parseHTML } from 'linkedom';
import {
  ajustarTexto,
  estilosDoTexto,
  textoInicial,
  avisoImpressao,
  comColuna,
  comColunas,
  comDivisoria,
  comLarguraTabela,
  igualar,
  montarDialogo,
  novoEstado,
} from '../src/dialogo';
import { ajustarZebra, aplicar, estilosDeTabela, lerTabela, posicaoDe, temas, temPosicaoEmBloco } from '../src/editor';
import { caixasDasCelulas, desenhoPadrao, ladosDasCelulas, mesclarLados, PREDEFINIDAS, regiaoDe, tracoValido } from '../src/bordas';
import { BRANCO, CINZA, colunasDasCelulas, gruposPelaPrimeiraColuna, pinturaZebra } from '../src/zebra';
import { desenharIcone } from '../src/icone';
import { deMarca, escuro, lerListras, paraMarca, partirDoTema, pinturaPersonalizada } from '../src/personalizar';
import {
  achar,
  alinhamentosDe,
  classificar,
  estiloCabecalho,
  lerCssEstilos,
  pelonome,
  rotuloTamanho,
  tamanhoPadrao,
  tamanhos,
} from '../src/estilos';
import {
  deMedidasDoEditor,
  definirColuna,
  fechar,
  garantirMinimo,
  lerPorcentagem,
  maxColunas,
  minimoColuna,
  moverDivisoria,
  normalizar,
  paraEditor,
  uniformes,
} from '../src/larguras';

let falhas = 0;
let total = 0;
function ok(cond: unknown, nome: string, extra?: unknown): void {
  total++;
  if (cond) return;
  falhas++;
  console.error(`FALHOU: ${nome}`, extra ?? '');
}
const soma = (v: number[]) => Math.round(v.reduce((a, b) => a + b, 0) * 100) / 100;
const igual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------------------- larguras
{
  ok(igual(uniformes(3), [33.34, 33.33, 33.33]), 'tres colunas iguais somam 100', uniformes(3));
  ok(soma(uniformes(7)) === 100, 'sete colunas somam 100', uniformes(7));
  ok(igual(uniformes(4), [25, 25, 25, 25]), 'quatro colunas de 25');
  ok(soma(fechar([10.004, 20.004, 69.996])) === 100, 'fechar acerta a soma');
  ok(igual(normalizar([1, 1, 2]), [25, 25, 50]), 'normalizar proporcional');
  ok(igual(normalizar([undefined, 50, 50]), [33.34, 33.33, 33.33]), 'coluna auto recebe a media', normalizar([undefined, 50, 50]));
  ok(igual(normalizar([undefined, undefined]), [50, 50]), 'sem medida: iguais');
  ok(lerPorcentagem('5.73%') === 5.73 && lerPorcentagem('120px') === undefined, 'ler porcentagem');
  ok(igual(deMedidasDoEditor(['5.73%', '5.73%', '88.54%']), [5.73, 5.73, 88.54]), 'medidas reais do SEI (exemplo2) ficam iguais');
  ok(igual(deMedidasDoEditor(['100px', '300px']), [25, 75]), 'medidas em px viram proporcao');
  ok(igual(paraEditor([50, 50]), ['50%', '50%']), 'formato do editor');

  // Mínimo de impressão: 30 pt numa largura útil de 525 pt.
  ok(minimoColuna(100) === 5.71, 'minimo a 100%', minimoColuna(100));
  ok(minimoColuna(50) === 11.43, 'minimo a 50%', minimoColuna(50));
  ok(maxColunas(100) === 17, 'cabem 17 colunas a 100%', maxColunas(100));
  ok(maxColunas(40) === 7, 'cabem 7 colunas a 40%', maxColunas(40));

  const g = garantirMinimo([2, 49, 49], 10);
  ok(g[0] === 10 && soma(g) === 100 && g[1] === g[2], 'garantir minimo tira das maiores', g);
  ok(igual(garantirMinimo([10, 90], 60), [50, 50]), 'minimo impossivel: iguais');

  const d = definirColuna([25, 25, 25, 25], 0, 40, 5);
  ok(igual(d, [40, 10, 25, 25]), 'definir tira da vizinha da direita', d);
  const d2 = definirColuna([25, 25, 25, 25], 0, 70, 5);
  ok(igual(d2, [70, 5, 5, 20]) && soma(d2) === 100, 'definir passa para as seguintes respeitando minimo', d2);
  const d3 = definirColuna([25, 25, 25, 25], 3, 10, 5);
  ok(igual(d3, [25, 25, 40, 10]), 'ultima coluna devolve a sobra para a esquerda', d3);
  const d4 = definirColuna([25, 25, 25, 25], 1, 99, 5);
  ok(d4[1] === 85 && soma(d4) === 100 && d4.every((v) => v >= 5), 'definir nao passa do teto', d4);
  ok(igual(definirColuna([100], 0, 30, 5), [100]), 'uma coluna e sempre 100');

  const m = moverDivisoria([50, 50], 0, 10, 5);
  ok(igual(m, [60, 40]), 'mover divisoria', m);
  ok(igual(moverDivisoria([50, 50], 0, 60, 5), [95, 5]), 'mover respeita minimo da direita');
  ok(igual(moverDivisoria([20, 30, 50], 1, -100, 5), [20, 5, 75]), 'mover so mexe no par');
  ok(igual(moverDivisoria([33.34, 33.33, 33.33], 0, 0.004, 5), [33.34, 33.33, 33.33]), 'arredondamento fica no par');
}

// ---------------------------------------------------------------- estilos de tabela do órgão
// Os 10 da tela de estilos do autor; o CSS é o do SEI 5.0.5 do órgão (fixture e exemplo2) para os que
// aparecem lá, e os demais ficam pelo nome.
const NOMES_IMAGEM = [
  'Tabela_Centralizado_12',
  'Tabela_Texto_8',
  'Tabela_Texto_8_Centralizado',
  'Tabela_Texto_Alinhado_Direita',
  'Tabela_Texto_Alinhado_Direita_10pt',
  'Tabela_Texto_Alinhado_Esquerda',
  'Tabela_Texto_Alinhado_Esquerda_10pt',
  'Tabela_Texto_Alinhado_Esquerda_12pt',
  'Tabela_Texto_Centralizado',
  'Tabela_Texto_Centralizado_10',
];
const CSS_ORGAO = [
  '.Tabela_Texto_8{font-size:8pt;font-family:Arial;text-align:left;word-wrap:normal;margin:0 3pt 0 3pt;}',
  '.Tabela_Texto_Alinhado_Direita{font-size:11pt;font-family:Arial;text-align:right;word-wrap:normal;margin:0 3pt 0 3pt;}',
  '.Tabela_Texto_Alinhado_Esquerda{font-size:11pt;font-family:Arial;text-align:left;word-wrap:normal;margin:0 3pt 0 3pt;}',
  '.Tabela_Texto_Centralizado{font-size:11pt;font-family:Arial;text-align:center;word-wrap:normal;margin:0 3pt 0;}',
  'p.Tabela_Centralizado_12 {font-size:12pt;font-family:Arial;text-align:center;word-wrap:normal;margin:0 3pt 0 3pt;}',
  'p.Tabela_Texto_8_Centralizado {font-size:8pt;font-family:Arial;text-align:center;}',
  'p.Tabela_Texto_Centralizado_10 {font-size:10pt;font-family:Arial;text-align:center;}',
];
const ESTILOS_IMAGEM = classificar(NOMES_IMAGEM, lerCssEstilos(CSS_ORGAO));
{
  const css = lerCssEstilos(CSS_ORGAO);
  ok(igual(css.get('Tabela_Texto_8'), { tamanhoPt: 8, alinhamento: 'esquerda' }), 'css: Tabela_Texto_8 e 8 pt a esquerda', css.get('Tabela_Texto_8'));
  ok(css.get('Tabela_Centralizado_12')?.tamanhoPt === 12, 'css com p. antes da classe');
  ok(igual(pelonome('Tabela_Texto_Alinhado_Direita_10pt'), { tamanhoPt: 10, alinhamento: 'direita' }), 'pelo nome: 10pt a direita');
  ok(igual(pelonome('Tabela_Texto_Alinhado_Esquerda'), { tamanhoPt: 11, alinhamento: 'esquerda' }), 'pelo nome: sem numero e 11 pt');
  ok(igual(tamanhos(ESTILOS_IMAGEM), [8, 10, 11, 12]), 'tamanhos 8, 10, 11 e 12', tamanhos(ESTILOS_IMAGEM));
  ok(tamanhoPadrao(ESTILOS_IMAGEM) === 11, 'padrao 11 pt');
  ok(igual(alinhamentosDe(ESTILOS_IMAGEM, 8), ['esquerda', 'centro']), '8 pt: esquerda e centro');
  ok(igual(alinhamentosDe(ESTILOS_IMAGEM, 11), ['esquerda', 'centro', 'direita']), '11 pt: os tres');
  ok(igual(alinhamentosDe(ESTILOS_IMAGEM, 12), ['esquerda', 'centro']), '12 pt: esquerda e centro');
  ok(achar(ESTILOS_IMAGEM, 11, 'centro') === 'Tabela_Texto_Centralizado', 'centralizado 11 pt e o Tabela_Texto_Centralizado');
  ok(achar(ESTILOS_IMAGEM, 12, 'centro') === 'Tabela_Centralizado_12', 'centralizado 12 pt');
  ok(achar(ESTILOS_IMAGEM, 10, 'direita') === 'Tabela_Texto_Alinhado_Direita_10pt', 'direita 10 pt');
  ok(achar(ESTILOS_IMAGEM, 12, 'direita') === undefined, 'nao inventa 12 pt a direita');
  ok(estiloCabecalho(ESTILOS_IMAGEM, 10, 'Tabela_Texto_Alinhado_Esquerda_10pt') === 'Tabela_Texto_Centralizado_10', 'cabecalho 10 pt centralizado');
  const soEsquerda = classificar(['Tabela_Texto_Alinhado_Esquerda', 'Tabela_Texto_8']);
  ok(estiloCabecalho(soEsquerda, 11, 'Tabela_Texto_Alinhado_Esquerda') === 'Tabela_Texto_Alinhado_Esquerda', 'sem centralizado: cabecalho igual ao corpo');
  ok(rotuloTamanho(8, 11) === '8 pt (menor)' && rotuloTamanho(11, 11) === '11 pt (padrão)' && rotuloTamanho(12, 11) === '12 pt (maior)', 'rotulos de tamanho');

  // Modelos do diálogo.
  const nova = textoInicial(ESTILOS_IMAGEM, novoEstado());
  ok(igual(nova, { alterar: true, tamanhoPt: 11, alinhamento: 'esquerda', cabecalhoCentralizado: true }), 'tabela nova: 11 pt a esquerda, cabecalho centralizado', nova);
  ok(igual(estilosDoTexto(ESTILOS_IMAGEM, nova, true), { estiloCelulas: 'Tabela_Texto_Alinhado_Esquerda', estiloCabecalho: 'Tabela_Texto_Centralizado' }), 'estilos do modelo padrao');
  ok(estilosDoTexto(ESTILOS_IMAGEM, nova, false).estiloCabecalho === 'Tabela_Texto_Alinhado_Esquerda', 'sem cabecalho: tudo igual ao corpo');
  const maior = ajustarTexto(ESTILOS_IMAGEM, { ...nova, tamanhoPt: 12, alinhamento: 'direita' });
  ok(maior.alinhamento === 'esquerda', '12 pt sem direita volta para a esquerda');
  const existente = textoInicial(ESTILOS_IMAGEM, { ...novoEstado(), existe: true, estiloCelulas: 'Tabela_Texto_Centralizado_10', estiloCabecalho: 'Tabela_Texto_Centralizado_10' });
  ok(!existente.alterar && existente.tamanhoPt === 10 && existente.alinhamento === 'centro', 'tabela existente le o modelo e nao altera', existente);
  ok(igual(estilosDoTexto(ESTILOS_IMAGEM, existente, true), { estiloCelulas: '', estiloCabecalho: '' }), 'nao alterar: nada gravado');
}

// ---------------------------------------------------------------- estado do diálogo
{
  const e = novoEstado(undefined, { temaPadrao: 'infra-doc-tabela__zcb' });
  ok(e.colunas === 3 && e.larguraTabela === 100 && igual(e.larguras, uniformes(3)), 'nova tabela: 3 colunas iguais a 100%');
  const e5 = comColunas(e, 5);
  ok(igual(e5.larguras, [20, 20, 20, 20, 20]), 'mudar colunas volta a iguais');
  ok(comColunas(e, 999).colunas === 50, 'teto de colunas');
  const ajustada = comColuna(e5, 0, 40);
  ok(ajustada.larguras[0] === 40 && soma(ajustada.larguras) === 100, 'coluna digitada');
  const estreita = comLarguraTabela({ ...e5, larguras: [60, 10, 10, 10, 10] }, 30);
  ok(estreita.larguras.every((v) => v >= minimoColuna(30)) && soma(estreita.larguras) === 100, 'largura menor sobe as colunas estreitas', estreita.larguras);
  ok(comLarguraTabela(e, 500).larguraTabela === 100 && comLarguraTabela(e, 2).larguraTabela === 10, 'largura entre 10 e 100');
  const arrastada = comDivisoria([50, 50], { ...e, colunas: 2, larguras: [50, 50] }, 0, 12.3);
  ok(igual(arrastada.larguras, [62.5, 37.5]), 'arrasto anda de 0,5 em 0,5', arrastada.larguras);
  ok(igual(igualar(ajustada).larguras, [20, 20, 20, 20, 20]), 'colunas iguais');
  ok(avisoImpressao(comColunas(e, 10)) === '', 'sem aviso com 10 colunas a 100%');
  ok(/cabem até 17/.test(avisoImpressao(comColunas(e, 20))), 'aviso com 20 colunas', avisoImpressao(comColunas(e, 20)));
  ok(/Aumente a largura/.test(avisoImpressao(comLarguraTabela(comColunas(e, 10), 40))), 'aviso sugere aumentar a largura');
}

// ---------------------------------------------------------------- diálogo desenhado
{
  const { document } = parseHTML('<!doctype html><html><head></head><body></body></html>');
  // O h() do sei-comum cria no document global, como na página.
  (globalThis as unknown as { document: unknown }).document = document;
  const temasSei = [
    { classeCss: 'infra-doc-tabela__zcb', cabecalhos: { linha: true } },
    { classeCss: 'infra-doc-tabela__zcbplepcsf', cabecalhos: { linha: true, coluna: true } },
  ];
  let ultimo = novoEstado();
  const d = montarDialogo(document as unknown as Document, novoEstado(), { temas: temasSei, estilos: ESTILOS_IMAGEM, existe: false }, (e) => {
    ultimo = e;
  });
  document.body.append(d.raiz);
  ok(document.getElementById('spro-tabela-colunas-css'), 'css do dialogo entra uma vez');
  ok(d.raiz.querySelectorAll('.spro-tc-seg').length === 3, 'barra com 3 segmentos');
  ok(d.raiz.querySelectorAll('.spro-tc-div').length === 2, '2 divisorias');
  ok(d.raiz.querySelectorAll('.spro-tc-campos input').length === 3, '3 campos de largura');
  const botoesTema = d.raiz.querySelectorAll('.spro-tc-tema');
  ok(botoesTema.length === 3, 'sem tema + 2 temas do SEI');
  ok(d.raiz.querySelector('table.infra-doc-tabela__zcbplepcsf tbody th'), 'miniatura com coluna de cabecalho');
  ok(d.raiz.querySelector('.spro-tc-temas.infra-doc'), 'miniaturas dentro de .infra-doc (folha do SEI)');
  ok(!d.raiz.innerHTML.includes('<script'), 'sem script');

  const colunas = d.raiz.querySelectorAll('fieldset input[type=number]')[1] as HTMLInputElement;
  colunas.value = '4';
  colunas.dispatchEvent(new (document.defaultView as unknown as typeof globalThis).Event('change'));
  ok(ultimo.colunas === 4 && d.raiz.querySelectorAll('.spro-tc-seg').length === 4, 'mudar colunas redesenha a barra', ultimo.colunas);
  const campo0 = d.raiz.querySelector('.spro-tc-campos input') as HTMLInputElement;
  campo0.value = '55';
  campo0.dispatchEvent(new (document.defaultView as unknown as typeof globalThis).Event('change'));
  ok(ultimo.larguras[0] === 55 && soma(ultimo.larguras) === 100, 'campo de largura muda o estado', ultimo.larguras);
  ok((d.raiz.querySelector('.spro-tc-seg') as HTMLElement).textContent === '55%', 'segmento mostra a %');
  (botoesTema[2] as HTMLElement).click();
  ok(ultimo.tema === 'infra-doc-tabela__zcbplepcsf' && ultimo.cabecalho, 'escolher tema liga o cabecalho');
  ok(botoesTema.length === 3 && d.ler().tema === 'infra-doc-tabela__zcbplepcsf', 'ler devolve o estado');

  // Modelos de texto.
  const grupos = [d.raiz.querySelector('[aria-label="Tamanho da letra"]'), d.raiz.querySelector('[aria-label="Alinhamento"]')];
  const botoesDe = (i: number) => Array.from(grupos[i]?.querySelectorAll('button') ?? []) as unknown as HTMLButtonElement[];
  ok(igual(botoesDe(0).map((b) => b.textContent), ['8 pt (menor)', '10 pt (menor)', '11 pt (padrão)', '12 pt (maior)']), 'botoes de tamanho', botoesDe(0).map((b) => b.textContent));
  ok(igual(botoesDe(1).map((b) => b.textContent), ['Esquerda', 'Centralizado', 'Direita']), 'botoes de alinhamento');
  ok(d.ler().estiloCelulas === 'Tabela_Texto_Alinhado_Esquerda' && d.ler().estiloCabecalho === 'Tabela_Texto_Centralizado', 'tabela nova: 11 pt e cabecalho centralizado', [d.ler().estiloCelulas, d.ler().estiloCabecalho]);
  botoesDe(0)[3].click(); // 12 pt
  ok(d.ler().estiloCelulas === 'Tabela_Texto_Alinhado_Esquerda_12pt' && d.ler().estiloCabecalho === 'Tabela_Centralizado_12', '12 pt', [d.ler().estiloCelulas, d.ler().estiloCabecalho]);
  ok(botoesDe(1)[2].disabled, '12 pt: direita desabilitada');
  botoesDe(1)[1].click(); // centralizado
  ok(d.ler().estiloCelulas === 'Tabela_Centralizado_12', 'centralizado 12 pt');
  botoesDe(0)[2].click(); // volta a 11 pt
  ok(d.ler().estiloCelulas === 'Tabela_Texto_Centralizado', 'centralizado 11 pt e o Tabela_Texto_Centralizado');
  ok(/Tabela_Texto_Centralizado/.test(d.raiz.textContent ?? ''), 'nome do estilo do SEI aparece');
  ok(d.raiz.querySelector('.spro-tc-previa td[style*="text-align:center"]'), 'previa centralizada');

  // Bordas: com tema do SEI, nada; sem tema, a tabela nova sai com a grade gravada.
  ok(d.ler().bordas === null && (document.getElementById('spro-tc-bordas') as HTMLInputElement).disabled, 'com tema: bordas desligadas');
  (botoesTema[0] as HTMLElement).click();
  ok(d.ler().bordas?.ligadas.vertical === true && d.ler().bordas?.traco.larguraPt === 1, 'sem tema: todas as bordas, 1 pt', d.ler().bordas);
  (d.raiz.querySelector('.spro-tc-aresta-superior') as HTMLElement).click();
  ok(d.ler().bordas?.ligadas.superior === false && d.ler().bordas?.ligadas.inferior === true, 'clicar na linha de cima desliga so ela');
  const botaoDupla = Array.from(d.raiz.querySelectorAll('[aria-label="Estilo da linha"] button')).find((b) => b.textContent === 'Dupla') as HTMLElement;
  botaoDupla.click();
  ok(d.ler().bordas?.traco.larguraPt === 2.25, 'dupla sobe a espessura');
  (botoesTema[2] as HTMLElement).click();

  // Personalizar o tema: libera bordas e cores.
  const persCx = document.getElementById('spro-tc-pers') as unknown as HTMLInputElement;
  ok(d.ler().bordas === null && d.ler().personalizado === null, 'tema sem personalizar: nada gravado celula a celula');
  persCx.checked = true;
  persCx.dispatchEvent(new (document.defaultView as unknown as typeof globalThis).Event('change'));
  ok(d.ler().personalizado?.listrasCor === '#e5e5e5' && d.ler().bordas !== null, 'personalizar: listras do tema e bordas liberadas', d.ler());
  ok(!(document.getElementById('spro-tc-bordas') as HTMLInputElement).disabled, 'aba Bordas liberada com tema personalizado');
  const azul = d.raiz.querySelector('[aria-label="Cor do cabeçalho"] button[aria-label="Azul escuro"]') as HTMLElement;
  azul.click();
  ok(d.ler().personalizado?.cabecalhoCor === '#1f4e79', 'cor do cabecalho escolhida');
  const thPrevia = d.raiz.querySelector('.spro-tc-previa-tema th') as HTMLElement;
  ok(/background:#1f4e79/.test(thPrevia?.getAttribute('style') ?? '') && /color:#fff/.test(thPrevia?.getAttribute('style') ?? ''), 'previa: cabecalho azul com texto branco', thPrevia?.getAttribute('style'));
  ok(d.raiz.querySelector('.spro-tc-previa-tema [rowspan="2"]'), 'previa mostra a 1a coluna mesclada');
  persCx.checked = false;
  persCx.dispatchEvent(new (document.defaultView as unknown as typeof globalThis).Event('change'));
  ok(d.ler().personalizado === null && d.ler().bordas === null, 'desmarcar volta ao tema do SEI');

  const edicao = montarDialogo(document as unknown as Document, { ...novoEstado(), existe: true, colunas: 2, larguras: [30, 70] }, { temas: [], estilos: [], existe: true });
  ok(!edicao.raiz.querySelector('input[max="500"]'), 'tabela existente nao pede linhas e colunas');
  ok(edicao.raiz.querySelector('.spro-tc-limpeza #spro-tc-limpar'), 'tabela existente: limpeza fora das abas');
  {
    const abas = Array.from(d.raiz.querySelectorAll('[role=tab]')) as unknown as HTMLElement[];
    const paineis = Array.from(d.raiz.querySelectorAll('[role=tabpanel]')) as unknown as HTMLElement[];
    ok(igual(abas.map((a) => a.textContent), ['Tamanho e colunas', 'Tema', 'Bordas', 'Texto']), 'quatro abas', abas.map((a) => a.textContent));
    ok(paineis.filter((p) => !p.hidden).length === 1 && !paineis[0].hidden, 'so a 1a aba aberta');
    abas[2].click();
    ok(paineis[2].hidden === false && paineis[0].hidden && abas[2].getAttribute('aria-selected') === 'true', 'clicar abre a aba de bordas');
    abas[2].dispatchEvent(Object.assign(new (document.defaultView as unknown as typeof globalThis).Event('keydown'), { key: 'ArrowRight' }));
    ok(!paineis[3].hidden, 'seta para a direita vai para Texto');
    ok(edicao.raiz.querySelectorAll('[role=tab]').length === 3, 'sem temas: sem a aba Tema');
  }
  ok(!edicao.raiz.querySelector('.spro-tc-temas'), 'sem temas no editor: sem quadro de tema');
  ok(document.querySelectorAll('#spro-tabela-colunas-css').length === 1, 'css nao duplica');
}

// ---------------------------------------------------------------- editor falso
interface No {
  name: string;
  attrs: Map<string, unknown>;
  children: No[];
  parent?: No;
  root: { rootName: string };
  is(tipo: string, nome?: string): boolean;
  getAttribute(k: string): unknown;
  hasAttribute(k: string): boolean;
  getAttributeKeys(): IterableIterator<string>;
}
function no(name: string, attrs: Record<string, unknown> = {}, children: No[] = [], raiz = 'main'): No {
  const n: No = {
    name,
    attrs: new Map(Object.entries(attrs)),
    children,
    root: { rootName: raiz },
    is: (tipo, nome) => tipo === 'element' && (!nome || nome === name),
    getAttribute: (k) => n.attrs.get(k),
    hasAttribute: (k) => n.attrs.has(k),
    getAttributeKeys: () => n.attrs.keys(),
  };
  for (const c of children) c.parent = n;
  return n;
}
function* andar(n: No): Generator<{ item: No }> {
  yield { item: n };
  for (const c of n.children) yield* andar(c);
}
function tabelaFalsa(colunas: number, linhas: number, attrs: Record<string, unknown> = {}, raiz = 'main'): No {
  const rows = Array.from({ length: linhas }, () =>
    no('tableRow', {}, Array.from({ length: colunas }, () => no('tableCell', { tableCellWidth: '120px', htmlTdAttributes: { styles: { width: '120px', 'white-space': 'nowrap', color: 'red' } } }, [no('paragraph', { estilo: 'Texto_Justificado' }, [], raiz)], raiz)), raiz),
  );
  return no('table', attrs, rows, raiz);
}
function editorFalso(opcoes: { tabelaNaSelecao?: No | null; grupo?: string[] } = {}) {
  const log: string[] = [];
  let selecao: No | null = opcoes.tabelaNaSelecao ?? null;
  const writer = {
    setAttribute: (k: string, v: unknown, n: No) => {
      n.attrs.set(k, v);
      log.push(`set ${n.name}.${k}`);
    },
    removeAttribute: (k: string, n: No) => {
      n.attrs.delete(k);
      log.push(`remove ${n.name}.${k}`);
    },
    setSelection: (n: No) => {
      selecao = n;
      log.push('selecao');
    },
  };
  const estilos: Record<string, { permitidoEm: string[] }> = {
    Tabela_Texto_Alinhado_Esquerda: { permitidoEm: ['main'] },
    Tabela_Texto_Centralizado: { permitidoEm: ['main', 'anexos'] },
    Texto_Justificado: { permitidoEm: ['main'] },
  };
  const plugins: Record<string, unknown> = {
    TableUtils: {
      getColumns: (t: No) => t.children[0]?.children.length ?? 0,
      getRows: (t: No) => t.children.length,
      setHeadingRowsCount: (w: typeof writer, t: No, n: number) => (n ? w.setAttribute('headingRows', n, t) : w.removeAttribute('headingRows', t)),
    },
    TemaTabelaEditing: { temas: [{ classeCss: 'infra-doc-tabela__zcb', cabecalhos: { linha: true } }] },
    EstiloEditing: { estilos },
    TableColumnResizeEditing: {
      getColumnGroupElement: () => (opcoes.grupo ? {} : null),
      getTableColumnsWidths: () => opcoes.grupo,
    },
  };
  const comandos: Record<string, { isEnabled: boolean }> = { insertTable: { isEnabled: true }, temaTabela: { isEnabled: true }, resizeColumnWidths: { isEnabled: true } };
  let mudancas = 0;
  const editor = {
    log,
    get mudancas() {
      return mudancas;
    },
    isReadOnly: false,
    plugins: { has: (n: string) => n in plugins, get: (n: string) => plugins[n] },
    commands: { get: (n: string) => comandos[n] },
    editing: { view: { document: { getRoot: () => ({ isReadOnly: false }) } }, mapper: { toViewElement: () => null } },
    conversion: {},
    model: {
      schema: { checkAttribute: () => true },
      document: {
        selection: {
          getSelectedElement: () => null,
          getFirstPosition: () => ({ root: { rootName: 'main' }, findAncestor: () => selecao }),
        },
      },
      createRangeOn: (n: No) => ({ getWalker: () => andar(n) }),
      createRangeIn: (n: No) => ({ getWalker: () => andar(n) }),
      change: (fn: (w: typeof writer) => void) => {
        mudancas++;
        fn(writer);
      },
    },
    execute: (cmd: string, arg?: Record<string, unknown> | string) => {
      log.push(`exec ${cmd}`);
      if (cmd === 'insertTable' && typeof arg === 'object') selecao = tabelaFalsa(arg.columns as number, arg.rows as number);
      if (cmd === 'temaTabela' && selecao) {
        if (arg) {
          selecao.attrs.set('temaTabela', arg);
          selecao.attrs.set('headingRows', 1);
        } else selecao.attrs.delete('temaTabela');
      }
      if (cmd === 'resizeColumnWidths' && typeof arg === 'object') {
        const t = arg.table as No;
        t.attrs.set('tableWidth', arg.tableWidth);
        t.attrs.set('columnWidths', (arg.columnWidths as string[]).join(','));
      }
    },
  };
  return editor;
}

{
  // Tabela nova.
  const ed = editorFalso();
  const t = aplicar(ed, null, {
    linhas: 2,
    colunas: 3,
    larguraTabela: 80,
    larguras: [20, 30, 50],
    tema: 'infra-doc-tabela__zcb',
    cabecalho: true,
    estiloCelulas: 'Tabela_Texto_Alinhado_Esquerda',
    estiloCabecalho: 'Tabela_Texto_Centralizado',
    limpar: false,
    bordas: null,
    personalizado: null,
    posicao: '',
  }) as unknown as No;
  ok(t && t.name === 'table', 'tabela nova inserida');
  ok(ed.mudancas === 1, 'uma so mudanca no model (um Ctrl+Z desfaz tudo)');
  const ordem = ed.log.filter((l) => l.startsWith('exec'));
  ok(igual(ordem, ['exec insertTable', 'exec temaTabela', 'exec resizeColumnWidths']), 'ordem: inserir, tema, larguras', ordem);
  ok(t.getAttribute('tableWidth') === '80%' && t.getAttribute('columnWidths') === '20%,30%,50%', 'larguras em %', [t.getAttribute('tableWidth'), t.getAttribute('columnWidths')]);
  ok(t.getAttribute('temaTabela') === 'infra-doc-tabela__zcb' && t.getAttribute('headingRows') === 1, 'tema e cabecalho');
  ok((t.getAttribute('htmlTableAttributes') as { styles: Record<string, string> }).styles['word-wrap'] === 'break-word', 'quebra de palavra para o gerador de PDF');
  const celula = t.children[0].children[0];
  ok(!celula.hasAttribute('tableCellWidth'), 'largura da celula em px removida');
  const estiloCel = (celula.getAttribute('htmlTdAttributes') as { styles: Record<string, string> }).styles;
  ok(!('width' in estiloCel) && !('white-space' in estiloCel) && estiloCel.color === 'red', 'tira width e nowrap e mantem a cor', estiloCel);
  ok(celula.children[0].getAttribute('estilo') === 'Tabela_Texto_Centralizado', 'cabecalho com o estilo centralizado');
  ok(t.children[1].children[0].children[0].getAttribute('estilo') === 'Tabela_Texto_Alinhado_Esquerda', 'corpo com o estilo das celulas');
}
{
  // Tabela existente, sem mudar tema, tirando cabeçalho e sem mexer no estilo.
  const existente = tabelaFalsa(2, 3, { temaTabela: 'infra-doc-tabela__zcb', headingRows: 1, tableWidth: '600px' });
  const ed = editorFalso({ tabelaNaSelecao: existente, grupo: ['5.73%', '94.27%'] });
  const lida = lerTabela(ed, existente);
  ok(lida.colunas === 2 && lida.linhas === 3 && igual(lida.larguras, [5.73, 94.27]), 'le colunas e larguras do colgroup', lida);
  ok(lida.larguraTabela === 100 && lida.tema === 'infra-doc-tabela__zcb' && lida.cabecalho, 'largura em px sem tela: 100%; tema e cabecalho lidos', lida);
  ok(lida.estiloCelulas === 'Texto_Justificado', 'estilo comum das celulas');
  aplicar(ed, existente, { ...lida, larguraTabela: 90, larguras: [30, 70], cabecalho: false, estiloCelulas: '', estiloCabecalho: '' });
  ok(!ed.log.includes('exec temaTabela'), 'tema igual: comando do tema nao roda');
  ok(!existente.hasAttribute('headingRows'), 'cabecalho removido');
  ok(existente.getAttribute('tableWidth') === '90%' && existente.getAttribute('columnWidths') === '30%,70%', 'px vira %');
  ok(existente.children[0].children[0].children[0].getAttribute('estilo') === 'Texto_Justificado', 'estilo das celulas intocado');
}
{
  // Tabela apagada enquanto o diálogo estava aberto.
  const apagada = tabelaFalsa(2, 2, {}, '$graveyard');
  const ed = editorFalso({ tabelaNaSelecao: apagada });
  ok(aplicar(ed, apagada, { ...novoEstado(), colunas: 2, larguras: [50, 50] }) === null && ed.mudancas === 0, 'tabela apagada: nada muda');
}
{
  const ed = editorFalso();
  ok(igual(estilosDeTabela(ed, 'anexos'), ['Tabela_Texto_Centralizado']), 'estilos de tabela por secao');
  ok(estilosDeTabela(ed, 'main').length === 2, 'so estilos Tabela_*');
  ok(temas(ed).length === 1, 'temas do plugin do SEI');
}

// ---------------------------------------------------------------- zebra pela 1ª coluna
{
  const c = (rowspan = 1, colspan = 1) => ({ rowspan, colspan });
  // Cabeçalho + 4 linhas; a 1ª célula da linha 2 do corpo desce até a 3.
  const grade = [[c(), c(), c()], [c(), c(), c()], [c(2), c(), c()], [c(), c()], [c(), c(), c()]];
  ok(igual(colunasDasCelulas(grade)[3], [1, 2]), 'linha coberta pela mesclagem comeca na coluna 1', colunasDasCelulas(grade));
  ok(igual(gruposPelaPrimeiraColuna(grade, 1), [-1, 0, 1, 1, 2]), 'linhas 2 e 3 do corpo no mesmo grupo', gruposPelaPrimeiraColuna(grade, 1));
  const zcb = pinturaZebra(grade, 'infra-doc-tabela__zcb', 1, 0);
  ok(zcb && zcb[0].every((v) => v === null), 'cabecalho sem marca');
  ok(zcb && zcb[2][0] === CINZA && zcb[3].every((v) => v === CINZA), 'grupo mesclado inteiro cinza (zcb: 2o grupo)', zcb);
  ok(zcb && zcb[1][0] === BRANCO && zcb[4][0] === BRANCO, 'grupos vizinhos brancos');
  const elegante = pinturaZebra(grade, 'infra-doc-tabela__elegante', 1, 0);
  ok(elegante && elegante[1][0] === CINZA && elegante[2][0] === BRANCO, 'elegante com cabecalho: 1o grupo cinza');
  const fc = pinturaZebra(grade, 'infra-doc-tabela__zcfcbplpccfp', 1, 1);
  ok(fc && fc[1][0] === null && fc[1][1] === BRANCO && fc[3][0] === CINZA, 'coluna de cabecalho fica com a cor do tema', fc);
  ok(pinturaZebra([[c(), c()], [c(), c()], [c(), c()]], 'infra-doc-tabela__zcb', 1, 0) === null, 'sem mesclagem: o tema do SEI pinta sozinho');
  ok(pinturaZebra(grade, 'infra-doc-tabela__academico', 1, 0) === null, 'tema sem zebra: nada');
  ok(pinturaZebra(grade, '', 1, 0) === null, 'sem tema: nada');
}
{
  // No model: pinta, e tira as marcas quando a mesclagem some.
  const t = tabelaFalsa(2, 4, { temaTabela: 'infra-doc-tabela__zcb', headingRows: 1 });
  t.children[2].children[0].attrs.set('rowspan', 2);
  t.children[3].children.splice(0, 1);
  const ed = editorFalso({ tabelaNaSelecao: t });
  const w = { setAttribute: (k: string, v: unknown, n: No) => n.attrs.set(k, v), removeAttribute: (k: string, n: No) => n.attrs.delete(k) };
  ok(ajustarZebra(ed, w, t), 'mudou ao pintar');
  const fundo = (r: number, i: number) => t.children[r].children[i].getAttribute('tableCellBackgroundColor');
  ok(fundo(2, 0) === CINZA && fundo(3, 0) === CINZA && fundo(1, 0) === BRANCO && fundo(0, 0) === undefined, 'cores no model', [fundo(0, 0), fundo(1, 0), fundo(2, 0), fundo(3, 0)]);
  ok(!ajustarZebra(ed, w, t), 'segunda vez nao muda (post-fixer para)');
  t.children[0].children[0].attrs.set('tableCellBackgroundColor', '#ff0000');
  t.attrs.set('temaTabela', 'infra-doc-tabela__academico');
  ok(ajustarZebra(ed, w, t) && fundo(2, 0) === undefined && fundo(1, 0) === undefined, 'tema sem zebra: marcas tiradas');
  ok(fundo(0, 0) === '#ff0000', 'cor do usuario fica');
}

// ---------------------------------------------------------------- bordas (contas)
{
  const c = (rowspan = 1, colspan = 1) => ({ rowspan, colspan });
  const g3 = [[c(), c(), c()], [c(), c(), c()], [c(), c(), c()]];
  const cx = caixasDasCelulas(g3);
  const toda = regiaoDe(cx);
  ok(igual(toda, { r0: 0, c0: 0, r1: 2, c1: 2 }), 'regiao: tabela inteira', toda);
  const externas = ladosDasCelulas(cx, toda!, PREDEFINIDAS.externas);
  ok(igual(externas[0][0], { top: true, bottom: false, left: true, right: false }), 'externas: canto', externas[0][0]);
  ok(igual(externas[1][1], { top: false, bottom: false, left: false, right: false }), 'externas: miolo sem borda');
  const meio = regiaoDe(cx, [[1, 1], [1, 2]]);
  const sel = ladosDasCelulas(cx, meio!, PREDEFINIDAS.todas);
  ok(igual(sel[0][1], { bottom: true }) && igual(sel[1][0], { right: true }) && igual(sel[2][2], { top: true }), 'vizinhas recebem o lado encostado', [sel[0][1], sel[1][0], sel[2][2]]);
  ok(igual(sel[0][0], {}), 'celula longe fica como esta');
  const nenhuma = ladosDasCelulas(cx, meio!, PREDEFINIDAS.nenhuma);
  ok(nenhuma[0][1].bottom === false, 'apagar tambem apaga o lado da vizinha (borda colada)');
  const mesc = caixasDasCelulas([[c(2), c()], [c()]]);
  ok(igual(mesc[0][0], { r0: 0, c0: 0, r1: 1, c1: 0 }) && mesc[1][0].c0 === 1, 'mesclada ocupa duas linhas', mesc);
  ok(mesclarLados('solid', { top: 'none' })?.toString() === '[object Object]', 'um lado diferente vira objeto');
  ok(mesclarLados({ top: 'none' }, { top: 'solid', right: 'solid', bottom: 'solid', left: 'solid' }) === 'solid', '4 lados iguais viram texto');
  ok(tracoValido({ estilo: 'double', larguraPt: 1, cor: '#000000' }).larguraPt === 2.25, 'dupla sobe para 2,25 pt');
  ok(tracoValido({ estilo: 'solid', larguraPt: 1, cor: 'javascript:x' }).cor === '#000000', 'cor invalida vira preto');
}
{
  // Bordas no model.
  const t = tabelaFalsa(3, 3);
  const ed = editorFalso({ tabelaNaSelecao: t });
  const base = { ...lerTabela(ed, t), tema: '', limpar: false };
  aplicar(ed, t, { ...base, bordas: desenhoPadrao() });
  const cel = (r: number, i: number) => t.children[r].children[i];
  ok(cel(1, 1).getAttribute('tableCellBorderStyle') === 'solid' && cel(1, 1).getAttribute('tableCellBorderWidth') === '1pt' && cel(1, 1).getAttribute('tableCellBorderColor') === '#000000', 'todas: 1 pt continua preta', [...cel(1, 1).attrs.entries()]);
  ok(t.getAttribute('tableBorderStyle') === 'none', 'borda da tabela sai (a das celulas vale)');
  const t2 = tabelaFalsa(3, 3);
  const ed2 = editorFalso({ tabelaNaSelecao: t2 });
  const sel = [t2.children[1].children[1], t2.children[1].children[2]];
  aplicar(ed2, t2, { ...base, bordas: { ...desenhoPadrao(), onde: 'selecao', ligadas: { ...PREDEFINIDAS.externas } } }, sel);
  ok(igual(t2.children[1].children[1].getAttribute('tableCellBorderStyle'), { top: 'solid', right: 'none', bottom: 'solid', left: 'solid' }), 'selecao: lados externos', t2.children[1].children[1].getAttribute('tableCellBorderStyle'));
  ok(igual(t2.children[0].children[1].getAttribute('tableCellBorderStyle'), { bottom: 'solid' }) && !t2.children[0].children[0].hasAttribute('tableCellBorderStyle'), 'vizinha de cima recebe so o lado de baixo');
  ok(!t2.hasAttribute('tableBorderStyle'), 'so a selecao: borda da tabela fica');
  const t3 = tabelaFalsa(2, 2);
  const ed3 = editorFalso({ tabelaNaSelecao: t3 });
  aplicar(ed3, t3, { ...base, colunas: 2, larguras: [50, 50], tema: 'infra-doc-tabela__zcb', bordas: desenhoPadrao() });
  ok(!t3.children[0].children[0].hasAttribute('tableCellBorderStyle'), 'com tema do SEI nao desenha');
}
{
  // Limpeza da formatação colada.
  const t = tabelaFalsa(2, 2, { tableAlignment: 'left', htmlTableAttributes: { attributes: { border: '1', cellpadding: '4' } } });
  const c0 = t.children[0].children[0];
  c0.attrs.set('tableCellBackgroundColor', '#ffff00');
  c0.attrs.set('tableCellPadding', '10px');
  c0.attrs.set('rowspan', 1);
  const p = c0.children[0];
  p.attrs.set('alignment', 'center');
  p.attrs.set('htmlPAttributes', { classes: ['MsoNormal'], styles: { 'line-height': '115%' } });
  const ed = editorFalso({ tabelaNaSelecao: t });
  const lida = lerTabela(ed, t);
  ok(lida.sujeira === 13 && !lida.jaTratada, 'conta a sujeira (4 celulas x 2 + 5; a posicao nao conta)', lida.sujeira);
  ok(novoEstado(lida).limpar, '1a vez com sujeira: limpeza ligada');
  aplicar(ed, t, { ...novoEstado(lida), tema: '' });
  ok(t.getAttribute('tableAlignment') === 'left' && !c0.hasAttribute('tableCellBackgroundColor') && !c0.hasAttribute('tableCellPadding'), 'tabela e celula limpas, posicao mantida');
  ok(!p.hasAttribute('alignment') && !p.hasAttribute('htmlPAttributes') && p.getAttribute('estilo') === 'Texto_Justificado', 'paragrafo limpo e estilo do SEI mantido');
  ok(c0.getAttribute('rowspan') === 1, 'mesclagem mantida');
  ok(igual(t.getAttribute('htmlTableAttributes'), { styles: { 'word-wrap': 'break-word' } }), 'atributos colados saem, fica so a quebra', t.getAttribute('htmlTableAttributes'));
  const relida = lerTabela(ed, t);
  ok(relida.jaTratada && relida.sujeira === 0 && !novoEstado(relida).limpar, '2a vez: ja tratada, limpeza desligada', relida);
}

// ---------------------------------------------------------------- tema personalizado
{
  const { p, bordas } = partirDoTema('infra-doc-tabela__zcbeplcfp', {}, true);
  ok(p.cabecalhoCor === '#000000' && p.listrasCor === '#e5e5e5' && !p.primeiroListrado, 'parte do tema: cabecalho preto, listras cinza', p);
  ok(bordas.traco.cor === '#999999' && bordas.ligadas.vertical, 'parte do tema: bordas cinza dele', bordas);
  const ele = partirDoTema('infra-doc-tabela__elegante', {}, true);
  ok(!ele.bordas.ligadas.vertical && ele.bordas.ligadas.horizontal && ele.p.primeiroListrado, 'elegante: sem verticais, 1a listrada');
  ok(partirDoTema('infra-doc-tabela__academico').p.listrasCor === '', 'academico: sem listras');
  ok(paraMarca('#E5E5E5') === 'rgb(229,229,229)' && deMarca('rgb(229,229,229)') === '#e5e5e5', 'marca rgb sem espacos e volta');
  ok(escuro('#000000') && escuro('#1f4e79') && !escuro('#e5e5e5') && !escuro('#fff2cc'), 'fundo escuro pede texto branco');
  const c = (rowspan = 1) => ({ rowspan, colspan: 1 });
  const grade = [[c(), c()], [c(), c()], [c(2), c()], [c()]];
  const pin = pinturaPersonalizada(grade, 1, 0, { cabecalhoCor: '#1f4e79', listrasCor: '#dbe5f1', primeiroListrado: false });
  ok(pin[0][0].fundo === '#1f4e79' && pin[0][0].cabecalho, 'cabecalho com a cor escolhida');
  ok(pin[1][0].fundo === 'rgb(255,255,255)' && pin[2][0].fundo === 'rgb(219,229,241)' && pin[3][0].fundo === 'rgb(219,229,241)', 'listras pela 1a coluna', pin);
  const lidas = lerListras(grade, pin.map((l) => l.map((x) => x.fundo ?? undefined)), 1, 0);
  ok(igual(lidas, { listrasCor: '#dbe5f1', primeiroListrado: false }), 'le as listras de volta', lidas);
  const comNova = [[c(), c()], [c(), c()], ...grade.slice(1)];
  const fundosNova = [[undefined, undefined], [undefined, undefined], ...pin.slice(1).map((l) => l.map((x) => x.fundo ?? undefined))];
  ok(lerListras(comNova, fundosNova, 1, 0)?.listrasCor === '#dbe5f1', 'linha nova sem cor nao apaga as listras');
}
{
  // No model: tema do SEI personalizado.
  const t = tabelaFalsa(2, 4, { temaTabela: 'infra-doc-tabela__zcb', headingRows: 1 });
  const ed = editorFalso({ tabelaNaSelecao: t });
  const lida = lerTabela(ed, t);
  ok(lida.personalizado === null, 'tabela com tema: nao personalizada');
  const { p, bordas } = partirDoTema('infra-doc-tabela__zcb', {}, true);
  aplicar(ed, t, { ...lida, colunas: 2, larguras: [50, 50], personalizado: { ...p, cabecalhoCor: '#000000' }, bordas });
  ok(ed.log.includes('exec temaTabela') && !t.hasAttribute('temaTabela'), 'personalizada sai sem a classe do tema');
  const fundo = (r: number, i: number) => t.children[r].children[i].getAttribute('tableCellBackgroundColor');
  ok(fundo(0, 0) === '#000000' && fundo(1, 0) === 'rgb(255,255,255)' && fundo(2, 0) === 'rgb(229,229,229)', 'cores gravadas', [fundo(0, 0), fundo(1, 0), fundo(2, 0)]);
  ok(t.children[1].children[1].getAttribute('tableCellBorderStyle') === 'solid', 'bordas gravadas apesar do tema escolhido');
  // Mesclar a 1ª coluna das linhas 2 e 3 do corpo: o post-fixer refaz as listras por grupo.
  t.children[2].children[0].attrs.set('rowspan', 2);
  t.children[3].children.splice(0, 1);
  const w = { setAttribute: (k: string, v: unknown, n: No) => n.attrs.set(k, v), removeAttribute: (k: string, n: No) => n.attrs.delete(k) };
  ajustarZebra(ed, w, t);
  ok(fundo(2, 0) === 'rgb(229,229,229)' && fundo(3, 0) === 'rgb(229,229,229)', 'grupo mesclado com a mesma listra', [fundo(2, 0), fundo(3, 0)]);
  const relida = lerTabela(ed, t);
  ok(relida.personalizado?.listrasCor === '#e5e5e5' && relida.personalizado?.cabecalhoCor === '#000000', 'reabrir le a personalizacao', relida.personalizado);
  aplicar(ed, t, { ...relida, personalizado: null, bordas: null, limpar: false });
  ok(fundo(0, 0) === undefined && fundo(2, 0) === undefined, 'sem personalizar: cores saem');
}

// ---------------------------------------------------------------- posição na página
{
  ok(posicaoDe('blockLeft') === 'esquerda' && posicaoDe('left') === 'esquerda' && posicaoDe('blockRight') === 'direita' && posicaoDe('center') === 'centro' && posicaoDe(undefined) === 'centro', 'valores do CK5 viram esquerda/centro/direita');
  // CK5 sem blockLeft (sem `data` no falso): esquerda vira `left`.
  const ed = editorFalso();
  const t = aplicar(ed, null, { ...novoEstado(), posicao: 'esquerda' }) as unknown as No;
  ok(t.getAttribute('tableAlignment') === 'left', 'tabela nova a esquerda', t.getAttribute('tableAlignment'));
  ok(ed.mudancas === 1, 'posicao na mesma mudanca');
  const ed2 = editorFalso();
  const t2 = aplicar(ed2, null, { ...novoEstado(), posicao: 'centro' }) as unknown as No;
  ok(!t2.hasAttribute('tableAlignment'), 'centralizada = padrao do editor, sem atributo');
  // Existente em blockRight: lida como direita; centralizar tira o atributo; a limpeza não conta nem tira a posição.
  const existente = tabelaFalsa(2, 2, { tableAlignment: 'blockRight' });
  const ed3 = editorFalso({ tabelaNaSelecao: existente });
  const lida = lerTabela(ed3, existente);
  ok(lida.posicao === 'direita', 'le a posicao da tabela existente', lida.posicao);
  aplicar(ed3, existente, { ...lida, limpar: true });
  ok(existente.getAttribute('tableAlignment') === 'blockRight', 'limpeza mantem a posicao escolhida');
  aplicar(ed3, existente, { ...lida, posicao: 'centro' });
  ok(!existente.hasAttribute('tableAlignment'), 'centralizar remove o atributo');
  // CK5 novo: a conversão de teste devolve blockLeft → esquerda em bloco (o texto não corre ao lado).
  const ed4 = editorFalso() as ReturnType<typeof editorFalso> & { data?: unknown };
  const tabelaTeste = no('table', { tableAlignment: 'blockLeft' });
  ed4.data = { processor: { toView: () => ({}) }, toModel: () => no('$documentFragment', {}, [tabelaTeste]) };
  ok(temPosicaoEmBloco(ed4), 'detecta alinhamento em bloco');
  const t4 = aplicar(ed4, null, { ...novoEstado(), posicao: 'direita' }) as unknown as No;
  ok(t4.getAttribute('tableAlignment') === 'blockRight', 'direita em bloco', t4.getAttribute('tableAlignment'));
  ok(!temPosicaoEmBloco(editorFalso()), 'sem conversao: sem bloco');

  const { document } = parseHTML('<!doctype html><html><body></body></html>');
  const doc = document as unknown as Document;
  const d = montarDialogo(doc, { ...novoEstado(), larguraTabela: 70 }, { temas: [], estilos: [], existe: false, posicao: true, posicaoFlutua: true });
  const grupo = d.raiz.querySelector('[aria-label="Posição na página"]');
  const botoes = Array.from(grupo?.querySelectorAll('button') ?? []) as HTMLButtonElement[];
  ok(botoes.length === 3 && botoes[1].getAttribute('aria-pressed') === 'true', 'tres posicoes, centralizada marcada', botoes.map((b) => b.textContent));
  botoes[2].click();
  ok(d.ler().posicao === 'direita', 'clicar em Direita');
  ok(/corre ao lado/.test(d.raiz.textContent ?? ''), 'aviso do texto ao lado quando flutua');
  const sem = montarDialogo(doc, novoEstado(), { temas: [], estilos: [], existe: false });
  ok(!sem.raiz.querySelector('[aria-label="Posição na página"]') && sem.ler().posicao === '', 'editor sem a propriedade: sem posicao');
}

// ---------------------------------------------------------------- ícone
{
  const { document } = parseHTML(
    '<!doctype html><html><body><button class="ck ck-button getTabelaColunasButtom"><i class="fab fa-columns rosaColor"></i><span class="ck-button__label">Tabela</span></button></body></html>',
  );
  const botao = document.querySelector('.getTabelaColunasButtom') as unknown as Element;
  desenharIcone(botao);
  desenharIcone(botao);
  const svg = botao.querySelector('svg');
  ok(svg && !botao.querySelector('i'), 'icone em svg no lugar da fonte');
  ok(botao.querySelectorAll('svg').length === 1, 'icone nao duplica');
  ok(/ck-icon/.test(svg?.getAttribute('class') ?? '') && /rosaColor/.test(svg?.getAttribute('class') ?? ''), 'classes do CK5 e cor do SEI Pro', svg?.getAttribute('class'));
  ok(botao.querySelector('.ck-button__label'), 'rotulo preservado');
}

console.log(`${total - falhas}/${total} verificações ok`);
if (falhas) process.exit(1);
