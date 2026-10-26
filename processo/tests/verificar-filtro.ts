/**
 * Filtro da árvore: o modelo (chips, busca, pastas, combinação), o DOM (só esconde, nada do SEI muda, linha inteira com
 * o que outros módulos põem, pasta fechada, fallback do DOM) e a barra (teclado, aria, contagem, limpar, árvore que
 * muda por baixo). A árvore é a fixture real do 4.1 e uma sintética no formato do SEI 5; o DOM é montado como a
 * `InfraArvore.js` do SEI monta (irmãos planos terminados por `<span><br></span>`, filhos de pasta num `<div>`).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Arvore, type DocumentoArvore, lerArvore } from "@nucleo/dominio/arvore";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { aplicarNoDom, ATR_OCULTO, limparDoDom, linhaDe } from "../src/pagina/filtro/dom";
import { ligarFiltro, textoDoStatus } from "../src/pagina/filtro/barra";
import {
  aplicarFiltro,
  contar,
  documentoCasa,
  eExterno,
  FILTRO_VAZIO,
  type FiltroArvore,
  filtroAtivo,
  naoAssinado,
  palavrasDaBusca,
} from "../src/pagina/filtro/filtro";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const f = (p: Partial<FiltroArvore> = {}): FiltroArvore => ({ ...FILTRO_VAZIO, ...p });

function arvoreReal(): Arvore {
  const html = readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41/arvore_completa.html"), "utf8").replace(
    /^<!-- url: .*? -->\n/,
    "",
  );
  const doc = new DOMParser().parseFromString(html, "text/html") as unknown as Document;
  return lerArvore(paginaDe(doc, URL_ARVORE));
}

interface Sint {
  id: string;
  nome: string;
  icone: string;
  pasta?: string;
  sinais?: string[];
}

/** Árvore no formato dos nós do SEI (o 5 usa os mesmos `infraArvoreNo`). */
function arvoreSintetica(docs: Sint[], pastas: string[] = []): Arvore {
  const linhas: string[] = [];
  const lnk = (extra: string) => `controlador.php?acao=arvore_visualizar&id_procedimento=900${extra}&infra_hash=0`;
  linhas.push(
    `Nos[0] = new infraArvoreNo("PROCESSO","900",null,"${lnk("")}","ifrVisualizacao","50300.000001/2026-01","Processo sintetico","svg/processo.svg?18","svg/processo.svg?18","svg/processo.svg?18",true,true,null,null,null,"50300.000001/2026-01");`,
  );
  linhas.push("Nos[0].acoes = '';");
  let n = 1;
  for (const p of pastas)
    linhas.push(
      `Nos[${n++}] = new infraArvoreNo("PASTA","${p}","900","javascript:abrirFecharPasta('${p}');",null,"Pasta","Pasta (1)",null,"a.svg","b.svg",false,true,null,null,null);`,
    );
  for (const d of docs) {
    linhas.push(
      `Nos[${n}] = new infraArvoreNo("DOCUMENTO","${d.id}",${d.pasta ? `"${d.pasta}"` : '"900"'},"${lnk(`&id_documento=${d.id}`)}","ifrConteudoVisualizacao","${d.nome} (00${d.id})","${d.nome} (00${d.id})","svg/${d.icone}.svg?18","svg/${d.icone}.svg?18","svg/${d.icone}.svg?18",true,true,null,null,"noVisitado","00${d.id}");`,
    );
    linhas.push(`Nos[${n}].src = 'controlador.php?acao=documento_visualizar&id_documento=${d.id}';`);
    n++;
  }
  let k = 0;
  for (const d of docs)
    for (const s of d.sinais ?? []) {
      if (s === "assinado")
        linhas.push(
          `NosAcoes[${k++}] = new infraArvoreAcao("ASSINATURA","A${d.id}","${d.id}","javascript:alert('Assinado por');",null,"Assinado por:\\nUsuario\\nCargo\\nUNID","svg/assinatura1.svg?18",true);`,
        );
      if (s.startsWith("ug:"))
        linhas.push(
          `NosAcoes[${k++}] = new infraArvoreAcao("UNIDADE_GERADORA","UG${d.id}","${d.id}","#",null,"Unidade","",true,"${s.slice(3)}");`,
        );
    }
  const doc = new DOMParser().parseFromString(
    `<html><body><form id="frmArvore"><div id="divArvore"></div></form><script>${linhas.join("\n")}</script></body></html>`,
    "text/html",
  ) as unknown as Document;
  return lerArvore(paginaDe(doc, URL_ARVORE));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const iconeDe = (d: DocumentoArvore): string =>
  d.cancelado
    ? "documento_cancelado"
    : d.formato === "circular"
      ? "documento_circular"
      : d.externo
        ? `documento_${d.formato}`
        : `documento_${d.formato === "formulario" ? "formulario" : "interno"}`;

interface Extras {
  /** Põe o que outros módulos põem na linha: numeração antes, duas linhas, ícones rápidos, estrela, unidade geradora. */
  decorar?: boolean;
}

function linhaDoc(d: DocumentoArvore, e: Extras): string {
  const antes = e.decorar ? `<span class="numericDocsPro" data-count="1"></span>` : "";
  const depois = e.decorar
    ? `<span class="breackline_doc"><br><span style="margin-left: 18px;"></span><span style="font-size:9pt">(${d.numero})</span></span><span class="action-doc action-copy spro-pm-icone" data-id="${d.id}"></span><button type="button" class="spro-fav-doc" data-doc="${d.id}"></button>`
    : "";
  const ug = d.unidadeGeradora
    ? `<a id="anchorUG${d.id}" href="#" class="infraArvoreInformacao"><span>${esc(d.unidadeGeradora)}</span></a>`
    : "";
  const ass = d.assinado ? `<a id="anchorA${d.id}" href="#"><img src="svg/assinatura1.svg"></a>` : "";
  return `<span class="anchorJoinPro"><img src="x.gif"></span>${antes}<a id="anchorImg${d.id}" data-toggle="popover" href="#"><img id="icon${d.id}" src="svg/${iconeDe(d)}.svg"></a><a id="anchor${d.id}" class="infraArvoreNo" target="ifrConteudoVisualizacao" href="controlador.php?acao=arvore_visualizar&amp;id_documento=${d.id}"><span id="span${d.id}">${esc(d.titulo)} (${d.numero})</span></a>${depois}${ug}${ass}<span><br></span>`;
}

/** O DOM do quadro da árvore: processo, pastas (abertas com documentos ou fechadas com “Aguarde...”) e documentos soltos. */
function montarDom(arv: Arvore, abertas: ReadonlySet<string>, e: Extras = {}, soltos: DocumentoArvore[] = []): Document {
  const pastas = [...new Set(arv.documentos.map((d) => d.pasta).filter((p): p is string => !!p))];
  const partes = pastas.map((p) => {
    const n = p.replace("PASTA", "");
    const filhos = abertas.has(p)
      ? arv.documentos
          .filter((d) => d.pasta === p)
          .map((d) => linhaDoc(d, e))
          .join("")
      : `<span class="anchorJoinPro"></span><a id="anchorImgAGUARDE${n}"><img></a><a id="anchorAGUARDE${n}" class="infraArvoreNo"><span id="spanAGUARDE${n}">Aguarde...</span></a><span><br></span>`;
    return `<a id="ancjoin${p}" href="javascript:void(0);"><img src="plus.gif"></a><a id="anchorImg${p}"><img id="icon${p}" src="svg/processo_fechado.svg"></a><a id="anchor${p}" href="javascript:abrirFecharPasta('${p}');" class="infraArvoreNo" title="Pasta ${n}"><span id="span${p}">${n}</span></a><span><br></span><div id="div${p}" class="infraArvore" style="display: none;">${filhos}</div>`;
  });
  const html = `<html><head></head><body><form id="frmArvore"><button type="button" class="spro-prj-faixa">projetos</button><div id="divArvore" class="infraArvore"><a id="anchorImg${arv.idProcedimento}"><img id="icon${arv.idProcedimento}" src="svg/processo.svg"></a><a id="anchor${arv.idProcedimento}" class="infraArvoreNo" href="controlador.php?acao=arvore_visualizar"><span id="span${arv.idProcedimento}">${arv.protocolo}</span></a><span><br></span><div id="div${arv.idProcedimento}" class="infraArvore">${partes.join("")}${soltos.map((d) => linhaDoc(d, e)).join("")}</div></div><div id="divConsultarAndamento"></div></form></body></html>`;
  const doc = instalarDom(html);
  return doc;
}

const idsOcultos = (doc: Document): string[] =>
  [...doc.querySelectorAll(`a[id^="anchor"][${ATR_OCULTO}]`)].map((a) => a.id.replace("anchor", "")).filter((i) => /^\d+$/.test(i));
const pastasOcultas = (doc: Document): string[] =>
  [...doc.querySelectorAll(`a[id^="anchorPASTA"][${ATR_OCULTO}]`)].map((a) => a.id.replace("anchor", ""));
const idsVisiveis = (doc: Document, todos: DocumentoArvore[]): string[] => {
  const o = new Set(idsOcultos(doc));
  return todos.map((d) => d.id).filter((i) => doc.getElementById(`anchor${i}`) && !o.has(i));
};
const semMarca = (doc: Document): string => doc.getElementById("divArvore")!.outerHTML.replace(new RegExp(` ${ATR_OCULTO}="1"`, "g"), "");

function doc(id: string, over: Partial<DocumentoArvore> = {}): DocumentoArvore {
  return {
    id,
    numero: `00${id}`,
    titulo: `Documento ${id}`,
    pasta: null,
    externo: false,
    formato: "interno",
    nivel: "publico",
    assinado: false,
    assinaturas: [],
    cancelado: false,
    link: "",
    src: "",
    acoes: [],
    botoes: [],
    ...over,
  };
}

export async function verificarFiltro(): Promise<void> {
  const semRede = (): never => {
    throw new Error("o filtro nao pode usar a rede");
  };
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = semRede as unknown as typeof fetch;

  // ------------------------------------------------------------------------------------------------ modelo
  secao("Filtro: o modelo (fixture real do SEI 4.1, 43 documentos)");
  const real = arvoreReal();
  const total = real.documentos.length;
  const internos = real.documentos.filter((d) => d.formato === "interno" && !d.cancelado);
  const naoAss = internos.filter((d) => !d.assinado);
  const externos = real.documentos.filter((d) => d.externo);
  checar(
    "a fixture tem 43 documentos, 2 assinados, externos e 3 pastas",
    total === 43 && internos.filter((d) => d.assinado).length === 2 && externos.length > 10,
  );
  checar("filtro vazio nao esta ativo; so espacos tambem nao", !filtroAtivo(f()) && !filtroAtivo(f({ texto: "   " })));
  checar("um chip ou texto ativa", filtroAtivo(f({ cancelados: true })) && filtroAtivo(f({ texto: "a" })));
  const todos = aplicarFiltro(real, f());
  checar("vazio: todos os documentos e as 3 pastas", todos.size === total + 3 && todos.has("PASTA1") && todos.has("PASTA3"));
  const vNao = aplicarFiltro(real, f({ naoAssinados: true }));
  checar(
    "Nao assinados: so os internos sem assinatura",
    contar(real, vNao).visiveis === naoAss.length && naoAss.length > 10,
    contar(real, vNao),
  );
  checar(
    "Nao assinados: nenhum assinado nem externo",
    real.documentos.every((d) => !vNao.has(d.id) || (!d.assinado && !d.externo)),
  );
  const vExt = aplicarFiltro(real, f({ externos: true }));
  checar(
    "Externos: so os anexos",
    contar(real, vExt).visiveis === externos.length && real.documentos.every((d) => vExt.has(d.id) === d.externo),
  );
  checar("Cancelados: nenhum na fixture, nenhuma pasta", aplicarFiltro(real, f({ cancelados: true })).size === 0);
  const vNaoExt = aplicarFiltro(real, f({ naoAssinados: true, externos: true }));
  checar("chips somam (uniao): nao assinados OU externos", contar(real, vNaoExt).visiveis === naoAss.length + externos.length);
  checar(
    "unidade: a sua unidade (sem caixa) mantem; outra tira",
    contar(real, aplicarFiltro(real, f({ naoAssinados: true }), { unidade: "teste" })).visiveis === naoAss.length &&
      contar(real, aplicarFiltro(real, f({ naoAssinados: true }), { unidade: "OUTRA" })).visiveis === 0,
  );
  checar(
    "unidade desconhecida: vale o documento",
    contar(real, aplicarFiltro(real, f({ naoAssinados: true }), { unidade: "" })).visiveis === naoAss.length,
  );

  const vTexto = (t: string, extra: Partial<FiltroArvore> = {}) => contar(real, aplicarFiltro(real, f({ texto: t, ...extra }))).visiveis;
  const comTitulo = (re: RegExp) =>
    real.documentos.filter((d) => re.test(`${d.titulo}`.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase())).length;
  checar("busca por nome, sem caixa", vTexto("DESPACHO") === comTitulo(/despacho/) && vTexto("despacho") > 10);
  checar("busca sem acento acha com acento (relatorio)", vTexto("relatorio") === comTitulo(/relatorio/) && vTexto("relatorio") > 3);
  checar("busca com acento acha sem acento", vTexto("Relatório") === vTexto("relatorio"));
  checar("busca por numero SEI", vTexto("0103947") === 1 && contar(real, aplicarFiltro(real, f({ texto: "0103947" }))).total === total);
  checar("numero parcial", vTexto("01039") > 20);
  checar("varias palavras: todas, em qualquer ordem", vTexto("maria despacho") === 1 && vTexto("despacho maria") === 1);
  checar("busca sem resultado: nada e nenhuma pasta", aplicarFiltro(real, f({ texto: "zzzzz" })).size === 0);
  checar(
    "busca + chip em 'e'",
    vTexto("despacho", { naoAssinados: true }) ===
      real.documentos.filter((d) => /despacho/i.test(d.titulo) && !d.externo && !d.assinado).length,
  );
  checar("busca + chip externos nao acha despacho", vTexto("despacho", { externos: true }) === 0);
  const soNaPasta2 = aplicarFiltro(real, f({ texto: "Vistoria F2 dividi" }));
  checar(
    "pasta com documento a vista permanece; as outras saem",
    soNaPasta2.has("PASTA2") && !soNaPasta2.has("PASTA1") && !soNaPasta2.has("PASTA3"),
    [...soNaPasta2],
  );
  checar("palavras da busca", palavrasDaBusca("  Ação   Número ").join("|") === "acao|numero" && palavrasDaBusca("").length === 0);
  checar(
    "o filtro nao altera a arvore lida",
    real.documentos.length === total && real.documentos.every((d) => typeof d.titulo === "string"),
  );

  secao("Filtro: o modelo (arvore sintetica no formato do SEI 5, com cancelado, circular e outra unidade)");
  const sint = arvoreSintetica(
    [
      { id: "101", nome: "Oficio 1", icone: "documento_interno", sinais: ["ug:ANTT"] },
      { id: "102", nome: "Oficio 2", icone: "documento_interno", sinais: ["assinado", "ug:ANTT"] },
      { id: "103", nome: "Oficio 3", icone: "documento_interno", sinais: ["ug:OUTRA"] },
      { id: "104", nome: "Anexo planilha", icone: "documento_pdf" },
      { id: "105", nome: "Oficio cancelado", icone: "documento_cancelado" },
      { id: "106", nome: "Circular 7", icone: "documento_circular", sinais: ["ug:ANTT"] },
      { id: "107", nome: "Formulario X", icone: "documento_formulario" },
      { id: "108", nome: "Anexo cancelado", icone: "documento_cancelado" },
    ],
    [],
  );
  const por = (id: string) => sint.documentos.find((d) => d.id === id)!;
  checar("sintetica lida: 8 documentos", sint.documentos.length === 8);
  checar("circular nao e externo (o nucleo marca; o filtro corrige)", por("106").externo && !eExterno(por("106")) && eExterno(por("104")));
  checar("nao assinado: interno e circular sem assinatura", naoAssinado(por("101")) && naoAssinado(por("106")) && naoAssinado(por("103")));
  checar(
    "nao assinado: nao conta assinado, cancelado, externo, formulario",
    !naoAssinado(por("102")) && !naoAssinado(por("105")) && !naoAssinado(por("104")) && !naoAssinado(por("107")),
  );
  checar(
    "nao assinado: outra unidade geradora nao conta",
    !naoAssinado(por("103"), { unidade: "ANTT" }) && naoAssinado(por("101"), { unidade: "antt" }),
  );
  const ids = (x: Set<string>) => [...x].sort().join(",");
  checar("chip Cancelados: os dois cancelados", ids(aplicarFiltro(sint, f({ cancelados: true }))) === "105,108");
  checar("chip Externos: so o anexo (o cancelado e o circular nao)", ids(aplicarFiltro(sint, f({ externos: true }))) === "104");
  checar("chip Nao assinados na minha unidade", ids(aplicarFiltro(sint, f({ naoAssinados: true }), { unidade: "ANTT" })) === "101,106");
  checar(
    "todos os chips: nao assinados + externos + cancelados",
    ids(aplicarFiltro(sint, f({ naoAssinados: true, externos: true, cancelados: true }), { unidade: "ANTT" })) === "101,104,105,106,108",
  );
  checar("busca 'oficio' + Cancelados", ids(aplicarFiltro(sint, f({ texto: "oficio", cancelados: true }))) === "105");
  checar(
    "documentoCasa direto",
    documentoCasa(doc("1", { titulo: "Nota Técnica 12" }), f({ texto: "tecnica" })) && !documentoCasa(doc("2"), f({ texto: "tecnica" })),
  );
  checar(
    "textoDoStatus",
    textoDoStatus({ visiveis: 3, total: 40, pastasFechadas: 0, pastas: 2 }, true).principal === "3 de 40 documentos" &&
      textoDoStatus({ visiveis: 1, total: 1, pastasFechadas: 1, pastas: 1 }, true).principal === "1 de 1 documento" &&
      textoDoStatus({ visiveis: 0, total: 9, pastasFechadas: 0, pastas: 0 }, true).principal.startsWith("Nenhum documento") &&
      textoDoStatus({ visiveis: 0, total: 9, pastasFechadas: 1, pastas: 1 }, true, true).principal.startsWith("Nenhum documento at\u00E9 agora") &&
      textoDoStatus({ visiveis: 3, total: 9, pastasFechadas: 1, pastas: 1 }, false).principal === "",
  );

  // ------------------------------------------------------------------------------------------------ DOM
  secao("Filtro: o DOM (esconde so a linha; nada do SEI muda)");
  let d = montarDom(real, new Set(["PASTA1", "PASTA2"]), { decorar: true });
  const noDom = real.documentos.filter((x) => d.getElementById(`anchor${x.id}`));
  const antes = d.getElementById("divArvore")!.outerHTML;
  const cliques: string[] = [];
  d.getElementById("anchor160173")!.addEventListener("click", () => cliques.push("doc"));
  d.getElementById("anchorPASTA1")!.addEventListener("click", () => cliques.push("pasta"));
  const R0 = aplicarNoDom(d, real.documentos, real.idProcedimento, f());
  checar(
    "filtro vazio: nada escondido e o HTML identico",
    idsOcultos(d).length === 0 && d.getElementById("divArvore")!.outerHTML === antes,
  );
  checar(
    "resumo vazio: todos os documentos carregados; pasta 3 fechada nao conta",
    R0.total === noDom.length && R0.visiveis === R0.total && R0.pastas === 3 && R0.pastasFechadas === 1,
    R0,
  );
  const R1 = aplicarNoDom(d, real.documentos, real.idProcedimento, f({ externos: true }));
  const extCarregados = noDom.filter((x) => x.externo);
  checar(
    "Externos: so os externos ficam",
    idsVisiveis(d, noDom).sort().join() ===
      extCarregados
        .map((x) => x.id)
        .sort()
        .join(),
  );
  checar("resumo: n de m", R1.visiveis === extCarregados.length && R1.total === noDom.length, R1);
  checar("a pasta fechada (sem dados) fica a vista com o filtro", !pastasOcultas(d).includes("PASTA3") && R1.pastasFechadas === 1);
  checar("as pastas com externo ficam a vista", pastasOcultas(d).length === 0);
  checar(
    "o nó do processo nunca e escondido",
    !d.getElementById(`anchor${real.idProcedimento}`)!.hasAttribute(ATR_OCULTO) &&
      !d.getElementById(`div${real.idProcedimento}`)!.hasAttribute(ATR_OCULTO),
  );
  // linha inteira: numeração antes, duas linhas, ícones rápidos, estrela, unidade geradora, quebra
  const oculto = real.documentos.find((x) => !x.externo && d.getElementById(`anchor${x.id}`))!;
  const linha = linhaDe(d.getElementById(`anchor${oculto.id}`)!);
  checar(
    "a linha escondida inclui numeracao, ligacao, icone, nome, duas linhas, icones rapidos, estrela, unidade e quebra",
    linha.length >= 9 &&
      linha.every((el) => el.hasAttribute(ATR_OCULTO)) &&
      linha.some((el) => el.classList.contains("numericDocsPro")) &&
      linha.some((el) => el.classList.contains("spro-fav-doc")) &&
      linha.some((el) => el.id === `anchorUG${oculto.id}`),
    linha.map((e) => e.tagName + "." + e.className),
  );
  const vizinhoVisivel = real.documentos.find((x) => x.externo && d.getElementById(`anchor${x.id}`))!;
  checar(
    "a linha vizinha (visivel) nao e tocada",
    linhaDe(d.getElementById(`anchor${vizinhoVisivel.id}`)!).every((el) => !el.hasAttribute(ATR_OCULTO)),
  );
  checar(
    "nada do SEI muda: tirando o atributo proprio, o HTML e identico (ids, classes, hrefs, ordem)",
    semMarca(d) === antes && idsOcultos(d).length > 10,
  );
  d.getElementById("anchor160173")!.dispatchEvent(
    new (d.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }),
  );
  checar("os ouvintes do SEI continuam no nó escondido", cliques.includes("doc"));
  aplicarNoDom(d, real.documentos, real.idProcedimento, f());
  checar("limpar devolve a arvore identica", d.getElementById("divArvore")!.outerHTML === antes && idsOcultos(d).length === 0);

  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ texto: "Vistoria F2 dividi" }));
  checar(
    "busca que so casa na pasta 2: pasta 1 escondida com o div dos filhos",
    pastasOcultas(d).join() === "PASTA1" &&
      d.getElementById("divPASTA1")!.hasAttribute(ATR_OCULTO) &&
      !d.getElementById("divPASTA2")!.hasAttribute(ATR_OCULTO) &&
      !d.getElementById("anchorPASTA2")!.hasAttribute(ATR_OCULTO),
  );
  checar("so o documento achado fica visivel", idsVisiveis(d, noDom).join() === "160195");
  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ texto: "zzzz" }));
  checar(
    "sem resultado: pastas com dados saem; a fechada fica",
    pastasOcultas(d).sort().join() === "PASTA1,PASTA2" && idsVisiveis(d, noDom).length === 0,
  );
  const R2 = aplicarNoDom(d, real.documentos, real.idProcedimento, f({ texto: "zzzz" }));
  checar("repetir e idempotente", R2.visiveis === 0 && pastasOcultas(d).length === 2);
  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ naoAssinados: true, externos: true }));
  checar(
    "combinar chips: nao ha nada escondido (todos sao uma coisa ou outra, menos os assinados)",
    idsOcultos(d).sort().join() ===
      noDom
        .filter((x) => x.assinado)
        .map((x) => x.id)
        .sort()
        .join(),
  );

  // pasta aberta depois (sob demanda)
  secao("Filtro: pasta aberta sob demanda e documento que so o DOM conhece");
  d = montarDom(real, new Set(["PASTA1", "PASTA2"]));
  const modelo = real.documentos.filter((x) => x.pasta !== "PASTA3");
  aplicarNoDom(d, modelo, real.idProcedimento, f({ texto: "despacho v1" }));
  checar(
    "pasta 3 fechada: sem dados, permanece mesmo com a busca",
    !pastasOcultas(d).includes("PASTA3") && pastasOcultas(d).sort().join() === "PASTA1,PASTA2",
  );
  // o usuário abre a pasta 3: o SEI troca "Aguarde..." pelos nós
  const div3 = d.getElementById("divPASTA3")!;
  const novos = real.documentos.filter((x) => x.pasta === "PASTA3");
  div3.replaceChildren();
  const tmp = d.createElement("div");
  tmp.append(...parse(novos.map((x) => linhaDoc(x, {})).join("")));
  while (tmp.firstChild) div3.append(tmp.firstChild);
  const R3 = aplicarNoDom(d, [...modelo, ...novos], real.idProcedimento, f({ texto: "despacho v1" }));
  checar(
    "pasta aberta depois entra no filtro: so o documento achado",
    idsVisiveis(d, novos).join() === "160226" && !pastasOcultas(d).includes("PASTA3") && R3.pastasFechadas === 0,
    R3,
  );
  // documento no DOM que o modelo nao conhece (leitura do ifrPasta falhou): classifica pelo DOM
  const R4 = aplicarNoDom(d, modelo, real.idProcedimento, f({ texto: "despacho v1" }));
  checar("documento so do DOM e classificado pelo DOM (nome e numero)", idsVisiveis(d, novos).join() === "160226" && R4.visiveis === 1, R4);
  aplicarNoDom(d, modelo, real.idProcedimento, f({ externos: true }));
  checar("documento so do DOM: o icone diz externo (pdf)", idsVisiveis(d, novos).join() === "160225", idsVisiveis(d, novos));
  aplicarNoDom(d, modelo, real.idProcedimento, f({ naoAssinados: true }));
  checar("documento so do DOM: interno sem assinatura", idsVisiveis(d, novos).sort().join() === "160223,160224,160226");

  // processo anexado e outros nós que não são documento: nunca escondidos
  d = montarDom(real, new Set(["PASTA1", "PASTA2", "PASTA3"]));
  const raizDiv = d.getElementById(`div${real.idProcedimento}`)!;
  const anexo = parse(
    `<a id="anchorImg999"><img id="icon999" src="svg/processo.svg"></a><a id="anchor999" class="infraArvoreNo"><span id="span999">99999.000001/2026-00</span></a><span><br></span>`,
  );
  raizDiv.append(...anexo);
  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ texto: "zzzz" }));
  checar("no que nao e documento (processo anexado) nunca some", !d.getElementById("anchor999")!.hasAttribute(ATR_OCULTO));
  limparDoDom(d);
  checar("limparDoDom tira tudo", d.querySelectorAll(`[${ATR_OCULTO}]`).length === 0);

  // destaque de nao assinados do legado: classe e title nao mudam
  secao("Filtro: convivencia com o destaque de nao assinados do legado");
  d = montarDom(real, new Set(["PASTA1", "PASTA2", "PASTA3"]));
  const nome = d.getElementById("anchor160173")!;
  nome.classList.add("naoAssinadoPro");
  nome.setAttribute("title", "Pendente de assinatura na unidade TESTE");
  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ naoAssinados: true }));
  checar(
    "destacado e a vista: classe e title intactos",
    nome.className.includes("naoAssinadoPro") &&
      nome.getAttribute("title") === "Pendente de assinatura na unidade TESTE" &&
      !nome.hasAttribute(ATR_OCULTO),
  );
  aplicarNoDom(d, real.documentos, real.idProcedimento, f({ externos: true }));
  checar(
    "destacado e escondido: so o atributo; classe e title intactos",
    nome.hasAttribute(ATR_OCULTO) &&
      nome.className.includes("naoAssinadoPro") &&
      nome.getAttribute("title") === "Pendente de assinatura na unidade TESTE",
  );
  // o legado refaz o destaque do zero (remove e poe a classe): nosso atributo sobrevive e nao e tocado por ele
  nome.classList.remove("naoAssinadoPro");
  nome.classList.add("naoAssinadoPro");
  checar("o legado refazendo a classe nao tira o atributo", nome.hasAttribute(ATR_OCULTO));
  const css = readFileSync(join(AQUI, "../estatico/processo.css"), "utf8");
  checar("o CSS tem a regra do atributo (display none)", /\[data-spro-f-oculto\]\s*\{\s*display:\s*none\s*!important/.test(css));
  checar("o CSS tem o tema escuro da barra", /\.spro-f-barra\[data-tema="escuro"\]/.test(css));

  // ------------------------------------------------------------------------------------------------ barra
  secao("Filtro: a barra (teclado, aria, contagem, limpar)");
  d = montarDom(real, new Set(["PASTA1", "PASTA2"]), { decorar: true });
  let conhecidos = real.documentos.filter((x) => x.pasta !== "PASTA3");
  const ctx = { doc: d, idProcedimento: real.idProcedimento, unidade: { sigla: "TESTE" }, documentos: { todos: () => conhecidos } };
  type Obs = { cb: (m: unknown[]) => void; alvo: Node | null };
  const observadores: Obs[] = [];
  const FalsoObservador = class {
    private readonly o: Obs;
    constructor(cb: (m: unknown[]) => void) {
      this.o = { cb, alvo: null };
      observadores.push(this.o);
    }
    observe(alvo: Node) {
      this.o.alvo = alvo;
    }
    disconnect() {
      this.o.alvo = null;
    }
  };
  const ctl = ligarFiltro(ctx, { Observador: FalsoObservador as unknown as typeof MutationObserver, fila: null })!;
  checar("liga e devolve o controle", !!ctl);
  const barra = ctl.barra();
  const arvoreEl = d.getElementById("divArvore")!;
  checar(
    "a barra fica logo acima da lista da arvore, no quadro da arvore (depois da faixa de outro modulo)",
    barra.nextElementSibling === arvoreEl &&
      barra.parentElement === d.getElementById("frmArvore") &&
      barra.previousElementSibling?.className === "spro-prj-faixa",
  );
  checar("regiao de busca com nome acessivel", barra.getAttribute("role") === "search" && !!barra.getAttribute("aria-label"));
  const busca = barra.querySelector("input") as HTMLInputElement;
  const chips = [...barra.querySelectorAll("button.spro-f-chip")] as HTMLButtonElement[];
  const limpar = barra.querySelector("button.spro-f-limpar") as HTMLButtonElement;
  const status = barra.querySelector(".spro-f-status") as HTMLElement;
  checar(
    "busca com aria-label e tipo search",
    busca.getAttribute("type") === "search" && /nome ou n/.test(busca.getAttribute("aria-label") ?? ""),
  );
  checar(
    "tres chips, todos botoes com aria-pressed=false",
    chips.length === 3 &&
      chips.every((c) => c.getAttribute("aria-pressed") === "false" && c.getAttribute("type") === "button") &&
      chips.map((c) => c.textContent).join("|") === "Não assinados|Externos|Cancelados",
  );
  checar(
    "o botao de limpar tem aria-label e o botao so aparece com filtro",
    limpar.getAttribute("aria-label") === "Limpar filtro" && limpar.hidden,
  );
  checar(
    "os chips tem aria-label completo",
    chips.every((c) => (c.getAttribute("aria-label") ?? "").startsWith(c.textContent ?? "?")),
  );
  checar(
    "a regiao de status e polida (aria-live) e escondida sem filtro",
    status.getAttribute("aria-live") === "polite" && status.getAttribute("role") === "status" && status.hidden,
  );
  checar("sem title em nenhum controle", barra.querySelectorAll("[title]").length === 0);
  checar(
    "nenhum atributo on* na barra",
    ![...barra.querySelectorAll("*")].some((e) => [...e.getAttributeNames()].some((a) => a.startsWith("on"))),
  );

  disparar(chips[1] as Element, "click");
  checar(
    "clicar no chip liga: aria-pressed=true, status e botao de limpar",
    chips[1]!.getAttribute("aria-pressed") === "true" && !status.hidden && !limpar.hidden && ctl.estado().externos,
  );
  const ext2 = conhecidos.filter((x) => x.externo && d.getElementById(`anchor${x.id}`));
  checar(
    "o status diz 'n de m documentos'",
    (barra.querySelector(".spro-f-status-texto")!.textContent ?? "") === `${ext2.length} de ${noDomCount(d)} documentos`,
    barra.querySelector(".spro-f-status-texto")!.textContent,
  );
  checar("a frase 'Pastas fechadas nao entram' nao existe mais", !/n\u00E3o entram/.test(barra.textContent ?? ""));
  checar(
    "so os externos ficam",
    idsVisiveis(d, conhecidos).sort().join() ===
      ext2
        .map((x) => x.id)
        .sort()
        .join(),
  );
  disparar(chips[1] as Element, "click");
  checar(
    "clicar de novo desliga e limpa tudo",
    chips[1]!.getAttribute("aria-pressed") === "false" && idsOcultos(d).length === 0 && status.hidden && limpar.hidden,
  );
  disparar(chips[0] as Element, "click");
  disparar(chips[2] as Element, "click");
  checar(
    "combinar chips (nao assinados + cancelados) = uniao",
    chips[0]!.getAttribute("aria-pressed") === "true" &&
      chips[2]!.getAttribute("aria-pressed") === "true" &&
      idsVisiveis(d, conhecidos).length ===
        conhecidos.filter((x) => naoAssinado(x, { unidade: "TESTE" }) && d.getElementById(`anchor${x.id}`)).length,
  );
  disparar(limpar, "click");
  checar(
    "o botao Limpar zera chips, busca e nós escondidos",
    chips.every((c) => c.getAttribute("aria-pressed") === "false") && idsOcultos(d).length === 0 && ctl.estado().texto === "",
  );

  busca.value = "  RELATORIO  ";
  disparar(busca, "input");
  checar("digitar: o estado muda na hora, a tela espera um instante", ctl.estado().texto === "  RELATORIO  " && idsOcultos(d).length === 0);
  await tique(160);
  const rel = conhecidos.filter((x) => /relat[oó]rio/i.test(x.titulo) && d.getElementById(`anchor${x.id}`));
  checar(
    "depois da espera, so os que casam (sem acento e sem caixa)",
    idsVisiveis(d, conhecidos).sort().join() ===
      rel
        .map((x) => x.id)
        .sort()
        .join() && rel.length > 3,
    idsVisiveis(d, conhecidos),
  );
  busca.value = "0103947";
  disparar(busca, "input");
  await tique(160);
  checar("busca por numero SEI", idsVisiveis(d, conhecidos).join() === "160173");
  busca.value = "despacho";
  disparar(busca, "input");
  await tique(160);
  disparar(chips[0] as Element, "click");
  const e1 = idsVisiveis(d, conhecidos).length;
  checar(
    "texto + chip combinam em 'e'",
    e1 > 0 &&
      e1 ===
        conhecidos.filter((x) => /despacho/i.test(x.titulo) && naoAssinado(x, { unidade: "TESTE" }) && d.getElementById(`anchor${x.id}`))
          .length,
  );
  const tecla = (alvo: Element, key: string) => {
    const Ev = (d.defaultView as unknown as { Event: typeof Event }).Event;
    const ev = new Ev("keydown", { bubbles: true, cancelable: true });
    Object.assign(ev, { key });
    alvo.dispatchEvent(ev);
    return ev;
  };
  tecla(busca, "Escape");
  checar(
    "Esc na busca limpa o filtro inteiro (texto e chips) e devolve o foco",
    ctl.estado().texto === "" && !ctl.estado().naoAssinados && busca.value === "" && idsOcultos(d).length === 0,
  );
  tecla(busca, "Escape");
  checar("Esc sem filtro nao faz nada", idsOcultos(d).length === 0);

  // árvore muda por baixo: a pasta 3 abre, o observador reaplica
  secao("Filtro: a arvore muda por baixo (pasta aberta, barra tirada)");
  busca.value = "despacho v1";
  disparar(busca, "input");
  await tique(160);
  checar("antes de abrir a pasta 3", idsVisiveis(d, conhecidos).length === 0 && pastasOcultas(d).sort().join() === "PASTA1,PASTA2");
  const obs = observadores[0]!;
  checar("observa so mudancas de filhos (a barra e a arvore)", obs.alvo === d.getElementById("frmArvore"));
  const div3b = d.getElementById("divPASTA3")!;
  div3b.replaceChildren();
  const t2 = d.createElement("div");
  t2.append(...parse(novos.map((x) => linhaDoc(x, {})).join("")));
  while (t2.firstChild) div3b.append(t2.firstChild);
  conhecidos = [...real.documentos];
  obs.cb([{ target: div3b, addedNodes: [t2], removedNodes: [] }]);
  checar("mudanca na arvore reaplica ja (sem esperar), com a pasta nova", idsVisiveis(d, novos).join() === "160226");
  await tique(160);
  checar(
    "e de novo pouco depois, sem mudar o resultado",
    idsVisiveis(d, novos).join() === "160226" && !pastasOcultas(d).includes("PASTA3"),
  );
  const nHist = observadores.length;
  barra.remove();
  checar("barra tirada da pagina...", !barra.isConnected);
  obs.cb([{ target: d.getElementById("frmArvore"), addedNodes: [], removedNodes: [barra] }]);
  checar(
    "...volta ao mesmo lugar com o mesmo estado",
    barra.isConnected &&
      barra.nextElementSibling === arvoreEl &&
      ctl.estado().texto === "despacho v1" &&
      busca.value === "despacho v1" &&
      observadores.length === nHist,
  );
  const cont = barra.querySelector(".spro-f-status-texto")!.textContent;
  obs.cb([{ target: barra.querySelector(".spro-f-status")!, addedNodes: [], removedNodes: [] }]);
  checar("mudanca dentro da propria barra nao dispara reaplicacao", barra.querySelector(".spro-f-status-texto")!.textContent === cont);

  checar(
    "tema escuro do SEI vai para a barra",
    (() => {
      d.documentElement.setAttribute("data-spro-tema", "escuro");
      ctl.reaplicar();
      return true;
    })(),
  );

  ctl.destruir();
  checar(
    "destruir tira a barra e todo atributo",
    !barra.isConnected && d.querySelectorAll(`[${ATR_OCULTO}]`).length === 0 && obs.alvo === null,
  );

  // ------------------------------------------------------------------------------------------------ lupa
  secao("Filtro: a lupa na fileira de icones do topo (abrir, fechar, limpar ao fechar, idempotencia)");
  {
    type ObsL = { cb: (m: unknown[]) => void; alvo: Node | null };
    const obsL: ObsL[] = [];
    const Falso = class {
      private readonly o: ObsL;
      constructor(cb: (m: unknown[]) => void) {
        this.o = { cb, alvo: null };
        obsL.push(this.o);
      }
      observe(alvo: Node) {
        this.o.alvo = alvo;
      }
      disconnect() {
        this.o.alvo = null;
      }
    };
    const DepsL = { Observador: Falso as unknown as typeof MutationObserver, fila: null };
    const comTopo = (monitorados: boolean): Document => {
      const dl = montarDom(real, new Set(["PASTA1", "PASTA2"]), { decorar: true });
      const topo = dl.createElement("div");
      topo.id = "topmenu";
      const num = dl.createElement("a");
      num.id = "anchorTopo";
      num.className = "infraArvoreNo";
      num.setAttribute("target", "ifrVisualizacao");
      topo.append(num);
      if (monitorados) {
        const est = dl.createElement("button");
        est.className = "spro-fav-estrela";
        topo.append(est);
      }
      const prj = dl.createElement("button");
      prj.className = "spro-prj-ic";
      topo.append(prj);
      const ld = dl.createElement("a");
      ld.id = "anchorLD1";
      ld.className = "infraArvoreNoAcao";
      topo.append(ld);
      const header = dl.createElement("div");
      header.id = "header";
      header.append(topo);
      dl.body.insertBefore(header, dl.body.firstChild);
      return dl;
    };
    const ctxDe = (dl: Document) => ({
      doc: dl,
      idProcedimento: real.idProcedimento,
      unidade: { sigla: "TESTE" },
      documentos: { todos: () => real.documentos.filter((x) => x.pasta !== "PASTA3") },
    });
    const tec = (dl: Document, alvo: Element, key: string) => {
      const Ev = (dl.defaultView as unknown as { Event: typeof Event }).Event;
      const ev = new Ev("keydown", { bubbles: true, cancelable: true });
      Object.assign(ev, { key });
      alvo.dispatchEvent(ev);
    };

    const dl = comTopo(true);
    const cl = ligarFiltro(ctxDe(dl), DepsL)!;
    const lupa = cl.lupa();
    const topo = dl.getElementById("topmenu")!;
    const barraL = cl.barra();
    const focos: string[] = [];
    const buscaL0 = barraL.querySelector("input") as HTMLInputElement;
    buscaL0.focus = () => void focos.push("busca");
    lupa.focus = () => void focos.push("lupa");
    const buscaL = barraL.querySelector("input") as HTMLInputElement;
    const chipsL = [...barraL.querySelectorAll("button.spro-f-chip")] as HTMLButtonElement[];
    checar(
      "por padrao: a barra esta escondida, a lupa existe e nada foi filtrado",
      barraL.hidden && lupa.isConnected && !cl.aberta() && idsOcultos(dl).length === 0,
    );
    checar(
      "a lupa fica logo depois do alvo dos monitorados (a estrela dos Favoritos)",
      lupa.previousElementSibling?.className === "spro-fav-estrela" && lupa.parentElement === topo,
    );
    checar(
      "a lupa e botao com aria-label 'Filtrar documentos', aria-pressed=false, sem title",
      lupa.tagName === "BUTTON" &&
        lupa.getAttribute("type") === "button" &&
        lupa.getAttribute("aria-label") === "Filtrar documentos" &&
        lupa.getAttribute("aria-pressed") === "false" &&
        !lupa.hasAttribute("title"),
    );
    checar(
      "o glifo e preenchido (fill currentColor), escondido do leitor de tela, e nao ha on* nem innerHTML",
      lupa.querySelector("svg")?.getAttribute("fill") === "currentColor" &&
        lupa.querySelector("svg")?.getAttribute("aria-hidden") === "true" &&
        ![...lupa.querySelectorAll("*")].some((e) => [...e.getAttributeNames()].some((a) => a.startsWith("on"))),
    );
    checar("uma unica lupa na pagina", dl.querySelectorAll(".spro-f-lupa-btn").length === 1);

    disparar(lupa, "click");
    checar(
      "clicar na lupa abre: barra a vista, aria-pressed=true e o foco vai para a busca",
      cl.aberta() && !barraL.hidden && lupa.getAttribute("aria-pressed") === "true" && focos.at(-1) === "busca",
      focos,
    );
    disparar(chipsL[1] as Element, "click");
    buscaL.value = "despacho";
    disparar(buscaL, "input");
    await tique(160);
    checar("com a barra aberta o filtro funciona", idsOcultos(dl).length > 0 && cl.estado().externos);
    tec(dl, buscaL, "Escape");
    checar(
      "Esc na busca com filtro limpa tudo e MANTEM a barra aberta",
      cl.aberta() && !barraL.hidden && idsOcultos(dl).length === 0 && buscaL.value === "" && !cl.estado().externos,
    );
    tec(dl, buscaL, "Escape");
    checar(
      "Esc na busca sem filtro fecha a barra e devolve o foco a lupa",
      !cl.aberta() && barraL.hidden && lupa.getAttribute("aria-pressed") === "false" && focos.at(-1) === "lupa",
      focos,
    );

    disparar(lupa, "click");
    disparar(chipsL[0] as Element, "click");
    buscaL.value = "despacho";
    disparar(buscaL, "input");
    await tique(160);
    const ocultosAntes = idsOcultos(dl).length;
    disparar(lupa, "click");
    checar(
      "clicar na lupa de novo FECHA e LIMPA: todos os documentos voltam, busca e chips zerados, nenhum no escondido",
      ocultosAntes > 0 &&
        !cl.aberta() &&
        barraL.hidden &&
        idsOcultos(dl).length === 0 &&
        pastasOcultas(dl).length === 0 &&
        dl.querySelectorAll(`[${ATR_OCULTO}]`).length === 0 &&
        buscaL.value === "" &&
        cl.estado().texto === "" &&
        chipsL.every((c) => c.getAttribute("aria-pressed") === "false"),
    );
    checar(
      "fechado e limpo: a lupa nao indica filtro",
      !lupa.hasAttribute("data-ativo") && lupa.getAttribute("aria-label") === "Filtrar documentos",
    );

    // reabrir comeca do zero; Esc num chip tambem fecha
    focos.length = 0;
    cl.abrir();
    checar("reabrir: filtro limpo e foco na busca", cl.aberta() && cl.estado().texto === "" && focos.join() === "busca");
    tec(dl, chipsL[2] as Element, "Escape");
    checar("Esc em outro controle da barra fecha", !cl.aberta() && barraL.hidden);

    // protecao: filtro ativo por API com a barra fechada => a lupa avisa
    cl.definir({ cancelados: true });
    checar(
      "filtro ativo com a barra fechada (so por API): a lupa indica (data-ativo e aria-label)",
      lupa.hasAttribute("data-ativo") &&
        /filtro ativo/.test(lupa.getAttribute("aria-label") ?? "") &&
        lupa.getAttribute("aria-pressed") === "false",
    );
    cl.limpar();
    checar("limpar apaga a indicacao", !lupa.hasAttribute("data-ativo"));

    // idempotencia e recolocacao: o laco do legado/iframe apaga e refaz icones da fileira
    const obsTopo = obsL.find((o) => o.alvo === topo)!;
    checar("a fileira e observada so por filhos (sem subtree)", !!obsTopo);
    lupa.remove();
    obsTopo.cb([{ target: topo, addedNodes: [], removedNodes: [lupa] }]);
    checar(
      "lupa tirada da fileira volta ao lugar, sem duplicar",
      lupa.isConnected &&
        dl.querySelectorAll(".spro-f-lupa-btn").length === 1 &&
        lupa.previousElementSibling?.className === "spro-fav-estrela",
    );
    obsTopo.cb([{ target: topo, addedNodes: [], removedNodes: [] }]);
    obsTopo.cb([{ target: topo, addedNodes: [], removedNodes: [] }]);
    checar(
      "chamadas repetidas nao duplicam nem mexem",
      dl.querySelectorAll(".spro-f-lupa-btn").length === 1 && lupa.parentElement === topo,
    );
    // os Favoritos entram depois com o botao de abrir o painel logo apos a estrela: a lupa continua colada a estrela
    // (o quadro da arvore e estreito e a fileira nao quebra linha) e o botao do painel fica depois dela
    const abrirPainel = dl.createElement("button");
    abrirPainel.className = "spro-fav-abrir";
    topo.querySelector(".spro-fav-estrela")!.after(abrirPainel);
    obsTopo.cb([{ target: topo, addedNodes: [abrirPainel], removedNodes: [] }]);
    checar(
      "botao 'abrir painel' dos Favoritos entra entre a estrela e a lupa: a lupa volta a ficar colada a estrela",
      lupa.previousElementSibling?.className === "spro-fav-estrela" &&
        abrirPainel.previousElementSibling === lupa &&
        dl.querySelectorAll(".spro-f-lupa-btn").length === 1,
    );
    obsTopo.cb([{ target: topo, addedNodes: [], removedNodes: [] }]);
    checar(
      "e nao disputa o lugar (sem novas trocas)",
      lupa.previousElementSibling?.className === "spro-fav-estrela" && abrirPainel.previousElementSibling === lupa,
    );
    // o legado refaz a estrela (apaga e recria): a lupa acompanha a nova
    const velha = topo.querySelector(".spro-fav-estrela")!;
    velha.remove();
    const nova = dl.createElement("button");
    nova.className = "spro-fav-estrela";
    topo.querySelector("a.infraArvoreNo")!.after(nova);
    obsTopo.cb([{ target: topo, addedNodes: [nova], removedNodes: [velha] }]);
    checar(
      "estrela refeita: a lupa segue o novo alvo",
      lupa.previousElementSibling === nova && dl.querySelectorAll(".spro-f-lupa-btn").length === 1,
    );

    // convivencia: menu do documento e destaque do legado nao sao tocados
    const nomeL = dl.getElementById("anchor160173")!;
    nomeL.classList.add("naoAssinadoPro");
    cl.abrir();
    disparar(chipsL[1] as Element, "click");
    cl.fechar();
    checar(
      "fechar nao toca no destaque de nao assinados do legado nem deixa atributos",
      nomeL.className.includes("naoAssinadoPro") && dl.querySelectorAll(`[${ATR_OCULTO}]`).length === 0,
    );

    // tema
    dl.documentElement.setAttribute("data-spro-tema", "escuro");
    cl.reaplicar();
    // (o tema e pintado pelo observador do tema; aqui basta nao quebrar)
    cl.destruir();
    checar(
      "destruir tira a lupa, a barra e os observadores",
      !lupa.isConnected && !barraL.isConnected && obsL.every((o) => o.alvo === null),
    );

    // reinjecao: uma lupa velha no documento e removida ao ligar de novo
    const d2 = comTopo(true);
    const velhaLupa = d2.createElement("button");
    velhaLupa.className = "spro-f-lupa-btn";
    d2.getElementById("topmenu")!.append(velhaLupa);
    const c2 = ligarFiltro(ctxDe(d2), DepsL)!;
    checar(
      "ligar de novo no mesmo quadro nao deixa lupa duplicada",
      d2.querySelectorAll(".spro-f-lupa-btn").length === 1 && !velhaLupa.isConnected,
    );
    c2.destruir();

    // opcao dos monitorados desligada: depois do ultimo icone do SEI Pro da fileira
    const d3 = comTopo(false);
    const c3 = ligarFiltro(ctxDe(d3), DepsL)!;
    checar(
      "sem o alvo dos monitorados: a lupa vai depois do ultimo icone do SEI Pro da fileira",
      c3.lupa().previousElementSibling?.className === "spro-prj-ic" && c3.lupa().nextElementSibling?.id === "anchorLD1",
    );
    c3.destruir();
    // sem nenhum icone do SEI Pro: ao lado do numero do processo
    const d4 = comTopo(false);
    d4.querySelector(".spro-prj-ic")!.remove();
    const c4 = ligarFiltro(ctxDe(d4), DepsL)!;
    checar("sem nenhum icone do SEI Pro: ao lado do numero do processo", c4.lupa().previousElementSibling?.id === "anchorTopo");
    // o alvo aparece depois (Favoritos esperam ate 10 s): a lupa passa para ao lado dele
    const est4 = d4.createElement("button");
    est4.className = "spro-fav-estrela";
    d4.getElementById("anchorTopo")!.after(est4);
    obsL
      .filter((o) => o.alvo === d4.getElementById("topmenu"))
      .at(-1)!
      .cb([{ target: d4.getElementById("topmenu"), addedNodes: [est4], removedNodes: [] }]);
    checar("estrela que chega depois: a lupa muda para ao lado dela", c4.lupa().previousElementSibling === est4);
    c4.destruir();

    // legado sem Favoritos novos: o icone do legado (.iconFavoritePro) tambem e o alvo
    const d5 = comTopo(false);
    const ic = d5.createElement("i");
    ic.className = "iconFavoritePro";
    d5.getElementById("anchorTopo")!.after(ic);
    const c5 = ligarFiltro(ctxDe(d5), DepsL)!;
    checar("com o icone de monitorados do legado: a lupa vem logo depois dele", c5.lupa().previousElementSibling === ic);
    c5.destruir();

    // sem fileira (quadro sem #topmenu): nao ha onde pendurar a lupa e a barra fica sempre a vista (nunca inacessivel)
    const d6 = montarDom(real, new Set(["PASTA1"]), { decorar: true });
    const c6 = ligarFiltro(ctxDe(d6), DepsL)!;
    checar("sem fileira de icones: sem lupa e a barra segue a vista", !c6.lupa().isConnected && !c6.barra().hidden);
    c6.destruir();

    // sem nada para filtrar: sem lupa a vista
    const d7 = instalarDom(
      '<html><body><div id="topmenu"><a class="infraArvoreNo" target="ifrVisualizacao"></a></div><form id="frmArvore"><div id="divArvore"></div></form></body></html>',
    );
    const c7 = ligarFiltro({ doc: d7, idProcedimento: "1", unidade: { sigla: "" }, documentos: { todos: () => [] } }, DepsL)!;
    checar("processo sem documentos nem pastas: a lupa tambem se esconde", c7.lupa().hidden && c7.barra().hidden);
    c7.destruir();

    const css2 = readFileSync(join(AQUI, "../estatico/processo.css"), "utf8");
    checar(
      "o CSS tem a lupa (tamanho do icone vizinho, tema escuro, indicacao e hidden)",
      /\.spro-f-lupa-btn\s*\{/.test(css2) &&
        /\.spro-f-lupa-btn\[data-tema="escuro"\]/.test(css2) &&
        /\.spro-f-lupa-btn\[data-ativo\]/.test(css2) &&
        /\.spro-f-lupa-btn\[hidden\]/.test(css2),
    );
  }

  secao("Filtro: casos de borda");
  const vazio = instalarDom('<html><body><form id="frmArvore"><div id="divArvore"></div></form></body></html>');
  const ctl2 = ligarFiltro({ doc: vazio, idProcedimento: "1", unidade: { sigla: "" }, documentos: { todos: () => [] } }, { fila: null })!;
  checar("processo sem documentos nem pastas: a barra fica escondida", ctl2.barra().hidden);
  ctl2.destruir();
  const semArvore = instalarDom("<html><body><p>nada</p></body></html>");
  checar(
    "quadro sem arvore: nao liga",
    ligarFiltro({ doc: semArvore, idProcedimento: "1", unidade: { sigla: "" }, documentos: { todos: () => [] } }) === null,
  );

  // sigiloso: documentos sigilosos e restritos filtram do mesmo jeito, e nada vai para a rede
  const sig = arvoreSintetica([
    { id: "201", nome: "Sigiloso A", icone: "documento_interno", sinais: ["ug:ANTT"] },
    { id: "202", nome: "Sigiloso B", icone: "documento_pdf" },
  ]);
  const ctl3 = ligarFiltro(
    {
      doc: instalarDom(domMinimo(sig)),
      idProcedimento: sig.idProcedimento,
      unidade: { sigla: "ANTT" },
      documentos: { todos: () => sig.documentos },
    },
    { fila: null },
  )!;
  disparar(ctl3.barra().querySelector('button[data-chip="externos"]')!, "click");
  checar("processo de nivel sigiloso: filtra do mesmo jeito (sem rede: fetch lancaria)", ctl3.estado().externos);
  ctl3.destruir();

  globalThis.fetch = fetchOriginal;
}

function noDomCount(doc: Document): number {
  return [...doc.querySelectorAll('a[id^="anchor"]')].filter((a) => /^anchor\d+$/.test(a.id) && !a.id.endsWith("148265")).length;
}

/** Nós a partir de HTML, no documento atual (só nos testes; o código do módulo nunca monta HTML por string). */
function parse(html: string): Node[] {
  const alvo = (globalThis as { document: Document }).document;
  const t = alvo.createElement("div");
  t.innerHTML = html;
  return [...t.childNodes];
}

function domMinimo(arv: Arvore): string {
  const linhas = arv.documentos.map((x) => linhaDoc(x, {})).join("");
  return `<html><body><form id="frmArvore"><div id="divArvore"><a id="anchor${arv.idProcedimento}"><span id="span${arv.idProcedimento}">p</span></a><span><br></span><div id="div${arv.idProcedimento}">${linhas}</div></div></form></body></html>`;
}
