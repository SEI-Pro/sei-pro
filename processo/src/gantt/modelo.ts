/**
 * Modelo do Gantt, sem DOM: agrupamento em raias, escala e geometria, eixo de tempo, formatação de datas e durações e o
 * texto das dicas. As passagens vêm de `calcularPassagens` (núcleo): as datas são o relógio do SEI escrito como UTC,
 * então toda conta de calendário aqui usa os campos UTC (sem fuso, sem horário de verão).
 */
import type { DocumentoDaPassagem, Passagem } from "@nucleo/dominio/passagens";

export const DIA_MS = 86_400_000;

export type Escala = "dia" | "semana" | "mes";

export const ESCALAS: ReadonlyArray<{ id: Escala; rotulo: string; pxPorDia: number }> = [
  { id: "dia", rotulo: "Dia", pxPorDia: 28 },
  { id: "semana", rotulo: "Semana", pxPorDia: 9 },
  { id: "mes", rotulo: "Mês", pxPorDia: 2.2 },
];

/** Largura máxima do desenho (px): um processo de muitos anos na escala Dia seria um SVG enorme. */
export const LARGURA_MAXIMA = 30_000;

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const dois = (n: number): string => String(n).padStart(2, "0");

export const pxPorDiaDe = (escala: Escala): number => ESCALAS.find((e) => e.id === escala)?.pxPorDia ?? 2.2;

/** "dd/mm/aaaa" do relógio do SEI. */
export const formatarData = (d: Date): string => `${dois(d.getUTCDate())}/${dois(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;

/** "dd/mm/aaaa hh:mm" do relógio do SEI. */
export const formatarDataHora = (d: Date): string => `${formatarData(d)} ${dois(d.getUTCHours())}:${dois(d.getUTCMinutes())}`;

/** "menos de 1 min", "35 min", "4 h 12 min", "3 d 4 h", "128 d". */
export function formatarDuracao(ms: number): string {
  const min = Math.round(Math.max(0, ms) / 60_000);
  if (min < 1) return "menos de 1 min";
  if (min < 60) return `${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  if (horas < 24) return resto ? `${horas} h ${resto} min` : `${horas} h`;
  const dias = Math.floor(horas / 24);
  const h = horas % 24;
  if (dias < 30 && h) return `${dias} d ${h} h`;
  return `${dias} d`;
}

/** Dias com uma casa (arredondada), como número. */
export const diasDe = (ms: number): number => Math.round((Math.max(0, ms) / DIA_MS) * 10) / 10;

/** Número em português: vírgula decimal, sem zeros desnecessários ("3,5", "12"). */
export const numeroBR = (n: number): string => String(n).replace(".", ",");

export const fimDaPassagem = (p: Passagem): number => p.recebido.getTime() + p.duracaoMs;

export const pessoa = (login?: string, nome?: string): string => (nome && login ? `${nome} (${login})` : (nome ?? login ?? ""));

// --- Raias ---------------------------------------------------------------------------------------------------

export interface Raia {
  chave: string;
  /** "GPF" ou "GPF 3x" (3 passagens). */
  rotulo: string;
  sigla: string;
  nome?: string;
  passagens: Passagem[];
}

export const rotuloDaRaia = (sigla: string, n: number): string => (n > 1 ? `${sigla} ${n}x` : sigla);

/** Uma raia por unidade (chave), na ordem da primeira entrada. */
export function agruparRaias(passagens: readonly Passagem[]): Raia[] {
  const porChave = new Map<string, Raia>();
  const ordenadas = [...passagens].sort((a, b) => a.recebido.getTime() - b.recebido.getTime());
  for (const p of ordenadas) {
    let r = porChave.get(p.chave);
    if (!r) {
      r = { chave: p.chave, rotulo: "", sigla: p.unidade, ...(p.unidadeNome ? { nome: p.unidadeNome } : {}), passagens: [] };
      porChave.set(p.chave, r);
    }
    r.passagens.push(p);
  }
  const raias = [...porChave.values()];
  for (const r of raias) r.rotulo = rotuloDaRaia(r.sigla, r.passagens.length);
  return raias;
}

// --- Geometria -----------------------------------------------------------------------------------------------

export interface Geometria {
  escala: Escala;
  pxPorDia: number;
  /** Início do desenho (ms, começo de um dia). */
  origem: number;
  /** Fim do desenho (ms). */
  fim: number;
  /** Largura da área de tempo (px). */
  largura: number;
  x(ms: number): number;
}

const inicioDoDia = (ms: number): number => Math.floor(ms / DIA_MS) * DIA_MS;

