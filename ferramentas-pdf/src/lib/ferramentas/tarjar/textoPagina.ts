/**
 * Costura do texto de uma página e o caminho de volta para as coordenadas.
 *
 * ESTE MÓDULO DECIDE SE A FERRAMENTA FUNCIONA. O `getTextContent()` do pdf.js
 * devolve corridas de fonte, não palavras: `123.456.789-09` chega ao navegador
 * como `["123", ".456.", "789-09"]`, e às vezes com um item por caractere.
 * Uma regex aplicada item a item não encontra praticamente nada — o que
 * produziria a pior falha possível aqui, que é a ferramenta anunciar "nenhum
 * dado sensível encontrado" num documento cheio deles.
 *
 * A saída tem TRÊS partes que trabalham juntas:
 *
 *   1. `texto` — os itens concatenados e costurados, com espaço e quebra de
 *      linha sintéticos onde o PDF apenas reposicionou o cursor. É sobre ele
 *      que rodam os detectores textuais (e-mail, data, rótulo por perto).
 *   2. `compacto` — só letras e dígitos. É sobre ele que rodam os detectores
 *      numéricos, e é o que resolve o número fatiado: `12345678909` é achado
 *      seja o original `123.456.789-09`, `123 456 789 09` ou `123.\n456.789-09`.
 *   3. `origemChar` / `offsetChar` / `indiceCompacto` — o caminho de volta de
 *      um casamento até os itens e, por eles, até as caixas na página.
 *
 * O CUSTO ASSUMIDO DA PROJEÇÃO COMPACTA: remover o espaço também gruda dois
 * números vizinhos que nada têm a ver um com o outro. `1234 5678` vira
 * `12345678` e vira candidato a CEP. Isso é aceito de propósito, porque o erro
 * cai para o lado seguro: sobra marcação, que o usuário revê numa lista, em vez
 * de faltar marcação, que ninguém vê até o dado já estar publicado. Os dígitos
 * verificadores derrubam a maior parte desse ruído antes da tela.
 */

import type { Caixa, ItemDeTexto } from "./geometria";
import { caixaDoItemDeTexto } from "./geometria";

/** Um item do `getTextContent()` já resolvido em posição e caixa. */
export interface ItemPosicionado extends ItemDeTexto {
  /** Caixa do item inteiro, em pontos do espaço do usuário. `null` = degenerado. */
  caixa: Caixa | null;
  /** Altura da fonte em pontos, usada para dilatar a tarja no teste de descarte. */
  alturaFonte: number;
  /** Escrita vertical (CJK). Vem de `styles[fontName].vertical`, não do item. */
  vertical: boolean;
  /** Família declarada em `styles[fontName]`, usada só para medir o texto. */
  fontFamily?: string;
}

export interface TextoPagina {
  /** Índice da página, 1-based. */
  pagina: number;
  texto: string;
  /** Para cada caractere de `texto`: índice do item que o gerou, ou -1. */
  origemChar: Int32Array;
  /** Para cada caractere de `texto`: posição dentro de `item.str`. */
  offsetChar: Int32Array;
  itens: ItemPosicionado[];
  /** Só letras e dígitos. */
  compacto: string;
  /** Para cada caractere de `compacto`: o índice correspondente em `texto`. */
  indiceCompacto: Int32Array;
}

/** O recorte de `getTextContent()` de que precisamos, sem depender dos tipos do pdf.js. */
export interface ConteudoDeTexto {
  items: Array<Partial<ItemDeTexto> & { hasEOL?: boolean }>;
  styles?: Record<string, { vertical?: boolean; fontFamily?: string } | undefined>;
}

/** Só letra ou dígito sobrevive na projeção compacta. */
const ALFANUMERICO = /[0-9\p{L}]/u;

/**
 * Salto ao longo da linha de base que já conta como espaço, em frações da
 * altura da fonte. Muitos geradores não emitem o caractere de espaço: apenas
 * reposicionam o cursor. Sem esta regra, "João Silva" vira "JoãoSilva" e a
 * busca literal por nome não encontra nada.
 */
const FRACAO_ESPACO = 0.25;

