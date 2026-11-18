/**
 * Gasto da conversa: quanto custou e com quais modelos.
 *
 * Mais de um motor gasta numa mesma conversa: o principal, cada agente
 * auxiliar (`delegar`, que tem motor próprio) e o principal de novo quando é
 * recriado no meio do caminho (troca de configuração, sessão restaurada).
 * Cada um informa o ACUMULADO dele, desde que nasceu. Atribuir o acumulado do
 * principal apagava o dos auxiliares, e somar os acumulados dos auxiliares
 * contava cada passo de novo (relato da 2.9). Aqui cada motor é uma `fonte`
 * que entra só pela diferença desde o último informe.
 */

import type { Uso } from "../motor/tipos";

export const USO_ZERO: Uso = { entrada: 0, saida: 0, custo: 0 };

function combinar(a: Uso, b: Uso, sinal: 1 | -1): Uso {
  return {
    entrada: a.entrada + sinal * b.entrada,
    saida: a.saida + sinal * b.saida,
    custo: a.custo + sinal * b.custo,
    cache: (a.cache ?? 0) + sinal * (b.cache ?? 0),
  };
}

/** Modelos guardados com a conversa; o que vier do arquivo sincronizado pode estar torto. */
export function modelosDaConversa(x: unknown): string[] {
  return Array.isArray(x) ? x.filter((m): m is string => typeof m === "string" && m.trim() !== "") : [];
}

export class ContadorDeUso {
  private soma: Uso = { ...USO_ZERO };
  private usados: string[] = [];

  get total(): Uso {
    return { ...this.soma };
  }

  /** Na ordem em que foram usados, sem repetir. */
  get modelos(): string[] {
    return [...this.usados];
  }

  /** Conversa nova (zerada) ou restaurada da sessão (com o gasto que já tinha). */
  recomecar(uso: Uso = USO_ZERO, modelos: string[] = []): void {
    this.soma = { ...USO_ZERO, ...uso };
    this.usados = modelosDaConversa(modelos);
  }

  /** Um motor novo: devolve a função que recebe o acumulado DELE. */
  fonte(): (acumulado: Uso) => void {
    let ultimo: Uso = { ...USO_ZERO };
    return (acumulado) => {
      this.soma = combinar(this.soma, combinar(acumulado, ultimo, -1), 1);
      ultimo = { ...acumulado };
    };
  }

  anotarModelo(modelo: string | undefined): void {
    const m = modelo?.trim();
    if (m && !this.usados.includes(m)) this.usados.push(m);
  }
}

/**
 * Os modelos para a linha da lista: sem o prefixo do provedor do OpenRouter
 * ("anthropic/claude-sonnet-5" vira "claude-sonnet-5"); o nome inteiro vai no title.
 */
export function modelosCurtos(modelos: string[] | undefined): string {
  return modelosDaConversa(modelos)
    .map((m) => m.slice(m.lastIndexOf("/") + 1))
    .join(", ");
}
