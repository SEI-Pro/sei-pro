/**
 * Lado do SEI do Documentos em Lote (modelo e criacao do documento da linha), com um `Http` falso sobre fixtures
 * SINTETICAS (tests/fixtures/LEIAME.txt), no molde de processos-lote/tests/verificar-sei.ts.
 *
 * O `Http` falso grava cada chamada (metodo, url, pares) e responde pela rota. `localizar`/`arvore`/`invalidar` do
 * `Sei` sao trocados por uma arvore montada aqui (ler a arvore e prova do nucleo). O editor e montado a partir do
 * estado das secoes, para a releitura depois de gravar (conferencia do nucleo) ver o que foi gravado. O CK5 grava
 * por `fetch` global (POST JSON): o teste o troca por um gravador durante a prova.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import { Sei } from "@nucleo/sei";
import { analisarHtml, definirAnalisador } from "@nucleo/sessao/dom";
import { ErroSei } from "@nucleo/sessao/erros";
import type { Http, OpcoesHttp, Pagina } from "@nucleo/sessao/http";
import { DOMParser } from "linkedom";
import { textoCitaProcesso } from "../src/app/previa";
import { criarDocumentoDaLinha, ErroDocumentoCriado, type PedidoCriar } from "../src/sei/criar";
import { lerModelo, listarModelos, type Modelo, textoDaPrevia } from "../src/sei/modelo";
import { checar, igual, lanca, secao } from "./util";

const parser = new DOMParser();
definirAnalisador((html) => parser.parseFromString(html, "text/html") as unknown as Document);

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = "https://sei.exemplo.gov.br/sei/";
const ORIGEM = `${BASE}controlador.php`;
const H = "a".repeat(64);
const assinado = (q: string) => `controlador.php?${q}&infra_sistema=100000100&infra_unidade_atual=110000001&infra_hash=${H}`;

const LINK_ESCOLHER = assinado("acao=documento_escolher_tipo&acao_origem=arvore_visualizar&id_procedimento=500");
const LINK_ALTERAR_700 = assinado("acao=documento_alterar&acao_origem=arvore_visualizar&id_procedimento=500&id_documento=700");
const SRC_700 = assinado("acao=documento_visualizar&id_documento=700");
const LINK_EDITOR_701 = assinado("acao=editor_montar&acao_origem=arvore_visualizar&id_procedimento=500&id_documento=701");
const URL_SALVAR_CK4 = `editor/editor_processar.php?acao=editor_salvar&id_documento=701&infra_hash=${H}`;
const URL_SALVAR_CK5 = "controlador_rest.php?acao_rest=editor_salvar_conteudo&id_documento=701";

function pagina(url: string, html: string): Pagina {
  let doc: Document | null = null;
  return {
    url,
    status: 200,
    html,
    get doc() {
      if (!doc) doc = analisarHtml(html);
      return doc;
    },
  };
}

function bruto(nome: string): string {
  return readFileSync(join(AQUI, "fixtures", nome), "utf8");
}

/** Fixture com a primeira linha `<!-- url: ... -->` (a URL final da resposta). */
function fixture(nome: string, troca: (h: string) => string = (h) => h): Pagina {
  const b = bruto(nome);
  const url = /^<!-- url: (.*?) -->/.exec(b)?.[1] ?? ORIGEM;
  return pagina(url, troca(b.replace(/^<!-- url: .*? -->\n/, "")));
}

type Pares = Array<[string, string]>;
interface Chamada {
  metodo: "GET" | "POST";
  url: string;
  campos: Pares;
}

interface SecaoFalsa {
  nome: string;
  titulo: string;
  somenteLeitura?: boolean;
  html: string;
}

/**
 * editor_montar do CK4: uma textarea por secao e um CKEDITOR.replace com title/readOnly (forma lida por `lerEditor`).
 * O conteudo vai CRU na textarea: o linkedom nao decodifica entidades dentro de <textarea> (o navegador decodifica),
 * entao o cru aqui da o mesmo `textContent` que o SEI escapado da no navegador.
 */
function editorCk4(secoes: SecaoFalsa[]): string {
  const areas = secoes.map((s) => `<textarea name="${s.nome}" id="${s.nome}">${s.html}</textarea>`).join("\n");
  const scripts = secoes
    .map((s) => `CKEDITOR.replace('${s.nome}', {title:"${s.titulo}","readOnly":${s.somenteLeitura ? "true" : "false"}});`)
    .join("\n");
  return `<html><head><title>SEI - Editor</title></head><body>
<form id="frmEditor" method="post" action="${URL_SALVAR_CK4}">
<input type="hidden" name="hdnVersao" value="1"/>
<div id="divEditores">${areas}</div>
</form>
<script>${scripts}</script>
</body></html>`;
}

/** editor_montar do CK5: `window.INFRA_EDITOR_CONFIG` com initialData, rootsAttributes e sei.urlSalvar. */
function editorCk5(secoes: SecaoFalsa[], semVersao = false): string {
  const cfg = {
    initialData: Object.fromEntries(secoes.map((s) => [s.nome, s.html])),
    rootsAttributes: Object.fromEntries(secoes.map((s) => [s.nome, { somenteLeitura: Boolean(s.somenteLeitura), label: s.titulo }])),
    sei: semVersao ? { urlSalvar: URL_SALVAR_CK5, siglaUnidade: "TESTE" } : { urlSalvar: URL_SALVAR_CK5, versao: 7, siglaUnidade: "TESTE" },
  };
  return `<html><head><title>SEI - Editor</title></head><body><script>window.INFRA_EDITOR_CONFIG = ${JSON.stringify(cfg)};</script></body></html>`;
}

