/**
 * A "vista" da capa: tudo o que a capa mostra, já decidido e sem DOM. Junta a árvore (instantânea), as fatias que o
 * quadro da árvore guardou no cache (dadosProcesso, marcador, blocoInterno, atribuição) e o histórico completo, quando
 * existe. `capa.ts` só desenha o que está aqui; o `controle.ts` só decide quando.
 */
import type { NomeIcone } from "@comum/ui/dom";
import type { Arvore, NivelAcesso } from "@nucleo/dominio/arvore";
import type { Passagem } from "@nucleo/dominio/passagens";
import type { DadoAtribuicao, DadoBlocoInterno, DadoMarcador, DadoProcesso } from "../modelo/dados";
import {
  dataBrasileira,
  type NivelPrazo,
  observacoesVisiveis,
  prazoNativoDaPagina,
  separarTextoMarcador,
  situacaoDoPrazo,
  temMarca,
} from "../modelo/texto";
import { marcadoresDaArvore } from "../pagina/leituras";
import { type Card, cardsDaArvore, cardsDoHistorico, contagemDaArvore } from "./cards";
import { diasParado, estaParado, type Parado } from "./parado";
import type { ContagemDocumentos, DadosDoResumo } from "./resumo";

/** O que o quadro da árvore já guardou no cache do processo (a capa só lê). */
export interface FatiasLidas {
  dadosProcesso?: DadoProcesso;
  marcador?: DadoMarcador;
  blocoInterno?: DadoBlocoInterno;
  atribuicao?: DadoAtribuicao;
}

/** Estado da coleta do histórico completo, vindo do quadro da árvore (`data-spro-capa-coleta`). */
export type EstadoColeta = { fase: "parada" } | { fase: "coletando"; feito: number; total: number } | { fase: "erro"; mensagem: string };

export interface EntradaVista {
  arv: Arvore;
  fatias: FatiasLidas;
  /** O histórico completo, só se ainda vale (30 min). */
  passagens: readonly Passagem[] | null;
  unidade: string;
  agora: Date;
  /** Dias sem sair da unidade para alertar; 0 desliga. */
  limite: number;
  /** Data de recebimento guardada pelo legado, para o alerta antes do histórico. */
  recebidoEm: Date | null;
  coleta: EstadoColeta;
  /** O quadro da árvore ainda não respondeu às fatias (esqueleto) ou já desistiu (indisponível). */
  espera: "aguardando" | "desistiu";
  /** Link permanente do processo (QR e "copiar link"). */
  linkPermanente: string;
}

export interface VistaMarcador {
  nome: string;
  texto: string;
  icone: string;
  prazo?: { rotulo: string; nivel: NivelPrazo };
}

export type SituacaoDados = "pronto" | "carregando" | "indisponivel" | "consultas" | "fechado";

export interface VistaCapa {
  idProcedimento: string;
  protocolo: string;
  sigiloso: boolean;
  linkPermanente: string;
  cards: Card[];
  coleta: EstadoColeta;
  tipo: string;
  nivel: { rotulo: string; icone: NomeIcone };
  /** Estado dos campos que vêm do formulário do processo (autuação, especificação, assuntos, interessados, observações). */
  dados: SituacaoDados;
  autuacao?: string;
  especificacao?: string;
  urgente: boolean;
  assuntos: string[];
  interessados: string[];
  observacoes: Array<{ unidade: string; observacao: string }>;
  marcadores: VistaMarcador[];
  prazoNativo?: { data: string; estado: string; nivel: string };
  blocoInterno?: string;
  parado: Parado | null;
  alerta: boolean;
  resumo: DadosDoResumo;
}

const ROTULO_NIVEL: Record<NivelAcesso, string> = { publico: "Público", restrito: "Restrito", sigiloso: "Sigiloso" };
const ICONE_NIVEL: Record<NivelAcesso, NomeIcone> = { publico: "olho", restrito: "cadeado", sigiloso: "cadeado" };

function nivelDe(nivel: NivelAcesso, hipotese?: string): VistaCapa["nivel"] {
  const base = ROTULO_NIVEL[nivel];
  return { rotulo: nivel === "restrito" && hipotese ? `${base}: ${hipotese}` : base, icone: ICONE_NIVEL[nivel] };
}

