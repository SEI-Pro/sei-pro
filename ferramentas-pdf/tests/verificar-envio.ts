/**
 * Conferencia do envio de documento de volta ao processo.
 *
 * POR QUE ISTO PRECISA DE TESTE. O envio e a unica operacao destas ferramentas
 * que ESCREVE no SEI. Errar aqui nao produz tela de erro: produz documento
 * protocolado com o nome trocado, com o tipo errado, ou com acento corrompido
 * -- e documento protocolado nao se desfaz, so se cancela, o que fica no
 * historico do processo para sempre.
 *
 * As tres armadilhas que os casos abaixo travam, todas ja vistas no codigo de
 * origem do upload da arvore:
 *
 * 1. O usuario e a unidade que carimbam o anexo estao DENTRO do array de
 *    `objTabelaAnexos.adicionar([...])`, e nao como argumentos depois dele. A
 *    leitura ingenua devolve `undefined`, o `hdnAnexos` sai malformado e o SEI
 *    responde com a propria tela de cadastro -- sem dizer o que recusou.
 *
 * 2. O corpo do POST vai em ISO-8859-1. `URLSearchParams` codifica em UTF-8, e
 *    o documento entra no processo chamado "OfÃ­cio". O teste confere que o
 *    acento vira o byte latin1, e nao os dois do UTF-8.
 *
 * 3. As posicoes da resposta de upload nao seguem a ordem do `hdnAnexos`: o
 *    tamanho esta em [3] e a data em [4], invertidos. Trocar os dois nao quebra
 *    nada visivel -- o documento entra com data e tamanho errados na tabela de
 *    anexos.
 *
 * O DOM vem do `linkedom` porque o `DOMParser` nao existe no Node. Testar a
 * leitura dos campos contra um parser de verdade e o que da valor ao caso: os
 * seletores (`input[type=hidden]` com id contendo `hdn`) sao a parte que quebra
 * quando o SEI muda a tela.
 */

import { DOMParser as DOMParserLinked } from "linkedom";

// Antes de importar o modulo, que usa `DOMParser` no escopo global.
(globalThis as unknown as { DOMParser: unknown }).DOMParser = DOMParserLinked;

const {
  dataDeHoje,
  envioConcluido,
  escolherSerie,
  idDoDocumento,
  lerFormularioExterno,
  montarCorpoDoPost,
  montarHdnAnexos,
  montarNomeDoDocumento,
  nomeParaUpload,
  enviarDocumentoExterno,
  acharLinkDeIncluirDocumento,
} = await import("@/ponte/enviarDocumento");

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

/* ------------------------------------------------------------------ *
 * A tela de documento externo, na forma que o SEI 5 emite
 * ------------------------------------------------------------------ */

const TELA_EXTERNO = `<!DOCTYPE html>
<html><head><title>Registrar Documento Externo</title>
<script type="text/javascript">
  objUpload = new infraUpload('frmAnexos','controlador.php?acao=documento_upload_anexo&acao_origem=documento_receber&id_procedimento=99&infra_hash=abc', true);
  objUpload.validar = function(){
    var arrExt = [];
    arrExt[0] = {nome : "pdf", tamanho : 100};
    arrExt[1] = {nome : "odt", tamanho : 50};
    arrExt[2] = {nome : "jpg", tamanho : 10};
  };
  objUpload.finalizou = function(arr){
    objTabelaAnexos.adicionar([arr['nome_upload'],arr['nome'],arr['data_hora'],arr['tamanho'],infraFormatarTamanhoBytes(arr['tamanho']),'FULANO' ,'COORD-TI']);
    objTabelaAnexos.adicionarAcoes(arr['nome_upload'],'',false,true);
  };
</script></head>
<body>
<form id="frmDocumentoCadastro" method="post" action="controlador.php?acao=documento_receber&acao_origem=documento_receber&id_procedimento=99&infra_hash=def">
  <input type="hidden" id="hdnFlagDocumentoCadastro" name="hdnFlagDocumentoCadastro" value="0" />
  <input type="hidden" id="hdnIdSerie" name="hdnIdSerie" value="" />
  <input type="hidden" id="hdnIdProcedimento" name="hdnIdProcedimento" value="99" />
  <input type="hidden" id="hdnAnexos" name="hdnAnexos" value="" />
  <input type="hidden" id="hdnInfraCaptcha" name="hdnInfraCaptcha" value="zzz" />
  <input type="hidden" id="naoDeveEntrar" name="naoDeveEntrar" value="x" />
  <input type="text" id="txtNumero" name="txtNumero" value="" />
  <input type="text" id="txtDataElaboracao" name="txtDataElaboracao" value="" />
  <input type="text" id="ignorado" name="ignorado" value="y" />
  <select id="selSerie" name="selSerie">
    <option value=""></option>
    <option value="10">Anexo</option>
    <option value="21">Of&iacute;cio</option>
    <option value="33">Relat&oacute;rio de Fiscaliza&ccedil;&atilde;o</option>
  </select>
  <select id="selHipoteseLegal" name="selHipoteseLegal"><option value=""></option></select>
  <input type="radio" name="rdoNivelAcesso" value="0" checked />
  <input type="radio" name="rdoNivelAcesso" value="1" />
  <input type="radio" name="rdoFormato" value="N" />
</form>
</body></html>`;

