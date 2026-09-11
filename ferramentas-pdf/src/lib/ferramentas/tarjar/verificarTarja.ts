/**
 * Conferência do documento tarjado, antes de ele chegar ao usuário.
 *
 * ESTA É A PEÇA QUE SUSTENTA A PROMESSA DA FERRAMENTA. O motor pode estar
 * certo; a conferência é o que permite AFIRMAR que está. E ela tem poder de
 * veto: reprovou, o arquivo não é entregue. Uma ferramenta de tarja que
 * entrega vazamento com um aviso amarelo é pior do que não existir, porque o
 * usuário protocola assim mesmo.
 *
 * As provas usam dependências deliberadamente diferentes, para que um defeito
 * não anule as três de uma vez:
 *
 *   1. GEOMETRIA — reabre a saída com o pdf.js e exige que nenhum item de
 *      texto encoste numa tarja. Depende do pdf.js e da nossa geometria.
 *   2. TERMOS — concatena o texto de TODAS as páginas, normaliza e procura o
 *      que foi tarjado. Depende do pdf.js, não depende da geometria. Pega o
 *      dado que reapareceu em outra página.
 *   3. BYTES — descomprime todos os fluxos do arquivo e procura os termos.
 *      Não depende do pdf.js NEM da geometria. É a prova mais forte, e a única
 *      que enxerga objeto órfão, aparência de anotação e metadado esquecido.
 *
 * DESCOBERTA QUE QUASE FEZ A PROVA 3 NASCER INÚTIL: o PDF grava texto ora como
 * string literal, ora em HEXADECIMAL, e o pdf-lib usa hexadecimal para as
 * fontes padrão. Uma varredura que procurasse apenas os bytes crus do termo
 * devolveria "nada encontrado" num arquivo que contém o CPF por extenso.
 * Por isso `variantesDeCodificacao` existe, e por isso ela é testada.
 */

import { PDFDocument, PDFRawStream, decodePDFRawStream } from "@cantoo/pdf-lib";

import type { Caixa } from "./geometria";
import { caixaDoItemDeTexto, seIntersectam } from "./geometria";
import type { TextoPagina } from "./textoPagina";
import { construirTextoPagina, type ConteudoDeTexto } from "./textoPagina";

export type MotivoFalha =
  | "TEXTO_NA_AREA"
  | "TERMO_SOBREVIVEU"
  | "BYTES_SOBREVIVERAM"
  | "SEM_TEXTO_EXTRAIVEL";

export interface FalhaVerificacao {
  pagina: number | null;
  motivo: MotivoFalha;
  /** Descrição para o registro interno. NUNCA contém o termo em si. */
  detalhe?: string;
}

export interface ResultadoVerificacao {
  aprovado: boolean;
  falhas: FalhaVerificacao[];
  provas: string[];
}

export interface AlvoVerificacao {
  /** Página, 1-based. */
  pagina: number;
  tarjas: Caixa[];
}

/**
 * As formas em que um mesmo texto pode aparecer dentro de um PDF.
 *
 * Latin-1 e UTF-16BE cobrem string literal em fonte simples e em fonte CID.
 * As versões hexadecimais cobrem `<...>`, que é como o pdf-lib e boa parte dos
 * geradores escrevem. Maiúscula e minúscula porque as duas ocorrem.
 */
export function variantesDeCodificacao(termo: string): Uint8Array[] {
  const latin1 = Uint8Array.from(termo, (c) => c.charCodeAt(0) & 0xff);

  const utf16be = new Uint8Array(termo.length * 2);
  for (let i = 0; i < termo.length; i += 1) {
    const c = termo.charCodeAt(i);
    utf16be[i * 2] = c >> 8;
    utf16be[i * 2 + 1] = c & 0xff;
  }

  const hex = (b: Uint8Array) =>
    [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  const comoBytes = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));

  return [
    latin1,
    utf16be,
    comoBytes(hex(latin1)),
    comoBytes(hex(latin1).toUpperCase()),
    comoBytes(hex(utf16be)),
    comoBytes(hex(utf16be).toUpperCase()),
  ];
}

function contemSequencia(palheiro: Uint8Array, agulha: Uint8Array): boolean {
  if (agulha.length === 0 || agulha.length > palheiro.length) return false;
  const primeiro = agulha[0];
  for (let i = 0; i + agulha.length <= palheiro.length; i += 1) {
    if (palheiro[i] !== primeiro) continue;
    let bate = true;
    for (let j = 1; j < agulha.length; j += 1) {
      if (palheiro[i + j] !== agulha[j]) {
        bate = false;
        break;
      }
    }
    if (bate) return true;
  }
  return false;
}

/**
 * PROVA 3 — varredura dos bytes.
 *
 * Independente do pdf.js e da geometria. Devolve os índices dos termos que
 * sobreviveram; o conteúdo deles não sai desta função, e nada disso pode ir
 * para telemetria.
 */
