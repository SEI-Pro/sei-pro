import { type Filho, h, type NomeIcone } from "@comum/ui/dom";
import type { Leitura } from "../../modelo/dados";
import type { TipoPainel } from "../../modelo/paineis";
import type { EstadoFatia, NomeFatia } from "../../modelo/tipos";
import { nota } from "../../ui/estados";
import type { Desenho } from "../../ui/painel";
import { copiarEAvisar } from "../comum";
import type { ContextoProcesso } from "../contexto";

export interface DefPainel {
  tipo: TipoPainel;
  titulo: string;
  icone: NomeIcone;
  /** `null` = o painel não aparece agora (ex.: a barra do processo não oferece a ação). */
  desenhar(ctx: ContextoProcesso): { estado: EstadoFatia | "pronto"; desenho: Desenho } | null;
}

export const fatia = <T>(ctx: ContextoProcesso, n: NomeFatia) => ctx.loja.ler<T>(n);

/** Texto que se copia ao clicar (o legado: "Clique para copiar"). */
export function copiavel(ctx: ContextoProcesso, texto: string, classe = "", ...extras: Filho[]): HTMLElement {
  return h(
    "button",
    {
      type: "button",
      class: `spro-p-copiavel${classe ? ` ${classe}` : ""}`,
      "aria-label": `Copiar: ${texto}`,
      onclick: () => void copiarEAvisar(ctx, texto),
    },
    texto,
    ...extras,
  );
}

export function notaIndisponivel(motivo: "acao" | "consultas", assunto: string): HTMLElement {
  return nota(
    motivo === "consultas"
      ? `${assunto}: as consultas adicionais estão desativadas nas opções do SEI Pro.`
      : `${assunto} não está disponível: o processo não está aberto na sua unidade.`,
  );
}

/** `Leitura` indisponível vira nota (ou nada); disponível devolve o valor. */
export function valorDe<T>(l: Leitura<T>): { valor: T } | { nota: "acao" | "consultas" } {
  return l.disponivel ? { valor: l.valor } : { nota: l.motivo };
}

export const linha = (...filhos: Filho[]): HTMLElement => h("div", { class: "spro-p-linha" }, ...filhos);
