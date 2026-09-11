/**
 * Verificacao da leitura dos parametros de upload do SEI.
 *
 * POR QUE ISTO MERECE TESTE PROPRIO: um limite lido errado nao produz erro
 * nenhum na tela. Ele simplesmente faz o usuario dividir o arquivo no tamanho
 * errado e descobrir o problema no protocolo -- que e onde o erro custa caro.
 *
 * Os HTMLs abaixo reproduzem as formas que a tela de documento externo assume
 * nas versoes do SEI, incluindo a que NAO declara limite nenhum.
 */

import { extrairParametros } from "@/ponte/parametrosUpload";
import { lerRota, montarHash } from "@/ui/rota";
import { readFileSync } from "node:fs";
import { deBase64, paraBase64 } from "@/ponte/protocolo";
import { mensagemDaPonte } from "@/ui/mensagens";

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe?: string) {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe ? ` -- ${detalhe}` : ""}`);
  }
}

const MB = 1024 * 1024;

console.log("\n== lista de extensoes aceitas ==");

const comExtensoes = `
  <script>
    var arrExt = ['pdf','odt','ods','odp','jpg','jpeg','png','zip','txt','xml'];
    var upload = new infraUpload('divUpload', 'hdnUpload', 'controlador.php?acao=documento_upload');
  </script>`;

const r1 = extrairParametros(comExtensoes);
checar("le a lista de extensoes", Boolean(r1?.extensoes?.length), String(r1?.extensoes?.length));
checar("inclui pdf", Boolean(r1?.extensoes?.includes("pdf")));
checar("inclui os formatos ODF", Boolean(r1?.extensoes?.includes("odt") && r1?.extensoes?.includes("ods")));
// O achado que mais importa na pratica: quem anexa arquivo do Word e barrado,
// e quase ninguem documenta isso.
checar("NAO inclui docx (motivo comum de recusa)", !r1?.extensoes?.includes("docx"));

console.log("\n== tamanho maximo, nas formas em que a tela o declara ==");

checar(
  "le 'Tamanho maximo: 30 Mb'",
  extrairParametros(`<p>Tamanho m&aacute;ximo: 30 Mb</p>`.replace("&aacute;", "á"))?.bytesPorArquivo === 30 * MB,
  String(extrairParametros("<p>Tamanho máximo: 30 Mb</p>")?.bytesPorArquivo),
);
checar(
  "le sem acento tambem",
  extrairParametros("<p>Tamanho maximo permitido: 10 MB</p>")?.bytesPorArquivo === 10 * MB,
);
checar(
  "entende decimal com virgula",
  extrairParametros("<p>Tamanho máximo: 1,5 MB</p>")?.bytesPorArquivo === Math.round(1.5 * MB),
);
checar(
  "entende gigabytes",
  extrairParametros("<p>Tamanho máximo: 2 Gb</p>")?.bytesPorArquivo === 2 * 1024 ** 3,
);

console.log("\n== o que NAO pode acontecer ==");

// Preferir "nao sei" a um numero errado: o perfil so vira "apurado" quando ha
// dado de verdade, e sem isso a interface mostra os limites tipicos com a
// procedencia na tela.
checar(
  "tela sem limite nem extensoes devolve nulo (nao inventa numero)",
  extrairParametros("<html><body>Inclusao de documento</body></html>") === null,
);
checar(
  "tela so com extensoes nao inventa um limite",
  extrairParametros(comExtensoes)?.bytesPorArquivo === undefined,
);
checar(
  "numero solto sem unidade nao vira limite",
  extrairParametros("<p>Documento 12345 de 2026</p>") === null,
);

console.log("\n== fragmento da URL: ferramenta e conexao convivem ==");
// Defeito real observado no navegador: o roteador lia "?n=..." como nome de
// ferramenta, nao reconhecia, limpava o fragmento inteiro -- e levava junto o
// nonce, derrubando a ponte com o SEI sem erro nenhum na tela.

const vindoDoSei = lerRota("#/?n=abc-123&o=https%3A%2F%2Fsei.exemplo.gov.br");
checar("hub aberto pelo SEI nao vira slug", vindoDoSei.slug === "", `slug=${vindoDoSei.slug}`);
checar("o nonce sobrevive", vindoDoSei.parametros.get("n") === "abc-123");
checar("a origem sobrevive", vindoDoSei.parametros.get("o") === "https://sei.exemplo.gov.br");

const comFerramenta = lerRota("#/tarjar?n=abc-123&o=https%3A%2F%2Fx.gov.br");
checar("le a ferramenta com parametros juntos", comFerramenta.slug === "tarjar", comFerramenta.slug);
checar("e mantem o nonce", comFerramenta.parametros.get("n") === "abc-123");

const semNada = lerRota("#/juntar");
checar("ferramenta sem parametros continua funcionando", semNada.slug === "juntar");
checar("e sem parametros de conexao", semNada.parametros.get("n") === null);

checar(
  "trocar de ferramenta PRESERVA a conexao",
  montarHash("ocr", comFerramenta.parametros).startsWith("#/ocr?n=abc-123"),
  montarHash("ocr", comFerramenta.parametros),
);
checar(
  "voltar ao hub tambem preserva",
  montarHash("", comFerramenta.parametros).startsWith("#/?n=abc-123"),
  montarHash("", comFerramenta.parametros),
);
checar("sem parametros, o hash fica limpo", montarHash("juntar", new URLSearchParams()) === "#/juntar");

console.log("\n== o canal com o SEI ==");
// Dois defeitos reais moldaram este desenho, e as asserções existem para que
// nenhum volte:
//
// 1. O botão abria uma aba about:blank e nunca carregava a ferramenta. A causa
//    era supor que `window.open("", nome)` devolve null quando o nome não
//    existe -- ele CRIA uma aba em branco e a devolve.
// 2. Como o nome ficava gravado no sessionStorage da aba do SEI, o problema se
//    repetia a cada clique e sobrevivia até recarregar a extensão.
//
// Hoje o botão é um link comum e o canal é uma porta `chrome.runtime`.
const glueBruto = readFileSync(
  new URL("../src/ponte/sei-pro-ferramentaspdf.ts", import.meta.url),
  "utf8",
);
const isolado = readFileSync(
  new URL("../src/ponte/init-ferramentaspdf.ts", import.meta.url),
  "utf8",
);
// Sem os comentários: o próprio comentário que explica o defeito cita a forma
// errada, e conferir o arquivo cru acusaria a explicação como se fosse código.
const semComentarios = (t: string) =>
  t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const glue = semComentarios(glueBruto);

checar("o glue nao abre janelas", !/window\.open/.test(glue));
checar(
  "quem abre a porta e o mundo isolado",
  /chrome\.runtime\.connect/.test(semComentarios(isolado)),
);
checar(
  "o glue nao toca em chrome.* (nao existe no mundo da pagina)",
  !/\bchrome\./.test(glue),
);

console.log("\n== bytes pela porta ==");
// A porta serializa em JSON: um ArrayBuffer posto nela chega como {} do outro
// lado, vazio e sem erro. Por isso os bytes viajam em base64.
const original = new Uint8Array([0, 1, 2, 253, 254, 255, 65, 66]);
const ida = paraBase64(original);
const volta = deBase64(ida);
checar("base64 preserva o tamanho", volta.length === original.length);
checar(
  "e preserva cada byte, inclusive os extremos",
  original.every((b, i) => volta[i] === b),
  `${[...volta].join(",")} != ${[...original].join(",")}`,
);

const grande = new Uint8Array(300_000);
for (let i = 0; i < grande.length; i += 1) grande[i] = i & 255;
const voltaGrande = deBase64(paraBase64(grande));
checar(
  "aguenta documento grande sem estourar a pilha",
  voltaGrande.length === grande.length && voltaGrande[299_999] === grande[299_999],
);

console.log("\n== mensagens de erro ==");
// Reusar um código de erro por preguiça manda o usuário para a pista errada:
// "não foi possível INCLUIR documento -- o processo está aberto na sua
// unidade?" apareceu quando o problema era BAIXAR, e custou uma rodada inteira
// de diagnóstico em cima da unidade, que estava certa o tempo todo.
const codigosDeDownload = ["SEI_DOCUMENTO_AUSENTE", "SEI_DOCUMENTO_NATO", "SEI_SEM_LINK"];
for (const codigo of codigosDeDownload) {
  const texto = mensagemDaPonte({ codigo });
  checar(
    `${codigo} tem mensagem própria`,
    texto !== mensagemDaPonte({ codigo: "__desconhecido__" }),
  );
  checar(
    `${codigo} não fala em incluir documento nem em unidade`,
    !/incluir documento|na sua unidade/i.test(texto),
    texto.slice(0, 60),
  );
}

const glueParaErros = readFileSync(
  new URL("../src/ponte/sei-pro-ferramentaspdf.ts", import.meta.url),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
checar(
  "o download não usa mais o código de falha de inclusão",
  !/baixarDocumento[\s\S]{0,1200}SEI_SEM_PERMISSAO/.test(glueParaErros),
);

console.log("\n== leitura de páginas do SEI ==");
// O SEI serve tudo em ISO-8859-1. `Response.text()` decodifica como UTF-8
// quando o cabeçalho não diz o contrário, e o resultado é mojibake em todo
// acento: "Declaração de Matrícula" virou "Declara??o de Matr?cula" na lista de
// documentos -- justamente o nome pelo qual o usuário reconhece a peça.
const glueTexto = readFileSync(
  new URL("../src/ponte/sei-pro-ferramentaspdf.ts", import.meta.url),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

checar(
  "nenhuma leitura usa .text() cru",
  !/await\s+\w+\.text\(\)/.test(glueTexto) && !/\)\s*\.text\(\)/.test(glueTexto),
);
checar("existe um leitor que respeita o charset", /function lerTexto/.test(glueTexto));
checar(
  "e o padrão dele é o do SEI, não o do navegador",
  /iso-8859-1/.test(glueTexto),
);

// Prova de que o problema é real: os mesmos bytes, lidos de dois jeitos.
const bytesLatin1 = new Uint8Array([0x44, 0x65, 0x63, 0x6c, 0x61, 0x72, 0x61, 0xe7, 0xe3, 0x6f]);
const comoUtf8 = new TextDecoder("utf-8").decode(bytesLatin1);
const comoLatin1 = new TextDecoder("iso-8859-1").decode(bytesLatin1);
checar("lido como UTF-8, o acento corrompe", comoUtf8 !== "Declaração", comoUtf8);
checar("lido como ISO-8859-1, fica certo", comoLatin1 === "Declaração", comoLatin1);

console.log("\n== nome do documento na lista ==");
const dialogo = readFileSync(
  new URL("../src/ui/componentes/escolherDocumentos.ts", import.meta.url),
  "utf8",
);
checar(
  "o número não é repetido quando o nome já o traz",
  /!doc\.nome\.includes\(doc\.numero\)/.test(dialogo),
);

console.log(`\n${passou} conferem, ${falhou} falham\n`);
process.exit(falhou === 0 ? 0 : 1);
