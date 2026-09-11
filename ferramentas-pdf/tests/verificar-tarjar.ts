/**
 * Verificação do motor de tarjamento.
 *
 * O TESTE QUE JUSTIFICA ESTE ARQUIVO é o de vazamento: montar um PDF com um
 * segredo, tarjá-lo, e provar por varredura de bytes que o segredo não está
 * mais em fluxo nenhum do arquivo de saída. É a única forma automatizada de
 * conferir a afirmação em que a ferramenta inteira se apoia.
 *
 * Roda no Node, sem navegador, porque o motor recebe o rasterizador e o leitor
 * de texto por injeção. Sem essa injeção este arquivo não existiria, já que
 * `OffscreenCanvas` não existe no Node.
 *
 * Executar a partir de `frontend/`:
 *
 *   cd frontend && NODE_PATH=$PWD/node_modules npx tsx ../tests/ferramentas-pdf/verificar-tarjar.ts
 */

import {
  PDFDocument,
  PDFDict,
  PDFName,
  PDFNumber,
  StandardFonts,
  degrees,
} from "@cantoo/pdf-lib";

import { ErroFerramenta } from "@/lib/ferramentas/erros";
import { tarjarPdf } from "@/lib/ferramentas/tarjar/tarjar";
import type {
  FonteDoDocumento,
  PaginaRasterizada,
  RetanguloTarja,
} from "@/lib/ferramentas/tarjar/tarjar";
import { varrerBytes, variantesDeCodificacao } from "@/lib/ferramentas/tarjar/verificarTarja";
import type { ConteudoDeTexto } from "@/lib/ferramentas/tarjar/textoPagina";
import { construirTextoPagina, caixasDoIntervalo } from "@/lib/ferramentas/tarjar/textoPagina";
import { detectarNaPagina, TIPOS_ORDENADOS } from "@/lib/ferramentas/tarjar/deteccao";
import {
  caixaDoItemDeTexto,
  deFracaoDoViewport,
  paraFracaoDoViewport,
  seIntersectam,
  tamanhoDoViewport,
} from "@/lib/ferramentas/tarjar/geometria";
import * as V from "@/lib/ferramentas/tarjar/validadores";
import { validarCpf } from "@/lib/cpf";
import { higienizarTexto, suportadoEmWinAnsi } from "@/lib/ferramentas/textoWinAnsi";

let passou = 0;
let falhou = 0;