const SECOES_PADRAO = (): SecaoFalsa[] => [
  { nome: "txaEditor_1", titulo: "Cabeçalho", somenteLeitura: true, html: "<p>Cabeçalho ##nome##</p>" },
  { nome: "txaEditor_2", titulo: "Corpo do Texto", html: '<p class="Texto_Justificado">Prezado ##nome##, ##x## e CPF ##cpf##.</p>' },
  { nome: "txaEditor_3", titulo: "Rodapé", html: "<p>Rodapé fixo</p>" },
];

interface Montagem {
  editor?: "ck4" | "ck5";
  secoes?: SecaoFalsa[];
  /** Troca no HTML da tela de cadastro (ex.: Número obrigatório). */
  cadastro?: (h: string) => string;
  /** O POST de cadastro lança este erro (o que o `Http` de verdade faz com `#txaInfraValidacao`). */
  cadastroErro?: ErroSei;
  /** O POST de cadastro volta sem a prova de sucesso. */
  cadastroSemProva?: boolean;
  /** A gravação do editor é recusada (CK4: corpo diferente de "OK"). */
  salvarFalha?: boolean;
  processoSigiloso?: boolean;
  modeloSigiloso?: boolean;
  /** Depois do POST do cadastro, a releitura da árvore falha por rede ou pelo cancelamento do usuário. */
  arvorePosCadastro?: "rede" | "aborto";
  /** CK5 com a configuração sem `versao`. */
  ck5SemVersao?: boolean;
  /** Troca no HTML da visualização do modelo (documento 700). */
  modelo?: (h: string) => string;
}

function docArvore(d: Partial<DocumentoArvore> & Pick<DocumentoArvore, "id" | "numero" | "titulo">): DocumentoArvore {
  return {
    pasta: null,
    externo: false,
    formato: "interno",
    nivel: "publico",
    assinado: false,
    assinaturas: [],
    cancelado: false,
    link: assinado(`acao=arvore_visualizar&id_procedimento=500&id_documento=${d.id}`),
    src: "",
    acoes: [],
    botoes: [],
    ...d,
  };
}

function montar(o: Montagem = {}) {
  const chamadas: Chamada[] = [];
  const fetches: Array<{ url: string; corpo: unknown }> = [];
  const secoes = o.secoes ?? SECOES_PADRAO();
  const tipoEditor = o.editor ?? "ck4";
  const invalidados: string[] = [];
  const base = new URL(BASE);
  const absoluta = (url: string) => new URL(url.replace(/&amp;/g, "&"), base).href;
  const controle = new AbortController();
  const cadastrou = () => chamadas.some((c) => c.metodo === "POST" && c.url.includes("acao=documento_cadastrar"));

  const responder = async (metodo: "GET" | "POST", url: string, campos: Pares): Promise<Pagina> => {
    const abs = absoluta(url);
    chamadas.push({ metodo, url: abs, campos });
    const v = (n: string) => campos.find(([k]) => k === n)?.[1];
    if (metodo === "GET") {
      if (abs.includes("acao=texto_padrao_interno_listar")) return fixture("texto_padrao_listar.html");
      if (abs.includes("acao=texto_padrao_interno_consultar") && abs.includes("id_texto_padrao_interno=5&"))
        return fixture("texto_padrao_consultar.html");
      if (abs.includes("acao=documento_escolher_tipo&acao_origem=arvore_visualizar")) return fixture("escolher_tipo.html");
      if (abs.includes("acao=documento_alterar&") && abs.includes("id_documento=700")) return fixture("documento_alterar.html");
      if (abs.includes("acao=documento_visualizar&id_documento=700")) return fixture("modelo_visualizar.html", o.modelo);
      if (abs.includes("acao=editor_montar") && abs.includes("id_documento=701"))
        return pagina(abs, tipoEditor === "ck5" ? editorCk5(secoes, o.ck5SemVersao) : editorCk4(secoes));
    } else {
      if (abs.includes("acao=documento_escolher_tipo&acao_origem=documento_escolher_tipo") && v("hdnIdSerie")) {
        return fixture("cadastro.html", o.cadastro);
      }
      if (abs.includes("acao=documento_cadastrar&acao_origem=documento_cadastrar")) {
        if (o.cadastroErro) throw o.cadastroErro;
        if (o.cadastroSemProva) return fixture("cadastro.html");
        if (o.arvorePosCadastro === "aborto") controle.abort();
        return pagina(
          absoluta(assinado("acao=arvore_visualizar&acao_origem=documento_cadastrar&id_procedimento=500&id_documento=701")),
          "<html><body>ok</body></html>",
        );
      }
      if (abs.includes("acao=editor_salvar")) {
        if (o.salvarFalha) return pagina(abs, "<html><body>ERRO Existe uma nova versão</body></html>");
        for (const s of secoes) {
          const novo = v(s.nome);
          if (novo !== undefined) s.html = novo;
        }
        return pagina(abs, "<html><body>OK 2</body></html>");
      }
    }
    throw new Error(`rota nao prevista: ${metodo} ${abs} ${JSON.stringify(campos)}`);
  };

  const http: Http & { chamadas: Chamada[] } = {
    base,
    absoluta,
    chamadas,
    obter: (url: string, _op?: OpcoesHttp) => responder("GET", url, []),
    enviar: (url: string, campos: ReadonlyArray<readonly [string, string]>, _op?: OpcoesHttp) =>
      responder(
        "POST",
        url,
        campos.map(([n, v]) => [n, v] as [string, string]),
      ),
    baixar: async () => {
      throw new Error("baixar nao previsto");
    },
  };

  const menu = fixture("menu.html");
  const sei = new Sei(menu.url, () => menu);
  (sei as unknown as { http: Http }).http = http;

  const modelo = docArvore({
    id: "700",
    numero: "0100001",
    titulo: "Ofício 1",
    src: SRC_700,
    acoes: [LINK_ALTERAR_700],
    nivel: o.modeloSigiloso ? "sigiloso" : "publico",
  });
  const anexo = docArvore({ id: "702", numero: "0100003", titulo: "Anexo PDF", externo: true, formato: "pdf" });
  const cancelado = docArvore({ id: "703", numero: "0100004", titulo: "Despacho cancelado", cancelado: true });
  const novo = docArvore({ id: "701", numero: "0100002", titulo: "Ofício Jose da Silva", acoes: [LINK_EDITOR_701] });
  const arvore = (): Arvore => ({
    idProcedimento: "500",
    protocolo: "99999.000001/2026-01",
    tipo: "Teste",
    nivel: o.processoSigiloso ? "sigiloso" : "publico",
    marcadores: [],
    documentos: cadastrou() ? [modelo, anexo, cancelado, novo] : [modelo, anexo, cancelado],
    acoesProcesso: [LINK_ESCOLHER],
    botoesProcesso: [],
    linkProcesso: "",
    sinais: [],
    links: [],
    pagina: menu,
  });
  Object.assign(sei, {
    localizar: async (ref: string) => {
      const doc = arvore().documentos.find((d) => d.numero === ref);
      return { idProcedimento: "500", idDocumento: doc?.id, linkArvore: "" };
    },
    arvore: async (_ref: string, op?: OpcoesHttp) => {
      if (cadastrou() && o.arvorePosCadastro === "rede") throw new ErroSei("SEI_REDE", "Falha ao falar com o SEI: tempo esgotado");
      if (op?.sinal?.aborted) throw new DOMException("Aborted", "AbortError");
      return arvore();
    },
    invalidar: (id?: string) => {
      invalidados.push(id ?? "*");
    },
  });

  // CK5 grava por fetch global: gravador durante a prova.
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    const corpo = JSON.parse(String(init?.body ?? "{}")) as { secoesConteudo?: Array<{ nome: string; html: string }> };
    fetches.push({ url: String(url), corpo });
    for (const s of corpo.secoesConteudo ?? []) {
      const alvo = secoes.find((x) => x.nome === s.nome);
      if (alvo) alvo.html = s.html;
    }
    return new Response(JSON.stringify({ versao: 8 }), { status: 200 });
  }) as typeof globalThis.fetch;
  const restaurar = () => {
    globalThis.fetch = fetchOriginal;
  };

  return { sei, chamadas, fetches, secoes, invalidados, restaurar, controle };
}

