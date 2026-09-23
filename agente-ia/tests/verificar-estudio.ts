/**
 * Estúdio de Fluxo: o que o usuário digita virando fluxo.
 *
 * Os campos de lista são caixas de texto com uma linha por termo, e os números
 * de processo entram copiados e colados de qualquer lugar — vírgula, ponto e
 * vírgula, linha em branco. O que se testa aqui é essa tradução, e a regra de
 * que meia-ação (título sem pedido ao agente) não vira ação nenhuma: ela iria
 * ao cartão prometendo um botão que não faz nada.
 */

import { comAcao, comDesvio, deLinhas, numerosDeProcesso, paraLinhas, resumoDoAlcance } from "../src/estudio/campos";
import { etapaNova, fluxoNovo, type Fluxo } from "../src/fluxos/modelo";
import { checar, secao } from "./util";

const fluxo = (a: Fluxo["aplicaSe"], etapas = 2): Fluxo => ({ ...fluxoNovo("X"), aplicaSe: a, etapas: Array.from({ length: etapas }, (_, i) => etapaNova(`e${i}`)) });

export function verificarEstudio(): void {
  secao("estudio: campos de lista");
  checar("uma linha por termo", deLinhas("Contratação\nDireta").join("|") === "Contratação|Direta");
  checar("linha em branco não entra", deLinhas("  \nContratação\n\n  ").join("|") === "Contratação");
  checar("espaço nas pontas sai", deLinhas("  Nota Técnica  ").join("|") === "Nota Técnica");
  checar("texto vazio dá lista vazia", deLinhas("   ").length === 0);
  checar("ida e volta preserva a lista", deLinhas(paraLinhas(["a", "b"])).join("|") === "a|b");
  checar("lista ausente vira texto vazio", paraLinhas(undefined) === "");

  secao("estudio: numeros de processo colados");
  checar("um por linha", numerosDeProcesso("12345.000001/2026-11\n12345.000002/2026-66").length === 2);
  checar("separados por vírgula", numerosDeProcesso("12345.000001/2026-11, 12345.000002/2026-66").length === 2);
  checar("separados por ponto e vírgula", numerosDeProcesso("12345.000001/2026-11; 12345.000002/2026-66").length === 2);
  checar("repetido entra uma vez só", numerosDeProcesso("12345.000001/2026-11\n12345.000001/2026-11").length === 1);
  checar("nada digitado dá lista vazia", numerosDeProcesso("\n , ; ".replace(/ /g, "")).length === 0);

  secao("estudio: como a lista descreve o alcance");
  checar("sem critério, diz que vale para qualquer processo", /qualquer processo/.test(resumoDoAlcance(fluxo({}))));
  checar("conta as etapas", /^2 etapas/.test(resumoDoAlcance(fluxo({}))));
  checar("uma etapa no singular", /^1 etapa /.test(resumoDoAlcance(fluxo({}, 1))));
  checar("cita o tipo", resumoDoAlcance(fluxo({ tipoProcessoContem: ["Contratação Direta"] })).includes("Contratação Direta"));
  checar("cita o marcador", /marcador Urgente/.test(resumoDoAlcance(fluxo({ marcador: ["Urgente"] }))));
  checar("cita a unidade", /em GESP/.test(resumoDoAlcance(fluxo({ unidade: ["GESP"] }))));

  secao("estudio: meia acao nao vira acao");
  const e = etapaNova("Despacho");
  checar("título sem pedido não vira ação", comAcao(e, { titulo: "Preparar despacho" }) === undefined);
  checar("pedido sem título ganha título padrão", comAcao(e, { pedido: "Crie o despacho" })?.titulo === "Preparar Despacho");
  checar("os dois preenchidos formam a ação", comAcao(e, { titulo: "Preparar", pedido: "Crie" })?.pedido === "Crie");
  const comAmbos = { ...e, acao: { titulo: "Preparar", pedido: "Crie" } };
  checar("apagar o pedido desfaz a ação", comAcao(comAmbos, { pedido: "  " }) === undefined);
  checar("trocar só o título mantém o pedido", comAcao(comAmbos, { titulo: "Outro" })?.pedido === "Crie");

  secao("estudio: meio desvio nao vira desvio");
  checar("texto sem destino não vira desvio", comDesvio(e, { seDocumentoContem: "diligência" }) === undefined);
  checar("destino sem texto não vira desvio", comDesvio(e, { entaoIrPara: "e1" }) === undefined);
  checar("os dois formam o desvio", comDesvio(e, { seDocumentoContem: "diligência", entaoIrPara: "e1" })?.entaoIrPara === "e1");
  const comOs2 = { ...e, condicao: { seDocumentoContem: "dilig", entaoIrPara: "e1" } };
  checar("escolher “nenhuma” desfaz o desvio", comDesvio(comOs2, { entaoIrPara: "" }) === undefined);
}
