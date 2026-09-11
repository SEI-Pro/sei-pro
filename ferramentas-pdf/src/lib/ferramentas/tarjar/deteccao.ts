/**
 * Detecção automática de dados sensíveis no texto de uma página.
 *
 * A PRECISÃO AQUI É REQUISITO DE SEGURANÇA, não de conforto. Uma lista com
 * quarenta falsos positivos ensina o usuário a clicar em "desmarcar tudo", e é
 * nesse clique que o CPF de verdade escapa. Por isso quase todo detector exige
 * dígito verificador, e os que não têm verificador exigem rótulo por perto.
 *
 * TAXAS DE FALSO POSITIVO MEDIDAS (200 mil sequências pseudoaleatórias por
 * tipo, script em `tests/ferramentas-pdf/verificar-tarjar.ts`):
 *
 *     Telefone (DDD + regra do 9)   1 em 1504
 *     Título (2 DV + código de UF)  1 em  374
 *     CNJ (módulo 97)               1 em  101
 *     CPF (2 DV)                    1 em   94
 *     CNH (2 DV)                    1 em   93
 *     CNPJ (2 DV)                   1 em   81
 *     Cartão (Luhn + prefixo)       1 em   27
 *     PIS (1 DV só)                 1 em    9
 *
 * É essa tabela que decide a estratégia de busca de cada tipo, e não intuição:
 * quem tem verificador forte pode ser procurado por JANELA DESLIZANTE dentro de
 * uma corrida de dígitos maior; quem tem verificador fraco só é aceito quando
 * ocupa a corrida INTEIRA, porque deslizar uma janela de 11 dígitos com 1 chance
 * em 9 de acertar produziria ruído em qualquer documento com tabela de valores.
 *
 * AS DUAS PROJEÇÕES. Os detectores numéricos rodam duas vezes sobre a mesma
 * página: uma com o espaço em branco ignorado, outra com ele valendo como
 * fronteira. Nenhuma das duas sozinha basta, e o motivo é concreto:
 *
 *   - `123 456 789 09` (um CPF que o PDF fatiou) só é achado ignorando o espaço;
 *   - `1234 123.456.789-09` (dois números vizinhos numa linha de tabela) só é
 *     achado respeitando o espaço, porque ignorá-lo funde os dois numa corrida
 *     de quinze dígitos.
 *
 * O que continua fora do alcance é a combinação das duas patologias no mesmo
 * trecho — um CPF fatiado E colado num número vizinho. Para esse caso existem a
 * seleção de texto e o retângulo, e o bloco "o que esta ferramenta não faz" diz
 * isso na página, em vez de deixar o usuário descobrir sozinho.
 */

import { mascararCpfParaExibicao, validarCpf } from "@/lib/cpf";
import { validarCnpj } from "@/lib/cnpj";
import type { Caixa } from "./geometria";
import type { TextoPagina } from "./textoPagina";
import { caixasDoIntervalo, intervaloDoCompacto } from "./textoPagina";
import {
  LIMITE_DIGITOS_SEGUIDOS,
  pareceCartaoDePagamento,
  validarCnh,
  validarDataBrasileira,
  validarPis,
  validarProcessoCnj,
  validarTelefoneBr,
  validarTituloEleitor,
  validarUuidV4,
} from "./validadores";

export type TipoDado =
  | "cpf"
  | "cnpj"
  | "email"
  | "telefone"
  | "cep"
  | "cartao"
  | "pix-aleatoria"
  | "data-nascimento"
  | "rg"
  | "pis"
  | "titulo-eleitor"
  | "cnh"
  | "processo"
  | "termo";

export type Confianca = "validado" | "provavel";

export interface DefinicaoTipo {
  tipo: TipoDado;
  rotulo: string;
  rotuloPlural: string;
  /** Marcado por padrão ao abrir o documento. */
  padrao: boolean;
  confianca: Confianca;
  /** Frase exibida ao usuário no selo de confiança. Precisa ser honesta. */
  explicacao: string;
}

