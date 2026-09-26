/**
 * A faixa de sugestão entre a barra de ações e o visualizador.
 *
 * Existe por um defeito real, visto no SEI 5.0.4 da ANTAQ: abrindo o processo
 * pelo número, o SEI cai direto num DOCUMENTO e a capa (`#capaProcessoPro`)
 * nunca é desenhada — a sugestão ficava só na bolinha do ícone do robô, que
 * pisca sem dizer o que é. A faixa se pendura na barra de ações, que existe em
 * qualquer documento aberto.
 *
 * O que os testes guardam: o texto entra como nó de texto (nome de fluxo e
 * título de documento vêm do SEI e do usuário), a faixa não se duplica quando o
 * legado redesenha a barra, e `null` a remove.
 */

import { DOMParser } from "linkedom";
import { cartaoDaCapa, resumoDaSugestao } from "../src/fluxos/cartao";
import { mostrarCartaoNaCapa, mostrarFaixaNaBarra } from "../src/ponte/capa";
import { checar, secao } from "./util";

const SUG = {
  fluxo: "Fiscalização PAF na Navegação Interior",
  etapa: "Extrato de Publicação-DOU",
  etapaAnterior: "Deliberação PAS",
  anterior: { numero: "3020313", titulo: "Deliberação PAS 56", assinado: true },
  cumpridas: [
    { etapa: "Auto de Infração", numero: "2994836", titulo: "Auto de Infração 12" },
    { etapa: "Deliberação PAS", numero: "3020313", titulo: "Deliberação PAS 56" },
  ],
};

const pagina = (corpo: string): Document =>
  new DOMParser().parseFromString(`<html><body>${corpo}</body></html>`, "text/html") as unknown as Document;

const BARRA = '<div id="divArvoreAcoes"><a id="iconAIActions"></a></div><iframe id="ifrVisualizacao"></iframe>';

export function verificarFaixaDeFluxo(): void {
  secao("faixa: o resumo de uma linha");
  const r = resumoDaSugestao(SUG);
  checar("nomeia a etapa que falta", r.includes("Extrato de Publicação-DOU"), r);
  checar("diz quanto do rito ja andou", /2 de 3 etapas/.test(r), r);
  checar("fala no condicional, como o cartao grande", /pode ser/.test(r), r);
  checar("nao manda ninguem fazer nada", !/\b(crie|assine|envie|deve)\b/i.test(r), r);
  checar("cabe numa linha", r.length <= 140, r.length);

  secao("faixa: onde ela entra");
  const doc = pagina(BARRA);
  mostrarFaixaNaBarra(doc, cartaoDaCapa(SUG));
  const faixa = doc.getElementById("spro-faixa-fluxo");
  checar("a faixa foi criada", Boolean(faixa));
  checar("fica DEPOIS da barra de acoes", doc.querySelector("#divArvoreAcoes")?.nextElementSibling?.id === "spro-faixa-fluxo");
  checar("e ANTES do visualizador", faixa?.nextElementSibling?.id === "ifrVisualizacao", faixa?.nextElementSibling?.id);
  checar("traz o nome do fluxo e o resumo", /Fiscalização PAF/.test(faixa?.textContent ?? "") && /Extrato de Publicação-DOU/.test(faixa?.textContent ?? ""));
  checar("tem os dois botoes", faixa?.querySelectorAll("button").length === 2, faixa?.querySelectorAll("button").length);

  secao("faixa: redesenho e remocao");
  mostrarFaixaNaBarra(doc, cartaoDaCapa(SUG));
  checar("nao duplica quando o legado redesenha", doc.querySelectorAll("#spro-faixa-fluxo").length === 1, doc.querySelectorAll("#spro-faixa-fluxo").length);
  mostrarFaixaNaBarra(doc, null);
  checar("null remove a faixa", doc.querySelectorAll("#spro-faixa-fluxo").length === 0);

  secao("faixa: pagina sem barra de acoes");
  const semBarra = pagina("<div id=\"outra-coisa\"></div>");
  mostrarFaixaNaBarra(semBarra, cartaoDaCapa(SUG));
  checar("nao inventa lugar onde nao ha barra", semBarra.querySelectorAll("#spro-faixa-fluxo").length === 0);

  secao("faixa: o iframe oculto do SEI Pro fica de fora");
  const comChecker = pagina(`${BARRA}<iframe id="frmCheckerProcessoPro"></iframe>`);
  const oculto = comChecker.querySelector<HTMLIFrameElement>("#frmCheckerProcessoPro");
  // linkedom nao monta contentDocument; o teste garante o desvio pelo id.
  checar("o iframe oculto existe na pagina de teste", Boolean(oculto));
  mostrarFaixaNaBarra(comChecker, cartaoDaCapa(SUG));
  checar("desenhou uma vez so, na barra visivel", comChecker.querySelectorAll("#spro-faixa-fluxo").length === 1);

  secao("faixa: quem manda quando a capa esta aberta");
  const comCapa = pagina(`${BARRA}<div id="capaProcessoPro"></div>`);
  const desenhouNaCapa = mostrarCartaoNaCapa(comCapa, cartaoDaCapa(SUG));
  checar("o cartao da capa avisa que desenhou", desenhouNaCapa === true);
  mostrarFaixaNaBarra(comCapa, desenhouNaCapa ? null : cartaoDaCapa(SUG));
  checar("a faixa nao repete a sugestao da capa", comCapa.querySelectorAll("#spro-faixa-fluxo").length === 0);
  const semCapa = pagina(BARRA);
  const nada = mostrarCartaoNaCapa(semCapa, cartaoDaCapa(SUG));
  checar("sem capa, o cartao grande nao desenha", nada === false);
  mostrarFaixaNaBarra(semCapa, nada ? null : cartaoDaCapa(SUG));
  checar("e a faixa assume", semCapa.querySelectorAll("#spro-faixa-fluxo").length === 1);

  secao("faixa: texto do SEI entra como texto");
  const malicioso = { ...SUG, fluxo: '<img src=x onerror="alert(1)">' };
  const doc2 = pagina(BARRA);
  mostrarFaixaNaBarra(doc2, cartaoDaCapa(malicioso));
  const f2 = doc2.getElementById("spro-faixa-fluxo");
  checar("nao interpreta HTML vindo do fluxo", f2?.querySelector("img") === null || f2?.querySelector("img") === undefined);
  checar("mas mostra o texto cru", (f2?.textContent ?? "").includes("<img"), f2?.textContent?.slice(0, 40));
}
