/**
 * Passagens do processo por unidade, calculadas a partir dos andamentos.
 *
 * Uma passagem é o intervalo em que o processo ficou aberto numa unidade: começa quando a unidade recebe (ou gera, ou
 * reabre) e termina quando ela remete ou conclui. É o que o Gantt desenha e o que os cards da capa somam. Função pura:
 * nada de rede, nada de DOM, e o relógio entra por parâmetro.
 *
 * Como o SEI escreve o histórico (conferido em processos reais do SEI SP 4.1.5, com remessa múltipla, reabertura e
 * conclusão): a linha "Processo remetido pela unidade S" fica na unidade DESTINO (coluna Unidade) e cita a unidade
 * que enviou (S, no texto e no `title` do link), com o usuário que enviou. Por isso a passagem de S termina na
 * primeira linha que cita S depois da entrada, e o destino aparece na coluna Unidade dessa linha.
 *
 * Regras (spec 5.6):
 * - começa em "Processo recebido na unidade", "Processo ... gerado" (a primeira) ou "Reabertura do processo na unidade";
 * - termina na primeira remessa que cita a unidade depois da entrada, ou em "Conclusão do processo na unidade";
 * - sem fim = em curso;
 * - a mesma unidade pode ter várias passagens (reabertura, retorno); nunca duas ao mesmo tempo;
 * - remessa para várias unidades: as linhas do mesmo envio (até 2 minutos de diferença, porque o envio cruza a virada
 *   do minuto) entram como destinos da mesma passagem;
 * - unidade = nome quando o histórico o informa (o `title` do link da sigla), senão a sigla. A sigla sozinha mistura
 *   unidades de mesma sigla;
 * - sem conversão de fuso: o horário do histórico é o relógio do servidor do SEI e as datas daqui são esse relógio
 *   escrito como UTC (assim a duração é a diferença do relógio, sem horário de verão nem fuso do computador).
 *
 * Divergência do legado (`getGanttHistoryProc`): um processo remetido a uma unidade que ainda não o abriu (sem
 * "Processo recebido na unidade") vira passagem em curso com `pendenteRecebimento`, porque é onde ele está.
 *
 * Substitui no legado: `getGanttHistoryProc` (a parte de cálculo, que usava jmespath e comparava só a sigla).
 */

import type { Andamento } from "./historico";

/** Todos os textos do histórico que o cálculo reconhece. Strings fixas do SEI 4.1.5 e 5.0.4; comparadas sem acento nem caixa. */
export const ROTULOS = {
  gerado: ["Processo p\u00FAblico gerado", "Processo restrito gerado", "Processo sigiloso gerado"],
  recebido: "Processo recebido na unidade",
  remetidoPrefixo: "Processo remetido pela unidade",
  reabertura: "Reabertura do processo na unidade",
  conclusao: "Conclus\u00E3o do processo na unidade",
  documentoGerado: "Gerado documento",
  documentoAssinado: "Assinado Documento",
} as const;

/** Envio para várias unidades: linhas do mesmo envio podem cair em minutos vizinhos. */
export const JANELA_REMESSA_MS = 2 * 60 * 1000;

export interface DocumentoDaPassagem {
  /** Número SEI (o texto do link do histórico). */
  nrSei?: string;
  /** Só nos documentos que ainda existem (o link de um documento excluído não leva a lugar nenhum). */
  idDocumento?: string;
  em: Date;
  /** "0105132 (Despacho)": a descrição sem o rótulo. */
  titulo: string;
  usuario?: string;
}

export type InicioPassagem = "gerado" | "recebido" | "reabertura" | "remessa";
export type FimPassagem = "remessa" | "conclusao";