export function montarVista(e: EntradaVista): VistaCapa {
  const { arv, fatias } = e;
  const sigiloso = arv.nivel === "sigiloso";
  const contagem: ContagemDocumentos = contagemDaArvore(arv);
  const parado = sigiloso ? null : diasParado({ passagens: e.passagens, sigla: e.unidade, recebidoEm: e.recebidoEm }, e.agora);
  const alerta = estaParado(parado, e.limite);
  const cardsArvore = cardsDaArvore(arv);
  const cardsHistorico = sigiloso ? [] : cardsDoHistorico({ passagens: e.passagens, unidade: e.unidade, parado, alerta, limite: e.limite });

  const base: Pick<VistaCapa, "idProcedimento" | "protocolo" | "sigiloso" | "linkPermanente" | "cards" | "coleta" | "parado" | "alerta"> = {
    idProcedimento: arv.idProcedimento,
    protocolo: arv.protocolo,
    sigiloso,
    linkPermanente: e.linkPermanente,
    cards: [...cardsArvore, ...cardsHistorico],
    coleta: e.coleta,
    parado,
    alerta,
  };

  // Marcadores: os da árvore na hora; os do cache (com ícone e texto) quando o quadro da árvore os leu.
  const itens = fatias.marcador?.itens ?? marcadoresDaArvore(arv);
  const marcadores: VistaMarcador[] = sigiloso
    ? []
    : itens.map((m) => {
        const { prazo, texto } = separarTextoMarcador(m.texto);
        const s = prazo ? situacaoDoPrazo(prazo, e.agora) : null;
        return {
          nome: m.nome,
          texto,
          icone: m.icone,
          ...(prazo && s
            ? { prazo: { rotulo: `${prazo.vencimento ? "até " : ""}${dataBrasileira(prazo)} · ${s.rotulo}`, nivel: s.nivel } }
            : {}),
        };
      });
  const nativo = sigiloso ? null : prazoNativoDaPagina(arv.pagina.html);

  const lido = fatias.dadosProcesso;
  // Sigiloso: nada do formulario entra, nem do cache (a spec 8.1 manda nao guardar nem mostrar).
  const meta = !sigiloso && lido?.disponivel ? lido.valor : null;
  let dados: SituacaoDados;
  if (sigiloso) dados = "pronto";
  else if (meta) dados = "pronto";
  else if (lido && !lido.disponivel) dados = lido.motivo === "consultas" ? "consultas" : "fechado";
  else dados = e.espera === "desistiu" ? "indisponivel" : "carregando";

  const nivel = meta ? nivelDe(meta.nivel, meta.hipotese) : nivelDe(arv.nivel, arv.hipotese);
  const interessados = sigiloso ? [] : (meta?.interessados ?? []);
  const especificacao = sigiloso ? undefined : meta?.especificacao;
  const observacoes = sigiloso || !meta ? [] : observacoesVisiveis(meta.observacoes, e.unidade, meta.observacoesOutras);
  const bloco = sigiloso ? null : fatias.blocoInterno;
  const blocoInterno = bloco?.descricao ? bloco.descricao : undefined;

  const resumo: DadosDoResumo = {
    protocolo: arv.protocolo,
    sigiloso,
    tipo: meta?.tipo || arv.tipo,
    interessados,
    ...(fatias.atribuicao?.texto ? { situacao: fatias.atribuicao.texto } : {}),
    unidade: e.unidade,
    diasNaUnidade: parado ? parado.dias : null,
    documentos: contagem,
  };

  return {
    ...base,
    tipo: meta?.tipo || arv.tipo,
    nivel,
    dados,
    ...(meta?.autuacao ? { autuacao: meta.autuacao } : {}),
    ...(especificacao ? { especificacao } : {}),
    urgente: especificacao ? temMarca(especificacao, "URGENTE") : false,
    assuntos: sigiloso ? [] : (meta?.assuntos ?? []),
    interessados,
    observacoes,
    marcadores,
    ...(nativo ? { prazoNativo: nativo } : {}),
    ...(blocoInterno ? { blocoInterno } : {}),
    resumo,
  };
}

/** Assinatura do que a capa mostra: duas vistas com a mesma assinatura não pedem redesenho. */
export function assinaturaDaVista(v: VistaCapa): string {
  return JSON.stringify(v);
}
