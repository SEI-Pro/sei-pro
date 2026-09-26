/**
 * Estúdio de Fluxo: aprender um fluxo de processos modelo.
 *
 * A IA aqui não decide rito: ela lê METADADOS (títulos na ordem da árvore,
 * unidade, assinatura, andamentos com data) e propõe uma sequência, que o
 * usuário edita e salva. O que se testa é o que quebra na prática — a resposta
 * do modelo vindo suja (texto em volta, cerca de código, campo inventado,
 * etapa pela metade) e o prompt levando só metadados.
 */

import { inferirFluxo, lerProposta, promptDeInferencia, type ProcessoModelo } from "../src/fluxos/inferir";
import { validarFluxo } from "../src/fluxos/modelo";
import type { Provedor, RespostaLLM } from "../src/motor/tipos";
import { checar, lanca, secao } from "./util";

const MODELO: ProcessoModelo = {
  protocolo: "12345.000001/2026-11",
  tipo: "Contratação Direta",
  documentos: [
    { ordem: 1, titulo: "Nota Técnica 55", unidade: "GESP", assinado: true },
    { ordem: 2, titulo: "Anexo - planilha de custos", unidade: "GESP", assinado: false, externo: true },
    { ordem: 3, titulo: "Despacho de aprovação", unidade: "GESP", assinado: true },
  ],
  historico: [{ data: "10/03/2026", unidade: "GESP", descricao: "Processo remetido" }],
};

const BOA = JSON.stringify({
  nome: "Contratação direta",
  etapas: [
    { nome: "Nota Técnica", documento: { tituloContem: ["Nota Técnica", "NT"], assinado: true }, obrigatoria: true },
    { nome: "Despacho de aprovação", documento: { tituloContem: ["Despacho"] } },
  ],
  divergencias: ["em 2 de 3 veio Despacho antes do Ofício"],
});

const provedorQueResponde = (texto: string): Provedor => ({
  modelo: "teste",
  conversar: async (): Promise<RespostaLLM> => ({ texto, chamadas: [], fim: "stop", uso: { entrada: 10, saida: 20, custo: 0 } }),
});

