import { PREFIXO_ID } from "../src/config";
import { contextoDoManifesto, montarComplementos, montarGeral, montarLinha } from "../src/render";
import { SECOES_GERAL, todasAsOpcoes } from "../src/schema";
import { checar, instalarDom, secao } from "./util";

const CTX = { lab: true, foraAntaq: true, homepage: "https://seipro.app" };
const opcao = (nome: string) => todasAsOpcoes().find((o) => o.nome === nome) as ReturnType<typeof todasAsOpcoes>[number];

export function verificarRender(): void {
  secao("render: contexto do manifesto");
  checar("Lab", contextoDoManifesto({ short_name: "SEI Pro Lab" }).lab === true);
  checar(
    "SEI Pro oficial: sem Lab, fora do ANTAQ",
    (() => {
      const c = contextoDoManifesto({ short_name: "SEI Pro" });
      return !c.lab && c.foraAntaq;
    })(),
  );
  checar(
    "ANTAQ Pro e ANTT Pro: nao e fora-antaq",
    !contextoDoManifesto({ short_name: "ANTAQ Pro" }).foraAntaq && !contextoDoManifesto({ short_name: "ANTT Pro" }).foraAntaq,
  );
  checar("sem homepage_url cai em seipro.app", contextoDoManifesto({ short_name: "X" }).homepage === "https://seipro.app");

  secao("render: linha");
  instalarDom();
  const fav = opcao("gerenciarfavoritos");
  const l = montarLinha(fav, CTX);
  const input = l.querySelector("input") as HTMLInputElement;
  checar("data-opcao e data-tipo", l.getAttribute("data-opcao") === "gerenciarfavoritos" && l.getAttribute("data-tipo") === "chave");
  checar(
    "id segue o contrato do storage",
    input.getAttribute("id") === `${PREFIXO_ID}gerenciarfavoritos` && input.getAttribute("data-name") === "gerenciarfavoritos",
  );
  checar("switch acessivel", input.getAttribute("type") === "checkbox" && input.getAttribute("role") === "switch");
  checar("rotulo aponta para o controle", (l.querySelector("label.rotulo") as Element).getAttribute("for") === input.getAttribute("id"));
  checar("padrao ligado", input.hasAttribute("checked"));
  const a = l.querySelector("a.manual") as Element;
  checar(
    "manual abre em nova aba, sem opener",
    a.getAttribute("href") === "https://seipro.app/pages/FAVORITOS.html" &&
      a.getAttribute("rel") === "noopener" &&
      a.getAttribute("target") === "_blank",
  );
  const ico = l.querySelector(".ico") as Element;
  checar("icone sem classe de cor", ico.className.includes("fa-") && !/Color/.test(ico.className));
  checar(
    "linha so do Lab fica hidden fora do Lab",
    montarLinha(opcao("gradecontrole"), { ...CTX, lab: false }).hasAttribute("hidden") &&
      !montarLinha(opcao("gradecontrole"), CTX).hasAttribute("hidden"),
  );
  checar("ferramentasia hidden no ANTAQ", montarLinha(opcao("ferramentasia"), { ...CTX, foraAntaq: false }).hasAttribute("hidden"));
  checar("salvamentoautomatico sempre hidden", montarLinha(opcao("salvamentoautomatico"), CTX).hasAttribute("hidden"));
  const num = montarLinha(opcao("qualidadeimagens"), CTX).querySelector("input") as Element;
  checar(
    "numero com faixa e valor",
    num.getAttribute("min") === "1" && num.getAttribute("max") === "100" && num.getAttribute("value") === "60",
  );
  const sel = montarLinha(opcao("citacaodoc"), CTX).querySelector("select") as Element;
  checar("select com as 5 escolhas", sel.querySelectorAll("option").length === 5);
  checar(
    "rotulo e texto, nunca HTML",
    (() => {
      const o = { ...fav, rotulo: "<img src=x onerror=alert(1)>" };
      const e = montarLinha(o, CTX);
      return e.querySelector("img") === null && (e.querySelector("label.rotulo")?.textContent ?? "") === o.rotulo;
    })(),
  );

  secao("render: secoes");
  const geral = montarGeral(CTX);
  checar("data-aba geral", geral.getAttribute("data-aba") === "geral");
  const secoes = [...geral.querySelectorAll("details.secao")];
  checar("3 secoes na ordem", secoes.map((s) => s.getAttribute("data-secao")).join() === "controle,editor,arvore");
  checar("so a primeira abre", secoes.map((s) => s.hasAttribute("open")).join() === "true,false,false");
  checar("titulo na summary", (secoes[0].querySelector("summary .secao-titulo") as Element).textContent === SECOES_GERAL[0].titulo);
  checar("72 linhas em Geral", geral.querySelectorAll(".opcao").length === 72);
  checar(
    "ajuda vira title do rotulo",
    ((geral.querySelector('[data-opcao="gerenciardemandas"] label.rotulo') as Element | null)?.getAttribute("title") ?? "").includes(
      "Texto Padrão",
    ),
  );
  checar(
    "4 em Complementos",
    montarComplementos(CTX).querySelectorAll(".opcao").length === 4 && montarComplementos(CTX).getAttribute("data-aba") === "complementos",
  );
  checar(
    "sub-opcao leva data-depende",
    (geral.querySelector('[data-opcao="newdocsigilo"]') as Element).getAttribute("data-depende") === "newdocdefault:1:0,newdocnivel:0:1",
  );
  checar(
    "ids unicos",
    new Set([...geral.querySelectorAll("[id]")].map((e) => e.getAttribute("id"))).size === geral.querySelectorAll("[id]").length,
  );
}