export const TIPOS: Record<TipoDado, DefinicaoTipo> = {
  cpf: {
    tipo: "cpf",
    rotulo: "CPF",
    rotuloPlural: "CPF",
    padrao: true,
    confianca: "validado",
    explicacao: "Conferido pelos dois dígitos verificadores.",
  },
  cnpj: {
    tipo: "cnpj",
    rotulo: "CNPJ",
    rotuloPlural: "CNPJ",
    padrao: true,
    confianca: "validado",
    explicacao: "Conferido pelos dois dígitos verificadores.",
  },
  email: {
    tipo: "email",
    rotulo: "Endereço de e-mail",
    rotuloPlural: "Endereços de e-mail",
    padrao: true,
    confianca: "validado",
    explicacao: "Formato conferido, inclusive o domínio.",
  },
  telefone: {
    tipo: "telefone",
    rotulo: "Telefone",
    rotuloPlural: "Telefones",
    padrao: true,
    confianca: "validado",
    explicacao: "Conferido pelo código de área e pela regra do nono dígito.",
  },
  cep: {
    tipo: "cep",
    rotulo: "CEP",
    rotuloPlural: "CEP",
    padrao: true,
    confianca: "provavel",
    explicacao:
      "CEP não tem dígito verificador. Só é marcado quando aparece com hífen ou com a palavra CEP por perto.",
  },
  cartao: {
    tipo: "cartao",
    rotulo: "Cartão de pagamento",
    rotuloPlural: "Cartões de pagamento",
    padrao: true,
    confianca: "validado",
    explicacao: "Conferido pelo algoritmo de Luhn e pelo prefixo da bandeira.",
  },
  "pix-aleatoria": {
    tipo: "pix-aleatoria",
    rotulo: "Chave PIX aleatória",
    rotuloPlural: "Chaves PIX aleatórias",
    padrao: true,
    confianca: "validado",
    explicacao: "Formato de chave aleatória conferido.",
  },
  "data-nascimento": {
    tipo: "data-nascimento",
    rotulo: "Data de nascimento",
    rotuloPlural: "Datas de nascimento",
    padrao: false,
    confianca: "provavel",
    explicacao:
      "Só é marcada quando há a palavra nascimento por perto. Datas soltas no texto não são tocadas.",
  },
  rg: {
    tipo: "rg",
    rotulo: "RG",
    rotuloPlural: "RG",
    padrao: false,
    confianca: "provavel",
    explicacao:
      "O RG não tem dígito verificador nacional. Só é marcado quando há a palavra RG, identidade ou o órgão expedidor por perto.",
  },
  pis: {
    tipo: "pis",
    rotulo: "PIS / PASEP / NIT",
    rotuloPlural: "PIS / PASEP / NIT",
    padrao: false,
    confianca: "provavel",
    explicacao:
      "O PIS tem um único dígito verificador, e por isso uma sequência qualquer de onze dígitos passa nele com frequência. Revise um a um.",
  },
  "titulo-eleitor": {
    tipo: "titulo-eleitor",
    rotulo: "Título de eleitor",
    rotuloPlural: "Títulos de eleitor",
    padrao: false,
    confianca: "validado",
    explicacao: "Conferido pelos dígitos verificadores e pelo código da unidade da federação.",
  },
  cnh: {
    tipo: "cnh",
    rotulo: "CNH",
    rotuloPlural: "CNH",
    padrao: false,
    confianca: "provavel",
    explicacao:
      "Colide em formato com o CPF. Só é marcada quando há a palavra CNH ou habilitação por perto.",
  },
  termo: {
    tipo: "termo",
    rotulo: "Texto que você mandou procurar",
    rotuloPlural: "Textos que você mandou procurar",
    padrao: false,
    confianca: "validado",
    explicacao: "Busca literal pelo trecho que você selecionou, sem acento e sem diferença de maiúscula.",
  },
  processo: {
    tipo: "processo",
    rotulo: "Número de processo judicial",
    rotuloPlural: "Números de processo judicial",
    padrao: false,
    confianca: "validado",
    explicacao: "Conferido pelo dígito do padrão do Conselho Nacional de Justiça.",
  },
};

export const TIPOS_ORDENADOS: TipoDado[] = [
  "cpf",
  "cnpj",
  "email",
  "telefone",
  "cep",
  "cartao",
  "pix-aleatoria",
  "data-nascimento",
  "rg",
  "pis",
  "titulo-eleitor",
  "cnh",
  "processo",
  "termo",
];

export const TIPOS_PADRAO: TipoDado[] = TIPOS_ORDENADOS.filter((t) => TIPOS[t].padrao);

export interface Deteccao {
  tipo: TipoDado;
  pagina: number;
  /** Intervalo em `TextoPagina.texto`. */
  inicio: number;
  fim: number;
  /** O trecho como aparece no documento. Fica na aba; nunca vai para telemetria. */
  bruto: string;
  /** Versão mascarada, a única que pode ser exibida na interface. */
  amostra: string;
  confianca: Confianca;
  caixas: Caixa[];
}

