import { ATRIBUTO_DICA, alvoDaDica, iniciarDicas, temTooltipDoSei } from "../src/pagina/dicas";
import { checar, disparar, instalarDom, secao } from "./util";

export function verificarDicas(): void {
  secao("dicas (tooltips da casca)");
  const html = `<html><head></head><body>
<div id="divInfraBarraSistemaPadrao"><a id="usuario" title="Fulano de Tal (fulano/ORGAO)"><img src="x.svg"></a><a id="a1" title="Controle de Processos"><img id="a1img" src="x.svg"></a></div>
<div class="barraBotoesSEI"><a id="c1" onmouseover="return infraTooltipMostrar('Historico')"><img id="c1img" title="Historico"></a><a id="b1" title="Atribuir Processo" onmouseover="return infraTooltipMostrar('Atribuir')"></a><a id="b3">sem titulo</a></div>
<div id="infraMenu"><input id="campo" title="Pesquisar no Menu" placeholder="Pesquisar no Menu"></div>
<div id="fora"><a id="f1" title="Fora da casca"></a></div>
</body></html>`;
  const doc = instalarDom(html);
  const g = (id: string) => doc.getElementById(id) as HTMLElement;

  checar("alvo: dentro dos escopos da casca", alvoDaDica(g("a1")) === g("a1") && alvoDaDica(g("a1img")) === g("a1"));
  checar("alvo: fora da casca nao e alvo", alvoDaDica(g("f1")) === null && alvoDaDica(g("b3")) === null);
  checar("title na <img> com tooltip do SEI no <a> pai: nao mostra o proprio", temTooltipDoSei(g("c1img")) && temTooltipDoSei(g("b1")));
  checar("botao sem tooltip do SEI continua com o proprio", !temTooltipDoSei(g("a1")));

  const parar = iniciarDicas(doc);
  // O dado que o SEI Pro le do title (login, unidade...) NAO pode sumir fora do hover: era o que derrubava os modulos.
  checar(
    "ligar nao mexe em nenhum title (o contexto da aba le o login do title do usuario)",
    g("usuario").getAttribute("title") === "Fulano de Tal (fulano/ORGAO)" && g("a1").getAttribute("title") === "Controle de Processos",
  );

  disparar(g("a1"), "mouseover");
  checar(
    "sob o mouse: o title nativo sai e vira data-spro-dica",
    !g("a1").hasAttribute("title") && g("a1").getAttribute(ATRIBUTO_DICA) === "Controle de Processos",
  );
  checar("os outros botoes seguem intactos", g("usuario").getAttribute("title") === "Fulano de Tal (fulano/ORGAO)");
  disparar(g("a1"), "mouseout");
  checar(
    "ao sair: o title volta e a dica some",
    g("a1").getAttribute("title") === "Controle de Processos" && !g("a1").hasAttribute(ATRIBUTO_DICA),
  );

  disparar(g("b1"), "mouseover");
  checar(
    "quem ja tem o tooltip do SEI perde o title so no hover, sem dica propria agendada",
    !g("b1").hasAttribute("title") && g("b1").getAttribute("onmouseover")?.includes("infraTooltipMostrar") === true,
  );
  disparar(g("a1"), "mouseover");
  checar(
    "trocar de botao devolve o title do anterior",
    g("b1").getAttribute("title") === "Atribuir Processo" && !g("a1").hasAttribute("title"),
  );

  disparar(g("campo"), "mouseover");
  checar(
    "campo de texto perde o title no hover e nao ganha dica",
    !g("campo").hasAttribute("title") && !g("campo").hasAttribute(ATRIBUTO_DICA),
  );

  parar();
  checar(
    "desligar devolve o title do que estava sob o mouse e nao deixa caixa",
    g("campo").getAttribute("title") === "Pesquisar no Menu" && doc.querySelector("[data-spro-dica-caixa]") === null,
  );
  const menu = doc.createElement("a");
  menu.id = "lnkInfraMenuSistema";
  menu.setAttribute("title", "Exibir Menu do Sistema");
  g("divInfraBarraSistemaPadrao").appendChild(menu);
  const divMenu5 = doc.createElement("div");
  divMenu5.id = "divInfraMenuSistema";
  divMenu5.setAttribute("title", "Exibir Menu do Sistema");
  const linkMenu5 = doc.createElement("a");
  linkMenu5.setAttribute("title", "Exibir Menu do Sistema");
  divMenu5.appendChild(linkMenu5);
  g("divInfraBarraSistemaPadrao").appendChild(divMenu5);
  const parar2 = iniciarDicas(doc);
  disparar(menu, "mouseover");
  disparar(linkMenu5, "mouseover");
  checar(
    "botao do menu do sistema (SEI 4.1 e SEI 5) preserva o title no hover (o SEI le o title ao clicar)",
    alvoDaDica(menu) === null &&
      menu.getAttribute("title") === "Exibir Menu do Sistema" &&
      alvoDaDica(divMenu5) === null &&
      alvoDaDica(linkMenu5) === null &&
      divMenu5.getAttribute("title") === "Exibir Menu do Sistema" &&
      linkMenu5.getAttribute("title") === "Exibir Menu do Sistema",
  );
  disparar(g("a1"), "mouseover");
  disparar(g("a1"), "mousedown");
  checar(
    "mousedown devolve o title antes do clique",
    g("a1").getAttribute("title") === "Controle de Processos" && !g("a1").hasAttribute(ATRIBUTO_DICA),
  );
  parar2();

  checar("fora da casca o title nunca foi tocado", g("f1").getAttribute("title") === "Fora da casca");
}
