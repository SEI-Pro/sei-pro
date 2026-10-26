/**
 * Os cards da faixa do alto da capa (opção A da spec). Dois tipos:
 *  - da árvore: instantâneos, só contam o que o quadro da árvore já tem na tela (documentos, internos x externos,
 *    assinados, cancelados, sigilosos, pastas);
 *  - do histórico: dependem do histórico completo (unidades, tramitações, tempo total, tempo na unidade atual). Sem ele
 *    aparecem tracejados com "Calcular" (`estado: "pendente"`); com ele (cache de 30 min) já vêm calculados.
 * Sem DOM: o desenho está em `capa.ts`.
 */
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import type { Passagem } from "@nucleo/dominio/passagens";
import { resumoDoTempo } from "../gantt/comparativo";
import { formatarData, formatarDuracao, pessoa } from "../gantt/modelo";
import { type Parado, passagemNaUnidade } from "./parado";
import { type Estimativa, estimarDocumentos, textoDaEstimativa } from "./estimativa";
import { lerDaTela, type LeituraDaTela } from "./pastas";
import type { ContagemDocumentos } from "./resumo";
import { type TamanhoDaPasta, TAMANHO_PADRAO } from "../modelo/tamanhoPasta";

export type IdCard =
  | "documentos"
  | "internosExternos"
  | "assinados"
  | "cancelados"
  | "sigilosos"
  | "pastas"
  | "unidades"
  | "tramitacoes"
  | "tempoTotal"
  | "naUnidade"
  | "geradoPor"
  | "ultimaAssinatura";

export interface Card {
  id: IdCard;
  origem: "arvore" | "historico";
  rotulo: string;
  valor: string;
  detalhe?: string;
  /** `pendente`: tracejado, precisa do histórico ("Calcular"). */
  estado: "pronto" | "pendente";
  /** Destaque de alerta (processo parado). */
  alerta?: boolean;
  /** Botão discreto dentro do card (o "Contar tudo" do card Documentos). */
  acao?: { tipo: "contar" | "parar" | "continuar"; rotulo: string };
  /** Contando as pastas: a barra de progresso fina do card. */
  progresso?: { feito: number; total: number };
}

/** Estado do "Contar tudo" (vem do quadro da árvore, `data-spro-capa-contagem`). */
export type EstadoContagem =
  | { fase: "parada" }
  | { fase: "contando"; feito: number; total: number }
  | { fase: "parou"; restantes: number }
  | { fase: "erro"; mensagem: string };

/** O que a capa sabe das pastas, além do que os nós do HTML dizem. */
export interface ExtraDosCards {
  tela?: LeituraDaTela;
  tamanho?: TamanhoDaPasta;
  contagem?: EstadoContagem;
  /** O quadro da árvore sabe contar tudo? (a ponte real sabe; a capa legada e os testes antigos não) */
  podeContar?: boolean;
}

const plural = (n: number, um: string, varios: string): string => `${n} ${n === 1 ? um : varios}`;