/** Salto perpendicular que já conta como quebra de linha. */
const FRACAO_LINHA = 0.5;

function ehFinito(...v: number[]): boolean {
  return v.every((x) => Number.isFinite(x));
}

/** Direção da linha de base e direção vertical do glifo, normalizadas. */
function versores(t: number[]): { ux: number; uy: number; vx: number; vy: number } | null {
  const [a, b, c, d] = t;
  const nb = Math.hypot(a, b);
  const nv = Math.hypot(c, d);
  if (!(nb > 0) || !(nv > 0)) return null;
  return { ux: a / nb, uy: b / nb, vx: c / nv, vy: d / nv };
}

/**
 * Costura os itens numa string única, registrando de onde veio cada caractere.
 *
 * Caracteres sintéticos (o espaço e a quebra que nós inserimos) recebem
 * `origemChar = -1`: eles não existem em item nenhum, e um casamento que caia
 * inteiramente sobre eles não produz caixa alguma.
 */
export function construirTextoPagina(
  pagina: number,
  conteudo: ConteudoDeTexto,
): TextoPagina {
  const itens: ItemPosicionado[] = [];
  const pedacos: string[] = [];
  const origem: number[] = [];
  const offset: number[] = [];

  const empurrar = (texto: string, indiceItem: number, offsetBase: number) => {
    pedacos.push(texto);
    for (let k = 0; k < texto.length; k += 1) {
      origem.push(indiceItem);
      offset.push(indiceItem < 0 ? -1 : offsetBase + k);
    }
  };

  let anterior: ItemPosicionado | null = null;

  for (const bruto of conteudo.items) {
    const str = typeof bruto.str === "string" ? bruto.str : "";
    const transform = Array.isArray(bruto.transform) ? bruto.transform : [];
    const width = typeof bruto.width === "number" ? bruto.width : 0;
    const height = typeof bruto.height === "number" ? bruto.height : 0;
    const fontName = typeof bruto.fontName === "string" ? bruto.fontName : undefined;

    // O item não traz `vertical`: o pdf.js o publica em `styles[fontName]`
    // (verificado em pdf.worker.mjs:35782 e 35844). Escrita vertical fica de
    // fora nesta versão, e "fora" aqui significa DESCARTADA, nunca preservada.
    const estilo = fontName ? conteudo.styles?.[fontName] : undefined;
    const vertical = Boolean(estilo?.vertical);

    const item: ItemPosicionado = {
      str,
      transform,
      width,
      height,
      fontName,
      alturaFonte:
        transform.length >= 4 && ehFinito(transform[2], transform[3])
          ? Math.max(Math.hypot(transform[2], transform[3]), Math.abs(height))
          : Math.abs(height),
      vertical,
      fontFamily: estilo?.fontFamily,
      caixa: null,
    };
    item.caixa = vertical ? null : caixaDoItemDeTexto(item);

    const indice = itens.length;
    itens.push(item);

    // Separador sintético entre o item anterior e este.
    if (anterior && str.length > 0) {
      const sep = separadorEntre(anterior, item);
      if (sep) empurrar(sep, -1, 0);
    }

    if (str.length > 0) empurrar(str, indice, 0);

    if (bruto.hasEOL) empurrar("\n", -1, 0);

    if (str.length > 0) anterior = item;
  }

  const texto = pedacos.join("");

  const compactos: string[] = [];
  const indiceCompacto: number[] = [];
  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    if (ALFANUMERICO.test(c)) {
      compactos.push(c);
      indiceCompacto.push(i);
    }
  }

  return {
    pagina,
    texto,
    origemChar: Int32Array.from(origem),
    offsetChar: Int32Array.from(offset),
    itens,
    compacto: compactos.join(""),
    indiceCompacto: Int32Array.from(indiceCompacto),
  };
}