const posts = (c: Chamada[], trecho: string) => c.filter((x) => x.metodo === "POST" && x.url.includes(trecho));
const valor = (c: Chamada | undefined, nome: string) => c?.campos.find(([n]) => n === nome)?.[1];

const MODELO_DOC: Modelo = {
  origem: "documento",
  numero: "0100001",
  titulo: "Ofício 1",
  tipoId: "12",
  tipoNome: "Ofício",
  campos: ["nome", "x", "cpf"],
};
const MODELO_TP: Extract<Modelo, { origem: "texto-padrao" }> = {
  origem: "texto-padrao",
  id: "5",
  nome: "OFÍCIO",
  tipoId: "12",
  tipoNome: "Ofício",
  campos: ["nome"],
};

function pedido(p: Partial<PedidoCriar> = {}): PedidoCriar {
  return {
    processo: "99999.000001/2026-01",
    origem: ORIGEM,
    modelo: MODELO_DOC,
    linha: { Nome: 'José a<b & "c"', CPF: "123", x: "não usar" },
    colunaNome: "Nome",
    modeloDescricao: "Ofício - ##Nome##",
    nivel: "publico",
    camposCruzados: { nome: "Nome", cpf: "CPF" },
    ...p,
  };
}

async function comMontagem<T>(o: Montagem, fn: (m: ReturnType<typeof montar>) => Promise<T>): Promise<T> {
  const m = montar(o);
  try {
    return await fn(m);
  } finally {
    m.restaurar();
  }
}