export interface OpcoesGeometria {
  /** Sobrescreve os px por dia da escala (impressão: cabe tudo na largura da folha). */
  pxPorDia?: number;
  /** Relógio de hoje (como as passagens): estende o desenho até ele quando alguma passagem está em curso. */
  agora?: Date;
}

export function criarGeometria(passagens: readonly Passagem[], escala: Escala, o: OpcoesGeometria = {}): Geometria {
  let menor = Number.POSITIVE_INFINITY;
  let maior = Number.NEGATIVE_INFINITY;
  for (const p of passagens) {
    menor = Math.min(menor, p.recebido.getTime());
    maior = Math.max(maior, fimDaPassagem(p), ...p.documentos.map((d) => d.em.getTime()));
  }
  if (!Number.isFinite(menor)) {
    const hoje = o.agora?.getTime() ?? 0;
    menor = hoje;
    maior = hoje;
  }
  if (o.agora && passagens.some((p) => p.emCurso)) maior = Math.max(maior, o.agora.getTime());
  const origem = inicioDoDia(menor);
  const fim = inicioDoDia(maior) + DIA_MS;
  const dias = Math.max(1, (fim - origem) / DIA_MS);
  const base = o.pxPorDia ?? pxPorDiaDe(escala);
  const pxPorDia = Math.min(base, LARGURA_MAXIMA / dias);
  return { escala, pxPorDia, origem, fim, largura: dias * pxPorDia, x: (ms) => ((ms - origem) / DIA_MS) * pxPorDia };
}

/** A menor escala (mais detalhada) cujo desenho cabe em `largura` px; se nenhuma cabe, Mês. */
export function escalaPadrao(passagens: readonly Passagem[], largura = 1000): Escala {
  for (const e of ESCALAS) {
    if (criarGeometria(passagens, e.id).largura <= largura) return e.id;
  }
  return "mes";
}

export interface Marca {
  x: number;
  largura: number;
  rotulo: string;
}

/** Eixo em duas faixas: a de cima agrupa (mês/ano ou ano), a de baixo marca a unidade da escala (dia, semana, mês). */
export function eixoDoTempo(g: Geometria): { cima: Marca[]; baixo: Marca[] } {
  const cima: Marca[] = [];
  const baixo: Marca[] = [];
  const ate = g.fim;
  const empurrar = (lista: Marca[], de: number, para: number, rotulo: string) => {
    const x = g.x(de);
    lista.push({ x, largura: Math.max(0, g.x(Math.min(para, ate)) - x), rotulo });
  };
  const data = (ms: number) => new Date(ms);

  // Faixa de cima.
  if (g.escala === "mes") {
    for (let ano = data(g.origem).getUTCFullYear(); Date.UTC(ano, 0, 1) < ate; ano++) {
      empurrar(cima, Math.max(Date.UTC(ano, 0, 1), g.origem), Date.UTC(ano + 1, 0, 1), String(ano));
    }
  } else {
    const d0 = data(g.origem);
    for (let ano = d0.getUTCFullYear(), mes = d0.getUTCMonth(); Date.UTC(ano, mes, 1) < ate; ) {
      const ini = Math.max(Date.UTC(ano, mes, 1), g.origem);
      empurrar(cima, ini, Date.UTC(ano, mes + 1, 1), `${MESES_LONGOS[mes]} de ${ano}`);
      mes += 1;
      if (mes > 11) {
        mes = 0;
        ano += 1;
      }
    }
  }

  // Faixa de baixo.
  if (g.escala === "dia") {
    for (let t = g.origem; t < ate; t += DIA_MS) empurrar(baixo, t, t + DIA_MS, String(data(t).getUTCDate()));
  } else if (g.escala === "semana") {
    // Semanas começando na segunda-feira (a primeira marca é a segunda anterior ou igual à origem).
    const d0 = data(g.origem);
    const volta = (d0.getUTCDay() + 6) % 7;
    for (let t = g.origem - volta * DIA_MS; t < ate; t += 7 * DIA_MS) {
      const d = data(t);
      empurrar(baixo, Math.max(t, g.origem), t + 7 * DIA_MS, `${dois(d.getUTCDate())}/${dois(d.getUTCMonth() + 1)}`);
    }
  } else {
    const d0 = data(g.origem);
    for (let ano = d0.getUTCFullYear(), mes = d0.getUTCMonth(); Date.UTC(ano, mes, 1) < ate; ) {
      empurrar(baixo, Math.max(Date.UTC(ano, mes, 1), g.origem), Date.UTC(ano, mes + 1, 1), MESES[mes]);
      mes += 1;
      if (mes > 11) {
        mes = 0;
        ano += 1;
      }
    }
  }
  return { cima, baixo };
}

// --- Texto das dicas -----------------------------------------------------------------------------------------