console.log("\n== leitura da tela de documento externo ==");

const form = lerFormularioExterno(TELA_EXTERNO);
checar("a tela foi reconhecida", form !== null);

if (form) {
  checar(
    "URL de upload lida do infraUpload",
    form.urlUpload.includes("acao=documento_upload_anexo") && form.urlUpload.includes("infra_hash=abc"),
    form.urlUpload,
  );
  checar(
    "acao do formulario lida",
    form.acaoForm.includes("acao=documento_receber") && form.acaoForm.includes("infra_hash=def"),
    form.acaoForm,
  );

  // A armadilha 1.
  checar("usuario do carimbo", form.usuario === "FULANO", form.usuario);
  checar("unidade do carimbo", form.unidade === "COORD-TI", form.unidade);

  checar(
    "extensoes aceitas",
    form.extensoes.join(",") === ".pdf,.odt,.jpg",
    form.extensoes.join(","),
  );

  checar("campos hdn capturados", form.campos.hdnIdProcedimento === "99");
  checar("campo sem prefixo conhecido fica de fora", form.campos.naoDeveEntrar === undefined);
  checar("campo txt capturado", "txtNumero" in form.campos);
  checar("campo text sem prefixo txt fica de fora", form.campos.ignorado === undefined);
  checar("select capturado", "selSerie" in form.campos);
  checar(
    "so o radio MARCADO entra",
    form.campos.rdoNivelAcesso === "0" && form.campos.rdoFormato === undefined,
    JSON.stringify({ nivel: form.campos.rdoNivelAcesso, formato: form.campos.rdoFormato }),
  );

  checar("tipos de documento lidos", form.series.length === 3, String(form.series.length));
  checar(
    "entidade HTML resolvida no nome do tipo",
    form.series.some((s) => s.nome === "Ofício"),
    form.series.map((s) => s.nome).join(" | "),
  );
}

console.log("\n== a tela errada nao passa por boa ==");

checar(
  "pagina de login nao vira formulario",
  lerFormularioExterno("<html><body><form id='frmLogin'></form></body></html>") === null,
);
checar(
  "formulario sem infraUpload e recusado",
  lerFormularioExterno(
    `<form id="frmDocumentoCadastro" action="x"><input type="hidden" id="hdnA" name="hdnA" value="1"></form>`,
  ) === null,
);

/* ------------------------------------------------------------------ *
 * Escolha do tipo de documento
 * ------------------------------------------------------------------ */

console.log("\n== escolha do tipo de documento ==");

const SERIES = [
  { nome: "Anexo", valor: "10" },
  { nome: "Ofício", valor: "21" },
  { nome: "Relatório de Fiscalização", valor: "33" },
];

checar(
  "tipo pedido explicitamente vence tudo",
  escolherSerie(SERIES, "Oficio 32.pdf", "10")?.valor === "10",
);
checar(
  "nome do arquivo escolhe o tipo, mesmo sem acento",
  escolherSerie(SERIES, "Oficio 32 tarjado.pdf")?.valor === "21",
);
checar(
  "tipo de nome composto tambem e reconhecido",
  escolherSerie(SERIES, "Relatorio de Fiscalizacao 2026.pdf")?.valor === "33",
);
checar(
  "sublinhado no nome do arquivo nao atrapalha",
  escolherSerie(SERIES, "Oficio_32.pdf")?.valor === "21",
);
checar(
  "sem pista nenhuma cai em Anexo",
  escolherSerie(SERIES, "documento-tarjado.pdf")?.valor === "10",
);
checar(
  "a preferencia configurada vale quando o nome nao diz nada",
  escolherSerie(SERIES, "documento.pdf", undefined, "Ofício")?.valor === "21",
);
checar(
  "sem Anexo na lista, devolve o primeiro em vez de nada",
  escolherSerie([{ nome: "Despacho", valor: "7" }], "documento.pdf")?.valor === "7",
);
checar("lista vazia devolve nulo", escolherSerie([], "x.pdf") === null);

