/**
 * Convenção de toda operação de escrita do núcleo.
 *
 * A MESMA função calcula a prévia e grava: com `aplicar: false` ela abre a
 * tela, lê o estado atual e devolve o "antes → depois" sem enviar nada; com
 * `aplicar: true` segue até o POST e a prova de sucesso. Ter um caminho só é
 * o que garante que a prévia mostrada ao usuário é exatamente o que será
 * gravado — duas funções divergiriam com o tempo.
 */

import { decodificarEntidades } from "../sessao/dom";
import type { Formulario } from "../formulario/formulario";
import type { Sei } from "../sei";

export interface OpcoesEscrita {
  aplicar: boolean;
  sinal?: AbortSignal;
}

export interface ResultadoEscrita {
  /** Protocolo do processo ou nº SEI do documento afetado. */
  alvo: string;
  /** Campo a campo, o que muda. Vazio quando nada mudaria. */
  mudancas: Array<{ campo: string; antes: string; depois: string }>;
  aplicado: boolean;
  /** Mensagem curta para humanos (e para o modelo). */
  resumo: string;
  /** Dados extras (ex.: número do documento criado). */
  dados?: Record<string, string>;
}

export function mudanca(campo: string, antes: string | undefined, depois: string | undefined): ResultadoEscrita["mudancas"] {
  const a = (antes ?? "").trim();
  const d = (depois ?? "").trim();
  return depois === undefined || a === d ? [] : [{ campo, antes: a, depois: d }];
}

export const NIVEIS: Record<string, string> = { publico: "0", restrito: "1" };
export const NOME_NIVEL: Record<string, string> = { "0": "P\u00FAblico", "1": "Restrito", "2": "Sigiloso" };

/**
 * Hipóteses legais de uma tela de nível de acesso (processo ou documento).
 *
 * O `<select>` da hipótese nasce VAZIO no HTML: a tela só o preenche por AJAX
 * quando o usuário marca "Restrito" (`infraAjaxMontarSelect` apontando para
 * `hipotese_legal_select_nome_base_legal`). Ler apenas o HTML devolveria lista
 * vazia — então, quando a tela declara esse AJAX, é ele quem responde, pelo
 * link que a própria página assinou. `nivel`: "1" restrito, "2" sigiloso.
 */
export async function hipotesesDoFormulario(sei: Sei, form: Formulario, nivel: string, sinal?: AbortSignal): Promise<Array<{ id: string; texto: string }>> {
  const ajax = /controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(form.pagina.html)?.[0];
  if (!ajax) return form.opcoes("selHipoteseLegal").filter((o) => o.valor !== "null").map((o) => ({ id: o.valor, texto: o.texto }));
  return sei.ajax(decodificarEntidades(ajax), [
    ["primeiroItemValor", "null"],
    ["primeiroItemDescricao", " "],
    ["valorItemSelecionado", ""],
    ["staNivelAcesso", nivel],
  ], { sinal });
}
