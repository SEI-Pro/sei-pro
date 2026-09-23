/**
 * Estúdio de Fluxo: avaliação do fluxo contra a árvore do processo.
 *
 * É o coração da funcionalidade, e é 100% local: nada aqui fala com o SEI nem
 * com modelo de IA. A ordem da árvore é CRONOLÓGICA, então "veio depois" é
 * posição, não data — e é isso que precisa estar certo: um Despacho que já
 * estava lá ANTES da Nota Técnica não cumpre a etapa que vem depois dela.
 */

import { avaliarFluxo, escolherSugestao, type DocumentoNaArvore, type ProcessoNaTela } from "../src/fluxos/avaliar";
import { processoParaFluxo } from "../src/ponte/operacoes";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import { etapaNova, fluxoNovo, type Etapa, type Fluxo } from "../src/fluxos/modelo";
import { checar, secao } from "./util";

let n = 0;
const doc = (titulo: string, d: Partial<DocumentoNaArvore> = {}): DocumentoNaArvore => ({
  numero: String(100000 + (n += 1)),
  titulo,
  assinado: true,
  ...d,
});

const etapa = (nome: string, e: Partial<Etapa> = {}): Etapa => ({ ...etapaNova(nome), id: nome.toLowerCase().replace(/\W/g, ""), ...e });

const NT = etapa("Nota Técnica", { documento: { tituloContem: ["Nota Técnica", "NT"], assinado: true } });
const DESPACHO = etapa("Despacho de aprovação", { documento: { tituloContem: ["Despacho"] } });
const OFICIO = etapa("Ofício", { documento: { tituloContem: ["Ofício"] } });

const fluxo = (f: Partial<Fluxo> = {}): Fluxo => ({ ...fluxoNovo("Contrato de transição"), ativo: true, etapas: [NT, DESPACHO, OFICIO], ...f });

const processo = (documentos: DocumentoNaArvore[], p: Partial<ProcessoNaTela> = {}): ProcessoNaTela => ({
  protocolo: "12345.000001/2026-11",
  tipo: "Contratação Direta",
  marcadores: [],
  unidade: "GESP-TESTE",
  documentos,
  ...p,
});