/** Quantos caracteres antes do achado são varridos em busca de um rótulo. */
const ALCANCE_ROTULO = 40;

function temRotuloPerto(texto: string, inicio: number, padrao: RegExp): boolean {
  const de = Math.max(0, inicio - ALCANCE_ROTULO);
  return padrao.test(texto.slice(de, inicio));
}

const ROTULO_CEP = /\bcep\b/i;
const ROTULO_RG = /\b(rg|identidade|ssp|expedidor|ifp|detran)\b/i;
const ROTULO_CNH = /\b(cnh|habilita[çc][ãa]o|carteira\s+nacional|registro\s+n[ºo°]?)\b/i;
const ROTULO_NASCIMENTO = /(nascimento|nascid[oa]|\bdn\b|\bdt\.?\s*nasc)/i;

/**
 * E-mail.
 *
 * Portada de `backend/app/services/mailing_extrator.py`, que é a versão mais
 * cuidadosa que o projeto já tem. Duas diferenças deliberadas: aqui NÃO se
 * aplica a lista de prefixos institucionais (noreply, protocolo, sei) nem a
 * exclusão de domínios `.gov.br`. Lá o objetivo era achar contato comercial e
 * o endereço institucional era ruído; aqui o objetivo é suprimir, e o e-mail
 * funcional de um servidor é exatamente um dado que se quer tarjar.
 */
const EMAIL =
  /(?<![\w.\-])([A-Za-z0-9][A-Za-z0-9._%+\-]{0,63})@([A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?\.(?:[A-Za-z]{2,24})(?:\.[A-Za-z]{2,24})?)(?![A-Za-z0-9])/g;

const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;

const DATA = /\b\d{2}[/.\-]\d{2}[/.\-]\d{4}\b/g;

const RG = /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]\b/g;

/**
 * CEP com hífen na forma original.
 *
 * SEM a flag global de propósito: `RegExp.prototype.test` de uma regex global
 * avança `lastIndex` entre chamadas e passa a falhar em dia sim, dia não. É um
 * dos bugs mais difíceis de enxergar em revisão, porque o primeiro teste passa.
 */
const CEP_COM_HIFEN = /\b\d{5}-\d{3}\b/;

/** Detector numérico: roda sobre a projeção compacta. */
interface DetectorNumerico {
  tipo: TipoDado;
  /** Comprimentos aceitos, do maior para o menor. */
  tamanhos: number[];
  /**
   * Pode ser procurado dentro de uma corrida maior de dígitos?
   *
   * Só para quem tem verificador forte. Ver a tabela no topo do arquivo.
   */
  deslizante: boolean;
  valida: (digitos: string) => boolean;
  /** Exigência adicional sobre o texto bruto ao redor. */
  exigeContexto?: (texto: string, inicio: number, fim: number) => boolean;
}

/**
 * Ordem de resolução: do mais específico para o menos.
 *
 * Uma faixa já consumida bloqueia os detectores seguintes, o que impede que o
 * miolo de um CNPJ vire CPF e que um número de processo vire três coisas.
 */
const DETECTORES_NUMERICOS: DetectorNumerico[] = [
  { tipo: "processo", tamanhos: [20], deslizante: true, valida: validarProcessoCnj },
  { tipo: "cnpj", tamanhos: [14], deslizante: true, valida: validarCnpj },
  {
    tipo: "cartao",
    tamanhos: [19, 18, 17, 16, 15, 14, 13],
    deslizante: false,
    valida: pareceCartaoDePagamento,
  },
  { tipo: "titulo-eleitor", tamanhos: [12], deslizante: true, valida: validarTituloEleitor },
  { tipo: "cpf", tamanhos: [11], deslizante: true, valida: validarCpf },
  {
    tipo: "cnh",
    tamanhos: [11],
    deslizante: false,
    valida: validarCnh,
    exigeContexto: (texto, inicio) => temRotuloPerto(texto, inicio, ROTULO_CNH),
  },
  { tipo: "pis", tamanhos: [11], deslizante: false, valida: validarPis },
  {
    tipo: "telefone",
    tamanhos: [13, 12, 11, 10],
    deslizante: true,
    valida: validarTelefoneBr,
  },
  {
    tipo: "cep",
    tamanhos: [8],
    deslizante: false,
    valida: (d) => /^\d{8}$/.test(d),
    // CEP não tem verificador: sem hífen na forma original nem a palavra por
    // perto, qualquer número de oito dígitos viraria CEP.
    exigeContexto: (texto, inicio, fim) =>
      CEP_COM_HIFEN.test(texto.slice(inicio, fim).trim()) ||
      temRotuloPerto(texto, inicio, ROTULO_CEP),
  },
];

