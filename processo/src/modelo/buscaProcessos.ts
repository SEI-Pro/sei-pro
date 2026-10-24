/**
 * A lista de processos de um interessado, sem DOM: carrega a primeira página, acrescenta as seguintes por pedido
 * ("Mais resultados"), recomeça quando o filtro muda (descartando o que ainda estiver a caminho) e nunca repete um
 * processo que apareça em duas páginas.
 */
import type { PaginaDeProcessos, ResultadoPesquisa } from "@nucleo/dominio/pesquisa";

export interface EstadoDaLista {
  /** Há uma página a caminho. */
  carregando: boolean;
  /** A mensagem do último erro (a lista que já veio fica). */
  erro: string | null;
  processos: ResultadoPesquisa[];
  /** Total que o SEI informou; null antes da primeira resposta. */
  total: number | null;
  /** Já veio tudo (ou a pesquisa não achou nada). */
  completa: boolean;
  /** A pesquisa terminou e não achou nenhum processo. */
  vazia: boolean;
}

export const LISTA_INICIAL: Readonly<EstadoDaLista> = Object.freeze({
  carregando: false,
  erro: null,
  processos: [],
  total: null,
  completa: false,
  vazia: false,
});

const chaveDe = (p: ResultadoPesquisa): string => p.idProcedimento ?? p.protocolo;

export class BuscaDeProcessos {
  private estado: EstadoDaLista = { ...LISTA_INICIAL };
  private versao = 0;
  private controle: AbortController | null = null;

  constructor(
    private readonly buscar: (inicio: number, sinal: AbortSignal) => Promise<PaginaDeProcessos>,
    private readonly aoMudar: (e: EstadoDaLista) => void,
    private readonly mensagemDeErro: (e: unknown) => string = (e) => (e instanceof Error ? e.message : "Não foi possível pesquisar."),
  ) {}

  atual(): EstadoDaLista {
    return this.estado;
  }

  /** Recomeça do zero (primeira abertura, mudança de filtro, "Tentar de novo" sem lista). */
  iniciar(): void {
    this.controle?.abort();
    const v = ++this.versao;
    this.publicar({ ...LISTA_INICIAL, carregando: true });
    void this.carregar(0, v, []);
  }

  /** Pede a próxima página e a soma à lista. */
  mais(): void {
    const e = this.estado;
    if (e.carregando || e.completa || e.total === null) return;
    const v = ++this.versao;
    this.controle?.abort();
    this.publicar({ ...e, carregando: true, erro: null });
    void this.carregar(e.processos.length, v, e.processos);
  }

  /** Repete o que falhou: a primeira página se nada veio, senão a próxima. */
  repetir(): void {
    if (this.estado.total === null || !this.estado.processos.length) this.iniciar();
    else this.mais();
  }

  parar(): void {
    this.controle?.abort();
    this.versao += 1;
  }

  private publicar(e: EstadoDaLista): void {
    this.estado = e;
    this.aoMudar(e);
  }

  private async carregar(inicio: number, v: number, anteriores: ResultadoPesquisa[]): Promise<void> {
    const controle = new AbortController();
    this.controle = controle;
    try {
      const pg = await this.buscar(inicio, controle.signal);
      if (v !== this.versao) return;
      const vistos = new Set(anteriores.map(chaveDe));
      const processos = [...anteriores, ...pg.processos.filter((p) => !vistos.has(chaveDe(p)))];
      this.publicar({
        carregando: false,
        erro: null,
        processos,
        total: pg.total,
        // Sem página nova (ou nenhuma que acrescente) não há o que pedir depois: evita pedir para sempre.
        completa: processos.length >= pg.total || pg.processos.length === 0,
        vazia: processos.length === 0,
      });
    } catch (e) {
      if (v !== this.versao || controle.signal.aborted) return;
      this.publicar({ ...this.estado, carregando: false, erro: this.mensagemDeErro(e) });
    }
  }
}