export function verificarAvaliarFluxo(): void {
  secao("avaliar: a que processo o fluxo se aplica");
  const soContratacao = fluxo({ aplicaSe: { tipoProcessoContem: ["Contratação"] } });
  checar("tipo que casa aplica", avaliarFluxo(soContratacao, processo([])).aplica);
  checar("tipo sem acento e sem caixa também casa", avaliarFluxo(fluxo({ aplicaSe: { tipoProcessoContem: ["contratacao direta"] } }), processo([])).aplica);
  checar("tipo diferente não aplica", avaliarFluxo(soContratacao, processo([], { tipo: "Gestão de Pessoal" })).aplica === false);
  checar("sem critério nenhum, aplica a qualquer processo", avaliarFluxo(fluxo(), processo([])).aplica);

  const comMarcador = fluxo({ aplicaSe: { marcador: ["Urgente"] } });
  checar("marcador que casa aplica", avaliarFluxo(comMarcador, processo([], { marcadores: ["urgente"] })).aplica);
  checar("marcador ausente não aplica", avaliarFluxo(comMarcador, processo([], { marcadores: ["Arquivar"] })).aplica === false);

  const daUnidade = fluxo({ aplicaSe: { unidade: ["GESP-TESTE"] } });
  checar("unidade que casa aplica", avaliarFluxo(daUnidade, processo([])).aplica);
  checar("outra unidade não aplica", avaliarFluxo(daUnidade, processo([], { unidade: "OUTRA" })).aplica === false);
  checar("um critério errado já tira o fluxo", avaliarFluxo(fluxo({ aplicaSe: { tipoProcessoContem: ["Contratação"], unidade: ["OUTRA"] } }), processo([])).aplica === false);

  secao("avaliar: etapa cumprida");
  const cheio = avaliarFluxo(fluxo(), processo([doc("Nota Técnica 55"), doc("Despacho"), doc("Ofício 12")]));
  checar("fluxo inteiro percorrido tem três cumpridas", cheio.cumpridas.length === 3, cheio.cumpridas.map((c) => c.etapa.nome));
  checar("fluxo inteiro percorrido não tem lacuna", cheio.lacuna === null);
  checar("a etapa atual é a última cumprida", cheio.etapaAtual?.id === OFICIO.id);
  checar("a variante do título casa (NT)", avaliarFluxo(fluxo({ etapas: [NT] }), processo([doc("NT 3")])).cumpridas.length === 1);
  checar("documento sem assinatura não cumpre etapa que exige assinado", avaliarFluxo(fluxo({ etapas: [NT] }), processo([doc("Nota Técnica 55", { assinado: false })])).cumpridas.length === 0);
  checar("documento cancelado não cumpre etapa", avaliarFluxo(fluxo({ etapas: [NT] }), processo([doc("Nota Técnica 55", { cancelado: true })])).cumpridas.length === 0);

  const daMinha = etapa("Despacho local", { documento: { tituloContem: ["Despacho"], daMinhaUnidade: true } });
  checar("daMinhaUnidade casa o que a unidade gerou", avaliarFluxo(fluxo({ etapas: [daMinha] }), processo([doc("Despacho", { unidade: "GESP-TESTE" })])).cumpridas.length === 1);
  checar("daMinhaUnidade recusa documento de outra unidade", avaliarFluxo(fluxo({ etapas: [daMinha] }), processo([doc("Despacho", { unidade: "OUTRA" })])).cumpridas.length === 0);

  secao("avaliar: a ordem da arvore e cronologica");
  const despachoAntes = avaliarFluxo(fluxo({ etapas: [NT, DESPACHO] }), processo([doc("Despacho de encaminhamento"), doc("Nota Técnica 55")]));
  checar("despacho anterior a NT nao cumpre a etapa que vem depois dela", despachoAntes.cumpridas.length === 1, despachoAntes.cumpridas.map((c) => c.etapa.nome));
  checar("e a lacuna e o despacho que falta DEPOIS da NT", despachoAntes.lacuna?.etapa.id === DESPACHO.id);
  const depois = avaliarFluxo(fluxo({ etapas: [NT, DESPACHO] }), processo([doc("Despacho de encaminhamento"), doc("Nota Técnica 55"), doc("Despacho de aprovação")]));
  checar("com um despacho depois da NT, a etapa se cumpre", depois.cumpridas.length === 2 && depois.lacuna === null);

  secao("avaliar: a lacuna");
  const falta = avaliarFluxo(fluxo(), processo([doc("Nota Técnica 55")]));
  checar("a lacuna é a primeira obrigatória não cumprida", falta.lacuna?.etapa.id === DESPACHO.id);
  checar("a lacuna diz qual documento veio antes", falta.lacuna?.anterior.titulo === "Nota Técnica 55");
  checar("a lacuna diz de que etapa era esse documento", falta.lacuna?.etapaAnterior.id === NT.id);
  checar("só uma lacuna por processo", falta.cumpridas.length === 1 && falta.lacuna !== null);

  // Sem nada cumprido não há "o que foi encontrado" para mostrar no cartão: um
  // processo que nem começou o rito não rende sugestão.
  checar("processo vazio não gera lacuna", avaliarFluxo(fluxo(), processo([])).lacuna === null);
  checar("processo vazio também não tem etapa atual", avaliarFluxo(fluxo(), processo([])).etapaAtual === null);

  const opcional = etapa("Parecer", { documento: { tituloContem: ["Parecer"] }, obrigatoria: false });
  const comOpcional = avaliarFluxo(fluxo({ etapas: [NT, opcional, OFICIO] }), processo([doc("Nota Técnica 55")]));
  checar("etapa opcional não cumprida não gera lacuna", comOpcional.lacuna?.etapa.id === OFICIO.id, comOpcional.lacuna?.etapa.nome);
  checar("e a etapa anterior da lacuna é a que de fato veio antes", comOpcional.lacuna?.etapaAnterior.id === NT.id);

  secao("avaliar: desvio");
  const naoAprovado = etapa("Ofício de diligência", {
    documento: { tituloContem: ["Ofício"] },
    condicao: { seDocumentoContem: "aprova", entaoIrPara: "arquivamento" },
  });
  const arquivamento = etapa("Arquivamento", { id: "arquivamento", documento: { tituloContem: ["Termo de Encerramento"] } });
  const comDesvio = fluxo({ etapas: [NT, DESPACHO, naoAprovado, arquivamento] });
  const desviou = avaliarFluxo(comDesvio, processo([doc("Nota Técnica 55"), doc("Despacho de aprovação")]));
  checar("o desvio troca a etapa cobrada quando o documento anterior casa", desviou.lacuna?.etapa.id === "arquivamento", desviou.lacuna?.etapa.nome);
  const naoDesviou = avaliarFluxo(comDesvio, processo([doc("Nota Técnica 55"), doc("Despacho de diligência")]));
  checar("sem casar a condição, segue a etapa normal", naoDesviou.lacuna?.etapa.id === naoAprovado.id, naoDesviou.lacuna?.etapa.nome);

  // Um desvio que volta para trás travaria o percurso num laço infinito.
  const circular = fluxo({
    etapas: [
      etapa("A", { id: "a", documento: { tituloContem: ["Nota"] } }),
      etapa("B", { id: "b", documento: { tituloContem: ["Zzz"] }, condicao: { seDocumentoContem: "nota", entaoIrPara: "c" } }),
      etapa("C", { id: "c", documento: { tituloContem: ["Zzz"] }, condicao: { seDocumentoContem: "nota", entaoIrPara: "b" } }),
    ],
  });
  checar("desvio circular não trava", avaliarFluxo(circular, processo([doc("Nota Técnica")])).cumpridas.length === 1);

  secao("avaliar: escolher a sugestao do processo aberto");
  const ativo = fluxo({ id: "f1", aplicaSe: { tipoProcessoContem: ["Contratação"] } });
  const outro = fluxo({ id: "f2", nome: "Outro", aplicaSe: { tipoProcessoContem: ["Gestão"] } });
  const aberto = processo([doc("Nota Técnica 55")]);
  checar("escolhe o primeiro fluxo ativo que se aplica", escolherSugestao([outro, ativo], aberto, {})?.fluxo.id === "f1");
  checar("fluxo desligado não sugere", escolherSugestao([{ ...ativo, ativo: false }], aberto, {}) === null);
  checar("fluxo que não se aplica não sugere", escolherSugestao([outro], aberto, {}) === null);
  checar("fluxo sem lacuna não sugere", escolherSugestao([ativo], processo([doc("Nota Técnica"), doc("Despacho"), doc("Ofício")]), {}) === null);
  const ignorados = { "12345.000001/2026-11": [{ etapaId: DESPACHO.id, quando: 1 }] };
  checar("etapa ignorada naquele processo não sugere", escolherSugestao([ativo], aberto, ignorados) === null);
  checar("ignorada em OUTRO processo não atrapalha", escolherSugestao([ativo], { ...aberto, protocolo: "12345.000009/2026-99" }, ignorados) !== null);
  checar("processo sigiloso nunca sugere", escolherSugestao([ativo], { ...aberto, sigiloso: true }, {}) === null);
  const escolhida = escolherSugestao([ativo], aberto, {});
  checar("a sugestão vem com a avaliação inteira", escolhida?.avaliacao.cumpridas.length === 1 && escolhida?.avaliacao.lacuna?.etapa.id === DESPACHO.id);
}

