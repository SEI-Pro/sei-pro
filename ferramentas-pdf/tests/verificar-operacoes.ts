/**
 * Verificação das demais operações de PDF (dividir, organizar, numerar,
 * imagens e compressão estrutural).
 *
 * Roda no Node porque `src/lib/ferramentas/**` não importa React nem toca no
 * DOM. É a única forma automatizada de conferir a parte capaz de corromper o
 * documento de um usuário.
 *
 * O que NÃO dá para cobrir aqui: a reamostragem de imagens da compressão, que
 * depende de OffscreenCanvas e createImageBitmap. Só a compressão estrutural
 * é exercitada; a reamostragem precisa de verificação no navegador.
 *
 * Executar a partir de `frontend/`:
 *
 *   NODE_PATH=$PWD/node_modules npx tsx ../tests/ferramentas-pdf/verificar-operacoes.ts
 */

import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";

import { dividirPdf, interpretarIntervalos } from "@/lib/ferramentas/dividir";
import { comprimirPdf } from "@/lib/ferramentas/comprimir";
import { ErroFerramenta } from "@/lib/ferramentas/erros";
import { imagensParaPdf } from "@/lib/ferramentas/imagemParaPdf";
import { numerarPaginas } from "@/lib/ferramentas/numerarPaginas";
import { organizarPdf } from "@/lib/ferramentas/organizar";
import { diagnosticar } from "@/lib/ferramentas/protocolo/diagnostico";
import { PERFIS, perfilPorId, perfilDoSei } from "@/lib/ferramentas/protocolo/perfilDestino";
import type { PresetProtocolo } from "@/lib/ferramentas/protocolo/tipos";
import { limiteComMargem } from "@/lib/ferramentas/protocolo/tipos";
import type { ArquivoEntrada } from "@/types/ferramentas";

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
    checar(descricao, false, "nao lancou erro");
  } catch (e) {
    const c = e instanceof ErroFerramenta ? e.codigo : `(${String(e)})`;
    checar(descricao, c === codigo, `veio ${c}`);
  }
}

/** PDF de N páginas, cada uma com largura distinta para rastrear a ordem. */
async function pdfDeTeste(paginas: number, base = 200): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonte = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < paginas; i += 1) {
    const p = doc.addPage([base + i, 400]);
    p.drawText(`pagina ${i + 1}`, { x: 20, y: 350, size: 12, font: fonte, color: rgb(0, 0, 0) });
  }
  return doc.save();
}

function entrada(nome: string, bytes: Uint8Array): ArquivoEntrada {
  return { id: nome, nome, tamanho: bytes.length, bytes };
}

