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
  type R = {
    sugestao: { etapaId: string; anterior: { numero: string }; cumpridas: Array<{ numero: string }> } | null;
    motivo?: string; protocolo?: string; tipo?: string; fluxoId?: string; etapaAtualId?: string; primeiraId?: string; etapaIgnoradaId?: string;
  };
  const chamar = (sei: Sei, args: Record<string, unknown>) => OPERACOES["fluxo.avaliar"](sei, args, sinal) as Promise<R>;

  secao("ponte: fluxo.avaliar busca a arvore completa");
  const { pedidos, sei } = seiFalso(arvore(COMPLETA));
  const r = await chamar(sei, { processo: "50300.014788/2023-20", fluxos: [FLUXO], ignorados: {}, unidade: "GPF" });
  checar("pediu a arvore do processo informado", pedidos.join() === "50300.014788/2023-20", pedidos);
  checar("enxergou os documentos que estavam em pasta", r.sugestao?.cumpridas.length === 2, r.sugestao?.cumpridas);
  checar("achou a lacuna certa", r.sugestao?.etapaId === "e3", r.sugestao?.etapaId);
  checar("ancorou no ultimo documento do rito", r.sugestao?.anterior.numero === "2115344", r.sugestao?.anterior);
  checar("devolveu o protocolo e o tipo da arvore", r.protocolo === "50300.014788/2023-20" && /Fiscaliza/.test(r.tipo ?? ""), r);
  checar("com sugestao, nao ha motivo", r.motivo === undefined);

  secao("ponte: fluxo.avaliar explica o silencio");
  const cheia = seiFalso(arvore([...COMPLETA, doc("2799512", "Termo de Arquivamento de Processo 2799512")]));
  const rc = await chamar(cheia.sei, { processo: "x", fluxos: [FLUXO], ignorados: {} });
  checar("rito cumprido: diz o motivo e em que etapa esta", rc.sugestao === null && rc.motivo === "rito-cumprido" && rc.etapaAtualId === "e3", rc);

  const vazio = seiFalso(arvore([doc("1", "Ofício qualquer")]));
  const rn = await chamar(vazio.sei, { processo: "x", fluxos: [FLUXO], ignorados: {} });
  checar("rito nem comecou: diz qual seria a primeira etapa", rn.motivo === "rito-nao-comecou" && rn.primeiraId === "e1", rn);

  const sigiloso = seiFalso(arvore(COMPLETA, { nivel: "sigiloso" }));
  const rs = await chamar(sigiloso.sei, { processo: "x", fluxos: [FLUXO], ignorados: {} });
  checar("processo sigiloso nunca sugere, e diz por que", rs.sugestao === null && rs.motivo === "sigiloso", rs);

  const ign = seiFalso(arvore(COMPLETA));
  const ri = await chamar(ign.sei, { processo: "x", fluxos: [FLUXO], ignorados: { "50300.014788/2023-20": [{ etapaId: "e3", quando: 1 }] } });
  checar("lacuna ignorada: diz que foi ignorada, e qual", ri.motivo === "ignorada" && ri.etapaIgnoradaId === "e3", ri);

  secao("ponte: fluxo.avaliar nao busca a arvore em vao");
  const semFluxo = seiFalso(arvore(COMPLETA));
  const rf = await chamar(semFluxo.sei, { processo: "x", fluxos: [{ ...FLUXO, ativo: false }], ignorados: {} });
  checar("sem fluxo ligado: motivo e ZERO requisicao", rf.motivo === "sem-fluxo-ligado" && semFluxo.pedidos.length === 0, semFluxo.pedidos);

  const semProcesso = seiFalso(arvore(COMPLETA));
  const rp = await chamar(semProcesso.sei, { fluxos: [FLUXO], ignorados: {} });
  checar("sem processo na tela: motivo e ZERO requisicao", rp.motivo === "sem-processo" && semProcesso.pedidos.length === 0);

  // O tipo vem da tela (de graça). Se nenhum fluxo ligado pode casar com ele,
  // buscar a árvore seria requisição jogada fora em todo processo aberto.
  const outroTipo = seiFalso(arvore(COMPLETA));
  const ro = await chamar(outroTipo.sei, { processo: "x", tipo: "Gestão de Pessoal", fluxos: [FLUXO], ignorados: {} });
  checar("tipo da tela ja descarta o fluxo: ZERO requisicao", ro.motivo === "nao-se-aplica" && outroTipo.pedidos.length === 0, outroTipo.pedidos);
  const tipoCasa = seiFalso(arvore(COMPLETA));
  await chamar(tipoCasa.sei, { processo: "x", tipo: "Finalístico: Procedimento de Fiscalização (PAF)", fluxos: [FLUXO], ignorados: {} });
  checar("tipo da tela que casa: busca normalmente", tipoCasa.pedidos.length === 1, tipoCasa.pedidos);
  const semTipo = seiFalso(arvore(COMPLETA));
  await chamar(semTipo.sei, { processo: "x", fluxos: [{ ...FLUXO, aplicaSe: { marcador: ["Urgente"] } }], ignorados: {} });
  checar("fluxo sem criterio de tipo: busca, porque nao da para descartar", semTipo.pedidos.length === 1, semTipo.pedidos);

  const quebrado = { arvore: async () => { throw new Error("SEI_NAO_ENCONTRADO"); } } as unknown as Sei;
  checar("erro ao buscar a arvore volta como erro", (await lanca(() => chamar(quebrado, { processo: "x", fluxos: [FLUXO], ignorados: {} }))) !== null);
}
