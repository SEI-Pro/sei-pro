import { readFileSync } from "node:fs";
import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { ementaLegivel, recurso as legis } from "../../src/recursos/legis";
import type { Contexto } from "../../src/recursos/tipos";
import {
  buscarNormas,
  htmlDaAncora,
  normaDaApi,
  numeroDaApi,
  periodoDaApi,
  resolverSiglas,
  tipoDaSelecao,
  URL_LEGIS_API,
} from "../../src/util/legis-api";
import { clicar, dialogoAberto, digitar, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, cursorEm, type FalsoCk4, type FalsoCk5, nosDoisEditores, selecionarTexto, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
type Chamada = { url: string; init?: RequestInit };

const LEGADO = JSON.parse(readFileSync(new URL("../legado-legis.json", import.meta.url), "utf8")) as Array<{
  api: Record<string, unknown>;
  norma: Record<string, unknown>;
  ancora: string;
  ancoraRepetida: string;
}>;

const resposta = (corpo: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => corpo }) as unknown as Response;

function redeFalsa(responder: (c: Chamada) => Response | Promise<Response>) {
  const chamadas: Chamada[] = [];
  const rede = async (url: string, init?: RequestInit) => {
    const c = { url, init };
    chamadas.push(c);
    return responder(c);
  };
  return { rede: rede as unknown as typeof fetch, chamadas };
}

const lei = (numero: number, extra: Record<string, unknown> = {}) => ({
  tipo: "lei",
  numero,
  titulo: `Lei nº ${numero}, de 1 de janeiro de 2020`,
  url: `https://normas.leg.br/?urn=${numero}`,
  ementa: "Ementa curta.",
  ...extra,
});

function ctxDe(c: { win: Window; doc: Document }, rede: typeof fetch, extra: Partial<Contexto> = {}): Contexto {
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
    fetch: rede,
    ...extra,
  };
}

const selecao = (d: ParentNode, id: string) => d.querySelector(`#${id}`) as unknown as HTMLSelectElement;
const campo = (d: ParentNode, id: string) => d.querySelector(`#${id}`) as HTMLInputElement;

