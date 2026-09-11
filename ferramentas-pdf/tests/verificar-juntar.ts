/**
 * Verificação da camada pura das ferramentas de PDF.
 *
 * Roda no Node, sem navegador, porque `src/lib/ferramentas/**` não importa
 * React nem toca no DOM. É a única forma automatizada de conferir a parte
 * capaz de corromper o documento de um usuário.
 *
 * Executar a partir de `frontend/` (é lá que ficam o tsconfig e os módulos):
 *
 *   cd frontend && npx tsx ../tests/ferramentas-pdf/verificar-juntar.ts
 */

import { PDFDocument } from "@cantoo/pdf-lib";

import {
  abrirPdf,
  analisarPdf,
  pareceCompleto,
  pareceSerPdf,
} from "@/lib/ferramentas/analisarPdf";
import { ErroFerramenta } from "@/lib/ferramentas/erros";
import { juntarPdfs } from "@/lib/ferramentas/juntar";
import { higienizarNome, nomeParaUniao } from "@/lib/ferramentas/nomearArquivos";
import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
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

async function esperaErro(
  descricao: string,
  codigoEsperado: string,
  fn: () => Promise<unknown>,
) {
  try {
    await fn();
    checar(descricao, false, "não lançou erro nenhum");
  } catch (e) {
    const codigo = e instanceof ErroFerramenta ? e.codigo : `(${String(e)})`;
    checar(descricao, codigo === codigoEsperado, `veio ${codigo}`);
  }
}

/** Gera um PDF com N páginas de um tamanho distinto, para rastrear a ordem. */
async function pdfDeTeste(paginas: number, lado: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < paginas; i += 1) doc.addPage([lado, lado]);
  return doc.save();
}

function entrada(nome: string, bytes: Uint8Array, senha?: string): ArquivoEntrada {
  return { id: nome, nome, tamanho: bytes.length, bytes, senha };
}

