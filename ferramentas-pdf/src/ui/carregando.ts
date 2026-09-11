/**
 * Indicação de carregamento em botões.
 *
 * REGRA DO PROJETO: todo botão que dispara operação capaz de demorar mostra que
 * está trabalhando. Sem isso, num processo com muitos documentos, a espera é
 * indistinguível de um clique que não funcionou -- e o usuário clica de novo,
 * empilhando requisições.
 *
 * O texto do botão é PRESERVADO e só o ícone vira um indicador girando. Trocar
 * o texto por "Carregando..." muda a largura do botão e desloca o que está ao
 * lado, o que chama mais atenção do que a própria espera.
 *
 * A restauração acontece em `finally`: se a operação falhar, o botão precisa
 * voltar ao normal para o usuário poder tentar de novo. Um botão que fica
 * girando para sempre depois de um erro é pior que nenhum indicador.
 */

import { icone } from "@/ui/dom";

/**
 * Classe do indicador. `fa-spin` é a animação; o resto é do Font Awesome 5.
 *
 * Exportada porque quem RE-AFIRMA o estado ocupado numa sincronização precisa
 * usar exatamente a mesma classe. Duas cópias divergiriam em silêncio: o botão
 * pararia de girar no meio da operação e ninguém veria o defeito num teste que
 * conferisse só uma delas.
 */
export const CLASSE_GIRANDO = "fas fa-spinner fa-spin";

/**
 * Executa `acao` mostrando o botão como ocupado.
 *
 * Devolve o que a ação devolver, e repassa o erro sem engolir -- quem chamou
 * ainda precisa tratá-lo.
 */
export async function comCarregamento<T>(
  botao: HTMLButtonElement | null | undefined,
  acao: () => Promise<T>,
): Promise<T> {
  if (!botao) return acao();

  const original = botao.querySelector("i");
  const classeOriginal = original?.className ?? null;
  const jaDesabilitado = botao.disabled;

  if (original) original.className = CLASSE_GIRANDO;
  else botao.prepend(icone(CLASSE_GIRANDO));
  botao.disabled = true;
  // Leitor de tela: o estado ocupado precisa ser anunciado, não só desenhado.
  botao.setAttribute("aria-busy", "true");

  try {
    return await acao();
  } finally {
    if (original && classeOriginal !== null) original.className = classeOriginal;
    else botao.querySelector("i." + CLASSE_GIRANDO.split(" ").join("."))?.remove();
    botao.disabled = jaDesabilitado;
    botao.removeAttribute("aria-busy");
  }
}