/** Quantas pastas a árvore tem (os nós `PASTA`): o `lerArvore` do núcleo só devolve documentos. */
export function contarPastas(arv: Pick<Arvore, "pagina">): number {
  try {
    return (arv.pagina.html.match(/infraArvoreNo\("PASTA"/g) ?? []).length;
  } catch {
    return 0;
  }
}

/** Pastas (id `PASTAn`) em que a árvore ainda não mostra nenhum documento: o SEI as carrega quando o usuário as abre. */
export function pastasFechadas(arv: Pick<Arvore, "pagina" | "documentos">): string[] {
  try {
    const ids = [...arv.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map((m) => m[1] as string);
    const comDocumento = new Set(arv.documentos.map((d) => d.pasta).filter(Boolean));
    return ids.filter((id) => !comDocumento.has(id));
  } catch {
    return [];
  }
}

export function pastasSemDocumentos(arv: Pick<Arvore, "pagina" | "documentos">): number {
  return pastasFechadas(arv).length;
}

export function contagemDe(docs: readonly DocumentoArvore[]): ContagemDocumentos {
  return {
    total: docs.length,
    internos: docs.filter((d) => !d.externo).length,
    externos: docs.filter((d) => d.externo).length,
    assinados: docs.filter((d) => d.assinado).length,
    cancelados: docs.filter((d) => d.cancelado).length,
  };
}

export function contagemDaArvore(arv: Pick<Arvore, "documentos">): ContagemDocumentos {
  return contagemDe(arv.documentos);
}

const NAS_ABERTAS = "nas pastas abertas";

/** O card Documentos: o total (exato ou estimado), a conta em uma frase e o "Contar tudo". */
function cardDocumentos(est: Estimativa, extra: ExtraDosCards): Card {
  const t = textoDaEstimativa(est);
  const card: Card = { id: "documentos", origem: "arvore", rotulo: "Documentos", valor: t.valor, estado: "pronto" };
  const c = extra.contagem ?? { fase: "parada" };
  if (est.exato) {
    if (t.detalhe) card.detalhe = t.detalhe;
    return card;
  }
  if (c.fase === "contando") {
    card.detalhe = c.total > 0 ? `contando as pastas: ${c.feito} de ${c.total}` : "contando as pastas...";
    card.acao = { tipo: "parar", rotulo: "Parar" };
    if (c.total > 0) card.progresso = { feito: c.feito, total: c.total };
    return card;
  }
  const frase = [t.detalhe];
  if (c.fase === "parou") frase.push(`parou: ${c.restantes === 1 ? "1 pasta" : `${c.restantes} pastas`} sem contar`);
  if (c.fase === "erro") frase.push(c.mensagem);
  card.detalhe = frase.filter(Boolean).join(". ");
  if (extra.podeContar)
    card.acao = {
      tipo: c.fase === "parou" ? "continuar" : "contar",
      rotulo: c.fase === "parou" ? "Continuar" : c.fase === "erro" ? "Tentar de novo" : "Contar tudo",
    };
  return card;
}

/**
 * Cards que só dependem da árvore que o quadro já tem. Com pastas por carregar, só o card Documentos tem o total (estimado,
 * com o "≈"); os demais mostram o que as pastas abertas têm e dizem isso, nunca apresentam o parcial como o total.
 */
export function cardsDaArvore(arv: Pick<Arvore, "documentos" | "pagina">, extra: ExtraDosCards = {}): Card[] {
  const tela = extra.tela ?? lerDaTela(null, arv as Arvore);
  const tamanho = extra.tamanho ?? { valor: TAMANHO_PADRAO, origem: "padrao" as const };
  const docs = tela.documentos;
  const est = estimarDocumentos(tela.pastas, docs.length, tamanho);
  const parcial = !est.exato;
  const c = contagemDe(docs);
  const sigilosos = docs.filter((d) => d.nivel === "sigiloso").length;
  const restritos = docs.filter((d) => d.nivel === "restrito").length;
  const detalheSigilosos = [restritos ? plural(restritos, "restrito", "restritos") : "", parcial ? NAS_ABERTAS : ""]
    .filter(Boolean)
    .join(", ");
  return [
    cardDocumentos(est, extra),
    {
      id: "internosExternos",
      origem: "arvore",
      rotulo: "Internos e externos",
      valor: `${c.internos} / ${c.externos}`,
      detalhe: parcial ? NAS_ABERTAS : "gerados no SEI / anexados",
      estado: "pronto",
    },
    {
      id: "assinados",
      origem: "arvore",
      rotulo: "Assinados",
      valor: `${c.assinados} de ${c.total}`,
      ...(parcial ? { detalhe: NAS_ABERTAS } : c.total ? { detalhe: `${Math.round((c.assinados / c.total) * 100)}% do processo` } : {}),
      estado: "pronto",
    },
    {
      id: "cancelados",
      origem: "arvore",
      rotulo: "Cancelados",
      valor: String(c.cancelados),
      ...(parcial ? { detalhe: NAS_ABERTAS } : {}),
      estado: "pronto",
    },
    {
      id: "sigilosos",
      origem: "arvore",
      rotulo: "Sigilosos",
      valor: String(sigilosos),
      ...(detalheSigilosos ? { detalhe: detalheSigilosos } : {}),
      estado: "pronto",
    },
    {
      id: "pastas",
      origem: "arvore",
      rotulo: "Pastas",
      valor: String(tela.pastas.length),
      ...(est.porCarregar ? { detalhe: `${est.porCarregar} por carregar` } : {}),
      estado: "pronto",
    },
  ];
}

export interface EntradaCardsHistorico {
  /** `null` = o histórico não foi coletado (ou venceu): os cards ficam tracejados. */
  passagens: readonly Passagem[] | null;
  /** Sigla da unidade do usuário (o card "Na unidade atual"). */
  unidade: string;
  /** Há quanto tempo parado, e se passou do limite (`alerta`). */
  parado: Parado | null;
  alerta: boolean;
  limite: number;
}

const PENDENTES: ReadonlyArray<{ id: IdCard; rotulo: string }> = [
  { id: "unidades", rotulo: "Unidades por onde passou" },
  { id: "tramitacoes", rotulo: "Tramitações" },
  { id: "tempoTotal", rotulo: "Tempo total" },
  { id: "naUnidade", rotulo: "Na unidade atual" },
];

/**
 * Cards do histórico. Sem passagens: quatro cards `pendente` (tracejados). Com elas: unidades, tramitações, tempo total
 * e tempo na unidade atual (com o alerta de parado) e, quando o histórico diz, quem gerou o processo e a última assinatura.
 */
export function cardsDoHistorico(e: EntradaCardsHistorico): Card[] {
  if (!e.passagens) {
    return PENDENTES.map((p): Card => {
      // Sem o histórico, o "Na unidade atual" ainda sai da data de recebimento que o legado guardou (só leitura).
      if (p.id === "naUnidade" && e.parado?.origem === "recebimento") {
        const dias = e.parado.dias;
        return {
          id: p.id,
          origem: "historico",
          rotulo: p.rotulo,
          valor: dias === 0 ? "hoje" : `${dias} d`,
          detalhe: e.alerta ? `parado há ${plural(dias, "dia", "dias")} (limite: ${e.limite})` : `desde ${formatarData(e.parado.desde)}`,
          estado: "pronto",
          ...(e.alerta ? { alerta: true } : {}),
        };
      }
      return { id: p.id, origem: "historico", rotulo: p.rotulo, valor: "—", estado: "pendente" };
    });
  }
  const ps = e.passagens;
  const resumo = resumoDoTempo(ps);
  const tramitacoes = ps.filter((p) => p.fim === "remessa" || p.mantidoAberto).length;
  const naUnidade = passagemNaUnidade(ps, e.unidade);
  const cards: Card[] = [
    { id: "unidades", origem: "historico", rotulo: "Unidades por onde passou", valor: String(resumo.unidades), estado: "pronto" },
    { id: "tramitacoes", origem: "historico", rotulo: "Tramitações", valor: String(tramitacoes), estado: "pronto" },
    {
      id: "tempoTotal",
      origem: "historico",
      rotulo: "Tempo total",
      valor: ps.length ? formatarDuracao(resumo.corridoMs) : "—",
      ...(ps.length ? { detalhe: `desde ${formatarData(new Date(Math.min(...ps.map((p) => p.recebido.getTime()))))}` } : {}),
      estado: "pronto",
    },
    naUnidade
      ? {
          id: "naUnidade",
          origem: "historico",
          rotulo: "Na unidade atual",
          valor: formatarDuracao(naUnidade.duracaoMs),
          detalhe: e.alerta
            ? `parado há ${plural(e.parado?.dias ?? 0, "dia", "dias")} (limite: ${e.limite})`
            : naUnidade.pendenteRecebimento
              ? `aguardando abrir desde ${formatarData(naUnidade.recebido)}`
              : `desde ${formatarData(naUnidade.recebido)}`,
          estado: "pronto",
          ...(e.alerta ? { alerta: true } : {}),
        }
      : {
          id: "naUnidade",
          origem: "historico",
          rotulo: "Na unidade atual",
          valor: "—",
          detalhe: "o processo não está aberto aqui",
          estado: "pronto",
        },
  ];
  const gerado = ps.find((p) => p.inicio === "gerado");
  const quem = gerado ? pessoa(gerado.usuarioRecebeu, gerado.usuarioRecebeuNome) : "";
  if (gerado && quem) {
    cards.push({
      id: "geradoPor",
      origem: "historico",
      rotulo: "Gerado por",
      valor: gerado.usuarioRecebeuNome ?? gerado.usuarioRecebeu ?? "",
      detalhe: `${gerado.unidade}, ${formatarData(gerado.recebido)}`,
      estado: "pronto",
    });
  }
  const assinaturas = ps.flatMap((p) => p.assinaturas);
  if (assinaturas.length) {
    const ultima = assinaturas.reduce((a, b) => (b.em.getTime() >= a.em.getTime() ? b : a));
    cards.push({
      id: "ultimaAssinatura",
      origem: "historico",
      rotulo: "Última assinatura",
      valor: ultima.usuario ?? "",
      detalhe: `${ultima.nrSei ? `SEI ${ultima.nrSei}, ` : ""}${formatarData(ultima.em)}`,
      estado: "pronto",
    });
  }
  return cards;
}