async function main() {
  console.log("\n== deteccao de tipo ==");
  const a = await pdfDeTeste(2, 200);
  const b = await pdfDeTeste(3, 400);
  checar("PDF real e reconhecido", pareceSerPdf(a));
  checar(
    "arquivo que nao e PDF e recusado",
    !pareceSerPdf(new TextEncoder().encode("PK isto e um zip")),
  );

  console.log("\n== uniao ==");
  const r = await juntarPdfs([entrada("Peticao inicial.pdf", a), entrada("Anexos.pdf", b)]);
  const unido = await PDFDocument.load(r.bytes);
  checar("soma das paginas confere (2 + 3 = 5)", unido.getPageCount() === 5, `veio ${unido.getPageCount()}`);

  const larguras = unido.getPages().map((p) => Math.round(p.getWidth()));
  checar(
    "ordem preservada: as 2 primeiras do doc A, as 3 seguintes do doc B",
    JSON.stringify(larguras) === JSON.stringify([200, 200, 400, 400, 400]),
    JSON.stringify(larguras),
  );
  checar(
    "nome de saida deriva do primeiro arquivo",
    r.nomeArquivo === "Peticao inicial-unificado.pdf",
    r.nomeArquivo,
  );

  const invertido = await juntarPdfs([entrada("b.pdf", b), entrada("a.pdf", a)]);
  const docInv = await PDFDocument.load(invertido.bytes);
  checar(
    "inverter a lista inverte as paginas",
    JSON.stringify(docInv.getPages().map((p) => Math.round(p.getWidth()))) ===
      JSON.stringify([400, 400, 400, 200, 200]),
  );

  console.log("\n== guardas de entrada ==");
  await esperaErro("lista vazia", "NENHUM_ARQUIVO", () => juntarPdfs([]));
  await esperaErro("um arquivo so", "UM_ARQUIVO_SO", () => juntarPdfs([entrada("a.pdf", a)]));
  await esperaErro("arquivo que nao e PDF", "TIPO_NAO_SUPORTADO", () =>
    juntarPdfs([entrada("a.pdf", a), entrada("x.docx", new TextEncoder().encode("PK"))]),
  );
  // Um PDF cortado ao meio CARREGA sem erro e perde paginas em silencio
  // (verificado: 2 paginas viram 1). O marcador %%EOF e o que denuncia.
  await esperaErro("PDF truncado e recusado", "ARQUIVO_CORROMPIDO", () =>
    juntarPdfs([entrada("a.pdf", a), entrada("meio.pdf", a.slice(0, 300))]),
  );
  checar("PDF inteiro passa na checagem de integridade", pareceCompleto(a));
  checar("PDF truncado reprova na checagem de integridade", !pareceCompleto(a.slice(0, 300)));

  console.log("\n== criptografia (o portao que evita paginas em branco) ==");
  const comSenhaDoc = await PDFDocument.load(await pdfDeTeste(2, 300));
  comSenhaDoc.encrypt({ userPassword: "segredo", ownerPassword: "dono" });
  const comSenha = await comSenhaDoc.save();

  await esperaErro("documento com senha de usuario exige senha", "PDF_PROTEGIDO", () =>
    abrirPdf(comSenha, { nome: "protegido.pdf" }),
  );
  await esperaErro("senha errada e recusada", "SENHA_INCORRETA", () =>
    abrirPdf(comSenha, { nome: "protegido.pdf", senha: "errada" }),
  );
  const aberto = await abrirPdf(comSenha, { nome: "protegido.pdf", senha: "segredo" });
  checar("senha correta abre o documento", aberto.getPageCount() === 2);
  checar(
    "e as paginas NAO vem em branco (o bug do pdf-lib original)",
    Math.round(aberto.getPage(0).getWidth()) === 300,
    `largura ${aberto.getPage(0).getWidth()}`,
  );

  const soDonoDoc = await PDFDocument.load(await pdfDeTeste(1, 250));
  soDonoDoc.encrypt({ ownerPassword: "dono" });
  const soDono = await soDonoDoc.save();
  const { diagnostico } = await analisarPdf(soDono, { nome: "restrito.pdf" });
  checar("documento so com senha de proprietario abre sem intervencao", diagnostico.paginas === 1);
  checar("e e sinalizado como restrito", diagnostico.temRestricoes);

  const { diagnostico: limpo } = await analisarPdf(a, { nome: "a.pdf" });
  checar("documento comum nao e marcado como restrito", !limpo.temRestricoes);
  checar("documento comum nao tem XFA nem assinatura", !limpo.temXfa && !limpo.temAssinatura);

  console.log("\n== nomes de arquivo ==");
  checar("remove caracteres proibidos pelo Windows", higienizarNome('a/b:c*d?e"f<g>h|i') === "abcdefghi");
  checar("preserva acento", higienizarNome("Peticao de Execucao") === "Peticao de Execucao");
  checar("normaliza NFD do macOS para NFC", higienizarNome("a̧o".normalize("NFD")).normalize("NFC") === "a̧o".normalize("NFC"));
  checar("nome vazio cai no padrao", higienizarNome("///") === "documento");
  checar("corta em 80 caracteres", higienizarNome("x".repeat(200)).length === 80);
  checar("nao termina em ponto nem espaco", !/[. ]$/.test(higienizarNome("arquivo. . ")));
  checar("nome de uniao remove o .pdf da raiz", nomeParaUniao("Contrato.pdf") === "Contrato-unificado.pdf");

  console.log("\n== formatacao ==");
  checar("bytes", formatarBytes(0) === "0 B", formatarBytes(0));
  checar("kilobytes com virgula", formatarBytes(1536) === "1,5 KB", formatarBytes(1536));
  checar("megabytes", formatarBytes(10 * 1024 * 1024) === "10 MB", formatarBytes(10 * 1024 * 1024));

  console.log(`\n${passou} conferem, ${falhou} falham\n`);
  process.exit(falhou === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("erro inesperado na verificacao:", e);
  process.exit(1);
});