export interface Passagem {
  unidade: string;
  unidadeNome?: string;
  /** O histórico não traz o id da unidade; reservado para quando o HTML o fornecer. */
  unidadeId?: string;
  /** Identidade da unidade (raia do Gantt): nome sem acento ou, sem nome, a sigla. */
  chave: string;
  recebido: Date;
  remetido: Date | null;
  emCurso: boolean;
  /** Fim (ou `agora`, se em curso) menos o início, em milissegundos, nunca negativo. */
  duracaoMs: number;
  inicio: InicioPassagem;
  fim: FimPassagem | null;
  /** Quando a remessa que trouxe o processo foi registrada (antes do "recebido"), se houver. */
  chegouEm?: Date;
  /** Sigla da unidade que enviou o processo a esta. */
  origem?: string;
  /** Siglas das unidades para onde esta passagem remeteu (remessa múltipla = várias). */
  destinos: string[];
  /** Remetido a uma unidade que ainda não abriu o processo. */
  pendenteRecebimento?: boolean;
  /**
   * A unidade remeteu o processo mas o SEI o mantém aberto nela (a linha vem como `andamentoAberto`): a passagem segue em
   * curso, `remetido` fica nulo e `enviouEm` guarda quando foi a remessa (os `destinos` continuam valendo).
   */
  mantidoAberto?: boolean;
  enviouEm?: Date;
  documentos: DocumentoDaPassagem[];
  assinaturas: DocumentoDaPassagem[];
  usuarioRecebeu?: string;
  usuarioRecebeuNome?: string;
  usuarioEnviou?: string;
  usuarioEnviouNome?: string;
}

/** Sem acento, sem caixa, espaços únicos. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const comeca = (descricaoNorm: string, rotulo: string): boolean => descricaoNorm.startsWith(norm(rotulo));

/** "dd/mm/aaaa hh:mm" do SEI -> "aaaa-mm-ddThh:mm:00". Sem fuso, sem conversão. Texto fora do formato: "". */
export function dataISODe(texto: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(texto.trim());
  if (!m) return "";
  return `${m[3]}-${m[2]}-${m[1]}T${m[4].padStart(2, "0")}:${m[5]}:00`;
}

