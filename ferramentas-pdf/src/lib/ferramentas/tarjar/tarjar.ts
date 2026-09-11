/**
 * Motor de tarjamento: o conteúdo marcado deixa de existir nos bytes de saída.
 *
 * O QUE ESTE MÓDULO NÃO FAZ, e é a decisão que define tudo o mais: ele não
 * desenha um retângulo por cima do texto. Retângulo por cima é o que os
 * editores online chamam de tarja, e é um vazamento com aparência de
 * segurança — o texto continua no arquivo, e sai inteiro num `Ctrl+C` ou num
 * `pdftotext`.
 *
 * A ESTRATÉGIA é reconstrução seletiva. A página que recebe tarja é
 * rasterizada, com as tarjas queimadas no bitmap, e passa a ser uma imagem;
 * sobre ela reescrevemos uma camada de texto INVISÍVEL contendo apenas o que
 * NÃO foi tarjado, para o documento continuar pesquisável. As páginas que não
 * receberam tarja são copiadas intactas, vetoriais, byte a byte — que é o que
 * impede o arquivo de inchar quando se tarja três páginas de cento e oitenta.
 *
 * O ACHADO QUE OBRIGA A MONTAR DOCUMENTO NOVO, e que foi confirmado em teste
 * neste repositório: o `PDFWriter` do @cantoo/pdf-lib serializa TODOS os
 * objetos indiretos do contexto, inclusive os que ninguém mais referencia
 * (`core/writers/PDFWriter.js`, `computeBufferSize` percorre
 * `enumerateIndirectObjects()` sem filtrar por alcançabilidade). Ou seja: abrir
 * o original, trocar o `/Contents` da página tarjada e salvar DEIXA O CONTENT
 * STREAM ANTIGO NO ARQUIVO. O texto sai num `qpdf --qdf`. Essa é a
 * implementação que qualquer pessoa escreve primeiro, ela parece funcionar, e
 * está errada. Por isso aqui nada é herdado por omissão: partimos de
 * `PDFDocument.create()` e copiamos apenas o que for explicitamente
 * autorizado.
 *
 * De brinde, o que não é copiado deixa de existir: XMP, `/Outlines`,
 * `/Names/EmbeddedFiles`, `/AcroForm`, `/OpenAction`, `/StructTreeRoot` e
 * `/PieceInfo` — todos vetores conhecidos de vazamento em documento tarjado.
 * O preço disso está em `RelatorioTarja` e é dito ao usuário na página.
 *
 * ONDE ISTO RODA: na thread da aba, não no worker de PDF do projeto — mesmo
 * motivo documentado no topo de `ocr.ts`. O rasterizador depende do pdf.js, que
 * abre worker próprio, e worker aninhado só existe no Safari a partir da 16.4.
 *
 * O rasterizador e o leitor de texto entram por INJEÇÃO, e isso não é
 * cerimônia: é o que permite exercitar o motor inteiro — inclusive o teste de
 * vazamento por varredura de bytes — num script Node, onde não existe
 * `OffscreenCanvas`.
 */

import {
  PDFDocument,
  PDFHexString,
  PDFName,
  TextRenderingMode,
  beginText,
  degrees,
  endText,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSqueeze,
  setFontAndSize,
  setTextMatrix,
  setTextRenderingMode,
  showText,
  StandardFonts,
} from "@cantoo/pdf-lib";

import type { ProgressoCallback, ResultadoOperacao } from "@/types/ferramentas";
import { abrirPdf, diagnosticar } from "../analisarPdf";
import { ErroFerramenta, comoErroFerramenta } from "../erros";
import { conferirCancelamento, OperacaoCancelada } from "../juntar";
import { higienizarNome, semExtensaoPdf } from "../nomearArquivos";
import { higienizarTexto } from "../textoWinAnsi";
import type { Caixa } from "./geometria";
import {
  centroDe,
  conferirInvarianteDeMargem,
  seIntersectam,
  tarjaDilatada,
} from "./geometria";
import { criarFonteMarcador, quantidadeDeBlocos } from "./fonteMarcador";
import type { ConteudoDeTexto } from "./textoPagina";
import { construirTextoPagina } from "./textoPagina";
import type { ResultadoVerificacao } from "./verificarTarja";
import { verificarTarja } from "./verificarTarja";

