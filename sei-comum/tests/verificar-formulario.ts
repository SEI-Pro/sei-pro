import { h } from "../src/ui/dom";
import {
  atualizarValor,
  botaoTexto,
  caixa,
  campoComSufixo,
  corCampo,
  criarAbas,
  grupo,
  intervalo,
  sincronizarControles,
} from "../src/ui/formulario";
import { checar, disparar, instalarDom, secao } from "./util";

type Ev = new (tipo: string, init?: Record<string, unknown>) => Event;

function tecla(doc: Document, el: Element, key: string): void {
  const E = (doc.defaultView as unknown as { Event: Ev }).Event;
  const ev = new E("keydown", { bubbles: true, cancelable: true });
  Object.assign(ev, { key });
  el.dispatchEvent(ev);
}

export function verificarFormulario(): void {
  secao("formulario: grupo, controles e abas do kit");
  const doc = instalarDom();

  // ---- grupo ----
  const select = h("select", { id: "s" }, h("option", { value: "a" }, "A"));
  const g = grupo("Tipo", { para: "s", dica: "ajuda", opcional: true, valor: "3" }, select);
  checar("grupo: o rotulo aponta para o campo (label for)", g.querySelector("label.spro-rotulo")?.getAttribute("for") === "s");
  checar("grupo: o select entra no seletor com seta e ganha a classe de campo", !!g.querySelector(".spro-seletor > select.spro-campo"));
  checar("grupo: dica e (opcional) aparecem", g.querySelector(".spro-dica")?.textContent === "ajuda" && /\(opcional\)/.test(g.textContent ?? ""));
  checar("grupo: valor ao vivo fica ao lado do rotulo", g.querySelector('[data-valor-de="s"]')?.textContent === "3");
  atualizarValor(g, "s", "7 px");
  checar("atualizarValor troca o valor mostrado", g.querySelector(".spro-valor")?.textContent === "7 px");

  const multi = h("select", { id: "m", multiple: "multiple" });
  checar("grupo: select multiplo NAO ganha a seta (fica como lista)", !grupo("L", {}, multi).querySelector(".spro-seletor"));
  const texto = h("input", { type: "text", id: "t" });
  const area = h("textarea", { id: "a" });
  const numero = h("input", { type: "number", id: "n" });
  const faixaNativa = h("input", { type: "range", id: "r" });
  grupo("x", {}, texto, area, numero, faixaNativa);
  checar("grupo: texto, textarea e numero ganham a classe de campo", [texto, area, numero].every((e) => e.classList.contains("spro-campo")));
  checar("grupo: input range e checkbox NAO ganham a classe de campo", !faixaNativa.classList.contains("spro-campo"));
  checar("grupo sem rotulo nao cria cabecalho", !grupo(null, {}, h("div")).querySelector(".spro-rotulo"));
  checar("grupo largo marca a classe", grupo("x", { largo: true }, h("div")).classList.contains("spro-largo"));
  const hostil = '<img src=x onerror="alert(1)">';
  checar("rotulo e dica entram como texto, nunca HTML", !grupo(hostil, { dica: hostil }, h("div")).querySelector("img"));

  // ---- campo com sufixo ----
  const sufixo = campoComSufixo(h("input", { type: "number" }), "%");
  checar("campoComSufixo: o input ganha a classe e o sufixo vem depois", !!sufixo.querySelector("input.spro-campo") && sufixo.querySelector("span")?.textContent === "%");

  // ---- intervalo ----
  const faixa = intervalo({ id: "f", min: 100, max: 500, step: 50, value: 300 });
  checar("intervalo: --p parte do valor (300 entre 100 e 500 = 50%)", faixa.style.getPropertyValue("--p") === "50%");
  faixa.value = "500";
  disparar(faixa, "input");
  checar("intervalo: mexer no controle atualiza --p (100%)", faixa.style.getPropertyValue("--p") === "100%");
  faixa.value = "100";
  sincronizarControles(h("div", {}, faixa));
  checar("sincronizarControles refaz --p depois de mudar por codigo (0%)", faixa.style.getPropertyValue("--p") === "0%");

  // ---- cor ----
  const cor = corCampo({ id: "c", value: "#333333" });
  const entrada = cor.querySelector("input") as HTMLInputElement;
  checar("corCampo: mostra o codigo da cor", cor.querySelector(".spro-cor-hex")?.textContent === "#333333");
  entrada.value = "#ff0000";
  disparar(entrada, "input");
  checar("corCampo: o codigo acompanha a escolha", cor.querySelector(".spro-cor-hex")?.textContent === "#ff0000");
  entrada.value = "#00ff00";
  sincronizarControles(h("div", {}, cor));
  checar("sincronizarControles refaz o codigo da cor", cor.querySelector(".spro-cor-hex")?.textContent === "#00ff00");

  // ---- caixa ----
  const cx = caixa({ id: "x", checked: "checked" }, "Opcao");
  checar("caixa: o texto fica dentro do label e o input vem marcado", cx.tagName === "LABEL" && cx.querySelector("input")?.hasAttribute("checked") === true && /Opcao/.test(cx.textContent ?? ""));

  // ---- botao de texto ----
  let cliques = 0;
  const bt = botaoTexto("Opcoes", () => cliques++, { expansivel: true });
  bt.click();
  checar("botaoTexto: chama o clique e abre (aria-expanded=true)", cliques === 1 && bt.getAttribute("aria-expanded") === "true");
  bt.click();
  checar("botaoTexto: o segundo clique fecha (aria-expanded=false)", bt.getAttribute("aria-expanded") === "false");

  // ---- abas ----
  const conteudos = { um: h("p", {}, "1"), dois: h("p", {}, "2"), tres: h("p", {}, "3") };
  const escolhidas: string[] = [];
  const abas = criarAbas(
    "t",
    [
      ["um", "Um"],
      ["dois", "Dois"],
      ["tres", "Tres"],
    ],
    conteudos,
    (id) => escolhidas.push(id),
  );
  doc.body.append(abas.barra, ...abas.paineis);
  abas.selecionar("um");
  const aba = (id: string) => doc.querySelector(`#tTab_${id}`) as HTMLElement;
  const painel = (id: string) => doc.querySelector(`#tPainel_${id}`) as HTMLElement;
  checar("abas: papeis e ids", abas.barra.getAttribute("role") === "tablist" && aba("um").getAttribute("aria-controls") === "tPainel_um" && painel("um").getAttribute("aria-labelledby") === "tTab_um");
  checar("abas: so a ativa fica selecionada, na ordem do Tab e visivel", aba("um").getAttribute("aria-selected") === "true" && aba("dois").getAttribute("tabindex") === "-1" && !painel("um").hasAttribute("hidden") && painel("dois").hasAttribute("hidden"));
  tecla(doc, aba("um"), "ArrowRight");
  checar("abas: seta para a direita vai para a proxima e avisa", aba("dois").getAttribute("aria-selected") === "true" && escolhidas.at(-1) === "dois");
  tecla(doc, aba("dois"), "ArrowRight");
  tecla(doc, aba("tres"), "ArrowRight");
  checar("abas: depois da ultima volta para a primeira", aba("um").getAttribute("aria-selected") === "true");
  tecla(doc, aba("um"), "ArrowLeft");
  checar("abas: seta para a esquerda na primeira vai para a ultima", aba("tres").getAttribute("aria-selected") === "true");
  aba("dois").click();
  checar("abas: clicar seleciona e mostra o painel", aba("dois").getAttribute("aria-selected") === "true" && !painel("dois").hasAttribute("hidden") && painel("tres").hasAttribute("hidden"));
}