export interface Dica {
  titulo: string;
  /** Situação da passagem ("Em curso", "Aguardando recebimento"...), em destaque. */
  selo?: string;
  linhas: Array<{ rotulo: string; valor: string }>;
  documentos?: string[];
}

export type SituacaoPassagem = "concluida" | "em-curso" | "pendente" | "mantido-aberto";

export function situacaoDa(p: Passagem): SituacaoPassagem {
  if (p.pendenteRecebimento) return "pendente";
  if (p.mantidoAberto) return "mantido-aberto";
  return p.emCurso ? "em-curso" : "concluida";
}

export const ROTULO_SITUACAO: Record<SituacaoPassagem, string> = {
  concluida: "Concluída",
  "em-curso": "Em curso",
  pendente: "Aguardando recebimento",
  "mantido-aberto": "Mantido aberto",
};

export function tituloDoDocumento(d: DocumentoDaPassagem): string {
  return d.titulo || d.nrSei || "Documento";
}

const MAX_DOCUMENTOS_NA_DICA = 8;

export function dicaDaPassagem(p: Passagem): Dica {
  const linhas: Dica["linhas"] = [];
  const sit = situacaoDa(p);
  if (sit === "pendente") {
    linhas.push({
      rotulo: "Remetido em",
      valor: `${formatarDataHora(p.recebido)}${p.usuarioEnviou ? ` por ${pessoa(p.usuarioEnviou, p.usuarioEnviouNome)}` : ""}`,
    });
    if (p.origem) linhas.push({ rotulo: "Veio de", valor: p.origem });
    linhas.push({ rotulo: "Situação", valor: "A unidade ainda não abriu o processo" });
  } else {
    linhas.push({
      rotulo: "Recebido em",
      valor: `${formatarDataHora(p.recebido)}${p.usuarioRecebeu ? ` por ${pessoa(p.usuarioRecebeu, p.usuarioRecebeuNome)}` : ""}`,
    });
    if (p.origem) linhas.push({ rotulo: "Veio de", valor: p.origem });
    if (sit === "mantido-aberto" && p.enviouEm) {
      linhas.push({
        rotulo: "Remetido em",
        valor: `${formatarDataHora(p.enviouEm)}${p.usuarioEnviou ? ` por ${pessoa(p.usuarioEnviou, p.usuarioEnviouNome)}` : ""}, mantendo o processo aberto na unidade`,
      });
    } else if (p.remetido) {
      const como = p.fim === "conclusao" ? "Concluído em" : "Remetido em";
      linhas.push({
        rotulo: como,
        valor: `${formatarDataHora(p.remetido)}${p.usuarioEnviou ? ` por ${pessoa(p.usuarioEnviou, p.usuarioEnviouNome)}` : ""}`,
      });
    } else {
      linhas.push({ rotulo: "Situação", valor: "Em curso: ainda está na unidade" });
    }
    if (p.destinos.length) linhas.push({ rotulo: "Para", valor: p.destinos.join(", ") });
    linhas.push({ rotulo: "Duração", valor: `${formatarDuracao(p.duracaoMs)}${p.emCurso ? " até agora" : ""}` });
  }
  const docs = p.documentos.map((d) => `${tituloDoDocumento(d)} - ${formatarDataHora(d.em)}${d.usuario ? ` - ${d.usuario}` : ""}`);
  if (p.assinaturas.length) linhas.push({ rotulo: "Assinaturas", valor: String(p.assinaturas.length) });
  const mostrados = docs.slice(0, MAX_DOCUMENTOS_NA_DICA);
  if (docs.length > mostrados.length) mostrados.push(`e mais ${docs.length - mostrados.length}`);
  return {
    titulo: p.unidadeNome ? `${p.unidade} - ${p.unidadeNome}` : p.unidade,
    selo: ROTULO_SITUACAO[sit],
    linhas,
    ...(docs.length ? { documentos: mostrados } : {}),
  };
}

export function dicaDoDocumento(d: DocumentoDaPassagem, p: Passagem): Dica {
  return {
    titulo: tituloDoDocumento(d),
    linhas: [
      { rotulo: "Gerado em", valor: `${formatarDataHora(d.em)}${d.usuario ? ` por ${d.usuario}` : ""}` },
      { rotulo: "Unidade", valor: p.unidade },
    ],
  };
}

/** Texto para leitor de tela da barra de uma passagem. */
export function rotuloAcessivelDaPassagem(p: Passagem): string {
  const d = dicaDaPassagem(p);
  return [
    `${d.titulo}: ${d.selo}`,
    ...d.linhas.map((l) => `${l.rotulo} ${l.valor}`),
    p.documentos.length ? `${p.documentos.length} documento(s) gerado(s)` : "",
  ]
    .filter(Boolean)
    .join(". ");
}