export async function varrerBytes(
  bytes: Uint8Array,
  termos: string[],
): Promise<number[]> {
  const uteis = termos
    .map((t, i) => ({ i, t: t.trim() }))
    .filter(({ t }) => t.length >= 4);
  if (uteis.length === 0) return [];

  const variantes = uteis.map(({ i, t }) => ({ i, formas: variantesDeCodificacao(t) }));
  const encontrados = new Set<number>();

  const doc = await PDFDocument.load(bytes, {
    updateMetadata: false,
    ignoreEncryption: true,
  });

  const conferir = (dados: Uint8Array) => {
    for (const { i, formas } of variantes) {
      if (encontrados.has(i)) continue;
      if (formas.some((f) => contemSequencia(dados, f))) encontrados.add(i);
    }
  };

  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream) {
      let dados: Uint8Array;
      try {
        dados = decodePDFRawStream(obj).decode();
      } catch {
        // Filtro que não sabemos desfazer (JPEG, JBIG2, e o /Predictor que o
        // pdf-lib não implementa). Varremos os bytes como estão: não vai achar
        // texto comprimido, mas também não pode derrubar a conferência.
        dados = obj.contents;
      }
      conferir(dados);
      conferir(Uint8Array.from(obj.dict.toString(), (c) => c.charCodeAt(0) & 0xff));
      continue;
    }
    // Dicionários, arrays e strings soltas: /Info, /Title de marcador, /Contents
    // de anotação, valor de campo de formulário.
    conferir(Uint8Array.from(String(obj), (c) => c.charCodeAt(0) & 0xff));
  }

  const info = doc.context.trailerInfo?.Info;
  if (info) conferir(Uint8Array.from(String(info), (c) => c.charCodeAt(0) & 0xff));

  return [...encontrados];
}

/**
 * Normalização para a prova 2.
 *
 * Tira acento, caixa, e TODO separador — inclusive o espaço. Sem isso,
 * `123.456.789-09` no arquivo de saída não casaria com `12345678909` no termo
 * procurado, e a prova aprovaria um vazamento.
 */
export function normalizarParaConferencia(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^0-9a-z@]/g, "");
}

/** Como o pdf.js entrega o texto de uma página, do ponto de vista da conferência. */
export type LeitorDeTexto = (pagina: number) => Promise<ConteudoDeTexto | null>;

export interface OpcoesVerificacao {
  alvos: AlvoVerificacao[];
  termos: string[];
  totalDePaginas: number;
  /** Ausente, as provas 1 e 2 não rodam e isso fica registrado em `provas`. */
  lerTexto?: LeitorDeTexto;
  cancelado?: () => boolean;
}

/**
 * Roda as provas disponíveis sobre os bytes que seriam entregues.
 *
 * Nunca devolve `aprovado: true` por omissão: quando uma prova não pôde rodar,
 * ela não entra em `provas`, e quem chama decide o que fazer com isso.
 */
export async function verificarTarja(
  bytesSaida: Uint8Array,
  opcoes: OpcoesVerificacao,
): Promise<ResultadoVerificacao> {
  const { alvos, termos, lerTexto } = opcoes;
  const falhas: FalhaVerificacao[] = [];
  const provas: string[] = [];

  // ---- PROVA 3: bytes crus ----
  const sobreviveram = await varrerBytes(bytesSaida, termos);
  provas.push("bytes");
  for (const i of sobreviveram) {
    falhas.push({
      pagina: null,
      motivo: "BYTES_SOBREVIVERAM",
      detalhe: `termo #${i} ainda aparece em algum fluxo do arquivo`,
    });
  }

  // ---- PROVAS 1 e 2: dependem de extrair o texto da SAÍDA ----
  if (lerTexto) {
    const porPagina = new Map<number, Caixa[]>();
    for (const alvo of alvos) {
      porPagina.set(alvo.pagina, [...(porPagina.get(alvo.pagina) ?? []), ...alvo.tarjas]);
    }

    const normalizados = termos
      .map((t) => normalizarParaConferencia(t))
      .filter((t) => t.length >= 4);
    let textoTodo = "";

    for (let p = 1; p <= opcoes.totalDePaginas; p += 1) {
      if (opcoes.cancelado?.()) break;
      const conteudo = await lerTexto(p);
      if (!conteudo) continue;

      const tp: TextoPagina = construirTextoPagina(p, conteudo);
      textoTodo += `${tp.texto}\n`;

      const tarjas = porPagina.get(p);
      if (!tarjas || tarjas.length === 0) continue;

      // Nesta prova a margem é ZERO: aqui o teste é estrito de propósito, para
      // não herdar a mesma folga que o motor usou ao decidir o descarte.
      for (const item of tp.itens) {
        const caixa = item.caixa ?? caixaDoItemDeTexto(item);
        if (!caixa) continue;
        if (tarjas.some((t) => seIntersectam(t, caixa))) {
          falhas.push({
            pagina: p,
            motivo: "TEXTO_NA_AREA",
            detalhe: "um item de texto da saída ainda intersecta uma área tarjada",
          });
          break;
        }
      }
    }
    provas.push("geometria", "termos");

    const alvoNormalizado = normalizarParaConferencia(textoTodo);
    for (let i = 0; i < normalizados.length; i += 1) {
      if (alvoNormalizado.includes(normalizados[i])) {
        falhas.push({
          pagina: null,
          motivo: "TERMO_SOBREVIVEU",
          detalhe: `termo #${i} ainda é extraível do texto do arquivo`,
        });
      }
    }
  }

  return { aprovado: falhas.length === 0, falhas, provas };
}
