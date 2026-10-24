/**
 * A busca incremental dos modais de assuntos e de interessados, sem DOM: espera o usuário parar de digitar, ignora o que
 * for curto demais, cancela a pesquisa anterior (e descarta a resposta que chegar depois de uma mais nova) e devolve o
 * estado que a tela mostra. A pesquisa em si (`pesquisar`) é a do autocompletar do próprio SEI.
 */
import type { ItemLupa } from "@nucleo/formulario/formulario";

export type EstadoDaBusca =
  | { tipo: "ocioso" }
  | { tipo: "curto"; falta: number }
  | { tipo: "pesquisando"; termo: string }
  | { tipo: "resultado"; termo: string; itens: ItemLupa[] }
  | { tipo: "vazio"; termo: string }
  | { tipo: "erro"; termo: string; mensagem: string };

export interface OpcoesPesquisador {
  pesquisar(termo: string, sinal: AbortSignal): Promise<ItemLupa[]>;
  aoMudar(e: EstadoDaBusca): void;
  /** Letras mínimas para pesquisar (o autocompletar do SEI exige 3). */
  minimo?: number;
  /** Espera depois da última tecla. */
  esperaMs?: number;
  /** Mensagem do erro para o usuário. */
  mensagemDeErro?(e: unknown): string;
  /** Para os testes. */
  esperar?(ms: number): Promise<void>;
}

const normalizar = (t: string): string => t.replace(/\s+/g, " ").trim();

export class Pesquisador {
  private versao = 0;
  private controle: AbortController | null = null;
  private readonly minimo: number;
  private readonly esperaMs: number;

  constructor(private readonly o: OpcoesPesquisador) {
    this.minimo = o.minimo ?? 3;
    this.esperaMs = o.esperaMs ?? 350;
  }

  /** O usuário digitou: espera e pesquisa. */
  digitou(texto: string): void {
    const termo = normalizar(texto);
    const v = this.cancelar();
    if (!termo) return this.o.aoMudar({ tipo: "ocioso" });
    if (termo.length < this.minimo) return this.o.aoMudar({ tipo: "curto", falta: this.minimo - termo.length });
    const esperar = this.o.esperar ?? ((ms) => new Promise<void>((r) => setTimeout(r, ms)));
    void esperar(this.esperaMs).then(() => {
      if (v === this.versao) void this.executar(termo, v);
    });
  }

  /** Enter: pesquisa já, sem esperar. */
  agora(texto: string): void {
    const termo = normalizar(texto);
    const v = this.cancelar();
    if (termo.length < this.minimo) return this.o.aoMudar(termo ? { tipo: "curto", falta: this.minimo - termo.length } : { tipo: "ocioso" });
    void this.executar(termo, v);
  }

  /** Tenta a mesma pesquisa de novo (botão "Tentar de novo"). */
  repetir(texto: string): void {
    this.agora(texto);
  }

  parar(): void {
    this.cancelar();
  }

  private cancelar(): number {
    this.controle?.abort();
    this.controle = null;
    return ++this.versao;
  }

  private async executar(termo: string, v: number): Promise<void> {
    const controle = new AbortController();
    this.controle = controle;
    this.o.aoMudar({ tipo: "pesquisando", termo });
    try {
      const itens = await this.o.pesquisar(termo, controle.signal);
      if (v !== this.versao) return;
      this.o.aoMudar(itens.length ? { tipo: "resultado", termo, itens } : { tipo: "vazio", termo });
    } catch (e) {
      if (v !== this.versao || controle.signal.aborted) return;
      this.o.aoMudar({ tipo: "erro", termo, mensagem: this.o.mensagemDeErro?.(e) ?? (e instanceof Error ? e.message : "Não foi possível pesquisar.") });
    }
  }
}