/* ------------------------------------------------------------------ *
 * Nome do documento
 * ------------------------------------------------------------------ */

console.log("\n== nome que vai para a arvore ==");

checar(
  "a extensao sai",
  montarNomeDoDocumento("Relatorio final.pdf", "Anexo") === "Relatorio final",
  montarNomeDoDocumento("Relatorio final.pdf", "Anexo"),
);
checar(
  "o tipo nao se repete no nome",
  montarNomeDoDocumento("Anexo Contrato 12.pdf", "Anexo") === "Contrato 12",
  montarNomeDoDocumento("Anexo Contrato 12.pdf", "Anexo"),
);
checar(
  "nome que apenas COMECA com as letras do tipo nao e cortado",
  montarNomeDoDocumento("Anexos diversos.pdf", "Anexo") === "Anexos diversos",
  montarNomeDoDocumento("Anexos diversos.pdf", "Anexo"),
);
{
  const longo = montarNomeDoDocumento(`${"Documento muito comprido ".repeat(5)}fim.pdf`, "Anexo");
  checar("nome longo e cortado", longo.length <= 60, `${longo.length}: ${longo}`);
  checar("o corte respeita a palavra", !longo.endsWith("Docum"), longo);
}
checar(
  "nome sem extensao sobrevive",
  montarNomeDoDocumento("Contrato sem ponto", "Anexo") === "Contrato sem ponto",
);

console.log("\n== nome do arquivo enviado ==");

checar(
  "acento sai do nome do arquivo",
  nomeParaUpload("Ofício de Fiscalização.pdf") === "Oficio de Fiscalizacao.pdf",
  nomeParaUpload("Ofício de Fiscalização.pdf"),
);
// O ordinal NAO e acento: `normalize("NFD")` nao o decompoe, e o `removeAcentos`
// do SEI Pro tambem o deixa passar. Fixado aqui para que "consertar" isso um dia
// exija olhar o outro lado antes -- o upload da arvore ja envia assim.
checar(
  "o ordinal sobrevive, como no upload da arvore",
  nomeParaUpload("Oficio nº 3.pdf") === "Oficio nº 3.pdf",
  nomeParaUpload("Oficio nº 3.pdf"),
);
checar(
  "pontuacao que o upload recusa vira sublinhado",
  nomeParaUpload('doc(1):x*?.pdf') === "doc_1__x__.pdf",
  nomeParaUpload('doc(1):x*?.pdf'),
);

/* ------------------------------------------------------------------ *
 * hdnAnexos
 * ------------------------------------------------------------------ */

console.log("\n== hdnAnexos ==");

// Como o SEI responde ao upload: id#nome#?#tamanho#data
const RESPOSTA = ["arq_9f3c", "documento-tarjado.pdf", "?", "84299", "10/09/2026 14:22:31"];
const hdn = montarHdnAnexos(RESPOSTA, "FULANO", "COORD-TI", () => "82,32 KB");

checar("o id abre o campo", hdn.startsWith("arq_9f3c"), hdn.slice(0, 40));
// A armadilha 3: data antes do tamanho, invertido em relacao a resposta.
checar("a data vem antes do tamanho", hdn.indexOf("2026") < hdn.indexOf("84299"), hdn);
checar("o usuario e a unidade fecham o campo", hdn.endsWith("FULANO%B1COORD-TI"), hdn.slice(-40));
checar(
  "o separador vai como byte latin1, sem o %C2 do UTF-8",
  hdn.includes("%B1") && !hdn.includes("%C2"),
  hdn,
);
checar("espaco vira +, e nao %20", hdn.includes("+") && !hdn.includes("%20"), hdn);

/* ------------------------------------------------------------------ *
 * Corpo do POST
 * ------------------------------------------------------------------ */

console.log("\n== corpo do POST ==");

// Os codificadores do SEI Pro, reproduzidos: `escape()` e a versao hexadecimal.
const cod = {
  escapar: (s: string) => escape(s).replace(/\+/g, "%2B"),
  hexar: (s: string) => {
    let r = "";
    for (const ch of s) {
      if (ch === " ") r += "+";
      else if (ch.normalize("NFD").replace(/[̀-ͯ]/g, "") !== ch)
        r += `%${ch.charCodeAt(0).toString(16)}`.slice(-4).toUpperCase();
      else r += ch;
    }
    return r;
  },
};

const corpo = montarCorpoDoPost(
  {
    hdnIdProcedimento: "99",
    txtNumero: "Ofício nº 3 tarjado",
    txtDataElaboracao: "10/09/2026",
    hdnAnexos: hdn,
    selSerie: "21",
  },
  cod,
);