/** O relógio escrito no ISO, como `Date` em UTC (a hora marcada vira o `getUTCHours`). Inválido: `null`. */
export function relogioDoISO(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(iso)) return null;
  const d = new Date(`${iso.length === 16 ? `${iso}:00` : iso}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** O relógio de parede de um instante real (campos locais do computador), no mesmo formato das datas das passagens. */
export function relogioDe(instante: Date): Date {
  return new Date(Date.UTC(instante.getFullYear(), instante.getMonth(), instante.getDate(), instante.getHours(), instante.getMinutes(), instante.getSeconds()));
}

/** "aaaa-mm-ddThh:mm:ss" de uma data de passagem. */
export function isoDoRelogio(d: Date): string {
  return d.toISOString().slice(0, 19);
}

interface Evento {
  a: Andamento;
  t: Date;
  /** Posição na lista recebida (a lista do SEI vai do mais recente ao mais antigo). */
  i: number;
  d: string;
}

function eventosOrdenados(andamentos: Andamento[]): Evento[] {
  const eventos: Evento[] = [];
  andamentos.forEach((a, i) => {
    const t = relogioDoISO(a.dataISO || dataISODe(a.data));
    if (t) eventos.push({ a, t, i, d: norm(a.descricao) });
  });
  // Mesma hora: a lista vem do mais recente ao mais antigo, então o que está depois na lista aconteceu antes.
  return eventos.sort((x, y) => x.t.getTime() - y.t.getTime() || y.i - x.i);
}

function mesmaSigla(a: string, b: string): boolean {
  return norm(a) === norm(b);
}

/**
 * Mesma unidade, com certeza: a sigla bate e, quando os dois lados trazem o nome (o `title` do link), o nome também.
 * O histórico não traz o id da unidade, então é a melhor identidade que há: só a sigla mistura duas unidades de mesma
 * sigla; só o nome mistura unidades diferentes de mesmo nome (medido: "Chefia de Gabinete" é o nome de cinco unidades de
 * órgãos diferentes, e uma mesma sigla aparece com dois nomes ao longo do histórico).
 */
function mesmaUnidade(p: { unidade: string; unidadeNome?: string }, sigla: string, nome: string | undefined): boolean {
  if (!mesmaSigla(p.unidade, sigla)) return false;
  return !p.unidadeNome || !nome || norm(p.unidadeNome) === norm(nome);
}

/**
 * Dentre `lista`, os da unidade pedida. A sigla identifica; o nome só desempata quando a mesma sigla aparece na lista
 * com dois nomes (duas unidades de mesma sigla). Assim uma unidade que mudou de nome no meio do caminho continua sendo a
 * mesma, e a remessa que cita "GAB" fecha a passagem do "GAB" certo quando há dois.
 */
function daUnidade<T extends { unidade: string; unidadeNome?: string }>(lista: readonly T[], sigla: string, nome: string | undefined): T[] {
  const mesmas = lista.filter((p) => mesmaSigla(p.unidade, sigla));
  const nomes = new Set(mesmas.map((p) => (p.unidadeNome ? norm(p.unidadeNome) : "")).filter(Boolean));
  if (nomes.size <= 1 || !nome) return mesmas;
  const certas = mesmas.filter((p) => mesmaUnidade(p, sigla, nome));
  return certas.length ? certas : mesmas;
}

/**
 * Raia de cada passagem: a sigla. Só quando a mesma sigla teve, ao mesmo tempo, passagens com nomes diferentes (duas
 * unidades de mesma sigla com o processo aberto juntas) a raia passa a ser sigla e nome.
 */
function atribuirChaves(todas: Passagem[], fimDoRelogio: number): void {
  const fim = (p: Passagem) => p.remetido?.getTime() ?? fimDoRelogio;
  const sobrepoe = (x: Passagem, y: Passagem) => x.recebido.getTime() < fim(y) && y.recebido.getTime() < fim(x);
  const porSigla = new Map<string, Passagem[]>();
  for (const p of todas) porSigla.set(norm(p.unidade), [...(porSigla.get(norm(p.unidade)) ?? []), p]);
  for (const [sigla, grupo] of porSigla) {
    const distintas = grupo.some((x) => grupo.some((y) => x.unidadeNome && y.unidadeNome && norm(x.unidadeNome) !== norm(y.unidadeNome) && sobrepoe(x, y)));
    for (const p of grupo) p.chave = distintas && p.unidadeNome ? `${sigla}|${norm(p.unidadeNome)}` : sigla;
  }
}

interface Chegada {
  em: Date;
  unidade: string;
  unidadeNome?: string;
  origem: string;
  usuario: string;
  usuarioNome?: string;
}

function siglaCitada(a: Andamento): string {
  return (a.unidadeCitada || a.descricao.replace(new RegExp(`^${ROTULOS.remetidoPrefixo}`, "i"), "")).trim();
}

function tituloDe(a: Andamento): string {
  const i = a.nrSei ? a.descricao.indexOf(a.nrSei) : -1;
  return (i >= 0 ? a.descricao.slice(i) : a.descricao).trim();
}

/**
 * Passagens do processo, da mais antiga para a mais recente (a ordem de entrada). `andamentos` vem na ordem do SEI
 * (do mais recente ao mais antigo): eventos de datas diferentes valem pela data, os do mesmo minuto pela posição na
 * lista (o que está depois na lista aconteceu antes). `agora` é o instante real de hoje, usado só na duração das
 * passagens em curso.
 */
export function calcularPassagens(andamentos: Andamento[], agora: Date): Passagem[] {
  const eventos = eventosOrdenados(andamentos);
  const todas: Passagem[] = [];
  const abertas: Passagem[] = [];
  const chegadas: Chegada[] = [];
  const docs: Array<{ ev: Evento; assinado: boolean }> = [];

  const aberta = (sigla: string, nome: string | undefined) => daUnidade(abertas, sigla, nome)[0];
  const chegadaDe = (sigla: string, nome: string | undefined) => {
    const c = daUnidade(chegadas, sigla, nome)[0];
    return c ? chegadas.indexOf(c) : -1;
  };

  const abrir = (ev: Evento, inicio: InicioPassagem) => {
    const { a } = ev;
    if (abertas.some((p) => mesmaUnidade(p, a.unidade, a.unidadeNome))) return; // dois "recebido" seguidos: vale a entrada mais antiga
    const p: Passagem = {
      unidade: a.unidade,
      ...(a.unidadeNome ? { unidadeNome: a.unidadeNome } : {}),
      chave: "",
      recebido: ev.t,
      remetido: null,
      emCurso: true,
      duracaoMs: 0,
      inicio,
      fim: null,
      destinos: [],
      documentos: [],
      assinaturas: [],
      usuarioRecebeu: a.usuario,
      ...(a.usuarioNome ? { usuarioRecebeuNome: a.usuarioNome } : {}),
    };
    const c = chegadaDe(a.unidade, a.unidadeNome);
    if (c >= 0) {
      const [ch] = chegadas.splice(c, 1);
      p.chegouEm = ch.em;
      p.origem = ch.origem;
    }
    abertas.push(p);
    todas.push(p);
  };

  const fechar = (p: Passagem, ev: Evento, fim: FimPassagem) => {
    p.remetido = ev.t;
    p.fim = fim;
    p.usuarioEnviou = ev.a.usuario;
    if (ev.a.usuarioNome) p.usuarioEnviouNome = ev.a.usuarioNome;
    abertas.splice(abertas.indexOf(p), 1);
  };

  // A remessa também é a chegada do processo à unidade da coluna Unidade (que ainda pode não tê-lo aberto).
  const registrarChegada = (ev: Evento) => {
    const { a } = ev;
    if (aberta(a.unidade, a.unidadeNome)) return; // a unidade ja estava com o processo aberto
    const c = chegadaDe(a.unidade, a.unidadeNome);
    const nova: Chegada = {
      em: ev.t,
      unidade: a.unidade,
      ...(a.unidadeNome ? { unidadeNome: a.unidadeNome } : {}),
      origem: siglaCitada(a),
      usuario: a.usuario,
      ...(a.usuarioNome ? { usuarioNome: a.usuarioNome } : {}),
    };
    if (c >= 0) chegadas[c] = nova;
    else chegadas.push(nova);
  };

  // A mesma data/hora vale por fases, não só pela posição na lista: o SEI grava o "Processo recebido na unidade" quando a
  // unidade age pela primeira vez, às vezes DEPOIS (id maior) da remessa que ela própria faz no mesmo minuto, e a remessa
  // que traz o processo precisa estar registrada antes de a unidade o receber.
  //   1. chegadas (as remessas); 2. "recebido"; 3. o resto, na ordem da lista (geração, reabertura, conclusão, remessa que fecha).
  for (let g = 0; g < eventos.length; ) {
    let fim = g + 1;
    while (fim < eventos.length && eventos[fim].t.getTime() === eventos[g].t.getTime()) fim += 1;
    const grupo = eventos.slice(g, fim);
    g = fim;
    for (const ev of grupo) if (comeca(ev.d, ROTULOS.remetidoPrefixo)) registrarChegada(ev);
    for (const ev of grupo) if (comeca(ev.d, ROTULOS.recebido)) abrir(ev, "recebido");
    for (const ev of grupo) {
      const { a, d } = ev;
      if (ROTULOS.gerado.some((r) => comeca(d, r))) {
        abrir(ev, "gerado");
      } else if (comeca(d, ROTULOS.reabertura)) {
        abrir(ev, "reabertura");
      } else if (comeca(d, ROTULOS.conclusao)) {
        const p = aberta(a.unidade, a.unidadeNome);
        if (p) fechar(p, ev, "conclusao");
      } else if (comeca(d, ROTULOS.remetidoPrefixo)) {
        const sigla = siglaCitada(a);
        const nome = a.unidadeCitadaNome;
        const p = aberta(sigla, nome);
        if (p) {
          fechar(p, ev, "remessa");
          p.destinos.push(a.unidade);
        } else {
          // Mais uma unidade do mesmo envio (as linhas podem cruzar o minuto): entra nos destinos da passagem que ele fechou.
          const anterior = daUnidade(todas, sigla, nome).at(-1);
          if (anterior?.fim === "remessa" && anterior.remetido && ev.t.getTime() - anterior.remetido.getTime() <= JANELA_REMESSA_MS && !anterior.destinos.includes(a.unidade)) {
            anterior.destinos.push(a.unidade);
          }
        }
      } else if (comeca(d, ROTULOS.documentoGerado)) {
        docs.push({ ev, assinado: false });
      } else if (comeca(d, ROTULOS.documentoAssinado)) {
        docs.push({ ev, assinado: true });
      }
    }
  }

  // Remetido a quem ainda não abriu: o processo está lá.
  for (const c of chegadas) {
    todas.push({
      unidade: c.unidade,
      ...(c.unidadeNome ? { unidadeNome: c.unidadeNome } : {}),
      chave: "",
      recebido: c.em,
      remetido: null,
      emCurso: true,
      duracaoMs: 0,
      inicio: "remessa",
      fim: null,
      chegouEm: c.em,
      origem: c.origem,
      destinos: [],
      pendenteRecebimento: true,
      documentos: [],
      assinaturas: [],
      usuarioEnviou: c.usuario,
      ...(c.usuarioNome ? { usuarioEnviouNome: c.usuarioNome } : {}),
    });
  }

  // Cada documento vai para a passagem da unidade em que o intervalo o contém; se nenhuma contém (a unidade remeteu
  // mantendo o processo aberto e seguiu trabalhando), para a mais recente que já havia começado.
  for (const { ev, assinado } of docs) {
    const { a } = ev;
    const dela = daUnidade(
      todas.filter((p) => !p.pendenteRecebimento && p.recebido.getTime() <= ev.t.getTime()),
      a.unidade,
      a.unidadeNome,
    );
    const alvo = [...dela].reverse().find((p) => p.remetido === null || ev.t.getTime() <= p.remetido.getTime()) ?? dela[dela.length - 1];
    if (!alvo) continue;
    const item: DocumentoDaPassagem = {
      ...(a.nrSei ? { nrSei: a.nrSei } : {}),
      ...(a.idDocumento ? { idDocumento: a.idDocumento } : {}),
      em: ev.t,
      titulo: tituloDe(a),
      ...(a.usuario ? { usuario: a.usuario } : {}),
    };
    (assinado ? alvo.assinaturas : alvo.documentos).push(item);
  }

  todas.sort((x, y) => x.recebido.getTime() - y.recebido.getTime());

  // O SEI marca (andamentoAberto) a última linha de cada unidade que segue com o processo aberto. Se a passagem foi
  // fechada por uma remessa mas o SEI diz que a unidade ainda o tem (remeteu "mantendo o processo aberto"), segue em curso.
  for (const a of andamentos) {
    if (!a.aberto) continue;
    const ultima = daUnidade(
      todas.filter((p) => !p.pendenteRecebimento),
      a.unidade,
      a.unidadeNome,
    ).at(-1);
    if (ultima?.fim === "remessa" && ultima.remetido) {
      ultima.enviouEm = ultima.remetido;
      ultima.remetido = null;
      ultima.fim = null;
      ultima.mantidoAberto = true;
    }
  }

  const fimDoRelogio = relogioDe(agora).getTime();
  for (const p of todas) {
    p.emCurso = p.remetido === null;
    p.duracaoMs = Math.max(0, (p.remetido?.getTime() ?? fimDoRelogio) - p.recebido.getTime());
  }
  atribuirChaves(todas, fimDoRelogio);
  return todas.sort((x, y) => x.recebido.getTime() - y.recebido.getTime());
}
