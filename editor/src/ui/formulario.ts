import type { Filho } from "@comum/ui/dom";
import { formulario, grupo } from "@comum/ui/formulario";

export {
  atualizarValor,
  botaoTexto,
  caixa,
  campoComPrefixo,
  campoComSufixo,
  corCampo,
  criarAbas,
  dica,
  formulario,
  grade,
  grupo,
  intervalo,
  painel,
  previa,
  sincronizarControles,
} from "@comum/ui/formulario";

/** Coluna de grupos do dialogo (o espacamento e a largura vem do kit; o dialogo ja define a largura). */
export function colunaDeFormulario(...filhos: Array<Filho | null>): HTMLElement {
  return formulario(...filhos);
}

/** Rotulo em cima, campo embaixo, em largura total; o rotulo e ligado ao campo pelo `id` (clicar no texto foca o campo). */
export function linhaDeCampo(rotulo: string, campo: HTMLElement, o: { dica?: Filho; opcional?: boolean } = {}): HTMLElement {
  return grupo(rotulo, { para: campo.id || undefined, ...o }, campo);
}