export async function verificarSei(): Promise<void> {
  secao("sei: listar modelos");
  await comMontagem({}, async ({ sei, chamadas }) => {
    const r = await listarModelos(sei, "99999.000001/2026-01");
    igual("documentos: so os internos nao cancelados", r.documentos, [{ numero: "0100001", titulo: "Ofício 1" }]);
    igual("textos padrao sem os internos do SEI Pro ([_...])", r.textosPadrao, [
      { id: "230", nome: "Despacho" },
      { id: "5", nome: "OFÍCIO" },
    ]);
    igual(
      "tipos sem o Externo (-1)",
      r.tipos.map((t) => t.id),
      ["12", "15", "120"],
    );
    checar(
      "listar modelos nao faz POST",
      !chamadas.some((c) => c.metodo === "POST"),
      chamadas.map((c) => c.url),
    );
  });
  await comMontagem({ processoSigiloso: true }, async ({ sei, chamadas }) => {
    const e = await lanca(() => listarModelos(sei, "99999.000001/2026-01"));
    checar("listar modelos em processo sigiloso: SEI_SIGILOSO sem requisicao", e?.codigo === "SEI_SIGILOSO" && chamadas.length === 0, {
      e,
      chamadas,
    });
  });

  secao("sei: ler modelo");
  await comMontagem({}, async ({ sei, chamadas }) => {
    const { texto, ...m } = await lerModelo(sei, { documento: "0100001" });
    igual(
      "documento: texto simples do corpo (previa), sem o title",
      texto,
      "Ofício para ##nome##\nPrezado(a) ##nome##, CPF ##cpf##, município ##município##.",
    );
    igual("documento: tipo da tela de alteracao (id exato) e campos das duas secoes sem duplicar", m, {
      origem: "documento",
      numero: "0100001",
      titulo: "Ofício 1",
      tipoId: "12",
      tipoNome: "Ofício",
      campos: ["nome", "cpf", "município"],
    });
    checar(
      "documento: so leitura (nenhum POST)",
      !chamadas.some((c) => c.metodo === "POST"),
      chamadas.filter((c) => c.metodo === "POST").map((c) => c.url),
    );
    checar(
      "documento: nao abre o editor do modelo (cancelaria a assinatura)",
      !chamadas.some((c) => c.url.includes("editor_montar")),
      chamadas.map((c) => c.url),
    );
  });
  await comMontagem({ modeloSigiloso: true }, async ({ sei, chamadas }) => {
    const e = await lanca(() => lerModelo(sei, { documento: "0100001" }));
    checar(
      "documento sigiloso: SEI_SIGILOSO sem baixar o conteudo",
      e?.codigo === "SEI_SIGILOSO" && !chamadas.some((c) => c.url.includes("documento_visualizar")),
      { e, chamadas: chamadas.map((c) => c.url) },
    );
  });
  await comMontagem({}, async ({ sei }) => {
    const e = await lanca(() => lerModelo(sei, { documento: "0100003" }));
    checar("anexo (externo) nao serve de modelo: ARGUMENTO_INVALIDO", e?.codigo === "ARGUMENTO_INVALIDO", e);
  });
  await comMontagem({}, async ({ sei, chamadas }) => {
    const e = await lanca(() => lerModelo(sei, { textoPadrao: "5", tipoId: "" }));
    checar("texto padrao exige tipoId: ARGUMENTO_INVALIDO sem requisicao", e?.codigo === "ARGUMENTO_INVALIDO" && chamadas.length === 0, {
      e,
      chamadas,
    });
  });
  await comMontagem({}, async ({ sei, chamadas }) => {
    const { texto, ...m } = await lerModelo(sei, { textoPadrao: "5", tipoId: "12", tipoNome: "Ofício" });
    igual("texto padrao: texto simples do conteudo (previa)", texto, "Senhor(a) ##destinatário##, ##cargo## e ##destinatário##.");
    igual("texto padrao: devolve o tipoId fornecido e os campos do conteudo", m, {
      origem: "texto-padrao",
      id: "5",
      nome: "OFÍCIO",
      tipoId: "12",
      tipoNome: "Ofício",
      campos: ["destinatário", "cargo"],
    });
    checar("texto padrao: so leitura", !chamadas.some((c) => c.metodo === "POST"));
  });
  await comMontagem({}, async ({ sei }) => {
    const e = await lanca(() => lerModelo(sei, { textoPadrao: "77", tipoId: "12" }));
    checar("texto padrao inexistente: SEI_NAO_ENCONTRADO", e?.codigo === "SEI_NAO_ENCONTRADO", e);
  });

  secao("sei: texto do modelo sem o cabecalho de codigo de barras que o SEI refaz (N2 do SEI MJ 5.0.4)");
  {
    // Estrutura real do SEI 5.0.4 do MJ (documento_visualizar): tabela externa de 100% com a tabela dos dois
    // codigos de barras; o SEI a refaz em cada documento criado, com o numero e o processo de destino.
    const PROC = "00000.000004/2025-54";
    const cabecalho = [
      '<table width="100%"><tbody><tr><td><table align="left"><tbody>',
      '<tr><td align="center"><p class="Tabela_Texto_8_Centralizado"><img alt="C&oacute;digo de Barras do Documento" src="data:image/png;base64,AAAA" /></p></td>',
      '<td align="center"><p class="Tabela_Texto_8_Centralizado"><img alt="C&oacute;digo de Barras do Processo" src="data:image/png;base64,AAAA" /></p></td></tr>',
      `<tr><td align="center"><p class="Tabela_Texto_8_Centralizado">31573823</p></td><td align="center"><p class="Tabela_Texto_8_Centralizado">${PROC}</p></td></tr>`,
      "</tbody></table></td></tr></tbody></table>",
      '<p class="Texto_Centralizado">Minist&eacute;rio da Justi&ccedil;a</p>',
    ].join("\n");
    const comCabecalho = (corpoExtra: string) => (h: string) => h.replace("<body>", `<body>\n${cabecalho}\n${corpoExtra}`);
    await comMontagem({ modelo: comCabecalho("") }, async ({ sei }) => {
      const { texto, campos } = await lerModelo(sei, { documento: "0100001" });
      checar(
        "cabecalho de codigo de barras fora do texto do modelo",
        !(texto ?? "").includes(PROC) && !(texto ?? "").includes("31573823"),
        texto,
      );
      checar("corpo limpo: o aviso do processo do modelo NAO dispara", !textoCitaProcesso(texto ?? "", PROC), texto);
      checar(
        "o resto do texto continua (timbre e corpo)",
        (texto ?? "").startsWith("Minist\u00E9rio da Justi\u00E7a\nOf\u00EDcio para ##nome##"),
        texto,
      );
      igual("campos nao mudam", campos, ["nome", "cpf", "munic\u00EDpio"]);
    });
    await comMontagem({ modelo: comCabecalho(`<p class="Texto_Justificado">Ref.: Processo n&ordm; ${PROC}</p>`) }, async ({ sei }) => {
      const { texto } = await lerModelo(sei, { documento: "0100001" });
      checar("numero no texto editavel: o aviso dispara", textoCitaProcesso(texto ?? "", PROC), texto);
    });
    // SEI SP 4.1.5: o cabecalho "Processo n\u00BA ... / Interessado" e texto da secao editavel, copiado literal.
    const SP = "99906.713-630.000032/2025-82";
    const cabecalhoSp = `<p class="Texto_Alinhado_Esquerda">Processo n&ordm; ${SP}</p><p class="Texto_Alinhado_Esquerda">Interessado: CGE-CAUD</p>`;
    await comMontagem({ modelo: (h) => h.replace("<body>", `<body>\n${cabecalhoSp}`) }, async ({ sei }) => {
      const { texto } = await lerModelo(sei, { documento: "0100001" });
      checar("cabecalho do SP (texto literal) continua avisando", textoCitaProcesso(texto ?? "", SP), texto);
    });
    // Tabela de layout que envolve o documento inteiro: so o pedaco do codigo de barras sai.
    const envolto = (h: string) =>
      h.replace(
        "<body>",
        `<body>\n<table width="100%"><tbody><tr><td>${cabecalho}<p class="Texto_Justificado">Processo ${PROC} citado no corpo</p></td></tr></tbody></table>`,
      );
    await comMontagem({ modelo: envolto }, async ({ sei }) => {
      const { texto } = await lerModelo(sei, { documento: "0100001" });
      checar(
        "tabela de layout em volta: o corpo fica e o aviso dispara",
        (texto ?? "").includes("citado no corpo") && textoCitaProcesso(texto ?? "", PROC),
        texto,
      );
      checar("tabela de layout em volta: o numero do documento do cabecalho sai", !(texto ?? "").includes("31573823"), texto);
    });
  }

  secao("sei: texto da previa sem CSS, script, comentario nem imagem (D3)");
  {
    const B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const html = [
      "<head><title>Titulo ##x##</title><style>p.Texto { font-size: 12pt; }</style></head>",
      "<body>",
      "<!-- CONFIGURACOES DE IMPRESSAO -->",
      '<style type="text/css">@media print { .Tabela_Texto { color: red; } body { background: url(data:image/png;base64,AAAA); } }</style>',
      '<p class="Texto_Centralizado"><img alt="brasao" src="data:image/png;base64,',
      B64,
      '" /></p>',
      "<p>Senhor ##nome##,</p>",
      '<script>var x = "nao mostrar";</script>',
      "<noscript>ative o javascript</noscript>",
      "<p></p><p>&nbsp;</p>",
      "<p>Atenciosamente.</p>",
      "</body>",
    ].join("\n");
    const t = textoDaPrevia(html);
    igual("so o texto dos paragrafos, sem linhas em branco", t, "Senhor ##nome##,\nAtenciosamente.");
    checar("sem CSS", !t.includes("font-size") && !t.includes("@media"), t);
    checar("sem base64", !t.includes("base64") && !t.includes(B64.slice(0, 20)), t);
    checar("sem script/noscript/comentario/title", !/nao mostrar|ative|CONFIGURA|Titulo/.test(t), t);
  }

  secao("sei: texto da previa sem o rodape 'Criado por ..., versao N por ... em ...' do SEI");
  {
    // Marcacao real do documento_visualizar (nomes trocados): SEI 5.0.4 do MJ (com o rodape do Decreto antes) e SEI
    // 4.1.5 de SP. O rodape fica num <div unselectable> no fim do corpo.
    const rodape = (versao: string, login: string, data: string, fechaHr = " /") =>
      [
        '<div unselectable="on" style="-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;">',
        `<hr style="border:1px solid #c0c0c0;"${fechaHr}>Criado por <a onclick="alert('Fulano de Tal')" alt="Fulano de Tal" title="Fulano de Tal" style="color:#0066cc;text-decoration:none;cursor:pointer;">${login}</a>, ${versao} 3 por <a onclick="alert('Fulano de Tal')" alt="Fulano de Tal" title="Fulano de Tal" style="color:#0066cc;text-decoration:none;cursor:pointer;">${login}</a> em ${data}.`,
        "",
        "</div>",
        "",
      ].join("\r\n");
    const mj = [
      "<p>____________________________</p>",
      '<p><a class="anchorRefInternaPro" href="#item_x" name="footer_x"><span class="ntRodape_footer ancoraSei" contenteditable="false">[1]</span></a> Este termo deve ser assinado eletronicamente pelo declarante e pelas testemunhas.</p>',
      "<p>&nbsp;</p>",
      '<div style="counter-reset: letra_minuscula romano_maiusculo;"></div>',
      '<hr style="border:none; padding:0; margin:5px 2px 0 2px; border-top:medium double #333" />',
      '<table border="0" cellpadding="2" cellspacing="0" width="100%"><tbody><tr>',
      '<td align="left" style="font-family:Calibri;font-size:9pt;border:0;" width="50%">Conforme Decreto n&ordm; 7.845, de 14 de novembro de 2012</td>',
      '<td align="right" style="font-family:Calibri;font-size:9pt;border:0;" width="50%">&nbsp;</td>',
      "</tr></tbody></table>",
      "",
      rodape("versão", "fulano.tal", "08/05/2025 15:29:34", " /"),
    ].join("\r\n");
    const tMj = textoDaPrevia(mj);
    checar("SEI 5 (MJ): sem o rodape Criado por", !tMj.includes("Criado por") && !tMj.includes("fulano.tal"), tMj);
    checar("SEI 5 (MJ): o texto antes do rodape fica", tMj.endsWith("Conforme Decreto nº 7.845, de 14 de novembro de 2012"), tMj);
    const sp = [
      '<p class="Texto_Justificado_Recuo_Primeira_Linha">Ao Senhor ##nome##, Prefeito Municipal de ##municipio##.</p>',
      "",
      '<p class="Texto_Justificado_Recuo_Primeira_Linha">Atenciosamente,</p>',
      "",
      rodape("versão", "beltrano", "13/09/2026 04:51:30", ""),
      "",
    ].join("\n");
    igual(
      "SEI 4.1 (SP): sem o rodape Criado por",
      textoDaPrevia(sp),
      "Ao Senhor ##nome##, Prefeito Municipal de ##municipio##.\nAtenciosamente,",
    );
    igual(
      "acento como entidade (vers&atilde;o) tambem sai",
      textoDaPrevia(`<p>Corpo.</p>${rodape("vers&atilde;o", "beltrano", "13/09/2026 04:51:30", "")}`),
      "Corpo.",
    );
    const meio = [
      "<p>Criado por Fulano de Tal, versão 2 por Beltrano em 01/01/2026, o regulamento segue em vigor.</p>",
      "<p>Atenciosamente.</p>",
    ].join("");
    igual(
      "as mesmas palavras no meio do corpo ficam",
      textoDaPrevia(meio),
      "Criado por Fulano de Tal, versão 2 por Beltrano em 01/01/2026, o regulamento segue em vigor.\nAtenciosamente.",
    );
    igual(
      "ultimo paragrafo 'Criado por' sem o padrao versao/data fica",
      textoDaPrevia("<p>Corpo.</p><p>Criado por ato do Ministro.</p>"),
      "Corpo.\nCriado por ato do Ministro.",
    );
  }

  secao("sei: criar documento da linha (CK4, modelo = documento)");
  await comMontagem({}, async ({ sei, chamadas, secoes }) => {
    const r = await criarDocumentoDaLinha(sei, pedido());
    const escolha = posts(chamadas, "acao=documento_escolher_tipo").find((c) => valor(c, "hdnIdSerie"));
    const cad = posts(chamadas, "acao=documento_cadastrar");
    checar("tipo do modelo escolhido por id (hdnIdSerie 12)", valor(escolha, "hdnIdSerie") === "12", escolha?.campos);
    igual("um cadastro so", cad.length, 1);
    const c = cad[0];
    checar("texto inicial = documento modelo (D)", valor(c, "rdoTextoInicial") === "D", c?.campos);
    igual("documentoModelo = numero do modelo", valor(c, "txtProtocoloDocumentoTextoBase"), "0100001");
    checar(
      "modelo por documento nao manda texto padrao",
      (valor(c, "selTextoPadrao") ?? "null") === "null" && !valor(c, "hdnIdTextoPadrao"),
      c?.campos,
    );
    igual("nome na arvore sem acento e latin-1 (txtNomeArvore)", valor(c, "txtNomeArvore"), 'Jose a<b & "c"');
    igual("Numero opcional fica vazio", valor(c, "txtNumero"), "");
    igual("descricao com o campo trocado (sem escape, com acento)", valor(c, "txtDescricao"), 'Ofício - José a<b & "c"');
    checar("nivel publico, hipotese vazia", valor(c, "rdoNivelAcesso") === "0" && (valor(c, "hdnIdHipoteseLegal") ?? "") === "", c?.campos);
    igual("observacao vazia", valor(c, "txaObservacoes") ?? "", "");
    checar("interessados do processo mantidos", (valor(c, "hdnInteressados") ?? "").startsWith("100013362"), valor(c, "hdnInteressados"));
    checar("flag de cadastro 2", valor(c, "hdnFlagDocumentoCadastro") === "2");

    const grav = posts(chamadas, "acao=editor_salvar");
    igual("uma gravacao do editor (todas as secoes de uma vez)", grav.length, 1);
    const corpo = valor(grav[0], "txaEditor_2") ?? "";
    checar("valor escapado: a&lt;b &amp; &quot;c&quot;", corpo.includes("José a&lt;b &amp; &quot;c&quot;"), corpo);
    checar("acento mantido no corpo (José, sem entidade)", corpo.includes("José") && !corpo.includes("&eacute;"), corpo);
    checar("campo sem coluna cruzada fica literal (##x##)", corpo.includes("##x##") && !corpo.includes("não usar"), corpo);
    checar("##cpf## trocado", corpo.includes("CPF 123."), corpo);
    igual("secao somente leitura nao e reescrita", valor(grav[0], "txaEditor_1"), "<p>Cabeçalho ##nome##</p>");
    igual("secao sem ## vai como estava", valor(grav[0], "txaEditor_3"), "<p>Rodapé fixo</p>");
    checar("estado gravado no SEI falso = o corpo trocado", secoes[1]?.html === corpo);
    igual("devolve id, numero e link permanente (sem infra_hash)", r, {
      idDocumento: "701",
      numero: "0100002",
      link: `${ORIGEM}?acao=procedimento_trabalhar&id_procedimento=500&id_documento=701`,
    });
  });
  await comMontagem(
    {
      secoes: [
        { nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>Sem campos, só ##y## sem coluna.</p>" },
        { nome: "txaEditor_2", titulo: "Rodapé", html: "<p>Fixo</p>" },
      ],
    },
    async ({ sei, chamadas }) => {
      await criarDocumentoDaLinha(sei, pedido());
      igual("nenhuma secao com campo cruzado: nenhum POST de gravacao", posts(chamadas, "acao=editor_salvar").length, 0);
    },
  );
  await comMontagem(
    { secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>Sr. ##nome&nbsp;completo##</p>" }] },
    async ({ sei, chamadas }) => {
      await criarDocumentoDaLinha(sei, pedido({ linha: { NC: "Ana" }, colunaNome: "NC", camposCruzados: { "nome completo": "NC" } }));
      igual("campo com nbsp no HTML e trocado", valor(posts(chamadas, "acao=editor_salvar")[0], "txaEditor_1"), "<p>Sr. Ana</p>");
    },
  );
  await comMontagem(
    { secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>Em ##munic&iacute;pio## e ##munic\u00EDpio##.</p>" }] },
    async ({ sei, chamadas }) => {
      await criarDocumentoDaLinha(
        sei,
        pedido({ linha: { Nome: "A", Cidade: "S\u00E3o Paulo" }, camposCruzados: { "munic\u00EDpio": "Cidade" } }),
      );
      igual(
        "campo com acento em entidade no HTML e trocado (as duas formas)",
        valor(posts(chamadas, "acao=editor_salvar")[0], "txaEditor_1"),
        "<p>Em S\u00E3o Paulo e S\u00E3o Paulo.</p>",
      );
    },
  );
  await comMontagem(
    { secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>P&amp;D &eacute; &lt;x&gt; &nbsp; ##nome##</p>" }] },
    async ({ sei, chamadas }) => {
      await criarDocumentoDaLinha(sei, pedido({ linha: { Nome: "Ana" } }));
      igual(
        "entidades fora de campo sobrevivem byte a byte",
        valor(posts(chamadas, "acao=editor_salvar")[0], "txaEditor_1"),
        "<p>P&amp;D &eacute; &lt;x&gt; &nbsp; Ana</p>",
      );
    },
  );
  await comMontagem(
    {
      cadastro: (h) =>
        h.replace(
          'id="lblNumero" for="txtNumero" class="infraLabelOpcional"',
          'id="lblNumero" for="txtNumero" class="infraLabelObrigatorio"',
        ),
    },
    async ({ sei, chamadas }) => {
      await criarDocumentoDaLinha(sei, pedido({ linha: { Nome: "João", CPF: "1" } }));
      igual(
        "Numero obrigatorio no tipo: o nome vai no txtNumero (legado)",
        valor(posts(chamadas, "acao=documento_cadastrar")[0], "txtNumero"),
        "Joao",
      );
    },
  );

  secao("sei: criar documento da linha (modelo = texto padrao)");
  await comMontagem({}, async ({ sei, chamadas }) => {
    await criarDocumentoDaLinha(sei, pedido({ modelo: MODELO_TP }));
    const c = posts(chamadas, "acao=documento_cadastrar")[0];
    checar("texto inicial = texto padrao (T)", valor(c, "rdoTextoInicial") === "T", c?.campos);
    checar(
      "textoPadrao = id 5 (selTextoPadrao e hdnIdTextoPadrao)",
      valor(c, "selTextoPadrao") === "5" && valor(c, "hdnIdTextoPadrao") === "5",
      c?.campos,
    );
    igual("texto padrao nao manda documentoModelo", valor(c, "txtProtocoloDocumentoTextoBase") ?? "", "");
    const escolha = posts(chamadas, "acao=documento_escolher_tipo").find((x) => valor(x, "hdnIdSerie"));
    igual("tipo escolhido = tipoId do modelo", valor(escolha, "hdnIdSerie"), "12");
  });
  await comMontagem({}, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido({ modelo: { ...MODELO_TP, id: "99" } })));
    checar(
      "texto padrao fora da lista do formulario: recusado sem cadastrar",
      e?.codigo === "SEI_ACAO_INDISPONIVEL" && posts(chamadas, "acao=documento_cadastrar").length === 0,
      e,
    );
  });
  await comMontagem({}, async ({ sei, chamadas }) => {
    const e = await lanca(() =>
      criarDocumentoDaLinha(sei, pedido({ modelo: { origem: "texto-padrao", id: "5", nome: "OFÍCIO", campos: [] } })),
    );
    checar("texto padrao sem tipoId: ARGUMENTO_INVALIDO sem requisicao", e?.codigo === "ARGUMENTO_INVALIDO" && chamadas.length === 0, {
      e,
      chamadas,
    });
  });

  secao("sei: criar documento da linha (CK5)");
  await comMontagem({ editor: "ck5" }, async ({ sei, chamadas, fetches }) => {
    const r = await criarDocumentoDaLinha(sei, pedido());
    igual("CK5: uma gravacao por JSON", fetches.length, 1);
    const corpo = fetches[0]?.corpo as { secoesConteudo: Array<{ nome: string; html: string }>; versao: unknown };
    const sec = (n: string) => corpo.secoesConteudo.find((s) => s.nome === n)?.html;
    checar(
      "CK5: corpo trocado e escapado",
      sec("txaEditor_2")?.includes("José a&lt;b &amp; &quot;c&quot;") === true && sec("txaEditor_2")?.includes("##x##") === true,
      corpo,
    );
    igual("CK5: somente leitura como estava", sec("txaEditor_1"), "<p>Cabeçalho ##nome##</p>");
    igual("CK5: versao do editor", corpo.versao, 7);
    igual("CK5 com versao: ignorarNovaVersao N (como hoje)", (corpo as { ignorarNovaVersao?: string }).ignorarNovaVersao, "N");
    checar("CK5: nada pelo formulario do CK4", posts(chamadas, "acao=editor_salvar").length === 0);
    igual("CK5: numero devolvido", r.numero, "0100002");
  });

  await comMontagem({ editor: "ck5", ck5SemVersao: true }, async ({ sei, fetches }) => {
    await criarDocumentoDaLinha(sei, pedido());
    const corpo = fetches[0]?.corpo as { versao?: unknown; ignorarNovaVersao?: string };
    checar(
      "CK5 sem versao (documento novo): ignorarNovaVersao S e versao null (legado)",
      corpo?.ignorarNovaVersao === "S" && corpo.versao === null,
      corpo,
    );
  });

  secao("sei: falhas");
  await comMontagem({ cadastroErro: new ErroSei("SEI_VALIDACAO", "Documento Base não encontrado.") }, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido()));
    checar(
      "falha do SEI no cadastro propaga o ErroSei",
      e instanceof ErroSei && e.codigo === "SEI_VALIDACAO" && e.message === "Documento Base não encontrado.",
      e,
    );
    checar("falha no cadastro nao e 'documento criado'", !(e instanceof ErroDocumentoCriado));
    checar("falha no cadastro: editor nem aberto", !chamadas.some((c) => c.url.includes("editor_montar")));
  });
  await comMontagem({ cadastroSemProva: true }, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido()));
    checar(
      "cadastro sem prova (POST enviado): ErroDocumentoCriado incerto, codigo SEI_RESPOSTA_INESPERADA",
      e instanceof ErroDocumentoCriado && e.incerto && e.codigo === "SEI_RESPOSTA_INESPERADA",
      e,
    );
    igual("incerto: sem id, numero nem link", e instanceof ErroDocumentoCriado ? e.documentoCriado : null, {
      idDocumento: "",
      numero: "",
      link: "",
    });
    checar(
      "mensagem do incerto nao diz 'O documento  foi criado'",
      !/documento\s+foi criado/.test(e?.message ?? "") &&
        /talvez/.test(e?.message ?? "") &&
        /n\u00E3o foi poss\u00EDvel identificar/.test(e?.message ?? ""),
      e?.message,
    );
    checar("incerto: editor nem aberto", !chamadas.some((c) => c.url.includes("editor_montar")));
  });
  await comMontagem({ arvorePosCadastro: "rede" }, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido()));
    checar(
      "arvore falha por rede depois do POST: ErroDocumentoCriado nao incerto (id lido do POST)",
      e instanceof ErroDocumentoCriado && !e.incerto && e.codigo === "SEI_REDE",
      e,
    );
    igual("rede: id e link do POST, numero desconhecido", e instanceof ErroDocumentoCriado ? e.documentoCriado : null, {
      idDocumento: "701",
      numero: "",
      link: `${ORIGEM}?acao=procedimento_trabalhar&id_procedimento=500&id_documento=701`,
    });
    checar("rede: mensagem cita o id quando falta o numero", /id 701/.test(e?.message ?? ""), e?.message);
    igual("rede: um cadastro so", posts(chamadas, "acao=documento_cadastrar").length, 1);
  });
  await comMontagem({ arvorePosCadastro: "aborto" }, async ({ sei, controle }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido(), controle.signal));
    checar(
      "cancelado depois do POST: ErroDocumentoCriado (CANCELADO) com o id",
      e instanceof ErroDocumentoCriado && !e.incerto && e.codigo === "CANCELADO" && e.documentoCriado.idDocumento === "701",
      e,
    );
  });
  await comMontagem(
    { secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>##x#y## ##nome## e ##z##</p>" }] },
    async ({ sei }) => {
      const e = await lanca(() => criarDocumentoDaLinha(sei, pedido({ linha: { Nome: "Ana" }, camposCruzados: { nome: "Nome" } })));
      checar(
        "campo mapeado que ficou literal: ErroDocumentoCriado (nao incerto) citando o campo",
        e instanceof ErroDocumentoCriado && !e.incerto && /##nome##/.test(e.message) && !/##z##/.test(e.message),
        e,
      );
    },
  );
  await comMontagem({ salvarFalha: true }, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido()));
    const criado = e instanceof ErroDocumentoCriado ? e.documentoCriado : null;
    checar(
      "troca falhou depois de criar: ErroDocumentoCriado (e ErroSei), nao incerto",
      e instanceof ErroDocumentoCriado && e instanceof ErroSei && !e.incerto,
      e,
    );
    igual("o erro carrega o documento criado", criado, {
      idDocumento: "701",
      numero: "0100002",
      link: `${ORIGEM}?acao=procedimento_trabalhar&id_procedimento=500&id_documento=701`,
    });
    checar(
      "o erro mantem o codigo e cita o numero",
      e instanceof ErroSei && e.codigo === "SEI_VALIDACAO" && e.message.includes("0100002"),
      e,
    );
    igual("documento criado uma vez so", posts(chamadas, "acao=documento_cadastrar").length, 1);
  });
  await comMontagem({ processoSigiloso: true }, async ({ sei, chamadas }) => {
    const e = await lanca(() => criarDocumentoDaLinha(sei, pedido()));
    checar("processo sigiloso: SEI_SIGILOSO sem POST", e?.codigo === "SEI_SIGILOSO" && !chamadas.some((c) => c.metodo === "POST"), {
      e,
      chamadas: chamadas.map((c) => c.url),
    });
  });
}