// A armadilha 2.
checar(
  "acento do nome vai em latin1 (%CD/%E7...), nao em UTF-8 (%C3%AD)",
  !corpo.includes("%C3%A") && /txtNumero=[^&]*%\w\w/.test(corpo),
  corpo.split("&").find((p) => p.startsWith("txtNumero=")),
);
checar(
  "espaco do nome vira +",
  corpo.includes("txtNumero=") && !corpo.match(/txtNumero=[^&]*%20/),
  corpo.split("&").find((p) => p.startsWith("txtNumero=")),
);
checar(
  "hdnAnexos vai cru, sem recodificar",
  corpo.includes(`hdnAnexos=${hdn}`),
);
// `escape()` deixa `@ * _ + - . /` passar, e a data vai com as barras cruas.
// E o que o SEI recebe hoje pelo upload da arvore: barra crua e valida em
// `application/x-www-form-urlencoded`, e escapa-la aqui seria divergir.
checar(
  "a data vai com as barras cruas, como no upload da arvore",
  corpo.includes("txtDataElaboracao=10/09/2026"),
  corpo.split("&").find((p) => p.startsWith("txtDataElaboracao=")),
);
checar("todos os campos entraram", corpo.split("&").length === 5, corpo);

/* ------------------------------------------------------------------ *
 * Leitura do desfecho
 * ------------------------------------------------------------------ */

console.log("\n== desfecho ==");

const URL_OK =
  "https://sei.exemplo.gov.br/sei/controlador.php?acao=arvore_visualizar&acao_origem=documento_receber&id_procedimento=99&id_documento=3009576";

checar("redirecionou para a arvore = deu certo", envioConcluido(URL_OK));
checar(
  "voltar para a propria tela de cadastro NAO e sucesso",
  !envioConcluido("https://sei.exemplo.gov.br/sei/controlador.php?acao=documento_receber&id_procedimento=99"),
);
checar(
  "a arvore por outro caminho tambem nao conta",
  !envioConcluido("https://sei.exemplo.gov.br/sei/controlador.php?acao=arvore_visualizar&id_procedimento=99"),
);
checar("o id do documento sai da URL", idDoDocumento(URL_OK) === "3009576", String(idDoDocumento(URL_OK)));
checar("sem id na URL, devolve nulo", idDoDocumento("controlador.php?acao=x") === null);

console.log("\n== data ==");
checar(
  "data no formato do SEI, com zero a esquerda",
  dataDeHoje(new Date(2026, 8, 3)) === "03/09/2026",
  dataDeHoje(new Date(2026, 8, 3)),
);

/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ *
 * A sequência dos quatro passos, com a rede simulada
 * ------------------------------------------------------------------ */

console.log("\n== sequencia completa ==");

/**
 * Arvore do processo, com a barra de acoes.
 *
 * O link de Incluir Documento vem ASSINADO (`infra_hash`), dentro da string
 * JavaScript `Nos[0].acoes` -- que e exatamente como o `ProcedimentoINT` do SEI
 * o emite. E o unico caminho legitimo ate a tela de documento externo.
 */
const ARVORE = `<html><body><script>
var Nos = [];
Nos[0] = new infraArvoreNo("PROCEDIMENTO","683589","683589");
Nos[0].acoes = '<a href="controlador.php?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=99&arvore=1&infra_hash=ASSINADO123" tabindex="100" ><img   src="svg/documento_incluir.svg" alt="Incluir Documento" title="Incluir Documento"/></a><a href="controlador.php?acao=procedimento_enviar&id_procedimento=99&infra_hash=XYZ"><img src="e.svg" title="Enviar Processo"/></a>';
</script></body></html>`;

/** Arvore de quem nao pode incluir documento: a barra vem sem o botao. */
const ARVORE_SEM_INCLUIR = ARVORE.replace(/<a href="[^"]*documento_escolher_tipo[^"]*"[^>]*>.*?<\/a>/, "");

/** Escolha de tipo do SEI 5: toda ancora com href="#", escolha por POST. */
const ESCOLHA_SEI5 = `<html><body>
<form id="frmDocumentoEscolherTipo" method="post" action="controlador.php?acao=documento_escolher_tipo&amp;acao_origem=documento_escolher_tipo&amp;id_procedimento=99&amp;infra_hash=ggg">
  <input type="hidden" id="hdnInfraTipoPagina" name="hdnInfraTipoPagina" value="1" />
  <input type="hidden" id="hdnIdProcedimento" name="hdnIdProcedimento" value="99" />
  <input type="hidden" id="hdnIdSerie" name="hdnIdSerie" value="" />
  <table id="tblSeries"><tbody>
    <tr><td><input type="checkbox" value="-1" style="display:none;" /><a href="#" onclick="escolher(-1)" class="ancoraOpcao"> Externo</a></td></tr>
    <tr><td><input type="checkbox" value="12" style="display:none;" /><a href="#" onclick="escolher(12)" class="ancoraOpcao">Despacho</a></td></tr>
  </tbody></table>
</form></body></html>`;