export async function verificarLegis(): Promise<void> {
  secao("util legis-api: igual ao legado");
  for (const caso of LEGADO) {
    const norma = normaDaApi(caso.api);
    const { url, ...resto } = norma;
    const { url: urlLegado, ...restoLegado } = caso.norma as { url: string };
    igual(`normaDaApi ${String(caso.api.titulo).slice(0, 30)}: campos iguais ao legado`, resto, restoLegado);
    const seguro = /^https?:\/\//.test(urlLegado);
    igual(`normaDaApi: url ${seguro ? "http(s) igual" : "insegura/ausente vira vazia"}`, url, seguro ? urlLegado : "");
    if (seguro) {
      igual("ancora: a primeira citacao e igual a do legado", htmlDaAncora(norma, false), caso.ancora);
      igual("ancora: a citacao repetida e igual a do legado", htmlDaAncora(norma, true), caso.ancoraRepetida);
    } else {
      igual(
        "ancora sem URL http(s): o mesmo texto, sem href e sem target",
        htmlDaAncora(norma, false),
        caso.ancora.replace(' href="" target="_blank"', ""),
      );
    }
  }
  checar(
    "normaDaApi: url javascript: e descartada",
    normaDaApi({ tipo: "lei", numero: 1, titulo: "x", url: "javascript:alert(1)" }).url === "" &&
      !htmlDaAncora(normaDaApi({ tipo: "lei", numero: 1, titulo: "x", url: "javascript:alert(1)" }), false).includes("javascript"),
  );
  igual(
    "numeroDaApi",
    [numeroDaApi("12.527"), numeroDaApi("2200-2"), numeroDaApi("8666/93"), numeroDaApi(""), numeroDaApi("abc")],
    [12527, 2200, 8666, "", ""],
  );
  igual(
    "periodoDaApi",
    [periodoDaApi("ano"), periodoDaApi("ate"), periodoDaApi("apos"), periodoDaApi("")],
    ["exato", "ate", "apos", "exato"],
  );
  igual(
    "tipoDaSelecao: a ordem decreto-lei antes de decreto",
    [
      tipoDaSelecao("Decreto-Lei nº 2.848"),
      tipoDaSelecao("Decreto nº 1"),
      tipoDaSelecao("Lei Complementar nº 101"),
      tipoDaSelecao("EC 45"),
      tipoDaSelecao("texto"),
      tipoDaSelecao("Lei nº 8.666"),
    ],
    ["decreto.lei", "decreto", "lei.complementar", "emenda.constitucional", "", "lei"],
  );
  const longa = ementaLegivel(`${"palavra ".repeat(40)}fim`);
  checar(
    "ementaLegivel: corta depois de 170 caracteres na proxima palavra e marca como longa",
    longa.longa && longa.curta.endsWith("...") && longa.curta.length < 200,
  );
  igual("ementaLegivel: caixa alta vira normal", ementaLegivel("DISPÕE SOBRE ALGO").completa, "Dispõe sobre algo");

  secao("util legis-api: rede");
  {
    const f = redeFalsa(() => resposta({ total: 1, itens: [lei(14133)] }));
    const r = await buscarNormas(f.rede as never, URL_LEGIS_API, { q: "", tipo: "lei", numero: 14133, ano: "", periodo: "" });
    igual(
      "buscarNormas: GET /normas so com os filtros preenchidos",
      f.chamadas[0]?.url,
      `${URL_LEGIS_API}/normas?per_page=50&tipo=lei&numero=14133`,
    );
    igual("buscarNormas: devolve total e as normas ja convertidas", [r.total, r.normas[0]?.sigla], [1, "Lei14133"]);
    const ruim = redeFalsa(() => resposta({}, 503));
    let erro = false;
    await buscarNormas(ruim.rede as never, URL_LEGIS_API, {}).catch(() => {
      erro = true;
    });
    checar("buscarNormas: HTTP 5xx rejeita", erro);
    const caida = redeFalsa(() => {
      throw new TypeError("Failed to fetch");
    });
    erro = false;
    await buscarNormas(caida.rede as never, URL_LEGIS_API, {}).catch(() => {
      erro = true;
    });
    checar("buscarNormas: falha de rede rejeita", erro);
  }
  {
    const f = redeFalsa(() => resposta({ resultados: { "Lei14133/2021": lei(14133), Cf: null } }));
    const achadas = await resolverSiglas(f.rede as never, URL_LEGIS_API, [" Lei14133/2021 ", "Lei14133/2021", "Cf", "", "x".repeat(100)]);
    const corpo = JSON.parse(String(f.chamadas[0]?.init?.body)) as { refs: string[] };
    igual(
      "resolverSiglas: POST /normas/resolver com siglas aparadas, sem repeticao e limitadas a 60",
      [f.chamadas[0]?.init?.method, corpo.refs],
      ["POST", ["Lei14133/2021", "Cf", "x".repeat(60)]],
    );
    igual("resolverSiglas: so entram as siglas que a API resolveu", Object.keys(achadas), ["Lei14133/2021"]);
    const falha = await resolverSiglas(redeFalsa(() => resposta({}, 500)).rede as never, URL_LEGIS_API, ["Lei1"]);
    igual("resolverSiglas: HTTP de erro => ninguem achado (sem excecao)", falha, {});
    const semRede = await resolverSiglas(
      redeFalsa(() => {
        throw new Error("x");
      }).rede as never,
      URL_LEGIS_API,
      ["Lei1"],
    );
    igual("resolverSiglas: rede caida => ninguem achado", semRede, {});
  }

  secao("recurso legis");
  await nosDoisEditores("legis", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const f = redeFalsa((x) => {
      if (x.url.includes("/normas/resolver"))
        return resposta({
          resultados: { Antaqres5: lei(5, { titulo: "Resolução ANTAQ nº 5" }), Cf: lei(1988, { tipo: "constituicao", titulo: "CF" }) },
        });
      if (x.url.includes("numero=1&") || x.url.endsWith("numero=1"))
        return resposta({
          total: 7,
          itens: [1, 2, 3, 4, 5, 6, 7].map((n) => lei(n, { titulo: `Decreto nº 1 (${n})`, ementa: "e".repeat(300) })),
        });
      if (x.url.includes("numero=404")) return resposta({ total: 0, itens: [] });
      if (x.url.includes("numero=500")) return resposta({}, 500);
      if (x.url.includes("numero=666"))
        return resposta({
          total: 1,
          itens: [
            {
              tipo: "lei",
              numero: 666,
              titulo: '<img src=x onerror="alert(1)">',
              url: "javascript:alert(1)",
              ementa: "<script>x</script>",
            },
          ],
        });
      return resposta({ total: 1, itens: [lei(14133)] });
    });
    const g = legis.globais(ctxDe(c, f.rede)) as Record<string, Fn>;
    igual(`legis ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogLegisSEI",
      "getLegisSEI",
      "getSearchLegis",
      "getSearchLegisMore",
      "insertLegisSEI",
      "resolverNormasLegisPro",
      "sendLegisSEI",
    ]);
    const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, "<p>texto</p>"));
    cursorEm(c, corpo.querySelector("p"));
    const abrir = () => {
      g.getLegisSEI(null);
      return dialogoAberto(c.doc) as HTMLElement;
    };
    const fechar = () => {
      (c.doc.querySelector("dialog.spro-dialogo[open]") as HTMLDialogElement | null)?.close();
      c.doc.body.querySelector(".spro-aviso")?.remove();
    };

    // dialogo
    let d = abrir();
    igual(
      `legis ${v}: abas Legislação Federal, Norma Infralegal e Lista de Normas`,
      [...d.querySelectorAll('[role="tab"]')].map((t) => t.textContent),
      ["Legislação Federal", "Norma Infralegal", "Lista de Normas"],
    );
    checar(`legis ${v}: sem Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    // nada informado
    clicar(d, "Inserir");
    checar(
      `legis ${v}: sem tipo e numero avisa e mantem o dialogo`,
      !!dialogoAberto(c.doc) && /Informe o tipo e o número/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // uma norma so: fecha e insere a ancora do legado
    selecao(d, "legis_tipoNorma").value = "lei";
    digitar(campo(d, "legis_numeroNorma"), "14.133");
    clicar(d, "Inserir");
    await tique();
    igual(`legis ${v}: a busca vai com tipo e numero`, f.chamadas.at(-1)?.url, `${URL_LEGIS_API}/normas?per_page=50&tipo=lei&numero=14133`);
    checar(
      `legis ${v}: achou uma so: fecha o dialogo e insere a ancora .legisSeiPro com o titulo`,
      !dialogoAberto(c.doc) && /legisSeiPro/.test(ultimoInserido(c) ?? "") && /Lei nº 14133/.test(ultimoInserido(c) ?? ""),
      ultimoInserido(c) ?? "",
    );

    // numero repetido: lista as opcoes (nao escolhe no escuro)
    d = abrir();
    selecao(d, "legis_tipoNorma").value = "decreto";
    digitar(campo(d, "legis_numeroNorma"), "1");
    clicar(d, "Inserir");
    await tique();
    const linhas = [...d.querySelectorAll(".searchLegis_linha")];
    checar(
      `legis ${v}: numero repetido lista as 7 opcoes e avisa, sem inserir`,
      linhas.length === 7 && /Há 7 normas com esse número/.test(d.textContent ?? "") && !!dialogoAberto(c.doc),
    );
    // ementa longa: mais / menos
    const curta = linhas[0]?.querySelector(".searchLegis_ementa") as HTMLElement;
    const cheia = linhas[0]?.querySelector(".searchLegis_ementafull") as HTMLElement;
    const mais = curta.querySelector("a") as Element;
    mais.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    igual(`legis ${v}: "mais" mostra a ementa completa e esconde a curta`, [curta.style.display, cheia.style.display], ["none", ""]);
    (cheia.querySelector("a") as Element).dispatchEvent(
      new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }),
    );
    igual(`legis ${v}: "menos" volta`, [curta.style.display, cheia.style.display], ["", "none"]);
    // escolher uma: Adicionar
    const botoes = [...d.querySelectorAll("button")].filter((b) => b.textContent === "Adicionar");
    botoes[2]?.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    checar(
      `legis ${v}: Adicionar insere a norma escolhida (3a) e fecha`,
      !dialogoAberto(c.doc) && /Decreto nº 1 \(3\)/.test(ultimoInserido(c) ?? ""),
      ultimoInserido(c) ?? "",
    );

    // com o ano a busca vai com periodo
    d = abrir();
    selecao(d, "legis_tipoNorma").value = "lei";
    digitar(campo(d, "legis_numeroNorma"), "14133");
    digitar(campo(d, "legis_anoNorma"), "2021");
    selecao(d, "legis_periodoNorma").value = "ate";
    clicar(d, "Inserir");
    await tique();
    igual(
      `legis ${v}: com o ano a busca leva ano e periodo`,
      f.chamadas.at(-1)?.url,
      `${URL_LEGIS_API}/normas?per_page=50&tipo=lei&numero=14133&ano=2021&periodo=ate`,
    );
    fechar();

    // sem resultado
    d = abrir();
    selecao(d, "legis_tipoNorma").value = "lei";
    digitar(campo(d, "legis_numeroNorma"), "404");
    clicar(d, "Inserir");
    await tique();
    checar(
      `legis ${v}: sem resultado avisa "Nenhuma legislação encontrada" e o dialogo continua`,
      /Nenhuma legislação encontrada/.test(c.doc.body.textContent ?? "") && !!dialogoAberto(c.doc),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // HTTP 5xx: aviso claro e o dialogo continua utilizavel (uma nova busca funciona)
    digitar(campo(d, "legis_numeroNorma"), "500");
    clicar(d, "Inserir");
    await tique();
    checar(
      `legis ${v}: HTTP 500 avisa o servico indisponivel e mantem o dialogo`,
      /Serviço de legislação indisponível/.test(c.doc.body.textContent ?? "") && !!dialogoAberto(c.doc),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();
    digitar(campo(d, "legis_numeroNorma"), "14133");
    clicar(d, "Inserir");
    await tique();
    checar(`legis ${v}: depois da falha, tentar de novo funciona`, !dialogoAberto(c.doc));

    // resposta hostil: nada de marcacao, href recusado
    d = abrir();
    selecao(d, "legis_tipoNorma").value = "lei";
    digitar(campo(d, "legis_numeroNorma"), "666");
    const pesquisar = d.querySelector("#searchLegis_uiElement") as Element;
    pesquisar.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    await tique();
    const area = d.querySelector("#searchLegis_result") as HTMLElement;
    checar(
      `legis ${v}: <img onerror> e <script> da resposta entram como TEXTO e javascript: nao vira href`,
      !area.querySelector("img, script") &&
        (area.textContent ?? "").includes("<img src=x") &&
        ![...area.querySelectorAll("a")].some((a) => /javascript/i.test(a.getAttribute("href") ?? "")),
    );
    [...d.querySelectorAll("button")]
      .find((b) => b.textContent === "Adicionar")
      ?.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    const inserido = ultimoInserido(c) ?? "";
    checar(
      `legis ${v}: a ancora inserida da norma hostil escapa o titulo e nao tem href`,
      !inserido.includes("<img") && !inserido.includes("javascript") && !inserido.includes("href"),
      inserido,
    );

    // infralegal e lista (resolver)
    d = abrir();
    selecao(d, "legis_orgaoInfraNorma").value = "Antaq";
    selecao(d, "legis_tipoInfraNorma").value = "res";
    digitar(campo(d, "legis_numeroInfraNorma"), "5/2020");
    clicar(d, "Inserir");
    await tique();
    const corpoResolver = JSON.parse(String(f.chamadas.at(-1)?.init?.body)) as { refs: string[] };
    igual(`legis ${v}: aba Infralegal pede a sigla orgao+tipo+numero ("Antaqres5")`, corpoResolver.refs, ["Antaqres5"]);
    checar(`legis ${v}: e insere a norma resolvida`, !dialogoAberto(c.doc) && /Resolução ANTAQ nº 5/.test(ultimoInserido(c) ?? ""));
    d = abrir();
    selecao(d, "legis_nomeNorma").value = "Cf";
    clicar(d, "Inserir");
    await tique();
    igual(
      `legis ${v}: aba Lista de Normas pede a sigla escolhida`,
      (JSON.parse(String(f.chamadas.at(-1)?.init?.body)) as { refs: string[] }).refs,
      ["Cf"],
    );

    // norma ja citada no documento entra pelo titulo curto
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<p><a href="https://normas.leg.br/?urn=14133">Lei já citada</a></p>`));
    cursorEm(c, corpo.querySelector("p"));
    g.sendLegisSEI("Antaqres5");
    await tique();
    g.insertLegisSEI(null);
    const f2 = redeFalsa(() => resposta({ resultados: { Cf: lei(14133, { titulo_curto: "Lei curta 14.133" }) } }));
    const g2 = legis.globais(ctxDe(c, f2.rede)) as Record<string, Fn>;
    g2.sendLegisSEI("Cf");
    await tique();
    checar(
      `legis ${v}: norma que ja esta no documento (mesmo href) entra pelo titulo curto`,
      />Lei curta 14\.133<\/a>/.test(ultimoInserido(c) ?? "") && !/>Lei nº 14133, de 1 de janeiro/.test(ultimoInserido(c) ?? ""),
      ultimoInserido(c) ?? "",
    );

    // sigla que a API nao conhece
    const f3 = redeFalsa(() => resposta({ resultados: {} }));
    const g3 = legis.globais(ctxDe(c, f3.rede)) as Record<string, Fn>;
    g3.sendLegisSEI("LeiXYZ");
    await tique();
    checar(
      `legis ${v}: sigla sem norma avisa "Nenhuma legislação encontrada"`,
      /Nenhuma legislação encontrada/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // resolverNormasLegisPro (global usado pelo sei-legis.js): callback SEMPRE, mesmo com a API caida
    let achadas: Record<string, unknown> | null = null;
    g.resolverNormasLegisPro(["Lei14133/2021"], (a: unknown) => {
      achadas = a as Record<string, unknown>;
    });
    await tique();
    checar(`legis ${v}: resolverNormasLegisPro devolve o mapa pelo callback`, achadas !== null);
    const caida = redeFalsa(() => {
      throw new TypeError("Failed to fetch");
    });
    const g4 = legis.globais(ctxDe(c, caida.rede)) as Record<string, Fn>;
    let vazio: unknown = null;
    g4.resolverNormasLegisPro(["x"], (a: unknown) => {
      vazio = a;
    });
    await tique();
    igual(`legis ${v}: com a API caida o callback recebe um mapa vazio`, vazio, {});

    // o texto selecionado preenche tipo, numero e ano
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, "<p>Lei Complementar nº 101/2000</p>"));
    const p = corpo.querySelector("p") as Element;
    selecionarTexto(c, p, "Lei Complementar nº 101/2000", "Lei Complementar nº 101/2000");
    d = abrir();
    igual(
      `legis ${v}: a selecao preenche tipo, numero e ano`,
      [selecao(d, "legis_tipoNorma").value, campo(d, "legis_numeroNorma").value, campo(d, "legis_anoNorma").value],
      ["lei.complementar", "101", "2000"],
    );
    fechar();
  });
}
