/**
 * Operação `fluxo.avaliar`: a árvore COMPLETA, não a que está na tela.
 *
 * Por que ela busca em vez de ler o DOM vivo: o SEI só carrega o conteúdo de
 * uma pasta quando o usuário a abre. Num processo de fiscalização real
 * (50300.014788/2023-20, ANTAQ) a árvore recém-carregada tem 16 dos 111 nós —
 * e o fluxo não sugeria nada, sem avisar. Ler pela metade é pior do que a
 * requisição que se queria evitar: a ferramenta não cumpre o papel dela.
 *
 * O `sei.arvore` guarda o que buscou por 30 s, então abrir o mesmo processo
 * várias vezes não vira várias requisições.
 */

import { OPERACOES } from "../src/ponte/operacoes";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import { checar, lanca, secao } from "./util";

const doc = (numero: string, titulo: string, d: Partial<DocumentoArvore> = {}): DocumentoArvore =>
  ({ id: numero, numero, titulo, pasta: null, externo: false, formato: "interno", nivel: "publico", assinado: true, assinaturas: [], cancelado: false, link: "", src: "", acoes: [], botoes: [], ...d }) as DocumentoArvore;

const arvore = (documentos: DocumentoArvore[], a: Partial<Arvore> = {}): Arvore =>
  ({ idProcedimento: "1", protocolo: "50300.014788/2023-20", tipo: "Procedimento de Fiscalização (PAF)", nivel: "publico", marcadores: [], documentos, acoesProcesso: [], botoesProcesso: [], linkProcesso: "", sinais: [], links: [], pagina: { url: "", status: 200, html: "", doc: null as unknown as Document }, ...a }) as Arvore;

/** `Sei` de mentira que anota o que lhe pediram. */
function seiFalso(arv: Arvore) {
  const pedidos: string[] = [];
  return { pedidos, sei: { arvore: async (ref: string) => (pedidos.push(ref), arv) } as unknown as Sei };
}

const FLUXO = {
  id: "paf", nome: "PAF", ativo: true, origem: "manual" as const, atualizadoEm: 0,
  aplicaSe: { tipoProcessoContem: ["Procedimento de Fiscalização"] },
  etapas: [
    { id: "e1", nome: "Ordem de Serviço", documento: { tituloContem: ["Ordem de Serviço"] }, obrigatoria: true },
    { id: "e2", nome: "Auto de Infração", documento: { tituloContem: ["Auto de Infração"] }, obrigatoria: true },
    { id: "e3", nome: "Termo de Arquivamento", documento: { tituloContem: ["Termo de Arquivamento"] }, obrigatoria: true },
  ],
};

// Os dois primeiros estariam DENTRO de pastas: a arvore da tela nao os traz.
const COMPLETA = [doc("2024294", "Ordem de Serviço de Fiscalização 271"), doc("2115344", "Auto de Infração 006315-0")];

const sinal = new AbortController().signal;

export async function verificarOpFluxoAvaliar(): Promise<void> {
  secao("ponte: fluxo.avaliar busca a arvore completa");
  const { pedidos, sei } = seiFalso(arvore(COMPLETA));
  const r = (await OPERACOES["fluxo.avaliar"](sei, { processo: "50300.014788/2023-20", fluxos: [FLUXO], ignorados: {}, unidade: "GPF" }, sinal)) as {
    protocolo: string; fluxoId: string; etapaId: string; cumpridas: Array<{ numero: string }>; anterior: { numero: string };
  } | null;
  checar("pediu a arvore do processo informado", pedidos.join() === "50300.014788/2023-20", pedidos);
  checar("enxergou os documentos que estavam em pasta", r?.cumpridas.length === 2, r?.cumpridas);
  checar("achou a lacuna certa", r?.etapaId === "e3", r?.etapaId);
  checar("ancorou no ultimo documento do rito", r?.anterior.numero === "2115344", r?.anterior);
  checar("devolveu o protocolo da arvore", r?.protocolo === "50300.014788/2023-20");

  secao("ponte: fluxo.avaliar, casos de borda");
  const cheia = seiFalso(arvore([...COMPLETA, doc("2799512", "Termo de Arquivamento de Processo 2799512")]));
  checar("rito inteiro cumprido nao sugere", (await OPERACOES["fluxo.avaliar"](cheia.sei, { processo: "x", fluxos: [FLUXO], ignorados: {} }, sinal)) === null);

  const sigiloso = seiFalso(arvore(COMPLETA, { nivel: "sigiloso" }));
  checar("processo sigiloso nunca sugere", (await OPERACOES["fluxo.avaliar"](sigiloso.sei, { processo: "x", fluxos: [FLUXO], ignorados: {} }, sinal)) === null);

  const semFluxo = seiFalso(arvore(COMPLETA));
  checar("sem fluxo ligado, NAO busca a arvore", ((await OPERACOES["fluxo.avaliar"](semFluxo.sei, { processo: "x", fluxos: [{ ...FLUXO, ativo: false }], ignorados: {} }, sinal)) === null) && semFluxo.pedidos.length === 0, semFluxo.pedidos);
  const semNada = seiFalso(arvore(COMPLETA));
  checar("sem processo na tela, NAO busca a arvore", ((await OPERACOES["fluxo.avaliar"](semNada.sei, { fluxos: [FLUXO], ignorados: {} }, sinal)) === null) && semNada.pedidos.length === 0);

  const ignorados = { "50300.014788/2023-20": [{ etapaId: "e3", quando: 1 }] };
  checar("etapa ignorada naquele processo nao sugere", (await OPERACOES["fluxo.avaliar"](seiFalso(arvore(COMPLETA)).sei, { processo: "x", fluxos: [FLUXO], ignorados }, sinal)) === null);

  // Erro do SEI (processo fechado, sem permissão) não pode derrubar o painel.
  const quebrado = { arvore: async () => { throw new Error("SEI_NAO_ENCONTRADO"); } } as unknown as Sei;
  checar("erro ao buscar a arvore volta como erro, nao como cartao errado", (await lanca(() => OPERACOES["fluxo.avaliar"](quebrado, { processo: "x", fluxos: [FLUXO], ignorados: {} }, sinal))) !== null);
}