/** Escolha de tipo até o SEI 4: link direto para documento_receber. */
const ESCOLHA_SEI4 = `<html><body>
<table id="tblSeries"><tbody>
  <tr><td><a href="controlador.php?acao=documento_receber&amp;acao_origem=documento_escolher_tipo&amp;id_procedimento=99&amp;infra_hash=hhh" class="ancoraOpcao">Externo</a></td></tr>
</tbody></table></body></html>`;

const TELA_LOGIN = `<html><body><form id="frmLogin" action="x"><input id="txtUsuario"></form></body></html>`;

const URL_SUCESSO =
  "https://sei.exemplo.gov.br/sei/controlador.php?acao=arvore_visualizar&acao_origem=documento_receber&id_procedimento=99&id_documento=3009576";

interface Chamada {
  url: string;
  metodo: string;
  corpo?: string;
  cabecalhos?: Record<string, string>;
}

function respostaFalsa(corpo: string, url = "https://sei.exemplo.gov.br/sei/x", ok = true) {
  return { ok, url, __corpo: corpo } as unknown as Response;
}

/** Monta o ambiente simulado; devolve também o registro do que foi chamado. */
function ambienteFalso(
  roteador: (c: Chamada) => Response,
  opcoes: { respostaUpload?: string; arvore?: string } = {},
) {
  const chamadas: Chamada[] = [];
  const progressos: number[] = [];
  const amb = {
    buscar: async (url: string, init?: RequestInit) => {
      const c: Chamada = {
        url,
        metodo: init?.method ?? "GET",
        corpo: typeof init?.body === "string" ? init.body : undefined,
        cabecalhos: (init?.headers as Record<string, string>) ?? undefined,
      };
      chamadas.push(c);
      return roteador(c);
    },
    postarArquivo: async (
      url: string,
      arquivo: File,
      aoProgredir: (f: number, t: number) => void,
    ) => {
      chamadas.push({ url, metodo: "POST-arquivo", corpo: arquivo.name });
      aoProgredir(50, 100);
      aoProgredir(100, 100);
      return (
        opcoes.respostaUpload ??
        "arq_9f3c#documento-tarjado.pdf#?#84299#10/09/2026 14:22:31"
      );
    },
    lerTexto: async (r: Response) => (r as unknown as { __corpo: string }).__corpo,
    htmlDaArvore: async () => {
      chamadas.push({ url: "(arvore)", metodo: "GET" });
      return opcoes.arvore ?? ARVORE;
    },
    formatarTamanho: () => "82,32 KB",
    codificadores: cod,
    config: {},
  };
  return { amb, chamadas, progressos: (p: number) => progressos.push(p) };
}

const ARQUIVO = { name: "documento-tarjado.pdf" } as unknown as File;

function pedido(extra: Record<string, unknown> = {}) {
  return {
    idProcedimento: "99",
    nome: "Oficio 32 tarjado.pdf",
    arquivo: ARQUIVO,
    ...extra,
  } as Parameters<typeof enviarDocumentoExterno>[0];
}