/** Decide se cabe espaço, quebra de linha ou nada entre dois itens vizinhos. */
function separadorEntre(a: ItemPosicionado, b: ItemPosicionado): string {
  // Se o item anterior já termina em espaço, ou o próximo começa com um, o PDF
  // emitiu o separador e não há o que inventar.
  if (/\s$/.test(a.str) || /^\s/.test(b.str)) return "";

  const va = versores(a.transform);
  if (!va || a.transform.length < 6 || b.transform.length < 6) return "";

  const altura = a.alturaFonte;
  if (!(altura > 0)) return "";

  const fimX = a.transform[4] + va.ux * Math.abs(a.width);
  const fimY = a.transform[5] + va.uy * Math.abs(a.width);
  const dx = b.transform[4] - fimX;
  const dy = b.transform[5] - fimY;
  if (!ehFinito(dx, dy)) return "";

  const aoLongo = dx * va.ux + dy * va.uy;
  const perpendicular = dx * va.vx + dy * va.vy;

  if (Math.abs(perpendicular) > FRACAO_LINHA * altura) return "\n";
  if (aoLongo > FRACAO_ESPACO * altura) return " ";
  return "";
}


/**
 * Medidor de largura de texto.
 *
 * POR QUE ISTO EXISTE, e é um defeito que só apareceu ao rodar a ferramenta
 * sobre um documento real: o PDF costuma emitir uma LINHA INTEIRA como um
 * único item de texto — "CEP: 70070-600 - Brasilia/DF" chega como um item só.
 * Todo casamento é, portanto, parcial, e recortar o item por proporção de
 * CONTAGEM DE CARACTERES pressupõe passo constante, o que é falso em fonte
 * proporcional. O resultado observado foi a tarja do CEP cobrindo "70070-60" e
 * deixando o último dígito à vista.
 *
 * Com um medidor de verdade — no navegador, o `measureText` de um canvas — o
 * recorte passa a respeitar a largura real de cada caractere. Fora do
 * navegador não há canvas, então o recuo é a contagem de caracteres, e por
 * isso a folga aplicada nesse caso é maior.
 *
 * A injeção mantém este módulo livre de DOM, que é o que permite exercitá-lo
 * em Node.
 */
export type MedidorDeTexto = (texto: string, fontFamily?: string) => number;

let medidorAtual: MedidorDeTexto | null = null;

export function configurarMedidorDeTexto(fn: MedidorDeTexto | null): void {
  medidorAtual = fn;
}

/** Folga lateral do recorte parcial, em frações de caractere. */
const FOLGA_MEDIDA = 0.5;
const FOLGA_ESTIMADA = 1.5;

/** Frações de início e fim do recorte de um item, com folga já embutida. */
function fracoesDoRecorte(
  item: ItemPosicionado,
  de: number,
  ate: number,
): { inicio: number; fim: number } {
  const len = item.str.length;
  const folga = (medidorAtual ? FOLGA_MEDIDA : FOLGA_ESTIMADA) / len;

  if (medidorAtual) {
    const total = medidorAtual(item.str, item.fontFamily);
    if (total > 0) {
      const antes = medidorAtual(item.str.slice(0, de), item.fontFamily);
      const ateAqui = medidorAtual(item.str.slice(0, ate), item.fontFamily);
      if (Number.isFinite(antes) && Number.isFinite(ateAqui)) {
        return {
          inicio: Math.max(0, antes / total - folga),
          fim: Math.min(1, ateAqui / total + folga),
        };
      }
    }
  }

  return {
    inicio: Math.max(0, de / len - folga),
    fim: Math.min(1, ate / len + folga),
  };
}

/** Converte um intervalo da projeção compacta para o intervalo em `texto`. */
export function intervaloDoCompacto(
  tp: TextoPagina,
  inicioCompacto: number,
  fimCompacto: number,
): { inicio: number; fim: number } | null {
  if (fimCompacto <= inicioCompacto) return null;
  if (inicioCompacto < 0 || fimCompacto > tp.indiceCompacto.length) return null;
  return {
    inicio: tp.indiceCompacto[inicioCompacto],
    fim: tp.indiceCompacto[fimCompacto - 1] + 1,
  };
}

/** Folga lateral somada a toda caixa de marcação, em pontos. */
export const PADDING_LATERAL_PT = 1.5;

/** Folga vertical, em fração da altura da fonte. */
export const PADDING_VERTICAL_FRACAO = 0.2;

