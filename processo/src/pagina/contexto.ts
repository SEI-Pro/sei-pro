/**
 * Tudo o que um painel precisa saber do processo e da tela, num objeto só: a árvore que o quadro já tem
 * (`lerArvore`, sem rede), quem é o usuário, a loja, as opções e as operações de escrita. Os painéis e os
 * modais recebem este contexto; nos testes ele é montado com falsos.
 */
import type { Arvore } from "@nucleo/dominio/arvore";
import { coletarHistoricoDaArvore } from "@nucleo/dominio/historico";
import { type AcoesDoPainel, acoesDoPainel } from "@nucleo/dominio/painelProcesso";
import { type Localizado, lerContexto, Sei } from "@nucleo/sei";
import type { OpcoesHttp, Pagina } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { type ColetorHistorico, obterHistorico } from "../gantt/coleta";
import type { LojaProcesso } from "../modelo/loja";
import type { TipoPainel } from "../modelo/paineis";
import type { NomeFatia } from "../modelo/tipos";
import { type Operacoes, operacoesDe } from "./operacoes";

type Armazenamento = Pick<Storage, "getItem" | "setItem">;

export interface ContextoProcesso {
  /** O quadro da árvore. */
  doc: Document;
  /** A janela de topo (os modais abrem lá, onde cabem). */
  topo: Document;
  arv: Arvore;
  idProcedimento: string;
  protocolo: string;
  host: string;
  /** Login em minúsculas; vazio quando a tela de topo não o mostra (então não há cache). */
  login: string;
  unidade: { id: string; sigla: string };
  sigiloso: boolean;
  acoes: AcoesDoPainel;
  loja: LojaProcesso;
  habilitados: ReadonlySet<TipoPainel>;
  armazenamento: Armazenamento;
  /** `disablequery`: o usuário desligou as consultas além do que a tela já traz. */
  consultasDesativadas: boolean;
  reaberturaProgramada: boolean;
  /** Marca de trancamento só existe no Lab (legado: NAMESPACE_SPRO). */
  usaTrancado: boolean;
  agora(): Date;
  op: Operacoes;
  /** Refaz a leitura de uma fatia (botão "Tentar de novo" e depois de gravar). */
  recarregar(n: NomeFatia): void;
  /** O histórico completo do processo (todas as páginas), pelo núcleo. Nos testes, um falso. */
  coletarHistorico: ColetorHistorico;
  /**
   * Pede a coleta do histórico completo (só por clique: spec 8.2). Devolve `false` se não foi possível. Quem coleta
   * grava a fatia `blocoInterno` e o painel redesenha sozinho. `aoProgresso` recebe “página x de y”.
   */
  aoPedirHistorico(aoProgresso?: (feito: number, total: number) => void): Promise<boolean>;
}

/**
 * O `Sei` do núcleo resolve o processo pela pesquisa rápida do cabeçalho e abre a árvore de novo. Aqui a árvore
 * já está na tela: devolvê-la evita o `procedimento_visualizar`, que, em processo aberto na unidade, pode gravar
 * "Processo recebido" em nome do usuário.
 */
export class SeiDaPagina extends Sei {
  constructor(
    base: string,
    private readonly daTela: () => Arvore,
    paginaViva: () => Pagina | null,
  ) {
    super(base, paginaViva);
  }

  override async arvore(): Promise<Arvore> {
    return this.daTela();
  }

  /**
   * O processo da tela e os documentos dela se resolvem sem a pesquisa rápida (que seria uma requisição a mais, e
   * abriria a árvore de novo). Qualquer outra referência segue o caminho de sempre.
   */
  override async localizar(referencia: string, op?: OpcoesHttp): Promise<Localizado> {
    const arv = this.daTela();
    const ref = referencia.trim();
    const digitos = ref.replace(/\D/g, "");
    if (ref === arv.protocolo) return { idProcedimento: arv.idProcedimento, linkArvore: arv.linkProcesso };
    const d = digitos ? arv.documentos.find((x) => x.numero.replace(/\D/g, "") === digitos) : undefined;
    if (d) return { idProcedimento: arv.idProcedimento, idDocumento: d.id, linkArvore: arv.linkProcesso };
    return super.localizar(referencia, op);
  }
}

export interface DepsContexto {
  doc: Document;
  topo: Document;
  arv: Arvore;
  loja: LojaProcesso;
  host: string;
  login: string;
  unidade: { id: string; sigla: string };
  habilitados: ReadonlySet<TipoPainel>;
  armazenamento: Armazenamento;
  consultasDesativadas: boolean;
  reaberturaProgramada: boolean;
  usaTrancado: boolean;
  recarregar: (n: NomeFatia) => void;
  /** Para testes: operações falsas. */
  op?: Operacoes;
  agora?: () => Date;
  coletarHistorico?: ColetorHistorico;
  aoPedirHistorico?: ContextoProcesso["aoPedirHistorico"];
}

export function escopoDoUsuario(host: string, login: string): string {
  return `${host}|${login}`;
}

/** Lê usuário e unidade do cabeçalho do topo (o quadro da árvore não os tem). */
export function lerUsuarioEUnidade(topo: Document): { host: string; login: string; unidade: { id: string; sigla: string } } {
  const c = lerContexto(paginaDe(topo));
  return { host: c.host, login: c.usuario.login.toLowerCase(), unidade: { id: c.unidade.id, sigla: c.unidade.sigla } };
}

export function criarContexto(d: DepsContexto): ContextoProcesso {
  const sei = new SeiDaPagina(
    d.doc.location?.href ?? "https://sei.invalido/sei/controlador.php",
    () => d.arv,
    () => paginaDe(d.topo),
  );
  const ctx: ContextoProcesso = {
    doc: d.doc,
    topo: d.topo,
    arv: d.arv,
    idProcedimento: d.arv.idProcedimento,
    protocolo: d.arv.protocolo,
    host: d.host,
    login: d.login,
    unidade: d.unidade,
    sigiloso: d.arv.nivel === "sigiloso",
    acoes: acoesDoPainel(d.arv),
    loja: d.loja,
    habilitados: d.habilitados,
    armazenamento: d.armazenamento,
    consultasDesativadas: d.consultasDesativadas,
    reaberturaProgramada: d.reaberturaProgramada,
    usaTrancado: d.usaTrancado,
    agora: d.agora ?? (() => new Date()),
    op: d.op ?? operacoesDe(sei, d.arv, d.loja),
    recarregar: d.recarregar,
    coletarHistorico: d.coletarHistorico ?? ((o) => coletarHistoricoDaArvore(sei, d.arv, o)),
    aoPedirHistorico: async () => false,
  };
  ctx.aoPedirHistorico =
    d.aoPedirHistorico ??
    (async (aoProgresso) => {
      try {
        await obterHistorico(ctx, aoProgresso ? { aoProgresso } : {});
        return true;
      } catch {
        return false;
      }
    });
  return ctx;
}
