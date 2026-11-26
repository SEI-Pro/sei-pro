import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaMemoria } from "@comum/armazenamento/area";
import { abaPedidaNoEndereco, ferramentasDoPacote, type ManifestoDoPacote, montarShell } from "../src/shell/painel";
import { botao, checar, instalarDom, secao, tique } from "./util";

const url = (c: string) => `chrome-extension://x/${c}`;
const AQUI = dirname(fileURLToPath(import.meta.url));

export async function verificarShell(): Promise<void> {
  secao("painel lateral: abas Monitorados | Agente");
  const doc = instalarDom('<html><body><div id="painel"></div></body></html>');
  const sessao = areaMemoria({ painelAba: "agente" });
  const raiz = doc.getElementById("painel")!;
  const shell = await montarShell(raiz, { sessao, temAgente: true, url });
  const frames = () => [...raiz.querySelectorAll("iframe")] as HTMLIFrameElement[];
  checar("abre na aba pedida pelo background", shell.atual() === "agente");
  checar("so a aba aberta tem iframe (preguicoso)", frames().length === 1 && frames()[0]!.src.endsWith("html/agente.html"));
  botao(raiz, "Monitorados")!.click();
  await tique();
  checar(
    "trocar cria o iframe do monitorados, em modo lateral",
    frames().length === 2 && frames().some((f) => f.src.endsWith("favoritos.html#modo=lateral")),
  );
  const agente = frames().find((f) => f.src.endsWith("agente.html"))!;
  checar("o agente fica vivo, so escondido", agente.hidden && raiz.contains(agente));
  checar("a escolha fica na sessao", ((await sessao.obter("painelAba")).painelAba as { aba?: string }).aba === "favoritos");
  botao(raiz, "Agente de IA")!.click();
  await tique();
  checar("voltar nao recria o iframe", frames().length === 2 && !agente.hidden);
  await sessao.gravar({ painelAba: "favoritos" });
  await tique();
  checar("pedido novo do background com o painel aberto troca a aba", shell.atual() === "favoritos");
  checar("aba marcada", botao(raiz, "Monitorados")!.getAttribute("aria-selected") === "true");

  secao("painel lateral: contador na aba Monitorados");
  const doc3 = instalarDom('<html><body><div id="painel"></div></body></html>');
  const local = areaMemoria({ "favoritos/contadorPainel": 3 });
  const raiz3 = doc3.getElementById("painel")!;
  await montarShell(raiz3, { sessao: areaMemoria(), temAgente: true, url, local });
  await tique();
  checar("mostra as pendencias na aba", botao(raiz3, "Monitorados (3)") !== undefined, raiz3.querySelector('[role="tab"]')?.textContent);
  await local.gravar({ "favoritos/contadorPainel": 0 });
  await tique();
  checar("zerou: sem numero", botao(raiz3, "Monitorados") !== undefined);

  secao("painel lateral: pacote sem o monitorados novo (oficial ainda com o antigo)");
  const doc4 = instalarDom('<html><body><div id="painel"></div></body></html>');
  const raiz4 = doc4.getElementById("painel")!;
  const s4 = await montarShell(raiz4, { sessao: areaMemoria({ painelAba: "favoritos" }), temAgente: true, temFavoritos: false, url });
  checar(
    "so o agente, sem a aba Monitorados que nunca conectaria",
    s4.atual() === "agente" && raiz4.querySelectorAll("iframe").length === 1 && !raiz4.querySelector('[role="tablist"]'),
  );

  secao("painel lateral: pacote sem o agente");
  const doc2 = instalarDom('<html><body><div id="painel"></div></body></html>');
  const raiz2 = doc2.getElementById("painel")!;
  const s2 = await montarShell(raiz2, { sessao: areaMemoria({ painelAba: "agente" }), temAgente: false, url });
  checar("sem agente, so monitorados", s2.atual() === "favoritos" && raiz2.querySelectorAll("iframe").length === 1);
  checar("e sem barra de abas", !raiz2.querySelector('[role="tablist"]'));

  secao("painel lateral: tres abas na ordem Monitorados | Historico | Agente");
  {
    const docH = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizH = docH.getElementById("painel")!;
    const shellH = await montarShell(raizH, { sessao: areaMemoria({ painelAba: "historico" }), temAgente: true, temHistorico: true, url });
    const rotulos = [...raizH.querySelectorAll('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
    checar("ordem das abas", JSON.stringify(rotulos) === JSON.stringify(["Monitorados", "Hist\u00f3rico", "Agente de IA"]), rotulos);
    checar("abre na aba historico pedida", shellH.atual() === "historico");
    const f = raizH.querySelector("iframe") as HTMLIFrameElement;
    checar("iframe do historico em modo lateral", f.src.endsWith("html/historico.html#modo=lateral"));
  }
  {
    const docS = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizS = docS.getElementById("painel")!;
    await montarShell(raizS, { sessao: areaMemoria(), temAgente: true, url });
    checar("sem init_historico no manifest, nao ha aba Historico", !botao(raizS, "Hist\u00f3rico"));
  }

  secao("painel lateral: aba Projetos (P5 dos projetos)");
  {
    const docP = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizP = docP.getElementById("painel")!;
    const local = areaMemoria({ "projetos/contadorPainel": 2 });
    const shellP = await montarShell(raizP, {
      sessao: areaMemoria({ painelAba: "projetos" }),
      temAgente: true,
      temHistorico: true,
      temProjetos: true,
      url,
      local,
    });
    await tique();
    const rotulos = [...raizP.querySelectorAll('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
    checar(
      "ordem Monitorados | Historico | Projetos | Agente",
      JSON.stringify(rotulos) === JSON.stringify(["Monitorados", "Hist\u00f3rico", "Projetos (2)", "Agente de IA"]),
      rotulos,
    );
    checar("abre na aba pedida pelo background", shellP.atual() === "projetos");
    const f = raizP.querySelector("iframe") as HTMLIFrameElement;
    checar("iframe do app dos projetos em modo lateral", f.src.endsWith("html/projetos.html#modo=lateral"), f.src);
    checar(
      "o contador e o das etapas atrasadas",
      botao(raizP, "Projetos (2)")?.getAttribute("title") === "2 etapas atrasadas nos projetos da unidade",
    );
    await local.gravar({ "projetos/contadorPainel": 0 });
    await tique();
    checar("sem atraso: sem numero", botao(raizP, "Projetos") !== undefined);
    const docE = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizE = docE.getElementById("painel")!;
    const shellE = await montarShell(raizE, { sessao: areaMemoria(), temAgente: true, temProjetos: true, url, abaDoEndereco: "projetos" });
    checar("#aba=projetos (janela comum do Firefox) abre na aba", shellE.atual() === "projetos");
    const docS = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizS = docS.getElementById("painel")!;
    await montarShell(raizS, { sessao: areaMemoria({ painelAba: "projetos" }), temAgente: true, url });
    checar("sem init_projetos no manifest, nao ha aba Projetos", !botao(raizS, "Projetos"));
  }

  secao("painel lateral: o contador dos Projetos vem do storage (de fora): inteiro de 0 ao teto, senao nada");
  {
    const docC = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizC = docC.getElementById("painel")!;
    const local = areaMemoria({ "projetos/contadorPainel": 1 });
    await montarShell(raizC, { sessao: areaMemoria(), temAgente: true, temProjetos: true, url, local });
    await tique();
    const aba = () =>
      [...raizC.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find((b) => b.getAttribute("aria-label")?.startsWith("Projetos"))!;
    checar("uma etapa: no singular", aba().title === "1 etapa atrasada nos projetos da unidade", aba().title);
    // O teto e o maximo possivel: 2 escopos (So eu e Toda a unidade) x 100 projetos ativos x 300 etapas.
    await local.gravar({ "projetos/contadorPainel": 60000 });
    await tique();
    checar("no teto ainda mostra", aba().getAttribute("aria-label") === "Projetos (60000)", aba().getAttribute("aria-label"));
    const tortos: Array<[string, unknown]> = [
      ["fracao", 2.5],
      ["negativo", -3],
      ["texto com numero", "7"],
      ["NaN", Number.NaN],
      ["infinito", Number.POSITIVE_INFINITY],
      ["acima do teto", 60001],
      ["objeto", { n: 5 }],
    ];
    for (const [nome, valor] of tortos) {
      await local.gravar({ "projetos/contadorPainel": 4 });
      await tique();
      await local.gravar({ "projetos/contadorPainel": valor });
      await tique();
      const b = aba();
      const conta = b.querySelector<HTMLElement>(".painel-conta")!;
      checar(`${nome}: sem numero, sem dica`, b.getAttribute("aria-label") === "Projetos" && b.title === "Projetos" && conta.hidden, [
        b.getAttribute("aria-label"),
        b.title,
        conta.textContent,
      ]);
    }
    const docT = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizT = docT.getElementById("painel")!;
    await montarShell(raizT, {
      sessao: areaMemoria(),
      temAgente: true,
      temProjetos: true,
      url,
      local: areaMemoria({ "projetos/contadorPainel": 1e9 }),
    });
    await tique();
    checar(
      "torto ja na abertura: sem numero",
      botao(raizT, "Projetos") !== undefined,
      raizT.querySelector('[role="tab"]')?.getAttribute("aria-label"),
    );
  }

  secao("painel lateral: aba Demandas (selo das minhas atrasadas)");
  {
    const docD = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizD = docD.getElementById("painel")!;
    const local = areaMemoria({ "demandas/contadorPainel": 3 });
    const shellD = await montarShell(raizD, {
      sessao: areaMemoria({ painelAba: "demandas" }),
      temAgente: true,
      temProjetos: true,
      temDemandas: true,
      url,
      local,
    });
    await tique();
    const rotulos = [...raizD.querySelectorAll<HTMLButtonElement>('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
    checar(
      "ordem Monitorados | Projetos | Demandas | Agente (o historico so com o seu manifest)",
      JSON.stringify(rotulos) === JSON.stringify(["Monitorados", "Projetos", "Demandas (3)", "Agente de IA"]),
      rotulos,
    );
    checar("abre na aba pedida pelo background", shellD.atual() === "demandas");
    const f = raizD.querySelector("iframe") as HTMLIFrameElement;
    checar("iframe do app das demandas em modo lateral", f.src.endsWith("html/demandas.html#modo=lateral"), f.src);
    checar(
      "o selo usa o contador das demandas, nao o dos projetos",
      botao(raizD, "Demandas (3)")?.getAttribute("title") === "3 demandas suas atrasadas na unidade",
      botao(raizD, "Demandas (3)")?.getAttribute("title"),
    );
    await local.gravar({ "demandas/contadorPainel": 1 });
    await tique();
    checar("uma so: no singular", botao(raizD, "Demandas (1)")?.getAttribute("title") === "1 demanda sua atrasada na unidade");
    await local.gravar({ "demandas/contadorPainel": 0 });
    await tique();
    checar("sem atraso: sem numero", botao(raizD, "Demandas") !== undefined);
    await local.gravar({ "demandas/contadorPainel": 1e9, "projetos/contadorPainel": 7 });
    await tique();
    checar(
      "torto: sem numero (o dos projetos nao vaza)",
      botao(raizD, "Demandas") !== undefined && botao(raizD, "Projetos (7)") !== undefined,
    );
    const docE = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizE = docE.getElementById("painel")!;
    const shellE = await montarShell(raizE, { sessao: areaMemoria(), temAgente: true, temDemandas: true, url, abaDoEndereco: "demandas" });
    checar("#aba=demandas (janela comum do Firefox) abre na aba", shellE.atual() === "demandas");
    const docS = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizS = docS.getElementById("painel")!;
    await montarShell(raizS, { sessao: areaMemoria({ painelAba: "demandas" }), temAgente: true, url });
    checar("sem init_demandas no manifest, nao ha aba Demandas", !botao(raizS, "Demandas"));
  }

  secao("painel lateral: aba Conhecimento (numeracao das pastas)");
  {
    const docC = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizC = docC.getElementById("painel")!;
    const shellC = await montarShell(raizC, {
      sessao: areaMemoria({ painelAba: "conhecimento" }),
      temAgente: true,
      temConhecimento: true,
      url,
    });
    const rotulosC = [...raizC.querySelectorAll('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
    checar(
      "ordem com a aba Conhecimento",
      JSON.stringify(rotulosC) === JSON.stringify(["Monitorados", "Conhecimento", "Agente de IA"]),
      rotulosC,
    );
    checar("abre na aba conhecimento pedida", shellC.atual() === "conhecimento");
    const fC = raizC.querySelector("iframe") as HTMLIFrameElement;
    checar("iframe da BC em modo lateral", fC.src.endsWith("html/base-conhecimento.html#modo=lateral"));
    const docS = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizS = docS.getElementById("painel")!;
    await montarShell(raizS, { sessao: areaMemoria({ painelAba: "conhecimento" }), temAgente: true, url });
    checar("sem init_base_conhecimento no manifest, nao ha aba Conhecimento", !botao(raizS, "Conhecimento"));

    const docT = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizT = docT.getElementById("painel")!;
    await montarShell(raizT, {
      sessao: areaMemoria(),
      temAgente: true,
      temHistorico: true,
      temProjetos: true,
      temDemandas: true,
      temConhecimento: true,
      url,
    });
    const rotulosT = [...raizT.querySelectorAll('[role="tab"]')].map((b) => b.getAttribute("aria-label"));
    checar(
      "ordem completa das abas",
      JSON.stringify(rotulosT) ===
        JSON.stringify(["Monitorados", "Hist\u00f3rico", "Projetos", "Demandas", "Conhecimento", "Agente de IA"]),
      rotulosT,
    );
  }

  secao("painel lateral: as abas saem do manifest do pacote (o oficial ainda nao tem os modulos novos)");
  {
    const lab = JSON.parse(readFileSync(join(AQUI, "..", "..", "dist", "manifest.json"), "utf8")) as ManifestoDoPacote;
    const l = ferramentasDoPacote(lab);
    checar(
      "Lab (dist/manifest.json): Favoritos, Historico, Projetos, Demandas, Conhecimento e Agente",
      l.temAgente && l.temFavoritos && l.temHistorico && l.temProjetos && l.temDemandas && l.temConhecimento,
      l,
    );
    // O oficial (dist/manifest_seipro.json, fora do git) e o manifest do Lab sem estes content scripts.
    const novos = [
      "js/init_favoritos.js",
      "js/init_historico.js",
      "js/init_projetos.js",
      "js/init_demandas.js",
      "js/init_base_conhecimento.js",
    ];
    const oficial: ManifestoDoPacote = {
      content_scripts: (lab.content_scripts ?? []).filter((c) => !c.js?.some((j) => novos.includes(j))),
    };
    const o = ferramentasDoPacote(oficial);
    checar(
      "oficial: so o Agente, sem as abas Projetos, Demandas e Conhecimento",
      o.temAgente && !o.temFavoritos && !o.temHistorico && !o.temProjetos && !o.temDemandas && !o.temConhecimento,
      o,
    );
    checar("manifest sem content_scripts: nenhuma ferramenta", !Object.values(ferramentasDoPacote({})).some(Boolean));
    const docO = instalarDom('<html><body><div id="painel"></div></body></html>');
    const raizO = docO.getElementById("painel")!;
    const shellO = await montarShell(raizO, { sessao: areaMemoria({ painelAba: "projetos" }), ...o, url, abaDoEndereco: "projetos" });
    checar(
      "oficial montado: o pedido da aba Projetos cai no Agente, sem aba Projetos",
      shellO.atual() === "agente" && !botao(raizO, "Projetos") && raizO.querySelectorAll("iframe").length === 1,
      shellO.atual(),
    );
  }

  secao("painel lateral: aba pedida pelo endereco (#aba=..., janela comum do Firefox)");
  checar("#aba=projetos", abaPedidaNoEndereco("#aba=projetos") === "projetos");
  checar("#aba=historico", abaPedidaNoEndereco("#aba=historico") === "historico");
  checar("#aba=demandas", abaPedidaNoEndereco("#aba=demandas") === "demandas");
  checar("#aba=conhecimento", abaPedidaNoEndereco("#aba=conhecimento") === "conhecimento");
  checar("aba desconhecida: nenhuma", abaPedidaNoEndereco("#aba=qualquer") === null);
  checar("nome herdado de objeto nao vale", abaPedidaNoEndereco("#aba=constructor") === null);
  checar("sem endereco: nenhuma", abaPedidaNoEndereco("") === null);
}