/**
 * Caixas que cobrem um intervalo de `texto`.
 *
 * Um intervalo vira MAIS DE UMA caixa quando atravessa itens em linhas
 * diferentes — o que acontece toda vez que um número quebra no fim da linha.
 * Caixas de itens contíguos na mesma linha de base são fundidas, senão uma
 * frase de doze palavras viraria doze retângulos com fresta entre eles, e a
 * fresta mostraria o topo dos glifos.
 *
 * Quando o casamento cobre o item INTEIRO, usa-se a caixa cheia sem estimativa
 * proporcional. É o caso mais comum, porque o número fatiado costuma ser
 * fatiado em pedaços inteiros, e é também o mais preciso.
 */
export function caixasDoIntervalo(
  tp: TextoPagina,
  inicio: number,
  fim: number,
): Caixa[] {
  const porItem = new Map<number, { de: number; ate: number }>();

  for (let i = inicio; i < fim && i < tp.origemChar.length; i += 1) {
    const indiceItem = tp.origemChar[i];
    if (indiceItem < 0) continue;
    const off = tp.offsetChar[i];
    const atual = porItem.get(indiceItem);
    if (!atual) porItem.set(indiceItem, { de: off, ate: off + 1 });
    else {
      atual.de = Math.min(atual.de, off);
      atual.ate = Math.max(atual.ate, off + 1);
    }
  }

  const caixas: Caixa[] = [];
  for (const [indiceItem, faixa] of [...porItem.entries()].sort((a, b) => a[0] - b[0])) {
    const item = tp.itens[indiceItem];
    if (!item || item.vertical) continue;
    const len = item.str.length;
    if (len === 0) continue;

    const cobreTudo = faixa.de <= 0 && faixa.ate >= len;
    let caixa: Caixa | null;
    if (cobreTudo) {
      caixa = item.caixa;
    } else {
      const r = fracoesDoRecorte(item, faixa.de, faixa.ate);
      caixa = caixaDoItemDeTexto(item, r.inicio, r.fim);
    }
    if (!caixa) continue;

    // A folga não é enfeite: sem ela a tarja raspa o glifo e o antisserrilhado
    // deixa um fio do dígito legível numa ampliação de 400%.
    caixas.push({
      x0: caixa.x0 - PADDING_LATERAL_PT,
      y0: caixa.y0 - PADDING_VERTICAL_FRACAO * item.alturaFonte,
      x1: caixa.x1 + PADDING_LATERAL_PT,
      y1: caixa.y1 + PADDING_VERTICAL_FRACAO * item.alturaFonte,
    });
  }

  return fundirNaMesmaLinha(caixas);
}

/** Tolerância para considerar duas caixas na mesma linha de base, em pontos. */
const TOLERANCIA_LINHA_PT = 1;

function fundirNaMesmaLinha(caixas: Caixa[]): Caixa[] {
  if (caixas.length <= 1) return caixas;
  const ordenadas = [...caixas].sort((a, b) => b.y0 - a.y0 || a.x0 - b.x0);
  const saida: Caixa[] = [];

  for (const c of ordenadas) {
    const ultima = saida[saida.length - 1];
    const mesmaLinha =
      ultima &&
      Math.abs(ultima.y0 - c.y0) <= TOLERANCIA_LINHA_PT &&
      Math.abs(ultima.y1 - c.y1) <= TOLERANCIA_LINHA_PT;
    // Só funde o que está encostado: um salto grande no eixo X é coluna de
    // tabela, e ligar as duas cobriria a célula do meio, que ninguém pediu.
    const encostada = ultima && c.x0 - ultima.x1 <= 2 * PADDING_LATERAL_PT + 1;

    if (mesmaLinha && encostada) {
      ultima.x0 = Math.min(ultima.x0, c.x0);
      ultima.x1 = Math.max(ultima.x1, c.x1);
      ultima.y0 = Math.min(ultima.y0, c.y0);
      ultima.y1 = Math.max(ultima.y1, c.y1);
    } else {
      saida.push({ ...c });
    }
  }

  return saida;
}