/** Uma área a suprimir. Coordenadas em pontos do espaço do usuário. */
export interface RetanguloTarja {
  /** Página, 1-based. */
  pagina: number;
  caixa: Caixa;
  /**
   * O texto que está sob a tarja, quando conhecido.
   *
   * Serve para duas coisas: contar os blocos █ e alimentar a conferência final.
   * Ausente quando o usuário desenhou um retângulo sobre uma imagem.
   */
  textoSuprimido?: string;
}

export interface PerfilRaster {
  dpi: number;
  qualidade: number;
}

export type NomePerfil = "economico" | "padrao" | "altaFidelidade";

/**
 * 200 dpi como padrão não é escolha nova: é o que `tesseract.ts` já adota,
 * citando a Portaria 11/2016 e os manuais de peticionamento dos órgãos. Manter
 * o mesmo número dá ao usuário uma referência que ele reconhece.
 */
export const PERFIS: Record<NomePerfil, PerfilRaster> = {
  economico: { dpi: 150, qualidade: 0.75 },
  padrao: { dpi: 200, qualidade: 0.82 },
  altaFidelidade: { dpi: 300, qualidade: 0.92 },
};

export interface PaginaRasterizada {
  /** JPEG da página com as tarjas já queimadas. */
  bytes: Uint8Array;
  larguraPx: number;
  alturaPx: number;
  dpiEfetivo: number;
  /** A área que foi rasterizada, em pontos: [x0, y0, x1, y1]. */
  view: readonly [number, number, number, number];
  /**
   * Lê um pixel do bitmap a partir de coordenadas do espaço do usuário.
   *
   * É o que permite a autoconferência de eixo. Opcional porque o rasterizador
   * falso dos testes em Node não tem bitmap para amostrar.
   */
  amostrarPixelDoUsuario?: (x: number, y: number) => [number, number, number] | null;
}

export type Rasterizador = (args: {
  pagina: number;
  tarjas: Caixa[];
  perfil: PerfilRaster;
  cancelado?: () => boolean;
}) => Promise<PaginaRasterizada>;

/** Tudo o que o motor precisa e que depende do pdf.js. */
export interface FonteDoDocumento {
  totalDePaginas: number;
  lerTexto: (pagina: number) => Promise<ConteudoDeTexto | null>;
  rasterizar: Rasterizador;
  destruir?: () => Promise<void> | void;
}