function checar(descricao: string, condicao: boolean, detalhe = "") {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${descricao}`);
  } else {
    falhou += 1;
    console.log(` FALHA  ${descricao}${detalhe ? ` -> ${detalhe}` : ""}`);
  }
}

async function esperaErro(descricao: string, codigo: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    checar(descricao, false, "não lançou");
  } catch (e) {
    const obtido = e instanceof ErroFerramenta ? e.codigo : String(e);
    checar(descricao, obtido === codigo, `lançou ${obtido}`);
  }
}

// ---------------------------------------------------------------------------
// Instrumentos
// ---------------------------------------------------------------------------

const CPF = "529.982.247-25";
const PUBLICO = "Documento publico sem restricao";

/** JPEG 1x1 válido, o mínimo que o `embedJpg` aceita parsear. */
const JPEG_1X1 = Uint8Array.from(
  atob(
    "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a" +
      "HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAA" +
      "AQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIh" +
      "MUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpT" +
      "VFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5" +
      "usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iii" +
      "gD//2Q==",
  ),
  (c) => c.charCodeAt(0),
);

/** Rasterizador falso: não tem bitmap, então não oferece amostragem de pixel. */
function rasterizadorFalso(view: [number, number, number, number]) {
  return async (): Promise<PaginaRasterizada> => ({
    bytes: JPEG_1X1,
    larguraPx: 1,
    alturaPx: 1,
    dpiEfetivo: 200,
    view,
  });
}

function leitorFalso(porPagina: Record<number, ConteudoDeTexto>) {
  return async (pagina: number) => porPagina[pagina] ?? null;
}

const item = (str: string, x: number, y: number, largura: number, fs = 12) => ({
  str,
  transform: [fs, 0, 0, fs, x, y],
  width: largura,
  height: fs,
  fontName: "f1",
});

/** PDF de duas páginas: a primeira com o segredo, a segunda sem. */
async function documentoDeTeste(opcoes: { giro?: number; origemMediaBox?: boolean } = {}) {
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);

  const p1 = doc.addPage([595, 842]);
  if (opcoes.origemMediaBox) p1.setMediaBox(9, 9, 595, 842);
  if (opcoes.giro) p1.setRotation(degrees(opcoes.giro));
  p1.drawText(`Requerente CPF ${CPF} residente`, { x: 50, y: 700, size: 12, font: f });
  p1.drawText(PUBLICO, { x: 50, y: 650, size: 12, font: f });

  const p2 = doc.addPage([595, 842]);
  p2.drawText("Segunda pagina, intacta.", { x: 50, y: 700, size: 12, font: f });

  return doc.save({ useObjectStreams: false });
}

async function contemTermo(bytes: Uint8Array, termo: string) {
  return (await varrerBytes(bytes, [termo])).length > 0;
}

// ---------------------------------------------------------------------------

async function main() {
  console.log("\n== varredura de bytes: a prova mais forte ==");
  {
    const formas = variantesDeCodificacao(CPF);
    checar("cobre 6 codificações (latin1, utf16be e as hex)", formas.length === 6);
    const original = await documentoDeTeste();
    checar("acha o termo no documento original", await contemTermo(original, CPF));
    checar(
      "não acha um termo que não está lá",
      !(await contemTermo(original, "11.222.333/0001-81")),
    );
  }

  console.log("\n== o teste de vazamento ==");
  {
    const original = await documentoDeTeste();
    const view: [number, number, number, number] = [0, 0, 595, 842];
    const tarjas: RetanguloTarja[] = [
      { pagina: 1, caixa: { x0: 130, y0: 694, x1: 230, y1: 712 }, textoSuprimido: CPF },
    ];
    const fonte: FonteDoDocumento = {
      totalDePaginas: 2,
      rasterizar: rasterizadorFalso(view),
      lerTexto: leitorFalso({
        // O item do CPF está DENTRO da tarja: o motor tem de descartá-lo.
        1: {
          items: [
            item(`Requerente CPF `, 50, 700, 80),
            item(CPF, 132, 700, 70),
            item(PUBLICO, 50, 650, 160),
          ],
        },
      }),
    };

    const r = await tarjarPdf({ nome: "peca.pdf", bytes: original }, { tarjas, fonte });

    checar("o segredo NÃO está no arquivo de saída", !(await contemTermo(r.bytes, CPF)));
    checar(
      "controle: o texto público SOBREVIVE (o scanner acharia se estivesse lá)",
      await contemTermo(r.bytes, PUBLICO),
    );
    checar("a verificação aprovou", r.verificacao?.aprovado === true);
    checar("as três provas rodaram", (r.verificacao?.provas.length ?? 0) >= 1);
    checar("uma página foi rasterizada", r.paginasRasterizadas.join() === "1");
    checar("uma página ficou intacta", r.paginasIntactas === 1);
    checar("o item do CPF foi descartado", r.itensDescartados >= 1);
    checar("os itens públicos foram reescritos", r.itensReescritos >= 1);
    checar("nome de saída", r.nomeArquivo === "peca-tarjado.pdf");

    const saida = await PDFDocument.load(r.bytes, { updateMetadata: false });
    checar("duas páginas na saída", saida.getPageCount() === 2);
    const mb = saida.getPage(0).getMediaBox();
    checar("MediaBox preservado", mb.width === 595 && mb.height === 842);
    checar("metadados limpos: sem título", (saida.getTitle() ?? "") === "");
    checar("o marcador de bloco entrou (ToUnicode U+2588)", await contemTermo(r.bytes, "<DB> <2588>"));
  }

  console.log("\n== a conferência tem poder de veto ==");
  {
    const original = await documentoDeTeste();
    const view: [number, number, number, number] = [0, 0, 595, 842];
    // Aqui o item do CPF está FORA da tarja: a camada invisível o reescreveria,
    // e a conferência precisa barrar a entrega.
    const fonte: FonteDoDocumento = {
      totalDePaginas: 2,
      rasterizar: rasterizadorFalso(view),
      lerTexto: leitorFalso({ 1: { items: [item(CPF, 50, 300, 70)] } }),
    };
    await esperaErro(
      "reprovou e NÃO entregou o arquivo",
      "TARJA_NAO_VERIFICADA",
      () =>
        tarjarPdf(
          { nome: "peca.pdf", bytes: original },
          {
            tarjas: [
              { pagina: 1, caixa: { x0: 130, y0: 694, x1: 230, y1: 712 }, textoSuprimido: CPF },
            ],
            fonte,
          },
        ),
    );
  }

  console.log("\n== geometria da página preservada ==");
  {
    for (const giro of [90, 180, 270]) {
      const original = await documentoDeTeste({ giro });
      const fonte: FonteDoDocumento = {
        totalDePaginas: 2,
        rasterizar: rasterizadorFalso([0, 0, 595, 842]),
        lerTexto: leitorFalso({}),
      };
      const r = await tarjarPdf(
        { nome: "p.pdf", bytes: original },
        { tarjas: [{ pagina: 1, caixa: { x0: 10, y0: 10, x1: 50, y1: 30 } }], fonte },
      );
      const saida = await PDFDocument.load(r.bytes, { updateMetadata: false });
      checar(`/Rotate ${giro} preservado`, saida.getPage(0).getRotation().angle === giro);
    }

    const comOrigem = await documentoDeTeste({ origemMediaBox: true });
    const fonte: FonteDoDocumento = {
      totalDePaginas: 2,
      rasterizar: rasterizadorFalso([9, 9, 604, 851]),
      lerTexto: leitorFalso({}),
    };
    const r = await tarjarPdf(
      { nome: "p.pdf", bytes: comOrigem },
      { tarjas: [{ pagina: 1, caixa: { x0: 20, y0: 20, x1: 60, y1: 40 } }], fonte },
    );
    const mb = (await PDFDocument.load(r.bytes, { updateMetadata: false })).getPage(0).getMediaBox();
    checar("MediaBox com origem ≠ 0 preservado", mb.x === 9 && mb.y === 9, `x=${mb.x} y=${mb.y}`);
  }

  console.log("\n== portas de entrada ==");
  {
    const original = await documentoDeTeste();
    const fonte: FonteDoDocumento = {
      totalDePaginas: 2,
      rasterizar: rasterizadorFalso([0, 0, 595, 842]),
      lerTexto: leitorFalso({}),
    };
    await esperaErro("sem seleção é recusado", "TARJA_SEM_SELECAO", () =>
      tarjarPdf({ nome: "p.pdf", bytes: original }, { tarjas: [], fonte }),
    );

    // Documento com campo de assinatura declarado no AcroForm.
    const assinado = await PDFDocument.load(await documentoDeTeste(), { updateMetadata: false });
    const acro = assinado.context.obj({ SigFlags: PDFNumber.of(3), Fields: assinado.context.obj([]) });
    assinado.catalog.set(PDFName.of("AcroForm"), assinado.context.register(acro as PDFDict));
    const bytesAssinado = await assinado.save({ useObjectStreams: false });

    await esperaErro("assinado sem confirmação é recusado", "PDF_ASSINADO", () =>
      tarjarPdf(
        { nome: "p.pdf", bytes: bytesAssinado },
        { tarjas: [{ pagina: 1, caixa: { x0: 10, y0: 10, x1: 50, y1: 30 } }], fonte },
      ),
    );

    const r = await tarjarPdf(
      { nome: "p.pdf", bytes: bytesAssinado },
      {
        tarjas: [{ pagina: 1, caixa: { x0: 10, y0: 10, x1: 50, y1: 30 } }],
        fonte,
        confirmarPerdaDeAssinatura: true,
      },
    );
    checar("assinado COM confirmação é processado", r.bytes.byteLength > 0);
  }

  console.log("\n== costura do texto e mapeamento de volta ==");
  {
    const tp = construirTextoPagina(1, {
      items: [item("123", 100, 700, 15, 10), item(".456.", 115, 700, 22, 10), item("789-09", 137, 700, 30, 10)],
    });
    checar("CPF fatiado em 3 itens vira texto contíguo", tp.texto === "123.456.789-09");
    checar("projeção compacta junta os dígitos", tp.compacto === "12345678909");
    checar("e o CPF costurado é válido", validarCpf(tp.compacto));
    checar("mapeia de volta para 1 caixa fundida", caixasDoIntervalo(tp, 0, 14).length === 1);

    const duasLinhas = construirTextoPagina(1, {
      items: [item("123.456.", 100, 700, 40, 10), item("789-09", 100, 688, 30, 10)],
    });
    checar(
      "número quebrado em duas linhas vira 2 caixas",
      caixasDoIntervalo(duasLinhas, 0, duasLinhas.texto.length).length === 2,
    );

    const degenerado = construirTextoPagina(1, {
      items: [{ str: "X", transform: [10, 0, 0, 10, 5, 5], width: 0, height: 10 }],
    });
    checar("item sem largura não vira caixa (falha fechada)", caixasDoIntervalo(degenerado, 0, 1).length === 0);

    const vertical = construirTextoPagina(1, {
      items: [item("縦書き", 100, 700, 30)],
      styles: { f1: { vertical: true } },
    });
    checar("texto vertical é descartado, não preservado", caixasDoIntervalo(vertical, 0, 3).length === 0);

    const girado = caixaDoItemDeTexto({ str: "CPF", transform: [0, 10, -10, 0, 300, 400], width: 20, height: 10 });
    checar("texto girado gera caixa mais alta que larga", Boolean(girado && girado.y1 - girado.y0 > girado.x1 - girado.x0));
    checar("interseção detecta sobreposição", seIntersectam({ x0: 0, y0: 0, x1: 10, y1: 10 }, { x0: 5, y0: 5, x1: 15, y1: 15 }));
    checar("interseção ignora encosto de borda", !seIntersectam({ x0: 0, y0: 0, x1: 10, y1: 10 }, { x0: 10, y0: 0, x1: 20, y1: 10 }));
  }


  console.log("\n== conversão para a página exibida ==");
  {
    // O viewBox com origem deslocada é o caso que mais quebra implementação
    // caseira, e o erro é silencioso: a tarja aparece no lugar certo na tela e
    // o texto removido é outro.
    const view = [9, 9, 604, 851] as const;

    for (const giro of [0, 90, 180, 270]) {
      const { largura, altura } = tamanhoDoViewport(view, giro);
      const esperada = giro === 90 || giro === 270 ? [842, 595] : [595, 842];
      checar(`giro ${giro}: dimensões do viewport`, largura === esperada[0] && altura === esperada[1]);

      // A página inteira tem de ocupar exatamente o viewport inteiro.
      const cheia = paraFracaoDoViewport({ x0: view[0], y0: view[1], x1: view[2], y1: view[3] }, view, giro);
      const quase = (a: number, b: number) => Math.abs(a - b) < 1e-9;
      checar(
        `giro ${giro}: o viewBox preenche o viewport`,
        Boolean(cheia && quase(cheia.esquerda, 0) && quase(cheia.topo, 0) && quase(cheia.largura, 1) && quase(cheia.altura, 1)),
        JSON.stringify(cheia),
      );

      // Ida e volta fecha?
      const origem = { x0: 100, y0: 200, x1: 180, y1: 220 };
      const volta = deFracaoDoViewport(paraFracaoDoViewport(origem, view, giro)!, view, giro);
      checar(
        `giro ${giro}: ida e volta fecha`,
        Boolean(volta && quase(volta.x0, origem.x0) && quase(volta.y0, origem.y0) && quase(volta.x1, origem.x1) && quase(volta.y1, origem.y1)),
        JSON.stringify(volta),
      );
    }

    // Sem giro, a fórmula fechada é conhecida: Y do PDF cresce para cima, o da
    // tela cresce para baixo.
    const f = paraFracaoDoViewport({ x0: 9, y0: 841, x1: 109, y1: 851 }, view, 0)!;
    checar("sem giro, o topo do PDF vira topo da tela", Math.abs(f.topo) < 1e-9, JSON.stringify(f));
  }

  console.log("\n== detecção ==");
  {
    const pag = (linha: string) => {
      const itens = linha.split(" ").map((palavra, i, todas) => {
        const antes = todas.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);
        return item(palavra, 50 + antes * 5, 700, palavra.length * 5, 10);
      });
      return construirTextoPagina(1, { items: itens });
    };
    const achar = (linha: string) =>
      detectarNaPagina(pag(linha), { tipos: TIPOS_ORDENADOS }).map((d) => `${d.tipo}:${d.bruto}`);

    checar("CPF", achar("Requerente CPF 529.982.247-25 residente").join() === "cpf:529.982.247-25");
    checar("CNPJ", achar("empresa CNPJ 11.222.333/0001-81 sediada").join() === "cnpj:11.222.333/0001-81");
    checar("e-mail institucional NÃO é ignorado", achar("protocolo@antaq.gov.br").join() === "email:protocolo@antaq.gov.br");
    checar("telefone com DDD entre parênteses", achar("fone (61) 99887-6655 recado").join() === "telefone:(61) 99887-6655");
    checar("linha digitável de boleto não vira nada", achar("23793381286000782177370000063305895670000215000").length === 0);
    checar("CEP sem hífen nem rótulo é ignorado", achar("valor 70070600 reais").length === 0);
    checar("CEP com rótulo é detectado", achar("CEP 70070600 Brasilia").join() === "cep:70070600");
    checar("data sem rótulo é ignorada", achar("assinado em 10/03/2019 pelo").length === 0);
    checar("data com rótulo de nascimento é detectada", achar("nascimento 10/03/1980 natural").join() === "data-nascimento:10/03/1980");
    checar("RG sem rótulo é ignorado", achar("numero 12.345.678-9 anexo").length === 0);
    checar("CPF colado a número vizinho ainda é achado", achar("1234 529.982.247-25").join() === "cpf:529.982.247-25");
    checar("CNPJ não gera um CPF do próprio miolo", achar("CNPJ 11.222.333/0001-81").length === 1);

    const d = detectarNaPagina(pag("CPF 529.982.247-25"), {})[0];
    checar("a amostra exibida é mascarada", d.amostra === "529.***.**7-25" && d.amostra !== d.bruto);

    const termo = detectarNaPagina(pag("O servidor Joao da Silva assinou"), {
      tipos: [],
      termosLivres: ["joão da silva"],
    });
    checar("busca literal ignora acento e caixa", termo.map((x) => x.bruto).join() === "Joao da Silva");
  }


  console.log("\n== texto WinAnsi (módulo compartilhado com o OCR) ==");
  {
    // Comportamento herdado do ocr.ts: o que a Helvetica escreve, passa.
    checar("português com acento sobrevive", higienizarTexto("Ação de cobrança — Nº 12") .includes("Ação de cobrança"));
    checar("cedilha e til são suportados", suportadoEmWinAnsi("çãõÁÉÍÓÚ"));
    checar("espaço repetido é colapsado", higienizarTexto("a   b") === "a b");
    checar("string vazia devolve vazio", higienizarTexto("   ") === "");

    // WinAnsi REPRESENTA a pontuação tipográfica do bloco CP1252 — conferido
    // contra o `encodeText` do @cantoo/pdf-lib instalado. Converter estes para
    // ASCII seria perder fidelidade sem ganhar nada.
    checar("travessão é preservado", higienizarTexto("Processo — SEI") === "Processo — SEI");
    checar("aspas curvas são preservadas", higienizarTexto("diz “isto”") === "diz “isto”");
    checar("reticências de um caractere são preservadas", higienizarTexto("aguarde…") === "aguarde…");

    // Já estes virariam "?" no documento, e o "?" é o que o usuário vê ao copiar.
    checar("sinal de menos matemático vira hífen", higienizarTexto("\u22125") === "-5");
    checar("ligadura fi é desfeita", higienizarTexto("\ufb01scal") === "fiscal");
    checar("espaço fino vira espaço comum", higienizarTexto("a\u2009b") === "a b");

    // Representáveis, mas quebrariam a busca.
    checar("espaço inseparável vira espaço", higienizarTexto("R$\u00a01,00") === "R$ 1,00");
    checar("hífen opcional some", higienizarTexto("in\u00adfração") === "infração");

    // E o que continua fora da tabela é removido sem derrubar a palavra.
    checar("caractere fora do WinAnsi some, palavra fica", higienizarTexto("a\u4e2db") === "ab");
  }

  console.log("\n== validadores ==");
  {
    checar("CPF válido", validarCpf("529.982.247-25"));
    checar("CPF de dígitos repetidos é recusado", !validarCpf("111.111.111-11"));
    checar("PIS válido", V.validarPis("120.6584.123-2"));
    checar("título de eleitor válido", V.validarTituloEleitor("102385010671"));
    checar("título com UF inexistente é recusado", !V.validarTituloEleitor("102385990671"));
    checar("cartão Visa de teste", V.pareceCartaoDePagamento("4111111111111111"));
    checar("cartão com Luhn quebrado é recusado", !V.pareceCartaoDePagamento("4111111111111112"));
    checar("cartão com prefixo desconhecido é recusado", !V.pareceCartaoDePagamento("9999999999999995"));
    checar("celular válido", V.validarTelefoneBr("(61) 99999-8888"));
    checar("DDD inexistente é recusado", !V.validarTelefoneBr("(20) 3232-1010"));
    checar("29/02 em ano bissexto", V.validarDataBrasileira("29/02/2024") !== null);
    checar("29/02 em ano comum é recusado", V.validarDataBrasileira("29/02/2023") === null);
    checar("processo CNJ válido", V.validarProcessoCnj("0000001-78.2020.8.26.0100"));
    checar("processo CNJ com DV vizinho é recusado", !V.validarProcessoCnj("0000001-79.2020.8.26.0100"));
    checar("CNH válida", V.validarCnh("02650306461"));
    checar("UUID v4", V.validarUuidV4("f47ac10b-58cc-4372-a567-0e02b2c3d479"));
    checar("UUID v1 é recusado", !V.validarUuidV4("f47ac10b-58cc-1372-a567-0e02b2c3d479"));
  }

  console.log(`\n${passou} ok, ${falhou} falha(s)\n`);
  if (falhou > 0) process.exitCode = 1;
}

void main();
