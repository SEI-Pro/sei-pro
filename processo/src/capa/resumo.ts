/**
 * O texto do botão "Copiar resumo" da capa: número, tipo, interessados, situação, unidade atual, dias na unidade e
 * contagem de documentos. Processo sigiloso: só o número (nada de tipo, interessados ou contagem).
 */

export interface ContagemDocumentos {
  total: number;
  internos: number;
  externos: number;
  assinados: number;
  cancelados: number;
}

export interface DadosDoResumo {
  protocolo: string;
  sigiloso: boolean;
  tipo?: string;
  interessados?: readonly string[];
  /** Onde o processo está aberto, na frase do SEI ("Processo aberto somente na unidade TESTE."). */
  situacao?: string;
  /** Sigla da unidade do usuário. */
  unidade?: string;
  diasNaUnidade?: number | null;
  documentos?: ContagemDocumentos;
}

/**
 * A frase do SEI sobre onde o processo está aberto traz uma unidade por linha ("Processo aberto nas unidades:\nA\nB"):
 * numa linha só, as unidades separadas por vírgula.
 */
export function situacaoEmUmaLinha(texto: string | undefined): string {
  const linhas = (texto ?? "")
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (!linhas.length) return "";
  const [primeira = "", ...resto] = linhas;
  const junto = resto.length ? `${primeira}${primeira.endsWith(":") ? " " : ", "}${resto.join(", ")}` : primeira;
  return junto.replace(/\.$/, "");
}

const plural = (n: number, um: string, varios: string): string => `${n} ${n === 1 ? um : varios}`;

export function resumoDoProcesso(d: DadosDoResumo): string {
  if (d.sigiloso) return d.protocolo;
  const linhas = [`Processo ${d.protocolo}`];
  if (d.tipo) linhas.push(`Tipo: ${d.tipo}`);
  const interessados = (d.interessados ?? []).filter(Boolean);
  if (interessados.length) linhas.push(`${interessados.length > 1 ? "Interessados" : "Interessado"}: ${interessados.join("; ")}`);
  const situacao = situacaoEmUmaLinha(d.situacao);
  if (situacao) linhas.push(`Situação: ${situacao}`);
  if (d.unidade) {
    const dias = d.diasNaUnidade;
    linhas.push(`Unidade atual: ${d.unidade}${typeof dias === "number" ? ` (${plural(dias, "dia", "dias")} na unidade)` : ""}`);
  }
  const c = d.documentos;
  if (c) {
    linhas.push(
      `Documentos: ${c.total} (${plural(c.internos, "interno", "internos")}, ${plural(c.externos, "externo", "externos")}; ` +
        `${plural(c.assinados, "assinado", "assinados")}; ${plural(c.cancelados, "cancelado", "cancelados")})`,
    );
  }
  return linhas.join("\n");
}