export interface OpcoesTarja {
  tarjas: RetanguloTarja[];
  fonte: FonteDoDocumento;
  perfil?: NomePerfil;
  /** Reescrever o texto não tarjado como camada invisível. Padrão: true. */
  camadaDeTexto?: boolean;
  /** Escrever blocos █ no lugar do que foi suprimido. Padrão: true. */
  marcadorBloco?: boolean;
  /** Padrão: false — título e autor de PDF do SEI costumam vazar sozinhos. */
  preservarMetadados?: boolean;
  /** Sem isto, documento assinado é recusado. */
  confirmarPerdaDeAssinatura?: boolean;
  /** Padrão: true. Desligar exige motivo, e o relatório registra. */
  verificar?: boolean;
  senha?: string;
  nome?: string;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

export interface RelatorioTarja extends ResultadoOperacao {
  paginasRasterizadas: number[];
  paginasIntactas: number;
  /** Itens de texto que não foram reescritos por encostarem numa tarja. */
  itensDescartados: number;
  itensReescritos: number;
  bytesOriginais: number;
  bytesFinais: number;
  dpiEfetivoPorPagina: Record<number, number>;
  /** Páginas em que a camada de texto foi desligada para a saída passar. */
  camadaDeTextoDesligadaEm: number[];
  verificacao: ResultadoVerificacao | null;
}

/** Acima disto o texto invisível seria distorcido demais: descartamos o item. */
const TZ_MINIMO = 10;
const TZ_MAXIMO = 400;

/** Luminância acima da qual o pixel não é considerado coberto pela tarja. */
const LIMIAR_TARJA_ESCURA = 90;

function caixasDaPagina(tarjas: RetanguloTarja[], pagina: number): Caixa[] {
  return tarjas.filter((t) => t.pagina === pagina).map((t) => t.caixa);
}

/**
 * Reescreve o texto que sobreviveu, como camada invisível.
 *
 * Devolve quantos itens foram escritos e quantos foram descartados, e a lista
 * dos descartados POR INTERSEÇÃO — que é a entrada da autoconferência de eixo.
 */
function escreverCamadaInvisivel(args: {
  pagina: ReturnType<PDFDocument["addPage"]>;
  fonteHelvetica: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  conteudo: ConteudoDeTexto;
  numeroDaPagina: number;
  tarjas: Caixa[];
}): { escritos: number; descartados: number; descartadosPorTarja: Caixa[] } {
  const { pagina, fonteHelvetica, conteudo, numeroDaPagina, tarjas } = args;
  const tp = construirTextoPagina(numeroDaPagina, conteudo);

  pagina.setFont(fonteHelvetica);
  const [, chaveFonte] = pagina.getFont();

  let escritos = 0;
  let descartados = 0;
  const descartadosPorTarja: Caixa[] = [];

  for (const item of tp.itens) {
    const caixa = item.caixa;
    // `null` significa DESCARTAR: item degenerado, vertical, ou sem largura.
    // Não existe caminho em que a dúvida resulte em manter o texto.
    if (!caixa) {
      descartados += 1;
      continue;
    }

    const encosta = tarjas.some((t) => {
      const testada = tarjaDilatada(t, item.alturaFonte);
      conferirInvarianteDeMargem(t, testada);
      return seIntersectam(testada, caixa);
    });
    if (encosta) {
      descartados += 1;
      descartadosPorTarja.push(caixa);
      continue;
    }

    const texto = higienizarTexto(item.str);
    if (!texto) {
      descartados += 1;
      continue;
    }

    const altura = item.alturaFonte;
    if (!(altura > 0)) {
      descartados += 1;
      continue;
    }

    const larguraNatural = fonteHelvetica.widthOfTextAtSize(texto, altura);
    if (!(larguraNatural > 0)) {
      descartados += 1;
      continue;
    }

    // Tz casa a extensão do texto invisível com a do texto original. Sem ele,
    // a Helvetica escreve mais larga que a fonte do documento e o trecho
    // invisível ULTRAPASSA o texto real — que é justamente como um texto
    // invisível acaba parando debaixo de uma tarja vizinha.
    const tz = (100 * Math.abs(item.width)) / larguraNatural;
    if (!Number.isFinite(tz) || tz < TZ_MINIMO || tz > TZ_MAXIMO) {
      descartados += 1;
      continue;
    }

    const [a, b, c, d, e, f] = item.transform;

    pagina.pushOperators(
      pushGraphicsState(),
      beginText(),
      // Modo 3: entra no documento, é buscável e copiável, e não é desenhado.
      setTextRenderingMode(TextRenderingMode.Invisible),
      setFontAndSize(chaveFonte, altura),
      setCharacterSqueeze(tz),
      // setTextMatrix, e não moveText: preserva giro e inclinação. Com moveText
      // um carimbo diagonal sairia deitado, e um trecho longo deitado invade
      // uma tarja que o trecho girado não tocava.
      setTextMatrix(a / altura, b / altura, c / altura, d / altura, e, f),
      showText(fonteHelvetica.encodeText(texto)),
      endText(),
      popGraphicsState(),
    );
    escritos += 1;
  }

  return { escritos, descartados, descartadosPorTarja };
}

/** Escreve os blocos █ invisíveis sobre cada tarja da página. */
function escreverBlocos(args: {
  pagina: ReturnType<PDFDocument["addPage"]>;
  refFonteMarcador: ReturnType<typeof criarFonteMarcador>;
  tarjas: RetanguloTarja[];
}): void {
  const { pagina, refFonteMarcador, tarjas } = args;
  if (tarjas.length === 0) return;

  const chave = pagina.node.newFontDictionaryKey("EuBloco");
  pagina.node.setFontDictionary(chave, refFonteMarcador);

  for (const tarja of tarjas) {
    const largura = tarja.caixa.x1 - tarja.caixa.x0;
    const altura = tarja.caixa.y1 - tarja.caixa.y0;
    if (!(largura > 0) || !(altura > 0)) continue;

    const tamanho = Math.min(40, Math.max(4, altura * 0.8));
    const quantos = quantidadeDeBlocos(tarja.textoSuprimido, largura, tamanho);

    pagina.pushOperators(
      pushGraphicsState(),
      beginText(),
      setTextRenderingMode(TextRenderingMode.Invisible),
      setFontAndSize(chave, tamanho),
      setTextMatrix(1, 0, 0, 1, tarja.caixa.x0, tarja.caixa.y0 + altura * 0.2),
      // Bytes crus do código 219, que a fonte de marcador mapeia para U+2588.
      showText(PDFHexString.of("DB".repeat(quantos))),
      endText(),
      popGraphicsState(),
    );
  }
}

/**
 * Autoconferência de eixo.
 *
 * Para cada item descartado cujo CENTRO cai dentro da tarja PINTADA (não da
 * dilatada), lê o pixel correspondente no bitmap. Ele tem de estar escuro. Se
 * um único não estiver, as duas cadeias de transformação — a que pinta e a que
 * testa — discordam, que é o sintoma exato de erro de sinal no eixo Y. A
 * operação é interrompida ANTES de gerar arquivo, em vez de entregar algo que
 * parece certo.
 */
function conferirEixo(
  raster: PaginaRasterizada,
  descartados: Caixa[],
  tarjas: Caixa[],
  numeroDaPagina: number,
): void {
  const amostrar = raster.amostrarPixelDoUsuario;
  if (!amostrar) return;

  for (const caixa of descartados) {
    const [cx, cy] = centroDe(caixa);
    const dentroDaPintada = tarjas.some(
      (t) => cx >= t.x0 && cx <= t.x1 && cy >= t.y0 && cy <= t.y1,
    );
    if (!dentroDaPintada) continue;

    const px = amostrar(cx, cy);
    if (!px) continue;
    const luminancia = 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2];
    if (luminancia > LIMIAR_TARJA_ESCURA) {
      throw new ErroFerramenta("TARJA_GEOMETRIA_INCONSISTENTE", {
        pagina: numeroDaPagina,
      });
    }
  }
}