/** Corridas de dígitos na projeção compacta. */
function corridasDeDigitos(
  tp: TextoPagina,
  quebrarNoEspaco: boolean,
): Array<[number, number]> {
  const corridas: Array<[number, number]> = [];
  let inicio = -1;

  const fechar = (fim: number) => {
    if (inicio >= 0) corridas.push([inicio, fim]);
    inicio = -1;
  };

  for (let j = 0; j < tp.compacto.length; j += 1) {
    const ehDigito = tp.compacto[j] >= "0" && tp.compacto[j] <= "9";
    if (!ehDigito) {
      fechar(j);
      continue;
    }
    if (inicio < 0) {
      inicio = j;
      continue;
    }
    if (quebrarNoEspaco) {
      // Houve espaço em branco entre este caractere compacto e o anterior?
      const entre = tp.texto.slice(tp.indiceCompacto[j - 1] + 1, tp.indiceCompacto[j]);
      if (/\s/.test(entre)) {
        fechar(j);
        inicio = j;
      }
    }
  }
  fechar(tp.compacto.length);

  return corridas;
}

function sobrepoe(a: Deteccao, inicio: number, fim: number): boolean {
  return a.inicio < fim && inicio < a.fim;
}

/** Mascara o valor para exibição. Nunca exibimos o dado íntegro na interface. */
export function mascarar(bruto: string, tipo: TipoDado): string {
  const t = bruto.trim();
  if (tipo === "cpf") return mascararCpfParaExibicao(t);
  if (tipo === "email") {
    const [local, dominio] = t.split("@");
    if (!dominio) return "***";
    return `${local.slice(0, 1)}${"*".repeat(Math.max(1, local.length - 1))}@${dominio}`;
  }
  if (t.length <= 4) return "*".repeat(t.length);
  return `${t.slice(0, 2)}${"*".repeat(t.length - 4)}${t.slice(-2)}`;
}

export interface OpcoesDeteccao {
  tipos?: TipoDado[];
  /** Termos literais que o usuário mandou procurar em todo o documento. */
  termosLivres?: string[];
}

/**
 * Detecta os dados sensíveis de uma página.
 *
 * Devolve as ocorrências já com as caixas resolvidas, prontas para virar
 * marcação. Nenhuma delas está ativa ou inativa aqui: isso é decisão da
 * interface, e é o usuário quem confirma.
 */
