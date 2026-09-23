/**
 * Estúdio de Fluxo: o que o usuário digita virando fluxo.
 *
 * Os campos de lista são caixas de texto com uma linha por termo, e os números
 * de processo entram copiados e colados de qualquer lugar — vírgula, ponto e
 * vírgula, linha em branco. O que se testa aqui é essa tradução, e a regra de
 * que meia-ação (título sem pedido ao agente) não vira ação nenhuma: ela iria
 * ao cartão prometendo um botão que não faz nada.
 */

import { andamentosDoHistorico, comAcao, comDesvio, deLinhas, metadadosDaArvore, numerosDeProcesso, paraLinhas, resumoDoAlcance } from "../src/estudio/campos";
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

/**
 * Metadados que vão para a inferência.
 *
 * Documento cancelado foi riscado dos autos: se ele entra no prompt, o modelo
 * pode propor como etapa do rito um documento que a avaliação NUNCA aceita
 * (avaliar.ts o recusa) — e o fluxo passaria a cobrar para sempre uma etapa
 * impossível de cumprir.
 */
export function verificarMetadadosDoModelo(): void {
  secao("estudio: metadados do processo modelo");
  const docs = [
    { numero: "1", titulo: "Nota Técnica 55", assinado: true, unidade: "GESP" },
    { numero: "2", titulo: "Despacho errado", assinado: true, cancelado: true },
    { numero: "3", titulo: "", nivel: "sigiloso" },
    { numero: "4", titulo: "Ofício 12", assinado: false, externo: true },
  ];
  const m = metadadosDaArvore(docs);
  checar("descarta documento cancelado", !m.some((d) => d.titulo.includes("errado")), m);
  checar("descarta documento sigiloso", m.length === 2, m);
  checar("mantem a ordem cronologica", m[0].titulo === "Nota Técnica 55" && m[1].titulo === "Ofício 12");
  checar("renumera a ordem depois do descarte", m[0].ordem === 1 && m[1].ordem === 2, m.map((d) => d.ordem));
  checar("leva unidade, assinatura e anexo", m[0].unidade === "GESP" && m[0].assinado === true && m[1].externo === true);
}

/**
 * O histórico, como a ponte o devolve.
 *
 * `processo.historico` NÃO devolve um array: devolve
 * `{ protocolo, total, andamentos }`. Tratá-lo como array estourava
 * "a.map is not a function" no meio da leitura do processo modelo — e o erro
 * só aparecia contra um SEI de verdade, porque nenhum teste tocava esse caminho.
 */
export function verificarHistoricoDoModelo(): void {
  secao("estudio: historico do processo modelo");
  const dois = [
    { data: "10/03/2026", unidade: "GPF", descricao: "Processo remetido" },
    { data: "11/03/2026", unidade: "GPF", descricao: "Documento assinado" },
  ];
  checar("le a forma que a ponte devolve", andamentosDoHistorico({ protocolo: "x", total: 2, andamentos: dois }).length === 2);
  checar("preserva data, unidade e descricao", andamentosDoHistorico({ andamentos: dois })[0].data === "10/03/2026");
  checar("aceita array puro, se vier assim", andamentosDoHistorico(dois).length === 2);
  checar("resposta vazia nao quebra", andamentosDoHistorico(undefined).length === 0 && andamentosDoHistorico(null).length === 0);
  checar("resposta inesperada nao quebra", andamentosDoHistorico({ erro: "x" }).length === 0 && andamentosDoHistorico("nada").length === 0);
  checar("item torto e descartado", andamentosDoHistorico({ andamentos: [null, 3, { data: "1", descricao: "ok" }] }).length === 1);
}