/* --- caminho feliz no SEI 5 --- */
{
  const { amb, chamadas } = ambienteFalso((c) => {
    if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI5);
    if (c.url.includes("documento_escolher_tipo") && c.metodo === "POST")
      return respostaFalsa(TELA_EXTERNO);
    if (c.url.includes("acao=documento_receber"))
      return respostaFalsa("", URL_SUCESSO);
    throw new Error(`rota inesperada: ${c.metodo} ${c.url}`);
  });

  const vistos: number[] = [];
  const r = await enviarDocumentoExterno(pedido(), amb, (f, t) => vistos.push(f / t));

  checar("SEI 5: envio concluido com o id do documento", r.id === "3009576", r.id);

  // O CASO QUE DERRUBAVA A SESSAO. Link de acao sem `infra_hash` faz o SEI
  // chamar `sair()` -- o usuario e DESLOGADO no meio do trabalho, e a unica
  // pista e "Link sem assinatura" na tela de login. A entrada tem de ser o link
  // que a propria arvore publica, ja assinado.
  checar(
    "SEI 5: a entrada foi o link ASSINADO da arvore",
    chamadas[1].url.includes("infra_hash=ASSINADO123"),
    chamadas[1].url,
  );
  checar(
    "SEI 5: nenhuma URL de acao foi montada a mao",
    chamadas.every(
      (c) => c.url === "(arvore)" || c.url.includes("infra_hash=") || c.metodo === "POST-arquivo",
    ),
    chamadas.filter((c) => c.url !== "(arvore)" && !c.url.includes("infra_hash=")).map((c) => c.url).join(" | "),
  );
  checar("SEI 5: cinco idas a rede (arvore + escolha + tela + arquivo + gravacao)", chamadas.length === 5, String(chamadas.length));
  checar(
    "SEI 5: a escolha do tipo foi POST com hdnIdSerie=-1",
    chamadas[2].metodo === "POST" && chamadas[2].corpo?.includes("hdnIdSerie=-1") === true,
    chamadas[2].corpo,
  );
  checar(
    "SEI 5: as entidades &amp; da action foram desfeitas",
    !chamadas[2].url.includes("&amp;"),
    chamadas[2].url,
  );
  checar(
    "SEI 5: os campos ocultos da escolha viajaram junto",
    chamadas[2].corpo?.includes("hdnIdProcedimento=99") === true,
    chamadas[2].corpo,
  );
  checar("SEI 5: o arquivo foi postado", chamadas[3].metodo === "POST-arquivo");
  checar(
    "SEI 5: o arquivo foi para a URL do infraUpload",
    chamadas[3].url.includes("acao=documento_upload_anexo"),
    chamadas[3].url,
  );
  checar("SEI 5: o progresso do envio foi repassado", vistos.length === 2 && vistos[1] === 1);

  const finalPost = chamadas[4];
  checar(
    "SEI 5: o POST final declara ISO-8859-1",
    finalPost.cabecalhos?.["Content-Type"]?.includes("ISO-8859-1") === true,
    JSON.stringify(finalPost.cabecalhos),
  );
  checar(
    "SEI 5: o tipo escolhido pelo nome do arquivo foi para o formulario",
    finalPost.corpo?.includes("selSerie=21") === true && finalPost.corpo?.includes("hdnIdSerie=21") === true,
    finalPost.corpo?.split("&").filter((x) => x.includes("Serie")).join(" "),
  );
  checar(
    "SEI 5: hdnFlagDocumentoCadastro=2, que e o que grava",
    finalPost.corpo?.includes("hdnFlagDocumentoCadastro=2") === true,
  );
  checar(
    "SEI 5: o nome do documento perdeu a extensao",
    finalPost.corpo?.includes("txtNumero=32+tarjado") === true,
    finalPost.corpo?.split("&").find((x) => x.startsWith("txtNumero=")),
  );
  checar(
    "SEI 5: o anexo do upload entrou em hdnAnexos",
    finalPost.corpo?.includes("hdnAnexos=arq_9f3c") === true,
  );
  checar(
    "SEI 5: o nivel de acesso marcado no formulario foi respeitado",
    finalPost.corpo?.includes("rdoNivelAcesso=0") === true,
  );
}

/* --- caminho do SEI 4: link direto --- */
{
  const { amb, chamadas } = ambienteFalso((c) => {
    // O link direto carrega `acao_origem=documento_escolher_tipo`, entao o hash
    // e o que separa uma tela da outra -- exatamente como no SEI.
    if (c.url.includes("infra_hash=hhh")) return respostaFalsa(TELA_EXTERNO);
    if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI4);
    if (c.url.includes("acao=documento_receber")) return respostaFalsa("", URL_SUCESSO);
    throw new Error(`rota inesperada: ${c.metodo} ${c.url}`);
  });

  const r = await enviarDocumentoExterno(pedido(), amb);
  checar("SEI 4: envio concluido pelo link direto", r.id === "3009576", r.id);
  checar(
    "SEI 4: o link foi seguido por GET, sem POST de escolha",
    chamadas[2].metodo === "GET" && chamadas[2].url.includes("infra_hash=hhh"),
    `${chamadas[2].metodo} ${chamadas[2].url}`,
  );
  checar(
    "SEI 4: as entidades &amp; do link foram desfeitas",
    !chamadas[2].url.includes("&amp;"),
    chamadas[2].url,
  );
}

/* --- o tipo pedido explicitamente vence o nome do arquivo --- */
{
  const { amb, chamadas } = ambienteFalso((c) => {
    if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI5);
    if (c.url.includes("documento_escolher_tipo")) return respostaFalsa(TELA_EXTERNO);
    return respostaFalsa("", URL_SUCESSO);
  });
  await enviarDocumentoExterno(pedido({ tipoDocumentoId: "33" }), amb);
  checar(
    "o tipo pedido pela ferramenta prevalece",
    chamadas[4].corpo?.includes("selSerie=33") === true,
    chamadas[4].corpo?.split("&").find((x) => x.startsWith("selSerie=")),
  );
}