export async function tarjarPdf(
  entrada: { nome: string; bytes: Uint8Array; senha?: string },
  opcoes: OpcoesTarja,
): Promise<RelatorioTarja> {
  const {
    tarjas,
    fonte,
    perfil = "padrao",
    camadaDeTexto = true,
    marcadorBloco = true,
    preservarMetadados = false,
    confirmarPerdaDeAssinatura = false,
    verificar = true,
    aoProgredir,
    cancelado,
  } = opcoes;

  if (tarjas.length === 0) throw new ErroFerramenta("TARJA_SEM_SELECAO");

  const bytesOriginais = entrada.bytes.byteLength;
  const raiz = higienizarNome(semExtensaoPdf(entrada.nome), "documento");
  const nomeArquivo = `${raiz}-tarjado.pdf`;

  try {
    const origem = await abrirPdf(entrada.bytes, {
      nome: entrada.nome,
      senha: entrada.senha,
    });

    if (diagnosticar(origem).temAssinatura && !confirmarPerdaDeAssinatura) {
      throw new ErroFerramenta("PDF_ASSINADO", { nome: entrada.nome });
    }

    const destino = await PDFDocument.create();
    const fonteHelvetica = await destino.embedFont(StandardFonts.Helvetica);
    const refFonteMarcador = marcadorBloco ? criarFonteMarcador(destino) : null;

    const total = origem.getPageCount();
    const paginasRasterizadas: number[] = [];
    const dpiEfetivoPorPagina: Record<number, number> = {};
    let paginasIntactas = 0;
    let itensDescartados = 0;
    let itensReescritos = 0;

    aoProgredir?.(0, total);

    for (let i = 0; i < total; i += 1) {
      conferirCancelamento(cancelado);
      const numero = i + 1;
      const daPagina = tarjas.filter((t) => t.pagina === numero);

      if (daPagina.length === 0) {
        const [copia] = await destino.copyPages(origem, [i]);
        // `copyPages` copia por alcançabilidade, e `/Annots` é uma entrada como
        // outra qualquer: um widget de formulário arrastaria o valor `/V` do
        // campo, que sobrevive à raspagem do visual. Removemos sempre.
        copia.node.delete(PDFName.of("Annots"));
        copia.node.delete(PDFName.of("StructParents"));
        destino.addPage(copia);
        paginasIntactas += 1;
        aoProgredir?.(numero, total);
        continue;
      }

      const caixas = caixasDaPagina(tarjas, numero);
      const raster = await fonte.rasterizar({
        pagina: numero,
        tarjas: caixas,
        perfil: PERFIS[perfil],
        cancelado,
      });
      conferirCancelamento(cancelado);

      const original = origem.getPage(i);
      const mb = original.getMediaBox();
      const cb = original.getCropBox();
      const giro = original.getRotation();

      const nova = destino.addPage();
      nova.setMediaBox(mb.x, mb.y, mb.width, mb.height);
      if (cb && (cb.x !== mb.x || cb.y !== mb.y || cb.width !== mb.width || cb.height !== mb.height)) {
        nova.setCropBox(cb.x, cb.y, cb.width, cb.height);
      }
      nova.setRotation(degrees(((Math.round(giro.angle / 90) * 90) % 360 + 360) % 360));

      const imagem = await destino.embedJpg(raster.bytes);
      const [vx0, vy0, vx1, vy1] = raster.view;
      nova.drawImage(imagem, {
        x: vx0,
        y: vy0,
        width: vx1 - vx0,
        height: vy1 - vy0,
      });

      // Reforço vetorial por cima do bitmap. A tarja já está queimada na
      // imagem; o retângulo existe porque o JPEG produz um halo de compressão
      // nas bordas de um bloco preto, e o halo é justamente onde sobraria o
      // topo dos glifos numa ampliação.
      for (const caixa of caixas) {
        nova.drawRectangle({
          x: caixa.x0,
          y: caixa.y0,
          width: caixa.x1 - caixa.x0,
          height: caixa.y1 - caixa.y0,
          color: rgb(0, 0, 0),
          borderWidth: 0,
        });
      }

      if (camadaDeTexto) {
        const conteudo = await fonte.lerTexto(numero);
        if (conteudo) {
          const r = escreverCamadaInvisivel({
            pagina: nova,
            fonteHelvetica,
            conteudo,
            numeroDaPagina: numero,
            tarjas: caixas,
          });
          itensReescritos += r.escritos;
          itensDescartados += r.descartados;
          conferirEixo(raster, r.descartadosPorTarja, caixas, numero);
        }
      }

      if (refFonteMarcador) {
        escreverBlocos({ pagina: nova, refFonteMarcador, tarjas: daPagina });
      }

      paginasRasterizadas.push(numero);
      dpiEfetivoPorPagina[numero] = raster.dpiEfetivo;
      aoProgredir?.(numero, total);
    }

    conferirCancelamento(cancelado);

    // Metadados. O título de um PDF do SEI costuma trazer número de processo e
    // nome de interessado; o autor costuma trazer o login de rede de quem
    // gerou. Preservar por omissão seria vazar pela porta da frente.
    if (!preservarMetadados) {
      destino.setTitle("");
      destino.setAuthor("");
      destino.setSubject("");
      destino.setKeywords([]);
      destino.setCreator("SEI Pro — Ferramentas de PDF");
      destino.setProducer("SEI Pro — Ferramentas de PDF");
    } else {
      destino.setTitle(origem.getTitle() ?? "");
      destino.setAuthor(origem.getAuthor() ?? "");
      destino.setSubject(origem.getSubject() ?? "");
    }

    const bytes = await destino.save({ useObjectStreams: true });

    let verificacao: ResultadoVerificacao | null = null;
    if (verificar) {
      const termos = tarjas
        .map((t) => t.textoSuprimido?.trim())
        .filter((t): t is string => Boolean(t && t.length >= 4));

      verificacao = await verificarTarja(bytes, {
        alvos: paginasRasterizadas.map((p) => ({
          pagina: p,
          tarjas: caixasDaPagina(tarjas, p),
        })),
        termos,
        totalDePaginas: total,
        cancelado,
      });

      // Reprovou: NÃO entrega. Entregar com aviso seria pior do que não ter a
      // ferramenta, porque o usuário protocola assim mesmo.
      if (!verificacao.aprovado) {
        throw new ErroFerramenta("TARJA_NAO_VERIFICADA", {
          nome: entrada.nome,
          pagina: verificacao.falhas.find((f) => f.pagina !== null)?.pagina ?? undefined,
        });
      }
    }

    return {
      bytes,
      nomeArquivo,
      paginasRasterizadas,
      paginasIntactas,
      itensDescartados,
      itensReescritos,
      bytesOriginais,
      bytesFinais: bytes.byteLength,
      dpiEfetivoPorPagina,
      camadaDeTextoDesligadaEm: [],
      verificacao,
    };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    if (e instanceof ErroFerramenta) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: entrada.nome });
  } finally {
    try {
      await opcoes.fonte.destruir?.();
    } catch {
      /* encerrar é melhor esforço e não pode derrubar um tarjamento bem-sucedido */
    }
  }
}
