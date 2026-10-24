/**
 * A lista de assuntos ou de interessados que o usuário está editando no modal, sem DOM: o que já está no processo, o que
 * foi acrescentado e o que foi retirado. Os itens que OUTRA unidade acrescentou não saem (regra da tela nativa do SEI:
 * "não pode ser removido porque foi adicionado pela unidade X").
 */
import type { ItemLupa } from "@nucleo/formulario/formulario";

export type EstadoDoItem = "atual" | "novo" | "retirado";

export interface LinhaDaLista {
  item: ItemLupa;
  estado: EstadoDoItem;
  /** Sigla da unidade que o acrescentou, quando esta unidade não pode retirá-lo. */
  negadoPor?: string;
}

export class ListaEditavel {
  private readonly atuais: ItemLupa[];
  private readonly novos: ItemLupa[] = [];
  private readonly retirados = new Set<string>();

  constructor(
    atuais: readonly ItemLupa[],
    private readonly negados: ReadonlyMap<string, string> = new Map(),
  ) {
    this.atuais = [...atuais];
  }

  linhas(): LinhaDaLista[] {
    const sigla = (id: string): { negadoPor?: string } => {
      const n = this.negados.get(id);
      return n === undefined ? {} : { negadoPor: n };
    };
    return [
      ...this.atuais.map((item): LinhaDaLista => ({ item, estado: this.retirados.has(item.id) ? "retirado" : "atual", ...sigla(item.id) })),
      ...this.novos.map((item): LinhaDaLista => ({ item, estado: "novo" })),
    ];
  }

  /** O item já está na lista (atual que não foi retirado, ou novo). */
  tem(id: string): boolean {
    return this.novos.some((i) => i.id === id) || (this.atuais.some((i) => i.id === id) && !this.retirados.has(id));
  }

  /** Acrescenta. Um atual que foi retirado volta no lugar dele. Devolve `false` se já estava. */
  adicionar(item: ItemLupa): boolean {
    if (this.tem(item.id)) return false;
    if (this.atuais.some((i) => i.id === item.id)) {
      this.retirados.delete(item.id);
      return true;
    }
    this.novos.push({ id: item.id, texto: item.texto });
    return true;
  }

  /** Retira (ou devolve) um item que já estava no processo. `false` se não existe ou se outra unidade o acrescentou. */
  alternarRetirada(id: string): boolean {
    if (!this.atuais.some((i) => i.id === id) || this.negados.has(id)) return false;
    if (this.retirados.has(id)) this.retirados.delete(id);
    else this.retirados.add(id);
    return true;
  }

  /** Desfaz um item acrescentado agora. */
  removerNovo(id: string): boolean {
    const i = this.novos.findIndex((x) => x.id === id);
    if (i < 0) return false;
    this.novos.splice(i, 1);
    return true;
  }

  /** A lista que vai para o SEI: os atuais que ficam (na ordem do processo) e depois os novos. */
  resultado(): ItemLupa[] {
    return [...this.atuais.filter((i) => !this.retirados.has(i.id)), ...this.novos];
  }

  mudou(): boolean {
    return this.retirados.size > 0 || this.novos.length > 0;
  }

  contagem(): { atuais: number; retirados: number; novos: number } {
    return { atuais: this.atuais.length - this.retirados.size, retirados: this.retirados.size, novos: this.novos.length };
  }
}
