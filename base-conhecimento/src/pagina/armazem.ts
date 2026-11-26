/**
 * O armazém de Texto Padrão do núcleo para a árvore da unidade, com só o que
 * ele usa da sessão: o HTTP e o link do MENU colhido da tela (`linkDoMenu`).
 * Sem a classe `Sei`, o content script não leva a leitura da árvore de processo
 * (o portão do build confere), e nunca monta URL: colhe o link da tela.
 */

import type { ArmazemTexto } from "@comum/sincronia/controlePagina";
import { criarArmazemTextoPadrao } from "@nucleo/dominio/textoPadrao";
import { linkDoMenu } from "@nucleo/links/links";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { descricaoDoTexto, nomeDoTexto } from "../sincronia/envelope";

/** A tela tem o item "Textos Padrão" no menu? Sem requisição. */
export function armazemNaTela(doc: Document, url: string): boolean {
  try {
    linkDoMenu(paginaDe(doc, url), "texto_padrao_interno_listar");
    return true;
  } catch {
    return false;
  }
}

export function armazemDoTexto(doc: Document, url: string): ArmazemTexto {
  const sessao = { http: criarHttp(url), linkMenu: (acao: string) => linkDoMenu(paginaDe(doc, url), acao) };
  const a = criarArmazemTextoPadrao(sessao, { nome: nomeDoTexto(), descricao: descricaoDoTexto() });
  return {
    ler: () => a.ler(),
    gravar: (h) => a.gravar(h),
    gravarConferindo: (h, c) => a.gravarConferindo(h, c),
    excluir: () => a.excluir(),
    localizar: () => a.localizar(),
  };
}