export function detectarNaPagina(
  tp: TextoPagina,
  opcoes: OpcoesDeteccao = {},
): Deteccao[] {
  const ativos = new Set(opcoes.tipos ?? TIPOS_PADRAO);
  const achados: Deteccao[] = [];

  const registrar = (
    tipo: TipoDado,
    inicio: number,
    fim: number,
    confianca?: Confianca,
  ): boolean => {
    if (fim <= inicio) return false;
    if (achados.some((a) => sobrepoe(a, inicio, fim))) return false;
    const caixas = caixasDoIntervalo(tp, inicio, fim);
    // Sem caixa não há o que tarjar: o trecho veio inteiro de caracteres
    // sintéticos, ou de item degenerado. Registrar seria prometer uma tarja
    // que não seria desenhada.
    if (caixas.length === 0) return false;
    const bruto = tp.texto.slice(inicio, fim);
    achados.push({
      tipo,
      pagina: tp.pagina,
      inicio,
      fim,
      bruto,
      amostra: mascarar(bruto, tipo),
      confianca: confianca ?? TIPOS[tipo].confianca,
      caixas,
    });
    return true;
  };

  // ---- detectores numéricos, nas duas projeções ----
  for (const quebrarNoEspaco of [false, true]) {
    const corridas = corridasDeDigitos(tp, quebrarNoEspaco);

    for (const [ini, fim] of corridas) {
      const comprimento = fim - ini;
      // Barreira do código de barras: linha digitável de boleto tem 44 a 48
      // dígitos, e o miolo dela casa com CPF, CNPJ e cartão o tempo todo.
      if (comprimento > LIMITE_DIGITOS_SEGUIDOS) continue;

      for (const det of DETECTORES_NUMERICOS) {
        if (!ativos.has(det.tipo)) continue;

        for (const tamanho of det.tamanhos) {
          if (comprimento < tamanho) continue;
          if (!det.deslizante && comprimento !== tamanho) continue;

          const ultimoInicio = det.deslizante ? fim - tamanho : ini;
          for (let p = ini; p <= ultimoInicio; p += 1) {
            const candidato = tp.compacto.slice(p, p + tamanho);
            if (!det.valida(candidato)) continue;

            const intervalo = intervaloDoCompacto(tp, p, p + tamanho);
            if (!intervalo) continue;
            // O casamento começa no primeiro DÍGITO, então o parêntese de
            // abertura do DDD ficaria de fora e a tarja sairia como "(████".
            // Não é vazamento, é acabamento — mas acabamento é o que faz o
            // usuário confiar no que está vendo.
            if (tp.texto[intervalo.inicio - 1] === "(") intervalo.inicio -= 1;
            if (det.exigeContexto && !det.exigeContexto(tp.texto, intervalo.inicio, intervalo.fim)) {
              continue;
            }
            registrar(det.tipo, intervalo.inicio, intervalo.fim);
          }
        }
      }
    }
  }

  // ---- detectores textuais, sobre o texto costurado ----
  if (ativos.has("email")) {
    for (const m of tp.texto.matchAll(EMAIL)) {
      if (m.index === undefined) continue;
      registrar("email", m.index, m.index + m[0].length);
    }
  }

  if (ativos.has("pix-aleatoria")) {
    for (const m of tp.texto.matchAll(UUID)) {
      if (m.index === undefined || !validarUuidV4(m[0])) continue;
      registrar("pix-aleatoria", m.index, m.index + m[0].length);
    }
  }

  if (ativos.has("data-nascimento")) {
    const agora = new Date().getFullYear();
    for (const m of tp.texto.matchAll(DATA)) {
      if (m.index === undefined) continue;
      const data = validarDataBrasileira(m[0]);
      if (!data || data.ano < 1900 || data.ano > agora) continue;
      if (!temRotuloPerto(tp.texto, m.index, ROTULO_NASCIMENTO)) continue;
      registrar("data-nascimento", m.index, m.index + m[0].length);
    }
  }

  if (ativos.has("rg")) {
    for (const m of tp.texto.matchAll(RG)) {
      if (m.index === undefined) continue;
      if (!temRotuloPerto(tp.texto, m.index, ROTULO_RG)) continue;
      registrar("rg", m.index, m.index + m[0].length);
    }
  }

  // ---- termos literais pedidos pelo usuário ----
  for (const termo of opcoes.termosLivres ?? []) {
    for (const intervalo of ocorrenciasDoTermo(tp, termo)) {
      registrar("termo", intervalo.inicio, intervalo.fim);
    }
  }

  return achados.sort((a, b) => a.inicio - b.inicio);
}

/** Normaliza para busca literal: sem acento, sem caixa, sem espaço repetido. */
export function normalizarParaBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Ocorrências de um termo literal, insensível a acento e caixa.
 *
 * É o substituto honesto da "detecção de nomes": em vez de adivinhar o que é
 * nome de pessoa — heurística que marca "Excelentíssimo Senhor Doutor Juiz" e
 * ainda deixa passar "maria da silva" —, o usuário seleciona o nome uma vez e
 * a ferramenta acha as outras ocorrências com precisão total.
 */
export function ocorrenciasDoTermo(
  tp: TextoPagina,
  termo: string,
): Array<{ inicio: number; fim: number }> {
  const alvo = normalizarParaBusca(termo).trim();
  if (alvo.length < 2) return [];

  // A normalização precisa preservar o comprimento para o índice continuar
  // válido: NFD decompõe acentos em dois pontos de código, então a remoção é
  // feita caractere a caractere sobre o texto original.
  const mapa: number[] = [];
  let normalizado = "";
  for (let i = 0; i < tp.texto.length; i += 1) {
    const c = tp.texto[i]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    for (let k = 0; k < c.length; k += 1) mapa.push(i);
    normalizado += c;
  }

  const saida: Array<{ inicio: number; fim: number }> = [];
  let de = 0;
  for (;;) {
    const achado = normalizado.indexOf(alvo, de);
    if (achado < 0) break;
    const inicio = mapa[achado];
    const fim = (mapa[achado + alvo.length - 1] ?? inicio) + 1;
    saida.push({ inicio, fim });
    de = achado + alvo.length;
  }
  return saida;
}