/* --- falhas --- */

async function codigoDoErro(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
    return "SEM_ERRO";
  } catch (e) {
    return (e as { codigo?: string }).codigo ?? `SEM_CODIGO(${(e as Error).message})`;
  }
}

{
  // Sem a opcao Externo: o usuario nao tem a permissao documento_receber.
  const semExterno = ESCOLHA_SEI5.replace('value="-1"', 'value="98"');
  const { amb } = ambienteFalso(() => respostaFalsa(semExterno));
  checar(
    "sem a opcao Externo o envio para com SEM_PERMISSAO",
    (await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb))) === "SEI_SEM_PERMISSAO",
  );
}

{
  // Sessao caida: o SEI devolve a tela de login com status 200.
  const { amb } = ambienteFalso(() => respostaFalsa(TELA_LOGIN));
  checar(
    "tela de login na escolha vira SESSAO_EXPIRADA, e nao SEM_PERMISSAO",
    (await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb))) === "SEI_SESSAO_EXPIRADA",
  );
}

{
  // O formulario voltou para si mesmo: o SEI recusou algo.
  const recusa = `<html><body><div id="divInfraAreaTela"><div class="infraMsg">Tipo de documento nao informado.</div></div><form id="frmDocumentoCadastro"></form></body></html>`;
  const { amb } = ambienteFalso((c) => {
    if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI5);
    if (c.url.includes("documento_escolher_tipo")) return respostaFalsa(TELA_EXTERNO);
    return respostaFalsa(recusa, "https://sei.exemplo.gov.br/sei/controlador.php?acao=documento_receber");
  });
  const erro = await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb));
  checar("formulario recusado vira ENVIO_RECUSADO", erro === "SEI_ENVIO_RECUSADO", erro);
}

{
  // Sessao caida no POST final: NAO pode ser confundida com recusa, senao a
  // mensagem manda o usuario conferir tamanho e extensao sem motivo.
  const { amb } = ambienteFalso((c) => {
    if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI5);
    if (c.url.includes("documento_escolher_tipo")) return respostaFalsa(TELA_EXTERNO);
    return respostaFalsa(TELA_LOGIN, "https://sei.exemplo.gov.br/sei/controlador.php?acao=login");
  });
  const erro = await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb));
  checar("login no POST final vira SESSAO_EXPIRADA", erro === "SEI_SESSAO_EXPIRADA", erro);
}

{
  // O upload respondeu qualquer outra coisa (erro do PHP, HTML, vazio).
  const { amb } = ambienteFalso(
    (c) => {
      if (c.url.includes("infra_hash=ASSINADO123")) return respostaFalsa(ESCOLHA_SEI5);
      return respostaFalsa(TELA_EXTERNO);
    },
    { respostaUpload: "<b>Fatal error</b>: allowed memory size exhausted" },
  );
  const erro = await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb));
  checar("resposta de upload malformada vira ENVIO_RECUSADO", erro === "SEI_ENVIO_RECUSADO", erro);
}

{
  const { amb } = ambienteFalso(() => respostaFalsa(ESCOLHA_SEI5));
  const erro = await codigoDoErro(() =>
    enviarDocumentoExterno(pedido({ idProcedimento: "" }), amb),
  );
  checar("sem processo, para antes de tocar a rede", erro === "SEI_SEM_PROCESSO", erro);
}

{
  // Sem o botao na arvore: este usuario nao pode incluir documento aqui.
  const { amb, chamadas } = ambienteFalso(() => respostaFalsa(ESCOLHA_SEI5), {
    arvore: ARVORE_SEM_INCLUIR,
  });
  const erro = await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb));
  checar("arvore sem o botao Incluir Documento vira SEM_PERMISSAO", erro === "SEI_SEM_PERMISSAO", erro);
  checar(
    "e nada foi pedido ao SEI depois disso",
    chamadas.length === 1 && chamadas[0].url === "(arvore)",
    chamadas.map((c) => c.url).join(" | "),
  );
}

{
  // A arvore veio como tela de login: sessao caida, nao falta de permissao.
  const { amb } = ambienteFalso(() => respostaFalsa(ESCOLHA_SEI5), { arvore: TELA_LOGIN });
  const erro = await codigoDoErro(() => enviarDocumentoExterno(pedido(), amb));
  checar("arvore que voltou login vira SESSAO_EXPIRADA", erro === "SEI_SESSAO_EXPIRADA", erro);
}