export async function verificarInferirFluxo(): Promise<void> {
  secao("inferir: o prompt leva metadados, e so");
  const p = promptDeInferencia([MODELO]);
  // Só o bloco do processo: o cabeçalho de instruções traz um exemplo de JSON
  // que também cita "Despacho de aprovação", e comparar com ele daria ordem falsa.
  const lista = p.slice(p.indexOf("## Processo modelo"));
  checar("leva os títulos na ordem da árvore", lista.indexOf("Nota Técnica 55") < lista.indexOf("Despacho de aprovação"), lista);
  checar("leva a unidade geradora", p.includes("GESP"));
  checar("marca o que está assinado", /assinado/i.test(p));
  checar("marca o que é anexo", /anexo|externo/i.test(p));
  checar("leva o histórico com data", p.includes("10/03/2026"));
  checar("diz o protocolo do modelo", p.includes("12345.000001/2026-11"));
  checar("manda separar etapa de documento acessório", /acessório/i.test(p));
  checar("pede JSON de volta", /json/i.test(p));
  checar("com um modelo só, avisa que generaliza mal", /um só processo|apenas um processo|um único processo/i.test(p));
  const dois = promptDeInferencia([MODELO, { ...MODELO, protocolo: "12345.000002/2026-66" }]);
  checar("com dois modelos, pede as divergências", /diverg/i.test(dois));
  checar("numera os processos modelo", dois.includes("12345.000002/2026-66"));

  secao("inferir: ler a resposta do modelo");
  const limpa = lerProposta(BOA);
  checar("lê as etapas na ordem", limpa.etapas.map((e) => e.nome).join("|") === "Nota Técnica|Despacho de aprovação");
  checar("lê o nome do fluxo", limpa.nome === "Contratação direta");
  checar("lê as divergências", limpa.divergencias.length === 1);
  checar("dá id próprio a cada etapa", limpa.etapas[0].id !== limpa.etapas[1].id && Boolean(limpa.etapas[0].id));
  checar("etapa sem `obrigatoria` vira obrigatória", limpa.etapas[1].obrigatoria === true);
  checar("a proposta passa na validação do modelo", validarFluxo({ id: "x", nome: limpa.nome, ativo: false, aplicaSe: {}, etapas: limpa.etapas, origem: "inferido", atualizadoEm: 0 }).length === 0);

  checar("aceita texto antes e depois", lerProposta(`Claro! Segue:\n${BOA}\n\nEspero ter ajudado.`).etapas.length === 2);
  checar("aceita cerca de código", lerProposta("```json\n" + BOA + "\n```").etapas.length === 2);
  checar("ignora campo inventado", lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: { tituloContem: ["NT"] }, confianca: 0.9, cor: "azul" }] })).etapas.length === 1);

  secao("inferir: resposta suja");
  const semNome = lerProposta(JSON.stringify({ etapas: [{ documento: { tituloContem: ["Ofício"] } }, { nome: "NT", documento: { tituloContem: ["NT"] } }] }));
  checar("etapa sem nome herda o título procurado", semNome.etapas[0].nome === "Ofício");
  const semDoc = lerProposta(JSON.stringify({ etapas: [{ nome: "Qualquer coisa" }, { nome: "NT", documento: { tituloContem: ["NT"] } }] }));
  checar("etapa sem documento é descartada", semDoc.etapas.length === 1 && semDoc.etapas[0].nome === "NT");
  checar("e o descarte vira aviso na tela", semDoc.avisos.some((a) => /Qualquer coisa/.test(a)));
  checar("documento como texto simples é aceito", lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: "Nota Técnica" }] })).etapas[0].documento.tituloContem[0] === "Nota Técnica");
  checar("tituloContem como texto simples é aceito", lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: { tituloContem: "Nota" } }] })).etapas[0].documento.tituloContem[0] === "Nota");

  const desvioPerdido = lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: { tituloContem: ["NT"] }, condicao: { seDocumentoContem: "pend", entaoIrPara: "etapa-que-nao-existe" } }] }));
  checar("desvio para etapa inexistente é descartado", desvioPerdido.etapas[0].condicao === undefined);
  checar("e o desvio descartado também avisa", desvioPerdido.avisos.some((a) => /desvio/i.test(a)));

  const acaoTorta = lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: { tituloContem: ["NT"] }, acao: { titulo: "Preparar" } }] }));
  checar("ação sem pedido é descartada", acaoTorta.etapas[0].acao === undefined);
  const acaoBoa = lerProposta(JSON.stringify({ etapas: [{ nome: "NT", documento: { tituloContem: ["NT"] }, acao: { titulo: "Preparar NT", pedido: "Crie a NT" } }] }));
  checar("ação completa é mantida", acaoBoa.etapas[0].acao?.pedido === "Crie a NT");

  checar("resposta sem JSON nenhum lança erro em português", /não|nao/i.test((await lanca(() => lerProposta("Desculpe, não consegui.")))?.message ?? ""));
  checar("JSON sem etapa nenhuma lança erro", (await lanca(() => lerProposta('{"etapas": []}'))) !== null);

  secao("inferir: a chamada devolve fluxo pronto para editar");
  const r = await inferirFluxo(provedorQueResponde(BOA), [MODELO], new AbortController().signal);
  checar("o fluxo vem desligado", r.fluxo.ativo === false);
  checar("o fluxo diz que foi inferido", r.fluxo.origem === "inferido");
  checar("o fluxo guarda o processo modelo, para auditoria", r.fluxo.modelos?.[0].protocolo === "12345.000001/2026-11");
  checar("o fluxo já mira o tipo do processo modelo", r.fluxo.aplicaSe.tipoProcessoContem?.[0] === "Contratação Direta");
  checar("as divergências chegam à tela", r.divergencias.length === 1);
  checar("o gasto da chamada volta junto", r.uso?.saida === 20);
  checar("sem processo modelo nenhum, lança antes de gastar", (await lanca(() => inferirFluxo(provedorQueResponde(BOA), [], new AbortController().signal))) !== null);
}