/** JPEG mínimo válido, gerado por bytes: o Node não tem canvas. */
function jpegDeTeste(): Uint8Array {
  // 1x1 pixel, qualidade baixa. Suficiente para o embedJpg validar e medir.
  const base64 =
    "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a" +
    "HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAA" +
    "AAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==";
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

async function main() {
  console.log("\n== dividir: intervalos ==");
  checar(
    "interpreta '1-3, 8, 12-20'",
    JSON.stringify(interpretarIntervalos("1-3, 8, 12-20", 20)) ===
      JSON.stringify([
        { inicio: 1, fim: 3 },
        { inicio: 8, fim: 8 },
        { inicio: 12, fim: 20 },
      ]),
  );
  checar("aceita travessao", interpretarIntervalos("1–3", 5).length === 1);
  let recusou = false;
  try {
    interpretarIntervalos("1-99", 12);
  } catch {
    recusou = true;
  }
  checar("recusa pagina fora do documento", recusou);

  const doc10 = await pdfDeTeste(10);

  const porIntervalos = await dividirPdf(entrada("processo.pdf", doc10), {
    modo: "porIntervalos",
    intervalos: [
      { inicio: 1, fim: 3 },
      { inicio: 8, fim: 10 },
    ],
  });
  checar("gera um arquivo por intervalo", porIntervalos.length === 2, String(porIntervalos.length));
  const parte1 = await PDFDocument.load(porIntervalos[0].bytes);
  checar("primeiro intervalo tem 3 paginas", parte1.getPageCount() === 3);
  checar(
    "as paginas certas foram extraidas (larguras 200,201,202)",
    JSON.stringify(parte1.getPages().map((p) => Math.round(p.getWidth()))) ===
      JSON.stringify([200, 201, 202]),
  );
  checar(
    "o nome indica as paginas",
    porIntervalos[0].nomeArquivo === "processo-paginas-1-a-3.pdf",
    porIntervalos[0].nomeArquivo,
  );

  console.log("\n== dividir: por pagina e por quantidade ==");
  const porPagina = await dividirPdf(entrada("a.pdf", doc10), { modo: "porPagina" });
  checar("uma pagina por arquivo gera 10", porPagina.length === 10);
  const porQtd = await dividirPdf(entrada("a.pdf", doc10), {
    modo: "porQuantidade",
    paginasPorParte: 4,
  });
  checar("blocos de 4 geram 3 partes (4+4+2)", porQtd.length === 3, String(porQtd.length));
  const ultima = await PDFDocument.load(porQtd[2].bytes);
  checar("a ultima parte tem 2 paginas", ultima.getPageCount() === 2);

  console.log("\n== dividir: por tamanho (o corte medido) ==");
  const grande = await pdfDeTeste(30);
  const teto = Math.ceil(grande.byteLength / 3);
  const porTamanho = await dividirPdf(entrada("g.pdf", grande), {
    modo: "porTamanho",
    tamanhoMaximoBytes: teto,
  });
  checar("gerou mais de uma parte", porTamanho.length > 1, String(porTamanho.length));
  const acima = porTamanho.filter((p) => p.bytes.byteLength > teto);
  checar(
    "NENHUMA parte passa do teto pedido",
    acima.length === 0,
    `${acima.length} acima de ${teto}B`,
  );
  let somaPaginas = 0;
  for (const p of porTamanho) somaPaginas += (await PDFDocument.load(p.bytes)).getPageCount();
  checar("nenhuma pagina se perdeu no corte", somaPaginas === 30, String(somaPaginas));

  console.log("\n== organizar ==");
  const organizado = await organizarPdf(entrada("o.pdf", doc10), { ordem: [4, 0, 9] });
  const docOrg = await PDFDocument.load(organizado.bytes);
  checar("mantem so as paginas escolhidas", docOrg.getPageCount() === 3);
  checar(
    "na ordem pedida (larguras 204,200,209)",
    JSON.stringify(docOrg.getPages().map((p) => Math.round(p.getWidth()))) ===
      JSON.stringify([204, 200, 209]),
  );

  const girado = await organizarPdf(entrada("o.pdf", doc10), {
    ordem: [0, 1],
    rotacoes: { 0: 90 },
  });
  const docGir = await PDFDocument.load(girado.bytes);
  checar("aplica o giro na pagina certa", docGir.getPage(0).getRotation().angle === 90);
  checar("e nao gira as demais", docGir.getPage(1).getRotation().angle === 0);

  await esperaErro("ordem vazia e recusada", "NENHUM_ARQUIVO", () =>
    organizarPdf(entrada("o.pdf", doc10), { ordem: [] }),
  );
  await esperaErro("indice fora do documento e recusado", "FALHA_INESPERADA", () =>
    organizarPdf(entrada("o.pdf", doc10), { ordem: [0, 99] }),
  );

  console.log("\n== numerar paginas ==");
  const numerado = await numerarPaginas(entrada("n.pdf", doc10), { formato: "folhaComTotal" });
  const docNum = await PDFDocument.load(numerado.bytes);
  checar("preserva a contagem de paginas", docNum.getPageCount() === 10);
  checar("o arquivo cresce (texto foi gravado)", numerado.bytes.byteLength > doc10.byteLength);
  checar("nome de saida", numerado.nomeArquivo === "n-numerado.pdf", numerado.nomeArquivo);

  const pulando = await numerarPaginas(entrada("n.pdf", doc10), { pularPrimeira: true });
  checar(
    "pular a primeira nao altera a contagem",
    (await PDFDocument.load(pulando.bytes)).getPageCount() === 10,
  );

  console.log("\n== imagens para PDF ==");
  const jpeg = jpegDeTeste();
  const pdfDeImagens = await imagensParaPdf(
    [entrada("foto1.jpg", jpeg), entrada("foto2.jpg", jpeg)],
    { tamanhoPagina: "a4" },
  );
  const docImg = await PDFDocument.load(pdfDeImagens.bytes);
  checar("uma pagina por imagem", docImg.getPageCount() === 2);
  checar(
    "pagina em A4 (595 x 842 pontos)",
    Math.round(docImg.getPage(0).getWidth()) === 595 &&
      Math.round(docImg.getPage(0).getHeight()) === 842,
    `${docImg.getPage(0).getWidth()} x ${docImg.getPage(0).getHeight()}`,
  );
  await esperaErro("arquivo que nao e imagem e recusado", "TIPO_NAO_SUPORTADO", () =>
    imagensParaPdf([entrada("x.txt", new TextEncoder().encode("nao sou imagem"))]),
  );
  await esperaErro("lista vazia", "NENHUM_ARQUIVO", () => imagensParaPdf([]));

  console.log("\n== compressao estrutural ==");
  const relatorio = await comprimirPdf(entrada("c.pdf", doc10), { nivel: "estrutural" });
  checar("nunca devolve arquivo maior que o original", relatorio.bytesFinais <= doc10.byteLength);
  // A invariante que importa: declarar "sem ganho" e devolver bytes diferentes
  // do original seria mentir para o usuario, que baixaria um arquivo alterado
  // achando que nada mudou.
  checar(
    "quando declara 'sem ganho', devolve exatamente os bytes do ORIGINAL",
    !relatorio.semGanho ||
      (relatorio.bytes.byteLength === doc10.byteLength &&
        relatorio.bytes.every((b, i) => b === doc10[i])),
    relatorio.semGanho ? "declarou sem ganho mas mudou os bytes" : "houve ganho",
  );
  const docComp = await PDFDocument.load(relatorio.bytes);
  checar("o documento continua legivel e completo", docComp.getPageCount() === 10);

  const assinadoDoc = await PDFDocument.load(await pdfDeTeste(2));
  assinadoDoc.getForm(); // cria AcroForm
  const assinado = await assinadoDoc.save();
  // Sem SigFlags o diagnostico nao marca assinatura; o teste abaixo garante
  // apenas que documento comum NAO e recusado por engano.
  const okComum = await comprimirPdf(entrada("comum.pdf", assinado), { nivel: "estrutural" });
  checar("documento comum nao e recusado como assinado", okComum.bytesFinais > 0);

  console.log("\n== perfil do destino ==");
  const sei = perfilPorId("sei-padrao")!;
  checar("perfil generico do SEI existe", Boolean(sei));
  checar(
    "e NAO fixa um limite de tamanho (nao existe padrao)",
    sei.limites.bytesPorArquivo === undefined,
  );
  checar(
    "a lista de extensoes NAO inclui docx",
    !sei.limites.extensoes?.includes("docx"),
  );
  checar("mas inclui pdf e odt", Boolean(sei.limites.extensoes?.includes("pdf") && sei.limites.extensoes?.includes("odt")));
  checar(
    "todo perfil tem fonte e data",
    PERFIS.every((p) => p.fonte.titulo && p.fonte.verificadoEm),
  );

  // A integracao com o SEI e o que transforma um palpite em dado apurado.
  const apurado = perfilDoSei({ bytesPorArquivo: 10 * 1024 * 1024, extensoes: ["pdf"], host: "sei.exemplo.gov.br" });
  checar("perfil lido da instalacao e 'apurado'", apurado.confianca === "apurado");
  checar("e carrega o limite real do orgao", apurado.limites.bytesPorArquivo === 10 * 1024 * 1024);
  checar(
    "leitura vazia NAO vira dado apurado (cai no generico)",
    perfilDoSei({}).confianca === "derivado",
  );

  checar(
    "a margem de 5% reduz o teto",
    limiteComMargem(100 * 1024 * 1024) < 100 * 1024 * 1024,
  );
  checar(
    "e tem piso de 256 KB para arquivos pequenos",
    limiteComMargem(1024 * 1024) === 1024 * 1024 - 256 * 1024,
    String(limiteComMargem(1024 * 1024)),
  );

  console.log("\n== diagnostico contra o destino ==");
  const hoje = new Date("2026-09-07T00:00:00Z");
  const docx = entrada("peticao.docx", new TextEncoder().encode("PK"));
  const v = diagnosticar([docx], sei, sei.limites, hoje);
  checar(
    "acusa extensao nao aceita (.docx no SEI)",
    v.problemas.some((p) => p.tipo === "extensaoNaoAceita"),
  );
  checar(
    "e explica que nao convertemos Office, por causa do servidor",
    v.problemas.some((p) => p.detalhe.includes("servidor")),
  );

  // Um destino restritivo qualquer. O que se testa aqui e o DIAGNOSTICO, nao o
  // catalogo: instalacoes de SEI com teto baixo e exigencia de OCR existem, e e
  // exatamente esse o perfil que a ponte devolve quando le a instalacao.
  const restrito: PresetProtocolo = {
    id: "sei-restrito",
    nome: "SEI com teto baixo",
    familia: "SEI",
    limites: { bytesPorArquivo: 5 * 1024 * 1024, exigeOcr: true },
    confianca: "apurado",
    fonte: {
      titulo: "Parametros de upload lidos desta instalacao do SEI",
      url: "",
      verificadoEm: "2026-09-06",
    },
  };
  const tjsp = restrito;
  const pesado: ArquivoEntrada = {
    id: "x",
    nome: "anexos.pdf",
    tamanho: 40 * 1024 * 1024,
    bytes: new Uint8Array(0),
    diagnostico: { paginas: 10, precisaSenha: false, temXfa: false, temAssinatura: false, temRestricoes: false },
  };
  const v2 = diagnosticar([pesado], tjsp, tjsp.limites, hoje);
  checar(
    "acusa arquivo acima do limite do orgao",
    v2.problemas.some((p) => p.tipo === "acimaDoLimitePorArquivo"),
  );
  checar(
    "e avisa da exigencia de texto pesquisavel",
    v2.problemas.some((p) => p.tipo === "semTextoPesquisavel"),
  );
  checar(
    "marca o perfil como vigente (conferido ha poucos dias)",
    !v2.presetVencido,
  );
  const vencido = diagnosticar([pesado], { ...tjsp, fonte: { ...tjsp.fonte, verificadoEm: "2020-01-01" } }, tjsp.limites, hoje);
  checar("e como vencido quando passa de 180 dias", vencido.presetVencido);

  console.log(`\n${passou} conferem, ${falhou} falham\n`);
  process.exit(falhou === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("erro inesperado:", e);
  process.exit(1);
});