console.log("\n== o link assinado, extraido da arvore ==");

checar(
  "o link de Incluir Documento e encontrado na barra de acoes",
  acharLinkDeIncluirDocumento(ARVORE)?.includes("infra_hash=ASSINADO123") === true,
  String(acharLinkDeIncluirDocumento(ARVORE)),
);
checar(
  "e nao se confunde com os outros botoes da barra",
  acharLinkDeIncluirDocumento(ARVORE)?.includes("procedimento_enviar") === false,
);
checar(
  "arvore sem o botao devolve nulo",
  acharLinkDeIncluirDocumento(ARVORE_SEM_INCLUIR) === null,
  String(acharLinkDeIncluirDocumento(ARVORE_SEM_INCLUIR)),
);
checar(
  "as entidades &amp; do href sao desfeitas",
  acharLinkDeIncluirDocumento(
    `<a href="controlador.php?acao=documento_escolher_tipo&amp;id_procedimento=9&amp;infra_hash=Z">x</a>`,
  ) === "controlador.php?acao=documento_escolher_tipo&id_procedimento=9&infra_hash=Z",
);

/* ------------------------------------------------------------------ *
 * Guarda: nenhuma URL de ação montada à mão
 * ------------------------------------------------------------------ */

console.log("\n== nenhuma URL de acao montada a mao ==");

/*
 * POR QUE ESTE GUARDA EXISTE, e por que ele vale mais que os outros.
 *
 * O SEI assina cada link de acao com `infra_hash`. Diante de um link de acao
 * SEM assinatura, `InfraSessao::validarLink` nao devolve erro: ele chama
 * `sair()`. O usuario e DESLOGADO do SEI, perde o que estava fazendo em todas
 * as abas, e a unica pista e "Link sem assinatura" na tela de login -- que nao
 * aponta para a extensao nem para a acao que a causou.
 *
 * Montar `controlador.php?acao=<qualquer_coisa>&id_procedimento=N` e o gesto
 * mais natural do mundo, e foi exatamente o que quebrou. A lista abaixo e a de
 * `SessaoSEI::tratarLinkSemAssinatura` do SEI 5: TRES formas, todas
 * `procedimento_trabalhar`. Qualquer outra acao tem de vir de um href que o
 * proprio SEI publicou.
 */
const ACOES_LIBERADAS = [
  /^\?acao=procedimento_trabalhar&id_procedimento=[^&]+$/,
  /^\?acao=procedimento_trabalhar&id_procedimento=[^&]+&id_documento=[^&]+$/,
  /^\?acao=procedimento_trabalhar&protocolo_pesquisa=[^&]+$/,
];

{
  const { readdirSync, readFileSync, statSync } = await import("node:fs");
  const { join, relative } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");

  const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

  function tsDe(dir: string): string[] {
    const saida: string[] = [];
    for (const nome of readdirSync(dir)) {
      const cam = join(dir, nome);
      if (statSync(cam).isDirectory()) saida.push(...tsDe(cam));
      else if (nome.endsWith(".ts")) saida.push(cam);
    }
    return saida;
  }

  const LITERAIS = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/gs;
  const suspeitas: string[] = [];
  let conferidas = 0;

  for (const cam of tsDe(join(RAIZ, "src"))) {
    const txt = readFileSync(cam, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, (m) => "\n".repeat((m.match(/\n/g) ?? []).length))
      .replace(/\/\/[^\n]*/g, "");
    LITERAIS.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = LITERAIS.exec(txt))) {
      const cru = m[2];
      // So interessa quem ABRE uma query string: `a[href*="acao=..."]` e
      // seletor CSS, nao URL.
      if (!cru.includes("?acao=")) continue;
      conferidas += 1;
      // As interpolacoes viram um marcador: o que importa e a FORMA.
      const forma = "?acao=" + cru.slice(cru.indexOf("?acao=") + 6).replace(/\$\{[^{}]*\}/g, "N");
      if (ACOES_LIBERADAS.some((r) => r.test(forma))) continue;
      const linha = txt.slice(0, m.index).split("\n").length;
      suspeitas.push(`${relative(RAIZ, cam)}:${linha} -> ${forma}`);
    }
  }

  checar("o varredor encontrou URLs para conferir", conferidas > 0, `${conferidas}`);
  checar(
    "nenhuma acao do SEI e montada a mao (o SEI desloga quem faz isso)",
    suspeitas.length === 0,
    suspeitas.join(" | "),
  );
}

/* ------------------------------------------------------------------ */

console.log(`\n${passou} conferem, ${falhou} falham\n`);
if (falhou > 0) process.exit(1);