/**
 * A árvore do `sei-nucleo` vira o processo que a avaliação entende.
 *
 * Roda no content script, sobre a árvore que já está na tela: é a conversão que
 * decide o que a avaliação enxerga, então é aqui que um documento sigiloso pode
 * vazar título por engano — e é aqui que a ordem da árvore se preserva.
 */
export function verificarProcessoDaArvore(): void {
  const doc = (d: Partial<DocumentoArvore>): DocumentoArvore => ({
    id: "1",
    numero: "0100001",
    titulo: "Nota Técnica 55",
    pasta: null,
    externo: false,
    formato: "interno",
    nivel: "publico",
    assinado: true,
    assinaturas: [],
    cancelado: false,
    link: "",
    src: "",
    acoes: [],
    botoes: [],
    ...d,
  });
  const arvore = (docs: DocumentoArvore[], a: Partial<Arvore> = {}): Arvore =>
    ({
      idProcedimento: "9",
      protocolo: "12345.000001/2026-11",
      tipo: "Contratação Direta",
      nivel: "publico",
      marcadores: ["Urgente"],
      documentos: docs,
      acoesProcesso: [],
      botoesProcesso: [],
      linkProcesso: "",
      sinais: [],
      links: [],
      pagina: { url: "", status: 200, html: "", doc: null as unknown as Document },
      ...a,
    }) as Arvore;

  secao("avaliar: a arvore do nucleo vira processo avaliavel");
  const p = processoParaFluxo(arvore([doc({ numero: "0100001", unidadeGeradora: "GESP" })]), "GESP-TESTE");
  checar("leva protocolo, tipo e marcadores", p.protocolo === "12345.000001/2026-11" && p.tipo === "Contratação Direta" && p.marcadores?.[0] === "Urgente");
  checar("a unidade é a da TELA, não a do documento", p.unidade === "GESP-TESTE");
  checar("o documento leva a unidade geradora", p.documentos[0].unidade === "GESP");
  checar("processo público não vem marcado como sigiloso", p.sigiloso !== true);
  checar("processo sigiloso vem marcado", processoParaFluxo(arvore([], { nivel: "sigiloso" })).sigiloso === true);

  // O documento sigiloso não some da lista: sumir deslocaria a cronologia e uma
  // etapa passaria a casar com documento que veio antes dele.
  const comSigiloso = processoParaFluxo(arvore([doc({ numero: "0100001", nivel: "sigiloso" }), doc({ numero: "0100002", titulo: "Despacho" })]));
  checar("documento sigiloso guarda o lugar na ordem", comSigiloso.documentos.length === 2);
  checar("mas nao entrega o titulo", comSigiloso.documentos[0].titulo === "");
  checar("e nunca cumpre etapa nenhuma", avaliarFluxo(fluxo({ etapas: [NT] }), comSigiloso).cumpridas.length === 0);

  const links = processoParaFluxo(arvore([doc({})]));
  checar("nada de link assinado do SEI atravessa", !JSON.stringify(links).includes("infra_hash") && !("link" in links.documentos[0]));
}
